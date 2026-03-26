# ARCHITECTURE.md

## Propósito
Definir la arquitectura objetivo, el stack obligatorio, la estructura del repositorio, las decisiones técnicas base del sistema y las reglas para documentar decisiones arquitectónicas sin ambigüedad.

## Enfoque arquitectónico
- Front end desacoplado consumiendo API
- Back end en Node.js con Koa
- Persistencia en MySQL
- UI empresarial en React + Semantic UI React
- Documentación del API con Swagger
- CI/CD con GitHub Actions
- Despliegue objetivo en Azure

## Principios de arquitectura
- simplicidad operativa,
- modularidad,
- mantenibilidad,
- seguridad por defecto,
- separación de responsabilidades,
- reutilización,
- observabilidad básica,
- claridad sobre complejidad innecesaria.

## Stack obligatorio
### Front end
- React JS
- React Router
- Semantic UI React
- Semantic UI CSS
- Axios
- compatibilidad con Strada

### Back end
- Node.js
- Koa
- koa-better-router
- Joi
- Swagger

### Base de datos
- MySQL

### Pruebas
- Jest
- Playwright

### Infraestructura
- Azure
- GitHub Actions
- ambientes `dev`, `qa`, `prod`

## Estructura lógica del sistema
### Front end
Responsable de:
- renderizar UI,
- manejar navegación,
- consumir API,
- presentar mensajes al usuario,
- resolver experiencia móvil/web app.

### Back end
Responsable de:
- validar entradas,
- aplicar reglas de negocio,
- gestionar autenticación y autorización,
- consultar y actualizar MySQL,
- exponer API documentada,
- manejar integraciones.

### Base de datos
Responsable de:
- persistir información,
- mantener relaciones,
- ofrecer estructura consistente,
- soportar borrado lógico,
- evitar lógica de negocio incrustada.

## Límites del sistema
### Dentro del sistema
Debe vivir dentro del sistema todo lo relacionado con:
- experiencia de usuario web,
- lógica de negocio del dominio,
- validación de datos,
- persistencia principal,
- autenticación y autorización propias del proyecto,
- auditoría y trazabilidad cuando aplique,
- notificaciones definidas por el proyecto,
- jobs y procesos recurrentes definidos en `REQUIREMENTS.md`.

### Fuera del sistema
Debe tratarse como externo todo lo relacionado con:
- terceros vía API,
- proveedores de identidad externos,
- servicios de correo, mensajería o storage externos,
- pasarelas de pago,
- motores de IA externos,
- sistemas heredados o corporativos conectados por integración.

## Estructura del front end
```text
public/index.html
src/index.js
src/index.css
src/App.js
src/routeNames.js
src/strada.js
src/api.js
src/utils/
src/pages/
src/components/
```

### Reglas
- `pages` coordina lógica general y composición,
- `components` concentra UI reutilizable,
- `api.js` centraliza consumo del backend,
- `routeNames.js` centraliza rutas,
- `utils/` concentra utilerías compartidas.

## Estructura del back end
```text
routes/index.js
src/
src/system/
src/system/index.js
src/system/mysql.js
swagger/
app.js
sql/schema.sql
cert/
```

### Reglas
- módulos por dominio funcional,
- archivos pequeños por operación,
- utilerías transversales en `src/system/`,
- Swagger como fuente de documentación del API,
- arranque del sistema en `app.js`.

## Organización por módulo
Cada módulo debe poder dividirse en:
- `create.js`
- `update.js`
- `delete.js`
- `get.js`
- `getAll.js`

Objetivos:
- archivos pequeños,
- responsabilidad clara,
- debugging más sencillo,
- menor acoplamiento.

## Ambientes
Ambientes mínimos:
- `dev`
- `qa`
- `prod`

### Reglas
- configuración separada por ambiente,
- base de datos separada entre desarrollo, QA y producción,
- credenciales separadas,
- certificados separados cuando aplique,
- variables de entorno documentadas por ambiente.

## Archivos de entorno esperados
- `.env`
- `.env.dev`
- `.env.qa`
- `.env.production`
- `.env.example`

## Estrategia de fallback y mocks
Cuando una integración externa no exista todavía, no esté disponible o no pueda usarse de forma segura en desarrollo:
- usar `MOCK_EXTERNAL_SERVICES`,
- documentar qué integra el mock y qué no,
- evitar que el mock oculte reglas críticas de negocio,
- marcar claramente las respuestas simuladas,
- mantener interfaces compatibles con la integración real esperada.

## Integraciones
Cuando existan sistemas externos:
- documentar endpoints y auth scheme en `REQUIREMENTS.md`,
- encapsular integraciones en módulos claros,
- manejar timeouts y errores,
- permitir mocks con `MOCK_EXTERNAL_SERVICES`,
- definir comportamiento de fallback cuando el tercero falle,
- documentar reintentos o tolerancia a fallos cuando aplique.

## Despliegue
### Objetivo
Desplegar sobre Azure.

### Requisitos
- pipelines GitHub Actions,
- variables de entorno por ambiente,
- configuración reproducible,
- validaciones antes de despliegue,
- hardening básico del servicio.

## Observabilidad
Mínimo esperado:
- logging estructurado,
- health checks,
- errores consistentes,
- trazabilidad básica de fallas,
- separación entre mensajes internos y mensajes al usuario.

## Compatibilidad móvil
- soporte web responsive,
- soporte para anclarse como web app,
- compatibilidad con Strada cuando aplique.

## Decisiones arquitectónicas base
1. React para experiencia de usuario desacoplada.
2. Semantic UI React para consistencia visual empresarial.
3. Koa por simplicidad y control en middleware.
4. Joi para validación explícita.
5. MySQL como base transaccional principal.
6. Swagger para documentación operativa del API.
7. GitHub Actions para automatizar calidad y despliegue.
8. Azure como objetivo de infraestructura.

## ADR lite — Registro de decisiones arquitectónicas
Toda decisión arquitectónica importante debe documentarse con este formato mínimo:

- ID:
- Fecha:
- Tema:
- Contexto:
- Decisión:
- Alternativas consideradas:
- Consecuencias:
- Riesgos:
- Impacto en documentación relacionada:

### Cuándo registrar una decisión
- cambio de stack o librería base,
- cambio de patrón de integración,
- cambio de estrategia de autenticación,
- cambio de persistencia o estructura de datos,
- adopción de websockets, colas, jobs o procesamiento asíncrono relevante,
- decisiones de caching, fallback o tolerancia a fallos,
- cambios estructurales con impacto transversal.

## Trade-offs aceptados
- Se prioriza claridad y mantenibilidad sobre patrones sofisticados innecesarios.
- Se evita sobreingeniería temprana.
- Se prefiere modularidad simple sobre abstracciones profundas sin beneficio real.
- Se privilegia seguridad y operabilidad sobre rapidez improvisada.
