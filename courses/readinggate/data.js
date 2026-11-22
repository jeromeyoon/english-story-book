// 리딩게이트 — 날짜(Day)별 문장 외우기. 한 Day = 문장 2~3개.
// ★ 아래 문장은 구조를 확인하기 위한 "샘플"입니다. 아이 교재 문장을 약간만 바꿔서 이 형식대로 바꿔 넣으세요.
// 형식: { en: 영어 문장, ko: 한국어 뜻, emoji: 그림이 없을 때 임시 이모지, scene: Codex에게 줄 장면 설명(영어) }
// 그림은 courses/readinggate/img/story/d<Day>-<번호>.jpg 가 있으면 자동으로 보입니다.
// 소리 만들기: node tools/gen_audio.js readinggate   /   그림 지시서: node tools/gen_manifest.js readinggate
const DAYS = [
  { day: 1, title: "Good Morning", ko: "아침에 일어나서", emoji: "🌅", color: "#ffb86b", setting: "Mimi's bedroom and kitchen in the morning",
    sentences: [
      { en: "I wake up at seven.", ko: "나는 7시에 일어나요.", emoji: "⏰", scene: "Mimi waking up in bed, stretching, a clock on the wall showing seven o'clock, morning sun through the window" },
      { en: "I brush my teeth.", ko: "나는 이를 닦아요.", emoji: "🪥", scene: "Mimi brushing her teeth at the bathroom sink, toothbrush in hand, foam bubbles, Mom smiling behind her" },
      { en: "I eat breakfast with Mom.", ko: "나는 엄마와 아침을 먹어요.", emoji: "🥣", scene: "Mimi and Mom bunny eating breakfast together at the kitchen table, bread and milk" },
    ] },
  { day: 2, title: "At School", ko: "학교에서", emoji: "🏫", color: "#6cc4f2", setting: "a school bus stop and a bright classroom",
    sentences: [
      { en: "I go to school by bus.", ko: "나는 버스를 타고 학교에 가요.", emoji: "🚌", scene: "Mimi sitting by the window of a yellow school bus, waving, the school building ahead" },
      { en: "I like my teacher.", ko: "나는 우리 선생님이 좋아요.", emoji: "👩‍🏫", scene: "Mimi smiling at a kind teacher (a friendly animal teacher) in a classroom, a heart above Mimi" },
      { en: "We read books together.", ko: "우리는 함께 책을 읽어요.", emoji: "📚", scene: "Mimi and two classmates (small animals) sitting together reading picture books in a classroom corner" },
    ] },
  { day: 3, title: "After School", ko: "학교가 끝난 뒤", emoji: "🌙", color: "#b79cf5", setting: "a park, Mimi's desk at home, and Mimi's bedroom at night",
    sentences: [
      { en: "I play with my friends.", ko: "나는 친구들과 놀아요.", emoji: "⚽", scene: "Mimi playing with two friends (small animals) in a sunny park, kicking a ball" },
      { en: "I do my homework.", ko: "나는 숙제를 해요.", emoji: "✏️", scene: "Mimi doing homework at her desk with a pencil and notebook, Mom bunny watching kindly, a lamp on" },
      { en: "I go to bed at nine.", ko: "나는 9시에 자요.", emoji: "🛏️", scene: "Mimi in pajamas getting into bed, moon outside the window, a clock showing nine o'clock, Mom tucking her in" },
    ] },
];
