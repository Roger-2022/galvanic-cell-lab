/**
 * 移动端适配 + 横屏提示
 *
 * 修复策略：
 * 1. 全局基础规则（不依赖媒体查询）：flex-wrap、overflow-wrap、max-width 安全限制
 * 2. 平板（≤1200px）、小平板（≤900px）、手机横屏（高度≤450px）三档响应式
 * 3. 2D 页面用缩写类名 .ds/.df/.dk/.hl，3D 页面用全名 .detail-section 等，两套都覆盖
 */
(function() {
  // Fix viewport meta
  var vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.content = 'width=device-width,initial-scale=1.0,minimum-scale=1,maximum-scale=3,viewport-fit=cover';

  var s = document.createElement('style');
  s.textContent =
    // ── Global base rules (no media query) ──
    // CRITICAL: prevent ANY horizontal overflow at root level
    'html{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}' +
    'body{width:100%!important;max-width:100vw!important;overflow-x:hidden!important;height:100dvh;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);overflow-wrap:break-word;word-break:break-word;margin:0!important;}' +
    '*{box-sizing:border-box;}' +
    // Constrain all top-level containers
    '.app{height:100dvh!important;width:100%!important;max-width:100vw!important;overflow-x:hidden!important;}' +
    '#labScreen,.lab-main,.topbar,.lab-topbar{max-width:100vw!important;}' +
    // 2D diagram containers must not exceed viewport
    '.diagram-container{max-width:100vw!important;}' +
    // Topbar always allows wrapping
    '.topbar,.lab-topbar{flex-wrap:wrap;}' +
    '.topbar-left,.lab-topbar-left{min-width:0;flex-shrink:1;}' +
    '.topbar-controls{flex-wrap:wrap;flex-shrink:1;min-width:0;}' +
    '.ctrl-btn{white-space:nowrap;}' +
    // Detail panel: fluid width with safety cap
    '.detail-panel{max-width:calc(100vw - 40px)!important;overflow-wrap:break-word;}' +
    // Lab panels text wrapping
    '.history-panel,.history-choices,.history-feedback,.material-tray{overflow-wrap:break-word;}' +
    // Step nav / mode bar: respect safe area
    '.step-nav,.mode-bar{bottom:max(1.5rem,env(safe-area-inset-bottom))!important;}' +

    // ── Tablet / medium screens (max-width 1200px) ──
    // NOTE: removed orientation:landscape so portrait tablets also get fixes
    '@media screen and (max-width:1200px){' +
      // CRITICAL: let topbar row expand when buttons wrap
      '.app{grid-template-rows:auto 1fr!important;}' +
      // Topbar
      '.topbar{height:auto!important;min-height:44px;padding:0.3rem 0.8rem!important;gap:0.3rem;}' +
      '.topbar-controls{gap:0.3rem!important;}' +
      '.ctrl-btn{padding:0.3rem 0.6rem!important;font-size:0.68rem!important;}' +
      '.topbar-title{font-size:0.85rem!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;}' +
      '.topbar-badge{font-size:0.55rem!important;}' +
      '.back-btn{font-size:0.7rem!important;padding:0.2rem 0.4rem!important;}' +
      // Lab topbar
      '.lab-topbar{height:auto!important;min-height:44px;padding:0.3rem 0.8rem!important;}' +
      '.lab-topbar-left{gap:0.5rem!important;}' +
      '.lab-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;}' +
      '.lab-stats{flex-shrink:0;gap:0.6rem!important;}' +
      '.lab-stats .stat-item{font-size:0.72rem!important;}' +
      // Lab grid: narrower side panels
      '.lab-main{grid-template-columns:minmax(130px,17vw) 1fr minmax(150px,19vw)!important;}' +
      '.material-tray{padding:0.6rem!important;}' +
      '.history-panel{padding:0.6rem!important;overflow-wrap:break-word!important;word-break:break-word!important;}' +
      '.history-choices,.history-feedback{font-size:0.7rem!important;}' +
      '.task-card{padding:0.5rem!important;}' +
      '.task-card p{font-size:0.72rem!important;}' +
      '.mat-icon{width:26px!important;height:26px!important;font-size:0.6rem!important;}' +
      '.mat-name{font-size:0.7rem!important;}' +
      '.material-item{padding:0.35rem 0.5rem!important;gap:0.4rem!important;}' +
      // Question modal safety
      '#questionModal>div{max-width:calc(100vw - 2rem)!important;}' +
      // Result overlay
      '.result-card{max-width:360px!important;padding:1.2rem!important;}' +
      '.result-task-title{font-size:0.8rem!important;}' +
      '.result-task-desc{font-size:0.72rem!important;}' +
      // Model detail panel (3D full class names + 2D abbreviated)
      '.detail-panel{width:clamp(220px,28vw,280px)!important;padding:1rem!important;}' +
      '.detail-title{font-size:0.95rem!important;}' +
      '.detail-section p,.ds p{font-size:0.78rem!important;}' +
      '.detail-formula,.df{font-size:0.9rem!important;}' +
      // Mode bar / step nav
      '.hint-text{display:none!important;}' +
    '}' +

    // ── Small tablet (max-width 900px) ──
    '@media screen and (max-width:900px){' +
      '.app{grid-template-rows:auto 1fr!important;}' +
      '.lab-main{grid-template-columns:minmax(110px,15vw) 1fr minmax(120px,16vw)!important;}' +
      '.material-tray{padding:0.4rem!important;}' +
      '.history-panel{padding:0.4rem!important;font-size:0.65rem!important;}' +
      '.tray-label,.history-title{font-size:0.55rem!important;}' +
      '.task-card p{font-size:0.65rem!important;}' +
      '.reaction{font-size:0.75rem!important;padding:0.4rem!important;}' +
      '.mat-icon{width:22px!important;height:22px!important;font-size:0.55rem!important;}' +
      '.mat-name{font-size:0.62rem!important;}' +
      '.detail-panel{width:clamp(200px,25vw,240px)!important;font-size:0.75rem!important;}' +
      '.detail-section p,.ds p{font-size:0.72rem!important;}' +
      '.detail-formula,.df{font-size:0.85rem!important;padding:0.4rem!important;}' +
      '.detail-section,.ds{padding:0.7rem!important;}' +
      '.ctrl-btn{padding:0.2rem 0.5rem!important;font-size:0.6rem!important;}' +
      '.topbar-title{max-width:160px!important;}' +
    '}' +

    // ── Phone landscape (very short screens) ──
    '@media screen and (max-height:450px) and (orientation:landscape){' +
      '.app{grid-template-rows:auto 1fr!important;}' +
      '.topbar,.lab-topbar{height:32px!important;padding:0 0.5rem!important;}' +
      '.topbar-title,.lab-title{font-size:0.7rem!important;max-width:120px!important;}' +
      '.ctrl-btn,.action-btn{padding:0.15rem 0.4rem!important;font-size:0.55rem!important;}' +
      '.back-btn{font-size:0.55rem!important;}' +
      '.topbar-badge,.lab-group-badge{font-size:0.5rem!important;padding:0.1rem 0.3rem!important;}' +
      '.lab-stats .stat-item{font-size:0.6rem!important;}' +
      '.header{margin-bottom:0.5rem!important;}' +
      '.header h1{font-size:1.1rem!important;}' +
      '.header-label,.header-sub{font-size:0.55rem!important;}' +
      '.header-divider{display:none!important;}' +
      '.cards-grid{gap:0.5rem!important;}' +
      '.card{padding:0.6rem!important;}' +
      '.card-icon{width:28px!important;height:28px!important;margin-bottom:0.3rem!important;}' +
      '.card-title{font-size:0.75rem!important;}' +
      '.card-desc{font-size:0.55rem!important;}' +
      '.card-tag{font-size:0.45rem!important;margin-top:0.3rem!important;padding:0.1rem 0.4rem!important;}' +
      '.footer{font-size:0.45rem!important;}' +
      '.lab-main{grid-template-columns:110px 1fr 120px!important;}' +
      '.material-tray,.history-panel{padding:0.3rem!important;font-size:0.6rem!important;}' +
      '.task-card{padding:0.3rem!important;}' +
      '.task-card p{font-size:0.55rem!important;}' +
      '.tray-label,.history-title{font-size:0.5rem!important;}' +
      '.material-item{padding:0.2rem 0.3rem!important;}' +
      '.mat-icon{width:22px!important;height:22px!important;font-size:0.55rem!important;}' +
      '.mat-name{font-size:0.6rem!important;}' +
      '#qFabWrapper{bottom:0.3rem!important;right:0.3rem!important;}' +
      '#qFabBtn{width:36px!important;height:36px!important;}' +
      '.group-title{font-size:0.9rem!important;}' +
      '.group-grid{max-width:300px!important;}' +
      '.group-btn{width:44px!important;height:44px!important;font-size:0.7rem!important;}' +
      '.group-btn span{font-size:0.4rem!important;}' +
      '.step-nav,.mode-bar{bottom:0.3rem!important;}' +
      '.detail-panel{width:clamp(180px,22vw,220px)!important;padding:0.6rem!important;font-size:0.7rem!important;}' +
      '.detail-section p,.ds p{font-size:0.65rem!important;}' +
      '.detail-formula,.df{font-size:0.8rem!important;padding:0.3rem!important;}' +
      '.hint-text{display:none!important;}' +
    '}' +

    // ── Phone portrait (max-width 600px) ──
    '@media screen and (max-width:600px){' +
      // Diagram containers: force fluid width
      '.diagram-container{width:calc(100vw - 1rem)!important;height:auto!important;aspect-ratio:4/3;}' +
      '.circuit-diagram{width:calc(100vw - 1rem)!important;height:auto!important;}' +
      // Lab: single column layout
      '.lab-main{grid-template-columns:1fr!important;grid-template-rows:auto 1fr auto!important;}' +
      '.material-tray{max-height:120px!important;overflow-y:auto!important;border-right:none!important;border-bottom:1px solid rgba(92,196,196,0.1)!important;}' +
      '.material-tray .material-list{display:flex!important;flex-wrap:wrap!important;gap:0.3rem!important;}' +
      '.material-item{flex:0 0 auto!important;padding:0.25rem 0.5rem!important;}' +
      '.history-panel{max-height:150px!important;overflow-y:auto!important;border-left:none!important;border-top:1px solid rgba(92,196,196,0.1)!important;}' +
      // Group selection grid: 3 columns
      '.group-grid{grid-template-columns:repeat(3,1fr)!important;max-width:calc(100vw - 2rem)!important;}' +
      '.group-btn{width:60px!important;height:60px!important;font-size:0.8rem!important;}' +
      '.group-btn span{font-size:0.45rem!important;}' +
      '.group-title{font-size:1rem!important;}' +
      // Topbar: compact
      '.topbar-title{max-width:100px!important;font-size:0.72rem!important;}' +
      '.lab-title{max-width:80px!important;font-size:0.72rem!important;}' +
      '.ctrl-btn{padding:0.2rem 0.35rem!important;font-size:0.55rem!important;}' +
      '.back-btn{font-size:0.6rem!important;padding:0.15rem 0.3rem!important;}' +
      '.lab-stats .stat-item{font-size:0.6rem!important;}' +
      // Detail panel: full width overlay
      '.detail-panel{position:fixed!important;width:calc(100vw - 1rem)!important;max-width:none!important;left:0.5rem!important;right:0.5rem!important;bottom:0!important;top:auto!important;max-height:50vh!important;overflow-y:auto!important;border-radius:0.75rem 0.75rem 0 0!important;z-index:100!important;}' +
      // Hotspot labels: smaller
      '.hotspot::after{font-size:0.55rem!important;padding:0.15rem 0.3rem!important;}' +
      // Task card
      '.task-card{padding:0.4rem!important;}' +
      '.task-card p{font-size:0.6rem!important;}' +
      '.reaction{font-size:0.7rem!important;}' +
      // Index page
      '.header h1{font-size:1.5rem!important;}' +
      '.cards-grid{grid-template-columns:1fr!important;max-width:calc(100vw - 2rem)!important;gap:0.6rem!important;}' +
      '.card{padding:0.8rem!important;}' +
      '.card-icon{width:40px!important;height:40px!important;}' +
      '.card-title{font-size:1rem!important;}' +
      '.card-desc{font-size:0.7rem!important;}' +
      // Result overlay
      '.result-card{max-width:calc(100vw - 2rem)!important;padding:1rem!important;}' +
      '#questionModal>div{max-width:calc(100vw - 1rem)!important;max-height:80vh!important;overflow-y:auto!important;}' +
      // Step nav and mode bar
      '.step-nav,.mode-bar{padding:0.3rem 0.5rem!important;gap:0.3rem!important;}' +
      '.step-dot{width:6px!important;height:6px!important;}' +
    '}' +

    // ── Landscape overlay ──
    '#landscapeOverlay{display:none;position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#060a14,#0a1628);align-items:center;justify-content:center;}' +
    '@keyframes loR{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(90deg)}}' +
    '@media(max-width:900px) and (orientation:portrait){#landscapeOverlay{display:flex!important;}}' +
    '@media(min-width:901px){#landscapeOverlay{display:none!important;}}' +
    '@media(orientation:landscape){#landscapeOverlay{display:none!important;}}';

  document.head.appendChild(s);

  // Dynamic topbar height tracking for detail-panel top offset
  function syncTopbarHeight() {
    var tb = document.querySelector('.topbar') || document.querySelector('.lab-topbar');
    if (tb) {
      document.documentElement.style.setProperty('--topbar-h', tb.offsetHeight + 'px');
    }
  }
  // Add CSS rule using the variable
  var s2 = document.createElement('style');
  s2.textContent = '.detail-panel{top:var(--topbar-h,56px)!important;}';
  document.head.appendChild(s2);
  window.addEventListener('resize', syncTopbarHeight);
  window.addEventListener('load', syncTopbarHeight);
  // Also run after a short delay for dynamic content
  setTimeout(syncTopbarHeight, 200);

  var ol = document.createElement('div');
  ol.id = 'landscapeOverlay';
  ol.innerHTML = '<div style="text-align:center;color:#e4e6ec;font-family:sans-serif;padding:2rem;">' +
    '<div style="margin-bottom:1rem;animation:loR 2.5s ease-in-out infinite"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="3" stroke="#5cc4c4" stroke-width="2"/></svg></div>' +
    '<div style="font-size:1.1rem;font-weight:600">请使用平板或电脑访问</div>' +
    '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;line-height:1.6;">本平台包含 3D 模型和交互实验<br>手机屏幕过小，体验不佳</div>' +
    '<div style="font-size:0.75rem;color:rgba(92,196,196,0.6);margin-top:1rem;">如使用平板，请横屏操作</div>' +
    '</div>';
  document.body.appendChild(ol);

  // ── Light/Dark mode toggle ──
  var ts = document.createElement('style');
  ts.textContent =
    // Light mode overrides
    'body.light-mode{' +
      '--bg:#f5f6f8;--bg-panel:rgba(0,0,0,0.03);--border:rgba(0,0,0,0.1);' +
      '--text:#1a1a2e;--text-dim:rgba(0,0,0,0.5);' +
      '--blue:#2d6bc4;--cyan:#1a9898;--green:#3a8a3a;--red:#c0392b;--gold:#b8860b;' +
      'background:var(--bg)!important;color:var(--text)!important;' +
    '}' +
    // Specific overrides for common dark backgrounds
    'body.light-mode .topbar,body.light-mode .lab-topbar{background:rgba(255,255,255,0.9)!important;border-bottom:1px solid rgba(0,0,0,0.08)!important;}' +
    'body.light-mode .app{background:var(--bg)!important;}' +
    'body.light-mode .material-tray,body.light-mode .history-panel{background:rgba(255,255,255,0.6)!important;}' +
    'body.light-mode .task-card{background:rgba(45,107,196,0.06)!important;border-color:rgba(45,107,196,0.15)!important;}' +
    'body.light-mode .material-item{background:rgba(0,0,0,0.03)!important;border-color:rgba(0,0,0,0.08)!important;}' +
    'body.light-mode .material-item.selected{border-color:var(--cyan)!important;background:rgba(26,152,152,0.08)!important;}' +
    'body.light-mode .circuit-area{background:rgba(255,255,255,0.5)!important;}' +
    'body.light-mode .drop-slot{border-color:rgba(0,0,0,0.15)!important;background:rgba(255,255,255,0.5)!important;}' +
    'body.light-mode .history-item{background:rgba(0,0,0,0.03)!important;border-color:rgba(0,0,0,0.08)!important;}' +
    'body.light-mode .ctrl-btn{background:rgba(0,0,0,0.04)!important;border-color:rgba(0,0,0,0.1)!important;color:var(--text)!important;}' +
    'body.light-mode .submit-btn.primary{background:linear-gradient(135deg,#2d6bc4,#1a9898)!important;}' +
    'body.light-mode .submit-btn.secondary{background:rgba(0,0,0,0.04)!important;border-color:rgba(0,0,0,0.1)!important;color:var(--text)!important;}' +
    'body.light-mode .detail-panel{background:rgba(255,255,255,0.95)!important;border-color:rgba(0,0,0,0.1)!important;}' +
    'body.light-mode .inline-result{background:rgba(255,255,255,0.85)!important;border-color:rgba(0,0,0,0.1)!important;}' +
    'body.light-mode .inline-cooldown{background:rgba(184,134,11,0.08)!important;border-color:rgba(184,134,11,0.2)!important;}' +
    // Index page
    'body.light-mode .card{background:rgba(255,255,255,0.7)!important;border-color:rgba(0,0,0,0.08)!important;}' +
    'body.light-mode .card:hover{border-color:var(--cyan)!important;background:rgba(255,255,255,0.9)!important;}' +
    'body.light-mode .footer{color:rgba(0,0,0,0.4)!important;}' +
    // Group selection
    'body.light-mode .group-btn{background:rgba(0,0,0,0.03)!important;border-color:rgba(0,0,0,0.1)!important;color:var(--text)!important;}' +
    'body.light-mode .group-btn:hover{border-color:var(--cyan)!important;}' +
    // Failed overlay
    'body.light-mode .failed-overlay{background:rgba(245,246,248,0.95)!important;}' +
    // Theme toggle button
    '#themeToggle{position:fixed;bottom:1rem;left:1rem;z-index:998;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:all .3s;}' +
    '#themeToggle:hover{border-color:rgba(255,255,255,0.3);background:rgba(0,0,0,0.5);}' +
    'body.light-mode #themeToggle{background:rgba(255,255,255,0.8);border-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.7);}' +
    'body.light-mode #themeToggle:hover{background:rgba(255,255,255,1);border-color:rgba(0,0,0,0.2);}';
  document.head.appendChild(ts);

  // Theme toggle button
  var tb = document.createElement('button');
  tb.id = 'themeToggle';
  tb.innerHTML = '☀';
  tb.title = '切换浅色/深色模式';
  tb.onclick = function() {
    document.body.classList.toggle('light-mode');
    var isLight = document.body.classList.contains('light-mode');
    tb.innerHTML = isLight ? '🌙' : '☀';
    try { localStorage.setItem('galvanic_theme', isLight ? 'light' : 'dark'); } catch(e) {}
  };
  document.body.appendChild(tb);

  // Restore saved theme
  try {
    if (localStorage.getItem('galvanic_theme') === 'light') {
      document.body.classList.add('light-mode');
      tb.innerHTML = '🌙';
    }
  } catch(e) {}
})();
