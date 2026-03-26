const { query } = require('../system/mysql');
const { createError } = require('../system/errors');

const getSaleById = async (tenantId, saleId) => {
  const sales = await query(
    `
      SELECT
        sales.sale_id,
        sales.tenant_id,
        sales.store_id,
        sales.sale_number,
        sales.sale_date,
        sales.payment_method,
        sales.total_amount,
        sales.notes,
        sales.active,
        sales.creation_date,
        users.full_name AS created_by_name
      FROM sales
      INNER JOIN users ON users.user_id = sales.created_by_user_id
      WHERE sales.sale_id = ?
        AND sales.tenant_id = ?
      LIMIT 1
    `,
    [saleId, tenantId]
  );

  const sale = sales[0];
  if (!sale) {
    throw createError({
      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
      message: 'No fue posible encontrar la venta solicitada.',
    });
  }

  sale.items = await query(
    `
      SELECT
        sale_items.sale_item_id,
        sale_items.product_id,
        products.name AS product_name,
        products.sku,
        sale_items.quantity,
        sale_items.unit_price,
        sale_items.unit_cost_snapshot,
        sale_items.line_total
      FROM sale_items
      INNER JOIN products ON products.product_id = sale_items.product_id
      WHERE sale_items.sale_id = ?
        AND sale_items.active = 1
      ORDER BY sale_items.sale_item_id ASC
    `,
    [saleId]
  );

  return sale;
};

module.exports = {
  getSaleById,
};
