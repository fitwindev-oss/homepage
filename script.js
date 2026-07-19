document.documentElement.classList.add("js-ready");

const CAREERS_API_URL = "https://510sbqsow9.execute-api.ap-northeast-2.amazonaws.com";
const DEFAULT_LANGUAGE = "en";
let activeLanguage = DEFAULT_LANGUAGE;
let careerJobs = [];

const koText = {
  "Why FITWIN": "왜 FITWIN인가",
  "Solutions": "솔루션",
  "Technology": "기술",
  "Products": "제품",
  "For Fitness Centers": "피트니스 센터",
  "Careers": "채용",
  "Partnership": "파트너십",
  "Contact": "문의",
  "Become a FITWIN Partner": "FITWIN 파트너 문의",
  "Fit your twin, win your life.": "당신의 트윈을 맞추고, 삶을 이기세요.",
  "The operating intelligence behind the next generation of fitness centers.": "차세대 피트니스 센터를 움직이는 운영 인텔리전스.",
  "Move beyond coaching based on intuition.": "감에 의존하는 코칭을 넘어섭니다.",
  "FITWIN is an AI-powered fitness platform built to understand each member’s physical condition, movement patterns, and exercise disposition.": "FITWIN은 회원의 신체 상태, 움직임 패턴, 운동 성향을 이해하도록 설계된 AI 기반 피트니스 플랫폼입니다.",
  "FITWIN is an AI-powered fitness platform built to understand each member’s physical": "FITWIN은 회원의 신체 상태, 움직임 패턴, 운동 성향을 이해하도록 설계된",
  "condition, movement patterns, and exercise disposition.": "AI 기반 피트니스 플랫폼입니다.",
  "THE PARADOX": "피트니스 산업의 역설",
  "The fitness industry's structural paradox — and why FITWIN exists.": "피트니스 산업의 구조적 역설, 그리고 FITWIN이 필요한 이유.",
  "5-year survival rate": "국내 피트니스 센터",
  "of Korean fitness centers": "5년 생존율",
  "Members per trainer": "트레이너 1명당 회원 수",
  "(unmanageable load)": "(관리 한계 초과)",
  "Avg. gym price growth": "평균 헬스장 가격 상승률",
  "vs. +28.4% CPI (10yr)": "소비자물가 +28.4% 대비 (10년)",
  "Owner": "센터 운영자",
  "High fixed cost · Trainer dependency ·": "높은 고정비 · 트레이너 의존도 ·",
  "No objective KPIs": "객관적 KPI 부재",
  "Trainer": "트레이너",
  "Sales pressure · Overload · Subjective": "영업 압박 · 업무 과부하 · 주관적",
  "coaching limit": "코칭의 한계",
  "Member": "회원",
  "Neglected · No feedback · Early": "방치 · 피드백 부재 · 빠른",
  "dropout": "이탈",
  "ONE PLATFORM": "하나의 플랫폼",
  "One platform. Four solutions.": "하나의 플랫폼. 네 가지 솔루션.",
  "Connected by AI.": "AI로 연결됩니다.",
  "Quad-Modal precision measurement": "4중 모달 정밀 측정",
  "AI fitness management robot": "AI 피트니스 관리 로봇",
  "pHRI rehabilitation robot": "pHRI 재활 로봇",
  "Cloud management platform": "클라우드 관리 플랫폼",
  "Measures physical & disposition data": "신체 및 운동 성향 데이터 측정",
  "Human PD-Twin": "휴먼 PD-Twin",
  "AI engine builds your physical & disposition twin": "AI 엔진이 신체와 성향의 디지털 트윈을 구축",
  "Robot delivers real-time coaching": "로봇이 실시간 코칭 제공",
  "Platform manages retention & revenue": "플랫폼이 유지율과 매출 관리",
  "Data flow: ANALYSIS → PD-Twin Engine → MANAGER · HEYDAY": "데이터 흐름: ANALYSIS → PD-Twin 엔진 → MANAGER · HEYDAY",
  "Core Solutions": "핵심 솔루션",
  "Prototype testing complete": "프로토타입 테스트 완료",
  "Measure what other": "다른 시스템이 보지 못하는 것을",
  "systems can't.": "측정합니다.",
  "Precision biomechanics at 1/1000s resolution.": "1/1000초 해상도의 정밀 바이오메카닉스.",
  "Built to see what the naked eye — and every other system — misses.": "육안과 기존 시스템이 놓치는 움직임까지 포착합니다.",
  "95% biomechanical accuracy": "바이오메카닉스 정확도 95%",
  "1/1000s sync": "1/1000초 동기화",
  "Deep Bio Sensing": "딥 바이오 센싱",
  "F-V profile · RFD": "F-V 프로파일 · RFD",
  "Software prototype complete": "소프트웨어 프로토타입 완료",
  "Your trainers, scaled.": "트레이너의 역량을 확장합니다.",
  "One robot. Every member, personally coached.": "하나의 로봇이 모든 회원에게 개인화 코칭을 제공합니다.",
  "Autonomous navigation, face recognition in 0.3s, and real-time posture feedback — without a trainer present.": "자율주행, 0.3초 얼굴 인식, 실시간 자세 피드백을 트레이너 없이 제공합니다.",
  "LiDAR navigation": "LiDAR 내비게이션",
  "Vision posture AI": "비전 자세 AI",
  "pHRI safe design": "pHRI 안전 설계",
  "Core pHRI technology secured": "핵심 pHRI 기술 확보",
  "The exam a human": "사람의 손으로 표준화하기 어려운",
  "hand can't standardize.": "검사를 구현합니다.",
  "pHRI palpation technology reads deep musculoskeletal movement that vision-based systems simply can't reach.": "pHRI 촉진 기술은 비전 기반 시스템이 닿지 못하는 깊은 근골격 움직임을 읽어냅니다.",
  "pHRI palpation": "pHRI 촉진",
  "3D joint analysis": "3D 관절 분석",
  "Orthopedic protocol": "정형외과 프로토콜",
  "Zero human error": "인적 오류 최소화",
  "Architecture & DB design complete": "아키텍처 및 DB 설계 완료",
  "Everything your gym": "센터가 아는 모든 것을",
  "knows, in one place.": "한곳에 모읍니다.",
  "Every insight. One dashboard.": "모든 인사이트를 하나의 대시보드로.",
  "Churn prediction, AI coaching nudges, and unmanned center management — all connected to each member's PD-Twin.": "이탈 예측, AI 코칭 넛지, 무인 센터 관리가 각 회원의 PD-Twin과 연결됩니다.",
  "AWS cloud-native": "AWS 클라우드 네이티브",
  "Churn prediction": "이탈 예측",
  "8 disposition archetypes": "8가지 운동 성향 유형",
  "Vision AI safety": "비전 AI 안전",
  "The triple win": "트리플 윈",
  "A win for everyone in the room.": "센터 안의 모두가 이기는 구조.",
  "FITWIN aligns the interests of owners, trainers, and members for the first time.": "FITWIN은 운영자, 트레이너, 회원의 이해관계를 처음으로 정렬합니다.",
  "Fitness Center Owner": "피트니스 센터 운영자",
  "For Fitness Centers": "피트니스 센터를 위해",
  "Run leaner.": "더 가볍게 운영하고",
  "Earn more.": "더 많이 벌 수 있게.",
  "Revenue up · Trainer dependency down": "매출은 높이고 · 트레이너 의존도는 낮추고",
  "Unattended hybrid operation": "무인/하이브리드 운영",
  "AI-driven member retention": "AI 기반 회원 유지",
  "For Trainers": "트레이너를 위해",
  "Less admin.": "행정 업무는 줄이고",
  "Better closes.": "상담 전환은 높입니다.",
  "AI-guided consultation script": "AI 기반 상담 스크립트",
  "Higher PT close rate": "PT 전환율 향상",
  "Automated session logging": "세션 기록 자동화",
  "For Members": "회원을 위해",
  "Personalized": "처음부터",
  "from day one.": "개인화됩니다.",
  "Biomechanics-based personal report": "바이오메카닉스 기반 개인 리포트",
  "Motivation tuned to disposition type": "성향 유형에 맞춘 동기부여",
  "Progress that's visible and owned": "눈에 보이고 스스로 관리하는 성장",
  "Build the operating intelligence for the next fitness era.": "다음 피트니스 시대의 운영 인텔리전스를 함께 만듭니다.",
  "Explore open roles at FITWIN and submit your application directly.": "FITWIN의 채용 공고를 확인하고 바로 지원서를 제출하세요.",
  "Open Roles": "채용 공고",
  "Current opportunities": "현재 모집 중인 포지션",
  "Refresh": "새로고침",
  "Loading open roles...": "채용 공고를 불러오는 중입니다...",
  "Apply": "지원",
  "Send your application": "지원서 제출",
  "Role": "지원 포지션",
  "Select a role": "포지션 선택",
  "Name": "이름",
  "Email": "이메일",
  "Phone": "연락처",
  "Resume file": "이력서 파일",
  "(PDF, DOC, DOCX, max 4MB)": "(PDF, DOC, DOCX, 최대 4MB)",
  "Portfolio or resume URL": "포트폴리오 또는 이력서 URL",
  "(Optional)": "(선택)",
  "Message": "메시지",
  "I agree to FITWIN collecting and reviewing my application information for recruitment.": "채용 검토를 위해 FITWIN이 지원 정보를 수집하고 검토하는 데 동의합니다.",
  "Submit application": "지원서 제출",
  "Ready to see FITWIN": "FITWIN을 센터에서",
  "in your center?": "만나볼 준비가 되셨나요?",
  "Join pilot centers launching in Q4 2026. Request an early access demo or partnership inquiry.": "2026년 4분기 파일럿 센터 모집에 함께하세요. 데모 또는 파트너십 문의를 남겨주세요.",
  "Contact": "연락처",
  "Email or phone": "이메일 또는 전화번호",
  "Fitness Center or Organization": "피트니스 센터 또는 기관",
  "Apply for a FITWIN Partnership": "FITWIN 파트너십 신청",
  "FITWIN Co., Ltd.": "주식회사 핏윈",
  "CEO: KEEUNG YOO": "대표: 유기응",
  "Email:": "이메일:",
  "Biz. Reg. No.: 463-87-03553": "사업자등록번호: 463-87-03553",
  "Hosting by FITWIN Co., Ltd.": "호스팅: 주식회사 핏윈",
  "HQ: #213 Glocal Industry-Academy Cooperation Hall, Dankook University, 152 Jukjeon-ro, Suji-gu, Yongin-si, Gyeonggi-do, Republic of Korea (16890)": "본사: 경기도 용인시 수지구 죽전로 152, 단국대학교 글로컬산학협력관 213호 (16890)",
  "© 2026 FITWIN Co., Ltd. All rights reserved.": "© 2026 주식회사 핏윈. All rights reserved.",
  "Your name": "이름",
  "you@example.com": "you@example.com",
  "+82 10-0000-0000": "+82 10-0000-0000",
  "https://...": "https://...",
  "Tell us briefly why you are interested in FITWIN.": "FITWIN에 관심을 갖게 된 이유를 간단히 적어주세요.",
  "Center name": "센터명",
  "FITWIN Careers Admin": "FITWIN 채용 관리자",
  "Back to site": "사이트로 돌아가기",
  "Careers Admin": "채용 관리자",
  "Post a FITWIN job opening": "FITWIN 채용 공고 등록",
  "Enter the admin key, fill the role details, and publish it to the live Careers section.": "관리자 키와 포지션 정보를 입력하면 라이브 Careers 섹션에 공고가 게시됩니다.",
  "Admin key": "관리자 키",
  "Title (English)": "제목 (영문)",
  "Title (Korean)": "제목 (국문)",
  "Department": "부서",
  "Location": "근무지",
  "Employment type": "고용 형태",
  "Status": "상태",
  "Open": "진행 중",
  "Closed": "마감",
  "Summary (English)": "요약 (영문)",
  "Summary (Korean)": "요약 (국문)",
  "Responsibilities (one per line, English)": "주요 업무 (영문, 한 줄에 하나)",
  "Responsibilities (one per line, Korean)": "주요 업무 (국문, 한 줄에 하나)",
  "Requirements (one per line, English)": "자격 요건 (영문, 한 줄에 하나)",
  "Requirements (one per line, Korean)": "자격 요건 (국문, 한 줄에 하나)",
  "Publish job": "공고 게시",
  "Live Roles": "게시된 공고",
  "Published openings": "현재 공개된 공고",
};

