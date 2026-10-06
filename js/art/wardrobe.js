/* ============================================================
   THE SIGNAL — гардероб: ілюстрації одягу у стилі flat lay (SVG)
   ------------------------------------------------------------
   SignalArt.outfit(spec)  — цілий образ на «столі»: верх, куртка, низ, взуття, аксесуари
   SignalArt.piece(item)   — одна річ (для кнопок вибору)
   SignalArt.oldPhoto()    — старе концертне фото 1998 року (лицьовий бік)
   SignalArt.photoBack()   — зворотний бік фото з підписом
   item = { k:"hoodie", c:"#2F7DE1", …опції }   (див. список KINDS нижче)
   spec = { top, outer, bottom, shoes, extras:[…], tags:[…], bg:"linen"|"none" }
   Без зовнішніх картинок: усе малюється кодом і працює офлайн.
   ============================================================ */
(function(){
"use strict";

let ID = "w0", N = 0;
const hex = c => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.split("").map(x => x + x).join(""); return [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); };
const toHex = a => "#" + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (c, t, k) => { const a = hex(c), b = hex(t); return toHex(a.map((v, i) => v + (b[i] - v) * k)); };
const dk = (c, k) => mix(c, "#000000", k == null ? .3 : k);
const lt = (c, k) => mix(c, "#FFFFFF", k == null ? .3 : k);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));

/* заповнена форма: колір + візерунок + об'єм + контур */
function shape(d, c, o){
  o = o || {};
  const pat = o.pat ? `<path d="${d}" fill="url(#${ID}${o.pat})"/>` : "";
  return `<path d="${d}" fill="${o.fill || c}"/>${pat}${o.flat ? "" : `<path d="${d}" fill="url(#${ID}sh)"/>`}<path d="${d}" fill="none" stroke="${o.stroke || dk(c, .32)}" stroke-width="${o.sw || 1.6}" stroke-linejoin="round"/>`;
}
const line = (d, c, w, dash) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w || 1.4}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const dot = (x, y, r, c, s) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"${s ? ` stroke="${s}" stroke-width="1"` : ""}/>`;
const mirror = d => d.replace(/([MLHVQTCSZmlhvqtcsz])|(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, cmd, x, y) => cmd ? cmd : (160 - +x) + "," + y);
let clipN = 0;
const clipped = (d, inner) => { const k = ID + "c" + (++clipN); return `<clipPath id="${k}"><path d="${d}"/></clipPath><g clip-path="url(#${k})">${inner}</g>`; };

/* ---------- спільні визначення для одного SVG ---------- */
function defs(){
  return `<defs>
    <linearGradient id="${ID}sh" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
    <filter id="${ID}ds" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#2B2116" flood-opacity=".22"/></filter>
    <pattern id="${ID}dn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="6" height="6" fill="none"/><path d="M0,1 H6 M0,4 H6" stroke="#fff" stroke-opacity=".10" stroke-width="1"/></pattern>
    <pattern id="${ID}tt" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="none"/><rect x="0" y="9" width="28" height="9" fill="#000" fill-opacity=".28"/><rect x="9" y="0" width="9" height="28" fill="#000" fill-opacity=".28"/><path d="M0,4 H28 M4,0 V28" stroke="#FFD43B" stroke-opacity=".75" stroke-width="1"/><path d="M0,22 H28 M22,0 V28" stroke="#fff" stroke-opacity=".35" stroke-width="1"/></pattern>
    <pattern id="${ID}ck" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="none"/><path d="M0,8 H16 M8,0 V16" stroke="#000" stroke-opacity=".18" stroke-width="3"/></pattern>
    <pattern id="${ID}st" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="none"/><rect y="0" width="12" height="5" fill="#fff" fill-opacity=".55"/></pattern>
    <pattern id="${ID}fl" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="none"/>
      <g transform="translate(7,7)"><circle r="3.2" cx="0" cy="-3.4" fill="#FFF3C4"/><circle r="3.2" cx="3.4" cy="0" fill="#FFF3C4"/><circle r="3.2" cx="0" cy="3.4" fill="#FFF3C4"/><circle r="3.2" cx="-3.4" cy="0" fill="#FFF3C4"/><circle r="2.2" fill="#E8590C"/></g>
      <g transform="translate(20,19)"><circle r="2.6" cx="0" cy="-2.8" fill="#FF8FB1"/><circle r="2.6" cx="2.8" cy="0" fill="#FF8FB1"/><circle r="2.6" cx="0" cy="2.8" fill="#FF8FB1"/><circle r="2.6" cx="-2.8" cy="0" fill="#FF8FB1"/><circle r="1.7" fill="#FFD43B"/></g></pattern>
    <radialGradient id="${ID}td" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#FFE066"/><stop offset=".22" stop-color="#FF6B6B"/><stop offset=".42" stop-color="#C084FC"/><stop offset=".62" stop-color="#4DABF7"/><stop offset=".82" stop-color="#63E6BE"/><stop offset="1" stop-color="#FFD43B"/></radialGradient>
    <pattern id="${ID}aw" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="none"/><ellipse cx="10" cy="12" rx="9" ry="6" fill="#fff" fill-opacity=".28"/><ellipse cx="30" cy="30" rx="10" ry="7" fill="#fff" fill-opacity=".22"/><ellipse cx="33" cy="6" rx="5" ry="3" fill="#fff" fill-opacity=".25"/></pattern>
  </defs>`;
}

/* ============================================================
   ВЕРХ (полотно 160 × 160)
   ============================================================ */
const TEE = "M52,16 Q80,30 108,16 L138,26 L156,58 L132,70 L124,56 L124,150 Q80,156 36,150 L36,56 L28,70 L4,58 L22,26 Z";
const LS  = "M50,18 Q80,30 110,18 L134,26 Q146,36 149,58 L156,140 L136,144 L127,78 L126,150 Q80,156 34,150 L33,78 L24,144 L4,140 L11,58 Q14,36 26,26 Z";

