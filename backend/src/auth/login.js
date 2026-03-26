const { query } = require('../system/mysql');
const { createToken } = require('../system/auth');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const { verifyPassword } = require('../system/password');

module.exports = async (ctx) => {
  const payload = validateSchema(loginSchema, ctx.request.body);

  const rows = await query(
    `
      SELECT
        users.user_id,
        users.tenant_id,
        users.store_id,
        users.full_name,
        users.email,
        users.password_hash,
        roles.code AS role_code,
        stores.name AS store_name,
        stores.target_margin_percent
      FROM users
      INNER JOIN roles ON roles.role_id = users.role_id
      INNER JOIN stores ON stores.store_id = users.store_id
      WHERE users.email = ?
        AND users.active = 1
        AND roles.active = 1
        AND stores.active = 1
      LIMIT 1
    `,
    [payload.email.toLowerCase()]
  );

  const user = rows[0];

  if (!user || !verifyPassword(payload.password, user.password_hash)) {
    throw createError({
      status: 401,
      errorCode: 'INVALID_SESSION',
      message: 'Las credenciales no son válidas. Revisa tu correo y contraseña.',
      severity: 'warning',
    });
  }

  await query('UPDATE users SET last_login_date = NOW() WHERE user_id = ?', [user.user_id]);

  ctx.body = {
    success: true,
    data: {
      token: createToken(user),
      user: {
        user_id: user.user_id,
        tenant_id: user.tenant_id,
        store_id: user.store_id,
        role_code: user.role_code,
        full_name: user.full_name,
        email: user.email,
        store_name: user.store_name,
        target_margin_percent: user.target_margin_percent,
      },
    },
    trace_id: ctx.state.traceId || '',
  };
};
