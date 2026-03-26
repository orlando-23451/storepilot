# REQUIREMENTS.md

# StorePilot SaaS — Requerimientos Funcionales y de Producto

## 1. Propósito del documento

Este documento define los requerimientos funcionales y de alcance para el MVP de **StorePilot SaaS**, un sistema comercial orientado a tiendas físicas que necesitan controlar inventario, costos y registrar ventas, incluyendo sugerencias de precio para apoyar la rentabilidad.

Este documento busca servir como base para diseño funcional, priorización de backlog y posterior definición técnica.

---

## 2. Resumen del producto

**StorePilot SaaS** es una plataforma SaaS multi-tenant para tiendas físicas que permite:

- administrar catálogo de productos,
- registrar compras a proveedores,
- controlar inventario,
- registrar ventas,
- visualizar costos,
- sugerir precios de venta con base en utilidad esperada,
- consultar reportes operativos básicos.

El sistema está orientado principalmente a dueños o administradores de tienda, con soporte para usuarios operativos tipo cajero o usuario general.

---

## 3. Objetivo del negocio

El sistema debe permitir que una tienda física tenga control confiable de su operación básica para:

- reducir desorden en inventario,
- conocer costos actualizados o de referencia,
- registrar ventas de forma operativa,
- mejorar la toma de decisiones sobre precio y utilidad,
- operar en un entorno SaaS vendible a múltiples clientes.

---

## 4. Alcance del producto

### 4.1 Alcance del MVP

El MVP debe incluir:

- autenticación e inicio de sesión,
- gestión de roles básicos,
- administración de cuenta/tienda,
- catálogo de productos,
- registro de compras a proveedores,
- control de inventario,
- registro de ventas,
- visibilidad de costos,
- sugerencias básicas de precio,
- reportes operativos básicos,
- separación estricta de datos por tienda cliente.

### 4.2 Fuera de alcance del MVP

El MVP no incluye:

- cobro integrado dentro del sistema,
- pasarela de pagos,
- integración con terminal bancaria,
- integración obligatoria con hardware POS,
- CRM de clientes,
- historial detallado de clientes,
- crédito, lealtad o cuentas por cobrar,
- multi-sucursal confirmada,
- analítica avanzada,
- predicción compleja de demanda,
- automatización avanzada de precios,
- app móvil para cliente final,
- marketplace o e-commerce.

---

## 5. Tipo de solución

- **Tipo de producto:** SaaS comercial
- **Modelo operativo:** Multi-tenant
- **Canal principal:** Web / backoffice operativo
- **Cliente objetivo:** tiendas físicas de abarrotes, ropa o artículos generales
- **Usuario comprador y principal operador:** dueño o administrador de tienda

---

## 6. Actores del sistema

## 6.1 Administrador

### Objetivo
Operar y configurar integralmente la tienda dentro del sistema.

### Capacidades esperadas
- acceso total,
- administración de productos,
- registro de compras,
- consulta de inventario,
- consulta de costos,
- revisión y ajuste de precios,
- consulta de reportes,
- administración de usuarios.

## 6.2 Usuario general / cajero

### Objetivo
Ejecutar operaciones diarias permitidas, principalmente ventas.

### Capacidades esperadas
- iniciar sesión,
- registrar ventas,
- consultar información operativa autorizada.

### Restricción base
No debe tener acceso total ni visibilidad completa de configuración sensible, salvo permisos futuros explícitos.

---

## 7. Requerimientos funcionales

## 7.1 Autenticación y control de acceso

### RF-001 Inicio de sesión
El sistema debe permitir que administrador y usuario general inicien sesión con credenciales válidas.

### RF-002 Control por rol
El sistema debe controlar el acceso con al menos dos roles:
- administrador,
- usuario general/cajero.

### RF-003 Acceso total del administrador
El administrador debe tener acceso completo a todos los módulos del MVP.

### RF-004 Acceso restringido del usuario general
El usuario general debe tener acceso únicamente a funciones operativas autorizadas, principalmente ventas y consultas limitadas.

### RF-005 Aislamiento por tienda
Cada usuario debe acceder únicamente a la información de su propia tienda cliente.

---

## 7.2 Administración de tienda / cuenta SaaS

