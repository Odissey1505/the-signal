/* THE SIGNAL — програвач епізодів, екрани, роутер, startCourse() */
(function(){
"use strict";
const S = window.SIG;
const { $, $$, esc, reduced, onCleanup, runCleanups, toast, save, L, TTS, sayBtn, avatar } = S;
const CFG = window.SIGNAL_CONFIG, LESSONS = window.SIGNAL_LESSONS;

/* ============================================================
   SCREEN LIST — one screen = one small action
   ============================================================ */
const cache = {};
function screensOf(les){
  if (cache[les.id]) return cache[les.id];
  const out = [];
  const st = id => les.stages.find(s => s.id === id);
  const add = (stage, kind, data, answer) => out.push({ stage, kind, data: data || {}, answer: answer || "", key: stage.id + ":" + kind + ":" + ((data && data.key) != null ? data.key : "") });
  /* урок сам перелічує свої екрани (типи — з js/screens/*.js) */
  if (typeof les.screens === "function"){ les.screens(add, st); cache[les.id] = out; return out; }
  const g = st("judge"); les.order.forEach((c, i) => add(g, "judge", { i, c, key:i, of:les.order.length })); add(g, "judgeFinal");
  const li = st("leadin"); li.items.forEach((it, i) => add(li, "discuss", { i, key:i, of:li.items.length }, it.sample));
  const m = st("meet"); add(m, "meetIntro"); les.order.forEach((c, i) => add(m, "profile", { i, c, key:i, of:les.order.length }));
  const d = st("discover");
  add(d, "hair", {}, d.hair.map(h => h.who + ": " + h.key.join(" + ")).join(" · "));
  d.moments.forEach((mo, i) => add(d, "moment", { i, key:i, of:d.moments.length }, mo.a));
  add(d, "bubbles", {}, "3 — “Actually, she's really funny!”");
  const so = st("sort"); add(so, "sort", {}, "Hair: curly, straight, fair, dark · Good: cheerful, friendly, funny, polite, careful · Not good: rude, lazy, impatient · It depends: shy, serious, confident (accept reasoned choices)");
  const sc = st("scenarios"); sc.items.forEach((it, i) => add(sc, "mcq", { i, key:i, of:sc.items.length }, it.a + " — clue: " + it.hint)); add(sc, "wordlab", {}, sc.wordlab.tasks.map(t => t.a).join(", "));
  const de = st("detective"); de.cases.forEach((c, i) => add(de, "case", { i, key:i, of:de.cases.length }, c.a.join(" / ")));
  const b = st("bets"); b.q.forEach((q, i) => add(b, "bet", { i, key:i, of:b.q.length }));
  add(st("listen"), "listen");
  const co = st("comp");
  add(co, "order", {}, co.order.map(id => les.characters[id].name).join(" → "));
  co.order.forEach((c, i) => add(co, "reality", { i, c, key:i, of:co.order.length }, co.table[c].first.join(" / ") + " → " + co.table[c].real.join(", ")));
  add(co, "tf", {}, co.tf.map((q, i) => (i + 1) + " " + (q.a ? "T" : "F")).join(" · "));
  const p = st("post"); add(p, "results"); add(p, "talk", {}, p.samples.join(" / "));
  const sp = st("speak"); let n = 0; const total = sp.levels.reduce((a, l) => a + l.qs.length, 0);
  sp.levels.forEach((lv, li2) => lv.qs.forEach((q, k) => { n++; add(sp, "speak", { l:li2, k, key:li2 + "-" + k, n, of:total }, q.sample); }));
  const rm = st("realme"); rm.fields.forEach((f, i) => add(rm, "field", { i, key:i, of:rm.fields.length })); add(rm, "profileDone");
  const cl = st("cliff"); add(cl, "story1"); add(cl, "story2"); add(cl, "story3"); add(cl, "homework");
  cache[les.id] = out;
  return out;
}
window.SIGNAL_SCREEN_COUNT = id => LESSONS[id] ? screensOf(LESSONS[id]).length : 0;

const TABS = [
  { key:"warmUp", label:"Warm-up" }, { key:"vocabPresentation", label:"Words" }, { key:"vocabPractice", label:"Practice" },
  { key:"listening", label:"Listening" }, { key:"speaking", label:"Speaking" }, { key:"mission", label:"Mission" }, { key:"summary", label:"Story" }
];
const STORY = ["story1", "story2", "story3"];
const tabsOf = les => les.tabs || TABS;
const isStory = kind => STORY.includes(kind);
const tagIcon = t => t === "Listening" ? "🎧" : t === "Reading" ? "📖" : t === "Grammar" ? "🧩" : t === "Final Mission" ? "🔥" : "📚";
const head = (title, sub, ua, kicker) => `
  ${kicker ? `<div class="kicker">${kicker}</div>` : ""}
  <h2 class="stitle" id="stitle" tabindex="-1">${title}</h2>
  ${sub ? `<p class="sub">${esc(sub)}${ua ? `<span class="ua">${esc(ua)}</span>` : ""}</p>` : ""}`;
const pickLine = () => ["👀 Interesting choice. Let's see if you're right…", "🤔 Hmm. We'll find out soon…", "📝 Noted. Keep that in mind…"][Math.floor(Math.random() * 3)];
const nameOf = (les, id) => les.characters[id] ? les.characters[id].name : id;
const people = (les, sel, attr, opts) => `<div class="people">${les.order.map(id => {
  const c = les.characters[id]; const on = Array.isArray(sel) ? sel.includes(id) : sel === id;
  return `<button class="person ${on ? "on" : ""} ${opts && opts.good && opts.good.includes(id) ? "good" : ""}" type="button" ${attr}="${id}" aria-pressed="${on}">${S.face(c, { label:c.name, zoom:1.35 })}${esc(c.name)}</button>`;
}).join("")}</div>`;

/* ============================================================
   SCREEN RENDERERS  (el, scr, ctx)
   ============================================================ */
const X = {};

X.judge = (el, scr, ctx) => {
  const { les, ans } = ctx; const st = scr.stage; const id = scr.data.c; const c = les.characters[id];
  ans.votes = ans.votes || {};
  let timer = null; onCleanup(() => clearInterval(timer));
  const voted = ans.votes[id];
  el.innerHTML = `${head("Judge me in 5 seconds 👀", "", "", `Photo ${scr.data.i + 1} of ${scr.data.of}`)}
    <div class="card"><div class="judge-grid">
      <div class="photo ${c.img ? "has-img" : ""}" id="photo">${S.photo(c, { label: c.name + ": " + c.photo })}</div>
      <div>
        <div class="row" style="flex-wrap:nowrap"><div class="ring" id="ring" ${voted ? "hidden" : ""}><span id="rn">5</span></div>
          <div><div class="who-name">${esc(c.name)}, ${c.age}</div><div class="muted">What's your first impression?</div></div></div>
        <div class="chips" style="margin-top:16px">${st.words.map(w => `<button class="chip ${voted === w.w ? "on" : ""}" type="button" data-v="${w.w}">${w.e} ${w.w}</button>`).join("")}</div>
        <div id="jnote">${voted ? `<div class="note info">You said: ${esc(voted)}. Let's see if you're right…</div>` : ""}</div>
        <button class="btn link small" type="button" data-again style="margin-top:8px">↻ Show again</button>
      </div></div></div>`;
  const run = () => {
    clearInterval(timer);
    const ph = $("#photo", el), ring = $("#ring", el);
    ph.classList.remove("gone"); ring.hidden = false;
    const t0 = Date.now();
    timer = setInterval(() => {
      const left = Math.max(0, 5 - (Date.now() - t0) / 1000);
      ring.style.setProperty("--p", (left / 5).toFixed(3)); $("#rn", el).textContent = Math.ceil(left);
      if (left <= 0){ clearInterval(timer); ph.classList.add("gone"); if (!ans.votes[id]) $("#jnote", el).innerHTML = `<div class="note amber">⏱ Time's up — trust your gut!</div>`; }
    }, 100);
  };
  if (!voted) run();
  ctx.setCTA({ disabled: !voted });
  el.onclick = e => {
    const v = e.target.closest("[data-v]");
    if (v){
      clearInterval(timer);
      ans.votes[id] = v.dataset.v; save();
      $$("[data-v]", el).forEach(b => b.classList.toggle("on", b === v));
      $("#ring", el).hidden = true; $("#photo", el).classList.remove("gone");
      $("#jnote", el).innerHTML = `<div class="note info">${pickLine()}</div>`;
      ctx.setCTA({ disabled:false });
    }
    if (e.target.closest("[data-again]")) run();
  };
};

X.judgeFinal = (el, scr, ctx) => {
  const { les } = ctx; const votes = (ctx.all.judge && ctx.all.judge.votes) || {};
  el.innerHTML = `${head("Your 5-second verdict", "", "", "Warm-up")}
    <div class="people" style="margin-top:0">${les.order.map(id => `<div class="person" style="cursor:default">${S.face(les.characters[id], { label:les.characters[id].name, zoom:1.35 })}${esc(les.characters[id].name)}<div class="muted" style="font-weight:700">${esc(votes[id] || "—")}</div></div>`).join("")}</div>
    <div class="card" style="margin-top:16px"><p class="q-big">${esc(scr.stage.final)}</p>${sayBtn(scr.stage.final, "Listen", "Listen")}</div>`;
  ctx.setCTA({ label:"Let's find out" });
};

X.discuss = (el, scr, ctx) => {
  const it = scr.stage.items[scr.data.i]; const ans = ctx.ans; ans.notes = ans.notes || {};
  el.innerHTML = `${head("Let's talk 💬", scr.stage.say, scr.stage.ua, `Question ${scr.data.i + 1} of ${scr.data.of}`)}
    <div class="card">
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="q-big" style="flex:1;margin:0">${esc(it.q)}</p>${sayBtn(it.q)}</div>
      <button class="btn small" type="button" data-help style="margin-top:14px">💡 Need help?</button>
      <div class="help" id="help" ${ctx.teacher ? "" : "hidden"}><p><b>Easier:</b> ${esc(it.easy)}</p><p><span class="starter">${esc(it.starter)}</span></p></div>
      <div class="field" style="margin-top:14px"><label for="note">My answer (optional)</label><input type="text" id="note" value="${esc(ans.notes[scr.data.i] || "")}" placeholder="${esc(it.starter)}"></div>
    </div>`;
  el.onclick = e => { if (e.target.closest("[data-help]")){ const h = $("#help", el); h.hidden = !h.hidden; } };
  $("#note", el).oninput = e => { ans.notes[scr.data.i] = e.target.value; save(); };
};

X.meetIntro = (el, scr, ctx) => {
  const { les } = ctx;
  el.innerHTML = `${head("Welcome to Signal Weekend", "", "", "📍 Kraków, Poland · Friday, 4 p.m.")}
    <div class="card">
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><p class="scene" style="flex:1;margin:0">${esc(scr.stage.intro)}</p>${sayBtn(scr.stage.intro, "Listen to the story")}</div>
      <div class="cast-row" style="margin-top:16px">${S.crew().map(p => `<figure>${S.face(p, { label:p.name, zoom:1.7 })}<figcaption>${esc(p.name)}</figcaption></figure>`).join("")}</div>
    </div>
    <div class="card"><p class="q-big" style="margin:0">What are they REALLY like? 🤔</p><p class="muted" style="margin:.4em 0 0">${esc(scr.stage.ua)}</p></div>`;
  ctx.setCTA({ label:"Meet them →" });
};

X.profile = (el, scr, ctx) => {
  const { les, ans } = ctx; const id = scr.data.c; const c = les.characters[id];
  ans.board = ans.board || {}; const b = ans.board[id] = ans.board[id] || {};
  const words = les.stages[0].words;
  el.innerHTML = `${head("What are they really like?", "", "", `Profile ${scr.data.i + 1} of ${scr.data.of}`)}
    <article class="insta">
      <div class="insta-head"><span class="mini">${S.face(c, { zoom:1.9 })}</span><div><b>${esc(c.handle)}</b><small>${esc(c.name)}, ${c.age} · ${esc(c.from)}</small></div><span class="follow" aria-hidden="true">Follow</span></div>
      <div class="insta-photo ${c.img ? "has-img" : ""}">${S.photo(c, { label: c.name + ": " + c.photo })}</div>
      <div class="insta-body"><ul>${c.lines.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
    </article>
    <div class="card" style="margin-top:16px">
      <h3 style="font-size:1.1rem;margin-bottom:10px">My first impression: ${esc(c.name)} looks…</h3>
      <div class="chips">${words.map(w => `<button class="chip ${b.word === w.w ? "on" : ""}" type="button" data-w="${w.w}">${w.e} ${w.w}</button>`).join("")}</div>
      <div class="field" style="margin-top:12px"><label for="own">…or your own word (English or Ukrainian)</label><input type="text" id="own" value="${esc(words.some(w => w.w === b.word) ? "" : b.word || "")}" placeholder="lazy? лінивий?"></div>
      <div class="field"><label for="why">Because…</label><input type="text" id="why" value="${esc(b.why || "")}" placeholder="because ${c.name === "Marko" ? "he's sleeping in his photo" : "…"}"></div>
      <p class="muted" style="margin:0">${scr.stage.starters.map(s => `<span class="starter">${esc(s)}</span>`).join("")}</p>
    </div>`;
  el.onclick = e => { const w = e.target.closest("[data-w]"); if (w){ b.word = w.dataset.w; $("#own", el).value = ""; save(); $$("[data-w]", el).forEach(x => x.classList.toggle("on", x === w)); } };
  el.oninput = e => {
    if (e.target.id === "own"){ b.word = e.target.value; $$("[data-w]", el).forEach(x => x.classList.remove("on")); }
    if (e.target.id === "why") b.why = e.target.value;
    save();
  };
};

X.hair = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.hair = ans.hair || {};
  const draw = () => {
    const allSet = st.hair.every(h => ans.hair[h.id] && ans.hair[h.id].t && ans.hair[h.id].c);
    el.innerHTML = `${head("Hair line-up", "Choose two words for each photo.", "Обери два слова для кожного фото.", "New words")}
      <div class="hair-grid">${st.hair.map((h, k) => { const a = ans.hair[h.id] || {}; const ok = a.t === h.key[0] && a.c === h.key[1]; return `
        <div class="hair ${ans.hairChecked ? (ok ? "ok" : "no") : ""}">
          ${avatar({ hair:h.shape, colour:h.colour }, { faceless:true, label:"Hair photo " + (k + 1) })}
          <div class="seg-toggle" role="group" aria-label="Shape">${["curly","straight"].map(v => `<button type="button" class="${a.t === v ? "on" : ""}" data-h="${h.id}" data-k="t" data-val="${v}" aria-pressed="${a.t === v}">${v}</button>`).join("")}</div>
          <div class="seg-toggle" role="group" aria-label="Colour">${["fair","dark"].map(v => `<button type="button" class="${a.c === v ? "on" : ""}" data-h="${h.id}" data-k="c" data-val="${v}" aria-pressed="${a.c === v}">${v}</button>`).join("")}</div>
          ${ans.hairChecked ? `<small style="font-weight:800;color:${ok ? "var(--good)" : "var(--bad)"}">${ok ? "✓ " + h.who + "'s hair" : "Try again"}</small>` : ""}
        </div>`; }).join("")}</div>
      ${ans.hairChecked ? `<div class="card" style="margin-top:14px">
        <div class="row" style="justify-content:space-between"><b>4 new words</b><button class="btn small addword ${["curly","straight","fair","dark"].every(w => S.state.words[w] && S.state.words[w].added) ? "on" : ""}" type="button" data-addhair>+ Add all to My words</button></div>
        ${["curly","straight","fair","dark"].map(w => { const v = S.vocab(w); return `<div class="wrow"><div class="wm"><b>${w}</b> <span class="muted">${esc(v.ipa)}</span><small>🇺🇦 ${esc(v.ua)} · ${esc(v.ex)}</small></div>${sayBtn(w + ". " + v.ex)}</div>`; }).join("")}
      </div>` : ""}`;
    if (!ans.hairChecked) ctx.setCTA({ label:"Check", disabled:!allSet, action: check });
    else ctx.setCTA({ label:"Continue" });
  };
  const check = () => {
    ans.hairChecked = true;
    st.hair.forEach(h => { const a = ans.hair[h.id] || {}; S.wordResult(h.key[0], a.t === h.key[0]); S.wordResult(h.key[1], a.c === h.key[1]); });
    save(); draw();
  };
  el.onclick = e => {
    const t = e.target.closest("[data-h]");
    if (t){ const a = ans.hair[t.dataset.h] = ans.hair[t.dataset.h] || {}; a[t.dataset.k] = t.dataset.val; if (ans.hairChecked) ans.hairChecked = false; save(); draw(); }
    if (e.target.closest("[data-addhair]")){ ["curly","straight","fair","dark"].forEach(S.addWord); toast("4 words added to My words"); draw(); }
  };
  draw();
};

X.moment = (el, scr, ctx) => {
  const st = scr.stage; const mo = st.moments[scr.data.i]; const ans = ctx.ans; ans.m = ans.m || {};
  const rec = ans.m[scr.data.i] = ans.m[scr.data.i] || {};
  const draw = () => {
    el.innerHTML = `${head("What is this person like?", "", "", `Camp moment ${scr.data.i + 1} of ${scr.data.of}`)}
      <div class="card"><div class="scene-emoji" aria-hidden="true">${mo.e || "🏕️"}</div><p class="scene" style="margin:0">${esc(mo.t)}</p></div>
      <div class="options" role="radiogroup">${mo.o.map(o => { let cls = ""; if (rec.checked){ if (o === mo.a) cls = "good"; else if (o === rec.pick) cls = "bad"; } else if (o === rec.pick) cls = "sel"; return `<button class="opt ${cls}" type="button" role="radio" aria-checked="${o === rec.pick}" data-o="${o}" ${rec.checked ? "disabled" : ""}>${o}</button>`; }).join("")}</div>
      ${rec.checked ? `${rec.pick === mo.a ? "" : `<div class="note bad">Not quite — it's <b>${esc(mo.a)}</b>.</div>`}${S.wordCardHTML(S.vocab(mo.a))}` : ""}`;
    if (rec.checked) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", disabled:!rec.pick, action(){ rec.checked = true; S.wordResult(mo.a, rec.pick === mo.a); save(); draw(); } });
  };
  el.onclick = e => { const o = e.target.closest("[data-o]"); if (o && !rec.checked){ rec.pick = o.dataset.o; save(); draw(); } };
  draw();
};

X.bubbles = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans;
  const draw = () => {
    el.innerHTML = `${head("Looks, seems or actually?", "Three people talk about the same girl. Who knows her best?", "Троє людей говорять про ту саму дівчину. Хто знає її найкраще?", "New phrases")}
      <div style="display:grid;gap:12px">${st.bubbles.map((b, k) => `<button class="speech ${ans.bubble === k ? (ans.bubbleChecked ? (k === st.bubblesKey ? "good" : "sel") : "sel") : ans.bubbleChecked && k === st.bubblesKey ? "good" : ""}" type="button" data-b="${k}" ${ans.bubbleChecked ? "disabled" : ""}>“${esc(b.t)}”<small>${esc(b.s)}</small></button>`).join("")}</div>
      ${ans.bubbleChecked ? `<div class="note ${ans.bubble === st.bubblesKey ? "good" : "bad"}">${ans.bubble === st.bubblesKey ? "✓ Right — person 3 knows her best." : "Person 3 knows her best."}</div><div class="card" style="margin-top:12px">${st.bubblesExplain}</div>` : ""}`;
    if (ans.bubbleChecked) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", disabled: ans.bubble == null, action(){ ans.bubbleChecked = true; save(); draw(); } });
  };
  el.onclick = e => { const b = e.target.closest("[data-b]"); if (b && !ans.bubbleChecked){ ans.bubble = +b.dataset.b; save(); draw(); } };
  draw();
};

