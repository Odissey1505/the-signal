/* ============================================================
   THE SIGNAL — бібліотека екранів «The Secret in the Jacket» (Unit 2 · Lesson 6 · Revision)
   ------------------------------------------------------------
   Кінематографічна детективна гра: папірець із кишені, 4 фото, таймлайн, щоденник,
   інтерв'ю зі свідком, дошка доказів і скринька з кодовим замком, лист Anna, сертифікат.
   Типи: sjRecap · sjQuestions · sjPaper · sjMatch · sjMcqSet · sjPairs · sjSpeak ·
         sjTimeline · sjDiary · sjDiaryQs · sjBuild · sjInterview · sjBoard ·
         sjFashionCode · sjGrammarCode · sjEvidenceCode · sjLock · sjReveal ·
         sjEnding · sjMission · sjCertificate
   Тема — css/secret.css (body[data-episode-theme="secret"]).
   Спільні помічники (питання з вибором, перевірка речень, чат, фото 1998) — з js/screens/memory.js
   (window.SignalTM), тому цей файл підключається ПІСЛЯ memory.js.
   Стан розслідування (докази, цифри коду) — у ans._case епізоду.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer, TM = window.SignalTM;
if (!S || !P || !TM) return;
const { $, $$, esc, reduced, onCleanup, save, toast } = S;
const define = P.define;
const { later, store, say, fmt, scrollTo, shuffle, Toggles, UAQ, mcq, mcqClick, mcqDone, textRow, textClick, textDone, msgHTML, threadHTML, playThread, ava, photo, jacketArt, icon } = TM;

/* ---------- дрібні помічники ---------- */
const GOOD = ["Great detective work! 🔎", "You've found another clue!", "Exactly! That's what happened.", "Evidence confirmed!"];
const BAD = ["Not quite. Check the evidence again.", "Good try! Look at the verb form.", "Try again, detective!"];
const good = i => GOOD[(i || 0) % GOOD.length];
const bad = i => BAD[(i || 0) % BAD.length];
const ORD = ["FIRST", "SECOND", "THIRD"];
const cap = s => String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1);
const art = () => window.SignalArt || null;
const ENVELOPE = `<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6.5L20.5 7"/>`;
const ic = k => k === "envelope" ? `<svg class="tm-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ENVELOPE}</svg>` : icon(k);
/* friendly feedback: додаємо до пояснення дружню фразу */
const withGood = (q, i) => Object.assign({}, q, { why: good(i) + " " + (q.why || ""), hint: q.hint || bad(i) });
const enterKey = el => { el.onkeydown = e => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.tin){ e.preventDefault(); const b = $(`[data-tcheck="${e.target.dataset.tin}"]`, el); if (b) b.click(); } }; };

/* ---------- стан розслідування: докази й цифри коду ---------- */
const CASE = ctx => { const c = ctx.all._case = ctx.all._case || {}; c.ev = c.ev || {}; c.digits = c.digits || {}; return c; };
function unlockEvidence(ctx, n){ const c = CASE(ctx); if (c.ev[n]) return false; c.ev[n] = Date.now(); save(); toast(`🗂 Evidence #${n} unlocked: ${ctx.les.evidence[n].t}`); return true; }
function evCard(les, n, o){
  o = o || {}; const e = les.evidence[n];
  return `<div class="sj-ev ${o.fresh ? "fresh ix-reveal" : ""} ${o.off ? "off" : ""}">
    <span class="sj-ev-k">${o.off ? "🔒" : e.icon} Evidence #${n}</span>
    <b>${o.off ? "Not found yet" : esc(e.t)}</b>
    ${o.off ? "" : `<p>${esc(e.s)}</p>${o.mini ? "" : `<small>${esc(e.from)}</small>`}`}
  </div>`;
}
const evUnlocked = (les, n, fresh) => `<div class="sj-unlock ${fresh ? "ix-reveal" : ""}" role="status">
    <span class="sj-unlock-k">EVIDENCE #${n} UNLOCKED</span><b>${esc(les.evidence[n].t.toUpperCase())}</b>
    <p>${esc(les.evidence[n].s)}</p><small>Added to your 🗂 Evidence inventory.</small></div>`;

/* прогрес розслідування (за пройденими екранами епізоду) */
function progress(ctx){
  const ls = S.L(ctx.les.id); const total = (window.SIGNAL_SCREEN_COUNT && window.SIGNAL_SCREEN_COUNT(ctx.les.id)) || 1;
  const done = Object.keys(ls.done || {}).length;
  return Math.max(0, Math.min(100, Math.round(done / total * 100)));
}

/* ---------- верхня смуга: етап, прогрес, інвентар доказів, дієслова, скидання ---------- */
let RESET = null;
function caseBar(ctx, opt){
  opt = opt || {};
  const les = ctx.les, st = ctx.scr.stage, c = CASE(ctx); const found = Object.keys(c.ev).length;
  const pct = progress(ctx);
  const sKey = ctx.scr.data.store;
  RESET = sKey ? () => { delete ctx.ans[sKey]; if (opt.onReset) opt.onReset(); save(); toast("Activity reset"); window.SignalApp.render(); } : null;
  return `<div class="sj-bar">
      <span class="sj-bar-t"><b>Lesson 6</b> · Stage ${st.n} of ${les.stages.length}</span>
      <span class="sj-prog" title="Investigation progress: ${pct}%"><span class="sj-prog-k">Investigation progress</span><span class="sj-prog-track" aria-hidden="true"><i style="width:${pct}%"></i></span><b>${pct}%</b></span>
      <span class="spacer"></span>
      <button class="sj-chipbtn" type="button" data-sjinv aria-expanded="false" aria-controls="sj-inv">🗂 Evidence <b>${found}/4</b></button>
      <button class="sj-chipbtn" type="button" data-verbs aria-expanded="false" aria-controls="tm-vp">📖 Verb list</button>
      ${ctx.teacher && RESET ? `<button class="sj-chipbtn warn" type="button" data-sjreset title="Clear the answers on this screen">↺ Reset activity</button>` : ""}
    </div>
    <div class="sj-inv" id="sj-inv" hidden><div class="sj-inv-head"><b>🗂 Evidence inventory</b><span class="muted">${found} of 4 found</span></div>
      <div class="sj-inv-grid">${[1, 2, 3, 4].map(n => evCard(les, n, { off: !c.ev[n], mini:false })).join("")}</div></div>
    <div class="tm-verbpanel sj-verbpanel" id="tm-vp" hidden><table class="tm-vtable"><caption>Irregular verbs</caption><thead><tr><th scope="col">Base form</th><th scope="col">Past Simple</th><th scope="col">Ukrainian</th></tr></thead>
      <tbody>${(les.irregular || []).map(r => `<tr><td>${esc(r[0])}</td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>`;
}
const head = (ctx, intro, title, opt) => `${caseBar(ctx, opt)}<h2 class="stitle sj-title" id="stitle" tabindex="-1">${esc(title || ctx.scr.stage.title)}</h2>${intro ? `<p class="sj-intro">${esc(intro)}</p>` : ""}`;

if (typeof document !== "undefined") document.addEventListener("click", e => {
  if (!e.target.closest) return;
  const inv = e.target.closest("[data-sjinv]");
  if (inv){ const p = document.getElementById("sj-inv"); if (!p) return; p.hidden = !p.hidden; inv.setAttribute("aria-expanded", String(!p.hidden)); inv.classList.toggle("on", !p.hidden); return; }
  const r = e.target.closest("[data-sjreset]");
  if (r && RESET){
    if (!r.dataset.confirm){ r.dataset.confirm = "1"; r.textContent = "Tap again to reset"; r.classList.add("hot"); return; }
    RESET();
  }
});

/* ---------- картинки: образи 1998, куртка, фото всіх чотирьох, Emma ---------- */
const hasLook = (les, id) => !!(((les.media || {}).looks || {})[id]);
const lookCls = (les, id) => hasLook(les, id) ? "is-photo" : "";
function lookArt(les, id, label){
  const m = (les.media && les.media.looks) || {};
  if (m[id]) return `<img class="ss-art ss-img" src="${esc(m[id])}" alt="${esc(label || "")}" decoding="async">`;
  const a = art(); if (a && les.look && les.look[id]) return a.outfit(les.look[id], { label: label || "An outfit" });
  return `<div class="tm-nopic" role="img" aria-label="${esc(label || "")}">${esc(label || "")}</div>`;
}
function jacketPic(les){
  const m = les.media || {};
  return m.jacket ? `<img src="${esc(m.jacket)}" alt="${esc(m.jacketAlt || "Dad's old denim jacket")}" decoding="async">` : jacketArt("Dad's old denim jacket with a red patch");
}
let FID = 0;
function fourSVG(label){
  const i = "sjf" + (++FID);
  const head = (x, y, skin, hair, o) => { o = o || {};
    return `${o.long ? `<path d="M${x - 19},${y - 6} Q${x - 22},${y + 34} ${x - 14},${y + 46} L${x + 14},${y + 46} Q${x + 22},${y + 34} ${x + 19},${y - 6} Z" fill="${hair}"/>` : ""}
      <ellipse cx="${x}" cy="${y}" rx="17" ry="20" fill="${skin}"/>
      ${o.long || o.pony ? `<path d="M${x - 18},${y - 4} Q${x - 16},${y - 26} ${x},${y - 25} Q${x + 16},${y - 26} ${x + 18},${y - 4} Q${x + 6},${y - 16} ${x - 18},${y - 4}Z" fill="${hair}"/>` : ""}
      ${o.pony ? `<path d="M${x + 14},${y - 14} Q${x + 30},${y - 8} ${x + 24},${y + 18}" fill="none" stroke="${hair}" stroke-width="7" stroke-linecap="round"/>` : ""}
      ${o.short ? `<path d="M${x - 17},${y - 6} Q${x - 16},${y - 24} ${x},${y - 24} Q${x + 16},${y - 24} ${x + 17},${y - 6} Q${x},${y - 14} ${x - 17},${y - 6}Z" fill="${hair}"/>` : ""}
      <path d="M${x - 8},${y + 7} q8,7 16,0" fill="#F7E6DA" stroke="#4A2418" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M${x - 9},${y - 3} q3,-3 6,0 M${x + 3},${y - 3} q3,-3 6,0" fill="none" stroke="#2A160C" stroke-width="1.8" stroke-linecap="round"/>`; };
  return `<svg class="sj-four-svg" viewBox="0 0 300 300" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${i}bg" cx=".5" cy=".3" r=".85"><stop offset="0" stop-color="#6E3B66"/><stop offset=".55" stop-color="#2E1E3E"/><stop offset="1" stop-color="#0E0C1C"/></radialGradient>
      <radialGradient id="${i}fl" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="#FFF7E8" stop-opacity=".42"/><stop offset="1" stop-color="#FFF7E8" stop-opacity="0"/></radialGradient>
      <radialGradient id="${i}vg" cx=".5" cy=".5" r=".72"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <pattern id="${i}fw" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#7048E8"/><circle cx="4" cy="4" r="2.2" fill="#FFF3C4"/><circle cx="11" cy="10" r="1.8" fill="#FF8FB1"/></pattern>
      <pattern id="${i}dn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0,1 H6 M0,4 H6" stroke="#fff" stroke-opacity=".12"/></pattern>
      <filter id="${i}gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .44  0 0 0 0 .38  0 0 0 .24 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${i}bl"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>
    <rect width="300" height="300" fill="url(#${i}bg)"/>
    <g filter="url(#${i}bl)" opacity=".8">${[[24, 30, "#FFD08A"], [80, 18, "#9EE6E2"], [150, 26, "#FFD08A"], [220, 16, "#FFB3C0"], [276, 34, "#FFD08A"]].map(b => `<circle cx="${b[0]}" cy="${b[1]}" r="7" fill="${b[2]}"/>`).join("")}</g>
    <!-- Emma -->
    <path d="M18,300 L26,190 Q34,166 60,164 Q86,166 94,190 L104,300 Z" fill="url(#${i}fw)"/>
    ${head(60, 138, "#E8BA9C", "#2A1B14", { long:true })}
    <!-- Alex -->
    <path d="M206,300 L212,192 Q220,166 248,162 Q276,166 284,192 L292,300 Z" fill="#1E1E22"/><path d="M234,166 L248,300 L262,166 Z" fill="#B3262E"/>
    ${head(248, 132, "#6B4430", "#141A28", { short:true })}<path d="M228,124 Q229,104 248,102 Q267,104 268,124 Z" fill="#141A28"/><path d="M264,122 Q280,120 286,126 Q272,130 262,127 Z" fill="#141A28"/>
    <!-- Anna (camera in hand) -->
    <path d="M156,300 L162,196 Q170,172 196,170 Q222,172 230,196 L236,300 Z" fill="#E03131"/><path d="M178,170 Q196,184 214,170 Q206,160 196,160 Q186,160 178,170Z" fill="#B42424"/>
    ${head(196, 146, "#D9A07E", "#5A3420", { pony:true })}
    <g transform="translate(208,214) rotate(-8)"><rect x="0" y="0" width="34" height="22" rx="4" fill="#222"/><circle cx="17" cy="11" r="7" fill="#444" stroke="#999" stroke-width="2"/><rect x="24" y="-4" width="7" height="5" rx="1" fill="#333"/></g>
    <!-- Dan (centre-left, bucket hat, denim + red patch) -->
    <path d="M84,300 L90,188 Q98,160 128,156 Q158,160 166,188 L172,300 Z" fill="#5C82B8"/><path d="M84,300 L90,188 Q98,160 128,156 Q158,160 166,188 L172,300 Z" fill="url(#${i}dn)"/>
    <path d="M118,160 L138,160 L136,300 L120,300 Z" fill="#F2EFE6"/>
    <g transform="rotate(-8 152 214)"><rect x="143" y="205" width="17" height="17" rx="2.5" fill="#C0392B"/><path d="M147,219 l4.5,-10 l4.5,10 z" fill="#FFF3C4"/></g>
    ${head(128, 128, "#7A4B32", "#1E1612", {})}
    <path d="M106,114 L111,96 Q128,90 145,96 L150,114 Z" fill="#E9E2CF"/><path d="M94,114 Q128,104 162,114 Q164,122 128,123 Q92,122 94,114 Z" fill="#DCD2B9"/>
    <rect width="300" height="300" fill="url(#${i}fl)"/>
    <rect width="300" height="300" fill="#F2C987" opacity=".1" style="mix-blend-mode:multiply"/>
    <rect width="300" height="300" fill="#fff" filter="url(#${i}gr)"/>
    <rect width="300" height="300" fill="url(#${i}vg)"/>
    <text x="198" y="286" font-family="'Courier New',monospace" font-weight="700" font-size="15" fill="#FF8A2A" opacity=".92" letter-spacing="1">'98 11 21</text>
  </svg>`;
}
function fourPhoto(les){
  const m = les.media || {};
  return m.four ? `<img src="${esc(m.four)}" alt="${esc(m.fourAlt || "")}" decoding="async">` : fourSVG(m.fourAlt || "An old photo of four friends from 1998");
}

