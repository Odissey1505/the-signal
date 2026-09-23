/* ============================================================
   THE SIGNAL — бібліотека сюжетних екранів
   ------------------------------------------------------------
   Типи екранів, які можна використовувати в будь-якому уроці:
   груповий чат, голосове повідомлення, дошка доказів, практика
   «крок за кроком», сортування на дві колонки тощо.
   Урок перелічує екрани у своїй функції screens(add, st),
   а зміст передає в data: add(stage, "groupChat", { msgs:[…] }).
   Відповіді зберігаються в ans етапу під ключем data.store
   (або стандартним ключем типу екрана).
   Підключається в index.html після js/player.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, P = window.SignalPlayer;
const { $, $$, esc, reduced, onCleanup, toast, save, TTS, sayBtn, avatar } = S;
const head = P.head;
const define = P.define;

/* ---------- helpers ---------- */
const gen = { n:0 };
const later = (fn, ms) => { const t = setTimeout(fn, ms); onCleanup(() => clearTimeout(t)); return t; };
const store = (ctx, scr, def) => { const k = scr.data.store || def; return ctx.ans[k] = ctx.ans[k] || {}; };
const tok = s => esc(s).replace(/\[([vaim]):([^\]]+)\]/g, (_, k, t) => `<span class="t-${k}">${t}</span>`);
const plain = s => String(s).replace(/\[[vaim]:([^\]]+)\]/g, "$1");
const markCue = (text, cue) => { const s = esc(text), c = esc(cue); const k = s.toLowerCase().indexOf(c.toLowerCase()); return k < 0 ? s : s.slice(0, k) + "<mark>" + s.slice(k, k + c.length) + "</mark>" + s.slice(k + c.length); };
const fmtSec = s => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");
const he = (les, id) => (les.characters[id] && les.characters[id].pronoun) || { dana:"she", zoe:"she" }[id] || "he";

function photo(c, today, cap, cls){
  const f = c.face || { x:50, y:40 };
  const img = today && c.todayImg
    ? `<img src="${c.todayImg}" alt="${esc(c.name)} today" decoding="async">`
    : c.img ? `<img src="${c.img}" alt="${esc(c.name + (today ? " today" : ""))}" decoding="async" style="object-position:${f.x}% ${f.y}%">`
    : avatar(c.look, { label:c.name, noProp:true });
  return `<div class="ix-photo ${today && !c.todayImg ? "today" : ""} ${cls || ""}">${img}<span class="ix-stamp">${today ? "Today" : "Usually"}</span>${cap ? `<span class="ix-cap">${esc(cap)}</span>` : ""}</div>`;
}
function msg(les, m, o){
  o = o || {};
  if (m.sys) return `<div class="ix-sys">${esc(m.sys)}</div>`;
  const anon = m.who === "anon"; const c = les.characters[m.who];
  const mine = o.me && m.who === o.me;
  return `<div class="ix-msg ${anon ? "anon" : ""} ${mine ? "ix-mine" : ""}">${anon ? `<span class="ix-ava anon" aria-hidden="true">?</span>` : `<span class="ix-ava">${S.face(c, { zoom:1.9 })}</span>`}<div class="ix-bub">${o.noName ? "" : `<b class="ix-name ${anon ? "" : "name-" + m.who}">${anon ? "Unknown" : esc(c.name)}</b>`}${esc(m.t)}${m.time ? `<small>${esc(m.time)}</small>` : ""}</div></div>`;
}
/* повідомлення з'являються по одному, перед кожним — «… is typing» */
function play(box, items, o){
  const my = ++gen.n; let k = 0; box.innerHTML = "";
  const scroll = () => { const s = o.scroller || box; s.scrollTop = s.scrollHeight; };
  const put = html => { box.insertAdjacentHTML("beforeend", html); scroll(); };
  const step = () => {
    if (my !== gen.n) return;
    if (k >= items.length){ if (o.done) o.done(); return; }
    const it = items[k++];
    if (it.typing){
      const t = document.createElement("div"); t.className = "ix-typing";
      t.innerHTML = `<span class="ix-dots" aria-hidden="true"><i></i><i></i><i></i></span>${esc(it.typing)} is typing…`;
      box.appendChild(t); scroll();
      later(() => { if (my !== gen.n) return; t.remove(); put(it.html); later(step, it.wait || 450); }, o.typeMs || 950);
    } else { put(it.html); later(step, it.wait || 600); }
  };
  step();
}
const typer = (les, m) => m.sys ? null : m.who === "anon" ? "Someone" : les.characters[m.who].name;
function suspects(les, sel, attr, o){
  o = o || {};
  const ids = o.ids || les.order;
  return `<div class="ix-pick3">${ids.map(id => {
    const c = les.characters[id]; let cls = sel === id ? "on" : "";
    if (o.good && sel === id) cls = o.good === id ? "good" : "bad";
    return `<button class="ix-suspect ${cls}" type="button" ${attr}="${id}" aria-pressed="${sel === id}" ${o.disabled ? "disabled" : ""}>${S.face(c, { label:c.name, zoom:1.35 })}<span>${esc(c.name)}</span>${o.tag && o.tag[id] ? `<small>${o.tag[id]}</small>` : ""}</button>`;
  }).join("")}</div>`;
}

/* ============================================================
   storyHook — сюжетний вступ у темному режимі
   data: { recap, time, chat, members, msgs:[text], cta }
   ============================================================ */
define("storyHook", (el, scr, ctx) => {
  const d = scr.data; const A = store(ctx, scr, "hook");
  el.innerHTML = `<div class="story-screen">
    ${d.recap ? `<p class="story-line" style="animation-delay:.1s">${esc(d.recap)}</p>` : ""}
    <div class="story-time" id="stitle" tabindex="-1" style="font-size:clamp(2.3rem,8vw,4.2rem)">${esc(d.time)}</div>
    <div class="dchat ix-dark">
      <div class="dhead"><span class="ix-gava" aria-hidden="true">🎙️</span><div style="text-align:left"><b>${esc(d.chat)}</b><div style="color:#8A92BD;font-size:.85rem">${esc(d.members || "20 members")}</div></div></div>
      <div id="hk" class="ix-hk" aria-live="polite"></div>
    </div></div>`;
  const box = $("#hk", el); const cta = d.cta || "Continue";
  const items = d.msgs.map(t => ({ html: msg(ctx.les, { who:"anon", t }), typing:"Someone", wait:700 }));
  const done = () => { A.seen = true; save(); ctx.setCTA({ label:cta }); };
  if (reduced() || A.seen){ box.innerHTML = items.map(x => x.html).join(""); done(); return; }
  ctx.setCTA({ label:cta, disabled:!ctx.teacher });
  later(() => play(box, items, { done, typeMs:1400 }), 900);
}, { story:true, label: d => d.time.split("·").pop().trim() });

/* ============================================================
   whichIsTrue — який опис правдивий? + фото «today»
   data: { c, o:[..], a, why, no, today, cap, talk:[..], words:[..], i, of, say, ua, title }
   ============================================================ */
