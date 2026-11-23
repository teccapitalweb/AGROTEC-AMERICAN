(() => {
  "use strict";

  const config = window.AGROTEC_COURSE_CONFIG;
  if (!config) {
    document.documentElement.classList.remove("has-js");
    return;
  }
  window.clearTimeout(window.__agrotecRevealFallback);

  const money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: config.pricing.currency,
    maximumFractionDigits: 0,
  });

  const currentPrice = money.format(config.pricing.currentAmountMinor / 100);
  const referencePrice = money.format(config.pricing.referenceAmountMinor / 100);

  document.querySelectorAll("[data-current-price]").forEach((node) => {
    node.textContent = currentPrice;
  });
  document.querySelectorAll("[data-current-price-raw]").forEach((node) => {
    node.textContent = String(config.pricing.currentAmountMinor / 100);
  });
  document.querySelectorAll("[data-reference-price]").forEach((node) => {
    if (config.pricing.referenceValidated) {
      node.textContent = referencePrice;
    } else {
      node.closest(".price-reference, .price-card__reference")?.remove();
    }
  });
  document.querySelectorAll("[data-modality]").forEach((node) => {
    node.textContent = config.course.modality;
  });
  document.querySelectorAll("[data-duration]").forEach((node) => {
    node.textContent = String(config.course.durationHours);
  });
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const outcomeData = {
    cultivos: {
      number: "01",
      label: "Cultivos",
      title: "Reconoce qué necesita un cultivo para desarrollarse bien.",
      description: "Relaciona el funcionamiento de la planta con los factores que explican un buen rendimiento.",
      image: "./assets/cultivos.webp",
      alt: "Plántula siendo revisada en un invernadero",
      points: ["Factores esenciales del cultivo", "Señales visibles de bajo rendimiento", "Diagnóstico inicial con criterio"],
    },
    suelo: {
      number: "02",
      label: "Suelo y nutrición",
      title: "Lee el suelo antes de tomar decisiones de nutrición.",
      description: "Distingue un suelo adecuado, el valor de la materia orgánica y las señales de deficiencias nutricionales.",
      image: "./assets/suelo-nutricion.webp",
      alt: "Manos revisando composta y materia orgánica",
      points: ["Suelo y sustratos", "Nutrientes esenciales", "Fertilización química y orgánica"],
    },
    riego: {
      number: "03",
      label: "Riego",
      title: "Usa el agua con intención, no por costumbre.",
      description: "Comprende cuándo regar, qué errores evitar y cómo reconocer señales de estrés hídrico.",
      image: "./assets/riego.webp",
      alt: "Sistema de riego por goteo en un cultivo",
      points: ["Momento y cantidad de riego", "Sistemas de riego", "Prácticas para ahorrar agua"],
    },
    sanidad: {
      number: "04",
      label: "Sanidad vegetal",
      title: "Diferencia una plaga de una enfermedad y actúa a tiempo.",
      description: "Construye una base para monitorear, identificar daños y aplicar manejo integrado.",
      image: "./assets/sanidad-vegetal.webp",
      alt: "Preparación de bioinsumos para el manejo del cultivo",
      points: ["Plagas y daños comunes", "Enfermedades frecuentes", "Monitoreo y manejo integrado"],
    },
    planeacion: {
      number: "05",
      label: "Planeación",
      title: "Convierte una idea agrícola en un proyecto evaluable.",
      description: "Ordena los criterios básicos para elegir un cultivo, revisar viabilidad y estimar costos esenciales.",
      image: "./assets/planeacion.webp",
      alt: "Productor revisando información agrícola en una tableta",
      points: ["Elección del cultivo", "Viabilidad y costos", "Tecnología accesible"],
    },
  };

  const outcomePanel = document.querySelector("#outcome-panel");
  const outcomeTabs = [...document.querySelectorAll("[data-outcome]")];

  function selectOutcome(button, focus = false) {
    const data = outcomeData[button.dataset.outcome];
    if (!data || !outcomePanel) return;

    outcomeTabs.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    outcomePanel.setAttribute("aria-labelledby", button.id);
    outcomePanel.classList.add("is-changing");

    window.setTimeout(() => {
      const image = outcomePanel.querySelector("[data-outcome-image]");
      image.src = data.image;
      image.alt = data.alt;
      outcomePanel.querySelector("[data-outcome-number]").textContent = data.number;
      outcomePanel.querySelector("[data-outcome-label]").textContent = data.label;
      outcomePanel.querySelector("[data-outcome-title]").textContent = data.title;
      outcomePanel.querySelector("[data-outcome-description]").textContent = data.description;
      outcomePanel.querySelector("[data-outcome-list]").innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
      outcomePanel.classList.remove("is-changing");
    }, 140);

    if (focus) button.focus();
  }

  outcomeTabs.forEach((button, index) => {
    button.addEventListener("click", () => selectOutcome(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % outcomeTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + outcomeTabs.length) % outcomeTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = outcomeTabs.length - 1;
      selectOutcome(outcomeTabs[next], true);
    });
  });

  document.querySelectorAll("[data-accordion-group]").forEach((group) => {
    group.querySelectorAll("details").forEach((details) => {
      details.addEventListener("toggle", () => {
        if (!details.open) return;
        group.querySelectorAll("details[open]").forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    });
  });

  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector("#mobile-nav");

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 10);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });
  mobileNav?.querySelectorAll("a, button").forEach((control) => {
    control.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    });
  });

  const purchaseDialog = document.querySelector("[data-purchase-dialog]");
  const certificateDialog = document.querySelector("[data-certificate-dialog]");

  function openPurchase() {
    if (config.checkout.enabled && config.checkout.apiBase) {
      window.location.assign(`${config.checkout.apiBase}/checkout`);
      return;
    }
    purchaseDialog?.showModal();
  }

  document.querySelectorAll(".js-buy").forEach((button) => button.addEventListener("click", openPurchase));
  document.querySelector("[data-certificate-open]")?.addEventListener("click", () => certificateDialog?.showModal());

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  const revealNodes = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const hero = document.querySelector("[data-hero]");
  const pricing = document.querySelector("[data-pricing]");
  const mobileBuy = document.querySelector("[data-mobile-buy]");
  let heroVisible = true;
  let pricingVisible = false;

  function updateMobileBuy() {
    if (!mobileBuy) return;
    const shouldShow = window.matchMedia("(max-width: 560px)").matches && !heroVisible && !pricingVisible;
    mobileBuy.hidden = !shouldShow;
    requestAnimationFrame(() => mobileBuy.classList.toggle("is-visible", shouldShow));
  }

  if ("IntersectionObserver" in window && hero && pricing) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      updateMobileBuy();
    }, { threshold: 0.03 }).observe(hero);
    new IntersectionObserver((entries) => {
      pricingVisible = entries[0].isIntersecting;
      updateMobileBuy();
    }, { threshold: 0.08 }).observe(pricing);
  }
  window.addEventListener("resize", updateMobileBuy, { passive: true });
  updateMobileBuy();
})();
