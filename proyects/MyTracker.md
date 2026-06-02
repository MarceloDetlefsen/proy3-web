# Series Tracker

Aplicacion web para llevar control de series, su progreso de episodios y valoraciones. El proyecto separa un frontend estatico y un backend REST, con una experiencia pensada para explorar, editar y calificar contenido de forma rapida.

## Que resuelve

- Permite registrar y administrar series.
- Lleva control de episodio actual y avance.
- Incluye sistema de ratings con comentarios y promedio historico.
- Ofrece busqueda, filtros y paginacion para navegar mejor el catalogo.

## Tecnologias principales

- Frontend con HTML, CSS y JavaScript vanilla.
- Backend en Go.
- SQLite como base de datos.
- `net/http` para la API.
- CORS configurado para integracion entre cliente y servidor.

## Enfoque funcional

- Arquitectura simple sin frameworks en el backend.
- Contratos REST claros para operaciones CRUD.
- Interfaz ligera orientada a productividad y seguimiento personal.
- Persistencia local automatica con base de datos creada al iniciar el servidor.

## Repos

https://github.com/MarceloDetlefsen/frontend-proyecto1-web.git
https://github.com/MarceloDetlefsen/backend-proyecto1-web.git

# Deploy

https://frontend-proyecto1-web.vercel.app/index.html