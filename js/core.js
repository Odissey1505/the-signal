/* THE SIGNAL — ядро: стан, синхронізація, словник, головна, серіали, My words, Progress, Students */
(function(){
"use strict";
const CFG = window.SIGNAL_CONFIG, COURSE = window.SIGNAL_COURSE, LESSONS = window.SIGNAL_LESSONS, TYPES = window.SIGNAL_TYPES;

/* ---------- helpers ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const reduced = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
let cleanups = [];
const onCleanup = fn => cleanups.push(fn);
const runCleanups = () => { cleanups.forEach(f => { try { f(); } catch(e){} }); cleanups = []; };
function toast(msg){
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2300);
}
const cycles = () => COURSE.seasons.flatMap(s => s.cycles);
const cycleOf = n => cycles().find(c => c.n === +n);
const lessonMeta = id => { for (const c of cycles()) for (const l of c.lessons) if (l.id === id) return { cycle: c, lesson: l }; return null; };
const wordCount = t => String(t || "").trim().split(/\s+/).filter(Boolean).length;

/* ---------- state ---------- */
const fresh = () => ({ v:2, lessons:{}, words:{}, stats:{ listenSec:0 }, days:[], teacher:false, theme:null, name:"", updatedAt:0 });
let state = fresh();
let mode = "local", sb = null, user = null, pushTimer = null;
let role = "student", profile = null;        // role comes only from Inkwell's profiles table
const isTeacher = () => role === "teacher";
const teacherOn = () => isTeacher() && !!state.teacher;

function loadLocal(){
  try { const raw = localStorage.getItem(CFG.STORAGE_KEY); if (raw) state = Object.assign(fresh(), JSON.parse(raw)); } catch(e){}
}
function save(){
  state.updatedAt = Date.now();
  try { localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  if (sb && user){ clearTimeout(pushTimer); pushTimer = setTimeout(push, 1200); }
}
async function push(){
  try {
    const { error } = await sb.from(CFG.PROGRESS_TABLE).upsert(
      { user_id:user.id, course_id:CFG.COURSE_ID, data:state, updated_at:new Date().toISOString() },
      { onConflict:"user_id,course_id" });
    if (error) throw error;
  } catch(e){ console.warn("Signal sync", e); toast("Saved on this device. Cloud sync failed — check the connection."); }
}
async function pull(){
  try {
    const { data, error } = await sb.from(CFG.PROGRESS_TABLE).select("data").eq("user_id", user.id).eq("course_id", CFG.COURSE_ID).maybeSingle();
    if (error) throw error;
    if (data && data.data && (data.data.updatedAt || 0) > (state.updatedAt || 0)){
      state = Object.assign(fresh(), data.data);
      try { localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify(state)); } catch(e){}
    }
  } catch(e){ console.warn("Signal pull", e); }
}
async function loadRole(){
  role = "student"; profile = null;
  if (!sb || !user) return;
  try {
    const { data, error } = await sb.from("profiles").select("role, display_name, username").eq("id", user.id).maybeSingle();
    if (error) throw error;
    profile = data || null;
    role = data && data.role === "teacher" ? "teacher" : "student";
  } catch(e){ console.warn("Signal: role check failed, using student", e); }
}
function resetLesson(id){
  delete state.lessons[id];
  save();
}
async function fetchStudents(){
  if (!sb || !isTeacher()) return [];
  const { data: people, error: e1 } = await sb.from("profiles").select("id, username, display_name, role").eq("role", "student");
  if (e1) throw e1;
  const { data: rows, error: e2 } = await sb.from(CFG.PROGRESS_TABLE).select("user_id, data, updated_at").eq("course_id", CFG.COURSE_ID);
  if (e2) throw e2;
  const byId = {};
  (rows || []).forEach(r => { byId[r.user_id] = r; });
  return (people || []).map(p => {
    const row = byId[p.id];
    const d = (row && row.data) || null;
    const lessons = (d && d.lessons) || {};
    const words = d && d.words ? Object.values(d.words).filter(w => w.added).length : 0;
    return {
      id: p.id,
      name: p.display_name || p.username || p.id.slice(0, 8),
      username: p.username || "",
      updated: row ? row.updated_at : null,
      words,
      episodes: Object.keys(lessons).map(lid => ({
        id: lid,
        pct: lessons[lid].finished ? 100 : (window.SIGNAL_SCREEN_COUNT && window.SIGNAL_SCREEN_COUNT(lid) ? Math.min(99, Math.round(Object.keys(lessons[lid].done || {}).length / window.SIGNAL_SCREEN_COUNT(lid) * 100)) : 0)
      }))
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}
async function clearStudentCourse(uid){
  const { error } = await sb.from(CFG.PROGRESS_TABLE).delete().eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (error) throw error;
}
async function clearStudentEpisode(uid, lessonId){
  const { data, error } = await sb.from(CFG.PROGRESS_TABLE).select("data").eq("user_id", uid).eq("course_id", CFG.COURSE_ID).maybeSingle();
  if (error) throw error;
  if (!data || !data.data || !data.data.lessons || !data.data.lessons[lessonId]) return false;
  const next = data.data;
  delete next.lessons[lessonId];
  next.updatedAt = Date.now();
  const { error: e2 } = await sb.from(CFG.PROGRESS_TABLE).update({ data: next, updated_at: new Date().toISOString() }).eq("user_id", uid).eq("course_id", CFG.COURSE_ID);
  if (e2) throw e2;
  return true;
}
function L(id){
  if (!state.lessons[id]) state.lessons[id] = { pos:0, max:0, done:{}, ans:{}, finished:false };
  return state.lessons[id];
}

/* ---------- activity & streak ---------- */
const dayKey = d => { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
function markActive(){
  const k = dayKey();
  if (!state.days.includes(k)){ state.days.push(k); state.days = state.days.slice(-90); }
}
function streak(){
  const set = new Set(state.days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))){ n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- words ---------- */
function allVocab(){
  const out = [];
  Object.values(LESSONS).forEach(l => l.vocab.forEach(v => out.push(Object.assign({ lesson:l.id, cycle:l.cycle }, v))));
  return out;
}
const vocab = w => allVocab().find(v => v.w === w);
function W(w){ if (!state.words[w]) state.words[w] = { s:0, added:false, star:false, seen:0 }; return state.words[w]; }
function addWord(w){ const r = W(w); if (!r.added){ r.added = true; r.at = Date.now(); save(); } }
function wordResult(w, ok){ if (!vocab(w)) return; const r = W(w); r.s = ok ? r.s + 1 : Math.max(0, r.s - 1); r.seen++; save(); }
function status(w){ const r = state.words[w]; const s = r ? r.s : 0; return s >= 5 ? "mastered" : s >= 3 ? "familiar" : s >= 1 ? "learning" : "new"; }
const STATUS_LABEL = { new:"New", learning:"Learning", familiar:"Familiar", mastered:"Mastered" };
const myWords = () => allVocab().filter(v => state.words[v.w] && state.words[v.w].added);

/* ---------- lesson progress ---------- */
function lessonPct(id){
  const st = state.lessons[id]; if (!st) return 0;
  if (st.finished) return 100;
  const total = window.SIGNAL_SCREEN_COUNT ? window.SIGNAL_SCREEN_COUNT(id) : 0;
  return total ? Math.min(99, Math.round(Object.keys(st.done).length / total * 100)) : 0;
}
function stats(){
  const finished = Object.entries(state.lessons).filter(([, v]) => v.finished);
  return {
    lessons: finished.length,
    mastered: myWords().filter(v => status(v.w) === "mastered").length,
    words: myWords().length,
    missions: finished.filter(([id]) => { const m = lessonMeta(id); return m && m.lesson.type === "C"; }).length,
    minutes: Math.round((state.stats.listenSec || 0) / 60)
  };
}
function displayName(){
  if (profile && (profile.display_name || profile.username)) return String(profile.display_name || profile.username).split(" ")[0];
  if (user){
    const m = user.user_metadata || {};
    const n = m.full_name || m.name || m.first_name || (user.email || "").split("@")[0];
    if (n) return String(n).split(" ")[0];
  }
  return state.name || "";
}

/* ---------- theme ---------- */
function applyTheme(){ const r = document.documentElement; if (state.theme) r.setAttribute("data-theme", state.theme); else r.removeAttribute("data-theme"); }
const isDark = () => state.theme ? state.theme === "dark" : !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
function toggleTheme(){ state.theme = isDark() ? "light" : "dark"; applyTheme(); save(); }

/* ---------- speech ---------- */
const TTS = {
  ok: "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined",
  voices: [],
  load(){ if (this.ok) this.voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); },
  pick(cfg){
    if (!this.voices.length) this.load();
    const lang = (cfg.lang || "en").toLowerCase();
    const pool = this.voices.filter(v => v.lang.replace("_", "-").toLowerCase().startsWith(lang));
    const list = pool.length ? pool : this.voices;
    for (const h of (cfg.hint || [])){ const f = list.find(v => v.name.toLowerCase().includes(h)); if (f) return f; }
    return list[0] || null;
  },
  clean: t => String(t).replace(/\([^)]*\)/g, " ").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim(),
  speak(text, cfg, onend){
    if (!this.ok){ if (onend) onend(); return; }
    cfg = cfg || { lang:"en-GB" };
    const u = new SpeechSynthesisUtterance(this.clean(text));
    const v = this.pick(cfg); if (v) u.voice = v;
    u.lang = (v && v.lang) || cfg.lang || "en-GB";
    u.pitch = cfg.pitch || 1; u.rate = (cfg.rate || 1) * (cfg.speed || 1);
    const t0 = Date.now();
    const done = () => { state.stats.listenSec = (state.stats.listenSec || 0) + Math.min(60, (Date.now() - t0) / 1000); if (onend) onend(); };
    u.onend = done; u.onerror = done;
    speechSynthesis.speak(u);
  },
  say(text){ if (!this.ok){ toast("This browser can't read aloud."); return; } this.stop(); this.speak(text, { lang:"en-GB", rate:.95 }); },
  stop(){ if (this.ok) speechSynthesis.cancel(); }
};
if (TTS.ok){ TTS.load(); speechSynthesis.onvoiceschanged = () => TTS.load(); }
const sayBtn = (text, label, withText) => `<button class="say" type="button" data-say="${esc(text)}" aria-label="${esc(label || "Listen")}">🔊${withText ? " " + esc(withText) : ""}</button>`;

/* ---------- avatars ---------- */
const HAIR = { dark:"#2B2130", fair:"#E0BC68" };
function hairBack(shape, c){
  if (shape === "straight-long") return `<path d="M54 92 Q54 38 100 38 Q146 38 146 92 L152 176 L48 176 Z" fill="${c}"/>`;
  if (shape === "straight-bob") return `<path d="M55 92 Q55 38 100 38 Q145 38 145 92 L148 132 L52 132 Z" fill="${c}"/>`;
  return "";
}
function hairFront(shape, c){
  const dots = p => p.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="${q[2]}" fill="${c}"/>`).join("");
  switch (shape){
    case "straight-long": return `<path d="M58 90 Q60 46 100 46 Q140 46 142 90 Q124 64 100 68 Q76 64 58 90Z" fill="${c}"/>`;
    case "straight-bob": return `<path d="M58 82 Q60 44 100 44 Q140 44 142 82 L142 86 L58 86 Z" fill="${c}"/>`;
    case "curly-short": return dots([[66,72,12],[76,58,13],[92,50,13],[108,50,13],[124,58,13],[134,72,12],[84,62,10],[116,62,10]]);
    case "curly-messy": return dots([[58,84,13],[62,66,14],[74,52,15],[92,44,15],[110,44,15],[127,52,15],[138,66,14],[142,84,13],[100,58,12],[80,64,10],[120,64,10]]);
    case "short": return `<path d="M60 84 Q60 46 100 46 Q140 46 140 84 Q122 62 100 64 Q78 62 60 84Z" fill="${c}"/>`;
  }
  return "";
}
function avatar(look, o){
  o = o || {};
  const c = HAIR[look.colour] || look.colour || "#333";
  const skin = o.faceless ? "var(--surface-3)" : (look.skin || "#E8C4A8");
  const ink = "#1B2140";
  let face = "";
  if (!o.faceless){
    const eyes = look.mood === "asleep"
      ? `<path d="M78 96 q6 5 12 0 M110 96 q6 5 12 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<circle cx="84" cy="95" r="4.2" fill="${ink}"/><circle cx="116" cy="95" r="4.2" fill="${ink}"/>`;
    const mood = o.mood || look.mood;
    const mouth = mood === "grin" ? `<path d="M80 112 Q100 134 120 112 Z" fill="${ink}"/><path d="M84 114 Q100 120 116 114" stroke="#fff" stroke-width="3" fill="none"/>`
      : mood === "smile" ? `<path d="M86 112 Q100 124 114 112" stroke="${ink}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      : look.mood === "asleep" ? `<ellipse cx="100" cy="116" rx="6" ry="4" fill="${ink}"/>`
      : `<path d="M88 116 H112" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
    let extra = "";
    if (look.extra === "sunglasses") extra = `<rect x="70" y="86" width="26" height="17" rx="7" fill="${ink}"/><rect x="104" y="86" width="26" height="17" rx="7" fill="${ink}"/><path d="M96 93 H104" stroke="${ink}" stroke-width="3"/>`;
    if (look.extra === "glasses") extra = `<circle cx="84" cy="95" r="12" stroke="${ink}" stroke-width="3" fill="none"/><circle cx="116" cy="95" r="12" stroke="${ink}" stroke-width="3" fill="none"/><path d="M96 95 H104" stroke="${ink}" stroke-width="3"/>`;
    const zz = look.mood === "asleep" ? `<text x="136" y="62" font-size="20" font-weight="800" fill="#5B4BFF" font-family="sans-serif">z z</text>` : "";
    face = eyes + mouth + extra + zz;
  }
  const phones = look.extra === "headphones" && !o.faceless ? `<path d="M52 96 Q52 30 100 30 Q148 30 148 96" stroke="#11131F" stroke-width="7" fill="none"/><rect x="42" y="84" width="18" height="30" rx="8" fill="#11131F"/><rect x="140" y="84" width="18" height="30" rx="8" fill="#11131F"/>` : "";
  const hood = look.extra === "hoodie" && !o.faceless ? `<path d="M56 150 Q100 128 144 150 L150 176 L50 176 Z" fill="${look.top}" opacity=".7"/>` : "";
  const body = o.faceless ? "" : `<path d="M34 200 Q38 150 100 146 Q162 150 166 200 Z" fill="${look.top || "#667"}"/>${hood}<rect x="90" y="124" width="20" height="24" fill="${skin}"/>`;
  const prop = look.prop && !o.faceless && !o.noProp ? `<text x="150" y="190" font-size="36">${look.prop}</text>` : "";
  const bg = o.bg ? `<rect width="200" height="200" fill="${o.bg}"/>` : "";
  return `<svg class="avatar" viewBox="0 0 200 200" role="img" aria-label="${esc(o.label || "Portrait")}"${o.size ? ` width="${o.size}" height="${o.size}"` : ""}>${bg}${hairBack(look.hair, c)}${body}<circle cx="100" cy="94" r="42" fill="${skin}"/>${hairFront(look.hair, c)}${face}${phones}${prop}</svg>`;
}
function photo(c, o){
  o = o || {};
  if (c.img) return `<img class="photo-img" src="${c.img}" alt="${esc(o.label || c.photo || c.name)}" decoding="async">`;
  return avatar(c.look, o);
}
function face(c, o){
  o = o || {};
  if (!c.img) return avatar(c.look, Object.assign({ noProp:true }, o));
  const f = c.face || { x:50, y:38 };
  const z = o.zoom || 1.5;
  return `<span class="face ${o.cls || ""}"><img src="${c.img}" alt="${esc(o.label || "")}" decoding="async" style="object-position:${f.x}% ${f.y}%;transform-origin:${f.x}% ${f.y}%;transform:scale(${z})"></span>`;
}
const crew = () => { const l = LESSONS.c1a; return l ? l.order.map(id => Object.assign({ id }, l.characters[id])) : []; };

function cover(c, o){
  o = o || {};
  if (o.big && c.banner){
    const alt = esc(c.bannerAlt || c.title + " — " + c.tagline);
    return `<div class="cover has-img has-banner ${o.cls || ""}" style="--c1:${c.color}"><picture>${c.image ? `<source media="(max-width: 640px)" srcset="${c.image}">` : ""}<img src="${c.banner}" alt="${alt}" decoding="async"></picture></div>`;
  }
  if (c.image){
    return `<div class="cover has-img ${o.cls || ""}" style="--c1:${c.color}"><img src="${c.image}" alt="${esc(c.imageAlt || c.title + " — " + c.tagline)}" loading="lazy" decoding="async"></div>`;
  }
  const hasCast = c.lessons.some(l => l.content) && crew().length;
  const cast = hasCast ? `<div class="cast">${crew().slice(0, o.big ? 5 : 3).map(p => avatar(p.look, { noProp:true, mood: p.id === "zoe" ? "flat" : "smile", label: p.name })).join("")}</div>` : `<div class="cemoji" aria-hidden="true">${c.emoji}</div>`;
  return `<div class="cover ${o.cls || ""}" style="--c1:${c.color}">${cast}<div class="ctext"><b>${c.emoji} ${esc(c.title)}</b><span>${esc(c.tagline)}</span></div></div>`;
}

/* ============================================================
   APP SHELL (Course · My words · Progress)
   ============================================================ */
const brand = `<a class="brand" href="#/"><span class="brand-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 64 64"><circle cx="32" cy="32" r="7" fill="#fff"/><path d="M18 18a20 20 0 0 0 0 28M46 18a20 20 0 0 1 0 28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg></span>The Signal</a>`;
function shell(tab, inner){
  const nm = displayName();
  const tabs = [["course","#/","Course","🎬"],["words","#/words","My words","📚"],["progress","#/progress","Progress","📈"]];
  if (isTeacher()) tabs.push(["students","#/students","Students","🧑‍🏫"]);
  runCleanups();
  document.body.classList.remove("story"); delete document.body.dataset.episodeTheme;
  $("#app").innerHTML = `
    <header class="nav"><div class="wrap">
      ${brand}
      <nav class="tabs" aria-label="Main">${tabs.map(t => `<a class="tab ${tab === t[0] ? "on" : ""}" href="${t[1]}" ${tab === t[0] ? 'aria-current="page"' : ""}>${t[2]}</a>`).join("")}</nav>
      <span class="spacer"></span>
      <span class="pill amber" title="Days in a row">🔥 ${streak()}<span class="hide-sm">&nbsp;day streak</span></span>
      <button class="me" type="button" data-menu aria-haspopup="true" aria-expanded="false"><span class="ava">${nm ? esc(nm[0].toUpperCase()) : "👤"}</span><span class="nm">${esc(nm || "Me")}</span></button>
    </div></header>
    <div id="menu" class="menu" hidden role="menu"></div>
    <main id="main" class="wrap page">${inner}</main>
    <nav class="bottom-nav" aria-label="Main">${tabs.map(t => `<a class="${tab === t[0] ? "on" : ""}" href="${t[1]}"><span aria-hidden="true">${t[3]}</span>${t[2]}</a>`).join("")}</nav>`;
}
function menuHTML(){
  const syncLine = mode === "cloud" ? "☁︎ Synced with Inkwell" : mode === "preview" ? "Preview mode — progress stays on this device" : "Progress is saved on this device";
  return `
    ${isTeacher() ? `<button type="button" role="menuitemcheckbox" aria-checked="${teacherOn()}" data-toggle="teacher">🧑‍🏫 Teacher view <span class="switch ${teacherOn() ? "on" : ""}"></span></button>` : ""}
    <button type="button" role="menuitemcheckbox" aria-checked="${isDark()}" data-toggle="theme">🌙 Dark theme <span class="switch ${isDark() ? "on" : ""}"></span></button>
    <hr>
    <a role="menuitem" href="#/progress">⚙️ Settings and progress</a>
    <a role="menuitem" href="${esc(CFG.INKWELL_URL)}">↩ Back to Inkwell</a>
    <hr>
    <div class="muted" style="padding:.4em .8em;font-size:.84rem">${syncLine}</div>`;
}
document.addEventListener("click", e => {
  const say = e.target.closest("[data-say]");
  if (say){ e.preventDefault(); TTS.say(say.dataset.say); return; }
  const m = e.target.closest("[data-menu]");
  const menu = $("#menu");
  if (m && menu){
    const open = menu.hidden; menu.innerHTML = menuHTML(); menu.hidden = !open; m.setAttribute("aria-expanded", open); return;
  }
  const tg = e.target.closest("[data-toggle]");
  if (tg){
    if (tg.dataset.toggle === "teacher"){
      if (!isTeacher()) return;
      state.teacher = !state.teacher; save();
      toast(state.teacher ? "Teacher view: notes, answers and free navigation" : "Student view: you see the lesson as a student");
    }
    if (tg.dataset.toggle === "theme") toggleTheme();
    window.SignalRender(); return;
  }
  if (menu && !menu.hidden && !e.target.closest("#menu")) menu.hidden = true;
});
document.addEventListener("keydown", e => { if (e.key === "Escape"){ const m = $("#menu"); if (m) m.hidden = true; } });

/* ---------- HOME ---------- */
function nextLesson(){
  for (const c of cycles()) for (const l of c.lessons) if (l.content && !(state.lessons[l.id] && state.lessons[l.id].finished)) return { c, l };
  for (const c of cycles().slice().reverse()) for (const l of c.lessons) if (l.content) return { c, l, replay:true };
  return null;
}
function epDots(c){
  return `<div class="dots" aria-hidden="true">${c.lessons.map((l, i) => {
    const p = l.content ? lessonPct(l.id) : 0;
    return (i ? `<em class="${p > 0 ? "on" : ""}"></em>` : "") + `<i class="${p >= 100 ? "on" : p > 0 ? "half" : ""}"></i>`;
  }).join("")}</div>`;
}
function cycleState(c){
  const open = c.lessons.filter(l => l.content);
  if (!open.length) return { t:"🔒 Soon", cls:"" };
  const pcts = c.lessons.map(l => l.content ? lessonPct(l.id) : 0);
  const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / c.lessons.length);
  if (avg >= 100) return { t:"Complete ✓", cls:"done" };
  return { t: avg ? avg + "%" : "New", cls:"" };
}
function renderHome(){
  const nx = nextLesson();
  const st = stats();
  const nm = displayName();
  const anyProgress = Object.keys(state.lessons).length > 0;
  let cont = "";
  if (nx){
    const p = lessonPct(nx.l.id);
    const verb = nx.replay ? "Watch again" : p ? "Continue" : "Start episode";
    const epn = nx.c.lessons.indexOf(nx.l) + 1;
    cont = `
      <div class="section-title" style="margin-top:6px"><h2>${p ? "Continue your story" : "Start your story"}</h2></div>
      <article class="continue">
        ${cover(nx.c)}
        <div class="cbody">
          <div class="series">${nx.c.emoji} ${esc(nx.c.title)}</div>
          <h2>Episode ${epn} · ${esc(nx.l.title)}</h2>
          <div class="row">${nx.l.tags.map(t => `<span class="pill">${t === "Listening" ? "🎧" : t === "Reading" ? "📖" : t === "Grammar" ? "🧩" : t === "Final Mission" ? "🔥" : "📚"} ${esc(t)}</span>`).join("")}</div>
          <div class="row" style="flex-wrap:nowrap"><div class="bar" style="flex:1"><i style="width:${p}%"></i></div><b>${p}%</b></div>
          <div class="row"><a class="btn primary big" href="#/episode/${nx.l.id}">${verb} →</a><a class="btn link" href="#/series/${nx.c.n}">About the series</a></div>
        </div>
      </article>`;
  }
  const journey = COURSE.seasons.map(s => `
    <div class="season-label"><h3>Season ${s.n}: ${esc(s.title)}</h3><span>${esc(s.blurb)}</span></div>
    <div class="journey">${s.cycles.map(c => { const cs = cycleState(c); const open = c.lessons.some(l => l.content); return `
      <a class="jcard ${open ? "" : "locked"}" href="#/series/${c.n}">
        <span class="jthumb" style="--c1:${c.color}">${c.emoji}</span>
        <span class="jt"><b>${String(c.n).padStart(2, "0")} ${esc(c.title)}</b><small>${esc(c.tagline)}</small>${epDots(c)}</span>
        <span class="jstate ${cs.cls}">${cs.t}</span>
      </a>`; }).join("")}</div>`).join("");
  shell("course", `
    <div class="hello">
      <h1>👋 ${anyProgress ? "Welcome back" : "Welcome"}${nm ? ", " + esc(nm) : ""}!</h1>
      <p>${anyProgress ? "Your story is waiting." : "Five teenagers. One podcast. Every episode is a story you finish in English."}</p>
    </div>
    ${cont}
    <div class="stats">
      <div class="stat"><b>🎬 ${st.lessons}</b><span>episodes completed</span></div>
      <div class="stat"><b>💬 ${st.mastered}</b><span>words mastered</span></div>
      <div class="stat"><b>🏆 ${st.missions}</b><span>final missions</span></div>
      <div class="stat"><b>🎧 ${st.minutes}</b><span>minutes of listening</span></div>
    </div>
    <div class="section-title"><h2>Your journey</h2><span class="muted">20 stories · 60 episodes</span></div>
    ${journey}`);
}

/* ---------- SERIES ---------- */
function renderSeries(n){
  const c = cycleOf(n);
  if (!c){ location.hash = "#/"; return; }
  const icons = { A:"👀", B:"💬", C:"🔥" };
  const eps = c.lessons.map((l, i) => {
    const p = l.content ? lessonPct(l.id) : 0;
    const tags = l.tags.map(t => `<span class="pill">${t === "Listening" ? "🎧" : t === "Reading" ? "📖" : t === "Grammar" ? "🧩" : t === "Final Mission" ? "🔥" : "📚"} ${esc(t)}</span>`).join("");
    const foot = l.content
      ? `<div class="bar thin" style="flex:1"><i style="width:${p}%"></i></div><span class="btn primary small">${p >= 100 ? "Watch again" : p ? "Continue" : "Start"} →</span>`
      : `<span class="muted">🔒 In production</span>`;
    const inner = `<span class="epn">${icons[l.type]} Episode ${i + 1} · ${TYPES[l.type]}</span>
      <h3>${esc(l.title)}</h3><div class="tags">${tags}</div>
      ${l.type === "C" ? `<p style="margin:0;opacity:.85">Use everything from the series to finish the story.</p>` : ""}
      <div class="foot">${foot}</div>`;
    return l.content
      ? `<a class="ep open ${l.type === "C" ? "final" : ""}" href="#/episode/${l.id}">${inner}</a>`
      : `<div class="ep locked ${l.type === "C" ? "final" : ""}">${inner}</div>`;
  }).join("");
  const open = c.lessons.some(l => l.content);
  shell("course", `
    <a class="back-link" href="#/">← All series</a>
    ${cover(c, { big:true, cls:"series-hero" })}
    <div class="section-title"><h2>${esc(c.blurb)}</h2></div>
    <div class="row" style="margin:-4px 0 18px"><span class="pill accent">🧩 ${esc(c.grammar)}</span><span class="pill">📘 ${esc(c.unit)}</span></div>
    <div class="episodes">${eps}</div>
    ${open ? `<div class="section-title"><h2>The crew</h2></div>
      <div class="cast-row">${crew().map(p => `<figure>${face(p, { label:p.name, zoom:1.7 })}<figcaption>${esc(p.name)}<small>${p.age} · ${esc(p.from)}</small></figcaption></figure>`).join("")}</div>`
      : `<div class="empty" style="margin-top:20px"><div class="big">🎬</div><h3>This series is in production</h3><p class="muted">The episodes will appear here as soon as they're ready.</p></div>`}`);
}

/* ---------- MY WORDS ---------- */
let wordFilter = "all";
function renderWords(){
  const mine = myWords();
  const started = Object.keys(state.lessons);
  const suggest = allVocab().filter(v => started.includes(v.lesson) && !(state.words[v.w] && state.words[v.w].added));
  const pass = v => wordFilter === "all" ? true : wordFilter === "star" ? state.words[v.w].star : status(v.w) === wordFilter;
  const list = mine.filter(pass);
  const groups = [["personality","Personality"],["hair","Appearance"]];
  const counts = { all:mine.length, new:0, learning:0, familiar:0, mastered:0, star:mine.filter(v => state.words[v.w].star).length };
  mine.forEach(v => counts[status(v.w)]++);
  const row = v => `<div class="wrow">
      <div class="wm"><b>${esc(v.w)}</b> <span class="muted">${esc(v.ipa || "")}</span><small>🇺🇦 ${esc(v.ua)} · ${esc(v.en)}</small></div>
      <span class="status ${status(v.w)}">${STATUS_LABEL[status(v.w)]}</span>
      ${sayBtn(v.w + ". " + v.ex, "Listen: " + v.w)}
      <button class="star ${state.words[v.w].star ? "on" : ""}" type="button" data-star="${v.w}" aria-pressed="${state.words[v.w].star}" aria-label="Star ${esc(v.w)}">⭐</button>
    </div>`;
  shell("words", `
    <div class="hello row" style="justify-content:space-between">
      <div><h1>My words</h1><p>${mine.length} word${mine.length === 1 ? "" : "s"} collected · ${counts.mastered} mastered</p></div>
      <a class="btn primary big ${mine.length ? "" : "disabled"}" href="#/practice" ${mine.length ? "" : 'aria-disabled="true" tabindex="-1" style="opacity:.4;pointer-events:none"'}>Practise my words</a>
    </div>
    <p class="muted" style="margin-top:-6px">New → Learning → Familiar → Mastered. Every right answer moves a word forward; practice brings back the weakest words first.</p>
    ${mine.length ? `
      <div class="filter">${[["all","All"],["new","New"],["learning","Learning"],["familiar","Familiar"],["mastered","Mastered"],["star","⭐ Starred"]].map(f => `<button class="chip sm ${wordFilter === f[0] ? "on" : ""}" type="button" data-filter="${f[0]}">${f[1]} ${counts[f[0]]}</button>`).join("")}</div>
      ${groups.map(g => { const items = list.filter(v => v.g === g[0]); return items.length ? `<div class="section-title" style="margin-top:18px"><h2>${g[1]}</h2></div><div class="wlist">${items.map(row).join("")}</div>` : ""; }).join("") || `<div class="empty"><p class="muted">No words with this status yet.</p></div>`}`
    : `<div class="empty"><div class="big">📚</div><h3>Your word bank is empty</h3><p class="muted">In an episode, tap “+ My words” on a word card to collect it.</p><a class="btn primary" href="#/">Go to the course</a></div>`}
    ${suggest.length ? `<div class="section-title"><h2>From your episodes</h2><button class="btn small" type="button" data-addall>+ Add all ${suggest.length}</button></div>
      <div class="wlist">${suggest.map(v => `<div class="wrow"><div class="wm"><b>${esc(v.w)}</b><small>🇺🇦 ${esc(v.ua)}</small></div>${sayBtn(v.w)}<button class="btn small" type="button" data-add="${v.w}">+ Add</button></div>`).join("")}</div>` : ""}`);
  $("#main").onclick = e => {
    const f = e.target.closest("[data-filter]"); if (f){ wordFilter = f.dataset.filter; renderWords(); return; }
    const s = e.target.closest("[data-star]"); if (s){ const r = W(s.dataset.star); r.star = !r.star; save(); renderWords(); return; }
    const a = e.target.closest("[data-add]"); if (a){ addWord(a.dataset.add); renderWords(); toast("Added to My words"); return; }
    if (e.target.closest("[data-addall]")){ suggest.forEach(v => addWord(v.w)); renderWords(); toast(suggest.length + " words added"); }
  };
}

/* ---------- PRACTICE ---------- */
function buildPractice(){
  const pool = myWords().slice().sort((a, b) => {
    const sa = state.words[a.w], sb2 = state.words[b.w];
    return (sb2.star - sa.star) || (sa.s - sb2.s) || (Math.random() - .5);
  });
  const qs = pool.slice(0, 8);
  const all = allVocab();
  return qs.map((v, i) => {
    const same = all.filter(x => x.g === v.g && x.w !== v.w).sort(() => Math.random() - .5).slice(0, 3).map(x => x.w);
    const opts = same.concat(v.w).sort(() => Math.random() - .5);
    const kind = i % 3;
    const re = new RegExp("\\b" + v.w + "\\b", "i");
    const prompt = kind === 0 ? `Which word means: <b>${esc(v.en)}</b>?`
      : kind === 1 ? `How do you say <b>🇺🇦 ${esc(v.ua)}</b> in English?`
      : re.test(v.ex) ? `Complete: <b>${esc(v.ex).replace(re, "_____")}</b>` : `Which word means: <b>${esc(v.en)}</b>?`;
    return { w:v.w, opts, prompt };
  });
}
let practice = null;
function renderPractice(){
  if (!myWords().length){ location.hash = "#/words"; return; }
  if (!practice || practice.done) practice = { qs: buildPractice(), i:0, score:0, pick:null, checked:false, before:{} };
  runCleanups();
  document.body.classList.remove("story"); delete document.body.dataset.episodeTheme;
  const P = practice;
  if (P.i === 0 && !Object.keys(P.before).length) P.qs.forEach(q => P.before[q.w] = status(q.w));
  const total = P.qs.length;
  if (P.i >= total){
    const moved = P.qs.filter(q => P.before[q.w] !== status(q.w));
    $("#app").innerHTML = `
      <header class="player-top"><div class="wrap"><a class="icon-btn" href="#/words" aria-label="Close">✕</a><span class="ptitle">Practise my words</span><div class="segs"><div class="seg"><i style="width:100%"></i></div></div></div></header>
      <main class="stage" id="main"><div class="screen finish-hero"><div class="big">💪</div><h1>${P.score} / ${total}</h1><p class="muted">${moved.length ? moved.length + " word" + (moved.length === 1 ? "" : "s") + " changed status." : "Keep practising to move words forward."}</p></div>
        ${moved.length ? `<div class="wlist">${moved.map(q => `<div class="wrow"><div class="wm"><b>${esc(q.w)}</b></div><span class="status ${P.before[q.w]}">${STATUS_LABEL[P.before[q.w]]}</span>→<span class="status ${status(q.w)}">${STATUS_LABEL[status(q.w)]}</span></div>`).join("")}</div>` : ""}
      </main>
      <div class="dock"><div class="inner"><a class="btn link" href="#/words">Back to My words</a><span class="spacer"></span><button class="btn primary big main-cta" type="button" data-again>Practise again</button></div></div>`;
    $("[data-again]").onclick = () => { practice = null; renderPractice(); };
    P.done = true;
    return;
  }
  const q = P.qs[P.i];
  const v = vocab(q.w);
  $("#app").innerHTML = `
    <header class="player-top"><div class="wrap"><a class="icon-btn" href="#/words" aria-label="Close">✕</a><span class="ptitle">Practise my words</span>
      <div class="segs"><div class="seg"><i style="width:${Math.round(P.i / total * 100)}%"></i></div></div><span class="timeleft">${P.i + 1} / ${total}</span></div></header>
    <main class="stage" id="main"><div class="screen">
      <div class="kicker"><span class="status ${status(q.w)}">${STATUS_LABEL[status(q.w)]}</span></div>
      <p class="q-big" id="stitle" tabindex="-1">${q.prompt}</p>
      <div class="options">${q.opts.map(o => { let cls = ""; if (P.checked){ if (o === q.w) cls = "good"; else if (o === P.pick) cls = "bad"; } else if (o === P.pick) cls = "sel"; return `<button class="opt ${cls}" type="button" data-o="${o}" ${P.checked ? "disabled" : ""}>${o}</button>`; }).join("")}</div>
      ${P.checked ? wordCardHTML(v, { mini:true }) : ""}
    </div></main>
    <div class="dock"><div class="inner"><a class="btn link" href="#/words">Stop</a><span class="spacer"></span><button class="btn primary big main-cta" type="button" data-cta ${!P.pick ? "disabled" : ""}>${P.checked ? "Continue" : "Check"}</button></div></div>`;
  $("#main").onclick = e => { const o = e.target.closest("[data-o]"); if (o && !P.checked){ P.pick = o.dataset.o; renderPractice(); } };
  $("[data-cta]").onclick = () => {
    if (!P.checked){ P.checked = true; const ok = P.pick === q.w; if (ok) P.score++; wordResult(q.w, ok); markActive(); save(); renderPractice(); }
    else { P.i++; P.pick = null; P.checked = false; renderPractice(); }
  };
  const t = $("#stitle"); if (t) t.focus({ preventScroll:true });
}
function wordCardHTML(v, o){
  o = o || {};
  const inBank = state.words[v.w] && state.words[v.w].added;
  return `<div class="wordcard">
    <div class="wc-top"><span class="wc-word">✓ ${esc(v.w)}</span><span class="ipa">${esc(v.ipa || "")}</span></div>
    <p class="def">= ${esc(v.en)}</p>
    <p class="uk">🇺🇦 ${esc(v.ua)}</p>
    <p class="ex">“${esc(v.ex)}”</p>
    <div class="row">${sayBtn(v.w + ". " + v.ex, "Listen", "Listen")}<span class="spacer"></span>
      ${o.mini ? `<span class="status ${status(v.w)}">${STATUS_LABEL[status(v.w)]}</span>` : `<button class="btn small addword ${inBank ? "on" : ""}" type="button" data-addword="${v.w}">${inBank ? "✓ In My words" : "+ My words"}</button>`}</div>
  </div>`;
}

/* ---------- PROGRESS ---------- */
function achievements(){
  const a = (state.lessons.c1a || {}).ans || {};
  const b = (state.lessons.c1b || {}).ans || {};
  const cases = a.detective && a.detective.cases ? Object.values(a.detective.cases) : [];
  return [
    { i:"👀", t:"First impression", d:"Judge all five photos", ok: a.judge && a.judge.votes && Object.keys(a.judge.votes).length >= 5 },
    { i:"📚", t:"Word collector", d:"Collect 15 words", ok: myWords().length >= 15 },
    { i:"🕵️", t:"Personality detective", d:"Solve all six cases", ok: cases.length === 6 && cases.every(c => c.solved) },
    { i:"🎲", t:"Good bet", d:"Win 3 or more bet points", ok: a.post && a.post.points >= 3 },
    { i:"🎧", t:"Good listener", d:"Listen to a whole conversation", ok: a.listen && a.listen.plays >= 1 },
    { i:"✍️", t:"The real me", d:"Finish your profile", ok: a.realme && a.realme.completed },
    { i:"💪", t:"First mastered word", d:"Master a word in practice", ok: stats().mastered >= 1 },
    { i:"🔥", t:"On fire", d:"A 3-day streak", ok: streak() >= 3 },
    { i:"🎬", t:"Episode 1", d:"Finish the first episode", ok: state.lessons.c1a && state.lessons.c1a.finished },
    { i:"🔎", t:"Case closed", d:"Find who sent the message", ok: !!(b.board && b.board.k && b.board.k.solved) },
    { i:"🧩", t:"Normal or now?", d:"6 / 6 in the grammar practice", ok: !!(b.practice && b.practice.p && b.practice.p.best === 6) },
    { i:"🎞️", t:"Episode 2", d:"Finish the second episode", ok: state.lessons.c1b && state.lessons.c1b.finished }
  ];
}
function renderProgress(){
  const st = stats();
  const ach = achievements();
  shell("progress", `
    <div class="hello"><h1>Progress</h1><p>🔥 ${streak()}-day streak · ${ach.filter(x => x.ok).length} of ${ach.length} achievements</p></div>
    <div class="stats">
      <div class="stat"><b>🎬 ${st.lessons}</b><span>episodes completed</span></div>
      <div class="stat"><b>💬 ${st.mastered}</b><span>words mastered · ${st.words} collected</span></div>
      <div class="stat"><b>🏆 ${st.missions}</b><span>final missions</span></div>
      <div class="stat"><b>🎧 ${st.minutes}</b><span>minutes of listening</span></div>
    </div>
    <div class="section-title"><h2>Achievements</h2></div>
    <div class="badges">${ach.map(x => `<div class="badge ${x.ok ? "" : "off"}"><span class="bi" aria-hidden="true">${x.i}</span><div><b>${esc(x.t)}</b><small>${x.ok ? "✓ Unlocked" : esc(x.d)}</small></div></div>`).join("")}</div>
    <div class="section-title"><h2>Your journey</h2></div>
    <div class="journey">${cycles().map(c => { const cs = cycleState(c); return `<a class="jcard ${c.lessons.some(l => l.content) ? "" : "locked"}" href="#/series/${c.n}"><span class="jthumb" style="--c1:${c.color};width:48px;height:48px;font-size:1.5rem">${c.emoji}</span><span class="jt"><b>${esc(c.title)}</b>${epDots(c)}</span><span class="jstate ${cs.cls}">${cs.t}</span></a>`; }).join("")}</div>
    <div class="section-title"><h2>Settings</h2></div>
    <div class="panel">
      ${user ? `<p>Signed in as <b>${esc(user.email || displayName())}</b>. Progress is synced with Inkwell.</p>` : `
        <div class="field"><label for="nm">Your name</label><input type="text" id="nm" value="${esc(state.name)}" placeholder="Taras" autocomplete="given-name" style="max-width:320px"></div>
        <p class="muted">${mode === "preview" ? "Preview mode: progress stays in this browser." : "Progress is saved in this browser. Sign in to Inkwell to sync it."}</p>`}
      <div class="row">
        ${isTeacher() ? `<button class="btn" type="button" data-toggle="teacher">🧑‍🏫 Teacher view: ${teacherOn() ? "on" : "off"}</button>` : ""}
        <button class="btn" type="button" data-toggle="theme">🌙 Theme: ${isDark() ? "dark" : "light"}</button>
        <span class="spacer"></span>
        <button class="btn ghost" type="button" data-reset>Reset my progress</button>
      </div>
    </div>`);
  const nm = $("#nm");
  if (nm) nm.oninput = () => { state.name = nm.value.trim(); save(); };
  const rs = $("[data-reset]");
  rs.onclick = () => {
    if (rs.dataset.confirm){ const keep = { theme:state.theme, name:state.name }; state = Object.assign(fresh(), keep); save(); toast("Progress reset"); renderProgress(); }
    else { rs.dataset.confirm = "1"; rs.textContent = "Tap again to reset everything"; rs.classList.add("hot"); }
  };
}

/* ---------- STUDENTS (teacher only) ---------- */
let studentsCache = null;
async function renderStudents(force){
  if (!isTeacher()){ location.hash = "#/"; return; }
  const draw = (body) => shell("students", `
    <div class="hello"><h1>Students</h1><p>Progress in The Signal · you can clear an episode or the whole course for a student.</p></div>
    ${body}`);
  if (!studentsCache || force){
    draw(`<div class="empty"><div class="big">⏳</div><p class="muted">Loading the student list…</p></div>`);
    try { studentsCache = await fetchStudents(); }
    catch(e){
      console.warn(e);
      draw(`<div class="empty"><div class="big">🔒</div><h3>Could not load the students</h3><p class="muted">Check that <code>signal_progress</code> exists and that the teacher policies from signal_progress.sql are applied.</p><button class="btn" type="button" data-reload>Try again</button></div>`);
      $("#main").onclick = e => { if (e.target.closest("[data-reload]")) renderStudents(true); };
      return;
    }
  }
  const list = studentsCache;
  const when = t => { if (!t) return "no progress yet"; const d = new Date(t); const days = Math.floor((Date.now() - d.getTime()) / 86400000); return days <= 0 ? "today" : days === 1 ? "yesterday" : days + " days ago"; };
  const epName = id => { const m = lessonMeta(id); return m ? m.cycle.emoji + " " + m.lesson.title : id; };
  draw(list.length ? `
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="pill">${list.length} student${list.length === 1 ? "" : "s"}</span>
      <button class="btn small" type="button" data-reload>↻ Refresh</button></div>
    <div class="wlist">${list.map(st => `
      <div class="wrow" style="flex-wrap:wrap;gap:10px">
        <div class="wm" style="min-width:210px"><b>${esc(st.name)}</b><small>${esc(st.username)} · ${when(st.updated)}${st.words ? " · " + st.words + " word" + (st.words === 1 ? "" : "s") : ""}</small></div>
        <div class="row" style="gap:6px;flex:1">${st.episodes.length ? st.episodes.map(e => `<span class="pill ${e.pct >= 100 ? "good" : "accent"}">${esc(epName(e.id))} ${e.pct}%</span>`).join("") : `<span class="muted">not started</span>`}</div>
        <div class="row" style="gap:6px">
          ${st.episodes.map(e => `<button class="btn small" type="button" data-clear-ep="${st.id}" data-lesson="${e.id}">Clear ${esc((m => m ? "ep. " + m.cycle.n + "." + (m.cycle.lessons.indexOf(m.lesson) + 1) : e.id)(lessonMeta(e.id)))}</button>`).join("")}
          ${st.episodes.length ? `<button class="btn small ghost" type="button" data-clear-all="${st.id}" data-name="${esc(st.name)}">Clear everything</button>` : ""}
        </div>
      </div>`).join("")}</div>
    <p class="muted" style="margin-top:12px">Clearing removes the student's answers and screen progress. Their collected words are part of the same record, so “Clear everything” also empties their word bank.</p>`
  : `<div class="empty"><div class="big">🧑‍🏫</div><h3>No students yet</h3><p class="muted">Students appear here once they exist in Inkwell.</p><button class="btn" type="button" data-reload>↻ Refresh</button></div>`);
  $("#main").onclick = async e => {
    if (e.target.closest("[data-reload]")) return renderStudents(true);
    const ep = e.target.closest("[data-clear-ep]");
    const all = e.target.closest("[data-clear-all]");
    const btn = ep || all;
    if (!btn) return;
    if (!btn.dataset.confirm){
      btn.dataset.confirm = "1";
      btn.dataset.label = btn.textContent;
      btn.textContent = "Tap again to confirm";
      btn.classList.add("hot");
      setTimeout(() => { if (btn.dataset.confirm){ delete btn.dataset.confirm; btn.textContent = btn.dataset.label; btn.classList.remove("hot"); } }, 4000);
      return;
    }
    btn.disabled = true; btn.textContent = "Clearing…";
    try {
      if (ep) await clearStudentEpisode(ep.dataset.clearEp, ep.dataset.lesson);
      else await clearStudentCourse(all.dataset.clearAll);
      toast(ep ? "Episode cleared" : "Course cleared");
      renderStudents(true);
    } catch(err){
      console.warn(err); btn.disabled = false; btn.textContent = btn.dataset.label || "Try again";
      toast("Could not clear: check the teacher policy in signal_progress.sql");
    }
  };
}

window.SIG = {
  $, $$, esc, reduced, onCleanup, runCleanups, toast, save, L, markActive, TTS, sayBtn, avatar, photo, face, cover, crew,
  addWord, wordResult, vocab, status, STATUS_LABEL, wordCardHTML, wordCount, lessonMeta, cycleOf, shell,
  renderHome, renderSeries, renderWords, renderPractice, renderProgress, applyTheme, loadLocal, pull,
  get state(){ return state; }, get mode(){ return mode; }, set mode(v){ mode = v; },
  get sb(){ return sb; }, set sb(v){ sb = v; }, get user(){ return user; }, set user(v){ user = v; },
  resetPractice(){ practice = null; },
  loadRole, isTeacher, teacherOn, get role(){ return role; },
  renderStudents, resetLesson
};
})();
