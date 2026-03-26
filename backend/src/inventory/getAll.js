const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const search = ctx.query.search ? `%${ctx.query.search.trim()}%` : null;
  const status = ctx.query.status || 'active';
  const stockState = ctx.query.stock_state || 'all';
  const filters = ['products.tenant_id = ?'];
  const params = [ctx.state.user.tenantId];

  if (search) {
    filters.push('(products.name LIKE ? OR products.sku LIKE ?)');
    params.push(search, search);
  }

  if (status === 'active') {
    filters.push('products.active = 1');
  } else if (status === 'inactive') {
    filters.push('products.active = 0');
  }

  if (stockState === 'low') {
    filters.push('products.stock_quantity <= products.minimum_stock');
  } else if (stockState === 'out') {
    filters.push('products.stock_quantity = 0');
  }

  const rows = await query(
    `
      SELECT
        products.product_id,
        products.sku,
        products.name,
        products.stock_quantity,
        products.minimum_stock,
        products.average_cost,
        products.sale_price,
        products.active,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
      WHERE ${filters.join(' AND ')}
      ORDER BY products.name ASC
      LIMIT ? OFFSET ?
    `,
    [...params, pagination.pageSize, pagination.offset]
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM products WHERE ${filters.join(' AND ')}`,
    params
  );

  success(ctx, rows, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
