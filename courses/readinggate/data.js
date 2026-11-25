// 리딩게이트 — 날짜(Day)별 문장 외우기. 한 Day = 문장 2~4개.
// 형식: { en: 영어 문장, ko: 한국어 뜻, emoji: 그림이 없을 때(또는 그림 없는 문장) 보이는 이모지, scene: Codex에게 줄 장면 설명(영어) }
//  - scene 을 비우거나 빼면 그림 없이 "문장 카드"(이모지)로 학습합니다. 그림은 만들 수 있는 문장에만 그리면 됩니다.
//  - swap: (선택) 단어를 바꿔 말하는 연습. [{ w: 바꿀 단어, ko, e(이모지), alts: [{ w, ko, e }, ...] }] — 바뀐 문장 소리도 자동으로 만들어집니다.
//  - 그림 파일: courses/readinggate/img/story/d<Day>-<문장번호>.jpg 가 있으면 자동으로 보입니다.
// 소리 만들기: node tools/gen_audio.js readinggate   /   그림 지시서: node tools/gen_manifest.js readinggate
const DAYS = [
  { day: 1, title: "Shapes", ko: "도형으로 만들어요", emoji: "🔷", color: "#6cc4f2",
    setting: "a bright classroom table where two friends, Lilly (a little girl) and Kevin (a little boy), build a picture from paper shapes; both look the same in every picture (simple round faces, flat style)",
    sentences: [
      { en: "I'll put a square on top.", ko: "내가 맨 위에 네모를 놓을게.", emoji: "🟦",
        swap: [{ w: "square", ko: "네모", e: "🟦", alts: [{ w: "circle", ko: "동그라미", e: "⭕" }, { w: "triangle", ko: "세모", e: "🔺" }] }],
        scene: "A child's hands place one big blue square on top of a growing paper-shape picture (a house shape) on a table; Lilly or Kevin smiling next to it" },
      { en: "Lilly pulled out a circle.", ko: "릴리가 동그라미를 꺼냈어요.", emoji: "⭕",
        swap: [{ w: "circle", ko: "동그라미", e: "⭕", alts: [{ w: "square", ko: "네모", e: "🟦" }, { w: "triangle", ko: "세모", e: "🔺" }] }],
        scene: "Lilly (little girl) pulling a red circle out of a box of colorful paper shapes, with Kevin watching beside her" },
      { en: "Kevin adds smaller triangles.", ko: "케빈이 더 작은 세모를 붙여요.", emoji: "🔺",
        swap: [{ w: "triangles", ko: "세모들", e: "🔺", alts: [{ w: "circles", ko: "동그라미들", e: "⭕" }, { w: "squares", ko: "네모들", e: "🟦" }] }],
        scene: "Kevin (little boy) sticking several small yellow triangles onto a paper-shape picture, a big triangle next to them for size comparison" },
      { en: "That makes me sad.", ko: "그건 나를 슬프게 해.", emoji: "😢",
        swap: [{ w: "sad", ko: "슬픈", e: "😢", alts: [{ w: "happy", ko: "기쁜", e: "😊" }, { w: "angry", ko: "화난", e: "😠" }] }] },
    ] },
  { day: 2, title: "Fishing", ko: "낚시를 해요", emoji: "🎣", color: "#7bd88f",
    setting: "a sunny lakeside camping spot with a lake, trees and a campfire; characters: Lilly (little girl, pink shirt, pink hairclip), Kevin (little boy, green shirt), their Mom (a friendly adult woman), Lebron (a little boy, new friend) and Kitty (a small cute kitten); Lilly and Kevin look exactly like in the Day 1 pictures (simple round faces, flat style)",
    sentences: [
      { en: "Kevin throws his fishing line into the lake.", ko: "케빈이 낚싯줄을 호수에 던져요.", emoji: "🎣",
        swap: [{ w: "lake", ko: "호수", e: "🏞️", alts: [{ w: "river", ko: "강", e: "🌊" }, { w: "pond", ko: "연못", e: "🦆" }] }],
        scene: "Kevin (little boy, green shirt) standing at the edge of a lake, swinging his fishing rod forward so the fishing line flies out over the water; Lilly watching beside him" },
      { en: "She reels in her line quickly.", ko: "그녀는 낚싯줄을 빠르게 감아요.", emoji: "⚡",
        swap: [{ w: "quickly", ko: "빠르게", e: "⚡", alts: [{ w: "slowly", ko: "천천히", e: "🐢" }, { w: "carefully", ko: "조심조심", e: "🤲" }] }],
        scene: "Lilly (little girl, pink shirt) turning the reel of her fishing rod fast with a small fish jumping at the end of the line, motion lines on the reel, excited face" },
      { en: "Mom roasts the fish over the fire.", ko: "엄마가 불 위에서 생선을 구워요.", emoji: "🔥",
        swap: [{ w: "fish", ko: "생선", e: "🐟", alts: [{ w: "corn", ko: "옥수수", e: "🌽" }, { w: "potato", ko: "감자", e: "🥔" }] }],
        scene: "Mom (friendly adult woman) holding a stick with a fish over a small campfire, Lilly and Kevin sitting nearby watching happily" },
      { en: "Lebron throws Kitty a piece of fish.", ko: "르브론이 키티에게 생선 한 조각을 던져 줘요.", emoji: "🐱",
        swap: [{ w: "fish", ko: "생선", e: "🐟", alts: [{ w: "bread", ko: "빵", e: "🍞" }, { w: "cake", ko: "케이크", e: "🍰" }] }],
        scene: "Lebron (a little boy) tossing a small piece of fish through the air toward Kitty, a cute kitten with open paws ready to catch it, camp and trees in the background" },
    ] },
  { day: 3, title: "A Bus Trip", ko: "버스를 타고 호수로", emoji: "🚌", color: "#ff8fa3",
    setting: "a yellow bus, a sunny country path and a lakeside where animals gather; characters: Lilly (little girl, pink shirt, pink hairclip) and Kevin (little boy, green shirt) look exactly like in the Day 1 and Day 2 pictures (simple round faces, flat style)",
    sentences: [
      { en: "I hop on the bus.", ko: "나는 버스에 올라타요.", emoji: "🚌",
        swap: [{ w: "hop", ko: "폴짝 올라타다", e: "🐇", alts: [{ w: "jump", ko: "뛰어오르다", e: "🦘" }, { w: "climb", ko: "기어오르다", e: "🧗" }] }],
        scene: "Kevin (little boy, green shirt) hopping up the steps of a big yellow bus with a happy jump, Lilly waiting behind him, a friendly bus driver visible in the bus window" },
      { en: "Let's find out.", ko: "알아보자.", emoji: "🔍",
        scene: "Lilly and Kevin leaning forward with curious wide eyes, Lilly holding a big magnifying glass up, looking out of a bus window toward the lake in the distance" },
      { en: "He spots animals lining up.", ko: "그는 동물들이 줄을 서 있는 것을 발견해요.", emoji: "🦆",
        swap: [{ w: "animals", ko: "동물들", e: "🐾", alts: [{ w: "ducks", ko: "오리들", e: "🦆" }, { w: "birds", ko: "새들", e: "🐦" }] }],
        scene: "Kevin (little boy, green shirt) pointing with surprise at a row of cute animals (a duckling, a rabbit, a deer, a turtle) standing in a neat line beside a lake" },
      { en: "I skip to the lake.", ko: "나는 깡충깡충 호수로 가요.", emoji: "🏞️",
        swap: [{ w: "skip", ko: "깡충깡충 가다", e: "🦘", alts: [{ w: "run", ko: "달리다", e: "🏃" }, { w: "walk", ko: "걷다", e: "🚶" }] }],
        scene: "Lilly (little girl, pink shirt) skipping happily along a sunny path toward a sparkling blue lake, arms swinging, flowers along the path" },
    ] },
];
