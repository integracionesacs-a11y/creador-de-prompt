const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg'
};

function serveFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — Archivo no encontrado');
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      serveFile(req, res, indexPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Manejar favicon automático
  if (reqPath === '/favicon.ico') {
    const favPath = path.join(__dirname, 'favicon.ico');
    if (!fs.existsSync(favPath)) {
      res.writeHead(204);
      res.end();
      return;
    }
  }

  // Normalizar ruta
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  serveFile(req, res, filePath);
});

function startServer(port) {
  server.listen(port, () => {
    console.log('');
    console.log('\x1b[36m==========================================================\x1b[0m');
    console.log('\x1b[32m🚀 A\\DAN SOLUTIONS — SERVIDOR LOCAL ACTIVO\x1b[0m');
    console.log('\x1b[36m==========================================================\x1b[0m');
    console.log(`🌐 Hub Central:          \x1b[33mhttp://localhost:${port}/\x1b[0m`);
    console.log(`🎬 Creador de Prompts:   \x1b[33mhttp://localhost:${port}/prompts/\x1b[0m`);
    console.log('\x1b[36m==========================================================\x1b[0m');
    console.log('Presiona Ctrl + C para detener el servidor.\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Puerto ${port} ocupado, intentando con ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Error al iniciar el servidor:', err);
    }
  });
}

startServer(DEFAULT_PORT);
