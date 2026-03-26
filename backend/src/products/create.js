const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { createError } = require('../system/errors');
const { validateSchema, Joi } = require('../system/validation');
const { getProductById } = require('./shared');

const schema = Joi.object({
  category_id: Joi.number().integer().allow(null),
  sku: Joi.string().min(3).max(80).required(),
  barcode: Joi.string().max(80).allow('', null),
  name: Joi.string().min(2).max(160).required(),
  description: Joi.string().max(255).allow('', null),
  sale_price: Joi.number().min(0).required(),
  minimum_stock: Joi.number().integer().min(0).required(),
});

module.exports = async (ctx) => {
  const payload = validateSchema(schema, ctx.request.body);

  const duplicateProducts = await query(
    `
      SELECT product_id
      FROM products
      WHERE tenant_id = ? AND sku = ?
      LIMIT 1
    `,
    [ctx.state.user.tenantId, payload.sku]
  );

  if (duplicateProducts[0]) {
    throw createError({
      status: 409,
      errorCode: 'RESOURCE_ALREADY_EXISTS',
      message: 'Ya existe un producto con ese SKU en la tienda.',
      severity: 'warning',
    });
  }

  const insertResult = await query(
    `
      INSERT INTO products (
        tenant_id,
        category_id,
        sku,
        barcode,
        name,
        description,
        sale_price,
        minimum_stock
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      ctx.state.user.tenantId,
      payload.category_id,
      payload.sku,
      payload.barcode || null,
      payload.name,
      payload.description || null,
      payload.sale_price,
      payload.minimum_stock,
    ]
  );

  const createdProduct = await getProductById(ctx.state.user.tenantId, insertResult.insertId);
  success(ctx, createdProduct);
};
