# UX_UI_GUIDELINES.md

## Propósito
Definir el estándar visual, de navegación, composición, responsividad y experiencia de usuario para todos los proyectos del repositorio.

Este documento existe para asegurar que el front end:
- sea visualmente impecable,
- mantenga consistencia entre pantallas,
- sea altamente legible,
- resista textos largos y cambios de idioma,
- evite desbordes, encimados y layouts frágiles,
- y pueda construirse con alta mantenibilidad usando preferentemente **Semantic UI React**.

## Principios rectores de diseño

La interfaz debe ser:
- moderna,
- minimalista,
- elegante,
- sobria,
- consistente,
- fácil de navegar,
- usable por personas mayores o con baja familiaridad tecnológica,
- suficientemente clara para operar sin capacitación formal,
- y visualmente robusta incluso cuando cambie la longitud del contenido.

### Principios obligatorios
1. **Claridad antes que densidad**
   - Es preferible una pantalla respirable a una pantalla “eficiente” pero saturada.
   - No meter demasiada información o controles en una sola vista si afecta comprensión o mantenimiento.

2. **Semantic-first**
   - La UI debe construirse primero con componentes nativos de **Semantic UI React**.
   - Antes de usar `<div>`, CSS adicional o `style` inline, debe revisarse si existe un componente o patrón equivalente en Semantic UI React.

3. **Composición antes que styling manual**
   - Resolver layout con `Grid`, `Segment`, `Container`, `Header`, `Form`, `Message`, `Table`, `List`, `Card`, `Modal`, `Popup`, `Sidebar`, `Menu`, `Divider`, `Accordion` y componentes afines.
   - Evitar construir layout visual con `<div>` genéricos y márgenes manuales si Semantic UI React ya resuelve el caso.

4. **Resistencia al contenido real**
   - El diseño debe soportar textos largos, traducciones, mensajes de error, labels extensos, nombres de módulos, valores dinámicos y menús con crecimiento gradual sin romperse.

5. **Consistencia por sistema, no por pantalla**
   - El usuario debe sentir que todas las pantallas pertenecen al mismo producto.
   - Cambios visuales arbitrarios entre módulos no están permitidos.

## Fuente principal de componentes visuales

### Librería obligatoria
- Usar **Semantic UI React** como base principal de componentes visuales.
- Minimizar CSS personalizado cuando Semantic UI React pueda resolver la necesidad.
- No mezclar librerías visuales sin justificación documentada.

### Regla operativa
La documentación oficial de Semantic UI React debe considerarse la fuente principal para:
- selección de componentes,
- composición visual,
- shorthand props,
- layout,
- navegación,
- y patrones de interacción.

### Orden obligatorio de implementación visual
1. Resolver con componentes nativos de Semantic UI React.
2. Resolver con composición de componentes de Semantic UI React.
3. Solo como último recurso usar CSS personalizado o `style` inline.

### Restricciones obligatorias
- Evitar el uso innecesario de `<div>` cuando exista un componente equivalente.
- Evitar el uso innecesario de `style={{ marginTop: ... }}`, `style={{ padding: ... }}`, `style={{ width: ... }}`, `style={{ height: ... }}` o `display` manual para resolver layout común.
- Evitar encabezados HTML sueltos como `h1`, `h2`, `h3` si el caso puede resolverse mejor con `<Header />`.
- Evitar wrappers de presentación vacíos sin responsabilidad clara.
- Evitar hacks visuales repetitivos para spacing o scroll cuando el problema pueda resolverse mejorando composición, layout o contención.

## Identidad visual

### Color primario
- Azul corporativo
- RGB: `0, 84, 159`
- Hex: `#00549F`

### Uso del color primario
- botones principales,
- headers,
- CTAs,
- elementos destacados,
- realce de estados o acciones importantes.

### Colores base
- Fondo predominante: blanco o gris muy claro
- Texto: negro o gris muy oscuro
- Mantener contraste suficiente
- Evitar saturación visual

