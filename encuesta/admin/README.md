# Panel de la encuesta — AgroTec América

URL del panel: `https://agrotecamerican.com/encuesta/admin/`
URL de la encuesta: `https://agrotecamerican.com/encuesta/`

Todo corre en GitHub Pages (estático) + Firebase del proyecto **agroclub-mx**
(el mismo que usa el landing para el login del club). No hay servidor propio.

## Qué hace cada pestaña

| Pestaña | Para qué sirve |
|---|---|
| **Resumen** | Métricas principales (respuestas, hoy, clics en clases, iniciaron curso, tasa de conversión, tiempo promedio), cursos más recomendados, temas que más interesan, qué quieren lograr, qué necesitan resolver y tiempo por semana. En "Más resultados": actividad por día, embudo y el resto de preguntas. Filtro por periodo. |
| **Preguntas** | Lista compacta con interruptor **Activa / Apagada** (una pregunta apagada se conserva con sus datos pero no aparece en la encuesta), **Editar** y menú ⋯ (duplicar, subir, bajar, eliminar). El editor abre debajo de la fila: texto, ayuda, tipo, diseño (tarjetas con ícono, escala, mosaico, botones grandes, tarjetas con imagen, lista, chips), dimensión del perfil, estado y globo del personaje, y opciones (ícono `i:nombre`, imagen, nivel, valor). |
| **Cursos** | Los 23 cursos reales del club con sus clases, en filas con interruptor disponible / oculto, **Editar** y menú ⋯. El editor: etiquetas (temas, objetivos, perfiles, necesidades, niveles), clase destacada, portada, enlace, resumen y clases. |
| **Respuestas** | Tabla Usuario · Fecha · Perfil · Curso recomendado · Estado, con buscador, filtro por fecha y por curso, y CSV. Al tocar una fila se abre el panel lateral con todas las respuestas, la recomendación y la opción de eliminar. |
| **Textos** | Acordeones: bienvenida, durante la encuesta (avance y personaje), pantalla de análisis, resultados, clase recomendada, botones y enlaces. |

## Cómo recomienda

La encuesta tiene 7 preguntas activas (quién es, experiencia, temas, objetivo,
necesidad, tiempo por semana y cómo nos conoció) y una apagada (tipo de contenido)
que se puede encender desde el panel. Cada pregunta aporta a una dimensión del
perfil (`profile`, `level`, `goal`, `interests`, `problem`, `time`, `format`) y cada
curso tiene etiquetas por dimensión. El motor suma puntos por coincidencia:

| Qué compara | Puntos |
|---|---|
| Temas de interés, en el orden en que los eligió | 34 · 26 · 18 (+6 si es el tema principal del curso) |
| Objetivo | 16 |
| Necesidad actual | 14 |
| Perfil | 8 |
| Nivel (según la experiencia) | +6 si coincide · −3 si no |
| Tiempo por semana | +4 / +2 si el curso es corto y tiene poco tiempo · +3 si quiere más de 5 h y el curso es largo |
| Clases gratis | +8 si estudia, recién egresó, aprende por gusto, no sabe por dónde empezar o quiere reducir costos |

Temas + objetivo + necesidad definen casi toda la recomendación; la experiencia
elige el nivel y el tiempo, por dónde empezar. Gana el curso con mayor puntaje
junto con su **clase destacada**, y la tarjeta final explica las 2 o 3
coincidencias que decidieron la recomendación.

Al tocar la clase, la encuesta marca `clickedClass` y abre
`club.agrotecamerican.com/#/curso/{id}/clase/{n}?enc={idRespuesta}`. El club pide
iniciar sesión si hace falta y regresa automáticamente a esa clase.

Los cambios se publican con el botón **Guardar cambios** y la encuesta los toma
en su siguiente carga. Si nunca se ha guardado nada, la encuesta usa los valores
de `encuesta/encuesta-defaults.js` (preguntas, textos y el catálogo del club con
sus etiquetas).

## Datos en Firestore

| Colección | Contenido | Quién lee | Quién escribe |
|---|---|---|---|
| `encuesta_config` → doc `main` | preguntas, cursos, textos, `version`, `updatedAt`, `updatedBy` | público | admins |
| `encuesta_respuestas` → un doc por encuesta | `answers`, `labels`, `profile`, `recommendation` (curso + clase), `clickedClass`, `enteredCourse`, `uid`, `device`, `durationSec`, `createdAt`… | admins | cualquiera puede **crear**; solo se pueden actualizar las banderas de clic/ingreso |
| `encuesta_admins` → doc por correo | admins extra: ID = correo en minúsculas | el propio usuario | solo desde la consola |

Los correos administradores fijos viven en `encuesta/firebase-shared.js`
(`ADMIN_EMAILS`) **y** en las reglas de seguridad; hoy: `teccapitalweb@gmail.com`.
Para sumar a alguien más hay dos caminos: agregar su correo en esos dos lugares,
o crear su documento en `encuesta_admins` desde la consola (sin tocar código).

## Activar el panel (una sola vez)

### 1. Reglas de seguridad (obligatorio)

Firestore Database → *Reglas*. Pegar este bloque **dentro** de
`match /databases/{database}/documents { … }`, sin tocar las reglas que ya
existen para `miembros` y `usuarios_free`:

```
    // ---------- Encuesta de aprendizaje (/encuesta) ----------
    function esAdminEncuesta() {
      return request.auth != null
        && request.auth.token.email != null
        && (
          // Misma lista que ADMIN_EMAILS en encuesta/firebase-shared.js
          request.auth.token.email.lower() in ['teccapitalweb@gmail.com']
          || exists(/databases/$(database)/documents/encuesta_admins/$(request.auth.token.email.lower()))
        );
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
        && request.resource.data.size() <= 20;
      allow read, delete: if esAdminEncuesta();
      // La encuesta marca el clic en la clase (sin sesión); el club marca el
      // ingreso al curso y enlaza la cuenta (con sesión). Nada más se puede tocar.
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['clickedClass', 'clickedAt'])
        || (request.auth != null
            && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['uid', 'email', 'enteredCourse', 'enteredAt', 'clickedClass', 'clickedAt']));
    }
```

### 2. Dar acceso a más correos (opcional)

Sin tocar código: Firestore Database → *Iniciar colección* `encuesta_admins`,
ID del documento = el correo **en minúsculas**, un campo cualquiera
(por ejemplo `rol` = `admin`). Para quitar acceso, borrar el documento.

### 3. Login con Google

Ya está habilitado en el proyecto (lo usa el landing). Solo verificar en
Authentication → *Settings* → *Authorized domains* que esté `agrotecamerican.com`.

## Archivos

```
encuesta/
├── index.html              Encuesta (una pregunta por pantalla)
├── styles.css
├── app.js                  Flujo, recomendación de cursos y guardado en Firestore
├── encuesta-defaults.js    Preguntas, textos, personaje y cursos del club (con etiquetas) + normalizador
├── icons.js                Íconos lucide usados por la encuesta y el panel
├── img/                    Mascota Agro en WebP (dos poses + parpadeo)
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
- Para actualizar el catálogo con un curso nuevo del club: pestaña Cursos →
  *Nuevo curso*, usar el mismo slug que en el club, cargar sus clases y marcar
  sus etiquetas. *Restaurar catálogo del club* vuelve a los 23 cursos del código.
- El panel carga hasta 3,000 respuestas por sesión. Si el volumen crece más,
  conviene exportar y limpiar periódicamente.
