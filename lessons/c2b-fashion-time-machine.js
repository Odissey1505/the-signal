/* ============================================================
   LESSON 5 · Cycle 2B · THE FASHION TIME MACHINE ⏳📸
   Unit 2 · In fashion — продовження Уроку 4 (фото тата «Best night ever. 1998.»).
   Grammar: Past Simple (+ was/were) · Vocabulary: adverbs · Revision: 12 слів Уроку 4.
   Формат — урок один на один (учень + учитель, демонстрація екрана), 60 хв, 9 сцен.
   Персонажі — з c1a (див. requires) + тато Марка (лише в цьому уроці).
   Екрани — з js/screens/memory.js, тема — css/memory.css (body[data-episode-theme="memory"]).
   Образи одягу в сцені 2 малює js/art/wardrobe.js (як в Уроці 4).
   Порядок екранів — у функції screens() в кінці файлу.

   КАРТИНКИ (необов'язкові). Поки поле null — показується намальована заміна, урок працює й так.
   Згенеруйте файл, покладіть у папку c2b всередині assets і впишіть шлях у MEDIA нижче:
     photo   — фото 1998 року: троє підлітків, спалах, вечір (квадрат 1:1)
     outfits — образи A–D у сцені 2 (квадрат; літера A–D підписується під фото)
     dad     — тато Марка сьогодні у вітальні зі старим фото в руках (4:3)
   Підказки для генерації — у README.md, розділ «Урок 5».
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- картинки (null = намальована заміна) ---------- */
const MEDIA = {
  photo: "assets/c2b/photo-1998.webp",
  photoAlt: "An old concert photo from 1998: under purple stage lights, a smiling teenage boy in a denim jacket with a red patch, a white T-shirt and a bucket hat has his arms in the air. On the right, a boy in a red T-shirt and a dark cap is watching the stage. Date stamp: '98 11 21.",
  desk: "assets/c2b/desk-1998.webp",
  deskAlt: "On an old wooden table: the 1998 photo with the words Best night ever. 1998, a concert ticket for the City Sound Festival on Saturday 21 November 1998, a brown diary from 1998, a cassette tape labelled 21.11.98 — LIVE and a denim jacket with a red patch.",
  outfits: { A:"assets/c2b/outfit-a.webp", B:"assets/c2b/outfit-b.webp", C:"assets/c2b/outfit-c.webp", D:"assets/c2b/outfit-d.webp" },
  wall: {           /* стіна доказів у сцені 9: фон + текстури карток (картки й нитка таймлайну — живі) */
    bg:"assets/c2b/wall-1998.webp", polaroid:"assets/c2b/wall-polaroid.webp",
    cream:"assets/c2b/paper-cream.webp", navy:"assets/c2b/paper-navy.webp",
    tapeOn:"assets/c2b/tape-orange.webp", tapeOff:"assets/c2b/tape-blue.webp",
    alt:"An evidence wall on a wooden board: the old 1998 photo with the words Best night ever. 1998, five pinned times from 5:00 p.m. to 11:45 p.m., and Dad's denim jacket with a red patch."
  },
  jacket: "assets/c2b/jacket.webp",   /* фінал (сцена 9): куртка з кишенею; кишеня й папірець — живі, поверх картинки */
  jacketAlt: "Dad's old denim jacket with gold buttons, two chest pockets and a red patch with a white triangle.",
  dad: "assets/c2b/dad-today.webp",
  dadAlt: "Marko's dad today: a smiling man in his forties with short greying hair and a blue jumper. He is sitting on the sofa in a cosy living room under a warm lamp and holding up an old instant photo."
};

/* ---------- образи сцени 2 (flat lay, js/art/wardrobe.js) ---------- */
const LOOK = {
  A: { top:{ k:"tee", c:"#F2F0EA" }, outer:{ k:"denim", c:"#5C82B8", big:true, patch:"#C0392B" }, bottom:{ k:"loose", c:"#4A6FA5", denim:true }, shoes:{ k:"chunky", c:"#F4F4F4", accent:"#E99A55" }, extras:[{ k:"bucket", c:"#E9E2CF" }] },
  B: { top:{ k:"shirt", c:"#F7F7F2", tie:"#48372F" }, outer:{ k:"blazer", c:"#2C3442" }, bottom:{ k:"smart", c:"#2C3442" }, shoes:{ k:"smart", c:"#1E1612" } },
  C: { top:{ k:"tee", c:"#1D1B2C", print:"band", text:"WIRED" }, outer:{ k:"bomber", c:"#4D8B89" }, bottom:{ k:"skinny", c:"#22252E", denim:true }, shoes:{ k:"hightops", c:"#F5F0E7", accent:"#D59AA2" }, extras:[{ k:"glasses", style:"wayfarer" }] },
  D: { top:{ k:"shirt", c:"#B9A27E", pat:"ck", big:true }, bottom:{ k:"baggy", c:"#6B5B45" }, shoes:{ k:"boots", c:"#3B2A1E", worn:true }, tags:[{ t:"£3" }] }
};

/* ---------- неправильні дієслова (довідник «📖 Verb list» зі сцени 4 до кінця) ---------- */
const IRREGULAR = [
  ["buy", "bought", "купувати"], ["meet", "met", "зустрічати"], ["go", "went", "йти / їхати"], ["wear", "wore", "носити"],
  ["see", "saw", "бачити"], ["take", "took", "брати"], ["have", "had", "мати"], ["get", "got", "отримувати"],
  ["do", "did", "робити"], ["choose", "chose", "обирати"]
];

/* ---------- чотири докази ---------- */
/* ---------- речі на столі (сцена 1) ---------- */
const PROPS = { ticket:{ event:"City Sound Festival", stage:"Club Stage", when:"Sat 21 Nov 1998 · 6 p.m.", no:"Admit one · No. 0412" }, tape:"21.11.98 — LIVE" };

const CLUES = {
  1: { t:"The denim jacket belonged to Marko's dad.", from:"Scene 2 · the 90s wardrobe" },
  2: { t:"The mysterious photograph was taken at 11:45 p.m.", from:"Scene 4 · the grammar file" },
  3: { t:"Dad played guitar on stage that night.", from:"Scene 5 · the broken memories" },
  4: { t:"This was the first time Marko's dad played guitar in front of an audience.", from:"Scene 7 · the timeline" }
};

