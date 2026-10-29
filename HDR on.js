// ==UserScript==
// @name         Võ Lâm 2D · HDR Visual Overhaul
// @namespace    https://lemoncode.ai/volam2d
// @version      2.1.0
// @description  HDR-hoá toàn bộ giao diện Võ Lâm 2D: màu rực rỡ, làm nét tối đa sprite/atlas, cel-shading, bloom/light particles.
// @author       Lemon Code
// @match        https://volam2d.com/*
// @match        https://*.volam2d.com/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const LS_KEY = 'vl_hdr_ui';
  const GAME_HOST = /(^|\.)volam2d\.com$/i.test(location.hostname);
  const OUTLINE = [16, 12, 34];          // màu viền cel-shading (tím than đậm)
  const state = { on: true, sharp: true, sharpAmount: 1.0, bloom: 0.06, sprites: false, particles: null, raf: 0 };

  try {
    state.on = localStorage.getItem(LS_KEY) !== '0';
    state.sharp = localStorage.getItem('vl_hdr_sharp') !== '0';
    const amt = parseFloat(localStorage.getItem('vl_hdr_amount'));
    if (isFinite(amt)) state.sharpAmount = Math.max(0, Math.min(1.5, amt));
    const bl = parseFloat(localStorage.getItem('vl_hdr_bloom'));
    if (isFinite(bl)) state.bloom = Math.max(0, Math.min(0.4, bl));
  } catch (e) { }

  // ---------------------------------------------------------------- CSS
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap');

html.hdr-ui {
  --bg:#04060e; --panel:rgba(13,17,38,.95); --panel2:#1a2452; --line:#5f7dff;
  --gold:#ffd76a; --gold2:#ff9f2f; --text:#f2f5ff; --muted:#9fb0e0;
  --red:#ff4d6d; --blue:#4d9dff; --green:#3dfba0; --purple:#b96bff; --orange:#ff9f2f;
  --rare:#2fd0ff; --epic:#b96bff; --legendary:#ff9f2f; --common:#dbe3ff;
  --hdr-ink:#080b1a; --hdr-glow:rgba(80,140,255,.65);
}
html.hdr-ui body {
  font-family:"M PLUS Rounded 1c","Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:
    radial-gradient(ellipse at 18% -5%, rgba(120,70,255,.30), transparent 55%),
    radial-gradient(ellipse at 88% 105%, rgba(255,70,160,.22), transparent 55%),
    radial-gradient(ellipse at 50% 120%, rgba(255,140,50,.12), transparent 60%),
    #04060e;
}

/* ---------- canvas: HDR color + siêu nét ---------- */
html.hdr-ui #game,
html.hdr-ui #scene-bg {
  filter: saturate(1.48) contrast(1.20) brightness(1.04);
  image-rendering: -webkit-optimize-contrast;
}
html.hdr-ui.hdr-sharp #game,
html.hdr-ui.hdr-sharp #scene-bg {
  filter: saturate(1.58) contrast(1.30) brightness(1.05);
}
html.hdr-ui #minimap,
html.hdr-ui #hud-avatar,
html.hdr-ui #class-preview,
html.hdr-ui #enter-preview {
  filter: saturate(1.38) contrast(1.14) brightness(1.03);
  image-rendering: -webkit-optimize-contrast;
}
html.hdr-ui #vignette::after {
  background: radial-gradient(ellipse farthest-corner at 50% 46%, rgba(8,6,26,0) 40%, rgba(8,6,26,.62) 100%);
}

/* ---------- khung trang trí ---------- */
html.hdr-ui #screen-game::after {
  content:''; position:absolute; inset:6px; border-radius:16px; pointer-events:none; z-index:1;
  border:1px solid rgba(140,170,255,.16);
  box-shadow: inset 0 0 40px rgba(90,120,255,.10), inset 0 0 0 1px rgba(255,255,255,.03);
}

/* ---------- panel ---------- */
html.hdr-ui #panel { background: radial-gradient(ellipse at center, rgba(6,8,22,.38), rgba(4,6,16,.76)); backdrop-filter: blur(3px); }
html.hdr-ui #panel .panel-box {
  background: linear-gradient(165deg, rgba(34,42,86,.97), rgba(13,17,38,.97));
  border:1px solid rgba(130,160,255,.38);
  border-radius:18px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.55), 0 22px 70px rgba(0,0,0,.65), inset 0 1px 0 rgba(190,210,255,.14), 0 0 42px rgba(90,120,255,.22);
  backdrop-filter: blur(14px) saturate(1.35);
}
html.hdr-ui #panel .panel-head { border-bottom:1px solid rgba(130,160,255,.22); }
html.hdr-ui #panel-title {
  font-family:"M PLUS Rounded 1c",sans-serif; font-weight:800; letter-spacing:.5px;
  background:linear-gradient(180deg,#fff7d6,#ffcf74 55%,#ff9f3a);
  -webkit-background-clip:text; background-clip:text; color:transparent;
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.45));
}
html.hdr-ui #panel-close {
  border:1px solid rgba(255,180,120,.55) !important;
  background:radial-gradient(circle at 35% 30%, #ff8a6a, #c8322a 55%, #6a120c) !important;
  box-shadow: 0 0 14px rgba(255,90,70,.5), inset 0 1px 0 rgba(255,220,200,.35) !important;
  color:#fff6ea !important;
}

