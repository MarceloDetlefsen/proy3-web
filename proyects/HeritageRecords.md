# Heritage Records

Sistema interno para la operacion de una tienda especializada en formatos fisicos de musica, centrado en inventario, ventas, clientes, reportes y control de acceso por roles.

## Que resuelve

- Permite administrar la operacion diaria de una tienda de musica.
- Centraliza catalogo, inventario y registro de ventas.
- Controla el acceso mediante usuarios autenticados y roles en la base de datos.
- Genera reportes para apoyar decisiones operativas.

## Tecnologias principales

- Phoenix Framework 1.8 con LiveView.
- Elixir ~> 1.15.
- PostgreSQL 16.
- `phx.gen.auth` para autenticacion.
- Tailwind CSS v4 + daisyUI.
- Docker y Docker Compose.

## Funcionalidades

- Inicio de sesion y registro de cuentas vinculadas a empleados.
- Gestion de inventario y catalogo de productos.
- Registro y consulta de ventas.
- Gestion de clientes.
- Pantalla de reportes con metricas y agregaciones.
- Exportacion a CSV.
- Gestion de perfil y contrasena del usuario.

## Seguridad y roles

- 5 roles definidos en la base de datos con permisos granulares.
- Acceso diferenciado para gerente, vendedor senior, vendedor, vendedor junior y cajero.
- Proteccion de pantallas segun el rol autenticado.

## Repo

https://github.com/MarceloDetlefsen/proyecto2-db.git