/* ---------- скринька з кодовим замком (CSS + HTML) ---------- */
function boxHTML(digits, o){
  o = o || {}; const m = o.media || {};
  const wheel = k => { const d = digits[k]; return `<span class="sj-wheel ${d != null ? "on" : ""} ${o.cur === k ? "cur" : ""}"><i aria-hidden="true">${d != null ? d : "?"}</i></span>`; };
  const label = o.open ? "The metal box is open." : `A small metal box with a three-digit lock. Found digits: ${[0, 1, 2].map(k => digits[k] != null ? digits[k] : "unknown").join(", ")}.`;
  return `<div class="sj-box ${o.open ? "open" : ""} ${o.big ? "big" : ""} ${m.box ? "img" : ""}" role="img" aria-label="${esc(label)}">
    ${m.box ? `<img class="sj-box-img" src="${esc(m.box)}" alt="" decoding="async">` : `<span class="sj-box-lid" aria-hidden="true"></span><span class="sj-box-body" aria-hidden="true"><span class="sj-box-band"></span></span>`}
    <span class="sj-lock" aria-hidden="true"><span class="sj-shackle"></span><span class="sj-lock-body">${[0, 1, 2].map(wheel).join("")}</span></span>
  </div>`;
}
const digitsOf = ctx => { const c = CASE(ctx); return [c.digits[1], c.digits[2], c.digits[3]]; };
function lockStrip(ctx, cur){
  const d = digitsOf(ctx);
  return `<div class="sj-strip" aria-label="Code so far: ${d.map(x => x == null ? "?" : x).join(" ")}">${boxHTML(d, { cur })}<div class="sj-strip-t"><b>The box code</b><span>${d.map((x, k) => `<i class="${x != null ? "on" : ""} ${k === cur ? "cur" : ""}">${x != null ? x : "?"}</i>`).join("")}</span></div></div>`;
}
const digitReveal = (k, digit, fresh) => `<div class="sj-digit ${fresh ? "ix-reveal" : ""}" role="status"><span>${ORD[k]} DIGIT</span><b>${digit}</b></div>`;

/* ---------- кнопки «Sample answer» (лише Teacher view), переклад — для всіх ---------- */
function qTools(T, id, q, ctx, o){
  o = o || {};
  return `<div class="row tm-tools">${q.ua ? T.btn(id + "-ua", UAQ, "ua") : ""}${q.fu && q.fu.length ? T.btn(id + "-fu", "➕ Follow-up questions") : ""}${ctx.teacher && q.ex ? T.btn(id + "-ex", "🧑‍🏫 Sample answer", "teach") : ""}</div>
    ${q.ua ? T.box(id + "-ua", `<p>${esc(q.ua)}</p>`, "tm-uabox") : ""}
    ${q.fu && q.fu.length ? T.box(id + "-fu", `<ul class="tm-fu">${q.fu.map(f => `<li>${esc(f)} ${say(f)}</li>`).join("")}</ul>`, "tm-fubox") : ""}
    ${ctx.teacher && q.ex ? T.box(id + "-ex", `<p>“${esc(q.ex)}” ${say(q.ex, "Listen to the sample")}</p>`, "help sj-sample") : ""}`;
}

/* ============================================================
   STAGE 1 · sjRecap — обкладинка + три картки-докази (перевертаються)
   data: { hero, cards:[{id,k,t,text}] }
   ============================================================ */
define("sjRecap", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "cards"); A.open = A.open || {};
  const front = c => c.id === "photo" ? `<span class="sj-cardpic photo">${(les.media || {}).photo ? `<img src="${esc(les.media.photo)}" alt="" decoding="async">` : ""}</span>`
    : c.id === "jacket" ? `<span class="sj-cardpic jacket">${jacketPic(les)}</span>`
    : `<span class="sj-cardpic msg"><span class="sj-minimsg"><b>UNKNOWN SENDER</b>Find out what was hidden in the jacket.</span><span class="sj-buzz" aria-hidden="true">📱</span></span>`;
  const draw = () => {
    const n = Object.keys(A.open).length;
    el.innerHTML = `${caseBar(ctx)}
      <section class="sj-hero">
        <p class="sj-hero-k">${esc(d.hero.kicker)}</p>
        <h2 class="sj-hero-title" id="stitle" tabindex="-1">${esc(d.hero.title)} <span aria-hidden="true">${d.hero.emoji}</span></h2>
        <p class="sj-hero-tag">${esc(d.hero.tagline)}</p>
        <p class="sj-hero-prev">🎬 Previously on <b>The Jacket Secret</b>… Tap each card to remember.</p>
      </section>
      <div class="sj-cards">${d.cards.map((c, k) => { const on = !!A.open[c.id]; return `
        <button class="sj-flip ${on ? "on" : ""}" type="button" data-card="${c.id}" aria-pressed="${on}" style="--k:${k}">
          <span class="sj-flip-in">
            <span class="sj-face sj-front" ${on ? 'aria-hidden="true"' : ""}>${front(c)}<span class="sj-card-k">${esc(c.k)}</span><b>${esc(c.t)}</b><span class="sj-tap">Tap to remember ↻</span></span>
            <span class="sj-face sj-back" ${on ? "" : 'aria-hidden="true"'}><span class="sj-card-k">${esc(c.k)} · ${esc(c.t)}</span><span class="sj-back-t">${esc(c.text)}</span></span>
          </span>
        </button>`; }).join("")}</div>
      <div class="row sj-under"><span class="pill ${n === d.cards.length ? "good" : ""}">${n} / ${d.cards.length} cards</span>${n === d.cards.length ? `<span class="muted">Now — what do you remember? 👉</span>` : ""}
        ${d.cards.map(c => A.open[c.id] ? say(c.text, "Listen: " + c.t) : "").join("")}</div>`;
    ctx.setCTA({ label:"Remember the story →" });
  };
  el.onclick = e => { const c = e.target.closest("[data-card]"); if (c){ const id = c.dataset.card; if (A.open[id]) delete A.open[id]; else A.open[id] = Date.now(); save(); draw(); const b = $(`[data-card="${id}"]`, el); if (b) b.focus(); } };
  draw();
}, { label: () => "3 cards" });

/* ============================================================
   sjQuestions — питання по одному (говоріння), переклад, приклад у Teacher view,
   необов'язкова нотатка; на останньому — «THE STORY CONTINUES…»
   data: { qs:[{q,ua,ex}], title?, intro?, end?, cta, note? }
   ============================================================ */
