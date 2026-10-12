# NBA Raycasting

Videojuego de exploración en pseudo-3D inspirado en Wolfenstein 3D y ambientado en la NBA. Implementa raycasting con DDA, floor casting, paredes texturizadas, sprites con z-buffer y una mecánica de encestar basada en distancia y ángulo, organizada mediante una máquina de estados para menús, niveles y victoria.

## Que resuelve

- Implementa un motor de renderizado pseudo-3D desde cero para una experiencia interactiva.
- Convierte mapas bidimensionales en escenarios explorables mediante raycasting.
- Integra navegación, objetivos, retroalimentación visual y progresión por niveles.
- Coordina gráficos, audio, entrada de usuario y lógica de juego en Rust.

## Tecnologias principales

- Rust, Cargo, raylib, raylib-rs y rand.
- Raycasting DDA y floor casting.
- PNG/JPG para recursos visuales y OGG para música y efectos de sonido.

## Enfoque funcional

- Pantalla de bienvenida con selección entre tres niveles de dificultad progresiva.
- Exploración en primera persona con movimiento, colisiones por eje y rotación mediante teclado o mouse.
- Paredes texturizadas con logos de equipos de la NBA y piso de cancha.
- Sprites de aros con animación de encestada y oclusión mediante z-buffer.
- Mecánica de disparo basada en distancia ideal y ángulo de orientación.
- Minimapa, HUD, contador de FPS, música por nivel y pantalla final con confeti.

## Repo

https://github.com/MarceloDetlefsen/graficas-doom
