# StorePilot SaaS

MVP SaaS multi-tenant para tiendas físicas con foco en:

- autenticación y control por rol,
- catálogo de productos,
- compras a proveedores,
- inventario y movimientos,
- registro de ventas,
- visibilidad de costos,
- sugerencias básicas de precio,
- reportes operativos,
- ayuda/manual por módulo.

## Suposiciones explícitas tomadas

Se eligieron estas opciones por ser las más conservadoras y alineadas al estándar cuando la documentación dejó decisiones abiertas:

- una sola sucursal por tenant en el MVP,
- margen objetivo único por tienda,
- costo de referencia basado en costo promedio ponderado,
- reportes mínimos: ventas, compras, inventario y margen estimado.

## Estructura

El repositorio se organizó como workspace:

- `frontend/` React + React Router + Semantic UI React
- `backend/` Node.js + Koa + MySQL

La aclaración de esta estructura está documentada en [ADR-001](docs/adr/ADR-001-repository-structure.md).

## Variables de entorno

Archivos incluidos con placeholders seguros:

- `.env.example`
- `.env.dev`
- `.env.qa`
- `.env.production`

## Datos semilla

El esquema principal vive en [backend/sql/schema.sql](backend/sql/schema.sql).

Credenciales demo:

- Administrador: `admin@storepilot.local` / `Admin123!`
- Cajero: `cajero@storepilot.local` / `Cashier123!`

## Scripts principales

Desde la raíz:

- `npm.cmd install`
- `npm.cmd --workspace backend test`
- `npm.cmd --workspace frontend run build`
- `npm.cmd run test:e2e`

## Estado de validación

- Backend: Jest pasando.
- Frontend: build de producción pasando.
- Playwright: la suite quedó preparada, pero su ejecución se dejó fuera por decisión del usuario en esta conversación.
