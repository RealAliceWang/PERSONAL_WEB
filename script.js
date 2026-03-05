// Theme management
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  return localStorage.getItem("theme") || "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

applyTheme(getSavedTheme());

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
});

// Galaxy particle background with click-explosion
(function initGalaxy() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let W, H;
  const orbitParticles = [];
  const driftParticles = [];
  const explosions = [];
  const ORBIT_COUNT = 160;
  const DRIFT_COUNT = 90;

  function palette() {
    const d = root.classList.contains("dark");
    return {
      core: d ? [129, 140, 248] : [99, 102, 241],
      ring: d ? [6, 182, 212] : [56, 145, 200],
      star: d ? [200, 210, 255] : [140, 150, 200],
      explode: [
        [129, 140, 248], [6, 182, 212], [167, 139, 250],
        [99, 102, 241], [56, 189, 248], [196, 181, 253]
      ],
      glowAlpha: d ? 0.12 : 0.06,
      dotAlpha: d ? 0.7 : 0.45,
      lineAlpha: d ? 0.08 : 0.04,
    };
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    orbitParticles.length = 0;
    driftParticles.length = 0;
    const cx = W * 0.5, cy = H * 0.42;

    for (let i = 0; i < ORBIT_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const rBase = 80 + Math.random() * 260;
      const tilt = 0.35 + Math.random() * 0.15;
      orbitParticles.push({
        cx, cy, angle: a, rBase,
        rX: rBase * (0.9 + Math.random() * 0.4),
        rY: rBase * tilt,
        speed: (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.6 + 0.3,
        bright: Math.random(),
        phase: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < DRIFT_COUNT; i++) {
      driftParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.2 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function spawnExplosion(mx, my) {
    const p = palette();
    const count = 40 + Math.floor(Math.random() * 25);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5;
      const c = p.explode[Math.floor(Math.random() * p.explode.length)];
      explosions.push({
        x: mx, y: my,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        size: Math.random() * 3 + 1,
        color: c,
        trail: [],
      });
    }
  }

  canvas.style.pointerEvents = "none";
  window.addEventListener("click", (e) => {
    spawnExplosion(e.clientX, e.clientY);
  });

  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.016;
    const p = palette();
    const cx = W * 0.5, cy = H * 0.42;

    // Core glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
    grd.addColorStop(0, `rgba(${p.core.join(",")}, ${p.glowAlpha * 2})`);
    grd.addColorStop(0.4, `rgba(${p.ring.join(",")}, ${p.glowAlpha})`);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(cx - 200, cy - 200, 400, 400);

    // Core bright dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.star.join(",")}, ${0.4 + Math.sin(time * 2) * 0.15})`;
    ctx.fill();

    // Orbit particles
    for (const op of orbitParticles) {
      op.angle += op.speed;
      const x = op.cx + Math.cos(op.angle) * op.rX;
      const y = op.cy + Math.sin(op.angle) * op.rY;
      const twinkle = 0.3 + Math.sin(time * 3 + op.phase) * 0.3;
      const alpha = (p.dotAlpha * (0.3 + op.bright * 0.7)) * twinkle;

      const c = op.bright > 0.7 ? p.ring : p.core;
      ctx.beginPath();
      ctx.arc(x, y, op.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.join(",")}, ${alpha})`;
      ctx.fill();
    }

    // Connections between nearby orbit particles (sparse)
    for (let i = 0; i < orbitParticles.length; i += 3) {
      const a = orbitParticles[i];
      const ax = a.cx + Math.cos(a.angle) * a.rX;
      const ay = a.cy + Math.sin(a.angle) * a.rY;
      for (let j = i + 3; j < orbitParticles.length; j += 3) {
        const b = orbitParticles[j];
        const bx = b.cx + Math.cos(b.angle) * b.rX;
        const by = b.cy + Math.sin(b.angle) * b.rY;
        const d = Math.hypot(ax - bx, ay - by);
        if (d < 60) {
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(${p.core.join(",")}, ${(1 - d / 60) * p.lineAlpha})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    // Drift stars (background)
    for (const dp of driftParticles) {
      dp.x += dp.vx;
      dp.y += dp.vy;
      if (dp.x < 0) dp.x = W;
      if (dp.x > W) dp.x = 0;
      if (dp.y < 0) dp.y = H;
      if (dp.y > H) dp.y = 0;
      dp.twinkle += 0.02;
      const alpha = (0.15 + Math.sin(dp.twinkle) * 0.15) * p.dotAlpha;
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, dp.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.star.join(",")}, ${alpha})`;
      ctx.fill();
    }

    // Explosion particles
    for (let i = explosions.length - 1; i >= 0; i--) {
      const ep = explosions[i];
      ep.trail.push({ x: ep.x, y: ep.y, life: ep.life });
      if (ep.trail.length > 6) ep.trail.shift();

      ep.x += ep.vx;
      ep.y += ep.vy;
      ep.vx *= 0.97;
      ep.vy *= 0.97;
      ep.vy += 0.02;
      ep.life -= ep.decay;

      if (ep.life <= 0) { explosions.splice(i, 1); continue; }

      // Trail
      for (let t = 0; t < ep.trail.length; t++) {
        const tr = ep.trail[t];
        const ta = (t / ep.trail.length) * ep.life * 0.3;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, ep.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ep.color.join(",")}, ${ta})`;
        ctx.fill();
      }

      // Main dot
      ctx.beginPath();
      ctx.arc(ep.x, ep.y, ep.size * ep.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ep.color.join(",")}, ${ep.life * 0.9})`;
      ctx.fill();

      // Glow
      if (ep.life > 0.5) {
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, ep.size * ep.life * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ep.color.join(",")}, ${ep.life * 0.08})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
})();

// Sticky navigation
const nav = document.getElementById("nav");
function handleNavScroll() {
  if (!nav) return;
  nav.classList.toggle("nav-scrolled", window.scrollY > 12);
}
handleNavScroll();
window.addEventListener("scroll", handleNavScroll, { passive: true });

// Mobile menu handling
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

function openMobileMenu() {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.classList.remove("hidden");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("overflow-hidden");
}

function closeMobileMenu() {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.classList.add("hidden");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overflow-hidden");
}

navToggle?.addEventListener("click", () => {
  if (!mobileMenu) return;
  const isOpen = !mobileMenu.classList.contains("hidden");
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMobileMenu();
});

// Reveal animations
const animatedElements = document.querySelectorAll("[data-animate]");
animatedElements.forEach((element) => element.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number.parseInt(entry.target.dataset.delay || "0", 10);
      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

animatedElements.forEach((element) => revealObserver.observe(element));

// Portfolio filter
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

function setActiveButton(activeButton) {
  filterButtons.forEach((button) => {
    button.dataset.active = button === activeButton ? "true" : "false";
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    setActiveButton(button);

    portfolioItems.forEach((item) => {
      const category = item.dataset.category || "";
      const visible = filter === "all" || filter === category;
      item.classList.toggle("hidden", !visible);
    });
  });
});

// Counter animation
function animateCounter(targetElement) {
  const target = Number.parseInt(targetElement.dataset.count || "0", 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    targetElement.textContent = String(Math.floor(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll("[data-count]").forEach((counter) => {
  counterObserver.observe(counter);
});

// Smooth scrolling with offset
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  const targetId = anchor.getAttribute("href");
  if (!targetId || targetId === "#") return;

  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: "smooth" });
    closeMobileMenu();
  });
});

