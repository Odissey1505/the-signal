/* ============================================================
   LESSON 2 · Cycle 1B · BEHIND THE PROFILE
   Present simple vs present continuous — an investigation.
   Персонажі спільні з епізодом 1 (c1a), тому він має завантажитися першим
   (див. requires). Екрани — з бібліотеки js/screens/story.js,
   порядок екранів — у функції screens() в кінці файлу.
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

window.SIGNAL_LESSONS.c1b = {
  id: "c1b",
  cycle: 1,
  lessonType: "understand",
  theme: "investigation",
  title: "Behind the Profile",
  series: "First Impressions",
  question: "What is normal for a person — and what is happening today?",
  minutes: 57,
  setting: "Signal Weekend, Kraków. Day 2, morning. After last night's screenshot, an anonymous account writes in the group chat.",

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["look"],
    vocabPresentation: [],
    discoveryGuide: ["chat", "grammar"],
    vocabPractice: [],
    grammar: ["grammar"],
    grammarPractice: ["practice", "spot"],
    listening: ["voice"],
    speaking: ["chat:why", "alibi"],
    mission: ["board"],
    summary: ["reflect"],
    homework: []
  },
  tabs: [
    { key:"warmUp", label:"Warm-up" }, { key:"reading", label:"Story" }, { key:"grammar", label:"Grammar" },
    { key:"grammarPractice", label:"Practice" }, { key:"clues", label:"Clues" }, { key:"listening", label:"Listening" },
    { key:"speaking", label:"Speaking" }, { key:"mission", label:"Mission" }, { key:"summary", label:"Wrap-up" }
  ],

  /* немає нових слів: повторення лексики Lesson 1 */
  vocab: [],
  receptive: [],
  recall: ["shy", "polite", "careful", "impatient", "lazy", "friendly", "cheerful", "serious", "confident", "funny", "rude"],

  requires: ["c1a"],
  get characters(){ return (window.SIGNAL_LESSONS.c1a || {}).characters || {}; },
  order: ["leo", "dana", "marko"],

  /* ---------- the three suspects ---------- */
  suspects: {
    leo: {
      traits: ["shy", "polite"],
      usually: "arrives early and wears bright clothes",
      today: "is sitting outside the café in a black hoodie",
      chat: [ { who:"leo", time:"8:40", t:"Sorry I'm late! Long call with my sister 🎂" } ],
      alibi: "“I'm calling my sister. It's her birthday.”",
      check: "8:20 — his sister posts a birthday photo from Manchester. 🎂",
      rot: -2
    },
    dana: {
      traits: ["careful", "impatient"],
      usually: "talks about plans and timetables",
      today: "is asking everyone questions about Zoe",
      chat: [ { who:"dana", time:"8:25", t:"Zoe, are you OK? 💛 Can we talk before the interviews?" } ],
      alibi: "“I'm preparing interviews for the podcast.”",
      check: "Her notebook: “Day 2 — interview questions”. Page 1 of 3.",
      rot: 1.5
    },
    marko: {
      traits: ["careful", "honest"],
      usually: "ignores the group chat",
      today: "is checking the chat every few minutes",
      chat: [
        { who:"marko", time:"8:10", t:"I'm in the hall, fixing the projector. Not reading the chat today 🙅" },
        { sys:"8:16 · Marko reacted 👀 to Unknown's message" },
        { sys:"8:17 · Marko is online" },
        { who:"marko", time:"8:19", t:"Black suits Leo, by the way." }
      ],
      alibi: "“My phone is in my bag. I'm not reading any messages today.”",
      check: "8:15 — Nate writes about Leo's hoodie in the group chat. At that time, Marko is “in the hall”.",
      rot: -1
    }
  },
  culprit: "marko",
  evidence: [
    { id:"e1", t:"He usually ignores the chat, but today he is checking it every few minutes.", who:"marko" },
    { id:"e2", t:"He says he isn't reading the chat, but he is online.", who:"marko" },
    { id:"e3", t:"He is reacting to Unknown's message with 👀.", who:"marko" },
    { id:"e4", t:"He knows about Leo's black hoodie — but he says he isn't reading the chat.", who:"marko" },
    { id:"e5", t:"He is wearing a black hoodie today.", who:"leo" },
    { id:"e6", t:"He is asking lots of questions about Zoe.", who:"dana" }
  ],

  /* ---------- stages ---------- */
  stages: [
    {
      id:"look", n:1, section:"warmUp", min:6, type:"desc",
      title:"Is something different?",
      say:"Choose the description that matches. Remember Episode 1!",
      ua:"Обери опис, який підходить. Згадай епізод 1!",
      hook:{
        recap:"Last night, someone posted a screenshot about Zoe: “She's just pretending.”",
        time:"Day 2 · 7:58 AM",
        chat:"Signal Weekend 🎙️",
        msgs:["Someone in this group isn't showing their real personality.", "Watch what they are doing today."]
      },
      items:[
        { c:"leo", todayImg:"assets/characters/leo-today.webp", todayFace:{ x:48, y:36 },
          o:["He is usually confident and loud.", "He is usually shy and polite."], a:1,
          why:"Remember Episode 1? Leo looks confident in his photos, but actually he's shy with new people — and very polite. He said “thank you” to the cook three times!",
          today:"Leo is usually calm and polite, but today he looks worried.",
          cap:"8:05 · outside the café",
          no:"That's what his profile says — but remember who wrote it? His sister, as a joke!",
          talk:["What is he usually like?", "What does he usually wear?", "Does he look different today?"],
          words:["shy", "polite"] },
        { c:"dana", todayImg:"assets/characters/dana-today.webp", todayFace:{ x:50, y:38 },
          o:["She is usually careful and a bit impatient.", "She is usually lazy and relaxed."], a:0,
          why:"Dana has fourteen colour-coded notebooks and she's always ten minutes early — that's careful. And when lunch was five minutes late, she checked her watch twenty times!",
          today:"Dana usually plans everything, but today she looks confused.",
          cap:"8:07 · reception",
          no:"Lazy? Dana has fourteen notebooks and a plan for everything!",
          talk:["What is she usually like?", "What does she usually carry?", "Does she look different today?"],
          words:["careful", "impatient"] },
        { c:"marko", todayImg:"assets/characters/marko-today.webp", todayFace:{ x:46, y:38 },
          o:["He is really lazy. He sleeps all day.", "He looks lazy, but actually he's careful."], a:1,
          why:"Marko hates mornings, but he got up at half past six to fix the projector — and he was very careful with the cables.",
          today:"Marko usually looks sleepy in the morning, but today he looks wide awake. And he's holding his phone.",
          cap:"8:09 · main hall",
          no:"That's the first impression. But who got up at half past six to fix the projector?",
          talk:["What is he usually like in the morning?", "What does he usually do before breakfast?", "Does he look different today?"],
          words:["lazy", "careful"] }
      ],
      teacher:"<p>Перший екран — коротке нагадування сюжету: прочитайте повідомлення вголос і не коментуйте.</p><p>Далі по одному персонажу: клас голосує, потім 2–3 учні відповідають на питання під фото. Нові слова не вводимо — лише лексику епізоду 1.</p><p>Фото «today» — те саме фото в «ранковому» світлі. Якщо згенеруєте окремі фото, додайте їх у поле <code>todayImg</code> персонажа.</p>"
    },
    {
      id:"chat", n:2, section:"reading", min:7, type:"chat",
      title:"A strange morning",
      say:"Read the group chat. The messages arrive one by one.",
      ua:"Читай груповий чат. Повідомлення з'являються по одному.",
      msgs:[
        { who:"zoe", time:"8:12", t:"Does anyone know where Leo is? He always arrives early." },
        { who:"nate", time:"8:13", t:"He's sitting outside the café right now." },
        { who:"zoe", time:"8:13", t:"Really? He never goes there before breakfast." },
        { who:"nate", time:"8:15", t:"And he's wearing a black hoodie today." },
        { who:"zoe", time:"8:15", t:"That's strange. He usually wears bright clothes." },
        { who:"anon", time:"8:16", t:"Maybe you don't know Leo as well as you think." },
        { sys:"Marko reacted 👀" }
      ],
      comp:[
        { q:"What does Leo usually do?", o:["He always arrives early.", "He usually sits outside the café.", "He never comes to breakfast."], a:0, ev:"He always arrives early." },
        { q:"Where is he sitting now?", o:["In the camp kitchen", "Outside the café", "In the main hall"], a:1, ev:"He's sitting outside the café right now." },
        { q:"What is unusual about his clothes?", o:["He's wearing a black hoodie, but he usually wears bright clothes.", "He's wearing sunglasses again.", "He's wearing a yellow jacket."], a:0, ev:"He usually wears bright clothes." }
      ],
      why:{
        q:"Why does Leo seem suspicious?",
        ua:"Чому Лео здається підозрілим?",
        hints:["What does he usually do? What is he doing now?", "Think about: where he is, what he's wearing, who he's talking to."],
        starter:"Leo seems suspicious because he usually…, but today he is…",
        sample:"Leo seems suspicious because he usually arrives early, but today he is sitting outside the café. He usually wears bright clothes, but today he is wearing a black hoodie."
      },
      teacher:"<p>Чат запускається автоматично; «Replay» — показати ще раз. Після чату — три швидкі питання індивідуально, потім четверте усно: 3–4 учні, опора «Useful answer starter».</p><p>Не звертайте уваги класу на реакцію 👀 від Марко — це прихований доказ для фіналу. Уважні учні помітять самі.</p>"
    },
    {
      id:"grammar", n:3, section:"grammar", min:9, type:"discover",
      title:"Normal or happening now?",
      say:"Look at the pairs. Turn on the highlights. What do you notice?",
      ua:"Подивись на пари речень. Увімкни підсвічування. Що ти помічаєш?",
      pairs:[
        ["Leo [m:usually] [v:wears] bright clothes.", "Leo [a:is] [v:wear][i:ing] a black hoodie [m:today]."],
        ["He [m:always] [v:says] hello to everyone.", "He [a:isn't] [v:talk][i:ing] to anyone [m:now]."],
        ["Zoe [v:checks] the group chat [m:every morning].", "Zoe [a:is] [v:check][i:ing] Leo's profile [m:at the moment]."]
      ],
      sort:[
        { t:"Leo usually wears bright clothes.", a:"normal" },
        { t:"Leo is wearing a black hoodie today.", a:"now" },
        { t:"He always says hello to everyone.", a:"normal" },
        { t:"He isn't talking to anyone now.", a:"now" },
        { t:"Zoe checks the group chat every morning.", a:"normal" },
        { t:"Zoe is checking Leo's profile at the moment.", a:"now" }
      ],
      markers:[
        { w:"usually", a:"normal" }, { w:"today", a:"now" }, { w:"always", a:"normal" },
        { w:"now", a:"now" }, { w:"every morning", a:"normal" }, { w:"at the moment", a:"now" }
      ],
      q5:{ q:"What comes after am, is or are?", o:["verb + -ing (wearing, talking)", "verb + -s (wears, talks)", "the base verb (wear, talk)"], a:0 },
      rule:[
        { name:"Present Simple", q:"What is normal?",
          uses:["routines and habits", "facts", "permanent situations", "personality and general behaviour"],
          ex:["Leo usually arrives early.", "Zoe doesn't trust strangers.", "Does Dana know the truth?"],
          form:"he / she / it + verb-<b>s</b> · don't / doesn't + verb",
          markers:["usually", "always", "often", "sometimes", "rarely", "never", "every day"] },
        { name:"Present Continuous", q:"What is happening now or temporarily?",
          uses:["actions happening now", "temporary situations", "changing situations", "unusual behaviour around now"],
          ex:["Leo is sitting outside now.", "Zoe is looking for information.", "Everyone is acting strangely today."],
          form:"am / is / are + verb-<b>ing</b>",
          markers:["now", "right now", "at the moment", "today", "this week"] }
      ],
      teacher:"<p>1) Пари речень: вмикайте підсвічування по черзі й питайте «What's different?». 2–4) Discovery Questions — у парах, 1–2 хв на кожне. Правило показуйте лише після кнопки <b>Reveal the Grammar Rule</b>.</p><p>Головна ідея, яку варто записати на дошці: <b>What is normal?</b> vs <b>What is happening now or temporarily?</b></p>"
    },
    {
      id:"practice", n:4, section:"grammarPractice", min:6, type:"practice",
      title:"Normal or now?",
      say:"Choose the right form. Look for the clue word.",
      ua:"Обери правильну форму. Шукай слово-підказку.",
      items:[
        { pre:"Leo usually", o:["wears", "is wearing"], a:0, post:"bright clothes.", cue:"usually", why:"Usually shows a regular action, so we use Present Simple." },
        { pre:"Today he", o:["wears", "is wearing"], a:1, post:"a black hoodie.", cue:"Today", why:"Today shows something different from normal — a temporary action. Present Continuous." },
        { pre:"Zoe often", o:["checks", "is checking"], a:0, post:"her messages before breakfast.", cue:"often", why:"Often is about a habit, so we use Present Simple." },
        { pre:"Look! Someone", o:["types", "is typing"], a:1, post:"another message.", cue:"Look!", why:"Look! means it's happening right now. Present Continuous." },
        { pre:"Dana", o:["doesn't usually hide", "isn't usually hiding"], a:0, post:"her feelings.", cue:"usually", why:"This is about her personality — general behaviour. Present Simple." },
        { pre:"Why", o:["does Marko check", "is Marko checking"], a:1, post:"the chat right now?", cue:"right now", why:"Right now = at this moment. Present Continuous." }
      ],
      teacher:"<p>Індивідуально 4 хв, потім перевірка вголос: учень називає не лише відповідь, а й слово-підказку.</p><p>Речення 5 — найскладніше: риса характеру → Present Simple, навіть без «every day».</p>"
    },
    {
      id:"spot", n:5, section:"clues", min:6, type:"spot",
      title:"Spot the difference",
      say:"Compare Leo's normal profile with Leo today. Tap the three most suspicious changes.",
      ua:"Порівняй звичайного Лео з Лео сьогодні. Натисни на три найпідозріліші зміни.",
      c:"leo",
      todayImg:"assets/characters/leo-today.webp", todayFace:{ x:48, y:34 },
      normal:[
        { id:"clothes", t:"wears bright clothes", e:"🌈" },
        { id:"talk", t:"says hello to everyone", e:"👋" },
        { id:"early", t:"arrives early", e:"⏰" },
        { id:"phone", t:"never hides his phone", e:"📱" }
      ],
      today:[
        { id:"clothes", t:"is wearing a black hoodie", e:"🖤" },
        { id:"talk", t:"isn't talking to anyone", e:"🤐" },
        { id:"early", t:"is arriving late", e:"🐢" },
        { id:"phone", t:"is hiding his phone", e:"🙈" }
      ],
      build:{
        clothes:{ pre:"Leo usually wears bright clothes, but today he", o:["wears", "is wearing", "wearing"], a:1, post:"a black hoodie." },
        talk:{ pre:"He always says hello to everyone, but now he", o:["doesn't talk", "not talking", "isn't talking"], a:2, post:"to anyone." },
        early:{ pre:"He always arrives early, but today he", o:["is arriving", "arrives", "arriving"], a:0, post:"late." },
        phone:{ pre:"He never hides his phone, but today he", o:["hides", "is hiding", "hiding"], a:1, post:"it." }
      },
      need:3,
      teacher:"<p>Пари. Будь-які три зміни приймаються — попросіть пояснити, чому саме ці найпідозріліші. Після кожного вибору учень складає речення за моделлю <b>usually…, but today he is…</b> і читає його вголос.</p>"
    },
    {
      id:"voice", n:6, section:"listening", min:7, type:"voice",
      title:"The voice message",
      say:"Nate sends Zoe a voice message. Listen twice.",
      ua:"Нейт надсилає Зої голосове повідомлення. Слухаємо двічі.",
      from:"nate", to:"zoe", time:"8:31",
      audioSrc:"",
      voice:{ lang:"en-GB", pitch:1, rate:.95, hint:["daniel","ryan","arthur","george","oliver","uk english male","thomas","male"] },
      text:[
        "Hi, Zoe.",
        "I don't know what is happening, but everyone is acting strangely today.",
        "Leo is hiding his phone, Dana is asking lots of questions, and Marko keeps looking at the group chat.",
        "Marko usually ignores our messages, so why is he checking the chat every minute?"
      ],
      first:{ q:"Who seems the most suspicious?", a:"marko", why:"Listen to the last sentence: Marko usually ignores the chat, but today he's checking it every minute." },
      table:{
        rows:[
          { c:"leo", usual:{ t:"doesn't hide his phone" }, today:{ slot:"is hiding his phone" } },
          { c:"dana", usual:{ t:"talks about her plans" }, today:{ slot:"is asking lots of questions" } },
          { c:"marko", usual:{ slot:"ignores the chat" }, today:{ slot:"is checking it every minute" } }
        ],
        extra:["checks it every minute", "is playing football"]
      },
      suspect:{ q:"Who do you suspect now? Why?", model:"I suspect… because they usually…, but today they are…" },
      teacher:"<p>1-ше прослуховування — питання «Who seems the most suspicious?». 2-ге — таблиця. Серед карток є пастка <i>checks it every minute</i>: у колонці Today потрібна форма Present Continuous.</p><p>Текст відкривається після першого повного прослуховування (у Teacher view — одразу). Для mp3 заповніть поле <code>audioSrc</code>.</p>"
    },
    {
      id:"alibi", n:7, section:"speaking", min:6, type:"alibi",
      title:"Alibi check",
      say:"Choose a character. You play the character — your teacher (or partner) is the detective.",
      ua:"Обери персонажа й зіграй його. Учитель або партнер — детектив.",
      alibis:{
        leo:["I usually come to breakfast early, but today I'm sitting outside because I'm calling my sister in Manchester. It's her birthday!", "I'm hiding my phone because I'm making a surprise video for her.", "The black hoodie? It's Zoe's. I'm wearing it because I spilled hot chocolate on my blue one."],
        dana:["I usually talk about plans and timetables. I love a good plan.", "Today I'm asking lots of questions because I'm preparing interviews for the podcast. I always prepare!", "OK, most of my questions are about Zoe. I'm worried about her after that screenshot."],
        marko:["I don't usually read the group chat. It's too noisy.", "Right now I'm fixing the projector in the main hall. It's broken again.", "My phone is in my bag. I'm not reading any messages today — I'm busy!"]
      },
      questions:["What do you usually do before breakfast?", "Where do you normally go?", "What are you doing today?", "Why are you behaving differently?", "Are you hiding anything?"],
      phrases:["I usually…, but today I'm…", "I normally…, but right now I'm…", "I don't usually…, but today…", "I'm doing this because…"],
      teacher:"<p>Учитель — детектив, ставить 3–5 питань. Учень відповідає в ролі, спираючись на картку, але своїми словами. Клас голосує двома кнопками. Повторіть із 2–3 учнями й різними персонажами.</p><p>Письмових відповідей не потрібно.</p>"
    },
    {
      id:"board", n:8, section:"mission", min:9, type:"board",
      title:"Who sent the message?",
      say:"Study the detective board. Then name the sender and prove it.",
      ua:"Вивчи дошку доказів. Назви автора повідомлення й доведи це.",
      phrases:["I think… sent the message.", "They usually…, but today they are…", "They say…, but…", "This person seems…", "My final evidence is…"],
      sample:"I think Marko sent the message. He usually ignores the group chat, but today he is checking it every few minutes. He says he isn't reading the chat, but he is appearing online. Marko is normally honest and careful, but he is behaving suspiciously today.",
      reveal:["Good detective work. You found me.", "But you still don't know why I sent the message…"],
      teacher:"<p>Пари або малі групи: 2 хв на дошку, 3 хв на рішення. Кожна група вголос називає підозрюваного і щонайменше три докази: 2 речення Present Simple, 2 — Present Continuous, 2 слова про характер.</p><p>Автор — <b>Марко</b>: каже, що не читає чат, але онлайн, реагує 👀 і знає про худі Лео. <b>Причину не пояснюйте</b> — це сюжет епізоду 1C.</p>"
    },
    {
      id:"reflect", n:9, section:"summary", min:1, type:"reflect",
      title:"Today I can…",
      can:["talk about regular actions", "describe what is happening now", "notice unusual behaviour", "explain my ideas with evidence"],
      rate:["I've got it", "Almost there", "I need more practice"],
      teacher:"<p>Швидка самооцінка. Відповіді учнів видно в їхньому прогресі.</p>"
    }
  ]
