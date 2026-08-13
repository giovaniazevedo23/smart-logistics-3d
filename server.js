import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Auto-build step for Render if dist/ does not exist
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('[TransLog 3D Server] "dist" folder not found. Running build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[TransLog 3D Server] Build successful.');
  } catch (err) {
    console.error('[TransLog 3D Server] Build failed:', err);
  }
}

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  let filePath = path.join(distPath, reqPath);

  // Fallback to index.html for SPA routing
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distPath, 'index.html');
  }

  // If index.html still doesn't exist, fallback to root error
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Error: dist/index.html not found. Build failed.');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'text/html; charset=UTF-8';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Internal Server Error: ${err.code}`);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'X-Powered-By': 'TransLog-3D-Engine'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 TransLog 3D em execução na porta ${PORT}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
});
