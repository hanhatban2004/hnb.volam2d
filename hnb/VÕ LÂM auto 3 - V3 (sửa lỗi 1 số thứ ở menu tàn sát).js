// ==UserScript==
// @name         Võ Lâm Auto 3
// @namespace    vlpx.auto3
// @version      3.7.0
// @description  Tàn Sát + Tự nhặt (AI nhặt trước khi đánh) + Bảo trì + Map/Xa Phu. [3.1.0] Menu kéo được, không kẹt đáy, không tự mở. [3.2.0] Lọc phẩm chất trang bị. [3.4.0] Bảng 48 map + Xa Phu. [3.5.1] AI nhặt xác minh món đã biến mất, không spam, xử lý túi đầy. [3.6.0] Bỏ tab Boss và toàn bộ logic săn Boss; còn 4 tab: Tàn Sát · Nhặt · Bảo trì · Map. [3.7.0] AI Tàn Sát: sửa lỗi tầm chiêu AoE bị nhân sai đơn vị khiến bot đứng im không đi; thêm đi tìm quái quanh điểm farm, chống kẹt (lách + đổi mục tiêu), giới hạn bán kính đuổi, không để AI nhặt giành đường khi đang đi map.
// @match        https://volam2d.com/*
// @match        https://*.volam2d.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
setTimeout(function () {
(function () {
  'use strict';
  try { if (window.__VLA3) window.__VLA3.destroy(); } catch (e) {}

  /* ============================ 0. NỀN ============================ */
  var TILE = 64, NS = 'vla3_';
  var A = window.__VLA3 = { timers: [], offs: [], ver: '3.7.0' };

  function G() { return window.G || null; }
  function inGame() { var g = G(); return !!(g && g.inGame && g.map && g.me && g.self && g.data); }
  function now() { return Date.now(); }
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().trim(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function px(n) { return (n + .5) * TILE; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function mapName(id) {
    var g = G();
    try { var n = ((g.data.maps || {})[id] || {}).name; if (n) return n; } catch (e) {}
    var s = GAMEMAPS[id]; return s ? s[0] : ('Map ' + id);
  }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(NS + k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) {} }

  /* ================= BẢNG BẢN ĐỒ + XA PHU (v3.4.0) =================
     Lấy từ dữ liệu game /api/gamedata: 48 bản đồ + cổng. Nhờ đó bot biết TÊN
     mọi map và biết Xa Phu có thể tới map nào, kể cả map chưa từng ghé.
     GAMEMAPS[id] = [tên, cấp tối thiểu, là thành trấn, là môn phái] */
  var GAMEMAPS = {
    "cho_phien": ["Chợ Phiên Tương Dương", 1, 1, 0],
    "lan_chau": ["Lan Châu Thành", 1, 1, 0],
    "tuong_duong": ["Thành Tương Dương", 1, 1, 0],
    "thanh_do": ["Thành Đô Phủ", 1, 1, 0],
    "long_mon": ["Long Môn Trấn", 50, 1, 0],
    "cai_bang_da": ["Cái Bang Tổng Đà", 1, 0, 1],
    "con_lon_phai": ["Côn Lôn Phái", 1, 0, 1],
    "nga_my_son": ["Nga My Sơn", 1, 0, 1],
    "thien_vuong_dao": ["Thiên Vương Đảo", 1, 0, 1],
    "thieu_lam_tu": ["Thiếu Lâm Tự", 1, 0, 1],
    "thuy_yen_mon": ["Thúy Yên Môn", 1, 0, 1],
    "vo_dang_son": ["Võ Đang Sơn", 1, 0, 1],
    "van_doc_coc": ["Vạn Độc Cốc", 1, 0, 1],
    "duong_gia_bao": ["Đường Gia Bảo", 1, 0, 1],
    "bang_cung": ["Băng Cung Thiên Sơn", 1, 0, 0],
    "bang_dong": ["Băng Phách Động", 1, 0, 0],
    "ben_do": ["Bến Đò Hán Thủy", 1, 0, 0],
    "co_mo": ["Cổ Mộ Hoang Sơn", 1, 0, 0],
    "co_dao": ["Cổ Đạo Tơ Lụa", 1, 0, 0],
    "hoa_son_ld": ["Hoa Sơn Luận Kiếm", 1, 0, 0],
    "hoa_son": ["Hoa Sơn Tuyệt Đỉnh", 1, 0, 0],
    "dong_gau": ["Hắc Hùng Động", 1, 0, 0],
    "hac_phong_coc": ["Hắc Phong Cốc", 1, 0, 0],
    "kiem_trung": ["Kiếm Trủng Cổ Mộ", 1, 0, 0],
    "lang_hoang": ["Làng Hoang Phế", 1, 0, 0],
    "lau_lan": ["Lâu Lan Cổ Thành", 1, 0, 0],
    "ty_vo_dai": ["Lôi Đài Tỷ Võ", 1, 0, 0],
    "ma_giao": ["Ma Giáo Cấm Địa", 1, 0, 0],
    "ngoai_o": ["Ngoại Ô Tương Dương", 1, 0, 0],
    "truc_lam": ["Rừng Trúc Thanh Thành", 1, 0, 0],
    "sa_mac": ["Sa Mạc Tây Vực", 1, 0, 0],
    "son_dao": ["Sơn Đạo Thanh Thành", 1, 0, 0],
    "thien_son_khau": ["Thiên Sơn Khẩu", 1, 0, 0],
    "thuy_trai": ["Thủy Trại Hắc Phong", 1, 0, 0],
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
  var NO_TP = { dai_hoi: 1, ty_vo_dai: 1, chien_truong: 1, hoa_son_ld: 1 };  // đấu trường/đại hội: không đi bằng Xa Phu
  var TPBAD = load('tpbad', {});            // map Xa Phu đã từ chối -> đừng thử lại
  function tpCand(id) { return !!(GAMEMAPS[id] && !NO_TP[id]); }
  function tpMinLv(id) { return (GAMEMAPS[id] && GAMEMAPS[id][1]) || 1; }
  function tpOk(id) {
    if (!tpCand(id) || TPBAD[id]) return false;
    var g = G(), lv = (g && g.me && g.me.level) || 1;
    return lv >= tpMinLv(id);
  }
  function stopAuto(g) { if (g && g.auto) { try { g.setAuto(false); } catch (e) { g.auto = false; } } }
  function stopNav() { try { if (window.WorldMap && WorldMap.stop) WorldMap.stop(); } catch (e) {} }
  function navTo(id) { try { return !!(window.WorldMap && WorldMap.navTo && WorldMap.navTo(id, true)); } catch (e) { return false; } }
  function go(x, y) { var g = G(); if (!g) return; if (x == null) { if (g.moveTo) g.moveTo = null; return; } g.moveTo = { x: x, y: y }; }
  function every(ms, fn, tag) {
    A.timers.push(setInterval(function () { try { fn(); } catch (e) { console.warn(tag || '[VLA3]', e); } }, ms));
  }

  // BFS qua cổng: biết đi bộ mấy chặng + chi phí
  function route(from, to) {
    var maps = G().data.maps;
    if (!maps[from] || !maps[to] || from === to) return [];
    var prev = {}, seen = {}, q = [from];
    seen[from] = 1;
    while (q.length) {
      var cur = q.shift(), ps = (maps[cur] && maps[cur].portals) || [];
      for (var i = 0; i < ps.length; i++) {
        var nx = ps[i].to;
        if (!nx || seen[nx] || !maps[nx]) continue;
        seen[nx] = 1; prev[nx] = { from: cur, p: ps[i] };
        if (nx === to) { var path = [], at = to; while (at !== from) { path.unshift(prev[at].p); at = prev[at].from; } return path; }
        q.push(nx);
      }
    }
    return null;
  }

  /* ======================= 1. XA PHU NHANH =======================
     Đã biết Xa Phu ở map này tới được đích -> emit 'teleport' NGAY khi
     vừa tới NPC (không chờ server trả bảng chọn, không treo 16s như bản cũ).
     Chưa biết -> hỏi 'npc', chờ tối đa 1,5s rồi thôi.
     Teleport 3s không sang map -> quên đường đó, nghỉ 4s, đi cách khác.
     =============================================================== */
  var TP = load('tp', {});
  function tpGet(m) { var e = TP[m]; return e && e.dests ? e : null; }
  function tpServes(m, d) {
    var e = tpGet(m);
    if (e && e.dests.indexOf(d) >= 0) return true;   // server đã xác nhận map này
    return tpOk(d);                                   // hoặc suy từ bảng bản đồ game
  }
  function tpLearn(m, npc, list) {
    if (!m || !list || !list.length) return;
    var e = TP[m] = TP[m] || { npc: npc || '', dests: [] };
    if (npc) e.npc = npc;
    list.forEach(function (d) { if (d && e.dests.indexOf(d) < 0) e.dests.push(d); });
    var ks = Object.keys(TP); while (ks.length > 80) delete TP[ks.shift()];
    save('tp', TP);
  }
  function tpForget(m, d) {
    var e = TP[m]; if (!e || !e.dests) return;
    var i = e.dests.indexOf(d); if (i >= 0) { e.dests.splice(i, 1); save('tp', TP); }
  }
  function tpNpcHere() {
    var g = G(), npcs = (g.map && g.map.npcs) || [], s = g.self;
    if (!npcs.length || !s) return null;
    var e = tpGet(g.map.id), best = null, bd = 1e9;
    npcs.forEach(function (n) {
      if (!n) return;
      var nm = norm(((g.data.npcs || {})[n.id] || {}).name), ok = false;
      if (e && e.npc === n.id) ok = true;
      else if (n.id === 'xa_phu' || nm === 'xa phu') ok = true;
      else if (n.id === 'ma_phu' || nm.indexOf('ma phu') === 0) ok = true;
      if (!ok) return;
      var d = dist({ x: px(n.x), y: px(n.y) }, s);
      if (d < bd) { bd = d; best = n; }
    });
    return best;
  }
  function tpLabel(n) { try { return ((G().data.npcs || {})[n.id] || {}).name || 'Xa Phu'; } catch (e) { return 'Xa Phu'; } }
  function hopsOf(to) { var r = route(G().map.id, to); return r ? r.map(function (p) { return p.to; }) : []; }
  function tpPick(list, dest) {
    if (list && list.length) {
      if (list.indexOf(dest) >= 0) return dest;
      var hops = hopsOf(dest);
      for (var i = hops.length - 1; i >= 0; i--) if (list.indexOf(hops[i]) >= 0) return hops[i];
    }
    if (tpOk(dest)) return dest;                      // bảng tĩnh: map còn thiếu trong bảng chọn của Xa Phu
    return null;
  }

  function newTrip(name) {
    return { name: name, dest: null, map: null, mode: '', plan: [], planTo: null, skip: {},
             banUntil: 0, noNavUntil: 0, navAt: 0, doorAt: 0, doorX: 0, doorY: 0,
             askedAt: 0, walkAt: 0, tries: 0, list: null, teleAt: 0, teleTo: null,
             walkX: null, walkY: null, walkedAt: 0 };
  }
  function tripReset(t, map) {
    t.map = map; t.mode = ''; t.plan = []; t.planTo = null; t.navAt = 0; t.doorAt = 0;
    t.askedAt = 0; t.tries = 0; t.list = null; t.teleAt = 0; t.teleTo = null;
    t.walkX = null; t.walkY = null; t.walkedAt = 0;
  }

  function trip(t, dest, o) {
    var g = G();
    if (!g || !g.map || !g.self) return 'blocked';
    var cm = g.map.id, n = now();
    if (t.dest !== dest) { t.dest = dest; t.list = null; t.teleAt = 0; }
    if (t.map !== cm) tripReset(t, cm);
    if (cm === dest) { if (t.navAt) stopNav(); t.plan = []; return 'here'; }

    if (t.teleAt && n - t.teleAt > 3000 && t.teleTo) {
      if (t.teleTo !== dest) tpForget(cm, t.teleTo);
      var le = tpGet(cm);
      if (tpCand(t.teleTo) && !(le && le.dests.indexOf(t.teleTo) >= 0)) {   // chỉ đánh dấu map do bảng tĩnh gợi ý
        TPBAD[t.teleTo] = 1; save('tpbad', TPBAD);
      }
      t.teleAt = 0; t.teleTo = null; t.list = null;
      t.banUntil = n + 4000; t.noNavUntil = n + 4000;
    }
    if (o.tp !== false && n > t.banUntil) {
      var r = stepTp(t, dest, cm, o, n);
      if (r) return r;
    }
    if (n > t.noNavUntil && (t.mode !== 'nav' || n - t.navAt > 8000)) {
      t.navAt = n; t.mode = 'nav';
      stopAuto(g);
      if (navTo(dest)) { o.st('🧭 ' + t.name + ' → ' + mapName(dest)); return 'go'; }
      t.mode = 'walk';
    } else if (t.mode === 'nav') return 'go';

    if (t.planTo !== cm || !t.plan.length) {
      var pl = (g.map.portals || []), best = null;
      for (var i = 0; i < pl.length; i++) {
        if ((t.skip[pl[i].to] || 0) > n) continue;
        var full;
        if (pl[i].to === dest) full = [pl[i]];
        else {
          var rr = route(pl[i].to, dest);
          if (!rr) continue;
          full = [pl[i]].concat(rr.map(function (x) { return x.to; }));
        }
        if (!best || full.length < best.all.length) best = { p: pl[i], all: full };
      }
      t.plan = best ? best.all : []; t.planTo = cm;
    }
    if (!t.plan.length) { t.banUntil = n + 20000; return 'blocked'; }
    var to = t.plan[0], portal = null, ps = g.map.portals || [];
    for (var j = 0; j < ps.length; j++) if (ps[j].to === to) { portal = ps[j]; break; }
    if (!portal) { t.skip[to] = n + 120000; t.plan = []; t.planTo = null; return 'go'; }
    stopNav(); stopAuto(g);
    var tx = px(portal.x), ty = px(portal.y);
    if (dist({ x: tx, y: ty }, g.self) < TILE * 0.85) {
      if (!t.doorAt) { t.doorAt = n; t.doorX = g.self.x; t.doorY = g.self.y; }
      else if (n - t.doorAt > 5000 && Math.hypot(g.self.x - t.doorX, g.self.y - t.doorY) < 24) {
        t.skip[to] = n + 90000; t.plan = []; t.planTo = null; t.doorAt = 0; t.mode = '';
        o.st('⚠ Cổng ' + mapName(to) + ' không qua, tìm đường khác');
        return 'go';
      }
    } else t.doorAt = 0;
    g.target = null; g.chase = null; g.npcGoal = null;
    go(tx, ty);
    o.st('🚶 ' + t.name + ' → ' + mapName(to) + (t.plan.length > 1 ? ' (còn ' + t.plan.length + ')' : ''));
    return 'go';
  }

  function stepTp(t, dest, cm, o, n) {
    var g = G(), npc = tpNpcHere();
    if (!npc) return '';
    // Điểm đứng ngay cạnh NPC — game tự đi tới (x, y+40). Đo tới đúng điểm đó.
    var tx = px(npc.x), ty = px(npc.y) + 40;
    var d = dist({ x: tx, y: ty }, g.self);
    if (d > TILE * 0.8) {
      var moved = t.walkX == null ? 99 : Math.hypot(g.self.x - t.walkX, g.self.y - t.walkY);
      if (!(moved < 6 && n - (t.walkedAt || 0) > 1400)) {   // kẹt vật cản thì coi như đã tới sát
        if (moved >= 6) { t.walkX = g.self.x; t.walkY = g.self.y; t.walkedAt = n; }
        // KHÔNG set npcGoal: game tự xoá moveTo khi vào 2 ô -> nhân vật đứng xa không tới được.
        g.npcGoal = null; g.target = null; g.chase = null;
        stopNav(); stopAuto(g);
        go(tx, ty);
        if (n - (t.walkAt || 0) > 1200) { t.walkAt = n; o.st('🐎 ' + tpLabel(npc) + ' · còn ' + Math.round(d) + 'px'); }
        return 'go';
      }
    }
    t.walkX = null; t.walkY = null; t.walkedAt = 0;
    g.npcGoal = null;
    go(null);
    stopNav();
    var known = tpServes(cm, dest) ? dest : tpPick(tpGet(cm) && tpGet(cm).dests, dest);
    if (known) {
      if (n - t.teleAt > 1200) {
        t.teleAt = n; t.teleTo = known; t.list = null;
        try { g.socket.emit('teleport', { map: known }); } catch (e) {}
        o.st('🐎 Xa Phu → ' + mapName(known));
      }
      return 'go';
    }
    if (t.list) {
      var to = tpPick(t.list, dest);
      if (!to) { t.banUntil = n + 60000; t.list = null; return ''; }
      if (n - t.teleAt > 1200) {
        t.teleAt = n; t.teleTo = to;
        try { g.socket.emit('teleport', { map: to }); } catch (e) {}
        o.st('🐎 Xa Phu → ' + mapName(to));
      }
      return 'go';
    }
    if (!t.askedAt || n - t.askedAt > 1500) {
      if (t.tries >= 2) { t.banUntil = n + 30000; return ''; }
      t.tries = (t.tries || 0) + 1; t.askedAt = n;
      try { g.socket.emit('npc', { id: npc.id }); } catch (e) {}
      o.st('🐎 Hỏi ' + tpLabel(npc) + ' đường đi...');
    }
    return 'go';
  }

  function hookSocket() {
    var g = G();
    if (!g || !g.socket || g.socket.__vla3) return;
    g.socket.__vla3 = 1;
    hookNpc();
    g.socket.on('npc', function (d) {
      if (!d || !d.teleports) return;
      var cm = G().map && G().map.id, list = d.teleports.map(function (x) { return x.map; });
      tpLearn(cm, d.id, list);
      if (T.farm.map === cm) { T.farm.list = list; T.farm.tries = 0; }
    });
  }
  function hookNpc() {
    var Uo = window.UI;
    if (!Uo || typeof Uo.openNpc !== 'function' || Uo.__vla3) return;
    Uo.__vla3 = 1;
    var orig = Uo.openNpc;
    Uo.openNpc = function (d) {
      try {
        if (d && d.teleports && S.hideTp !== false && T.farm.dest) return null;
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  }
  /* ============================ 2. TÀN SÁT ============================ */
  var S = Object.assign({ hideTp: true, fast: true, revive: true, mount: true }, load('cfg', {}));
  var Fs = load('farm', {}) || {};   // chỉ đọc 3 khoá còn dùng (bỏ lead của bản cũ)
  var F = { on: !!Fs.on, keepUp: !!Fs.keepUp, upMap: Fs.upMap == null ? null : Fs.upMap };
  function saveF() { save('farm', { on: F.on, keepUp: F.keepUp, upMap: F.upMap }); }
  function saveS() { save('cfg', { hideTp: S.hideTp, fast: S.fast, revive: S.revive, mount: S.mount }); }

  var T = { farm: newTrip('Tàn Sát') };
  var Fst = { mode: 'idle', target: 0, cand: 0, candN: 0, map: null, hx: null, hy: null };
  var FA = { id: 0, x: 0, y: 0, at: 0, stuck: 0, skip: new Map() };   // đi tới quái: kẹt ngắn hạn + tạm bỏ mục tiêu
  var PAT = { x: null, y: null, at: 0 };                              // điểm tuần tra khi quanh đây không còn quái
  // Lớp BRAIN: một đầu mối ghi moveTo + cam kết mục tiêu + phát hiện chạy vòng
  var MV = { x: 0, y: 0, who: '', t: 0 };
  var AI = { lock: 0, lockAt: 0, lockFor: 20000, joltUntil: 0, jolts: 0 };
  var OSC = { sx: 0, sy: 0, lx: 0, ly: 0, t: 0, path: 0 };

  function mname(m) { try { return ((G().data.monsters || {})[m.type] || {}).name || String(m.type); } catch (e) { return String(m.type); } }

  function radPx(r) {   // bán kính AoE: có bản ghi theo ô (<=16) có bản ghi theo px
    var n = Number(r) || 0;
    if (n <= 0) return TILE * 3;
    return n <= 16 ? n * TILE : n;
  }
  function skRange(v, g) {   // tầm thật của 1 chiêu, theo px (game so khoảng cách px)
    if (!v) return 0;
    var r = Number(v.range);
    if (isFinite(r) && r > 0) return r;
    if (v.type === 'aoe') return radPx(v.radius);
    return (g.myRange && g.myRange()) || 60;
  }

  // AI đi tới quái: kẹt 3 giây thì bỏ mục tiêu 12 giây; đang kẹt thì nhích chéo để vòng vật cản
  function fChase(m) {
    var g = G(), s = g.self, n = now();
    if (FA.id !== m.id) { FA.id = m.id; FA.x = s.x; FA.y = s.y; FA.at = n; FA.stuck = 0; }
    if (n - FA.at > 1000) {
      if (Math.hypot(s.x - FA.x, s.y - FA.y) < 12) FA.stuck++; else FA.stuck = 0;
      FA.x = s.x; FA.y = s.y; FA.at = n;
      if (FA.stuck >= 3) {
        FA.skip.set(m.id, n + 12000); FA.id = 0; FA.stuck = 0;
        if (AI.lock === m.id) AI.lock = 0;
        stT('🚫 Không tới được ' + mname(m) + ' · đổi mục tiêu');
        return;
      }
    }
    if (FA.stuck > 0) {
      var dx = m.x - s.x, dy = m.y - s.y, dd = Math.hypot(dx, dy) || 1, side = (FA.stuck % 2 ? 1 : -1) * 110;
      mvSet({ x: s.x + dx / dd * 90 - dy / dd * side, y: s.y + dy / dd * 90 + dx / dd * side }, 'combat');
      return;
    }
    mvSet({ x: m.x, y: m.y }, 'combat');
  }

  // Một đầu mối duy nhất ghi g.moveTo: dead-band 48px/1.2s, khoá 200ms khi đổi chủ
  function mvSet(p, who) {
    var g = G(), n = now();
    if (who !== 'combat' && n < AI.joltUntil) { if (g.moveTo) g.moveTo = null; return; }
    if (!p) { if (g.moveTo) g.moveTo = null; MV.who = who; MV.t = n; return; }
    if (MV.who && MV.who !== who && n - MV.t < 200) return;
    if (MV.who === who && g.moveTo && n - MV.t < 1200 && Math.hypot(p.x - MV.x, p.y - MV.y) < 48) return;
    g.moveTo = { x: p.x, y: p.y }; MV.x = p.x; MV.y = p.y; MV.who = who; MV.t = n;
  }
  function lockT(id, ms) {
    if (!id) return;
    if (AI.lock !== id) { AI.lock = id; AI.lockAt = now(); }
    AI.lockFor = Math.max(Number(AI.lockFor) || 0, ms || 20000);
  }
  function lockedNow(n) {
    if (!AI.lock) return 0;
    if (n > AI.lockAt + AI.lockFor) { AI.lock = 0; return 0; }
    return AI.lock;
  }
  // Chạy vòng: 8s đi >400px mà chỉ xê dịch <90px -> dừng 6s, xoá đường, đổi mục tiêu
  function watchOsc() {
    var g = G();
    if (!g || !g.self) return;
    var s = g.self, n = now();
    var moving = !!g.moveTo && (Fst.mode === 'farm' || Fst.mode === 'patrol' || Fst.mode === 'goup');
    if (!moving) { OSC.t = 0; return; }
    if (!OSC.t) { OSC.sx = OSC.lx = s.x; OSC.sy = OSC.ly = s.y; OSC.t = n; OSC.path = 0; return; }
    OSC.path += Math.hypot(s.x - OSC.lx, s.y - OSC.ly); OSC.lx = s.x; OSC.ly = s.y;
    if (n - OSC.t < 8000) return;
    var net = Math.hypot(s.x - OSC.sx, s.y - OSC.sy);
    if (OSC.path > 400 && net < 90) jolt();
    OSC.t = n; OSC.path = 0; OSC.sx = s.x; OSC.sy = s.y;
  }
  function jolt() {
    var n = now(), g = G();
    if (n < AI.joltUntil) return;
    AI.joltUntil = n + 6000; AI.jolts++;
    AI.lock = 0; AI.lockAt = 0;
    if (Fst.target) FA.skip.set(Fst.target, n + 12000);
    Fst.target = 0; Fst.cand = 0; Fst.candN = 0;
    var hop = T.farm.plan && T.farm.plan[0];
    if (hop) T.farm.skip[hop] = n + 90000;      // lần sau đi cổng khác
    T.farm.plan = []; T.farm.planTo = null; T.farm.mode = ''; T.farm.navAt = 0; T.farm.doorAt = 0;
    T.farm.noNavUntil = n + 45000;              // 45s không dùng dẫn đường của game
    stopNav();
    if (g && g.moveTo) g.moveTo = null;
    MV.who = ''; MV.t = n;
    PAT.x = null; PAT.y = null; PAT.at = 0;
    stT('🧠 Phát hiện chạy vòng — dừng 6s rồi tính lại');
  }

  function fight(m) {
    var g = G(), me = g.me, s = g.self, sk = g.mySkills() || [];
    stopAuto(g);
    g.npcGoal = null; g.chase = null; g.target = m.id;
    var d = dist(m, s), used = false, order = [7, 6, 5, 3, 4, 2, 1, 0];
    for (var k = 0; k < order.length; k++) {
      var i = order[k], v = sk[i];
      if (!v || !v.learned || me.level < (v.lv || 1) || !g.skillReady(i) || me.mp < (v.mp || 0) || v.type === 'passive') continue;
      if (v.type === 'buff') {
        if (!me.buffs.some(function (x) { return x.name === v.name; })) { mvSet(null, 'combat'); g.useSkill(i); used = true; break; }
        continue;
      }
      if (v.type === 'heal') {
        if (me.hp < me.stats.maxHp * 0.6) { mvSet(null, 'combat'); g.useSkill(i); used = true; break; }
        continue;
      }
      if (d > skRange(v, g) * 0.85) continue;   // chiêu này không với tới -> xét chiêu khác, hết thì đi tới
      mvSet(null, 'combat'); g.useSkill(i); used = true; break;
    }
    if (!used) {
      var base = Math.max(48, (g.myRange && g.myRange()) || 60);   // tầm đánh thường (px) — mốc chắc chắn đúng
      if (d > base * 0.85) fChase(m);
      else { mvSet(null, 'combat'); if (g.skillReady(0)) g.useSkill(0); }
    }
    return d;
  }


  function farmTarget() {
    var g = G(), s = g.self, n = now(), cur = null, curD = 0, b = null, bd = 1e9;
    var hx = Fst.hx == null ? s.x : Fst.hx, hy = Fst.hy == null ? s.y : Fst.hy;
    var lock = lockedNow(n);
    g.monsters.forEach(function (m) {
      if (!m || m.hp <= 0 || m.boss || m.dead) return;
      if ((FA.skip.get(m.id) || 0) > n) return;                       // vừa không tới được -> tạm bỏ
      if (Math.hypot(m.x - hx, m.y - hy) > 900) return;               // quá xa điểm farm -> không đuổi
      if (F.keepUp && F.upMap != null && g.map.id !== F.upMap) return;
      var d = dist(m, s);
      if (lock && m.id === lock) { cur = m; curD = d; }               // cam kết: giữ mục tiêu đã chọn
      else if (m.id === Fst.target) { cur = m; curD = d; }
      if (d < bd) { bd = d; b = m; }
    });
    if (lock && cur && curD > 350) return cur;                        // đang đuổi xa: giữ cam kết, không nhảy giữa đường
    if (lock && !cur) { AI.lock = 0; AI.lockAt = 0; }
    if (!cur) { Fst.cand = 0; Fst.candN = 0; if (b) lockT(b.id); return b; }
    if (!b || b.id === cur.id || bd > curD * 0.65) { Fst.cand = 0; Fst.candN = 0; return cur; }
    // đổi mục tiêu cần 2 nhịp liên tiếp -> không nhảy qua nhảy lại
    Fst.candN = (Fst.cand === b.id) ? Fst.candN + 1 : 1;
    Fst.cand = b.id;
    if (Fst.candN >= 2) { Fst.candN = 0; lockT(b.id); return b; }
    lockT(cur.id);
    return cur;
  }

  function patrol() {   // hết quái quanh đây: đi lùng quanh điểm farm thay vì đứng im
    var g = G(), s = g.self, n = now();
    var hx = Fst.hx == null ? s.x : Fst.hx, hy = Fst.hy == null ? s.y : Fst.hy;
    if (Math.hypot(s.x - hx, s.y - hy) > 300) { PAT.x = hx; PAT.y = hy; PAT.at = n + 1500; g.target = null; AI.lock = 0; mvSet({ x: hx, y: hy }, 'patrol'); stT('🧭 Về điểm farm'); return; }
    if (PAT.x == null || n > PAT.at || Math.hypot(s.x - PAT.x, s.y - PAT.y) < 30) {
      var a = Math.random() * Math.PI * 2, rr = 120 + Math.random() * 200;
      PAT.x = hx + Math.cos(a) * rr; PAT.y = hy + Math.sin(a) * rr; PAT.at = n + 2600;
    }
    g.target = null; g.chase = null; AI.lock = 0;
    mvSet({ x: PAT.x, y: PAT.y }, 'patrol');
    stT('🔍 Đi tìm quái quanh điểm farm...');
  }

  function farmTick() {
    if (!inGame()) return;
    hookSocket();
    var g = G(), n = now();
    watchOsc();
    if (!F.on) { Fst.mode = 'idle'; stT('Đang tắt'); return; }
    if (g.me.dead) { Fst.mode = 'idle'; stT('Đã chết, chờ hồi sinh'); return; }
    if (F.keepUp && F.upMap == null) { Fst.mode = 'idle'; stT('👉 Bấm “Lưu map này”'); return; }
    var mid = g.map && g.map.id;
    if (Fst.map !== mid) {   // sang map mới: lấy vị trí đang đứng làm điểm farm, quên sổ kẹt cũ
      Fst.map = mid; Fst.hx = g.self.x; Fst.hy = g.self.y; Fst.target = 0; Fst.cand = 0; Fst.candN = 0;
      FA.id = 0; FA.stuck = 0; FA.skip.clear();
      PAT.x = null; PAT.y = null; PAT.at = 0;
      AI.lock = 0; AI.lockAt = 0; AI.joltUntil = 0; MV.who = ''; MV.t = 0;
      OSC.t = 0; OSC.path = 0;
    }

    // về map up nếu đang lạc
    if (F.keepUp && F.upMap != null && g.map.id !== F.upMap) {
      Fst.mode = 'goup';
      var r = trip(T.farm, F.upMap, { tp: S.fast !== false, who: 'farm', st: stT });
      if (r === 'blocked') stT('🧭 Không có đường về ' + mapName(F.upMap));
      return;
    }
    if (g.map && g.map.safe) { Fst.mode = 'safe'; mvSet(null, 'safe'); g.target = null; AI.lock = 0; stT('⚠ Map an toàn (thành) · không đánh được'); return; }
    if (PAI.busy) { stT('⏸ Nhặt đồ rồi đánh tiếp'); return; }
    if (pTryStart('farm')) { pLootStep(); stT('🧹 Nhặt đồ rồi đánh tiếp'); return; }
    var tgt = farmTarget();
    if (!tgt) { Fst.mode = 'patrol'; patrol(); return; }
    Fst.mode = 'farm'; Fst.target = tgt.id;
    fight(tgt);
    stT('⚔ ' + mname(tgt) + ' · ' + Math.round(dist(tgt, g.self)) + 'px');
  }
  /* ==================== 4. TỰ NHẶT + AI NHẶT TRƯỚC ====================
     Không bật Tàn Sát: tự đi nhặt như cũ (pickStep).
     Có Tàn Sát: AI tạm dừng đánh khi an toàn, đi nhặt hết đồ gần rồi
     trả quyền cho farm đánh tiếp. Chỉ một bên được ghi moveTo.
     ================================================================== */
  var P = Object.assign({ on: false, gold: true, pots: true, mats: true, books: true, min: 'common', range: 700, ts: true, before: true }, load('pick', {}));
  var RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };
  var RQ = { common: 'Thường', rare: 'Lam', epic: 'Tím', legendary: 'Cam' };   // tên hiển thị theo màu
  function rk(v) {   // chuẩn hoá phẩm chất: 'Rare ', 'RARE', 2, null... -> 0..3
    if (typeof v === 'number' && isFinite(v)) return Math.max(0, Math.min(3, v | 0));
    var k = String(v == null ? '' : v).trim().toLowerCase();
    if (k === 'thuong' || k === 'thường' || k === 'trang' || k === 'white' || k === 'normal') k = 'common';
    else if (k === 'lam' || k === 'blue' || k === 'xanh') k = 'rare';
    else if (k === 'tim' || k === 'tím' || k === 'purple' || k === 'violet') k = 'epic';
    else if (k === 'cam' || k === 'orange' || k === 'gold') k = 'legendary';
    return (k in RANK) ? RANK[k] : 0;
  }
  P.min = String(P.min == null ? 'common' : P.min).trim().toLowerCase();
  if (!(P.min in RANK)) P.min = 'common';
  P.range = Math.max(300, Math.min(1200, Number(P.range) || 700));
  P.before = P.before !== false;   // nhặt trước khi đánh tiếp (mặc định BẬT)
  function saveP() { save('pick', P); }
  var pSkip = new Map(), pTry = null, pTrack = null, pEmit = 0, pNear = 0, pMsg = '', pMap = null;

  function pItem(dr) {
    var g = G();
    if (!g || !g.data || !g.data.items) return null;
    var id = (window.UI && UI.resolveId) ? UI.resolveId(dr.item) : dr.item;
    return g.data.items[id] || g.data.items[dr.item] || null;
  }
  function pName(dr) {
    if (dr.gold) return typeof dr.gold === 'number' ? '+' + Math.round(dr.gold) + ' ngân lượng' : 'ngân lượng';
    var it = pItem(dr);
    return it && it.name ? it.name : 'vật phẩm';
  }
  function pOK(dr, t) {
    if (!dr || (pSkip.get(dr.id) || 0) > t) return false;
    var g = G(), s = g.self;
    if (dr.o && g.user && dr.o !== g.user.id && (dr.ownUntil || 0) > t) return false;
    if (Math.hypot(dr.x - s.x, dr.y - s.y) > P.range) return false;
    if (dr.gold) return !!P.gold;
    var it = pItem(dr);
    if (!it) return false;
    if (g.me && g.me.inv && g.me.inv.length >= (g.me.invMax || 48)) {   // túi đầy: gold + đồ cộng dồn, bỏ trang bị mới
      var stack = it.type !== 'equip' && g.me.inv.some(function (x) { return x.id === dr.item; });
      if (!stack) return false;
    }
    var isBook = /^sk_|^book_/.test(String(dr.item)) || !!(it.effect && it.effect.learn);
    if (it.type === 'equip') return rk(it.rarity) >= rk(P.min);   // lọc phẩm chất chỉ áp cho trang bị
    if (isBook) return !!P.books;
    if (it.type === 'use' && it.effect && (it.effect.hp || it.effect.mp || it.effect.hpPct || it.effect.mpPct)) return !!P.pots;
    return !!P.mats;
  }
  function pFind(t) {
    var g = G(), s = g.self, best = null, bd = Infinity, same = null;
    pNear = 0;
    if (!g.drops) return null;
    g.drops.forEach(function (dr) {
      if (!pOK(dr, t)) return;
      pNear++;
      if (pTrack && dr.id === pTrack.id) same = dr;
      var d = Math.hypot(dr.x - s.x, dr.y - s.y);
      if (d < bd) { bd = d; best = dr; }
    });
    return same || best;
  }
  function pLoot() {   // nhặt đồ ngay dưới chân, không di chuyển
    var g = G(), t = performance.now(), near = null;
    if (!g.drops) return '';
    g.drops.forEach(function (dr) {
      if (!pOK(dr, t) || dr.gold) return;   // vàng tự vào người khi đi qua, không gửi 'pickup'
      if (Math.hypot(dr.x - g.self.x, dr.y - g.self.y) <= 72) near = dr;
    });
    if (!near) return '';
    if (pEmit && t - pEmit < 400) return '';
    pEmit = t;
    try { g.socket.emit('pickup', { id: near.id }); } catch (e) {}
    return pName(near);
  }

  /* ---- AI nhặt đồ: dừng đánh -> nhặt hết -> đánh tiếp ---- */
  var PAI = { busy: false, owner: '', since: 0, lastGot: 0, got: 0, cur: null,
              tx: null, ty: null, chk: 0, stuck: 0, tryId: null, tryAt: 0 };
  function pFoeDist() {   // quái còn sống gần nhất (mọi loại quái); G.monsters là Map trong game
    var g = G(), s = g && g.self, d = Infinity;
    if (!s || !g.monsters || !g.monsters.forEach) return d;
    g.monsters.forEach(function (m) {
      if (!m || m.hp <= 0) return;
      var dd = Math.hypot(m.x - s.x, m.y - s.y);
      if (dd < d) d = dd;
    });
    return d;
  }
  function pBest(t, maxD) {   // ưu tiên ngân lượng > trang bị > thuốc, rồi tới gần
    var g = G(), s = g.self, best = null, bs = -Infinity;
    (g.drops || []).forEach(function (dr) {
      if (!pOK(dr, t)) return;
      var d = Math.hypot(dr.x - s.x, dr.y - s.y);
      if (d > maxD) return;
      var pr = 0, it = dr.gold ? null : pItem(dr);
      if (dr.gold) pr = 3;
      else if (it && it.type === 'equip') pr = 2 + rk(it.rarity) * 0.1;
      else if (it && it.type === 'use') pr = 1.5;
      else pr = 1;
      var sc = pr * 80 - d;
      if (sc > bs) { bs = sc; best = dr; }
    });
    return best;
  }
  function pRelease(msg) {
    var g = G();
    PAI.busy = false; PAI.owner = ''; PAI.cur = null;
    PAI.tx = null; PAI.ty = null; PAI.stuck = 0; PAI.tryId = null; PAI.tryAt = 0;
    if (g) { go(null); g.target = null; g.chase = null; g.npcGoal = null; }
    if (msg) { pMsg = msg; stP(msg); }
  }
  function pHasDrop(id) {
    var g = G(), found = false;
    if (g && g.drops && g.drops.forEach) g.drops.forEach(function (d) { if (d.id === id) found = true; });
    return found;
  }
  function pTryStart(who) {   // only start when it is safe to walk away from the fight
    if (!P.on || !P.ts || !P.before || PAI.busy || !inGame()) return false;
    var g = G(), t = performance.now();
    if (Fst.mode === 'goup' || (g.map && g.map.safe)) return false;   // đang đi map / map thành: không ghé nhặt
    if (g.auto || g.me.dead) return false;
    var dr = pBest(t, 560);
    if (!dr) return false;
    if (pFoeDist() < 240) return false;   // còn quái sát bên: đánh trước đã
    PAI.busy = true; PAI.owner = who; PAI.since = t; PAI.lastGot = t; PAI.got = 0;
    PAI.cur = null; PAI.tx = g.self.x; PAI.ty = g.self.y; PAI.chk = t; PAI.stuck = 0;
    pMsg = '🧹 Nhặt đồ rồi đánh tiếp'; stP(pMsg);
    return true;
  }
  function pLootStep() {
    var g = G(), t = performance.now();
    if (!P.on || !P.ts || !P.before || !F.on || !inGame() || g.auto || g.me.dead || Fst.mode === 'goup' || Fst.mode === 'safe') {
      pRelease(''); return;
    }
    if (t - PAI.since > 20000 || t - PAI.lastGot > 8000) {   // bỏ cuộc nếu lâu không nhặt được gì
      pRelease(PAI.got ? ('✅ Nhặt ' + PAI.got + ' món · đánh tiếp') : '⚠ Không nhặt được · đánh tiếp');
      return;
    }
    if (pFoeDist() < 230) { pRelease('⚔ Có quái sát bên · đánh tiếp'); return; }
    if (PAI.cur != null && !pHasDrop(PAI.cur)) {   // món đã biến mất = nhặt THÀNH CÔNG (kể cả vàng tự vào người)
      PAI.got++; PAI.lastGot = t; PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0;
    }
    if (t - PAI.chk > 700) {   // watchdog: đứng yên 2,8 giây thì bỏ món đang nhắm
      if (PAI.tx != null && Math.hypot(g.self.x - PAI.tx, g.self.y - PAI.ty) < 6) PAI.stuck++;
      else PAI.stuck = 0;
      PAI.tx = g.self.x; PAI.ty = g.self.y; PAI.chk = t;
      if (PAI.stuck >= 4) {
        if (PAI.cur) pSkip.set(PAI.cur, t + 20000);
        PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0; PAI.stuck = 0; PAI.lastGot = t;   // thử món khác, không đứng mãi
      }
    }
    var dr = pBest(t, 560);
    if (!dr) {
      pRelease(PAI.got ? ('✅ Nhặt ' + PAI.got + ' món · đánh tiếp') : '');
      return;
    }
    if (PAI.cur !== dr.id) {
      PAI.cur = dr.id; PAI.tryId = null; PAI.tryAt = 0;
      PAI.stuck = 0; PAI.tx = g.self.x; PAI.ty = g.self.y; PAI.chk = t;
    }
    var nm = pName(dr), d = Math.hypot(dr.x - g.self.x, dr.y - g.self.y);
    if (dr.gold) {   // vàng: chỉ cần đi qua, server tự cộng; KHÔNG gửi 'pickup'
      g.target = null; g.chase = null; g.npcGoal = null;
      go(dr.x, dr.y);
      PAI.lastGot = t;
      pMsg = '💰 Đi qua nhặt ngân lượng · ' + Math.round(d) + 'px' + (PAI.got ? ' · đã ' + PAI.got : '');
      stP(pMsg); return;
    }
    if (d > 72) {
      g.target = null; g.chase = null; g.npcGoal = null;
      go(dr.x, dr.y);
      pMsg = '🧹 Nhặt ' + nm + ' · ' + Math.round(d) + 'px' + (PAI.got ? ' · đã ' + PAI.got : '');
      stP(pMsg); return;
    }
    go(null);
    if (PAI.tryId !== dr.id) {   // chỉ thử 1 lần / món; 1,5 giây vẫn còn thì bỏ 20 giây
      PAI.tryId = dr.id; PAI.tryAt = t; PAI.lastGot = t;
      pEmit = t;
      try { g.socket.emit('pickup', { id: dr.id }); } catch (e) {}
      pMsg = '🧹 Đang nhặt ' + nm; stP(pMsg);
      return;
    }
    if (t - PAI.tryAt > 1500) {
      pSkip.set(dr.id, t + 20000);
      PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0; PAI.stuck = 0; PAI.lastGot = t;
      pMsg = '⚠ Không nhặt được ' + nm + ' · bỏ qua 20s'; stP(pMsg);
    }
  }
  function pickStep() {
    var g = G();
    if (!g.socket || !g.me || !g.self || !g.drops) return false;
    if (g.auto) { pMsg = 'Game đang bật Tự động — tạm nghỉ'; stP(pMsg); return false; }
    if (g.me.dead) { pMsg = 'Đã chết, chờ hồi sinh'; stP(pMsg); return false; }
    var mid = g.map && g.map.id;
    if (mid !== pMap) { pMap = mid; pSkip.clear(); pTry = null; pTrack = null; }
    var t = performance.now();
    if (pSkip.size > 200) pSkip.forEach(function (v, k) { if (v <= t) pSkip.delete(k); });
    var dr = pFind(t);
    if (!dr) { pTry = null; pTrack = null; pMsg = 'Không có món phù hợp'; stP(pMsg); return false; }
    if (pTrack && pTrack.id === dr.id && t - pTrack.t > 7000
      && Math.hypot(g.self.x - pTrack.x, g.self.y - pTrack.y) < 24) {
      pSkip.set(dr.id, t + 30000); pTrack = null; pTry = null;
      pMsg = 'Bỏ qua món không tới được'; stP(pMsg); return false;
    }
    if (!pTrack || pTrack.id !== dr.id) pTrack = { id: dr.id, t: t, x: g.self.x, y: g.self.y };
    var nm = pName(dr), d = Math.hypot(dr.x - g.self.x, dr.y - g.self.y);
    if (dr.gold) {   // vàng tự vào người khi đi qua: chỉ đi tới, không gửi 'pickup'
      if (d > 36) { g.npcGoal = null; g.chase = null; go(dr.x, dr.y); pMsg = 'Tới ' + nm + ' · ' + Math.round(d) + 'px'; stP(pMsg); return true; }
      go(null); g.npcGoal = null;
      if (pTrack && pTrack.id === dr.id && t - pTrack.t > 1500) {
        pSkip.set(dr.id, t + 20000); pTrack = null; pTry = null;
        pMsg = '⚠ Ngân lượng không tự vào · bỏ qua 20s'; stP(pMsg); return false;
      }
      pMsg = '💰 Chờ nhặt ngân lượng'; stP(pMsg); return true;
    }
    if (d > 72) { g.npcGoal = null; g.chase = null; go(dr.x, dr.y); pMsg = 'Tới ' + nm + ' · ' + Math.round(d) + 'px' + (pNear > 1 ? ' · ' + pNear + ' món' : ''); stP(pMsg); return true; }
    go(null); g.npcGoal = null;
    if (pTry && pTry.id === dr.id && t - pTry.t > 1600) {
      pSkip.set(dr.id, t + 20000); pTry = null; pTrack = null;
      pMsg = 'Không nhặt được ' + nm; stP(pMsg); return false;
    }
    if ((!pEmit || t - pEmit > 400) && (!pTry || pTry.id !== dr.id)) {
      pTry = { id: dr.id, t: t }; pEmit = t;
      try { g.socket.emit('pickup', { id: dr.id }); } catch (e) {}
      pMsg = 'Đang nhặt ' + nm; stP(pMsg);
    }
    return true;
  }
  function tickP() {
    if (!P.on) { if (PAI.busy) pRelease(''); stP('Đang tắt'); return; }
    if (!inGame()) { stP('Chờ vào game...'); return; }
    var cmap = G().map && G().map.id;
    if (cmap !== pMap) { pMap = cmap; pSkip.clear(); if (PAI.busy) pRelease(''); }
    if (F.on) {
      if (!P.ts) { if (PAI.busy) pRelease(''); stP('Tạm nghỉ khi Tàn Sát bật'); pMsg = ''; return; }
      if (PAI.busy) { pLootStep(); return; }
      var active = Fst.mode !== 'goup' && Fst.mode !== 'safe';
      if (active && pTryStart('farm')) { pLootStep(); return; }
      var got = pLoot();   // chỉ nhặt món ngay dưới chân khi phiên AI chưa mở (tránh gửi 2 lần)
      stP(got ? '👋 Nhặt ' + got : 'Đang farm · chỉ nhặt dưới chân');
      return;
    }
    if (PAI.busy) pRelease('');
    if (G().auto) { stP('Game đang bật Tự động — tạm nghỉ'); return; }
    pickStep();
  }

  /* ==================== 5. HỒI SINH + LÊN NGỰA ==================== */
  var rv = { since: 0, tries: 0, last: 0 }, mt = { alive: 0, tries: 0, last: 0, rest: 0 };
  function autoReviveMount() {
    var g = G(), n = now();
    if (!g || !g.me || !g.socket || !g.socket.emit || !g.inGame) return;
    var m = g.me;
    if (m.dead) {
      mt.alive = 0; mt.tries = 0;
      if (!S.revive) return;
      if (!rv.since) { rv.since = n; rv.tries = 0; rv.last = 0; }
      if (n - rv.last < 2500) return;
      rv.last = n;
      try { g.socket.emit('respawn', { mode: rv.tries < 3 ? 'here' : 'town' }); } catch (e) {}
      rv.tries++;
      return;
    }
    rv.since = 0;
    if (!mt.alive) mt.alive = n;
    if (!S.mount || n - mt.alive < 3000 || n < mt.rest) return;
    if (!('riding' in m)) return;
    if (m.riding) { mt.tries = 0; return; }
    if (n - mt.last < 4000) return;
    mt.last = n;
    if (mt.tries >= 3) { mt.tries = 0; mt.rest = n + 60000; return; }
    mt.tries++;
    try { g.socket.emit('mount', { op: 'up' }); } catch (e) {}
  }

  /* ==================== 6. BẢO TRÌ: TẢI LẠI + ĐĂNG NHẬP ==================== */
  var M = Object.assign({ on: false, delay: 30, autoEnter: true, remember: false, user: '' }, load('maint', {}));
  var MC = { user: '', pass: '' };
  M.delay = Math.max(5, Math.min(600, Number(M.delay) || 30));
  try {
    var rawC = M.remember ? localStorage.getItem(NS + 'cred') : sessionStorage.getItem(NS + 'cred');
    if (rawC) { var sc = JSON.parse(rawC); MC.user = String(sc.user || ''); MC.pass = String(sc.pass || ''); }
  } catch (e) {}
  if (!MC.user) MC.user = String(M.user || '');
  function saveM() { save('maint', { on: M.on, delay: M.delay, autoEnter: M.autoEnter, remember: M.remember, user: M.user }); }
  function saveC() {
    var raw = JSON.stringify(MC);
    try { sessionStorage.setItem(NS + 'cred', raw); } catch (e) {}
    try { if (M.remember) localStorage.setItem(NS + 'cred', raw); else localStorage.removeItem(NS + 'cred'); } catch (e) {}
  }
  var mTimer = 0, mLoginAt = 0, mEnterAt = 0, mSplash = false, mGame = false;
  var stM = function (m) { setSt('m', m); };
  function mReload(reason) {
    if (!M.on || mTimer) return;
    var sec = M.delay;
    stM('🛠 ' + reason + ' · tải lại sau ' + sec + 's');
    mTimer = setTimeout(function () {
      mTimer = 0;
      try { sessionStorage.setItem(NS + 'reload', '1'); } catch (e) {}
      location.reload();
    }, sec * 1000);
  }
  function mNotice() {
    if (document.getElementById('update-gate')) { mReload('Có bản cập nhật mới'); return true; }
    var txt = '', mm = document.getElementById('modal-msg');
    if (mm && !mm.classList.contains('hidden')) { var mt2 = document.getElementById('modal-text'); if (mt2) txt += ' ' + mt2.textContent; }
    var lm = document.getElementById('login-msg');
    if (lm) txt += ' ' + lm.textContent;
    var s = norm(txt);
    if (s.indexOf('bao tri') >= 0 && s.indexOf('may chu') >= 0) { mReload('Máy chủ bảo trì'); return true; }
    if (s.indexOf('may chu vua cap nhat') >= 0) { mReload('Máy chủ vừa cập nhật'); return true; }
    var g = G();
    if (g && g.config && g.config.maintenance) { mReload('Máy chủ đang bảo trì'); return true; }
    return false;
  }
  function mAuto() {
    var g = G();
    if (g && g.inGame) {
      if (!mGame) { mGame = true; try { sessionStorage.removeItem(NS + 'reload'); } catch (e) {} }
      stM('✅ Đã vào game'); return;
    }
    mGame = false;
    var sp = document.getElementById('splash-start');
    if (sp && !sp.classList.contains('hidden') && !mSplash) { mSplash = true; sp.click(); stM('▶ Bắt đầu game...'); return; }
    var cr = document.getElementById('screen-create');
    if (cr && cr.classList.contains('active')) { stM('⚠ Chưa có nhân vật, cần tạo thủ công'); return; }
    var en = document.getElementById('screen-enter');
    if (en && en.classList.contains('active')) {
      if (!M.autoEnter) { stM('⏸ Đang ở màn vào game (tự vào đang tắt)'); return; }
      if (now() - mEnterAt < 8000) return;
      var eb = document.getElementById('enter-btn');
      if (eb) { mEnterAt = now(); eb.click(); stM('🎮 Đang vào game...'); }
      return;
    }
    var lg = document.getElementById('screen-login');
    if (!lg || !lg.classList.contains('active')) { stM('⏳ Chờ màn hình game...'); return; }
    if (!MC.user || !MC.pass) { stM('⚠ Chưa lưu tài khoản/mật khẩu'); return; }
    var form = document.getElementById('form-login');
    if (!form) return;
    if (form.classList.contains('hidden')) {
      var lt = document.querySelector('[data-auth="login"]');
      if (lt) { lt.click(); stM('🔑 Mở form đăng nhập...'); }
      return;
    }
    var load2 = document.getElementById('loading');
    if (load2 && !load2.classList.contains('hidden')) { stM('⏳ Đang đăng nhập...'); return; }
    var lm2 = document.getElementById('login-msg');
    if (lm2 && lm2.textContent && lm2.textContent.trim()) { stM('⚠ ' + lm2.textContent.trim()); return; }
    if (now() - mLoginAt < 10000) return;
    mLoginAt = now();
    var u = document.getElementById('li-user'), p = document.getElementById('li-pass');
    if (!u || !p) return;
    u.value = MC.user; p.value = MC.pass;
    stM('🔑 Đang đăng nhập...');
    try {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } catch (e) { stM('⚠ Không gửi được form đăng nhập'); }
  }
  function tickM() {
    if (!M.on) { if (mTimer) { clearTimeout(mTimer); mTimer = 0; } stM('Đang tắt'); return; }
    if (mNotice()) return;
    mAuto();
  }
  /* ============================ 7. GIAO DIỆN MỚI ============================ */
  var UI3 = { tab: 'farm', x: null, y: null, px: null, py: null, open: false };
  var STA = { t: 'Sẵn sàng', p: 'Sẵn sàng', m: 'Sẵn sàng', map: '—' };
  var STK = { farm: 't', pick: 'p', maint: 'm', map: 'map', t: 't', p: 'p', m: 'm' };
  function setSt(k, m) {
    var map = STK[k] || k;
    if (STA[map] === m) return;
    STA[map] = m;
    paintSt();
  }
  function stT(m) { setSt('t', m); }
  function stP(m) { setSt('p', m); }

  var CSS = ''
    + '#vla3{position:fixed;z-index:2147483000;width:344px;max-width:94vw;right:12px;bottom:76px;'
    + 'display:flex;flex-direction:column;max-height:calc(100vh - 92px);max-height:calc(100dvh - 92px);'
    + 'background:linear-gradient(160deg,rgba(14,22,28,.97),rgba(9,14,18,.98));border:1px solid rgba(94,234,212,.28);'
    + 'border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06);'
    + 'color:#dbeaf0;font:13px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden;backdrop-filter:blur(14px)}'
    + '#vla3.hide{display:none}'
    + '#vla3 .h{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;touch-action:none;user-select:none;-webkit-user-select:none;'
    + 'background:radial-gradient(120% 140% at 0% 0%,rgba(94,234,212,.18),transparent 60%)}'
    + '#vla3 .h b{font-size:13px;letter-spacing:.12em;color:#5eead4}'
    + '#vla3 .h .v{font-size:9.5px;letter-spacing:.08em;padding:2px 6px;border-radius:6px;background:rgba(94,234,212,.14);color:#9df3e2}'
    + '#vla3 .h .x{margin-left:auto;font-style:normal;cursor:pointer;padding:2px 6px;border-radius:8px;color:#8fa6b2}'
    + '#vla3 .h .x:hover{background:rgba(255,255,255,.08);color:#fff}'
    + '#vla3 .seg{position:relative;display:flex;padding:0 8px;border-bottom:1px solid rgba(255,255,255,.07)}'
    + '#vla3 .seg button{flex:1;background:none;border:0;color:#7e97a3;padding:8px 0 9px;font:inherit;font-size:10.5px;cursor:pointer;'
    + 'display:flex;flex-direction:column;align-items:center;gap:2px;line-height:1}'
    + '#vla3 .seg button.on{color:#5eead4}'
    + '#vla3 .seg .ind{position:absolute;left:8px;bottom:-1px;width:calc((100% - 16px)/4);height:2px;border-radius:2px;'
    + 'background:linear-gradient(90deg,#5eead4,#38bdf8);transition:transform .18s ease}'
    + '#vla3 .h,#vla3 .seg,#vla3 .ft{flex:0 0 auto}'
    + '#vla3 .bd{flex:1 1 auto;min-height:0;max-height:min(62vh,470px);overflow:auto;padding:10px 12px 6px}'
    + '#vla3 .pg{display:none}#vla3 .pg.on{display:block}'
    + '#vla3 .lg{display:flex;align-items:center;gap:8px;margin:0 0 8px}'
    + '#vla3 .lg .t1{font-size:12px;font-weight:600;color:#eaf6fa}'
    + '#vla3 .lg .t2{font-size:10px;color:#7e97a3;margin-left:auto}'
    + '#vla3 .sw{position:relative;width:46px;height:26px;border-radius:14px;border:1px solid rgba(255,255,255,.14);'
    + 'background:rgba(255,255,255,.07);cursor:pointer;padding:0;flex:0 0 auto;transition:background .18s,border-color .18s}'
    + '#vla3 .sw i{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#93a7b3;transition:transform .18s,background .18s}'
    + '#vla3 .sw[aria-pressed="true"]{background:rgba(94,234,212,.22);border-color:rgba(94,234,212,.55)}'
    + '#vla3 .sw[aria-pressed="true"] i{transform:translateX(20px);background:#5eead4}'
    + '#vla3 .chs{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 10px}'
    + '#vla3 .ch{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#9db2bd;border-radius:999px;'
    + 'padding:4px 10px;font:inherit;font-size:10.5px;cursor:pointer;white-space:nowrap}'
    + '#vla3 .ch[aria-pressed="true"]{background:rgba(94,234,212,.16);border-color:rgba(94,234,212,.5);color:#b9f7ec}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="rare"]{background:rgba(79,163,255,.18);border-color:rgba(79,163,255,.62);color:#cfe4ff}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="epic"]{background:rgba(192,96,255,.18);border-color:rgba(192,96,255,.62);color:#eed6ff}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="legendary"]{background:rgba(255,155,47,.18);border-color:rgba(255,155,47,.62);color:#ffe2bd}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="common"]{background:rgba(226,232,240,.14);border-color:rgba(226,232,240,.5);color:#eef4f8}'
    + '#vla3 .card{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:8px 10px;margin:0 0 8px}'
    + '#vla3 .card .k{font-size:9.5px;letter-spacing:.08em;color:#6f8794;text-transform:uppercase}'
    + '#vla3 .card .v{font-size:12.5px;color:#eaf6fa;margin-top:2px;word-break:break-word}'
    + '#vla3 .bar{height:5px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:6px}'
    + '#vla3 .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f87171,#fbbf24);transition:width .25s}'
    + '#vla3 .list{display:flex;flex-direction:column;gap:4px;margin-top:2px}'
    + '#vla3 .it{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;cursor:pointer;'
    + 'background:rgba(255,255,255,.03);border:1px solid transparent}'
    + '#vla3 .it:hover{background:rgba(255,255,255,.07)}'
    + '#vla3 .it.on{background:rgba(94,234,212,.1);border-color:rgba(94,234,212,.28)}'
    + '#vla3 .it .nm{font-size:12px;color:#dbeaf0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '#vla3 .it .lv{font-size:9.5px;color:#7e97a3}'
    + '#vla3 .it .tm{margin-left:auto;font-size:10.5px;color:#8fa6b2;font-variant-numeric:tabular-nums}'
    + '#vla3 .it .tm.live{color:#fb7185;font-weight:700}'
    + '#vla3 .it .tm.ok{color:#5eead4}'
    + '#vla3 .it .tm.bad{color:#fb7185}'
    + '#vla3 .it .tm.lock{color:#fbbf24}'
    + '#vla3 #vla3-maplist{max-height:44vh}'
    + '#vla3 #vla3-maplist .it .lv{font-size:9px;color:#5f7480}'
    + '#vla3 #vla3-maplist .it .tm{margin-left:auto;white-space:nowrap}'
    + '#vla3 .it .ck{width:14px;height:14px;border-radius:4px;border:1px solid rgba(255,255,255,.22);flex:0 0 auto}'
    + '#vla3 .it.on .ck{background:#5eead4;border-color:#5eead4}'
    + '#vla3 .inp{background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.14);color:#eaf6fa;border-radius:8px;'
    + 'padding:5px 7px;font:inherit;font-size:12px;min-width:0;flex:1}'
    + '#vla3 .ft{display:flex;align-items:center;gap:6px;padding:8px 12px;border-top:1px solid rgba(255,255,255,.07);'
    + 'font-size:10.5px;color:#93a7b3;background:rgba(0,0,0,.22);min-height:32px}'
    + '#vla3 .ft .dot{width:7px;height:7px;border-radius:50%;background:#5eead4;box-shadow:0 0 8px #5eead4;flex:0 0 auto}'
    + '#vla3 .ft span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '#vla3 .hint{font-size:10px;color:#6f8794;margin:6px 0 0;line-height:1.4}'
    + '#vla3 .mini{display:flex;gap:6px;margin:2px 0 8px}'
    + '#vla3 .mini button{flex:1;background:rgba(94,234,212,.1);border:1px solid rgba(94,234,212,.3);color:#b9f7ec;'
    + 'border-radius:9px;padding:6px 0;font:inherit;font-size:10.5px;cursor:pointer}'
    + '#vla3 .mini button.g{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.14);color:#9db2bd}'
    + '#vla3-orb{position:fixed;z-index:2147483000;right:14px;bottom:16px;width:52px;height:52px;border-radius:50%;'
    + 'background:radial-gradient(circle at 35% 30%,#164e4a,#0a1a1e);border:1px solid rgba(94,234,212,.45);'
    + 'box-shadow:0 8px 24px rgba(0,0,0,.5),0 0 0 0 rgba(94,234,212,.4);color:#5eead4;font-size:20px;cursor:pointer;'
    + 'display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;-webkit-user-select:none}'
    + '#vla3-orb i{position:absolute;right:-1px;top:-1px;width:11px;height:11px;border-radius:50%;background:#64748b;border:2px solid #0a1a1e}'
    + '#vla3-orb.run i{background:#5eead4;box-shadow:0 0 10px #5eead4}'
    + '#vla3-orb.warn i{background:#fbbf24;box-shadow:0 0 10px #fbbf24}';

  var sty = document.createElement('style'); sty.id = 'vla3-style'; sty.textContent = CSS; document.head.appendChild(sty);
  var root = document.createElement('div'); root.id = 'vla3'; root.className = 'hide';
  root.innerHTML = ''
    + '<div class="h" id="vla3-h"><b>VÕ LÂM</b><span class="v">AUTO 3</span><i class="x" data-a="close">✕</i></div>'
    + '<div class="seg"><button data-t="farm" class="on">⚔<b>Tàn Sát</b></button>'
    + '<button data-t="pick">🖐<b>Nhặt</b></button><button data-t="maint">🛠<b>Bảo trì</b></button>'
    + '<button data-t="map">🗺<b>Map</b></button><div class="ind"></div></div>'
    + '<div class="bd">'
    + ' <div class="pg on" data-p="farm">'
    + '  <div class="lg"><span class="t1">Tàn Sát</span><button class="sw" data-on="farm" aria-pressed="false"><i></i></button><span class="t2" id="vla3-ft">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-k="keepUp" aria-pressed="false">📌 Giữ map up</button>'
    + '   <button class="ch" data-k="fmount" aria-pressed="true">Lên ngựa</button>'
    + '   <button class="ch" data-k="fast" aria-pressed="true">🐎 Xa Phu teleport</button>'
    + '   <button class="ch" data-k="hideTp" aria-pressed="true">Ẩn bảng Xa Phu</button>'
    + '   <button class="ch" data-k="revive" aria-pressed="true">Hồi sinh</button></div>'
    + '  <div class="mini"><button data-a="up">Lưu map này</button><button class="g" data-a="upclear">Bỏ map up</button></div>'
    + '  <div class="card"><div class="k">Map up</div><div class="v" id="vla3-up">—</div></div>'
    + '  <div class="card"><div class="k">Trạng thái</div><div class="v" id="vla3-fs">—</div></div>'
    + ' </div>'
    + ' <div class="pg" data-p="pick">'
    + '  <div class="lg"><span class="t1">Tự nhặt</span><button class="sw" data-on="pick" aria-pressed="false"><i></i></button><span class="t2" id="vla3-pt">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-k="gold" aria-pressed="true">Ngân lượng</button>'
    + '   <button class="ch" data-k="pots" aria-pressed="true">Thuốc</button>'
    + '   <button class="ch" data-k="mats" aria-pressed="true">Nguyên liệu</button>'
    + '   <button class="ch" data-k="books" aria-pressed="true">Sách</button>'
    + '   <button class="ch" data-k="ts" aria-pressed="true">Nhặt khi farm</button>'
    + '   <button class="ch" data-k="before" aria-pressed="true">🧹 Nhặt trước khi đánh</button></div>'
    + '  <div class="lg" style="margin-top:2px"><span class="t1">Phẩm chất trang bị</span><span class="t2" id="vla3-min">Thường</span></div>'
    + '  <div class="chs"><button class="ch q" data-q="common" aria-pressed="true">Thường</button>'
    + '   <button class="ch q" data-q="rare" aria-pressed="false">Lam</button>'
    + '   <button class="ch q" data-q="epic" aria-pressed="false">Tím</button>'
    + '   <button class="ch q" data-q="legendary" aria-pressed="false">Cam</button></div>'
    + '  <div class="mini"><button data-a="r-400">Gần</button><button data-a="r-700">Vừa</button><button data-a="r-1000">Xa</button></div>'
    + '  <div class="card"><div class="k">Trạng thái</div><div class="v" id="vla3-ps">—</div></div>'
    + '  <p class="hint">Bật “Nhặt trước khi đánh”: thấy đồ trong tầm và không có quái sát bên (240px) thì tạm dừng đánh, đi nhặt hết rồi đánh tiếp. Đồ ngay dưới chân luôn được nhặt; món không tới được sẽ bị bỏ qua 20 giây.</p>'
    + ' </div>'
    + ' <div class="pg" data-p="maint">'
    + '  <div class="lg"><span class="t1">Bảo trì + đăng nhập</span><button class="sw" data-on="maint" aria-pressed="false"><i></i></button><span class="t2" id="vla3-mt">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-k="autoEnter" aria-pressed="true">Tự vào game</button>'
    + '   <button class="ch" data-k="remember" aria-pressed="false">Nhớ mật khẩu</button></div>'
    + '  <div class="card"><div class="k">Tài khoản</div><div class="v" style="display:flex;gap:6px;margin-top:4px">'
    + '   <input class="inp" id="vla3-u" placeholder="tài khoản" autocomplete="off"><input class="inp" id="vla3-p" type="password" placeholder="mật khẩu" autocomplete="off"></div></div>'
    + '  <div class="card"><div class="k">Tải lại sau (giây)</div><div class="v" style="display:flex;gap:6px;margin-top:4px">'
    + '   <input class="inp" id="vla3-d" type="number" min="5" max="600" value="30"></div></div>'
    + '  <div class="mini"><button data-a="msave">Lưu</button><button class="g" data-a="mclear">Xoá tài khoản</button></div>'
    + '  <div class="card"><div class="k">Trạng thái</div><div class="v" id="vla3-ms">—</div></div>'
    + ' </div>'
    + ' <div class="pg" data-p="map">'
    + '  <div class="lg"><span class="t1">Bản đồ · Xa Phu</span><span class="t2" id="vla3-mapn">—</span></div>'
    + '  <div class="list" id="vla3-maplist"></div>'
    + '  <p class="hint">Danh sách lấy từ dữ liệu game (48 map). ✓ Xa Phu tới được · 🔒 chưa đủ cấp · ✗ server đã từ chối · — không đi bằng Xa Phu.</p>'
    + ' </div>'
    + '</div>'
    + '<div class="ft"><span class="dot" id="vla3-dot"></span><span id="vla3-st">Sẵn sàng</span></div>';
  var orb = document.createElement('div');
  orb.id = 'vla3-orb'; orb.innerHTML = '⚔<i></i>'; orb.title = 'Võ Lâm Auto 3';
  document.body.appendChild(root); document.body.appendChild(orb);

  function q(sel) { return root.querySelector(sel); }
  function page(tab) {
    UI3.tab = tab;
    root.querySelectorAll('.seg button').forEach(function (b, i) {
      var on = b.getAttribute('data-t') === tab;
      b.classList.toggle('on', on);
      if (on) q('.seg .ind').style.transform = 'translateX(' + (i * 100) + '%)';
    });
    root.querySelectorAll('.pg').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-p') === tab); });
    paintSt();
    if (typeof clampPanel === 'function') clampPanel();
  }
  function paintSt() {
    var m = STA[STK[UI3.tab]] || 'Sẵn sàng';
    var el = document.getElementById('vla3-st');
    if (el && el.textContent !== m) el.textContent = m;
    var o = document.getElementById('vla3-orb');
    if (!o) return;
    var running = F.on || P.on || M.on;
    o.classList.toggle('run', running);
    o.classList.toggle('warn', !running);
  }
  function sw(el, on) {
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function syncUI() {
    var ft = document.getElementById('vla3-ft'); if (ft) ft.textContent = F.on ? 'bật' : 'tắt';
    var pt = document.getElementById('vla3-pt'); if (pt) pt.textContent = P.on ? 'bật' : 'tắt';
    var mt2 = document.getElementById('vla3-mt'); if (mt2) mt2.textContent = M.on ? 'bật' : 'tắt';
    root.querySelectorAll('[data-on]').forEach(function (b) {
      var k = b.getAttribute('data-on');
      sw(b, k === 'farm' ? F.on : k === 'pick' ? P.on : M.on);
    });
    root.querySelectorAll('.ch[data-k]').forEach(function (b) {
      var k = b.getAttribute('data-k');
      var on = k in S ? S[k] : k in P ? P[k] : k === 'keepUp' ? F.keepUp : k === 'fmount' ? S.mount
        : k === 'autoEnter' ? M.autoEnter : k === 'remember' ? M.remember : false;
      sw(b, !!on);
    });
    var curMin = String(P.min || 'common').toLowerCase();
    if (!(curMin in RANK)) curMin = 'common';
    root.querySelectorAll('[data-q]').forEach(function (b) {
      sw(b, String(b.getAttribute('data-q')).toLowerCase() === curMin);
    });
    var mn = document.getElementById('vla3-min'); if (mn) mn.textContent = RQ[curMin] || 'Thường';
    var u = document.getElementById('vla3-u'), p = document.getElementById('vla3-p'), d = document.getElementById('vla3-d');
    if (u && document.activeElement !== u) u.value = MC.user || '';
    if (p && document.activeElement !== p) p.value = MC.pass || '';
    if (d && document.activeElement !== d) d.value = String(M.delay);
    var up = document.getElementById('vla3-up');
    if (up) up.textContent = F.upMap != null ? mapName(F.upMap) : 'chưa lưu';
    var fs = document.getElementById('vla3-fs'); if (fs) fs.textContent = STA.t;
    var ps = document.getElementById('vla3-ps'); if (ps) ps.textContent = STA.p;
    var ms = document.getElementById('vla3-ms'); if (ms) ms.textContent = STA.m;
    paintSt();
  }
  function uiMaps() {
    var box = document.getElementById('vla3-maplist');
    if (!box) return;
    var g = G(), lv = (g && g.me && g.me.level) || 1;
    var ids = Object.keys(GAMEMAPS);
    var ok = 0;
    for (var i = 0; i < ids.length; i++) if (tpOk(ids[i])) ok++;
    var lbl = document.getElementById('vla3-mapn');
    if (lbl) lbl.textContent = ok + '/' + ids.length + ' map';
    var sig = ok + '|' + lv + '|' + Object.keys(TPBAD).length;
    if (box.getAttribute('data-sig') === sig) return;
    box.setAttribute('data-sig', sig);
    box.innerHTML = ids.map(function (id) {
      var m = GAMEMAPS[id], cand = tpCand(id), bad = !!TPBAD[id], lock = lv < tpMinLv(id);
      var tag = !cand ? '—' : bad ? '✗' : lock ? ('🔒 Lv' + tpMinLv(id)) : '✓';
      var cls = !cand ? '' : bad ? 'bad' : lock ? 'lock' : 'ok';
      var fl = (m[2] ? '🏯' : '') + (m[3] ? '🏮' : '');
      return '<div class="it"><span class="nm">' + esc(m[0]) + '</span><span class="lv">' + esc(id) + '</span>'
        + '<span class="tm ' + cls + '">' + fl + ' ' + tag + '</span></div>';
    }).join('');
  }

  function uiList() { uiMaps(); }

  root.querySelector('.seg').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-t]');
    if (b) page(b.getAttribute('data-t'));
  });
  root.addEventListener('click', function (e) {
    var t = e.target, a = t.closest('[data-a]'), on = t.closest('[data-on]'), ch = t.closest('.ch[data-k]'), q = t.closest('[data-q]');
    if (a) {
      var k = a.getAttribute('data-a');
      if (k === 'close') { closePanel(); return; }
      if (k === 'up') { F.upMap = G() && G().map ? G().map.id : null; F.keepUp = true; saveF(); }
      else if (k === 'upclear') { F.upMap = null; F.keepUp = false; saveF(); }
      else if (k === 'r-400') { P.range = 400; saveP(); }
      else if (k === 'r-700') { P.range = 700; saveP(); }
      else if (k === 'r-1000') { P.range = 1000; saveP(); }
      else if (k === 'msave') {
        var u = document.getElementById('vla3-u'), p = document.getElementById('vla3-p'), d = document.getElementById('vla3-d');
        MC.user = u ? u.value.trim() : MC.user; MC.pass = p ? p.value : MC.pass;
        M.user = MC.user; M.delay = Math.max(5, Math.min(600, Number(d && d.value) || 30));
        saveM(); saveC(); setSt('m', '💾 Đã lưu tài khoản');
      } else if (k === 'mclear') { MC.user = ''; MC.pass = ''; M.user = ''; saveM(); saveC(); setSt('m', 'Đã xoá tài khoản'); }
      syncUI(); uiList(); return;
    }
    if (on) {
      var kk = on.getAttribute('data-on');
      if (kk === 'farm') { F.on = !F.on; T.farm.dest = null; }
      if (kk === 'pick') P.on = !P.on;
      if (kk === 'maint') { M.on = !M.on; if (!M.on && mTimer) { clearTimeout(mTimer); mTimer = 0; } }
      saveF(); saveP(); saveM();
      syncUI(); return;
    }
    if (q) {   // phẩm chất: chọn một (radio), không phải bật/tắt
      var qv = String(q.getAttribute('data-q') || 'common').toLowerCase();
      P.min = (qv in RANK) ? qv : 'common';
      saveP(); syncUI(); return;
    }
    if (ch) {
      var ck = ch.getAttribute('data-k');
      if (ck in S) { S[ck] = !S[ck]; saveS(); }
      else if (ck in P) { P[ck] = !P[ck]; saveP(); }
      else if (ck === 'keepUp') { F.keepUp = !F.keepUp; if (F.keepUp && F.upMap == null && G() && G().map) F.upMap = G().map.id; saveF(); }
      else if (ck === 'fmount') { S.mount = !S.mount; saveS(); }
      else if (ck === 'autoEnter') { M.autoEnter = !M.autoEnter; saveM(); }
      else if (ck === 'remember') { M.remember = !M.remember; saveM(); saveC(); }
      syncUI(); return;
    }
  });
  root.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('change', function () {
      if (el.id === 'vla3-d') { M.delay = Math.max(5, Math.min(600, Number(el.value) || 30)); saveM(); }
    });
  });

  function openPanel() { root.classList.remove('hide'); UI3.open = true; page(UI3.tab); syncUI(); uiList(); clampPanel(); save('ui2', UI3); }
  function closePanel() { root.classList.add('hide'); UI3.open = false; save('ui2', UI3); }

  // Kéo THANH TIÊU ĐỀ để di chuyển cả bảng (trước đây kéo nhầm vào chính thanh tiêu đề nên bảng đứng im)
  function drag(handle, target, store, onTap) {
    var d = null;
    function move(e) {
      if (!d) return;
      if (d.id != null && e.pointerId !== d.id) return;
      var dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) d.mv = 1;
      if (!d.mv) return;
      try { e.preventDefault(); } catch (er) {}
      var w = target.offsetWidth || 344;
      var h = target.offsetHeight || 200;
      var head = Math.min(h, 56); // luôn để thanh tiêu đề trong màn hình
      var l = Math.max(4, Math.min(innerWidth - w - 4, d.l + dx));
      var t = Math.max(4, Math.min(innerHeight - head - 4, d.t + dy));
      target.style.left = l + 'px'; target.style.top = t + 'px';
      target.style.right = 'auto'; target.style.bottom = 'auto';
    }
    function up(e) {
      if (!d) return;
      var moved = d.mv; d = null;
      if (moved) {
        var r = target.getBoundingClientRect();
        store(Math.round(r.left), Math.round(r.top));
        if (target === root) clampPanel();
      } else if (onTap) onTap();
    }
    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-a],[data-on],.ch,.seg,input')) return;
      try { e.preventDefault(); e.stopPropagation(); } catch (er) {}
      var r = target.getBoundingClientRect();
      d = { x: e.clientX, y: e.clientY, l: r.left, t: r.top, mv: 0, id: e.pointerId };
      try { handle.setPointerCapture(e.pointerId); } catch (er) {}
    });
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', function () { d = null; });
    // dự phòng khi trình duyệt/game chặn pointer trên phần tử: nghe thêm ở window
    try {
      window.addEventListener('pointermove', function (e) { if (d) move(e); }, true);
      window.addEventListener('pointerup', function (e) { if (d) up(e); }, true);
    } catch (er) {}
  }
  drag(document.getElementById('vla3-h'), root, function (l, t) { UI3.x = l; UI3.y = t; save('ui2', UI3); });
  drag(orb, orb, function (l, t) { UI3.px = l; UI3.py = t; save('ui2', UI3); }, function () { UI3.open ? closePanel() : openPanel(); });

  // Giữ bảng + nút tròn luôn nằm trong khung nhìn (kể cả xoay ngang/dọc, đổi tab cao thấp)
  function clampPanel() {
    var visible = !root.classList.contains('hide');
    var w = root.offsetWidth || 344;
    var h = root.offsetHeight || 0;
    var head = Math.min(h || 56, 56);
    var maxY = Math.max(4, innerHeight - head - 4); // không cho đẩy thanh tiêu đề ra khỏi màn hình
    var maxX = Math.max(4, innerWidth - w - 4);
    var x = UI3.x, y = UI3.y;
    if (x == null || y == null) {
      if (!visible) { fitOrb(); return; } // đang ẩn: giữ nguyên neo CSS, không nhảy về góc trên
      var cur = root.getBoundingClientRect();
      x = cur.left; y = cur.top;
    }
    x = Math.max(4, Math.min(maxX, x));
    y = Math.max(4, Math.min(maxY, y));
    UI3.x = x; UI3.y = y;
    root.style.left = x + 'px'; root.style.top = y + 'px';
    root.style.right = 'auto'; root.style.bottom = 'auto';
    // chặn đáy: chiều cao tối đa = khoảng trống còn lại bên dưới mép trên
    var room = Math.max(140, innerHeight - y - 12);
    root.style.maxHeight = room + 'px';

    fitOrb();
  }
  function fitOrb() {
    var o = document.getElementById('vla3-orb');
    if (!o) return;
    var s = o.offsetWidth || 52;
    var ox = UI3.px, oy = UI3.py;
    if (ox == null || oy == null) { o.style.right = '14px'; o.style.bottom = '16px'; o.style.left = 'auto'; o.style.top = 'auto'; return; }
    ox = Math.max(4, Math.min(innerWidth - s - 4, ox));
    oy = Math.max(4, Math.min(innerHeight - s - 4, oy));
    UI3.px = ox; UI3.py = oy;
    o.style.left = ox + 'px'; o.style.top = oy + 'px'; o.style.right = 'auto'; o.style.bottom = 'auto';
  }
  function place() { clampPanel(); }

  (function init() {
    try { localStorage.removeItem(NS + 'boss'); } catch (e) {}   // dọn cấu hình Boss của bản cũ
    var saved = load('ui2', null);
    if (saved) { UI3 = Object.assign(UI3, saved); }
    // Bản cũ lưu open:true nên cứ vào game là tự mở; lần này tôn trọng trạng thái đã lưu, mặc định đóng.
    if (UI3.open === true) root.classList.remove('hide'); else root.classList.add('hide');
    var t0 = UI3.tab;
    if (t0 !== 'farm' && t0 !== 'pick' && t0 !== 'maint' && t0 !== 'map') t0 = 'farm';
    page(t0); syncUI(); uiList();
    if (!root.isConnected) document.body.appendChild(root);
    clampPanel();
    addEventListener('resize', clampPanel);
    addEventListener('orientationchange', function () { setTimeout(clampPanel, 250); });
    try {
      if (window.visualViewport) window.visualViewport.addEventListener('resize', clampPanel);
    } catch (er) {}
  })();

  /* ============================ 8. VÒNG CHẠY ============================ */
  every(250, farmTick, '[VLA3-farm]');
  every(400, tickP, '[VLA3-pick]');
  every(1000, autoReviveMount, '[VLA3-life]');
  every(1000, tickM, '[VLA3-maint]');
  every(500, function () { if (inGame()) { hookSocket(); hookNpc(); syncUI(); uiList(); } }, '[VLA3-ui]');

  A.destroy = function () {
    A.timers.forEach(clearInterval);
    if (mTimer) clearTimeout(mTimer);
    ['#vla3', '#vla3-orb', '#vla3-style'].forEach(function (s) {
      var el = document.querySelector(s); if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    Fst.mode = 'idle';
    try { delete window.__VLA3; } catch (e) { window.__VLA3 = null; }
  };
  A.state = { F: F, P: P, M: M, S: S, T: T, STA: STA, UI3: UI3 };
  A.ui = { page: page, open: openPanel, close: closePanel, sync: syncUI, list: uiList };
  A.farm = { cfg: F, st: Fst, ai: FA, pat: PAT, mv: MV, brain: AI, osc: OSC, jolt: jolt, watchOsc: watchOsc, mvSet: mvSet, skRange: skRange, radPx: radPx };
  A.pick = { cfg: P, ok: pOK, find: pFind, rank: rk, RANK: RANK, ai: PAI };   // QA: lọc phẩm chất + AI nhặt
  A.maps = { table: GAMEMAPS, noTp: NO_TP, bad: TPBAD, cand: tpCand, ok: tpOk, minLv: tpMinLv,
             name: mapName, serves: tpServes, pick: tpPick, render: uiMaps };   // QA: bảng bản đồ + Xa Phu
  console.log('[VLA3] Võ Lâm Auto 3.5.1 đã tải');
})();
}, 800);



