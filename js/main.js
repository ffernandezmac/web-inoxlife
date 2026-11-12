import { INOXLIFE_DATA } from "../data/inoxlife.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollProgressFallback();
  initHeroSwitcher();
  initStatementHighlight();
  initPeekList();
  initScrollytellingChapters();
  initProjectsPortfolio();
  initDialogs();
  initDualPathLinks();
  initQuoteForm();
});

/* ==========================================================================
   1. Menú móvil accesible
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      toggle.focus();
    }
  });
}

/* ==========================================================================
   2. Fallback de barra de progreso superior (scroll-progress-indicator)
   ========================================================================== */
function initScrollProgressFallback() {
  if (prefersReducedMotion.matches) return;
  if (!CSS.supports("animation-timeline", "scroll()")) {
    const progress = document.getElementById("scroll-progress");
    if (!progress) return;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }
}

/* ==========================================================================
   3. Selector de obra destacada en el Hero
   ========================================================================== */
function initHeroSwitcher() {
  const img = document.getElementById("hero-stage-img");
  const code = document.getElementById("hero-stage-code");
  const title = document.getElementById("hero-stage-title");
  const spec = document.getElementById("hero-stage-spec");
  const buttons = document.querySelectorAll("[data-hero-slide]");

  if (!img || !buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const slideId = btn.getAttribute("data-hero-slide");
      const slide = INOXLIFE_DATA.heroSlides.find((s) => s.id === slideId);
      if (!slide) return;

      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      img.src = slide.image;
      img.alt = slide.alt;
      if (code) code.textContent = slide.code;
      if (title) title.textContent = slide.title;
      if (spec) spec.textContent = slide.spec;
    });
  });
}

/* ==========================================================================
   4. Declaración iluminada palabra por palabra al hacer scroll (word-highlight)
   ========================================================================== */
function initStatementHighlight() {
  const quoteEl = document.getElementById("statement-quote");
  if (!quoteEl) return;

  const text = quoteEl.textContent.trim().replace(/\s+/g, " ");
  const words = text.split(" ");
  quoteEl.textContent = "";

  const wordSpans = words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "statement-word";
    span.textContent = index < words.length - 1 ? `${word} ` : word;
    if (prefersReducedMotion.matches) {
      span.classList.add("is-lit");
    }
    quoteEl.appendChild(span);
    return span;
  });

  if (prefersReducedMotion.matches) return;

  const updateHighlight = () => {
    const rect = quoteEl.getBoundingClientRect();
    const viewH = window.innerHeight;
    const start = viewH * 0.85;
    const end = viewH * 0.28;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const litCount = Math.round(progress * wordSpans.length);

    wordSpans.forEach((span, idx) => {
      span.classList.toggle("is-lit", idx < litCount);
    });
  };

  window.addEventListener("scroll", updateHighlight, { passive: true });
  updateHighlight();
}

/* ==========================================================================
   5. Peek-List Interactivo ("Qué fabricamos bajo plano")
   ========================================================================== */
function initPeekList() {
  const triggers = document.querySelectorAll("[data-peek-id]");
  const img = document.getElementById("peek-img");
  const title = document.getElementById("peek-title");
  const alloys = document.getElementById("peek-alloys");
  const finish = document.getElementById("peek-finish");
  const location = document.getElementById("peek-location");
  const cta = document.getElementById("peek-cta");

  if (!triggers.length || !img) return;

  const activateService = (serviceId) => {
    const item = INOXLIFE_DATA.services.find((s) => s.id === serviceId);
    if (!item) return;

    triggers.forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.getAttribute("data-peek-id") === serviceId));
    });

    img.src = item.image;
    img.alt = item.alt;
    if (title) title.textContent = item.title;
    if (alloys) alloys.textContent = item.alloys;
    if (finish) finish.textContent = item.finish;
    if (location) location.textContent = item.locationExample;
    if (cta) {
      cta.setAttribute("data-select-reference", `Especialidad: ${item.title}`);
    }
  };

  triggers.forEach((btn) => {
    const id = btn.getAttribute("data-peek-id");
    btn.addEventListener("click", () => activateService(id));
    btn.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        activateService(id);
      }
    });
    btn.addEventListener("focus", () => activateService(id));
  });
}

