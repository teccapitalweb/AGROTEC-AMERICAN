/* ==========================================================================
   AgroTec América · Firebase compartido (encuesta + panel)
   Mismo proyecto que el landing (agroclub-mx). Carga el SDK bajo demanda
   desde gstatic, igual que index.html. Se usa Firestore Lite: más ligero y
   suficiente para leer/escribir documentos (sin tiempo real).
   ========================================================================== */
(() => {
  'use strict';

  const VERSION = '10.11.0';
  const CDN = `https://www.gstatic.com/firebasejs/${VERSION}/`;

  const config = Object.freeze({
    apiKey: 'AIzaSyCa6zt7YD3QUzGxyPky0zPPfjQwhtYMeTw',
    authDomain: 'agroclub-mx.firebaseapp.com',
    projectId: 'agroclub-mx',
    storageBucket: 'agroclub-mx.firebasestorage.app',
    messagingSenderId: '231737548143',
    appId: '1:231737548143:web:6651621c2cbad8a31a9c9a'
  });

  /* Correos con acceso al panel sin necesidad de documento en Firestore.
     Deben coincidir con la lista de las reglas de seguridad (ver admin/README.md). */
  const ADMIN_EMAILS = Object.freeze([
    'teccapitalweb@gmail.com'
  ]);

  const COLLECTIONS = Object.freeze({
    config: 'encuesta_config',      // doc `main`: preguntas, cursos, textos
    responses: 'encuesta_respuestas', // una respuesta anónima por documento
    admins: 'encuesta_admins'       // doc id = correo con acceso al panel
  });

  const modules = {};
  const load = (name) => {
    if (!modules[name]) modules[name] = import(`${CDN}firebase-${name}.js`);
    return modules[name];
  };

  let appPromise = null;
  const getApp = async () => {
    if (!appPromise) {
      appPromise = load('app').then(({ initializeApp, getApps }) => {
        const apps = getApps();
        return apps.length ? apps[0] : initializeApp(config);
      });
    }
    return appPromise;
  };

  const getDb = async () => {
    const [app, lite] = await Promise.all([getApp(), load('firestore-lite')]);
    return { db: lite.getFirestore(app), ...lite };
  };

  const getAuthKit = async () => {
    const [app, auth] = await Promise.all([getApp(), load('auth')]);
    return { auth: auth.getAuth(app), ...auth };
  };

  window.AGROTEC_FIREBASE = Object.freeze({ config, COLLECTIONS, ADMIN_EMAILS, getApp, getDb, getAuthKit });
})();
