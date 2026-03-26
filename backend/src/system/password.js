const crypto = require('crypto');

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
};

const verifyPassword = (password, passwordHash) => {
  if (!passwordHash || !passwordHash.startsWith('scrypt$')) {
    return false;
  }

  const [, salt, derived] = passwordHash.split('$');
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(derived, 'hex'));
};

module.exports = {
  hashPassword,
  verifyPassword,
};
