import base64
import json
import logging
import os
import re
import time
import uuid
from datetime import datetime, timezone

import boto3


s3 = boto3.client("s3")
sns = boto3.client("sns")

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

DATA_BUCKET = os.environ["DATA_BUCKET"]
JOBS_KEY = os.environ.get("JOBS_KEY", "jobs/jobs.json")
ADMIN_KEY = os.environ["ADMIN_KEY"]
NOTIFICATION_TOPIC_ARN = os.environ.get("NOTIFICATION_TOPIC_ARN", "")

ALLOWED_ORIGINS = {
    "https://fitwin.ai",
    "https://www.fitwin.ai",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
}


def response(status, body=None, origin=None):
    allow_origin = origin if origin in ALLOWED_ORIGINS else "https://fitwin.ai"
    return {
        "statusCode": status,
        "headers": {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": allow_origin,
            "access-control-allow-methods": "GET,POST,OPTIONS",
            "access-control-allow-headers": "content-type,x-admin-key",
        },
        "body": json.dumps(body or {}, ensure_ascii=False),
    }


def read_json_body(event):
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
      raw = base64.b64decode(raw).decode("utf-8")
    return json.loads(raw)


def load_jobs():
    try:
        obj = s3.get_object(Bucket=DATA_BUCKET, Key=JOBS_KEY)
        payload = json.loads(obj["Body"].read().decode("utf-8"))
        return payload.get("jobs", [])
    except s3.exceptions.NoSuchKey:
        return []


def save_jobs(jobs):
    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "jobs": jobs,
    }
    s3.put_object(
        Bucket=DATA_BUCKET,
        Key=JOBS_KEY,
        Body=json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8"),
        ContentType="application/json; charset=utf-8",
        ServerSideEncryption="AES256",
    )


def clean_list(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return []


def clean_job(payload):
    required = ["id", "title", "titleKo", "department", "location", "type", "summary", "summaryKo"]
    missing = [field for field in required if not str(payload.get(field, "")).strip()]
    if missing:
        raise ValueError("Missing required fields: " + ", ".join(missing))

    status = payload.get("status") if payload.get("status") in {"open", "closed"} else "open"
    now = datetime.now(timezone.utc).isoformat()
    return {
        "id": re.sub(r"[^a-zA-Z0-9_-]+", "-", str(payload["id"]).strip())[:96],
        "title": str(payload["title"]).strip(),
        "titleKo": str(payload["titleKo"]).strip(),
        "department": str(payload["department"]).strip(),
        "location": str(payload["location"]).strip(),
        "type": str(payload["type"]).strip(),
        "status": status,
        "summary": str(payload["summary"]).strip(),
        "summaryKo": str(payload["summaryKo"]).strip(),
        "responsibilities": clean_list(payload.get("responsibilities")),
        "responsibilitiesKo": clean_list(payload.get("responsibilitiesKo")),
        "requirements": clean_list(payload.get("requirements")),
        "requirementsKo": clean_list(payload.get("requirementsKo")),
        "createdAt": payload.get("createdAt") or now,
        "updatedAt": now,
    }


def safe_filename(name):
    base = re.sub(r"[^a-zA-Z0-9._-]+", "-", name or "resume").strip("-")
    return base[:120] or "resume"


def send_application_notification(record):
    if not NOTIFICATION_TOPIC_ARN:
        return

    resume_url = "첨부 없음"
    if record.get("resumeKey"):
        resume_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": DATA_BUCKET, "Key": record["resumeKey"]},
            ExpiresIn=7 * 24 * 60 * 60,
        )

    role = next(
        (
            f"{job.get('titleKo', '')} / {job.get('title', '')}".strip(" / ")
            for job in load_jobs()
            if job.get("id") == record["jobId"]
        ),
        record["jobId"],
    )
    message = "\n".join([
        "FITWIN 홈페이지에 새 지원서가 접수되었습니다.",
        "",
        f"접수번호: {record['applicationId']}",
        f"지원 직무: {role}",
        f"이름: {record['name']}",
        f"이메일: {record['email']}",
        f"연락처: {record['phone'] or '-'}",
        f"포트폴리오 / 이력서 링크: {record['portfolioUrl'] or '-'}",
        f"접수 시각: {record['submittedAt']}",
        "",
        "지원 메시지:",
        record["message"],
        "",
        "첨부 이력서 다운로드 링크 (7일간 유효):",
        resume_url,
    ])
    subject_name = re.sub(r"[\r\n]+", " ", record["name"])[:40]
    sns.publish(
        TopicArn=NOTIFICATION_TOPIC_ARN,
        Subject=f"[FITWIN 채용] 새 지원서 - {subject_name}"[:100],
        Message=message,
    )