/* ---------- nút ---------- */
html.hdr-ui .btn {
  border-radius:10px;
  border:1px solid rgba(255,201,112,.75);
  background:linear-gradient(180deg,#8a5c2c 0%,#5a3a18 46%,#3d2711 54%,#2a1a0b 100%);
  color:#ffe6a8; text-shadow:0 1px 0 rgba(0,0,0,.55);
  box-shadow:inset 0 1px 0 rgba(255,235,180,.35), inset 0 -2px 0 rgba(0,0,0,.35), 0 3px 10px rgba(0,0,0,.45);
  transition:filter .14s, transform .08s, box-shadow .16s, border-color .16s;
}
html.hdr-ui .btn:hover { filter:brightness(1.16) saturate(1.1); box-shadow:inset 0 1px 0 rgba(255,245,200,.45), 0 0 16px rgba(255,190,80,.4), 0 3px 10px rgba(0,0,0,.45); }
html.hdr-ui .btn.primary { background:linear-gradient(180deg,#ff7a5c 0%,#d83a2a 46%,#a81f16 54%,#741008 100%); border-color:#ffd98a; color:#fff8e8; }
html.hdr-ui .btn.primary:hover { box-shadow:0 0 20px rgba(255,110,80,.55), inset 0 1px 0 rgba(255,230,210,.4); }
html.hdr-ui .btn.green { background:linear-gradient(180deg,#6ef0a0 0%,#2fae5c 46%,#1e8a45 54%,#12602f 100%); border-color:#b8ffd4; color:#f2fff6; }
html.hdr-ui .btn.red { background:linear-gradient(180deg,#ff6a8a 0%,#c81f46 46%,#9a1034 54%,#6a0822 100%); border-color:#ffb8c8; }

/* ---------- input ---------- */
html.hdr-ui input, html.hdr-ui select, html.hdr-ui textarea {
  background:linear-gradient(180deg, rgba(10,14,32,.95), rgba(18,24,52,.95));
  border:1px solid rgba(120,150,255,.35); border-radius:9px; color:var(--text);
  box-shadow:inset 0 1px 3px rgba(0,0,0,.5);
}
html.hdr-ui input:focus, html.hdr-ui select:focus, html.hdr-ui textarea:focus {
  border-color:#8fb0ff; box-shadow:0 0 0 2px rgba(110,150,255,.22), inset 0 1px 3px rgba(0,0,0,.5);
}

/* ---------- HUD ---------- */
html.hdr-ui #vignette { z-index:3; }
html.hdr-ui #hud { z-index:4; }
html.hdr-ui #hud-status {
  background:linear-gradient(160deg, rgba(24,30,64,.86), rgba(10,13,30,.86));
  border:1px solid rgba(130,160,255,.30); border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,.45), inset 0 1px 0 rgba(190,210,255,.12), 0 0 26px rgba(90,120,255,.16);
  backdrop-filter: blur(10px) saturate(1.3);
}
html.hdr-ui #hud-status .avatar {
  border-radius:50%;
  box-shadow:0 0 0 2px rgba(255,224,138,.65), 0 0 18px rgba(255,200,90,.45);
}
html.hdr-ui #hud-name { color:#fff4d0; text-shadow:0 1px 0 rgba(0,0,0,.6), 0 0 12px rgba(255,210,120,.35); }
html.hdr-ui .bar { border-radius:99px; border:1px solid rgba(0,0,0,.55); background:#0d1024; box-shadow:inset 0 1px 3px rgba(0,0,0,.6); }
html.hdr-ui .bar i { border-radius:99px; }
html.hdr-ui .bar.hp i { background:linear-gradient(90deg,#ff8a9a,#ff4d68 55%,#c2183a); box-shadow:0 0 10px rgba(255,80,110,.55); }
html.hdr-ui .bar.mp i { background:linear-gradient(90deg,#8fd4ff,#4d9dff 55%,#2757c8); box-shadow:0 0 10px rgba(90,160,255,.55); }
html.hdr-ui #exp-bar { border-radius:99px; }
html.hdr-ui #exp-bar i { background:linear-gradient(90deg,#ffe9a0,#ffc24a 55%,#ff9b2f) !important; box-shadow:0 0 12px rgba(255,190,80,.6); }
html.hdr-ui #hud-top #map-name {
  background:linear-gradient(160deg, rgba(28,34,72,.82), rgba(12,16,36,.82));
  border:1px solid rgba(130,160,255,.28); border-radius:12px; padding:3px 10px;
  box-shadow:0 6px 18px rgba(0,0,0,.4), inset 0 1px 0 rgba(190,210,255,.12);
}
html.hdr-ui #net-pill { background:rgba(8,12,28,.78); border:1px solid rgba(120,150,255,.28); border-radius:99px; }
html.hdr-ui #target-frame {
  background:linear-gradient(160deg, rgba(60,20,40,.88), rgba(18,10,28,.9));
  border:1px solid rgba(255,140,160,.45); border-radius:14px;
  box-shadow:0 10px 26px rgba(0,0,0,.5), 0 0 22px rgba(255,80,110,.22);
  backdrop-filter: blur(8px);
}

/* ---------- nút menu / quick ---------- */
html.hdr-ui #menu-buttons button, html.hdr-ui #quick-btns .qb {
  background:linear-gradient(165deg, rgba(34,42,88,.9), rgba(14,18,40,.92));
  border:1px solid rgba(130,160,255,.28); border-radius:13px;
  box-shadow:0 5px 16px rgba(0,0,0,.4), inset 0 1px 0 rgba(190,210,255,.12);
  transition:transform .12s, box-shadow .16s, border-color .16s, filter .16s;
}
html.hdr-ui #menu-buttons button:hover, html.hdr-ui #quick-btns .qb:hover {
  transform:translateY(-2px);
  border-color:rgba(160,190,255,.55);
  box-shadow:0 10px 22px rgba(0,0,0,.48), 0 0 20px rgba(100,140,255,.35), inset 0 1px 0 rgba(200,220,255,.18);
}
html.hdr-ui #menu-buttons button span, html.hdr-ui #quick-btns .qb span { color:#dfe6ff; }
html.hdr-ui #mini-wrap { border-radius:12px; overflow:hidden; box-shadow:0 0 0 1px rgba(130,160,255,.3), 0 8px 20px rgba(0,0,0,.45); }

/* ---------- chat ---------- */
html.hdr-ui #chat {
  background:linear-gradient(165deg, rgba(22,28,60,.9), rgba(9,12,28,.92));
  border:1px solid rgba(130,160,255,.26); border-radius:14px;
  box-shadow:0 12px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(190,210,255,.1);
  backdrop-filter: blur(10px) saturate(1.25);
  overflow:hidden;
}
html.hdr-ui #chat-tabs { background:rgba(8,12,28,.6); border-bottom:1px solid rgba(130,160,255,.18); }
html.hdr-ui #chat-tabs button {
  border-radius:99px; border:1px solid transparent; color:#b9c4ec; transition:all .14s;
}
html.hdr-ui #chat-tabs button.on {
  color:#171226; background:linear-gradient(180deg,#ffe6a0,#ffbe52);
  border-color:#ffe6a0; box-shadow:0 0 12px rgba(255,200,90,.4); font-weight:800;
}
html.hdr-ui #chat-log .m { border-radius:8px; }
html.hdr-ui #chat-log .m .from { color:#8fd4ff !important; }
html.hdr-ui #chat-form input, html.hdr-ui #chat-form select { border-radius:99px; }
html.hdr-ui #chat-form .btn { border-radius:99px; }

/* ---------- toast / announce ---------- */
html.hdr-ui #toasts .toast {
  background:linear-gradient(160deg, rgba(30,38,82,.94), rgba(12,16,36,.94));
  border:1px solid rgba(130,160,255,.35); border-left:3px solid #7ea0ff;
  border-radius:12px; box-shadow:0 10px 26px rgba(0,0,0,.5), 0 0 18px rgba(90,120,255,.18);
  color:#eef2ff; backdrop-filter:blur(8px);
}
html.hdr-ui #toasts .toast.error { border-left-color:#ff6a86; }
html.hdr-ui #toasts .toast.reward, html.hdr-ui #toasts .toast.item\:epic, html.hdr-ui #toasts .toast.item\:legendary { border-left-color:#ffc24a; }
html.hdr-ui #announce .a { color:#fff0b8; text-shadow:0 0 10px rgba(255,190,80,.5), 1px 1px 2px #000; }
html.hdr-ui #pin-ticker { background:linear-gradient(90deg, transparent, rgba(90,20,40,.75) 12%, rgba(90,20,40,.75) 88%, transparent); }

/* ---------- skill bar / touch ---------- */
html.hdr-ui #skillbar .skill, html.hdr-ui .act {
  border-radius:14px;
  box-shadow:0 6px 16px rgba(0,0,0,.45), inset 0 1px 0 rgba(200,220,255,.14);
}
html.hdr-ui #skillbar .skill.ready, html.hdr-ui .act.ready {
  box-shadow:0 0 0 1px rgba(255,224,138,.5), 0 0 18px rgba(255,200,90,.4), inset 0 1px 0 rgba(255,240,200,.25);
}
html.hdr-ui .sk-img { filter:saturate(1.25) contrast(1.08); }
html.hdr-ui #joy-base { box-shadow:0 0 0 2px rgba(130,160,255,.3), 0 0 22px rgba(100,140,255,.3), inset 0 0 18px rgba(0,0,0,.5); }
html.hdr-ui #joy-knob { box-shadow:0 0 18px rgba(140,170,255,.6), inset 0 0 8px rgba(255,255,255,.35); }

