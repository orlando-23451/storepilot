const { hashPassword, verifyPassword } = require('./password');

describe('password utilities', () => {
  test('hashes and verifies the same password', () => {
    const passwordHash = hashPassword('Admin123!');

    expect(passwordHash.startsWith('scrypt$')).toBe(true);
    expect(verifyPassword('Admin123!', passwordHash)).toBe(true);
  });

  test('rejects an invalid password', () => {
    const passwordHash = hashPassword('Admin123!');

    expect(verifyPassword('WrongPassword1!', passwordHash)).toBe(false);
  });
});
