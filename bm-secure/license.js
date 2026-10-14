/* BestieMovie lisansı - imzalıdır, elle değiştirmeyin. */
(function () {
  'use strict';
  var PUB = {"kty":"EC","crv":"P-256","x":"ywHxLFGxCoxyFP1tZAPJDlg8L55jMFXc6jyQVU_Bims","y":"YX_Ao-l6AOpZxBAoIgI5c2JYbWlYZeTdn8I-leqURhY"};
  var PAYLOAD = "{\"product\":\"bestiemovie\",\"id\":\"38c2274e412a0658\",\"owner\":\"\",\"domains\":[\"localhost\",\"127.0.0.1\"],\"issued\":\"2026-10-14T01:06:37.273Z\",\"expires\":null}";
  var SIG = "dkwbBbiVpmet/rLYlMkPLjA5rkmKsV9u/qJYIF1uFZOpnFoBwor+qT8LpssOjysSNxeaxA0nPBEC8+FqRHuqIA==";

  function b64(s) {
    var bin = atob(s), a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a;
  }

  var api = { reason: 'not-checked' };

  async function check() {
    try {
      if (!window.crypto || !crypto.subtle) { api.reason = 'no-webcrypto'; return false; }
      var key = await crypto.subtle.importKey('jwk', PUB, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      var ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, b64(SIG), new TextEncoder().encode(PAYLOAD));
      if (!ok) { api.reason = 'signature'; return false; }
      var p = JSON.parse(PAYLOAD);
      if (p.product !== 'bestiemovie') { api.reason = 'product'; return false; }
      var host = String(location.hostname || '').toLowerCase();
      if (!host || !p.domains || p.domains.indexOf(host) === -1) { api.reason = 'domain'; return false; }
      if (p.expires && Date.now() > Date.parse(p.expires)) { api.reason = 'expired'; return false; }
      api.reason = 'ok';
      return true;
    } catch (e) {
      api.reason = 'error';
      return false;
    }
  }

  api.validate = function () { return check(); };
  Object.defineProperty(window, '__BESTIEMOVIE_LICENSE__', { value: api, writable: false, configurable: false });
})();
