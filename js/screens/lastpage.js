/* ============================================================
   THE SIGNAL — бібліотека екранів «The Secret of 1998» (Unit 3 · Lesson 9)
   ------------------------------------------------------------
   Кінематографічний детектив: останню сторінку щоденника, докази 1998 року,
   повторення граматики, вибір учня (Talk today / Write first), email Маркові
   і дві кінцівки. Два світи: 1998 — бурштин і папір, 2026 — синій і фіолетовий.
   Типи: lpOpen · lpDiary · lpDiaryQs · lpTimeline · lpFuture · lpDesk · lpFacts · lpReveal ·
         lpGap · lpFix · lpCreate · lpLab · lpTalk · lpChoose · lpEmail · lpEnding ·
         lpSunrise · lpUnit · lpTeaser
   Тема — css/lastpage.css (body[data-episode-theme="lastpage"]).
   Спільний стан уроку (вибір, переклади, ключі) — у ans._lp епізоду.
   Файл самодостатній; підключається в index.html після js/player.js.
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
const anim = () => !reduced();
const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const plain = s => String(s || "").replace(EMO, "").replace(/\s+/g, " ").trim();
const say = (t, l) => sayBtn(plain(t), l || "Listen");
const LETTER = i => String.fromCharCode(65 + i);
const wc = t => String(t || "").trim().split(/\s+/).filter(Boolean).length;
const pad2 = n => String(n).padStart(2, "0");
const stageOf = (les, id) => les.stages.find(s => s.id === id);
const scrollTo = (node, block) => { if (node) later(() => node.scrollIntoView({ block: block || "nearest", behavior: anim() ? "smooth" : "auto" }), 60); };
const GOOD = ["Exactly right!", "Great — that's it!", "Well done, detective!", "Yes!"];
const good = i => GOOD[(i || 0) % GOOD.length];

/* ---------- іконки (контурні, 24×24) ---------- */
const ICON = {
  lock:`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  unlock:`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>`,
  check:`<path d="M4 12.5l5 5L20 6.5"/>`,
  mic:`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>`,
  book:`<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>`,
  search:`<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>`,
  eye:`<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  scale:`<path d="M12 3v17M7.5 20.5h9M5 7h14"/><path d="M5 7l-3 6.5a3 3 0 0 0 6 0zM19 7l-3 6.5a3 3 0 0 0 6 0z"/>`,
  focus:`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`,
  unfocus:`<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>`,
  key:`<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>`,
  restart:`<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 1.8-8.3L4 10"/>`,
  undo:`<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`,
  up:`<path d="M6 15l6-6 6 6"/>`,
  down:`<path d="M6 9l6 6 6-6"/>`,
  grip:`<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="3"/>`,
  info:`<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>`,
  clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  mail:`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>`,
  send:`<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>`,
  star:`<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>`,
  copy:`<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>`,
  save:`<path d="M5 3h11l4 4v14H5z"/><path d="M8 3v6h8V3M8 21v-7h9v7"/>`,
  trash:`<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>`,
  flip:`<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>`,
  play:`<path d="M7 4.5v15l12-7.5z"/>`,
  pause:`<path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z"/>`,
  arrow:`<path d="M5 12h14M13 6l6 6-6 6"/>`,
  sun:`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  trophy:`<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 21h7M10 17h4v4h-4z"/>`,
  msg:`<path d="M4 5h16v11H9l-5 4z"/>`
};
const icon = (k, cls) => `<svg class="lp-icon ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[k] || ICON.info}</svg>`;

/* ---------- стан уроку ---------- */
const LP = ctx => { const g = ctx.all._lp = ctx.all._lp || {}; g.seen = g.seen || {}; return g; };
const kinds = ctx => (window.SignalApp && window.SignalApp.screens) ? window.SignalApp.screens(ctx.les.id) : [];
const jumpTo = (ctx, kind) => { const i = kinds(ctx).indexOf(kind); if (i >= 0) location.hash = `#/episode/${ctx.les.id}/${i + 1}`; };
function progress(ctx){
  const ls = S.L(ctx.les.id), total = kinds(ctx).length || 1;
  return Math.max(0, Math.min(100, Math.round(Object.keys(ls.done || {}).length / total * 100)));
}

/* ---------- перемикачі (переклад, підказка, зразок) — живуть, поки відкритий екран ---------- */
const OPEN = new Set();
let CUR = null, RESET = null, focusFS = false;
const isOpen = id => OPEN.has(id);
const foldBtn = (id, label, cls) => `<button class="lp-tog ${cls || ""} ${isOpen(id) ? "on" : ""}" type="button" data-lpfold="${id}" aria-expanded="${isOpen(id)}" aria-controls="${id}">${label}</button>`;
const foldBox = (id, html, cls) => `<div class="lp-fold ${cls || ""} ${isOpen(id) ? "open" : ""}" id="${id}">${html}</div>`;
const uaBtn = (id, label) => foldBtn(id, `<span aria-hidden="true">🇺🇦</span>${label == null ? " UA" : label ? " " + label : `<span class="sr-only">Ukrainian help</span>`}`, "ua");
const uaBox = (id, text) => foldBox(id, `<p>${text}</p>`, "lp-ua");
const keyBox = (ctx, html, label) => ctx.teacher ? `<div class="lp-key"><b>🧑‍🏫 ${esc(label || "Answer")}</b>${html}</div>` : "";

/* ---------- титр етапу (один раз) ---------- */
function stageCard(stage){
  if (!anim() || typeof document === "undefined") return;
  const n = document.createElement("div"); n.className = "lp-scard"; n.setAttribute("role", "status");
  n.innerHTML = `<div class="lp-scard-in"><span class="lp-osd">STAGE ${pad2(stage.n)} · ≈ ${stage.min} MIN</span><b>${esc(stage.title)} <span aria-hidden="true">${stage.emoji || ""}</span></b><i class="lp-scard-line"></i></div>`;
  const kill = () => { n.classList.add("out"); setTimeout(() => n.remove(), 360); };
  n.onclick = kill; document.body.appendChild(n); setTimeout(kill, 1500);
}

/* ---------- рамка екрана ---------- */
function frame(el, ctx){
  OPEN.clear(); RESET = null; CUR = { ctx, el };
  const g = LP(ctx), st = ctx.scr.stage;
  el.classList.add("lp-screen");
  el.classList.toggle("lp-uaall", !!g.ua);
  el.classList.toggle("lp-showkeys", !!(ctx.teacher && g.keys));
  document.body.dataset.lpWorld = ctx.scr.data.world || "mix";
  if (!g.seen[st.id]){ g.seen[st.id] = Date.now(); save(); if (st.n > 1) stageCard(st); }
}

/* ---------- верхня смуга ---------- */
function bar(ctx, o){
  o = o || {};
  const st = ctx.scr.stage, g = LP(ctx), pct = progress(ctx), n = ctx.les.stages.length;
  const key = ctx.scr.data.store;
  RESET = key ? () => { delete ctx.ans[key]; if (o.onReset) o.onReset(); save(); toast("Activity reset"); window.SignalApp.render(); } : null;
  const fs = document.body.classList.contains("lp-focus");
  return `<div class="lp-bar">
      <span class="lp-bar-t"><b>Stage ${st.n}</b><span class="lp-of">/${n}</span><i aria-hidden="true">·</i><span class="lp-bar-name">${esc(st.title)}</span></span>
      <span class="lp-bar-time" title="Estimated time for this stage">${icon("clock")} ≈ ${st.min} min</span>
      <span class="lp-prog" title="Lesson progress: ${pct}%"><span class="lp-prog-track" aria-hidden="true"><i style="width:${pct}%"></i></span><b>${pct}%</b></span>
      <span class="spacer"></span>
      <button class="lp-chip" type="button" data-lpguide title="Grammar & words guide">${icon("scale")}<span class="lp-hide-sm">Guide</span></button>
      <button class="lp-chip ${g.ua ? "on" : ""}" type="button" data-lpua aria-pressed="${!!g.ua}" title="Show or hide all Ukrainian help"><span aria-hidden="true">🇺🇦</span><span class="lp-hide-sm">UA</span></button>
      <button class="lp-chip ${fs ? "on" : ""}" type="button" data-lpfocus aria-pressed="${fs}" title="Focus mode — full screen for screen sharing">${icon(fs ? "unfocus" : "focus")}<span class="lp-hide-sm">Focus</span></button>
      ${ctx.teacher ? `<button class="lp-chip teach ${g.keys ? "on" : ""}" type="button" data-lpkeys aria-pressed="${!!g.keys}" title="Show or hide answers on the screen">${icon("key")}<span class="lp-hide-sm">Answers</span></button>` : ""}
      ${ctx.teacher && RESET ? `<button class="lp-chip warn" type="button" data-lpreset title="Clear the answers on this screen">${icon("undo")}<span class="lp-hide-sm">Reset</span></button>` : ""}
      ${ctx.teacher ? `<button class="lp-chip warn" type="button" data-lprestart title="Clear the whole lesson and start again">${icon("restart")}<span class="lp-hide-sm">Restart</span></button>` : ""}
    </div>`;
}
function head(ctx, title, intro, o){
  o = o || {};
  return `${bar(ctx, o)}<header class="lp-head">
    <p class="lp-kicker">${esc(o.kicker || `Stage ${pad2(ctx.scr.stage.n)} · ${ctx.scr.stage.title}`)}</p>
    <h2 class="stitle lp-title" id="stitle" tabindex="-1">${esc(title || ctx.scr.stage.title)}</h2>
    ${intro ? `<div class="lp-intro"><p>${esc(intro)}</p>${o.ua ? uaBtn("hd-ua", "") : ""}</div>${o.ua ? uaBox("hd-ua", esc(o.ua)) : ""}` : ""}
  </header>`;
}
const transition = t => `<div class="lp-transition"><span aria-hidden="true">▸</span><p>${esc(t)}</p></div>`;

/* ---------- бічна панель: Grammar & words guide ---------- */
function drawer(){
  if (!CUR) return;
  const ctx = CUR.ctx, les = ctx.les, g = LP(ctx);
  const gr = stageOf(les, "grammar");
  let host = document.getElementById("lp-drawer");
  if (!host){ host = document.createElement("div"); host.id = "lp-drawer"; document.body.appendChild(host); }
  host.className = "lp-drawer-host";
  host.innerHTML = `<div class="lp-scrim" data-lpclose></div><aside class="lp-drawer ${g.ua ? "lp-uaall" : ""}" role="dialog" aria-modal="true" aria-label="Grammar and words guide">
    <header class="lp-dr-head">${icon("scale")}<div><b>Grammar & Words Guide</b><small>Lesson 9 · Unit 3 revision</small></div><button class="icon-btn" type="button" data-lpclose aria-label="Close">✕</button></header>
    <div class="lp-dr-body">
      <h3 class="lp-h">Comparing</h3>
      <div class="lp-grs">${gr.guide.map(r => `<div class="lp-gr"><b>${esc(r.k)}</b><span class="lp-gr-f">${r.f}</span><p>${esc(r.en)}</p><i>“${esc(r.ex)}”</i>${say(r.ex)}<small class="lp-gr-ua">🇺🇦 ${esc(r.ua)}</small></div>`).join("")}</div>
      <div class="lp-order"><b>Word order</b>${gr.order.map(o => `<span>${esc(o)}</span>`).join("")}</div>
      <h3 class="lp-h">Life events (Lesson 7)</h3>
      <ul class="lp-lifelist">${(les.life || []).map(x => `<li><b>${esc(x.w)}</b><small>${esc(x.en)}</small><span class="lp-gr-ua">🇺🇦 ${esc(x.ua)}</span></li>`).join("")}</ul>
      <p class="lp-small muted">Tip: the 🇺🇦 UA button in the top bar shows all Ukrainian help at once.</p>
    </div></aside>`;
  host.hidden = false;
  const c = host.querySelector(".icon-btn[data-lpclose]"); if (c) c.focus();
}
function closeDrawer(){ const h = document.getElementById("lp-drawer"); if (h){ h.hidden = true; h.innerHTML = ""; } }

/* підказка до слова */
function wordPop(text){
  let n = document.getElementById("lp-wordpop");
  if (!n){ n = document.createElement("div"); n.id = "lp-wordpop"; n.setAttribute("role", "status"); document.body.appendChild(n); }
  n.className = "lp-wordpop";
  n.innerHTML = `<div>${text}</div><button class="icon-btn" type="button" data-lppopx aria-label="Close">✕</button>`;
  clearTimeout(wordPop.t); wordPop.t = setTimeout(() => { if (n.isConnected) n.className = "lp-wordpop out"; }, 7000);
}
const lifeOf = (les, w) => (les.life || []).find(x => x.w === w) || (les.words || []).find(x => x.w === w);
const wordBtn = (w, cls) => `<button class="lp-word ${cls || ""}" type="button" data-lpword="${esc(w)}">${esc(w)}</button>`;

/* ---------- Focus Mode ---------- */
function setFocus(on){
  document.body.classList.toggle("lp-focus", on);
  const d = document.documentElement;
  try {
    if (on && !document.fullscreenElement && d.requestFullscreen){ focusFS = true; d.requestFullscreen().catch(() => { focusFS = false; }); }
    if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  } catch(e){}
  $$("[data-lpfocus]").forEach(b => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); const s = b.querySelector("svg"); if (s) s.outerHTML = icon(on ? "unfocus" : "focus"); });
  toast(on ? "Focus mode on — press Esc or tap Focus to exit" : "Focus mode off");
}

