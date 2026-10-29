/*  BẢN DÁN VÀO APK — AppMint / FreeWebToApk / WebToApk
 *  Không cần header userscript. Dán TOÀN BỘ file này vào ô JavaScript (ô dưới cùng).
 *  Võ Lâm 2D · Giữ chạy nền v1.2.0 — Lemon Code
 *  Nhớ build lại APK và tick: Access > Background > "Keep running in background",
 *  cùng "Ask to skip battery optimisation directly" + bật Thông báo cho app.
 */

/*  Võ Lâm 2D · Giữ chạy nền (Keep-Alive)  —  Lemon Code
 *  Làm game "tưởng" vẫn đang được nhìn: giữ màn hình sáng, giả trạng thái đang hiện,
 *  chặn sự kiện ẩn, và tự bơm vòng requestAnimationFrame bằng đồng hồ riêng.
 */
(function () {
  'use strict';
  if (window.__VL_KEEPALIVE__) { return; }
  window.__VL_KEEPALIVE__ = true;

  var LS_ON = 'vl_keepalive_on', LS_POS = 'vl_keepalive_pos';
  var BLOCK = ['visibilitychange', 'webkitvisibilitychange', 'blur', 'pagehide', 'freeze'];
  var doc = document, win = window;
  var docProto = Document.prototype, winProto = Window.prototype;

  var nativeHidden = getDesc(docProto, 'hidden');
  var nativeVis = getDesc(docProto, 'visibilityState');
  var nativeFocus = docProto.hasFocus;
  var nativeRAF = win.requestAnimationFrame ? win.requestAnimationFrame.bind(win) : null;
  var nativeCAF = win.cancelAnimationFrame ? win.cancelAnimationFrame.bind(win) : null;
  var nativeAdd = EventTarget.prototype.addEventListener;
  var nativeRemove = EventTarget.prototype.removeEventListener;
  var nativeOnVis = getDesc(docProto, 'onvisibilitychange');
  var nativeOnBlur = getDesc(winProto, 'onblur');
  var nativeOnHide = getDesc(winProto, 'onpagehide');
  var nativeOnFreeze = getDesc(docProto, 'onfreeze');

  var on = false;                    // công tắc chính
  var patched = false, blocked = 0, note = 'chưa bật', quiet = true;
  var wake = null, audio = null, worker = null, badge = null, badgeText = null;
  var rafQ = [], rafSeq = 0, token = 0, timer = 0, rafId = 0, last = 0, revives = 0;
  var drains = 0, ticks = 0, enq = 0, wmsgs = 0;
  var ranFrames = 0, fps = 0, fpsAt = 0;
  var nat = { service: 'chưa gọi', keep: 'chưa thử', doze: 'chưa rõ', lastStart: 0 };

  function getDesc(proto, prop) { try { return Object.getOwnPropertyDescriptor(proto, prop); } catch (e) { return null; } }
  function realHidden() { try { return nativeHidden && nativeHidden.get ? !!nativeHidden.get.call(doc) : false; } catch (e) { return false; } }
  function realState() { try { return nativeVis && nativeVis.get ? String(nativeVis.get.call(doc)) : 'visible'; } catch (e) { return 'visible'; } }
  function say() { if (quiet) return; try { console.log.apply(console, ['[Giữ nền]'].concat([].slice.call(arguments))); } catch (e) {} }

  function isPageTarget(t) {
    return t === win || t === doc || t === docProto || t === winProto ||
      (typeof Window !== 'undefined' && t instanceof Window) ||
      (typeof Document !== 'undefined' && t instanceof Document) ||
      (t && t.nodeType === 9);
  }

  // ---------- 1. giả trạng thái "đang hiện" + chặn sự kiện ẩn ----------
  function patch() {
    if (patched) return;
    patched = true;
    try {
      define(docProto, 'hidden', function () { return on ? false : (nativeHidden && nativeHidden.get ? nativeHidden.get.call(this) : false); });
      define(docProto, 'visibilityState', function () { return on ? 'visible' : (nativeVis && nativeVis.get ? nativeVis.get.call(this) : 'visible'); });
      define(docProto, 'webkitHidden', function () { return on ? false : (nativeHidden && nativeHidden.get ? nativeHidden.get.call(this) : false); });
      define(docProto, 'webkitVisibilityState', function () { return on ? 'visible' : (nativeVis && nativeVis.get ? nativeVis.get.call(this) : 'visible'); });
      Object.defineProperty(docProto, 'hasFocus', {
        configurable: true,
        get: function () { return function () { return on ? true : (nativeFocus ? nativeFocus.call(this) : true); }; },
        set: function () {}
      });
    } catch (e) { say('không giả được trạng thái ẩn:', e.message); }
    silence(docProto, 'onvisibilitychange', nativeOnVis);
    silence(winProto, 'onblur', nativeOnBlur);
    silence(winProto, 'onpagehide', nativeOnHide);
    silence(docProto, 'onfreeze', nativeOnFreeze);

    EventTarget.prototype.addEventListener = function (type, fn, opt) {
      if (on && BLOCK.indexOf(type) >= 0 && isPageTarget(this)) {
        blocked++; paint();
        say('chặn listener "' + type + '" của game');
        return;
      }
      return nativeAdd.call(this, type, fn, opt);
    };
    EventTarget.prototype.removeEventListener = function (type, fn, opt) {
      return nativeRemove.call(this, type, fn, opt);
    };
    say('đã vá trạng thái ẩn + addEventListener');
  }
  function define(proto, prop, getter) {
    try { Object.defineProperty(proto, prop, { configurable: true, get: getter, set: function () {} }); } catch (e) {}
  }
  function silence(proto, prop, orig) {
    try {
      Object.defineProperty(proto, prop, {
        configurable: true,
        get: function () { return on ? function () {} : (orig && orig.get ? orig.get.call(this) : null); },
        set: function (v) { if (on) { blocked++; paint(); say('chặn gán ' + prop); return; } if (orig && orig.set) orig.set.call(this, v); }
      });
    } catch (e) {}
  }

  // ---------- 2. tự nuôi vòng requestAnimationFrame ----------
  // Lỗi gốc: khi trang bị ẩn, trình duyệt vứt callback rAF đang chờ -> chuỗi rAF đứt,
  // game đứng vĩnh viễn. Vì vậy ta giữ hàng đợi riêng và tự bơm bằng đồng hồ riêng.
  function enqueue(cb) { enq++; rafQ.push({ id: ++rafSeq, cb: cb }); return rafSeq; }
  function clearPending() {
    if (timer) { clearTimeout(timer); timer = 0; }
    if (rafId && nativeCAF) { try { nativeCAF(rafId); } catch (e) {} rafId = 0; }
  }
  function drain() {
    drains++;
    if (!rafQ.length) return;
    var t = 0; try { t = performance.now(); } catch (e) {}
    var batch = rafQ.splice(0, rafQ.length);
    ranFrames += batch.length;
    for (var i = 0; i < batch.length; i++) { try { batch[i].cb(t); } catch (e) {} }
  }
  function arm() {
    var my = ++token;
    var fire = function () { if (my === token) pump(); };
    // có việc thì 16ms (≈60 hình/giây); rảnh thì 100ms cho đỡ tốn pin —
    // ai gọi rAF tiếp sẽ được bơm ngay lập tức ở trong patchRAF().
    timer = setTimeout(fire, rafQ.length ? 16 : 100);   // nguồn chính, không phụ thuộc rAF
    if (nativeRAF && !realHidden()) {                   // khi đang hiện: thêm nhịp vsync cho mượt
      try { rafId = nativeRAF(fire); } catch (e) { rafId = 0; }
    }
  }
  function pump() {
    if (!on) return;
    var now = Date.now();
    if (now - last < 12) return;   // ~tối đa 83 hình/giây, không chạy vượt nhịp
    last = now;
    clearPending();
    ticks++;
    drain();
    arm();
  }
  function patchRAF() {
    if (!nativeRAF) return;
    win.requestAnimationFrame = function (cb) {
      if (!on) return nativeRAF(cb);
      var id = enqueue(cb);
      if (Date.now() - last > 60) pump();
      return id;
    };
    win.cancelAnimationFrame = function (id) {
      for (var i = 0; i < rafQ.length; i++) if (rafQ[i].id === id) { rafQ.splice(i, 1); return; }
      if (nativeCAF) nativeCAF(id);
    };
  }
  // Lưới an toàn: setInterval vẫn nổ kể cả khi chuỗi setTimeout/rAF bị treo.
  var WD = setInterval(function () {
    if (!on) return;
    if (Date.now() - last > 100) { revives++; pump(); }
    var now = Date.now();
    if (now - fpsAt >= 1000) { fps = Math.round(ranFrames * 1000 / Math.max(1, now - fpsAt)); ranFrames = 0; fpsAt = now; paint(); }
  }, 200);

  function startWorker() {
    if (worker) return;
    try {
      worker = new Worker(URL.createObjectURL(new Blob(['var n=0;setInterval(function(){postMessage(n++)},16);'], { type: 'text/javascript' })));
      // worker chỉ là NGUỒN ĐÁNH THỨC, không tự bơm: nếu để nó bơm song song
      // thì vòng lặp game chạy gấp đôi số hình/giây.
      worker.onmessage = function () { wmsgs++; if (on && Date.now() - last > 100) pump(); };
      say('worker nhịp tim: chạy');
    } catch (e) { worker = null; say('không tạo được worker (CSP?)'); }
  }

  // ---------- 3. giữ màn hình sáng ----------
  function askWake() {
    if (!on) return;
    if (realHidden()) { note = 'đang ẩn — chỉ xin được wake lock khi đang hiện'; paint(); return; }
    if (!navigator.wakeLock || !navigator.wakeLock.request) { note = 'không có wakeLock — dùng API native'; keepAwakeNoiBo(); paint(); return; }
    if (wake && !wake.released) { note = 'màn hình đang được giữ sáng'; paint(); return; }
    try {
      navigator.wakeLock.request('screen').then(function (s) {
        wake = s; note = 'màn hình đang được giữ sáng';
        s.addEventListener('release', function () { wake = null; paint(); });
        paint();
      })['catch'](function (e) {
        note = 'wakeLock bị từ chối — dùng API native';
        keepAwakeNoiBo();          // WebView không cho wakeLock → nhờ app giữ sáng giùm
        paint();
      });
    } catch (e) { note = 'wakeLock lỗi: ' + e.message; paint(); }
  }

  // ---------- 4. audio giữ tỉnh (không nghe thấy) ----------
  function startAudio() {
    if (!on || audio) return;
    try {
      var AC = win.AudioContext || win.webkitAudioContext;
      if (!AC) return;
      var ctx = new AC(), osc = ctx.createOscillator(), g = ctx.createGain();
      g.gain.value = 0.000001;
      osc.frequency.value = 40;
      osc.connect(g); g.connect(ctx.destination);
      osc.start();
      if (ctx.state === 'suspended') ctx.resume();
      audio = { ctx: ctx, osc: osc, gain: g };
      say('audio giữ tỉnh: ' + ctx.state);
      paint();
    } catch (e) { say('audio lỗi:', e.message); }
  }
  function resumeAudio() { try { if (audio && audio.ctx.state !== 'running') audio.ctx.resume(); } catch (e) {} }
  function stopAudio() {
    if (!audio) return;
    try { audio.osc.stop(); } catch (e) {}
    try { audio.ctx.suspend(); } catch (e) {}   // suspend, không close: tránh làm chết đồng hồ trang
    audio = null; paint();
  }

  // ---------- 5. bật / tắt ----------
  function enable(beQuiet) {
    quiet = !!beQuiet;
    on = true; save();
    patch(); patchRAF(); startWorker();
    last = 0; pump();
    askWake(); startAudio(); keepAwakeNoiBo(); nat.lastStart = Date.now(); startService(); hoiDoze();
    try {
      win.dispatchEvent(new Event('focus'));
      doc.dispatchEvent(new Event('visibilitychange'));
    } catch (e) {}
    paint(); say('BẬT');
  }
  function disable() {
    on = false; save(); token++;
    clearPending(); rafQ.length = 0;
    if (worker) { try { worker.terminate(); } catch (e) {} worker = null; }
    if (wake) { try { wake.release(); } catch (e) {} wake = null; }
    stopAudio();
    try { var KA2 = win.Capacitor && win.Capacitor.Plugins && win.Capacitor.Plugins.KeepAwake; if (KA2 && KA2.allowSleep) KA2.allowSleep(); } catch (e) {}
    if (win.appmintNative && typeof win.appmintNative.keepAwake === 'function') { try { var z = win.appmintNative.keepAwake(false); if (z && z.then) z.then(function () {}, function () {}); } catch (e) {} }
    keepAwakeNativeOff();
    paint(); say('TẮT — trả lại trạng thái thật (' + realState() + ')');
  }
  function save() { try { localStorage.setItem(LS_ON, on ? '1' : '0'); } catch (e) {} }

  // ---------- 6. cầu nối sang APK (WebToApk / AppMint) ----------
  // Đây mới là thứ giữ cho app KHÔNG bị Android tạm dừng khi tắt màn hình:
  // một dịch vụ chạy nền thật (foreground service) + xin bỏ qua tiết kiệm pin.
  function wta() { return win.WebToApk && typeof win.WebToApk === 'object' ? win.WebToApk : null; }
  function keepAwakeNoiBo() {
    var kq = 'không có API native';
    try {
      var KA = win.Capacitor && win.Capacitor.Plugins && win.Capacitor.Plugins.KeepAwake;
      if (KA && typeof KA.keepAwake === 'function') {
        kq = 'Capacitor.KeepAwake: đang xin…';
        var r = KA.keepAwake();
        if (r && r.then) r.then(function (v) {
          nat.keep = v === false ? 'Capacitor.KeepAwake TỪ CHỐI' : 'Capacitor.KeepAwake: ĐANG GIỮ SÁNG';
          paint();
        }, function (e) {
          nat.keep = 'Capacitor.KeepAwake lỗi: ' + (e && (e.message || e.errorMessage) ? (e.message || e.errorMessage) : e);
          paint();
        });
      }
      if (win.appmintNative && typeof win.appmintNative.keepAwake === 'function') {
        kq = 'appmintNative.keepAwake: đang xin…';
        var q = win.appmintNative.keepAwake(true);
        if (q && q.then) q.then(function (v) { nat.keep = v === false ? 'appmintNative TỪ CHỐI' : 'appmintNative: ĐANG GIỮ SÁNG'; paint(); }, function () {});
      }
      if (win.Android && typeof win.Android.keepScreenOn === 'function') { win.Android.keepScreenOn(true); kq = 'Android.keepScreenOn đã gọi'; }
    } catch (e) { kq = 'lỗi: ' + e.message; }
    nat.keep = kq;
    paint();
    return kq;
  }
  function startService() {
    var b = wta();
    if (!b || typeof b.startBackgroundService !== 'function') { nat.service = 'không phải app APK (đang ở trình duyệt)'; paint(); return nat.service; }
    try {
      var r = JSON.parse(b.startBackgroundService(JSON.stringify({
        title: 'Võ Lâm 2D · đang chạy nền', text: 'Giữ game chạy khi ẩn', stopLabel: 'Dừng', keepAfterSwipe: true
      })));
      if (r && r.ok) nat.service = 'đang chạy · thông báo: ' + (r.notificationShown ? 'có' : 'bị tắt');
      else nat.service = 'bị chối: ' + (r && r.reason ? r.reason : 'không rõ') +
        (r && r.reason === 'not_enabled' ? ' — phải build lại APK và tick "Keep running in background"' : '');
    } catch (e) { nat.service = 'lỗi: ' + e.message; }
    paint(); return nat.service;
  }
  function updateService(text) {
    var b = wta();
    if (!b || typeof b.updateBackgroundService !== 'function') return;
    try { b.updateBackgroundService(JSON.stringify({ title: 'Võ Lâm 2D · đang chạy nền', text: text, stopLabel: 'Dừng' })); } catch (e) {}
  }
  function stopService() {
    var b = wta();
    if (!b || typeof b.stopBackgroundService !== 'function') return nat.service;
    try { b.stopBackgroundService(); nat.service = 'đã dừng theo yêu cầu'; } catch (e) { nat.service = 'lỗi: ' + e.message; }
    paint(); return nat.service;
  }
  function hoiDoze() {
    var b = wta();
    nat.doze = (b && typeof b.isIgnoringBatteryOptimizations === 'function')
      ? (b.isIgnoringBatteryOptimizations() ? 'đã bỏ qua (tốt)' : 'CHƯA bỏ qua — máy dễ ngủ đông')
      : 'không phải app APK';
    paint(); return nat.doze;
  }
  function xinDoze() {
    var b = wta();
    if (!b || typeof b.requestIgnoreBatteryOptimizations !== 'function') return nat.doze;
    try { nat.doze = 'đã mở yêu cầu: ' + b.requestIgnoreBatteryOptimizations(); } catch (e) { nat.doze = 'lỗi: ' + e.message; }
    paint(); return nat.doze;
  }
  function wireNative() {
    if (!wta()) return;
    nativeAdd.call(win, 'appmint:background-service', function (e) {
      var d = (e && e.detail) || {};
      nat.service = d.state === 'running' ? 'đang chạy' : ('đã dừng: ' + (d.reason || d.state));
      if (d.state === 'stopped' && on && d.reason !== 'user' && Date.now() - nat.lastStart > 5000) { nat.lastStart = Date.now(); startService(); }
      paint();
    });
  }
  function keepAwakeNativeOff() { nat.keep = 'đã nhả (tắt)'; }
  function batHet() { keepAwakeNoiBo(); nat.lastStart = Date.now(); startService(); xinDoze(); askWake(); startAudio(); return nat; }
  // ---------- bảng nhỏ ----------
  function makeBadge() {
    badge = doc.createElement('div');
    badge.id = 'vl-keepalive-badge';
    badge.style.cssText = 'position:fixed;z-index:2147483000;right:10px;top:10px;padding:5px 9px;border-radius:12px;' +
      'font:700 12px/1.2 system-ui,Arial;color:#fff;background:#1b2233ee;border:1px solid #ffffff33;' +
      'box-shadow:0 4px 14px #0008;cursor:grab;user-select:none;touch-action:none';
    badgeText = doc.createElement('span');
    badge.appendChild(badgeText);
    var pos = null; try { pos = JSON.parse(localStorage.getItem(LS_POS) || 'null'); } catch (e) {}
    if (pos && typeof pos.x === 'number') { badge.style.left = pos.x + 'px'; badge.style.top = pos.y + 'px'; badge.style.right = 'auto'; }
    var drag = null;
    function down(e) { var p = e.touches ? e.touches[0] : e; drag = { x: p.clientX, y: p.clientY, moved: false, at: Date.now(), l: badge.offsetLeft, t: badge.offsetTop }; badge.style.cursor = 'grabbing'; if (e.cancelable) e.preventDefault(); }
    function move(e) {
      if (!drag) return;
      var p = e.touches ? e.touches[0] : e, dx = p.clientX - drag.x, dy = p.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      badge.style.left = Math.max(0, Math.min(win.innerWidth - badge.offsetWidth, drag.l + dx)) + 'px';
      badge.style.top = Math.max(0, Math.min(win.innerHeight - badge.offsetHeight, drag.t + dy)) + 'px';
      badge.style.right = 'auto';
      if (e.cancelable) e.preventDefault();
    }
    function up() {
      if (!drag) return;
      badge.style.cursor = 'grab';
      if (!drag.moved) {
        if (Date.now() - drag.at > 600) panel();      // giữ lâu = mở bảng chẩn đoán
        else { on ? disable() : enable(false); }
      }
      else { try { localStorage.setItem(LS_POS, JSON.stringify({ x: badge.offsetLeft, y: badge.offsetTop })); } catch (e) {} }
      drag = null;
    }
    badge.addEventListener('mousedown', down); badge.addEventListener('touchstart', down, { passive: false });
    win.addEventListener('mousemove', move); win.addEventListener('touchmove', move, { passive: false });
    win.addEventListener('mouseup', up); win.addEventListener('touchend', up);
    (doc.body || doc.documentElement).appendChild(badge);
    paint();
  }
  function paint() {
    if (!badge || !badgeText) return;
    badgeText.textContent = (on ? '🌙 NỀN BẬT ' + fps + 'fps' : '🌙 NỀN TẮT') +
      (wake && !wake.released ? ' 🟢' : ' ⚪') + (audio ? '🔵' : '⚪') +
      (on && nat.service.indexOf('đang chạy') < 0 ? ' ⚠' : '');
    badge.style.borderColor = on ? (nat.service.indexOf('đang chạy') >= 0 ? '#22c55eaa' : '#f59e0baa') : '#ffffff33';
  }
  function panel() {
    var p = doc.getElementById('vl-keepalive-panel');
    if (!p) {
      p = doc.createElement('div');
      p.id = 'vl-keepalive-panel';
      p.style.cssText = 'position:fixed;z-index:2147483001;left:8px;bottom:8px;max-width:92vw;padding:10px 12px;' +
        'border-radius:12px;background:#0f1420f2;color:#e6e9f0;font:12px/1.5 system-ui,Arial;border:1px solid #ffffff2a;' +
        'box-shadow:0 10px 30px #000a;white-space:pre-wrap';
      (doc.body || doc.documentElement).appendChild(p);
    }
    while (p.firstChild) p.removeChild(p.firstChild);
    var d = status();
    var txt = doc.createElement('div');
    txt.textContent = 'VÕ LÂM 2D · CHẨN ĐOÁN NỀN\n' +
      'Công tắc: ' + (d.on ? 'BẬT' : 'TẮT') + '   · hình/giây: ' + fps + (fps === 0 && d.on ? '  (0 = game đang đứng!)' : '') + '\n' +
      'Bộ bơm rAF: ' + d.nhipPump + ' nhịp · tự hồi sinh: ' + d.hoiSinh + ' · hàng đợi: ' + d.hangDoi + '\n' +
      'Chặn sự kiện ẩn: ' + d.chanListener + ' listener\n' +
      'Giữ sáng (web): ' + (d.manHinhSang ? 'CÓ' : 'KHÔNG') + ' — ' + d.ghiChu + '\n' +
      'Giữ sáng (native): ' + d.giuSangNative + '\n' +
      'Dịch vụ chạy nền (APK): ' + d.dichVuNen + '\n' +
      'Bỏ qua tiết kiệm pin: ' + d.doze + '\n' +
      'Hệ điều hành coi trang là ẩn: ' + (d.that_su_an ? 'CÓ' : 'không') + '\n' +
      'worker nhịp tim: ' + d.workerMsg + ' tin';
    p.appendChild(txt);
    var bar = doc.createElement('div');
    bar.style.cssText = 'margin-top:8px;display:flex;gap:6px;flex-wrap:wrap';
    function nut(nhan, fn, mau) {
      var b = doc.createElement('button');
      b.textContent = nhan;
      b.style.cssText = 'padding:6px 10px;border-radius:9px;border:1px solid #ffffff33;background:' + (mau || '#1d2637') + ';color:#fff;font:700 12px system-ui';
      b.addEventListener('click', function (ev) { ev.stopPropagation(); ev.preventDefault(); fn(); panel(); }, true);
      bar.appendChild(b);
    }
    nut('⚡ SỬA NỀN NGAY', batHet, '#166534');
    nut('⏹ Dừng dịch vụ', function () { stopService(); }, '#7f1d1d');
    nut('🔁 Tải lại', function () { location.reload(); });
    nut('Đóng', function () { var q = doc.getElementById('vl-keepalive-panel'); if (q && q.parentNode) q.parentNode.removeChild(q); });
    p.appendChild(bar);
  }

  function status() {
    return {
      on: on, manHinhSang: !!(wake && !wake.released), audio: !!audio, worker: !!worker,
      chanListener: blocked, hoiSinh: revives, ghiChu: note,
      that_su_an: realHidden(), hangDoi: rafQ.length, nhipPump: ticks, soLanDrain: drains, fps: fps,
      dichVuNen: nat.service, giuSangNative: nat.keep, doze: nat.doze,
      soLanXin: enq, workerMsg: wmsgs,
      game_thay: { hidden: doc.hidden, visibilityState: doc.visibilityState, hasFocus: doc.hasFocus() }
    };
  }

  var booted = false;
  function boot() {
    if (booted) return;
    if (!doc.body && !doc.documentElement) { setTimeout(boot, 50); return; }
    booted = true;
    makeBadge();
    if (on) { startWorker(); last = 0; pump(); askWake(); startAudio(); keepAwakeNoiBo(); nat.lastStart = Date.now(); startService(); paint(); say('BẬT (từ lúc nạp trang)'); }
    else paint();
    wireNative(); hoiDoze();
    nativeAdd.call(doc, 'visibilitychange', function () { if (on && !realHidden()) { askWake(); keepAwakeNoiBo(); } });
    var nudge = function () { if (!on) return; startAudio(); resumeAudio(); askWake(); };
    win.addEventListener('pointerdown', nudge, { passive: true });
    win.addEventListener('touchstart', nudge, { passive: true });
    setInterval(function () {
      if (!on) return;
      askWake(); resumeAudio(); keepAwakeNoiBo();
      if (nat.service.indexOf('đang chạy') < 0 && Date.now() - nat.lastStart > 30000) { nat.lastStart = Date.now(); startService(); }
      updateService(fps + ' hình/giây · vẫn đang chạy');
    }, 15000);
  }

  try { on = localStorage.getItem(LS_ON) !== '0'; } catch (e) { on = true; }
  patch(); patchRAF();
  if (doc.readyState === 'loading') nativeAdd.call(doc, 'DOMContentLoaded', boot); else boot();

  window.VL_GIUNEN = {
    get on() { return on; },
    enable: function () { enable(false); },
    disable: disable,
    status: status,
    batHet: batHet, chanDoan: panel, dungDichVu: stopService,
    test: function () {
      var before = blocked, f = function () {};
      nativeAdd.call(doc, 'visibilitychange', f); nativeRemove.call(doc, 'visibilitychange', f);
      return { chanThemListener: blocked >= before, bat: on };
    }
  };
  say('nạp xong — bảng "NỀN" ở góc phải trên');
})();