define("sjQuestions", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "qs"); const n = d.qs.length;
  A.i = Math.min(A.i || 0, n - 1); A.notes = A.notes || {};
  const T = Toggles();
  const draw = () => {
    const i = A.i, q = d.qs[i]; if (i === n - 1) A.reached = true;
    el.innerHTML = `${head(ctx, d.intro || (d.end ? "What do you remember? Answer in the Past Simple." : ""), d.title || "Remember the story 🧠")}
      <div class="card sj-qcard">
        <div class="tm-qtop"><span>Question ${i + 1} of ${n}</span><span class="tm-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</span></div>
        <div class="tm-qrow"><p class="q-big sj-bigq">${esc(q.q)}</p>${say(q.q)}</div>
        ${qTools(T, "q" + i, q, ctx)}
        ${d.note ? `<div class="field sj-note"><label for="nt${i}">My idea (optional)</label><input type="text" id="nt${i}" data-note="${i}" value="${esc(A.notes[i] || "")}" placeholder="I think…" autocomplete="off"></div>` : `<p class="tm-oral">🗣 Answer out loud — your teacher is listening.</p>`}
        <div class="row tm-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>
      ${d.end && A.reached ? `<div class="sj-continues ix-reveal" aria-live="polite"><span>${esc(d.end)}</span></div>` : ""}`;
    ctx.setCTA({ label: d.cta || "Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); T.reset(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); T.reset(); save(); draw(); }
  };
  el.oninput = e => { const k = e.target.dataset && e.target.dataset.note; if (k != null){ A.notes[k] = e.target.value; save(); } };
  draw();
}, { label: d => d.title ? d.title.replace(/[^\w\s?'-]/gu, "").trim() : "Remember" });

/* ============================================================
   STAGE 2 · sjPaper — рядки історії → папірець розгортається (2 згини) →
   STYLE PLAN з іменами (натисни ім'я) → чат Марка
   data: { story:[..], plan:{title,sub,names:[{id,n,role,wear,clue,hidden}],foot,sign}, marko:[msgs] }
   ============================================================ */
define("sjPaper", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "paper"); A.seen = A.seen || {};
  const plan = d.plan; const anim = !reduced();
  let typing = anim && !A.storyDone;
  const draw = () => {
    const stage = A.full ? "full" : A.half ? "half" : "folded";
    const sel = plan.names.find(x => x.id === A.sel);
    el.innerHTML = `${head(ctx, "")}
      <div class="sj-story" id="sty" aria-live="polite">${d.story.map((l, k) => `<p class="sj-sline ${typing ? "wait" : ""}" data-sl="${k}">${esc(l)}</p>`).join("")}</div>
      <div class="sj-paperwrap">
        <div class="sj-paper ${stage}" id="pap">
          ${stage === "folded" ? `<button class="sj-folded" type="button" data-unfold aria-label="Unfold the paper"><span class="sj-fold-t">Tap to unfold</span><span class="sj-crease" aria-hidden="true"></span></button>` : `
          <div class="sj-doc">
            <h3 class="sj-doc-t">${esc(plan.title)}</h3><p class="sj-doc-sub">${esc(plan.sub)}</p>
            <ol class="sj-names">${plan.names.map(x => { const vis = !x.hidden || A.full; return vis ? `<li><button class="sj-name ${A.sel === x.id ? "on" : ""} ${A.seen[x.id] ? "seen" : ""}" type="button" data-name="${x.id}" aria-pressed="${A.sel === x.id}"><b>${esc(x.n)}</b><span>— ${esc(x.role)}</span></button></li>` : ""; }).join("")}</ol>
            ${A.full ? `<p class="sj-doc-foot">${esc(plan.foot)}</p><p class="sj-doc-sign">${esc(plan.sign)}</p>` : ""}
          </div>
          ${A.full ? "" : `<button class="sj-flap" type="button" data-unfold2><span>One more fold… tap to open ↓</span></button>`}`}
        </div>
        <div class="sj-nameinfo" aria-live="polite">${sel ? `<div class="sj-ni ix-reveal"><b>${esc(sel.n)}</b><p class="sj-ni-wear">👕 ${esc(sel.wear)}</p><p class="sj-ni-clue">🔎 ${esc(sel.clue)}</p></div>`
          : stage === "folded" ? `<p class="muted">Unfold the paper to read it.</p>` : `<p class="muted">👆 Tap a name on the paper.</p>`}</div>
      </div>
      <div class="tm-phone slim sj-mchat" ${A.full ? "" : "hidden"}><div class="tm-thread" id="mc" aria-live="polite"></div></div>`;
    ctx.setCTA({ label:"What do you think? →" });
    if (A.full){ const box = $("#mc", el); if (A.chat || !anim) box.innerHTML = threadHTML(les, d.marko); else { A.chat = true; save(); playThread(box, les, d.marko, { delay:500 }); scrollTo(box.parentNode, "center"); } }
  };
  el.onclick = e => {
    if (e.target.closest("[data-unfold]")){ A.half = true; save(); draw(); const p = $("#pap", el); if (p && anim) p.classList.add("opening"); return; }
    if (e.target.closest("[data-unfold2]")){ A.full = true; A.sel = "anna"; A.seen.anna = true; save(); draw(); return; }
    const nm = e.target.closest("[data-name]"); if (nm){ A.sel = nm.dataset.name; A.seen[A.sel] = true; save(); draw(); const b = $(`[data-name="${A.sel}"]`, el); if (b) b.focus(); }
  };
  draw();
  if (typing){
    $$(".sj-sline", el).forEach((p, k) => later(() => { p.classList.remove("wait"); p.classList.add("ix-reveal"); }, 400 + k * 900));
    later(() => { A.storyDone = true; save(); typing = false; }, 400 + d.story.length * 900);
  }
}, { label: () => "The paper" });

/* ============================================================
   STAGE 3 · sjMatch — 4 фото без імен + 4 імені: перетягни або натисни ім'я → фото
   data: { photos:[{id,n,cap,alt}], names:[..], intro }
   ============================================================ */
define("sjMatch", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, M = store(ctx, scr, "match"); M.at = M.at || {}; M.miss = M.miss || 0;
  let sel = null, msg = null, planOpen = false, lastBad = null;
  const placed = name => Object.keys(M.at).find(pid => M.at[pid] === name);
  const allDone = () => d.photos.every(p => M.at[p.id]);
  const draw = () => {
    const done = allDone();
    el.innerHTML = `${head(ctx, d.intro)}
      <div class="sj-tags" role="group" aria-label="Names">${d.names.map(nm => { const used = placed(nm.toLowerCase());
        return used ? `<span class="sj-tag used" aria-hidden="true">${esc(nm)}</span>` : `<button class="sj-tag ${sel === nm ? "on" : ""}" type="button" draggable="true" data-tag="${nm}" aria-pressed="${sel === nm}">${esc(nm)}</button>`; }).join("")}
        <span class="spacer"></span><button class="tm-tog ${planOpen ? "on" : ""}" type="button" data-plan aria-expanded="${planOpen}" aria-controls="sj-plan">📜 Style plan</button></div>
      <div class="sj-planpeek" id="sj-plan" ${planOpen ? "" : "hidden"}>${les.plan.names.map(x => `<p><b>${esc(x.n)}:</b> ${esc(x.wear)}</p>`).join("")}</div>
      <div class="sj-photos">${d.photos.map(p => { const who = M.at[p.id];
        return `<button class="sj-snap ${who ? "ok" : ""} ${lastBad === p.id ? "shake" : ""} ${sel && !who ? "ready" : ""}" type="button" data-photo="${p.id}" ${who ? "disabled" : ""} aria-label="Photo ${p.n}${who ? ": " + cap(who) : sel ? " — put " + sel + " here" : ""}">
          <span class="sj-snap-img ${lookCls(les, p.id)}">${lookArt(les, p.id, p.alt)}</span>
          <span class="sj-snap-cap"><span>Photo ${p.n}</span>${who ? `<b class="sj-snap-name">✓ ${esc(cap(who))}</b>` : `<i class="sj-drop">${sel ? "Put " + esc(sel) + " here" : "Who is it?"}</i>`}</span>
        </button>`; }).join("")}</div>
      <div aria-live="polite">${done ? `<div class="note good">✓ ${good(2)} All four photos have names.</div>` : msg ? `<div class="note ${msg.c}">${msg.t}</div>` : `<p class="muted sj-tip">Drag a name onto a photo — or tap a name, then tap the photo.</p>`}</div>
      ${!done ? `<div class="row tm-actions">${ctx.teacher || M.miss >= 3 ? `<button class="btn small ghost" type="button" data-showall>Show answers</button>` : ""}</div>` : ""}`;
    ctx.setCTA({ label: done ? "What did they wear? →" : "Continue" });
  };
  const put = (name, pid) => {
    if (!name || !pid || M.at[pid]) return;
    if (name.toLowerCase() === pid){ M.at[pid] = pid; msg = { c:"good", t:"✓ " + good(Object.keys(M.at).length) }; lastBad = null; }
    else { M.miss++; msg = { c:"amber", t:`${bad(M.miss)} Is it really <b>${esc(name)}</b>? Read the style plan.` }; lastBad = pid; }
    sel = null; save(); draw(); lastBad = null;
  };
  el.onclick = e => {
    if (e.target.closest("[data-plan]")){ planOpen = !planOpen; draw(); return; }
    if (e.target.closest("[data-showall]")){ d.photos.forEach(p => M.at[p.id] = p.id); M.shown = true; save(); draw(); return; }
    const t = e.target.closest("[data-tag]"); if (t){ sel = sel === t.dataset.tag ? null : t.dataset.tag; msg = null; draw(); return; }
    const ph = e.target.closest("[data-photo]"); if (ph && sel) put(sel, ph.dataset.photo);
  };
  el.ondragstart = e => { const t = e.target.closest && e.target.closest("[data-tag]"); if (t){ try { e.dataTransfer.setData("text/plain", t.dataset.tag); e.dataTransfer.effectAllowed = "move"; } catch(err){} } };
  el.ondragover = e => { const p = e.target.closest && e.target.closest("[data-photo]"); if (p && !p.disabled){ e.preventDefault(); p.classList.add("over"); } };
  el.ondragleave = e => { const p = e.target.closest && e.target.closest("[data-photo]"); if (p && !p.contains(e.relatedTarget)) p.classList.remove("over"); };
  el.ondrop = e => { const p = e.target.closest && e.target.closest("[data-photo]"); if (!p) return; e.preventDefault(); let nm = ""; try { nm = e.dataTransfer.getData("text/plain"); } catch(err){} put(nm, p.dataset.photo); };
  draw();
}, { label: () => "Match photos" });

/* ============================================================
   sjMcqSet — кілька питань з вибором на одному екрані (+ необов'язковий доказ)
   data: { qs:[{q,o,a,hint,why,ua}], title, intro, plan?, evidence?, cta }
   ============================================================ */
define("sjMcqSet", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "q"); A.r = A.r || {};
  const T = Toggles(); let fresh = false;
  const qs = d.qs.map((q, i) => withGood(q, i));
  const allDone = () => qs.every((q, i) => mcqDone(A.r[i]));
  const draw = () => {
    const n = qs.filter((q, i) => mcqDone(A.r[i])).length;
    const ev = d.evidence && CASE(ctx).ev[d.evidence];
    el.innerHTML = `${head(ctx, d.intro, d.title)}
      ${d.plan ? `<div class="row tm-tools">${T.btn("mp", "📜 Style plan")}</div>${T.box("mp", les.plan.names.map(x => `<p><b>${esc(x.n)}:</b> ${esc(x.wear)}</p>`).join(""), "sj-planpeek")}` : ""}
      <div class="sj-mcqs">${qs.map((q, i) => `<div class="card">${mcq(String(i), q, A.r[i] = A.r[i] || {}, { num:i + 1, T })}</div>`).join("")}</div>
      <div class="row sj-under"><span class="pill ${n === qs.length ? "good" : ""}">${n} / ${qs.length} answered</span></div>
      <div id="evz">${ev ? evUnlocked(les, d.evidence, fresh) : d.evidence ? `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Answer all ${qs.length} questions to unlock Evidence #${d.evidence}.</p></div>` : ""}</div>`;
    ctx.setCTA({ label: d.cta || "Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = mcqClick(e, k => qs[+k] ? { q:qs[+k], R: A.r[+k] = A.r[+k] || {} } : null);
    if (id !== false){
      if (d.evidence && allDone() && unlockEvidence(ctx, d.evidence)){ fresh = true; draw(); scrollTo($("#evz", el), "center"); return; }
      draw(); const nx = $(`[data-qid="${id}"]`, el); if (nx) scrollTo(nx);
    }
  };
  draw();
}, { label: d => d.title ? d.title.replace(/[^\w\s?'-]/gu, "").trim() : "Questions" });

/* ============================================================
   sjPairs — 4 пари протилежностей: натисни слово ліворуч, потім його пару праворуч
   data: { pairs:[{a,b,ex}] }
   ============================================================ */
define("sjPairs", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "pairs"); A.ok = A.ok || {}; A.miss = A.miss || 0;
  const bs = d.pairs.map(p => p.b);
  if (!Array.isArray(A.order) || A.order.length !== bs.length || bs.some(b => !A.order.includes(b))){ let o; do { o = shuffle(bs); } while (o.every((x, i) => x === bs[i])); A.order = o; }
  let sel = null, msg = null, badB = null;
  const pairOf = b => d.pairs.findIndex(p => p.b === b);
  const draw = () => {
    const n = Object.keys(A.ok).length, done = n === d.pairs.length;
    el.innerHTML = `${head(ctx, "Match the opposites from Lesson 4. Tap a word on the left, then its opposite on the right.", "Opposites 🔁")}
      <div class="sj-pairs">
        <div class="sj-col" role="group" aria-label="Words">${d.pairs.map((p, i) => `<button class="sj-pw ${A.ok[i] ? "ok c" + i : ""} ${sel === i ? "on" : ""}" type="button" data-pa="${i}" draggable="${A.ok[i] ? "false" : "true"}" ${A.ok[i] ? "disabled" : ""} aria-pressed="${sel === i}">${esc(p.a)}</button>`).join("")}</div>
        <div class="sj-col" role="group" aria-label="Opposites">${A.order.map(b => { const i = pairOf(b); return `<button class="sj-pw right ${A.ok[i] ? "ok c" + i : ""} ${badB === b ? "shake" : ""} ${sel != null && !A.ok[i] ? "ready" : ""}" type="button" data-pb="${esc(b)}" ${A.ok[i] ? "disabled" : ""}>${esc(b)}</button>`; }).join("")}</div>
      </div>
      <div aria-live="polite">${msg ? `<div class="note ${msg.c}">${msg.t}</div>` : ""}</div>
      ${n ? `<div class="card sj-pairex"><h3 class="tm-h">In the story</h3>${d.pairs.map((p, i) => A.ok[i] ? `<p class="ix-reveal"><span class="sj-dot c${i}" aria-hidden="true"></span>${esc(p.ex)} ${say(p.ex)}</p>` : "").join("")}</div>` : ""}
      ${!done && (ctx.teacher || A.miss >= 3) ? `<div class="row tm-actions"><button class="btn small ghost" type="button" data-pshow>Show answers</button></div>` : ""}`;
    ctx.setCTA({ label: done ? "Which outfit? →" : "Continue" });
  };
  const tryPair = (i, b) => {
    if (i == null || A.ok[i]) return;
    if (d.pairs[i].b === b){ A.ok[i] = true; msg = { c:"good", t:`✓ ${esc(d.pairs[i].a)} ↔ ${esc(b)}. ${good(Object.keys(A.ok).length)}` }; S.wordResult && S.wordResult(d.pairs[i].a, true); }
    else { A.miss++; badB = b; msg = { c:"amber", t:`${bad(A.miss + 1)} <b>${esc(d.pairs[i].a)}</b> and <b>${esc(b)}</b> aren't opposites.` }; }
    sel = null; save(); draw(); badB = null;
  };
  el.onclick = e => {
    if (e.target.closest("[data-pshow]")){ d.pairs.forEach((p, i) => A.ok[i] = true); save(); msg = null; draw(); return; }
    const a = e.target.closest("[data-pa]"); if (a){ sel = sel === +a.dataset.pa ? null : +a.dataset.pa; msg = null; draw(); const f = $(`[data-pa="${a.dataset.pa}"]`, el); if (f) f.focus(); return; }
    const b = e.target.closest("[data-pb]"); if (b){ if (sel == null){ msg = { c:"info", t:"First tap a word on the left." }; draw(); return; } tryPair(sel, b.dataset.pb); }
  };
  el.ondragstart = e => { const a = e.target.closest && e.target.closest("[data-pa]"); if (a){ try { e.dataTransfer.setData("text/plain", a.dataset.pa); } catch(err){} } };
  el.ondragover = e => { const b = e.target.closest && e.target.closest("[data-pb]"); if (b && !b.disabled){ e.preventDefault(); b.classList.add("over"); } };
  el.ondragleave = e => { const b = e.target.closest && e.target.closest("[data-pb]"); if (b) b.classList.remove("over"); };
  el.ondrop = e => { const b = e.target.closest && e.target.closest("[data-pb]"); if (!b) return; e.preventDefault(); let i = ""; try { i = e.dataTransfer.getData("text/plain"); } catch(err){} if (i !== "") tryPair(+i, b.dataset.pb); };
  draw();
}, { label: () => "Opposites" });

/* ============================================================
   sjSpeak — питання для говоріння (+ вибір образу) → «Collect Evidence #N»
   data: { speak:{q,ua,ex,fu}, evidence, looks?, cta }
   ============================================================ */
define("sjSpeak", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "speak");
  const T = Toggles(); let fresh = false;
  const draw = () => {
    const got = d.evidence && CASE(ctx).ev[d.evidence];
    el.innerHTML = `${head(ctx, "", "Your turn 🗣")}
      ${d.looks ? `<div class="sj-looks" role="group" aria-label="Choose an outfit">${les.plan.names.map(x => `<button class="sj-lk ${A.pick === x.id ? "on" : ""}" type="button" data-pick="${x.id}" aria-pressed="${A.pick === x.id}"><span class="sj-lk-img ${lookCls(les, x.id)}">${lookArt(les, x.id, x.n + "'s outfit: " + x.wear)}</span><b>${esc(x.n)}'s outfit</b></button>`).join("")}</div>` : ""}
      <div class="card sj-qcard">
        <div class="tm-qrow"><p class="q-big sj-bigq">${esc(d.speak.q)}</p>${say(d.speak.q)}</div>
        ${A.pick ? `<p class="sj-pickline">I'd wear <b>${esc(cap(A.pick))}'s</b> outfit because… <span class="muted">(2–3 words from Lesson 4!)</span></p>` : ""}
        ${qTools(T, "sp", d.speak, ctx)}
        <p class="tm-oral">🗣 Answer out loud — your teacher is listening.</p>
      </div>
      <div id="evz">${got ? evUnlocked(les, d.evidence, fresh) : ""}</div>`;
    ctx.setCTA(got ? { label: d.cta || "Continue" } : { label:`Collect Evidence #${d.evidence} 🔎`, action: () => { fresh = unlockEvidence(ctx, d.evidence); draw(); scrollTo($("#evz", el), "center"); } });
  };
  el.onclick = e => { if (T.handle(e, el)) return; const p = e.target.closest("[data-pick]"); if (p){ A.pick = p.dataset.pick; save(); draw(); } };
  draw();
}, { label: () => "Speak · evidence" });

/* ============================================================
   STAGE 4 · sjTimeline — програма фестивалю + 6 подій: перетягни / стрілки / ⇄
   data: { events:[{id,t,time,icon}], start, programme:{title,sub,rows,torn}, notes, night, intro }
   ============================================================ */
define("sjTimeline", (el, scr, ctx) => {
  const d = scr.data, B = store(ctx, scr, "tl");
  const ids = d.events.map(x => x.id);
  if (!Array.isArray(B.order) || B.order.length !== ids.length || ids.some(x => !B.order.includes(x))) B.order = (d.start || shuffle(ids)).slice();
  B.tries = B.tries || 0;
  let sel = null, msg = null, fresh = false;
  const ev = id => d.events.find(x => x.id === id);
  const right = () => B.order.filter((id, i) => id === ids[i]).length;
  const pg = d.programme;
  const draw = () => {
    const solved = !!B.solved;
    el.innerHTML = `${head(ctx, d.intro)}
      <div class="sj-tlgrid">
        <aside class="sj-prog-poster" aria-label="Festival programme">
          <span class="sj-pp-t">${esc(pg.title)}</span><span class="sj-pp-sub">${esc(pg.sub)}</span>
          <ul>${pg.rows.map((r, k) => `<li class="${k === pg.torn && !solved ? "torn" : ""}"><b>${esc(r[0])}</b><span>${k === pg.torn && !solved ? "<i>· · · torn · · ·</i>" : esc(r[1])}</span></li>`).join("")}</ul>
          <div class="sj-pp-notes">${d.notes.map(n => `<p>📝 ${esc(n)}</p>`).join("")}</div>
        </aside>
        <div class="sj-tl ${solved ? "solved" : ""}">
          <p class="sj-tl-head">${solved ? `✓ This is exactly what happened on ${esc(d.night)}.` : "Earliest ↓ latest"}</p>
          <ol class="sj-evs" aria-label="Timeline, from earliest to latest">${B.order.map((id, i) => { const x = ev(id);
            return `<li class="sj-evc ${sel === id ? "sel" : ""}" data-ev="${id}" draggable="${solved ? "false" : "true"}">
              <span class="sj-evpos">${i + 1}</span><span class="sj-evicon">${ic(x.icon)}</span>
              <p class="sj-evt">${esc(x.t)}</p>
              <span class="sj-evtime ${solved ? "shown" : ""}">${solved ? esc(x.time) : "?:??"}</span>
              ${solved ? "" : `<span class="sj-evmv"><button class="sj-mv" type="button" data-mv="${id}:-1" ${i === 0 ? "disabled" : ""} aria-label="Move “${esc(x.t)}” earlier">↑</button><button class="sj-mv" type="button" data-pick="${id}" aria-pressed="${sel === id}" aria-label="${sel === id ? "Selected — tap another card to swap" : "Select to swap"}">⇄</button><button class="sj-mv" type="button" data-mv="${id}:1" ${i === ids.length - 1 ? "disabled" : ""} aria-label="Move “${esc(x.t)}” later">↓</button></span>`}
            </li>`; }).join("")}</ol>
        </div>
      </div>
      <div aria-live="polite">${solved ? `<div class="sj-restored ${fresh ? "ix-reveal" : ""}"><span class="tm-stamp big">Timeline restored!</span><p>Tell the story: <span class="starter">First…</span><span class="starter">Then…</span><span class="starter">After that…</span><span class="starter">Finally…</span></p></div>` : msg ? `<div class="note amber">${esc(msg)}</div>` : ""}</div>
      ${solved ? "" : `<div class="row tm-actions"><button class="btn primary big" type="button" data-bcheck>Check the timeline ✓</button><button class="btn ghost" type="button" data-breset>↺ Shuffle</button>${ctx.teacher || B.tries >= 3 ? `<button class="btn small ghost" type="button" data-bshow>Show answer</button>` : ""}<span class="muted tm-tip">Drag a card, use the arrows, or tap ⇄ on two cards to swap them.</span></div>`}`;
    ctx.setCTA({ label: solved ? "Past Simple Detective →" : "Continue" });
  };
  const move = (id, dir) => { const i = B.order.indexOf(id), j = i + dir; if (j < 0 || j >= B.order.length) return; [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; msg = null; save(); draw(); const b = $(`[data-mv="${id}:${dir}"]`, el) || $(`[data-pick="${id}"]`, el); if (b) b.focus(); };
  const swap = (a, b) => { const i = B.order.indexOf(a), j = B.order.indexOf(b); [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; sel = null; msg = null; save(); draw(); };
  el.onclick = e => {
    if (B.solved) return;
    const mv = e.target.closest("[data-mv]"); if (mv){ const [id, dir] = mv.dataset.mv.split(":"); move(id, +dir); return; }
    const pk = e.target.closest("[data-pick]"); if (pk){ const id = pk.dataset.pick; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } return; }
    if (e.target.closest("[data-bcheck]")){
      B.tries++;
      if (right() === ids.length){ B.solved = true; fresh = true; msg = null; }
      else msg = `${bad(B.tries + 1)} ${right()} of ${ids.length} cards are in the right place. Look at the programme and the notes.`;
      save(); draw(); return;
    }
    if (e.target.closest("[data-bshow]")){ B.order = ids.slice(); B.solved = true; B.shown = true; save(); draw(); return; }
    if (e.target.closest("[data-breset]")){ let o; do { o = shuffle(ids); } while (o.every((x, i) => x === ids[i])); B.order = o; sel = null; msg = null; save(); draw(); return; }
    const card = e.target.closest("[data-ev]"); if (card && !e.target.closest("button")){ const id = card.dataset.ev; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } }
  };
  let dragId = null;
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (!c || B.solved) return; dragId = c.dataset.ev; c.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", dragId); e.dataTransfer.effectAllowed = "move"; } catch(err){} };
  el.ondragover = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (c && dragId){ e.preventDefault(); $$(".sj-evc.over", el).forEach(x => x !== c && x.classList.remove("over")); c.classList.add("over"); } };
  el.ondragleave = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (c && !c.contains(e.relatedTarget)) c.classList.remove("over"); };
  el.ondrop = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (!c || !dragId) return; e.preventDefault();
    const to = c.dataset.ev; if (to !== dragId){ const from = B.order.indexOf(dragId); B.order.splice(from, 1); const j = B.order.indexOf(to); B.order.splice(from <= j ? j + 1 : j, 0, dragId); msg = null; save(); }
    dragId = null; draw(); };
  el.ondragend = () => { dragId = null; $$(".sj-evc", el).forEach(x => x.classList.remove("dragging", "over")); };
  draw();
}, { label: () => "Timeline" });

