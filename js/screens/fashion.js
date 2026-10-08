/* ============================================================
   THE SIGNAL — бібліотека екранів «Style & Music» (Unit 2 · In fashion)
   ------------------------------------------------------------
   Типи екранів для уроків про одяг, стиль і музику (урок один на один):
   styleCover · questionDeck · styleChat · pairCard · oppositesGame ·
   outfitDetective · outfitPredict · eraCards · eraMatch · timelineRead ·
   timelineBuild · timeMachine · outfitBuilder · pairRecap · photoReveal · greatJob
   Малюнки одягу — js/art/wardrobe.js (SignalArt).
   Урок перелічує екрани у функції screens(add, st).
   Відповіді зберігаються в ans етапу під ключем data.store (або стандартним).
   Підключається в index.html після js/screens/story.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
const { $, $$, esc, reduced, onCleanup, save, sayBtn, toast } = S;
const head = P.head;
const define = P.define;

/* ---------- helpers ---------- */
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const art = () => window.SignalArt || { outfit: () => "", piece: () => "", oldPhoto: () => "", photoBack: () => "" };
const look = (spec, label) => art().outfit(spec, { label });
const say = (t, l) => sayBtn(String(t).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "").trim(), l);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const order = (Q, key, ids) => { if (!Array.isArray(Q[key]) || Q[key].length !== ids.length || ids.some(x => !Q[key].includes(x))){ Q[key] = shuffle(ids); save(); } return Q[key]; };
const LETTER = i => String.fromCharCode(65 + i);
const face = (les, id, z) => les.characters && les.characters[id] ? S.face(les.characters[id], { zoom: z || 1.9 }) : "";

/* цільові слова уроку: пошук у тексті й підсвічування */
const wordRe = w => new RegExp("\\b" + w.replace(/[-\s]+/g, "[-\\s]?") + "\\b", "i");
const targets = (les, text) => { const t = String(text || ""); return (les.vocab || []).map(v => v.w).filter(w => wordRe(w).test(t)); };
const pairNo = (les, w) => { const p = (les.pairs || []).findIndex(x => x.includes(w)); return p < 0 ? 0 : p + 1; };
function highlight(les, text){
  const words = (les.vocab || []).map(v => v.w).sort((a, b) => b.length - a.length);
  if (!words.length) return esc(text);
  const re = new RegExp("\\b(" + words.map(w => w.replace(/[-\s]+/g, "[-\\s]?")).join("|") + ")\\b", "gi");
  return esc(text).replace(re, m => { const w = words.find(x => wordRe(x).test(m) && m.length >= x.length - 1) || m; return `<mark class="ss-w p${pairNo(les, w)}">${m}</mark>`; });
}

/* кнопки-перемикачі: UA / Need an idea? / Answer — стан живе, поки відкритий екран */
function Toggles(){
  const open = new Set();
  return {
    btn(id, label, cls){ const on = open.has(id); return `<button class="ss-tog ${cls || ""} ${on ? "on" : ""}" type="button" data-tog="${id}" aria-expanded="${on}" aria-controls="${id}">${label}</button>`; },
    box(id, html, cls){ return `<div class="ss-hide ${cls || ""}" id="${id}" ${open.has(id) ? "" : "hidden"}>${html}</div>`; },
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
const UA = "🇺🇦 Translation", IDEA = "💡 Need an idea?", ANS = "💡 Possible answer";

/* реакції вчителя (не оцінки): показуються великою «бульбашкою» на екрані */
const REACT = ["Great answer! 🌟", "Nice idea! 💡", "Tell me more. 💬", "Why do you think so? 🤔", "Can you use one of today's new words? 👕"];
const reactRow = (cur) => `<div class="ss-react" role="group" aria-label="Teacher feedback">${REACT.map((r, k) => `<button class="ss-rbtn ${cur === k ? "on" : ""}" type="button" data-react="${k}">${esc(r)}</button>`).join("")}</div>${cur != null ? `<div class="ss-rbubble" aria-live="polite">${esc(REACT[cur])}</div>` : ""}`;

/* лічильник цільових слів */
function wordMeter(les, text, need){
  const used = targets(les, text);
  return `<div class="ss-meter ${need && used.length >= need ? "full" : ""}"><b>Target words used: ${used.length}${need ? " / " + need : ""}</b>
    <div class="ss-wlist">${(les.vocab || []).map(v => `<span class="ss-wchip p${pairNo(les, v.w)} ${used.includes(v.w) ? "on" : ""}">${used.includes(v.w) ? "✓ " : ""}${esc(v.w)}</span>`).join("")}</div></div>`;
}

/* ============================================================
   styleCover — відкриття нового розділу (журнальна обкладинка)
   data: { unit, lesson, title, emoji, sub, today:[{e,t}], cast:[{id,cap,rot}], img, imgAlt, cta }
   img — необов'язкова картинка (assets/…); без неї — колаж із фото персонажів
   ============================================================ */
define("styleCover", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les;
  const collage = d.img ? `<img class="ss-cover-img" src="${d.img}" alt="${esc(d.imgAlt || "")}" decoding="async">`
    : `<div class="ss-collage" aria-hidden="true">${(d.cast || []).map((p, i) => { const c = les.characters[p.id]; if (!c) return ""; const f = c.face || { x:50, y:40 };
        return `<figure class="ss-pol" style="--r:${p.rot || 0}deg;--i:${i}"><div class="ss-pol-img"><img src="${c.img}" alt="" decoding="async" style="object-position:${f.x}% ${f.y}%"></div><figcaption><b>${esc(c.name)}</b>${esc(p.cap || "")}</figcaption></figure>`; }).join("")}</div>`;
  el.innerHTML = `<section class="ss-cover">
      <div class="ss-cover-top"><span class="ss-unit">${esc(d.unit)}</span><span class="ss-lesson">${esc(d.lesson)}</span></div>
      <h2 class="ss-cover-title" id="stitle" tabindex="-1">${esc(d.title)} <span aria-hidden="true">${d.emoji || ""}</span></h2>
      <p class="ss-cover-sub">${esc(d.sub)}</p>
      ${collage}
    </section>
    <div class="card ss-today"><h3 class="ss-h">Today you will:</h3>
      <ul>${d.today.map((t, i) => `<li style="--i:${i}"><span aria-hidden="true">${t.e}</span>${esc(t.t)}</li>`).join("")}</ul>
    </div>`;
  ctx.setCTA({ label: d.cta || "Start lesson →" });
}, { label: () => "Opening" });

/* ============================================================
   questionDeck — питання по одному: 🔊, переклад, «Need an idea?»,
   follow-up, реакції вчителя; за потреби — вибір образу з галереї
   data: { title, say, ua, kicker, gallery:[{id,label,look,img,alt}], qs:[{q,ua,pick,fu:[..],idea}],
           (img — готова картинка з номером; без неї образ малюється кодом з look)
           phrases:[..], words (лічильник цільових слів у полі відповіді), note }
   ============================================================ */
define("questionDeck", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const A = store(ctx, scr, "deck");
  A.i = Math.min(A.i || 0, d.qs.length - 1); A.pick = A.pick || {}; A.text = A.text || {};
  const T = Toggles(); let react = null;
  const draw = () => {
    const i = A.i, q = d.qs[i], n = d.qs.length;
    const gal = d.gallery ? `<div class="ss-gallery ${q.pick ? "picking" : ""}">${d.gallery.map((g, k) => {
        const on = A.pick[i] === g.id;
        return `<button class="ss-look ${on ? "on" : ""}" type="button" data-look="${g.id}" ${q.pick ? "" : "tabindex=\"-1\""} aria-pressed="${on}" aria-label="Outfit ${k + 1}: ${esc(g.label)}">
          ${g.img ? `<img class="ss-art ss-img" src="${g.img}" alt="${esc(g.alt || g.label)}" decoding="async">` : `<span class="ss-num">${k + 1}</span>${look(g.look, g.label)}`}<span class="ss-cap">${esc(g.label)}</span>${on ? `<span class="ss-yours">Your choice</span>` : ""}</button>`; }).join("")}</div>` : "";
    el.innerHTML = `${head(esc(d.title), d.say || "", d.ua || "", esc(d.kicker || "Speaking"))}
      ${gal}
      <div class="card ss-qcard">
        <div class="ss-qtop"><span class="ss-qn">Question ${i + 1} of ${n}</span><div class="ss-dots" aria-hidden="true">${d.qs.map((x, k) => `<i class="${k === i ? "on" : k < i ? "past" : ""}"></i>`).join("")}</div></div>
        <div class="ss-qrow"><p class="q-big ss-q">${esc(q.q)}</p>${say(q.q)}</div>
        ${q.pick && d.gallery ? `<p class="ss-pickhint">${A.pick[i] ? `Nice choice! <b>Why?</b>` : "Tap an outfit above."}</p>` : ""}
        <div class="row ss-tools">${q.ua ? T.btn("qd-ua" + i, UA, "ua") : ""}${q.idea ? T.btn("qd-id" + i, IDEA) : ""}${q.fu && q.fu.length ? T.btn("qd-fu" + i, "➕ Follow-up questions") : ""}</div>
        ${q.ua ? T.box("qd-ua" + i, `<p>${esc(q.ua)}</p>`, "ss-uabox") : ""}
        ${q.idea ? T.box("qd-id" + i, `<p>${esc(q.idea)} ${say(q.idea, "Listen to the example")}</p>`, "help") : ""}
        ${q.fu && q.fu.length ? T.box("qd-fu" + i, `<ul class="ss-fu">${q.fu.map(f => `<li>${esc(f)} ${say(f)}</li>`).join("")}</ul>`, "ss-fubox") : ""}
        ${d.words ? `<div class="field ss-myans"><label for="qa${i}">My answer <span class="muted">(optional — or just say it)</span></label><input type="text" id="qa${i}" data-ans value="${esc(A.text[i] || "")}" autocomplete="off" placeholder="${esc(d.placeholder || "I think …")}"></div><div id="qm">${wordMeter(les, A.text[i])}</div>` : ""}
        ${reactRow(react)}
        <div class="row ss-nav"><button class="btn" type="button" data-prev ${i === 0 ? "disabled" : ""}>← Previous</button><span class="spacer"></span>${i < n - 1 ? `<button class="btn primary" type="button" data-next>Next question →</button>` : `<span class="pill good">✓ Last question</span>`}</div>
      </div>
      ${d.phrases ? `<div class="card ss-phr"><h3 class="ss-h">💬 Useful language</h3><p>${d.phrases.map(p => `<span class="starter">${esc(p)}</span>`).join("")}</p></div>` : ""}`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const lk = e.target.closest("[data-look]");
    if (lk && d.qs[A.i].pick){ A.pick[A.i] = A.pick[A.i] === lk.dataset.look ? null : lk.dataset.look; save(); draw(); return; }
    const r = e.target.closest("[data-react]"); if (r){ react = react === +r.dataset.react ? null : +r.dataset.react; draw(); return; }
    if (e.target.closest("[data-next]")){ A.i = Math.min(d.qs.length - 1, A.i + 1); react = null; T.reset(); save(); draw(); const c = $(".ss-qcard", el); if (c) c.scrollIntoView({ block:"nearest", behavior: reduced() ? "auto" : "smooth" }); return; }
    if (e.target.closest("[data-prev]")){ A.i = Math.max(0, A.i - 1); react = null; T.reset(); save(); draw(); }
  };
  el.oninput = e => { if (e.target.dataset.ans != null){ A.text[A.i] = e.target.value; save(); const m = $("#qm", el); if (m) m.innerHTML = wordMeter(les, e.target.value); } };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: d => d.short || d.qs.length + " questions" });