X.sort = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.place = ans.place || {};
  const words = ["curly","impatient","friendly","serious","fair","lazy","confident","polite","dark","shy","funny","rude","straight","careful","cheerful"];
  let sel = null;
  const draw = () => {
    const bank = words.filter(w => !ans.place[w]);
    const chip = w => { let cls = sel === w ? "on" : ""; if (ans.checked && ans.place[w] && !cls) cls = st.key[w].includes(ans.place[w]) ? "good" : "bad"; return `<button class="chip ${cls}" type="button" draggable="true" data-w="${w}" aria-pressed="${sel === w}">${w}</button>`; };
    const right = Object.entries(ans.place).filter(([w, b]) => st.key[w].includes(b)).length;
    el.innerHTML = `${head("Sort it", st.say, st.ua, "Practice")}
      <div class="bank" data-basket="">${bank.map(chip).join("") || `<span class="muted">All words are in baskets ✓</span>`}</div>
      <div class="baskets">${st.baskets.map(b => `<div class="basket ${sel ? "ready" : ""}" data-basket="${b.id}" role="button" tabindex="0" aria-label="${b.t}"><h4>${b.t}</h4><div class="chips">${words.filter(w => ans.place[w] === b.id).map(chip).join("")}</div></div>`).join("")}</div>
      ${ans.checked ? `<div class="note ${right === words.length ? "good" : "amber"}">${right} / ${words.length} fit. ${right < words.length ? "Tap a red word and move it." : "Great sorting!"}</div>
        <div class="help"><p><b>${esc(st.after)}</b></p><p>${st.samples.map(s => `<span class="starter">${esc(s)}</span>`).join("")}</p></div>` : ""}`;
    const placed = Object.keys(ans.place).length;
    if (!ans.checked) ctx.setCTA({ label: placed < words.length ? `Check (${placed}/${words.length})` : "Check", disabled: placed < words.length, action(){ ans.checked = true; save(); draw(); } });
    else ctx.setCTA({ label:"Continue" });
  };
  const place = (w, b) => { if (b) ans.place[w] = b; else delete ans.place[w]; sel = null; save(); draw(); };
  el.onclick = e => {
    const c = e.target.closest("[data-w]");
    if (c){ const w = c.dataset.w; const home = c.closest("[data-basket]"); if (sel && sel !== w && home && home.dataset.basket){ place(sel, home.dataset.basket); return; } sel = sel === w ? null : w; draw(); return; }
    const bk = e.target.closest("[data-basket]"); if (bk && sel) place(sel, bk.dataset.basket || null);
  };
  el.onkeydown = e => { const bk = e.target.closest("[data-basket]"); if (bk && sel && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); place(sel, bk.dataset.basket || null); } };
  el.ondragstart = e => { const c = e.target.closest("[data-w]"); if (c) e.dataTransfer.setData("text/plain", c.dataset.w); };
  el.ondragover = e => { const bk = e.target.closest("[data-basket]"); if (bk){ e.preventDefault(); bk.classList.add("over"); } };
  el.ondragleave = e => { const bk = e.target.closest("[data-basket]"); if (bk) bk.classList.remove("over"); };
  el.ondrop = e => { const bk = e.target.closest("[data-basket]"); if (!bk) return; e.preventDefault(); const w = e.dataTransfer.getData("text/plain"); if (w) place(w, bk.dataset.basket || null); };
  draw();
};

