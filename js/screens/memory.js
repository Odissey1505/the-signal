/* ============================================================
   THE SIGNAL — бібліотека екранів «The Fashion Time Machine» (Unit 2 · Lesson 5)
   ------------------------------------------------------------
   Детективна історія про 1998 рік: фото, щоденник, докази, дошка, інтерв'ю.
   Типи: tmDesk · tmPhotoTalk · tmWardrobe · tmWear · tmDiary · tmDiscover · tmFile ·
         tmCheck · tmPages · tmRepair · tmAdverbs · tmNight · tmBoard · tmTell ·
         tmBuild · tmInterview · tmAboutYou · tmExit · tmJacket
   Тема — css/memory.css (body[data-episode-theme="memory"]).
   Спільний стан розслідування (докази, нагороди) — у ans._case епізоду.
   Урок перелічує екрани у функції screens(add, st).
   Підключається в index.html після js/screens/fashion.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
if (!S || !P) return;
const { $, $$, esc, reduced, onCleanup, save, sayBtn, toast } = S;
const define = P.define;

/* ---------- helpers ---------- */
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const plain = s => String(s || "").replace(/\*\*/g, "").replace(/_{3,}/g, " blank ").replace(EMO, "").replace(/\s+/g, " ").trim();
const say = (t, l) => sayBtn(plain(t), l);
const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/_{3,}/g, `<span class="tm-gap"><span class="sr-only">blank</span></span>`);
const art = () => window.SignalArt || null;
const LETTER = i => String.fromCharCode(65 + i);
const scrollTo = (node, block) => { if (node) later(() => node.scrollIntoView({ block: block || "nearest", behavior: reduced() ? "auto" : "smooth" }), 60); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* кнопки-перемикачі (переклад, приклад, підказка) — стан живе, поки відкритий екран */
function Toggles(){
  const open = new Set();
  return {
    btn(id, label, cls){ const on = open.has(id); return `<button class="tm-tog ${cls || ""} ${on ? "on" : ""}" type="button" data-tog="${id}" aria-expanded="${on}" aria-controls="${id}">${label}</button>`; },
    box(id, html, cls){ return `<div class="tm-hide ${cls || ""}" id="${id}" ${open.has(id) ? "" : "hidden"}>${html}</div>`; },
    handle(e, el){
      const b = e.target.closest("[data-tog]"); if (!b) return false;
      const id = b.dataset.tog; const show = !open.has(id);
      show ? open.add(id) : open.delete(id);
      const box = el.querySelector("#" + id); if (box) box.hidden = !show;
      el.querySelectorAll(`[data-tog="${id}"]`).forEach(x => { x.classList.toggle("on", show); x.setAttribute("aria-expanded", String(show)); });
      return true;
    },
    reset(){ open.clear(); }
  };
}
const UA = "Пояснення українською 🇺🇦", UAQ = "🇺🇦 Translation", EXAMPLE = "💡 Need an example?", HINT = "💡 Show hint";

/* ---------- стан розслідування: докази й нагороди ---------- */
const CASE = ctx => { const c = ctx.all._case = ctx.all._case || {}; c.clues = c.clues || {}; c.badges = c.badges || {}; return c; };
const BADGES = {
  clue: ["🔎", "Clue Discovered"], grammar: ["🔍", "Grammar Detective"], memory: ["🧠", "Memory Restored"],
  timeline: ["🕵️", "Timeline Solved"], mystery: ["🔐", "Mystery Unlocked"]
};
function unlockClue(ctx, n){ const c = CASE(ctx); if (c.clues[n]) return false; c.clues[n] = Date.now(); if (!c.badges.clue) c.badges.clue = Date.now(); save(); return true; }
function earn(ctx, id){ const c = CASE(ctx); if (c.badges[id]) return false; c.badges[id] = Date.now(); save(); return true; }
const badgeChip = id => `<div class="tm-earned ix-reveal" role="status"><span aria-hidden="true">${BADGES[id][0]}</span><b>${BADGES[id][1]}</b><span class="tm-earned-k">achievement unlocked</span></div>`;
function clueCard(les, n, o){
  o = o || {}; const c = les.clues[n];
  return `<div class="tm-clue ${o.fresh ? "fresh" : ""} ${o.mini ? "mini" : ""}"><span class="tm-clue-k">Clue #${n}</span><p>${esc(c.t)}</p>${o.mini ? "" : `<small>${esc(c.from)}</small>`}</div>`;
}

/* ---------- верхня смуга сцени: урок, сцена N з 9, докази, довідник дієслів ---------- */
function caseBar(ctx){
  const les = ctx.les, st = ctx.scr.stage, n = les.stages.length, c = CASE(ctx);
  const found = Object.keys(c.clues).length;
  const verbs = st.n >= 4;
  return `<div class="tm-bar">
      <span class="tm-bar-t">Lesson 5 — ${esc(les.title)}</span>
      <span class="tm-bar-scene"><b>Scene ${st.n} of ${n}</b><span class="tm-dots" aria-hidden="true">${les.stages.map(s => `<i class="${s.n < st.n ? "past" : s.n === st.n ? "on" : ""}"></i>`).join("")}</span></span>
      <span class="tm-bar-clues" title="Clues found: ${found} of 4"><span class="tm-slots" aria-hidden="true">${[1, 2, 3, 4].map(k => `<i class="${c.clues[k] ? "on" : ""}"></i>`).join("")}</span>${found}/4 clues</span>
      ${verbs ? `<button class="tm-verbs-btn" type="button" data-verbs aria-expanded="false" aria-controls="tm-vp">📖 Verb list</button>` : ""}
    </div>
    ${verbs ? `<div class="tm-verbpanel" id="tm-vp" hidden>${verbTable(les)}</div>` : ""}`;
}
function verbTable(les){
  return `<table class="tm-vtable"><caption>Irregular verbs</caption><thead><tr><th scope="col">Base form</th><th scope="col">Past Simple</th><th scope="col">Ukrainian</th></tr></thead>
    <tbody>${(les.irregular || []).map(r => `<tr><td>${esc(r[0])}</td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table>`;
}
if (typeof document !== "undefined") document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-verbs]"); if (!b) return;
  const p = document.getElementById("tm-vp"); if (!p) return;
  p.hidden = !p.hidden; b.setAttribute("aria-expanded", String(!p.hidden)); b.classList.toggle("on", !p.hidden);
});
const sceneHead = (ctx, intro) => `${caseBar(ctx)}<h2 class="stitle tm-title" id="stitle" tabindex="-1">${esc(ctx.scr.stage.title)}</h2>${intro ? `<p class="tm-intro">${esc(intro)}</p>` : ""}`;

/* ---------- запитання з вибором (повторні спроби, підказка, «Show answer») ---------- */
function mcq(id, q, R, o){
  o = o || {}; R = R || {};
  const wrong = R.wrong || []; const done = R.ok || R.shown;
  let fb = "";
  if (R.ok) fb = `<div class="note good tm-fb">✓ ${esc(q.why || "Correct!")}${q.ua && o.T ? " " + o.T.btn("ua-" + id, UA, "ua") : ""}</div>${q.ua && o.T ? o.T.box("ua-" + id, `<p>${esc(q.ua)}</p>`, "tm-uabox") : ""}`;
  else if (R.shown) fb = `<div class="note info tm-fb">The answer is <b>${fmt(q.o[q.a])}</b>. ${esc(q.why || "")}</div>`;
  else if (wrong.length) fb = `<div class="note amber tm-fb">Not quite! ${esc(q.hint || "Try again.")} <button class="btn small link" type="button" data-show="${id}">Show answer</button></div>`;
  return `<div class="tm-mcq ${o.cls || ""} ${done ? "done" : ""}" data-qid="${id}">
    ${o.noQ ? "" : `<div class="tm-qrow"><p class="tm-q">${o.num ? `<span class="tm-qn">${o.num}</span>` : ""}<span>${fmt(q.q)}</span></p>${say(q.q.replace(/_{3,}/g, " blank "), "Listen to the question")}</div>`}
    <div class="tm-opts ${q.o.length === 2 ? "two" : ""}">${q.o.map((x, k) => {
      let cls = ""; if (done && k === q.a) cls = "good"; else if (wrong.includes(k)) cls = "bad";
      return `<button class="opt tm-opt ${cls}" type="button" data-opt="${id}:${k}" ${done || wrong.includes(k) ? "disabled" : ""}><b class="tm-letter" aria-hidden="true">${LETTER(k)}</b><span>${fmt(x)}</span></button>`;
    }).join("")}</div>
    <div aria-live="polite">${fb}</div>
  </div>`;
}
/* get(id) → { q, R }; повертає id, якщо клік стосувався запитання */
function mcqClick(e, get){
  const b = e.target.closest("[data-opt]");
  if (b){
    const parts = b.dataset.opt.split(":"); const k = +parts.pop(); const id = parts.join(":");
    const x = get(id); if (!x) return false; const R = x.R;
    if (R.ok || R.shown) return id;
    if (k === x.q.a){ R.ok = true; R.first = !(R.wrong && R.wrong.length); }
    else { R.wrong = (R.wrong || []).concat(k); }
    save(); return id;
  }
  const s = e.target.closest("[data-show]");
  if (s){ const x = get(s.dataset.show); if (x){ x.R.shown = true; save(); return s.dataset.show; } }
  return false;
}
const mcqDone = R => !!(R && (R.ok || R.shown));

/* ---------- перевірка написаного речення ---------- */
const norm = s => String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/\bdid not\b/g, "didn't").replace(/\bdo not\b/g, "don't").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
function grade(item, val, common){
  const v = norm(val);
  if (!v) return { st:"empty", t:"Write the sentence first." };
  if ((item.accept || []).some(re => re.test(v))) return { st:"ok" };
  const alt = (item.alt || []).find(a => a.re.test(v)); if (alt) return { st:"alt", t:alt.t };
  const h = (item.hints || []).concat(common || []).find(x => x.re.test(v));
  return { st:"no", t: h ? h.t : (item.hint || "Not quite! Try again.") };
}
function textRow(id, item, R, o){
  o = o || {}; R = R || {};
  const done = R.ok || R.shown || R.said;
  let fb = "";
  if (R.ok) fb = `<div class="note good tm-fb">✓ ${R.alt ? esc(R.alt) : esc(item.why || "Correct!")}</div>`;
  else if (R.said) fb = `<div class="note good tm-fb">🗣 Said out loud. ${o.showKey ? `Key: <b>${esc(item.answer)}</b>` : ""}</div>`;
  else if (R.shown) fb = `<div class="note info tm-fb">Answer: <b>${esc(item.answer)}</b>. ${esc(item.why || "")}</div>`;
  else if (R.msg) fb = `<div class="note amber tm-fb">${esc(R.msg)} ${R.tries ? `<button class="btn small link" type="button" data-tshow="${id}">Show answer</button>` : ""}</div>`;
  const val = R.val != null ? R.val : (o.start || "");
  return `<div class="tm-text ${done ? "done" : ""}" data-tid="${id}">
    <div class="tm-inrow"><input type="text" id="in-${id}" data-tin="${id}" value="${esc(R.shown && !R.ok ? item.answer : val)}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(o.label || "Your answer")}" placeholder="${esc(o.ph || "")}" ${done ? "readonly" : ""}>
      ${done ? `<span class="tm-okmark" aria-hidden="true">${R.ok || R.said ? "✓" : "·"}</span>` : `<button class="btn primary small" type="button" data-tcheck="${id}">Check ✓</button>`}
      ${o.said && !done ? `<button class="btn small ghost" type="button" data-tsaid="${id}" title="The student said it correctly out loud">🗣 Said it</button>` : ""}</div>
    <div aria-live="polite">${fb}</div>
  </div>`;
}
/* get(id) → { item, R }; повертає id, якщо клік стосувався поля */
function textClick(e, el, get, common){
  const c = e.target.closest("[data-tcheck]");
  if (c){ const id = c.dataset.tcheck; const x = get(id); if (!x) return false; const inp = el.querySelector(`[data-tin="${id}"]`);
    const val = inp ? inp.value : ""; x.R.val = val; const g = grade(x.item, val, common);
    if (g.st === "ok" || g.st === "alt"){ x.R.ok = true; x.R.first = !x.R.tries; x.R.alt = g.st === "alt" ? g.t : null; x.R.msg = null; }
    else { if (g.st !== "empty") x.R.tries = (x.R.tries || 0) + 1; x.R.msg = g.t; }
    save(); return id; }
  const s = e.target.closest("[data-tshow]"); if (s){ const x = get(s.dataset.tshow); if (x){ x.R.shown = true; save(); return s.dataset.tshow; } }
  const d = e.target.closest("[data-tsaid]"); if (d){ const x = get(d.dataset.tsaid); if (x){ x.R.said = true; save(); return d.dataset.tsaid; } }
  return false;
}
const textDone = R => !!(R && (R.ok || R.shown || R.said));

/* ---------- чат: повідомлення й поступова поява ---------- */
const MONO = { dad:"D", unknown:"?" };
function ava(les, who){
  const c = les.characters[who] || {};
  if (c.img) return `<span class="tm-ava">${S.face(c, { zoom:1.9 })}</span>`;
  return `<span class="tm-ava mono who-${who}" aria-hidden="true">${MONO[who] || esc((c.name || "?")[0])}</span>`;
}
function msgHTML(les, m){
  if (m.sys) return `<div class="tm-sys">${esc(m.sys)}</div>`;
  const c = les.characters[m.who] || { name:m.who };
  return `<div class="tm-msg who-${m.who} ${m.fwd ? "fwd" : ""}">${ava(les, m.who)}<div class="tm-bub">${m.fwd ? `<span class="tm-fwdl">↪ Marko forwarded a message</span>` : ""}<b class="tm-name">${esc(c.name)}</b><span>${esc(m.t)}</span></div></div>`;
}
const threadHTML = (les, list) => list.map(m => msgHTML(les, m)).join("");
function playThread(box, les, items, o){
  o = o || {}; let k = 0, alive = true; onCleanup(() => { alive = false; });
  const scroll = () => { const s = o.scroller || box; if (s.scrollHeight > s.clientHeight) s.scrollTop = s.scrollHeight; };
  const step = () => {
    if (!alive || (o.stopped && o.stopped())) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const m = items[k++];
    if (m.sys){ box.insertAdjacentHTML("beforeend", msgHTML(les, m)); scroll(); later(step, 450); return; }
    const t = document.createElement("div"); t.className = "tm-typing";
    t.innerHTML = `<span class="tm-tdots" aria-hidden="true"><i></i><i></i><i></i></span>${esc((les.characters[m.who] || {}).name || "")} is typing…`;
    box.appendChild(t); scroll();
    later(() => { if (!alive || (o.stopped && o.stopped())) return; t.remove(); box.insertAdjacentHTML("beforeend", msgHTML(les, m)); scroll(); if (o.each) o.each(m); later(step, 600); }, Math.min(1500, 600 + String(m.t || "").length * 14));
  };
  later(step, o.delay || 350);
}

/* ============================================================
   АРТ: фото 1998, касета, квиток, щоденник, куртка, тато, іконки
   ============================================================ */
let PH = 0;
function photoSVG(label){
  const i = "tmp" + (++PH);
  const face = (x, y, rx, ry, skin) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${skin}"/><ellipse cx="${x - rx * .25}" cy="${y - ry * .3}" rx="${rx * .5}" ry="${ry * .38}" fill="#FFF3E2" opacity=".35"/>
    <path d="M${x - rx * .5},${y - 1} q${rx * .17},-4 ${rx * .34},0 M${x + rx * .16},${y - 1} q${rx * .17},-4 ${rx * .34},0" fill="none" stroke="#3A2218" stroke-width="2" stroke-linecap="round" opacity=".8"/>
    <path d="M${x - rx * .38},${y + ry * .35} q${rx * .38},${ry * .3} ${rx * .76},0" fill="#F7E6DA" stroke="#5A2E22" stroke-width="1.6" stroke-linecap="round"/>`;
  return `<svg class="tm-photo-svg" viewBox="0 0 300 300" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${i}bg" cx=".5" cy=".38" r=".8"><stop offset="0" stop-color="#7A3E52"/><stop offset=".5" stop-color="#3A2244"/><stop offset="1" stop-color="#120F24"/></radialGradient>
      <radialGradient id="${i}fl" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#FFF7E8" stop-opacity=".5"/><stop offset="1" stop-color="#FFF7E8" stop-opacity="0"/></radialGradient>
      <radialGradient id="${i}vg" cx=".5" cy=".5" r=".72"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <pattern id="${i}pl" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#B86A79"/><rect width="14" height="5" fill="#8C3E52" opacity=".75"/><rect width="5" height="14" fill="#8C3E52" opacity=".55"/><path d="M0,10 H14 M10,0 V14" stroke="#F1D6C2" stroke-width=".9" opacity=".5"/></pattern>
      <pattern id="${i}dn" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0,1 H6 M0,4 H6" stroke="#fff" stroke-opacity=".12"/></pattern>
      <filter id="${i}gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .44  0 0 0 0 .38  0 0 0 .26 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${i}bl"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="${i}bl2"><feGaussianBlur stdDeviation="1.4"/></filter>
    </defs>
    <rect width="300" height="300" fill="url(#${i}bg)"/>
    <g filter="url(#${i}bl)" opacity=".85">${[[30, 40, "#FFD08A"], [70, 22, "#9EE6E2"], [118, 36, "#FFD08A"], [196, 26, "#FFB3C0"], [244, 44, "#FFD08A"], [282, 20, "#9EE6E2"], [12, 96, "#FFB3C0"], [292, 104, "#FFD08A"]].map(b => `<circle cx="${b[0]}" cy="${b[1]}" r="7" fill="${b[2]}"/>`).join("")}</g>
    <!-- Emma -->
    <g filter="url(#${i}bl2)"><ellipse cx="78" cy="138" rx="36" ry="52" fill="#24161C"/>
      <path d="M34,300 L40,206 Q46,178 78,172 Q110,178 116,206 L120,300 Z" fill="url(#${i}pl)"/>
      <path d="M64,176 L78,196 L92,176" fill="none" stroke="#F3E3D6" stroke-width="3"/>
      ${face(78, 134, 21, 25, "#E8BA9C")}<path d="M56,128 Q60,100 80,102 Q100,104 102,126 Q90,112 78,114 Q64,114 56,128Z" fill="#24161C"/><path d="M62,162 Q78,170 94,162" fill="none" stroke="#111" stroke-width="3"/></g>
    <!-- Alex -->
    <g filter="url(#${i}bl2)"><path d="M184,300 L188,208 Q194,180 226,174 Q258,180 264,208 L268,300 Z" fill="#B3262E"/>
      <path d="M206,184 Q226,196 246,184 L244,177 Q226,188 208,177 Z" fill="#8E1C24"/>
      ${face(226, 140, 21, 25, "#6B4430")}<path d="M204,132 Q205,108 226,106 Q247,108 248,132 Z" fill="#141A28"/><path d="M200,131 Q186,128 180,134 Q196,138 206,134 Z" fill="#141A28"/></g>
    <!-- Dad (centre, arms up) -->
    <g><path d="M128,190 L102,84 L116,78 L142,186 Z" fill="#5C82B8"/><path d="M128,190 L102,84 L116,78 L142,186 Z" fill="url(#${i}dn)"/>
      <path d="M172,190 L198,84 L184,78 L158,186 Z" fill="#5C82B8"/><path d="M172,190 L198,84 L184,78 L158,186 Z" fill="url(#${i}dn)"/>
      <ellipse cx="108" cy="72" rx="10" ry="12" fill="#7A4B32"/><ellipse cx="192" cy="72" rx="10" ry="12" fill="#7A4B32"/>
      <path d="M106,300 L110,206 Q116,178 150,174 Q184,178 190,206 L194,300 Z" fill="#5C82B8"/><path d="M106,300 L110,206 Q116,178 150,174 Q184,178 190,206 L194,300 Z" fill="url(#${i}dn)"/>
      <path d="M138,178 L162,178 L160,300 L140,300 Z" fill="#F2EFE6"/>
      <path d="M124,214 h18 v14 h-18 z M158,214 h18 v14 h-18 z" fill="none" stroke="#D9A05B" stroke-width="1.2" stroke-dasharray="3 2"/>
      <g transform="rotate(-8 176 248)"><rect x="166" y="238" width="20" height="20" rx="3" fill="#C0392B"/><path d="M171,254 l5,-11 l5,11 z" fill="#FFF3C4"/></g>
      ${face(150, 136, 22, 26, "#7A4B32")}
      <path d="M126,120 L131,100 Q150,93 169,100 L174,120 Z" fill="#E9E2CF"/><path d="M112,120 Q150,109 188,120 Q190,129 150,130 Q110,129 112,120 Z" fill="#DCD2B9"/></g>
    <rect width="300" height="300" fill="url(#${i}fl)"/>
    <rect width="300" height="300" fill="#F2C987" opacity=".12" style="mix-blend-mode:multiply"/>
    <rect width="300" height="300" fill="#fff" filter="url(#${i}gr)"/>
    <rect width="300" height="300" fill="url(#${i}vg)"/>
    <text x="22" y="284" font-family="'Courier New',monospace" font-weight="700" font-size="15" fill="#FF8A2A" opacity=".92" letter-spacing="1">'98 11 21</text>
  </svg>`;
}
function photo(les, o){
  o = o || {}; const m = les.media || {};
  const label = m.photoAlt || "An old photo from 1998";
  const img = m.photo ? `<img src="${esc(m.photo)}" alt="${esc(label)}" decoding="async">` : photoSVG(label);
  return `<figure class="tm-polaroid ${o.cls || ""}" ${o.id ? `id="${o.id}"` : ""} style="--rot:${o.rot == null ? -3 : o.rot}deg"><div class="tm-pimg">${img}<span class="tm-crease" aria-hidden="true"></span></div><figcaption>${o.caption === false ? "" : "Best night ever. 1998."}</figcaption></figure>`;
}
function cassette(o){
  o = o || {};
  const lbl = o.label || "LIVE";
  return `<svg class="tm-tape" viewBox="0 0 200 128" role="img" aria-label="An old cassette tape. The label says: ${esc(lbl)}" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="196" height="124" rx="10" fill="#2B2420"/><rect x="2" y="2" width="196" height="124" rx="10" fill="none" stroke="#17120F" stroke-width="2"/>
    <rect x="16" y="12" width="168" height="66" rx="5" fill="#F5F0E7"/><rect x="16" y="12" width="168" height="12" rx="4" fill="#E99A55"/>
    <text x="28" y="48" font-family="'Patrick Hand','Caveat',cursive" font-size="17" fill="#172033">${esc(lbl)}</text>
    <path d="M28,58 H170 M28,68 H120" stroke="#C9BDA8" stroke-width="1"/>
    <rect x="56" y="40" width="88" height="0" />
    <rect x="50" y="84" width="100" height="26" rx="13" fill="#17120F"/>
    <g fill="none" stroke="#C9BDA8" stroke-width="2"><circle cx="72" cy="97" r="9"/><circle cx="128" cy="97" r="9"/></g>
    <g fill="#C9BDA8"><circle cx="72" cy="97" r="3"/><circle cx="128" cy="97" r="3"/></g>
    <path d="M60,118 L68,108 H132 L140,118" fill="#3A322C"/>
    ${[[10, 10], [190, 10], [10, 118], [190, 118], [100, 120]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#57504A"/>`).join("")}
    <text x="174" y="22" text-anchor="end" font-family="'Special Elite',monospace" font-size="9" fill="#172033">SIDE A</text>
  </svg>`;
}
const ticket = les => { const t = ((les && les.props) || {}).ticket || { event:"Music Festival", stage:"Main Stage", when:"1998", no:"Admit one" };
  return `<div class="tm-ticket" role="img" aria-label="A concert ticket: ${esc(t.event)}, ${esc(t.stage)}, ${esc(t.when)}"><span class="tm-tk-a">${esc(t.event)}</span><b>${esc(t.stage)}</b><span>${esc(t.when)}</span><span class="tm-tk-no">${esc(t.no)}</span></div>`; };
const tapeLabel = (les, extra) => (((les && les.props) || {}).tape || "LIVE").replace(/ — .*/, "") + (extra || " — LIVE");
const notebook = (o) => { o = o || {}; const inner = `<span class="tm-book-band" aria-hidden="true"></span><span class="tm-book-t">Diary</span><span class="tm-book-y">1998</span>`;
  return o.button ? `<button class="tm-book ${o.cls || ""}" type="button" data-diary aria-label="Open Dad's old diary">${inner}</button>` : `<div class="tm-book ${o.cls || ""}" role="img" aria-label="An old diary">${inner}</div>`; };
function jacketArt(label){
  const a = art();
  if (a) return a.piece({ k:"denim", c:"#5C82B8", patch:"#C0392B" }, { label: label || "Dad's old denim jacket with a red patch" });
  return `<svg class="ss-piece" viewBox="0 0 120 120" role="img" aria-label="${esc(label || "A denim jacket")}"><path d="M38,14 L60,20 L82,14 L108,30 L112,100 L92,104 L90,60 L88,110 H32 L30,60 L28,104 L8,100 L12,30 Z" fill="#5C82B8" stroke="#3A5480" stroke-width="2"/><rect x="72" y="58" width="12" height="12" fill="#C0392B" transform="rotate(-8 78 64)"/></svg>`;
}
function dadArt(les, o){
  o = o || {}; const m = les.media || {};
  if (m.dad) return `<img src="${esc(m.dad)}" alt="${esc(m.dadAlt || "Marko's dad")}" decoding="async">`;
  const i = "tmd" + (++PH);
  return `<svg class="tm-dad-svg" viewBox="0 0 400 300" role="img" aria-label="${esc(m.dadAlt || "Marko's dad in the living room")}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="${i}l" cx=".2" cy=".22" r=".75"><stop offset="0" stop-color="#F7C988"/><stop offset=".35" stop-color="#9A5F3D"/><stop offset="1" stop-color="#2A1F24"/></radialGradient>
      <linearGradient id="${i}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2B36A" stop-opacity=".55"/><stop offset=".6" stop-color="#F2B36A" stop-opacity="0"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#${i}l)"/>
    <path d="M40,0 L64,0 L72,40 L32,40 Z" fill="#F5E2BD" opacity=".9"/><rect x="50" y="40" width="4" height="150" fill="#2A1F24"/>
    <rect x="250" y="40" width="110" height="80" rx="4" fill="#1E1A22" opacity=".7"/><rect x="258" y="48" width="94" height="64" fill="#3A3240" opacity=".8"/>
    <path d="M0,190 Q20,170 70,172 H330 Q380,170 400,190 V300 H0 Z" fill="#48372F"/><path d="M0,236 H400 V300 H0 Z" fill="#3A2C26"/>
    <path d="M150,300 L156,214 Q164,176 206,170 Q248,176 256,214 L262,300 Z" fill="#2C3A52"/>
    <rect x="196" y="150" width="20" height="26" fill="#6E4630"/>
    <ellipse cx="206" cy="126" rx="34" ry="40" fill="#6E4630"/><path d="M172,116 Q172,84 206,82 Q240,84 240,116 Q232,96 206,97 Q180,96 172,116 Z" fill="#2A2420"/><path d="M174,104 Q178,92 186,88 M238,104 Q234,92 226,88" stroke="#9A938C" stroke-width="2.4" fill="none" opacity=".8"/>
    <path d="M186,122 q7,-5 14,0 M212,122 q7,-5 14,0" fill="none" stroke="#2A160C" stroke-width="2.6" stroke-linecap="round"/><path d="M192,144 q14,10 28,0" fill="none" stroke="#5A2E22" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M150,226 Q176,212 196,226 L192,240 Q170,232 154,244 Z" fill="#2C3A52"/>
    <g transform="translate(176,206) rotate(-10)"><rect width="56" height="64" rx="3" fill="#F5F0E7"/><rect x="5" y="5" width="46" height="44" fill="#4A2F45"/><circle cx="28" cy="26" r="9" fill="#D9A07E" opacity=".8"/></g>
    <ellipse cx="174" cy="246" rx="14" ry="10" fill="#6E4630"/>
    <rect width="400" height="300" fill="url(#${i}r)"/>
  </svg>`;
}
function dadFrame(les, o){
  o = o || {};
  return `<figure class="tm-dad ${o.cls || ""}"><div class="tm-dad-img">${dadArt(les)}<span class="tm-live" aria-hidden="true">● video call</span></div><figcaption><b>Marko's dad</b><span>The witness · 17 years old in 1998</span></figcaption></figure>`;
}
const ICON = {
  jacket: `<path d="M8 3l4 2.5L16 3l5 3-1.6 5.5L17 10.6V21H7V10.6l-2.4.9L3 6z"/><path d="M12 5.5V21M9 13h1.8M13.2 13H15"/>`,
  friends: `<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="8.5" r="2.6"/><path d="M2.5 20c.6-4 2.8-6 5.5-6s4.9 2 5.5 6M13 15.2c1-.9 2.2-1.3 3.5-1.3 2.4 0 4.2 1.8 4.8 5.6"/>`,
  music: `<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>`,
  guitar: `<path d="M14.5 9.5L20 4M18 2.5L21.5 6"/><path d="M11.8 8.6c-1.2-.3-2.6.1-3.5 1-.6.6-.8 1.4-1.6 1.7-1.6.6-3.3.8-3.9 2.6-.8 2.3 1 5 3.3 6 2.1.9 4.4.2 5.2-1.6.4-.9.4-1.9 1.2-2.6.6-.5 1.5-.6 2.1-1.2 1.1-1.1 1.3-3 .3-4.4"/><circle cx="9.5" cy="14.5" r="1.4"/>`,
  camera: `<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7l1.5-3h4l1.5 3"/><circle cx="12" cy="13.5" r="3.5"/>`
};
const icon = k => `<svg class="tm-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[k] || ""}</svg>`;
function outfitPic(o, label){
  if (o.img) return `<img class="ss-art ss-img" src="${esc(o.img)}" alt="${esc(o.alt || label)}" decoding="async">`;
  const a = art(); if (a) return a.outfit(o.look, { label: o.alt || label });
  return `<div class="tm-nopic" role="img" aria-label="${esc(o.alt || label)}">${esc(o.cap || label)}</div>`;
}

