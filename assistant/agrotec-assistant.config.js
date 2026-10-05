window.AGROTEC_ASSISTANT_CONFIG = Object.freeze({
  id: 'agrotec-america',
  brandName: 'AgroTec América',
  assistantName: 'Agro',
  assistantLabel: 'Asistente virtual',
  welcome: 'Hola, soy Agro. Puedo recomendarte una ruta en 7 preguntas o ayudarte a buscar un tema.',
  closedLabel: 'Encuentra tu ruta',
  tone: 'cálido, directo y profesional',
  colors: {
    primary: '#285345',
    primaryDark: '#17382f',
    accent: '#dda72b',
    accentWarm: '#c86e45',
    mint: '#c9dcc6',
    surface: '#fffdf7',
    ink: '#24372f'
  },
  character: {
    src: 'assistant/assets/agro-robot-v6.png',
    blinkSrc: '',
    alt: 'Agro, el robot agricultor de AgroTec América con sombrero y una planta',
    placeholder: 'A'
  },
  catalog: {
    cardSelector: '.ag3-course',
    titleSelector: 'h3',
    metaSelector: '.ag3-course__meta span',
    detailSelector: '.ag3-course__foot > span:first-child',
    linkSelector: 'a[href*="/curso/"]',
    modality: 'En línea y a tu ritmo'
  },
  plans: {
    cardSelector: '.ag3-plan',
    labelSelector: '.ag3-plan__label',
    priceSelector: '.ag3-plan__price',
    descriptionSelector: 'p'
  },
  survey: {
    url: 'encuesta/',
    label: 'Descubrir mi ruta',
    eyebrow: 'Diagnóstico de aprendizaje',
    title: 'Tu siguiente curso, en menos de 2 minutos',
    detail: 'Responde 7 preguntas sencillas y recibe un curso y una primera clase recomendados.'
  },
  humanContact: {
    type: 'whatsapp-link',
    label: 'Abrir WhatsApp',
    url: 'https://wa.me/5212361066811?text=Hola%2C%20vengo%20del%20asistente%20de%20AgroTec%20Am%C3%A9rica%20y%20necesito%20atenci%C3%B3n.',
    disclosure: 'Este botón abre WhatsApp. No transfiere automáticamente la conversación ni confirma que una persona esté conectada.'
  },
  storage: {
    sessionKey: 'agrotec-assistant-v2'
  }
});
