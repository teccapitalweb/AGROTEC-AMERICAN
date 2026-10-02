/* ==========================================================================
   AgroTec América · Encuesta de diagnóstico
   Flujo: intro → preguntas (composición distinta por tipo) → "Analizando…"
   → curso real recomendado + clase real del club → login/clase.
   Config desde Firestore (`encuesta_config/main`) con respaldo local; cada
   respuesta se guarda en `encuesta_respuestas` y se actualiza al hacer clic
   en la clase.
   ========================================================================== */
(() => {
  'use strict';

  const DEFAULTS = window.AGROTEC_ENCUESTA_DEFAULTS;
  const { clone, normalizeConfig } = window.AGROTEC_ENCUESTA_UTILS;
  const FB = window.AGROTEC_FIREBASE;
  const ICONS = window.AGROTEC_ICONS || {};
  const SITE_BASE = '../';
  const STORAGE_KEY = 'agrotec-encuesta:v3';
  const CONFIG_WAIT_MS = 4000;
  const LEAVE_MS = 180;

  const els = {
    app: document.getElementById('app'),
    stage: document.getElementById('stage'),
    progress: document.getElementById('progress'),
    actionbar: document.getElementById('actionbar'),
    later: document.getElementById('later'),
    agro: document.getElementById('agro'),
    agroName: document.getElementById('agro-name'),
    agroText: document.getElementById('agro-text'),
    agroProps: document.getElementById('agro-props')
  };

  /* ---------- Utilidades ---------- */
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fill = (text, map) => String(text ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
  const assetUrl = (path) => (!path ? '' : /^(https?:)?\/\//i.test(path) || path.startsWith('/') ? path : SITE_BASE + path);
  const fmtMin = (min) => (!min ? '' : min >= 60 ? `${Math.floor(min / 60)} h ${pad(min % 60)} min` : `${min} min`);
  const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const BRAND = {
    instagram: '<svg viewBox="0 0 24 24"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f9a33b"/><stop offset=".5" stop-color="#e1306c"/><stop offset="1" stop-color="#7b3fc4"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="#fff"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877f2"/><path d="M13.4 20v-6.2h2.1l.3-2.5h-2.4V9.7c0-.7.2-1.2 1.2-1.2h1.3V6.3c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.9H8.8v2.5h2.1V20z" fill="#fff"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#111"/><path d="M13.6 6h2c.1 1.5 1.1 2.6 2.6 2.8v2c-1 0-1.9-.3-2.6-.8v4.3a3.8 3.8 0 1 1-3.8-3.8c.2 0 .5 0 .7.1v2.1a1.7 1.7 0 1 0 1.1 1.6z" fill="#fff"/></svg>',
    google: '<svg viewBox="0 0 24 24"><path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285f4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34a853"/><path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#fbbc04"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#ea4335"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25d366"/><path d="M12 5.5a6.5 6.5 0 0 0-5.6 9.8L5.5 18.5l3.3-.9A6.5 6.5 0 1 0 12 5.5z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M9.6 9.2c.2-.4.4-.4.6-.4h.4c.2 0 .3.1.4.3l.6 1.3c.1.2 0 .4-.1.5l-.4.5c-.1.1-.1.3 0 .4.4.7 1.2 1.5 2.1 1.9.2.1.3.1.4 0l.6-.7c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4 0 .5-.2 1.1-.7 1.4-.5.3-1 .4-1.6.2-1.9-.6-3.6-2.1-4.6-3.9-.4-.8-.3-1.7.2-2.4z" fill="#fff"/></svg>'
  };

  const svg = (name, cls = 'ico') => (ICONS[name] ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>` : '');
  const iconMarkup = (icon) => {
    if (!icon) return '';
    if (icon.startsWith('i:')) return svg(icon.slice(2)) || esc(icon);
    if (icon.startsWith('brand:')) return BRAND[icon.slice(6)] || '';
    return esc(icon);
  };
  const I = {
    check: svg('check'), arrowRight: svg('arrow-right', 'ico ico--arrow'), arrowLeft: svg('arrow-left', 'ico ico--back'),
    spinner: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
    play: '<svg class="ico ico--play" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>',
    sparkles: svg('sparkles'), clock: svg('clock'), layers: svg('list-checks'), award: svg('award'), star: svg('star'), partyPopper: svg('party-popper'),
    tablet: svg('tablet'), calculator: svg('calculator'), thumbsUp: svg('thumbs-up'), brain: svg('brain'), wand: svg('wand-sparkles'), zap: svg('zap'), badgeCheck: svg('badge-check')
  };

  /* ---------- Configuración ---------- */
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
      if (state.screen === 'intro') renderIntro(false);
    }
  };
  const waitForConfig = () => new Promise((resolve) => {
    if (configReady) return resolve();
    const started = Date.now();
    const tick = () => (configReady || Date.now() - started > CONFIG_WAIT_MS ? resolve() : setTimeout(tick, 60));
    tick();
  });

  /* ---------- Estado ---------- */
  const state = { screen: 'intro', step: 0, answers: {}, startedAt: 0, responseId: null, result: null, saveState: null };

  const questions = () => config.preguntas;
  const findQuestion = (id) => questions().find((q) => q.id === id);
  const byDimension = (dimension) => questions().find((q) => q.dimension === dimension);
  const optionOf = (question, value) => question?.options.find((o) => o.value === value);
  const answerValues = (id) => {
    const value = state.answers[id];
    return Array.isArray(value) ? value : value != null && value !== '' ? [value] : [];
  };
  const availableCourses = () => config.cursos.filter((c) => c.available !== false && Array.isArray(c.classes) && c.classes.length);
  const textVars = () => ({ n: questions().length, c: availableCourses().length });

  const readStored = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } };
  const writeStored = (value) => { try { value ? localStorage.setItem(STORAGE_KEY, JSON.stringify(value)) : localStorage.removeItem(STORAGE_KEY); } catch { /* sin almacenamiento */ } };

  /* ---------- Perfil y motor de recomendación ---------- */
  const levelOf = (question, value) => {
    const option = optionOf(question, value);
    if (option?.level) return option.level;
    const index = question.options.findIndex((o) => o.value === value);
    const ratio = question.options.length > 1 ? index / (question.options.length - 1) : 0;
    return ratio < 0.34 ? 'basico' : ratio < 0.67 ? 'intermedio' : 'avanzado';
  };

  const buildProfile = () => {
    const profile = { interests: [], labels: {} };
    questions().forEach((q) => {
      const values = answerValues(q.id);
      if (!values.length) return;
      const labels = values.map((v) => optionOf(q, v)?.title || String(v));
      if (q.dimension === 'interests') { profile.interests = values.slice(); profile.labels.interests = labels; return; }
      if (q.dimension === 'level') { profile.level = levelOf(q, values[0]); profile.levelValue = values[0]; profile.labels.level = labels[0]; return; }
      if (q.dimension && q.dimension !== 'none') { profile[q.dimension] = values[0]; profile.labels[q.dimension] = labels[0]; }
    });
    return profile;
  };

  const lower = (text) => String(text || '').trim().replace(/^\w/, (c) => c.toLowerCase());

  const recommend = (profile) => {
    const courses = availableCourses();
    if (!courses.length) return null;
    const INTEREST_W = [30, 24, 18];
    const scored = courses.map((course, index) => {
      const tags = course.tags || {};
      let score = 0;
      const matches = [];
      profile.interests.forEach((value, pos) => {
        if (!(tags.interests || []).includes(value)) return;
        score += INTEREST_W[pos] ?? 14;
        if (tags.interests[0] === value) score += 6;
        matches.push({ kind: 'interest', rank: 1, label: profile.labels.interests?.[pos] || value });
      });
      if (profile.goal && (tags.goals || []).includes(profile.goal)) { score += 14; matches.push({ kind: 'goal', rank: 2, label: profile.labels.goal }); }
      if (profile.profile && (tags.profiles || []).includes(profile.profile)) { score += 10; matches.push({ kind: 'profile', rank: 3, label: profile.labels.profile }); }
      if (profile.level && (tags.levels || []).length) score += tags.levels.includes(profile.level) ? 6 : -2;
      if (profile.problem && (tags.problems || []).includes(profile.problem)) { score += 6; matches.push({ kind: 'problem', rank: 5, label: profile.labels.problem }); }
      const totalMin = course.classes.reduce((a, k) => a + (k.min || 0), 0);
      if (profile.time === 'lt1' && totalMin && totalMin <= 240) score += 4;
      if (profile.time === '5plus' && totalMin >= 360) score += 3;
      const hasFree = course.classes.some((k) => k.free);
      if (hasFree && (['student', 'hobby'].includes(profile.profile) || profile.problem === 'cost')) { score += 8; matches.push({ kind: 'free', rank: 4, label: 'Puedes empezar gratis' }); }
      return { course, score, matches, index, totalMin };
    }).sort((a, b) => b.score - a.score || a.index - b.index);

    const top = scored[0];
    const seen = new Set();
    const matches = top.matches.sort((a, b) => a.rank - b.rank).filter((m) => (seen.has(m.label) ? false : seen.add(m.label))).slice(0, 3);
    const featured = top.course.classes.find((k) => k.n === top.course.featuredClass) || top.course.classes[0];
    return {
      course: top.course, score: top.score, matches, totalMin: top.totalMin, lesson: featured,
      alternatives: scored.slice(1, 3).map((s) => s.course.id),
      why: buildWhy(matches, profile)
    };
  };

  const buildWhy = (matches, profile) => {
    const interests = matches.filter((m) => m.kind === 'interest').map((m) => lower(m.label));
    const parts = [];
    if (interests.length) parts.push(`mostraste interés en ${interests.length > 1 ? `${interests.slice(0, -1).join(', ')} y ${interests[interests.length - 1]}` : interests[0]}`);
    if (matches.some((m) => m.kind === 'goal')) parts.push(`buscas ${lower(profile.labels.goal)}`);
    if (matches.some((m) => m.kind === 'profile')) parts.push(`encaja con tu perfil de ${lower(profile.labels.profile)}`);
    if (!parts.length && profile.labels.goal) parts.push(`buscas ${lower(profile.labels.goal)}`);
    if (!parts.length) parts.push('es un buen punto de partida para tu perfil');
    return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}.` : `${parts[0]}.`;
  };

  /* ---------- Personaje ---------- */
  const MOOD_VARIANT = { greet: 'orange', point: 'guide', think: 'guide', tablet: 'guide', calculator: 'guide', approve: 'orange', surprise: 'orange', celebrate: 'orange' };
  const propsFor = (mood) => {
    switch (mood) {
      case 'think': return '<span class="prop prop--thought"><i></i><i></i><i></i></span>';
      case 'tablet': return `<span class="prop prop--card"><span class="prop__title">${I.tablet} Ruta</span><span class="prop__row"><i style="width:90%"></i></span><span class="prop__row"><i></i></span><span class="prop__row"><i></i></span></span>`;
      case 'calculator': return `<span class="prop prop--card"><span class="prop__title">${I.calculator} Costos</span><span class="prop__screen">1,240</span><span class="prop__grid"><i></i><i></i><i></i><i></i><i></i><i></i></span></span>`;
      case 'approve': return `<span class="prop prop--badge">${I.check}</span>`;
      case 'surprise': return '<span class="prop prop--badge is-orange">!</span>';
      case 'celebrate': return `<span class="prop prop--badge">${I.partyPopper}</span><span class="prop prop--sparks"><i>✦</i><i>✧</i><i>✦</i></span>`;
      case 'greet': return '<span class="prop prop--sparks"><i>✦</i><i>✧</i><i>✦</i></span>';
      default: return '';
    }
  };
  let lastMood = '';
  const setAgro = (mood, text) => {
    const persona = config.textos.personaje;
    els.agroName.textContent = persona.nombre || 'Agro';
    if (mood && mood !== lastMood) {
      lastMood = mood;
      els.agro.dataset.variant = MOOD_VARIANT[mood] || 'orange';
      els.agro.dataset.mood = '';
      void els.agro.offsetWidth; /* reinicia la animación del estado */
      els.agro.dataset.mood = mood;
      els.agroProps.innerHTML = propsFor(mood);
    }
    if (text != null && els.agroText.textContent !== text) {
      els.agroText.classList.remove('is-swapping');
      void els.agroText.offsetWidth;
      els.agroText.textContent = text;
      els.agroText.classList.add('is-swapping');
    }
  };

  /* ---------- Progreso ---------- */
  const renderProgress = () => {
    const total = questions().length;
    els.later.textContent = config.textos.nav.later;
    els.later.href = config.textos.nav.laterUrl || '../';
    const ticks = `<span class="progress__ticks">${Array.from({ length: Math.max(0, total - 1) }, () => '<i></i>').join('')}</span>`;
    if (state.screen === 'intro') {
      els.progress.innerHTML = `<div class="progress"><div class="progress__meta"><span>${total} preguntas</span><small>· menos de 2 min</small></div><div class="progress__track"><span class="progress__fill" style="width:0"></span>${ticks}</div></div>`;
      return;
    }
    if (state.screen === 'analyzing' || state.screen === 'result') {
      els.progress.innerHTML = `<div class="progress progress--done"><div class="progress__meta"><span>${state.screen === 'result' ? 'Completado' : 'Analizando'}</span><span class="progress__pct">100%</span></div><div class="progress__track"><span class="progress__fill" style="width:100%"></span></div></div>`;
      return;
    }
    const pct = Math.round((state.step / total) * 100);
    els.progress.innerHTML = `<div class="progress"><div class="progress__meta"><span>Pregunta ${state.step + 1} de ${total}</span><span class="progress__pct">${pct}%</span></div><div class="progress__track"><span class="progress__fill" style="width:${pct}%"></span>${ticks}</div></div>`;
    requestAnimationFrame(() => { const el = els.progress.querySelector('.progress__fill'); if (el) el.style.width = `${Math.round(((state.step + 1) / total) * 100)}%`; });
  };

  const milestoneText = () => {
    const total = questions().length;
    const next = state.step + 1;
    if (next === total) return config.textos.avance.ultima;
    if (next / total >= 0.75) return config.textos.avance.casi;
    if (next / total >= 0.5) return config.textos.avance.mitad;
    return '';
  };

  /* ---------- Transiciones ---------- */
  const transition = async (render) => {
    const current = els.stage.querySelector('.screen');
    if (current && !reducedMotion()) { current.classList.add('is-leaving'); await wait(LEAVE_MS); }
    render();
  };

  /* ---------- Intro ---------- */
  const renderIntro = (animate = true) => {
    state.screen = 'intro';
    els.actionbar.className = 'actionbar';
    els.app.dataset.screen = 'intro';
    const t = config.textos.intro;
    const vars = textVars();
    const paint = () => {
      els.stage.innerHTML = `
        <section class="screen screen--intro">
          <p class="eyebrow">${I.sparkles}${esc(t.eyebrow)}</p>
          <h1 class="title" id="screen-title" tabindex="-1">${esc(t.title)} <span class="title__accent">${esc(t.titleAccent)}</span></h1>
          <p class="lead">${esc(fill(t.subtitle, vars))}</p>
          <div class="stats">
            ${(t.stats || []).slice(0, 3).map((s, i) => `
              <div class="stat" style="--i:${i}">
                <span class="stat__icon">${svg(s.icon) || I.layers}</span>
                <span><strong>${esc(fill(s.title, vars))}</strong><small>${esc(fill(s.detail, vars))}</small></span>
              </div>`).join('')}
          </div>
        </section>`;
      els.actionbar.innerHTML = `
        <span class="actionbar__legal">${esc(t.legal)} <a href="../privacidad.html">Leer aviso</a></span>
        <div class="actionbar__right"><button class="btn" type="button" data-start>${esc(t.button)} ${I.arrowRight}</button></div>`;
      renderProgress();
      setAgro('greet', config.textos.personaje.intro);
      els.actionbar.querySelector('[data-start]').addEventListener('click', start);
    };
    animate ? transition(paint) : paint();
  };

  const start = async () => {
    const button = els.actionbar.querySelector('[data-start]');
    if (!configReady && button) { button.classList.add('is-busy'); button.innerHTML = `${esc(config.textos.intro.button)} ${I.spinner}`; await waitForConfig(); }
    state.step = 0; state.answers = {}; state.startedAt = Date.now(); state.responseId = null; state.result = null;
    transition(renderQuestion);
  };

  /* ---------- Preguntas ---------- */
  const optionMarkup = (question, option, index, selected, maxed) => {
    const hasImage = question.layout === 'images';
    return `
    <button class="opt ${maxed && !selected ? 'is-maxed' : ''}" type="button" style="--i:${index}"
      role="${question.type === 'multi' ? 'checkbox' : 'radio'}" aria-checked="${selected}" data-answer="${esc(option.value)}" data-index="${index}">
      ${hasImage ? `<span class="opt__media">${option.image ? `<img src="${esc(assetUrl(option.image))}" alt="" loading="lazy">` : ''}<span class="opt__icon" aria-hidden="true">${iconMarkup(option.icon)}</span></span>` : `<span class="opt__icon" aria-hidden="true">${iconMarkup(option.icon)}</span>`}
      <span class="opt__label"><strong>${esc(option.title)}</strong>${option.detail ? `<small>${esc(option.detail)}</small>` : ''}</span>
      ${index < 9 ? `<span class="opt__key" aria-hidden="true">${index + 1}</span>` : ''}
      <span class="opt__radio" aria-hidden="true">${I.check}</span>
    </button>`;
  };

  const scaleFill = (question, selected) => {
    const index = question.options.findIndex((o) => o.value === selected[0]);
    if (index < 0) return 0;
    return (index / (question.options.length - 1)) * 80;
  };

  const renderQuestion = () => {
    state.screen = 'question';
    els.actionbar.className = 'actionbar';
    els.app.dataset.screen = 'question';
    const flow = questions();
    const question = flow[state.step];
    const selected = answerValues(question.id);
    const isMulti = question.type === 'multi';
    const maxed = isMulti && selected.length >= question.max;
    const isLast = state.step === flow.length - 1;
    const nav = config.textos.nav;
    const layout = question.layout || 'cards';
    const scaleStyle = layout === 'scale' ? `style="--n:${question.options.length};--fill:${scaleFill(question, selected)}%"` : '';

    els.stage.innerHTML = `
      <section class="screen screen--question" data-layout="${layout}">
        <div class="q-head">
          <p class="q-num" aria-hidden="true">${pad(state.step + 1)}</p>
          <p class="eyebrow">${esc(question.kicker)}</p>
        </div>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(question.title)}</h1>
        ${question.hint ? `<p class="q-hint">${esc(question.hint)}</p>` : ''}
        <div class="options options--${layout}" ${scaleStyle} role="${isMulti ? 'group' : 'radiogroup'}" aria-label="${esc(question.title)}">
          ${question.options.map((option, index) => optionMarkup(question, option, index, selected.includes(option.value), maxed)).join('')}
        </div>
        ${isMulti ? `<p class="multi-count">${pipsMarkup(selected.length, question.max)} Elegiste <b>${selected.length}</b> de ${question.max}</p>` : ''}
      </section>`;
    if (layout === 'scale') markScale(question, selected);

    const milestone = milestoneText();
    els.actionbar.innerHTML = `
      <button class="btn btn--ghost" type="button" data-back ${state.step === 0 ? 'disabled' : ''}>${I.arrowLeft} ${esc(nav.back)}</button>
      <div class="actionbar__right">
        ${milestone ? `<span class="milestone">${I.zap} ${esc(milestone)}</span>` : `<span class="actionbar__hint">${esc(nav.hint)} <kbd>↵</kbd></span>`}
        <button class="btn" type="button" data-next ${selected.length ? '' : 'disabled'}>${esc(isLast ? nav.finish : nav.next)} ${I.arrowRight}</button>
      </div>`;

    renderProgress();
    setAgro(question.mood || 'point', question.bubble || bubbleFor());
    bindQuestion(question);
    focusTitle();
  };

  const bubbleFor = () => {
    const total = questions().length;
    const ratio = (state.step + 1) / total;
    const p = config.textos.personaje;
    return ratio >= 0.75 ? p.casi : ratio >= 0.5 ? p.mitad : p.pregunta;
  };

  const pipsMarkup = (count, max) => `<span class="pips">${Array.from({ length: max }, (_, i) => `<i class="${i < count ? 'is-on' : ''}"></i>`).join('')}</span>`;

  const markScale = (question, selected) => {
    const index = question.options.findIndex((o) => o.value === selected[0]);
    els.stage.querySelectorAll('[data-answer]').forEach((button, i) => button.classList.toggle('is-passed', index >= 0 && i < index));
  };

  const bindQuestion = (question) => {
    els.stage.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => selectAnswer(question, button.dataset.answer)));
    els.actionbar.querySelector('[data-back]')?.addEventListener('click', goBack);
    els.actionbar.querySelector('[data-next]')?.addEventListener('click', advance);
  };

  const selectAnswer = (question, value) => {
    const buttons = els.stage.querySelectorAll('[data-answer]');
    if (question.type === 'multi') {
      const current = answerValues(question.id).slice();
      const index = current.indexOf(value);
      if (index >= 0) current.splice(index, 1);
      else if (current.length < question.max) current.push(value);
      else return;
      state.answers[question.id] = current;
      buttons.forEach((button) => {
        const on = current.includes(button.dataset.answer);
        button.setAttribute('aria-checked', String(on));
        button.classList.toggle('is-maxed', !on && current.length >= question.max);
      });
      const counter = els.stage.querySelector('.multi-count');
      if (counter) counter.innerHTML = `${pipsMarkup(current.length, question.max)} Elegiste <b>${current.length}</b> de ${question.max}`;
      els.actionbar.querySelector('[data-next]').disabled = current.length === 0;
      if (current.length) setAgro('approve', question.bubble || bubbleFor());
      return;
    }
    state.answers[question.id] = value;
    buttons.forEach((button) => button.setAttribute('aria-checked', String(button.dataset.answer === value)));
    if (question.layout === 'scale') {
      const options = els.stage.querySelector('.options');
      options.style.setProperty('--fill', `${scaleFill(question, [value])}%`);
      markScale(question, [value]);
    }
    els.actionbar.querySelector('[data-next]').disabled = false;
    setAgro('approve');
  };

  const advance = () => {
    const question = questions()[state.step];
    if (!answerValues(question.id).length) return;
    if (state.step >= questions().length - 1) return transition(renderAnalyzing);
    state.step += 1;
    transition(renderQuestion);
  };
  const goBack = () => { if (state.step === 0) return; state.step -= 1; transition(renderQuestion); };

  const focusTitle = () => requestAnimationFrame(() => {
    const title = els.stage.querySelector('#screen-title');
    if (title) title.focus({ preventScroll: !isMobile() });
    if (isMobile()) window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* ---------- Analizando ---------- */
  const renderAnalyzing = async () => {
    state.screen = 'analyzing';
    els.app.dataset.screen = 'analyzing';
    const t = config.textos.analizando;
    const vars = textVars();
    const steps = (t.steps || []).map((s) => fill(s, vars));
    const duration = Math.max(1200, Number(t.durationMs) || 2200);
    els.stage.innerHTML = `
      <section class="screen analyzing" aria-busy="true">
        <div class="analyzing__ring" style="--ring-ms:${duration}ms"><svg viewBox="0 0 88 88"><circle class="track" cx="44" cy="44" r="38"/><circle class="arc" cx="44" cy="44" r="38"/></svg>${I.brain}</div>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(t.title)}</h1>
        <ul class="analyzing__steps">${steps.map((s) => `<li><i>${I.check}</i>${esc(s)}</li>`).join('')}</ul>
      </section>`;
    els.actionbar.innerHTML = '';
    renderProgress();
    setAgro('think', config.textos.personaje.analizando);
    focusTitle();

    const profile = buildProfile();
    const result = recommend(profile);
    state.result = result;
    const payload = buildPayload(profile, result);
    state.saveState = 'saving';
    const saving = saveResponse(payload);
    const items = els.stage.querySelectorAll('.analyzing__steps li');
    const slice = duration / Math.max(1, items.length);
    for (let i = 0; i < items.length; i += 1) {
      items[i].classList.add('is-active');
      await wait(reducedMotion() ? 0 : slice);
      items[i].classList.remove('is-active');
      items[i].classList.add('is-done');
    }
    if (state.screen !== 'analyzing') return;
    writeStored({ at: Date.now(), answers: clone(state.answers), responseId: state.responseId });
    transition(() => renderResult(result, state.saveState || 'saving'));
    saving.then(() => { setStatus('ok'); writeStored({ at: Date.now(), answers: clone(state.answers), responseId: state.responseId }); linkAuthUser(); })
      .catch((error) => { console.error('[encuesta] No se pudo guardar la respuesta', error); setStatus('error'); });
  };

  /* ---------- Guardado ---------- */
  const buildPayload = (profile, result) => {
    const labels = {};
    questions().forEach((q) => { const values = answerValues(q.id); if (values.length) labels[q.id] = values.map((v) => optionOf(q, v)?.title || String(v)); });
    const { labels: profileLabels, ...profileValues } = profile;
    return {
      answers: clone(state.answers), labels, profile: profileValues, profileLabels,
      recommended: result ? [result.course.id] : [],
      recommendation: result ? { courseId: result.course.id, courseTitle: result.course.title, classN: result.lesson?.n || null, score: result.score, matches: result.matches.map((m) => m.label), alternatives: result.alternatives } : null,
      clickedClass: false,
      configVersion: config.version,
      device: isMobile() ? 'mobile' : 'desktop',
      ua: String(navigator.userAgent || '').slice(0, 120),
      lang: navigator.language || '',
      ref: (() => { try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; } })(),
      durationSec: state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : null,
      tempId: tempId()
    };
  };
  const tempId = () => { try { let id = localStorage.getItem('agrotec-encuesta:tid'); if (!id) { id = uid(); localStorage.setItem('agrotec-encuesta:tid', id); } return id; } catch { return uid(); } };

  const saveResponse = async (payload) => {
    const { db, collection, addDoc, serverTimestamp } = await FB.getDb();
    const ref = await addDoc(collection(db, FB.COLLECTIONS.responses), { ...payload, createdAt: serverTimestamp() });
    state.responseId = ref.id;
    return ref.id;
  };
  const updateResponse = async (data) => {
    if (!state.responseId) return;
    const { db, doc, updateDoc } = await FB.getDb();
    await updateDoc(doc(db, FB.COLLECTIONS.responses, state.responseId), data);
  };
  /* Si la persona ya inició sesión en agrotecamerican.com, enlazamos la respuesta a su cuenta. */
  const linkAuthUser = async () => {
    try {
      const kit = await FB.getAuthKit();
      const user = await new Promise((resolve) => { const stop = kit.onAuthStateChanged(kit.auth, (u) => { if (typeof stop === 'function') stop(); resolve(u); }); setTimeout(() => resolve(null), 3000); });
      if (user?.uid) await updateResponse({ uid: user.uid, email: user.email || '' });
    } catch { /* sin sesión en este dominio: el club la pedirá al abrir la clase */ }
  };

  const setStatus = (status) => {
    state.saveState = status;
    const el = els.stage.querySelector('.result__status');
    if (!el) return;
    el.className = `result__status ${status === 'ok' ? 'is-ok' : status === 'error' ? 'is-error' : ''}`;
    el.textContent = status === 'ok' ? 'Tus respuestas se guardaron de forma anónima.' : status === 'error' ? 'No pudimos guardar tus respuestas, pero tu resultado ya está listo.' : 'Guardando tus respuestas…';
  };

  /* ---------- Resultado ---------- */
  const classUrl = (course, lesson) => {
    const base = (config.clubUrl || DEFAULTS.clubUrl).replace(/\/$/, '');
    const enc = state.responseId ? `?enc=${encodeURIComponent(state.responseId)}` : '';
    return `${base}/#/curso/${encodeURIComponent(course.id)}/clase/${lesson?.n || 1}${enc}`;
  };

  const renderResult = (result, status) => {
    state.screen = 'result';
    els.app.dataset.screen = 'result';
    const t = config.textos.final;
    const course = result?.course;
    const lesson = result?.lesson;
    els.stage.innerHTML = `
      <section class="screen result">
        <p class="eyebrow">${I.sparkles}${esc(t.eyebrow)}</p>
        <h1 class="title" id="screen-title" tabindex="-1">${esc(t.title)} <span class="title__accent">${esc(t.titleAccent)}</span></h1>
        <p class="lead result__sub">${esc(t.subtitle)}</p>
        ${course ? `
        <article class="course">
          <div class="course__media">
            ${course.image ? `<img src="${esc(assetUrl(course.image))}" alt="Portada del curso ${esc(course.title)}">` : ''}
            <span class="course__badge">${I.star}${esc(t.courseEyebrow)}</span>
          </div>
          <div class="course__body">
            <div class="course__meta">${[course.category, course.level].filter(Boolean).map((m) => `<span>${esc(m)}</span>`).join('')}</div>
            <h2 class="course__title">${esc(course.title)}</h2>
            <p class="course__why"><b>${esc(t.whyPrefix)}</b> ${esc(result.why)}</p>
            ${result.matches.length ? `<ul class="matches">${result.matches.map((m, i) => `<li style="--i:${i}">${I.check}${esc(m.label)}</li>`).join('')}</ul>` : ''}
            <div class="course__foot">
              <span>${I.layers}${course.classes.length} clases</span>
              ${result.totalMin ? `<span>${I.clock}${esc(fmtMin(result.totalMin))}</span>` : ''}
              ${course.summary ? `<span>${I.badgeCheck}${esc(course.summary)}</span>` : ''}
            </div>
          </div>
        </article>
        ${lesson ? `
        <p class="eyebrow lesson-eyebrow">${I.play}${esc(t.classEyebrow)}</p>
        <p class="lesson-hint">${esc(t.classHint)}</p>
        <a class="lesson" href="${esc(classUrl(course, lesson))}" data-lesson>
          <span class="lesson__thumb">
            ${course.image ? `<img src="${esc(assetUrl(course.image))}" alt="">` : ''}
            <span class="lesson__play">${I.play}</span>
            ${lesson.min ? `<span class="lesson__dur">${esc(fmtMin(lesson.min))}</span>` : ''}
          </span>
          <span class="lesson__body">
            <span class="lesson__eyebrow"><span>Clase ${lesson.n} de ${course.classes.length}</span>${lesson.free ? '<span class="lesson__free">Gratis</span>' : ''}</span>
            <span class="lesson__title">${esc(lesson.title)}</span>
            <span class="lesson__course">${esc(course.title)}${lesson.min ? ` · ${esc(fmtMin(lesson.min))}` : ''}</span>
          </span>
          <span class="lesson__arrow">${I.arrowRight}</span>
        </a>` : ''}` : `<p class="done__empty">${esc(t.emptyCourses)}</p>`}
        ${status ? '<p class="result__status"></p>' : ''}
        <p class="result__links"><a href="${esc(t.secondaryUrl || config.clubUrl)}">${esc(t.secondary)}</a><span>·</span><button type="button" data-restart>${esc(t.again)}</button></p>
      </section>`;
    els.actionbar.className = 'actionbar actionbar--result';
    els.actionbar.innerHTML = `
      <button class="btn btn--ghost" type="button" data-restart>${esc(t.again)}</button>
      <div class="actionbar__right">
        <a class="btn btn--line" href="${esc(t.secondaryUrl || config.clubUrl)}">${esc(t.secondary)}</a>
        ${course && lesson ? `<a class="btn btn--play" href="${esc(classUrl(course, lesson))}" data-lesson>${I.play} ${esc(t.button)}</a>` : ''}
      </div>`;
    renderProgress();
    if (status) setStatus(status);
    setAgro('celebrate', config.textos.personaje.resultado);
    if (status && !reducedMotion()) confetti();
    document.querySelectorAll('[data-restart]').forEach((button) => button.addEventListener('click', restart));
    document.querySelectorAll('[data-lesson]').forEach((link) => link.addEventListener('click', onLessonClick));
    focusTitle();
  };

  const onLessonClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
    event.preventDefault();
    const go = () => { window.location.href = href; };
    if (!state.responseId) return go();
    Promise.race([updateResponse({ clickedClass: true, clickedAt: new Date().toISOString() }).catch(() => {}), wait(600)]).then(go, go);
  };

  const confetti = () => {
    const colors = ['#5c8c3a', '#e5852f', '#d9a43c', '#8ab35c', '#23402b'];
    const box = document.createElement('div');
    box.className = 'confetti';
    box.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="left:${Math.round(Math.random() * 100)}%;background:${colors[i % colors.length]};--dx:${Math.round(Math.random() * 120 - 60)}px;--rz:${Math.round(Math.random() * 720)}deg;animation-delay:${Math.round(Math.random() * 400)}ms"></i>`).join('');
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2400);
  };

  const restart = () => {
    writeStored(null);
    state.answers = {}; state.step = 0; state.responseId = null; state.result = null;
    lastMood = '';
    renderIntro();
  };

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter') {
      if (event.target instanceof Element && event.target.closest('button, a')) return;
      if (state.screen === 'intro') { event.preventDefault(); start(); }
      else if (state.screen === 'question') { event.preventDefault(); advance(); }
      return;
    }
    if (state.screen !== 'question') return;
    const number = Number(event.key);
    if (!Number.isInteger(number) || number < 1 || number > 9) return;
    const target = els.stage.querySelectorAll('[data-answer]')[number - 1];
    if (target) target.click();
  });

  /* ---------- Arranque ---------- */
  const boot = async () => {
    const stored = readStored();
    loadRemoteConfig();
    if (stored && stored.answers && typeof stored.answers === 'object') {
      await waitForConfig();
      state.answers = stored.answers;
      state.responseId = stored.responseId || null;
      const result = recommend(buildProfile());
      if (result) { state.result = result; renderResult(result, null); return; }
    }
    renderIntro(false);
  };

  boot();
})();