/* ============================================================
   styleChat — чат команди; вкладення: афіша, образи, опитування
   data: { title, say, ua, kicker, chat, sub, me, msgs:[{who,t,time,att}|{sys}],
           choice:{q,ua,opts:[{id,label,sub,look,img,alt}],replies:{id:[msgs]}}, after:[msgs],
           unlock:{title,text}, cta }
   att: { poster:{title,when,lines:[..]} } | { looks:[{label,look,img,alt}] }  (img — готова картинка з номером)
   ============================================================ */
function poster(p){
  return `<div class="ss-poster"><span class="ss-poster-k">${esc(p.kicker || "School event")}</span><b>${esc(p.title)}</b><small>${esc(p.when)}</small>${p.lines.map(l => `<p>${esc(l)}</p>`).join("")}<div class="ss-eq" aria-hidden="true">${Array.from({ length: 14 }, (_, k) => `<i style="--h:${20 + (k * 37 % 70)}%;--d:${(k % 5) * .12}s"></i>`).join("")}</div></div>`;
}
function attHTML(a){
  if (!a) return "";
  if (a.poster) return poster(a.poster);
  if (a.looks) return `<div class="ss-attlooks n${a.looks.length}">${a.looks.map((l, k) => `<figure>${l.img ? `<img class="ss-art ss-attimg" src="${l.img}" alt="${esc(l.alt || l.label)}" decoding="async">` : `<span class="ss-num">${l.tag || k + 1}</span>${look(l.look, l.label)}`}<figcaption>${esc(l.label)}</figcaption></figure>`).join("")}</div>`;
  return "";
}
function chatMsg(les, m, me){
  if (m.sys) return `<div class="ss-sys">${esc(m.sys)}</div>`;
  const c = les.characters[m.who]; const mine = me && me === m.who;
  return `<div class="ss-msg ${mine ? "mine" : ""} ${m.att ? "has-att" : ""}"><span class="ss-ava">${face(les, m.who)}</span><div class="ss-bub">${mine ? "" : `<b class="ss-name name-${m.who}">${esc(c.name)}</b>`}${m.t ? `<span>${esc(m.t)}</span>` : ""}${attHTML(m.att)}${m.time ? `<small>${esc(m.time)}</small>` : ""}</div></div>`;
}
function typingEl(name){ const t = document.createElement("div"); t.className = "ss-typing"; t.innerHTML = `<span class="ss-dotsi" aria-hidden="true"><i></i><i></i><i></i></span>${esc(name)} is typing…`; return t; }
function playChat(box, les, items, o){
  let k = 0, alive = true; onCleanup(() => { alive = false; });
  const scroll = () => { const s = o.scroller || box; s.scrollTop = s.scrollHeight; };
  const step = () => {
    if (!alive || (o.stopped && o.stopped())) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const m = items[k++];
    if (m.sys){ box.insertAdjacentHTML("beforeend", chatMsg(les, m)); scroll(); later(step, 500); return; }
    const t = typingEl(les.characters[m.who].name); box.appendChild(t); scroll();
    later(() => { if (!alive || (o.stopped && o.stopped())) return; t.remove(); box.insertAdjacentHTML("beforeend", chatMsg(les, m, o.me)); scroll(); later(step, m.att ? 1100 : 650); }, Math.min(1500, 650 + String(m.t || "").length * 14));
  };
  later(step, o.delay || 400);
}
define("styleChat", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const A = store(ctx, scr, "chat");
  const choice = d.choice;
  const phase1 = d.msgs, after = () => (choice && A.pick ? (choice.replies[A.pick] || []) : []).concat(d.after || []);
  el.innerHTML = `${head(esc(d.title), d.say || "", d.ua || "", esc(d.kicker || "Story · the group chat"))}
    <div class="ss-phone">
      <div class="ss-phone-head"><span class="ss-gava" aria-hidden="true">${d.icon || "🎙️"}</span><div><b>${esc(d.chat || "The Signal crew")}</b><small>${esc(d.sub || "Zoe, Leo, Dana, Marko, Nate")}</small></div></div>
      <div class="ss-thread" id="th" aria-live="polite"></div>
      <div class="ss-phone-foot"><button class="btn small" type="button" data-replay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-all>Show all</button></div>
    </div>
    <div id="after"></div>`;
  const th = $("#th", el), aft = $("#after", el);
  let gen = 0;
  const stop = () => { gen++; };
  const pollHTML = () => `<div class="ss-msg"><span class="ss-ava">${face(les, choice.from || "marko")}</span><div class="ss-bub ss-poll"><b class="ss-name name-${choice.from || "marko"}">📊 Poll</b><span class="ss-pq">${esc(choice.q)}</span>
      <div class="ss-popts">${choice.opts.map(o => `<button class="ss-popt ${A.pick === o.id ? "on" : ""}" type="button" data-pick="${o.id}" aria-pressed="${A.pick === o.id}" ${A.pick ? "disabled" : ""}>${o.img ? `<img class="ss-art ss-img" src="${o.img}" alt="${esc(o.alt || o.label)}" decoding="async">` : `<span class="ss-num">${esc(o.id)}</span>${look(o.look, o.label)}`}<b>${esc(o.label)}</b><small>${esc(o.sub || "")}</small></button>`).join("")}</div>
      ${A.pick ? `<p class="ss-pdone">✓ You voted ${esc(A.pick)}. Nice! Tell your teacher <b>why</b> — use two words from today.</p>` : `<p class="ss-pdone muted">Tap A or B to vote.</p>`}</div></div>`;
  const finish = () => {
    A.seen = true; save();
    if (d.unlock) aft.innerHTML = `<div class="ss-unlock ix-reveal"><span class="ss-lock" aria-hidden="true">🔓</span><div><b>${esc(d.unlock.title)}</b><p>${esc(d.unlock.text)}</p></div></div>`;
    ctx.setCTA({ label: d.cta || "Continue" });
  };
  const static_ = () => {
    let html = phase1.map(m => chatMsg(les, m, d.me)).join("");
    if (choice){ html += `<div id="poll">${pollHTML()}</div>`; if (A.pick) html += after().map(m => chatMsg(les, m, d.me)).join(""); }
    th.innerHTML = html; th.scrollTop = th.scrollHeight;
    if (!choice || A.pick) finish(); else ctx.setCTA({ label: d.cta || "Continue", disabled: !ctx.teacher });
  };
  const run = () => {
    stop(); const my = gen; th.innerHTML = ""; aft.innerHTML = "";
    ctx.setCTA({ label: d.cta || "Continue", disabled: !ctx.teacher });
    playChat(th, les, phase1, { me:d.me, stopped: () => my !== gen, done: () => {
      if (!choice){ finish(); return; }
      th.insertAdjacentHTML("beforeend", `<div id="poll">${pollHTML()}</div>`); th.scrollTop = th.scrollHeight;
      if (A.pick) playChat(th, les, after(), { me:d.me, stopped: () => my !== gen, done: finish });
    } });
  };
  el.onclick = e => {
    const p = e.target.closest("[data-pick]");
    if (p && !A.pick){
      A.pick = p.dataset.pick; save();
      if (reduced()){ static_(); return; }
      const pl = $("#poll", el); if (pl) pl.innerHTML = pollHTML();
      const my = gen; playChat(th, les, after(), { me:d.me, stopped: () => my !== gen, done: finish, delay:600 });
      return;
    }
    if (e.target.closest("[data-replay]")){ if (choice) A.pick = null; save(); run(); return; }
    if (e.target.closest("[data-all]")){ stop(); static_(); }
  };
  if (reduced() || A.seen) static_(); else run();
}, { label: d => d.short || "Chat" });

