/* ==========================================================================
   AgroTec América · Encuesta
   Flujo: intro → una pregunta por pantalla → ruta recomendada.
   Lee la configuración desde Firestore (`encuesta_config/main`) con respaldo
   en encuesta-defaults.js y guarda cada respuesta anónima en
   `encuesta_respuestas`.
   ========================================================================== */
(() => {
  'use strict';

  const DEFAULTS = window.AGROTEC_ENCUESTA_DEFAULTS;
  const FB = window.AGROTEC_FIREBASE;
  const SITE_BASE = '../';
  const STORAGE_KEY = 'agrotec-encuesta:v2';
  const CONFIG_WAIT_MS = 4000;

  const $stage = document.getElementById('stage');
  const $progress = document.getElementById('progress');
  const $actionbar = document.getElementById('actionbar');
  const $later = document.getElementById('later');

  /* ---------- Utilidades ---------- */
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
  const fill = (text, n) => String(text ?? '').replace(/\{n\}/g, n);
  const assetUrl = (path) => (/^(https?:)?\/\//i.test(path) || path.startsWith('/') ? path : SITE_BASE + path);

  const ICONS = {
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    spinner: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    'brand:instagram': '<svg viewBox="0 0 24 24"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f9a33b"/><stop offset=".5" stop-color="#e1306c"/><stop offset="1" stop-color="#7b3fc4"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="#fff"/></svg>',
    'brand:facebook': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877f2"/><path d="M13.4 20v-6.2h2.1l.3-2.5h-2.4V9.7c0-.7.2-1.2 1.2-1.2h1.3V6.3c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.9H8.8v2.5h2.1V20z" fill="#fff"/></svg>',
    'brand:tiktok': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#111"/><path d="M13.6 6h2c.1 1.5 1.1 2.6 2.6 2.8v2c-1 0-1.9-.3-2.6-.8v4.3a3.8 3.8 0 1 1-3.8-3.8c.2 0 .5 0 .7.1v2.1a1.7 1.7 0 1 0 1.1 1.6z" fill="#fff"/><path d="M13.6 6h2c.1 1.5 1.1 2.6 2.6 2.8v2c-1 0-1.9-.3-2.6-.8" fill="none" stroke="#25f4ee" stroke-width=".6"/></svg>',
    'brand:google': '<svg viewBox="0 0 24 24"><path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285f4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34a853"/><path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#fbbc04"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#ea4335"/></svg>',
    'brand:whatsapp': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25d366"/><path d="M12 5.5a6.5 6.5 0 0 0-5.6 9.8L5.5 18.5l3.3-.9A6.5 6.5 0 1 0 12 5.5z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M9.6 9.2c.2-.4.4-.4.6-.4h.4c.2 0 .3.1.4.3l.6 1.3c.1.2 0 .4-.1.5l-.4.5c-.1.1-.1.3 0 .4.4.7 1.2 1.5 2.1 1.9.2.1.3.1.4 0l.6-.7c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4 0 .5-.2 1.1-.7 1.4-.5.3-1 .4-1.6.2-1.9-.6-3.6-2.1-4.6-3.9-.4-.8-.3-1.7.2-2.4z" fill="#fff"/></svg>'
  };

  const iconMarkup = (icon) => {
    if (!icon) return '';
    if (ICONS[icon]) return ICONS[icon];
    return esc(icon);
  };

  /* ---------- Configuración ---------- */
  const normalizeConfig = window.AGROTEC_ENCUESTA_UTILS.normalizeConfig;

  let config = clone(DEFAULTS);
  let configReady = false;

  const loadRemoteConfig = async () => {
    try {
      const { db, doc, getDoc } = await FB.getDb();
      const snap = await getDoc(doc(db, FB.COLLECTIONS.config, 'main'));
      if (snap.exists()) config = normalizeConfig(snap.data());
    } catch (error) {
      console.warn('[encuesta] Config remota no disponible, usando predeterminada.', error);
    } finally {
      configReady = true;
      if (state.screen === 'intro') renderIntro();
    }
  };

  const waitForConfig = () => new Promise((resolve) => {
    if (configReady) return resolve();
    const started = Date.now();
    const tick = () => (configReady || Date.now() - started > CONFIG_WAIT_MS ? resolve() : setTimeout(tick, 60));
    tick();
  });

  /* ---------- Estado ---------- */
  const state = { screen: 'intro', step: 0, answers: {}, startedAt: 0, saving: null };

  const questions = () => config.preguntas;
  const findQuestion = (id) => questions().find((q) => q.id === id);
  const optionTitle = (id, value) => findQuestion(id)?.options.find((o) => o.value === value)?.title || String(value ?? '');
  const answerValues = (id) => {
    const value = state.answers[id];
    return Array.isArray(value) ? value : value ? [value] : [];
  };
  const areasQuestion = () => findQuestion('areas') || questions().find((q) => q.type === 'multi');

  const readStored = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
  };
  const writeStored = (value) => {
    try { value ? localStorage.setItem(STORAGE_KEY, JSON.stringify(value)) : localStorage.removeItem(STORAGE_KEY); } catch { /* sin almacenamiento */ }
  };

  /* ---------- Recomendación ---------- */
  const recommend = () => {
    const available = config.cursos.filter((c) => c.available !== false);
    const areaQ = areasQuestion();
    const chosen = areaQ ? answerValues(areaQ.id) : [];
    const scored = available
      .map((course, index) => {
        let score = 0;
        (course.areas || []).forEach((area) => {
          const position = chosen.indexOf(area);
          if (position >= 0) score += (chosen.length - position) * 10;
        });
        return { course, score, index };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const picks = scored.slice(0, 3).map((item) => item.course);
    return picks.length ? picks : available.slice(0, 3);
  };

  /* ---------- Render: barra superior ---------- */
  const renderProgress = () => {
    const total = questions().length;
    $later.textContent = config.textos.nav.later;
    $later.href = config.textos.nav.laterUrl || '../';
    if (state.screen === 'intro') {
      $progress.innerHTML = `<div class="segments">${questions().map(() => '<span></span>').join('')}</div><span class="progress__label">${total} preguntas</span>`;
      return;
    }
    if (state.screen === 'done') {
      $progress.innerHTML = `<div class="segments">${questions().map(() => '<span class="is-done"></span>').join('')}</div><span class="progress__label">Completado</span>`;
      return;
    }
    $progress.innerHTML = `<div class="segments">${questions().map((_, i) => `<span class="${i < state.step ? 'is-done' : i === state.step ? 'is-current' : ''}"></span>`).join('')}</div><span class="progress__label">${state.step + 1} de ${total}</span>`;
  };

  /* ---------- Render: intro ---------- */
  const renderIntro = () => {
    state.screen = 'intro';
    const t = config.textos.intro;
    const n = questions().length;
    $stage.innerHTML = `
      <section class="screen screen--intro">
        <p class="eyebrow">${esc(t.eyebrow)}</p>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(t.title)} <span class="title__accent">${esc(t.titleAccent)}</span></h1>
        <p class="lead">${esc(fill(t.subtitle, n))}</p>
        <div class="stats">
          ${(t.stats || []).slice(0, 3).map((s) => `
            <div class="stat">
              <span class="stat__icon" aria-hidden="true">${ICONS[s.icon] || ICONS.list}</span>
              <span><strong>${esc(fill(s.title, n))}</strong><small>${esc(fill(s.detail, n))}</small></span>
            </div>`).join('')}
        </div>
      </section>`;
    $actionbar.innerHTML = `
      <span class="actionbar__legal">${esc(t.legal)} <a href="../privacidad.html">Leer aviso</a></span>
      <div class="actionbar__right">
        <button class="btn" type="button" data-start>${esc(t.button)} ${ICONS.arrowRight}</button>
      </div>`;
    renderProgress();
    $actionbar.querySelector('[data-start]').addEventListener('click', start);
  };

  const start = async () => {
    const button = $actionbar.querySelector('[data-start]');
    if (!configReady && button) {
      button.classList.add('is-busy');
      button.innerHTML = `${esc(config.textos.intro.button)} ${ICONS.spinner}`;
      await waitForConfig();
    }
    state.step = 0;
    state.answers = {};
    state.startedAt = Date.now();
    renderQuestion();
  };

  /* ---------- Render: pregunta ---------- */
  const optionMarkup = (question, option, index, selected, maxed) => `
    <button class="opt ${maxed && !selected ? 'is-maxed' : ''}" type="button" style="--i:${index}"
      role="${question.type === 'multi' ? 'checkbox' : 'radio'}" aria-checked="${selected}" data-answer="${esc(option.value)}">
      <span class="opt__icon" aria-hidden="true">${iconMarkup(option.icon)}</span>
      <span class="opt__label"><strong>${esc(option.title)}</strong>${option.detail ? `<small>${esc(option.detail)}</small>` : ''}</span>
      ${index < 9 ? `<span class="opt__key" aria-hidden="true">${index + 1}</span>` : ''}
      <span class="opt__radio" aria-hidden="true">${ICONS.check}</span>
    </button>`;

  const renderQuestion = () => {
    state.screen = 'question';
    const flow = questions();
    const question = flow[state.step];
    const selected = answerValues(question.id);
    const isMulti = question.type === 'multi';
    const maxed = isMulti && selected.length >= question.max;
    const isLast = state.step === flow.length - 1;
    const nav = config.textos.nav;
    const layoutClass = question.layout === 'tiles' ? 'options--tiles' : question.layout === 'chips' ? 'options--chips' : '';

    $stage.innerHTML = `
      <section class="screen screen--question">
        <div class="q-head">
          <p class="q-num" aria-hidden="true">${pad(state.step + 1)}</p>
          <p class="eyebrow">${esc(question.kicker)}</p>
        </div>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(question.title)}</h1>
        ${question.hint ? `<p class="q-hint">${esc(question.hint)}</p>` : ''}
        <div class="options ${layoutClass}" role="${isMulti ? 'group' : 'radiogroup'}" aria-label="${esc(question.title)}">
          ${question.options.map((option, index) => optionMarkup(question, option, index, selected.includes(option.value), maxed)).join('')}
        </div>
        ${isMulti ? `<p class="multi-count">Elegiste <b>${selected.length}</b> de ${question.max}</p>` : ''}
      </section>`;

    $actionbar.innerHTML = `
      <button class="btn btn--ghost" type="button" data-back ${state.step === 0 ? 'disabled' : ''}>${ICONS.arrowLeft} ${esc(nav.back)}</button>
      <div class="actionbar__right">
        <span class="actionbar__hint">${esc(nav.hint)} <kbd>↵</kbd></span>
        <button class="btn" type="button" data-next ${selected.length ? '' : 'disabled'}>${esc(isLast ? nav.finish : nav.next)} ${ICONS.arrowRight}</button>
      </div>`;

    renderProgress();
    bindQuestion(question);
    focusTitle();
  };

  const bindQuestion = (question) => {
    $stage.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', () => selectAnswer(question, button.dataset.answer));
    });
    $actionbar.querySelector('[data-back]')?.addEventListener('click', goBack);
    $actionbar.querySelector('[data-next]')?.addEventListener('click', advance);
  };

  const selectAnswer = (question, value) => {
    if (question.type === 'multi') {
      const current = answerValues(question.id).slice();
      const index = current.indexOf(value);
      if (index >= 0) current.splice(index, 1);
      else if (current.length < question.max) current.push(value);
      else return;
      state.answers[question.id] = current;
      $stage.querySelectorAll('[data-answer]').forEach((button) => {
        const on = current.includes(button.dataset.answer);
        button.setAttribute('aria-checked', String(on));
        button.classList.toggle('is-maxed', !on && current.length >= question.max);
      });
      const counter = $stage.querySelector('.multi-count');
      if (counter) counter.innerHTML = `Elegiste <b>${current.length}</b> de ${question.max}`;
      $actionbar.querySelector('[data-next]').disabled = current.length === 0;
      return;
    }
    state.answers[question.id] = value;
    $stage.querySelectorAll('[data-answer]').forEach((button) => button.setAttribute('aria-checked', String(button.dataset.answer === value)));
    $actionbar.querySelector('[data-next]').disabled = false;
  };

  const advance = () => {
    const question = questions()[state.step];
    if (!answerValues(question.id).length) return;
    if (state.step >= questions().length - 1) return finish();
    state.step += 1;
    renderQuestion();
  };

  const goBack = () => {
    if (state.step === 0) return;
    state.step -= 1;
    renderQuestion();
  };

  const focusTitle = () => requestAnimationFrame(() => {
    const title = $stage.querySelector('#screen-title');
    if (title) title.focus({ preventScroll: !isMobile() });
    if (isMobile()) window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* ---------- Final: guardar y recomendar ---------- */
  const buildPayload = (recommended) => {
    const labels = {};
    questions().forEach((q) => {
      const values = answerValues(q.id);
      if (values.length) labels[q.id] = values.map((v) => optionTitle(q.id, v));
    });
    return {
      answers: clone(state.answers),
      labels,
      recommended: recommended.map((c) => c.id),
      configVersion: config.version,
      device: isMobile() ? 'mobile' : 'desktop',
      ua: String(navigator.userAgent || '').slice(0, 120),
      lang: navigator.language || '',
      ref: (() => { try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; } })(),
      durationSec: state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : null
    };
  };

  const saveResponse = async (payload) => {
    const { db, collection, addDoc, serverTimestamp } = await FB.getDb();
    const ref = await addDoc(collection(db, FB.COLLECTIONS.responses), { ...payload, createdAt: serverTimestamp() });
    return ref.id;
  };

  const finish = () => {
    const recommended = recommend();
    const payload = buildPayload(recommended);
    writeStored({ at: Date.now(), answers: payload.answers });
    renderDone(recommended, 'saving');
    saveResponse(payload)
      .then(() => setStatus('ok'))
      .catch((error) => { console.error('[encuesta] No se pudo guardar la respuesta', error); setStatus('error'); });
  };

  const setStatus = (status) => {
    const el = $stage.querySelector('.done__status');
    if (!el) return;
    el.className = `done__status ${status === 'ok' ? 'is-ok' : status === 'error' ? 'is-error' : ''}`;
    el.textContent = status === 'ok' ? 'Tus respuestas se guardaron de forma anónima.'
      : status === 'error' ? 'No pudimos guardar tus respuestas, pero tu ruta ya está lista.'
      : 'Guardando tus respuestas…';
  };

  const renderDone = (recommended, status) => {
    state.screen = 'done';
    const t = config.textos.final;
    $stage.innerHTML = `
      <section class="screen done">
        <div class="done__mark" aria-hidden="true">${ICONS.check}</div>
        <p class="eyebrow">${esc(t.eyebrow)}</p>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(t.title)} <span class="title__accent">${esc(t.titleAccent)}</span></h1>
        <p class="lead">${esc(t.subtitle)}</p>
        <p class="eyebrow done__eyebrow">${esc(t.coursesEyebrow)}</p>
        ${recommended.length ? `
          <div class="courses">
            ${recommended.map((course, i) => `
              <a class="course" style="--i:${i}" href="${esc(course.url || t.buttonUrl || '#')}" target="_blank" rel="noopener">
                <span class="course__media">${course.image ? `<img src="${esc(assetUrl(course.image))}" alt="" loading="lazy">` : ''}</span>
                <span>
                  <span class="course__meta">${esc([course.category, course.level].filter(Boolean).join(' · '))}</span>
                  <span class="course__title">${esc(course.title)}</span>
                </span>
                <span class="course__arrow" aria-hidden="true">${ICONS.arrowRight}</span>
              </a>`).join('')}
          </div>` : `<p class="done__empty">${esc(t.emptyCourses)}</p>`}
        ${status ? '<p class="done__status"></p>' : ''}
      </section>`;
    $actionbar.innerHTML = `
      <button class="btn btn--ghost" type="button" data-restart>${esc(t.again)}</button>
      <div class="actionbar__right">
        <a class="btn" href="${esc(t.buttonUrl || '../')}">${esc(t.button)} ${ICONS.arrowRight}</a>
      </div>`;
    renderProgress();
    if (status) setStatus(status);
    $actionbar.querySelector('[data-restart]').addEventListener('click', restart);
    focusTitle();
  };

  const restart = () => {
    writeStored(null);
    state.answers = {};
    state.step = 0;
    renderIntro();
  };

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter') {
      /* Si el foco está en un botón o enlace, el navegador ya dispara su clic. */
      if (event.target instanceof Element && event.target.closest('button, a')) return;
      if (state.screen === 'intro') { event.preventDefault(); start(); }
      else if (state.screen === 'question') { event.preventDefault(); advance(); }
      return;
    }
    if (state.screen !== 'question') return;
    const number = Number(event.key);
    if (!Number.isInteger(number) || number < 1 || number > 9) return;
    const target = $stage.querySelectorAll('[data-answer]')[number - 1];
    if (target) target.click();
  });

  /* ---------- Arranque ---------- */
  const boot = async () => {
    const stored = readStored();
    loadRemoteConfig();
    if (stored && stored.answers && typeof stored.answers === 'object') {
      await waitForConfig();
      state.answers = stored.answers;
      renderDone(recommend(), null);
      return;
    }
    renderIntro();
  };

  boot();
})();
