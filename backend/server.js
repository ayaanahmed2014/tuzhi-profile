
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

const ROOT = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(ROOT, 'tuzhicodes.html');
      if (filePath !== fallback && fs.existsSync(fallback)) {
        fs.readFile(fallback, (e2, d2) => {
          if (e2) return send(res, 500, 'Server error');
          send(res, 200, d2, MIME['.html']);
        });
        return;
      }
      return send(res, 404, 'Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method not allowed');
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (urlPath.startsWith('/backend/') || urlPath === '/backend') {
    return send(res, 404, 'Not found');
  }

  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath;

  if (safePath === '/' || safePath === '/index.html') {
    filePath = path.join(ROOT, 'tuzhicodes.html');
  } else if (safePath === '/data.json') {
    filePath = path.join(ROOT, 'data.json');
  } else if (safePath.startsWith('/deco/')) {
    filePath = path.join(ROOT, safePath.slice(1));
    if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  } else {
    const candidate = path.join(ROOT, safePath.slice(1));
    if (!candidate.startsWith(ROOT)) return send(res, 403, 'Forbidden');
    if (safePath.includes('.') && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      filePath = candidate;
    } else {
      filePath = path.join(ROOT, 'tuzhicodes.html');
    }
  }

  if (req.method === 'HEAD') {
    if (!fs.existsSync(filePath)) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    return res.end();
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`TuZhi local: http://localhost:${PORT}`);
  console.log('Stop: Ctrl + C');
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Try another port: PORT=8001 node backend/server.js`);
  } else {
    console.error(e);
  }
});