### RF-006 Cuenta independiente por tienda
El sistema debe permitir que cada tienda opere como una cuenta independiente dentro del SaaS.

### RF-007 Separación de datos
El sistema debe garantizar que inventario, compras, ventas, productos, costos y usuarios de una tienda no se mezclen con los de otra.

### RF-008 Administración de usuarios
El administrador debe poder crear, consultar, actualizar y desactivar usuarios de su tienda.

---

## 7.3 Catálogo de productos

### RF-009 Alta de productos
El administrador debe poder crear productos en el catálogo.

### RF-010 Consulta de productos
El administrador debe poder consultar un producto y consultar listados de productos.

### RF-011 Actualización de productos
El administrador debe poder actualizar información de productos existentes.

### RF-012 Desactivación lógica de productos
El sistema debe permitir desactivar productos sin eliminarlos físicamente.

### RF-013 Estado del producto
El sistema debe manejar al menos estado activo e inactivo para productos.

### RF-014 Datos mínimos del producto
Cada producto debe tener la información mínima necesaria para operar inventario, costos, precio y ventas.

**Nota:** La definición exacta de campos será posterior y no forma parte de este documento técnico detallado.

---

## 7.4 Compras a proveedores

### RF-015 Registro de compras
El administrador debe poder registrar compras de productos a proveedores.

### RF-016 Entrada de inventario por compra
Cuando se registra una compra, el sistema debe incrementar existencias del producto correspondiente.

### RF-017 Actualización de referencia de costo
Cuando se registra una compra, el sistema debe actualizar la referencia de costo utilizada por el negocio.

### RF-018 Consulta de compras
El administrador debe poder consultar compras individuales y listados de compras.

### RF-019 Trazabilidad operativa
Las compras deben quedar registradas como movimientos que expliquen entradas de inventario.

---

## 7.5 Inventario

### RF-020 Existencias actuales
El sistema debe mostrar existencias actuales por producto.

### RF-021 Movimientos de inventario
El sistema debe permitir consultar movimientos de inventario al menos por:
- compras,
- ventas,
- ajustes futuros si se habilitan.

### RF-022 Consulta filtrable
El sistema debe permitir filtrar inventario y movimientos por criterios básicos como:
- producto,
- rango de fechas,
- tipo de movimiento,
- estado del producto.

### RF-023 Consistencia operativa
La existencia disponible debe reflejar el efecto acumulado de compras y ventas registradas.

---

## 7.6 Ventas

### RF-024 Registro de ventas
El sistema debe permitir registrar ventas dentro del sistema.

### RF-025 Venta sin cobro integrado
En el MVP, el sistema debe registrar la venta sin procesar el cobro dentro de la plataforma.

### RF-026 Descuento automático de inventario
Cuando una venta sea registrada, el sistema debe descontar automáticamente el inventario correspondiente.

### RF-027 Consulta de ventas
El administrador debe poder consultar una venta y consultar listados de ventas.

### RF-028 Registro por usuario general
El usuario general/cajero debe poder registrar ventas si tiene acceso habilitado.

### RF-029 Operación desacoplada del pago
El sistema debe permitir que la tienda cobre por fuera del sistema mediante efectivo, terminal externa u otro medio no integrado.

---

## 7.7 Costos y rentabilidad

### RF-030 Visualización de costo
El sistema debe permitir visualizar el costo de referencia por producto.

### RF-031 Soporte a control de utilidad
El sistema debe permitir usar el costo de producto como base para revisión de utilidad o margen esperado.

### RF-032 Advertencia por costo faltante
Si un producto no tiene costo confiable, el sistema no debe inventar sugerencias de precio; debe marcar el caso como no calculable o advertido.

---

## 7.8 Sugerencias de precio

### RF-033 Sugerencia de precio por producto
El sistema debe poder sugerir un precio de venta por producto.

### RF-034 Base de cálculo
La sugerencia debe considerar al menos:
- costo de referencia,
- criterio de utilidad objetivo.

### RF-035 Ajuste final por usuario
La sugerencia no debe obligar el precio; el administrador debe poder revisar y ajustar el precio final.

### RF-036 Cálculo básico en MVP
La primera versión debe contemplar una lógica básica y entendible de sugerencia, no una automatización avanzada ni modelo predictivo.