/* ============================================================
   SCENE 1 · tmDesk — обкладинка-стіл: фото, речі 1998 року й чат Марка
   data: { hero:{kicker,title,emoji,tagline}, chat:[{sys}|{who,t,fwd,unfold}] }
   ============================================================ */
define("tmDesk", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "desk");
  const h = d.hero;
  el.innerHTML = `${caseBar(ctx)}
    <section class="tm-hero">
      <div class="tm-hero-txt"><p class="tm-hero-k">${esc(h.kicker)}</p>
        <h2 class="tm-hero-title" id="stitle" tabindex="-1">${esc(h.title)} <span aria-hidden="true">${h.emoji || ""}</span></h2>
        <p class="tm-hero-tag">${esc(h.tagline)}</p></div>
      <div class="tm-hero-grid">
        <div class="tm-desk">
          <div class="tm-prop tm-prop-jacket" aria-hidden="true">${jacketArt()}</div>
          <div class="tm-prop tm-prop-book">${notebook()}</div>
          <div class="tm-prop tm-prop-tape">${cassette({ label: tapeLabel(les) })}</div>
          <div class="tm-prop tm-prop-ticket">${ticket(les)}</div>
          ${photo(les, { cls: A.unfolded ? "unfolded" : "folded", rot:-4, id:"tm-ph" })}
        </div>
        <div class="tm-phone">
          <div class="tm-phone-head">${ava(les, "marko")}<div><b>Marko</b><small>online</small></div></div>
          <div class="tm-thread" id="th" aria-live="polite"></div>
          <div class="tm-phone-foot"><button class="btn small" type="button" data-replay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-all>Show all</button></div>
        </div>
      </div>
    </section>`;
  const th = $("#th", el), ph = $("#tm-ph", el);
  let gen = 0;
  const unfold = () => { if (!ph) return; ph.classList.remove("folded"); ph.classList.add("unfolded"); if (!A.unfolded){ A.unfolded = true; save(); } };
  const finish = () => { A.seen = true; unfold(); save(); ctx.setCTA({ label:"Help Marko →" }); };
  const all = () => { gen++; th.innerHTML = threadHTML(les, d.chat); th.scrollTop = th.scrollHeight; finish(); };
  const run = () => {
    gen++; const my = gen; th.innerHTML = "";
    if (ph && !A.seen){ ph.classList.add("folded"); ph.classList.remove("unfolded"); }
    ctx.setCTA({ label:"Help Marko →", disabled: !ctx.teacher });
    playThread(th, les, d.chat, { stopped: () => my !== gen, each: m => { if (m.unfold) unfold(); }, done: finish, delay:900 });
  };
  el.onclick = e => {
    if (e.target.closest("[data-all]")){ all(); return; }
    if (e.target.closest("[data-replay]")){ A.seen = false; A.unfolded = false; save(); run(); }
  };
  if (A.seen || reduced()) all(); else run();
}, { label: () => "The photo" });