X.mcq = (el, scr, ctx) => {
  const it = scr.stage.items[scr.data.i]; const ans = ctx.ans; ans.a = ans.a || {};
  const rec = ans.a[scr.data.i] = ans.a[scr.data.i] || {};
  const hl = () => { const s = esc(it.t), h = esc(it.hint); const k = s.indexOf(h); return k < 0 ? s : s.slice(0, k) + "<mark>" + h + "</mark>" + s.slice(k + h.length); };
  const draw = () => {
    el.innerHTML = `${head("What would you call that?", "", "", `Situation ${scr.data.i + 1} of ${scr.data.of}`)}
      <div class="card"><p class="scene" style="margin:0">${rec.checked ? hl() : esc(it.t)}</p></div>
      <div class="options">${it.o.map(o => { let cls = ""; if (rec.checked){ if (o === it.a) cls = "good"; else if (o === rec.pick) cls = "bad"; } else if (o === rec.pick) cls = "sel"; return `<button class="opt ${cls}" type="button" data-o="${o}" ${rec.checked ? "disabled" : ""}>${o}</button>`; }).join("")}</div>
      ${rec.checked ? `<div class="note ${rec.pick === it.a ? "good" : "bad"}">${rec.pick === it.a ? "✓ Right!" : "It's " + esc(it.a) + "."} The clue: “${esc(it.hint)}”</div>` : ""}`;
    if (rec.checked) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", disabled:!rec.pick, action(){ rec.checked = true; S.wordResult(it.a, rec.pick === it.a); save(); draw(); } });
  };
  el.onclick = e => { const o = e.target.closest("[data-o]"); if (o && !rec.checked){ rec.pick = o.dataset.o; save(); draw(); } };
  draw();
};

X.wordlab = (el, scr, ctx) => {
  const wl = scr.stage.wordlab; const ans = ctx.ans; ans.wl = ans.wl || {};
  const draw = () => {
    const res = wl.tasks.map((t, i) => (ans.wl[i] || "").trim().toLowerCase() === t.a);
    el.innerHTML = `${head("Word lab: opposites 🧪", "What do im- and un- do to a word?", "Що роблять im- та un- зі словом?", "Practice")}
      <div class="card"><div class="chips">${wl.examples.map(x => `<span class="chip" style="cursor:default">${x[0]} → <b style="color:var(--accent)">&nbsp;${x[1]}</b>${x[2]}</span>`).join("")}</div></div>
      <div class="card">${wl.tasks.map((t, i) => `<div class="field"><label for="wl${i}">${t.base} →</label><input type="text" id="wl${i}" data-i="${i}" value="${esc(ans.wl[i] || "")}" autocomplete="off" spellcheck="false" ${ans.wlChecked ? "readonly" : ""} style="${ans.wlChecked ? `border-color:${res[i] ? "var(--good)" : "var(--bad)"}` : ""}"></div>`).join("")}
        ${ans.wlChecked ? `<div class="note ${res.every(Boolean) ? "good" : "amber"}">${res.every(Boolean) ? "✓ They make the word negative — the opposite." : "Answers: " + wl.tasks.map(t => t.a).join(", ") + ". They make the word negative."}</div>` : ""}</div>`;
    if (ans.wlChecked) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", action(){ ans.wlChecked = true; save(); draw(); } });
  };
  el.oninput = e => { if (e.target.dataset.i != null){ ans.wl[e.target.dataset.i] = e.target.value; save(); } };
  draw();
};

X.case = (el, scr, ctx) => {
  const st = scr.stage; const cs = st.cases[scr.data.i]; const ans = ctx.ans; ans.cases = ans.cases || {};
  const s = ans.cases[cs.id] = ans.cases[cs.id] || { shown:1, solved:false, pts:0, locked:false, guess:"", because:"" };
  const total = () => st.cases.reduce((a, c) => a + ((ans.cases[c.id] || {}).pts || 0), 0);
  const ready = () => s.guess && S.wordCount(s.because) >= 2 && !s.locked;
  const updateCTA = () => {
    if (s.solved) ctx.setCTA({ label:"Continue" });
    else if (s.locked) ctx.setCTA({ label:"Open the next clue", disabled:false, action(){ s.shown++; s.locked = false; save(); draw(); } });
    else ctx.setCTA({ label:"Submit answer", disabled:!ready(), action: submit });
  };
  const draw = (msg) => {
    el.innerHTML = `${head("Personality detective 🕵️", "", "", `Mystery camper ${cs.id} · case ${scr.data.i + 1} of ${scr.data.of} <span class="spacer"></span><span class="pill accent">Team score ${total()} / 18</span>`)}
      <div class="card">
        ${cs.clues.map((t, k) => k < s.shown ? `<div class="clue"><b>${k + 1}</b><span>${esc(t)}</span></div>`
          : `<div class="clue locked"><b>${k + 1}</b><span>Clue ${k + 1} · after it, max ${Math.max(1, 3 - k)} point${3 - k === 1 ? "" : "s"}</span>${k === s.shown && !s.solved && !s.locked ? `<span class="spacer"></span><button class="btn small" type="button" data-more>Open</button>` : ""}</div>`).join("")}
      </div>
      ${s.solved ? `<div class="note good">✓ Case closed: ${esc(s.guess)} — +${s.pts} point${s.pts === 1 ? "" : "s"}.<br><span style="font-weight:600">“We think ${cs.who}'s ${esc(s.guess)} because ${esc(s.because.replace(/^because\s*/i, ""))}.”</span></div>` : `
      <div class="card">
        <h3 style="font-size:1.1rem;margin-bottom:10px">We think ${cs.who}'s…</h3>
        <div class="chips">${st.bank.map(w => `<button class="chip ${s.guess === w ? "on" : ""}" type="button" data-g="${w}" ${s.locked ? "disabled" : ""}>${w}</button>`).join("")}</div>
        <div class="field" style="margin-top:12px"><label for="bc">…because</label><input type="text" id="bc" value="${esc(s.because)}" placeholder="${cs.who} …" ${s.locked ? "disabled" : ""}></div>
        ${s.locked ? `<div class="note bad">Not this one. Open the next clue and try again.</div>` : ""}
        ${msg ? `<div class="note ${msg.cls}">${msg.t}</div>` : ""}
      </div>`}`;
    updateCTA();
  };
  const submit = () => {
    if (cs.a.includes(s.guess)){ s.solved = true; s.pts = s.missed ? 0 : Math.max(1, 4 - s.shown); S.wordResult(s.guess, true); save(); draw(); }
    else if (s.shown < 3){ s.locked = true; save(); draw(); }
    else { s.missed = true; s.guess = ""; save(); draw({ cls:"bad", t:"Not this one. All clues are open — try again (no points, but close the case!)." }); }
  };
  el.onclick = e => {
    if (e.target.closest("[data-more]")){ s.shown = Math.min(3, s.shown + 1); s.locked = false; save(); draw(); return; }
    const g = e.target.closest("[data-g]"); if (g){ s.guess = g.dataset.g; save(); $$("[data-g]", el).forEach(x => x.classList.toggle("on", x === g)); updateCTA(); }
  };
  el.oninput = e => { if (e.target.id === "bc"){ s.because = e.target.value; save(); updateCTA(); } };
  draw();
};

