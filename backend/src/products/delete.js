const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getProductById } = require('./shared');

module.exports = async (ctx) => {
  const productId = Number(ctx.params.productId);
  await getProductById(ctx.state.user.tenantId, productId);

  await query('UPDATE products SET active = 0 WHERE product_id = ? AND tenant_id = ?', [
    productId,
    ctx.state.user.tenantId,
  ]);

  success(ctx, { product_id: productId, active: false });
};
