const { query } = require('../system/mysql');
const { createError } = require('../system/errors');

const getPurchaseById = async (tenantId, purchaseId) => {
  const purchases = await query(
    `
      SELECT
        purchases.purchase_id,
        purchases.tenant_id,
        purchases.store_id,
        purchases.supplier_name,
        purchases.purchase_date,
        purchases.total_amount,
        purchases.notes,
        purchases.active,
        purchases.creation_date,
        purchases.last_update_date,
        users.full_name AS created_by_name
      FROM purchases
      INNER JOIN users ON users.user_id = purchases.created_by_user_id
      WHERE purchases.purchase_id = ?
        AND purchases.tenant_id = ?
      LIMIT 1
    `,
    [purchaseId, tenantId]
  );

  const purchase = purchases[0];
  if (!purchase) {
    throw createError({
      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
      message: 'No fue posible encontrar la compra solicitada.',
    });
  }

  purchase.items = await query(
    `
      SELECT
        purchase_items.purchase_item_id,
        purchase_items.product_id,
        products.name AS product_name,
        products.sku,
        purchase_items.quantity,
        purchase_items.unit_cost,
        purchase_items.line_total
      FROM purchase_items
      INNER JOIN products ON products.product_id = purchase_items.product_id
      WHERE purchase_items.purchase_id = ?
        AND purchase_items.active = 1
      ORDER BY purchase_items.purchase_item_id ASC
    `,
    [purchaseId]
  );

  return purchase;
};

module.exports = {
  getPurchaseById,
};