X.bet = (el, scr, ctx) => {
  const { les, ans } = ctx; const q = scr.stage.q[scr.data.i];
  ans.b = ans.b || {}; ans.why = ans.why || {};
  const two = q.kind === "two";
  const cur = () => two ? (ans.b[q.id] || []) : ans.b[q.id];
  const ok = () => two ? cur().length === 2 : !!cur();
  el.innerHTML = `${head("Place your bets 🎲", "Make your prediction before you listen.", "Зроби прогноз до прослуховування.", `Bet ${scr.data.i + 1} of ${scr.data.of}`)}
    <div class="card"><p class="q-big" style="margin:0">${esc(q.t)}</p>${two ? `<p class="muted" style="margin:.4em 0 0">Choose two people.</p>` : ""}</div>
    <div id="pp">${people(les, cur(), "data-p")}</div>
    <div class="field" style="margin-top:14px"><label for="bw">Because… (optional)</label><input type="text" id="bw" value="${esc(ans.why[q.id] || "")}" placeholder="${esc(scr.stage.starters[0])}"></div>`;
  ctx.setCTA({ label:"Lock in my bet", disabled:!ok() });
  el.onclick = e => {
    const p = e.target.closest("[data-p]"); if (!p) return;
    const id = p.dataset.p;
    if (two){ const a = (ans.b[q.id] || []).slice(); const k = a.indexOf(id); if (k >= 0) a.splice(k, 1); else { a.push(id); if (a.length > 2) a.shift(); } ans.b[q.id] = a; }
    else ans.b[q.id] = id;
    save(); $("#pp", el).innerHTML = people(les, cur(), "data-p"); ctx.setCTA({ label:"Lock in my bet", disabled:!ok() });
  };
  $("#bw", el).oninput = e => { ans.why[q.id] = e.target.value; save(); };
};