function marks(o, c){
  let s = "";
  if (o.crumple) s += line("M48,70 q8,6 16,0 M90,96 q8,7 18,1 M54,118 q10,-6 20,2 M100,128 q6,5 12,-1 M70,44 q6,4 12,0", dk(c, .35), 1.3);
  if (o.stain) s += `<path d="M94,82 q8,-6 14,2 q6,8 -2,12 q-4,8 -12,2 q-8,-4 -4,-10 q-2,-4 4,-6z" fill="#7A5527" fill-opacity=".55"/><circle cx="112" cy="104" r="3" fill="#7A5527" fill-opacity=".5"/>`;
  if (o.rip) s += `<path d="M56,104 l6,-3 l3,5 l6,-2 l1,6 l-5,2 l2,5 l-7,-1 l-4,4 l-3,-6 z" fill="${dk(c, .7)}"/>` + line("M54,102 l-3,-2 M70,113 l3,2 M60,116 l-1,4", lt(c, .5), 1) +
    `<path d="M98,64 l5,-2 l2,4 l5,-1 l0,5 l-5,2 l-4,-2 l-4,3 z" fill="${dk(c, .7)}"/>`;
  if (o.pins) s += pin(44, 40, -20) + pin(112, 118, 30) + pin(108, 46, 12);
  if (o.badges) s += dot(46, 70, 7, "#FFD43B", dk("#FFD43B")) + `<text x="46" y="73" text-anchor="middle" font-size="8" font-weight="900" fill="#222" font-family="Arial,sans-serif">★</text>` + dot(58, 88, 6, "#FF5A4E", dk("#FF5A4E")) + dot(42, 92, 5, "#4DABF7", dk("#4DABF7"));
  return s;
}
const pin = (x, y, r) => `<g transform="translate(${x},${y}) rotate(${r})"><path d="M-9,0 H9 Q13,0 13,-3 Q13,-6 9,-6 H-6" fill="none" stroke="#C9CED6" stroke-width="1.6"/><circle cx="-9" cy="0" r="2.2" fill="none" stroke="#C9CED6" stroke-width="1.4"/><path d="M-6,-6 L-9,-3" stroke="#C9CED6" stroke-width="1.4"/></g>`;

function print(o, c){
  const ink = o.ink || (hex(c).reduce((a, b) => a + b, 0) < 330 ? "#EFE6D2" : "#1D1B2C");
  if (o.print === "band") return `<g opacity=".92"><circle cx="80" cy="82" r="22" fill="none" stroke="${ink}" stroke-width="3"/><path d="M84,62 L72,84 H82 L76,102 L92,76 H82 Z" fill="${ink}"/><text x="80" y="122" text-anchor="middle" font-size="11" font-weight="900" letter-spacing="2" fill="${ink}" font-family="Arial,sans-serif">${esc(o.text || "LIVE '98")}</text></g>`;
  if (o.print === "smile") return `<g fill="none" stroke="${ink}" stroke-width="3"><circle cx="80" cy="86" r="18"/><path d="M70,90 q10,9 20,0"/></g><circle cx="74" cy="80" r="2.4" fill="${ink}"/><circle cx="86" cy="80" r="2.4" fill="${ink}"/>`;
  if (o.print === "logo") return `<rect x="88" y="48" width="16" height="10" rx="2" fill="${ink}" opacity=".85"/>`;
  if (o.print === "text") return `<text x="80" y="92" text-anchor="middle" font-size="${o.size || 16}" font-weight="900" fill="${ink}" font-family="Arial,sans-serif">${esc(o.text)}</text>`;
  if (o.print === "stripe") return clipped(TEE, `<rect x="0" y="78" width="160" height="16" fill="${o.ink || "#fff"}" opacity=".9"/><rect x="0" y="100" width="160" height="7" fill="${o.ink2 || "#FFD43B"}" opacity=".9"/>`);
  return "";
}

function tee(o){
  const c = o.c || "#F2F0EA";
  const fill = o.tiedye ? `url(#${ID}td)` : null;
  return shape(TEE, c, { fill, pat:o.pat })
    + `<path d="M56,17 Q80,36 104,17 Q80,26 56,17Z" fill="${dk(c, .38)}"/>` + line("M54,17 Q80,38 106,17", dk(c, .25), 3)
    + line("M10,52 L31,63 M150,52 L129,63", dk(c, .18), 1.2) + line("M40,145 Q80,151 120,145", dk(c, .2), 1, "3 3")
    + (o.print ? print(o, c) : "") + marks(o, c);
}
function hoodie(o){
  const c = o.c || "#3E8E6B";
  let s = `<path d="M48,20 Q44,4 80,2 Q116,4 112,20 Q96,32 80,32 Q64,32 48,20Z" fill="${dk(c, .12)}" stroke="${dk(c, .35)}" stroke-width="1.5"/>`
    + `<path d="M60,21 Q80,36 100,21 Q80,12 60,21Z" fill="${dk(c, .45)}"/>`
    + shape(LS, c, { pat:o.pat });
  if (o.block) s += clipped(LS, `<path d="M0,64 L160,40 L160,70 L0,94 Z" fill="${o.block}"/><path d="M0,98 L160,74 L160,84 L0,108 Z" fill="${o.block2 || "#fff"}" opacity=".9"/>`);
  s += `<path d="M46,104 H114 L121,140 H39 Z" fill="${dk(c, .07)}" stroke="${dk(c, .3)}" stroke-width="1.3"/>`
    + line("M72,30 L70,68 M88,30 L90,66", lt(c, .55), 2) + dot(70, 70, 2.2, lt(c, .7)) + dot(90, 68, 2.2, lt(c, .7))
    + `<path d="M34,143 Q80,150 126,143 L126,150 Q80,156 34,150Z" fill="${dk(c, .14)}"/>` + line("M5,132 L25,136 M155,132 L135,136", dk(c, .25), 2)
    + (o.print ? print(o, c) : "") + marks(o, c);
  return o.big ? `<g transform="translate(80,84) scale(1.1 1.03) translate(-80,-84)">${s}</g>` : s;
}
function shirt(o){
  const c = o.c || "#F7F7F2";
  let s = shape(LS, c, { pat:o.pat })
    + `<path d="M54,16 L67,13 L80,32 L70,43 Z" fill="${lt(c, .1)}" stroke="${dk(c, .32)}" stroke-width="1.4"/><path d="M106,16 L93,13 L80,32 L90,43 Z" fill="${lt(c, .1)}" stroke="${dk(c, .32)}" stroke-width="1.4"/>`
    + line("M80,33 V150", dk(c, .22), 1.3) + [50, 68, 86, 104, 122, 140].map(y => dot(83, y, 1.9, dk(c, .3))).join("")
    + line("M5,128 L25,132 M155,128 L135,132", dk(c, .25), 1.4);
  if (!o.tie) s += `<path d="M92,56 h18 v17 l-9,4 l-9,-4 z" fill="none" stroke="${dk(c, .25)}" stroke-width="1.2"/>`;
  if (o.tie) s += `<path d="M76,33 L84,33 L82,43 L86,120 L80,129 L74,120 L78,43 Z" fill="${o.tie}" stroke="${dk(o.tie, .35)}" stroke-width="1.2"/><path d="M75,31 L85,31 L83,42 L77,42 Z" fill="${dk(o.tie, .15)}"/>`;
  s += marks(o, c);
  return o.big ? `<g transform="translate(80,84) scale(1.08 1.02) translate(-80,-84)">${s}</g>` : s;
}
function sweater(o){
  const c = o.c || "#C9B79C";
  return shape(LS, c, { pat:o.pat }) + `<path d="M56,18 Q80,40 104,18" fill="none" stroke="${dk(c, .3)}" stroke-width="5"/>`
    + `<path d="M34,140 Q80,147 126,140 L126,150 Q80,156 34,150Z" fill="${dk(c, .12)}"/>` + line("M5,128 L25,132 M155,128 L135,132", dk(c, .3), 3) + marks(o, c);
}

