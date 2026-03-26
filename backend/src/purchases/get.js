const { success } = require('../system/response');
const { getPurchaseById } = require('./shared');

module.exports = async (ctx) => {
  const purchase = await getPurchaseById(ctx.state.user.tenantId, Number(ctx.params.purchaseId));
  success(ctx, purchase);
};
