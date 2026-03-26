const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./env');
const { createError } = require('./errors');

let pool;

const getSslOptions = () => {
  if (!config.database.ssl) {
    return undefined;
  }

  if (!config.database.caFile) {
    return {};
  }

  return {
    ca: fs.readFileSync(path.resolve(__dirname, '..', '..', config.database.caFile)),
  };
};

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true,
      ssl: getSslOptions(),
    });
  }

  return pool;
};

const query = async (sql, params = [], connection = null) => {
  try {
    const executor = connection || getPool();
    const [rows] = await executor.execute(sql, params);
    return rows;
  } catch (error) {
    console.log("❌ ERROR TÉCNICO DE MYSQL:");
    console.error(error);
    throw createError({
      status: 500,
      errorCode: 'DATABASE_ERROR',
      message: 'No fue posible completar la operación en este momento.',
    });
  }
};

const withTransaction = async (callback) => {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPool,
  query,
  withTransaction,
};
