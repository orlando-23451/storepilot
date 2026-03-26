const moduleManuals = [
  {
    key: 'dashboard',
    title: 'Dashboard operativo',
    summary: 'Resumen ejecutivo para detectar riesgo operativo y actividad reciente.',
    steps: [
      'Revisa indicadores clave al entrar a la aplicación.',
      'Identifica productos con margen bajo o inventario crítico.',
      'Usa la actividad reciente para validar compras y ventas capturadas.',
    ],
  },
  {
    key: 'products',
    title: 'Catálogo de productos',
    summary: 'Alta, actualización y desactivación lógica del catálogo de la tienda.',
    steps: [
      'Captura SKU, nombre, precio y stock mínimo.',
      'Mantén activos solo los productos vigentes.',
      'Ajusta el precio final después de revisar costo y sugerencia.',
    ],
  },
  {
    key: 'purchases',
    title: 'Compras a proveedores',
    summary: 'Registro de entradas de inventario y actualización de costo promedio.',
    steps: [
      'Selecciona proveedor, fecha y productos comprados.',
      'Confirma cantidades y costo unitario antes de guardar.',
      'Verifica que el inventario y costo promedio se actualicen.',
    ],
  },
  {
    key: 'sales',
    title: 'Registro de ventas',
    summary: 'Captura operativa desacoplada del cobro, con descuento automático de inventario.',
    steps: [
      'Busca productos por nombre, SKU o código.',
      'Agrega cantidades al carrito y confirma el método de cobro externo.',
      'Registra la venta para reflejar la salida de inventario.',
    ],
  },
  {
    key: 'pricing',
    title: 'Sugerencias de precio',
    summary: 'Cálculo básico transparente a partir de costo promedio y margen objetivo.',
    steps: [
      'Ajusta el margen objetivo sugerido para la tienda.',
      'Revisa la recomendación por producto y detecta advertencias por costo faltante.',
      'Actualiza el precio de venta cuando la decisión sea operativamente válida.',
    ],
  },
  {
    key: 'reports',
    title: 'Reportes operativos',
    summary: 'Consulta resumida de ventas, compras, inventario y márgenes.',
    steps: [
      'Aplica rango de fechas para el periodo a revisar.',
      'Contrasta ventas y compras con el estado del inventario.',
      'Usa el bloque de margen bajo para priorizar ajustes.',
    ],
  },
];

export default moduleManuals;
