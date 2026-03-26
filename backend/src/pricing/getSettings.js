const { query } = require('../system/mysql');
const { success } = require('../system/response');

module.exports = async (ctx) => {
  const rows = await query(
    `
      SELECT store_id, name, target_margin_percent, currency_code
      FROM stores
      WHERE store_id = ? AND tenant_id = ? AND active = 1
      LIMIT 1
    `,
    [ctx.state.user.storeId, ctx.state.user.tenantId]
  );

  success(ctx, rows[0]);
};
