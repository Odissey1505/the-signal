/* ============================================================
   THE SIGNAL — карта курсу
   ------------------------------------------------------------
   Сезони → цикли (серіали) → 3 епізоди (A Discover, B Understand, C Use it).
   Щоб відкрити епізод: додайте файл у lessons/ і допишіть у рядок епізоду
     content: true, file: "lessons/<назва>.js"
   Обкладинки: image (16:9, головна) і banner (≈3,2:1, сторінка серіалу) —
   шляхи до файлів у assets/covers/.
   ============================================================ */
window.SIGNAL_COURSE = {
  id: "the-signal-8", title: "The Signal", level: "A2+ → B1", grade: "8 клас · 13–14 років",
  seasons: [
    {
      n: 1, title: "New Signal",
      blurb: "The team meets, finds old secrets and wins its first story.",
      extras: [
        { after: 2, kind: "Culture", title: "Threads of Identity" },
        { after: 4, kind: "Life Skills", title: "Fit for the Signal" },
        { after: 4, kind: "Review", title: "The Signal Awards" }
      ],
      cycles: [
      {
        n: 1, title: "First Impressions", emoji: "🎭", color: "#5B4BFF",
        tagline: "Who are you really?",
        unit: "Unit 1 · All about me", grammar: "Present simple vs continuous",
        blurb: "Twenty strangers. One weekend. Everyone has already judged everyone.",
        image: "assets/covers/c1-cover.webp", imageAlt: "First Impressions — Who are you really? Zoe, Leo and Dana look at the camera.",
        banner: "assets/covers/c1-banner.webp", bannerAlt: "First Impressions — Who are you really? Zoe, Leo, Dana, Marko and Nate.",
        lessons: [
          { id: "c1a", type: "A", title: "First impressions", tags: ["Vocabulary", "Listening"], content: true, file: "lessons/c1a-first-impressions.js" },
          { id: "c1b", type: "B", title: "Behind the Profile", tags: ["Grammar", "Reading", "Listening"], content: true, file: "lessons/c1b-behind-the-profile.js" },
          { id: "c1c", type: "C", title: "The truth comes out", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 2, title: "The Jacket Secret", emoji: "🧥", color: "#0E9F9A",
        tagline: "A 30-year-old note in a pocket.",
        unit: "Unit 2 · In fashion", grammar: "Past simple",
        blurb: "Dana finds her grandpa's old jacket. The note inside says: don't tell Olena.",
        lessons: [
          { id: "c2a", type: "A", title: "The attic box", tags: ["Vocabulary", "Reading"] },
          { id: "c2b", type: "B", title: "Grandpa's story", tags: ["Grammar", "Listening"] },
          { id: "c2c", type: "C", title: "Swap shop challenge", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 3, title: "Generation Swap", emoji: "⏳", color: "#E8590C",
        tagline: "Three days without a phone.",
        unit: "Unit 3 · My way of life", grammar: "Comparatives, not as … as",
        blurb: "Marko has to live like a teenager in 1985. The whole school is watching.",
        lessons: [
          { id: "c3a", type: "A", title: "The challenge", tags: ["Vocabulary", "Reading"] },
          { id: "c3b", type: "B", title: "Day 1 without a phone", tags: ["Grammar", "Listening"] },
          { id: "c3c", type: "C", title: "Generation debate", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 4, title: "One Flash", emoji: "🧗", color: "#1C7ED6",
        tagline: "One fall. One flash. One more chance?",
        unit: "Unit 4 · Champions", grammar: "Past continuous",
        blurb: "Leo falls on the last hold. Was it his mistake — or a camera flash?",
        lessons: [
          { id: "c4a", type: "A", title: "Which sport are you?", tags: ["Vocabulary", "Reading"] },
          { id: "c4b", type: "B", title: "The replay", tags: ["Grammar", "Listening"] },
          { id: "c4c", type: "C", title: "Rematch?", tags: ["Final Mission", "Reading"] }
        ]
      }
      ]
    },
    {
      n: 2, title: "Out in the World",
      blurb: "A break-in, a glitchy city, a group-chat storm and a trip to Manchester.",
      extras: [
        { after: 6, kind: "Culture", title: "NYC in 24 Hours" },
        { after: 8, kind: "Life Skills", title: "Cool Down" },
        { after: 8, kind: "Review", title: "Race Across Manchester" }
      ],
      cycles: [
      {
        n: 5, title: "The Studio Break-In", emoji: "🚨", color: "#C2255C",
        tagline: "Someone was here last night.",
        unit: "Unit 5 · Call the police!", grammar: "Past simple + continuous",
        blurb: "The night before the launch, the Signal studio is broken into.",
        lessons: [
          { id: "c5a", type: "A", title: "Crime scene", tags: ["Vocabulary", "Listening"] },
          { id: "c5b", type: "B", title: "Alibis", tags: ["Grammar", "Reading"] },
          { id: "c5c", type: "C", title: "Case closed", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 6, title: "Glitch City", emoji: "🏙️", color: "#2F9E44",
        tagline: "A million and an angry neighbourhood.",
        unit: "Unit 6 · City life", grammar: "some, any, much, many, a few, a little",
        blurb: "You're the mayor of a city that keeps breaking. Then the lights go out for real.",
        lessons: [
          { id: "c6a", type: "A", title: "Welcome to Glitch City", tags: ["Vocabulary", "Reading"] },
          { id: "c6b", type: "B", title: "Power cut", tags: ["Grammar", "Listening"] },
          { id: "c6c", type: "C", title: "Youth city council", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 7, title: "The Screenshot", emoji: "💬", color: "#7048E8",
        tagline: "A chat you weren't supposed to see.",
        unit: "Unit 7 · Getting on", grammar: "have to, must, should",
        blurb: "Dana sees a group chat she isn't in. One line says: Dana mustn't know.",
        lessons: [
          { id: "c7a", type: "A", title: "The screenshot", tags: ["Vocabulary", "Reading"] },
          { id: "c7b", type: "B", title: "Should I say something?", tags: ["Grammar", "Listening"] },
          { id: "c7c", type: "C", title: "Make up or fall out?", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 8, title: "Lost in Transit", emoji: "✈️", color: "#1098AD",
        tagline: "3% battery. New gate. No Marko.",
        unit: "Unit 8 · Going away", grammar: "going to, present continuous for future",
        blurb: "The trip to Manchester starts. So do the problems.",
        lessons: [
          { id: "c8a", type: "A", title: "Ready for take-off", tags: ["Vocabulary", "Reading"] },
          { id: "c8b", type: "B", title: "Plans vs reality", tags: ["Grammar", "Listening"] },
          { id: "c8c", type: "C", title: "The Manchester weekend", tags: ["Final Mission", "Reading"] }
        ]
      }
      ]
    },
    {
      n: 3, title: "Choices",
      blurb: "Money, food, health and a mystery animal in the Carpathians.",
      extras: [
        { after: 10, kind: "Culture", title: "Borshch vs Fish & Chips" },
        { after: 12, kind: "Life Skills", title: "Leave No Trace" },
        { after: 12, kind: "Review", title: "Survival Island" }
      ],
      cycles: [
      {
        n: 9, title: "Sixty Pounds", emoji: "💷", color: "#F08C00",
        tagline: "Two hours. No clothes. £60.",
        unit: "Unit 9 · Shop till you drop", grammar: "Present perfect, been / gone",
        blurb: "Marko's bag is lost, and dinner with Zoe's family is at seven.",
        lessons: [
          { id: "c9a", type: "A", title: "Emergency shopping", tags: ["Vocabulary", "Listening"] },
          { id: "c9b", type: "B", title: "Have you ever…?", tags: ["Grammar", "Reading"] },
          { id: "c9c", type: "C", title: "Take it back", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 10, title: "Blind Taste", emoji: "🍲", color: "#D6336C",
        tagline: "Blindfold on. Cameras rolling.",
        unit: "Unit 10 · Taste this!", grammar: "Present perfect vs past simple",
        blurb: "A cooking show, thirty guests and a borshch with a problem.",
        lessons: [
          { id: "c10a", type: "A", title: "Blind taste test", tags: ["Vocabulary", "Reading"] },
          { id: "c10b", type: "B", title: "Kitchen disaster", tags: ["Grammar", "Listening"] },
          { id: "c10c", type: "C", title: "Order up", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 11, title: "Med-Bot 2080", emoji: "🤖", color: "#3B5BDB",
        tagline: "The robot doctor has bad news.",
        unit: "Unit 11 · A healthy future", grammar: "will vs be going to",
        blurb: "In 2080 a robot makes predictions. Can you trust them?",
        lessons: [
          { id: "c11a", type: "A", title: "Hospital of the future", tags: ["Vocabulary", "Reading"] },
          { id: "c11b", type: "B", title: "Predictions", tags: ["Grammar", "Listening"] },
          { id: "c11c", type: "C", title: "Trust the machine?", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 12, title: "Camera Trap", emoji: "🐾", color: "#2B8A3E",
        tagline: "Something big is out there.",
        unit: "Unit 12 · Incredible wildlife", grammar: "Modals of probability",
        blurb: "A night in the Carpathians. A noise outside the tent. Tracks in the morning.",
        lessons: [
          { id: "c12a", type: "A", title: "Ranger's blog", tags: ["Vocabulary", "Reading"] },
          { id: "c12b", type: "B", title: "What made that noise?", tags: ["Grammar", "Listening"] },
          { id: "c12c", type: "C", title: "Wildlife detectives", tags: ["Final Mission", "Reading"] }
        ]
      }
      ]
    },
    {
      n: 4, title: "Screens",
      blurb: "A live stream, a film set, a viral app and a locked lab.",
      extras: [
        { after: 14, kind: "Culture", title: "Dream Factory" },
        { after: 16, kind: "Life Skills", title: "Privacy Settings" },
        { after: 16, kind: "Review", title: "Signal Live Quiz Stream" }
      ],
      cycles: [
      {
        n: 13, title: "48 Hours to Live", emoji: "🔴", color: "#E03131",
        tagline: "Live stream. Everything breaks.",
        unit: "Unit 13 · Mixed feelings", grammar: "just, already, yet",
        blurb: "The first live show is in two days. Nothing is ready.",
        lessons: [
          { id: "c13a", type: "A", title: "Mood tracker", tags: ["Vocabulary", "Listening"] },
          { id: "c13b", type: "B", title: "Countdown", tags: ["Grammar", "Reading"] },
          { id: "c13c", type: "C", title: "Live!", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 14, title: "Lights, Camera, Chaos", emoji: "🎬", color: "#5F3DC4",
        tagline: "Five days. No lead actor.",
        unit: "Unit 14 · On screen", grammar: "Relative clauses",
        blurb: "Nate's short film has a deadline — and a big problem.",
        lessons: [
          { id: "c14a", type: "A", title: "Genre roulette", tags: ["Vocabulary", "Reading"] },
          { id: "c14b", type: "B", title: "On set", tags: ["Grammar", "Listening"] },
          { id: "c14c", type: "C", title: "Pitch it!", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 15, title: "The App That Knows", emoji: "📲", color: "#0B7285",
        tagline: "It knows what you'll type next.",
        unit: "Unit 15 · Digital life", grammar: "Present simple passive",
        blurb: "Everyone installs a new app. Then Marko's account starts posting by itself.",
        lessons: [
          { id: "c15a", type: "A", title: "Install now?", tags: ["Vocabulary", "Listening"] },
          { id: "c15b", type: "B", title: "How it works", tags: ["Grammar", "Reading"] },
          { id: "c15c", type: "C", title: "Shut it down", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 16, title: "Escape the Lab", emoji: "🧪", color: "#5C940D",
        tagline: "The door is locked. Use science.",
        unit: "Unit 16 · Amazing science", grammar: "Zero and first conditional",
        blurb: "A science fair ends with the lab door locked.",
        lessons: [
          { id: "c16a", type: "A", title: "Science fair", tags: ["Vocabulary", "Reading"] },
          { id: "c16b", type: "B", title: "What if…?", tags: ["Grammar", "Listening"] },
          { id: "c16c", type: "C", title: "The way out", tags: ["Final Mission", "Reading"] }
        ]
      }
      ]
    },
    {
      n: 5, title: "Your Voice",
      blurb: "Talent, jobs on Mars, rumours and one very fake photo.",
      extras: [
        { after: 18, kind: "Culture", title: "Training Grounds" },
        { after: 20, kind: "Life Skills", title: "Truth Filter" },
        { after: 20, kind: "Review", title: "Grand Finale" }
      ],
      cycles: [
      {
        n: 17, title: "Hidden Talent", emoji: "🎨", color: "#AE3EC9",
        tagline: "Someone doesn't want you on stage.",
        unit: "Unit 17 · Talented", grammar: "Reported commands",
        blurb: "Zoe gets a gallery invitation — and an anonymous note.",
        lessons: [
          { id: "c17a", type: "A", title: "The gallery walk", tags: ["Vocabulary", "Listening"] },
          { id: "c17b", type: "B", title: "Rehearsal rules", tags: ["Grammar", "Reading"] },
          { id: "c17c", type: "C", title: "Talent night", tags: ["Final Mission", "Listening"] }
        ]
      },
      {
        n: 18, title: "Mars Needs You", emoji: "🚀", color: "#364FC7",
        tagline: "12 candidates. 6 seats.",
        unit: "Unit 18 · The world of work", grammar: "Second conditional",
        blurb: "It's 2050. A colony on Mars is hiring. You choose the crew.",
        lessons: [
          { id: "c18a", type: "A", title: "Job adverts", tags: ["Vocabulary", "Reading"] },
          { id: "c18b", type: "B", title: "If you were…", tags: ["Grammar", "Listening"] },
          { id: "c18c", type: "C", title: "Crew selection", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 19, title: "Notes in Books", emoji: "📚", color: "#9C36B5",
        tagline: "One of the notes is about you.",
        unit: "Unit 19 · The written word", grammar: "Reported speech",
        blurb: "Someone leaves notes in library books. Then a rumour starts.",
        lessons: [
          { id: "c19a", type: "A", title: "The book swap box", tags: ["Vocabulary", "Reading"] },
          { id: "c19b", type: "B", title: "Who said what?", tags: ["Grammar", "Listening"] },
          { id: "c19c", type: "C", title: "Set the record straight", tags: ["Final Mission", "Reading"] }
        ]
      },
      {
        n: 20, title: "Fake or Real?", emoji: "🕵️", color: "#1864AB",
        tagline: "A million people believed it.",
        unit: "Unit 20 · Seeing is believing", grammar: "Past simple passive",
        blurb: "A photo of a lynx in the city goes viral. Who made it?",
        lessons: [
          { id: "c20a", type: "A", title: "Viral", tags: ["Vocabulary", "Reading"] },
          { id: "c20b", type: "B", title: "How was it made?", tags: ["Grammar", "Listening"] },
          { id: "c20c", type: "C", title: "Truth check", tags: ["Final Mission", "Listening"] }
        ]
      }
      ]
    }
  ]
};
window.SIGNAL_TYPES = { A: "Discover", B: "Understand", C: "Use it" };
