const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');
const { buildSuggestion } = require('./shared');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const search = ctx.query.search ? `%${ctx.query.search.trim()}%` : null;
  const rows = await query(
    `
      SELECT target_margin_percent
      FROM stores
      WHERE store_id = ? AND tenant_id = ? AND active = 1
      LIMIT 1
    `,
    [ctx.state.user.storeId, ctx.state.user.tenantId]
  );

  const targetMarginPercent = Number(rows[0].target_margin_percent);
  const filters = ['products.tenant_id = ?', 'products.active = 1'];
  const params = [ctx.state.user.tenantId];

  if (search) {
    filters.push('(products.name LIKE ? OR products.sku LIKE ?)');
    params.push(search, search);
  }

  const products = await query(
    `
      SELECT
        products.product_id,
        products.sku,
        products.name,
        products.sale_price,
        products.average_cost,
        products.stock_quantity,
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

  const suggestions = products.map((product) => buildSuggestion(product, targetMarginPercent));

  success(ctx, suggestions, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
