const { query } = require('../system/mysql');
const { createError } = require('../system/errors');

const getUserById = async (tenantId, userId) => {
  const rows = await query(
    `
      SELECT
        users.user_id,
        users.tenant_id,
        users.store_id,
        users.role_id,
        roles.code AS role_code,
        roles.name AS role_name,
        users.full_name,
        users.email,
        users.last_login_date,
        users.active,
        users.creation_date,
        users.last_update_date
      FROM users
      INNER JOIN roles ON roles.role_id = users.role_id
      WHERE users.user_id = ?
        AND users.tenant_id = ?
      LIMIT 1
    `,
    [userId, tenantId]
  );

  const user = rows[0];
  if (!user) {
    throw createError({
      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
      message: 'No fue posible encontrar el usuario solicitado.',
    });
  }

  return user;
};

module.exports = {
  getUserById,
};
