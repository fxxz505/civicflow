const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const distDir = path.join(root, 'dist');
const port = 5173;
const host = '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, mimeTypes[ext] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (urlPath === '/' || urlPath === '/index.html') {
    serveFile(res, path.join(distDir, 'index.html'));
    return;
  }

  const publicPath = path.join(root, 'public', urlPath.replace(/^\//, ''));
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    serveFile(res, publicPath);
    return;
  }

  const distPath = path.join(distDir, urlPath.replace(/^\//, ''));
  if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    serveFile(res, distPath);
    return;
  }

  send(res, 404, 'Not found');
});

server.listen(port, host, () => {
  console.log(`CivicFlow static server running at http://${host}:${port}`);
});
