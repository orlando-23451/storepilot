const Joi = require('joi');
const { createError } = require('./errors');

const validateSchema = (schema, payload) => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (!error) {
    return value;
  }

  throw createError({
    status: 400,
    errorCode: 'VALIDATION_ERROR',
    message: 'Revisa la información capturada y corrige los campos marcados.',
    details: error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/["]/g, ''),
    })),
    severity: 'warning',
  });
};

module.exports = {
  Joi,
  validateSchema,
};
