// 동화책(만화) 데이터: 단원마다 한 권, 쌍(pair)마다 한 페이지.
// lines[0] = 설명 대사(그림과 함께 읽기), lines[1] = 빈칸(___) 대사 → 아이가 반대말을 고름 (정답 = pair.b)
// scene: 그림이 없을 때 보여 줄 임시 이모지 장면 / 그림은 assets/img/story/<unit>-<n>.png 로 자동 교체
const STORIES = [
  { unit: 1, title: "The Big Zoo Day", ko: "동물원에 간 날", cover: "🦁", setting: "a sunny zoo",
    panels: [
      { pair: "big-small", scene: "🐘🐭", lines: [["mimi", "Look, Bobo! The elephant is big!"], ["bobo", "Wow! And the mouse is ___!"]] },
      { pair: "huge-tiny", scene: "🐋🐜", lines: [["bobo", "A whale! It is huge!"], ["mimi", "Look at the ant. It is ___!"]] },
      { pair: "tall-short", scene: "🦒🐕", lines: [["mimi", "The giraffe is tall."], ["bobo", "My dog is ___."]] },
      { pair: "long-short", scene: "🐍🖍️", lines: [["bobo", "The snake is long."], ["mimi", "My crayon is ___."]] },
      { pair: "thick-thin", scene: "📚📄", lines: [["mimi", "This zoo book is thick."], ["bobo", "That paper map is ___."]] },
      { pair: "wide-narrow", scene: "🛣️🌉", lines: [["bobo", "The road is wide."], ["mimi", "The bridge is ___."]] },
    ] },
  { unit: 2, title: "Mimi's Picnic", ko: "미미의 소풍", cover: "🧺", setting: "a green park picnic",
    panels: [
      { pair: "heavy-light", scene: "🪨🪶", lines: [["bobo", "This rock is heavy!"], ["mimi", "This feather is ___."]] },
      { pair: "full-empty", scene: "🥛📦", lines: [["mimi", "My cup is full."], ["bobo", "My box is ___."]] },
      { pair: "deep-shallow", scene: "🌊💧", lines: [["bobo", "The sea is deep."], ["mimi", "The puddle is ___."]] },
      { pair: "high-low", scene: "🪁⚽", lines: [["mimi", "My kite is high!"], ["bobo", "My ball is ___."]] },
      { pair: "alot-some", scene: "🍬🍭", lines: [["bobo", "I have a lot of candy."], ["mimi", "I have ___ candy."]] },
      { pair: "more-less", scene: "🧃🥤", lines: [["mimi", "I have more juice."], ["bobo", "I have ___ juice."]] },
    ] },
  { unit: 3, title: "Race Day", ko: "달리기 대회 날", cover: "🏁", setting: "a school sports field",
    panels: [
      { pair: "fast-slow", scene: "🐇🐢", lines: [["mimi", "The rabbit is fast!"], ["bobo", "The turtle is ___."]] },
      { pair: "early-late", scene: "🌅🌙", lines: [["bobo", "I get up early."], ["mimi", "I go to bed ___."]] },
      { pair: "far-near", scene: "🌕🌳", lines: [["mimi", "The moon is far."], ["bobo", "The tree is ___."]] },
      { pair: "right-left", scene: "👉👈", lines: [["bobo", "Raise your right hand!"], ["mimi", "Now raise your ___ hand!"]] },
      { pair: "open-closed", scene: "🚪🪟", lines: [["mimi", "The door is open."], ["bobo", "The window is ___."]] },
      { pair: "tight-loose", scene: "🪢🧦", lines: [["bobo", "My belt is tight."], ["mimi", "My sock is ___."]] },
    ] },
  { unit: 4, title: "Bobo's Busy Day", ko: "보보의 바쁜 하루", cover: "🏠", setting: "Bobo's cozy house and garden",
    panels: [
      { pair: "hot-cold", scene: "🍲🍦", lines: [["bobo", "The soup is hot!"], ["mimi", "The ice cream is ___."]] },
      { pair: "wet-dry", scene: "🐶🧺", lines: [["mimi", "My dog is wet."], ["bobo", "The towel is ___."]] },
      { pair: "clean-dirty", scene: "🧼🥾", lines: [["bobo", "My hands are clean."], ["mimi", "My shoes are ___."]] },
      { pair: "dark-bright", scene: "🌃☀️", lines: [["mimi", "The night is dark."], ["bobo", "The sun is ___."]] },
      { pair: "loud-quiet", scene: "🥁🤫", lines: [["bobo", "The drum is loud."], ["mimi", "The library is ___."]] },
      { pair: "old-new", scene: "👟🎒", lines: [["mimi", "My shoes are old."], ["bobo", "My bag is ___."]] },
    ] },
  { unit: 5, title: "The Mood Party", ko: "기분 파티", cover: "🎉", setting: "a colorful birthday party",
    panels: [
      { pair: "happy-sad", scene: "😀😢", lines: [["mimi", "I am happy!"], ["bobo", "I am ___."]] },
      { pair: "great-terrible", scene: "🎬⛈️", lines: [["bobo", "The movie is great!"], ["mimi", "The storm is ___."]] },
      { pair: "interesting-boring", scene: "🎮📝", lines: [["mimi", "The game is interesting."], ["bobo", "The homework is ___."]] },
      { pair: "rich-poor", scene: "👑🥺", lines: [["bobo", "The king is rich."], ["mimi", "The man is ___."]] },
      { pair: "old-young", scene: "👴👶", lines: [["mimi", "Grandpa is old."], ["bobo", "The baby is ___."]] },
      { pair: "right-wrong", scene: "✅❌", lines: [["bobo", "That answer is right!"], ["mimi", "That answer is ___."]] },
    ] },
];
