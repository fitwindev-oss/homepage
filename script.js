document.documentElement.classList.add("js-ready");

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
