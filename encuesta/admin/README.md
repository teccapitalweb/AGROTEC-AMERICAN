# Panel de la encuesta — AgroTec América

URL del panel: `https://agrotecamerican.com/encuesta/admin/`
URL de la encuesta: `https://agrotecamerican.com/encuesta/`

Todo corre en GitHub Pages (estático) + Firebase del proyecto **agroclub-mx**
(el mismo que usa el landing para el login del club). No hay servidor propio.

## Qué hace cada pestaña

| Pestaña | Para qué sirve |
|---|---|
| **Resumen** | KPIs (respuestas, hoy, % celular, tiempo promedio), respuestas por día, una gráfica por pregunta (dona para opción única, barras para opción múltiple) y los cursos más recomendados. Filtro por periodo: todo / hoy / 7 días / 30 días. |
| **Preguntas** | Editar texto, ayuda, tipo (única / múltiple), diseño (lista / mosaico / chips) y las opciones de cada pregunta. Agregar, ordenar y eliminar preguntas. |
| **Cursos** | Qué cursos pueden recomendarse al final (interruptor *Disponible / Oculto*), con qué áreas de interés se relacionan, imagen, nivel y enlace. |
| **Respuestas** | Tabla con cada encuesta completada (sin datos personales), buscador, exportar CSV y eliminar filas. |
| **Textos** | Pantalla de bienvenida, pantalla final, botones y enlaces (por ejemplo a dónde lleva *Entrar al club*). |

Los cambios se publican con el botón **Guardar cambios** y la encuesta los toma
en su siguiente carga. Si nunca se ha guardado nada, la encuesta usa los valores
de `encuesta/encuesta-defaults.js`.

## Datos en Firestore

| Colección | Contenido | Quién lee | Quién escribe |
|---|---|---|---|
| `encuesta_config` → doc `main` | preguntas, cursos, textos, `version`, `updatedAt`, `updatedBy` | público | admins |
| `encuesta_respuestas` → un doc por encuesta | `answers`, `labels`, `recommended`, `device`, `durationSec`, `createdAt`… | admins | cualquiera puede **crear**, nadie puede editar |
| `encuesta_admins` → doc por correo | ID = correo en minúsculas (`teccapitalweb@gmail.com`) | el propio usuario | solo desde la consola |

## Activar el panel (una sola vez)

### 1. Dar acceso a los correos administradores

Firebase Console → proyecto **agroclub-mx** → Firestore Database → *Iniciar colección*:

- ID de la colección: `encuesta_admins`
- ID del documento: el correo **en minúsculas**, por ejemplo `teccapitalweb@gmail.com`
- Un campo cualquiera, por ejemplo `rol` = `admin`

Repetir un documento por cada persona del equipo que deba entrar al panel.
Para quitar acceso basta con borrar su documento.

### 2. Reglas de seguridad

Firestore Database → *Reglas*. Pegar este bloque **dentro** de
`match /databases/{database}/documents { … }`, sin tocar las reglas que ya
existen para `miembros` y `usuarios_free`:

```
    // ---------- Encuesta de aprendizaje (/encuesta) ----------
    function esAdminEncuesta() {
      return request.auth != null
        && request.auth.token.email != null
        && exists(/databases/$(database)/documents/encuesta_admins/$(request.auth.token.email.lower()));
    }

    match /encuesta_admins/{correo} {
      allow read: if request.auth != null && request.auth.token.email.lower() == correo;
      allow write: if false; // se administra desde la consola
    }

    match /encuesta_config/{doc} {
      allow read: if true;
      allow write: if esAdminEncuesta();
    }

    match /encuesta_respuestas/{id} {
      allow create: if request.resource.data.keys().hasAll(['answers', 'createdAt'])
        && request.resource.data.answers is map
        && request.resource.data.createdAt == request.time
        && request.resource.data.size() <= 14;
      allow read, delete: if esAdminEncuesta();
      allow update: if false;
    }
```

### 3. Login con Google

Ya está habilitado en el proyecto (lo usa el landing). Solo verificar en
Authentication → *Settings* → *Authorized domains* que esté `agrotecamerican.com`.

## Archivos

```
encuesta/
├── index.html              Encuesta (una pregunta por pantalla)
├── styles.css
├── app.js                  Flujo, recomendación de cursos y guardado en Firestore
├── encuesta-defaults.js    Preguntas, cursos y textos por defecto + normalizador
├── firebase-shared.js      Config de Firebase (agroclub-mx) compartida
└── admin/
    ├── index.html          Panel por pestañas
    ├── admin.css
    ├── admin.js
    └── README.md           Este archivo
```

## Notas

- La encuesta recuerda en el navegador (`localStorage`) que ya se contestó y
  muestra directamente la ruta recomendada; *Responder de nuevo* la reinicia.
- Las respuestas guardan el valor interno de cada opción **y** su texto, así
  que cambiar el texto de una opción no rompe los reportes anteriores. Cambiar
  el *valor interno* o el *ID* de una pregunta sí los separa de los datos viejos.
- La recomendación final toma hasta 3 cursos **disponibles** que compartan
  áreas con la pregunta `areas`; si ninguno coincide, muestra los 3 primeros
  disponibles.
- El panel carga hasta 3,000 respuestas por sesión. Si el volumen crece más,
  conviene exportar y limpiar periódicamente.
