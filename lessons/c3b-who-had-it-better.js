/* ============================================================
   LESSON 8 · Cycle 3B · WHO HAD IT BETTER? 📼 vs 📱 — The Teenage Time Challenge
   Unit 3 · My way of life — Understand (grammar + reading + listening + speaking).
   Формат — урок один на один (учень + учитель, демонстрація екрана), 55–60 хв, 7 місій
   + необов'язкова гра «Generation Battle» (5–8 хв, поза основним часом).
   Граматика: comparatives · superlatives · (not) as … as · too + adj · adj + enough.

   ФАКТИ ІСТОРІЇ (узгоджені з Уроками 4–7):
   • Тато = Dan (Daniel), у 1998 році йому 17. Марку 14. Друзі 1998 року — Emma, Alex і Anna.
   • 21.11.1998 — концерт City Sound (Урок 5–6). Anna за тиждень після нього переїхала до Канади.
   • Урок 7 закінчився тим, що тато прочитав свій лист 1998 року й сказав: «Нам жилося легше».
     Урок 8 починається з його повідомлення — і виклику Маркові: знайти докази.
   • Щоденник тата (Місія 4) датовано 7 листопада 1998 — за два тижні до City Sound, коли Anna ще
     була в місті. Дівчину, яку Dan кличе в кіно, він називає лише «A.» — свідомо не розкриваємо.
   • Фінал: «Check the last page of my diary. And whatever you do, don't show it to Mum yet.»
     Що на останній сторінці — таємниця Уроку 9. Тут не розкриваємо.

   Екрани — з js/screens/generation.js, тема — css/generation.css (body[data-episode-theme="generation"]).
   Порядок екранів — у функції screens() в кінці файлу.

   КАРТИНКИ (необов'язкові). Поки поле null — показується намальована заміна, урок працює й так.
   Згенеруйте файл, покладіть у папку c3b всередині assets і впишіть шлях у MEDIA нижче.
   Підказки для генерації — у README.md, розділ «Урок 8».
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- картинки (null = намальована заміна) ---------- */
const MEDIA = {
  /* з Уроків 5–7 — уже на місці */
  photo: "assets/c2b/photo-1998.webp",
  photoAlt: "Dad's old concert photo from 21 November 1998: a smiling teenage boy in a denim jacket with his arms in the air.",
  /* Місія 2: та сама картинка «1998 vs 2026», що й в Уроці 7 (≈2,44:1). Урок показує її половинами:
     ліва — кімната 1998, права — кімната 2026. Точки — у відсотках від ширини й висоти ПОЛОВИНИ.
     s — куди відкривається підпис: "r" (типово), "l", "t", "b". */
  rooms: {
    src: "assets/c3a/rooms-1998-2026.webp",
    alt98: "Dan's bedroom in 1998: warm orange light, an old computer with a big monitor, a home phone with a cord, a film camera, CDs and cassettes, a concert poster, printed photos, a speaker, an electric guitar and magazines on the floor.",
    alt26: "Marko's bedroom in 2026: blue and purple LED light, a laptop, music streaming on a big screen, a smartphone on a wireless charger, wireless headphones, social media notifications, a hoodie and a game controller.",
    y98: [
      { id:"poster", x:22.6, y:10.3, t:"a concert poster", s:"b" },
      { id:"photos", x:43.6, y:13.5, t:"printed photos" },
      { id:"speaker", x:76.0, y:9.1, t:"a stereo speaker", s:"l" },
      { id:"computer", x:30.0, y:30.8, t:"a huge computer" },
      { id:"tapes", x:5.0, y:35.2, t:"cassette tapes" },
      { id:"camera", x:49.0, y:39.1, t:"a film camera", s:"b" },
      { id:"phone", x:58.4, y:40.6, t:"a home phone" },
      { id:"cds", x:68.2, y:36.5, t:"CDs", s:"t" },
      { id:"jacket", x:49.8, y:58.2, t:"Dad's denim jacket" },
      { id:"guitar", x:77.2, y:58.2, t:"an electric guitar", s:"l" },
      { id:"mags", x:49.8, y:86.1, t:"magazines", s:"t" }
    ],
    y26: [
      { id:"led", x:17.6, y:20.6, t:"LED lights", s:"b" },
      { id:"stream", x:45.6, y:18.6, t:"music streaming", s:"b" },
      { id:"social", x:74.6, y:13.3, t:"social media", s:"b" },
      { id:"laptop", x:35.8, y:35.5, t:"a laptop", s:"b" },
      { id:"charger", x:56.6, y:35.0, t:"a wireless charger", s:"t" },
      { id:"phone", x:63.4, y:36.5, t:"a smartphone", s:"r" },
      { id:"phones", x:78.6, y:40.4, t:"wireless headphones", s:"b" },
      { id:"hoodie", x:14.8, y:58.2, t:"a hoodie" },
      { id:"pad", x:83.4, y:68.7, t:"a game controller", s:"l" }
    ]
  },
  /* нові для Уроку 8 */
  box: "assets/c3b/box-1998.webp",          /* стара коробка тата: фото, сторінки щоденника, касета (≈1,45:1) */
  brick: "assets/c3b/brick-phone.webp",     /* старий мобільний телефон 1998 року на столі (1:1) */
  diary: null,         /* розворот старого щоденника з квитком у кіно (≈4:3) — фон заголовка щоденника */
  sort: {              /* 6 фото для Time Sort (4:3) */
    cassette:"assets/c3b/sort-cassette.webp", stream:"assets/c3b/sort-stream.webp", map:"assets/c3b/sort-map.webp",
    share:"assets/c3b/sort-share.webp", music:"assets/c3b/sort-music.webp", park:"assets/c3b/sort-park.webp"
  }
};

/* ---------- 10 слів уроку (контекстна лексика) ---------- */
const WORDS = [
  { w:"freedom", ua:"свобода", en:"being able to do what you want", ex:"Teenagers in 1998 had a lot of freedom after school." },
  { w:"independence", ua:"незалежність", en:"being able to look after yourself without help", ex:"Getting a job gives you more independence." },
  { w:"communication", ua:"спілкування, зв'язок", en:"the ways people share information", ex:"Communication is much faster today." },
  { w:"entertainment", ua:"розваги", en:"films, music, games and shows that people enjoy", ex:"There are more entertainment choices now." },
  { w:"technology", ua:"технології", en:"machines and devices made with science", ex:"Technology changes very quickly." },
  { w:"opportunities", ua:"можливості", en:"chances to do something good", ex:"There are more opportunities to learn online." },
  { w:"convenient", ua:"зручний", en:"easy to use; saves time", ex:"Streaming is more convenient than waiting for a TV show." },
  { w:"distracting", ua:"який відволікає", en:"taking your attention away from what you're doing", ex:"Notifications are very distracting." },
  { w:"patient", ua:"терплячий", en:"able to wait calmly", ex:"In 1998, you had to be patient." },
  { w:"connected", ua:"на зв'язку, підключений", en:"able to talk to people or use the internet", ex:"Teenagers today are always connected." }
];

