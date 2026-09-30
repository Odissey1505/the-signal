/* ============================================================
   LESSON 3 · Cycle 1C · BEHIND THE MESSAGE
   Vocabulary & Grammar Revision — фінал циклу First Impressions.
   Повторює лексику епізоду 1 і Present Simple / Continuous (епізод 2),
   закриває сюжет: навіщо Марко надіслав повідомлення.
   Формат — урок один на один (учень + учитель, демонстрація екрана).
   Персонажі й словник беруться з c1a (див. requires).
   Екрани — з js/screens/story.js і js/screens/review.js,
   порядок екранів — у функції screens() в кінці файлу.
   ============================================================ */
window.SIGNAL_LESSONS = window.SIGNAL_LESSONS || {};

window.SIGNAL_LESSONS.c1c = {
  id: "c1c",
  cycle: 1,
  lessonType: "use",
  theme: "investigation",
  title: "Behind the Message",
  subtitle: "Vocabulary & Grammar Revision",
  series: "First Impressions",
  question: "Why did Marko send the message?",
  minutes: 57,
  setting: "Signal Weekend, Kraków. Day 2, lunchtime. The detectives know who sent the message. Now they want to know why.",

  /* Inkwell: секція → етапи цього уроку */
  inkwellSections: {
    warmUp: ["hook"],
    vocabPresentation: [],
    discoveryGuide: ["chat", "grammar"],
    vocabPractice: ["words"],
    grammar: ["grammar"],
    grammarPractice: ["grammar:practice"],
    listening: [],
    speaking: ["board", "realme"],
    mission: ["board"],
    summary: ["realme:final"],
    homework: []
  },
  tabs: [
    { key:"warmUp", label:"1 Warm-up" }, { key:"vocab", label:"2 Words" }, { key:"reading", label:"3 The chat" },
    { key:"grammar", label:"4 Grammar" }, { key:"mission", label:"5 Evidence board" }, { key:"speaking", label:"6 The real me" }
  ],

  /* немає нових слів: повторення лексики епізоду 1 */
  vocab: [],
  receptive: [],
  recall: ["shy", "polite", "careful", "impatient", "lazy", "friendly", "cheerful", "serious", "confident", "funny", "rude", "curly", "straight", "fair", "dark"],

  requires: ["c1a"],
  get characters(){ return (window.SIGNAL_LESSONS.c1a || {}).characters || {}; },
  order: ["leo", "dana", "marko"],

  /* ---------- stages ---------- */
  stages: [
    /* 1 · WARM-UP ------------------------------------------------ */
    {
      id:"hook", n:1, section:"warmUp", min:5, type:"hook",
      title:"Why did he send it?",
      say:"Talk about the questions. Then vote: why do you think Marko sent the message?",
      ua:"Обговори питання. Потім проголосуй: чому, на твою думку, Марко надіслав повідомлення?",
      dm:["Good detective work. You found me.", "But you still don't know why I sent the message…"],
      message:["Someone in this group isn't showing their real personality.", "Watch what they are doing today."],
      questions:[
        { q:"What do we already know?", ua:"Що ми вже знаємо?" },
        { q:"What do we still need to find out?", ua:"Що нам ще треба з'ясувати?" },
        { q:"Why do you think Marko sent the message?", ua:"Як ти думаєш, чому Марко надіслав повідомлення?" }
      ],
      poll:[
        { id:"A", t:"He wants to play a joke." },
        { id:"B", t:"He wants the group to understand something." },
        { id:"C", t:"He is angry with someone." }
      ],
      starter:"I think … because …",
      example:"I think he wants the group to understand something because he says we don't know why he sent it.",
      mission:"Find out why Marko sent the message. Use evidence, not just first impressions.",
      teacher:"<p><b>5 хв.</b> Перший екран — фінал епізоду 2 у приватному чаті: прочитайте вголос, не коментуйте.</p><details><summary>Нотатки й відповіді</summary><p><b>What do we already know?</b> Марко надіслав повідомлення. Зазвичай він ігнорує груповий чат, але вранці постійно його перевіряв; казав, що не читає чат, але був онлайн і знав про худі Лео.</p><p><b>What do we still need to find out?</b> Чому він це зробив.</p><p>Голосування — це здогадка, правильної відповіді тут немає. Не підтверджуйте й не спростовуйте жодної версії — відповідь буде лише в частині 5.</p><p>Опора: <b>I think … because …</b> — учень пояснює свій вибір.</p></details>"
    },

    /* 2 · VOCABULARY --------------------------------------------- */
    {
      id:"words", n:2, section:"vocab", min:8, type:"vocab",
      title:"What do we really know?",
      say:"What are these people like? Tap a word, then tap a gap. Look at what the person does.",
      ua:"Які ці люди? Натисни слово, потім пропуск. Дивись на те, що людина робить.",
      bank:["careful", "rude", "shy", "funny", "lazy", "confident", "polite", "impatient"],
      items:[
        { who:"Leo", t:"Leo finds it difficult to talk to new people. At first, he just looks at his phone.", a:"shy",
          why:"He feels nervous with people he doesn't know.",
          ua:"Лео важко говорити з новими людьми. Спочатку він просто дивиться в телефон. → <b>shy</b> — сором'язливий: він нервує з незнайомими людьми." },
        { who:"Nate", t:"Nate says “please” and “thank you” to everyone — the cook, the driver and the camp nurse.", a:"polite",
          why:"He shows respect to everyone.",
          ua:"Нейт каже «будь ласка» і «дякую» всім — кухарці, водієві й медсестрі табору. → <b>polite</b> — ввічливий: він поважає всіх." },
        { who:"Dana", t:"Lunch is five minutes late, and Dana checks her watch twenty times.", a:"impatient",
          why:"She doesn't like waiting.",
          ua:"Обід запізнюється на п'ять хвилин, і Дана двадцять разів дивиться на годинник. → <b>impatient</b> — нетерпляча: вона не любить чекати." },
        { who:"Marko", t:"Before the opening show, Marko checks every cable twice.", a:"careful",
          why:"He tries not to make mistakes.",
          ua:"Перед відкриттям Марко двічі перевіряє кожен кабель. → <b>careful</b> — уважний, обережний: він намагається не помилитися." },
        { who:"Zoe", t:"Zoe copies Nate's voice, and the whole kitchen laughs.", a:"funny",
          why:"She makes people laugh.",
          ua:"Зої копіює голос Нейта, і вся кухня сміється. → <b>funny</b> — смішна: вона смішить людей." },
        { who:"Oksana", t:"Oksana, the camp leader, speaks to sixty people without any notes. Her voice is calm and strong.", a:"confident",
          why:"She isn't afraid to speak in front of people.",
          ua:"Оксана, керівниця табору, говорить перед шістдесятьма людьми без жодних нотаток. Її голос спокійний і впевнений. → <b>confident</b> — впевнена: вона не боїться виступати." }
      ],
      after:"We chose every word because of what the person does or says — not because of how they look.",
      photo:{
        c:"marko", cap:"Marko's profile photo",
        describe:"Describe Marko's appearance. What does he look like in this photo?",
        describeUa:"Опиши зовнішність Марка. Як він виглядає на цьому фото?",
        help:["He's got … hair.", "curly / straight", "fair / dark", "He's wearing …", "He looks …"],
        describeEx:"He's got curly dark hair. He's wearing a green hoodie. In this photo, his eyes are closed, so he looks sleepy.",
        think:"Can we know someone's personality from a photo?",
        thinkUa:"Чи можна дізнатися характер людини з фото?",
        thinkEx:"No. We need to talk to them and see how they behave. Marko looks lazy in this photo, but actually he's careful. He got up at half past six to fix the projector."
      },
      teacher:"<p><b>8 хв.</b> Вправа — 4 хв: учень натискає сам або називає слова, а ви їх ставите. Опис фото й питання про характер — усно.</p><details><summary>Відповіді</summary><p>1 shy · 2 polite · 3 impatient · 4 careful · 5 funny · 6 confident. Зайві слова: rude, lazy.</p><p>Після кожної відповіді питайте: <b>What does the person do?</b> — прикметник має спиратися на дію або репліку, а не на зовнішність.</p><p>Фото Марка — «перше враження» з епізоду 1: виглядає лінивим, але насправді уважний (встав о 6:30 лагодити проєктор). Очікувана думка: <i>No. We need to talk to them and see how they behave.</i></p><p>Довідник слів відкривається за бажанням — окремо його не проходимо.</p></details>"
    },

    /* 3 · READING ------------------------------------------------ */
    {
      id:"chat", n:3, section:"reading", min:10, type:"chat",
      title:"The conversation continues",
      say:"Dana makes a small group chat. Open the messages one by one.",
      ua:"Дана створює маленький груповий чат. Відкривай повідомлення по одному.",
      predict:{ q:"What do you think Marko will say?", ua:"Як ти думаєш, що скаже Марко?", ex:"I think he'll say sorry, but maybe he won't explain everything." },
      msgs:[
        { who:"dana", time:"12:41", t:"OK, Marko. We know it was you. So why did you send it?", ua:"Гаразд, Марко. Ми знаємо, що це був ти. То навіщо ти його надіслав?" },
        { who:"nate", time:"12:41", t:"Why so serious, Dana? 😂 Maybe he just wants to be a famous detective, like me.", ua:"Чого така серйозна, Дано? 😂 Може, він просто хоче бути відомим детективом, як я." },
        { who:"nate", time:"12:42", t:"Marko? That was a joke. You usually have a joke for everything.", ua:"Марко? Це був жарт. Зазвичай у тебе є жарт на все." },
        { sys:"Marko is typing…", ua:"Марко пише…" },
        { sys:"Marko stopped typing.", ua:"Марко перестав писати." },
        { who:"dana", time:"12:43", t:"He's typing and deleting again. That's the third time! 😅", ua:"Він знову пише й видаляє. Це вже втретє! 😅" },
        { who:"nate", time:"12:43", t:"Something is wrong. He usually jokes with everyone. Today he is avoiding our questions.", ua:"Щось не так. Зазвичай він жартує з усіма. А сьогодні він уникає наших запитань." },
        { who:"dana", time:"12:44", t:"Marko, you know I'm impatient. Please just tell us. Leo is really upset. Everyone thinks the message is about him.", ua:"Марко, ти ж знаєш, що я нетерпляча. Будь ласка, просто скажи нам. Лео дуже засмучений. Усі думають, що повідомлення про нього." },
        { sys:"Marko is typing…", ua:"Марко пише…" },
        { who:"marko", time:"12:46", t:"Sorry. I'm not ignoring you. I'm thinking about how to say it.", ua:"Вибачте. Я вас не ігнорую. Я думаю, як це сказати." },
        { who:"marko", time:"12:46", t:"Can I say one thing first? It's easy to look confident. You make a joke, people laugh, and nobody asks questions. Even when talking is really hard.", ua:"Можна я спершу скажу одне? Здаватися впевненим легко. Ти жартуєш, люди сміються, і ніхто нічого не питає. Навіть коли говорити дуже важко." },
        { who:"nate", time:"12:47", t:"Wait… are we still talking about the message? 🤔", ua:"Стоп… ми все ще говоримо про повідомлення? 🤔" },
        { who:"marko", time:"12:47", t:"Give me five minutes. I'm writing a proper message this time.", ua:"Дайте мені п'ять хвилин. Цього разу я пишу нормальне повідомлення." },
        { who:"dana", time:"12:48", t:"No mystery this time? OK. We're waiting. ⏳", ua:"Цього разу без загадок? Добре. Ми чекаємо. ⏳" },
        { who:"nate", time:"12:48", t:"And look — Dana is already checking her watch. 😂", ua:"І дивіться — Дана вже дивиться на годинник. 😂" }
      ],
      qs:[
        { q:"What does Marko usually do?", ua:"Що Марко зазвичай робить?",
          a:"He usually jokes with everyone. Nate says, “You usually have a joke for everything.”" },
        { q:"What is he doing differently today?", ua:"Що він сьогодні робить інакше?",
          a:"He isn't answering Nate's jokes. He is avoiding their questions, and he is typing and deleting his messages." },
        { q:"Which detail suggests that he is nervous?", ua:"Яка деталь показує, що він нервує?",
          a:"He starts typing and then stops — Dana says it's the third time. He also says that talking can be really hard." },
        { q:"Does the chat prove his reason, or do we still need more information?", ua:"Чи доводить чат його причину, чи нам потрібно більше інформації?",
          a:"It doesn't prove his reason. We have clues, but Marko hasn't explained anything yet. We still need more information — his “proper message”." }
      ],
      teacher:"<p><b>10 хв.</b> До читання — питання-прогноз (1 хв). Потім відкривайте повідомлення кнопкою <b>Next message</b> і давайте учневі секунду на реакцію. <b>Show full chat</b> — показати весь текст одразу.</p><details><summary>Відповіді й підказки</summary><p>Три підказки до мотиву: 1) зазвичай жартує, але сьогодні не відповідає на жарти; 2) кілька разів починає писати й видаляє; 3) «It's easy to look confident… Even when talking is really hard.»</p><p>Питання 4: мотив <b>ще не підтверджений</b> — у нас лише підказки. Не розкривайте розв'язку.</p><p>Переклад — кнопкою UA під чатом.</p></details>"
    },

    /* 4 · GRAMMAR ------------------------------------------------ */
    {
      id:"grammar", n:4, section:"grammar", min:9, type:"grammar",
      title:"Usually vs today",
      say:"Look at two sentences from the chat. Answer the questions with your teacher.",
      ua:"Подивись на два речення з чату. Дай відповіді на питання разом з учителем.",
      examples:["He [m:usually] [v:joke][i:s] with everyone.", "[m:Today] he [a:is] [v:avoid][i:ing] our questions."],
      discover:[
        { q:"Which sentence describes a habit?", a:"Sentence 1: “He usually jokes with everyone.” It's something he does again and again." },
        { q:"Which sentence describes a temporary situation today?", a:"Sentence 2: “Today he is avoiding our questions.” It's different from normal, and it's only for now." },
        { q:"What changes after he in the Present Simple?", a:"The verb gets -s: he jokes, she checks. After -o, -s, -sh, -ch, -x we add -es: he goes, she watches." },
        { q:"How do we form the Present Continuous?", a:"am / is / are + verb-ing: I'm thinking, he is avoiding, they are waiting." }
      ],
      forms:[
        { name:"Present Simple", q:"What is normal?", uses:"habits · facts · personality",
          rows:[["+", "He usually jokes.", "I / you / we / they joke."], ["−", "He doesn't joke.", "I / you / we / they don't joke."], ["?", "Does he joke?", "Do you joke?"]] },
        { name:"Present Continuous", q:"What is happening now or today?", uses:"now · today · temporary situations",
          rows:[["+", "He is joking.", "I'm joking. · You / we / they are joking."], ["−", "He isn't joking.", "I'm not joking. · They aren't joking."], ["?", "Is he joking?", "Are you joking?"]] }
      ],
      stative:{ t:"Know, like and want usually use the Present Simple.", ex:["I know the answer.", "I want to understand."] },
      practice:[
        { kind:"+ · Present Simple", ctx:"Marko is the joker of the group.",
          pre:"He usually", post:"with everyone.", o:["jokes", "is joking", "joke"], a:0,
          why:"A habit — something he does again and again. He → verb + -s." },
        { kind:"− · Present Continuous", ctx:"Nate is sending jokes, but Marko is quiet.",
          pre:"Today he", post:"them.", o:["doesn't answer", "isn't answering", "not answering"], a:1,
          why:"Temporary — it's different from normal, only today. is + not + verb-ing." },
        { kind:"? · Present Simple", ctx:"Dana asks Nate about Marko's normal day.",
          pre:"", post:"the group chat on a normal day? — No, he usually ignores it.", o:["Does Marko read", "Is Marko reading", "Do Marko read"], a:0,
          why:"A question about a habit. Does + he / she + verb (no -s)." },
        { kind:"+ · Present Continuous", ctx:"Look at the screen — the three dots are there.",
          pre:"Marko", post:"a long message.", o:["writes", "is writing", "writing"], a:1,
          why:"Happening now — we can see the dots at this moment. is + verb-ing." },
        { kind:"− · Present Simple", ctx:"Dana plans everything, and she hates waiting.",
          pre:"She", post:"surprises.", o:["doesn't like", "isn't liking", "don't like"], a:0,
          why:"A fact about her personality. And like usually uses the Present Simple." },
        { kind:"? · Present Continuous", ctx:"Marko's phone is in his hand, and he looks worried.",
          pre:"", post:"to someone at the moment? — Yes, to the whole group.", o:["Is he writing", "Does he write", "Is he write"], a:0,
          why:"A question about what's happening now. Is + he + verb-ing?" }
      ],
      teacher:"<p><b>9 хв.</b> Discovery questions — усно 2 хв, відповіді відкривайте кнопкою. Нагадування про форми — 1 хв. Вправа — 4 хв, потім перевірка й пояснення.</p><details><summary>Відповіді</summary><p>1 jokes · 2 isn't answering · 3 Does Marko read · 4 is writing · 5 doesn't like · 6 Is he writing.</p><p>Просіть пояснити <b>значення</b>, а не лише слово-маркер: «Is it normal for him — or is it happening now / only today?»</p><p>Know / like / want — лише коротке нагадування, широку тему stative verbs не вводимо.</p></details>"
    },

    /* 5 · EVIDENCE BOARD (урок один на один) --------------------- */
    {
      id:"board", n:5, section:"mission", min:15, type:"mission",
      title:"Evidence Board",
      intro:"Read the six cards. Sort them into three columns. Then choose the three most useful clues and explain your theory.",
      introUa:"Прочитай шість карток. Розподіли їх у три колонки. Потім обери три найкорисніші підказки та поясни свою версію.",
      tip:"Sort the cards by meaning, not by grammar. An opinion can use the Present Simple or the Present Continuous — but it is still an opinion, not a proven fact.",
      cols:[
        { id:"usual", e:"🔁", t:"USUAL BEHAVIOUR", sub:"Things Marko usually does." },
        { id:"now", e:"📍", t:"HAPPENING NOW", sub:"Things Marko is doing today or at the moment." },
        { id:"opinion", e:"💭", t:"OPINIONS", sub:"What other people think about Marko." }
      ],
      cards:[
        { id:"jokes", t:"Marko usually makes jokes when he meets new people.", a:"usual",
          why:"This is something he usually does.", ua:"Марко зазвичай жартує, коли знайомиться з новими людьми." },
        { id:"subject", t:"Marko often changes the subject when someone asks about his feelings.", a:"usual",
          why:"Often shows a repeated action.", ua:"Марко часто змінює тему, коли хтось питає про його почуття." },
        { id:"typing", t:"Marko is typing a reply and deleting it again.", a:"now",
          why:"This is happening at the moment.", ua:"Марко пише відповідь і знову її видаляє." },
        { id:"avoiding", t:"Today, Marko is avoiding the group's questions.", a:"now",
          why:"This describes his behaviour today.", ua:"Сьогодні Марко уникає запитань групи." },
        { id:"confident", t:"A friend says: “I think Marko is confident because he tells lots of jokes.”", a:"opinion",
          why:"This is a friend's interpretation, not proof of how Marko feels.", ua:"Друг каже: «Я думаю, Марко впевнений, бо він багато жартує»." },
        { id:"rude", t:"A friend says: “In my opinion, Marko is rude because he isn't answering us.”", a:"opinion",
          why:"This is an opinion about his behaviour.", ua:"Друг каже: «На мою думку, Марко грубий, бо він нам не відповідає»." }
      ],
      starPrompt:"Choose three clues that help you explain why Marko sent the message.",
      starUa:"Обери три підказки, які допомагають пояснити, чому Марко надіслав повідомлення.",
      questions:[
        { q:"What does Marko usually do?", ua:"Що Марко зазвичай робить?" },
        { q:"What is he doing differently today?", ua:"Що він сьогодні робить інакше?" },
        { q:"Which cards show opinions rather than facts?", ua:"Які картки показують думки, а не факти?" },
        { q:"Does making jokes always mean someone feels confident?", ua:"Чи завжди жарти означають, що людина почувається впевнено?" },
        { q:"What do you think Marko wants the group to understand?", ua:"Як ти думаєш, що Марко хоче, щоб група зрозуміла?" }
      ],
      help:["He usually …", "Today, he is …", "This clue suggests …", "We don't know if …", "I think he sent the message because …"],
      theoryPh:"I think Marko sent the message because … He usually … Today, he is …",
      checklist:["I used the Present Simple.", "I used the Present Continuous.", "I used personality vocabulary.", "I explained my idea with clues."],
      confession:[
        "OK. Here's the truth. The person in the message is me.",
        "I usually make jokes because I want to look confident. People laugh, and nobody sees that I'm nervous. Actually, I often don't know what to say.",
        "Today I'm trying to be honest about it. The message was my strange way to start a conversation about first impressions — and about the real us.",
        "But I didn't want you to suspect each other. Leo, I'm really sorry about the message about you. That was a big mistake.",
        "Next time, no mystery messages. I'll just talk to you. Like now. 🙂"
      ],
      confessionUa:"Гаразд. Ось правда. Людина з того повідомлення — це я. Я зазвичай жартую, бо хочу здаватися впевненим. Люди сміються, і ніхто не бачить, що я нервую. Насправді я часто не знаю, що сказати. Сьогодні я намагаюся чесно про це розповісти. Повідомлення було моїм дивним способом почати розмову про перші враження — і про те, які ми насправді. Але я не хотів, щоб ви підозрювали одне одного. Лео, мені дуже шкода через повідомлення про тебе. Це була велика помилка. Наступного разу — жодних загадкових повідомлень. Я просто поговорю з вами. Як зараз. 🙂",
      replies:[
        { who:"leo", t:"Thanks, Marko. Honestly, I get it. My profile looks confident too — and you know I'm not. 😅", ua:"Дякую, Марко. Чесно, я розумію. Мій профіль теж виглядає впевненим — а ти знаєш, що я не такий. 😅" },
        { who:"dana", t:"We're glad you told us. 💛 But a mystery message wasn't a good way to ask for understanding. We started to suspect each other! Next time, just talk to us.", ua:"Ми раді, що ти нам розповів. 💛 Але загадкове повідомлення — не найкращий спосіб попросити розуміння. Ми почали підозрювати одне одного! Наступного разу просто поговори з нами." }
      ],
      after:[
        { q:"Was sending the message a good idea?", ua:"Чи було надсилання повідомлення гарною ідеєю?", ex:"No, it wasn't. Marko wanted to be honest, but the message made everyone suspicious, and Leo was really upset." },
        { q:"What could he do differently?", ua:"Що він міг зробити інакше?", ex:"He could talk to one friend first. Or he could just write, “I sometimes look confident, but I'm nervous.”" }
      ],
      sample:"Marko usually makes jokes with new people. Today, he is avoiding questions and deleting his replies. His friends think he is confident, but the clues suggest that he may feel nervous. I think he wants them to understand him better.",
      teacher:"<p><b>15 хв</b>: Evidence Board — 10–12 хв (сортування 3–4 хв, перевірка 1 хв, зірочки й питання 3–4 хв, версія 2–3 хв), потім 3 хв — повідомлення Марка і два питання.</p><details><summary>Правильний розподіл і пояснення</summary><p>Картки перемішані, тому літери A–F щоразу інші — орієнтуйтеся на текст.</p><ul><li><b>USUAL BEHAVIOUR:</b> «usually makes jokes when he meets new people» — something he usually does; «often changes the subject…» — <i>often</i> shows a repeated action.</li><li><b>HAPPENING NOW:</b> «is typing a reply and deleting it again» — happening at the moment; «Today, Marko is avoiding…» — his behaviour today.</li><li><b>OPINIONS:</b> «I think Marko is confident…» — a friend's interpretation, not proof of how Marko feels; «In my opinion, Marko is rude…» — an opinion about his behaviour.</li></ul><p>Картки сортуються <b>за змістом</b>: у картці-думці є Present Continuous (<i>isn't answering</i>), але від цього вона не стає фактом.</p></details><details><summary>Як підтримати учня</summary><ul><li>Is this something he does again and again — or only today?</li><li>Who says this? Is it a fact or someone's idea?</li><li>What do the words <i>I think</i> / <i>In my opinion</i> show?</li><li>Can a person tell lots of jokes and still feel nervous?</li><li>Why did you choose this card as a clue?</li></ul><p>Зірочки й версію автоматично не оцінюємо: будь-яка комбінація трьох карток приймається, якщо учень пояснює свій вибір. Інша правдоподібна версія мотиву — не помилка.</p><p>Учень може лише говорити, а ви — пересувати картки (перетягнути або натиснути картку й обрати колонку).</p></details><details><summary>Зразок відповіді (наближає до розв'язки — не показуйте учневі)</summary><p><i>Marko usually makes jokes with new people. Today, he is avoiding questions and deleting his replies. His friends think he is confident, but the clues suggest that he may feel nervous. I think he wants them to understand him better.</i></p></details><p>Далі — кнопка <b>Open Marko's real message</b>. Вона працює завжди, навіть без правильного сортування й тексту в полі. Після зізнання — два питання; просіть <b>because</b>.</p>"
    },

    /* 6 · SPEAKING + EXIT TICKET --------------------------------- */
    {
      id:"realme", n:6, section:"speaking", min:10, type:"speaking",
      title:"The real me",
      say:"Talk about yourself — or about an invented character. Choose one question or answer all three.",
      ua:"Говори про себе — або про вигаданого персонажа. Обери одне питання або дай відповідь на всі три.",
      qs:[
        { q:"Do first impressions always tell us the truth?", ua:"Чи завжди перше враження каже нам правду?",
          ex:"Not always. Marko looks lazy in his photo, but actually he's careful. We need to know a person first." },
        { q:"What do people sometimes misunderstand about you or your character?", ua:"Що люди іноді неправильно розуміють про тебе або твій характер?",
          ex:"People sometimes think I'm serious because I'm quiet in class. Actually, I'm quite funny with my friends." },
        { q:"What do you usually do, and what are you doing differently these days?", ua:"Що ти зазвичай робиш і що робиш інакше останнім часом?",
          ex:"I usually play football after school, but these days I'm studying for a big test, so I'm staying at home in the evenings." }
      ],
      phrases:["People sometimes think I'm …", "Actually, I'm …", "I usually …, but these days I'm …", "At first, …"],
      ticket:[
        { id:"think", label:"People sometimes think I'm …", ph:"People sometimes think I'm …" },
        { id:"actual", label:"Actually, I'm …", ph:"Actually, I'm …" },
        { id:"usually", label:"I usually …", ph:"I usually …" },
        { id:"these", label:"These days, I'm …", ph:"These days, I'm …" }
      ],
      ticketEx:["People sometimes think I'm shy.", "Actually, I'm cheerful and friendly with my friends.", "I usually draw comics in the evening.", "These days, I'm learning to play the guitar."],
      checklist:["I used personality vocabulary.", "I used the Present Simple.", "I used the Present Continuous.", "I explained my ideas clearly."],
      final:{
        big:"Case closed.",
        line:"First impressions aren't the whole story. 🔍✨",
        summary:"Today we reviewed words to describe people, compared habits and actions happening now, explained why Marko sent the message and finished the story of Cycle 1."
      },
      teacher:"<p><b>10 хв</b>: speaking з учителем — 5 хв, exit ticket — 4 хв, фінальний екран — 1 хв.</p><details><summary>Нотатки</summary><p>Учень може говорити про себе або про вигаданого персонажа — це знімає тиск для тих, хто не хоче розповідати про себе.</p><p>Exit ticket не перевіряється автоматично: правильних відповідей багато. Чекліст — самоперевірка. Попросіть учня прочитати свої чотири речення вголос.</p><p>Приклади відповідей приховані за кнопками <b>Example</b>.</p></details>"
    }
  ],

  /* ---------- порядок екранів (типи — з js/screens/story.js і js/screens/review.js) ---------- */
  screens(add, st){
    const A = window.SIGNAL_LESSONS.c1a || {};

    const h = st("hook");
    add(h, "privateChat", { key:"dm", who:"marko", msgs:h.dm, kicker:"Previously on The Signal…", end:"To be continued…", next:"Episode 3 · Behind the Message", cta:"Start the new case" });
    add(h, "pollTalk", { key:"poll", counts:false, title:h.title, say:h.say, ua:h.ua, message:h.message, questions:h.questions, poll:h.poll, starter:h.starter, example:h.example, mission:h.mission });

    const w = st("words");
    add(w, "wordGaps", { key:"gaps", title:w.title, say:w.say, ua:w.ua, bank:w.bank, items:w.items, after:w.after });
    add(w, "photoTalk", Object.assign({ key:"photo", title:"Look at the photo", glossary:(A.vocab || []) }, w.photo));

    const c = st("chat");
    add(c, "stepChat", { key:"chat", title:c.title, say:c.say, ua:c.ua, predict:c.predict, msgs:c.msgs, qs:c.qs, me:"dana",
      chat:"Case: Unknown 🔍", sub:"Dana, Nate, Marko · Dana's phone" });

    const g = st("grammar");
    add(g, "discoverQs", { key:"discover", title:g.title, say:g.say, ua:g.ua, examples:g.examples, qs:g.discover, forms:g.forms, stative:g.stative });
    add(g, "gapChoice", { key:"practice", store:"practice", title:"Usually or today?", say:"Read the situation. Choose the correct form. Then check.", ua:"Прочитай ситуацію. Обери правильну форму. Потім перевір.", items:g.practice });

    const b = st("board");
    add(b, "sortBoard", { key:"eb", title:b.title, intro:b.intro, introUa:b.introUa, tip:b.tip, cols:b.cols, cards:b.cards, stars:3,
      starPrompt:b.starPrompt, starUa:b.starUa, questions:b.questions, help:b.help, theoryPh:b.theoryPh, checklist:b.checklist,
      words:this.recall.slice(0, 11).concat(["nervous", "honest", "worried"]) });
    add(b, "confession", { key:"real", who:"marko", msgs:b.confession, msgsUa:b.confessionUa, replies:b.replies, after:b.after,
      chat:"Signal Weekend 🎙️", sub:"20 members · 12:53", title:"Marko's real message", kicker:"Evidence board · the truth",
      intro:"Explain your theory first. Then open Marko's message.", introUa:"Спершу поясни свою версію. Потім відкрий повідомлення Марка.",
      openLabel:"Open Marko's real message" });

    const r = st("realme");
    add(r, "talkCards", { key:"talk", title:r.title, say:r.say, ua:r.ua, qs:r.qs, phrases:r.phrases });
    add(r, "exitTicket", { key:"ticket", title:"Exit ticket", fields:r.ticket, example:r.ticketEx, checklist:r.checklist });
    add(r, "caseClosed", Object.assign({ key:"final", cast:["zoe", "leo", "dana", "marko", "nate"] }, r.final));
  },

  /* ---------- сторінка після епізоду ---------- */
  finish(ans){
    const w = (ans.words && ans.words.gaps) || {};
    const p = (ans.grammar && ans.grammar.practice) || {};
    const eb = (ans.board && ans.board.eb) || {};
    const t = (ans.realme && ans.realme.ticket) || {};
    const filled = t.f ? Object.values(t.f).filter(x => String(x || "").trim()).length : 0;
    return {
      icon:"🔍", title:"Case closed",
      text:"First impressions aren't the whole story. You finished Cycle 1 of The Signal!",
      stats:[
        [`🏷️ ${w.score != null ? w.score : 0} / 6`, "character words"],
        [`🧩 ${p.score != null ? p.score : 0} / 6`, "usually or today?"],
        [`🗂️ ${eb.best != null ? eb.best : 0} / 6`, "evidence board"],
        [`🎟️ ${filled} / 4`, "exit ticket sentences"]
      ]
    };
  }
};
