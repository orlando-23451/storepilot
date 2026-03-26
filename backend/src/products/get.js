const { success } = require('../system/response');
const { getProductById } = require('./shared');

module.exports = async (ctx) => {
  const product = await getProductById(ctx.state.user.tenantId, Number(ctx.params.productId));

  if (ctx.state.user.roleCode === 'cashier') {
    delete product.average_cost;
    delete product.last_cost;
  }

  success(ctx, product);
};