if (typeof document !== "undefined"){
  document.addEventListener("click", e => {
    if (!e.target.closest) return;
    const f = e.target.closest("[data-lpfold]");
    if (f){
      const id = f.dataset.lpfold; const show = !OPEN.has(id);
      show ? OPEN.add(id) : OPEN.delete(id);
      const box = document.getElementById(id); if (box) box.classList.toggle("open", show);
      document.querySelectorAll(`[data-lpfold="${id}"]`).forEach(b => { b.classList.toggle("on", show); b.setAttribute("aria-expanded", String(show)); });
      return;
    }
    if (e.target.closest("[data-lppopx]")){ const n = document.getElementById("lp-wordpop"); if (n) n.className = "lp-wordpop out"; return; }
    if (!CUR) return;
    const ctx = CUR.ctx;
    const w = e.target.closest("[data-lpword]");
    if (w){ const x = lifeOf(ctx.les, w.dataset.lpword); if (x) wordPop(`<b>${esc(x.w)}</b> ${say(x.w)}<p>${esc(x.en)}</p><p class="ua">🇺🇦 ${esc(x.ua)}</p>${x.ex ? `<p class="ex">“${esc(x.ex)}”</p>` : ""}`); return; }
    if (e.target.closest("[data-lpguide]")){ drawer(); return; }
    if (e.target.closest("[data-lpclose]")){ closeDrawer(); return; }
    if (e.target.closest("[data-lpfocus]")){ setFocus(!document.body.classList.contains("lp-focus")); return; }
    const u = e.target.closest("[data-lpua]");
    if (u){ const g = LP(ctx); g.ua = !g.ua; save(); CUR.el.classList.toggle("lp-uaall", g.ua); $$("[data-lpua]").forEach(b => { b.classList.toggle("on", g.ua); b.setAttribute("aria-pressed", String(g.ua)); }); toast(g.ua ? "Ukrainian help: on" : "Ukrainian help: hidden"); return; }
    const k = e.target.closest("[data-lpkeys]");
    if (k && ctx.teacher){ const g = LP(ctx); g.keys = !g.keys; save(); CUR.el.classList.toggle("lp-showkeys", g.keys); k.classList.toggle("on", g.keys); k.setAttribute("aria-pressed", String(g.keys)); toast(g.keys ? "Answers: shown" : "Answers: hidden"); return; }
    const r = e.target.closest("[data-lpreset]");
    if (r && RESET){
      if (!r.dataset.confirm){
        r.dataset.confirm = "1"; r.classList.add("hot");
        const lab = r.querySelector(".lp-hide-sm"); if (lab) lab.textContent = "Tap again";
        setTimeout(() => { if (r.isConnected){ delete r.dataset.confirm; r.classList.remove("hot"); const t = r.querySelector(".lp-hide-sm"); if (t) t.textContent = "Reset"; } }, 3500);
        toast("Tap Reset again to clear this activity"); return;
      }
      RESET(); return;
    }
    const rs = e.target.closest("[data-lprestart]");
    if (rs && ctx.teacher){
      if (!rs.dataset.confirm){ rs.dataset.confirm = "1"; rs.classList.add("hot"); setTimeout(() => { if (rs.isConnected){ delete rs.dataset.confirm; rs.classList.remove("hot"); } }, 4000); toast("Tap Restart again to clear the whole lesson"); return; }
      const id = ctx.les.id; closeDrawer();
      if (S.resetLesson) S.resetLesson(id); else { delete S.state.lessons[id]; save(); }
      toast("Lesson 9 restarted"); location.hash = `#/episode/${id}/1`; if (window.SignalApp) window.SignalApp.render();
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeDrawer(); if (document.body.classList.contains("lp-focus") && !document.fullscreenElement) setFocus(false); } });
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && focusFS && document.body.classList.contains("lp-focus")){ focusFS = false; document.body.classList.remove("lp-focus"); $$("[data-lpfocus]").forEach(b => { b.classList.remove("on"); b.setAttribute("aria-pressed", "false"); }); } });
  window.addEventListener("hashchange", () => {
    closeDrawer(); const n = document.getElementById("lp-wordpop"); if (n) n.className = "lp-wordpop out";
    if (!/^#\/episode\/c3c\/\d+/.test(location.hash) && document.body.classList.contains("lp-focus")) setFocus(false);
  });
}

/* ---------- усне питання: переклад, початок, додаткові питання, зразок, Done ---------- */
function spk(ctx, id, q, A, o){
  o = o || {}; A = A || {}; A.done = A.done || {};
  const done = !!A.done[id];
  return `<div class="lp-q ${o.small ? "small" : ""} ${done ? "done" : ""}">
    <div class="lp-qrow">${o.num ? `<span class="lp-qn">${o.num}</span>` : ""}<p class="lp-bigq">${esc(q.q)}</p>${say(q.q, "Listen to the question")}</div>
    ${q.starter ? `<p class="lp-starter"><span>Start like this</span>${esc(q.starter)}</p>` : ""}
    ${o.extra || ""}
    <div class="lp-tools">${q.ua ? uaBtn(id + "-ua") : ""}${q.hint ? foldBtn(id + "-hi", "💡 Hint") : ""}${q.fu && q.fu.length ? foldBtn(id + "-fu", "Follow-up") : ""}${ctx.teacher && q.ex ? foldBtn(id + "-ex", "🧑‍🏫 Sample answer", "teach") : ""}
      <span class="spacer"></span><button class="lp-done ${done ? "on" : ""}" type="button" data-spk="${id}" aria-pressed="${done}">${done ? `${icon("check")} Done` : `${icon("mic")} Mark as done`}</button></div>
    ${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}
    ${q.hint ? foldBox(id + "-hi", `<p>${esc(q.hint)}</p>`, "lp-hint") : ""}
    ${q.fu && q.fu.length ? foldBox(id + "-fu", `<ul class="lp-fu">${q.fu.map(f => `<li><span>${esc(f)}</span>${say(f)}</li>`).join("")}</ul>`) : ""}
    ${ctx.teacher && q.ex ? foldBox(id + "-ex", `<p>“${esc(q.ex)}”</p>`, "lp-sample") : ""}
  </div>`;
}
function spkClick(e, A){
  const b = e.target.closest("[data-spk]"); if (!b) return false;
  A.done = A.done || {}; const id = b.dataset.spk; A.done[id] = !A.done[id]; save();
  b.classList.toggle("on", A.done[id]); b.setAttribute("aria-pressed", String(A.done[id])); b.innerHTML = A.done[id] ? `${icon("check")} Done` : `${icon("mic")} Mark as done`;
  const q = b.closest(".lp-q"); if (q) q.classList.toggle("done", A.done[id]);
  return id;
}

/* ---------- питання з вибором: 1-ша помилка → підказка, 2-га → правильна відповідь ---------- */
const mcqDone = R => !!(R && (R.ok || R.shown));
function mcqHTML(ctx, id, q, R, o){
  o = o || {}; R = R || {}; const wrong = R.wrong || []; const done = mcqDone(R);
  let fb = "";
  if (R.ok) fb = `<div class="note good lp-fb">✓ ${esc(R.first ? good(o.n) : "Yes, that's it!")} ${esc(q.why || "")} ${q.ua ? uaBtn(id + "-ua", "") : ""}</div>`;
  else if (R.shown) fb = `<div class="note info lp-fb">The answer is <b>${LETTER(q.a)}. ${esc(q.o[q.a])}</b> ${esc(q.why || "")} ${q.ua ? uaBtn(id + "-ua", "") : ""}</div>`;
  else if (wrong.length) fb = `<div class="note amber lp-fb">Not quite. ${esc(q.hint || "Try again.")} ${q.ua ? uaBtn(id + "-ua", "") : ""}</div>`;
  return `<div class="lp-mcq ${done ? "done" : ""}" data-qid="${id}">
    <div class="lp-qrow">${o.num ? `<span class="lp-qn">${o.num}</span>` : ""}<p class="lp-mq">${esc(q.q)}</p>${say(q.q, "Listen to the question")}</div>
    <div class="lp-opts">${q.o.map((x, k) => { let cls = ""; if (done && k === q.a) cls = "good"; else if (wrong.includes(k)) cls = "bad";
      return `<button class="lp-opt ${cls}" type="button" data-opt="${id}:${k}" ${done || wrong.includes(k) ? "disabled" : ""}><b class="lp-letter" aria-hidden="true">${LETTER(k)}</b><span>${esc(x)}</span></button>`; }).join("")}</div>
    <div aria-live="polite">${fb}</div>${q.ua ? uaBox(id + "-ua", esc(q.ua)) : ""}
    ${ctx.teacher && !done ? `<button class="btn small link lp-reveal" type="button" data-oshow="${id}">Reveal answer</button>` : ""}
  </div>`;
}
function mcqClick(e, get){
  const b = e.target.closest("[data-opt]");
  if (b){
    const parts = b.dataset.opt.split(":"); const k = +parts.pop(); const id = parts.join(":");
    const x = get(id); if (!x) return false; const R = x.R;
    if (mcqDone(R)) return id;
    if (k === x.q.a){ R.ok = true; R.first = !(R.wrong && R.wrong.length); }
    else { R.wrong = (R.wrong || []).concat(k); if (R.wrong.length >= 2) R.shown = true; }
    save(); return id;
  }
  const s = e.target.closest("[data-oshow]");
  if (s){ const x = get(s.dataset.oshow); if (x){ x.R.shown = true; save(); return s.dataset.oshow; } }
  return false;
}

/* ---------- картинки з запасним малюнком ---------- */
const media = (les, k) => (les.media || {})[k] || null;
function pic(src, alt, fb, cls){
  if (!src) return `<span class="lp-pic ${cls || ""} fail"><span class="lp-pic-fb">${fb}</span></span>`;
  return `<span class="lp-pic ${cls || ""}"><img src="${esc(src)}" alt="${esc(alt || "")}" decoding="async" onerror="this.parentNode.classList.add('fail')"><span class="lp-pic-fb">${fb}</span></span>`;
}

