const { query } = require('../system/mysql');
const { success } = require('../system/response');
const { getPagination } = require('../system/pagination');

module.exports = async (ctx) => {
  const pagination = getPagination(ctx.query);
  const filters = ['inventory_movements.tenant_id = ?'];
  const params = [ctx.state.user.tenantId];

  if (ctx.query.product_id) {
    filters.push('inventory_movements.product_id = ?');
    params.push(Number(ctx.query.product_id));
  }

  if (ctx.query.movement_type) {
    filters.push('inventory_movements.movement_type = ?');
    params.push(ctx.query.movement_type.toUpperCase());
  }

  if (ctx.query.start_date) {
    filters.push('DATE(inventory_movements.creation_date) >= DATE(?)');
    params.push(ctx.query.start_date);
  }

  if (ctx.query.end_date) {
    filters.push('DATE(inventory_movements.creation_date) <= DATE(?)');
    params.push(ctx.query.end_date);
  }

  const rows = await query(
    `
      SELECT
        inventory_movements.inventory_movement_id,
        inventory_movements.reference_type,
        inventory_movements.reference_id,
        inventory_movements.movement_type,
        inventory_movements.quantity_change,
        inventory_movements.balance_after,
        inventory_movements.unit_cost_snapshot,
        inventory_movements.notes,
        inventory_movements.creation_date,
        products.name AS product_name,
        products.sku
      FROM inventory_movements
      INNER JOIN products ON products.product_id = inventory_movements.product_id
      WHERE ${filters.join(' AND ')}
      ORDER BY inventory_movements.creation_date DESC
      LIMIT ? OFFSET ?
    `,
    [...params, pagination.pageSize, pagination.offset]
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total FROM inventory_movements WHERE ${filters.join(' AND ')}`,
    params
  );

  success(ctx, rows, {
    page: pagination.page,
    page_size: pagination.pageSize,
    total: countRows[0].total,
  });
};
