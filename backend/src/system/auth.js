const jwt = require('jsonwebtoken');
const config = require('./env');
const { createError } = require('./errors');

const createToken = (user) =>
  jwt.sign(
    {
      userId: user.user_id,
      tenantId: user.tenant_id,
      storeId: user.store_id,
      roleCode: user.role_code,
      fullName: user.full_name,
      email: user.email,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );

const requireRole = (allowedRoles) => async (ctx, next) => {
  if (!ctx.state.user || !allowedRoles.includes(ctx.state.user.roleCode)) {
    throw createError({
      status: 403,
      errorCode: 'ACCESS_DENIED',
      message: 'No cuentas con permisos para realizar esta acción.',
      severity: 'warning',
    });
  }

  await next();
};

module.exports = {
  createToken,
  requireRole,
};
