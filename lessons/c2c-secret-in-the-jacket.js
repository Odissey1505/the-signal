/* ============================================================
   LESSON 6 · Cycle 2C · THE SECRET IN THE JACKET 🧥🔎
   Unit 2 · In fashion — повторення (Revision) і фінал історії Unit 2.
   Продовжує Урок 5 з того самого місця: папірець у кишені куртки тата, ще не розгорнутий.
   Повторюємо: одяг і прикметники Уроку 4, Past Simple (+ / − / ?, was / were) Уроку 5.
   Нової граматики немає. Формат — урок один на один (учень + учитель, демонстрація екрана), 60 хв, 8 етапів.

   ФАКТИ ІСТОРІЇ (узгоджені з Уроками 4–5):
   • Субота, 21 листопада 1998, фестиваль City Sound (Club Stage). Тато = Dan (Daniel), 17 років.
   • Друзі: Alex (найкращий друг), Emma (підбадьорила тата, її камера) і Anna — четверта подруга.
   • В Уроці 5 тато сказав, що фото зробила «дівчина з натовпу». Насправді це була Anna:
     через тиждень після фестивалю її сім'я переїхала до Канади, друзі загубили зв'язок,
     і татові було важко про неї говорити («There's one more thing I haven't told you…»).
   • Anna придумала образи друзів (STYLE PLAN — той самий папірець у кишені), пришила
     червону нашивку на куртку тата (білий трикутник = «A» — for Anna), фотографувала весь вечір,
     а наприкінці дала татові конверт: «Don't open it tonight».
   • Конверт тато зберігає в скриньці з кодом 4-9-8 («four friends, '98»): лист Anna + єдине фото всіх чотирьох.
   • Невідомий відправник так і лишається загадкою (гачок на Unit 3).

   Екрани — з js/screens/secret.js (+ помічники з js/screens/memory.js), тема — css/secret.css
   (body[data-episode-theme="secret"]). Образи одягу малює js/art/wardrobe.js.
   Порядок екранів — у функції screens() в кінці файлу.

   КАРТИНКИ (необов'язкові). Поки поле null — показується намальована заміна, урок працює й так.
   Згенеруйте файл, покладіть у папку c2c всередині assets і впишіть шлях у MEDIA нижче.
   Підказки для генерації — у README.md, розділ «Урок 6».
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- картинки (null = намальована заміна) ---------- */
const MEDIA = {
  /* з Уроку 5 — уже на місці */
  photo: "assets/c2b/photo-1998.webp",
  photoAlt: "Dad's old concert photo from 1998: under purple stage lights, a smiling teenage boy in a denim jacket with a red patch, a white T-shirt and a bucket hat has his arms in the air. On the right, Alex in a red T-shirt and a dark cap is watching the stage. Date stamp: '98 11 21.",
  jacket: "assets/c2b/jacket.webp",
  jacketAlt: "Dad's old denim jacket with gold buttons, two chest pockets and a red patch with a white triangle.",
  /* нові для Уроку 6 */
  looks: { dan:null, alex:null, emma:null, anna:null },   /* 4 фото з щоденника (квадрат) — без імен */
  four: null,          /* єдине фото всіх чотирьох друзів (квадрат) */
  fourAlt: "An old photo from 21 November 1998: four teenagers laugh together in front of a stage — Dan in his denim jacket with the red patch and a bucket hat, Alex in a black leather jacket, Emma in a colourful dress and Anna in a bright red hoodie with a camera in her hand.",
  emma: null,          /* Emma сьогодні — портрет для чату (квадрат) */
  box: null            /* стара металева скринька з кодовим замком (квадрат, прозорий фон) */
};

/* ---------- образи 1998 (flat lay, js/art/wardrobe.js) — точно як у STYLE PLAN ---------- */
const LOOK = {
  dan:  { top:{ k:"tee", c:"#F2F0EA" }, outer:{ k:"denim", c:"#5C82B8", big:true, patch:"#C0392B" }, bottom:{ k:"loose", c:"#4A6FA5", denim:true }, shoes:{ k:"trainers", c:"#F4F4F4" }, extras:[{ k:"bucket", c:"#E9E2CF" }] },
  alex: { top:{ k:"tee", c:"#B3262E" }, outer:{ k:"leather", c:"#1E1E22" }, bottom:{ k:"smart", c:"#2B2F3A" }, shoes:{ k:"boots", c:"#2A1E16" } },
  emma: { dress:{ k:"dress", c:"#7048E8", pat:"fl", belt:"#FFD43B" }, shoes:{ k:"trainers", c:"#FFF3E0", accent:"#F783AC" } },
  anna: { top:{ k:"hoodie", c:"#E03131" }, bottom:{ k:"loose", c:"#5B7DB1", denim:true }, shoes:{ k:"trainers", c:"#F4F4F4", accent:"#E03131" }, extras:[{ k:"phone" }] }
};

/* ---------- неправильні дієслова (довідник «📖 Verb list» на кожному екрані) ---------- */
const IRREGULAR = [
  ["buy", "bought", "купувати"], ["meet", "met", "зустрічати"], ["go", "went", "йти / їхати"], ["wear", "wore", "носити"],
  ["see", "saw", "бачити"], ["take", "took", "брати; фотографувати"], ["give", "gave", "давати"], ["put", "put", "класти"],
  ["make", "made", "робити"], ["sew", "sewed", "шити, пришивати"], ["leave", "left", "іти, їхати"], ["write", "wrote", "писати"]
];

