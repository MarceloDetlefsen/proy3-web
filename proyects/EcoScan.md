# EcoScan

Sistema de deteccion y analisis de residuos que usa vision por IA para clasificar basura desde imagenes, guardar registros geograficos y apoyar rutas de recoleccion mas eficientes.

## Que resuelve

- Analiza una foto y estima la composicion del residuo visible.
- Guarda cada analisis con coordenadas para consultas posteriores.
- Agrupa la informacion para dashboards, mapas de calor y rutas optimizadas.
- Permite ver el historial de detecciones desde una interfaz web.

## Tecnologias principales

- Frontend en Next.js 16 con React 19.
- Backend en Express con TypeScript.
- Claude / Anthropic para el analisis de imagenes.
- Prisma con LibSQL o SQLite para persistencia.
- Cloudinary para almacenamiento opcional de imagenes.
- MapLibre GL para visualizacion geoespacial.
- Zod para validacion de datos.

## Funcionalidades

- Subida de imagen para detectar tipos de residuos.
- Clasificacion de categorias como vidrio, plastico, papel, organico, metal y otras adicionales.
- Registro de latitud y longitud de cada deteccion.
- Vista de dashboard con resumen geografico y distribucion de residuos.
- Mapa y rutas para la organizacion de recoleccion.

## Capturas

- `public/proyects/EcoScan1.png`
- `public/proyects/EcoScan2.png`

## Repos

https://github.com/MarceloDetlefsen/frontend-trashclient.git
https://github.com/eldmark/backend-ecoscan.git

## Deploy

https://frontend-trashclient.vercel.app/dashboard