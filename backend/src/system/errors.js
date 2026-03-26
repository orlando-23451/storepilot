class AppError extends Error {
  constructor({
    status = 500,
    errorCode = 'INTERNAL_SERVER_ERROR',
    message = 'Ocurrió un error interno. Intenta de nuevo más tarde.',
    details = [],
    severity = 'error',
  }) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
    this.severity = severity;
  }
}

const createError = (overrides) => new AppError(overrides);

module.exports = {
  AppError,
  createError,
};
