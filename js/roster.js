/* ============================================================
   THE SIGNAL — учні курсу
   1) Учень, який відкрив курс, сам записується в таблицю signal_students.
   2) Вкладка Students (лише викладач) показує всіх, хто відкривав курс або має прогрес,
      навіть якщо профіль учня в Inkwell не має ролі "student".
   Таблиця й правила — sql/signal_students.sql. Підключається після player.js, перед auth.js.
   ============================================================ */
(function(){
"use strict";
const S = window.SIG, CFG = window.SIGNAL_CONFIG;
if (!S || !CFG) return;
const TABLE = CFG.STUDENTS_TABLE || "signal_students";
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

/* ---------- викладач: список учнів ---------- */
function episodesOf(d){
  const lessons = (d && d.lessons) || {};
  const count = window.SIGNAL_SCREEN_COUNT;
  return Object.keys(lessons).map(id => {
    const l = lessons[id] || {};
    const total = count ? count(id) : 0;
    return { id, pct: l.finished ? 100 : total ? Math.min(99, Math.round(Object.keys(l.done || {}).length / total * 100)) : 0 };
  });
}
const later = (a, b) => !a ? b || null : !b ? a : (new Date(a) > new Date(b) ? a : b);

async function fetchRoster(){
  const sb = S.sb, me = S.user ? S.user.id : null;
  const [en, pr, pf] = await Promise.all([
    sb.from(TABLE).select("user_id, name, email, joined_at, last_seen").eq("course_id", CFG.COURSE_ID),
    sb.from(CFG.PROGRESS_TABLE).select("user_id, data, updated_at").eq("course_id", CFG.COURSE_ID),
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
    const email = e.email || "";
    return {
      id: x.id,
      name: p.display_name || p.username || e.name || (email ? email.split("@")[0] : "") || "Student " + x.id.slice(0, 6),
      sub: p.username || email,
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

async function clearCourse(uid){
  const { error } = await S.sb.from(CFG.PROGRESS_TABLE).delete().eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (error) throw error;
}
async function clearEpisode(uid, lessonId){
  const sb = S.sb;
  const { data, error } = await sb.from(CFG.PROGRESS_TABLE).select("data").eq("user_id", uid).eq("course_id", CFG.COURSE_ID).maybeSingle();
  if (error) throw error;
  if (!data || !data.data || !data.data.lessons || !data.data.lessons[lessonId]) return;
  const next = data.data;
  delete next.lessons[lessonId];
  next.updatedAt = Date.now();
  const { error: e2 } = await sb.from(CFG.PROGRESS_TABLE).update({ data: next, updated_at: new Date().toISOString() }).eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (e2) throw e2;
}

let cache = null;
async function renderStudents(force){
  if (!S.isTeacher()){ location.hash = "#/"; return; }
  const draw = body => S.shell("students", `
    <div class="hello"><h1>Students</h1><p>Everyone who opens The Signal appears here automatically · you can clear an episode or the whole course for a student.</p></div>
    ${body}`);
  if (!S.sb){ draw(`<div class="empty"><div class="big">🔒</div><h3>Sign in to see your students</h3><p class="muted">The list comes from Inkwell, so it isn't available in preview mode.</p></div>`); return; }
  if (!cache || force){
    draw(`<div class="empty"><div class="big">⏳</div><p class="muted">Loading the student list…</p></div>`);
    try { cache = await fetchRoster(); }
    catch(e){
      console.warn(e); cache = null;
      draw(`<div class="empty"><div class="big">🔒</div><h3>Could not load the students</h3><p class="muted">Check that <code>signal_progress</code> exists and that the teacher policies from signal_progress.sql are applied.</p><button class="btn" type="button" data-reload>Try again</button></div>`);
      $("#main").onclick = ev => { if (ev.target.closest("[data-reload]")) renderStudents(true); };
      return;
    }
  }
  const { list, others, setup } = cache;
  const when = t => { if (!t) return ""; const days = Math.floor((Date.now() - new Date(t).getTime()) / 86400000); return days <= 0 ? "active today" : days === 1 ? "active yesterday" : "active " + days + " days ago"; };
  const epName = id => { const m = S.lessonMeta(id); return m ? m.cycle.emoji + " " + m.lesson.title : id; };
  const epShort = id => { const m = S.lessonMeta(id); return m ? "ep. " + m.cycle.n + "." + (m.cycle.lessons.indexOf(m.lesson) + 1) : id; };
  const setupNote = setup === "missing"
    ? `<div class="note amber" style="margin-bottom:14px">Automatic sign-up isn't switched on yet: run <code>sql/signal_students.sql</code> in Supabase. Until then the list shows only students who already have progress.</div>`
    : setup === "error" ? `<div class="note amber" style="margin-bottom:14px">The course list couldn't be read, so only students with progress are shown. Check the policies from <code>sql/signal_students.sql</code>.</div>` : "";
  const row = st => {
    const meta = [st.sub, when(st.seen), st.words ? st.words + " word" + (st.words === 1 ? "" : "s") : ""].filter(Boolean).map(esc).join(" · ");
    return `
      <div class="wrow" style="flex-wrap:wrap;gap:10px">
        <div class="wm" style="min-width:210px"><b>${esc(st.name)}</b><small>${meta || "&nbsp;"}</small></div>
        <div class="row" style="gap:6px;flex:1">${st.episodes.length ? st.episodes.map(e => `<span class="pill ${e.pct >= 100 ? "good" : "accent"}">${esc(epName(e.id))} ${e.pct}%</span>`).join("") : `<span class="muted">${st.opened ? "opened the course · no episodes yet" : "not started"}</span>`}</div>
        ${st.episodes.length ? `<div class="row" style="gap:6px">
          ${st.episodes.map(e => `<button class="btn small" type="button" data-clear-ep="${st.id}" data-lesson="${esc(e.id)}">Clear ${esc(epShort(e.id))}</button>`).join("")}
          <button class="btn small ghost" type="button" data-clear-all="${st.id}">Clear everything</button>
        </div>` : ""}
      </div>`;
  };
  const othersBlock = others.length ? `
    <details style="margin-top:22px"><summary class="muted" style="cursor:pointer;font-weight:700">Other Inkwell students · ${others.length} (haven't opened The Signal yet)</summary>
      <div class="wlist" style="margin-top:10px">${others.map(o => `<div class="wrow"><div class="wm"><b>${esc(o.name)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</div><span class="muted">not on the course yet</span></div>`).join("")}</div>
    </details>` : "";
  draw(setupNote + (list.length ? `
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="pill">${list.length} student${list.length === 1 ? "" : "s"} on the course</span>
      <button class="btn small" type="button" data-reload>↻ Refresh</button></div>
    <div class="wlist">${list.map(row).join("")}</div>
    <p class="muted" style="margin-top:12px">Clearing removes the student's answers and screen progress. Their collected words are part of the same record, so “Clear everything” also empties their word bank. The student stays in the list.</p>`
  : `<div class="empty"><div class="big">🧑‍🏫</div><h3>No students on the course yet</h3><p class="muted">A student appears here as soon as they open The Signal from Inkwell.</p><button class="btn" type="button" data-reload>↻ Refresh</button></div>`) + othersBlock);

  $("#main").onclick = async ev => {
    if (ev.target.closest("[data-reload]")) return renderStudents(true);
    const ep = ev.target.closest("[data-clear-ep]"), all = ev.target.closest("[data-clear-all]");
    const btn = ep || all;
    if (!btn) return;
    if (!btn.dataset.confirm){
      btn.dataset.confirm = "1"; btn.dataset.label = btn.textContent;
      btn.textContent = "Tap again to confirm"; btn.classList.add("hot");
      setTimeout(() => { if (btn.dataset.confirm){ delete btn.dataset.confirm; btn.textContent = btn.dataset.label; btn.classList.remove("hot"); } }, 4000);
      return;
    }
    btn.disabled = true; btn.textContent = "Clearing…";
    try {
      if (ep) await clearEpisode(ep.dataset.clearEp, ep.dataset.lesson);
      else await clearCourse(all.dataset.clearAll);
      toast(ep ? "Episode cleared" : "Course cleared");
      renderStudents(true);
    } catch(err){
      console.warn(err); btn.disabled = false; delete btn.dataset.confirm; btn.textContent = btn.dataset.label || "Try again"; btn.classList.remove("hot");
      toast("Could not clear: check the teacher policy in signal_progress.sql");
    }
  };
}
S.renderStudents = renderStudents;
})();
