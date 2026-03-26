const { query } = require('../system/mysql');
const { success } = require('../system/response');

module.exports = async (ctx) => {
  if (ctx.state.user.roleCode === 'cashier') {
    const todaySales = await query(
      `
        SELECT
          COUNT(*) AS sales_today,
          COALESCE(SUM(total_amount), 0) AS total_sales_amount
        FROM sales
        WHERE tenant_id = ?
          AND created_by_user_id = ?
          AND DATE(sale_date) = CURDATE()
      `,
      [ctx.state.user.tenantId, ctx.state.user.userId]
    );

    const availableProducts = await query(
      `
        SELECT COUNT(*) AS total_products
        FROM products
        WHERE tenant_id = ? AND active = 1 AND stock_quantity > 0
      `,
      [ctx.state.user.tenantId]
    );

    return success(ctx, {
      role_scope: 'cashier',
      sales_today: todaySales[0],
      available_products: availableProducts[0].total_products,
    });
  }

  const summaryRows = await query(
    `
      SELECT
        COUNT(*) AS total_products,
        SUM(CASE WHEN stock_quantity <= minimum_stock THEN 1 ELSE 0 END) AS low_stock_products,
        ROUND(AVG(COALESCE(average_cost, 0)), 2) AS average_cost
      FROM products
      WHERE tenant_id = ? AND active = 1
    `,
    [ctx.state.user.tenantId]
  );

  const lowMarginRows = await query(
    `
      SELECT
        COUNT(*) AS total
      FROM products
      WHERE tenant_id = ?
        AND active = 1
        AND average_cost IS NOT NULL
        AND sale_price > 0
        AND ((sale_price - average_cost) / sale_price) < 0.30
    `,
    [ctx.state.user.tenantId]
  );

  const recentSales = await query(
    `
      SELECT sale_id, sale_number, sale_date, total_amount
      FROM sales
      WHERE tenant_id = ?
      ORDER BY sale_date DESC
      LIMIT 5
    `,
    [ctx.state.user.tenantId]
  );

  const recentPurchases = await query(
    `
      SELECT purchase_id, supplier_name, purchase_date, total_amount
      FROM purchases
      WHERE tenant_id = ?
      ORDER BY purchase_date DESC
      LIMIT 5
    `,
    [ctx.state.user.tenantId]
  );

  success(ctx, {
    role_scope: 'admin',
    summary: {
      ...summaryRows[0],
      low_margin_products: lowMarginRows[0].total,
    },
    recent_sales: recentSales,
    recent_purchases: recentPurchases,
  });
};
