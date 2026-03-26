const app = require('./app');

describe('StorePilot API baseline', () => {
  let server;
  let baseUrl;

  beforeAll((done) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('responds with health status', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
  });

  test('protects private routes when there is no token', async () => {
    const response = await fetch(`${baseUrl}/api/v1/products`);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error_code).toBe('AUTHENTICATION_REQUIRED');
  });

  test('protects swagger with basic auth when enabled', async () => {
    const response = await fetch(`${baseUrl}/swagger.json`);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error_code).toBe('AUTHENTICATION_REQUIRED');
  });
});