/* ---------- modal / dead / tooltip ---------- */
html.hdr-ui #modal-msg { background:rgba(4,6,18,.66); backdrop-filter:blur(4px); }
html.hdr-ui #modal-msg .modal-box {
  background:linear-gradient(165deg, rgba(36,44,90,.98), rgba(13,17,38,.98));
  border:1px solid rgba(130,160,255,.42); border-radius:18px;
  box-shadow:0 0 0 1px rgba(0,0,0,.5), 0 24px 70px rgba(0,0,0,.65), 0 0 40px rgba(90,120,255,.25);
}
html.hdr-ui #dead-overlay .dead-box {
  border-radius:18px; border:1px solid rgba(255,140,160,.42);
  box-shadow:0 0 50px rgba(255,60,90,.25), 0 24px 60px rgba(0,0,0,.65);
}
html.hdr-ui #tooltip {
  background:linear-gradient(165deg, rgba(26,32,66,.98), rgba(10,13,30,.98));
  border:1px solid rgba(140,170,255,.42); border-radius:12px;
  box-shadow:0 14px 34px rgba(0,0,0,.6), 0 0 18px rgba(90,120,255,.2);
  color:#e9eeff;
}

/* ---------- tracker / loading / misc ---------- */
html.hdr-ui #tracker > div, html.hdr-ui #daily-box, html.hdr-ui #tutorial-box {
  border-radius:12px;
}
html.hdr-ui #daily-box {
  background:linear-gradient(165deg, rgba(24,30,62,.9), rgba(10,13,30,.9));
  border:1px solid rgba(130,160,255,.24);
  box-shadow:0 8px 22px rgba(0,0,0,.4);
}
html.hdr-ui #loading { background:rgba(4,6,18,.78); backdrop-filter:blur(4px); }
html.hdr-ui #map-loading { background:rgba(4,6,18,.55); }