X.listen = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; const { les } = ctx;
  ans.plays = ans.plays || 0;
  let idx = -1, playing = false, token = 0, speed = ans.speed || 1;
  onCleanup(() => { token++; TTS.stop(); });
  const unlocked = () => ans.plays > 0 || ans.unlocked || ctx.teacher;
  const who = { DANA:"dana", MARKO:"marko", LEO:"leo" };
  const dur = t => { const s = Math.max(1, Math.round(S.wordCount(t) * .42)); return "0:" + String(s).padStart(2, "0"); };
  const draw = () => {
    el.innerHTML = `${head("I totally misjudged you! 🎧", st.say, st.ua, `Listening · played ${ans.plays} time${ans.plays === 1 ? "" : "s"}`)}
      <div class="phone">
        <div class="phone-head"><span class="gava">🎙️</span><div><b>Camp kitchen · Day 1</b><small>Dana, Leo, Marko · 22:14</small></div></div>
        <div class="thread" id="thread">
          ${st.script.map((ln, i) => {
            if (ln[0] === "SFX") return `<div class="sys" data-i="${i}">${i ? "😂 " : "🌧 "}${esc(ln[1])}</div>`;
            const id = who[ln[0]]; const c = les.characters[id];
            return `<div class="vmsg ${id === "dana" ? "right" : ""} ${i === idx ? "now" : ""}" data-i="${i}">
              <span class="mini">${S.face(c, { zoom:1.9 })}</span>
              <div class="vbub"><div class="vname name-${id}">${esc(c.name)}</div>
                <div class="vplay"><button type="button" data-line="${i}" aria-label="Play ${esc(c.name)}'s message">▶</button>
                  <div class="vwave" aria-hidden="true">${Array.from({ length: 22 }, (_, k) => `<i style="height:${25 + ((k * 37 + i * 11) % 70)}%"></i>`).join("")}</div>
                  <span class="vdur">${dur(ln[1])}</span></div>
                ${unlocked() ? `<div class="vtext">${esc(ln[1])}</div>` : ""}
              </div></div>`;
          }).join("")}
        </div>
        <div class="phone-foot">
          ${TTS.ok ? `<button class="btn primary" type="button" data-all>${playing ? "⏸ Pause" : idx > 0 ? "▶ Resume" : "▶ Play conversation"}</button>
          <button class="btn small" type="button" data-restart>⟲ Start again</button>
          <label class="row" style="gap:6px;font-weight:700;font-size:.9rem">Speed <select data-speed style="width:auto;padding:.3em .5em">${[.8, .9, 1].map(v => `<option value="${v}" ${v === speed ? "selected" : ""}>${v === 1 ? "normal" : v + "×"}</option>`).join("")}</select></label>`
          : `<span class="muted">This browser can't play the voices. Your teacher will read the conversation.</span>`}
        </div>
      </div>
      <div class="note info">${unlocked() ? "📝 The text is open. Listen again for the details." : "Listen twice: first — who do they talk about? Then — the details. The text opens after the first listen."}</div>`;
    const th = $("#thread", el); const now = th && $(`[data-i="${idx}"]`, th);
    if (now) th.scrollTop = now.offsetTop - th.offsetTop - 80;
  };
  const mark = () => { $$(".vmsg", el).forEach(n => n.classList.toggle("now", +n.dataset.i === idx)); const th = $("#thread", el); const now = $(`[data-i="${idx}"]`, th); if (now) th.scrollTop = now.offsetTop - th.offsetTop - 80; };
  const step = my => {
    if (my !== token || !playing) return;
    if (idx >= st.script.length){ playing = false; idx = -1; ans.pos = 0; ans.plays++; save(); S.markActive(); draw(); return; }
    ans.pos = idx; mark();
    const [sp, text] = st.script[idx];
    if (sp === "SFX"){ setTimeout(() => { if (my === token){ idx++; step(my); } }, 700); return; }
    TTS.speak(text, Object.assign({}, st.voices[sp], { speed }), () => { if (my !== token) return; idx++; setTimeout(() => step(my), 200); });
  };
  el.onclick = e => {
    if (e.target.closest("[data-all]")){
      if (playing){ playing = false; token++; TTS.stop(); save(); draw(); }
      else { playing = true; token++; TTS.stop(); if (idx < 0) idx = ans.pos || 0; draw(); step(token); }
      return;
    }
    if (e.target.closest("[data-restart]")){ token++; TTS.stop(); idx = 0; playing = true; draw(); step(token); return; }
    const one = e.target.closest("[data-line]");
    if (one){ token++; playing = false; TTS.stop(); idx = +one.dataset.line; mark(); const [sp, text] = st.script[idx]; const my = token; TTS.speak(text, Object.assign({}, st.voices[sp], { speed }), () => { if (my === token){ idx = -1; mark(); } }); }
  };
  el.onchange = e => { if (e.target.dataset.speed != null){ speed = +e.target.value; ans.speed = speed; save(); } };
  draw();
  ctx.setCTA({ label:"Continue" });
};

X.order = (el, scr, ctx) => {
  const { les, ans } = ctx; const st = scr.stage; ans.order = ans.order || [];
  const draw = () => {
    const done = ans.order.length === 5; const ok = done && ans.order.every((x, i) => x === st.order[i]);
    el.innerHTML = `${head("Who do they talk about first?", "Tap the people in the order you heard them.", "Натискай на людей у тому порядку, як про них говорили.", "Listening · task 1")}
      ${people(les, ans.order, "data-p", { good: ans.orderChecked && ok ? ans.order : [] })}
      <div class="card" style="margin-top:14px"><div class="row">${ans.order.length ? ans.order.map((id, i) => `<span class="pill accent">${i + 1}. ${esc(nameOf(les, id))}</span>`).join("<span class='muted'>→</span>") : `<span class="muted">Your order appears here.</span>`}
        ${ans.order.length && !ans.orderChecked ? `<span class="spacer"></span><button class="btn small link" type="button" data-clear>Clear</button>` : ""}</div>
        ${ans.orderChecked ? `<div class="note ${ok ? "good" : "bad"}">${ok ? "✓ Correct order!" : "Not quite. The order: " + st.order.map(id => nameOf(les, id)).join(" → ")}</div>` : ""}</div>`;
    if (ans.orderChecked) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", disabled:!done, action(){ ans.orderChecked = true; save(); draw(); } });
  };
  el.onclick = e => {
    if (ans.orderChecked) return;
    const p = e.target.closest("[data-p]");
    if (p && !ans.order.includes(p.dataset.p)){ ans.order.push(p.dataset.p); save(); draw(); }
    if (e.target.closest("[data-clear]")){ ans.order = []; save(); draw(); }
  };
  draw();
};

X.reality = (el, scr, ctx) => {
  const { les, ans } = ctx; const st = scr.stage; const id = scr.data.c; const c = les.characters[id]; const key = st.table[id];
  ans.real = ans.real || {}; ans.first = ans.first || {}; ans.rchk = ans.rchk || {};
  const firstBank = ["serious","confident","lazy","unfriendly","rude","shy","funny"];
  const draw = () => {
    const real = ans.real[id] || []; const chk = ans.rchk[id];
    const same = real.length === key.real.length && real.every(x => key.real.includes(x));
    el.innerHTML = `${head("First impression → reality", "", "", `Listening · task 2 · ${scr.data.i + 1} of ${scr.data.of}`)}
      <div class="card"><div class="row" style="flex-wrap:nowrap"><span style="width:84px;flex:none;border-radius:18px;overflow:hidden;background:var(--surface-2)">${S.face(c, { label:c.name, zoom:1.4 })}</span>
        <div><div class="who-name">${esc(c.name)}</div><div class="muted">${esc(c.handle)}</div></div></div>
        <h3 style="font-size:1.05rem;margin:16px 0 8px">At first, people thought ${esc(c.name)} was…</h3>
        <div class="chips">${firstBank.map(w => { let cls = ans.first[id] === w ? "on" : ""; if (chk && ans.first[id] === w) cls = key.first.includes(w) ? "good" : "bad"; return `<button class="chip ${cls}" type="button" data-f="${w}" ${chk ? "disabled" : ""}>${w}</button>`; }).join("")}</div>
        <h3 style="font-size:1.05rem;margin:18px 0 8px">Actually, ${esc(c.name)} is… <span class="muted" style="font-weight:600">(choose all)</span></h3>
        <div class="chips">${st.bank.filter(w => w !== "unfriendly").map(w => { let cls = real.includes(w) ? "on" : ""; if (chk){ if (key.real.includes(w)) cls = "good"; else if (real.includes(w)) cls = "bad"; } return `<button class="chip ${cls}" type="button" data-r="${w}" ${chk ? "disabled" : ""}>${w}</button>`; }).join("")}</div>
        ${chk ? `<div class="note ${key.first.includes(ans.first[id]) && same ? "good" : "amber"}">${esc(c.name)}: ${key.first.join(" / ")} → <b>${key.real.join(", ")}</b></div>` : ""}
      </div>`;
    if (chk) ctx.setCTA({ label:"Continue" });
    else ctx.setCTA({ label:"Check", disabled: !ans.first[id] || !real.length, action(){ ans.rchk[id] = true; key.real.forEach(w => S.wordResult(w, (ans.real[id] || []).includes(w))); save(); draw(); } });
  };
  el.onclick = e => {
    if (ans.rchk[id]) return;
    const f = e.target.closest("[data-f]"); if (f){ ans.first[id] = f.dataset.f; save(); draw(); return; }
    const r = e.target.closest("[data-r]"); if (r){ const a = ans.real[id] = ans.real[id] || []; const k = a.indexOf(r.dataset.r); if (k >= 0) a.splice(k, 1); else a.push(r.dataset.r); save(); draw(); }
  };
  draw();
};

X.tf = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.tf = ans.tf || {};
  const draw = () => {
    const n = Object.keys(ans.tf).length; const score = st.tf.filter((q, i) => ans.tf[i] === q.a).length;
    el.innerHTML = `${head("True or false?", "", "", `Listening · task 3 · ${score} / ${st.tf.length} correct`)}
      <div class="card">${st.tf.map((q, i) => { const a = ans.tf[i]; return `
        <div class="wrow" style="flex-wrap:wrap">
          <div class="wm" style="min-width:220px"><b style="font-size:1rem">${i + 1}. ${esc(q.s)}</b>${a != null ? `<small style="color:${a === q.a ? "var(--good)" : "var(--bad)"}">${a === q.a ? "✓" : "✗"} ${q.a ? "True." : "False."} ${esc(q.fix)}</small>` : ""}</div>
          <div class="seg-toggle" style="min-width:170px">${[[true, "True"], [false, "False"]].map(([v, t]) => `<button type="button" class="${a === v ? "on" : ""}" data-tf="${i}" data-v="${v ? 1 : 0}" ${a != null ? "disabled" : ""}>${t}</button>`).join("")}</div>
        </div>`; }).join("")}</div>`;
    ctx.setCTA({ label:"Continue", disabled: n < st.tf.length });
  };
  el.onclick = e => { const t = e.target.closest("[data-tf]"); if (t && ans.tf[t.dataset.tf] == null){ ans.tf[t.dataset.tf] = t.dataset.v === "1"; save(); draw(); } };
  draw();
};

X.results = (el, scr, ctx) => {
  const { les } = ctx; const st = scr.stage; const all = ctx.all;
  const bets = (all.bets && all.bets.b) || {}; const votes = (all.judge && all.judge.votes) || {};
  const chk = k => bets[k] ? st.truth[k].includes(bets[k]) : null;
  const pts = (chk("funniest") ? 1 : 0) + (chk("shy") ? 1 : 0) + (chk("wrong") ? 2 : 0);
  ctx.ans.points = pts; save();
  const row = (label, k, pv) => { const r = chk(k); return `<div class="wrow"><div class="wm"><b>${label}</b><small>Your bet: ${bets[k] ? esc(nameOf(les, bets[k])) : "—"}</small></div><span class="status ${r ? "mastered" : r === false ? "new" : "learning"}">${r ? "+" + pv : r === false ? "missed" : "no bet"}</span></div>`; };
  const fr = (bets.friends || []).filter(Boolean);
  el.innerHTML = `${head("Who won the bet? 🏆", st.say, st.ua, "Listening")}
    <div class="card" style="text-align:center"><div class="story-time" style="font-size:3.4rem;color:var(--accent)">${pts} / 4</div><p class="muted" style="margin:0">bet points</p></div>
    <div class="card">${row("😂 The funniest", "funniest", 1)}${row("🙈 Shy", "shy", 1)}${row("⭐ The wrong first impression", "wrong", 2)}
      <div class="wrow"><div class="wm"><b>🤝 Future friends</b><small>${fr.length ? fr.map(id => esc(nameOf(les, id))).join(" & ") : "—"}</small></div><span class="muted">Find out in the next episodes 👀</span></div></div>
    <div class="section-title" style="margin-top:22px"><h2>5 seconds vs reality</h2></div>
    <div class="card">${les.order.map(id => `<div class="wrow"><span style="width:52px;flex:none;border-radius:14px;overflow:hidden;background:var(--surface-2)">${S.face(les.characters[id], { zoom:1.7, label:"" })}</span>
      <div class="wm"><b>${esc(nameOf(les, id))}</b><small>You said: ${esc(votes[id] || "—")} · Really: ${les.characters[id].reality.join(", ")}</small></div></div>`).join("")}</div>`;
};

X.talk = (el, scr, ctx) => {
  const { les, ans } = ctx; const st = scr.stage; ans.now = ans.now || {};
  const bank = ["confident","shy","cheerful","serious","friendly","funny","polite","impatient","careful"];
  const draw = () => {
    el.innerHTML = `${head("Talk about it 💬", "Discuss with your class or partner.", "Обговоріть у класі або в парі.", "Listening")}
      <div class="card"><ol style="margin:0;padding-left:1.2em;font-weight:700;font-size:1.08rem">${st.questions.map(q => `<li style="margin:6px 0">${esc(q)}</li>`).join("")}</ol>
        <button class="btn small" type="button" data-help style="margin-top:10px">💡 Need help?</button>
        <div class="help" id="help" ${ctx.teacher ? "" : "hidden"}>${st.samples.map(s => `<span class="starter">${esc(s)}</span>`).join("")}</div></div>
      <div class="card"><h3 style="font-size:1.1rem">One word now: who is…?</h3>
        ${people(les, ans.now.who, "data-p")}
        <div class="chips" style="margin-top:12px">${bank.map(w => `<button class="chip ${ans.now.word === w ? "on" : ""}" type="button" data-w="${w}">${w}</button>`).join("")}</div>
        <div class="field" style="margin-top:12px"><label for="nw">because…</label><input type="text" id="nw" value="${esc(ans.now.why || "")}"></div>
        ${ans.now.who && ans.now.word ? `<div class="note info">For me, ${esc(nameOf(les, ans.now.who))} is ${esc(ans.now.word)}${ans.now.why ? ", because " + esc(ans.now.why.replace(/^because\s*/i, "")) : "…"}</div>` : ""}</div>`;
  };
  el.onclick = e => {
    if (e.target.closest("[data-help]")){ const h = $("#help", el); h.hidden = !h.hidden; return; }
    const p = e.target.closest("[data-p]"); if (p){ ans.now.who = p.dataset.p; save(); draw(); return; }
    const w = e.target.closest("[data-w]"); if (w){ ans.now.word = w.dataset.w; save(); draw(); }
  };
  el.onchange = e => { if (e.target.id === "nw"){ ans.now.why = e.target.value; save(); draw(); } };
  draw();
};

X.speak = (el, scr, ctx) => {
  const st = scr.stage; const lv = st.levels[scr.data.l]; const q = lv.qs[scr.data.k]; const ans = ctx.ans; ans.done = ans.done || {};
  let timer = null, rec = null, chunks = [], stream = null;
  onCleanup(() => { clearInterval(timer); try { if (rec && rec.state !== "inactive") rec.stop(); } catch(e){} if (stream) stream.getTracks().forEach(t => t.stop()); });
  const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  el.innerHTML = `<div class="kicker" style="justify-content:center">🎤 Let's talk · ${esc(lv.name)} · question ${scr.data.n} of ${scr.data.of}</div>
    <div class="speakmode">
      <span class="pill accent">Level ${scr.data.l + 1}: ${esc(lv.name)}</span>
      <p class="q-big" id="stitle" tabindex="-1">${esc(q.q)}</p>
      <div class="row" style="justify-content:center">${sayBtn(q.q, "Listen", "Listen")}<button class="btn small" type="button" data-help>💡 Need help?</button></div>
      <div class="help" id="help" style="text-align:left" ${ctx.teacher ? "" : "hidden"}>
        <p>🇺🇦 ${esc(q.ua)}</p><p class="muted" style="font-weight:600">${esc(q.en)}</p>
        <p>${st.phrases.slice(0, 3).map(p => `<span class="starter">${esc(p)}</span>`).join("")}</p>
        <p><b>Example:</b> ${esc(q.sample)} ${sayBtn(q.sample, "Listen to the example")}</p>
      </div>
      <div style="margin:22px 0 6px">
        <button class="mic" type="button" data-mic aria-label="${canRec ? "Start recording" : "Start the 30-second timer"}">🎤</button>
        <div class="big-timer" id="tm" aria-live="polite"></div>
        <div class="muted" id="mhint">${canRec ? "Tap to record your answer (30 seconds)" : "Tap to start a 30-second timer"}</div>
        <div id="play" style="margin-top:10px"></div>
      </div>
      <div class="followup"><h4>Follow-up</h4><p class="q-big" style="font-size:1.2rem;margin:.3em 0">${esc(q.fu[0])}</p>
        <button class="btn link small" type="button" data-more>More follow-up questions</button>
        <ul id="more" hidden style="margin:.3em 0 0;font-weight:700">${q.fu.slice(1).map(f => `<li>${esc(f)}</li>`).join("")}</ul></div>
    </div>`;
  const tick = (end) => { const left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); $("#tm", el).textContent = left ? "0:" + String(left).padStart(2, "0") : "✓ 30 seconds!"; if (!left){ clearInterval(timer); if (rec && rec.state === "recording") rec.stop(); } };
  const startTimer = () => { clearInterval(timer); const end = Date.now() + 30000; tick(end); timer = setInterval(() => tick(end), 250); };
  el.onclick = async e => {
    if (e.target.closest("[data-help]")){ const h = $("#help", el); h.hidden = !h.hidden; return; }
    if (e.target.closest("[data-more]")){ $("#more", el).hidden = false; e.target.closest("[data-more]").hidden = true; return; }
    const mic = e.target.closest("[data-mic]"); if (!mic) return;
    ans.done[scr.data.key] = true; save();
    if (!canRec){ startTimer(); return; }
    if (rec && rec.state === "recording"){ rec.stop(); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      rec = new MediaRecorder(stream); chunks = [];
      rec.ondataavailable = ev => chunks.push(ev.data);
      rec.onstop = () => {
        clearInterval(timer); stream.getTracks().forEach(t => t.stop());
        mic.classList.remove("rec"); mic.textContent = "🎤"; $("#mhint", el).textContent = "Tap to record again";
        const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
        $("#play", el).innerHTML = `<audio controls src="${url}"></audio>`;
      };
      rec.start(); mic.classList.add("rec"); mic.textContent = "⏹"; $("#mhint", el).textContent = "Recording… tap to stop"; startTimer();
    } catch(err){ toast("The microphone is off — using the timer instead."); startTimer(); }
  };
  ctx.setCTA({ label: scr.data.n < scr.data.of ? "Next question" : "Continue" });
  ctx.setSkip(true);
};

function missionWords(ctx){
  const f = (ctx.all.realme && ctx.all.realme.f) || {};
  const text = Object.values(f).join(" ").toLowerCase();
  const pool = ctx.les.vocab.map(v => v.w).concat(ctx.les.receptive.map(v => v.w));
  return pool.filter(w => new RegExp("\\b" + w + "\\b").test(text));
}
X.field = (el, scr, ctx) => {
  const st = scr.stage; const f = st.fields[scr.data.i]; const ans = ctx.ans; ans.f = ans.f || {};
  const chips = () => { const u = missionWords(ctx); return `<div class="row"><span class="pill ${u.length >= 4 ? "good" : "amber"}">${u.length} / 4+ words from today</span>${u.map(w => `<span class="chip sm good" style="cursor:default">${w}</span>`).join("")}</div>`; };
  el.innerHTML = `${head("The real me ✍️", scr.data.i === 0 ? st.say : "", scr.data.i === 0 ? st.ua : "", `Mission · step ${scr.data.i + 1} of ${scr.data.of}`)}
    ${scr.data.i === 0 ? `<div class="card"><div class="row" style="gap:12px;align-items:flex-start">
      <div class="field" style="flex:1;min-width:200px;margin:0"><label for="hd">Username</label><input type="text" id="hd" data-meta="handle" value="${esc(ans.handle || "")}" placeholder="@olena.draws.at.night"></div>
      <div class="field" style="flex:1;min-width:160px;margin:0"><label for="nm2">Name, age</label><input type="text" id="nm2" data-meta="name" value="${esc(ans.name || "")}" placeholder="Olena, 13"></div></div></div>` : ""}
    <div class="card">
      <h3 style="font-size:1.35rem">${f.icon} ${esc(f.label)}</h3>
      <div class="row" style="margin:10px 0"><button class="chip sm" type="button" data-starter>${esc(f.starter)}</button></div>
      <textarea id="ta" aria-label="${esc(f.label)}" placeholder="${esc(f.starter)}">${esc(ans.f[f.id] || "")}</textarea>
      <div id="wc" style="margin-top:10px">${chips()}</div>
      <details style="margin-top:12px"><summary class="muted" style="cursor:pointer;font-weight:700">See an example</summary><p style="margin:.5em 0 0">${esc(st.model[f.id])}</p></details>
    </div>`;
  const ta = $("#ta", el);
  el.oninput = e => {
    if (e.target === ta){ ans.f[f.id] = ta.value; save(); $("#wc", el).innerHTML = chips(); }
    if (e.target.dataset.meta){ ans[e.target.dataset.meta] = e.target.value; save(); }
  };
  el.onclick = e => { if (e.target.closest("[data-starter]") && !ta.value.trim()){ ta.value = f.starter.split(/___|…/)[0]; ans.f[f.id] = ta.value; save(); ta.focus(); } };
};

X.profileDone = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.f = ans.f || {};
  const u = missionWords(ctx);
  const checks = [
    { ok: u.length >= 4, t:`4+ words from today (${u.length})` },
    { ok: (ans.f.think || "").trim().length > 3 && /\b(actually|but)\b/i.test(ans.f.actual || ""), t:"“People think… but actually…”" },
    { ok: S.wordCount(ans.f.surprise) >= 4, t:"One surprising detail" }
  ];
  const all = checks.every(c => c.ok);
  if (all && !ans.completed){ ans.completed = true; save(); }
  el.innerHTML = `${head(all ? "Your profile is ready 🎉" : "Almost there…", "", "", "Mission")}
    <article class="insta mcard">
      <div class="insta-head"><span class="mini" style="display:grid;place-items:center;font-weight:800;background:var(--accent-soft);color:var(--accent)">${esc(((ans.name || "?")[0] || "?").toUpperCase())}</span><div><b>${esc(ans.handle || "@your.username")}</b><small>${esc(ans.name || "Your name, age")}</small></div><span class="follow" aria-hidden="true">Follow</span></div>
      <div class="insta-body">${st.fields.map(f => `<p style="margin:.35em 0">${f.icon} ${ans.f[f.id] ? esc(ans.f[f.id]) : `<span class="muted">${esc(f.label)}</span>`}</p>`).join("")}</div>
    </article>
    <div class="card mcard" style="margin-top:14px">
      <ul class="checks">${checks.map(c => `<li class="${c.ok ? "ok" : ""}">${c.ok ? "✅" : "⬜"} ${c.t}</li>`).join("")}</ul>
      ${all ? "" : `<p class="muted" style="margin:.4em 0 0">Go back to finish the missing parts — or continue and do it at home.</p>`}
      <div class="row" style="margin-top:10px"><button class="btn small" type="button" data-copy>Copy my profile</button></div>
    </div>
    <div class="card mcard"><h3 style="font-size:1.1rem">Swap with a partner 🔁</h3><p class="muted">Read your partner's profile and react.</p>
      <div class="chips">${st.reactions.map(r => `<button class="chip ${ans.reaction === r ? "on" : ""}" type="button" data-react="${esc(r)}">${esc(r)}</button>`).join("")}</div>
      <div class="field" style="margin-top:12px"><label for="rt">My reaction</label><input type="text" id="rt" value="${esc(ans.reactText || "")}"></div></div>`;
  el.onclick = async e => {
    const r = e.target.closest("[data-react]");
    if (r){ ans.reaction = r.dataset.react; const i = $("#rt", el); if (!i.value.trim()) i.value = r.dataset.react.split("…")[0]; ans.reactText = i.value; save(); $$("[data-react]", el).forEach(b => b.classList.toggle("on", b === r)); i.focus(); }
    if (e.target.closest("[data-copy]")){
      const out = [ans.handle || "@me", ans.name || ""].concat(st.fields.map(f => f.icon + " " + (ans.f[f.id] || ""))).join("\n");
      try { await navigator.clipboard.writeText(out); toast("Profile copied"); } catch(err){ toast("Copying is blocked here — select the text instead."); }
    }
  };
  $("#rt", el).oninput = e => { ans.reactText = e.target.value; save(); };
};

X.story1 = (el, scr, ctx) => {
  el.innerHTML = `<div class="story-screen">
    <div class="story-time" id="stitle" tabindex="-1">10:47 PM</div>
    <p class="story-line" style="animation-delay:.3s">Zoe's phone vibrates.</p>
    <div class="buzz" aria-hidden="true">📱</div>
    <p class="story-line" style="animation-delay:1s;color:#EEF1FF;font-weight:800">New message: 1</p>
    <button class="btn hot big" type="button" data-open style="margin-top:10px">Open</button>
  </div>`;
  ctx.setCTA({ hidden:true });
  $("[data-open]", el).onclick = () => ctx.next();
};
X.story2 = (el, scr, ctx) => {
  const r = reduced();
  const d = s => r ? 0 : s;
  el.innerHTML = `<div class="story-screen"><div class="dchat">
    <div class="dhead"><span class="gava" style="width:40px;height:40px;border-radius:50%;background:#5B4BFF;display:grid;place-items:center">🎙️</span><div style="text-align:left"><b id="stitle" tabindex="-1">Signal Weekend</b><div style="color:#8A92BD;font-size:.85rem">20 members</div></div></div>
    <div class="dmsg" style="animation-delay:${d(.3)}s"><small>Unknown</small>📎 posted a screenshot
      <div class="shot" style="margin-top:8px"><i style="width:70%"></i><i style="width:45%;margin-left:auto;background:#3B3F8F"></i><i style="width:80%"></i><i style="width:55%"></i><i style="width:35%;margin-left:auto;background:#3B3F8F"></i></div>
      <div style="font-size:.8rem;color:#8A92BD;margin-top:6px">A private conversation. About Zoe.</div></div>
    <div class="dmsg" style="animation-delay:${d(1.8)}s"><small>Unknown</small>She's not really like that.</div>
    <div class="dmsg big" style="animation-delay:${d(3.2)}s"><small>Unknown</small>She's just pretending.</div>
  </div></div>`;
  ctx.setCTA({ label:"Continue", disabled:!r });
  if (!r){ const t = setTimeout(() => ctx.setCTA({ label:"Continue" }), 4000); onCleanup(() => clearTimeout(t)); }
};
X.story3 = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.ticket = ans.ticket || {};
  const words = ["confident","shy","cheerful","serious","friendly","funny","polite","impatient","lazy","careful"];
  const draw = () => {
    el.innerHTML = `<div class="story-screen" style="min-height:0;padding-top:10px">
      <div class="end-title">END OF EPISODE 1</div>
      <div class="story-time" id="stitle" tabindex="-1" style="font-size:clamp(2.2rem,7vw,3.6rem)">What happened? 👀</div>
    </div>
    <div class="card" style="margin-top:18px"><h3 style="font-size:1.1rem;margin-bottom:8px">${esc(st.exit)}</h3>
      <textarea id="ex" placeholder="I think … wrote it because …">${esc(ans.exit || "")}</textarea></div>
    <div class="card"><h3 style="font-size:1.1rem;margin-bottom:8px">At first, people see me as…</h3>
      <div class="chips">${words.map(w => `<button class="chip ${ans.ticket.first === w ? "on" : ""}" type="button" data-t="first" data-w="${w}">${w}</button>`).join("")}</div>
      <h3 style="font-size:1.1rem;margin:16px 0 8px">The real me is…</h3>
      <div class="chips">${words.map(w => `<button class="chip ${ans.ticket.real === w ? "on" : ""}" type="button" data-t="real" data-w="${w}">${w}</button>`).join("")}</div></div>`;
  };
  el.onclick = e => { const t = e.target.closest("[data-t]"); if (t){ ans.ticket[t.dataset.t] = t.dataset.w; save(); draw(); } };
  el.oninput = e => { if (e.target.id === "ex"){ ans.exit = e.target.value; save(); } };
  draw();
};
X.homework = (el, scr, ctx) => {
  const st = scr.stage; const ans = ctx.ans; ans.hw = ans.hw || {};
  const meta = S.lessonMeta(ctx.les.id);
  const nxt = meta ? meta.cycle.lessons[1] : null;
  el.innerHTML = `${head("Before next time 📝", "", "", "Homework")}
    <div class="card">${st.homework.map((h, i) => `<label class="wrow" style="cursor:pointer"><input type="checkbox" data-hw="${i}" ${ans.hw[i] ? "checked" : ""} style="width:22px;height:22px;accent-color:var(--good);flex:none"><span class="wm" style="font-weight:600">${esc(h)}</span></label>`).join("")}</div>
    ${nxt ? `<div class="card" style="background:linear-gradient(160deg,#241046,#0E1433);color:#fff"><div class="muted" style="color:#FF9DB5;font-weight:800">💬 Next: Episode 2</div><h3 style="font-size:1.4rem;margin:.3em 0">${esc(nxt.title)}</h3><p style="opacity:.8;margin:0">Tomorrow morning, everyone is acting strangely. And someone in the group chat is watching… ${nxt.content ? "▶ Available after this episode." : "🔒 Coming soon."}</p></div>` : ""}`;
  el.onchange = e => { if (e.target.dataset.hw != null){ ans.hw[e.target.dataset.hw] = e.target.checked; save(); } };
  ctx.setCTA({ label:"Finish episode 🎉" });
};

/* ============================================================
   EPISODE PLAYER
   ============================================================ */
let mounted = null;
function mountEpisode(id){
  const les = LESSONS[id];
  const meta = S.lessonMeta(id);
  document.body.classList.remove("story");
  $("#app").innerHTML = `
    <header class="player-top">
      <div class="wrap">
        <a class="icon-btn" href="#/series/${meta.cycle.n}" aria-label="Back to the series">←</a>
        <span class="ptitle">${meta.cycle.emoji} ${esc(meta.cycle.title)}</span>
        <div class="segs" aria-hidden="true">${meta.cycle.lessons.map(l => `<div class="seg" data-seg="${l.id}"><i style="width:0"></i></div>`).join("")}</div>
        <span class="timeleft" id="tleft"></span>
        <button class="icon-btn" type="button" id="mapbtn" hidden aria-label="Lesson map" title="Lesson map — jump to any part">🧭</button>
        <button class="icon-btn" type="button" data-toggle="teacher" id="tbtn" hidden></button>
      </div>
      <div class="wrap"><nav class="sections" id="secs" aria-label="Episode parts"></nav></div>
    </header>
    <main class="stage" id="main"><div id="screen"></div><div id="tpanel"></div></main>
    <div id="lmap-scrim" class="lmap-scrim" hidden></div>
    <aside id="lmap" class="lmap" hidden aria-label="Lesson map"></aside>
    <div class="dock"><div class="inner">
      <button class="btn" type="button" id="back" aria-label="Previous screen">←</button>
      <span class="spacer"></span>
      <button class="btn link" type="button" id="skip" hidden>Skip</button>
      <button class="btn primary big main-cta" type="button" id="cta">Continue</button>
    </div></div>`;
  mounted = id;
  const ls = L(id);
  $("#back").onclick = () => { if (ls.pos > 0) go(id, ls.pos - 1); };
  $("#secs").onclick = e => { const b = e.target.closest("[data-sec]"); if (b && !b.disabled) go(id, +b.dataset.sec); };
  $("#skip").onclick = () => nextScreen(id);
  $("#mapbtn").onclick = () => { const m = $("#lmap"); if (m.hidden){ drawMap(id); m.hidden = false; $("#lmap-scrim").hidden = false; const cur = $(".lm-scr.cur", m); if (cur) cur.focus(); } else closeMap(); };
  $("#lmap-scrim").onclick = closeMap;
  $("#lmap").onclick = e => {
    if (e.target.closest("[data-close-map]")){ closeMap(); return; }
    const j = e.target.closest("[data-jump]"); if (j){ closeMap(); go(id, +j.dataset.jump); return; }
    const r = e.target.closest("[data-reset-lesson]");
    if (r){
      if (!r.dataset.confirm){ r.dataset.confirm = "1"; r.textContent = "Tap again — this clears the episode"; r.classList.add("hot"); return; }
      S.resetLesson(id); closeMap(); mounted = null; toast("Episode cleared — starting from the first screen");
      location.hash = `#/episode/${id}/1`;
      if (location.hash === `#/episode/${id}/1`) render();
    }
  };
}

