const { query } = require('../system/mysql');
const { success } = require('../system/response');

module.exports = async (ctx) => {
  const startDate = ctx.query.start_date || null;
  const endDate = ctx.query.end_date || null;

  const dateFilter = [];
  const dateParams = [ctx.state.user.tenantId];

  if (startDate) {
    dateFilter.push('DATE(sale_date) >= DATE(?)');
    dateParams.push(startDate);
  }

  if (endDate) {
    dateFilter.push('DATE(sale_date) <= DATE(?)');
    dateParams.push(endDate);
  }

  const salesSummary = await query(
    `
      SELECT
        COUNT(*) AS total_sales,
        COALESCE(SUM(total_amount), 0) AS gross_sales
      FROM sales
      WHERE tenant_id = ?
      ${dateFilter.length ? `AND ${dateFilter.join(' AND ')}` : ''}
    `,
    dateParams
  );

  const purchaseSummary = await query(
    `
      SELECT
        COUNT(*) AS total_purchases,
        COALESCE(SUM(total_amount), 0) AS gross_purchases
      FROM purchases
      WHERE tenant_id = ?
      ${
        dateFilter.length
          ? `AND ${dateFilter
              .join(' AND ')
              .replaceAll('sale_date', 'purchase_date')}`
          : ''
      }
    `,
    dateParams
  );

  const inventorySummary = await query(
    `
      SELECT
        COUNT(*) AS total_products,
        SUM(CASE WHEN stock_quantity <= minimum_stock THEN 1 ELSE 0 END) AS low_stock_products,
        COALESCE(SUM(stock_quantity * COALESCE(average_cost, 0)), 0) AS estimated_inventory_value
      FROM products
      WHERE tenant_id = ? AND active = 1
    `,
    [ctx.state.user.tenantId]
  );

  const marginSummary = await query(
    `
      SELECT
        products.product_id,
        products.name,
        products.sku,
        products.sale_price,
        products.average_cost,
        CASE
          WHEN products.average_cost IS NULL OR products.sale_price = 0 THEN NULL
          ELSE ROUND(((products.sale_price - products.average_cost) / products.sale_price) * 100, 2)
        END AS current_margin_percent
      FROM products
      WHERE products.tenant_id = ?
        AND products.active = 1
      ORDER BY current_margin_percent ASC
      LIMIT 5
    `,
    [ctx.state.user.tenantId]
  );

  success(ctx, {
    sales: salesSummary[0],
    purchases: purchaseSummary[0],
    inventory: inventorySummary[0],
    low_margin_products: marginSummary,
  });
};
