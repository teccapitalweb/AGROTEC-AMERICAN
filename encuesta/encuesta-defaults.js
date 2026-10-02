/* ==========================================================================
   AgroTec América · Encuesta de diagnóstico
   Configuración por defecto: preguntas, textos, personaje y los cursos reales
   del club (club.agrotecamerican.com) con las etiquetas que usa el motor de
   recomendación.

   - La encuesta la usa como respaldo si Firestore no responde.
   - El panel (/encuesta/admin/) la usa para "Restaurar predeterminados".
   - En producción manda el documento Firestore `encuesta_config/main`.

   Íconos: 'i:nombre' (lucide, ver icons.js), 'brand:instagram' … o un emoji.
   Imágenes: URL completa o ruta relativa a la raíz del sitio.
   ========================================================================== */
window.AGROTEC_ENCUESTA_DEFAULTS = Object.freeze({
  version: 2,
  clubUrl: 'https://club.agrotecamerican.com',

  textos: {
    intro: {
      eyebrow: 'Diagnóstico de aprendizaje',
      title: 'Descubre tu',
      titleAccent: 'siguiente paso en el campo.',
      subtitle: 'Responde {n} preguntas rápidas. Con tus respuestas encontraremos el curso y la clase del club que mejor encajan contigo.',
      stats: [
        { icon: 'list-checks', title: '{n} preguntas', detail: 'una a la vez' },
        { icon: 'timer', title: 'Menos de dos minutos', detail: 'solo eliges opciones' },
        { icon: 'shield-check', title: 'Privado', detail: 'sin datos personales' }
      ],
      button: 'Empezar',
      legal: 'Al continuar aceptas nuestro aviso de privacidad.'
    },
    analizando: {
      title: 'Analizando tus respuestas…',
      steps: ['Leyendo tu perfil', 'Comparando con {c} cursos del club', 'Eligiendo tu primera clase'],
      durationMs: 2200
    },
    final: {
      eyebrow: 'Encontramos tu siguiente paso',
      title: '¡Listo!',
      titleAccent: 'Tu ruta ya te conoce.',
      subtitle: 'Según tus respuestas, creemos que esta capacitación puede ayudarte especialmente en lo que estás buscando.',
      courseEyebrow: 'Te recomendamos',
      whyPrefix: 'Te recomendamos esta capacitación porque',
      classEyebrow: 'Empieza con esta clase',
      classHint: 'Seleccionamos una clase para que puedas comenzar ahora mismo.',
      button: 'Ver clase recomendada',
      secondary: 'Explorar más cursos',
      secondaryUrl: 'https://club.agrotecamerican.com/#/cursos',
      again: 'Responder de nuevo',
      emptyCourses: 'Muy pronto tendremos cursos para tus intereses. Mientras, explora todo el catálogo.'
    },
    avance: {
      mitad: '¡Vamos muy bien!',
      casi: 'Ya casi terminamos.',
      ultima: 'Una pregunta más.'
    },
    personaje: {
      nombre: 'Agro',
      intro: '¡Hola! Voy a hacerte unas preguntas rápidas para conocerte mejor.',
      pregunta: 'Perfecto, esto me ayuda a entender qué estás buscando.',
      mitad: '¡Vamos muy bien! Ya tengo una idea de tu perfil.',
      casi: 'Ya casi termino, solo me faltan un par de datos.',
      analizando: 'Ya casi termino de analizar tus respuestas…',
      resultado: '¡Listo! Encontré una capacitación que puede interesarte.'
    },
    nav: {
      later: 'Responder después',
      laterUrl: '../',
      back: 'Atrás',
      next: 'Continuar',
      finish: 'Ver mi resultado',
      hint: 'o presiona Enter'
    }
  },

  /* dimension: a qué parte del perfil aporta la pregunta
     (profile · level · source · goal · interests · format · problem · time).
     layout: cards · scale · tiles · big · images · list · chips.
     mood: estado del personaje mientras se ve la pregunta
     (greet · point · think · tablet · calculator · approve · surprise · celebrate). */
  preguntas: [
    {
      id: 'stage', dimension: 'profile', kicker: 'Tu etapa',
      title: '¿Qué te describe mejor hoy en el campo?',
      hint: 'Así ajustamos el nivel y el enfoque de lo que te recomendamos.',
      type: 'single', layout: 'cards', mood: 'point',
      bubble: 'Cuéntame desde dónde arrancas.',
      options: [
        { value: 'producer', icon: 'i:sprout', title: 'Productor o productora', detail: 'Trabajo mi parcela, huerto o rancho.' },
        { value: 'advisor', icon: 'i:compass', title: 'Asesor técnico o agrónomo', detail: 'Acompaño a productores en campo.' },
        { value: 'student', icon: 'i:graduation-cap', title: 'Estudiante del área agro', detail: 'Me estoy formando en la escuela.' },
        { value: 'business', icon: 'i:store', title: 'Empresa o negocio agro', detail: 'Vendo, distribuyo o transformo producto.' },
        { value: 'hobby', icon: 'i:home', title: 'Cultivo en casa o por gusto', detail: 'Huerto, jardín o plantas en casa.' },
        { value: 'teacher', icon: 'i:microscope', title: 'Docente o investigador', detail: 'Enseño o investigo en el sector.' }
      ]
    },
    {
      id: 'experience', dimension: 'level', kicker: 'Tu experiencia',
      title: '¿Cuánta experiencia tienes en el campo?',
      hint: 'Cuenta el tiempo trabajando cultivos, dentro o fuera de la escuela.',
      type: 'single', layout: 'scale', mood: 'think',
      bubble: 'Sin presión: no hay respuestas buenas ni malas.',
      options: [
        { value: 'studying', icon: 'i:book-open', title: 'Aún estudio', detail: 'Todavía no trabajo en campo', level: 'basico' },
        { value: 'lt1', icon: 'i:sprout', title: 'Menos de 1 año', detail: 'Primeros pasos', level: 'basico' },
        { value: '1-3', icon: 'i:leaf', title: '1 a 3 años', detail: 'Algunos ciclos completos', level: 'intermedio' },
        { value: '4-7', icon: 'i:tractor', title: '4 a 7 años', detail: 'Experiencia práctica sólida', level: 'avanzado' },
        { value: '8plus', icon: 'i:trophy', title: '8 años o más', detail: 'Busco profundizar', level: 'avanzado' }
      ]
    },
    {
      id: 'source', dimension: 'source', kicker: 'Cómo llegaste',
      title: '¿Cómo conociste AgroTec América?',
      hint: 'Elige el lugar donde nos viste por primera vez.',
      type: 'single', layout: 'tiles', mood: 'surprise',
      bubble: '¡Qué gusto que llegaras hasta aquí!',
      options: [
        { value: 'instagram', icon: 'brand:instagram', title: 'Instagram' },
        { value: 'facebook', icon: 'brand:facebook', title: 'Facebook' },
        { value: 'tiktok', icon: 'brand:tiktok', title: 'TikTok' },
        { value: 'google', icon: 'brand:google', title: 'Google' },
        { value: 'whatsapp', icon: 'brand:whatsapp', title: 'WhatsApp' },
        { value: 'referral', icon: 'i:handshake', title: 'Colega o productor' },
        { value: 'event', icon: 'i:calendar-days', title: 'Curso o evento' },
        { value: 'other', icon: 'i:ellipsis', title: 'Otro medio' }
      ]
    },
    {
      id: 'goal', dimension: 'goal', kicker: 'Tu objetivo',
      title: '¿Qué quieres lograr principalmente?',
      hint: 'Elige el que más pese hoy; después puedes explorar todo lo demás.',
      type: 'single', layout: 'big', mood: 'tablet',
      bubble: 'Esto define qué curso te conviene primero.',
      options: [
        { value: 'yield', icon: 'i:trending-up', title: 'Mejorar el rendimiento', detail: 'Sacar más y mejor cosecha de mi cultivo.' },
        { value: 'update', icon: 'i:refresh-cw', title: 'Mantenerme actualizado', detail: 'Conocer nuevas prácticas y tecnologías.' },
        { value: 'certify', icon: 'i:award', title: 'Obtener una certificación', detail: 'Respaldar lo que sé con una constancia.' },
        { value: 'costs', icon: 'i:coins', title: 'Bajar costos de producción', detail: 'Invertir mejor en insumos y labores.' },
        { value: 'grow', icon: 'i:rocket', title: 'Emprender o crecer', detail: 'Arrancar o hacer crecer un negocio agro.' },
        { value: 'tools', icon: 'i:wrench', title: 'Conseguir herramientas', detail: 'Formatos, calculadoras y registros de campo.' }
      ]
    },
    {
      id: 'areas', dimension: 'interests', kicker: 'Tus intereses',
      title: '¿Qué áreas te interesan más?',
      hint: 'Elige hasta tres. Con esto ordenamos los cursos que verás primero.',
      type: 'multi', max: 3, layout: 'images', mood: 'approve',
      bubble: 'Elige lo que de verdad te daría ganas de aprender.',
      options: [
        { value: 'crops', icon: 'i:apple', title: 'Frutales y hortalizas', image: 'https://club.agrotecamerican.com/cursos/curso-floracion-y-cuajado-en-frutales-tropicales.webp' },
        { value: 'protected', icon: 'i:warehouse', title: 'Invernadero e hidroponía', image: 'https://club.agrotecamerican.com/cursos/curso-manejo-agronomico-de-hortalizas-en-invernadero.webp' },
        { value: 'soil', icon: 'i:flask-conical', title: 'Suelo y nutrición', image: 'https://club.agrotecamerican.com/cursos/curso-diseno-de-programas-nutricionales-en-diferentes-cultivos.webp' },
        { value: 'health', icon: 'i:bug', title: 'Plagas y sanidad', image: 'https://club.agrotecamerican.com/cursos/curso-uso-responsable-de-agroquimicos.webp' },
        { value: 'water', icon: 'i:droplets', title: 'Riego y fertirrigación', image: 'https://club.agrotecamerican.com/cursos/curso-cultivo-de-berries.webp' },
        { value: 'organic', icon: 'i:leaf', title: 'Orgánico y bioinsumos', image: 'https://club.agrotecamerican.com/cursos/curso-agricultura-organica.webp' },
        { value: 'ornamental', icon: 'i:flower-2', title: 'Flores y ornamentales', image: 'https://club.agrotecamerican.com/cursos/curso-produccion-y-manejo-comercial-de-gladiolas.webp' },
        { value: 'agroindustry', icon: 'i:factory', title: 'Transformación y valor agregado', image: 'https://club.agrotecamerican.com/cursos/curso-derivados-dulces-de-amaranto.webp' },
        { value: 'business', icon: 'i:chart-column', title: 'Costos, empaque y venta', image: 'https://club.agrotecamerican.com/cursos/curso-inocuidad-y-calidad-en-empaque-y-exportacion-agricola.webp' }
      ]
    },
    {
      id: 'format', dimension: 'format', kicker: 'Cómo aprendes',
      title: '¿Cómo prefieres aprender?',
      hint: 'Nos ayuda a decidir qué producir primero.',
      type: 'single', layout: 'list', mood: 'think',
      bubble: 'El mejor formato es el que sí vuelves a abrir.',
      options: [
        { value: 'video', icon: 'i:play-circle', title: 'Clases cortas en video' },
        { value: 'cases', icon: 'i:search', title: 'Casos de campo paso a paso' },
        { value: 'live', icon: 'i:radio', title: 'Sesiones en vivo' },
        { value: 'guides', icon: 'i:notebook-pen', title: 'Guías y formatos' },
        { value: 'quiz', icon: 'i:target', title: 'Quizzes y retos' }
      ]
    },
    {
      id: 'barrier', dimension: 'problem', kicker: 'Tu reto',
      title: '¿Qué es lo que más te dificulta seguir capacitándote?',
      hint: 'Queremos quitar ese obstáculo, no sumar otro.',
      type: 'single', layout: 'cards', mood: 'calculator',
      bubble: 'Con esto adaptamos la ruta a tu realidad.',
      options: [
        { value: 'time', icon: 'i:clock', title: 'Falta de tiempo', detail: 'La temporada no me deja respirar.' },
        { value: 'cost', icon: 'i:credit-card', title: 'El costo de los cursos', detail: 'Necesito que la inversión valga la pena.' },
        { value: 'trust', icon: 'i:search-check', title: 'Encontrar contenido confiable', detail: 'Hay mucha información sin respaldo.' },
        { value: 'practice', icon: 'i:shovel', title: 'Llevar la teoría a la parcela', detail: 'Me cuesta aplicarlo en mi cultivo.' },
        { value: 'signal', icon: 'i:wifi-off', title: 'Poca señal en el campo', detail: 'El internet no siempre me alcanza.' },
        { value: 'other', icon: 'i:message-circle', title: 'Otro motivo', detail: 'Algo distinto me lo complica.' }
      ]
    },
    {
      id: 'time', dimension: 'time', kicker: 'Tu tiempo',
      title: '¿Cuánto tiempo puedes dedicar a la semana?',
      hint: 'Para proponerte un ritmo realista.',
      type: 'single', layout: 'scale', mood: 'tablet',
      bubble: 'Última pregunta, lo prometo.',
      options: [
        { value: 'lt1', icon: 'i:hourglass', title: 'Menos de 1 hora', detail: 'Ratitos sueltos' },
        { value: '1-3', icon: 'i:clock', title: '1 a 3 horas', detail: 'Una clase por semana' },
        { value: '3-5', icon: 'i:calendar-days', title: '3 a 5 horas', detail: 'Ritmo constante' },
        { value: '5plus', icon: 'i:zap', title: 'Más de 5 horas', detail: 'A fondo' }
      ]
    }
  ],

  /* Cursos reales del club. `tags` alimenta el motor de recomendación:
     interests ↔ opciones de la pregunta `areas` (la primera etiqueta es la principal),
     goals ↔ `goal`, profiles ↔ `stage`, problems ↔ `barrier`, levels ↔ nivel derivado de `experience`.
     `featuredClass` es la clase que se muestra como gancho; `classes` viene del catálogo del club. */
  cursos: [
    {
      id: "agricultura-organica", title: "Agricultura Orgánica", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-agricultura-organica.webp", url: "https://club.agrotecamerican.com/#/curso/agricultura-organica",
      summary: "Diseñar un manejo orgánico verificable, partiendo del suelo y cerrando con registros.",
      tags: { interests: ["organic", "soil", "crops"], goals: ["certify", "update", "yield"], profiles: ["producer", "student", "hobby", "advisor"], problems: ["cost", "trust"], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 113, free: true }, { n: 2, title: "Clase 2", min: 126, free: true }, { n: 3, title: "Clase 3", min: 131, free: true }, { n: 4, title: "Clase 4", min: 131, free: true }, { n: 5, title: "Clase 5", min: 142, free: false }]
    },
    {
      id: "cultivo-de-berries", title: "Cultivo de berries", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-cultivo-de-berries.webp", url: "https://club.agrotecamerican.com/#/curso/cultivo-de-berries",
      summary: "Organizar decisiones de establecimiento, riego, sanidad y cosecha de berries.",
      tags: { interests: ["crops", "protected", "water"], goals: ["yield", "grow"], profiles: ["producer", "business", "advisor"], problems: ["practice"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 52, free: false }, { n: 2, title: "Clase 2", min: 65, free: false }, { n: 3, title: "Clase 3", min: 64, free: false }, { n: 4, title: "Clase 4", min: 76, free: false }, { n: 5, title: "Clase 5", min: 55, free: false }]
    },
    {
      id: "cultivo-de-flor-de-lilis-para-corte", title: "Cultivo de Flor de Lilis para Corte", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-cultivo-de-flor-de-lilis-para-corte.webp", url: "https://club.agrotecamerican.com/#/curso/cultivo-de-flor-de-lilis-para-corte",
      summary: "Planear un cultivo de lirios de corte con foco en calidad comercial.",
      tags: { interests: ["ornamental", "protected"], goals: ["grow", "yield"], profiles: ["producer", "business", "hobby"], problems: [], levels: ["intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 69, free: false }, { n: 2, title: "Clase 2", min: 58, free: false }, { n: 3, title: "Clase 3", min: 53, free: false }, { n: 4, title: "Clase 4", min: 19, free: false }]
    },
    {
      id: "derivados-dulces-de-amaranto", title: "Derivados Dulces de Amaranto", category: "Agroindustria", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-derivados-dulces-de-amaranto.webp", url: "https://club.agrotecamerican.com/#/curso/derivados-dulces-de-amaranto",
      summary: "Transformar amaranto en productos dulces con control de calidad e inocuidad.",
      tags: { interests: ["agroindustry", "business"], goals: ["grow", "costs"], profiles: ["business", "producer", "hobby"], problems: ["cost"], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 57, free: false }, { n: 2, title: "Clase 2", min: 61, free: false }, { n: 3, title: "Clase 3", min: 45, free: false }, { n: 4, title: "Clase 4", min: 44, free: false }, { n: 5, title: "Clase 5", min: 51, free: false }]
    },
    {
      id: "diseno-de-programas-nutricionales-en-diferentes-cultivos", title: "Diseño de Programas Nutricionales en Diferentes Cultivos", category: "Nutrición y suelos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-diseno-de-programas-nutricionales-en-diferentes-cultivos.webp", url: "https://club.agrotecamerican.com/#/curso/diseno-de-programas-nutricionales-en-diferentes-cultivos",
      summary: "Construir programas de nutrición ajustados a cultivo, etapa y análisis.",
      tags: { interests: ["soil", "water", "crops"], goals: ["yield", "costs", "update"], profiles: ["advisor", "producer", "teacher"], problems: ["practice", "trust"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 60, free: false }, { n: 2, title: "Clase 2", min: 49, free: false }, { n: 3, title: "Clase 3", min: 66, free: false }, { n: 4, title: "Clase 4", min: 54, free: false }, { n: 5, title: "Clase 5", min: 51, free: false }]
    },
    {
      id: "especializado-en-el-cultivo-de-hierbas-aromaticas", title: "Especializado en el Cultivo de Hierbas Aromáticas", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-especializado-en-el-cultivo-de-hierbas-aromaticas.webp", url: "https://club.agrotecamerican.com/#/curso/especializado-en-el-cultivo-de-hierbas-aromaticas",
      summary: "Producir hierbas aromáticas con calidad sensorial e inocuidad.",
      tags: { interests: ["crops", "organic", "agroindustry"], goals: ["grow", "yield"], profiles: ["producer", "hobby", "business"], problems: [], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 62, free: false }, { n: 2, title: "Clase 2", min: 59, free: false }, { n: 3, title: "Clase 3", min: 55, free: false }, { n: 4, title: "Clase 4", min: 102, free: false }]
    },
    {
      id: "floracion-y-cuajado-en-frutales-tropicales", title: "Floración y Cuajado en Frutales Tropicales", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-floracion-y-cuajado-en-frutales-tropicales.webp", url: "https://club.agrotecamerican.com/#/curso/floracion-y-cuajado-en-frutales-tropicales",
      summary: "Interpretar floración, polinización y amarre de fruto sin soluciones universales.",
      tags: { interests: ["crops", "health", "soil"], goals: ["yield", "update"], profiles: ["producer", "advisor", "teacher"], problems: ["practice"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 71, free: false }, { n: 2, title: "Clase 2", min: 60, free: false }, { n: 3, title: "Clase 3", min: 72, free: false }, { n: 4, title: "Clase 4", min: 60, free: false }, { n: 5, title: "Clase 5", min: 64, free: false }]
    },
    {
      id: "huertos-verticales-y-semiurbanos", title: "Huertos Verticales y Semiurbanos", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-huertos-verticales-y-semiurbanos.webp", url: "https://club.agrotecamerican.com/#/curso/huertos-verticales-y-semiurbanos",
      summary: "Diseñar huertos pequeños seguros, sostenibles y fáciles de mantener.",
      tags: { interests: ["crops", "organic", "protected"], goals: ["tools", "grow", "update"], profiles: ["hobby", "student", "business"], problems: ["time", "signal"], levels: ["basico"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 56, free: false }, { n: 2, title: "Clase 2", min: 85, free: false }, { n: 3, title: "Clase 3", min: 61, free: false }, { n: 4, title: "Clase 4", min: 48, free: false }]
    },
    {
      id: "inocuidad-y-calidad-en-empaque-y-exportacion-agricola", title: "Inocuidad y Calidad en Empaque y Exportación Agrícola", category: "Gestión", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-inocuidad-y-calidad-en-empaque-y-exportacion-agricola.webp", url: "https://club.agrotecamerican.com/#/curso/inocuidad-y-calidad-en-empaque-y-exportacion-agricola",
      summary: "Entender la cadena de empaque y exportación con trazabilidad y control preventivo.",
      tags: { interests: ["business", "agroindustry", "health"], goals: ["certify", "grow", "costs"], profiles: ["business", "producer", "advisor"], problems: ["trust"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 64, free: false }, { n: 2, title: "Clase 2", min: 54, free: false }, { n: 3, title: "Clase 3", min: 58, free: false }, { n: 4, title: "Clase 4", min: 52, free: false }]
    },
    {
      id: "manejo-agronomico-de-hortalizas-en-invernadero", title: "Manejo Agronómico de Hortalizas en Invernadero", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-agronomico-de-hortalizas-en-invernadero.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-agronomico-de-hortalizas-en-invernadero",
      summary: "Controlar el ambiente y el cultivo protegido con datos.",
      tags: { interests: ["protected", "crops", "water"], goals: ["yield", "update", "costs"], profiles: ["producer", "advisor", "student"], problems: ["practice"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 75, free: false }, { n: 2, title: "Clase 2", min: 67, free: false }, { n: 3, title: "Clase 3", min: 106, free: false }, { n: 4, title: "Clase 4", min: 58, free: false }]
    },
    {
      id: "manejo-agronomico-de-la-cebolla", title: "Manejo Agronómico de la Cebolla", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-agronomico-de-la-cebolla.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-agronomico-de-la-cebolla",
      summary: "Planear establecimiento, bulbo, sanidad y curado de cebolla.",
      tags: { interests: ["crops", "soil", "health"], goals: ["yield", "costs"], profiles: ["producer", "advisor"], problems: ["practice"], levels: ["intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 49, free: false }, { n: 2, title: "Clase 2", min: 52, free: false }, { n: 3, title: "Clase 3", min: 43, free: false }, { n: 4, title: "Clase 4", min: 57, free: false }]
    },
    {
      id: "manejo-agronomico-del-cultivo-de-pina", title: "Manejo Agronómico del Cultivo de Piña", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-agronomico-del-cultivo-de-pina.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-agronomico-del-cultivo-de-pina",
      summary: "Organizar el manejo de piña desde material de siembra hasta poscosecha.",
      tags: { interests: ["crops", "soil"], goals: ["yield", "grow"], profiles: ["producer", "business", "advisor"], problems: [], levels: ["intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 92, free: false }, { n: 2, title: "Clase 2", min: 74, free: false }, { n: 3, title: "Clase 3", min: 56, free: false }, { n: 4, title: "Clase 4", min: 83, free: false }, { n: 5, title: "Clase 5", min: 55, free: false }]
    },
    {
      id: "manejo-de-cultivo-de-jitomate-en-invernadero", title: "Manejo de Cultivo de Jitomate en Invernadero", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-de-cultivo-de-jitomate-en-invernadero.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-de-cultivo-de-jitomate-en-invernadero",
      summary: "Tomar decisiones de jitomate protegido desde trasplante hasta corte.",
      tags: { interests: ["protected", "crops", "health"], goals: ["yield", "costs", "update"], profiles: ["producer", "advisor", "student"], problems: ["practice"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 72, free: false }, { n: 2, title: "Clase 2", min: 61, free: false }, { n: 3, title: "Clase 3", min: 86, free: false }, { n: 4, title: "Clase 4", min: 69, free: false }, { n: 5, title: "Clase 5", min: 36, free: false }]
    },
    {
      id: "manejo-de-suelos-sodicos-salinos", title: "Manejo de Suelos Sódicos Salinos", category: "Nutrición y suelos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-de-suelos-sodicos-salinos.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-de-suelos-sodicos-salinos",
      summary: "Distinguir salinidad de sodicidad y diseñar una corrección basada en análisis.",
      tags: { interests: ["soil", "water"], goals: ["yield", "costs", "update"], profiles: ["advisor", "producer", "teacher"], problems: ["trust", "practice"], levels: ["avanzado", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 50, free: false }, { n: 2, title: "Clase 2", min: 55, free: false }, { n: 3, title: "Clase 3", min: 61, free: false }, { n: 4, title: "Clase 4", min: 57, free: false }, { n: 5, title: "Clase 5", min: 51, free: false }]
    },
    {
      id: "manejo-integral-de-frambuesa", title: "Manejo Integral de Frambuesa", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-integral-de-frambuesa.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-integral-de-frambuesa",
      summary: "Conducir frambuesa con atención a cañas, sanidad y fruta delicada.",
      tags: { interests: ["crops", "health", "protected"], goals: ["yield", "grow"], profiles: ["producer", "business"], problems: ["practice"], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 42, free: false }, { n: 2, title: "Clase 2", min: 66, free: false }, { n: 3, title: "Clase 3", min: 71, free: false }, { n: 4, title: "Clase 4", min: 46, free: false }]
    },
    {
      id: "manejo-integral-de-granos-basicos", title: "Manejo Integral de Granos Básicos", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-integral-de-granos-basicos.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-integral-de-granos-basicos",
      summary: "Organizar granos básicos con diagnóstico, manejo integrado y almacenamiento.",
      tags: { interests: ["crops", "soil", "health"], goals: ["yield", "costs", "update"], profiles: ["producer", "student", "advisor"], problems: ["cost", "practice"], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 86, free: false }, { n: 2, title: "Clase 2", min: 78, free: false }, { n: 3, title: "Clase 3", min: 73, free: false }, { n: 4, title: "Clase 4", min: 77, free: false }, { n: 5, title: "Clase 5", min: 68, free: false }]
    },
    {
      id: "manejo-integral-del-cultivo-de-cacao", title: "Manejo Integral del Cultivo de Cacao", category: "Cultivos", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-integral-del-cultivo-de-cacao.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-integral-del-cultivo-de-cacao",
      summary: "Seguir el cacao del vivero a la fermentación y secado de calidad.",
      tags: { interests: ["crops", "agroindustry", "organic"], goals: ["yield", "grow", "certify"], profiles: ["producer", "business", "advisor"], problems: [], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 70, free: false }, { n: 2, title: "Clase 2", min: 65, free: false }, { n: 3, title: "Clase 3", min: 88, free: false }, { n: 4, title: "Clase 4", min: 52, free: false }, { n: 5, title: "Clase 5", min: 76, free: false }, { n: 6, title: "Clase 6", min: 92, free: false }]
    },
    {
      id: "manejo-y-nutricion-de-suculentas", title: "Manejo y Nutrición de Suculentas", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-manejo-y-nutricion-de-suculentas.webp", url: "https://club.agrotecamerican.com/#/curso/manejo-y-nutricion-de-suculentas",
      summary: "Mantener suculentas sanas con luz, sustrato y riego apropiados.",
      tags: { interests: ["ornamental", "soil"], goals: ["grow", "tools", "update"], profiles: ["hobby", "business", "student"], problems: ["time", "signal"], levels: ["basico"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 120, free: false }, { n: 2, title: "Clase 2", min: 120, free: false }, { n: 3, title: "Clase 3", min: 119, free: false }]
    },
    {
      id: "produccion-rentable-de-girasoles-para-corte-y-ornato", title: "Producción Rentable de Girasoles para Corte y Ornato", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-produccion-rentable-de-girasoles-para-corte-y-ornato.webp", url: "https://club.agrotecamerican.com/#/curso/produccion-rentable-de-girasoles-para-corte-y-ornato",
      summary: "Planear girasol ornamental con calidad de tallo y cosecha escalonada.",
      tags: { interests: ["ornamental", "crops", "business"], goals: ["grow", "costs", "yield"], profiles: ["producer", "business", "hobby"], problems: ["cost"], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 60, free: false }, { n: 2, title: "Clase 2", min: 58, free: false }, { n: 3, title: "Clase 3", min: 39, free: false }, { n: 4, title: "Clase 4", min: 90, free: false }]
    },
    {
      id: "produccion-y-manejo-comercial-de-gladiolas", title: "Producción y Manejo Comercial de Gladiolas", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-produccion-y-manejo-comercial-de-gladiolas.webp", url: "https://club.agrotecamerican.com/#/curso/produccion-y-manejo-comercial-de-gladiolas",
      summary: "Producir gladiola de corte desde cormo hasta clasificación comercial.",
      tags: { interests: ["ornamental", "business"], goals: ["grow", "yield"], profiles: ["producer", "business"], problems: [], levels: ["intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 64, free: false }, { n: 2, title: "Clase 2", min: 82, free: false }, { n: 3, title: "Clase 3", min: 66, free: false }, { n: 4, title: "Clase 4", min: 63, free: false }, { n: 5, title: "Clase 5", min: 88, free: false }]
    },
    {
      id: "productos-a-base-de-maices-de-colores", title: "Productos a Base de Maíces de Colores", category: "Agroindustria", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-productos-a-base-de-maices-de-colores.webp", url: "https://club.agrotecamerican.com/#/curso/productos-a-base-de-maices-de-colores",
      summary: "Valorar maíces pigmentados con procesos estables e identidad de origen.",
      tags: { interests: ["agroindustry", "business", "crops"], goals: ["grow", "costs"], profiles: ["business", "producer", "hobby"], problems: ["cost"], levels: ["basico", "intermedio"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 106, free: false }, { n: 2, title: "Clase 2", min: 94, free: false }, { n: 3, title: "Clase 3", min: 91, free: false }, { n: 4, title: "Clase 4", min: 98, free: false }]
    },
    {
      id: "tecnicas-de-reproduccion-y-mejora-genetica-en-suculentas", title: "Técnicas de Reproducción y Mejora Genética en Suculentas", category: "Ornamentales", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-tecnicas-de-reproduccion-y-mejora-genetica-en-suculentas.webp", url: "https://club.agrotecamerican.com/#/curso/tecnicas-de-reproduccion-y-mejora-genetica-en-suculentas",
      summary: "Comparar propagación y selección de suculentas con registros.",
      tags: { interests: ["ornamental"], goals: ["grow", "update", "tools"], profiles: ["hobby", "business", "student", "teacher"], problems: [], levels: ["intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 116, free: false }, { n: 2, title: "Clase 2", min: 115, free: false }, { n: 3, title: "Clase 3", min: 48, free: false }]
    },
    {
      id: "uso-responsable-de-agroquimicos", title: "Uso Responsable de Agroquímicos", category: "Sanidad", level: "Intermedio",
      image: "https://club.agrotecamerican.com/cursos/curso-uso-responsable-de-agroquimicos.webp", url: "https://club.agrotecamerican.com/#/curso/uso-responsable-de-agroquimicos",
      summary: "Decidir si usar un producto y aplicarlo sólo conforme a etiqueta y regulación vigente.",
      tags: { interests: ["health", "organic", "crops"], goals: ["certify", "update", "costs"], profiles: ["advisor", "producer", "student", "teacher"], problems: ["trust"], levels: ["basico", "intermedio", "avanzado"] },
      featuredClass: 1, available: true,
      classes: [{ n: 1, title: "Clase 1", min: 72, free: false }, { n: 2, title: "Clase 2", min: 36, free: false }, { n: 3, title: "Clase 3", min: 79, free: false }, { n: 4, title: "Clase 4", min: 48, free: false }, { n: 5, title: "Clase 5", min: 75, free: false }]
    }
  ]
});

/* Normaliza una configuración remota (Firestore) contra los predeterminados:
   rellena textos faltantes, descarta preguntas/opciones/cursos inválidos. */
(() => {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const DIMENSIONS = ['profile', 'level', 'source', 'goal', 'interests', 'format', 'problem', 'time', 'none'];
  const LAYOUTS = ['cards', 'scale', 'tiles', 'big', 'images', 'list', 'chips'];
  const MOODS = ['greet', 'point', 'think', 'tablet', 'calculator', 'approve', 'surprise', 'celebrate'];
  const LEVELS = ['basico', 'intermedio', 'avanzado'];
  const strList = (value) => (Array.isArray(value) ? value.map(String).filter(Boolean) : []);

  const normalizeConfig = (remote) => {
    const base = clone(window.AGROTEC_ENCUESTA_DEFAULTS);
    if (!remote || typeof remote !== 'object') return base;
    const out = { version: Number(remote.version) || base.version, clubUrl: remote.clubUrl || base.clubUrl, textos: base.textos, preguntas: base.preguntas, cursos: base.cursos };
    if (remote.textos && typeof remote.textos === 'object') {
      out.textos = {};
      Object.keys(base.textos).forEach((key) => { out.textos[key] = { ...base.textos[key], ...(remote.textos[key] || {}) }; });
      if (!Array.isArray(out.textos.intro.stats) || !out.textos.intro.stats.length) out.textos.intro.stats = base.textos.intro.stats;
      if (!Array.isArray(out.textos.analizando.steps) || !out.textos.analizando.steps.length) out.textos.analizando.steps = base.textos.analizando.steps;
    }
    if (Array.isArray(remote.preguntas)) {
      const valid = remote.preguntas.filter((q) => q && q.id && q.title && Array.isArray(q.options) && q.options.length >= 2);
      if (valid.length) out.preguntas = valid.map((q) => ({
        id: String(q.id), dimension: DIMENSIONS.includes(q.dimension) ? q.dimension : 'none', kicker: q.kicker || '', title: q.title, hint: q.hint || '',
        type: q.type === 'multi' ? 'multi' : 'single', max: Math.max(1, Number(q.max) || 3),
        layout: LAYOUTS.includes(q.layout) ? q.layout : 'cards', mood: MOODS.includes(q.mood) ? q.mood : 'point', bubble: q.bubble || '',
        options: q.options.filter((o) => o && o.value && o.title).map((o) => ({
          value: String(o.value), icon: o.icon || '', title: o.title, detail: o.detail || '', image: o.image || '',
          ...(LEVELS.includes(o.level) ? { level: o.level } : {})
        }))
      })).filter((q) => q.options.length >= 2);
    }
    if (Array.isArray(remote.cursos)) {
      out.cursos = remote.cursos.filter((c) => c && c.id && c.title).map((c) => ({
        id: String(c.id), title: c.title, category: c.category || '', level: c.level || '', image: c.image || '', url: c.url || '',
        summary: c.summary || '',
        tags: {
          interests: strList(c.tags?.interests), goals: strList(c.tags?.goals), profiles: strList(c.tags?.profiles),
          problems: strList(c.tags?.problems), levels: strList(c.tags?.levels).filter((l) => LEVELS.includes(l))
        },
        featuredClass: Math.max(1, Number(c.featuredClass) || 1), available: c.available !== false,
        classes: Array.isArray(c.classes) ? c.classes.filter((k) => k && Number(k.n) >= 1).map((k) => ({
          n: Number(k.n), title: k.title || `Clase ${k.n}`, min: Number.isFinite(Number(k.min)) && k.min !== null && k.min !== '' ? Number(k.min) : null, free: k.free === true
        })) : []
      }));
    }
    return out;
  };

  window.AGROTEC_ENCUESTA_UTILS = Object.freeze({ clone, normalizeConfig, DIMENSIONS, LAYOUTS, MOODS, LEVELS });
})();
