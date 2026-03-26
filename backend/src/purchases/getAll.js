const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const filters = ['purchases.tenant_id = ?'];
  const params = [ctx.state.user.tenantId];

  if (ctx.query.search) {
    const search = `%${ctx.query.search.trim()}%`;
    filters.push('(purchases.supplier_name LIKE ? OR purchases.notes LIKE ?)');
    params.push(search, search);
  }

  if (ctx.query.start_date) {
    filters.push('DATE(purchases.purchase_date) >= DATE(?)');
    params.push(ctx.query.start_date);
  }

  if (ctx.query.end_date) {
    filters.push('DATE(purchases.purchase_date) <= DATE(?)');
    params.push(ctx.query.end_date);
  }

  const rows = await query(
    `
      SELECT
        purchases.purchase_id,
        purchases.supplier_name,
        purchases.purchase_date,
        purchases.total_amount,
        purchases.notes,
        users.full_name AS created_by_name
      FROM purchases
      INNER JOIN users ON users.user_id = purchases.created_by_user_id
      WHERE ${filters.join(' AND ')}
      ORDER BY purchases.purchase_date DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pagination.pageSize, pagination.offset]
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM purchases WHERE ${filters.join(' AND ')}`,
    params
  );

  success(ctx, rows, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
