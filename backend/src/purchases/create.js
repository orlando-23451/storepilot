const { query, withTransaction } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');
const { getPurchaseById } = require('./shared');

const itemSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  unit_cost: Joi.number().min(0.01).required(),
});

const schema = Joi.object({
  supplier_name: Joi.string().min(2).max(140).required(),
  purchase_date: Joi.date().required(),
  notes: Joi.string().max(255).allow('', null),
  items: Joi.array().items(itemSchema).min(1).required(),
});

module.exports = async (ctx) => {
  const payload = validateSchema(schema, ctx.request.body);
  const totalAmount = payload.items.reduce(
    (accumulator, item) => accumulator + item.quantity * item.unit_cost,
    0
  );

  const result = await withTransaction(async (connection) => {
    const purchaseResult = await query(
      `
        INSERT INTO purchases (
          tenant_id,
          store_id,
          supplier_name,
          purchase_date,
          total_amount,
          notes,
          created_by_user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ctx.state.user.tenantId,
        ctx.state.user.storeId,
        payload.supplier_name,
        payload.purchase_date,
        Number(totalAmount.toFixed(2)),
        payload.notes || null,
        ctx.state.user.userId,
      ],
      connection
    );

    for (const item of payload.items) {
      const productRows = await query(
        `
          SELECT product_id, stock_quantity, average_cost
          FROM products
          WHERE product_id = ? AND tenant_id = ? AND active = 1
          LIMIT 1
        `,
        [item.product_id, ctx.state.user.tenantId],
        connection
      );

      const product = productRows[0];
      if (!product) {
        throw createError({
          status: 404,
          errorCode: 'RESOURCE_NOT_FOUND',
          message: 'Uno de los productos de la compra no existe o está inactivo.',
        });
      }

      const lineTotal = Number((item.quantity * item.unit_cost).toFixed(2));
      const currentStock = Number(product.stock_quantity || 0);
      const currentCost = product.average_cost === null ? null : Number(product.average_cost);
      const newStock = currentStock + item.quantity;
      const newAverageCost =
        currentCost === null || currentStock === 0
          ? item.unit_cost
          : Number(
              ((currentCost * currentStock + item.unit_cost * item.quantity) / newStock).toFixed(2)
            );

      await query(
        `
          INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, line_total)
          VALUES (?, ?, ?, ?, ?)
        `,
        [purchaseResult.insertId, item.product_id, item.quantity, item.unit_cost, lineTotal],
        connection
      );

      await query(
        `
          UPDATE products
          SET
            stock_quantity = ?,
            average_cost = ?,
            last_cost = ?
          WHERE product_id = ? AND tenant_id = ?
        `,
        [newStock, newAverageCost, item.unit_cost, item.product_id, ctx.state.user.tenantId],
        connection
      );

      await query(
        `
          INSERT INTO inventory_movements (
            tenant_id,
            product_id,
            reference_type,
            reference_id,
            movement_type,
            quantity_change,
            balance_after,
            unit_cost_snapshot,
            notes
          )
          VALUES (?, ?, 'purchase', ?, 'PURCHASE', ?, ?, ?, ?)
        `,
        [
          ctx.state.user.tenantId,
          item.product_id,
          purchaseResult.insertId,
          item.quantity,
          newStock,
          item.unit_cost,
          `Compra registrada con proveedor ${payload.supplier_name}`,
        ],
        connection
      );
    }

    return purchaseResult.insertId;
  });

  const purchase = await getPurchaseById(ctx.state.user.tenantId, result);
  success(ctx, purchase);
};