const koMeta = {
  title: "FITWIN | 당신의 트윈을 맞추고, 삶을 이기세요",
  description:
    "FITWIN은 각 회원의 신체 상태, 움직임 패턴, 운동 성향을 이해하는 AI 기반 피트니스 플랫폼입니다.",
};

const fallbackJobs = [
  {
    id: "general-application",
    title: "General Application",
    titleKo: "상시 인재 등록",
    department: "FITWIN",
    location: "Yongin, Korea",
    type: "Flexible",
    status: "open",
    summary: "Share your profile with FITWIN. We review strong candidates as new roles open.",
    summaryKo: "FITWIN과 함께하고 싶은 분은 프로필을 남겨주세요. 새로운 포지션이 열릴 때 우선 검토합니다.",
    responsibilities: ["Tell us where you can create impact across AI, robotics, software, operations, or growth."],
    responsibilitiesKo: ["AI, 로보틱스, 소프트웨어, 운영, 성장 영역에서 만들 수 있는 임팩트를 알려주세요."],
    requirements: ["A clear portfolio, resume, or track record related to the role you want to explore."],
    requirementsKo: ["희망 분야와 관련된 명확한 포트폴리오, 이력서 또는 업무 성과."],
  },
];

const joints = {
  head: [180, 64],
  neck: [180, 98],
  clavL: [150, 108],
  clavR: [210, 108],
  elbowL: [132, 152],
  elbowR: [228, 152],
  wristL: [120, 196],
  wristR: [240, 196],
  chest: [180, 140],
  hipC: [180, 208],
  hipL: [160, 212],
  hipR: [200, 212],
  kneeL: [156, 286],
  kneeR: [204, 286],
  ankleL: [154, 356],
  ankleR: [206, 356],
  toeL: [146, 372],
  toeR: [214, 372],
};

