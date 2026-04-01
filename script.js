const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const hero = document.querySelector(".hero");
const root = document.documentElement;
const tiltCards = document.querySelectorAll("[data-tilt]");
const magneticItems = document.querySelectorAll(".magnetic");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer:fine)").matches;
let mouseFrame = null;
let mouseState = { x: 0, y: 0 };

const syncHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);

  if (!prefersReducedMotion) {
    root.style.setProperty("--scroll-shift", `${Math.min(window.scrollY * 0.08, 28)}px`);
  }
};

const closeMenu = () => {
  if (!menuToggle || !nav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (!prefersReducedMotion && hero && finePointer) {
  const updateHeroMotion = () => {
    root.style.setProperty("--hero-x", `${mouseState.x}px`);
    root.style.setProperty("--hero-y", `${mouseState.y}px`);
    mouseFrame = null;
  };

  hero.addEventListener("mousemove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 24;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20;
    mouseState = { x, y };

    if (!mouseFrame) {
      mouseFrame = window.requestAnimationFrame(updateHeroMotion);
    }
  });

  hero.addEventListener("mouseleave", () => {
    mouseState = { x: 0, y: 0 };

    if (!mouseFrame) {
      mouseFrame = window.requestAnimationFrame(updateHeroMotion);
    }
  });
}

if (!prefersReducedMotion && finePointer) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = offsetY * -8;
      const rotateY = offsetX * 10;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) {
        return;
      }

      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, index * 70);

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