/* ==========================================================================
   6. Scrollytelling Nivel 3: Capítulos fijos + Atmósfera + Cota Milimetrada
   ========================================================================== */
function initScrollytellingChapters() {
  const section = document.getElementById("del-plano-a-la-obra");
  const cards = document.querySelectorAll("[data-chapter-index]");
  const layers = document.querySelectorAll("[data-stage-layer]");
  const dots = document.querySelectorAll("[data-stage-dot]");
  const stageCaption = document.getElementById("scrolly-stage-caption");
  const cadReadout = document.getElementById("cad-readout");
  const cadFill = document.getElementById("cad-fill");

  if (!section || !cards.length) return;

  const setActiveChapter = (index) => {
    const ch = INOXLIFE_DATA.chapters[index];
    if (!ch) return;

    cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    layers.forEach((layer, i) => layer.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.setAttribute("aria-current", "step");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (stageCaption) {
      stageCaption.textContent = ch.caption;
    }
  };

  // Observador para activar cada capítulo al pasar por el centro de lectura
  const chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute("data-chapter-index"));
          setActiveChapter(idx);
        }
      });
    },
    {
      rootMargin: "-28% 0px -42% 0px",
      threshold: 0.15
    }
  );

  cards.forEach((card) => chapterObserver.observe(card));

  // Observador de atmósfera (cambia body[data-atmosphere="dark"] al recorrer el bloque)
  const atmosphereObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        document.body.dataset.atmosphere = entry.isIntersecting ? "dark" : "light";
      });
    },
    {
      rootMargin: "-15% 0px -20% 0px",
      threshold: 0.05
    }
  );

  atmosphereObserver.observe(section);

  // Regla milimetrada viva (000 mm -> 1000 mm) sincronizada con el scroll de la sección
  const updateCadRuler = () => {
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    const totalScrollable = Math.max(1, rect.height - viewH * 0.5);
    const rawProgress = (viewH * 0.45 - rect.top) / totalScrollable;
    const clamped = Math.min(1, Math.max(0, rawProgress));
    const mm = Math.round(clamped * 1000);

    if (cadReadout) {
      cadReadout.textContent = `${String(mm).padStart(3, "0")} mm`;
    }
    if (cadFill) {
      const isHorizontal = window.innerWidth <= 1024;
      cadFill.style.transform = isHorizontal
        ? `scaleX(${Math.max(0.08, clamped)})`
        : `scaleY(${Math.max(0.08, clamped)})`;
    }
  };

  window.addEventListener("scroll", updateCadRuler, { passive: true });
  window.addEventListener("resize", updateCadRuler, { passive: true });
  updateCadRuler();

  // Botones indicadores del visor fijo
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.getAttribute("data-stage-dot"));
      const targetCard = cards[idx];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
        setActiveChapter(idx);
      }
    });
  });
}

/* ==========================================================================
   7. Portfolio Filtrable de Obras Reales + Modal de Ficha + "Pedir algo similar"
   ========================================================================== */
function initProjectsPortfolio() {
  const grid = document.getElementById("projects-grid");
  const filterBtns = document.querySelectorAll("[data-filter]");
  const liveCount = document.getElementById("projects-live-count");

  if (!grid) return;

  const renderProjects = (category) => {
    const list =
      category === "all"
        ? INOXLIFE_DATA.projects
        : INOXLIFE_DATA.projects.filter((p) => p.category === category);

    grid.innerHTML = "";

    list.forEach((project) => {
      const article = document.createElement("article");
      article.className = "project-card";
      article.innerHTML = `
        <div class="project-card__media">
          <img
            class="project-card__img"
            src="${project.images[0]}"
            alt="${project.title} en ${project.location}"
            loading="lazy"
            width="640"
            height="400"
          >
          <span class="project-card__badge">${project.categoryLabel}</span>
        </div>
        <div class="project-card__body">
          <div class="project-card__meta">${project.location} · ${project.clientType}</div>
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__summary">${project.summary}</p>
          <div class="project-card__materials">Materiales: ${project.materials}</div>
          <div class="project-card__actions">
            <button
              type="button"
              class="btn btn--secondary"
              data-open-project="${project.id}"
              aria-label="Ver ficha técnica de ${project.title}"
            >
              Ver ficha (${project.images.length} fotos)
            </button>
            <button
              type="button"
              class="action-link"
              data-select-reference="Obra similar a: ${project.title} (${project.location})"
            >
              Pedir algo similar <span class="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      `;
      grid.appendChild(article);
    });

    if (liveCount) {
      liveCount.textContent = `Mostrando ${list.length} obras reales documentadas.`;
    }
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-filter");
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderProjects(cat);
    });
  });

  renderProjects("all");
}

