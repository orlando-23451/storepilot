const { query, withTransaction } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');
const { getSaleById } = require('./shared');

const itemSchema = Joi.object({
  product_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  unit_price: Joi.number().min(0.01).required(),
});

const schema = Joi.object({
  sale_date: Joi.date().required(),
  payment_method: Joi.string()
    .valid('efectivo', 'terminal_externa', 'transferencia', 'external')
    .required(),
  notes: Joi.string().max(255).allow('', null),
  items: Joi.array().items(itemSchema).min(1).required(),
});

module.exports = async (ctx) => {
  const payload = validateSchema(schema, ctx.request.body);
  const totalAmount = payload.items.reduce(
    (accumulator, item) => accumulator + item.quantity * item.unit_price,
    0
  );

  const saleId = await withTransaction(async (connection) => {
    const saleNumberRows = await query(
      `
        SELECT COUNT(*) + 1001 AS next_number
        FROM sales
        WHERE tenant_id = ?
      `,
      [ctx.state.user.tenantId],
      connection
    );

    const saleNumber = `SALE-${saleNumberRows[0].next_number}`;

    const saleResult = await query(
      `
        INSERT INTO sales (
          tenant_id,
          store_id,
          sale_number,
          sale_date,
          payment_method,
          total_amount,
          notes,
          created_by_user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ctx.state.user.tenantId,
        ctx.state.user.storeId,
        saleNumber,
        payload.sale_date,
        payload.payment_method,
        Number(totalAmount.toFixed(2)),
        payload.notes || null,
        ctx.state.user.userId,
      ],
      connection
    );

    for (const item of payload.items) {
      const productRows = await query(
        `
          SELECT product_id, name, stock_quantity, average_cost, active
          FROM products
          WHERE product_id = ? AND tenant_id = ?
          LIMIT 1
        `,
        [item.product_id, ctx.state.user.tenantId],
        connection
      );

      const product = productRows[0];
      if (!product || !product.active) {
        throw createError({
          status: 404,
          errorCode: 'RESOURCE_NOT_FOUND',
          message: 'Uno de los productos de la venta no existe o está inactivo.',
        });
      }

      if (Number(product.stock_quantity) < item.quantity) {
        throw createError({
          status: 409,
          errorCode: 'BUSINESS_RULE_VIOLATION',
          message: `No hay inventario suficiente para ${product.name}.`,
          severity: 'warning',
        });
      }

      const newStock = Number(product.stock_quantity) - item.quantity;
      const lineTotal = Number((item.quantity * item.unit_price).toFixed(2));

      await query(
        `
          INSERT INTO sale_items (
            sale_id,
            product_id,
            quantity,
            unit_price,
            unit_cost_snapshot,
            line_total
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          saleResult.insertId,
          item.product_id,
          item.quantity,
          item.unit_price,
          product.average_cost,
          lineTotal,
        ],
        connection
      );

      await query(
        `
          UPDATE products
          SET stock_quantity = ?
          WHERE product_id = ? AND tenant_id = ?
        `,
        [newStock, item.product_id, ctx.state.user.tenantId],
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
          VALUES (?, ?, 'sale', ?, 'SALE', ?, ?, ?, ?)
        `,
        [
          ctx.state.user.tenantId,
          item.product_id,
          saleResult.insertId,
          item.quantity * -1,
          newStock,
          product.average_cost,
          `Venta registrada por ${ctx.state.user.fullName}`,
        ],
        connection
      );
    }

    return saleResult.insertId;
  });

  const sale = await getSaleById(ctx.state.user.tenantId, saleId);
  success(ctx, sale);
};