/* ============================================================
   pairCard — пара протилежностей: два образи → питання-відкриття → слова
   data: { i, of, title, q, ua, a:"A"|"B", left:{w,look,cap,img,alt}, right:{w,look,cap,img,alt}, note, hint }
   (img — готова картинка з літерою A/B; без неї образ малюється кодом з look)
   ============================================================ */
function wordCard(les, w, side){
  const v = (les.vocab || []).find(x => x.w === w) || { w };
  const inBank = S.state.words[w] && S.state.words[w].added;
  return `<div class="ss-wcard p${pairNo(les, w)} ix-reveal">
    <div class="ss-wtop"><b class="ss-word">${esc(v.w)}</b>${say(v.w + ". " + (v.ex || ""), "Listen to " + v.w)}</div>
    <span class="ss-ipa">${esc(v.ipa || "")}</span>
    <p class="ss-def"><span>Simple meaning:</span> ${esc(v.en || "")}</p>
    <p class="ss-uk">🇺🇦 ${esc(v.ua || "")}</p>
    <p class="ss-ex">“${esc(v.ex || "")}”</p>
    <button class="btn small addword ${inBank ? "on" : ""}" type="button" data-addword="${esc(v.w)}">${inBank ? "✓ In My words" : "+ My words"}</button>
  </div>`;
}
define("pairCard", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const R = ctx.ans["p" + d.i] = ctx.ans["p" + d.i] || {};
  const draw = () => {
    const ok = R.pick === d.a; const open = ok || R.show;
    const side = (k, s) => { let cls = ""; if (R.pick === k) cls = ok ? "good" : "bad"; else if (open && k === d.a) cls = "good";
      return `<button class="ss-side ${cls}" type="button" data-side="${k}" ${open ? "disabled" : ""} aria-label="Outfit ${k}: ${esc(s.cap)}">${s.img ? `<img class="ss-art ss-img" src="${s.img}" alt="${esc(s.alt || s.cap)}" decoding="async">` : `<span class="ss-num">${k}</span>${look(s.look, s.cap)}`}<span class="ss-cap">${esc(s.cap)}</span></button>`; };
    el.innerHTML = `${head(esc(d.title), "", "", `The outfit rack · pair ${d.i + 1} of ${d.of}`)}
      <div class="ss-steps" aria-hidden="true">${Array.from({ length: d.of }, (_, k) => `<i class="${k < d.i ? "past" : k === d.i ? "on" : ""}"></i>`).join("")}</div>
      <div class="card ss-disc"><div class="ss-qrow"><p class="q-big ss-q">${esc(d.q)}</p>${say(d.q)}</div>${d.ua ? `<p class="ss-qua">🇺🇦 ${esc(d.ua)}</p>` : ""}</div>
      <div aria-live="polite">${R.pick && !ok ? `<div class="note amber ss-fb">🤔 Hmm, look again. ${esc(d.hint || "")} <button class="btn small" type="button" data-retry>↻ Try again</button></div>` : open ? `<div class="note good ss-fb">${ok ? "✓ Yes! " : ""}${esc(d.why || "")}</div>` : ""}</div>
      <div class="ss-duo">${side("A", d.left)}<span class="ss-vs" aria-hidden="true">${open ? "↔" : "?"}</span>${side("B", d.right)}</div>
      ${open ? `<div class="ss-pair" id="pw"><div>${wordCard(les, d.left.w)}</div><span class="ss-opp" aria-hidden="true"><b>opposites</b>↔</span><div>${wordCard(les, d.right.w)}</div></div>
        ${d.note ? `<div class="ss-notebox ix-reveal"><b>💡 Careful!</b> ${esc(d.note)}</div>` : ""}`
      : `<div class="row" style="margin-top:12px"><span class="muted">Choose A or B — then the new words appear.</span><span class="spacer"></span><button class="btn small link" type="button" data-show>Show the words</button></div>`}`;
  };
  el.onclick = e => {
    const s = e.target.closest("[data-side]");
    if (s && R.pick !== d.a && !R.show){
      R.pick = s.dataset.side;
      if (R.first == null){ R.first = R.pick === d.a; [d.left.w, d.right.w].forEach(w => S.wordResult(w, R.first)); }
      save(); draw();
      const t = R.pick === d.a ? $("#pw", el) : $(".ss-fb", el);
      if (t) later(() => t.scrollIntoView({ block: R.pick === d.a ? "start" : "nearest", behavior: reduced() ? "auto" : "smooth" }), 60);
      return;
    }
    if (e.target.closest("[data-retry]")){ R.pick = null; save(); draw(); return; }
    if (e.target.closest("[data-show]")){ R.show = true; save(); draw(); const t = $("#pw", el); if (t) t.scrollIntoView({ block:"start", behavior: reduced() ? "auto" : "smooth" }); return; }
    if (e.target.closest("[data-addword]")) later(draw, 50);
  };
  draw();
  ctx.setCTA({ label: d.i + 1 < d.of ? "Next pair →" : "Continue" });
}, { label: d => "Pair " + (d.i + 1) });

/* ============================================================
   oppositesGame — «Opposites Attack»: обери протилежне слово, поки йде час
   data: { items:[{w,o:[..],a}], secs, title, say, ua }
   ============================================================ */
