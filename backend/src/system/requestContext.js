const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

const requestContext = async (ctx, next) => {
  const traceId = ctx.headers['x-trace-id'] || uuidv4();
  const start = Date.now();

  ctx.state.traceId = traceId;
  ctx.set('x-trace-id', traceId);

  try {
    await next();
  } finally {
    logger.info({
      trace_id: traceId,
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
      duration_ms: Date.now() - start,
      user_id: ctx.state.user ? ctx.state.user.userId : null,
      tenant_id: ctx.state.user ? ctx.state.user.tenantId : null,
    });
  }
};

module.exports = requestContext;
