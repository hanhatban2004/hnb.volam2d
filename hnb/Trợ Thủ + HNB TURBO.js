// ==UserScript==
// @name         Võ Lâm Pixel – Trọn bộ (Giao diện mới + Trợ thủ + Chibi + HNB Turbo)
// @namespace    volam2d-tron-bo
// @version      2.9.0
// @description  Gộp 1 script: giao diện kính mờ hiện đại, Trợ thủ tự động (hồi sinh, nhiệm vụ, đập đồ, thú cưỡi), bảng Nhân vật 4 tab, ngoại hình Chibi, HNB Turbo giảm lag (FPS, độ phân giải, hiệu ứng, FPS/Ping). [2.1.0] Đi tới mọi bản đồ (đường nhiều chặng) + tự dùng Xa Phu; bảng Xa Phu của game được thay bằng bảng riêng đủ mọi map, tự cập nhật khi có map mới. [2.1.1] Bấm map là bay ngay: uỷ nhiệm sự kiện (game vẽ lại vẫn ăn) + bấm được cả dòng + báo rõ khi máy chủ không đổi map. [2.2.0] Chỉ gửi teleport khi Xa Phu thật sự có tuyến (lấy từ chính máy chủ); map không có tuyến thì tự đi bộ + hiện nút "🚶 đi bộ"; máy chủ từ chối thì in nguyên văn lý do. [2.3.0] Nhiệm vụ cốt truyện chạy chắc hơn (tự bấm "Bỏ qua" hội thoại, tự đặt lại đường đi tới NPC, tự nhích khi kẹt vật cản, không đứng im ở bước mua đồ/mặc đồ); THÊM tab tự đánh PHÓ BẢN (tự tìm Phó Bản Sứ Giả, chọn phó bản còn lượt vừa cấp, vào đánh từng đợt bằng Tự động đánh, xong thì ra vào tiếp) và tự LÀM nhiệm vụ hằng ngày (không chỉ nhận thưởng). [2.3.1] Đúng nguyên tắc "phải bật mới chạy": tự LÀM nhiệm vụ hằng ngày mặc định TẮT, script KHÔNG tự bật "Tự động đánh" nữa (có ô cho phép riêng, mặc định TẮT; chỉ tắt lại đúng cái nó đã bật); không vào phó bản khi chưa có cách đánh, tự ra nếu phó bản đứng im 90 giây, phó bản thất bại thì đổi cái khác, ưu tiên phó bản của nhiệm vụ ngày, không hành động khi đang chết. [2.3.2] Sửa nút Dừng: bấm là tắt HẾT (nhiệm vụ cốt truyện, phó bản, tự làm nhiệm vụ hằng ngày, tự nhận thưởng, hồi sinh, đập đồ, thú cưỡi), buông đường đi/Xa Phu đang chờ, trả lại công tắc "Tự động đánh" nếu chính script đã bật; tách "Nhiệm vụ hằng ngày" thành ô riêng có nút bật/tắt và dòng trạng thái mục tiêu. [2.4.0] Thêm ô riêng "Nhiệm vụ môn phái" (mặc định TẮT): tự về môn phái bằng Xa Phu, tới Trưởng Môn nhận/trả nhiệm vụ, đi đúng bản đồ diệt quái · hạ quái tinh anh · đưa thư, lặp tới khi hết lượt ngày; nhớ NPC Trưởng Môn để lần sau đi thẳng; sai môn phái thì tự tắt và báo; nhường đường cho "Tự làm nhiệm vụ"/phó bản; không tự bật "Tự động đánh" ngoài ô cho phép. [2.5.0] Tự đánh bằng chiêu của nhân vật, KHÔNG bật "Tự động đánh": tự chọn đúng quái mà nhiệm vụ (môn phái / hằng ngày) ghi tên, tự đi tới bằng chase, tự bấm chiêu mạnh nhất đang sẵn sàng đủ tầm đủ MP (hết MP thì đánh thường, chỉ buff thì báo không có chiêu đánh), chống spam 100ms/chiêu; bỏ hẳn việc script tự bật Tự động đánh cho nhiệm vụ môn phái và nhiệm vụ hằng ngày. [2.6.0] AL cho nhiệm vụ môn phái: không còn đứng im — chưa biết Trưởng Môn ở đâu thì tự đi qua các bản đồ môn phái (gamedata maps[].sect), gặp phái khác thì bỏ bản đồ đó đi tiếp, nhớ NPC + bản đồ khi đúng phái; bản đồ hiện tại không có quái nhiệm vụ thì tự sang bản đồ có quái (maps[].mons, gần cấp nhất); "đưa thư" tự đọc tên người nhận + bản đồ trong nội dung; hỏi NPC tối đa 3 lần/30 giây. [2.7.0] THÊM ô riêng "Áp tiêu tự động" (mặc định TẮT): tự tìm Long Môn Tiêu Cục (nhớ NPC, chưa biết thì dò 5 thành trấn), nhận tuyến vừa cấp + đủ tiền cọc (chọn Tự chọn/Đồng/Bạc/Vàng), giữ xe tiêu sát bên, đi qua cổng theo lộ trình máy chủ (es.next) tới Phân Đà Tiêu Cục giao tiêu; xe tụt lại thì đợi, xe ở bản đồ khác thì quay lại đón, quái đánh xe thì tự bấm chiêu bảo vệ (không bật "Tự động đánh"); nhường đường cho "Tự làm nhiệm vụ"/phó bản, bấm Dừng là dừng cả áp tiêu. [2.8.0] THÊM "BỘ NÃO AI" dùng chung cho MỌI auto (ô riêng, mặc định BẬT): theo dõi bản đồ + ô đứng + trạng thái để biết auto nào đứng yên quá 9 giây, rồi tự chữa theo thang (nhích thử → xoá đường cũ tính lại → tạm tránh bản đồ đang kẹt 45 giây và đi đường vòng → thôi can thiệp 30 giây); watchdog riêng cho lúc đi bộ (đặt đường mà 2,6 giây không nhúc nhích) và lúc chase của game bị kẹt; một người lái duy nhất (nhiệm vụ > phó bản > áp tiêu > môn phái > hằng ngày) nên các auto không giành đường đi của nhau; không can thiệp khi bạn tự đi/đang đánh hoặc khi không bật auto nào; bấm Dừng thì AI cũng đặt lại. [2.9.0] Bảng Xa Phu chỉ hiện ĐÚNG các tuyến mà Xa Phu đang có (danh sách máy chủ gửi khi mở NPC) — bỏ hết map tự thêm/suy đoán khỏi bảng NPC; và chỉ thay bảng khi NPC đang mở đúng là Xa Phu (trước đây mở thợ rèn/tạp hoá sau khi ghé Xa Phu cũng bị dán bảng bản đồ). Muốn đi bộ tới map không có tuyến thì dùng bảng 🧭 Dịch chuyển nhanh (vẫn đủ map).
// @match        https://volam2d.com/*
// @match        http://volam2d.com/*
// @match        https://*.volam2d.com/*
// @match        http://localhost/*
// @match        http://127.0.0.1/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/*!
 * VÕ LÂM PIXEL – TRỘN BỘ 2.5.0
 * Gồm 4 mô-đun chạy độc lập trong cùng một file (mỗi mô-đun có khóa chống chạy trùng):
 *   1) HNB Turbo     – giới hạn FPS, hạ độ phân giải, bớt hiệu ứng, dọn bộ nhớ, đo FPS/Ping.  Cài đặt → tab "⚡ HNB Turbo"
 *   2) Giao diện mới – HUD kính mờ, thanh chức năng dọc, bảng Nhân vật 4 tab (Nhân vật · Túi đồ · Võ công · Thú cưỡi)
 *   3) Trợ thủ       – tự hồi sinh, tự làm nhiệm vụ, đập đồ tự động, nâng thú cưỡi tự động
 *   4) Chibi         – đổi ngoại hình nhân vật thành dạng chibi.  Cài đặt → khung "Ngoại hình Chibi"
 *
 * Cách dùng:
 *   - Tampermonkey / Violentmonkey: tạo script mới, dán toàn bộ file, lưu. (Gỡ / tắt các script lẻ cũ.)
 *   - Tự host: chép vào js/ và chèn vào <head> của index.html, ĐẶT TRƯỚC tất cả các thẻ <script> khác:
 *       <script src="js/volam-tron-bo.user.js"></script>
 *
 * Phím tắt:  F6 = bật/tắt đồng hồ FPS · F7 = tab HNB Turbo · F8 = Trợ thủ · F9 = giao diện cũ / mới
 *            C / I / K / M = các tab của bảng Nhân vật (giữ nguyên của game)
 */

/* ===================================================================================
 *  MÔ-ĐUN 1 · HNB TURBO (chạy đầu tiên để kịp bọc requestAnimationFrame / devicePixelRatio)
 * =================================================================================== */
(function () {
  'use strict';
  if (window.HNBT) return;

  // ===================== CẤU HÌNH =====================
  const KEY = 'hnbt_cfg';
  const PRESETS = {
    // scale: tỉ lệ độ phân giải canvas (<1 = vẽ ít điểm ảnh hơn rồi phóng to) · fx: hệ số hạt hiệu ứng · fps: giới hạn khung hình (0 = không giới hạn)
    ultra:  { label: 'Siêu nhẹ', desc: 'Máy rất yếu / điện thoại cũ', scale: 0.6, fx: 0.2,  fps: 30, lowFx: true,  shadow: false, vignette: false, shake: false, names: false, cssFx: false,
              othersFx: false, othersAura: false, othersMount: false, othersName: false, pets: false, weather: false, ultCrack: false, flash: false, bubbles: false, corpses: false, ghosts: false, dmgLite: true },
    low:    { label: 'Nhẹ',      desc: 'Điện thoại tầm trung',         scale: 0.8, fx: 0.35, fps: 45, lowFx: true,  shadow: false, vignette: false, shake: false, names: true,  cssFx: false,
              othersFx: false, othersAura: false, othersMount: false, othersName: true,  pets: false, weather: false, ultCrack: false, flash: false, bubbles: true,  corpses: true,  ghosts: false, dmgLite: true },
    medium: { label: 'Cân bằng', desc: 'Khuyên dùng cho đa số máy',    scale: 1,   fx: 0.6,  fps: 60, lowFx: false, shadow: true,  vignette: true,  shake: true,  names: true,  cssFx: true,
              othersFx: true,  othersAura: true,  othersMount: true,  othersName: true,  pets: true,  weather: true,  ultCrack: true,  flash: true,  bubbles: true,  corpses: true,  ghosts: true,  dmgLite: true },
    high:   { label: 'Đẹp nhất', desc: 'PC / máy mạnh',                scale: 2,   fx: 1,    fps: 0,  lowFx: false, shadow: true,  vignette: true,  shake: true,  names: true,  cssFx: true,
              othersFx: true,  othersAura: true,  othersMount: true,  othersName: true,  pets: true,  weather: true,  ultCrack: true,  flash: true,  bubbles: true,  corpses: true,  ghosts: true,  dmgLite: false }
  };
  const { label: _l, desc: _d, ...MED } = PRESETS.medium;
  const DEF = Object.assign({ preset: 'medium', hud: true, chatMax: 60, floatMax: 40, fxMax: 160, autoDown: true, panelFps: true, idleFps: true }, MED);
  let cfg;
  try { cfg = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); delete cfg.label; delete cfg.desc; } catch (e) { cfg = Object.assign({}, DEF); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { } };

  // ===================== 1. GIỚI HẠN FPS =====================
  const rawRAF = window.requestAnimationFrame.bind(window);
  let lastFire = 0;
  const stats = { fps: 0, frames: 0, t0: performance.now(), ping: -1 };
  let nextDue = 0, focused = true;
  window.addEventListener('blur', () => { focused = false; });
  window.addEventListener('focus', () => { focused = true; });
  function effCap() {
    let cap = cfg.fps | 0;
    const G = window.G;
    if (G && G.inGame) {
      if (cfg.idleFps && !focused) cap = cap ? Math.min(cap, 10) : 10;
      else if (cfg.panelFps) { const pn = document.getElementById('panel'); if (pn && !pn.classList.contains('hidden')) cap = cap ? Math.min(cap, 24) : 24; }
    }
    return cap;
  }
  window.requestAnimationFrame = function (cb) {
    return rawRAF(function tick(now) {
      const cap = effCap();
      if (cap > 0 && now !== lastFire) {
        const interval = 1000 / cap;
        if (now < nextDue - 1) { rawRAF(tick); return; }
        nextDue = Math.max(nextDue + interval, now);
      }
      if (now !== lastFire) { stats.frames++; lastFire = now; trimArrays(); }
      cb(now);
    });
  };

  // ===================== 2. ĐỘ PHÂN GIẢI CANVAS =====================
  const nativeDPR = window.devicePixelRatio || 1;
  try {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      get() { return Math.max(0.5, Math.min(nativeDPR, cfg.scale || 1)); }
    });
  } catch (e) { }

  // ===================== 3. TẮT shadowBlur =====================
  try {
    const P = CanvasRenderingContext2D.prototype, d = Object.getOwnPropertyDescriptor(P, 'shadowBlur');
    if (d && d.set) Object.defineProperty(P, 'shadowBlur', { configurable: true, get: d.get, set(v) { d.set.call(this, cfg.shadow ? v : 0); } });
  } catch (e) { }

  // ===================== 4. MÓC VÀO GAME =====================
  function hookGame() {
    const G = window.G;
    if (!G || !G.gfx || !G.setGfx) return false;
    const gfx = G.gfx;
    Object.defineProperty(gfx, 'fx', { configurable: true, get: () => cfg.fx, set: () => { } });
    Object.defineProperty(gfx, 'lowFx', { configurable: true, get: () => !!cfg.lowFx, set: () => { } });
    applyGame();
    return true;
  }
  const isSelf = (x, y) => { const s = window.G && G.self; return s && Math.abs(s.x - x) < 0.5 && Math.abs(s.y - y) < 0.5; };
  function wrap(obj, name, fn) { if (!obj || typeof obj[name] !== 'function' || obj[name].__hnbt) return; const raw = obj[name]; obj[name] = fn(raw); obj[name].__hnbt = true; }
  let lastWeather = null, dmgWin = [];
  function hookModules() {
    if (!window.Auras || !window.Overhead || !window.Weather || !window.FX || !window.Pet) return false;
    wrap(window.Auras, 'draw', raw => function (ctx, x, y) { if (!cfg.othersAura && !isSelf(x, y)) return; return raw.apply(this, arguments); });
    if (window.MountFX) for (const k of ['under', 'over']) wrap(MountFX, k, raw => function (ctx, id, x, y) { if (!cfg.othersMount && !isSelf(x, y)) return; return raw.apply(this, arguments); });
    wrap(Overhead, 'drawNameplate', raw => function (ctx, x, top, o) { if (!cfg.othersName && o && !o.self) return top - 6; return raw.apply(this, arguments); });
    wrap(Overhead, 'drawBubble', raw => function () { if (!cfg.bubbles) return false; return raw.apply(this, arguments); });
    wrap(Overhead, 'add', raw => function (x, y, text, kind) {
      if (cfg.dmgLite && kind === 'hit') { const t = performance.now(); dmgWin = dmgWin.filter(v => t - v < 300); if (dmgWin.length >= 6) return; dmgWin.push(t); }
      return raw.apply(this, arguments);
    });
    wrap(Weather, 'set', raw => function (w) { lastWeather = arguments; if (!cfg.weather) { const a = [...arguments]; a[0] = 'clear'; a[2] = true; return raw.apply(this, a); } return raw.apply(this, arguments); });
    wrap(FX, 'spawn', raw => function (f) { const G = window.G; if (!cfg.othersFx && f && f.from != null && G && f.from !== G.you && f.to !== G.you && f.t !== 'levelup') return; return raw.apply(this, arguments); });
    wrap(FX, 'flash', raw => function () { if (!cfg.flash) return null; return raw.apply(this, arguments); });
    wrap(Pet, 'collect', raw => function () { if (!cfg.pets) return; return raw.apply(this, arguments); });
    if (window.UltFX) wrap(UltFX, 'crack', raw => function () { if (!cfg.ultCrack) return; return raw.apply(this, arguments); });
    return true;
  }
  let weatherWas = null;
  function applyWeather() {
    if (weatherWas === cfg.weather || !window.Weather || !lastWeather) { weatherWas = cfg.weather; return; }
    weatherWas = cfg.weather;
    try { Weather.set.apply(Weather, lastWeather); } catch (e) { }
  }

  function applyGame() {
    const G = window.G; if (!G || !G.setGfx) return;
    try { G.setGfx('high'); } catch (e) { }
    applyWeather();
    if (G.settings) { G.settings.shake = !!cfg.shake; G.settings.names = !!cfg.names; }
    try { G.saveSettings(); } catch (e) { }
  }

  function trimArrays() {
    const G = window.G; if (!G) return;
    if (G.floats && G.floats.length > cfg.floatMax) G.floats.splice(0, G.floats.length - cfg.floatMax);
    if (G.fx && G.fx.length > cfg.fxMax) G.fx.splice(0, G.fx.length - cfg.fxMax);
    if (G.corpses && G.corpses.length > (cfg.corpses ? 30 : 0)) G.corpses.splice(0, G.corpses.length - (cfg.corpses ? 30 : 0));
    if (!cfg.ghosts && G.ghosts && G.ghosts.length) G.ghosts.length = 0;
    if (!cfg.othersFx && G.fx && G.fx.length && G.you != null) {
      let w = 0; for (const f of G.fx) if (f.from === G.you || f.to === G.you || f.t === 'levelup' || f.from == null) G.fx[w++] = f; G.fx.length = w;
    }
  }

  // ===================== 5. TỐI ƯU DOM =====================
  function trimChat() {
    const log = document.getElementById('chat-log'); if (!log) return;
    const max = cfg.chatMax | 0 || 60;
    while (log.children.length > max) log.firstChild.remove();
  }
  function watchDom() {
    const log = document.getElementById('chat-log');
    if (log) new MutationObserver(trimChat).observe(log, { childList: true });
    const toasts = document.getElementById('toasts');
    if (toasts) new MutationObserver(() => { while (toasts.children.length > 4) toasts.firstChild.remove(); }).observe(toasts, { childList: true });
  }

  // ===================== 6. ĐO FPS / PING =====================
  function measure() {
    const now = performance.now();
    stats.fps = Math.round(stats.frames * 1000 / (now - stats.t0));
    stats.frames = 0; stats.t0 = now;
    autoDown();
    renderHud();
    const lv = document.getElementById('hnbt-live'); if (lv) lv.textContent = stats.fps + ' · ' + (stats.ping < 0 ? '–' : stats.ping + ' ms');
  }
  let lagCount = 0;
  const SC_STEPS = [2, 1.5, 1, 0.8, 0.6];
  function autoDown() {
    const G = window.G;
    if (!cfg.autoDown || !G || !G.inGame || document.hidden || !focused) { lagCount = 0; return; }
    const pn = document.getElementById('panel'); if (pn && !pn.classList.contains('hidden')) { lagCount = 0; return; }
    const target = (cfg.fps | 0) || 60;
    if (stats.fps > 0 && stats.fps < target * 0.7) lagCount++; else lagCount = 0;
    if (lagCount < 6) return;
    lagCount = 0;
    const curSc = Math.min(cfg.scale, nativeDPR);
    const nextSc = SC_STEPS.find(v => v < curSc - 1e-6);
    let msg = '';
    if (nextSc) { cfg.scale = nextSc; msg = 'độ phân giải ' + Math.round(nextSc * 100) + '%'; }
    else if (cfg.fx > 0.2) { cfg.fx = cfg.fx > 0.35 ? 0.35 : 0.2; msg = 'bớt hiệu ứng hạt'; }
    else if (cfg.othersFx || cfg.othersAura || cfg.weather) { cfg.othersFx = cfg.othersAura = cfg.othersMount = cfg.weather = false; msg = 'ẩn hiệu ứng người khác & thời tiết'; }
    else return;
    cfg.preset = 'custom'; save(); applyClasses(); applyGame();
    try { window.UI && UI.toast && UI.toast('⚡ HNB Turbo: máy đang giật, tự giảm ' + msg, 'info'); } catch (e) { }
  }
  async function pingLoop() {
    if (cfg.hud && !document.hidden) {
      const t = performance.now();
      try { await fetch('/manifest.json?p=' + Date.now(), { method: 'HEAD', cache: 'no-store' }); stats.ping = Math.round(performance.now() - t); }
      catch (e) { stats.ping = -1; }
    }
    setTimeout(pingLoop, 8000);
  }

  // ===================== 7. CSS HIỆU NĂNG =====================
  const CSS = `
html.hnbt-lite *, html.hnbt-lite *::before, html.hnbt-lite *::after { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; }
html.hnbt-lite #hud *, html.hnbt-lite #panel * { text-shadow: none !important; filter: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
html.hnbt-lite #mui-player, html.hnbt-lite #mui-target, html.hnbt-lite #mui-rail, html.hnbt-lite #mui-more, html.hnbt-lite #mh-chip { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
html.hnbt-novig #vignette { display: none !important; }
html.hnbt-pix #game { image-rendering: pixelated; image-rendering: crisp-edges; }
#hud-status, #chat, #skillbar, #menu-buttons, #tracker, #mini-wrap, #target-frame { contain: layout style; }
#chat-log { contain: content; }
#hnbt-hud { position: fixed; z-index: 30; top: 12px; left: 272px; display: none; align-items: baseline; gap: 4px; font: 700 11px/1 "Be Vietnam Pro", system-ui, sans-serif;
  color: #ddd; background: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.15); padding: 4px 9px; border-radius: 99px; cursor: pointer; white-space: nowrap; }
html.mui #hnbt-hud { background: rgba(10,16,28,.72); border-color: rgba(255,255,255,.1); padding: 5px 10px; }
#hnbt-hud small { font-size: 9px; opacity: .7; } #hnbt-hud i { width: 1px; height: 10px; background: rgba(255,255,255,.25); margin: 0 4px; align-self: center; }
#hnbt-hud .ok { color: #4ade80; } #hnbt-hud .mid { color: #ffd76a; } #hnbt-hud .bad { color: #ff6b6b; }
.hnbt-tabs { margin-bottom: 10px; }
.hnbt-pres { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.hnbt-pres .btn { text-align: left; display: flex; flex-direction: column; gap: 2px; }
.hnbt-pres .btn small { font-weight: 500; font-size: 11px; opacity: .8; }
.hnbt-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 4px 0 8px; }
.hnbt-seg > span { min-width: 110px; }
.hnbt-opt label { display: block; margin: 5px 0; }
.hnbt-opt label small { opacity: .65; margin-left: 4px; }
`;
  function applyClasses() {
    const h = document.documentElement.classList;
    h.toggle('hnbt-lite', !cfg.cssFx);
    h.toggle('hnbt-novig', !cfg.vignette);
    h.toggle('hnbt-pix', (cfg.scale || 1) < 1);
  }

  // ---------- đồng hồ FPS ----------
  let hudEl;
  function renderHud() {
    if (!hudEl) return;
    const G = window.G || {};
    const show = cfg.hud && G.inGame;
    hudEl.style.display = show ? 'flex' : 'none';
    if (!show) return;
    // đặt cạnh khung nhân vật: giao diện mới (#mui-player) hoặc giao diện gốc (#hud-status)
    const anchor = [document.getElementById('mui-player'), document.getElementById('hud-status')].find(el => el && el.getBoundingClientRect().width);
    if (anchor) { const r = anchor.getBoundingClientRect(); hudEl.style.left = Math.round(r.right + 10) + 'px'; hudEl.style.top = Math.round(r.top + 4) + 'px'; }
    const f = stats.fps, cls = f >= 50 ? 'ok' : f >= 30 ? 'mid' : 'bad';
    const pc = stats.ping < 0 ? '' : stats.ping < 90 ? 'ok' : stats.ping < 200 ? 'mid' : 'bad';
    hudEl.innerHTML = `<b class="${cls}">${f}</b><small>FPS</small><i></i><b class="${pc}">${stats.ping < 0 ? '–' : stats.ping}</b><small>ms</small>`;
  }

  // ===================== 8. TAB "HNB TURBO" TRONG CÀI ĐẶT =====================
  let tab = 'game';
  const B = (on, attr, text, dis) => `<button class="btn small ${on ? 'primary' : ''}" ${attr} ${dis ? 'disabled title="Màn hình không hỗ trợ"' : ''}>${text}</button>`;
  const CK = (k, label, sub) => `<label><input type="checkbox" data-hnbk="${k}" ${cfg[k] ? 'checked' : ''}> ${label}<small>${sub}</small></label>`;
  function turboHTML() {
    const pre = Object.entries(PRESETS).map(([k, p]) => `<button class="btn ${cfg.preset === k ? 'primary' : ''}" data-hnbpre="${k}"><b>${p.label}</b><small>${p.desc}</small></button>`).join('');
    const fps = [[30, '30'], [45, '45'], [60, '60'], [0, 'Tối đa']].map(([v, t]) => B((cfg.fps | 0) === v, `data-hnbfps="${v}"`, t)).join('');
    const sc = [[0.6, '60%'], [0.8, '80%'], [1, '100%'], [1.5, '150%'], [2, '200%']].map(([v, t]) => B(cfg.scale === v, `data-hnbsc="${v}"`, t, v > nativeDPR + 1e-6)).join('');
    const fx = [[0.2, 'Ít'], [0.35, 'Vừa'], [0.6, 'Nhiều'], [1, 'Gốc']].map(([v, t]) => B(cfg.fx === v, `data-hnbfx="${v}"`, t)).join('');
    return `
      <div class="card"><h4>⚡ Chế độ nhanh</h4><div class="hnbt-pres">${pre}</div></div>
      <div class="card"><h4>Tinh chỉnh</h4>
        <div class="hnbt-seg"><span>Giới hạn FPS</span>${fps}</div>
        <div class="hnbt-seg"><span>Độ phân giải</span>${sc}</div>
        <div class="hnbt-seg"><span>Hiệu ứng hạt</span>${fx}</div>
        <div class="hnbt-opt">
          ${CK('lowFx', 'Bỏ hạt bay môi trường', 'lá rơi, đom đóm, bụi')}
          ${CK('shadow', 'Bóng phát sáng', 'rất nặng trên điện thoại')}
          ${CK('vignette', 'Lớp ám màu / tối viền', 'lớp phủ toàn màn hình')}
          ${CK('cssFx', 'Hiệu ứng động giao diện', 'chuyển động, nhấp nháy, kính mờ của HUD')}
          ${CK('shake', 'Rung màn hình', 'khi trúng đòn mạnh')}
          ${CK('names', 'Hiện tên nhân vật/quái', 'tắt giúp đỡ lag khi đông người')}
        </div>
      </div>
      <div class="card"><h4>👥 Người chơi khác & thế giới</h4>
        <div class="hnbt-opt">
          ${CK('othersFx', 'Hiệu ứng chiêu của người khác', 'tắt: chỉ còn chiêu của mình và đòn đánh vào mình')}
          ${CK('othersAura', 'Hào quang buff của người khác', '')}
          ${CK('othersMount', 'Hiệu ứng thú cưỡi của người khác', 'rồng, phượng, lửa...')}
          ${CK('othersName', 'Bảng tên người chơi khác', 'tên, bang, danh hiệu')}
          ${CK('pets', 'Thú cưng (pet)', '')}
          ${CK('bubbles', 'Bong bóng chat trên đầu', '')}
          ${CK('weather', 'Thời tiết', 'mưa, tuyết, gió, sấm sét')}
          ${CK('ultCrack', 'Nứt màn hình khi dùng chiêu cuối', '')}
          ${CK('flash', 'Chớp sáng toàn màn hình', '')}
          ${CK('ghosts', 'Bóng mờ khi khinh công', '')}
          ${CK('corpses', 'Hiệu ứng quái ngã xuống', '')}
          ${CK('dmgLite', 'Gộp bớt chữ sát thương', 'tối đa 6 số / 0,3 giây khi đánh đông quái')}
        </div>
      </div>
      <div class="card"><h4>🧠 Tự động</h4>
        <div class="hnbt-opt">
          ${CK('autoDown', 'Tự giảm cấu hình khi giật', 'FPS dưới 70% mục tiêu trong 3 giây → hạ dần độ phân giải, hiệu ứng')}
          ${CK('panelFps', 'Giảm FPS khi mở bảng / túi đồ', 'còn 24 FPS, mát máy hơn')}
          ${CK('idleFps', 'Tiết kiệm khi treo máy', 'chuyển sang cửa sổ khác → 10 FPS, game vẫn chạy')}
          ${CK('hud', 'Hiện FPS / Ping', 'phím F6')}
        </div>
      </div>
      <div class="card">
        <p class="small muted">FPS hiện tại: <b id="hnbt-live">${stats.fps} · ${stats.ping < 0 ? '–' : stats.ping + ' ms'}</b> · Độ phân giải thiết bị: ${Math.round(nativeDPR * 100)}% · Thay đổi được lưu tự động. Phím F7 mở nhanh tab này.</p>
      </div>`;
  }
  function decorateSettings() {
    const body = document.getElementById('panel-body'); if (!body) return;
    const tabs = `<div class="tabs hnbt-tabs"><button data-hnbtab="game" class="${tab === 'game' ? 'on' : ''}">⚙️ Chung</button><button data-hnbtab="turbo" class="${tab === 'turbo' ? 'on' : ''}">⚡ HNB Turbo</button></div>`;
    if (tab === 'turbo') body.innerHTML = tabs + turboHTML();
    else {
      if (!body.querySelector('.hnbt-tabs')) body.insertAdjacentHTML('afterbegin', tabs);
      const row = body.querySelector('.gfx-row');
      if (row) row.innerHTML = `🖥️ Đồ họa: do <b>HNB Turbo</b> điều khiển <button class="btn small primary" data-hnbtab="turbo">Mở HNB Turbo</button>`;
    }
    body.querySelectorAll('[data-hnbtab]').forEach(b => b.onclick = () => { tab = b.dataset.hnbtab; window.G && G.sfx && G.sfx('click'); window.UI.refreshPanel(); });
  }
  function hookUI() {
    const UI = window.UI;
    if (!UI || !UI.refreshPanel || !UI.panelName || UI.__hnbt) return !!(UI && UI.__hnbt);
    UI.__hnbt = true;
    const rawRefresh = UI.refreshPanel;
    UI.refreshPanel = function (soft) {
      if (soft && UI.panelName() === 'settings' && tab === 'turbo') return;
      const r = rawRefresh.apply(this, arguments);
      if (UI.panelName() === 'settings') decorateSettings();
      return r;
    };
    const rawOpen = UI.openPanel;
    UI.openPanel = function (name) { if (name === 'settings' && !UI.__hnbtKeep) tab = 'game'; UI.__hnbtKeep = false; return rawOpen.apply(this, arguments); };
    const body = document.getElementById('panel-body');
    body.addEventListener('click', e => {
      if (UI.panelName() !== 'settings' || tab !== 'turbo') return;
      const t = e.target.closest('button'); if (!t) return;
      const d = t.dataset;
      if (d.hnbpre) { const { label, desc, ...vals } = PRESETS[d.hnbpre]; set(Object.assign(vals, { preset: d.hnbpre }), true); }
      else if (d.hnbfps != null) set({ fps: +d.hnbfps });
      else if (d.hnbsc != null) set({ scale: +d.hnbsc });
      else if (d.hnbfx != null) set({ fx: +d.hnbfx });
    });
    body.addEventListener('change', e => {
      const k = e.target.dataset && e.target.dataset.hnbk; if (!k) return;
      set({ [k]: e.target.checked }, ['hud', 'autoDown', 'panelFps', 'idleFps'].includes(k));
    });
    return true;
  }
  function openTurbo() {
    const UI = window.UI; if (!UI || !window.G || !G.inGame) return;
    tab = 'turbo'; UI.__hnbtKeep = true;
    if (UI.panelName() === 'settings') UI.refreshPanel(); else UI.openPanel('settings');
  }
  function set(patch, keepPreset) {
    Object.assign(cfg, patch);
    if (!keepPreset) cfg.preset = 'custom';
    save(); applyClasses(); applyGame(); renderHud();
    const UI = window.UI;
    if (UI && UI.panelName && UI.panelName() === 'settings') UI.refreshPanel();
  }

  // ===================== KHỞI ĐỘNG =====================
  function onReady() {
    const st = document.createElement('style'); st.id = 'hnbt-css'; st.textContent = CSS; document.head.appendChild(st);
    applyClasses();
    hudEl = document.createElement('div'); hudEl.id = 'hnbt-hud'; hudEl.title = 'HNB Turbo (F7) · F6: ẩn/hiện';
    hudEl.onclick = openTurbo; document.body.appendChild(hudEl);
    watchDom(); trimChat();
    let n = 0; const iv = setInterval(() => { const a = hookGame.done || (hookGame.done = hookGame()); const b = hookUI(); const c = hookModules.done || (hookModules.done = hookModules()); if ((a && b && c) || ++n > 300) clearInterval(iv); }, 100);
    setInterval(measure, 500); pingLoop();
    // F7 = tab HNB Turbo · F6 = đồng hồ FPS (F8 dành cho Trợ thủ, F9 cho giao diện cũ/mới)
    window.addEventListener('keydown', e => {
      if (e.code === 'F7') { e.preventDefault(); e.stopImmediatePropagation(); const UI = window.UI; if (UI && UI.panelName && UI.panelName() === 'settings' && tab === 'turbo') UI.closePanel(); else openTurbo(); }
      else if (e.code === 'F6') { e.preventDefault(); e.stopImmediatePropagation(); set({ hud: !cfg.hud }, true); }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady); else onReady();

  window.HNBT = { cfg, set, open: openTurbo, stats, PRESETS, get tab() { return tab; } };
})();

