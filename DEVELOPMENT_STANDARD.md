# DEVELOPMENT_STANDARD.md

## Propósito
Este documento concentra únicamente las reglas transversales de desarrollo que aplican a todo el proyecto y que no pertenecen exclusivamente a seguridad, arquitectura, UX/UI, pruebas, API o base de datos.

## Principios rectores
Todo proyecto debe ser:
- mantenible,
- reutilizable,
- seguro por diseño,
- consistente,
- fácil de depurar,
- listo para correr,
- y fácil de entender para futuros mantenedores.

## Criterios generales obligatorios
1. Todo requisito de proyecto debe ser:
   - atómico,
   - no ambiguo,
   - verificable,
   - trazable.
2. Todo texto visible al usuario debe estar en español (México).
3. Todo identificador técnico debe estar en inglés.
4. La solución debe priorizar claridad sobre complejidad innecesaria.
5. No deben quedar comportamientos silenciosos, incompletos o ambiguos.
6. Todo ejemplo de código es referencia, no contrato literal, salvo que `REQUIREMENTS.md` indique lo contrario.
7. El software debe poder ejecutarse con configuración estándar y predecible.
8. Debe contemplarse operación con mocks cuando falten servicios externos.

## Convenciones de lenguaje
### Contenido visible al usuario
Debe estar en español (México), incluyendo:
- labels,
- botones,
- mensajes de error,
- mensajes de validación,
- ayudas,
- tooltips,
- notificaciones,
- textos de soporte.

### Contenido técnico
Debe estar en inglés:
- variables,
- funciones,
- clases,
- endpoints,
- tablas,
- columnas,
- nombres de archivos,
- carpetas,
- módulos,
- componentes,
- utilerías.

## Convenciones de codificación
### Naming
- nombres claros y semánticos,
- evitar abreviaturas crípticas,
- consistencia entre dominio, código y documentación.

### Legibilidad
Priorizar:
- claridad,
- separación de responsabilidades,
- bajo acoplamiento,
- debugging sencillo.

### Comentarios
Agregar comentarios útiles en:
- encabezados de funciones,
- lógica compleja,
- integraciones,
- decisiones no obvias.

### Calidad
- evitar duplicación,
- evitar funciones excesivamente largas,
- mantener formato y linting consistentes,
- preferir componentes y utilerías reutilizables.

## Principios de implementación

Toda implementación debe seguir estos principios:

### Simplicidad primero
- Resolver cada cambio de la forma más simple posible, siempre que mantenga calidad, seguridad y mantenibilidad.
- Evitar complejidad accidental, abstracciones prematuras o patrones innecesarios.

### Impacto mínimo
- Tocar solo lo necesario para resolver el problema.
- Evitar cambios amplios si una solución más acotada logra el mismo resultado con menor riesgo.
- Minimizar el impacto colateral sobre módulos no relacionados.

### Corregir causa raíz
- Priorizar soluciones que resuelvan la causa raíz del problema.
- Evitar parches temporales o arreglos frágiles cuando exista una corrección razonable y estable.
- Si se aplica una mitigación temporal, debe quedar explícitamente documentada como tal.

### Evitar sobreingeniería
- No introducir capas, patrones o complejidad extra si el problema no lo requiere.
- Para cambios simples y obvios, preferir soluciones directas y legibles.
- La elegancia técnica debe estar balanceada con velocidad, claridad y mantenibilidad.

### Exigir calidad en cambios no triviales
- Si una solución se siente improvisada, frágil o poco mantenible, reevaluarla antes de darla por buena.
- En cambios importantes, buscar una solución más limpia, más clara y más consistente con la arquitectura y el estándar del proyecto.

### Mantenibilidad por encima de “ingenio”
- Priorizar código entendible por el equipo.
- Evitar soluciones crípticas aunque sean más cortas.
- El resultado debe ser fácil de mantener, revisar y depurar.

## Dependencias
### Política de dependencias
- usar versiones actuales compatibles y seguras,
- no agregar dependencias innecesarias,
- evitar paquetes sin mantenimiento o de reputación dudosa,
- justificar toda dependencia nueva.

### Dependencias aprobadas con prioridad
- `@azure/arm-appcontainers`
- `@azure/arm-containerinstance`
- `@azure/communication-email`
- `@azure/cosmos`
- `@azure/identity`
- `@azure/storage-blob`
- `@koa/cors`
- `@llamaindex/openai`
- `@llamaindex/pinecone`
- `@llamaindex/readers`
- `aws-sdk`
- `axios`
- `basic-auth`
- `bcryptjs`
- `bluebird`
- `cron`
- `cryptr`
- `dockerode`
- `dotenv`
- `google-libphonenumber`
- `joi`
- `jsonwebtoken`
- `jwt-decode`
- `koa`
- `koa-better-router`
- `koa-body`
- `koa-helmet`
- `koa-jwt`
- `koa-static`
- `koa2-swagger-ui`
- `llamaindex`
- `moment-timezone`
- `mysql`
- `mysql2`
- `node-cron`
- `node-url-shortener`
- `node-webhooks`
- `nodemailer`
- `openai`
- `pdfkit`
- `playwright`
- `promise-mysql`
- `qrcode`
- `save`
- `swagger-jsdoc`
- `swagger-ui-dist`
- `uuid`
- `web-push`
- `ws`
- `yargs`

## Definition of Done global
Un desarrollo cumple el estándar si:
1. corre localmente con instalación estándar,
2. no incluye secretos,
3. respeta stack y arquitectura,
4. usa documentación alineada,
5. mantiene idioma y naming correctos,
6. aplica las reglas del dominio técnico correspondiente,
7. y no rompe los documentos fuente del estándar.

## Release y versionado
### Checklist mínimo de release
Antes de liberar:
- lint exitoso,
- pruebas exitosas,
- variables de entorno verificadas,
- documentación relevante actualizada,
- validación visual y responsiva revisada,
- cambios documentados.

### Versionado
Usar versionado semántico cuando aplique:
- MAJOR
- MINOR
- PATCH

Mantener changelog o historial breve de cambios relevantes.
