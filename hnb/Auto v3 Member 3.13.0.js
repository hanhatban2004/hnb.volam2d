// ==UserScript==
// @name         Võ Lâm Auto 3 - Member
// @namespace    vlpx.auto3.member
// @version      3.13.0
// @description  Bản Member: Tàn Sát (tự đổi khu ít người / tránh Đồ sát, giữ map up) + Tự nhặt đồ với AI nhặt an toàn (tự tính độ nguy hiểm theo máu và số quái quanh người, chỉ nhặt khi an toàn) + lọc phẩm chất + tự bán đồ rác theo phẩm chất + Hồi sinh & tự lên ngựa + Bảo trì & tự đăng nhập + Bảng 48 map & Xa Phu nhanh. [MENU MỚI 30.10] Toàn bộ menu cũ được làm lại: 8 tab riêng biệt (Tổng quan / Tàn Sát / Đổi khu / Nhặt & Bán / Tổ đội / Bản đồ / Bảo trì / Cài đặt), thanh tab cuộn ngang dạng viên thuốc, tab Tổng quan có công tắc nhanh + nút Bật tất cả / Dừng tất cả, tab Cài đặt có cỡ bảng 80-120% và cỡ chữ 11-16px (4 công tắc chung Xa Phu/Hồi sinh/Lên ngựa Ẩn bảng giờ nằm trong tab Cài đặt). SỬA LỖI LỚN: khai báo PARTY_INV (tự nhận lời mời tổ đội) nằm SAU phần khởi động nên khi tải script bị dừng giữa chừng - đây chính là lý do chức năng tổ đội không bao giờ chạy.
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
  var A = window.__VLA3 = { timers: [], offs: [], ver: '3.13.0' };

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
  function fmt(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + 'p' + ('0' + s % 60).slice(-2) + 's'; }

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
    if (!g || !g.socket) return;
    partyBind(g.socket);
    pDmgHook();   // [3.12.0] gắn sự kiện 'dmg' ngay khi có socket, không phụ thuộc ô Tự nhặt
    if (g.socket.__vla3) return;
    g.socket.__vla3 = 1;
    hookNpc();
    g.socket.on('channels', function (d) { khuGot(d); });   // [3.10.0] máy chủ trả danh sách khu
    g.socket.on('npc', function (d) {
      if (!d || !d.teleports) return;
      var cm = G().map && G().map.id, list = d.teleports.map(function (x) { return x.map; });
      tpLearn(cm, d.id, list);
      [T.farm].forEach(function (t) { if (t.map === cm) { t.list = list; t.tries = 0; } });
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
  /* ==================== 2. CÀI ĐẶT CHUNG + TÀN SÁT ====================
     Bản Member chỉ giữ cấu hình dùng chung của game (S) và Tàn Sát (F).
     Đã bỏ hẳn: tab Boss, Đào khoáng và Tốc độ. */
  var S = Object.assign({ hideTp: true, fast: true, revive: true, mount: true }, load('cfg', {}));
  var F = Object.assign({ on: false, keepUp: false, upMap: null }, load('farm', {}));
  var PARTY = Object.assign({ on: false }, load('party', {}));
  function saveParty() { save('party', { on: PARTY.on }); }
  var PARTY_INV = Object.assign({ on: false, r: 600, cool: 120000, gap: 5000 }, load('partyInv', {}));
  function saveF() { save('farm', { on: F.on, keepUp: F.keepUp, upMap: F.upMap }); }
  function saveS() { save('cfg', { hideTp: S.hideTp, fast: S.fast, revive: S.revive, mount: S.mount }); }

  var T = { farm: newTrip('Tàn Sát') };
  var Fst = { mode: 'idle', target: 0, cand: 0, candN: 0 };

  function mname(m) { try { return ((G().data.monsters || {})[m.type] || {}).name || String(m.type); } catch (e) { return String(m.type); } }
  function pctOf(m) { return m.maxHp ? Math.round(Math.max(0, m.hp) / m.maxHp * 100) : 0; }

  function fight(m) {
    var g = G(), me = g.me, s = g.self, sk = g.mySkills() || [];
    stopAuto(g);
    g.target = m.id; g.npcGoal = null; g.chase = null;
    var d = dist(m, s), used = false, order = [7, 6, 5, 3, 4, 2, 1, 0];
    for (var k = 0; k < order.length; k++) {
      var i = order[k], v = sk[i];
      if (!v || !v.learned || me.level < (v.lv || 1) || !g.skillReady(i) || me.mp < (v.mp || 0) || v.type === 'passive') continue;
      if (v.type === 'buff') {
        if (!me.buffs.some(function (x) { return x.name === v.name; })) { g.useSkill(i); used = true; break; }
        continue;
      }
      if (v.type === 'heal') {
        if (me.hp < me.stats.maxHp * 0.6) { g.useSkill(i); used = true; break; }
        continue;
      }
      var rng = (v.type === 'aoe' && !v.range ? (v.radius || 3) * TILE : (v.range || g.myRange())) * 0.85;
      if (d > rng) { if (i === 0) go(m.x, m.y); continue; }
      go(null); g.useSkill(i); used = true; break;
    }
    if (!used && d > 150) go(m.x, m.y);
  }

  /* ============================ 3. TÀN SÁT ============================ */
  function farmTarget() {
    var g = G(), s = g.self, cur = null, curD = 0, b = null, bd = 1e9;
    g.monsters.forEach(function (m) {
      if (m.hp <= 0 || m.boss) return;
      if (F.keepUp && F.upMap != null && g.map.id !== F.upMap) return;
      var d = dist(m, s);
      if (m.id === Fst.target) { cur = m; curD = d; }
      if (d < bd) { bd = d; b = m; }
    });
    if (!cur) { Fst.cand = 0; Fst.candN = 0; return b; }
    if (!b || b.id === cur.id || bd > curD * 0.65) { Fst.cand = 0; Fst.candN = 0; return cur; }
    // đổi mục tiêu cần 2 nhịp liên tiếp -> không nhảy qua nhảy lại
    Fst.candN = (Fst.cand === b.id) ? Fst.candN + 1 : 1;
    Fst.cand = b.id;
    if (Fst.candN >= 2) { Fst.candN = 0; return b; }
    return cur;
  }

  function farmTick() {
    if (!inGame()) return;
    hookSocket();
    var g = G(), n = now();
    if (!F.on) { Fst.mode = 'idle'; stT('Đang tắt'); return; }
    if (g.me.dead) { Fst.mode = 'idle'; stT('Đã chết, chờ hồi sinh'); return; }
    if (F.keepUp && F.upMap == null) { Fst.mode = 'idle'; stT('👉 Bấm “Lưu map này”'); return; }
    if (PAI.busy) { stT('⏸ Nhặt đồ rồi đánh tiếp'); return; }              // [3.6.3] đang nhặt thì KHÔNG đánh
    PAI.hx = g.self.x; PAI.hy = g.self.y;   // [3.6.5] đứng chỗ nào thì Tầm nhặt đồ tính quanh chỗ đó
    if (pTryStart('farm')) { pLootStep(); stT('🧹 Nhặt đồ rồi đánh tiếp'); return; }   // [3.6.3] nhặt HẾT đồ trong tầm rồi mới đánh

    // về map up nếu đang lạc
    if (F.keepUp && F.upMap != null && g.map.id !== F.upMap) {
      Fst.mode = 'goup';
      var r = trip(T.farm, F.upMap, { tp: S.fast !== false, who: 'farm', st: stT });
      if (r === 'blocked') stT('🧭 Không có đường về ' + mapName(F.upMap));
      return;
    }
    var tgt = farmTarget();
    if (!tgt) { Fst.mode = 'idle'; stT('🔍 Tìm quái quanh đây...'); return; }
    Fst.mode = 'farm'; Fst.target = tgt.id;
    fight(tgt);
    stT('⚔ ' + mname(tgt) + ' · ' + Math.round(dist(tgt, g.self)) + 'px');
  }
  /* ============ 3B. ĐỔI KHU (trong tab Tàn Sát) — khu ít người + tránh Đồ sát ============
     [3.10.0] Dùng đúng API thật của game (đã tra mã nguồn):
       - Số khu: G.map.chs ; khu đang đứng: G.map.ch
       - Hỏi danh sách khu: socket.emit('channels') -> máy chủ trả 'channels'
         { name, list: [ { ch, n, cap, cur } ] }              (game.js:382)
       - Đổi khu:          socket.emit('channel', { ch })      (game.js:385)
       - Người chơi quanh đây: G.players (Map). Mỗi người có pm = chế độ PK
         (0 luyện công, 1 đeo cờ PK, 2 ĐỒ SÁT), k = sát khí, rb = cướp tiêu.
     Script KHÔNG đánh người chơi, chỉ đổi khu; chỉ tự chạy khi Tàn Sát đang bật. */
  var KU = Object.assign({ on: false, few: true, avoid: true, red: false, r: 600, cool: 30 }, load('khu', {}));
  KU.r = Math.max(100, Math.min(2000, isFinite(Number(KU.r)) ? Number(KU.r) : 600));
  KU.cool = Math.max(5, Math.min(600, isFinite(Number(KU.cool)) ? Number(KU.cool) : 30));
  var KHU_DIFF = 2, KHU_BAD = 300000;   // chênh ≥2 người mới đổi; khu vừa gặp Đồ sát thì tránh 5 phút
  function saveKU() { save('khu', { on: KU.on, few: KU.few, avoid: KU.avoid, red: KU.red, r: KU.r, cool: KU.cool }); }
  var KS = { list: [], at: 0, reqAt: -1e9, coolUntil: 0, bad: {}, msg: 'Đang tắt', ch: 0, map: '', swapAt: 0, swapWhy: '', swaps: 0 };
  function khuChs() { var g = G(); return (g && g.map && Number(g.map.chs)) || 1; }
  function khuCurCh() { var g = G(); return (g && g.map && Number(g.map.ch)) || 0; }
  function khuGot(d) {   // máy chủ trả danh sách khu
    if (!d || !d.list || !d.list.length) return;
    KS.list = d.list.map(function (c) { return { ch: Number(c.ch) || 0, n: Number(c.n) || 0, cap: Number(c.cap) || 0, cur: !!c.cur }; });
    KS.at = now();
    KS.list.forEach(function (c) { if (c.cur) KS.ch = c.ch; });
  }
  function khuRequest(force) {
    var g = G();
    if (!g || !g.socket || !g.socket.emit) return false;
    if (!force && now() - KS.reqAt < 12000) return false;
    try { g.socket.emit('channels'); KS.reqAt = now(); return true; } catch (e) { return false; }
  }
  function khuCurN() {   // số người ở khu đang đứng (null = chưa biết)
    var c = khuCurCh(), out = null;
    KS.list.forEach(function (k) { if (k.cur || k.ch === c) out = k.n; });
    return out;
  }
  function khuDanger() {   // người đang ĐỒ SÁT (pm=2) quanh đây; thêm sát khí / cướp tiêu nếu bật chip
    var g = G();
    if (!g || !g.players || !g.self || !g.map || g.map.pvp) return null;
    var s = g.self, best = null;
    g.players.forEach(function (p) {
      if (!p || p.dead) return;
      var pk = (p.pm | 0) === 2;
      var red = KU.red && ((p.k | 0) >= 3 || p.rb);
      if (!pk && !red) return;
      var d = dist(p, s);
      if (d > KU.r) return;
      if (!best || d < best.d) best = { name: p.name || 'người lạ', d: d, pk: pk };
    });
    return best;
  }
  function khuOther(anyBad) {   // khu khác ít người nhất (bỏ khu đầy và khu đang bị tránh)
    var c0 = khuCurCh(), out = [], t = now();
    (KS.list || []).forEach(function (k) {
      if (!k.ch || k.cur || k.ch === c0) return;
      if (k.cap && k.n >= k.cap) return;
      if (!anyBad && KS.bad[k.ch] && t - KS.bad[k.ch] < KHU_BAD) return;
      out.push(k);
    });
    if (!out.length) return null;
    out.sort(function (a, b) { return a.n - b.n; });
    return out[0];
  }
  function khuSwitch(ch, why) {
    var g = G(), t = now(), cur = khuCurCh();
    if (!g || !g.socket || !g.socket.emit || !ch || ch === cur) return false;
    if (t < KS.coolUntil) return false;
    try { g.socket.emit('channel', { ch: ch }); } catch (e) { return false; }
    if (cur && why && why.indexOf('tránh') === 0) KS.bad[cur] = t;
    KS.coolUntil = t + KU.cool * 1000;
    KS.swapAt = t; KS.swapWhy = why || ('sang khu ' + ch); KS.swaps++; KS.ch = ch;
    KS.list = []; KS.at = 0;
    return true;
  }
  function khuTick() {
    if (!inGame()) { KS.msg = 'Chưa vào game'; return; }
    var g = G(), t = now();
    if (!KU.on) { KS.msg = 'Đang tắt'; return; }
    if (!F.on) { KS.msg = 'Tàn Sát đang tắt'; return; }
    if (!g.map || khuChs() < 2) { KS.msg = 'Map này không có khu để đổi'; KS.list = []; return; }
    if (KS.map !== g.map.id) { KS.map = g.map.id; KS.list = []; KS.reqAt = -1e9; KS.bad = {}; KS.coolUntil = 0; }
    if (g.me && g.me.dead) { KS.msg = 'Đã chết — chưa đổi khu'; return; }
    if (!KS.list.length || t - KS.at > 25000) khuRequest(false);
    var dg = (KU.avoid || KU.red) ? khuDanger() : null;
    if (dg && KU.avoid && t >= KS.coolUntil) {   // có người Đồ sát -> đổi NGAY sang khu rảnh nhất
      var o = khuOther(false) || khuOther(true);
      if (o && khuSwitch(o.ch, 'tránh ' + dg.name + ' · ' + Math.round(dg.d) + 'px')) return;
      KS.msg = '⚠ ' + dg.name + ' đang Đồ sát quanh đây (' + Math.round(dg.d) + 'px) mà không còn khu khác';
      return;
    }
    if (KU.few && KS.list.length && t >= KS.coolUntil) {   // dồn sang khu ít người hơn
      var curN = khuCurN(), best = khuOther(false);
      if (best && curN != null && curN - best.n >= KHU_DIFF && khuSwitch(best.ch, 'khu ' + best.ch + ' ít người hơn (' + best.n + ' so với ' + curN + ')')) return;
    }
    if (t - KS.swapAt < 5000 && KS.swapWhy) { KS.msg = '🔁 ' + KS.swapWhy; return; }
    var o2 = khuOther(false);
    KS.msg = 'Khu ' + (khuCurCh() || '?') + '/' + khuChs() +
      (khuCurN() != null ? ' · ' + khuCurN() + ' người' : ' · đang hỏi số người...') +
      (o2 ? ' · rảnh nhất: khu ' + o2.ch + ' (' + o2.n + ' người)' : '') +
      (dg ? ' · ⚠ có người Đồ sát' : '');
  }

    /* ==================== 4. TỰ NHẶT + AI THU GOM + TỰ BÁN ĐỒ RÁC ====================
     [3.5.0] Sửa tận gốc việc "bỏ sót đồ":
     - Nhặt khi cách ≤ 44px — đúng ngưỡng chính game dùng (game09a3.js chỉ gửi
       'pickup' khi < 44px). Trước đây script gửi ở 72px nên máy chủ hay từ chối,
       rồi script tự "bỏ qua 20 giây" -> mất đồ.
     - Đi tới món bằng G.moveTo của game (game tự steer + tránh vật cản), không
       giành đường đi với module farm.
     - AI thu gom chạy ở cả 2 chế độ. [3.12.0] Thêm "AI NHẶT AN TOÀN": trước đây cứ lao đi
       nhặt, chỉ nghỉ khi quái < 90px hoặc máu < 30% — mà tới lúc đó thường đã chết
       (một đòn có thể mất > 10% máu). Nay đo nguy hiểm từ dữ liệu thật của game:
         · máu hiện tại (G.me.hp / stats.hpMax) và tốc độ mất máu %/giây
         · số quái còn sống trong bán kính nguy hiểm (G.monsters) + con gần nhất
         · sự kiện 'dmg' của game: d.id === G.you tức CHÍNH MÌNH vừa bị đánh (game.js:729 onDmg)
       Điểm ≥ 45/100 là nguy -> DỪNG nhặt, quay lại đánh; nghỉ 4 giây và phải hồi đủ máu
       mới mở phiên nhặt mới (không nhặt liên tục). Còn quái quanh người thì chỉ nhặt
       trong 200–250px, sạch quái mới đi hết tầm nhặt. Món nằm giữa ổ quái bị trừ điểm
       nên AI tự chọn món an toàn hơn (vẫn KHÔNG bỏ sót món nào khi đã an toàn).
     - Không bỏ sót: món không tra được tên vẫn nhặt; thử 3 lần/món rồi mới tạm bỏ
       6 giây (trước là 20–30 giây); dọn danh sách bỏ mỗi vòng; nhặt luôn mấy món
       nằm sát nhau trong cùng một nhịp.
     - Túi đầy: chỉ nhặt món cộng dồn được; nếu bật 🧹 Tự bán thì bán rác trước
       rồi nhặt tiếp.
     =============================================================================== */
  var P = Object.assign({ on: false, gold: true, pots: true, mats: true, books: true, min: 'common', range: 700, ts: true, before: true, foe: true,
                          ai: true, hpMin: 55, hpBack: 70, haz: 150, foeN: 2, coolD: 4 }, load('pick', {}));   // [3.12.0] AI nhặt an toàn: ai/hpMin/hpBack/haz/foeN/coolD
  function pint(v, lo, hi, d) {   // [3.12.0] đọc số từ cấu hình: kẹp trong [lo..hi]
    var n = Math.round(Number(v));
    if (!isFinite(n)) n = d;
    return Math.max(lo, Math.min(hi, n));
  }
  var RANK = { common: 0, rare: 1, epic: 2, legendary: 3 };
  var RQ = { common: 'Thường', rare: 'Lam', epic: 'Tím', legendary: 'Cam' };
  function rk(v) {   // chuẩn hoá phẩm chất: 'Rare ', 'RARE', 2, null... -> 0..3
    if (typeof v === 'number' && isFinite(v)) return Math.max(0, Math.min(3, v | 0));
    var k = String(v == null ? '' : v).trim().toLowerCase();
    if (k === 'thuong' || k === 'thường' || k === 'trang' || k === 'white' || k === 'normal') k = 'common';
    else if (k === 'lam' || k === 'blue' || k === 'xanh') k = 'rare';
    else if (k === 'tim' || k === 'tím' || k === 'purple' || k === 'violet') k = 'epic';
    else if (k === 'cam' || k === 'orange' || k === 'gold') k = 'legendary';
    return (k in RANK) ? RANK[k] : 0;
  }
  function eqRank(it) { return rk(it && it.rarity); }   // [3.8.0] dùng rk(): hiểu 'Lam'/'blue'/'xanh'/số (trước chỉ hiểu common|rare|epic|legendary -> đồ Lam bị coi là Thường)
  P.min = String(P.min == null ? 'common' : P.min).trim().toLowerCase();
  if (!(P.min in RANK)) P.min = 'common';
  P.range = Math.max(300, Math.min(1200, Number(P.range) || 700));
  P.before = P.before !== false;   // nhặt trước khi đánh tiếp (mặc định BẬT)
  P.ai = P.ai !== false;                 // [3.12.0] AI nhặt an toàn (mặc định BẬT)
  P.hpMin = pint(P.hpMin, 30, 95, 55);   // % máu tối thiểu mới đi nhặt
  P.hpBack = pint(P.hpBack, P.hpMin, 100, Math.max(P.hpMin, 70));   // % máu phải hồi đủ mới nhặt tiếp
  P.haz = pint(P.haz, 80, 500, 150);     // bán kính coi là nguy hiểm (px)
  P.foeN = pint(P.foeN, 1, 8, 2);        // số quái trong bán kính đó là quá đông
  P.coolD = pint(P.coolD, 1, 60, 4);     // nghỉ bao nhiêu giây sau khi phải bỏ nhặt vì nguy hiểm
  function saveP() { save('pick', P); }

  /* ---------- 🧹 TỰ BÁN ĐỒ RÁC theo phẩm chất (đúng luật "Bán nhanh" của game) ---------- */
  var Q = Object.assign({ on: false, common: true, rare: false, epic: false, legendary: false, qkeepPlus: true, qmats: false, bagFull: 90 }, load('sell', {}));
  if (!(Number(Q.bagFull) >= 50 && Number(Q.bagFull) <= 100)) Q.bagFull = 90;
  function saveQ() { save('sell', Q); }
  function sellPrice(s) {   // y hệt công thức giá bán của game (ui09a3.js)
    var g = G(), it = (g && g.data && g.data.items) ? g.data.items[s.id] : null;
    return it ? Math.floor((it.price || 0) * 0.3 * (1 + (s.plus || 0) * 0.2)) * s.qty : 0;
  }
  function sellList() {   // món "rác" theo thiết lập: trang bị đúng phẩm chất (+ giữ đồ cường hoá) + nguyên liệu thường
    var g = G();
    if (!g || !g.me || !g.me.inv || !g.data || !g.data.items) return [];
    return g.me.inv.filter(function (s) {
      var it = g.data.items[s.id];
      if (!it || !it.price) return false;                       // không bán được / không có giá
      if (it.type === 'equip') {   // [3.8.0] quy phẩm chất về 4 mức rồi mới so công tắc 'Bán Lam/Tím/Cam'
        var ek = ['common', 'rare', 'epic', 'legendary'][rk(it.rarity)];
        return !!Q[ek] && !(Q.qkeepPlus && (s.plus || 0) > 0);
      }
      return !!Q.qmats && it.type === 'material' && eqRank(it) === 0;
    });
  }
  var qS = { at: 0, n: 0, before: 0, wait: 0, uids: [] }, qGot = 0;
  function sellNow(auto) {
    var g = G();
    if (!g || !g.socket || !g.me || !g.me.inv) return 0;
    var list = sellList();
    if (!list.length) { if (!auto) stP('🧹 Không có món rác nào theo thiết lập'); return 0; }
    var rare = list.filter(function (s) { return eqRank(g.data.items[s.id]) >= 2 || (s.plus || 0) > 0; }).length;
    var total = list.reduce(function (a, s) { return a + sellPrice(s); }, 0);
    function fire() {
      var uids = list.map(function (s) { return s.uid; });
      try { g.socket.emit('sellMany', { uids: uids }); } catch (e) {}
      qS.at = performance.now(); qS.n = uids.length; qS.uids = uids; qS.before = g.me.inv.length;
      pMsg = '🧹 Gửi bán ' + uids.length + ' món · ~' + total + ' lượng'; stP(pMsg);
    }
    if (rare && !auto && typeof g.modal === 'function') {   // cảnh báo y như game khi có đồ VIP / cường hoá
      g.modal('Trong ' + list.length + ' món sắp bán có ' + rare + ' món VIP / Truyền Kỳ / đã cường hóa. Vẫn bán?',
        [{ t: 'Bán hết', cls: 'primary', fn: fire }, { t: 'Huỷ' }]);
      return list.length;
    }
    fire();
    return list.length;
  }
  function qTick() {   // tự bán khi túi đầy / tới ngưỡng
    var g = G();
    if (!g || !g.socket || !g.me || !g.me.inv) return;
    var t = performance.now();
    if (qS.at && t - qS.at > 2500) {   // xem kết quả: món nào THẬT SỰ ra khỏi túi (theo uid, không so độ dài túi)
      var left = g.me.inv.filter(function (s) { return qS.uids.indexOf(s.uid) >= 0; });
      var gone = qS.n - left.length;
      if (gone > 0) { qGot += gone; pMsg = '✅ Đã bán ' + gone + ' món' + (left.length ? (' · còn ' + left.length + ' món máy chủ không cho bán') : ' · nhặt tiếp'); }
      else if (sellList().length) { pMsg = '⚠ Máy chủ không cho bán ở đây · mở shop NPC (chợ / Tàng Kinh Các) rồi thử lại'; qS.wait = t + 15000; }
      else pMsg = '🧹 Không bán được món nào';
      qS.at = 0; qS.uids = [];
      stP(pMsg);
    }
    if (!Q.on || t < qS.wait || qS.at) return;
    var mx = g.me.invMax || 48, pct = (g.me.inv.length / mx) * 100;
    if (pct >= (Number(Q.bagFull) || 90) && sellList().length) sellNow(true);
  }
  function bagFull() {   // [3.8.0] "đầy" = 100% túi, HOẶC đã tới mốc 70/90/100% mà không còn gì bán được (chừa chỗ cho món cộng dồn)
    var g = G();
    if (!g || !g.me || !g.me.inv) return false;
    var mx = g.me.invMax || 48;
    if (g.me.inv.length >= mx) return true;
    if (!Q.on) return false;
    var thr = Math.ceil(mx * (Number(Q.bagFull) || 90) / 100);
    return g.me.inv.length >= thr && !sellList().length;
  }

  /* ---------- nhận diện món rơi ---------- */
  function pItem(dr) {
    var g = G();
    if (!g || !g.data || !g.data.items || !dr) return null;
    var id = (window.UI && window.UI.resolveId) ? window.UI.resolveId(dr.item) : dr.item;   // giong cach goc dung, an toan khi game khong co UI
    return g.data.items[id] || g.data.items[dr.item] || null;
  }
  function pKind(dr) {   // 'gold' | 'equip' | 'pot' | 'book' | 'other'
    if (!dr) return 'other';
    if (dr.gold) return 'gold';
    var it = pItem(dr), id = String(dr.item == null ? '' : dr.item);
    if (!it) return 'other';   // tra không ra tên: VẪN coi là vật phẩm khác, không bỏ sót
    if (it.type === 'equip') return 'equip';
    if (/^sk_|^book_/.test(id) || (it.effect && it.effect.learn)) return 'book';
    if (it.type === 'use' && it.effect && (it.effect.hp || it.effect.mp || it.effect.hpPct || it.effect.mpPct)) return 'pot';
    return 'other';
  }
  function pName(dr) {
    if (dr.gold) return typeof dr.gold === 'number' ? '+' + Math.round(dr.gold) + ' ngân lượng' : 'ngân lượng';
    var it = pItem(dr);
    return (it && it.name) ? it.name : 'vật phẩm';
  }
  function pStackable(dr) {   // cộng dồn được vào ô có sẵn trong túi
    var g = G(), it = pItem(dr);
    if (!it || it.type === 'equip') return false;
    return !!(g.me && g.me.inv && g.me.inv.some(function (x) { return x.id === dr.item; }));
  }
  var pSkip = new Map(), pTry = new Map(), pTrack = null, pEmit = 0, pNear = 0, pMsg = '', pMap = null;
  var pGot = 0, pMiss = 0, pFoot = 0;
  var PICK_R = 44, PICK_TRY = 3, PICK_COOL = 6000, PICK_EMIT = 350;
  var PICK_MAX = 90000, PICK_HOLD = 2500;   // [3.8.1] 90s khong nhat them duoc mon nao moi bo; bo do con do thi cho 2,5s nhat lai
  var PICK_RISK_BAD = 45, PICK_TRIP_SHORT = 250;   // [3.12.0] ngưỡng của AI nhặt an toàn
  var PAI = { busy: false, owner: '', since: 0, lastGot: 0, lastAct: 0, hx: null, hy: null, got: 0, cur: null, last: null,
              tx: null, ty: null, chk: 0, stuck: 0, tryId: null, tryAt: 0, tryN: 0, cool: 0,
              hp: 100, hpAt: 0, dps: 0, hitAt: 0, foeN: 0, foeD: Infinity, risk: 0, why: '', needHp: 0 };   // [3.12.0] AI nhặt an toàn

  function bump(id, t) {   // đếm số lần đã gửi lệnh nhặt cho một món
    var o = pTry.get(id);
    if (!o || t - o.at > PICK_COOL) o = { n: 0, at: t };
    o.n++; o.at = t; pTry.set(id, o);
  }
  function tooMany(id, t) {   // đã thử 3 lần trong 6 giây -> nghi, không spam máy chủ
    var o = pTry.get(id);
    if (!o) return false;
    if (t - o.at > PICK_COOL) { pTry.delete(id); return false; }
    return o.n >= PICK_TRY;
  }
  function pOK(dr, t) {
    var g = G();
    if (!dr || !g || !g.self) return false;
    var sv = pSkip.get(dr.id);
    if (sv) { if (sv > t) return false; pSkip.delete(dr.id); }
    if (tooMany(dr.id, t)) return false;   // đã thử 3 lần: nghỉ 6 giây rồi thử lại   // hết hạn thì dọn ngay (trước đây gần như không dọn)
    if (dr.o && g.user && dr.o !== g.user.id && (dr.ownUntil || 0) > t) return false;   // đồ đang thuộc người khác
    if (Math.hypot(dr.x - g.self.x, dr.y - g.self.y) > P.range) return false;
    if (PAI.hx != null && Math.hypot(dr.x - PAI.hx, dr.y - PAI.hy) > P.range) return false;   // Tầm nhặt đồ (gần/vừa/xa) tính từ MỐC ĐỨNG NHẶT, không theo chân đang đi -> không bị dắt ra xa
    var k = pKind(dr);
    if (k === 'gold') return !!P.gold;
    if (k === 'book') return !!P.books;
    if (k === 'pot') return !!P.pots;
    if (k === 'equip') {
      if (bagFull() && !pStackable(dr)) return false;         // túi đầy: nhường chỗ cho món cộng dồn
      return eqRank(pItem(dr)) >= rk(P.min);                  // lọc phẩm chất chỉ áp cho trang bị
    }
    if (!P.mats) return false;                                // 'other' = nguyên liệu / vật phẩm khác
    if (bagFull() && !pStackable(dr)) return false;
    return true;
  }
  function pCounts() {   // đếm để hiện trạng thái: còn bao nhiêu món nhặt được / món lạ
    var g = G(), t = performance.now(), o = { all: 0, ok: 0, unk: 0 };
    if (!g || !g.drops || !g.drops.forEach) return o;
    g.drops.forEach(function (dr) {
      o.all++;
      if (!dr.gold && !pItem(dr)) o.unk++;
      if (pOK(dr, t)) o.ok++;
    });
    return o;
  }
  function pDist(dr) { var g = G(); return (g && g.self) ? Math.hypot(dr.x - g.self.x, dr.y - g.self.y) : 1e9; }
  function pBest(t, maxD) {   // ưu tiên ngân lượng > trang bị (phẩm chất cao trước) > thuốc, rồi tới gần
    var g = G(), best = null, bs = -Infinity;
    pNear = 0;
    if (!g || !g.drops || !g.drops.forEach) return null;
    var fl = P.ai ? pFoeList() : null;   // [3.12.0] AI: quét quái 1 lần, món nào nằm giữa ổ quái thì bị trừ điểm
    g.drops.forEach(function (dr) {
      if (!pOK(dr, t)) return;
      pNear++;
      var d = pDist(dr);
      if (d > maxD) return;
      var k = pKind(dr);
      var pr = (k === 'gold') ? 3 : (k === 'equip') ? (2 + eqRank(pItem(dr)) * 0.1) : (k === 'pot') ? 1.5 : 1;
      var sc = pr * 80 - d;
      if (fl) sc -= pDropRisk(dr, fl);   // [3.12.0] món trong ổ quái bị trừ điểm mạnh -> AI chọn món an toàn hơn
      if (sc > bs) { bs = sc; best = dr; }
    });
    return best;
  }
  function pFind(t) { return pBest(t, P.range); }
  function pHasDrop(id) {
    var g = G(), found = false;
    if (g && g.drops && g.drops.forEach) g.drops.forEach(function (d) { if (d.id === id) found = true; });
    return found;
  }
  function emitPick(dr) {
    var g = G();
    try { g.socket.emit('pickup', { id: dr.id }); } catch (e) {}
  }
  function pFootBurst() {   // nhặt luôn mấy món nằm sát nhau trong cùng một nhịp (tối đa 3 món)
    var g = G(), t = performance.now(), n = 0;
    if (!g || !g.drops || !g.drops.forEach) return 0;
    if (t - pEmit < PICK_EMIT) return 0;
    g.drops.forEach(function (dr) {
      if (n >= 3 || dr.id === PAI.cur || dr.gold) return;
      if (!pOK(dr, t) || pDist(dr) > PICK_R) return;
      if (n === 0) pEmit = t;
      n++; pFoot++;
      bump(dr.id, t);
      emitPick(dr);
    });
    return n;
  }
  function pFoeDist() {   // quái còn sống gần nhất (G.monsters là Map trong game)
    var g = G(), s = g && g.self, d = Infinity;
    if (!s || !g.monsters || !g.monsters.forEach) return d;
    g.monsters.forEach(function (m) {
      if (!m || m.hp <= 0) return;
      var dd = Math.hypot(m.x - s.x, m.y - s.y);
      if (dd < d) d = dd;
    });
    return d;
  }
  function pHpPct() {
    var g = G();
    try {
      var m = g.me, mx = (m.stats && (m.stats.hpMax || m.stats.hp)) || m.hpMax || 0;
      return mx > 0 ? (m.hp / mx) * 100 : 100;
    } catch (e) { return 100; }
  }
  function pSafe() { return pHpPct() >= 30 && pFoeDist() >= 90; }   // đủ an toàn để đi xa
  /* ---------- [3.12.0] 🤖 AI NHẶT AN TOÀN (người dùng: "đừng nhặt liên tục quái đánh chết, cho AI vào") ----------
     Dữ liệu lấy từ chính game, không đoán: G.me (máu), G.monsters (quái còn sống),
     sự kiện 'dmg' mà game phát khi có người ăn sát thương — d.id === G.you là MÌNH.
     Điểm nguy hiểm 0..100: máu < ngưỡng +50 · quá đông quái +35 · quái ở gần +0..25 ·
     vừa bị đánh (2 giây) +25 · đang mất máu ≥ 3%/giây +20.  >= 45 là KHÔNG đi nhặt. */
  function pFoeList() {   // quét quái còn sống 1 lần cho cả lượt chọn món (rẻ: chỉ vài chục con)
    var g = G(), s = g && g.self, out = [];
    if (!s || !g.monsters || !g.monsters.forEach) return out;
    g.monsters.forEach(function (m) {
      if (!m || m.hp <= 0) return;
      out.push({ x: m.x, y: m.y, d: Math.hypot(m.x - s.x, m.y - s.y) });
    });
    return out;
  }
  function pScan(list) {   // số quái trong bán kính nguy hiểm + khoảng cách con gần nhất
    var L = list || pFoeList(), o = { n: 0, d: Infinity }, i;
    for (i = 0; i < L.length; i++) {
      if (L[i].d <= P.haz) o.n++;
      if (L[i].d < o.d) o.d = L[i].d;
    }
    return o;
  }
  function pDanger(list) {   // điểm nguy hiểm + lý do (hiện lên thẻ AI và thanh trạng thái)
    var t = performance.now(), f = pScan(list), hp = pHpPct(), s = 0, why = [];
    if (hp < P.hpMin) { s += 50; why.push('máu ' + Math.round(hp) + '% < ' + P.hpMin + '%'); }
    if (f.n > P.foeN) { s += 35; why.push(f.n + ' quái trong ' + P.haz + 'px'); }
    if (f.d < P.haz) { s += Math.round((1 - f.d / P.haz) * 25); why.push('quái cách ' + Math.round(f.d) + 'px'); }
    if (PAI.hitAt && t - PAI.hitAt < 2000) { s += 25; why.push('vừa bị đánh'); }
    if (PAI.dps >= 3) { s += 20; why.push('mất ' + PAI.dps.toFixed(1) + '% máu/giây'); }
    PAI.foeN = f.n; PAI.foeD = f.d; PAI.risk = Math.min(100, s); PAI.why = why.join(' · ');
    return { s: PAI.risk, bad: PAI.risk >= PICK_RISK_BAD, hp: hp, why: PAI.why, n: f.n, d: f.d };
  }
  function pDpsTick(t) {   // % máu mất mỗi giây (đo từ diễn biến máu, làm mượt để không báo động giả)
    var hp = pHpPct();
    if (!PAI.hpAt) { PAI.hp = hp; PAI.hpAt = t; return; }
    if (t - PAI.hpAt < 800) return;
    var dd = (PAI.hp - hp) / ((t - PAI.hpAt) / 1000);
    PAI.dps = dd > 0 ? PAI.dps * 0.5 + dd * 0.5 : PAI.dps * 0.5;
    if (PAI.dps < 0.4) PAI.dps = 0;
    PAI.hp = hp; PAI.hpAt = t;
  }
  function pDmgHook() {   // gắn 1 lần vào socket của game: biết lúc nào CHÍNH MÌNH bị đánh
    var g = G();
    if (!g || !g.socket || typeof g.socket.on !== 'function' || g.socket.__vla3dmg) return;
    try {
      g.socket.on('dmg', function (d) {
        if (!d || g.you == null || d.id !== g.you) return;
        if (d.k === 'miss' || d.k === 'heal' || d.k === 'mana') return;
        PAI.hitAt = performance.now();
      });
      g.socket.__vla3dmg = 1;
    } catch (e) {}
  }
  function pDropRisk(dr, list) {   // món nằm giữa quái -> trừ điểm (để AI chọn món an toàn hơn)
    var n = 0, near = Infinity, i, d;
    for (i = 0; i < list.length; i++) {
      d = Math.hypot(list[i].x - dr.x, list[i].y - dr.y);
      if (d <= P.haz) n++;
      if (d < near) near = d;
    }
    return n ? (60 + n * 40 + Math.round((1 - near / P.haz) * 60)) : 0;
  }
  function pAiOk() { return !P.ai || !pDanger().bad; }   // AI cho phép đi nhặt?
  function pTripMax() {   // [3.12.0] AI bật: càng nhiều quái quanh người thì càng chỉ nhặt gần;
    if (!P.ai) return (pSafe() || P.foe) ? P.range : 200;   //   AI tắt: giữ nguyên luật 3.8.1
    var r = pDanger();
    if (r.bad) return 0;                       // nguy -> không đi nhặt (pCollect/pTryStart sẽ chặn)
    return r.s > 0 ? PICK_TRIP_SHORT : P.range;   // CÓ quái quanh người -> chuyến ngắn; sạch quái -> đi hết tầm
  }

  function pRelease(msg, hold) {
    var g = G();
    PAI.busy = false; PAI.owner = ''; PAI.cur = null;
    PAI.cool = hold ? performance.now() + hold : 0;   // [3.8.1] bỏ dở mà còn đồ -> không mở lại phiên ngay lập tức
    PAI.tx = null; PAI.ty = null; PAI.stuck = 0; PAI.tryId = null; PAI.tryAt = 0; PAI.tryN = 0;
    if (g) { go(null); g.target = null; g.chase = null; g.npcGoal = null; }
    if (msg) { pMsg = msg; stP(msg); }
  }
  function pCollect(owner) {   // 1 nhịp AI thu gom; true = đang bận nhặt
    var g = G(), t = performance.now(), s = g && g.self;
    if (!P.on || !g || !s || !inGame()) { pRelease(''); return false; }
    if (g.auto || (g.me && g.me.dead)) { pRelease(''); return false; }   // game tự nhặt / đang chết
    if (PAI.cur != null && !pHasDrop(PAI.cur)) {   // món đã biến mất = nhặt THÀNH CÔNG
      PAI.got++; pGot++; PAI.lastGot = t; PAI.since = t;   // [3.8.1] nhặt được món -> đồng hồ 90 giây đếm lại
      PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0; PAI.tryN = 0;
    }
    if (t - PAI.since > PICK_MAX || (t - PAI.lastAct > 9000 && t - PAI.lastGot > 9000)) {   // [3.8.0] chỉ bỏ khi 9 giây KHÔNG đi bộ và KHÔNG gửi lệnh nào (trước bỏ oan khi đang đi tới món xa)
      var pleft = pCounts().ok;   // [3.8.1] còn món nhặt được trên sàn thì báo rõ + hẹn nhặt lại, không bỏ luôn
      pRelease(pleft ? ('⚠ Còn ' + pleft + ' món · nhặt lại sau 2,5 giây')
        : (PAI.got ? ('✅ Nhặt ' + PAI.got + ' món · đánh tiếp') : '⚠ Không nhặt được · đánh tiếp'),
        pleft ? PICK_HOLD : 0);
      return false;
    }
    if (P.ai) {   // [3.12.0] AI: đo nguy hiểm MỖI nhịp — nguy là bỏ nhặt ngay, quay lại đánh
      var risk0 = pDanger();
      if (risk0.bad) {
        PAI.needHp = Math.max(P.hpMin, P.hpBack);   // phải hồi đủ máu mới mở phiên nhặt mới
        pRelease('🤖 Dừng nhặt: ' + risk0.why + ' · quay lại đánh', P.coolD * 1000);
        return false;
      }
    }
    if (pHpPct() < 25) { pRelease('❤ Máu thấp · quay lại đánh', 3000); return false; }
    if (t - PAI.chk > 700) {   // theo dõi kẹt đường
      if (PAI.tx != null && Math.hypot(s.x - PAI.tx, s.y - PAI.ty) < 6) PAI.stuck++; else PAI.stuck = 0;
      PAI.tx = s.x; PAI.ty = s.y; PAI.chk = t;
      if (PAI.stuck >= 4) {   // đứng yên 2,8 giây: bỏ món này 6 giây rồi đi món khác
        var stuckId = (PAI.cur != null) ? PAI.cur : PAI.last;   // [3.8.1] bỏ ĐÚNG món đang đi tới
        if (stuckId != null) { pSkip.set(stuckId, t + PICK_COOL); pMiss++; }   // (trước bỏ PAI.last -> có thể lặp vô hạn)
        PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0; PAI.tryN = 0; PAI.stuck = 0; PAI.lastGot = t;
      }
    }
    var dr = pBest(t, pTripMax());
    if (!dr) { pRelease(PAI.got ? ('✅ Nhặt ' + PAI.got + ' món · đánh tiếp') : ''); return false; }
    if (PAI.cur !== dr.id) {
      PAI.cur = dr.id; PAI.tryId = null; PAI.tryAt = 0; PAI.tryN = 0;
      PAI.stuck = 0; PAI.tx = s.x; PAI.ty = s.y; PAI.chk = t;
    }
    var nm = pName(dr), d = pDist(dr);
    if (d > PICK_R) {   // chưa tới nơi: để chính game đi (G.moveTo -> game tự steer/tránh vật cản)
      g.target = null; g.chase = null; g.npcGoal = null;
      PAI.lastAct = t;   // [3.8.0] đang đi bộ tới món = vẫn tiến triển
      go(dr.x, dr.y);
      pMsg = '🧹 Nhặt ' + nm + ' · ' + Math.round(d) + 'px' + (PAI.got ? ' · đã ' + PAI.got : '')
        + (pNear > 1 ? ' · còn ' + (pNear - 1) + ' món' : ''); stP(pMsg);
      return true;
    }
    go(null);
    if (PAI.tryN < PICK_TRY && (PAI.tryN === 0 || t - PAI.tryAt > 700) && t - pEmit > PICK_EMIT) {
      PAI.tryN++; PAI.tryAt = t; pEmit = t; PAI.lastGot = t; PAI.lastAct = t; PAI.last = dr.id;
      bump(dr.id, t);
      emitPick(dr); pFootBurst();
      pMsg = '🧹 Đang nhặt ' + nm + (PAI.tryN > 1 ? ' (lần ' + PAI.tryN + ')' : '') + (PAI.got ? ' · đã ' + PAI.got : '');
      stP(pMsg);
      return true;
    }
    if (PAI.tryN >= PICK_TRY && t - PAI.tryAt > 1500) {   // đã thử 3 lần, chờ 1,5 giây xem máy chủ có nhận không
      pSkip.set(dr.id, t + PICK_COOL); pMiss++;
      PAI.cur = null; PAI.tryId = null; PAI.tryAt = 0; PAI.tryN = 0; PAI.lastGot = t;
      pMsg = '⚠ Bỏ qua 6 giây: ' + nm; stP(pMsg);
    }
    return true;
  }
  function pTryStart(who, force) {   // mở phiên nhặt (farm cần "nhặt trước khi đánh"; chế độ thường thì không)
    if (!P.on || PAI.busy) return PAI.busy;
    if (!inGame()) return false;
    if (!force && (!P.ts || !P.before)) return false;
    var g = G(), t = performance.now();
    if (t < (PAI.cool || 0)) return false;   // [3.8.1] vừa bỏ dở vì hết giờ/còn đồ -> chờ rồi nhặt tiếp
    if (g.auto || (g.me && g.me.dead)) return false;
    if (P.ai) {   // [3.12.0] AI: đang nguy hiểm thì không mở phiên; chưa hồi đủ máu thì chờ tiếp
      var r0 = pDanger();
      if (r0.bad) return false;
      if (PAI.needHp && r0.hp < PAI.needHp) return false;
    }
    if (!force && !pSafe() && !P.foe) return false;   // [3.8.0] quái sát bên: tắt "Nhặt khi có quái quanh người" thì mới chặn
    var dr = pBest(t, force ? P.range : pTripMax());
    if (!dr) return false;
    PAI.busy = true; PAI.owner = who || 'farm'; PAI.since = t; PAI.lastGot = t; PAI.lastAct = t; PAI.got = 0;
    PAI.needHp = 0;   // [3.12.0] đã đủ an toàn -> mở phiên mới
    PAI.cur = null; PAI.tx = g.self.x; PAI.ty = g.self.y; PAI.chk = t; PAI.stuck = 0; PAI.tryN = 0;
    if (PAI.hx == null) { PAI.hx = g.self.x; PAI.hy = g.self.y; }
    pMsg = '🧹 Nhặt đồ rồi đánh tiếp'; stP(pMsg);
    return true;
  }
  function pLootStep() { return pCollect(PAI.owner || 'farm'); }
  function pickStep() {   // chế độ KHÔNG farm: cũng dùng AI thu gom (đi tới món, nhặt ở 44px)
    var g = G();
    if (!P.on) { if (PAI.busy) pRelease(''); stP('Đang tắt'); return false; }
    if (!inGame()) { stP('Chờ vào game...'); return false; }
    var mid = g.map && g.map.id;
    if (mid !== pMap) { pMap = mid; pSkip.clear(); pTrack = null; if (PAI.busy) pRelease(''); }
    var t = performance.now();
    if (pSkip.size > 40) pSkip.forEach(function (v, k) { if (v <= t) pSkip.delete(k); });
    if (g.auto) { stP('Game đang bật Tự động — để game tự nhặt'); return false; }
    if (g.me && g.me.dead) { stP('Đã chết, chờ hồi sinh'); return false; }
    if (PAI.busy) return pCollect('manual');
    if (PAI.hx == null || Math.hypot(g.self.x - PAI.hx, g.self.y - PAI.hy) > P.range) { PAI.hx = g.self.x; PAI.hy = g.self.y; }
    var fb = pFootBurst();   // nhặt luôn món dưới chân, nhưng vẫn mở phiên để theo dõi / từ bỏ đúng cách
    var dr = pBest(t, P.range);
    if (!dr) {
      var c = pCounts();
      stP(fb ? ('👋 Nhặt ' + pFoot + ' món quanh người')
        : (c.all ? ('Không có món phù hợp · ' + c.all + ' món trong tầm' + (c.unk ? ' (' + c.unk + ' lạ)' : '')) : 'Không có món nào'));
      return false;
    }
    var lim = pTripMax();   // [3.12.0] AI: cận tầm đi nhặt theo mức nguy hiểm (nguy -> chỉ nhặt quanh người)
    if (lim <= 0 || pDist(dr) > lim) {   // [3.12.0] cận tầm 0 = đang nguy hiểm, không đi nhặt
      stP('🤖 ' + ((P.ai && PAI.why) ? PAI.why : 'có quái quanh người') + (lim > 0 ? ' · chỉ nhặt trong ' + lim + 'px' : ' · chưa đi nhặt'));
      return false;
    }
    if (pTryStart('manual', (pSafe() || !!P.foe) && pAiOk())) return pCollect('manual');
    return false;
  }
  function tickP() {
    if (!P.on) { if (PAI.busy) pRelease(''); stP('Đang tắt'); return; }
    if (!inGame()) { stP('Chờ vào game...'); return; }
    var g = G(), cmap = g.map && g.map.id;
    if (cmap !== pMap) { pMap = cmap; pSkip.clear(); pTrack = null; if (PAI.busy) pRelease(''); }
    qTick();   // tự bán đồ rác khi túi đầy
    pDmgHook(); pDpsTick(performance.now());   // [3.12.0] AI: theo dõi bị đánh + tốc độ mất máu
    if (F.on) {   // Tàn Sát đang bật -> AI thu gom xen giữa các trận
      if (!P.ts) { if (PAI.busy) pRelease(''); stP('Đang đánh · tạm nghỉ nhặt'); pMsg = ''; return; }
      if (PAI.busy) { pCollect(PAI.owner || 'farm'); return; }
      var active = (Fst.mode !== 'travel' && Fst.mode !== 'wait');
      if (active && P.before && pTryStart('farm')) { pCollect('farm'); return; }
      var n = pFootBurst();   // phiên chưa mở: vẫn nhặt hết món dưới chân
      var c = pCounts();
      var pwhy = P.ai ? (PAI.why || 'quanh người sạch quái · đi hết tầm nhặt')   // [3.12.0] AI nhặt an toàn
        : (P.foe ? 'nhặt quanh người (có quái)' : 'chờ an toàn để đi nhặt');
      stP(n ? ('👋 Nhặt ' + pFoot + ' món quanh người') : (c.ok ? ('🧹 ' + c.ok + ' món trong tầm · ' + pwhy) : (pFoot ? '👋 Nhặt dưới chân' : 'Đang farm · chưa có món trong tầm')));
      return;
    }
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
    if (mt.tries >= 4) { mt.tries = 0; mt.rest = n + 60000; return; }
    mt.tries++;
    try {
      // game09a3.js:879 gửi { op: 'ride' }; bản trước gửi 'up' nên máy chủ bỏ qua -> không tự lên ngựa
      if (mt.tries <= 3) g.socket.emit('mount', { op: 'ride' });
      else g.socket.emit('mount');          // kiểu cũ không kèm dữ liệu (input09a3.js:222)
    } catch (e) {}
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
  var UI3 = { tab: 'ov', x: null, y: null, px: null, py: null, open: false, scale: 100, fs: 13, orb: true };
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
    + '#vla3 .seg{display:flex;gap:6px;padding:8px 10px;overflow-x:auto;overflow-y:hidden;border-bottom:1px solid rgba(255,255,255,.07);scrollbar-width:none;-webkit-overflow-scrolling:touch}'
    + '#vla3 .seg::-webkit-scrollbar{display:none}'
    + '#vla3 .seg button{flex:0 0 auto;display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:999px;cursor:pointer;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);color:#7e97a3;font:inherit;font-size:10.5px;white-space:nowrap;line-height:1}'
    + '#vla3 .seg button b{font-weight:600}'
    + '#vla3 .seg button.on{background:rgba(94,234,212,.16);border-color:rgba(94,234,212,.5);color:#b9f7ec}'
    + '#vla3 .seg button:active{transform:scale(.97)}'
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
    + '#vla3 .ch.q[aria-pressed="true"][data-q="rare"],#vla3 .ch.q[aria-pressed="true"][data-sq="rare"]{background:rgba(79,163,255,.18);border-color:rgba(79,163,255,.62);color:#cfe4ff}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="epic"],#vla3 .ch.q[aria-pressed="true"][data-sq="epic"]{background:rgba(192,96,255,.18);border-color:rgba(192,96,255,.62);color:#eed6ff}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="legendary"],#vla3 .ch.q[aria-pressed="true"][data-sq="legendary"]{background:rgba(255,155,47,.18);border-color:rgba(255,155,47,.62);color:#ffe2bd}'
    + '#vla3 .ch.q[aria-pressed="true"][data-q="common"],#vla3 .ch.q[aria-pressed="true"][data-sq="common"]{background:rgba(226,232,240,.14);border-color:rgba(226,232,240,.5);color:#eef4f8}'
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
    + '#vla3 .mini button.on{background:rgba(94,234,212,.28);border-color:rgba(94,234,212,.9);color:#f2fffd;font-weight:700}'   // [3.8.0] nút đang chọn
    + '#vla3 .mini button:active{transform:scale(.97)}'
    + '#vla3 .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
    + '#vla3 .grid .card{margin:0}'
    + '#vla3 .sec{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#5f7480;margin:10px 0 6px}'
    + '#vla3 .mini button.on{background:rgba(94,234,212,.28);border-color:rgba(94,234,212,.9);color:#f2fffd;font-weight:700}'
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
    + '<div class="seg">'
    + '<button data-t="ov">🏠<b>Tổng quan</b></button>'
    + '<button data-t="farm">⚔<b>Tàn Sát</b></button>'
    + '<button data-t="khu">🔀<b>Đổi khu</b></button>'
    + '<button data-t="pick">🖐<b>Nhặt &amp; Bán</b></button>'
    + '<button data-t="party">🤝<b>Tổ đội</b></button>'
    + '<button data-t="map">🗺<b>Bản đồ</b></button>'
    + '<button data-t="maint">🛠<b>Bảo trì</b></button>'
    + '<button data-t="cfg">⚙<b>Cài đặt</b></button>'
    + '</div>'
    + '<div class="bd">'
    + ' <div class="pg" data-p="ov">'
    + '  <div class="mini"><button data-oa="on">▶ Bật tất cả</button><button class="g" data-oa="off">■ Dừng tất cả</button></div>'
    + '  <div class="grid" id="vla3-ov"></div>'
    + '  <p class="hint">Tổng quan: trạng thái nhanh + công tắc cho từng chức năng. Kéo thanh tiêu đề để di chuyển bảng; chạm nút tròn ⚔ để ẩn/hiện. Vào tab ⚙ Cài đặt để đổi cỡ bảng / cỡ chữ.</p>'
    + ' </div>'
    + ' <div class="pg" data-p="farm">'
    + '  <div class="lg"><span class="t1">Tàn Sát</span><button class="sw" data-on="farm" aria-pressed="false"><i></i></button><span class="t2" id="vla3-ft">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-k="keepUp" aria-pressed="false">📌 Giữ map up</button>'
    + '   <button class="ch" data-k="fmount" aria-pressed="true">Lên ngựa</button></div>'
    + '  <div class="mini"><button data-a="up">Lưu map này</button><button class="g" data-a="upclear">Bỏ map up</button></div>'
    + '  <div class="card"><div class="k">Map up</div><div class="v" id="vla3-up">—</div></div>'
    + '  <div class="card"><div class="k">Trạng thái</div><div class="v" id="vla3-fs">—</div></div>'
    + ' </div>'
    + ' <div class="pg" data-p="khu">'
    + '  <div class="lg" style="margin-top:6px"><span class="t1">🔀 Đổi khu (Tàn Sát)</span><button class="sw" data-on="khu" aria-pressed="false"><i></i></button><span class="t2" id="vla3-kht">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-kk="few" aria-pressed="false">👥 Khu ít người</button>'
    + '   <button class="ch" data-kk="avoid" aria-pressed="true">☠ Tránh người Đồ sát</button></div>'
    + '  <div class="chs"><button class="ch" data-kk="red" aria-pressed="false">🩸 Tránh cả sát khí / cướp tiêu</button></div>'
    + '  <div class="card"><div class="k">Bán kính Đồ sát (px)</div><div class="v" style="display:flex;gap:6px;margin-top:4px">'
    + '   <input class="inp" id="vla3-khr" type="number" min="100" max="2000" step="50" value="600"></div></div>'
    + '  <div class="card"><div class="k">Nghỉ giữa 2 lần đổi khu (giây)</div><div class="v" style="display:flex;gap:6px;margin-top:4px">'
    + '   <input class="inp" id="vla3-khc" type="number" min="5" max="600" step="5" value="30"></div></div>'
    + '  <div class="mini"><button data-a="khunow">🔀 Đổi khu ít người ngay</button><button class="g" data-a="khulist">📋 Danh sách khu</button></div>'
    + '  <div class="card"><div class="k">Khu đang đứng</div><div class="v" id="vla3-khv">—</div></div>'
    + '  <div class="card"><div class="k">Trạng thái đổi khu</div><div class="v" id="vla3-khs">—</div></div>'
    + '  <p class="hint">Đổi khu dùng đúng lệnh của nút «Khu ▾» (socket channel — {ch}). «Khu ít người» chỉ đổi khi khu đang đứng đông hơn khu rảnh nhất từ 2 người và đã hết thời gian nghỉ. «Tránh người Đồ sát» đổi khu NGAY khi có người bật chế độ Đồ sát (pm=2) trong bán kính; khu vừa gặp Đồ sát bị tránh 5 phút. Script không đánh người chơi, chỉ đổi khu; chỉ tự chạy khi Tàn Sát đang bật.</p>'
    + ' </div>'
    + ' <div class="pg" data-p="party">'
    + '  <div class="lg" style="margin-top:6px"><span class="t1">🤝 Tự nhận lời mời tổ đội</span><button class="sw" data-on="partyAccept" aria-pressed="false"><i></i></button><span class="t2" id="vla3-pty">tắt</span></div>'
    + '  <div class="lg" style="margin-top:6px"><span class="t1">🤝 Tự mời người khác vào đội</span><button class="sw" data-on="partyInvite" aria-pressed="false"><i></i></button><span class="t2" id="vla3-pvi">tắt</span></div>'
    + '  <p class="hint">Tự mời chỉ chạy khi bạn là đội trưởng và đội chưa đủ 6 người: mời người gần nhất trong 600px, cách 5 giây mỗi lần, mỗi người chờ 2 phút. Bỏ qua người đã chết và người đang Đồ sát.</p>'
    + ' </div>'
    + ' <div class="pg" data-p="pick">'
    + '  <div class="lg"><span class="t1">Tự nhặt</span><button class="sw" data-on="pick" aria-pressed="false"><i></i></button><span class="t2" id="vla3-pt">tắt</span></div>'
    + '  <div class="chs"><button class="ch" data-k="gold" aria-pressed="true">Ngân lượng</button>'
    + '   <button class="ch" data-k="pots" aria-pressed="true">Thuốc</button>'
    + '   <button class="ch" data-k="mats" aria-pressed="true">Nguyên liệu</button>'
    + '   <button class="ch" data-k="books" aria-pressed="true">Sách</button>'
    + '   <button class="ch" data-k="ts" aria-pressed="true">Nhặt khi farm</button></div>'
    + '  <div class="lg" style="margin-top:2px"><span class="t1">Phẩm chất trang bị</span><span class="t2" id="vla3-min">Thường</span></div>'
    + '  <div class="chs"><button class="ch q" data-q="common" aria-pressed="true">Thường</button>'
    + '   <button class="ch q" data-q="rare" aria-pressed="false">Lam</button>'
    + '   <button class="ch q" data-q="epic" aria-pressed="false">Tím</button>'
    + '   <button class="ch q" data-q="legendary" aria-pressed="false">Cam</button></div>'
    + '  <div class="lg" style="margin-top:2px"><span class="t1">Tầm nhặt đồ</span><span class="t2" id="vla3-rng">Vừa · 700px</span></div>'
    + '  <div class="mini"><button class="g" data-a="r-400">Gần · 400px</button><button class="g" data-a="r-700">Vừa · 700px</button><button class="g" data-a="r-1000">Xa · 1000px</button></div>'
    + '  <div class="chs"><button class="ch" data-k="foe" aria-pressed="true">Nhặt khi có quái quanh người</button></div>'
    + '  <div class="chs"><button class="ch" data-k="ai" aria-pressed="true">🤖 AI nhặt an toàn (không lao vào quái)</button></div>'
    + '  <div class="card"><div class="k">🤖 AI nhặt an toàn</div>'
    + '   <div class="chs" style="margin:6px 0 0"><span class="t1" style="flex:0 0 auto">Máu ≥</span>'
    + '    <input class="inp" id="vla3-pah" type="number" min="30" max="95" step="5" value="55"><span class="t2">% mới đi nhặt</span></div>'
    + '   <div class="chs" style="margin:6px 0 0"><span class="t1" style="flex:0 0 auto">Quái tối đa</span>'
    + '    <input class="inp" id="vla3-pan" type="number" min="1" max="8" step="1" value="2"><span class="t2">trong</span>'
    + '    <input class="inp" id="vla3-par" type="number" min="80" max="500" step="20" value="150"><span class="t2">px</span></div>'
    + '   <div class="v" id="vla3-pa">—</div></div>'
    + '  <div class="lg" style="margin-top:4px"><span class="t1">🧹 Tự bán đồ rác</span><button class="sw" data-on="sell" aria-pressed="false"><i></i></button><span class="t2" id="vla3-qt">tắt</span></div>'
    + '  <div class="chs"><button class="ch q" data-sq="common" aria-pressed="true">Bán Thường</button>'
    + '   <button class="ch q" data-sq="rare" aria-pressed="false">Bán Lam</button>'
    + '   <button class="ch q" data-sq="epic" aria-pressed="false">Bán Tím</button>'
    + '   <button class="ch q" data-sq="legendary" aria-pressed="false">Bán Cam</button></div>'
    + '  <div class="chs"><button class="ch" data-k="qkeepPlus" aria-pressed="true">Giữ đồ cường hóa (+)</button>'
    + '   <button class="ch" data-k="qmats" aria-pressed="false">Bán cả liệu thường</button></div>'
    + '  <div class="lg" style="margin-top:2px"><span class="t1">Mức bán khi túi</span><span class="t2" id="vla3-bag">90%</span></div>'
    + '  <div class="mini"><button class="g" data-a="qf-70">70%</button><button class="g" data-a="qf-90">90%</button><button class="g" data-a="qf-100">100%</button></div>'
    + '  <div class="mini"><button class="g" data-a="sellnow">🧹 Bán ngay</button></div>'
    + '  <div class="card"><div class="k">Bán rác</div><div class="v" id="vla3-qs">—</div></div>'
    + '  <div class="card"><div class="k">Trạng thái</div><div class="v" id="vla3-ps">—</div></div>'
    + '  <p class="hint">Khi Tàn Sát bật, tab này chỉ nhặt đồ rơi dưới chân để không kéo nhân vật qua lại.</p>'
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
    + '  <div class="lg" style="margin-top:6px"><span class="t1">Bản đồ · Xa Phu</span><span class="t2" id="vla3-mapn">—</span></div>'
    + '  <div class="list" id="vla3-maplist"></div>'
    + '  <p class="hint">Danh sách lấy từ dữ liệu game (48 map). ✓ Xa Phu tới được · 🔒 chưa đủ cấp · ✗ server đã từ chối · — không đi bằng Xa Phu.</p>'
    + ' </div>'
    + '</div>'
    + ' <div class="pg" data-p="cfg">'
    + '  <div class="sec">Cài đặt chung (áp dụng cả game)</div>'
    + '  <div class="lg"><span class="t1">⚙ Cài đặt chung</span><span class="t2">áp dụng cả game</span></div>'
    + '  <div class="chs"><button class="ch" data-k="fast" aria-pressed="true">🐎 Xa Phu teleport</button>'
    + '   <button class="ch" data-k="hideTp" aria-pressed="true">Ẩn bảng Xa Phu</button>'
    + '   <button class="ch" data-k="revive" aria-pressed="true">Hồi sinh</button>'
    + '   <button class="ch" data-k="mount" aria-pressed="true">Lên ngựa</button></div>'
    + '  <div class="sec">Hiển thị</div>'
    + '  <div class="lg"><span class="t1">Cỡ bảng</span><span class="t2" id="vla3-uiv">100%</span></div>'
    + '  <div class="chs"><button class="ch" data-ui="80">80%</button><button class="ch" data-ui="90">90%</button><button class="ch" data-ui="100">100%</button><button class="ch" data-ui="110">110%</button><button class="ch" data-ui="120">120%</button></div>'
    + '  <div class="lg"><span class="t1">Cỡ chữ</span><span class="t2" id="vla3-fsv">13px</span></div>'
    + '  <div class="chs"><button class="ch" data-fs="11">11</button><button class="ch" data-fs="12">12</button><button class="ch" data-fs="13">13</button><button class="ch" data-fs="14">14</button><button class="ch" data-fs="15">15</button><button class="ch" data-fs="16">16</button></div>'
    + '  <div class="lg"><span class="t1">Nút tròn ⚔</span><button class="sw" data-on="orb" aria-pressed="true"><i></i></button></div>'
    + '  <div class="sec">Vị trí</div>'
    + '  <div class="mini"><button class="g" data-oa="home">📌 Bảng về góc phải dưới</button><button class="g" data-oa="orbhome">🔄 Đặt lại nút tròn</button></div>'
    + '  <div class="sec">Thông tin</div>'
    + '  <div class="card"><div class="k">Giao diện hiện tại</div><div class="v" id="vla3-cfgs">—</div></div>'
    + '  <p class="hint">Cỡ bảng dùng zoom của trình duyệt (Chrome / Android WebView). Nếu chữ bị mờ thì hạ về 100%. Cỡ chữ chỉ ảnh hưởng bảng, không ảnh hưởng game.</p>'
    + ' </div>'
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
      if (on) { try { b.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {} }
    });
    root.querySelectorAll('.pg').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-p') === tab); });
    paintSt();
    if (tab === 'ov') { if (typeof ovRender === 'function') ovRender(); }
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
  function paintQ() {   // hiện số món rác + tiền bán dự kiến + trạng thái công tắc
    var g = G(), el = document.getElementById('vla3-qs'), sw = root.querySelector('[data-on="sell"]'), tt = document.getElementById('vla3-qt');
    if (sw) { sw.classList.toggle('on', !!Q.on); sw.setAttribute('aria-pressed', Q.on ? 'true' : 'false'); }
    if (tt) tt.textContent = Q.on ? ('bán khi túi ' + (Q.bagFull || 90) + '%') : 'tắt';
    // [3.8.1] nut «Ban …» phai de aria-pressed (CSS dung aria-pressed + data-sq), truoc day chi doi class 'on' nen bam khong thay gi
    root.querySelectorAll('[data-sq]').forEach(function (b) {
      var sk = b.getAttribute('data-sq'), son = !!Q[sk];
      b.classList.toggle('on', son); b.setAttribute('aria-pressed', son ? 'true' : 'false');
    });
    root.querySelectorAll('.ch[data-k]').forEach(function (b) { var k = b.getAttribute('data-k'); if (k in Q) { b.classList.toggle('on', !!Q[k]); b.setAttribute('aria-pressed', Q[k] ? 'true' : 'false'); } });
    if (!el) return;
    if (!g || !g.data || !g.data.items || !g.me || !g.me.inv) { el.textContent = '—'; return; }
    var list = sellList(), total = list.reduce(function (a, s) { return a + sellPrice(s); }, 0);
    el.textContent = (list.length ? (list.length + ' món · ~' + total + ' lượng') : 'Không có món rác') + ' · túi ' + g.me.inv.length + '/' + (g.me.invMax || 48);
  }

  /* ---------- 7b. MENU MOI: CAI DAT GIAO DIEN + TONG QUAN ---------- */
  var _uiSig = '';
  function uiCfgSave() { save('ui2', UI3); }
  function applyUiCfg() {
    var sc = Math.max(70, Math.min(140, Math.round(Number(UI3.scale) || 100)));
    var fsz = Math.max(10, Math.min(16, Math.round(Number(UI3.fs) || 13)));
    var sig = sc + '/' + fsz + '/' + (UI3.orb === false ? 0 : 1);
    if (sig === _uiSig) return;
    _uiSig = sig;
    try { root.style.zoom = sc / 100; } catch (e) {}
    root.style.fontSize = fsz + 'px';
    var o = document.getElementById('vla3-orb');
    if (o) {
      try { o.style.zoom = sc / 100; } catch (e) {}
      o.style.display = UI3.orb === false ? 'none' : 'flex';
    }
    var s = document.getElementById('vla3-cfgs');
    if (s) s.textContent = 'bảng ' + sc + '% · chữ ' + fsz + 'px · nút tròn ' + (UI3.orb === false ? 'ẩn' : 'hiện');
  }
  function uiCfgPaint() {
    root.querySelectorAll('[data-ui]').forEach(function (b) {
      var act = Math.round(Number(UI3.scale) || 100) === Number(b.getAttribute('data-ui'));
      b.classList.toggle('on', act); b.setAttribute('aria-pressed', act ? 'true' : 'false');
    });
    root.querySelectorAll('[data-fs]').forEach(function (b) {
      var act = Math.round(Number(UI3.fs) || 13) === Number(b.getAttribute('data-fs'));
      b.classList.toggle('on', act); b.setAttribute('aria-pressed', act ? 'true' : 'false');
    });
    var uv = document.getElementById('vla3-uiv'); if (uv) uv.textContent = Math.round(Number(UI3.scale) || 100) + '%';
    var fv = document.getElementById('vla3-fsv'); if (fv) fv.textContent = Math.round(Number(UI3.fs) || 13) + 'px';
    applyUiCfg();
  }
  var OV_ROWS = [
    ['🏠 Nhân vật', null, 'vla3-ov-1'],
    ['🗺 Bản đồ', null, 'vla3-ov-2'],
    ['⚔ Tàn Sát', 'farm', 'vla3-ov-3'],
    ['🖐 Tự nhặt', 'pick', 'vla3-ov-4'],
    ['🧹 Bán rác', 'sell', 'vla3-ov-5'],
    ['🔀 Đổi khu', 'khu', 'vla3-ov-6'],
    ['🤝 Tổ đội', 'partyAccept', 'vla3-ov-7'],
    ['🛠 Bảo trì', 'maint', 'vla3-ov-8']
  ];
  function ovBuild() {
    var box = document.getElementById('vla3-ov');
    if (!box || box.getAttribute('data-built') === '1') return;
    box.setAttribute('data-built', '1');
    box.innerHTML = OV_ROWS.map(function (r) {
      return '<div class="card"><div class="lg" style="margin:0"><span class="t1">' + esc(r[0]) + '</span>'
        + (r[1] ? '<button class="sw" style="margin-left:auto" data-on="' + r[1] + '" aria-pressed="false"><i></i></button>' : '')
        + '</div><div class="v" id="' + r[2] + '">—</div></div>';
    }).join('');
  }
  function ovRender() {
    ovBuild();
    var set = function (id, v) {
      var e = document.getElementById(id);
      if (!e) return;
      var s = String(v == null ? '' : v);
      if (e.textContent !== s) e.textContent = s;
    };
    var g = G();
    set('vla3-ov-1', g && g.me ? ((g.me.name || '?') + ' · Lv ' + (g.me.level || '?')) : 'chưa vào game');
    set('vla3-ov-2', g && g.map ? mapName(g.map.id) : '—');
    set('vla3-ov-3', STA.t);
    set('vla3-ov-4', STA.p);
    set('vla3-ov-5', (Number(Q.bagFull) || 90) + '% túi');
    set('vla3-ov-6', KS.msg);
    set('vla3-ov-7', PARTY.on ? ('nhận lời mời' + (PARTY_INV.on ? ' · tự mời' : '')) : 'tắt');
    set('vla3-ov-8', STA.m);
  }
  function allSet(on) {
    F.on = on; P.on = on; Q.on = on; KU.on = on; PARTY.on = on; PARTY_INV.on = on; T.farm = newTrip('Tàn Sát');
    if (!on) { M.on = false; if (mTimer) { clearTimeout(mTimer); mTimer = 0; } }
    saveF(); saveP(); saveQ(); saveKU(); saveParty(); savePartyInv(); save('ui2', UI3);
    setSt('t', on ? '▶ đã bật tất cả chức năng' : '■ đã dừng tất cả');
  }
  function tabExists(t) { return !!root.querySelector('.seg button[data-t="' + t + '"]'); }

  function syncUI() {
    paintQ();
    var ft = document.getElementById('vla3-ft'); if (ft) ft.textContent = F.on ? 'bật' : 'tắt';
    var pty = document.getElementById('vla3-pty'); if (pty) pty.textContent = PARTY.on ? 'bật' : 'tắt';
    var pvi = document.getElementById('vla3-pvi'); if (pvi) pvi.textContent = PARTY_INV.on ? 'bật' : 'tắt';
    var pt = document.getElementById('vla3-pt'); if (pt) pt.textContent = P.on ? 'bật' : 'tắt';
    var mt2 = document.getElementById('vla3-mt'); if (mt2) mt2.textContent = M.on ? 'bật' : 'tắt';
    root.querySelectorAll('[data-on]').forEach(function (b) {
      var k = b.getAttribute('data-on');
      sw(b, k === 'farm' ? F.on : k === 'pick' ? P.on : k === 'sell' ? Q.on : k === 'maint' ? M.on : k === 'khu' ? KU.on : k === 'partyAccept' ? PARTY.on : k === 'partyInvite' ? PARTY_INV.on : k === 'orb' ? UI3.orb !== false : false);
    });
    // [3.10.0] đổi khu (tab Tàn Sát)
    root.querySelectorAll('[data-kk]').forEach(function (b) {
      var k2 = b.getAttribute('data-kk');
      sw(b, k2 === 'few' ? !!KU.few : k2 === 'avoid' ? !!KU.avoid : k2 === 'red' ? !!KU.red : false);
    });
    var kht = document.getElementById('vla3-kht'); if (kht) kht.textContent = KU.on ? 'bật' : 'tắt';
    var khr = document.getElementById('vla3-khr'); if (khr && document.activeElement !== khr) khr.value = String(KU.r);
    var khc2 = document.getElementById('vla3-khc'); if (khc2 && document.activeElement !== khc2) khc2.value = String(KU.cool);
    var khv = document.getElementById('vla3-khv');
    if (khv) khv.textContent = 'Khu ' + (khuCurCh() || '?') + ' / ' + (khuChs() || 1) + (khuCurN() != null ? ' · ' + khuCurN() + ' người' : '');
    var khs = document.getElementById('vla3-khs'); if (khs && khs.textContent !== KS.msg) khs.textContent = KS.msg;
    root.querySelectorAll('.ch[data-k]').forEach(function (b) {
      var k = b.getAttribute('data-k');
      var on = k in S ? S[k] : k in P ? P[k] : k in Q ? Q[k] : k === 'keepUp' ? F.keepUp : k === 'fmount' ? S.mount
        : k === 'autoEnter' ? M.autoEnter : k === 'remember' ? M.remember : false;
      sw(b, !!on);
    });
    var curMin = String(P.min || 'common').toLowerCase();
    if (!(curMin in RANK)) curMin = 'common';
    root.querySelectorAll('[data-q]').forEach(function (b) {
      sw(b, String(b.getAttribute('data-q')).toLowerCase() === curMin);
    });
    var mn = document.getElementById('vla3-min'); if (mn) mn.textContent = RQ[curMin] || 'Thường';
    var pah = document.getElementById('vla3-pah'); if (pah && document.activeElement !== pah) pah.value = String(P.hpMin);   // [3.12.0] AI nhặt an toàn
    var pan = document.getElementById('vla3-pan'); if (pan && document.activeElement !== pan) pan.value = String(P.foeN);
    var par = document.getElementById('vla3-par'); if (par && document.activeElement !== par) par.value = String(P.haz);
    var pa = document.getElementById('vla3-pa');
    if (pa) {
      var ptxt = P.ai
        ? ('nguy hiểm ' + PAI.risk + '/100 · ' + (PAI.why || 'quanh người sạch quái') + ' · ngưỡng: máu < ' + P.hpMin
           + '% hoặc > ' + P.foeN + ' quái trong ' + P.haz + 'px' + (PAI.needHp ? ' · đang chờ hồi máu ≥ ' + PAI.needHp + '%' : ''))
        : 'đang tắt — dùng luật cũ (máu < 25% hoặc quái < 90px)';
      if (pa.textContent !== ptxt) pa.textContent = ptxt;
    }
    // [3.8.0] hiện RÕ mức đang chọn của tầm nhặt + mốc túi (trước đây 3 nút trông giống nhau, không biết đang bật cái nào)
    root.querySelectorAll('[data-a^="r-"]').forEach(function (b) {
      var v = Number(String(b.getAttribute('data-a')).slice(2)), act = Math.abs(v - P.range) < 1;
      b.classList.toggle('on', act); b.classList.toggle('g', !act); b.setAttribute('aria-pressed', act ? 'true' : 'false');
    });
    root.querySelectorAll('[data-a^="qf-"]').forEach(function (b) {
      var v = Number(String(b.getAttribute('data-a')).slice(3)), act = (Number(Q.bagFull) || 90) === v;
      b.classList.toggle('on', act); b.classList.toggle('g', !act); b.setAttribute('aria-pressed', act ? 'true' : 'false');
    });
    var rg = document.getElementById('vla3-rng');
    if (rg) rg.textContent = (P.range <= 400 ? 'Gần' : P.range >= 1000 ? 'Xa' : 'Vừa') + ' · ' + P.range + 'px';
    var bg = document.getElementById('vla3-bag');
    if (bg) bg.textContent = (Number(Q.bagFull) || 90) + '%';
    var u = document.getElementById('vla3-u'), p = document.getElementById('vla3-p'), d = document.getElementById('vla3-d');
    if (u && document.activeElement !== u) u.value = MC.user || '';
    if (p && document.activeElement !== p) p.value = MC.pass || '';
    if (d && document.activeElement !== d) d.value = String(M.delay);
    var up = document.getElementById('vla3-up');
    if (up) up.textContent = F.upMap != null ? mapName(F.upMap) : 'chưa lưu';
    var fs = document.getElementById('vla3-fs'); if (fs) fs.textContent = STA.t;
    var ps = document.getElementById('vla3-ps'); if (ps) ps.textContent = STA.p;
    var ms = document.getElementById('vla3-ms'); if (ms) ms.textContent = STA.m;
    if (UI3.tab === 'ov') ovRender();
    uiCfgPaint();
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
      else if (k === 'up') { F.upMap = G() && G().map ? G().map.id : null; F.keepUp = true; saveF(); }
      else if (k === 'upclear') { F.upMap = null; F.keepUp = false; saveF(); }
      else if (k === 'r-400') { P.range = 400; saveP(); }
      else if (k === 'r-700') { P.range = 700; saveP(); }
      else if (k === 'r-1000') { P.range = 1000; saveP(); }
      else if (k === 'qf-70') { Q.bagFull = 70; saveQ(); }
      else if (k === 'qf-90') { Q.bagFull = 90; saveQ(); }
      else if (k === 'qf-100') { Q.bagFull = 100; saveQ(); }
      else if (k === 'sellnow') { sellNow(false); }
      else if (k === 'khunow') {   // [3.10.0] đổi ngay sang khu ít người
        if (!inGame()) { KS.msg = 'Chưa vào game'; syncUI(); return; }
        if (khuChs() < 2) { KS.msg = 'Map này không có khu để đổi'; syncUI(); return; }
        khuRequest(true);
        var ko = khuOther(false);
        if (!ko) { KS.msg = KS.list.length ? 'Không còn khu nào trống' : 'Đã hỏi máy chủ danh sách khu — bấm lại sau 1-2 giây'; }
        else if (!khuSwitch(ko.ch, 'đổi ngay sang khu ' + ko.ch + ' (' + ko.n + ' người)')) {
          KS.msg = now() < KS.coolUntil ? ('Đang nghỉ giữa 2 lần đổi khu — còn ' + Math.ceil((KS.coolUntil - now()) / 1000) + 's') : 'Không đổi được khu';
        }
        syncUI(); return;
      }
      else if (k === 'khulist') {   // [3.10.0] xem danh sách khu
        if (!inGame()) { KS.msg = 'Chưa vào game'; syncUI(); return; }
        khuRequest(true);
        KS.msg = KS.list.length
          ? ('Khu: ' + KS.list.map(function (c) { return (c.cur ? '📍' : '') + c.ch + '·' + c.n + '/' + (c.cap || '?'); }).join('   '))
          : 'Đã hỏi máy chủ — bấm lại sau 1-2 giây để xem danh sách khu';
        syncUI(); return;
      }
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
      if (kk === 'khu') { KU.on = !KU.on; KS.list = []; KS.reqAt = -1e9; KS.coolUntil = 0; KS.swapWhy = ''; KS.map = ''; }   // [3.10.0] đổi khu   // [3.9.0] tăng tốc độ   // [3.7.0] đào khoáng
      if (kk === 'sell') Q.on = !Q.on;
      if (kk === 'maint') { M.on = !M.on; if (!M.on && mTimer) { clearTimeout(mTimer); mTimer = 0; } }
      if (kk === 'partyAccept') PARTY.on = !PARTY.on;
      if (kk === 'partyInvite') PARTY_INV.on = !PARTY_INV.on;
      if (kk === 'orb') UI3.orb = (UI3.orb === false);
      saveF(); saveP(); saveQ(); saveM(); saveKU(); saveParty(); savePartyInv(); save('ui2', UI3);
      syncUI(); return;
    }
    var kuc = t.closest('[data-kk]');   // [3.10.0] chip đổi khu
    if (kuc) {
      var kuk = kuc.getAttribute('data-kk');
      if (kuk === 'few') KU.few = !KU.few;
      else if (kuk === 'avoid') KU.avoid = !KU.avoid;
      else if (kuk === 'red') KU.red = !KU.red;
      saveKU(); syncUI(); return;
    }
    var sq = t.closest('[data-sq]');   // [3.7.0] phẩm chất để BÁN (bật/tắt nhiều mức, khác ô chọn phẩm chất để NHẶT)
    if (sq) {
      var sqk = String(sq.getAttribute('data-sq') || 'common').toLowerCase();
      if (sqk in RANK) { Q[sqk] = !Q[sqk]; saveQ(); }
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
      else if (ck in Q) { Q[ck] = !Q[ck]; saveQ(); }
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
      if (el.id === 'vla3-khr') { KU.r = Math.max(100, Math.min(2000, Math.round(Number(el.value) || 600))); saveKU(); }
      if (el.id === 'vla3-khc') { KU.cool = Math.max(5, Math.min(600, Math.round(Number(el.value) || 30))); saveKU(); }
      if (el.id === 'vla3-pah') {   // [3.12.0] AI nhặt an toàn: % máu tối thiểu để đi nhặt
        P.hpMin = pint(el.value, 30, 95, 55);
        if (P.hpBack < P.hpMin) P.hpBack = Math.min(100, P.hpMin + 15);
        saveP(); syncUI();
      }
      if (el.id === 'vla3-pan') { P.foeN = pint(el.value, 1, 8, 2); saveP(); syncUI(); }
      if (el.id === 'vla3-par') { P.haz = pint(el.value, 80, 500, 150); saveP(); syncUI(); }
    });
  });


  /* Menu mới: cỡ bảng / cỡ chữ / vị trí / bật-dừng tất cả (không đụng các nút cũ) */
  root.addEventListener('click', function (e) {
    var t = e.target;
    var ub = t.closest('[data-ui]');
    if (ub) { UI3.scale = Math.max(70, Math.min(140, Number(ub.getAttribute('data-ui')) || 100)); uiCfgPaint(); uiCfgSave(); return; }
    var fb = t.closest('[data-fs]');
    if (fb) { UI3.fs = Math.max(10, Math.min(16, Number(fb.getAttribute('data-fs')) || 13)); uiCfgPaint(); uiCfgSave(); return; }
    var ob = t.closest('[data-oa]');
    if (ob) {
      var k2 = ob.getAttribute('data-oa');
      if (k2 === 'on') allSet(true);
      else if (k2 === 'off') allSet(false);
      else if (k2 === 'home') {
        UI3.x = null; UI3.y = null;
        root.style.left = 'auto'; root.style.top = 'auto'; root.style.right = '12px'; root.style.bottom = '76px';
        clampPanel();
      } else if (k2 === 'orbhome') { UI3.px = null; UI3.py = null; fitOrb(); }
      uiCfgSave(); syncUI(); return;
    }
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
      if (e.target.closest('[data-a],[data-on],.ch,.seg,input,[data-oa],[data-ui],[data-fs]')) return;
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
    var saved = load('ui2', null);
    if (saved) { UI3 = Object.assign(UI3, saved); }
    // Bản cũ lưu open:true nên cứ vào game là tự mở; lần này tôn trọng trạng thái đã lưu, mặc định đóng.
    if (UI3.open === true) root.classList.remove('hide'); else root.classList.add('hide');
    if (!tabExists(UI3.tab)) UI3.tab = 'ov';   // menu moi: tab cu (boss/toc do/...) khong con
    page(UI3.tab); applyUiCfg(); syncUI(); uiList();
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
  every(1000, khuTick, '[VLA3-khu]');   // [3.10.0] đổi khu ít người / tránh Đồ sát
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
  A.state = { F: F, P: P, M: M, S: S, T: T, STA: STA, UI3: UI3, KU: KU, KS: KS };
  A.khu = { cfg: KU, state: KS, tick: khuTick, got: khuGot, request: khuRequest, other: khuOther, danger: khuDanger,
            switchTo: khuSwitch, cur: khuCurCh, chs: khuChs, curN: khuCurN, text: function () { return KS.msg; },
            save: saveKU, consts: { DIFF: KHU_DIFF, BAD: KHU_BAD } };   // [3.10.0] đổi khu
  A.ui = { page: page, open: openPanel, close: closePanel, sync: syncUI, list: uiList, tabs: function () { return [].map.call(root.querySelectorAll('.seg button'), function (b) { return b.getAttribute('data-t'); }); }, show: function (tt) { if (tabExists(tt)) page(tt); }, cfg: uiCfgPaint, apply: applyUiCfg, all: allSet };
  A.pick = { cfg: P, ok: pOK, find: pFind, rank: rk, RANK: RANK, ai: PAI, counts: pCounts, step: pickStep, tick: tickP, collect: pCollect, foot: pFootBurst,
             sell: { cfg: Q, list: sellList, now: sellNow, price: sellPrice, tick: qTick, got: function () { return qGot; }, state: qS },
             risk: pDanger, foes: pFoeList, scan: pScan, aiOk: pAiOk, dropRisk: pDropRisk, tripMax: pTripMax,   // [3.12.0] AI nhặt an toàn
             consts: { PICK_R: PICK_R, PICK_TRY: PICK_TRY, PICK_COOL: PICK_COOL, RISK_BAD: PICK_RISK_BAD, TRIP_SHORT: PICK_TRIP_SHORT } };   // QA: lọc phẩm chất + AI nhặt + bán rác
  A.maps = { table: GAMEMAPS, noTp: NO_TP, bad: TPBAD, cand: tpCand, ok: tpOk, minLv: tpMinLv,
             name: mapName, serves: tpServes, pick: tpPick, render: uiMaps };   // QA: bảng bản đồ + Xa Phu
  console.log('[VLA3] Võ Lâm Auto 3 - Member 3.13.0 đã tải');

  /* ============ 3C. TO DOI: TU NHAN LOI MOI + TU MOI NGUOI KHAC ============ */
  /* API that cua game (js/party09a3.js):
       G.socket.on('partyReq', d)        -> co nguoi moi vao doi (d = {name, cls, level, n})
       G.socket.emit('party', {op:'accept'})  -> vao doi
       window.Party.data / Party.has(id) / Party.invite(entity)
     - Tu nhan: nghe thang socket partyReq + quet modal du phong moi 1,5s.
     - Tu moi: chi khi dang la doi truong va doi chua du 6 nguoi. */
  function savePartyInv() { save('partyInv', { on: PARTY_INV.on, r: PARTY_INV.r, cool: PARTY_INV.cool, gap: PARTY_INV.gap }); }

  var _pSock = null, _pReq = null, _pCool = {}, _pLastInv = 0, _pBudget = [];

  function partyModalBtn() {
    var box = document.getElementById('modal-msg');
    if (!box || box.classList.contains('hidden')) return null;
    var txt = norm(box.textContent);
    if (txt.indexOf('vao to doi') < 0 && txt.indexOf('moi ban vao to doi') < 0 && txt.indexOf('moi to doi') < 0) return null;
    var btns = box.querySelectorAll('#modal-btns button, button');
    for (var i = 0; i < btns.length; i++) {
      var t = norm(btns[i].textContent);
      if (t === 'vao doi' || t.indexOf('vao doi') === 0 || t === 'dong y' || t.indexOf('dong y') === 0 ||
          t === 'chap nhan' || t.indexOf('chap nhan') === 0 || t === 'accept' || t.indexOf('tham gia') === 0) return btns[i];
    }
    return null;
  }

  function partyAccept(sock, tries) {
    var b = partyModalBtn();
    if (b) { try { b.click(); } catch (e) {} return true; }
    if ((tries || 0) >= 5) return false;
    setTimeout(function () { try { partyAccept(sock, (tries || 0) + 1); } catch (e) {} }, 220);
    return false;
  }

  function partyBind(sock) {
    if (!sock || _pSock === sock) return;
    try { if (_pSock && _pReq && _pSock.off) _pSock.off('partyReq', _pReq); } catch (e) {}
    _pSock = sock;
    _pReq = function (d) {
      try {
        if (!PARTY.on || !d) return;
        if (window.Social && Social.blocked && Social.blocked(d.name)) return;   // ton trong danh sach chan
        setTimeout(function () { try { partyAccept(sock, 0); } catch (e) {} }, 90);
      } catch (e) {}
    };
    try { sock.on('partyReq', _pReq); } catch (e) {}
  }

  function partyState() { try { return (window.Party && Party.data) || null; } catch (e) { return null; } }
  function partyLeaderMe() { var p = partyState(); return !!(p && p.you != null && p.leader === p.you); }
  function partyCount() { var p = partyState(); return (p && p.members && p.members.length) || 0; }

  function partyTick() {
    var g = G();
    if (!g || !g.socket || !inGame()) return;
    partyBind(g.socket);
    if (PARTY.on) { try { partyAccept(g.socket, 1); } catch (e) {} }   // du phong: modal dang mo
    if (!PARTY_INV.on) return;
    if (!partyLeaderMe() || partyCount() >= 6) return;
    var t = now();
    if (t - _pLastInv < PARTY_INV.gap) return;
    _pBudget = _pBudget.filter(function (x) { return t - x < 60000; });
    if (_pBudget.length >= 12) return;   // toi da 12 loi moi / phut
    var s = g.self; if (!s) return;
    var best = null, bd = 1e9;
    try {
      g.players.forEach(function (p, id) {
        if (id === g.you || !p || p.dead || p.pm === 2 || !p.name) return;   // bo qua Dồ sát / chet / khong ten
        if (window.Party && Party.has && Party.has(id)) return;             // da trong doi
        var d = Math.hypot(p.x - s.x, p.y - s.y);
        if (d > PARTY_INV.r || d >= bd) return;
        if (_pCool[id] && t - _pCool[id] < PARTY_INV.cool) return;
        bd = d; best = p;
      });
    } catch (e) { return; }
    if (!best) return;
    try { window.Party.invite(best); } catch (e) { return; }
    _pCool[best.id] = t; _pLastInv = t; _pBudget.push(t);
    try { setSt('t', '🤝 đã mời ' + best.name + ' vào tổ đội'); } catch (e) {}
    try { console.log('[VLA3] mời tổ đội:', best.name, 'id', best.id); } catch (e) {}
  }

  try { if (window.__VLA3_PARTY_OBS) { window.__VLA3_PARTY_OBS.disconnect(); window.__VLA3_PARTY_OBS = null; } } catch (e) {}
  every(1500, partyTick, '[VLA3-party]');
  A.party = { acceptCfg: PARTY, cfg: PARTY_INV, save: savePartyInv, tick: partyTick, bind: partyBind, accept: partyAccept,
              leader: partyLeaderMe, count: partyCount, state: partyState };
  var _pOldDestroy = A.destroy;
  A.destroy = function () {
    try { if (_pSock && _pReq && _pSock.off) _pSock.off('partyReq', _pReq); } catch (e) {}
    try { _pOldDestroy(); } catch (e) {}
  };
})();
}, 800);