/* ---------- куртки (розстібнуті: видно верх під ними) ---------- */
const SLV = "M26,26 Q14,36 11,58 L4,140 L24,144 L33,78 L36,40 Z";
const PANEL = "M50,18 L26,26 L36,40 L33,78 L34,150 Q54,153 72,152 L70,100 L62,52 L56,30 Z";
const PANEL_S = "M50,18 L26,26 L36,40 L33,78 L34,128 Q54,131 72,130 L70,100 L62,52 L56,30 Z";
function jacket(o){
  const c = o.c || "#2C3442", kind = o.k;
  const short = kind === "denim" || kind === "bomber";
  const P = short ? PANEL_S : PANEL;
  const pat = kind === "denim" ? "dn" : o.pat;
  let s = `<path d="M50,18 Q80,28 110,18 L106,11 Q80,20 54,11Z" fill="${dk(c, .25)}"/>`;
  s += shape(SLV, c, { pat }) + shape(mirror(SLV), c, { pat });
  s += shape(P, c, { pat }) + shape(mirror(P), c, { pat });
  if (o.block){
    const blk = `<path d="M0,40 L160,22 L160,58 L0,76 Z" fill="${o.block}"/><path d="M0,82 L160,64 L160,72 L0,90 Z" fill="${o.block2 || "#FFD43B"}"/>`;
    s += clipped(SLV, blk) + clipped(mirror(SLV), blk) + clipped(P, blk) + clipped(mirror(P), blk);
    s += line(SLV, dk(c, .35), 1.4) + line(mirror(SLV), dk(c, .35), 1.4) + line(P, dk(c, .35), 1.4) + line(mirror(P), dk(c, .35), 1.4);
  }
  if (kind === "blazer"){
    const lap = "M52,18 L60,40 L49,47 L66,96 L70,100 L62,52 L56,30 Z";
    s += shape(lap, dk(c, .1)) + shape(mirror(lap), dk(c, .1));
    s += dot(66, 114, 2.6, dk(c, .45)) + dot(67, 132, 2.6, dk(c, .45));
    s += line("M38,116 h20 M122,116 h-20 M40,70 h14", dk(c, .4), 2);
  }
  if (kind === "denim"){
    const st = "#D9A05B";
    s += line("M40,48 h20 v16 h-20 z M120,48 h-20 v16 h20 z", st, 1.2, "3 2") + `<path d="M40,46 h20 l-2,7 h-16 z" fill="${dk(c, .1)}" stroke="${st}" stroke-width="1" stroke-dasharray="3 2"/><path d="M120,46 h-20 l2,7 h16 z" fill="${dk(c, .1)}" stroke="${st}" stroke-width="1" stroke-dasharray="3 2"/>`;
    s += dot(50, 52, 2.2, "#B7864A") + dot(110, 52, 2.2, "#B7864A") + [60, 80, 100, 118].map(y => dot(66, y, 2.3, "#B7864A")).join("");
    s += `<path d="M34,120 Q54,123 72,122 L72,130 Q54,131 34,128Z" fill="${dk(c, .12)}"/><path d="M126,120 Q106,123 88,122 L88,130 Q106,131 126,128Z" fill="${dk(c, .12)}"/>`;
    s += line("M36,40 L62,40 M124,40 L98,40", st, 1, "3 2");
    if (o.patch) s += `<rect x="96" y="76" width="22" height="22" rx="3" fill="${o.patch}" stroke="#222" stroke-width="1" transform="rotate(-8 107 87)"/><path d="M101,92 l6,-12 l6,12 z" fill="#FFF3C4" transform="rotate(-8 107 87)"/>`;
  }
  if (kind === "leather"){
    const lap = "M50,18 L44,46 L60,66 L64,76 L62,52 L56,30 Z";
    s += shape(lap, lt(c, .06)) + shape(mirror(lap), lt(c, .06));
    s += line("M70,58 L71,150", "#C9CED6", 2, "2 2") + line("M40,96 l14,-4", "#C9CED6", 2) + line("M120,96 l-14,-4", "#C9CED6", 2);
    s += `<rect x="34" y="140" width="38" height="8" fill="${dk(c, .2)}"/><rect x="88" y="140" width="38" height="8" fill="${dk(c, .2)}"/>`;
    s += `<path d="M38,24 Q60,10 78,26" fill="none" stroke="${lt(c, .25)}" stroke-width="2" opacity=".6"/>`;
    if (o.studs) s += [[30, 34], [36, 30], [42, 27], [118, 27], [124, 30], [130, 34], [26, 40], [134, 40]].map(p => `<path d="M${p[0]},${p[1] - 3} L${p[0] + 3},${p[1]} L${p[0]},${p[1] + 3} L${p[0] - 3},${p[1]} Z" fill="#E6E9EE" stroke="#8C939E" stroke-width=".8"/>`).join("");
  }
  if (kind === "bomber"){
    s += `<path d="M34,120 Q54,123 72,122 L72,130 Q54,131 34,128Z" fill="${dk(c, .18)}"/><path d="M126,120 Q106,123 88,122 L88,130 Q106,131 126,128Z" fill="${dk(c, .18)}"/>` + line("M70,40 L71,128", "#C9CED6", 2, "2 2");
  }
  if (o.pins) s += pin(48, 72, -25) + pin(112, 100, 20);
  if (o.badges) s += dot(48, 64, 7, "#FFD43B", "#9A7B00") + dot(52, 84, 6, "#FF5A4E", "#9C2B22") + dot(44, 102, 6, "#4DABF7", "#1C5C93") + `<text x="48" y="67" text-anchor="middle" font-size="8" font-weight="900" fill="#222" font-family="Arial,sans-serif">★</text>`;
  if (o.big) return `<g transform="translate(80,80) scale(1.14 1.03) translate(-80,-80)">${s}</g>`;
  return s;
}