/* ---------- teacher lesson map ---------- */
const SCREEN_LABEL = {
  judge: d => "Photo " + (d.i + 1), judgeFinal: () => "Verdict", discuss: d => "Question " + (d.i + 1),
  meetIntro: () => "Intro", profile: (d, les) => les.characters[d.c].name, hair: () => "Hair",
  moment: d => "Moment " + (d.i + 1), bubbles: () => "Looks / seems", sort: () => "Sort",
  mcq: d => "Situation " + (d.i + 1), wordlab: () => "Word lab", case: (d, les) => "Camper " + les.stages.find(x => x.id === "detective").cases[d.i].id,
  bet: d => "Bet " + (d.i + 1), listen: () => "Audio", order: () => "Order", reality: (d, les) => les.characters[d.c].name,
  tf: () => "True / false", results: () => "Results", talk: () => "Discussion",
  speak: (d, les) => les.stages.find(x => x.id === "speak").levels[d.l].name + " " + (d.k + 1),
  field: d => "Step " + (d.i + 1), profileDone: () => "Profile", story1: () => "10:47 PM", story2: () => "Message", story3: () => "Exit", homework: () => "Homework"
};
function drawMap(id){
  const les = LESSONS[id]; const ls = L(id); const list = screensOf(les);
  const box = $("#lmap");
  box.innerHTML = `
    <header><div><b>Lesson map</b><small>Teacher view · jump to any part</small></div><button class="icon-btn" type="button" data-close-map aria-label="Close the lesson map">✕</button></header>
    <div class="lm-reset"><button class="btn small ghost" type="button" data-reset-lesson>↻ Start this episode again</button><span class="muted" id="lm-reset-hint">Clears your own answers and progress in this episode.</span></div>
    <div class="lm-body">${tabsOf(les).map(t => {
      const stages = les.stages.filter(st => st.section === t.key);
      if (!stages.length) return "";
      return `<h4>${t.label}</h4>` + stages.map(st => {
        const items = list.map((sc, k) => ({ sc, k })).filter(x => x.sc.stage === st);
        const doneAll = items.every(x => ls.done[x.sc.key]);
        return `<div class="lm-stage ${items.some(x => x.k === ls.pos) ? "here" : ""}">
          <button class="lm-title" type="button" data-jump="${items[0].k}"><span class="lm-n ${doneAll ? "done" : ""}">${doneAll ? "✓" : st.n}</span><span>${esc(st.title)}</span><span class="muted">${st.min}′</span></button>
          ${items.length > 1 ? `<div class="lm-screens">${items.map(x => `<button class="lm-scr ${x.k === ls.pos ? "cur" : ""} ${ls.done[x.sc.key] ? "done" : ""}" type="button" data-jump="${x.k}" ${x.k === ls.pos ? 'aria-current="step"' : ""}>${esc(SCREEN_LABEL[x.sc.kind] ? SCREEN_LABEL[x.sc.kind](x.sc.data, les) : x.sc.kind)}</button>`).join("")}</div>` : ""}
        </div>`;
      }).join("");
    }).join("")}</div>`;
}
function closeMap(){ const m = $("#lmap"); if (m) m.hidden = true; const sc = $("#lmap-scrim"); if (sc) sc.hidden = true; }

