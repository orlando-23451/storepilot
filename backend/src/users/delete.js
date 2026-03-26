const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { getUserById } = require('./shared');

module.exports = async (ctx) => {
  const userId = Number(ctx.params.userId);

  if (userId === ctx.state.user.userId) {
    throw createError({
      status: 409,
      errorCode: 'BUSINESS_RULE_VIOLATION',
      message: 'No puedes desactivar tu propio usuario mientras estás en sesión.',
      severity: 'warning',
    });
  }

  await getUserById(ctx.state.user.tenantId, userId);
  await query('UPDATE users SET active = 0 WHERE user_id = ? AND tenant_id = ?', [
    userId,
    ctx.state.user.tenantId,
  ]);

  success(ctx, { user_id: userId, active: false });
};