/* ---------- малюнки (SVG) ---------- */
const ART = {
  room:() => `<svg viewBox="0 0 960 540" role="img" aria-label="A dark teenage bedroom at night. An old diary lies on a wooden desk under a small lamp. A phone is glowing." preserveAspectRatio="xMidYMid slice"><defs>
      <linearGradient id="lpw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151935"/><stop offset="1" stop-color="#0A0C1C"/></linearGradient>
      <linearGradient id="lpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1238"/><stop offset="1" stop-color="#2A2560"/></linearGradient>
      <radialGradient id="lplamp" cx=".22" cy=".62" r=".5"><stop offset="0" stop-color="#FFC56B" stop-opacity=".55"/><stop offset=".55" stop-color="#FF9A3C" stop-opacity=".12"/><stop offset="1" stop-color="#FF9A3C" stop-opacity="0"/></radialGradient>
      <radialGradient id="lpglow" cx=".74" cy=".55" r=".35"><stop offset="0" stop-color="#7E8BFF" stop-opacity=".45"/><stop offset="1" stop-color="#7E8BFF" stop-opacity="0"/></radialGradient>
      <linearGradient id="lpdesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset="1" stop-color="#2E1C10"/></linearGradient></defs>
    <rect width="960" height="540" fill="url(#lpw)"/>
    <g opacity=".9"><rect x="560" y="40" width="300" height="230" rx="6" fill="url(#lpsky)" stroke="#1E2348" stroke-width="10"/><path d="M710 40v230M560 155h300" stroke="#1E2348" stroke-width="8"/>
      <circle cx="790" cy="90" r="22" fill="#F4EBC6" opacity=".9"/><circle cx="800" cy="84" r="20" fill="#0F1640" opacity=".85"/>
      ${[[600,80],[650,120],[640,60],[690,95],[740,180],[820,200],[600,200],[770,230]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.8" fill="#fff" opacity=".8"/>`).join("")}</g>
    <g opacity=".55"><rect x="70" y="70" width="110" height="150" rx="4" fill="#1B2244"/><rect x="82" y="84" width="86" height="60" fill="#2C3566"/><path d="M90 160h70M90 176h50M90 192h60" stroke="#3A4480" stroke-width="6"/></g>
    <rect y="360" width="960" height="40" fill="url(#lpdesk)"/><rect y="398" width="960" height="142" fill="#120C08"/>
    <path d="M150 360l40-110h22l-26 110z" fill="#2B1E14"/><path d="M162 250c-30-6-60 10-64 26l100 0c-6-18-20-26-36-26z" fill="#E09A3F"/>
    <rect width="960" height="540" fill="url(#lplamp)"/><rect width="960" height="540" fill="url(#lpglow)"/>
    <g opacity=".6"><rect x="300" y="352" width="70" height="10" rx="2" fill="#C9B79A"/><rect x="310" y="342" width="60" height="10" rx="2" fill="#8FB4C8"/></g>
  </svg>`,
  envelope:() => `<svg viewBox="0 0 220 150" role="img" aria-label="An old envelope from Westbridge Sports Academy"><rect x="6" y="10" width="208" height="132" rx="6" fill="#EAD9B6"/><path d="M6 16l104 70 104-70" fill="none" stroke="#C9B48A" stroke-width="3"/><circle cx="110" cy="86" r="18" fill="#9B2C2C"/><text x="110" y="92" text-anchor="middle" font-family="'Special Elite',monospace" font-size="13" fill="#F6E3C6">WSA</text><text x="18" y="130" font-family="'Special Elite',monospace" font-size="10" fill="#6E5A3A">WESTBRIDGE SPORTS ACADEMY</text><rect x="170" y="20" width="34" height="40" fill="#C0392B" opacity=".85"/><path d="M174 26h26M174 34h20" stroke="#F6E3C6" stroke-width="2"/></svg>`,
  ticket:() => `<svg viewBox="0 0 220 150" role="img" aria-label="An old train ticket to Westbridge, 31 August 1998, unused"><g transform="rotate(-4 110 75)"><rect x="14" y="30" width="192" height="92" rx="6" fill="#F1C96B"/><circle cx="14" cy="76" r="9" fill="#2B1E14"/><circle cx="206" cy="76" r="9" fill="#2B1E14"/><path d="M150 34v84" stroke="#B88C2E" stroke-width="2" stroke-dasharray="4 4"/><text x="28" y="56" font-family="'Special Elite',monospace" font-size="11" fill="#5A3A10">RAIL · 2nd CLASS</text><text x="28" y="80" font-family="'Special Elite',monospace" font-size="17" fill="#3A220A">WESTBRIDGE</text><text x="28" y="102" font-family="'Special Elite',monospace" font-size="12" fill="#5A3A10">31.08.1998 · 07:15</text><text x="158" y="86" font-family="'Special Elite',monospace" font-size="10" fill="#5A3A10" transform="rotate(-90 172 78)">No 004917</text></g></svg>`,
  team:() => `<svg viewBox="0 0 320 240" role="img" aria-label="An old photo of a school football team in 1997"><defs><linearGradient id="lpft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8B48E"/><stop offset=".55" stop-color="#9DB07A"/><stop offset="1" stop-color="#6E8A4E"/></linearGradient></defs><rect width="320" height="240" fill="url(#lpft)"/><rect y="150" width="320" height="90" fill="#5E7A42"/><path d="M20 70h280v20H20z" fill="#EDE5D0" opacity=".35"/>
    ${[0,1,2,3,4,5].map(i => `<g transform="translate(${44 + i * 46},96)"><circle cx="0" cy="0" r="12" fill="#C99C7A"/><path d="M-14 12q14-6 28 0v34h-28z" fill="${i === 2 ? "#2E4F8F" : "#8E2B2B"}"/><text x="0" y="34" text-anchor="middle" font-family="Manrope,sans-serif" font-size="11" font-weight="800" fill="#F6E3C6">${[4,7,10,9,2,5][i]}</text></g>`).join("")}
    ${[0,1,2,3,4].map(i => `<g transform="translate(${66 + i * 46},150)"><circle cx="0" cy="0" r="12" fill="#B98C6A"/><path d="M-14 12q14-6 28 0v30h-28z" fill="#8E2B2B"/></g>`).join("")}
    <circle cx="160" cy="214" r="12" fill="#F4F0E6" stroke="#333" stroke-width="2"/><rect width="320" height="240" fill="#8A5A2A" opacity=".18"/><text x="12" y="230" font-family="'Courier New',monospace" font-size="12" font-weight="700" fill="#FF8A2A">'97 05 16</text></svg>`,
  living:() => `<svg viewBox="0 0 960 400" role="img" aria-label="A warm living room in the evening with a sofa and a lamp" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="lplv" cx=".2" cy=".3" r=".9"><stop offset="0" stop-color="#FFB45E" stop-opacity=".55"/><stop offset="1" stop-color="#2A1A12" stop-opacity="0"/></radialGradient></defs><rect width="960" height="400" fill="#2A1E1A"/><rect x="620" y="40" width="240" height="180" rx="6" fill="#1B2148" stroke="#3A2A20" stroke-width="10"/><circle cx="780" cy="90" r="16" fill="#F4EBC6" opacity=".8"/><rect y="300" width="960" height="100" fill="#1A120E"/><rect x="220" y="210" width="420" height="100" rx="30" fill="#6E3B3B"/><rect x="200" y="190" width="460" height="50" rx="24" fill="#7E4646"/><rect x="250" y="226" width="80" height="44" rx="14" fill="#C08A4E"/><path d="M120 300v-170" stroke="#3A2A20" stroke-width="6"/><path d="M80 130h80l-14-50h-52z" fill="#F2B45E"/><rect width="960" height="400" fill="url(#lplv)"/></svg>`,
  kitchen:() => `<svg viewBox="0 0 960 400" role="img" aria-label="A kitchen table at night with a letter, a pen and a cup of tea" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="lpkt" cx=".5" cy=".2" r=".8"><stop offset="0" stop-color="#FFD08A" stop-opacity=".5"/><stop offset="1" stop-color="#1A1410" stop-opacity="0"/></radialGradient></defs><rect width="960" height="400" fill="#1E1814"/><path d="M480 0v70" stroke="#3A2A20" stroke-width="4"/><path d="M430 70h100l-20 40h-60z" fill="#F2B45E"/><rect y="250" width="960" height="150" fill="#5A3A22"/><rect y="250" width="960" height="10" fill="#6E4A2C"/><g transform="rotate(-6 470 300)"><rect x="380" y="250" width="200" height="120" fill="#F6EEDD"/>${[0,1,2,3,4].map(i => `<path d="M396 ${272 + i * 18}h${i % 2 ? 140 : 168}" stroke="#7A6650" stroke-width="3" opacity=".6"/>`).join("")}</g><path d="M600 300l70-30" stroke="#1E2A5A" stroke-width="6" stroke-linecap="round"/><rect x="250" y="262" width="56" height="50" rx="8" fill="#E8E0D0"/><path d="M306 276q20 0 20 14t-20 14" fill="none" stroke="#E8E0D0" stroke-width="6"/><rect width="960" height="400" fill="url(#lpkt)"/></svg>`,
  morning:() => `<svg viewBox="0 0 960 400" role="img" aria-label="Early morning: the sun rises behind the window of Marko's room" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="lpmo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B6CC7"/><stop offset=".55" stop-color="#F7A26B"/><stop offset="1" stop-color="#FFD9A0"/></linearGradient></defs><rect width="960" height="400" fill="url(#lpmo)"/><circle cx="480" cy="330" r="80" fill="#FFE7B0"/><path d="M0 330q240-40 480-10t480-20v100H0z" fill="#3A3A66" opacity=".55"/><rect x="0" y="0" width="960" height="400" fill="none" stroke="#2A2A4A" stroke-width="40"/><path d="M480 0v400M0 200h960" stroke="#2A2A4A" stroke-width="14"/></svg>`
};

/* ---------- обличчя, чат ---------- */
function face(les, who, cls){
  const c = les.characters[who] || {};
  const ch = esc((c.name || "?")[0]);
  if (c.img){ const f = c.face || { x:50, y:38 };
    return `<span class="lp-ava ${cls || ""}" data-ch="${ch}"><img src="${esc(c.img)}" alt="" decoding="async" style="object-position:${f.x}% ${f.y}%;transform-origin:${f.x}% ${f.y}%;transform:scale(1.9)" onerror="this.parentNode.classList.add('mono');this.parentNode.textContent=this.parentNode.dataset.ch"></span>`; }
  if (c.look && S.avatar) return `<span class="lp-ava svg ${cls || ""}" aria-hidden="true">${S.avatar(c.look, { noProp:true, label:c.name })}</span>`;
  return `<span class="lp-ava mono ${cls || ""}" aria-hidden="true">${esc(c.glyph || ch)}</span>`;
}
function bubble(les, m){
  if (m.sys) return `<div class="lp-sys">${esc(m.sys)}</div>`;
  const c = les.characters[m.who] || { name:m.who };
  return `<div class="lp-msg who-${esc(m.who)} ${m.me ? "me" : ""}">${m.me ? "" : face(les, m.who)}<div class="lp-bub"><b class="lp-name">${esc(c.name)}</b><span>${esc(m.t)}</span></div></div>`;
}
const chatHTML = (les, items) => items.filter(m => !m.pause).map(m => bubble(les, m)).join("");
function playChat(box, les, items, o){
  o = o || {}; let k = 0, alive = true; onCleanup(() => { alive = false; });
  if (!box) return;
  const stop = () => !alive || !box.isConnected || (o.stopped && o.stopped());
  const scroll = () => { if (box.scrollHeight > box.clientHeight) box.scrollTop = box.scrollHeight; };
  const step = () => {
    if (stop()) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const m = items[k++];
    if (m.pause){ later(step, anim() ? m.pause : 0); return; }
    if (m.sys){ box.insertAdjacentHTML("beforeend", bubble(les, m)); scroll(); later(step, 250); return; }
    const t = document.createElement("div"); t.className = "lp-typing" + (m.me ? " me" : "");
    t.innerHTML = `<span class="lp-tdots" aria-hidden="true"><i></i><i></i><i></i></span>${esc((les.characters[m.who] || {}).name || "Someone")} is typing…`;
    box.appendChild(t); scroll();
    later(() => { if (stop()) return; t.remove(); box.insertAdjacentHTML("beforeend", bubble(les, m)); scroll(); if (o.each) o.each(m); later(step, 480); },
      Math.min(1500, 450 + String(m.t || "").length * 12));
  };
  later(step, o.delay || 300);
}
function chatOnce(box, les, items, A, flag, o){
  o = o || {}; if (!box) return;
  if (A[flag] || !anim()){ box.innerHTML = chatHTML(les, items); box.scrollTop = box.scrollHeight; A[flag] = true; save(); if (o.done) o.done(true); return; }
  playChat(box, les, items, { delay:o.delay || 350, stopped:o.stopped, done: () => { A[flag] = true; save(); if (o.done) o.done(false); } });
}
const phone = (les, who, o) => { o = o || {}; const c = les.characters[who] || { name:who };
  return `<div class="lp-phone ${o.cls || ""}"><div class="lp-phone-head">${face(les, who)}<div><b>${esc(o.title || c.name)}</b><small>${esc(o.status || "online")}</small></div><span class="lp-phone-dot" aria-hidden="true"></span></div>
    <div class="lp-thread" id="${o.id || "th"}" aria-live="polite">${o.inner || ""}</div>${o.foot ? `<div class="lp-phone-foot">${o.foot}</div>` : ""}</div>`; };
function confetti(host){
  if (!anim() || !host) return;
  const n = document.createElement("div"); n.className = "lp-confetti"; n.setAttribute("aria-hidden", "true");
  const C = ["#F2A541", "#FFD27A", "#7E8BFF", "#B18CFF", "#5CE1E6", "#FF8FA3"];
  n.innerHTML = Array.from({ length:42 }, (_, i) => `<i style="--x:${Math.round(Math.random() * 100)}%;--d:${(Math.random() * .6).toFixed(2)}s;--r:${Math.round(Math.random() * 720 - 360)}deg;--c:${C[i % C.length]}"></i>`).join("");
  host.appendChild(n); setTimeout(() => n.remove(), 2600);
}

/* ============================================================
   STAGE 1 · lpOpen — повідомлення тата, темна кімната, щоденник на столі
   ============================================================ */
define("lpOpen", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, O = ctx.scr.stage.open, A = store(ctx, scr, "open");
  const first = !A.seen && anim();
  el.innerHTML = `${bar(ctx)}<div class="lp-open">
      <h2 class="sr-only" id="stitle" tabindex="-1">Stage 1: The Last Page. Dad's message</h2>
      <p class="lp-osd lp-open-osd" aria-hidden="true">● ${esc(O.osd)}</p>
      <div class="lp-scene ${first ? "dim" : ""}" id="scene">
        <div class="lp-scene-art">
          ${pic(media(les, "room"), "A dark teenage bedroom at night. An old diary lies on a wooden desk. A phone is glowing.", ART.room(), "lp-scene-bg")}
          <button class="lp-book" id="book" type="button" data-openpage aria-label="Open the last page of Dad's diary">
            <span class="lp-book-pages" aria-hidden="true"><i></i></span>
            <span class="lp-book-cover" aria-hidden="true"><b>DAN</b><small>1998</small><i class="lp-strap"></i></span>
          </button>
        </div>
        <div class="lp-scene-phone ${first ? "waiting" : ""}" id="ph">
          ${phone(les, "dad", { id:"th", status:"last seen 21:47", cls:"glass" })}
        </div>
      </div>
      <p class="lp-tbc-mini" id="tbc" ${A.chat ? "" : "hidden"}>${esc(O.tbc)}</p>
      <p class="lp-caption" id="cap" ${A.chat || !first ? "" : "hidden"}>${esc(O.caption)}</p>
      <div class="lp-open-cta"><button class="lp-bigbtn" type="button" data-openpage>${icon("unlock")} ${esc(O.cta)}</button>
        ${!A.chat ? `<button class="btn small link" type="button" data-allchat>Show all messages</button>` : `<button class="btn small link" type="button" data-replay>↻ Replay messages</button>`}</div>
    </div>`;
  const th = $("#th", el), ph = $("#ph", el);
  let gen = 0;
  const finish = () => { A.chat = true; A.seen = true; save(); const t = $("#tbc", el), c = $("#cap", el); if (t) t.hidden = false; if (c){ c.hidden = false; c.classList.add("lp-in"); } };
  const run = () => { gen++; const my = gen; th.innerHTML = ""; playChat(th, les, O.chat, { delay:500, stopped: () => my !== gen, done: finish }); };
  const all = () => { gen++; th.innerHTML = chatHTML(les, O.chat); finish(); const b = $("[data-allchat]", el); if (b) b.remove(); };
  if (first){ later(() => { ph.classList.remove("waiting"); ph.classList.add("lp-buzz"); $("#scene", el).classList.remove("dim"); later(() => ph.classList.remove("lp-buzz"), 800); run(); }, 900); }
  else all();
  let opening = false;
  const open = () => {
    if (opening) return; opening = true; A.opened = true; save();
    const b = $("#book", el), sc = $("#scene", el);
    if (!anim()){ ctx.next(); return; }
    b.classList.add("open"); sc.classList.add("zoom");
    later(() => ctx.next(), 1300);
  };
  el.onclick = e => {
    if (e.target.closest("[data-openpage]")){ open(); return; }
    if (e.target.closest("[data-allchat]")){ all(); return; }
    if (e.target.closest("[data-replay]")) run();
  };
  ctx.setCTA({ label:O.cta, action: open });
}, { label: () => "Dad's message" });

/* ============================================================
   lpDiary — запис 24.08.1998, сховані рядки, 3 прогнози, словничок
   ============================================================ */
