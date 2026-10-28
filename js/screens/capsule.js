/* ============================================================
   THE SIGNAL — бібліотека екранів «A Letter to the Future» (Unit 3 · Lesson 7)
   ------------------------------------------------------------
   Кінематографічна історія про капсулу часу 1998 року: спогади, чат Марка,
   Life Map (13 виразів), таймлайн, лист тата, два тексти 1998 / 2026,
   листівки з різних країн, лист собі в 2036 рік і клифгенгер.
   Типи: tcPrevious · tcIncoming · tcCards · tcLifeMap · tcMatch · tcOrder · tcPlace ·
         tcTalk · tcLetter · tcSplit · tcRead · tcComp · tcWorld · tcFutureIntro ·
         tcWriter · tcRecap · tcBadge · tcCliff
   Тема — css/capsule.css (body[data-episode-theme="capsule"]).
   Стан уроку (досягнення, переклади) — у ans._tc епізоду.
   Файл самодостатній: не залежить від інших бібліотек екранів.
   Підключається в index.html після js/player.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
if (!S || !P) return;
const { $, $$, esc, reduced, onCleanup, save, sayBtn, toast } = S;
const define = P.define;

/* ---------- дрібні помічники ---------- */
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const plain = s => String(s || "").replace(EMO, "").replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
const say = (t, l) => sayBtn(plain(t), l || "Listen");
const anim = () => !reduced();
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const derange = a => { if (a.length < 2) return a.slice(); let o; do { o = shuffle(a); } while (o.every((x, i) => x === a[i])); return o; };
const scrollTo = (node, block) => { if (node) later(() => node.scrollIntoView({ block: block || "nearest", behavior: anim() ? "smooth" : "auto" }), 80); };
const LETTER = i => String.fromCharCode(65 + i);
const GOOD = ["Nice work! That's exactly right.", "Great — that's it!", "Exactly right!", "Well done!"];
const good = i => GOOD[(i || 0) % GOOD.length];
const words = t => String(t || "").trim().split(/\s+/).filter(Boolean).length;
const norm = t => String(t || "").toLowerCase().replace(/[’‘`´]/g, "'");

/* ---------- іконки (контурні, 24×24) ---------- */
const ICON = {
  baby:`<circle cx="12" cy="7.5" r="3.4"/><path d="M5.5 20.5c0-4.3 2.9-7.3 6.5-7.3s6.5 3 6.5 7.3z"/><path d="M10.6 7.4h.01M13.4 7.4h.01M11 9.4q1 .8 2 0"/>`,
  bag:`<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7M5 13h14M10.5 13v2.2h3V13"/>`,
  cap:`<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v4.8c0 1.6 2.7 3.2 6 3.2s6-1.6 6-3.2V11M22 9v5.5"/>`,
  car:`<path d="M3 15.5V12l2.2-5h13.6L21 12v3.5z"/><path d="M3 12h18"/><circle cx="7.5" cy="16.5" r="1.9"/><circle cx="16.5" cy="16.5" r="1.9"/>`,
  ballot:`<path d="M4 12h16v8H4z"/><path d="M8 12V4h8v8"/><path d="M10 7.6l1.5 1.5 2.9-3"/><path d="M9 16h6"/>`,
  uni:`<path d="M3 9l9-5 9 5z"/><path d="M5.5 9v9M9.8 9v9M14.2 9v9M18.5 9v9"/><path d="M3 20.5h18"/>`,
  diploma:`<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M7 9h10M7 12.5h5.5"/><circle cx="16.5" cy="14.5" r="2.2"/><path d="M15.4 16.4l-.8 3.6 1.9-1 1.9 1-.8-3.6"/>`,
  door:`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h8A1.5 1.5 0 0 1 16 4.5V21"/><path d="M3 21h15"/><circle cx="13" cy="12.5" r=".9"/><path d="M19 9l2.2 2.2L19 13.4M16 11.2h5"/>`,
  "case":`<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6v1.9M3 13h18M11 13v2h2v-2"/>`,
  box:`<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9M7.5 6l9 4"/>`,
  rings:`<circle cx="9" cy="14.5" r="5"/><circle cx="15" cy="14.5" r="5"/><path d="M13 5.2l2 2.3 2-2.3-1-1.6h-2z"/>`,
  family:`<circle cx="7.5" cy="6.5" r="2.5"/><circle cx="16.5" cy="6.5" r="2.5"/><circle cx="12" cy="12.6" r="1.9"/><path d="M3 20c0-4 2-6.5 4.5-6.5M21 20c0-4-2-6.5-4.5-6.5M9 20c0-2.2 1.3-3.8 3-3.8s3 1.6 3 3.8"/>`,
  chair:`<path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M4 11a2 2 0 0 1 2 2v2h12v-2a2 2 0 1 1 4 0v4H2v-4a2 2 0 0 1 2-2z"/><path d="M5 17v3M19 17v3"/>`,
  house:`<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>`,
  scales:`<path d="M12 3v17M7.5 20.5h9M5 7h14"/><path d="M5 7l-3 6.5a3 3 0 0 0 6 0zM19 7l-3 6.5a3 3 0 0 0 6 0z"/>`,
  star:`<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>`,
  envelope:`<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6.5L20.5 7"/>`,
  globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>`,
  map:`<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13M15 6.5v13"/>`,
  timeline:`<path d="M3 12h18"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 5.5V10M12 14v4.5M18 5.5V10"/>`,
  feather:`<path d="M20 4C14 4 9 8 8 15l-3 5"/><path d="M8 15c5 0 9-3 10-9"/><path d="M10.5 11.5h5.5"/>`,
  compass:`<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2z"/>`,
  lock:`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  spark:`<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>`,
  medal:`<circle cx="12" cy="14" r="6"/><path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6"/><path d="M12 11.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>`,
  info:`<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>`,
  mic:`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>`,
  check:`<path d="M4 12.5l5 5L20 6.5"/>`,
  pen:`<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 7l3 3"/>`,
  copy:`<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>`,
  eye:`<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  save:`<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8V3M7 21v-7h10v7"/>`,
  marker:`<path d="M15 4l5 5-9 9H6v-5z"/><path d="M4 21h8"/>`,
  book:`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>`
};
const icon = (k, cls) => `<svg class="tc-icon ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[k] || ICON.spark}</svg>`;

/* ---------- звуки (тихі, без файлів; вимикаються кнопкою 🔊) ---------- */
const SND_KEY = "signal8:tc:mute";
const Snd = (() => {
  let ac = null;
  const muted = () => { try { return localStorage.getItem(SND_KEY) === "1"; } catch(e){ return false; } };
  const get = () => {
    try {
      if (!ac){ const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
      if (ac.state === "suspended") ac.resume();
      return ac;
    } catch(e){ return null; }
  };
  const tone = (a, f, t, dur, vol, type, f2) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .05);
  };
  const noise = (a, t, dur, vol, freq) => {
    const len = Math.floor(a.sampleRate * dur); const buf = a.createBuffer(1, len, a.sampleRate); const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource(); src.buffer = buf; const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq || 1800; f.Q.value = .7;
    const g = a.createGain(); g.gain.value = vol; src.connect(f); f.connect(g); g.connect(a.destination); src.start(t);
  };
  const play = fn => { if (muted()) return; const a = get(); if (!a) return; try { fn(a, a.currentTime + .01); } catch(e){} };
  return {
    muted, set(v){ try { localStorage.setItem(SND_KEY, v ? "1" : "0"); } catch(e){} },
    ping(){ play((a, t) => { tone(a, 988, t, .16, .05); tone(a, 1480, t + .1, .26, .04); }); },
    pop(){ play((a, t) => tone(a, 660, t, .08, .025, "triangle", 880)); },
    paper(){ play((a, t) => { noise(a, t, .22, .09, 2400); noise(a, t + .18, .28, .07, 1500); }); },
    seal(){ play((a, t) => { tone(a, 180, t, .5, .07, "sine", 90); noise(a, t, .12, .05, 600); }); },
    chime(){ play((a, t) => { [523, 659, 784, 1047].forEach((f, i) => tone(a, f, t + i * .09, .5, .035)); }); }
  };
})();

/* ---------- стан уроку: досягнення, переклади ---------- */
const TC = ctx => { const t = ctx.all._tc = ctx.all._tc || {}; t.ach = t.ach || {}; return t; };
const ACH = {
  lifemap:{ t:"13 Life Events Discovered", s:"Chapter 3 · Life Map", i:"map" },
  timeline:{ t:"Timeline Rebuilt", s:"Chapter 4 · Timeline Puzzle", i:"timeline" },
  world:{ t:"World Explorer", s:"Chapter 6 · World Challenge", i:"globe" },
  story:{ t:"Future Storyteller", s:"Chapter 7 · Dear Future Me", i:"feather" },
  life:{ t:"Life Explorer", s:"Chapter 8 · Lesson complete", i:"compass" }
};
const ACH_IDS = Object.keys(ACH);
function achPop(id){
  if (typeof document === "undefined") return;
  const a = ACH[id]; const n = document.createElement("div");
  n.className = "tc-achpop"; n.setAttribute("role", "status");
  n.innerHTML = `<span class="tc-achpop-i">${icon(a.i)}</span><span><small>Achievement unlocked</small><b>${esc(a.t)}</b></span>`;
  document.body.appendChild(n); Snd.chime();
  setTimeout(() => n.classList.add("out"), 2800); setTimeout(() => n.remove(), 3400);
}
function unlock(ctx, id){ const tc = TC(ctx); if (tc.ach[id]) return false; tc.ach[id] = Date.now(); save(); achPop(id); return true; }
function shelf(tc){
  return `<div class="tc-shelf-head"><b>Achievements</b><span>${Object.keys(tc.ach).length} of ${ACH_IDS.length}</span></div>
    <div class="tc-shelf-grid">${ACH_IDS.map(id => { const on = !!tc.ach[id]; return `<div class="tc-medal ${on ? "on" : ""}"><span class="tc-medal-i">${icon(on ? ACH[id].i : "lock")}</span><b>${esc(ACH[id].t)}</b><small>${on ? "Unlocked" : esc(ACH[id].s)}</small></div>`; }).join("")}</div>`;
}

/* ---------- перемикачі (переклад, зразок, підказка) — живуть, поки відкритий екран ---------- */
const OPEN = new Set();
let CUR = null, RESET = null;
const isOpen = id => OPEN.has(id);
const foldBtn = (id, label, cls) => `<button class="tc-tog ${cls || ""} ${isOpen(id) ? "on" : ""}" type="button" data-tcfold="${id}" aria-expanded="${isOpen(id)}" aria-controls="${id}">${label}</button>`;
const foldBox = (id, html, cls) => `<div class="tc-fold ${cls || ""} ${isOpen(id) ? "open" : ""}" id="${id}">${html}</div>`;
const uaBtn = (id, label) => foldBtn(id, `<span aria-hidden="true">🇺🇦</span> ${label == null ? "Translation" : label || `<span class="sr-only">Ukrainian translation</span>`}`, "ua");
const uaBox = (id, text) => foldBox(id, `<p>${esc(text)}</p>`, "tc-ua");
function frame(el, ctx){
  OPEN.clear(); RESET = null; CUR = { ctx, el };
  el.classList.add("tc-screen"); el.classList.toggle("tc-uaall", !!TC(ctx).ua);
}

/* ---------- верхня смуга: розділ, прогрес, досягнення, переклади, звук, скидання ---------- */
function progress(ctx){
  const ls = S.L(ctx.les.id); const total = (window.SIGNAL_SCREEN_COUNT && window.SIGNAL_SCREEN_COUNT(ctx.les.id)) || 1;
  return Math.max(0, Math.min(100, Math.round(Object.keys(ls.done || {}).length / total * 100)));
}
function bar(ctx, o){
  o = o || {};
  const st = ctx.scr.stage, tc = TC(ctx), n = Object.keys(tc.ach).length, pct = progress(ctx);
  const key = ctx.scr.data.store;
  RESET = key ? () => { delete ctx.ans[key]; if (o.onReset) o.onReset(); save(); toast("Activity reset"); window.SignalApp.render(); } : null;
  return `<div class="tc-bar">
      <span class="tc-bar-t"><b>Lesson 7</b><i aria-hidden="true">·</i>Chapter ${st.n} of ${ctx.les.stages.length}</span>
      <span class="tc-prog" title="Lesson progress: ${pct}%"><span class="tc-prog-track" aria-hidden="true"><i style="width:${pct}%"></i></span><b>${pct}%</b></span>
      <span class="spacer"></span>
      <button class="tc-chip" type="button" data-tcach aria-expanded="false" aria-controls="tc-shelf" title="Achievements" aria-label="Achievements: ${n} of ${ACH_IDS.length}">${icon("medal")}<b>${n}/${ACH_IDS.length}</b></button>
      <button class="tc-chip ${tc.ua ? "on" : ""}" type="button" data-tcuaall aria-pressed="${!!tc.ua}" title="Show or hide all Ukrainian translations" aria-label="Ukrainian translations"><span aria-hidden="true">🇺🇦</span><span class="tc-hide-sm">Translations</span></button>
      <button class="tc-chip" type="button" data-tcsnd aria-pressed="${!Snd.muted()}" title="Sound effects on / off" aria-label="Sound effects"><span aria-hidden="true">${Snd.muted() ? "🔇" : "🔊"}</span><span class="tc-hide-sm">Sound</span></button>
      ${ctx.teacher && RESET ? `<button class="tc-chip warn" type="button" data-tcreset title="Clear the answers on this screen">↺ Reset</button>` : ""}
    </div>
    <div class="tc-shelf" id="tc-shelf" hidden>${shelf(tc)}</div>`;
}
/* шапка екрана: смуга + заголовок + інструкція (з перекладом) */
function head(ctx, title, intro, o){
  o = o || {};
  return `${bar(ctx, o)}<header class="tc-head">
    <p class="tc-kicker">${esc(o.kicker || "Chapter " + ctx.scr.stage.n)}</p>
    <h2 class="stitle tc-title" id="stitle" tabindex="-1">${esc(title || ctx.scr.stage.title)}</h2>
    ${intro ? `<div class="tc-intro"><p>${esc(intro)}</p>${o.ua ? uaBtn("hd-ua", "") : ""}</div>${o.ua ? uaBox("hd-ua", o.ua) : ""}` : ""}
  </header>`;
}

