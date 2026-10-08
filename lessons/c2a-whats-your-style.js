/* ============================================================
   LESSON 4 · Cycle 2A · WHAT'S YOUR STYLE? 👕🎧
   Unit 2 · In fashion — початок нового розділу.
   Vocabulary + Reading + Speaking. Past Simple тут НЕ вивчаємо
   (він — в уроці 5); текст про епохи написаний у теперішньому часі
   («Welcome to 1956…»), щоб не забігати наперед.
   Формат — урок один на один (учень + учитель, демонстрація екрана).
   Персонажі беруться з c1a (див. requires).
   Екрани — з js/screens/fashion.js, малюнки одягу — js/art/wardrobe.js.
   Порядок екранів — у функції screens() в кінці файлу.
   Розминка (stage "warm") використовує готові фото з папки assets/c2a/ (warm-1 … warm-4).
   Реалістичні картинки можна додати пізніше: поля img у stage "opening"
   (обкладинка) і stage "ending" (photo.img — старе фото 1998 року).
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

(function(){
/* ---------- образи (flat lay): { top, outer, bottom, shoes, extras, tags } ---------- */
const LOOK = {
  /* warm-up */
  w1: { top:{ k:"shirt", c:"#F7F7F2", tie:"#7A1F2B" }, outer:{ k:"blazer", c:"#2C3442" }, bottom:{ k:"smart", c:"#2C3442" }, shoes:{ k:"smart", c:"#3B2416" } },
  w2: { top:{ k:"hoodie", c:"#9AA5B1" }, bottom:{ k:"joggers", c:"#3B4252" }, shoes:{ k:"trainers", c:"#F4F4F4" } },
  w3: { top:{ k:"tee", c:"#F2F0EA", print:"logo" }, outer:{ k:"denim", c:"#8DB3E2", big:true }, bottom:{ k:"loose", c:"#C8B89A" }, shoes:{ k:"chunky", c:"#F4F4F4", accent:"#3D5AFE" }, extras:[{ k:"cap", c:"#1D1B2C" }, { k:"bag", c:"#1D1B2C" }] },
  w4: { top:{ k:"tee", c:"#FFD43B", print:"smile" }, outer:{ k:"bomber", c:"#FF2E93", block:"#00E5FF", block2:"#FFD43B" }, bottom:{ k:"flares", c:"#7C4DFF", pat:"ck" }, shoes:{ k:"hightops", c:"#00C2A8" }, extras:[{ k:"glasses", style:"big", c:"#FF2E93", tint:"rgba(0,229,255,.6)" }] },
  /* Marko's first tries */
  m1: { top:{ k:"hoodie", c:"#3E8E6B" }, bottom:{ k:"joggers", c:"#4B5563" }, shoes:{ k:"trainers", c:"#E9E6DF", worn:true } },
  m2: { top:{ k:"shirt", c:"#F2EEDF", tie:"#8B5A2B" }, outer:{ k:"blazer", c:"#6B5B45", big:true }, bottom:{ k:"smart", c:"#6B5B45" }, shoes:{ k:"smart", c:"#2B1E14" } },
  m3: { top:{ k:"tee", c:"#FF8FB1", print:"text", text:"PIZZA" }, bottom:{ k:"skinny", c:"#2F80ED", pat:"tt" }, shoes:{ k:"sandals", socks:true }, extras:[{ k:"glasses", style:"big", tint:"rgba(255,212,59,.7)", c:"#111" }] },
  /* the outfit rack */
  uncomf: { top:{ k:"shirt", c:"#FFFFFF", tie:"#B3261E" }, bottom:{ k:"skinny", c:"#22252E", denim:true }, shoes:{ k:"smart", c:"#7A1F2B" } },
  comf: { top:{ k:"hoodie", c:"#B8C4D6", big:true }, bottom:{ k:"joggers", c:"#5C6B80" }, shoes:{ k:"trainers", c:"#FFFFFF" } },
  skinny: { top:{ k:"tee", c:"#E9E6DF" }, bottom:{ k:"skinny", c:"#2B2F3A", denim:true }, shoes:{ k:"boots", c:"#2B2B2B" } },
  loose: { top:{ k:"tee", c:"#E9E6DF" }, bottom:{ k:"loose", c:"#8A9A6B" }, shoes:{ k:"trainers", c:"#F4F4F4" } },
  newb: { top:{ k:"tee", c:"#FFFFFF", print:"logo", ink:"#3D5AFE" }, shoes:{ k:"trainers", c:"#FFFFFF", accent:"#3D5AFE", box:true }, tags:[{ t:"NEW", bg:"#FFFFFF" }], sparkle:true },
  second: { hanger:true, outer:{ k:"leather", c:"#5A3A22" }, top:{ k:"tee", c:"#C9B79C", print:"band" }, shoes:{ k:"boots", c:"#3B2A1E", worn:true }, tags:[{ t:"£4" }] },
  casual: { top:{ k:"hoodie", c:"#E8590C" }, bottom:{ k:"loose", c:"#4A6FA5", denim:true }, shoes:{ k:"trainers", c:"#F4F4F4" }, extras:[{ k:"cap", c:"#1D3557" }] },
  smart: { top:{ k:"shirt", c:"#F7F7F2", tie:"#1D3557" }, outer:{ k:"blazer", c:"#25304A" }, bottom:{ k:"smart", c:"#25304A" }, shoes:{ k:"smart", c:"#2B1E14" } },
  trendy: { top:{ k:"tee", c:"#F2F0EA", print:"logo" }, outer:{ k:"denim", c:"#8DB3E2", big:true }, bottom:{ k:"loose", c:"#C8B89A" }, shoes:{ k:"chunky", c:"#F4F4F4", accent:"#FF5A4E" }, extras:[{ k:"bag", c:"#1D1B2C" }] },
  unfash: { top:{ k:"shirt", c:"#C9D7A8", pat:"ck" }, bottom:{ k:"smart", c:"#9C8B6B", short:true, belt:"#5A3A22" }, shoes:{ k:"sandals", socks:true }, extras:[{ k:"watch" }] },
  badly: { top:{ k:"tee", c:"#C7C2B8", crumple:true, stain:true }, bottom:{ k:"joggers", c:"#6B6B6B", stain:true }, shoes:{ k:"trainers", c:"#D9D4C7", worn:true }, tags:[{ t:"£250", bg:"#1D1B2C" }] },
  well: { top:{ k:"shirt", c:"#DCE7F5" }, bottom:{ k:"smart", c:"#3A4A5E" }, shoes:{ k:"smart", c:"#5A3A22" }, tags:[{ t:"£15" }] },
  /* outfit detective */
  alex: { top:{ k:"shirt", c:"#FFFFFF", tie:"#1D3557" }, outer:{ k:"blazer", c:"#1E2433" }, bottom:{ k:"smart", c:"#1E2433" }, shoes:{ k:"smart", c:"#111111", new:true } },
  kai: { top:{ k:"hoodie", c:"#A3B18A", big:true }, bottom:{ k:"joggers", c:"#5B6B5A" }, shoes:{ k:"trainers", c:"#E9E6DF", worn:true }, extras:[{ k:"headphones", c:"#2B2B2B", accent:"#A3B18A" }] },
  sofia: { top:{ k:"tee", c:"#F2F0EA", print:"logo", ink:"#D6336C" }, outer:{ k:"denim", c:"#BFD3F2", big:true }, bottom:{ k:"loose", c:"#F1E3C8" }, shoes:{ k:"chunky", c:"#FFFFFF", accent:"#D6336C", new:true }, extras:[{ k:"bag", c:"#D6336C" }, { k:"glasses", style:"wayfarer", c:"#111" }] },
  mia: { top:{ k:"tee", c:"#2B2B2B", print:"band", text:"THE NOISE" }, outer:{ k:"leather", c:"#4A2C1A", badges:true }, bottom:{ k:"skinny", c:"#15151A", denim:true }, shoes:{ k:"boots", c:"#2B2B2B", worn:true }, tags:[{ t:"£8" }] },
  /* checkpoint */
  ckA: { top:{ k:"tee", c:"#1D1B2C", print:"band", text:"LIVE" }, outer:{ k:"leather", c:"#15151A" }, bottom:{ k:"skinny", c:"#22252E", denim:true }, shoes:{ k:"boots", c:"#1A1A1A" }, extras:[{ k:"glasses", style:"wayfarer" }] },
  ckB: { top:{ k:"hoodie", c:"#3E8E6B", big:true }, bottom:{ k:"loose", c:"#6B7F99" }, shoes:{ k:"trainers", c:"#F4F4F4" } },
  /* eras */
  e50: { top:{ k:"shirt", c:"#FFFFFF", tie:"#111111" }, outer:{ k:"leather", c:"#15151A" }, bottom:{ k:"skinny", c:"#1F2A44", denim:true, roll:true }, shoes:{ k:"smart", c:"#111111" }, extras:[{ k:"glasses", style:"wayfarer" }] },
  e60: { top:{ k:"shirt", c:"#E8A33D", pat:"fl", big:true }, bottom:{ k:"flares", c:"#5B8FC7", denim:true }, shoes:{ k:"sandals" }, extras:[{ k:"glasses", style:"round", tint:"rgba(255,140,60,.75)", c:"#B67A47" }, { k:"headband", c:"#8AB17D", flowers:true }] },
  e70: { top:{ k:"tee", c:"#1D1B2C", rip:true, pins:true, print:"band", text:"NO RULES" }, outer:{ k:"leather", c:"#15151A", studs:true }, bottom:{ k:"skinny", c:"#B3261E", pat:"tt" }, shoes:{ k:"boots", c:"#1A1A1A", worn:true }, extras:[{ k:"chain", c:"#C9CED6", pendant:false }] },
  e80: { top:{ k:"tee", c:"#FFD43B", print:"stripe", ink:"#FF2E93", ink2:"#00E5FF" }, outer:{ k:"bomber", c:"#7C4DFF", block:"#FF2E93", block2:"#00E5FF", big:true }, bottom:{ k:"skinny", c:"#8FB3E8", pat:"aw" }, shoes:{ k:"hightops", c:"#FFFFFF", accent:"#FF2E93" }, extras:[{ k:"glasses", style:"big", c:"#FFFFFF", tint:"rgba(255,46,147,.65)" }, { k:"headband", c:"#00E5FF" }] },
  e90: { top:{ k:"hoodie", c:"#2F80ED", big:true, print:"text", text:"FRESH" }, bottom:{ k:"baggy", c:"#4A6FA5", denim:true }, shoes:{ k:"chunky", c:"#F4F4F4" }, extras:[{ k:"bucket", c:"#E9E2CF" }, { k:"chain" }] },
  eNow: { top:{ k:"tee", tiedye:true }, outer:{ k:"bomber", c:"#C8B6FF", big:true }, bottom:{ k:"loose", c:"#E9E2CF" }, shoes:{ k:"chunky", c:"#FFFFFF", accent:"#7C4DFF" }, extras:[{ k:"phone" }, { k:"headphones", c:"#F2F0EA", accent:"#7C4DFF" }] }
};

