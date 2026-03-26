const { success } = require('../system/response');
const { getSaleById } = require('./shared');

module.exports = async (ctx) => {
  const sale = await getSaleById(ctx.state.user.tenantId, Number(ctx.params.saleId));
  success(ctx, sale);
};
