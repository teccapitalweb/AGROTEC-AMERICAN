# Asistente flotante de AgroTec América

Componente frontend aislado y reutilizable. No modifica autenticación, pagos, membresías ni bases de datos.

## Archivos

- `agrotec-assistant.config.js`: marca, paleta, personaje, selectores de datos y contacto humano.
- `agrotec-assistant.css`: estilos limitados al atributo `data-agx-root` y clases `agx-*`.
- `agrotec-assistant.js`: interfaz, estado de sesión, accesibilidad, lectura del catálogo y respuestas guiadas.
- `assets/agro-mascot-orange-clean-v5.png`: personaje con overol naranja y fondo completamente transparente.
- `assets/agro-mascot-orange-blink-v5.png`: segundo fotograma limpio del mismo personaje con los ojos cerrados.

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
- Las flechas del teclado también mueven la escena y la tecla `Inicio` restaura su posición original.
- El personaje tiene parpadeo doble, respiración, saludo, espera y respuesta.
- La ropa naranja mejora el contraste sobre la fotografía verde del campo.
- Los fotogramas no usan halo ni sombra de imagen; el recorte útil evita residuos laterales durante el parpadeo.
- El pie del panel ofrece acceso al asesor y reinicio de conversación.

## Movimiento del personaje

La versión actual alterna dos ilustraciones alineadas —ojos abiertos y ojos cerrados— para crear el parpadeo. El resto del movimiento se crea con CSS: respiración/flotación suave, inclinación al saludar, espera y pulso al responder. Los tres mensajes iniciales aparecen de forma secuencial. Además, el lanzador cerrado puede arrastrarse con mouse o gesto táctil sin abrir accidentalmente el chat; el movimiento queda limitado a la ventana.

La secuencia de ojos y el movimiento corporal se detienen con el control de pausa, al ocultar la pestaña y cuando el sistema solicita movimiento reducido.

Esto no es todavía animación articulada de brazos, ojos o boca. Para una segunda versión con ese nivel de detalle conviene crear un sprite o un archivo Rive/Lottie diseñado por capas y revisar cada estado antes de sustituir el PNG.

El botón de pausa detiene todos los movimientos y `prefers-reduced-motion` los desactiva automáticamente.

## Sustituir la mascota

Para cambiar el personaje sin tocar la lógica, guarda un PNG transparente en `assistant/assets/` y modifica `character.src` y `character.alt` en la configuración. No se debe sobrescribir el recurso actual: usa un nombre versionado.
