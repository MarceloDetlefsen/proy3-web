# Chrono Trigger Campfire - Diorama Raytracer

Raytracer CPU interactivo desarrollado desde cero en Rust para renderizar un diorama voxel inspirado en el campamento nocturno de Chrono Trigger. Implementa trazado de rayos paralelizado, aceleración espacial mediante Voxel Grid con DDA 3D, terreno procedural, materiales con reflexión y refracción, iluminación dinámica y cámara orbital.

## Que resuelve

- Renderiza una escena 3D compleja mediante un motor de ray tracing implementado desde cero.
- Reduce el costo de las intersecciones mediante un Voxel Grid y recorrido DDA 3D.
- Genera terrenos, texturas, cielo estrellado y elementos visuales de forma procedural.
- Mantiene interacción fluida mediante paralelismo con Rayon y resolución adaptativa durante el movimiento.

## Tecnologias principales

- Rust, Raylib, Rayon y Noise.
- Ray tracing CPU, Voxel Grid 3D y algoritmo DDA Amanatides-Woo.
- OpenSimplex FBM, materiales Fresnel de Schlick y refracción de Snell.
- Billboard sprites para personajes, humo y partículas.

## Enfoque funcional

- Diorama voxel interactivo con campamento, fogata, vegetación, arroyo, portal y personajes.
- Cámara orbital con zoom, navegación libre, presets de encuadre y auto-órbita de 360 grados.
- Reflexiones Fresnel en el agua, refracción contextual, sombras directas y skybox estrellado.
- Modos automatizados para validar el layout, generar capturas y exportar frames de órbita.

## Repo

https://github.com/MarceloDetlefsen/proy2-graficas