if (typeof document !== "undefined") document.addEventListener("click", e => {
  if (!e.target.closest) return;
  const f = e.target.closest("[data-tcfold]");
  if (f){
    const id = f.dataset.tcfold; const show = !OPEN.has(id);
    show ? OPEN.add(id) : OPEN.delete(id);
    const box = document.getElementById(id); if (box) box.classList.toggle("open", show);
    document.querySelectorAll(`[data-tcfold="${id}"]`).forEach(b => { b.classList.toggle("on", show); b.setAttribute("aria-expanded", String(show)); });
    return;
  }
  if (!CUR) return;
  const a = e.target.closest("[data-tcach]");
  if (a){ const p = document.getElementById("tc-shelf"); if (!p) return; p.hidden = !p.hidden; a.setAttribute("aria-expanded", String(!p.hidden)); a.classList.toggle("on", !p.hidden); return; }
  const u = e.target.closest("[data-tcuaall]");
  if (u){ const tc = TC(CUR.ctx); tc.ua = !tc.ua; save(); CUR.el.classList.toggle("tc-uaall", tc.ua); u.classList.toggle("on", tc.ua); u.setAttribute("aria-pressed", String(tc.ua)); toast(tc.ua ? "Ukrainian translations: on" : "Ukrainian translations: hidden"); return; }
  const s = e.target.closest("[data-tcsnd]");
  if (s){ const m = !Snd.muted(); Snd.set(m); s.setAttribute("aria-pressed", String(!m)); s.firstElementChild.textContent = m ? "🔇" : "🔊"; if (!m) Snd.pop(); return; }
  const r = e.target.closest("[data-tcreset]");
  if (r && RESET){
    if (!r.dataset.confirm){ r.dataset.confirm = "1"; r.textContent = "Tap again to reset"; r.classList.add("hot"); setTimeout(() => { if (r.isConnected){ delete r.dataset.confirm; r.textContent = "↺ Reset"; r.classList.remove("hot"); } }, 3500); return; }
    RESET();
  }
});

/* ---------- усне питання з опорами (переклад, початок відповіді, додаткові питання, зразок) ---------- */
function qBlock(ctx, id, q, o){
  o = o || {};
  return `<div class="tc-q ${o.small ? "small" : ""}">
    <div class="tc-qrow"><p class="tc-bigq">${esc(q.q)}</p>${say(q.q, "Listen to the question")}</div>
    ${q.starter ? `<p class="tc-starter"><span>Start like this</span>${esc(q.starter)}</p>` : ""}
    <div class="tc-tools">${q.ua ? uaBtn(id + "-ua") : ""}${q.fu && q.fu.length ? foldBtn(id + "-fu", `${icon("spark")} Follow-up`) : ""}${ctx.teacher && q.ex ? foldBtn(id + "-ex", "🧑‍🏫 Sample answer", "teach") : ""}</div>
    ${q.ua ? uaBox(id + "-ua", q.ua) : ""}
    ${q.fu && q.fu.length ? foldBox(id + "-fu", `<ul class="tc-fu">${q.fu.map(f => `<li><span>${esc(f)}</span>${say(f)}</li>`).join("")}</ul>`, "tc-fubox") : ""}
    ${ctx.teacher && q.ex ? foldBox(id + "-ex", `<p>“${esc(q.ex)}” ${say(q.ex, "Listen to the sample answer")}</p>`, "tc-sample") : ""}
  </div>`;
}

/* ---------- картинки з запасним малюнком (ніколи не лишаємо «биту» картинку) ---------- */
const media = (les, k) => (les.media || {})[k] || null;
function pic(src, alt, fb, cls){
  if (!src) return `<span class="tc-pic ${cls || ""} fail"><span class="tc-pic-fb">${fb}</span></span>`;
  return `<span class="tc-pic ${cls || ""}"><img src="${esc(src)}" alt="${esc(alt || "")}" decoding="async" onerror="this.parentNode.classList.add('fail')"><span class="tc-pic-fb">${fb}</span></span>`;
}
function jacketArt(){
  return `<svg viewBox="0 0 120 120" role="img" aria-label="A denim jacket with a red patch"><path d="M38,16 L60,22 L82,16 L106,31 L110,98 L91,102 L89,62 L87,108 H33 L31,62 L29,102 L10,98 L14,31 Z" fill="#5C82B8" stroke="#2F4A74" stroke-width="2"/><path d="M60,22 V108" stroke="#2F4A74" stroke-width="1.6"/><path d="M38,16 L52,40 L60,22 L68,40 L82,16" fill="#4A6FA5" stroke="#2F4A74" stroke-width="1.6"/><rect x="40" y="50" width="14" height="10" rx="1.5" fill="none" stroke="#D9A05B" stroke-width="1.2" stroke-dasharray="2 1.5"/><g transform="rotate(-8 77 58)"><rect x="70" y="51" width="15" height="15" rx="2" fill="#C0392B"/><path d="M73.5,63 l4,-9 l4,9 z" fill="#FFF3C4"/></g><circle cx="60" cy="70" r="1.8" fill="#D9A05B"/><circle cx="60" cy="86" r="1.8" fill="#D9A05B"/></svg>`;
}
function photoArt(){
  return `<svg viewBox="0 0 160 120" role="img" aria-label="An old concert photo"><defs><radialGradient id="tcph" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#8A4C5E"/><stop offset=".6" stop-color="#3A2244"/><stop offset="1" stop-color="#150F22"/></radialGradient></defs><rect width="160" height="120" fill="url(#tcph)"/><g opacity=".8">${[[20, 18, "#FFD08A"], [56, 12, "#9EE6E2"], [104, 16, "#FFB3C0"], [140, 22, "#FFD08A"]].map(b => `<circle cx="${b[0]}" cy="${b[1]}" r="5" fill="${b[2]}"/>`).join("")}</g><path d="M62,120 L66,82 Q70,68 80,66 Q90,68 94,82 L98,120Z" fill="#5C82B8"/><path d="M68,74 L54,34 L60,31 L73,70Z M92,74 L106,34 L100,31 L87,70Z" fill="#5C82B8"/><ellipse cx="80" cy="56" rx="10" ry="12" fill="#7A4B32"/><path d="M68,48 Q80,40 92,48 L90,52 Q80,48 70,52Z" fill="#E9E2CF"/><text x="10" y="112" font-family="'Courier New',monospace" font-size="9" font-weight="700" fill="#FF8A2A">'98 11 21</text></svg>`;
}
function fourArt(){
  const p = (x, top, skin, hair) => `<path d="M${x - 15},120 L${x - 12},84 Q${x - 8},72 ${x},71 Q${x + 8},72 ${x + 12},84 L${x + 15},120Z" fill="${top}"/><ellipse cx="${x}" cy="60" rx="9" ry="11" fill="${skin}"/><path d="M${x - 9},56 Q${x},44 ${x + 9},56 Q${x},51 ${x - 9},56Z" fill="${hair}"/>`;
  return `<svg viewBox="0 0 160 120" role="img" aria-label="An old photo of four friends"><defs><radialGradient id="tcfr" cx=".5" cy=".3" r=".9"><stop offset="0" stop-color="#6E3B66"/><stop offset="1" stop-color="#120E20"/></radialGradient></defs><rect width="160" height="120" fill="url(#tcfr)"/>${p(34, "#7048E8", "#E8BA9C", "#2A1B14")}${p(66, "#5C82B8", "#7A4B32", "#1E1612")}${p(96, "#E03131", "#D9A07E", "#5A3420")}${p(127, "#1E1E22", "#6B4430", "#141A28")}<text x="104" y="113" font-family="'Courier New',monospace" font-size="8" font-weight="700" fill="#FF8A2A">'98 11 21</text></svg>`;
}
function letterThumb(){
  return `<span class="tc-lthumb" role="img" aria-label="An old handwritten letter from 1998"><span class="tc-lthumb-y">1998</span><i></i><i></i><i></i><i class="s"></i><i></i><i class="s"></i><span class="tc-lthumb-sig">Dan</span></span>`;
}
function eventPic(les, x, big){
  const src = ((les.media || {}).events || {})[x.id];
  return pic(src, x.w, `<span class="tc-evart z-${x.zone} ${big ? "big" : ""}">${icon(x.icon)}</span>`, "ev");
}

/* ---------- чат ---------- */
function face(les, who){
  const c = les.characters[who] || {};
  const ch = esc((c.name || "?")[0]);
  if (c.img){ const f = c.face || { x:50, y:38 };
    return `<span class="tc-ava" data-ch="${ch}"><img src="${esc(c.img)}" alt="" decoding="async" style="object-position:${f.x}% ${f.y}%;transform-origin:${f.x}% ${f.y}%;transform:scale(1.9)" onerror="this.parentNode.classList.add('mono');this.parentNode.textContent=this.parentNode.dataset.ch"></span>`; }
  return `<span class="tc-ava mono" aria-hidden="true">${ch}</span>`;
}
function bubble(les, m){
  if (m.sys) return `<div class="tc-sys">${esc(m.sys)}</div>`;
  const c = les.characters[m.who] || { name:m.who };
  const lm = m.letter ? (media(les, "letter") ? pic(media(les, "letter"), "An old notebook with Dad's handwritten letter from 1998", letterThumb(), "chatpic") : letterThumb()) : "";
  return `<div class="tc-msg who-${esc(m.who)} ${m.letter ? "has-letter" : ""}">${face(les, m.who)}<div class="tc-bub"><b class="tc-name">${esc(c.name)}</b>${m.letter ? lm : `<span>${esc(m.t)}</span>`}</div></div>`;
}
const chatHTML = (les, items) => items.filter(m => !m.pause).map(m => bubble(les, m)).join("");
function playChat(box, les, items, o){
  o = o || {}; let k = 0, alive = true; onCleanup(() => { alive = false; });
  if (!box) return;
  const stop = () => !alive || !box.isConnected || (o.stopped && o.stopped());
  const scroll = () => { const s = o.scroller || box; if (s.scrollHeight > s.clientHeight) s.scrollTop = s.scrollHeight; };
  const step = () => {
    if (stop()) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const m = items[k++];
    if (m.pause){ later(step, anim() ? m.pause : 0); return; }
    if (m.sys){ box.insertAdjacentHTML("beforeend", bubble(les, m)); scroll(); later(step, 300); return; }
    const t = document.createElement("div"); t.className = "tc-typing";
    t.innerHTML = `<span class="tc-tdots" aria-hidden="true"><i></i><i></i><i></i></span>${esc((les.characters[m.who] || {}).name || "Someone")} is typing…`;
    box.appendChild(t); scroll();
    later(() => {
      if (stop()) return; t.remove();
      box.insertAdjacentHTML("beforeend", bubble(les, m)); scroll();
      if (o.sound !== false) Snd.pop(); if (o.each) o.each(m);
      later(step, 520);
    }, m.letter ? 1300 : Math.min(1500, 520 + String(m.t || "").length * 13));
  };
  later(step, o.delay || 300);
}
const phone = (les, who, o) => { o = o || {}; const c = les.characters[who] || { name:who };
  return `<div class="tc-phone ${o.cls || ""}"><div class="tc-phone-head">${face(les, who)}<div><b>${esc(c.name)}</b><small>${esc(o.status || "online")}</small></div><span class="tc-phone-dot" aria-hidden="true"></span></div>
    <div class="tc-thread" id="${o.id || "th"}" aria-live="polite">${o.inner || ""}</div>${o.foot ? `<div class="tc-phone-foot">${o.foot}</div>` : ""}</div>`; };
/* чат, що відтворюється один раз (A[flag]); далі показується одразу */
function chatOnce(box, les, items, A, flag, o){
  o = o || {};
  if (!box) return;
  if (A[flag] || !anim()){ box.innerHTML = chatHTML(les, items); box.scrollTop = box.scrollHeight; A[flag] = true; save(); if (o.done) o.done(true); return; }
  if (o.ping) Snd.ping();
  playChat(box, les, items, { delay:o.delay || 400, done: () => { A[flag] = true; save(); if (o.done) o.done(false); } });
}

/* друкарська машинка (для голосу диктора) */
function typewrite(node, text, o){
  o = o || {}; if (!node) return;
  if (!anim() || o.instant){ node.textContent = text; if (o.done) o.done(); return; }
  node.textContent = ""; node.classList.add("tc-caret"); let i = 0;
  const tick = () => { if (!node.isConnected) return; node.textContent = text.slice(0, ++i); if (i < text.length) later(tick, o.speed || 34); else { node.classList.remove("tc-caret"); if (o.done) o.done(); } };
  later(tick, o.delay || 200);
}

/* питання з вибором: 1-ша помилка → підказка, 2-га → правильна відповідь */
function mcqHTML(id, q, R, o){
  o = o || {}; R = R || {}; const wrong = R.wrong || []; const done = R.ok || R.shown;
  let fb = "";
  if (R.ok) fb = `<div class="note good tc-fb">✓ ${esc(R.first ? good(o.n) : "Yes, that's it!")} ${esc(q.why || "")}${q.ua ? " " + uaBtn(id + "-ua") : ""}</div>${q.ua ? uaBox(id + "-ua", q.ua) : ""}`;
  else if (R.shown) fb = `<div class="note info tc-fb">The answer is <b>${LETTER(q.a)}. ${esc(q.o[q.a])}</b> ${esc(q.why || "")}${q.ua ? " " + uaBtn(id + "-ua") : ""}</div>${q.ua ? uaBox(id + "-ua", q.ua) : ""}`;
  else if (wrong.length) fb = `<div class="note amber tc-fb">Not quite. ${esc(q.hint || "Try again.")}</div>`;
  return `<div class="tc-mcq ${done ? "done" : ""}" data-qid="${id}">
    ${o.noQ ? "" : `<div class="tc-qrow"><p class="tc-mq">${o.num ? `<span class="tc-qn">${o.num}</span>` : ""}<span>${esc(q.q)}</span></p>${say(q.q, "Listen to the question")}</div>`}
    <div class="tc-opts">${q.o.map((x, k) => { let cls = ""; if (done && k === q.a) cls = "good"; else if (wrong.includes(k)) cls = "bad";
      return `<button class="tc-opt ${cls}" type="button" data-opt="${id}:${k}" ${done || wrong.includes(k) ? "disabled" : ""}><b class="tc-letter" aria-hidden="true">${LETTER(k)}</b><span>${esc(x)}</span></button>`; }).join("")}</div>
    <div aria-live="polite">${fb}</div>
    ${o.teacher && !done ? `<button class="btn small link tc-reveal" type="button" data-oshow="${id}">Reveal answer</button>` : ""}
  </div>`;
}
function mcqClick(e, get){
  const b = e.target.closest("[data-opt]");
  if (b){
    const parts = b.dataset.opt.split(":"); const k = +parts.pop(); const id = parts.join(":");
    const x = get(id); if (!x) return false; const R = x.R;
    if (R.ok || R.shown) return id;
    if (k === x.q.a){ R.ok = true; R.first = !(R.wrong && R.wrong.length); }
    else { R.wrong = (R.wrong || []).concat(k); if (R.wrong.length >= 2) R.shown = true; }
    save(); return id;
  }
  const s = e.target.closest("[data-oshow]");
  if (s){ const x = get(s.dataset.oshow); if (x){ x.R.shown = true; save(); return s.dataset.oshow; } }
  return false;
}
const mcqDone = R => !!(R && (R.ok || R.shown));

