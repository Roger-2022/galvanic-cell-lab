/**
 * 移动端适配 + 横屏提示
 */
(function() {
  // ── 1. 全局样式修复：防止内容溢出 ──
  var fixStyle = document.createElement('style');
  fixStyle.textContent = '' +
    'html,body{max-width:100vw;overflow-x:hidden;}' +
    '*{-webkit-box-sizing:border-box;box-sizing:border-box;}' +

    // 横屏时的移动端适配
    '@media screen and (max-height:500px) and (orientation:landscape){' +
      // 首页卡片
      '.cards-grid{grid-template-columns:repeat(3,1fr)!important;gap:0.8rem!important;max-width:100%!important;padding:0 1rem!important;}' +
      '.card{padding:1.2rem 1rem 1rem!important;}' +
      '.card-icon{width:40px!important;height:40px!important;margin-bottom:0.8rem!important;}' +
      '.card-title{font-size:1rem!important;}' +
      '.card-desc{font-size:0.7rem!important;}' +
      '.header h1{font-size:1.6rem!important;}' +
      '.header{margin-bottom:1.5rem!important;}' +
      '.header-sub{font-size:0.75rem!important;}' +

      // 虚拟实验室
      '.lab-main{grid-template-columns:200px 1fr 220px!important;}' +
      '.material-tray{padding:0.6rem!important;}' +
      '.tray-label{font-size:0.6rem!important;}' +
      '.material-item{padding:0.4rem 0.5rem!important;}' +
      '.mat-icon{width:28px!important;height:28px!important;font-size:0.7rem!important;}' +
      '.mat-name{font-size:0.72rem!important;}' +
      '.task-card{padding:0.5rem 0.6rem!important;}' +
      '.task-card p{font-size:0.7rem!important;}' +
      '.circuit-diagram{width:340px!important;height:280px!important;}' +
      '.drop-slot .slot-label{font-size:0.6rem!important;}' +
      '.submit-btn{padding:0.5rem 1.5rem!important;font-size:0.78rem!important;}' +
      '.history-panel{padding:0.6rem!important;}' +
      '.history-title{font-size:0.65rem!important;}' +

      // 教师面板
      '.stats-bar{padding:0.5rem 1rem!important;gap:0.8rem!important;}' +
      '.stat-card{padding:0.5rem 0.8rem!important;min-width:90px!important;}' +
      '.stat-card-value{font-size:1.1rem!important;}' +
      '.stat-card-label{font-size:0.55rem!important;}' +
      '.groups-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))!important;gap:0.6rem!important;}' +
      '.group-card{padding:0.6rem 0.8rem!important;}' +

      // topbar
      '.topbar,.lab-topbar{height:42px!important;padding:0 0.8rem!important;}' +
      '.topbar-title,.lab-title{font-size:0.85rem!important;}' +
      '.ctrl-btn,.action-btn{padding:0.3rem 0.6rem!important;font-size:0.68rem!important;}' +
      '.back-btn{font-size:0.7rem!important;padding:0.3rem 0.5rem!important;}' +

      // 选组页面
      '.group-title{font-size:1.2rem!important;}' +
      '.group-grid{grid-template-columns:repeat(5,1fr)!important;gap:0.5rem!important;}' +
      '.group-btn{width:55px!important;height:55px!important;font-size:0.85rem!important;}' +

      // 通用
      '.footer{font-size:0.6rem!important;bottom:0.5rem!important;}' +
    '}' +

    // iPad 横屏适配（中等屏幕）
    '@media screen and (min-height:501px) and (max-height:900px) and (orientation:landscape){' +
      '.cards-grid{max-width:900px!important;}' +
      '.header h1{font-size:2.2rem!important;}' +
      '.lab-main{grid-template-columns:220px 1fr 260px!important;}' +
    '}' +

    // 竖屏手机（小屏）
    '@media screen and (max-width:600px) and (orientation:portrait){' +
      '.cards-grid{grid-template-columns:1fr!important;max-width:300px!important;}' +
      '.header h1{font-size:1.5rem!important;}' +
    '}';

  document.head.appendChild(fixStyle);

  // ── 2. 横屏提示遮罩（竖屏时显示） ──
  var overlay = document.createElement('div');
  overlay.id = 'landscapeOverlay';
  overlay.innerHTML = '<div class="lo-content">' +
    '<div class="lo-icon"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="3" stroke="#5cc4c4" stroke-width="2"/><path d="M14 14V12a2 2 0 012-2h16a2 2 0 012 2v2" stroke="#5cc4c4" stroke-width="1.5" opacity="0.4"/><path d="M24 28l-4-3h8l-4 3z" fill="#5cc4c4" opacity="0.6"/><animateTransform attributeName="transform" type="rotate" values="0 24 24;90 24 24;90 24 24;0 24 24" dur="2.5s" repeatCount="indefinite"/></svg></div>' +
    '<div class="lo-text">请将设备横屏使用</div>' +
    '<div class="lo-sub">本平台在横屏模式下体验更佳</div>' +
    '</div>';

  var olStyle = document.createElement('style');
  olStyle.textContent = '' +
    '#landscapeOverlay{' +
      'display:none;position:fixed;inset:0;z-index:999999;' +
      'background:linear-gradient(135deg,#060a14,#0a1628);' +
      'align-items:center;justify-content:center;flex-direction:column;' +
    '}' +
    '#landscapeOverlay .lo-content{text-align:center;color:#e4e6ec;font-family:"Noto Sans SC",-apple-system,sans-serif;}' +
    '#landscapeOverlay .lo-icon{margin-bottom:1.5rem;animation:loRotate 2.5s ease-in-out infinite;}' +
    '#landscapeOverlay .lo-text{font-size:1.2rem;font-weight:600;letter-spacing:0.08em;margin-bottom:0.5rem;}' +
    '#landscapeOverlay .lo-sub{font-size:0.8rem;color:rgba(255,255,255,0.4);}' +
    '@keyframes loRotate{0%,100%{transform:rotate(0deg)}30%,70%{transform:rotate(90deg)}}' +
    '@media screen and (max-width:900px) and (orientation:portrait){' +
      '#landscapeOverlay{display:flex!important;}' +
    '}' +
    '@media screen and (min-width:901px){' +
      '#landscapeOverlay{display:none!important;}' +
    '}' +
    '@media screen and (orientation:landscape){' +
      '#landscapeOverlay{display:none!important;}' +
    '}';

  document.head.appendChild(olStyle);
  document.body.appendChild(overlay);
})();