/* ============================================================
   SCENE 1 · tmPhotoTalk — питання по одному біля фото; наприкінці — щоденник
   data: { qs:[{q,ua,ex}], dadNote }
   ============================================================ */
define("tmPhotoTalk", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "talk");
  const n = d.qs.length; A.i = Math.min(A.i || 0, n - 1);
  const T = Toggles();
  const cta = () => ctx.setCTA({ label:"Open the diary →", disabled: !(A.reached || ctx.teacher) });
  const draw = () => {
    const i = A.i, q = d.qs[i];
    if (i === n - 1) A.reached = true;
    el.innerHTML = `${sceneHead(ctx, "Look closely at the photo. Answer the questions one by one.")}
      <div class="tm-split">
        <div class="tm-split-l">${photo(les, { cls:"unfolded big", rot:-2 })}</div>
        <div class="tm-split-r">
          <div class="card tm-qcard">
            <div class="tm-qtop"><span>Question ${i + 1} of ${n}</span><span class="tm-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</span></div>
            <div class="tm-qrow"><p class="q-big tm-bigq">${esc(q.q)}</p>${say(q.q)}</div>
            <div class="row tm-tools">${T.btn("pt-ex" + i, EXAMPLE)}${q.ua ? T.btn("pt-ua" + i, UAQ, "ua") : ""}</div>
            ${T.box("pt-ex" + i, `<p>“${esc(q.ex)}” ${say(q.ex, "Listen to the example")}</p>`, "help")}
            ${q.ua ? T.box("pt-ua" + i, `<p>${esc(q.ua)}</p>`, "tm-uabox") : ""}
            <div class="row tm-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
          </div>
          ${A.reached ? `<div class="tm-dadnote ix-reveal">
              <div class="tm-thread static">${msgHTML(les, { who:"dad", fwd:true, t:d.dadNote })}</div>
              <div class="tm-diaryopen">${notebook({ button:true, cls:"glow" })}<p>A clickable clue! <b>Tap the diary to open it.</b></p></div>
            </div>` : ""}
        </div>
      </div>`;
    cta();
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-diary]")){ ctx.next(); return; }
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); T.reset(); save(); draw(); if (A.i === n - 1) scrollTo($(".tm-dadnote", el)); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); T.reset(); save(); draw(); }
  };
  draw();
}, { label: () => "4 questions" });

