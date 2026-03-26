const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const filters = ['sales.tenant_id = ?'];
  const params = [ctx.state.user.tenantId];

  if (ctx.query.start_date) {
    filters.push('DATE(sales.sale_date) >= DATE(?)');
    params.push(ctx.query.start_date);
  }

  if (ctx.query.end_date) {
    filters.push('DATE(sales.sale_date) <= DATE(?)');
    params.push(ctx.query.end_date);
  }

  if (ctx.state.user.roleCode === 'cashier') {
    filters.push('sales.created_by_user_id = ?');
    params.push(ctx.state.user.userId);
  }

  const rows = await query(
    `
      SELECT
        sales.sale_id,
        sales.sale_number,
        sales.sale_date,
        sales.payment_method,
        sales.total_amount,
        sales.notes,
        users.full_name AS created_by_name
      FROM sales
      INNER JOIN users ON users.user_id = sales.created_by_user_id
      WHERE ${filters.join(' AND ')}
      ORDER BY sales.sale_date DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pagination.pageSize, pagination.offset]
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM sales WHERE ${filters.join(' AND ')}`,
    params
  );

  success(ctx, rows, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
