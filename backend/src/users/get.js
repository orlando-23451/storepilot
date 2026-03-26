const { success } = require('../system/response');
const { getUserById } = require('./shared');

module.exports = async (ctx) => {
  const user = await getUserById(ctx.state.user.tenantId, Number(ctx.params.userId));
  success(ctx, user);
};