define("oppositesGame", (el, scr, ctx) => {
  const d = scr.data; const G = store(ctx, scr, "game"); G.res = G.res || {}; if (G.timer == null) G.timer = true;
  const secs = d.secs || 10; const n = d.items.length;
  let tick = null, t0 = 0, state = "idle", pick = null; onCleanup(() => clearInterval(tick));
  const ordr = order(G, "order", d.items.map((x, i) => i));
  const cur = () => d.items[ordr[G.i || 0]];
  const stopT = () => clearInterval(tick);
  const startT = () => {
    stopT(); if (!G.timer) return; t0 = Date.now();
    tick = setInterval(() => {
      const left = Math.max(0, secs - (Date.now() - t0) / 1000);
      const r = $("#ring", el); if (r){ r.style.setProperty("--p", (left / secs).toFixed(3)); $("#rn", el).textContent = Math.ceil(left); }
      if (left <= 0 && state === "ask"){ stopT(); state = "timeout"; if (G.res[ordr[G.i]] == null) G.res[ordr[G.i]] = false; save(); draw(); }
    }, 100);
  };
  const score = () => Object.values(G.res).filter(Boolean).length;
  const draw = () => {
    if (!G.started){
      el.innerHTML = `${head(esc(d.title || "Opposites Attack ⚡"), d.say || "", d.ua || "", "Quick game · 3 minutes")}
        <div class="card ss-game-start"><div class="ss-bolt" aria-hidden="true">⚡</div><p class="q-big">${n} words · ${secs} seconds each</p><p class="muted" style="margin-top:-.4em">Tap the opposite as fast as you can.</p>
          <div class="row" style="justify-content:center"><button class="btn primary big" type="button" data-start>Start ⚡</button></div>
          <label class="ss-switch"><input type="checkbox" data-timer ${G.timer ? "checked" : ""}> ⏱ Timer (${secs} seconds)</label></div>`;
      return;
    }
    if ((G.i || 0) >= n){
      stopT();
      el.innerHTML = `${head("Opposites Attack ⚡", "", "", "Quick game · result")}
        <div class="card ss-game-end"><div class="ss-score">${score()} / ${n}</div><p>${score() === n ? "⚡ Perfect! You know all the opposites!" : score() >= n - 2 ? "Great job! Look at the pairs you missed." : "Good try! Let's look at the pairs again."}</p>
          <div class="ss-reslist">${d.items.map((x, k) => `<span class="ss-res ${G.res[k] ? "ok" : "no"}">${G.res[k] ? "⚡" : "↻"} ${esc(x.w)} ↔ ${esc(x.o[x.a])}</span>`).join("")}</div>
          <div class="row" style="justify-content:center;margin-top:14px"><button class="btn" type="button" data-again>↻ Play again</button></div></div>`;
      return;
    }
    const it = cur(); const k = ordr[G.i];
    el.innerHTML = `${head(esc(d.title || "Opposites Attack ⚡"), "", "", `Word ${G.i + 1} of ${n} · score ${score()}`)}
      <div class="ss-steps" aria-hidden="true">${ordr.map((x, j) => `<i class="${j < G.i ? (G.res[x] ? "okk" : "no") : j === G.i ? "on" : ""}"></i>`).join("")}</div>
      <div class="card ss-game">
        <div class="ss-gtop">${G.timer ? `<div class="ring ss-ring" id="ring" style="--p:${state === "ask" ? 1 : 0}"><span id="rn">${state === "ask" ? secs : 0}</span></div>` : `<span class="pill">⏱ off</span>`}<div class="ss-gword"><small>The opposite of</small><b>${esc(it.w)}</b></div>${say(it.w)}</div>
        <div class="ss-gopts">${it.o.map((o, j) => { let cls = ""; if (pick === j) cls = j === it.a ? "good" : "bad"; if (state === "right" && j === it.a) cls = "good"; return `<button class="opt ss-gopt ${cls}" type="button" data-o="${j}" ${state !== "ask" ? "disabled" : ""}><b class="ss-letter">${LETTER(j)}</b>${esc(o)}</button>`; }).join("")}</div>
        <div aria-live="polite">${state === "right" ? `<div class="note good ss-flash">⚡ Nice! Perfect opposite!</div>` : state === "wrong" ? `<div class="note amber">Almost! Think about the opposite meaning. <button class="btn small" type="button" data-retry>↻ Try again</button></div>` : state === "timeout" ? `<div class="note amber">⏰ Time's up! <button class="btn small" type="button" data-retry>↻ Try again</button> <button class="btn small link" type="button" data-skipw>Show the answer</button></div>` : ""}</div>
      </div>
      <label class="ss-switch"><input type="checkbox" data-timer ${G.timer ? "checked" : ""}> ⏱ Timer</label>`;
  };
  const ask = () => { state = "ask"; pick = null; draw(); startT(); };
  const next = () => { G.i = (G.i || 0) + 1; save(); if (G.i < n) ask(); else draw(); };
  el.onclick = e => {
    if (e.target.closest("[data-start]")){ G.started = true; G.i = 0; save(); ask(); return; }
    if (e.target.closest("[data-again]")){ G.res = {}; G.i = 0; G.order = shuffle(d.items.map((x, i) => i)); ordr.splice(0, ordr.length, ...G.order); save(); ask(); return; }
    const o = e.target.closest("[data-o]");
    if (o && state === "ask"){
      const it = cur(), k = ordr[G.i]; pick = +o.dataset.o;
      if (pick === it.a){ if (G.res[k] == null) G.res[k] = true; state = "right"; stopT(); save(); draw(); S.wordResult(it.w, !!G.res[k]); later(next, 1000); }
      else { if (G.res[k] == null) G.res[k] = false; state = "wrong"; stopT(); save(); draw(); }
      return;
    }
    if (e.target.closest("[data-retry]")){ ask(); return; }
    if (e.target.closest("[data-skipw]")){ state = "right"; pick = cur().a; draw(); later(next, 1400); }
  };
  el.onchange = e => { if (e.target.dataset.timer != null){ G.timer = e.target.checked; save(); if (state === "ask"){ if (G.timer) startT(); else stopT(); } draw(); } };
  if (G.started && (G.i || 0) < n) ask(); else draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Opposites" });

/* ============================================================
   outfitDetective — 4 підлітки, підказки; обери 2–3 прикметники
   data: { people:[{id,name,look,clues:[{e,t}],accept:[..],sample}], bank:[..], title, say, ua }
   ============================================================ */
define("outfitDetective", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const D = store(ctx, scr, "det"); D.sel = D.sel || {}; D.chk = D.chk || {};
  if (!d.people.some(p => p.id === D.cur)) D.cur = d.people[0].id;
  const T = Toggles();
  const draw = () => {
    const p = d.people.find(x => x.id === D.cur); const sel = D.sel[p.id] || []; const chk = D.chk[p.id];
    const good = sel.filter(w => p.accept.includes(w)).length;
    el.innerHTML = `${head(esc(d.title || "Outfit Detective 🔎"), d.say || "", d.ua || "", `Practice · ${Object.keys(D.chk).length} of ${d.people.length} described`)}
      <div class="ss-tabs" role="tablist">${d.people.map(x => `<button class="ss-ptab ${x.id === D.cur ? "on" : ""} ${D.chk[x.id] ? "done" : ""}" type="button" role="tab" aria-selected="${x.id === D.cur}" data-p="${x.id}"><span class="ss-pthumb">${look(x.look, x.name)}</span>${D.chk[x.id] ? "✓ " : ""}${esc(x.name)}</button>`).join("")}</div>
      <div class="ss-det">
        <figure class="ss-detfig">${look(p.look, p.name + "'s outfit")}<figcaption>${esc(p.name)}</figcaption></figure>
        <div class="card ss-detcard">
          <h3 class="ss-h">🔎 Clues</h3>
          <ul class="ss-clues">${p.clues.map(c => `<li><span aria-hidden="true">${c.e}</span>${esc(c.t)}</li>`).join("")}</ul>
          <p class="ss-ask">Choose <b>2–3 adjectives</b> to describe ${esc(p.name)}.</p>
          <div class="chips ss-bank">${d.bank.map(w => { const on = sel.includes(w); let cls = on ? "on" : ""; if (chk && on) cls = p.accept.includes(w) ? "good" : "hm"; return `<button class="chip p${pairNo(les, w)} ${cls}" type="button" data-w="${esc(w)}" aria-pressed="${on}" ${chk ? "disabled" : ""}>${chk && on ? (p.accept.includes(w) ? "✓ " : "🤔 ") : ""}${esc(w)}</button>`; }).join("")}</div>
          ${chk ? `<div class="note ${good === sel.length ? "good" : "amber"}">${good === sel.length ? "✓ Great detective work!" : "🤔 Is that true? Look at the clues again."} ${sel.filter(w => !p.accept.includes(w)).length ? "" : ""}</div>` : ""}
          <div class="row ss-actions">${chk ? `<button class="btn" type="button" data-again>↻ Change my words</button>` : `<button class="btn primary" type="button" data-check ${sel.length >= 2 ? "" : "disabled"}>Check</button><span class="muted">${sel.length}/3 chosen</span>`}<span class="spacer"></span>${T.btn("dt-s" + p.id, ANS)}</div>
          ${T.box("dt-s" + p.id, `<p>${esc(p.sample)} ${say(p.sample, "Listen to the answer")}</p>`, "help")}
          <div class="ss-frame">Say it: <span class="starter">${esc(p.name)} looks … and …</span> <span class="starter">${p.he === "she" ? "Her" : "His"} … look(s) …</span></div>
        </div>
      </div>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const t = e.target.closest("[data-p]"); if (t){ D.cur = t.dataset.p; save(); draw(); return; }
    const w = e.target.closest("[data-w]");
    if (w){ const a = D.sel[D.cur] = D.sel[D.cur] || []; const k = a.indexOf(w.dataset.w); if (k >= 0) a.splice(k, 1); else { if (a.length >= 3){ toast("Choose up to three words."); return; } a.push(w.dataset.w); } save(); draw(); return; }
    if (e.target.closest("[data-check]")){ D.chk[D.cur] = true; const p = d.people.find(x => x.id === D.cur); (D.sel[D.cur] || []).forEach(x => S.wordResult(x, p.accept.includes(x))); save(); draw(); return; }
    if (e.target.closest("[data-again]")){ delete D.chk[D.cur]; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "4 outfits" });

/* ============================================================
   outfitPredict — питання-здогадки «Хто, мабуть…?» (кілька можливих відповідей)
   data: { from:"stageId:key" (люди з outfitDetective), people, qs:[{q,best:[ids],why}] }
   ============================================================ */
define("outfitPredict", (el, scr, ctx) => {
  const d = scr.data; const A = store(ctx, scr, "pred"); A.pick = A.pick || {};
  const T = Toggles();
  const draw = () => {
    el.innerHTML = `${head(esc(d.title || "Who is probably…?"), d.say || "", d.ua || "", "Practice · predict and explain")}
      <div class="ss-mini-people">${d.people.map(p => `<figure>${look(p.look, p.name)}<figcaption>${esc(p.name)}</figcaption></figure>`).join("")}</div>
      ${d.qs.map((q, i) => { const pk = A.pick[i]; const best = pk && q.best.includes(pk);
        return `<div class="card ss-predq"><div class="ss-qrow"><p class="ss-q2"><span class="ss-num">${i + 1}</span>${esc(q.q)}</p>${say(q.q)}</div>
          <div class="chips">${d.people.map(p => `<button class="chip ${pk === p.id ? (best ? "good" : "on") : ""}" type="button" data-q="${i}" data-pp="${p.id}" aria-pressed="${pk === p.id}">${esc(p.name)}</button>`).join("")}</div>
          ${pk ? `<div class="note ${best ? "good" : "info"}">${best ? "Good idea! Explain why. 💬" : "Interesting! What in the clues makes you think so? 🤔"}</div><div class="row" style="margin-top:8px">${T.btn("pr" + i, "💡 Why?")}</div>${T.box("pr" + i, `<p>${esc(q.why)}</p>`, "help")}` : ""}
        </div>`; }).join("")}
      <div class="card ss-phr"><p style="margin:0"><span class="starter">I think … because …</span><span class="starter">Maybe … — look at the …</span><span class="starter">It could be … or …</span></p></div>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const b = e.target.closest("[data-pp]"); if (b){ A.pick[b.dataset.q] = b.dataset.pp; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Predictions" });

/* ============================================================
   eraCards — шість музичних епох (перед читанням) + питання для розмови
   data: { eras:[{id,decade,e,music,mood,cls}], qs:[{q,idea}], title, say, ua }
   ============================================================ */
define("eraCards", (el, scr, ctx) => {
  const d = scr.data; const T = Toggles();
  el.innerHTML = `${head(esc(d.title), d.say || "", d.ua || "", "Pre-reading · music and fashion")}
    <div class="ss-eras">${d.eras.map((x, i) => `<article class="ss-era era-${x.id}" style="--i:${i}"><span class="ss-era-e" aria-hidden="true">${x.e}</span><b>${esc(x.decade)}</b><span>${esc(x.music)}</span><small>${esc(x.mood)}</small><div class="ss-eq" aria-hidden="true">${Array.from({ length: 9 }, (_, k) => `<i style="--h:${25 + ((k + i) * 29 % 70)}%;--d:${(k % 4) * .15}s"></i>`).join("")}</div></article>`).join("")}</div>
    <div class="card"><h3 class="ss-h">💬 Talk about it</h3>
      <ol class="ss-qlist">${d.qs.map((q, i) => `<li><div class="ss-qrow"><span>${esc(q.q)}</span>${say(q.q)}${q.idea ? T.btn("ec" + i, "💡") : ""}</div>${q.idea ? T.box("ec" + i, `<p>${esc(q.idea)}</p>`, "help") : ""}</li>`).join("")}</ol>
    </div>`;
  el.onclick = e => { T.handle(e, el); };
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Six eras" });

/* ============================================================
   eraMatch — прогноз: який образ з якого десятиліття (без перевірки)
   data: { decades:[{id,decade,e}], looks:[{id,era,look,label,img,alt}], fixed, title, say, ua, note }
   (img — готова картинка з літерою; тоді ставте fixed:true, щоб літери збігалися з порядком)
   ============================================================ */
define("eraMatch", (el, scr, ctx) => {
  const d = scr.data; const M = store(ctx, scr, "match"); M.pick = M.pick || {};
  /* fixed:true — порядок як у data.looks (літери A–E вже намальовані на картинках), інакше — перемішати */
  if (d.fixed) M.order = d.looks.map(l => l.id);
  const ord = d.fixed ? M.order : order(M, "order", d.looks.map(l => l.id));
  const draw = () => {
    const n = Object.keys(M.pick).length;
    el.innerHTML = `${head(esc(d.title || "Guess the decade"), d.say || "", d.ua || "", "Pre-reading · prediction")}
      <div class="note info" style="margin-top:0">🤔 ${esc(d.note || "Don't worry if you're not sure. You'll check your ideas while reading.")}</div>
      <div class="ss-match">${ord.map((id, i) => { const l = d.looks.find(x => x.id === id); return `<div class="card ss-mlook">
        ${l.img ? `<img class="ss-art ss-img" src="${l.img}" alt="${esc(l.alt || "Look " + LETTER(i))}" decoding="async">` : `<span class="ss-num">${LETTER(i)}</span>${look(l.look, "Look " + LETTER(i))}`}
        <div class="ss-decs" role="group" aria-label="Look ${LETTER(i)}: choose a decade">${d.decades.map(x => `<button class="ss-dec ${M.pick[id] === x.id ? "on" : ""}" type="button" data-l="${id}" data-dec="${x.id}" aria-pressed="${M.pick[id] === x.id}">${esc(x.decade)}</button>`).join("")}</div>
      </div>`; }).join("")}</div>
      <p class="muted" style="text-align:center;margin-top:12px"><span id="mn">${n}</span> / ${d.looks.length} guesses saved — you'll see them in the timeline.</p>`;
  };
  /* клік оновлює лише кнопки — картинки не перемальовуються й не блимають */
  el.onclick = e => {
    const b = e.target.closest("[data-dec]"); if (!b) return;
    const l = b.dataset.l;
    if (M.pick[l] === b.dataset.dec) delete M.pick[l]; else M.pick[l] = b.dataset.dec;
    save();
    $$(`[data-l="${l}"]`, el).forEach(x => { const on = M.pick[l] === x.dataset.dec; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); });
    const mn = $("#mn", el); if (mn) mn.textContent = Object.keys(M.pick).length;
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Guess" });

/* ============================================================
   timelineRead — текст-«таймлайн»: секції відкриваються по черзі
   data: { sections:[{id,decade,e,title,text,ua,look,cls}], guess:{stage,key,looks}, title, say, ua }
   ============================================================ */
define("timelineRead", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const R = store(ctx, scr, "read"); R.open = R.open || {};
  const T = Toggles();
  const guesses = () => { const g = d.guess; if (!g) return {}; const st = ctx.all[g.stage] || {}; const m = st[g.key] || {}; const ord = m.order || []; const out = {};
    Object.entries(m.pick || {}).forEach(([lid, era]) => { out[era] = out[era] || []; out[era].push({ letter: LETTER(Math.max(0, ord.indexOf(lid))), ok: lid === era }); }); return out; };
  const draw = () => {
    const n = d.sections.filter(s => R.open[s.id]).length; const G = guesses();
    el.innerHTML = `${head(esc(d.title), d.say || "", d.ua || "", `Reading · ${n} of ${d.sections.length} opened`)}
      <div class="row ss-legend"><span class="muted">Today's words are <mark class="ss-w p1">highlighted</mark>.</span><span class="spacer"></span><button class="btn small" type="button" data-openall>${n === d.sections.length ? "Close all" : "Open all"}</button></div>
      <ol class="ss-tl">${d.sections.map((s, i) => { const open = R.open[s.id]; const g = G[s.id] || [];
        return `<li class="ss-tli era-${s.cls || s.id} ${open ? "open" : ""}">
          <button class="ss-tlhead" type="button" data-sec="${s.id}" aria-expanded="${!!open}"><span class="ss-tldot" aria-hidden="true">${s.e}</span><b>${esc(s.decade)}</b><span class="ss-tlt">${esc(s.title)}</span><span class="ss-chev" aria-hidden="true">${open ? "−" : "+"}</span></button>
          ${open ? `<div class="ss-tlbody ix-reveal">
            <div class="ss-tlimg">${look(s.look, s.decade + " look")}</div>
            <div class="ss-tltext"><p>${highlight(les, s.text)}</p>
              <div class="row">${say(s.text, "Listen to the " + s.decade)}${T.btn("tl-ua" + i, UA, "ua")}${g.length ? g.map(x => `<span class="pill ${x.ok ? "good" : "amber"}">Your guess: look ${x.letter} ${x.ok ? "✓" : "✗"}</span>`).join("") : ""}</div>
              ${T.box("tl-ua" + i, `<p>${esc(s.ua)}</p>`, "ss-uabox")}
            </div></div>` : ""}
        </li>`; }).join("")}</ol>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const b = e.target.closest("[data-sec]"); if (b){ R.open[b.dataset.sec] = !R.open[b.dataset.sec]; save(); draw(); const li = b.closest(".ss-tli"); const nb = $(`[data-sec="${b.dataset.sec}"]`, el); if (nb && R.open[b.dataset.sec]) nb.scrollIntoView({ block:"nearest", behavior: reduced() ? "auto" : "smooth" }); return; }
    if (e.target.closest("[data-openall]")){ const all = d.sections.every(s => R.open[s.id]); d.sections.forEach(s => R.open[s.id] = !all); save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Timeline" });

/* ============================================================
   timelineBuild — відновити таймлайн: десятиліття → музика → модна підказка
   + 3 питання після читання
   data: { rows:[{id,decade,e,music,clue}], qs:[{q,ua,a,idea}], title, say, ua }
   ============================================================ */
define("timelineBuild", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "build"); Q.place = Q.place || {};
  const cards = d.rows.flatMap(r => [{ id:"m-" + r.id, t:r.music, kind:"m" }, { id:"c-" + r.id, t:r.clue, kind:"c" }]);
  const ord = order(Q, "order", cards.map(c => c.id));
  const T = Toggles(); let sel = null, pick = null;
  const card = id => cards.find(c => c.id === id);
  const slotOf = id => Object.keys(Q.place).find(k => Q.place[k] === id);
  const draw = () => {
    const bank = ord.filter(id => !slotOf(id));
    const total = d.rows.length * 2; const placed = Object.keys(Q.place).length;
    const right = d.rows.reduce((a, r) => a + (Q.place["m-" + r.id] === "m-" + r.id ? 1 : 0) + (Q.place["c-" + r.id] === "c-" + r.id ? 1 : 0), 0);
    const chip = (id, slot) => { const c = card(id); let cls = sel === id ? "sel" : ""; if (Q.chk && slot) cls = slot === id ? "ok" : "no"; return `<button class="ss-card ${c.kind} ${cls}" type="button" data-c="${id}" draggable="${Q.chk ? "false" : "true"}" ${Q.chk ? "disabled" : ""}>${c.kind === "m" ? "🎵 " : "👕 "}${esc(c.t)}</button>`; };
    const slot = key => { const has = Q.place[key]; return `<div class="ss-slot ${has ? "filled" : ""} ${sel && !has ? "ready" : ""}" data-slot="${key}" role="button" tabindex="0" aria-label="${key[0] === "m" ? "Music" : "Fashion clue"} gap">${has ? chip(has, key) : `<span class="muted">${key[0] === "m" ? "music…" : "fashion clue…"}</span>`}</div>`; };
    el.innerHTML = `${head(esc(d.title), d.say || "", d.ua || "", `Reading check · ${placed} / ${total} cards`)}
      <div class="card ss-bankc"><div class="ss-cbank" data-slot="">${bank.map(id => chip(id)).join("") || `<span class="muted">All cards are on the timeline ✓</span>`}</div>
        <p class="muted ss-tip">Tap a card, then tap a gap — or tap a gap and choose. You can also drag.</p></div>
      <div class="ss-build">${d.rows.map(r => `<div class="ss-brow era-${r.id}"><span class="ss-bdec"><span aria-hidden="true">${r.e}</span>${esc(r.decade)}</span>${slot("m-" + r.id)}<span class="ss-arrow" aria-hidden="true">→</span>${slot("c-" + r.id)}</div>
        ${pick && pick.slice(2) === r.id && !Q.chk ? `<div class="ss-picker ix-reveal" role="group" aria-label="Choose a card"><span class="muted">Choose ${pick[0] === "m" ? "the music" : "the fashion clue"}:</span>${bank.filter(id => id[0] === pick[0]).map(id => `<button class="ss-card ${pick[0]}" type="button" data-put="${id}">${pick[0] === "m" ? "🎵 " : "👕 "}${esc(card(id).t)}</button>`).join("") || `<span class="muted">No cards left — tap a card in a gap to move it back.</span>`}</div>` : ""}`).join("")}</div>
      ${Q.chk ? `<div class="note ${right === total ? "good" : "amber"}">${right} / ${total} cards in the right place. ${right === total ? "Great reading! 🎸" : "Tap Try again and move the red ones."}</div>` : ""}
      <div class="row ss-actions">${Q.chk ? (right < total ? `<button class="btn primary" type="button" data-retry>↻ Try again</button>` : "") : `<button class="btn primary" type="button" data-check ${placed === total ? "" : "disabled"}>Check</button>`}<button class="btn ghost" type="button" data-reset>Reset</button></div>
      <div class="card ss-after"><h3 class="ss-h">📖 After reading</h3>
        ${d.qs.map((q, i) => `<div class="ss-qa"><div class="ss-qrow"><p class="ss-q2"><span class="ss-num">${i + 1}</span>${esc(q.q)}</p>${say(q.q)}</div>
          <div class="row">${q.ua ? T.btn("tb-ua" + i, UA, "ua") : ""}${q.a ? T.btn("tb-a" + i, ANS) : ""}${q.idea ? T.btn("tb-i" + i, IDEA) : ""}${q.opinion ? `<span class="pill">💬 Your opinion — no wrong answers</span>` : ""}</div>
          ${q.ua ? T.box("tb-ua" + i, `<p>${esc(q.ua)}</p>`, "ss-uabox") : ""}${q.a ? T.box("tb-a" + i, `<p>${esc(q.a)}</p>`, "help") : ""}${q.idea ? T.box("tb-i" + i, `<p>${esc(q.idea)}</p>`, "help") : ""}</div>`).join("")}
      </div>`;
  };
  const place = (id, key) => { Object.keys(Q.place).forEach(k => { if (Q.place[k] === id) delete Q.place[k]; }); if (key){ if (Q.place[key]) delete Q.place[key]; Q.place[key] = id; } sel = null; pick = null; save(); draw(); };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-check]")){ Q.chk = true; Q.score = d.rows.reduce((a, r) => a + (Q.place["m-" + r.id] === "m-" + r.id ? 1 : 0) + (Q.place["c-" + r.id] === "c-" + r.id ? 1 : 0), 0); if (Q.best == null || Q.score > Q.best) Q.best = Q.score; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ Object.keys(Q.place).forEach(k => { if (Q.place[k] !== k) delete Q.place[k]; }); Q.chk = false; save(); draw(); return; }
    if (e.target.closest("[data-reset]")){ Q.place = {}; Q.chk = false; sel = null; save(); draw(); return; }
    if (Q.chk) return;
    const put = e.target.closest("[data-put]"); if (put && pick){ place(put.dataset.put, pick); return; }
    const c = e.target.closest("[data-c]"); const s = e.target.closest("[data-slot]");
    if (c && !(sel && s && s.dataset.slot && sel !== c.dataset.c)){ sel = sel === c.dataset.c ? null : c.dataset.c; pick = null; draw(); return; }
    if (s && sel){ place(sel, s.dataset.slot || null); return; }
    if (s && s.dataset.slot && !Q.place[s.dataset.slot]){ pick = pick === s.dataset.slot ? null : s.dataset.slot; draw(); }
  };
  el.onkeydown = e => { const s = e.target.closest && e.target.closest("[data-slot]"); if (s && sel && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); place(sel, s.dataset.slot || null); } };
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-c]"); if (c) e.dataTransfer.setData("text/plain", c.dataset.c); };
  el.ondragover = e => { const s = e.target.closest && e.target.closest("[data-slot]"); if (s && !Q.chk){ e.preventDefault(); s.classList.add("over"); } };
  el.ondragleave = e => { const s = e.target.closest && e.target.closest("[data-slot]"); if (s) s.classList.remove("over"); };
  el.ondrop = e => { const s = e.target.closest && e.target.closest("[data-slot]"); if (!s || Q.chk) return; e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id && card(id)) place(id, s.dataset.slot || null); };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Build the timeline" });

/* ============================================================
   timeMachine — обери епоху й збери образ для концерту + 3 речення
   data: { eras:[{id,decade,e,cls,pieces:[{id,label,slot,item}]}], frame:[{id,pre,ph}], max, title, say, ua }
   ============================================================ */
const SLOT_KEY = { top:"top", outer:"outer", bottom:"bottom", shoes:"shoes" };
function specFrom(pieces){
  const s = { extras:[] };
  pieces.forEach(p => { if (SLOT_KEY[p.slot]) s[SLOT_KEY[p.slot]] = p.item; else s.extras.push(p.item); });
  return s;
}
define("timeMachine", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const T_ = store(ctx, scr, "tm"); T_.sel = T_.sel || {}; T_.f = T_.f || {};
  let flash = false;
  const draw = () => {
    if (!T_.era){
      el.innerHTML = `${head(esc(d.title || "Style Time Machine 🎮"), d.say || "", d.ua || "", "Creative game")}
        <div class="ss-tmstart"><p class="ss-tmk">Choose ONE era</p><div class="ss-tmeras">${d.eras.map(x => `<button class="ss-tmera era-${x.cls || x.id}" type="button" data-era="${x.id}"><span aria-hidden="true">${x.e}</span><b>${esc(x.decade)}</b><small>${esc(x.music)}</small></button>`).join("")}</div></div>`;
      return;
    }
    const era = d.eras.find(x => x.id === T_.era); const sel = T_.sel[era.id] = T_.sel[era.id] || [];
    const chosen = era.pieces.filter(p => sel.includes(p.id));
    const text = Object.values(T_.f).join(" ");
    el.innerHTML = `${head(esc(d.title || "Style Time Machine 🎮"), "", "", "Creative game")}
      <div class="ss-tmbar era-${era.cls || era.id} ${flash ? "flash" : ""}"><span class="ss-tmon">TIME MACHINE ACTIVATED ⚡</span><b>${era.e} ${esc(era.decade)} · ${esc(era.music)}</b><button class="btn small" type="button" data-change>↺ Change era</button></div>
      <div class="card ss-tmtask"><p class="q-big" style="margin:0">${esc(d.prompt || "You're going to a concert in this decade. Build your outfit.")}</p></div>
      <div class="ss-tm">
        <div class="ss-tmpieces">${era.pieces.map(p => `<button class="ss-pc ${sel.includes(p.id) ? "on" : ""}" type="button" data-pc="${p.id}" aria-pressed="${sel.includes(p.id)}">${art().piece(Object.assign({ slot:p.slot }, p.item), { label:p.label })}<span>${esc(p.label)}</span></button>`).join("")}</div>
        <figure class="ss-tmlook era-${era.cls || era.id}">${chosen.length ? look(specFrom(chosen), "My " + era.decade + " outfit") : `<div class="ss-empty">Tap the clothes to build your look 👕</div>`}<figcaption>My ${esc(era.decade)} concert look</figcaption></figure>
      </div>
      <div class="card ss-frame2"><h3 class="ss-h">💬 Describe your outfit</h3>
        ${d.frame.map(f => `<div class="ss-fline"><label for="tm-${f.id}">${esc(f.pre)}</label><input type="text" id="tm-${f.id}" data-f="${f.id}" value="${esc(T_.f[f.id] || "")}" placeholder="${esc(f.ph || "")}" autocomplete="off"></div>`).join("")}
        <div id="tmm">${wordMeter(les, text)}</div>
      </div>`;
  };
  el.onclick = e => {
    const er = e.target.closest("[data-era]"); if (er){ T_.era = er.dataset.era; flash = true; save(); draw(); later(() => { flash = false; const b = $(".ss-tmbar", el); if (b) b.classList.remove("flash"); }, 1200); return; }
    if (e.target.closest("[data-change]")){ T_.era = null; save(); draw(); return; }
    const pc = e.target.closest("[data-pc]");
    if (pc){
      const era = d.eras.find(x => x.id === T_.era); const sel = T_.sel[era.id]; const p = era.pieces.find(x => x.id === pc.dataset.pc);
      const k = sel.indexOf(p.id);
      if (k >= 0) sel.splice(k, 1);
      else {
        if (SLOT_KEY[p.slot]) era.pieces.filter(x => x.slot === p.slot && sel.includes(x.id)).forEach(x => sel.splice(sel.indexOf(x.id), 1));
        if (sel.length >= (d.max || 5)){ toast("That's enough for one outfit! Remove something first."); return; }
        sel.push(p.id);
      }
      save(); draw();
    }
  };
  el.oninput = e => { const f = e.target.closest("[data-f]"); if (f){ T_.f[f.dataset.f] = f.value; save(); const m = $("#tmm", el); if (m) m.innerHTML = wordMeter(les, Object.values(T_.f).join(" ")); } };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Time machine" });

/* ============================================================
   outfitBuilder — фінальна місія: зібрати образ Марка й описати його
   data: { who, intro, cats:[{id,label,multi,opts:[{id,label,item,slot}]}], frame:[..], example,
           need, done:{title,text}, reply, title }
   ============================================================ */
define("outfitBuilder", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const B = store(ctx, scr, "build"); B.pick = B.pick || {};
  const T = Toggles(); const need = d.need || 5; const c = les.characters[d.who || "marko"];
  const chosen = () => d.cats.flatMap(cat => { const v = B.pick[cat.id]; const ids = cat.multi ? (v || []) : v ? [v] : []; return cat.opts.filter(o => ids.includes(o.id)).map(o => Object.assign({ slot: cat.slot || o.slot }, o)); });
  const party = () => `<div class="ss-confetti" aria-hidden="true">${Array.from({ length: 36 }, (_, k) => `<i style="--x:${(k * 53) % 100}%;--d:${(k % 9) * .11}s;--r:${(k * 47) % 360}deg;--c:${["#FF5A4E", "#FFD43B", "#3D5AFE", "#B8F23A", "#FF8FB1", "#00C2A8"][k % 6]}"></i>`).join("")}</div>`;
  const draw = () => {
    const ch = chosen(); const used = targets(les, B.text); const ready = used.length >= need || B.oral;
    const spec = specFrom(ch.map(o => ({ slot:o.slot, item:o.item })));
    el.innerHTML = `<div class="ss-final"><span class="ss-fk">🎯 FINAL MISSION</span><h2 class="stitle" id="stitle" tabindex="-1">${esc(d.title || "Create Marko's look")}</h2><p>${esc(d.intro)}</p><span class="ss-fava">${face(les, d.who || "marko", 1.7)}</span></div>
      <div class="ss-builder">
        <div class="ss-bcats">${d.cats.map(cat => `<div class="card ss-bcat"><h3 class="ss-h">${esc(cat.label)} ${cat.multi ? `<span class="muted" style="font-weight:600">(choose any)</span>` : ""}</h3>
          <div class="ss-bopts">${cat.opts.map(o => { const on = cat.multi ? (B.pick[cat.id] || []).includes(o.id) : B.pick[cat.id] === o.id;
            return `<button class="ss-pc ${on ? "on" : ""}" type="button" data-cat="${cat.id}" data-opt="${o.id}" aria-pressed="${on}" ${B.done ? "disabled" : ""}>${art().piece(Object.assign({ slot: cat.slot || o.slot }, o.item), { label:o.label })}<span>${esc(o.label)}</span></button>`; }).join("")}</div></div>`).join("")}</div>
        <figure class="ss-blook"><div class="ss-blabel"><span class="ss-mini">${face(les, d.who || "marko")}</span><b>${esc(c ? c.name : "")}'s Style & Music Day look</b></div>${ch.length ? look(spec, "Marko's outfit") : `<div class="ss-empty">Choose the clothes 👕👖👟</div>`}</figure>
      </div>
      <div class="card ss-describe"><h3 class="ss-h">✍️ Describe Marko's final outfit using AT LEAST ${need} words from today's vocabulary.</h3>
        <p class="ss-frameline">${d.frame.map(f => `<button class="chip sm" type="button" data-fr="${esc(f)}" ${B.done ? "disabled" : ""}>${esc(f)}</button>`).join(" ")}</p>
        <textarea id="bt" aria-label="Describe Marko's outfit" placeholder="I chose … because …" ${B.done ? "readonly" : ""}>${esc(B.text || "")}</textarea>
        <div id="bm">${wordMeter(les, B.text, need)}</div>
        <label class="ss-switch"><input type="checkbox" data-oral ${B.oral ? "checked" : ""} ${B.done ? "disabled" : ""}> 🗣 I said it out loud (my teacher counted the words)</label>
        <div class="row" style="margin-top:10px">${T.btn("bx", "SHOW EXAMPLE")}<span class="spacer"></span>${B.done ? `<span class="pill good">🎯 Mission complete</span>` : `<button class="btn primary big" type="button" data-done ${ready && ch.length ? "" : "disabled"}>🎯 Complete the mission</button>`}</div>
        ${T.box("bx", `<p>${esc(d.example)} ${say(d.example, "Listen to the example")}</p>`, "help")}
        ${!B.done && !ch.length ? `<p class="muted" style="margin:.6em 0 0">First choose the clothes.</p>` : ""}
      </div>
      ${B.done ? `<div class="ss-win ix-reveal">${reduced() ? "" : party()}<div class="ss-wintxt"><b>${esc(d.done.title)}</b><p>${esc(d.done.text)}</p></div>
        ${d.reply ? `<div class="ss-msg"><span class="ss-ava">${face(les, d.reply.who)}</span><div class="ss-bub"><b class="ss-name name-${d.reply.who}">${esc(les.characters[d.reply.who].name)}</b><span>${esc(d.reply.t)}</span></div></div>` : ""}</div>` : ""}`;
  };
  const meter = () => { const m = $("#bm", el); if (m) m.innerHTML = wordMeter(les, B.text, need); const b = $("[data-done]", el); if (b) b.disabled = !((targets(les, B.text).length >= need || B.oral) && chosen().length); };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const o = e.target.closest("[data-opt]");
    if (o && !B.done){ const cat = d.cats.find(x => x.id === o.dataset.cat);
      if (cat.multi){ const a = B.pick[cat.id] = B.pick[cat.id] || []; const k = a.indexOf(o.dataset.opt); k >= 0 ? a.splice(k, 1) : a.push(o.dataset.opt); }
      else B.pick[cat.id] = B.pick[cat.id] === o.dataset.opt ? null : o.dataset.opt;
      save(); draw(); return; }
    const fr = e.target.closest("[data-fr]");
    if (fr){ const ta = $("#bt", el); ta.value = (ta.value.trim() ? ta.value.trim() + " " : "") + fr.dataset.fr.replace(/_+/g, "…"); B.text = ta.value; save(); meter(); ta.focus(); return; }
    if (e.target.closest("[data-done]")){ B.done = true; B.words = targets(les, B.text).length; save(); draw(); const w = $(".ss-win", el); if (w) w.scrollIntoView({ block:"center", behavior: reduced() ? "auto" : "smooth" }); }
  };
  el.oninput = e => { if (e.target.id === "bt"){ B.text = e.target.value; save(); meter(); } };
  el.onchange = e => { if (e.target.dataset.oral != null){ B.oral = e.target.checked; save(); meter(); } };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Marko's look" });

/* ============================================================
   pairRecap — 12 слів без перекладу: поясни → переверни картку; самооцінка
   data: { title, say, ua, rate:[3], replies:[3] }   — пари з les.pairs, слова з les.vocab
   ============================================================ */
define("pairRecap", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const R = store(ctx, scr, "recap"); R.flip = R.flip || {};
  const icons = ["🟢", "🟡", "🔴"];
  const v = w => (les.vocab || []).find(x => x.w === w) || { w };
  const draw = () => {
    const all = (les.pairs || []).flat(); const n = all.filter(w => R.flip[w]).length;
    el.innerHTML = `${head(esc(d.title || "Can you remember? 🧠"), d.say || "", d.ua || "", `Vocabulary recap · ${n} / ${all.length} checked`)}
      <div class="row" style="margin-bottom:10px"><span class="muted">Explain or translate the word. Then tap the card to check.</span><span class="spacer"></span><button class="btn small" type="button" data-flipall>${n === all.length ? "Hide all" : "Reveal all"}</button></div>
      <div class="ss-recap">${(les.pairs || []).map((p, i) => `<div class="ss-rpair p${i + 1}">${p.map(w => { const x = v(w); const on = R.flip[w];
        return `<button class="ss-flip ${on ? "on" : ""}" type="button" data-fw="${esc(w)}" aria-pressed="${!!on}"><span class="ss-front"><b>${esc(w)}</b></span><span class="ss-back"><b>${esc(w)}</b><small>${esc(x.en || "")}</small><em>🇺🇦 ${esc(x.ua || "")}</em></span></button>`; }).join(`<span class="ss-rarrow" aria-hidden="true">↔</span>`)}</div>`).join("")}</div>
      <div class="card ss-conf"><h3 class="ss-h">How confident are you?</h3>
        <div class="ix-rate" role="group" aria-label="How confident are you?">${d.rate.map((r, k) => `<button type="button" class="${R.rate === k ? "on" : ""}" data-rt="${k}" aria-pressed="${R.rate === k}"><span aria-hidden="true">${icons[k]}</span>${esc(r)}</button>`).join("")}</div>
        ${R.rate != null ? `<div class="note ${R.rate === 0 ? "good" : "info"}">${esc(d.replies[R.rate])}</div>` : ""}</div>`;
  };
  el.onclick = e => {
    const f = e.target.closest("[data-fw]"); if (f){ R.flip[f.dataset.fw] = !R.flip[f.dataset.fw]; save(); f.classList.toggle("on", R.flip[f.dataset.fw]); f.setAttribute("aria-pressed", String(!!R.flip[f.dataset.fw])); const k = $(".kicker", el); const all = (les.pairs || []).flat(); if (k) k.textContent = `Vocabulary recap · ${all.filter(w => R.flip[w]).length} / ${all.length} checked`; return; }
    if (e.target.closest("[data-flipall]")){ const all = (les.pairs || []).flat(); const on = !all.every(w => R.flip[w]); all.forEach(w => R.flip[w] = on); save(); draw(); return; }
    const r = e.target.closest("[data-rt]"); if (r){ R.rate = +r.dataset.rt; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Recap" });

/* ============================================================
   photoReveal — фінал серії (темний режим): коробка → старе фото →
   реакції → переверни фото → To be continued… → Next time
   data: { scene, chat, sub, msgs1:[..], photo:{img,alt}, msgsPhoto:[..], msgs2:[..], tbc, next:{k,title,lines:[..]} }
   photo.img — необов'язкова реалістична картинка; без неї фото малюється кодом
   ============================================================ */
define("photoReveal", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const A = store(ctx, scr, "photo");
  const front = d.photo && d.photo.img ? `<img src="${d.photo.img}" alt="${esc(d.photo.alt || "")}" decoding="async">` : art().oldPhoto();
  el.innerHTML = `<div class="story-screen ss-cliff">
      ${d.scene ? `<p class="story-line ss-scene">${esc(d.scene)}</p>` : ""}
      <div class="ss-dchat">
        <div class="ss-dhead"><span class="ss-gava" aria-hidden="true">🎙️</span><div><b id="stitle" tabindex="-1">${esc(d.chat || "The Signal crew")}</b><small>${esc(d.sub || "")}</small></div></div>
        <div id="pr" class="ss-pthread" aria-live="polite"></div>
      </div>
      <div class="ss-photo-wrap" id="pw" hidden>
        <button class="ss-photo" type="button" data-flip disabled aria-label="Turn the photo over"><span class="ss-face front">${front}</span><span class="ss-face back">${art().photoBack()}</span></button>
        <p class="ss-fliphint" id="fh" hidden>👆 Tap the photo to turn it over</p>
      </div>
      <div id="prb" class="ss-pthread ss-dchat2" aria-live="polite"></div>
      <div id="pr2" class="ss-pthread ss-dchat2" aria-live="polite"></div>
      <div class="ss-tbc" id="tbc" hidden>${esc(d.tbc || "TO BE CONTINUED…")}</div>
      ${d.next ? `<div class="ss-nextcard" id="nx" hidden><span>${esc(d.next.k)}</span><b>${esc(d.next.title)}</b>${d.next.lines.map(l => `<p>${esc(l)}</p>`).join("")}</div>` : ""}
    </div>`;
  const box1 = $("#pr", el), boxB = $("#prb", el), box2 = $("#pr2", el), pw = $("#pw", el), ph = $(".ss-photo", el), hint = $("#fh", el);
  let alive = true; onCleanup(() => { alive = false; document.body.classList.remove("ss-dim"); });
  const anim = !reduced() && !A.seen;
  const end = () => {
    A.seen = true; save(); document.body.classList.add("ss-dim");
    $("#tbc", el).hidden = false; const n = $("#nx", el); if (n) n.hidden = false;
    ctx.setCTA({ label:"Continue" });
    if (anim) later(() => { const t = $("#tbc", el); if (t) t.scrollIntoView({ block:"center", behavior:"smooth" }); }, 300);
  };
  const canFlip = () => { ph.disabled = false; if (!A.flipped){ hint.hidden = false; if (anim) later(() => ph.scrollIntoView({ block:"center", behavior:"smooth" }), 100); } };
  const part2 = () => { if (anim) playChat(box2, les, d.msgs2, { stopped: () => !alive, done: () => later(end, 1000), delay:900 }); else { box2.innerHTML = d.msgs2.map(m => chatMsg(les, m)).join(""); end(); } };
  const showPhoto = () => { pw.hidden = false; pw.classList.add("ix-reveal"); };
  ctx.setCTA({ label:"Continue", disabled: !ctx.teacher });
  if (!anim){
    box1.innerHTML = d.msgs1.map(m => chatMsg(les, m)).join(""); showPhoto();
    boxB.innerHTML = (d.msgsPhoto || []).map(m => chatMsg(les, m)).join(""); canFlip();
    if (A.flipped){ ph.classList.add("flipped"); part2(); }
  } else {
    playChat(box1, les, d.msgs1, { stopped: () => !alive, done: () => {
      showPhoto(); later(() => pw.scrollIntoView({ block:"center", behavior:"smooth" }), 100);
      playChat(boxB, les, d.msgsPhoto || [], { stopped: () => !alive, done: canFlip, delay:1400 });
    } });
  }
  el.onclick = e => {
    const f = e.target.closest("[data-flip]"); if (!f || f.disabled) return;
    const first = !A.flipped;
    f.classList.toggle("flipped"); A.flipped = true; save(); hint.hidden = true;
    f.setAttribute("aria-label", f.classList.contains("flipped") ? "Turn the photo back" : "Turn the photo over");
    if (first && !box2.innerHTML) later(part2, anim ? 700 : 0);
  };
}, { story:true, label: () => "The old photo" });

/* ============================================================
   greatJob — фінальний підсумок уроку
   data: { title, list:[{e,t}], unlocked, quote:[..], cta }
   ============================================================ */
define("greatJob", (el, scr, ctx) => {
  const d = scr.data;
  el.innerHTML = `<div class="ss-great">
      <div class="ss-gbig" aria-hidden="true">🎉</div>
      <h2 class="stitle" id="stitle" tabindex="-1">${esc(d.title || "GREAT JOB! 🎉")}</h2>
      <div class="card"><h3 class="ss-h">Today you:</h3><ul class="ss-did">${d.list.map((x, i) => `<li style="--i:${i}"><span aria-hidden="true">${x.e}</span>${esc(x.t)}</li>`).join("")}</ul></div>
      <div class="ss-unlocked"><b>${esc(d.unlocked || "Vocabulary unlocked: 12 words ✅")}</b><a class="btn small" href="#/words">Open My words</a></div>
      <blockquote class="ss-quote">${d.quote.map(q => `<p>${esc(q)}</p>`).join("")}</blockquote>
    </div>`;
  ctx.setCTA({ label: d.cta || "Finish lesson ✅" });
}, { label: () => "Great job" });

})();
