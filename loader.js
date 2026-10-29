// ==UserScript==
// @name         Võ Lâm 2D · HNB Remote Loader
// @namespace    https://lemoncode.ai/volam2d
// @version      1.8.0
// @description  Tự động tải & chạy các file .js trong thư mục hnb của GitHub. Tự chống cài trùng (1 badge duy nhất). Luôn cập nhật danh sách mới (file thêm/xoá trên repo có hiệu lực ngay lần tải trang sau). Bảng "Script" kéo được, bật/tắt từng script. Xoá file trên repo = script ngừng chạy; thêm file = tự chạy khi tải lại trang. [1.8.0] Không bao giờ trắng bảng: GitHub API lỗi (403 hết 60 lượt/giờ, 404 repo private, mất mạng) thì tự lấy danh sách từ jsDelivr, rồi danh sách đã lưu trong máy, rồi FALLBACK_FILES — và hiện rõ lý do ngay trong bảng.
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
// @connect      data.jsdelivr.com
// @connect      cdn.jsdelivr.net
// ==/UserScript==

(function () {
  'use strict';

  /* Chống cài trùng (nguyên nhân hiện 2 badge "Script x/y"):
   * @grant none => mọi bản loader chạy chung page context, nên cờ trên window
   * dùng được. Bản thứ 2 chỉ cảnh báo rồi thoát, không dựng thêm badge/panel
   * và không chạy lại các script trong hnb/ lần nữa. */
  if (window.__VL_HNB_LOADER_ACTIVE__) {
    try {
      console.warn('[HNB] Đã có 1 loader đang chạy trên trang này. Bản cài trùng tự thoát — ' +
        'vào Tampermonkey xoá bớt 1 bản để hết 2 badge.');
    } catch (e) { }
    return;
  }
  window.__VL_HNB_LOADER_ACTIVE__ = true;

  /* ================== CẤU HÌNH ==================
   * OWNER : chủ repo GitHub
   * REPO  : tên repo
   * BRANCH: nhánh chứa script
   * DIR   : thư mục chứa các file .js
   * Thứ tự chạy = alphabet của tên file. Muốn ép thứ tự, đặt tiền tố số:
   *   01-core.js, 02-ui.js, 03-hotkeys.js ...
   * FALLBACK_FILES: chỉ dùng khi CẢ GitHub API lẫn jsDelivr đều không lấy được
   *   danh sách (hết 60 lượt/giờ, mất mạng...). Repo PUBLIC -> để [].
   *   - Lưu ý: repo PRIVATE thì liệt kê tên vào đây CŨNG KHÔNG chạy được, vì
   *     raw.githubusercontent.com và cdn.jsdelivr.net đều không đọc được repo private.
   *     Lúc đó cần token (không an toàn khi nhúng vào app) hoặc để repo public + mã hoá file.
   * ============================================== */
  const OWNER = 'hanhatban2004';
  const REPO = 'volam2dscrip';
  const BRANCH = 'main';
  const DIR = 'hnb';

  // Loader nằm trong chính hnb/ (boot tải về) -> phải bỏ khỏi danh sách,
  // nếu không nó tự chạy lại và badge hiện "3/3" thay vì "2/2".
  const SELF_FILES = ['loader.js'];

  const FALLBACK_FILES = [
    // 'vi-du-script.js',
  ];

  const CACHE_KEY = 'vl_hnb_loader_v1';
  // GitHub API cho người chưa đăng nhập chỉ 60 request/giờ cho MỖI IP. Trong app
  // Android nhiều máy có thể dùng chung IP nhà mạng, nên giữ 60 giây để không bị 403.
  // Nút "+ Tải lại" và HNB.reload() luôn bỏ qua cache (force = true).
  const CACHE_TTL = 60 * 1000;
  const STALE_TTL = 6 * 60 * 60 * 1000;   // [1.8.0] cache còn dùng được trong 6 giờ khi GitHub lỗi
  const LOG = '[Script]';
  const VERSION = '1.8.0';   // hien trong tieu de bang de biet app dang chay ban loader nao

  // [1.8.0] Hai hook dưới đây CHỈ để tự thử nghiệm đường dự phòng, không ảnh hưởng lúc chạy thật.
  const API_HOST = window.__HNB_API_HOST || 'https://api.github.com';
  const JSD_HOST = window.__HNB_JSD_HOST || 'https://data.jsdelivr.com';
  let lastSource = '';   // 'github' | 'jsdelivr' | 'cache' | 'fallback'
  let lastReason = '';   // lý do khi không lấy được từ GitHub -> hiện thẳng trong bảng

  const isGame = /(^|\.)volam2d\.com$/i.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
  if (!isGame) return;

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
        if (!r.ok) {
          // [1.8.0] Giữ lại mã lỗi + header để nói rõ vì sao (403 hết lượt, 404 private...).
          const e = new Error('HTTP ' + r.status + ' ' + url);
          e.status = r.status;
          try { e.headers = r.headers; } catch (x) { }
          throw e;
        }
        return r.text();
      });
  }

  // [1.8.0] Dịch lỗi thành câu người dùng hiểu được.
  function describeErr(err) {
    const st = err && err.status;
    if (st === 403) {
      let left = '';
      try {
        const rst = err.headers && err.headers.get('x-ratelimit-reset');
        const rem = err.headers && err.headers.get('x-ratelimit-remaining');
        if (rst) left = ' (còn ~' + Math.max(0, Math.round(((+rst) * 1000 - Date.now()) / 60000)) + ' phút nữa là có lượt)';
        if (rem != null) left = ' (hết ' + rem + '/60 lượt cho IP này' + left + ')';
      } catch (e) { }
      return 'HTTP 403 — GitHub chặn vì hết 60 lượt truy cập/giờ' + left;
    }
    if (st === 404) return 'HTTP 404 — không thấy thư mục ' + DIR + '/ (repo đang private, sai tên repo/thư mục?)';
    if (st) return 'HTTP ' + st + ' từ GitHub';
    return (err && err.message) || 'không rõ lý do (mất mạng?)';
  }

  function srcLabel() {
    return lastSource === 'jsdelivr' ? 'jsDelivr (nguồn dự phòng)' :
      lastSource === 'fallback' ? 'danh sách ghi tay trong loader' :
        lastSource === 'cache' ? 'danh sách đã lưu trong máy' : (lastSource || 'GitHub');
  }

  // [1.8.0] Nguồn 2: jsDelivr (máy chủ khác GitHub, không bị giới hạn 60 lượt/giờ).
  function listFromJsdelivr() {
    const api = JSD_HOST + '/v1/package/gh/' + OWNER + '/' + REPO + '@' + BRANCH + '/flat';
    return fetchText(api).then(function (txt) {
      const arr = JSON.parse(txt);
      const all = (arr && arr.files) || [];
      const pre = '/' + DIR + '/';
      const files = all.filter(function (f) {
        const n = String((f && f.name) || '');
        return n.indexOf(pre) === 0 && /\.js$/i.test(n) &&
          SELF_FILES.indexOf(n.slice(pre.length)) < 0;
      }).map(function (f) {
        const nm = String(f.name).slice(pre.length);
        return {
          name: nm,
          sha: 'jsd' + (f.size || 0),
          size: f.size || 0,
          url: 'https://cdn.jsdelivr.net/gh/' + OWNER + '/' + REPO + '@' + BRANCH + '/' +
            DIR + '/' + encodeURIComponent(nm) + '?v=' + (f.size || 0)
        };
      });
      if (!files.length) return null;
      files.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return { at: Date.now(), src: 'jsdelivr', files: files, ignored: [] };
    }).catch(function () { return null; });
  }

  function getManifest(force) {
    const cached = readCache();
    const fresh = cached && (Date.now() - cached.at < CACHE_TTL);
    if (!force && fresh && cached.files && cached.files.length) return Promise.resolve(cached);

    const api = API_HOST + '/repos/' + OWNER + '/' + REPO +
      '/contents/' + encodeURIComponent(DIR) + '?ref=' + encodeURIComponent(BRANCH);

    return fetchText(api, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (txt) {
        const arr = JSON.parse(txt);
        if (!Array.isArray(arr)) {
          const msg = arr && arr.message ? arr.message : 'API trả về không phải mảng';
          throw new Error(msg + ' (repo private? hết quota 60/h?)');
        }
        const files = arr
          .filter(function (f) {
            return f.type === 'file' && /\.js$/i.test(f.name) &&
              SELF_FILES.indexOf(f.name) < 0;
          })
          .sort(function (a, b) { return a.name.localeCompare(b.name); })
          .map(function (f) {
            return {
              name: f.name,
              sha: f.sha,
              size: f.size || 0,
              url: 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' +
                BRANCH + '/' + DIR + '/' + encodeURIComponent(f.name) +
                '?v=' + encodeURIComponent(String(f.sha || '').slice(0, 12))
            };
          });
        // File bị xoá trên repo thì bỏ luôn khỏi cache code + danh sách bật/tắt,
        // để máy khách không còn giữ script cũ.
        const names = {};
        files.forEach(function (f) { names[f.name] = 1; });
        let pruned = 0;
        Object.keys(enabledMap).forEach(function (n) {
          if (!names[n]) { delete enabledMap[n]; pruned++; }
        });
        if (pruned) {
          saveEnabled();
          log('Đã bỏ ' + pruned + ' script không còn trên repo (đã xoá hoặc đổi tên).');
        }
        const keep = {};
        files.forEach(function (f) {
          const k = f.name + '@' + f.sha;
          if (codeCache.all[k]) keep[k] = codeCache.all[k];
        });
        codeCache.all = keep;
        saveCodeCache();

        // File không phải .js (vd 'user', 'readme.txt') bị bỏ qua — vẫn báo để
        // người dùng biết upload của mình đã lên nhưng sai tên/định dạng.
        const ignored = arr.filter(function (f) {
          return f.type === 'file' && !/\.js$/i.test(f.name);
        }).map(function (f) {
          return f.name + ' (' + (f.size || 0) + ' B)';
        });
        lastIgnored = ignored;
        if (ignored.length) {
          warn('Bỏ qua file không phải .js trong ' + DIR + '/: ' + ignored.join(', '));
        }

        const out = { at: Date.now(), src: 'github', files: files, ignored: ignored };
        lastSource = 'github'; lastReason = '';
        writeCache(out);
        log('Danh sách file:', files.map(function (f) { return f.name; }).join(', ') || '(trống)');
        return out;
      })
      .catch(function (err) {
        lastReason = describeErr(err);
        warn('Không lấy được danh sách từ GitHub:', lastReason);
        /* [1.8.0] Thứ tự dự phòng để KHÔNG BAO GIỜ trắng bảng:
         *   1. jsDelivr       (máy chủ khác, sống khi GitHub bị chặn/hết lượt)
         *   2. cache cũ còn mới (< 6 giờ)
         *   3. cache cũ (dù đã quá 6 giờ)
         *   4. FALLBACK_FILES (do người dùng ghi tay)
         *   5. không còn gì -> báo lỗi kèm LÝ DO ra bảng, không im lặng. */
        const hasCache = !!(cached && cached.files && cached.files.length);
        if (hasCache && (Date.now() - cached.at) < STALE_TTL) {
          warn('Dùng danh sách cache cũ (' + cached.files.length + ' file).');
          lastSource = cached.src || 'cache';
          return cached;
        }
        return listFromJsdelivr().then(function (man) {
          if (man) {
            lastSource = 'jsdelivr';
            warn('Lấy danh sách từ jsDelivr (' + man.files.length + ' file) — file mới up có thể chậm hơn GitHub vài giờ.');
            writeCache(man);
            return man;
          }
          if (hasCache) {
            warn('Dùng danh sách cache cũ đã quá 6 giờ (' + cached.files.length + ' file).');
            lastSource = cached.src || 'cache';
            return cached;
          }
          if (FALLBACK_FILES.length) {
            warn('Dùng FALLBACK_FILES (' + FALLBACK_FILES.length + ' file).');
            lastSource = 'fallback';
            return {
              at: Date.now(),
              src: 'fallback',
              files: FALLBACK_FILES.map(function (name) {
                return {
                  name: name,
                  sha: 'fallback',
                  size: 0,
                  url: 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' +
                    BRANCH + '/' + DIR + '/' + encodeURIComponent(name) +
                    '?v=' + Date.now()
                };
              })
            };
          }
          lastSource = 'none';
          throw err;   // không nguồn nào -> runAll báo lỗi, panel hiện lastReason
        });
      });
  }

  /* ================== TẢI & CHẠY ================== */
  // Mỗi file lưu nội dung theo sha -> đổi file trên GitHub là tự tải bản mới.
  const codeCache = {};
  try { codeCache.all = JSON.parse(localStorage.getItem(CACHE_KEY + '_code') || '{}'); } catch (e) { codeCache.all = {}; }

  function saveCodeCache() {
    try { localStorage.setItem(CACHE_KEY + '_code', JSON.stringify(codeCache.all)); } catch (e) { }
  }

  // raw.githubusercontent.com đôi khi trả 404 vài giây sau khi vừa upload file mới,
  // nên thử lại 2 lần với URL đổi query để không bỏ sót file mới.
  function getCode(file, tries) {
    const key = file.name + '@' + file.sha;
    if (codeCache.all[key]) return Promise.resolve(codeCache.all[key]);
    const n = tries || 0;
    const url = n ? file.url + '&r=' + n : file.url;
    return fetchText(url).then(function (code) {
      codeCache.all[key] = code;
      saveCodeCache();
      return code;
    }).catch(function (err) {
      if (n >= 2) throw err;
      return new Promise(function (res) { setTimeout(res, 700 * (n + 1)); })
        .then(function () { return getCode(file, n + 1); });
    });
  }

  // Chạy trong page context bằng thẻ <script> (tương đương @grant none, script lộ ra console).
  function runScript(code, name) {
    const s = document.createElement('script');
    s.textContent = code + '\n//# sourceURL=' + encodeURIComponent('hnb/' + name);
    s.setAttribute('data-hnb', name);
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  /* ================== BẬT / TẮT TỪNG SCRIPT ================== */
  // Trạng thái lưu riêng trên máy người dùng; file mới mặc định BẬT.
  const EN_KEY = CACHE_KEY + '_enabled';
  let enabledMap = {};
  try { enabledMap = JSON.parse(localStorage.getItem(EN_KEY) || '{}') || {}; } catch (e) { enabledMap = {}; }

  function saveEnabled() { try { localStorage.setItem(EN_KEY, JSON.stringify(enabledMap)); } catch (e) { } }
  function isOn(name) { return enabledMap[name] !== false; }
  function setOn(name, on) { enabledMap[name] = !!on; saveEnabled(); }
  function bulkOn(on) {
    const files = (readCache() || {}).files || [];
    files.forEach(function (f) { enabledMap[f.name] = on; });
    saveEnabled();
  }

  const errors = [];
  let lastFiles = [];
  let lastIgnored = [];   // file trong hnb/ không phải .js (vd: 'user') -> báo cho người dùng biết
  let lastRun = { at: 0, ran: 0, total: 0 };

  function runOne(file) {
    return getCode(file).then(function (code) {
      try {
        runScript(code, file.name);
        log('Đã chạy', file.name);
        return true;
      } catch (e) {
        errors.push(file.name + ': ' + e.message);
        warn('Lỗi chạy', file.name, e);
        return false;
      }
    }).catch(function (e) {
      errors.push(file.name + ': ' + e.message);
      warn('Lỗi tải', file.name, e.message);
      return false;
    });
  }

  function runAll(force) {
    return getManifest(force).then(function (man) {
      const all = man.files || [];
      lastFiles = all;
      lastIgnored = man.ignored || [];
      if (!all.length) {
        setBadge('Script 0', 'Thư mục ' + DIR + ' không có file .js', 'warn');
        return;
      }
      const files = all.filter(function (f) { return isOn(f.name); });
      errors.length = 0;
      let chain = Promise.resolve();
      files.forEach(function (f) {
        chain = chain.then(function () { return runOne(f); });
      });
      return chain.then(function () {
        lastRun = { at: Date.now(), ran: files.length - errors.length, total: all.length };
        const kind = errors.length ? 'err' : (files.length ? 'ok' : 'warn');
        setBadge('Script ' + files.length + '/' + all.length,
          (errors.length ? 'Lỗi: ' + errors.join(' | ') + ' — ' : '') +
          'Đang bật ' + files.length + '/' + all.length + ' script. Bấm để quản lý.',
          kind);
      });
    }).catch(function (e) {
      setBadge('Script !', 'Không tải được repo: ' + e.message + ' (repo phải PUBLIC hoặc điền FALLBACK_FILES)', 'err');
      warn(e);
    });
  }

  /* ================== BADGE ================== */
  let badge = null;
  let pendingBadge = null;
  document.addEventListener('DOMContentLoaded', function () {
    if (pendingBadge) setBadge(pendingBadge.text, pendingBadge.title, pendingBadge.kind);
  }, { once: true });

  const BADGE_POS_KEY = 'vl_hnb_badge_pos';

  function loadBadgePos() {
    try { return JSON.parse(localStorage.getItem(BADGE_POS_KEY) || 'null'); } catch (e) { return null; }
  }
  function saveBadgePos(x, y) {
    try { localStorage.setItem(BADGE_POS_KEY, JSON.stringify({ x: Math.round(x), y: Math.round(y) })); } catch (e) { }
  }
  function clampBadge() {
    if (!badge) return;
    const w = badge.offsetWidth, h = badge.offsetHeight;
    const maxX = Math.max(0, window.innerWidth - w - 4);
    const maxY = Math.max(0, window.innerHeight - h - 4);
    badge.style.left = Math.min(Math.max(0, badge.offsetLeft), maxX) + 'px';
    badge.style.top = Math.min(Math.max(0, badge.offsetTop), maxY) + 'px';
  }

  function makeBadgeDraggable() {
    let drag = null;
    let moved = false;
    badge.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      drag = { sx: e.clientX, sy: e.clientY, x: badge.offsetLeft, y: badge.offsetTop };
      moved = false;
      try { badge.setPointerCapture(e.pointerId); } catch (err) { }
      e.preventDefault();
    });
    badge.addEventListener('pointermove', function (e) {
      if (!drag) return;
      const dx = e.clientX - drag.sx;
      const dy = e.clientY - drag.sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      if (!moved) return;
      const maxX = Math.max(0, window.innerWidth - badge.offsetWidth - 4);
      const maxY = Math.max(0, window.innerHeight - badge.offsetHeight - 4);
      badge.style.left = Math.min(Math.max(0, drag.x + dx), maxX) + 'px';
      badge.style.top = Math.min(Math.max(0, drag.y + dy), maxY) + 'px';
    });
    function end(e) {
      if (!drag) return;
      drag = null;
      try { badge.releasePointerCapture(e.pointerId); } catch (err) { }
      if (moved) saveBadgePos(badge.offsetLeft, badge.offsetTop);
      else openPanel();
    }
    badge.addEventListener('pointerup', end);
    badge.addEventListener('pointercancel', end);
  }

  function setBadge(text, title, kind) {
    pendingBadge = { text: text, title: title, kind: kind };
    if (!document.body && document.readyState === 'loading') return;
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'vl-hnb-badge';
      const pos = loadBadgePos();
      const x = pos ? pos.x : 10;
      const y = pos ? pos.y : Math.round(window.innerHeight * 0.38);
      badge.style.cssText = [
        'position:fixed', 'left:' + x + 'px', 'top:' + y + 'px', 'z-index:2147483002',
        'display:flex', 'align-items:center', 'gap:6px',
        'font:600 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace',
        'color:#eaf6ff', 'background:linear-gradient(180deg,#123047,#0b1c2b)',
        'border:1px solid rgba(120,220,255,.45)', 'border-radius:999px',
        'padding:6px 11px', 'box-shadow:0 4px 14px rgba(0,0,0,.5),0 0 12px rgba(80,200,255,.25)',
        'cursor:grab', 'user-select:none', 'touch-action:none', 'transition:filter .15s'
      ].join(';');
      badge.onmouseenter = function () { badge.style.filter = 'brightness(1.25)'; };
      badge.onmouseleave = function () { badge.style.filter = ''; };
      const host = document.body || document.documentElement;
      if (!host) return;
      host.appendChild(badge);
      badge.title = 'Kéo để di chuyển · Bấm để mở bảng Script';
      makeBadgeDraggable();
      window.addEventListener('resize', clampBadge);
      clampBadge();
    }
    badge.textContent = text;
    if (title) badge.title = title + ' · Kéo để di chuyển';
    const color = kind === 'err' ? '#ff6b6b' : kind === 'warn' ? '#fbbf24' : '#22d3ee';
    badge.style.borderColor = color;
    badge.style.boxShadow = '0 4px 14px rgba(0,0,0,.5), 0 0 12px ' + color + '55';
  }

  /* ================== PANEL QUẢN LÝ ================== */
  let panelEl = null;
  const POS_KEY = 'vl_hnb_pos';

  function injectStyle() {
    if (document.getElementById('vl-hnb-style')) return;
    const st = document.createElement('style');
    st.id = 'vl-hnb-style';
    st.textContent = [
      '#vl-hnb-panel{position:fixed;left:0;top:0;z-index:2147483003;width:min(620px,94vw);max-height:82vh;display:flex;flex-direction:column;',
      'background:#1b1e2b;border:1px solid rgba(255,255,255,.09);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.6);',
      'color:#e9edf7;overflow:hidden;font-family:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;',
      'animation:vlhnb .16s ease-out}',
      '@keyframes vlhnb{from{opacity:0;transform:translateY(8px) scale(.99)}to{opacity:1;transform:none}}',
      '.vl-hnb-head{display:flex;align-items:center;gap:8px;padding:14px 16px 10px;cursor:move;touch-action:none;user-select:none}',
      '.vl-hnb-head button{cursor:pointer;touch-action:auto}',
      '.vl-hnb-title{font-size:17px;font-weight:700;letter-spacing:.2px}',
      '.vl-hnb-ver{font-size:11px;opacity:.55;margin-left:6px;align-self:center}',
      '.vl-hnb-count{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#2a2f42;color:#c9d3ea;',
      'font:600 11px/20px ui-monospace,Menlo,monospace;text-align:center}',
      '.vl-hnb-x{margin-left:auto;width:26px;height:26px;border:0;border-radius:7px;background:transparent;color:#8b95ab;',
      'font-size:15px;cursor:pointer;line-height:1}',
      '.vl-hnb-x:hover{background:#2a2f42;color:#fff}',
      '.vl-hnb-tools{display:flex;gap:8px;padding:0 16px 10px;flex-wrap:wrap}',
      '.vl-hnb-tool{background:transparent;border:1px solid #d9a441;color:#e8c06a;border-radius:8px;padding:7px 11px;',
      'font:600 12px/1 inherit;cursor:pointer;transition:background .15s,color .15s}',
      '.vl-hnb-tool:hover{background:rgba(217,164,65,.14);color:#ffd98a}',
      '.vl-hnb-bulk{display:flex;align-items:center;gap:14px;padding:0 16px 8px;font-size:12px}',
      '.vl-hnb-bulk a{color:#8ab4ff;text-decoration:none;cursor:pointer}',
      '.vl-hnb-bulk a:hover{text-decoration:underline}',
      '.vl-hnb-ratio{margin-left:auto;color:#98a2b8;font-size:11px}',
      '.vl-hnb-list{overflow:auto;padding:2px 16px 10px;display:flex;flex-direction:column;gap:8px}',
      '.vl-hnb-card{background:#222635;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:9px 10px}',
      '.vl-hnb-row1{display:flex;align-items:flex-start;gap:9px}',
      '.vl-hnb-pill{flex:0 0 auto;min-width:44px;padding:6px 8px;border-radius:6px;font:700 10px/1 ui-monospace,Menlo,monospace;',
      'letter-spacing:.6px;cursor:pointer;text-align:center;transition:filter .15s}',
      '.vl-hnb-pill.on{background:rgba(34,197,94,.15);border:1px solid rgba(74,222,128,.45);color:#4ade80}',
      '.vl-hnb-pill.off{background:rgba(255,77,109,.13);border:1px solid rgba(255,107,107,.42);color:#ff6b6b}',
      '.vl-hnb-pill:hover{filter:brightness(1.25)}',
      '.vl-hnb-info{min-width:0;flex:1 1 auto}',
      '.vl-hnb-name{font-size:13px;font-weight:600;color:#f3f6ff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.vl-hnb-meta{font-size:11px;color:#98a2b8;margin-top:2px}',
      '.vl-hnb-meta b{color:#c9d3ea;font-weight:600}',
      '.vl-hnb-empty{padding:18px 6px;color:#8b95ab;font-size:12px;text-align:center}',
      '.vl-hnb-foot{padding:10px 16px 13px;border-top:1px solid rgba(255,255,255,.07);font-size:11px;color:#e8c06a;line-height:1.5}',
      '.vl-hnb-foot span{color:#98a2b8}',
      '.vl-hnb-foot button{margin-left:6px;background:transparent;border:1px solid rgba(255,255,255,.16);color:#c9d3ea;',
      'border-radius:6px;padding:4px 8px;font:600 11px/1 inherit;cursor:pointer}'
    ].join('');
    (document.head || document.documentElement).appendChild(st);
  }

  function fmtSize(n) {
    if (!n) return '? KB';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function renderPanel() {
    if (!panelEl) return;
    const man = readCache();
    const files = (man && man.files) || [];
    const onCount = files.filter(function (f) { return isOn(f.name); }).length;
    const list = panelEl.querySelector('.vl-hnb-list');

    panelEl.querySelector('.vl-hnb-count').textContent = String(files.length);
    panelEl.querySelector('.vl-hnb-ratio').textContent = onCount + '/' + files.length + ' đang bật';
    if (files.length) {
      const kind = errors.length ? 'err' : (onCount ? 'ok' : 'warn');
      setBadge('Script ' + onCount + '/' + files.length,
        (errors.length ? 'Lỗi: ' + errors.join(' | ') + ' — ' : '') +
        'Đang bật ' + onCount + '/' + files.length + ' script. Bấm để quản lý.' +
        (lastIgnored.length ? ' | Bỏ qua (không phải .js): ' + lastIgnored.join(', ') : ''), kind);
    }

    list.innerHTML = '';

    if (!files.length) {
      list.appendChild(el('div', 'vl-hnb-empty',
        '⚠ Chưa lấy được danh sách file: ' + (lastReason || 'chưa rõ lý do') +
        ' · Bấm "+ Tải lại" để thử lại (nếu 403: chờ hết giờ là có lượt).'));
      return;
    }

    if (lastIgnored.length) {
      list.appendChild(el('div', 'vl-hnb-empty',
        '⚠ Bỏ qua trong ' + DIR + '/ (không phải .js): ' + lastIgnored.join(', ')));
    }

    if (lastSource && lastSource !== 'github') {
      list.appendChild(el('div', 'vl-hnb-empty',
        '⚠ Danh sách lấy từ ' + srcLabel() + (lastReason ? ' — GitHub: ' + lastReason : '') +
        ' · Bấm "+ Tải lại" để thử lấy lại từ GitHub.'));
    }

    files.forEach(function (f) {
      const card = el('div', 'vl-hnb-card');
      const row1 = el('div', 'vl-hnb-row1');

      const pill = el('button', 'vl-hnb-pill ' + (isOn(f.name) ? 'on' : 'off'), isOn(f.name) ? 'BẬT' : 'TẮT');
      pill.title = isOn(f.name) ? 'Bấm để tắt script này' : 'Bấm để bật script này';
      pill.onclick = function () {
        const next = !isOn(f.name);
        setOn(f.name, next);
        if (next) runOne(f);
        renderPanel();
      };

      const info = el('div', 'vl-hnb-info');
      info.appendChild(el('div', 'vl-hnb-name', f.name));
      const meta = el('div', 'vl-hnb-meta');
      meta.innerHTML = '<b>' + fmtSize(f.size) + '</b> · ' + String(f.sha || '').slice(0, 7) +
        ' · ' + (isOn(f.name) ? 'đang bật' : 'đã tắt (áp dụng sau khi tải lại trang)');
      info.appendChild(meta);

      row1.appendChild(pill);
      row1.appendChild(info);

      card.appendChild(row1);
      list.appendChild(card);
    });
  }

  function loadPos() {
    try { return JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (e) { return null; }
  }
  function savePos(x, y) { try { localStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(x), y: Math.round(y) })); } catch (e) { } }

  function placePanel() {
    if (!panelEl) return;
    const w = panelEl.offsetWidth;
    const h = panelEl.offsetHeight;
    const saved = loadPos();
    let x = saved ? saved.x : Math.round((window.innerWidth - w) / 2);
    let y = saved ? saved.y : Math.max(52, Math.round(window.innerHeight * 0.1));
    x = Math.min(Math.max(0, x), Math.max(0, window.innerWidth - w - 6));
    y = Math.min(Math.max(0, y), Math.max(0, window.innerHeight - Math.min(h, 120) - 6));
    panelEl.style.left = x + 'px';
    panelEl.style.top = y + 'px';
  }

  function makeDraggable(head) {
    let drag = null;
    head.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || (e.target.closest && e.target.closest('button'))) return;
      const r = panelEl.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      try { head.setPointerCapture(e.pointerId); } catch (err) { }
      e.preventDefault();
    });
    head.addEventListener('pointermove', function (e) {
      if (!drag) return;
      const maxX = Math.max(0, window.innerWidth - panelEl.offsetWidth - 6);
      const maxY = Math.max(0, window.innerHeight - 44);
      const x = Math.min(Math.max(0, e.clientX - drag.dx), maxX);
      const y = Math.min(Math.max(0, e.clientY - drag.dy), maxY);
      panelEl.style.left = x + 'px';
      panelEl.style.top = y + 'px';
    });
    function end(e) {
      if (!drag) return;
      drag = null;
      try { head.releasePointerCapture(e.pointerId); } catch (err) { }
      const r = panelEl.getBoundingClientRect();
      savePos(r.left, r.top);
    }
    head.addEventListener('pointerup', end);
    head.addEventListener('pointercancel', end);
  }

  function openPanel() {
    if (panelEl) { renderPanel(); return; }
    injectStyle();
    panelEl = el('div');
    panelEl.id = 'vl-hnb-panel';

    const head = el('div', 'vl-hnb-head');
    head.appendChild(el('span', 'vl-hnb-title', 'Script của tôi'));
    head.appendChild(el('span', 'vl-hnb-ver', 'v' + VERSION));
    head.appendChild(el('span', 'vl-hnb-count', '0'));
    const x = el('button', 'vl-hnb-x', '✕');
    x.title = 'Đóng (Esc)';
    x.onclick = closePanel;
    head.appendChild(x);

    const tools = el('div', 'vl-hnb-tools');
    const tReload = el('button', 'vl-hnb-tool', '+ Tải lại');
    tReload.onclick = function () {
      tReload.textContent = '...';
      errors.length = 0;
      runAll(true).then(function () {
        tReload.textContent = '+ Tải lại';
        renderPanel();
      });
    };
    tools.appendChild(tReload);

    const bulk = el('div', 'vl-hnb-bulk');
    const aAll = el('a', '', 'Bật tất cả');
    aAll.onclick = function () {
      const before = {};
      lastFiles.forEach(function (f) { before[f.name] = isOn(f.name); });
      bulkOn(true);
      lastFiles.forEach(function (f) { if (!before[f.name]) runOne(f); });
      renderPanel();
    };
    const aNone = el('a', '', 'Tắt tất cả');
    aNone.onclick = function () { bulkOn(false); renderPanel(); };
    bulk.appendChild(aAll);
    bulk.appendChild(aNone);
    bulk.appendChild(el('span', 'vl-hnb-ratio', '0/0 đang bật'));

    const list = el('div', 'vl-hnb-list');

    const foot = el('div', 'vl-hnb-foot');
    foot.appendChild(document.createTextNode('Bấm BẬT để script tự chạy mỗi lần vào game.'));
    foot.appendChild(el('br'));
    foot.appendChild(el('span', '', 'Tắt script có hiệu lực sau khi tải lại trang.'));
    const bRe = el('button', '', 'Tải lại trang');
    bRe.onclick = function () { location.reload(); };
    foot.appendChild(bRe);

    panelEl.appendChild(head);
    panelEl.appendChild(tools);
    panelEl.appendChild(bulk);
    panelEl.appendChild(list);
    panelEl.appendChild(foot);
    document.body.appendChild(panelEl);
    placePanel();
    makeDraggable(head);
    window.addEventListener('resize', placePanel);
    document.addEventListener('keydown', onKey, true);
    renderPanel();
  }

  function closePanel() {
    if (!panelEl) return;
    window.removeEventListener('resize', placePanel);
    document.removeEventListener('keydown', onKey, true);
    panelEl.remove();
    panelEl = null;
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePanel(); }
  }

  /* ================== KHỞI ĐỘNG ================== */
  // Mỗi lần tải trang Tampermonkey chạy IIFE đúng 1 lần (@noframes lo iframe),
  // nên không dùng sessionStorage: cờ đó sẽ chặn luôn các lần tải trang sau trong cùng tab.
  function boot() { runAll(false); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  // API cho console
  window.HNB = {
    reload: function () { errors.length = 0; return runAll(true); },
    status: function () {
      return {
        source: lastSource, reason: lastReason,
        files: (readCache() || {}).files || [], errors: errors.slice()
      };
    },
    list: function () { return (readCache() || {}).files || []; },
    errors: errors,
    clearCache: function () {
      try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_KEY + '_code');
      } catch (e) { }
      codeCache.all = {};
      errors.length = 0;
      return runAll(true);
    },
    show: openPanel,
    enabled: function () { return Object.assign({}, enabledMap); },
    setEnabled: function (name, on) { setOn(name, on); renderPanel(); },
    config: { OWNER: OWNER, REPO: REPO, BRANCH: BRANCH, DIR: DIR }
  };
})();
