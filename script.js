// Theme management
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  return localStorage.getItem("theme") || "dark";
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

// Aurora mouse-following spotlight
(function initSpotlight() {
  const spot = document.getElementById("mouseSpotlight");
  if (!spot || !window.matchMedia("(pointer: fine)").matches) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!spot.classList.contains("active")) spot.classList.add("active");
  });

  (function loop() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    spot.style.left = cx + "px";
    spot.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
})();

// Custom cursor (desktop only)
(function initCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring || !window.matchMedia("(pointer: fine)").matches) return;

  document.documentElement.classList.add("has-custom-cursor");

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  (function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(followRing);
  })();

  const hoverSel = "a, button, .filter-btn, .portfolio-item, input, textarea, [role='button']";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSel)) {
      dot.classList.add("hovering");
      ring.classList.add("hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSel)) {
      dot.classList.remove("hovering");
      ring.classList.remove("hovering");
    }
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();

// Magnetic buttons (desktop only)
(function initMagnetic() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      el.style.transition = "transform 0.12s ease-out";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
    });
  });
})();


// Lenis smooth scroll
(function initLenis() {
  if (typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  window.__lenis = lenis;

  (function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  })(performance.now());
})();

// Sticky navigation
const nav = document.getElementById("nav");

function handleNavScroll() {
  if (!nav) return;
  nav.classList.toggle("nav-scrolled", window.scrollY > 12);
}

handleNavScroll();
window.addEventListener("scroll", handleNavScroll, { passive: true });

// Mobile menu
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
  isOpen ? closeMobileMenu() : openMobileMenu();
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMobileMenu();
});

// Reveal animations (IntersectionObserver)
const animatedElements = document.querySelectorAll("[data-animate]");
animatedElements.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || "0", 10);
      setTimeout(() => entry.target.classList.add("is-visible"), delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

animatedElements.forEach((el) => revealObserver.observe(el));

// Portfolio filter
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

function setActiveFilter(active) {
  filterButtons.forEach((btn) => {
    btn.dataset.active = btn === active ? "true" : "false";
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter || "all";
    setActiveFilter(btn);
    portfolioItems.forEach((item) => {
      const cat = item.dataset.category || "";
      item.classList.toggle("hidden", filter !== "all" && filter !== cat);
    });
  });
});

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.count || "0", 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.floor(eased * target));
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
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((c) => counterObserver.observe(c));

// Smooth anchor scrolling (Lenis-aware)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  const targetId = anchor.getAttribute("href");
  if (!targetId || targetId === "#") return;

  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -76 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "smooth" });
    }
    closeMobileMenu();
  });
});
