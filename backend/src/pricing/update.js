const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { validateSchema, Joi } = require('../system/validation');

const schema = Joi.object({
  target_margin_percent: Joi.number().min(5).max(75).required(),
});

module.exports = async (ctx) => {
  const payload = validateSchema(schema, ctx.request.body);

  await query(
    `
      UPDATE stores
      SET target_margin_percent = ?
      WHERE store_id = ? AND tenant_id = ?
    `,
    [payload.target_margin_percent, ctx.state.user.storeId, ctx.state.user.tenantId]
  );

  success(ctx, {
    store_id: ctx.state.user.storeId,
    target_margin_percent: payload.target_margin_percent,
  });
};
