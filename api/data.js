// Vercel Serverless Function — Supabase persistent storage
const SUPABASE_URL = 'https://wjyzsoqmdqqojjncgqdo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0vDN7twxdfB183W5gHzorg_Gi8uHP9t';

async function dbGet(key) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/lab_data?key=eq.${encodeURIComponent(key)}&select=value`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  const rows = await r.json();
  return rows.length > 0 ? rows[0].value : null;
}

async function dbSet(key, value) {
  await fetch(`${SUPABASE_URL}/rest/v1/lab_data`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() })
  });
}

async function dbDelete(key) {
  await fetch(`${SUPABASE_URL}/rest/v1/lab_data?key=eq.${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  let action = req.query.action || '';
  const id = req.query.id;
  const method = req.method;

  // Alias mapping
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

  try {
    // ── Config ──
    if (action === 'getConfig') {
      const cfg = await dbGet('config');
      return res.json(cfg || { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 });
    }
    if (action === 'setConfig') {
      const current = (await dbGet('config')) || { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 };
      Object.assign(current, body);
      await dbSet('config', current);
      return res.json(current);
    }

    // ── Groups ──
    if (action === 'getGroup') {
      const d = await dbGet('group_' + id);
      return res.json(d || { attempts: [], attemptsUsed: 0, success: false });
    }
    if (action === 'setGroup') {
      if (body.id && body.data) {
        await dbSet('group_' + body.id, body.data);
      }
      return res.json({ ok: true });
    }
    if (action === 'getAllGroups') {
      // Fetch all group_* keys
      const r = await fetch(`${SUPABASE_URL}/rest/v1/lab_data?key=like.group_%&select=key,value`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const rows = await r.json();
      const groups = {};
      (rows || []).forEach(row => {
        const gid = row.key.replace('group_', '');
        groups[gid] = row.value;
      });
      return res.json({ groups, lastUpdate: Date.now() });
    }
    if (action === 'resetGroup') {
      if (body.all) {
        // Delete all group_* keys
        await fetch(`${SUPABASE_URL}/rest/v1/lab_data?key=like.group_%`, {
          method: 'DELETE',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
      } else if (body.id) {
        await dbDelete('group_' + body.id);
      }
      return res.json({ ok: true });
    }

    // ── Questions ──
    if (action === 'getQuestions') {
      const qs = await dbGet('questions');
      return res.json(qs || []);
    }
    if (action === 'addQuestion') {
      if (body.content) {
        const qs = (await dbGet('questions')) || [];
        qs.push({
          name: body.name || '匿名', sid: body.sid || '', group: body.group || '',
          content: body.content, time: Date.now(),
          timeStr: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
        });
        await dbSet('questions', qs);
      }
      return res.json({ ok: true });
    }
    if (action === 'clearQuestions') {
      await dbSet('questions', []);
      return res.json({ ok: true });
    }

    // ── Ping ──
    if (action === 'ping') return res.json({ ok: true, time: Date.now() });

    res.status(400).json({ error: 'Unknown action: ' + action });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