const bones = [
  ["neck", "clavL"],
  ["neck", "clavR"],
  ["clavL", "clavR"],
  ["clavL", "elbowL"],
  ["elbowL", "wristL"],
  ["clavR", "elbowR"],
  ["elbowR", "wristR"],
  ["neck", "chest"],
  ["chest", "hipC"],
  ["hipL", "hipR"],
  ["hipC", "hipL"],
  ["hipC", "hipR"],
  ["hipL", "kneeL"],
  ["kneeL", "ankleL"],
  ["ankleL", "toeL"],
  ["hipR", "kneeR"],
  ["kneeR", "ankleR"],
  ["ankleR", "toeR"],
];

const nodeNames = [
  "neck",
  "clavL",
  "clavR",
  "elbowL",
  "elbowR",
  "wristL",
  "wristR",
  "chest",
  "hipC",
  "hipL",
  "hipR",
  "kneeL",
  "kneeR",
  "ankleL",
  "ankleR",
];

const svgNamespace = "http://www.w3.org/2000/svg";

function makeLine(from, to, className, dx = 0, dy = 0) {
  const line = document.createElementNS(svgNamespace, "line");
  line.setAttribute("x1", joints[from][0] + dx);
  line.setAttribute("y1", joints[from][1] + dy);
  line.setAttribute("x2", joints[to][0] + dx);
  line.setAttribute("y2", joints[to][1] + dy);
  line.setAttribute("class", className);
  return line;
}