function diaryHTML(D, revealed, o){
  o = o || {};
  return `<article class="lp-page ${o.compact ? "compact" : ""}" aria-label="Dad's diary, ${esc(D.date)}">
    <span class="lp-page-tape" aria-hidden="true"></span>
    <p class="lp-page-date">${esc(D.date)}</p>
    ${D.lines.map((l, i) => `<p class="${i === 0 ? "lp-dear" : ""}">${esc(l)}</p>`).join("")}
    <div class="lp-hidden ${revealed ? "open" : ""}" id="hid">
      <div class="lp-hidden-text">${D.hidden.map((l, i) => `<p class="lp-ink" style="--i:${i}">${revealed || o.compact ? esc(l) : `<span class="sr-only">Hidden line</span><span aria-hidden="true">${esc(l.replace(/[A-Za-z]/g, "x"))}</span>`}</p>`).join("")}</div>
      <span class="lp-strip" aria-hidden="true"><i></i><b>?</b></span>
    </div>
    <p class="lp-page-sign">${esc(D.sign)}</p>
  </article>`;
}
define("lpDiary", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, D = st.diary, A = store(ctx, scr, "diary");
  A.pick = A.pick || null;
  let fresh = false;
  const draw = () => {
    const shown = !!A.revealed;
    el.innerHTML = `${head(ctx, "The Last Page", shown ? "Now read the whole entry aloud." : "Read Dad's diary. The last lines are hidden — make your predictions first.", { kicker:"Stage 01 · Reading + prediction", ua: shown ? "Тепер прочитай увесь запис уголос." : "Прочитай щоденник тата. Останні рядки сховані — спершу зроби прогнози." })}
      <div class="lp-dgrid">
        <div class="lp-dcol">
          ${diaryHTML(D, shown)}
          <div class="lp-tools">${say([D.date].concat(D.lines, shown ? D.hidden : []).join(" "), "Listen to the diary")}${foldBtn("gl", `${icon("book")} Word help`)}</div>
          ${foldBox("gl", `<ul class="lp-gloss">${D.gloss.map(g => `<li><b>${esc(g.w)}</b><span>${esc(g.en)}</span><small>🇺🇦 ${esc(g.ua)}</small></li>`).join("")}</ul>`, "lp-glossbox")}
          <div class="lp-note-marko">${face(les, "marko")}<p><b>Marko:</b> ${esc(D.clue)}</p></div>
        </div>
        <aside class="lp-dside">
          <div class="card lp-predict ${shown ? "past" : ""}">
            <p class="lp-step-k">${icon("eye")} Before you reveal — predict</p>
            ${st.pre.map((q, i) => spk(ctx, "pre" + i, q, A, { small:true, num:i + 1, extra: q.pick ? `<div class="lp-pick" role="group" aria-label="Choose">${q.pick.map((p, k) => `<button class="lp-pickb ${A.pick === k ? "on" : ""}" type="button" data-pick="${k}" aria-pressed="${A.pick === k}">${esc(p)}</button>`).join("")}</div>` : "" })).join("")}
          </div>
          ${shown ? `<div class="note good lp-in">${icon("check")} The hidden words are revealed. Were your predictions right?</div>`
            : `<button class="lp-bigbtn amber" type="button" data-reveal>${icon("eye")} REVEAL THE HIDDEN WORDS</button>`}
        </aside>
      </div>`;
    if (fresh){ const h = $("#hid", el); if (h){ h.classList.add("peel"); } fresh = false; }
    ctx.setCTA(shown ? { label:"After reading: 4 questions →" } : { label:"Reveal the hidden words", action: reveal });
  };
  const reveal = () => { A.revealed = true; save(); fresh = anim(); draw(); scrollTo($("#hid", el), "center"); };
  el.onclick = e => {
    if (e.target.closest("[data-reveal]")){ reveal(); return; }
    const p = e.target.closest("[data-pick]"); if (p){ A.pick = +p.dataset.pick; save(); $$("[data-pick]", el).forEach(b => { const on = +b.dataset.pick === A.pick; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); return; }
    spkClick(e, A);
  };
  draw();
}, { label: () => "The diary" });

/* ============================================================
   lpDiaryQs — 4 питання після читання (2 з вибором, 2 усні)
   ============================================================ */
define("lpDiaryQs", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, D = st.diary, A = store(ctx, scr, "qs"); A.r = A.r || {};
  const draw = () => {
    const doneN = st.post.filter((q, i) => q.kind === "mcq" ? mcqDone(A.r[i]) : (A.done || {})["o" + i]).length;
    el.innerHTML = `${head(ctx, "After Reading", "Answer the questions. Two of them are speaking questions — answer out loud.", { kicker:"Stage 01 · Reading", ua:"Дай відповіді на питання. Два з них — усні: відповідай уголос." })}
      <div class="lp-dgrid rev">
        <div class="lp-dcol">${diaryHTML(D, true, { compact:true })}</div>
        <div class="lp-qcol">
          ${st.post.map((q, i) => `<div class="card lp-qcard">${q.kind === "mcq" ? mcqHTML(ctx, "m" + i, q, A.r[i] = A.r[i] || {}, { num:i + 1, n:i }) : spk(ctx, "o" + i, q, A, { num:i + 1 })}</div>`).join("")}
          ${ctx.teacher ? `<div class="lp-tools">${foldBtn("tp", "🧑‍🏫 Teacher prompts", "teach")}</div>${foldBox("tp", `<ul class="lp-fu plain">${st.prompts.map(p => `<li>“${esc(p)}”</li>`).join("")}</ul>`, "lp-sample")}` : ""}
          <p class="lp-count">${doneN} / ${st.post.length} answered</p>
        </div>
      </div>
      <div class="lp-endline ${doneN === st.post.length ? "lp-in" : ""}"><p>${esc(st.endLine)}</p></div>`;
    ctx.setCTA({ label:"FOLLOW THE CLUES →" });
  };
  el.onclick = e => {
    if (spkClick(e, A)){ draw(); return; }
    const id = mcqClick(e, k => { const i = +k.slice(1); const q = st.post[i]; return q && q.kind === "mcq" ? { q, R:A.r[i] = A.r[i] || {} } : null; });
    if (id !== false){ draw(); const n = $(`[data-qid="${id}"]`, el); if (n) scrollTo(n); }
  };
  draw();
}, { label: () => "4 questions" });

/* ============================================================
   STAGE 2 · lpTimeline — віднови хронологію (перетягування + ▲▼)
   ============================================================ */
define("lpTimeline", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "timeline");
  const right = st.events.map(x => x.id);
  if (!Array.isArray(A.order) || A.order.length !== right.length || right.some(id => !A.order.includes(id))) A.order = st.start.slice();
  let moved = null, msg = null;
  const ev = id => st.events.find(x => x.id === id);
  const draw = () => {
    const ok = A.order.map((id, i) => id === right[i]);
    const nOK = ok.filter(Boolean).length;
    const solved = !!A.solved;
    el.innerHTML = `${head(ctx, "Rebuild Dad's Timeline", st.intro, { kicker:"Stage 02 · Life events", ua:st.ua })}
      <div class="lp-tlgrid">
        <div class="lp-tlwrap ${solved ? "solved" : ""}">
          <ol class="lp-tl" id="tl" aria-label="Dad's timeline. Use the arrow buttons or drag the cards.">
            ${A.order.map((id, i) => { const x = ev(id); const cls = A.checked ? (ok[i] ? "ok" : "no") : "";
              return `<li class="lp-tcard ${cls} ${moved === id ? "moved" : ""}" data-id="${id}" draggable="${solved ? "false" : "true"}">
                <span class="lp-tdot" aria-hidden="true">${solved ? "" : i + 1}</span>
                <span class="lp-grip" aria-hidden="true">${solved ? "" : icon("grip")}</span>
                <span class="lp-ttext">${solved ? `<span class="lp-year">${esc(x.y)}</span>` : ""}<b>${esc(x.t)}</b>${solved && x.life ? `<span class="lp-life">${wordBtn(x.life, "sm")}<small>${esc(x.say)}</small></span>` : ""}</span>
                ${solved ? `<span class="lp-tok" aria-label="correct">${icon("check")}</span>` : `<span class="lp-arrows"><button class="lp-arr" type="button" data-up="${id}" ${i === 0 ? "disabled" : ""} aria-label="Move up: ${esc(x.t)}">${icon("up")}</button><button class="lp-arr" type="button" data-down="${id}" ${i === A.order.length - 1 ? "disabled" : ""} aria-label="Move down: ${esc(x.t)}">${icon("down")}</button></span>`}
              </li>`; }).join("")}
          </ol>
          <div class="row lp-tlbtns">
            ${solved ? `<span class="pill good">${icon("check")} Timeline complete${A.revealed ? " (revealed)" : ""}</span>`
              : `<button class="btn primary" type="button" data-check>${icon("check")} Check</button><button class="btn" type="button" data-treset>${icon("undo")} Reset</button>${ctx.teacher ? `<button class="btn small ghost" type="button" data-treveal>🧑‍🏫 Reveal answer</button>` : ""}`}
            ${A.checked && !solved ? `<span class="lp-count" aria-live="polite">${nOK} / ${right.length} in the right place</span>` : ""}
          </div>
          <div aria-live="polite">${msg ? `<div class="note ${msg.c}">${msg.t}</div>` : ""}</div>
        </div>
        <aside class="lp-tlside">
          ${solved ? `<div class="card lp-in"><p class="lp-step-k">${icon("mic")} Say it with life-event phrases</p><ul class="lp-saylist">${st.events.filter(x => x.say).map(x => `<li>${wordBtn(x.life, "sm")}<span>${esc(x.say)}</span>${say(x.say)}</li>`).join("")}</ul></div>
            <div class="card lp-in">${spk(ctx, "diff", st.difficult, A)}</div>`
          : `<div class="card lp-tlhelp"><p class="lp-step-k">${icon("info")} How to play</p><ul class="lp-fu plain"><li>Drag a card up or down,</li><li>or use the ▲ ▼ buttons.</li><li>Then tap <b>Check</b>.</li></ul><p class="lp-small">Life-event phrases to look for:</p><div class="lp-words">${["leave home", "get a job", "get married", "have children"].map(w => wordBtn(w)).join("")}</div></div>`}
        </aside>
      </div>`;
    ctx.setCTA(solved ? { label:"Dad's life & my future →" } : { label:"Check the timeline", action: check });
    moved = null;
  };
  const check = () => {
    A.checked = true; A.tries = (A.tries || 0) + 1;
    const ok = A.order.map((id, i) => id === right[i]);
    if (ok.every(Boolean)){ A.solved = true; msg = { c:"good", t:`✓ Perfect! That's Dad's life from 1997 to today. ${A.tries === 1 ? "First try!" : ""}` }; }
    else { const k = ok.indexOf(false); const id = A.order[k]; const h = st.hints[id] || st.hints[right[k]]; msg = { c:"amber", t:`Not yet. Look at card ${k + 1}. ${h ? esc(h) : "Check the dates."}` }; }
    save(); draw();
  };
  const move = (id, dir) => { const i = A.order.indexOf(id), j = i + dir; if (i < 0 || j < 0 || j >= A.order.length) return; A.order.splice(i, 1); A.order.splice(j, 0, id); A.checked = false; msg = null; moved = id; save(); draw();
    const b = $(`[data-${dir < 0 ? "up" : "down"}="${id}"]`, el) || $(`[data-${dir < 0 ? "down" : "up"}="${id}"]`, el); if (b && !b.disabled) b.focus(); else { const c = $(`[data-id="${id}"] .lp-arr:not([disabled])`, el); if (c) c.focus(); } };
  el.onclick = e => {
    const u = e.target.closest("[data-up]"); if (u){ move(u.dataset.up, -1); return; }
    const d = e.target.closest("[data-down]"); if (d){ move(d.dataset.down, 1); return; }
    if (e.target.closest("[data-check]")){ check(); return; }
    if (e.target.closest("[data-treset]")){ A.order = st.start.slice(); A.checked = false; msg = null; save(); draw(); return; }
    if (e.target.closest("[data-treveal]")){ A.order = right.slice(); A.solved = true; A.checked = true; A.revealed = true; msg = null; save(); draw(); return; }
    spkClick(e, A);
  };
  /* перетягування мишею */
  let dragId = null;
  el.ondragstart = e => { const c = e.target.closest(".lp-tcard[draggable=true]"); if (!c) return; dragId = c.dataset.id; c.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", dragId); e.dataTransfer.effectAllowed = "move"; } catch(x){} };
  el.ondragover = e => { const c = e.target.closest(".lp-tcard"); if (!c || !dragId) return; e.preventDefault(); const r = c.getBoundingClientRect(); const top = e.clientY < r.top + r.height / 2; $$(".lp-tcard", el).forEach(n => n.classList.remove("over-top", "over-bottom")); if (c.dataset.id !== dragId) c.classList.add(top ? "over-top" : "over-bottom"); };
  el.ondragleave = e => { const c = e.target.closest(".lp-tcard"); if (c && !c.contains(e.relatedTarget)) c.classList.remove("over-top", "over-bottom"); };
  el.ondrop = e => {
    const c = e.target.closest(".lp-tcard"); if (!c || !dragId) return; e.preventDefault();
    const r = c.getBoundingClientRect(); const top = e.clientY < r.top + r.height / 2; const target = c.dataset.id;
    if (target !== dragId){ A.order.splice(A.order.indexOf(dragId), 1); const k = A.order.indexOf(target); A.order.splice(top ? k : k + 1, 0, dragId); A.checked = false; msg = null; moved = dragId; save(); }
    dragId = null; draw();
  };
  el.ondragend = () => { dragId = null; $$(".lp-tcard", el).forEach(n => n.classList.remove("dragging", "over-top", "over-bottom")); };
  onCleanup(() => { el.ondragend = null; });
  draw();
}, { label: () => "Timeline" });

/* ============================================================
   lpFuture — Dad's Life | My Future, 4 рамки, 13 виразів
   ============================================================ */
