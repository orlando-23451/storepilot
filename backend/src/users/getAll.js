const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const search = ctx.query.search ? `%${ctx.query.search.trim()}%` : null;
  const status = ctx.query.status || 'active';

  const filters = ['users.tenant_id = ?'];
  const params = [ctx.state.user.tenantId];

  if (search) {
    filters.push('(users.full_name LIKE ? OR users.email LIKE ?)');
    params.push(search, search);
  }

  if (status === 'active') {
    filters.push('users.active = 1');
  } else if (status === 'inactive') {
    filters.push('users.active = 0');
  }

  const rows = await query(
    `
      SELECT
        users.user_id,
        users.full_name,
        users.email,
        users.active,
        users.last_login_date,
        users.creation_date,
        roles.code AS role_code,
        roles.name AS role_name
      FROM users
      INNER JOIN roles ON roles.role_id = users.role_id
      WHERE ${filters.join(' AND ')}
      ORDER BY users.creation_date DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pagination.pageSize, pagination.offset]
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM users WHERE ${filters.join(' AND ')}`,
    params
  );

  success(ctx, rows, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