/* teacher: ← / → move between screens without checks (not while typing) */
document.addEventListener("keydown", e => {
  if (!mounted || !S.teacherOn() || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key === "Escape"){ closeMap(); return; }
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const ls = L(mounted); const total = screensOf(LESSONS[mounted]).length;
  const n = ls.pos + (e.key === "ArrowRight" ? 1 : -1);
  if (n >= 0 && n < total){ e.preventDefault(); go(mounted, n); }
});
function go(id, i){ location.hash = `#/episode/${id}/${i + 1}`; }
function nextScreen(id){
  const les = LESSONS[id]; const ls = L(id); const list = screensOf(les);
  const scr = list[ls.pos];
  ls.done[scr.key] = true; S.markActive();
  if (ls.pos + 1 >= list.length){ ls.finished = true; save(); location.hash = `#/episode/${id}/done`; return; }
  ls.max = Math.max(ls.max, ls.pos + 1);
  save();
  go(id, ls.pos + 1);
}
function renderEpisode(id, n){
  const les = LESSONS[id];
  if (!les){ location.hash = "#/"; return; }
  const ls = L(id);
  const list = screensOf(les);
  if (n === "done") return renderFinish(les, ls);
  if (mounted !== id || !$("#screen")) mountEpisode(id);
  runCleanups(); TTS.stop();
  let i = n == null ? (ls.finished ? 0 : ls.pos || 0) : n - 1;
  i = Math.max(0, Math.min(list.length - 1, i));
  if (!S.teacherOn() && i > ls.max + 1) i = ls.max;
  ls.pos = i; ls.max = Math.max(ls.max, i); save();
  const scr = list[i];
  const teacher = S.teacherOn();
  document.body.classList.toggle("story", isStory(scr.kind));
  if (les.theme) document.body.dataset.episodeTheme = les.theme; else delete document.body.dataset.episodeTheme;

  /* top: episode segments, time, tabs */
  const meta = S.lessonMeta(id);
  meta.cycle.lessons.forEach(l => { const seg = $(`[data-seg="${l.id}"] i`); if (seg) seg.style.width = (l.id === id ? Math.round(Object.keys(ls.done).length / list.length * 100) : (S.state.lessons[l.id] && S.state.lessons[l.id].finished ? 100 : 0)) + "%"; });
  let left = 0;
  les.stages.forEach(stg => { const items = list.filter(s => s.stage === stg); const rem = items.filter(s => !ls.done[s.key]).length; left += stg.min * rem / items.length; });
  $("#tleft").textContent = Math.max(1, Math.round(left)) + " min left";
  const tb = $("#tbtn"); tb.hidden = !S.isTeacher();
  tb.textContent = teacher ? "🧑‍🏫" : "🎓"; tb.title = teacher ? "Teacher view (tap to see the student view)" : "Student view (tap for teacher view)"; tb.setAttribute("aria-label", tb.title);
  $("#mapbtn").hidden = !teacher;
  if (!teacher) closeMap(); else if ($("#lmap") && !$("#lmap").hidden) drawMap(id);
  tb.style.background = teacher ? "var(--amber-soft)" : "";
  $("#secs").innerHTML = tabsOf(les).map(t => {
    const first = list.findIndex(s => s.stage.section === t.key);
    if (first < 0) return "";
    const items = list.filter(s => s.stage.section === t.key);
    const done = items.every(s => ls.done[s.key]);
    const locked = !teacher && first > ls.max;
    return `<button class="sec ${scr.stage.section === t.key ? "on" : ""} ${done ? "done" : ""}" type="button" data-sec="${first}" ${locked ? "disabled" : ""}>${done ? "✓ " : ""}${t.label}</button>`;
  }).join("");
  const on = $("#secs .sec.on"); if (on) on.scrollIntoView({ block:"nearest", inline:"center" });

  /* CTA plumbing */
  const cta = $("#cta"), skip = $("#skip");
  const ctx = {
    les, scr, teacher,
    all: ls.ans,
    ans: ls.ans[scr.stage.id] = ls.ans[scr.stage.id] || {},
    next: () => nextScreen(id),
    setCTA(o){
      o = o || {};
      cta.hidden = !!o.hidden;
      cta.textContent = o.label || "Continue";
      cta.disabled = !!o.disabled;
      cta.onclick = o.action || (() => nextScreen(id));
    },
    setSkip(v){ skip.hidden = !v; }
  };
  ctx.setCTA({});
  ctx.setSkip(teacher && !isStory(scr.kind));
  $("#back").disabled = i === 0;

  const el = $("#screen");
  el.className = "";
  el.onclick = el.oninput = el.onchange = el.onkeydown = el.ondragstart = el.ondragover = el.ondragleave = el.ondrop = null;
  void el.offsetWidth;
  el.className = "screen";
  try { (X[scr.kind] || (() => { el.textContent = "Unknown screen."; }))(el, scr, ctx); }
  catch(err){ console.error(err); el.innerHTML = `<div class="note bad">This screen couldn't load. Reload the page — your answers are saved.</div>`; }
  if (teacher && !isStory(scr.kind)) ctx.setSkip(true);

  /* teacher panel */
  $("#tpanel").innerHTML = teacher ? `<div class="tpanel"><h4>🧑‍🏫 ${scr.stage.n}. ${esc(scr.stage.title)} · ≈ ${scr.stage.min} min · <code>${esc(scr.stage.section)}</code></h4>${scr.stage.teacher || ""}${scr.answer ? `<div class="key">✅ ${esc(scr.answer)}</div>` : ""}</div>` : "";

  window.scrollTo(0, 0);
  const h = $("#stitle"); if (h && n != null) h.focus({ preventScroll:true });
}