const twinGroup = document.querySelector("#twin");
const boneGroup = document.querySelector("#bones");
const nodeGroup = document.querySelector("#nodes");

if (twinGroup && boneGroup && nodeGroup) {
  bones.forEach(([from, to]) => twinGroup.appendChild(makeLine(from, to, "twin-bone", 9, 6)));
  bones.forEach(([from, to]) => boneGroup.appendChild(makeLine(from, to, "bone")));

  nodeNames.forEach((name, index) => {
    const node = document.createElementNS(svgNamespace, "circle");
    node.setAttribute("cx", joints[name][0]);
    node.setAttribute("cy", joints[name][1]);
    node.setAttribute("r", 3.4);
    node.setAttribute("class", "node");
    node.style.animationDelay = `${index * 0.16}s`;
    nodeGroup.appendChild(node);
  });

  const headRing = document.createElementNS(svgNamespace, "circle");
  headRing.setAttribute("cx", joints.head[0]);
  headRing.setAttribute("cy", joints.head[1]);
  headRing.setAttribute("r", 15);
  headRing.setAttribute("class", "head-ring");
  nodeGroup.appendChild(headRing);
}

const nav = document.querySelector("#nav");
function updateNav() {
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }
}

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

const revealElements = document.querySelectorAll(".r");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in"));
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "FITWIN partnership request is ready to connect to your email or CRM.";
    }
  });
}

