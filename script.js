// ============================================================
// 交互脚本：入场 / 滚动进度 / 自定义光标 / 磁吸 / 卡片倾斜 /
//          导航 / 移动菜单 / 揭示动画 / 数字滚动 / 作品筛选 / 平滑滚动
// ============================================================

const isFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero 入场
const markLoaded = () => document.documentElement.classList.add("is-loaded");
window.addEventListener("load", markLoaded);
document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(markLoaded));

// 滚动进度条
const progress = document.getElementById("progress");
function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
  if (progress) progress.style.width = (p * 100).toFixed(2) + "%";
}
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });

// 顶部导航底边
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

// 自定义光标
(function cursor() {
  // Disabled: use the native system cursor instead of the custom follower
  return;
  if (!isFinePointer || prefersReduced) return;
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;
  document.documentElement.classList.add("has-cursor");

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  const hoverSel = "a, button, .filter-btn, .work-card, .magnetic, [role='button']";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSel)) { dot.classList.add("hovering"); ring.classList.add("hovering"); }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverSel)) { dot.classList.remove("hovering"); ring.classList.remove("hovering"); }
  });
})();

// 磁吸按钮
(function magnetic() {
  if (!isFinePointer || prefersReduced) return;
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
})();

// 作品卡片 3D 倾斜
(function tilt() {
  if (!isFinePointer || prefersReduced) return;
  document.querySelectorAll(".tilt").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-6px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
})();

// 移动端菜单
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
function setMenu(open) {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}
navToggle?.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));
document.querySelectorAll(".m-link").forEach((l) => l.addEventListener("click", () => setMenu(false)));
window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
window.addEventListener("resize", () => { if (window.innerWidth > 880) setMenu(false); });

// 揭示动画
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll("[data-animate]").forEach((el) => revealObserver.observe(el));

// 数字滚动
function animateCounter(el) {
  const target = parseInt(el.dataset.count || "0", 10);
  const duration = 1600, start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.floor(eased * target));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((c) => counterObserver.observe(c));

// 作品筛选
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter || "all";
    filterButtons.forEach((b) => (b.dataset.active = b === btn ? "true" : "false"));
    workCards.forEach((card) => {
      const cat = card.dataset.category || "";
      card.classList.toggle("is-hidden", filter !== "all" && filter !== cat);
    });
  });
});

// Lenis 平滑滚动
(function initLenis() {
  if (typeof Lenis === "undefined" || prefersReduced) return;
  const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  window.__lenis = lenis;
  lenis.on("scroll", updateProgress);
  (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
})();

// 进入页面忽略 hash
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname);
  window.scrollTo(0, 0);
}

// 锚点平滑滚动
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  const id = anchor.getAttribute("href");
  if (!id || id === "#") return;
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: -80 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    setMenu(false);
  });
});
