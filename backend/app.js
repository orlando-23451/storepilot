const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const basicAuth = require('basic-auth');
const { koaSwagger } = require('koa2-swagger-ui');
const routes = require('./routes');
const openApiSpecification = require('./swagger/openapi');
const requestContext = require('./src/system/requestContext');
const errorHandler = require('./src/system/errorHandler');
const config = require('./src/system/env');
const { createError } = require('./src/system/errors');

const app = new Koa();

app.use(errorHandler);
app.use(requestContext);
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  koaBody({
    multipart: false,
    jsonLimit: '1mb',
  })
);

app.use(async (ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = {
      success: true,
      data: {
        status: 'ok',
        service: config.appName,
        environment: config.environment,
      },
      trace_id: ctx.state.traceId || '',
    };
    return;
  }

  await next();
});

app.use(
  jwt({
    secret: config.jwtSecret,
    passthrough: true,
  }).unless({
    path: [/^\/health$/, /^\/api\/v1\/auth\/login$/, /^\/swagger/, /^\/swagger.json$/],
  })
);

app.use(async (ctx, next) => {
  if (!ctx.state.user && ctx.path.startsWith('/api/v1') && ctx.path !== '/api/v1/auth/login') {
    throw createError({
      status: 401,
      errorCode: 'AUTHENTICATION_REQUIRED',
      message: 'Necesitas iniciar sesión para continuar.',
      severity: 'warning',
    });
  }

  await next();
});

if (config.swaggerEnabled) {
  app.use(async (ctx, next) => {
    if (ctx.path === '/swagger' || ctx.path === '/swagger.json') {
      const credentials = basicAuth(ctx.req);
      if (
        !credentials ||
        credentials.name !== config.swaggerUsername ||
        credentials.pass !== config.swaggerPassword
      ) {
        ctx.set('WWW-Authenticate', 'Basic');
        throw createError({
          status: 401,
          errorCode: 'AUTHENTICATION_REQUIRED',
          message: 'Necesitas credenciales válidas para consultar la documentación.',
          severity: 'warning',
        });
      }
    }
    await next();
  });

  app.use(async (ctx, next) => {
    if (ctx.path === '/swagger.json') {
      ctx.body = openApiSpecification;
      return;
    }

    await next();
  });

  app.use(
    koaSwagger({
      routePrefix: '/swagger',
      swaggerOptions: {
        spec: openApiSpecification,
      },
    })
  );
}

app.use(routes().middleware());

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`${config.appName} API escuchando en el puerto ${config.port}`);
  });
}

module.exports = app;