const notifyButton = document.querySelector("#notify-button");

if (notifyButton) {
  notifyButton.addEventListener("click", () => {
    const input = document.querySelector("#notify-email");
    const message = document.querySelector("#notify-message");

    if (!input || !message) {
      return;
    }

    const email = input.value.trim();

    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      message.textContent = "Your launch notification request has been received.";
      message.style.color = "var(--lime-dim)";
      input.value = "";
    } else {
      message.textContent = "Please enter a valid email address.";
      message.style.color = "#e6a23c";
    }
  });
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translateValue(original, language) {
  if (language !== "ko") {
    return original;
  }
  return koText[normalizeText(original)] || original;
}

function translateTextNodes(root, language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (!node.__fitwinOriginalText) {
      node.__fitwinOriginalText = node.textContent;
    }
    const original = node.__fitwinOriginalText;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const translated = translateValue(original, language);
    node.textContent = translated === original ? original : `${leading}${translated}${trailing}`;
  });
}

function translateAttributes(root, language) {
  root.querySelectorAll("[placeholder], [aria-label], [alt], [title]").forEach((element) => {
    ["placeholder", "aria-label", "alt", "title"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) {
        return;
      }
      const storageKey = `original${attribute.replace(/(^|-)([a-z])/g, (_, _dash, chr) => chr.toUpperCase())}`;
      if (!element.dataset[storageKey]) {
        element.dataset[storageKey] = element.getAttribute(attribute) || "";
      }
      element.setAttribute(attribute, translateValue(element.dataset[storageKey], language));
    });
  });
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");
  if (requested === "ko" || requested === "en") {
    return requested;
  }
  const stored = window.localStorage.getItem("fitwin-language");
  return stored === "ko" ? "ko" : DEFAULT_LANGUAGE;
}

function applyLanguage(language, options = {}) {
  activeLanguage = language === "ko" ? "ko" : "en";
  const isAdminPage = document.body.classList.contains("admin-page");
  document.documentElement.lang = activeLanguage;
  document.title = isAdminPage
    ? activeLanguage === "ko" ? "FITWIN 채용 관리자" : "FITWIN Careers Admin"
    : activeLanguage === "ko" ? koMeta.title : "FITWIN | Fit your twin, win your life";
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      activeLanguage === "ko"
        ? koMeta.description
        : "FITWIN is an AI-powered fitness platform built to understand each member's physical condition, movement patterns, and exercise disposition.",
    );
  }

  translateTextNodes(document.body, activeLanguage);
  translateAttributes(document.body, activeLanguage);

  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.langSwitch === activeLanguage);
    button.setAttribute("aria-pressed", button.dataset.langSwitch === activeLanguage ? "true" : "false");
  });

  window.localStorage.setItem("fitwin-language", activeLanguage);

  if (!options.skipRender) {
    renderJobs();
  }
}