### RF-037 Transparencia operativa
La sugerencia debe ser comprensible para el usuario y estar ligada a criterios operativos definidos.

**Pendiente funcional crítico:** queda por definir si la utilidad se manejará por porcentaje fijo, regla configurable por tienda, categoría o combinación.

---

## 7.9 Reportes básicos

### RF-038 Reportes operativos
El sistema debe ofrecer reportes básicos sobre:
- inventario,
- compras,
- ventas,
- costos,
- utilidad estimada o referencia de margen.

### RF-039 Consulta por filtros
Los reportes deben ser consultables con filtros operativos básicos.

### RF-040 Exportación básica
El sistema debería contemplar exportación básica de reportes si esto no compromete el alcance del MVP.

**Nota:** la exportación se considera deseable, pero no confirmada como obligatoria si impacta el tiempo del MVP.

---

## 8. Casos de uso principales

### CU-001 Iniciar sesión
**Actor:** Administrador / Usuario general  
**Descripción:** El usuario accede al sistema con sus credenciales.

### CU-002 Administrar productos
**Actor:** Administrador  
**Descripción:** Crea, consulta, actualiza y desactiva productos del catálogo.

### CU-003 Registrar compra
**Actor:** Administrador  
**Descripción:** Registra compra de productos y genera entrada a inventario.

### CU-004 Consultar inventario
**Actor:** Administrador  
**Descripción:** Consulta existencias y movimientos de inventario.

### CU-005 Consultar costo
**Actor:** Administrador  
**Descripción:** Revisa costo de referencia por producto.

### CU-006 Obtener sugerencia de precio
**Actor:** Administrador  
**Descripción:** Consulta sugerencia de precio con base en costo y utilidad.

### CU-007 Registrar venta
**Actor:** Administrador / Usuario general  
**Descripción:** Registra una venta y descuenta inventario.

### CU-008 Consultar ventas
**Actor:** Administrador  
**Descripción:** Consulta ventas registradas y listados históricos.

### CU-009 Administrar usuarios
**Actor:** Administrador  
**Descripción:** Crea, consulta, actualiza y desactiva usuarios de la tienda.

### CU-010 Consultar reportes
**Actor:** Administrador  
**Descripción:** Consulta reportes de operación e indicadores básicos.

---

## 9. Flujo principal del negocio

1. La tienda cliente accede a su cuenta en el SaaS.
2. El administrador inicia sesión.
3. El administrador registra o mantiene actualizado su catálogo de productos.
4. El administrador registra compras a proveedores.
5. El sistema incrementa inventario y actualiza referencia de costo.
6. El administrador consulta costos y sugerencias de precio.
7. El administrador define o ajusta precio de venta.
8. El usuario general o el administrador registra ventas.
9. El sistema descuenta inventario automáticamente.
10. El administrador consulta reportes para tomar decisiones operativas.

---

## 10. Reglas funcionales preliminares

### RN-001 Desactivación lógica
Los registros clave del MVP, como productos y usuarios, deben manejar desactivación lógica en lugar de eliminación física.

### RN-002 Aislamiento multi-tenant
Ningún usuario puede ver o afectar datos de otra tienda.

### RN-003 Venta afecta inventario
Toda venta registrada debe impactar inventario.

### RN-004 Compra afecta inventario
Toda compra registrada debe impactar inventario.

### RN-005 Compra actualiza costo
Toda compra registrada debe poder actualizar la referencia de costo del producto.

### RN-006 Sugerencia no obligatoria
La sugerencia de precio es una recomendación; no impone el precio final.

### RN-007 Sin costo no hay sugerencia confiable
Si no existe costo suficiente, el sistema debe advertir y no calcular recomendación engañosa.

### RN-008 Administrador con control total
El rol administrador tendrá visibilidad y control total del sistema de su tienda.

### RN-009 Usuario general limitado
El rol usuario general tendrá acceso restringido según operación básica.

---

## 11. Requerimientos no funcionales de producto

## 11.1 Seguridad y acceso

### RNF-001
El sistema debe proteger la información por tienda y por rol.

### RNF-002
La plataforma debe tratar como confidencial la información comercial de cada cliente, especialmente:
- costos,
- precios,
- ventas,
- utilidad,
- inventario.

