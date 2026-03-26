module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'StorePilot API',
    version: '0.1.0',
    description: 'API del MVP StorePilot SaaS para operación comercial de tiendas físicas.',
  },
  tags: [
    { name: 'Auth', description: 'Autenticación y sesión' },
    { name: 'Dashboard', description: 'Resumen operativo' },
    { name: 'Products', description: 'Catálogo de productos' },
    { name: 'Purchases', description: 'Compras a proveedores' },
    { name: 'Sales', description: 'Ventas registradas' },
    { name: 'Pricing', description: 'Configuración y sugerencias de precio' },
    { name: 'Reports', description: 'Reportes operativos' },
  ],
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Desarrollo local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error_code: { type: 'string', example: 'VALIDATION_ERROR' },
          message: {
            type: 'string',
            example: 'Revisa la información capturada y corrige los campos marcados.',
          },
          details: { type: 'array', items: { type: 'object' } },
          trace_id: { type: 'string', example: 'req-123' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Dashboard'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Estado del servicio',
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Inicia sesión en la plataforma',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Sesión iniciada' },
          400: {
            description: 'Validación',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Credenciales inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtiene la sesión autenticada',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Sesión actual' },
          401: {
            description: 'Autenticación requerida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Obtiene el resumen operativo del dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Resumen por rol' },
          401: {
            description: 'Autenticación requerida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/products': {
      get: {
        tags: ['Products'],
        summary: 'Lista productos del tenant actual',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de productos' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Crea un producto',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Producto creado' },
          403: {
            description: 'Acceso denegado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/purchases': {
      get: {
        tags: ['Purchases'],
        summary: 'Lista compras registradas',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de compras' },
        },
      },
      post: {
        tags: ['Purchases'],
        summary: 'Registra una compra y actualiza inventario',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Compra registrada' },
        },
      },
    },
    '/api/v1/sales': {
      get: {
        tags: ['Sales'],
        summary: 'Lista ventas registradas',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de ventas' },
        },
      },
      post: {
        tags: ['Sales'],
        summary: 'Registra una venta y descuenta inventario',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Venta registrada' },
        },
      },
    },
    '/api/v1/pricing/settings': {
      get: {
        tags: ['Pricing'],
        summary: 'Consulta el margen objetivo de la tienda',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Configuración de precio' },
        },
      },
      put: {
        tags: ['Pricing'],
        summary: 'Actualiza el margen objetivo de la tienda',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Configuración actualizada' },
        },
      },
    },
    '/api/v1/pricing/suggestions': {
      get: {
        tags: ['Pricing'],
        summary: 'Lista sugerencias de precio por producto',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Listado de sugerencias' },
        },
      },
    },
    '/api/v1/reports/summary': {
      get: {
        tags: ['Reports'],
        summary: 'Consulta el reporte operativo consolidado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Resumen de reportes' },
        },
      },
    },
  },
};
