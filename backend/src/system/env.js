const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootPath = path.resolve(__dirname, '..', '..', '..');
console.log("🔍 Buscando configuración en:", rootPath);
const environment = process.env.NODE_ENV || 'dev';
const environmentFileMap = {
  dev: '.env.dev',
  qa: '.env.qa',
  production: '.env.production',
};

const candidateFiles = [
  path.join(rootPath, '.env'),
  path.join(rootPath, environmentFileMap[environment] || '.env.dev'),
];

candidateFiles.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
});

if (process.env.NODE_ENV === 'production' && process.env.DEBUGGING === 'true') {
  throw new Error('DEBUGGING=true no está permitido en producción.');
}

const config = {
  appName: process.env.APP_NAME || 'StorePilot',
  environment,
  port: Number(process.env.PORT || 4000),
  publicAppUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'change_this_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
  swaggerUsername: process.env.SWAGGER_USERNAME || 'docs_user',
  swaggerPassword: process.env.SWAGGER_PASSWORD || 'change_this_docs_password',
  debugging: process.env.DEBUGGING === 'true',
  defaultTargetMarginPercent: Number(process.env.DEFAULT_TARGET_MARGIN_PERCENT || 30),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'storepilot',
    user: process.env.DB_USER || 'storepilot_app',
    password: process.env.DB_PASSWORD || 'change_this_db_password',
    ssl: process.env.DB_SSL === 'true',
    caFile: process.env.DB_CA_FILE || '',
  },
};

module.exports = config;
