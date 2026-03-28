/**
 * EdgeOne Pages Node Function
 * 处理所有 /api/* 的数据同步请求
 */

// In-memory store (persists across warm invocations)
if (!global._store) {
  global._store = {
    groups: {},
    questions: [],
    config: { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 },
    lastUpdate: Date.now()
  };
}
const store = global._store;

export async function onRequest({ request, params }) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  const method = request.method;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });

  let body = {};
  if (method === 'POST' || method === 'DELETE') {
    try { body = await request.json(); } catch {}
  }

  const id = url.searchParams.get('id');

  // ── Routes ──
  // GET /api/config
  if (path === 'config' && method === 'GET') {
    return json(store.config);
  }
  // POST /api/config
  if (path === 'config' && method === 'POST') {
    Object.assign(store.config, body);
    store.lastUpdate = Date.now();
    return json(store.config);
  }

  // GET /api/group?id=1
  if (path === 'group' && method === 'GET') {
    return json(store.groups[id] || { attempts: [], attemptsUsed: 0, success: false });
  }
  // POST /api/group  { id, data }
  if (path === 'group' && method === 'POST') {
    if (body.id && body.data) {
      store.groups[body.id] = body.data;
      store.lastUpdate = Date.now();
    }
    return json({ ok: true });
  }

  // GET /api/groups
  if (path === 'groups' && method === 'GET') {
    return json({ groups: store.groups, lastUpdate: store.lastUpdate });
  }

  // POST /api/group/reset  { id } or { all: true }
  if ((path === 'group/reset' || path === 'group-reset') && method === 'POST') {
    if (body.all) store.groups = {};
    else if (body.id) delete store.groups[body.id];
    store.lastUpdate = Date.now();
    return json({ ok: true });
  }

  // GET /api/questions
  if (path === 'questions' && method === 'GET') {
    return json(store.questions);
  }
  // POST /api/questions
  if (path === 'questions' && method === 'POST') {
    if (body.content) {
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
    return json({ ok: true, count: store.questions.length });
  }
  // DELETE /api/questions
  if (path === 'questions' && method === 'DELETE') {
    store.questions = [];
    store.lastUpdate = Date.now();
    return json({ ok: true });
  }

  // Ping (for server detection)
  if (path === 'ping') {
    return json({ ok: true, time: Date.now() });
  }

  return json({ error: 'Unknown endpoint: ' + path }, 404);
}
