/* BestieMovie yükleyici: lisansı doğrular, geçerliyse arayüzü çizer ve app.js'i başlatır. */
(function () {
  'use strict';

  var REASONS = {
    'domain': 'Bu lisans bu alan adı için verilmemiş.',
    'expired': 'Lisansın süresi dolmuş.',
    'signature': 'Lisans imzası geçersiz (dosya değiştirilmiş olabilir).',
    'product': 'Lisans bu ürün için geçerli değil.',
    'no-webcrypto': 'Bu tarayıcı güvenli bağlantı (HTTPS) olmadan çalışmıyor.',
    'missing': 'license.js bulunamadı veya bozuk.',
    'error': 'Lisans doğrulanamadı.'
  };

  function fail(reason) {
    document.body.className = '';
    document.body.innerHTML =
      "<div style='display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#030712;color:white;font-family:sans-serif;text-align:center;padding:20px;'>" +
      "<h1 style='font-size:24px;color:#ef4444;margin-bottom:10px;'>⚠️ Lisans Hatası</h1>" +
      "<p style='color:#9ca3af;font-size:14px;'></p></div>";
    document.querySelector('p').textContent = REASONS[reason] || REASONS.error;
  }

  async function boot() {
    var L = window.__BESTIEMOVIE_LICENSE__;
    var ok = false;
    try { ok = !!(L && typeof L.validate === 'function' && await L.validate()); } catch (e) { ok = false; }
    if (!ok) { fail(L && L.reason && L.reason !== 'not-checked' ? L.reason : 'missing'); return; }

    var ui = window.__BM_UI__;
    if (!ui) { fail('error'); return; }
    var bin = atob(ui.h), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    var html = new TextDecoder().decode(bytes);

    document.body.className = ui.c;
    document.body.innerHTML = html;
    delete window.__BM_UI__;

    var s = document.createElement('script');
    s.src = 'app.js';
    document.body.appendChild(s);
  }

  boot();
})();
