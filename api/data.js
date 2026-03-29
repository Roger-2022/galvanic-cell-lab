// Vercel Serverless Function — data sync API
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  // Support both ?action=xxx and path-based routing via rewrite
  let action = req.query.action || '';
  const id = req.query.id;
  const method = req.method;

  // Alias mapping: node server paths → action names
  const aliases = {
    'config': method === 'POST' ? 'setConfig' : 'getConfig',
    'group': method === 'POST' ? 'setGroup' : 'getGroup',
    'groups': 'getAllGroups',
    'group/reset': 'resetGroup',
    'group-reset': 'resetGroup',
    'questions': method === 'DELETE' ? 'clearQuestions' : (method === 'POST' ? 'addQuestion' : 'getQuestions'),
  };
  if (aliases[action]) action = aliases[action];

  let body = {};
  if (method === 'POST' || method === 'DELETE') {
    try { body = req.body || {}; } catch { body = {}; }
  }

  // ── Config ──
  if (action === 'getConfig') return res.json(store.config);
  if (action === 'setConfig') {
    Object.assign(store.config, body);
    store.lastUpdate = Date.now();
    return res.json(store.config);
  }

  // ── Groups ──
  if (action === 'getGroup') return res.json(store.groups[id] || { attempts: [], attemptsUsed: 0, success: false });
  if (action === 'setGroup') {
    if (body.id && body.data) { store.groups[body.id] = body.data; store.lastUpdate = Date.now(); }
    return res.json({ ok: true });
  }
  if (action === 'getAllGroups') return res.json({ groups: store.groups, lastUpdate: store.lastUpdate });
  if (action === 'resetGroup') {
    if (body.all) store.groups = {};
    else if (body.id) delete store.groups[body.id];
    store.lastUpdate = Date.now();
    return res.json({ ok: true });
  }

  // ── Questions ──
  if (action === 'getQuestions') return res.json(store.questions);
  if (action === 'addQuestion') {
    if (body.content) {
      store.questions.push({
        name: body.name || '匿名', sid: body.sid || '', group: body.group || '',
        content: body.content, time: Date.now(),
        timeStr: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });
      store.lastUpdate = Date.now();
    }
    return res.json({ ok: true, count: store.questions.length });
  }
  if (action === 'clearQuestions') {
    store.questions = [];
    store.lastUpdate = Date.now();
    return res.json({ ok: true });
  }

  // ── Ping ──
  if (action === 'ping') return res.json({ ok: true, time: Date.now() });

  res.status(400).json({ error: 'Unknown action: ' + action });
};