/* ===================================================================================
 *  MÔ-ĐUN 2 + 3 · GIAO DIỆN MỚI + TRỢ THỦ TỰ ĐỘNG
 * =================================================================================== */
/*
 * Cách dùng:
 *  1) Tampermonkey / Violentmonkey: tạo script mới, dán toàn bộ file này, lưu, mở volam2d.com.
 *  2) Tự host source: chép file vào thư mục js/ và thêm vào <head> của index.html (ngay sau thẻ <link> style):
 *       <script src="js/volam-modern-ui.user.js"></script>
 *
 * Phần giao diện chỉ thay lớp hiển thị. Phần Trợ thủ (F8) chỉ gửi đúng các thao tác mà nút gốc của game gửi
 * (hồi sinh, nói chuyện NPC, cường hóa, cho ăn thú cưỡi...), có giới hạn an toàn và luôn dừng được bằng tay.
 * Các nút mới gọi lại đúng nút / hàm gốc của game nên mọi phím tắt và chức năng giữ nguyên.
 * Phím F9: chuyển qua lại giao diện cũ / mới (ghi nhớ trên máy).
 */
(function () {
  'use strict';
  if (window.__MUI__) return;
  window.__MUI__ = '1.2.0';

  const OFF_KEY = 'mui_off';
  const isOff = (() => { try { return localStorage.getItem(OFF_KEY) === '1'; } catch (e) { return false; } })();
  const toggleTheme = () => { try { localStorage.setItem(OFF_KEY, isOff ? '0' : '1'); } catch (e) {} location.reload(); };
  window.addEventListener('keydown', e => { if (e.code === 'F9') { e.preventDefault(); e.stopPropagation(); toggleTheme(); } }, true);
  if (isOff) return;

  let root = document.documentElement;
  const addCls = () => { root = document.documentElement; if (root) root.classList.add('mui'); return !!root; };
  if (!addCls()) { const mo = new MutationObserver(() => { if (addCls()) { mo.disconnect(); mount(); } }); mo.observe(document, { childList: true }); }

  // ======================================================================
  //  BIỂU TƯỢNG (SVG nét mảnh, dùng currentColor)
  // ======================================================================
  const P = {
    bag: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9.5 12.5h5"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6"/>',
    book: '<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5V5.5z"/><path d="M12 6v13.5"/>',
    horse: '<path d="M7.2 4.2C5.3 6.4 4.4 9 4.4 12c0 4.3 3.4 7.8 7.6 7.8s7.6-3.5 7.6-7.8c0-3-.9-5.6-2.8-7.8"/><path d="M10 5.2c-1.3 1.9-2 4.1-2 6.6 0 2.6 1.8 4.5 4 4.5s4-1.9 4-4.5c0-2.5-.7-4.7-2-6.6"/><path d="M7.2 4.2L10 5.2M16.8 4.2L14 5.2"/><circle cx="6.6" cy="10.5" r=".5" fill="currentColor"/><circle cx="17.4" cy="10.5" r=".5" fill="currentColor"/><circle cx="7.6" cy="15" r=".5" fill="currentColor"/><circle cx="16.4" cy="15" r=".5" fill="currentColor"/>',
    scroll: '<path d="M8 4h10a2 2 0 0 1 2 2v1h-4"/><path d="M16 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h10"/><path d="M8 4a2 2 0 0 0-2 2v11"/><path d="M9.5 9h4M9.5 12.5h4"/>',
    castle: '<path d="M4 20V9l2-1.5L8 9v-3l4-2.5L16 6v3l2-1.5L20 9v11z"/><path d="M10 20v-4a2 2 0 0 1 4 0v4"/><path d="M4 20h16"/>',
    users: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8"/><path d="M15.5 5.8a3 3 0 0 1 0 5.6"/><path d="M17 14.4c1.9.6 3.2 2.2 3.5 4.6"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v3.5M8.5 20h7M9.5 16.5h5V20h-5z"/>',
    gift: '<rect x="4" y="9" width="16" height="4" rx="1"/><path d="M5.5 13v7h13v-7M12 9v11"/><path d="M12 9C10 9 7.5 8 8 6s3 0 4 3c1-3 3.5-5 4-3s-2 3-4 3z"/>',
    chat: '<path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6a2.5 2.5 0 0 1-2.5 2.5H9z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6"/>',
    shield: '<path d="M12 3.5l7 2.5v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    grid: '<rect x="4.5" y="4.5" width="6" height="6" rx="1.6"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.6"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.6"/><rect x="13.5" y="13.5" width="6" height="6" rx="1.6"/>',
    target: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    bot: '<rect x="5" y="8" width="14" height="10.5" rx="3"/><path d="M12 4.5V8"/><circle cx="12" cy="4" r="1"/><circle cx="9.3" cy="13" r="1.2" fill="currentColor"/><circle cx="14.7" cy="13" r="1.2" fill="currentColor"/><path d="M3 12.5v2.5M21 12.5v2.5"/>',
    home: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    bolt: '<path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12z"/>',
    coin: '<circle cx="12" cy="12" r="7.5"/><path d="M12 7.5v9M14.5 9.5c-.4-1-1.3-1.5-2.5-1.5-1.5 0-2.5.8-2.5 1.9 0 2.6 5.2 1.4 5.2 4.2 0 1.1-1.1 1.9-2.7 1.9-1.3 0-2.3-.6-2.7-1.6"/>',
    gem: '<path d="M7 4.5h10l3.5 4.5L12 20 3.5 9z"/><path d="M3.5 9h17M9.5 4.5L8 9l4 11 4-11-1.5-4.5"/>'
  };
  const ico = (k, s = 20) => `<svg class="mui-i" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${P[k] || P.grid}</svg>`;
  const maskUrl = k => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>${P[k].replace(/currentColor/g, 'black')}</svg>`)}")`;

  // ======================================================================
  //  GIAO DIỆN (CSS) – ghi đè toàn bộ lớp hiển thị cũ
  // ======================================================================
  const CSS = String.raw`
html.mui {
  --m-bg: #070a11; --m-s0: rgba(12,16,26,.78); --m-s1: rgba(20,26,40,.82); --m-s2: rgba(32,40,58,.85); --m-s3: rgba(48,58,80,.9);
  --m-line: rgba(160,180,220,.14); --m-line2: rgba(160,180,220,.24); --m-hi: rgba(255,255,255,.06);
  --m-txt: #e7edf7; --m-mut: #8d9ab0; --m-dim: #5d6980;
  --m-ac: #34d3a6; --m-ac2: #12a8a0; --m-ac-g: linear-gradient(135deg, #4ff0be 0%, #1fb8a6 55%, #1590b8 100%);
  --m-gold: #f4c76a; --m-gold-g: linear-gradient(135deg, #ffe39a, #f0b04a 60%, #d58a2a);
  --m-hp: linear-gradient(90deg, #ff3d6e, #ff6b5a); --m-mp: linear-gradient(90deg, #3a8bff, #36d1ff); --m-xp: linear-gradient(90deg, #a78bfa, #34d3a6);
  --m-red: #ff5a6e; --m-blue: #4aa8ff; --m-green: #4ade80;
  --m-r: 16px; --m-r2: 12px; --m-blur: blur(14px) saturate(140%);
  --m-shadow: 0 10px 30px rgba(0,0,0,.45), 0 2px 6px rgba(0,0,0,.35);
  --m-font: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  /* ánh xạ lại biến màu cũ -> mọi bảng chức năng phụ tự đổi theo */
  --bg: var(--m-bg); --panel: var(--m-s1); --panel2: #1a2234; --line: var(--m-line); --gold: var(--m-gold); --gold2: #b98d3e; --text: var(--m-txt); --muted: var(--m-mut);
  --or0: #0e1522; --or1: #2b3a52; --or2: rgba(160,180,220,.22); --or3: #f4c76a; --or4: #ffe6ad; --ink: transparent; --ink2: transparent; --cream: #e7edf7;
  --g1: #fff0c4; --g2: #f4c76a; --g3: #9a7432; --gline: rgba(160,180,220,.2); --gdim: #2a3448;
  --lac1: #141b2a; --lac2: #0c111c; --lacR1: #c2364f; --lacR2: #6e1426;
  --sl0: #0d121c; --sl1: #141b29; --sl2: #1c2536; --sl3: #263146; --sl4: #34405a;
  --tile: linear-gradient(180deg, rgba(36,45,66,.9), rgba(24,31,46,.9)); --frame: 0 4px 14px rgba(0,0,0,.35); --pframe: none;
}
html.mui, html.mui body { background: var(--m-bg); color: var(--m-txt); font-family: var(--m-font); }
html.mui ::selection { background: rgba(52,211,166,.35); }
html.mui * { scrollbar-width: thin; scrollbar-color: rgba(160,180,220,.28) transparent; }
html.mui ::-webkit-scrollbar { width: 8px; height: 8px; }
html.mui ::-webkit-scrollbar-thumb { background: rgba(160,180,220,.25) !important; border: 0 !important; border-radius: 8px; }
html.mui ::-webkit-scrollbar-track { background: transparent !important; }
html.mui .muted { color: var(--m-mut); }
html.mui .warn { color: #ff9aa6; }

/* ---------------- nút / ô nhập / thẻ ---------------- */
html.mui .btn { font-family: var(--m-font); background: var(--m-s3); color: var(--m-txt); border: 1px solid var(--m-line2); border-radius: 12px; font-weight: 700; letter-spacing: .2px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 2px 8px rgba(0,0,0,.25); text-shadow: none; transition: transform .12s, filter .15s, background .15s, border-color .15s; padding: 8px 16px; }
html.mui .btn:hover { filter: none; background: #3a4864; border-color: rgba(160,190,255,.4); box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 4px 14px rgba(0,0,0,.3); }
html.mui .btn:active { transform: translateY(1px) scale(.98); box-shadow: inset 0 2px 6px rgba(0,0,0,.35); }
html.mui .btn.primary { background: var(--m-ac-g); color: #032a24; border-color: rgba(120,255,214,.55); box-shadow: 0 6px 18px rgba(31,184,166,.35), inset 0 1px 0 rgba(255,255,255,.4); text-shadow: none; }
html.mui .btn.primary:hover { filter: brightness(1.08); background: var(--m-ac-g); }
html.mui .btn.green { background: linear-gradient(135deg, #5ff59a, #22b864); color: #04260f; border-color: rgba(150,255,190,.5); text-shadow: none; }
html.mui .btn.red { background: linear-gradient(135deg, #ff7a8a, #e2364f); color: #fff; border-color: rgba(255,160,170,.5); text-shadow: none; }
html.mui .btn.small { padding: 4px 11px; font-size: 12px; border-radius: 9px; border-width: 1px; }
html.mui .btn.big { padding: 13px 40px; font-size: 17px; letter-spacing: 1.5px; border-radius: 14px; }
html.mui .btn:disabled { opacity: .45; filter: grayscale(.5); }
html.mui input, html.mui select, html.mui textarea { font-family: var(--m-font); background: rgba(8,12,20,.65); color: var(--m-txt); border: 1px solid var(--m-line2); border-radius: 11px; box-shadow: inset 0 1px 2px rgba(0,0,0,.3); transition: border-color .15s, box-shadow .15s; }
html.mui input::placeholder { color: var(--m-dim); }
html.mui input:focus, html.mui select:focus, html.mui textarea:focus { border-color: var(--m-ac); box-shadow: 0 0 0 3px rgba(52,211,166,.18); outline: none; }
html.mui input[type=checkbox], html.mui input[type=range], html.mui input[type=radio] { accent-color: var(--m-ac); box-shadow: none; }
html.mui select option { background: #141b29; }

html.mui .tabs { border-bottom: 0; gap: 4px; padding: 4px; background: rgba(8,12,20,.5); border-radius: 13px; border: 1px solid var(--m-line); display: flex; flex-wrap: wrap; }
html.mui .tabs button { font-family: var(--m-font); background: transparent; color: var(--m-mut); border: 0; border-radius: 10px; box-shadow: none; text-shadow: none; padding: 6px 12px; font-weight: 700; transition: background .15s, color .15s; }
html.mui .tabs button:hover { color: var(--m-txt); background: rgba(255,255,255,.05); border: 0; }
html.mui .tabs button.on { background: var(--m-s3); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 2px 8px rgba(0,0,0,.3); text-shadow: none; position: relative; }
html.mui .tabs button.on::after { content: ''; position: absolute; left: 30%; right: 30%; bottom: 2px; height: 2px; border-radius: 2px; background: var(--m-ac); }

html.mui .card, html.mui .li, html.mui .item-detail, html.mui .sk-head, html.mui .sk-slot, html.mui .stat-grid div, html.mui .au-box, html.mui .cmp-box, html.mui .esc-cur, html.mui .mount-card,
html.mui #class-stats div, html.mui .checkin-row div, html.mui .tr-side, html.mui .bank-gold {
  background: rgba(24,31,46,.72); border: 1px solid var(--m-line); border-radius: 12px; box-shadow: inset 0 1px 0 var(--m-hi); }
html.mui .card h4, html.mui .au-box h4 { color: var(--m-gold); border-bottom: 1px solid var(--m-line); text-shadow: none; letter-spacing: .3px; font-weight: 800; }
html.mui .li { transition: border-color .15s, background .15s; }
html.mui .li:hover { border-color: rgba(52,211,166,.45); background: rgba(30,40,58,.85); }
html.mui .slot { background: rgba(8,12,20,.55); border: 1px solid var(--m-line); border-radius: 11px; box-shadow: inset 0 1px 3px rgba(0,0,0,.35); transition: border-color .15s, transform .12s; }
html.mui .slot:hover { border-color: rgba(52,211,166,.6); transform: translateY(-1px); }
html.mui .slot.r-common { border-color: rgba(200,212,230,.32); box-shadow: inset 0 0 10px rgba(200,212,230,.08); }
html.mui .slot.sel { border-color: var(--m-ac); box-shadow: 0 0 0 2px rgba(52,211,166,.3), inset 0 0 12px rgba(52,211,166,.15); }
html.mui .slot.r-rare { border-color: rgba(79,163,255,.65); box-shadow: inset 0 0 14px rgba(79,163,255,.22); }
html.mui .slot.r-epic { border-color: rgba(192,96,255,.7); box-shadow: inset 0 0 14px rgba(192,96,255,.25); }
html.mui .slot.r-legendary { border-color: rgba(255,155,47,.8); box-shadow: inset 0 0 16px rgba(255,155,47,.3); }
html.mui table.tbl { border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--m-line); }
html.mui table.tbl th { background: rgba(36,45,66,.95); color: var(--m-gold); text-shadow: none; font-weight: 800; }
html.mui table.tbl td { border-color: var(--m-line); }
html.mui .progress, html.mui .bar { background: rgba(4,7,12,.7); border: 1px solid rgba(255,255,255,.06); border-radius: 999px; box-shadow: inset 0 1px 2px rgba(0,0,0,.5); }
html.mui .bar i { border-radius: 999px; }
html.mui .bar i::after { display: none; }
html.mui .bar.hp i { background: var(--m-hp); box-shadow: 0 0 10px rgba(255,61,110,.45); }
html.mui .bar.mp i { background: var(--m-mp); box-shadow: 0 0 10px rgba(58,139,255,.45); }
html.mui .bar span { text-shadow: 0 1px 2px rgba(0,0,0,.9); font-weight: 700; }

/* ---------------- khung lớn: bảng / hộp thoại ---------------- */
html.mui #panel { background: radial-gradient(ellipse at center, rgba(6,9,16,.35), rgba(6,9,16,.72)); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
html.mui .panel-box, html.mui .modal-box, html.mui .dead-box, html.mui #trade-win .tr-box {
  background: linear-gradient(180deg, rgba(22,29,44,.94), rgba(13,18,29,.96)); border: 1px solid var(--m-line2); border-radius: 22px;
  box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); }
html.mui .panel-box { animation: muiPop .22s cubic-bezier(.2,.9,.3,1.2); }
html.mui .panel-box::before, html.mui .modal-box::before, html.mui #trade-win .tr-box::before, html.mui .dead-box::before { display: none !important; }
html.mui .panel-box::after, html.mui .modal-box::after { display: none !important; }
html.mui .panel-head { background: transparent; border: 0; box-shadow: none; padding: 16px 20px 8px; justify-content: flex-start; position: relative; }
html.mui .panel-head::after { display: block !important; content: ''; position: absolute; left: 20px; right: 20px; bottom: 0; height: 1px; background: linear-gradient(90deg, rgba(52,211,166,.5), rgba(160,180,220,.12) 40%, transparent); }
html.mui #panel-title, html.mui .npc-head h3 { font-family: var(--m-font) !important; }
html.mui .panel-head h3 { margin: 0; padding: 0 0 0 14px; border: 0; background: transparent; box-shadow: none; text-shadow: none; color: #fff; font-family: var(--m-font); font-size: 18px; font-weight: 800; letter-spacing: .4px; text-transform: none; position: relative; flex: 1; text-align: left; }
html.mui .panel-head h3::before { content: ''; position: absolute; left: 0; top: 3px; bottom: 3px; width: 4px; border-radius: 4px; background: var(--m-ac-g); }
html.mui #panel-close, html.mui .x-btn { width: 34px; height: 34px; border-radius: 11px; border: 1px solid var(--m-line2); background: rgba(255,255,255,.04); color: var(--m-mut); box-shadow: none; text-shadow: none; font-size: 15px; font-weight: 600; top: 12px; right: 14px; transition: background .15s, color .15s; }
html.mui #panel-close:hover, html.mui .x-btn:hover { background: rgba(255,90,110,.18); color: #fff; border-color: rgba(255,90,110,.45); filter: none; }
html.mui #panel-body { padding: 14px 20px 18px; }
html.mui .modal-box p, html.mui .dead-box p { color: var(--m-txt); }
html.mui #modal-msg, html.mui #dead-overlay { background: rgba(5,8,14,.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
html.mui .dead-box h2 { font-family: var(--m-font); font-weight: 800; color: #ff8a98; text-shadow: 0 0 24px rgba(255,61,110,.5); letter-spacing: .5px; }
html.mui .dead-opt { background: rgba(24,31,46,.8); border: 1px solid var(--m-line2); border-radius: 16px; box-shadow: none; color: var(--m-txt); transition: border-color .15s, transform .15s; }
html.mui .dead-opt:hover { border-color: var(--m-ac); transform: translateY(-2px); }
html.mui .dead-opt i { color: var(--m-gold); }
html.mui #tooltip, html.mui #cmp-pop { background: rgba(14,19,30,.96); border: 1px solid var(--m-line2); border-radius: 14px; box-shadow: var(--m-shadow); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); color: var(--m-txt); }
html.mui #pl-menu, html.mui #pk-menu, html.mui #tlist, html.mui #tp-box, html.mui #ui-prompt > div { background: rgba(14,19,30,.94); border: 1px solid var(--m-line2); border-radius: 16px; box-shadow: var(--m-shadow); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); }
html.mui #pk-menu button, html.mui #pl-menu button { border-radius: 12px; }
html.mui #loading { background: rgba(5,8,14,.7); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
html.mui #loading .spinner { width: 46px; height: 46px; border: 3px solid rgba(160,180,220,.18); border-top-color: var(--m-ac); border-right-color: var(--m-ac); border-radius: 50%; animation: muiSpin .8s linear infinite; background: none; box-shadow: 0 0 24px rgba(52,211,166,.25); }
html.mui #loading-text { color: var(--m-txt); font-weight: 600; letter-spacing: .3px; }
html.mui #map-loading { background: radial-gradient(ellipse at 50% 40%, rgba(20,40,52,.92), rgba(5,8,14,.98)); }
html.mui #map-loading .ml-box { background: none; border: 0; box-shadow: none; }
html.mui #map-loading .ml-name { font-family: var(--m-font); font-weight: 800; font-size: 34px; letter-spacing: 1px; background: linear-gradient(180deg, #fff, #9fe9d4); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: none; }
html.mui #map-loading .ml-sub { color: var(--m-ac); letter-spacing: 3px; text-transform: uppercase; font-size: 12px; font-weight: 700; }
html.mui #map-loading .ml-bar { height: 4px; background: rgba(255,255,255,.08); border: 0; border-radius: 4px; box-shadow: none; overflow: hidden; }
html.mui #map-loading .ml-bar i { background: var(--m-ac-g); box-shadow: 0 0 12px rgba(52,211,166,.6); border-radius: 4px; }
html.mui #map-loading .ml-tip { color: var(--m-mut); }

/* ---------------- thông báo ---------------- */
html.mui .toast { font-family: var(--m-font); background: rgba(14,19,30,.88); border: 1px solid var(--m-line2); border-left: 3px solid var(--m-ac); border-radius: 12px; box-shadow: var(--m-shadow); padding: 7px 16px; font-weight: 600; backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); text-shadow: none; }
html.mui .toast.error { border-left-color: var(--m-red); color: #ffb3bd; }
html.mui .toast.reward, html.mui .toast.ok { border-left-color: var(--m-gold); }
html.mui .toast.level { background: linear-gradient(90deg, transparent, rgba(52,211,166,.35), transparent); border: 0; box-shadow: none; font-size: 22px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 0 18px rgba(52,211,166,.8); }
html.mui #announce .a { text-shadow: 0 1px 3px #000, 0 0 12px rgba(244,199,106,.6); font-weight: 700; }

/* ======================================================================
   MÀN HÌNH NGOÀI GAME: tải / đăng nhập / tạo nhân vật / vào game
   ====================================================================== */
#mui-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: radial-gradient(ellipse at 50% 110%, #12324a 0%, transparent 60%), linear-gradient(180deg, #05070d 0%, #0a1220 55%, #0d1b2a 100%); }
#mui-bg .blob { position: absolute; width: 60vmax; height: 60vmax; border-radius: 50%; filter: blur(70px); opacity: .5; mix-blend-mode: screen; animation: muiFloat 18s ease-in-out infinite alternate; }
#mui-bg .b1 { background: radial-gradient(circle, #1fb8a6 0%, transparent 65%); left: -15vmax; top: -20vmax; }
#mui-bg .b2 { background: radial-gradient(circle, #6d4bff 0%, transparent 65%); right: -20vmax; top: -10vmax; animation-duration: 22s; animation-delay: -6s; opacity: .38; }
#mui-bg .b3 { background: radial-gradient(circle, #f0a04a 0%, transparent 60%); left: 25vw; bottom: -38vmax; animation-duration: 26s; animation-delay: -3s; opacity: .22; }
#mui-bg .grid { position: absolute; inset: -50% -10% 0; background-image: linear-gradient(rgba(140,190,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,190,255,.06) 1px, transparent 1px); background-size: 46px 46px; transform: perspective(600px) rotateX(62deg); transform-origin: 50% 100%; mask-image: linear-gradient(0deg, #000 0%, transparent 55%); -webkit-mask-image: linear-gradient(0deg, #000 0%, transparent 55%); top: 40%; }
#mui-bg svg.mts { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 46%; }
#mui-bg .stars i { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #cfe8ff; animation: muiTw 4s ease-in-out infinite; }
html.mui #screen-game ~ #mui-bg, html.mui body.mui-ingame #mui-bg { display: none; }
html.mui .screen { z-index: 1; }
html.mui .login-bg { display: none !important; }
html.mui #screen-splash, html.mui #screen-login, html.mui #screen-enter, html.mui #screen-create { background: transparent; }
html.mui .logo { font-family: var(--m-font) !important; font-weight: 800 !important; font-size: 44px !important; letter-spacing: 6px !important; line-height: 1.45 !important; padding-top: 6px !important; margin: 0 0 4px !important;
  background: linear-gradient(180deg, #ffffff 10%, #bdf5e3 60%, #5fd8b9 100%); -webkit-background-clip: text; background-clip: text; color: transparent !important; text-shadow: none !important; filter: drop-shadow(0 6px 24px rgba(52,211,166,.35)); }
html.mui .logo span { display: inline-block; font-size: .42em; letter-spacing: 4px; vertical-align: middle; margin-left: 8px; padding: 5px 10px 5px 14px; border-radius: 10px; background: var(--m-gold-g); color: #2b1a04 !important; -webkit-text-fill-color: #2b1a04; text-shadow: none !important; transform: translateY(-6px); filter: none; }
html.mui .tagline { color: var(--m-mut) !important; letter-spacing: 2px; font-size: 13px; text-shadow: none !important; }
html.mui .splash { position: relative; z-index: 2; }
html.mui .splash-bar { height: 8px !important; border-radius: 99px !important; background: rgba(255,255,255,.07) !important; border: 1px solid var(--m-line) !important; box-shadow: none !important; overflow: visible !important; max-width: 420px; }
html.mui #splash-fill { background: var(--m-ac-g) !important; border-radius: 99px; box-shadow: 0 0 16px rgba(52,211,166,.7) !important; overflow: hidden; }
html.mui #splash-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); animation: muiShine 1.4s linear infinite; }
html.mui #splash-pct { position: absolute !important; right: 0; top: 14px; line-height: 1 !important; font-weight: 700 !important; font-size: 12px; color: var(--m-mut) !important; text-shadow: none !important; }
html.mui #splash-text { color: var(--m-txt); margin-top: 22px; }
html.mui #splash-tip { color: var(--m-mut); font-style: normal; }

html.mui .login-box { background: linear-gradient(180deg, rgba(20,27,42,.72), rgba(10,14,23,.78)) !important; border: 1px solid var(--m-line2) !important; border-radius: 26px !important;
  box-shadow: 0 40px 100px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08) !important; backdrop-filter: blur(22px) saturate(150%); -webkit-backdrop-filter: blur(22px) saturate(150%); padding: 34px 34px 24px !important; max-width: 430px !important; }
html.mui .login-box::before, html.mui .login-box::after { display: none !important; }
html.mui .auth-tabs { display: flex; gap: 4px; padding: 4px; background: rgba(5,8,14,.55); border: 1px solid var(--m-line); border-radius: 14px; margin: 16px 0 14px; border-bottom: 1px solid var(--m-line) !important; }
html.mui .auth-tabs button { flex: 1; border: 0 !important; border-radius: 10px; background: transparent !important; color: var(--m-mut) !important; font-family: var(--m-font); font-weight: 700; padding: 9px 0; box-shadow: none !important; text-shadow: none !important; transition: background .15s, color .15s; }
html.mui .auth-tabs button.on { background: var(--m-s3) !important; color: #fff !important; box-shadow: 0 4px 14px rgba(0,0,0,.35) !important; }
html.mui .auth-tabs button::after { display: none !important; }
html.mui .auth-form input:not([type=checkbox]) { height: 46px; padding: 0 16px; font-size: 15px; border-radius: 13px; margin-bottom: 10px; width: 100%; }
html.mui .auth-form .btn.primary { width: 100%; height: 48px; margin-top: 6px; font-size: 15px; letter-spacing: 1.5px; border-radius: 14px; }
html.mui .remember { color: var(--m-mut) !important; display: flex; align-items: center; gap: 8px; margin: 2px 2px 8px; }
html.mui .or span { background: transparent !important; color: var(--m-dim) !important; }
html.mui .or::before, html.mui .or::after { background: var(--m-line) !important; }
html.mui #online-count { color: var(--m-ac); font-weight: 800; }
html.mui .auth-right > p.small { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; background: rgba(52,211,166,.08); border: 1px solid rgba(52,211,166,.25); color: var(--m-txt); margin-top: 14px; }
html.mui .auth-right > p.small::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--m-ac); box-shadow: 0 0 0 4px rgba(52,211,166,.2); animation: muiPulse 1.8s ease-in-out infinite; }
html.mui #enter-preview { background: radial-gradient(circle at 50% 60%, rgba(52,211,166,.25), transparent 65%); border-radius: 50%; border: 0 !important; box-shadow: none !important; }
html.mui #enter-name { font-size: 24px; font-weight: 800; color: #fff; margin: 4px 0 2px; text-shadow: none; }
html.mui #enter-info { color: var(--m-ac) !important; font-weight: 600; }
html.mui #enter-btn { width: 100%; margin: 12px 0 10px; }
html.mui .zalo-btn { display: inline-flex !important; align-items: center; gap: 6px; border-radius: 12px !important; background: rgba(0,104,255,.15) !important; border: 1px solid rgba(80,150,255,.4) !important; color: #b8d4ff !important; box-shadow: none !important; text-shadow: none !important; padding: 8px 14px !important; }
html.mui .create-wrap { inset: max(12px, 4vh) max(12px, 4vw) !important; padding: 18px 22px !important; background: linear-gradient(180deg, rgba(20,27,42,.75), rgba(10,14,23,.82)) !important; border: 1px solid var(--m-line2) !important; border-radius: 26px !important; box-shadow: 0 40px 100px rgba(0,0,0,.55) !important; backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); position: relative; z-index: 2; }
html.mui .create-wrap::before, html.mui .create-wrap::after { display: none !important; }
html.mui .create-wrap h2 { font-family: var(--m-font); font-weight: 800; letter-spacing: 1px; color: #fff; text-shadow: none; }
html.mui .class-card { background: rgba(24,31,46,.7) !important; border: 1px solid var(--m-line) !important; border-radius: 16px !important; box-shadow: none !important; transition: transform .15s, border-color .15s, background .15s; }
html.mui .class-card:hover { transform: translateY(-2px); border-color: rgba(52,211,166,.45) !important; }
html.mui .class-card.sel { background: linear-gradient(180deg, rgba(52,211,166,.2), rgba(24,31,46,.8)) !important; border-color: var(--m-ac) !important; box-shadow: 0 0 0 3px rgba(52,211,166,.2), 0 10px 26px rgba(0,0,0,.4) !important; }
html.mui .class-card b { color: #fff; } html.mui .class-card small { color: var(--m-mut); }
html.mui .class-detail { background: rgba(14,19,30,.6) !important; border: 1px solid var(--m-line) !important; border-radius: 18px !important; box-shadow: none !important; }
html.mui #class-name { color: var(--m-gold); font-weight: 800; }
html.mui #class-stats div { border-radius: 10px; }

/* ======================================================================
   TRONG GAME – HUD MỚI
   ====================================================================== */
/* ẩn HUD cũ (vẫn giữ trong DOM để game cập nhật, script mới đọc lại) */
html.mui #hud-status, html.mui #exp-bar, html.mui #target-frame, html.mui #menu-buttons, html.mui #btn-menu-min { display: none !important; }
html.mui #vignette { opacity: .7; }

.mui-glass { background: linear-gradient(180deg, rgba(18,24,38,.72), rgba(10,14,23,.78)); border: 1px solid var(--m-line); border-radius: var(--m-r); box-shadow: var(--m-shadow), inset 0 1px 0 rgba(255,255,255,.06); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); }

/* khung nhân vật */
#mui-player { position: absolute; left: 12px; top: 12px; display: flex; align-items: center; gap: 12px; padding: 10px 14px 10px 10px; width: 300px; z-index: 7; pointer-events: auto; }
#mui-player .mp-ava { position: relative; width: 66px; height: 66px; flex: none; cursor: pointer; }
#mui-player .mp-ava canvas { position: absolute; inset: 7px; width: 52px; height: 52px; border-radius: 50%; background: radial-gradient(circle at 50% 30%, #2e3b55, #121827); image-rendering: auto; }
#mui-player .mp-ava svg { position: absolute; inset: 0; transform: rotate(-90deg); }
#mui-player .mp-ava .ring-bg { stroke: rgba(255,255,255,.08); }
#mui-player .mp-ava .ring { stroke: url(#muiXpGrad); transition: stroke-dashoffset .6s ease; filter: drop-shadow(0 0 4px rgba(52,211,166,.6)); }
#mui-player .mp-lv { position: absolute; left: 50%; bottom: -7px; transform: translateX(-50%); min-width: 26px; padding: 1px 7px; border-radius: 8px; font-size: 11px; font-weight: 800; text-align: center; color: #2b1a04; background: var(--m-gold-g); box-shadow: 0 2px 8px rgba(0,0,0,.45); }
#mui-player .mp-dot { position: absolute; right: 2px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: var(--m-red); border: 2px solid #0c111c; display: none; animation: muiPulse 1.6s infinite; }
#mui-player.has-pt .mp-dot { display: block; }
#mui-player .mp-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
#mui-player .mp-name { display: flex; align-items: baseline; gap: 7px; white-space: nowrap; overflow: hidden; }
#mui-player .mp-name b { font-size: 15px; font-weight: 800; color: #fff; overflow: hidden; text-overflow: ellipsis; }
#mui-player .mp-cls { font-size: 11px; font-weight: 700; color: var(--m-ac); padding: 1px 7px; border-radius: 6px; background: rgba(52,211,166,.12); }
#mui-player .mp-pw { margin-left: auto; font-size: 11px; font-weight: 700; color: var(--m-gold); display: inline-flex; align-items: center; gap: 2px; }
.mbar { position: relative; height: 13px; border-radius: 99px; background: rgba(3,5,10,.7); overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04); }
.mbar > i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; width: 0; }
.mbar > i.lag { background: rgba(255,255,255,.55); transition: width .7s cubic-bezier(.3,0,.2,1) .25s; }
.mbar > i.fill { transition: width .18s ease-out; }
.mbar > i.fill::after { content: ''; position: absolute; inset: 0 0 50% 0; border-radius: 99px 99px 0 0; background: linear-gradient(180deg, rgba(255,255,255,.35), transparent); }
.mbar.hp > i.fill { background: var(--m-hp); box-shadow: 0 0 12px rgba(255,61,110,.55); }
.mbar.mp > i.fill { background: var(--m-mp); box-shadow: 0 0 12px rgba(58,139,255,.55); }
.mbar.mp { height: 9px; }
.mbar > span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.9); letter-spacing: .3px; }
.mbar.mp > span { font-size: 8.5px; }
#mui-player.low .mbar.hp > i.fill { animation: muiLow .9s ease-in-out infinite; }
#mui-player .mp-cur { display: flex; gap: 12px; font-size: 12px; font-weight: 700; }
#mui-player .mp-cur span { display: inline-flex; align-items: center; gap: 4px; }
#mui-player .mp-cur .g { color: var(--m-gold); } #mui-player .mp-cur .k { color: #8fd8ff; }
#mui-lowhp { position: absolute; inset: 0; pointer-events: none; z-index: 1; opacity: 0; transition: opacity .4s; box-shadow: inset 0 0 120px 30px rgba(255,30,70,.45); }
#mui-lowhp.on { opacity: 1; animation: muiBeat 1.1s ease-in-out infinite; }

/* khung mục tiêu */
#mui-target { position: absolute; left: 50%; top: 74px; transform: translateX(-50%); width: 330px; padding: 9px 12px 11px; z-index: 7; pointer-events: auto; display: none; }
#mui-target.on { display: block; animation: muiDrop .18s ease-out; }
#mui-target .mt-top { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; min-width: 0; }
#mui-target .mt-badge { display: none; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 2px 7px; border-radius: 6px; background: linear-gradient(135deg, #ff6b7d, #c81d4a); color: #fff; }
#mui-target.boss .mt-badge { display: inline-block; }
#mui-target.boss { border-color: rgba(255,90,110,.45); box-shadow: var(--m-shadow), 0 0 30px rgba(255,61,110,.25); }
#mui-target .mt-name { font-size: 14px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
#mui-target .mt-lv, #mui-target .mt-el { flex: none; font-size: 10.5px; font-weight: 700; padding: 1px 7px; border-radius: 6px; background: rgba(255,255,255,.07); color: var(--m-mut); }
#mui-target .mt-el { color: var(--m-gold); }
#mui-target .mt-x { flex: none; width: 24px; height: 24px; border-radius: 8px; border: 0; background: rgba(255,255,255,.06); color: var(--m-mut); cursor: pointer; display: grid; place-items: center; padding: 0; }
#mui-target .mt-x:hover { background: rgba(255,90,110,.25); color: #fff; }
#mui-target .mt-pw { font-size: 11px; margin: -2px 0 7px; color: var(--m-mut); }
#mui-target .mt-pw:empty { display: none; }
#mui-target .mbar { height: 12px; }
#mui-target .mt-pct { position: absolute; right: 12px; bottom: 26px; font-size: 11px; font-weight: 800; color: #ff9aa8; }

/* bản đồ + buff ở giữa trên */
html.mui #hud-top { top: 12px; z-index: 6; }
html.mui #map-name { font-family: var(--m-font); background: linear-gradient(180deg, rgba(18,24,38,.72), rgba(10,14,23,.78)); border: 1px solid var(--m-line); border-radius: 99px; padding: 7px 18px 7px 34px; box-shadow: var(--m-shadow); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur);
  color: #fff; text-shadow: none; font-size: 13.5px; font-weight: 800; letter-spacing: .3px; position: relative; }
html.mui #map-name::before { content: '' !important; position: absolute; left: 13px; top: 50%; width: 14px; height: 14px; margin-top: -7px; background: var(--m-ac); -webkit-mask: ${maskUrl('target')} center/contain no-repeat; mask: ${maskUrl('target')} center/contain no-repeat; }
html.mui #map-name::after { content: none !important; display: none !important; }
html.mui #map-name > span { font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 6px; background: rgba(255,255,255,.07); margin-left: 4px; }
html.mui #map-name .pvp { color: #ff8a98; background: rgba(255,61,110,.15); } html.mui #map-name .safe { color: var(--m-green); background: rgba(74,222,128,.12); }
html.mui #weather-tag { background: none !important; color: var(--m-mut); font-weight: 600; }
html.mui #buff-line { margin-top: 7px; gap: 5px; }
html.mui #buff-line span { font-family: var(--m-font); background: rgba(10,14,23,.72); border: 1px solid var(--m-line); border-radius: 99px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: var(--m-txt); box-shadow: 0 2px 8px rgba(0,0,0,.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
html.mui body.mui-hastarget #nav-hint { margin-top: 72px; }

/* bản đồ nhỏ + nút nhanh */
html.mui #hud-right { top: 12px; right: 12px; gap: 8px; }
html.mui #map-row { gap: 8px; align-items: flex-start; }
html.mui #mini-wrap { padding: 5px; border-radius: 20px; background: linear-gradient(180deg, rgba(18,24,38,.72), rgba(10,14,23,.78)); border: 1px solid var(--m-line); box-shadow: var(--m-shadow); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); position: relative; }
html.mui #minimap { border: 0 !important; border-radius: 15px !important; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06) !important; display: block; }
html.mui #quick-btns { gap: 6px; }
html.mui .qb { font-family: var(--m-font); background: linear-gradient(180deg, rgba(18,24,38,.75), rgba(10,14,23,.8)) !important; border: 1px solid var(--m-line) !important; border-radius: 13px !important; color: var(--m-txt) !important;
  box-shadow: 0 4px 14px rgba(0,0,0,.35) !important; backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); text-shadow: none !important; transition: border-color .15s, background .15s, transform .12s; }
html.mui .qb:hover { border-color: rgba(52,211,166,.5) !important; transform: translateY(-1px); }
html.mui .qb span { color: var(--m-mut) !important; text-shadow: none !important; font-weight: 700; }
html.mui .qb.on, html.mui .qb.active, html.mui #btn-auto.on { border-color: var(--m-ac) !important; background: linear-gradient(180deg, rgba(52,211,166,.28), rgba(10,30,30,.85)) !important; box-shadow: 0 0 0 3px rgba(52,211,166,.18), 0 4px 14px rgba(0,0,0,.35) !important; }
html.mui .qb.on span, html.mui #btn-auto.on span { color: #c8ffee !important; }
html.mui #btn-tlist i, html.mui #btn-auto i, html.mui #btn-recall i { font-size: 0 !important; display: inline-block; width: 20px; height: 20px; background: currentColor; }
html.mui #btn-tlist i { -webkit-mask: ${maskUrl('target')} center/contain no-repeat; mask: ${maskUrl('target')} center/contain no-repeat; color: #ff9aa8; }
html.mui #btn-auto i { -webkit-mask: ${maskUrl('bot')} center/contain no-repeat; mask: ${maskUrl('bot')} center/contain no-repeat; color: var(--m-ac); }
html.mui #btn-recall i { -webkit-mask: ${maskUrl('home')} center/contain no-repeat; mask: ${maskUrl('home')} center/contain no-repeat; color: var(--m-gold); }
html.mui .qb-n { background: var(--m-gold-g) !important; color: #2b1a04 !important; border: 0 !important; border-radius: 7px !important; }

/* thanh menu mới (bên phải) */
#mui-rail { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 6px; padding: 7px; z-index: 8; pointer-events: auto; border-radius: 20px; }
#mui-rail .mr-b { position: relative; width: 44px; height: 44px; border-radius: 13px; border: 1px solid transparent; background: transparent; color: #c9d4e6; cursor: pointer; display: grid; place-items: center; padding: 0; transition: background .15s, color .15s, transform .12s, border-color .15s; text-decoration: none; }
#mui-rail .mr-b:hover { background: rgba(255,255,255,.07); color: #fff; transform: translateX(-2px); }
#mui-rail .mr-b.on { background: linear-gradient(180deg, rgba(52,211,166,.28), rgba(18,60,60,.45)); border-color: rgba(52,211,166,.5); color: #d6fff1; }
#mui-rail .mr-b.on::before { content: ''; position: absolute; right: -8px; top: 12px; bottom: 12px; width: 3px; border-radius: 3px; background: var(--m-ac); }
#mui-rail .mr-b .mr-e { font-size: 19px; line-height: 1; }
#mui-rail .mr-sep { height: 1px; margin: 2px 6px; background: var(--m-line); }
.mui-tipx { position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%) translateX(6px); white-space: nowrap; padding: 6px 10px; border-radius: 9px; background: rgba(10,14,23,.95); border: 1px solid var(--m-line2); color: #fff; font-size: 12px; font-weight: 700; pointer-events: none; opacity: 0; transition: opacity .12s, transform .12s; box-shadow: var(--m-shadow); }
.mui-tipx kbd { font-family: var(--m-font); font-size: 10px; margin-left: 6px; padding: 1px 5px; border-radius: 5px; background: rgba(255,255,255,.1); color: var(--m-mut); }
#mui-rail .mr-b:hover .mui-tipx { opacity: 1; transform: translateY(-50%); }
.mui-dot { position: absolute; right: 6px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--m-red); box-shadow: 0 0 0 2px #0c111c, 0 0 8px rgba(255,90,110,.8); display: none; }
.has-dot > .mui-dot { display: block; }
#mui-more { position: absolute; right: 74px; top: 50%; transform: translateY(-50%) scale(.96); opacity: 0; pointer-events: none; z-index: 40; padding: 14px; width: 292px; transition: opacity .15s, transform .15s; border-radius: 20px; }
#mui-more.open { opacity: 1; transform: translateY(-50%) scale(1); pointer-events: auto; }
#mui-more h5 { margin: 0 2px 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--m-mut); font-weight: 800; }
#mui-more .mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
#mui-more .mm-b { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 4px 10px; border-radius: 14px; border: 1px solid var(--m-line); background: rgba(255,255,255,.03); color: #d5deec; cursor: pointer; font-family: var(--m-font); font-size: 11.5px; font-weight: 700; text-decoration: none; transition: background .15s, border-color .15s, transform .12s; }
#mui-more .mm-b:hover { background: rgba(52,211,166,.12); border-color: rgba(52,211,166,.45); transform: translateY(-1px); color: #fff; }
#mui-more .mm-b .mui-i { width: 22px; height: 22px; }
#mui-more .mm-b .mr-e { font-size: 20px; }
#mui-more .mm-foot { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--m-line); display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--m-dim); }
#mui-more .mm-foot button { font-family: var(--m-font); font-size: 11px; font-weight: 700; color: var(--m-mut); background: rgba(255,255,255,.05); border: 1px solid var(--m-line); border-radius: 8px; padding: 4px 9px; cursor: pointer; }
#mui-more .mm-foot button:hover { color: #fff; border-color: var(--m-line2); }

/* thanh kinh nghiệm */
#mui-xp { position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: rgba(3,5,10,.75); z-index: 6; pointer-events: auto; }
#mui-xp i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--m-xp); box-shadow: 0 0 12px rgba(120,160,250,.7); transition: width .5s ease; }
#mui-xp .ticks { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 calc(10% - 1px), rgba(0,0,0,.6) calc(10% - 1px) 10%); }
#mui-xp span { position: absolute; left: 50%; bottom: 9px; transform: translateX(-50%); white-space: nowrap; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 8px; background: rgba(10,14,23,.92); border: 1px solid var(--m-line2); opacity: 0; transition: opacity .15s; pointer-events: none; }
#mui-xp:hover { height: 8px; } #mui-xp:hover span { opacity: 1; }

/* thanh kỹ năng */
html.mui #skillbar { bottom: 16px; gap: 7px; padding: 8px 10px; border-radius: 22px; background: linear-gradient(180deg, rgba(18,24,38,.7), rgba(10,14,23,.8)); border: 1px solid var(--m-line); box-shadow: var(--m-shadow), inset 0 1px 0 rgba(255,255,255,.06); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); }
html.mui #skillbar::before, html.mui #skillbar::after { display: none !important; }
html.mui .skill { width: 50px; height: 50px; border: 1px solid var(--m-line2); border-radius: 14px; background: radial-gradient(circle at 50% 30%, #253149, #10151f); box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 3px 8px rgba(0,0,0,.35); overflow: hidden; transition: transform .1s, border-color .15s, box-shadow .15s; font-family: var(--m-font); }
html.mui .skill:hover { transform: translateY(-3px); border-color: rgba(52,211,166,.6); box-shadow: 0 8px 18px rgba(0,0,0,.45), 0 0 0 2px rgba(52,211,166,.2); }
html.mui .skill:active { transform: translateY(0) scale(.95); }
html.mui .skill .sk-img, html.mui .skill.has-img .sk-img { border-radius: 13px; }
html.mui .skill .key { top: 3px; left: 3px; font-size: 9px; font-weight: 800; line-height: 1; padding: 2px 4px; border-radius: 5px; background: rgba(5,8,14,.78); color: #dfe7f3; border: 0; z-index: 2; text-shadow: none; }
html.mui .skill .mpc { bottom: 2px; right: 4px; font-size: 9px; font-weight: 800; color: #8fd0ff; text-shadow: 0 1px 2px #000; z-index: 2; }
html.mui .skill .slv { top: 3px; right: 4px; font-size: 9px; color: var(--m-gold); text-shadow: 0 1px 2px #000; z-index: 2; }
html.mui .skill .cnt { bottom: 2px; right: 4px; font-size: 11px; font-weight: 800; text-shadow: 0 1px 2px #000; z-index: 2; }
html.mui .skill .cdo { background: rgba(4,7,12,.72); }
html.mui .skill .cdt { font-size: 16px; font-weight: 800; text-shadow: 0 1px 3px #000; z-index: 3; }
html.mui .skill.empty { border-style: dashed; border-color: rgba(160,180,220,.25); background: rgba(255,255,255,.02); opacity: .7; }
html.mui .skill.empty .small { font-size: 10px; }
html.mui .skill.dragon { border-color: rgba(255,155,47,.7); box-shadow: 0 0 14px rgba(255,120,40,.4); }
html.mui .skill.dragon.el-water { border-color: rgba(47,168,255,.7); box-shadow: 0 0 14px rgba(47,168,255,.45); }
html.mui .skill.dragon.el-ice { border-color: rgba(190,240,255,.8); box-shadow: 0 0 14px rgba(160,232,255,.5); }
html.mui .skill.locked { filter: grayscale(1) brightness(.55); }
html.mui #dodge-sk { margin-left: 8px; } html.mui #dodge-sk::before { content: ''; position: absolute; left: -9px; top: 8px; bottom: 8px; width: 1px; background: var(--m-line2); }
html.mui #pot-hp { margin-left: 8px; } html.mui #pot-hp::before { content: ''; position: absolute; left: -9px; top: 8px; bottom: 8px; width: 1px; background: var(--m-line2); }
html.mui #dodge-sk, html.mui #pot-hp { overflow: visible; }
html.mui #dodge-sk .sk-img, html.mui #pot-hp .ico-pot { border-radius: 13px; overflow: hidden; }
html.mui #dodge-sk.ready { border-color: rgba(106,200,232,.7); }

/* chat */
html.mui #chat { font-family: var(--m-font); background: linear-gradient(180deg, rgba(18,24,38,.66), rgba(10,14,23,.76)); border: 1px solid var(--m-line); border-radius: 18px; box-shadow: var(--m-shadow); backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); overflow: hidden; }
html.mui #chat::before, html.mui #chat::after { display: none !important; }
html.mui #chat-tabs { border-bottom: 1px solid var(--m-line); padding: 6px; gap: 3px; background: rgba(0,0,0,.15); }
html.mui #chat-tabs button { font-family: var(--m-font); border-radius: 9px; color: var(--m-mut); font-weight: 700; padding: 4px 10px; border: 0; background: transparent; box-shadow: none; text-shadow: none; transition: background .15s, color .15s; }
html.mui #chat-tabs button:hover { color: #fff; background: rgba(255,255,255,.05); }
html.mui #chat-tabs button.on { background: rgba(52,211,166,.16); color: #b9ffe9; box-shadow: inset 0 0 0 1px rgba(52,211,166,.35); text-shadow: none; }
html.mui #chat-log { padding: 6px 10px; font-size: 12.5px; }
html.mui #chat-log .m { padding: 2px 0; line-height: 1.45; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
html.mui #chat-log .ch { font-size: 10.5px; font-weight: 800; letter-spacing: .3px; padding: 0 5px; border-radius: 5px; background: rgba(255,255,255,.06); margin-right: 5px; }
html.mui #chat-log .world .ch { color: #ffd88a; background: rgba(255,200,90,.12); }
html.mui #chat-log .map .ch { color: #8ff0bf; background: rgba(80,230,150,.12); }
html.mui #chat-log .guild .ch { color: #8fc2ff; background: rgba(90,150,255,.14); }
html.mui #chat-log .pm .ch { color: #ffa6dc; background: rgba(255,120,200,.14); }
html.mui #chat-log .sys .ch { color: #ff9a85; background: rgba(255,110,80,.14); }
html.mui #chat-form { padding: 6px; gap: 5px; border-top: 1px solid var(--m-line); background: rgba(0,0,0,.12); }
html.mui #chat-form select { border-radius: 9px; padding: 4px 6px; }
html.mui #chat-input { border-radius: 10px; padding: 6px 10px; }
html.mui #chat-form .btn { border-radius: 10px; background: var(--m-ac-g); color: #032a24; border-color: transparent; }
html.mui #btn-chat-mobile { background: rgba(14,19,30,.85); border: 1px solid var(--m-line2); border-radius: 14px; box-shadow: var(--m-shadow); }

/* khung nhiệm vụ / tổ đội */
html.mui #tracker { top: 106px !important; left: 12px; width: 300px; gap: 8px; }
html.mui #tutorial-box, html.mui #daily-box, html.mui #story-box, html.mui #party-frame, html.mui #escort-hud, html.mui #duel-hud, html.mui #pb-hud, html.mui #dh-hud, html.mui #wanted-hud, html.mui #sect-box {
  background: linear-gradient(180deg, rgba(18,24,38,.66), rgba(10,14,23,.74)) !important; border: 1px solid var(--m-line) !important; border-radius: 16px !important; box-shadow: var(--m-shadow) !important; backdrop-filter: var(--m-blur); -webkit-backdrop-filter: var(--m-blur); font-family: var(--m-font); }
html.mui #tutorial-box h4, html.mui #daily-box h4, html.mui #story-box h4 { color: #fff; font-weight: 800; font-size: 12.5px; letter-spacing: .2px; text-shadow: none; }
html.mui #daily-box .q b { color: var(--m-ac); }
html.mui #daily-box .q.done span { color: var(--m-green); }
html.mui #trk-min { border-radius: 9px; background: rgba(14,19,30,.85); border: 1px solid var(--m-line2); color: var(--m-mut); box-shadow: none; }
html.mui #tutorial-box.pulse { box-shadow: 0 0 0 2px rgba(244,199,106,.5), var(--m-shadow) !important; }

/* điều khiển cảm ứng */
html.mui .act.sk, html.mui .act.pot, html.mui .act.pick { background: radial-gradient(circle at 50% 35%, rgba(44,56,82,.88), rgba(12,16,26,.88)); }
html.mui .act { border: 1px solid rgba(200,215,240,.28); box-shadow: 0 6px 16px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
html.mui .act.big { border: 2px solid rgba(52,211,166,.7); box-shadow: 0 0 0 5px rgba(52,211,166,.15), 0 8px 20px rgba(0,0,0,.5); }
html.mui .act.sk.dragon { border-color: rgba(255,155,47,.7); }
html.mui .act.pot .cnt { background: rgba(5,8,14,.85); color: #fff; border: 0; border-radius: 6px; }
html.mui #joy-base { background: radial-gradient(circle, rgba(30,40,60,.25), rgba(10,14,23,.5)); border: 1px solid rgba(200,215,240,.3); box-shadow: inset 0 0 24px rgba(0,0,0,.35); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
html.mui #joy-knob { background: radial-gradient(circle at 40% 32%, #c8fff0, #34d3a6 45%, #138a7a); border: 0; box-shadow: 0 0 18px rgba(52,211,166,.6), 0 4px 10px rgba(0,0,0,.4); }

/* điện thoại */
html.mui body.touch #mui-player { transform: scale(.82); transform-origin: top left; left: 8px; top: 8px; }
html.mui body.touch #tracker { top: 90px !important; width: 250px; left: 8px; }
html.mui body.touch #mui-rail { top: 124px; transform: none; right: 10px; padding: 4px; border-radius: 16px; }
html.mui body.touch #mui-rail .mr-b.prim, html.mui body.touch #mui-rail .mr-sep { display: none; }
html.mui body.touch #mui-more { right: 66px; top: 8px; transform: scale(.96); max-height: calc(100% - 16px); overflow-y: auto; width: 330px; }
html.mui body.touch #mui-more.open { transform: none; }
html.mui body.touch #mui-more .mm-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
html.mui body.touch #mui-more .mm-b { padding: 9px 2px 8px; font-size: 10.5px; }
html.mui body.touch #mui-xp span { opacity: 0; }
html.mui body.touch #mui-target { top: 80px; width: 280px; transform: translateX(-50%) scale(.9); transform-origin: top center; }
html.mui body.short #mui-player { transform: scale(.72); }
html.mui body.short #tracker { top: 78px !important; }
html.mui body.short .create-wrap { inset: 6px !important; padding: 10px 12px !important; }
html.mui body.pvp-on #mui-target { top: 56px; }

@media (max-height: 700px) { #mui-rail .mr-b { width: 40px; height: 40px; } #mui-rail { gap: 3px; padding: 5px; } }
@media (max-width: 1100px) { html.mui:not(.mui-touch) #mui-player { width: 270px; } }

@keyframes muiPop { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes muiDrop { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%); } }
@keyframes muiSpin { to { transform: rotate(360deg); } }
@keyframes muiShine { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
@keyframes muiPulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes muiLow { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.6); } }
@keyframes muiBeat { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes muiTw { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes muiFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(6vmax, 4vmax) scale(1.12); } }
`;

  const style = document.createElement('style');
  style.id = 'mui-style';
  style.textContent = CSS;
  function mount() { if (!style.isConnected && document.documentElement) (document.head || document.documentElement).appendChild(style); }
  mount();
  // luôn nằm cuối <head> để thắng các file CSS cũ
  const keepLast = () => { const h = document.head; if (h && h.lastElementChild !== style) h.appendChild(style); };
  document.addEventListener('DOMContentLoaded', keepLast);
  window.addEventListener('load', keepLast);

  // ======================================================================
  //  TIỆN ÍCH
  // ======================================================================
  const $ = id => document.getElementById(id);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const fmt = n => Math.max(0, Math.round(n || 0)).toLocaleString('vi-VN');
  const short = n => { n = n || 0; return n >= 1e9 ? (n / 1e9).toFixed(n >= 1e10 ? 0 : 1).replace('.', ',') + 'T' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',') + 'Tr' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : fmt(n); };
  const setText = (el, t) => { if (el && el._t !== t) { el.textContent = t; el._t = t; } };
  const setW = (el, p) => { const v = (Math.max(0, Math.min(1, p || 0)) * 100).toFixed(1) + '%'; if (el && el._w !== v) { el.style.width = v; el._w = v; } };
  const tog = (el, c, on) => { if (el && el.classList.contains(c) !== !!on) el.classList.toggle(c, !!on); };

  // ======================================================================
  //  NỀN MÀN HÌNH NGOÀI GAME
  // ======================================================================
  function buildBackground() {
    const app = $('app'); if (!app || $('mui-bg')) return;
    const bg = h('div', '', `<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="grid"></div><div class="stars"></div>
      <svg class="mts" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs><linearGradient id="muiM1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16324a" stop-opacity=".9"/><stop offset="1" stop-color="#0a1422"/></linearGradient>
        <linearGradient id="muiM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2236"/><stop offset="1" stop-color="#070c15"/></linearGradient></defs>
        <path fill="url(#muiM1)" opacity=".7" d="M0 260 L120 170 L210 220 L330 110 L430 200 L560 120 L700 230 L820 140 L930 210 L1060 90 L1180 200 L1300 150 L1440 230 L1440 400 L0 400Z"/>
        <path fill="url(#muiM2)" d="M0 320 L150 250 L260 300 L400 230 L520 300 L660 240 L780 310 L900 260 L1040 320 L1180 250 L1320 300 L1440 270 L1440 400 L0 400Z"/>
        <path fill="#05080f" d="M0 370 Q 360 330 720 365 T 1440 355 L1440 400 L0 400Z"/>
      </svg>`);
    bg.id = 'mui-bg';
    const st = bg.querySelector('.stars');
    for (let i = 0; i < 70; i++) { const s = h('i'); s.style.left = (Math.random() * 100) + '%'; s.style.top = (Math.random() * 55) + '%'; s.style.animationDelay = (-Math.random() * 4) + 's'; s.style.opacity = Math.random(); if (Math.random() < .2) s.style.width = s.style.height = '3px'; st.appendChild(s); }
    app.insertBefore(bg, app.firstChild);
    // ẩn nền khi đang trong game (tiết kiệm GPU)
    const gs = $('screen-game');
    const upd = () => { bg.style.display = gs && gs.classList.contains('active') ? 'none' : ''; };
    if (gs) new MutationObserver(upd).observe(gs, { attributes: true, attributeFilter: ['class'] });
    upd();
  }

  // ======================================================================
  //  HUD MỚI
  // ======================================================================
  const RING_R = 30, RING_C = 2 * Math.PI * RING_R;
  let E = {};   // phần tử HUD mới
  function buildHud() {
    const hud = $('hud'); if (!hud || $('mui-player')) return;

    // --- khung nhân vật ---
    const pl = h('div', 'mui-glass', `
      <div class="mp-ava" title="Nhân vật (C)">
        <canvas width="64" height="64"></canvas>
        <svg viewBox="0 0 66 66" width="66" height="66"><defs><linearGradient id="muiXpGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#34d3a6"/></linearGradient></defs>
          <circle class="ring-bg" cx="33" cy="33" r="${RING_R}" fill="none" stroke-width="3.5"/>
          <circle class="ring" cx="33" cy="33" r="${RING_R}" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${RING_C}" stroke-dashoffset="${RING_C}"/></svg>
        <b class="mp-lv">1</b><i class="mp-dot" title="Có điểm tiềm năng chưa cộng"></i>
      </div>
      <div class="mp-info">
        <div class="mp-name"><b></b><span class="mp-cls"></span><span class="mp-pw">${ico('bolt', 12)}<em></em></span></div>
        <div class="mbar hp"><i class="lag"></i><i class="fill"></i><span></span></div>
        <div class="mbar mp"><i class="lag"></i><i class="fill"></i><span></span></div>
        <div class="mp-cur"><span class="g" title="Lượng">${ico('coin', 14)}<b></b></span><span class="k" title="Nguyên Bảo">${ico('gem', 14)}<b></b></span></div>
      </div>`);
    pl.id = 'mui-player';
    pl.querySelector('.mp-ava').onclick = () => window.UI && UI.togglePanel('character');
    hud.appendChild(pl);

    // --- khung mục tiêu ---
    const tg = h('div', 'mui-glass', `<div class="mt-top"><span class="mt-badge">BOSS</span><b class="mt-name"></b><span class="mt-lv"></span><span class="mt-el"></span><button class="mt-x" title="Bỏ chọn mục tiêu">${ico('x', 14)}</button></div>
      <div class="mt-pw"></div><div class="mbar hp"><i class="lag"></i><i class="fill"></i><span></span></div>`);
    tg.id = 'mui-target';
    tg.querySelector('.mt-x').onclick = e => { e.stopPropagation(); const x = document.querySelector('#target-frame .t-x'); if (x) x.click(); };
    hud.appendChild(tg);

    // --- thanh kinh nghiệm ---
    const xp = h('div', '', '<i></i><div class="ticks"></div><span></span>'); xp.id = 'mui-xp'; hud.appendChild(xp);

    // --- lớp đỏ khi sắp chết ---
    const low = h('div'); low.id = 'mui-lowhp'; $('screen-game').insertBefore(low, $('hud'));

    // --- thanh menu + bảng "Thêm" ---
    const rail = h('div', 'mui-glass'); rail.id = 'mui-rail'; hud.appendChild(rail);
    const more = h('div', 'mui-glass'); more.id = 'mui-more'; hud.appendChild(more);

    E = {
      pl, ava: pl.querySelector('.mp-ava canvas'), ring: pl.querySelector('.ring'), lv: pl.querySelector('.mp-lv'), name: pl.querySelector('.mp-name b'), cls: pl.querySelector('.mp-cls'), pw: pl.querySelector('.mp-pw em'),
      hp: pl.querySelector('.mbar.hp'), mp: pl.querySelector('.mbar.mp'), gold: pl.querySelector('.mp-cur .g b'), knb: pl.querySelector('.mp-cur .k b'),
      tg, tName: tg.querySelector('.mt-name'), tLv: tg.querySelector('.mt-lv'), tEl: tg.querySelector('.mt-el'), tPw: tg.querySelector('.mt-pw'), tBar: tg.querySelector('.mbar'),
      xp, xpFill: xp.querySelector('i'), xpTxt: xp.querySelector('span'), low, rail, more
    };
    buildRail();
    // thanh menu dựng lại khi game thêm / bớt nút
    const mb = $('menu-buttons');
    if (mb) new MutationObserver(() => { clearTimeout(buildRail._t); buildRail._t = setTimeout(buildRail, 50); }).observe(mb, { childList: true });
    setInterval(syncRail, 400);
    document.addEventListener('pointerdown', e => { if (E.more.classList.contains('open') && !E.more.contains(e.target) && !e.target.closest('#mui-rail .mr-more')) E.more.classList.remove('open'); }, true);
  }

  // định nghĩa nút: data-panel -> biểu tượng, phím tắt, nhóm chính/phụ
  const RAIL = {
    inventory: ['bag', 'I', 1], character: ['user', 'C', 1], skills: ['book', 'K', 1], mount: ['horse', 'M', 1], quests: ['scroll', 'J', 1], events: ['spark', 'O', 1],
    helper: ['bot', 'F8', 1], guild: ['castle', 'G', 0], friends: ['users', 'B', 0], leaderboard: ['trophy', 'L', 0], giftcode: ['gift', 'U', 0], settings: ['gear', '', 0]
  };
  function railDef(src) {
    if (src.id === 'btn-admin') return { k: 'admin', icon: 'shield', key: '', prim: 0 };
    if (src.classList.contains('zalo-menu')) return { k: 'zalo', icon: 'chat', key: '', prim: 0 };
    const p = src.dataset && src.dataset.panel, d = p && RAIL[p];
    return d ? { k: p, icon: d[0], key: d[1], prim: d[2] } : { k: p || src.id || '', icon: null, key: '', prim: 0 };
  }
  function srcLabel(src) { const s = src.querySelector('span'); return (s ? s.textContent : src.title || '').trim(); }
  function srcEmoji(src) { const c = src.cloneNode(true); c.querySelectorAll('span,i,b').forEach(x => x.remove()); return c.textContent.trim(); }
  let railItems = [];
  function buildRail() {
    const mb = $('menu-buttons'); if (!mb || !E.rail) return;
    E.rail.innerHTML = ''; E.more.innerHTML = '';
    railItems = [];
    const grid = h('div', 'mm-grid');
    const mk = (src, d, inMore) => {
      const label = srcLabel(src);
      const b = h(inMore ? 'button' : 'button', inMore ? 'mm-b' : 'mr-b' + (d.prim ? ' prim' : ''));
      const icon = d.icon ? ico(d.icon, inMore ? 22 : 21) : `<span class="mr-e">${srcEmoji(src)}</span>`;
      b.innerHTML = inMore ? `${icon}<span>${label}</span><i class="mui-dot"></i>` : `${icon}<span class="mui-tipx">${label}${d.key ? `<kbd>${d.key}</kbd>` : ''}</span><i class="mui-dot"></i>`;
      b.onclick = e => { e.stopPropagation(); E.more.classList.remove('open'); src.click(); };
      railItems.push({ b, src, k: d.k });
      return b;
    };
    const kids = [...mb.children].filter(x => x.matches('button, a'));
    kids.forEach(src => { const d = railDef(src); if (d.prim) E.rail.appendChild(mk(src, d, false)); });
    E.rail.appendChild(h('div', 'mr-sep'));
    const moreBtn = h('button', 'mr-b mr-more', `${ico('grid', 21)}<span class="mui-tipx">Tất cả chức năng</span><i class="mui-dot"></i>`);
    moreBtn.onclick = e => { e.stopPropagation(); E.more.classList.toggle('open'); };
    E.rail.appendChild(moreBtn);
    E.moreBtn = moreBtn;
    // bảng Thêm: trên máy tính chỉ hiện nhóm phụ, trên điện thoại hiện tất cả
    const touch = document.body.classList.contains('touch');
    kids.forEach(src => { const d = railDef(src); if (!d.prim || touch) grid.appendChild(mk(src, d, true)); });
    E.more.appendChild(h('h5', '', 'Chức năng'));
    E.more.appendChild(grid);
    const foot = h('div', 'mm-foot', `<span>Giao diện mới · F9</span>`);
    const back = h('button', '', 'Dùng giao diện cũ'); back.onclick = toggleTheme; foot.appendChild(back);
    E.more.appendChild(foot);
    syncRail();
  }
  function syncRail() {
    if (!railItems.length) return;
    const open = $('panel') && !$('panel').classList.contains('hidden');
    const cur = open && window.UI && typeof UI.panelName === 'function' ? (() => { try { return UI.panelName(); } catch (e) { return null; } })() : null;
    let anyMoreDot = false;
    for (const it of railItems) {
      const hidden = it.src.classList.contains('hidden') || it.src.style.display === 'none';
      if (it.b._h !== hidden) { it.b.style.display = hidden ? 'none' : ''; it.b._h = hidden; }
      const dotSrc = it.k === 'character' ? [it.src, ...document.querySelectorAll('#menu-buttons [data-panel="inventory"], #menu-buttons [data-panel="skills"], #menu-buttons [data-panel="mount"]')] : [it.src];
      const dot = dotSrc.some(sb => [...sb.querySelectorAll('.dot')].some(d => !d.classList.contains('hidden')));
      tog(it.b, 'has-dot', dot);
      if (dot && it.b.classList.contains('mm-b')) anyMoreDot = true;
      if (it.b.classList.contains('mr-b')) tog(it.b, 'on', !!cur && (cur === it.k || (it.k === 'character' && ['inventory', 'skills', 'mount'].includes(cur)) || (typeof cur === 'string' && cur.startsWith(it.k))));
    }
    if (E.moreBtn) tog(E.moreBtn, 'has-dot', anyMoreDot);
  }

  // ---------- cập nhật khung nhân vật ----------
  function bar(el, v, max) {
    const p = max ? v / max : 0;
    setW(el.querySelector('.fill'), p); setW(el.querySelector('.lag'), p);
    setText(el.querySelector('span'), `${fmt(v)} / ${fmt(max)}`);
    return p;
  }
  function renderPlayer() {
    const me = window.G && G.me; if (!me || !E.pl) return;
    const st = me.stats || {};
    const hpP = bar(E.hp, me.hp, st.maxHp); bar(E.mp, me.mp, st.maxMp);
    setText(E.name, me.name || '');
    const cl = G.data && G.data.classes && G.data.classes[me.cls];
    setText(E.cls, cl ? cl.name : '');
    setText(E.lv, String(me.level || 1));
    setText(E.pw, short(st.power));
    setText(E.gold, fmt(me.gold)); setText(E.knb, fmt(me.knb));
    const ep = me.expNext ? Math.min(1, me.exp / me.expNext) : 0;
    const off = (RING_C * (1 - ep)).toFixed(1);
    if (E.ring._o !== off) { E.ring.setAttribute('stroke-dashoffset', off); E.ring._o = off; }
    setW(E.xpFill, ep);
    setText(E.xpTxt, `Cấp ${me.level} · ${fmt(me.exp)} / ${fmt(me.expNext)} KN (${(ep * 100).toFixed(1)}%)`);
    const low = !me.dead && hpP > 0 && hpP < 0.3;
    tog(E.pl, 'low', low); tog(E.low, 'on', low);
    tog(E.pl, 'has-pt', me.attrFree > 0);
    // chân dung: chép từ canvas gốc (game tự vẽ lại khi đổi trang bị)
    const src = $('hud-avatar');
    if (src) { const c = E.ava.getContext('2d'); c.clearRect(0, 0, 64, 64); c.imageSmoothingEnabled = false; c.drawImage(src, 0, 0); }
  }

  // ---------- cập nhật khung mục tiêu (đọc từ khung gốc) ----------
  function renderTarget() {
    const f = $('target-frame'); if (!f || !E.tg) return;
    const on = !f.classList.contains('hidden');
    tog(E.tg, 'on', on); tog(document.body, 'mui-hastarget', on);
    if (!on) return;
    tog(E.tg, 'boss', f.classList.contains('boss'));
    const raw = (f.querySelector('.t-name') || {}).textContent || '';
    if (E.tg._raw !== raw) {
      E.tg._raw = raw;
      let s = raw.replace(/^👑\s*/, ''), el = '';
      const parts = s.split(' · '); s = parts[0]; if (parts[1]) el = parts.slice(1).join(' · ');
      let lv = ''; const m = s.match(/\s*\(Cấp\s*(\d+)\)\s*$/); if (m) { lv = 'Cấp ' + m[1]; s = s.slice(0, m.index); }
      setText(E.tName, s); setText(E.tLv, lv); setText(E.tEl, el);
      E.tLv.style.display = lv ? '' : 'none'; E.tEl.style.display = el ? '' : 'none';
    }
    const pw = f.querySelector('.t-pw'), pwH = pw && pw.style.display !== 'none' ? pw.innerHTML : '';
    if (E.tPw._h !== pwH) { E.tPw.innerHTML = pwH; E.tPw._h = pwH; }
    const gb = f.querySelector('.bar'); if (!gb) return;
    const w = parseFloat(gb.querySelector('i').style.width) / 100 || 0;
    setW(E.tBar.querySelector('.fill'), w); setW(E.tBar.querySelector('.lag'), w);
    const t = (gb.querySelector('span').textContent || '').replace('/', ' / ');
    setText(E.tBar.querySelector('span'), t + `  ·  ${Math.round(w * 100)}%`);
  }

  // ======================================================================
  //  GẮN VÀO GAME
  // ======================================================================
  function hook() {
    const UI = window.UI;
    if (!UI || UI.__mui) return !!(UI && UI.__mui);
    UI.__mui = true;
    const wrap = (name, after) => {
      const orig = UI[name]; if (typeof orig !== 'function') return;
      UI[name] = function () { const r = orig.apply(this, arguments); try { after.apply(this, arguments); } catch (e) { console.warn('[MUI]', name, e); } return r; };
    };
    wrap('initHud', () => { buildHud(); buildRail(); renderPlayer(); });
    wrap('updateHud', renderPlayer);
    wrap('updateTarget', renderTarget);
    let lastP = 0;
    wrap('frame', now => { if (now - lastP > 250) { lastP = now; renderPlayer(); } });
    return true;
  }

  function init() {
    addCls(); mount(); keepLast();
    buildBackground();
    buildHud();
    if (!hook()) { const t = setInterval(() => { if (hook()) clearInterval(t); }, 50); setTimeout(() => clearInterval(t), 15000); }
    if (document.body.classList.contains('touch')) root.classList.add('mui-touch');
    console.log('%c Võ Lâm Pixel · Giao diện mới ' + window.__MUI__ + ' %c F9 để bật/tắt', 'background:#1fb8a6;color:#032a24;font-weight:700;border-radius:4px;padding:2px 4px', 'color:#8d9ab0');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// ======================================================================
//  TRỢ THỦ TỰ ĐỘNG (chạy cả với giao diện cũ lẫn mới)
//  - Tự hồi sinh  - Tự làm nhiệm vụ cốt truyện  - Đập đồ tự động  - Nâng thú cưỡi tự động
//  Mọi thao tác đều đi qua đúng nút / sự kiện mà giao diện gốc dùng, có giới hạn an toàn.
// ======================================================================
(function () {
  'use strict';
  if (window.__MUI_HELPER__) return;
  window.__MUI_HELPER__ = '1.9.1';

  const KEY = 'mui_helper';
  const DEF = {
    rv: { on: false, mode: 'here', knb: false, delay: 3, resume: true, max: 6 },
    q: { skip: true, close: true, daily: false, roam: true, solve: false },
    enh: { target: 10, insure: true, safe: true, stopDrop: true, delay: 450 },
    mt: { target: 10, brk: true, batch: 10 },
    pb: { on: false, atk: false },           // atk = cho phép script bật 'Tự động đánh' (mặc định TẮT)
    sc: { on: false },                       // tự làm nhiệm vụ môn phái (mặc định TẮT)
    ec: { on: false, tier: '', defend: true }, // tự động áp tiêu (mặc định TẮT)
    ai: { on: true }                          // AI tự chữa kẹt cho mọi auto (mặc định BẬT)
  };
  const load = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}'); const o = {};
      for (const k in DEF) o[k] = Object.assign({}, DEF[k], s[k] || {});
      if ((s.__v || 0) < 3) { o.q.solve = DEF.q.solve; o.pb.atk = DEF.pb.atk; }   // 2.3.0 tự bật sẵn -> trả về mặc định TẮT
      o.__v = 3;
      return o;
    } catch (e) { const o = JSON.parse(JSON.stringify(DEF)); o.__v = 3; return o; }
  };
  const C = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} };

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = n => (Math.round(n || 0)).toLocaleString('vi-VN');
  const TILE = 64;
  const emit = (ev, d) => window.G && G.socket && G.socket.emit(ev, d);
  const toast = (t, k) => { try { window.UI && UI.toast && UI.toast(t, k); } catch (e) {} };
  const have = id => (G.me && G.me.inv || []).filter(x => x.id === id).reduce((a, x) => a + (x.qty || 0), 0);
  const ready = () => window.G && G.me && G.inGame && window.UI;
  const isOpen = name => { try { return !$('panel').classList.contains('hidden') && UI.panelName() === name; } catch (e) { return false; } };

  // ---------------- CSS riêng (dùng biến của giao diện mới nếu có) ----------------
  const css = `
  .mh-tag{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(255,255,255,.08);color:#cfd8e8;margin-left:6px;vertical-align:middle}
  .mh-tag.on{background:rgba(52,211,166,.2);color:#5ef0c4}
  .mh-row2{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
  .mh-stat{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
  .mh-stat div{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:5px 6px;text-align:center;font-size:11px;color:#9aa6ba}
  .mh-stat b{display:block;font-size:14px;color:#eef3fb}
  .mh-log{margin-top:6px;font-size:12px;color:#9aa6ba;min-height:16px}
  .mh-log.ok{color:#4ade80}.mh-log.bad{color:#ff7a7a}
  .mh-box{margin-top:10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(52,211,166,.35);background:linear-gradient(180deg,rgba(52,211,166,.08),rgba(255,255,255,.02))}
  .mh-box h5{margin:0 0 6px;font-size:13px;color:#7ff5d0;letter-spacing:.02em}
  .mh-box .au-row{margin:4px 0}
  .mh-run{position:relative}
  .mh-run.on{background:linear-gradient(90deg,#ff7a59,#f4466a)!important;color:#fff!important;border-color:transparent!important}
  #mh-chip{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:30;display:none;align-items:center;gap:8px;padding:6px 8px 6px 12px;border-radius:999px;font:600 12px/1.2 'Be Vietnam Pro',system-ui,sans-serif;color:#e8fff7;background:rgba(8,22,30,.82);border:1px solid rgba(52,211,166,.45);box-shadow:0 8px 24px rgba(0,0,0,.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);max-width:min(92vw,560px)}
  #mh-chip.on{display:flex} body.mh-panel #mh-chip{display:none}
  #mh-chip .d{width:8px;height:8px;border-radius:50%;background:#34d3a6;box-shadow:0 0 0 0 rgba(52,211,166,.6);animation:mhp 1.6s infinite;flex:none}
  #mh-chip .t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #mh-chip button{flex:none;border:0;border-radius:999px;padding:4px 10px;font:700 11px/1 inherit;cursor:pointer;background:rgba(255,255,255,.12);color:#fff}
  #mh-chip button:hover{background:rgba(255,110,110,.5)}
  #mh-chip.warn{border-color:rgba(244,199,106,.6)} #mh-chip.warn .d{background:#f4c76a;animation:none}
  @keyframes mhp{0%{box-shadow:0 0 0 0 rgba(52,211,166,.6)}70%{box-shadow:0 0 0 8px rgba(52,211,166,0)}100%{box-shadow:0 0 0 0 rgba(52,211,166,0)}}
  #mh-revive{margin-top:10px;font-size:13px;color:#7ff5d0;text-align:center}
  #mh-revive button{margin-left:8px;border:0;border-radius:8px;padding:3px 10px;cursor:pointer;background:rgba(255,255,255,.12);color:#fff}
  body.touch #mh-chip{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 190px)}

  #mh-ctabs{display:flex;gap:6px;padding:10px 14px 4px;overflow-x:auto;scrollbar-width:none;flex:none}
  #mh-ctabs::-webkit-scrollbar{display:none}
  #mh-ctabs button{position:relative;flex:1 1 0;min-width:84px;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#c9d4e6;font:600 13px/1 'Be Vietnam Pro',system-ui,sans-serif;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,color .15s}
  #mh-ctabs button:hover{background:rgba(255,255,255,.08);color:#fff}
  #mh-ctabs button.on{background:linear-gradient(180deg,rgba(52,211,166,.28),rgba(18,60,60,.45));border-color:rgba(52,211,166,.55);color:#e6fff6;box-shadow:0 0 0 1px rgba(52,211,166,.15) inset}
  #mh-ctabs .e{font-size:15px}
  #mh-ctabs .mh-cdot{display:none;position:absolute;top:5px;right:7px;width:8px;height:8px;border-radius:50%;background:#ff5d6c;box-shadow:0 0 0 2px rgba(10,14,22,.9)}
  #mh-ctabs button.mh-hasdot .mh-cdot{display:block}
  html:not(.mui) #mh-ctabs button{border-color:#7a5420;background:rgba(0,0,0,.25);color:#f3e2bd}
  html:not(.mui) #mh-ctabs button.on{background:linear-gradient(180deg,#f2be4c,#b07a22);color:#2a1606;border-color:#ffd76a;box-shadow:none}
  .panel-box.mh-cg{display:flex;flex-direction:column}
  @media (max-width:820px),(max-height:520px){#mh-ctabs{padding:6px 8px 2px;gap:4px}#mh-ctabs button{min-width:0;padding:7px 6px;font-size:12px;gap:4px;border-radius:10px}#mh-ctabs .e{font-size:13px}}
    `;
  function addCss() { if ($('mh-style')) return; const s = document.createElement('style'); s.id = 'mh-style'; s.textContent = css; (document.head || document.documentElement).appendChild(s); }

  // ======================================================================
  //  1) TỰ HỒI SINH
  // ======================================================================
  const RV = { t: null, deaths: [], lastAuto: false, wasAuto: false, spot: null, cd: 0 };
  function onDeadShown() {
    if (!C.rv.on || RV.t) return;
    const now = Date.now();
    RV.deaths = RV.deaths.filter(t => now - t < 10 * 60e3); RV.deaths.push(now);
    RV.wasAuto = RV.lastAuto || Q.on; RV.spot = { x: G.self.x, y: G.self.y, map: G.map && G.map.id };
    if (RV.deaths.length > C.rv.max) { showReviveNote(`Đã chết ${RV.deaths.length} lần trong 10 phút — tạm dừng tự hồi sinh để tránh mất kinh nghiệm liên tục.`, false); return; }
    let left = Math.max(1, +C.rv.delay || 3);
    const tick = () => {
      if ($('dead-overlay').classList.contains('hidden')) { clearReviveTimer(); return; }
      if (left <= 0) { clearReviveTimer(); doRevive(); return; }
      showReviveNote(`Tự hồi sinh sau ${left} giây…`, true); left--;
      RV.t = setTimeout(tick, 1000);
    };
    tick();
  }
  function clearReviveTimer() { clearTimeout(RV.t); RV.t = null; const n = $('mh-revive'); if (n) n.remove(); }
  function showReviveNote(text, cancel) {
    const box = $('dead-overlay'); if (!box) return;
    const host = box.querySelector('.dead-box, .modal, div') || box;
    let n = $('mh-revive'); if (!n) { n = document.createElement('div'); n.id = 'mh-revive'; host.appendChild(n); }
    n.innerHTML = esc(text) + (cancel ? '<button type="button">Hủy</button>' : '');
    const b = n.querySelector('button'); if (b) b.onclick = () => { clearReviveTimer(); RV.cancelled = true; };
  }
  function doRevive() {
    const here = $('revive-here'), town = $('respawn-btn'), knb = $('revive-knb');
    const poor = here && here.classList.contains('poor');
    let btn = town;
    if (C.rv.mode === 'here') {
      if (here && !poor) btn = here;
      else if (C.rv.knb && knb && !knb.classList.contains('hidden') && (G.me.knb || 0) > 0) btn = knb;
    }
    RV.mode = btn === town ? 'town' : 'here';
    if (btn) btn.click();
  }
  function onRevived() {
    if (!C.rv.on || !C.rv.resume || !RV.wasAuto) return;
    RV.wasAuto = false;
    setTimeout(() => {
      if (!ready() || G.me.dead) return;
      if (Q.on) return;   // tự làm nhiệm vụ sẽ tự dẫn đường tiếp
      if (RV.mode === 'here' && G.map && !G.map.safe) { G.setAuto(true); toast('Đã hồi sinh — tiếp tục tự động đánh'); }
      else toast('Đã hồi sinh ở thành. Bật lại Tự động khi tới bãi luyện công.');
    }, 900);
  }
  function watchDead() {
    const ov = $('dead-overlay'); if (!ov || ov.__mh) return; ov.__mh = true;
    let was = !ov.classList.contains('hidden');
    new MutationObserver(() => {
      const on = !ov.classList.contains('hidden');
      if (on && !was) { RV.cancelled = false; onDeadShown(); }
      if (!on && was) { clearReviveTimer(); onRevived(); }
      was = on;
    }).observe(ov, { attributes: true, attributeFilter: ['class'] });
  }

  // ======================================================================
  //  2) TỰ LÀM NHIỆM VỤ CỐT TRUYỆN
  // ======================================================================
  const Q = { on: false, step: '', msg: '', warn: false, lastTalk: 0, lastNpc: null, roamAt: 0, lastKey: '', stuck: 0, lastDaily: 0, talkAt: 0, claimAt: 0, npcAt: 0 };
  function storyStep() {
    const st = G.me && G.me.story, S = G.data && G.data.story;
    if (!st || st.done || !S || !S.CHAPTERS) return null;
    const ch = S.CHAPTERS[st.ch]; return ch ? ch.steps[st.st] || null : null;
  }
  function setQuest(on) {
    if (Q.on === on) return;
    Q.on = on;
    if (!on) { if (G.auto && Q.autoByUs) G.setAuto(false); Q.autoByUs = false; G.npcGoal = null; G.moveTo = null; setChip(''); toast('Đã dừng tự làm nhiệm vụ'); }
    else { Q.lastKey = ''; toast('Bắt đầu tự làm nhiệm vụ cốt truyện'); }
    refreshHelper();
  }
  function ensureAuto(on, home) {
    if (on) {
      if (!G.auto) { G.setAuto(true); Q.autoByUs = true; }
      if (home) G.autoHome = { x: home.x, y: home.y };
    } else if (G.auto) { G.setAuto(false); }
  }
  const npcPos = n => ({ x: (n.x + 0.5) * TILE, y: (n.y + 0.5) * TILE });
  const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function freeTile(tx, ty) { const m = G.map; return tx > 1 && ty > 1 && tx < m.w - 2 && ty < m.h - 2 && !G.solid.has(m.tiles[ty * m.w + tx]); }
  function roam() {
    const now = performance.now(), s = G.self, m = G.map;
    if (G.moveTo && now - Q.roamAt < 7000) return;
    for (let i = 0; i < 40; i++) {
      const tx = Math.floor(Math.random() * m.w), ty = Math.floor(Math.random() * m.h);
      if (!freeTile(tx, ty)) continue;
      const p = { x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE }, d = near(p, s);
      if (d < 350 || d > 1600) continue;
      G.moveTo = p; Q.roamAt = now; return;
    }
  }
  function goPortal(toMap) {
    const p = (G.map.portals || []).find(x => x.to === toMap);
    if (!p) return false;
    const g = { x: (p.x + 0.5) * TILE, y: (p.y + 0.5) * TILE };
    if (!G.moveTo || near(G.moveTo, g) > 40) G.moveTo = g;
    return true;
  }
  function trainingPortal() {
    const lv = G.me.level || 1, maps = G.data.maps || {};
    let best = null, bv = -1;
    for (const p of G.map.portals || []) {
      const m = maps[p.to]; if (!m || m.safe || m.pvp || m.sect) continue;
      const min = +m.minLv || parseInt(m.lv) || 1;
      if (min <= lv && min > bv) { bv = min; best = p; }
    }
    return best;
  }
  // ======================================================================
  //  ĐI TỚI MỌI BẢN ĐỒ + BẢNG XA PHU RIÊNG  (Trợ thủ 1.2.0)
  //   - pathTo() : tìm đường nhiều chặng qua cổng của TOÀN BỘ bản đồ
  //   - Xa Phu   : tự đi sát NPC rồi gửi teleport (không cần bảng chọn của game)
  //   - Bảng Xa Phu của game bị thay bằng bảng của Trợ thủ: đủ mọi map,
  //     tự thêm khi game/máy chủ có bản đồ mới.
  // ======================================================================
  // >>> MUI-TRAVEL-BEGIN
  // Bảng bản đồ gốc lấy từ dữ liệu game (GET /api/gamedata): id -> [tên, cấp tối thiểu, thành trấn, môn phái]
  const GAMEMAPS = {
    "cho_phien": ["Chợ Phiên Tương Dương", 1, 1, 0],
    "lan_chau": ["Lan Châu Thành", 1, 1, 0],
    "thanh_do": ["Thành Đô Phủ", 1, 1, 0],
    "tuong_duong": ["Thành Tương Dương", 1, 1, 0],
    "long_mon": ["Long Môn Trấn", 50, 1, 0],
    "cai_bang_da": ["Cái Bang Tổng Đà", 1, 0, 1],
    "con_lon_phai": ["Côn Lôn Phái", 1, 0, 1],
    "duong_gia_bao": ["Đường Gia Bảo", 1, 0, 1],
    "nga_my_son": ["Nga My Sơn", 1, 0, 1],
    "thien_vuong_dao": ["Thiên Vương Đảo", 1, 0, 1],
    "thieu_lam_tu": ["Thiếu Lâm Tự", 1, 0, 1],
    "thuy_yen_mon": ["Thúy Yên Môn", 1, 0, 1],
    "van_doc_coc": ["Vạn Độc Cốc", 1, 0, 1],
    "vo_dang_son": ["Võ Đang Sơn", 1, 0, 1],
    "bang_cung": ["Băng Cung Thiên Sơn", 1, 0, 0],
    "bang_dong": ["Băng Phách Động", 1, 0, 0],
    "ben_do": ["Bến Đò Hán Thủy", 1, 0, 0],
    "co_dao": ["Cổ Đạo Tơ Lụa", 1, 0, 0],
    "co_mo": ["Cổ Mộ Hoang Sơn", 1, 0, 0],
    "dong_gau": ["Hắc Hùng Động", 1, 0, 0],
    "hac_phong_coc": ["Hắc Phong Cốc", 1, 0, 0],
    "hoa_son": ["Hoa Sơn Tuyệt Đỉnh", 1, 0, 0],
    "hoa_son_ld": ["Hoa Sơn Luận Kiếm", 1, 0, 0],
    "kiem_trung": ["Kiếm Trủng Cổ Mộ", 1, 0, 0],
    "lang_hoang": ["Làng Hoang Phế", 1, 0, 0],
    "lau_lan": ["Lâu Lan Cổ Thành", 1, 0, 0],
    "ma_giao": ["Ma Giáo Cấm Địa", 1, 0, 0],
    "ngoai_o": ["Ngoại Ô Tương Dương", 1, 0, 0],
    "sa_mac": ["Sa Mạc Tây Vực", 1, 0, 0],
    "son_dao": ["Sơn Đạo Thanh Thành", 1, 0, 0],
    "thien_son_khau": ["Thiên Sơn Khẩu", 1, 0, 0],
    "thuy_trai": ["Thủy Trại Hắc Phong", 1, 0, 0],
    "truc_lam": ["Rừng Trúc Thanh Thành", 1, 0, 0],
    "ty_vo_dai": ["Lôi Đài Tỷ Võ", 1, 0, 0],
    "vuc_sau": ["Vực Sâu Hoa Sơn", 1, 0, 0],
    "chien_truong": ["Lôi Đài Hoa Sơn (PK)", 10, 0, 0],
    "dai_hoi": ["Đại Hội Võ Lâm", 20, 0, 0],
    "bao_thach_dong": ["Bảo Thạch Khoáng Động", 25, 0, 0],
    "u_minh": ["U Minh Điện", 50, 0, 0],
    "con_lon": ["Côn Lôn Tiên Cảnh", 55, 0, 0],
    "huyen_tinh_canh": ["Huyền Tinh Mật Cảnh", 55, 0, 0],
    "thien_tri": ["Thiên Trì Huyền Băng", 60, 0, 0],
    "nhac_mieu": ["Nhạc Vương Miếu", 65, 0, 0],
    "vo_luong": ["Vô Lượng Sơn Cốc", 65, 0, 0],
    "huyet_ma": ["Huyết Ma Uyên", 75, 0, 0],
    "doan_hon": ["Đoạn Hồn Nhai", 85, 0, 0],
    "thien_ngoai": ["Thiên Ngoại Thiên", 98, 0, 0],
    "cuu_u": ["Cửu U Ma Vực", 108, 0, 0]
  };
  const NO_TP = { dai_hoi: 1, ty_vo_dai: 1, chien_truong: 1, hoa_son_ld: 1 };   // đấu trường/đại hội: không đi bằng Xa Phu
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const MAPNAME = id => (((G.data || {}).maps || {})[id] || {}).name || (GAMEMAPS[id] ? GAMEMAPS[id][0] : ('Map ' + id));
  const tpLoad = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v || d; } catch (e) { return d; } };
  const TP = tpLoad('mui_tp', {});          // map -> danh sách Xa Phu chở tới (học từ máy chủ)
  const TPBAD = tpLoad('mui_tpbad', {});    // map Xa Phu đã từ chối
  const tpSave = () => { try { localStorage.setItem('mui_tp', JSON.stringify(TP)); } catch (e) {} };
  const tpBad = id => { if (!id) return; TPBAD[id] = 1; try { localStorage.setItem('mui_tpbad', JSON.stringify(TPBAD)); } catch (e) {} };
  const tpOk = id => !!(GAMEMAPS[id] && !NO_TP[id] && !TPBAD[id] && (G.me.level || 1) >= (GAMEMAPS[id][1] || 1));
  const tpServed = id => { const e = TP[G.map && G.map.id]; return !!(e && e.indexOf(id) >= 0); };

  // Đường đi ngắn nhất qua cổng, dùng mọi bản đồ mà game đã gửi về
  function pathTo(dest) {
    const maps = (G.data || {}).maps || {}, cm = G.map && G.map.id;
    if (!cm || !dest) return null;
    if (cm === dest) return [];
    const prev = {}, q = [cm]; prev[cm] = null;
    while (q.length && !(dest in prev)) {
      const id = q.shift(), ps = (maps[id] || {}).portals || [];
      for (const pt of ps) { const to = pt && pt.to; if (!to || (to in prev)) continue; if (to !== dest && aiBlocked(to)) continue;   // AI đang tránh map này
        prev[to] = id; q.push(to); }
    }
    if (!(dest in prev)) return null;
    const out = [];
    for (let c = dest; prev[c] != null; c = prev[c]) out.unshift(c);
    return out;   // [chặng kế tiếp, …, dest]
  }
  // Bãi luyện công phù hợp nhất, ở BẤT KỲ bản đồ nào (không chỉ map kế bên)
  function bestTraining() {
    const lv = G.me.level || 1, maps = (G.data || {}).maps || {};
    let best = null, bv = -1;
    for (const id in maps) {
      const m = maps[id];
      if (!m || m.safe || m.pvp || m.sect || id === (G.map && G.map.id)) continue;
      const min = +m.minLv || parseInt(m.lv) || 1;
      if (min > lv || min <= bv) continue;
      if (!pathTo(id) && !tpOk(id)) continue;
      bv = min; best = id;
    }
    return best;
  }
  function xaNpcHere() {
    const npcs = (G.map && G.map.npcs) || [];
    let best = null, bd = 1e9;
    for (const n of npcs) {
      const nm = norm((((G.data || {}).npcs || {})[n.id] || {}).name);
      if (n.id !== 'xa_phu' && nm.indexOf('xa phu') < 0) continue;
      const d = near({ x: (n.x + 0.5) * TILE, y: (n.y + 0.5) * TILE }, G.self);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }
  const TRV = { dest: null, asked: 0, teleAt: 0, teleTo: null, walkAt: 0, tries: 0, wx: 0, wy: 0, wt: 0 };
  function xaTravel(dest, label) {          // 'go' | 'blocked'
    if (TRV.teleTo && Date.now() - TRV.teleAt > 3000 && G.map.id !== TRV.teleTo) {   // máy chủ từ chối -> ghi nhớ
      const bad = TRV.teleTo; TRV.teleTo = null;
      if (!tpServed(bad)) tpBad(bad);
      toast('Xa Phu không tới được ' + MAPNAME(bad) + ' — đã ghi nhớ', 'error');
      return 'blocked';
    }
    const n = xaNpcHere();
    if (!n) return 'blocked';
    const tx = (n.x + 0.5) * TILE, ty = (n.y + 0.5) * TILE + 40;   // đứng sát NPC mới bấm
    if (near({ x: tx, y: ty }, G.self) > TILE * 0.8) {
      const moved = TRV.wx ? Math.hypot(G.self.x - TRV.wx, G.self.y - TRV.wy) : 99;
      const stuck = moved < 6 && Date.now() - TRV.wt > 1400;
      if (!stuck) {
        if (moved >= 6) { TRV.wx = G.self.x; TRV.wy = G.self.y; TRV.wt = Date.now(); }
        G.npcGoal = null; G.chase = null; G.moveTo = { x: tx, y: ty };
        if (Date.now() - TRV.walkAt > 1200) { TRV.walkAt = Date.now(); setChip(label + ' · 🐎 lại gần Xa Phu…'); }
        return 'go';
      }
    }
    TRV.wx = 0; TRV.wy = 0; G.npcGoal = null; G.moveTo = null;
    if (TRV.teleTo) return 'go';                                   // đang chờ máy chủ đổi map
    if ((tpOk(dest) || tpServed(dest)) && !XABAD[dest]) {
      TRV.teleAt = Date.now(); TRV.teleTo = dest;
      try { emit('teleport', { map: dest }); } catch (e) {}
      setChip(label + ' · 🐎 Xa Phu → ' + MAPNAME(dest));
      return 'go';
    }
    if (TRV.tries >= 2) return 'blocked';
    if (!TRV.asked || Date.now() - TRV.asked > 1500) {             // chưa biết đường -> hỏi Xa Phu
      TRV.tries++; TRV.asked = Date.now();
      try { emit('npc', { id: n.id }); } catch (e) {}
      setChip(label + ' · 🐎 hỏi Xa Phu đường đi…');
    }
    return 'go';
  }
  function travelTo(dest, label) {          // 'walk' | 'tp' | 'here' | 'blocked'
    if (!dest || !G.map) return 'blocked';
    if (dest === G.map.id) return 'here';
    if (TRV.dest !== dest) { TRV.dest = dest; TRV.tries = 0; TRV.asked = 0; TRV.teleAt = 0; TRV.teleTo = null; }
    const path = pathTo(dest);
    if (path && path.length) { goPortal(path[0]); return 'walk'; }  // còn đường bộ thì đi cổng
    return xaTravel(dest, label) === 'blocked' ? 'blocked' : 'tp';
  }
  function hookTp() {
    if (!window.G || !G.socket || G.socket.__mhTp) return;
    G.socket.__mhTp = 1;
    G.socket.on('npc', d => {
      if (!d || !d.teleports || !G.map) return;
      const list = d.teleports.map(x => x && x.map).filter(Boolean);
      if (list.length) { TP[G.map.id] = list; tpSave(); }
    });
  }

  // ---------------- Bảng Xa Phu của Trợ thủ (thay bảng của game) ----------------
  const XA = { d: null, cur: null, q: '', try: null };   // cur = NPC đang mở, chỉ vẽ bảng Xa Phu khi đúng NPC Xa Phu
  const XABAD = {};                         // máy chủ từ chối trong phiên này (không lưu localStorage)
  function hookMsg() {                      // lấy đúng lời máy chủ khi từ chối
    if (!window.G || !G.socket || G.socket.__mhMsg) return;
    G.socket.__mhMsg = 1;
    const grab = d => { if (XA.try && d && d.text) XA.try.msg = String(d.text).slice(0, 120); };
    try { G.socket.on('toast', grab); G.socket.on('notice', grab); } catch (e) {}
  }
  function xaRows() {                       // gộp 3 nguồn -> luôn đủ map, tự nhận map mới
    const box = new Map();
    const put = o => { if (!o || !o.id) return; box.set(o.id, Object.assign(box.get(o.id) || {}, o)); };
    const maps = (G.data || {}).maps || {};
    for (const id in maps) {
      const m = maps[id] || {};
      put({ id, name: m.name || MAPNAME(id), lv: 'Cấp ' + (m.lv || (+m.minLv || 1)), minLv: +m.minLv || 1,
            town: !!m.town, sect: !!m.sect, pvp: !!m.pvp, safe: !!m.safe, duel: !!m.duel });
    }
    for (const id in GAMEMAPS) {
      if (box.has(id)) continue;
      const g = GAMEMAPS[id];
      put({ id, name: g[0], lv: 'Cấp ' + (g[1] || 1), minLv: g[1] || 1, town: !!g[2], sect: !!g[3] });
    }
    for (const t of (XA.d && XA.d.teleports) || []) put({ id: t.map, name: t.name || MAPNAME(t.map), lv: 'Cấp ' + (t.lv || (+t.minLv || 1)), minLv: +t.minLv || 1, town: !!t.town, sect: !!t.sect, price: t.price, served: true });
    return Array.from(box.values()).sort((a, b) => (a.minLv - b.minLv) || a.name.localeCompare(b.name, 'vi'));
  }
  // Chỉ những tuyến Xa Phu đang thật sự có (danh sách máy chủ gửi khi mở NPC), không thêm map suy đoán
  function xaNpcRows() {
    const all = xaRows();
    const tel = ((XA.cur && XA.cur.teleports) || (XA.d && XA.d.teleports) || []).filter(t => t && t.map);
    if (!tel.length) return all;                        // chưa có danh sách -> giữ nguyên để không trắng bảng
    const ok = {};
    for (const t of tel) ok[t.map] = 1;
    const cur = (G.map && G.map.id) || '';
    if (cur) ok[cur] = 1;
    return all.filter(r => ok[r.id]);
  }
  function xaHtml(rows, npcOnly) {
    const cur = G.map.id, lv = G.me.level || 1, grp = { t: [], d: [], s: [], o: [] };
    for (const r of rows) (r.town ? grp.t : r.sect ? grp.s : (r.pvp || r.safe || r.duel || NO_TP[r.id]) ? grp.o : grp.d).push(r);
    const row = r => {
      const lock = lv < (r.minLv || 1), here = cur === r.id;
      const guess = !r.served && GAMEMAPS[r.id] ? ' <span class="small muted" title="Xa Phu ở đây không có tuyến — bấm sẽ đi bộ">🧭</span>' : '';
      return '<div class="li' + (lock ? ' locked' : '') + '" data-s="' + esc(norm(r.name) + ' ' + r.id) + '"'
        + ' data-xa="' + esc(r.id) + '" data-lock="' + (lock ? (r.minLv || 1) : '') + '">'      // bấm cả dòng
        + '<div class="grow"><b>' + (r.town ? '🏯 ' : r.sect ? '🏮 ' : '') + esc(r.name) + guess + '</b>'
        + '<div class="sub">' + esc(r.lv || ('Cấp ' + (r.minLv || 1)))
        + (r.minLv > 1 ? ' · <span class="' + (lock ? 'warn' : '') + '">' + (lock ? '🔒 ' : '') + 'Yêu cầu cấp ' + r.minLv + '</span>' : '')
        + (here ? ' · <b>đang ở đây</b>' : '') + '</div></div>'
        + '<button class="btn small green" data-xa="' + esc(r.id) + '"' + (here ? ' disabled' : '') + '>'
        + (here ? 'Đang ở' : r.served ? (r.price ? fmt(r.price) + ' 💰' : 'Miễn phí') : '🚶 đi bộ') + '</button></div>';
    };
    const sec = (ic, nm, l) => l.length ? '<h4 class="tp-h" data-xg>' + ic + ' ' + nm + ' <span class="small muted">(' + l.length + ')</span></h4><div class="list" data-xl>' + l.map(row).join('') + '</div>' : '';
    return '<div class="row" style="gap:6px;align-items:center;margin:0 0 6px">'
      + '<input id="xa-q" placeholder="Tìm bản đồ…" value="' + esc(XA.q) + '" style="flex:1;min-width:0">'
      + '<span class="small muted" id="xa-n"></span></div>'
      + sec('🏯', 'Thành trấn', grp.t) + sec('⚔️', 'Bãi luyện công', grp.d) + sec('🏮', 'Môn phái', grp.s) + sec('🏟', 'Đặc biệt', grp.o)
      + '<p class="small muted" style="margin:8px 2px 0">' + (npcOnly
          ? 'Chỉ hiện các tuyến mà Xa Phu này đang có. Bản đồ không có tuyến đã được ẩn (muốn đi bộ thì dùng bảng 🧭 Dịch chuyển nhanh của Trợ thủ).'
          : 'Bảng Dịch chuyển nhanh của Trợ thủ: gộp bản đồ từ dữ liệu game + bảng gốc + danh sách máy chủ — đủ map, tự thêm khi có map mới. 🧭 = Xa Phu không có tuyến (bấm sẽ đi bộ).') + '</p>';
  }
  function xaFilter(body) {
    const q = norm(XA.q); let n = 0;
    body.querySelectorAll('.li[data-s]').forEach(el => {
      const on = !q || el.dataset.s.indexOf(q) >= 0;
      el.style.display = on ? '' : 'none'; if (on) n++;
    });
    body.querySelectorAll('[data-xg]').forEach(h => {
      const box = h.nextElementSibling; if (!box) return;
      let any = false; box.querySelectorAll('.li').forEach(el => { if (el.style.display !== 'none') any = true; });
      h.style.display = any ? '' : 'none'; box.style.display = any ? '' : 'none';
    });
    const c = $('xa-n'); if (c) c.textContent = n + ' map';
  }
  function xaBind(body) {
    const qi = $('xa-q');
    if (qi) qi.oninput = () => { XA.q = qi.value; xaFilter(body); };
    xaFilter(body);
  }
  // Bấm map: uỷ nhiệm 1 lần trên #panel -> game có vẽ lại bao nhiêu lần cũng không mất sự kiện
  function xaGo(id) {
    if (!id) return;
    if (G.map && G.map.id === id) { toast('Đang ở ' + MAPNAME(id) + ' rồi'); return; }
    if (!window.G || !G.socket || !G.socket.emit) { toast('Chưa kết nối máy chủ — thử lại sau', 'error'); return; }
    try { if (G.sfx) G.sfx('click'); } catch (e) {}
    if (!tpServed(id)) {                                       // Xa Phu ở đây không có tuyến -> đi bộ, không gửi lệnh hỏng
      const p = pathTo(id);
      if (p && p.length) {
        toast('Xa Phu ở đây không có tuyến tới ' + MAPNAME(id) + ' — 🚶 đi bộ ' + p.length + ' chặng');
        travelTo(id, 'Xa Phu');
      } else toast('Xa Phu ở đây không có tuyến tới ' + MAPNAME(id) + ' và không có đường bộ — dùng Phù về thành rồi đi lại', 'error');
      return;
    }
    XA.try = { id: id, at: Date.now(), msg: '' };              // 3 s sau kiểm tra máy chủ có đổi map không
    setChip('🐎 Xa Phu → ' + MAPNAME(id));
    toast('🐎 ' + MAPNAME(id));
    emit('teleport', { map: id });
  }
  function xaClick(ev) {
    const el = ev.target && ev.target.closest && ev.target.closest('[data-xa]');
    if (!el) return;
    ev.preventDefault(); ev.stopPropagation();
    const host = el.closest('[data-lock]');                    // bấm nút thì lấy khoá cấp từ dòng cha
    const need = host ? host.getAttribute('data-lock') : '';
    if (need) toast('Bản đồ yêu cầu cấp ' + need + ' — vẫn gửi tới Xa Phu');
    xaGo(el.getAttribute('data-xa'));
  }
  function hookClick() {
    const p = $('panel');
    if (!p || p.__xa) return;
    p.__xa = 1;
    p.addEventListener('click', xaClick, true);                 // capture: chạy trước handler khác
  }
  function xaPaint() {
    if (!XA.cur || !XA.cur.teleports) return;                          // NPC khác (thợ rèn, tạp hoá…) -> không đụng vào bảng của họ
    if (!window.UI || !UI.panelName || UI.panelName() !== 'npc') return;
    const body = $('panel-body'); if (!body) return;
    const rows = xaNpcRows();
    const sig = Object.keys((G.data || {}).maps || {}).length + '|' + (XA.cur.teleports || []).length + '|' + (G.map && G.map.id) + '|' + (G.me && G.me.level) + '|' + rows.length;
    if (body.__xaSig === sig && body.querySelector('#xa-q')) return;    // game vẽ đè thì vẽ lại
    body.__xaSig = sig;
    body.innerHTML = xaHtml(rows, true);
    xaBind(body);
  }
  function xaTick() {                       // bấm map ngoài bảng máy chủ mà không sang map -> ghi nhớ
    if (!XA.try) return;
    if (Date.now() - XA.try.at < 3000) return;
    const id = XA.try.id, why = XA.try.msg ? ' — “' + XA.try.msg + '”' : '';
    XA.try = null;
    if (!G.map || G.map.id === id) return;
    XABAD[id] = 1;
    toast('Máy chủ từ chối ' + MAPNAME(id) + why, 'error');
    const p = pathTo(id);
    if (p && p.length) { toast('🚶 Đi bộ tới ' + MAPNAME(id) + ' (' + p.length + ' chặng)'); travelTo(id, 'Xa Phu'); }
  }
  // ---- Thay bảng "Dịch chuyển nhanh" (#tp-box) của game: cùng danh sách, dùng lệnh /tp như game ----
  function tpBox() { return $('tp-box'); }
  function xaBoxPaint() {
    const b = tpBox(); if (!b) return;
    const tabs = b.querySelector('.tp-tabs'), list = b.querySelector('.tp-list');
    if (!list) return;
    const act = tabs && tabs.querySelector('button.on');
    if (act && act.getAttribute('data-tab') !== 'map') return;      // tab "Người chơi" giữ nguyên của game
    const inp = b.querySelector('.tp-q');
    if (inp && !inp.__xa) { inp.__xa = 1; inp.addEventListener('input', () => { try { xaBoxPaint(); } catch (e) {} }); }
    const q = norm(inp ? inp.value : '');
    const sig = q + '|' + Object.keys((G.data || {}).maps || {}).length + '|' + (G.me.level || 1) + '|' + G.map.id;
    const own = list.firstElementChild && (list.firstElementChild.hasAttribute('data-xab') || list.firstElementChild.hasAttribute('data-xa0'));
    if (list.getAttribute('data-xasig') === sig && own) return;   // game vẽ đè thì vẽ lại
    list.setAttribute('data-xasig', sig);
    const rows = xaRows().filter(r => !q || norm(r.name).indexOf(q) >= 0 || r.id.indexOf(q) >= 0);
    const lv = G.me.level || 1, cur = G.map.id;
    const html = rows.map(r => {
      const lock = lv < (r.minLv || 1);
      const kind = r.town ? 'Thành' : r.sect ? 'Môn phái' : (r.pvp || r.duel || NO_TP[r.id]) ? 'Đặc biệt/PK' : 'Bãi luyện công';
      return '<button class="tp-it' + (cur === r.id ? ' cur' : '') + '" data-xab="' + esc(r.id) + '"><b>' + esc(r.name) + '</b><small>'
        + kind + ((r.minLv > 1 || lock) ? ' · Cấp ' + (r.minLv || 1) + (lock ? ' (chưa đủ)' : '') : '')
        + (!r.served && GAMEMAPS[r.id] ? ' · 🧭' : '') + '</small></button>';
    }).join('');
    list.innerHTML = html || '<p class="muted small" data-xa0="1">Không có bản đồ phù hợp</p>';
    if (!b.__xab) { b.__xab = 1; b.addEventListener('click', xaBoxClick, true); }
  }
  function xaBoxClick(ev) {
    const el = ev.target && ev.target.closest && ev.target.closest('[data-xab]');
    if (!el) return;
    ev.preventDefault(); ev.stopPropagation();
    const id = el.getAttribute('data-xab');
    if (!id) return;
    if (G.map && G.map.id === id) { toast('Đang ở ' + MAPNAME(id) + ' rồi'); return; }
    try { if (G.sfx) G.sfx('click'); } catch (e) {}
    toast('🧭 /tp ' + MAPNAME(id));
    try { emit('chat', { ch: 'world', text: '/tp ' + id }); } catch (e) {}   // đúng cách game gọi
    const b = tpBox(); if (b) b.remove();
  }
  function hookBox() {
    const H = window.HudTools;
    if (!H || H.__xa) return !!(H && H.__xa);
    H.__xa = 1;
    const o = H.openTp;
    H.openTp = function () { const r = o.apply(this, arguments); try { xaBoxPaint(); } catch (e) {} return r; };
    return true;
  }

  function hookXa() {
    const UI = window.UI;
    if (!UI || UI.__xa) return !!(UI && UI.__xa);
    UI.__xa = 1;
    const on = UI.openNpc, rf = UI.refreshPanel;
    UI.openNpc = function (d) { XA.cur = (d && d.teleports) ? d : null; if (d && d.teleports) { XA.d = d; XA.q = ''; } return on.apply(this, arguments); };
    UI.refreshPanel = function () {
      const r = rf.apply(this, arguments);
      try { xaPaint(); } catch (e) { console.warn('[MUI] xa', e); }
      return r;
    };
    return true;
  }
  // <<< MUI-TRAVEL-END

  function questTick() {
    if (!Q.on || !ready()) return;
    aiBeat('quest');
    const me = G.me, st = me.story;
    if (me.dead) { aiWait('quest'); setChip('Đang chờ hồi sinh…', true); return; }
    if (!st || st.done) { aiWait('quest'); setChip('Đã hoàn thành toàn bộ cốt truyện'); setTimeout(() => setQuest(false), 2500); return; }
    if (window.Story && Story.open) {   // đang có hội thoại cốt truyện
      aiWait('quest');
      if (C.q.skip) {
        const sk = $('sd-skip');
        if (sk) { try { sk.click(); } catch (e) {} }
        else document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }));
      }
      setChip('Đang xem hội thoại…'); return;
    }
    const step = storyStep() || {}, type = st.type || step.type, now = performance.now();
    const key = `${st.ch}.${st.st}`;
    if (key !== Q.lastKey) { Q.lastKey = key; G.npcGoal = null; G.moveTo = null; Q.roamAt = 0; Q.lastNpc = null; Q.npcAt = 0; }
    const prog = st.need > 1 ? ` (${st.have || 0}/${st.need})` : '';
    const label = (st.text || step.text || '').replace(/\{name\}/g, me.name).replace(/\{cls\}/g, '') + prog;
    // sai bản đồ: đi tới cổng dịch chuyển
    if (st.map && G.map && st.map !== G.map.id && type !== 'level') {
      ensureAuto(false);
      const to = st.next || st.map;
      if (goPortal(to)) { setChip(`${label} · đang tới ${st.mapName || 'bản đồ nhiệm vụ'}`); return; }
      const r = travelTo(st.map, label);   // cổng kế bên không tới được -> tìm đường nhiều chặng / Xa Phu
      if (r === 'walk' || r === 'tp') setChip(`${label} · ${r === 'tp' ? '🐎 Xa Phu tới ' : 'đang tới '}${st.mapName || MAPNAME(st.map)}`);
      else setChip(`${label} · không tìm thấy đường tới ${st.mapName || MAPNAME(st.map)}, hãy dùng Xa Phu / Phù về thành`, true);
      return;
    }
    if (type === 'talk' || st.npc) {
      ensureAuto(false);
      const n = (G.map.npcs || []).find(x => x.id === st.npc);
      if (!n) { setChip(`${label} · NPC không ở bản đồ này`, true); return; }
      const p = npcPos(n), gp = { x: p.x, y: p.y + 40 };
      G.npcGoal = n;
      if (near(p, G.self) < TILE * 2) {
        G.moveTo = null;
        if (now - Q.lastTalk > 3000) { Q.lastTalk = now; Q.talkAt = Date.now(); emit('npc', { id: n.id }); }
      } else if (!G.moveTo || near(G.moveTo, gp) > 60) {
        G.moveTo = gp; Q.npcAt = now; Q.stuckAt = 0;      // game tự xoá moveTo khi còn ~128px: đặt lại mỗi nhịp
      } else if (Math.hypot(G.self.x - (Q.px || 0), G.self.y - (Q.py || 0)) < 6) {
        if (!Q.stuckAt) Q.stuckAt = now;
        else if (now - Q.stuckAt > 1600) {                // kẹt vật cản: nhích ngang để đi vòng
          Q.stuckAt = 0;
          G.moveTo = { x: gp.x + (Math.random() * 96 - 48), y: gp.y + (Math.random() * 64 - 32) };
        }
      } else Q.stuckAt = 0;
      Q.px = G.self.x; Q.py = G.self.y;
      setChip(`${label} · đang tới gặp NPC`); return;
    }
    if (type === 'kill' || type === 'elite') {
      const mons = step.mons || [];
      let best = null, bd = 1e9;
      if (st.eid && G.monsters.get(st.eid)) best = G.monsters.get(st.eid);
      else for (const e of G.monsters.values()) {
        if (e.dead || (mons.length && !mons.includes(e.type)) || (type === 'elite' && !mons.length && !e.elite && !e.boss)) continue;
        const d = near(e, G.self); if (d < bd) { bd = d; best = e; }
      }
      if (best) {
        ensureAuto(true, best);
        const cur = G.target && G.monsters.get(G.target);
        if (!cur || (mons.length && !mons.includes(cur.type))) G.target = best.id;
        setChip(`${label} · đang đánh`);
      } else if (C.q.roam) {
        ensureAuto(false); roam(); setChip(`${label} · đang tìm quái`);
      } else { ensureAuto(true); setChip(`${label} · chờ quái xuất hiện`); }
      return;
    }
    if (type === 'level') {
      if (G.map.safe) {
        ensureAuto(false);
        const p = trainingPortal();
        if (p) { goPortal(p.to); setChip(`${label} · đang ra bãi luyện công ${MAPNAME(p.to)}`); }
        else {
          const id = bestTraining();   // bãi luyện công ở BẤT KỲ map nào (đi nhiều chặng / Xa Phu)
          if (id) { const r = travelTo(id, label); setChip(`${label} · ${r === 'tp' ? '🐎 Xa Phu tới ' : 'đang ra '}bãi luyện công ${MAPNAME(id)}`); }
          else setChip(`${label} · hãy ra bãi luyện công rồi bật lại`, true);
        }
      } else { ensureAuto(true); setChip(`${label} · đang luyện cấp`); }
      return;
    }
    if (type === 'map') { setChip(`${label}`); return; }
    if (type === 'buy' || type === 'equip' || type === 'skill') {   // bước cần mở bảng: không tự bật tự đánh
      setChip(`${label} · bước này cần bạn bấm trong bảng Nhiệm vụ/Túi đồ`, true);
      return;
    }
    ensureAuto(false);
    setChip(`${label} · bước này cần tự làm (mở bảng Nhiệm vụ để xem hướng dẫn)`, true);
  }
  // NPC mở bảng ngay sau khi tự nói chuyện: đóng lại cho đỡ vướng
  function afterNpcOpen() {
    if (Q.on && C.q.close && Date.now() - Q.talkAt < 2500) setTimeout(() => { try { if (UI.panelName() === 'npc') UI.closePanel(); } catch (e) {} }, 600);
  }
  function dailyTick() {                     // xin danh sách + nhận thưởng (5 s/lần)
    if (!(C.q.daily || C.q.solve) || !ready()) return;
    const now = Date.now();
    if (now - Q.lastDaily > 90e3) { Q.lastDaily = now; try { emit('daily'); } catch (e) {} }
    const d = G.daily; if (!d || !d.list) return;
    if (now - Q.claimAt < 2000) return;      // máy chủ chậm: đừng bấm nhận 2 lần
    const q = d.list.find(x => x.done && !x.claimed);
    if (q) { Q.claimAt = now; try { emit('dailyClaim', { id: q.id }); } catch (e) {} return; }
    if (!d.bonusClaimed && d.list.length && d.list.every(x => x.claimed)) { Q.claimAt = now; try { emit('dailyClaim', { id: 'bonus' }); } catch (e) {} }
  }


  // ======================================================================
  //  PHÓ BẢN TỰ ĐỘNG + TỰ LÀM NHIỆM VỤ HẰNG NGÀY
  //  API game: emit('dungeon',{op:'list'|'enter'|'leave', id}) -> s.on('dungeonList'|'dungeon')
  //            emit('npc',{id:'pho_ban'}) để máy chủ trả action 'dungeon'
  //            G.daily = {list:[{id,text,progress,n,done,claimed}], bonus, bonusClaimed}
  // ======================================================================
  // >>> MUI-QUEST-BEGIN
  const PB = { on: false, at: 0, list: null, listAt: 0, st: null, npcAt: 0, mapAt: 0, mapId: '',
    tried: {}, bad: {}, seen: {} };
  const NPCMAP = (() => { try { return JSON.parse(localStorage.getItem('mui_npcmap') || '{}') || {}; } catch (e) { return {}; } })();
  const npcSave = () => { try { localStorage.setItem('mui_npcmap', JSON.stringify(NPCMAP)); } catch (e) {} };
  const PB_TOWNS = ['tuong_duong', 'thanh_do', 'cho_phien', 'lan_chau', 'long_mon'];
  const PB_NPC = 'pho_ban';
  PB.on = !!C.pb.on;                      // khôi phục trạng thái đã lưu
  const D = { on: !!C.q.solve };          // ô riêng: TỰ LÀM nhiệm vụ hằng ngày
  function setDaily(on) {
    on = !!on;
    if (D.on === on && !!C.q.solve === on) return;
    D.on = on; C.q.solve = on; save();
    if (!on) { Q.autoByUs = false; G.npcGoal = null; G.moveTo = null;
      try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
      if (!Q.on && !PB.on) setChip('');
      toast('Đã dừng tự làm nhiệm vụ hằng ngày');
    } else {
      Q.claimAt = 0; Q.trainAt = 0; Q.lastDaily = 0;
      if (!G.daily) { try { emit('daily'); } catch (e) {} }
      toast('Bắt đầu tự làm nhiệm vụ hằng ngày');
    }
    refreshHelper();
  }
  function npcLearn() {                       // nhớ NPC nào ở bản đồ nào (để lần sau đi thẳng)
    if (!G.map || !G.map.npcs) return;
    let ch = false;
    for (const n of G.map.npcs) if (n && n.id && NPCMAP[n.id] !== G.map.id) { NPCMAP[n.id] = G.map.id; ch = true; }
    if (ch) npcSave();
  }
  function setPb(on) {
    if (PB.on === on) return;
    PB.on = on;
    C.pb.on = on; save();
    PB.list = null; PB.listAt = 0; PB.at = 0; PB.mapAt = 0; PB.seen = {};
    if (!on) {
      PB.st = null; PB.cur = null; PB.watch = ''; PB.idleAt = 0;
      if (PB.autoByUs) G.setAuto(false);
      PB.autoByUs = false;
      G.moveTo = null; G.npcGoal = null;          // buông đường đi đang giữ
      try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
      if (!Q.on) setChip('');
      toast('Đã dừng tự đánh phó bản');
    } else {
      PB.tried = {};
      toast('Bắt đầu tự đánh phó bản');
    }
    refreshHelper();
  }
  // >>> MUI-STOP-BEGIN
  let chipTok = 0;
  function stopAll() {                        // nút Dừng: tắt hết mọi thứ Trợ thủ đang tự làm
    try { setQuest(false); } catch (e) {}
    try { setPb(false); } catch (e) {}
    try { stopEnh(); } catch (e) {}
    try { stopMount(); } catch (e) {}
    try { setDaily(false); } catch (e) {}
    try { setSect(false); } catch (e) {}
    try { setEc(false); } catch (e) {}
    try { aiReset(); } catch (e) {}
    C.q.solve = false; D.on = false;          // tự LÀM nhiệm vụ ngày (chạy ngầm 300 ms)
    C.q.daily = false;                        // tự nhận thưởng ngày (chạy ngầm 5 s)
    C.rv.on = false; RV.wasAuto = false;      // tự hồi sinh
    try { clearReviveTimer(); } catch (e) {}
    Q.on = false; PB.on = false;
    if (Q.autoByUs || PB.autoByUs) { if (G.auto) G.setAuto(false); }
    Q.autoByUs = false; PB.autoByUs = false;
    G.moveTo = null; G.npcGoal = null;
    try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
    save();
    try { refreshHelper(); } catch (e) {}
    toast('Đã dừng toàn bộ tự động');
    const tok = ++chipTok;
    setChip('Đã dừng toàn bộ — vào bảng Trợ thủ để bật lại', true);
    setTimeout(() => { if (chipTok === tok) setChip(''); }, 4000);
  }
  // <<< MUI-STOP-END


  // >>> MUI-FIGHT-BEGIN
  // CHIẾN ĐẤU TỰ CHỌN MỤC TIÊU — dùng đúng chiêu của nhân vật, KHÔNG bật 'Tự động đánh' của game.
  //   Chọn quái theo yêu cầu nhiệm vụ (cur.mons/mon:... hoặc tên quái xuất hiện trong nội dung)
  //   -> đi tới bằng cơ chế chase của game -> tự bấm chiêu mạnh nhất đang sẵn sàng & đủ tầm (G.useSkill).
  const FG = { id: null, castAt: -1e9, idx: -1 };   // -1e9: bấm được ngay từ lần đầu
  const MHF_ORDER = [3, 4, 5, 2, 6, 1, 0];      // ưu tiên chiêu mạnh; 0 = đánh thường
  function mhSkillList() { try { return G.mySkills() || []; } catch (e) { return []; } }
  function mhTypes(q) {
    const cur = q || {}, out = [], names = [];
    const add = v => { const s = String(v == null ? '' : v).trim().replace(/^mon:/, ''); if (s && out.indexOf(s) < 0) out.push(s); };
    (cur.mons || []).forEach(add);
    (cur.monsters || []).forEach(add);
    [cur.sp, cur.sps, cur.req].forEach(a => Array.isArray(a) && a.forEach(add));
    const text = String(cur.text || '') + ' ' + String(cur.desc || '') + ' ' + String(cur.title || '');
    const low = text.toLowerCase();
    const data = (G.data && G.data.monsters) || {};
    for (const id in data) {
      const m = data[id]; if (!m || !m.name) continue;
      const nm = String(m.name).toLowerCase();
      if (nm.length >= 2 && low.indexOf(nm) >= 0) { add(id); names.push(m.name); }
    }
    return { types: out, names };
  }
  function mhOk(e, types, eliteOnly) {
    if (!e || e.dead || e.event) return false;
    if (eliteOnly && !e.elite && !e.boss) return false;
    if (!types || !types.length) return true;
    return types.indexOf(e.type) >= 0;
  }
  function mhPick(types, eliteOnly) {
    let best = null, bd = Infinity;
    const list = (G.monsters && G.monsters.values) ? G.monsters.values() : [];
    for (const e of list) {
      if (!mhOk(e, types, eliteOnly)) continue;
      const d = Math.hypot(e.x - G.self.x, e.y - G.self.y);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }
  function mhName(e) { const m = G.data && G.data.monsters && G.data.monsters[e && e.type]; return (m && m.name) || (e && e.type) || 'quái'; }
  function mhSkillFor(dist) {                   // >=0: bấm được ngay; -2: có chiêu nhưng chưa tới tầm; -1: không có chiêu đánh
    const list = mhSkillList();
    let castable = -1;
    for (const i of MHF_ORDER) {
      const sk = list[i];
      if (!sk || !sk.learned || sk.type === 'passive' || sk.type === 'buff' || sk.type === 'heal') continue;
      if (G.me && G.me.level < (sk.lv || 1)) continue;
      if (sk.mp && G.me && G.me.mp < sk.mp) continue;
      let ok = true; try { if (G.skillReady) ok = G.skillReady(i); } catch (e) { ok = true; }
      if (!ok) continue;
      castable = -2;
      const rng = (sk.range || (G.myRange ? G.myRange() : 120)) * 0.85;
      if (dist <= rng + 10) return i;
    }
    return castable;
  }
  function mhFight(q, opt) {
    opt = opt || {};
    if (!G || !G.me || G.me.dead || !G.map || !G.self) return { st: 'idle' };
    if (G.map.safe) return { st: 'safe' };
    const want = mhTypes(q), eliteOnly = !!opt.elite;
    let t = FG.id && G.monsters ? G.monsters.get(FG.id) : null;
    if (!mhOk(t, want.types, eliteOnly)) t = null;
    if (!t) t = mhPick(want.types, eliteOnly);
    if (!t) { FG.id = null; G.target = null; G.chase = null; return { st: 'none', types: want.types, names: want.names }; }
    FG.id = t.id; G.target = t.id;
    const dist = Math.hypot(t.x - G.self.x, t.y - G.self.y);
    const idx = mhSkillFor(dist);
    const name = mhName(t), id = t.id;
    if (idx >= 0) {
      G.chase = null; G.moveTo = null;
      const now = performance.now();
      if (now - FG.castAt >= 100) { FG.castAt = now; FG.idx = idx; try { G.useSkill(idx); } catch (e) {} }
      return { st: 'cast', id, name, idx, dist, types: want.types };
    }
    if (idx === -2) {                           // có chiêu nhưng còn xa: để game dẫn đường tới sát
      if (!G.chase || G.chase.id !== id) G.chase = { id, skill: 0 };
      return { st: 'approach', id, name, dist, types: want.types };
    }
    return { st: 'noskill', id, name, dist, types: want.types };
  }
  function mhStop() { FG.id = null; FG.idx = -1; try { G.chase = null; } catch (e) {} }
  // <<< MUI-FIGHT-END
  // >>> MUI-AI-BEGIN
  // BỘ NÃO AI DÙNG CHUNG cho mọi auto: theo dõi tiến triển từng module, phát hiện "đứng yên"
  // và tự chữa theo thang: nhích thử -> tính lại đường -> tránh bản đồ 45 s -> nghỉ 30 s.
  const CHIP = { text: '', at: 0, warn: false };
  const AIM = {};                    // trạng thái từng module
  const AINOGO = {};                 // bản đồ AI tạm tránh: id -> hết hạn
  const AIPOS = { x: 0, y: 0, at: 0, tries: 0, chaseAt: 0 };
  function aiCfg() { C.ai = C.ai || { on: true }; return C.ai; }
  function aiOn() { return aiCfg().on !== false; }
  function aiState(n) { return AIM[n] || (AIM[n] = { sig: '', since: 0, tries: 0, fixAt: 0, pauseUntil: 0, graceUntil: 0, note: '', px: -1, py: -1, map: '' }); }
  function aiSig() {                 // dấu hiệu "có gì đó thay đổi": bản đồ + ô 48px + chip (bỏ số, bỏ chip của chính AI)
    const s = G.self || {}, m = G.map || {};
    const raw = /^🧠 AI/.test(CHIP.text || '') ? '' : String(CHIP.text || '').replace(/\d+/g, '#').slice(0, 60);
    return (m.id || '') + '|' + Math.floor((s.x || 0) / 48) + ',' + Math.floor((s.y || 0) / 48) + '|' + raw;
  }
  function aiBeat(name) {            // gọi ở mỗi nhịp của module đang bật
    if (!aiOn()) return;
    const st = aiState(name), now = Date.now(), s = G.self || {}, m = G.map || {};
    const px = Math.floor((s.x || 0) / 48), py = Math.floor((s.y || 0) / 48), mid = (m.id || '');
    if (st.px !== px || st.py !== py || st.map !== mid) {          // đổi ô/bản đồ = tiến triển thật -> xoá đếm lỗi
      st.px = px; st.py = py; st.map = mid; st.since = now; st.tries = 0; st.note = '';
    }
    const sig = aiSig();
    if (sig !== st.sig) { st.sig = sig; st.since = now; }          // đổi trạng thái: cho thêm thời gian (nhưng vẫn leo thang)
    if (!st.since) st.since = now;
    if (G.target || (G.chase && G.chase.id)) st.since = now;      // đang giao chiến = có tiến triển
    if (now < st.pauseUntil || now < st.graceUntil) return;
    if (now - st.since > 9000) aiHeal(name, now);
  }
  function aiWait(name) { const st = aiState(name), now = Date.now(); st.since = now; st.graceUntil = now + 8000; }   // chờ hợp lệ (chết, hội thoại, chờ máy chủ)
  function aiNudge() {
    const s = G.self, m = G.map; if (!s || !m) return false;
    const tx = Math.floor(s.x / TILE), ty = Math.floor(s.y / TILE);
    const ds = [[2, 0], [-2, 0], [0, 2], [0, -2], [2, 2], [-2, -2], [2, -2], [-2, 2]].sort(() => Math.random() - 0.5);
    for (const d of ds) {
      if (typeof freeTile === 'function' && !freeTile(tx + d[0], ty + d[1])) continue;
      G.moveTo = { x: (tx + d[0] + 0.5) * TILE, y: (ty + d[1] + 0.5) * TILE };
      G.npcGoal = null;
      return true;
    }
    return false;
  }
  function aiRepath() {
    G.moveTo = null; G.npcGoal = null;
    try { if (G.chase) G.chase = null; } catch (e) {}
    try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
  }
  function aiHeal(name, now) {       // thang chữa kẹt
    const st = aiState(name);
    if (now - st.fixAt < 2500) return;
    st.fixAt = now; st.tries++;
    const t = st.tries;
    if (t === 1) { st.note = 'nhích thử'; aiNudge(); setChip('🧠 AI: ' + name + ' đứng yên — nhích thử', true); }
    else if (t === 2) { st.note = 'tính lại đường'; aiRepath(); setChip('🧠 AI: ' + name + ' — xoá đường cũ, tính lại', true); }
    else if (t === 3) { st.note = 'tránh bản đồ'; if (G.map) AINOGO[G.map.id] = now + 45000; aiRepath(); setChip('🧠 AI: bỏ ' + MAPNAME(G.map.id) + ' 45 giây, đi đường khác', true); }
    else { st.tries = 0; st.pauseUntil = now + 30000; st.since = now; st.note = 'thôi can thiệp 30 giây'; aiRepath(); setChip('🧠 AI: ' + name + ' kẹt — thôi can thiệp 30 giây rồi thử lại', true); try { toast('AI thôi can thiệp 30 giây với ' + name + ' (auto vẫn tự chạy)'); } catch (e) {} }
  }
  function aiBlocked(id) { return (AINOGO[id] || 0) > Date.now(); }
  function aiOwner() {               // chỉ MỘT auto được điều khiển nhân vật: nhiệm vụ > phó bản > áp tiêu > môn phái > hằng ngày
    if (Q.on) return 'quest';
    if (PB.on) return 'pb';
    if (EC.on) return 'escort';
    if (SO.on) return 'sect';
    if (C.q && C.q.solve) return 'daily';
    return '';
  }
  const AI_LABEL = { quest: 'Tự làm nhiệm vụ', pb: 'Tự đánh phó bản', escort: 'Áp tiêu', sect: 'Nhiệm vụ môn phái', daily: 'Nhiệm vụ hằng ngày' };
  function aiReset() { for (const k in AIM) { const st = AIM[k]; st.tries = 0; st.pauseUntil = 0; st.graceUntil = 0; st.since = 0; st.fixAt = 0; st.note = ''; } AIPOS.at = 0; AIPOS.tries = 0; AIPOS.chaseAt = 0; }
  function aiTick() {                // watchdog toàn cục: auto đặt đường mà không nhúc nhích
    if (!aiOn() || !ready()) return;
    const now = Date.now(), s = G.self || {};
    for (const id in AINOGO) if (AINOGO[id] <= now) delete AINOGO[id];
    if (!(Q.on || PB.on || SO.on || EC.on || (C.q && C.q.solve))) { AIPOS.at = 0; AIPOS.tries = 0; AIPOS.chaseAt = 0; return; }   // không có auto nào bật -> không can thiệp
    if (G.moveTo && !G.target) {
      if (!AIPOS.at) { AIPOS.x = s.x; AIPOS.y = s.y; AIPOS.at = now; }
      else if (Math.hypot(s.x - AIPOS.x, s.y - AIPOS.y) > 6) { AIPOS.x = s.x; AIPOS.y = s.y; AIPOS.at = now; AIPOS.tries = 0; }
      else if (now - AIPOS.at > 2600) {
        AIPOS.at = now; AIPOS.tries++;
        if (AIPOS.tries <= 3) aiNudge();
        else if (AIPOS.tries === 4) aiRepath();
        else { if (G.map) AINOGO[G.map.id] = now + 45000; AIPOS.tries = 0; }
      }
    } else { AIPOS.at = 0; AIPOS.tries = 0; }
    if (G.chase && G.chase.id) {     // chase của game cũng có thể kẹt
      if (!AIPOS.chaseAt) AIPOS.chaseAt = now;
      else if (now - AIPOS.chaseAt > 6000) { AIPOS.chaseAt = 0; try { G.chase = null; } catch (e) {} aiNudge(); }
    } else AIPOS.chaseAt = 0;
  }
  function aiReport() {
    if (!aiOn()) return 'AI đang tắt — các auto chạy kiểu cũ, kẹt thì đứng.';
    const names = { quest: 'Nhiệm vụ', pb: 'Phó bản', daily: 'Hằng ngày', sect: 'Môn phái', escort: 'Áp tiêu' };
    const now = Date.now(), out = [];
    for (const k in names) {
      const st = AIM[k]; if (!st || !st.since) continue;
      const wait = now < st.pauseUntil, idle = Math.round((now - st.since) / 1000);
      out.push(names[k] + (wait ? ' · nhường 30s' : idle > 4 ? ' · kẹt ' + idle + 's' + (st.note ? ' (' + st.note + ')' : '') : ' · ổn'));
    }
    return out.length ? out.join(' · ') : 'Chưa có auto nào chạy.';
  }
  // <<< MUI-AI-END

  // >>> MUI-SECT-BEGIN
  // NHIỆM VỤ MÔN PHÁI — máy chủ: emit('sect',{op:'view'|'accept'|'submit'|'abandon'}) -> s.on('sect', view)
  //   view = { member, sectName, mySect, rankName, pts, total, n, max, cur:{ text, need, have, type, map, npc? } }
  //   G.me.sect = { n, max, cur:{...}, map }  (ô theo dõi của game cũng đọc đúng chỗ này)
  const SO = { on: false, at: 0, view: null, viewAt: 0, npcAt: 0, mapId: '', home: null,
    qkey: '', kind: '', tries: 0, lastTry: 0, tryAt: 0, talk: 0, lastTalk: 0,
    exIdx: 0, exAt: 0, bad: {}, npcOk: false, noNpcAt: 0, none: 0, noneMap: '', mapAt: 0 };
  const SNPC = (() => { try { return JSON.parse(localStorage.getItem('mui_sectnpc') || '{}') || {}; } catch (e) { return {}; } })();
  const sSave = () => { try { localStorage.setItem('mui_sectnpc', JSON.stringify(SNPC)); } catch (e) {} };
  const SECT_NPC_RX = /trưởng\s*môn|chưởng\s*môn|bang\s*chủ|môn\s*chủ|tông\s*chủ|giáo\s*chủ|minh\s*chủ|sư\s*phụ|chủ\s*nhân|truong\s*mon/i;
  function setSect(on) {
    on = !!on;
    C.sc = C.sc || {};
    if (SO.on === on) { C.sc.on = on; return; }
    SO.on = on; C.sc.on = on; save();
    SO.view = null; SO.viewAt = 0; SO.npcAt = 0; SO.tries = 0; SO.tryAt = 0; SO.kind = ''; SO.talk = 0; SO.lastTalk = 0;
    if (!on) {
      mhStop();
      G.moveTo = null; G.npcGoal = null;
      try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
      if (!Q.on && !PB.on) setChip('');
      toast('Đã dừng tự làm nhiệm vụ môn phái');
    } else {
      SO.mapId = ''; SO.home = null;
      toast('Bắt đầu tự làm nhiệm vụ môn phái');
    }
    refreshHelper();
  }
  function sectName() {
    const S = (G.me && G.me.sect) || {};
    return S.name || S.sectName || (SO.view && (SO.view.sectName || SO.view.mySect)) || '';
  }
  function sectMaps() {                      // 9 bản đồ môn phái, lấy từ gamedata (maps[id].sect)
    const ms = (G.data && G.data.maps) || {};
    const out = [];
    for (const id in ms) if (ms[id] && ms[id].sect && !SO.bad[id]) out.push(id);
    return out;
  }
  function sectHome() {                      // bản đồ môn phái của mình
    if (((G.map && G.map.npcs) || []).some(x => x.action === 'sect')) return G.map.id;
    const S = (G.me && G.me.sect) || {};
    const cand = S.map || SO.home || (SNPC.ok ? SNPC.map : '');
    if (cand && G.data && G.data.maps && G.data.maps[cand]) return cand;
    return null;
  }
  function sectExplore(now) {                // AL: chưa biết môn phái ở đâu -> tự đi thử từng bản đồ môn phái
    if (now - SO.exAt < 3500) return;
    SO.exAt = now;
    const all = sectMaps();
    if (!all.length) { SO.bad = {}; SO.exIdx = 0; setChip('🏮 Đã thử hết bản đồ môn phái mà không thấy Trưởng Môn của bạn — thử lại từ đầu (đúng môn phái chưa?)', true); return; }
    const pick = all[SO.exIdx % all.length];
    SO.exIdx++;
    if (pick === G.map.id) { SO.bad[pick] = 1; setChip('🏮 ' + MAPNAME(pick) + ' không có Trưởng Môn của bạn — sang bản đồ môn phái khác'); return; }
    let r = 'blocked';
    try { r = travelTo(pick, 'môn phái'); } catch (e) {}
    setChip('🏮 AL tìm Trưởng Môn · ' + (SO.exIdx) + '/' + all.length + '' + (r === 'tp' ? ' 🐎 ' : ' ') + 'tới ' + MAPNAME(pick));
  }
  function mapForTypes(types) {               // bản đồ có quái nhiệm vụ cần (gamedata maps[id].mons)
    if (!types || !types.length) return '';
    const ms = (G.data && G.data.maps) || {};
    const lv = Number((G.me && G.me.level) || 1);
    let best = '', bs = 1e9;
    for (const id in ms) {
      const m = ms[id];
      if (!m || m.safe || !m.mons || !m.mons.length) continue;
      if (!m.mons.some(t => types.indexOf(t) >= 0)) continue;
      const sc = Math.abs(Number(m.lv) || 1 - lv);
      if (sc < bs) { bs = sc; best = id; }
    }
    return best;
  }
  function sectNpc() {                        // NPC nhận/trả nhiệm vụ môn phái
    const list = (G.map && G.map.npcs) || [];
    // 'sect' là action máy chủ gắn cho NPC môn phái (Bang Chủ / Trưởng Môn / Chưởng Môn tuỳ phái)
    const n = list.find(x => x.action === 'sect')
      || (SNPC.id ? list.find(x => x.id === SNPC.id) : null)
      || list.find(x => SECT_NPC_RX.test(x.name || ''));
    if (n && (SNPC.id !== n.id || SNPC.map !== G.map.id)) { SNPC.id = n.id; SNPC.map = G.map.id; sSave(); }
    return n || null;
  }
  function npcByName(name) {                  // tìm NPC theo tên (cho nhiệm vụ đưa thư)
    const key = String(name || '').toLowerCase().trim();
    if (!key) return null;
    const list = (G.map && G.map.npcs) || [];
    return list.find(x => String(x.name || '').toLowerCase().trim() === key)
      || list.find(x => { const n2 = String(x.name || '').toLowerCase().trim(); return n2.length >= 3 && (n2.indexOf(key) >= 0 || key.indexOf(n2) >= 0); })
      || null;
  }
  function sectQuest(q) {                     // đích của nhiệm vụ: id/tên NPC + bản đồ
    const o = { id: (q && q.npc) || '', name: '', mapId: (q && q.map) || '' };
    const txt = String((q && q.text) || '');
    const m = txt.match(/(?:tới|cho)\s+(.+?)\s*(?:\(([^)]+)\))?\s*$/i);
    if (m) {
      o.name = String(m[1] || '').trim();
      const mp = String(m[2] || '').trim().toLowerCase();
      if (!o.mapId && mp) {
        const maps = (G.data && G.data.maps) || {};
        for (const id in maps) if (String(maps[id].name || '').toLowerCase().trim() === mp) { o.mapId = id; break; }
      }
    }
    return o;
  }
  function hookSect() {                      // học NPC Trưởng Môn + nhận trạng thái nhiệm vụ
    if (!window.G || !G.socket || G.socket.__mhSect) return;
    G.socket.__mhSect = 1;
    try {
      G.socket.on('npc', d => {
        if (!d || d.action !== 'sect' || !G.map) return;
        SNPC.id = d.id; SNPC.map = G.map.id; sSave();
      });
    } catch (e) {}
    try {
      G.socket.on('sect', d => {
        if (!SO.on || !d) return;
        SO.view = d; SO.viewAt = Date.now(); SO.talk = 0;
        if (d.member === false) {
          SO.view = null;
          if (G.map) { SO.bad[G.map.id] = 1; SO.exAt = 0; }      // không phải phái mình -> AL sang bản đồ môn phái khác
          SNPC.ok = false; delete SNPC.id; delete SNPC.map; sSave();
          toast('Đây là môn phái khác (' + (d.sectName || '?') + ') — AL đi tìm Trưởng Môn của bạn', 'info');
          setChip('🏮 ' + (d.sectName || 'Môn phái khác') + ' không phải phái của bạn — AL đang đi tìm chỗ khác');
        } else if (d.member) {
          SNPC.ok = true; if (G.map) { SNPC.map = G.map.id; delete SO.bad[G.map.id]; }
        }
      });
    } catch (e) {}
  }
  function sectKind(q) {
    const ty = String((q && q.type) || '').toLowerCase();
    if (ty) {
      if (/dungeon|pho_?ban/.test(ty)) return 'dungeon';
      if (/elite|tinh/.test(ty)) return 'elite';
      if (/deliver|letter|mail|thu|giao/.test(ty)) return 'deliver';
      if (/kill|hunt|mon|grind|diet/.test(ty)) return 'kill';
    }
    const t = String((q && q.text) || '').toLowerCase();
    if (/phó bản|pho ban/.test(t)) return 'dungeon';
    if (/tinh anh/.test(t)) return 'elite';
    if (/thư/.test(t)) return 'deliver';
    if (/diệt|hạ|giết|quái/.test(t)) return 'kill';
    return q && q.map ? 'kill' : '';
  }
  function closeSectPanel() { setTimeout(() => { try { if (UI.panelName() === 'sect') UI.closePanel(); } catch (e) {} }, 500); }
  function sectWork(S, q, now) {
    const key = String(q.text || '') + '|' + String(q.need || 0);
    if (SO.qkey !== key) { SO.qkey = key; SO.kind = sectKind(q); SO.tryAt = 0; }
    const k = SO.kind;
    const label = '🏮 ' + (q.text || 'Nhiệm vụ môn phái') + (Number(q.need || 1) > 1 ? ` (${q.have}/${q.need})` : '');
    if (k === 'dungeon') { setChip(label + ' · phó bản — bật ô "Phó bản tự động" để tự vào', true); return; }
    const dst = k === 'deliver' ? sectQuest(q) : null;
    const map = q.map || (dst && dst.mapId) || null;
    if (map && G.map.id !== map) {
      if (!SO.tryAt || now - SO.tryAt > 2500) {
        SO.tryAt = now;
        let r = 'blocked'; try { r = travelTo(map, 'môn phái'); } catch (e) {}
        setChip(label + ' · ' + (r === 'tp' ? '🐎 ' : '') + 'đang tới ' + MAPNAME(map));
      }
      return;
    }
    if (k === 'deliver') {                    // đưa thư: tới đúng người nhận (id máy chủ gửi, hoặc tên trong nội dung)
      const t = (dst && dst.id ? (G.map.npcs || []).find(x => x.id === dst.id) : null)
        || (dst && dst.name ? npcByName(dst.name) : null);
      if (t) {
        const p = npcPos(t), d = near(p, G.self);
        mhStop();
        if (d < TILE * 2) {
          G.moveTo = null; G.npcGoal = null;
          if (now - SO.npcAt > 4000) { SO.npcAt = now; try { emit('npc', { id: t.id }); } catch (e) {} }
          setChip(label + ' · giao thư');
          return;
        }
        G.npcGoal = t;
        const gp = { x: p.x, y: p.y + 40 };
        if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
        setChip(label + ' · tới người nhận thư');
        return;
      }
      setChip(label + ' · đã tới ' + MAPNAME(G.map.id) + (dst && dst.name ? ' — chưa thấy ' + dst.name : ' — chưa rõ người nhận thư'), true);
      return;
    }
    const f = mhFight(q, { elite: k === 'elite' });   // tự chọn quái + tự bấm chiêu, KHÔNG bật Tự động đánh
    if (f.st === 'cast') { setChip(label + ' · ' + (f.idx === 0 ? 'đánh thường' : 'dùng chiêu') + ' ' + f.name); return; }
    if (f.st === 'approach') { setChip(label + ' · đang tới ' + f.name); return; }
    if (f.st === 'safe') { setChip(label + ' · bản đồ an toàn, không đánh được — cần ra bãi quái', true); return; }
    if (f.st === 'noskill') { setChip(label + ' · chưa có chiêu đánh nào dùng được (kiểm tra MP/cấp)', true); return; }
    SO.none = (SO.noneMap === G.map.id ? SO.none : 0) + 1; SO.noneMap = G.map.id;
    const need = mhTypes(q).types;
    const mp = SO.none >= 3 ? mapForTypes(need) : '';
    if (mp && mp !== G.map.id) {                 // bản đồ này không có quái đó -> AL tự sang bản đồ có
      SO.none = 0;
      try { travelTo(mp, 'môn phái'); } catch (e) {}
      setChip(label + ' · ' + MAPNAME(G.map.id) + ' không có quái này — AL sang ' + MAPNAME(mp));
      return;
    }
    try { roam(); } catch (e) {}
    setChip(label + ' · chưa thấy ' + ((f.names && f.names[0]) || 'quái nhiệm vụ') + ' — đang tìm quanh ' + MAPNAME(G.map.id));
  }
  function sectTick() {
    if (!SO.on || !ready()) return;
    aiBeat('sect');
    const now = Date.now();
    if (now - SO.at < 700) return;
    SO.at = now;
    if (G.me.dead) { aiWait('sect'); setChip('🏮 Đang chờ hồi sinh…', true); return; }
    if (EC.on) { aiWait('sect'); setChip('🏮 Nhường đường cho áp tiêu'); return; }
    if (Q.on || PB.on) { aiWait('sect'); setChip('🏮 Nhường đường cho ' + (Q.on ? 'Tự làm nhiệm vụ' : 'Tự đánh phó bản')); return; }
    const S = G.me.sect;
    if (!S) { setChip('🏮 Nhân vật chưa có môn phái', true); return; }
    if (G.map.id !== SO.mapId) { SO.mapId = G.map.id; SO.tryAt = 0; SO.tries = 0; SO.mapAt = now; SO.none = 0; SO.noneMap = ''; }
    const q = S.cur || null;
    const done = q && Number(q.have || 0) >= Number(q.need || 1);
    if (q && !done) return sectWork(S, q, now);
    if (!q && Number(S.n || 0) >= Number(S.max || 0)) { setChip(`🏮 Hôm nay đã làm đủ ${S.n}/${S.max} nhiệm vụ môn phái`); return; }
    const home = sectHome();
    if (!home) { sectExplore(now); return; }
    if (G.map.id !== home) {                  // về môn phái (Xa Phu miễn phí)
      if (!SO.tryAt || now - SO.tryAt > 2500) {
        SO.tryAt = now;
        let r = 'blocked'; try { r = travelTo(home, 'môn phái'); } catch (e) {}
        setChip(r === 'tp' ? '🏮 🐎 về ' + MAPNAME(home) : '🏮 đang về ' + MAPNAME(home));
      }
      return;
    }
    const n = sectNpc();
    if (!n) {                                   // map môn phái mà không có NPC: đợi 3 s rồi AL đi map khác
      if (!SO.noNpcAt) SO.noNpcAt = now;
      if (now - SO.noNpcAt > 3000) { SO.noNpcAt = 0; SO.bad[G.map.id] = 1; sectExplore(now); return; }
      setChip('🏮 Đang vào ' + MAPNAME(G.map.id) + ' — tìm Trưởng Môn…');
      return;
    }
    SO.noNpcAt = 0;
    const p = npcPos(n), d = near(p, G.self);
    if (d > TILE * 2.2) {
      mhStop();
      G.npcGoal = n;
      const gp = { x: p.x, y: p.y + 40 };
      if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
      setChip('🏮 đang tới Trưởng Môn' + (sectName() ? ' ' + sectName() : ''));
      return;
    }
    mhStop();
    G.moveTo = null; G.npcGoal = null;
    const v = SO.view && now - SO.viewAt < 8000 ? SO.view : null;
    if (v) {
      const vq = v.cur || null;
      if (vq && Number(vq.have || 0) >= Number(vq.need || 1)) {
        SO.view = null; SO.tries = 0;
        try { emit('sect', { op: 'submit' }); } catch (e) {}
        closeSectPanel();
        setChip('🏮 🎁 trả nhiệm vụ môn phái');
        return;
      }
      if (!vq && Number(v.n || 0) < Number(v.max || 0)) {
        if (SO.tries >= 4 && now - SO.lastTry < 20000) { setChip('🏮 Trưởng Môn chưa giao nhiệm vụ mới (thử lại sau)', true); return; }
        SO.view = null; SO.tries++; SO.lastTry = now;
        try { emit('sect', { op: 'accept' }); } catch (e) {}
        closeSectPanel();
        setChip('🏮 📜 nhận nhiệm vụ môn phái');
        return;
      }
      if (!vq) { closeSectPanel(); setChip(`🏮 Hôm nay đã làm đủ ${v.n}/${v.max} nhiệm vụ môn phái`); return; }
      if (vq) {                                   // bảng chỉ để xem: đóng lại cho khỏi vướng
        closeSectPanel();
        setChip('🏮 📜 ' + (vq.text || '') + (Number(vq.need || 1) > 1 ? ` (${vq.have || 0}/${vq.need})` : '') + ' — đi làm rồi về trả');
        return;
      }
    }
    // hỏi Trưởng Môn — nếu 3 lần liền không nhận được trả lời thì tạm nghỉ 30 s (tránh gõ cửa vô hạn)
    if (SO.talk >= 3 && now - SO.lastTalk < 30000) { aiWait('sect'); setChip('🏮 NPC không trả lời (đã hỏi 3 lần) — kiểm tra đúng NPC môn phái rồi thử lại', true); return; }
    if (now - SO.npcAt > 5000) {
      SO.npcAt = now; SO.talk++; SO.lastTalk = now;
      try { emit('npc', { id: n.id }); } catch (e) {}
      setChip('🏮 đang hỏi ' + (n.name || 'Trưởng Môn') + '…');
    }
  }
  // <<< MUI-SECT-END
  // >>> MUI-ESCORT-BEGIN
  // TỰ ĐỘNG ÁP TIÊU: nhận tiêu ở Long Môn Tiêu Cục -> giữ xe sát bên -> qua cổng theo es.next -> giao ở Phân Đà.
  const EC = { on: false, at: 0, npcAt: 0, talk: 0, lastTalk: 0, exIdx: 0, exAt: 0, bad: {},
               routes: null, routesAt: 0, tries: 0, lastTry: 0, defAt: 0, waitAt: 0, tryAt: 0 };
  const ENPC = (() => { try { return JSON.parse(localStorage.getItem('mui_escnpc') || '{}') || {}; } catch (e) { return {}; } })();
  function eSave() { try { localStorage.setItem('mui_escnpc', JSON.stringify(ENPC)); } catch (e) {} }
  const ESC_RX = /tiêu\s*cục|tiêu\s*sư|long\s*môn/i;

  function escortNpc() {                      // NPC Long Môn Tiêu Cục
    const list = (G.map && G.map.npcs) || [];
    const n = list.find(x => x.action === 'escort')
      || (ENPC.id ? list.find(x => x.id === ENPC.id) : null)
      || list.find(x => ESC_RX.test(x.name || ''));
    if (n && (ENPC.id !== n.id || ENPC.map !== G.map.id)) { ENPC.id = n.id; ENPC.map = G.map.id; eSave(); }
    return n || null;
  }
  function escortTowns() {                    // 5 thành trấn trong gamedata (maps[].town)
    const ms = (G.data && G.data.maps) || {};
    const out = [];
    if (ENPC.map && ms[ENPC.map] && !EC.bad[ENPC.map]) out.push(ENPC.map);
    for (const id in ms) { const m = ms[id]; if (m && m.town && !EC.bad[id] && out.indexOf(id) < 0) out.push(id); }
    return out;
  }
  function escortExplore(now) {               // AL: chưa biết Tiêu Cục ở đâu -> dò thành trấn
    if (now - EC.exAt < 4000) return;
    EC.exAt = now;
    const all = escortTowns();
    if (!all.length) { EC.bad = {}; EC.exIdx = 0; setChip('🛒 Đã dò hết thành trấn mà không thấy Long Môn Tiêu Cục — thử lại', true); return; }
    const pick = all[EC.exIdx % all.length];
    EC.exIdx++;
    if (pick === G.map.id) { EC.bad[pick] = 1; return; }
    try { travelTo(pick, 'áp tiêu'); } catch (e) {}
    setChip('🛒 AL đi tìm Long Môn Tiêu Cục — tới ' + MAPNAME(pick));
  }
  function escortDestNpc() {                   // Phân Đà Tiêu Cục (nhận xe)
    const list = (G.map && G.map.npcs) || [];
    return list.find(x => x.action === 'escortDest') || list.find(x => x.id === 'tieu_cuc_pd')
      || list.find(x => /phân\s*đà/i.test(x.name || '')) || null;
  }
  function pickTier(routes) {                 // tuyến vừa cấp, đủ tiền cọc, thưởng cao nhất
    const me = G.me || {};
    const lv = Number(me.level || 1), gold = Number(me.gold || 0);
    const want = String((C.ec && C.ec.tier) || '');
    const ok = (routes || []).filter(r => r && r.k && Number(r.lv || 1) <= lv && gold >= Number(r.deposit || 0));
    if (want) { const r = ok.find(x => x.k === want); if (r) return r; }
    if (!ok.length) return null;
    return ok.sort((a, b) => Number(b.lv || 0) - Number(a.lv || 0))[0];
  }
  function closeEscPanel() { setTimeout(() => { try { if (UI.panelName() === 'escort') UI.closePanel(); } catch (e) {} }, 700); }
  function walkTo(x, y) {
    const gp = { x, y };
    if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
  }
  function defendCart(cart, now) {             // quái đang phá xe -> tự bấm chiêu của nhân vật
    if (!cart || !G.monsters || (G.map && G.map.safe) || (C.ec && C.ec.defend === false)) return false;
    let best = null, bd = 1e9;
    for (const e of G.monsters.values()) {
      if (!e || e.dead) continue;
      const d = Math.hypot(e.x - cart.x, e.y - cart.y);
      if (d < 240 && d < bd) { bd = d; best = e; }
    }
    if (!best) return false;
    if (now - EC.defAt < 700) return true;
    EC.defAt = now;
    const f = mhFight({});
    if (f.st === 'cast' || f.st === 'approach') { setChip('🛒 ⚔ bảo vệ xe tiêu · ' + (f.name || 'quái')); return true; }
    return false;
  }
  function escortAccept(es, now) {             // chưa có chuyến: tìm NPC, hỏi tuyến, nhận tiêu
    const left = Number(es.left);
    if (isFinite(left) && es.left !== undefined && es.left !== null && left <= 0) { setChip('🛒 Hôm nay đã hết lượt áp tiêu', true); return; }
    const n = escortNpc();
    if (!n) { escortExplore(now); return; }
    const p = npcPos(n), d = near(p, G.self);
    if (d > TILE * 2.2) {
      mhStop(); G.npcGoal = n;
      const gp = { x: p.x, y: p.y + 40 };
      if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
      setChip('🛒 đang tới Long Môn Tiêu Cục');
      return;
    }
    mhStop(); G.moveTo = null; G.npcGoal = null;
    if (EC.talk >= 3 && now - EC.lastTalk < 30000) { aiWait('escort'); setChip('🛒 Tiêu Cục không trả lời (đã hỏi 3 lần) — thử lại sau', true); return; }
    if (now - EC.npcAt > 4000) { EC.npcAt = now; EC.talk++; EC.lastTalk = now; try { emit('npc', { id: n.id }); } catch (e) {} }
    const r = EC.routes && now - EC.routesAt < 15000 ? EC.routes : null;
    if (!r) { setChip('🛒 đang xem các tuyến tiêu…'); return; }
    const pick = pickTier(r);
    if (!pick) { setChip('🛒 không có tuyến nào vừa cấp và đủ tiền cọc', true); return; }
    try { emit('escort', { op: 'start', tier: pick.k }); } catch (e) {}
    EC.routes = null; EC.talk = 0; EC.tries = 0;
    closeEscPanel();
    setChip('🛒 📜 nhận tiêu ' + (pick.name || pick.k) + ' → ' + (pick.destName || ''));
  }
  function setEc(on) {
    on = !!on;
    C.ec = C.ec || {};
    EC.on = on; C.ec.on = on; save();
    EC.at = 0; EC.npcAt = 0; EC.talk = 0; EC.routes = null; EC.tries = 0; EC.bad = {}; EC.exIdx = 0;
    if (!on) {
      mhStop();
      G.moveTo = null; G.npcGoal = null;
      try { TRV.dest = null; TRV.teleTo = null; } catch (e) {}
      if (!Q.on && !PB.on && !SO.on) setChip('');
      toast('Đã dừng tự động áp tiêu');
    } else {
      const es = (G.me && G.me.escort) || {};
      toast('Bắt đầu tự động áp tiêu' + (es.left !== undefined ? ' — còn ' + es.left + ' lượt hôm nay' : ''));
    }
    refreshHelper();
  }
  function hookEscort() {                      // học NPC + bảng tuyến tiêu từ máy chủ
    if (!window.G || !G.socket || G.socket.__mhEsc) return;
    G.socket.__mhEsc = 1;
    try {
      G.socket.on('npc', d => {
        if (!d || d.action !== 'escort' || !G.map) return;
        ENPC.id = d.id; ENPC.map = G.map.id; eSave();
        if (Array.isArray(d.routes)) { EC.routes = d.routes; EC.routesAt = Date.now(); }
      });
    } catch (e) {}
  }
  function escortTick() {
    if (!EC.on || !ready()) return;
    aiBeat('escort');
    const now = Date.now();
    if (now - EC.at < 500) return;
    EC.at = now;
    if (G.me.dead) { aiWait('escort'); setChip('🛒 Đang chờ hồi sinh…', true); return; }
    if (Q.on || PB.on) { aiWait('escort'); setChip('🛒 Nhường đường cho ' + (Q.on ? 'Tự làm nhiệm vụ' : 'phó bản')); return; }
    const es = (G.me && G.me.escort) || {};
    if (!es.id) { escortAccept(es, now); return; }
    const cart = (G.carts && G.carts.get(es.id)) || null;
    if (es.map && G.map.id !== es.map) {                     // xe ở bản đồ khác -> quay lại đón
      if (now - EC.tryAt > 3000) { EC.tryAt = now; try { travelTo(es.map, 'áp tiêu'); } catch (e) {} }
      setChip('🛒 xe đang ở ' + (es.mapName || MAPNAME(es.map)) + ' — quay lại đón xe');
      return;
    }
    if (defendCart(cart, now)) return;
    if (es.dest && G.map.id === es.dest) {                   // tới Phân Đà Tiêu Cục
      const n = escortDestNpc();
      if (!n) { setChip('🛒 đã tới ' + MAPNAME(es.dest) + ' — tìm Phân Đà Tiêu Cục', true); roam(); return; }
      const p = npcPos(n), d = near(p, G.self);
      if (d > TILE * 2.2) {
        mhStop(); G.npcGoal = n;
        const gp = { x: p.x, y: p.y + 40 };
        if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
        setChip('🛒 đưa xe tới Phân Đà Tiêu Cục');
        return;
      }
      mhStop(); G.moveTo = null; G.npcGoal = null;
      if (now - EC.npcAt > 4000) { EC.npcAt = now; try { emit('npc', { id: n.id }); } catch (e) {} }
      setChip('🛒 giao tiêu ở Phân Đà');
      return;
    }
    const portal = (G.map.portals || []).find(x => x.to === es.next);
    if (!portal) {
      if (now - EC.waitAt > 5000) { EC.waitAt = now; try { roam(); } catch (e) {} }
      setChip('🛒 chưa thấy cổng tới ' + (es.next || '?') + ' — đang tìm cổng', true);
      return;
    }
    const px = (portal.x + 0.5) * TILE, py = (portal.y + 0.5) * TILE;
    if (cart) {
      const dc = Math.hypot(cart.x - G.self.x, cart.y - G.self.y);
      if (dc > 320) {                                        // xe tụt lại: đợi
        mhStop(); walkTo(cart.x, cart.y);
        setChip('🛒 đợi xe tiêu theo kịp (cách ' + Math.round(dc) + 'px)');
        return;
      }
      if (near({ x: px, y: py }, G.self) < TILE * 1.4 && dc > 260) {
        mhStop(); walkTo(cart.x, cart.y);
        setChip('🛒 chờ xe tiêu tới cổng rồi mới qua');
        return;
      }
    }
    walkTo(px, py);
    setChip('🛒 áp tiêu → ' + (portal.toName || MAPNAME(es.next)) + (es.maxHp ? ' · ❤ ' + es.hp + '/' + es.maxHp : ''));
  }
  // <<< MUI-ESCORT-END

  function pbPick(list) {                     // phó bản vừa cấp, còn lượt, chưa thử 3 lần
    if (!list || !list.list || !list.list.length) return null;
    if (list.party && list.party.leader === false) return null;
    const lv = G.me.level || 1;
    const ok = list.list.filter(d => d && d.left > 0 && lv >= (d.minLv || 1) && !PB.bad[d.id] && (PB.tried[d.id] || 0) < 3);
    if (!ok.length) return null;
    ok.sort((a, b) => ((b.daily ? 1 : 0) - (a.daily ? 1 : 0)) || ((b.exp || 0) - (a.exp || 0)) || ((b.lv || 0) - (a.lv || 0)));
    return ok[0];
  }
  function hookPb() {                         // nhận danh sách phó bản từ máy chủ
    if (!window.G || !G.socket || G.socket.__mhPb) return;
    G.socket.__mhPb = 1;
    try { G.socket.on('dungeonList', d => { if (PB.on && d) { PB.list = d; PB.listAt = Date.now(); } }); } catch (e) {}
  }
  function pbTick() {
    if (!PB.on || !ready()) return;
    aiBeat('pb');
    if (G.me && G.me.dead) { aiWait('pb'); setChip('Đang chờ hồi sinh…', true); return; }
    if (Q.on) { aiWait('pb'); setChip('🗝️ Chờ ' + AI_LABEL[aiOwner()] + ' xong rồi vào phó bản'); return; }
    npcLearn();
    const dg = window.Dungeon && Dungeon.state;
    if (G.map.id !== PB.mapId) { PB.mapId = G.map.id; PB.mapAt = 0; PB.list = null; PB.listAt = 0; PB.trvAt = 0; }
    if (/^pb_/.test(G.map.id)) {              // trong phó bản: chỉ đánh, không đi đâu
      PB.st = dg || PB.st;
      if (!dg) { aiWait('pb'); setChip('🗝️ Đang vào phó bản…'); return; }
      if (dg.done || dg.fail) {
        if (dg.fail && PB.cur) PB.bad[PB.cur] = 1;      // phó bản này không qua được -> thử cái khác
        if (!PB.at) PB.at = Date.now();
        setChip(dg.done ? '🗝️ Vượt ải xong — chuẩn bị ra' : '🗝️ Phó bản thất bại — ra ngoài');
        if (Date.now() - PB.at > 3000) { PB.at = 0; try { emit('dungeon', { op: 'leave' }); } catch (e) {} }
        return;
      }
      PB.at = 0;
      const watch = String(dg.left) + '|' + String(dg.stage) + '|' + String(dg.boss || '');
      if (PB.watch !== watch) { PB.watch = watch; PB.idleAt = 0; }
      if (!G.auto && !C.pb.atk) {                      // không đánh được thì đứng im -> tự ra, không phí lượt
        if (!PB.idleAt) PB.idleAt = Date.now();
        else if (Date.now() - PB.idleAt > 90e3) {
          PB.idleAt = 0;
          if (PB.cur) PB.bad[PB.cur] = 1;
          try { emit('dungeon', { op: 'leave' }); } catch (e) {}
          toast('Phó bản đứng im vì chưa bật Tự động đánh — đã ra');
          setChip('🗝️ Ra khỏi phó bản (chưa bật Tự động đánh)', true);
          return;
        }
      } else PB.idleAt = 0;
      if (!G.auto && C.pb.atk) { G.setAuto(true); PB.autoByUs = true; }
      if (dg.goal) {
        const far = Math.hypot(dg.goal.x - G.self.x, dg.goal.y - G.self.y);
        const g = G.moveTo;
        if (far > 220 && (!g || Math.hypot(g.x - dg.goal.x, g.y - dg.goal.y) > 60)) G.moveTo = { x: dg.goal.x, y: dg.goal.y };
        else if (far <= 220 && g) G.moveTo = null;
      }
      setChip('🗝️ ' + (dg.name || 'Phó bản') + ' · ' + (dg.boss ? '👹 ' + dg.boss
        : 'đợt ' + ((dg.stage || 0) + 1) + '/' + (dg.stages || '?') + ' (' + (dg.left || 0) + '/' + (dg.total || 0) + ')')
        + (G.auto ? '' : ' · chưa bật Tự động đánh'), !G.auto);
      return;
    }
    if (Q.on) return;                         // cốt truyện đang giữ quyền đi (không giành đường)
    const n = (G.map.npcs || []).find(x => x.id === PB_NPC);
    if (n) {
      const p = npcPos(n), gp = { x: p.x, y: p.y + 40 };
      if (near(p, G.self) < TILE * 2.2) {     // đứng cạnh Phó Bản Sứ Giả
        if (PB.autoByUs) { G.setAuto(false); PB.autoByUs = false; }
        G.moveTo = null; G.npcGoal = null;
        const fresh = PB.list && Date.now() - PB.listAt < 9000;
        const pick = fresh ? pbPick(PB.list) : null;
        if (pick && !G.auto && !C.pb.atk) {   // vào mà không đánh được thì chỉ mắc kẹt trong đó
          setChip('🗝️ Có ' + (pick.name || pick.id) + ' — bật "Tự động đánh" (hoặc ô cho phép) rồi vào', true);
          return;
        }
        if (pick) {
          PB.tried[pick.id] = (PB.tried[pick.id] || 0) + 1;
          PB.cur = pick.id; PB.st = null; PB.watch = ''; PB.idleAt = 0;
          try { if (UI.panelName() === 'dungeon') UI.closePanel(); } catch (e) {}
          try { emit('dungeon', { op: 'enter', id: pick.id }); } catch (e) {}
          setChip('🗝️ Vào ' + (pick.name || pick.id));
          PB.list = null; PB.listAt = 0; PB.at = 0;
          return;
        }
        if (fresh && PB.list.list && PB.list.list.length) {
          setChip('🗝️ Hết lượt phó bản hôm nay / đã thử hết', true);
          setPb(false);
          return;
        }
        if (Date.now() - PB.npcAt > 4000) { PB.npcAt = Date.now(); try { emit('npc', { id: PB_NPC }); } catch (e) {} }
        setChip('🗝️ Đang hỏi Phó Bản Sứ Giả…');
        return;
      }
      if (PB.autoByUs) { G.setAuto(false); PB.autoByUs = false; }
      G.npcGoal = n;
      if (!G.moveTo || near(G.moveTo, gp) > 60) G.moveTo = gp;
      setChip('🗝️ Đang tới Phó Bản Sứ Giả');
      return;
    }
    // bản đồ này không có NPC -> đi tới nơi đã biết, hoặc dò các thành trấn
    PB.list = null; PB.listAt = 0;
    if (!PB.mapAt) PB.mapAt = Date.now();
    if (Date.now() - PB.mapAt < 1500) return;  // chờ máy chủ gửi danh sách NPC của map
    PB.seen[G.map.id] = 1;
    let known = NPCMAP[PB_NPC];
    if (known === G.map.id) { delete NPCMAP[PB_NPC]; npcSave(); known = null; }
    if (known && !PB.seen[known]) {
      if (PB.autoByUs) { G.setAuto(false); PB.autoByUs = false; }
      if (Date.now() - (PB.trvAt || 0) > 2500) { PB.trvAt = Date.now(); travelTo(known, '🗝️ Phó bản'); }
      setChip('🗝️ Tới ' + MAPNAME(known) + ' tìm Phó Bản Sứ Giả');
      return;
    }
    const next = PB_TOWNS.find(m => !PB.seen[m]);
    if (!next) { setChip('🗝️ Không tìm thấy Phó Bản Sứ Giả — đứng cạnh NPC rồi bật lại', true); setPb(false); return; }
    if (PB.autoByUs) { G.setAuto(false); PB.autoByUs = false; }
    if (Date.now() - (PB.trvAt || 0) > 2500) { PB.trvAt = Date.now(); travelTo(next, '🗝️ Phó bản'); }
    setChip('🗝️ Đi tìm Phó Bản Sứ Giả ở ' + MAPNAME(next));
  }

  const DAILY_RX = [
    [/phó bản|pho ban/i, 'dungeon'],
    [/đi tiêu|hộ tống|xe tiêu|tiêu/i, 'manual'],
    [/đập đồ|cường hóa|thần binh|nâng cấp trang bị|khảm|ghép/i, 'manual'],
    [/tỷ thí|lôi đài|pvp|đại hội|bang chiến|bang hội|thi đấu/i, 'manual'],
    [/mua|bán|chế tạo|đổi thưởng/i, 'manual']
  ];
  function dailyKind(q) {                     // máy chủ chỉ gửi chữ, không gửi loại mục tiêu
    const t = String(q.text || '');
    for (const [rx, k] of DAILY_RX) if (rx.test(t)) return k;
    return 'grind';                            // mặc định: hạ quái / thu thập -> luyện công
  }
  function dailySolve() {                     // tự LÀM mục tiêu (300 ms, rất rẻ)
    if (!C.q.solve || !ready()) return;
    const own = aiOwner();                                           // một người lái: nhường nhiệm vụ/phó bản/áp tiêu/môn phái
    if (own && own !== 'daily') return;
    aiBeat('daily');
    if (G.me && G.me.dead) { aiWait('daily'); return; }
    const d = G.daily; if (!d || !d.list) return;
    const q = d.list.find(x => !x.claimed && !x.done);
    if (!q) return;
    const kind = dailyKind(q), prog = q.n ? ' (' + (q.progress || 0) + '/' + q.n + ')' : '', t = q.text || ('#' + q.id);
    if (kind === 'dungeon') { aiWait('daily'); setChip('📅 ' + t + prog + ' · cần phó bản'); setPb(true); return; }
    if (kind === 'grind') {
      if (G.map.safe && !G.auto && Date.now() - (Q.trainAt || 0) > 3000) {
        Q.trainAt = Date.now();
        const id = bestTraining();
        if (id) { travelTo(id, '📅 ' + t); setChip('📅 ' + t + prog + ' · ra bãi luyện công'); return; }
      }
      const f = mhFight(q);                      // tự chọn quái + tự bấm chiêu (không cần Tự động đánh)
      if (f.st === 'cast') { setChip('📅 ' + t + prog + ' · ' + (f.idx === 0 ? 'đánh thường' : 'dùng chiêu') + ' ' + f.name); return; }
      if (f.st === 'approach') { setChip('📅 ' + t + prog + ' · đang tới ' + f.name); return; }
      if (f.st === 'noskill') { setChip('📅 ' + t + prog + ' · chưa có chiêu đánh nào dùng được', true); return; }
      if (Date.now() - (Q.trainAt || 0) > 4000) {
        Q.trainAt = Date.now();
        const id = bestTraining();
        if (id && id !== G.map.id) { travelTo(id, '📅 ' + t); setChip('📅 ' + t + prog + ' · ra bãi luyện công'); return; }
      }
      try { roam(); } catch (e) {}
      setChip('📅 ' + t + prog + ' · đang tìm quái');
      return;
    }
    setChip('📅 ' + t + prog + ' · cần tự làm', true);
  }
  // <<< MUI-QUEST-END

  // ---------------- chip trạng thái ----------------
  let chip;
  function setChip(text, warn) {
    if (Q.on && text) Q.msg = text;
    if (!chip) {
      chip = document.createElement('div'); chip.id = 'mh-chip';
      chip.innerHTML = '<i class="d"></i><span class="t"></span><button type="button">Dừng</button>';
      chip.querySelector('button').onclick = () => stopAll();
      document.body.appendChild(chip);
    }
    const t = text || (E.on ? E.msg : M.on ? M.msg : '');
    chip.classList.toggle('on', !!t); chip.classList.toggle('warn', !!warn);
    const s = chip.querySelector('.t'); if (s.textContent !== t) { s.textContent = t; s.title = t; }
    CHIP.text = t || ''; CHIP.warn = !!warn; CHIP.at = Date.now();
  }

  // ======================================================================
  //  3) ĐẬP ĐỒ TỰ ĐỘNG (cần mở NPC Thợ Rèn — tab Cường hóa)
  // ======================================================================
  let npcData = null;
  const E = { on: false, uid: null, wait: false, t: null, n: 0, ok: 0, fail: 0, gold: 0, start: 0, msg: '', log: '', cls: '' };
  function findItem(uid) {
    const me = G.me; const i = me.inv.find(x => x.uid === uid); if (i) return i;
    for (const k in me.equip || {}) { const e = me.equip[k]; if (e && e.uid === uid) return Object.assign({ equipped: true, slot: k }, e); }
    return null;
  }
  function selectedUid() {
    const b = $('panel-body'); if (!b) return null;
    const s = b.querySelector('.slot.sel[data-uid]'); if (s) return s.dataset.uid;
    const q = b.querySelector('.slot.sel[data-eq]'); if (q) { const e = G.me.equip[q.dataset.eq]; return e && e.uid; }
    return null;
  }
  function stopEnh(msg, cls) { if (!E.on && !msg) return; E.on = false; E.wait = false; clearTimeout(E.t); if (msg) { E.log = msg; E.cls = cls || ''; toast(msg, cls === 'bad' ? 'error' : undefined); } setChip(Q.on ? Q.msg : ''); paintEnh(); }
  function enhStep() {
    if (!E.on) return;
    if (!ready() || !npcData || !isOpen('npc')) return stopEnh('Đã dừng: bảng Thợ Rèn đã đóng', 'bad');
    const it = findItem(E.uid); if (!it) return stopEnh('Đã dừng: không tìm thấy trang bị', 'bad');
    const D = G.data.enhance, info = G.data.items[it.id], plus = it.plus || 0;
    if (plus >= Math.min(C.enh.target, D.max)) return stopEnh(`Hoàn thành: ${info.name} đã đạt +${plus}`, 'ok');
    const cost = D.cost[plus][info.tier], risky = plus >= D.safe, ins = have('insure');
    if (have('stone') < cost.stone) return stopEnh(`Đã dừng: thiếu Huyền Tinh Thạch (cần ${cost.stone})`, 'bad');
    if (cost.stone2 && have('stone2') < cost.stone2) return stopEnh(`Đã dừng: thiếu Thiên Tinh Thạch (cần ${cost.stone2})`, 'bad');
    if (G.me.gold < cost.gold) return stopEnh(`Đã dừng: thiếu ngân lượng (cần ${fmt(cost.gold)})`, 'bad');
    const insure = risky && C.enh.insure && ins > 0;
    if (risky && !insure && C.enh.safe) return stopEnh(`Đã dừng ở +${plus}: hết Bảo Hiểm Phù, đập tiếp có thể rớt về +1`, 'bad');
    E.wait = true; E.n++; E.gold += cost.gold; E.prev = plus;
    E.msg = `Đập đồ: +${plus} → +${plus + 1} (${Math.round(D.rate[plus] * 100)}%)${insure ? ' · có bảo hiểm' : ''}`;
    setChip(E.msg);
    emit('enhance', { uid: E.uid, npc: npcData.id, insure });
    clearTimeout(E.t); E.t = setTimeout(() => { if (E.on && E.wait) { E.wait = false; enhStep(); } }, 4000);   // mất phản hồi thì thử lại
  }
  function onEnhanceResult(d) {
    if (!E.on || !E.wait) return;
    E.wait = false; clearTimeout(E.t);
    const r = d && d.result;
    if (r === 'ok') E.ok++; else E.fail++;
    E.log = { ok: `Thành công lên +${E.prev + 1}`, fail: 'Thất bại, giữ nguyên cấp', insured: 'Thất bại — Bảo Hiểm Phù đã giữ cấp', drop: 'Thất bại — bị rớt về +1' }[r] || '';
    E.cls = r === 'ok' ? 'ok' : 'bad';
    if (r === 'drop' && C.enh.stopDrop) { setTimeout(() => stopEnh('Đã dừng: trang bị bị rớt cấp', 'bad'), 50); return; }
    E.t = setTimeout(enhStep, Math.max(250, +C.enh.delay || 450));   // chờ máy chủ cập nhật túi đồ
  }
  function enhBoxHtml() {
    const D = G.data.enhance;
    const opts = Array.from({ length: D.max }, (_, i) => i + 1).map(v => `<option value="${v}" ${+C.enh.target === v ? 'selected' : ''}>+${v}</option>`).join('');
    return `<div class="mh-box" id="mh-enh"><h5>Đập đồ tự động</h5>
      <div class="au-row"><span>Đập tới</span><select data-mh="enh.target">${opts}</select></div>
      <label class="au-row"><input type="checkbox" data-mh="enh.insure" ${C.enh.insure ? 'checked' : ''}><span>Tự dùng Bảo Hiểm Phù từ +${D.safe} (còn ${have('insure')})</span></label>
      <label class="au-row"><input type="checkbox" data-mh="enh.safe" ${C.enh.safe ? 'checked' : ''}><span>Dừng khi hết bảo hiểm ở mốc rủi ro</span></label>
      <label class="au-row"><input type="checkbox" data-mh="enh.stopDrop" ${C.enh.stopDrop ? 'checked' : ''}><span>Dừng ngay nếu bị rớt cấp</span></label>
      <div class="mh-row2"><button class="btn primary mh-run ${E.on ? 'on' : ''}" data-mh-act="enh">${E.on ? 'Dừng đập' : 'Bắt đầu đập tự động'}</button></div>
      <div class="mh-stat"><div>Lần đập<b data-e="n">${E.n}</b></div><div>Thành công<b data-e="ok">${E.ok}</b></div><div>Thất bại<b data-e="fail">${E.fail}</b></div><div>Đã tốn<b data-e="gold">${fmt(E.gold)}</b></div></div>
      <div class="mh-log ${E.cls}" data-e="log">${esc(E.log)}</div></div>`;
  }
  function paintEnh() {
    const b = $('mh-enh'); if (!b) return;
    const run = b.querySelector('[data-mh-act="enh"]'); run.classList.toggle('on', E.on); run.textContent = E.on ? 'Dừng đập' : 'Bắt đầu đập tự động';
    for (const k of ['n', 'ok', 'fail']) b.querySelector(`[data-e="${k}"]`).textContent = E[k];
    b.querySelector('[data-e="gold"]').textContent = fmt(E.gold);
    const l = b.querySelector('[data-e="log"]'); l.textContent = E.log; l.className = 'mh-log ' + E.cls;
  }
  function injectEnh(body) {
    const box = body.querySelector('.enh-box'); if (!box || $('mh-enh')) return;
    box.insertAdjacentHTML('afterend', enhBoxHtml());
    bindInputs($('mh-enh'));
    $('mh-enh').querySelector('[data-mh-act="enh"]').onclick = () => {
      if (E.on) return stopEnh('Đã dừng đập đồ');
      const uid = selectedUid(); if (!uid) return toast('Hãy chọn một trang bị trước', 'error');
      if (E.uid !== uid) Object.assign(E, { n: 0, ok: 0, fail: 0, gold: 0 });
      Object.assign(E, { on: true, uid, log: '', cls: '' }); paintEnh(); enhStep();
    };
  }

  // ======================================================================
  //  4) NÂNG THÚ CƯỠI TỰ ĐỘNG (cho ăn Mã Linh Đan + tự đột phá)
  // ======================================================================
  const M = { on: false, id: null, t: null, sig: '', at: 0, msg: '', log: '', cls: '', fed: 0, brk: 0 };
  function stopMount(msg, cls) { if (!M.on && !msg) return; M.on = false; clearTimeout(M.t); if (msg) { M.log = msg; M.cls = cls || ''; toast(msg, cls === 'bad' ? 'error' : undefined); } setChip(Q.on ? Q.msg : ''); paintMount(); }
  function mountStep() {
    if (!M.on) return;
    if (!ready()) return stopMount('Đã dừng', 'bad');
    const o = (G.me.mounts || {})[M.id], info = G.data.mounts[M.id];
    if (!o) return stopMount('Đã dừng: chưa sở hữu thú cưỡi này', 'bad');
    const sig = o.lv + ':' + o.exp;
    if (M.sig === sig && Date.now() - M.at < 2500) { M.t = setTimeout(mountStep, 250); return; }   // chờ máy chủ cập nhật
    M.sig = sig;
    const target = Math.min(+C.mt.target || 10, G.data.mountMax);
    if (o.lv >= target) return stopMount(`Hoàn thành: ${info.name} đạt cấp ${o.lv}`, 'ok');
    const need = G.data.mountExp[o.lv];
    if (o.lv % 10 === 0 && o.exp >= need) {
      const stones = o.lv / 10, gold = o.lv * 2000;
      if (!C.mt.brk) return stopMount(`Đã dừng ở cấp ${o.lv}: cần đột phá`, 'bad');
      if (have('mount_stone') < stones) return stopMount(`Đã dừng: cần ${stones} Long Huyết Thạch để đột phá cấp ${o.lv}`, 'bad');
      if (G.me.gold < gold) return stopMount(`Đã dừng: cần ${fmt(gold)} lượng để đột phá`, 'bad');
      M.brk++; M.msg = `Nâng thú cưỡi: đột phá ${info.name} cấp ${o.lv}`;
      emit('mount', { op: 'break', id: M.id, n: 1 });
    } else {
      const food = have('mount_food'), per = 50 * o.lv;
      if (!food) return stopMount('Đã dừng: hết Mã Linh Đan', 'bad');
      const n = Math.max(1, Math.min(+C.mt.batch || 10, food, Math.floor(G.me.gold / per)));
      if (G.me.gold < per) return stopMount(`Đã dừng: thiếu ngân lượng (${fmt(per)}/lần)`, 'bad');
      M.fed += n; M.msg = `Nâng thú cưỡi: ${info.name} cấp ${o.lv} · KN ${o.exp}/${need}`;
      emit('mount', { op: 'feed', id: M.id, n });
    }
    M.at = Date.now(); setChip(M.msg); paintMount();
    M.t = setTimeout(mountStep, 600);
  }
  function mountBoxHtml(sel) {
    const owned = G.me.mounts || {};
    const ids = Object.keys(owned);
    if (!ids.length) return '<div class="mh-box" id="mh-mount"><h5>Nâng thú cưỡi tự động</h5><div class="small muted">Bạn chưa có thú cưỡi.</div></div>';
    sel = sel && owned[sel] ? sel : (M.id && owned[M.id] ? M.id : (G.me.mount || ids[0]));
    const o = owned[sel];
    const lvOpts = []; for (let v = 1; v <= G.data.mountMax; v++) if (v > o.lv) lvOpts.push(v);
    if (!lvOpts.length) lvOpts.push(G.data.mountMax);
    const tgt = lvOpts.includes(+C.mt.target) ? +C.mt.target : lvOpts[Math.min(lvOpts.length - 1, 9 - (o.lv % 10))];
    return `<div class="mh-box" id="mh-mount" data-sel="${sel}"><h5>Nâng thú cưỡi tự động</h5>
      <div class="au-row"><span>Thú cưỡi</span><select data-mh-mount>${ids.map(id => `<option value="${id}" ${id === sel ? 'selected' : ''}>${esc(G.data.mounts[id].name)} · cấp ${owned[id].lv}</option>`).join('')}</select></div>
      <div class="au-row"><span>Nâng tới cấp</span><select data-mh="mt.target">${lvOpts.map(v => `<option value="${v}" ${v === tgt ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="au-row"><span>Mỗi lần cho ăn</span><select data-mh="mt.batch">${[1, 5, 10].map(v => `<option value="${v}" ${+C.mt.batch === v ? 'selected' : ''}>x${v}</option>`).join('')}</select></div>
      <label class="au-row"><input type="checkbox" data-mh="mt.brk" ${C.mt.brk ? 'checked' : ''}><span>Tự đột phá mỗi 10 cấp (Long Huyết Thạch: ${have('mount_stone')})</span></label>
      <div class="small muted">Mã Linh Đan: ${have('mount_food')} · ${fmt(50 * o.lv)} lượng/lần cho ăn</div>
      <div class="mh-row2"><button class="btn primary mh-run ${M.on ? 'on' : ''}" data-mh-act="mount">${M.on ? 'Dừng nâng cấp' : 'Bắt đầu nâng tự động'}</button></div>
      <div class="mh-log ${M.cls}" data-m="log">${esc(M.log)}</div></div>`;
  }
  function paintMount() {
    const b = $('mh-mount'); if (!b) return;
    const run = b.querySelector('[data-mh-act="mount"]'); if (!run) return;
    run.classList.toggle('on', M.on); run.textContent = M.on ? 'Dừng nâng cấp' : 'Bắt đầu nâng tự động';
    const l = b.querySelector('[data-m="log"]'); l.textContent = M.on ? M.msg : M.log; l.className = 'mh-log ' + (M.on ? '' : M.cls);
  }
  function bindMount(root) {
    const b = root.querySelector('#mh-mount'); if (!b) return;
    bindInputs(b);
    const s = b.querySelector('[data-mh-mount]');
    if (s) s.onchange = () => { M.id = s.value; b.outerHTML = mountBoxHtml(s.value); bindMount(root); };
    const run = b.querySelector('[data-mh-act="mount"]');
    if (run) run.onclick = () => {
      if (M.on) return stopMount('Đã dừng nâng thú cưỡi');
      const tsel = b.querySelector('[data-mh="mt.target"]'); C.mt.target = +tsel.value; save();
      Object.assign(M, { on: true, id: b.dataset.sel, sig: '', at: 0, log: '', cls: '' }); paintMount(); mountStep();
    };
  }
  function injectMount(body) {
    if ($('mh-mount') || !body.querySelector('.mount-list')) return;
    const sel = body.querySelector('.mount-card.sel');
    body.insertAdjacentHTML('beforeend', mountBoxHtml(sel && sel.dataset.mount));
    bindMount(body);
  }

  // ======================================================================
  //  BẢNG "TRỢ THỦ" + THẺ TRONG CÀI ĐẶT
  // ======================================================================
  function bindInputs(root) {
    root.querySelectorAll('[data-mh]').forEach(el => {
      const [g, k] = el.dataset.mh.split('.');
      el.onchange = () => {
        C[g][k] = el.type === 'checkbox' ? el.checked : (isNaN(+el.value) ? el.value : +el.value);
        save();
        if (el.dataset.mh === 'rv.on' && !C.rv.on) clearReviveTimer();
        if (el.dataset.mh === 'rv.on' && C.rv.on && G.me && G.me.dead) onDeadShown();
        const v = root.querySelector(`[data-v="${el.dataset.mh}"]`); if (v) v.textContent = el.value + (el.dataset.unit || '');
        root.querySelectorAll('[data-sync="' + el.dataset.mh + '"]').forEach(x => { if (x !== el) x.checked = el.checked; });
        syncTags(root);
      };
    });
  }
  function syncTags(root) { root.querySelectorAll('[data-tag]').forEach(t => { const [g, k] = t.dataset.tag.split('.'); const on = g === 'Q' ? Q.on : g === 'PB' ? PB.on : g === 'D' ? (D.on = !!C.q.solve) : g === 'SO' ? (SO.on = !!C.sc.on) : g === 'EC' ? (EC.on = !!(C.ec && C.ec.on)) : g === 'AI' ? (aiOn()) : !!C[g][k]; t.classList.toggle('on', on); t.textContent = on ? 'Đang bật' : 'Tắt'; }); }
  const tg = (k, label) => { const [g, kk] = k.split('.'); return `<label class="au-row"><input type="checkbox" data-mh="${k}" data-sync="${k}" ${C[g][kk] ? 'checked' : ''}><span>${label}</span></label>`; };
  function reviveHtml() {
    return `<div class="au-box"><h4>Tự hồi sinh <span class="mh-tag" data-tag="rv.on"></span></h4>
      ${tg('rv.on', 'Bật tự hồi sinh khi bị trọng thương')}
      <div class="au-row"><span>Cách hồi sinh</span><select data-mh="rv.mode"><option value="here" ${C.rv.mode === 'here' ? 'selected' : ''}>Tại chỗ (bằng ngân lượng)</option><option value="town" ${C.rv.mode === 'town' ? 'selected' : ''}>Về thành (miễn phí)</option></select></div>
      ${tg('rv.knb', 'Thiếu ngân lượng thì dùng Nguyên Bảo để hồi tại chỗ')}
      <div class="au-row au-sl"><span>Chờ</span><input type="range" min="1" max="10" step="1" value="${C.rv.delay}" data-mh="rv.delay" data-unit=" giây"><b data-v="rv.delay" style="width:56px">${C.rv.delay} giây</b></div>
      ${tg('rv.resume', 'Hồi sinh xong tự bật lại Tự động đánh')}
      <p class="small muted">Nếu chết quá ${C.rv.max} lần trong 10 phút, trợ thủ sẽ tạm ngừng để bạn kiểm tra lại. Không đủ ngân lượng (và không cho dùng Nguyên Bảo) thì tự về thành.</p></div>`;
  }
  function renderHelper(body) {
    const st = G.me.story, step = storyStep();
    const qline = !st || st.done ? 'Đã hoàn thành toàn bộ cốt truyện.' : `Chương ${st.ch + 1}${st.chName ? ': ' + esc(st.chName) : ''} · ${esc((st.text || (step && step.text) || '').replace(/\{name\}/g, G.me.name))}${st.need > 1 ? ` (${st.have || 0}/${st.need})` : ''}`;
    const inPb = PB.st && G.map && /^pb_/.test(G.map.id);
    const SS = (G.me && G.me.sect) || null;
    const sectLine = !SO.on
      ? 'Chưa bật — bấm nút dưới để tự về Trưởng Môn nhận/trả và đi làm nhiệm vụ môn phái.'
      : !SS ? 'Nhân vật chưa có môn phái.'
      : SS.cur
        ? `${Number(SS.n || 0) + 1}/${Number(SS.max || 0)} · ${esc(SS.cur.text || '')}${Number(SS.cur.need || 1) > 1 ? ` (${SS.cur.have || 0}/${SS.cur.need})` : ''}`
        : (Number(SS.n || 0) >= Number(SS.max || 0) ? `Đã làm đủ ${SS.n}/${SS.max} nhiệm vụ hôm nay.` : `Còn ${Number(SS.max || 0) - Number(SS.n || 0)} lượt — đang về Trưởng Môn nhận.`);
    const ES = (G.me && G.me.escort) || {};
    const escLine = !EC.on
      ? 'Chưa bật — bấm nút dưới để tự nhận tiêu, giữ xe và giao ở Phân Đà.'
      : !ES.id
        ? (ES.left !== undefined ? `Còn ${ES.left} lượt hôm nay — đang đi nhận tiêu.` : 'Chưa có chuyến — đang tìm Long Môn Tiêu Cục.')
        : `${esc(ES.name || 'Xe tiêu')} → ${esc(ES.destName || '')} · xe ở ${esc(ES.mapName || '')} · ❤ ${ES.hp || 0}/${ES.maxHp || 0}`;
    const dl = (G.daily && G.daily.list) || [], dLeft = dl.filter(x => !x.done && !x.claimed);
    const dailyLine = !D.on
      ? 'Chưa bật — bấm nút dưới để tự luyện công cho mục tiêu hằng ngày.'
      : (dl.length
        ? (dLeft.length
          ? `${dLeft.length}/${dl.length} mục tiêu còn lại · ${esc(dLeft[0].text || '')}${dLeft[0].n > 1 ? ` (${dLeft[0].progress || 0}/${dLeft[0].n})` : ''}`
          : 'Đã làm xong mọi mục tiêu hôm nay.' + (G.daily.bonus && !G.daily.bonusClaimed ? ' Còn thưởng chung — bấm "Nhận thưởng ngay".' : ''))
        : 'Đang xin danh sách mục tiêu… (bấm "Nhận thưởng ngay" nếu lâu quá)');
    const pbLine = PB.on
      ? (inPb ? `🗝️ ${esc(PB.st.name || 'phó bản')} · đợt ${(PB.st.stage || 0) + 1}/${PB.st.stages || '?'}${PB.st.done ? ' · đã xong' : PB.st.fail ? ' · thất bại' : ''}` : 'Đang tìm Phó Bản Sứ Giả…')
      : 'Chưa bật — tự tìm Phó Bản Sứ Giả, chọn phó bản còn lượt vừa cấp rồi vào đánh.';
    body.innerHTML = `<div class="au">
      ${reviveHtml()}
      <div class="au-box"><h4>Tự làm nhiệm vụ <span class="mh-tag" data-tag="Q.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${qline}</div>
        <div class="mh-row2" style="margin:0 0 6px"><button class="btn primary mh-run ${Q.on ? 'on' : ''}" data-mh-act="quest">${Q.on ? 'Dừng tự làm nhiệm vụ' : 'Bắt đầu tự làm nhiệm vụ'}</button></div>
        ${tg('q.skip', 'Tự bỏ qua hội thoại cốt truyện')}
        ${tg('q.close', 'Tự đóng bảng NPC sau khi nói chuyện')}
        ${tg('q.roam', 'Không thấy quái nhiệm vụ thì tự đi tìm quanh bản đồ')}
        <p class="small muted">Tự đi theo mũi tên cốt truyện: qua cổng sang bản đồ khác, gặp NPC, săn đúng loại quái / tinh anh, luyện cấp ở bãi phù hợp. Tự bấm "Bỏ qua" hội thoại, tự nhích sang bên khi kẹt vật cản. Các bước mua đồ, mặc đồ, học võ công vẫn cần bạn bấm (script giữ tự đánh trong lúc chờ). Nên bật kèm Tự hồi sinh và Tự bơm máu.</p></div>
      <div class="au-box"><h4>🗝️ Phó bản tự động <span class="mh-tag" data-tag="PB.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${pbLine}</div>
        <div class="mh-row2" style="margin:0 0 6px"><button class="btn primary mh-run ${PB.on ? 'on' : ''}" data-mh-act="pb">${PB.on ? 'Dừng tự đánh phó bản' : 'Tự đánh phó bản'}</button></div>
        ${tg('pb.atk', 'Cho phép script tự bật "Tự động đánh" ở phó bản (mặc định TẮT)')}
        <p class="small muted">Tự tìm Phó Bản Sứ Giả (nhớ vị trí NPC, lần sau đi thẳng; chưa biết thì dò các thành trấn), chọn phó bản còn lượt + vừa cấp (ưu tiên phó bản của nhiệm vụ ngày), rồi vào đánh — nhưng CHỈ vào khi bạn đang bật Tự động đánh hoặc đã tích ô cho phép; đang chết thì nghỉ, thất bại thì đổi cái khác, đứng im 90 giây thì tự ra (mỗi phó bản thử tối đa 3 lần/phiên).</p></div>
      <div class="au-box"><h4>📅 Nhiệm vụ hằng ngày <span class="mh-tag" data-tag="D.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${dailyLine}</div>
        <div class="mh-row2" style="margin:0 0 6px"><button class="btn primary mh-run ${D.on ? 'on' : ''}" data-mh-act="daily">${D.on ? 'Dừng tự làm nhiệm vụ ngày' : 'Tự làm nhiệm vụ hằng ngày'}</button><button class="btn small" data-mh-act="dnow">Nhận thưởng ngay</button></div>
        ${tg('q.daily', 'Tự nhận thưởng khi mục tiêu hằng ngày hoàn thành')}
        <p class="small muted">Ô riêng: phải bấm bật thì mới chạy (mặc định TẮT). Tự đi tới bãi luyện công phù hợp và luyện công cho mục tiêu "hạ quái · tinh anh"; mục tiêu đi tiêu / đập đồ / tỷ thí thì chỉ nhắc vì phải tự bấm. Không giành đường với "Tự làm nhiệm vụ" (bật cái đó thì tạm nghỉ), và tự bấm chiêu của bạn để đánh (không cần bật "Tự động đánh"; hết MP thì đánh thường).</p></div>
      <div class="au-box"><h4>🏮 Nhiệm vụ môn phái <span class="mh-tag" data-tag="SO.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${sectLine}</div>
        <div class="mh-row2" style="margin:0 0 6px"><button class="btn primary mh-run ${SO.on ? 'on' : ''}" data-mh-act="sect">${SO.on ? 'Dừng tự làm nhiệm vụ môn phái' : 'Tự làm nhiệm vụ môn phái'}</button></div>
        <p class="small muted">Về môn phái (Xa Phu miễn phí) nói chuyện NPC có chức năng môn phái (Bang Chủ / Trưởng Môn tuỳ phái) để nhận/trả nhiệm vụ; đi đúng bản đồ để diệt quái · hạ quái tinh anh; "đưa thư" thì tới người nhận; nhiệm vụ "vượt phó bản" thì dùng ô Phó bản. Khi đánh, script tự nhắm đúng quái mà nhiệm vụ ghi tên và tự bấm chiêu của bạn (chiêu mạnh nhất đang sẵn sàng, đủ tầm, đủ MP; hết MP thì đánh thường) — <b>không bật "Tự động đánh"</b> của game. Nếu chưa đứng ở môn phái, AL tự đi qua các bản đồ môn phái để tìm đúng Trưởng Môn; bản đồ không có quái nhiệm vụ thì AL tự sang bản đồ có quái đó. Tự nhường đường khi "Tự làm nhiệm vụ" hoặc phó bản đang chạy.</p></div>
      <div class="au-box"><h4>🧠 AI điều phối <span class="mh-tag" data-tag="AI.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${aiReport()}</div>
        ${tg('ai.on', 'Bật AI tự chữa khi auto bị kẹt (mặc định BẬT)')}
        <p class="small muted">AI dùng chung cho mọi auto: theo dõi bản đồ + vị trí + trạng thái để biết cái nào <b>đứng yên quá 9 giây</b>, rồi tự chữa theo thang — nhích thử → xoá đường cũ tính lại → tạm tránh bản đồ đang kẹt 45 giây (đi đường khác) → nghỉ 30 giây rồi thử lại; kẹt cả lúc đi bộ (đặt đường mà không nhúc nhích 2,6 giây) và lúc chase cũng bị xử lý. Bấm Dừng thì AI cũng được đặt lại.</p></div>
      <div class="au-box"><h4>🛒 Áp tiêu tự động <span class="mh-tag" data-tag="EC.on"></span></h4>
        <div class="small" style="margin-bottom:6px">${escLine}</div>
        <div class="mh-row2" style="margin:0 0 6px"><button class="btn primary mh-run ${EC.on ? 'on' : ''}" data-mh-act="esc">${EC.on ? 'Dừng tự động áp tiêu' : 'Tự động áp tiêu'}</button></div>
        <div class="au-row"><span>Tuyến tiêu</span><select data-mh="ec.tier">
          <option value="" ${!C.ec.tier ? 'selected' : ''}>Tự chọn (cao nhất vừa cấp)</option>
          <option value="dong" ${C.ec.tier === 'dong' ? 'selected' : ''}>Tiêu Đồng</option>
          <option value="bac" ${C.ec.tier === 'bac' ? 'selected' : ''}>Tiêu Bạc</option>
          <option value="vang" ${C.ec.tier === 'vang' ? 'selected' : ''}>Tiêu Vàng</option></select></div>
        ${tg('ec.defend', 'Quái đánh xe thì tự bấm chiêu bảo vệ (không bật "Tự động đánh")')}
        <p class="small muted">Tự tìm Long Môn Tiêu Cục (nhớ NPC; chưa biết thì dò 5 thành trấn), nhận tuyến vừa cấp và đủ tiền cọc, giữ xe sát bên, qua cổng theo lộ trình, tới Phân Đà Tiêu Cục để giao; xe tụt lại thì đợi, xe bị đánh thì tự đánh bằng chiêu của bạn. Tự nhường đường khi "Tự làm nhiệm vụ" hoặc phó bản đang chạy; bấm Dừng là dừng cả áp tiêu.</p></div>
      <div class="au-box"><h4>Đập đồ tự động</h4>
        <div class="au-row"><span>Mặc định đập tới</span><select data-mh="enh.target">${Array.from({ length: G.data.enhance.max }, (_, i) => i + 1).map(v => `<option value="${v}" ${+C.enh.target === v ? 'selected' : ''}>+${v}</option>`).join('')}</select></div>
        ${tg('enh.insure', `Tự dùng Bảo Hiểm Phù từ +${G.data.enhance.safe} (còn ${have('insure')})`)}
        ${tg('enh.safe', 'Dừng khi hết bảo hiểm ở mốc rủi ro')}
        ${tg('enh.stopDrop', 'Dừng ngay nếu bị rớt cấp')}
        <p class="small muted">Tới NPC Thợ Rèn → tab Cường hóa → chọn trang bị, khung "Đập đồ tự động" sẽ hiện ngay dưới nút Cường hóa. Huyền Tinh Thạch: ${have('stone')} · Thiên Tinh Thạch: ${have('stone2')}</p>
        ${E.n ? `<div class="mh-stat"><div>Lần đập<b>${E.n}</b></div><div>Thành công<b>${E.ok}</b></div><div>Thất bại<b>${E.fail}</b></div><div>Đã tốn<b>${fmt(E.gold)}</b></div></div>` : ''}</div>
      <div class="au-box"><h4>Nâng thú cưỡi / pet</h4>${mountBoxHtml(M.id).replace('<h5>Nâng thú cưỡi tự động</h5>', '').replace('class="mh-box"', 'class="mh-box" style="margin-top:0;border:0;background:none;padding:0"')}
        <p class="small muted">Thú cưng Hồng Long hiện chưa có hệ thống cấp, nên phần này nâng thú cưỡi (cho ăn Mã Linh Đan, tự đột phá bằng Long Huyết Thạch).</p></div>
    </div>`;
    bindInputs(body); syncTags(body); bindMount(body);
    body.querySelector('[data-mh-act="quest"]').onclick = () => { setQuest(!Q.on); };
    body.querySelector('[data-mh-act="pb"]').onclick = () => { setPb(!PB.on); };
    body.querySelector('[data-mh-act="daily"]').onclick = () => { setDaily(!D.on); };
    body.querySelector('[data-mh-act="sect"]').onclick = () => { setSect(!SO.on); };
    body.querySelector('[data-mh-act="esc"]').onclick = () => { setEc(!EC.on); };
    body.querySelector('[data-mh-act="dnow"]').onclick = () => { try { emit('daily'); } catch (e) {} setTimeout(() => { try { dailyTick(); } catch (e) {} }, 700); };
  }
  function injectSettings(body) {
    if (body.querySelector('#mh-set') || (window.HNBT && window.HNBT.tab === 'turbo')) return;
    const first = body.querySelector('.card'); if (!first) return;
    const card = document.createElement('div'); card.className = 'card'; card.id = 'mh-set';
    card.innerHTML = `<h4>Trợ thủ tự động <span class="mh-tag" data-tag="rv.on"></span></h4>
      ${tg('rv.on', 'Tự hồi sinh khi bị trọng thương')}
      <div class="au-row"><span>Cách hồi sinh</span><select data-mh="rv.mode"><option value="here" ${C.rv.mode === 'here' ? 'selected' : ''}>Tại chỗ (bằng ngân lượng)</option><option value="town" ${C.rv.mode === 'town' ? 'selected' : ''}>Về thành (miễn phí)</option></select></div>
      ${tg('rv.resume', 'Hồi sinh xong tự bật lại Tự động đánh')}
      <div class="mh-row2"><button class="btn small primary" data-mh-open>Mở Trợ thủ (F8): nhiệm vụ, đập đồ, thú cưỡi</button></div>`;
    first.parentNode.insertBefore(card, first.nextSibling);
    bindInputs(card); syncTags(card);
    card.querySelector('[data-mh-open]').onclick = () => UI.openPanel('helper');
  }
  function refreshHelper() { try { if (isOpen('helper')) UI.refreshPanel(); } catch (e) {} }


  // ======================================================================
  //  GỘP Túi đồ / Võ công / Thú cưỡi vào bảng Nhân vật (4 tab)
  // ======================================================================
  const CG = [['character', 'Nhân vật', '🧍'], ['inventory', 'Túi đồ', '🎒'], ['skills', 'Võ công', '📖'], ['mount', 'Thú cưỡi', '🐎']];
  const CG_IDS = CG.map(x => x[0]);
  let cgLast = (() => { try { return localStorage.getItem('mh_cg') || 'character'; } catch (e) { return 'character'; } })();
  function cgBar() {
    let bar = $('mh-ctabs');
    const box = document.querySelector('#panel .panel-box'), body = $('panel-body');
    if (!box || !body) return null;
    if (!bar) {
      bar = document.createElement('div'); bar.id = 'mh-ctabs';
      bar.innerHTML = CG.map(([k, n, e]) => `<button type="button" data-cg="${k}"><span class="e">${e}</span><span>${n}</span><i class="mh-cdot"></i></button>`).join('');
      bar.querySelectorAll('[data-cg]').forEach(b => b.onclick = () => { if (UI.panelName() !== b.dataset.cg) UI.openPanel(b.dataset.cg); });
    }
    if (bar.parentNode !== box || bar.nextSibling !== body) box.insertBefore(bar, body);
    return bar;
  }
  function cgSync() {
    const p = UI.panelName && UI.panelName(), on = CG_IDS.includes(p) && !$('panel').classList.contains('hidden');
    const box = document.querySelector('#panel .panel-box');
    if (box) box.classList.toggle('mh-cg', on);
    if (!on) { const b = $('mh-ctabs'); if (b) b.style.display = 'none'; return; }
    const bar = cgBar(); if (!bar) return;
    bar.style.display = '';
    if (cgLast !== p) { cgLast = p; try { localStorage.setItem('mh_cg', p); } catch (e) {} }
    bar.querySelectorAll('[data-cg]').forEach(b => {
      b.classList.toggle('on', b.dataset.cg === p);
      const src = document.querySelector(`#menu-buttons [data-panel="${b.dataset.cg}"]`);
      const dot = !!src && [...src.querySelectorAll('.dot')].some(d => !d.classList.contains('hidden'));
      b.classList.toggle('mh-hasdot', dot);
    });
    const t = $('panel-title'); if (t && t.textContent !== '🧍 Nhân Vật') t.textContent = '🧍 Nhân Vật';
  }
  function cgMenu() {
    const mb = $('menu-buttons'); if (!mb) return;
    ['inventory', 'skills', 'mount'].forEach(k => { const b = mb.querySelector(`[data-panel="${k}"]`); if (b && b.style.display !== 'none') b.style.display = 'none'; });
    const c = mb.querySelector('[data-panel="character"]');
    if (c && c.onclick !== cgClick) {
      c.onclick = cgClick;
      c.title = 'Nhân vật · Túi đồ · Võ công · Thú cưỡi (C / I / K / M)';
    }
  }
  function cgClick() {
    const p = UI.panelName();
    if (CG_IDS.includes(p) && !$('panel').classList.contains('hidden')) UI.closePanel();
    else UI.openPanel(CG_IDS.includes(cgLast) ? cgLast : 'character');
  }


  // ======================================================================
  //  GẮN VÀO GAME
  // ======================================================================
  function addMenuButton() {
    const mb = $('menu-buttons'); if (!mb || mb.querySelector('[data-panel="helper"]')) return;
    const b = document.createElement('button'); b.dataset.panel = 'helper'; b.title = 'Trợ thủ tự động (F8)';
    b.innerHTML = '🤖<span>Trợ thủ</span>';
    b.onclick = () => UI.togglePanel('helper');
    const set = mb.querySelector('[data-panel="settings"]'); mb.insertBefore(b, set || null);
  }
  function hook() {
    const UI = window.UI, G = window.G;
    if (!UI || !G || !UI.registerPanel || !UI.refreshPanel || UI.__mh) return !!(UI && UI.__mh);
    UI.__mh = true;
    UI.registerPanel('helper', '🤖 Trợ Thủ Tự Động', renderHelper);
    const wrap = (name, after) => {
      const orig = UI[name]; if (typeof orig !== 'function') return;
      UI[name] = function () { const r = orig.apply(this, arguments); try { after.apply(this, arguments); } catch (e) { console.warn('[MUI helper]', name, e); } return r; };
    };
    wrap('openNpc', d => { npcData = d; afterNpcOpen(); });
    wrap('closePanel', () => { npcData = null; if (E.on) stopEnh('Đã dừng: bảng Thợ Rèn đã đóng', 'bad'); });
    wrap('onEnhance', onEnhanceResult);
    wrap('refreshPanel', () => {
      cgSync();
      const body = $('panel-body'), p = UI.panelName && UI.panelName();
      if (!body) return;
      if (p === 'settings') injectSettings(body);
      else if (p === 'npc') injectEnh(body);
      else if (p === 'mount') injectMount(body);
    });
    wrap('initHud', () => { addMenuButton(); cgMenu(); });
    wrap('openPanel', cgSync); wrap('closePanel', cgSync);
    cgMenu();
    addMenuButton();
    watchDead();
    return true;
  }
  function init() {
    addCss();
    if (!hook()) { const t = setInterval(() => { if (hook()) clearInterval(t); }, 100); setTimeout(() => clearInterval(t), 20000); }
    setInterval(() => {
      if (!window.G) return;
      if (G.me && !G.me.dead) RV.lastAuto = !!G.auto;
      watchDead();
      try { hookXa(); hookTp(); hookBox(); hookClick(); hookMsg(); } catch (e) {}
      try { if (XA.d && window.UI && UI.panelName() === 'npc') xaPaint(); } catch (e) {}   // map mới -> tự vẽ lại
      try { xaBoxPaint(); } catch (e) {}
      try { xaTick(); } catch (e) {}
      try { cgMenu(); cgSync(); } catch (e) {}
      const pn = $('panel'); document.body.classList.toggle('mh-panel', !!pn && !pn.classList.contains('hidden'));
      try { questTick(); } catch (e) { console.warn('[MUI helper] quest', e); }
      try { hookPb(); pbTick(); } catch (e) { console.warn('[MUI helper] dungeon', e); }
      try { hookSect(); sectTick(); } catch (e) { console.warn('[MUI helper] sect', e); }
      try { hookEscort(); escortTick(); } catch (e) { console.warn('[MUI helper] escort', e); }
      try { aiTick(); } catch (e) { console.warn('[MUI helper] ai', e); }
      try { dailySolve(); } catch (e) { console.warn('[MUI helper] daily', e); }
    }, 300);
    setInterval(() => { try { dailyTick(); } catch (e) {} }, 5000);
    window.addEventListener('keydown', e => {
      if (e.code !== 'F8' || !window.UI || !G.inGame) return;
      e.preventDefault(); UI.togglePanel('helper');
    }, true);
    window.MuiHelper = { config: C, quest: setQuest, get state() { return { quest: Q.on, enhance: E.on, mount: M.on, sect: SO.on, escort: EC.on, ai: aiOn(), owner: aiOwner() }; },
      travel: { pathTo, travelTo, bestTraining, tpOk, tpServed, tp: TP, bad: TPBAD, name: MAPNAME, maps: GAMEMAPS },
      xa: { rows: xaRows, html: xaHtml, paint: xaPaint, box: xaBoxPaint, go: xaGo, click: xaClick, hookClick, hookMsg, blocked: XABAD, state: XA, hook: hookXa, hookBox } };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* ===================================================================================
 *  MÔ-ĐUN 4 · NGOẠI HÌNH CHIBI
 * =================================================================================== */
/*
 * Cách hoạt động: game ghép mỗi khung hình nhân vật thành một canvas 144x144 (chân ở y=128).
 * Script bọc Assets.charFrame / riderFrame / weaponGlow, tìm vùng đầu của từng khung rồi vẽ lại:
 * thân nén thấp xuống, đầu phóng to — kết quả được lưu đệm nên không tốn hiệu năng.
 * Chỉ thay đổi hình ảnh trên máy bạn, không gửi gì lên máy chủ. Có thể dùng riêng hoặc cùng script giao diện mới.
 */
(function () {
  'use strict';
  if (window.__VL_CHIBI__) return;
  window.__VL_CHIBI__ = '1.0.0';

  const KEY = 'vl_chibi';
  const DEF = { on: true, head: 'md', scope: 'all' };
  const C = (() => { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, DEF); } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(C)); } catch (e) {} };
  const PRESET = {
    sm: { kh: 1.3, kb: 0.8, kw: 0.96, name: 'Nhẹ' },
    md: { kh: 1.6, kb: 0.66, kw: 0.92, name: 'Vừa' },
    lg: { kh: 1.9, kb: 0.58, kw: 0.88, name: 'Siêu chibi' }
  };
  let ver = 1;                          // đổi cấu hình -> tăng phiên bản để vẽ lại
  let cache = new WeakMap();            // canvas gốc -> { v, c, info }
  const SRC = 144;

  // ---------------- phân tích khung hình: tìm đầu ----------------
  const probe = document.createElement('canvas'); probe.width = probe.height = SRC;
  const pcx = probe.getContext('2d', { willReadFrequently: true });
  function analyze(src, foot) {
    pcx.clearRect(0, 0, SRC, SRC); pcx.drawImage(src, 0, 0);
    const d = pcx.getImageData(0, 0, SRC, SRC).data;
    const A = (x, y) => d[(y * SRC + x) * 4 + 3] > 40;
    // đỉnh đầu: hàng đầu tiên có >= 6 điểm ảnh đặc trong dải giữa (bỏ qua mũi kiếm / đầu gậy mảnh)
    let T = -1;
    for (let y = 2; y < foot - 20 && T < 0; y++) {
      let n = 0; for (let x = 44; x < 100; x++) if (A(x, y)) n++;
      if (n >= 6) T = y;
    }
    if (T < 0) return null;
    // tâm ngang của đầu
    let sx = 0, sn = 0;
    for (let y = T; y < T + 8; y++) for (let x = 40; x < 104; x++) if (A(x, y)) { sx += x; sn++; }
    let cx = sn ? sx / sn : 72;
    const H = Math.max(18, Math.min(30, Math.round((foot - T) * 0.205)));     // chiều cao đầu (gồm cả nón)
    const N = T + H;
    // biên trái/phải của đầu: dải đặc liền mạch chứa tâm, gom qua các hàng của đầu
    let L = 144, R = 0;
    for (let y = T; y <= N; y++) {
      let c = Math.round(cx);
      if (!A(c, y)) { let k = 1; while (k < 8 && !A(c - k, y) && !A(c + k, y)) k++; if (k >= 8) continue; c = A(c - k, y) ? c - k : c + k; }
      let l = c, r = c, gap = 0;
      for (let x = c - 1; x >= 0; x--) { if (A(x, y)) { l = x; gap = 0; } else if (++gap > 1) break; }
      gap = 0;
      for (let x = c + 1; x < SRC; x++) { if (A(x, y)) { r = x; gap = 0; } else if (++gap > 1) break; }
      if (r - l > 44) { l = Math.max(l, c - 22); r = Math.min(r, c + 22); }
      L = Math.min(L, l); R = Math.max(R, r);
    }
    if (R <= L) { L = cx - 12; R = cx + 12; }
    cx = (L + R) / 2;
    return { T, N, L: Math.max(0, L - 1), R: Math.min(SRC, R + 2), cx };
  }

  // ---------------- dựng khung chibi ----------------
  function chibify(src, state) {
    if (!src || !src.width || src.width !== SRC) return src;
    const st = String(state || '');
    if (st === 'dead') return src;
    const hit = cache.get(src); if (hit && hit.v === ver) return hit.c;
    const P = PRESET[C.head] || PRESET.md;
    const F = st.startsWith('ride') ? 99 : 128;          // điểm neo: chân (đứng) hoặc hông (khi cưỡi)
    const info = analyze(src, F);
    if (!info) return src;
    const out = document.createElement('canvas'); out.width = out.height = SRC;
    const x = out.getContext('2d');
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    // phần dưới điểm neo (bóng, chân khi cưỡi) giữ nguyên
    x.drawImage(src, 0, F, SRC, SRC - F, 0, F, SRC, SRC - F);
    // toàn thân phía trên nén theo chiều dọc, neo ở F (rộng giữ nguyên -> trông mập mạp hơn)
    const kb = P.kb, kw = P.kw;
    x.drawImage(src, 0, 0, SRC, F, 72 - 72 * kw, F - F * kb, SRC * kw, F * kb);
    // đầu phóng to, neo cằm vào vị trí cổ mới
    const { T, N, L, R, cx } = info, kh = P.kh;
    const pad = 3, hy = Math.max(0, T - pad), hh = N + 1 - hy, hw = R - L;
    const neck = F - (F - N) * kb + 2;                  // cổ sau khi nén thân (+2 cho đầu đè lên cổ áo)
    const ncx = 72 - (72 - cx) * kw;
    let dh = hh * kh, dw = hw * kh, dy = neck - dh, dx = ncx - (cx - L) * kh;
    if (dy < 1) { const s = (neck - 1) / dh; dh *= s; dw *= s; dy = 1; dx = ncx - (cx - L) * kh * s; }
    x.drawImage(src, L, hy, hw, hh, dx, dy, dw, dh);
    cache.set(src, { v: ver, c: out });
    return out;
  }

  // ---------------- phạm vi: tất cả / chỉ nhân vật của tôi ----------------
  const sameAp = (a, b) => { if (a === b) return true; if (!a || !b) return !a && !b; try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; } };
  function applies(cls, ap) {
    if (!C.on) return false;
    if (C.scope !== 'me') return true;
    const me = window.G && G.me; if (!me) return true;     // màn hình chọn / tạo nhân vật
    return cls === me.cls && sameAp(ap, me.ap);
  }

  // ---------------- bọc hàm vẽ của game ----------------
  function hook() {
    const A = window.Assets;
    if (!A || typeof A.charFrame !== 'function' || A.__chibi) return !!(A && A.__chibi);
    A.__chibi = true;
    const cf = A.charFrame, rf = A.riderFrame, wg = A.weaponGlow;
    A.charFrame = function (cls, dir, state, i, ap) {
      const f = cf.apply(this, arguments);
      return applies(cls, ap) ? chibify(f, state) : f;
    };
    if (typeof rf === 'function') A.riderFrame = function (cls, dir, state, i, ap) {
      const f = rf.apply(this, arguments);
      return applies(cls, ap) ? chibify(f, 'ride') : f;
    };
    if (typeof wg === 'function') A.weaponGlow = function (cls, dir, state, i, color, ap) {
      const f = wg.apply(this, arguments);
      if (!f || !applies(cls, ap)) return f;
      // quầng sáng vũ khí: dùng cùng phép biến đổi với khung nhân vật tương ứng
      const base = cf.call(A, cls, dir, state, i, ap);
      const info = base && cache.get(base);
      return info && info.v === ver ? transformLike(f, base, state) : chibify(f, state);
    };
    return true;
  }
  // quầng sáng không có đầu rõ ràng -> lấy thông số đầu từ khung nhân vật
  function transformLike(glow, base, state) {
    const hit = cache.get(glow); if (hit && hit.v === ver) return hit.c;
    const st = String(state || ''), F = st.startsWith('ride') ? 99 : 128, P = PRESET[C.head] || PRESET.md;
    const info = analyze(base, F); if (!info) return glow;
    const out = document.createElement('canvas'); out.width = out.height = SRC;
    const x = out.getContext('2d'); x.imageSmoothingEnabled = true;
    x.drawImage(glow, 0, F, SRC, SRC - F, 0, F, SRC, SRC - F);
    x.drawImage(glow, 0, 0, SRC, F, 72 - 72 * P.kw, F - F * P.kb, SRC * P.kw, F * P.kb);
    cache.set(glow, { v: ver, c: out });
    return out;
  }

  function refresh() {
    ver++; cache = new WeakMap();
    try {
      if (window.UI) {
        if (UI.panelName && UI.panelName()) UI.refreshPanel();
        if (window.G && G.me && UI.updateHud) UI.updateHud();
      }
    } catch (e) {}
  }

  // ---------------- công tắc trong Cài đặt ----------------
  const css = `
  .vlc-card .vlc-seg{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
  .vlc-card .vlc-seg button{flex:1 1 0;min-width:84px}
  .vlc-card .vlc-seg button.on{outline:2px solid currentColor;outline-offset:-2px}
  .vlc-card .vlc-prev{display:flex;gap:10px;align-items:flex-end;justify-content:center;padding:6px 0 2px;min-height:108px}
  .vlc-card .vlc-prev canvas{width:96px;height:96px;image-rendering:auto}
  .vlc-card .vlc-prev small{display:block;text-align:center;font-size:11px;opacity:.7}
  .vlc-card .vlc-row{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:13px;cursor:pointer}
  .vlc-card .vlc-row input{width:18px;height:18px}
  .vlc-card.off .vlc-opts{opacity:.45;pointer-events:none}
  `;
  function addCss() { if (document.getElementById('vlc-style')) return; const s = document.createElement('style'); s.id = 'vlc-style'; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function previewFrame(chibi) {
    const A = window.Assets, me = window.G && G.me; if (!A || !me || !A.has || !A.has(me.cls)) return null;
    const old = C.on; C.on = chibi;
    let f; try { f = A.charFrame(me.cls, 0, 'idle', 0, me.ap); } finally { C.on = old; }
    return f;
  }
  function drawPreview(card) {
    const box = card.querySelector('.vlc-prev'); if (!box) return;
    const a = previewFrame(false), b = previewFrame(true);
    if (!a) { box.style.display = 'none'; return; }
    box.style.display = '';
    box.querySelectorAll('canvas').forEach((cv, k) => {
      const x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height); x.imageSmoothingEnabled = true;
      x.drawImage(k ? b : a, 18, 18, 108, 108, 0, 0, cv.width, cv.height);
    });
  }
  function cardHtml() {
    return `<h4>Ngoại hình Chibi</h4>
      <label class="vlc-row"><input type="checkbox" data-vlc="on" ${C.on ? 'checked' : ''}><span>Đổi nhân vật thành dạng chibi (đầu to, thân ngắn)</span></label>
      <div class="vlc-opts">
        <div class="vlc-prev"><div><canvas width="96" height="96"></canvas><small>Gốc</small></div><div><canvas width="96" height="96"></canvas><small>Chibi</small></div></div>
        <div class="small">Độ chibi</div>
        <div class="vlc-seg">${Object.keys(PRESET).map(k => `<button type="button" class="btn small ${C.head === k ? 'on primary' : ''}" data-vlc-head="${k}">${PRESET[k].name}</button>`).join('')}</div>
        <div class="small" style="margin-top:8px">Áp dụng cho</div>
        <div class="vlc-seg">
          <button type="button" class="btn small ${C.scope === 'all' ? 'on primary' : ''}" data-vlc-scope="all">Tất cả nhân vật</button>
          <button type="button" class="btn small ${C.scope === 'me' ? 'on primary' : ''}" data-vlc-scope="me">Chỉ nhân vật của tôi</button>
        </div>
        <p class="small muted" style="margin:8px 0 0">Chỉ thay đổi hình ảnh trên máy của bạn, người chơi khác vẫn thấy ngoại hình gốc.</p>
      </div>`;
  }
  function bindCard(card) {
    card.classList.toggle('off', !C.on);
    card.querySelector('[data-vlc="on"]').onchange = e => { C.on = e.target.checked; save(); card.classList.toggle('off', !C.on); refresh(); drawPreview(card); };
    card.querySelectorAll('[data-vlc-head]').forEach(b => b.onclick = () => { C.head = b.dataset.vlcHead; save(); refresh(); rerender(card); });
    card.querySelectorAll('[data-vlc-scope]').forEach(b => b.onclick = () => { C.scope = b.dataset.vlcScope; save(); refresh(); rerender(card); });
    drawPreview(card);
    setTimeout(() => drawPreview(card), 400);
  }
  function rerender(card) {
    const c2 = document.getElementById('vlc-card') || card;
    c2.innerHTML = cardHtml(); bindCard(c2);
  }
  function injectSettings() {
    const body = document.getElementById('panel-body'); if (!body || document.getElementById('vlc-card') || (window.HNBT && window.HNBT.tab === 'turbo')) return;
    const cards = body.querySelectorAll('.card'); if (!cards.length) return;
    const card = document.createElement('div'); card.className = 'card vlc-card'; card.id = 'vlc-card';
    card.innerHTML = cardHtml();
    // đặt ngay trước khung "Hiển thị & âm thanh" nếu có, không thì sau khung đầu tiên
    const disp = [...cards].find(c => /Hiển thị/i.test(c.textContent.slice(0, 40)));
    if (disp) disp.parentNode.insertBefore(card, disp); else cards[0].parentNode.insertBefore(card, cards[0].nextSibling);
    bindCard(card);
  }
  function hookUI() {
    const UI = window.UI;
    if (!UI || typeof UI.refreshPanel !== 'function' || UI.__chibi) return !!(UI && UI.__chibi);
    UI.__chibi = true;
    const orig = UI.refreshPanel;
    UI.refreshPanel = function () {
      const r = orig.apply(this, arguments);
      try { if (UI.panelName && UI.panelName() === 'settings') injectSettings(); } catch (e) { console.warn('[Chibi]', e); }
      return r;
    };
    return true;
  }

  function boot() {
    addCss();
    const t = setInterval(() => { const a = hook(), b = hookUI(); if (a && b) clearInterval(t); }, 50);
    setTimeout(() => clearInterval(t), 30000);
  }
  window.VLChibi = { config: C, set(k, v) { C[k] = v; save(); refresh(); } };
  // bọc thật sớm để cả màn hình chọn / tạo nhân vật cũng thành chibi
  hook();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