define("lpFuture", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, F = st.future, A = store(ctx, scr, "future"); A.done = A.done || {};
  const dadWords = st.events.filter(x => x.life).map(x => x.life);
  const draw = () => {
    const n = F.frames.filter((f, i) => A.done["f" + i]).length;
    el.innerHTML = `${head(ctx, "Dad's Life — My Future", "Look at Dad's life. Then talk about YOUR future: finish the sentences out loud.", { kicker:"Stage 02 · Speaking", ua:"Подивись на життя тата. Потім розкажи про СВОЄ майбутнє: закінчи речення вголос." })}
      <div class="lp-two">
        <section class="lp-life98"><p class="lp-k">📼 Dad's Life</p><ul>${F.dad.map(t => `<li>${icon("check")}<span>${esc(t)}</span></li>`).join("")}</ul><p class="lp-small">Life-event phrases: ${dadWords.map(w => wordBtn(w, "sm")).join(" ")}</p></section>
        <section class="lp-life26"><p class="lp-k">📱 My Future <span class="lp-count">${n} / ${F.frames.length}</span></p>
          <ul class="lp-frames">${F.frames.map((f, i) => `<li class="${A.done["f" + i] ? "done" : ""}"><span class="lp-frame-t">${esc(f.t)}</span>${say(f.t)}<button class="lp-done sm ${A.done["f" + i] ? "on" : ""}" type="button" data-spk="f${i}" aria-pressed="${!!A.done["f" + i]}">${A.done["f" + i] ? `${icon("check")} Said it` : `${icon("mic")} Said it?`}</button>${keyBox(ctx, `<p>“${esc(f.ex)}”</p>`, "Example")}</li>`).join("")}</ul>
        </section>
      </div>
      <div class="card lp-bank"><p class="lp-step-k">${icon("book")} 13 life events — tap a word for help</p>
        <div class="lp-words">${(les.life || []).map(x => wordBtn(x.w, dadWords.includes(x.w) ? "dad" : "")).join("")}</div>
        <p class="lp-small muted"><span class="lp-dotk dad"></span> used in Dad's timeline · <span class="lp-dotk"></span> try these for your future</p>
        <div class="lp-tools">${foldBtn("ff-fu", "Follow-up questions")}${ctx.teacher ? foldBtn("ff-ex", "🧑‍🏫 Examples", "teach") : ""}</div>
        ${foldBox("ff-fu", `<ul class="lp-fu">${F.fu.map(f => `<li><span>${esc(f)}</span>${say(f)}</li>`).join("")}</ul>`)}
        ${ctx.teacher ? foldBox("ff-ex", `<ul class="lp-fu plain">${F.frames.map(f => `<li>“${esc(f.ex)}”</li>`).join("")}</ul>`, "lp-sample") : ""}
      </div>
      ${transition(st.transition)}`;
    ctx.setCTA({ label:"Investigate the clues 🔎" });
  };
  el.onclick = e => { if (spkClick(e, A)) draw(); };
  draw();
}, { label: () => "My future" });

/* ============================================================
   STAGE 3 · lpDesk — три предмети: лист, квиток, фото (перевертається)
   ============================================================ */
define("lpDesk", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "desk"); A.seen = A.seen || {};
  const O = st.objects;
  if (!A.cur || !O.some(o => o.id === A.cur)) A.cur = null;
  let fresh = null;
  const detail = o => {
    if (o.id === "letter") return `<article class="lp-letter">${pic(null, "", ART.envelope(), "lp-env")}<div class="lp-letter-paper"><p class="lp-letterhead">${esc(o.head)}</p>${o.body.map((l, i) => `<p class="${i === 0 ? "lp-dear" : i >= o.body.length - 2 ? "lp-sig" : ""}">${esc(l)}</p>`).join("")}${say(o.body.join(" "), "Listen to the letter")}</div></article>`;
    if (o.id === "ticket") return `<article class="lp-ticketv">${pic(null, "", ART.ticket(), "lp-tkt")}<dl class="lp-tktinfo">${o.rows.map(r => `<div><dt>${esc(r[0])}</dt><dd class="${r[1] === "Unused" ? "stamp" : ""}">${esc(r[1])}</dd></div>`).join("")}</dl></article>`;
    return `<article class="lp-photov"><div class="lp-flip ${A.flip ? "flipped" : ""}" id="flip">
        <div class="lp-flip-f">${pic(media(les, "team"), "An old photo of Dad's school football team in 1997", ART.team(), "lp-team")}<span class="lp-flip-cap">${esc(o.front)}</span></div>
        <div class="lp-flip-b"><p>${esc(o.back)}</p><b>${esc(o.from)}</b></div>
      </div><button class="btn small" type="button" data-flip>${icon("flip")} Turn it over</button></article>`;
  };
  const draw = () => {
    const n = O.filter(o => A.seen[o.id]).length; const o = O.find(x => x.id === A.cur);
    el.innerHTML = `${head(ctx, "The Missing Pieces", "Three objects were hidden in the diary. Tap each one to investigate.", { kicker:"Stage 03 · Evidence", ua:"У щоденнику були сховані три предмети. Натисни на кожен, щоб дослідити." })}
      <div class="lp-desk">
        <div class="lp-desk-top"><span class="lp-osd">EVIDENCE ${n} / 3</span><span class="lp-dots">${O.map(x => `<i class="${A.seen[x.id] ? "on" : ""}"></i>`).join("")}</span></div>
        <div class="lp-objs">${O.map(x => `<button class="lp-obj o-${x.id} ${A.seen[x.id] ? "seen" : "new"} ${A.cur === x.id ? "on" : ""}" type="button" data-obj="${x.id}" aria-pressed="${A.cur === x.id}">
            <span class="lp-obj-art">${x.id === "letter" ? ART.envelope() : x.id === "ticket" ? ART.ticket() : pic(media(les, "team"), "", ART.team(), "lp-mini")}</span>
            <b>${esc(x.t)}</b><small>${esc(x.s)}</small>${A.seen[x.id] ? `<span class="lp-seen">${icon("check")}</span>` : `<span class="lp-pulse" aria-hidden="true"></span>`}</button>`).join("")}</div>
      </div>
      <div id="det" aria-live="polite">${o ? `<section class="lp-detail ${fresh === o.id ? "lp-in" : ""}"><p class="lp-step-k">${icon("search")} Evidence ${String.fromCharCode(65 + O.indexOf(o))} · ${esc(o.t)}</p>${detail(o)}
          <div class="card lp-dq">${spk(ctx, "q-" + o.id, { q:o.q, ex:o.ex }, A, { small:true })}</div></section>`
        : `<p class="lp-tip">${icon("eye")} Choose an object on the desk.</p>`}</div>
      ${n === 3 ? `<div class="note good lp-in">${icon("check")} All three clues found! Now decide: what do we really KNOW — and what is only a guess?</div>` : ""}`;
    ctx.setCTA({ label: n === 3 ? "Fact or guess? →" : "Continue" });
    fresh = null;
  };
  el.onclick = e => {
    const b = e.target.closest("[data-obj]");
    if (b){ A.cur = b.dataset.obj; const first = !A.seen[A.cur]; A.seen[A.cur] = true; fresh = A.cur; save(); draw(); if (first) scrollTo($("#det", el), "start"); return; }
    if (e.target.closest("[data-flip]")){ A.flip = !A.flip; save(); const f = $("#flip", el); if (f) f.classList.toggle("flipped", A.flip); return; }
    spkClick(e, A);
  };
  draw();
}, { label: () => "3 clues" });

/* ============================================================
   lpFacts — FACT чи GUESS?
   ============================================================ */
define("lpFacts", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, A = store(ctx, scr, "facts"); A.r = A.r || {};
  let fresh = null;
  const draw = () => {
    const done = st.facts.filter((f, i) => A.r[i] && A.r[i].ok).length, first = st.facts.filter((f, i) => A.r[i] && A.r[i].ok && !(A.r[i].wrong)).length;
    el.innerHTML = `${head(ctx, "Fact or Guess?", "Is each sentence a FACT (the clues prove it) or only a GUESS?", { kicker:"Stage 03 · Critical thinking", ua:"Кожне речення — це ФАКТ (докази це підтверджують) чи лише ПРИПУЩЕННЯ?" })}
      <div class="lp-fg">${st.facts.map((f, i) => { const R = A.r[i] = A.r[i] || {}; const fb = R.ok ? `<p class="lp-fgfb good">✓ ${esc(f.why)}</p>` : R.last ? `<p class="lp-fgfb amber">${esc(st.wrong[f.a])}</p>` : "";
        return `<article class="lp-fgc ${R.ok ? "ok a-" + f.a : ""} ${fresh === i ? (R.ok ? "lp-pop" : "shake") : ""}">
          <p class="lp-fgt"><span class="lp-qn">${i + 1}</span><span>${esc(f.t)}</span></p>
          <div class="lp-fgb" role="group" aria-label="Fact or guess">${["fact", "guess"].map(v => `<button class="lp-fgbtn v-${v} ${R.ok && f.a === v ? "good" : ""} ${R.last === v && !R.ok ? "bad" : ""}" type="button" data-fg="${i}:${v}" ${R.ok ? "disabled" : ""}>${v === "fact" ? "📌 FACT" : "💭 GUESS"}</button>`).join("")}</div>
          <div aria-live="polite">${fb}</div>
        </article>`; }).join("")}</div>
      <div class="row lp-under"><span class="pill ${done === st.facts.length ? "good" : ""}">${done} / ${st.facts.length} solved</span>${done === st.facts.length ? `<span class="pill accent">★ ${first} right first time</span>` : ""}${ctx.teacher && done < st.facts.length ? `<button class="btn small ghost" type="button" data-fgall>🧑‍🏫 Reveal all</button>` : ""}</div>
      ${done === st.facts.length ? `<div class="lp-incoming lp-in">${icon("msg")} <b>New message from Dad…</b></div>` : ""}`;
    ctx.setCTA({ label: done === st.facts.length ? "Read Dad's message 📩" : "Continue" });
    fresh = null;
  };
  el.onclick = e => {
    const b = e.target.closest("[data-fg]");
    if (b){ const [i, v] = b.dataset.fg.split(":"); const f = st.facts[+i], R = A.r[i] = A.r[i] || {}; if (R.ok) return;
      if (f.a === v){ R.ok = true; } else { R.wrong = (R.wrong || 0) + 1; R.last = v; }
      fresh = +i; save(); draw(); return; }
    if (e.target.closest("[data-fgall]")){ st.facts.forEach((f, i) => { const R = A.r[i] = A.r[i] || {}; if (!R.ok){ R.ok = true; R.wrong = R.wrong || 1; } }); save(); draw(); }
  };
  draw();
}, { label: () => "Fact or guess" });

/* ============================================================
   lpReveal — повідомлення тата + 4 питання для розмови
   ============================================================ */
define("lpReveal", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "reveal");
  el.innerHTML = `${head(ctx, "The Truth About the Ticket", "Read Dad's message aloud. Then talk about it — there's no single right answer.", { kicker:"Stage 03 · Story", ua:"Прочитай повідомлення тата вголос. Потім обговоріть — єдиної правильної відповіді немає." })}
    <div class="lp-revgrid">
      <div>${phone(les, "dad", { id:"rth", status:"online", foot:`<button class="btn small" type="button" data-rreplay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-rall>Show all</button>` })}</div>
      <div class="lp-talkcol" id="tc">${st.talk.map((q, i) => `<div class="card lp-qcard">${spk(ctx, "t" + i, q, A, { small:true, num:i + 1 })}</div>`).join("")}</div>
    </div>
    ${transition(st.transition)}`;
  const th = $("#rth", el); let gen = 0;
  const run = () => { gen++; const my = gen; th.innerHTML = ""; playChat(th, les, st.reveal, { delay:400, stopped: () => my !== gen, done: () => { A.chat = true; save(); } }); };
  if (A.chat || !anim()){ th.innerHTML = chatHTML(les, st.reveal); A.chat = true; save(); } else run();
  el.onclick = e => {
    if (e.target.closest("[data-rreplay]")){ run(); return; }
    if (e.target.closest("[data-rall]")){ gen++; th.innerHTML = chatHTML(les, st.reveal); A.chat = true; save(); return; }
    spkClick(e, A);
  };
  ctx.setCTA({ label:"Compare his choices ⚖️" });
}, { label: () => "Dad's message" });

/* ============================================================
   STAGE 4 · спільне: рахунок Grammar Challenge (6 + 2)
   ============================================================ */
function gScore(ctx){
  const G = stageOf(ctx.les, "grammar"), a = ctx.all.grammar || {};
  const gap = a.gap || {}, fix = a.fix || {};
  const g = G.gap.filter((q, i) => gap.chk && gap.chk[i] && gap.p && gap.p[i] === q.a).length;
  const f = G.fix.filter((q, i) => fix.ok && fix.ok[i]).length;
  return { n: g + f, total: G.gap.length + G.fix.length, g, f };
}
const scoreBanner = ctx => { const s = gScore(ctx); return `<div class="lp-score" aria-live="polite">${icon("scale")} Grammar Challenge: <b>${s.n} / ${s.total}</b></div>`; };
function guideInline(ctx){
  const G = stageOf(ctx.les, "grammar");
  return `${foldBtn("gg", `${icon("book")} Grammar Guide`)}${foldBox("gg", `<div class="lp-grs inline">${G.guide.map(r => `<div class="lp-gr"><b>${esc(r.k)}</b><span class="lp-gr-f">${r.f}</span><p>${esc(r.en)}</p><i>“${esc(r.ex)}”</i><small class="lp-gr-ua">🇺🇦 ${esc(r.ua)}</small></div>`).join("")}</div><div class="lp-order"><b>Word order</b>${G.order.map(o => `<span>${esc(o)}</span>`).join("")}</div>`, "lp-guidebox")}`;
}

