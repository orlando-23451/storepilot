const { hashPassword } = require('../system/password');
const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');
const { getUserById } = require('./shared');

const schema = Joi.object({
  full_name: Joi.string().min(3).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(120).required(),
  role_code: Joi.string().valid('admin', 'cashier').required(),
});

module.exports = async (ctx) => {
  const payload = validateSchema(schema, ctx.request.body);

  const existingUsers = await query(
    'SELECT user_id FROM users WHERE email = ? LIMIT 1',
    [payload.email.toLowerCase()]
  );

  if (existingUsers[0]) {
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
  const role = roles[0];

  if (!role) {
    throw createError({
      status: 400,
      errorCode: 'BUSINESS_RULE_VIOLATION',
      message: 'El rol solicitado no se encuentra disponible.',
      severity: 'warning',
    });
  }

  const insertResult = await query(
    `
      INSERT INTO users (tenant_id, store_id, role_id, full_name, email, password_hash)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      ctx.state.user.tenantId,
      ctx.state.user.storeId,
      role.role_id,
      payload.full_name,
      payload.email.toLowerCase(),
      hashPassword(payload.password),
    ]
  );

  const createdUser = await getUserById(ctx.state.user.tenantId, insertResult.insertId);
  success(ctx, createdUser);
};
