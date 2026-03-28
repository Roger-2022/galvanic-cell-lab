// Vercel Serverless Function — data sync API
// Uses in-memory store (resets on cold start, fine for a single class session)
// For persistence across deploys, could use Vercel KV or external DB

// Global in-memory store (persists across warm invocations)
if (!global._store) {
  global._store = {
    groups: {},
    questions: [],
    config: { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 },
    lastUpdate: Date.now()
  };
}
const store = global._store;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { action, id } = req.query;

  // ── Groups ──
  if (action === 'getGroup') {
    return res.json(store.groups[id] || { attempts: [], attemptsUsed: 0, success: false });
  }

  if (action === 'setGroup' && req.method === 'POST') {
    const body = req.body;
    if (body && body.id && body.data) {
      store.groups[body.id] = body.data;
      store.lastUpdate = Date.now();
    }
    return res.json({ ok: true });
  }

  if (action === 'getAllGroups') {
    return res.json({ groups: store.groups, lastUpdate: store.lastUpdate });
  }

  if (action === 'resetGroup' && req.method === 'POST') {
    const body = req.body;
    if (body && body.all) {
      store.groups = {};
    } else if (body && body.id) {
      delete store.groups[body.id];
    }
    store.lastUpdate = Date.now();
    return res.json({ ok: true });
  }

  // ── Questions ──
  if (action === 'getQuestions') {
    return res.json(store.questions);
  }

  if (action === 'addQuestion' && req.method === 'POST') {
    const body = req.body;
    if (body && body.content) {
      store.questions.push({
        name: body.name || '匿名',
        sid: body.sid || '',
        group: body.group || '',
        content: body.content,
        time: Date.now(),
        timeStr: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });
      store.lastUpdate = Date.now();
    }
    return res.json({ ok: true, count: store.questions.length });
  }

  if (action === 'clearQuestions' && req.method === 'POST') {
    store.questions = [];
    store.lastUpdate = Date.now();
    return res.json({ ok: true });
  }

  // ── Config ──
  if (action === 'getConfig') {
    return res.json(store.config);
  }

  if (action === 'setConfig' && req.method === 'POST') {
    Object.assign(store.config, req.body || {});
    store.lastUpdate = Date.now();
    return res.json(store.config);
  }

  // ── Ping (for server detection) ──
  if (action === 'ping') {
    return res.json({ ok: true, time: Date.now() });
  }

  res.status(400).json({ error: 'Unknown action' });
};