/* ==========================================================================
   8. Diálogos nativos (<dialog>) para fichas técnicas y páginas legales
   ========================================================================== */
function initDialogs() {
  const projectDialog = document.getElementById("project-dialog");
  const projectDialogTitle = document.getElementById("project-dialog-title");
  const projectDialogBody = document.getElementById("project-dialog-body");
  const projectDialogClose = document.getElementById("project-dialog-close");

  const legalDialog = document.getElementById("legal-dialog");
  const legalDialogTitle = document.getElementById("legal-dialog-title");
  const legalDialogBody = document.getElementById("legal-dialog-body");
  const legalDialogClose = document.getElementById("legal-dialog-close");

  // Delegación para abrir ficha de obra o seleccionar referencia "Pedir algo similar"
  document.addEventListener("click", (e) => {
    const openProjectBtn = e.target.closest("[data-open-project]");
    if (openProjectBtn && projectDialog) {
      const projectId = openProjectBtn.getAttribute("data-open-project");
      const project = INOXLIFE_DATA.projects.find((p) => p.id === projectId);
      if (!project) return;

      projectDialogTitle.textContent = `${project.title} · ${project.location}`;
      const photosHtml = project.images
        .map(
          (src, idx) =>
            `<img src="${src}" alt="${project.title} - vista ${idx + 1}" loading="lazy">`
        )
        .join("");
      const scopeHtml = project.scope.map((item) => `<li>${item}</li>`).join("");

      projectDialogBody.innerHTML = `
        <div class="dialog-gallery">${photosHtml}</div>
        <p><strong>Cliente / Tipología:</strong> ${project.clientType}</p>
        <p><strong>Materiales empleados:</strong> ${project.materials}</p>
        <p>${project.summary}</p>
        <h3 style="font-size:1.05rem;margin:1rem 0 0.5rem;">Alcance ejecutado por Inoxlife</h3>
        <ul style="margin:0 0 1.5rem;padding-left:1.2rem;">${scopeHtml}</ul>
        <button
          type="button"
          class="btn btn--primary"
          data-select-reference="Obra similar a: ${project.title} (${project.location})"
        >
          Solicitar presupuesto de algo similar <span class="btn__arrow" aria-hidden="true">→</span>
        </button>
      `;

      projectDialog.showModal();
      return;
    }

    const refBtn = e.target.closest("[data-select-reference]");
    if (refBtn) {
      const refText = refBtn.getAttribute("data-select-reference");
      if (projectDialog && projectDialog.open) {
        projectDialog.close();
      }
      selectProjectReference(refText);
      return;
    }

    const legalBtn = e.target.closest("[data-open-legal]");
    if (legalBtn && legalDialog) {
      const type = legalBtn.getAttribute("data-open-legal");
      openLegalModal(type, legalDialog, legalDialogTitle, legalDialogBody);
    }
  });

  if (projectDialogClose && projectDialog) {
    projectDialogClose.addEventListener("click", () => projectDialog.close());
    projectDialog.addEventListener("click", (e) => {
      if (e.target === projectDialog) projectDialog.close();
    });
  }

  if (legalDialogClose && legalDialog) {
    legalDialogClose.addEventListener("click", () => legalDialog.close());
    legalDialog.addEventListener("click", (e) => {
      if (e.target === legalDialog) legalDialog.close();
    });
  }
}