/* lpGap — 6 речень з пропуском: вибір → Check answers → Retry incorrect */
define("lpGap", (el, scr, ctx) => {
  frame(el, ctx);
  const G = ctx.scr.stage, Q = G.gap, A = store(ctx, scr, "gap"); A.p = A.p || {}; A.chk = A.chk || {};
  const blank = (q, i) => { const p = A.p[i]; const st = A.chk[i] ? (p === q.a ? "ok" : "no") : p != null ? "filled" : "";
    return esc(q.q).replace("___", `<span class="lp-blank ${st}">${p != null ? esc(q.o[p]) : "?"}</span>`); };
  const draw = () => {
    const filled = Q.filter((q, i) => A.p[i] != null).length, checked = Q.filter((q, i) => A.chk[i]).length;
    const wrongN = Q.filter((q, i) => A.chk[i] && A.p[i] !== q.a).length;
    el.innerHTML = `${head(ctx, "Exercise A · Complete the Sentence", "Choose the right words for Dad's story. Then check your answers.", { kicker:"Stage 04 · Grammar revision", ua:"Обери правильні слова для історії тата. Потім перевір відповіді." })}
      <div class="row lp-gtop">${scoreBanner(ctx)}<span class="spacer"></span>${guideInline(ctx)}</div>
      <div class="lp-gaps">${Q.map((q, i) => { const isChk = !!A.chk[i], right = isChk && A.p[i] === q.a;
        return `<article class="card lp-gapc ${isChk ? (right ? "ok" : "no") : ""}" data-gi="${i}">
          <p class="lp-gs"><span class="lp-qn">${i + 1}</span><span>${blank(q, i)}</span></p>
          <div class="lp-gopts" role="group" aria-label="Options for sentence ${i + 1}">${q.o.map((o, k) => `<button class="lp-gopt ${A.p[i] === k ? "on" : ""} ${isChk && k === A.p[i] ? (right ? "good" : "bad") : ""}" type="button" data-gp="${i}:${k}" aria-pressed="${A.p[i] === k}" ${isChk ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>
          <div class="lp-tools">${!isChk ? foldBtn("gh" + i, "💡 Hint") : ""}${isChk ? foldBtn("gw" + i, right ? "Why?" : "Show explanation") : ""}${isChk && q.ua ? uaBtn("gu" + i, "") : ""}<span class="spacer"></span>${isChk ? `<span class="lp-mark ${right ? "good" : "bad"}">${right ? "✓ Correct" : "✗ Not yet"}</span>` : ""}</div>
          ${!isChk ? foldBox("gh" + i, `<p>${esc(q.hint)}</p>`, "lp-hint") : ""}
          ${isChk ? foldBox("gw" + i, `<p>${right ? "" : `Correct answer: <b>${esc(q.o[q.a])}</b>. `}${esc(q.why)}</p>`, "lp-why") : ""}
          ${isChk && q.ua ? uaBox("gu" + i, esc(q.ua)) : ""}
          ${keyBox(ctx, `<p>${esc(q.o[q.a])}</p>`, "Answer")}
        </article>`; }).join("")}</div>
      <div class="row lp-under">
        <button class="btn primary" type="button" data-gcheck ${filled ? "" : "disabled"}>${icon("check")} Check answers${filled < Q.length ? ` (${filled}/${Q.length})` : ""}</button>
        ${wrongN ? `<button class="btn" type="button" data-gretry>${icon("undo")} Retry incorrect (${wrongN})</button>` : ""}
        ${ctx.teacher ? `<button class="btn small ghost" type="button" data-gshow>🧑‍🏫 Fill in the answers</button>` : ""}
        ${checked === Q.length && !wrongN ? `<span class="pill good">${icon("star")} All 6 correct — great work!</span>` : ""}
      </div>`;
    ctx.setCTA({ label:"Exercise B: Fix the mistake →" });
  };
  el.onclick = e => {
    const b = e.target.closest("[data-gp]");
    if (b){ const [i, k] = b.dataset.gp.split(":").map(Number); if (A.chk[i]) return; A.p[i] = k; save(); draw(); const n = $(`[data-gi="${i}"]`, el); if (n){ const nb = $(`[data-gp="${i}:${k}"]`, n); if (nb) nb.focus({ preventScroll:true }); } return; }
    if (e.target.closest("[data-gcheck]")){ Q.forEach((q, i) => { if (A.p[i] != null) A.chk[i] = true; }); A.checks = (A.checks || 0) + 1; save(); draw(); const s = $(".lp-score", el); if (s) s.classList.add("lp-pop"); return; }
    if (e.target.closest("[data-gretry]")){ Q.forEach((q, i) => { if (A.chk[i] && A.p[i] !== q.a){ delete A.chk[i]; delete A.p[i]; } }); save(); draw(); const n = $(".lp-gapc:not(.ok)", el); if (n) scrollTo(n, "center"); return; }
    if (e.target.closest("[data-gshow]")){ Q.forEach((q, i) => { A.p[i] = q.a; A.chk[i] = true; }); A.revealed = true; save(); draw(); }
  };
  draw();
}, { label: () => "Exercise A" });

/* lpFix — 2 речення з помилкою: надрукуй або обери виправлення */
const norm = s => String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/[.!?,"“”]/g, "").replace(/\s+/g, " ").trim();
define("lpFix", (el, scr, ctx) => {
  frame(el, ctx);
  const G = ctx.scr.stage, Q = G.fix, A = store(ctx, scr, "fix"); A.ok = A.ok || {}; A.t = A.t || {}; A.typed = A.typed || {}; A.wrong = A.wrong || {}; A.msg = A.msg || {};
  const draw = () => {
    el.innerHTML = `${head(ctx, "Exercise B · Fix the Mistake", "Each sentence has one mistake. Type the correct sentence — or choose it.", { kicker:"Stage 04 · Grammar revision", ua:"У кожному реченні одна помилка. Надрукуй правильне речення — або обери його." })}
      <div class="row lp-gtop">${scoreBanner(ctx)}<span class="spacer"></span>${guideInline(ctx)}</div>
      ${Q.map((q, i) => { const ok = !!A.ok[i]; const bad = esc(q.bad).replace(esc(q.mark), `<mark class="lp-err">${esc(q.mark)}</mark>`);
        return `<article class="card lp-fixc ${ok ? "ok" : ""}" data-fi="${i}">
          <p class="lp-step-k">Sentence ${i + 1}</p>
          <p class="lp-badsent ${ok ? "struck" : ""}">✗ ${bad}</p>
          ${ok ? `<p class="lp-goodsent lp-in">✓ ${esc(q.good)} ${say(q.good)}</p><p class="lp-why">${esc(q.why)} ${q.ua ? uaBtn("fu" + i, "") : ""}</p>${q.ua ? uaBox("fu" + i, esc(q.ua)) : ""}`
          : `<div class="lp-typerow"><label class="sr-only" for="fx${i}">Type the correct sentence</label><input type="text" id="fx${i}" data-ft="${i}" value="${esc(A.typed[i] || "")}" placeholder="Type the correct sentence…" autocomplete="off" spellcheck="false"><button class="btn primary" type="button" data-fcheck="${i}">Check</button></div>
             <p class="lp-small">…or choose:</p>
             <div class="lp-fopts">${q.o.map((o, k) => `<button class="lp-opt ${(A.wrong[i] || []).includes(k) ? "bad" : ""}" type="button" data-fo="${i}:${k}" ${(A.wrong[i] || []).includes(k) ? "disabled" : ""}><b class="lp-letter">${LETTER(k)}</b><span>${esc(o)}</span></button>`).join("")}</div>
             <div aria-live="polite">${A.msg[i] ? `<div class="note amber">${esc(A.msg[i])}</div>` : ""}</div>
             <div class="lp-tools">${foldBtn("fh" + i, "💡 Hint")}</div>${foldBox("fh" + i, `<p>${esc(q.hint)}</p>`, "lp-hint")}
             ${keyBox(ctx, `<p>${esc(q.good)}</p>`, "Answer")}`}
        </article>`; }).join("")}`;
    ctx.setCTA({ label:"Your own sentences →" });
  };
  const solve = (i, how) => { A.ok[i] = how; delete A.msg[i]; save(); draw(); const s = $(".lp-score", el); if (s) s.classList.add("lp-pop"); };
  const typed = i => {
    const q = Q[i], v = norm(A.typed[i]);
    if (!v){ A.msg[i] = "Type the whole sentence first."; save(); draw(); return; }
    if (v === norm(q.good)) return solve(i, "typed");
    A.t[i] = (A.t[i] || 0) + 1;
    A.msg[i] = v.includes(norm(q.mark)) ? "Not yet — the highlighted part is still the same. " + q.hint : "Almost! Check every word. " + q.hint;
    save(); draw(); const inp = $(`#fx${i}`, el); if (inp) inp.focus();
  };
  el.oninput = e => { const t = e.target.dataset.ft; if (t != null){ A.typed[t] = e.target.value; save(); } };
  el.onkeydown = e => { const t = e.target.dataset && e.target.dataset.ft; if (t != null && e.key === "Enter"){ e.preventDefault(); typed(+t); } };
  el.onclick = e => {
    const c = e.target.closest("[data-fcheck]"); if (c){ typed(+c.dataset.fcheck); return; }
    const o = e.target.closest("[data-fo]");
    if (o){ const [i, k] = o.dataset.fo.split(":").map(Number); if (k === Q[i].a) solve(i, "chosen"); else { A.wrong[i] = (A.wrong[i] || []).concat(k); A.msg[i] = "Not this one. " + Q[i].hint; save(); draw(); } }
  };
  draw();
}, { label: () => "Exercise B" });

/* lpCreate — два власні речення (не оцінюються автоматично) */
define("lpCreate", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, C = st.create, A = store(ctx, scr, "create"); A.s = A.s || ["", ""]; A.tag = A.tag || {}; A.said = A.said || {};
  const draw = () => {
    el.innerHTML = `${head(ctx, "Your Turn: Dad's Choices", "Make two sentences about Dad's choices. Use at least two different structures. Say them — and write them if you like.", { kicker:"Stage 04 · Final grammar mission", ua:"Склади два речення про вибір тата. Використай щонайменше дві різні конструкції. Скажи їх уголос — і, за бажанням, напиши." })}
      <div class="row lp-gtop">${scoreBanner(ctx)}<span class="spacer"></span>${guideInline(ctx)}</div>
      <div class="card"><p class="lp-step-k">Sentence starters</p><div class="lp-starters">${C.starters.map(s => `<button class="lp-stbtn" type="button" data-st="${esc(s)}">${esc(s)}</button>`).join("")}</div><p class="lp-small muted">Tap a starter to put it in the next empty box.</p></div>
      <div class="lp-two">${[0, 1].map(i => `<div class="card lp-sent"><label class="lp-step-k" for="cs${i}">Sentence ${i + 1}</label><textarea id="cs${i}" data-cs="${i}" rows="3" placeholder="${esc(C.starters[i * 2])}">${esc(A.s[i] || "")}</textarea>
        <div class="row"><button class="lp-done ${A.said[i] ? "on" : ""}" type="button" data-said="${i}" aria-pressed="${!!A.said[i]}">${A.said[i] ? `${icon("check")} Said it` : `${icon("mic")} I said it`}</button><span class="spacer"></span>${A.s[i] ? say(A.s[i], "Listen to my sentence") : ""}</div></div>`).join("")}</div>
      <div class="card"><p class="lp-step-k">Which structures did you use? <span class="muted">(tick them yourself)</span></p><div class="lp-tags">${C.tags.map(t => `<button class="lp-tag ${A.tag[t] ? "on" : ""}" type="button" data-tag="${esc(t)}" aria-pressed="${!!A.tag[t]}">${A.tag[t] ? "✓ " : ""}${esc(t)}</button>`).join("")}</div>
        <p class="lp-small muted">Your teacher checks your sentences — the computer doesn't mark them.</p>
        ${ctx.teacher ? `<div class="lp-tools">${foldBtn("cx", "🧑‍🏫 Example sentences", "teach")}</div>${foldBox("cx", `<ul class="lp-fu plain">${C.ex.map(x => `<li>“${esc(x)}”</li>`).join("")}</ul>`, "lp-sample")}` : ""}</div>
      ${transition(st.transition)}`;
    ctx.setCTA({ label:"Marko needs your advice 💬" });
  };
  el.oninput = e => { const i = e.target.dataset.cs; if (i != null){ A.s[i] = e.target.value; save(); } };
  el.onchange = e => { if (e.target.dataset.cs != null) draw(); };
  el.onclick = e => {
    const s = e.target.closest("[data-st]");
    if (s){
      const i = [0, 1].find(k => !(A.s[k] || "").trim());
      if (i == null){ toast("Both boxes have text — edit them directly."); return; }
      A.s[i] = s.dataset.st.replace(/…$/, "") + " "; save(); draw();
      const t = $(`#cs${i}`, el); if (t){ t.focus(); t.setSelectionRange(t.value.length, t.value.length); }
      return;
    }
    const d = e.target.closest("[data-said]"); if (d){ const i = d.dataset.said; A.said[i] = !A.said[i]; save(); draw(); return; }
    const t = e.target.closest("[data-tag]"); if (t){ A.tag[t.dataset.tag] = !A.tag[t.dataset.tag]; save(); draw(); }
  };
  draw();
}, { label: () => "My sentences" });

/* ============================================================
   STAGE 5 · lpLab — повідомлення Марка + Decision Lab (два варіанти)
   ============================================================ */
function optCard(o, cls, extra){
  return `<article class="lp-optc o-${o.id} ${cls || ""}">
    <header><span class="lp-optk">OPTION ${o.k}</span><b>${esc(o.t)} <span aria-hidden="true">${o.e}</span></b></header>
    <p class="lp-optl">Advantages</p><ul class="lp-adv">${o.adv.map(a => `<li>${icon("check")}<span>${esc(a)}</span></li>`).join("")}</ul>
    <p class="lp-optl">Possible difficulty</p><p class="lp-diff">⚠️ ${esc(o.diff)}</p>${extra || ""}
  </article>`;
}
define("lpLab", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "lab");
  el.innerHTML = `${head(ctx, "The Decision Lab", "Read Marko's message. Then read both options aloud and compare them.", { kicker:"Stage 05 · The Big Decision", ua:"Прочитай повідомлення Марка. Потім прочитай обидва варіанти вголос і порівняй їх." })}
    <div class="lp-labgrid">
      <div>${phone(les, "marko", { id:"mth", status:"online", cls:"cool" })}</div>
      <div class="lp-opts2">${st.options.map(o => optCard(o)).join("")}</div>
    </div>
    <div class="card lp-cmp"><p class="lp-step-k">${icon("scale")} Compare</p><ul class="lp-fu plain"><li>Which advantages are the most important?</li><li>Which difficulty is the biggest?</li><li>Is writing as personal as talking?</li></ul></div>`;
  chatOnce($("#mth", el), les, st.marko, A, "chat");
  ctx.setCTA({ label:"Discuss the options 💬" });
}, { label: () => "Decision Lab" });

