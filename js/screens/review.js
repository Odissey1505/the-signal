/* ============================================================
   THE SIGNAL — бібліотека екранів для уроків-повторень і фінальних місій
   ------------------------------------------------------------
   Типи екранів: приватний чат-вступ, обговорення з голосуванням, дошка доказів,
   слова в пропуски, опис фото, чат «Next message», discovery-питання,
   вибір форми, breakout rooms з таймером, фінальне повідомлення,
   картки для speaking, exit ticket, фінальний екран.
   Урок перелічує екрани у своїй функції screens(add, st):
   add(stage, "stepChat", { msgs:[…] }).
   Жоден екран не блокує кнопку Continue: завдання можна пройти усно.
   Відповіді зберігаються в ans етапу під ключем data.store
   (або стандартним ключем типу екрана).
   Підключається в index.html після js/screens/story.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
const { $, esc, reduced, onCleanup, save, sayBtn, TTS } = S;
const head = P.head;
const define = P.define;

/* ---------- helpers ---------- */
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const tok = s => esc(s).replace(/\[([vaim]):([^\]]+)\]/g, (_, k, t) => `<span class="t-${k}">${t}</span>`);
const plain = s => String(s).replace(/\[[vaim]:([^\]]+)\]/g, "$1");
/* текст для озвучення: без емодзі */
const speakable = s => plain(s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "").replace(/\s+/g, " ").trim();
const say = (text, label) => sayBtn(speakable(text), label);
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const PC = /(\b(am|is|are|isn't|aren't)|'m|'s|'re)\s+(not\s+|also\s+|still\s+|really\s+)?[a-z]+ing\b/i;
const PS = /\b(usually|always|often|never|sometimes|normally|every|doesn't|don't|does|do)\b|\b(he|she|it|marko)\s+(?!is\b|was\b)[a-z]+s\b/i;

/* кнопки UA / Example / Answer: стан відкритих блоків живе, поки відкритий екран */
function Toggles(){
  const open = new Set();
  return {
    btn(id, label, cls){ const on = open.has(id); return `<button class="rv-tog ${cls || ""} ${on ? "on" : ""}" type="button" data-tog="${id}" aria-expanded="${on}" aria-controls="${id}">${label}</button>`; },
    box(id, html, cls){ return `<div class="rv-hide ${cls || ""}" id="${id}" ${open.has(id) ? "" : "hidden"}>${html}</div>`; },
    all(ids, label){ return `<button class="btn small" type="button" data-togall="${ids.join(",")}">${label}</button>`; },
    handle(e, el){
      const one = e.target.closest("[data-tog]"), many = e.target.closest("[data-togall]");
      if (!one && !many) return false;
      const ids = one ? [one.dataset.tog] : many.dataset.togall.split(",");
      const show = one ? !open.has(ids[0]) : !ids.every(id => open.has(id));
      ids.forEach(id => {
        show ? open.add(id) : open.delete(id);
        const box = el.querySelector("#" + id); if (box) box.hidden = !show;
        el.querySelectorAll(`[data-tog="${id}"]`).forEach(b => { b.classList.toggle("on", show); b.setAttribute("aria-expanded", String(show)); });
      });
      return true;
    }
  };
}
const UA = "UA", EX = "💡 Example", ANS = "👁 Answer";

/* повідомлення чату (стилі з story.js: .ix-msg / .ix-bub) */
function bubble(les, m, o){
  o = o || {};
  const tr = o.ua && m.ua ? `<span class="rv-mua">${esc(m.ua)}</span>` : "";
  if (m.sys) return `<div class="ix-sys ${o.anim ? "" : "rv-still"}">${esc(m.sys)}${tr}</div>`;
  const c = les.characters[m.who]; const mine = o.me && o.me === m.who;
  return `<div class="ix-msg ${mine ? "ix-mine" : ""} ${o.anim ? "" : "rv-still"}"><span class="ix-ava">${S.face(c, { zoom:1.9 })}</span><div class="ix-bub">${mine || o.noName ? "" : `<b class="ix-name name-${m.who}">${esc(c.name)}</b>`}${esc(m.t)}${tr}${m.time ? `<small>${esc(m.time)}</small>` : ""}</div></div>`;
}
function typing(name){
  const t = document.createElement("div"); t.className = "ix-typing";
  t.innerHTML = `<span class="ix-dots" aria-hidden="true"><i></i><i></i><i></i></span>${esc(name)} is typing…`;
  return t;
}
/* повідомлення з'являються по одному: items = [{who, html}] */
function sequence(box, les, items, o){
  let k = 0; let alive = true; onCleanup(() => { alive = false; });
  const scroll = () => { const s = o.scroller || box; s.scrollTop = s.scrollHeight; };
  const step = () => {
    if (!alive || o.stopped()) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const it = items[k++];
    if (!it.who){ box.insertAdjacentHTML("beforeend", it.html); scroll(); later(step, 500); return; }
    const t = typing(les.characters[it.who].name); box.appendChild(t); scroll();
    later(() => { if (!alive || o.stopped()) return; t.remove(); box.insertAdjacentHTML("beforeend", it.html); scroll(); later(step, it.wait || 650); }, o.typeMs || 1000);
  };
  later(step, o.delay || 500);
}

/* ============================================================
   privateChat — приватне повідомлення від персонажа (темний сюжетний екран)
   data: { who, msgs:[text], kicker, end, next, cta }
   ============================================================ */
define("privateChat", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, c = les.characters[d.who]; const A = store(ctx, scr, "dm");
  el.innerHTML = `<div class="story-screen">
    ${d.kicker ? `<p class="story-line">${esc(d.kicker)}</p>` : ""}
    <div class="dchat ix-dark">
      <div class="dhead"><span class="ix-ava lg">${S.face(c, { zoom:1.9 })}</span><div style="text-align:left"><b id="stitle" tabindex="-1">${esc(c.name)}</b><div class="rv-dsub">private message</div></div></div>
      <div id="pm" class="ix-hk" aria-live="polite"></div>
    </div>
    <div class="rv-tbc" id="tbc" hidden>${esc(d.end || "To be continued…")}</div>
    ${d.next ? `<div class="rv-next" id="nx" hidden>${esc(d.next)}</div>` : ""}
  </div>`;
  const box = $("#pm", el);
  const html = (t, anim) => bubble(les, { who:d.who, t }, { noName:true, anim });
  const finish = () => { $("#tbc", el).hidden = false; const n = $("#nx", el); if (n) n.hidden = false; A.seen = true; save(); };
  ctx.setCTA({ label: d.cta || "Continue" });
  if (reduced() || A.seen){ box.innerHTML = d.msgs.map(t => html(t)).join(""); finish(); return; }
  sequence(box, les, d.msgs.map(t => ({ who:d.who, html:html(t, true), wait:900 })), { stopped: () => false, done: () => later(finish, 700), delay:800, typeMs:1300 });
}, { story:true, label: () => "Private message" });

/* ============================================================
   pollTalk — обговорення + голосування-здогадка + опора + місія
   data: { title, say, ua, message:[..], questions:[{q,ua}], poll:[{id,t}], starter, example, mission }
   У Teacher view — лічильники голосів класу (counts:false — вимкнути, напр. для уроку один на один).
   ============================================================ */
