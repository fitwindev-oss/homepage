# Careers API

AWS Lambda source for FITWIN homepage Careers features.

Routes:

- `GET /jobs`: list published job openings
- `POST /jobs`: create/update a job opening, protected by `x-admin-key`
- `POST /applications`: submit an application and optional resume file
- `GET /health`: health check

Application records and resume files are stored privately in S3.
