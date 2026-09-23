/* ============================================================
   LESSON 1 · Cycle 1A · FIRST IMPRESSIONS: WHO ARE YOU REALLY?
   Структура сумісна з Inkwell (lessonType + секції).
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

window.SIGNAL_LESSONS.c1a = {
  id: "c1a",
  cycle: 1,
  lessonType: "discover",
  title: "First impressions",
  series: "First Impressions",
  question: "Can you really understand someone's personality from a first impression?",
  minutes: 60,
  setting: "Signal Weekend — an international teen media camp in Kraków. Twenty teenagers from Ukraine and the UK. One weekend. One podcast.",

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["judge", "leadin"],
    vocabPresentation: ["meet", "discover"],
    discoveryGuide: ["discover:bubbles", "scenarios:wordlab"],
    vocabPractice: ["sort", "scenarios", "detective"],
    grammar: [],
    grammarPractice: [],
    listening: ["bets", "listen", "comp", "post"],
    speaking: ["speak"],
    mission: ["realme"],
    summary: ["cliff"],
    homework: ["cliff:homework"]
  },
  sectionNames: {
    warmUp: "Warm-up", vocabPresentation: "New words", vocabPractice: "Practice",
    listening: "Listening", speaking: "Speaking", mission: "Mission", summary: "Wrap-up"
  },

  /* ---------- vocabulary bank (cycle 1) ---------- */
  vocab: [
    { w:"confident", ipa:"/ˈkɒnfɪdənt/", g:"personality", en:"sure about yourself; not afraid to speak or act", ua:"впевнений", ex:"She's confident, so she isn't nervous on stage." },
    { w:"shy", ipa:"/ʃaɪ/", g:"personality", en:"quiet and a bit nervous with new people", ua:"сором'язливий", ex:"He's shy, so he doesn't talk much at first." },
    { w:"cheerful", ipa:"/ˈtʃɪəfl/", g:"personality", en:"happy and positive", ua:"життєрадісний", ex:"She's cheerful even when it rains." },
    { w:"serious", ipa:"/ˈsɪəriəs/", g:"personality", en:"doesn't joke much; thinks carefully", ua:"серйозний", ex:"My dad is serious at work but funny at home." },
    { w:"friendly", ipa:"/ˈfrendli/", g:"personality", en:"kind and nice to people", ua:"привітний, дружній", ex:"Our new neighbour is very friendly." },
    { w:"funny", ipa:"/ˈfʌni/", g:"personality", en:"makes people laugh", ua:"смішний, кумедний", ex:"My cousin is so funny!" },
    { w:"polite", ipa:"/pəˈlaɪt/", g:"personality", en:"shows respect; says “please” and “thank you”", ua:"ввічливий", ex:"It's polite to say hello." },
    { w:"rude", ipa:"/ruːd/", g:"personality", en:"not polite; hurts people with words or actions", ua:"грубий", ex:"Don't be rude to the teacher." },
    { w:"impatient", ipa:"/ɪmˈpeɪʃnt/", g:"personality", en:"doesn't like waiting", ua:"нетерплячий", ex:"I'm impatient when my phone is slow." },
    { w:"lazy", ipa:"/ˈleɪzi/", g:"personality", en:"doesn't want to work or do things", ua:"лінивий", ex:"I'm lazy on Sunday mornings." },
    { w:"careful", ipa:"/ˈkeəfl/", g:"personality", en:"thinks before acting; tries not to make mistakes", ua:"обережний, уважний", ex:"Be careful with that glass!" },
    { w:"curly", ipa:"/ˈkɜːli/", g:"hair", en:"with lots of rings or waves", ua:"кучеряве (волосся)", ex:"She's got curly hair." },
    { w:"straight", ipa:"/streɪt/", g:"hair", en:"without waves", ua:"пряме (волосся)", ex:"His hair is short and straight." },
    { w:"fair", ipa:"/feə/", g:"hair", en:"light yellow or light brown", ua:"світле, русяве (волосся)", ex:"Leo has fair hair." },
    { w:"dark", ipa:"/dɑːk/", g:"hair", en:"brown or black", ua:"темне (волосся)", ex:"Zoe has long dark hair." }
  ],
  phrases: [
    { w:"She looks serious.", ua:"Вона виглядає серйозною. (за зовнішністю)" },
    { w:"He seems friendly.", ua:"Він здається привітним. (за першою розмовою)" },
    { w:"Actually, she's really funny.", ua:"Насправді вона дуже смішна." },
    { w:"At first, I thought…", ua:"Спочатку я думав(ла)…" }
  ],
  receptive: [
    { w:"impolite", ua:"неввічливий" }, { w:"unfriendly", ua:"непривітний" }, { w:"unkind", ua:"недобрий" }
  ],

  /* ---------- characters ---------- */
  characters: {
    zoe:   { name:"Zoe",   age:13, from:"Manchester", handle:"@zoe_in_black",
             img:"assets/characters/zoe.webp", face:{ x:49, y:37 },
             lines:["🎧 Music addict","🖤 Black is my colour","📚 Always has a book","😐 Rarely smiles in photos"],
             photo:"Black hoodie, big headphones, a book, no smile.",
             look:{ hair:"straight-long", colour:"dark", skin:"#E9C3A6", mood:"flat", extra:"headphones", top:"#1D1D26", prop:"📚" },
             reality:["funny","cheerful","friendly"], impression:["serious","shy"] },
    leo:   { name:"Leo",   age:14, from:"Manchester", handle:"@leo_climbs_high",
             img:"assets/characters/leo.webp", face:{ x:50, y:39 },
             lines:["🧗 Climbing champion","😎 Sunglasses in every photo","💬 “Talk to me about anything!”"],
             photo:"A medal, a climbing wall behind him, sunglasses, a big grin.",
             look:{ hair:"curly-short", colour:"fair", skin:"#F2D2BD", mood:"grin", extra:"sunglasses", top:"#2F7DE1", prop:"🥇" },
             reality:["shy","polite"], impression:["confident"] },
    dana:  { name:"Dana",  age:14, from:"Lviv", handle:"@dana.plans.everything",
             img:"assets/characters/dana.webp", face:{ x:50, y:42 },
             lines:["📋 I have a plan for everything","⏰ Always 10 minutes early","🗂️ Colour-coded life"],
             photo:"A perfectly tidy desk with colour-coded notebooks. Dana is in the corner, not smiling.",
             look:{ hair:"straight-bob", colour:"fair", skin:"#F4D9C6", mood:"flat", extra:"glasses", top:"#6C5CE7", prop:"🗂️" },
             reality:["friendly","impatient","careful"], impression:["serious"] },
    marko: { name:"Marko", age:14, from:"Lviv", handle:"@marko.offline",
             img:"assets/characters/marko.webp", face:{ x:48, y:43 },
             lines:["🎮 Gamer","😴 Mornings? No, thank you.","🍕 Pizza expert"],
             photo:"Asleep with his head on his hand, in a green hoodie, with a slice of pizza.",
             look:{ hair:"curly-messy", colour:"dark", skin:"#E3B99A", mood:"asleep", extra:"hoodie", top:"#3E8E6B", prop:"🍕" },
             reality:["careful"], impression:["lazy"] },
    nate:  { name:"Nate",  age:15, from:"Manchester", handle:"@nate.makes.films",
             img:"assets/characters/nate.webp", face:{ x:47, y:38 },
             lines:["🎬 Future famous director","🤳 327 selfies this month","🗣️ I never stop talking"],
             photo:"A close-up selfie, a camera in his hand, bright yellow trainers.",
             look:{ hair:"short", colour:"dark", skin:"#7A4E36", mood:"grin", extra:"none", top:"#F2B705", prop:"🎥" },
             reality:["confident","funny","friendly","polite"], impression:["confident","funny"] }
  },
  order: ["zoe","leo","dana","marko","nate"],

  /* ---------- stages ---------- */
  stages: [
    {
      id:"judge", n:1, section:"warmUp", min:4, type:"judge",
      title:"Judge me in 5 seconds",
      say:"You have five seconds for each photo. Don't think — just judge!",
      ua:"У тебе 5 секунд на кожне фото. Не думай — просто вирішуй!",
      words:[ {w:"friendly",e:"🙂"},{w:"serious",e:"😐"},{w:"confident",e:"😎"},{w:"shy",e:"🙈"},{w:"funny",e:"😂"} ],
      final:"Can we really know someone's personality just by looking at them?",
      teacher:"<p>Показати кожне фото рівно на 5 секунд, результати не коментувати. Запишіть на дошці «Class Verdict» — найпопулярніший варіант для кожного фото: він знадобиться на етапі 11.</p><p>Фінальне питання не обговорювати — залишити висіти.</p>"
    },
    {
      id:"leadin", n:2, section:"warmUp", min:2, type:"discuss",
      title:"First impressions",
      say:"Answer out loud. Stuck? Tap “Make it easier”.",
      ua:"Відповідай усно. Складно — натисни «Make it easier».",
      items:[
        { q:"What do you notice first when you meet someone?", easy:"Clothes? Hair? Smile? Voice?", starter:"First, I notice…", sample:"First, I notice their smile." },
        { q:"Can someone's appearance tell you about their personality?", easy:"Can clothes tell you if someone is nice?", starter:"I think it can / can't, because…", sample:"I think it can't, because a person in black clothes can be very funny." },
        { q:"Have you ever been completely wrong about someone at first?", easy:"Was a new friend different from what you thought?", starter:"Yes! I thought my friend was…, but…", sample:"Yes! I thought my friend was serious, but she's really funny." }
      ],
      teacher:"<p>Фронтально, 2–3 відповіді на питання. Якщо тиша — одразу легша версія.</p>"
    },
    {
      id:"meet", n:3, section:"vocabPresentation", min:5, type:"profiles",
      title:"Meet the characters",
      say:"Read the profiles with a partner. What are they REALLY like? Write your first impression.",
      ua:"Прочитайте профілі в парах. Запишіть перше враження — можна українською, пізніше замінимо англійськими словами.",
      intro:"Welcome to Signal Weekend! Twenty teenagers from Ukraine and the UK. One weekend. One big project: the first episode of a podcast called The Signal. Before they arrive, everyone can see everyone's profile. And everyone is already making judgements…",
      prompts:["Look at Zoe's profile. What kind of person is she? Why do you think so?","Which profile do you like most? Why?","Who would you like to sit next to on the bus?"],
      starters:["He/She looks…","I think he/she is… because…","Maybe he/she is…"],
      teacher:"<p>2 хв на читання й заповнення, потім 2–3 пари вголос. Українські слова дозволені.</p><p>Питання <b>What are they REALLY like?</b> лишається на дошці до етапу 11.</p>"
    },
    {
      id:"discover", n:4, section:"vocabPresentation", min:8, type:"discover",
      title:"Word discovery",
      say:"First guess, then check. What did the person do? What does it tell you about them?",
      ua:"Спершу вгадай, потім перевір. Що зробила людина? Що це каже про неї?",
      hair:[
        { id:"h1", shape:"straight-long", colour:"dark", key:["straight","dark"], who:"Zoe" },
        { id:"h2", shape:"curly-short",   colour:"fair", key:["curly","fair"],    who:"Leo" },
        { id:"h3", shape:"straight-bob",  colour:"fair", key:["straight","fair"], who:"Dana" },
        { id:"h4", shape:"curly-messy",   colour:"dark", key:["curly","dark"],    who:"Marko" }
      ],
      moments:[
        { e:"🎤", t:"Oksana, the camp leader, walks onto the stage and talks to 60 teenagers. No notes. No problem.", o:["confident","shy","lazy"], a:"confident" },
        { e:"🙈", t:"A boy in the corner looks at the floor. When someone says hi, his face goes red.", o:["rude","shy","funny"], a:"shy" },
        { e:"🚌", t:"Bohdana's bus arrives two hours late. She jumps out and says, “What a beautiful day!”", o:["cheerful","impatient","careful"], a:"cheerful" },
        { e:"🩺", t:"The camp nurse listens carefully, speaks quietly and doesn't make jokes.", o:["serious","funny","lazy"], a:"serious" },
        { e:"👋", t:"A girl sees a new camper alone and says, “Hi! Do you want to sit with us?”", o:["friendly","rude","careful"], a:"friendly" },
        { e:"😂", t:"The bus driver tells one joke, and the whole bus laughs for a minute.", o:["funny","serious","shy"], a:"funny" },
        { e:"🙏", t:"A boy asks, “Excuse me, can I sit here, please?”", o:["polite","rude","impatient"], a:"polite" },
        { e:"🍽️", t:"Someone pushes to the front of the lunch queue and says, “Move!”", o:["rude","polite","cheerful"], a:"rude" },
        { e:"📶", t:"The Wi-Fi is slow. A camper presses “refresh” twenty times in ten seconds.", o:["impatient","confident","friendly"], a:"impatient" },
        { e:"🎒", t:"A camper asks his friend to carry his bag. The friend already has two bags.", o:["lazy","polite","careful"], a:"lazy" },
        { e:"🗺️", t:"Before the walk, a girl checks the map, the weather and her shoes.", o:["careful","lazy","funny"], a:"careful" }
      ],
      bubbles:[
        { t:"She looks serious.", s:"I've seen her photo." },
        { t:"She seems friendly.", s:"I talked to her for a minute." },
        { t:"Actually, she's really funny!", s:"I know her well." }
      ],
      bubblesKey:2,
      bubblesExplain:"<b>looks</b> — from appearance (photo, clothes). <b>seems</b> — from a first short meeting. <b>actually</b> — the truth, often different from what you thought.<br><span class='muted'>looks — за зовнішністю; seems — за першим враженням від розмови; actually — насправді.</span>",
      teacher:"<p>A (1 хв) — фронтально. B (5 хв) — пари, по одній картці: спершу голосування, потім пояснення. Після кожної: «What did the person do?» C (1,5 хв) — фронтально.</p><p>Якщо клас повільний, картки 4, 6 і 10 — швидким голосуванням без обговорення.</p>"
    },
    {
      id:"sort", n:5, section:"vocabPractice", min:3, type:"sort",
      title:"Sort it",
      say:"Put every word in a basket. Tap a word, then tap a basket — or drag it.",
      ua:"Розклади слова по кошиках: натисни слово, потім кошик (або перетягни).",
      baskets:[ {id:"hair",t:"Hair"},{id:"good",t:"Usually good"},{id:"notgood",t:"Usually not good"},{id:"depends",t:"It depends!"} ],
      key:{ curly:["hair"], straight:["hair"], fair:["hair"], dark:["hair"],
            cheerful:["good"], friendly:["good"], funny:["good"], polite:["good"], careful:["good","depends"],
            rude:["notgood"], lazy:["notgood"], impatient:["notgood","depends"],
            shy:["depends","notgood"], serious:["depends","good","notgood"], confident:["depends","good"] },
      after:"Is it always bad to be shy? Is it always good to be confident? Explain one “It depends!” word to your partner.",
      samples:["Serious is good at school, but it's boring at a party.","Confident is good, but too confident is not nice.","Shy people are often good listeners."],
      teacher:"<p>Пари, 2 хв. Для «It depends!» оцінюється аргумент, а не вибір кошика: система приймає кілька варіантів для shy, serious, confident, careful, impatient.</p>"
    },
    {
      id:"scenarios", n:6, section:"vocabPractice", min:5, type:"mcq",
      title:"What would you call that?",
      say:"Read each situation and choose the best word. Which words in the story helped you?",
      ua:"Обери найкраще слово. Які слова в історії підказали відповідь?",
      items:[
        { t:"Max has been waiting for two minutes and he's already shouting, “Why is this taking SO LONG?!”", o:["patient","impatient","shy"], a:"impatient", hint:"SO LONG" },
        { t:"At the party, Olia stands next to the wall all evening. When someone says hi, she goes red.", o:["rude","shy","lazy"], a:"shy", hint:"she goes red" },
        { t:"Before Ihor posts a photo, he checks it five times and asks two friends.", o:["careful","funny","rude"], a:"careful", hint:"checks it five times" },
        { t:"Your classmate says, “Nice haircut… Did you do it in the dark?”", o:["polite","rude","cheerful"], a:"rude", hint:"Did you do it in the dark?" },
        { t:"Kira starts telling a story, and after ten seconds the whole class can't stop laughing.", o:["serious","funny","careful"], a:"funny", hint:"can't stop laughing" },
        { t:"Tom's alarm rings at 10:00, 10:15, 10:30… He stays in bed until 12 and asks his brother to bring breakfast.", o:["lazy","confident","polite"], a:"lazy", hint:"stays in bed until 12" },
        { t:"A new student gives a speech to 300 people and doesn't look nervous at all.", o:["shy","confident","impatient"], a:"confident", hint:"doesn't look nervous" },
        { t:"Grandpa always says “please” and “thank you” and opens the door for everyone.", o:["rude","polite","lazy"], a:"polite", hint:"“please” and “thank you”" },
        { t:"Mia's hair isn't straight. It has lots of little rings.", o:["curly","fair","dark"], a:"curly", hint:"little rings" }
      ],
      wordlab:{
        examples:[ ["patient","im","patient"],["polite","im","polite"],["friendly","un","friendly"] ],
        tasks:[ {base:"kind",a:"unkind"},{base:"possible",a:"impossible"},{base:"lucky",a:"unlucky"} ]
      },
      teacher:"<p>Індивідуально 3 хв, потім швидка перевірка. Перед кожною відповіддю: «Which word in the story helped you?»</p><p>Word Lab — лише розпізнавання: im-/un- роблять слово протилежним.</p>"
    },
    {
      id:"detective", n:7, section:"vocabPractice", min:5, type:"detective",
      title:"Personality detective",
      say:"Open the clues one by one. Guess early for more points — but you must explain: “We think he's… because…”",
      ua:"Відкривай підказки по одній. Раніше вгадав — більше балів. Без «because» відповідь не приймається.",
      bank:["lazy","polite","rude","cheerful","careful","confident","friendly","shy","impatient"],
      cases:[
        { id:"A", who:"he", clues:["It's Sunday, and his bag is still not unpacked.","He has a lot of free time, but he never uses it.","He asked a friend to bring him water… from the next table."], a:["lazy"] },
        { id:"B", who:"she", clues:["She always knocks before she opens a door.","She says “Excuse me” when she wants to pass.","She said “Thank you” to the bus driver, the cook and a tree."], a:["polite"] },
        { id:"C", who:"he", clues:["He never says hello.","He took the last slice of pizza without asking.","When someone was speaking, he said “Boring!” and put his headphones on."], a:["rude"] },
        { id:"D", who:"she", clues:["She sings in the shower… and in the rain.","Her bus was two hours late. She said, “Great! More time to chat!”","She smiles all the time — even at 6 a.m."], a:["cheerful"] },
        { id:"E", who:"he", clues:["He reads the instructions before he starts anything.","He checks his bag three times before a walk.","He always has plasters in his pocket, just in case."], a:["careful"] },
        { id:"F", who:"she", clues:["On the first evening, she offered to present the team's project.","She isn't nervous when she speaks to a big group.","She walked up to a group of strangers and said, “Hi, I'm Sasha. Can I join you?”"], a:["confident","friendly"] }
      ],
      bonus:"Bonus round: describe one of the five camp characters with two clues. Can the class guess? “I think it's Marko because…”",
      teacher:"<p>Команди по 3–4. 3 / 2 / 1 бал залежно від кількості відкритих підказок. Правильне слово без «because» не зараховується. Неправильна відповідь блокує спробу до наступної підказки.</p><p>Бонус-раунд — лише якщо є час.</p>"
    },
    {
      id:"bets", n:8, section:"listening", min:2, type:"bets",
      title:"Place your bets",
      say:"Use your new words. Make your predictions before you listen — they're locked after this stage.",
      ua:"Зроби прогнози новими словами до прослуховування.",
      q:[
        { id:"funniest", t:"Who will be the funniest?", kind:"one" },
        { id:"shy", t:"Who might be shy?", kind:"one" },
        { id:"friends", t:"Who might become friends?", kind:"two" },
        { id:"wrong", t:"⭐ Which first impression might be WRONG?", kind:"one" }
      ],
      starters:["Our bet: ___ is really ___.","We think ___ and ___ will be friends because…","Maybe ___ looks ___, but actually…"],
      teacher:"<p>Пари пишуть два прогнози й ставлять ⭐. Бали порахуємо на етапі 11: +1 за прогноз, +2 за правильну ⭐.</p>"
    },
    {
      id:"listen", n:9, section:"listening", min:5, type:"listen",
      title:"I totally misjudged you!",
      say:"It's the end of day one. Dana, Leo and Marko are in the camp kitchen. They're talking about… everyone. Listen twice.",
      ua:"Кінець першого дня. Дана, Лео й Марко на кухні кемпу. Слухаємо двічі: 1) порядок, 2) деталі.",
      audioSrc:"",
      voices:{ DANA:{lang:"en-US",pitch:1.15,rate:1,hint:["female","samantha","zira","aria","jenny","karen","serena","libby","sonia","victoria"]},
               MARKO:{lang:"en-US",pitch:.9,rate:1.02,hint:["male","alex","guy","david","fred","davis","tony","google us english"]},
               LEO:{lang:"en-GB",pitch:1,rate:.97,hint:["daniel","ryan","arthur","george","oliver","uk english male","thomas"]} },
      script:[
        ["SFX","Rain. A kettle clicks off."],
        ["DANA","OK, day one is finished. And honestly? I was completely wrong about some people."],
        ["MARKO","Only some? I was wrong about everyone. Including you."],
        ["DANA","Me? What did you think?"],
        ["MARKO","Well, your profile photo is a desk. A very tidy desk. With twelve colour-coded notebooks. So I thought, “She's going to be really serious. Like a teacher.”"],
        ["DANA","Fourteen notebooks, actually. And I'm not serious!"],
        ["MARKO","No, you're not. You're really friendly. But you're also the most impatient person I've ever met. Lunch was five minutes late, and you checked your watch… how many times?"],
        ["DANA","I don't know. Eleven?"],
        ["LEO","Twenty. I counted."],
        ["MARKO","(laughs) Look! Leo speaks!"],
        ["LEO","Yeah… sorry. I'm a bit shy when I meet new people."],
        ["DANA","Shy? You? Your profile says, “Talk to me about anything!” And you wear sunglasses in every photo. You look so confident!"],
        ["LEO","My sister wrote that. As a joke. I'm confident on a climbing wall. With new people… not really."],
        ["DANA","Well, you're very polite. You said “thank you” to the cook three times."],
        ["LEO","She made pancakes! … OK, what about Zoe? The girl with the long, straight, dark hair? When I saw her photos, I thought she was a bit unfriendly. Black clothes, big headphones, no smile…"],
        ["DANA","Same! I thought, “She looks serious. Maybe she doesn't like people.”"],
        ["MARKO","Are you kidding? Zoe is the funniest person here! Did you hear her copy Nate? (dramatic voice) “Guys! GUYS! This is for my documentary!”"],
        ["LEO","(laughs) That was perfect. And she's so cheerful. It rained all afternoon, and she was still smiling."],
        ["DANA","And Nate? Loud, confident, films everything…"],
        ["MARKO","Yeah, that first impression was right. He IS confident. And he IS funny."],
        ["DANA","But I thought he was going to be rude. People who talk that much are sometimes rude."],
        ["LEO","He isn't. He's really friendly. He helped me with my bags. And he said sorry when his camera hit my head."],
        ["MARKO","His camera hit your head?"],
        ["LEO","Twice."],
        ["DANA","OK, last one. Marko. With your curly hair and that photo — asleep on a sofa, with pizza. Everyone thought the same thing: lazy."],
        ["MARKO","That's fair. I hate mornings."],
        ["LEO","But you got up at half past six to fix the projector for the opening show."],
        ["DANA","And you were so careful with all the cables. Nobody asked you to do it!"],
        ["MARKO","Well… the projector needed help. And I needed an excuse to get to breakfast first."],
        ["DANA","So… first impressions are useless?"],
        ["LEO","Not useless. Just… not the whole story."],
        ["DANA","I like that. I'm writing it in my notebook."],
        ["MARKO","Which one? You've got fourteen."],
        ["SFX","All laugh."]
      ],
      teacher:"<p>Перше прослуховування — завдання 1 (порядок). Друге — завдання 2 і 3. Транскрипт відкривається після першого повного прослуховування або кнопкою вчителя.</p><p>Для mp3 заповніть поле <code>audioSrc</code> у даних уроку.</p>"
    },
    {
      id:"comp", n:10, section:"listening", min:5, type:"comp",
      title:"Did you catch it?",
      say:"Task 1 after the first listen. Tasks 2 and 3 after the second.",
      ua:"Завдання 1 — після першого прослуховування, 2 і 3 — після другого.",
      order:["dana","leo","zoe","nate","marko"],
      bank:["serious","confident","lazy","unfriendly","rude","shy","cheerful","funny","friendly","impatient","careful","polite"],
      table:{
        dana:{ first:["serious"], real:["friendly","impatient"] },
        leo:{ first:["confident"], real:["shy","polite"] },
        zoe:{ first:["serious","unfriendly"], real:["funny","cheerful"] },
        nate:{ first:["confident","funny","rude"], real:["confident","funny","friendly"] },
        marko:{ first:["lazy"], real:["careful"] }
      },
      tf:[
        { s:"Dana has twelve notebooks.", a:false, fix:"She has fourteen." },
        { s:"Lunch was late.", a:true, fix:"Five minutes late." },
        { s:"Leo wrote his own profile.", a:false, fix:"His sister wrote it — as a joke." },
        { s:"It rained in the afternoon.", a:true, fix:"And Zoe was still smiling." },
        { s:"Nate's camera hit Leo's head once.", a:false, fix:"Twice!" },
        { s:"Marko fixed the projector before the opening show.", a:true, fix:"He got up at half past six." }
      ],
      teacher:"<p>Завдання 2: у колонці Reality потрібно обрати всі правильні слова; для First impression приймається будь-яке зі згаданих у діалозі.</p><p>Завдання 4 — усно, правильних відповідей кілька.</p>"
    },
    {
      id:"post", n:11, section:"listening", min:2, type:"post",
      title:"Who won the bet?",
      say:"Compare your bets and your 5-second verdicts with what really happened.",
      ua:"Порівняй свої прогнози й «вердикт за 5 секунд» з реальністю.",
      truth:{ funniest:["zoe"], shy:["leo"], wrong:["zoe","leo","marko","dana"] },
      questions:["Which prediction was correct?","Which character surprised you most?","Who would you like to meet? Why?","Did appearance give the correct impression?"],
      samples:["Our bet about Zoe was correct — she looks serious, but actually she's really funny.","Leo surprised me most. He looks confident, but he's shy.","I'd like to meet Marko because he's funny and careful.","Only for Nate!"],
      teacher:"<p>Пари рахують бали, потім фронтальне обговорення 4 питань.</p>"
    },
    {
      id:"speak", n:12, section:"speaking", min:8, type:"speak",
      title:"First impression challenge",
      say:"Work in pairs. Choose one question per level. Talk for at least 30 seconds. Your partner asks at least one follow-up question.",
      ua:"Пари. По одному питанню з кожного рівня. Говори щонайменше 30 секунд; партнер ставить хоча б одне додаткове питання.",
      phrases:["People usually think I'm…","Actually, I'm…","At first…","With my friends, I'm… but with strangers, I'm…","That's a good question. Let me think…"],
      levels:[
        { name:"Easy", qs:[
          { q:"What do people usually think about you when they first meet you?", ua:"Що зазвичай думають про тебе люди, коли вперше тебе бачать?", en:"When a new person sees you for the first time, what do they think you are like?", sample:"People usually think I'm serious because I don't talk much at first. My hair is dark and I often wear dark clothes, so maybe I look a bit unfriendly.", fu:["Why do you think they think that?","Do you like this first impression?","Is it the same at school and online?"] },
          { q:"Is that impression correct?", ua:"Чи правильне це враження?", en:"Are people right about you or wrong?", sample:"Not really. I'm quiet at first, but actually I'm cheerful and quite funny when I know people.", fu:["When do people see the real you?","How long does it take?","Who knows you best?"] } ] },
        { name:"Personal", qs:[
          { q:"What are you really like?", ua:"Який (яка) ти насправді?", en:"Describe your real personality. Use two or three words and give examples.", sample:"I'm friendly and careful. For example, I always check my homework twice. But I'm also a bit impatient — I hate waiting for the bus!", fu:["Can you give an example?","Which word describes you best?","Would your parents agree?"] },
          { q:"Are you different with friends and with strangers?", ua:"Чи ти поводишся інакше з друзями і з незнайомими людьми?", en:"Are you the same person with your best friends and with people you don't know?", sample:"Yes! With strangers, I'm shy and polite. With my friends, I'm loud and funny. My friends say I never stop talking.", fu:["Why do you think that happens?","Which “you” do you like more?","What helps you feel confident with new people?"] } ] },
        { name:"Deeper", qs:[
          { q:"Which personality trait do you like about yourself?", ua:"Яка риса характеру тобі подобається в собі?", en:"What is one good thing about your personality?", sample:"I like that I'm cheerful. When my friends are sad, I can make them laugh.", fu:["When does this trait help you?","Is there a trait you want to change?","Did you always have this trait?"] },
          { q:"Which personality trait is important in a good friend?", ua:"Яка риса характеру важлива для хорошого друга?", en:"What kind of person is a good friend? Choose one quality and explain.", sample:"I think a good friend is friendly and honest, but not rude. A good friend tells you the truth in a polite way.", fu:["Can a shy person be a great friend?","Is it OK if a friend is a bit lazy?","Which trait is the worst in a friend?"] },
          { q:"Have you ever changed your opinion about someone after you got to know them better?", ua:"Чи змінювалася колись твоя думка про когось, коли ти дізнавався (дізнавалася) цю людину краще?", en:"Were you ever wrong about a person? Tell the story.", sample:"Yes. At first, I thought a boy in my class was rude because he never said hello. Actually, he was just shy. Now he's one of my best friends.", fu:["What happened next?","When did you change your opinion?","What did you learn?"] } ] },
        { name:"Creative", qs:[
          { q:"Imagine a stranger can see only three emojis about you. Which three do you choose? What will they think?", ua:"Уяви, що незнайомець бачить про тебе лише три емодзі. Які три ти обереш? Що він подумає?", en:"Choose three emojis for your profile. Then guess the first impression they create.", sample:"I choose 🎸, 🐶 and 😴. People will think I'm lazy because of the sleeping emoji. Actually, I play guitar for two hours every day!", fu:["Is that impression correct?","Which emoji is the most honest?","What emoji would your best friend choose for you?"] } ] }
      ],
      teacher:"<p>Ходіть між парами й записуйте вдалі фрази для 1-хвилинного фідбеку. Помилки під час мовлення не виправляти.</p><p>Невикористані питання — у домашнє завдання.</p>"
    },
    {
      id:"realme", n:13, section:"mission", min:5, type:"mission",
      title:"The real me",
      say:"Write your own Signal Weekend profile. Use 4–6 words from today. Then swap with a partner and react.",
      ua:"Напиши свій профіль (3 хв), використай 4–6 слів уроку. Потім обмінайся з партнером і відреагуй (2 хв).",
      fields:[
        { id:"look", icon:"🪞", label:"What I look like", starter:"I've got ___ hair. I usually wear…" },
        { id:"think", icon:"👀", label:"What people sometimes think", starter:"People sometimes think I'm… because…" },
        { id:"actual", icon:"✨", label:"What I'm actually like", starter:"But actually, I'm…" },
        { id:"trait", icon:"💪", label:"My strongest trait", starter:"My friends would probably say I'm…" },
        { id:"surprise", icon:"🤫", label:"Something people don't expect", starter:"One thing people don't expect about me is…" }
      ],
      model:{ handle:"@olena.draws.at.night", name:"Olena, 13",
        look:"I've got long curly dark hair, and I usually wear big hoodies.",
        think:"People sometimes think I'm shy because I'm quiet in class.",
        actual:"But actually, I'm really cheerful and a bit crazy with my friends.",
        trait:"My friends would probably say I'm careful — I never lose anything.",
        surprise:"One thing people don't expect about me is that I can do 40 push-ups!" },
      reactions:["I didn't know you were…","I'm surprised that…","That's so cool!","Me too! I'm also…"],
      teacher:"<p>3 хв — письмо, 2 хв — обмін. Граматику не виправляти: мета — комунікація.</p><p>Профілі зберігаються; на початку Lesson 2 покажіть 3–4 анонімно — клас вгадує автора.</p>"
    },
    {
      id:"cliff", n:14, section:"summary", min:1, type:"cliff",
      title:"Story moment",
      say:"Everyone at Signal Weekend is starting to see the real people. But that evening, something happens…",
      ua:"Того вечора стається дещо дивне…",
      notes:[
        { t:"Zoe's phone buzzes.", cls:"" },
        { t:"Signal Weekend 🎙️ — new message", cls:"" },
        { t:"Someone has posted a screenshot in the group chat.", cls:"" },
        { t:"She opens it. It's a private conversation.", cls:"" },
        { t:"About HER.", cls:"" },
        { t:"“She's not really like that. She's just pretending.”", cls:"big" }
      ],
      exit:"Who do you think wrote that message — and why?",
      homework:[
        "Finish your “The Real Me” profile and record a 30-second voice message about it.",
        "Choose two First Impression Challenge questions you didn't answer in class. Write three sentences for each.",
        "Detective: who sent the screenshot? Give one reason."
      ],
      teacher:"<p>Читайте повільно або вмикайте анімацію. Ситуацію не розв'язувати — продовження в Lesson 2.</p>"
    }
  ]
};
