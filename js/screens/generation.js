/* ============================================================
   THE SIGNAL — бібліотека екранів «Who Had It Better?» (Unit 3 · Lesson 8)
   ------------------------------------------------------------
   Time Machine + Generation Detective: перемикач епох 1998 ⇄ 2026, Evidence Board
   (5 доказів + особлива знахідка), лабораторія порівнянь, щоденник тата, два голосові
   повідомлення (синтез мовлення браузера), дебати поколінь і бонусне гра-шоу.
   Типи: gxOpen · gxTalk · gxPredict · gxSort · gxTimeMachine · gxEvidence · gxLab ·
         gxDiary · gxDiaryFind · gxVoices · gxListen · gxDebate · gxVerdict · gxCliff · gxBattle
   Тема — css/generation.css (body[data-episode-theme="generation"]).
   Стан уроку (докази, прогноз, епоха, переклади) — у ans._gx епізоду.
   Файл самодостатній: не залежить від інших бібліотек екранів.
   Підключається в index.html після js/player.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
if (!S || !P) return;
const { $, $$, esc, reduced, onCleanup, save, sayBtn, toast, TTS } = S;
const define = P.define;

/* ---------- дрібні помічники ---------- */
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const plain = s => String(s || "").replace(EMO, "").replace(/\{[stcea]\|/g, "").replace(/[[\]{}]/g, "").replace(/\s+/g, " ").trim();
const say = (t, l) => sayBtn(plain(t), l || "Listen");
const anim = () => !reduced();
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const scrollTo = (node, block) => { if (node) later(() => node.scrollIntoView({ block: block || "nearest", behavior: anim() ? "smooth" : "auto" }), 80); };
const LETTER = i => String.fromCharCode(65 + i);
const GOOD = ["Nice work — exactly right!", "Great — that's it!", "Exactly!", "Well done, detective!"];
const good = i => GOOD[(i || 0) % GOOD.length];
const splitS = p => (String(p).match(/[^.!?]+[.!?]+["”’)]*\s*/g) || [p]).map(s => s.trim()).filter(Boolean);
const pad2 = n => String(n).padStart(2, "0");
const ERA = { "98":{ y:"1998", e:"📼", t:"Team 1998" }, "26":{ y:"2026", e:"📱", t:"Team 2026" } };

/* ---------- іконки (контурні, 24×24) ---------- */
const ICON = {
  chip:`<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>`,
  tv:`<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M12 18v3M9 2.5l3 3.5 3-3.5"/>`,
  phone:`<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>`,
  heart:`<path d="M12 20s-7-4.4-9-9.2C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21 10.8 19 15.6 12 20 12 20z"/>`,
  key:`<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>`,
  lock:`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  check:`<path d="M4 12.5l5 5L20 6.5"/>`,
  star:`<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>`,
  spark:`<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>`,
  eye:`<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  book:`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>`,
  info:`<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>`,
  search:`<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>`,
  mic:`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>`,
  flask:`<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/>`,
  scale:`<path d="M12 3v17M7.5 20.5h9M5 7h14"/><path d="M5 7l-3 6.5a3 3 0 0 0 6 0zM19 7l-3 6.5a3 3 0 0 0 6 0z"/>`,
  trophy:`<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 21h7M10 17h4v4h-4z"/>`,
  bolt:`<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>`,
  play:`<path d="M7 4.5v15l12-7.5z"/>`,
  pause:`<path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z"/>`,
  undo:`<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`,
  ua:`<path d="M4 6h16M4 12h10M4 18h7"/><path d="M17 14l2.5 6M22 20l-2.5-6M17.8 18h3.4"/>`,
  sound:`<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>`,
  mute:`<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>`,
  file:`<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>`,
  box:`<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/>`,
  tape:`<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="8" cy="12" r="2.2"/><circle cx="16" cy="12" r="2.2"/><path d="M10.2 12h3.6M6 18l1.5-3h9l1.5 3"/>`,
  photo:`<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>`,
  msg:`<path d="M4 5h16v11H9l-5 4z"/>`,
  restart:`<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 1.8-8.3L4 10"/>`,
  arrow:`<path d="M5 12h14M13 6l6 6-6 6"/>`,
  flag:`<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>`
};
const icon = (k, cls) => `<svg class="gx-icon ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[k] || ICON.spark}</svg>`;

/* ---------- звуки (тихі, без файлів; вимикаються кнопкою Sound) ---------- */
const SND_KEY = "signal8:gx:mute";
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
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .05);
  };
  const noise = (a, t, dur, vol, freq) => {
    const len = Math.floor(a.sampleRate * dur); const buf = a.createBuffer(1, len, a.sampleRate); const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource(); src.buffer = buf; const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq || 1800; f.Q.value = .8;
    const g = a.createGain(); g.gain.value = vol; src.connect(f); f.connect(g); g.connect(a.destination); src.start(t);
  };
  const play = fn => { if (muted()) return; const a = get(); if (!a) return; try { fn(a, a.currentTime + .01); } catch(e){} };
  return {
    muted, set(v){ try { localStorage.setItem(SND_KEY, v ? "1" : "0"); } catch(e){} },
    vhs(){ play((a, t) => { tone(a, 140, t, .08, .06, "square", 90); noise(a, t + .02, .2, .06, 900); tone(a, 2400, t + .05, .05, .015, "square"); }); },
    ping(){ play((a, t) => { tone(a, 988, t, .14, .05); tone(a, 1480, t + .09, .24, .04); }); },
    buzz(){ play((a, t) => { for (let i = 0; i < 3; i++) tone(a, 120, t + i * .16, .11, .07, "sawtooth", 110); }); },
    pop(){ play((a, t) => tone(a, 660, t, .08, .03, "triangle", 880)); },
    nope(){ play((a, t) => tone(a, 220, t, .18, .035, "triangle", 170)); },
    unlock(){ play((a, t) => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(a, f, t + i * .07, .42, .032)); noise(a, t, .08, .03, 3000); }); },
    arcade(){ play((a, t) => { [392, 523, 659, 784].forEach((f, i) => tone(a, f, t + i * .06, .1, .03, "square")); }); },
    fanfare(){ play((a, t) => { [523, 523, 659, 784, 1047].forEach((f, i) => tone(a, f, t + i * .12, i === 4 ? .7 : .14, .04, "square")); tone(a, 262, t + .48, .7, .03, "triangle"); }); },
    stamp(){ play((a, t) => { tone(a, 150, t, .25, .08, "sine", 70); noise(a, t, .09, .07, 500); }); }
  };
})();

/* ---------- стан уроку ---------- */
const GX = ctx => { const g = ctx.all._gx = ctx.all._gx || {}; g.ev = g.ev || {}; g.seenM = g.seenM || {}; g.disc = g.disc || {}; if (!g.era) g.era = "98"; return g; };
const EVS = les => les.evidence || [];
const evOf = (les, id) => EVS(les).find(x => x.id === id);
function unlockEv(ctx, ids){
  const g = GX(ctx); const fresh = ids.filter(id => !g.ev[id]);
  fresh.forEach(id => { g.ev[id] = Date.now(); });
  if (fresh.length){ save(); Snd.unlock(); }
  return fresh;
}

/* ---------- перемикачі (переклад, зразок, підказки) — живуть, поки відкритий екран ---------- */
const OPEN = new Set();
let CUR = null, RESET = null;
const isOpen = id => OPEN.has(id);
const foldBtn = (id, label, cls) => `<button class="gx-tog ${cls || ""} ${isOpen(id) ? "on" : ""}" type="button" data-gxfold="${id}" aria-expanded="${isOpen(id)}" aria-controls="${id}">${label}</button>`;
const foldBox = (id, html, cls) => `<div class="gx-fold ${cls || ""} ${isOpen(id) ? "open" : ""}" id="${id}">${html}</div>`;
const uaBtn = (id, label) => foldBtn(id, `<span aria-hidden="true">🇺🇦</span> ${label == null ? "UA Help" : label || `<span class="sr-only">Ukrainian help</span>`}`, "ua");
const uaBox = (id, text) => foldBox(id, `<p>${text}</p>`, "gx-ua");

/* ---------- прогрес: без бонусних екранів ---------- */
function progress(ctx){
  const ls = S.L(ctx.les.id);
  const kinds = (window.SignalApp && window.SignalApp.screens) ? window.SignalApp.screens(ctx.les.id) : [];
  const total = kinds.filter(k => k !== "gxBattle").length || 1;
  const bonus = ctx.les.stages.filter(s => s.optional).map(s => s.id);
  const done = Object.keys(ls.done || {}).filter(k => !bonus.includes(k.split(":")[0])).length;
  return Math.max(0, Math.min(100, Math.round(done / total * 100)));
}
const mainStages = les => les.stages.filter(s => !s.optional);

/* ---------- плівкова «часова» анімація (VHS) ---------- */
function vhs(label){
  if (!anim() || typeof document === "undefined") return;
  const n = document.createElement("div"); n.className = "gx-vhsfx"; n.setAttribute("aria-hidden", "true");
  n.innerHTML = `<i class="gx-vhs-bars"></i><i class="gx-vhs-noise"></i>${label ? `<b>${esc(label)}</b>` : ""}`;
  document.body.appendChild(n); setTimeout(() => n.remove(), 760);
}
function setEra(ctx, era, quiet){
  const g = GX(ctx); if (g.era === era) return;
  g.era = era; save(); document.body.dataset.gxEra = era;
  if (!quiet){ Snd.vhs(); vhs(era === "98" ? "◀◀ 1998" : "2026 ▶▶"); }
  $$("[data-gxera]").forEach(b => { b.dataset.on = era; b.setAttribute("aria-label", "Era: " + ERA[era].y + ". Switch era"); });
  if (CUR && CUR.onEra) CUR.onEra(era);
}
const eraSwitch = (g, cls) => `<button class="gx-era ${cls || ""}" type="button" data-gxera data-on="${g.era}" aria-label="Era: ${ERA[g.era].y}. Switch era"><span class="e98">📼 1998</span><i aria-hidden="true"></i><span class="e26">2026 📱</span></button>`;

/* ---------- титр місії (один раз) ---------- */
function missionCard(stage){
  if (!anim() || typeof document === "undefined") return;
  const n = document.createElement("div"); n.className = "gx-mcard"; n.setAttribute("role", "status");
  n.innerHTML = `<div class="gx-mcard-in"><span class="gx-osd">● REC&nbsp;&nbsp;MISSION ${pad2(stage.n)}</span><b>${esc(stage.title)} <span aria-hidden="true">${stage.emoji || ""}</span></b><i class="gx-mcard-line"></i></div>`;
  const kill = () => { n.classList.add("out"); setTimeout(() => n.remove(), 380); };
  n.onclick = kill; document.body.appendChild(n); Snd.vhs(); setTimeout(kill, 1650);
}

/* ---------- рамка екрана ---------- */
function frame(el, ctx){
  OPEN.clear(); RESET = null; CUR = { ctx, el, onEra:null };
  const g = GX(ctx);
  el.classList.add("gx-screen"); el.classList.toggle("gx-uaall", !!g.ua);
  document.body.dataset.gxEra = g.era;
  const st = ctx.scr.stage;
  if (!g.seenM[st.id]){ g.seenM[st.id] = Date.now(); save(); if (st.n > 1 || ctx.scr.kind !== "gxOpen") missionCard(st); }
}

/* ---------- верхня смуга ---------- */
function bar(ctx, o){
  o = o || {};
  const st = ctx.scr.stage, g = GX(ctx), pct = progress(ctx), nEv = Object.keys(g.ev).length, total = EVS(ctx.les).length;
  const key = ctx.scr.data.store;
  RESET = key ? () => { delete ctx.ans[key]; if (o.onReset) o.onReset(); save(); toast("Activity reset"); window.SignalApp.render(); } : null;
  const ms = mainStages(ctx.les).length;
  return `<div class="gx-bar">
      <span class="gx-bar-t">${st.optional ? `<b>Bonus</b><i aria-hidden="true">·</i>${esc(st.title)}` : `<b>Mission ${st.n}</b><span class="gx-of">/${ms}</span><i aria-hidden="true">·</i><span class="gx-bar-name">${esc(st.title)}</span>`}</span>
      <span class="gx-prog" title="Lesson progress: ${pct}%"><span class="gx-prog-track" aria-hidden="true"><i style="width:${pct}%"></i></span><b>${pct}%</b></span>
      <span class="spacer"></span>
      ${eraSwitch(g)}
      <button class="gx-chip gx-evchip" type="button" data-gxboard aria-label="Evidence Board: ${nEv} of ${total} files">${icon("file")}<span class="gx-hide-sm">Evidence</span><b>${nEv}/${total}</b></button>
      <button class="gx-chip" type="button" data-gxgram title="Grammar & words help" aria-label="Grammar help">${icon("flask")}<span class="gx-hide-sm gx-hide-md">Grammar</span></button>
      <button class="gx-chip ${g.ua ? "on" : ""}" type="button" data-gxua aria-pressed="${!!g.ua}" title="Show or hide Ukrainian help on this lesson"><span aria-hidden="true">🇺🇦</span><span class="gx-hide-sm gx-hide-md">UA Help</span></button>
      <button class="gx-chip" type="button" data-gxsnd aria-pressed="${!Snd.muted()}" title="Sound effects on / off" aria-label="Sound effects">${icon(Snd.muted() ? "mute" : "sound")}</button>
      ${ctx.teacher && RESET ? `<button class="gx-chip warn" type="button" data-gxreset title="Clear the answers on this screen">↺ Reset</button>` : ""}
    </div>`;
}
function head(ctx, title, intro, o){
  o = o || {};
  return `${bar(ctx, o)}<header class="gx-head">
    <p class="gx-kicker">${o.kicker ? esc(o.kicker) : `Mission ${pad2(ctx.scr.stage.n)}`}</p>
    <h2 class="stitle gx-title" id="stitle" tabindex="-1">${esc(title || ctx.scr.stage.title)}</h2>
    ${intro ? `<div class="gx-intro"><p>${esc(intro)}</p>${o.ua ? uaBtn("hd-ua", "") : ""}</div>${o.ua ? uaBox("hd-ua", esc(o.ua)) : ""}` : ""}
  </header>`;
}