/* lpTalk — 6 питань по одному, підказки, таймер 60 с, чек-лист учителя */
define("lpTalk", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, A = store(ctx, scr, "talk"); A.i = Math.min(A.i || 0, st.qs.length - 1); A.chk = A.chk || {};
  const T = { left:60, run:false, id:null };
  onCleanup(() => clearInterval(T.id));
  const tick = () => { const n = $("#tm", el); if (!n) return; n.textContent = "0:" + pad2(T.left); const b = $("#tmb", el); if (b) b.style.width = (T.left / 60 * 100) + "%"; const c = $(".lp-timer", el); if (c){ c.classList.toggle("run", T.run); c.classList.toggle("end", T.left === 0); } const p = $("[data-tplay]", el); if (p) p.innerHTML = T.run ? `${icon("pause")} Pause` : `${icon("play")} ${T.left === 60 ? "Start 60 seconds" : T.left ? "Continue" : "Done!"}`; };
  const draw = () => {
    const q = st.qs[A.i], n = st.qs.length;
    el.innerHTML = `${head(ctx, "What Should Marko Do?", "Answer out loud. Give at least two reasons and use grammar from the lesson.", { kicker:"Stage 05 · Speaking", ua:"Відповідай уголос. Наведи щонайменше дві причини й використай граматику уроку." })}
      <div class="lp-talkgrid">
        <div class="card lp-talkc">
          <div class="lp-qtop"><span>Question ${A.i + 1} of ${n}</span><span class="lp-steps" aria-hidden="true">${st.qs.map((x, k) => `<i class="${k === A.i ? "on" : (A.done || {})["q" + k] ? "past" : ""}"></i>`).join("")}</span></div>
          ${spk(ctx, "q" + A.i, q, A)}
          <div class="row lp-nav"><button class="btn" type="button" data-prev ${A.i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${A.i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
        </div>
        <aside class="lp-talkside">
          <div class="card"><p class="lp-step-k">Sentence starters</p><ul class="lp-starterlist">${st.starters.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>
          <div class="card lp-timer"><p class="lp-step-k">${icon("clock")} 60-second challenge</p><div class="lp-tm" id="tm" aria-live="off">0:${pad2(T.left)}</div><div class="lp-tmbar"><i id="tmb" style="width:${T.left / 60 * 100}%"></i></div>
            <div class="row"><button class="btn small primary" type="button" data-tplay></button><button class="btn small" type="button" data-treset>${icon("undo")} Reset</button></div><p class="lp-small muted">Speak for one minute without stopping!</p></div>
          ${ctx.teacher ? `<div class="card lp-teachcard"><p class="lp-step-k">🧑‍🏫 Speaking checklist</p><ul class="lp-checks">${st.checklist.map((c, k) => `<li><label><input type="checkbox" data-tc="${k}" ${A.chk[k] ? "checked" : ""}> ${esc(c)}</label></li>`).join("")}</ul></div>` : ""}
        </aside>
      </div>`;
    tick();
    ctx.setCTA({ label:"Make the decision →" });
  };
  el.onclick = e => {
    if (spkClick(e, A)) return;
    if (e.target.closest("[data-next]")){ A.i = Math.min(st.qs.length - 1, A.i + 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); OPEN.clear(); save(); draw(); return; }
    if (e.target.closest("[data-tplay]")){
      if (T.run){ T.run = false; clearInterval(T.id); tick(); return; }
      if (T.left === 0) T.left = 60;
      T.run = true; tick(); clearInterval(T.id);
      T.id = setInterval(() => { T.left = Math.max(0, T.left - 1); if (!T.left){ T.run = false; clearInterval(T.id); toast("Time! 🎉 One minute of English."); } tick(); }, 1000);
      return;
    }
    if (e.target.closest("[data-treset]")){ clearInterval(T.id); T.run = false; T.left = 60; tick(); }
  };
  el.onchange = e => { const c = e.target.dataset.tc; if (c != null){ A.chk[c] = e.target.checked; save(); } };
  draw();
}, { label: () => "6 questions" });

/* lpChoose — вибір учня зберігається для кінцівки */
define("lpChoose", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, A = store(ctx, scr, "choose"), g = LP(ctx);
  let sel = A.sel || g.choice || null, stamp = false;
  const draw = () => {
    const saved = !!g.choice && g.choice === sel;
    el.innerHTML = `${head(ctx, "Make Your Decision", "Which option will you suggest to Marko? Choose one and save it.", { kicker:"Stage 05 · Decision", ua:"Який варіант ти порадиш Маркові? Обери один і збережи." })}
      <div class="lp-opts2 choose" role="radiogroup" aria-label="Your decision">${st.options.map(o => `<button class="lp-choosebtn ${sel === o.id ? "on" : ""}" type="button" role="radio" aria-checked="${sel === o.id}" data-ch="${o.id}">${optCard(o, sel === o.id ? "sel" : "", sel === o.id ? `<span class="lp-sel">${icon("check")} Selected</span>` : "")}</button>`).join("")}</div>
      <div class="lp-savezone" id="sz">${saved ? `<div class="lp-saved ${stamp ? "stamp" : ""}"><b>DECISION SAVED ✓</b><span>${esc(st.options.find(o => o.id === g.choice).t)}</span><small>Your choice will change the end of the story — but not yet! You can come back and change it.</small></div>`
        : `<button class="lp-bigbtn" type="button" data-save ${sel ? "" : "disabled"}>${icon("save")} ${g.choice ? "Save my new decision" : "Save my decision"}</button>${g.choice && sel !== g.choice ? `<p class="lp-small muted">Saved now: ${esc(st.options.find(o => o.id === g.choice).t)}</p>` : ""}`}</div>`;
    ctx.setCTA(saved ? { label:"Write your email to Marko ✉️" } : { label: sel ? "Save my decision" : "Choose an option first", action: () => { if (!sel){ toast("Choose Option A or Option B first."); return; } doSave(); } });
    stamp = false;
  };
  const doSave = () => { g.choice = sel; g.choiceAt = Date.now(); A.sel = sel; A.saves = (A.saves || 0) + 1; save(); stamp = anim(); draw(); scrollTo($("#sz", el), "center"); };
  el.onclick = e => {
    const c = e.target.closest("[data-ch]"); if (c){ sel = c.dataset.ch; A.sel = sel; save(); draw(); return; }
    if (e.target.closest("[data-save]")) doSave();
  };
  draw();
}, { label: () => "Decision" });

/* ============================================================
   STAGE 6 · lpEmail — редактор листа, лічильник слів, чек-лист, «надсилання»
   ============================================================ */
define("lpEmail", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "email");
  if (A.subject == null) A.subject = st.subject;
  A.text = A.text || ""; A.chk = A.chk || {};
  let fly = false;
  const fbOf = n => n === 0 ? { c:"", t:`Aim for ${st.wmin}–${st.wmax} words.` } : n < st.wmin ? { c:"low", t:"Your email needs a little more detail." } : n <= st.wmax ? { c:"ok", t:"Great! Your email is the right length." } : { c:"high", t:"Good work! Try making your message a little shorter." };
  const ready = () => wc(A.text) >= st.wmin || (st.task.concat(st.lang).every((x, i) => A.chk[i]) && wc(A.text) > 20) || (ctx.teacher && wc(A.text) > 0);
  const timeStr = t => t ? new Date(t).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : "";
  const meter = n => { const w = Math.min(100, Math.round(n / 120 * 100)); return `<span class="lp-meter" aria-hidden="true"><i class="zone"></i><b style="width:${w}%"></b></span>`; };
  const statusHTML = () => { const n = wc(A.text), f = fbOf(n); return `<span class="lp-wc ${f.c}"><b>${n}</b> words</span>${meter(n)}<span class="lp-wcfb ${f.c}">${esc(f.t)}</span>`; };
  const readyHTML = () => A.sent && A.sentText === A.text
    ? `<div class="lp-sent ${fly ? "lp-in" : ""}"><div class="lp-outbox">${icon("send")} <b>Sent to Marko · ${timeStr(A.sent)}</b></div><p class="lp-sentline">Your advice has reached Marko. Let's find out what happens next.</p>
        <div class="lp-msg who-marko"><span class="lp-ava-wrap">${face(les, "marko")}</span><div class="lp-bub"><b class="lp-name">Marko</b><span>Got it! Thank you so much. I'll talk to Dad right now. 🙏</span></div></div>
        <p class="lp-small muted">${icon("info")} This is part of the story: your email isn't sent anywhere. It stays in your lesson progress.</p></div>`
    : ready() ? `<div class="lp-ready lp-in"><b>EMAIL READY TO SEND 📩</b><button class="lp-bigbtn" type="button" data-send>${icon("send")} ${A.sent ? "SEND YOUR UPDATED ADVICE" : "SEND YOUR ADVICE"}</button></div>`
    : `<p class="lp-small muted">${icon("info")} When your email is ready (about ${st.wmin}–${st.wmax} words), the <b>Send</b> button appears here.</p>`;
  const draw = () => {
    const all = st.task.concat(st.lang);
    el.innerHTML = `${head(ctx, "The Email to Marko", "Write an informal email to Marko with your advice. 80–100 words.", { kicker:"Stage 06 · Writing", ua:"Напиши Маркові неформальний email зі своєю порадою. 80–100 слів." })}
      <div class="lp-mreq">${face(les, "marko")}<div class="lp-mreq-b">${st.marko.map(m => `<p>${esc(m.t)}</p>`).join("")}</div></div>
      <div class="lp-emailgrid">
        <section class="lp-mail" aria-label="Email editor">
          <div class="lp-mail-top"><span class="lp-mail-dots" aria-hidden="true"><i></i><i></i><i></i></span><b>New message</b><span class="spacer"></span>${A.savedAt ? `<small class="lp-savedat">Draft saved · ${timeStr(A.savedAt)}</small>` : ""}</div>
          <div class="lp-mail-row"><label for="m-to">To:</label><input id="m-to" type="text" value="${esc(st.to)}" readonly></div>
          <div class="lp-mail-row"><label for="m-sub">Subject:</label><input id="m-sub" type="text" data-msub value="${esc(A.subject)}"></div>
          <label class="sr-only" for="m-body">Message</label>
          <textarea id="m-body" data-mbody rows="12" placeholder="Hi Marko!&#10;&#10;…">${esc(A.text)}</textarea>
          <div class="lp-mail-status" id="mst" aria-live="polite">${statusHTML()}</div>
          <div class="lp-mail-btns">
            <button class="btn small" type="button" data-msave>${icon("save")} Save draft</button>
            <button class="btn small" type="button" data-mcopy>${icon("copy")} Copy email</button>
            <button class="btn small ghost" type="button" data-mclear>${icon("trash")} Clear draft</button>
          </div>
          <div id="mready">${readyHTML()}</div>
        </section>
        <aside class="lp-mailside">
          <div class="card lp-chkcard"><p class="lp-step-k">${icon("check")} Your checklist <span class="muted">(tick it yourself)</span></p>
            <p class="lp-small">Your email should…</p>
            <ul class="lp-checks">${st.task.map((t, i) => `<li><label><input type="checkbox" data-mc="${i}" ${A.chk[i] ? "checked" : ""}> ${esc(t)}</label></li>`).join("")}</ul>
            <p class="lp-small">Language</p>
            <ul class="lp-checks">${st.lang.map((t, j) => { const i = st.task.length + j; return `<li><label><input type="checkbox" data-mc="${i}" ${A.chk[i] ? "checked" : ""}> ${esc(t)}</label></li>`; }).join("")}</ul>
            <p class="lp-small muted" id="mchk">${all.filter((x, i) => A.chk[i]).length} / ${all.length} ticked</p>
          </div>
          <div class="card lp-helpcard">
            <p class="lp-step-k">Writing help</p>
            <div class="lp-tools col">${foldBtn("hA", "A · Email structure")}${foldBox("hA", st.structure.map(s => `<div class="lp-hs"><b>${esc(s.k)}</b><div>${s.items.map(x => `<button class="lp-phr" type="button" data-ins="${esc(x)}" title="Add to my email">${esc(x)}</button>`).join("")}</div></div>`).join("") + `<p class="lp-small muted">Tap a phrase to add it to your email.</p>`)}
              ${foldBtn("hB", "B · Grammar helper")}${foldBox("hB", `<ul class="lp-fu plain">${st.grammar.map(x => `<li>“${esc(x)}”</li>`).join("")}</ul>`)}
              ${foldBtn("hC", "C · Vocabulary helper")}${foldBox("hC", `<ul class="lp-lifelist sm">${(les.life || []).map(x => `<li><b>${esc(x.w)}</b><small>${esc(x.en)}</small><span class="lp-gr-ua">🇺🇦 ${esc(x.ua)}</span></li>`).join("")}</ul>`)}
              ${ctx.teacher ? foldBtn("hS", "🧑‍🏫 Sample email (teacher)", "teach") + foldBox("hS", `<pre class="lp-samplemail">${esc(st.sample)}</pre><p class="lp-small">${wc(st.sample)} words</p>`, "lp-sample") : ""}
            </div>
          </div>
        </aside>
      </div>`;
    ctx.setCTA({ label: A.sent ? "What happens next? 🌅" : "Continue to the ending" });
    fly = false;
  };
  const live = () => { const m = $("#mst", el); if (m) m.innerHTML = statusHTML(); const r = $("#mready", el); if (r){ const want = readyHTML(); if (r.dataset.state !== String(ready()) + (A.sent && A.sentText === A.text)){ r.innerHTML = want; r.dataset.state = String(ready()) + (A.sent && A.sentText === A.text); } } };
  el.oninput = e => {
    if (e.target.dataset.mbody != null){ A.text = e.target.value; save(); live(); return; }
    if (e.target.dataset.msub != null){ A.subject = e.target.value; save(); }
  };
  el.onchange = e => { const c = e.target.dataset.mc; if (c != null){ A.chk[c] = e.target.checked; save(); const m = $("#mchk", el); if (m) m.textContent = `${st.task.concat(st.lang).filter((x, i) => A.chk[i]).length} / ${st.task.length + st.lang.length} ticked`; live(); } };
  el.onclick = async e => {
    const ins = e.target.closest("[data-ins]");
    if (ins){ const ta = $("#m-body", el); const p = ins.dataset.ins; const pos = ta.selectionStart != null && document.activeElement === ta ? ta.selectionStart : ta.value.length; const before = ta.value.slice(0, pos), after = ta.value.slice(pos); const sep = before && !/\s$/.test(before) ? " " : ""; ta.value = before + sep + p + " " + after; A.text = ta.value; save(); live(); ta.focus(); const np = (before + sep + p + " ").length; ta.setSelectionRange(np, np); return; }
    if (e.target.closest("[data-msave]")){ A.savedAt = Date.now(); save(); toast("Draft saved"); draw(); return; }
    if (e.target.closest("[data-mcopy]")){
      const out = `To: ${st.to}\nSubject: ${A.subject}\n\n${A.text}`;
      try { await navigator.clipboard.writeText(out); toast("Email copied"); }
      catch(err){ const ta = $("#m-body", el); ta.focus(); ta.select(); toast("Copying is blocked here — the text is selected, press Ctrl+C."); }
      return;
    }
    const cl = e.target.closest("[data-mclear]");
    if (cl){
      if (!cl.dataset.confirm){ cl.dataset.confirm = "1"; cl.classList.add("hot"); cl.innerHTML = `${icon("trash")} Tap again to delete the draft`; setTimeout(() => { if (cl.isConnected){ delete cl.dataset.confirm; cl.classList.remove("hot"); cl.innerHTML = `${icon("trash")} Clear draft`; } }, 3500); return; }
      A.text = ""; A.subject = st.subject; delete A.savedAt; delete A.sent; delete A.sentText; save(); toast("Draft cleared"); draw(); return;
    }
    if (e.target.closest("[data-send]")){
      const zone = $("#mready", el);
      if (anim() && zone){ const env = document.createElement("div"); env.className = "lp-flyenv"; env.innerHTML = icon("mail"); zone.appendChild(env); }
      later(() => { A.sent = Date.now(); A.sentText = A.text; save(); fly = true; draw(); scrollTo($("#mready", el), "center"); }, anim() ? 900 : 0);
    }
  };
  draw();
}, { label: () => "Email editor" });