/* ============================================================
   SCENE 2 · tmWardrobe — 4 образи 90-х: обери 2–4 прикметники для кожного
   data: { outfits:[{id,cap,look,img,alt,core,ok,sample}], bank:[..], help:[{w,ua,en,ex}] }
   ============================================================ */
define("tmWardrobe", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, M = store(ctx, scr, "match");
  M.sel = M.sel || {}; M.chk = M.chk || {};
  if (!d.outfits.some(o => o.id === M.cur)) M.cur = d.outfits[0].id;
  const T = Toggles(); let helpOpen = false;
  const verdict = (o, w) => o.core.includes(w) ? "good" : o.ok.includes(w) ? "maybe" : "bad";
  const draw = () => {
    const o = d.outfits.find(x => x.id === M.cur); const sel = M.sel[o.id] || []; const chk = M.chk[o.id];
    const checked = Object.keys(M.chk).length;
    const bad = chk ? sel.filter(w => verdict(o, w) === "bad") : [];
    el.innerHTML = `${sceneHead(ctx, "To understand the photo, we need to understand the clothes. Describe each outfit with 2–4 words from Lesson 4.")}
      <div class="tm-rack" role="tablist" aria-label="Outfits">${d.outfits.map(x => { const s = M.sel[x.id] || [];
        return `<button class="tm-look ${x.id === M.cur ? "on" : ""} ${M.chk[x.id] ? "done" : ""}" type="button" role="tab" aria-selected="${x.id === M.cur}" data-look="${x.id}">
          <span class="tm-look-pic">${outfitPic(x, "Outfit " + x.id)}</span>
          <span class="tm-look-cap"><b>Outfit ${x.id}</b>${M.chk[x.id] ? " ✓" : ""}</span>
          <span class="tm-look-tags">${s.length ? s.map(w => `<i class="${M.chk[x.id] ? verdict(x, w) : ""}">${esc(w)}</i>`).join("") : `<em>${esc(x.cap)}</em>`}</span>
        </button>`; }).join("")}</div>
      <div class="card tm-wpanel">
        <div class="tm-wtop"><p class="tm-q"><span>Describe <b>Outfit ${o.id}</b>: ${esc(o.cap.charAt(0).toLowerCase() + o.cap.slice(1))}.</span></p><span class="pill">${checked} / ${d.outfits.length} described</span></div>
        <div class="chips tm-bank">${d.bank.map(w => { const on = sel.includes(w); let cls = on ? "on" : ""; if (chk && on) cls = verdict(o, w);
          return `<button class="chip tm-chip ${cls}" type="button" data-w="${esc(w)}" aria-pressed="${on}" ${chk ? "disabled" : ""}>${chk && on ? ({ good:"✓ ", maybe:"🤔 ", bad:"✗ " })[verdict(o, w)] : ""}${esc(w)}</button>`; }).join("")}</div>
        ${chk ? `<div class="note ${bad.length ? "amber" : "good"}">${bad.length ? `Hmm — look at Outfit ${o.id} again. Is it really <b>${esc(bad[0])}</b>?` : `✓ Great description! ${sel.some(w => verdict(o, w) === "maybe") ? "🤔 = possible — tell your teacher why." : ""} Now say it in a sentence.`}</div>` : ""}
        <div class="row tm-actions">${chk ? `<button class="btn" type="button" data-again>↻ Change my words</button>` : `<button class="btn primary" type="button" data-check ${sel.length >= 2 ? "" : "disabled"}>Check ✓</button><span class="muted">${sel.length} / 4 chosen</span>`}
          <span class="spacer"></span>${T.btn("wd-s" + o.id, "💡 Possible answer")}<button class="tm-tog ${helpOpen ? "on" : ""}" type="button" data-help aria-expanded="${helpOpen}" aria-controls="tm-help">📚 Vocabulary help</button></div>
        ${T.box("wd-s" + o.id, `<p>“${esc(o.sample)}” ${say(o.sample, "Listen to the answer")}</p>`, "help")}
      </div>
      <div class="tm-help" id="tm-help" ${helpOpen ? "" : "hidden"}><h3 class="tm-h">📚 Vocabulary help · words from Lesson 4</h3>
        <div class="tm-helpgrid">${d.help.map(v => `<div class="tm-hw"><div class="tm-hw-top"><b>${esc(v.w)}</b>${say(v.w + ". " + v.ex, "Listen: " + v.w)}</div><span class="tm-hw-ua">🇺🇦 ${esc(v.ua)}</span><span class="tm-hw-en">${esc(v.en)}</span><span class="tm-hw-ex">“${esc(v.ex)}”</span></div>`).join("")}</div>
      </div>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-help]")){ helpOpen = !helpOpen; draw(); if (helpOpen) scrollTo($("#tm-help", el), "start"); return; }
    const lk = e.target.closest("[data-look]"); if (lk){ M.cur = lk.dataset.look; T.reset(); save(); draw(); return; }
    const w = e.target.closest("[data-w]");
    if (w){ const a = M.sel[M.cur] = M.sel[M.cur] || []; const k = a.indexOf(w.dataset.w);
      if (k >= 0) a.splice(k, 1); else { if (a.length >= 4){ toast("Up to four words for one outfit."); return; } a.push(w.dataset.w); }
      save(); draw(); return; }
    if (e.target.closest("[data-check]")){ const o = d.outfits.find(x => x.id === M.cur); M.chk[M.cur] = true;
      (M.sel[M.cur] || []).forEach(x => S.wordResult(x, verdict(o, x) !== "bad")); save(); draw(); return; }
    if (e.target.closest("[data-again]")){ delete M.chk[M.cur]; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "4 outfits" });

/* ============================================================
   SCENE 2 · tmWear — «Which outfit would you wear?» + доказ №1
   data: { outfits, speak:{q,ua,ex,fu}, clue, match, reply }
   ============================================================ */
function speakCard(id, s, T, o){
  o = o || {};
  return `<div class="card tm-speak">
    <div class="tm-qrow"><p class="q-big tm-bigq">${esc(s.q)}</p>${say(s.q)}</div>
    ${o.extra || ""}
    <div class="row tm-tools">${T.btn(id + "-ex", EXAMPLE)}${s.fu && s.fu.length ? T.btn(id + "-fu", "➕ Follow-up questions") : ""}${s.ua ? T.btn(id + "-ua", UAQ, "ua") : ""}</div>
    ${T.box(id + "-ex", `<p>“${esc(s.ex)}” ${say(s.ex, "Listen to the example")}</p>`, "help")}
    ${s.fu && s.fu.length ? T.box(id + "-fu", `<ul class="tm-fu">${s.fu.map(f => `<li>${esc(f)} ${say(f)}</li>`).join("")}</ul>`, "tm-fubox") : ""}
    ${s.ua ? T.box(id + "-ua", `<p>${esc(s.ua)}</p>`, "tm-uabox") : ""}
    <p class="tm-oral">🗣 Answer out loud — your teacher is listening.</p>
  </div>`;
}
function clueReveal(ctx, d, A, el, after){
  const fresh = unlockClue(ctx, d.clue); A.clue = true; save();
  if (after) after(fresh);
}
define("tmWear", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "wear");
  const T = Toggles(); let fresh = false;
  const draw = () => {
    const A0 = d.outfits[0];
    el.innerHTML = `${sceneHead(ctx, "")}
      ${speakCard("we", d.speak, T, { extra:`<div class="tm-thumbs">${d.outfits.map(o => `<figure>${outfitPic(o, "Outfit " + o.id)}<figcaption>Outfit ${o.id}</figcaption></figure>`).join("")}</div>` })}
      <div id="clue">${A.clue ? `<div class="tm-cluezone ${fresh ? "ix-reveal" : ""}">
          <div class="tm-compare"><figure>${photo(les, { cls:"unfolded small", rot:-5 })}</figure><span class="tm-eq" aria-hidden="true">=</span><figure class="tm-cmp-look">${outfitPic(A0, "Outfit A")}<figcaption>Outfit A</figcaption></figure></div>
          <div class="tm-cluecol"><p class="tm-matchline">${esc(d.match)}</p>${clueCard(les, d.clue, { fresh })}${fresh ? badgeChip("clue") : ""}
            <div class="tm-thread static">${msgHTML(les, d.reply)}</div></div>
        </div>` : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Clue #${d.clue} is hidden in the wardrobe. Talk about the outfits, then reveal it.</p></div>`}</div>`;
    ctx.setCTA(A.clue ? { label:"Continue" } : { label:`Reveal clue #${d.clue} 🔎`, action: reveal });
  };
  const reveal = () => clueReveal(ctx, d, A, el, f => { fresh = f || true; draw(); scrollTo($("#clue", el), "center"); });
  el.onclick = e => { T.handle(e, el); };
  draw();
}, { label: () => "Wear it? · clue 1" });

/* ============================================================
   SCENE 3 · tmDiary — сторінка щоденника; знайди дієслова прямо в тексті
   data: { date, lines:["… [word|tag] …"], tasks:[{id,type:"mcq"|"tap",tag,n,q,ua,o,a,hint,why}], marko }
   ============================================================ */