/* ============================================================
   STAGE 5 · sjDiary — сторінка щоденника: натискай на речення з важливими деталями,
   🇺🇦 переклад кожного речення, міні-словничок
   data: { date, lines:[{t,ua,key}], gloss:[[w,ua]], intro }
   ============================================================ */
function diaryPage(d, A, o){
  o = o || {}; A = A || {}; const hl = A.hl || {}; const ua = A.ua || {};
  return `<div class="sj-diary ${o.compact ? "compact" : ""}">
    <span class="sj-diary-date">${esc(d.date)}</span>
    ${d.lines.map((l, k) => { const on = !!hl[k];
      return `<p class="sj-dl ${on ? (l.key ? "hl key" : "hl") : ""}">${o.compact ? `<span>${esc(l.t)}</span>` : `<button class="sj-dl-t" type="button" data-hl="${k}" aria-pressed="${on}"><span class="sj-dl-n" aria-hidden="true">${k + 1}</span>${esc(l.t)}</button><button class="sj-dl-ua ${ua[k] ? "on" : ""}" type="button" data-ua="${k}" aria-expanded="${!!ua[k]}" aria-label="Ukrainian translation of sentence ${k + 1}">🇺🇦</button>`}
        ${!o.compact && ua[k] ? `<span class="sj-dl-tr">${esc(l.ua)}</span>` : ""}</p>`; }).join("")}
  </div>`;
}
define("sjDiary", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "read"); A.hl = A.hl || {}; A.ua = A.ua || {};
  const keys = d.lines.map((l, k) => l.key ? k : -1).filter(k => k >= 0);
  const draw = () => {
    const found = keys.filter(k => A.hl[k]).length;
    el.innerHTML = `${head(ctx, d.intro)}
      <div class="sj-diarywrap">
        ${diaryPage(d, A)}
        <aside class="sj-side">
          <div class="card"><h3 class="tm-h">🔎 Important details</h3><p class="sj-count ${found === keys.length ? "full" : ""}"><b>${found}</b> / ${keys.length}</p><p class="muted">Tap the sentences with important information about the night — about the clothes, Anna and the envelope.</p>
            ${ctx.teacher ? `<button class="btn small ghost" type="button" data-allkeys>Show the important sentences</button>` : ""}</div>
          <div class="card"><h3 class="tm-h">📚 Difficult words</h3><ul class="sj-gloss">${d.gloss.map(g => `<li><b>${esc(g[0])}</b> — ${esc(g[1])}</li>`).join("")}</ul></div>
          <div class="card"><h3 class="tm-h">🎧 Listen</h3>${say(d.lines.map(l => l.t).join(" "), "Listen to the diary page")}</div>
        </aside>
      </div>`;
    ctx.setCTA({ label:"Answer the questions →" });
  };
  el.onclick = e => {
    const h = e.target.closest("[data-hl]"); if (h){ const k = +h.dataset.hl; if (A.hl[k]) delete A.hl[k]; else A.hl[k] = true; save(); draw(); const b = $(`[data-hl="${k}"]`, el); if (b) b.focus(); return; }
    const u = e.target.closest("[data-ua]"); if (u){ const k = +u.dataset.ua; A.ua[k] = !A.ua[k]; save(); draw(); const b = $(`[data-ua="${k}"]`, el); if (b) b.focus(); return; }
    if (e.target.closest("[data-allkeys]")){ keys.forEach(k => A.hl[k] = true); save(); draw(); }
  };
  draw();
}, { label: () => "Diary page" });