,

  /* ---------- порядок екранів (типи — з js/screens/story.js) ---------- */
  screens(add, st){
    const lk = st("look");
    add(lk, "storyHook", Object.assign({ cta:"Start the investigation" }, lk.hook));
    lk.items.forEach((it, i) => add(lk, "whichIsTrue", Object.assign({ key:i, i, of:lk.items.length, say: i ? "" : lk.say, ua: i ? "" : lk.ua }, it), it.o[it.a]));

    const ch = st("chat");
    add(ch, "groupChat", { msgs:ch.msgs, me:"zoe", chat:"Signal Weekend", sub:"20 members · Zoe's phone", title:ch.title, say:ch.say, ua:ch.ua });
    add(ch, "quickQuiz", { items:ch.comp, title:"What do we know?", sub:"Answer from the chat.", ua:"Відповідай за чатом.", kicker:"Story · 3 questions", evLabel:"In the chat:" },
      ch.comp.map((q, i) => (i + 1) + ") " + q.o[q.a]).join(" · "));
    add(ch, "speakCard", Object.assign({ title:"Why does Leo seem suspicious? 🤔", sub:"Say your answer out loud. Use the answer starter.", subUa:"Скажи відповідь уголос. Використай початок речення.", kicker:"Story · speaking" }, ch.why), ch.why.sample);

    const g = st("grammar");
    add(g, "highlightPairs", { pairs:g.pairs, title:g.title, say:g.say, ua:g.ua });
    const order = [0, 3, 4, 1, 5, 2];
    add(g, "twoWay", { key:"sort", store:"sort", short:"Q 1–2", items: order.map(k => g.sort[k]), labels:{ normal:"Normal / regular", now:"Happening now" },
      title:"Normal or now?", sub:"Which sentences describe normal or regular actions? Which actions are happening now?", ua:"Які речення про звичне, а які — про те, що відбувається зараз?",
      kicker:"Grammar · discovery questions 1–2", win:"You can see the difference!" },
      "Normal: usually wears · always says · checks every morning — Now: is wearing · isn't talking · is checking");
    add(g, "twoWay", { key:"markers", store:"mk", short:"Q 3–4", items: g.markers.map(m => ({ t:m.w, a:m.a })), labels:{ normal:"Regular", now:"Now" }, grid:true,
      title:"Clue words", sub:"What words show that an action is regular? What words show that it's happening now?", ua:"Які слова показують, що дія регулярна, а які — що вона відбувається зараз?",
      kicker:"Grammar · discovery questions 3–4", win:"These are your clue words." },
      "Regular: usually, always, every morning — Now: today, now, at the moment");
    add(g, "mcqGate", Object.assign({ short:"Q 5", title:"One more question", kicker:"Grammar · discovery question 5", next:"Reveal the Grammar Rule",
      hint:"Leo <b>is</b> wear<b>ing</b>… · He <b>isn't</b> talk<b>ing</b>… · Zoe <b>is</b> check<b>ing</b>…",
      good:"Yes: am / is / are + verb-ing.", bad:"Look at the examples above again." }, g.q5), g.q5.o[g.q5.a]);
    add(g, "ruleCards", { cards:g.rule, cta:"Let's practise" });

    const p = st("practice");
    add(p, "stepPractice", { items:p.items, title:p.title, say:p.say, ua:p.ua }, p.items.map((it, i) => (i + 1) + " " + it.o[it.a]).join(" · "));

    const sp = st("spot");
    add(sp, "spotDiff", { c:sp.c, todayImg:sp.todayImg, todayFace:sp.todayFace, normal:sp.normal, today:sp.today, build:sp.build, need:sp.need, say:sp.say, ua:sp.ua, when:"Day 2 · 8:20",
      model:"Make the sentence: usually…, but today he is…",
      wrong:"Not quite. Something different from normal, happening now: <b>am / is / are + -ing</b>.",
      done:"Three clues in the case file. Leo is definitely acting strangely… but is he the one?" },
      "Будь-які 3: is wearing · isn't talking · is arriving · is hiding");

    const v = st("voice");
    const msg = { from:v.from, to:v.to, time:v.time, text:v.text, voice:v.voice, audioSrc:v.audioSrc };
    add(v, "voiceMessage", { msg, first:Object.assign({ bad:"Hmm. Listen to the last sentence again. Who does Nate ask about?" }, v.first), title:"The voice message 🎧", say:v.say, ua:v.ua, next:"Listen again for details" }, "Marko");
    const T = v.table, rs = T.rows;
    add(v, "voiceTable", { msg, rows:rs, order:[rs[2].today.slot, T.extra[0], rs[0].today.slot, rs[2].usual.slot, T.extra[1], rs[1].today.slot],
      sub:"Listen again. Complete the table: tap a card, then tap a gap — or drag it.", ua:"Слухай ще раз. Заповни таблицю: натисни картку, потім пропуск (або перетягни).",
      wrong:"Careful: in the Today column we need Present Continuous." },
      "Leo → is hiding his phone · Dana → is asking lots of questions · Marko → ignores the chat / is checking it every minute");
    add(v, "suspectPick", { q:v.suspect.q, model:v.suspect.model, kicker:"Listening · talk" });

    const al = st("alibi");
    add(al, "alibiCheck", { alibis:al.alibis, questions:al.questions, phrases:al.phrases, title:"Alibi check 🎭", say:al.say, ua:al.ua }, "Суперечність лише в алібі Марко");

    const b = st("board");
    add(b, "evidenceBoard", { title:"The detective board", say:b.say, ua:b.ua, question:"Who sent the message?",
      quote:"Someone in this group isn't showing their real personality. Watch what they are doing today.",
      hint:"One suspect's alibi doesn't match the evidence.", cta:"Name the sender" });
    add(b, "accuse", { title:"Who sent the message?", evidence:this.evidence, culprit:this.culprit, phrases:b.phrases, sample:b.sample,
      cta:"Name the sender", solvedCta:"Send your answer",
      placeholder:"I think… sent the message. They usually…, but today they are…",
      extraWords:["honest", "suspicious", "quiet", "worried", "calm", "nervous", "organised", "sociable", "reserved", "strange"],
      wrong:{ leo:"Leo's alibi checks out: his sister posted a birthday photo at 8:20. Whose words don't match what the chat shows?",
              dana:"Dana's notebook supports her alibi. Look again: who says one thing but does another?" } },
      "Marko · докази e1–e4 (e5 — про Лео, e6 — про Дану)");
    add(b, "reveal", { who:this.culprit, msgs:b.reveal, gate:"k" });

    const r = st("reflect");
    add(r, "canDo", { can:r.can, rate:r.rate, replies:["Brilliant. See you in the next episode!", "Nice — a little more practice and you've got it.", "That's OK! Try the Normal or now? practice again and ask your teacher."] });
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const p = (ans.practice && ans.practice.p) || {};
    const s = (ans.spot && ans.spot.s) || {};
    const tb = (ans.voice && ans.voice.tb) || {};
    const k = (ans.board && ans.board.k) || {};
    return {
      icon:"🔎", title:"Episode 2 complete",
      text:"You found the sender. But why did Marko send the message? And who wrote “She's just pretending”?",
      stats:[
        [`🧩 ${p.best != null ? p.best : 0} / 6`, "Normal or now?"],
        [`🔍 ${Object.keys(s.built || {}).length} / 3`, "clues in the case file"],
        [`🎧 ${tb.score != null ? tb.score : 0} / 4`, "listening table"],
        [`🕵️ ${k.solved ? (k.first ? "1st try" : "Solved") : "—"}`, "final mission"]
      ]
    };
  }
};