const TOKEN = /\[([^|\]]+)\|(\w+)\]/g;
function diaryLines(lines, tapping, found, opts){
  opts = opts || {};
  let k = 0;
  return lines.map(line => {
    let out = "", last = 0, m; TOKEN.lastIndex = 0;
    const words = s => s.split(/(\s+)/).map(p => /^\s+$/.test(p) || !p ? p : `<span class="tm-dw" data-dw="${esc(p)}"${tapping ? ` role="button" tabindex="0"` : ""}>${esc(p)}</span>`).join("");
    while ((m = TOKEN.exec(line))){
      out += tapping ? words(line.slice(last, m.index)) : esc(line.slice(last, m.index));
      const key = "k" + (k++); const on = found[m[2]] && found[m[2]].includes(key);
      out += `<span class="tm-dw tgt ${on || opts.all ? "found t-" + m[2] : ""}" data-tag="${m[2]}" data-k="${key}"${tapping ? ` role="button" tabindex="0"` : ""}>${esc(m[1])}</span>`;
      last = m.index + m[0].length;
    }
    out += tapping ? words(line.slice(last)) : esc(line.slice(last));
    return `<p>${out}</p>`;
  }).join("");
}
const diaryText = lines => lines.map(l => l.replace(TOKEN, "$1")).join(" ");
define("tmDiary", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, D = store(ctx, scr, "diary");
  D.i = Math.min(D.i || 0, d.tasks.length - 1); D.found = D.found || {}; D.mcq = D.mcq || {}; D.shown = D.shown || {};
  const T = Toggles(); let nope = null;
  const total = tag => { let n = 0; d.lines.forEach(l => { TOKEN.lastIndex = 0; let m; while ((m = TOKEN.exec(l))) if (m[2] === tag) n++; }); return n; };
  const keysOf = tag => { const out = []; let k = 0; d.lines.forEach(l => { TOKEN.lastIndex = 0; let m; while ((m = TOKEN.exec(l))){ if (m[2] === tag) out.push("k" + k); k++; } }); return out; };
  const taskDone = t => t.type === "mcq" ? mcqDone(D.mcq[t.id]) : (D.shown[t.id] || (D.found[t.tag] || []).length >= total(t.tag));
  const allDone = () => d.tasks.every(taskDone);
  const draw = () => {
    const t = d.tasks[D.i]; const tapping = t.type === "tap" && !taskDone(t);
    const got = t.type === "tap" ? (D.found[t.tag] || []).length : 0;
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}
      <div class="tm-split diary">
        <div class="tm-split-l">
          <article class="tm-diary ${tapping ? "tapping" : ""}" aria-label="Diary page">
            <header><span class="tm-diary-date">${esc(d.date)}</span>${say(diaryText(d.lines), "Listen to the diary page")}</header>
            <div class="tm-diary-body">${diaryLines(d.lines, tapping, D.found)}</div>
          </article>
          ${tapping ? `<p class="tm-taphint" aria-live="polite">${nope ? `🙂 Not <b>${esc(nope)}</b> — try another word.` : "👆 Tap the words in the diary."}</p>` : ""}
        </div>
        <div class="tm-split-r">
          <div class="card tm-qcard">
            <div class="tm-qtop"><span>Task ${D.i + 1} of ${d.tasks.length}</span><span class="tm-steps" aria-hidden="true">${d.tasks.map((x, k) => `<i class="${k === D.i ? "on" : taskDone(x) ? "past" : ""}"></i>`).join("")}</span></div>
            ${t.type === "mcq" ? mcq(t.id, t, D.mcq[t.id] = D.mcq[t.id] || {}, { T, cls:"stack" }) : `
              <div class="tm-qrow"><p class="tm-q"><span>${fmt(t.q)}</span></p>${say(t.q)}</div>
              <div class="tm-count ${taskDone(t) ? "full" : ""}">Found <b>${Math.min(got, t.n)}</b> / ${t.n}</div>
              ${taskDone(t) ? `<div class="note good tm-fb">✓ ${esc(t.why)}</div>` : `<div class="row tm-tools">${T.btn("dh" + t.id, HINT)}<button class="btn small link" type="button" data-dshow="${t.id}">Show answer</button></div>${T.box("dh" + t.id, `<p>${esc(t.hint)}</p>`, "help")}`}`}
            ${t.ua ? `<div class="row tm-tools">${T.btn("du" + t.id, UAQ, "ua")}</div>${T.box("du" + t.id, `<p>${esc(t.ua)}</p>`, "tm-uabox")}` : ""}
            <div class="row tm-nav"><button class="btn" type="button" data-prev ${D.i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${D.i < d.tasks.length - 1 ? `<button class="btn ${taskDone(t) ? "primary" : ""}" type="button" data-next>Next task →</button>` : ""}</div>
          </div>
          ${allDone() ? `<div class="tm-thread static ix-reveal">${msgHTML(les, { who:"marko", t:d.marko })}</div>
            <div class="tm-legend"><span class="t-irr">bought · met · went · took</span><span class="t-ed">listened · played</span><span class="t-neg">didn't feel</span></div>` : ""}
        </div>
      </div>`;
    ctx.setCTA({ label: allDone() ? "Let's investigate the grammar 🔍" : "Continue" });
  };
  const tap = node => {
    const t = d.tasks[D.i]; if (t.type !== "tap" || taskDone(t)) return;
    if (node.dataset.tag === t.tag){ const f = D.found[t.tag] = D.found[t.tag] || []; if (!f.includes(node.dataset.k)) f.push(node.dataset.k); nope = null; save(); draw(); if (taskDone(t)) scrollTo($(".tm-qcard", el)); }
    else { nope = node.textContent.replace(/[.,!?]/g, ""); node.classList.remove("nope"); void node.offsetWidth; node.classList.add("nope"); const h = $(".tm-taphint", el); if (h) h.innerHTML = `🙂 Not <b>${esc(nope)}</b> — try another word.`; }
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const w = e.target.closest(".tm-diary.tapping [data-dw], .tm-diary.tapping .tm-dw.tgt"); if (w){ tap(w); return; }
    const id = mcqClick(e, k => { const t = d.tasks.find(x => x.id === k); return t ? { q:t, R: D.mcq[k] = D.mcq[k] || {} } : null; }); if (id){ draw(); return; }
    const sh = e.target.closest("[data-dshow]"); if (sh){ const t = d.tasks.find(x => x.id === sh.dataset.dshow); D.shown[t.id] = true; D.found[t.tag] = keysOf(t.tag); save(); draw(); return; }
    if (e.target.closest("[data-next]")){ D.i = Math.min(d.tasks.length - 1, D.i + 1); nope = null; T.reset(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ D.i = Math.max(0, D.i - 1); nope = null; T.reset(); save(); draw(); }
  };
  el.onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".tm-diary.tapping .tm-dw")){ e.preventDefault(); tap(e.target.closest(".tm-dw")); } };
  draw();
}, { label: () => "Diary page" });

/* ============================================================
   SCENE 4 · tmDiscover — три речення-докази → чотири питання-відкриття
   data: { examples:[{t}], qs:[{q,o,a,hint,why,ua}] }
   ============================================================ */
define("tmDiscover", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "disc"); A.r = A.r || {};
  const n = d.qs.length; A.i = Math.min(A.i || 0, n - 1);
  const T = Toggles();
  const draw = () => {
    const i = A.i, q = d.qs[i], R = A.r[i] = A.r[i] || {};
    const all = d.qs.every((x, k) => mcqDone(A.r[k]));
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}
      <div class="tm-split">
        <div class="tm-split-l"><ol class="tm-evidence">${d.examples.map((x, k) => `<li class="${i === 1 && R.ok && k === 1 ? "pick" : ""}"><span class="tm-evn">${k + 1}</span><p>${fmt(x.t)}</p>${say(x.t)}</li>`).join("")}</ol></div>
        <div class="tm-split-r"><div class="card tm-qcard">
          <div class="tm-qtop"><span>Question ${i + 1} of ${n}</span><span class="tm-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : mcqDone(A.r[k]) ? "past" : ""}"></i>`).join("")}</span></div>
          ${mcq("dq" + i, q, R, { T, cls:"stack" })}
          <div class="row tm-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn ${mcqDone(R) ? "primary" : ""}" type="button" data-next>Next question →</button>` : ""}</div>
        </div></div>
      </div>
      ${all ? `<div class="card tm-notes ix-reveal"><h3 class="tm-h">🔍 Case notes: what we discovered</h3><ul>${d.qs.map(x => `<li>${esc(x.why)}</li>`).join("")}</ul>
        <div class="row">${T.btn("dn-ua", UA, "ua")}</div>${T.box("dn-ua", `<ul>${d.qs.map(x => `<li>${esc(x.ua)}</li>`).join("")}</ul>`, "tm-uabox")}</div>` : ""}`;
    ctx.setCTA({ label: all ? "Open the grammar file →" : "Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = mcqClick(e, k => { const i = +k.slice(2); return d.qs[i] ? { q:d.qs[i], R: A.r[i] = A.r[i] || {} } : null; });
    if (id){ draw(); if (d.qs.every((x, k) => mcqDone(A.r[k]))) scrollTo($(".tm-notes", el)); return; }
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); T.reset(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); T.reset(); save(); draw(); }
  };
  draw();
}, { label: () => "Discover" });

/* ============================================================
   SCENE 4 · tmFile — «Grammar file»: + / − / ? по одній вкладці, be і time — розгортаються
   data: { file:{ aff, neg, q, be, time } }
   ============================================================ */
