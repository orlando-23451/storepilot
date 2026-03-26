# TESTING_STANDARD.md

## Propósito
Definir la estrategia mínima de pruebas para proyectos alineados a este estándar.

## Frameworks obligatorios
- Jest
- Playwright

## Tipos de prueba esperados
### Unit tests
Validan funciones, utilerías, validadores, transformaciones y lógica aislada.

### Integration tests
Validan interacción entre módulos, API, base de datos simulada o capas del sistema.

### End-to-end tests
Validan flujos críticos reales desde la perspectiva del usuario.

### Security tests
Cuando aplique:
- validación de acceso,
- manejo de errores,
- hardening básico,
- protección de rutas.

### Performance tests
Cuando el proyecto lo requiera:
- tiempos de respuesta,
- degradación bajo carga,
- consumo de recursos.

## Cobertura mínima sugerida
Debe existir cobertura al menos sobre:
- validaciones de entrada,
- casos de uso críticos,
- autenticación y autorización cuando aplique,
- borrado lógico,
- errores relevantes,
- rutas principales del API,
- formularios y flujos principales del front end.

## Qué debe probar el front end
- render correcto de páginas clave,
- comportamiento de componentes reutilizables,
- formularios y validaciones,
- flujos de navegación críticos,
- estados de error y confirmación,
- accesibilidad mínima en flujos relevantes,
- compatibilidad móvil en casos críticos de UX.

## Qué debe probar el back end
- validación de payloads,
- reglas de negocio críticas,
- consultas y actualizaciones seguras,
- manejo de errores,
- control de acceso,
- consistencia de respuestas,
- borrado lógico,
- inicialización o utilerías críticas del sistema.

## Pruebas E2E mínimas
Se recomienda cubrir al menos:
- acceso a landing page,
- navegación a la app principal,
- login cuando exista,
- CRUD principal del sistema,
- validaciones de formularios,
- mensajes de error,
- flujos de ayuda o manual si aplican.

## Nomenclatura de pruebas
Usa nombres claros y semánticos en inglés para archivos y descripciones legibles para casos de prueba. Los títulos de comportamiento pueden estar en español o inglés, pero deben ser consistentes.

## Datos de prueba
- Deben existir datos de prueba reproducibles.
- `schema.sql` debe ayudar a poblar información visible.
- Evitar dependencia de datos manuales no documentados.
- Aislar datos de prueba por ambiente cuando aplique.

## Ejecución
El repositorio debe ofrecer scripts claros, por ejemplo:
- `npm test`
- `npm run test`
- `npm run test:e2e`

Si existen paquetes separados, documentar scripts específicos.

## Evidencia esperada
Toda entrega debe poder demostrar:
- qué se probó,
- cómo se ejecuta,
- qué cubre,
- que los flujos críticos pasan.

## Verificación obligatoria antes de cierre

Ningún cambio debe considerarse completo sin evidencia suficiente de que funciona correctamente.

### Reglas obligatorias
- No marcar una tarea como terminada únicamente porque compila o porque el cambio “parece correcto”.
- Validar el resultado con el nivel de evidencia adecuado según el tipo de cambio.
- Cuando aplique, ejecutar:
  - pruebas automatizadas,
  - validaciones manuales reproducibles,
  - revisión de logs,
  - verificación de comportamiento final,
  - y comparación antes/después.

### Evidencia mínima esperada
Según el tipo de cambio, la validación puede incluir:

- **Cambios de lógica o backend**
  - pruebas unitarias o de integración,
  - validación de respuestas,
  - revisión de logs,
  - validación de errores esperados.

- **Cambios de frontend o UX/UI**
  - revisión visual,
  - validación de estados de error, loading y empty state,
  - validación responsive,
  - y pruebas E2E si el flujo es crítico.

- **Corrección de bugs**
  - reproducir el problema si es posible,
  - verificar que ya no ocurra,
  - y validar que la corrección no rompa comportamiento relacionado.

- **Cambios estructurales o transversales**
  - verificar impacto en múltiples módulos,
  - correr pruebas relevantes,
  - y confirmar que no se degradó el comportamiento previo.

### Comparación de comportamiento
Cuando sea relevante, validar explícitamente:
- qué pasaba antes,
- qué pasa ahora,
- y por qué el nuevo comportamiento es el correcto.

### Criterio de cierre
Una tarea puede cerrarse solo cuando:
- existe evidencia razonable de corrección,
- el comportamiento final fue validado,
- no hay fallas obvias sin revisar,
- y la calidad del cambio es consistente con el estándar del repositorio.

## Trazabilidad
Cuando el proyecto tenga especificación formal, traza pruebas contra:
- FR,
- NFR,
- UC,
- reglas de negocio críticas.

## Criterios mínimos antes de liberar
- pruebas unitarias críticas exitosas,
- pruebas de integración críticas exitosas,
- pruebas E2E de flujo principal exitosas,
- validaciones visuales básicas revisadas,
- errores críticos cubiertos.

## Qué no hacer
- no depender solo de pruebas manuales,
- no dejar flujos críticos sin prueba,
- no usar mocks que oculten fallas reales sin documentarlo,
- no asumir que “compila” equivale a “funciona”.

## Definition of Done de pruebas
Una tarea cumple pruebas mínimas si:
- tiene cobertura razonable para el cambio realizado,
- no rompe suites existentes,
- los flujos principales siguen pasando,
- la evidencia de ejecución es reproducible.
