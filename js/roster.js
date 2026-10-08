/* ============================================================
   THE SIGNAL — учні курсу
   1) Учень, який відкрив курс, сам записується в таблицю signal_students.
   2) Вкладка Students (лише викладач): список усіх, хто відкривав курс або має прогрес.
   3) Сторінка учня #/students/<id>: активність, епізоди й частини уроку, письмові відповіді,
      слова; викладач може позначити епізод пройденим / непройденим або очистити його.
   Таблиці й правила — sql/signal_progress.sql і sql/signal_students.sql.
   Підключається після player.js, перед auth.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, CFG = window.SIGNAL_CONFIG;
if (!S || !CFG) return;
const TABLE = CFG.STUDENTS_TABLE || "signal_students";
const PROG = CFG.PROGRESS_TABLE;
const { $, esc, toast } = S;
const tableMissing = e => !!e && (e.code === "42P01" || e.code === "PGRST205" || /does not exist|schema cache/i.test(e.message || ""));

/* ---------- учень: запис на курс під час входу ---------- */
async function enroll(){
  const sb = S.sb, user = S.user;
  if (!sb || !user || S.isTeacher()) return;
  let name = "";
  try {
    const { data } = await sb.from("profiles").select("display_name, username").eq("id", user.id).maybeSingle();
    if (data) name = data.display_name || data.username || "";
  } catch(e){}
  if (!name){ const m = user.user_metadata || {}; name = m.full_name || m.name || m.first_name || ""; }
  const row = { user_id:user.id, course_id:CFG.COURSE_ID, email:user.email || null, last_seen:new Date().toISOString() };
  if (name) row.name = name;
  try {
    const { error } = await sb.from(TABLE).upsert(row, { onConflict:"user_id,course_id" });
    if (error) throw error;
  } catch(e){ console.warn("Signal: could not add the student to the course list", e); }
}
const startCourse = window.startCourse;
if (typeof startCourse === "function"){
  window.startCourse = async function(user, why){
    await startCourse(user, why);
    enroll();
  };
}

/* ---------- спільні помічники ---------- */
const LESSONS = () => window.SIGNAL_LESSONS || {};
const cycles = () => window.SIGNAL_COURSE.seasons.flatMap(s => s.cycles);
const screenCount = id => window.SIGNAL_SCREEN_COUNT ? window.SIGNAL_SCREEN_COUNT(id) : 0;
const later = (a, b) => !a ? b || null : !b ? a : (new Date(a) > new Date(b) ? a : b);
const nameOf = (p, e, id) => {
  p = p || {}; e = e || {};
  const email = e.email || "";
  return p.display_name || p.username || e.name || (email ? email.split("@")[0] : "") || "Student " + id.slice(0, 6);
};
function pctOf(l, id){
  if (!l) return 0;
  if (l.finished) return 100;
  const total = screenCount(id);
  return total ? Math.min(99, Math.round(Object.keys(l.done || {}).length / total * 100)) : 0;
}
function episodesOf(d){
  const lessons = (d && d.lessons) || {};
  return Object.keys(lessons).map(id => ({ id, pct: pctOf(lessons[id], id) }));
}
const epName = id => { const m = S.lessonMeta(id); return m ? m.cycle.emoji + " " + m.lesson.title : id; };
const epShort = id => { const m = S.lessonMeta(id); return m ? "Ep. " + m.cycle.n + "." + (m.cycle.lessons.indexOf(m.lesson) + 1) : id; };
const ago = t => {
  if (!t) return "";
  const days = Math.floor((Date.now() - new Date(t).getTime()) / 86400000);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : days + " days ago";
};
const dateStr = t => t ? new Date(t).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "—";
const wordStatus = s => s >= 5 ? "mastered" : s >= 3 ? "familiar" : s >= 1 ? "learning" : "new";
const WORD_LABEL = { new:"New", learning:"Learning", familiar:"Familiar", mastered:"Mastered" };