window.SIGNAL_LESSONS.c2b = {
  id: "c2b",
  cycle: 2,
  lessonType: "grammar-story",
  theme: "memory",
  title: "The Fashion Time Machine",
  subtitle: "Unit 2 · In fashion · Lesson 5",
  series: "The Jacket Secret",
  tagline: "One photograph. One unforgettable night. A mystery waiting to be solved.",
  question: "What happened on the best night ever?",
  minutes: 60,
  setting: "The weekend after Style & Music Day. Marko asks his dad about the old photo from 1998.",
  media: MEDIA,
  irregular: IRREGULAR,
  clues: CLUES,
  props: PROPS,

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["photo"],
    vocabPresentation: ["adverbs"],
    discoveryGuide: ["diary", "grammar"],
    vocabPractice: ["wardrobe", "adverbs"],
    grammar: ["grammar"],
    grammarPractice: ["memories", "timeline", "final"],
    listening: [],
    speaking: ["photo", "wardrobe", "timeline", "interview"],
    mission: ["timeline", "interview"],
    summary: ["final"],
    homework: []
  },
  tabs: [
    { key:"s1", label:"1 The photo" }, { key:"s2", label:"2 Back to the 90s" }, { key:"s3", label:"3 The diary" },
    { key:"s4", label:"4 Past Simple" }, { key:"s5", label:"5 Memories" }, { key:"s6", label:"6 Adverbs" },
    { key:"s7", label:"7 The night" }, { key:"s8", label:"8 Interview" }, { key:"s9", label:"9 Discovery" }
  ],

  /* нові слова уроку — прислівники (потрапляють у My words) */
  vocab: [
    { w:"quickly", ipa:"/ˈkwɪkli/", g:"adverb", en:"fast; in a short time", ua:"швидко", ex:"The friends ran quickly to the concert." },
    { w:"carefully", ipa:"/ˈkeəfəli/", g:"adverb", en:"with a lot of attention, so nothing goes wrong", ua:"обережно, уважно", ex:"Dad carefully put the photo back in the box." },
    { w:"happily", ipa:"/ˈhæpɪli/", g:"adverb", en:"in a happy way", ua:"щасливо, радісно", ex:"Everyone danced happily." },
    { w:"well", ipa:"/wel/", g:"adverb", en:"in a good way (the adverb of good)", ua:"добре", ex:"The band played really well." },
    { w:"fast", ipa:"/fɑːst/", g:"adverb", en:"quickly — the same form as the adjective", ua:"швидко", ex:"Alex talks very fast." },
    { w:"hard", ipa:"/hɑːd/", g:"adverb", en:"with a lot of effort — the same form as the adjective", ua:"старанно, наполегливо", ex:"Dad practised very hard before the concert." }
  ],
  receptive: [],
  /* слова Уроку 4 (c2a), які повторюємо */
  recall: ["comfortable", "uncomfortable", "skinny", "loose-fitting", "brand new", "second-hand", "smart", "casual", "trendy", "unfashionable", "well-dressed", "badly-dressed"],

  requires: ["c1a"],
  get characters(){
    const base = (window.SIGNAL_LESSONS.c1a || {}).characters || {};
    return Object.assign({}, base, {
      dad: { name:"Dad", img:MEDIA.dad, face:{ x:50, y:29 }, look:{ hair:"short", colour:"#1E1612", skin:"#7A4B32", top:"#4D6E9C", mood:"smile" } },
      unknown: { name:"Unknown sender", look:{ hair:"short", colour:"#172033", skin:"#2A3550", top:"#172033" } }
    });
  },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- 9 сцен = 9 етапів ---------- */
  stages: [

    /* ========== SCENE 1 · THE MYSTERIOUS PHOTO ========== */
    {
      id:"photo", n:1, section:"s1", min:4, type:"warmup",
      title:"The Mysterious Photo 📸",
      intro:"Remember the old photo from Marko's wardrobe? Marko has news.",
      hero:{ kicker:"Unit 2 · In fashion · Lesson 5", title:"The Fashion Time Machine", emoji:"⏳📸",
        tagline:"One photograph. One unforgettable night. A mystery waiting to be solved." },
      chat:[
        { sys:"Saturday · 10:14" },
        { who:"marko", t:"Hey! Remember the photo I found? 📸" },
        { who:"marko", t:"Look at the guy in the red T-shirt on the right. My dad wasn't alone!" },
        { who:"marko", t:"I asked my dad about it. He said something really strange…" },
        { who:"dad", fwd:true, t:"That night changed everything." },
        { who:"marko", t:"What happened in 1998? Can you help me find out?" }
      ],
      qs:[
        { q:"Who can you see in this photograph?", ua:"Кого ти бачиш на цій фотографії?", ex:"I can see Marko's dad and another boy in a red T-shirt." },
        { q:"What are they wearing?", ua:"У що вони вдягнені?", ex:"Marko's dad is wearing a denim jacket, a white T-shirt and a bucket hat. The other boy is wearing a red T-shirt and a cap." },
        { q:"Do their clothes look fashionable today? Why or why not?", ua:"Чи виглядає їхній одяг модним сьогодні? Чому?", ex:"Some clothes look old-fashioned, but denim jackets are still trendy." },
        { q:"What do you think happened that night?", ua:"Як ти думаєш, що сталося тієї ночі?", ex:"Maybe they went to a concert or met someone special." }
      ],
      dadNote:"Look for my old diary. It might help you remember the story.",
      teacher:"<p><b>4 хв</b>: чат — 1 хв, чотири питання — 3 хв.</p><details><summary>Як вести</summary><ul><li>Екран 1: повідомлення з'являються самі (<b>Show all</b> — одразу). Марко звертає увагу на хлопця в червоній футболці праворуч. Спитайте: <i>Who do you think the boy in the red T-shirt is?</i></li><li>Екран 2: питання по одному. <b>Need an example?</b> — зразок, відкривайте лише якщо учень застряг.</li><li>Past Simple ще не пояснюємо: якщо учень каже <i>Maybe they go to a concert</i> — просто перефразуйте: <i>Maybe they went to a concert. Good idea!</i></li><li>Після четвертого питання тато пише про щоденник — учень сам натискає на щоденник (<b>OPEN THE DIARY</b>).</li></ul></details><details><summary>Факти історії (тримайте однаково весь урок)</summary><p>Субота, <b>21 листопада 1998</b> (як у штампі на фото з Уроку 4: <i>'98 11 21</i>). Тато (тоді 17 років), друзі <b>Alex</b> (на фото праворуч, спиною: червона футболка й кепка) і <b>Emma</b> (на фото її немає). Музичний фестиваль City Sound у міському клубі. 17:00 — тато купив вживану джинсову куртку з червоною нашивкою, 19:00 — зустрів друзів, 22:30 — слухали гурт, 23:00 — тато вперше грав на гітарі на сцені, 23:45 — фото зробила <b>незнайома дівчина з натовпу</b> камерою Emma. Хто вона — тато не знає (гачок до невідомого відправника у фіналі).</p></details>"
    },

    /* ========== SCENE 2 · BACK TO THE 90s ========== */
    {
      id:"wardrobe", n:2, section:"s2", min:6, type:"vocab-revision",
      title:"Back to the 90s 👕",
      intro:"To understand the photo, we need to understand the clothes. Let's open the 90s wardrobe.",
      bank:["trendy", "unfashionable", "smart", "casual", "skinny", "loose-fitting", "well-dressed", "badly-dressed", "brand new", "second-hand", "comfortable", "uncomfortable"],
      outfits:[
        { id:"A", cap:"Loose-fitting jeans, a denim jacket and trainers", look:LOOK.A, img:MEDIA.outfits.A,
          alt:"Outfit A: a denim jacket with a red patch, a white T-shirt, wide blue jeans, white trainers with an orange stripe and a beige bucket hat",
          core:["loose-fitting", "casual", "comfortable"], ok:["trendy", "second-hand", "well-dressed", "unfashionable"],
          sample:"Outfit A is casual and comfortable. The jeans are loose-fitting." },
        { id:"B", cap:"A smart suit and polished shoes", look:LOOK.B, img:MEDIA.outfits.B,
          alt:"Outfit B: a dark navy suit, a white shirt, a brown tie, a black belt and polished black shoes",
          core:["smart", "well-dressed"], ok:["uncomfortable", "brand new", "unfashionable", "trendy"],
          sample:"Outfit B is smart. He looks well-dressed, but a suit can be uncomfortable." },
        { id:"C", cap:"Skinny jeans and a fashionable jacket", look:LOOK.C, img:MEDIA.outfits.C,
          alt:"Outfit C: a short green bomber jacket, a black T-shirt with a lightning bolt, skinny black jeans, black sunglasses and white high-top trainers",
          core:["skinny", "trendy"], ok:["casual", "well-dressed", "brand new", "uncomfortable", "comfortable"],
          sample:"Outfit C is trendy. The jeans are skinny, so maybe they're a bit uncomfortable." },
        { id:"D", cap:"Second-hand clothes and an oversized shirt", look:LOOK.D, img:MEDIA.outfits.D,
          alt:"Outfit D: a big checked shirt with a £3 price tag, loose brown trousers and old brown leather boots",
          core:["second-hand", "loose-fitting", "casual"], ok:["comfortable", "unfashionable", "badly-dressed", "trendy"],
          sample:"Outfit D is second-hand and casual. The shirt is loose-fitting and comfortable." }
      ],
      help:[
        { w:"trendy", ua:"модний, трендовий", en:"popular and fashionable right now", ex:"Denim jackets were really trendy in 1998." },
        { w:"unfashionable", ua:"немодний", en:"not popular now; it looks old-style", ex:"Dad thinks bucket hats are cool, but Marko says they're unfashionable." },
        { w:"smart", ua:"ошатний, елегантний", en:"neat and formal, for special events", ex:"You wear smart clothes to a wedding." },
        { w:"casual", ua:"повсякденний", en:"relaxed, for every day", ex:"At the festival, everyone wore casual clothes." },
        { w:"skinny", ua:"вузький, облягаючий (про одяг)", en:"very tight, close to your legs or body", ex:"Skinny jeans weren't popular in 1998." },
        { w:"loose-fitting", ua:"вільний, просторий (про одяг)", en:"clothes that are not tight", ex:"My dad wore loose-fitting jeans in 1998." },
        { w:"well-dressed", ua:"добре вдягнений", en:"your clothes look neat and right for the situation", ex:"Emma always looked well-dressed." },
        { w:"badly-dressed", ua:"погано вдягнений", en:"your clothes look messy or wrong for the situation", ex:"A dirty T-shirt at a wedding? That's badly-dressed!" },
        { w:"brand new", ua:"абсолютно новий", en:"completely new; nobody wore it before", ex:"Alex had brand new trainers that night." },
        { w:"second-hand", ua:"вживаний, секонд-хенд", en:"not new; another person had it before you", ex:"Dad bought a second-hand denim jacket for £5." },
        { w:"comfortable", ua:"зручний", en:"nice to wear; you feel relaxed in it", ex:"Trainers are comfortable at a festival." },
        { w:"uncomfortable", ua:"незручний", en:"not nice to wear; it feels wrong or hurts", ex:"A tight suit is uncomfortable for dancing." }
      ],
      speak:{ q:"Which of these outfits would you wear today? Why?", ua:"Який із цих образів ти вдягнув би / вдягнула б сьогодні? Чому?",
        ex:"I would wear Outfit A because loose-fitting jeans are comfortable and fashionable.",
        fu:["Which one would you never wear?", "Which outfit is the most 1990s?"] },
      clue:1,
      match:"Look at Outfit A and the photo: the same denim jacket with a red patch!",
      reply:{ who:"marko", t:"That's interesting! He still has that jacket somewhere!" },
      teacher:"<p><b>6 хв</b>: опис образів — 4 хв, «Which would you wear?» і доказ — 2 хв.</p><details><summary>Відповіді</summary><ul><li><b>A:</b> loose-fitting, casual, comfortable (також trendy, second-hand…)</li><li><b>B:</b> smart, well-dressed (також uncomfortable, brand new)</li><li><b>C:</b> skinny, trendy (також casual, well-dressed, uncomfortable)</li><li><b>D:</b> second-hand, loose-fitting, casual (також comfortable, unfashionable)</li></ul><p>✓ — очевидна відповідь, 🤔 — можлива, якщо учень пояснить (<i>trendy</i> — справа смаку!), ✗ — не підходить (напр. <i>skinny</i> для D).</p></details><details><summary>Як вести</summary><p>Учень обирає образ, потім 2–3 слова. Після <b>Check</b> просіть речення: <i>Outfit A is casual. The jeans are loose-fitting.</i> <b>📚 Vocabulary help</b> — переклад і приклади всіх 12 слів (це повторення Уроку 4, нових слів тут немає).</p></details>"
    },

    /* ========== SCENE 3 · DAD'S LOST MEMORIES ========== */
    {
      id:"diary", n:3, section:"s3", min:4, type:"reading",
      title:"Dad's Lost Memories 📝",
      intro:"Marko found the diary in a box under Dad's bed. One page has the date from the photo!",
      date:"Saturday, 21 November 1998",
      /* [слово|мітка]: irr — неправильне дієслово, ed — правильне (-ed), neg — заперечення */
      lines:[
        "What an amazing day!",
        "At 5 p.m., I [bought|irr] a second-hand denim jacket.",
        "At 7 p.m., I [met|irr] Alex and Emma outside the music festival.",
        "At 10:30 p.m., we [listened|ed] to a fantastic band.",
        "I [didn't feel|neg] very confident, but at 11 p.m. I [went|irr] on stage and [played|ed] guitar.",
        "At 11:45 p.m., someone [took|irr] a photograph of us.",
        "I will never forget this night!"
      ],
      tasks:[
        { id:"time", type:"mcq", q:"Is the writer talking about the past, the present or the future?", ua:"Автор пише про минуле, теперішнє чи майбутнє?",
          o:["The past", "The present", "The future"], a:0, hint:"Look at the date at the top of the page.", why:"It's 21 November 1998. These actions happened and finished." },
        { id:"irr", type:"tap", tag:"irr", n:4, q:"Find 4 verbs that look very different from their normal form. (buy → ?)", ua:"Знайди 4 дієслова, які дуже змінили свою звичайну форму.",
          hint:"Look for the past forms of buy, meet, go and take.", why:"bought, met, went, took — no -ed! These are irregular verbs." },
        { id:"neg", type:"tap", tag:"neg", n:1, q:"Can you find one negative sentence?", ua:"Знайди одне заперечне речення.",
          hint:"Look for n't (= not).", why:"I didn't feel very confident. — didn't + feel." },
        { id:"ed", type:"tap", tag:"ed", n:2, q:"Which verbs end in -ed?", ua:"Які дієслова закінчуються на -ed?",
          hint:"Two verbs: one is about music, one is about the guitar.", why:"listened, played — regular verbs: verb + -ed." }
      ],
      marko:"Wait… bought? met? went? Why do these verbs look different?",
      teacher:"<p><b>4 хв.</b> Учень читає сторінку вголос (або 🔊), потім чотири завдання: на 2–4 він <b>натискає на слова прямо в щоденнику</b>.</p><details><summary>Відповіді</summary><p>1 The past · 2 bought, met, went, took · 3 <i>I didn't feel very confident</i> · 4 listened, played.</p></details><details><summary>Як вести</summary><p>Правил ще не даємо — лише помічаємо. Після завдань Марко питає: <i>Why do these verbs look different?</i> — спитайте учня, а відповідь знайдете разом у сцені 4.</p></details>"
    },

    /* ========== SCENE 4 · GRAMMAR DISCOVERY: PAST SIMPLE ========== */
    {
      id:"grammar", n:4, section:"s4", min:10, type:"grammar",
      title:"Grammar Discovery: Past Simple 🔍",
      intro:"Three sentences from the case notes. Look carefully — they hide the rules.",
      examples:[
        { t:"Marko's dad **bought** a jacket." },
        { t:"He **didn't buy** new shoes." },
        { t:"**Did** he **buy** the jacket in 1998?" }
      ],
      discover:[
        { q:"Are these sentences about the past or the present?", o:["The past", "The present", "The future"], a:0,
          hint:"When did Dad buy the jacket? In 1998!", why:"We use the Past Simple to talk about finished actions in the past.",
          ua:"Past Simple використовуємо для опису дій, які відбулися й завершилися в минулому." },
        { q:"Which sentence is negative?", o:["Sentence 1", "Sentence 2", "Sentence 3"], a:1,
          hint:"Look for n't.", why:"We use didn't + base verb to make negative sentences.",
          ua:"Заперечення: didn't + дієслово в початковій формі (без -ed, без другої форми)." },
        { q:"Why do we say **didn't buy** and not **didn't bought**?", o:["Because we use the base verb after didn't.", "Because bought is incorrect English."], a:0,
          hint:"Is bought a real word? Yes! So why can't we use it here?", why:"Didn't already shows that the action is in the past.",
          ua:"Слово didn't уже показує минулий час, тож дієслово після нього — у початковій формі: didn't buy." },
        { q:"Which is correct?", o:["Did he bought a jacket?", "Did he buy a jacket?"], a:1,
          hint:"Look at sentence 3 again.", why:"We use Did + subject + base verb in questions.",
          ua:"Питання: Did + підмет + дієслово в початковій формі. Did уже показує минулий час." }
      ],
      file:{
        aff:{ title:"Affirmative", sign:"+", rule:"Subject + Past Simple verb", ua:"Підмет + дієслово в Past Simple (правильні: + -ed; неправильні: друга форма).",
          regular:[["play", "played"], ["watch", "watched"], ["listen", "listened"], ["enjoy", "enjoyed"]],
          irregular:[["buy", "bought"], ["go", "went"], ["meet", "met"], ["take", "took"], ["wear", "wore"], ["see", "saw"]],
          ex:["He **bought** a jacket.", "They **listened** to music."] },
        neg:{ title:"Negative", sign:"−", rule:"Subject + didn't + base verb", ua:"Підмет + didn't (= did not) + дієслово в початковій формі.",
          ex:["He **didn't buy** new shoes.", "They **didn't leave** early."], note:"didn't = did not. ✗ He didn't bought…" },
        q:{ title:"Questions", sign:"?", rule:"Did + subject + base verb?", ua:"Did + підмет + дієслово в початковій формі? Питальне слово (What, Where…) — на початку.",
          ex:["**Did** he **meet** his friends?", "What **did** they **wear**?", "Where **did** they **go**?"], short:"Yes, he did. / No, he didn't." },
        be:{ title:"Past Simple of be", rows:[["I / he / she / it", "was", "wasn't"], ["you / we / they", "were", "weren't"]],
          ex:["**Was** he nervous? — Yes, he **was**.", "**Were** they happy? — Yes, they **were**."],
          note:"No did with was / were: He wasn't nervous. ✗ He didn't be nervous.",
          ua:"З was / were не використовуємо did: заперечення — wasn't / weren't, питання — Was he…? / Were they…?" },
        time:{ title:"Past time expressions", items:[
          ["yesterday", "Yesterday Marko asked his dad about the photo."],
          ["last night", "Last night Marko read the diary."],
          ["last weekend", "Last weekend Marko looked for Dad's old things."],
          ["two days ago", "Marko found the photo two days ago."],
          ["in 1998", "Dad played guitar on stage in 1998."] ],
          ua:"Ці слова підказують: дія в минулому → Past Simple." }
      },
      check:[
        { q:"In 1998, Dad ___ his favourite band live.", o:["see", "saw", "seeing"], a:1, hint:"See is irregular. Check the 📖 verb list.", why:"see → saw." },
        { q:"They ___ the festival early. They stayed until midnight.", o:["didn't leave", "didn't left", "not left"], a:0, hint:"Look at the verb after didn't.", why:"didn't + base verb: didn't leave." },
        { q:"___ they wear loose-fitting jeans in the 1990s?", o:["Do", "Did", "Were"], a:1, hint:"Remember: Did + subject + base verb.", why:"A question about the past: Did they wear…?" }
      ],
      clue:2,
      reply:{ who:"marko", t:"11:45 p.m.? That's really late! There's more in this diary…" },
      teacher:"<p><b>10 хв</b>: відкриття — 4 хв, «Grammar file» — 4 хв, швидка перевірка — 2 хв.</p><details><summary>Навідні питання (відкриття)</summary><ul><li><b>Teacher asks:</b> <i>When did this happen — now or in the past?</i> · <b>Expected:</b> <i>In the past, in 1998.</i></li><li><b>Teacher asks:</b> <i>Which word makes sentence 2 negative?</i> · <b>Expected:</b> <i>didn't.</i></li><li><b>Teacher asks:</b> <i>Why do we use buy instead of bought after didn't?</i> · <b>Expected:</b> <i>Because didn't already shows the past.</i> · <b>If the student struggles:</b> <i>Look at the word didn't. Does it already tell us this happened in the past?</i></li><li><b>Teacher asks:</b> <i>In sentence 3, which word starts the question?</i> · <b>Expected:</b> <i>Did.</i> → <i>So after Did — buy or bought?</i></li></ul></details><details><summary>Відповіді</summary><p>Відкриття: 1 A · 2 Sentence 2 · 3 A · 4 B. Перевірка: 1 saw · 2 didn't leave · 3 Did.</p></details><details><summary>Grammar file</summary><p>Три вкладки (+ / − / ?) відкриваються по одній, щоб не було «стіни тексту». <b>Past Simple of be</b> і <b>time expressions</b> — розгортаються окремо, це другорядне. Кнопка <b>📖 Verb list</b> угорі доступна до кінця уроку.</p></details>"
    },

    /* ========== SCENE 5 · FIX THE BROKEN MEMORIES ========== */
    {
      id:"memories", n:5, section:"s5", min:8, type:"grammar-practice",
      title:"Fix the Broken Memories 🧠",
      intro:"Marko finds more diary pages. They're old and damaged: some words have disappeared, and some sentences have mistakes.",
      mission:{ title:"Restore Dad's lost memories", text:"Complete the sentences to recover what happened in 1998." },
      pages:[
        { q:"Marko's dad ___ a denim jacket.", o:["buy", "bought", "buying"], a:1, hint:"It happened in 1998. Check the 📖 verb list.", why:"Bought is the Past Simple of buy." },
        { q:"He ___ new shoes that day.", o:["didn't bought", "didn't buy", "doesn't bought"], a:1, hint:"Look at the verb after didn't.", why:"After didn't, use the base verb." },
        { q:"___ he meet Alex at the festival?", o:["Did", "Does", "Was"], a:0, hint:"Remember: Did + base verb.", why:"We use Did to ask about past actions." },
        { q:"They ___ to a band at 10:30 p.m.", o:["listen", "listened", "listening"], a:1, hint:"Listen is a regular verb.", why:"Listen is a regular verb, so we add -ed." }
      ],
      repair:[
        { id:"r1", wrong:"He didn't went home early.", answer:"He didn't go home early.",
          accept:[/^he didn't go home early$/], hint:"Not quite! Try again.",
          hints:[{ re:/\bwent\b/, t:"Look at the verb after didn't." }, { re:/\bgoes\b|\bgoing\b/, t:"After didn't, use the base verb: go." }, { re:/^he doesn't|^he don't/, t:"It happened in 1998 — use didn't." }],
          why:"After didn't, use the base verb: didn't go." },
        { id:"r2", wrong:"Did he played guitar on stage?", answer:"Did he play guitar on stage?",
          accept:[/^did he play (the )?guitar on (the )?stage$/], hint:"Not quite! Try again.",
          hints:[{ re:/\bplayed\b/, t:"Remember: Did + base verb." }, { re:/^does|^do /, t:"It happened in 1998 — start with Did." }, { re:/\bplays\b|\bplaying\b/, t:"Use the base verb: play." }],
          why:"Did + subject + base verb: Did he play…?" }
      ],
      clue:3,
      reply:{ who:"marko", t:"Wait! My dad played guitar on stage? He never told me that!" },
      teacher:"<p><b>8 хв</b>: чотири сторінки — 4 хв, дві «зламані» фрази — 3 хв, доказ — 1 хв.</p><details><summary>Відповіді</summary><p>1 bought · 2 didn't buy · 3 Did · 4 listened · 5 <i>He didn't go home early.</i> · 6 <i>Did he play guitar on stage?</i></p></details><details><summary>Як вести</summary><ul><li>Неправильна відповідь не відкриває ключ одразу: з'являється підказка, учень пробує ще раз. <b>Show answer</b> — якщо треба рухатися далі.</li><li>Фрази 5–6 учень може сказати вголос, а ви — надрукувати. Перевірка приймає великі/малі літери, крапку чи її відсутність, <i>did not</i> = <i>didn't</i>.</li><li>Після кожної відповіді просіть «чому»: <i>Why go and not went?</i></li></ul></details>"
    },

    /* ========== SCENE 6 · HOW DID IT HAPPEN? ========== */
    {
      id:"adverbs", n:6, section:"s6", min:5, type:"vocab",
      title:"How Did It Happen? 🎵",
      intro:"The cassette from the box has a recording of the concert. To describe the night, we need adverbs.",
      pairs:[
        { kind:"adjective", rule:"Adjectives describe people or things.", ex:"The music was **loud**.", ua:"Прикметник описує людину або річ: яка музика? — гучна." },
        { kind:"adverb", rule:"Adverbs describe how someone does something.", ex:"They played **loudly**.", ua:"Прислівник описує дію: як грали? — гучно." }
      ],
      table:[["quick", "quickly", "швидко"], ["careful", "carefully", "обережно"], ["happy", "happily", "щасливо / радісно"], ["good", "well", "добре"], ["fast", "fast", "швидко"], ["hard", "hard", "старанно / наполегливо"]],
      rules:[
        { t:"Many adverbs end in **-ly**.", ex:"quick → quickly, loud → loudly" },
        { t:"Adjectives ending in **-y** change to **-ily**.", ex:"happy → happily, easy → easily" },
        { t:"Some adverbs are **irregular**.", ex:"good → well" },
        { t:"**Fast** and **hard** don't change.", ex:"a fast car → he drives fast" }
      ],
      qs:[
        { q:"The band played really ___.", o:["good", "well"], a:1, hint:"How did they play? Good is an adjective.", why:"Good is an adjective. The adverb is well." },
        { q:"The friends ran ___ to the concert.", o:["quick", "quickly"], a:1, hint:"How did they run? Use the adverb.", why:"quick → quickly. It describes how they ran." },
        { q:"Everyone danced ___.", o:["happy", "happily"], a:1, hint:"How did they dance? Remember: -y → -ily.", why:"happy → happily: y changes to i + ly." },
        { q:"Dad practised very ___ before the concert.", o:["hard", "hardly"], a:0, hint:"Did he practise a lot or almost not at all?", why:"Hard means with a lot of effort. Hardly means almost not." }
      ],
      speak:{ q:"Imagine you were at that concert. How did you dance, sing or move?", ua:"Уяви, що ти був / була на тому концерті. Як ти танцював / танцювала, співав / співала?",
        ex:"I danced happily and sang loudly.", fu:["Did you dance well?", "Did you get home quickly?"] },
      marko:"I think we have enough clues now. Let's find out exactly what happened!",
      teacher:"<p><b>5 хв</b>: пояснення — 2 хв, чотири речення — 2 хв, уява — 1 хв.</p><details><summary>Відповіді</summary><p>1 well · 2 quickly · 3 happily · 4 hard (<i>hardly</i> = майже не).</p></details><details><summary>Як вести</summary><p>Коротко, без лекції: питання <b>What is it like?</b> → прикметник, <b>How did he do it?</b> → прислівник. Шість прислівників можна додати в My words однією кнопкою.</p></details>"
    },

    /* ========== SCENE 7 · REBUILD THE NIGHT ========== */
    {
      id:"timeline", n:7, section:"s7", min:9, type:"mission",
      title:"Rebuild the Night 🕵️",
      intro:"The events are out of order! Use the diary clues to rebuild the night of 21 November 1998.",
      night:"21 November 1998",
      events:[
        { id:"A", t:"Marko's dad bought a denim jacket.", time:"5:00 p.m.", icon:"jacket" },
        { id:"B", t:"He met Alex and Emma.", time:"7:00 p.m.", icon:"friends" },
        { id:"C", t:"They listened to a band.", time:"10:30 p.m.", icon:"music" },
        { id:"D", t:"Marko's dad played guitar on stage.", time:"11:00 p.m.", icon:"guitar" },
        { id:"E", t:"Someone took a photograph.", time:"11:45 p.m.", icon:"camera" }
      ],
      start:["C", "E", "A", "D", "B"],
      tell:{ q:"Can you tell me what happened that night?", ua:"Розкажи, що сталося тієї ночі.",
        frames:["First, …", "Then …", "After that, …", "Finally, …"],
        ex:"First, he bought a denim jacket. Then he met his friends. After that, they listened to a band, and he played guitar on stage. Finally, someone took a photograph." },
      clue:4,
      reply:{ who:"marko", t:"Now I understand why that night was special! But why did he keep the old jacket?" },
      teacher:"<p><b>9 хв</b>: дошка — 5 хв, розповідь — 3 хв, доказ — 1 хв.</p><details><summary>Відповідь</summary><p>A 5:00 bought a jacket → B 7:00 met Alex and Emma → C 10:30 listened to a band → D 11:00 played guitar → E 11:45 took a photograph.</p></details><details><summary>Як вести</summary><ul><li>Час на картках прихований. <b>📓 Diary evidence</b> відкриває сторінку щоденника з часом — це законна підказка.</li><li>Картки можна перетягувати мишею, переставляти стрілками ← →, або натиснути одну картку, потім іншу — вони поміняються місцями.</li><li>Після <b>Check</b> система каже, скільки карток на місці, але не які саме.</li><li>Розповідь — усно, зі словами First / Then / After that / Finally. Зразок відкривайте лише в кінці.</li></ul></details>"
    },

    /* ========== SCENE 8 · INTERVIEW THE WITNESS ========== */
    {
      id:"interview", n:8, section:"s8", min:10, type:"speaking",
      title:"Interview the Witness 🎤",
      intro:"Ask Dad the right questions to discover the whole story.",
      build:[
        { id:"q1", p:["Where", "you", "go", "that night?"], answer:"Where did you go that night?",
          accept:[/^where did you go( that night| on that night)?$/] },
        { id:"q2", p:["What", "you", "wear?"], answer:"What did you wear?",
          accept:[/^what did you wear( that night| on that night)?$/] },
        { id:"q3", p:["Who", "you", "meet?"], answer:"Who did you meet?",
          accept:[/^who did you meet( that night| at the festival| there)?$/] },
        { id:"q4", p:["Why", "you", "play guitar?"], answer:"Why did you play guitar?",
          accept:[/^why did you play (the )?guitar( that night| on stage)?$/] },
        { id:"q5", p:["Who", "take", "the photo?"], answer:"Who took the photo?", subject:true,
          accept:[/^who took the (photo|photograph|picture)( that night)?$/],
          alt:[{ re:/^who did take the (photo|photograph|picture)( that night)?$/, t:"That's possible when we want to sound surprised or strong, but usually we say: Who took the photo?" }],
          hints:[{ re:/^who did .*\btook\b/, t:"This one is special: who is the subject here. No did — just the past form: Who took…?" }, { re:/\btake\b/, t:"Who is the subject here, so we use the past form: took." }] }
      ],
      hints:[
        { re:/\b(went|wore|met|played)\b/, t:"After did, use the base verb." },
        { re:/^(do|does) you/, t:"It's about the past — use did." },
        { re:/^did you/, t:"Start with the question word: Where / What / Who / Why." },
        { re:/^(where|what|who|why) you/, t:"Remember: question word + did + you + base verb." }
      ],
      buildOk:"Great question! Now ask Dad out loud.",
      subjNote:"In <b>Who took the photo?</b>, <i>who</i> is the subject — it asks about the person who did the action. So we don't need <i>did</i>: <b>Who took…?</b> (not <i>Who did take…?</i>). Compare: <b>Who did you meet?</b> — here <i>you</i> is the subject, so we need <i>did</i>.",
      talk:[
        { q:"Where did you go that night?", a:"I went to a music festival at the city club with my friends." },
        { q:"What did you wear?", a:"I wore my new second-hand denim jacket — I bought it that afternoon — and loose-fitting jeans." },
        { q:"Who did you meet?", a:"I met my friends Alex and Emma." },
        { q:"Why did you play guitar?", a:"Emma encouraged me to try. I was nervous, but my friends supported me." },
        { q:"Who took the photo?", a:"A girl from the crowd took it after my performance. Emma gave her the camera. I never found out her name…" },
        { q:"Why did you keep the photograph?", a:"Because it reminds me of the first time I was brave enough to perform in public.", bonus:true }
      ],
      about:[
        { q:"What did you do last weekend?", ua:"Що ти робив / робила минулих вихідних?", fu:["What was the best part?", "Who did you go with?"],
          ex:"Last weekend I went to the cinema with my cousin. We watched a funny film and ate a lot of popcorn." },
        { q:"Did you buy or wear anything special recently?", ua:"Ти нещодавно купив / купила або вдягнув / вдягнула щось особливе?", fu:["Where did you buy it?", "How did you feel in it?"],
          ex:"Yes! Last month I bought new white trainers. They're really comfortable, and I wore them to a party on Saturday." },
        { q:"Have you ever had a day you will never forget? What happened?", ua:"У тебе був день, який ти ніколи не забудеш? Що сталося?", fu:["How did you feel?", "Who was with you?"],
          ex:"Yes. Last summer I saw the sea for the first time. We swam every day, and one evening we saw dolphins! I felt so happy.",
          note:"Have you ever…? = Чи було у тебе колись…? Відповідай про той день у Past Simple." }
      ],
      end:[
        { who:"marko", t:"So Dad became more confident because his friends supported him. That's actually pretty cool!" },
        { who:"dad", t:"There's one more thing I haven't told you…" }
      ],
      teacher:"<p><b>10 хв</b>: побудувати питання — 3 хв, інтерв'ю — 4 хв, «About you» — 3 хв.</p><details><summary>Питання (ключ)</summary><p>1 Where did you go that night? · 2 What did you wear? · 3 Who did you meet? · 4 Why did you play guitar? · 5 <b>Who took the photo?</b></p><p><b>Питання 5 — до підмета.</b> <i>Who</i> тут сам є підметом (хто зробив дію), тому <i>did</i> не потрібне: <i>Who took the photo?</i> Порівняйте: <i>Who did you meet?</i> — підмет <i>you</i>, тож <i>did</i> потрібне. Варіант <i>Who did take…?</i> система не позначає помилкою (він можливий для наголосу), але показує звичайну форму.</p></details><details><summary>Інтерв'ю: ви — тато Марка</summary><ul><li>Учень ставить питання вголос, ви відповідаєте від імені тата. Кнопка <b>Reveal Dad's answer</b> показує відповідь на екрані — натискайте <i>після</i> того, як відповіли усно.</li><li>Можна імпровізувати, але тримайте факти: фестиваль у міському клубі, куртка — вживана, куплена того ж дня, Alex і Emma, Emma підбадьорила, фото зробила незнайома дівчина з натовпу камерою Emma.</li><li>Шосте питання — бонусне: <i>Why did you keep the photograph?</i> Якщо учень не здогадається його поставити, підкажіть: <i>What else does Marko want to know?</i></li></ul></details><details><summary>About you</summary><p>Без граматичного «тесту»: слухайте, виправляйте м'яко (перефразом). Питання 3 — <i>Have you ever…?</i> — коротко поясніть значення (є під 🇺🇦), відповідь — у Past Simple.</p></details>"
    },

    /* ========== SCENE 9 · THE FINAL DISCOVERY ========== */
    {
      id:"final", n:9, section:"s9", min:4, type:"cliffhanger",
      title:"The Final Discovery 🔐",
      intro:"Before the last part of the story — three quick tasks.",
      tasks:{
        fill:{ q:"He ___ (buy) a jacket in 1998.", answer:"bought", accept:[/^bought$/], hint:"Not quite! Try again.",
          hints:[{ re:/^buyed$|^buied$/, t:"Buy is irregular. Check the 📖 verb list." }, { re:/^buy$|^buys$/, t:"It happened in 1998 — use the Past Simple." }],
          why:"buy → bought." },
        choose:{ q:"Choose the correct question.", o:["Did they went to a concert?", "Did they go to a concert?"], a:1, hint:"Remember: Did + base verb.", why:"Did + subject + base verb: Did they go…?" },
        speak:{ q:"Tell me one interesting thing you learned about Marko's dad.",
          ideas:["He played guitar on stage for the first time.", "He bought his denim jacket in a second-hand shop.", "He was nervous, but his friends supported him.", "He kept the photo for almost 30 years."] }
      },
      done:{ title:"MISSION COMPLETED! 🎉", text:"You restored the memories, solved the timeline, and discovered why the photograph was so important!" },
      learned:["Talk about finished actions in the past.", "Use regular and irregular Past Simple verbs.", "Make negative sentences with didn't.", "Ask questions using did.", "Describe actions using adverbs.", "Talk about memorable experiences."],
      story:{
        scene:"Sunday evening. Marko takes the old denim jacket out of the wardrobe.",
        smile:"He smiles. It's a bit too big for him… but it looks great.",
        pocket:"Then he notices something inside one of the pockets.",
        paper:"An old, folded piece of paper.",
        buzz:"Before he can open it, his phone vibrates.",
        msgs:[
          { who:"unknown", t:"You found the photo. Good job. 📸" },
          { who:"unknown", t:"But there's something missing from that night." },
          { who:"unknown", t:"Find out what was hidden in the jacket." },
          { who:"unknown", t:"You'll understand why." }
        ],
        marko:{ who:"marko", t:"Wait… who sent this?!" },
        tbc:"TO BE CONTINUED…",
        next:{ k:"NEXT: LESSON 6 — UNIT 2 REVISION", title:"The note in the pocket", lines:["What is written on the folded paper?", "Who is the unknown sender?", "And what is still missing from that night?"] }
      },
      teacher:"<p><b>4 хв</b>: три завдання — 2 хв, фінал історії — 2 хв.</p><details><summary>Відповіді</summary><p>1 bought · 2 B <i>Did they go to a concert?</i> · 3 будь-яка розумна відповідь (не оцінюється автоматично — натисніть <b>✓ Said it</b>, коли учень відповів).</p></details><details><summary>Фінал</summary><p>Темний сюжетний екран: Марко дістає куртку, учень натискає на кишеню — там складений папірець. Повідомлення від невідомого — гачок для Уроку 6 (повторення Unit 2). Спитайте: <i>Who do you think sent the message? What's on the paper?</i> Підказка, якщо учень не здогадається: <i>Remember the girl who took the photo?</i></p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/memory.js) ---------- */
  screens(add, st){
    const p = st("photo");
    add(p, "tmDesk", { key:"desk", store:"desk", hero:p.hero, chat:p.chat });
    add(p, "tmPhotoTalk", { key:"talk", store:"talk", qs:p.qs, dadNote:p.dadNote });

    const w = st("wardrobe");
    add(w, "tmWardrobe", { key:"match", store:"match", outfits:w.outfits, bank:w.bank, help:w.help },
      w.outfits.map(o => o.id + ": " + o.core.join(", ")).join(" · "));
    add(w, "tmWear", { key:"wear", store:"wear", outfits:w.outfits, speak:w.speak, clue:w.clue, match:w.match, reply:w.reply });

    const d = st("diary");
    add(d, "tmDiary", { key:"diary", store:"diary", date:d.date, lines:d.lines, tasks:d.tasks, marko:d.marko },
      "1 The past · 2 bought, met, went, took · 3 I didn't feel very confident · 4 listened, played");

    const g = st("grammar");
    add(g, "tmDiscover", { key:"disc", store:"disc", examples:g.examples, qs:g.discover }, "1 A · 2 Sentence 2 · 3 A · 4 B");
    add(g, "tmFile", { key:"file", store:"file", file:g.file });
    add(g, "tmCheck", { key:"check", store:"check", qs:g.check, clue:g.clue, reply:g.reply }, "1 saw · 2 didn't leave · 3 Did");

    const m = st("memories");
    add(m, "tmPages", { key:"pages", store:"pages", mission:m.mission, pages:m.pages }, "1 bought · 2 didn't buy · 3 Did · 4 listened");
    add(m, "tmRepair", { key:"repair", store:"repair", items:m.repair, clue:m.clue, reply:m.reply }, "He didn't go home early. · Did he play guitar on stage?");

    const a = st("adverbs");
    add(a, "tmAdverbs", { key:"intro", store:"intro", pairs:a.pairs, table:a.table, rules:a.rules });
    add(a, "tmNight", { key:"night", store:"night", qs:a.qs, speak:a.speak, marko:a.marko }, "1 well · 2 quickly · 3 happily · 4 hard");

    const t = st("timeline");
    add(t, "tmBoard", { key:"board", store:"board", events:t.events, start:t.start, night:t.night, diary:st("diary") },
      "A bought the jacket (5:00) → B met friends (7:00) → C listened to a band (10:30) → D played guitar (11:00) → E took a photo (11:45)");
    add(t, "tmTell", { key:"tell", store:"tell", events:t.events, night:t.night, tell:t.tell, clue:t.clue, reply:t.reply }, t.tell.ex);

    const i = st("interview");
    add(i, "tmBuild", { key:"build", store:"build", items:i.build.map(x => Object.assign({ why:i.buildOk }, x)), hints:i.hints, subjNote:i.subjNote }, i.build.map((x, k) => (k + 1) + " " + x.answer).join(" · "));
    add(i, "tmInterview", { key:"talk", store:"talk", talk:i.talk });
    add(i, "tmAboutYou", { key:"you", store:"you", qs:i.about, end:i.end });

    const f = st("final");
    add(f, "tmExit", { key:"exit", store:"exit", tasks:f.tasks, done:f.done, learned:f.learned }, "1 bought · 2 B · 3 open answer");
    add(f, "tmJacket", Object.assign({ key:"jacket", store:"jacket" }, f.story));
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const c = (ans && ans._case) || { clues:{}, badges:{} };
    const clues = Object.keys(c.clues || {}).length;
    const pg = (ans.memories && ans.memories.pages && ans.memories.pages.r) || {};
    const rp = (ans.memories && ans.memories.repair && ans.memories.repair.r) || {};
    const restored = Object.values(pg).filter(x => x && (x.ok || x.shown)).length + Object.values(rp).filter(x => x && (x.ok || x.shown)).length;
    const board = (ans.timeline && ans.timeline.board) || {};
    const built = Object.values((ans.interview && ans.interview.build && ans.interview.build.r) || {}).filter(x => x && (x.ok || x.said)).length;
    return {
      icon:"📸", title:"Lesson 5 complete",
      text:"You found out what happened on the best night ever. But someone knows more about that night — and the jacket still has a secret…",
      stats:[
        [`🔎 ${clues} / 4`, "clues found"],
        [`🧠 ${restored} / 6`, "memories restored"],
        [`🕵️ ${board.solved ? (board.tries <= 1 ? "first try" : board.tries + " tries") : "—"}`, "timeline"],
        [`🎤 ${built} / 5`, "questions for Dad"]
      ]
    };
  }
};
})();
