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
  active: Joi.boolean().required(),
});

module.exports = async (ctx) => {
  const productId = Number(ctx.params.productId);
  const payload = validateSchema(schema, ctx.request.body);
  await getProductById(ctx.state.user.tenantId, productId);

  const duplicateProducts = await query(
    `
      SELECT product_id
      FROM products
      WHERE tenant_id = ? AND sku = ? AND product_id <> ?
      LIMIT 1
    `,
    [ctx.state.user.tenantId, payload.sku, productId]
  );

  if (duplicateProducts[0]) {
    throw createError({
      status: 409,
      errorCode: 'RESOURCE_ALREADY_EXISTS',
      message: 'Ya existe un producto con ese SKU en la tienda.',
      severity: 'warning',
    });
  }

  await query(
    `
      UPDATE products
      SET
        category_id = ?,
        sku = ?,
        barcode = ?,
        name = ?,
        description = ?,
        sale_price = ?,
        minimum_stock = ?,
        active = ?
      WHERE product_id = ? AND tenant_id = ?
    `,
    [
      payload.category_id,
      payload.sku,
      payload.barcode || null,
      payload.name,
      payload.description || null,
      payload.sale_price,
      payload.minimum_stock,
      payload.active ? 1 : 0,
      productId,
      ctx.state.user.tenantId,
    ]
  );

  const updatedProduct = await getProductById(ctx.state.user.tenantId, productId);
  success(ctx, updatedProduct);
};