function openLegalModal(type, dialog, titleEl, bodyEl) {
  const legalContent = {
    aviso: {
      title: "Aviso Legal",
      html: `
        <p><strong>Titular del sitio web:</strong> Inoxlife S.L.</p>
        <p><strong>Domicilio social e instalaciones:</strong> Ctra. Carril de Guetara, 78 · Polígono Industrial Villa Rosa, 29010 Málaga (España).</p>
        <p><strong>Contacto directo:</strong> <a href="mailto:info@inoxlife.es">info@inoxlife.es</a> · Teléfono: 912 66 69 73.</p>
        <p><em>Nota técnica de implantación:</em> Completar con el CIF/NIF societario y datos registrales del Registro Mercantil de Málaga antes del pase a dominio definitivo.</p>
      `
    },
    privacidad: {
      title: "Política de Privacidad (RGPD)",
      html: `
        <p><strong>Responsable del tratamiento:</strong> Inoxlife S.L. (info@inoxlife.es).</p>
        <p><strong>Finalidad:</strong> Atender las solicitudes de presupuesto a medida, consultas técnicas y revisión de planos remitidas a través del formulario de contacto.</p>
        <p><strong>Legitimación:</strong> Aplicación de medidas precontractuales a petición del interesado (art. 6.1.b RGPD).</p>
        <p><strong>Derechos:</strong> Acceso, rectificación, supresión y oposición escribiendo a <a href="mailto:info@inoxlife.es">info@inoxlife.es</a>.</p>
      `
    },
    cookies: {
      title: "Política de Cookies",
      html: `
        <p>Esta versión del sitio web de Inoxlife utiliza exclusivamente almacenamiento técnico necesario para el funcionamiento de la interfaz, sin cookies publicitarias ni rastreadores de terceros.</p>
      `
    }
  };

  const entry = legalContent[type] || legalContent.aviso;
  titleEl.textContent = entry.title;
  bodyEl.innerHTML = entry.html;
  dialog.showModal();
}

/* ==========================================================================
   9. Conexión de tarjetas de perfil y botón "Pedir algo similar" con el formulario
   ========================================================================== */
function initDualPathLinks() {
  document.querySelectorAll("[data-profile-select]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const profileVal = el.getAttribute("data-profile-select");
      const refLabel = el.getAttribute("data-profile-label");
      const radio = document.querySelector(`input[name="perfil_cliente"][value="${profileVal}"]`);
      if (radio) radio.checked = true;
      if (refLabel) {
        selectProjectReference(refLabel, false);
      }
      const formSection = document.getElementById("presupuesto");
      if (formSection) {
        formSection.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      }
      const nameInput = document.getElementById("nombre");
      if (nameInput) {
        setTimeout(() => nameInput.focus({ preventScroll: true }), 350);
      }
    });
  });
}

function selectProjectReference(refText, shouldScroll = true) {
  const banner = document.getElementById("selected-ref-banner");
  const bannerText = document.getElementById("selected-ref-text");
  const hiddenInput = document.getElementById("referencia_obra");
  const formSection = document.getElementById("presupuesto");

  if (banner && bannerText && hiddenInput) {
    bannerText.textContent = refText;
    hiddenInput.value = refText;
    banner.hidden = false;
  }

  if (shouldScroll && formSection) {
    formSection.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    const nameInput = document.getElementById("nombre");
    if (nameInput) {
      setTimeout(() => nameInput.focus({ preventScroll: true }), 400);
    }
  }
}

/* ==========================================================================
   10. Validación accesible del formulario (modern-web-guidance: forms)
   - Validar en blur (si fue editado)
   - Limpiar errores en input inmediatamente
   - En submit: bloquear si hay errores y llevar el foco al primer campo inválido
   ========================================================================== */