define("tmFile", (el, scr, ctx) => {
  const f = scr.data.file, les = ctx.les, F = store(ctx, scr, "file");
  F.tab = F.tab || "aff"; F.seen = F.seen || {}; F.seen[F.tab] = true;
  const T = Toggles();
  const exList = list => `<ul class="tm-exl">${list.map(x => `<li>${fmt(x)} ${say(x)}</li>`).join("")}</ul>`;
  const pairs = (list, cls) => `<ul class="tm-pairs ${cls || ""}">${list.map(p => `<li><span>${esc(p[0])}</span><i aria-hidden="true">→</i><b>${esc(p[1])}</b></li>`).join("")}</ul>`;
  const body = k => {
    const x = f[k];
    let inner = "";
    if (k === "aff") inner = `<div class="tm-cols"><div><h4>Regular verbs <small>verb + -ed</small></h4>${pairs(x.regular)}</div><div><h4>Irregular verbs <small>learn them!</small></h4>${pairs(x.irregular, "irr")}</div></div>${exList(x.ex)}`;
    if (k === "neg") inner = `${exList(x.ex)}<p class="tm-careful">💡 ${esc(x.note)}</p>`;
    if (k === "q") inner = `${exList(x.ex)}<p class="tm-short"><span>Short answers:</span> <b>${esc(x.short)}</b></p>`;
    return `<div class="tm-ftab t-${k} ix-reveal" role="tabpanel" id="ft-${k}"><div class="tm-formula"><span class="tm-sign" aria-hidden="true">${x.sign}</span><b>${esc(x.rule)}</b></div>${inner}
      <div class="row tm-tools">${T.btn("fu-" + k, UA, "ua")}</div>${T.box("fu-" + k, `<p>${esc(x.ua)}</p>`, "tm-uabox")}</div>`;
  };
  const draw = () => {
    el.innerHTML = `${sceneHead(ctx, "The case file on the Past Simple. Open one part at a time.")}
      <div class="tm-file">
        <div class="tm-ftabs" role="tablist" aria-label="Past Simple">${["aff", "neg", "q"].map(k => `<button class="tm-ftb t-${k} ${F.tab === k ? "on" : ""}" type="button" role="tab" aria-selected="${F.tab === k}" aria-controls="ft-${k}" data-ft="${k}"><span aria-hidden="true">${f[k].sign}</span>${esc(f[k].title)}${F.seen[k] ? " ✓" : ""}</button>`).join("")}</div>
        ${body(F.tab)}
      </div>
      <div class="tm-more">
        <details class="tm-det"><summary>Past Simple of <b>be</b>: was / were</summary>
          <table class="tm-vtable be"><tbody>${f.be.rows.map(r => `<tr><td>${esc(r[0])}</td><td><b>${esc(r[1])}</b></td><td><b>${esc(r[2])}</b></td></tr>`).join("")}</tbody></table>
          ${exList(f.be.ex)}<p class="tm-careful">💡 ${esc(f.be.note)}</p><p class="tm-ualine">🇺🇦 ${esc(f.be.ua)}</p></details>
        <details class="tm-det"><summary>Past time expressions</summary>
          <ul class="tm-timex">${f.time.items.map(t => `<li><b>${esc(t[0])}</b><span>${esc(t[1])}</span></li>`).join("")}</ul><p class="tm-ualine">🇺🇦 ${esc(f.time.ua)}</p></details>
        <details class="tm-det"><summary>Irregular verbs (10)</summary>${verbTable(les)}<p class="muted">This list is always open with <b>📖 Verb list</b> at the top of the screen.</p></details>
      </div>`;
    ctx.setCTA({ label:"Quick check →" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const b = e.target.closest("[data-ft]"); if (b){ F.tab = b.dataset.ft; F.seen[F.tab] = true; T.reset(); save(); draw(); }
  };
  el.onkeydown = e => {
    const b = e.target.closest && e.target.closest("[data-ft]"); if (!b || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    const ks = ["aff", "neg", "q"]; const k = ks[(ks.indexOf(b.dataset.ft) + (e.key === "ArrowRight" ? 1 : 2)) % 3];
    F.tab = k; F.seen[k] = true; save(); draw(); const nb = $(`[data-ft="${k}"]`, el); if (nb) nb.focus();
  };
  draw();
}, { label: () => "Grammar file" });

/* ============================================================
   SCENE 4 · tmCheck — три швидкі питання → доказ №2
   data: { qs, clue, reply }
   ============================================================ */
define("tmCheck", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "check"); A.r = A.r || {};
  const T = Toggles(); let fresh = false;
  const all = () => d.qs.every((x, k) => mcqDone(A.r[k]));
  const draw = () => {
    const ok = d.qs.filter((x, k) => A.r[k] && A.r[k].ok).length;
    el.innerHTML = `${sceneHead(ctx, "Three quick questions. Get them right to unlock the next clue.")}
      <div class="tm-checkgrid">${d.qs.map((q, k) => `<div class="card">${mcq("ck" + k, q, A.r[k] = A.r[k] || {}, { num:k + 1, T })}</div>`).join("")}</div>
      <div id="clue">${all() ? `<div class="tm-cluezone solo ${fresh ? "ix-reveal" : ""}">${clueCard(les, d.clue, { fresh })}<div>${fresh ? badgeChip("grammar") : `<div class="tm-earned quiet"><span aria-hidden="true">🔍</span><b>Grammar Detective</b></div>`}<div class="tm-thread static">${msgHTML(les, d.reply)}</div></div></div>`
        : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>${ok} / ${d.qs.length} — clue #${d.clue} opens when all three are done.</p></div>`}</div>`;
    ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = mcqClick(e, k => { const i = +k.slice(2); return d.qs[i] ? { q:d.qs[i], R: A.r[i] = A.r[i] || {} } : null; });
    if (id){
      if (all()){ fresh = unlockClue(ctx, d.clue); if (earn(ctx, "grammar")) fresh = true; }
      draw(); if (all()) scrollTo($("#clue", el), "center");
    }
  };
  draw();
}, { label: () => "Check · clue 2" });

/* ============================================================
   SCENE 5 · tmPages — чотири пошкоджені сторінки (вибір відповіді)
   data: { mission:{title,text}, pages:[{q,o,a,hint,why}] }
   ============================================================ */
const restoredCount = ctx => { const m = ctx.all.memories || {}; const p = (m.pages && m.pages.r) || {}, r = (m.repair && m.repair.r) || {};
  return Object.values(p).filter(mcqDone).length + Object.values(r).filter(textDone).length; };
const missionBanner = (ctx, mi) => `<div class="tm-mission"><span class="tm-mission-k">Mission</span><b>${esc(mi.title)}</b><p>${esc(mi.text)}</p><span class="tm-mission-n" aria-live="polite">🧠 ${restoredCount(ctx)} / 6 memories restored</span></div>`;
define("tmPages", (el, scr, ctx) => {
  const d = scr.data, A = store(ctx, scr, "pages"); A.r = A.r || {};
  const T = Toggles();
  const draw = () => {
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}${missionBanner(ctx, d.mission)}
      <div class="tm-pages">${d.pages.map((q, k) => { const R = A.r[k] = A.r[k] || {}; return `<div class="tm-page ${mcqDone(R) ? "restored" : ""}" style="--tilt:${[-1.2, .9, -.6, 1.1][k % 4]}deg">${mcqDone(R) ? `<span class="tm-stamp" aria-hidden="true">Restored</span>` : ""}${mcq("pg" + k, q, R, { num:k + 1, T })}</div>`; }).join("")}</div>`;
    ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => { if (T.handle(e, el)) return; const id = mcqClick(e, k => { const i = +k.slice(2); return d.pages[i] ? { q:d.pages[i], R: A.r[i] = A.r[i] || {} } : null; }); if (id) draw(); };
  draw();
}, { label: () => "4 pages" });

/* ============================================================
   SCENE 5 · tmRepair — виправ два речення → доказ №3 і касета
   data: { items:[{id,wrong,answer,accept,hints,why}], clue, reply }
   ============================================================ */
define("tmRepair", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "repair"); A.r = A.r || {};
  let fresh = false;
  const all = () => d.items.every(x => textDone(A.r[x.id]));
  const draw = () => {
    const mi = (les.stages.find(s => s.id === "memories") || {}).mission || { title:"Restore Dad's lost memories", text:"" };
    el.innerHTML = `${sceneHead(ctx, "Two sentences have mistakes. Repair them — write the correct sentence.")}${missionBanner(ctx, mi)}
      <div class="tm-repairs">${d.items.map((x, k) => { const R = A.r[x.id] = A.r[x.id] || {}; return `<div class="card tm-repair ${textDone(R) ? "restored" : ""}">
          <p class="tm-broken"><span class="tm-qn">${k + 5}</span><span class="tm-torn">${esc(x.wrong)}</span>${say(x.wrong)}</p>
          ${textRow(x.id, x, R, { start:x.wrong, label:"Write the correct sentence", said:true })}</div>`; }).join("")}</div>
      <div id="clue">${all() ? `<div class="tm-cluezone ${fresh ? "ix-reveal" : ""}"><div class="tm-tapebox">${cassette({ label: tapeLabel(les) })}<p>A cassette falls out of the diary…</p></div>
          <div class="tm-cluecol">${clueCard(les, d.clue, { fresh })}${fresh ? badgeChip("memory") : ""}<div class="tm-thread static">${msgHTML(les, d.reply)}</div></div></div>`
        : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Repair both sentences to unlock clue #${d.clue}.</p></div>`}</div>`;
    ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => {
    const id = textClick(e, el, k => { const x = d.items.find(i => i.id === k); return x ? { item:x, R: A.r[k] = A.r[k] || {} } : null; });
    if (id){
      if (all()){ if (unlockClue(ctx, d.clue)) fresh = true; if (earn(ctx, "memory")) fresh = true; }
      draw(); if (all()) scrollTo($("#clue", el), "center"); else { const inp = $(`[data-tin="${id}"]`, el); if (inp && !inp.readOnly) inp.focus(); }
    }
  };
  el.oninput = e => { const t = e.target.dataset && e.target.dataset.tin; if (t){ const R = A.r[t] = A.r[t] || {}; R.val = e.target.value; save(); } };
  el.onkeydown = e => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.tin){ e.preventDefault(); const b = $(`[data-tcheck="${e.target.dataset.tin}"]`, el); if (b) b.click(); } };
  draw();
}, { label: () => "Repair · clue 3" });

/* ============================================================
   SCENE 6 · tmAdverbs — прикметник vs прислівник, таблиця, правила
   data: { pairs:[{kind,rule,ex,ua}], table:[[adj,adv,ua]], rules:[{t,ex}] }
   ============================================================ */
define("tmAdverbs", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const T = Toggles();
  const inBank = () => (les.vocab || []).every(v => S.state.words[v.w] && S.state.words[v.w].added);
  const draw = () => {
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}
      <div class="tm-contrast">${d.pairs.map(p => `<div class="tm-cbox k-${p.kind}"><span class="tm-ckind">${p.kind === "adverb" ? "Adverb" : "Adjective"}</span><p class="tm-crule">${esc(p.rule)}</p><p class="tm-cex"><span>${fmt(p.ex)}</span>${say(p.ex)}</p><small>${p.kind === "adverb" ? "How did they play?" : "What was the music like?"}</small></div>`).join(`<span class="tm-carrow" aria-hidden="true">→</span>`)}</div>
      <div class="row tm-tools">${T.btn("av-ua", UA, "ua")}</div>${T.box("av-ua", d.pairs.map(p => `<p>${esc(p.ua)}</p>`).join(""), "tm-uabox")}
      <div class="tm-split adv">
        <div class="tm-split-l"><table class="tm-vtable adv"><caption>Adjective → adverb</caption><thead><tr><th scope="col">Adjective</th><th scope="col">Adverb</th><th scope="col">Ukrainian</th><th scope="col"><span class="sr-only">Listen</span></th></tr></thead>
          <tbody>${d.table.map(r => `<tr><td>${esc(r[0])}</td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td><td>${say(r[1], "Listen: " + r[1])}</td></tr>`).join("")}</tbody></table>
          <button class="btn small addword ${inBank() ? "on" : ""}" type="button" data-addadv>${inBank() ? "✓ In My words" : "+ Add 6 adverbs to My words"}</button></div>
        <div class="tm-split-r"><ul class="tm-rules">${d.rules.map(r => `<li><p>${fmt(r.t)}</p><span>${esc(r.ex)}</span></li>`).join("")}</ul></div>
      </div>`;
    ctx.setCTA({ label:"Describe the night →" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-addadv]")){ (les.vocab || []).forEach(v => S.addWord(v.w)); toast("6 adverbs added to My words"); draw(); }
  };
  draw();
}, { label: () => "Adverbs" });

/* ============================================================
   SCENE 6 · tmNight — чотири речення-«треки» з касети + уява
   data: { qs, speak, marko }
   ============================================================ */
define("tmNight", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "night"); A.r = A.r || {};
  const T = Toggles();
  const all = () => d.qs.every((x, k) => mcqDone(A.r[k]));
  const draw = () => {
    el.innerHTML = `${sceneHead(ctx, "The tape plays the night again. Choose the right word for each track.")}
      <div class="tm-tracks"><div class="tm-tracks-head">${cassette({ label: tapeLabel(les, " — the night") })}<p>Side A · 4 tracks</p></div>
        <ol class="tm-tracklist">${d.qs.map((q, k) => `<li class="${mcqDone(A.r[k]) ? "done" : ""}">${mcq("nt" + k, q, A.r[k] = A.r[k] || {}, { num:k + 1, cls:"inline" })}</li>`).join("")}</ol></div>
      ${speakCard("ns", d.speak, T)}
      ${all() ? `<div class="tm-thread static ix-reveal">${msgHTML(les, { who:"marko", t:d.marko })}</div>` : ""}`;
    ctx.setCTA({ label: all() ? "Open the investigation 🕵️" : "Continue" });
  };
  el.onclick = e => { if (T.handle(e, el)) return; const id = mcqClick(e, k => { const i = +k.slice(2); return d.qs[i] ? { q:d.qs[i], R: A.r[i] = A.r[i] || {} } : null; }); if (id) draw(); };
  draw();
}, { label: () => "The night" });

/* ============================================================
   SCENE 7 · tmBoard — дошка розслідування: впорядкуй 5 подій
   data: { events:[{id,t,time,icon}], start:[ids], diary:stage }
   ============================================================ */