/* ---------- Evidence Board: 5 категорій ---------- */
const EVIDENCE = [
  { id:"tech", n:"01", cat:"Technology & everyday life", icon:"chip", from:"Mission 2",
    y98:"Your family had one huge computer. Your photos took a week to print.",
    y26:"You carry a computer, a camera and a map in your pocket.",
    q:"Was everyday life easier in 1998 or in 2026? Why?", ua:"Повсякденне життя було легшим у 1998 чи у 2026 році? Чому?",
    starters:["Everyday life is easier today because…", "Phones are smaller and … than old computers.", "In 1998, life was slower, but…"],
    ex:"Everyday life is easier today because phones are smaller and more useful than old computers." },
  { id:"fun", n:"02", cat:"Entertainment", icon:"tv", from:"Mission 3",
    y98:"You had to wait for your favourite TV programme — and you couldn't pause it.",
    y26:"You can watch almost anything whenever you want.",
    q:"Which generation had more convenient entertainment?", ua:"Яке покоління мало зручніші розваги?",
    starters:["Entertainment is more convenient today because…", "Waiting for a show was more exciting than…", "In 1998, TV wasn't as … as streaming."],
    ex:"Entertainment is more convenient today, but waiting for a show was more exciting." },
  { id:"talk", n:"03", cat:"Communication", icon:"phone", from:"Mission 4",
    y98:"To call a friend, you phoned their house — and their dad could answer!",
    y26:"You can message a friend anywhere, any time, in seconds.",
    q:"Was communication in 1998 as easy as it is today?", ua:"Чи було спілкування в 1998 році таким же легким, як сьогодні?",
    starters:["No, it wasn't as easy as…", "Communication is faster today, but…", "Calling someone's house was more stressful than…"],
    ex:"No, it wasn't as easy as today. Calling someone's house was more stressful than sending a message." },
  { id:"friends", n:"04", cat:"Friendship", icon:"heart", from:"Mission 5",
    y98:"Friends met face to face. You just knocked on their door.",
    y26:"Friends chat every day — even when they live in different countries.",
    q:"Were friendships stronger in 1998, or are they just different?", ua:"Дружба була міцнішою в 1998 році чи просто іншою?",
    starters:["Friendships were just as important then as…", "Face-to-face friendships are closer than…", "Today it's easier to stay connected with…"],
    ex:"Friendships were just as important then as they are now — they're just different." },
  { id:"free", n:"05", cat:"Freedom & independence", icon:"key", from:"Mission 5",
    y98:"Teenagers went out after school, and parents couldn't call them.",
    y26:"Teenagers can go anywhere with GPS — but parents can always check where they are.",
    q:"Who had more freedom: teenagers in 1998 or teenagers today?", ua:"Хто мав більше свободи: підлітки 1998 року чи сучасні?",
    starters:["Teenagers in 1998 had more freedom because…", "Today, teenagers are safer, but they aren't as free as…", "Parents can always check where we are, so…"],
    ex:"I think teenagers in 1998 had more freedom, but teenagers today are safer." }
];
/* особливий доказ зі щоденника */
const EXHIBIT = { t:"SURPRISE FINDING", s:"Dad's teenage life wasn't always as easy as he says.", q:"Dad says life was simpler. His diary says it was “the worst day of my life”. What do you think now?",
  ua:"Тато каже, що життя було простішим. А в щоденнику пише «найгірший день у моєму житті». Що ти думаєш тепер?" };