/* ============================================================
   CHAPTER 1 · tcPrevious — «PREVIOUSLY ON…»: друкарська машинка + 3 картки-спогади
   data: { flash, cards:[{id,t,img,line,q,ua,ex,fu}] }
   ============================================================ */
define("tcPrevious", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "flash"); A.open = A.open || {};
  const first = !A.seen && anim(); let entering = first;
  const memPic = c => { const fb = c.img === "jacket" ? jacketArt() : c.img === "photo" ? photoArt() : fourArt();
    return pic(media(les, c.img), media(les, c.img + "Alt") || c.t, fb, "mem"); };
  const card = (c, k) => { const on = !!A.open[c.id];
    return `<div class="tc-mem ${on ? "on" : ""} ${entering ? "enter" : ""}" style="--k:${k}">
      ${on ? `<div class="tc-mem-back">
          <span class="tc-mem-k">Memory ${k + 1} · ${esc(c.t)}</span>
          ${qBlock(ctx, "pv" + k, c, { small:true })}
          <button class="tc-link" type="button" data-memback="${c.id}">↺ Turn the card back</button>
        </div>`
      : `<button class="tc-mem-front" type="button" data-mem="${c.id}">
          <span class="tc-mem-pic">${memPic(c)}<span class="tc-grain" aria-hidden="true"></span></span>
          <span class="tc-mem-k">Memory ${k + 1}</span><b>${esc(c.t)}</b><span class="tc-mem-line">${esc(c.line)}</span>
          <span class="tc-mem-tap">Tap to remember</span>
        </button>`}
    </div>`; };
  const drawCards = () => { const box = $(".tc-mems", el); if (box) box.innerHTML = d.cards.map(card).join(""); entering = false; const n = Object.keys(A.open).length; $("#ph", el).textContent = n ? `${n} of ${d.cards.length} memories opened.` : "Tap each memory. Answer the question out loud."; };
  el.innerHTML = `<div class="story-screen tc-prev">
      <p class="tc-prev-k" id="stitle" tabindex="-1">Previously on…</p>
      <p class="tc-prev-tag"><span class="sr-only">${esc(d.flash)}</span><span aria-hidden="true" id="tw"></span></p>
      <div class="tc-mems"></div>
      <p class="tc-prev-hint" id="ph" aria-live="polite"></p>
    </div>`;
  drawCards();
  typewrite($("#tw", el), d.flash, { instant: !first, speed:28, delay:700, done: () => { A.seen = true; save(); } });
  el.onclick = e => {
    const m = e.target.closest("[data-mem]"); if (m){ A.open[m.dataset.mem] = Date.now(); save(); Snd.pop(); drawCards(); const b = $(`[data-memback="${m.dataset.mem}"]`, el); if (b) b.focus({ preventScroll:true }); return; }
    const b = e.target.closest("[data-memback]"); if (b){ delete A.open[b.dataset.memback]; save(); drawCards(); const f = $(`[data-mem="${b.dataset.memback}"]`, el); if (f) f.focus(); }
  };
  ctx.setCTA({ label:"Continue" });
}, { story:true, label: () => "Previously on…" });

/* ============================================================
   tcIncoming — «Marko is online…» → чат із листом → MISSION UNLOCKED
   data: { chat:[msgs], mission:{k,t,sub,cta} }
   ============================================================ */