document.querySelectorAll("[data-lang-switch]").forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langSwitch);
  });
});

function careersApi(path, options = {}) {
  if (!CAREERS_API_URL || CAREERS_API_URL.includes("__CAREERS_API_URL__")) {
    return Promise.reject(new Error("Careers API is not configured."));
  }

  return fetch(`${CAREERS_API_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || "Request failed.");
    }
    return payload;
  });
}

function localizeJob(job, field) {
  if (activeLanguage === "ko") {
    return job[`${field}Ko`] || job[field] || "";
  }
  return job[field] || "";
}

function localizeList(job, field) {
  const value = activeLanguage === "ko" ? job[`${field}Ko`] || job[field] : job[field];
  return Array.isArray(value) ? value : [];
}

function renderJobs() {
  const jobsList = document.querySelector("#jobs-list");
  const jobSelect = document.querySelector('#career-application-form select[name="jobId"]');
  const adminJobsList = document.querySelector("#admin-jobs-list");
  const openJobs = (careerJobs.length ? careerJobs : fallbackJobs).filter((job) => job.status !== "closed");

  if (jobsList) {
    if (!openJobs.length) {
      jobsList.innerHTML = `<p class="career-muted">${activeLanguage === "ko" ? "현재 공개된 채용 공고가 없습니다." : "No open roles are currently published."}</p>`;
    } else {
      jobsList.innerHTML = openJobs.map(renderJobCard).join("");
    }
  }

  if (jobSelect) {
    const selected = jobSelect.value;
    jobSelect.innerHTML = `<option value="">${activeLanguage === "ko" ? "포지션 선택" : "Select a role"}</option>${openJobs
      .map((job) => `<option value="${escapeHtml(job.id)}">${escapeHtml(localizeJob(job, "title"))}</option>`)
      .join("")}`;
    if (openJobs.some((job) => job.id === selected)) {
      jobSelect.value = selected;
    }
  }

  if (adminJobsList) {
    const allJobs = careerJobs.length ? careerJobs : fallbackJobs;
    adminJobsList.innerHTML = allJobs.length
      ? allJobs.map(renderJobCard).join("")
      : `<p class="career-muted">${activeLanguage === "ko" ? "게시된 공고가 없습니다." : "No jobs published yet."}</p>`;
  }
}

function renderJobCard(job) {
  const responsibilities = localizeList(job, "responsibilities");
  const requirements = localizeList(job, "requirements");
  const statusText = job.status === "closed"
    ? activeLanguage === "ko" ? "마감" : "Closed"
    : activeLanguage === "ko" ? "모집 중" : "Open";

  return `
    <article class="job-card">
      <div class="job-card-top">
        <h3 class="job-title">${escapeHtml(localizeJob(job, "title"))}</h3>
        <span class="job-status">${statusText}</span>
      </div>
      <p class="job-meta">
        <span>${escapeHtml(job.department || "FITWIN")}</span>
        <span>${escapeHtml(job.location || "Yongin, Korea")}</span>
        <span>${escapeHtml(job.type || "Full-time")}</span>
      </p>
      <p class="job-summary">${escapeHtml(localizeJob(job, "summary"))}</p>
      <div class="job-details">
        ${responsibilities.length ? `<div><h4>${activeLanguage === "ko" ? "주요 업무" : "Responsibilities"}</h4><ul>${responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
        ${requirements.length ? `<div><h4>${activeLanguage === "ko" ? "자격 요건" : "Requirements"}</h4><ul>${requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
      </div>
      ${job.status === "closed" ? "" : `<button class="career-refresh" type="button" data-apply-job="${escapeHtml(job.id)}">${activeLanguage === "ko" ? "이 포지션 지원" : "Apply for this role"}</button>`}
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadJobs() {
  const targets = [document.querySelector("#jobs-list"), document.querySelector("#admin-jobs-list")].filter(Boolean);
  targets.forEach((target) => {
    target.innerHTML = `<p class="career-muted">${activeLanguage === "ko" ? "채용 공고를 불러오는 중입니다..." : "Loading open roles..."}</p>`;
  });

  try {
    const payload = await careersApi("/jobs");
    careerJobs = Array.isArray(payload.jobs) ? payload.jobs : fallbackJobs;
  } catch (error) {
    careerJobs = fallbackJobs;
  }

  renderJobs();
}

document.addEventListener("click", (event) => {
  const applyButton = event.target.closest("[data-apply-job]");
  if (!applyButton) {
    return;
  }

  const form = document.querySelector("#career-application-form");
  const select = form?.querySelector('select[name="jobId"]');
  if (form && select) {
    select.value = applyButton.dataset.applyJob;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error(activeLanguage === "ko" ? "이력서 파일은 4MB 이하만 업로드할 수 있습니다." : "Resume file must be 4MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the resume file."));
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: result.includes(",") ? result.split(",")[1] : result,
      });
    };
    reader.readAsDataURL(file);
  });
}

