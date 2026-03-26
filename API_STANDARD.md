# API_STANDARD.md

## Propósito
Definir reglas de diseño, implementación y documentación del API para mantener consistencia y reducir ambigüedad.

## Stack y base
- Node.js
- Koa
- koa-better-router
- Joi
- Swagger

## Convenciones generales
- Rutas claras y consistentes por recurso
- Payloads validados antes de procesarse
- Respuestas homogéneas
- Manejo consistente de errores
- Separación entre rutas públicas y privadas
- Documentación Swagger actualizada

## Organización
- Las rutas viven en `routes/index.js`
- La lógica de negocio vive en módulos dentro de `src/`
- Cada módulo puede dividirse en:
  - `create.js`
  - `update.js`
  - `delete.js`
  - `get.js`
  - `getAll.js`
- Utilerías comunes en `src/system/`

## Validación
- Toda entrada debe validarse con Joi antes de tocar lógica o base de datos.
- No confiar en validaciones del front end.
- Normalizar mensajes de validación para el usuario.

## Respuestas
Las respuestas deben ser:
- consistentes,
- predecibles,
- fáciles de consumir,
- adecuadas para UI en español México.

### Recomendación
Mantener una forma homogénea para:
- éxito,
- errores de validación,
- errores de negocio,
- errores inesperados.

## Errores
- No exponer stack traces al usuario final.
- Usar códigos HTTP correctos.
- Registrar errores relevantes internamente.
- Convertir errores técnicos a mensajes seguros y útiles.

## Seguridad del API
- validar entrada,
- usar autenticación/autorización según el proyecto,
- proteger rutas sensibles,
- documentar auth scheme,
- usar consultas parametrizadas,
- aplicar headers de seguridad desde la app.

## Swagger
Debe documentarse:
- propósito de la ruta,
- método,
- parámetros,
- body,
- respuestas,
- errores esperados,
- seguridad aplicable.

## Observabilidad
- logging útil,
- health checks cuando aplique,
- trazabilidad básica de requests críticos,
- mensajes internos sin exponer secretos.

## Checklist de calidad del API
- rutas consistentes,
- validación aplicada,
- Swagger actualizado,
- errores consistentes,
- respuestas útiles para el front end,
- seguridad revisada.