window.SIGNAL_LESSONS.c3b = {
  id: "c3b",
  cycle: 3,
  lessonType: "understand-story",
  theme: "generation",
  title: "Who Had It Better?",
  fullTitle: "Who Had It Better? — The Teenage Time Challenge",
  subtitle: "Unit 3 · My way of life · Lesson 8",
  series: "Generation Swap",
  tagline: "1998 vs 2026. Two generations. One verdict.",
  question: "Who had it better — teenagers in 1998 or teenagers in 2026?",
  minutes: 58,
  number: 8,
  setting: "Two days after Lesson 7. Dad has read his old letter and has an opinion about teenage life.",
  media: MEDIA,
  words: WORDS,
  evidence: EVIDENCE,
  exhibit: EXHIBIT,

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["message"],
    vocabPresentation: ["thennow"],
    discoveryGuide: ["lab"],
    vocabPractice: ["thennow"],
    grammar: ["lab"],
    grammarPractice: ["lab", "diary"],
    listening: ["voices"],
    reading: ["diary"],
    speaking: ["message", "thennow", "diary", "voices", "debate", "verdict", "bonus"],
    mission: ["debate"],
    summary: ["verdict"],
    homework: []
  },
  tabs: [
    { key:"s1", label:"1 The Message" }, { key:"s2", label:"2 Then vs Now" }, { key:"s3", label:"3 Comparison Lab" },
    { key:"s4", label:"4 Dad's Diary" }, { key:"s5", label:"5 Two Opinions" }, { key:"s6", label:"6 The Debate" },
    { key:"s7", label:"7 Final Verdict" }, { key:"s8", label:"⚡ Bonus" }
  ],

  /* нові слова — потрапляють у My words */
  vocab: WORDS.map(x => ({ w:x.w, ipa:"", ua:x.ua, en:x.en, ex:x.ex, g:"gen" })),
  receptive: [],

  requires: ["c1a"],
  get characters(){
    const base = (window.SIGNAL_LESSONS.c1a || {}).characters || {};
    return Object.assign({}, base, {
      dad: { name:"Dad", img:"assets/c2b/dad-today.webp", face:{ x:50, y:29 }, look:{ hair:"short", colour:"#1E1612", skin:"#7A4B32", top:"#4D6E9C", mood:"smile" } }
    });
  },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- 7 місій + бонус ---------- */
  stages: [

    /* ========== MISSION 1 · THE MESSAGE 📩 ========== */
    {
      id:"message", n:1, section:"s1", min:5, type:"warmup", emoji:"📩",
      title:"The Message",
      scene:"Saturday evening. Marko is in his bedroom, looking at Dad's old photo from 1998…",
      chat:[
        { sys:"Saturday · 18:12" },
        { who:"dad", t:"Marko, you think your generation has everything. But believe me, life was much simpler when I was your age. We had fewer things, but we had more fun!" },
        { who:"marko", me:true, t:"Seriously, Dad? No smartphones, no streaming, no Google? How was that better? 😭" },
        { who:"dad", t:"OK, detective. Here's a challenge. 😎" },
        { who:"dad", t:"Compare teenage life in 1998 and 2026. Find real evidence. Then tell me who had it better." },
        { who:"marko", me:true, t:"Challenge accepted. 🔎" }
      ],
      partner:"I need a detective partner for this. Are you in?",
      qs:[
        { q:"Do you think life was easier in 1998 or in 2026?", ua:"Як ти думаєш, життя було легшим у 1998 чи у 2026 році?",
          starter:"I think life was easier in … because…", ex:"I think life was easier in 1998 because there was no pressure from social media.",
          fu:["What was easier then? What is easier now?"] },
        { q:"What is the best thing about being a teenager today?", ua:"Що найкраще в тому, щоб бути підлітком сьогодні?",
          starter:"The best thing about being a teenager today is…", ex:"The best thing is that I can talk to my friends any time.",
          fu:["And what's the worst thing?"] },
        { q:"What would be the hardest thing about living without a smartphone?", ua:"Що було б найважчим у житті без смартфона?",
          starter:"The hardest thing would be…", ex:"The hardest thing would be finding new places without a map app.",
          fu:["Could you live without your phone for a week?", "What would you do instead?"] }
      ],
      predict:{
        q:"Who had it better?", ua:"Кому жилося краще?",
        o:[ { id:"98", t:"Team 1998", e:"📼" }, { id:"26", t:"Team 2026", e:"📱" }, { id:"unsure", t:"I'm not sure yet", e:"🤔" } ],
        why:"Why do you think so? Say one reason.", whyUa:"Чому ти так думаєш? Назви одну причину."
      },
      box:{
        intro:[
          { who:"marko", t:"Dad says his old things are in a box in the wardrobe. 📦" },
          { who:"marko", t:"Found it! Look — photos, diary pages and… a cassette?!" }
        ],
        items:[
          { id:"photos", t:"Old photographs", s:"Printed photos with dates in orange numbers: '98 11 07, '98 11 21…" },
          { id:"diary", t:"Diary pages", s:"Dad's handwriting. One page starts: “Today was the worst day of my life…”" },
          { id:"tape", t:"A cassette", s:"The label says: “DAN'S MIX — NOV 1998”." }
        ],
        mission:{ k:"INVESTIGATION OPEN", t:"Generation Detective", s:"Five files. Two generations. One verdict." }
      },
      teacher:"<p><b>Мета:</b> розігрів, повернення в історію, перший прогноз. <b>5 хв</b> (сцена й чат 1 · питання 2 · прогноз і коробка 2).</p><details><summary>Як вести</summary><p>Чат читаєте за ролями: учень — Марко, ви — тато. Потім три питання (по одному). Кнопка <b>Done</b> позначає питання — її натискаєте ви або учень.</p></details><details><summary>Граматика — ще не пояснюємо</summary><p>У питаннях уже є <i>easier, the best, the hardest</i>. Не пояснюйте правило — просто перефразовуйте відповіді учня. Ці форми ми «відкриємо» в Місії 3.</p></details><details><summary>Прогноз</summary><p>Вибір (Team 1998 / 2026 / not sure) зберігається — у Місії 7 порівняємо його з вердиктом учня.</p></details>"
    },

    /* ========== MISSION 2 · THEN VS NOW 🕹️ ========== */
    {
      id:"thennow", n:2, section:"s2", min:7, type:"vocabulary", emoji:"🕹️",
      title:"Then vs Now",
      sort:{
        intro:"Where do these things belong: 1998, 2026 or both?",
        ua:"Куди це належить: 1998, 2026 чи обидва?",
        items:[
          { id:"cassette", t:"Recording songs from the radio onto a cassette", a:"98", why:"Cassettes were popular in the 1990s. Today, music comes from streaming apps.", ua:"Касети були популярні в 90-х. Сьогодні музика — у застосунках." },
          { id:"stream", t:"Watching a series on a streaming app", a:"26", why:"Streaming apps didn't exist in 1998. People watched TV or rented videos.", ua:"У 1998 році стримінгу не було — дивилися телевізор або брали відеокасети." },
          { id:"map", t:"Finding a new street with a paper map", a:"98", why:"In 1998, teenagers used paper maps. Today, almost everyone uses GPS on their phone.", ua:"У 1998 році користувалися паперовими картами, сьогодні — GPS у телефоні." },
          { id:"share", t:"Sending a photo to friends a second after you take it", a:"26", why:"In 1998, you had to print photos first. That took days!", ua:"У 1998 році фото треба було спершу надрукувати — це тривало кілька днів." },
          { id:"music", t:"Listening to music with headphones", a:"both", why:"Both! In 1998 — wired headphones and a cassette player. Today — wireless headphones and a phone.", ua:"Обидва! У 1998 — дротові навушники й плеєр, сьогодні — бездротові й телефон." },
          { id:"park", t:"Meeting friends in the park after school", a:"both", why:"Both! Some things never change. 🙂", ua:"Обидва! Деякі речі не змінюються." }
        ]
      },
      machine:{
        intro:"Switch between 1998 and 2026. Tap the dots. Then describe three differences out loud.",
        ua:"Перемикай 1998 і 2026. Натискай на точки. Потім уголос опиши три відмінності.",
        frames:["In 1998, teenagers used…, but today…", "Modern technology is more … than…", "Dad's room looks more … than Marko's room."],
        pairs:[
          { a:"a huge computer", b:"a laptop", ex:"In 1998, teenagers used a huge computer, but today they use a laptop. Laptops are smaller and faster." },
          { a:"a home phone", b:"a smartphone", ex:"In 1998, people had a home phone, but today everyone has a smartphone. It's more convenient." },
          { a:"CDs and cassettes", b:"music streaming", ex:"In 1998, teenagers bought CDs, but today music streaming is cheaper and easier." },
          { a:"printed photos", b:"social media", ex:"Printed photos were more special, but sharing photos online is faster." },
          { a:"a film camera", b:"a phone camera", ex:"A film camera was bigger and more expensive than a phone camera." }
        ],
        review:["tiny", "huge", "relaxed", "exhausted", "awful", "unbelievable"]
      },
      teacher:"<p><b>Мета:</b> лексика двох епох, перші порівняння «на слух». <b>7 хв</b> (Time Sort 3 · Spot the Difference 4).</p><details><summary>Time Sort (ключ)</summary><p>cassette — 1998 · streaming — 2026 · paper map — 1998 · photo a second after — 2026 · headphones — both · park — both. Після помилки — пояснення й нова спроба.</p></details><details><summary>Spot the Difference</summary><p>Перемикач <b>1998 ⇄ 2026</b> змінює кімнату. Учень описує 3 відмінності усно за рамками-підказками. Пари під картинкою — натисніть ту, яку учень описав (з'явиться зразок для вас). Слова з Уроку 7 (<i>tiny, huge, relaxed…</i>) — бонус.</p></details><details><summary>Не виправляйте граматику</summary><p>Якщо учень каже <i>more big</i> — лише перефразуйте: <i>Yes, bigger!</i> Правило — у Місії 3.</p></details>"
    },

    /* ========== MISSION 3 · THE COMPARISON LAB 🧪 ========== */
    {
      id:"lab", n:3, section:"s3", min:12, type:"grammar", emoji:"🧪",
      title:"The Comparison Lab",
      labs:[
        { id:"d1", n:1, t:"Comparatives & superlatives", short:"-er / more · -est / the most",
          notice:{ intro:"Look at the evidence. Tap the highlighted words. What changes?", ua:"Подивись на докази. Натискай на виділені слова. Що змінюється?",
            items:[
              { t:"Phones are [smaller] today.", base:"small", form:"small + -er", era:"26" },
              { t:"Communication is [more convenient] now.", base:"convenient", form:"more + convenient", era:"26" },
              { t:"The smartphone is one of [the most useful] inventions.", base:"useful", form:"the most + useful", era:"26" }
            ] },
          ask:[
            { q:"Why do we say “smaller” but “more convenient”?", o:["“Small” is a short word. “Convenient” is a long word.", "“Small” is a noun.", "There's no rule — it's random."], a:0,
              hint:"Count the syllables: small (1) — con-ve-ni-ent (4).", why:"Short adjectives take -er. Long adjectives take more.", ua:"Короткі прикметники додають -er, довгі — more." },
            { q:"“The most useful” means…", o:["useful, but not very", "more useful than everything else in the group", "as useful as other things"], a:1,
              hint:"Think: number one in a group.", why:"The superlative shows number one in a group: the most useful = the number one useful invention.", ua:"Найвищий ступінь — «номер один» у групі." }
          ],
          rule:{
            title:"Compare two things — or find number one",
            rows:[
              { k:"short", t:"Short adjectives", items:[["small", "smaller", "the smallest"], ["fast", "faster", "the fastest"], ["easy", "easier", "the easiest"], ["big", "bigger", "the biggest"]] },
              { k:"long", t:"Long adjectives", items:[["convenient", "more convenient", "the most convenient"], ["exciting", "more exciting", "the most exciting"]] },
              { k:"irr", t:"Irregular", items:[["good", "better", "the best"], ["bad", "worse", "the worst"]] }
            ],
            notes:["Comparative + <b>than</b>: <i>Phones are smaller <b>than</b> computers.</i>", "Superlative + <b>the</b>: <i><b>the</b> best day of my life</i>", "Spelling: eas<b>y</b> → eas<b>ier</b> · bi<b>g</b> → bi<b>gg</b>er"],
            ua:"Вищий ступінь (comparative) порівнює дві речі: коротке слово + -er, довге — more + слово, далі than. Найвищий ступінь (superlative) — «номер один»: the + -est або the most + слово. Неправильні: good → better → the best, bad → worse → the worst."
          },
          practice:[
            { q:"My dad's old phone was ___ than my smartphone.", hint:"heavy", o:["heavier", "more heavy", "the heaviest"], a:0, why:"Heavy is short and ends in -y: heavy → heavier. We compare two things, so: heavier than.", ua:"heavy — коротке, на -y: heavier." },
            { q:"Streaming is ___ than waiting for a TV programme.", hint:"convenient", o:["convenienter", "more convenient", "the most convenient"], a:1, why:"Convenient is a long word: more convenient than.", ua:"Довге слово: more convenient." },
            { q:"For Marko, the ___ thing about 1998 is no internet.", hint:"bad", o:["worse", "baddest", "worst"], a:2, why:"Bad is irregular. Number one + the: the worst.", ua:"Неправильний: bad → worse → the worst." },
            { q:"City Sound was the ___ concert of Dad's life.", hint:"good", o:["best", "better", "goodest"], a:0, why:"Good is irregular. Number one + the: the best.", ua:"Неправильний: good → better → the best." },
            { err:true, q:"Find the mistake and fix it.", words:["Life", "in", "1998", "was", "more simple", "than", "life", "today."], bad:4, o:["simpler", "more simpler", "the simplest"], a:0,
              why:"Simple is a short adjective: simple → simpler. (Not “more simple”.)", ua:"simple — коротке слово: simpler, а не more simple." }
          ] },
        { id:"d2", n:2, t:"(Not) as … as", short:"as fast as · not as fast as",
          notice:{ intro:"Compare the two scenes. Look at as … as.", ua:"Порівняй дві сцени. Зверни увагу на as … as.",
            scenes:[
              { k:"eq", l:"Friendship", a98:"❤️", a26:"❤️", sign:"=", t:"Friendships were just [as important] in 1998 [as] they are now." },
              { k:"lt", l:"Communication", a98:"🐢", a26:"⚡", sign:"<", t:"Communication [wasn't as fast as] it is today." }
            ] },
          ask:[
            { q:"Does as … as show equality or difference?", o:["as … as = the same · not as … as = less", "as … as = more", "as … as = number one"], a:0,
              hint:"Look at the signs: = and <.", why:"as important as = the same. not as fast as = less fast.", ua:"as … as — однаково; not as … as — менше, ніж." },
            { q:"“Communication wasn't as fast as it is today.” This means…", o:["Communication was faster in 1998.", "Communication is faster today.", "Communication speed is the same."], a:1,
              hint:"not as fast as = less fast.", why:"In 1998, communication was less fast. So it's faster today.", ua:"У 1998 році зв'язок був повільнішим — отже, сьогодні швидший." }
          ],
          rule:{
            title:"The same — or less?",
            pairs:[
              { f:"as + adjective + as", m:"the same", ex:"Friendships were just as important then as they are now." },
              { f:"not as + adjective + as", m:"less", ex:"A paper map isn't as fast as GPS." }
            ],
            notes:["✓ as fast as · ✗ as faster as · ✗ as fast than", "<i>just as</i> = exactly the same"],
            ua:"as + прикметник + as = такий самий, як. not as + прикметник + as = не такий …, як (менше). Прикметник — у звичайній формі: as fast as, а не as faster as."
          },
          practice:[
            { q:"A paper map isn't ___ GPS.", o:["as fast as", "as faster as", "so fast than"], a:0, why:"not as + normal adjective + as: not as fast as.", ua:"not as fast as — прикметник у звичайній формі." },
            { q:"Dad's computer was slow. Marko's laptop is fast. → Dad's computer wasn't as ___ as Marko's laptop.", o:["fast", "faster", "slow"], a:0, why:"The computer was less fast: it wasn't as fast as the laptop.", ua:"Комп'ютер був повільнішим: wasn't as fast as." },
            { q:"Friends were important in 1998. They are important today too. → Friends are just ___ important today ___ they were in 1998.", o:["as … as", "more … than", "as … than"], a:0, why:"The same = just as … as.", ua:"Однаково = just as … as." }
          ] },
        { id:"d3", n:3, t:"Too & enough", short:"too big · good enough",
          notice:{ intro:"Marko finds something in Dad's box…", ua:"Марко знаходить дещо в коробці тата…",
            comic:[
              { who:"marko", t:"Dad, this phone is [too big]! 😂" },
              { who:"dad", t:"But it was [good enough] for me!" }
            ] },
          ask:[
            { q:"“Too big” means…", o:["big in a good way", "bigger than you want — a problem", "the biggest phone in the world"], a:1,
              hint:"Can you put it in your pocket?", why:"too + adjective = more than you want. It's a problem.", ua:"too + прикметник = більше, ніж треба. Це проблема." },
            { q:"“Good enough” means…", o:["very, very good", "not good at all", "good — OK for what you need"], a:2,
              hint:"Dad was happy with the phone.", why:"adjective + enough = as much as you need.", ua:"прикметник + enough = достатньо для того, що потрібно." }
          ],
          rule:{
            title:"A problem — or OK?",
            pairs:[
              { f:"too + adjective", m:"more than you want · a problem", ex:"This phone is too big." },
              { f:"adjective + enough", m:"as much as you need · OK", ex:"It was good enough for me." },
              { f:"not + adjective + enough", m:"less than you need · a problem", ex:"Marko isn't old enough to drive." }
            ],
            notes:["✓ old enough · ✗ enough old", "too + adjective + to: <i>too dark to see</i>"],
            ua:"too + прикметник — «занадто» (проблема). прикметник + enough — «достатньо». not + прикметник + enough — «недостатньо». Порядок: old enough, а не enough old."
          },
          practice:[
            { q:"Dad's first mobile didn't fit in his pocket. It was ___.", o:["too big", "big enough", "enough big"], a:0, why:"It didn't fit — a problem: too big.", ua:"Не вміщався — проблема: too big." },
            { q:"Marko is 14. He can't drive. He isn't ___.", o:["too old", "old enough", "enough old"], a:1, why:"Not + adjective + enough: he isn't old enough.", ua:"Недостатньо дорослий: isn't old enough." },
            { q:"The cinema was ___ to find our seats.", o:["dark enough", "enough dark", "too dark"], a:2, why:"They couldn't see — a problem: too dark to find our seats.", ua:"Нічого не видно — проблема: too dark." },
            { q:"Can a 1998 computer play modern games? No — it isn't ___.", o:["fast enough", "too fast", "enough fast"], a:0, why:"It is less fast than we need: not fast enough.", ua:"Недостатньо швидкий: not fast enough." }
          ] }
      ],
      teacher:"<p><b>Мета:</b> 5 структур через відкриття. <b>12 хв</b> (3 відкриття × 4 хв).</p><details><summary>Як вести</summary><p>Кожне відкриття — 4 кроки: <b>Notice</b> (учень натискає виділене й каже, що змінилось) → <b>Think</b> (питання) → <b>Rule</b> (коротке правило, 🇺🇦 за кнопкою) → <b>Practice</b>. Ви можете перейти на будь-який крок кнопками зверху.</p></details><details><summary>Ключі</summary><p><b>1:</b> heavier · more convenient · worst · best · Fix: more simple → simpler. <b>2:</b> as fast as · fast · as … as. <b>3:</b> too big · old enough · too dark · fast enough.</p></details><details><summary>Пастки</summary><p><i>more simple / more big</i> ✗ · <i>as faster as</i> ✗ · <i>enough old</i> ✗ · <i>the most good</i> ✗. Після неправильної відповіді — коротке пояснення й нова спроба; після другої — правильна відповідь.</p></details><details><summary>Якщо мало часу</summary><p>Практику 2 скоротіть до одного завдання; у 3 — зробіть 2 з 4. Доказ 02 відкриється все одно.</p></details>"
    },

    /* ========== MISSION 4 · DAD'S SECRET DIARY 📓 ========== */
    {
      id:"diary", n:4, section:"s4", min:8, type:"reading", emoji:"📓",
      title:"Dad's Secret Diary",
      date:"Saturday, 7 November 1998",
      /* {s|…} superlative · {c|…} comparative · {t|…} too + adj · {e|…} adj + enough · {a|…} (not) as … as · [слово] — слово уроку */
      paras:[
        "Dear Diary, today was {s|the worst} day of my life. Well, maybe {s|the second worst}.",
        "I finally decided to invite A. to the cinema. Nobody I know has a mobile phone, so I had to call her house. Her dad answered. He has {s|the deepest} voice in the world! I panicked and said, “Sorry, wrong number.” Brilliant, Dan.",
        "An hour later, I was {e|brave enough} to call again. This time, she answered — and she said yes!",
        "Then things got {c|worse}. We agreed to meet Alex and Emma “at the Kosmos”. I waited outside the Kosmos café for forty minutes. They waited outside the Kosmos cinema. Without mobiles, we couldn't tell each other where we were. When I finally found them, the film was already on, and it was {t|too dark} to find our seats.",
        "Life without a mobile {a|isn't as easy as} people think. You have to be very [patient]. But A. laughed at my story all the way home. It was {s|the best} sound of the day."
      ],
      sign:"Dan",
      gloss:[["panicked", "запанікував"], ["Brilliant, Dan.", "Геніально, Дене. (з іронією)"], ["agreed to meet", "домовилися зустрітися"], ["the film was already on", "фільм уже почався"], ["all the way home", "всю дорогу додому"]],
      gist:{ q:"Read quickly. What is this diary entry mainly about?", o:["A scary phone call and a meeting that went wrong", "Dad's first mobile phone", "A film that Dad didn't like"], a:0,
        hint:"Look at the first and the last paragraph.", why:"It's about a scary phone call and a meeting at the wrong place.", ua:"Про страшний дзвінок і зустріч не в тому місці." },
      comp:[
        { q:"Why did Dan say “Sorry, wrong number”?", o:["He really called the wrong number.", "He panicked when A.'s dad answered.", "A.'s dad told him to go away."], a:1,
          hint:"Read paragraph 2 again.", why:"Her dad answered, and Dan panicked.", ua:"Відповів її тато, і Ден запанікував." },
        { q:"Why didn't Dan meet his friends at the right place?", o:["“The Kosmos” could mean the café or the cinema — and they couldn't phone each other.", "He forgot the time.", "Alex and Emma didn't want to come."], a:0,
          hint:"Where did Dan wait? Where did his friends wait?", why:"Dan waited at the Kosmos café, his friends at the Kosmos cinema — and nobody had a mobile.", ua:"Ден чекав біля кафе «Космос», друзі — біля кінотеатру. Мобільних не було." },
        { q:"What happened when Dan finally found his friends?", o:["They watched the film from the start.", "The cinema was closed.", "The film was already on, and they couldn't find their seats."], a:2,
          hint:"Read the end of paragraph 4.", why:"The film was already on, and it was too dark to find their seats.", ua:"Фільм уже йшов, і було занадто темно, щоб знайти місця." }
      ],
      find:{
        intro:"Grammar detective: find these structures in the diary. Choose a structure, then tap the words in the text.",
        ua:"Граматичний детектив: знайди ці конструкції в щоденнику. Обери конструкцію, потім натисни на слова в тексті.",
        targets:[
          { k:"s", t:"a superlative", ex:"the …est / the most …" },
          { k:"c", t:"a comparative", ex:"…er / more … / better, worse" },
          { k:"t", t:"too + adjective", ex:"too …" },
          { k:"e", t:"adjective + enough", ex:"… enough" },
          { k:"a", t:"(not) as … as", ex:"as … as", bonus:true }
        ]
      },
      talk:[
        { q:"Have you ever had a communication disaster — a wrong message, a missed call or the wrong place? What happened?", ua:"У тебе колись траплялася «катастрофа» зі спілкуванням — не те повідомлення, пропущений дзвінок, не те місце? Що сталося?",
          starter:"Once, I…", ex:"Once, I sent a message about my teacher to the class chat. It was the worst moment of my year!", fu:["Was it worse than Dan's day?"] },
        { q:"Would Dan's day be easier in 2026? Why or why not?", ua:"Чи був би день Дена легшим у 2026 році? Чому?",
          starter:"It would be easier because… / It wouldn't be as … as…", ex:"Yes, it would be much easier. He could just message A., and his friends could send him their location.", fu:["What would be harder for him in 2026?"] }
      ],
      teacher:"<p><b>Мета:</b> читання (загальне й детальне розуміння) + граматика в контексті. <b>8 хв</b> (gist 1 · читання 3 · питання 2 · граматика й розмова 2).</p><details><summary>Як вести</summary><p>Спершу учень швидко переглядає текст і відповідає на gist-питання. Потім читає уважно (уголос — за бажанням) і відповідає на 3 питання. 🇺🇦 — переклад складних фраз.</p></details><details><summary>Ключі</summary><p>Gist A · 1 B · 2 A · 3 C. Граматика: <i>the worst / the second worst / the deepest / the best</i> — superlative · <i>worse</i> — comparative · <i>too dark</i> · <i>brave enough</i> · бонус: <i>isn't as easy as</i>.</p></details><details><summary>Сюжет</summary><p>«A.» — тато не пише імені. Якщо учень питає «Anna?» — <i>Maybe… we'll see!</i> Не підтверджуйте й не заперечуйте: таємниця для Уроку 9. Щоденник датовано 7.11.1998 — за два тижні до City Sound.</p></details><details><summary>Сюрприз</summary><p>Після завдань відкривається особливий доказ: життя тата не завжди було таким легким, як він каже.</p></details>"
    },

    /* ========== MISSION 5 · TWO GENERATIONS, TWO OPINIONS 🎧 ========== */
    {
      id:"voices", n:5, section:"s5", min:8, type:"listening", emoji:"🎧",
      title:"Two Generations, Two Opinions",
      msgs:[
        { id:"dad", who:"dad", label:"Voice message A · Dad", voice:{ lang:"en-GB", hint:["daniel", "george", "arthur", "male", "guy", "ryan", "thomas"], pitch:.82, rate:.92 },
          text:"Hi Marko, it's Dad. OK, here's my side of the story. When I was your age, life was slower, but it was calmer too. We had fewer distractions — no notifications every five minutes. Honestly, your phone is so distracting! We spent much more time outside, and we talked face to face. If you wanted to see a friend, you just knocked on their door. And there was less pressure from social media. Nobody compared their life with a thousand perfect photos. Was it easier? Maybe not. But it was simpler — and for me, simpler was better. See you at dinner!" },
        { id:"marko", who:"marko", label:"Voice message B · Marko", voice:{ lang:"en", hint:["oliver", "alex", "aaron", "evan", "ryan", "male", "guy"], pitch:1.12, rate:1.02 },
          text:"Hi Dad, it's me. Sorry, but I don't agree! Communication is so much easier now. I can talk to my friends any time, even when they're on holiday in another country. We're always connected. It's also faster to find information — I don't need a library, I just search online. We have more entertainment choices too: films, music and games, whenever we want. And there are more opportunities to learn. I'm learning the guitar from online videos — for free! OK, maybe we're more distracted than you were. But I think my generation has the best of both worlds. Love you. Bye!" }
      ],
      match:[
        { t:"We had fewer distractions.", a:"dad" },
        { t:"Communication is easier now.", a:"marko" },
        { t:"Teenagers spent more time outside.", a:"dad" },
        { t:"It's faster to find information.", a:"marko" },
        { t:"There was less pressure from social media.", a:"dad" },
        { t:"There are more opportunities to learn.", a:"marko" }
      ],
      tf:[
        { t:"Dad thinks life in 1998 was simpler.", a:true, why:"True. He says: “it was simpler — and for me, simpler was better.”" },
        { t:"Marko says teenagers today are never distracted.", a:false, why:"False. He says: “maybe we're more distracted than you were.”" }
      ],
      both:{ q:"Which idea do Dad AND Marko both agree with?", o:["Teenagers in 1998 had fewer distractions than teenagers today.", "Life in 1998 was much easier.", "Online videos are too expensive."], a:0,
        hint:"Dad talks about distractions. What does Marko admit at the end?", why:"Dad says they had fewer distractions, and Marko admits: “maybe we're more distracted than you were.”", ua:"Обидва погоджуються: у 1998 році підлітків менше відволікали." },
      follow:{ q:"Who do you agree with more — Dad or Marko? Why?", ua:"З ким ти більше згоден / згодна — з татом чи Марком? Чому?",
        starter:"I agree with … more because…", ex:"I agree with Marko more because communication is much easier today. But Dad is right — phones are too distracting.",
        fu:["Is there anything you agree with BOTH of them about?"] },
      teacher:"<p><b>Мета:</b> аудіювання (думки й деталі) + порівняння. <b>8 хв</b> (2 повідомлення 3 · завдання 3 · розмова 2).</p><details><summary>Звук</summary><p>Повідомлення читає синтезатор мовлення браузера (голоси тата й Марка різні). Під час відтворення підсвічується речення, яке звучить, — якщо транскрипт відкрито. Транскрипт спершу прихований: краще відкрити після першого прослуховування. Якщо браузер не читає вголос, з'явиться режим <b>Teacher reads</b> — прочитайте тексти самі.</p></details><details><summary>Ключі</summary><p>Match: Dad — fewer distractions, more time outside, less pressure · Marko — easier communication, faster information, more opportunities. T/F: 1 T · 2 F. Both: A.</p></details><details><summary>Деталь історії</summary><p>Марко вчиться грати на гітарі з онлайн-відео — відповідь на P.S. з листа тата в Уроці 7 («Don't stop playing the guitar»).</p></details>"
    },

    /* ========== MISSION 6 · THE GREAT GENERATION DEBATE ⚖️ ========== */
    {
      id:"debate", n:6, section:"s6", min:10, type:"mission", emoji:"⚖️",
      title:"The Great Generation Debate",
      rounds:[
        { id:"talk", cat:"Communication", ev:"talk", q:"Is a quick message better than a long face-to-face chat?", ua:"Швидке повідомлення краще за довгу розмову віч-на-віч?",
          lang:["Communication is faster today because…", "In 1998, conversations were longer, but…", "A message isn't as personal as…"] },
        { id:"fun", cat:"Entertainment", ev:"fun", q:"Is it more exciting to wait for something or to get it immediately?", ua:"Цікавіше чекати чогось чи отримувати одразу?",
          lang:["Entertainment is more convenient today, but…", "Waiting made things more exciting because…", "Today there are too many choices, so…"] },
        { id:"friends", cat:"Friendship", ev:"friends", q:"Are online friends as real as friends you meet face to face?", ua:"Онлайн-друзі такі ж справжні, як друзі, з якими ти бачишся наживо?",
          lang:["Friendships were just as important then as…", "Face-to-face friends are closer than…", "Today it's easier to stay connected with…"] },
        { id:"free", cat:"Freedom", ev:"free", q:"Is it easier to be independent when your parents can always find you?", ua:"Чи легше бути незалежним, коли батьки завжди можуть тебе знайти?",
          lang:["Teenagers in 1998 had more freedom because…", "Today teenagers are safer, but they aren't as free as…", "Parents can always check where we are, so…"] },
        { id:"tech", cat:"Technology", ev:"tech", q:"Does technology make life easier — or just faster?", ua:"Технології роблять життя легшим — чи лише швидшим?",
          lang:["Technology makes life easier because…", "Modern life isn't always as simple as…", "The most useful invention is…"] }
      ],
      need:3,
      teacher:"<p><b>Мета:</b> самостійне мовлення з усіма структурами. <b>10 хв</b> (5 раундів × 2 хв).</p><details><summary>Як вести</summary><p>У кожному раунді: докази 1998 / 2026 → питання → учень обирає переможця (Team 1998, Team 2026 або нічия) → пояснює вголос. Підказки-фрази сховані: кнопка <b>Sentence starters</b>.</p></details><details><summary>Оцінка</summary><p>Кнопку <b>⭐ Explained with comparison grammar</b> натискайте, коли учень обґрунтував вибір хоча б однією структурою уроку. Мета — щонайменше 3 з 5. Бали отримує команда, яку обрав учень; нічия — по балу обом. Результат — лише вибір учня.</p></details><details><summary>Розвиток</summary><p>Заперечуйте м'яко: <i>But Dad says… / Really? Isn't it too…?</i> — щоб учень захищав думку.</p></details>"
    },

    /* ========== MISSION 7 · THE FINAL VERDICT 🏆 ========== */
    {
      id:"verdict", n:7, section:"s7", min:5, type:"cliffhanger", emoji:"🏆",
      title:"The Final Verdict",
      reflect:[
        { q:"What was the most surprising thing you learned?", ua:"Що було найнесподіванішим із того, що ти дізнався / дізналася?", starter:"The most surprising thing was…",
          ex:"The most surprising thing was Dad's diary. His life wasn't as easy as he said!" },
        { q:"Which generation had the biggest advantages?", ua:"Яке покоління мало найбільші переваги?", starter:"I think … had the biggest advantages because…",
          ex:"I think my generation had the biggest advantages because we have more opportunities to learn." },
        { q:"Would you like to spend one week in 1998? Why or why not?", ua:"Ти хотів / хотіла б провести тиждень у 1998 році? Чому?", starter:"I'd like to… / I wouldn't like to… because…",
          ex:"Yes, I'd like to spend a week there. Life was more relaxed — but one week is enough!" }
      ],
      recap:[
        { k:"Comparatives", f:"-er / more … than", ex:"Communication is faster today." },
        { k:"Superlatives", f:"the -est / the most …", ex:"It was the worst day of my life!" },
        { k:"(Not) as … as", f:"the same / less", ex:"Life in 1998 wasn't as connected as life today." },
        { k:"Too + adjective", f:"more than you want", ex:"That phone was too big!" },
        { k:"Adjective + enough", f:"as much as you need", ex:"He wasn't old enough to drive." }
      ],
      badge:{ t:"GENERATION DETECTIVE", s:"You compared two generations and made your own verdict." },
      cliff:[
        { sys:"Sunday · 21:47" },
        { who:"dad", t:"Okay, Marko. Maybe your generation has some advantages. 🙂" },
        { who:"dad", t:"But there's something I haven't told you about 1998…" },
        { pause:1500 },
        { who:"dad", t:"Check the last page of my diary." },
        { who:"dad", t:"And whatever you do, don't show it to Mum yet." },
        { who:"marko", me:true, t:"Wait… WHAT?! 😳" }
      ],
      next:{ k:"NEXT EPISODE", t:"Lesson 9 — Generation Debate", s:"What is on the last page of Dad's diary?" },
      teacher:"<p><b>Мета:</b> підсумок, рефлексія, гачок на Урок 9. <b>5 хв.</b></p><details><summary>Як вести</summary><p>Повна дошка доказів → прогноз учня з Місії 1 поруч із його вердиктом (чи змінив думку?) → 3 питання для рефлексії → короткий повтор граматики → бейдж. Потім фінальне повідомлення тата.</p></details><details><summary>Таємниця</summary><p>Не розкривайте, що на останній сторінці щоденника. Можна спитати: <i>What do you think is on the last page?</i></p></details><details><summary>Бонус</summary><p>Після «To be continued» є кнопка гри <b>Generation Battle</b> (5–8 хв). Вона необов'язкова: <b>Finish lesson</b> завершує урок без неї.</p></details>"
    },

    /* ========== BONUS · THE GENERATION BATTLE ⚡ ========== */
    {
      id:"bonus", n:8, section:"s8", min:0, optional:true, type:"bonus", emoji:"⚡",
      title:"The Generation Battle",
      sub:"Two Generations. Zero Survival Skills. 😂",
      rounds:[
        { id:"r1", era:"98", icon:"📞", t:"The Phone Disaster", s:"It's 1998. You call your crush, but their DAD answers the phone. What do you do?",
          o:[ { t:"Pretend you called the wrong number.", r:"Classic escape! But what if he recognises your voice? 😂" },
              { t:"Ask to speak to your crush. Be brave!", r:"Respect! You've just unlocked 1998-level courage. 🏆" } ],
          talk:"Was calling someone in 1998 more stressful than texting today?" },
        { id:"r2", era:"26", icon:"💀", t:"The Accidental Like", s:"You're looking at your crush's old photos. You accidentally like a photo from 2021. What's your next move?",
          o:[ { t:"Unlike it and pretend nothing happened.", r:"Too late — they got the notification. Smooth… but not smooth enough. 👀" },
              { t:"Accept your fate and send a message.", r:"Brave! “Nice photo… from 2021.” Absolutely legendary. 😂" } ],
          talk:"Which is more embarrassing: this or calling your crush's dad in 1998?" },
        { id:"r3", era:"98", icon:"📼", t:"The Cassette Emergency", s:"Your favourite cassette gets stuck in your player. The tape is everywhere. What do you do?",
          o:[ { t:"Find a pencil and try to fix it.", r:"A true 1998 skill! Turn, turn, turn… The music lives! ✏️" },
              { t:"Declare the worst day of your life.", r:"Drama level: maximum. Goodbye, favourite tape. 😭" } ],
          talk:"Is Spotify more convenient than collecting cassettes?" },
        { id:"r4", era:"26", icon:"🔋", t:"The 1% Nightmare", s:"You're outside. Your phone is at 1%. You don't know the way home. What do you do?",
          o:[ { t:"Quickly check the map and memorise the route.", r:"Speed run! Ten seconds, three streets, one dead phone. Respect. 🧠" },
              { t:"Find someone and ask for directions.", r:"Old-school move! Your dad would be proud. 🗺️" } ],
          talk:"Were teenagers in 1998 better at finding places without technology?" },
        { id:"r5", era:"98", icon:"📺", t:"The Missed Episode", s:"Your favourite TV show starts at 6:00. You get home at 6:30. What now?",
          o:[ { t:"Ask a friend to tell you everything.", r:"Your friend tells you everything… in 45 minutes, with sound effects. 😂" },
              { t:"Wait and hope for a repeat.", r:"So patient! The repeat is… next month. Good luck. 📅" } ],
          talk:"Was entertainment less convenient but more exciting in 1998?" },
        { id:"r6", era:"26", icon:"📶", t:"The Wi-Fi Apocalypse", s:"The Wi-Fi stops working for TWO HOURS. Your phone has no mobile data. What do you do?",
          o:[ { t:"Go outside and meet real humans.", r:"Plot twist: humans are fun! And the sun is real too. ☀️" },
              { t:"Restart the router 47 times.", r:"Attempt number 48 will definitely work. Definitely. 🔄" } ],
          talk:"Would a teenager from 1998 survive this situation more easily?" },
        { id:"r7", era:"98", icon:"💌", t:"The Love Letter", s:"You give someone a love letter. The next day, their best friend walks towards you holding it. What do you do?",
          o:[ { t:"Run away before they say anything.", r:"Speed: unbelievable. Dignity: lost somewhere in the corridor. 🏃" },
              { t:"Smile and pretend you're confident.", r:"Main-character energy! Whatever happens, you look cool. 😎" } ],
          talk:"Are handwritten love letters more romantic than text messages?" },
        { id:"r8", era:"26", icon:"👀", t:"The Seen Zone", s:"You send your best friend a really important message. They read it and don't reply for eight hours. What do you think?",
          o:[ { t:"They're busy. No big deal.", r:"Calm, relaxed, mature. Are you secretly forty? 🧘" },
              { t:"Our friendship is officially over.", r:"Breaking news: friendship ends after eight hours. The friend was… asleep. 😴" } ],
          talk:"Was waiting for a reply easier before read receipts existed?" }
      ],
      vote:"Which generation handles this kind of problem more easily?",
      teacher:"<p><b>Бонус (необов'язково):</b> 5–8 хв, поза основним часом. Не впливає на прогрес уроку.</p><details><summary>Як грати</summary><p>Раунд: ситуація → вибір реакції (правильних відповідей немає) → смішна реакція → усне питання → голос «яке покоління впоралося б легше». Можна зіграти 3, 4 або всі 8 раундів — кнопка <b>See my result</b> з'являється після 3-го.</p></details><details><summary>Мова</summary><p>Просіть відповідати з порівняннями: <i>more stressful than, not as embarrassing as, too…</i></p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/generation.js) ---------- */
  screens(add, st){
    const m = st("message");
    add(m, "gxOpen", { key:"open", store:"open", scene:m.scene, chat:m.chat, partner:m.partner });
    add(m, "gxTalk", { key:"talk", store:"talk", qs:m.qs, title:"Warm-up: Then or Now?", intro:"Answer out loud. Your teacher can ask a follow-up.", ua:"Відповідай уголос. Учитель може поставити додаткове питання.", cta:"Make your prediction →" }, m.qs.map(q => q.ex).join(" · "));
    add(m, "gxPredict", { key:"predict", store:"predict", predict:m.predict, box:m.box });

    const t = st("thennow");
    add(t, "gxSort", { key:"sort", store:"sort", sort:t.sort }, t.sort.items.map(x => x.t.split(" ").slice(0, 3).join(" ") + "… — " + (x.a === "both" ? "both" : x.a === "98" ? "1998" : "2026")).join(" · "));
    add(t, "gxTimeMachine", { key:"machine", store:"machine", m:t.machine }, "3 differences out loud, e.g. " + t.machine.pairs[0].ex);
    add(t, "gxEvidence", { key:"ev", store:"ev", ids:["tech"], mission:2, cta:"Enter the Comparison Lab 🧪" });

    const l = st("lab");
    l.labs.forEach(d => add(l, "gxLab", { key:d.id, store:d.id, lab:d }, d.practice.map((p, i) => (i + 1) + " " + (p.err ? "fix → " : "") + p.o[p.a]).join(" · ")));
    add(l, "gxEvidence", { key:"ev", store:"ev", ids:["fun"], mission:3, cta:"Open Dad's diary 📓" });

    const d = st("diary");
    add(d, "gxDiary", { key:"read", store:"read" }, "Gist A · 1 B · 2 A · 3 C");
    add(d, "gxDiaryFind", { key:"find", store:"find" }, "superlative: the worst / the deepest / the best · comparative: worse · too dark · brave enough · bonus: isn't as easy as");
    add(d, "gxEvidence", { key:"ev", store:"ev", ids:["talk"], exhibit:true, mission:4, cta:"Listen to two opinions 🎧" });

    const v = st("voices");
    add(v, "gxVoices", { key:"listen", store:"listen" });
    add(v, "gxListen", { key:"tasks", store:"tasks" }, "Dad: fewer distractions · more time outside · less pressure. Marko: easier communication · faster information · more opportunities. T/F: 1 T · 2 F. Both: A");
    add(v, "gxEvidence", { key:"ev", store:"ev", ids:["friends", "free"], mission:5, final:true, cta:"Start the debate ⚖️" });

    const b = st("debate");
    add(b, "gxDebate", { key:"arena", store:"arena" }, "Open answers. Goal: ≥3 choices explained with comparatives / superlatives / as … as / too / enough");

    const f = st("verdict");
    add(f, "gxVerdict", { key:"verdict", store:"verdict" }, f.reflect.map(q => q.ex).join(" · "));
    add(f, "gxCliff", { key:"cliff", store:"cliff" });

    const x = st("bonus");
    add(x, "gxBattle", { key:"battle", store:"battle" }, "No wrong answers. Any 3, 4 or all 8 rounds.");
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const gx = (ans && ans._gx) || {};
    const ev = Object.keys(gx.ev || {}).length;
    const arena = (ans.debate && ans.debate.arena) || {};
    const s = { "98":0, "26":0 }; Object.values(arena.pick || {}).forEach(p => { if (p === "98" || p === "tie") s["98"]++; if (p === "26" || p === "tie") s["26"]++; });
    const verdict = !Object.keys(arena.pick || {}).length ? "—" : s["98"] === s["26"] ? "a draw" : s["98"] > s["26"] ? "Team 1998" : "Team 2026";
    const labDef = this.stages.find(x => x.id === "lab").labs;
    const labTotal = labDef.reduce((n, d) => n + d.practice.length, 0);
    const labs = labDef.reduce((n, d) => { const L = ans.lab && ans.lab[d.id]; return n + (L && L.p ? Object.values(L.p).filter(r => r && r.first).length : 0); }, 0);
    const battle = (ans.bonus && ans.bonus.battle) || {}; const br = Object.keys(battle.r || {}).length;
    return {
      icon:"🏆", title:"Lesson 8 complete — Generation Detective",
      text:"You collected the evidence, compared two generations and gave your own verdict. But Dad still has a secret on the last page of his diary…",
      stats:[
        [`🔎 ${ev} / 5`, "evidence files"],
        [`⚖️ ${verdict}`, "your verdict"],
        [`🧪 ${labs} / ${labTotal}`, "lab answers right first time"],
        [br ? `⚡ ${br} / 8` : "⚡ —", "bonus battle rounds"]
      ]
    };
  }
};
})();