function initQuoteForm() {
  const form = document.getElementById("presupuesto-form");
  const clearRefBtn = document.getElementById("clear-ref-btn");
  const banner = document.getElementById("selected-ref-banner");
  const hiddenInput = document.getElementById("referencia_obra");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-quote-btn");

  if (!form) return;

  if (clearRefBtn && banner && hiddenInput) {
    clearRefBtn.addEventListener("click", () => {
      banner.hidden = true;
      hiddenInput.value = "";
    });
  }

  const fields = [
    {
      input: document.getElementById("nombre"),
      error: document.getElementById("nombre-error"),
      validate: (val) => (val.trim().length >= 2 ? "" : "Indica tu nombre o el de tu empresa.")
    },
    {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
          ? ""
          : "Introduce un correo electrónico válido (ej. nombre@empresa.es)."
    },
    {
      input: document.getElementById("telefono"),
      error: document.getElementById("telefono-error"),
      validate: (val) =>
        val.replace(/\D/g, "").length >= 7
          ? ""
          : "Introduce un teléfono de contacto de al menos 7 dígitos."
    },
    {
      input: document.getElementById("mensaje"),
      error: document.getElementById("mensaje-error"),
      validate: (val) =>
        val.trim().length >= 10
          ? ""
          : "Describe brevemente qué necesitas fabricar y en qué localidad está la obra."
    }
  ];

  const touched = new Set();

  const showFieldState = (fieldObj, errorMessage) => {
    const { input, error } = fieldObj;
    if (!input || !error) return true;

    input.setCustomValidity(errorMessage);
    if (errorMessage) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = errorMessage;
      error.hidden = false;
      return false;
    } else {
      input.setAttribute("aria-invalid", "false");
      error.textContent = "";
      error.hidden = true;
      return true;
    }
  };

  fields.forEach((fieldObj) => {
    const { input, validate } = fieldObj;
    if (!input) return;

    // Fase input: solo limpiar errores existentes cuando se corrige el valor
    input.addEventListener("input", () => {
      touched.add(input.id);
      if (input.getAttribute("aria-invalid") === "true") {
        const msg = validate(input.value);
        if (!msg) {
          showFieldState(fieldObj, "");
        }
      }
    });

    // Fase blur: validar contextualmente si el campo ya fue editado
    input.addEventListener("blur", () => {
      if (touched.has(input.id) || input.value.trim().length > 0) {
        const msg = validate(input.value);
        showFieldState(fieldObj, msg);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Comprobar honeypot anti-spam
    const honey = form.querySelector('input[name="website_Trap"]');
    if (honey && honey.value) return;

    let firstInvalid = null;
    fields.forEach((fieldObj) => {
      const msg = fieldObj.validate(fieldObj.input.value);
      const valid = showFieldState(fieldObj, msg);
      if (!valid && !firstInvalid) {
        firstInvalid = fieldObj.input;
      }
    });

    if (firstInvalid) {
      if (statusEl) {
        statusEl.className = "form-status is-error";
        statusEl.textContent = "Revisa los campos marcados en rojo antes de enviar tu solicitud.";
        statusEl.hidden = false;
      }
      firstInvalid.focus();
      return;
    }

    // Desactivar botón tras envío válido para evitar envíos duplicados
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Solicitud preparada ✓";
    }

    const formData = new FormData(form);
    const perfil = formData.get("perfil_cliente") || "No especificado";
    const refObra = formData.get("referencia_obra") || "Proyecto nuevo a medida";
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const telefono = formData.get("telefono");
    const ubicacion = formData.get("ubicacion") || "Sin especificar";
    const plano = formData.get("tiene_planos") || "A consultar";
    const mensaje = formData.get("mensaje");

    const subject = encodeURIComponent(`Solicitud de presupuesto web — ${nombre} (${ubicacion})`);
    const body = encodeURIComponent(
      `Hola equipo técnico de INOXLIFE,\n\n` +
        `Solicito estudio/presupuesto para el siguiente proyecto:\n` +
        `• Perfil: ${perfil}\n` +
        `• Referencia / Línea: ${refObra}\n` +
        `• Nombre / Empresa: ${nombre}\n` +
        `• Email: ${email}\n` +
        `• Teléfono: ${telefono}\n` +
        `• Localidad de la obra: ${ubicacion}\n` +
        `• Disponibilidad de planos: ${plano}\n\n` +
        `Detalles del trabajo:\n${mensaje}\n`
    );

    if (statusEl) {
      statusEl.className = "form-status is-success";
      statusEl.innerHTML = `
        <p style="margin:0 0 0.65rem;">
          <strong>¡Solicitud validada correctamente!</strong> Hemos preparado la ficha técnica de tu consulta para oficina técnica.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;">
          <a class="btn btn--primary" href="mailto:info@inoxlife.es?subject=${subject}&body=${body}">
            Enviar ahora a info@inoxlife.es →
          </a>
          <button type="button" class="btn btn--secondary" id="reset-quote-btn">
            Editar o enviar otra consulta
          </button>
        </div>
      `;
      statusEl.hidden = false;

      const resetBtn = document.getElementById("reset-quote-btn");
      if (resetBtn && submitBtn) {
        resetBtn.addEventListener("click", () => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Solicitar presupuesto a medida →";
          statusEl.hidden = true;
        });
      }
    }
  });
}