define("tcIncoming", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "msg"), mi = d.mission;
  const missionHTML = fresh => `<section class="tc-mission ${fresh ? "pop" : ""}">
      <span class="tc-mission-k">${icon("spark")} ${esc(mi.k)}</span>
      <h3>${esc(mi.t)}</h3><p>${esc(mi.sub)}</p>
      <button class="btn primary big tc-cta" type="button" data-open>${esc(mi.cta)}</button>
    </section>`;
  el.innerHTML = `${bar(ctx)}
    <h2 class="sr-only" id="stitle" tabindex="-1">Marko is online</h2>
    <div class="tc-notif ${A.seen || !anim() ? "" : "slide"}" role="status">${face(les, "marko")}<div><b>Marko is online…</b><small>New messages · just now</small></div><span class="tc-phone-dot" aria-hidden="true"></span></div>
    <div class="tc-incoming">
      ${phone(les, "marko", { id:"th", foot:`<button class="btn small" type="button" data-replay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-all>Show all</button>` })}
      <div id="mz" aria-live="polite">${A.seen ? missionHTML(false) : `<div class="tc-mission-wait">${icon("lock")}<p>Read Marko's messages…</p></div>`}</div>
    </div>`;
  const th = $("#th", el); let gen = 0;
  const finish = fresh => { A.seen = true; save(); $("#mz", el).innerHTML = missionHTML(fresh); if (fresh){ Snd.chime(); scrollTo($("#mz", el), "center"); } };
  const all = () => { gen++; th.innerHTML = chatHTML(les, d.chat); th.scrollTop = th.scrollHeight; if (!A.seen) finish(true); };
  const run = () => { gen++; const my = gen; th.innerHTML = ""; later(() => Snd.ping(), 250); playChat(th, les, d.chat, { delay:900, stopped: () => my !== gen, done: () => { if (!A.seen) finish(true); } }); };
  el.onclick = e => {
    if (e.target.closest("[data-open]")){ Snd.paper(); ctx.next(); return; }
    if (e.target.closest("[data-all]")){ all(); return; }
    if (e.target.closest("[data-replay]")) run();
  };
  if (A.seen || !anim()){ th.innerHTML = chatHTML(les, d.chat); later(() => { th.scrollTop = th.scrollHeight; }, 30); if (!A.seen) finish(false); }
  else run();
  ctx.setCTA({ label: mi.cta, action: () => { Snd.paper(); ctx.next(); } });
}, { label: () => "Marko's message" });

/* ============================================================
   CHAPTER 2 · tcCards — 6 карток-питань у блокноті Марка (порядок — будь-який)
   data: { heading, headingUa, cards:[{id,t,icon,q,ua,starter,ex,fu}], outro:[msgs] }
   ============================================================ */
define("tcCards", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "cards"); A.done = A.done || {};
  let fresh = null;
  const draw = () => {
    const cur = d.cards.find(c => c.id === A.cur); const n = Object.keys(A.done).length;
    el.innerHTML = `${head(ctx, ctx.scr.stage.title, "Choose a card and answer the question out loud. You can choose any order.", { kicker:"Chapter 2 · Warm-up", ua:"Обери картку й дай відповідь уголос. Порядок — будь-який." })}
      <div class="tc-notebook">
        <div class="tc-nb-head"><p class="tc-nb-h">${esc(d.heading)}</p>${say(d.heading)}${uaBtn("nb-ua", "")}</div>${uaBox("nb-ua", d.headingUa)}
        <div class="tc-qcards">${d.cards.map((c, k) => `<button class="tc-qc ${A.cur === c.id ? "on" : ""} ${A.done[c.id] ? "done" : ""}" type="button" data-qc="${c.id}" aria-pressed="${A.cur === c.id}" style="--k:${k}">
            <span class="tc-qc-i">${icon(c.icon)}</span><span class="tc-qc-n" aria-hidden="true">${String(k + 1).padStart(2, "0")}</span>
            <b>${esc(c.t)}</b><small>${A.done[c.id] ? "✓ Opened" : "Tap to open"}</small></button>`).join("")}</div>
      </div>
      <div id="qd" aria-live="polite">${cur ? `<article class="tc-qdetail ${fresh === cur.id ? "flip" : ""}"><div class="tc-qd-top"><span class="tc-qc-i lg">${icon(cur.icon)}</span><span class="tc-mem-k">${esc(cur.t)}</span></div>${qBlock(ctx, "wc-" + cur.id, cur)}</article>`
        : `<p class="tc-empty">${icon("info")} Choose a card above. Your teacher can choose the order.</p>`}</div>
      <div class="tc-row tc-under"><span class="pill ${n === d.cards.length ? "good" : ""}">${n} / ${d.cards.length} cards opened</span><span class="muted">3–4 cards are enough.</span></div>
      <div id="out">${A.outro ? `<div class="tc-phone slim"><div class="tc-thread" id="ot">${chatHTML(les, d.outro)}</div></div>` : ""}</div>`;
    setCTA(); fresh = null;
  };
  const setCTA = () => { if (A.outro) ctx.setCTA({ label:"Unlock the Life Map →" }); else ctx.setCTA({ label:"Finish the warm-up", action: playOutro }); };
  const playOutro = () => {
    A.outro = true; save();
    const box = $("#out", el); box.innerHTML = `<div class="tc-phone slim"><div class="tc-thread" id="ot" aria-live="polite"></div></div>`;
    scrollTo(box, "center"); Snd.ping();
    if (anim()) playChat($("#ot", el), les, d.outro, { delay:500 }); else $("#ot", el).innerHTML = chatHTML(les, d.outro);
    setCTA();
  };
  el.onclick = e => { const b = e.target.closest("[data-qc]"); if (b){ A.cur = b.dataset.qc; A.done[A.cur] = true; fresh = A.cur; save(); Snd.pop(); draw(); scrollTo($("#qd", el)); } };
  draw();
}, { label: () => "6 question cards" });

/* ============================================================
   CHAPTER 3 · tcLifeMap — карта життя: 5 етапів, 13 карток, картка слова
   data: { intro, note, noteUa }   — використовує les.life, les.zones
   ============================================================ */
function vocabPanel(les, x, fresh){
  const inBank = S.state.words[x.w] && S.state.words[x.w].added;
  const exHL = (() => { const s = esc(x.ex); try { return s.replace(new RegExp(x.re, "i"), m => `<mark>${m}</mark>`); } catch(e){ return s; } })();
  return `<article class="tc-vcard ${fresh ? "flip" : ""}" aria-label="${esc(x.w)}">
    <div class="tc-vcard-pic">${eventPic(les, x, true)}</div>
    <div class="tc-vcard-body">
      <div class="tc-vcard-top"><h3>${esc(x.w)}</h3>${say(x.w + ". " + x.ex, "Listen: " + x.w)}${x.opt ? `<span class="tc-optional">optional</span>` : ""}</div>
      <p class="tc-vrow"><span>Easy English</span>${esc(x.en)}</p>
      <p class="tc-vrow ua"><span>Ukrainian</span>${esc(x.ua)}</p>
      <p class="tc-vrow ex"><span>Example</span>“${exHL}”</p>
      <div class="tc-row"><button class="btn small addword ${inBank ? "on" : ""}" type="button" data-addword="${esc(x.w)}">${inBank ? "✓ In My words" : "+ My words"}</button></div>
    </div></article>`;
}
define("tcLifeMap", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "map"); A.seen = A.seen || {};
  const L = les.life, Z = les.zones;
  let drawRoad = !A.drawn && anim(), fresh = null;
  const draw = () => {
    const cur = L.find(x => x.id === A.cur); const n = Object.keys(A.seen).length;
    const allIn = L.every(x => S.state.words[x.w] && S.state.words[x.w].added);
    el.innerHTML = `${head(ctx, ctx.scr.stage.title, d.intro, { kicker:"Chapter 3 · Vocabulary", ua:"Натискай на кожну подію на карті. Дізнайся, що вона означає, — потім з'єднай значення." })}
      <div class="tc-maptop">
        <div class="tc-ring" style="--p:${(n / L.length).toFixed(3)}" role="img" aria-label="${n} of ${L.length} life events discovered"><b>${n}</b><span>/${L.length}</span></div>
        <div class="tc-maptop-t"><b>Life events discovered</b><p>${n === L.length ? "All 13 found! Now let's match the meanings." : "Tap the cards on the map — from childhood to later life."}</p></div>
        <span class="spacer"></span>
        <button class="btn small ${allIn ? "on" : ""}" type="button" data-addall>${allIn ? "✓ All 13 in My words" : "+ Add all 13 to My words"}</button>
      </div>
      <div class="tc-map ${drawRoad ? "draw" : ""}">
        <svg class="tc-road" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="tcRoadG" x1="0" x2="1"><stop offset="0" stop-color="#F59F00"/><stop offset=".55" stop-color="#B197FC"/><stop offset="1" stop-color="#74C0FC"/></linearGradient></defs>
          <path class="tc-road-bg" d="M0,40 L100,40 Q200,-2 300,40 Q400,82 500,40 Q600,-2 700,40 Q800,82 900,40 L1000,40"/>
          <path class="tc-road-fg" d="M0,40 L100,40 Q200,-2 300,40 Q400,82 500,40 Q600,-2 700,40 Q800,82 900,40 L1000,40" pathLength="1"/></svg>
        ${Z.map((z, zi) => `<section class="tc-zone z-${z.id}" style="--zi:${zi}" aria-label="${esc(z.t)}, age ${esc(z.age)}">
            <span class="tc-node" aria-hidden="true"></span>
            <header><b>${esc(z.t)}</b><small>${esc(z.age)}</small><span class="tc-fold tc-ua tc-zua">${esc(z.ua)}</span></header>
            <div class="tc-evs">${L.filter(x => x.zone === z.id).map(x => `<button class="tc-ev ${A.cur === x.id ? "on" : ""} ${A.seen[x.id] ? "seen" : ""}" type="button" data-ev="${x.id}" aria-pressed="${A.cur === x.id}">
                <span class="tc-ev-i z-${x.zone}">${icon(x.icon)}</span><span class="tc-ev-t">${esc(x.w)}</span>${x.opt ? `<span class="tc-optional sm">optional</span>` : ""}${A.seen[x.id] ? `<span class="tc-ev-ok" aria-label="discovered">✓</span>` : ""}</button>`).join("")}</div>
          </section>`).join("")}
      </div>
      <div class="tc-note">${icon("info")}<p>${esc(d.note)}</p>${uaBtn("mn-ua", "")}</div>${uaBox("mn-ua", d.noteUa)}
      <div id="vd" aria-live="polite">${cur ? vocabPanel(les, cur, fresh === cur.id) : `<p class="tc-empty">${icon("map")} Start with <b>be born</b> — tap the first card.</p>`}</div>`;
    ctx.setCTA({ label: n >= 10 ? "Match the meanings →" : "Continue" });
    if (drawRoad){ A.drawn = true; save(); drawRoad = false; }
    fresh = null;
  };
  el.onclick = e => {
    const b = e.target.closest("[data-ev]");
    if (b){ const id = b.dataset.ev; A.cur = id; const isNew = !A.seen[id]; A.seen[id] = true; fresh = id; save(); if (isNew) Snd.pop(); draw(); scrollTo($("#vd", el)); const nb = $(`[data-ev="${id}"]`, el); if (nb) nb.focus({ preventScroll:true }); return; }
    if (e.target.closest("[data-addall]")){ L.forEach(x => S.addWord(x.w)); toast("13 life events added to My words"); draw(); }
  };
  draw();
}, { label: () => "Life Map" });

/* ============================================================
   tcMatch — «Match the Meaning»: 6 виразів ↔ 6 значень (клік або перетягування)
   data: { pairs:[{w,d,h}], outro:[msgs] }
   ============================================================ */
define("tcMatch", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "match"); A.pair = A.pair || {};
  const defs = d.pairs.map(p => p.d);
  if (!Array.isArray(A.order) || A.order.length !== defs.length || defs.some(x => !A.order.includes(x))) A.order = derange(defs);
  let sel = null, msg = null, fresh = false;
  const pairedCount = () => Object.keys(A.pair).length;
  const right = () => d.pairs.filter((p, i) => A.pair[i] === i).length;
  const usedBy = j => { const k = Object.keys(A.pair).find(i => A.pair[i] === j); return k == null ? null : +k; };
  const doneHTML = () => `<div class="tc-achbanner ${fresh ? "pop" : ""}">${icon("map")}<div><small>Chapter 3 complete</small><b>13 LIFE EVENTS DISCOVERED</b></div></div>
    <div class="tc-phone slim"><div class="tc-thread" id="mo" aria-live="polite"></div></div>`;
  const draw = () => {
    const done = !!A.solved; const placed = pairedCount();
    el.innerHTML = `${head(ctx, "Match the Meaning", "Tap an expression, then tap its meaning. You can also drag it.", { kicker:"Chapter 3 · Practice", ua:"Натисни на вираз, а потім на його значення. Можна також перетягнути." })}
      <div class="tc-match">
        <div class="tc-mcol" role="group" aria-label="Expressions">${d.pairs.map((p, i) => { const j = A.pair[i]; const res = A.chk && j != null ? (j === i ? "ok" : "no") : ""; const lock = done || res === "ok";
          return `<button class="tc-mw c${i} ${sel === i ? "sel" : ""} ${j != null ? "paired" : ""} ${res}" type="button" data-ml="${i}" draggable="${lock ? "false" : "true"}" aria-pressed="${sel === i}" ${lock ? "disabled" : ""}>
            <span class="tc-mtag" aria-hidden="true">${j != null ? i + 1 : ""}</span><span>${esc(p.w)}</span>${res ? `<span class="tc-mres" aria-label="${res === "ok" ? "correct" : "incorrect"}">${res === "ok" ? "✓" : "✗"}</span>` : ""}</button>`; }).join("")}</div>
        <div class="tc-mcol defs" role="group" aria-label="Meanings">${A.order.map(def => { const j = defs.indexOf(def); const by = usedBy(j); const res = A.chk && by != null ? (by === j ? "ok" : "no") : ""; const lock = done || res === "ok";
          return `<button class="tc-md ${by != null ? "c" + by + " paired" : ""} ${res} ${sel != null && by == null ? "ready" : ""}" type="button" data-mr="${j}" ${lock ? "disabled" : ""} aria-label="${esc(def)}${by != null ? " — matched with " + esc(d.pairs[by].w) : ""}">
            <span class="tc-mtag" aria-hidden="true">${by != null ? by + 1 : ""}</span><span>${esc(def)}</span></button>`; }).join("")}</div>
      </div>
      <div aria-live="polite">${done ? `<div class="note good">✓ ${A.revealed ? "Here are all the answers." : "Nice work! That's exactly right — 6 / 6."}</div>` : msg ? `<div class="note ${msg.c}">${msg.t}</div>` : `<p class="tc-tip">${placed} / ${d.pairs.length} matched${sel != null ? ` · now tap the meaning of <b>${esc(d.pairs[sel].w)}</b>` : ""}</p>`}</div>
      ${done ? "" : `<div class="tc-row tc-actions">
        ${A.chk ? `<button class="btn primary" type="button" data-mretry>↻ Try again</button>` : `<button class="btn primary" type="button" data-mcheck ${placed < d.pairs.length ? "disabled" : ""}>Check answers</button>`}
        ${placed && !A.chk ? `<button class="btn small ghost" type="button" data-mclear>Clear</button>` : ""}
        ${ctx.teacher ? `<button class="btn small ghost" type="button" data-mreveal>Reveal answers</button>` : ""}</div>`}
      <div id="mdone">${done ? doneHTML() : ""}</div>`;
    ctx.setCTA({ label: done ? "The Timeline Puzzle →" : "Continue" });
    if (done){ chatOnce($("#mo", el), les, d.outro, A, "outroSeen", { ping:fresh }); if (fresh) scrollTo($("#mdone", el), "center"); }
    fresh = false;
  };
  const assign = (i, j) => {
    if (A.chk) return;
    const prev = usedBy(j); if (prev != null) delete A.pair[prev];
    A.pair[i] = j; sel = null; msg = null; save(); Snd.pop(); draw();
    const next = d.pairs.findIndex((p, k) => A.pair[k] == null); if (next >= 0){ const b = $(`[data-ml="${next}"]`, el); if (b) b.focus({ preventScroll:true }); }
  };
  const finish = () => { A.solved = true; fresh = true; d.pairs.forEach(p => S.wordResult(p.w, !A.revealed)); unlock(ctx, "lifemap"); save(); draw(); };
  el.onclick = e => {
    const l = e.target.closest("[data-ml]");
    if (l){ const i = +l.dataset.ml; if (A.pair[i] != null && sel !== i && !A.chk){ delete A.pair[i]; save(); } sel = sel === i ? null : i; msg = null; draw(); const f = $(`[data-ml="${i}"]`, el); if (f) f.focus({ preventScroll:true }); return; }
    const r = e.target.closest("[data-mr]");
    if (r){ if (sel == null){ msg = { c:"info", t:"First tap an expression on the left." }; draw(); return; } assign(sel, +r.dataset.mr); return; }
    if (e.target.closest("[data-mcheck]")){
      A.chk = true; A.tries = (A.tries || 0) + 1; const n = right();
      if (n === d.pairs.length){ finish(); return; }
      const bad = d.pairs.findIndex((p, i) => A.pair[i] != null && A.pair[i] !== i);
      msg = { c:"amber", t:`${n} / ${d.pairs.length} correct. Not quite — look at the red ones. ${bad >= 0 && d.pairs[bad].h ? "Hint: " + esc(d.pairs[bad].h) : ""}` };
      save(); draw(); return;
    }
    if (e.target.closest("[data-mretry]")){ d.pairs.forEach((p, i) => { if (A.pair[i] !== i) delete A.pair[i]; }); A.chk = false; msg = null; save(); draw(); return; }
    if (e.target.closest("[data-mclear]")){ A.pair = {}; sel = null; msg = null; save(); draw(); return; }
    if (e.target.closest("[data-mreveal]")){ d.pairs.forEach((p, i) => A.pair[i] = i); A.chk = true; A.revealed = true; finish(); }
  };
  el.ondragstart = e => { const l = e.target.closest && e.target.closest("[data-ml]"); if (l){ try { e.dataTransfer.setData("text/plain", l.dataset.ml); e.dataTransfer.effectAllowed = "move"; } catch(err){} l.classList.add("dragging"); } };
  el.ondragend = () => $$(".dragging,.over", el).forEach(x => x.classList.remove("dragging", "over"));
  el.ondragover = e => { const r = e.target.closest && e.target.closest("[data-mr]"); if (r && !r.disabled){ e.preventDefault(); r.classList.add("over"); } };
  el.ondragleave = e => { const r = e.target.closest && e.target.closest("[data-mr]"); if (r && !r.contains(e.relatedTarget)) r.classList.remove("over"); };
  el.ondrop = e => { const r = e.target.closest && e.target.closest("[data-mr]"); if (!r) return; e.preventDefault(); let i = ""; try { i = e.dataTransfer.getData("text/plain"); } catch(err){} if (i !== "") assign(+i, +r.dataset.mr); };
  draw();
}, { label: () => "Match the Meaning" });

/* ============================================================
   CHAPTER 4 · tcOrder — частина A: 6 подій у можливому порядку (перетягни / стрілки / ⇄)
   data: { part:{order,start,note}, intro }
   ============================================================ */
define("tcOrder", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, part = d.part, B = store(ctx, scr, "a");
  const ids = part.order;
  if (!Array.isArray(B.order) || B.order.length !== ids.length || ids.some(x => !B.order.includes(x))) B.order = (part.start || derange(ids)).slice();
  B.tries = B.tries || 0;
  let sel = null, msg = null, fresh = false;
  const ev = id => les.life.find(x => x.id === id);
  const right = () => B.order.filter((id, i) => id === ids[i]).length;
  const draw = () => {
    const solved = !!B.solved;
    el.innerHTML = `${head(ctx, "The Timeline Puzzle", d.intro, { kicker:"Chapter 4 · Part A · Typical life stages", ua:"Допоможи Маркові розкласти події в можливому порядку." })}
      <div class="tc-tlbox ${solved ? "solved" : ""}">
        <div class="tc-tl-ends" aria-hidden="true"><span>Earliest</span><span>Latest</span></div>
        <ol class="tc-tl" aria-label="Timeline, from earliest to latest">${B.order.map((id, i) => { const x = ev(id); const st = B.chk && !solved ? (id === ids[i] ? "ok" : "no") : "";
          return `<li class="tc-tlc ${sel === id ? "sel" : ""} ${st}" data-tc="${id}" draggable="${solved ? "false" : "true"}" style="--i:${i}">
            <span class="tc-tl-n">${i + 1}</span><span class="tc-ev-i z-${x.zone}">${icon(x.icon)}</span><b>${esc(x.w)}</b>
            ${solved ? "" : `<span class="tc-mv-row"><button class="tc-mv" type="button" data-mv="${id}:-1" ${i === 0 ? "disabled" : ""} aria-label="Move “${esc(x.w)}” earlier">←</button><button class="tc-mv" type="button" data-pick="${id}" aria-pressed="${sel === id}" aria-label="${sel === id ? "Selected — tap another card to swap" : "Select “" + esc(x.w) + "” to swap"}">⇄</button><button class="tc-mv" type="button" data-mv="${id}:1" ${i === ids.length - 1 ? "disabled" : ""} aria-label="Move “${esc(x.w)}” later">→</button></span>`}
          </li>`; }).join("")}</ol>
      </div>
      <div aria-live="polite">${solved ? `<div class="tc-restored ${fresh ? "pop" : ""}"><span class="tc-stamp">${icon("check")} Timeline rebuilt</span><p>${esc(part.note)}</p></div>` : msg ? `<div class="note ${msg.c}">${msg.t}</div>` : `<p class="tc-tip">Drag a card, use the arrows, or tap ⇄ on two cards to swap them.</p>`}</div>
      ${solved ? "" : `<div class="tc-row tc-actions"><button class="btn primary" type="button" data-ocheck>Check the order</button><button class="btn ghost" type="button" data-oshuffle>↺ Shuffle</button>${ctx.teacher || B.tries >= 2 ? `<button class="btn small ghost" type="button" data-oshow>Show the answer</button>` : ""}</div>`}`;
    ctx.setCTA({ label: solved ? "Part B →" : "Continue" });
    fresh = false;
  };
  const changed = () => { B.chk = false; msg = null; save(); };
  const move = (id, dir) => { const i = B.order.indexOf(id), j = i + dir; if (j < 0 || j >= B.order.length) return; [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; changed(); draw(); const b = $(`[data-mv="${id}:${dir}"]`, el) || $(`[data-pick="${id}"]`, el); if (b) b.focus({ preventScroll:true }); };
  const swap = (a, b) => { const i = B.order.indexOf(a), j = B.order.indexOf(b); [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; sel = null; changed(); Snd.pop(); draw(); };
  const solve = () => { B.solved = true; fresh = true; save(); unlock(ctx, "timeline"); draw(); };
  el.onclick = e => {
    if (B.solved) return;
    const mv = e.target.closest("[data-mv]"); if (mv){ const [id, dir] = mv.dataset.mv.split(":"); move(id, +dir); return; }
    const pk = e.target.closest("[data-pick]"); if (pk){ const id = pk.dataset.pick; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } return; }
    if (e.target.closest("[data-ocheck]")){
      B.tries++; B.chk = true;
      if (right() === ids.length){ solve(); return; }
      msg = { c:"amber", t:`${right()} of ${ids.length} cards are in a good place (green). ${B.tries === 1 ? "Think: what happens after university?" : "What do people do first — go to university or get a degree?"}` };
      save(); draw(); return;
    }
    if (e.target.closest("[data-oshow]")){ B.order = ids.slice(); B.shown = true; solve(); return; }
    if (e.target.closest("[data-oshuffle]")){ B.order = derange(ids); sel = null; changed(); draw(); return; }
    const card = e.target.closest("[data-tc]"); if (card && !e.target.closest("button")){ const id = card.dataset.tc; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } }
  };
  let dragId = null;
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-tc]"); if (!c || B.solved) return; dragId = c.dataset.tc; c.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", dragId); e.dataTransfer.effectAllowed = "move"; } catch(err){} };
  el.ondragover = e => { const c = e.target.closest && e.target.closest("[data-tc]"); if (c && dragId){ e.preventDefault(); $$(".tc-tlc.over", el).forEach(x => x !== c && x.classList.remove("over")); c.classList.add("over"); } };
  el.ondragleave = e => { const c = e.target.closest && e.target.closest("[data-tc]"); if (c && !c.contains(e.relatedTarget)) c.classList.remove("over"); };
  el.ondrop = e => { const c = e.target.closest && e.target.closest("[data-tc]"); if (!c || !dragId) return; e.preventDefault();
    const to = c.dataset.tc; if (to !== dragId){ const from = B.order.indexOf(dragId); B.order.splice(from, 1); const j = B.order.indexOf(to); B.order.splice(from <= j ? j + 1 : j, 0, dragId); changed(); Snd.pop(); }
    dragId = null; draw(); };
  el.ondragend = () => { dragId = null; $$(".tc-tlc", el).forEach(x => x.classList.remove("dragging", "over")); };
  draw();
}, { label: () => "Part A · order" });

/* ============================================================
   tcPlace — частина B: життя не має одного таймлайну. Розмісти 7 подій за етапами.
   Багато відповідей правильні; неможливе м'яко зупиняємо підказкою.
   data: { part:{events, ok:{id:[zones]}, hints:{id:{zone:text}}} }
   ============================================================ */
define("tcPlace", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, part = d.part, Pz = store(ctx, scr, "b"); Pz.at = Pz.at || {};
  const fixed = ((les.stages.find(s => s.id === "timeline") || {}).partA || {}).order || [];
  const ev = id => les.life.find(x => x.id === id);
  const OKS = ["Nice choice!", "That works!", "Good thinking!", "That's possible!"];
  let sel = null, msg = null, shake = null;
  const draw = () => {
    const bank = part.events.filter(id => !Pz.at[id]); const n = part.events.length - bank.length;
    const chip = id => { const x = ev(id); return `<button class="tc-pc ${sel === id ? "sel" : ""} ${shake === id ? "shake" : ""}" type="button" data-pc="${id}" draggable="true" aria-pressed="${sel === id}"><span class="tc-ev-i z-${x.zone}">${icon(x.icon)}</span>${esc(x.w)}</button>`; };
    el.innerHTML = `${head(ctx, "Life Doesn't Follow One Timeline", "Where could these events happen? Choose a card, then tap a life stage. Many answers are possible!", { kicker:"Chapter 4 · Part B", ua:"Де в житті можуть статися ці події? Обери картку, потім натисни на етап життя. Можливо багато відповідей!" })}
      <div class="tc-pbank ${sel ? "" : ""}" data-zone="" role="group" aria-label="Event cards">${bank.map(chip).join("") || `<span class="tc-tip">${icon("check")} All cards are on the timeline. You can still move them.</span>`}</div>
      <div class="tc-lanes">${les.zones.map(z => `<div class="tc-lane z-${z.id} ${sel ? "ready" : ""}" data-zone="${z.id}" role="button" tabindex="0" aria-label="${esc(z.t)}${sel ? " — place " + esc(ev(sel).w) + " here" : ""}">
          <header><b>${esc(z.t)}</b><small>${esc(z.age)}</small></header>
          <div class="tc-lane-in">${fixed.filter(id => ev(id).zone === z.id).map(id => `<span class="tc-fixed">${esc(ev(id).w)}</span>`).join("")}${part.events.filter(id => Pz.at[id] === z.id).map(chip).join("")}</div>
        </div>`).join("")}</div>
      <div aria-live="polite">${msg ? `<div class="note ${msg.c}">${msg.t}</div>` : `<p class="tc-tip">${n} / ${part.events.length} placed. You don't have to place every card. Grey cards come from Part A.</p>`}</div>
      <div class="tc-ask">${icon("mic")}<p><b>Ask:</b> Why there? — <i>I think people usually… / It can also happen when…</i></p></div>`;
    ctx.setCTA({ label:"Talk about it →" });
    shake = null;
  };
  const place = (id, zone) => {
    if (!zone){ delete Pz.at[id]; sel = null; msg = null; save(); draw(); return; }
    const ok = (part.ok[id] || []).includes(zone);
    if (ok){ Pz.at[id] = zone; Pz.n = (Pz.n || 0) + 1; msg = { c:"good", t:`✓ ${OKS[Pz.n % OKS.length]} <b>${esc(ev(id).w)}</b> — ${esc(les.zones.find(z => z.id === zone).t.toLowerCase())}.` }; Snd.pop(); }
    else { msg = { c:"amber", t: esc(((part.hints || {})[id] || {})[zone] || "Hmm — is that possible? Try another place.") }; shake = id; }
    sel = ok ? null : id; save(); draw();
  };
  el.onclick = e => {
    const c = e.target.closest("[data-pc]"); if (c){ sel = sel === c.dataset.pc ? null : c.dataset.pc; msg = null; draw(); const f = $(`[data-pc="${c.dataset.pc}"]`, el); if (f) f.focus({ preventScroll:true }); return; }
    const z = e.target.closest("[data-zone]"); if (z && sel) place(sel, z.dataset.zone || null);
  };
  el.onkeydown = e => { const z = e.target.closest && e.target.closest(".tc-lane[data-zone]"); if (z && sel && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); place(sel, z.dataset.zone); } };
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-pc]"); if (c){ try { e.dataTransfer.setData("text/plain", c.dataset.pc); } catch(err){} } };
  el.ondragover = e => { const z = e.target.closest && e.target.closest("[data-zone]"); if (z){ e.preventDefault(); z.classList.add("over"); } };
  el.ondragleave = e => { const z = e.target.closest && e.target.closest("[data-zone]"); if (z && !z.contains(e.relatedTarget)) z.classList.remove("over"); };
  el.ondrop = e => { const z = e.target.closest && e.target.closest("[data-zone]"); if (!z) return; e.preventDefault(); let id = ""; try { id = e.dataTransfer.getData("text/plain"); } catch(err){} if (id && part.events.includes(id)) place(id, z.dataset.zone || null); };
  draw();
}, { label: () => "Part B · place" });

/* ============================================================
   tcTalk — усні питання по одному (+ необов'язковий чат Марка наприкінці)
   data: { qs:[{q,ua,starter,ex,fu}], title, intro, kicker, outro?, cta }
   ============================================================ */
define("tcTalk", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "talk"); const n = d.qs.length;
  A.i = Math.min(A.i || 0, n - 1);
  const outroBox = () => d.outro ? `<div id="out">${A.outroSeen ? `<div class="tc-phone slim"><div class="tc-thread">${chatHTML(les, d.outro)}</div></div>` : ""}</div>` : "";
  const showOutro = () => { const box = $("#out", el); if (!box || A.outroSeen) return; box.innerHTML = `<div class="tc-phone slim"><div class="tc-thread" id="ot" aria-live="polite"></div></div>`; scrollTo(box, "center"); chatOnce($("#ot", el), les, d.outro, A, "outroSeen", { ping:true, delay:600 }); setCTA(true); };
  const setCTA = shown => { if (d.outro && !A.outroSeen && !shown) ctx.setCTA({ label: d.cta || "Continue", action: showOutro }); else ctx.setCTA({ label: d.cta || "Continue" }); };
  const draw = () => {
    const i = A.i, q = d.qs[i];
    el.innerHTML = `${head(ctx, d.title, d.intro, { kicker:"Chapter " + ctx.scr.stage.n + " · " + (d.kicker || "Speaking") })}
      <div class="card tc-talk">
        <div class="tc-qtop"><span>Question ${i + 1} of ${n}</span><span class="tc-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</span></div>
        ${qBlock(ctx, (d.store || "t") + i, q)}
        <p class="tc-oral">${icon("mic")} Answer out loud — your teacher is listening.</p>
        <div class="tc-row tc-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>
      ${outroBox()}`;
    setCTA();
  };
  el.onclick = e => {
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); OPEN.clear(); save(); draw(); if (A.i === n - 1 && d.outro && !A.outroSeen) later(showOutro, 900); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); OPEN.clear(); save(); draw(); }
  };
  draw();
}, { label: d => d.kicker || "Speaking" });

/* ============================================================
   tcLetter — лист тата 1998 року: розгорни, натискай на підсвічені вирази; прогнози; відповідь Марка
   data: { letter:{k,date,to,lines,sign,signNote,ps}, predict:[{q,ua,ex}], starters:[..], reply:[msgs] }
   ============================================================ */
define("tcLetter", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, L = d.letter, A = store(ctx, scr, "letter");
  let fresh = false;
  const findEv = p => les.life.find(x => { try { return new RegExp(x.re, "i").test(p); } catch(e){ return false; } });
  const line = s => esc(s).replace(/\[([^\]]+)\]/g, (_, p) => { const x = findEv(p); return `<button class="tc-hl ${A.tip === p ? "on" : ""}" type="button" data-hl="${p}" ${x ? `data-ev="${x.id}"` : ""} aria-pressed="${A.tip === p}">${p}</button>`; });
  const fullText = [L.to].concat(L.lines.map(plain), ["— " + L.sign, L.ps]).join(" ");
  const tip = () => { if (!A.tip) return `<p class="tc-tip">${icon("marker")} The highlighted phrases are from the Life Map. Tap one.</p>`; const x = findEv(A.tip); if (!x) return "";
    return `<div class="tc-ltip ix-reveal"><b>${esc(A.tip)}</b> → <i>${esc(x.w)}</i> — ${esc(x.en)} <span class="tc-ltip-ua">🇺🇦 ${esc(x.ua)}</span>${say(x.w)}</div>`; };
  const draw = () => {
    const open = !!A.open;
    el.innerHTML = `${head(ctx, open ? L.k : "A Letter from 1998", open ? "" : "The pages are in order now. Open Dad's letter.", { kicker:"Chapter 4 · Story reveal", ua:"Сторінки знову в правильному порядку. Відкрий лист тата." })}
      ${open ? `<div class="tc-letterwrap">
          <article class="tc-paper ${fresh ? "unfold" : ""}" aria-label="Dad's letter from 1998">
            <span class="tc-paper-date">${esc(L.date)}</span>
            <p class="tc-paper-to">${esc(L.to)}</p>
            ${L.lines.map(s => `<p>${line(s)}</p>`).join("")}
            <p class="tc-paper-sign">— ${esc(L.sign)}<small>${esc(L.signNote)}</small></p>
            <p class="tc-paper-ps">${esc(L.ps)}</p>
            <span class="tc-paper-fold" aria-hidden="true"></span>
          </article>
          <div class="tc-row tc-under">${say(fullText, "Listen to Dad's letter")}<span class="muted">Listen to the letter</span></div>
          <div id="tip" aria-live="polite">${tip()}</div>
        </div>
        <div class="card tc-predict">
          <h3 class="tc-h">${icon("mic")} What do you think?</h3>
          ${d.predict.map((q, k) => qBlock(ctx, "lp" + k, q)).join("")}
          <p class="tc-starters">${d.starters.map(s => `<span class="tc-starter-chip">${esc(s)}</span>`).join("")}</p>
        </div>
        <div id="out">${A.replied ? `<div class="tc-phone slim"><div class="tc-thread">${chatHTML(les, d.reply)}</div></div>` : ""}</div>`
      : `<button class="tc-folded" type="button" data-unfold aria-label="Open Dad's letter from 1998">
          <span class="tc-folded-top" aria-hidden="true"></span><span class="tc-folded-bottom" aria-hidden="true"></span>
          <span class="tc-folded-y">1998</span><span class="tc-folded-t">Tap to open the letter</span>
        </button>`}`;
    if (!open) ctx.setCTA({ label:"Open the letter ✉️", action: unfold });
    else if (!A.replied) ctx.setCTA({ label:"Tell Marko what you think →", action: reply });
    else ctx.setCTA({ label:"Two generations →" });
    fresh = false;
  };
  const unfold = () => { A.open = true; fresh = true; save(); Snd.paper(); draw(); scrollTo($(".tc-paper", el), "start"); };
  const reply = () => { A.replied = true; save(); const box = $("#out", el); box.innerHTML = `<div class="tc-phone slim"><div class="tc-thread" id="ot" aria-live="polite"></div></div>`; scrollTo(box, "center"); Snd.ping(); if (anim()) playChat($("#ot", el), les, d.reply, { delay:500 }); else $("#ot", el).innerHTML = chatHTML(les, d.reply); ctx.setCTA({ label:"Two generations →" }); };
  el.onclick = e => {
    if (e.target.closest("[data-unfold]")){ unfold(); return; }
    const h = e.target.closest("[data-hl]"); if (h){ A.tip = A.tip === h.dataset.hl ? null : h.dataset.hl; save(); $$("[data-hl]", el).forEach(b => { const on = b.dataset.hl === A.tip; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); $("#tip", el).innerHTML = tip(); }
  };
  draw();
}, { label: () => "Dad's letter" });

/* ============================================================
   CHAPTER 5 · tcSplit — 1998 | 2026: кімнати з точками-підписами + питання до читання
   data: { headline, sub, qs:[{q,ua,starter,ex,fu}] }
   Картинка й точки — les.media.rooms { src, alt, hot:[{x,y,t,yr}] }; без неї — намальовані кімнати (HOT нижче)
   ============================================================ */
const HOT = {
  y98:[{ x:24, y:40, t:"a huge computer" }, { x:48, y:50, t:"a home phone" }, { x:74, y:54, t:"CDs" }, { x:88, y:60, t:"cassette tapes" }, { x:75, y:20, t:"printed photos" }],
  y26:[{ x:32, y:47, t:"a laptop" }, { x:56, y:52, t:"a smartphone" }, { x:75, y:24, t:"social media" }, { x:25, y:24, t:"music streaming" }, { x:86, y:57, t:"wireless headphones" }]
};
function room98(){
  return `<svg class="tc-room" viewBox="0 0 400 300" role="img" aria-label="A teenager's bedroom in 1998: a big old computer, a home phone, CDs, cassette tapes and printed photos" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="r98w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3A22"/><stop offset="1" stop-color="#2E1D12"/></linearGradient>
      <radialGradient id="r98l" cx=".72" cy=".2" r=".7"><stop offset="0" stop-color="#FFC56B" stop-opacity=".55"/><stop offset="1" stop-color="#FFC56B" stop-opacity="0"/></radialGradient>
      <pattern id="r98p" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#7A3B2E"/><path d="M0 8h16M8 0v16" stroke="#C9844A" stroke-width="2" opacity=".55"/></pattern></defs>
    <rect width="400" height="300" fill="url(#r98w)"/>
    <rect x="232" y="22" width="120" height="86" rx="4" fill="#3A2A20" stroke="#8A6040" stroke-width="3"/><rect x="238" y="28" width="108" height="74" fill="#F2A65A" opacity=".55"/><path d="M292 28v74M238 65h108" stroke="#8A6040" stroke-width="3"/>
    <rect x="30" y="26" width="64" height="86" rx="3" fill="#B03A48"/><text x="62" y="58" text-anchor="middle" font-family="'Special Elite',monospace" font-size="13" fill="#FFE8B0">LIVE</text><text x="62" y="76" text-anchor="middle" font-family="'Special Elite',monospace" font-size="9" fill="#FFE8B0">CITY SOUND</text><circle cx="62" cy="94" r="8" fill="none" stroke="#FFE8B0" stroke-width="2"/>
    <g transform="translate(270,52) rotate(-6)"><rect width="34" height="40" fill="#F5EBDC"/><rect x="3" y="3" width="28" height="26" fill="#6E4A5E"/></g>
    <g transform="translate(300,58) rotate(7)"><rect width="34" height="40" fill="#F5EBDC"/><rect x="3" y="3" width="28" height="26" fill="#4A6E74"/></g>
    <g transform="translate(286,24) rotate(2)"><rect width="30" height="36" fill="#F5EBDC"/><rect x="3" y="3" width="24" height="22" fill="#9A6A3E"/></g>
    <rect x="0" y="196" width="400" height="104" fill="#24170E"/>
    <rect x="12" y="160" width="250" height="14" rx="3" fill="#8A5A34"/><rect x="24" y="174" width="12" height="90" fill="#6E4628"/><rect x="236" y="174" width="12" height="90" fill="#6E4628"/>
    <rect x="44" y="82" width="104" height="80" rx="8" fill="#D8CFB8"/><rect x="54" y="92" width="84" height="58" rx="6" fill="#16301F"/>
    <path d="M62 104h40M62 114h56M62 124h30M62 134h46" stroke="#5BE38A" stroke-width="3" opacity=".8"/><rect x="72" y="160" width="48" height="6" fill="#BFB59C"/>
    <rect x="40" y="166" width="96" height="10" rx="2" fill="#E6DECA"/>
    <g transform="translate(170,140)"><rect width="46" height="22" rx="6" fill="#B23A3A"/><path d="M4 2q19-16 38 0" fill="none" stroke="#B23A3A" stroke-width="8" stroke-linecap="round"/><circle cx="23" cy="12" r="5" fill="#E9E2CF"/></g>
    <rect x="276" y="128" width="40" height="70" rx="3" fill="#3C3C46"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="280" y="${132 + i * 10}" width="32" height="7" fill="${["#E9C46A", "#E76F51", "#2A9D8F", "#F4A261", "#8AB17D", "#E5989B"][i]}"/>`).join("")}
    <g transform="translate(330,170)"><rect width="46" height="30" rx="3" fill="#2B2420"/><rect x="5" y="4" width="36" height="13" fill="#F5F0E7"/><circle cx="15" cy="23" r="4" fill="none" stroke="#C9BDA8" stroke-width="2"/><circle cx="31" cy="23" r="4" fill="none" stroke="#C9BDA8" stroke-width="2"/></g>
    <g transform="translate(336,152) rotate(-8)"><rect width="46" height="30" rx="3" fill="#2B2420"/><rect x="5" y="4" width="36" height="13" fill="#F7C873"/></g>
    <rect x="200" y="230" width="200" height="70" fill="url(#r98p)"/><rect x="200" y="222" width="200" height="12" fill="#E9E2CF"/>
    <rect width="400" height="300" fill="url(#r98l)"/>
  </svg>`;
}
function room26(){
  return `<svg class="tc-room" viewBox="0 0 400 300" role="img" aria-label="A teenager's bedroom in 2026: a laptop, a smartphone with notifications, music streaming and wireless headphones" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="r26w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1748"/><stop offset="1" stop-color="#0D0F2A"/></linearGradient>
      <linearGradient id="r26led" x1="0" x2="1"><stop offset="0" stop-color="#9775FA"/><stop offset=".5" stop-color="#4DABF7"/><stop offset="1" stop-color="#E599F7"/></linearGradient>
      <radialGradient id="r26g" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#7950F2" stop-opacity=".45"/><stop offset="1" stop-color="#7950F2" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="300" fill="url(#r26w)"/><rect width="400" height="160" fill="url(#r26g)"/>
    <rect x="0" y="10" width="400" height="4" fill="url(#r26led)"/><rect x="0" y="12" width="400" height="22" fill="url(#r26led)" opacity=".14"/>
    <g transform="translate(40,42)"><rect width="122" height="62" rx="10" fill="#151A3D" stroke="#4C5BD4" stroke-width="1.5"/><circle cx="22" cy="31" r="13" fill="#7950F2"/><path d="M18 24l10 7-10 7z" fill="#fff"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${44 + i * 8}" y="${40 - (i * 7 % 22)}" width="5" height="${8 + (i * 7 % 22)}" rx="2" fill="#74C0FC"/>`).join("")}</g>
    <g transform="translate(250,40)"><rect width="104" height="30" rx="15" fill="#E64980"/><text x="52" y="20" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="12" fill="#fff">♥ 128 likes</text></g>
    <g transform="translate(266,80)"><rect width="88" height="26" rx="13" fill="#4DABF7"/><text x="44" y="17" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="11" fill="#fff">+12 messages</text></g>
    <rect x="0" y="196" width="400" height="104" fill="#0A0B20"/>
    <rect x="20" y="168" width="290" height="10" rx="3" fill="#2B2F5A"/><rect x="34" y="178" width="8" height="80" fill="#22264C"/><rect x="286" y="178" width="8" height="80" fill="#22264C"/>
    <path d="M70 168l12-56h96l12 56z" fill="#2A2F5F"/><rect x="84" y="118" width="88" height="44" rx="3" fill="#0F1433"/>
    <rect x="90" y="124" width="36" height="16" rx="2" fill="#E599F7" opacity=".85"/><rect x="130" y="124" width="36" height="16" rx="2" fill="#4DABF7" opacity=".85"/><rect x="90" y="144" width="36" height="12" rx="2" fill="#69DB7C" opacity=".75"/><rect x="130" y="144" width="36" height="12" rx="2" fill="#FFD43B" opacity=".75"/>
    <g transform="translate(212,132) rotate(-10)"><rect width="26" height="46" rx="5" fill="#111" stroke="#9775FA" stroke-width="2"/><rect x="3" y="6" width="20" height="32" rx="2" fill="#5F3DC4"/><circle cx="13" cy="42" r="1.6" fill="#9775FA"/></g>
    <circle cx="246" cy="128" r="8" fill="#FA5252"/><text x="246" y="132" text-anchor="middle" font-family="Manrope,sans-serif" font-size="10" font-weight="800" fill="#fff">9</text>
    <g transform="translate(320,150)"><path d="M6 22a18 18 0 0 1 36 0" fill="none" stroke="#DEE2E6" stroke-width="6" stroke-linecap="round"/><rect x="0" y="18" width="12" height="20" rx="5" fill="#DEE2E6"/><rect x="36" y="18" width="12" height="20" rx="5" fill="#DEE2E6"/></g>
    <rect x="352" y="120" width="22" height="48" rx="4" fill="#2B8A3E" opacity=".9"/><path d="M363 120q-14-22 0-36q14 14 0 36" fill="#40C057"/>
    <rect x="200" y="226" width="200" height="74" fill="#3B3F6B"/><rect x="200" y="218" width="200" height="12" fill="#C5CAE9"/>
  </svg>`;
}
define("tcSplit", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "pre"); A.hot = A.hot || {};
  const R = media(les, "rooms");
  let photoOK = !!(R && R.src && R.hot && R.hot.length);
  const dot = (key, h, cls) => { const on = !!A.hot[key]; return `<button class="tc-hot ${cls || ""} s-${h.s || (h.x > 70 ? "l" : "r")} ${on ? "on" : ""}" type="button" data-hot="${key}" style="left:${h.x}%;top:${h.y}%" aria-pressed="${on}" aria-label="${esc(h.t)}"><i aria-hidden="true"></i><span>${esc(h.t)}</span></button>`; };
  /* одна реалістична картинка: підписи 1998 / 2026 і «VS» уже на ній */
  const photo = () => `<figure class="tc-gen tc-photo"><div class="tc-photo-scroll"><div class="tc-photo-in">
      <img src="${esc(R.src)}" alt="${esc(R.alt || "")}" decoding="async" id="rooms">
      ${R.hot.map((h, i) => dot("p" + i, h, h.yr === "26" ? "y26" : "y98")).join("")}
    </div></div></figure>`;
  /* запасний варіант: дві намальовані кімнати */
  const side = (k, year, label) => { const src = media(les, k === "y98" ? "room1998" : "room2026");
    return `<figure class="tc-side ${k}">
      <div class="tc-scene">${pic(src, label, k === "y98" ? room98() : room26(), "room")}<span class="tc-year">${year}</span>
        ${HOT[k].map((h, i) => dot(k + i, h, k)).join("")}
      </div>
      <figcaption>${label}</figcaption></figure>`; };
  const drawn = () => `<div class="tc-gen">${side("y98", "1998", "Dan's bedroom · 1998")}<span class="tc-vs" aria-hidden="true">vs</span>${side("y26", "2026", "Marko's bedroom · 2026")}</div>`;
  const keys = () => photoOK ? R.hot.map((h, i) => "p" + i) : ["y98", "y26"].flatMap(k => HOT[k].map((h, i) => k + i));
  const count = () => { const ks = keys(); return `${ks.filter(k => A.hot[k]).length} / ${ks.length}`; };
  const draw = () => {
    el.innerHTML = `${bar(ctx)}
      <header class="tc-gen-head">
        <p class="tc-kicker">Chapter 5 · Reading</p>
        <h2 class="stitle tc-gen-title" id="stitle" tabindex="-1">${esc(d.headline)}</h2>
        <p class="tc-gen-sub">${esc(d.sub)}</p>
      </header>
      ${photoOK ? photo() : drawn()}
      <div class="tc-row tc-hotbar"><p class="tc-tip">${icon("eye")} Tap the dots to find things from each year. Which things are in both rooms?${photoOK ? `<span class="tc-swipe">Swipe the picture to see both rooms.</span>` : ""}</p><span class="spacer"></span><span class="pill" id="hc">Found ${count()}</span>${ctx.teacher ? `<button class="btn small ghost" type="button" data-hotall>Show all labels</button>` : ""}</div>
      <h3 class="tc-h">Before you read</h3>
      <div class="tc-pre">${d.qs.map((q, k) => `<div class="card">${qBlock(ctx, "pre" + k, q)}</div>`).join("")}</div>`;
    const img = $("#rooms", el);
    if (img) img.onerror = () => { photoOK = false; draw(); };
    ctx.setCTA({ label:"Read the two stories →" });
  };
  el.onclick = e => {
    const h = e.target.closest("[data-hot]");
    if (h){ const k = h.dataset.hot; A.hot[k] = !A.hot[k]; save(); h.classList.toggle("on", A.hot[k]); h.setAttribute("aria-pressed", String(A.hot[k])); if (A.hot[k]) Snd.pop(); const c = $("#hc", el); if (c) c.textContent = "Found " + count(); return; }
    if (e.target.closest("[data-hotall]")){ const ks = keys(); const all = ks.every(k => A.hot[k]); ks.forEach(k => A.hot[k] = !all); save(); draw(); }
  };
  draw();
}, { label: () => "1998 vs 2026" });

/* ============================================================
   tcRead — два тексти (вкладки), підсвічування речень, 6 слів у контексті, переклад фраз
   data: { texts:[{id,who,year,t,sub,paras,gloss}] }   — використовує les.focus
   ============================================================ */
const FW = /\b(tiny|huge|awful|unbelievable|exhausted|relaxed)\b/gi;
const splitS = p => (p.match(/[^.!?]+[.!?]+["”’)]*\s*/g) || [p]).map(s => s.trim()).filter(Boolean);
function textHTML(t, R, o){
  o = o || {};
  return t.paras.map((p, pi) => `<p>${splitS(p).map((s, si) => {
    const key = t.id + "-" + pi + "-" + si; const on = !!(R.hl || {})[key];
    const inner = esc(s).replace(FW, m => o.mark ? `<mark class="tc-fwm">${m}</mark>` : o.static ? `<mark class="tc-fwm">${m}</mark>` : `<button class="tc-fw ${R.word === m.toLowerCase() ? "on" : ""}" type="button" data-fw="${m.toLowerCase()}">${m}</button>`);
    return o.mark ? `<span class="tc-s ${on ? "hl" : ""}" role="button" tabindex="0" data-s="${key}" aria-pressed="${on}">${inner}</span> ` : `<span class="tc-s ${on ? "hl" : ""}">${inner}</span> `;
  }).join("")}</p>`).join("");
}
define("tcRead", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, R = store(ctx, scr, "read"); R.hl = R.hl || {}; R.seen = R.seen || {};
  if (!d.texts.some(t => t.id === R.tab)) R.tab = d.texts[0].id;
  const draw = () => {
    const t = d.texts.find(x => x.id === R.tab); const nHl = Object.keys(R.hl).filter(k => R.hl[k]).length;
    const w = les.focus.find(x => x.w === R.word);
    el.innerHTML = `${head(ctx, "Two Generations, Two Stories", "Read both stories. Tap the yellow words. Turn on the highlighter to mark important sentences.", { kicker:"Chapter 5 · Reading", ua:"Прочитай обидві історії. Натискай на жовті слова. Увімкни маркер, щоб підсвітити важливі речення." })}
      <div class="tc-tabs" role="tablist" aria-label="Texts">${d.texts.map(x => `<button class="tc-tab y${x.year} ${x.id === R.tab ? "on" : ""}" type="button" role="tab" aria-selected="${x.id === R.tab}" data-tab="${x.id}">${face(les, x.who)}<span><b>${esc(x.t)}</b><small>${esc(x.year)} · ${esc(x.sub)}</small></span>${R.seen[x.id] ? `<span class="tc-tab-ok" aria-label="read">✓</span>` : ""}</button>`).join("")}</div>
      <div class="tc-readgrid">
        <article class="tc-text y${t.year} ${R.mark ? "marking" : ""}" role="tabpanel" aria-label="${esc(t.t)}, ${esc(t.year)}">
          <header class="tc-text-head"><span class="tc-year sm">${esc(t.year)}</span><b>${esc(t.t)}</b><span class="spacer"></span>${say(t.paras.join(" "), "Listen to the text")}</header>
          <div class="tc-text-body">${textHTML(t, R, { mark:R.mark })}</div>
          <footer class="tc-text-foot">${uaBtn("gl-" + t.id, "Difficult phrases")}${foldBox("gl-" + t.id, `<ul class="tc-gloss">${t.gloss.map(g => `<li><b>${esc(g[0])}</b> — ${esc(g[1])}</li>`).join("")}</ul>`, "tc-ua")}</footer>
        </article>
        <aside class="tc-readside">
          <button class="tc-marker ${R.mark ? "on" : ""}" type="button" data-mark aria-pressed="${!!R.mark}">${icon("marker")}<span>${R.mark ? "Highlighter on — tap sentences" : "Highlighter"}</span><b>${nHl}</b></button>
          <div class="card tc-wbox" aria-live="polite">${w ? `<div class="tc-wdef ix-reveal"><div class="tc-row"><h3>${esc(w.w)}</h3>${say(w.w + ". " + w.ex)}</div><p>= ${esc(w.en)}</p><p class="tc-wdef-ua">🇺🇦 ${esc(w.ua)}</p><p class="tc-wdef-ex">“${esc(w.ex)}”</p></div>` : `<p class="muted">${icon("info")} Tap a <mark class="tc-fwm">yellow word</mark> in the text.</p>`}</div>
          <div class="card tc-wlist"><h3 class="tc-h">Words in context</h3><ul>${les.focus.map(x => `<li><button class="tc-wli ${R.word === x.w ? "on" : ""} ${R.wseen && R.wseen[x.w] ? "seen" : ""}" type="button" data-fw="${x.w}">${esc(x.w)}<small>${esc(x.en)}</small></button></li>`).join("")}</ul>
            <button class="btn small" type="button" data-addfw>+ Add 6 words to My words</button></div>
        </aside>
      </div>`;
    R.seen[t.id] = true; save();
    ctx.setCTA({ label:"Answer the questions →" });
  };
  const toggleS = k => { R.hl[k] = !R.hl[k]; save(); const s = $(`[data-s="${k}"]`, el); if (s){ s.classList.toggle("hl", R.hl[k]); s.setAttribute("aria-pressed", String(R.hl[k])); } const b = $(".tc-marker b", el); if (b) b.textContent = Object.keys(R.hl).filter(x => R.hl[x]).length; };
  el.onclick = e => {
    const tb = e.target.closest("[data-tab]"); if (tb){ R.tab = tb.dataset.tab; R.word = null; save(); draw(); const nb = $(`[data-tab="${R.tab}"]`, el); if (nb) nb.focus({ preventScroll:true }); return; }
    if (e.target.closest("[data-mark]")){ R.mark = !R.mark; save(); draw(); return; }
    const s = e.target.closest("[data-s]"); if (s){ toggleS(s.dataset.s); return; }
    const f = e.target.closest("[data-fw]"); if (f){ R.word = f.dataset.fw; R.wseen = R.wseen || {}; R.wseen[R.word] = true; save(); draw(); if (window.innerWidth < 900) scrollTo($(".tc-wbox", el), "center"); return; }
    if (e.target.closest("[data-addfw]")){ les.focus.forEach(x => S.addWord(x.w)); toast("6 words added to My words"); }
  };
  el.onkeydown = e => { const s = e.target.closest && e.target.closest("[data-s]"); if (s && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); toggleS(s.dataset.s); } };
  draw();
}, { label: () => "Two texts" });

/* ============================================================
   tcComp — 4 питання до текстів (3 варіанти), тексти можна відкрити поруч
   data: { qs:[{q,o,a,hint,why,ua}], texts }
   ============================================================ */
define("tcComp", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "comp"); A.r = A.r || {};
  const draw = () => {
    const all = d.qs.every((q, i) => mcqDone(A.r[i])); const first = d.qs.filter((q, i) => A.r[i] && A.r[i].first).length;
    el.innerHTML = `${head(ctx, "Read and Answer", "Choose the best answer. If you're not sure, open the texts.", { kicker:"Chapter 5 · Reading comprehension", ua:"Обери найкращу відповідь. Якщо не впевнений / не впевнена — відкрий тексти." })}
      <div class="tc-row tc-tools">${foldBtn("txts", `${icon("book")} Back to the texts`)}</div>
      ${foldBox("txts", `<div class="tc-mini-texts">${d.texts.map(t => `<div class="tc-text y${t.year} mini"><header class="tc-text-head"><span class="tc-year sm">${esc(t.year)}</span><b>${esc(t.t)}</b></header><div class="tc-text-body">${textHTML(t, (ctx.all.reading && ctx.all.reading.read) || {}, { static:true })}</div></div>`).join("")}</div>`)}
      <div class="tc-comps">${d.qs.map((q, i) => `<div class="card">${mcqHTML("c" + i, q, A.r[i] = A.r[i] || {}, { num:i + 1, n:i, teacher:ctx.teacher })}</div>`).join("")}</div>
      ${all ? `<div class="tc-score ix-reveal"><b>${first} / ${d.qs.length}</b><span>correct on the first try</span></div>` : ""}`;
    ctx.setCTA({ label:"Let's talk →" });
  };
  el.onclick = e => {
    const id = mcqClick(e, k => { const i = +String(k).slice(1); return d.qs[i] ? { q:d.qs[i], R:A.r[i] = A.r[i] || {} } : null; });
    if (id !== false){ const i = +String(id).slice(1); if (A.r[i].ok) Snd.pop(); draw(); const n = $(`[data-qid="${id}"]`, el); if (n) scrollTo(n); }
  };
  draw();
}, { label: () => "4 questions" });

/* ============================================================
   CHAPTER 6 · tcWorld — листівки з 5 країн: ситуація + питання; бали; WORLD EXPLORER
   data: { items:[{id,country,city,who,tone,t,q,o,a,hint,why}], sub, bonus:[q] }
   ============================================================ */
define("tcWorld", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, W = store(ctx, scr, "world"); W.r = W.r || {};
  const n = d.items.length; if (W.i == null) W.i = 0;
  let fresh = false;
  const pts = () => d.items.filter(x => W.r[x.id] && W.r[x.id].first).length;
  const allDone = () => d.items.every(x => mcqDone(W.r[x.id]));
  const stamps = () => `<ol class="tc-stamps" aria-label="Challenges">${d.items.map((x, k) => { const R = W.r[x.id]; const st = R && R.first ? "pt" : mcqDone(R) ? "done" : "";
    return `<li><button class="tc-stampbtn ${k === W.i ? "on" : ""} ${st}" type="button" data-wgo="${k}" style="--tone:${x.tone}" aria-current="${k === W.i}" aria-label="Challenge ${k + 1}: ${esc(x.country)}${st ? ", done" : ""}"><span>${esc(x.country)}</span>${st === "pt" ? "★" : st === "done" ? "✓" : k + 1}</button></li>`; }).join("")}
    <li><button class="tc-stampbtn end ${W.i >= n ? "on" : ""}" type="button" data-wgo="${n}" ${allDone() ? "" : "disabled"}>${icon("globe")}<span>Results</span></button></li></ol>`;
  const draw = () => {
    let body = "";
    if (W.i < n){
      const x = d.items[W.i], R = W.r[x.id] = W.r[x.id] || {};
      body = `<article class="tc-post ${fresh ? "flip" : ""}" style="--tone:${x.tone}">
          <div class="tc-post-front"><span class="tc-post-k">Greetings from</span><b class="tc-post-c">${esc(x.country)}</b><span class="tc-post-city">${esc(x.city)}</span>${icon("globe", "tc-post-globe")}<span class="tc-post-stamp" aria-hidden="true">${esc(x.country.slice(0, 2).toUpperCase())}</span></div>
          <div class="tc-post-back"><p class="tc-post-who">${esc(x.who)}</p><p class="tc-post-t">${esc(x.t)} ${say(x.t, "Listen to the situation")}</p>
            ${mcqHTML("w-" + x.id, x, R, { n:W.i, teacher:ctx.teacher })}
            ${mcqDone(R) ? `<div class="tc-row tc-nav"><span class="spacer"></span><button class="btn primary" type="button" data-wnext>${W.i < n - 1 ? "Next postcard →" : "See my results →"}</button></div>` : ""}</div>
        </article>`;
    } else {
      body = `<section class="tc-world-done ${fresh ? "pop" : ""}">
          <div class="tc-achbanner">${icon("globe")}<div><small>Challenge completed</small><b>WORLD EXPLORER</b></div></div>
          <p class="tc-world-pts"><b>${pts()} / ${n}</b> points (correct on the first try)</p>
          <h3 class="tc-h">Bonus questions</h3>
          <div class="tc-pre">${d.bonus.map((q, k) => `<div class="card">${qBlock(ctx, "wb" + k, q)}</div>`).join("")}</div>
        </section>`;
    }
    el.innerHTML = `${head(ctx, "The World Life Challenge", d.sub, { kicker:"Chapter 6 · Quiz", ua:"Різні країни. Різні життя. Різні рішення." })}
      <div class="tc-worldbar">${stamps()}<span class="tc-world-score" aria-live="polite">★ ${pts()} / ${n}</span></div>
      ${body}`;
    ctx.setCTA({ label: W.i >= n ? "Final mission: Dear Future Me →" : "Continue" });
    fresh = false;
  };
  el.onclick = e => {
    const g = e.target.closest("[data-wgo]"); if (g && !g.disabled){ W.i = +g.dataset.wgo; fresh = true; if (W.i >= n && allDone()) unlock(ctx, "world"); save(); draw(); return; }
    if (e.target.closest("[data-wnext]")){ W.i++; fresh = true; if (W.i >= n && allDone()) unlock(ctx, "world"); save(); draw(); scrollTo($(".tc-worldbar", el), "start"); return; }
    const id = mcqClick(e, k => { const x = d.items.find(i => "w-" + i.id === k); return x ? { q:x, R:W.r[x.id] = W.r[x.id] || {} } : null; });
    if (id !== false){ const x = d.items[W.i]; if (W.r[x.id].ok) Snd.pop(); save(); draw(); }
  };
  draw();
}, { label: () => "5 postcards" });

/* ============================================================
   CHAPTER 7 · tcFutureIntro — ідея Марка + цифровий конверт «DEAR FUTURE ME…»
   data: { chat:[msgs], sub, year }
   ============================================================ */
define("tcFutureIntro", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "intro");
  el.innerHTML = `${head(ctx, "Final Mission", "", { kicker:"Chapter 7 · Writing" })}
    <div class="tc-fi">
      ${phone(les, "marko", { id:"fc", cls:"slim" })}
      <div class="tc-envelope ${A.seen ? "" : "wait"}" id="env" role="img" aria-label="A glowing digital envelope: Dear Future Me. To be opened in ${d.year}.">
        <span class="tc-env-glow" aria-hidden="true"></span>
        <span class="tc-env-flap" aria-hidden="true"></span>
        <span class="tc-env-body"><span class="tc-env-k">To: me · Opens in ${d.year}</span><b>DEAR FUTURE ME…</b><span class="tc-env-sub">${esc(d.sub)}</span></span>
      </div>
    </div>`;
  chatOnce($("#fc", el), les, d.chat, A, "seen", { ping:true, delay:500, done: () => { const env = $("#env", el); if (env){ env.classList.remove("wait"); env.classList.add("in"); } } });
  ctx.setCTA({ label:"Start writing →" });
}, { label: () => "Marko's idea" });

/* ============================================================
   tcWriter — лист собі в майбутнє: 4 підказки, редактор, лічильник, чек-лист,
   чернетка, перегляд, копіювання, «запечатати» в капсулу часу
   data: { prompts:[{id,t,q,ua,starter}], phrases, model, need:{events,min,max}, year }
   ============================================================ */
const GOAL = /\b(i hope to|i want to|i'd like to|i would like to|i'd love to|i would love to|i plan to|my goal is|i'm going to|i am going to|one day,? i want)\b/;
const PRED = /\b(maybe i'll|maybe i will|i think i'll|i think i will|i hope i'll|i hope i will|i'll probably|i will probably|perhaps i'll|i'll|i will|maybe you)\b/;
function checkLetter(les, text){
  const t = norm(text);
  const events = les.life.filter(x => { try { return new RegExp(x.re, "i").test(t); } catch(e){ return false; } });
  const body = t.replace(/^\s*dear future me,?/, "");
  return { events, goal: GOAL.test(t), pred: PRED.test(t), q: /\?/.test(body), n: words(text) };
}
define("tcWriter", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, W = store(ctx, scr, "write");
  if (W.text == null) W.text = "Dear Future Me,\n\n";
  if (!d.prompts.some(p => p.id === W.p)) W.p = d.prompts[0].id;
  let fx = false;
  const need = d.need;
  const checks = () => { const c = checkLetter(les, W.text); return { c, list:[
    { ok: c.events.length >= need.events, t:`Life events used: ${Math.min(c.events.length, need.events)} / ${need.events}`, extra: c.events.length ? `<span class="tc-found">${c.events.map(x => `<i>${esc(x.w)}</i>`).join("")}</span>` : "" },
    { ok: c.goal, t:"One personal goal (I hope to… / I'd like to…)" },
    { ok: c.pred, t:"One prediction (Maybe I'll… / I think I'll…)" },
    { ok: c.q, t:"One question to your future self (…?)" },
    { ok: c.n >= need.min && c.n <= need.max + 15, t:`Length: ${c.n} words (aim for ${need.min}–${need.max})`, warn: c.n > need.max + 15 }
  ]}; };
  const checkHTML = () => { const k = checks(); return `<ul class="tc-checks">${k.list.map(x => `<li class="${x.ok ? "ok" : x.warn ? "warn" : ""}"><span class="tc-ck" aria-hidden="true">${x.ok ? icon("check") : ""}</span><span>${esc(x.t)}${x.extra || ""}</span></li>`).join("")}</ul>`; };
  const letterView = () => `<article class="tc-futpaper" aria-label="Your letter to the future">${esc(W.text).split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")}<span class="tc-futpaper-y">${d.year}</span></article>`;
  const sealedView = () => `<section class="tc-sealed">
      <div class="tc-capsule" role="img" aria-label="A sealed time capsule"><span class="tc-cap-lid"></span><span class="tc-cap-body"><span class="tc-cap-lock">${icon("lock")}</span><span class="tc-cap-year">${d.year}</span></span></div>
      <div><p class="tc-sealed-k">${icon("check")} Time capsule sealed</p><h3>To be opened in ${d.year}.</h3><p class="muted">Sealed on ${esc(new Date(W.sealed).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" }))}. Your letter stays in your course progress — it isn't sent anywhere.</p>
        <div class="tc-row">${foldBtn("readl", `${icon("eye")} Read my letter`)}<button class="btn small" type="button" data-copy>${icon("copy")} Copy letter</button><button class="btn small ghost" type="button" data-unseal>${icon("pen")} Edit letter</button></div></div>
      ${foldBox("readl", letterView())}
    </section>`;
  const draw = () => {
    const pr = d.prompts.find(p => p.id === W.p);
    let main;
    if (W.sealed) main = sealedView();
    else if (W.view === "preview") main = `<div class="tc-preview">${letterView()}<div class="tc-row tc-actions"><button class="btn" type="button" data-edit>${icon("pen")} Edit letter</button><button class="btn small" type="button" data-copy>${icon("copy")} Copy letter</button><span class="spacer"></span><button class="btn primary big tc-sealbtn" type="button" data-seal>${icon("lock")} Seal my letter</button></div></div>`;
    else main = `<div class="tc-writegrid">
        <div class="card tc-editor">
          <div class="tc-ptabs" role="tablist" aria-label="Writing prompts">${d.prompts.map((p, k) => `<button class="tc-ptab ${p.id === W.p ? "on" : ""}" type="button" role="tab" aria-selected="${p.id === W.p}" data-pr="${p.id}"><span>${k + 1}</span>${esc(p.t)}</button>`).join("")}</div>
          <div class="tc-prompt"><p><b>${esc(pr.q)}</b> ${say(pr.q)}</p><div class="tc-tools">${uaBtn("pr-ua-" + pr.id)}<button class="btn small ghost" type="button" data-starter>+ Use: “${esc(pr.starter)}”</button></div>${uaBox("pr-ua-" + pr.id, pr.ua)}</div>
          <label class="sr-only" for="lt">Your letter to the future</label>
          <textarea id="lt" class="tc-ta" spellcheck="true" placeholder="Dear Future Me, …">${esc(W.text)}</textarea>
          <div class="tc-edbar"><span class="tc-wc" id="wc">${words(W.text)} words</span><span class="tc-saved" id="sv">${W.savedAt ? "Draft saved " + new Date(W.savedAt).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : "Autosave on"}</span><span class="spacer"></span>
            <button class="btn small" type="button" data-savedraft>${icon("save")} Save draft</button><button class="btn small" type="button" data-copy>${icon("copy")} Copy</button><button class="btn small primary" type="button" data-preview>${icon("eye")} Preview letter</button></div>
        </div>
        <aside class="tc-wside">
          <div class="card"><h3 class="tc-h">Checklist</h3><div id="ck">${checkHTML()}</div><p class="tc-tip">Small mistakes are OK — this is your letter.</p></div>
          <div class="card">${foldBtn("phr", "Useful expressions")}${foldBox("phr", `<div class="tc-phrs">${d.phrases.map(p => `<button class="tc-starter-chip btn-like" type="button" data-phr="${esc(p)}">${esc(p)}</button>`).join("")}</div>`)}
            ${foldBtn("mdl", "Show an example")}${foldBox("mdl", `<div class="tc-model">${esc(d.model).split(/\n{2,}/).map(p => `<p>${p}</p>`).join("")}${say(d.model, "Listen to the example")}</div>`)}</div>
        </aside>
      </div>`;
    el.innerHTML = `${head(ctx, "Dear Future Me…", W.sealed ? "" : `Write a short letter to yourself in ${d.year}: ${need.min}–${need.max} words.`, { kicker:"Chapter 7 · Final mission", ua:`Напиши короткий лист собі в ${d.year} рік: ${need.min}–${need.max} слів.` })}
      ${main}
      <div id="fx"></div>`;
    ctx.setCTA({ label: W.sealed ? "Summary →" : "Continue" });
    const ta = $("#lt", el); if (ta) ta.oninput = () => { W.text = ta.value; save(); $("#wc", el).textContent = words(W.text) + " words"; $("#ck", el).innerHTML = checkHTML(); };
  };
  const insert = s => { const ta = $("#lt", el); if (!ta) return; const a = ta.selectionStart != null ? ta.selectionStart : ta.value.length; const b = ta.selectionEnd != null ? ta.selectionEnd : a;
    const before = ta.value.slice(0, a), after = ta.value.slice(b); const pad = before && !/\s$/.test(before) ? " " : "";
    const ins = pad + s.replace(/…$/, "") + (/[ ]$/.test(s) ? "" : " ");
    ta.value = before + ins + after; W.text = ta.value; save(); const pos = (before + ins).length; ta.focus(); ta.setSelectionRange(pos, pos);
    $("#wc", el).textContent = words(W.text) + " words"; $("#ck", el).innerHTML = checkHTML(); };
  const seal = () => {
    if (fx) return; fx = true;
    W.sealed = Date.now(); W.view = null; save();
    const done = () => { fx = false; unlock(ctx, "story"); draw(); scrollTo($(".tc-sealed", el), "center"); };
    if (!anim()){ Snd.seal(); done(); return; }
    const box = document.createElement("div"); box.className = "tc-sealhost"; document.body.appendChild(box); onCleanup(() => box.remove());
    box.innerHTML = `<div class="tc-sealfx" role="status" aria-live="polite"><div class="tc-sf-stage"><div class="tc-sf-letter"><i></i><i></i><i></i><i class="s"></i></div><div class="tc-capsule big"><span class="tc-cap-lid"></span><span class="tc-cap-body"><span class="tc-cap-lock">${icon("lock")}</span><span class="tc-cap-year">${d.year}</span></span></div></div>
      <p class="tc-sf-t1">TIME CAPSULE SEALED</p><p class="tc-sf-t2">To be opened in ${d.year}.</p><p class="tc-sf-t3">MISSION COMPLETED <span>·</span> FUTURE STORYTELLER UNLOCKED</p></div>`;
    Snd.paper(); later(() => Snd.seal(), 1500);
    later(() => { box.remove(); done(); }, 4600);
  };
  el.onclick = async e => {
    const p = e.target.closest("[data-pr]"); if (p){ W.p = p.dataset.pr; save(); draw(); const nb = $(`[data-pr="${W.p}"]`, el); if (nb) nb.focus({ preventScroll:true }); return; }
    if (e.target.closest("[data-starter]")){ insert(d.prompts.find(x => x.id === W.p).starter); return; }
    const ph = e.target.closest("[data-phr]"); if (ph){ insert(ph.dataset.phr); return; }
    if (e.target.closest("[data-savedraft]")){ W.savedAt = Date.now(); save(); toast("Draft saved"); const s = $("#sv", el); if (s) s.textContent = "Draft saved just now"; return; }
    if (e.target.closest("[data-preview]")){ W.view = "preview"; save(); draw(); return; }
    if (e.target.closest("[data-edit]")){ W.view = null; save(); draw(); const ta = $("#lt", el); if (ta) ta.focus(); return; }
    if (e.target.closest("[data-unseal]")){ W.sealed = null; W.view = null; save(); draw(); return; }
    if (e.target.closest("[data-seal]")){ seal(); return; }
    if (e.target.closest("[data-copy]")){ try { await navigator.clipboard.writeText(W.text); toast("Letter copied"); } catch(err){ toast("Copying is blocked here — select the text instead."); } }
  };
  draw();
}, { label: () => "Write the letter" });