### Reglas de uso de color
- No abusar del color primario en todos los elementos.
- Usar el color primario para guiar la atención, no para saturar la interfaz.
- Los estados de error, warning, success e información deben distinguirse claramente.
- Mantener contraste suficiente en botones, mensajes, tablas, cards y formularios.

## Tipografía

La tipografía debe ser:
- legible,
- consistente,
- sobria,
- adecuada para lectura prolongada,
- robusta para distintos tamaños de pantalla.

### Base recomendada para `src/index.css`
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafc;
  touch-action: pan-x pan-y;
}
```

### Reglas tipográficas
- Priorizar `<Header />` para encabezados visuales.
- Mantener jerarquía clara entre:
  - título de página,
  - subtítulo o descripción,
  - título de bloque,
  - texto auxiliar.
- Evitar mezclar demasiados tamaños tipográficos en una misma vista.
- No depender de `font-size` manuales en línea salvo casos excepcionales documentados.
- Los títulos del menú y bloques de navegación también deben usar componentes o patrones visuales consistentes, evitando `h3` crudos si un `Header` o `Menu.Header` resuelve mejor la intención.

## Responsividad y móvil

### Reglas obligatorias
- El sitio debe ser 100% responsivo.
- Debe funcionar correctamente en desktop, tablet y móvil.
- Debe estar listo para anclarse como web app en iOS y Android.
- Debe contemplar compatibilidad con Strada para uso como app nativa contenedorizada.

### Metadatos mínimos de `public/index.html`
Debe contemplar metatags equivalentes a:
```html
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="application-name" content="[project name]" />
<meta name="application-tooltip" content="[project name]" />
<meta name="apple-mobile-web-app-title" content="[project name]" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<meta name="theme-color" content="[color primario definido en UX_UI_GUIDELINES.md]" />
<meta name="msapplication-TileColor" content="[color primario definido en UX_UI_GUIDELINES.md]" />
<meta name="description" content="[project slogan]" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/android-chrome-192x192.png" />
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="format-detection" content="telephone=yes">
<link rel="apple-touch-icon-precomposed" href="%PUBLIC_URL%/icon.png" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/icon.png" />
```

## Layout estándar

Toda aplicación debe incluir:
- header superior,
- footer,
- menú lateral izquierdo,
- área central de contenido.

### Lineamientos
- Header con menú anclado arriba.
- Sidebar tipo `Sidebar.Pushable`.
- Menú consistente entre módulos.
- Jerarquía de navegación clara.
- El usuario siempre debe entender dónde está y cómo volver.

### Reglas de contención visual
- El contenido principal debe vivir dentro de una estructura central claramente contenida.
- En desktop, se recomienda dejar columnas laterales de respiración cuando el layout lo permita.
- En mobile y tablet, el contenido debe ocupar el ancho útil sin generar salida lateral.
- En desktop, el contenido principal debe sentirse centrado y contenido, no flotando ni expandiéndose sin control.

## Menú lateral y navegación principal

La navegación principal del sistema debe sentirse:
- elegante,
- clara,
- estable,
- predecible,
- y coherente con una aplicación empresarial de alto nivel.

### Objetivo del menú
El menú no solo debe permitir navegar; también debe:
- comunicar estructura,
- agrupar correctamente los módulos,
- reducir fricción cognitiva,
- y mantener una apariencia limpia, profesional y fácil de entender.

### Reglas obligatorias
- El sistema debe tener un menú superior simple para acciones globales y activación del sidebar.
- La navegación principal debe vivir preferentemente en un sidebar izquierdo.
- El sidebar debe construirse con componentes de **Semantic UI React**, preferentemente:
  - `Menu`
  - `Menu.Item`
  - `Menu.Header`
  - `Sidebar`
  - `Accordion`
  - `Accordion.Title`
  - `Accordion.Content`
  - `Icon`
  - `Image`
  - `Popup`
- Evitar construir navegación lateral con listas HTML o `<div>` genéricos si Semantic UI React ya resuelve el patrón.

### Jerarquía del menú
El menú debe mantener una jerarquía clara:
1. encabezado de contexto o tipo de usuario,
2. accesos principales de primer nivel,
3. grupos funcionales colapsables cuando exista más de una opción relacionada,
4. subopciones con icono y label claros.

### Reglas de agrupación
- Agrupar opciones relacionadas bajo un mismo bloque de `Accordion` cuando el módulo tenga varias pantallas o acciones.
- No crear agrupaciones innecesarias para una sola opción.
- Evitar más de un nivel profundo de navegación lateral.
- Si un grupo crece demasiado, reorganizarlo antes de seguir metiendo opciones.

### Reglas visuales del menú
- Cada opción debe tener un ícono claro y semántico.
- Los títulos de grupos deben tener peso visual suficiente para distinguirse de las opciones hijas.
- Las opciones deben mantener separación visual suficiente.
- La navegación no debe verse saturada ni improvisada.
- El usuario debe poder identificar rápidamente:
  - dónde está,
  - qué sección está abierta,
  - y qué acciones puede ejecutar.

### Reglas de interacción
- El `Accordion` debe abrir y cerrar grupos de forma clara y predecible.
- El ícono de expansión debe comunicar claramente el estado del grupo.
- El click target de las opciones debe ser suficientemente amplio.
- En mobile, el menú debe seguir siendo navegable sin sentirse comprimido.

### Reglas de naming visual
- Los nombres de los grupos y opciones deben ser breves, claros y accionables.
- Evitar títulos largos que saturen la navegación.
- Si una opción requiere demasiado texto para explicarse, probablemente está mal nombrada o mal ubicada.

### Reglas de consistencia
- Todos los menús del sistema deben seguir la misma estructura visual.
- No mezclar distintos estilos de navegación entre módulos sin una razón documentada.
- Los íconos deben seguir una lógica consistente entre secciones.

## LayoutComponent obligatorio

Toda aplicación debe contar con un componente padre de layout, por ejemplo `LayoutComponent`, responsable de:
- header superior,
- sidebar izquierdo,
- footer,
- contenedor central,
- y consistencia general entre pantallas.

### Reglas obligatorias
- Las páginas principales deben renderizarse dentro de `LayoutComponent`.
- `LayoutComponent` debe usar `Grid` como base principal de layout responsivo.
- El contenido debe organizarse con `Grid`, `Grid.Row` y `Grid.Column`, definiendo explícitamente comportamiento para:
  - `computer`
  - `tablet`
  - `mobile`

### Intención de layout
El layout debe poder expresar patrones como:
- `computer={12}`
- `tablet={16}`
- `mobile={16}`

### Reglas de composición con Grid
Semantic UI React trabaja sobre una grilla de 16 columnas.

#### Regla preferente
Cuando se usen anchos explícitos por breakpoint en `Grid.Column`, la composición de cada fila debe planearse sobre esa grilla de 16 columnas.

#### Implicaciones
- `computer={16}` significa ancho completo en desktop.
- `tablet={16}` significa ancho completo en tablet.
- `mobile={16}` significa ancho completo en mobile.
- `computer={12}` implica que en esa misma fila puede existir otra columna visible que complete razonablemente el espacio restante, por ejemplo `4`.

#### Regla operativa
- En filas con columnas de ancho explícito, la suma de columnas visibles por breakpoint debe ser coherente con la grilla de 16.
- Evitar combinaciones improvisadas que generen layouts frágiles, huecos visuales extraños o comportamiento inconsistente entre breakpoints.
- Si el layout no requiere anchos explícitos, preferir patrones nativos como:
  - `stackable`
  - `doubling`
  - `equal width`

#### Objetivo
Lograr layouts responsivos predecibles, mantenibles y visualmente sólidos, evitando compresión, colisiones o distribución accidental del contenido.

### Reglas específicas
- Todo layout principal debe tener estructura clara de navegación y contenido.
- El contenido no debe quedar pegado a los bordes.
- Las páginas deben respirar visualmente.
- El contenido debe poder crecer sin colisionar con header, sidebar o footer.
- Evitar layouts hechos “a ojo” con márgenes inline.
- En desktop, el contenido principal debe vivir preferentemente dentro de `Segment` o contenedores visuales equivalentes para dar estructura, jerarquía y contención.
- En mobile, la composición puede simplificarse, pero no debe degradar claridad ni provocar scroll horizontal global.

## Estructura visual por páginas

### Reglas generales
- Todas las páginas deben seguir el mismo lenguaje visual.
- Las páginas deben verse parte del mismo sistema.
- Deben reutilizarse patrones para:
  - títulos,
  - filtros,
  - formularios,
  - listas,
  - tablas,
  - modales,
  - confirmaciones,
  - notificaciones.

### Convención visual por pantalla
Cada pantalla debería expresar, cuando aplique, este orden:
1. título,
2. descripción breve,
3. acciones primarias,
4. filtros o búsqueda,
5. contenido principal,
6. ayuda contextual o mensajes secundarios.

### Límite de densidad visual
- Si una pantalla requiere demasiados controles, filtros, KPIs, botones o bloques de información para mantenerse clara, debe dividirse en:
  - secciones,
  - tabs,
  - accordions,
  - pasos,
  - vistas secundarias,
  - o módulos independientes.
- No sacrificar claridad por intentar resolver demasiadas necesidades en una sola pantalla.

## Jerarquía obligatoria de componentes

Al implementar UI, usar preferentemente esta jerarquía:

### Encabezados y títulos
- usar `Header`
- evitar `h1`, `h2`, `h3` sueltos salvo casos excepcionales documentados

### Contenedores visuales
- usar `Segment`, `Container`, `Card`, `Message`, `Form`, `Table`, `List`
- evitar `<div>` genéricos cuando un componente de Semantic UI React resuelva mejor la intención visual

### Layout y distribución
- usar `Grid`, `Grid.Row`, `Grid.Column`
- evitar resolver layout con `<div>` + `style` manual salvo necesidad excepcional

### Espaciado
- preferir `padded`, `relaxed`, `stackable`, `fluid`, `fitted`, `basic`, `attached`, `Divider`
- evitar `marginTop`, `padding`, `display`, `width` y `height` inline como solución por defecto

### Estados y feedback
- usar `Message`, `Loader`, `Dimmer`, `Placeholder`, `Popup`, `Confirm`, `Modal`
- mantener consistencia entre módulos

### Preferencias de props responsivas en Semantic UI React
- Priorizar el uso de props nativas como `fluid`, `stackable`, `doubling`, `relaxed`, `padded`, `wrapped` o patrones equivalentes cuando ayuden a mantener estabilidad visual.
- En formularios, preferir `Form.Group` y anchos coherentes antes que distribuir campos manualmente con `<div>`.
- En tablas, listas y grids, preferir composición responsiva nativa antes que correcciones con CSS manual.

## Patrón recomendado para menús con Accordion

Cuando el sistema tenga múltiples módulos o secciones relacionadas, el patrón recomendado del menú lateral es:
- `Menu.Item` como contenedor base,
- `Accordion` para agrupar,
- `Accordion.Title` para el encabezado del grupo,
- `Accordion.Content` para las opciones hijas,
- `Menu.Item` con `Icon` para cada opción navegable.

### Reglas obligatorias
- El título del grupo debe actuar como encabezado visual, no como opción ambigua.
- Cada opción hija debe ser claramente clickeable y visualmente distinguible.
- Las opciones hijas deben mantener indentación, orden y jerarquía visual consistentes.
- El menú debe soportar crecimiento sin perder legibilidad.

### Buenas prácticas del patrón
- Usar un ícono de expansión (`dropdown`) en los grupos.
- Usar un ícono semántico por cada opción hija.
- Usar títulos de grupo en negrita o con peso visual distinguible.
- Mantener una sola convención de accordion para todo el producto.
- Evitar mezclar unas secciones con `Accordion` y otras con estructuras manuales no equivalentes.

### Qué evitar
- Menús planos con demasiadas opciones al mismo nivel.
- Agrupaciones sin lógica funcional.
- Títulos de grupo que parezcan links individuales.
- Navegaciones donde no se entienda qué pertenece a qué grupo.
- Menús demasiado densos o con demasiadas subopciones visibles al mismo tiempo.

## Componentes recomendados

Deben existir equivalentes reutilizables para:
- `LayoutComponent`
- `ConfirmComponent`
- `HeaderPageComponent`
- `LoadingComponent`
- `NotificationComponent`
- `ListComponent`

### Reglas
- Los nombres pueden variar, pero la responsabilidad funcional debe existir.
- Los componentes deben ser configurables, reusables y coherentes.
- Las páginas no deben replicar UI compleja repetida.
- Todo componente reutilizable debe ser suficientemente flexible para soportar:
  - distintos textos,
  - distintos tamaños de contenido,
  - distintos estados,
  - y cambios de idioma.

## Patrones de tablas y listas

### Tablas
- encabezados claros,
- alineación consistente,
- acciones agrupadas y predecibles,
- estados vacíos explícitos,
- soporte para scroll o adaptación móvil si la densidad lo requiere.

### Listas
- búsqueda clara,
- filtros visibles,
- acciones primarias identificables,
- confirmación previa para acciones destructivas,
- notas o ayudas cuando el flujo lo requiera.

### Reglas adicionales
- No meter demasiadas columnas si rompe legibilidad.
- Las acciones por fila deben ser fáciles de identificar.
- Si la tabla es muy amplia, debe existir estrategia móvil explícita.
- La tabla no debe depender de textos cortos para mantenerse usable.

## Búsqueda, filtros y paginación

- La búsqueda debe indicar claramente qué campo o conjunto de datos afecta.
- Los filtros deben ser visibles, reversibles y fáciles de limpiar.
- La paginación debe aparecer cuando la cantidad de datos lo amerite.
- Si se usa carga incremental o infinite scroll, debe documentarse y mantenerse consistente.
- No mezclar múltiples patrones de paginación dentro del mismo módulo sin justificación.

### Reglas de composición
- No saturar una sola fila con demasiados filtros o botones.
- Si la barra de filtros crece, debe romperse correctamente a nuevas filas.
- Los filtros y acciones deben conservar suficiente aire visual.

## Reglas anti-desborde, aire visual y resiliencia de contenido

La interfaz debe diseñarse para soportar variaciones reales de contenido sin romper layout.

### Reglas obligatorias
- No asumir longitudes fijas de texto.
- Evitar anchos o altos rígidos cuando el contenido pueda crecer.
- Permitir crecimiento vertical natural de:
  - botones,
  - labels,
  - headers,
  - mensajes,
  - cards,
  - filas de formularios,
  - tablas,
  - modales.

- Evitar que textos largos queden:
  - fuera del botón,
  - fuera del contenedor,
  - encimados con otros elementos,
  - truncados sin justificación,
  - o comprimidos al punto de perder legibilidad.

### Restricción sobre dimensiones rígidas
- Evitar alturas fijas en botones, cards, rows, headers, tabs, modales y contenedores con contenido variable.
- Evitar anchos rígidos cuando el componente contenga texto dinámico, mensajes, labels o traducciones.
- Si una dimensión fija es estrictamente necesaria, debe justificarse y probarse con contenido largo en español e inglés.

### Aire visual
- Mantener separación suficiente entre:
  - títulos,
  - descripciones,
  - filtros,
  - formularios,
  - botones,
  - tablas,
  - listas,
  - mensajes.
- No saturar una sola fila con demasiados controles.
- Si un grupo de acciones o filtros crece, debe reorganizarse en múltiples filas o columnas responsivas.

### Responsive real
- En móvil, los elementos deben reacomodarse antes de colisionar.
- Los formularios y tablas no deben depender de “quepa si el texto es corto”.
- La pantalla debe seguir siendo usable aunque el contenido crezca.

### Restricciones explícitas
- Evitar botones con altura fija si el texto puede crecer.
- Evitar `overflow: hidden` como solución de layout por defecto.
- Evitar truncar texto crítico en CTAs, mensajes, labels o tabs si afecta comprensión.
- Evitar agrupar demasiados botones de distinta jerarquía en una sola línea.
- Evitar cards con alturas visualmente forzadas si el contenido es variable.

### Revisión obligatoria
Toda pantalla debe revisarse considerando:
- textos largos,
- etiquetas largas,
- mensajes de error largos,
- traducciones español / inglés,
- y combinaciones de filtros o acciones visibles al mismo tiempo.

## Prevención de desborde horizontal

La interfaz no debe generar scroll horizontal salvo en componentes excepcionales y controlados, como ciertas tablas extensas.

### Reglas obligatorias
- Ninguna pantalla principal debe desbordarse hacia la derecha por mala composición.
- El layout general debe mantenerse siempre dentro del viewport.
- El contenido debe reorganizarse antes de provocar scroll horizontal global.

### Reglas de composición
- Usar `Grid` y `Grid.Column` de forma coherente con la grilla de 16 columnas.
- No combinar columnas o contenedores que excedan visualmente el ancho disponible.
- Evitar anchos manuales rígidos que empujen el layout fuera del viewport.
- Evitar márgenes laterales manuales que rompan la composición.
- Evitar componentes que crezcan horizontalmente sin control.

### Casos comunes que deben evitarse
- botones demasiado largos en una sola fila,
- filtros excesivos en la misma línea,
- tablas sin estrategia móvil,
- cards o segmentos con ancho forzado,
- textos largos sin wrapping,
- modales o contenedores con contenido más ancho que la pantalla,
- uso de `<div>` con estilos manuales que ignoran la grilla.

### Reglas para mobile
- En móvil, los elementos deben reorganizarse verticalmente antes de provocar compresión o salida lateral.
- Si una vista no cabe correctamente en mobile, debe rediseñarse.
- El sistema no debe depender de que el usuario haga scroll horizontal para operar funciones principales.

### Excepciones válidas
Solo pueden existir desbordes horizontales controlados cuando:
- se trate de una tabla compleja,
- exista una razón funcional clara,
- y el scroll horizontal esté limitado al componente, no a toda la página.

### Qué no hacer
- No usar `overflow-x: hidden` como parche para ocultar errores de layout.
- No aceptar scroll horizontal global como comportamiento normal del sistema.

## Empty states

Todo módulo debe contemplar estados vacíos claros para:
- sin registros,
- sin resultados en búsqueda,
- sin permisos,
- sin configuración previa,
- sin conexión o con error recuperable.

Cada estado vacío debe:
- explicar qué está pasando,
- indicar qué puede hacer el usuario,
- y evitar mensajes ambiguos.

### Reglas visuales
- El estado vacío debe tener suficiente presencia para orientar.
- No debe verse como “pantalla rota”.
- Debe incluir CTA o siguiente paso cuando sea pertinente.

## Loading y skeleton states

- Toda carga perceptible debe tener feedback visible.
- Usar `LoadingComponent`, dimmer, skeleton o patrón equivalente según la pantalla.
- No dejar pantallas congeladas sin indicar progreso.
- En móvil y desktop, el feedback debe ser igual de claro.

### Reglas
- El estado de carga no debe deformar visualmente el layout.
- El usuario debe entender si está cargando toda la pantalla o solo una sección.
- Los loaders no deben ocultar controles críticos sin motivo.

## Formularios

### Reglas obligatorias
- Todo campo obligatorio debe mostrar asterisco rojo.
- Toda validación debe ser clara y resolutiva.
- Todo mensaje de error debe ayudar a corregir.
- Los campos complejos deben usar tooltips o ayuda contextual.
- Mantener orden visual y jerarquía clara.

### Formatos
- Fechas: `dd-mm-yyyy`
- Cantidades con separadores consistentes
- No mezclar formatos para un mismo tipo de dato

### Reglas de composición
- Usar preferentemente `Form`, `Form.Field`, `Form.Group`.
- Los formularios deben respirar; no pegar campos entre sí.
- Si un formulario tiene demasiados campos, dividirlo por bloques lógicos.
- No usar campos comprimidos solo para “que quepan”.
- Los labels, ayudas y mensajes deben soportar crecimiento de contenido.
- Los botones de acción deben quedar claramente separados del contenido del formulario.

### Reglas visuales adicionales
- Los formularios deben verse fáciles de completar.
- Evitar ruido visual, ayudas redundantes o textos excesivos.
- Los errores deben aparecer cerca del campo o bloque relevante.
- Los formularios largos deben seguir siendo claros en móvil.

## Confirmaciones y acciones destructivas

- Acciones destructivas o irreversibles requieren confirmación.
- La confirmación debe explicar impacto y alcance.
- El texto del botón debe dejar claro lo que ocurrirá.
- Cuando exista borrado lógico, la UI debe comunicar que la baja es desactivación si eso afecta el entendimiento del usuario.

### Reglas visuales
- No saturar con confirmaciones innecesarias.
- Diferenciar claramente una advertencia de una acción confirmada.
- El usuario debe entender qué acción cancela y cuál confirma.

## Notificaciones y mensajes del sistema

- Los mensajes deben ser consistentes entre módulos.
- Diferenciar visualmente:
  - éxito,
  - advertencia,
  - error,
  - información.
- No saturar al usuario con popups innecesarios.
- Una notificación debe existir solo si aporta claridad o evita error.

### Reglas visuales
- Usar componentes consistentes de notificación.
- No usar estilos improvisados por módulo.
- El mensaje debe caber correctamente aunque sea más largo en otro idioma.

## Mensajes y microcopy

Todo texto visible al usuario debe:
- estar en español (México),
- estar bien redactado,
- evitar tecnicismos innecesarios,
- explicar acciones y errores con claridad,
- permitir usar el sistema sin capacitación.

### Reglas obligatorias
- Los textos deben ser claros, concretos y orientados a la acción.
- Evitar mensajes vagos como “error desconocido” si puede darse algo más útil.
- Evitar frases largas si pueden resolverse mejor con mejor jerarquía visual.
- Los CTAs deben ser precisos y comprensibles.

## Resiliencia para internacionalización (i18n)

El front end debe diseñarse para soportar cambios de idioma sin romper la interfaz.

### Reglas obligatorias
- Todo contenedor debe tolerar que el texto cambie de longitud entre español e inglés.
- No diseñar componentes asumiendo que el texto siempre tendrá tamaño corto.
- Botones, tabs, labels, títulos, subtítulos, tooltips, mensajes y breadcrumbs deben soportar expansión de texto.
- Evitar alturas fijas o anchos rígidos que provoquen cortes o encimados al cambiar de idioma.
- Priorizar wrapping y crecimiento natural del contenedor sobre truncamiento agresivo.

### Validación mínima
Las pantallas más importantes deben revisarse en al menos dos escenarios:
- texto base en español,
- texto equivalente en inglés con mayor longitud.

### Regla crítica
El cambio de idioma nunca debe:
- romper la composición,
- sacar texto fuera del botón,
- encimar texto con otro control,
- ni provocar pérdida de legibilidad.

## Accesibilidad mínima

- Contraste suficiente
- Tamaños y espacios razonables
- Objetivos táctiles cómodos en móvil
- Tooltips o ayudas en campos complejos
- Estados de error y confirmación visibles
- Navegación suficientemente clara para usuarios no expertos

### Reglas adicionales
- El contenido no debe depender solo del color para comunicar significado.
- La UI debe poder entenderse por jerarquía, spacing y labels.
- El usuario debe identificar claramente:
  - dónde está,
  - qué puede hacer,
  - y qué pasó después de una acción.

## Comportamiento móvil por layout

- El sidebar debe adaptarse correctamente a móvil.
- Los botones y acciones frecuentes deben quedar accesibles con una mano cuando sea razonable.
- Formularios largos deben evitar fricción excesiva.
- Tablas extensas deben tener estrategia móvil explícita:
  - scroll horizontal controlado,
  - resumen por filas,
  - o representación alternativa.

### Reglas específicas
- El layout no debe escalar por compresión; debe reorganizarse.
- Los elementos no deben encimarse en mobile.
- Si una composición funciona solo en desktop, debe redefinirse para móvil.
- Toda vista crítica del negocio debe tener una estrategia móvil clara.

## Convenciones de archivos para UI

### Reglas obligatorias
- Las páginas del front end deben crearse como archivos `.jsx`.
- Los componentes visuales reutilizables deben crearse como archivos `.jsx`.
- Los componentes de layout deben vivir en una ubicación clara y reusable.
- La lógica visual no debe dispersarse innecesariamente entre archivos genéricos `.js` si el objetivo principal del archivo es renderizar UI.

### Objetivo
Mejorar:
- legibilidad,
- mantenibilidad,
- consistencia del front end,
- y claridad para futuros mantenedores o agentes de IA.

## Landing page obligatoria por defecto

Salvo que `REQUIREMENTS.md` indique lo contrario, considerar una landing page en dominio raíz con estas 7 secciones:
1. propuesta de valor + CTA visible
2. para quién es y qué problema resuelve
3. beneficios principales
4. cómo funciona
5. características clave y diferenciadores
6. FAQ con 5 preguntas frecuentes
7. CTA final + footer

### Reglas adicionales
- La landing debe conducir de atención a relevancia, luego a confianza y finalmente a conversión.
- Debe conservar suficiente aire visual entre secciones.
- No debe verse saturada, improvisada ni sobrecargada.

## Aplicación principal

Salvo que el proyecto diga otra cosa:
- la app debe vivir en `app.[dominio].com`
- debe existir una sección de ayuda
- debe existir un manual de usuario por módulo

### Reglas visuales
- La ayuda debe ser clara, accesible y consistente con el resto del sistema.
- No debe sentirse como un anexo visualmente ajeno al producto.

## Checklist UX/UI

Antes de cerrar una tarea visual:
- la UI es consistente,
- la navegación es clara,
- el layout respeta header + sidebar + footer,
- el menú lateral se ve elegante, ordenado y con jerarquía clara,
- los grupos del menú usan `Accordion` de forma consistente cuando aplica,
- los formularios tienen validaciones claras,
- los textos están en español México,
- la experiencia móvil está revisada,
- la accesibilidad base está cubierta,
- existen estados vacíos,
- existe feedback de carga,
- filtros, búsqueda y paginación siguen patrones consistentes,
- las pantallas soportan texto largo e internacionalización sin desbordes ni encimados,
- el layout se resuelve prioritariamente con Semantic UI React y no con `<div>` + `style`,
- no existen controles encimados,
- no existen botones con texto fuera del contenedor,
- no existen headers, mensajes o labels comprimidos por falta de aire visual,
- no existe scroll horizontal global por errores de composición,
- la pantalla mantiene jerarquía, respiración visual y claridad aun con contenido dinámico.
