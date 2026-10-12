# Plataforma institucional de la Asociación de Estudiantes de Química UVG

Plataforma web para centralizar la información institucional, noticias, recursos académicos, proyectos, eventos y medios de contacto de la Asociación de Estudiantes de Química de la UVG. Utiliza un frontend SSR con Nuxt y Vue, un backend modular REST con Elysia y persistencia relacional mediante Prisma y PostgreSQL.

## Que resuelve

- Centraliza la información institucional y los canales oficiales de comunicación.
- Permite publicar noticias, recursos académicos, proyectos y eventos.
- Facilita la administración de contenido mediante perfiles y permisos diferenciados.
- Reduce la duplicación de información entre canales institucionales.

## Tecnologias principales

- TypeScript, Nuxt 4 y Vue 3.
- Elysia, Prisma ORM y PostgreSQL 16.
- Vitest y Playwright para pruebas unitarias, integración y end-to-end.
- Docker Compose para ejecución reproducible.

## Enfoque funcional

- Sitio público con contenido institucional, junta directiva, noticias y recursos.
- Catálogo de proyectos con búsqueda, filtros, paginación y estados de revisión.
- Gestión de eventos e inscripciones con control de capacidad.
- Panel administrativo con autenticación, sesiones, permisos y protección CSRF.
- API documentada con OpenAPI y rutas versionadas bajo `/api/v1`.

## Repos

https://github.com/alemanuel18/aequvg-frontend

https://github.com/alemanuel18/aequvg-backend
