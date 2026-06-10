const body = document.body;
const header = document.getElementById("siteHeader");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const dashboard = document.querySelector("[data-skill-dashboard]");
const profileStage = document.getElementById("profileStage");
const typedText = document.getElementById("typedText");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const roles = [
  "Python Developer",
  "Frontend Learner",
  "Problem Solver",
  "Hackathon Participant"
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function closeMobileNav() {
  body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

revealItems.forEach((item, index) => {
  if (item.classList.contains("stagger")) {
    item.style.setProperty("--stagger", index % 5);
  }
  if (!item.classList.contains("in-view")) {
    revealObserver.observe(item);
  }
});

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.45 });

sections.forEach((section) => activeObserver.observe(section));

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.28 });

document.querySelectorAll(".timeline").forEach((timeline) => timelineObserver.observe(timeline));

function animateSkills() {
  if (!dashboard || dashboard.dataset.animated === "true") return;
  dashboard.dataset.animated = "true";
  const duration = prefersReducedMotion ? 1 : 1350;
  const start = performance.now();
  const skillItems = [...dashboard.querySelectorAll(".skill-radial")];

  function step(now) {
    const eased = 1 - Math.pow(1 - clamp((now - start) / duration, 0, 1), 3);
    skillItems.forEach((item) => {
      const finalValue = Number(item.dataset.value);
      const value = Math.round(finalValue * eased);
      item.style.setProperty("--progress", value);
      item.querySelector(".skill-percent").textContent = `${value}%`;
    });

    if (eased < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

if (dashboard) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkills();
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.32 });
  skillObserver.observe(dashboard);
}

function runTypingEffect() {
  if (!typedText) return;
  let roleIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  function tick() {
    const role = roles[roleIndex];
    typedText.textContent = role.slice(0, letterIndex);

    if (!deleting && letterIndex < role.length) {
      letterIndex += 1;
      setTimeout(tick, prefersReducedMotion ? 0 : 68);
      return;
    }

    if (!deleting && letterIndex === role.length) {
      deleting = true;
      setTimeout(tick, prefersReducedMotion ? 100 : 1150);
      return;
    }

    if (deleting && letterIndex > 0) {
      letterIndex -= 1;
      setTimeout(tick, prefersReducedMotion ? 0 : 36);
      return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(tick, prefersReducedMotion ? 100 : 260);
  }

  tick();
}

runTypingEffect();

function updateParallax() {
  const scrollY = window.scrollY;
  document.querySelectorAll("[data-parallax]").forEach((element) => {
    const speed = Number(element.dataset.parallax);
    element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
  });

  if (profileStage) {
    const scale = 1 - clamp(scrollY / 1400, 0, 0.18);
    profileStage.style.setProperty("--hero-scale", scale.toFixed(3));
  }
}

function attachTiltEffects() {
  const cards = [...document.querySelectorAll(".tilt-card")];
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion || event.pointerType === "touch") return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = (((y / rect.height) - 0.5) * -10);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

attachTiltEffects();

function attachMagneticButtons() {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion || event.pointerType === "touch") return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
      button.style.transform = `translate(${x}px, ${y - 3}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

attachMagneticButtons();

function setupParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas || prefersReducedMotion) return;
  const context = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.length = 0;

    const count = clamp(Math.floor(width * height / 16000), 32, 86);
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.38 + 0.16
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      context.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 118) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(157, 232, 255, ${(1 - distance / 118) * 0.13})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
}

setupParticles();

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    setHeaderState();
    updateParallax();
    ticking = false;
  });
}

setHeaderState();
updateParallax();
window.addEventListener("scroll", onScroll, { passive: true });
