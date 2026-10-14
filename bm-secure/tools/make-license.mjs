#!/usr/bin/env node
// BestieMovie lisans aracı (ECDSA P-256 + SHA-256, imzalı lisans)
//
//   1) Anahtar üret (bir kez):   node tools/make-license.mjs init
//   2) Lisans üret:              node tools/make-license.mjs issue --domains siteniz.com,www.siteniz.com --days 365
//
// anahtarlar/private.pem GİZLİ ANAHTARDIR. Sunucuya yüklemeyin, kimseyle paylaşmayın, yedeğini alın.
// Üretilen license.js'te yalnızca açık anahtar ve imzalı lisans bulunur; sitenize yüklenecek dosya budur.
import { generateKeyPairSync, createPrivateKey, createPublicKey, sign, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEYDIR = path.join(ROOT, 'anahtarlar');
const PRIV = path.join(KEYDIR, 'private.pem');

function args(list) {
  const o = {};
  for (let i = 0; i < list.length; i++) {
    if (list[i].startsWith('--')) {
      const k = list[i].slice(2);
      const v = list[i + 1] && !list[i + 1].startsWith('--') ? list[++i] : true;
      o[k] = v;
    }
  }
  return o;
}

const [cmd, ...rest] = process.argv.slice(2);
const opt = args(rest);

if (cmd === 'init') {
  if (fs.existsSync(PRIV) && !opt.force) {
    console.error('Anahtar zaten var: ' + PRIV + '\nÜzerine yazmak mevcut tüm lisansları geçersiz kılar. Yine de istiyorsanız --force ekleyin.');
    process.exit(1);
  }
  fs.mkdirSync(KEYDIR, { recursive: true });
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  fs.writeFileSync(PRIV, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  console.log('Anahtar üretildi: ' + PRIV + '\nBu dosyayı sunucuya YÜKLEMEYİN ve yedeğini alın.');
  process.exit(0);
}

if (cmd === 'issue') {
  if (!fs.existsSync(PRIV)) { console.error('Önce anahtar üretin:  node tools/make-license.mjs init'); process.exit(1); }
  const domains = String(opt.domains || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!domains.length) { console.error('--domains gerekli. Örnek: --domains siteniz.com,www.siteniz.com'); process.exit(1); }

  const days = opt.days === undefined ? 365 : Number(opt.days);
  if (Number.isNaN(days)) { console.error('--days bir sayı olmalı (0 = süresiz).'); process.exit(1); }

  const now = new Date();
  const payload = {
    product: 'bestiemovie',
    id: randomBytes(8).toString('hex'),
    owner: typeof opt.owner === 'string' ? opt.owner : '',
    domains,
    issued: now.toISOString(),
    expires: days === 0 ? null : new Date(now.getTime() + days * 86400000).toISOString()
  };
  const payloadStr = JSON.stringify(payload);

  const privateKey = createPrivateKey(fs.readFileSync(PRIV));
  const signature = sign('sha256', Buffer.from(payloadStr, 'utf8'), { key: privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64');
  const jwk = createPublicKey(privateKey).export({ format: 'jwk' });
  const pub = { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y };

  const out = getTemplate()
    .replace('__PUB__', () => JSON.stringify(pub))
    .replace('__PAYLOAD__', () => JSON.stringify(payloadStr))
    .replace('__SIG__', () => JSON.stringify(signature));
  const outPath = typeof opt.out === 'string' ? path.resolve(opt.out) : path.join(ROOT, 'license.js');
  fs.writeFileSync(outPath, out);

  console.log('Lisans üretildi: ' + outPath);
  console.log('  Alan adları : ' + domains.join(', '));
  console.log('  Bitiş       : ' + (payload.expires || 'süresiz'));
  process.exit(0);
}

console.log('Kullanım:\n  node tools/make-license.mjs init\n  node tools/make-license.mjs issue --domains siteniz.com,www.siteniz.com [--days 365] [--owner "Ad"] [--out dosya.js]');
process.exit(cmd ? 1 : 0);

// ---------------------------------------------------------------------------
// license.js şablonu: tarayıcıda imzayı, alan adını ve süreyi doğrular.
function getTemplate() { return `/* BestieMovie lisansı - imzalıdır, elle değiştirmeyin. */
(function () {
  'use strict';
  var PUB = __PUB__;
  var PAYLOAD = __PAYLOAD__;
  var SIG = __SIG__;

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
`; }
