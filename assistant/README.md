# Asistente flotante de AgroTec América

Componente frontend aislado y reutilizable. No modifica autenticación, pagos, membresías ni bases de datos.

## Archivos

- `agrotec-assistant.config.js`: marca, paleta, personaje, selectores de datos y contacto humano.
- `agrotec-assistant.css`: estilos limitados al atributo `data-agx-root` y clases `agx-*`.
- `agrotec-assistant.js`: interfaz, estado de sesión, accesibilidad, lectura del catálogo y respuestas guiadas.
- `assets/agro-robot-v6.png`: robot agricultor verde con sombrero y maceta, sobre fondo transparente.

## Estado actual

- Funciona como prototipo guiado, no como IA conectada.
- Lee cursos y planes directamente de la landing para no duplicar precios ni contenido.
- No solicita ni transmite datos personales.
- El enlace de atención humana abre WhatsApp; no transfiere la conversación.
- Respeta movimiento reducido, pausa manual y pestaña oculta.
- Conserva historial y preferencia de pausa durante la sesión.
- Replica el patrón funcional del asistente de Visión Pecuaria con una identidad visual propia de AgroTec.
- El estado cerrado muestra al personaje en grande y tres mensajes escalonados; no usa una cápsula compacta.
- El chat se abre al tocar directamente la escena del personaje.
- La escena cerrada puede arrastrarse a cualquier zona visible; su posición se guarda localmente en el dispositivo.
- Toda la escena cerrada —personaje, globos y espacios visibles— funciona como superficie de arrastre; un toque breve abre la conversación.
- En el panel abierto, Agro aparece en gran formato y sobresale por encima del encabezado, sin círculo de fondo.
- La mascota del panel abierto sirve como agarradera para mover todo el chatbot y conserva esa posición por separado.
- En móvil, la escena cerrada usa una escala compacta y el chat abierto bloquea el fondo con una capa tenue para conservar el punto de lectura.
- Las flechas del teclado también mueven la escena y la tecla `Inicio` restaura su posición original.
- El robot usa movimientos distintos para reposo, saludo, hover, escucha mientras el usuario escribe, espera y respuesta.
- Las animaciones combinan inclinación, giro, balance, squash-and-stretch y desplazamiento lateral para sentirse como un muñeco de caricatura, no como una simple flotación vertical.
- El pie del panel ofrece acceso al asesor y reinicio de conversación.

## Movimiento del personaje

La versión actual anima una ilustración transparente mediante CSS. En reposo el robot balancea el peso; al pasar el puntero se inclina para saludar; mientras el usuario escribe presta atención; durante la espera procesa con giros laterales; y al responder hace una celebración breve con rebote y recuperación. Los tres mensajes iniciales aparecen de forma secuencial. Además, el lanzador cerrado puede arrastrarse con mouse o gesto táctil sin abrir accidentalmente el chat; el movimiento queda limitado a la ventana.

El movimiento se detiene con el control de pausa, al ocultar la pestaña y cuando el sistema solicita movimiento reducido.

Esto no es todavía animación articulada de brazos, ojos o boca. Para una segunda versión con ese nivel de detalle conviene crear un sprite o un archivo Rive/Lottie diseñado por capas y revisar cada estado antes de sustituir el PNG.

El botón de pausa detiene todos los movimientos y `prefers-reduced-motion` los desactiva automáticamente.

## Sustituir la mascota

Para cambiar el personaje sin tocar la lógica, guarda un PNG transparente en `assistant/assets/` y modifica `character.src` y `character.alt` en la configuración. No se debe sobrescribir el recurso actual: usa un nombre versionado.