define("pollTalk", (el, scr, ctx) => {
  const d = scr.data; const V = store(ctx, scr, "poll"); V.count = V.count || {};
  const T = Toggles();
  const draw = () => {
    const total = d.poll.reduce((a, p) => a + (V.count[p.id] || 0), 0);
    el.innerHTML = `${head(esc(d.title), d.say, d.ua, "Warm-up · talk and vote")}
      ${d.message ? `<div class="card rv-quote"><div class="rv-quote-h"><span class="ix-ava anon" aria-hidden="true">?</span><b>The mystery message</b></div>${d.message.map(t => `<p>“${esc(t)}”</p>`).join("")}</div>` : ""}
      <div class="card"><div class="row rv-cardhead"><h3 class="ix-h">💬 Talk about it</h3><span class="spacer"></span>${T.btn("pq-ua", UA, "ua")}</div>
        <ol class="rv-qlist">${d.questions.map((q, i) => `<li><span>${esc(q.q)}</span>${say(q.q)}</li>`).join("")}</ol>
        ${T.box("pq-ua", `<ol class="rv-qlist ua">${d.questions.map(q => `<li>${esc(q.ua)}</li>`).join("")}</ol>`)}
      </div>
      <div class="card"><h3 class="ix-h">🗳️ Vote: why did Marko send the message?</h3>
        <p class="muted" style="margin:0 0 10px">It's only a guess — we'll check it with evidence later.</p>
        <div class="rv-poll">${d.poll.map(p => { const n = V.count[p.id] || 0; return `<div class="rv-pollrow">
          <button class="opt ${V.pick === p.id ? "sel" : ""}" type="button" data-pick="${p.id}" aria-pressed="${V.pick === p.id}"><b class="rv-letter">${p.id}</b>${esc(p.t)}</button>
          ${ctx.teacher && d.counts !== false ? `<div class="rv-count" aria-label="Class votes for ${p.id}"><button class="icon-btn" type="button" data-cnt="${p.id}" data-d="-1" aria-label="Minus one vote">−</button><b>${n}</b><button class="icon-btn" type="button" data-cnt="${p.id}" data-d="1" aria-label="Plus one vote">+</button></div>
            <div class="rv-bar"><i style="width:${total ? Math.round(n / total * 100) : 0}%"></i></div>` : ""}
        </div>`; }).join("")}</div>
        ${ctx.teacher && d.counts !== false ? `<div class="row" style="margin-top:8px"><span class="muted">🧑‍🏫 Class votes: ${total}</span><span class="spacer"></span><button class="btn small link" type="button" data-cntreset>Reset votes</button></div>` : ""}
        ${V.pick ? `<div class="note info">Your guess: <b>${esc(V.pick)}</b>. Keep it in mind — we'll check it with evidence.</div>` : ""}
        <div class="ix-starter"><b>Explain your vote</b><p>${esc(d.starter)}</p></div>
        ${T.btn("pq-ex", EX)}
        ${T.box("pq-ex", `<p>${esc(d.example)} ${say(d.example, "Listen to the example")}</p>`, "help")}
      </div>
      <div class="rv-mission ix-reveal"><span>🎯 Today's mission</span><p>${esc(d.mission)}</p></div>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const p = e.target.closest("[data-pick]"); if (p){ V.pick = V.pick === p.dataset.pick ? null : p.dataset.pick; save(); draw(); return; }
    const c = e.target.closest("[data-cnt]"); if (c){ const k = c.dataset.cnt; V.count[k] = Math.max(0, (V.count[k] || 0) + +c.dataset.d); save(); draw(); return; }
    if (e.target.closest("[data-cntreset]")){ V.count = {}; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Talk & vote" });

/* ============================================================
   wordGaps — слова з банку в пропуски (натиснути слово → пропуск)
   data: { title, say, ua, bank:[..], items:[{who,t,a,why,ua}], after }
   ============================================================ */
define("wordGaps", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "gaps"); Q.place = Q.place || {};
  const T = Toggles();
  let sel = null, selSlot = null;
  const draw = () => {
    const used = Object.values(Q.place);
    const bank = d.bank.filter(w => !used.includes(w));
    const all = d.items.every((it, i) => Q.place[i]);
    const right = d.items.filter((it, i) => Q.place[i] === it.a).length;
    el.innerHTML = `${head(esc(d.title), d.say, d.ua, "Words · 6 situations")}
      <div class="card rv-bankcard">
        <div class="chips rv-bank" role="group" aria-label="Word bank">${bank.map(w => `<button class="chip ${sel === w ? "on" : ""}" type="button" data-w="${w}" aria-pressed="${sel === w}" ${Q.chk ? "disabled" : ""}>${esc(w)}</button>`).join("") || `<span class="muted">All the gaps are full ✓</span>`}</div>
        <p class="muted rv-tip">${Q.chk ? "Checked. Correct the red ones with Try again." : "Tap a word, then tap a gap. Tap a full gap to empty it."}</p>
      </div>
      <div class="rv-gaps">${d.items.map((it, i) => {
        const v = Q.place[i]; const ok = v === it.a; const res = Q.chk ? (ok ? "ok" : "no") : "";
        return `<div class="card rv-gapcard ${res}">
          <p class="rv-sit"><span class="rv-num">${i + 1}</span><span>${esc(it.t)}</span>${say(it.t)}</p>
          <p class="rv-so">So ${esc(it.who)} is <button class="rv-slot ${v ? "filled" : ""} ${(sel && !v) || selSlot === i ? "ready" : ""} ${res}" type="button" data-slot="${i}" ${Q.chk ? "disabled" : ""} aria-label="Gap ${i + 1}${v ? ": " + esc(v) : ""}">${v ? esc(v) : "______"}</button></p>
          ${Q.chk ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ " + esc(it.a) : "✗ The answer is <b>" + esc(it.a) + "</b>"} — ${esc(it.why)}</div>
            <div class="row" style="margin-top:8px">${T.btn("wg-ua" + i, UA, "ua")}</div>${T.box("wg-ua" + i, `<p>${it.ua}</p>`, "rv-uabox")}` : ""}
        </div>`; }).join("")}</div>
      ${Q.chk ? `<div class="note ${right === d.items.length ? "good" : "amber"}">${right} / ${d.items.length} correct. ${esc(d.after || "")}</div>` : ""}
      <div class="row rv-actions">
        ${Q.chk ? (right < d.items.length ? `<button class="btn primary" type="button" data-retry>↻ Try again</button>` : "") : `<button class="btn primary" type="button" data-check ${all ? "" : "disabled"}>Check</button>`}
        <button class="btn ghost" type="button" data-reset>Reset</button>
        ${!Q.chk && !all ? `<span class="muted">${d.items.length - Object.keys(Q.place).length} gap(s) left</span>` : ""}
      </div>`;
  };
  const put = (w, i) => { Object.keys(Q.place).forEach(k => { if (Q.place[k] === w) delete Q.place[k]; }); Q.place[i] = w; sel = null; selSlot = null; save(); draw(); };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const w = e.target.closest("[data-w]");
    if (w && !Q.chk){ if (selSlot != null) put(w.dataset.w, selSlot); else { sel = sel === w.dataset.w ? null : w.dataset.w; draw(); } return; }
    const s = e.target.closest("[data-slot]");
    if (s && !Q.chk){
      const i = +s.dataset.slot;
      if (sel) put(sel, i);
      else if (Q.place[i]){ delete Q.place[i]; save(); draw(); }
      else { selSlot = selSlot === i ? null : i; draw(); }
      return;
    }
    if (e.target.closest("[data-check]")){
      Q.chk = true; Q.score = d.items.filter((it, i) => Q.place[i] === it.a).length;
      if (!Q.firstDone){ Q.firstDone = true; d.items.forEach((it, i) => S.wordResult(it.a, Q.place[i] === it.a)); }
      save(); draw(); return;
    }
    if (e.target.closest("[data-retry]")){ d.items.forEach((it, i) => { if (Q.place[i] !== it.a) delete Q.place[i]; }); Q.chk = false; save(); draw(); return; }
    if (e.target.closest("[data-reset]")){ Q.place = {}; Q.chk = false; sel = null; selSlot = null; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "6 situations" });

/* ============================================================
   photoTalk — опис зовнішності за фото + питання про характер + довідник
   data: { c, cap, describe, describeUa, help:[..], describeEx, think, thinkUa, thinkEx, glossary:[{w,en,ua,ex}] }
   ============================================================ */
define("photoTalk", (el, scr, ctx) => {
  const d = scr.data; const c = ctx.les.characters[d.c]; const f = c.face || { x:50, y:40 };
  const T = Toggles();
  const personality = (d.glossary || []).filter(v => v.g === "personality"), hair = (d.glossary || []).filter(v => v.g !== "personality");
  const row = v => `<li><div class="rv-gw"><b>${esc(v.w)}</b>${say(v.w)}</div><span class="rv-gen">${esc(v.en)}</span><span class="rv-gua">${esc(v.ua)}</span><i class="rv-gex">${esc(v.ex)}</i></li>`;
  el.innerHTML = `${head(esc(d.title || "Look at the photo"), "Describe the person. Then think about the question.", "Опиши людину. Потім подумай над питанням.", "Words · speaking")}
    <div class="rv-photogrid">
      <figure class="ix-fig"><div class="ix-photo"><img src="${c.img}" alt="${esc(c.name)}" decoding="async" style="object-position:${f.x}% ${f.y}%"></div><figcaption>${esc(d.cap || c.name)}</figcaption></figure>
      <div class="rv-stack">
        <div class="card"><p class="q-big" style="margin:0">1. ${esc(d.describe)}</p>
          <div class="chips" style="margin-top:12px">${d.help.map(h => `<span class="chip sm ix-mk">${esc(h)}</span>`).join("")}</div>
          <div class="row" style="margin-top:12px">${T.btn("pt-ua1", UA, "ua")}${T.btn("pt-ex1", EX)}</div>
          ${T.box("pt-ua1", `<p>${esc(d.describeUa)}</p>`, "rv-uabox")}
          ${T.box("pt-ex1", `<p>${esc(d.describeEx)} ${say(d.describeEx, "Listen to the example")}</p>`, "help")}
        </div>
        <div class="card"><p class="q-big" style="margin:0">2. ${esc(d.think)}</p>
          <div class="row" style="margin-top:12px">${T.btn("pt-ua2", UA, "ua")}${T.btn("pt-ex2", EX)}</div>
          ${T.box("pt-ua2", `<p>${esc(d.thinkUa)}</p>`, "rv-uabox")}
          ${T.box("pt-ex2", `<p>${esc(d.thinkEx)} ${say(d.thinkEx, "Listen to the example")}</p>`, "help")}
        </div>
      </div>
    </div>
    ${personality.length ? `<details class="card rv-gloss"><summary>📖 Word bank from Episode 1 <span class="muted">(optional)</span></summary>
      <p class="muted" style="margin:.6em 0">word → simple meaning → Ukrainian → example</p>
      <ul>${personality.map(row).join("")}</ul>
      ${hair.length ? `<h4 class="rv-glh">Hair</h4><ul>${hair.map(row).join("")}</ul>` : ""}
    </details>` : ""}`;
  el.onclick = e => { T.handle(e, el); };
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Photo" });

/* ============================================================
   stepChat — чат, що відкривається кнопкою «Next message»
   data: { title, say, ua, predict:{q,ua,ex}, msgs:[{who,time,t,ua}|{sys,ua}], qs:[{q,ua,a}], me, chat, sub }
   ============================================================ */
define("stepChat", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const A = store(ctx, scr, "chat"); A.n = A.n || 0;
  const N = d.msgs.length; const T = Toggles();
  const opts = anim => ({ me:d.me, ua:A.ua, anim });
  const qsHTML = () => A.n < N ? `<div class="note info">The questions appear after the last message.</div>`
    : `<div class="card ix-reveal"><div class="row rv-cardhead"><h3 class="ix-h">🔎 After reading</h3><span class="spacer"></span>${T.all(d.qs.map((q, i) => "sa" + i), "Show all answers")}</div>
        ${d.qs.map((q, i) => `<div class="rv-qa"><p class="rv-q"><span class="rv-num">${i + 1}</span><span>${esc(q.q)}</span>${say(q.q)}</p>
          <div class="row">${T.btn("su" + i, UA, "ua")}${T.btn("sa" + i, ANS)}</div>
          ${T.box("su" + i, `<p>${esc(q.ua)}</p>`, "rv-uabox")}
          ${T.box("sa" + i, `<p>${esc(q.a)}</p>`, "help")}</div>`).join("")}
      </div>`;
  const draw = () => {
    el.innerHTML = `${head(esc(d.title), d.say, d.ua, "Reading · the chat")}
      ${d.predict ? `<div class="card rv-predict"><b class="rv-lab">Before you read</b><div class="rv-q" style="margin-top:4px"><span class="q-big" style="flex:1">${esc(d.predict.q)}</span>${say(d.predict.q)}</div>
        <div class="row" style="margin-top:10px">${T.btn("pr-ua", UA, "ua")}${d.predict.ex ? T.btn("pr-ex", EX) : ""}</div>
        ${T.box("pr-ua", `<p>${esc(d.predict.ua)}</p>`, "rv-uabox")}${d.predict.ex ? T.box("pr-ex", `<p>${esc(d.predict.ex)}</p>`, "help") : ""}</div>` : ""}
      <div class="ix-phone rv-phone ${A.n >= N ? "full" : ""}">
        <div class="ix-phone-head"><span class="ix-gava" aria-hidden="true">🔍</span><div><b>${esc(d.chat)}</b><small>${esc(d.sub || "")}</small></div></div>
        <div class="ix-thread" id="th" aria-live="polite">${A.n ? d.msgs.slice(0, A.n).map(m => bubble(les, m, opts(false))).join("") : `<div class="ix-sys rv-still">Tap “Next message” to start.</div>`}</div>
        <div class="ix-phone-foot">
          <button class="btn small rv-nextmsg" type="button" data-next ${A.n >= N ? "disabled" : ""}>${A.n >= N ? "All messages ✓" : `Next message ▸ <span class="rv-cnt">${A.n + 1}/${N}</span>`}</button>
          <span class="spacer"></span>
          ${A.n < N ? `<button class="btn small link" type="button" data-all>Show full chat</button>` : `<button class="btn small link" type="button" data-restart>↻ Start again</button>`}
        </div>
      </div>
      <div class="row rv-under"><button class="rv-tog ua ${A.ua ? "on" : ""}" type="button" data-chatua aria-pressed="${!!A.ua}">UA · ${A.ua ? "hide" : "show"} the translation</button></div>
      <div id="qs">${qsHTML()}</div>`;
    const th = $("#th", el); th.scrollTop = th.scrollHeight;
  };
  const next = () => {
    if (A.n >= N) return;
    const th = $("#th", el);
    if (!A.n) th.innerHTML = "";
    th.insertAdjacentHTML("beforeend", bubble(les, d.msgs[A.n], opts(true)));
    A.n++; save();
    th.scrollTop = th.scrollHeight;
    const b = $("[data-next]", el);
    if (A.n >= N) draw();
    else b.innerHTML = `Next message ▸ <span class="rv-cnt">${A.n + 1}/${N}</span>`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-next]")){ next(); return; }
    if (e.target.closest("[data-all]")){ A.n = N; save(); draw(); return; }
    if (e.target.closest("[data-restart]")){ A.n = 0; save(); draw(); return; }
    if (e.target.closest("[data-chatua]")){ A.ua = !A.ua; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Chat" });

/* ============================================================
   discoverQs — два приклади + discovery-питання з прихованими відповідями
   + нагадування про форми + коротка примітка
   data: { title, say, ua, examples:[..] (розмітка [v:][a:][i:][m:]), qs:[{q,a}],
           forms:[{name,q,uses,rows:[[sign, he-form, other]]}], stative:{t,ex:[..]} }
   ============================================================ */
define("discoverQs", (el, scr, ctx) => {
  const d = scr.data; const A = store(ctx, scr, "disc");
  const T = Toggles();
  const draw = () => {
    el.innerHTML = `${head(esc(d.title), d.say, d.ua, "Grammar · discover")}
      <div class="card"><div class="row rv-cardhead"><h3 class="ix-h">💬 From the chat</h3><span class="spacer"></span><button class="rv-tog ${A.hl ? "on" : ""}" type="button" data-hl aria-pressed="${!!A.hl}">🖍 Highlight</button></div>
        <div class="ix-pair ${A.hl ? "hl-v hl-a hl-i hl-m" : ""}">${d.examples.map((s, i) => `<div class="ix-sent"><b class="rv-num">${i + 1}</b><span style="flex:1">${tok(s)}</span>${say(s)}</div>`).join("")}</div>
      </div>
      <div class="card"><div class="row rv-cardhead"><h3 class="ix-h">🔎 Discovery questions</h3><span class="spacer"></span>${T.all(d.qs.map((q, i) => "dq" + i), "Show all answers")}</div>
        ${d.qs.map((q, i) => `<div class="rv-qa"><p class="rv-q"><span class="rv-num">${i + 1}</span><span>${esc(q.q)}</span></p>${T.btn("dq" + i, ANS)}${T.box("dq" + i, `<p>${esc(q.a)}</p>`, "help")}</div>`).join("")}
      </div>
      <div class="rv-forms">${d.forms.map((f, k) => `<section class="ix-rule ${k ? "pc" : "ps"}">
          <h3>${esc(f.name)}</h3><p class="rv-fq">${esc(f.q)} <span class="muted">· ${esc(f.uses)}</span></p>
          <table class="rv-ftable"><tbody>${f.rows.map(r => `<tr><th scope="row">${esc(r[0])}</th><td><b>${esc(r[1])}</b><small>${esc(r[2])}</small></td></tr>`).join("")}</tbody></table>
        </section>`).join("")}</div>
      ${d.stative ? `<div class="note info rv-stative">💡 ${esc(d.stative.t)}<span>${d.stative.ex.map(x => `<i>${esc(x)}</i>`).join(" ")}</span></div>` : ""}`;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-hl]")){ A.hl = !A.hl; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Discover" });

/* ============================================================
   gapChoice — усі речення на одному екрані: контекст + вибір форми
   data: { title, say, ua, items:[{ctx,pre,post,o:[..],a,why,kind}] }
   Check → правильна форма й причина; Try again — виправити помилки; Reset — усе з нуля.
   ============================================================ */
define("gapChoice", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "practice"); Q.pick = Q.pick || {};
  const n = d.items.length;
  const draw = () => {
    const all = d.items.every((it, i) => Q.pick[i] != null);
    const right = d.items.filter((it, i) => Q.pick[i] === it.a).length;
    el.innerHTML = `${head(esc(d.title), d.say, d.ua, `Grammar · practice · ${n} sentences`)}
      ${d.items.map((it, i) => {
        const p = Q.pick[i]; const ok = p === it.a; const res = Q.chk ? (ok ? "ok" : "no") : "";
        return `<div class="card rv-gc ${res}">
          <p class="rv-ctx"><span class="rv-num">${i + 1}</span>${esc(it.ctx)}</p>
          <p class="rv-sent">${esc(it.pre)} <span class="ix-blank ${res}">${p != null ? esc(it.o[p]) : "_____"}</span> ${esc(it.post)}</p>
          <div class="chips">${it.o.map((o, k) => { let cls = ""; if (Q.chk){ if (k === it.a && ok) cls = "good"; else if (k === p) cls = "bad"; } else if (k === p) cls = "on"; return `<button class="chip ${cls}" type="button" data-q="${i}" data-o="${k}" aria-pressed="${k === p}" ${Q.chk ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
          ${Q.chk ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ " : "✗ The answer is: "}<b>${esc(it.o[it.a])}</b><br><span class="rv-why">${esc(it.kind ? it.kind + " — " : "")}${esc(it.why)}</span></div>` : ""}
        </div>`; }).join("")}
      ${Q.chk ? `<div class="note ${right === n ? "good" : "amber"}">${right} / ${n} correct.${right < n ? " Tap Try again and correct the red ones." : " Great work!"}</div>` : ""}
      <div class="row rv-actions">
        ${Q.chk ? (right < n ? `<button class="btn primary" type="button" data-retry>↻ Try again</button>` : "") : `<button class="btn primary" type="button" data-check ${all ? "" : "disabled"}>Check</button>`}
        <button class="btn ghost" type="button" data-reset>Reset</button>
        ${!Q.chk && !all ? `<span class="muted">${n - Object.keys(Q.pick).length} left</span>` : ""}
      </div>`;
  };
  el.onclick = e => {
    const o = e.target.closest("[data-o]"); if (o && !Q.chk){ Q.pick[o.dataset.q] = +o.dataset.o; save(); draw(); return; }
    if (e.target.closest("[data-check]")){ Q.chk = true; Q.score = d.items.filter((it, i) => Q.pick[i] === it.a).length; if (Q.best == null || Q.score > Q.best) Q.best = Q.score; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ d.items.forEach((it, i) => { if (Q.pick[i] !== it.a) delete Q.pick[i]; }); Q.chk = false; save(); draw(); return; }
    if (e.target.closest("[data-reset]")){ Q.pick = {}; Q.chk = false; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: d => d.items.length + " sentences" });

/* ============================================================
   breakout — картка доказів, завдання, ролі, таймер, командна відповідь
   data: { title, say, ua, evidence:[{k,e,t}], steps:[..], stepsUa:[..], must:[..], starters:[..],
           roles:[{r,e,t}], pairs, timer (хв), words:[..] }
   ============================================================ */
define("breakout", (el, scr, ctx) => {
  const d = scr.data; const B = store(ctx, scr, "rooms");
  const def = (d.timer || 7) * 60;
  B.tm = B.tm || { total:def, left:def, at:null }; B.ck = B.ck || {};
  const T = Toggles();
  const remaining = () => B.tm.at ? Math.max(0, B.tm.left - (Date.now() - B.tm.at) / 1000) : B.tm.left;
  let tick = null; onCleanup(() => clearInterval(tick));
  const hints = () => {
    const t = String(B.text || "").replace(/[’‘]/g, "'");
    const sents = t.split(/[.!?\n]+/).map(s => s.trim()).filter(s => S.wordCount(s) >= 2);
    let ps = 0, pc = 0;
    sents.forEach(s => s.split(/\bbut\b|,/i).forEach(p => { if (PC.test(p)) pc++; else if (PS.test(p)) ps++; }));
    const words = (d.words || []).filter((w, i, a) => a.indexOf(w) === i && new RegExp("\\b" + w + "\\b", "i").test(t));
    return !t.trim() ? `<span class="muted">Hints appear when you write.</span>`
      : `<span class="${sents.length >= 4 && sents.length <= 5 ? "ok" : ""}">📏 ${sents.length} sentence(s)</span>
         <span class="${ps ? "ok" : ""}">${ps ? "✓" : "…"} Present Simple</span>
         <span class="${pc ? "ok" : ""}">${pc ? "✓" : "…"} Present Continuous</span>
         <span class="${words.length >= 2 ? "ok" : ""}">🏷️ ${words.length ? esc(words.join(", ")) : "no character words yet"}</span>`;
  };
  const timerUI = () => {
    const r = remaining(); const box = $("#tmr", el); if (!box) return;
    $("#tm", el).textContent = fmt(r);
    $("#tmbar", el).style.width = Math.round(r / Math.max(1, B.tm.total) * 100) + "%";
    box.classList.toggle("run", !!B.tm.at); box.classList.toggle("end", r <= 0);
    $("#tmgo", el).textContent = B.tm.at ? "❚❚ Pause" : r <= 0 ? "▶ Start" : B.tm.left < B.tm.total ? "▶ Resume" : "▶ Start";
    $("#tmend", el).hidden = r > 0;
    if (B.tm.at && r <= 0){ B.tm.left = 0; B.tm.at = null; save(); clearInterval(tick); timerUI(); }
  };
  const run = () => { clearInterval(tick); if (B.tm.at) tick = setInterval(timerUI, 250); timerUI(); };
  el.innerHTML = `${head(esc(d.title), d.say, d.ua, "Breakout rooms · groups of 2–3")}
    <div class="card rv-ev"><h3 class="ix-h">🗂️ Evidence card</h3>
      <div class="rv-evgrid">${d.evidence.map(x => `<div class="rv-evi"><b><span aria-hidden="true">${x.e}</span> ${esc(x.k)}</b><p>${esc(x.t)}</p></div>`).join("")}</div>
    </div>
    <div class="card rv-timer" id="tmr" role="timer" aria-label="Breakout timer">
      <div class="rv-tmtop"><span class="rv-lab">⏱ Breakout timer</span><b id="tm" class="rv-tm">${fmt(remaining())}</b></div>
      <div class="rv-tmbar"><i id="tmbar"></i></div>
      <div class="row" style="margin-top:12px">
        <button class="btn primary" type="button" data-tm="go" id="tmgo">▶ Start</button>
        <button class="btn" type="button" data-tm="minus" aria-label="One minute less">− 1 min</button>
        <button class="btn" type="button" data-tm="plus" aria-label="One minute more">+ 1 min</button>
        <span class="spacer"></span>
        <button class="btn ghost" type="button" data-tm="reset">↻ ${d.timer || 7}:00</button>
      </div>
      <div class="note amber" id="tmend" hidden>⏰ Time's up! Come back to the main room and choose your speaker.</div>
    </div>
    <div class="ix-cols rv-cols">
      <div class="card"><div class="row rv-cardhead"><h3 class="ix-h">📝 Your task</h3><span class="spacer"></span>${T.btn("bo-ua", UA, "ua")}</div>
        <ol class="rv-steps">${d.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
        ${T.box("bo-ua", `<ol class="rv-steps">${d.stepsUa.map(s => `<li>${esc(s)}</li>`).join("")}</ol>`, "rv-uabox")}
        <p class="rv-lab" style="margin-top:12px">Your answer: 4–5 sentences with</p>
        <ul class="rv-must">${d.must.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
      </div>
      <div class="card"><h3 class="ix-h">👥 Roles</h3>
        <ul class="rv-roles">${d.roles.map(r => `<li><span aria-hidden="true">${r.e}</span><div><b>${esc(r.r)}</b><small>${esc(r.t)}</small></div></li>`).join("")}</ul>
        <p class="muted" style="margin:.6em 0 0">${esc(d.pairs)}</p>
        <p class="rv-lab" style="margin-top:14px">Useful starters <span class="muted">(tap to add)</span></p>
        <div class="chips">${d.starters.map(s => `<button class="chip sm" type="button" data-st="${esc(s)}">${esc(s)}</button>`).join("")}</div>
      </div>
    </div>
    <div class="card"><h3 class="ix-h">✍️ Our message <span class="muted" style="font-weight:600">(optional — you can also just say it)</span></h3>
      <textarea id="bt" aria-label="Our team answer" placeholder="We think Marko … because … He usually … Today he is … Our message to him is: …">${esc(B.text || "")}</textarea>
      <div class="rv-hints" id="bh">${hints()}</div>
      <p class="rv-lab" style="margin-top:12px">Our checklist</p>
      <ul class="rv-checks">${d.must.map((m, i) => `<li><label><input type="checkbox" data-ck="${i}" ${B.ck[i] ? "checked" : ""}> ${esc(m)}</label></li>`).join("")}</ul>
    </div>`;
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const st = e.target.closest("[data-st]");
    if (st){ const ta = $("#bt", el); ta.value = (ta.value.trim() ? ta.value.trim() + " " : "") + st.dataset.st; B.text = ta.value; save(); $("#bh", el).innerHTML = hints(); ta.focus(); return; }
    const t = e.target.closest("[data-tm]"); if (!t) return;
    const r = remaining();
    const fresh = !B.tm.at && B.tm.left === B.tm.total;   /* ще не запускали: змінюємо тривалість */
    if (t.dataset.tm === "go"){ if (B.tm.at){ B.tm.left = r; B.tm.at = null; } else { if (r <= 0){ B.tm.left = B.tm.total; } B.tm.at = Date.now(); } }
    if (t.dataset.tm === "plus"){ B.tm.left = r + 60; B.tm.total = fresh ? B.tm.left : Math.max(B.tm.total, B.tm.left); if (B.tm.at) B.tm.at = Date.now(); }
    if (t.dataset.tm === "minus"){ B.tm.left = Math.max(fresh ? 60 : 0, r - 60); if (fresh) B.tm.total = B.tm.left; if (B.tm.at) B.tm.at = Date.now(); }
    if (t.dataset.tm === "reset"){ B.tm = { total:def, left:def, at:null }; }
    save(); run();
  };
  el.oninput = e => { if (e.target.id === "bt"){ B.text = e.target.value; save(); $("#bh", el).innerHTML = hints(); } };
  el.onchange = e => { const c = e.target.closest("[data-ck]"); if (c){ B.ck[c.dataset.ck] = c.checked; save(); } };
  run();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Breakout" });

/* ============================================================
   confession — «справжнє повідомлення»: відкривається кнопкою в будь-який момент
   data: { who, msgs:[text], msgsUa, replies:[{who,t,ua}], after:[{q,ua,ex}], chat, sub,
           title, kicker, intro, introUa, openLabel }
   ============================================================ */
define("confession", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les, c = les.characters[d.who]; const R = store(ctx, scr, "real");
  const T = Toggles();
  const items = anim => {
    const list = d.msgs.map((t, i) => ({ who:d.who, html:bubble(les, { who:d.who, t }, { anim, noName:i > 0 }), wait:1000 }));
    list.push({ html: `<div class="ix-sys ${anim ? "" : "rv-still"}">Nate reacted ❤️</div>` });
    d.replies.forEach(r => list.push({ who:r.who, html:bubble(les, r, { anim }), wait:900 }));
    return list;
  };
  const afterHTML = () => `<div class="row rv-under">${T.btn("cf-ua", "UA · translation", "ua")}${say(d.msgs.join(" "), "Listen to Marko's message")}<span class="muted" style="font-size:.88rem">🔊 reads Marko's message</span></div>
    ${T.box("cf-ua", `<p><b>Marko:</b> ${esc(d.msgsUa)}</p>${d.replies.map(r => `<p><b>${esc(les.characters[r.who].name)}:</b> ${esc(r.ua)}</p>`).join("")}`, "rv-uabox")}
    <div class="card ix-reveal" style="margin-top:14px"><h3 class="ix-h">💬 What do you think?</h3>
      ${d.after.map((q, i) => `<div class="rv-qa"><p class="rv-q"><span class="rv-num">${i + 1}</span><span>${esc(q.q)}</span>${say(q.q)}</p>
        <div class="row">${T.btn("cq-ua" + i, UA, "ua")}${T.btn("cq-ex" + i, EX)}</div>
        ${T.box("cq-ua" + i, `<p>${esc(q.ua)}</p>`, "rv-uabox")}${T.box("cq-ex" + i, `<p>${esc(q.ex)}</p>`, "help")}</div>`).join("")}
      <div class="ix-starter"><b>Useful language</b><p>I think it was / wasn't a good idea because … · He could …</p></div>
    </div>`;
  const draw = () => {
    if (!R.open){
      el.innerHTML = `${head(esc(d.title || "The real message"), d.intro || "When you are ready, open the message.", d.introUa || "Коли будете готові, відкрийте повідомлення.", esc(d.kicker || "The truth"))}
        <div class="card rv-sealed">
          <span class="ix-ava lg">${S.face(c, { zoom:1.9 })}</span>
          <p><b>${esc(c.name)}</b> is writing a proper message to the group…</p>
          <button class="btn primary big" type="button" data-open>📩 ${esc(d.openLabel || "Open the real message")}</button>
        </div>`;
      return;
    }
    el.innerHTML = `${head(esc(d.title || "The real message"), "", "", esc(d.kicker || "The truth"))}
      <div class="ix-phone rv-phone full">
        <div class="ix-phone-head"><span class="ix-gava" aria-hidden="true">🎙️</span><div><b>${esc(d.chat)}</b><small>${esc(d.sub || "")}</small></div></div>
        <div class="ix-thread" id="th" aria-live="polite"></div>
        <div class="ix-phone-foot"><span class="spacer"></span><button class="btn small link" type="button" data-skip ${R.seen ? "hidden" : ""}>Show all</button></div>
      </div>
      <div id="aft">${R.seen ? afterHTML() : ""}</div>`;
    const th = $("#th", el);
    const done = () => { if (R.seen && $("#aft", el).innerHTML) return; R.seen = true; save(); const s = $("[data-skip]", el); if (s) s.hidden = true; $("#aft", el).innerHTML = afterHTML(); };
    if (R.seen || reduced()){ th.innerHTML = items(false).map(x => x.html).join(""); done(); return; }
    let stop = false;
    sequence(th, les, items(true), { stopped: () => stop, done, typeMs:1000, delay:400 });
    el.onclick = e => {
      if (T.handle(e, el)) return;
      if (e.target.closest("[data-skip]")){ stop = true; th.innerHTML = items(false).map(x => x.html).join(""); done(); }
    };
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-open]")){ R.open = true; save(); draw(); }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Real message" });

/* ============================================================
   talkCards — кілька питань для speaking з UA і прихованими прикладами
   data: { title, say, ua, kicker, qs:[{q,ua,ex}], phrases:[..] }
   ============================================================ */
define("talkCards", (el, scr, ctx) => {
  const d = scr.data; const T = Toggles();
  el.innerHTML = `${head(esc(d.title), d.say, d.ua, esc(d.kicker || "Speaking"))}
    <div class="note info" style="margin-top:0">🎭 You can talk about yourself — or invent a character.</div>
    ${d.qs.map((q, i) => `<div class="card rv-talk"><p class="rv-q"><span class="rv-num">${i + 1}</span><span class="q-big">${esc(q.q)}</span>${say(q.q)}</p>
      <div class="row">${T.btn("tk-ua" + i, UA, "ua")}${T.btn("tk-ex" + i, EX)}</div>
      ${T.box("tk-ua" + i, `<p>${esc(q.ua)}</p>`, "rv-uabox")}
      ${T.box("tk-ex" + i, `<p>${esc(q.ex)} ${say(q.ex, "Listen to the example")}</p>`, "help")}</div>`).join("")}
    ${d.phrases ? `<div class="card"><h3 class="ix-h">💬 Useful language</h3><p style="margin:0">${d.phrases.map(p => `<span class="starter rv-starter">${esc(p)}</span>`).join("")}</p></div>` : ""}`;
  el.onclick = e => { T.handle(e, el); };
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Speaking" });

/* ============================================================
   exitTicket — чотири речення + чекліст самоперевірки (без автоперевірки)
   data: { title, fields:[{id,label,ph}], example:[..], checklist:[..] }
   ============================================================ */
define("exitTicket", (el, scr, ctx) => {
  const d = scr.data; const E = store(ctx, scr, "ticket"); E.f = E.f || {}; E.ck = E.ck || {};
  const T = Toggles();
  const draw = () => {
    el.innerHTML = `${head(esc(d.title || "Exit ticket"), "Write four sentences about yourself — or about an invented character.", "Напиши чотири речення про себе або про вигаданого персонажа.", "Speaking · exit ticket 🎟️")}
      <div class="card rv-ticket">
        ${d.fields.map((f, i) => `<div class="field"><label for="xt${i}">${i + 1}. ${esc(f.label)}</label><input type="text" id="xt${i}" data-f="${f.id}" value="${esc(E.f[f.id] || "")}" placeholder="${esc(f.ph)}" autocomplete="off"></div>`).join("")}
        <div class="row">${T.btn("xt-ex", EX)}<span class="spacer"></span><button class="btn small ghost" type="button" data-clear>${E.clearAsk ? "Tap again to clear" : "Clear"}</button></div>
        ${T.box("xt-ex", d.example.map(s => `<p style="margin:.2em 0">${esc(s)}</p>`).join(""), "help")}
      </div>
      <div class="card"><h3 class="ix-h">✅ Check your sentences</h3>
        <ul class="rv-checks">${d.checklist.map((c, i) => `<li><label><input type="checkbox" data-ck="${i}" ${E.ck[i] ? "checked" : ""}> ${esc(c)}</label></li>`).join("")}</ul>
      </div>`;
  };
  el.oninput = e => { const f = e.target.closest("[data-f]"); if (f){ E.f[f.dataset.f] = f.value; save(); } };
  el.onchange = e => { const c = e.target.closest("[data-ck]"); if (c){ E.ck[c.dataset.ck] = c.checked; save(); } };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    if (e.target.closest("[data-clear]")){
      if (!E.clearAsk){ E.clearAsk = true; draw(); later(() => { if (E.clearAsk){ E.clearAsk = false; const b = $("[data-clear]", el); if (b) b.textContent = "Clear"; } }, 3000); return; }
      E.f = {}; E.ck = {}; E.clearAsk = false; save(); draw();
    }
  };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Exit ticket" });

/* ============================================================
   caseClosed — фінальний екран епізоду (темний)
   data: { big, line, summary, cast:[ids] }
   ============================================================ */
define("caseClosed", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les;
  el.innerHTML = `<div class="story-screen rv-final">
    ${d.cast ? `<div class="rv-cast" aria-hidden="true">${d.cast.filter(id => les.characters[id]).map(id => `<span class="ix-ava lg">${S.face(les.characters[id], { zoom:1.9 })}</span>`).join("")}</div>` : ""}
    <h2 class="story-time rv-closed" id="stitle" tabindex="-1">${esc(d.big)}</h2>
    <p class="rv-finalline">${esc(d.line)}</p>
    <div class="card rv-summary"><b class="rv-lab">Summary</b><p>${esc(d.summary)}</p></div>
  </div>`;
  ctx.setCTA({ label:"Finish episode 🎉" });
}, { story:true, label: () => "Case closed" });

/* ============================================================
   sortBoard — «Evidence Board»: 1) розклади картки по колонках,
   2) познач зірочкою найкорисніші докази, 3) поясни свою версію.
   Картки перемішуються при першому відкритті. Перетягування або
   «натисни картку → обери колонку» (для планшета). Зірочки й версія
   не оцінюються автоматично.
   data: { title, intro, introUa, tip, cols:[{id,t,sub,e}], cards:[{id,t,ua,a,why}],
           stars, starPrompt, starUa, questions:[{q,ua}], help:[..], words:[..],
           theoryPh, checklist:[..] }
   ============================================================ */
define("sortBoard", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "eb");
  const need = d.stars || 3;
  if (!Array.isArray(Q.order) || Q.order.length !== d.cards.length){
    const ids = d.cards.map(c => c.id);
    for (let i = ids.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    Q.order = ids; save();
  }
  Q.place = Q.place || {}; Q.stars = Q.stars || []; Q.ck = Q.ck || {};
  const T = Toggles();
  let sel = null, moved = null;
  const card = id => d.cards.find(c => c.id === id);
  const col = id => d.cols.find(c => c.id === id);
  const letter = id => String.fromCharCode(65 + Q.order.indexOf(id));   /* A–F у порядку показу */
  const theoryHints = () => {
    const t = String(Q.theory || "").replace(/[’‘]/g, "'");
    if (!t.trim()) return `<span class="muted">Hints appear when you write.</span>`;
    let ps = 0, pc = 0;
    t.split(/[.!?\n]+/).forEach(s => s.split(/\bbut\b|,/i).forEach(p => { if (PC.test(p)) pc++; else if (PS.test(p)) ps++; }));
    const words = (d.words || []).filter((w, i, a) => a.indexOf(w) === i && new RegExp("\\b" + w + "\\b", "i").test(t));
    return `<span class="${ps ? "ok" : ""}">${ps ? "✓" : "…"} Present Simple</span><span class="${pc ? "ok" : ""}">${pc ? "✓" : "…"} Present Continuous</span><span class="${words.length ? "ok" : ""}">🏷️ ${words.length ? esc(words.join(", ")) : "no character words yet"}</span>`;
  };
  const cardHTML = id => {
    const c = card(id); const at = Q.place[id] || "";
    const ok = at === c.a; const res = Q.chk && at ? (ok ? "ok" : "no") : "";
    const star = Q.stars.includes(id);
    const moves = d.cols.filter(x => x.id !== at);
    return `<div class="eb-card ${sel === id ? "sel" : ""} ${moved === id ? "moved" : ""} ${res} ${star ? "starred" : ""}" data-card="${id}" draggable="${Q.chk ? "false" : "true"}" tabindex="0" role="button" aria-pressed="${sel === id}" aria-label="Card ${letter(id)}${at ? ", in " + esc(col(at).t) : ""}">
      <div class="eb-ctop"><b class="eb-letter">${letter(id)}</b>${res ? `<span class="eb-mark">${ok ? "✓ Correct" : "✗ Not here"}</span>` : ""}${star ? `<span class="eb-mark eb-starmark">★ Clue</span>` : ""}</div>
      <p class="eb-text">${esc(c.t)}</p>
      <div class="eb-cbot">${T.btn("eb-ua-" + id, UA, "ua sm")}${Q.step2 ? `<button class="eb-star ${star ? "on" : ""}" type="button" data-star="${id}" aria-pressed="${star}">${star ? "★ Selected" : "☆ Choose as a clue"}</button>` : ""}</div>
      ${T.box("eb-ua-" + id, `<p>${esc(c.ua)}</p>`, "rv-uabox")}
      ${res ? `<div class="eb-res ${res}">${ok ? "✓ " + esc(col(c.a).t) : "✗ It goes in " + esc(col(c.a).t)} — ${esc(c.why)}</div>` : ""}
      ${sel === id && !Q.chk ? `<div class="eb-choose" role="group" aria-label="Move card ${letter(id)}">${moves.map(m => `<button class="eb-mv" type="button" data-move="${m.id}">${m.e} ${esc(m.t)}</button>`).join("")}${at ? `<button class="eb-mv back" type="button" data-move="">↩ Back</button>` : ""}</div>` : ""}
    </div>`;
  };
  const draw = () => {
    const tray = Q.order.filter(id => !Q.place[id]);
    const all = !tray.length;
    const right = d.cards.filter(c => Q.place[c.id] === c.a).length;
    el.innerHTML = `${head(esc(d.title), "", "", "Evidence board · one to one")}
      <div class="card eb-intro">
        <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="eb-inst">${esc(d.intro)}</p>${T.btn("eb-ua-intro", UA, "ua")}</div>
        ${T.box("eb-ua-intro", `<p>${esc(d.introUa)}</p>`, "rv-uabox")}
        ${d.tip ? `<p class="eb-tip">💡 ${esc(d.tip)}</p>` : ""}
      </div>
      <div class="eb-board">
        <div class="eb-steph"><b>Step 1</b> Sort the cards <span class="muted">— drag a card, or tap it and choose a column</span></div>
        <div class="eb-tray ${sel && Q.place[sel] ? "ready" : ""}" data-col="">${tray.map(cardHTML).join("") || `<p class="eb-empty">All six cards are on the board ✓</p>`}</div>
        <div class="eb-cols">${d.cols.map(c => { const ids = Q.order.filter(id => Q.place[id] === c.id); return `
          <section class="eb-col ${sel && Q.place[sel] !== c.id && !Q.chk ? "ready" : ""}" data-col="${c.id}" aria-label="${esc(c.t)}">
            <button class="eb-colh" type="button" data-colbtn="${c.id}" ${Q.chk ? "disabled" : ""}><span aria-hidden="true">${c.e}</span><b>${esc(c.t)}</b><small>${esc(c.sub)}</small></button>
            ${ids.map(cardHTML).join("") || `<p class="eb-empty">${sel && !Q.chk ? "Tap here to put the card in this column" : "Drop cards here"}</p>`}
          </section>`; }).join("")}</div>
        ${Q.chk ? `<div class="note ${right === d.cards.length ? "good" : "amber"}">${right === d.cards.length ? "✓" : "✗"} ${right} / ${d.cards.length} cards in the right column. ${right === d.cards.length ? "Great sorting!" : "Tap Try again and move the cards marked ✗."}</div>` : ""}
        <div class="row rv-actions">
          ${Q.chk ? (right < d.cards.length ? `<button class="btn primary" type="button" data-retry>↻ Try again</button>` : "") : `<button class="btn primary" type="button" data-check ${all ? "" : "disabled"}>Check</button>`}
          <button class="btn ghost eb-ghost" type="button" data-reset>Reset</button>
          ${!Q.chk && !all ? `<span class="eb-left">${tray.length} card(s) left</span>` : ""}
          ${!Q.step2 ? `<span class="spacer"></span><button class="btn small link eb-link" type="button" data-step2>Skip to step 2 →</button>` : ""}
        </div>
      </div>
      ${Q.step2 ? `<div class="card eb-step2 ix-reveal">
        <div class="row rv-cardhead"><h3 class="ix-h">⭐ Step 2 · ${esc(d.starPrompt)}</h3><span class="spacer"></span>${T.btn("eb-ua-star", UA, "ua")}</div>
        ${T.box("eb-ua-star", `<p>${esc(d.starUa)}</p>`, "rv-uabox")}
        <p class="eb-count" aria-live="polite">Selected: <b>${Q.stars.length}/${need}</b> ${Q.stars.length ? "· " + Q.stars.map(id => `<span class="eb-pill">★ ${letter(id)}</span>`).join(" ") : ""}</p>
        <p class="muted" style="margin:0">Tap <b>☆ Choose as a clue</b> on a card. There is no single right choice — explain why you chose these cards.</p>
      </div>
      <div class="card">
        <div class="row rv-cardhead"><h3 class="ix-h">💬 Talk with your teacher</h3><span class="spacer"></span>${T.btn("eb-ua-q", UA, "ua")}${T.btn("eb-help", "🗣 Help me say it")}</div>
        <ol class="rv-qlist">${d.questions.map(q => `<li><span>${esc(q.q)}</span>${say(q.q)}</li>`).join("")}</ol>
        ${T.box("eb-ua-q", `<ol class="rv-qlist ua">${d.questions.map(q => `<li>${esc(q.ua)}</li>`).join("")}</ol>`, "rv-uabox")}
        ${T.box("eb-help", `<p style="margin:0">${d.help.map(h => `<span class="starter">${esc(h)}</span>`).join("")}</p>`, "help")}
      </div>
      <div class="card">
        <h3 class="ix-h">🧠 My theory <span class="muted" style="font-weight:600">(optional — write 3–4 sentences or say them)</span></h3>
        <textarea id="eb-th" aria-label="My theory" placeholder="${esc(d.theoryPh || "")}">${esc(Q.theory || "")}</textarea>
        <div class="rv-hints" id="eb-hn">${theoryHints()}</div>
        <p class="rv-lab" style="margin-top:12px">Checklist</p>
        <ul class="rv-checks">${d.checklist.map((c, i) => `<li><label><input type="checkbox" data-ck="${i}" ${Q.ck[i] ? "checked" : ""}> ${esc(c)}</label></li>`).join("")}</ul>
      </div>` : `<div class="note info">Step 2 opens after you check the board.</div>`}`;
  };
  const move = (id, to) => {
    if (!id || Q.chk) return;
    if (to) Q.place[id] = to; else delete Q.place[id];
    sel = null; moved = id; save(); draw(); moved = null;
  };
  el.onclick = e => {
    if (T.handle(e, el)) return;
    const st = e.target.closest("[data-star]");
    if (st){
      const id = st.dataset.star; const k = Q.stars.indexOf(id);
      if (k >= 0) Q.stars.splice(k, 1);
      else if (Q.stars.length >= need){ S.toast(`You can choose ${need} clues. Remove one first.`); return; }
      else Q.stars.push(id);
      save(); draw(); return;
    }
    const mv = e.target.closest("[data-move]"); if (mv){ move(sel, mv.dataset.move); return; }
    if (e.target.closest("[data-check]")){ Q.chk = true; Q.step2 = true; Q.score = d.cards.filter(c => Q.place[c.id] === c.a).length; if (Q.best == null || Q.score > Q.best) Q.best = Q.score; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ d.cards.forEach(c => { if (Q.place[c.id] !== c.a) delete Q.place[c.id]; }); Q.chk = false; save(); draw(); return; }
    if (e.target.closest("[data-reset]")){ Q.place = {}; Q.chk = false; Q.stars = []; sel = null; save(); draw(); return; }
    if (e.target.closest("[data-step2]")){ Q.step2 = true; save(); draw(); return; }
    const cb = e.target.closest("[data-colbtn]"); if (cb && sel){ move(sel, cb.dataset.colbtn); return; }
    const c = e.target.closest("[data-card]");
    if (c && !Q.chk){ sel = sel === c.dataset.card ? null : c.dataset.card; draw(); const b = el.querySelector(`[data-card="${sel}"]`); if (b) b.focus({ preventScroll:true }); return; }
    const zone = e.target.closest("[data-col]"); if (zone && sel && zone.dataset.col !== (Q.place[sel] || "")){ move(sel, zone.dataset.col); }
  };
  el.onkeydown = e => {
    const c = e.target.closest && e.target.closest("[data-card]");
    if (c && e.target === c && (e.key === "Enter" || e.key === " ") && !Q.chk){ e.preventDefault(); sel = sel === c.dataset.card ? null : c.dataset.card; draw(); const b = el.querySelector(`[data-card="${c.dataset.card}"]`); if (b) b.focus(); }
  };
  el.ondragstart = e => { const c = e.target.closest && e.target.closest("[data-card]"); if (c && !Q.chk){ e.dataTransfer.setData("text/plain", c.dataset.card); e.dataTransfer.effectAllowed = "move"; } };
  el.ondragover = e => { const z = e.target.closest && e.target.closest("[data-col]"); if (z && !Q.chk){ e.preventDefault(); z.classList.add("over"); } };
  el.ondragleave = e => { const z = e.target.closest && e.target.closest("[data-col]"); if (z && !z.contains(e.relatedTarget)) z.classList.remove("over"); };
  el.ondrop = e => { const z = e.target.closest && e.target.closest("[data-col]"); if (!z || Q.chk) return; e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id && card(id)) move(id, z.dataset.col); };
  el.oninput = e => { if (e.target.id === "eb-th"){ Q.theory = e.target.value; save(); const h = $("#eb-hn", el); if (h) h.innerHTML = theoryHints(); } };
  el.onchange = e => { const c = e.target.closest("[data-ck]"); if (c){ Q.ck[c.dataset.ck] = c.checked; save(); } };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Evidence board" });

})();
