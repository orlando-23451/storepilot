const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');
const { getUserById } = require('./shared');

const schema = Joi.object({
  full_name: Joi.string().min(3).max(120).required(),
  email: Joi.string().email().required(),
  role_code: Joi.string().valid('admin', 'cashier').required(),
  active: Joi.boolean().required(),
});

module.exports = async (ctx) => {
  const userId = Number(ctx.params.userId);
  const payload = validateSchema(schema, ctx.request.body);
  await getUserById(ctx.state.user.tenantId, userId);

  const duplicateUsers = await query(
    'SELECT user_id FROM users WHERE email = ? AND user_id <> ? LIMIT 1',
    [payload.email.toLowerCase(), userId]
  );

  if (duplicateUsers[0]) {
    throw createError({
      status: 409,
      errorCode: 'RESOURCE_ALREADY_EXISTS',
      message: 'Ya existe un usuario registrado con ese correo electrónico.',
      severity: 'warning',
    });
  }

  const roles = await query('SELECT role_id FROM roles WHERE code = ? AND active = 1 LIMIT 1', [
    payload.role_code,
  ]);

  if (!roles[0]) {
    throw createError({
      status: 400,
      errorCode: 'BUSINESS_RULE_VIOLATION',
      message: 'El rol solicitado no se encuentra disponible.',
      severity: 'warning',
    });
  }

  await query(
    `
      UPDATE users
      SET full_name = ?, email = ?, role_id = ?, active = ?
      WHERE user_id = ? AND tenant_id = ?
    `,
    [
      payload.full_name,
      payload.email.toLowerCase(),
      roles[0].role_id,
      payload.active ? 1 : 0,
      userId,
      ctx.state.user.tenantId,
    ]
  );

  const updatedUser = await getUserById(ctx.state.user.tenantId, userId);
  success(ctx, updatedUser);
};