define("whichIsTrue", (el, scr, ctx) => {
  const d = scr.data, c = ctx.les.characters[d.c];
  const rec = store(ctx, scr, "d" + d.i);
  const draw = () => {
    const picked = rec.pick != null, ok = rec.pick === d.a;
    el.innerHTML = `${head(esc(d.title || "Is something different?"), d.say || "", d.ua || "", `Warm-up · ${esc(c.name)} · ${d.i + 1} of ${d.of}`)}
      <div class="ix-duo ${ok ? "" : "solo"}">
        <figure class="ix-fig">${photo(c, false)}<figcaption>${esc(c.name)}, ${c.age} · ${esc(c.from)}</figcaption></figure>
        ${ok ? `<figure class="ix-fig ix-reveal">${photo(c, true, d.cap)}<figcaption>${esc(c.name)} this morning</figcaption></figure>` : ""}
      </div>
      <div class="card" style="margin-top:14px">
        <p class="q-big" style="margin:0">Which description matches ${esc(c.name)}?</p>
        <div class="options">${d.o.map((o, k) => { let cls = ""; if (picked && k === rec.pick) cls = ok ? "good" : "bad"; return `<button class="opt ${cls}" type="button" data-o="${k}" ${picked ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
        ${picked ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ " + esc(d.why) : "✗ " + esc(d.no)}</div>` : ""}
        ${picked && !ok ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}
      </div>
      ${ok ? `<div class="card ix-today"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="scene" style="flex:1;margin:0">${esc(d.today)}</p>${sayBtn(d.today)}</div>
        <p class="muted" style="margin:.8em 0 .3em;font-weight:700">Talk about it:</p>
        <ul class="ix-talk">${d.talk.map(q => `<li>${esc(q)}</li>`).join("")}</ul></div>` : ""}`;
    ctx.setCTA({ label: ok ? "Continue" : "Check your answer", disabled: !ok && !ctx.teacher });
  };
  el.onclick = e => {
    const o = e.target.closest("[data-o]");
    if (o && rec.pick == null){
      rec.pick = +o.dataset.o;
      if (rec.first == null){ rec.first = rec.pick === d.a; (d.words || []).forEach(w => S.wordResult(w, rec.first)); }
      save(); draw(); return;
    }
    if (e.target.closest("[data-retry]")){ rec.pick = null; save(); draw(); }
  };
  draw();
}, { label: (d, les) => les.characters[d.c].name });

/* ============================================================
   groupChat — груповий чат, повідомлення з'являються по одному
   data: { msgs:[{who,time,t}|{sys}], me, chat, sub, title, say, ua }
   ============================================================ */
define("groupChat", (el, scr, ctx) => {
  const d = scr.data, les = ctx.les; const A = store(ctx, scr, "chat");
  el.innerHTML = `${head(esc(d.title || "The group chat"), d.say || "", d.ua || "", "Story · the group chat")}
    <div class="ix-phone">
      <div class="ix-phone-head"><span class="ix-gava" aria-hidden="true">🎙️</span><div><b>${esc(d.chat || "Signal Weekend")}</b><small>${esc(d.sub || "20 members")}</small></div></div>
      <div class="ix-thread" id="th" aria-live="polite"></div>
      <div class="ix-phone-foot"><button class="btn small" type="button" data-replay>↻ Replay</button><span class="spacer"></span><button class="btn small link" type="button" data-all>Show all</button></div>
    </div>`;
  const th = $("#th", el);
  const items = d.msgs.map(m => ({ html: msg(les, m, { me:d.me }), typing: typer(les, m), wait: m.sys ? 400 : 500 }));
  const done = () => { A.seen = true; save(); ctx.setCTA({ label:"Continue" }); };
  const showAll = () => { gen.n++; th.innerHTML = items.map(x => x.html).join(""); th.scrollTop = th.scrollHeight; done(); };
  el.onclick = e => {
    if (e.target.closest("[data-replay]")){ ctx.setCTA({ label:"Continue", disabled: !A.seen && !ctx.teacher }); play(th, items, { done }); }
    if (e.target.closest("[data-all]")) showAll();
  };
  if (reduced() || A.seen) showAll();
  else { ctx.setCTA({ label:"Continue", disabled:!ctx.teacher }); play(th, items, { done }); }
}, { label: () => "Chat" });

/* ============================================================
   quickQuiz — кілька коротких питань на одному екрані
   data: { items:[{q,o,a,ev}], title, sub, ua, kicker, evLabel }
   ============================================================ */
define("quickQuiz", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "quiz"); Q.pick = Q.pick || {};
  const draw = () => {
    const n = d.items.length; const all = d.items.every((q, i) => Q.pick[i] != null);
    const score = d.items.filter((q, i) => Q.pick[i] === q.a).length;
    el.innerHTML = `${head(esc(d.title || "Quick questions"), d.sub || "", d.ua || "", d.kicker || `${n} questions`)}
      ${d.items.map((q, i) => `<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p style="flex:1;font-weight:800;font-size:1.12rem;margin:0">${i + 1}. ${esc(q.q)}</p>${sayBtn(q.q)}</div>
        <div class="options">${q.o.map((o, k) => { let cls = ""; if (Q.checked){ if (Q.pick[i] === k) cls = k === q.a ? "good" : "bad"; } else if (Q.pick[i] === k) cls = "sel"; return `<button class="opt ${cls}" type="button" data-q="${i}" data-o="${k}" ${Q.checked ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
        ${Q.checked ? `<div class="note ${Q.pick[i] === q.a ? "good" : "bad"}">${Q.pick[i] === q.a ? "✓ Right." : "✗ Not quite."}${q.ev ? ` ${esc(d.evLabel || "In the text:")} “${esc(q.ev)}”` : ""}</div>` : ""}</div>`).join("")}
      ${Q.checked ? `<div class="note ${score === n ? "good" : "amber"}">${score} / ${n} correct.${score < n ? " Try again for the red ones." : ""}</div>` : ""}
      ${Q.checked && score < n ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}`;
    if (!Q.checked) ctx.setCTA({ label:"Check", disabled:!all, action(){ Q.checked = true; Q.score = score; save(); draw(); } });
    else ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => {
    const o = e.target.closest("[data-o]");
    if (o && !Q.checked){ Q.pick[o.dataset.q] = +o.dataset.o; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ d.items.forEach((q, i) => { if (Q.pick[i] !== q.a) delete Q.pick[i]; }); Q.checked = false; save(); draw(); }
  };
  draw();
}, { label: () => "Questions" });

/* ============================================================
   speakCard — одне усне питання з опорами
   data: { q, ua, hints:[..], starter, sample, title, sub, subUa, kicker }
   ============================================================ */
define("speakCard", (el, scr, ctx) => {
  const d = scr.data; const A = store(ctx, scr, "speak1");
  el.innerHTML = `${head(esc(d.title || d.q), d.sub || "Say your answer out loud.", d.subUa || "Скажи відповідь уголос.", d.kicker || "Speaking")}
    <div class="card">
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="q-big" style="flex:1;margin:0">${esc(d.q)}</p>${sayBtn(d.q)}</div>
      ${d.ua ? `<p class="muted" style="margin:.4em 0 0">🇺🇦 ${esc(d.ua)}</p>` : ""}
      ${d.starter ? `<div class="ix-starter"><b>Useful answer starter</b><p>${esc(d.starter)}</p></div>` : ""}
      ${d.hints ? `<button class="btn small" type="button" data-help>💡 Hints</button>
      <div class="help" id="help" ${ctx.teacher ? "" : "hidden"}><ul style="margin:0;padding-left:1.1em">${d.hints.map(h => `<li>${esc(h)}</li>`).join("")}</ul></div>` : ""}
      <div class="field" style="margin-top:14px"><label for="wa">My answer (optional)</label><input type="text" id="wa" value="${esc(A.text || "")}" placeholder="${esc(d.starter || "")}"></div>
      ${d.sample ? `<button class="btn small link" type="button" data-sample>Show a sample answer</button>
      <div class="help" id="smp" ${ctx.teacher ? "" : "hidden"}><p>${esc(d.sample)} ${sayBtn(d.sample, "Listen to the sample")}</p></div>` : ""}
    </div>`;
  el.onclick = e => {
    if (e.target.closest("[data-help]")){ const h = $("#help", el); h.hidden = !h.hidden; }
    if (e.target.closest("[data-sample]")){ const h = $("#smp", el); h.hidden = !h.hidden; }
  };
  $("#wa", el).oninput = e => { A.text = e.target.value; save(); };
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Speaking" });

/* ============================================================
   highlightPairs — пари речень з підсвічуванням частин
   Розмітка: [v:дієслово] [a:is] [i:ing] [m:маркер]
   data: { pairs:[[s1,s2]], title, say, ua, note, labels }
   ============================================================ */
define("highlightPairs", (el, scr, ctx) => {
  const d = scr.data; const A = store(ctx, scr, "hl");
  const keys = d.labels || [["v", "Verbs"], ["a", "am / is / are"], ["i", "-ing"], ["m", "Time words"]];
  const draw = () => {
    const cls = keys.filter(k => A[k[0]]).map(k => "hl-" + k[0]).join(" ");
    el.innerHTML = `${head(esc(d.title || "Look closely"), d.say || "", d.ua || "", "Grammar · discover")}
      <div class="row ix-hl" role="group" aria-label="Highlights">${keys.map(k => `<button class="chip ix-k-${k[0]} ${A[k[0]] ? "on" : ""}" type="button" data-k="${k[0]}" aria-pressed="${!!A[k[0]]}">${k[1]}</button>`).join("")}</div>
      <div class="ix-pairs ${cls}">${d.pairs.map(p => `<div class="card ix-pair">${p.map(s => `<div class="ix-sent"><span style="flex:1">${tok(s)}</span>${sayBtn(plain(s))}</div>`).join("")}</div>`).join("")}</div>
      <div class="note info">${esc(d.note || "What's different in each pair? Turn on the highlights one by one.")}</div>`;
  };
  el.onclick = e => { const k = e.target.closest("[data-k]"); if (k){ A[k.dataset.k] = !A[k.dataset.k]; save(); draw(); } };
  draw();
  ctx.setCTA({ label:"Continue" });
}, { label: () => "Pairs" });

/* ============================================================
   twoWay — розклади речення або слова на дві групи
   data: { items:[{t,a}], labels:{normal,now}, title, sub, ua, kicker, grid, win, store }
   (ключі груп — будь-які два, порядок = порядок labels)
   ============================================================ */
define("twoWay", (el, scr, ctx) => {
  const d = scr.data; const Q = store(ctx, scr, "two"); Q.v = Q.v || {};
  const groups = Object.keys(d.labels);
  const draw = () => {
    const all = d.items.every((x, i) => Q.v[i]);
    const right = d.items.filter((x, i) => Q.v[i] === x.a).length;
    el.innerHTML = `${head(esc(d.title), d.sub || "", d.ua || "", d.kicker || "Practice")}
      <div class="${d.grid ? "ix-grid2" : ""}">${d.items.map((x, i) => { const v = Q.v[i]; const res = Q.chk ? (v === x.a ? "ok" : "no") : ""; return `
        <div class="card ix-2way ${res}">
          <b>${esc(x.t)}</b>
          <div class="seg-toggle">${groups.map(k => `<button type="button" class="${v === k ? "on" : ""}" data-i="${i}" data-v="${k}" ${Q.chk ? "disabled" : ""}>${esc(d.labels[k])}</button>`).join("")}</div>
          ${Q.chk ? `<small class="ix-res">${v === x.a ? "✓" : "✗ " + esc(d.labels[x.a])}</small>` : ""}
        </div>`; }).join("")}</div>
      ${Q.chk ? `<div class="note ${right === d.items.length ? "good" : "amber"}">${right} / ${d.items.length} correct. ${right === d.items.length ? esc(d.win || "Great!") : "Look at the red ones again."}</div>` : ""}
      ${Q.chk && right < d.items.length ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}`;
    if (!Q.chk) ctx.setCTA({ label:"Check", disabled:!all, action(){ Q.chk = true; Q.score = right; save(); draw(); } });
    else ctx.setCTA({ label:"Continue" });
  };
  el.onclick = e => {
    const b = e.target.closest("[data-v]"); if (b && !Q.chk){ Q.v[b.dataset.i] = b.dataset.v; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ d.items.forEach((x, i) => { if (Q.v[i] !== x.a) delete Q.v[i]; }); Q.chk = false; save(); draw(); }
  };
  draw();
}, { label: d => d.short || "Sort" });

/* ============================================================
   mcqGate — одне питання; наступний екран відкривається після правильної відповіді
   data: { q, o:[..], a, hint, good, bad, next, title, kicker }
   ============================================================ */
define("mcqGate", (el, scr, ctx) => {
  const d = scr.data; const R = store(ctx, scr, "gate");
  const draw = () => {
    const ok = R.pick === d.a;
    el.innerHTML = `${head(esc(d.title || "One more question"), "", "", d.kicker || "")}
      <div class="card"><p class="q-big" style="margin:0">${esc(d.q)}</p>
        ${d.hint ? `<p class="muted" style="margin:.4em 0 0">${d.hint}</p>` : ""}
        <div class="options">${d.o.map((o, k) => { let cls = ""; if (R.chk && R.pick === k) cls = ok ? "good" : "bad"; else if (!R.chk && R.pick === k) cls = "sel"; return `<button class="opt ${cls}" type="button" data-o="${k}" ${R.chk ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
        ${R.chk ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ " + esc(d.good || "Yes!") : "✗ " + esc(d.bad || "Look again.")}</div>` : ""}
        ${R.chk && !ok ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}</div>`;
    if (!R.chk) ctx.setCTA({ label:"Check", disabled: R.pick == null, action(){ R.chk = true; save(); draw(); } });
    else ctx.setCTA({ label: d.next || "Continue", disabled: !ok && !ctx.teacher });
  };
  el.onclick = e => {
    const o = e.target.closest("[data-o]"); if (o && !R.chk){ R.pick = +o.dataset.o; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ R.pick = null; R.chk = false; save(); draw(); }
  };
  draw();
}, { label: d => d.short || "Question" });

/* ============================================================
   ruleCards — коротке правило двома картками + головна ідея
   data: { big:{a,b}, cards:[{name,uses,ex,form,markers}], cta }
   ============================================================ */
define("ruleCards", (el, scr, ctx) => {
  const d = scr.data;
  const card = (x, k) => `<section class="ix-rule ${k ? "pc" : "ps"}">
      <h3>${esc(x.name)}</h3>
      <p class="ix-rl">Use it for</p><ul>${x.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul>
      <p class="ix-rl">Examples</p><ul class="ix-ex">${x.ex.map(s => `<li><span>${esc(s)}</span>${sayBtn(s)}</li>`).join("")}</ul>
      ${x.form ? `<p class="ix-form">${x.form}</p>` : ""}
      <div class="chips">${x.markers.map(m => `<span class="chip sm ix-mk">${esc(m)}</span>`).join("")}</div>
    </section>`;
  el.innerHTML = `${head("The grammar rule", "", "", "Grammar · rule")}
    <div class="ix-big-idea ix-reveal">${d.cards.map((x, k) => `<p><span class="k${k + 1}">${esc(x.name)}</span> ${esc(x.q)}</p>`).join("")}</div>
    <div class="ix-rules">${d.cards.map(card).join("")}</div>`;
  ctx.setCTA({ label: d.cta || "Continue" });
}, { label: () => "Rule" });

/* ============================================================
   stepPractice — вибір форми, по одному реченню, з підказкою й підсумком
   data: { items:[{pre,o,a,post,cue,why}], title, say, ua }
   ============================================================ */
define("stepPractice", (el, scr, ctx) => {
  const d = scr.data; const n = d.items.length; const key = scr.data.store || "p";
  let Q = ctx.ans[key] = ctx.ans[key] || { i:0, pick:{}, chk:{} };
  const draw = () => {
    const steps = `<div class="ix-steps" aria-hidden="true">${d.items.map((it, k) => `<i class="${Q.chk[k] ? (Q.pick[k] === it.a ? "ok" : "no") : k === Q.i ? "on" : ""}"></i>`).join("")}</div>`;
    if (Q.i >= n){
      const score = d.items.filter((it, k) => Q.pick[k] === it.a).length;
      if (Q.best == null || score > Q.best){ Q.best = score; save(); }
      const note = score === n ? "Perfect! You're a real grammar detective. 🕵️" : score >= n - 2 ? "Great work! Look at the red ones — then you've got it." : "Good start! Try again and look for the clue words.";
      el.innerHTML = `${head("Your result", "", "", "Practice · done")}${steps}
        <div class="card" style="text-align:center"><div class="story-time" style="font-size:3.4rem;color:var(--accent)">${score} / ${n}</div><p style="font-weight:700;margin:.3em 0 0">${note}</p></div>
        <div class="card">${d.items.map((it, k) => `<div class="wrow"><span aria-hidden="true">${Q.pick[k] === it.a ? "✅" : "❌"}</span><div class="wm"><b style="font-size:1rem">${markCue(it.pre + " " + it.o[it.a] + " " + it.post, it.cue)}</b><small>${esc(it.why)}</small></div></div>`).join("")}</div>
        <button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>`;
      ctx.setCTA({ label:"Continue" });
      return;
    }
    const it = d.items[Q.i]; const chk = Q.chk[Q.i]; const pick = Q.pick[Q.i]; const ok = pick === it.a;
    el.innerHTML = `${head(esc(d.title || "Choose the form"), Q.i === 0 ? d.say || "" : "", Q.i === 0 ? d.ua || "" : "", `Practice · ${Q.i + 1}/${n}`)}${steps}
      <div class="card"><p class="q-big" style="margin:0">${chk ? markCue(it.pre, it.cue) : esc(it.pre)} <span class="ix-blank ${chk ? (ok ? "ok" : "no") : ""}">${pick != null ? esc(it.o[pick]) : "_____"}</span> ${chk ? markCue(it.post, it.cue) : esc(it.post)}</p>
        <div class="options">${it.o.map((o, k) => { let cls = ""; if (chk){ if (k === it.a) cls = "good"; else if (k === pick) cls = "bad"; } else if (k === pick) cls = "sel"; return `<button class="opt ${cls}" type="button" data-o="${k}" ${chk ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
        ${chk ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ Correct: " : "✗ The answer is: "}<b>${esc(it.o[it.a])}</b><br><span style="font-weight:600">Clue: <mark>${esc(it.cue)}</mark> — ${esc(it.why)}</span></div>` : ""}</div>`;
    if (!chk) ctx.setCTA({ label:"Check", disabled: pick == null, action(){ Q.chk[Q.i] = true; save(); draw(); } });
    else ctx.setCTA({ label: Q.i + 1 < n ? "Next sentence" : "See my result", action(){ Q.i++; save(); draw(); window.scrollTo(0, 0); } });
  };
  el.onclick = e => {
    const o = e.target.closest("[data-o]"); if (o && Q.i < n && !Q.chk[Q.i]){ Q.pick[Q.i] = +o.dataset.o; save(); draw(); return; }
    if (e.target.closest("[data-retry]")){ const best = Q.best; Q = ctx.ans[key] = { i:0, pick:{}, chk:{}, best }; save(); draw(); }
  };
  draw();
}, { label: d => d.items.length + " sentences" });

/* ============================================================
   spotDiff — звичайний профіль vs сьогодні; вибір змін і складання речень
   data: { c, normal:[{id,t,e}], today:[{id,t,e}], build:{id:{pre,o,a,post}}, need, say, ua, done }
   ============================================================ */
define("spotDiff", (el, scr, ctx) => {
  const d = scr.data; const c = ctx.les.characters[d.c];
  const Q = store(ctx, scr, "s"); Q.picked = Q.picked || []; Q.built = Q.built || {};
  const full = id => { const b = d.build[id]; return b.pre + " " + b.o[b.a] + " " + b.post; };
  const draw = () => {
    const done = Object.keys(Q.built).length;
    const open = Q.picked.find(id => !Q.built[id]) || null;
    const b = open ? d.build[open] : null;
    el.innerHTML = `${head("Spot the difference 🔍", d.say || "", d.ua || "", `Clues · ${done} of ${d.need} changes`)}
      <div class="ix-duo profiles">
        <article class="ix-profile"><header><span class="ix-mini">${S.face(c, { zoom:1.9 })}</span><div><b>${esc(c.name)}'s normal profile</b><small>${esc(c.handle || "")}</small></div></header>
          ${photo(c, false, null, "wide")}
          <ul>${d.normal.map(x => `<li class="ix-row static"><span aria-hidden="true">${x.e}</span>${esc(x.t)}</li>`).join("")}</ul></article>
        <article class="ix-profile is-today"><header><span class="ix-mini">${S.face(c, { zoom:1.9 })}</span><div><b>${esc(c.name)} today</b><small>${esc(d.when || "Today")}</small></div></header>
          ${photo(c, true, null, "wide")}
          <ul>${d.today.map(x => { const cls = Q.built[x.id] ? "done" : Q.picked.includes(x.id) ? "sel" : ""; const dis = Q.built[x.id] || (!Q.picked.includes(x.id) && (done >= d.need || open)); return `<li><button class="ix-row ${cls}" type="button" data-t="${x.id}" ${dis ? "disabled" : ""} aria-pressed="${Q.picked.includes(x.id)}"><span aria-hidden="true">${Q.built[x.id] ? "✅" : x.e}</span>${esc(x.t)}</button></li>`; }).join("")}</ul></article>
      </div>
      ${b ? `<div class="card ix-build ix-reveal"><p class="muted" style="margin:0 0 6px;font-weight:700">${esc(d.model || "Make the sentence")}</p>
        <p class="q-big" style="margin:0">${esc(b.pre)} <span class="ix-blank">_____</span> ${esc(b.post)}</p>
        <div class="chips" style="margin-top:14px">${b.o.map((o, k) => `<button class="chip ${Q.wrong === k ? "bad" : ""}" type="button" data-b="${k}">${esc(o)}</button>`).join("")}</div>
        ${Q.wrong != null ? `<div class="note bad">${d.wrong || "Not quite."}</div>` : ""}
        <button class="btn link small" type="button" data-cancel style="margin-top:6px">Choose a different change</button></div>` : ""}
      ${done ? `<div class="card"><h3 style="font-size:1.05rem;margin-bottom:6px">🗂️ Case file</h3>${Object.keys(Q.built).map(id => `<div class="wrow"><span aria-hidden="true">✅</span><div class="wm"><b style="font-size:1rem">${esc(full(id))}</b></div>${sayBtn(full(id))}</div>`).join("")}</div>` : ""}
      ${done >= d.need && d.done ? `<div class="note good">✓ ${esc(d.done)}</div>` : ""}`;
    ctx.setCTA({ label: done >= d.need ? "Continue" : `Find ${d.need - done} more`, disabled: done < d.need && !ctx.teacher });
  };
  el.onclick = e => {
    const t = e.target.closest("[data-t]");
    if (t && !t.disabled){ if (!Q.picked.includes(t.dataset.t)) Q.picked.push(t.dataset.t); Q.wrong = null; save(); draw(); return; }
    const bb = e.target.closest("[data-b]");
    if (bb){ const open = Q.picked.find(id => !Q.built[id]); const b = d.build[open];
      if (+bb.dataset.b === b.a){ Q.built[open] = true; Q.wrong = null; save(); draw(); TTS.say(full(open)); } else { Q.wrong = +bb.dataset.b; save(); draw(); }
      return; }
    if (e.target.closest("[data-cancel]")){ const open = Q.picked.find(id => !Q.built[id]); Q.picked = Q.picked.filter(id => id !== open); Q.wrong = null; save(); draw(); }
  };
  draw();
}, { label: (d, les) => les.characters[d.c].name });

/* ============================================================
   Голосове повідомлення (спільний програвач)
   msg: { from, to, time, text:[речення], voice:{lang,pitch,rate,hint}, audioSrc }
   Лічильник прослуховувань — ans.plays етапу (спільний для екранів етапу).
   ============================================================ */
function voice(box, m, ctx, o){
  o = o || {};
  const A = ctx.ans; A.plays = A.plays || 0;
  const c = ctx.les.characters[m.from];
  const words = m.text.map(t => S.wordCount(t));
  const est = i => Math.max(.9, words[i] * .42 / ((m.voice && m.voice.rate) || 1));
  const total = m.text.reduce((a, _, i) => a + est(i), 0);
  const useAudio = !!m.audioSrc;
  const canPlay = useAudio || TTS.ok;
  let playing = false, idx = 0, t0 = 0, my = 0, audio = null, tick = null;
  const bars = 34;
  box.innerHTML = `<div class="ix-vmsg">
      <span class="ix-ava lg">${S.face(c, { zoom:1.9 })}</span>
      <div class="ix-voice">
        <button class="ix-play" type="button" data-vp aria-label="Play the voice message" ${canPlay ? "" : "disabled"}>▶</button>
        <div style="flex:1;min-width:0">
          <div class="ix-vtop"><b class="name-${m.from}">${esc(c.name)}</b><span id="vt">0:00 / ${fmtSec(total)}</span></div>
          <div class="ix-wave" id="vw" aria-hidden="true">${Array.from({ length: bars }, (_, k) => `<i style="height:${22 + ((k * 41 + 17) % 74)}%"></i>`).join("")}</div>
          <div class="ix-vbar"><i id="vb"></i></div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:10px">
      <span class="pill">🎤 Voice message${m.to ? " to " + esc(ctx.les.characters[m.to].name) : ""}${m.time ? " · " + esc(m.time) : ""}</span><span class="spacer"></span>
      <button class="btn small" type="button" data-vr ${canPlay ? "" : "disabled"}>⟲ Listen again</button>
      ${o.compact ? "" : `<button class="btn small link" type="button" data-vtx>Show the text</button>`}
    </div>
    ${canPlay ? "" : `<div class="note amber">This browser can't play the voice. Your teacher will read the message aloud.</div>`}
    <div id="vtx" class="card ix-vtext" ${!canPlay || (!o.compact && (A.plays > 0 || ctx.teacher)) ? "" : "hidden"}>${m.text.map(esc).join(" ")}</div>`;
  const ui = p => {
    const vb = $("#vb", box), vt = $("#vt", box), vw = $$("#vw i", box), bt = $("[data-vp]", box);
    if (!vb) return;
    vb.style.width = Math.round(p * 100) + "%";
    vt.textContent = fmtSec(p * total) + " / " + fmtSec(total);
    const on = Math.round(p * bars); vw.forEach((b, k) => b.classList.toggle("on", k < on));
    bt.textContent = playing ? "❚❚" : "▶"; bt.setAttribute("aria-label", playing ? "Pause" : "Play the voice message");
  };
  const progress = () => {
    if (useAudio && audio) return audio.duration ? audio.currentTime / audio.duration : 0;
    let s = 0; for (let k = 0; k < idx; k++) s += est(k);
    if (playing) s += Math.min(est(idx) * .97, (Date.now() - t0) / 1000);
    return Math.min(1, s / total);
  };
  const finish = () => {
    playing = false; idx = 0; clearInterval(tick);
    A.plays++; save(); S.markActive(); ui(1);
    if (!o.compact){ const t = $("#vtx", box); if (t) t.hidden = false; }
    if (o.onEnd) o.onEnd();
  };
  const speakFrom = (i, token) => {
    if (token !== my || !playing) return;
    if (i >= m.text.length){ finish(); return; }
    idx = i; t0 = Date.now();
    TTS.speak(m.text[i], m.voice, () => { if (token !== my || !playing) return; later(() => speakFrom(i + 1, token), 250); });
  };
  const start = () => {
    playing = true; my++; clearInterval(tick); tick = setInterval(() => ui(progress()), 120);
    if (useAudio){
      if (!audio){ audio = new Audio(m.audioSrc); audio.onended = () => { audio.currentTime = 0; finish(); }; }
      audio.play().catch(() => { playing = false; toast("The audio couldn't play."); ui(progress()); });
    } else { TTS.stop(); speakFrom(idx, my); }
    ui(progress());
  };
  const pause = () => { playing = false; my++; clearInterval(tick); if (audio) audio.pause(); else TTS.stop(); ui(progress()); };
  onCleanup(() => { my++; playing = false; clearInterval(tick); if (audio) audio.pause(); TTS.stop(); });
  box.addEventListener("click", e => {
    if (e.target.closest("[data-vp]")){ playing ? pause() : start(); }
    if (e.target.closest("[data-vr]")){ pause(); idx = 0; if (audio) audio.currentTime = 0; start(); }
    if (e.target.closest("[data-vtx]")){
      const t = $("#vtx", box);
      if (A.plays > 0 || ctx.teacher || !canPlay) t.hidden = !t.hidden; else toast("Listen to the whole message first.");
    }
  });
  ui(0);
  return { canPlay };
}

/* ============================================================
   voiceMessage — голосове + питання після першого прослуховування
   data: { msg, first:{q,a,why,bad}, title, say, ua, next }
   ============================================================ */
define("voiceMessage", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les; const A = ctx.ans; const F = store(ctx, scr, "first");
  el.innerHTML = `${head(esc(d.title || "The voice message 🎧"), d.say || "", d.ua || "", "Listening · 1st time")}<div id="vp"></div><div id="q1"></div>`;
  const pl = voice($("#vp", el), d.msg, ctx, { onEnd: () => drawQ() });
  const drawQ = () => {
    const open = A.plays > 0 || ctx.teacher || !pl.canPlay;
    const ok = F.pick === d.first.a;
    $("#q1", el).innerHTML = open ? `<div class="card" style="margin-top:14px"><p class="q-big" style="margin:0 0 4px">${esc(d.first.q)}</p>
        ${suspects(les, F.pick, "data-f", { good: F.chk ? d.first.a : null, disabled: F.chk, ids: d.first.ids })}
        ${F.chk ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ " + esc(d.first.why) : "✗ " + esc(d.first.bad || "Listen again.")}</div>` : ""}
        ${F.chk && !ok ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}</div>`
      : `<div class="note info" style="margin-top:14px">🎧 Play the whole message. Then answer: <b>${esc(d.first.q)}</b></div>`;
    if (!open) ctx.setCTA({ label:"Listen first", disabled:true });
    else if (!F.chk) ctx.setCTA({ label:"Check", disabled:!F.pick, action(){ F.chk = true; save(); drawQ(); } });
    else ctx.setCTA({ label: d.next || "Continue", disabled: !ok && !ctx.teacher });
  };
  el.onclick = e => {
    const f = e.target.closest("[data-f]"); if (f && !F.chk){ F.pick = f.dataset.f; save(); drawQ(); return; }
    if (e.target.closest("[data-retry]")){ F.pick = null; F.chk = false; save(); drawQ(); }
  };
  drawQ();
}, { label: () => "1st listen" });

/* ============================================================
   voiceTable — друге прослуховування: таблиця «usually / today»
   data: { msg, rows:[{c, usual:{t}|{slot}, today:{t}|{slot}}], extra:[..], order:[..], title, sub, ua, wrong }
   ============================================================ */
define("voiceTable", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les;
  const Q = store(ctx, scr, "tb"); Q.place = Q.place || {};
  const slots = [];
  d.rows.forEach(r => ["usual", "today"].forEach(col => { if (r[col].slot) slots.push({ key: r.c + "-" + col, a: r[col].slot }); }));
  const cards = d.order || slots.map(s => s.a).concat(d.extra || []);
  let sel = null;
  el.innerHTML = `${head(esc(d.title || "Usually vs today"), d.sub || "", d.ua || "", "Listening · 2nd time")}
    <div id="vp"></div><div id="tbl" style="margin-top:14px"></div>`;
  voice($("#vp", el), d.msg, ctx, { compact:true });
  const box = $("#tbl", el);
  const draw = () => {
    const used = Object.values(Q.place);
    const bank = cards.filter(x => !used.includes(x));
    const chip = (x, key) => { let cls = sel === x ? "on" : ""; if (Q.chk && key){ cls = slots.find(s => s.key === key).a === x ? "good" : "bad"; } return `<button class="chip ${cls}" type="button" draggable="${Q.chk ? "false" : "true"}" data-c="${esc(x)}" ${Q.chk ? "disabled" : ""}>${esc(x)}</button>`; };
    const cell = (r, col) => { const x = r[col]; const key = r.c + "-" + col; if (x.t) return `<span class="ix-cell">${esc(x.t)}</span>`;
      const has = Q.place[key]; return `<div class="ix-slot ${has ? "filled" : ""} ${sel && !has ? "ready" : ""}" data-slot="${key}" role="button" tabindex="0" aria-label="Gap: ${esc(les.characters[r.c].name)} ${col === "usual" ? "usually" : "today"}">${has ? chip(has, key) : `<span class="muted">${col === "usual" ? "usually…" : "today…"}</span>`}</div>`; };
    const right = slots.filter(s => Q.place[s.key] === s.a).length;
    box.innerHTML = `<div class="bank ix-bank" data-slot="">${bank.map(x => chip(x)).join("") || `<span class="muted">All cards placed ✓</span>`}</div>
      <div class="ix-table" role="table" aria-label="Usually and today">
        <div class="ix-trow ix-thead" role="row"><span role="columnheader">Character</span><span role="columnheader">Usually</span><span role="columnheader">Today</span></div>
        ${d.rows.map(r => `<div class="ix-trow" role="row"><span class="ix-who" role="cell"><span class="ix-mini">${S.face(les.characters[r.c], { zoom:1.9 })}</span>${esc(les.characters[r.c].name)}</span><span role="cell">${cell(r, "usual")}</span><span role="cell">${cell(r, "today")}</span></div>`).join("")}
      </div>
      ${Q.chk ? `<div class="note ${right === slots.length ? "good" : "amber"}">${right} / ${slots.length} correct. ${right === slots.length ? "Great listening!" : esc(d.wrong || "Look at the red ones again.")}</div>` : ""}
      ${Q.chk && right < slots.length ? `<button class="btn" type="button" data-retry style="margin-top:12px">↻ Try again</button>` : ""}`;
    const n = Object.keys(Q.place).length;
    if (!Q.chk) ctx.setCTA({ label: n < slots.length ? `Check (${n}/${slots.length})` : "Check", disabled: n < slots.length, action(){ Q.chk = true; Q.score = right; save(); draw(); } });
    else ctx.setCTA({ label:"Continue" });
  };
  const place = (x, key) => { Object.keys(Q.place).forEach(k => { if (Q.place[k] === x) delete Q.place[k]; }); if (key) Q.place[key] = x; sel = null; save(); draw(); };
  box.onclick = e => {
    if (e.target.closest("[data-retry]")){ slots.forEach(s => { if (Q.place[s.key] !== s.a) delete Q.place[s.key]; }); Q.chk = false; save(); draw(); return; }
    if (Q.chk) return;
    const c = e.target.closest("[data-c]"); const slot = e.target.closest("[data-slot]");
    if (c && !(sel && slot && slot.dataset.slot && sel !== c.dataset.c)){ sel = sel === c.dataset.c ? null : c.dataset.c; draw(); return; }
    if (slot && sel) place(sel, slot.dataset.slot || null);
  };
  box.onkeydown = e => { const slot = e.target.closest("[data-slot]"); if (slot && sel && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); place(sel, slot.dataset.slot || null); } };
  box.ondragstart = e => { const c = e.target.closest("[data-c]"); if (c) e.dataTransfer.setData("text/plain", c.dataset.c); };
  box.ondragover = e => { const s = e.target.closest("[data-slot]"); if (s){ e.preventDefault(); s.classList.add("over"); } };
  box.ondragleave = e => { const s = e.target.closest("[data-slot]"); if (s) s.classList.remove("over"); };
  box.ondrop = e => { const s = e.target.closest("[data-slot]"); if (!s || Q.chk) return; e.preventDefault(); const x = e.dataTransfer.getData("text/plain"); if (x) place(x, s.dataset.slot || null); };
  draw();
}, { label: () => "Table" });

/* ============================================================
   suspectPick — кого підозрюєш і чому (усно)
   data: { q, model, title, sub, ua }   — використовує les.suspects
   ============================================================ */
define("suspectPick", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les; const U = store(ctx, scr, "sus");
  const draw = () => {
    const s = U.who && les.suspects && les.suspects[U.who];
    el.innerHTML = `${head(esc(d.q || "Who do you suspect?"), d.sub || "Choose a suspect. Then explain your idea out loud.", d.ua || "Обери підозрюваного й поясни вголос чому.", d.kicker || "Talk")}
      ${suspects(les, U.who, "data-s")}
      <div class="card" style="margin-top:14px">
        <div class="ix-starter" style="margin-top:0"><b>Model</b><p>${esc(d.model)}</p></div>
        ${s ? `<div class="note info">I suspect ${esc(les.characters[U.who].name)} because ${he(les, U.who)} usually ${esc(s.usually)}, but today ${he(les, U.who)} ${esc(s.today)}.</div>` : ""}
        <div class="field" style="margin-top:12px"><label for="sw">My reason (optional)</label><input type="text" id="sw" value="${esc(U.why || "")}" placeholder="…because they usually…, but today they are…"></div>
      </div>`;
    $("#sw", el).oninput = e => { U.why = e.target.value; save(); };
    ctx.setCTA({ label:"Continue", disabled: !U.who && !ctx.teacher });
  };
  el.onclick = e => { const s = e.target.closest("[data-s]"); if (s){ U.who = s.dataset.s; save(); draw(); } };
  draw();
}, { label: () => "Suspect" });

/* ============================================================
   alibiCheck — рольова гра: картка алібі, питання детектива, вердикт класу
   data: { alibis:{id:[..]}, questions:[..], phrases:[..], title, say, ua }
   ============================================================ */
define("alibiCheck", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les; const A = store(ctx, scr, "alibi"); A.v = A.v || {};
  const draw = () => {
    const cur = A.cur; const c = cur ? les.characters[cur] : null;
    const tags = {}; Object.keys(d.alibis).forEach(id => { if (A.v[id]) tags[id] = A.v[id] === "b" ? "✅ believable" : "🚩 suspicious"; });
    el.innerHTML = `${head(esc(d.title || "Alibi check 🎭"), d.say || "", d.ua || "", "Speaking · role-play")}
      ${suspects(les, cur, "data-r", { tag:tags, ids:Object.keys(d.alibis) })}
      ${c ? `<div class="ix-role ix-reveal" style="margin-top:14px">
          <div class="row" style="flex-wrap:nowrap"><span class="ix-ava lg">${S.face(c, { zoom:1.9 })}</span><div><small>Your role card</small><b>You are ${esc(c.name)}</b></div><span class="spacer"></span>${sayBtn(d.alibis[cur].join(" "), "Listen to the alibi")}</div>
          <ul>${d.alibis[cur].map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>
        <div class="ix-cols">
          <div class="card"><h3 class="ix-h">🕵️ Detective's questions</h3><ol>${d.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol></div>
          <div class="card"><h3 class="ix-h">💬 Useful language</h3><p style="margin:0">${d.phrases.map(p => `<span class="starter">${esc(p)}</span>`).join("")}</p></div>
        </div>
        <div class="ix-verdict" role="group" aria-label="Class verdict">
          <button type="button" class="believe ${A.v[cur] === "b" ? "on" : ""}" data-vd="b" aria-pressed="${A.v[cur] === "b"}">✅ The alibi sounds believable</button>
          <button type="button" class="sus ${A.v[cur] === "s" ? "on" : ""}" data-vd="s" aria-pressed="${A.v[cur] === "s"}">🚩 The alibi sounds suspicious</button>
        </div>
        ${A.v[cur] ? `<div class="note info">Verdict saved. Try another character — or continue.</div>` : ""}`
      : `<div class="note info" style="margin-top:14px">Tap a character to open the role card.</div>`}`;
    ctx.setCTA({ label:"Continue", disabled: !Object.keys(A.v).length && !ctx.teacher });
  };
  el.onclick = e => {
    const r = e.target.closest("[data-r]"); if (r){ A.cur = r.dataset.r; save(); draw(); return; }
    const v = e.target.closest("[data-vd]"); if (v && A.cur){ A.v[A.cur] = v.dataset.vd; save(); draw(); }
  };
  draw();
}, { label: () => "Role-play" });

/* ============================================================
   evidenceBoard — дошка доказів (картки підозрюваних)
   data: { question, quote, hint, title, say, ua }   — використовує les.suspects і les.order
   suspect: { traits, usually, today, chat:[{who,time,t}|{sys}], alibi, check, rot }
   ============================================================ */
define("evidenceBoard", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les; const A = store(ctx, scr, "board"); A.seen = A.seen || {};
  const card = id => {
    const s = les.suspects[id]; const c = les.characters[id]; const open = A.seen[id] || ctx.teacher; const f = c.face || { x:50, y:40 };
    return `<article class="ix-card ${open ? "open" : ""}" style="--rot:${s.rot || 0}deg">
      <div class="ix-polaroid">${c.img ? `<img src="${c.img}" alt="${esc(c.name)}" style="object-position:${f.x}% ${f.y}%">` : avatar(c.look, { label:c.name, noProp:true })}</div>
      <h3>${esc(c.name)}</h3>
      <div class="ix-traits">${s.traits.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <p class="ix-kv"><b>Usually</b>${esc(s.usually)}</p>
      <p class="ix-kv"><b>Today</b>${esc(s.today)}</p>
      ${open ? `<div class="ix-kv"><b>In the chat</b>${s.chat.map(m => m.sys ? `<span class="ix-snip sys">${esc(m.sys)}</span>` : `<span class="ix-snip"><i>${esc(m.time)}</i> ${esc(m.t)}</span>`).join("")}</div>
        <p class="ix-kv"><b>Alibi</b>${esc(s.alibi)}</p>
        <p class="ix-kv ix-pin-note"><b>Detective's note</b>${esc(s.check)}</p>`
      : `<button class="btn small" type="button" data-open="${id}">🔎 Open the evidence</button>`}
    </article>`;
  };
  const draw = () => {
    const all = les.order.every(id => A.seen[id]);
    el.innerHTML = `${head(esc(d.title || "The detective board"), d.say || "", d.ua || "", "Final Mission")}
      <div class="ix-board">
        <div class="ix-board-top"><span class="ix-anon" aria-hidden="true">?</span><div><b>${esc(d.question)}</b>${d.quote ? `<span>“${esc(d.quote)}”</span>` : ""}</div></div>
        <div class="ix-cards">${les.order.map(card).join("")}</div>
        ${d.hint ? `<p class="ix-board-hint">${esc(d.hint)}</p>` : ""}
      </div>`;
    ctx.setCTA({ label: all ? (d.cta || "Continue") : `Open all the evidence (${les.order.filter(id => A.seen[id]).length}/${les.order.length})`, disabled: !all && !ctx.teacher });
  };
  el.onclick = e => { const o = e.target.closest("[data-open]"); if (o){ A.seen[o.dataset.open] = true; save(); draw(); } };
  draw();
}, { label: () => "Board" });

/* грубий автопідрахунок речень у Present Simple / Continuous і слів про характер */
function checkText(text, words){
  const t = String(text || "").replace(/[’‘]/g, "'");
  const sents = t.split(/[.!?\n]+/).map(s => s.trim()).filter(s => S.wordCount(s) >= 3);
  const PC = /(\b(am|is|are|isn't|aren't)|'m|'s|'re)\s+(not\s+|also\s+|still\s+)?[a-z]+ing\b/i;
  const PAST = /\b(sent|was|were|did|found|saw|wrote|told)\b/i;
  const PS = /\b(usually|always|often|never|normally|sometimes|rarely|every|says|say|seems|seem|ignores|knows|likes|doesn't|don't|is|are|am)\b/i;
  let pc = 0, ps = 0;
  sents.forEach(s => s.split(/\bbut\b|,/i).forEach(p => { if (PC.test(p)) pc++; else if (!PAST.test(p) && PS.test(p) && S.wordCount(p) >= 2) ps++; }));
  const traits = words.filter((w, i) => words.indexOf(w) === i && new RegExp("\\b" + w + "\\b", "i").test(t));
  return { ps, pc, traits };
}

/* ============================================================
   accuse — фінальне рішення: підозрюваний, ≥3 докази, пояснення
   data: { evidence:[{id,t,who}], culprit, phrases, sample, wrong:{id:text}, extraWords:[..], need:{ps,pc,traits} }
   Після правильного рішення — автоматично наступний екран (reveal).
   ============================================================ */
define("accuse", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les;
  const K = store(ctx, scr, "k"); K.ev = K.ev || []; K.tries = K.tries || 0; K.text = K.text || "";
  const need = d.need || { ps:2, pc:2, traits:2 };
  const words = (les.recall || []).concat(d.extraWords || []);
  const checks = () => {
    const r = checkText(K.text, words);
    return [
      { ok: r.ps >= need.ps || K.oral, t:`${need.ps} sentences in Present Simple${K.text ? " (" + r.ps + ")" : ""}` },
      { ok: r.pc >= need.pc || K.oral, t:`${need.pc} sentences in Present Continuous${K.text ? " (" + r.pc + ")" : ""}` },
      { ok: r.traits.length >= need.traits || K.oral, t:`${need.traits} character words${r.traits.length ? ": " + r.traits.join(", ") : ""}` }
    ];
  };
  const drawChecks = () => { const b = $("#ck", el); if (b) b.innerHTML = checks().map(c => `<li class="${c.ok ? "ok" : ""}">${c.ok ? "✅" : "⬜"} ${esc(c.t)}</li>`).join(""); };
  const draw = () => {
    el.innerHTML = `${head(esc(d.title || "Who did it?"), "", "", "Final Mission · your decision")}
      <div class="card"><h3 class="ix-h">1. Choose the suspect</h3>${suspects(les, K.who, "data-w", { disabled: K.solved })}</div>
      <div class="card"><h3 class="ix-h">2. Choose at least three pieces of evidence <span class="pill ${K.ev.length >= 3 ? "good" : ""}">${K.ev.length} chosen</span></h3>
        <div class="ix-evs">${d.evidence.map(ev => `<button class="ix-ev ${K.ev.includes(ev.id) ? "on" : ""}" type="button" data-e="${ev.id}" aria-pressed="${K.ev.includes(ev.id)}" ${K.solved ? "disabled" : ""}><span aria-hidden="true">${K.ev.includes(ev.id) ? "📌" : "▫️"}</span>${esc(ev.t)}</button>`).join("")}</div>
        <p class="muted" style="margin:.6em 0 0">Careful: some clues are about other people.</p></div>
      <div class="card"><h3 class="ix-h">3. Explain your decision</h3>
        <p style="margin:0 0 8px">${d.phrases.map(p => `<button class="chip sm" type="button" data-ph="${esc(p)}">${esc(p)}</button>`).join(" ")}</p>
        <textarea id="ct" aria-label="My explanation" placeholder="${esc(d.placeholder || "I think… They usually…, but today they are…")}">${esc(K.text)}</textarea>
        <ul class="checks" id="ck" style="margin-top:10px"></ul>
        <label class="row" style="gap:8px;font-weight:700;cursor:pointer;margin-top:6px"><input type="checkbox" id="oral" ${K.oral ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--good)"> We said it out loud instead</label>
        <button class="btn small link" type="button" data-sample style="margin-top:8px">Show a sample answer</button>
        <div class="help" id="smp" hidden><p>${esc(d.sample)} ${sayBtn(d.sample, "Listen to the sample answer")}</p></div>
      </div>
      <div id="cmsg">${K.msg ? `<div class="note ${K.msgCls || "bad"}">${esc(K.msg)}</div>` : ""}</div>`;
    drawChecks(); updateCTA();
  };
  const updateCTA = () => {
    if (K.solved) ctx.setCTA({ label: d.solvedCta || "Continue" });
    else ctx.setCTA({ label: d.cta || "Submit", disabled: !(K.who && K.ev.length >= 3), action: submit });
  };
  const submit = () => {
    const wrongEv = K.ev.filter(id => d.evidence.find(x => x.id === id).who !== K.who);
    if (K.who !== d.culprit){
      K.tries++; K.msg = "✗ " + ((d.wrong && d.wrong[K.who]) || "Look at the evidence again."); K.msgCls = "bad"; save(); draw(); return;
    }
    if (wrongEv.length){ K.msg = "You chose the right person! But one of your clues is about someone else. Take it off the board."; K.msgCls = "amber"; save(); draw(); return; }
    K.solved = true; K.first = K.tries === 0; K.msg = "✓ Case closed."; K.msgCls = "good"; save(); ctx.next();
  };
  el.onclick = e => {
    if (K.solved && !e.target.closest("[data-sample]")) return;
    const w = e.target.closest("[data-w]"); if (w){ K.who = w.dataset.w; K.msg = ""; save(); draw(); return; }
    const ev = e.target.closest("[data-e]"); if (ev){ const k = K.ev.indexOf(ev.dataset.e); if (k >= 0) K.ev.splice(k, 1); else K.ev.push(ev.dataset.e); K.msg = ""; save(); draw(); return; }
    const ph = e.target.closest("[data-ph]"); if (ph){ const ta = $("#ct", el); ta.value = (ta.value.trim() ? ta.value.trim() + " " : "") + ph.dataset.ph.replace(/…/g, " "); K.text = ta.value; save(); drawChecks(); ta.focus(); return; }
    if (e.target.closest("[data-sample]")){ const h = $("#smp", el); h.hidden = !h.hidden; }
  };
  el.oninput = e => { if (e.target.id === "ct"){ K.text = e.target.value; save(); drawChecks(); } };
  el.onchange = e => { if (e.target.id === "oral"){ K.oral = e.target.checked; save(); drawChecks(); } };
  draw();
}, { label: () => "Decision" });

/* ============================================================
   reveal — анонім відповідає; аватар «?» стає обличчям; To be continued…
   data: { who, msgs:[..], gate:"k" (ключ accuse у цьому етапі), end }
   ============================================================ */
define("reveal", (el, scr, ctx) => {
  const d = scr.data; const les = ctx.les; const K = ctx.ans[d.gate || "k"] || {};
  if (!K.solved && !ctx.teacher){
    document.body.classList.remove("story");
    el.innerHTML = `${head("Not yet 🔒", "", "", "Final Mission")}<div class="card"><p style="margin:0">First make your decision and prove it.</p></div>`;
    ctx.setCTA({ label:"Back to the case", action(){ $("#back").click(); } });
    return;
  }
  const m = les.characters[d.who];
  el.innerHTML = `<div class="story-screen">
    <div class="dchat ix-dark">
      <div class="dhead"><span class="ix-ava lg anon" aria-hidden="true">?</span><div style="text-align:left"><b id="stitle" tabindex="-1">Unknown</b><div style="color:#8A92BD;font-size:.85rem">private message</div></div></div>
      <div id="rv" class="ix-hk" aria-live="polite"></div>
    </div>
    <div class="ix-tbc" id="tbc" hidden>${esc(d.end || "To be continued…")}</div>
  </div>`;
  const box = $("#rv", el);
  const items = d.msgs.map((t, i) => ({ html: msg(les, { who:"anon", t }, { noName:true }), typing:"Someone", wait: i ? 1200 : 900 }));
  const done = () => {
    $$(".ix-ava.anon", el).forEach(a => { a.classList.remove("anon"); a.innerHTML = S.face(m, { zoom:1.9 }); });
    const n = $("#stitle", el); if (n) n.textContent = m.name;
    const t = $("#tbc", el); if (t) t.hidden = false;
    ctx.ans.revealed = true; save();
    ctx.setCTA({ label:"Continue" });
  };
  if (reduced()){ box.innerHTML = items.map(x => x.html).join(""); done(); return; }
  ctx.setCTA({ label:"Continue", disabled:true });
  play(box, items, { done: () => later(done, 600), typeMs:1500 });
}, { story:true, label: () => "Reveal" });

/* ============================================================
   canDo — «Today I can…» + самооцінка
   data: { can:[..], rate:[3 labels], replies:[3 texts] }
   ============================================================ */
define("canDo", (el, scr, ctx) => {
  const d = scr.data; const A = ctx.ans;
  const icons = ["🟢", "🟡", "🔴"];
  const draw = () => {
    el.innerHTML = `${head("Today I can…", "", "", "Wrap-up")}
      <div class="card"><ul class="ix-can">${d.can.map(c => `<li><span aria-hidden="true">✓</span>${esc(c)}</li>`).join("")}</ul></div>
      <div class="ix-rate" role="group" aria-label="How do you feel about today's lesson?">${d.rate.map((r, k) => `<button type="button" class="${A.rate === k ? "on" : ""}" data-rt="${k}" aria-pressed="${A.rate === k}"><span aria-hidden="true">${icons[k]}</span>${esc(r)}</button>`).join("")}</div>
      ${A.rate != null && d.replies ? `<div class="note ${A.rate === 0 ? "good" : "info"}">${esc(d.replies[A.rate])}</div>` : ""}`;
    ctx.setCTA({ label:"Finish episode 🎉" });
  };
  el.onclick = e => { const b = e.target.closest("[data-rt]"); if (b){ A.rate = +b.dataset.rt; save(); draw(); } };
  draw();
}, { label: () => "Today I can" });

})();
