const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const serviceMenus = document.querySelectorAll("[data-services-menu]");
const closeServiceMenus = () => {
  serviceMenus.forEach((menu) => {
    menu.classList.remove("is-open");
    menu.querySelector("[data-services-toggle]")?.setAttribute("aria-expanded", "false");
  });
};

serviceMenus.forEach((menu) => {
  const button = menu.querySelector("[data-services-toggle]");
  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.classList.contains("is-open");
    closeServiceMenus();
    menu.classList.toggle("is-open", !open);
    button.setAttribute("aria-expanded", String(!open));
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeServiceMenus();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeServiceMenus);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest("[data-services-menu]")) closeServiceMenus();
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (nav && toggle) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

const form = document.querySelector("[data-lead-form]");
if (form) {
  const phoneInput = form.querySelector("[data-phone-input]");
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (!digits) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });

  form.addEventListener("submit", () => {
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Sending...";
    }
  });
}

document.querySelectorAll("[data-diagram-panel]").forEach((panel) => {
  const controls = panel.querySelectorAll("[data-diagram-select]");
  const setActive = (value) => {
    panel.dataset.active = value;
    controls.forEach((control) => {
      const active = control.dataset.diagramSelect === value;
      control.classList.toggle("is-active", active);
      if (control.hasAttribute("aria-pressed")) {
        control.setAttribute("aria-pressed", String(active));
      }
    });
  };

  controls.forEach((control) => {
    control.addEventListener("click", () => setActive(control.dataset.diagramSelect));
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActive(control.dataset.diagramSelect);
      }
    });
  });

  setActive(panel.dataset.active || "1");
});
