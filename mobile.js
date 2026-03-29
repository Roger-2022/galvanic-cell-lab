/**
 * 移动端适配 + 横屏提示
 */
(function() {
  // ── 1. 全局修复 ──
  var fixStyle = document.createElement('style');
  fixStyle.textContent = '' +
    'html,body{max-width:100vw;overflow-x:hidden;}' +
    '*{-webkit-box-sizing:border-box;box-sizing:border-box;}' +

    // Safe area for notch/toolbar (iOS Safari)
    'body{padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);}' +

    // ── Mobile landscape (phone横屏, height < 500px) ──
    '@media screen and (max-height:500px) and (orientation:landscape){' +
      // Use dvh for full viewport (accounts for browser bars)
      'html,body,.app{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;}' +

      // Topbar compact
      '.topbar,.lab-topbar{height:36px!important;min-height:36px!important;padding:0 0.6rem!important;}' +
      '.topbar-title,.lab-title{font-size:0.75rem!important;}' +
      '.topbar-badge,.lab-group-badge{font-size:0.55rem!important;padding:0.1rem 0.4rem!important;}' +
      '.ctrl-btn,.action-btn{padding:0.2rem 0.5rem!important;font-size:0.6rem!important;}' +
      '.back-btn{font-size:0.6rem!important;padding:0.2rem 0.4rem!important;}' +

      // First page cards
      '.header{margin-bottom:0.8rem!important;}' +
      '.header h1{font-size:1.2rem!important;}' +
      '.header-label{font-size:0.55rem!important;}' +
      '.header-sub{font-size:0.6rem!important;margin-top:0.3rem!important;}' +
      '.header-divider{margin:0.5rem auto 0!important;}' +
      '.cards-grid{gap:0.6rem!important;max-width:100%!important;padding:0 0.8rem!important;}' +
      '.card{padding:0.8rem 0.6rem 0.6rem!important;border-radius:10px!important;}' +
      '.card-icon{width:32px!important;height:32px!important;margin-bottom:0.5rem!important;border-radius:8px!important;}' +
      '.card-icon svg{width:18px!important;height:18px!important;}' +
      '.card-title{font-size:0.8rem!important;margin-bottom:0.2rem!important;}' +
      '.card-desc{font-size:0.6rem!important;line-height:1.4!important;}' +
      '.card-tag{font-size:0.5rem!important;padding:0.15rem 0.5rem!important;margin-top:0.5rem!important;}' +
      '.footer{font-size:0.5rem!important;bottom:0.3rem!important;}' +

      // Lab: 3-column layout compact
      '.lab-main{grid-template-columns:160px 1fr 180px!important;height:calc(100dvh - 36px)!important;}' +
      '.material-tray{padding:0.4rem!important;overflow-y:auto!important;}' +
      '.task-card{padding:0.4rem!important;margin-bottom:0.4rem!important;}' +
      '.task-card-label{font-size:0.5rem!important;}' +
      '.task-card p{font-size:0.6rem!important;line-height:1.3!important;}' +
      '.task-card .reaction{font-size:0.7rem!important;margin:0.3rem 0!important;}' +
      '.tray-label{font-size:0.5rem!important;margin-bottom:0.3rem!important;padding-bottom:0.2rem!important;}' +
      '.tray-section{margin-bottom:0.5rem!important;}' +
      '.material-item{padding:0.25rem 0.4rem!important;margin-bottom:0.15rem!important;}' +
      '.mat-icon{width:24px!important;height:24px!important;min-width:24px!important;font-size:0.6rem!important;border-radius:5px!important;}' +
      '.mat-name{font-size:0.65rem!important;}' +

      // Circuit area
      '.circuit-area{padding:0.5rem!important;}' +
      '.circuit-diagram{width:auto!important;height:auto!important;max-width:280px!important;max-height:calc(100dvh - 80px)!important;}' +
      '.circuit-diagram svg{width:100%!important;height:auto!important;}' +
      '.bulb-container{top:5px!important;}' +
      '.bulb-svg{width:30px!important;height:30px!important;}' +
      '.drop-slot{border-width:1px!important;}' +
      '.drop-slot .slot-label{font-size:0.5rem!important;}' +
      '.drop-slot .slot-value{font-size:0.65rem!important;}' +
      '.drop-slot .slot-hint{font-size:0.45rem!important;}' +
      '.submit-area{margin-top:0.5rem!important;}' +
      '.submit-btn{padding:0.35rem 1rem!important;font-size:0.7rem!important;border-radius:6px!important;}' +

      // Cooldown overlay
      '.cooldown-timer{font-size:2rem!important;}' +
      '.cooldown-msg{font-size:0.7rem!important;}' +

      // History panel
      '.history-panel{padding:0.4rem!important;overflow-y:auto!important;}' +
      '.history-title{font-size:0.55rem!important;}' +
      '.history-item{padding:0.4rem!important;font-size:0.6rem!important;}' +
      '.history-attempt-num{font-size:0.55rem!important;}' +
      '.history-choices{font-size:0.6rem!important;}' +

      // Stats bar (dashboard)
      '.stats-bar{padding:0.3rem 0.6rem!important;gap:0.5rem!important;flex-wrap:wrap!important;}' +
      '.stat-card{padding:0.3rem 0.5rem!important;min-width:70px!important;}' +
      '.stat-card-value{font-size:0.9rem!important;}' +
      '.stat-card-label{font-size:0.45rem!important;}' +
      '.stat-card-sub{font-size:0.5rem!important;}' +

      // Groups grid (dashboard)
      '.groups-container{padding:0.5rem!important;}' +
      '.groups-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))!important;gap:0.4rem!important;}' +
      '.group-card{padding:0.4rem 0.6rem!important;}' +
      '.group-card-id{font-size:0.75rem!important;}' +
      '.group-card-status{font-size:0.5rem!important;}' +
      '.group-card-attempts{font-size:0.55rem!important;}' +
      '.group-card-last{font-size:0.55rem!important;padding:0.3rem!important;}' +
      '.group-action-btn{font-size:0.55rem!important;padding:0.2rem 0.4rem!important;}' +

      // Group selection page
      '.group-title{font-size:1rem!important;}' +
      '.group-subtitle{font-size:0.65rem!important;}' +
      '.group-grid{grid-template-columns:repeat(5,1fr)!important;gap:0.4rem!important;max-width:350px!important;}' +
      '.group-btn{width:50px!important;height:50px!important;font-size:0.8rem!important;border-radius:8px!important;}' +
      '.group-btn span{font-size:0.45rem!important;}' +

      // FAB button
      '#qFabWrapper{bottom:0.5rem!important;right:0.5rem!important;}' +
      '#qFabBtn{width:40px!important;height:40px!important;}' +
      '#qFabBtn svg{width:18px!important;height:18px!important;}' +

      // Login page
      '.login-screen{padding:0.5rem!important;gap:0.8rem!important;}' +
      '.login-title{font-size:1rem!important;}' +
      '.login-input{width:220px!important;padding:0.4rem 0.6rem!important;font-size:0.75rem!important;}' +
      '.login-btn{padding:0.4rem 1rem!important;font-size:0.7rem!important;}' +

      // Questions panel (dashboard)
      '#questionsPanel{max-height:100px!important;padding:0.3rem 0.5rem!important;}' +

      // Model pages - sidebar
      '.detail-panel{width:280px!important;}' +
      '.detail-title{font-size:0.9rem!important;}' +
      '.detail-section,.ds{padding:0.6rem!important;}' +
      '.detail-section p,.ds p{font-size:0.7rem!important;}' +

      // Step nav
      '.step-nav,.mode-bar{bottom:0.5rem!important;padding:0.3rem 0.8rem!important;}' +
      '.mode-text,.mi{top:0.3rem!important;left:0.5rem!important;font-size:0.55rem!important;}' +
      '.hint-text{display:none!important;}' +
    '}' +

    // ── iPad landscape (medium screens) ──
    '@media screen and (min-height:501px) and (max-height:900px) and (orientation:landscape){' +
      'html,body,.app{height:100dvh!important;}' +
      '.header h1{font-size:2rem!important;}' +
      '.cards-grid{max-width:850px!important;}' +
      '.lab-main{grid-template-columns:220px 1fr 250px!important;}' +
    '}' +

    // ── Portrait (show rotate prompt) ──
    '@media screen and (max-width:900px) and (orientation:portrait){' +
      '.cards-grid{grid-template-columns:1fr!important;max-width:300px!important;}' +
      '.header h1{font-size:1.5rem!important;}' +
    '}';

  document.head.appendChild(fixStyle);

  // ── 2. Also set viewport meta to use interactive-widget=resizes-content ──
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content';
  }

  // ── 3. 横屏提示遮罩 ──
  var overlay = document.createElement('div');
  overlay.id = 'landscapeOverlay';
  overlay.innerHTML = '<div style="text-align:center;color:#e4e6ec;font-family:\'Noto Sans SC\',-apple-system,sans-serif;">' +
    '<div style="margin-bottom:1.5rem;animation:loRotate 2.5s ease-in-out infinite;"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="3" stroke="#5cc4c4" stroke-width="2"/><path d="M14 14V12a2 2 0 012-2h16a2 2 0 012 2v2" stroke="#5cc4c4" stroke-width="1.5" opacity="0.4"/></svg></div>' +
    '<div style="font-size:1.2rem;font-weight:600;letter-spacing:0.08em;margin-bottom:0.5rem;">请将设备横屏使用</div>' +
    '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);">本平台在横屏模式下体验更佳</div>' +
    '</div>';

  var olStyle = document.createElement('style');
  olStyle.textContent = '' +
    '#landscapeOverlay{display:none;position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#060a14,#0a1628);align-items:center;justify-content:center;flex-direction:column;}' +
    '@keyframes loRotate{0%,100%{transform:rotate(0deg)}30%,70%{transform:rotate(90deg)}}' +
    '@media screen and (max-width:900px) and (orientation:portrait){#landscapeOverlay{display:flex!important;}}' +
    '@media screen and (min-width:901px){#landscapeOverlay{display:none!important;}}' +
    '@media screen and (orientation:landscape){#landscapeOverlay{display:none!important;}}';

  document.head.appendChild(olStyle);
  document.body.appendChild(overlay);
})();
