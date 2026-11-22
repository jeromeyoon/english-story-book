// 교재(교과과정) 목록. 새 교재를 만들면 courses/<id>/ 폴더를 만들고 여기에 한 줄을 추가합니다.
const COURSES = [
  {
    id: "opposites-g1",
    grade: "초등 1학년",
    subject: "영어",
    title: "반대말 친구들",
    en: "Opposite Friends",
    desc: "반대말 30쌍을 엄마와 Mimi의 하루 동화 5권으로 읽고, 퀴즈와 말하기로 연습해요.",
    books: 5,
    pairs: 30,
    cover: "courses/opposites-g1/img/story/1-cover.jpg",
    color: "#ff8fa3",
  },
  {
    id: "readinggate",
    type: "daily",                       // daily = 날짜(Day)별 문장 외우기 교재
    grade: "초등 1학년",
    subject: "영어",
    title: "리딩게이트 오늘의 문장",
    en: "Daily Sentences",
    desc: "매일 2~3문장을 듣고, 따라 말하고, 빈칸 · 순서 맞추기로 외워요. 외운 문장은 잊을 때쯤 다시 복습해요.",
    days: 3,
    sentences: 9,
    cover: "courses/readinggate/img/mimi.png",
    color: "#ffb86b",
  },
];
