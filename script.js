const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const introSplash = document.querySelector("[data-intro-splash]");
const introClose = document.querySelector("[data-intro-close]");
const contactRecipients = [
  "Consultoria-_-Asesoria@hotmail.com",
  "blanch_gordon@hotmail.com",
];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let introSplashTimer;

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

function closeIntroSplash() {
  if (!introSplash || introSplash.classList.contains("is-hidden")) return;
  window.clearTimeout(introSplashTimer);
  introSplash.classList.add("is-hidden");
  document.body.classList.remove("is-splash-open");
  window.setTimeout(() => introSplash.remove(), reduceMotion ? 0 : 480);
}

function setupIntroSplash() {
  if (!introSplash) return;
  document.body.classList.add("is-splash-open");
  introClose?.addEventListener("click", closeIntroSplash);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeIntroSplash();
  });
  introSplashTimer = window.setTimeout(closeIntroSplash, reduceMotion ? 1800 : 3200);
}

function buildContactMailto(formData) {
  const subject = encodeURIComponent("Solicitud de asesoría ESTRATTIVA");
  const body = [
    `Nombre: ${formData.get("nombre") || ""}`,
    `Correo: ${formData.get("correo") || ""}`,
    `Organización: ${formData.get("organizacion") || "No especificada"}`,
    "",
    "Mensaje:",
    formData.get("mensaje") || "",
  ].join("\n");

  return `mailto:${contactRecipients.join(",")}?subject=${subject}&body=${encodeURIComponent(body)}`;
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
setupReveal();
setupIntroSplash();

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
    const mailtoUrl = buildContactMailto(new FormData(contactForm));
    formStatus.textContent = "Se abrirá su correo para enviar la solicitud.";
    window.location.href = mailtoUrl;
    contactForm.reset();
  });
}

window.addEventListener("beforeprint", () => {
  closeIntroSplash();
  revealItems.forEach((item) => item.classList.add("is-visible"));
  closeMenu();
});
