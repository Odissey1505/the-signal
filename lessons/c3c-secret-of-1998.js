/* ============================================================
   LESSON 9 · Cycle 3C · THE SECRET OF 1998 🔐
   Unit 3 · My way of life — фінал Unit 3 (Use it: reading + speaking + writing).
   Формат — урок один на один (учень + учитель, демонстрація екрана), ≈57 хв, 7 етапів.
   Нової граматики немає: повторюємо comparatives, superlatives, (not) as … as, too / enough
   і 13 виразів про життєві події з Уроку 7. Письмо — неформальний лист-email (80–100 слів).

   ФАКТИ ІСТОРІЇ (узгоджені з Уроками 4–8):
   • Тато = Dan (Daniel), у 1998 році йому 17. Марку 14. Друзі 1998 року — Emma, Alex, Anna.
   • Урок 8 закінчився повідомленням тата: «Check the last page of my diary. And whatever you do,
     don't show it to Mum yet.» Урок 9 починається рівно з цього повідомлення.
   • Останню сторінку щоденника датовано 24.08.1998 — раніше за запис 7.11.1998 з Уроку 8:
     тато навмисно написав її в самому кінці зошита, далеко від інших записів.
   • Таємниця: Westbridge Sports Academy запросила Dan у вересні 1998. Він купив квиток на
     31.08.1998, але не поїхав — злякався. Квиток і лист досі в щоденнику.
   • Фото шкільної футбольної команди 1997 року; на звороті — «You were good enough.
     Don't forget that.» від Alex (друг і товариш по команді).
   • Мама не знає про академію: батьки познайомилися в 2007 році, тато просто соромився
     старого рішення. Таємниця не стосується їхніх стосунків.
   • У листі «собі в майбутнє» від 31.12.1998 (Урок 7) тато вже не пише про спорт —
     тиха деталь: рішення його боліло. «Maybe I'll leave home and move to another city!»
   • Вибір учня в етапі 5 (Talk today / Write first) визначає кінцівку етапу 7. Обидві
     кінцівки позитивні: мама підтримує тата.
   • Фінал: анонс Unit 4 — Champions Week у школі Марка.

   Екрани — з js/screens/lastpage.js, тема — css/lastpage.css (body[data-episode-theme="lastpage"]).
   Порядок екранів — у функції screens() в кінці файлу.

   КАРТИНКИ (необов'язкові). Поки поле null — урок малює сцену кодом, нічого не ламається.
   Згенеруйте файл, покладіть у папку c3c всередині assets і впишіть шлях у MEDIA нижче.
   Підказки для генерації — у README.md, розділ «Урок 9».
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- картинки (null = намальована сцена) ---------- */
const MEDIA = {
  room: "assets/c3c/room-night.webp",           /* темна кімната Марка, стіл під лампою (16:9) — етап 1; живий щоденник лежить поверх */
  diary: "assets/c3c/diary-cover.webp",         /* обкладинка щоденника «DAN 1998» (4:3) — етап 1, відкривається анімацією */
  envelope: "assets/c3c/envelope.webp",         /* конверт Westbridge Sports Academy (3:2) — доказ A */
  ticket: "assets/c3c/ticket.webp",             /* квиток до Westbridge, 31.08.1998 (2:1) — доказ B */
  team: "assets/c3c/team-1997.webp",            /* фото шкільної команди 1997 без рамки (4:3) — картка на столі */
  teamPolaroid: "assets/c3c/team-1997-polaroid.webp", /* те саме фото в рамці з підписом (≈1,21:1) — лицьовий бік, який перевертається */
  note: "assets/c3c/note-alex.webp",            /* записка Alex «You were good enough…» (4:3) — зворот фото */
  living: "assets/c3c/living-room.webp",        /* вітальня ввечері (≈2,4:1) — кінцівка A */
  letter: "assets/c3c/letter-night.webp",       /* кухонний стіл під лампою з аркушем (≈2,4:1) — кінцівка B */
  morning: "assets/c3c/morning.webp"            /* світанок за вікном (≈2,4:1) — анонс Unit 4 */
};

/* ---------- 13 виразів Уроку 7 (повторення, підказки в етапах 2 і 6) ---------- */
const LIFE = [
  { w:"be born", ua:"народитися", en:"begin your life" },
  { w:"start school", ua:"почати навчання у школі", en:"begin going to school" },
  { w:"leave school", ua:"закінчити школу", en:"finish your school education" },
  { w:"leave home", ua:"почати жити окремо від батьків", en:"stop living with your parents" },
  { w:"move home", ua:"переїхати в інше житло", en:"change the place where you live" },
  { w:"go to university", ua:"вступити до університету", en:"study at a university" },
  { w:"get a degree", ua:"отримати диплом", en:"finish university and get a qualification" },
  { w:"get a job", ua:"влаштуватися на роботу", en:"find work" },
  { w:"get a driving licence", ua:"отримати водійське посвідчення", en:"get permission to drive" },
  { w:"get married", ua:"одружитися / вийти заміж", en:"become someone's husband or wife" },
  { w:"have children", ua:"мати дітей", en:"become a parent" },
  { w:"retire", ua:"вийти на пенсію", en:"stop working, usually because of age" },
  { w:"vote", ua:"голосувати", en:"choose someone in an election" }
];

