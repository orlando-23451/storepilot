const { query } = require('../system/mysql');
const { createError } = require('../system/errors');

const getProductById = async (tenantId, productId) => {
  const rows = await query(
    `
      SELECT
        products.product_id,
        products.tenant_id,
        products.category_id,
        categories.name AS category_name,
        products.sku,
        products.barcode,
        products.name,
        products.description,
        products.sale_price,
        products.average_cost,
        products.last_cost,
        products.stock_quantity,
        products.minimum_stock,
        products.active,
        products.creation_date,
        products.last_update_date
      FROM products
      LEFT JOIN categories ON categories.category_id = products.category_id
      WHERE products.product_id = ?
        AND products.tenant_id = ?
      LIMIT 1
    `,
    [productId, tenantId]
  );

  const product = rows[0];
  if (!product) {
    throw createError({
      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
      message: 'No fue posible encontrar el producto solicitado.',
    });
  }

  return product;
};

const getCategories = async (tenantId) =>
  query(
    `
      SELECT category_id, name
      FROM categories
      WHERE tenant_id = ? AND active = 1
      ORDER BY name ASC
    `,
    [tenantId]
  );

module.exports = {
  getProductById,
  getCategories,
};