/* ---------- 4 докази (інвентар розслідування) ---------- */
const EVIDENCE = {
  1: { t:"The Four Outfits", icon:"👕", s:"Dan, Alex, Emma and Anna. Anna planned every outfit — and she sewed the red patch on Dan's jacket.", from:"Stage 3 · Who wore what?" },
  2: { t:"The 1998 Timeline", icon:"⏳", s:"6 p.m. patch → 7 p.m. friends → 10:30 band → 11:00 stage → 11:45 photo → 12:00 envelope.", from:"Stage 4 · Rebuild the night" },
  3: { t:"Dan's Diary", icon:"📖", s:"Anna was behind the camera. At the end of the night, she gave Dan a small envelope.", from:"Stage 5 · The missing person" },
  4: { t:"Emma's Testimony", icon:"🎤", s:"Anna took the photos with Emma's camera. A week later, her family moved to Canada.", from:"Stage 6 · Question the witness" }
};

/* ---------- STYLE PLAN — той самий папірець із кишені ---------- */
const PLAN = {
  title: "STYLE PLAN",
  sub: "City Sound Festival · Sat 21 Nov '98",
  names: [
    { id:"dan", n:"Dan", role:"guitar 🎸", wear:"denim jacket (+ MY red patch!), white T-shirt, loose jeans, white trainers, bucket hat",
      clue:"Dan = Daniel. That's Marko's dad!" },
    { id:"alex", n:"Alex", role:"guitar 🎸", wear:"black leather jacket, red T-shirt, dark trousers, boots",
      clue:"Alex — Dad's best friend. He's in Dad's photo in the red T-shirt." },
    { id:"emma", n:"Emma", role:"camera & courage 💪", wear:"colourful dress, comfortable shoes",
      clue:"Emma encouraged Dad to play. Remember? Lesson 5!" },
    { id:"anna", n:"Anna", role:"top secret 🤫", wear:"red hoodie, loose jeans, trainers",
      clue:"Anna… Dad never said this name. Not once.", hidden:true }
  ],
  foot: "Four friends. One night. One secret.",
  sign: "Never forget this night! — A."
};

const WORDS_CLOTHES = ["jacket", "jeans", "hoodie", "shirt", "t-shirt", "tshirt", "trainers", "boots", "dress", "skirt", "trousers", "coat", "hat", "cap", "shoes", "jumper", "sweater", "shorts", "suit", "tie", "socks", "scarf", "blazer", "top", "trainer", "boot", "shoe", "sneakers", "gloves", "bag"];

