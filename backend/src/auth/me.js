const { query } = require('../system/mysql');
const { createError } = require('../system/errors');
const { success } = require('../system/response');

module.exports = async (ctx) => {
const rows = await query(
    `
      SELECT 
        users.user_id,
        users.tenant_id,
        users.store_id,
        users.full_name,
        users.email,
        users.active,
        roles.code AS role_code,
        roles.name AS role_name,
        stores.name AS store_name,
        stores.target_margin_percent,
        -- Esto junta todos los nombres de permisos en un solo texto separado por comas
        GROUP_CONCAT(permissions.name) AS permissions_list
      FROM users
      INNER JOIN roles ON roles.role_id = users.role_id
      INNER JOIN stores ON stores.store_id = users.store_id
      -- Nuevos puentes hacia los permisos
      LEFT JOIN role_permissions ON role_permissions.role_id = roles.role_id
      LEFT JOIN permissions ON permissions.permission_id = role_permissions.permission_id
      WHERE users.user_id = ? 
        AND users.tenant_id = ?
        AND users.active = 1
      GROUP BY users.user_id -- Importante para que el GROUP_CONCAT funcione bien
      LIMIT 1
    `,
    [ctx.state.user.userId, ctx.state.user.tenantId]
  );

  if (!rows.length) {
    throw createError(404, 'USER_NOT_FOUND', 'Usuario no encontrado');
  }

  const userData = rows[0];
  userData.permissions = userData.permissions_list ? userData.permissions_list.split(',') : [];
  delete userData.permissions_list; // Limpiamos la propiedad temporal

  return success(ctx, userData);
};
