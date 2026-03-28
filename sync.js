/**
 * 数据同步层 — 统一 API 接口
 * 自动检测后端类型：Vercel serverless / 本地 Node server / 纯 localStorage
 * 所有页面引入此文件即可
 */
window.DataSync = (function() {
  let mode = 'local'; // 'local' | 'server' | 'vercel'
  const BASE = window.location.origin;

  // Detect backend
  async function init() {
    try {
      // Try Vercel-style API first
      let r = await fetch(BASE + '/api/data?action=ping', { method: 'GET' });
      if (r.ok) { mode = 'vercel'; console.log('[Sync] Vercel backend detected'); return; }
    } catch {}
    try {
      // Try Node server API
      let r = await fetch(BASE + '/api/config', { method: 'GET' });
      if (r.ok) { mode = 'server'; console.log('[Sync] Node server detected'); return; }
    } catch {}
    console.log('[Sync] No backend, using localStorage only');
  }

  function apiUrl(action) {
    if (mode === 'vercel') return BASE + '/api/data?action=' + action;
    if (mode === 'server') {
      // Map to Node server endpoints
      const map = {
        'getGroup': '/api/group',
        'setGroup': '/api/group',
        'getAllGroups': '/api/groups',
        'resetGroup': '/api/group/reset',
        'getQuestions': '/api/questions',
        'addQuestion': '/api/questions',
        'clearQuestions': '/api/questions',
        'getConfig': '/api/config',
        'setConfig': '/api/config',
        'ping': '/api/config',
      };
      return BASE + (map[action] || '/api/' + action);
    }
    return null;
  }

  async function post(action, body) {
    const url = apiUrl(action);
    if (!url) return null;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return r.ok ? await r.json() : null;
    } catch { return null; }
  }

  async function get(action, params) {
    let url = apiUrl(action);
    if (!url) return null;
    if (params) {
      const sep = url.includes('?') ? '&' : '?';
      url += sep + new URLSearchParams(params).toString();
    }
    try {
      const r = await fetch(url);
      return r.ok ? await r.json() : null;
    } catch { return null; }
  }

  async function del(action) {
    const url = apiUrl(action);
    if (!url) return null;
    try {
      const r = await fetch(url, { method: mode === 'vercel' ? 'POST' : 'DELETE' });
      return r.ok ? await r.json() : null;
    } catch { return null; }
  }

  return {
    init,
    getMode: () => mode,
    isOnline: () => mode !== 'local',

    // Group data
    async getGroup(id) {
      if (mode !== 'local') {
        const d = await get('getGroup', { id });
        if (d && d.attemptsUsed > 0) {
          localStorage.setItem('galvanic_lab_group_' + id, JSON.stringify(d));
          return d;
        }
      }
      const local = localStorage.getItem('galvanic_lab_group_' + id);
      return local ? JSON.parse(local) : { attempts: [], attemptsUsed: 0, success: false };
    },

    async saveGroup(id, data) {
      localStorage.setItem('galvanic_lab_group_' + id, JSON.stringify(data));
      if (mode !== 'local') await post('setGroup', { id, data });
    },

    async getAllGroups() {
      if (mode !== 'local') {
        const d = await get('getAllGroups');
        return d ? d.groups || {} : {};
      }
      return {};
    },

    async resetGroup(id) {
      localStorage.removeItem('galvanic_lab_group_' + id);
      if (mode !== 'local') await post('resetGroup', { id });
    },

    async resetAllGroups(totalGroups) {
      for (let i = 1; i <= (totalGroups || 30); i++) {
        localStorage.removeItem('galvanic_lab_group_' + i);
      }
      if (mode !== 'local') await post('resetGroup', { all: true });
    },

    // Questions
    async getQuestions() {
      if (mode !== 'local') {
        const d = await get('getQuestions');
        if (d && d.length > 0) {
          localStorage.setItem('galvanic_questions', JSON.stringify(d));
          return d;
        }
      }
      return JSON.parse(localStorage.getItem('galvanic_questions') || '[]');
    },

    async addQuestion(qData) {
      const qs = JSON.parse(localStorage.getItem('galvanic_questions') || '[]');
      qs.push(qData);
      localStorage.setItem('galvanic_questions', JSON.stringify(qs));
      if (mode !== 'local') await post('addQuestion', qData);
    },

    async clearQuestions() {
      localStorage.removeItem('galvanic_questions');
      if (mode !== 'local') await del('clearQuestions');
    },

    // Config
    async getConfig() {
      if (mode !== 'local') {
        const d = await get('getConfig');
        if (d) return d;
      }
      const local = localStorage.getItem('galvanic_lab_config');
      return local ? JSON.parse(local) : { maxAttempts: 5, cooldownSeconds: 30, totalGroups: 15 };
    },

    async saveConfig(cfg) {
      localStorage.setItem('galvanic_lab_config', JSON.stringify(cfg));
      if (mode !== 'local') await post('setConfig', cfg);
    }
  };
})();

// Auto-init on load
DataSync.init();