## 11.2 Modelo SaaS

### RNF-003
El sistema debe estar preparado para operar con múltiples tiendas clientes al mismo tiempo, manteniendo separación estricta de datos.

## 11.3 Usabilidad

### RNF-004
El MVP debe priorizar simplicidad operativa para que un dueño o administrador pueda usarlo sin configuración compleja.

### RNF-005
La operación diaria de compra, inventario y venta debe ser comprensible y directa.

## 11.4 Confiabilidad operativa

### RNF-006
La plataforma debe mantener consistencia entre compras, ventas e inventario.

### RNF-007
La lógica del MVP debe privilegiar claridad y confiabilidad sobre automatización sofisticada.

---

## 12. Integraciones

## 12.1 Integraciones no requeridas para MVP
No son obligatorias en esta fase:
- pasarela de pago,
- terminal bancaria,
- hardware POS,
- lectores de código de barras,
- impresoras de tickets,
- sistemas contables externos.

## 12.2 Integraciones probables a futuro
Se consideran probables, pero no confirmadas para MVP:
- terminal/hardware POS,
- pasarelas o medios de cobro integrados,
- lectores de código de barras,
- impresión de tickets,
- exportaciones administrativas o contables.

---

## 13. Datos sensibles

### Personales
No se prevé manejo relevante de datos personales en el MVP, o solo mínimos operativos de usuarios.

### Financieros
Sí. El sistema manejará información de:
- costos,
- precios,
- ventas,
- utilidad.

### Confidenciales
Sí. La operación comercial de cada tienda debe considerarse confidencial.

### Implicación
La protección por tienda y por rol es obligatoria.

---

## 14. Supuestos de negocio tomados en este documento

1. El sistema será vendido como SaaS a múltiples tiendas físicas.
2. El usuario principal es el dueño o administrador de la tienda.
3. El mayor valor del producto está en inventario y costos.
4. La sugerencia de precios es relevante, pero secundaria frente al control operativo.
5. El MVP sí registra ventas.
6. El cobro se realiza fuera del sistema en esta fase.
7. No se administran clientes finales en el MVP.
8. El administrador tiene acceso total.
9. El usuario general/cajero tiene acceso limitado.
10. Las compras a proveedores son la principal fuente de entrada de inventario.
11. Los reportes serán básicos y operativos.
12. La lógica de sugerencia de precio será inicial y simple.

---

## 15. Riesgos y decisiones pendientes

### Pendientes críticos

#### PD-001 Regla de utilidad
Falta definir cómo se establecerá la utilidad objetivo:
- porcentaje fijo,
- margen por categoría,
- regla por tienda,
- combinación.

#### PD-002 Regla de costo
Falta definir qué costo se utilizará como referencia:
- último costo,
- costo promedio,
- regla configurable.

#### PD-003 Multi-sucursal
No está definido si el MVP contemplará una sola sucursal por tienda o varias.

#### PD-004 Reportes mínimos obligatorios
Falta concretar el detalle exacto de reportes que serán obligatorios en primera versión.

### Impacto de estos pendientes
Estas decisiones afectan:
- experiencia operativa,
- precisión de precios sugeridos,
- definición de entidades funcionales,
- prioridades del backlog.

---

## 16. Criterios de priorización del MVP

El MVP debe priorizar, en este orden:

1. separación por tienda,
2. operación confiable de inventario,
3. registro de compras,
4. registro de ventas,
5. visibilidad de costos,
6. sugerencias de precio básicas,
7. reportes operativos esenciales.

No debe priorizar en esta fase:
- automatización avanzada,
- sofisticación financiera,
- integraciones complejas,
- experiencia POS completa,
- CRM.

---

## 17. Resumen ejecutivo final

El MVP de **StorePilot SaaS** debe resolver primero el problema operativo de inventario y costos para tiendas físicas, complementándolo con registro de ventas y sugerencias básicas de precio. Debe ser un sistema SaaS multi-tenant, web, simple de operar, con dos roles principales, sin cobro integrado en esta etapa y con foco en confiabilidad operativa por encima de complejidad.

Este documento deja listo el contexto funcional para pasar a una siguiente etapa de definición detallada, historias de usuario o especificación técnica.
