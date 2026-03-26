# ERROR_HANDLING_STANDARD.md

## Propósito
Definir un estándar consistente para manejo de errores, advertencias, validaciones y mensajes operativos en front end, back end y logs internos.

## Objetivos
- evitar mensajes ambiguos,
- mantener consistencia entre módulos,
- separar claramente mensaje técnico de mensaje para usuario,
- mejorar soporte y debugging,
- reducir decisiones improvisadas en manejo de fallos.

## Principios
- claridad para el usuario,
- trazabilidad interna,
- seguridad por defecto,
- consistencia visual y semántica,
- mínima exposición de detalles técnicos.

## Capas de error
### Error de validación
Se produce cuando la entrada del usuario no cumple formato, obligatoriedad o reglas simples.

### Error de negocio
Se produce cuando la solicitud es válida sintácticamente pero viola reglas del dominio.

### Error de autorización
Se produce cuando el usuario no puede ejecutar una acción o consultar un recurso.

### Error técnico
Se produce por fallas internas, integraciones, red, base de datos o infraestructura.

### Warning o advertencia
Se usa cuando la operación puede continuar, pero el usuario debe tomar una decisión o entender una limitación.

## Reglas para mensajes al usuario
- Siempre en español (México).
- Breves, claros y accionables.
- No incluir stack traces, nombres internos de clases, queries ni detalles sensibles.
- Cuando sea posible, indicar cómo corregir el problema.
- No culpar al usuario ni usar lenguaje hostil.

## Reglas para logs internos
- Pueden usar mayor detalle técnico.
- No exponer secretos, tokens, contraseñas ni PII innecesaria.
- Deben permitir rastrear:
  - módulo,
  - operación,
  - tipo de error,
  - contexto mínimo,
  - severidad,
  - correlación si existe request id o equivalente.

## Estructura mínima recomendada para errores del API
Cuando aplique, mantener una respuesta consistente como:

```json
{
  "success": false,
  "error_code": "RESOURCE_NOT_FOUND",
  "message": "No fue posible encontrar la información solicitada.",
  "details": [],
  "trace_id": ""
}
```

### Campos
- `success`: booleano
- `error_code`: identificador técnico estable
- `message`: mensaje seguro para usuario o consumidor
- `details`: lista opcional de errores de validación o contexto útil controlado
- `trace_id`: correlación opcional para soporte

## Catálogo base de tipos de error
### Validación
- `VALIDATION_ERROR`
- `MISSING_REQUIRED_FIELD`
- `INVALID_FORMAT`
- `INVALID_VALUE_RANGE`

### Autenticación y autorización
- `AUTHENTICATION_REQUIRED`
- `INVALID_SESSION`
- `ACCESS_DENIED`

### Recurso
- `RESOURCE_NOT_FOUND`
- `RESOURCE_ALREADY_EXISTS`
- `RESOURCE_INACTIVE`

### Negocio
- `BUSINESS_RULE_VIOLATION`
- `INVALID_STATE_TRANSITION`
- `DEPENDENCY_CONFLICT`

### Técnico
- `INTERNAL_SERVER_ERROR`
- `DATABASE_ERROR`
- `EXTERNAL_SERVICE_ERROR`
- `TIMEOUT_ERROR`
- `UNEXPECTED_ERROR`

## Reglas por tipo de error
### Validación
- Debe señalar claramente el campo o condición.
- Debe permitir corrección inmediata.
- Puede incluir varios `details` si hay múltiples errores.

### Negocio
- Debe explicar por qué no se puede ejecutar la acción.
- Debe evitar tecnicismos internos.
- Debe ser consistente con `REQUIREMENTS.md` y reglas de negocio.

### Autorización
- No revelar más información de la necesaria.
- No indicar detalles sensibles sobre permisos internos.
- Diferenciar entre “no autenticado” y “sin permisos”.

### Técnico
- Mensaje seguro y genérico hacia el usuario.
- Detalle técnico solo en logs.
- Si el error es recuperable, indicar la acción recomendada.

## Manejo visual en front end
### Errores de formulario
- Mostrar cerca del campo o del grupo relevante.
- Usar lenguaje claro.
- Mantener consistencia entre páginas.

### Errores globales
- Usar notificación, dimmer o patrón consistente.
- Evitar múltiples modales anidados.
- En errores recuperables, ofrecer siguiente acción clara.

### Warnings
- Usar confirmación o aviso visible antes de acciones sensibles.
- No abusar de warnings por eventos normales del flujo.

## Estados vacíos y errores
No confundir:
- estado vacío,
- error temporal,
- falta de permisos,
- falta de configuración.

Cada uno debe tener mensaje diferente.

## Severidad recomendada
- `info`
- `warning`
- `error`
- `critical`

La severidad debe ayudar a decidir:
- logging,
- alerta operativa,
- bloqueo funcional,
- respuesta al usuario.

## Mapeo sugerido HTTP
- `400` validación o solicitud inválida
- `401` autenticación requerida o sesión inválida
- `403` acceso denegado
- `404` recurso inexistente
- `409` conflicto de negocio o duplicado
- `422` validación semántica compleja si el proyecto lo justifica
- `500` error interno
- `502/503/504` problemas de dependencia o disponibilidad, cuando aplique

## Reglas para integraciones externas
- No propagar directamente al usuario mensajes crudos del tercero.
- Traducir el error a un mensaje controlado.
- Mantener el error original solo en logs o trazabilidad interna.
- Definir fallback cuando el tercero falle si el proceso lo permite.

## Checklist mínimo de manejo de errores
- existe catálogo básico de `error_code`,
- mensajes al usuario están en español México,
- validaciones son accionables,
- errores técnicos no exponen internals,
- logs permiten diagnóstico,
- errores visuales son consistentes,
- warnings y confirmaciones están diferenciados.