/* ---------- бічні панелі: Evidence Board, Grammar Help ---------- */
function evCardHTML(les, x, on, o){
  o = o || {};
  if (!on) return `<div class="gx-file locked"><span class="gx-file-n">${x.n}</span><span class="gx-file-i">${icon("lock")}</span><b>${esc(x.cat)}</b><small>Unlocks in ${esc(x.from)}</small></div>`;
  return `<article class="gx-file on ${o.fresh ? "fresh" : ""}" aria-label="Evidence ${x.n}: ${esc(x.cat)}">
    <header><span class="gx-file-n">${x.n}</span><span class="gx-file-i">${icon(x.icon)}</span><b>${esc(x.cat)}</b>${o.disc ? `<span class="gx-file-ok" title="Discussed">✓</span>` : ""}</header>
    <div class="gx-file-eras"><p class="e98"><span>1998</span>${esc(x.y98)}</p><p class="e26"><span>2026</span>${esc(x.y26)}</p></div>
    ${o.q ? `<p class="gx-file-q">${icon("search")} ${esc(x.q)}</p>` : ""}
  </article>`;
}
function exhibitHTML(les, o){
  const x = les.exhibit; o = o || {};
  return `<article class="gx-exhibit ${o.fresh ? "fresh" : ""}"><span class="gx-exhibit-stamp">${esc(x.t)}</span><p>${esc(x.s)}</p><small>Exhibit · Dad's diary · 7 November 1998</small></article>`;
}
function drawer(kind){
  if (!CUR || typeof document === "undefined") return;
  const ctx = CUR.ctx, les = ctx.les, g = GX(ctx);
  let host = document.getElementById("gx-drawer");
  if (!host){ host = document.createElement("div"); host.id = "gx-drawer"; document.body.appendChild(host); }
  let body = "";
  if (kind === "board"){
    const n = Object.keys(g.ev).length;
    body = `<header class="gx-dr-head">${icon("file")}<div><b>Evidence Board</b><small>${n} of ${EVS(les).length} files collected · Who had it better?</small></div><button class="icon-btn" type="button" data-gxclose aria-label="Close">✕</button></header>
      <div class="gx-dr-body">
        <div class="gx-boardmeter"><span style="--p:${(n / EVS(les).length).toFixed(3)}"></span></div>
        <div class="gx-files">${EVS(les).map(x => evCardHTML(les, x, !!g.ev[x.id], { q:true, disc:g.disc[x.id] })).join("")}</div>
        ${g.ev.talk ? exhibitHTML(les) : ""}
        ${g.pred ? `<p class="gx-dr-pred">${icon("flag")} Your first prediction: <b>${g.pred === "unsure" ? "Not sure yet 🤔" : esc(ERA[g.pred].t + " " + ERA[g.pred].e)}</b></p>` : ""}
        ${ctx.teacher ? `<div class="gx-wipe"><p><b>Reset the whole lesson</b><br><small>Clears every answer, the evidence and the prediction in Lesson 8. Words in My words stay.</small></p><button class="btn small" type="button" data-gxwipe>↺ Reset Lesson 8</button></div>` : ""}
      </div>`;
  } else {
    const rule = (k, f, ex, ua) => `<div class="gx-gr"><b>${k}</b><span class="gx-gr-f">${f}</span><i>${ex}</i>${ua ? `<small class="gx-gr-ua">🇺🇦 ${ua}</small>` : ""}</div>`;
    body = `<header class="gx-dr-head">${icon("flask")}<div><b>Grammar & Words Help</b><small>Lesson 8 · comparing generations</small></div><button class="icon-btn" type="button" data-gxclose aria-label="Close">✕</button></header>
      <div class="gx-dr-body ${g.ua ? "gx-uaall" : ""}">
        <h3 class="gx-h">5 ways to compare</h3>
        <div class="gx-grs">
          ${rule("Comparatives", "short + <b>-er</b> · <b>more</b> + long · + <b>than</b>", "Phones are smaller than computers. Streaming is more convenient.", "вищий ступінь: порівнюємо дві речі")}
          ${rule("Superlatives", "<b>the</b> + -est · <b>the most</b> + long", "the worst day · the most useful invention", "найвищий ступінь: «номер один» у групі")}
          ${rule("Irregular", "good → better → the best · bad → worse → the worst", "It was the best concert of my life.", "неправильні форми")}
          ${rule("(Not) as … as", "<b>as</b> + adj + <b>as</b> = the same · <b>not as</b> … <b>as</b> = less", "Life in 1998 wasn't as connected as life today.", "такий самий, як / не такий …, як")}
          ${rule("Too / enough", "<b>too</b> + adj = a problem · adj + <b>enough</b> = OK", "This phone is too big! · It was good enough for me.", "занадто / достатньо; порядок: old enough")}
        </div>
        <h3 class="gx-h">Words for the investigation</h3>
        <ul class="gx-wordlist">${(les.words || []).map(w => `<li><div><b>${esc(w.w)}</b> ${say(w.w + ". " + w.ex, "Listen: " + w.w)}<small>${esc(w.en)}</small></div><span class="gx-wl-ua">🇺🇦 ${esc(w.ua)}</span></li>`).join("")}</ul>
        <button class="btn small" type="button" data-gxaddall>+ Add all 10 to My words</button>
      </div>`;
  }
  host.className = "gx-drawer-host";
  host.innerHTML = `<div class="gx-scrim" data-gxclose></div><aside class="gx-drawer ${kind}" role="dialog" aria-modal="true" aria-label="${kind === "board" ? "Evidence Board" : "Grammar help"}">${body}</aside>`;
  host.hidden = false;
  const c = host.querySelector("[data-gxclose].icon-btn"); if (c) c.focus();
}
function closeDrawer(){ const h = document.getElementById("gx-drawer"); if (h){ h.hidden = true; h.innerHTML = ""; } }

/* слово уроку → картка внизу */
function wordPop(les, w){
  const x = (les.words || []).find(v => v.w === w); if (!x) return;
  let n = document.getElementById("gx-wordpop");
  if (!n){ n = document.createElement("div"); n.id = "gx-wordpop"; n.setAttribute("role", "status"); document.body.appendChild(n); }
  n.className = "gx-wordpop";
  n.innerHTML = `<div><b>${esc(x.w)}</b> ${say(x.w + ". " + x.ex, "Listen: " + x.w)}<p>${esc(x.en)}</p><p class="ua">🇺🇦 ${esc(x.ua)}</p><p class="ex">“${esc(x.ex)}”</p></div><button class="icon-btn" type="button" data-gxpopx aria-label="Close">✕</button>`;
  clearTimeout(wordPop.t); wordPop.t = setTimeout(() => { if (n.isConnected) n.className = "gx-wordpop out"; }, 7000);
}
/* текст із [словами уроку] */
const wtext = (les, s) => esc(s).replace(/\[([^\]]+)\]/g, (_, w) => { const k = w.toLowerCase(); return (les.words || []).some(v => v.w === k) ? `<button class="gx-w" type="button" data-gxword="${esc(k)}">${esc(w)}</button>` : esc(w); });

