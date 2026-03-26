const success = (ctx, data, meta = {}) => {
  ctx.body = {
    success: true,
    data,
    meta,
    trace_id: ctx.state.traceId || '',
  };
};

const failure = (ctx, error) => {
  ctx.status = error.status || 500;
  ctx.body = {
    success: false,
    error_code: error.errorCode || 'INTERNAL_SERVER_ERROR',
    message: error.message || 'Ocurrió un error interno. Intenta de nuevo más tarde.',
    details: error.details || [],
    trace_id: ctx.state.traceId || '',
  };
};

module.exports = {
  success,
  failure,
};
