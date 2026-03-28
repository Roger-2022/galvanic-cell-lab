/**
 * 原电池探究平台 — 轻量同步服务器
 *
 * 用法: node server.js
 * 然后所有设备通过 http://<教师电脑IP>:8080 访问
 *
 * 功能:
 * - 静态文件服务（HTML/CSS/JS）
 * - /api/sync — 各组实验数据同步
 * - /api/questions — 学生提问同步
 * - 所有数据存储在内存中，教师端实时可见
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const STATIC_DIR = __dirname;

// ── In-memory data store ──
const store = {
  groups: {},       // { "1": { attempts: [], attemptsUsed: 0, success: false }, ... }
  questions: [],    // [{ name, sid, group, content, time, timeStr }, ...]
  config: { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 },
  lastUpdate: Date.now()
};

// ── MIME types ──
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ── API: Group data ──
  if (pathname === '/api/group' && req.method === 'GET') {
    const id = parsed.query.id;
    sendJSON(res, store.groups[id] || { attempts: [], attemptsUsed: 0, success: false });
    return;
  }

  if (pathname === '/api/group' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.id && body.data) {
      store.groups[body.id] = body.data;
      store.lastUpdate = Date.now();
    }
    sendJSON(res, { ok: true });
    return;
  }

  if (pathname === '/api/group/reset' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.id) {
      delete store.groups[body.id];
    } else if (body.all) {
      store.groups = {};
    }
    store.lastUpdate = Date.now();
    sendJSON(res, { ok: true });
    return;
  }

  // ── API: All groups (for dashboard) ──
  if (pathname === '/api/groups' && req.method === 'GET') {
    sendJSON(res, { groups: store.groups, lastUpdate: store.lastUpdate });
    return;
  }

  // ── API: Questions ──
  if (pathname === '/api/questions' && req.method === 'GET') {
    sendJSON(res, store.questions);
    return;
  }

  if (pathname === '/api/questions' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.content) {
      store.questions.push({
        name: body.name || '匿名',
        sid: body.sid || '',
        group: body.group || '',
        content: body.content,
        time: Date.now(),
        timeStr: new Date().toLocaleString('zh-CN')
      });
      store.lastUpdate = Date.now();
    }
    sendJSON(res, { ok: true, count: store.questions.length });
    return;
  }

  if (pathname === '/api/questions' && req.method === 'DELETE') {
    store.questions = [];
    store.lastUpdate = Date.now();
    sendJSON(res, { ok: true });
    return;
  }

  // ── API: Config ──
  if (pathname === '/api/config' && req.method === 'GET') {
    sendJSON(res, store.config);
    return;
  }

  if (pathname === '/api/config' && req.method === 'POST') {
    const body = await readBody(req);
    Object.assign(store.config, body);
    store.lastUpdate = Date.now();
    sendJSON(res, store.config);
    return;
  }

  // ── Static files ──
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(STATIC_DIR, filePath);

  // Security: prevent path traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  // Get local IP
  const nets = require('os').networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║     原电池探究平台 · 同步服务器           ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log(`  ║  本机访问: http://localhost:${PORT}          ║`);
  console.log(`  ║  局域网:   http://${localIP}:${PORT}     ║`);
  console.log('  ║                                          ║');
  console.log('  ║  学生iPad扫码或输入局域网地址即可访问    ║');
  console.log('  ║  所有数据实时同步到教师端                ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
