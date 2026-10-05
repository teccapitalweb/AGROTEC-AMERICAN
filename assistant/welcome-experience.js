(() => {
  'use strict';

  if (document.querySelector('[data-agx-welcome]')) return;

  const cookieKey = 'agrotec-cookie-notice-v1';
  const escapeKey = (event) => event.key === 'Escape' || event.key === 'Esc';
  const mascot = 'assistant/assets/agro-robot-v6.png';
  const defaults = window.AGROTEC_ENCUESTA_DEFAULTS || { preguntas: [], cursos: [] };
  const wantedQuestions = ['stage', 'experience', 'areas', 'goal', 'need', 'format', 'time'];
  const questions = wantedQuestions.map((id) => defaults.preguntas.find((question) => question.id === id)).filter(Boolean);
  const courses = defaults.cursos.filter((course) => course.available !== false && Array.isArray(course.classes) && course.classes.length);
  const answers = {};
  let screen = 'intro';
  let step = 0;
  let advanceTimer = 0;

  const iconByValue = {
    student: '🎓', graduate: '🌱', worker: '🚜', business: '📈', specialist: '🔬', hobby: '✨',
    starting: '🌿', basics: '📖', practical: '🛠️', specialize: '🏆',
    crops: '🍎', protected: '🏡', soil: '🧪', health: '🐞', organic: '🍃', ornamental: '🌻', agroindustry: '⚙️',
    work: '💼', start: '🚀', improve: '📊', profile: '🏅', personal: '💚', update: '🔄',
    practice: '🧤', results: '🎯', costs: '🪙', deep: '🔎', learn: '💡',
    video: '▶️', cases: '🔍', guides: '📚', tools: '🧰', mix: '✨',
    lt1: '⏳', '1-2': '🕐', '3-5': '📅', '5plus': '⚡'
  };

  const learningProfiles = {
    video: {
      name: 'visual y auditivo',
      strength: 'Captas ideas con facilidad cuando puedes verlas, escucharlas y seguirlas paso a paso.',
      flower: 'Tienes una gran capacidad para convertir explicaciones complejas en imágenes mentales claras.'
    },
    cases: {
      name: 'observador y práctico',
      strength: 'Detectas patrones y entiendes mejor cuando ves cómo se resolvió un caso real.',
      flower: 'Tu mirada conecta los detalles con el panorama completo: esa es una habilidad muy valiosa en el campo.'
    },
    guides: {
      name: 'reflexivo y organizado',
      strength: 'Procesas la información con calma y sabes convertirla en una referencia que puedes consultar.',
      flower: 'Tienes disciplina para ordenar lo que aprendes y construir conocimiento que permanece.'
    },
    tools: {
      name: 'práctico y resolutivo',
      strength: 'Aprendes haciendo y te resulta natural llevar una idea a una acción concreta.',
      flower: 'Tu fortaleza está en transformar el conocimiento en resultados visibles.'
    },
    mix: {
      name: 'flexible y multidimensional',
      strength: 'Combinas distintas formas de aprender y sabes cambiar de estrategia según el reto.',
      flower: 'Esa flexibilidad te permite unir teoría, observación y práctica con mucha naturalidad.'
    }
  };

  const growthByNeed = {
    start: 'Tu siguiente oportunidad es convertir esa curiosidad en una ruta clara y avanzar sin sentir que tienes que aprenderlo todo de golpe.',
    practice: 'Para crecer todavía más, te conviene aplicar una técnica a la vez y observar qué cambia en tu propia realidad.',
    results: 'Puedes potenciar tu talento midiendo un antes y un después; así cada aprendizaje se vuelve una decisión mejor.',
    costs: 'Tu siguiente nivel está en priorizar las prácticas que generen mayor impacto con los recursos que ya tienes.',
    deep: 'Puedes ampliar tus conocimientos conectando fundamentos, datos y práctica en una ruta más especializada.',
    learn: 'Tu curiosidad es una ventaja; darle un pequeño proyecto concreto puede convertirla en una habilidad nueva.'
  };

  const welcome = document.createElement('div');
  welcome.className = 'agx-welcome-layer';
  welcome.dataset.agxWelcome = '';
  welcome.hidden = true;
  welcome.innerHTML = `
    <div class="agx-welcome__backdrop" aria-hidden="true"></div>
    <section class="agx-welcome__card" role="dialog" aria-modal="true" aria-labelledby="agx-welcome-title">
      <img class="agx-welcome__mascot" src="${mascot}" alt="" width="256" height="384" draggable="false">
      <button class="agx-welcome__close" type="button" aria-label="Cerrar cuestionario" data-agx-welcome-close>×</button>
      <div class="agx-welcome__view" data-agx-welcome-view></div>
    </section>`;

  const cookie = document.createElement('aside');
  cookie.className = 'agx-cookie';
  cookie.dataset.agxCookie = '';
  cookie.hidden = true;
  cookie.setAttribute('role', 'dialog');
  cookie.setAttribute('aria-label', 'Aviso de cookies');
  cookie.innerHTML = `
    <div class="agx-cookie__copy">
      <strong>Tu privacidad importa</strong>
      <span>Usamos cookies necesarias para que el sitio funcione y guardar tus preferencias. Consulta nuestra <a href="privacidad.html">Política de Privacidad</a>.</span>
    </div>
    <button class="agx-cookie__accept" type="button" data-agx-cookie-accept>Acepto</button>`;

  document.body.append(welcome, cookie);

  const card = welcome.querySelector('.agx-welcome__card');
  const view = welcome.querySelector('[data-agx-welcome-view]');
  const acceptButton = cookie.querySelector('[data-agx-cookie-accept]');
  let lastFocus = null;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
  const optionOf = (question, value) => question?.options.find((option) => option.value === value);
  const answerValues = (id) => Array.isArray(answers[id]) ? answers[id] : answers[id] ? [answers[id]] : [];
  const levelOf = (question, value) => optionOf(question, value)?.level || 'basico';

  function buildProfile() {
    const profile = { interests: [], labels: {} };
    questions.forEach((question) => {
      const values = answerValues(question.id);
      if (!values.length) return;
      const labels = values.map((value) => optionOf(question, value)?.title || value);
      if (question.dimension === 'interests') {
        profile.interests = values;
        profile.labels.interests = labels;
      } else if (question.dimension === 'level') {
        profile.level = levelOf(question, values[0]);
        profile.labels.level = labels[0];
      } else {
        profile[question.dimension] = values[0];
        profile.labels[question.dimension] = labels[0];
      }
    });
    return profile;
  }

  function recommend(profile) {
    const interestWeights = [34, 26, 18];
    return courses.map((course, index) => {
      const tags = course.tags || {};
      let score = 0;
      profile.interests.forEach((value, position) => {
        if ((tags.interests || []).includes(value)) {
          score += interestWeights[position] || 14;
          if (tags.interests[0] === value) score += [10, 5, 2][position] || 2;
        }
      });
      if ((tags.goals || []).includes(profile.goal)) score += 16;
      if ((tags.problems || []).includes(profile.problem)) score += 14;
      if ((tags.profiles || []).includes(profile.profile)) score += 8;
      if ((tags.levels || []).length) score += tags.levels.includes(profile.level) ? 6 : -3;
      const minutes = course.classes.reduce((total, lesson) => total + (lesson.min || 0), 0);
      if (profile.time === 'lt1' && minutes && minutes <= 240) score += 4;
      if (profile.time === '1-2' && minutes && minutes <= 300) score += 2;
      if (profile.time === '5plus' && minutes >= 360) score += 3;
      return { course, score, index, minutes };
    }).sort((a, b) => b.score - a.score || a.index - b.index)[0];
  }

  function introMarkup() {
    return `
      <div class="agx-welcome__pane agx-welcome__pane--intro">
        <p class="agx-welcome__eyebrow">Tu guía AgroTec</p>
        <h2 class="agx-welcome__title" id="agx-welcome-title">¡Hola! Quiero conocerte un poquito para recomendarte una ruta hecha para ti.</h2>
        <p class="agx-welcome__note">¿Comenzamos? Son 7 preguntas sencillas y toma menos de 2 minutos.</p>
        <ul class="agx-welcome__features" aria-label="Características del cuestionario">
          <li>Sin nombre</li><li>Sin teléfono</li><li>Resultado inmediato</li>
        </ul>
        <div class="agx-welcome__actions">
          <button class="agx-welcome__button agx-welcome__button--primary" type="button" data-agx-start>Preparar mi ruta</button>
          <button class="agx-welcome__button agx-welcome__button--secondary" type="button" data-agx-welcome-close>Ahora no</button>
        </div>
      </div>`;
  }

  function questionMarkup(question) {
    const values = answerValues(question.id);
    const isMulti = question.type === 'multi';
    const options = question.options.map((option) => {
      const selected = values.includes(option.value);
      const image = question.id === 'areas' && option.image
        ? `<span class="agx-option__image" style="background-image:url('${escapeHtml(option.image)}')"></span>`
        : `<span class="agx-option__icon" aria-hidden="true">${iconByValue[option.value] || '🌾'}</span>`;
      return `
        <button class="agx-option${selected ? ' is-selected' : ''}" type="button" data-agx-option="${escapeHtml(option.value)}" aria-pressed="${selected}">
          ${image}
          <span class="agx-option__copy"><strong>${escapeHtml(option.title)}</strong>${option.detail ? `<small>${escapeHtml(option.detail)}</small>` : ''}</span>
          <span class="agx-option__check" aria-hidden="true">✓</span>
        </button>`;
    }).join('');
    const progress = Math.round(((step + 1) / questions.length) * 100);
    return `
      <div class="agx-welcome__pane agx-welcome__pane--question">
        <div class="agx-progress" aria-label="Pregunta ${step + 1} de ${questions.length}">
          <span>Pregunta ${step + 1} de ${questions.length}</span><b>${progress}%</b>
          <i><em style="width:${progress}%"></em></i>
        </div>
        <p class="agx-welcome__eyebrow">${escapeHtml(question.kicker)}</p>
        <h2 class="agx-welcome__question" id="agx-welcome-title" tabindex="-1">${escapeHtml(question.title)}</h2>
        <p class="agx-welcome__hint">${escapeHtml(question.hint)}${isMulti ? ` <b>${values.length}/${question.max || 3}</b>` : ''}</p>
        <div class="agx-options${question.id === 'areas' ? ' agx-options--topics' : ''}">${options}</div>
        <div class="agx-welcome__actions agx-welcome__actions--steps">
          <button class="agx-welcome__button agx-welcome__button--secondary" type="button" data-agx-back>${step ? 'Atrás' : 'Volver'}</button>
          ${isMulti
            ? `<button class="agx-welcome__button agx-welcome__button--primary" type="button" data-agx-next ${values.length ? '' : 'disabled'}>${step === questions.length - 1 ? 'Ver mi resultado' : 'Continuar'}</button>`
            : '<span class="agx-welcome__autonext">Elige una respuesta y avanzamos automáticamente</span>'}
        </div>
      </div>`;
  }

  function goForward() {
    if (step === questions.length - 1) screen = 'result';
    else step += 1;
    render();
  }

  function resultMarkup() {
    const profile = buildProfile();
    const result = recommend(profile);
    const learning = learningProfiles[profile.format] || learningProfiles.mix;
    const growth = growthByNeed[profile.problem] || growthByNeed.learn;
    const course = result?.course;
    const timeLabel = profile.time === 'lt1' ? 'en ratos cortos' : profile.time === '1-2' ? 'a un ritmo de una clase por semana' : profile.time === '3-5' ? 'con un ritmo constante' : 'avanzando a profundidad';
    return `
      <div class="agx-welcome__pane agx-welcome__pane--result">
        <p class="agx-welcome__eyebrow">Tu ruta está lista</p>
        <h2 class="agx-welcome__title" id="agx-welcome-title" tabindex="-1">Tienes un estilo <span>${escapeHtml(learning.name)}</span>.</h2>
        <div class="agx-profile">
          <div class="agx-profile__celebration" aria-hidden="true">✨</div>
          <p class="agx-profile__flower"><strong>Esto dice algo muy bueno de ti:</strong> ${escapeHtml(learning.flower)}</p>
          <p>${escapeHtml(learning.strength)} ${escapeHtml(growth)}</p>
        </div>
        ${course ? `
          <article class="agx-course">
            <img src="${escapeHtml(course.image)}" alt="" width="220" height="145">
            <div class="agx-course__copy">
              <span>Tu mejor siguiente paso</span>
              <h3>${escapeHtml(course.title)}</h3>
              <p>${escapeHtml(course.summary)} Puedes estudiarlo ${escapeHtml(timeLabel)}.</p>
              <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener">Conocer el curso <b aria-hidden="true">→</b></a>
            </div>
          </article>` : ''}
        <div class="agx-membership">
          <div><span>AgroClub mensual</span><strong>$200 <small>MXN/mes</small></strong></div>
          <div><span>AgroClub anual</span><strong>$1,920 <small>MXN/año</small></strong><em>Equivale a $160/mes</em></div>
        </div>
        <div class="agx-welcome__actions agx-welcome__actions--result">
          <button class="agx-welcome__button agx-welcome__button--primary" type="button" data-agx-membership>Ver la membresía</button>
          <button class="agx-welcome__button agx-welcome__button--secondary" type="button" data-agx-restart>Responder de nuevo</button>
        </div>
        <p class="agx-welcome__privacy">Tu resultado se calculó en este navegador. No pedimos ni enviamos datos personales.</p>
      </div>`;
  }

  function render({ focus = true } = {}) {
    card.dataset.screen = screen;
    card.dataset.step = String(step);
    view.innerHTML = screen === 'intro' ? introMarkup() : screen === 'result' ? resultMarkup() : questionMarkup(questions[step]);
    welcome.scrollTop = 0;
    if (focus) requestAnimationFrame(() => view.querySelector('#agx-welcome-title')?.focus({ preventScroll: true }));
  }

  function resetRoute() {
    clearTimeout(advanceTimer);
    advanceTimer = 0;
    card.classList.remove('is-advancing');
    Object.keys(answers).forEach((key) => delete answers[key]);
    screen = 'intro';
    step = 0;
  }

  function openWelcome({ restart = false } = {}) {
    if (restart) resetRoute();
    lastFocus = document.activeElement;
    welcome.hidden = false;
    document.body.classList.add('agx-welcome-open');
    render({ focus: false });
    requestAnimationFrame(() => {
      welcome.classList.add('is-open');
      view.querySelector('[data-agx-start]')?.focus({ preventScroll: true });
    });
  }

  function closeWelcome() {
    clearTimeout(advanceTimer);
    advanceTimer = 0;
    card.classList.remove('is-advancing');
    welcome.classList.remove('is-open');
    document.body.classList.remove('agx-welcome-open');
    setTimeout(() => { welcome.hidden = true; }, 270);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  }

  function keepFocusInside(event) {
    if (event.key !== 'Tab' || welcome.hidden) return;
    const focusable = [...card.querySelectorAll('button:not([disabled]), a[href]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  welcome.addEventListener('click', (event) => {
    if (event.target.closest('[data-agx-welcome-close]')) { closeWelcome(); return; }
    if (event.target.closest('[data-agx-start]')) { screen = 'question'; step = 0; render(); return; }
    if (event.target.closest('[data-agx-back]')) {
      clearTimeout(advanceTimer);
      advanceTimer = 0;
      card.classList.remove('is-advancing');
      if (step === 0) screen = 'intro'; else step -= 1;
      render(); return;
    }
    if (event.target.closest('[data-agx-next]')) {
      if (!answerValues(questions[step].id).length) return;
      goForward(); return;
    }
    if (event.target.closest('[data-agx-restart]')) {
      Object.keys(answers).forEach((key) => delete answers[key]);
      screen = 'question'; step = 0; render(); return;
    }
    if (event.target.closest('[data-agx-membership]')) {
      closeWelcome();
      setTimeout(() => document.querySelector('#membresia')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      return;
    }
    const optionButton = event.target.closest('[data-agx-option]');
    if (!optionButton) return;
    const question = questions[step];
    const value = optionButton.dataset.agxOption;
    if (question.type === 'multi') {
      const selected = answerValues(question.id);
      answers[question.id] = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : selected.length < (question.max || 3) ? [...selected, value] : selected;
    } else {
      answers[question.id] = value;
    }
    const restoreKeyboardFocus = event.detail === 0;
    render({ focus: false });
    if (restoreKeyboardFocus) view.querySelector(`[data-agx-option="${CSS.escape(value)}"]`)?.focus({ preventScroll: true });
    if (question.type !== 'multi') {
      clearTimeout(advanceTimer);
      card.classList.add('is-advancing');
      view.querySelectorAll('[data-agx-option]').forEach((button) => { button.disabled = true; });
      advanceTimer = window.setTimeout(() => {
        card.classList.remove('is-advancing');
        if (!welcome.hidden && screen === 'question') goForward();
      }, 420);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (escapeKey(event) && !welcome.hidden) closeWelcome();
    else keepFocusInside(event);
  });

  // Todos los accesos a la ruta del index abren este mismo cuadro. La URL de
  // /encuesta/ permanece como respaldo si JavaScript no está disponible.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = (link.getAttribute('href') || '').replace(/^\.\//, '');
    if (!/^encuesta\/?(?:[?#].*)?$/.test(href)) return;
    event.preventDefault();
    openWelcome({ restart: true });
  });
  window.agrotecOpenRoute = () => openWelcome({ restart: true });

  let cookiesAccepted = false;
  try { cookiesAccepted = localStorage.getItem(cookieKey) === 'accepted'; } catch {}
  window.agrotecCookieConsent = { necessary: true, preferences: cookiesAccepted };
  if (!cookiesAccepted) cookie.hidden = false;

  acceptButton.addEventListener('click', () => {
    try { localStorage.setItem(cookieKey, 'accepted'); } catch {}
    window.agrotecCookieConsent = { necessary: true, preferences: true, acceptedAt: new Date().toISOString() };
    cookie.hidden = true;
  });

  // Se abre en cada carga por solicitud del proyecto; no se guarda una marca de cierre.
  openWelcome();
})();
