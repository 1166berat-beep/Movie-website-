#!/usr/bin/env node
// Tasarımı JavaScript'e taşır.
//   kaynak/site.html  ->  index.html (boş kabuk) + ui.js (tasarım, base64)
// Kullanım:  node tools/build-ui.mjs
// Tasarımı değiştirmek için kaynak/site.html dosyasını düzenleyip bu komutu tekrar çalıştırın.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = path.join(ROOT, 'kaynak', 'site.html');
const src = fs.readFileSync(srcPath, 'utf8');

const htmlTag = (src.match(/<html[^>]*>/i) || ['<html lang="en" class="dark">'])[0];
const headMatch = src.match(/<head>([\s\S]*?)<\/head>/i);
const bodyOpen = src.match(/<body([^>]*)>/i);
if (!headMatch || !bodyOpen) { console.error('site.html içinde <head> veya <body> bulunamadı.'); process.exit(1); }

// <head>: lisans kontrolüyle ilgili script'leri çıkar (artık loader.js yapıyor)
const head = headMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) =>
  /license\.js|__BESTIEMOVIE_LICENSE__/.test(m) ? '' : m);

// <body>: tüm içerik, script'ler hariç
const bodyClass = (bodyOpen[1].match(/class="([^"]*)"/) || [, ''])[1];
const bodyStart = bodyOpen.index + bodyOpen[0].length;
const bodyEnd = src.lastIndexOf('</body>');
const bodyInner = src.slice(bodyStart, bodyEnd).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').trim();

// ui.js: tasarım base64 olarak
const b64 = Buffer.from(bodyInner, 'utf8').toString('base64');
fs.writeFileSync(path.join(ROOT, 'ui.js'),
  '/* BestieMovie arayüz paketi - elle düzenlemeyin (tools/build-ui.mjs üretir) */\n' +
  'window.__BM_UI__=' + JSON.stringify({ c: bodyClass, h: b64 }) + ';\n');

// index.html: boş kabuk
const shell =
  '<!DOCTYPE html>' + htmlTag + '<head>' + head + '</head>' +
  '<body class="' + bodyClass + '">' +
  '<noscript><p style="font-family:sans-serif;padding:24px">Bu sayfa için JavaScript gerekli.</p></noscript>' +
  '<div id="bm-boot" style="display:flex;align-items:center;justify-content:center;height:100vh;color:#9ca3af;font-family:sans-serif;font-size:14px">Loading…</div>' +
  '<script src="license.js"></script>' +
  '<script src="ui.js"></script>' +
  '<script src="loader.js"></script>' +
  '</body></html>\n';
fs.writeFileSync(path.join(ROOT, 'index.html'), shell);

console.log('Tamam: index.html (' + shell.length + ' bayt), ui.js (' + b64.length + ' bayt) üretildi.');