/* ---------- 6 слів історії (у My words) ---------- */
const WORDS = [
  { w:"invitation", ua:"запрошення", en:"a letter or message that asks you to join something", ex:"Dad got an invitation from a sports academy." },
  { w:"academy", ua:"академія, спеціальна школа", en:"a school for special training", ex:"The academy trains young athletes." },
  { w:"determination", ua:"рішучість, наполегливість", en:"when you don't stop trying, even when it's hard", ex:"You need determination to become an athlete." },
  { w:"brave", ua:"сміливий", en:"ready to do something difficult or scary", ex:"He wasn't brave enough to leave home." },
  { w:"regret", ua:"шкодувати", en:"feel sorry about something you did or didn't do", ex:"Does Dad regret his decision?" },
  { w:"hometown", ua:"рідне місто", en:"the town or city where you grew up", ex:"Dad stayed in his hometown." }
];

window.SIGNAL_LESSONS.c3c = {
  id: "c3c",
  cycle: 3,
  lessonType: "use-story",
  theme: "lastpage",
  title: "The Secret of 1998",
  fullTitle: "The Secret of 1998 — Unit 3 Finale",
  subtitle: "Unit 3 · My way of life · Lesson 9",
  series: "Generation Swap",
  tagline: "Every family has a story. Some stories take 28 years to tell.",
  question: "What is on the last page of Dad's diary?",
  minutes: 57,
  number: 9,
  setting: "Sunday evening, right after Lesson 8. Marko has Dad's diary — and a message he can't stop reading.",
  media: MEDIA,
  life: LIFE,
  words: WORDS,

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["page"],
    vocabPresentation: [],
    discoveryGuide: [],
    vocabPractice: ["life"],
    grammar: ["grammar"],
    grammarPractice: ["grammar"],
    listening: [],
    reading: ["page", "clues"],
    speaking: ["page", "life", "clues", "decision", "truth"],
    mission: ["decision", "email"],
    summary: ["truth"],
    homework: []
  },
  tabs: [
    { key:"s1", label:"1 The Last Page" }, { key:"s2", label:"2 A Life in Pieces" }, { key:"s3", label:"3 The Missing Pieces" },
    { key:"s4", label:"4 Comparison Challenge" }, { key:"s5", label:"5 The Big Decision" }, { key:"s6", label:"6 Email to Marko" },
    { key:"s7", label:"7 The Truth Comes Out" }
  ],

  vocab: WORDS.map(x => ({ w:x.w, ipa:"", ua:x.ua, en:x.en, ex:x.ex, g:"story9" })),
  receptive: [],

  requires: ["c1a"],
  get characters(){
    const base = (window.SIGNAL_LESSONS.c1a || {}).characters || {};
    return Object.assign({}, base, {
      dad: { name:"Dad", img:"assets/c2b/dad-today.webp", face:{ x:50, y:29 }, look:{ hair:"short", colour:"#1E1612", skin:"#7A4B32", top:"#4D6E9C", mood:"smile" } },
      mum: { name:"Mum", img:"assets/c3c/mum.webp", face:{ x:50, y:37 }, look:{ hair:"straight-long", colour:"#4A2E1C", skin:"#E8C4A8", top:"#8E5BA8", mood:"smile" } }
    });
  },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- 7 етапів ---------- */
  stages: [

    /* ========== STAGE 1 · THE LAST PAGE 🔐 ========== */
    {
      id:"page", n:1, section:"s1", min:6, type:"reading", emoji:"🔐",
      title:"The Last Page",
      open:{
        osd:"PREVIOUSLY · LESSON 8",
        chat:[
          { sys:"Sunday · 21:47" },
          { who:"dad", t:"Okay, Marko. Maybe your generation has some advantages. 🙂" },
          { who:"dad", t:"But there's something I haven't told you about 1998…" },
          { who:"dad", t:"Check the last page of my diary." },
          { who:"dad", t:"And whatever you do, don't show it to Mum yet." }
        ],
        tbc:"TO BE CONTINUED… 👀",
        caption:"Every family has a story. Some stories take 28 years to tell.",
        cta:"OPEN THE LAST PAGE 🔓"
      },
      diary:{
        date:"24 August 1998",
        lines:[
          "Dear Diary,",
          "Today I got a letter that could change my whole life.",
          "Westbridge Sports Academy wants me to join their training programme in September! It's one of the best sports academies in the country.",
          "I've always dreamed of becoming a great athlete. But the academy is in another city, far from my family and friends.",
          "What if I'm not as good as the other students? What if life there is too difficult?"
        ],
        hidden:[
          "Maybe I'm not brave enough to leave home.",
          "I have to decide by Friday.",
          "I wish I knew what to do."
        ],
        sign:"— D.",
        clue:"Wait… this page is from August 1998. That's BEFORE all the other pages! Dad hid it at the very back of the diary.",
        gloss:[
          { w:"a training programme", ua:"програма тренувань", en:"a plan of lessons and practice for sport" },
          { w:"an academy", ua:"академія, спеціальна школа", en:"a school for special training" },
          { w:"dream of (doing)", ua:"мріяти про", en:"really want something in the future" },
          { w:"far from", ua:"далеко від", en:"a long way from" },
          { w:"brave enough", ua:"достатньо сміливий", en:"as brave as you need to be" },
          { w:"decide", ua:"вирішити", en:"choose what to do" },
          { w:"I wish I knew…", ua:"Хотів би я знати…", en:"I really want to know, but I don't" }
        ]
      },
      pre:[
        { q:"What do you think the letter is about?", ua:"Як ти думаєш, про що цей лист?", starter:"I think the letter is about…",
          ex:"I think it's about a new school, maybe a sports school.", fu:["Why does Dad think it could change his whole life?"] },
        { q:"Do you think Dad is excited or worried?", ua:"Як ти думаєш, тато радіє чи хвилюється?", pick:["Excited 😃", "Worried 😟", "Both 😃😟"], starter:"I think he's … because…",
          ex:"I think he's both — excited because it's a great chance, but worried because the academy is far away.", fu:["Which words in the diary show his feelings?"] },
        { q:"What would you do in his situation?", ua:"Що б ти зробив / зробила на його місці?", starter:"I think I'd…",
          ex:"I think I'd go. It's a great chance, and I could come home in the holidays.", fu:["Who would you ask for advice?"] }
      ],
      post:[
        { kind:"mcq", q:"What opportunity did Dad receive?", ua:"Яку можливість отримав тато?",
          o:["A place at a sports academy in another city", "A job in a sports shop", "A ticket to a big football match"], a:0,
          hint:"Read the third line again.", why:"Westbridge Sports Academy wanted him to join their training programme." },
        { kind:"oral", q:"Why was he worried?", ua:"Чому він хвилювався?", starter:"He was worried because…",
          hint:"Look at the lines that start with “What if…?”",
          ex:"He was worried because the academy was far from his family and friends, and he wasn't sure he was as good as the other students.",
          fu:["Would you feel the same?"] },
        { kind:"mcq", q:"Did he think he was good enough?", ua:"Чи вважав він, що достатньо хороший?",
          o:["Yes — he was sure he was the best.", "He wasn't sure. He was afraid he wasn't as good as the others.", "He didn't care about it."], a:1,
          hint:"Find “as good as” in the diary.", why:"He wrote: “What if I'm not as good as the other students?”" },
        { kind:"oral", q:"What decision did he have to make?", ua:"Яке рішення він мав ухвалити?", starter:"He had to decide…",
          hint:"Read the hidden lines again.",
          ex:"He had to decide by Friday: go to the academy in another city or stay at home.",
          fu:["Is it a difficult decision for a seventeen-year-old? Why?"] }
      ],
      prompts:["What makes this opportunity special?", "Why might leaving home be difficult?", "What would you tell him?"],
      endLine:"One diary entry. One life-changing decision. But what happened next?",
      teacher:"<p><b>Мета:</b> повернення в історію, прогноз, читання щоденника. <b>6 хв</b> (повідомлення 1 · прогноз 2 · читання й питання 3).</p><details><summary>Як вести</summary><p>Повідомлення тата — те саме, що наприкінці Уроку 8. Учень натискає <b>OPEN THE LAST PAGE</b>. На сторінці щоденника останні три рядки закриті смужкою паперу: спершу три питання-прогнози (два — усно), потім <b>REVEAL THE HIDDEN WORDS</b>. Попросіть прочитати запис уголос.</p></details><details><summary>Дата</summary><p>Запис датовано 24.08.1998 — раніше за щоденник 7.11.1998 з Уроку 8. Тато сховав цю сторінку в самому кінці зошита. Марко помічає це сам (примітка на сторінці).</p></details><details><summary>Факти</summary><p>Тато (Dan, Daniel) — 17 років у 1998. Підпис «D.» — Dan. Марку 14.</p></details>"
    },

    /* ========== STAGE 2 · A LIFE IN PIECES 🕰️ ========== */
    {
      id:"life", n:2, section:"s2", min:8, type:"vocabulary", emoji:"🕰️",
      title:"A Life in Pieces",
      intro:"Rebuild Dad's life timeline. Put the events in order — from the earliest to the latest.",
      ua:"Віднови хронологію життя тата. Розстав події по порядку — від найранішої до найпізнішої.",
      events:[
        { id:"team", t:"Dad joined his school sports team in 1997.", y:"1997" },
        { id:"invite", t:"Dad received the academy invitation in August 1998.", y:"Aug 1998" },
        { id:"ticket", t:"Dad bought a train ticket in August 1998.", y:"Aug 1998" },
        { id:"stay", t:"Dad decided to stay in his hometown in September 1998.", y:"Sep 1998", life:"leave home", say:"In 1998, Dad didn't leave home." },
        { id:"job", t:"Dad got his first job in 2003.", y:"2003", life:"get a job", say:"In 2003, Dad got a job." },
        { id:"mum", t:"Dad met Marko's mother in 2007.", y:"2007", life:"get married", say:"After they met, Dad and Mum got married." },
        { id:"family", t:"Dad started a family some years later.", y:"later", life:"have children", say:"Later, they had children — Marko!" }
      ],
      start:["job", "ticket", "family", "team", "stay", "invite", "mum"],
      hints:{
        invite:"Think: what happened first — the letter or the ticket?",
        ticket:"You buy a ticket after you get the invitation.",
        family:"“Some years later” — later than what?",
        mum:"Dad met Mum before they started a family."
      },
      difficult:{ q:"Which event was probably the most difficult for Dad? Why?", ua:"Яка подія, мабуть, була найважчою для тата? Чому?",
        starter:"I think the most difficult event was … because…",
        ex:"I think deciding to stay was the most difficult event because he really wanted to go, but he was scared.",
        fu:["Was buying the ticket a difficult moment too?", "Which event was probably the happiest?"] },
      future:{
        dad:["didn't leave home in 1998", "got a job", "got married", "had children"],
        frames:[
          { t:"One day, I want to…", ex:"One day, I want to get a driving licence and travel around Ukraine." },
          { t:"I think I'll … when I'm older.", ex:"I think I'll go to university when I'm older." },
          { t:"I'm not ready to … yet because…", ex:"I'm not ready to leave home yet because I'm only fourteen!" },
          { t:"For me, the most important life event is…", ex:"For me, the most important life event is getting a job I love." }
        ],
        fu:["When do you think you'll be ready for that?", "Why is that event so important to you?", "Would you like to leave your hometown one day?", "Is it better to live near your family or far away? Why?"]
      },
      transition:"The timeline is complete. But three objects are still unexplained.",
      teacher:"<p><b>Мета:</b> повторити 13 виразів про життєві події (Урок 7) через історію тата. <b>8 хв</b> (таймлайн 4 · говоріння 4).</p><details><summary>Ключ</summary><p>team 1997 → invitation Aug 1998 → ticket Aug 1998 → stay Sep 1998 → job 2003 → met Mum 2007 → family later. Події «invitation» і «ticket» — обидві в серпні: логіка — спершу лист, потім квиток.</p></details><details><summary>Як вести</summary><p>Картки можна перетягувати або рухати стрілками ▲▼ (зручно на телефоні й з клавіатури). <b>Check</b> показує, які картки на місці. Після розв'язання на картках з'являються вирази з Уроку 7 — попросіть сказати їх реченнями: <i>In 2003, Dad got a job.</i></p></details><details><summary>Пастка</summary><p>«Stay in his hometown» = <b>didn't leave home</b>. Перша подія (спортивна команда) — не вираз з Уроку 7, а спортивна віха.</p></details>"
    },

    /* ========== STAGE 3 · THE MISSING PIECES 🔎 ========== */
    {
      id:"clues", n:3, section:"s3", min:8, type:"reading", emoji:"🔎",
      title:"The Missing Pieces",
      objects:[
        { id:"letter", t:"The Letter", s:"An envelope from Westbridge Sports Academy",
          head:"Westbridge Sports Academy",
          body:["Dear Daniel,", "Congratulations! We are pleased to offer you a place on our September 1998 training programme.", "We believe you have the talent and determination to become an excellent athlete.", "Please confirm your decision by Friday, 28 August.", "We hope to welcome you soon.", "Best wishes,", "Admissions Team"],
          q:"What does this letter prove?", ex:"It proves that the academy offered Dad a place. They thought he had talent." },
        { id:"ticket", t:"The Ticket", s:"A train ticket dated August 1998",
          rows:[["Destination", "Westbridge"], ["Date", "31 August 1998"], ["Status", "Unused"]],
          q:"What does the word “unused” tell us?", ex:"It tells us he never got on the train. He didn't go." },
        { id:"photo", t:"The Photograph", s:"Dad with his school sports team",
          front:"School football team · 1997", back:"You were good enough. Don't forget that.", from:"— Alex, No. 9",
          q:"Who wrote the message, and what did he mean?", ex:"Alex wrote it. He meant that Dad was a good player — he could go to the academy." }
      ],
      facts:[
        { t:"Dad received an offer from the academy.", a:"fact", why:"Correct! The letter from the academy proves it." },
        { t:"Dad bought a ticket to Westbridge.", a:"fact", why:"Correct! We have the ticket — that's real evidence." },
        { t:"Dad was definitely the best athlete in his school.", a:"guess", why:"It's a guess. The academy says he had talent, but nothing says he was the best in his school." },
        { t:"Dad did not use the train ticket.", a:"fact", why:"Correct! The ticket says “Unused”." },
        { t:"Dad stayed home because he hated sports.", a:"guess", why:"It's a guess — and probably a wrong one! He dreamed of becoming a great athlete." },
        { t:"Dad was worried about leaving his family.", a:"fact", why:"Correct! The diary tells us he was worried about leaving home." }
      ],
      wrong:{ fact:"Look again — one of the clues proves this. Check the letter, the ticket or the diary.", guess:"Not quite. The story doesn't give us enough information to know this." },
      reveal:[
        { sys:"Sunday · 22:15" },
        { who:"dad", t:"I bought the ticket, Marko." },
        { who:"dad", t:"But I never got on the train." },
        { who:"dad", t:"I stayed home because I was scared." },
        { who:"dad", t:"For years, I thought I wasn't brave enough." },
        { who:"dad", t:"Your mum doesn't know about the offer. We met years later, and I never found the right moment to tell her." },
        { who:"dad", t:"I want to explain it to her myself." }
      ],
      talk:[
        { q:"Do you understand Dad's decision?", ua:"Ти розумієш рішення тата?", starter:"Yes, I understand it because… / Not really, because…",
          ex:"Yes, I do. He was only seventeen, and leaving home is scary.", fu:["What would make it easier for him?"] },
        { q:"Was staying home the wrong choice?", ua:"Залишитися вдома — це був неправильний вибір?", starter:"I don't think it was wrong because… / I think it was…",
          ex:"I don't think it was wrong. He had a different life, and it was good too.", fu:["Can a choice be right AND sad at the same time?"] },
        { q:"Do you think he should feel ashamed?", ua:"Як ти думаєш, чи має він соромитися?", starter:"No, he shouldn't, because…",
          ex:"No, he shouldn't. Everybody is scared sometimes.", fu:["Why do people keep old decisions secret?"] },
        { q:"What advice would you give him now?", ua:"Яку пораду ти дав би / дала б йому зараз?", starter:"I'd tell him…",
          ex:"I'd tell him to talk to Mum. She'll understand.", fu:["Is it too late to try something new?"] }
      ],
      transition:"To understand Dad's decision, we need to compare his choices.",
      teacher:"<p><b>Мета:</b> читання доказів, розрізнення факту й припущення, обговорення. <b>8 хв</b> (докази 3 · Fact or Guess 2 · повідомлення й розмова 3).</p><details><summary>Докази</summary><p>Лист (Dear Daniel = Dan), квиток (31.08.1998, Unused), фото команди 1997 року — переверніть, щоб прочитати напис від Alex (друг з Уроків 5–6, грав у команді).</p></details><details><summary>Fact or Guess — ключ</summary><p>1 F · 2 F · 3 G · 4 F · 5 G · 6 F. Просіть пояснити: <i>How do we know?</i></p></details><details><summary>Думки</summary><p>Не наполягайте на одній «правильній» думці. Тато не «невдаха»: він обрав інше життя.</p></details><details><summary>Якщо учень питає про «A.» з Уроку 8</summary><p>A. — це Anna з Уроку 6, подруга компанії, яка переїхала до Канади. До таємниці академії вона стосунку не має.</p></details>"
    },

    /* ========== STAGE 4 · THE COMPARISON CHALLENGE ⚖️ ========== */
    {
      id:"grammar", n:4, section:"s4", min:8, type:"grammar", emoji:"⚖️",
      title:"The Comparison Challenge",
      guide:[
        { k:"Comparatives", f:"short adj + <b>-er</b> · <b>more</b> + long adj · + <b>than</b>",
          en:"We use comparatives to compare two people, places, or situations.", ex:"Life today is more connected than life in 1998.",
          ua:"Порівняльний ступінь використовуємо для порівняння двох речей." },
        { k:"Superlatives", f:"<b>the</b> + adj + <b>-est</b> · <b>the most</b> + long adj",
          en:"We use superlatives to say something is number one in a group.", ex:"This was one of the biggest decisions of Dad's life.",
          ua:"Найвищий ступінь показує, що щось вирізняється найбільше серед інших." },
        { k:"(Not) as … as", f:"<b>as</b> + adj + <b>as</b> = the same · <b>not as</b> + adj + <b>as</b> = less",
          en:"We use “as … as” when two things are equal, and “not as … as” when they are different.", ex:"Living in another city wasn't as easy as staying home.",
          ua:"Використовуємо для порівняння однакової або неоднакової міри ознаки." },
        { k:"Too", f:"<b>too</b> + adjective",
          en:"Too means more than we want or need. It often causes a problem.", ex:"Dad was too nervous to leave home.",
          ua:"Занадто: більше, ніж потрібно, часто заважає щось зробити." },
        { k:"Enough", f:"adjective + <b>enough</b> · <b>enough</b> + noun",
          en:"Enough means as much as we need.", ex:"Dad didn't feel brave enough. · He didn't have enough confidence.",
          ua:"Достатньо: потрібна кількість або міра." }
      ],
      order:["too + adjective", "adjective + enough", "enough + noun"],
      gap:[
        { q:"Travelling in 2026 is usually ___ than it was in 1998.", o:["more easy", "easier", "easy", "the easiest"], a:1,
          hint:"Two things + than → comparative. Easy is short and ends in -y.", why:"easy → easier. Short adjective + -er, and “than” after it.", ua:"easy — коротке слово на -y: easier than." },
        { q:"Dad thought the academy was one of ___ opportunities of his life.", o:["better", "the most good", "the best", "best"], a:2,
          hint:"“One of …” = number one in a group → superlative.", why:"good → better → the best. “One of the best” + plural noun.", ua:"good — неправильний: the best. «Один з найкращих»." },
        { q:"He wasn't sure he was ___ the other athletes.", o:["as better as", "good as", "so good than", "as good as"], a:3,
          hint:"Equal or not? as + normal adjective + as.", why:"(not) as + adjective + as. The adjective doesn't change: as good as.", ua:"as + прикметник у звичайній формі + as." },
        { q:"He felt ___ nervous to leave home.", o:["enough", "too", "as", "more"], a:1,
          hint:"It was a problem — he couldn't leave.", why:"too + adjective + to = more than he wanted, so it stopped him.", ua:"too + прикметник: занадто, і це заважає." },
        { q:"He didn't think he was brave ___ to move away.", o:["too", "as", "enough", "than"], a:2,
          hint:"Word order: adjective + …", why:"adjective + enough: brave enough (not “enough brave”).", ua:"Прикметник + enough: brave enough." },
        { q:"Moving to another city wasn't ___ easy as staying home.", o:["more", "than", "too", "as"], a:3,
          hint:"Look at the end of the sentence: … easy as …", why:"not as + adjective + as. Moving was less easy than staying.", ua:"not as … as — не такий …, як." }
      ],
      fix:[
        { bad:"Dad wasn't enough confident to leave home.", mark:"enough confident", good:"Dad wasn't confident enough to leave home.",
          o:["Dad wasn't confident enough to leave home.", "Dad wasn't too confident enough to leave home.", "Dad wasn't enough confidenter to leave home."], a:0,
          hint:"Enough goes AFTER an adjective.", why:"adjective + enough: confident enough.", ua:"Enough стоїть після прикметника: confident enough." },
        { bad:"Living alone was more harder than staying home.", mark:"more harder", good:"Living alone was harder than staying home.",
          o:["Living alone was more hard than staying home.", "Living alone was harder than staying home.", "Living alone was the hardest than staying home."], a:1,
          hint:"Hard is short. Do we need “more”?", why:"Short adjectives take -er. Don't use more + -er together: harder (not more harder).", ua:"Коротке слово: harder. «More» + «-er» разом не вживаємо." }
      ],
      create:{
        starters:["Moving away was…", "Staying home wasn't as…", "Dad was too…", "He wasn't … enough to…"],
        tags:["comparative", "superlative", "(not) as … as", "too", "enough"],
        ex:["Moving away was more difficult than staying at home.", "Staying home wasn't as exciting as going to the academy.", "Dad was too scared to get on the train.", "He wasn't confident enough to leave his friends.", "It was one of the hardest decisions of his life."]
      },
      transition:"You know what happened. Now Marko needs your advice.",
      teacher:"<p><b>Мета:</b> повторення граматики Уроку 8 в контексті історії. <b>8 хв</b> (A 4 · B 2 · власні речення 2).</p><details><summary>Ключ A</summary><p>1 easier · 2 the best · 3 as good as · 4 too · 5 enough · 6 as.</p></details><details><summary>Ключ B</summary><p>1 confident enough · 2 harder (без more).</p></details><details><summary>Як вести</summary><p>Учень обирає варіант у кожному реченні, потім <b>Check answers</b>. <b>Retry incorrect</b> очищає лише помилки. <b>Hint</b> — підказка до перевірки, <b>Why?</b> — пояснення після. Рахунок — <b>Grammar Challenge: n/8</b>. Власні речення не оцінюються автоматично — оцінюєте ви.</p></details><details><summary>Пастки</summary><p><i>enough confident</i> ✗ · <i>more harder</i> ✗ · <i>as better as</i> ✗ · <i>the most good</i> ✗.</p></details>"
    },

    /* ========== STAGE 5 · THE BIG DECISION 💬 ========== */
    {
      id:"decision", n:5, section:"s5", min:10, type:"speaking", emoji:"💬",
      title:"The Big Decision",
      marko:[
        { sys:"Sunday · 22:40" },
        { who:"marko", t:"I think I understand why Dad stayed home." },
        { who:"marko", t:"But I don't know what to do now." },
        { who:"marko", t:"He wants to tell Mum, but he's nervous." },
        { who:"marko", t:"Should I encourage him to talk to her today?" },
        { who:"marko", t:"Or should I suggest writing a message first?" },
        { who:"marko", t:"What do you think?" }
      ],
      options:[
        { id:"talk", k:"A", t:"TALK TODAY", e:"🗣️", adv:["Dad can explain his feelings directly.", "Mum can ask questions.", "They can discuss everything together."], diff:"Dad might feel nervous speaking about the past." },
        { id:"write", k:"B", t:"WRITE FIRST", e:"✉️", adv:["Dad can think carefully about his words.", "Writing may feel less stressful.", "Mum can read his explanation calmly."], diff:"His emotions might be harder to explain in writing." }
      ],
      qs:[
        { q:"Which option is better for Dad?", ua:"Який варіант кращий для тата?", starter:"I think Option … is better because…",
          ex:"I think Option B is better because Dad can think carefully about his words.", fu:["Why is that the most important thing for him?"] },
        { q:"Which one is easier?", ua:"Який із них легший?", starter:"I think … is easier than … because…",
          ex:"Writing is easier than talking because you can stop and think.", fu:["Easier for Dad — or for Mum?"] },
        { q:"Is Dad confident enough to talk today?", ua:"Чи достатньо тато впевнений, щоб поговорити сьогодні?", starter:"I think he is / isn't confident enough because…",
          ex:"I think he's confident enough. He told Marko the truth, so he can tell Mum.", fu:["What could help him feel more confident?"] },
        { q:"Could writing a message be as helpful as speaking?", ua:"Чи може повідомлення бути таким же корисним, як розмова?", starter:"Writing could be just as helpful because… / Writing isn't as … as…",
          ex:"A message isn't as personal as a conversation, but it can be just as helpful.", fu:["When do you prefer writing to talking?"] },
        { q:"What would you do if you were Marko?", ua:"Що б ти зробив / зробила на місці Марка?", starter:"I think I'd…",
          ex:"I think I'd sit with Dad and help him plan what to say.", fu:["Would you stay in the room when Dad talks to Mum?"] },
        { q:"Do you think people should always talk about their old mistakes?", ua:"Як ти думаєш, чи варто людям завжди говорити про свої старі помилки?", starter:"I think people should… because…",
          ex:"Not always, but if a secret makes you unhappy, it's better to talk about it.", fu:["Was Dad's decision really a mistake?"] }
      ],
      starters:["I think Option … is better because…", "Talking is more … than writing because…", "Dad might feel too … to…", "I believe he is … enough to…", "In my opinion…", "Another reason is…"],
      checklist:["Gave a clear opinion", "Gave at least two reasons", "Used a comparative or (not) as … as", "Used too or enough", "Answered a follow-up question"],
      teacher:"<p><b>Мета:</b> головне говоріння уроку — порада й обґрунтування. <b>10 хв</b> (варіанти 2 · питання 6 · рішення 2).</p><details><summary>Як вести</summary><p>Спершу учень читає обидва варіанти вголос і порівнює. Потім питання по одному: учень відповідає щонайменше двома причинами, ви ставите додаткові питання. Таймер 60 с — для «довгої відповіді» без зупинок. Чек-лист бачите лише ви.</p></details><details><summary>Рішення</summary><p>Вибір учня (A — Talk today або B — Write first) зберігається й визначає кінцівку в етапі 7. Його можна змінити, повернувшись сюди.</p></details><details><summary>Зразки</summary><p>A: <i>Talking is more personal than writing. Mum can ask questions straight away.</i> · B: <i>Dad might feel too nervous to talk. Writing isn't as stressful as speaking.</i></p></details>"
    },

    /* ========== STAGE 6 · THE EMAIL TO MARKO ✉️ ========== */
    {
      id:"email", n:6, section:"s6", min:12, type:"mission", emoji:"✉️",
      title:"The Email to Marko",
      marko:[
        { who:"marko", t:"Thanks for helping me understand Dad's story." },
        { who:"marko", t:"Could you send me an email with your advice?" },
        { who:"marko", t:"Tell me what you think I should do." },
        { who:"marko", t:"I really want to help him." }
      ],
      to:"Marko", subject:"My Advice",
      wmin:80, wmax:100,
      task:["Greet Marko in a friendly way.", "Explain what you think about Dad's decision in 1998.", "Compare two possible ways to talk to Mum.", "Recommend one option.", "Give reasons for your recommendation.", "Finish the email naturally."],
      lang:["At least one comparative structure", "At least one example of too or enough", "At least two life-event expressions", "At least two informal email phrases"],
      structure:[
        { k:"Opening", items:["Hi Marko!", "Hey Marko!", "It's great to hear from you!"] },
        { k:"Main paragraph", items:["I think…", "In my opinion…", "I understand why…", "One reason is…"] },
        { k:"Giving advice", items:["I think you should…", "Maybe you could…", "Why don't you…?", "It might be better to…"] },
        { k:"Ending", items:["I hope this helps!", "Let me know what happens!", "Write soon!", "Take care!"] }
      ],
      grammar:["Talking is more personal than texting.", "Writing might not be as stressful as speaking.", "Dad might be too nervous to talk immediately.", "He's brave enough to tell the truth."],
      sample:"Hi Marko!\n\nThanks for your message. I understand why your dad didn't leave home in 1998. He was only seventeen, and he was too nervous to move to another city. But later he got a job, got married and had you, so his life is great!\n\nTalking is more personal than writing, but a letter might not be as stressful for him. I think he should write a short letter first. Then your mum can read it calmly, and they can talk.\n\nLet me know what happens!\nSofia",
      teacher:"<p><b>Мета:</b> неформальний email 80–100 слів. <b>12 хв</b> (план 2 · письмо 8 · перевірка й «надсилання» 2).</p><details><summary>Як вести</summary><p>Спершу усно пройдіть 6 пунктів завдання. Допомога — три розділи над полем (структура, граматика, слова). Учень сам відмічає чек-лист — автоматичної оцінки немає, оцінюєте ви. Лічильник слів показує, чи текст потрібної довжини.</p></details><details><summary>Зразок</summary><p>Кнопка <b>🧑‍🏫 Sample email</b> є лише в Teacher view — краще показати після спроби учня.</p></details><details><summary>Надсилання</summary><p><b>SEND YOUR ADVICE</b> — сюжетна дія: лист нікуди не надсилається, він лишається в прогресі уроку (як і чернетка). <b>Copy email</b> — якщо учень хоче зберегти текст собі.</p></details><details><summary>Якщо мало часу</summary><p>Учень пише 3–4 речення, решту — вдома. Чернетка збережеться.</p></details>"
    },

    /* ========== STAGE 7 · THE TRUTH COMES OUT 🌅 ========== */
    {
      id:"truth", n:7, section:"s7", min:5, type:"cliffhanger", emoji:"🌅",
      title:"The Truth Comes Out",
      endA:{
        k:"ENDING A · THE CONVERSATION", place:"The living room · Sunday evening",
        lines:[
          { who:"dad", t:"Can we talk for a minute? There's something I want to tell you." },
          { who:"mum", t:"Of course. What is it?" },
          { who:"dad", t:"I had a chance to join a sports academy in 1998, but I was too afraid to leave home." },
          { who:"mum", t:"You never told me that." },
          { who:"dad", t:"I thought you'd be disappointed." },
          { who:"mum", t:"Of course not. One decision doesn't define your whole life." },
          { who:"mum", t:"And I love the life we have now." },
          { who:"dad", t:"Thank you. I feel much better now." }
        ],
        outro:"Marko smiles. Speaking openly was the right choice for his family."
      },
      endB:{
        k:"ENDING B · THE LETTER", place:"The kitchen · Sunday night",
        letter:["There's something I should have told you years ago.", "When I was seventeen, I had a chance to join a sports academy.", "I didn't go because I was scared.", "For a long time, I thought I wasn't brave enough.", "I want to share this story with you now because it's part of who I am."],
        sign:"— Dan",
        after:[
          { sys:"Monday · 07:30" },
          { who:"mum", t:"I read your letter last night. Thank you for telling me." },
          { who:"dad", t:"Are you disappointed?" },
          { who:"mum", t:"Not at all. I care more about the person you became than the opportunity you missed." }
        ],
        outro:"Marko understands: sometimes writing helps people begin a difficult conversation."
      },
      final:["Thanks for helping me, Marko.", "Maybe I didn't become a professional athlete.", "But I learned something important.", "Life isn't about making the perfect choice every time.", "It's about learning, growing, and moving forward.", "And remember — it's never too late to try something new."],
      reflect:[
        { q:"What did Dad learn from his experience?", ua:"Чого тато навчився зі свого досвіду?", starter:"He learned that…", ex:"He learned that one decision doesn't define your whole life." },
        { q:"Do you think his decision was a mistake?", ua:"Як ти думаєш, його рішення було помилкою?", starter:"I think it was / wasn't a mistake because…", ex:"I don't think it was a mistake. It was just a different path." },
        { q:"What's one important choice you'd like to make in your future?", ua:"Який важливий вибір ти хотів би / хотіла б зробити в майбутньому?", starter:"One day, I'd like to…", ex:"One day, I'd like to choose a university in another country." }
      ],
      achievements:[
        { id:"life", t:"Life Events Explorer", s:"Vocabulary", e:"🕰️" },
        { id:"compare", t:"Comparison Expert", s:"Grammar", e:"⚖️" },
        { id:"decide", t:"Story Decision Maker", s:"Speaking & Writing", e:"🧭" }
      ],
      cando:["I can talk about important life events.", "I can compare different situations.", "I can use too and enough.", "I can write an informal email.", "I can express and explain my opinions."],
      teaser:{
        time:"Monday · 07:52",
        from:"SCHOOL ANNOUNCEMENTS",
        subject:"CHAMPIONS WEEK IS COMING! 🏆",
        body:["Hey Marko!", "Are you ready for a new challenge?", "Our school is looking for students to join Champions Week.", "You don't have to be the best.", "You just have to try!", "Interested? Find out more tomorrow."],
        caption:"Dad once had a chance to become a champion. Now it's Marko's turn.",
        next:{ k:"NEXT EPISODE", t:"Unit 4 — Champions 🏆", s:"Champions Week starts. Who will try — and who will win?" }
      },
      teacher:"<p><b>Мета:</b> кінцівка за вибором учня, рефлексія, підсумок Unit 3, гачок на Unit 4. <b>5 хв.</b></p><details><summary>Кінцівки</summary><p>A (Talk today) — розмова у вітальні. B (Write first) — лист тата й ранкова розмова. Обидві позитивні. У Teacher view можна переглянути іншу кінцівку; учень може змінити рішення, повернувшись в етап 5.</p></details><details><summary>Рефлексія</summary><p>Учень обирає одне-два питання. Відповіді відкриті.</p></details><details><summary>Unit 3</summary><p>Досягнення — лише візуальні позначки, не оцінки. Can-do — учень сам відмічає, у чому почувається впевнено.</p></details><details><summary>Анонс</summary><p>Champions Week — початок Unit 4. Лексику й граматику Unit 4 тут не починаємо: лише спитайте <i>Would you join Champions Week? Why?</i></p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/lastpage.js) ---------- */
  screens(add, st){
    const p = st("page");
    add(p, "lpOpen", { key:"open", store:"open", world:"26" });
    add(p, "lpDiary", { key:"diary", store:"diary", world:"98" }, "Predictions are open. Hidden lines: not brave enough to leave home · decide by Friday · I wish I knew what to do.");
    add(p, "lpDiaryQs", { key:"qs", store:"qs", world:"98" }, "1 A place at a sports academy · 2 far from family and friends; not sure he was as good as the others · 3 He wasn't sure · 4 go or stay — by Friday");

    const l = st("life");
    add(l, "lpTimeline", { key:"timeline", store:"timeline", world:"98" }, "team 1997 → invitation → ticket → stay (Sep 1998) → job 2003 → met Mum 2007 → family");
    add(l, "lpFuture", { key:"future", store:"future", world:"26" }, "Open answers — 4 sentence frames, life-event phrases");

    const c = st("clues");
    add(c, "lpDesk", { key:"desk", store:"desk", world:"98" }, "Letter: offer of a place · Ticket: 31 Aug 1998, unused · Photo: “You were good enough” — Alex");
    add(c, "lpFacts", { key:"facts", store:"facts", world:"98" }, "1 F · 2 F · 3 G · 4 F · 5 G · 6 F");
    add(c, "lpReveal", { key:"reveal", store:"reveal", world:"26" }, "Open opinions — no single correct answer");

    const g = st("grammar");
    add(g, "lpGap", { key:"gap", store:"gap", world:"mix" }, "1 easier · 2 the best · 3 as good as · 4 too · 5 enough · 6 as");
    add(g, "lpFix", { key:"fix", store:"fix", world:"mix" }, "1 confident enough · 2 harder");
    add(g, "lpCreate", { key:"create", store:"create", world:"mix" }, g.create.ex.join(" · "));

    const d = st("decision");
    add(d, "lpLab", { key:"lab", store:"lab", world:"26" });
    add(d, "lpTalk", { key:"talk", store:"talk", world:"26" }, d.qs.map((q, i) => (i + 1) + " " + q.ex).join(" · "));
    add(d, "lpChoose", { key:"choose", store:"choose", world:"26" });

    const e = st("email");
    add(e, "lpEmail", { key:"email", store:"email", world:"26" }, "80–100 words · comparative · too / enough · 2 life events · 2 informal phrases");

    const t = st("truth");
    add(t, "lpEnding", { key:"ending", store:"ending", world:"mix" });
    add(t, "lpSunrise", { key:"sunrise", store:"sunrise", world:"dawn" }, t.reflect.map(q => q.ex).join(" · "));
    add(t, "lpUnit", { key:"unit", store:"unit", world:"dawn" });
    add(t, "lpTeaser", { key:"teaser", store:"teaser", world:"dawn" });
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const lp = (ans && ans._lp) || {};
    const tl = ans.life && ans.life.timeline;
    const desk = ans.clues && ans.clues.desk;
    const gram = ans.grammar || {};
    const gapOK = this.stages.find(s => s.id === "grammar").gap.filter((q, i) => gram.gap && gram.gap.chk && gram.gap.chk[i] && gram.gap.p && gram.gap.p[i] === q.a).length;
    const fixOK = gram.fix && gram.fix.ok ? Object.values(gram.fix.ok).filter(Boolean).length : 0;
    const em = ans.email && ans.email.email;
    const words = em && em.text ? String(em.text).trim().split(/\s+/).filter(Boolean).length : 0;
    return {
      icon:"🌅", title:"Lesson 9 complete — Unit 3 finished!",
      text:"You found the secret on the last page, gave Marko your advice and helped Dad tell the truth. And Champions Week is coming…",
      stats:[
        [tl && tl.solved ? "🕰️ solved" : "🕰️ —", "Dad's timeline"],
        [`🔎 ${desk && desk.seen ? Object.keys(desk.seen).length : 0} / 3`, "clues investigated"],
        [`⚖️ ${gapOK + fixOK} / 8`, "Grammar Challenge"],
        [lp.choice ? (lp.choice === "talk" ? "🗣️ Talk today" : "✉️ Write first") : "🧭 —", words ? `your decision · email: ${words} words` : "your decision"]
      ]
    };
  }
};
})();