/* sjDiaryQs — 5 питань до щоденника (вибір + коротка відповідь) → доказ #3
   data: { qs:[{kind,q,...}], lines, date, evidence } */
define("sjDiaryQs", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "qs"); A.r = A.r || {};
  const T = Toggles(); let fresh = false;
  const qs = d.qs.map((q, i) => q.kind === "mcq" ? withGood(q, i) : Object.assign({}, q, { why: good(i) + " " + q.why }));
  const doneQ = (q, i) => q.kind === "mcq" ? mcqDone(A.r[i]) : textDone(A.r[i]);
  const hl = (ctx.all.diary && ctx.all.diary.read) || {};
  const draw = () => {
    const n = qs.filter(doneQ).length; const ev = CASE(ctx).ev[d.evidence];
    el.innerHTML = `${head(ctx, "Answer the questions. The diary page is on the left.", "Read and answer 📖")}
      <div class="sj-diarywrap qs">
        ${diaryPage(d, hl, { compact:true })}
        <div class="sj-qlist">${qs.map((q, i) => { const R = A.r[i] = A.r[i] || {};
          return `<div class="card">${q.kind === "mcq" ? mcq(String(i), q, R, { num:i + 1, T }) : `<p class="tm-q"><span class="tm-qn">${i + 1}</span><span>${esc(q.q)}</span></p>${textRow("t" + i, q, R, { label:q.q, ph:"Write a short answer…", said:true, showKey:true })}`}</div>`; }).join("")}
          <div class="row sj-under"><span class="pill ${n === qs.length ? "good" : ""}">${n} / ${qs.length} answered</span></div>
          <div id="evz">${ev ? evUnlocked(les, d.evidence, fresh) : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Answer all five questions to unlock Evidence #${d.evidence}.</p></div>`}</div>
        </div>
      </div>`;
    ctx.setCTA({ label:"Question the witness →" });
  };
  const after = () => { if (qs.every(doneQ) && unlockEvidence(ctx, d.evidence)){ fresh = true; draw(); scrollTo($("#evz", el), "center"); return true; } return false; };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    let id = mcqClick(e, k => qs[+k] && qs[+k].kind === "mcq" ? { q:qs[+k], R: A.r[+k] } : null);
    if (id === false) id = textClick(e, el, k => { const i = +String(k).slice(1); return qs[i] && qs[i].kind === "text" ? { item:qs[i], R:A.r[i] } : null; });
    if (id !== false && !after()) draw();
  };
  el.oninput = e => { const t = e.target.dataset && e.target.dataset.tin; if (t){ const i = +t.slice(1); A.r[i] = A.r[i] || {}; A.r[i].val = e.target.value; save(); } };
  enterKey(el);
  draw();
}, { label: () => "5 questions" });

/* ============================================================
   STAGE 6 · sjBuild — склади питання з плиток (натисни плитки по черзі)
   data: { items:[{id,tiles,answer}], hint, ua, intro }
   ============================================================ */
const normQ = s => String(s || "").toLowerCase().replace(/[?.!]/g, "").replace(/\s+/g, " ").trim();
define("sjBuild", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "build"); A.r = A.r || {};
  const T = Toggles();
  d.items.forEach(x => { const R = A.r[x.id] = A.r[x.id] || {}; if (!Array.isArray(R.mix) || R.mix.length !== x.tiles.length){ let o; do { o = shuffle(x.tiles.map((t, k) => k)); } while (o.every((v, k) => x.tiles[v] === x.answer.replace("?", "").split(" ")[k])); R.mix = o; } R.line = R.line || []; });
  const sentence = (x, R) => cap(R.line.map(k => x.tiles[k]).join(" ")) + "?";
  const draw = () => {
    const n = d.items.filter(x => A.r[x.id].ok || A.r[x.id].shown).length;
    el.innerHTML = `${head(ctx, d.intro, "Build the questions 🧩")}
      <p class="sj-role">🎤 You're the detective. Before you message Emma, put the words in the right order.</p>
      <div class="row tm-tools">${T.btn("bh", "💡 Hint")}${T.btn("bu", UAQ, "ua")}</div>${T.box("bh", `<p>${esc(d.hint)}</p>`, "help")}${T.box("bu", `<p>${esc(d.ua)}</p>`, "tm-uabox")}
      <ol class="sj-builds">${d.items.map((x, i) => { const R = A.r[x.id]; const done = R.ok || R.shown;
        return `<li class="card sj-bq ${done ? "ok" : ""}">
          <span class="tm-qn">${i + 1}</span>
          <div class="sj-bq-main">
            <div class="sj-line ${R.bad ? "shake" : ""}" aria-label="Your question">${done ? `<b>${esc(x.answer)}</b> ${say(x.answer)}` : R.line.length ? R.line.map((k, j) => `<button class="sj-tile in" type="button" data-out="${x.id}:${j}" aria-label="Remove ${esc(x.tiles[k])}">${esc(x.tiles[k])}</button>`).join("") + `<span class="sj-qm" aria-hidden="true">?</span>` : `<span class="muted">Tap the words below…</span>`}</div>
            ${done ? `<div class="note ${R.ok ? "good" : "info"} tm-fb">${R.ok ? "✓ " + good(i) : "Answer: " + esc(x.answer)}</div>` : `
            <div class="sj-bank">${R.mix.map(k => R.line.includes(k) ? `<span class="sj-tile ghost" aria-hidden="true">${esc(x.tiles[k])}</span>` : `<button class="sj-tile" type="button" data-in="${x.id}:${k}">${esc(x.tiles[k])}</button>`).join("")}<span class="sj-tile fixed" aria-hidden="true">?</span></div>
            <div class="row sj-bq-act"><button class="btn primary small" type="button" data-bchk="${x.id}" ${R.line.length === x.tiles.length ? "" : "disabled"}>Check ✓</button><button class="btn small ghost" type="button" data-bclr="${x.id}" ${R.line.length ? "" : "disabled"}>Clear</button>
              ${R.tries ? `<button class="btn small link" type="button" data-bshow="${x.id}">Show answer</button>` : ""}<span aria-live="polite">${R.msg ? `<span class="sj-bmsg">${esc(R.msg)}</span>` : ""}</span></div>`}
          </div></li>`; }).join("")}</ol>
      <div class="row sj-under"><span class="pill ${n === d.items.length ? "good" : ""}">Questions ready: ${n} / ${d.items.length}</span></div>`;
    ctx.setCTA({ label: n === d.items.length ? "Message Emma 💬" : "Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const t = e.target.closest("[data-in]"); if (t){ const [id, k] = t.dataset.in.split(":"); const R = A.r[id]; R.line.push(+k); R.msg = null; R.bad = false; save(); draw(); const nx = $(`[data-in^="${id}:"]`, el) || $(`[data-bchk="${id}"]`, el); if (nx) nx.focus(); return; }
    const o = e.target.closest("[data-out]"); if (o){ const [id, j] = o.dataset.out.split(":"); const R = A.r[id]; R.line.splice(+j, 1); R.msg = null; save(); draw(); return; }
    const c = e.target.closest("[data-bchk]"); if (c){ const id = c.dataset.bchk; const x = d.items.find(i => i.id === id); const R = A.r[id];
      if (normQ(sentence(x, R)) === normQ(x.answer)){ R.ok = true; R.msg = null; R.bad = false; }
      else { R.tries = (R.tries || 0) + 1; R.bad = true; R.msg = `${bad(R.tries)} ${R.tries === 1 ? "Start with the question word." : "Question word → did / were → person → verb."}`; }
      save(); draw(); return; }
    const cl = e.target.closest("[data-bclr]"); if (cl){ const R = A.r[cl.dataset.bclr]; R.line = []; R.msg = null; R.bad = false; save(); draw(); return; }
    const sh = e.target.closest("[data-bshow]"); if (sh){ A.r[sh.dataset.bshow].shown = true; save(); draw(); }
  };
  draw();
}, { label: () => "Build questions" });

/* ============================================================
   sjInterview — месенджер: обери питання → «Marko» надсилає → Emma друкує відповідь
   data: { open:[msgs], talk:[{id,q,a,key}], need, next:{q,ua,ideas,ex}, evidence }
   ============================================================ */
function bubble(les, m){
  if (m.sys) return `<div class="tm-sys">${esc(m.sys)}</div>`;
  if (m.me) return `<div class="tm-msg sj-me"><div class="tm-bub"><b class="tm-name">Marko · you</b><span>${esc(m.t)}</span></div></div>`;
  if (m.who === "emma" && !(les.characters.emma || {}).img) return `<div class="tm-msg who-emma"><span class="tm-ava mono who-emma" aria-hidden="true">E</span><div class="tm-bub"><b class="tm-name">Emma</b><span>${esc(m.t)}</span></div></div>`;
  return msgHTML(les, m);
}
define("sjInterview", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "chat"); A.asked = A.asked || {}; A.own = A.own || [];
  const T = Toggles(); let busy = false, fresh = false;
  const thread = () => { const seq = []; d.open.forEach(m => seq.push(m));
    Object.entries(A.asked).sort((a, b) => a[1] - b[1]).forEach(([id]) => { const x = d.talk.find(t => t.id === id); if (x){ seq.push({ who:"marko", me:true, t:x.q }); seq.push({ who:"emma", t:x.a }); } });
    A.own.forEach(q => { seq.push({ who:"marko", me:true, t:q }); seq.push({ sys:"🎙 Your teacher answers as Emma" }); });
    return seq; };
  const count = () => Object.keys(A.asked).length;
  const draw = () => {
    const ev = CASE(ctx).ev[d.evidence]; const n = count();
    const emma = les.characters.emma || {};
    el.innerHTML = `${head(ctx, "", "Message Emma 💬")}
      <div class="sj-chatgrid">
        <div class="tm-phone sj-phone">
          <div class="tm-phone-head">${emma.img ? ava(les, "emma") : `<span class="tm-ava mono who-emma" aria-hidden="true">E</span>`}<div><b>Emma</b><small>${busy ? "typing…" : "online"}</small></div></div>
          <div class="tm-thread" id="th" aria-live="polite">${thread().map(m => bubble(les, m)).join("")}</div>
        </div>
        <div class="sj-ask">
          <p class="sj-role">🎤 Choose a question. <b>Read it out loud</b> — then tap to send it.</p>
          <div class="sj-qchips">${d.talk.map(x => A.asked[x.id] ? "" : `<button class="sj-qchip ${x.key ? "key" : ""}" type="button" data-ask="${x.id}" ${busy ? "disabled" : ""}>${x.key ? "★ " : ""}${esc(x.q)}</button>`).join("") || `<p class="muted">You asked every question! 🎉</p>`}</div>
          <div class="sj-count2"><span class="pill ${n >= d.need ? "good" : ""}">Questions asked: ${n} / ${d.talk.length}</span>${ev ? "" : `<span class="muted">Ask ${Math.max(0, d.need - n)} more to unlock Evidence #${d.evidence}</span>`}</div>
          <div id="evz">${ev ? evUnlocked(les, d.evidence, fresh) : ""}</div>
          <div class="card sj-next">
            <div class="tm-qrow"><p class="q-big sj-bigq" style="font-size:1.15rem">${esc(d.next.q)}</p>${say(d.next.q)}</div>
            <div class="tm-inrow"><input type="text" id="own" placeholder="Write your own question…" autocomplete="off" aria-label="Your own question for Emma"><button class="btn small" type="button" data-own>Send</button></div>
            ${qTools(T, "nx", { ua:d.next.ua, ex:d.next.ex }, ctx)}
            ${ctx.teacher ? `<div class="row tm-tools">${T.btn("ideas", "🧑‍🏫 3 suggested questions", "teach")}</div>${T.box("ideas", `<ul class="tm-fu">${d.next.ideas.map(f => `<li>${esc(f)}</li>`).join("")}</ul>`, "help sj-sample")}` : ""}
          </div>
        </div>
      </div>`;
    const th = $("#th", el); if (th) th.scrollTop = th.scrollHeight;
    ctx.setCTA({ label:"The final mystery 🔐" });
  };
  const ask = id => {
    if (busy || A.asked[id]) return;
    const x = d.talk.find(t => t.id === id); if (!x) return;
    A.asked[id] = Date.now(); save();
    const grant = () => { if (count() >= d.need && unlockEvidence(ctx, d.evidence)) fresh = true; };
    if (reduced()){ grant(); draw(); return; }
    busy = true;
    const th = $("#th", el);
    th.insertAdjacentHTML("beforeend", bubble(les, { who:"marko", me:true, t:x.q })); th.scrollTop = th.scrollHeight;
    $$("[data-ask]", el).forEach(b => b.disabled = true);
    const tp = document.createElement("div"); tp.className = "tm-typing"; tp.innerHTML = `<span class="tm-tdots" aria-hidden="true"><i></i><i></i><i></i></span>Emma is typing…`;
    later(() => { th.appendChild(tp); th.scrollTop = th.scrollHeight; }, 500);
    later(() => { busy = false; grant(); draw(); if (fresh) scrollTo($("#evz", el), "center"); }, Math.min(2600, 1100 + x.a.length * 12));
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const a = e.target.closest("[data-ask]"); if (a){ ask(a.dataset.ask); return; }
    if (e.target.closest("[data-own]")){ const i = $("#own", el); const v = (i.value || "").trim(); if (!v) return; A.own.push(v); save(); draw(); }
  };
  el.onkeydown = e => { if (e.key === "Enter" && e.target.id === "own"){ e.preventDefault(); const b = $("[data-own]", el); if (b) b.click(); } };
  draw();
}, { label: () => "Interview" });

/* ============================================================
   STAGE 7 · sjBoard — дошка доказів + скринька з замком + повідомлення тата
   data: { dad:[msgs], intro }
   ============================================================ */
define("sjBoard", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "board");
  const c = CASE(ctx);
  const chs = [["fashion", 1], ["grammar", 2], ["evidence", 3]].map(([k, n]) => Object.assign({ n }, ctx.scr.stage[k]));
  el.innerHTML = `${head(ctx, d.intro)}
    <div class="sj-board">
      <div class="sj-board-ev">${[1, 2, 3, 4].map(n => `<div class="sj-pin p${n}">${evCard(les, n, { off: !c.ev[n], mini:true })}</div>`).join("")}</div>
      <div class="sj-board-c">${boxHTML(digitsOf(ctx), { big:true, media:les.media })}<p class="sj-board-cap">3 digits · 3 challenges</p></div>
      <svg class="sj-strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20,22 L50,50 M80,22 L50,50 M20,78 L50,50 M80,78 L50,50"/></svg>
    </div>
    <div class="sj-boardrow">
      <div class="tm-phone slim"><div class="tm-thread" id="dt" aria-live="polite"></div></div>
      <ol class="sj-chs">${chs.map(x => `<li class="${c.digits[x.n] != null ? "done" : ""}"><span class="sj-chs-i" aria-hidden="true">${x.icon}</span><b>${esc(x.title)}</b><span class="sj-chs-d">${c.digits[x.n] != null ? `✓ digit ${c.digits[x.n]}` : "🔒 ?"}</span></li>`).join("")}</ol>
    </div>`;
  const box = $("#dt", el);
  if (A.seen || reduced()) box.innerHTML = threadHTML(les, d.dad);
  else playThread(box, les, d.dad, { delay:700, done: () => { A.seen = true; save(); } });
  ctx.setCTA({ label:"Challenge 1 →" });
}, { label: () => "The board" });

/* ---------- три випробування: спільна рамка й видача цифри ---------- */
function giveDigit(ctx, n, digit){ const c = CASE(ctx); if (c.digits[n] != null) return false; c.digits[n] = digit; save(); return true; }
const dropDigit = (ctx, n) => () => { const c = CASE(ctx); delete c.digits[n]; };

/* sjFashionCode — 3 образи + питання з вибором → перша цифра
   data: { ch:{digit,title,icon,items:[{look,q,o,a,hint,why,ua}]} } */
define("sjFashionCode", (el, scr, ctx) => {
  const ch = scr.data.ch, les = ctx.les, A = store(ctx, scr, "c1"); A.r = A.r || {};
  const T = Toggles(); let fresh = false;
  const qs = ch.items.map((q, i) => withGood(q, i));
  const pic = it => it.look === "jacket" ? `<span class="sj-cpic jk">${jacketPic(les)}</span>` : `<span class="sj-cpic ${lookCls(les, it.look)}">${lookArt(les, it.look, les.plan.names.find(x => x.id === it.look).n + "'s outfit")}</span>`;
  const draw = () => {
    const c = CASE(ctx);
    el.innerHTML = `${head(ctx, "Three outfits. Choose the correct word for each one.", ch.title + " " + ch.icon, { onReset: dropDigit(ctx, 1) })}
      ${lockStrip(ctx, 0)}
      <div class="sj-codegrid">${qs.map((q, i) => `<div class="card sj-codecard ${mcqDone(A.r[i]) ? "solved" : ""}">${pic(q)}${mcq(String(i), q, A.r[i] = A.r[i] || {}, { num:i + 1, T })}</div>`).join("")}</div>
      <div id="dg">${c.digits[1] != null ? digitReveal(0, c.digits[1], fresh) : ""}</div>`;
    ctx.setCTA({ label:"Challenge 2 →" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = mcqClick(e, k => qs[+k] ? { q:qs[+k], R:A.r[+k] } : null);
    if (id !== false){ if (qs.every((q, i) => mcqDone(A.r[i])) && giveDigit(ctx, 1, ch.digit)){ fresh = true; draw(); scrollTo($("#dg", el), "center"); return; } draw(); }
  };
  draw();
}, { label: () => "Fashion code" });

/* sjGrammarCode — виправ 3 речення → друга цифра
   data: { ch:{digit,title,icon,items:[{id,wrong,answer,accept,hints,why}]} } */
define("sjGrammarCode", (el, scr, ctx) => {
  const ch = scr.data.ch, A = store(ctx, scr, "c2"); A.r = A.r || {};
  let fresh = false;
  const items = ch.items.map((x, i) => Object.assign({}, x, { why: good(i) + " " + x.why }));
  const draw = () => {
    const c = CASE(ctx);
    el.innerHTML = `${head(ctx, "Each sentence has one mistake. Correct it and write the whole sentence.", ch.title + " " + ch.icon, { onReset: dropDigit(ctx, 2) })}
      ${lockStrip(ctx, 1)}
      <ol class="sj-fixes">${items.map((x, i) => { const R = A.r[x.id] = A.r[x.id] || {};
        return `<li class="card ${textDone(R) ? "solved" : ""}"><p class="sj-wrong"><span class="tm-qn">${i + 1}</span><s>${esc(x.wrong)}</s> <span class="sj-x" aria-label="has a mistake">✗</span></p>
          ${textRow(x.id, x, R, { label:"Corrected sentence " + (i + 1), start:x.wrong, said:true, showKey:true })}</li>`; }).join("")}</ol>
      <div id="dg">${c.digits[2] != null ? digitReveal(1, c.digits[2], fresh) : ""}</div>`;
    ctx.setCTA({ label:"Challenge 3 →" });
  };
  el.onclick = e => {
    const id = textClick(e, el, k => { const x = items.find(i => i.id === k); return x ? { item:x, R:A.r[k] } : null; });
    if (id !== false){ if (items.every(x => textDone(A.r[x.id])) && giveDigit(ctx, 2, ch.digit)){ fresh = true; draw(); scrollTo($("#dg", el), "center"); return; }
      draw(); const nx = items.find(x => !textDone(A.r[x.id])); const inp = nx && $(`[data-tin="${nx.id}"]`, el); if (inp) inp.focus(); }
  };
  el.oninput = e => { const t = e.target.dataset && e.target.dataset.tin; if (t){ A.r[t] = A.r[t] || {}; A.r[t].val = e.target.value; save(); } };
  enterKey(el);
  draw();
}, { label: () => "Past Simple code" });

/* sjEvidenceCode — фото тата: чому Anna немає на фото? → третя цифра
   data: { ch:{digit,title,icon,q,after} } */
define("sjEvidenceCode", (el, scr, ctx) => {
  const ch = scr.data.ch, les = ctx.les, A = store(ctx, scr, "c3"); A.r = A.r || {};
  const T = Toggles(); let fresh = false;
  const q = withGood(ch.q, 2);
  const draw = () => {
    const c = CASE(ctx); const done = mcqDone(A.r);
    el.innerHTML = `${head(ctx, "", ch.title + " " + ch.icon, { onReset: dropDigit(ctx, 3) })}
      ${lockStrip(ctx, 2)}
      <div class="sj-split">
        <div class="sj-split-l">${photo(les, { cls:"unfolded big", rot:-2 })}</div>
        <div class="sj-split-r"><div class="card">${mcq("e", q, A.r, { T })}</div>
          ${done ? `<div class="tm-thread static ix-reveal">${msgHTML(les, ch.after)}</div>` : ""}
          <div id="dg">${c.digits[3] != null ? digitReveal(2, c.digits[3], fresh) : ""}</div></div>
      </div>`;
    ctx.setCTA({ label:"Open the lock 🔐" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = mcqClick(e, k => k === "e" ? { q, R:A.r } : null);
    if (id !== false){ if (mcqDone(A.r) && giveDigit(ctx, 3, ch.digit)) fresh = true; draw(); if (fresh) scrollTo($("#dg", el), "center"); }
  };
  draw();
}, { label: () => "Final evidence" });

/* ============================================================
   sjLock — кодовий замок: 3 колеса (▲ ▼, клавіатура, цифри) → скринька відкривається
   data: { note }  (правильний код — les.code)
   ============================================================ */
define("sjLock", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "lock");
  A.v = Array.isArray(A.v) && A.v.length === 3 ? A.v : [0, 0, 0]; A.tries = A.tries || 0;
  let shake = false, msg = null, fresh = false;
  const found = digitsOf(ctx);
  const draw = () => {
    const open = !!A.open;
    el.innerHTML = `${head(ctx, open ? "" : "Enter the three digits from the challenges. Then open the box.", open ? "The box is open! 🔓" : "The Lock 🔐")}
      <div class="sj-lockscene ${open ? "open" : ""} ${shake ? "shake" : ""} ${fresh ? "fresh" : ""}">
        ${boxHTML(open ? les.code.split("").map(Number) : A.v, { big:true, open, media:les.media })}
        ${open ? `<div class="sj-codenote ix-reveal"><b>${esc(les.code.split("").join(" · "))}</b><span>${esc(d.note)}</span></div>` : `
        <div class="sj-dials" role="group" aria-label="Combination lock">${A.v.map((v, k) => `<div class="sj-dial">
          <button class="sj-dbtn" type="button" data-dial="${k}:1" aria-label="Wheel ${k + 1}: up">▲</button>
          <span class="sj-dval" role="spinbutton" tabindex="0" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${v}" aria-label="Digit ${k + 1}" data-dval="${k}">${v}</span>
          <button class="sj-dbtn" type="button" data-dial="${k}:-1" aria-label="Wheel ${k + 1}: down">▼</button></div>`).join("")}</div>
        <p class="sj-found">Your digits: ${found.map(x => `<b class="${x != null ? "" : "miss"}">${x != null ? x : "?"}</b>`).join(" ")}${found.some(x => x == null) ? ` <span class="muted">— finish the challenges to find all three.</span>` : ""}</p>
        <div class="row" style="justify-content:center"><button class="btn primary big" type="button" data-open>Open the box 🔓</button>${ctx.teacher || A.tries >= 3 ? `<button class="btn small ghost" type="button" data-code>Show the code</button>` : ""}</div>`}
      </div>
      <div aria-live="polite">${msg ? `<div class="note amber">${esc(msg)}</div>` : ""}</div>`;
    ctx.setCTA({ label: open ? "Open the envelope ✉️" : "Continue" });
    shake = false;
  };
  const turn = (k, dir) => { A.v[k] = (A.v[k] + dir + 10) % 10; msg = null; save(); draw(); const f = $(`[data-dval="${k}"]`, el); if (f) f.focus(); };
  el.onclick = e => {
    const b = e.target.closest("[data-dial]"); if (b){ const [k, dir] = b.dataset.dial.split(":"); A.v[+k] = (A.v[+k] + +dir + 10) % 10; msg = null; save(); draw(); const f = $(`[data-dial="${b.dataset.dial}"]`, el); if (f) f.focus(); return; }
    if (e.target.closest("[data-code]")){ A.v = les.code.split("").map(Number); save(); draw(); return; }
    if (e.target.closest("[data-open]")){
      A.tries++;
      if (A.v.join("") === les.code){ A.open = true; fresh = true; msg = null; }
      else { shake = true; msg = `${bad(A.tries)} ${A.v.join("")} is not the right code. Check your three digits.`; }
      save(); draw();
    }
  };
  el.onkeydown = e => {
    const v = e.target.closest && e.target.closest("[data-dval]"); if (!v) return; const k = +v.dataset.dval;
    if (e.key === "ArrowUp"){ e.preventDefault(); turn(k, 1); }
    else if (e.key === "ArrowDown"){ e.preventDefault(); turn(k, -1); }
    else if (/^[0-9]$/.test(e.key)){ e.preventDefault(); A.v[k] = +e.key; save(); draw(); const nx = $(`[data-dval="${Math.min(2, k + 1)}"]`, el); if (nx) nx.focus(); }
  };
  draw();
}, { label: () => "The lock" });

/* ============================================================
   sjReveal — конверт → фото всіх чотирьох (перевертається) → лист Anna → правда + Марко
   data: { letter:{to,lines,sign,ps,photoBack}, truth:[..], marko:[msgs] }
   ============================================================ */
define("sjReveal", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "reveal"); A.step = A.step || 0;
  const L = d.letter; const anim = !reduced();
  let played = false;
  const draw = () => {
    const s = A.step;
    el.innerHTML = `${head(ctx, s === 0 ? "Inside the box there is a small, old envelope. Anna's handwriting is on the front: “For Dan”." : "", "The Final Reveal ✉️")}
      <div class="sj-reveal">
        <button class="sj-env ${s >= 1 ? "open" : ""}" type="button" data-env ${s >= 1 ? "disabled" : ""} aria-label="${s >= 1 ? "The envelope is open" : "Open the envelope"}">
          <span class="sj-env-back" aria-hidden="true"></span><span class="sj-env-flap" aria-hidden="true"></span><span class="sj-env-front" aria-hidden="true"><i>For Dan</i></span>
          ${s === 0 ? `<span class="sj-env-tap">Tap to open</span>` : ""}
        </button>
        ${s >= 1 ? `<div class="sj-reveal-items ${s === 1 && anim ? "ix-reveal" : ""}">
          <button class="sj-photo4 ${(les.media || {}).four ? "real" : ""} ${A.flip ? "flip" : ""}" type="button" data-flip aria-pressed="${!!A.flip}" aria-label="${A.flip ? "The back of the photo. Tap to turn it over." : "A photo of all four friends. Tap to see the back."}">
            <span class="sj-p4in"><span class="sj-p4f">${fourPhoto(les)}</span><span class="sj-p4b"><i>${esc(L.photoBack)}</i></span></span>
          </button>
          <p class="sj-p4cap">${A.flip ? esc(L.photoBack) : "All four friends — together. 📸 Tap the photo to turn it over."}</p>
          ${s === 1 ? `<button class="btn primary big" type="button" data-letter>Read Anna's letter 💌</button>` : ""}
        </div>` : ""}
        ${s >= 2 ? `<article class="sj-letter ${s === 2 && anim ? "unfold" : ""}" aria-label="Anna's letter">
          <p class="sj-l-to">${esc(L.to)}</p>${L.lines.map(x => `<p>${esc(x)}</p>`).join("")}
          <p class="sj-l-sign">${L.sign.map(esc).join("<br>")}</p><p class="sj-l-ps">${esc(L.ps)}</p>
          <div class="sj-l-tools">${say([L.to].concat(L.lines, L.sign.map(x => x.replace(/[^\w\s,.'!]/g, "")), [L.ps]).join(" "), "Listen to Anna's letter")}</div>
        </article>
        <div class="sj-patch"><span class="sj-patchpic" aria-hidden="true"><i></i></span><p><b>The red patch:</b> the white triangle is an <b>A</b> — A for Anna.</p></div>
        <div class="card sj-truth"><h3 class="tm-h">🔎 The secret</h3><ul>${d.truth.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="tm-phone slim"><div class="tm-thread" id="mk" aria-live="polite"></div></div>` : ""}
      </div>`;
    ctx.setCTA({ label: s >= 2 ? "Think about it →" : "Continue" });
    if (s >= 2){ const box = $("#mk", el); if (A.mk || !anim || played) box.innerHTML = threadHTML(les, d.marko); else { played = true; playThread(box, les, d.marko, { delay:1600, done: () => { A.mk = true; save(); } }); } }
  };
  el.onclick = e => {
    if (e.target.closest("[data-env]")){ A.step = Math.max(A.step, 1); save(); draw(); return; }
    if (e.target.closest("[data-flip]")){ A.flip = !A.flip; save(); draw(); const f = $("[data-flip]", el); if (f) f.focus(); return; }
    if (e.target.closest("[data-letter]")){ A.step = 2; save(); draw(); scrollTo($(".sj-letter", el), "start"); }
  };
  draw();
}, { label: () => "The letter" });

/* ============================================================
   STAGE 8 · sjEnding — фінал історії (темний): фото, повідомлення невідомого, затемнення
   data: { scene, buzz, msgs1, smile, more, msgs2, marko }
   ============================================================ */
define("sjEnding", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "end");
  el.innerHTML = `<div class="story-screen sj-end">
      <p class="sj-endline" id="e1">${esc(d.scene)}</p>
      <div class="sj-endphoto ${(les.media || {}).four ? "real" : ""}" id="e2" hidden>${fourPhoto(les)}</div>
      <p class="sj-endline" id="e3" hidden>${esc(d.buzz)} <span class="sj-buzz" aria-hidden="true">📱</span></p>
      <div class="tm-unk" id="u1" hidden><div class="tm-unk-head"><span class="tm-ava mono who-unknown" aria-hidden="true">?</span><div><b id="stitle" tabindex="-1">UNKNOWN SENDER</b><small>no number</small></div></div><div class="tm-thread" id="t1" aria-live="polite"></div></div>
      <p class="sj-endline" id="e4" hidden>${esc(d.smile)} 🙂</p>
      <p class="sj-endline" id="e5" hidden>${esc(d.more)}</p>
      <div class="tm-unk" id="u2" hidden><div class="tm-thread" id="t2" aria-live="polite"></div></div>
      <div class="sj-fade" id="bo" hidden></div>
    </div>`;
  const anim = !reduced() && !A.seen;
  let alive = true; onCleanup(() => { alive = false; });
  const show = id => { const n = $("#" + id, el); if (n){ n.hidden = false; n.classList.add("ix-reveal"); } return n; };
  const wait = (ms, fn) => later(() => { if (alive) fn(); }, anim ? ms : 0);
  const end = () => { A.seen = true; save(); show("bo"); ctx.setCTA({ label:"Mission report →" }); };
  ctx.setCTA({ label:"Mission report →", disabled: !ctx.teacher && anim });
  if (!anim){
    ["e2", "e3", "u1", "e4", "e5", "u2"].forEach(show);
    $("#t1", el).innerHTML = threadHTML(les, d.msgs1); $("#t2", el).innerHTML = threadHTML(les, d.msgs2.concat([d.marko])); end();
  } else {
    wait(1000, () => show("e2"));
    wait(2400, () => { show("e3"); show("u1"); scrollTo($("#u1", el), "center");
      playThread($("#t1", el), les, d.msgs1, { delay:500, stopped: () => !alive, done: () => wait(900, () => { show("e4");
        wait(1200, () => { show("e5"); show("u2"); scrollTo($("#u2", el), "center");
          playThread($("#t2", el), les, d.msgs2.concat([d.marko]), { delay:500, stopped: () => !alive, done: () => wait(1400, end) }); }); }) }); });
  }
}, { story:true, label: () => "The message" });

/* ============================================================
   sjMission — MISSION COMPLETE: підсумкові питання, міні-виклик, «Today you learned»
   data: { recap:[{q,ex}], mini:[{id,q,ph,kind}], learned:[..] }
   ============================================================ */
const PAST_IRR = ["was", "were", "went", "wore", "bought", "met", "saw", "took", "gave", "put", "made", "had", "got", "did", "left", "wrote", "came", "ate", "drank", "said", "told", "found", "felt", "knew", "thought", "sang", "swam", "ran", "won", "lost", "sat", "slept", "read", "heard", "spoke", "taught", "became", "began", "brought", "built", "caught", "chose", "drove", "flew", "forgot", "kept", "paid", "rode", "sold", "sent", "sewed", "understood"];
function miniCheck(kind, val, les){
  const v = String(val || "").toLowerCase().replace(/[’‘]/g, "'").trim();
  if (!v) return { st:"empty", t:"Write your answer first." };
  const words = v.replace(/[^a-z' -]+/g, " ").split(/\s+/).filter(Boolean);
  if (kind === "clothes"){
    const list = les.clothesWords || [];
    const sing = w => list.includes(w) ? w : list.includes(w.replace(/s$/, "")) ? w.replace(/s$/, "") : list.includes(w.replace(/es$/, "")) ? w.replace(/es$/, "") : w;
    const found = [...new Set(words.map(w => sing(w.replace(/-/g, ""))).filter(w => list.includes(w)))];
    return found.length >= 3 ? { st:"ok", t:`✓ ${found.length} clothes words. ${good(1)}` } : { st:"no", t:`I can see ${found.length} clothes word${found.length === 1 ? "" : "s"}. Name three — e.g. jeans, a hoodie, trainers.` };
  }
  const past = words.some(w => PAST_IRR.includes(w) || (/[a-z]{2,}ed$/.test(w) && w !== "need" && w !== "red")) || /\bdidn't\b/.test(v);
  if (kind === "past") return words.length >= 3 && past ? { st:"ok", t:`✓ ${good(2)}` } : { st:"no", t:"Use a verb in the Past Simple: went, wore, played, didn't…" };
  if (kind === "question"){
    const qOk = /\?\s*$/.test(v) && (/^(did|was|were)\b/.test(v) || /^(what|where|when|who|why|how|which)( \w+)? (did|was|were)\b/.test(v) || /^who \w+(ed)?\b/.test(v) && past);
    return qOk ? { st:"ok", t:`✓ ${good(3)}` } : { st:"no", t:/\?\s*$/.test(v) ? "Use did, was or were: Did you…? Where did…? Was it…?" : "Don't forget the question mark ?" };
  }
  return { st:"ok" };
}
define("sjMission", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "mission"); A.m = A.m || {};
  const T = Toggles();
  const draw = () => {
    const n = d.mini.filter(x => A.m[x.id] && (A.m[x.id].ok || A.m[x.id].said)).length;
    el.innerHTML = `${caseBar(ctx)}
      <div class="sj-complete-h"><span class="sj-ck-k">🔎 MISSION COMPLETE</span><h2 class="stitle" id="stitle" tabindex="-1">Unit 2 Revision</h2><p>You solved the secret in the jacket. Now let's look back.</p></div>
      <div class="sj-mgrid">
        <div class="card"><h3 class="tm-h">💬 Talk about it</h3><ol class="sj-recap">${d.recap.map((q, i) => `<li><span>${esc(q.q)}</span>${say(q.q)}${ctx.teacher ? T.btn("rc" + i, "🧑‍🏫", "teach") + T.box("rc" + i, `<p>“${esc(q.ex)}”</p>`, "help sj-sample") : ""}</li>`).join("")}</ol></div>
        <div class="card"><h3 class="tm-h">⚡ Final mini challenge <span class="pill ${n === d.mini.length ? "good" : ""}">${n} / ${d.mini.length}</span></h3>
          ${d.mini.map((x, i) => { const R = A.m[x.id] = A.m[x.id] || {}; const ok = R.ok || R.said;
            return `<div class="sj-mini ${ok ? "ok" : ""}"><p class="tm-q"><span class="tm-qn">${i + 1}</span><span>${esc(x.q)}</span></p>
              <div class="tm-inrow"><input type="text" data-mini="${x.id}" value="${esc(R.val || "")}" placeholder="${esc(x.ph)}" autocomplete="off" aria-label="${esc(x.q)}" ${ok ? "readonly" : ""}>
                ${ok ? `<span class="tm-okmark" aria-hidden="true">✓</span>` : `<button class="btn primary small" type="button" data-mchk="${x.id}">Check ✓</button><button class="btn small ghost" type="button" data-msaid="${x.id}" title="The student said it out loud">🗣 Said it</button>`}</div>
              <div aria-live="polite">${R.msg ? `<div class="note ${ok ? "good" : "amber"} tm-fb">${esc(R.msg)}</div>` : ""}</div></div>`; }).join("")}
        </div>
      </div>
      <div class="card sj-learned"><h3 class="tm-h">Today you practised:</h3><ul>${d.learned.map(x => `<li>✓ ${esc(x)}</li>`).join("")}</ul></div>`;
    ctx.setCTA({ label:"Get your badge 🏅" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const c = e.target.closest("[data-mchk]"); if (c){ const x = d.mini.find(m => m.id === c.dataset.mchk); const R = A.m[x.id]; const inp = $(`[data-mini="${x.id}"]`, el); R.val = inp ? inp.value : R.val;
      const g = miniCheck(x.kind, R.val, les); R.ok = g.st === "ok"; R.msg = g.t; save(); draw(); return; }
    const s = e.target.closest("[data-msaid]"); if (s){ const R = A.m[s.dataset.msaid]; R.said = true; R.msg = "🗣 Said out loud — great!"; save(); draw(); }
  };
  el.oninput = e => { const k = e.target.dataset && e.target.dataset.mini; if (k){ A.m[k] = A.m[k] || {}; A.m[k].val = e.target.value; save(); } };
  el.onkeydown = e => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.mini){ e.preventDefault(); const b = $(`[data-mchk="${e.target.dataset.mini}"]`, el); if (b) b.click(); } };
  draw();
}, { label: () => "Mission report" });

/* ============================================================
   sjCertificate — бейдж FASHION DETECTIVE, сертифікат (друк), анонс Unit 3
   data: { next:{k,title,lines} }
   ============================================================ */
function studentName(){
  const u = S.user; const m = (u && u.user_metadata) || {};
  return String(m.full_name || m.name || m.first_name || (S.state && S.state.name) || "").trim();
}
define("sjCertificate", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "cert");
  if (A.name == null) A.name = studentName();
  const c = CASE(ctx); const ev = Object.keys(c.ev).length;
  const date = new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
  el.innerHTML = `${caseBar(ctx)}
    <div class="sj-badgewrap"><div class="sj-badge ${reduced() ? "" : "spin"}" role="img" aria-label="Badge: Fashion Detective"><span class="sj-badge-ring"></span><span class="sj-badge-i" aria-hidden="true">🧥🔎</span></div>
      <h2 class="stitle sj-badge-t" id="stitle" tabindex="-1">FASHION DETECTIVE</h2><p class="sj-badge-s">You solved the mystery of 1998!</p></div>
    <article class="sj-cert" aria-label="Certificate">
      <span class="sj-cert-k">The Signal · Unit 2 · In fashion</span>
      <h3>Certificate of Investigation</h3>
      <p class="sj-cert-p">This is to certify that</p>
      <input class="sj-cert-name" type="text" id="cn" value="${esc(A.name)}" placeholder="Your name" aria-label="Your name on the certificate" autocomplete="off">
      <p class="sj-cert-p">solved <b>The Secret in the Jacket</b> and earned the title</p>
      <p class="sj-cert-title">Fashion Detective 🧥🔎</p>
      <ul class="sj-cert-facts"><li>🗂 Evidence: <b>${ev} / 4</b></li><li>🔐 Box code: <b>${c.digits[1] != null && c.digits[2] != null && c.digits[3] != null ? les.code : "—"}</b></li><li>📅 ${esc(date)}</li></ul>
      <div class="sj-cert-sig"><span>The Signal team</span><span class="sj-stamp" aria-hidden="true">CASE<br>CLOSED</span></div>
    </article>
    <div class="row" style="justify-content:center"><button class="btn" type="button" data-print>🖨 Print / save the certificate</button></div>
    <div class="sj-teaser"><span>${esc(d.next.k)}</span><b>${esc(d.next.title)}</b>${d.next.lines.map(l => `<p>${esc(l)}</p>`).join("")}<div class="sj-tbc">TO BE CONTINUED…</div></div>`;
  ctx.setCTA({ label:"Finish lesson ✅" });
  el.oninput = e => { if (e.target.id === "cn"){ A.name = e.target.value; save(); } };
  el.onclick = e => { if (e.target.closest("[data-print]")){ document.body.classList.add("sj-printing"); const off = () => { document.body.classList.remove("sj-printing"); window.removeEventListener("afterprint", off); }; window.addEventListener("afterprint", off); try { window.print(); } catch(err){ off(); } } };
}, { label: () => "Certificate" });

})();