function renderFinish(les, ls){
  mounted = null;
  if (typeof les.finish === "function") return finishPage(les, les.finish(ls.ans, les));
  const a = ls.ans; const meta = S.lessonMeta(les.id);
  const d = les.stages.find(s => s.id === "discover");
  const mRight = d.moments.filter((m, k) => a.discover && a.discover.m && a.discover.m[k] && a.discover.m[k].pick === m.a).length;
  const sc = les.stages.find(s => s.id === "scenarios");
  const qRight = sc.items.filter((it, k) => a.scenarios && a.scenarios.a && a.scenarios.a[k] && a.scenarios.a[k].pick === it.a).length;
  const det = a.detective && a.detective.cases ? Object.values(a.detective.cases).reduce((x, c) => x + (c.pts || 0), 0) : 0;
  const bets = (a.post && a.post.points) || 0;
  const words = les.vocab.filter(v => S.state.words[v.w] && S.state.words[v.w].added).length;
  S.shell("course", `
    <div class="finish-hero screen"><div class="big">🎉</div><h1>Episode 1 complete</h1><p class="muted" style="max-width:48ch;margin:.5em auto 0">First impressions aren't the whole story. And someone in the group chat seems to know that too…</p></div>
    <div class="stats">
      <div class="stat"><b>📚 ${words} / ${les.vocab.length}</b><span>words in My words</span></div>
      <div class="stat"><b>🎯 ${mRight + qRight} / ${d.moments.length + sc.items.length}</b><span>first-try answers</span></div>
      <div class="stat"><b>🕵️ ${det} / 18</b><span>detective points</span></div>
      <div class="stat"><b>🎲 ${bets} / 4</b><span>bet points</span></div>
    </div>
    <div class="row" style="justify-content:center;margin-top:24px">
      <a class="btn primary big" href="#/practice">Practise my words</a>
      <a class="btn big" href="#/series/${meta.cycle.n}">Back to the series</a>
      <a class="btn link" href="#/episode/${les.id}/1">Watch again</a>
    </div>
    <div class="continue" style="margin-top:30px">${S.cover(meta.cycle)}<div class="cbody"><div class="series">💬 Next episode</div><h2>${esc(meta.cycle.lessons[1].title)}</h2><p class="muted" style="margin:0">Present simple vs present continuous. Someone in the group chat is watching — and everyone is acting strangely.</p>${meta.cycle.lessons[1].content ? `<div class="row"><a class="btn primary big" href="#/episode/${meta.cycle.lessons[1].id}">Start episode 2</a></div>` : `<p class="muted" style="margin:0">🔒 In production.</p>`}</div></div>`);
}
/* загальна сторінка «епізод завершено» для уроків з функцією finish(ans) */
function finishPage(les, f){
  const meta = S.lessonMeta(les.id);
  const idx = meta.cycle.lessons.indexOf(meta.lesson);
  const nx = meta.cycle.lessons[idx + 1];
  const words = les.vocab && les.vocab.length && les.vocab.some(v => S.state.words[v.w] && S.state.words[v.w].added);
  S.shell("course", `
    <div class="finish-hero screen"><div class="big">${f.icon || "🎉"}</div><h1>${esc(f.title || "Episode complete")}</h1>${f.text ? `<p class="muted" style="max-width:50ch;margin:.5em auto 0">${esc(f.text)}</p>` : ""}</div>
    ${f.stats && f.stats.length ? `<div class="stats">${f.stats.map(s => `<div class="stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</div>` : ""}
    <div class="row" style="justify-content:center;margin-top:24px">
      ${words ? `<a class="btn primary big" href="#/practice">Practise my words</a>` : ""}
      <a class="btn ${words ? "" : "primary"} big" href="#/series/${meta.cycle.n}">Back to the series</a>
      <a class="btn link" href="#/episode/${les.id}/1">Watch again</a>
    </div>
    ${nx ? `<div class="continue" style="margin-top:30px">${S.cover(meta.cycle)}<div class="cbody"><div class="series">${nx.type === "C" ? "🔥 Next episode · Final Mission" : "💬 Next episode"}</div><h2>${esc(nx.title)}</h2>${nx.content ? `<div class="row"><a class="btn primary big" href="#/episode/${nx.id}">Start episode ${idx + 2}</a></div>` : `<p class="muted" style="margin:0">🔒 In production.</p>`}</div></div>` : ""}`);
}

/* add-to-My-words buttons anywhere */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-addword]");
  if (!b) return;
  S.addWord(b.dataset.addword);
  b.classList.add("on"); b.textContent = "✓ In My words";
  toast("Added to My words");
});

/* ============================================================
   ROUTER & INIT
   ============================================================ */
function render(){
  const h = location.hash || "#/";
  let m;
  if ((m = h.match(/^#\/episode\/([\w-]+)(?:\/(\d+|done))?/))) return renderEpisode(m[1], m[2] === "done" ? "done" : m[2] ? +m[2] : null);
  if ((m = h.match(/^#\/lesson\/([\w-]+)/))) { location.replace("#/episode/" + m[1]); return; }
  mounted = null; TTS.stop();
  if ((m = h.match(/^#\/series\/(\d+)/))) { S.renderSeries(+m[1]); window.scrollTo(0, 0); return; }
  if (h.startsWith("#/words")) { S.renderWords(); return; }
  if (h.startsWith("#/practice")) { S.resetPractice(); S.renderPractice(); return; }
  if (h.startsWith("#/progress")) { S.renderProgress(); return; }
  if (h.startsWith("#/students")) { S.renderStudents(); return; }
  S.renderHome(); window.scrollTo(0, 0);
}
window.SignalRender = () => {
  const h = location.hash;
  if (/^#\/episode\/[\w-]+\/\d+/.test(h) || /^#\/episode\/[\w-]+$/.test(h)){ mounted = null; }
  if (h.startsWith("#/practice")) { S.renderPractice(); return; }
  render();
};

/* Викликається блоком INKWELL AUTH: startCourse(user) після входу,
   startCourse(null, "preview") для ?preview=1, startCourse(null, "offline") якщо Supabase не завантажився. */
let started = false;

/* Підвантажує файли уроків, перелічені в js/course.js (content: true, file: "...") */
function loadScript(src){
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src; el.async = false;
    el.onload = resolve; el.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(el);
  });
}
async function loadLessons(){
  const v = CFG.VERSION ? "?v=" + encodeURIComponent(CFG.VERSION) : "";
  const jobs = [];
  window.SIGNAL_COURSE.seasons.forEach(s => s.cycles.forEach(c => c.lessons.forEach(l => {
    if (!l.content) return;
    if (!l.file){ if (!LESSONS[l.id]) l.content = false; return; }
    jobs.push(loadScript(l.file + v)
      .then(() => { if (!LESSONS[l.id]){ console.warn("Signal: " + l.file + " did not register lesson " + l.id); l.content = false; } })
      .catch(err => { console.warn("Signal:", err.message); l.content = false; }));
  })));
  await Promise.all(jobs);
  /* урок, що спирається на інший (напр. спільні персонажі), вимикається, якщо той не завантажився */
  window.SIGNAL_COURSE.seasons.forEach(s => s.cycles.forEach(c => c.lessons.forEach(l => {
    const les = LESSONS[l.id];
    if (l.content && les && (les.requires || []).some(r => !LESSONS[r])){ console.warn("Signal: " + l.id + " needs " + les.requires.join(", ")); l.content = false; }
  })));
}

window.startCourse = async function(user, why){
  if (started) return;
  started = true;
  await loadLessons();
  S.loadLocal(); S.applyTheme();
  const q = new URLSearchParams(location.search);
  if (user && window.SB){
    S.sb = window.SB; S.user = user; S.mode = "cloud";
    await S.pull(); S.applyTheme();
  } else {
    S.sb = null; S.user = null; S.mode = why === "preview" ? "preview" : "local";
  }
  await S.loadRole();
  if (q.get("teacher") === "1" && S.isTeacher()) S.state.teacher = true;
  window.addEventListener("hashchange", render);
  render();
};
window.SignalApp = { render, state: () => S.state, screens: id => screensOf(LESSONS[id]).map(s => s.kind) };

/* API для бібліотек екранів (js/screens/*.js):
   SignalPlayer.define("type", render(el, scr, ctx), { story, label(data, les) }) */
window.SignalPlayer = {
  head, people, nameOf,
  define(kind, fn, opts){
    opts = opts || {};
    X[kind] = fn;
    if (opts.story && !STORY.includes(kind)) STORY.push(kind);
    if (opts.label) SCREEN_LABEL[kind] = opts.label;
  },
  has: kind => typeof X[kind] === "function"
};
})();
