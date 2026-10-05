(() => {
  'use strict';

  const config = window.AGROTEC_ASSISTANT_CONFIG;
  if (!config || document.querySelector('[data-agx-root]')) return;

  const stateKey = config.storage?.sessionKey || `${config.id}-assistant`;
  const positionKey = `${config.id}-assistant-position`;
  const panelPositionKey = `${config.id}-assistant-panel-position`;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileViewport = window.matchMedia('(max-width: 680px)');
  const stopwords = new Set(['quiero','curso','cursos','sobre','para','como','algo','una','uno','unos','unas','del','las','los','que','con','por','me','interesa','busco','aprender','capacitacion','cultivo','cultivos','campo','produccion','producir','tema','pregunta']);
  const conceptGroups = {
    basics: {
      prompt: 'Elige un concepto básico del campo:',
      items: ['agricultura', 'agronomia', 'suelo', 'riego', 'fotosintesis']
    },
    water: {
      prompt: '¿Qué tema de agua y nutrición quieres entender?',
      items: ['fertirriego', 'hidroponia', 'nutricion-vegetal', 'fertilizante']
    },
    sustainable: {
      prompt: 'Elige un tema de producción sustentable:',
      items: ['agricultura-organica', 'bioinsumos', 'biofabricas', 'lombricomposta', 'polinizadores']
    },
    production: {
      prompt: '¿Sobre qué parte de la producción tienes curiosidad?',
      items: ['plagas', 'vivero', 'inocuidad', 'invernadero', 'ia-agricultura']
    },
    soil: {
      prompt: '¿Qué quieres entender sobre suelo y nutrición?',
      items: ['ph', 'conductividad', 'salinidad', 'npk', 'micronutrientes', 'materiaOrganica', 'compactacion']
    },
    field: {
      prompt: 'Elige una decisión práctica del cultivo:',
      items: ['goteo', 'calidadAgua', 'mip', 'enfermedades', 'malezas', 'agroquimicos', 'poscosecha']
    },
    business: {
      prompt: '¿Qué tema de negocio agrícola quieres revisar?',
      items: ['costos', 'puntoEquilibrio', 'valorAgregado', 'exportacion', 'trazabilidad', 'bpa']
    },
    crops: {
      prompt: 'Elige un cultivo para comenzar:',
      items: ['maiz', 'cacao', 'papaya', 'berries', 'nopal', 'pitahaya', 'hongos', 'chile', 'tomatillo', 'frutales']
    }
  };
  const coreConcepts = {
    agricultura: {
      label: 'Agricultura',
      aliases: ['agricultura'],
      definition: 'La agricultura es el conjunto de conocimientos y actividades para cultivar la tierra y obtener alimentos, fibras y otras materias primas. Incluye decisiones sobre suelo, agua, nutrición, sanidad, cosecha y comercialización.',
      courseQueries: ['Agronomía para No Agrónomos', 'Agricultura Orgánica']
    },
    agronomia: {
      label: 'Agronomía',
      aliases: ['agronomia'],
      definition: 'La agronomía es la disciplina que aplica ciencia y tecnología a la producción agrícola. Estudia cómo manejar cultivos, suelo, agua, nutrición y sanidad para producir mejor y de forma responsable.',
      courseQueries: ['Agronomía para No Agrónomos', 'Diseño de Programas Nutricionales']
    },
    fertirriego: {
      label: 'Fertirriego',
      aliases: ['fertirriego', 'fertirrigacion'],
      definition: 'El fertirriego o fertirrigación consiste en aplicar nutrientes disueltos por medio del sistema de riego. Permite ajustar agua y fertilización a la etapa del cultivo, siempre con un buen manejo de dosis, calidad del agua y uniformidad.',
      courseQueries: ['Fertirrigación', 'Diseño de Programas Nutricionales']
    },
    hidroponia: {
      label: 'Hidroponía',
      aliases: ['hidroponia', 'cultivo sin suelo'],
      definition: 'La hidroponía es una forma de producir plantas sin suelo agrícola: las raíces reciben agua, oxígeno y nutrientes mediante una solución nutritiva, a veces con sustratos inertes como soporte.',
      courseQueries: ['Hidroponía para Todos', 'Diseño de Programas Nutricionales']
    },
    'agricultura-organica': {
      label: 'Agricultura orgánica',
      aliases: ['agricultura organica', 'produccion organica'],
      definition: 'La agricultura orgánica es un sistema de producción que prioriza la salud del suelo, la biodiversidad y los procesos ecológicos, con prácticas e insumos permitidos por su normativa y evitando sustancias no autorizadas.',
      courseQueries: ['Agricultura Orgánica', 'Bioinsumos', 'Lombricomposta']
    },
    bioinsumos: {
      label: 'Bioinsumos',
      aliases: ['bioinsumo', 'bioinsumos', 'insumos biologicos'],
      definition: 'Los bioinsumos son productos de origen biológico o natural empleados para nutrir plantas, estimular su desarrollo o apoyar el manejo de plagas y enfermedades. Su uso correcto depende del organismo, formulación y objetivo.',
      courseQueries: ['Bioinsumos', 'Biofábricas']
    },
    biofabricas: {
      label: 'Biofábricas',
      aliases: ['biofabrica', 'biofabricas'],
      definition: 'Una biofábrica agrícola es una unidad donde se elaboran y controlan insumos biológicos, como microorganismos benéficos o preparados orgánicos. Requiere procesos definidos, higiene, trazabilidad y control de calidad.',
      courseQueries: ['Biofábricas', 'Bioinsumos']
    },
    'nutricion-vegetal': {
      label: 'Nutrición vegetal',
      aliases: ['nutricion vegetal', 'nutricion de cultivos'],
      definition: 'La nutrición vegetal estudia los elementos que una planta necesita y cómo los absorbe y utiliza. Un programa nutricional considera cultivo, etapa, suelo o sustrato, agua, rendimiento esperado y análisis disponibles.',
      courseQueries: ['Diseño de Programas Nutricionales', 'Fertirrigación']
    },
    suelo: {
      label: 'Suelo agrícola',
      aliases: ['suelo agricola', 'fertilidad del suelo', 'suelo'],
      definition: 'El suelo agrícola es un sistema vivo que sostiene las raíces y almacena agua y nutrientes. Su textura, estructura, materia orgánica, pH y actividad biológica influyen en el desarrollo del cultivo.',
      courseQueries: ['Agronomía para No Agrónomos', 'Lombricomposta', 'Diseño de Programas Nutricionales']
    },
    riego: {
      label: 'Riego',
      aliases: ['sistema de riego', 'riego agricola', 'riego'],
      definition: 'El riego es el suministro planificado de agua al cultivo cuando la lluvia no cubre sus necesidades. Un buen manejo define cuánto, cuándo y cómo regar según el suelo, el clima, la etapa y el sistema instalado.',
      courseQueries: ['Fertirrigación', 'Hidroponía para Todos']
    },
    fertilizante: {
      label: 'Fertilizantes',
      aliases: ['fertilizante', 'fertilizantes', 'fertilizacion'],
      definition: 'Un fertilizante aporta uno o más nutrientes para el crecimiento vegetal. Elegir fuente y dosis requiere considerar análisis, demanda del cultivo, eficiencia de aplicación y posibles pérdidas; más fertilizante no siempre significa más rendimiento.',
      courseQueries: ['Diseño de Programas Nutricionales', 'Fertirrigación', 'Bioinsumos']
    },
    lombricomposta: {
      label: 'Lombricomposta',
      aliases: ['lombricomposta', 'vermicomposta', 'composta de lombriz'],
      definition: 'La lombricomposta es el material estabilizado que resulta de transformar residuos orgánicos con ayuda de lombrices y microorganismos. Puede aportar materia orgánica y mejorar propiedades del suelo o sustrato.',
      courseQueries: ['Lombricomposta', 'Agricultura Orgánica']
    },
    polinizadores: {
      label: 'Polinizadores',
      aliases: ['polinizador', 'polinizadores', 'polinizacion'],
      definition: 'Los polinizadores transportan polen entre flores y favorecen la formación de frutos y semillas. Abejas, otros insectos, aves y murciélagos cumplen esta función; proteger hábitat y reducir riesgos de plaguicidas ayuda a conservarlos.',
      courseQueries: ['Polinizadores', 'Agricultura Orgánica']
    },
    plagas: {
      label: 'Manejo de plagas',
      aliases: ['manejo integrado de plagas', 'control de plagas', 'plaga', 'plagas'],
      definition: 'Una plaga es un organismo que causa pérdidas inaceptables en un cultivo. El manejo integrado combina monitoreo, prevención y controles culturales, biológicos, físicos y, cuando se justifica, químicos.',
      courseQueries: ['Bioinsumos', 'Agronomía para No Agrónomos']
    },
    vivero: {
      label: 'Viveros y plántulas',
      aliases: ['produccion de plantulas', 'plantulas', 'viveros', 'vivero'],
      definition: 'Un vivero es un espacio controlado para germinar, propagar y cuidar plantas antes de llevarlas a su sitio definitivo. La sanidad, el sustrato, el riego, la nutrición y la aclimatación determinan la calidad de la plántula.',
      courseQueries: ['Manejo de Viveros', 'Producción de Plántulas']
    },
    inocuidad: {
      label: 'Inocuidad alimentaria',
      aliases: ['inocuidad alimentaria', 'inocuidad'],
      definition: 'La inocuidad alimentaria reúne prácticas para prevenir peligros biológicos, químicos y físicos que podrían dañar al consumidor. En campo incluye higiene, agua, manejo de insumos, trazabilidad y buenas prácticas agrícolas.',
      courseQueries: ['Inocuidad Alimentaria', 'Exportación Agrícola']
    },
    invernadero: {
      label: 'Invernadero',
      aliases: ['agricultura protegida', 'invernaderos', 'invernadero'],
      definition: 'Un invernadero es una estructura que protege el cultivo y permite modificar parte de su ambiente, como temperatura, humedad, radiación o ventilación. El resultado depende del diseño, clima local y manejo.',
      courseQueries: ['Hidroponía para Todos', 'Producción de Plántulas', 'Manejo de Viveros']
    },
    fotosintesis: {
      label: 'Fotosíntesis',
      aliases: ['fotosintesis'],
      definition: 'La fotosíntesis es el proceso mediante el cual las plantas usan luz, agua y dióxido de carbono para producir azúcares y liberar oxígeno. Es la base de su crecimiento, aunque también depende de temperatura, nutrición y disponibilidad de agua.',
      courseQueries: ['Agronomía para No Agrónomos', 'Diseño de Programas Nutricionales']
    },
    'ia-agricultura': {
      label: 'IA en agricultura',
      aliases: ['inteligencia artificial en agricultura', 'ia en agricultura', 'agricultura de precision'],
      definition: 'La inteligencia artificial en agricultura analiza datos e imágenes para apoyar decisiones como detectar anomalías, estimar rendimientos o ajustar labores. Complementa el criterio técnico: necesita datos adecuados y validación en campo.',
      courseQueries: ['IA en Agricultura', 'Agronomía para No Agrónomos']
    }
  };
  const concepts = Object.freeze({
    ...coreConcepts,
    ...(window.AGROTEC_ASSISTANT_KNOWLEDGE || {})
  });

  const guidanceProfiles = [
    {
      pattern: /dosis|cuanto aplicar|cuantos kilos|mezcla|compatib|producto aplicar|que le echo/,
      answer: 'Para definir una dosis responsable hacen falta producto y formulación exactos, cultivo, etapa, objetivo, superficie o volumen, equipo y etiqueta vigente. Sin esos datos una cifra podría dañar el cultivo, dejar residuos o poner en riesgo a quien aplica. Lo útil es: confirmar el diagnóstico, leer la etiqueta autorizada, calibrar el equipo, calcular el área real y registrar el resultado.',
      courseQueries: ['Agronomía para No Agrónomos', 'Inocuidad Alimentaria']
    },
    {
      pattern: /amarill|mancha|marchit|seca|pudric|hojas.*(cafe|negr|blanc)|planta.*enferm/,
      answer: 'Ese síntoma puede venir de agua, raíces, nutrición, clima, plagas o enfermedad; el color por sí solo no confirma la causa. Revisa si el patrón aparece en hojas nuevas o viejas, si está en bordes o entre nervaduras, cómo se distribuye en el lote y qué cambió antes del problema. Después inspecciona raíces y envés de hojas y compara plantas sanas contra afectadas.',
      courseQueries: ['Diseño de Programas Nutricionales', 'Bioinsumos', 'Agronomía para No Agrónomos']
    },
    {
      pattern: /mejorar.*(rendimiento|produccion|cosecha)|aumentar.*(rendimiento|produccion)|produce poco/,
      answer: 'Para mejorar rendimiento conviene encontrar primero el factor que realmente limita: establecimiento, agua, raíces, nutrición, sanidad, clima, polinización o cosecha. Mide una línea base, elige una sola intervención prioritaria y compara una franja tratada contra otra sin cambio; así sabrás qué práctica sí generó resultado y si pagó su costo.',
      courseQueries: ['Agronomía para No Agrónomos', 'Diseño de Programas Nutricionales']
    },
    {
      pattern: /negocio|vender|mercado|precio|ganancia|rentab|emprender/,
      answer: 'Una decisión de negocio agrícola debe conectar cliente, producto vendible, calendario, merma y costo completo. Empieza por validar quién compra, qué especificación exige, cuánto volumen recibe y cuándo paga; después calcula costo por unidad comercializable y prueba escenarios de precio y rendimiento antes de invertir.',
      courseQueries: ['Contabilidad Agrícola', 'Exportación Agrícola']
    },
    {
      pattern: /riego|agua|humedad|sequia|encharc/,
      answer: 'El riego se decide con tres preguntas: cuánto puede almacenar la zona de raíces, cuánto está consumiendo el cultivo y qué tan uniforme aplica el sistema. Revisa textura y profundidad radicular, clima, humedad antes y después del riego, caudal y drenaje. Regar por costumbre o solo por apariencia puede alternar déficit y exceso.',
      courseQueries: ['Fertirrigación', 'Hidroponía para Todos']
    },
    {
      pattern: /fertili|nutri|deficien|abono/,
      answer: 'La nutrición funciona mejor como balance que como una lista de productos. Integra demanda del cultivo y etapa, análisis de suelo o sustrato, aportes del agua, rendimiento esperado y eficiencia de aplicación. Antes de corregir una supuesta deficiencia también revisa raíces, pH, salinidad y humedad, porque pueden bloquear nutrientes aunque estén presentes.',
      courseQueries: ['Diseño de Programas Nutricionales', 'Fertirrigación']
    },
    {
      pattern: /plaga|insecto|gusano|pulgon|mosca|acaro/,
      answer: 'Primero identifica el organismo y confirma que explique el daño. Después mide incidencia o población, etapa del cultivo y presencia de enemigos naturales. Con esa información se elige una combinación de prevención, manejo cultural, control biológico y, si está justificado, un producto autorizado aplicado conforme a su etiqueta.',
      courseQueries: ['Bioinsumos', 'Biofábricas', 'Agronomía para No Agrónomos']
    }
  ];

  const safeRead = () => {
    try { return JSON.parse(sessionStorage.getItem(stateKey) || '{}'); } catch { return {}; }
  };
  const saved = safeRead();
  const readPosition = (key) => {
    try {
      const position = JSON.parse(localStorage.getItem(key) || '{}');
      return Number.isFinite(position.x) && Number.isFinite(position.y) ? position : { x: 0, y: 0 };
    } catch { return { x: 0, y: 0 }; }
  };
  const state = {
    open: false,
    paused: Boolean(saved.paused) || reducedMotion.matches,
    messages: Array.isArray(saved.messages) ? saved.messages : [],
    flow: saved.flow || 'home'
  };
  let launcherPosition = readPosition(positionKey);
  let panelPosition = readPosition(panelPositionKey);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const normalize = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = (value) => normalize(value).split(' ').filter((token) => token.length > 2 && !stopwords.has(token));
  const timeNow = () => new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  function save() {
    try {
      sessionStorage.setItem(stateKey, JSON.stringify({ paused: state.paused, messages: state.messages.slice(-30), flow: state.flow }));
    } catch {}
  }

  function readCatalog() {
    try {
      const featured = [...document.querySelectorAll(config.catalog.cardSelector)].map((card) => {
        const meta = [...card.querySelectorAll(config.catalog.metaSelector)].map((node) => node.textContent.trim()).filter(Boolean);
        const link = card.querySelector(config.catalog.linkSelector);
        return {
          title: card.querySelector(config.catalog.titleSelector)?.textContent.trim() || '',
          area: meta[0] || '',
          level: meta[1] || '',
          detail: card.querySelector(config.catalog.detailSelector)?.textContent.trim() || '',
          modality: config.catalog.modality || '',
          href: link?.href || ''
        };
      }).filter((course) => course.title);
      const areaLabels = { cultivos: 'Cultivos', tecnicas: 'Técnicas', gestion: 'Gestión' };
      const fullCatalogUrl = 'https://club.agrotecamerican.com/#/cursos';
      const complete = [...document.querySelectorAll('.curso')].map((card) => ({
        title: card.querySelector('h3')?.textContent.trim() || '',
        area: areaLabels[card.dataset.cat] || 'AgroTec',
        level: '',
        detail: card.querySelector('.curso__desc')?.textContent.trim() || '',
        modality: config.catalog.modality || '',
        href: fullCatalogUrl
      })).filter((course) => course.title);
      const unique = new Map();
      [...featured, ...complete].forEach((course) => {
        const key = normalize(course.title);
        if (!unique.has(key) || !unique.get(key).href.includes('/curso/')) unique.set(key, course);
      });
      return [...unique.values()];
    } catch { return []; }
  }

  function readPlans() {
    try {
      return [...document.querySelectorAll(config.plans.cardSelector)].map((card) => ({
        label: card.querySelector(config.plans.labelSelector)?.textContent.trim() || 'Plan',
        price: card.querySelector(config.plans.priceSelector)?.innerText.replace(/\s+/g, ' ').trim() || '',
        description: card.querySelector(config.plans.descriptionSelector)?.textContent.trim() || ''
      })).filter((plan) => plan.price);
    } catch { return []; }
  }

  const root = document.createElement('div');
  root.dataset.agxRoot = '';
  root.dataset.agxState = 'idle';
  root.dataset.agxCharacter = 'robot';
  root.dataset.agxMotion = state.paused ? 'paused' : 'running';
  root.style.setProperty('--agx-primary', config.colors.primary);
  root.style.setProperty('--agx-primary-dark', config.colors.primaryDark);
  root.style.setProperty('--agx-accent', config.colors.accent);
  root.style.setProperty('--agx-accent-warm', config.colors.accentWarm);
  root.style.setProperty('--agx-mint', config.colors.mint);
  root.style.setProperty('--agx-surface', config.colors.surface);
  root.style.setProperty('--agx-ink', config.colors.ink);
  root.innerHTML = `
    <button class="agx-launcher" type="button" aria-label="¡Hola! Soy Agro. 7 preguntas, menos de 2 minutos. Encuentra tu ruta ideal. Toca para conversar." title="Toca para conversar" aria-expanded="false" data-agx-open>
      ${avatarMarkup('agx-avatar--launcher')}
      <span class="agx-prompts" aria-hidden="true">
        <span class="agx-prompt agx-prompt--one">¡Hola! Soy Agro <b>👋</b></span>
        <span class="agx-prompt agx-prompt--two">7 preguntas · menos de 2 min</span>
        <span class="agx-prompt agx-prompt--three">Encuentra tu ruta ideal <b>→</b></span>
      </span>
      <span class="agx-launcher__hint" aria-hidden="true">Toca para conversar</span>
      <span class="agx-launcher__drag-surface" aria-hidden="true"></span>
    </button>
    <div class="agx-backdrop" aria-hidden="true" data-agx-backdrop></div>
    <section class="agx-panel" role="dialog" aria-modal="false" aria-label="Conversación con ${escapeHtml(config.assistantName)}, asistente virtual" aria-hidden="true" inert data-agx-panel>
      <header class="agx-header">
        ${avatarMarkup('agx-avatar--header')}
        <span class="agx-header__title"><strong>${escapeHtml(config.assistantName)}</strong><small>${escapeHtml(config.assistantLabel)} · Guía de cursos</small></span>
        <span class="agx-header__actions">
          <button class="agx-icon-btn" type="button" aria-label="Repetir saludo" title="Repetir saludo" data-agx-wave>${icon('wave')}</button>
          <button class="agx-icon-btn" type="button" aria-label="${state.paused ? 'Reanudar' : 'Pausar'} movimiento" title="${state.paused ? 'Reanudar' : 'Pausar'} movimiento" data-agx-pause>${icon(state.paused ? 'play' : 'pause')}</button>
          <button class="agx-icon-btn" type="button" aria-label="Minimizar asistente" title="Minimizar" data-agx-close>${icon('minus')}</button>
        </span>
      </header>
      <div class="agx-disclosure">Guía de orientación con cursos reales de AgroClub. No sustituye asesoría técnica ni hay una persona conectada.</div>
      <div class="agx-messages" role="log" aria-live="polite" data-agx-messages></div>
      <div class="agx-typing" aria-label="El asistente está preparando una respuesta" data-agx-typing hidden><i></i><i></i><i></i></div>
      <div class="agx-quick" aria-label="Opciones rápidas" data-agx-quick></div>
      <form class="agx-composer" data-agx-form>
        <label class="agx-sr" for="agx-input">Escribe tu pregunta</label>
        <input id="agx-input" type="text" maxlength="280" autocomplete="off" placeholder="¿Qué te gustaría aprender?" data-agx-input>
        <button class="agx-send" type="submit" aria-label="Enviar mensaje">${icon('send')}</button>
      </form>
      <footer class="agx-footer"><button type="button" data-agx-human-footer>Hablar con un asesor</button><button type="button" data-agx-reset>Empezar de nuevo</button></footer>
    </section>`;
  document.body.append(root);

  const panel = root.querySelector('[data-agx-panel]');
  const launcher = root.querySelector('[data-agx-open]');
  const backdrop = root.querySelector('[data-agx-backdrop]');
  const messagesEl = root.querySelector('[data-agx-messages]');
  const quickEl = root.querySelector('[data-agx-quick]');
  const typingEl = root.querySelector('[data-agx-typing]');
  const input = root.querySelector('[data-agx-input]');
  const pauseButton = root.querySelector('[data-agx-pause]');
  const panelDragHandle = root.querySelector('[data-agx-panel-drag]');
  let suppressLauncherClick = false;
  let pageLock = null;
  let keepLauncherOnScreen = () => {};
  let keepPanelOnScreen = () => {};
  let heroVisibleOnMobile = false;

  if (!state.messages.length) {
    state.messages.push({ role: 'assistant', text: config.welcome, time: timeNow() });
    save();
  }
  renderMessages();
  showHomeActions();

  initLauncherDrag();
  initPanelDrag();
  initMobileHeroVisibility();
  launcher.addEventListener('click', (event) => {
    if (suppressLauncherClick) {
      event.preventDefault();
      return;
    }
    open();
  });
  root.querySelector('[data-agx-close]').addEventListener('click', close);
  root.querySelector('[data-agx-wave]').addEventListener('click', wave);
  pauseButton.addEventListener('click', togglePause);
  root.querySelector('[data-agx-human-footer]').addEventListener('click', () => handleInput('humano', 'Hablar con un asesor'));
  root.querySelector('[data-agx-reset]').addEventListener('click', resetConversation);
  root.querySelector('[data-agx-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    handleInput(value);
  });
  input.addEventListener('input', syncInputMotion);
  input.addEventListener('focus', syncInputMotion);
  input.addEventListener('blur', () => {
    if (root.dataset.agxState === 'listening') root.dataset.agxState = 'idle';
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && state.open) close(); });
  document.addEventListener('visibilitychange', syncVisibility);
  reducedMotion.addEventListener?.('change', () => { if (reducedMotion.matches) setPaused(true); });
  mobileViewport.addEventListener?.('change', (event) => {
    syncMobileHeroVisibility();
    if (!state.open) return;
    if (event.matches) lockPageOnMobile(); else unlockPage();
  });

  function syncMobileHeroVisibility() {
    launcher.classList.toggle('is-mobile-hero-hidden', mobileViewport.matches && heroVisibleOnMobile && !state.open);
  }

  function initMobileHeroVisibility() {
    const hero = document.querySelector('.ag3-hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    heroVisibleOnMobile = rect.bottom > 80 && rect.top < window.innerHeight;
    syncMobileHeroVisibility();
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      heroVisibleOnMobile = entry.isIntersecting;
      syncMobileHeroVisibility();
    }, { rootMargin: '-80px 0px 0px', threshold: 0.05 });
    observer.observe(hero);
  }

  function avatarMarkup(extraClass) {
    const image = config.character.src
      ? `<img class="agx-avatar__open" src="${escapeHtml(config.character.src)}" alt="${escapeHtml(config.character.alt)}" width="256" height="384" decoding="async" draggable="false" onerror="this.remove()">`
      : '';
    const blinkImage = config.character.blinkSrc
      ? `<img class="agx-avatar__blink" src="${escapeHtml(config.character.blinkSrc)}" alt="" width="256" height="384" decoding="async" aria-hidden="true" draggable="false" onerror="this.remove()">`
      : '';
    const fallback = config.character.src ? '' : `<span class="agx-avatar__fallback" aria-hidden="true">${escapeHtml(config.character.placeholder || 'A')}</span>`;
    const dragAttributes = extraClass === 'agx-avatar--header'
      ? ' role="button" tabindex="0" data-agx-panel-drag aria-label="Mover el chatbot. Arrastra a Agro, usa las flechas para mover el panel o presiona Inicio para restaurarlo." title="Arrastra a Agro para mover el chat"'
      : '';
    return `<span class="agx-avatar ${extraClass}"${dragAttributes}>
      <span class="agx-avatar__art">${fallback}${image}${blinkImage}</span>
    </span>`;
  }

  function icon(name) {
    const paths = {
      send: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
      minus: '<path d="M5 12h14"/>',
      pause: '<path d="M9 5v14M15 5v14"/>',
      play: '<path d="m9 6 9 6-9 6Z"/>',
      wave: '<path d="M8 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v8l2-2a1.8 1.8 0 0 1 2.5 2.5L17 19a5 5 0 0 1-3.8 1.8H11A6 6 0 0 1 5 15v-3a1.5 1.5 0 0 1 3 0v1"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }

  function open() {
    state.open = true;
    lockPageOnMobile();
    backdrop.classList.add('is-open');
    panel.classList.add('is-open');
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');
    launcher.hidden = true;
    launcher.setAttribute('aria-expanded', 'true');
    wave();
    requestAnimationFrame(() => {
      keepPanelOnScreen();
      if (!mobileViewport.matches) input.focus({ preventScroll: true });
      setTimeout(() => { if (state.open) keepPanelOnScreen(); }, 260);
    });
  }

  function close() {
    state.open = false;
    backdrop.classList.remove('is-open');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    launcher.hidden = false;
    launcher.setAttribute('aria-expanded', 'false');
    root.dataset.agxState = 'idle';
    unlockPage();
    requestAnimationFrame(() => keepLauncherOnScreen());
    launcher.focus({ preventScroll: true });
  }

  function lockPageOnMobile() {
    if (pageLock || !mobileViewport.matches) return;
    const scrollY = window.scrollY;
    pageLock = {
      scrollY,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyRight: document.body.style.right,
      bodyLeft: document.body.style.left,
      bodyWidth: document.body.style.width,
      bodyOverflow: document.body.style.overflow
    };
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.right = '0';
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockPage() {
    if (!pageLock) return;
    const lock = pageLock;
    pageLock = null;
    document.documentElement.style.overflow = lock.htmlOverflow;
    document.body.style.position = lock.bodyPosition;
    document.body.style.top = lock.bodyTop;
    document.body.style.right = lock.bodyRight;
    document.body.style.left = lock.bodyLeft;
    document.body.style.width = lock.bodyWidth;
    document.body.style.overflow = lock.bodyOverflow;
    window.scrollTo(0, lock.scrollY);
  }

  function wave() {
    if (state.paused || document.hidden) return;
    root.dataset.agxState = 'wave';
    setTimeout(() => {
      if (root.dataset.agxState === 'wave') root.dataset.agxState = input.value.trim() ? 'listening' : 'idle';
    }, 2500);
  }

  function syncInputMotion() {
    if (state.paused || !typingEl.hidden || ['waiting', 'response'].includes(root.dataset.agxState)) return;
    root.dataset.agxState = input.value.trim() ? 'listening' : 'idle';
  }

  function setPaused(value) {
    state.paused = value;
    root.dataset.agxMotion = value || document.hidden ? 'paused' : 'running';
    pauseButton.setAttribute('aria-label', value ? 'Reanudar movimiento' : 'Pausar movimiento');
    pauseButton.setAttribute('title', value ? 'Reanudar movimiento' : 'Pausar movimiento');
    pauseButton.innerHTML = icon(value ? 'play' : 'pause');
    save();
  }

  function togglePause() { setPaused(!state.paused); }
  function syncVisibility() {
    root.dataset.agxMotion = state.paused || document.hidden ? 'paused' : 'running';
  }

  function initLauncherDrag() {
    const applyPosition = () => {
      launcher.style.setProperty('--agx-drag-x', `${Math.round(launcherPosition.x)}px`);
      launcher.style.setProperty('--agx-drag-y', `${Math.round(launcherPosition.y)}px`);
    };
    const savePosition = () => {
      try { localStorage.setItem(positionKey, JSON.stringify(launcherPosition)); } catch {}
    };
    const moveWithinViewport = (deltaX, deltaY, rect = launcher.getBoundingClientRect()) => {
      const margin = 8;
      const safeX = Math.min(Math.max(deltaX, margin - rect.left), window.innerWidth - margin - rect.right);
      const safeY = Math.min(Math.max(deltaY, margin - rect.top), window.innerHeight - margin - rect.bottom);
      launcherPosition = { x: launcherPosition.x + safeX, y: launcherPosition.y + safeY };
      applyPosition();
    };
    const resetPosition = () => {
      launcherPosition = { x: 0, y: 0 };
      applyPosition();
      savePosition();
    };
    keepLauncherOnScreen = () => {
      if (launcher.hidden) return;
      moveWithinViewport(0, 0);
      savePosition();
    };

    applyPosition();
    let drag = null;

    launcher.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || state.open) return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: { ...launcherPosition },
        rect: launcher.getBoundingClientRect(),
        moved: false
      };
      launcher.setPointerCapture(event.pointerId);
    });

    launcher.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const rawX = event.clientX - drag.startX;
      const rawY = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(rawX, rawY) < 6) return;
      drag.moved = true;
      event.preventDefault();
      const margin = 8;
      const deltaX = Math.min(Math.max(rawX, margin - drag.rect.left), window.innerWidth - margin - drag.rect.right);
      const deltaY = Math.min(Math.max(rawY, margin - drag.rect.top), window.innerHeight - margin - drag.rect.bottom);
      launcherPosition = { x: drag.startPosition.x + deltaX, y: drag.startPosition.y + deltaY };
      applyPosition();
      launcher.classList.add('is-dragging');
    });

    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      suppressLauncherClick = drag.moved;
      if (drag.moved) savePosition();
      drag = null;
      launcher.classList.remove('is-dragging');
      if (suppressLauncherClick) setTimeout(() => { suppressLauncherClick = false; }, 0);
    };
    launcher.addEventListener('pointerup', finishDrag);
    launcher.addEventListener('pointercancel', finishDrag);

    launcher.addEventListener('keydown', (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
        resetPosition();
        return;
      }
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      const distance = event.shiftKey ? 48 : 16;
      moveWithinViewport(direction[0] * distance, direction[1] * distance);
      savePosition();
    });

    window.addEventListener('resize', () => {
      if (state.open || launcher.hidden) return;
      moveWithinViewport(0, 0);
      savePosition();
    });
    requestAnimationFrame(() => {
      moveWithinViewport(0, 0);
      savePosition();
    });
  }

  function initPanelDrag() {
    if (!panelDragHandle) return;
    const applyPosition = () => {
      panel.style.setProperty('--agx-panel-drag-x', `${Math.round(panelPosition.x)}px`);
      panel.style.setProperty('--agx-panel-drag-y', `${Math.round(panelPosition.y)}px`);
    };
    const savePosition = () => {
      try { localStorage.setItem(panelPositionKey, JSON.stringify(panelPosition)); } catch {}
    };
    const getVisibleBounds = () => {
      const panelRect = panel.getBoundingClientRect();
      const mascotRect = panelDragHandle.getBoundingClientRect();
      return {
        left: Math.min(panelRect.left, mascotRect.left),
        top: Math.min(panelRect.top, mascotRect.top),
        right: Math.max(panelRect.right, mascotRect.right),
        bottom: Math.max(panelRect.bottom, mascotRect.bottom)
      };
    };
    const moveWithinViewport = (deltaX, deltaY, rect = getVisibleBounds()) => {
      const margin = 8;
      const safeX = Math.min(Math.max(deltaX, margin - rect.left), window.innerWidth - margin - rect.right);
      const safeY = Math.min(Math.max(deltaY, margin - rect.top), window.innerHeight - margin - rect.bottom);
      panelPosition = { x: panelPosition.x + safeX, y: panelPosition.y + safeY };
      applyPosition();
    };
    const resetPosition = () => {
      panelPosition = { x: 0, y: 0 };
      applyPosition();
      savePosition();
    };
    keepPanelOnScreen = () => {
      if (!state.open) return;
      moveWithinViewport(0, 0);
      savePosition();
    };

    applyPosition();
    let drag = null;
    panelDragHandle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || !state.open) return;
      event.preventDefault();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: { ...panelPosition },
        rect: getVisibleBounds()
      };
      panel.classList.add('is-dragging');
      panelDragHandle.setPointerCapture(event.pointerId);
    });
    panelDragHandle.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const margin = 8;
      const deltaX = Math.min(Math.max(event.clientX - drag.startX, margin - drag.rect.left), window.innerWidth - margin - drag.rect.right);
      const deltaY = Math.min(Math.max(event.clientY - drag.startY, margin - drag.rect.top), window.innerHeight - margin - drag.rect.bottom);
      panelPosition = { x: drag.startPosition.x + deltaX, y: drag.startPosition.y + deltaY };
      applyPosition();
    });
    const finishPanelDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      panel.classList.remove('is-dragging');
      savePosition();
    };
    panelDragHandle.addEventListener('pointerup', finishPanelDrag);
    panelDragHandle.addEventListener('pointercancel', finishPanelDrag);
    panelDragHandle.addEventListener('keydown', (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
        resetPosition();
        return;
      }
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      const distance = event.shiftKey ? 48 : 16;
      moveWithinViewport(direction[0] * distance, direction[1] * distance);
      savePosition();
    });
    window.addEventListener('resize', () => {
      if (!state.open) return;
      keepPanelOnScreen();
    });
  }

  function addMessage(role, text, extra = {}) {
    state.messages.push({ role, text, time: timeNow(), ...extra });
    save();
    renderMessages();
  }

  function renderMessages() {
    messagesEl.innerHTML = state.messages.map((message) => {
      const extra = message.kind === 'courses'
        ? courseCards(message.items || [])
        : message.kind === 'survey'
          ? surveyCard()
          : message.kind === 'human'
            ? `<a href="${escapeHtml(config.humanContact.url)}" target="_blank" rel="noopener">${escapeHtml(config.humanContact.label)}</a>`
            : '';
      const name = message.role === 'assistant' ? '<div class="agx-message-name">AGRO · ASISTENTE VIRTUAL</div>' : '';
      return `<div class="agx-message-row ${message.role === 'user' ? 'is-user' : ''}">${name}<div class="agx-message">${escapeHtml(message.text)}${extra}<span class="agx-time">${escapeHtml(message.time)}</span></div></div>`;
    }).join('');
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  function courseCards(items) {
    return `<div class="agx-course-list">${items.map((course) => `<article class="agx-course"><strong>${escapeHtml(course.title)}</strong><span>${escapeHtml([course.area, course.level, course.modality, course.detail].filter(Boolean).join(' · '))}</span>${course.href ? `<a href="${escapeHtml(course.href)}">Ver curso</a>` : ''}</article>`).join('')}</div>`;
  }

  function surveyCard() {
    const survey = config.survey || {};
    return `<a class="agx-survey" href="${escapeHtml(survey.url || 'encuesta/')}">
      <span class="agx-survey__eyebrow">${escapeHtml(survey.eyebrow || 'Diagnóstico de aprendizaje')}</span>
      <strong>${escapeHtml(survey.title || 'Encuentra tu siguiente curso')}</strong>
      <span>${escapeHtml(survey.detail || 'Responde unas preguntas rápidas para recibir una recomendación.')}</span>
      <b>${escapeHtml(survey.label || 'Empezar')} <i aria-hidden="true">→</i></b>
    </a>`;
  }

  function showQuick(items) {
    quickEl.innerHTML = '';
    items.forEach(({ label, value }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'agx-chip';
      button.textContent = label;
      button.addEventListener('click', () => handleInput(value, label));
      quickEl.append(button);
    });
  }

  function conceptOptions(keys) {
    return keys.map((key) => ({ label: concepts[key].label, value: `concepto:${key}` }));
  }

  function showConceptHub() {
    state.flow = 'concepts'; save();
    reply('Puedo explicarte conceptos agrícolas con palabras claras y después recomendarte cursos relacionados. ¿Por dónde empezamos?');
    showQuick([
      { label: 'Conceptos básicos', value: 'conceptos:basics' },
      { label: 'Agua y nutrición', value: 'conceptos:water' },
      { label: 'Producción sustentable', value: 'conceptos:sustainable' },
      { label: 'Cultivos y manejo', value: 'conceptos:production' },
      { label: 'Suelo y diagnóstico', value: 'conceptos:soil' },
      { label: 'Decisiones de campo', value: 'conceptos:field' },
      { label: 'Negocio agrícola', value: 'conceptos:business' },
      { label: 'Cultivos específicos', value: 'conceptos:crops' },
      { label: 'Escribir mi pregunta', value: 'preguntar-concepto' },
      { label: 'Volver al menú', value: 'inicio' }
    ]);
  }

  function showConceptGroup(groupKey) {
    const group = conceptGroups[groupKey];
    if (!group) { showConceptHub(); return; }
    state.flow = 'concepts'; save();
    reply(group.prompt);
    showQuick([
      ...conceptOptions(group.items),
      { label: 'Ver otras categorías', value: 'conceptos' },
      { label: 'Volver al menú', value: 'inicio' }
    ]);
  }

  function findConcept(value) {
    const buttonKey = String(value).startsWith('concepto:') ? String(value).slice('concepto:'.length) : '';
    if (buttonKey && concepts[buttonKey]) return buttonKey;
    const normalized = normalize(value);
    const asksForMeaning = /(^|\s)(que es|que significa|para que sirve|explicame|define|definicion|como funciona|como afecta|como influye|como mejorar|como manejar|como producir|por que|cual es|cuales son|que necesito|que diferencia|cuentame sobre|hablame de)(\s|$)/.test(normalized);
    const aliases = Object.entries(concepts).flatMap(([key, concept]) => concept.aliases.map((alias) => ({ key, alias: normalize(alias) }))).sort((a, b) => b.alias.length - a.alias.length);
    const exact = aliases.find(({ alias }) => normalized === alias);
    if (exact) return exact.key;
    if (!asksForMeaning) return '';
    return aliases.find(({ alias }) => normalized.includes(alias))?.key || '';
  }

  function rankCourses(searchTerms, limit = 3) {
    const catalog = readCatalog();
    const wantedPhrases = searchTerms.map(normalize).filter(Boolean);
    const wantedTokens = [...new Set(wantedPhrases.flatMap(tokens))];
    return catalog.map((course, index) => {
      const haystack = normalize(`${course.title} ${course.area} ${course.detail}`);
      const title = normalize(course.title);
      const phraseScore = wantedPhrases.reduce((total, phrase) => total + (title === phrase ? 20 : title.includes(phrase) || phrase.includes(title) ? 10 : haystack.includes(phrase) ? 6 : 0), 0);
      const tokenScore = wantedTokens.reduce((total, token) => total + (title.includes(token) ? 3 : haystack.includes(token) ? 1 : 0), 0);
      return { course, score: phraseScore + tokenScore, index };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, limit).map((item) => item.course);
  }

  function findNamedCourses(names, limit = 3) {
    const catalog = readCatalog();
    const selected = [];
    names.forEach((name) => {
      const wanted = normalize(name);
      const match = catalog.find((course) => {
        const title = normalize(course.title);
        return title === wanted || title.includes(wanted) || wanted.includes(title);
      });
      if (match && !selected.some((course) => normalize(course.title) === normalize(match.title))) selected.push(match);
    });
    return selected.slice(0, limit);
  }

  function answerConcept(key) {
    const concept = concepts[key];
    if (!concept) { showConceptHub(); return; }
    state.flow = 'home'; save();
    const recommendations = findNamedCourses(concept.courseQueries || [concept.label]);
    const explanation = [concept.definition, concept.practical].filter(Boolean).join('\n\nEn la práctica: ');
    const text = recommendations.length
      ? `${explanation}\n\nPara llevar este tema a la práctica, en AgroTec contamos con estos cursos relacionados:`
      : `${explanation}\n\nPuedo ayudarte a convertir este tema en una ruta de aprendizaje.`;
    reply(text, recommendations.length ? { kind: 'courses', items: recommendations } : {});
    showQuick([
      { label: 'Explorar otro concepto', value: 'conceptos' },
      { label: 'Buscar otro curso', value: 'buscar-curso' },
      { label: 'Descubrir mi ruta', value: 'encuesta' },
      { label: 'Volver al menú', value: 'inicio' }
    ]);
  }

  function answerWithGuidance(value) {
    const normalized = normalize(value);
    const profile = guidanceProfiles.find((item) => item.pattern.test(normalized));
    const recommendations = profile ? findNamedCourses(profile.courseQueries || [], 2) : [];
    if (profile) {
      const text = recommendations.length
        ? `${profile.answer}\n\nPara profundizar y llevarlo a la práctica, estas capacitaciones de AgroTec se relacionan con tu pregunta:`
        : `${profile.answer}\n\nSi me dices el cultivo, etapa y qué observas, puedo ayudarte a ordenar mejor el diagnóstico.`;
      reply(text, recommendations.length ? { kind: 'courses', items: recommendations } : {});
      showQuick([
        { label: 'Hacer otra pregunta', value: 'duda' },
        { label: 'Explorar conceptos', value: 'conceptos' },
        { label: 'Descubrir mi ruta', value: 'encuesta' },
        { label: 'Hablar con un asesor', value: 'humano' }
      ]);
      return true;
    }
    return false;
  }

  function answerOpenQuestion(value) {
    const recommendations = rankCourses([value], 2);
    const text = recommendations.length
      ? 'Tu pregunta se relaciona con temas que sí trabajamos en AgroTec. Para responderla bien conviene separar el objetivo, las condiciones actuales, lo que ya mediste y el cambio que quieres lograr. Estas capacitaciones pueden darte una base útil y después puedo ayudarte a precisar la duda:'
      : 'Buena pregunta. Para darte una orientación útil sin inventar una receta, empezaría por cuatro datos: qué cultivo o proyecto tienes, en qué etapa está, qué observas o quieres lograr y qué cambió recientemente. Con ese contexto puedo explicarte el principio, ayudarte a ordenar posibles causas y proponerte el siguiente paso.';
    reply(text, recommendations.length ? { kind: 'courses', items: recommendations } : {});
    state.flow = 'question'; save();
    showQuick([
      { label: 'Explorar temas agrícolas', value: 'conceptos' },
      { label: 'Buscar un curso', value: 'buscar-curso' },
      { label: 'Descubrir mi ruta', value: 'encuesta' },
      { label: 'Hablar con un asesor', value: 'humano' }
    ]);
  }

  function showHomeActions() {
    showQuick([
      { label: 'Descubrir mi ruta', value: 'encuesta' },
      { label: 'Buscar por tema', value: 'buscar-curso' },
      { label: 'Aprender conceptos', value: 'conceptos' },
      { label: 'Conocer la membresía', value: 'membresia' },
      { label: 'Ver próximos cursos', value: 'proximos' },
      { label: 'Resolver una duda', value: 'duda' },
      { label: 'Hablar con un asesor', value: 'humano' }
    ]);
  }

  function resetConversation() {
    state.messages = [{ role: 'assistant', text: config.welcome, time: timeNow() }];
    state.flow = 'home';
    save();
    renderMessages();
    showHomeActions();
    wave();
    input.focus({ preventScroll: true });
  }

  async function handleInput(value, displayValue = value) {
    addMessage('user', displayValue);
    quickEl.innerHTML = '';
    setWaiting(true);
    await new Promise((resolve) => setTimeout(resolve, 380));
    setWaiting(false);

    const normalized = normalize(value);
    if (/^(hola|holi|buenos dias|buenas tardes|buenas noches|hey|que tal)$/.test(normalized)) {
      state.flow = 'home'; save();
      reply('¡Hola! Soy Agro 🌱 Puedo explicarte temas del campo con palabras claras, ayudarte a resolver una duda, buscar cursos reales o preparar una ruta personalizada. ¿Qué te gustaría hacer?');
      showHomeActions();
      return;
    }
    if (/^(gracias|muchas gracias|perfecto|excelente|me ayudo|entendido)$/.test(normalized)) {
      reply('¡Con gusto! Me alegra ayudarte. Podemos profundizar en el tema, buscar una capacitación relacionada o preparar tu ruta personalizada.');
      showHomeActions();
      return;
    }
    if (value === 'inicio') {
      state.flow = 'home'; save();
      reply('¿Qué te gustaría consultar ahora?');
      showHomeActions();
      return;
    }
    if (value === 'buscar-curso') {
      state.flow = 'search'; save();
      reply('¿Sobre qué cultivo, actividad o tema te gustaría aprender?');
      showQuick([{ label: 'Fertirriego', value: 'fertirriego' }, { label: 'Hidroponía', value: 'hidroponía' }, { label: 'Bioinsumos', value: 'bioinsumos' }, { label: 'Ver conceptos', value: 'conceptos' }]);
      return;
    }
    if (value === 'conceptos') {
      showConceptHub();
      return;
    }
    if (value.startsWith('conceptos:')) {
      showConceptGroup(value.split(':')[1]);
      return;
    }
    if (value === 'preguntar-concepto') {
      state.flow = 'concepts'; save();
      reply('Escribe tu pregunta, por ejemplo: “¿Qué es el fertirriego?” o “¿Para qué sirven los bioinsumos?”.');
      return;
    }
    const conceptKey = findConcept(value);
    if (conceptKey) { answerConcept(conceptKey); return; }
    if (value === 'encuesta' || /encuesta|diagnostico|diagnóstico|recomiend|ruta|perfil/.test(normalized)) {
      state.flow = 'home'; save();
      reply('Te acompaño con una entrevista breve: son 7 preguntas de opción múltiple y no te pide nombre ni teléfono. Al terminar verás un curso y una primera clase recomendados.', { kind: 'survey' });
      showQuick([{ label: 'Buscar por tema', value: 'buscar-curso' }, { label: 'Conocer la membresía', value: 'membresia' }]);
      return;
    }
    if (value === 'membresia' || /membresia|agroclub|plan/.test(normalized)) { explainMembership(); return; }
    if (/cuantos cursos|cantidad de cursos|que puedo aprender|que temas tienen|catalogo/.test(normalized)) {
      const catalog = readCatalog();
      const areas = [...new Set(catalog.map((course) => course.area).filter(Boolean))];
      reply(`AgroTec tiene ${catalog.length || 23} capacitaciones visibles en su catálogo. Encontrarás temas de cultivos, nutrición y suelos, producción sustentable, agroindustria, inocuidad, exportación, negocio agrícola y tecnología. ${areas.length ? `En esta página aparecen áreas como ${areas.slice(0, 5).join(', ')}.` : ''}`);
      showQuick([{ label: 'Buscar por tema', value: 'buscar-curso' }, { label: 'Descubrir mi ruta', value: 'encuesta' }, { label: 'Ver conceptos', value: 'conceptos' }]);
      return;
    }
    if (/en vivo|curso vivo|sesion vivo/.test(normalized)) {
      reply('La página confirma que AgroClub incluye sesiones en vivo, además de cursos en línea a tu ritmo. No publica aquí un calendario ni permite verificar si una actividad en vivo específica requiere inscripción adicional. Para ese dato conviene consultar a un asesor.');
      showQuick([{ label: 'Conocer la membresía', value: 'membresia' }, { label: 'Consultar por WhatsApp', value: 'humano' }]);
      return;
    }
    if (value === 'proximos' || /proximo curso|proximos cursos|proximas fechas|fecha del curso|cuando inicia el curso|cuando empieza el curso/.test(normalized)) {
      reply('Esta landing no publica un calendario verificable de próximas fechas. No voy a inventarlo. Puedo ayudarte a explorar el catálogo grabado o abrir WhatsApp para preguntar por cursos en vivo.');
      showQuick([{ label: 'Explorar catálogo', value: 'buscar-curso' }, { label: 'Consultar por WhatsApp', value: 'humano' }]);
      return;
    }
    if (value === 'duda') {
      state.flow = 'question'; save();
      reply('Claro. Escribe una pregunta sobre acceso, aprendizaje, membresía o certificados.');
      return;
    }
    if (value === 'humano' || /asesor|persona|humano|whatsapp|contact/.test(normalized)) { offerHuman(); return; }
    if (/certificado|constancia|folio|qr/.test(normalized)) {
      reply('La página indica que AgroClub ofrece certificados verificables. Para conocer los requisitos exactos de un curso, conviene revisarlo en el portal o confirmarlo con un asesor.');
      showQuick([{ label: 'Buscar un curso', value: 'buscar-curso' }, { label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    if (/^(precio|precios|cuanto cuesta|cuanto vale|comparar planes)$|(?:precio|costo|cuesta).*(?:membresia|plan|agroclub)|(?:membresia|plan|agroclub).*(?:precio|costo|cuesta)/.test(normalized)) { explainMembership(true); return; }
    if (/acceso|entrar|login|cuenta|contrasena/.test(normalized)) {
      reply('Puedes entrar desde “Quiero entrar” en la parte superior. El asistente no modifica tu cuenta, inicio de sesión ni pagos.');
      return;
    }
    if (state.flow === 'search' || /curso|capacitacion|quiero aprender|quiero estudiar|que puedo estudiar|recomiendame/.test(normalized)) { searchCourses(value); return; }

    if (answerWithGuidance(value)) return;
    answerOpenQuestion(value);
  }

  function setWaiting(waiting) {
    typingEl.hidden = !waiting;
    root.dataset.agxState = waiting ? 'waiting' : 'idle';
  }

  function reply(text, extra = {}) {
    root.dataset.agxState = 'response';
    addMessage('assistant', text, extra);
    setTimeout(() => {
      if (root.dataset.agxState === 'response') root.dataset.agxState = input.value.trim() ? 'listening' : 'idle';
    }, 900);
  }

  function searchCourses(query) {
    const catalog = readCatalog();
    state.flow = 'home'; save();
    if (!catalog.length) {
      reply('No pude leer el catálogo en este momento. No mostraré cursos de ejemplo como si fueran reales.');
      showQuick([{ label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    const matches = rankCourses([query]);
    const selected = matches.length ? matches : catalog.slice(0, 3);
    const intro = matches.length ? 'Encontré estas opciones relacionadas en el catálogo de AgroTec:' : 'No encontré una coincidencia exacta. Estas son algunas opciones del catálogo de AgroTec:';
    reply(intro, { kind: 'courses', items: selected });
    showQuick([{ label: 'Descubrir mi ruta', value: 'encuesta' }, { label: 'Buscar otro tema', value: 'buscar-curso' }, { label: 'Conocer la membresía', value: 'membresia' }, { label: 'Hablar con un asesor', value: 'humano' }]);
  }

  function explainMembership(compare = false) {
    const plans = readPlans();
    state.flow = 'home'; save();
    if (!plans.length) {
      reply('No pude verificar los planes visibles en la página. Prefiero no mostrar precios de ejemplo.');
      showQuick([{ label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    const summary = plans.map((plan) => `${plan.label}: ${plan.price}${plan.description ? ` — ${plan.description}` : ''}`).join('\n\n');
    reply(`${compare ? 'Comparación con los datos publicados en esta página:' : 'AgroClub incluye el catálogo de cursos en línea a tu ritmo, materiales, sesiones en vivo, herramientas y comunidad. La landing no publica un calendario de actividades en vivo.'}\n\n${summary}`);
    showQuick([{ label: 'Descubrir mi ruta', value: 'encuesta' }, { label: 'Buscar por tema', value: 'buscar-curso' }, { label: '¿Cómo obtengo certificado?', value: '¿Cómo obtengo mi certificado?' }, { label: 'Hablar con un asesor', value: 'humano' }]);
  }

  function offerHuman() {
    state.flow = 'home'; save();
    reply(config.humanContact.disclosure, { kind: 'human' });
    showQuick([{ label: 'Volver a opciones', value: 'inicio' }]);
  }
})();