/* ---------- список учнів ---------- */
async function fetchRoster(){
  const sb = S.sb, me = S.user ? S.user.id : null;
  const [en, pr, pf] = await Promise.all([
    sb.from(TABLE).select("user_id, name, email, joined_at, last_seen").eq("course_id", CFG.COURSE_ID),
    sb.from(PROG).select("user_id, data, updated_at").eq("course_id", CFG.COURSE_ID),
    sb.from("profiles").select("id, username, display_name, role")
  ]);
  if (pr.error) throw pr.error;
  let setup = "";
  if (en.error){ setup = tableMissing(en.error) ? "missing" : "error"; console.warn("Signal: course list", en.error); }
  if (pf.error) console.warn("Signal: profiles", pf.error);

  const prof = {}; (pf.data || []).forEach(p => { prof[p.id] = p; });
  const isStaff = id => id === me || (prof[id] && prof[id].role === "teacher");
  const people = {};
  const get = id => people[id] || (people[id] = { id, enrolled:null, progress:null });
  (en.data || []).forEach(r => { if (!isStaff(r.user_id)) get(r.user_id).enrolled = r; });
  (pr.data || []).forEach(r => { if (!isStaff(r.user_id)) get(r.user_id).progress = r; });

  const list = Object.values(people).map(x => {
    const p = prof[x.id] || {}, e = x.enrolled || {}, row = x.progress;
    const d = row && row.data;
    return {
      id: x.id,
      name: nameOf(p, e, x.id),
      sub: p.username || e.email || "",
      seen: later(e.last_seen, row && row.updated_at),
      opened: !!x.enrolled,
      words: d && d.words ? Object.values(d.words).filter(w => w && w.added).length : 0,
      episodes: episodesOf(d)
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const others = (pf.data || [])
    .filter(p => !isStaff(p.id) && !people[p.id])
    .map(p => ({ id:p.id, name: p.display_name || p.username || p.id.slice(0, 8), sub: p.username || "" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { list, others, setup };
}

let cache = null;
const drawShell = (body, head) => S.shell("students", (head || `
  <div class="hello"><h1>Students</h1><p>Everyone who opens The Signal appears here automatically. Tap a student to see their progress.</p></div>`) + body);

async function renderList(force){
  if (!S.sb){ drawShell(`<div class="empty"><div class="big">🔒</div><h3>Sign in to see your students</h3><p class="muted">The list comes from Inkwell, so it isn't available in preview mode.</p></div>`); return; }
  if (!cache || force){
    drawShell(`<div class="empty"><div class="big">⏳</div><p class="muted">Loading the student list…</p></div>`);
    try { cache = await fetchRoster(); }
    catch(e){
      console.warn(e); cache = null;
      drawShell(`<div class="empty"><div class="big">🔒</div><h3>Could not load the students</h3><p class="muted">Check that <code>signal_progress</code> exists and that the teacher policies from signal_progress.sql are applied.</p><button class="btn" type="button" data-reload>Try again</button></div>`);
      $("#main").onclick = ev => { if (ev.target.closest("[data-reload]")) renderList(true); };
      return;
    }
  }
  const { list, others, setup } = cache;
  const setupNote = setup === "missing"
    ? `<div class="note amber" style="margin-bottom:14px">Automatic sign-up isn't switched on yet: run <code>sql/signal_students.sql</code> in Supabase. Until then the list shows only students who already have progress.</div>`
    : setup === "error" ? `<div class="note amber" style="margin-bottom:14px">The course list couldn't be read, so only students with progress are shown. Check the policies from <code>sql/signal_students.sql</code>.</div>` : "";
  const row = st => {
    const meta = [st.sub, st.seen ? "active " + ago(st.seen) : "", st.words ? st.words + " word" + (st.words === 1 ? "" : "s") : ""].filter(Boolean).map(esc).join(" · ");
    return `
      <a class="wrow" href="#/students/${esc(st.id)}" style="flex-wrap:wrap;gap:10px;color:inherit;text-decoration:none">
        <div class="wm" style="min-width:210px"><b>${esc(st.name)}</b><small>${meta || "&nbsp;"}</small></div>
        <div class="row" style="gap:6px;flex:1">${st.episodes.length ? st.episodes.map(e => `<span class="pill ${e.pct >= 100 ? "good" : "accent"}">${esc(epName(e.id))} ${e.pct}%</span>`).join("") : `<span class="muted">${st.opened ? "opened the course · no episodes yet" : "not started"}</span>`}</div>
        <span class="btn small" aria-hidden="true">Open →</span>
      </a>`;
  };
  const othersBlock = others.length ? `
    <details style="margin-top:22px"><summary class="muted" style="cursor:pointer;font-weight:700">Other Inkwell students · ${others.length} (haven't opened The Signal yet)</summary>
      <div class="wlist" style="margin-top:10px">${others.map(o => `<div class="wrow"><div class="wm"><b>${esc(o.name)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</div><span class="muted">not on the course yet</span></div>`).join("")}</div>
    </details>` : "";
  drawShell(setupNote + (list.length ? `
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="pill">${list.length} student${list.length === 1 ? "" : "s"} on the course</span>
      <button class="btn small" type="button" data-reload>↻ Refresh</button></div>
    <div class="wlist">${list.map(row).join("")}</div>`
  : `<div class="empty"><div class="big">🧑‍🏫</div><h3>No students on the course yet</h3><p class="muted">A student appears here as soon as they open The Signal from Inkwell.</p><button class="btn" type="button" data-reload>↻ Refresh</button></div>`) + othersBlock);
  $("#main").onclick = ev => { if (ev.target.closest("[data-reload]")) renderList(true); };
}

/* ---------- сторінка учня ---------- */
async function fetchStudent(id){
  const sb = S.sb;
  const [en, pr, pf] = await Promise.all([
    sb.from(TABLE).select("name, email, joined_at, last_seen").eq("course_id", CFG.COURSE_ID).eq("user_id", id).maybeSingle(),
    sb.from(PROG).select("data, updated_at").eq("course_id", CFG.COURSE_ID).eq("user_id", id).maybeSingle(),
    sb.from("profiles").select("username, display_name").eq("id", id).maybeSingle()
  ]);
  if (pr.error) throw pr.error;
  const e = en.error ? null : en.data, p = pf.error ? null : pf.data;
  return {
    id,
    name: nameOf(p, e, id),
    sub: (p && p.username) || (e && e.email) || "",
    email: e && e.email || "",
    joined: e && e.joined_at,
    seen: later(e && e.last_seen, pr.data && pr.data.updated_at),
    hasRow: !!pr.data,
    data: (pr.data && pr.data.data) || null
  };
}

/* скільки екранів у кожній частині уроку (для уроків із функцією screens) */
const totalsCache = {};
function stageTotals(les){
  if (totalsCache[les.id] !== undefined) return totalsCache[les.id];
  let tot = null;
  if (typeof les.screens === "function"){
    tot = {};
    try { les.screens(stage => { if (stage && stage.id) tot[stage.id] = (tot[stage.id] || 0) + 1; }, id => (les.stages || []).find(s => s.id === id)); }
    catch(e){ tot = null; }
  }
  return (totalsCache[les.id] = tot);
}
/* усі письмові відповіді учня з епізоду (рядки з двох і більше слів) */
function writtenAnswers(les, ans){
  const out = [];
  const walk = (v, list, depth) => {
    if (depth > 6 || v == null) return;
    if (typeof v === "string"){ const t = v.trim(); if (t.split(/\s+/).length >= 2 && !list.includes(t)) list.push(t); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, list, depth + 1));
    else if (typeof v === "object") Object.values(v).forEach(x => walk(x, list, depth + 1));
  };
  const stages = (les && les.stages) || [];
  Object.keys(ans || {}).forEach(sid => {
    const list = []; walk(ans[sid], list, 0);
    if (!list.length) return;
    const st = stages.find(s => s.id === sid);
    out.push({ title: st ? st.title : sid, n: st ? st.n : 99, items: list });
  });
  return out.sort((a, b) => a.n - b.n);
}
function calendar(days){
  const set = new Set(days || []);
  const key = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 34);
  start.setDate(start.getDate() - (start.getDay() + 6) % 7);   // понеділок — перший стовпчик
  const cells = [];
  for (const d = new Date(start); d <= today; d.setDate(d.getDate() + 1)){
    const k = key(d), on = set.has(k);
    cells.push(`<span title="${d.toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" })}${on ? " · active" : ""}" style="aspect-ratio:1;border-radius:6px;display:grid;place-items:center;font-size:.72rem;font-weight:700;background:${on ? "var(--good)" : "var(--surface-2)"};color:${on ? "#fff" : "var(--muted)"};${k === key(today) ? "box-shadow:inset 0 0 0 2px var(--accent)" : ""}">${d.getDate()}</span>`);
  }
  return `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;max-width:340px">
    ${["M","T","W","T","F","S","S"].map(x => `<span class="muted" style="text-align:center;font-size:.72rem;font-weight:800">${x}</span>`).join("")}
    ${cells.join("")}</div>`;
}
function streakOf(days){
  const set = new Set(days || []);
  const key = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const d = new Date(); if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0; while (set.has(key(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}

function episodeCard(st, m, l){
  const id = m.lesson.id;
  const les = LESSONS()[id];
  const total = screenCount(id);
  const done = l ? Object.keys(l.done || {}).length : 0;
  const pct = pctOf(l, id);
  const state = !l ? "Not started" : l.finished ? "Completed ✓" : pct + "%";
  const stateCls = !l ? "" : l.finished ? "good" : "accent";
  const doneByStage = {};
  Object.keys((l && l.done) || {}).forEach(k => { const s = k.split(":")[0]; doneByStage[s] = (doneByStage[s] || 0) + 1; });
  const tot = les ? stageTotals(les) : null;
  const stages = les && les.stages ? les.stages.slice().sort((a, b) => (a.n || 0) - (b.n || 0)).map(s => {
    const n = doneByStage[s.id] || 0, t = tot && tot[s.id];
    const full = (l && l.finished) || (t ? n >= t : false);
    const cls = full ? "good" : n ? "accent" : "";
    const tail = full ? " ✓" : n ? (t ? ` ${n}/${t}` : " …") : "";
    return `<span class="pill ${cls}" style="font-weight:700">${s.n ? s.n + ". " : ""}${esc(s.title || s.id)}${tail}</span>`;
  }).join("") : "";
  const answers = l ? writtenAnswers(les, l.ans) : [];
  const where = l && !l.finished && total ? `Now on screen ${Math.min(total, (l.pos || 0) + 1)} of ${total} · ${done} screen${done === 1 ? "" : "s"} done` : l && l.finished ? (l.teacherMarked ? "Marked as completed by the teacher" : total ? `All ${total} screens done` : "Completed") : "";
  const actions = [];
  if (l && l.finished) actions.push(`<button class="btn small" type="button" data-act="incomplete" data-lesson="${esc(id)}">Mark as not completed</button>`);
  else actions.push(`<button class="btn small primary" type="button" data-act="complete" data-lesson="${esc(id)}">Mark as completed</button>`);
  if (l) actions.push(`<button class="btn small ghost" type="button" data-act="clear-ep" data-lesson="${esc(id)}">Clear episode</button>`);
  return `
    <div class="card" style="margin-bottom:12px">
      <div class="row" style="justify-content:space-between;gap:8px">
        <div><div class="muted" style="font-weight:800;font-size:.85rem">${esc(epShort(id))} · ${esc(m.cycle.title)}</div><h3 style="font-size:1.15rem;margin:.15em 0 0">${esc(m.lesson.title)}</h3></div>
        <span class="pill ${stateCls}">${state}</span>
      </div>
      <div class="bar thin" style="margin:12px 0 6px"><i style="width:${pct}%"></i></div>
      ${where ? `<p class="muted" style="margin:0 0 10px;font-size:.9rem">${esc(where)}</p>` : ""}
      ${stages ? `<div class="row" style="gap:6px;margin-bottom:10px">${stages}</div>` : ""}
      ${answers.length ? `<details style="margin:4px 0 10px"><summary style="cursor:pointer;font-weight:700">✍️ Written answers (${answers.reduce((a, g) => a + g.items.length, 0)})</summary>
        ${answers.map(g => `<div style="margin-top:10px"><div class="muted" style="font-weight:800;font-size:.85rem">${esc(g.title)}</div><ul style="margin:.3em 0 0;padding-left:1.2em">${g.items.map(t => `<li style="margin:.2em 0">${esc(t)}</li>`).join("")}</ul></div>`).join("")}
      </details>` : ""}
      <div class="row" style="gap:6px">${actions.join("")}</div>
    </div>`;
}

let current = null;
async function renderStudent(id, force){
  if (!S.sb){ location.hash = "#/students"; return; }
  const head = `<a class="back-link" href="#/students">← All students</a>`;
  if (!current || current.id !== id || force){
    drawShell(`<div class="empty"><div class="big">⏳</div><p class="muted">Loading…</p></div>`, head);
    try { current = await fetchStudent(id); }
    catch(e){
      console.warn(e); current = null;
      drawShell(`<div class="empty"><div class="big">🔒</div><h3>Could not load this student</h3><button class="btn" type="button" data-reload>Try again</button></div>`, head);
      $("#main").onclick = ev => { if (ev.target.closest("[data-reload]")) renderStudent(id, true); };
      return;
    }
  }
  const st = current, d = st.data || {};
  const lessons = d.lessons || {};
  const words = Object.entries(d.words || {}).filter(([, w]) => w && w.added).map(([w, r]) => ({ w, st: wordStatus(r.s || 0), star: !!r.star }));
  const order = ["mastered", "familiar", "learning", "new"];
  words.sort((a, b) => order.indexOf(a.st) - order.indexOf(b.st) || a.w.localeCompare(b.w));
  const finished = Object.values(lessons).filter(l => l && l.finished).length;
  const mastered = words.filter(w => w.st === "mastered").length;
  const minutes = Math.round(((d.stats && d.stats.listenSec) || 0) / 60);
  const days = d.days || [];
  const eps = [];
  cycles().forEach(c => c.lessons.forEach(l => { if (l.content || lessons[l.id]) eps.push({ cycle:c, lesson:l }); }));

  drawShell(`
    <div class="hello"><h1>${esc(st.name)}</h1><p>${[st.sub, st.email && st.email !== st.sub ? st.email : ""].filter(Boolean).map(esc).join(" · ") || "&nbsp;"}</p></div>
    <div class="row" style="gap:6px;margin:-6px 0 16px">
      <span class="pill">Joined ${esc(dateStr(st.joined))}</span>
      <span class="pill">${st.seen ? "Active " + esc(ago(st.seen)) : "No activity yet"}</span>
      <span class="spacer"></span><button class="btn small" type="button" data-reload>↻ Refresh</button>
    </div>
    <div class="stats">
      <div class="stat"><b>🎬 ${finished}</b><span>episodes completed</span></div>
      <div class="stat"><b>💬 ${mastered}</b><span>words mastered · ${words.length} collected</span></div>
      <div class="stat"><b>🔥 ${streakOf(days)}</b><span>day streak · ${days.length} active day${days.length === 1 ? "" : "s"}</span></div>
      <div class="stat"><b>🎧 ${minutes}</b><span>minutes of listening</span></div>
    </div>
    <div class="section-title"><h2>Activity · last 5 weeks</h2></div>
    <div class="card">${calendar(days)}<p class="muted" style="margin:10px 0 0;font-size:.88rem">Green = the student worked in the course that day.</p></div>
    <div class="section-title"><h2>Episodes</h2></div>
    ${st.hasRow ? "" : `<div class="note info" style="margin-bottom:12px">No saved progress yet. It appears after the student completes their first screen.</div>`}
    ${eps.map(m => episodeCard(st, m, lessons[m.lesson.id])).join("")}
    <p class="muted" style="font-size:.88rem">Your changes reach the student the next time they open the course. If the course is open on their screen right now, ask them to reload the page first — otherwise their next step can overwrite your change.</p>
    <div class="section-title"><h2>My words</h2><span class="muted">${words.length}</span></div>
    ${words.length ? `<div class="row" style="gap:6px">${words.map(w => `<span class="pill" style="gap:6px">${w.star ? "⭐ " : ""}<b>${esc(w.w)}</b> <span class="status ${w.st}">${WORD_LABEL[w.st]}</span></span>`).join("")}</div>` : `<p class="muted">No words collected yet.</p>`}
    ${st.hasRow ? `<div class="section-title"><h2>Reset</h2></div>
      <div class="panel"><div class="row"><span class="muted" style="flex:1;min-width:220px">Removes all answers, episode progress and collected words for this student. The student stays in the list.</span>
        <button class="btn small ghost" type="button" data-act="clear-all">Clear everything</button></div></div>` : ""}`, head);

  $("#main").onclick = async ev => {
    if (ev.target.closest("[data-reload]")) return renderStudent(id, true);
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act, lid = btn.dataset.lesson;
    const needsConfirm = act === "clear-ep" || act === "clear-all";
    if (needsConfirm && !btn.dataset.confirm){
      btn.dataset.confirm = "1"; btn.dataset.label = btn.textContent;
      btn.textContent = "Tap again to confirm"; btn.classList.add("hot");
      setTimeout(() => { if (btn.dataset.confirm){ delete btn.dataset.confirm; btn.textContent = btn.dataset.label; btn.classList.remove("hot"); } }, 4000);
      return;
    }
    btn.disabled = true; btn.dataset.label = btn.dataset.label || btn.textContent; btn.textContent = "Saving…";
    try {
      if (act === "clear-all") await clearCourse(id);
      else await changeLesson(id, lid, act);
      toast({ complete:"Marked as completed", incomplete:"Marked as not completed", "clear-ep":"Episode cleared", "clear-all":"Course cleared" }[act]);
      cache = null;
      renderStudent(id, true);
    } catch(err){
      console.warn(err);
      btn.disabled = false; delete btn.dataset.confirm; btn.textContent = btn.dataset.label; btn.classList.remove("hot");
      toast(err && err.noRow ? "This student has no saved progress yet — ask them to open the course first" : "Could not save: check the teacher policies in signal_progress.sql");
    }
  };
}

/* ---------- зміни прогресу учня викладачем ---------- */
async function clearCourse(uid){
  const { error } = await S.sb.from(PROG).delete().eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (error) throw error;
}
async function changeLesson(uid, lessonId, act){
  const sb = S.sb;
  const { data, error } = await sb.from(PROG).select("data").eq("user_id", uid).eq("course_id", CFG.COURSE_ID).maybeSingle();
  if (error) throw error;
  if (!data){ if (act === "clear-ep") return; const e = new Error("no progress row"); e.noRow = true; throw e; }
  const next = data.data || {};
  next.lessons = next.lessons || {};
  if (act === "clear-ep") delete next.lessons[lessonId];
  else {
    const l = next.lessons[lessonId] = next.lessons[lessonId] || { pos:0, max:0, done:{}, ans:{}, finished:false };
    if (act === "complete"){
      l.finished = true; l.teacherMarked = true;
      const total = screenCount(lessonId);
      if (total) l.max = Math.max(l.max || 0, total - 1);     // усі частини епізоду відкриті для учня
    } else {
      l.finished = false; delete l.teacherMarked;
    }
  }
  next.updatedAt = Date.now();
  const { error: e2 } = await sb.from(PROG).update({ data: next, updated_at: new Date().toISOString() }).eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (e2) throw e2;
}

/* ---------- маршрут: #/students і #/students/<id> ---------- */
function renderStudents(force){
  if (!S.isTeacher()){ location.hash = "#/"; return; }
  const m = (location.hash || "").match(/^#\/students\/([\w-]+)/);
  window.scrollTo(0, 0);
  return m ? renderStudent(m[1], force) : renderList(force);
}
S.renderStudents = renderStudents;
})();
