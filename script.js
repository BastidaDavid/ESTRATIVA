const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function closeMenu() {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function toggleMenu() {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
}

function setupReveal() {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
setupReveal();

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleMenu);

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Gracias. Su solicitud ha sido registrada.";
    contactForm.reset();
  });
}

window.addEventListener("beforeprint", () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  closeMenu();
});