/* ---------- pregame ---------- */
html.hdr-ui .pg-logo-t {
  background:linear-gradient(180deg,#fff7d6,#ffd06a 55%,#ff9a3a);
  -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 2px 0 rgba(0,0,0,.35)) drop-shadow(0 0 18px rgba(255,170,60,.45));
}
html.hdr-ui .pg-seal {
  background:linear-gradient(180deg,#ff8a6a,#c42a20) !important;
  box-shadow:0 0 18px rgba(255,90,70,.5), inset 0 1px 0 rgba(255,220,200,.4) !important;
}
html.hdr-ui .pg-login, html.hdr-ui .pg-box, html.hdr-ui .login-box {
  border-radius:18px;
  border:1px solid rgba(130,160,255,.32);
  box-shadow:0 24px 70px rgba(0,0,0,.6), 0 0 42px rgba(90,120,255,.18);
  backdrop-filter:blur(12px) saturate(1.25);
}

/* ---------- scrollbar ---------- */
html.hdr-ui ::-webkit-scrollbar { width:9px; height:9px; }
html.hdr-ui ::-webkit-scrollbar-track { background:rgba(8,12,28,.6); border-radius:9px; }
html.hdr-ui ::-webkit-scrollbar-thumb {
  background:linear-gradient(180deg,#5b7cfa,#8b5cff); border-radius:9px;
  border:2px solid rgba(8,12,28,.6);
}
html.hdr-ui ::-webkit-scrollbar-thumb:hover { background:linear-gradient(180deg,#7a97ff,#a37bff); }

/* ---------- badge ---------- */
#vl-hdr-badge {
  position:fixed; right:10px; bottom:10px; z-index:2147483000;
  display:flex; align-items:center; gap:6px;
  padding:6px 11px; border-radius:99px; cursor:pointer;
  font:800 11px/1 "M PLUS Rounded 1c", "Be Vietnam Pro", system-ui, sans-serif;
  letter-spacing:.6px; color:#171226;
  background:linear-gradient(180deg,#ffe6a0,#ffbe52 60%,#ff9a3a);
  border:1px solid #fff0c0;
  box-shadow:0 6px 18px rgba(0,0,0,.45), 0 0 18px rgba(255,190,80,.45);
  user-select:none; -webkit-user-select:none; transition:transform .12s, filter .12s, opacity .2s;
}
#vl-hdr-badge:hover { transform:translateY(-2px) scale(1.03); filter:brightness(1.08); }
#vl-hdr-badge.off { background:linear-gradient(180deg,#5a6488,#303a5c); color:#c8d2f0; border-color:#7a86b0; box-shadow:0 6px 18px rgba(0,0,0,.45); }
#vl-hdr-badge i { width:7px; height:7px; border-radius:50%; background:#22d3ee; box-shadow:0 0 9px #22d3ee; }
#vl-hdr-badge.no-sharp i { background:#fbbf24; box-shadow:0 0 9px #fbbf24; }
#vl-hdr-badge.off i { background:#94a3b8; box-shadow:none; }

/* hiệu ứng thở nhẹ cho badge */
@keyframes vlHdrPulse { 0%,100% { box-shadow:0 6px 18px rgba(0,0,0,.45), 0 0 14px rgba(255,190,80,.35); } 50% { box-shadow:0 6px 18px rgba(0,0,0,.45), 0 0 24px rgba(255,190,80,.65); } }
html.hdr-ui #vl-hdr-badge { animation:vlHdrPulse 2.6s ease-in-out infinite; }

/* ---------- overlay HDR ---------- */
#vl-hdr-glow {
  position:absolute; inset:0; pointer-events:none; z-index:1;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(255,228,180,.13), transparent 42%),
    radial-gradient(ellipse at 16% 82%, rgba(70,150,255,.12), transparent 52%),
    radial-gradient(ellipse at 86% 72%, rgba(255,90,190,.10), transparent 52%),
    radial-gradient(ellipse at 50% 110%, rgba(255,130,40,.08), transparent 58%);
  mix-blend-mode:screen; opacity:.55;
  animation:vlHdrBreath 6s ease-in-out infinite;
}
#vl-hdr-glow::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(40,90,220,.10), transparent 30%, transparent 70%, rgba(255,120,40,.08));
  mix-blend-mode:soft-light;
}
@keyframes vlHdrBreath { 0%,100% { opacity:.50; } 50% { opacity:.78; } }
#vl-hdr-particles { position:absolute; inset:0; pointer-events:none; z-index:2; }
`;

  function injectCSS(css) {
    const put = () => {
      if (document.getElementById('vl-hdr-style')) return;
      const s = document.createElement('style');
      s.id = 'vl-hdr-style';
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    };
    if (document.head || document.documentElement) put();
    else document.addEventListener('DOMContentLoaded', put, { once: true });
  }
  injectCSS(CSS);
  if (GAME_HOST) document.documentElement.classList.toggle('hdr-ui', state.on);

  // ------------------------------------------------------------ helpers
  function outline(canvas, skipBelow) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    if (!w || !h) return;
    const img = ctx.getImageData(0, 0, w, h), d = img.data;
    const src = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) src[i] = d[i * 4 + 3] > 40 ? 1 : 0;
    for (let y = 0; y < h; y++) {
      if (skipBelow && y > skipBelow) continue;
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (src[i]) continue;
        if ((x > 0 && src[i - 1]) || (x < w - 1 && src[i + 1]) ||
            (y > 0 && src[i - w]) || (y < h - 1 && src[i + w])) {
          d[i * 4] = OUTLINE[0]; d[i * 4 + 1] = OUTLINE[1]; d[i * 4 + 2] = OUTLINE[2]; d[i * 4 + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // Làm nét 3x3 một lần cho mỗi khung sprite (không chạy mỗi frame) — rẻ hơn nhiều so với filter toàn màn hình.
  function sharpenCanvas(c, amount) {
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    if (w < 3 || h < 3) return;
    const img = ctx.getImageData(0, 0, w, h), d = img.data, out = new Uint8ClampedArray(d);
    const center = 1 + 4 * amount, side = -amount;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        for (let ch = 0; ch < 3; ch++) {
          const j = i + ch;
          out[j] = center * d[j] + side * (d[j - 4] + d[j + 4] + d[j - w * 4] + d[j + w * 4]);
        }
      }
    }
    img.data.set(out);
    ctx.putImageData(img, 0, 0);
  }

  function hdrCanvas(src, opts) {
    if (!src || !src.width || !src.height || src.__vlHDR) return src;
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    try { x.filter = 'saturate(1.58) contrast(1.24) brightness(1.05)'; } catch (e) { }
    x.drawImage(src, 0, 0);
    x.filter = 'none';
    // bloom nhẹ ngay trên sprite (chỉ tốn cho khung mới)
    try {
      x.globalCompositeOperation = 'lighter'; x.globalAlpha = state.bloom;
      x.drawImage(c, 0, 0);
      x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    } catch (e) { }
    if (state.sharp) { try { sharpenCanvas(c, state.sharpAmount); } catch (e) { } }
    if (!opts || opts.outline !== false) {
      try { outline(c, opts && opts.skipBelow); } catch (e) { /* canvas bị taint hoặc quá lớn */ }
    }
    c.__vlHDR = true;
    return c;
  }

  const frameCache = new Map();
  const FRAME_MAX = 360;
  const FRAME_TTL = 5000;   // khung tạm (quá ngân sách ghép) được làm mới sau 5s
  let imgN = 0, imgNAt = -1e9;
  function currentImgN() {
    const t = performance.now();
    if (t - imgNAt > 500) { imgNAt = t; imgN = window.Assets && window.Assets.imgs ? Object.keys(window.Assets.imgs).length : 0; }
    return imgN;
  }
  function cachedFrame(key, make) {
    const now = performance.now();
    const inow = currentImgN();
    const hit = frameCache.get(key);
    if (hit && hit.i === inow && now - hit.t < FRAME_TTL) { frameCache.delete(key); frameCache.set(key, hit); return hit.c; }
    const c = make();
    frameCache.set(key, { c, t: now, i: inow });
    if (frameCache.size > FRAME_MAX) {
      const it = frameCache.keys();
      for (let i = 0; i < 90; i++) frameCache.delete(it.next().value);
    }
    return c;
  }
  // Assets.charFrame trả về cùng một canvas dùng chung (qcv) khi lớp ảnh chưa tải xong hoặc quá ngân sách ghép khung.
  // Gặp canvas đó với khoá khác ngay sau đó thì bỏ qua, không xử lý/cache để tránh kẹt khung thiếu chi tiết.
  let lastSrc = null, lastKey = '';

  const atlasCache = new WeakMap();
  function hdrAtlas(img) {
    if (!img || !img.width || !img.height) return img;
    const tag = state.sharp ? state.sharpAmount : 0;
    let hit = atlasCache.get(img);
    if (hit && hit.__vlHDRSharp === tag) return hit;
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    try { x.filter = 'saturate(1.42) contrast(1.16) brightness(1.04)'; } catch (e) { }
    x.drawImage(img, 0, 0);
    x.filter = 'none';
    // Làm nét cả atlas (quái/NPC/thú cưỡi) một lần; bỏ qua ảnh quá lớn để không gây khựng.
    if (state.sharp && img.width * img.height <= 2500000) {
      try { sharpenCanvas(c, Math.min(0.7, state.sharpAmount * 0.65)); } catch (e) { }
    }
    c.__vlHDRSharp = tag;
    atlasCache.set(img, c);
    return c;
  }

  const objIds = new WeakMap(); let oid = 0;
  function akey(v) {
    if (Array.isArray(v)) return v.join(',');
    if (v && typeof v === 'object') {
      let id = objIds.get(v);
      if (!id) { id = ++oid; objIds.set(v, id); }
      return 'o' + id;
    }
    return v == null ? '' : String(v);
  }

  // ------------------------------------------------------- sprite skin
  function installSpriteSkin() {
    if (state.sprites) return;
    const A = window.Assets, S = window.Sprites;
    if (!A || !S) return;
    state.sprites = true;

    // nhân vật lấy từ ảnh: Assets.charFrame -> canvas 144x144
    if (typeof A.charFrame === 'function' && !A.charFrame.__vlHDRWrap) {
      const orig = A.charFrame;
      const wrap = function (cls, dir, stateName, i, ap) {
        const out = orig.apply(this, arguments);
        if (!state.on || !out || !out.width) return out;
        const key = 'c|' + cls + '|' + dir + '|' + stateName + '|' + i + '|' + akey(ap);
        if (out === lastSrc && key !== lastKey) return out;   // canvas tạm dùng chung: giữ nguyên, không cache
        lastSrc = out; lastKey = key;
        return cachedFrame(key, () => hdrCanvas(out, { skipBelow: 116 }));
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      A.charFrame = wrap;
    }

    // nhân vật vẽ thủ tục
    if (typeof S.playerSprite === 'function' && !S.playerSprite.__vlHDRWrap) {
      const orig = S.playerSprite;
      const wrap = function (cls, colors, dir, frame, atk, ap) {
        const out = orig.apply(this, arguments);
        if (!state.on || !out || !out.width || out.__vlHDR) return out;
        const key = 'p|' + cls + '|' + dir + '|' + frame + '|' + atk + '|' + akey(ap) + '|' + akey(colors);
        return cachedFrame(key, () => hdrCanvas(out, { skipBelow: 56 }));
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      S.playerSprite = wrap;
    }

    // quái bằng ảnh atlas: đổi atlas sang bản đã tăng màu (giữ nguyên toạ độ cắt)
    if (typeof A.monsterFrame === 'function' && !A.monsterFrame.__vlHDRWrap) {
      const orig = A.monsterFrame;
      const wrap = function () {
        const mf = orig.apply(this, arguments);
        if (!state.on || !mf) return mf;
        const img = hdrAtlas(mf.img);
        return img === mf.img ? mf : Object.assign({}, mf, { img });
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      A.monsterFrame = wrap;
    }

    // quái vẽ thủ tục
    if (typeof S.monsterSprite === 'function' && !S.monsterSprite.__vlHDRWrap) {
      const orig = S.monsterSprite;
      const wrap = function (type, info, frame, dir) {
        const out = orig.apply(this, arguments);
        if (!state.on || !out || !out.width || out.__vlHDR) return out;
        const key = 'm|' + type + '|' + frame + '|' + dir + '|' + akey(info && info.sprite) + '|' + akey(info && info.color);
        return cachedFrame(key, () => hdrCanvas(out, { skipBelow: 58 }));
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      S.monsterSprite = wrap;
    }

    // NPC bằng ảnh atlas
    if (typeof A.npcFrame === 'function' && !A.npcFrame.__vlHDRWrap) {
      const orig = A.npcFrame;
      const wrap = function () {
        const nf = orig.apply(this, arguments);
        if (!state.on || !nf) return nf;
        const img = hdrAtlas(nf.img);
        return img === nf.img ? nf : Object.assign({}, nf, { img });
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      A.npcFrame = wrap;
    }

    // NPC vẽ thủ tục
    if (typeof S.npcSprite === 'function' && !S.npcSprite.__vlHDRWrap) {
      const orig = S.npcSprite;
      const wrap = function () {
        const out = orig.apply(this, arguments);
        if (!state.on || !out || !out.width || out.__vlHDR) return out;
        return hdrCanvas(out, { skipBelow: 56 });
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      S.npcSprite = wrap;
    }

    // thú cưỡi bằng atlas
    if (typeof A.mountFrame === 'function' && !A.mountFrame.__vlHDRWrap) {
      const orig = A.mountFrame;
      const wrap = function () {
        const mf = orig.apply(this, arguments);
        if (!state.on || !mf) return mf;
        const img = hdrAtlas(mf.img);
        return img === mf.img ? mf : Object.assign({}, mf, { img });
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      A.mountFrame = wrap;
    }

    // vật phẩm
    if (typeof S.itemIcon === 'function' && !S.itemIcon.__vlHDRWrap) {
      const orig = S.itemIcon;
      const wrap = function (icon, rarity, rcolor, tier) {
        const out = orig.apply(this, arguments);
        if (!state.on || !out || !out.width || out.__vlHDR) return out;
        const key = 'i|' + icon + '|' + rarity + '|' + rcolor + '|' + tier;
        return cachedFrame(key, () => hdrCanvas(out, { skipBelow: 0 }));
      };
      wrap.__vlHDRWrap = true;
      wrap.__orig = orig;
      S.itemIcon = wrap;
    }

    // Làm nét sẵn atlas quái ngay khi tải xong (màn hình chờ chuyển map), tránh khựng lúc quái xuất hiện.
    if (typeof A.loadMonster === 'function' && !A.loadMonster.__vlHDRWarm) {
      const origLoadMonster = A.loadMonster;
      const warmed = function (id) {
        const p = origLoadMonster.apply(this, arguments);
        try {
          if (p && p.then) p.then(() => { if (state.on && state.sharp) { try { A.monsterFrame(id, 'idle', 0, 0); } catch (e) { } } });
        } catch (e) { }
        return p;
      };
      warmed.__vlHDRWarm = true;
      A.loadMonster = warmed;
    }
    console.info('[Võ Lâm HDR] Đã bật cel-shading + làm nét cho nhân vật / quái / NPC / vật phẩm.');
  }

  // Assets được tạo sau khi tải assets09a3.js; chờ nó sẵn sàng
  (function waitAssets() {
    let n = 0;
    const iv = setInterval(() => {
      n++;
      if (window.Assets && window.Sprites) {
        clearInterval(iv);
        try { installSpriteSkin(); } catch (e) { console.warn('[Võ Lâm HDR] sprite skin:', e); }
      } else if (n > 600) clearInterval(iv);
    }, 200);
  })();

  // --------------------------------------------------- HDR light particles
  function startParticles() {
    if (state.particles || !state.on) return;
    const host = document.getElementById('screen-game');
    if (!host) return;
    const cv = document.createElement('canvas');
    cv.id = 'vl-hdr-particles';
    host.insertBefore(cv, host.children[1] || null);
    const ctx = cv.getContext('2d');
    const list = [];
    const N = 34;
    let w = 0, h = 0, dpr = 1;

    const glowSprite = col => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,.95)');
      g.addColorStop(0.22, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      return c;
    };
    const GLOWS = [
      glowSprite('rgba(255,214,120,.85)'),
      glowSprite('rgba(90,190,255,.82)'),
      glowSprite('rgba(255,110,210,.78)'),
      glowSprite('rgba(180,235,255,.88)')
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth || window.innerWidth;
      h = host.clientHeight || window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(p, first) {
      p.x = Math.random() * w;
      p.y = first ? Math.random() * h : h + 20 + Math.random() * 80;
      p.s = 8 + Math.random() * 34;
      p.vy = -(7 + Math.random() * 22);
      p.vx = -12 + Math.random() * 24;
      p.ph = Math.random() * Math.PI * 2;
      p.al = 0.15 + Math.random() * 0.5;
      p.g = GLOWS[(Math.random() * GLOWS.length) | 0];
    }
    for (let i = 0; i < N; i++) { const p = {}; spawn(p, true); list.push(p); }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let last = performance.now(), acc = 0;
    function tick(now) {
      if (!state.on || document.hidden) { last = now; state.raf = requestAnimationFrame(tick); return; }
      const dt = Math.min(50, now - last); last = now;
      acc += dt;
      if (acc >= 33) {   // ~30fps: đủ mượt cho hạt sáng, đỡ tốn pin
        acc = 0;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (const p of list) {
          p.ph += 0.024;
          p.x += (p.vx + Math.sin(p.ph) * 13) * dt / 1000;
          p.y += p.vy * dt / 1000;
          if (p.y < -70 || p.x < -90 || p.x > w + 90) spawn(p);
          const tw = 0.55 + 0.45 * Math.sin(p.ph * 1.7);
          ctx.globalAlpha = p.al * tw;
          ctx.drawImage(p.g, p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      state.raf = requestAnimationFrame(tick);
    }
    state.particles = cv;
    state.raf = requestAnimationFrame(tick);
  }

  function stopParticles() {
    if (!state.particles) return;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    try { state.particles.remove(); } catch (e) { }
    state.particles = null;
  }

  // ------------------------------------------------------------- overlay
  function addGlow() {
    const host = document.getElementById('screen-game');
    if (!host || document.getElementById('vl-hdr-glow')) return;
    const d = document.createElement('div');
    d.id = 'vl-hdr-glow';
    host.insertBefore(d, host.children[1] || null);
  }

  function addBadge() {
    if (document.getElementById('vl-hdr-badge')) return;
    const b = document.createElement('div');
    b.id = 'vl-hdr-badge';
    b.title = 'Bật/tắt HDR (Alt + A) · Bật/tắt siêu nét (Alt + S)';
    b.innerHTML = '<i></i><span>HDR</span>';
    b.onclick = () => toggle();
    (document.body || document.documentElement).appendChild(b);
    syncBadge(b);
  }
  function syncBadge(b) {
    b = b || document.getElementById('vl-hdr-badge');
    if (!b) return;
    b.classList.toggle('off', !state.on);
    b.classList.toggle('no-sharp', state.on && !state.sharp);
    b.querySelector('span').textContent = state.on ? 'HDR' : 'OFF';
  }

  function apply(on) {
    state.on = !!on;
    document.documentElement.classList.toggle('hdr-ui', state.on);
    document.documentElement.classList.toggle('hdr-sharp', state.on && state.sharp);
    try { localStorage.setItem(LS_KEY, state.on ? '1' : '0'); } catch (e) { }
    syncBadge();
    if (state.on) { addGlow(); startParticles(); } else { stopParticles(); }
    // xoá cache khung đã xử lý để lần bật sau dùng bản mới
    frameCache.clear();
  }
  function setSharp(v) {
    state.sharp = !!v;
    document.documentElement.classList.toggle('hdr-sharp', state.on && state.sharp);
    try { localStorage.setItem('vl_hdr_sharp', state.sharp ? '1' : '0'); } catch (e) { }
    frameCache.clear();
    syncBadge();
  }
  function toggle() { apply(!state.on); }
  function setBloom(v) {
    const n = Math.max(0, Math.min(0.4, Number(v) || 0));
    state.bloom = n;
    try { localStorage.setItem('vl_hdr_bloom', String(n)); } catch (e) { }
    frameCache.clear();
  }
  function setSharpAmount(v) {
    const n = Math.max(0, Math.min(1.5, Number(v) || 0));
    state.sharpAmount = n;
    try { localStorage.setItem('vl_hdr_amount', String(n)); } catch (e) { }
    frameCache.clear();
    if (n <= 0) setSharp(false); else setSharp(true);
  }

  // --------------------------------------------------------------- boot
  function boot() {
    if (!document.body) return;
    if (!GAME_HOST && !document.getElementById('screen-game')) return;   // không phải trang game thì không đụng vào
    document.documentElement.classList.toggle('hdr-ui', state.on);
    document.documentElement.classList.toggle('hdr-sharp', state.on && state.sharp);
    addGlow();
    addBadge();
    if (state.on) startParticles();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  window.addEventListener('keydown', e => {
    if (!document.getElementById('screen-game')) return;
    if (e.altKey && (e.code === 'KeyA' || e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      toggle();
    } else if (e.altKey && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      setSharp(!state.sharp);
    }
  }, true);

  // API nhỏ để debug / tắt mở từ console
  try {
    window.VLHDR = {
      get on() { return state.on; },
      get sharp() { return state.sharp; },
      get sharpAmount() { return state.sharpAmount; },
      get bloom() { return state.bloom; },
      enable: () => apply(true),
      disable: () => apply(false),
      toggle,
      setSharp,
      setSharpAmount,
      setBloom,
      toggleSharp: () => setSharp(!state.sharp),
      reinstallSprites: installSpriteSkin,
      clearCache: () => frameCache.clear(),
      process: hdrCanvas,  // debug: xử lý thử một khung sprite
      atlas: hdrAtlas      // debug: xử lý thử một atlas
    };
  } catch (e) { }
})();