window.SIGNAL_LESSONS.c2c = {
  id: "c2c",
  cycle: 2,
  lessonType: "revision-mystery",
  theme: "secret",
  title: "The Secret in the Jacket",
  subtitle: "Unit 2 · In fashion · Lesson 6 · Revision",
  series: "The Jacket Secret",
  tagline: "Four friends. One night. One secret.",
  question: "What was hidden in the jacket?",
  minutes: 60,
  setting: "Sunday evening, right after Lesson 5. Marko is holding the folded paper from Dad's jacket pocket.",
  media: MEDIA,
  look: LOOK,
  irregular: IRREGULAR,
  evidence: EVIDENCE,
  plan: PLAN,
  clothesWords: WORDS_CLOTHES,
  props: { ticket:{ event:"City Sound Festival", stage:"Club Stage", when:"Sat 21 Nov 1998 · 6 p.m.", no:"Admit one · No. 0412" }, tape:"21.11.98 — LIVE" },
  code: "498",

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["recap", "paper"],
    vocabPresentation: [],
    discoveryGuide: [],
    vocabPractice: ["outfits"],
    grammar: [],
    grammarPractice: ["night", "box"],
    listening: [],
    reading: ["paper", "diary"],
    speaking: ["recap", "outfits", "witness", "box", "closed"],
    mission: ["box"],
    summary: ["closed"],
    homework: []
  },
  tabs: [
    { key:"s1", label:"1 Previously on…" }, { key:"s2", label:"2 The paper" }, { key:"s3", label:"3 Who wore what?" },
    { key:"s4", label:"4 The night" }, { key:"s5", label:"5 The diary" }, { key:"s6", label:"6 The witness" },
    { key:"s7", label:"7 The final mystery" }, { key:"s8", label:"8 Case closed?" }
  ],

  /* урок повторення: нових слів немає */
  vocab: [],
  receptive: [],
  /* слова Уроку 4 (c2a), які повторюємо */
  recall: ["comfortable", "uncomfortable", "skinny", "loose-fitting", "brand new", "second-hand", "smart", "casual", "trendy", "unfashionable", "well-dressed", "badly-dressed"],

  requires: ["c1a"],
  get characters(){
    const base = (window.SIGNAL_LESSONS.c1a || {}).characters || {};
    return Object.assign({}, base, {
      dad: { name:"Dad", img:"assets/c2b/dad-today.webp", face:{ x:50, y:29 }, look:{ hair:"short", colour:"#1E1612", skin:"#7A4B32", top:"#4D6E9C", mood:"smile" } },
      emma: Object.assign({ name:"Emma", look:{ hair:"long", colour:"#2A1B14", skin:"#E8BA9C", top:"#7048E8", mood:"smile" } }, MEDIA.emma ? { img:MEDIA.emma, face:{ x:50, y:34 } } : {}),
      unknown: { name:"Unknown sender", look:{ hair:"short", colour:"#172033", skin:"#2A3550", top:"#172033" } }
    });
  },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- 8 етапів ---------- */
  stages: [

    /* ========== STAGE 1 · PREVIOUSLY ON… ========== */
    {
      id:"recap", n:1, section:"s1", min:4, type:"warmup",
      title:"Previously on… 🎬",
      hero:{ kicker:"Unit 2 · In fashion · Lesson 6 · Revision", title:"The Secret in the Jacket", emoji:"🧥🔎", tagline:"Four friends. One night. One secret." },
      cards:[
        { id:"photo", k:"Evidence A", t:"The photograph", text:"Dad's old photo: 21 November 1998, “Best night ever.” That night Dad played guitar on stage — for the first time." },
        { id:"jacket", k:"Evidence B", t:"The old jacket", text:"Dad bought a second-hand denim jacket that afternoon. It has a red patch with a white triangle. Marko found a folded piece of paper in one pocket." },
        { id:"msg", k:"Evidence C", t:"The unknown message", text:"“You found the photo. Good job. Find out what was hidden in the jacket.” Who sent it? Nobody knows… yet." }
      ],
      qs:[
        { q:"What did Marko find in the previous lesson?", ua:"Що Марко знайшов на минулому уроці?", ex:"He found out about his dad's best night ever. Then he found a folded piece of paper in Dad's old jacket." },
        { q:"Where did he find the jacket?", ua:"Де він знайшов куртку?", ex:"He found it in the wardrobe at home." },
        { q:"What was inside the pocket?", ua:"Що було в кишені?", ex:"An old, folded piece of paper. Marko didn't open it." },
        { q:"Who sent Marko a message?", ua:"Хто надіслав Марку повідомлення?", ex:"We don't know! It was an unknown sender." },
        { q:"What do you think happened in 1998?", ua:"Як ти думаєш, що сталося в 1998 році?", ex:"I think Dad played guitar on stage, and his friends helped him. But there's a secret — maybe about the jacket." }
      ],
      teacher:"<p><b>4 хв</b>: три картки-докази (учень натискає — картка перевертається) → 5 питань по одному.</p><details><summary>Зразки відповідей</summary><p>1 He found out about Dad's best night ever / an old photo and a folded paper. · 2 In the wardrobe at home. · 3 An old, folded piece of paper. · 4 We don't know — an unknown sender. · 5 Відкрита відповідь.</p><p>Кнопка <b>Sample answer</b> видна лише в Teacher view — показуйте, якщо учень застряг.</p></details><details><summary>Нагадування для вас</summary><p>Учень відповідає в <b>Past Simple</b> — це розминка граматики уроку. Виправляйте м'яко, перефразом: <i>“He find…” → “Yes, he found…”</i>.</p></details>"
    },

    /* ========== STAGE 2 · THE FOLDED PAPER ========== */
    {
      id:"paper", n:2, section:"s2", min:5, type:"reading",
      title:"The Folded Paper 📜",
      story:["Marko looked at the old piece of paper.", "His hands were shaking.", "He slowly unfolded it.", "There were four names on it."],
      plan: PLAN,
      marko:[
        { who:"marko", t:"Dan… that's my dad, Daniel!" },
        { who:"marko", t:"Dad told me about Alex and Emma. But Anna? He never said her name!" },
        { who:"marko", t:"Who was Anna? And why did Dad never talk about her? 🤔" }
      ],
      predict:[
        { q:"Who do you think Anna was?", ua:"Як ти думаєш, хто така Анна?", ex:"I think Anna was Dad's friend. Maybe she was his girlfriend!" },
        { q:"Why wasn't she in Dad's photo?", ua:"Чому її немає на фото тата?", ex:"Maybe she went home early. Or maybe she took the photo!" },
        { q:"What do you think happened that night?", ua:"Як ти думаєш, що сталося того вечора?", ex:"I think something happened between Dad and Anna. Maybe they had an argument." }
      ],
      teacher:"<p><b>5 хв</b>: сюжет (4 рядки) → учень натискає на папірець, і той розгортається → натискає на кожне ім'я → чат Марка → 3 питання-прогнози.</p><details><summary>Що на папірці</summary><p>STYLE PLAN Anna на вечір фестивалю: хто що вдягне. Ім'я <b>Anna</b> сховане під останнім згином — учень відкриває його останнім. Рядок Anna: <i>top secret 🤫</i> — не розкривайте, що вона фотографувала.</p></details><details><summary>Прогнози</summary><p>Не оцінюйте: будь-який прогноз — добре. Запам'ятайте відповідь учня й поверніться до неї в етапі 7: <i>Were you right?</i></p></details>"
    },

    /* ========== STAGE 3 · WHO WORE WHAT? ========== */
    {
      id:"outfits", n:3, section:"s3", min:7, type:"vocabulary",
      title:"Who Wore What? 👕🔎",
      intro:"Marko opens Dad's old diary again. Four small photos fall out. There are no names on the back! Use Anna's style plan to find out who is who.",
      photos:[
        { id:"anna", n:1, cap:"red hoodie, loose jeans, trainers", alt:"Photo 1: a bright red hoodie, loose blue jeans, white trainers with red details and an old phone — a girl's outfit on a bed." },
        { id:"emma", n:2, cap:"colourful dress, comfortable shoes", alt:"Photo 2: a purple dress with little flowers and a yellow belt, and comfortable light trainers." },
        { id:"dan", n:3, cap:"denim jacket, white T-shirt, loose jeans, bucket hat", alt:"Photo 3: a denim jacket with a red patch, a white T-shirt, loose blue jeans, white trainers and a beige bucket hat." },
        { id:"alex", n:4, cap:"black leather jacket, red T-shirt, dark trousers, boots", alt:"Photo 4: a black leather jacket over a red T-shirt, dark trousers and brown boots." }
      ],
      names:["Dan", "Alex", "Emma", "Anna"],
      what:[
        { q:"What did Alex wear?", o:["A black leather jacket.", "A colourful dress.", "A blue denim jacket."], a:0, hint:"Check the style plan again.", why:"Alex wore a black leather jacket and boots.", ua:"Alex був у чорній шкіряній куртці." },
        { q:"What did Anna wear?", o:["A smart blazer.", "A bright red hoodie.", "A bucket hat."], a:1, hint:"Look at photo 1.", why:"Anna wore a bright red hoodie and loose jeans.", ua:"Anna була в яскраво-червоному худі." },
        { q:"What did Emma wear?", o:["Dark trousers and boots.", "Loose jeans and a hoodie.", "A colourful dress and comfortable shoes."], a:2, hint:"Who was the only person in a dress?", why:"Emma wore a colourful dress and comfortable shoes.", ua:"Emma була в яскравій сукні й зручному взутті." },
        { q:"What did Dan wear on his head?", o:["A dark cap.", "A bucket hat.", "Nothing."], a:1, hint:"Remember Dad's photo!", why:"Dan wore a bucket hat — you can see it in his photo.", ua:"Dan був у панамі." }
      ],
      pairs:[
        { a:"comfortable", b:"uncomfortable", ex:"Emma's shoes were comfortable — she danced all night." },
        { a:"skinny", b:"loose-fitting", ex:"Anna's jeans weren't skinny. They were loose-fitting." },
        { a:"brand new", b:"second-hand", ex:"Dan's jacket wasn't brand new. It was second-hand — just £5!" },
        { a:"trendy", b:"unfashionable", ex:"In 1998, a red patch on a denim jacket was really trendy." }
      ],
      speak:{ q:"Which outfit would you wear today? Why?", ua:"Який образ ти вдягнув / вдягнула б сьогодні? Чому?",
        ex:"I'd wear Anna's outfit. A red hoodie and loose jeans are comfortable and casual — perfect for a concert!",
        fu:["Which outfit is too smart for school?", "Which outfit is the most comfortable?", "Would you wear Dan's bucket hat? Why / why not?"] },
      teacher:"<p><b>7 хв</b>: A — назви на фото (2 хв) · B — 4 питання (1 хв) · C — 4 пари протилежностей (2 хв) · говоріння (2 хв) → <b>Evidence #1</b>.</p><details><summary>Відповіді</summary><p>A: 1 Anna · 2 Emma · 3 Dan · 4 Alex.<br>B: 1 A · 2 B · 3 C · 4 B.<br>C: comfortable — uncomfortable · skinny — loose-fitting · brand new — second-hand · trendy — unfashionable.</p></details><details><summary>Простими словами</summary><p><i>We use “wore” for clothes in the past. Wear → wore.</i><br>🇺🇦 Про одяг у минулому кажемо <i>wore</i>: wear → wore.</p></details><details><summary>Говоріння</summary><p><i>I'd wear… = I would wear…</i> — уже знайома фраза, не пояснюйте окремо. Не оцінюйте вибір: просіть <i>Why?</i> і 2–3 прикметники з Уроку 4.</p></details>"
    },

    /* ========== STAGE 4 · REBUILD THE NIGHT ========== */
    {
      id:"night", n:4, section:"s4", min:7, type:"grammar",
      title:"Rebuild the Night ⏳",
      intro:"In Dad's diary there's an old festival programme. Some parts are torn. Put the six events in the right order.",
      night:"Saturday, 21 November 1998",
      programme:{ title:"CITY SOUND", sub:"Festival · Club Stage · Sat 21 Nov 1998", rows:[["7:00 p.m.", "Doors open"], ["10:30 p.m.", "The Rewind — live band"], ["11:00 p.m.", "Open mic — new talent!"], ["12:00 a.m.", "Last song · goodnight!"]], torn:3 },
      notes:[
        "Anna's style plan: “6 p.m. — patch time at my place! 🪡”",
        "Dad's photo: he's happy and his arms are up — the show is over!"
      ],
      events:[
        { id:"a", t:"Anna sewed a red patch on Dan's jacket.", time:"6:00 p.m.", icon:"jacket" },
        { id:"b", t:"Dan and Anna met Alex and Emma outside the festival.", time:"7:00 p.m.", icon:"friends" },
        { id:"c", t:"The four friends watched a band.", time:"10:30 p.m.", icon:"music" },
        { id:"d", t:"Dan and Alex played on stage.", time:"11:00 p.m.", icon:"guitar" },
        { id:"e", t:"Anna took a photo of Dan and Alex.", time:"11:45 p.m.", icon:"camera" },
        { id:"f", t:"Anna gave Dan a small envelope, and the friends left together.", time:"12:00 a.m.", icon:"envelope" }
      ],
      start:["d", "a", "f", "c", "e", "b"],
      check:[
        { q:"Dan ___ his blue jacket to the festival.", o:["wear", "wore", "wearing"], a:1, hint:"Good try! Look at the verb form.", why:"It happened in 1998 — Past Simple: wear → wore.", ua:"Це було в минулому, тому Past Simple: wear → wore." },
        { q:"Anna ___ in the photo because she was behind the camera.", o:["wasn't", "didn't", "weren't"], a:0, hint:"Anna = she. Which form of be?", why:"She → was / wasn't. We don't use didn't with be.", ua:"She → was / wasn't. З дієсловом be не вживаємо didn't." },
        { q:"Where ___ the friends meet?", o:["did", "were", "do"], a:0, hint:"Try again, detective! It's a question about the past.", why:"We use did for questions in Past Simple: Where did they meet?", ua:"Для запитань у Past Simple використовуємо did." },
        { q:"They ___ home before the festival ended.", o:["didn't went", "didn't go", "weren't go"], a:1, hint:"After didn't — which form of the verb?", why:"After did / didn't, use the base form: didn't go.", ua:"Після did / didn't — початкова форма дієслова: didn't go." },
        { q:"Who ___ the photo of Dan and Alex?", o:["took", "take", "did took"], a:0, hint:"Who is the subject here. Do we need did?", why:"Who is the subject, so there's no did: Who took the photo?", ua:"Who тут — підмет (хто зробив дію), тому did не потрібне." }
      ],
      teacher:"<p><b>7 хв</b>: A — таймлайн (4 хв) · B — 5 питань (3 хв) → <b>Evidence #2</b>.</p><details><summary>Таймлайн (ключ)</summary><p>a 6:00 patch → b 7:00 met Alex and Emma → c 10:30 band → d 11:00 stage → e 11:45 photo → f 12:00 envelope, left together.</p><p>Логіка: нашивка — до фестивалю (нотатка Anna «6 p.m.»); зустрілися, коли відчинилися двері (7:00); гурт — 10:30, open mic — 11:00 (програма); фото тата — <i>після</i> виступу (руки вгору); конверт — наприкінці. Рядок програми о 12:00 відірваний — учень здогадується.</p></details><details><summary>Граматика (ключ)</summary><p>1 wore · 2 wasn't · 3 did · 4 didn't go · 5 took.</p></details><details><summary>Розповідь (усно, за бажанням)</summary><p>Попросіть розповісти ніч, з'єднуючи події: <i>First… Then… After that… Finally…</i></p></details>"
    },

    /* ========== STAGE 5 · THE MISSING PERSON ========== */
    {
      id:"diary", n:5, section:"s5", min:7, type:"reading",
      title:"The Missing Person 📖",
      intro:"Behind the last page of Dad's diary, Marko finds one more page. Dad wrote it the next day.",
      date:"Sunday, 22 November 1998",
      lines:[
        { t:"Yesterday was one of the best days of my life.", ua:"Учора був один із найкращих днів мого життя." },
        { t:"My friends and I went to the City Sound Festival.", ua:"Ми з друзями пішли на фестиваль City Sound.", key:true },
        { t:"Alex wore his favourite black leather jacket, and Emma looked amazing in her colourful dress.", ua:"Alex був у своїй улюбленій чорній шкіряній куртці, а Emma чудово виглядала у своїй яскравій сукні.", key:true },
        { t:"Anna helped me with my outfit. She sewed a red patch on my denim jacket — her own design.", ua:"Anna допомогла мені з образом. Вона пришила червону нашивку на мою джинсову куртку — це її власний дизайн.", key:true },
        { t:"We laughed, listened to music and took lots of photos.", ua:"Ми сміялися, слухали музику й багато фотографували." },
        { t:"But Anna wasn't in most of the pictures. She was always behind the camera.", ua:"Але Anna не було на більшості фото. Вона завжди була за камерою.", key:true },
        { t:"At the end of the night, she gave me a small envelope. “Don't open it tonight,” she said.", ua:"Наприкінці вечора вона дала мені маленький конверт. «Не відкривай його сьогодні», — сказала вона.", key:true },
        { t:"I put it inside my jacket because I didn't want to lose it.", ua:"Я поклав його всередину куртки, бо не хотів загубити.", key:true },
        { t:"I'll never forget that night.", ua:"Я ніколи не забуду той вечір." }
      ],
      gloss:[["sewed (sew)", "пришила"], ["patch", "нашивка"], ["design", "дизайн, задум"], ["envelope", "конверт"], ["behind the camera", "за камерою"]],
      qs:[
        { kind:"mcq", q:"When did the festival take place?", o:["On Saturday, 21 November 1998.", "On Sunday, 22 November 1998.", "In summer 1998."], a:0, hint:"Dad wrote the page on Sunday. When was “yesterday”?", why:"Dad wrote the page on Sunday. The festival was “yesterday” — Saturday, 21 November.", ua:"Тато писав у неділю, а фестиваль був «учора» — у суботу, 21 листопада." },
        { kind:"text", id:"q2", q:"What did Alex wear?", answer:"A black leather jacket.", accept:[/^(he wore )?(a |his )?(favourite )?(black )?leather jacket$/, /black leather jacket/], hint:"Find Alex in sentence 3.", why:"Alex wore his favourite black leather jacket." },
        { kind:"text", id:"q3", q:"Who helped Dan with his outfit?", answer:"Anna.", accept:[/^(it was )?anna( did| helped him)?$/, /^anna\b/], hint:"Look at sentence 4.", why:"Anna helped him — she sewed the red patch." },
        { kind:"mcq", q:"Why wasn't Anna in most of the photos?", o:["She left the festival early.", "She was behind the camera.", "She didn't like her outfit."], a:1, hint:"Read sentence 6 again.", why:"She was always behind the camera — she took the photos!", ua:"Вона завжди була за камерою — це вона фотографувала!" },
        { kind:"mcq", q:"What did Dan put inside his jacket?", o:["A concert ticket.", "Something important from Anna — a small envelope.", "Anna's camera."], a:1, hint:"Sentences 7 and 8.", why:"Something important from Anna — a small envelope. But what was inside? We don't know yet…", ua:"Щось важливе від Anna — маленький конверт. А що в ньому — поки невідомо." }
      ],
      teacher:"<p><b>7 хв</b>: читання (3 хв) — учень натискає на речення з важливими деталями · питання (4 хв) → <b>Evidence #3</b>.</p><details><summary>Важливі речення</summary><p>2, 3, 4, 6, 7, 8 — лічильник «important details» рахує саме їх. Переклад кожного речення — кнопка 🇺🇦 поруч із ним (видно всім, натискайте, коли треба).</p></details><details><summary>Відповіді</summary><p>1 A (On Saturday, 21 November 1998) · 2 A black leather jacket · 3 Anna · 4 B · 5 B (something important from Anna — a small envelope).</p><p>⚠️ Що в конверті — ще не кажемо: це фінал етапу 7.</p></details>"
    },

    /* ========== STAGE 6 · QUESTION THE WITNESS ========== */
    {
      id:"witness", n:6, section:"s6", min:8, type:"speaking",
      title:"Question the Witness 🎤",
      intro:"Marko finds Emma online and sends her a message. She remembers the festival very well!",
      build:[
        { id:"b1", tiles:["you", "did", "meet", "where", "Anna"], answer:"Where did you meet Anna?" },
        { id:"b2", tiles:["what", "Dan", "did", "wear"], answer:"What did Dan wear?" },
        { id:"b3", tiles:["Anna", "did", "why", "take", "the photos"], answer:"Why did Anna take the photos?" },
        { id:"b4", tiles:["you", "were", "happy", "that night"], answer:"Were you happy that night?" }
      ],
      buildHint:"Question word → did → person → verb. With be: Were + person…?",
      buildUa:"Питальне слово → did → хто → дієслово. З be: Were + хто…?",
      open:[
        { sys:"Sunday · 20:41" },
        { who:"marko", me:true, t:"Hi! I'm Marko, Dan's son. Can I ask you about City Sound in 1998?" },
        { who:"emma", t:"Dan's son?! Of course! Wow… I remember that night very well. 😊" }
      ],
      talk:[
        { id:"t1", q:"Where did you meet Anna?", a:"At school. We were in the same class. She loved photography and fashion — she made amazing things!" },
        { id:"t2", q:"What did Dan wear?", a:"His new denim jacket! Anna sewed a red patch on it. It was her own design." },
        { id:"t3", q:"Why did Anna take the photos?", a:"She loved photography. She wanted to remember every special moment." },
        { id:"t4", q:"Were you happy that night?", a:"Very happy! Dan was so nervous before the show… but he played really well." },
        { id:"t5", q:"Who took the photo of Dan and Alex?", a:"Anna, of course! I gave her my camera. She took photos all night." },
        { id:"t6", q:"Did Anna leave early?", a:"No, she stayed with us until the end." },
        { id:"t7", q:"What did Anna give Dan?", a:"I remember a small envelope, but I never saw what was inside." },
        { id:"t8", q:"Why didn't Dad tell me about Anna?", key:true, a:"Oh… A week after the festival, Anna's family moved to Canada. We wrote letters for a few months, but then we lost touch. Dan missed her a lot. It was hard for him to talk about her." }
      ],
      need:5,
      next:{ q:"What question would you ask Emma next?", ua:"Яке питання ти поставив / поставила б Emma далі?",
        ideas:["What was Anna like?", "Do you still have photos from that night?", "Where is Anna now?"],
        ex:"What was Anna like? — She was funny and creative. She always had her camera with her." },
      teacher:"<p><b>8 хв</b>: A — скласти 4 питання з плиток (3 хв) · B — інтерв'ю в чаті (4 хв) · питання від учня (1 хв) → <b>Evidence #4</b>.</p><details><summary>Питання (ключ)</summary><p>1 Where did you meet Anna? · 2 What did Dan wear? · 3 Why did Anna take the photos? · 4 Were you happy that night?</p></details><details><summary>Інтерв'ю</summary><ul><li>Учень обирає питання й <b>читає його вголос</b>, потім натискає — Emma «друкує» відповідь. Доказ #4 відкривається після 5 питань.</li><li>Головне питання — <b>★ Why didn't Dad tell me about Anna?</b> Якщо учень його не обере, підкажіть: <i>What does Marko really want to know?</i></li><li>Останнє завдання — <i>What question would you ask Emma next?</i> Ви відповідаєте як Emma. Факти: Anna — весела, творча, завжди з камерою; фото того вечора здебільшого в Anna; де Anna зараз — Emma не знає 🤷‍♀️ (не вигадуйте відповідь — це може знадобитися історії пізніше).</li></ul></details>"
    },

    /* ========== STAGE 7 · THE FINAL MYSTERY ========== */
    {
      id:"box", n:7, section:"s7", min:15, type:"mission",
      title:"The Final Mystery 🔐",
      intro:"Marko shows Dad everything. Dad is quiet for a long time. Then he takes a small metal box from the top of the wardrobe.",
      dad:[
        { who:"dad", t:"You found out about Anna. I'm sorry I didn't tell you, Marko. It was hard to talk about her." },
        { who:"dad", t:"Her envelope is in this box. I know the code — but you're the detective. 🙂" },
        { who:"dad", t:"Pass three tests, and you'll find the three numbers." }
      ],
      fashion:{
        digit:4, title:"Challenge 1 · The Fashion Code", icon:"👕",
        items:[
          { look:"anna", q:"Anna's hoodie was bright red, and her jeans were ___.", o:["skinny", "loose-fitting", "smart"], a:1, hint:"Check the evidence again: “loose jeans”.", why:"Her jeans were loose-fitting — loose, not skinny.", ua:"loose-fitting — вільні, не облягають." },
          { look:"jacket", q:"Dan's jacket wasn't brand new. It was ___.", o:["second-hand", "trendy", "uncomfortable"], a:0, hint:"Remember: Dad paid £5 for it.", why:"It was second-hand — another person had it before.", ua:"second-hand — вживана, хтось носив її раніше." },
          { look:"emma", q:"Emma danced all night. Her shoes were really ___.", o:["uncomfortable", "comfortable", "badly-dressed"], a:1, hint:"Could you dance all night in uncomfortable shoes?", why:"Comfortable shoes — perfect for dancing.", ua:"comfortable — зручні." }
        ]
      },
      grammar:{
        digit:9, title:"Challenge 2 · The Past Simple Code", icon:"⏳",
        items:[
          { id:"g1", wrong:"Emma didn't took the photo.", answer:"Emma didn't take the photo.", accept:[/^emma didn't take (the|that|this) (photo|photograph|picture)$/],
            hints:[{ re:/took/, t:"After didn't, use the base form: take." }], why:"didn't + base form: didn't take." },
          { id:"g2", wrong:"Dan wear a denim jacket to the festival.", answer:"Dan wore a denim jacket to the festival.", accept:[/^dan wore (a|his) (blue )?(new )?denim jacket( to the (festival|concert))?$/],
            hints:[{ re:/\bwears?\b|\bweared\b/, t:"Wear is irregular. Check the 📖 verb list." }], why:"It happened in 1998: wear → wore." },
          { id:"g3", wrong:"Where did they went after the show?", answer:"Where did they go after the show?", accept:[/^where did they go( after the (show|festival|concert))?$/],
            hints:[{ re:/went/, t:"After did, use the base form: go." }], why:"did + base form: Where did they go?" }
        ]
      },
      evidence:{
        digit:8, title:"Challenge 3 · The Final Evidence", icon:"📸",
        q:{ q:"Look at Dad's photo again. Why wasn't Anna in the photograph?", o:["She left the festival early.", "She was taking the photograph.", "She didn't like her outfit."], a:1, hint:"Think about Emma's testimony.", why:"She was taking the photograph — with Emma's camera!", ua:"Вона фотографувала — камерою Emma!" },
        after:{ who:"marko", t:"So the “girl from the crowd” was Anna! 🤯" }
      },
      codeNote:"4 friends · '98",
      letter:{
        to:"Dear Dan,",
        lines:[
          "I made this jacket special because I wanted you to remember our friendship.",
          "You were nervous before the concert, but you did an amazing job. I was so proud of you.",
          "Next week my family is moving to Canada. I didn't know how to say goodbye — so I wrote this letter.",
          "This jacket isn't just about fashion. It's about the people who were there for you.",
          "Never forget that night."
        ],
        sign:["Your friend,", "Anna 📸"],
        ps:"P.S. Look at the patch again. The white triangle is an A — A for Anna. 🙂",
        photoBack:"City Sound · 21.11.98 · Dan, Alex, Emma & me! (Emma's camera timer 😄)"
      },
      truth:[
        "Anna designed the patch and photographed the whole night.",
        "She was an important part of the group — but she was almost never in the photos.",
        "The jacket is about friendship, memories and the people who support us."
      ],
      marko:[
        { who:"marko", t:"So that was the secret…" },
        { who:"marko", t:"The jacket wasn't special because it was fashionable." },
        { who:"marko", t:"It was special because of the memories. ❤️" }
      ],
      final:[
        { q:"Why was the jacket important?", ua:"Чому куртка була важливою?", ex:"Because Anna made it special. It reminded Dad of his friends and of that night." },
        { q:"Who was Anna?", ua:"Хто така Anna?", ex:"She was Dad's friend. She planned the outfits, sewed the patch and took the photos." },
        { q:"What did she do for Daniel?", ua:"Що вона зробила для Даніеля?", ex:"She sewed a red patch on his jacket, took photos of him and wrote him a letter." },
        { q:"What did Marko learn?", ua:"Що зрозумів Марко?", ex:"He learned that the jacket is about friendship and memories, not just fashion." },
        { q:"Do you have an object that reminds you of someone special?", ua:"У тебе є річ, яка нагадує тобі про особливу людину?", ex:"Yes. I have a bracelet from my best friend. She gave it to me before she moved to another city." }
      ],
      teacher:"<p><b>15 хв</b>: дошка доказів + тато (1 хв) · три випробування (6 хв) · кодовий замок (1 хв) · конверт → фото → лист (3 хв) · 5 питань (4 хв).</p><details><summary>Код і цифри</summary><p>Challenge 1 → <b>4</b> · Challenge 2 → <b>9</b> · Challenge 3 → <b>8</b>. Код <b>498</b> = <i>four friends, '98</i>.</p></details><details><summary>Відповіді</summary><p>1: loose-fitting · second-hand · comfortable.<br>2: Emma didn't take the photo. · Dan wore a denim jacket to the festival. · Where did they go after the show?<br>3: B — She was taking the photograph. (Was taking — лише впізнати, не пояснювати.)</p></details><details><summary>Простими словами</summary><p><i>After did / didn't, use the base form.</i> — 🇺🇦 Після did / didn't — початкова форма дієслова.<br><i>We use did for questions in Past Simple.</i> — 🇺🇦 Для запитань у Past Simple використовуємо did.</p></details><details><summary>Лист</summary><p>Учень читає лист уголос (або ви). <i>is moving</i> — Present Continuous для планів (знайома форма з Unit 1), не пояснюйте окремо. Поверніться до прогнозів етапу 2: <i>Were you right about Anna?</i></p></details>"
    },

    /* ========== STAGE 8 · CASE CLOSED? ========== */
    {
      id:"closed", n:8, section:"s8", min:7, type:"cliffhanger",
      title:"Case Closed? 🏆",
      story:{
        scene:"Marko looks at the photo of the four friends for a long time.",
        buzz:"His phone vibrates again.",
        msgs1:[{ who:"unknown", t:"You found the truth." }, { who:"unknown", t:"Some things never go out of fashion." }, { who:"unknown", t:"Friendship is one of them. ❤️" }],
        smile:"Marko smiles.",
        more:"But then another message arrives.",
        msgs2:[{ who:"unknown", t:"Now it's time to discover your own story." }, { who:"unknown", t:"Are you ready?" }],
        marko:{ who:"marko", t:"My own story? What does that mean?!" }
      },
      recap:[
        { q:"What new things did you discover?", ex:"I discovered that Anna was the fourth friend and that she took the photo." },
        { q:"What did you learn about Marko's family?", ex:"I learned that Marko's dad had a friend called Anna. She moved to Canada." },
        { q:"Which part of the investigation was your favourite?", ex:"My favourite part was the lock. I found the code 498!" },
        { q:"Can you describe what happened in 1998? Use the Past Simple.", ex:"Anna sewed a patch on Dan's jacket. They went to a festival. Dan played on stage, and Anna took a photo." }
      ],
      mini:[
        { id:"m1", q:"Name three items of clothing.", ph:"jeans, …", kind:"clothes" },
        { id:"m2", q:"Write one sentence in the Past Simple.", ph:"Yesterday I…", kind:"past" },
        { id:"m3", q:"Ask one Past Simple question.", ph:"Did you…?", kind:"question" }
      ],
      learned:["Describe outfits with clothes and opposite adjectives.", "Use the Past Simple: + / − / ?.", "Ask questions with did, was and were.", "Find key details in a text.", "Put events in order and tell a story.", "Explain your ideas in simple English."],
      next:{ k:"NEXT: UNIT 3 — MY WAY OF LIFE", title:"Generation Swap", lines:["The mystery of the past is solved.", "But Marko's own story is just beginning…"] },
      teacher:"<p><b>7 хв</b>: фінал історії (2 хв) · підсумок і міні-виклик (3 хв) · нагорода й сертифікат (2 хв).</p><details><summary>Міні-виклик</summary><p>Автоперевірка м'яка: 1 — три слова з теми «одяг»; 2 — речення з дієсловом у Past Simple; 3 — питання з did / was / were (або Who + дієслово в Past Simple) і знаком «?». Якщо учень сказав усно — натисніть <b>🗣 Said it</b>.</p></details><details><summary>Невідомий відправник</summary><p>Хто це — <b>не розкриваємо</b>. Спитайте: <i>Who do you think it is? Anna? Emma? Dad?</i> Наступний серіал (Unit 3 · Generation Swap): Марко три дні живе, як підліток 1985 року — без телефону.</p></details><details><summary>Сертифікат</summary><p>Ім'я підставляється з Inkwell — його можна змінити в полі. Кнопка 🖨 друкує лише сертифікат (або збережіть як PDF).</p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/secret.js) ---------- */
  screens(add, st){
    const r = st("recap");
    add(r, "sjRecap", { key:"cards", store:"cards", hero:r.hero, cards:r.cards });
    add(r, "sjQuestions", { key:"qs", store:"qs", qs:r.qs, end:"THE STORY CONTINUES…", cta:"Continue the investigation →" });

    const p = st("paper");
    add(p, "sjPaper", { key:"paper", store:"paper", story:p.story, plan:p.plan, marko:p.marko });
    add(p, "sjQuestions", { key:"predict", store:"predict", qs:p.predict, title:"What do you think? 🤔", intro:"Make your predictions. There are no wrong answers — yet!", cta:"Open the case file →", note:true });

    const o = st("outfits");
    add(o, "sjMatch", { key:"match", store:"match", photos:o.photos, names:o.names, intro:o.intro }, o.photos.map(x => x.n + " " + x.id.charAt(0).toUpperCase() + x.id.slice(1)).join(" · "));
    add(o, "sjMcqSet", { key:"what", store:"what", qs:o.what, title:"What did they wear?", intro:"Answer from the evidence. Use the style plan if you need help.", plan:true, cta:"Opposites →" }, "1 A · 2 B · 3 C · 4 B");
    add(o, "sjPairs", { key:"pairs", store:"pairs", pairs:o.pairs }, o.pairs.map(x => x.a + " — " + x.b).join(" · "));
    add(o, "sjSpeak", { key:"wear", store:"wear", speak:o.speak, evidence:1, looks:true, cta:"Rebuild the night →" }, o.speak.ex);

    const n = st("night");
    add(n, "sjTimeline", { key:"tl", store:"tl", events:n.events, start:n.start, programme:n.programme, notes:n.notes, night:n.night, intro:n.intro },
      n.events.map(x => x.time + " " + x.t).join(" → "));
    add(n, "sjMcqSet", { key:"check", store:"check", qs:n.check, title:"Past Simple Detective 🔍", intro:"Five questions about the night. Choose the correct form.", evidence:2, cta:"Read Dad's diary →" }, "1 wore · 2 wasn't · 3 did · 4 didn't go · 5 took");

    const d = st("diary");
    add(d, "sjDiary", { key:"read", store:"read", date:d.date, lines:d.lines, gloss:d.gloss, intro:d.intro });
    add(d, "sjDiaryQs", { key:"qs", store:"qs", qs:d.qs, lines:d.lines, date:d.date, evidence:3 }, "1 A · 2 A black leather jacket · 3 Anna · 4 B · 5 B");

    const w = st("witness");
    add(w, "sjBuild", { key:"build", store:"build", items:w.build, hint:w.buildHint, ua:w.buildUa, intro:w.intro }, w.build.map((x, k) => (k + 1) + " " + x.answer).join(" · "));
    add(w, "sjInterview", { key:"chat", store:"chat", open:w.open, talk:w.talk, need:w.need, next:w.next, evidence:4 }, "★ Why didn't Dad tell me about Anna? — Anna's family moved to Canada.");

    const b = st("box");
    add(b, "sjBoard", { key:"board", store:"board", dad:b.dad, intro:b.intro });
    add(b, "sjFashionCode", { key:"c1", store:"c1", ch:b.fashion }, "loose-fitting · second-hand · comfortable → 4");
    add(b, "sjGrammarCode", { key:"c2", store:"c2", ch:b.grammar }, b.grammar.items.map(x => x.answer).join(" · ") + " → 9");
    add(b, "sjEvidenceCode", { key:"c3", store:"c3", ch:b.evidence }, "B — She was taking the photograph. → 8");
    add(b, "sjLock", { key:"lock", store:"lock", note:b.codeNote }, "498 (four friends, '98)");
    add(b, "sjReveal", { key:"reveal", store:"reveal", letter:b.letter, truth:b.truth, marko:b.marko });
    add(b, "sjQuestions", { key:"final", store:"final", qs:b.final, title:"Think about it 💬", intro:"Answer out loud. Use the Past Simple when you talk about Anna and Dan.", cta:"Case closed? →" });

    const c = st("closed");
    add(c, "sjEnding", Object.assign({ key:"end", store:"end" }, c.story));
    add(c, "sjMission", { key:"mission", store:"mission", recap:c.recap, mini:c.mini, learned:c.learned });
    add(c, "sjCertificate", { key:"cert", store:"cert", next:c.next });
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const c = (ans && ans._case) || {};
    const ev = Object.keys(c.ev || {}).length;
    const tl = ans.night && ans.night.tl;
    const asked = Object.keys((ans.witness && ans.witness.chat && ans.witness.chat.asked) || {}).length;
    const opened = ans.box && ans.box.lock && ans.box.lock.open;
    return {
      icon:"🧥", title:"Lesson 6 complete — Fashion Detective",
      text:"You found the secret in the jacket: Anna, the fourth friend behind the camera. But the unknown sender has a new message for Marko…",
      stats:[
        [`🗂 ${ev} / 4`, "pieces of evidence"],
        [`⏳ ${tl && tl.solved ? (tl.tries <= 1 ? "first try" : tl.tries + " tries") : "—"}`, "1998 timeline"],
        [`🎤 ${asked} / 8`, "questions for Emma"],
        [`🔐 ${opened ? "498" : "—"}`, "box code"]
      ]
    };
  }
};
})();