const careerApplicationForm = document.querySelector("#career-application-form");

if (careerApplicationForm) {
  careerApplicationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const status = form.querySelector(".career-form-status");
    const submit = form.querySelector(".career-submit");
    status.classList.remove("is-error");
    status.textContent = activeLanguage === "ko" ? "지원서를 제출하는 중입니다..." : "Submitting your application...";
    submit.disabled = true;

    try {
      const data = new FormData(form);
      const resumeFile = await fileToPayload(data.get("resumeFile"));
      const payload = {
        jobId: data.get("jobId"),
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        portfolioUrl: data.get("portfolioUrl"),
        message: data.get("message"),
        consent: data.get("consent") === "on",
        language: activeLanguage,
        resumeFile,
      };
      const result = await careersApi("/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      status.textContent = activeLanguage === "ko"
        ? `지원서가 제출되었습니다. 접수번호: ${result.applicationId}`
        : `Application submitted. Reference: ${result.applicationId}`;
      form.reset();
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = error.message || (activeLanguage === "ko" ? "지원서 제출에 실패했습니다." : "Could not submit your application.");
    } finally {
      submit.disabled = false;
    }
  });
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const jobAdminForm = document.querySelector("#job-admin-form");

if (jobAdminForm) {
  jobAdminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const status = form.querySelector(".career-form-status");
    const submit = form.querySelector(".career-submit");
    const data = new FormData(form);
    const adminKey = data.get("adminKey");
    const jobId = `${String(data.get("title")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
    const payload = {
      id: jobId,
      title: data.get("title"),
      titleKo: data.get("titleKo"),
      department: data.get("department"),
      location: data.get("location"),
      type: data.get("type"),
      status: data.get("status"),
      summary: data.get("summary"),
      summaryKo: data.get("summaryKo"),
      responsibilities: splitLines(data.get("responsibilities")),
      responsibilitiesKo: splitLines(data.get("responsibilitiesKo")),
      requirements: splitLines(data.get("requirements")),
      requirementsKo: splitLines(data.get("requirementsKo")),
    };

    status.classList.remove("is-error");
    status.textContent = "Publishing job...";
    submit.disabled = true;

    try {
      await careersApi("/jobs", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: JSON.stringify(payload),
      });
      status.textContent = "Job published.";
      form.reset();
      await loadJobs();
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = error.message || "Could not publish job.";
    } finally {
      submit.disabled = false;
    }
  });
}

document.querySelector("#refresh-jobs")?.addEventListener("click", loadJobs);
document.querySelector("#admin-refresh-jobs")?.addEventListener("click", loadJobs);

applyLanguage(getInitialLanguage(), { skipRender: true });

if (document.querySelector("#jobs-list") || document.querySelector("#admin-jobs-list")) {
  loadJobs();
}