const ERAS = [
  { id:"50s", decade:"1950s", e:"🎸", music:"Rock'n'roll", mood:"Fast guitars, dancing and jukeboxes" },
  { id:"60s", decade:"1960s", e:"🌼", music:"Hippie music", mood:"Peace, love and big festivals" },
  { id:"70s", decade:"1970s", e:"🤘", music:"Punk", mood:"Loud, angry and do-it-yourself" },
  { id:"80s", decade:"1980s", e:"🎤", music:"Pop", mood:"Music videos and neon colours" },
  { id:"90s", decade:"1990s", e:"🎧", music:"Hip-hop", mood:"Beats, rhymes and streetwear" },
  { id:"today", decade:"Today", e:"📱", music:"Social media", mood:"Every style, every second" }
];

window.SIGNAL_LESSONS.c2a = {
  id: "c2a",
  cycle: 2,
  lessonType: "vocab-reading",
  theme: "style",
  title: "What's Your Style?",
  subtitle: "Unit 2 · In fashion · Lesson 4",
  series: "The Jacket Secret",
  question: "What makes a great style?",
  minutes: 59,
  setting: "Style & Music Day is on Friday at Marko's school. The Signal crew helps him in the group chat.",

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["opening", "warm", "story"],
    vocabPresentation: ["rack"],
    discoveryGuide: ["rack", "preread", "reading", "check"],
    vocabPractice: ["game", "detective", "checkpoint"],
    grammar: [],
    grammarPractice: [],
    listening: [],
    speaking: ["warm", "machine", "speak"],
    mission: ["mission"],
    summary: ["recap", "ending"],
    homework: []
  },
  tabs: [
    { key:"warmUp", label:"1 Warm-up" }, { key:"vocabPresentation", label:"2 Words" }, { key:"vocabPractice", label:"3 Practice" },
    { key:"reading", label:"4 Reading" }, { key:"speaking", label:"5 Speaking" }, { key:"mission", label:"6 Final mission" }, { key:"summary", label:"7 Wrap-up" }
  ],

  /* 12 нових слів = 6 пар протилежностей */
  pairs: [["comfortable", "uncomfortable"], ["skinny", "loose-fitting"], ["brand new", "second-hand"], ["smart", "casual"], ["trendy", "unfashionable"], ["well-dressed", "badly-dressed"]],
  vocab: [
    { w:"comfortable", ipa:"/ˈkʌmftəbl/", g:"style", en:"nice to wear; you feel relaxed in it", ua:"зручний", ex:"These trainers are so comfortable — I can walk all day." },
    { w:"uncomfortable", ipa:"/ʌnˈkʌmftəbl/", g:"style", en:"not nice to wear; it feels wrong or hurts", ua:"незручний", ex:"My new shoes are uncomfortable. My feet hurt!" },
    { w:"skinny", ipa:"/ˈskɪni/", g:"style", en:"very tight; close to your legs or body", ua:"вузький, облягаючий (про одяг)", ex:"She's wearing skinny jeans and black boots." },
    { w:"loose-fitting", ipa:"/ˌluːs ˈfɪtɪŋ/", g:"style", en:"not tight around your body", ua:"вільний, просторий", ex:"I like loose-fitting trousers because they're comfortable." },
    { w:"brand new", ipa:"/ˌbrænd ˈnjuː/", g:"style", en:"completely new; never worn before", ua:"абсолютно новий", ex:"Look — brand new trainers! They're still in the box." },
    { w:"second-hand", ipa:"/ˌsekənd ˈhænd/", g:"style", en:"not new; another person owned it before you", ua:"вживаний, секонд-хенд", ex:"I buy second-hand jackets. They're cheap and cool." },
    { w:"smart", ipa:"/smɑːt/", g:"style", en:"neat and formal, for special events", ua:"ошатний, елегантний", ex:"Wear something smart for the wedding." },
    { w:"casual", ipa:"/ˈkæʒuəl/", g:"style", en:"relaxed, for every day", ua:"повсякденний", ex:"At the weekend I wear casual clothes: jeans and a hoodie." },
    { w:"trendy", ipa:"/ˈtrendi/", g:"style", en:"popular and fashionable right now", ua:"модний, трендовий", ex:"Wide trousers are really trendy this year." },
    { w:"unfashionable", ipa:"/ʌnˈfæʃnəbl/", g:"style", en:"not popular now; looks old-style", ua:"немодний", ex:"My dad thinks my trainers are cool, but they're so unfashionable!" },
    { w:"well-dressed", ipa:"/ˌwel ˈdrest/", g:"style", en:"wearing clothes that look neat and right for the situation", ua:"добре вдягнений", ex:"You don't need expensive clothes to be well-dressed." },
    { w:"badly-dressed", ipa:"/ˌbædli ˈdrest/", g:"style", en:"wearing clothes that look messy or wrong for the situation", ua:"погано вдягнений", ex:"A dirty T-shirt at a wedding? That's badly-dressed!" }
  ],
  receptive: [],
  recall: [],

  requires: ["c1a"],
  get characters(){ return (window.SIGNAL_LESSONS.c1a || {}).characters || {}; },
  order: ["zoe", "leo", "dana", "marko", "nate"],

  /* ---------- stages ---------- */
  stages: [
    /* 1 · OPENING ------------------------------------------------- */
    {
      id:"opening", n:1, section:"warmUp", min:1, type:"opening",
      title:"What's your style?",
      unit:"UNIT 2 — IN FASHION", lesson:"LESSON 4",
      sub:"Fashion changes. Music changes. But what makes a great style?",
      img:null,
      cast:[
        { id:"zoe", cap:"always in black", rot:-4 },
        { id:"leo", cap:"sporty", rot:3 },
        { id:"dana", cap:"neat and simple", rot:-2 },
        { id:"nate", cap:"loud colours", rot:4 },
        { id:"marko", cap:"…no idea 😅", rot:-3 }
      ],
      today:[
        { e:"👕", t:"discover new fashion vocabulary" },
        { e:"👟", t:"compare different styles" },
        { e:"🎸", t:"travel through fashion history" },
        { e:"💬", t:"talk about your own style" },
        { e:"🎯", t:"create the perfect outfit" }
      ],
      teacher:"<p><b>1 хв.</b> Новий розділ — новий настрій: прочитайте назву й підзаголовок, спитайте: <i>Who has the most interesting style in this photo?</i> (усі в худі — це підводка до проблеми Марка).</p><details><summary>Картинка обкладинки</summary><p>Зараз тут колаж із фото персонажів. Якщо згенеруєте окрему картинку (кілька підлітків у різних стилях, 16:9), покладіть її в <code>assets/covers/</code> і впишіть шлях у поле <code>img</code> етапу <code>opening</code>.</p></details>"
    },

    /* 2 · WARM-UP -------------------------------------------------- */
    {
      id:"warm", n:2, section:"warmUp", min:4, type:"talk",
      title:"Your style today 👟",
      say:"Look at the four outfits. Answer the questions one by one.",
      ua:"Подивись на чотири образи. Відповідай на питання по одному.",
      gallery:[
        { id:"1", label:"Suit and tie", look:LOOK.w1, img:"assets/c2a/warm-1.webp", alt:"Outfit 1: a dark blue suit, a white shirt, a red tie and brown leather shoes" },
        { id:"2", label:"Hoodie and joggers", look:LOOK.w2, img:"assets/c2a/warm-2.webp", alt:"Outfit 2: a grey hoodie, dark blue joggers and white trainers" },
        { id:"3", label:"Jacket and a cap", look:LOOK.w3, img:"assets/c2a/warm-3.webp", alt:"Outfit 3: a light blue jacket, beige trousers, white trainers, a small bag and a cap" },
        { id:"4", label:"Neon and flares", look:LOOK.w4, img:"assets/c2a/warm-4.webp", alt:"Outfit 4: a bright pink and blue jacket, a smiley T-shirt, purple flared trousers, pink sunglasses and green high-tops" }
      ],
      qs:[
        { q:"Which outfit do you like most? Why?", ua:"Який образ тобі подобається найбільше? Чому?", pick:true, fu:["What colour do you like most?", "Would you change anything?"],
          idea:"I like outfit 3 most because the blue jacket looks cool and the trousers look easy to wear." },
        { q:"Which one would you wear to school?", ua:"Який із них ти вдягнув би / вдягнула б до школи?", pick:true, fu:["Do you have a school uniform?"],
          idea:"I'd wear outfit 2 to school. A hoodie is warm, and I can sit in it all day." },
        { q:"Which one would you wear to a party?", ua:"Який — на вечірку?", pick:true,
          idea:"For a party, I'd choose outfit 4. It's bright and fun!" },
        { q:"Which outfit would you NEVER wear?", ua:"Який образ ти НІКОЛИ б не вдягнув / не вдягнула?", pick:true, fu:["Why not?"],
          idea:"I would never wear outfit 1. A tie isn't for me — I'd feel like a businessman! 😅" },
        { q:"What are you wearing today?", ua:"Що на тобі сьогодні?", fu:["Is it your favourite outfit?", "Who chose it?"],
          idea:"Today I'm wearing jeans, a grey T-shirt and my favourite trainers." },
        { q:"Do you usually choose comfort or style?", ua:"Ти зазвичай обираєш зручність чи стиль?",
          idea:"I usually choose comfortable clothes. I like hoodies, trainers and loose trousers because they are easy to wear." },
        { q:"Do you care about fashion?", ua:"Тобі важлива мода?", fu:["Who in your family cares most about fashion?"],
          idea:"A little. I like nice trainers, but I don't buy new clothes very often." }
      ],
      phrases:["I like … because …", "I'd wear … to …", "I would never wear …", "I usually …"],
      teacher:"<p><b>4 хв.</b> Питання відкриваються по одному (кнопка <b>Next question</b>). Для питань 1–4 учень натискає на образ. Не потрібно проходити всі сім — 4–5 вистачить.</p><details><summary>Як вести</summary><ul><li>Кнопки внизу картки — ваші реакції: вони з'являються великою «бульбашкою», яку учень бачить на спільному екрані.</li><li><b>💡 Need an idea?</b> — приклад-підказка, а не «правильна відповідь».</li><li>Нові слова ще не вводимо: якщо учень сам каже <i>comfortable</i> чи <i>smart</i> — чудово, похваліть.</li></ul></details>"
    },

    /* 3 · STORY ---------------------------------------------------- */
    {
      id:"story", n:3, section:"warmUp", min:2, type:"story",
      title:"A new challenge 📱",
      say:"Marko writes to the crew. Read the chat.",
      ua:"Марко пише команді. Прочитай чат.",
      msgs:[
        { sys:"Monday · 16:20" },
        { who:"marko", t:"Look what's on the school noticeboard 👀", att:{ poster:{ kicker:"School event", title:"🎧 STYLE & MUSIC DAY 🎧", when:"Friday at school", lines:["Choose a decade.", "Choose a sound.", "Create the look."] } } },
        { who:"zoe", t:"Wait, that sounds amazing! 🎧" },
        { who:"marko", t:"Guys… I have a problem. 😭" },
        { who:"marko", t:"I have absolutely no idea what to wear." },
        { who:"dana", t:"You have three days. Just choose something!" },
        { who:"marko", t:"That's the problem. EVERYTHING looks wrong. 😂", att:{ looks:[{ label:"My usual hoodie", look:LOOK.m1 }, { label:"Dad's old suit 😬", look:LOOK.m2 }, { label:"…this?", look:LOOK.m3 }] } },
        { who:"nate", t:"Bro. Number 3. 😂😂" },
        { who:"leo", t:"Don't panic. We can help you!" }
      ],
      unlock:{ title:"NEW MISSION UNLOCKED", text:"Help Marko create the perfect Style & Music Day outfit." },
      teacher:"<p><b>2 хв.</b> Повідомлення з'являються самі; <b>Show all</b> — показати одразу. Після чату спитайте: <i>What's Marko's problem? Which of his outfits is the worst? Why?</i></p><details><summary>Підказки</summary><p>Не розв'язуйте проблему — це місія на весь урок. Кнопка внизу — <b>Accept mission →</b>.</p></details>"
    },

    /* 4 · VOCABULARY: THE OUTFIT RACK ------------------------------- */
    {
      id:"rack", n:4, section:"vocabPresentation", min:9, type:"vocab",
      title:"The outfit rack 👕",
      cards:[
        { title:"Comfortable or not?", q:"Which outfit looks easier to wear for five hours?", ua:"Який образ легше носити п'ять годин?",
          left:{ w:"uncomfortable", look:LOOK.uncomf, cap:"A stiff collar, very tight jeans and hard new shoes" },
          right:{ w:"comfortable", look:LOOK.comf, cap:"A soft hoodie, joggers and trainers" }, a:"B",
          hint:"Which clothes are soft and easy to move in?", why:"Soft, loose clothes feel nice for many hours." },
        { title:"Tight or loose?", q:"Which clothes stay very close to the body?", ua:"Який одяг щільно прилягає до тіла?",
          left:{ w:"skinny", look:LOOK.skinny, cap:"Jeans that are tight around the legs" },
          right:{ w:"loose-fitting", look:LOOK.loose, cap:"Wide trousers with lots of space" }, a:"A",
          hint:"Look at the legs of the trousers.", why:"Skinny jeans are tight — they stay close to your legs." },
        { title:"New or old?", q:"Which item had another owner before?", ua:"Яка річ мала іншого власника?",
          left:{ w:"brand new", look:LOOK.newb, cap:"Trainers still in the box and a T-shirt with a NEW label" },
          right:{ w:"second-hand", look:LOOK.second, cap:"A jacket and old boots from a charity shop — £4" }, a:"B",
          hint:"Look at the labels and the hanger.", why:"Second-hand clothes come from another person. They aren't new, but they can still look great!" },
        { title:"Formal or relaxed?", q:"Which outfit would you choose for a formal event?", ua:"Який образ ти обереш для офіційної події?",
          left:{ w:"casual", look:LOOK.casual, cap:"Jeans, a hoodie and a cap" },
          right:{ w:"smart", look:LOOK.smart, cap:"A suit, a shirt and a tie" }, a:"B",
          hint:"Think about a wedding or a school ceremony.", why:"Smart clothes are for special, formal events. Casual clothes are for every day." },
        { title:"In or out?", q:"Which outfit looks popular right now?", ua:"Який образ виглядає популярним саме зараз?",
          left:{ w:"trendy", look:LOOK.trendy, cap:"A big denim jacket, wide trousers, chunky trainers" },
          right:{ w:"unfashionable", look:LOOK.unfash, cap:"A checked shirt, short trousers, socks with sandals" }, a:"A",
          hint:"Which outfit can you see on social media today?", why:"Trendy clothes are popular now. Unfashionable clothes look old-style." },
        { title:"Ready for the concert?", q:"Two friends are going to the school concert. Who looks ready for it?", ua:"Двоє друзів ідуть на шкільний концерт. Хто виглядає готовим?",
          left:{ w:"badly-dressed", look:LOOK.badly, cap:"A dirty, creased T-shirt — but very expensive: £250!" },
          right:{ w:"well-dressed", look:LOOK.well, cap:"A clean shirt and neat trousers — only £15" }, a:"B",
          hint:"Look at the clothes, not at the price.", why:"Outfit B looks neat, clean and right for a concert.",
          note:"Well-dressed does NOT mean expensive. It means your clothes look neat, clean and right for the situation. Outfit B costs only £15, but it looks great!" }
      ],
      teacher:"<p><b>9 хв</b> — шість пар, ≈1,5 хв на пару. Спершу питання-відкриття: учень обирає A або B. Після правильного вибору з'являються слова: значення, переклад, приклад, 🔊.</p><details><summary>Відповіді</summary><p>1 B comfortable (A uncomfortable) · 2 A skinny (B loose-fitting) · 3 B second-hand (A brand new) · 4 B smart (A casual) · 5 A trendy (B unfashionable) · 6 B well-dressed (A badly-dressed).</p></details><details><summary>Як вести</summary><ul><li>Спершу питайте <i>Why?</i> — учень пояснює своїми словами, лише потім відкривайте слова.</li><li>Попросіть повторити обидва слова вголос і скласти одне речення про себе: <i>My … are comfortable.</i></li><li>Пара 6: наголосіть — <b>well-dressed ≠ expensive</b>. Образ A коштує £250, але виглядає неохайно.</li><li><b>Show the words</b> — відкрити слова без вибору (якщо бракує часу).</li><li><b>+ My words</b> додає слово в особистий словник учня.</li></ul></details>"
    },

    /* 5 · QUICK GAME ------------------------------------------------ */
    {
      id:"game", n:5, section:"vocabPractice", min:3, type:"game",
      title:"Opposites Attack ⚡",
      say:"You see one word. Choose its opposite before time runs out!",
      ua:"Ти бачиш одне слово. Обери протилежне, поки не скінчився час!",
      secs:10,
      items:[
        { w:"comfortable", o:["smart", "uncomfortable", "casual"], a:1 },
        { w:"trendy", o:["unfashionable", "loose-fitting", "badly-dressed"], a:0 },
        { w:"brand new", o:["casual", "second-hand", "smart"], a:1 },
        { w:"skinny", o:["uncomfortable", "trendy", "loose-fitting"], a:2 },
        { w:"casual", o:["smart", "second-hand", "well-dressed"], a:0 },
        { w:"badly-dressed", o:["unfashionable", "well-dressed", "uncomfortable"], a:1 }
      ],
      teacher:"<p><b>3 хв.</b> Шість слів, 10 секунд на кожне. Таймер можна вимкнути перемикачем під грою — якщо учень нервує.</p><details><summary>Відповіді</summary><p>comfortable → uncomfortable · trendy → unfashionable · brand new → second-hand · skinny → loose-fitting · casual → smart · badly-dressed → well-dressed.</p><p>Помилка не зараховує бал, але учень може спробувати ще раз. Порядок слів перемішується.</p></details>"
    },

    /* 6 · OUTFIT DETECTIVE ------------------------------------------ */
    {
      id:"detective", n:6, section:"vocabPractice", min:4, type:"practice",
      title:"Outfit Detective 🔎",
      say:"Read the clues. Choose 2–3 adjectives for each person. Then say a sentence.",
      ua:"Прочитай підказки. Обери 2–3 прикметники для кожної людини. Потім скажи речення.",
      people:[
        { id:"alex", name:"Alex", he:"he", look:LOOK.alex,
          clues:[{ e:"🤵", t:"a dark suit and a tie" }, { e:"✨", t:"clean, shiny new shoes" }, { e:"💍", t:"going to a formal event" }],
          accept:["smart", "well-dressed", "brand new"], sample:"Alex looks smart and well-dressed. His shoes look brand new." },
        { id:"kai", name:"Kai", he:"he", look:LOOK.kai,
          clues:[{ e:"🧸", t:"a big, soft hoodie" }, { e:"👖", t:"loose joggers and old trainers" }, { e:"🚌", t:"a ten-hour bus trip today" }],
          accept:["comfortable", "casual", "loose-fitting"], sample:"Kai looks casual and comfortable. His joggers are loose-fitting." },
        { id:"sofia", name:"Sofia", he:"she", look:LOOK.sofia,
          clues:[{ e:"📱", t:"her outfit photos get 5,000 likes" }, { e:"👟", t:"the newest chunky trainers" }, { e:"🧥", t:"the same jacket as a famous singer" }],
          accept:["trendy", "brand new", "well-dressed", "loose-fitting"], sample:"Sofia looks trendy. Her trainers are brand new, and her trousers are loose-fitting." },
        { id:"mia", name:"Mia", he:"she", look:LOOK.mia,
          clues:[{ e:"🏷️", t:"a jacket from a charity shop for £8" }, { e:"🎸", t:"an old band T-shirt" }, { e:"🖤", t:"very tight black jeans" }],
          accept:["second-hand", "skinny", "casual"], sample:"Mia's jacket is second-hand, and her jeans are skinny. She looks casual and cool." }
      ],
      bank:["comfortable", "uncomfortable", "skinny", "loose-fitting", "brand new", "second-hand", "smart", "casual", "trendy", "unfashionable", "well-dressed", "badly-dressed"],
      predict:[
        { q:"Who is probably going to a wedding?", best:["alex"], why:"Alex — he's wearing a suit and a tie. People usually wear smart clothes to weddings." },
        { q:"Who is probably going to a concert?", best:["mia", "sofia"], why:"Mia or Sofia. Mia's band T-shirt and boots are perfect for a rock concert. Sofia's trendy look is great for a pop concert." },
        { q:"Who cares most about trends?", best:["sofia"], why:"Sofia — she has the newest trainers and the same jacket as a famous singer." },
        { q:"Who seems to care most about comfort?", best:["kai"], why:"Kai — a soft hoodie and loose joggers. He's ready for a long bus trip!" },
        { q:"Whose clothes are probably second-hand?", best:["mia", "kai"], why:"Mia — her jacket is from a charity shop. Kai's old trainers could be a good answer too!" }
      ],
      teacher:"<p><b>4 хв</b>: опис — 2,5 хв (можна 2–3 людини замість чотирьох), здогадки — 1,5 хв.</p><details><summary>Відповіді й як вести</summary><ul><li><b>Alex:</b> smart, well-dressed, brand new · <b>Kai:</b> comfortable, casual, loose-fitting · <b>Sofia:</b> trendy, brand new (також well-dressed, loose-fitting) · <b>Mia:</b> second-hand, skinny, casual.</li><li>Слово поза списком позначається 🤔 — це не «помилка», а привід спитати <i>Why?</i>. Якщо учень переконливо пояснює (напр. Alex — <i>uncomfortable</i>, бо тісний костюм), приймайте.</li><li>Після вибору учень <b>каже речення</b>: <i>Alex looks smart and well-dressed. His shoes look brand new.</i></li><li>Здогадки: правильних варіантів може бути кілька — система каже <i>Good idea! Explain why</i> на будь-який розумний вибір і <i>What in the clues makes you think so?</i> на інший.</li></ul></details>"
    },

    /* 7 · MINI STORY CHECKPOINT ------------------------------------ */
    {
      id:"checkpoint", n:7, section:"vocabPractice", min:1, type:"story",
      title:"Marko's two outfits 📱",
      say:"Read Marko's messages. Then vote.",
      ua:"Прочитай повідомлення Марка. Потім проголосуй.",
      msgs:[
        { sys:"Tuesday · 19:05" },
        { who:"marko", t:"OK. I tried on two outfits. Which one? 🤔" },
        { who:"marko", t:"A looks cool, but the jeans are SO tight. I can't sit down. 😅" },
        { who:"marko", t:"B is super comfy… but is it too boring?" }
      ],
      choice:{ from:"marko", q:"Which outfit should Marko choose?",
        opts:[{ id:"A", label:"Outfit A", sub:"stylish, but very tight", look:LOOK.ckA }, { id:"B", label:"Outfit B", sub:"relaxed and easy to wear", look:LOOK.ckB }],
        replies:{
          A:[{ who:"nate", t:"A! Style first, comfort later 😎" }, { who:"dana", t:"You'll be on your feet all day anyway. 😂" }],
          B:[{ who:"zoe", t:"B! Comfy clothes = happy Marko 😌" }, { who:"leo", t:"Agreed. You can't dance in those jeans. 😂" }]
        } },
      after:[
        { who:"marko", t:"Wait… apparently our outfit needs to match a MUSIC ERA. 😳" },
        { who:"marko", t:"The poster says: Choose a decade. Choose a sound." },
        { who:"leo", t:"So… the 1950s? The 1990s? 🤷" },
        { who:"zoe", t:"Then maybe we should learn how music changed fashion. 🎸" }
      ],
      teacher:"<p><b>1 хв.</b> Учень голосує A або B і пояснює вибір двома новими словами: <i>I think B, because it's comfortable and casual.</i></p><details><summary>Підказка</summary><p>A — trendy, skinny, slightly uncomfortable · B — casual, loose-fitting, comfortable. Правильної відповіді немає. Далі — поворот сюжету: образ має відповідати музичній епосі → кнопка <b>Explore fashion history →</b>.</p></details>"
    },

    /* 8 · PRE-READING ---------------------------------------------- */
    {
      id:"preread", n:8, section:"reading", min:3, type:"prereading",
      title:"Can music change fashion? 🎧",
      say:"Look at the six music eras. Talk about the questions.",
      ua:"Подивись на шість музичних епох. Обговори питання.",
      eras:ERAS,
      qs:[
        { q:"Do musicians influence fashion?", idea:"Yes, I think so. Fans often copy the clothes of their favourite singers." },
        { q:"Do teenagers sometimes dress like singers?", idea:"Yes! Some of my friends wear the same hoodies as their favourite rapper." },
        { q:"Which music era has the most interesting clothes?", idea:"I think the 1980s, because the clothes are so bright." },
        { q:"Can you recognise any decade from the clothes?", idea:"Maybe the 1970s — punks wear black leather jackets." },
        { q:"Which style would you try?", idea:"I'd try the 1990s style. Big hoodies and caps look cool." },
        { q:"Which style would you never try?", idea:"I'd never try the hippie style. Flowers aren't for me! 🌼" }
      ],
      looks:[
        { id:"50s", look:LOOK.e50 }, { id:"60s", look:LOOK.e60 }, { id:"70s", look:LOOK.e70 }, { id:"80s", look:LOOK.e80 }, { id:"90s", look:LOOK.e90 }
      ],
      teacher:"<p><b>3 хв</b>: картки епох і 2–3 питання — 1,5 хв, здогадка «образ → десятиліття» — 1,5 хв.</p><details><summary>Як вести</summary><p>Здогадки не перевіряються одразу: результат з'явиться в тексті-таймлайні (<i>Your guess: look B ✓</i>). Скажіть: <i>Don't worry if you're not sure.</i></p><p>Відповіді (не показуйте до читання): 1950s — шкіряна куртка й вузька краватка · 1960s — квіти й кльош · 1970s — рвана футболка, булавки, шотландка · 1980s — неон і великі плечі · 1990s — величезне худі, широкі джинси, панама.</p></details>"
    },

    /* 9 · READING --------------------------------------------------- */
    {
      id:"reading", n:9, section:"reading", min:6, type:"reading",
      title:"Fashion & Music: a Style Time Machine 🎸",
      say:"Open the timeline one decade at a time. Read and check your guesses.",
      ua:"Відкривай таймлайн по одному десятиліттю. Читай і перевіряй свої здогадки.",
      sections:[
        { id:"50s", decade:"1950s", e:"🎸", title:"Rock'n'roll is born", look:LOOK.e50,
          text:"Welcome to 1956. A new kind of music is on the radio: rock'n'roll. It's loud, fast and perfect for dancing. Young people love singers like Elvis Presley, and they want to look like them. For a night out, boys wear smart shirts and skinny ties, and girls wear big, full skirts. Rock'n'roll fans want to look well-dressed — but different from their parents. For the first time, teenagers have their own style.",
          ua:"Ласкаво просимо в 1956 рік. По радіо звучить нова музика — рок-н-рол. Вона гучна, швидка й ідеальна для танців. Молодь любить таких співаків, як Елвіс Преслі, і хоче бути схожою на них. На вечірку хлопці вдягають ошатні сорочки й вузькі краватки, а дівчата — широкі пишні спідниці. Фанати рок-н-ролу хочуть виглядати добре вдягненими — але не так, як їхні батьки. Уперше в підлітків є власний стиль." },
        { id:"60s", decade:"1960s", e:"🌼", title:"Peace, love and flowers", look:LOOK.e60,
          text:"Now it's 1967. Hippie music fills big outdoor festivals, and the message is peace and love. Hippies don't want smart clothes or rules. They choose colourful, loose-fitting shirts, long skirts and wide jeans, often with flowers on them. Many people make their own clothes or buy them second-hand. Comfort is important too: at a festival, you dance in a field for hours, so comfortable clothes are a must.",
          ua:"Тепер 1967 рік. Музика хіпі лунає на великих фестивалях просто неба, а головна ідея — мир і любов. Хіпі не хочуть ошатного одягу й правил. Вони обирають барвисті вільні сорочки, довгі спідниці й широкі джинси, часто з квітами. Багато хто шиє одяг сам або купує вживаний. Зручність теж важлива: на фестивалі ти годинами танцюєш у полі, тож зручний одяг — обов'язковий." },
        { id:"70s", decade:"1970s", e:"🤘", title:"Punk breaks the rules", look:LOOK.e70,
          text:"It's 1977 in London. Punk bands play short, angry songs, and punk fans want to shock people. Their look is completely new: black leather jackets, ripped T-shirts, skinny trousers and heavy boots. Punks often buy old clothes second-hand and then change them with safety pins, badges and paint. Many adults think punks look badly-dressed. But for punks, looking unfashionable on purpose is the whole idea.",
          ua:"1977 рік, Лондон. Панк-гурти грають короткі, злі пісні, а фанати панку хочуть шокувати людей. Їхній образ абсолютно новий: чорні шкіряні куртки, рвані футболки, вузькі штани й важкі черевики. Панки часто купують старий одяг у секонд-хенді, а потім змінюють його булавками, значками й фарбою. Багато дорослих вважають, що панки погано вдягнені. Але для панків виглядати немодно навмисно — у цьому й уся ідея." },
        { id:"80s", decade:"1980s", e:"🎤", title:"Pop stars on TV", look:LOOK.e80,
          text:"Welcome to 1985. Music videos are on TV every day, and pop stars are everywhere. Fans copy everything they see: bright colours, big jackets with huge shoulders, sparkly jewellery and white trainers. In the 1980s, more is more! Teenagers want to look trendy, so they save their money for brand new clothes, just like the clothes in the videos. Today, some of these looks seem a little crazy.",
          ua:"Ласкаво просимо в 1985 рік. Музичні кліпи щодня показують по телевізору, і поп-зірки всюди. Фанати копіюють усе, що бачать: яскраві кольори, великі куртки з величезними плечима, блискучі прикраси й білі кросівки. У 1980-х «більше — значить краще»! Підлітки хочуть виглядати модно, тож відкладають гроші на абсолютно новий одяг — такий, як у кліпах. Сьогодні деякі з цих образів здаються трохи божевільними." },
        { id:"90s", decade:"1990s", e:"🎧", title:"Hip-hop takes over", look:LOOK.e90,
          text:"It's 1996, and hip-hop is now one of the biggest kinds of music in the world. Hip-hop artists wear loose-fitting jeans, huge hoodies, caps and gold chains. Soon, teenagers everywhere dress like them. Baggy streetwear is casual and comfortable, but it's also very trendy. For many young people, big trainers are the most important part of the look — and they try to keep them clean and brand new for months.",
          ua:"1996 рік, і хіп-хоп тепер — один із найпопулярніших жанрів музики у світі. Хіп-хоп артисти носять вільні джинси, величезні худі, кепки й золоті ланцюжки. Невдовзі підлітки всюди вдягаються так само. Широкий вуличний одяг — повсякденний і зручний, але ще й дуже модний. Для багатьох молодих людей великі кросівки — найважливіша частина образу, і вони намагаються місяцями тримати їх чистими й «як нові»." },
        { id:"today", decade:"Today", e:"📱", title:"Every style, every second", look:LOOK.eNow,
          text:"And now? Musicians, celebrities and influencers post new looks every day, and a style can go viral in a few hours. A trend that is everywhere in March can look unfashionable in June! Today you can mix styles from every decade: a 1990s hoodie, 1970s boots and 1950s sunglasses. Many young people also buy second-hand clothes online because it's cheaper and better for the planet. So what's the rule today? There isn't one — your style is your choice.",
          ua:"А зараз? Музиканти, знаменитості й інфлюенсери щодня публікують нові образи, і стиль може стати вірусним за кілька годин. Тренд, який у березні всюди, у червні може виглядати немодним! Сьогодні можна поєднувати стилі з усіх десятиліть: худі з 1990-х, черевики з 1970-х і сонцезахисні окуляри з 1950-х. Багато молодих людей також купують вживаний одяг онлайн, бо це дешевше й краще для планети. То яке правило сьогодні? Його немає — твій стиль — твій вибір." }
      ],
      teacher:"<p><b>6 хв.</b> Учень відкриває десятиліття по черзі й читає вголос або мовчки (🔊 — озвучення). Під текстом — його здогадка з попереднього екрана: ✓ або ✗.</p><details><summary>Як вести</summary><ul><li>Після кожного десятиліття — одне коротке питання: <i>What music? What clothes?</i></li><li>Нові слова підсвічені кольором своєї пари.</li><li>У тексті трапляються слова на кшталт <i>trend, go viral, safety pins</i> — пояснюйте жестом або перекладом, окремо не вивчаємо.</li><li><b>Past Simple не пояснюємо</b>: текст навмисно в теперішньому часі («Welcome to 1956…»).</li><li>Переклад — кнопкою 🇺🇦 під кожним десятиліттям.</li></ul></details>"
    },

    /* 10 · READING CHECK ------------------------------------------- */
    {
      id:"check", n:10, section:"reading", min:4, type:"reading-check",
      title:"Build the fashion timeline 🧩",
      say:"Put the music and the fashion clue next to each decade. Then talk about the questions.",
      ua:"Розмісти музику й модну підказку біля кожного десятиліття. Потім обговори питання.",
      rows:[
        { id:"50s", decade:"1950s", e:"🎸", music:"rock'n'roll", clue:"skinny ties and smart shirts" },
        { id:"60s", decade:"1960s", e:"🌼", music:"hippie music", clue:"colourful, loose-fitting clothes with flowers" },
        { id:"70s", decade:"1970s", e:"🤘", music:"punk", clue:"second-hand clothes with safety pins" },
        { id:"80s", decade:"1980s", e:"🎤", music:"pop music videos", clue:"bright colours and huge shoulders" },
        { id:"90s", decade:"1990s", e:"🎧", music:"hip-hop", clue:"loose-fitting streetwear and big trainers" },
        { id:"today", decade:"Today", e:"📱", music:"musicians + social media", clue:"a trend can change in a few hours" }
      ],
      qs:[
        { q:"How do musicians change what young people wear? Give two examples.", ua:"Як музиканти змінюють те, що носить молодь? Наведи два приклади.",
          a:"Young people copy their favourite musicians. For example, punk fans wear ripped T-shirts and heavy boots, and hip-hop fans wear loose-fitting jeans and big trainers." },
        { q:"Which decade has the most interesting fashion, in your opinion? Why?", ua:"Яке десятиліття має найцікавішу моду, на твою думку? Чому?", opinion:true,
          idea:"I think the 1980s are the most interesting because the clothes are so bright and crazy!" },
        { q:"Is fashion changing faster today than in the past? Why?", ua:"Чи мода сьогодні змінюється швидше, ніж раніше? Чому?", opinion:true,
          idea:"Yes, I think so. Today a style can go viral in a few hours, so trends change very quickly." }
      ],
      teacher:"<p><b>4 хв</b>: таймлайн — 2 хв, три питання — 2 хв.</p><details><summary>Відповіді</summary><p>1950s — rock'n'roll — skinny ties and smart shirts · 1960s — hippie music — colourful, loose-fitting clothes with flowers · 1970s — punk — second-hand clothes with safety pins · 1980s — pop music videos — bright colours and huge shoulders · 1990s — hip-hop — loose-fitting streetwear and big trainers · Today — musicians + social media — a trend can change in a few hours.</p><p>Картки перемішуються; можна перетягувати або натиснути картку, потім пропуск.</p></details><details><summary>Питання</summary><p>Питання 1 має опорну відповідь (💡 Possible answer). Питання 2 і 3 — думка учня, правильної відповіді немає: просіть <i>because</i>.</p></details>"
    },

    /* 11 · STYLE TIME MACHINE -------------------------------------- */
    {
      id:"machine", n:11, section:"speaking", min:3, type:"creative",
      title:"Style Time Machine 🎮",
      prompt:"You're going to a concert in this decade. Build your outfit.",
      eras:[
        { id:"50s", decade:"1950s", e:"🎸", music:"Rock'n'roll", pieces:[
          { id:"tee", label:"white T-shirt", slot:"top", item:{ k:"tee", c:"#FFFFFF" } },
          { id:"shirt", label:"shirt and skinny tie", slot:"top", item:{ k:"shirt", c:"#FFFFFF", tie:"#111111" } },
          { id:"jacket", label:"leather jacket", slot:"outer", item:{ k:"leather", c:"#15151A" } },
          { id:"jeans", label:"rolled-up jeans", slot:"bottom", item:{ k:"skinny", c:"#1F2A44", denim:true, roll:true } },
          { id:"shoes", label:"smart shoes", slot:"shoes", item:{ k:"smart", c:"#111111" } },
          { id:"glasses", label:"sunglasses", slot:"extra", item:{ k:"glasses", style:"wayfarer" } } ] },
        { id:"60s", decade:"1960s", e:"🌼", music:"Hippie music", pieces:[
          { id:"flower", label:"flower shirt", slot:"top", item:{ k:"shirt", c:"#E8A33D", pat:"fl", big:true } },
          { id:"tiedye", label:"tie-dye T-shirt", slot:"top", item:{ k:"tee", tiedye:true } },
          { id:"flares", label:"wide flared jeans", slot:"bottom", item:{ k:"flares", c:"#5B8FC7", denim:true } },
          { id:"sandals", label:"sandals", slot:"shoes", item:{ k:"sandals" } },
          { id:"round", label:"round sunglasses", slot:"extra", item:{ k:"glasses", style:"round", tint:"rgba(255,140,60,.75)", c:"#B67A47" } },
          { id:"band", label:"flower headband", slot:"extra", item:{ k:"headband", c:"#8AB17D", flowers:true } } ] },
        { id:"70s", decade:"1970s", e:"🤘", music:"Punk", pieces:[
          { id:"rip", label:"ripped T-shirt", slot:"top", item:{ k:"tee", c:"#1D1B2C", rip:true, pins:true, print:"band", text:"NO RULES" } },
          { id:"studs", label:"leather jacket", slot:"outer", item:{ k:"leather", c:"#15151A", studs:true } },
          { id:"tartan", label:"tartan trousers", slot:"bottom", item:{ k:"skinny", c:"#B3261E", pat:"tt" } },
          { id:"ripjeans", label:"ripped skinny jeans", slot:"bottom", item:{ k:"skinny", c:"#2B2F3A", denim:true, rips:true } },
          { id:"boots", label:"heavy boots", slot:"shoes", item:{ k:"boots", c:"#1A1A1A", worn:true } },
          { id:"chain", label:"chain", slot:"extra", item:{ k:"chain", c:"#C9CED6", pendant:false } } ] },
        { id:"80s", decade:"1980s", e:"🎤", music:"Pop", pieces:[
          { id:"tee", label:"bright T-shirt", slot:"top", item:{ k:"tee", c:"#FFD43B", print:"stripe", ink:"#FF2E93", ink2:"#00E5FF" } },
          { id:"neon", label:"neon jacket", slot:"outer", item:{ k:"bomber", c:"#7C4DFF", block:"#FF2E93", block2:"#00E5FF", big:true } },
          { id:"acid", label:"acid-wash jeans", slot:"bottom", item:{ k:"skinny", c:"#8FB3E8", pat:"aw" } },
          { id:"high", label:"white high-tops", slot:"shoes", item:{ k:"hightops", c:"#FFFFFF", accent:"#FF2E93" } },
          { id:"big", label:"big sunglasses", slot:"extra", item:{ k:"glasses", style:"big", c:"#FFFFFF", tint:"rgba(255,46,147,.65)" } },
          { id:"sweat", label:"headband", slot:"extra", item:{ k:"headband", c:"#00E5FF" } } ] },
        { id:"90s", decade:"1990s", e:"🎧", music:"Hip-hop", pieces:[
          { id:"hoodie", label:"huge hoodie", slot:"top", item:{ k:"hoodie", c:"#2F80ED", big:true, print:"text", text:"FRESH" } },
          { id:"baggy", label:"baggy jeans", slot:"bottom", item:{ k:"baggy", c:"#4A6FA5", denim:true } },
          { id:"chunky", label:"chunky trainers", slot:"shoes", item:{ k:"chunky", c:"#F4F4F4" } },
          { id:"bucket", label:"bucket hat", slot:"extra", item:{ k:"bucket", c:"#E9E2CF" } },
          { id:"cap", label:"cap", slot:"extra", item:{ k:"cap", c:"#1D1B2C" } },
          { id:"gold", label:"gold chain", slot:"extra", item:{ k:"chain" } } ] }
      ],
      frame:[
        { id:"a", pre:"My outfit is", ph:"… and …" },
        { id:"b", pre:"The trousers are", ph:"…" },
        { id:"c", pre:"I chose", ph:"… because …" }
      ],
      teacher:"<p><b>3 хв</b> — коротка творча гра; якщо урок затягнувся, її можна пропустити (Skip).</p><details><summary>Як вести</summary><p>Учень обирає одну епоху, тапає 3–5 речей і описує образ трьома реченнями — краще усно. Лічильник показує, скільки нових слів прозвучало в записаному тексті.</p><p>Приклад: <i>My outfit is casual and trendy. The trousers are loose-fitting. I chose the huge hoodie because it's comfortable.</i></p></details>"
    },

    /* 12 · SPEAKING ------------------------------------------------- */
    {
      id:"speak", n:12, section:"speaking", min:8, type:"speaking",
      title:"Fashion: yes or no? 💬",
      say:"Answer the questions one at a time. Try to use today's words.",
      ua:"Відповідай на питання по одному. Намагайся вживати сьогоднішні слова.",
      qs:[
        { q:"Do you prefer smart or casual clothes? Why?", ua:"Тобі більше подобається ошатний чи повсякденний одяг? Чому?",
          fu:["What do you usually wear to school?", "What about parties?", "When do you wear smart clothes?"],
          idea:"I usually prefer casual clothes because they're more comfortable. I often wear jeans, trainers and a hoodie. I only wear smart clothes for special events." },
        { q:"Would you buy second-hand clothes? Why / why not?", ua:"Ти купив би / купила б вживаний одяг? Чому?",
          fu:["Is there a second-hand shop near your home?", "What's better: second-hand or brand new?"],
          idea:"Yes, I would. Second-hand clothes are cheaper, and you can find really unusual things." },
        { q:"Do you care if your clothes are trendy?", ua:"Тобі важливо, щоб одяг був модним?",
          fu:["Where do you see new trends?", "Do you follow any fashion influencers?"],
          idea:"Not really. I like trendy trainers, but I don't change my style every month." },
        { q:"Would you wear uncomfortable clothes if they looked amazing?", ua:"Ти вдягнув би / вдягнула б незручний одяг, якби він виглядав чудово?",
          fu:["For how long?", "What about uncomfortable shoes?"],
          idea:"Maybe for one evening! But I'd never wear uncomfortable shoes all day." },
        { q:"Who usually chooses your clothes?", ua:"Хто зазвичай обирає тобі одяг?",
          fu:["Do you go shopping with your family?", "Do you like shopping?"],
          idea:"I usually choose my clothes, but my mum helps me when we go shopping." },
        { q:"Do musicians or influencers affect what teenagers wear?", ua:"Чи впливають музиканти або інфлюенсери на те, що носять підлітки?",
          fu:["Can you give an example?", "Does anyone influence your style?"],
          idea:"Yes, a lot. When a famous singer wears a new jacket, everyone wants the same one." },
        { q:"What clothes make you feel confident?", ua:"У якому одязі ти почуваєшся впевнено?",
          fu:["Why?", "Do you have a lucky piece of clothing?"],
          idea:"My black jacket makes me feel confident. It's well-made, and I look well-dressed in it." },
        { q:"What fashion trend do you dislike?", ua:"Який модний тренд тобі не подобається?",
          fu:["Why don't you like it?", "Do your friends like it?"],
          idea:"I don't like very skinny jeans. They look uncomfortable, and you can't move in them." }
      ],
      phrases:["I prefer … because …", "I would / wouldn't …", "In my opinion, …", "It depends. For example, …", "Actually, …"],
      teacher:"<p><b>8 хв</b> — одна з головних частин уроку. Питання по одному; обирайте 5–6 з восьми, залежно від того, як іде розмова.</p><details><summary>Як вести</summary><ul><li>➕ <b>Follow-up questions</b> — 1–3 додаткові питання, щоб розмова не обривалася.</li><li>Опінійні відповіді <b>не оцінюємо</b>: використовуйте кнопки-реакції (<i>Great answer! · Tell me more · Why do you think so? · Can you use one of today's new words?</i>).</li><li>Поле «My answer» — необов'язкове; якщо учень пише, лічильник показує вжиті нові слова.</li></ul></details>"
    },

    /* 13 · FINAL MISSION -------------------------------------------- */
    {
      id:"mission", n:13, section:"mission", min:7, type:"mission",
      title:"Create Marko's look",
      intro:"Style & Music Day starts tomorrow. Marko still needs an outfit. Build it — then describe it.",
      cats:[
        { id:"top", label:"TOP", slot:"top", opts:[
          { id:"shirt", label:"smart shirt", item:{ k:"shirt", c:"#F7F7F2" } },
          { id:"hoodie", label:"oversized hoodie", item:{ k:"hoodie", c:"#3E8E6B", big:true } },
          { id:"vintage", label:"vintage T-shirt", item:{ k:"tee", c:"#C9B79C", print:"band", text:"LIVE '98" } } ] },
        { id:"bottom", label:"BOTTOM", slot:"bottom", opts:[
          { id:"skinny", label:"skinny jeans", item:{ k:"skinny", c:"#22252E", denim:true } },
          { id:"loose", label:"loose-fitting trousers", item:{ k:"loose", c:"#7D8A6A" } },
          { id:"smart", label:"smart trousers", item:{ k:"smart", c:"#2C3442" } } ] },
        { id:"shoes", label:"SHOES", slot:"shoes", opts:[
          { id:"trainers", label:"brand-new trainers", item:{ k:"trainers", c:"#FFFFFF", accent:"#FF5A4E", new:true } },
          { id:"boots", label:"second-hand boots", item:{ k:"boots", c:"#3B2A1E", worn:true } },
          { id:"smart", label:"smart shoes", item:{ k:"smart", c:"#2B1E14" } } ] },
        { id:"extra", label:"EXTRA", multi:true, opts:[
          { id:"jacket", label:"jacket", slot:"outer", item:{ k:"denim", c:"#4A6FA5" } },
          { id:"cap", label:"cap", slot:"extra", item:{ k:"cap", c:"#1D1B2C" } },
          { id:"sunglasses", label:"sunglasses", slot:"extra", item:{ k:"glasses", style:"wayfarer" } },
          { id:"jewellery", label:"jewellery", slot:"extra", item:{ k:"chain" } } ] }
      ],
      frame:["I chose ___ because ___.", "His ___ is / are ___.", "I think this outfit is ___.", "Marko looks ___.", "I wouldn't choose ___ because ___."],
      need:5,
      example:"I chose the vintage T-shirt because it's casual and comfortable. His trousers are loose-fitting, so he can dance all day. His boots are second-hand, but they look cool. I think this outfit is trendy and perfect for a 1990s look. Marko looks well-dressed. I wouldn't choose skinny jeans because they're uncomfortable.",
      done:{ title:"🎯 MISSION COMPLETE!", text:"Marko has his Style & Music Day outfit!" },
      reply:{ who:"marko", t:"This is PERFECT. 🙌 Thank you! Now I just need one more thing… a cap. Let me look in the wardrobe. 👀" },
      teacher:"<p><b>7 хв</b>: зібрати образ — 2 хв, описати — 4 хв, святкування — 1 хв.</p><details><summary>Як вести</summary><ul><li>Учень обирає верх, низ, взуття й будь-які аксесуари — малюнок справа змінюється одразу.</li><li>Опис — мінімум <b>5 нових слів</b>. Лічильник рахує їх автоматично (розпізнає й <i>brand-new</i>, <i>second hand</i> тощо).</li><li>Якщо учень говорить, а не пише, поставте галочку <b>I said it out loud</b> — місію можна завершити й так.</li><li><b>SHOW EXAMPLE</b> відкривайте лише якщо учень застряг.</li></ul></details><details><summary>Зразок</summary><p><i>I chose the vintage T-shirt because it's casual and comfortable. His trousers are loose-fitting, so he can dance all day. His boots are second-hand, but they look cool. I think this outfit is trendy… Marko looks well-dressed. I wouldn't choose skinny jeans because they're uncomfortable.</i></p></details>"
    },

    /* 14 · RECAP ---------------------------------------------------- */
    {
      id:"recap", n:14, section:"summary", min:2, type:"recap",
      title:"Can you remember? 🧠",
      say:"Explain or translate each word. Then tap the card to check.",
      ua:"Поясни або переклади кожне слово. Потім натисни на картку, щоб перевірити.",
      rate:["I can use these words", "I understand them but need practice", "I need more practice"],
      replies:["🟢 Brilliant! Use them again next lesson.", "🟡 Good! Practise them in My words before next time.", "🔴 No problem — open My words and practise for five minutes. You'll get there!"],
      teacher:"<p><b>2 хв.</b> Учень пояснює слово англійською або перекладає, потім перевертає картку. <b>Reveal all</b> — відкрити всі. Наприкінці — самооцінка.</p>"
    },

    /* 15 · STORY ENDING + SUMMARY ---------------------------------- */
    {
      id:"ending", n:15, section:"summary", min:2, type:"cliffhanger",
      title:"The old photo 📸",
      scene:"Thursday night. Marko is looking for a cap in the wardrobe…",
      chat:"The Signal crew", sub:"Zoe, Leo, Dana, Marko, Nate · 22:47",
      msgs1:[
        { who:"marko", t:"No cap… but I found an old box in the wardrobe. 📦" },
        { who:"marko", t:"There's a photo inside." }
      ],
      photo:{ img:null, alt:"An old concert photo from 1998. A teenage boy in a big denim jacket, baggy jeans and a bucket hat has his arms in the air." },
      msgsPhoto:[
        { who:"marko", t:"Wait…" },
        { who:"marko", t:"Is that my DAD?! 😳" },
        { who:"dana", t:"No way. 😂" },
        { who:"marko", t:"Why is he dressed like THAT? And that jacket… it's still in our wardrobe!" }
      ],
      msgs2:[
        { who:"marko", t:"There's something on the back: “Best night ever. 1998.”" },
        { who:"marko", t:"He has NEVER told me about this…" },
        { who:"zoe", t:"Then ask him what happened. 👀" }
      ],
      tbc:"TO BE CONTINUED…",
      next:{ k:"NEXT TIME — LESSON 5 📸", title:"Best night ever", lines:["What happened in 1998?", "Where did Marko's dad go?", "And why did he keep this photo?"] },
      summary:{
        title:"GREAT JOB! 🎉",
        list:[
          { e:"👕", t:"learned how to describe clothes and style" },
          { e:"⚡", t:"practised opposite adjectives" },
          { e:"🔎", t:"became an Outfit Detective" },
          { e:"🎸", t:"travelled through music and fashion history" },
          { e:"💬", t:"talked about your own style" },
          { e:"🎯", t:"created Marko's Style & Music Day outfit" },
          { e:"📸", t:"discovered a new mystery…" }
        ],
        unlocked:"Vocabulary unlocked: 12 words ✅",
        quote:["Fashion changes. Music changes.", "But your style tells a story. 😎"]
      },
      teacher:"<p><b>2 хв.</b> Темний сюжетний екран: Марко знаходить коробку й старе фото тата. Учень сам <b>перевертає фото</b> (тап) — на звороті напис. Далі — «To be continued…» і анонс уроку 5.</p><details><summary>Важливо</summary><p>Past Simple <b>не пояснюємо</b>: питання анонсу (<i>What happened…? Where did… go?</i>) — це гачок для уроку 5. Можна спитати: <i>What do you think happened in 1998?</i> — учень відповідає як може.</p><p>Тато впізнається по джинсовій куртці, яка досі висить у шафі, — звідси назва серії «The Jacket Secret».</p><p>Реалістичне фото можна додати пізніше: покладіть вертикальну картинку (≈300 × 340, наприклад <code>dad-1998.webp</code>) у папку <code>assets/</code> і впишіть шлях у <code>photo.img</code>.</p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/fashion.js) ---------- */
  screens(add, st){
    const o = st("opening");
    add(o, "styleCover", { key:"cover", unit:o.unit, lesson:o.lesson, title:"What's your style?", emoji:"👕🎧", sub:o.sub, today:o.today, cast:o.cast, img:o.img, cta:"START LESSON →" });

    const w = st("warm");
    add(w, "questionDeck", { key:"deck", store:"deck", title:w.title, say:w.say, ua:w.ua, kicker:"Warm-up · your style today", gallery:w.gallery, qs:w.qs, phrases:w.phrases, short:"7 questions" });

    const s = st("story");
    add(s, "styleChat", { key:"chat", title:s.title, say:s.say, ua:s.ua, kicker:"Story · a new challenge", msgs:s.msgs, unlock:s.unlock, cta:"ACCEPT MISSION →", sub:"Zoe, Leo, Dana, Marko, Nate" });

    const r = st("rack");
    r.cards.forEach((c, i) => add(r, "pairCard", Object.assign({ key:"p" + i, i, of:r.cards.length }, c)));

    const g = st("game");
    add(g, "oppositesGame", { key:"game", title:g.title, say:g.say, ua:g.ua, items:g.items, secs:g.secs });

    const d = st("detective");
    add(d, "outfitDetective", { key:"det", title:d.title, say:d.say, ua:d.ua, people:d.people, bank:d.bank });
    add(d, "outfitPredict", { key:"pred", title:"Who is probably…? 🤔", say:"Look at the four outfits again. Choose a person and explain why.", ua:"Ще раз подивись на образи. Обери людину й поясни чому.", people:d.people, qs:d.predict });

    const c = st("checkpoint");
    add(c, "styleChat", { key:"chat2", store:"chat2", title:c.title, say:c.say, ua:c.ua, kicker:"Story · checkpoint", msgs:c.msgs, choice:c.choice, after:c.after, cta:"EXPLORE FASHION HISTORY →", short:"Two outfits" });

    const p = st("preread");
    add(p, "eraCards", { key:"eras", title:p.title, say:p.say, ua:p.ua, eras:p.eras, qs:p.qs });
    add(p, "eraMatch", { key:"match", title:"Guess the decade 🕰️", say:"Match each outfit to a decade.", ua:"Зістав кожен образ із десятиліттям.",
      decades:p.eras.filter(x => x.id !== "today"), looks:p.looks.map(l => ({ id:l.id, era:l.id, look:l.look })) });

    const rd = st("reading");
    add(rd, "timelineRead", { key:"tl", title:rd.title, say:rd.say, ua:rd.ua, sections:rd.sections, guess:{ stage:"preread", key:"match" } });

    const ch = st("check");
    add(ch, "timelineBuild", { key:"build", title:ch.title, say:ch.say, ua:ch.ua, rows:ch.rows, qs:ch.qs });

    const m = st("machine");
    add(m, "timeMachine", { key:"tm", title:m.title, prompt:m.prompt, eras:m.eras, frame:m.frame, max:5 });

    const sp = st("speak");
    add(sp, "questionDeck", { key:"deck2", store:"deck", title:sp.title, say:sp.say, ua:sp.ua, kicker:"Speaking · one question at a time", qs:sp.qs, phrases:sp.phrases, words:true, placeholder:"I prefer … because …", short:"8 questions" });

    const ms = st("mission");
    add(ms, "outfitBuilder", { key:"build", who:"marko", title:ms.title, intro:ms.intro, cats:ms.cats, frame:ms.frame, need:ms.need, example:ms.example, done:ms.done, reply:ms.reply });

    const rc = st("recap");
    add(rc, "pairRecap", { key:"recap", title:rc.title, say:rc.say, ua:rc.ua, rate:rc.rate, replies:rc.replies });

    const e = st("ending");
    add(e, "photoReveal", { key:"photo", scene:e.scene, chat:e.chat, sub:e.sub, msgs1:e.msgs1, photo:e.photo, msgsPhoto:e.msgsPhoto, msgs2:e.msgs2, tbc:e.tbc, next:e.next });
    add(e, "greatJob", Object.assign({ key:"great", cta:"FINISH LESSON ✅" }, e.summary));
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const rack = ans.rack || {};
    const pairs = [0, 1, 2, 3, 4, 5].filter(i => rack["p" + i] && rack["p" + i].first).length;
    const game = (ans.game && ans.game.game && ans.game.game.res) ? Object.values(ans.game.game.res).filter(Boolean).length : 0;
    const tl = (ans.check && ans.check.build && ans.check.build.best) || 0;
    const ms = (ans.mission && ans.mission.build) || {};
    return {
      icon:"😎", title:"Lesson 4 complete",
      text:"Fashion changes. Music changes. But your style tells a story. And Marko's dad has a story too…",
      stats:[
        [`👕 ${pairs} / 6`, "pairs found first time"],
        [`⚡ ${game} / 6`, "opposites"],
        [`🧩 ${tl} / 12`, "timeline cards"],
        [`🎯 ${ms.done ? (ms.words || 0) + " words" : "—"}`, "in Marko's look"]
      ]
    };
  }
};
})();