/* ============================================================
   STAGE 7 · lpEnding — кінцівка за вибором учня
   ============================================================ */
define("lpEnding", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "ending"), g = LP(ctx);
  const dec = stageOf(les, "decision");
  const play = id => !A["seen_" + id] && anim();
  let shown = null;
  const draw = () => {
    const choice = A.preview && ctx.teacher ? A.preview : g.choice;
    if (!choice){
      el.innerHTML = `${head(ctx, "The Truth Comes Out", "", { kicker:"Stage 07 · Ending" })}
        <div class="card lp-nochoice">${icon("info")}<div><b>No decision yet.</b><p>The ending depends on your choice in Stage 5. Go back and decide: talk today or write first?</p>
          <div class="row"><button class="btn primary" type="button" data-back>${icon("arrow")} Go to Stage 5 and decide</button>${ctx.teacher ? `<button class="btn small ghost" type="button" data-prev="talk">🧑‍🏫 Preview A</button><button class="btn small ghost" type="button" data-prev="write">🧑‍🏫 Preview B</button>` : ""}</div></div></div>`;
      ctx.setCTA({ label:"Go to Stage 5", action: () => jumpTo(ctx, "lpChoose") });
      return;
    }
    const E = choice === "talk" ? st.endA : st.endB, opt = dec.options.find(o => o.id === choice);
    const first = play(choice); shown = choice;
    el.innerHTML = `${bar(ctx)}<div class="lp-ending e-${choice} ${first ? "cine" : ""}">
        <p class="lp-osd">${esc(E.k)}</p>
        <h2 class="stitle lp-title" id="stitle" tabindex="-1">The Truth Comes Out</h2>
        <p class="lp-yourchoice">Your choice: <b>${esc(opt.t)} ${opt.e}</b>${A.preview && ctx.teacher && A.preview !== g.choice ? ` <span class="pill">teacher preview</span>` : ""}</p>
        <figure class="lp-endscene">${pic(media(les, choice === "talk" ? "living" : "letter"), choice === "talk" ? "A warm living room in the evening" : "A kitchen table at night with a letter", choice === "talk" ? ART.living() : ART.kitchen(), "lp-endpic")}<figcaption>${esc(E.place)}</figcaption></figure>
        ${choice === "talk"
          ? `<div class="lp-script" id="scr"></div>`
          : `<article class="lp-dadletter ${first ? "write" : ""}">${E.letter.map((l, i) => `<p style="--i:${i}">${esc(l)}</p>`).join("")}<p class="lp-sign" style="--i:${E.letter.length}">${esc(E.sign)}</p>${say(E.letter.join(" "), "Listen to Dad's letter")}</article>
             ${phone(les, "mum", { id:"scr", title:"Mum", status:"Monday morning", cls:"warm" })}`}
        <p class="lp-outro" id="out" ${first ? "hidden" : ""}>${esc(E.outro)}</p>
        <div class="row lp-endbtns"><button class="btn small" type="button" data-back>${icon("undo")} Change my decision</button>${ctx.teacher ? `<button class="btn small ghost" type="button" data-prev="${choice === "talk" ? "write" : "talk"}">🧑‍🏫 Preview the other ending</button>${A.preview ? `<button class="btn small link" type="button" data-prev="">Back to the student's ending</button>` : ""}` : ""}</div>
      </div>`;
    const box = $("#scr", el), lines = choice === "talk" ? E.lines : E.after;
    const done = () => { A["seen_" + choice] = true; save(); const o = $("#out", el); if (o){ o.hidden = false; o.classList.add("lp-in"); } };
    if (first){ if (choice === "talk") playScript(box, les, lines, done); else later(() => playChat(box, les, lines, { delay:200, done }), 2200); }
    else { if (choice === "talk") box.innerHTML = scriptHTML(les, lines); else box.innerHTML = chatHTML(les, lines); done(); }
    ctx.setCTA({ label:"Dad's last message 🌅" });
  };
  el.onclick = e => {
    if (e.target.closest("[data-back]")){ jumpTo(ctx, "lpChoose"); return; }
    const p = e.target.closest("[data-prev]"); if (p && ctx.teacher){ A.preview = p.dataset.prev || null; save(); draw(); }
  };
  draw();
  void shown;
}, { label: () => "The ending" });
function scriptHTML(les, lines){ return lines.map(l => scriptLine(les, l)).join(""); }
function scriptLine(les, l){ const c = les.characters[l.who] || { name:l.who }; return `<div class="lp-line who-${esc(l.who)}">${face(les, l.who)}<p><b>${esc(c.name)}:</b> ${esc(l.t)}</p>${say(l.t)}</div>`; }
function playScript(box, les, lines, done){
  let k = 0, alive = true; onCleanup(() => { alive = false; });
  const step = () => { if (!alive || !box.isConnected) return; if (k >= lines.length){ if (done) done(); return; } box.insertAdjacentHTML("beforeend", scriptLine(les, lines[k++])); const last = box.lastElementChild; if (last) last.classList.add("lp-in"); later(step, 1100); };
  later(step, 900);
}

/* lpSunrise — фінальне повідомлення тата на світанку + рефлексія (1–2 питання) */
define("lpSunrise", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, st = ctx.scr.stage, A = store(ctx, scr, "sunrise"); A.pick = A.pick || {};
  const finalMsgs = [{ sys:"Monday · 06:58" }].concat(st.final.map(t => ({ who:"dad", t })));
  const draw = () => {
    const n = Object.values(A.pick).filter(Boolean).length;
    el.innerHTML = `${bar(ctx)}<div class="lp-sunrise">
        <p class="lp-osd">${icon("sun")} THE NEXT MORNING</p>
        <h2 class="stitle lp-title" id="stitle" tabindex="-1">A Message at Sunrise</h2>
        <div class="lp-sungrid">
          <div>${phone(les, "dad", { id:"sth", status:"online", cls:"dawn" })}</div>
          <div><div class="card"><p class="lp-step-k">${icon("mic")} Reflection · choose one or two questions <span class="lp-count">${n} chosen</span></p>
            ${st.reflect.map((q, i) => `<div class="lp-refl ${A.pick[i] ? "on" : ""}"><button class="lp-reflpick" type="button" data-rp="${i}" aria-pressed="${!!A.pick[i]}">${A.pick[i] ? icon("check") : `<span class="lp-qn">${i + 1}</span>`}<span>${esc(q.q)}</span></button>${A.pick[i] ? spk(ctx, "r" + i, q, A, { small:true }) : ""}</div>`).join("")}
          </div></div>
        </div>
      </div>`;
    chatOnce($("#sth", el), les, finalMsgs, A, "chat", { delay:600 });
    ctx.setCTA({ label:"Unit 3 complete 🎉" });
  };
  el.onclick = e => {
    if (spkClick(e, A)) return;
    const p = e.target.closest("[data-rp]");
    if (p){ const i = p.dataset.rp; if (!A.pick[i] && Object.values(A.pick).filter(Boolean).length >= 2){ toast("Choose one or two questions — tap a chosen one to swap it."); return; } A.pick[i] = !A.pick[i]; A.chat = true; save(); draw(); }
  };
  draw();
}, { label: () => "Sunrise" });

/* lpUnit — UNIT 3 COMPLETED: досягнення + can-do */
define("lpUnit", (el, scr, ctx) => {
  frame(el, ctx);
  const st = ctx.scr.stage, A = store(ctx, scr, "unit"); A.can = A.can || {};
  const first = !A.seen; A.seen = true; save();
  const draw = () => {
    const n = st.cando.filter((c, i) => A.can[i]).length;
    el.innerHTML = `${bar(ctx)}<div class="lp-unit">
        <p class="lp-osd">UNIT 3 · MY WAY OF LIFE</p>
        <h2 class="stitle lp-unit-t" id="stitle" tabindex="-1">UNIT 3 COMPLETED! 🎉</h2>
        <p class="lp-unit-s">MY WAY OF LIFE</p>
        <div class="lp-ach" id="ach">${st.achievements.map((a, i) => `<div class="lp-medal ${first ? "spin" : ""}" style="--i:${i}"><span class="lp-medal-i" aria-hidden="true">${a.e}</span><b>${esc(a.t)}</b><small>${esc(a.s)}</small></div>`).join("")}</div>
        <p class="lp-small muted">These are completion markers for this unit — not grades or certificates.</p>
        <div class="card lp-cando"><p class="lp-step-k">${icon("check")} Can-do checklist · tick what you feel confident about <span class="lp-count">${n} / ${st.cando.length}</span></p>
          <ul class="lp-cdl">${st.cando.map((c, i) => `<li><button class="lp-cdb ${A.can[i] ? "on" : ""}" type="button" data-cd="${i}" aria-pressed="${!!A.can[i]}"><span class="lp-cdbox">${A.can[i] ? icon("check") : ""}</span><span>${esc(c)}</span></button></li>`).join("")}</ul>
        </div>
      </div>`;
    ctx.setCTA({ label:"One more thing… →" });
  };
  el.onclick = e => { const b = e.target.closest("[data-cd]"); if (b){ A.can[b.dataset.cd] = !A.can[b.dataset.cd]; save(); draw(); } };
  draw();
  if (first) later(() => confetti($("#ach", el)), 500);
}, { label: () => "Unit 3 complete" });

/* lpTeaser — наступний ранок: Champions Week (анонс Unit 4) */
define("lpTeaser", (el, scr, ctx) => {
  frame(el, ctx);
  const les = ctx.les, T = ctx.scr.stage.teaser, A = store(ctx, scr, "teaser");
  const first = !A.seen && anim();
  el.innerHTML = `${bar(ctx)}<div class="lp-teaser ${first ? "cine" : ""}">
      <figure class="lp-morning">${pic(media(les, "morning"), "Early morning sunlight in Marko's room", ART.morning(), "lp-mpic")}</figure>
      <h2 class="sr-only" id="stitle" tabindex="-1">Next morning: a school announcement</h2>
      <div class="lp-notif ${first ? "buzzin" : ""}" id="nt" ${first ? "hidden" : ""}>
        <div class="lp-notif-h"><span class="lp-notif-i" aria-hidden="true">🏆</span><div><b>${esc(T.from)}</b><small>${esc(T.time)}</small></div></div>
        <p class="lp-notif-s">${esc(T.subject)}</p>
        <div class="lp-notif-b">${T.body.map(l => `<p>${esc(l)}</p>`).join("")}</div>
        ${say(T.body.join(" "), "Listen to the announcement")}
      </div>
      <div class="lp-smile" id="sm" ${first ? "hidden" : ""}>${face(les, "marko", "lg")}<p>Marko smiles.</p></div>
      <p class="lp-tcap" id="tc" ${first ? "hidden" : ""}>${esc(T.caption)}</p>
      <p class="lp-tbc" id="tb" ${first ? "hidden" : ""}>TO BE CONTINUED…</p>
      <div class="lp-next" id="nx" ${first ? "hidden" : ""}><span class="lp-next-i">${icon("trophy")}</span><div><small>${esc(T.next.k)}</small><b>${esc(T.next.t)}</b><p>${esc(T.next.s)}</p></div></div>
      ${ctx.teacher && first ? `<button class="btn small link" type="button" data-tall>Show everything</button>` : ""}
    </div>`;
  const show = id => { const n = $("#" + id, el); if (n){ n.hidden = false; n.classList.add("lp-in"); } };
  const ids = ["nt", "sm", "tc", "tb", "nx"];
  if (first){ ids.forEach((id, i) => later(() => { show(id); if (id === "nt"){ const n = $("#nt", el); n.classList.add("lp-buzz"); } if (i === ids.length - 1){ A.seen = true; save(); } scrollTo($("#" + id, el), "nearest"); }, 900 + i * 1300)); }
  else { A.seen = true; save(); }
  el.onclick = e => { if (e.target.closest("[data-tall]")){ ids.forEach(show); A.seen = true; save(); e.target.remove(); } };
  ctx.setCTA({ label:"Finish lesson ✅" });
}, { label: () => "Champions Week" });

})();
