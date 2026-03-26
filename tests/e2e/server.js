const http = require('http');
const fs = require('fs');
const path = require('path');

const buildPath = path.resolve(__dirname, '..', '..', 'frontend', 'build');
const port = 3000;

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const resolvedPath = path.join(buildPath, requestPath);
  const safePath = resolvedPath.startsWith(buildPath) ? resolvedPath : path.join(buildPath, 'index.html');
  const filePath = fs.existsSync(safePath) && fs.statSync(safePath).isFile()
    ? safePath
    : path.join(buildPath, 'index.html');

  const extension = path.extname(filePath);
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'text/plain',
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static test server listening on http://127.0.0.1:${port}`);
});