if (typeof document !== "undefined"){
  document.addEventListener("click", e => {
    if (!e.target.closest) return;
    const f = e.target.closest("[data-gxfold]");
    if (f){
      const id = f.dataset.gxfold; const show = !OPEN.has(id);
      show ? OPEN.add(id) : OPEN.delete(id);
      const box = document.getElementById(id); if (box) box.classList.toggle("open", show);
      document.querySelectorAll(`[data-gxfold="${id}"]`).forEach(b => { b.classList.toggle("on", show); b.setAttribute("aria-expanded", String(show)); });
      return;
    }
    if (e.target.closest("[data-gxpopx]")){ const n = document.getElementById("gx-wordpop"); if (n) n.className = "gx-wordpop out"; return; }
    if (!CUR) return;
    const ctx = CUR.ctx;
    const w = e.target.closest("[data-gxword]"); if (w){ wordPop(ctx.les, w.dataset.gxword); return; }
    if (e.target.closest("[data-gxera]")){ setEra(ctx, GX(ctx).era === "98" ? "26" : "98"); return; }
    if (e.target.closest("[data-gxboard]")){ drawer("board"); return; }
    if (e.target.closest("[data-gxgram]")){ drawer("gram"); return; }
    if (e.target.closest("[data-gxclose]")){ closeDrawer(); return; }
    if (e.target.closest("[data-gxaddall]")){ (ctx.les.words || []).forEach(x => S.addWord(x.w)); toast("10 words added to My words"); return; }
    const wp = e.target.closest("[data-gxwipe]");
    if (wp){
      if (!wp.dataset.confirm){ wp.dataset.confirm = "1"; wp.textContent = "Tap again to reset everything"; wp.classList.add("hot"); setTimeout(() => { if (wp.isConnected){ delete wp.dataset.confirm; wp.textContent = "↺ Reset Lesson 8"; wp.classList.remove("hot"); } }, 4000); return; }
      const id = ctx.les.id; closeDrawer();
      if (S.resetLesson) S.resetLesson(id); else { delete S.state.lessons[id]; save(); }
      toast("Lesson 8 has been reset"); location.hash = `#/episode/${id}/1`; if (window.SignalApp) window.SignalApp.render(); return;
    }
    const u = e.target.closest("[data-gxua]");
    if (u){ const g = GX(ctx); g.ua = !g.ua; save(); CUR.el.classList.toggle("gx-uaall", g.ua); u.classList.toggle("on", g.ua); u.setAttribute("aria-pressed", String(g.ua)); toast(g.ua ? "UA Help: on" : "UA Help: hidden"); return; }
    const s = e.target.closest("[data-gxsnd]");
    if (s){ const m = !Snd.muted(); Snd.set(m); s.setAttribute("aria-pressed", String(!m)); s.innerHTML = icon(m ? "mute" : "sound"); if (!m) Snd.pop(); return; }
    const r = e.target.closest("[data-gxreset]");
    if (r && RESET){
      if (!r.dataset.confirm){ r.dataset.confirm = "1"; r.textContent = "Tap again to reset"; r.classList.add("hot"); setTimeout(() => { if (r.isConnected){ delete r.dataset.confirm; r.textContent = "↺ Reset"; r.classList.remove("hot"); } }, 3500); return; }
      RESET();
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
  window.addEventListener("hashchange", () => { closeDrawer(); const n = document.getElementById("gx-wordpop"); if (n) n.className = "gx-wordpop out"; });
}

/* ---------- усне питання: переклад, початок, додаткові питання, зразок, Done ---------- */
function spk(ctx, id, q, A, o){
  o = o || {}; A = A || {}; A.done = A.done || {};
  const done = !!A.done[id];
  return `<div class="gx-q ${o.small ? "small" : ""} ${done ? "done" : ""}">
    <div class="gx-qrow"><p class="gx-bigq">${esc(q.q)}</p>${say(q.q, "Listen to the question")}</div>
    ${q.starter ? `<p class="gx-starter"><span>Start like this</span>${esc(q.starter)}</p>` : ""}
    <div class="gx-tools">${q.ua ? uaBtn(id + "-ua") : ""}${q.fu && q.fu.length ? foldBtn(id + "-fu", `${icon("spark")} Follow-up`) : ""}${ctx.teacher && q.ex ? foldBtn(id + "-ex", "🧑‍🏫 Expected answer", "teach") : ""}
      <span class="spacer"></span><button class="gx-done ${done ? "on" : ""}" type="button" data-spk="${id}" aria-pressed="${done}">${done ? `${icon("check")} Done` : `${icon("mic")} Mark as done`}</button></div>
    ${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}
    ${q.fu && q.fu.length ? foldBox(id + "-fu", `<ul class="gx-fu">${q.fu.map(f => `<li><span>${esc(f)}</span>${say(f)}</li>`).join("")}</ul>`, "gx-fubox") : ""}
    ${ctx.teacher && q.ex ? foldBox(id + "-ex", `<p>“${esc(q.ex)}”</p>`, "gx-sample") : ""}
  </div>`;
}
function spkClick(e, A, el){
  const b = e.target.closest("[data-spk]"); if (!b) return false;
  A.done = A.done || {}; const id = b.dataset.spk; A.done[id] = !A.done[id]; save();
  b.classList.toggle("on", A.done[id]); b.setAttribute("aria-pressed", String(A.done[id])); b.innerHTML = A.done[id] ? `${icon("check")} Done` : `${icon("mic")} Mark as done`;
  const q = b.closest(".gx-q"); if (q) q.classList.toggle("done", A.done[id]);
  if (A.done[id]) Snd.pop();
  return id;
}

/* ---------- питання з вибором: 1-ша помилка → підказка, 2-га → правильна відповідь ---------- */
function mcqHTML(id, q, R, o){
  o = o || {}; R = R || {}; const wrong = R.wrong || []; const done = R.ok || R.shown;
  let fb = "";
  const uaPart = q.ua ? " " + uaBtn(id + "-ua", "") : "";
  if (R.ok) fb = `<div class="note good gx-fb">✓ ${esc(R.first ? good(o.n) : "Yes, that's it!")} ${esc(q.why || "")}${uaPart}</div>${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}`;
  else if (R.shown) fb = `<div class="note info gx-fb">The answer is <b>${o.noLetter ? "" : LETTER(q.a) + ". "}${esc(q.o[q.a])}</b>. ${esc(q.why || "")}${uaPart}</div>${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}`;
  else if (wrong.length) fb = `<div class="note amber gx-fb">Not quite. ${esc(q.hint || "Try again.")} ${q.ua ? uaBtn(id + "-ua", "") : ""}</div>${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}`;
  return `<div class="gx-mcq ${done ? "done" : ""}" data-qid="${id}">
    ${o.noQ ? "" : `<div class="gx-qrow"><p class="gx-mq">${o.num ? `<span class="gx-qn">${o.num}</span>` : ""}<span>${esc(q.q)}</span></p>${o.noSay ? "" : say(q.q, "Listen to the question")}</div>`}
    <div class="gx-opts ${o.row ? "row" : ""}">${q.o.map((x, k) => { let cls = ""; if (done && k === q.a) cls = "good"; else if (wrong.includes(k)) cls = "bad";
      return `<button class="gx-opt ${cls}" type="button" data-opt="${id}:${k}" ${done || wrong.includes(k) ? "disabled" : ""}><b class="gx-letter" aria-hidden="true">${LETTER(k)}</b><span>${esc(x)}</span></button>`; }).join("")}</div>
    <div aria-live="polite">${fb}</div>
    ${o.teacher && !done ? `<button class="btn small link gx-reveal" type="button" data-oshow="${id}">Reveal answer</button>` : ""}
  </div>`;
}
function mcqClick(e, get){
  const b = e.target.closest("[data-opt]");
  if (b){
    const parts = b.dataset.opt.split(":"); const k = +parts.pop(); const id = parts.join(":");
    const x = get(id); if (!x) return false; const R = x.R;
    if (R.ok || R.shown) return id;
    if (k === x.q.a){ R.ok = true; R.first = !(R.wrong && R.wrong.length); Snd.pop(); }
    else { R.wrong = (R.wrong || []).concat(k); Snd.nope(); if (R.wrong.length >= 2) R.shown = true; }
    save(); return id;
  }
  const s = e.target.closest("[data-oshow]");
  if (s){ const x = get(s.dataset.oshow); if (x){ x.R.shown = true; save(); return s.dataset.oshow; } }
  return false;
}
const mcqDone = R => !!(R && (R.ok || R.shown));

/* ---------- картинки з запасним малюнком ---------- */
const media = (les, k) => (les.media || {})[k] || null;
function pic(src, alt, fb, cls){
  if (!src) return `<span class="gx-pic ${cls || ""} fail"><span class="gx-pic-fb">${fb}</span></span>`;
  return `<span class="gx-pic ${cls || ""}"><img src="${esc(src)}" alt="${esc(alt || "")}" decoding="async" onerror="this.parentNode.classList.add('fail')"><span class="gx-pic-fb">${fb}</span></span>`;
}
/* --- малюнки (SVG) --- */
const ART = {
  photo:() => `<svg viewBox="0 0 160 120" role="img" aria-label="An old concert photo"><defs><radialGradient id="gxph" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#8A4C5E"/><stop offset=".6" stop-color="#3A2244"/><stop offset="1" stop-color="#150F22"/></radialGradient></defs><rect width="160" height="120" fill="url(#gxph)"/><g opacity=".8"><circle cx="20" cy="18" r="5" fill="#FFD08A"/><circle cx="56" cy="12" r="5" fill="#9EE6E2"/><circle cx="104" cy="16" r="5" fill="#FFB3C0"/><circle cx="140" cy="22" r="5" fill="#FFD08A"/></g><path d="M62,120 L66,82 Q70,68 80,66 Q90,68 94,82 L98,120Z" fill="#5C82B8"/><path d="M68,74 L54,34 L60,31 L73,70Z M92,74 L106,34 L100,31 L87,70Z" fill="#5C82B8"/><ellipse cx="80" cy="56" rx="10" ry="12" fill="#7A4B32"/><text x="10" y="112" font-family="'Courier New',monospace" font-size="9" font-weight="700" fill="#FF8A2A">'98 11 21</text></svg>`,
  cassette:() => `<svg viewBox="0 0 120 90" role="img" aria-label="A cassette and a radio"><rect width="120" height="90" fill="#3B2412"/><rect x="14" y="20" width="92" height="56" rx="6" fill="#E9C46A"/><rect x="24" y="28" width="72" height="22" rx="3" fill="#F5EBDC"/><text x="60" y="43" text-anchor="middle" font-family="'Caveat',cursive" font-size="12" fill="#7A3B2E">Mix '98</text><circle cx="42" cy="62" r="7" fill="#2B1A0E"/><circle cx="78" cy="62" r="7" fill="#2B1A0E"/><circle cx="42" cy="62" r="2.5" fill="#E9C46A"/><circle cx="78" cy="62" r="2.5" fill="#E9C46A"/><path d="M49 62h22" stroke="#2B1A0E" stroke-width="3"/></svg>`,
  stream:() => `<svg viewBox="0 0 120 90" role="img" aria-label="A streaming app on a screen"><rect width="120" height="90" fill="#141640"/><rect x="12" y="12" width="96" height="60" rx="6" fill="#0B0D26" stroke="#5B6CFF" stroke-width="1.5"/>${[0,1,2].map(i => `<rect x="${20 + i * 28}" y="20" width="24" height="16" rx="3" fill="${["#E599F7","#4DABF7","#69DB7C"][i]}" opacity=".85"/>`).join("")}${[0,1,2].map(i => `<rect x="${20 + i * 28}" y="42" width="24" height="16" rx="3" fill="${["#FFD43B","#FF8787","#9775FA"][i]}" opacity=".85"/>`).join("")}<circle cx="60" cy="47" r="10" fill="#fff"/><path d="M57 42l8 5-8 5z" fill="#141640"/><rect x="40" y="76" width="40" height="4" rx="2" fill="#5B6CFF"/></svg>`,
  map:() => `<svg viewBox="0 0 120 90" role="img" aria-label="A paper map"><rect width="120" height="90" fill="#4A3320"/><path d="M14 18l30-8 32 8 30-8v62l-30 8-32-8-30 8z" fill="#F3E3C2"/><path d="M44 10v62M76 18v62" stroke="#C9A877" stroke-width="1.5"/><path d="M20 50q20-24 40-6t40-10" fill="none" stroke="#C0392B" stroke-width="2.5" stroke-dasharray="4 3"/><circle cx="96" cy="34" r="4" fill="#C0392B"/><path d="M22 30h14M24 64h12M84 60h14" stroke="#8A6A40" stroke-width="2"/></svg>`,
  share:() => `<svg viewBox="0 0 120 90" role="img" aria-label="A phone sending a photo"><rect width="120" height="90" fill="#12204A"/><rect x="40" y="8" width="40" height="74" rx="8" fill="#0B0D26" stroke="#74C0FC" stroke-width="2"/><rect x="46" y="18" width="28" height="22" rx="3" fill="#FFA94D"/><circle cx="52" cy="25" r="3" fill="#FFE8A3"/><path d="M46 40l9-9 7 6 5-4 7 7z" fill="#2F9E44"/><rect x="46" y="46" width="22" height="8" rx="4" fill="#4DABF7"/><path d="M86 30l22-10-8 24-5-9z" fill="#E599F7"/><path d="M95 35l5-9" stroke="#12204A" stroke-width="1.5"/></svg>`,
  music:() => `<svg viewBox="0 0 120 90" role="img" aria-label="Headphones — wired and wireless"><defs><linearGradient id="gxmu" x1="0" x2="1"><stop offset=".5" stop-color="#4A2E14"/><stop offset=".5" stop-color="#141640"/></linearGradient></defs><rect width="120" height="90" fill="url(#gxmu)"/><path d="M30 56a30 30 0 0 1 60 0" fill="none" stroke="#DEE2E6" stroke-width="6" stroke-linecap="round"/><rect x="22" y="50" width="16" height="24" rx="6" fill="#E9C46A"/><rect x="82" y="50" width="16" height="24" rx="6" fill="#74C0FC"/><path d="M30 74q0 10-14 10" fill="none" stroke="#E9C46A" stroke-width="2.5"/><path d="M104 40q6 6 0 12M108 36q10 10 0 20" fill="none" stroke="#74C0FC" stroke-width="2" stroke-linecap="round"/></svg>`,
  park:() => `<svg viewBox="0 0 120 90" role="img" aria-label="Friends in the park"><defs><linearGradient id="gxpk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD8A8"/><stop offset="1" stop-color="#A5D8FF"/></linearGradient></defs><rect width="120" height="90" fill="url(#gxpk)"/><rect y="62" width="120" height="28" fill="#69DB7C"/><circle cx="22" cy="44" r="14" fill="#2F9E44"/><rect x="20" y="52" width="4" height="14" fill="#7A4B32"/><circle cx="100" cy="40" r="16" fill="#37B24D"/><rect x="98" y="50" width="4" height="16" fill="#7A4B32"/><rect x="40" y="58" width="40" height="5" rx="2" fill="#A0522D"/><circle cx="50" cy="46" r="5" fill="#7A4B32"/><circle cx="62" cy="45" r="5" fill="#E8BA9C"/><circle cx="74" cy="46" r="5" fill="#D9A07E"/><path d="M45 58v-6h10v6M57 58v-7h10v7M69 58v-6h10v6" fill="#5C82B8"/></svg>`,
  brick:() => `<svg viewBox="0 0 200 200" role="img" aria-label="A huge old mobile phone from the 1990s"><defs><linearGradient id="gxbr" x1="0" x2="1"><stop offset="0" stop-color="#2B2B33"/><stop offset=".5" stop-color="#4A4A55"/><stop offset="1" stop-color="#2B2B33"/></linearGradient></defs><rect x="76" y="6" width="10" height="40" rx="4" fill="#1E1E24"/><rect x="58" y="36" width="84" height="158" rx="14" fill="url(#gxbr)" stroke="#111" stroke-width="2"/><rect x="70" y="52" width="60" height="30" rx="4" fill="#9BBF7A"/><text x="100" y="72" text-anchor="middle" font-family="'VT323',monospace" font-size="16" fill="#26341A">1998</text>${[0,1,2,3].map(r => [0,1,2].map(c => `<rect x="${72 + c * 20}" y="${96 + r * 22}" width="16" height="14" rx="3" fill="#6B6B78"/>`).join("")).join("")}<rect x="88" y="184" width="24" height="4" rx="2" fill="#111"/></svg>`,
  box:() => `<svg viewBox="0 0 320 220" role="img" aria-label="Dad's old cardboard box with photos, diary pages and a cassette"><defs><linearGradient id="gxbx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A4E"/><stop offset="1" stop-color="#8A5A2E"/></linearGradient></defs><ellipse cx="160" cy="206" rx="140" ry="10" fill="rgba(0,0,0,.35)"/><path d="M40 90h240v110H40z" fill="url(#gxbx)"/><path d="M40 90l-26-30h240l26 30z" fill="#D9A766"/><path d="M280 90l26-30-6-10-20 30z" fill="#B07A40"/><g transform="rotate(-10 110 70)"><rect x="80" y="30" width="62" height="74" fill="#F5EBDC"/><rect x="86" y="36" width="50" height="46" fill="#6E4A5E"/><text x="90" y="98" font-family="'Courier New',monospace" font-size="8" fill="#FF8A2A">'98 11 07</text></g><g transform="rotate(6 190 60)"><rect x="160" y="26" width="70" height="86" fill="#FBF3E2"/>${[0,1,2,3,4,5].map(i => `<path d="M168 ${40 + i * 11}h${i % 2 ? 40 : 52}" stroke="#7A6650" stroke-width="2" opacity=".6"/>`).join("")}</g><g transform="rotate(-4 240 80)"><rect x="214" y="58" width="58" height="38" rx="4" fill="#E9C46A"/><rect x="222" y="64" width="42" height="12" fill="#F5EBDC"/><circle cx="232" cy="86" r="5" fill="#2B1A0E"/><circle cx="254" cy="86" r="5" fill="#2B1A0E"/></g><text x="160" y="160" text-anchor="middle" font-family="'Special Elite',monospace" font-size="20" fill="#3A2412">DAN — 1998</text></svg>`
};
const sortArt = (les, id) => { const fn = ART[id]; return pic(((les.media || {}).sort || {})[id], "", fn ? fn() : "", "sortpic"); };

/* ---------- чат ---------- */
function face(les, who){
  const c = les.characters[who] || {};
  const ch = esc((c.name || "?")[0]);
  if (c.img){ const f = c.face || { x:50, y:38 };
    return `<span class="gx-ava" data-ch="${ch}"><img src="${esc(c.img)}" alt="" decoding="async" style="object-position:${f.x}% ${f.y}%;transform-origin:${f.x}% ${f.y}%;transform:scale(1.9)" onerror="this.parentNode.classList.add('mono');this.parentNode.textContent=this.parentNode.dataset.ch"></span>`; }
  return `<span class="gx-ava mono" aria-hidden="true">${ch}</span>`;
}
function bubble(les, m){
  if (m.sys) return `<div class="gx-sys">${esc(m.sys)}</div>`;
  const c = les.characters[m.who] || { name:m.who };
  return `<div class="gx-msg who-${esc(m.who)} ${m.me ? "me" : ""}">${m.me ? "" : face(les, m.who)}<div class="gx-bub"><b class="gx-name">${esc(c.name)}</b><span>${esc(m.t)}</span></div></div>`;
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
    const t = document.createElement("div"); t.className = "gx-typing" + (m.me ? " me" : "");
    t.innerHTML = `<span class="gx-tdots" aria-hidden="true"><i></i><i></i><i></i></span>${esc((les.characters[m.who] || {}).name || "Someone")} is typing…`;
    box.appendChild(t); scroll();
    later(() => {
      if (stop()) return; t.remove();
      box.insertAdjacentHTML("beforeend", bubble(les, m)); scroll();
      Snd.ping(); if (o.each) o.each(m);
      later(step, 560);
    }, Math.min(1700, 520 + String(m.t || "").length * 14));
  };
  later(step, o.delay || 300);
}
const phone = (les, who, o) => { o = o || {}; const c = les.characters[who] || { name:who };
  return `<div class="gx-phone ${o.cls || ""}"><div class="gx-phone-head">${face(les, who)}<div><b>${esc(c.name)}</b><small>${esc(o.status || "online")}</small></div><span class="gx-phone-dot" aria-hidden="true"></span></div>
    <div class="gx-thread" id="${o.id || "th"}" aria-live="polite">${o.inner || ""}</div>${o.foot ? `<div class="gx-phone-foot">${o.foot}</div>` : ""}</div>`; };
function chatOnce(box, les, items, A, flag, o){
  o = o || {};
  if (!box) return;
  if (A[flag] || !anim()){ box.innerHTML = chatHTML(les, items); box.scrollTop = box.scrollHeight; A[flag] = true; save(); if (o.done) o.done(true); return; }
  playChat(box, les, items, { delay:o.delay || 400, stopped:o.stopped, done: () => { A[flag] = true; save(); if (o.done) o.done(false); } });
}
function typewrite(node, text, o){
  o = o || {}; if (!node) return;
  if (!anim() || o.instant){ node.textContent = text; if (o.done) o.done(); return; }
  node.textContent = ""; node.classList.add("gx-caret"); let i = 0;
  const tick = () => { if (!node.isConnected) return; node.textContent = text.slice(0, ++i); if (i < text.length) later(tick, o.speed || 32); else { node.classList.remove("gx-caret"); if (o.done) o.done(); } };
  later(tick, o.delay || 200);
}
/* конфеті (коротке, ненав'язливе) */
function confetti(host){
  if (!anim() || !host) return;
  const n = document.createElement("div"); n.className = "gx-confetti"; n.setAttribute("aria-hidden", "true");
  const C = ["#F2A541", "#FFD27A", "#7EE0E6", "#8F7CFF", "#FF7EA8", "#B5F06B"];
  n.innerHTML = Array.from({ length:46 }, (_, i) => `<i style="--x:${Math.round(Math.random() * 100)}%;--d:${(Math.random() * .6).toFixed(2)}s;--r:${Math.round(Math.random() * 720 - 360)}deg;--c:${C[i % C.length]};--s:${(.7 + Math.random() * .7).toFixed(2)}"></i>`).join("");
  host.appendChild(n); setTimeout(() => n.remove(), 2600);
}

/* ============================================================
   MISSION 1 · gxOpen — кінематографічний початок: фото 1998, вібрація, чат з татом
   data: { scene, chat:[msgs], partner }
   ============================================================ */
define("gxOpen", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "open");
  const first = !A.seen && anim();
  const ph = pic(media(les, "photo"), media(les, "photoAlt"), ART.photo(), "polar");
  el.innerHTML = `<div class="story-screen gx-open ${first ? "intro" : ""}">
      <p class="gx-osd gx-open-osd" aria-hidden="true">▶ PLAY&nbsp;&nbsp;SAT 18:12</p>
      <h2 class="sr-only" id="stitle" tabindex="-1">Mission 1: The Message</h2>
      <p class="gx-open-scene"><span class="sr-only">${esc(d.scene)}</span><span aria-hidden="true" id="tw"></span></p>
      <div class="gx-open-grid">
        <figure class="gx-open-photo"><span class="gx-polar">${ph}<span class="gx-grain" aria-hidden="true"></span></span><figcaption>21 November 1998 · City Sound</figcaption></figure>
        <div class="gx-open-phone" id="op" ${A.seen || !first ? "" : "hidden"}>
          <div class="gx-roles" role="note">${icon("mic")} Read it aloud: <b>you</b> = Marko · <b>your teacher</b> = Dad</div>
          ${phone(les, "dad", { id:"th", cls:"buzzable", foot:`<button class="btn small" type="button" data-replay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-all>Show all</button>` })}
        </div>
      </div>
      <div class="gx-partner" id="pt" ${A.chatDone ? "" : "hidden"}>${face(les, "marko")}<p><b>Marko:</b> ${esc(d.partner)}</p><button class="btn primary big" type="button" data-in>${A.in ? "✓ I'm in! 🔎" : "I'm in! 🔎"}</button></div>
    </div>`;
  const th = $("#th", el); let gen = 0;
  const finish = () => { A.chatDone = true; save(); const p = $("#pt", el); if (p && p.hidden){ p.hidden = false; p.classList.add("gx-in"); scrollTo(p, "center"); } };
  const run = () => { gen++; const my = gen; th.innerHTML = ""; playChat(th, les, d.chat, { delay:700, stopped: () => my !== gen, done: finish }); };
  const showAll = () => { gen++; th.innerHTML = chatHTML(les, d.chat); th.scrollTop = th.scrollHeight; finish(); };
  const start = () => {
    const op = $("#op", el); op.hidden = false; op.classList.add("gx-buzz"); Snd.buzz();
    later(() => op.classList.remove("gx-buzz"), 900);
    run();
  };
  typewrite($("#tw", el), d.scene, { instant: !first, delay:500, speed:30, done: () => { A.seen = true; save(); if (first) later(start, 700); } });
  if (!first){ if (A.chatDone || !anim()) showAll(); else run(); }
  el.onclick = e => {
    if (e.target.closest("[data-replay]")){ run(); return; }
    if (e.target.closest("[data-all]")){ showAll(); return; }
    if (e.target.closest("[data-in]")){ A.in = true; save(); Snd.unlock(); ctx.next(); }
  };
  ctx.setCTA({ label:"I'm in — let's investigate →", action: () => { A.in = true; save(); ctx.next(); } });
}, { story:true, label: () => "Dad's message" });

/* ============================================================
   gxTalk — усні питання по одному, з кнопкою Done
   data: { qs:[{q,ua,starter,ex,fu}], title, intro, ua, cta }
   ============================================================ */
define("gxTalk", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, A = store(ctx, scr, "talk"); const n = d.qs.length;
  A.i = Math.min(A.i || 0, n - 1);
  const draw = () => {
    const i = A.i, q = d.qs[i];
    el.innerHTML = `${head(ctx, d.title, d.intro, { kicker:`Mission ${pad2(ctx.scr.stage.n)} · Speaking`, ua:d.ua })}
      <div class="card gx-talk">
        <div class="gx-qtop"><span>Question ${i + 1} of ${n}</span><span class="gx-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : (A.done || {})["q" + k] ? "past" : ""}"></i>`).join("")}</span></div>
        ${spk(ctx, "q" + i, q, A)}
        <div class="row gx-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>`;
    ctx.setCTA({ label: d.cta || "Continue" });
  };
  el.onclick = e => {
    if (spkClick(e, A, el)) return;
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); OPEN.clear(); save(); draw(); }
  };
  draw();
}, { label: () => "3 questions" });

