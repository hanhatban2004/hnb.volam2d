// ==UserScript==
// @name         Võ Lâm 2D · HNB Remote Loader
// @namespace    https://lemoncode.ai/volam2d
// @version      1.0.0
// @description  Tự động tải & chạy mọi script .js trong thư mục hnb của GitHub. Thêm/xoá file trên repo = thêm/xoá script khi tải lại trang.
// @author       Lemon Code
// @match        https://volam2d.com/*
// @match        https://*.volam2d.com/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @run-at       document-start
// @noframes
// @grant        none
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  'use strict';

  /* ================== CẤU HÌNH ==================
   * OWNER : chủ repo GitHub
   * REPO  : tên repo
   * BRANCH: nhánh chứa script
   * DIR   : thư mục chứa các file .js
   * FALLBACK_FILES: dùng khi repo private / API lỗi.
   *   - Repo PUBLIC  -> để [] , loader tự lấy danh sách từ GitHub.
   *   - Repo PRIVATE -> liệt kê tay tên file vào đây.
   * ============================================== */
  const OWNER = 'hanhatban2004';
  const REPO = 'volam2dscrip';
  const BRANCH = 'main';
  const DIR = 'hnb';

  const FALLBACK_FILES = [
    // 'vi-du-script.js',
  ];

  const CACHE_KEY = 'vl_hnb_loader_v1';
  const CACHE_TTL = 10 * 60 * 1000;   // 10 phút: hạn dùng danh sách file
  const LOG = '[HNB]';

  const isGame = /(^|\.)volam2d\.com$/i.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
  if (!isGame) return;

  /* ================== TIỆN ÍCH ================== */
  function log() { try { console.log.apply(console, [LOG].concat([].slice.call(arguments))); } catch (e) { } }
  function warn() { try { console.warn.apply(console, [LOG].concat([].slice.call(arguments))); } catch (e) { } }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; }
  }
  function writeCache(obj) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(obj)); } catch (e) { }
  }

  function fetchText(url, opts) {
    return fetch(url, Object.assign({ cache: 'no-store', credentials: 'omit' }, opts || {}))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
        return r.text();
      });
  }

  /* ================== LẤY DANH SÁCH FILE ================== */
  // Ưu tiên API GitHub. Nếu 404/quá hạn mức thì dùng cache cũ, cuối cùng là FALLBACK_FILES.
  function getManifest(force) {
    const cached = readCache();
    const fresh = cached && (Date.now() - cached.at < CACHE_TTL);
    if (!force && fresh && cached.files && cached.files.length) {
      return Promise.resolve(cached);
    }

    const api = 'https://api.github.com/repos/' + OWNER + '/' + REPO +
      '/contents/' + encodeURIComponent(DIR) + '?ref=' + encodeURIComponent(BRANCH);

    return fetchText(api, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (txt) {
        const arr = JSON.parse(txt);
        if (!Array.isArray(arr)) {
          const msg = arr && arr.message ? arr.message : 'API trả về không phải mảng';
          throw new Error(msg + ' (repo private? hết quota 60/h?)');
        }
        const files = arr
          .filter(function (f) { return f.type === 'file' && /\.js$/i.test(f.name); })
          .sort(function (a, b) { return a.name.localeCompare(b.name); })
          .map(function (f) {
            return {
              name: f.name,
              sha: f.sha,
              url: 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' +
                BRANCH + '/' + DIR + '/' + encodeURIComponent(f.name)
            };
          });
        const out = { at: Date.now(), files: files };
        writeCache(out);
        log('Danh sách file:', files.map(function (f) { return f.name; }).join(', ') || '(trống)');
        return out;
      })
      .catch(function (err) {
        warn('Không lấy được danh sách từ GitHub:', err.message);
        if (cached && cached.files && cached.files.length) {
          warn('Dùng danh sách cache cũ (' + cached.files.length + ' file).');
          return cached;
        }
        if (FALLBACK_FILES.length) {
          warn('Dùng FALLBACK_FILES (' + FALLBACK_FILES.length + ' file).');
          return {
            at: Date.now(),
            files: FALLBACK_FILES.map(function (name) {
              return {
                name: name,
                sha: 'fallback',
                url: 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' +
                  BRANCH + '/' + DIR + '/' + encodeURIComponent(name)
              };
            })
          };
        }
        throw err;
      });
  }

  /* ================== TẢI & CHẠY ================== */
  // Mỗi file lưu nội dung theo sha -> đổi file trên GitHub là tự tải bản mới.
  const codeCache = {};
  try { codeCache.all = JSON.parse(localStorage.getItem(CACHE_KEY + '_code') || '{}'); } catch (e) { codeCache.all = {}; }

  function saveCodeCache() {
    try { localStorage.setItem(CACHE_KEY + '_code', JSON.stringify(codeCache.all)); } catch (e) { }
  }

  function getCode(file) {
    const key = file.name + '@' + file.sha;
    if (codeCache.all[key]) return Promise.resolve(codeCache.all[key]);
    return fetchText(file.url).then(function (code) {
      codeCache.all[key] = code;
      saveCodeCache();
      return code;
    });
  }

  // Chạy trong page context bằng thẻ <script> (tương đương @grant none, VLHDR lộ ra console).
  function runScript(code, name) {
    const s = document.createElement('script');
    s.textContent = code + '\n//# sourceURL=' + encodeURIComponent('hnb/' + name);
    s.setAttribute('data-hnb', name);
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  const errors = [];
  function runAll(force) {
    return getManifest(force).then(function (man) {
      const files = man.files || [];
      if (!files.length) { setBadge('HNB 0', 'Thư mục ' + DIR + ' không có file .js', 'warn'); return; }
      let chain = Promise.resolve();
      files.forEach(function (f) {
        chain = chain.then(function () {
          return getCode(f).then(function (code) {
            try { runScript(code, f.name); log('Đã chạy', f.name); }
            catch (e) { errors.push(f.name + ': ' + e.message); warn('Lỗi chạy', f.name, e); }
          }).catch(function (e) {
            errors.push(f.name + ': ' + e.message);
            warn('Lỗi tải', f.name, e.message);
          });
        });
      });
      return chain.then(function () {
        const n = files.length - errors.length;
        setBadge('HNB ' + n, errors.length ? ('Lỗi: ' + errors.join(' | ')) : ('Đã chạy ' + n + ' script'), errors.length ? 'err' : 'ok');
      });
    }).catch(function (e) {
      setBadge('HNB !', 'Không tải được repo: ' + e.message + ' (repo phải PUBLIC hoặc điền FALLBACK_FILES)', 'err');
      warn(e);
    });
  }

  /* ================== BADGE ================== */
  let badge = null;
  let pendingBadge = null;
  document.addEventListener('DOMContentLoaded', function () {
    if (pendingBadge) setBadge(pendingBadge.text, pendingBadge.title, pendingBadge.kind);
  }, { once: true });
  function setBadge(text, title, kind) {
    pendingBadge = { text: text, title: title, kind: kind };
    if (!document.body && document.readyState === 'loading') return;
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'vl-hnb-badge';
      badge.style.cssText = [
        'position:fixed', 'left:10px', 'bottom:10px', 'z-index:2147483002',
        'display:flex', 'align-items:center', 'gap:6px',
        'font:600 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace',
        'color:#eaf6ff', 'background:linear-gradient(180deg,#123047,#0b1c2b)',
        'border:1px solid rgba(120,220,255,.45)', 'border-radius:999px',
        'padding:6px 11px', 'box-shadow:0 4px 14px rgba(0,0,0,.5),0 0 12px rgba(80,200,255,.25)',
        'cursor:pointer', 'user-select:none', 'transition:filter .15s'
      ].join(';');
      badge.onmouseenter = function () { badge.style.filter = 'brightness(1.25)'; };
      badge.onmouseleave = function () { badge.style.filter = ''; };
      badge.onclick = function () { openPanel(); };
      const host = document.body || document.documentElement;
      if (!host) return;
      host.appendChild(badge);
    }
    badge.textContent = text;
    badge.title = title || '';
    const color = kind === 'err' ? '#ff6b6b' : kind === 'warn' ? '#fbbf24' : '#22d3ee';
    badge.style.borderColor = color;
    badge.style.boxShadow = '0 4px 14px rgba(0,0,0,.5), 0 0 12px ' + color + '55';
  }

  function openPanel() {
    const man = readCache();
    const files = (man && man.files) || [];
    const lines = [
      'HNB Remote Loader',
      'Repo: ' + OWNER + '/' + REPO + ' (' + BRANCH + '/' + DIR + ')',
      'Danh sách cache: ' + (man ? new Date(man.at).toLocaleString() : 'chưa có'),
      '',
      files.length ? files.map(function (f) { return ' • ' + f.name; }).join('\n') : '(chưa lấy được danh sách)',
      '',
      errors.length ? 'Lỗi:\n' + errors.map(function (e) { return ' ! ' + e; }).join('\n') : 'Không có lỗi.'
    ];
    const msg = lines.join('\n');
    if (window.confirm(msg + '\n\nBấm OK để TẢI LẠI ngay (bỏ qua cache).')) {
      errors.length = 0;
      runAll(true);
    }
  }

  /* ================== KHỞI ĐỘNG ================== */
  function boot() {
    try {
      if (sessionStorage.getItem('vl_hnb_ran') === '1') { log('Đã chạy ở lần tải này, bỏ qua.'); return; }
      sessionStorage.setItem('vl_hnb_ran', '1');
    } catch (e) { }

    runAll(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  // API cho console
  window.HNB = {
    reload: function () { errors.length = 0; return runAll(true); },
    list: function () { return (readCache() || {}).files || []; },
    errors: errors,
    clearCache: function () { try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(CACHE_KEY + '_code'); } catch (e) { } },
    config: { OWNER: OWNER, REPO: REPO, BRANCH: BRANCH, DIR: DIR }
  };
})();