if (false) {
/* ========================================
   Theme Toggle
   ======================================== */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', theme);
}

applyTheme(getTheme());

themeToggle.addEventListener('click', () => {
  const current = getTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ========================================
   Particle Background (theme-aware)
   ======================================== */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 120;

  function getColors() {
    const style = getComputedStyle(root);
    const rgb = style.getPropertyValue('--particle-color').trim();
    const dotAlpha = parseFloat(style.getPropertyValue('--particle-alpha')) || 0.25;
    const lineAlpha = parseFloat(style.getPropertyValue('--particle-line-alpha')) || 0.08;
    return { rgb, dotAlpha, lineAlpha };
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const { rgb, dotAlpha, lineAlpha } = getColors();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * lineAlpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ========================================
   Navigation Scroll Effect
   ======================================== */
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  if (scroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = scroll;
});

/* ========================================
   Mobile Menu Toggle
   ======================================== */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

/* ========================================
   Scroll Animations (Intersection Observer)
   ======================================== */
const animatedElements = document.querySelectorAll('[data-animate]');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedElements.forEach(el => observer.observe(el));

/* ========================================
   Portfolio Filter
   ======================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ========================================
   Counter Animation
   ======================================== */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const duration = 1500;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.textContent = target;
          }
        }

        requestAnimationFrame(updateCount);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

animateCounters();

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
}