/* ============================================================
   НИЗ (полотно 120 × 230)
   ============================================================ */
const LEGS = {
  skinny: "M20,12 H100 L99,60 L90,226 H68 L62,74 H58 L52,226 H30 L21,60 Z",
  loose:  "M20,12 H100 L110,226 H64 L60,78 L56,226 H10 Z",
  smart:  "M22,12 H98 L101,226 H66 L60,76 L54,226 H19 Z",
  flares: "M22,12 H98 L94,128 L111,226 H66 L62,78 H58 L54,226 H9 L26,128 Z",
  baggy:  "M17,12 H103 L113,226 H64 L60,98 L56,226 H7 Z",
  joggers:"M20,12 H100 L105,204 L98,226 H70 L64,204 L60,82 L56,204 L50,226 H22 L15,204 Z",
  skirt:  "M24,12 H96 L114,150 Q60,162 6,150 Z"
};
function bottom(o){
  const c = o.c || "#2F4B7C", k = o.k || "loose";
  const d = LEGS[k] || LEGS.loose;
  const denim = !!o.denim;
  const pat = o.pat || (denim ? "dn" : null);
  let s = shape(d, c, { pat });
  s += `<path d="M${k === "smart" || k === "flares" ? 22 : k === "baggy" ? 17 : 20},0 H${k === "smart" || k === "flares" ? 98 : k === "baggy" ? 103 : 100} V12 H${k === "smart" || k === "flares" ? 22 : k === "baggy" ? 17 : 20} Z" fill="${dk(c, .14)}" stroke="${dk(c, .35)}" stroke-width="1.4"/>`;
  if (k !== "skirt") s += line("M60,13 V56 Q60,64 52,67", dk(c, .35), 1.3);
  if (k === "joggers"){
    s += line("M54,2 q-4,14 -8,18 M66,2 q4,14 8,18", lt(c, .6), 1.8);
    s += `<path d="M15,204 L50,204 L50,226 H22 Z" fill="${dk(c, .14)}"/><path d="M105,204 L70,204 L70,226 H98 Z" fill="${dk(c, .14)}"/>`;
    s += line("M24,40 L26,180 M96,40 L94,180", lt(c, .35), 3);
  } else if (k !== "skirt") {
    s += line(`M${k === "baggy" ? 22 : 25},14 Q35,34 46,14 M${k === "baggy" ? 98 : 95},14 Q85,34 74,14`, dk(c, .32), 1.3);
    [30, 50, 70, 90].forEach(x => { s += `<rect x="${x - 2}" y="-2" width="4" height="14" rx="1" fill="${dk(c, .2)}"/>`; });
  }
  if (denim){ s += dot(28, 22, 1.6, "#C08A4D") + dot(92, 22, 1.6, "#C08A4D") + line("M60,58 V140", "#D9A05B", .9, "2 2"); }
  if (k === "smart") s += line("M38,16 L36,224 M82,16 L84,224", lt(c, .22), 1.2, "6 3") + `<rect x="20" y="1" width="80" height="9" fill="${dk(c, .55)}"/><rect x="54" y="0" width="12" height="11" rx="1.5" fill="none" stroke="#C9A227" stroke-width="2"/>`;
  if (o.belt) s += `<rect x="${k === "baggy" ? 17 : 20}" y="1" width="${k === "baggy" ? 86 : 80}" height="9" fill="${o.belt}"/><rect x="54" y="0" width="12" height="11" rx="1.5" fill="none" stroke="#D0D4DA" stroke-width="2"/>`;
  if (k === "baggy") s += line("M12,198 q22,7 44,0 M10,214 q22,6 46,-1 M66,198 q22,7 44,0 M66,214 q22,6 46,-1", dk(c, .3), 1.3) + line("M30,60 q4,30 0,60 M90,62 q-4,30 0,60", dk(c, .22), 1.2);
  if (k === "loose") s += line("M30,70 q4,40 -2,90 M92,72 q-4,40 2,90", dk(c, .18), 1.2);
  if (o.roll) s += `<path d="${k === "skinny" ? "M30,214 H52 V226 H30 Z M68,214 H90 V226 H68 Z" : "M19,212 H54 V226 H19 Z M66,212 H101 V226 H66 Z"}" fill="${lt(c, .3)}" stroke="${dk(c, .3)}" stroke-width="1"/>`;
  if (o.rips) s += `<path d="M30,128 q8,-3 16,0 q-8,4 -16,0z M33,138 q6,-2 11,0" fill="#F1ECE2" stroke="${lt(c, .5)}" stroke-width="1"/><path d="M73,150 q8,-3 15,0 q-7,4 -15,0z" fill="#F1ECE2" stroke="${lt(c, .5)}" stroke-width="1"/>` + line("M30,124 h16 M73,146 h15", lt(c, .6), .8);
  if (o.crumple) s += line("M32,90 q6,5 12,0 M74,120 q6,5 12,0 M36,170 q6,-4 12,1", dk(c, .35), 1.2);
  if (o.stain) s += `<path d="M78,92 q6,-5 12,1 q4,7 -3,9 q-6,4 -10,-2 q-3,-5 1,-8z" fill="#7A5527" fill-opacity=".5"/>`;
  if (o.short) s = `<g transform="translate(0,0) scale(1 .94)">${s}</g>`;
  return s;
}

/* ============================================================
   ВЗУТТЯ (пара, полотно 150 × 80)
   ============================================================ */
