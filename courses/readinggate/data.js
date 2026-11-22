// 리딩게이트 — 날짜(Day)별 문장 외우기. 한 Day = 문장 2~4개.
// 형식: { en: 영어 문장, ko: 한국어 뜻, emoji: 그림이 없을 때(또는 그림 없는 문장) 보이는 이모지, scene: Codex에게 줄 장면 설명(영어) }
//  - scene 을 비우거나 빼면 그림 없이 "문장 카드"(이모지)로 학습합니다. 그림은 만들 수 있는 문장에만 그리면 됩니다.
//  - 그림 파일: courses/readinggate/img/story/d<Day>-<문장번호>.jpg 가 있으면 자동으로 보입니다.
// 소리 만들기: node tools/gen_audio.js readinggate   /   그림 지시서: node tools/gen_manifest.js readinggate
const DAYS = [
  { day: 1, title: "Shapes", ko: "도형으로 만들어요", emoji: "🔷", color: "#6cc4f2",
    setting: "a bright classroom table where two friends, Lilly (a little girl) and Kevin (a little boy), build a picture from paper shapes; both look the same in every picture (simple round faces, flat style)",
    sentences: [
      { en: "I'll put a square on top.", ko: "내가 맨 위에 네모를 놓을게.", emoji: "🟦",
        scene: "A child's hands place one big blue square on top of a growing paper-shape picture (a house shape) on a table; Lilly or Kevin smiling next to it" },
      { en: "Lilly pulled out a circle.", ko: "릴리가 동그라미를 꺼냈어요.", emoji: "⭕",
        scene: "Lilly (little girl) pulling a red circle out of a box of colorful paper shapes, with Kevin watching beside her" },
      { en: "Kevin adds smaller triangles.", ko: "케빈이 더 작은 세모를 붙여요.", emoji: "🔺",
        scene: "Kevin (little boy) sticking several small yellow triangles onto a paper-shape picture, a big triangle next to them for size comparison" },
      { en: "That makes me sad.", ko: "그건 나를 슬프게 해.", emoji: "😢" },
    ] },
];
