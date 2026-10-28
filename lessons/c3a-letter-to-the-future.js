/* ============================================================
   LESSON 7 · Cycle 3A · THE NEXT CHAPTER — A LETTER TO THE FUTURE ✉️⏳
   Unit 3 · My way of life — початок Unit 3 (Discover: vocabulary + reading + speaking).
   Формат — урок один на один (учень + учитель, демонстрація екрана), 60 хв, 8 розділів.
   Граматики не вчимо: порівняння (comparatives, not as … as, too / enough) з'являються
   лише в контексті текстів — їх вивчаємо в Уроці 8.

   ФАКТИ ІСТОРІЇ (узгоджені з Уроками 4–6):
   • Таємницю куртки розкрито (Урок 6): Anna — четверта подруга, пришила нашивку «A»,
     фотографувала весь вечір 21.11.1998 на City Sound, за тиждень переїхала до Канади.
   • Тато = Dan (Daniel), у 1998 році йому 17. Марку 14 (Урок 1).
   • Після Уроку 6 тато віддав куртку Маркові. У внутрішній кишені — маленький блокнот,
     а в ньому лист Dan «собі в майбутнє», написаний 31 грудня 1998 року.
   • Що з мрій тата здійснилося — свідомо лишаємо відкритим (відомо лише, що в нього є син 🙂).
     У Уроці 8 тато каже, що в 1998 підліткам жилося легше, — звідси дебати.
   • Друг, що переїхав в іншу країну (текст тата в розділі 5), — тихий натяк на Anna.

   Екрани — з js/screens/capsule.js, тема — css/capsule.css (body[data-episode-theme="capsule"]).
   Порядок екранів — у функції screens() в кінці файлу.

   КАРТИНКИ (необов'язкові). Поки поле null — показується намальована заміна, урок працює й так.
   Згенеруйте файл, покладіть у папку c3a всередині assets і впишіть шлях у MEDIA нижче.
   Підказки для генерації — у README.md, розділ «Урок 7».
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- картинки (null = намальована заміна) ---------- */
const MEDIA = {
  /* з Уроків 5–6 — уже на місці */
  jacket: "assets/c2b/jacket.webp",
  jacketAlt: "Dad's old denim jacket with gold buttons and a red patch with a white triangle.",
  photo: "assets/c2b/photo-1998.webp",
  photoAlt: "Dad's old concert photo from 21 November 1998: a smiling teenage boy in a denim jacket and a bucket hat with his arms in the air.",
  four: "assets/c2c/four-friends.webp",
  fourAlt: "An old photo of four friends — Emma, Dan, Anna and Alex — at a festival in 1998.",
  /* нові для Уроку 7 */
  letter: null,        /* старий блокнот із листом (≈4:3) — чат Марка в розділі 1 */
  room1998: null,      /* кімната підлітка 1998 (≈4:3) — розділ 5, ліва половина */
  room2026: null,      /* кімната підлітка 2026 (≈4:3) — розділ 5, права половина */
  events: {            /* 13 фото подій (квадрат) — картки Life Map; null = іконка */
    born:null, startSchool:null, leaveSchool:null, uni:null, degree:null, job:null, licence:null,
    vote:null, leaveHome:null, moveHome:null, married:null, children:null, retire:null
  }
};

/* ---------- 13 виразів (цільова лексика уроку) ---------- */
/* zone: на якому етапі життя показуємо картку на Life Map; opt — подія необов'язкова для всіх */
const LIFE = [
  { id:"born", w:"be born", zone:"child", icon:"baby", ua:"народитися", en:"to begin your life",
    ex:"My little brother was born in 2020.", re:"\\b(be|been|being|was|were|is|am|are)\\s+born\\b" },
  { id:"startSchool", w:"start school", zone:"child", icon:"bag", ua:"почати навчання у школі", en:"to begin going to school",
    ex:"I started school when I was six.", re:"\\bstart(s|ed|ing)?\\s+(primary\\s+|secondary\\s+|high\\s+|a\\s+new\\s+)?school\\b" },
  { id:"leaveSchool", w:"leave school", zone:"teen", icon:"cap", ua:"закінчити школу", en:"to finish your school education",
    ex:"My cousin left school last year, and now he's at college.", re:"\\b(leave|leaves|left|leaving)\\s+school\\b" },
  { id:"licence", w:"get a driving licence", zone:"teen", icon:"car", opt:true, ua:"отримати водійське посвідчення", en:"to get official permission to drive",
    ex:"My mum got her driving licence when she was thirty.", re:"\\b(get|gets|got|getting|gotten)\\s+(a|my|her|his|their|our|your)\\s+driving\\s+licen[cs]e\\b" },
  { id:"vote", w:"vote", zone:"teen", icon:"ballot", ua:"голосувати", en:"to choose a person or make a decision in an election",
    ex:"My grandma votes in every election.", re:"\\bvot(e|es|ed|ing)\\b" },
  { id:"uni", w:"go to university", zone:"young", icon:"uni", opt:true, ua:"вступити до університету, навчатися в університеті", en:"to study at a university",
    ex:"Olena hopes to go to university in Kyiv.", re:"\\b(go|goes|went|going|gone)\\s+to\\s+(a\\s+|the\\s+)?university\\b" },
  { id:"degree", w:"get a degree", zone:"young", icon:"diploma", opt:true, ua:"отримати диплом / освітній ступінь", en:"to finish a university course and receive a qualification",
    ex:"My sister wants to get a degree in medicine.", re:"\\b(get|gets|got|getting|gotten)\\s+(a|my|her|his|their|our|your)\\s+degree\\b" },
  { id:"leaveHome", w:"leave home", zone:"young", icon:"door", ua:"почати жити окремо від батьків", en:"to stop living with your parents and live independently",
    ex:"Many young people leave home when they start university.", re:"\\b(leave|leaves|left|leaving)\\s+home\\b" },
  { id:"job", w:"get a job", zone:"young", icon:"case", ua:"влаштуватися на роботу", en:"to find work",
    ex:"My brother got a job in a café last summer.", re:"\\b(get|gets|got|getting|gotten)\\s+(a|my|her|his|their|our|your|a\\s+good|a\\s+new|a\\s+part-time)\\s+job\\b" },
  { id:"moveHome", w:"move home", zone:"adult", icon:"box", ua:"переїхати в інше житло", en:"to change the place where you live",
    ex:"We moved home last year, so I changed schools.", re:"\\bmov(e|es|ed|ing)\\s+(home|house)\\b" },
  { id:"married", w:"get married", zone:"adult", icon:"rings", opt:true, ua:"одружитися / вийти заміж", en:"to become someone's husband or wife",
    ex:"My aunt and uncle got married in the summer.", re:"\\b(get|gets|got|getting|gotten)\\s+married\\b" },
  { id:"children", w:"have children", zone:"adult", icon:"family", opt:true, ua:"мати дітей", en:"to become a parent",
    ex:"They'd like to have children one day.", re:"\\b(have|has|had|having)\\s+(children|kids|a\\s+child|a\\s+baby|a\\s+family)\\b" },
  { id:"retire", w:"retire", zone:"later", icon:"chair", ua:"вийти на пенсію", en:"to stop working permanently, usually because of age",
    ex:"My grandad retired at 65, and now he grows tomatoes.", re:"\\bretir(e|es|ed|ing)\\b" }
];
const ZONES = [
  { id:"child", t:"Childhood", ua:"дитинство", age:"0–12" },
  { id:"teen", t:"Teenage Years", ua:"підліткові роки", age:"13–19" },
  { id:"young", t:"Young Adulthood", ua:"молодість", age:"20–30" },
  { id:"adult", t:"Adult Life", ua:"доросле життя", age:"30–60" },
  { id:"later", t:"Later Life", ua:"літній вік", age:"60+" }
];

