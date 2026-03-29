/**
 * 移动端横屏提示 + 基础适配
 * 所有页面在 </body> 前引入: <script src="mobile.js"></script>
 */
(function() {
  // Create overlay
  var overlay = document.createElement('div');
  overlay.id = 'landscapeOverlay';
  overlay.innerHTML = '<div class="lo-content">' +
    '<div class="lo-icon"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="3" stroke="#5cc4c4" stroke-width="2"/><path d="M14 14V12a2 2 0 012-2h16a2 2 0 012 2v2" stroke="#5cc4c4" stroke-width="1.5" opacity="0.4"/><path d="M24 28l-4-3h8l-4 3z" fill="#5cc4c4" opacity="0.6"/><animateTransform attributeName="transform" type="rotate" values="0 24 24;90 24 24;90 24 24;0 24 24" dur="2.5s" repeatCount="indefinite"/></svg></div>' +
    '<div class="lo-text">请将设备横屏使用</div>' +
    '<div class="lo-sub">本平台在横屏模式下体验更佳</div>' +
    '</div>';

  // Styles
  var style = document.createElement('style');
  style.textContent = '' +
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

  document.head.appendChild(style);
  document.body.appendChild(overlay);
})();
