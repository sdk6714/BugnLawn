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

document.querySelectorAll("[data-lead-form]").forEach((form) => {
  const phoneInput = form.querySelector("[data-phone-input]");
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (!digits) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const countPhoneDigits = () => (phoneInput?.value || "").replace(/\D/g, "").length;

  phoneInput?.addEventListener("beforeinput", (event) => {
    if (event.inputType?.startsWith("delete") || !event.data) return;
    const selectedCharacters = Math.max((phoneInput.selectionEnd || 0) - (phoneInput.selectionStart || 0), 0);
    const selectedDigits = phoneInput.value.slice(phoneInput.selectionStart || 0, phoneInput.selectionEnd || 0).replace(/\D/g, "").length;
    const newDigits = event.data.replace(/\D/g, "").length;
    if (newDigits === 0 && event.data) {
      event.preventDefault();
      return;
    }
    if (countPhoneDigits() - selectedDigits + newDigits > 10 && selectedCharacters === 0) {
      event.preventDefault();
    }
  });

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector("[data-form-status]");
    const originalLabel = button?.textContent || "Request My Quote";
    status?.classList.remove("is-error");
    if (status) status.textContent = "";
    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Unable to submit the quote request.");

      form.reset();
      form.classList.add("is-submitted");
      const success = form.querySelector("[data-form-success]");
      if (success) {
        const title = success.querySelector("strong");
        const body = success.querySelector("span");
        if (title) title.textContent = form.dataset.successTitle || "Thank you for submitting your request.";
        if (body) body.textContent = form.dataset.successBody || "We have received your information and will reach out shortly.";
        success.hidden = false;
        success.focus?.();
      }
    } catch (error) {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
      if (status) {
        status.classList.add("is-error");
        status.textContent = "Sorry, your request could not be sent. Please call Bug N Lawn or try again in a moment.";
      }
    }
  });
});

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