def submit_application(payload):
    required = ["jobId", "name", "email", "message"]
    missing = [field for field in required if not str(payload.get(field, "")).strip()]
    if missing:
        raise ValueError("Missing required fields: " + ", ".join(missing))
    if not payload.get("consent"):
        raise ValueError("Consent is required.")
    email = str(payload["email"]).strip()
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        raise ValueError("A valid email is required.")

    now = datetime.now(timezone.utc)
    application_id = f"app-{now.strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:10]}"
    prefix = f"applications/{now.strftime('%Y/%m/%d')}/{application_id}"
    resume = payload.get("resumeFile") or None
    resume_key = None

    if resume:
        raw = base64.b64decode(resume.get("data", ""), validate=True)
        if len(raw) > 4 * 1024 * 1024:
            raise ValueError("Resume file must be 4MB or smaller.")
        filename = safe_filename(resume.get("name"))
        resume_key = f"{prefix}/{filename}"
        s3.put_object(
            Bucket=DATA_BUCKET,
            Key=resume_key,
            Body=raw,
            ContentType=resume.get("type") or "application/octet-stream",
            ServerSideEncryption="AES256",
        )

    record = {
        "applicationId": application_id,
        "jobId": str(payload["jobId"]).strip(),
        "name": str(payload["name"]).strip(),
        "email": email,
        "phone": str(payload.get("phone", "")).strip(),
        "portfolioUrl": str(payload.get("portfolioUrl", "")).strip(),
        "message": str(payload["message"]).strip(),
        "language": str(payload.get("language", "en")).strip(),
        "resumeKey": resume_key,
        "submittedAt": now.isoformat(),
        "userAgent": str(payload.get("userAgent", ""))[:500],
    }

    s3.put_object(
        Bucket=DATA_BUCKET,
        Key=f"{prefix}/application.json",
        Body=json.dumps(record, ensure_ascii=False, indent=2).encode("utf-8"),
        ContentType="application/json; charset=utf-8",
        ServerSideEncryption="AES256",
    )
    try:
        send_application_notification(record)
    except Exception:
        logger.exception("Application stored but notification delivery failed: %s", application_id)
    return application_id


def handler(event, _context):
    headers = {key.lower(): value for key, value in (event.get("headers") or {}).items()}
    origin = headers.get("origin")
    method = event.get("requestContext", {}).get("http", {}).get("method", event.get("httpMethod", "GET"))
    path = event.get("rawPath") or event.get("path", "/")

    if method == "OPTIONS":
        return response(204, origin=origin)

    try:
        if method == "GET" and path.endswith("/jobs"):
            return response(200, {"jobs": load_jobs()}, origin)

        if method == "POST" and path.endswith("/jobs"):
            if headers.get("x-admin-key") != ADMIN_KEY:
                return response(401, {"message": "Invalid admin key."}, origin)
            job = clean_job(read_json_body(event))
            jobs = [existing for existing in load_jobs() if existing.get("id") != job["id"]]
            jobs.insert(0, job)
            save_jobs(jobs)
            return response(200, {"ok": True, "job": job}, origin)

        if method == "POST" and path.endswith("/applications"):
            payload = read_json_body(event)
            payload["userAgent"] = headers.get("user-agent", "")
            application_id = submit_application(payload)
            return response(200, {"ok": True, "applicationId": application_id}, origin)

        if method == "GET" and path.endswith("/health"):
            return response(200, {"ok": True, "ts": int(time.time())}, origin)

        return response(404, {"message": "Not found."}, origin)
    except ValueError as exc:
        return response(400, {"message": str(exc)}, origin)
    except Exception:
        return response(500, {"message": "Server error."}, origin)
