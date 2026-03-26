const { success } = require('../system/response');
const { getCategories } = require('./shared');

module.exports = async (ctx) => {
  const categories = await getCategories(ctx.state.user.tenantId);
  success(ctx, categories);
};