function shoe(o, x, y, f){
  const c = o.c || "#F4F4F4", k = o.k || "trainers";
  let s = "";
  if (k === "trainers" || k === "chunky"){
    const sole = o.sole || "#F6F6F4"; const tall = k === "chunky" ? 8 : 0;
    s += shape(`M4,${40 - tall} Q3,${24 - tall} 18,${22 - tall} L30,${20 - tall} Q38,${8 - tall} 52,${10 - tall} L56,${28 - tall} Q68,${30 - tall} 74,${40 - tall} L74,${44 - tall} H4 Z`, c);
    s += shape(`M2,${44 - tall} H76 Q77,52 71,52 H7 Q1,52 2,${44 - tall} Z`, sole, { stroke:dk(sole, .3) });
    if (tall) s += line(`M6,47 q6,-3 12,0 q6,3 12,0 q6,-3 12,0 q6,3 12,0 q6,-3 12,0`, dk(sole, .25), 1);
    s += line(`M24,${41 - tall} Q40,${24 - tall} 60,${32 - tall}`, o.accent || "#FF5A4E", 4);
    s += line(`M36,${15 - tall} l8,3 M39,${11 - tall} l8,3 M42,${7 - tall} l7,3`, dk(c, .45), 1.6);
    if (o.worn) s += `<path d="M10,30 q4,-2 6,2 M60,36 q4,-3 7,1" stroke="#8C7B6B" stroke-width="2" fill="none" opacity=".7"/><path d="M2,44 H76 Q77,52 71,52 H7 Q1,52 2,44 Z" fill="#C9B88F" opacity=".35"/>`;
  } else if (k === "hightops"){
    s += shape("M4,40 Q3,26 16,24 L26,22 L28,0 H54 L56,28 Q68,30 74,40 L74,44 H4 Z", c);
    s += shape("M2,44 H76 Q77,52 71,52 H7 Q1,52 2,44 Z", "#F6F6F4") + dot(42, 16, 5, "#fff", dk(c, .4));
    s += line("M30,6 l14,4 M30,13 l14,4 M30,20 l14,4 M31,27 l14,4", "#fff", 1.6) + `<path d="M4,40 Q20,36 30,38" stroke="${o.accent || "#fff"}" stroke-width="3" fill="none"/>`;
  } else if (k === "boots"){
    s += shape("M6,40 Q6,28 18,26 L24,24 L26,0 H52 L54,26 Q70,28 74,40 L74,44 H6 Z", c);
    s += `<path d="M4,44 H76 V52 H4 Z" fill="#1A1A1A"/>` + line("M8,52 v3 M18,52 v3 M28,52 v3 M38,52 v3 M48,52 v3 M58,52 v3 M68,52 v3", "#1A1A1A", 3);
    s += line("M28,4 l14,5 M28,10 l14,5 M28,16 l14,5 M29,22 l14,5 M42,4 l-14,5 M42,10 l-14,5 M42,16 l-14,5", "#6B6B6B", 1.2);
    s += `<path d="M4,40 Q20,36 26,38" stroke="#E2D6B5" stroke-width="2" stroke-dasharray="2 2" fill="none"/>`;
    if (o.worn) s += `<path d="M58,34 q5,-2 8,2 M12,32 q3,-3 6,0 M40,2 l4,6" stroke="#9A9183" stroke-width="2" fill="none" opacity=".85"/>`;
  } else if (k === "smart"){
    s += shape("M4,42 Q6,32 18,30 L40,29 Q50,24 58,29 Q72,33 75,42 L75,45 H4 Z", c);
    s += `<path d="M3,45 H76 V49 H3 Z" fill="${dk(c, .5)}"/><path d="M4,45 H16 V51 H4 Z" fill="${dk(c, .55)}"/>`;
    s += `<ellipse cx="62" cy="35" rx="7" ry="2.6" fill="#fff" opacity=".55" transform="rotate(14 62 35)"/>` + line("M40,30 l8,4 M44,28 l8,4", dk(c, .5), 1.2);
  } else if (k === "sandals"){
    if (o.socks) s += shape("M8,44 Q6,30 20,28 L28,6 H50 L52,30 Q68,32 72,44 Z", "#F7F4EE") + line("M28,10 H50 M28,14 H50", "#D6D0C4", 1);
    s += shape("M3,44 H75 Q77,50 71,50 H8 Q2,50 3,44Z", "#B67A47");
    s += line("M20,44 Q30,26 46,30 M50,44 Q56,32 66,34 M26,40 L54,40", "#7A4A23", 4);
  }
  return `<g transform="translate(${x},${y})${f ? " scale(-1 1) translate(-78,0)" : ""}">${s}</g>`;
}
function shoes(o){
  let s = "";
  if (o.box) s += `<g><path d="M6,30 L144,30 L140,78 H10 Z" fill="#E9DCC7" stroke="#B8A27F" stroke-width="1.5"/><path d="M2,22 L148,22 L146,32 H4 Z" fill="#F3EADB" stroke="#B8A27F" stroke-width="1.5"/><path d="M14,30 q20,-12 40,-2 q20,-10 40,0 q20,-12 42,2" fill="#FDFBF7" stroke="#E5DCCB" stroke-width="1"/><text x="75" y="70" text-anchor="middle" font-size="9" font-weight="900" fill="#9C8661" letter-spacing="3" font-family="Arial,sans-serif">BRAND NEW</text></g>`;
  const by = o.box ? -2 : 0;
  s += shoe(o, 2, 20 + by) + shoe(o, 66, 26 + by);
  if (o.new || o.box) s += sparkle(132, 16, 6) + sparkle(12, 12, 4) + sparkle(76, 8, 3.5);
  return s;
}
const sparkle = (x, y, r) => `<path d="M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z" fill="#FFD43B"/>`;

/* ============================================================
   АКСЕСУАРИ (кожен — своє полотно)
   ============================================================ */