/* ============================================================
   gxPredict — прогноз «Who had it better?» + коробка тата + відкриття розслідування
   data: { predict:{q,ua,o,why,whyUa}, box:{intro,items,mission} }
   ============================================================ */
define("gxPredict", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "predict"), g = GX(ctx); A.seen = A.seen || {};
  const P = d.predict, B = d.box;
  let freshBox = false, freshMission = false;
  const files = () => `<ol class="gx-slots">${EVS(les).map(x => `<li class="${g.ev[x.id] ? "on" : ""}"><span>${x.n}</span>${icon(g.ev[x.id] ? x.icon : "lock")}<b>${esc(x.cat)}</b></li>`).join("")}</ol>`;
  const draw = () => {
    const nSeen = Object.keys(A.seen).length;
    el.innerHTML = `${head(ctx, "Make Your Prediction", "Before the investigation starts: what do you think?", { kicker:"Mission 01 · Prediction", ua:"Перш ніж почати розслідування: що ти думаєш?" })}
      <section class="gx-predict">
        <div class="gx-qrow"><p class="gx-bigq">${esc(P.q)}</p>${say(P.q)}${uaBtn("pq-ua", "")}</div>${uaBox("pq-ua", esc(P.ua))}
        <div class="gx-teams">${P.o.map(o => `<button class="gx-team t${o.id} ${g.pred === o.id ? "on" : ""}" type="button" data-pred="${o.id}" aria-pressed="${g.pred === o.id}"><span class="gx-team-e" aria-hidden="true">${o.e}</span><b>${esc(o.t)}</b>${g.pred === o.id ? `<small>${icon("lock")} Saved</small>` : ""}</button>`).join("")}</div>
        ${g.pred ? `<div class="gx-sealed-pred ix-reveal">${icon("lock")}<p><b>Prediction saved.</b> We'll check it in Mission 7. <span class="muted">${esc(P.why)}</span></p>${uaBtn("pw-ua", "")}</div>${uaBox("pw-ua", esc(P.whyUa))}` : ""}
      </section>
      ${A.box ? `<section class="gx-boxwrap ${freshBox ? "gx-in" : ""}">
          <div class="gx-phone slim"><div class="gx-thread" id="bt">${A.boxChat ? chatHTML(les, B.intro) : ""}</div></div>
          <div class="gx-box">
            <div class="gx-box-art">${pic(media(les, "box"), "Dad's old box", ART.box(), "box")}</div>
            <div class="gx-box-items">${B.items.map(it => `<button class="gx-bitem ${A.seen[it.id] ? "on" : ""}" type="button" data-bitem="${it.id}" aria-pressed="${!!A.seen[it.id]}">${icon(it.id === "photos" ? "photo" : it.id === "diary" ? "book" : "tape")}<span><b>${esc(it.t)}</b>${A.seen[it.id] ? `<small>${esc(it.s)}</small>` : `<small>Tap to look</small>`}</span></button>`).join("")}</div>
          </div>
          ${nSeen ? `<div class="gx-open-case ${freshMission ? "gx-in" : ""}"><span class="gx-osd">${icon("search")} ${esc(B.mission.k)}</span><h3>${esc(B.mission.t)}</h3><p>${esc(B.mission.s)}</p>${files()}</div>` : ""}
        </section>` : ""}`;
    if (A.box){ const bt = $("#bt", el); if (!A.boxChat) chatOnce(bt, les, B.intro, A, "boxChat", { delay:300 }); }
    if (!g.pred) ctx.setCTA({ label:"Choose a team first", action: () => toast("Choose Team 1998, Team 2026 or Not sure yet.") });
    else if (!A.box) ctx.setCTA({ label:"Open Dad's box 📦", action: openBox });
    else ctx.setCTA({ label:"Start Mission 2 →" });
    freshBox = freshMission = false;
  };
  const openBox = () => { A.box = true; freshBox = true; save(); Snd.vhs(); draw(); scrollTo($(".gx-boxwrap", el), "start"); };
  el.onclick = e => {
    const p = e.target.closest("[data-pred]"); if (p){ g.pred = p.dataset.pred; A.at = Date.now(); save(); Snd.stamp(); draw(); return; }
    const b = e.target.closest("[data-bitem]");
    if (b){ const first = !Object.keys(A.seen).length; A.seen[b.dataset.bitem] = true; save(); Snd.pop(); if (first) freshMission = true; draw(); if (first) scrollTo($(".gx-open-case", el), "center"); }
  };
  draw();
}, { label: () => "Prediction + box" });

/* ============================================================
   MISSION 2 · gxSort — Time Sort: 1998 / Both / 2026
   data: { sort:{intro,ua,items:[{id,t,a,why,ua}]} }
   ============================================================ */
define("gxSort", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data.sort, les = ctx.les, A = store(ctx, scr, "sort"); A.r = A.r || {};
  const LB = { "98":"1998", both:"Both", "26":"2026" };
  let fresh = null, shake = null;
  const draw = () => {
    const done = d.items.filter(x => mcqDone(A.r[x.id])).length, first = d.items.filter(x => A.r[x.id] && A.r[x.id].first).length;
    el.innerHTML = `${head(ctx, "Time Sort", d.intro, { kicker:"Mission 02 · Activity 1", ua:d.ua })}
      <div class="gx-sortgrid">${d.items.map((x, k) => { const R = A.r[x.id] = A.r[x.id] || {}; const ok = mcqDone(R); const wrong = R.wrong || [];
        return `<article class="gx-sc ${ok ? "done a" + x.a : ""} ${shake === x.id ? "shake" : ""} ${fresh === x.id ? "gx-pop" : ""}" style="--k:${k}">
          <div class="gx-sc-pic">${sortArt(les, x.id)}${ok ? `<span class="gx-sc-stamp a${x.a}">${LB[x.a]}</span>` : ""}</div>
          <p class="gx-sc-t">${esc(x.t)}</p>
          <div class="gx-sc-btns" role="group" aria-label="1998, both or 2026">${["98", "both", "26"].map(v => `<button class="gx-sb v${v} ${ok && x.a === v ? "good" : ""} ${wrong.includes(v) ? "bad" : ""}" type="button" data-sort="${x.id}:${v}" ${ok || wrong.includes(v) ? "disabled" : ""}>${v === "98" ? "📼 1998" : v === "26" ? "2026 📱" : "Both"}</button>`).join("")}</div>
          <div aria-live="polite">${ok ? `<p class="gx-sc-why ${R.first ? "good" : ""}">${R.first ? "✓ " : ""}${esc(x.why)} ${uaBtn("so-" + x.id, "")}</p>${uaBox("so-" + x.id, esc(x.ua))}` : wrong.length ? `<p class="gx-sc-why amber">Not quite — think again!</p>` : ""}</div>
        </article>`; }).join("")}</div>
      <div class="row gx-under"><span class="pill ${done === d.items.length ? "good" : ""}">${done} / ${d.items.length} sorted</span>${done === d.items.length ? `<span class="pill accent">★ ${first} right first time</span>` : ""}${ctx.teacher && done < d.items.length ? `<button class="btn small ghost" type="button" data-sortall>Reveal all</button>` : ""}</div>`;
    ctx.setCTA({ label: done === d.items.length ? "Time Machine: spot the difference →" : "Continue" });
    fresh = shake = null;
  };
  el.onclick = e => {
    const b = e.target.closest("[data-sort]");
    if (b){ const [id, v] = b.dataset.sort.split(":"); const x = d.items.find(i => i.id === id); const R = A.r[id];
      if (mcqDone(R)) return;
      if (v === x.a){ R.ok = true; R.first = !(R.wrong && R.wrong.length); fresh = id; Snd.pop(); }
      else { R.wrong = (R.wrong || []).concat(v); shake = id; Snd.nope(); if (R.wrong.length >= 2) R.shown = true; }
      save(); draw(); const card = $(`[data-sort^="${id}:"]`, el); if (card) card.closest(".gx-sc").scrollIntoView({ block:"nearest" }); return; }
    if (e.target.closest("[data-sortall]")){ d.items.forEach(x => { const R = A.r[x.id] = A.r[x.id] || {}; if (!mcqDone(R)) R.shown = true; }); save(); draw(); }
  };
  draw();
}, { label: () => "Time Sort" });

/* ============================================================
   gxTimeMachine — кімната 1998 ⇄ 2026 (половини картинки з Уроку 7), точки, 3 відмінності
   data: { m:{intro,ua,frames,pairs:[{a,b,ex}],review} }
   Картинка — les.media.rooms {src, alt98, alt26, y98:[hot], y26:[hot]}; без неї — намальовані кімнати
   ============================================================ */
const FB_HOT = {
  y98:[{ id:"computer", x:26, y:44, t:"a huge computer" }, { id:"phone", x:50, y:52, t:"a home phone" }, { id:"cds", x:74, y:50, t:"CDs and cassettes" }, { id:"photos", x:76, y:18, t:"printed photos" }, { id:"poster", x:16, y:20, t:"a concert poster", s:"b" }],
  y26:[{ id:"laptop", x:34, y:46, t:"a laptop" }, { id:"phone", x:58, y:52, t:"a smartphone" }, { id:"social", x:78, y:18, t:"social media", s:"b" }, { id:"stream", x:26, y:20, t:"music streaming", s:"b" }, { id:"phones", x:86, y:56, t:"wireless headphones", s:"l" }]
};
function room98(){
  return `<svg class="gx-room" viewBox="0 0 488 400" role="img" aria-label="A teenager's bedroom in 1998" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gr98" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B4426"/><stop offset="1" stop-color="#2E1D12"/></linearGradient><radialGradient id="gl98" cx=".7" cy=".15" r=".8"><stop offset="0" stop-color="#FFC56B" stop-opacity=".55"/><stop offset="1" stop-color="#FFC56B" stop-opacity="0"/></radialGradient></defs>
    <rect width="488" height="400" fill="url(#gr98)"/><rect x="40" y="36" width="80" height="110" rx="3" fill="#B03A48"/><text x="80" y="82" text-anchor="middle" font-family="'Special Elite',monospace" font-size="15" fill="#FFE8B0">LIVE</text><text x="80" y="102" text-anchor="middle" font-family="'Special Elite',monospace" font-size="10" fill="#FFE8B0">CITY SOUND</text>
    <g transform="translate(340,40) rotate(-6)"><rect width="44" height="52" fill="#F5EBDC"/><rect x="4" y="4" width="36" height="34" fill="#6E4A5E"/></g><g transform="translate(384,48) rotate(7)"><rect width="44" height="52" fill="#F5EBDC"/><rect x="4" y="4" width="36" height="34" fill="#4A6E74"/></g>
    <rect x="0" y="262" width="488" height="138" fill="#24170E"/><rect x="18" y="214" width="320" height="18" rx="3" fill="#8A5A34"/><rect x="32" y="232" width="14" height="110" fill="#6E4628"/><rect x="306" y="232" width="14" height="110" fill="#6E4628"/>
    <rect x="62" y="110" width="132" height="104" rx="10" fill="#D8CFB8"/><rect x="74" y="122" width="108" height="76" rx="8" fill="#16301F"/><path d="M86 140h50M86 154h70M86 168h40" stroke="#5BE38A" stroke-width="4" opacity=".8"/><rect x="58" y="218" width="120" height="12" rx="2" fill="#E6DECA"/>
    <g transform="translate(222,186)"><rect width="56" height="28" rx="7" fill="#B23A3A"/><path d="M5 3q23-20 46 0" fill="none" stroke="#B23A3A" stroke-width="10" stroke-linecap="round"/><circle cx="28" cy="15" r="6" fill="#E9E2CF"/></g>
    <rect x="340" y="170" width="50" height="90" rx="3" fill="#3C3C46"/>${[0,1,2,3,4,5,6].map(i => `<rect x="345" y="${175 + i * 12}" width="40" height="8" fill="${["#E9C46A","#E76F51","#2A9D8F","#F4A261","#8AB17D","#E5989B","#E9C46A"][i]}"/>`).join("")}
    <rect width="488" height="400" fill="url(#gl98)"/></svg>`;
}
function room26(){
  return `<svg class="gx-room" viewBox="0 0 488 400" role="img" aria-label="A teenager's bedroom in 2026" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gr26" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B1748"/><stop offset="1" stop-color="#0D0F2A"/></linearGradient><linearGradient id="gled" x1="0" x2="1"><stop offset="0" stop-color="#9775FA"/><stop offset=".5" stop-color="#4DABF7"/><stop offset="1" stop-color="#E599F7"/></linearGradient></defs>
    <rect width="488" height="400" fill="url(#gr26)"/><rect y="12" width="488" height="5" fill="url(#gled)"/><rect y="14" width="488" height="30" fill="url(#gled)" opacity=".14"/>
    <g transform="translate(40,54)"><rect width="150" height="76" rx="12" fill="#151A3D" stroke="#4C5BD4" stroke-width="2"/><circle cx="28" cy="38" r="16" fill="#7950F2"/><path d="M23 29l13 9-13 9z" fill="#fff"/>${[0,1,2,3,4,5,6,7,8].map(i => `<rect x="${56 + i * 10}" y="${50 - (i * 7 % 26)}" width="6" height="${10 + (i * 7 % 26)}" rx="2" fill="#74C0FC"/>`).join("")}</g>
    <g transform="translate(316,48)"><rect width="130" height="36" rx="18" fill="#E64980"/><text x="65" y="24" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="14" fill="#fff">♥ 128 likes</text></g>
    <rect x="0" y="262" width="488" height="138" fill="#0A0B20"/><rect x="24" y="222" width="360" height="12" rx="3" fill="#2B2F5A"/><rect x="40" y="234" width="10" height="100" fill="#22264C"/><rect x="356" y="234" width="10" height="100" fill="#22264C"/>
    <path d="M100 222l14-70h118l14 70z" fill="#2A2F5F"/><rect x="118" y="158" width="108" height="56" rx="4" fill="#0F1433"/><rect x="126" y="166" width="44" height="20" rx="2" fill="#E599F7" opacity=".85"/><rect x="174" y="166" width="44" height="20" rx="2" fill="#4DABF7" opacity=".85"/>
    <g transform="translate(270,176) rotate(-10)"><rect width="32" height="58" rx="6" fill="#111" stroke="#9775FA" stroke-width="2"/><rect x="4" y="8" width="24" height="40" rx="2" fill="#5F3DC4"/></g><circle cx="312" cy="170" r="10" fill="#FA5252"/><text x="312" y="175" text-anchor="middle" font-family="Manrope,sans-serif" font-size="12" font-weight="800" fill="#fff">9</text>
    <g transform="translate(400,196)"><path d="M8 28a22 22 0 0 1 44 0" fill="none" stroke="#DEE2E6" stroke-width="7" stroke-linecap="round"/><rect x="0" y="24" width="15" height="26" rx="6" fill="#DEE2E6"/><rect x="45" y="24" width="15" height="26" rx="6" fill="#DEE2E6"/></g></svg>`;
}
define("gxTimeMachine", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data.m, les = ctx.les, A = store(ctx, scr, "machine"), g = GX(ctx); A.hot = A.hot || {}; A.pair = A.pair || {};
  const R = media(les, "rooms");
  let photoOK = !!(R && R.src), side = !!A.side, freshPair = null;
  const dots = (era, list) => list.map(h => { const k = era + ":" + h.id; const on = !!A.hot[k];
    return `<button class="gx-hot y${era} s-${h.s || (h.x > 70 ? "l" : "r")} ${on ? "on" : ""}" type="button" data-hot="${k}" style="left:${h.x}%;top:${h.y}%" aria-pressed="${on}" aria-label="${esc(h.t)}"><i aria-hidden="true"></i><span>${esc(h.t)}</span></button>`; }).join("");
  const room = era => {
    const hot = photoOK ? R["y" + era] : FB_HOT["y" + era];
    const inner = photoOK
      ? `<img class="gx-half h${era}" src="${esc(R.src)}" alt="${esc(R["alt" + era] || "")}" decoding="async" data-rooms>`
      : (era === "98" ? room98() : room26());
    return `<div class="gx-room-in e${era}">${inner}${dots(era, hot)}<span class="gx-room-y" aria-hidden="true">${ERA[era].y}</span></div>`;
  };
  const scene = () => side
    ? `<div class="gx-tm-side">${room("98")}${room("26")}</div>`
    : `<div class="gx-tm-stage era${g.era}" id="tms"><div class="gx-tm-layer l98 ${g.era === "98" ? "on" : ""}">${room("98")}</div><div class="gx-tm-layer l26 ${g.era === "26" ? "on" : ""}">${room("26")}</div><i class="gx-tm-scan" aria-hidden="true"></i><span class="gx-osd gx-tm-osd" aria-hidden="true">${g.era === "98" ? "▶ PLAY · SAT 07 NOV 1998" : "● LIVE · 2026"}</span></div>`;
  const nPairs = () => Object.keys(A.pair).filter(k => A.pair[k]).length;
  const draw = () => {
    const n = nPairs();
    el.innerHTML = `${head(ctx, "The Time Machine", d.intro, { kicker:"Mission 02 · Spot the difference", ua:d.ua })}
      <div class="gx-tm">
        <div class="gx-tm-ctrl">${eraSwitch(g, "big")}<span class="spacer"></span><button class="btn small ghost" type="button" data-side aria-pressed="${side}">${side ? "◀ One room at a time" : "Side by side ▶"}</button></div>
        <div id="scene">${scene()}</div>
        <p class="gx-tip">${icon("eye")} Tap the dots to name things. Switch the year to travel in time.</p>
      </div>
      <div class="gx-tm-grid">
        <div class="card gx-diffs">
          <div class="gx-diffs-top"><h3 class="gx-h">${icon("mic")} Describe 3 differences</h3><span class="gx-count ${n >= 3 ? "ok" : ""}" aria-live="polite">${Math.min(n, 3)} / 3</span></div>
          <ul class="gx-frames">${d.frames.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
          <p class="gx-small">Tap a pair when you describe it:</p>
          <div class="gx-pairs">${d.pairs.map((p, i) => `<button class="gx-pair ${A.pair[i] ? "on" : ""} ${freshPair === i ? "gx-pop" : ""}" type="button" data-pair="${i}" aria-pressed="${!!A.pair[i]}"><span class="e98">${esc(p.a)}</span><i aria-hidden="true">→</i><span class="e26">${esc(p.b)}</span>${A.pair[i] ? icon("check") : ""}</button>`).join("")}</div>
          ${ctx.teacher ? `${foldBtn("tm-ex", "🧑‍🏫 Model sentences", "teach")}${foldBox("tm-ex", `<ul class="gx-models">${d.pairs.map(p => `<li>“${esc(p.ex)}”</li>`).join("")}</ul>`, "gx-sample")}` : ""}
          ${n >= 3 ? `<div class="note good">✓ Three differences! Great comparing.</div>` : ""}
        </div>
        <div class="card gx-review"><h3 class="gx-h">${icon("star")} Bonus: words from Lesson 7</h3><p class="gx-small">Can you use one of these in your description?</p><div class="gx-chips">${d.review.map(w => `<span class="gx-chip-w">${esc(w)}</span>`).join("")}</div><p class="gx-small muted">e.g. “Dad's computer was huge!” · “Marko's room looks more relaxed.”</p></div>
      </div>`;
    const imgs = $$("[data-rooms]", el); imgs.forEach(img => { img.onerror = () => { if (photoOK){ photoOK = false; draw(); } }; });
    ctx.setCTA({ label: n >= 3 ? "Collect the evidence →" : "Continue" });
    freshPair = null;
  };
  CUR.onEra = era => {
    const st = $("#tms", el); if (!st) return;
    st.className = "gx-tm-stage era" + era;
    $$(".gx-tm-layer", st).forEach(l => l.classList.toggle("on", l.classList.contains("l" + era)));
    const o = $(".gx-tm-osd", st); if (o) o.textContent = era === "98" ? "▶ PLAY · SAT 07 NOV 1998" : "● LIVE · 2026";
    if (anim()){ st.classList.add("glitch"); later(() => st.classList.remove("glitch"), 520); }
  };
  el.onclick = e => {
    const h = e.target.closest("[data-hot]");
    if (h){ const k = h.dataset.hot; A.hot[k] = !A.hot[k]; save(); h.classList.toggle("on", A.hot[k]); h.setAttribute("aria-pressed", String(A.hot[k])); if (A.hot[k]) Snd.pop(); return; }
    const p = e.target.closest("[data-pair]");
    if (p){ const i = +p.dataset.pair; A.pair[i] = !A.pair[i]; save(); if (A.pair[i]){ freshPair = i; Snd.pop(); if (nPairs() === 3) Snd.unlock(); } draw(); const b = $(`[data-pair="${i}"]`, el); if (b) b.focus({ preventScroll:true }); return; }
    if (e.target.closest("[data-side]")){ side = !side; A.side = side; save(); draw(); }
  };
  draw();
}, { label: () => "Time Machine" });

/* ============================================================
   gxEvidence — «EVIDENCE UNLOCKED»: картка доказу + усне питання детектива
   data: { ids:[..], exhibit?, mission, final?, cta }
   ============================================================ */
define("gxEvidence", (el, scr, ctx) => {
  frame(el, ctx);
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "ev"), g = GX(ctx);
  const fresh = unlockEv(ctx, d.ids);
  if (d.exhibit && !g.exhibit){ g.exhibit = Date.now(); save(); }
  const ids = d.ids; if (A.tab == null || !ids.includes(A.tab)) A.tab = ids[0];
  const play = fresh.length && anim();
  const draw = (intro) => {
    const x = evOf(les, A.tab), n = Object.keys(g.ev).length;
    el.innerHTML = `${bar(ctx)}
      <header class="gx-evhead ${intro ? "stamp" : ""}">
        <p class="gx-osd">${icon("file")} ${d.final ? "FINAL EVIDENCE" : "NEW EVIDENCE"} · MISSION ${pad2(d.mission)} COMPLETE</p>
        <h2 class="stitle gx-title" id="stitle" tabindex="-1">${ids.length > 1 ? "Evidence " + ids.map(i => evOf(les, i).n).join(" + ") + " unlocked" : "Evidence " + x.n + " unlocked"}</h2>
      </header>
      ${ids.length > 1 ? `<div class="gx-evtabs" role="tablist">${ids.map(i => { const y = evOf(les, i); return `<button class="gx-evtab ${i === A.tab ? "on" : ""}" role="tab" aria-selected="${i === A.tab}" type="button" data-evtab="${i}">${icon(y.icon)} ${y.n} · ${esc(y.cat)}${g.disc[i] ? " ✓" : ""}</button>`; }).join("")}</div>` : ""}
      <div class="gx-evcase ${intro ? "drop" : ""}">
        <div class="gx-evfolder">
          <span class="gx-evtag">EVIDENCE ${x.n}</span>
          <h3>${icon(x.icon)} ${esc(x.cat)}</h3>
          <div class="gx-evcols">
            <figure class="gx-ev98"><span class="gx-ev-y">📼 1998</span><p>${esc(x.y98)}</p></figure>
            <span class="gx-evvs" aria-hidden="true">vs</span>
            <figure class="gx-ev26"><span class="gx-ev-y">2026 📱</span><p>${esc(x.y26)}</p></figure>
          </div>
        </div>
        <div class="card gx-detq">
          <p class="gx-detk">${icon("search")} Detective question</p>
          ${spk(ctx, "ev-" + x.id, { q:x.q, ua:x.ua, ex:x.ex }, { done:{ ["ev-" + x.id]: !!g.disc[x.id] } })}
          <div class="gx-tools">${foldBtn("st-" + x.id, "Sentence starters")}</div>
          ${foldBox("st-" + x.id, `<ul class="gx-starters">${x.starters.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`)}
        </div>
      </div>
      ${d.exhibit ? `<div class="gx-exwrap">${exhibitHTML(les, { fresh:intro })}<div class="card gx-detq small">${spk(ctx, "ex", { q:les.exhibit.q, ua:les.exhibit.ua, ex:"I think Dad's life wasn't as easy as he says. Communication was much harder without mobiles!" }, A, { small:true })}</div></div>` : ""}
      <div class="gx-evmini"><span>Evidence Board</span><ol>${EVS(les).map(y => `<li class="${g.ev[y.id] ? "on" : ""} ${ids.includes(y.id) ? "new" : ""}" title="${esc(y.cat)}">${y.n}</li>`).join("")}</ol><b>${n} / ${EVS(les).length}</b><button class="btn small" type="button" data-gxboard>Open the board</button></div>`;
    ctx.setCTA({ label: d.cta || "Continue" });
  };
  el.onclick = e => {
    const t = e.target.closest("[data-evtab]"); if (t){ A.tab = t.dataset.evtab; save(); OPEN.clear(); draw(false); return; }
    const b = e.target.closest("[data-spk]");
    if (b){ const id = b.dataset.spk; if (id.startsWith("ev-")){ const k = id.slice(3); g.disc[k] = !g.disc[k]; save(); if (g.disc[k]) Snd.pop(); draw(false); } else spkClick(e, A, el); }
  };
  draw(play);
  if (play){ vhs("EVIDENCE " + ids.map(i => evOf(les, i).n).join(" + ")); }
}, { label: d => "Evidence " + (d.ids || []).join(" + ") });

/* ============================================================
   MISSION 3 · gxLab — відкриття граматики: Notice → Think → Rule → Practice
   data: { lab:{id,n,t,short,notice,ask,rule,practice} }
   ============================================================ */
const hlText = (s, cls) => esc(s).replace(/\[([^\]]+)\]/g, (_, p) => `<mark class="${cls || "gx-hl"}">${esc(p)}</mark>`);
function blankFill(q, R){
  const fill = R && (R.ok || R.shown) ? `<b class="gx-blank ok">${esc(q.o[q.a])}</b>` : `<span class="gx-blank">${q.hint ? `<small>${esc(q.hint)}</small>` : "?"}</span>`;
  return esc(q.q).replace("___", fill).replace("___", "");
}
define("gxLab", (el, scr, ctx) => {
  frame(el, ctx);
  const L = scr.data.lab, les = ctx.les, A = store(ctx, scr, L.id); A.seen = A.seen || {}; A.ask = A.ask || {}; A.p = A.p || {};
  const STEPS = [{ k:"notice", t:"Notice", i:"eye" }, { k:"think", t:"Think", i:"search" }, { k:"rule", t:"Rule", i:"book" }, { k:"practice", t:"Practice", i:"flask" }];
  if (!STEPS.some(s => s.k === A.step)) A.step = "notice";
  if (A.pi == null) A.pi = 0;
  let fresh = false;
  const N = L.notice;
  const hlCount = () => N.items ? N.items.length : N.scenes ? N.scenes.length : N.comic.length;
  const stepDone = k => k === "notice" ? Object.keys(A.seen).length >= hlCount() : k === "think" ? L.ask.every((q, i) => mcqDone(A.ask[i])) : k === "rule" ? !!A.ruleSeen : L.practice.every((q, i) => mcqDone(A.p[i]));
  const noticeHTML = () => {
    if (N.items) return `<div class="gx-notice">${N.items.map((it, i) => `<button class="gx-nsent ${A.seen[i] ? "on" : ""}" type="button" data-seen="${i}" aria-pressed="${!!A.seen[i]}"><span class="gx-nsent-t">${hlText(it.t)}</span><span class="gx-nsent-r">${A.seen[i] ? `<b>${esc(it.base)}</b> → <i>${esc(it.form)}</i>` : "Tap to see what changed"}</span></button>`).join("")}</div>`;
    if (N.scenes) return `<div class="gx-scenes">${N.scenes.map((s, i) => `<button class="gx-scene2 ${A.seen[i] ? "on" : ""} k-${s.k}" type="button" data-seen="${i}" aria-pressed="${!!A.seen[i]}">
        <span class="gx-sc2-l">${esc(s.l)}</span>
        <span class="gx-sc2-row"><span class="e98"><small>1998</small><b aria-hidden="true">${s.a98}</b></span><span class="gx-sc2-sign" aria-label="${s.sign === "=" ? "equal" : "less than"}">${s.sign}</span><span class="e26"><small>2026</small><b aria-hidden="true">${s.a26}</b></span></span>
        <span class="gx-sc2-t">${A.seen[i] ? hlText(s.t) : "Tap to read the sentence"}</span></button>`).join("")}</div>`;
    return `<div class="gx-comic">
        <div class="gx-comic-pic">${pic(media(les, "brick"), "Marko holding Dad's huge old mobile phone", ART.brick(), "brick")}</div>
        <div class="gx-comic-bubbles">${N.comic.map((c, i) => `<button class="gx-cb who-${c.who} ${A.seen[i] ? "on" : ""}" type="button" data-seen="${i}" aria-pressed="${!!A.seen[i]}">${face(les, c.who)}<span><b>${esc(les.characters[c.who].name)}</b>${hlText(c.t)}</span></button>`).join("")}</div>
      </div>`;
  };
  const ruleHTML = () => {
    const R = L.rule;
    const tbl = R.rows ? `<div class="gx-rtable">${R.rows.map(r => `<div class="gx-rgroup k-${r.k}"><b class="gx-rg-t">${esc(r.t)}</b><div class="gx-rrows"><div class="gx-rrow head"><span>adjective</span><span>comparative</span><span>superlative</span></div>${r.items.map(it => `<div class="gx-rrow"><span>${esc(it[0])}</span><span>${esc(it[1])}</span><span>${esc(it[2])}</span></div>`).join("")}</div></div>`).join("")}</div>`
      : `<div class="gx-rpairs">${R.pairs.map(p => `<div class="gx-rpair"><b>${esc(p.f)}</b><span>= ${esc(p.m)}</span><i>${esc(p.ex)} ${say(p.ex)}</i></div>`).join("")}</div>`;
    return `<div class="gx-rule"><h3>${esc(R.title)}</h3>${tbl}<ul class="gx-rnotes">${R.notes.map(n => `<li>${n}</li>`).join("")}</ul><div class="gx-tools">${uaBtn("rl-ua-" + L.id)}</div>${uaBox("rl-ua-" + L.id, esc(R.ua))}</div>`;
  };
  const practiceHTML = () => {
    const n = L.practice.length, i = Math.min(A.pi, n - 1), q = L.practice[i], R = A.p[i] = A.p[i] || {};
    let body;
    if (q.err){
      const fixed = mcqDone(R);
      body = `<p class="gx-mq"><span class="gx-qn">${i + 1}</span><span>${esc(q.q)}</span></p>
        <div class="gx-errsent">${q.words.map((w, k) => { const isBad = k === q.bad; const cls = fixed && isBad ? "fixed" : R.found && isBad ? "found" : (R.miss || []).includes(k) ? "miss" : "";
          return `<button class="gx-ew ${cls}" type="button" data-ew="${k}" ${fixed || R.found ? "disabled" : ""}>${fixed && isBad ? esc(q.o[q.a]) : esc(w)}</button>`; }).join(" ")}</div>
        ${!R.found && !fixed ? `<p class="gx-small" aria-live="polite">${(R.miss || []).length ? "That part is correct. Look again! " : ""}Tap the wrong word(s).</p>` : ""}
        ${R.found || fixed ? `<p class="gx-small">Now choose the correct form:</p>${mcqHTML("p" + i, q, R, { noQ:true, n:i, teacher:ctx.teacher, row:true })}` : ""}`;
    } else {
      body = `<p class="gx-mq gx-gap"><span class="gx-qn">${i + 1}</span><span>${blankFill(q, R)}</span></p>${mcqHTML("p" + i, q, R, { noQ:true, n:i, teacher:ctx.teacher, row:true })}`;
    }
    const all = L.practice.every((x, k) => mcqDone(A.p[k])), first = L.practice.filter((x, k) => A.p[k] && A.p[k].first).length;
    return `<div class="gx-pr">
      <div class="gx-qtop"><span>Practice ${i + 1} of ${n}</span><span class="gx-steps">${L.practice.map((x, k) => `<button class="gx-dot ${k === i ? "on" : ""} ${A.p[k] && A.p[k].first ? "ok" : mcqDone(A.p[k]) ? "past" : ""}" type="button" data-pi="${k}" aria-label="Task ${k + 1}"></button>`).join("")}</span></div>
      <div class="card gx-prcard">${body}
        <div class="row gx-nav"><button class="btn" type="button" data-pprev ${i === 0 ? "disabled" : ""}>←</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn ${mcqDone(R) ? "primary" : ""}" type="button" data-pnext>Next →</button>` : all ? `<span class="pill good">★ ${first} / ${n} first try</span>` : ""}</div>
      </div>
      ${all ? `<div class="gx-labdone ${fresh ? "gx-pop" : ""}">${icon("flask")}<div><small>Discovery ${L.n} complete</small><b>${esc(L.t)}</b></div><span class="gx-labscore">★ ${first}/${n}</span></div>` : ""}
    </div>`;
  };
  const draw = () => {
    const step = A.step, si = STEPS.findIndex(s => s.k === step);
    el.innerHTML = `${head(ctx, `Discovery ${L.n} · ${L.t}`, "", { kicker:"Mission 03 · The Comparison Lab 🧪" })}
      <nav class="gx-labsteps" aria-label="Lab steps">${STEPS.map((s, k) => `<button class="gx-ls ${s.k === step ? "on" : ""} ${stepDone(s.k) ? "done" : ""}" type="button" data-step="${s.k}" aria-current="${s.k === step}"><span>${stepDone(s.k) ? icon("check") : k + 1}</span>${esc(s.t)}</button>`).join("")}<span class="gx-labshort">${esc(L.short)}</span></nav>
      <section class="gx-labbody" aria-live="polite">
        ${step === "notice" ? `<div class="gx-intro"><p>${esc(N.intro)}</p>${uaBtn("nt-ua", "")}</div>${uaBox("nt-ua", esc(N.ua))}${noticeHTML()}` : ""}
        ${step === "think" ? `<div class="gx-think">${L.ask.map((q, i) => `<div class="card">${mcqHTML("a" + i, q, A.ask[i] = A.ask[i] || {}, { num:i + 1, n:i, teacher:ctx.teacher })}</div>`).join("")}</div>` : ""}
        ${step === "rule" ? ruleHTML() : ""}
        ${step === "practice" ? practiceHTML() : ""}
      </section>`;
    const next = STEPS[si + 1];
    if (next) ctx.setCTA({ label:`${next.t} →`, action: () => go(next.k) });
    else ctx.setCTA({ label: L.n < 3 ? `Discovery ${L.n + 1} →` : "Collect the evidence →" });
    fresh = false;
  };
  const go = k => { if (A.step === "rule") A.ruleSeen = true; A.step = k; if (k === "rule") A.ruleSeen = true; OPEN.clear(); save(); Snd.pop(); draw(); scrollTo($(".gx-labsteps", el), "start"); };
  el.onclick = e => {
    const s = e.target.closest("[data-step]"); if (s){ go(s.dataset.step); return; }
    const sn = e.target.closest("[data-seen]"); if (sn){ A.seen[sn.dataset.seen] = true; save(); Snd.pop(); draw(); return; }
    const pi = e.target.closest("[data-pi]"); if (pi){ A.pi = +pi.dataset.pi; OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-pnext]")){ A.pi = Math.min(L.practice.length - 1, A.pi + 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-pprev]")){ A.pi = Math.max(0, A.pi - 1); OPEN.clear(); save(); draw(); return; }
    const ew = e.target.closest("[data-ew]");
    if (ew){ const i = A.pi, q = L.practice[i], R = A.p[i] = A.p[i] || {}; const k = +ew.dataset.ew;
      if (k === q.bad){ R.found = true; Snd.pop(); } else { R.miss = (R.miss || []).concat(k); Snd.nope(); }
      save(); draw(); return; }
    const id = mcqClick(e, k => {
      if (k[0] === "a"){ const i = +k.slice(1); return L.ask[i] ? { q:L.ask[i], R:A.ask[i] = A.ask[i] || {} } : null; }
      if (k[0] === "p"){ const i = +k.slice(1); const q = L.practice[i]; return q ? { q, R:A.p[i] = A.p[i] || {} } : null; }
      return null;
    });
    if (id !== false){
      if (id[0] === "p"){ const i = +id.slice(1), q = L.practice[i], R = A.p[i]; if (q.err && R.ok && R.miss && R.miss.length) R.first = false; if (L.practice.every((x, k) => mcqDone(A.p[k])) && mcqDone(R)){ fresh = true; Snd.unlock(); } }
      draw(); const n = $(`[data-qid="${id}"]`, el); if (n) scrollTo(n);
    }
  };
  draw();
}, { label: d => "Discovery " + (d.lab ? d.lab.n : "") });

/* ============================================================
   MISSION 4 · gxDiary — щоденник тата: gist → 3 питання
   (дані — у стадії "diary": date, paras, sign, gloss, gist, comp)
   ============================================================ */
const MARK = /\{([stcea])\|([^}]+)\}/g;
function diaryHTML(les, st, o){
  o = o || {};
  let gi = 0;
  const para = p => {
    let html = "";
    if (o.find){
      /* кожне слово — кнопка; цільові фрази — групи */
      const parts = []; let last = 0; p.replace(MARK, (m, k, t, idx) => { parts.push({ t:p.slice(last, idx) }); parts.push({ k, t, g:gi++ }); last = idx + m.length; return m; }); parts.push({ t:p.slice(last) });
      html = parts.map(x => {
        if (x.k){ const f = (o.found || {})[x.g]; return `<span class="gx-tg ${f ? "found k-" + x.k : ""}" data-tg="${x.g}" data-k="${x.k}" role="button" tabindex="0">${esc(x.t)}</span>`; }
        return x.t.split(/(\s+)/).map(w => /^\s+$/.test(w) || !w ? w : `<span class="gx-tw" role="button" tabindex="-1" data-tw>${esc(w.replace(/[[\]]/g, ""))}</span>`).join("");
      }).join("");
    } else {
      html = esc(p).replace(/\{[stcea]\|([^}]+)\}/g, "$1").replace(/\[([^\]]+)\]/g, (_, w) => `<button class="gx-w" type="button" data-gxword="${esc(w.toLowerCase())}">${esc(w)}</button>`);
    }
    return `<p>${html}</p>`;
  };
  return `<article class="gx-diary ${o.compact ? "compact" : ""}" aria-label="Dad's diary, ${esc(st.date)}">
    <span class="gx-ticket" aria-hidden="true"><b>KOSMOS</b><small>CINEMA · 07.11.98</small><small>ROW 12 · SEAT 7</small></span>
    <p class="gx-diary-date">${esc(st.date)}</p>
    ${st.paras.map(para).join("")}
    <p class="gx-diary-sign">— ${esc(st.sign)}</p>
    <span class="gx-stain" aria-hidden="true"></span>
  </article>`;
}
define("gxDiary", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "read"); A.c = A.c || {}; A.g = A.g || {};
  const full = st.paras.map(p => p.replace(/\{[stcea]\|([^}]+)\}/g, "$1").replace(/[[\]]/g, "")).join(" ");
  const draw = () => {
    const gistDone = mcqDone(A.g), all = gistDone && st.comp.every((q, i) => mcqDone(A.c[i]));
    el.innerHTML = `${head(ctx, "Dad's Secret Diary", "Marko found Dad's diary in the box. Read it quickly first — then read it carefully.", { kicker:"Mission 04 · Reading", ua:"Марко знайшов щоденник тата в коробці. Спершу прочитай його швидко, потім — уважно." })}
      <div class="gx-diarygrid">
        <div class="gx-diarycol">
          ${media(les, "diary") ? `<div class="gx-diary-photo">${pic(media(les, "diary"), "Dad's old diary with a cinema ticket", "", "diarypic")}</div>` : ""}
          <div class="gx-diary-cover"><span class="gx-osd">${icon("book")} DAN'S DIARY · 1998</span>${say(full, "Listen to the diary")}</div>
          ${diaryHTML(les, st)}
          <div class="gx-tools">${uaBtn("dg-ua", "Difficult phrases")}</div>${foldBox("dg-ua", `<ul class="gx-gloss">${st.gloss.map(g => `<li><b>${esc(g[0])}</b> — ${esc(g[1])}</li>`).join("")}</ul>`, "gx-ua")}
        </div>
        <div class="gx-diarytasks">
          <div class="card"><p class="gx-step-k">Step 1 · Read quickly <span class="pill">≈ 1 min</span></p>${mcqHTML("g", st.gist, A.g, { teacher:ctx.teacher })}</div>
          ${gistDone ? `<div class="card gx-in"><p class="gx-step-k">Step 2 · Read carefully</p>${st.comp.map((q, i) => mcqHTML("c" + i, q, A.c[i] = A.c[i] || {}, { num:i + 1, n:i, teacher:ctx.teacher })).join("")}</div>` : `<div class="gx-locked">${icon("lock")}<p>Answer Step 1 to open the next questions.</p></div>`}
          ${all ? `<div class="note good">✓ Detective reading complete. Now — the grammar hidden in the diary…</div>` : ""}
        </div>
      </div>`;
    ctx.setCTA({ label:"Grammar detective →" });
  };
  el.onclick = e => {
    const id = mcqClick(e, k => k === "g" ? { q:st.gist, R:A.g } : (k[0] === "c" && st.comp[+k.slice(1)]) ? { q:st.comp[+k.slice(1)], R:A.c[+k.slice(1)] = A.c[+k.slice(1)] || {} } : null);
    if (id !== false){ draw(); const n = $(`[data-qid="${id}"]`, el); if (n) scrollTo(n); }
  };
  draw();
}, { label: () => "Read the diary" });

/* ============================================================
   gxDiaryFind — граматичний детектив у щоденнику + 2 усні питання
   ============================================================ */
define("gxDiaryFind", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, F = st.find, A = store(ctx, scr, "find"); A.found = A.found || {}; A.got = A.got || {};
  if (!F.targets.some(t => t.k === A.sel)) A.sel = F.targets[0].k;
  let msg = null;
  const core = F.targets.filter(t => !t.bonus);
  const draw = () => {
    const nCore = core.filter(t => A.got[t.k]).length, allCore = nCore === core.length;
    el.innerHTML = `${head(ctx, "Grammar Detective", F.intro, { kicker:"Mission 04 · Grammar in context", ua:F.ua })}
      <div class="gx-findbar" role="group" aria-label="Structures to find">${F.targets.map(t => `<button class="gx-ft k-${t.k} ${A.sel === t.k ? "on" : ""} ${A.got[t.k] ? "got" : ""}" type="button" data-ft="${t.k}" aria-pressed="${A.sel === t.k}"><b>${A.got[t.k] ? "✓ " : ""}${esc(t.t)}</b><small>${esc(t.ex)}${t.bonus ? " · bonus" : ""}</small></button>`).join("")}<span class="gx-count ${allCore ? "ok" : ""}">${nCore} / ${core.length}</span></div>
      <div class="gx-findgrid">
        <div class="gx-findtext">${diaryHTML(les, st, { find:true, found:A.found, compact:true })}</div>
        <aside class="gx-findside">
          <div aria-live="polite">${msg ? `<div class="note ${msg.c}">${msg.t}</div>` : `<p class="gx-tip">${icon("search")} Looking for: <b>${esc(F.targets.find(t => t.k === A.sel).t)}</b>. Tap it in the text.</p>`}</div>
          ${ctx.teacher ? `${foldBtn("fd-key", "🧑‍🏫 Answer key", "teach")}${foldBox("fd-key", `<p>superlative: the worst · the second worst · the deepest · the best<br>comparative: worse<br>too + adj: too dark<br>adj + enough: brave enough<br>bonus: isn't as easy as</p>`, "gx-sample")}` : ""}
          ${allCore ? `<div class="card gx-in gx-findtalk"><h3 class="gx-h">${icon("mic")} Talk about it</h3>${st.talk.map((q, i) => spk(ctx, "dt" + i, q, A, { small:true })).join("")}</div>` : ""}
        </aside>
      </div>`;
    ctx.setCTA({ label: allCore ? "Open the surprise evidence 🔎" : "Continue" });
  };
  const hit = node => {
    const sel = A.sel, t = F.targets.find(x => x.k === sel);
    if (node.dataset.tg != null){
      const k = node.dataset.k, g = node.dataset.tg;
      if (k === sel){ A.found[g] = true; const first = !A.got[k]; A.got[k] = true; Snd.pop(); msg = { c:"good", t:`✓ Yes! <b>${esc(node.textContent)}</b> is ${esc(t.t)}.` };
        if (first){ const nxt = F.targets.find(x => !A.got[x.k] && !x.bonus); if (nxt) A.sel = nxt.k; }
        if (core.every(x => A.got[x.k]) && first && !t.bonus) Snd.unlock(); }
      else { const o = F.targets.find(x => x.k === k); A.found[g] = true; A.got[k] = true; Snd.pop(); msg = { c:"info", t:`Good eye! <b>${esc(node.textContent)}</b> is ${esc(o.t)} — not ${esc(t.t)}. Keep looking!` }; }
    } else { Snd.nope(); msg = { c:"amber", t:`Not this one. Look for <b>${esc(t.t)}</b> (${esc(t.ex)}).` }; }
    save(); draw();
  };
  el.onclick = e => {
    const ft = e.target.closest("[data-ft]"); if (ft){ A.sel = ft.dataset.ft; msg = null; save(); draw(); return; }
    if (spkClick(e, A, el)) return;
    const tg = e.target.closest("[data-tg]"); if (tg){ hit(tg); return; }
    const tw = e.target.closest("[data-tw]"); if (tw) hit(tw);
  };
  el.onkeydown = e => { const t = e.target.closest && e.target.closest("[data-tg]"); if (t && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); hit(t); } };
  draw();
}, { label: () => "Grammar detective" });

/* ============================================================
   MISSION 5 · gxVoices — два голосові повідомлення (синтез мовлення) або режим «Teacher reads»
   (дані — у стадії "voices": msgs)
   ============================================================ */
const VP = { id:null, i:0, gen:0, paused:{} };
function vpStop(){ VP.gen++; VP.id = null; try { TTS.stop(); } catch(e){} }
const estSec = t => Math.max(20, Math.round(String(t).split(/\s+/).length / 2.5));
const fmt = s => `${Math.floor(s / 60)}:${pad2(s % 60)}`;
function voiceHTML(les, m, A, o){
  o = o || {}; const sents = splitS(m.text); const st = A.v[m.id] || {};
  const playing = VP.id === m.id;
  const pct = Math.round((playing ? VP.i : VP.paused[m.id] ? VP.paused[m.id] : st.played ? sents.length : 0) / sents.length * 100);
  const bars = Array.from({ length:34 }, (_, k) => 6 + Math.round(Math.abs(Math.sin(k * 1.7 + m.id.length) * 16 + Math.cos(k * .7) * 6)));
  return `<div class="gx-vm who-${m.who} ${playing ? "playing" : ""}" data-vm="${m.id}">
    ${face(les, m.who)}
    <div class="gx-vbub">
      <div class="gx-vtop"><b>${esc(m.label)}</b>${st.played ? `<span class="gx-heard">${icon("check")} heard ${st.n || 1}×</span>` : ""}</div>
      <div class="gx-vplay">
        ${o.teacherMode ? `<span class="gx-tread">${icon("mic")} Teacher reads</span>` : `<button class="gx-pbtn" type="button" data-vplay="${m.id}" aria-label="${playing ? "Pause" : "Play"} ${esc(m.label)}">${icon(playing ? "pause" : "play")}</button>`}
        <span class="gx-wave" aria-hidden="true">${bars.map((h, k) => `<i style="height:${h}px" class="${k / bars.length * 100 < pct ? "on" : ""}"></i>`).join("")}</span>
        <span class="gx-vdur">${fmt(estSec(m.text))}</span>
      </div>
      ${o.transcript ? `<div class="gx-vtext">${sents.map((s, k) => `<span class="${playing && k === VP.i ? "now" : ""}">${esc(s)}</span>`).join(" ")}</div>` : ""}
    </div>
  </div>`;
}
function mountVoices(el, ctx, les, msgs, A, rerender){
  A.v = A.v || {};
  const play = id => {
    const m = msgs.find(x => x.id === id); if (!m) return;
    if (VP.id === id){ VP.paused[id] = VP.i; vpStop(); rerender(); return; }
    vpStop(); const sents = splitS(m.text);
    VP.id = id; VP.i = VP.paused[id] && VP.paused[id] < sents.length ? VP.paused[id] : 0; const my = ++VP.gen;
    const cfg = Object.assign({}, m.voice, { speed:(A.speed || 1) });
    const step = () => {
      if (my !== VP.gen) return;
      if (VP.i >= sents.length){ A.v[id] = A.v[id] || {}; A.v[id].played = true; A.v[id].n = (A.v[id].n || 0) + 1; VP.paused[id] = 0; VP.id = null; save(); Snd.pop(); rerender(); return; }
      rerender();
      TTS.speak(sents[VP.i], cfg, () => { if (my !== VP.gen) return; VP.i++; step(); });
    };
    step();
  };
  onCleanup(vpStop);
  return play;
}
define("gxVoices", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "listen"); A.v = A.v || {};
  const canSpeak = TTS.ok;
  const draw = () => {
    const tm = !canSpeak || !!A.tread;
    el.innerHTML = `${head(ctx, "Two Generations, Two Opinions", "Dad and Marko each sent a voice message. Listen to both. Who says what?", { kicker:"Mission 05 · Listening", ua:"Тато й Марко надіслали голосові повідомлення. Послухай обидва. Хто що каже?" })}
      <div class="gx-voices">
        <div class="gx-phone gx-vphone"><div class="gx-phone-head"><span class="gx-ava mono" aria-hidden="true">💬</span><div><b>Family chat</b><small>Dad, Marko</small></div><span class="gx-phone-dot" aria-hidden="true"></span></div>
          <div class="gx-thread gx-vthread">${st.msgs.map(m => voiceHTML(les, m, A, { transcript: A.tx || tm, teacherMode: tm })).join("")}</div>
          <div class="gx-phone-foot">${canSpeak ? `<span class="gx-small">Speed</span><button class="btn small ${(A.speed || 1) < 1 ? "on" : ""}" type="button" data-speed=".85">0.85×</button><button class="btn small ${(A.speed || 1) >= 1 ? "on" : ""}" type="button" data-speed="1">1×</button><span class="spacer"></span>` : `<span class="spacer"></span>`}
            <button class="btn small ${A.tx ? "on" : ""}" type="button" data-tx aria-pressed="${!!A.tx}">${icon("book")} ${A.tx ? "Hide transcript" : "Show transcript"}</button></div>
        </div>
        <aside class="gx-vside">
          <div class="card"><h3 class="gx-h">${icon("search")} While you listen</h3><ul class="gx-listen-hints"><li>What does <b>Dad</b> like about 1998?</li><li>What does <b>Marko</b> like about 2026?</li><li>Do they agree about anything?</li></ul></div>
          ${!canSpeak ? `<div class="note amber">${icon("info")} This browser can't read aloud. <b>Teacher reads</b> mode is on: your teacher reads the messages.</div>`
            : `<div class="card gx-tmode"><p>${icon("mic")} <b>Teacher-read mode</b><br><small>Your teacher reads the messages aloud instead of the computer voice.</small></p><button class="btn small ${A.tread ? "on" : ""}" type="button" data-tread aria-pressed="${!!A.tread}">${A.tread ? "On" : "Off"}</button></div>`}
          ${ctx.teacher ? `<p class="gx-small muted">🧑‍🏫 Tip: listen once without the transcript, then once with it.</p>` : ""}
        </aside>
      </div>`;
    ctx.setCTA({ label:"Answer the questions →" });
  };
  const play = mountVoices(el, ctx, les, st.msgs, A, () => { if (el.isConnected) draw(); });
  el.onclick = e => {
    const p = e.target.closest("[data-vplay]"); if (p){ play(p.dataset.vplay); return; }
    const sp = e.target.closest("[data-speed]"); if (sp){ A.speed = +sp.dataset.speed; save(); vpStop(); draw(); return; }
    if (e.target.closest("[data-tx]")){ A.tx = !A.tx; save(); draw(); return; }
    if (e.target.closest("[data-tread]")){ A.tread = !A.tread; vpStop(); save(); draw(); }
  };
  draw();
}, { label: () => "2 voice messages" });

/* ============================================================
   gxListen — хто що сказав (Dad / Marko), True / False, спільна думка, усне питання
   ============================================================ */
define("gxListen", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "tasks"); A.m = A.m || {}; A.tf = A.tf || {}; A.b = A.b || {};
  const L = store(ctx, { data:{ store:"listen" } }, "listen"); L.v = L.v || {};
  let fresh = null;
  const draw = () => {
    const mDone = st.match.filter((x, i) => mcqDone(A.m[i])).length, tfDone = st.tf.every((x, i) => mcqDone(A.tf[i])), bDone = mcqDone(A.b);
    const all = mDone === st.match.length && tfDone && bDone;
    el.innerHTML = `${head(ctx, "Who Said What?", "Match each opinion to the speaker. Replay the messages if you need to.", { kicker:"Mission 05 · Listening tasks", ua:"З'єднай кожну думку з тим, хто її висловив. Можна переслухати повідомлення." })}
      <div class="gx-replay">${st.msgs.map(m => `<button class="btn small" type="button" data-vplay="${m.id}">${icon(VP.id === m.id ? "pause" : "play")} ${esc(m.label.split("·")[1] || m.label)}</button>`).join("")}${foldBtn("ls-tx", `${icon("book")} Transcripts`)}</div>
      ${foldBox("ls-tx", `<div class="gx-txs">${st.msgs.map(m => `<div><b>${esc(m.label)}</b><p>${esc(m.text)}</p></div>`).join("")}</div>`)}
      <div class="card gx-match"><h3 class="gx-h">1 · Dad or Marko? <span class="pill ${mDone === st.match.length ? "good" : ""}">${mDone} / ${st.match.length}</span></h3>
        ${st.match.map((x, i) => { const R = A.m[i] = A.m[i] || {}; const done = mcqDone(R); const w = R.wrong || [];
          return `<div class="gx-mrow ${done ? "done" : ""} ${fresh === "m" + i ? "gx-pop" : ""}"><p>“${esc(x.t)}”</p><div class="gx-who">${["dad", "marko"].map(v => `<button class="gx-whob ${done && x.a === v ? "good" : ""} ${w.includes(v) ? "bad" : ""}" type="button" data-mw="${i}:${v}" ${done || w.includes(v) ? "disabled" : ""}>${face(les, v)}${v === "dad" ? "Dad" : "Marko"}</button>`).join("")}</div></div>`; }).join("")}
      </div>
      <div class="card"><h3 class="gx-h">2 · True or false?</h3>${st.tf.map((x, i) => { const R = A.tf[i] = A.tf[i] || {}; const done = mcqDone(R); const w = R.wrong || [];
          return `<div class="gx-tfrow"><p>${i + 1}. ${esc(x.t)}</p><div class="gx-tfb">${[true, false].map(v => `<button class="gx-opt ${done && x.a === v ? "good" : ""} ${w.includes(v) ? "bad" : ""}" type="button" data-tf="${i}:${v}" ${done || w.includes(v) ? "disabled" : ""}>${v ? "True" : "False"}</button>`).join("")}</div>${done ? `<p class="gx-sc-why ${R.first ? "good" : ""}">${esc(x.why)}</p>` : w.length ? `<p class="gx-sc-why amber">Not quite — listen again.</p>` : ""}</div>`; }).join("")}</div>
      <div class="card"><h3 class="gx-h">3 · Compare</h3>${mcqHTML("both", st.both, A.b, { teacher:ctx.teacher })}</div>
      ${all ? `<div class="card gx-in gx-follow"><h3 class="gx-h">${icon("mic")} Your turn</h3>${spk(ctx, "fol", st.follow, A)}</div>` : ""}`;
    ctx.setCTA({ label: all ? "Unlock the final evidence →" : "Continue" });
    fresh = null;
  };
  const play = mountVoices(el, ctx, les, st.msgs, L, () => { if (el.isConnected){ const r = $(".gx-replay", el); if (r) r.innerHTML = st.msgs.map(m => `<button class="btn small" type="button" data-vplay="${m.id}">${icon(VP.id === m.id ? "pause" : "play")} ${esc(m.label.split("·")[1] || m.label)}</button>`).join("") + foldBtn("ls-tx", `${icon("book")} Transcripts`); } });
  const judge = (R, ok) => { if (mcqDone(R)) return; if (ok){ R.ok = true; R.first = !(R.wrong && R.wrong.length); Snd.pop(); } else { R.wrong = R.wrong || []; Snd.nope(); } save(); };
  el.onclick = e => {
    const p = e.target.closest("[data-vplay]"); if (p){ play(p.dataset.vplay); return; }
    if (spkClick(e, A, el)) return;
    const mw = e.target.closest("[data-mw]");
    if (mw){ const [i, v] = mw.dataset.mw.split(":"); const R = A.m[i]; const ok = st.match[i].a === v; if (!ok) R.wrong = (R.wrong || []).concat(v); judge(R, ok); fresh = ok ? "m" + i : null; draw(); return; }
    const tf = e.target.closest("[data-tf]");
    if (tf){ const [i, v] = tf.dataset.tf.split(":"); const R = A.tf[i]; const val = v === "true"; const ok = st.tf[i].a === val; if (!ok){ R.wrong = (R.wrong || []).concat(val); R.shown = true; } judge(R, ok); draw(); return; }
    const id = mcqClick(e, k => k === "both" ? { q:st.both, R:A.b } : null);
    if (id !== false){ draw(); const n = $(".gx-follow", el); if (n) scrollTo(n, "center"); }
  };
  draw();
}, { label: () => "Who said what?" });

/* ============================================================
   MISSION 6 · gxDebate — TEAM 1998 vs TEAM 2026: 5 раундів, вибір, пояснення, табло
   ============================================================ */
function tally(les, A){
  const s = { "98":0, "26":0 }; const st = les.stages.find(x => x.id === "debate");
  st.rounds.forEach(r => { const p = (A.pick || {})[r.id]; if (p === "98" || p === "tie") s["98"]++; if (p === "26" || p === "tie") s["26"]++; });
  return s;
}
const verdictOf = s => s["98"] === s["26"] ? "tie" : s["98"] > s["26"] ? "98" : "26";
define("gxDebate", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "arena"); A.pick = A.pick || {}; A.star = A.star || {};
  const R = st.rounds; if (A.i == null) A.i = 0;
  let bump = null, reveal = false;
  const draw = () => {
    const s = tally(les, A), picked = R.filter(r => A.pick[r.id]).length, stars = R.filter(r => A.star[r.id]).length;
    const r = R[Math.min(A.i, R.length - 1)], ev = evOf(les, r.ev), p = A.pick[r.id];
    const v = verdictOf(s);
    el.innerHTML = `${head(ctx, "The Great Generation Debate", "Look at the evidence. Choose a winner in each round — then explain your choice out loud.", { kicker:"Mission 06 · Speaking", ua:"Подивись на докази. Обери переможця в кожному раунді — і поясни свій вибір уголос." })}
      <section class="gx-arena">
        <div class="gx-score">
          <div class="gx-team98 ${bump === "98" ? "bump" : ""} ${A.revealed && v === "98" ? "win" : ""}"><span>📼</span><b>TEAM 1998</b><strong aria-live="polite">${s["98"]}</strong></div>
          <div class="gx-score-mid"><span class="gx-osd">ROUND ${Math.min(A.i, R.length - 1) + 1}/${R.length}</span><i aria-hidden="true">VS</i></div>
          <div class="gx-team26 ${bump === "26" ? "bump" : ""} ${A.revealed && v === "26" ? "win" : ""}"><strong aria-live="polite">${s["26"]}</strong><b>TEAM 2026</b><span>📱</span></div>
        </div>
        <ol class="gx-rounds">${R.map((x, k) => `<li><button class="gx-rb ${k === A.i ? "on" : ""} ${A.pick[x.id] ? "p" + A.pick[x.id] : ""}" type="button" data-rd="${k}" aria-current="${k === A.i}">${icon(evOf(les, x.ev).icon)}<span>${esc(x.cat)}</span>${A.star[x.id] ? `<i aria-label="explained">⭐</i>` : ""}</button></li>`).join("")}</ol>
        <div class="gx-round" id="rd">
          <div class="gx-rev">
            <figure class="gx-ev98"><span class="gx-ev-y">📼 1998</span><p>${esc(ev.y98)}</p></figure>
            <figure class="gx-ev26"><span class="gx-ev-y">2026 📱</span><p>${esc(ev.y26)}</p></figure>
          </div>
          <div class="gx-qrow gx-rq"><p class="gx-bigq">${esc(r.q)}</p>${say(r.q)}</div>
          <div class="gx-tools">${uaBtn("dq-ua-" + r.id, "")}${foldBtn("dl-" + r.id, "Sentence starters")}${ctx.teacher ? foldBtn("dx-" + r.id, "🧑‍🏫 Follow-up", "teach") : ""}</div>
          ${uaBox("dq-ua-" + r.id, esc(r.ua))}
          ${foldBox("dl-" + r.id, `<ul class="gx-starters">${r.lang.map(l => `<li>${esc(l)}</li>`).join("")}</ul>`)}
          ${ctx.teacher ? foldBox("dx-" + r.id, `<p>But Dad says… · Really? Isn't it too…? · Which is the most important for you?</p>`, "gx-sample") : ""}
          <p class="gx-small">Which generation wins this round?</p>
          <div class="gx-pick" role="group" aria-label="Choose the winner">
            <button class="gx-pk p98 ${p === "98" ? "on" : ""}" type="button" data-pk="98" aria-pressed="${p === "98"}">📼 Team 1998</button>
            <button class="gx-pk ptie ${p === "tie" ? "on" : ""}" type="button" data-pk="tie" aria-pressed="${p === "tie"}">🤝 It's a tie</button>
            <button class="gx-pk p26 ${p === "26" ? "on" : ""}" type="button" data-pk="26" aria-pressed="${p === "26"}">Team 2026 📱</button>
          </div>
          ${p ? `<div class="gx-explain gx-in"><p>${icon("mic")} <b>Now explain your choice out loud.</b> Use a comparison: <i>…er than · more … than · the most … · not as … as · too … · … enough</i></p>
            <button class="gx-star ${A.star[r.id] ? "on" : ""}" type="button" data-star aria-pressed="${!!A.star[r.id]}">⭐ ${A.star[r.id] ? "Explained with comparison grammar" : "Mark: explained with comparison grammar"}</button>
            ${A.i < R.length - 1 ? `<button class="btn primary" type="button" data-rnext>Next round →</button>` : ""}</div>` : ""}
        </div>
        <div class="gx-tracker"><span>Rounds decided <b>${picked}/${R.length}</b></span><span class="${stars >= st.need ? "ok" : ""}">⭐ Explained with grammar <b>${stars}/${st.need}</b>${stars >= st.need ? " ✓" : " needed"}</span></div>
        ${picked === R.length ? (A.revealed ? `<div class="gx-verdict ${reveal ? "boom" : ""} v${v}" id="vd"><span class="gx-osd">FINAL SCORE · ${s["98"]} – ${s["26"]}</span><b>${v === "tie" ? "It's a draw! 🤝" : ERA[v].t + " wins! " + ERA[v].e}</b><p>${v === "tie" ? "Both generations have real advantages — that's a very fair verdict." : "That's your verdict — based on your own decisions."}</p>${stars < st.need ? `<small>${icon("info")} Try to explain ${st.need - stars} more choice${st.need - stars > 1 ? "s" : ""} with comparison grammar.</small>` : ""}</div>`
          : `<button class="btn primary big gx-revealbtn" type="button" data-reveal>${icon("trophy")} Reveal the verdict</button>`) : ""}
      </section>`;
    if (picked < R.length) ctx.setCTA({ label:"Continue" });
    else if (!A.revealed) ctx.setCTA({ label:"Reveal the verdict 🏆", action: doReveal });
    else ctx.setCTA({ label:"The final verdict →" });
    bump = null;
  };
  const doReveal = () => { A.revealed = true; reveal = true; save(); Snd.fanfare(); vhs("FINAL SCORE"); draw(); reveal = false; const v = $("#vd", el); if (v){ scrollTo(v, "center"); confetti(v); } };
  el.onclick = e => {
    const rd = e.target.closest("[data-rd]"); if (rd){ A.i = +rd.dataset.rd; OPEN.clear(); save(); draw(); return; }
    const pk = e.target.closest("[data-pk]");
    if (pk){ const r = R[A.i]; const prev = A.pick[r.id]; A.pick[r.id] = pk.dataset.pk; save(); Snd.arcade(); bump = pk.dataset.pk === "tie" ? null : pk.dataset.pk; void prev; draw(); return; }
    if (e.target.closest("[data-star]")){ const r = R[A.i]; A.star[r.id] = !A.star[r.id]; save(); if (A.star[r.id]) Snd.pop(); draw(); return; }
    if (e.target.closest("[data-rnext]")){ A.i = Math.min(R.length - 1, A.i + 1); OPEN.clear(); save(); draw(); scrollTo($(".gx-score", el), "start"); return; }
    if (e.target.closest("[data-reveal]")) doReveal();
  };
  draw();
}, { label: () => "Debate arena" });

/* ============================================================
   MISSION 7 · gxVerdict — повна дошка доказів, прогноз vs вердикт, рефлексія, граматика, бейдж
   ============================================================ */
define("gxVerdict", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "verdict"), g = GX(ctx);
  const arena = (ctx.all.debate && ctx.all.debate.arena) || {};
  const s = tally(les, arena), decided = Object.keys(arena.pick || {}).length, v = decided ? verdictOf(s) : null;
  A.i = Math.min(A.i || 0, st.reflect.length - 1);
  let celebrate = false;
  const predTxt = g.pred ? (g.pred === "unsure" ? "I'm not sure yet 🤔" : ERA[g.pred].t + " " + ERA[g.pred].e) : "—";
  const verdTxt = !v ? "Not decided yet" : v === "tie" ? "A draw 🤝" : ERA[v].t + " " + ERA[v].e;
  const line = !g.pred || !v ? "Finish the debate in Mission 6 to see your verdict here." : g.pred === "unsure" ? "You weren't sure at the start — now you have your own verdict!" : v === "tie" ? "You started on one side — now you see both. Very fair!" : g.pred === v ? "You were right from the start — and now you have the evidence!" : "You changed your mind! That's what good detectives do.";
  const draw = () => {
    const q = st.reflect[A.i];
    el.innerHTML = `${head(ctx, "The Final Verdict", "", { kicker:"Mission 07 · Case closed" })}
      <section class="gx-vboard">
        <div class="gx-files">${EVS(les).map(x => evCardHTML(les, x, !!g.ev[x.id], { disc:g.disc[x.id] })).join("")}</div>
        ${g.ev.talk ? exhibitHTML(les) : ""}
      </section>
      <section class="gx-pv">
        <div class="gx-pvc"><small>Mission 1 · Your prediction</small><b>${esc(predTxt)}</b></div>
        <span class="gx-pv-arrow" aria-hidden="true">→</span>
        <div class="gx-pvc v${v || "x"}"><small>Mission 6 · Your verdict${decided ? ` (${s["98"]}–${s["26"]})` : ""}</small><b>${esc(verdTxt)}</b></div>
        <p class="gx-pv-line">${esc(line)}</p>
      </section>
      <div class="card gx-talk">
        <div class="gx-qtop"><span>Reflection · ${A.i + 1} of ${st.reflect.length}</span><span class="gx-steps" aria-hidden="true">${st.reflect.map((x, k) => `<i class="${k === A.i ? "on" : (A.done || {})["r" + k] ? "past" : ""}"></i>`).join("")}</span></div>
        ${spk(ctx, "r" + A.i, q, A)}
        <div class="row gx-nav"><button class="btn" type="button" data-prev ${A.i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${A.i < st.reflect.length - 1 ? `<button class="btn primary" type="button" data-next>Next →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>
      <h3 class="gx-h">${icon("flask")} Grammar recap</h3>
      <div class="gx-recap">${st.recap.map((r, k) => `<div class="gx-rc" style="--k:${k}"><b>${esc(r.k)}</b><span>${esc(r.f)}</span><i>“${esc(r.ex)}”</i>${say(r.ex)}</div>`).join("")}</div>
      <div class="gx-badgezone" id="bz">${A.closed ? `<div class="gx-badge ${celebrate ? "spin" : ""}"><span class="gx-badge-i">${icon("search")}</span><div><small>Badge unlocked</small><b>${esc(st.badge.t)}</b><p>${esc(st.badge.s)}</p></div></div>`
        : `<button class="btn primary big" type="button" data-close>${icon("trophy")} Close the case</button>`}</div>`;
    ctx.setCTA(A.closed ? { label:"One more message… →" } : { label:"Close the case 🏆", action: close });
    celebrate = false;
  };
  const close = () => { A.closed = true; celebrate = true; save(); Snd.fanfare(); draw(); const b = $("#bz", el); confetti(b); scrollTo(b, "center"); };
  el.onclick = e => {
    if (spkClick(e, A, el)) return;
    if (e.target.closest("[data-next]")){ A.i = Math.min(st.reflect.length - 1, A.i + 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-close]")) close();
  };
  draw();
}, { label: () => "Final verdict" });

/* ============================================================
   gxCliff — фінальне повідомлення тата, TO BE CONTINUED, анонс Уроку 9, вибір: завершити / бонус
   ============================================================ */
function finishNow(ctx){
  const id = ctx.les.id, ls = S.L(id);
  ls.done = ls.done || {}; ls.done[ctx.scr.key] = true; ls.finished = true;
  if (S.markActive) S.markActive(); save();
  location.hash = `#/episode/${id}/done`;
}
define("gxCliff", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "cliff");
  const play = !A.seen && anim();
  el.innerHTML = `<div class="story-screen gx-cliff ${play ? "dim" : ""}">
      <p class="gx-cliff-k" id="stitle" tabindex="-1" ${play ? "hidden" : ""}>${icon("msg")} New message from Dad</p>
      <div id="cp" ${play ? "hidden" : ""}>${phone(les, "dad", { id:"cth", cls:"dark" })}</div>
      <div class="gx-tbc" id="tbc" ${play ? "hidden" : ""}>To be continued… <span aria-hidden="true">👀</span></div>
      <div class="gx-next" id="nx" ${play ? "hidden" : ""}><span class="gx-next-lock">${icon("lock")}</span><div><small>${esc(st.next.k)}</small><b>${esc(st.next.t)}</b><p>${esc(st.next.s)}</p></div></div>
      <div class="gx-cliff-end" id="ce" ${play ? "hidden" : ""}>
        <button class="gx-bonusbtn" type="button" data-bonus><span>⚡</span><b>Bonus game: The Generation Battle</b><small>Optional · 5–8 min · no wrong answers</small></button>
      </div>
      ${ctx.teacher && play ? `<button class="btn small link gx-skipfx" type="button" data-allc>Show everything</button>` : ""}
    </div>`;
  const th = $("#cth", el);
  const show = id => { const n = $("#" + id, el); if (n){ n.hidden = false; n.classList.add("gx-in"); } };
  let alive = true; onCleanup(() => { alive = false; });
  const end = () => { if (!alive) return; A.seen = true; save(); show("tbc"); Snd.vhs(); scrollTo($("#tbc", el), "center"); later(() => { show("nx"); later(() => { show("ce"); scrollTo($("#ce", el), "end"); }, 800); }, 1000); };
  const all = () => { alive = false; th.innerHTML = chatHTML(les, st.cliff); ["stitle", "cp", "tbc", "nx", "ce"].forEach(show); A.seen = true; save(); const b = $("[data-allc]", el); if (b) b.remove(); };
  if (!play) th.innerHTML = chatHTML(les, st.cliff);
  else {
    later(() => { if (!alive) return; Snd.buzz(); show("stitle"); }, 1300);
    later(() => { if (!alive) return; show("cp"); playChat(th, les, st.cliff, { delay:400, stopped: () => !alive, each: () => { const last = th.lastElementChild; if (last) last.scrollIntoView({ block:"nearest", behavior:"smooth" }); }, done: () => later(end, 1200) }); }, 2100);
  }
  el.onclick = e => {
    if (e.target.closest("[data-allc]")){ all(); return; }
    if (e.target.closest("[data-bonus]")) ctx.next();
  };
  ctx.setCTA({ label:"Finish lesson ✅", action: () => finishNow(ctx) });
}, { story:true, label: () => "To be continued" });

/* ============================================================
   BONUS · gxBattle — гра-шоу «The Generation Battle»: 8 раундів, реакції, голосування
   ============================================================ */
define("gxBattle", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "battle"); A.r = A.r || {};
  const R = st.rounds;
  let fx = null;
  const played = () => R.filter(r => A.r[r.id] && A.r[r.id].vote).length;
  const votes = () => { const s = { "98":0, "26":0 }; R.forEach(r => { const v = A.r[r.id] && A.r[r.id].vote; if (v) s[v]++; }); return s; };
  const draw = () => {
    const n = played(), s = votes();
    let main = "";
    if (!A.started){
      main = `<section class="gx-show-intro"><span class="gx-osd">● ON AIR</span><h3>THE GENERATION BATTLE <span aria-hidden="true">⚡</span></h3><p>${esc(st.sub)}</p><ul><li>8 ridiculous teenage problems — from 1998 and 2026</li><li>Choose a reaction. There are no wrong answers!</li><li>Play 3, 4 or all 8 rounds</li></ul><button class="btn primary big" type="button" data-start>Start the show ▶</button></section>`;
    } else if (A.result){
      const v = s["98"] === s["26"] ? "tie" : s["98"] > s["26"] ? "98" : "26";
      const style = v === "tie" ? "Time-Travel Master — you'd survive in both decades!" : v === "98" ? "1998 Legend — landlines and paper maps don't scare you!" : "2026 Pro — you can solve anything with one bar of battery!";
      main = `<section class="gx-show-result gx-pop" id="res"><span class="gx-osd">FINAL RESULT · ${n} ROUND${n > 1 ? "S" : ""}</span><h3>THE ULTIMATE GENERATION SURVIVOR!</h3><div class="gx-trophy" aria-hidden="true">🏆</div><p class="gx-style">${esc(style)}</p>
        <div class="gx-meter"><span class="m98" style="--w:${n ? Math.round(s["98"] / n * 100) : 50}%">📼 1998 · ${s["98"]}</span><span class="m26">${s["26"]} · 2026 📱</span></div>
        <button class="btn small ghost" type="button" data-more>${n < R.length ? "Play more rounds" : "Back to the rounds"}</button></section>`;
    } else {
      const r = R.find(x => x.id === A.cur) || R.find(x => !(A.r[x.id] && A.r[x.id].vote)) || R[0]; A.cur = r.id;
      const S2 = A.r[r.id] = A.r[r.id] || {};
      main = `<article class="gx-bround era${r.era} ${fx === "in" ? "gx-in" : ""}">
          <header><span class="gx-osd">${r.era === "98" ? "▶ PLAY · 1998" : "🔔 2026 · now"}</span><span class="gx-bround-n">Round ${R.indexOf(r) + 1}</span></header>
          <h3><span aria-hidden="true">${r.icon}</span> ${esc(r.t)}</h3>
          <p class="gx-bsit">${esc(r.s)} ${say(r.s)}</p>
          <div class="gx-bopts">${r.o.map((o, k) => `<button class="gx-bopt ${S2.pick === k ? "on" : ""}" type="button" data-bp="${k}" ${S2.pick != null ? "disabled" : ""}><b>${LETTER(k)}</b><span>${esc(o.t)}</span></button>`).join("")}</div>
          ${S2.pick != null ? `<div class="gx-react ${fx === "react" ? "gx-pop" : ""}"><span aria-hidden="true">💬</span><p>${esc(r.o[S2.pick].r)}</p></div>
            <div class="gx-btalk"><p>${icon("mic")} <b>${esc(r.talk)}</b> ${say(r.talk)}</p></div>
            <p class="gx-small">${esc(st.vote)}</p>
            <div class="gx-bvote"><button class="gx-pk p98 ${S2.vote === "98" ? "on" : ""}" type="button" data-bv="98">📼 1998</button><button class="gx-pk p26 ${S2.vote === "26" ? "on" : ""}" type="button" data-bv="26">2026 📱</button></div>` : ""}
          ${S2.vote ? `<div class="row gx-nav"><span class="spacer"></span>${n < R.length ? `<button class="btn primary" type="button" data-bnext>Next round →</button>` : ""}${n >= 3 ? `<button class="btn ${n === R.length ? "primary" : ""}" type="button" data-bres>See my result 🏆</button>` : ""}</div>` : ""}
        </article>`;
    }
    el.innerHTML = `${head(ctx, st.title, st.sub, { kicker:"⚡ Bonus game · optional" })}
      <div class="gx-showbar"><div class="gx-mini"><span>📼 <b>${s["98"]}</b></span><i>votes</i><span><b>${s["26"]}</b> 📱</span></div>
        <ol class="gx-bnums">${R.map((r, k) => { const done = A.r[r.id] && A.r[r.id].vote; return `<li><button class="gx-bn era${r.era} ${A.cur === r.id && !A.result && A.started ? "on" : ""} ${done ? "done" : ""}" type="button" data-bgo="${r.id}" aria-label="Round ${k + 1}: ${esc(r.t)}${done ? ", played" : ""}" ${A.started ? "" : "disabled"}>${done ? "✓" : k + 1}</button></li>`; }).join("")}</ol>
        <span class="gx-small">${n} / ${R.length} played</span></div>
      <div id="show">${main}</div>`;
    ctx.setCTA({ label:"Finish lesson ✅" });
    if (fx === "res"){ const r = $("#res", el); confetti(r); }
    fx = null;
  };
  el.onclick = e => {
    if (e.target.closest("[data-start]")){ A.started = true; save(); Snd.fanfare(); fx = "in"; draw(); return; }
    const go = e.target.closest("[data-bgo]"); if (go && !go.disabled){ A.cur = go.dataset.bgo; A.result = false; save(); Snd.vhs(); fx = "in"; draw(); return; }
    const bp = e.target.closest("[data-bp]"); if (bp){ const S2 = A.r[A.cur]; if (S2.pick != null) return; S2.pick = +bp.dataset.bp; save(); Snd.arcade(); fx = "react"; draw(); return; }
    const bv = e.target.closest("[data-bv]"); if (bv){ A.r[A.cur].vote = bv.dataset.bv; save(); Snd.pop(); draw(); return; }
    if (e.target.closest("[data-bnext]")){ const nx = R.find(x => !(A.r[x.id] && A.r[x.id].vote)); if (nx) A.cur = nx.id; save(); Snd.vhs(); fx = "in"; draw(); scrollTo($(".gx-showbar", el), "start"); return; }
    if (e.target.closest("[data-bres]")){ A.result = true; save(); Snd.fanfare(); fx = "res"; draw(); return; }
    if (e.target.closest("[data-more]")){ A.result = false; const nx = R.find(x => !(A.r[x.id] && A.r[x.id].vote)); if (nx) A.cur = nx.id; save(); fx = "in"; draw(); }
  };
  draw();
}, { label: () => "Generation Battle" });

})();