/* ---------- 6 слів із текстів розділу 5 ---------- */
const FOCUS = [
  { w:"tiny", ua:"крихітний", en:"very small", ex:"My bedroom was tiny." },
  { w:"huge", ua:"величезний", en:"very big", ex:"Our family computer was huge." },
  { w:"awful", ua:"жахливий", en:"very bad", ex:"International phone calls were awful." },
  { w:"unbelievable", ua:"неймовірний", en:"very surprising; hard to believe", ex:"It's unbelievable how much information we have." },
  { w:"exhausted", ua:"виснажений, дуже втомлений", en:"very, very tired", ex:"After a long day, I'm often exhausted." },
  { w:"relaxed", ua:"спокійний, розслаблений", en:"calm and not worried", ex:"Life was often more relaxed." }
];

window.SIGNAL_LESSONS.c3a = {
  id: "c3a",
  cycle: 3,
  lessonType: "discover-story",
  theme: "capsule",
  title: "A Letter to the Future",
  fullTitle: "The Next Chapter — A Letter to the Future",
  subtitle: "Unit 3 · My way of life · Lesson 7",
  series: "Generation Swap",
  tagline: "The past tells a story. The future is still unwritten.",
  question: "Which of Dad's dreams came true?",
  minutes: 60,
  number: 7,
  setting: "A few days after Lesson 6. Dad gave Marko his old jacket — and there was a tiny notebook in the inside pocket.",
  media: MEDIA,
  life: LIFE,
  zones: ZONES,
  focus: FOCUS,

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["previously", "warm"],
    vocabPresentation: ["lifemap"],
    discoveryGuide: [],
    vocabPractice: ["lifemap", "timeline", "world"],
    grammar: [],
    grammarPractice: [],
    listening: [],
    reading: ["timeline", "reading"],
    speaking: ["previously", "warm", "timeline", "reading", "world", "summary"],
    mission: ["future"],
    summary: ["summary"],
    homework: []
  },
  tabs: [
    { key:"s1", label:"1 Previously on…" }, { key:"s2", label:"2 Your life" }, { key:"s3", label:"3 Life Map" },
    { key:"s4", label:"4 Timeline" }, { key:"s5", label:"5 Two generations" }, { key:"s6", label:"6 World challenge" },
    { key:"s7", label:"7 Dear Future Me" }, { key:"s8", label:"8 To be continued" }
  ],

  /* нові слова — потрапляють у My words (групи: life = Life events, feel = describing words) */
  vocab: LIFE.map(x => ({ w:x.w, ipa:"", ua:x.ua, en:x.en, ex:x.ex, g:"life" }))
    .concat(FOCUS.map(x => ({ w:x.w, ipa:"", ua:x.ua, en:x.en, ex:x.ex, g:"feel" }))),
  receptive: [],

  requires: ["c1a"],
  get characters(){
    const base = (window.SIGNAL_LESSONS.c1a || {}).characters || {};
    return Object.assign({}, base, {
      dad: { name:"Dad", img:"assets/c2b/dad-today.webp", face:{ x:50, y:29 }, look:{ hair:"short", colour:"#1E1612", skin:"#7A4B32", top:"#4D6E9C", mood:"smile" } }
    });
  },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- 8 розділів ---------- */
  stages: [

    /* ========== CHAPTER 1 · PREVIOUSLY ON… ========== */
    {
      id:"previously", n:1, section:"s1", min:4, type:"warmup",
      title:"Previously On…",
      flash:"One old jacket. One mysterious photograph. One unforgettable discovery.",
      cards:[
        { id:"jacket", t:"The Jacket", img:"jacket", line:"Dad's second-hand denim jacket — a red patch and a secret in the pocket.",
          q:"What do you remember about the old jacket?", ua:"Що ти пам'ятаєш про стару куртку?",
          ex:"It was Dad's second-hand denim jacket. It had a red patch, and there was a folded paper in the pocket.",
          fu:["Would you wear a jacket like that today?"] },
        { id:"photo", t:"The Photograph", img:"photo", line:"21 November 1998. Dad on stage — his best night ever.",
          q:"Why was the photograph important?", ua:"Чому фотографія була важливою?",
          ex:"Because it showed Dad's best night ever. It helped us find out about his friends.",
          fu:["Who took the photo? Do you remember?"] },
        { id:"discovery", t:"The Discovery", img:"four", line:"Four friends, one envelope — and the truth about Anna.",
          q:"What was the most surprising part of the mystery?", ua:"Що було найнесподіванішим у цій загадці?",
          ex:"The most surprising part was Anna. She was behind the camera, so she wasn't in the photos.",
          fu:["How do you think Dad felt when he read Anna's letter again?"] }
      ],
      chat:[
        { sys:"Today · 17:42" },
        { who:"marko", t:"Hey! Remember Dad's old jacket? 🧥" },
        { who:"marko", t:"Dad gave it to me. I thought our little adventure was over…" },
        { who:"marko", t:"But there was a tiny notebook in the inside pocket. Look what I found inside it!" },
        { who:"marko", letter:true },
        { who:"marko", t:"It's from 1998!" },
        { who:"marko", t:"My dad wrote it when he was a teenager." },
        { who:"marko", t:"It's a letter to his future self — a list of things he wanted to do in his life." },
        { who:"marko", t:"I wonder how many of his dreams came true…" }
      ],
      mission:{ k:"MISSION UNLOCKED", t:"Rebuild the Life Timeline", sub:"Discover the past. Explore the present. Imagine the future.", cta:"Open the time capsule →" },
      teacher:"<p><b>Мета:</b> пригадати історію Уроків 4–6 і зацікавити новим розділом. <b>4 хв.</b></p><details><summary>Як вести</summary><p>Учень натискає на три картки-спогади — кожна відкриває одне усне питання. Відповіді відкриті: не перевіряємо факти, а слухаємо, чи учень говорить реченнями в Past Simple. Потім — чат Марка й місія.</p></details><details><summary>Зразки відповідей</summary><p>Jacket — It was Dad's second-hand denim jacket with a red patch… · Photograph — It showed Dad's best night ever… · Discovery — Anna was behind the camera…</p></details><details><summary>Коли рухатися далі</summary><p>Достатньо 2–3 коротких відповідей. Якщо учень не пам'ятає подробиць — переказуйте самі одним реченням і йдіть далі.</p></details>"
    },

    /* ========== CHAPTER 2 · WARM-UP: YOUR LIFE, YOUR RULES ========== */
    {
      id:"warm", n:2, section:"s2", min:6, type:"speaking",
      title:"Your Life, Your Rules",
      heading:"If you could plan your future, what would it look like?",
      headingUa:"Якби ти міг / могла спланувати своє майбутнє, яким би воно було?",
      cards:[
        { id:"school", t:"School Life", icon:"cap", q:"What would you like to do after you finish school?", ua:"Чим би ти хотів / хотіла займатися після закінчення школи?",
          starter:"After I finish school, I'd like to…", ex:"After I finish school, I'd like to study IT at university and travel a bit.",
          fu:["Would you like to study in your city or in another country?"] },
        { id:"home", t:"Your Future Home", icon:"house", q:"Would you like to live in your hometown or move somewhere else? Why?", ua:"Ти хотів / хотіла б жити у своєму рідному місті чи переїхати кудись? Чому?",
          starter:"I'd like to live in… because…", ex:"I'd like to stay in Lviv because my family and friends are here. But I'd like to live abroad for a year too.",
          fu:["What's the best thing about your hometown?"] },
        { id:"job", t:"Dream Job", icon:"case", q:"What kind of job would you love to have in the future?", ua:"Яку роботу ти мрієш мати в майбутньому?",
          starter:"I'd love to be a… because…", ex:"I'd love to be a game designer because I enjoy art and computers.",
          fu:["Why does that job interest you?", "What skills would you need?", "Would you prefer working alone or with other people?"] },
        { id:"decide", t:"Big Decisions", icon:"scales", q:"Do you think teenagers should make their own important decisions?", ua:"Як ти вважаєш, чи повинні підлітки самі ухвалювати важливі рішення?",
          starter:"I think teenagers should / shouldn't… because…", ex:"I think teenagers should make some decisions, like their hobbies, but parents can help with the big ones.",
          fu:["What decision did you make on your own recently?"] },
        { id:"success", t:"Success", icon:"star", q:"What does having a successful life mean to you?", ua:"Що для тебе означає успішне життя?",
          starter:"For me, a successful life means…", ex:"For me, it means having a job I enjoy, good friends and enough time for my hobbies.",
          fu:["Do you think money is the most important part of success?"] },
        { id:"future", t:"The Future", icon:"envelope", q:"If you could send one message to your future self, what would you say?", ua:"Якби ти міг / могла надіслати одне повідомлення своєму майбутньому «я», що б ти сказав / сказала?",
          starter:"Dear future me, I hope you…", ex:"Dear future me, I hope you still play football and you're never too busy for your friends.",
          fu:["How old do you think you'll be when you read it?"] }
      ],
      outro:[
        { who:"marko", t:"Interesting! My dad had some pretty big dreams too." },
        { who:"marko", t:"Let's see what people usually do during their lives." }
      ],
      teacher:"<p><b>Мета:</b> розговорити учня про плани й рішення — тема уроку. <b>6 хв.</b></p><details><summary>Як вести</summary><p>Порядок карток обираєте ви або учень. Достатньо 3–4 карток. У кожній: 🇺🇦 переклад (за потреби), початок відповіді, додаткове питання. Зразок відповіді бачите лише ви (Teacher view).</p></details><details><summary>На що звернути увагу</summary><p><i>I'd like to… / I'd love to… / I hope to…</i> — ці фрази знадобляться в листі (розділ 7). Не виправляйте граматику на цьому етапі, лише перефразовуйте.</p></details><details><summary>Коли рухатися далі</summary><p>Через 5–6 хв натисніть <b>Finish the warm-up</b> — прийде повідомлення від Марка.</p></details>"
    },

    /* ========== CHAPTER 3 · VOCABULARY: UNLOCK THE LIFE MAP ========== */
    {
      id:"lifemap", n:3, section:"s3", min:10, type:"vocabulary",
      title:"Unlock the Life Map",
      intro:"Tap each life event on the map. Learn what it means — then match the meanings.",
      note:"This is one possible life path. Some events are optional, and they can happen in a different order. Everyone's life is different!",
      noteUa:"Це лише один можливий життєвий шлях. Деякі події необов'язкові й можуть статися в іншому порядку. У кожного життя своє!",
      match:[
        { w:"get a driving licence", d:"receive permission to drive", h:"What do you need before you can drive a car?" },
        { w:"retire", d:"stop working when you are older", h:"What do people do at the end of their working life?" },
        { w:"get a degree", d:"finish university and receive a qualification", h:"Think about what happens at the end of university." },
        { w:"vote", d:"choose someone in an election", h:"What do people do in an election?" },
        { w:"move home", d:"start living in a different house", h:"Home = the place where you live." },
        { w:"get married", d:"become someone's husband or wife", h:"Think about a wedding." }
      ],
      outro:[
        { who:"marko", t:"Great! Now we can finally understand my dad's letter." },
        { who:"marko", t:"But there's a problem…" },
        { who:"marko", t:"The pages are out of order! 😬" }
      ],
      teacher:"<p><b>Мета:</b> 13 виразів про життєві події: значення, переклад, приклад. <b>10 хв</b> (Life Map 6 хв · Match the Meaning 4 хв).</p><details><summary>Як вести</summary><p>Учень натискає на картки по черзі (зручно йти зліва направо — від дитинства до літнього віку). Просіть прочитати приклад уголос і сказати власне речення: <i>My mum got her driving licence when…</i></p></details><details><summary>Важливо</summary><p>Підкресліть: не всі ці події обов'язкові (університет, шлюб, діти — особистий вибір), і порядок буває різним. Позначка <b>optional</b> на картках — саме про це.</p></details><details><summary>Пастки</summary><p><b>leave home</b> — почати жити окремо від батьків; <b>move home</b> — переїхати в інше житло (з батьками теж). <b>get a degree</b> ≠ <b>go to university</b>: ступінь — наприкінці навчання.</p></details><details><summary>Коли рухатися далі</summary><p>Коли відкрито ≈10 карток, переходьте до Match the Meaning — решту відкриєте пізніше.</p></details>"
    },

    /* ========== CHAPTER 4 · THE TIMELINE PUZZLE ========== */
    {
      id:"timeline", n:4, section:"s4", min:8, type:"vocabulary",
      title:"The Timeline Puzzle",
      intro:"Help Marko put the life events in a possible order.",
      partA:{ order:["born", "startSchool", "leaveSchool", "uni", "degree", "retire"], start:["degree", "retire", "startSchool", "uni", "born", "leaveSchool"],
        note:"This is one common path — not a rule for everyone's life." },
      partB:{
        events:["job", "licence", "vote", "leaveHome", "moveHome", "married", "children"],
        ok:{
          job:["teen", "young", "adult", "later"], licence:["teen", "young", "adult", "later"], vote:["teen", "young", "adult", "later"],
          leaveHome:["teen", "young", "adult", "later"], moveHome:["child", "teen", "young", "adult", "later"],
          married:["young", "adult", "later"], children:["young", "adult"]
        },
        hints:{
          job:{ child:"Can a small child get a job? Think about it 🙂" },
          licence:{ child:"Can a child drive a car? Try another place." },
          vote:{ child:"Children can't vote in elections. Try another place." },
          leaveHome:{ child:"Small children live with their parents. Try another place." },
          married:{ child:"Hmm — children don't get married! Try another place.", teen:"Most people get married when they are adults. Try a later place." },
          children:{ child:"Hmm — children don't have children! Try another place.", teen:"Most people become parents when they are adults. Try a later place.", later:"In later life, people often have grandchildren! Try an earlier place." }
        }
      },
      reflect:[
        { q:"Which life event do you think is the most exciting?", ua:"Яка подія в житті, на твою думку, найзахопливіша?", starter:"I think … is the most exciting because…",
          ex:"I think getting a driving licence is the most exciting because you can go anywhere.", fu:["Why?", "When would you like it to happen?"] },
        { q:"Which event would you like to experience first?", ua:"Яку подію ти хотів / хотіла б пережити першою?", starter:"First, I'd like to…",
          ex:"First, I'd like to get a driving licence. Then I'd like to leave home and go to university.", fu:["And what comes after that?"] },
        { q:"Do you think everyone should go to university?", ua:"Як ти думаєш, чи кожен має вступати до університету?", starter:"I think / don't think… because…",
          ex:"No, I don't. Some people want to learn a trade or start their own business, and that's OK.", fu:["What can people do instead?"] },
        { q:"Can a person's plans change? Why?", ua:"Чи можуть плани людини змінитися? Чому?", starter:"Yes, they can, because…",
          ex:"Yes, they can. People meet new friends, find new interests or move to another city.", fu:["Have your plans ever changed?"] }
      ],
      letter:{
        k:"1998 — A LETTER TO MY FUTURE SELF",
        date:"31 December 1998",
        to:"Dear Future Me,",
        lines:[
          "I'm 17 years old, and I have so many plans!",
          "First, I want to [get my driving licence]. I also hope to [go to university] and [get a degree]. One day, I'd love to [get a job] that I really enjoy — maybe something with music.",
          "I don't know where I'll live in ten years. Maybe I'll [leave home] and move to another city!",
          "I'd also like to [have children] one day, but right now, I just want to enjoy being young.",
          "I wonder which of these dreams will come true.",
          "See you in the future!"
        ],
        sign:"Dan",
        signNote:"Marko's dad, aged 17",
        ps:"P.S. Don't stop playing the guitar. 🎸"
      },
      predict:[
        { q:"What do you think happened to Marko's dad?", ua:"Як ти думаєш, що сталося з татом Марка?", ex:"I think he probably went to university and got a job. Maybe he didn't move to another city." },
        { q:"Which of his dreams do you think came true?", ua:"Які з його мрій, на твою думку, здійснилися?", ex:"Well, he had children — he has Marko! Maybe he also got his driving licence." }
      ],
      starters:["I think he probably…", "Maybe he…", "I don't think he…", "He might have…"],
      reply:[
        { who:"marko", t:"Wow. He was only 17 when he wrote this — just three years older than me." },
        { who:"marko", t:"But was his life really that different from mine?" }
      ],
      teacher:"<p><b>Мета:</b> ужити вирази в контексті й прочитати лист тата. <b>8 хв</b> (A 2 хв · B 2 хв · питання 2 хв · лист 2 хв).</p><details><summary>Частина A (ключ)</summary><p>be born → start school → leave school → go to university → get a degree → retire. Наголосіть: це один поширений шлях, а не правило.</p></details><details><summary>Частина B</summary><p>Правильних варіантів багато. Автоперевірка лише м'яко зупиняє неможливе (дитина голосує, підліток одружується тощо). Просіть пояснити: <i>Why there?</i> Не всі картки обов'язково розміщувати.</p></details><details><summary>Лист тата</summary><p>Підсвічені вирази — з Life Map (натисни — переклад). Учень може читати вголос. Факт: Dan у 1998 мав 17. Що здійснилося — <b>не кажемо</b> (знаємо лише, що в нього є син 🙂): прогнози відкриті, Урок 8 до цього повернеться.</p></details><details><summary>Мова прогнозів</summary><p><i>He might have…</i> — лише як готова фраза, не пояснюйте граматику.</p></details>"
    },

    /* ========== CHAPTER 5 · READING: TWO GENERATIONS, TWO STORIES ========== */
    {
      id:"reading", n:5, section:"s5", min:11, type:"reading",
      title:"Two Generations, Two Stories",
      headline:"TWO GENERATIONS. TWO STORIES.",
      sub:"Was teenage life better in 1998 or in 2026?",
      pre:[
        { q:"What could teenagers do in 1998 without smartphones?", ua:"Що могли робити підлітки в 1998 році без смартфонів?", starter:"They could…",
          ex:"They could meet their friends outside, listen to CDs and play board games.", fu:["What would you miss most without your phone?"] },
        { q:"What problems do teenagers have today that didn't exist in the past?", ua:"Які проблеми мають сучасні підлітки, яких не було раніше?", starter:"Today, teenagers…",
          ex:"Today, teenagers spend too much time online, and there's a lot of pressure on social media.", fu:["Which problem is the biggest, in your opinion?"] }
      ],
      texts:[
        { id:"a", who:"dad", year:"1998", t:"Marko's Dad", sub:"Dan, 17 in 1998",
          paras:[
            "When I was a teenager in 1998, life was quite different. We didn't have smartphones, and the internet wasn't part of our everyday lives. My bedroom was tiny, and our family computer was huge and very slow.",
            "If I wanted to meet my friends, I called their home phones or simply went outside to find them. We listened to CDs, watched films on TV and spent hours outdoors. Life was often more relaxed.",
            "But communication was much harder. When a good friend moved to another country, staying in touch felt almost impossible. International phone calls were awful — and expensive!",
            "I think modern teenagers have more opportunities than we did. They can learn almost anything online and talk to people around the world. However, I'm not sure their lives are less stressful."
          ],
          gloss:[["everyday lives", "повсякденне життя"], ["staying in touch", "підтримувати зв'язок"], ["opportunities", "можливості"], ["stressful", "напружений, сповнений стресу"]] },
        { id:"b", who:"marko", year:"2026", t:"Marko", sub:"14 in 2026",
          paras:[
            "Being a teenager today is exciting, but it can also be tiring.",
            "My friends and I use our phones for almost everything. We study online, listen to music, watch videos and chat with people whenever we want. It's unbelievable how much information we have in our pockets.",
            "Technology makes many things easier, but sometimes it feels impossible to escape it. My phone buzzes all evening!",
            "There is also a lot of pressure at school. We have homework, exams, activities and decisions to make about our future. After a long day, I'm often exhausted.",
            "My dad says teenagers in the past had more free time and felt more relaxed. Maybe he's right. Still, I wouldn't want to live without the internet. I just wish life was a little less busy sometimes."
          ],
          gloss:[["escape", "втекти, сховатися від"], ["buzzes", "вібрує, дзижчить"], ["pressure", "тиск"], ["I wish life was…", "хотів би я, щоб життя було…"]] }
      ],
      comp:[
        { q:"What was difficult for teenagers in 1998?", o:["Listening to music", "Staying in touch with friends who lived far away", "Spending time outside"], a:1,
          hint:"Read Dad's third paragraph again.", why:"Correct: B. When a friend moved to another country, staying in touch felt almost impossible.", ua:"Важко було підтримувати зв'язок із друзями, які жили далеко." },
        { q:"What does Marko's dad think about modern teenagers?", o:["They have more opportunities.", "They have no problems.", "They should never use technology."], a:0,
          hint:"Look at Dad's last paragraph.", why:"Correct: A. He thinks modern teenagers have more opportunities — they can learn almost anything online.", ua:"Тато вважає, що в сучасних підлітків більше можливостей." },
        { q:"What makes modern teenage life stressful for Marko?", o:["Having too much free time", "Not having a phone", "Schoolwork and pressure about the future"], a:2,
          hint:"Find the word “pressure” in Marko's text.", why:"Correct: C. He has homework, exams, activities and decisions to make about his future.", ua:"Для Марка стрес — це шкільне навантаження й тиск щодо майбутнього." },
        { q:"What do Marko and his dad both understand?", o:["Every generation has advantages and difficulties.", "Modern teenagers are always happier.", "Teenagers should stop using technology."], a:0,
          hint:"Both texts talk about good things AND problems.", why:"Correct: A. Dad sees opportunities today, Marko sees more free time in the past — every generation has good and bad sides.", ua:"Кожне покоління має свої переваги й труднощі." }
      ],
      post:[
        { q:"Whose teenage life would you prefer — Marko's or his dad's? Why?", ua:"Чиє підліткове життя ти б обрав / обрала — Марка чи його тата? Чому?", starter:"I'd prefer… because…",
          ex:"I'd prefer Marko's life because I can't imagine life without the internet. But I'd like more free time, like his dad had.", fu:["What would you miss from 2026 if you lived in 1998?"] },
        { q:"What do you think will be different about teenage life in 2040?", ua:"Як ти думаєш, що буде інакше в житті підлітків у 2040 році?", starter:"In 2040, I think teenagers will…",
          ex:"In 2040, I think teenagers will study with AI teachers and maybe they won't need phones at all.", fu:["Would you like to be a teenager in 2040?"] }
      ],
      outro:[
        { who:"marko", t:"Okay, maybe every generation has its own problems." },
        { who:"marko", t:"But here's something interesting…" },
        { who:"marko", t:"People around the world don't always experience important life events at the same age." },
        { who:"marko", t:"Want to test your knowledge? 🌍" }
      ],
      teacher:"<p><b>Мета:</b> читання для загального розуміння й деталей, думки й аргументи. <b>11 хв</b> (до читання 2 · читання 4 · питання 3 · обговорення 2).</p><details><summary>Як вести</summary><p>Дві вкладки: текст тата (1998) і текст Марка (2026). Учень читає (вголос або мовчки), натискає на важливі речення, щоб підсвітити. Жовті слова — 6 слів уроку (натисни → пояснення). 🇺🇦 біля абзацу — переклад складних фраз.</p></details><details><summary>Відповіді</summary><p>1 B · 2 A · 3 C · 4 A. Після неправильної відповіді — підказка, після другої — правильна відповідь.</p></details><details><summary>6 слів</summary><p>tiny, huge, awful, unbelievable, exhausted, relaxed. Попросіть описати свою кімнату / свій день цими словами.</p></details><details><summary>Граматика — не зараз</summary><p><i>more relaxed, much harder, less stressful, easier</i> — порівняння трапляються в текстах природно. Не пояснюйте правило: це тема Уроку 8.</p></details>"
    },

    /* ========== CHAPTER 6 · WORLD LIFE CHALLENGE ========== */
    {
      id:"world", n:6, section:"s6", min:7, type:"quiz",
      title:"The World Life Challenge",
      sub:"Different countries. Different lives. Different decisions.",
      items:[
        { id:"br", country:"Brazil", city:"São Paulo", who:"Lucas, 18", tone:"#2F9E44",
          t:"Lucas is 18. Next year, he wants to study engineering at a university.",
          q:"What does Lucas want to do?", o:["Retire", "Go to university", "Leave school"], a:1,
          hint:"Where do people study engineering?", why:"Correct: B. He wants to study at a university — he wants to go to university." },
        { id:"jp", country:"Japan", city:"Osaka", who:"Yuki, 22", tone:"#E03131",
          t:"Yuki has finished her university studies. She has received her qualification.",
          q:"What has Yuki done?", o:["Got a degree", "Got married", "Got a driving licence"], a:0,
          hint:"What do you receive at the end of university?", why:"Correct: A. She finished university and received a qualification — she got a degree." },
        { id:"it", country:"Italy", city:"Bologna", who:"Marco, 24", tone:"#1C7ED6",
          t:"Marco is 24. Last month, he stopped living with his parents. Now he has his own small flat.",
          q:"What did Marco do?", o:["He left home.", "He started school.", "He retired."], a:0,
          hint:"He doesn't live with his parents now.", why:"Correct: A. He stopped living with his parents — he left home." },
        { id:"ke", country:"Kenya", city:"Nairobi", who:"Amani, 19", tone:"#F08C00",
          t:"Amani is 19. She passed her driving test last week. Now she can drive her mum's car.",
          q:"What did Amani get?", o:["A job", "A degree", "A driving licence"], a:2,
          hint:"What do you need to drive a car?", why:"Correct: C. She passed her test, so now she has official permission to drive — a driving licence." },
        { id:"se", country:"Sweden", city:"Gothenburg", who:"Elsa, 18", tone:"#7048E8",
          t:"Elsa is 18. Yesterday she chose a new mayor for her city in the local election — for the first time!",
          q:"What did Elsa do for the first time?", o:["She got married.", "She voted.", "She moved home."], a:1,
          hint:"What do people do in an election?", why:"Correct: B. She chose a person in an election — she voted." }
      ],
      bonus:[
        { q:"At what age would you like to become independent?", ua:"У якому віці ти хотів / хотіла б стати незалежним / незалежною?", starter:"I'd like to become independent at… because…",
          ex:"I'd like to become independent at about 20, after I get a job and leave home.", fu:["What does “independent” mean to you?"] },
        { q:"Which life event do you think changes a person the most?", ua:"Яка подія в житті, на твою думку, найбільше змінює людину?", starter:"I think … changes a person the most because…",
          ex:"I think having children changes a person the most, because you're responsible for another life.", fu:["Why do you think so?"] }
      ],
      teacher:"<p><b>Мета:</b> повторити вирази в коротких ситуаціях. <b>7 хв</b> (5 листівок 5 хв · бонус 2 хв).</p><details><summary>Відповіді</summary><p>Brazil — B go to university · Japan — A got a degree · Italy — A left home · Kenya — C a driving licence · Sweden — B voted.</p></details><details><summary>Зауваження</summary><p>Персонажі вигадані; ситуації не стверджують нічого про закони чи вік у цих країнах. Якщо учень питає «а в Україні?» — гарний привід поговорити, але без точних цифр.</p></details><details><summary>Коли рухатися далі</summary><p>Бонусні питання — за бажанням, якщо є час.</p></details>"
    },

    /* ========== CHAPTER 7 · FINAL MISSION: DEAR FUTURE ME ========== */
    {
      id:"future", n:7, section:"s7", min:10, type:"mission",
      title:"Dear Future Me",
      sub:"Your future hasn't been written yet.",
      chat:[
        { who:"marko", t:"I've got an idea! 💡" },
        { who:"marko", t:"My dad wrote a letter in 1998." },
        { who:"marko", t:"What if we did the same thing?" },
        { who:"marko", t:"Let's write letters to ourselves in the future." },
        { who:"marko", t:"Maybe one day we'll read them and see how much our lives have changed!" }
      ],
      year:2036,
      prompts:[
        { id:"now", t:"Your life now", q:"How old are you, and what is important to you today?", ua:"Скільки тобі років і що для тебе важливо сьогодні?", starter:"Right now, I'm … years old, and…" },
        { id:"plans", t:"Your future plans", q:"What important things would you like to do?", ua:"Які важливі речі ти хотів / хотіла б зробити?", starter:"After I leave school, I hope to…" },
        { id:"dream", t:"Your dream life", q:"Where would you like to live? What job would you like to have?", ua:"Де ти хотів / хотіла б жити? Яку роботу хотів / хотіла б мати?", starter:"In ten years, I'd like to…" },
        { id:"ask", t:"A question for the future", q:"What would you like to ask your future self?", ua:"Що ти хотів / хотіла б запитати в себе майбутнього / майбутньої?", starter:"I wonder if…" }
      ],
      phrases:["I hope to…", "I want to…", "I'd like to…", "One day, I want to…", "Maybe I'll…", "I wonder if…", "I hope I'll have…"],
      model:"Dear Future Me,\n\nRight now, I'm 14 years old, and I have lots of dreams.\n\nAfter I leave school, I hope to go to university and get a degree. I'd also like to get my driving licence and travel to different countries.\n\nIn ten years, I hope I'll have a job that I really enjoy. Maybe I'll move to another city too.\n\nI wonder if you're happy with the decisions we've made.\n\nSee you in 2036!",
      need:{ events:3, min:60, max:90 },
      teacher:"<p><b>Мета:</b> особистий лист собі в 2036 рік (60–90 слів). <b>10 хв</b> (план 2 · письмо 6 · печатка 2).</p><details><summary>Що має бути в листі</summary><p>≥3 вирази з Life Map · одна мета (<i>I hope to / I'd like to</i>) · один прогноз (<i>Maybe I'll / I think I'll</i>) · одне питання до себе (<i>I wonder if… ?</i>). Чек-лист праворуч рахує це автоматично — грубо, тож ваша оцінка важливіша.</p></details><details><summary>Як вести</summary><p>Спершу усно пройдіть 4 підказки (кнопки над полем), потім учень пише. Корисні фрази — кнопка <b>Useful expressions</b>. Зразок — <b>Show an example</b> (краще після спроби учня). Дрібні помилки не заважають «запечатати» лист.</p></details><details><summary>Приватність</summary><p>Лист зберігається лише в прогресі курсу (як інші відповіді) і нікуди не надсилається. <b>Copy letter</b> — якщо учень хоче зберегти його собі.</p></details><details><summary>Якщо мало часу</summary><p>Учень пише 3–4 речення, решту — вдома (чернетка збережеться).</p></details>"
    },

    /* ========== CHAPTER 8 · SUMMARY & CLIFFHANGER ========== */
    {
      id:"summary", n:8, section:"s8", min:4, type:"cliffhanger",
      title:"To Be Continued…",
      discovered:["13 life event expressions", "How to describe important life stages", "Differences between teenage life in 1998 and 2026", "How to talk about your future plans"],
      check:[
        { q:"How do you say «отримати водійське посвідчення» in English?", a:"get a driving licence" },
        { q:"What does “retire” mean?", a:"To stop working permanently, usually because of age." },
        { q:"What's the difference between “leave home” and “move home”?", a:"Leave home = stop living with your parents. Move home = change the place where you live (you can move home with your parents)." },
        { q:"Name two life events you would like to experience.", a:"Open answer — e.g. I'd like to get a driving licence and go to university." },
        { q:"Would you prefer to be a teenager in 1998 or 2026? Why?", a:"Open answer — e.g. I'd prefer 2026 because I can talk to my friends any time." }
      ],
      badge:{ t:"LIFE EXPLORER", s:"You explored the past and planned your future." },
      cliff:[
        { who:"marko", t:"My dad just read his old letter…" },
        { who:"marko", t:"He says his teenage years were easier than ours." },
        { who:"marko", t:"Seriously?! 😳" },
        { who:"marko", t:"No smartphones. No social media. No instant messages." },
        { who:"marko", t:"And he thinks THEIR lives were easier?!" },
        { pause:1600 },
        { who:"marko", t:"Okay, we need to settle this." },
        { who:"marko", t:"Which generation actually had it better?" }
      ],
      next:{ k:"NEXT EPISODE", t:"Lesson 8 — Who Had It Better?", s:"1998 vs 2026. Two generations. One big debate." },
      closing:"THE PAST TELLS A STORY. THE FUTURE IS STILL UNWRITTEN.",
      teacher:"<p><b>Мета:</b> швидкий усний підсумок і гачок на Урок 8. <b>4 хв.</b></p><details><summary>Швидка перевірка</summary><p>5 питань по одному — усно. Модельну відповідь відкриває кнопка <b>Model answer</b>. 1 get a driving licence · 2 stop working (usually because of age) · 3 leave home = жити окремо від батьків; move home = переїхати в інше житло · 4–5 відкриті.</p></details><details><summary>Фінал</summary><p>Затемнення, повідомлення Марка й анонс Уроку 8 «Who Had It Better?». Граматики Уроку 8 тут не починаємо — лише спитайте: <i>What do you think — whose life was easier?</i></p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/capsule.js) ---------- */
  screens(add, st){
    const p = st("previously");
    add(p, "tcPrevious", { key:"flash", store:"flash", flash:p.flash, cards:p.cards }, p.cards.map(c => c.t + ": " + c.ex).join(" · "));
    add(p, "tcIncoming", { key:"msg", store:"msg", chat:p.chat, mission:p.mission });

    const w = st("warm");
    add(w, "tcCards", { key:"cards", store:"cards", heading:w.heading, headingUa:w.headingUa, cards:w.cards, outro:w.outro });

    const v = st("lifemap");
    add(v, "tcLifeMap", { key:"map", store:"map", intro:v.intro, note:v.note, noteUa:v.noteUa }, "13 events · optional: driving licence, university, degree, married, children");
    add(v, "tcMatch", { key:"match", store:"match", pairs:v.match, outro:v.outro }, v.match.map(x => x.w + " → " + x.d).join(" · "));

    const t = st("timeline");
    add(t, "tcOrder", { key:"a", store:"a", part:t.partA, intro:t.intro }, "be born → start school → leave school → go to university → get a degree → retire");
    add(t, "tcPlace", { key:"b", store:"b", part:t.partB }, "Many answers are possible. Not possible: a child votes / drives / works; a teenager or child gets married or has children.");
    add(t, "tcTalk", { key:"reflect", store:"reflect", qs:t.reflect, title:"Life doesn't follow one timeline", intro:"Talk about it. There are no wrong answers.", kicker:"Reflection", cta:"Open Dad's letter ✉️" });
    add(t, "tcLetter", { key:"letter", store:"letter", letter:t.letter, predict:t.predict, starters:t.starters, reply:t.reply }, "Open predictions. Known fact: Dad has a son — Marko 🙂");

    const r = st("reading");
    add(r, "tcSplit", { key:"pre", store:"pre", headline:r.headline, sub:r.sub, qs:r.pre });
    add(r, "tcRead", { key:"read", store:"read", texts:r.texts }, "Six words: tiny · huge · awful · unbelievable · exhausted · relaxed");
    add(r, "tcComp", { key:"comp", store:"comp", qs:r.comp, texts:r.texts }, "1 B · 2 A · 3 C · 4 A");
    add(r, "tcTalk", { key:"post", store:"post", qs:r.post, title:"What do you think?", intro:"Two big questions. Answer out loud.", kicker:"After reading", outro:r.outro, cta:"Start the World Challenge 🌍" });

    const wo = st("world");
    add(wo, "tcWorld", { key:"world", store:"world", items:wo.items, sub:wo.sub, bonus:wo.bonus }, wo.items.map(x => x.country + " — " + x.o[x.a]).join(" · "));

    const f = st("future");
    add(f, "tcFutureIntro", { key:"intro", store:"intro", chat:f.chat, sub:f.sub, year:f.year });
    add(f, "tcWriter", { key:"write", store:"write", prompts:f.prompts, phrases:f.phrases, model:f.model, need:f.need, year:f.year }, "≥3 life events · a goal · a prediction · a question · 60–90 words");

    const s = st("summary");
    add(s, "tcRecap", { key:"recap", store:"recap", discovered:s.discovered, check:s.check }, s.check.map((x, i) => (i + 1) + " " + x.a).join(" · "));
    add(s, "tcBadge", { key:"badge", store:"badge", badge:s.badge });
    add(s, "tcCliff", { key:"cliff", store:"cliff", cliff:s.cliff, next:s.next, closing:s.closing });
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const tc = (ans && ans._tc) || {};
    const ach = Object.keys(tc.ach || {}).length;
    const map = ans.lifemap && ans.lifemap.map; const seen = map && map.seen ? Object.keys(map.seen).length : 0;
    const world = ans.world && ans.world.world; const pts = world && world.r ? Object.values(world.r).filter(x => x && x.first).length : 0;
    const sealed = ans.future && ans.future.write && ans.future.write.sealed;
    return {
      icon:"✉️", title:"Lesson 7 complete — Life Explorer",
      text:"You read Dad's letter from 1998, compared two generations and sealed your own letter to the future. But Marko's dad has a surprising opinion…",
      stats:[
        [`🗺 ${seen} / 13`, "life events discovered"],
        [`🌍 ${pts} / 5`, "World Challenge points"],
        [`✉️ ${sealed ? "sealed" : "draft"}`, "your letter to 2036"],
        [`🏅 ${ach} / 5`, "achievements"]
      ]
    };
  }
};
})();
