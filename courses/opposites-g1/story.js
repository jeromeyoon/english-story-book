// 동화책 데이터: 엄마(mom)와 아이(Mimi)의 하루. 단원마다 한 권, 쌍(pair)마다 한 페이지.
// 페이지는 앞 페이지에 이어지는 한 장면(Next / Then / Now ...)이고,
// 같은 물건·같은 상황 안에서 반대말이 자연스럽게 나옵니다.
// lines: 앞쪽 대사는 먼저 읽고, 마지막 줄의 ___ 를 아이가 고릅니다(정답 = pair.b, 즉 앞에서 말한 단어의 반대말).
// scene: 그림이 없을 때 보여 줄 임시 이모지 / 그림은 assets/img/story/<책>-<쪽>.png 로 자동 교체
const STORIES = [
  { unit: 1, title: "A Day at the Zoo", ko: "엄마와 동물원에 간 날", cover: "🦁", setting: "a sunny zoo",
    panels: [
      { pair: "big-small", scene: "🐘🐭", lines: [["mom", "Welcome to the zoo, Mimi! Look, the elephant is big."], ["mimi", "Wow! The mouse next to it is ___!"]] },
      { pair: "huge-tiny", scene: "🐋🐟", lines: [["mom", "Next, the aquarium! The whale is huge!"], ["mimi", "Mom, look at the little fish. It is ___!"]] },
      { pair: "tall-short", scene: "🦒🐰", lines: [["mom", "Now let's see the giraffe. It is tall."], ["mimi", "I am ___, Mom. I can't see it!"]] },
      { pair: "long-short", scene: "🐍🪱", lines: [["mom", "Up here, I will lift you. Look! The snake is long."], ["mimi", "And the baby snake is ___!"]] },
      { pair: "thick-thin", scene: "🧥🧣", lines: [["mom", "Brrr, it is getting cold. Put on my thick coat."], ["mimi", "Thank you! My coat is ___."]] },
      { pair: "wide-narrow", scene: "🛣️🚶", lines: [["mom", "Time to go home. This road is wide."], ["mimi", "But the path to the bus is ___."]] },
    ] },
  { unit: 2, title: "Picnic with Mom", ko: "엄마와 소풍", cover: "🧺", setting: "a green park picnic",
    panels: [
      { pair: "heavy-light", scene: "🧺🧣", lines: [["mom", "We're at the park! This picnic basket is heavy."], ["mimi", "I will carry the blanket. It is ___."]] },
      { pair: "full-empty", scene: "🥤📦", lines: [["mom", "Let's eat. The water bottle is full."], ["mimi", "Oh no! The snack box is ___!"]] },
      { pair: "deep-shallow", scene: "🌊💦", lines: [["mom", "Be careful at the lake. It is deep."], ["mimi", "But the little stream is ___, right?"]] },
      { pair: "high-low", scene: "🪁🌱", lines: [["mom", "Now let's fly your kite. Wow, it is high!"], ["mimi", "Oh no! Now it is ___!"]] },
      { pair: "alot-some", scene: "🍓🍓", lines: [["mom", "Look at these! We have a lot of strawberries."], ["mimi", "I only want ___, Mom."]] },
      { pair: "more-less", scene: "🧃🥤", lines: [["mom", "Do you want more juice, Mimi?"], ["mimi", "No, thank you. I want ___ juice."]] },
    ] },
  { unit: 3, title: "Morning Rush", ko: "바쁜 아침 등굣길", cover: "🚌", setting: "a morning street on the way to school",
    panels: [
      { pair: "early-late", scene: "⏰🌙", lines: [["mom", "Good morning, Mimi! Get up early today!"], ["mimi", "But I went to bed ___ last night."]] },
      { pair: "fast-slow", scene: "🏃🐢", lines: [["mom", "Now let's walk fast, or we will miss the bus!"], ["mimi", "I can't, Mom. I am ___."]] },
      { pair: "far-near", scene: "🚏🏫", lines: [["mom", "Then we go to the bus stop. It is far."], ["mimi", "But the school is ___!"]] },
      { pair: "right-left", scene: "👉👈", lines: [["mom", "Next, turn right at the corner."], ["mimi", "And after that, turn ___?"]] },
      { pair: "open-closed", scene: "🏫🏪", lines: [["mom", "Look! The school gate is open."], ["mimi", "But the shop is ___."]] },
      { pair: "tight-loose", scene: "👟🪢", lines: [["mom", "Wait, tie your shoes tight."], ["mimi", "Oh! My lace is ___."]] },
    ] },
  { unit: 4, title: "A Rainy Day", ko: "비 오는 날 집에서", cover: "☔", setting: "a cozy home on a rainy day",
    panels: [
      { pair: "wet-dry", scene: "☔🧺", lines: [["mom", "Mimi, you are wet! Here is a towel."], ["mimi", "Thank you, Mom. Now I am ___."]] },
      { pair: "hot-cold", scene: "🍲🧃", lines: [["mom", "Now lunch. The soup is hot. Blow on it!"], ["mimi", "I like my juice ___."]] },
      { pair: "dark-bright", scene: "🌧️💡", lines: [["mom", "It is getting dark outside."], ["mimi", "Let's turn on the lamp. It is ___!"]] },
      { pair: "loud-quiet", scene: "⚡🤫", lines: [["mom", "Boom! The thunder is loud."], ["mimi", "Don't worry. Now it is ___."]] },
      { pair: "clean-dirty", scene: "🧼🥾", lines: [["mom", "Now wash up. I want your hands clean."], ["mimi", "Look at my boots. They are ___."]] },
      { pair: "old-new", scene: "☂️🌂", lines: [["mom", "This umbrella is old."], ["mimi", "Can we buy a ___ one?"]] },
    ] },
  { unit: 5, title: "Evening Talk", ko: "저녁에 엄마와 이야기", cover: "🌙", setting: "a warm evening living room at home",
    panels: [
      { pair: "happy-sad", scene: "😀😢", lines: [["mom", "Welcome home, Mimi! I am so happy to see you. How was school?"], ["mimi", "I was ___ at lunch. I dropped my cookie."]] },
      { pair: "great-terrible", scene: "🎨📝", lines: [["mom", "Oh no! Well, the picture you drew is great!"], ["mimi", "Thanks! But my math test was ___."]] },
      { pair: "interesting-boring", scene: "📖➗", lines: [["mom", "Was story time interesting?"], ["mimi", "Yes! But math class was ___."]] },
      { pair: "old-young", scene: "👴👶", lines: [["mom", "Now it's dinner time. Grandpa is old, but he is strong."], ["mimi", "And my baby cousin is ___."]] },
      { pair: "rich-poor", scene: "👑🌾", lines: [["mom", "Let's read a book after dinner. In this story, the king is rich."], ["mimi", "And the farmer is ___."]] },
      { pair: "right-wrong", scene: "✅❌", lines: [["mom", "Last, let's check your homework. This answer is right!"], ["mimi", "And this one is ___."]] },
    ] },
];
