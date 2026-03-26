const { AppError } = require('./errors');
const { failure } = require('./response');
const logger = require('./logger');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const normalizedError =
      error instanceof AppError
        ? error
        : new AppError({
            status: 500,
            errorCode: 'INTERNAL_SERVER_ERROR',
            message: 'Ocurrió un error interno. Intenta de nuevo más tarde.',
          });

    logger.error({
      trace_id: ctx.state.traceId,
      module: 'error-handler',
      error_code: normalizedError.errorCode,
      severity: normalizedError.severity,
      technical_message: error.message,
      stack: error.stack,
    });

    failure(ctx, normalizedError);
  }
};

module.exports = errorHandler;