const EXTRA = {
  cap: { w:100, h:60, d:o => { const c = o.c || "#1D3557"; return shape("M14,48 Q14,10 50,8 Q86,10 86,48 Z", c) + shape("M62,46 Q90,40 100,50 Q86,58 58,54 Z", dk(c, .1)) + dot(50, 9, 3, dk(c, .3)) + line("M50,10 Q44,30 46,48 M50,10 Q60,30 62,48", dk(c, .3), 1.1) + (o.logo ? `<rect x="36" y="24" width="16" height="10" rx="2" fill="${o.logo}"/>` : ""); } },
  bucket: { w:100, h:60, d:o => { const c = o.c || "#E9E2CF"; return shape("M24,40 L30,10 Q50,3 70,10 L76,40 Z", c, { pat:o.pat }) + shape("M6,40 Q50,30 94,40 Q98,54 50,56 Q2,54 6,40Z", dk(c, .06), { pat:o.pat }) + line("M27,32 Q50,26 73,32 M12,46 Q50,40 88,46", dk(c, .3), 1, "2 2"); } },
  headband: { w:100, h:44, d:o => { const c = o.c || "#E8590C"; let s = `<path d="M8,26 Q50,2 92,26" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/><path d="M8,26 Q50,2 92,26" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-dasharray="4 4"/>`;
    if (o.flowers) [[28, 14], [50, 8], [72, 14]].forEach(p => { s += `<g transform="translate(${p[0]},${p[1]})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="3.4" ry="5.4" cy="-4.6" fill="#FFF3C4" transform="rotate(${a})"/>`).join("")}<circle r="3" fill="#FFB000"/></g>`; });
    return s; } },
  glasses: { w:100, h:36, d:o => { const k = o.style || "round", fr = o.c || "#2B2B2B", tint = o.tint || "rgba(30,30,40,.82)";
    if (k === "round") return `<circle cx="28" cy="20" r="13" fill="${tint}" stroke="${fr}" stroke-width="2.5"/><circle cx="72" cy="20" r="13" fill="${tint}" stroke="${fr}" stroke-width="2.5"/><path d="M41,18 Q50,12 59,18" fill="none" stroke="${fr}" stroke-width="2.5"/>` + line("M15,16 L4,12 M85,16 L96,12", fr, 2.2) + `<ellipse cx="23" cy="15" rx="4" ry="2" fill="#fff" opacity=".35"/><ellipse cx="67" cy="15" rx="4" ry="2" fill="#fff" opacity=".35"/>`;
    const w = k === "big" ? 40 : 34, h = k === "big" ? 26 : 20;
    return `<path d="M${48 - w},6 H46 Q48,${6 + h} 38,${6 + h} H${52 - w} Q${46 - w},${6 + h} ${48 - w},6Z" fill="${tint}" stroke="${fr}" stroke-width="3"/><path d="M${52 + w},6 H54 Q52,${6 + h} 62,${6 + h} H${48 + w} Q${54 + w},${6 + h} ${52 + w},6Z" fill="${tint}" stroke="${fr}" stroke-width="3"/><path d="M46,9 Q50,6 54,9" fill="none" stroke="${fr}" stroke-width="3"/>` + `<ellipse cx="26" cy="12" rx="5" ry="2" fill="#fff" opacity=".3"/>`; } },
  headphones: { w:80, h:80, d:o => { const c = o.c || "#1D1B2C"; return `<path d="M14,48 Q14,8 40,8 Q66,8 66,48" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M18,46 Q18,14 40,14 Q62,14 62,46" fill="none" stroke="${lt(c, .3)}" stroke-width="2"/>` + shape("M4,44 Q4,38 10,38 H20 Q24,38 24,44 V66 Q24,72 18,72 H10 Q4,72 4,66 Z", c) + shape("M56,44 Q56,38 62,38 H70 Q76,38 76,44 V66 Q76,72 70,72 H62 Q56,72 56,66 Z", c) + `<rect x="9" y="46" width="10" height="18" rx="4" fill="${o.accent || "#FF5A4E"}"/><rect x="61" y="46" width="10" height="18" rx="4" fill="${o.accent || "#FF5A4E"}"/>`; } },
  chain: { w:64, h:70, d:o => { const c = o.c || "#E7B416"; let s = ""; for (let i = 0; i < 22; i++){ const a = Math.PI * (.08 + i / 21 * .84); const x = 32 + Math.cos(a) * 26, y = 8 + Math.sin(a) * 40; s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.2" ry="2.2" fill="none" stroke="${c}" stroke-width="1.8" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
    return s + (o.pendant === false ? "" : `<circle cx="32" cy="56" r="8" fill="${c}" stroke="${dk(c, .3)}" stroke-width="1.5"/><text x="32" y="60" text-anchor="middle" font-size="10" font-weight="900" fill="${dk(c, .45)}" font-family="Arial,sans-serif">${esc(o.letter || "★")}</text>`); } },
  bag: { w:80, h:70, d:o => { const c = o.c || "#1D1B2C"; return `<path d="M8,30 Q40,-14 72,30" fill="none" stroke="${dk(c, .1)}" stroke-width="4"/>` + shape("M14,30 H66 Q70,30 70,34 V62 Q70,66 66,66 H14 Q10,66 10,62 V34 Q10,30 14,30Z", c) + shape("M10,32 Q10,30 14,30 H66 Q70,30 70,34 V44 H10 Z", dk(c, .12)) + `<rect x="36" y="40" width="8" height="8" rx="2" fill="#D0D4DA"/>`; } },
  phone: { w:40, h:70, d:o => `<rect x="4" y="2" width="32" height="64" rx="7" fill="#15151E"/><rect x="7" y="7" width="26" height="54" rx="4" fill="url(#${ID}td)"/><rect x="7" y="7" width="26" height="54" rx="4" fill="#3D5AFE" opacity=".35"/><path d="M20,30 c-6,-6 -10,2 -4,6 l4,4 l4,-4 c6,-4 2,-12 -4,-6z" fill="#fff"/><text x="20" y="52" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="Arial,sans-serif">2.4M</text>` },
  badges: { w:60, h:50, d:() => dot(16, 18, 11, "#FFD43B", "#9A7B00") + `<text x="16" y="22" text-anchor="middle" font-size="11" font-weight="900" fill="#222" font-family="Arial,sans-serif">★</text>` + dot(42, 16, 9, "#FF5A4E", "#9C2B22") + `<path d="M37,16 h10 M42,11 v10" stroke="#fff" stroke-width="2.4"/>` + dot(30, 38, 9, "#4DABF7", "#1C5C93") + `<path d="M25,38 a5,5 0 0 1 10,0" stroke="#fff" stroke-width="2" fill="none"/>` },
  watch: { w:60, h:40, d:o => `<rect x="2" y="14" width="56" height="12" rx="5" fill="${o.c || "#C9A227"}"/><circle cx="30" cy="20" r="12" fill="#F7F3E8" stroke="${o.c || "#C9A227"}" stroke-width="3"/><path d="M30,20 V12 M30,20 h6" stroke="#222" stroke-width="1.6"/>` },
  scarf: { w:80, h:70, d:o => { const c = o.c || "#C2255C"; return shape("M10,10 Q40,24 70,10 L74,20 Q40,36 6,20 Z", c, { pat:o.pat }) + shape("M44,28 L56,66 L44,68 L36,30 Z", dk(c, .08), { pat:o.pat }); } }
};
const TAG = {
  price: (t, bg) => `<g><path d="M8,8 H62 L72,20 L62,32 H8 Q4,32 4,28 V12 Q4,8 8,8Z" fill="${bg || "#D9B98C"}" stroke="${dk(bg || "#D9B98C", .3)}" stroke-width="1.2"/><circle cx="62" cy="20" r="3" fill="#fff" stroke="${dk(bg || "#D9B98C", .3)}"/><text x="34" y="25" text-anchor="middle" font-size="13" font-weight="900" fill="${bg === "#1D1B2C" ? "#FFD43B" : "#3B2A12"}" font-family="Arial,sans-serif">${esc(t)}</text><path d="M65,20 Q80,22 84,10" fill="none" stroke="#8C7B6B" stroke-width="1.2"/></g>`
};

/* ============================================================
   ЗБИРАННЯ ОБРАЗУ
   ============================================================ */
const TOPS = { tee, hoodie, shirt, sweater };
const JACKETS = ["blazer", "denim", "leather", "bomber", "neon"];
function topLayer(t){ if (!t) return ""; const f = TOPS[t.k] || tee; return f(t); }
function outerLayer(j){ if (!j) return ""; return jacket(j); }
const fit = (x, y, w, h, cw, ch, inner) => { const k = Math.min(w / cw, h / ch); const ox = x + (w - cw * k) / 2, oy = y + (h - ch * k) / 2; return `<g transform="translate(${ox.toFixed(1)},${oy.toFixed(1)}) scale(${k.toFixed(3)})">${inner}</g>`; };

const SLOTS = { head:[194, 254, 108, 76], eyes:[22, 176, 104, 40], neck:[130, 174, 52, 66], hand:[22, 176, 104, 40] };
const SLOT_OF = { cap:"head", bucket:"head", headband:"head", glasses:"eyes", headphones:"neck", chain:"neck", bag:"neck", phone:"neck", badges:"eyes", watch:"eyes", scarf:"neck" };

function begin(){ N++; ID = "w" + N + "x"; clipN = 0; }
function outfit(spec, o){
  spec = spec || {}; o = o || {}; begin();
  const bg = spec.bg === "none" ? "" : `<rect width="320" height="340" rx="${o.r == null ? 18 : o.r}" fill="${spec.bg && spec.bg !== "linen" ? spec.bg : "#F3EEE4"}"/><rect width="320" height="340" rx="${o.r == null ? 18 : o.r}" fill="url(#${ID}ck)" opacity=".1"/>`;
  let s = "";
  const hanger = spec.hanger;
  const topG = topLayer(spec.top) + outerLayer(spec.outer);
  if (topG){
    s += hanger ? `<g transform="translate(16,24) scale(.9)" filter="url(#${ID}ds)">${topG}</g><path d="M88,4 q0,-4 4,-4 q5,0 5,5 q0,4 -5,6 L92,14 L48,32 H136 Z" fill="none" stroke="#8C8577" stroke-width="2.4" stroke-linejoin="round"/>`
      : `<g transform="translate(8,8)" filter="url(#${ID}ds)">${topG}</g>`;
  }
  if (spec.bottom) s += `<g transform="translate(188,12)" filter="url(#${ID}ds)">${bottom(spec.bottom)}</g>`;
  if (spec.shoes) s += `<g transform="translate(6,232) scale(1.24)" filter="url(#${ID}ds)">${shoes(spec.shoes)}</g>`;
  const used = {};
  (spec.extras || []).forEach(x => {
    const e = EXTRA[x.k]; if (!e) return;
    let slot = SLOT_OF[x.k] || "neck";
    if (used[slot]) slot = ["neck", "eyes", "head"].find(z => !used[z]) || slot;
    used[slot] = true;
    const b = SLOTS[slot];
    s += `<g filter="url(#${ID}ds)">${fit(b[0], b[1], b[2], b[3], e.w, e.h, e.d(x))}</g>`;
  });
  (spec.tags || []).forEach((t, i) => {
    const pos = t.at === "shoes" ? [92, 240] : t.at === "bottom" ? [236, 150] : [112, 16 + i * 8];
    s += `<g transform="translate(${pos[0]},${pos[1]}) rotate(${t.rot == null ? 8 : t.rot})">${TAG.price(t.t, t.bg)}</g>`;
  });
  if (spec.sparkle) s += sparkle(290, 22, 7) + sparkle(304, 44, 4);
  const label = esc(o.label || "Outfit");
  return `<svg class="ss-art" viewBox="0 0 320 340" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${defs()}${bg}${s}</svg>`;
}

/* одна річ у квадраті (для кнопок вибору) */
function piece(item, o){
  o = o || {}; begin();
  let inner = "", cw = 160, ch = 160;
  if (!item) return "";
  if (item.slot === "shoes"){ inner = shoes(item); cw = 150; ch = 80; }
  else if (TOPS[item.k]) inner = topLayer(item);
  else if (JACKETS.includes(item.k)) inner = jacket(item);
  else if (LEGS[item.k]){ inner = bottom(item); cw = 120; ch = 230; }
  else if (EXTRA[item.k]){ inner = EXTRA[item.k].d(item); cw = EXTRA[item.k].w; ch = EXTRA[item.k].h; }
  const pad = 8;
  return `<svg class="ss-piece" viewBox="0 0 120 120" role="img" aria-label="${esc(o.label || item.k)}" xmlns="http://www.w3.org/2000/svg">${defs()}<g filter="url(#${ID}ds)">${fit(pad, pad, 120 - pad * 2, 120 - pad * 2, cw, ch, inner)}</g></svg>`;
}

/* ============================================================
   СТАРЕ ФОТО 1998 (концерт, контрове світло, дата в куті)
   ============================================================ */
function oldPhoto(o){
  o = o || {}; begin();
  const crowd = Array.from({ length: 13 }, (_, i) => { const x = i * 26 - 6, h = 26 + ((i * 37) % 22); return `<ellipse cx="${x + 13}" cy="${300 - h}" rx="13" ry="15" fill="#120C1C"/><rect x="${x}" y="${300 - h + 6}" width="28" height="${h + 20}" rx="10" fill="#120C1C"/>`; }).join("");
  return `<svg class="ss-oldphoto" viewBox="0 0 300 340" role="img" aria-label="${esc(o.label || "An old concert photo from 1998. A teenage boy in a big denim jacket, baggy jeans and a bucket hat, with his arms up.")}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${ID}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1446"/><stop offset=".55" stop-color="#5B1F5E"/><stop offset="1" stop-color="#1A0E22"/></linearGradient>
      <linearGradient id="${ID}b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".9"/><stop offset="1" stop-color="#FFB86B" stop-opacity="0"/></linearGradient>
      <linearGradient id="${ID}b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9EE6FF" stop-opacity=".75"/><stop offset="1" stop-color="#5B8CFF" stop-opacity="0"/></linearGradient>
      <radialGradient id="${ID}glow" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".85"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>
      <filter id="${ID}grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${ID}soft"><feGaussianBlur stdDeviation="1.1"/></filter>
      <pattern id="${ID}dn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0,1 H6 M0,4 H6" stroke="#fff" stroke-opacity=".10"/></pattern>
      <clipPath id="${ID}img"><rect x="14" y="14" width="272" height="272"/></clipPath>
    </defs>
    <rect width="300" height="340" rx="4" fill="#F4EEDF"/>
    <g clip-path="url(#${ID}img)">
      <rect x="14" y="14" width="272" height="272" fill="url(#${ID}sky)"/>
      <g filter="url(#${ID}soft)">
        <path d="M70,14 L20,286 H90 Z" fill="url(#${ID}b1)" opacity=".55"/><path d="M150,14 L120,286 H200 Z" fill="url(#${ID}b2)" opacity=".5"/><path d="M230,14 L190,286 H290 Z" fill="url(#${ID}b1)" opacity=".45"/>
        <circle cx="150" cy="70" r="120" fill="url(#${ID}glow)"/>
        <circle cx="70" cy="20" r="10" fill="#FFF4D6"/><circle cx="150" cy="18" r="9" fill="#E6F8FF"/><circle cx="230" cy="20" r="10" fill="#FFF4D6"/>
      </g>
      <g transform="translate(0,6)">${crowd}</g>
      <g transform="translate(150,0)">
        <!-- піднята рука -->
        <path d="M-40,168 L-62,98 L-50,94 L-26,160 Z" fill="#2E4C7A"/><path d="M-62,98 q-4,-12 4,-16 q8,-2 9,10 z" fill="#E2B08C"/>
        <path d="M36,170 L58,110 L70,114 L50,176 Z" fill="#2E4C7A"/><path d="M58,110 q2,-14 10,-12 q8,4 2,16 z" fill="#E2B08C"/>
        <!-- голова й панама -->
        <ellipse cx="0" cy="128" rx="22" ry="26" fill="#8E6450"/><path d="M-21,118 q0,-6 21,-6 q21,0 21,6 q-10,6 -21,6 q-11,0 -21,-6z" fill="#3A2418" opacity=".45"/><path d="M22,122 q2,16 -10,28" fill="none" stroke="#FFD9A0" stroke-opacity=".6" stroke-width="2"/>
        <path d="M-22,112 L-17,96 Q0,90 17,96 L22,112 Z" fill="#E8DFC8"/><path d="M-36,112 Q0,102 36,112 Q38,122 0,122 Q-38,122 -36,112Z" fill="#D8CDB2"/>
        <path d="M-10,138 q10,9 20,0" fill="#F4E6D4" stroke="#4A2A18" stroke-width="1.6" stroke-linecap="round"/><path d="M-12,126 q4,-3 8,0 M4,126 q4,-3 8,0" fill="none" stroke="#2A160C" stroke-width="2" stroke-linecap="round"/>
        <!-- куртка (величезна джинсова) -->
        <path d="M-58,170 Q-50,152 -22,148 L0,160 L22,148 Q50,152 58,170 L62,286 H-62 Z" fill="#3D5F95"/>
        <path d="M-58,170 Q-50,152 -22,148 L0,160 L22,148 Q50,152 58,170 L62,286 H-62 Z" fill="url(#${ID}dn)"/>
        <path d="M-8,160 L0,160 L8,160 L6,286 H-6 Z" fill="#E9E4D8"/>
        <path d="M-38,190 h20 v14 h-20 z M18,190 h20 v14 h-20 z" fill="none" stroke="#D9A05B" stroke-width="1.4" stroke-dasharray="3 2"/>
        <rect x="20" y="210" width="20" height="20" rx="3" fill="#E03131" transform="rotate(-8 30 220)"/><path d="M25,226 l5,-11 l5,11 z" fill="#FFF3C4" transform="rotate(-8 30 220)"/>
        <path d="M-58,170 Q-50,152 -22,148 M22,148 Q50,152 58,170 L62,286" fill="none" stroke="#9EE6FF" stroke-opacity=".55" stroke-width="2.5"/>
      </g>
      <!-- друг на краю кадру -->
      <g transform="translate(262,0)"><ellipse cx="0" cy="170" rx="20" ry="24" fill="#2A1A24"/><path d="M-40,210 Q-30,190 0,192 Q30,190 40,210 L44,290 H-44 Z" fill="#7A1F2B"/><path d="M-22,150 Q0,140 22,150 L20,162 H-20 Z" fill="#1D1B2C"/></g>
      <rect x="14" y="14" width="272" height="272" fill="#F2C987" opacity=".16" style="mix-blend-mode:multiply"/>
      <rect x="14" y="14" width="272" height="272" fill="#fff" filter="url(#${ID}grain)" opacity=".9"/>
      <rect x="14" y="14" width="272" height="272" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="18" filter="url(#${ID}soft)"/>
      <text x="274" y="276" text-anchor="end" font-family="'Courier New',monospace" font-weight="700" font-size="15" fill="#FF8A2A" opacity=".9" letter-spacing="1">'98 11 21</text>
    </g>
    <path d="M14,300 h80" stroke="#D8CDB2" stroke-width="2"/>
  </svg>`;
}
function photoBack(o){
  o = o || {}; begin();
  return `<svg class="ss-oldphoto" viewBox="0 0 300 340" role="img" aria-label="${esc(o.label || "The back of the photo. Handwriting: Best night ever. 1998.")}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="${ID}grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
    <rect width="300" height="340" rx="4" fill="#EFE6D2"/>
    <rect width="300" height="340" rx="4" fill="#fff" filter="url(#${ID}grain)"/>
    <g opacity=".22" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#7A6A4F" letter-spacing="3">${Array.from({ length: 6 }, (_, i) => `<text x="${-30 + (i % 2) * 40}" y="${40 + i * 60}" transform="rotate(-18 150 170)">PHOTO PAPER · PHOTO PAPER · PHOTO PAPER</text>`).join("")}</g>
    <text x="150" y="160" text-anchor="middle" font-family="'Caveat','Segoe Print','Comic Sans MS',cursive" font-size="44" font-weight="700" fill="#1F3A8A" transform="rotate(-6 150 160)">Best night ever.</text>
    <text x="196" y="214" text-anchor="middle" font-family="'Caveat','Segoe Print','Comic Sans MS',cursive" font-size="42" font-weight="700" fill="#1F3A8A" transform="rotate(-6 196 214)">1998.</text>
    <path d="M70,232 q60,-14 150,-18" fill="none" stroke="#1F3A8A" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>
    <text x="270" y="320" text-anchor="end" font-family="'Courier New',monospace" font-size="11" fill="#9C8B6B">No. 24</text>
  </svg>`;
}

window.SignalArt = { outfit, piece, oldPhoto, photoBack, tints:{ dk, lt } };
})();