define("tmBoard", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, B = store(ctx, scr, "board");
  const ids = d.events.map(x => x.id);
  if (!Array.isArray(B.order) || B.order.length !== ids.length || ids.some(x => !B.order.includes(x))) B.order = (d.start || shuffle(ids)).slice();
  B.tries = B.tries || 0;
  let sel = null, msg = null, evOpen = false, fresh = false;
  const ev = id => d.events.find(x => x.id === id);
  const right = () => B.order.filter((id, i) => id === ids[i]).length;
  const draw = () => {
    const solved = !!B.solved;
    el.innerHTML = `${sceneHead(ctx, "")}
      <div class="tm-board ${solved ? "solved" : ""}">
        <div class="tm-board-top">
          <div><b class="tm-board-title">${solved ? "Timeline restored!" : "The events are out of order!"}</b><p>${solved ? `This is exactly what happened on ${esc(d.night)}.` : `Use the diary clues to rebuild the night of ${esc(d.night)}.`}</p></div>
          <button class="tm-tog ${evOpen ? "on" : ""}" type="button" data-evid aria-expanded="${evOpen}" aria-controls="tm-evid">📓 Diary evidence</button>
        </div>
        <div class="tm-evidpanel" id="tm-evid" ${evOpen ? "" : "hidden"}><span class="tm-diary-date">${esc(d.diary.date)}</span>${diaryLines(d.diary.lines, false, {}, {})}</div>
        <ol class="tm-evs" aria-label="Timeline, from earliest to latest">${B.order.map((id, i) => { const x = ev(id);
          return `<li class="tm-ev ${sel === id ? "sel" : ""}" data-ev="${id}" draggable="${solved ? "false" : "true"}" style="--i:${i}">
            <span class="tm-pin" aria-hidden="true"></span>
            <span class="tm-evpos">${i + 1}</span>
            <span class="tm-evicon">${icon(x.icon)}</span>
            <p class="tm-evt">${esc(x.t)}</p>
            <span class="tm-evtime ${solved ? "shown" : ""}">${solved ? esc(x.time) : "?:?? p.m."}</span>
            ${solved ? "" : `<span class="tm-evmv"><button class="tm-mv" type="button" data-mv="${id}:-1" ${i === 0 ? "disabled" : ""} aria-label="Move “${esc(x.t)}” earlier">←</button><button class="tm-mv" type="button" data-pick="${id}" aria-pressed="${sel === id}" aria-label="${sel === id ? "Selected — tap another card to swap" : "Select to swap"}">⇄</button><button class="tm-mv" type="button" data-mv="${id}:1" ${i === ids.length - 1 ? "disabled" : ""} aria-label="Move “${esc(x.t)}” later">→</button></span>`}
          </li>`; }).join("")}</ol>
      </div>
      <div aria-live="polite">${solved ? `<div class="tm-restored ${fresh ? "ix-reveal" : ""}"><span class="tm-stamp big">Timeline restored!</span>${fresh ? badgeChip("timeline") : ""}</div>` : msg ? `<div class="note amber">${esc(msg)}</div>` : ""}</div>
      ${solved ? "" : `<div class="row tm-actions"><button class="btn primary big" type="button" data-bcheck>Check the timeline ✓</button><button class="btn ghost" type="button" data-breset>↺ Shuffle again</button><span class="muted tm-tip">Drag a card, use the arrows, or tap ⇄ on two cards to swap them.</span></div>`}`;
    ctx.setCTA({ label: solved ? "Tell the story →" : "Continue" });
  };
  const move = (id, dir) => { const i = B.order.indexOf(id), j = i + dir; if (j < 0 || j >= B.order.length) return; [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; msg = null; save(); draw(); const b = $(`[data-mv="${id}:${dir}"]`, el) || $(`[data-pick="${id}"]`, el); if (b) b.focus(); };
  const swap = (a, b) => { const i = B.order.indexOf(a), j = B.order.indexOf(b); [B.order[i], B.order[j]] = [B.order[j], B.order[i]]; sel = null; msg = null; save(); draw(); };
  el.onclick = e => {
    if (e.target.closest("[data-evid]")){ evOpen = !evOpen; draw(); return; }
    if (B.solved) return;
    const mv = e.target.closest("[data-mv]"); if (mv){ const [id, dir] = mv.dataset.mv.split(":"); move(id, +dir); return; }
    const pk = e.target.closest("[data-pick]"); if (pk){ const id = pk.dataset.pick; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } return; }
    const card = e.target.closest("[data-ev]"); if (card && !e.target.closest("button")){ const id = card.dataset.ev; if (sel && sel !== id) swap(sel, id); else { sel = sel === id ? null : id; draw(); } return; }
    if (e.target.closest("[data-bcheck]")){
      B.tries++;
      if (right() === ids.length){ B.solved = true; fresh = earn(ctx, "timeline"); msg = null; }
      else msg = `The timeline is not quite right. Look at the diary again! (${right()} of ${ids.length} cards are in the right place.)`;
      save(); draw(); return;
    }
    if (e.target.closest("[data-breset]")){ let o; do { o = shuffle(ids); } while (o.every((x, i) => x === ids[i])); B.order = o; sel = null; msg = null; save(); draw(); }
  };
  let dragId = null;
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (!c || B.solved) return; dragId = c.dataset.ev; c.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", dragId); e.dataTransfer.effectAllowed = "move"; } catch(err){} };
  el.ondragover = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (c && dragId){ e.preventDefault(); $$(".tm-ev.over", el).forEach(x => x !== c && x.classList.remove("over")); c.classList.add("over"); } };
  el.ondragleave = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (c && !c.contains(e.relatedTarget)) c.classList.remove("over"); };
  el.ondrop = e => { const c = e.target.closest && e.target.closest("[data-ev]"); if (!c || !dragId) return; e.preventDefault();
    const to = c.dataset.ev; if (to !== dragId){ const from = B.order.indexOf(dragId); B.order.splice(from, 1); const j = B.order.indexOf(to); B.order.splice(from <= j ? j + 1 : j, 0, dragId); msg = null; save(); }
    dragId = null; draw(); };
  el.ondragend = () => { dragId = null; $$(".tm-ev", el).forEach(x => x.classList.remove("dragging", "over")); };
  draw();
}, { label: () => "The board" });

/* ============================================================
   SCENE 7 · tmTell — розкажи, що сталося (First / Then …) → доказ №4
   data: { events, tell:{q,ua,frames,ex}, clue, reply }
   ============================================================ */
define("tmTell", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "tell");
  const T = Toggles(); let fresh = false;
  const draw = () => {
    el.innerHTML = `${sceneHead(ctx, "")}
      <ol class="tm-mini-tl" aria-label="The night of ${esc(d.night)}">${d.events.map(x => `<li><span class="tm-evicon">${icon(x.icon)}</span><b>${esc(x.time)}</b><span>${esc(x.t)}</span></li>`).join("")}</ol>
      ${speakCard("tl", { q:d.tell.q, ua:d.tell.ua, ex:d.tell.ex }, T, { extra:`<p class="tm-frames">${d.tell.frames.map(f => `<span class="starter">${esc(f)}</span>`).join("")}</p>` })}
      <div id="clue">${A.clue ? `<div class="tm-cluezone solo ${fresh ? "ix-reveal" : ""}">${clueCard(les, d.clue, { fresh })}<div class="tm-thread static">${msgHTML(les, d.reply)}</div></div>`
        : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Tell the story first. Then reveal clue #${d.clue}.</p></div>`}</div>`;
    ctx.setCTA(A.clue ? { label:"Interview Dad →" } : { label:`Reveal clue #${d.clue} 🔎`, action: () => clueReveal(ctx, d, A, el, f => { fresh = !!f || true; draw(); scrollTo($("#clue", el), "center"); }) });
  };
  el.onclick = e => { T.handle(e, el); };
  draw();
}, { label: () => "Tell it · clue 4" });

/* ============================================================
   SCENE 8 · tmBuild — склади питання до тата з підказок
   data: { items:[{id,p:[..],answer,accept,alt,hints,subject}], hints:[common], subjNote }
   ============================================================ */
define("tmBuild", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "build"); A.r = A.r || {};
  const T = Toggles();
  const draw = () => {
    const done = d.items.filter(x => textDone(A.r[x.id])).length;
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}
      <div class="tm-split interview">
        <div class="tm-split-l">${dadFrame(les)}<p class="tm-role">🎤 <b>You</b> are the detective. Your teacher is <b>Dad</b>. First, prepare your questions.</p><div class="tm-count ${done === d.items.length ? "full" : ""}">Questions ready: <b>${done}</b> / ${d.items.length}</div></div>
        <div class="tm-split-r"><ol class="tm-builds">${d.items.map((x, k) => { const R = A.r[x.id] = A.r[x.id] || {}; return `<li class="tm-build ${textDone(R) ? "ok" : ""}">
            <p class="tm-prompt"><span class="tm-qn">${k + 1}</span>${x.p.map(w => `<span class="tm-pw">${esc(w)}</span>`).join(`<i aria-hidden="true">/</i>`)}${x.subject ? `<span class="pill amber">special</span>` : ""}</p>
            ${textRow(x.id, x, R, { label:"Question " + (k + 1), ph:"Write the question…", said:true, showKey:true })}
            ${x.subject ? `<div class="row tm-tools">${T.btn("sb", "💡 Why no did?")}</div>${T.box("sb", `<p>${d.subjNote}</p>`, "help")}` : ""}
          </li>`; }).join("")}</ol></div>
      </div>`;
    ctx.setCTA({ label: done === d.items.length ? "Start the interview 🎤" : "Continue" });
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const id = textClick(e, el, k => { const x = d.items.find(i => i.id === k); return x ? { item:x, R: A.r[k] = A.r[k] || {} } : null; }, d.hints);
    if (id){ draw(); const nx = d.items.find(x => !textDone(A.r[x.id])); const inp = nx && $(`[data-tin="${nx.id}"]`, el); if (inp && nx.id !== id) inp.focus({ preventScroll:false }); else { const same = $(`[data-tin="${id}"]`, el); if (same && !same.readOnly) same.focus(); } }
  };
  el.oninput = e => { const t = e.target.dataset && e.target.dataset.tin; if (t){ const R = A.r[t] = A.r[t] || {}; R.val = e.target.value; save(); } };
  el.onkeydown = e => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.tin){ e.preventDefault(); const b = $(`[data-tcheck="${e.target.dataset.tin}"]`, el); if (b) b.click(); } };
  draw();
}, { label: () => "Questions" });

/* ============================================================
   SCENE 8 · tmInterview — рольова гра: учень питає, учитель (тато) відповідає
   data: { talk:[{q,a,bonus}] }
   ============================================================ */
define("tmInterview", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "talk"); A.open = A.open || {};
  const draw = (last) => {
    const n = Object.keys(A.open).length;
    el.innerHTML = `${sceneHead(ctx, "Ask Dad your questions out loud. Dad answers — then tap to see his answer on the screen.")}
      <div class="tm-split interview">
        <div class="tm-split-l">${dadFrame(les, { cls:"big" })}<div class="tm-count ${n === d.talk.length ? "full" : ""}">Answers: <b>${n}</b> / ${d.talk.length}</div><button class="btn small ghost" type="button" data-allans>${n === d.talk.length ? "Hide all answers" : "Reveal all answers"}</button></div>
        <div class="tm-split-r"><ol class="tm-talk">${d.talk.map((x, k) => `<li class="${A.open[k] ? "open" : ""} ${x.bonus ? "bonus" : ""}">
            <div class="tm-ask"><span class="tm-qn">${x.bonus ? "★" : k + 1}</span><p>${x.bonus ? `<small>Bonus question</small>` : ""}${esc(x.q)}</p>${say(x.q)}</div>
            ${A.open[k] ? `<div class="tm-thread static ${last === k ? "ix-reveal" : ""}">${msgHTML(les, { who:"dad", t:x.a })}</div>` : `<button class="btn small tm-reveal" type="button" data-ans="${k}">Reveal Dad's answer</button>`}
          </li>`).join("")}</ol></div>
      </div>`;
    ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => {
    const b = e.target.closest("[data-ans]"); if (b){ A.open[b.dataset.ans] = true; save(); draw(+b.dataset.ans); return; }
    if (e.target.closest("[data-allans]")){ const all = Object.keys(A.open).length === d.talk.length; A.open = {}; if (!all) d.talk.forEach((x, k) => A.open[k] = true); save(); draw(); }
  };
  draw();
}, { label: () => "Interview" });

