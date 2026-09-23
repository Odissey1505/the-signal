/* ============================================================
   Перевірка курсу перед публікацією
   Запуск із папки the-signal:   node tools/check-course.js
   Перевіряє: карту курсу, файли уроків, обов'язкові етапи,
   картинки персонажів і обкладинок.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const ctx = { window: {}, console };
vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });

let errors = 0, warnings = 0;
const err = m => { errors++; console.log("  ✗ " + m); };
const warn = m => { warnings++; console.log("  ! " + m); };
const ok = m => console.log("  ✓ " + m);
const exists = p => fs.existsSync(path.join(root, p.split("?")[0]));

console.log("\nThe Signal — course check\n");
try { run("js/config.js"); run("js/course.js"); ok("config.js and course.js parse"); }
catch (e) { err("config/course: " + e.message); process.exit(1); }

/* типи екранів: вбудовані в player.js + бібліотеки з js/screens/ */
const kinds = new Set();
ctx.window.SIG = {};
ctx.window.SignalPlayer = { head: () => "", define: k => kinds.add(k) };
const screenDir = path.join(root, "js/screens");
if (fs.existsSync(screenDir)) fs.readdirSync(screenDir).filter(f => f.endsWith(".js")).forEach(f => {
  try { run("js/screens/" + f); } catch (e) { err(`js/screens/${f}: ${e.message}`); }
});
if (kinds.size) ok(`screen library: ${kinds.size} types (${[...kinds].join(", ")})`);

const course = ctx.window.SIGNAL_COURSE;
const lessons = ctx.window.SIGNAL_LESSONS;
const REQUIRED_A = ["judge", "leadin", "meet", "discover", "sort", "scenarios", "detective", "bets", "listen", "comp", "post", "speak", "realme", "cliff"];
let open = 0, total = 0;
const ids = new Set();

course.seasons.forEach(s => s.cycles.forEach(c => {
  ["image", "banner"].forEach(k => { if (c[k] && !exists(c[k])) err(`cycle ${c.n}: ${k} not found — ${c[k]}`); });
  c.lessons.forEach(l => {
    total++;
    if (ids.has(l.id)) err(`duplicate lesson id ${l.id}`); ids.add(l.id);
    if (!l.content) return;
    open++;
    console.log(`\n${c.emoji} Cycle ${c.n} · ${l.id} — ${l.title}`);
    if (!l.file){ err("content: true but no file"); return; }
    if (!exists(l.file)){ err("file not found — " + l.file); return; }
    try { run(l.file); } catch (e) { err(`${l.file}: ${e.message}`); return; }
    const les = lessons[l.id];
    if (!les){ err(`${l.file} does not register window.SIGNAL_LESSONS.${l.id}`); return; }
    ok("file loads and registers " + l.id);
    (les.requires || []).forEach(r => lessons[r] ? ok("uses " + r + " (loaded earlier)") : err(`needs lesson ${r} — put it earlier in course.js`));
    const stageIds = (les.stages || []).map(st => st.id);
    if (typeof les.screens === "function"){
      const list = [];
      try {
        les.screens((stage, kind, data) => { if (!stage) throw new Error("unknown stage before " + kind); list.push({ stage: stage.id, kind }); }, id => les.stages.find(x => x.id === id));
        const unknown = [...new Set(list.map(x => x.kind))].filter(k => !kinds.has(k));
        unknown.length ? err("unknown screen types: " + unknown.join(", ")) : ok(`${list.length} screens`);
        const empty = stageIds.filter(id => !list.some(x => x.stage === id));
        if (empty.length) warn("stages without screens: " + empty.join(", "));
      } catch (e) { err("screens(): " + e.message); }
    }
    if (les.lessonType === "discover"){
      const missing = REQUIRED_A.filter(id => !stageIds.includes(id));
      missing.length ? err("missing stages: " + missing.join(", ")) : ok(`${stageIds.length} stages present`);
    } else ok(`${stageIds.length} stages (${les.lessonType})`);
    const mins = (les.stages || []).reduce((a, st) => a + (st.min || 0), 0);
    (mins >= 50 && mins <= 70) ? ok(`timing ${mins} min`) : warn(`timing ${mins} min (expected ≈60)`);
    Object.entries(les.characters || {}).forEach(([id, ch]) => {
      if (ch.img){ exists(ch.img) ? null : err(`${id}: image not found — ${ch.img}`); }
      else warn(`${id}: no photo (SVG portrait is used)`);
    });
    if (les.characters) ok("characters: " + Object.keys(les.characters).join(", "));
    const words = (les.vocab || []).map(v => v.w);
    words.length ? ok(`${words.length} vocabulary items`) : (les.recall && les.recall.length ? ok(`no new words · recycles ${les.recall.length} words from earlier episodes`) : warn("no vocabulary"));
  });
}));

console.log(`\n${open} of ${total} episodes open · ${errors} error(s) · ${warnings} warning(s)\n`);
process.exit(errors ? 1 : 0);