/* ============================================================
   CHAPTER 8 · tcRecap — «TODAY YOU DISCOVERED…» + 5 швидких усних питань
   data: { discovered:[..], check:[{q,a}] }
   ============================================================ */
define("tcRecap", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, A = store(ctx, scr, "recap"); const n = d.check.length; A.i = Math.min(A.i || 0, n - 1);
  const ICONS = ["map", "timeline", "book", "feather"];
  const draw = () => {
    const i = A.i, q = d.check[i]; const open = i >= 3;
    el.innerHTML = `${head(ctx, "Today You Discovered…", "", { kicker:"Chapter 8 · Summary" })}
      <ul class="tc-disc">${d.discovered.map((x, k) => `<li style="--k:${k}"><span class="tc-disc-i">${icon(ICONS[k % ICONS.length])}</span>${esc(x)}</li>`).join("")}</ul>
      <div class="card tc-talk">
        <div class="tc-qtop"><span>Quick check · ${i + 1} of ${n}</span><span class="tc-steps" aria-hidden="true">${d.check.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</span></div>
        <div class="tc-qrow"><p class="tc-bigq">${esc(q.q)}</p>${say(q.q.replace(/[«»]/g, ""))}</div>
        <p class="tc-oral">${icon("mic")} Answer out loud.</p>
        ${open && !ctx.teacher ? "" : `<div class="tc-tools">${foldBtn("rc" + i, open ? "🧑‍🏫 Model answer" : "Show the answer", open ? "teach" : "")}</div>${foldBox("rc" + i, `<p>${esc(q.a)}</p>`, open ? "tc-sample" : "tc-answer")}`}
        <div class="tc-row tc-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next →</button>` : `<span class="pill good">✓ Done</span>`}</div>
      </div>`;
    ctx.setCTA({ label:"Collect your badge →" });
  };
  el.onclick = e => {
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); OPEN.clear(); save(); draw(); }
  };
  draw();
}, { label: () => "Quick check" });

/* ============================================================
   tcBadge — колекційний бейдж LIFE EXPLORER + полиця досягнень
   data: { badge:{t,s} }
   ============================================================ */
define("tcBadge", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, tc = TC(ctx);
  const fresh = !tc.ach.life;
  if (fresh){ tc.ach.life = Date.now(); save(); later(() => achPop("life"), 900); }
  el.innerHTML = `${bar(ctx)}
    <div class="tc-badgewrap">
      <div class="tc-medallion ${fresh && anim() ? "spin" : ""}" role="img" aria-label="Badge: ${esc(d.badge.t)}">
        <svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="tcmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD58A"/><stop offset=".5" stop-color="#C49BFF"/><stop offset="1" stop-color="#74C0FC"/></linearGradient>
          <path id="tcmc" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs>
          <circle cx="100" cy="100" r="94" fill="none" stroke="url(#tcmg)" stroke-width="4"/>
          <circle cx="100" cy="100" r="84" fill="#141634" stroke="url(#tcmg)" stroke-width="1.5" stroke-dasharray="2 4"/>
          <text font-family="Manrope,sans-serif" font-size="10" font-weight="800" fill="#E9E3FF"><textPath href="#tcmc" textLength="446" lengthAdjust="spacing">LIFE EXPLORER · THE SIGNAL · LESSON 7 · 1998 → 2036 ·</textPath></text>
          <circle cx="100" cy="100" r="54" fill="url(#tcmg)" opacity=".16"/>
          <g transform="translate(64,64) scale(3)" fill="none" stroke="#FFE3A3" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICON.compass}</g>
        </svg>
      </div>
      <h2 class="stitle tc-badge-t" id="stitle" tabindex="-1">${esc(d.badge.t)}</h2>
      <p class="tc-badge-s">${esc(d.badge.s)}</p>
    </div>
    <div class="card tc-shelfcard">${shelf(tc)}</div>`;
  ctx.setCTA({ label:"One more thing… →" });
}, { label: () => "Badge" });

/* ============================================================
   tcCliff — клифгенгер: затемнення, сповіщення, чат Марка, TO BE CONTINUED, анонс Уроку 8
   data: { cliff:[msgs|{pause}], next:{k,t,s}, closing }
   ============================================================ */
define("tcCliff", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "cliff");
  const play = !A.seen && anim();
  el.innerHTML = `<div class="story-screen tc-cliff ${play ? "dim" : ""}">
      <p class="tc-cliff-k" id="stitle" tabindex="-1" ${play ? "hidden" : ""}>${icon("envelope")} New message from Marko</p>
      <div id="cp" ${play ? "hidden" : ""}>${phone(les, "marko", { id:"cth", cls:"dark" })}</div>
      <div class="tc-tbc" id="tbc" ${play ? "hidden" : ""}>To be continued…</div>
      <div class="tc-next" id="nx" ${play ? "hidden" : ""}><span class="tc-next-lock">${icon("lock")}</span><div><small>${esc(d.next.k)}</small><b>${esc(d.next.t)}</b><p>${esc(d.next.s)}</p></div></div>
      <p class="tc-closing" id="cl" ${play ? "hidden" : ""}>${esc(d.closing)}</p>
      ${ctx.teacher && play ? `<button class="btn small link tc-skipfx" type="button" data-allc>Show everything</button>` : ""}
    </div>`;
  const th = $("#cth", el);
  const show = id => { const n = $("#" + id, el); if (n){ n.hidden = false; n.classList.add("ix-reveal"); } };
  let alive = true; onCleanup(() => { alive = false; });
  const end = () => { if (!alive) return; A.seen = true; save(); show("tbc"); scrollTo($("#tbc", el), "center"); later(() => { show("nx"); later(() => { show("cl"); scrollTo($("#cl", el), "end"); }, 900); }, 1100); };
  const all = () => { alive = false; th.innerHTML = chatHTML(les, d.cliff); ["stitle", "cp", "tbc", "nx", "cl"].forEach(show); A.seen = true; save(); const b = $("[data-allc]", el); if (b) b.remove(); };
  if (!play){ th.innerHTML = chatHTML(les, d.cliff); }
  else {
    later(() => { if (!alive) return; Snd.ping(); show("stitle"); }, 1400);
    later(() => { if (!alive) return; show("cp"); playChat(th, les, d.cliff, { delay:400, stopped: () => !alive, each: () => { const last = th.lastElementChild; if (last) last.scrollIntoView({ block:"nearest", behavior:"smooth" }); }, done: () => later(end, 1300) }); }, 2300);
  }
  el.onclick = e => { if (e.target.closest("[data-allc]")) all(); };
  ctx.setCTA({ label:"Finish lesson ✅" });
}, { story:true, label: () => "To be continued" });

})();