/* ============================================================
   SCENE 8 · tmAboutYou — три особисті питання → повідомлення тата
   data: { qs:[{q,ua,fu,ex,note}], end:[msgs] }
   ============================================================ */
define("tmAboutYou", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "you");
  const n = d.qs.length; A.i = Math.min(A.i || 0, n - 1);
  const T = Toggles(); let played = false;
  const draw = () => {
    const i = A.i, q = d.qs[i]; if (i === n - 1) A.reached = true;
    el.innerHTML = `${sceneHead(ctx, "Now it's your turn. The detective answers the questions! 🙂")}
      <div class="card tm-qcard wide">
        <div class="tm-qtop"><span>About you · ${i + 1} of ${n}</span><span class="tm-steps" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</span></div>
        <div class="tm-qrow"><p class="q-big tm-bigq">${esc(q.q)}</p>${say(q.q)}</div>
        ${q.note ? `<p class="tm-careful">💡 ${esc(q.note)}</p>` : ""}
        <div class="row tm-tools">${T.btn("ay-fu" + i, "➕ Follow-up question")}${T.btn("ay-ex" + i, "💡 Sample answer")}${T.btn("ay-ua" + i, UAQ, "ua")}</div>
        ${T.box("ay-fu" + i, `<ul class="tm-fu">${q.fu.map(f => `<li>${esc(f)} ${say(f)}</li>`).join("")}</ul>`, "tm-fubox")}
        ${T.box("ay-ex" + i, `<p>“${esc(q.ex)}” ${say(q.ex, "Listen to the sample")}</p>`, "help")}
        ${T.box("ay-ua" + i, `<p>${esc(q.ua)}</p>`, "tm-uabox")}
        <p class="tm-oral">🗣 Answer out loud in the Past Simple.</p>
        <div class="row tm-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>
      <div class="tm-phone slim ${A.reached ? "" : "hidden-phone"}" ${A.reached ? "" : "hidden"}><div class="tm-thread" id="end" aria-live="polite"></div></div>`;
    ctx.setCTA({ label:"The final discovery 🔐" });
    if (A.reached){
      const box = $("#end", el);
      if (A.endSeen || reduced() || played) box.innerHTML = threadHTML(les, d.end);
      else { played = true; playThread(box, les, d.end, { delay:500, done: () => { A.endSeen = true; save(); } }); scrollTo(box.parentNode, "center"); }
    }
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-next]")){ A.i = Math.min(n - 1, A.i + 1); T.reset(); save(); draw(); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); T.reset(); save(); draw(); }
  };
  draw();
}, { label: () => "About you" });

/* ============================================================
   SCENE 9 · tmExit — три завдання → MISSION COMPLETED + підсумок
   data: { tasks:{fill,choose,speak}, done:{title,text}, learned:[..] }
   ============================================================ */
define("tmExit", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "exit");
  A.fill = A.fill || {}; A.choose = A.choose || {};
  const T = Toggles(); let fresh = false;
  const tk = d.tasks;
  const ready = () => textDone(A.fill) && mcqDone(A.choose);
  const draw = () => {
    const c = CASE(ctx); const board = (ctx.all.timeline && ctx.all.timeline.board) || {};
    el.innerHTML = `${sceneHead(ctx, ctx.scr.stage.intro)}
      <div class="tm-wall" aria-label="Everything you found">
        <div class="tm-wall-photo">${photo(les, { cls:"unfolded small", rot:-6 })}</div>
        <div class="tm-wall-clues">${[1, 2, 3, 4].map(k => c.clues[k] ? clueCard(les, k, { mini:true }) : `<div class="tm-clue mini off"><span class="tm-clue-k">Clue #${k}</span><p>Not found yet</p></div>`).join("")}</div>
        <div class="tm-wall-jacket" aria-hidden="true">${jacketArt()}</div>
        <ol class="tm-wall-tl ${board.solved ? "solved" : ""}" aria-label="The timeline">${(les.stages.find(s => s.id === "timeline").events).map(x => `<li><b>${esc(x.time)}</b>${icon(x.icon)}</li>`).join("")}</ol>
      </div>
      <div class="tm-exits">
        <div class="card"><p class="tm-q"><span class="tm-qn">1</span><span>Complete: ${fmt(tk.fill.q)}</span></p>${textRow("fill", tk.fill, A.fill, { label:"The missing verb", ph:"…" })}</div>
        <div class="card">${mcq("choose", tk.choose, A.choose, { num:2, T })}</div>
        <div class="card"><p class="tm-q"><span class="tm-qn">3</span><span>${esc(tk.speak.q)}</span></p>${say(tk.speak.q)}
          <div class="row tm-tools">${T.btn("ex-id", "💡 Ideas")}${A.said ? `<span class="pill good">✓ Your teacher heard it</span>` : `<button class="btn small" type="button" data-said>🗣 ✓ Said it</button>`}</div>
          ${T.box("ex-id", `<ul class="tm-fu">${tk.speak.ideas.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`, "help")}</div>
      </div>
      <div id="done">${ready() ? `<div class="tm-complete ${fresh ? "ix-reveal" : ""}">
          <h3>${esc(d.done.title)}</h3><p>${esc(d.done.text)}</p>
          <div class="tm-badges">${Object.keys(BADGES).map(k => `<span class="tm-badge ${c.badges[k] ? "on" : ""}"><span aria-hidden="true">${BADGES[k][0]}</span>${BADGES[k][1]}</span>`).join("")}</div>
          <div class="tm-learned"><h4>Today you learned to:</h4><ul>${d.learned.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>` : `<div class="tm-locked"><span aria-hidden="true">🔒</span><p>Finish tasks 1 and 2 to complete the mission.</p></div>`}</div>`;
    ctx.setCTA({ label:"See what Marko found →" });
  };
  const maybeDone = () => { if (ready()){ if (earn(ctx, "mystery")) fresh = true; } };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-said]")){ A.said = true; save(); draw(); return; }
    const id = mcqClick(e, k => k === "choose" ? { q:tk.choose, R:A.choose } : null)
      || textClick(e, el, k => k === "fill" ? { item:tk.fill, R:A.fill } : null);
    if (id){ maybeDone(); draw(); if (ready()) scrollTo($("#done", el), "start"); }
  };
  el.oninput = e => { if (e.target.dataset && e.target.dataset.tin === "fill"){ A.fill.val = e.target.value; save(); } };
  el.onkeydown = e => { if (e.key === "Enter" && e.target.dataset && e.target.dataset.tin){ e.preventDefault(); const b = $(`[data-tcheck="${e.target.dataset.tin}"]`, el); if (b) b.click(); } };
  draw();
}, { label: () => "Exit ticket" });

/* ============================================================
   SCENE 9 · tmJacket — фінал (темний): куртка → папірець у кишені →
   невідомий відправник → TO BE CONTINUED → анонс уроку 6
   data: { scene, smile, pocket, paper, buzz, msgs:[..], marko, tbc, next:{k,title,lines} }
   ============================================================ */
define("tmJacket", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, A = store(ctx, scr, "jacket");
  el.innerHTML = `<div class="story-screen tm-end">
      <p class="tm-endline" id="l1">${esc(d.scene)}</p>
      <div class="tm-endjacket" id="jk"><div class="tm-jk">${jacketArt("Dad's old denim jacket")}</div>
        <button class="tm-pocket" type="button" data-pocket disabled aria-label="Check the pocket"><span aria-hidden="true">👆</span></button>
        <div class="tm-paper" id="pp" hidden aria-hidden="true"><span></span></div></div>
      <p class="tm-endline" id="l2" hidden>${esc(d.smile)}</p>
      <p class="tm-endline" id="l3" hidden>${esc(d.pocket)} <b class="tm-tapme" id="tapme" hidden>Tap the pocket.</b></p>
      <p class="tm-endline" id="l4" hidden>${esc(d.paper)}</p>
      <p class="tm-endline" id="l5" hidden>${esc(d.buzz)} <span class="tm-buzz" aria-hidden="true">📱</span></p>
      <div class="tm-unk" id="unk" hidden><div class="tm-unk-head"><span class="tm-ava mono who-unknown" aria-hidden="true">?</span><div><b id="stitle" tabindex="-1">UNKNOWN SENDER</b><small>no number</small></div></div><div class="tm-thread" id="ut" aria-live="polite"></div></div>
      <div class="tm-blackout" id="bo" hidden></div>
      <div class="tm-tbc" id="tbc" hidden>${esc(d.tbc)}</div>
      <div class="tm-next" id="nx" hidden><span>${esc(d.next.k)}</span><b>${esc(d.next.title)}</b>${d.next.lines.map(l => `<p>${esc(l)}</p>`).join("")}</div>
    </div>`;
  const anim = !reduced() && !A.seen;
  let alive = true; onCleanup(() => { alive = false; });
  const show = id => { const n = $("#" + id, el); if (n){ n.hidden = false; n.classList.add("ix-reveal"); } return n; };
  const wait = (ms, fn) => later(() => { if (alive) fn(); }, anim ? ms : 0);
  const msgs = d.msgs.concat([d.marko]);
  const end = () => {
    A.seen = true; save();
    show("bo"); wait(900, () => { show("tbc"); wait(900, () => { show("nx"); ctx.setCTA({ label:"Finish lesson ✅" }); if (anim) scrollTo($("#nx", el), "center"); }); });
  };
  const afterPocket = () => {
    const jk = $("#jk", el); jk.classList.add("opened"); show("pp"); $("#tapme", el).hidden = true; $(".tm-pocket", el).disabled = true;
    wait(900, () => show("l4"));
    wait(2000, () => { show("l5"); jk.classList.add("buzzing");
      wait(1400, () => { show("unk"); const ut = $("#ut", el);
        if (anim){ scrollTo($("#unk", el), "center"); playThread(ut, les, msgs, { delay:500, stopped: () => !alive, done: () => later(end, 1200) }); }
        else { ut.innerHTML = threadHTML(les, msgs); end(); } }); });
  };
  ctx.setCTA({ label:"Finish lesson ✅", disabled: !ctx.teacher });
  if (!anim){
    ["l2", "l3"].forEach(show); A.pocket = true; afterPocket();
  } else {
    wait(1200, () => show("l2"));
    wait(2600, () => { show("l3"); const p = $(".tm-pocket", el); p.disabled = false; p.classList.add("pulse"); $("#tapme", el).hidden = false; scrollTo($("#jk", el), "center"); });
  }
  el.onclick = e => {
    const p = e.target.closest("[data-pocket]"); if (!p || p.disabled) return;
    A.pocket = true; save(); afterPocket();
  };
}, { story:true, label: () => "The jacket" });

})();
