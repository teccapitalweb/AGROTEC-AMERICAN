/* ==========================================================================
   AgroTec América · Encuesta
   Configuración por defecto (preguntas, cursos y textos).

   - La encuesta la usa como respaldo si Firestore no responde.
   - El panel (/encuesta/admin/) la usa para "Restaurar predeterminados".
   - La fuente de verdad en producción es el documento
     Firestore `encuesta_config/main`, que se edita desde el panel.
   ========================================================================== */
window.AGROTEC_ENCUESTA_DEFAULTS = Object.freeze({
  version: 1,

  textos: {
    intro: {
      eyebrow: 'Te damos la bienvenida',
      title: 'Armemos tu ruta',
      titleAccent: 'a tu medida.',
      subtitle: 'Responde {n} preguntas rápidas y te recomendaremos los cursos, materiales y herramientas que más te sirven. Solo se hace una vez.',
      stats: [
        { icon: 'list', title: '{n} preguntas', detail: 'una a la vez' },
        { icon: 'clock', title: 'Menos de un minuto', detail: 'solo eliges opciones' },
        { icon: 'lock', title: 'Privado', detail: 'sin datos personales' }
      ],
      button: 'Empezar',
      legal: 'Al continuar aceptas nuestro aviso de privacidad.'
    },
    final: {
      eyebrow: 'Gracias por tomarte el minuto',
      title: 'Listo.',
      titleAccent: 'Tu ruta ya te conoce.',
      subtitle: 'Con tus respuestas ordenaremos lo que ves primero y decidiremos qué contenido producir.',
      coursesEyebrow: 'Para empezar, según tus intereses',
      emptyCourses: 'Muy pronto tendremos cursos para tus intereses. Mientras, explora todo el catálogo.',
      button: 'Entrar al club',
      buttonUrl: 'https://club.agrotecamerican.com/',
      again: 'Responder de nuevo'
    },
    nav: {
      later: 'Responder después',
      laterUrl: '../',
      back: 'Atrás',
      next: 'Continuar',
      finish: 'Ver mi ruta',
      hint: 'o presiona Enter'
    }
  },

  preguntas: [
    {
      id: 'stage',
      kicker: 'Tu etapa',
      title: '¿Qué te describe mejor hoy en el campo?',
      hint: 'Así ajustamos el nivel de lo que te recomendamos.',
      type: 'single',
      layout: 'list',
      options: [
        { value: 'producer', icon: '🌱', title: 'Productor o productora' },
        { value: 'advisor', icon: '🧭', title: 'Asesor técnico o agrónomo' },
        { value: 'student', icon: '🎓', title: 'Estudiante del área agro' },
        { value: 'business', icon: '📦', title: 'Empresa o negocio agro' },
        { value: 'teacher', icon: '🔬', title: 'Docente o investigador' },
        { value: 'other', icon: '✨', title: 'Otra etapa' }
      ]
    },
    {
      id: 'experience',
      kicker: 'Tu experiencia',
      title: '¿Cuánta experiencia tienes en el campo?',
      hint: 'Cuenta el tiempo trabajando cultivos, dentro o fuera de la escuela.',
      type: 'single',
      layout: 'list',
      options: [
        { value: 'studying', icon: '📖', title: 'Aún estoy estudiando' },
        { value: 'lt1', icon: '🌿', title: 'Menos de 1 año' },
        { value: '1-3', icon: '🌾', title: 'De 1 a 3 años' },
        { value: '4-7', icon: '🚜', title: 'De 4 a 7 años' },
        { value: '8plus', icon: '🏆', title: '8 años o más' }
      ]
    },
    {
      id: 'source',
      kicker: 'Cómo llegaste',
      title: '¿Cómo conociste AgroTec América?',
      hint: 'Elige el lugar donde nos viste por primera vez.',
      type: 'single',
      layout: 'tiles',
      options: [
        { value: 'instagram', icon: 'brand:instagram', title: 'Instagram' },
        { value: 'facebook', icon: 'brand:facebook', title: 'Facebook' },
        { value: 'tiktok', icon: 'brand:tiktok', title: 'TikTok' },
        { value: 'google', icon: 'brand:google', title: 'Google' },
        { value: 'whatsapp', icon: 'brand:whatsapp', title: 'WhatsApp' },
        { value: 'referral', icon: '🤝', title: 'Colega o productor' },
        { value: 'event', icon: '📅', title: 'Curso o evento' },
        { value: 'other', icon: '···', title: 'Otro medio' }
      ]
    },
    {
      id: 'goal',
      kicker: 'Tu objetivo',
      title: '¿Qué quieres lograr principalmente?',
      hint: 'Elige el que más pese hoy; después puedes explorar todo lo demás.',
      type: 'single',
      layout: 'list',
      options: [
        { value: 'yield', icon: '📈', title: 'Mejorar el rendimiento' },
        { value: 'update', icon: '🔄', title: 'Mantenerme actualizado' },
        { value: 'certify', icon: '🏅', title: 'Obtener una certificación' },
        { value: 'costs', icon: '💰', title: 'Bajar costos de producción' },
        { value: 'grow', icon: '🚀', title: 'Emprender o crecer' },
        { value: 'tools', icon: '🧰', title: 'Conseguir herramientas' }
      ]
    },
    {
      id: 'areas',
      kicker: 'Tus intereses',
      title: '¿Qué áreas te interesan más?',
      hint: 'Elige hasta tres. Con esto ordenamos los cursos que verás primero.',
      type: 'multi',
      max: 3,
      layout: 'chips',
      options: [
        { value: 'health', icon: '🪲', title: 'Plagas y enfermedades' },
        { value: 'soil', icon: '🧪', title: 'Suelo y nutrición' },
        { value: 'water', icon: '💧', title: 'Riego y fertirrigación' },
        { value: 'protected', icon: '🏠', title: 'Invernadero e hidroponía' },
        { value: 'crops', icon: '🍅', title: 'Frutales y hortalizas' },
        { value: 'organic', icon: '🍃', title: 'Orgánico y bioinsumos' },
        { value: 'business', icon: '📊', title: 'Costos y comercialización' },
        { value: 'tech', icon: '🛰️', title: 'Agricultura de precisión' }
      ]
    },
    {
      id: 'format',
      kicker: 'Cómo aprendes',
      title: '¿Cómo prefieres aprender?',
      hint: 'Nos ayuda a decidir qué producir primero.',
      type: 'single',
      layout: 'list',
      options: [
        { value: 'video', icon: '▶️', title: 'Clases cortas en video' },
        { value: 'cases', icon: '🔍', title: 'Casos de campo paso a paso' },
        { value: 'live', icon: '📡', title: 'Sesiones en vivo' },
        { value: 'guides', icon: '🗒️', title: 'Guías y formatos' },
        { value: 'quiz', icon: '🎯', title: 'Quizzes y retos' }
      ]
    },
    {
      id: 'barrier',
      kicker: 'Tu reto',
      title: '¿Qué es lo que más te dificulta seguir capacitándote?',
      hint: 'Queremos quitar ese obstáculo, no sumar otro.',
      type: 'single',
      layout: 'list',
      options: [
        { value: 'time', icon: '🕒', title: 'Falta de tiempo' },
        { value: 'cost', icon: '💳', title: 'El costo de los cursos' },
        { value: 'trust', icon: '🔎', title: 'Encontrar contenido confiable' },
        { value: 'practice', icon: '🌾', title: 'Llevar la teoría a la parcela' },
        { value: 'signal', icon: '📶', title: 'Poca señal en el campo' },
        { value: 'other', icon: '💭', title: 'Otro motivo' }
      ]
    }
  ],

  /* `areas` enlaza cada curso con los valores de la pregunta `areas`.
     `image` es relativa a la raíz del sitio (o una URL completa).
     `available` controla si el curso puede recomendarse al final. */
  cursos: [
    { id: 'agricultura-organica', title: 'Agricultura Orgánica', category: 'Cultivos', level: 'Intermedio', image: 'img/cursos-real/curso-agricultura-organica.webp', url: 'https://club.agrotecamerican.com/#/curso/agricultura-organica', areas: ['organic', 'soil'], available: true },
    { id: 'cultivo-de-berries', title: 'Cultivo de berries', category: 'Cultivos', level: 'Intermedio', image: 'img/cursos-real/curso-cultivo-de-berries.webp', url: 'https://club.agrotecamerican.com/#/curso/cultivo-de-berries', areas: ['crops', 'protected'], available: true },
    { id: 'flor-de-lilis', title: 'Cultivo de Flor de Lilis para Corte', category: 'Ornamentales', level: 'Intermedio', image: 'img/cursos-real/curso-cultivo-de-flor-de-lilis-para-corte.webp', url: 'https://club.agrotecamerican.com/#/curso/cultivo-de-flor-de-lilis-para-corte', areas: ['crops', 'protected'], available: true },
    { id: 'derivados-amaranto', title: 'Derivados Dulces de Amaranto', category: 'Agroindustria', level: 'Intermedio', image: 'img/cursos-real/curso-derivados-dulces-de-amaranto.webp', url: 'https://club.agrotecamerican.com/#/curso/derivados-dulces-de-amaranto', areas: ['business'], available: true },
    { id: 'programas-nutricionales', title: 'Diseño de Programas Nutricionales en Diferentes Cultivos', category: 'Nutrición y suelos', level: 'Intermedio', image: 'img/cursos-real/curso-diseno-de-programas-nutricionales-en-diferentes-cultivos.webp', url: 'https://club.agrotecamerican.com/#/curso/diseno-de-programas-nutricionales-en-diferentes-cultivos', areas: ['soil', 'water'], available: true },
    { id: 'hierbas-aromaticas', title: 'Especializado en el Cultivo de Hierbas Aromáticas', category: 'Cultivos', level: 'Intermedio', image: 'img/cursos-real/curso-especializado-en-el-cultivo-de-hierbas-aromaticas.webp', url: 'https://club.agrotecamerican.com/#/curso/especializado-en-el-cultivo-de-hierbas-aromaticas', areas: ['crops'], available: true },

    { id: 'cacao', title: 'Producción de Cacao', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/01-cacao.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'agronomia', title: 'Agronomía para No Agrónomos', category: 'Técnicas', level: 'Básico', image: 'img/editorial/cursos-v2/02-agronomia.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['soil', 'health', 'crops'], available: true },
    { id: 'papaya', title: 'Producción de Papaya', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/03-papaya.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'hidroponia', title: 'Hidroponía para Todos', category: 'Técnicas', level: 'Básico', image: 'img/editorial/cursos-v2/04-hidroponia.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['protected', 'water'], available: true },
    { id: 'melon', title: 'Cultivo de Melón', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/05-melon.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'bioinsumos', title: 'Bioinsumos', category: 'Técnicas', level: 'Intermedio', image: 'img/editorial/cursos-v2/06-bioinsumos.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['organic', 'health'], available: true },
    { id: 'girasol', title: 'Producción de Girasol', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/07-girasol.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'fertirrigacion', title: 'Fertirrigación', category: 'Técnicas', level: 'Avanzado', image: 'img/editorial/cursos-v2/08-fertirrigacion.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['water', 'soil'], available: true },
    { id: 'hongos', title: 'Producción de Hongos', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/09-hongos.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['protected', 'crops'], available: true },
    { id: 'biofabricas', title: 'Biofábricas', category: 'Técnicas', level: 'Avanzado', image: 'img/editorial/cursos-v2/10-biofabricas.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['organic', 'health'], available: true },
    { id: 'plantulas', title: 'Producción de Plántulas', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/11-plantulas.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['protected', 'crops'], available: true },
    { id: 'contabilidad', title: 'Contabilidad Agrícola', category: 'Gestión', level: 'Básico', image: 'img/editorial/cursos-v2/12-contabilidad.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['business'], available: true },
    { id: 'chiles', title: 'Manejo de Chiles Verdes', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/13-chiles.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops', 'health'], available: true },
    { id: 'polinizadores', title: 'Polinizadores', category: 'Técnicas', level: 'Básico', image: 'img/editorial/cursos-v2/14-polinizadores.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['health', 'organic'], available: true },
    { id: 'nopal', title: 'Aprovechamiento del Nopal', category: 'Cultivos', level: 'Básico', image: 'img/editorial/cursos-v2/15-nopal.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'exportacion', title: 'Exportación Agrícola', category: 'Gestión', level: 'Avanzado', image: 'img/editorial/cursos-v2/16-exportacion.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['business'], available: true },
    { id: 'tomatillo', title: 'Cultivo de Tomatillo', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/17-tomatillo.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'lombricomposta', title: 'Lombricomposta', category: 'Técnicas', level: 'Básico', image: 'img/editorial/cursos-v2/18-lombricomposta.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['organic', 'soil'], available: true },
    { id: 'frutales', title: 'Árboles Frutales', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/19-frutales.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'inocuidad', title: 'Inocuidad Alimentaria', category: 'Gestión', level: 'Intermedio', image: 'img/editorial/cursos-v2/20-inocuidad.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['business'], available: true },
    { id: 'viveros', title: 'Manejo de Viveros', category: 'Técnicas', level: 'Intermedio', image: 'img/editorial/cursos-v2/22-viveros.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['protected', 'crops'], available: true },
    { id: 'orquideas', title: 'Orquídeas', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/23-orquideas.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops', 'protected'], available: true },
    { id: 'alimentos-funcionales', title: 'Alimentos Funcionales', category: 'Gestión', level: 'Intermedio', image: 'img/editorial/cursos-v2/24-alimentos-funcionales.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['business'], available: true },
    { id: 'pitahaya', title: 'Manejo de Pitahaya', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/25-pitahaya.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'ia-agricultura', title: 'IA en Agricultura', category: 'Técnicas', level: 'Intermedio', image: 'img/editorial/cursos-v2/26-ia-agricultura.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['tech'], available: true },
    { id: 'cana', title: 'Producción de Caña', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/27-cana.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops'], available: true },
    { id: 'maiz', title: 'Maíz', category: 'Cultivos', level: 'Intermedio', image: 'img/editorial/cursos-v2/28-maiz.webp', url: 'https://agrotecamerican.com/#cursos', areas: ['crops', 'soil'], available: true }
  ]
});

/* Normaliza una configuración remota (Firestore) contra los predeterminados:
   rellena textos faltantes, descarta preguntas/opciones inválidas. */
(() => {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const normalizeConfig = (remote) => {
    const base = clone(window.AGROTEC_ENCUESTA_DEFAULTS);
    if (!remote || typeof remote !== 'object') return base;
    const out = { version: Number(remote.version) || base.version, textos: base.textos, preguntas: base.preguntas, cursos: base.cursos };
    if (remote.textos && typeof remote.textos === 'object') {
      out.textos = {
        intro: { ...base.textos.intro, ...(remote.textos.intro || {}) },
        final: { ...base.textos.final, ...(remote.textos.final || {}) },
        nav: { ...base.textos.nav, ...(remote.textos.nav || {}) }
      };
      if (!Array.isArray(out.textos.intro.stats) || !out.textos.intro.stats.length) out.textos.intro.stats = base.textos.intro.stats;
    }
    if (Array.isArray(remote.preguntas)) {
      const valid = remote.preguntas.filter((q) => q && q.id && q.title && Array.isArray(q.options) && q.options.length >= 2);
      if (valid.length) out.preguntas = valid.map((q) => ({
        id: String(q.id), kicker: q.kicker || '', title: q.title, hint: q.hint || '',
        type: q.type === 'multi' ? 'multi' : 'single', max: Math.max(1, Number(q.max) || 3),
        layout: ['list', 'tiles', 'chips'].includes(q.layout) ? q.layout : 'list',
        options: q.options.filter((o) => o && o.value && o.title).map((o) => ({ value: String(o.value), icon: o.icon || '', title: o.title, detail: o.detail || '' }))
      })).filter((q) => q.options.length >= 2);
    }
    if (Array.isArray(remote.cursos)) {
      out.cursos = remote.cursos.filter((c) => c && c.id && c.title).map((c) => ({
        id: String(c.id), title: c.title, category: c.category || '', level: c.level || '', image: c.image || '', url: c.url || '',
        areas: Array.isArray(c.areas) ? c.areas.map(String) : [], available: c.available !== false
      }));
    }
    return out;
  };
  
  window.AGROTEC_ENCUESTA_UTILS = Object.freeze({ clone, normalizeConfig });
})();
