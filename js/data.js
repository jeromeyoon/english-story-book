// 단어 데이터 (대광초 1학년 수행평가: Opposite Pairs 30쌍, Practice Book p.46~55)
// 형식: [id, unit, [영어단어들], 예문, 이모지(임시그림), 뜻, ...반대쪽 동일]
// - 같은 단어가 여러 쌍에 나오면(short, light, old, right) 앱이 자동으로 모든 정답을 인정합니다.
// - 그림은 assets/img/<id>-a.png / <id>-b.png 가 있으면 이모지 대신 자동 표시됩니다.
const UNITS = [
  { id: 1, name: "Size", ko: "크기와 길이", emoji: "📏", color: "#ff8fa3" },
  { id: 2, name: "Amount", ko: "무게와 양", emoji: "⚖️", color: "#ffb86b" },
  { id: 3, name: "Move & Place", ko: "속도와 위치", emoji: "🏃", color: "#7bd88f" },
  { id: 4, name: "Feel", ko: "느낌과 상태", emoji: "🌡️", color: "#6cc4f2" },
  { id: 5, name: "Mood", ko: "기분과 평가", emoji: "😀", color: "#b79cf5" },
];

const _P = (id, unit, aw, as, ae, ak, bw, bs, be, bk) => ({
  id, unit,
  a: { w: aw, s: as, e: ae, k: ak, pic: id + "-a" },
  b: { w: bw, s: bs, e: be, k: bk, pic: id + "-b" },
});

const PAIRS = [
  // Unit 1
  _P("big-small", 1, ["big", "large"], "The elephant is big.", "🐘", "큰", ["small"], "The mouse is small.", "🐭", "작은"),
  _P("huge-tiny", 1, ["huge"], "The whale is huge.", "🐋", "아주 큰", ["tiny"], "The ant is tiny.", "🐜", "아주 작은"),
  _P("tall-short", 1, ["tall"], "The giraffe is tall.", "🦒", "키가 큰", ["short"], "The dog is short.", "🐕", "키가 작은"),
  _P("long-short", 1, ["long"], "The snake is long.", "🐍", "긴", ["short"], "The crayon is short.", "🖍️", "짧은"),
  _P("thick-thin", 1, ["thick"], "The book is thick.", "📚", "두꺼운", ["thin"], "The paper is thin.", "📄", "얇은"),
  _P("wide-narrow", 1, ["wide"], "The road is wide.", "🛣️", "넓은", ["narrow"], "The bridge is narrow.", "🌉", "좁은"),
  // Unit 2
  _P("heavy-light", 2, ["heavy"], "The rock is heavy.", "🪨", "무거운", ["light"], "The feather is light.", "🪶", "가벼운"),
  _P("full-empty", 2, ["full"], "The cup is full.", "🥛", "가득 찬", ["empty"], "The box is empty.", "📦", "빈"),
  _P("deep-shallow", 2, ["deep"], "The sea is deep.", "🌊", "깊은", ["shallow"], "The puddle is shallow.", "💧", "얕은"),
  _P("high-low", 2, ["high"], "The kite is high.", "🪁", "높은", ["low"], "The ball is low.", "⚽", "낮은"),
  _P("alot-some", 2, ["a lot of"], "I have a lot of candy.", "🍬", "많은", ["some"], "I have some candy.", "🍭", "조금의"),
  _P("more-less", 2, ["more"], "I have more juice.", "🧃", "더 많은", ["less"], "You have less juice.", "🥤", "더 적은"),
  // Unit 3
  _P("fast-slow", 3, ["fast"], "The rabbit is fast.", "🐇", "빠른", ["slow"], "The turtle is slow.", "🐢", "느린"),
  _P("early-late", 3, ["early"], "I get up early.", "🌅", "일찍", ["late"], "I go to bed late.", "🌙", "늦게"),
  _P("far-near", 3, ["far"], "The moon is far.", "🌕", "먼", ["near"], "The tree is near.", "🌳", "가까운"),
  _P("right-left", 3, ["right"], "Raise your right hand.", "👉", "오른쪽", ["left"], "Raise your left hand.", "👈", "왼쪽"),
  _P("open-closed", 3, ["open"], "The door is open.", "🚪", "열린", ["closed"], "The window is closed.", "🪟", "닫힌"),
  _P("tight-loose", 3, ["tight"], "The belt is tight.", "🪢", "꽉 끼는", ["loose"], "The sock is loose.", "🧦", "헐렁한"),
  // Unit 4
  _P("hot-cold", 4, ["hot"], "The soup is hot.", "🍲", "뜨거운", ["cold"], "The ice cream is cold.", "🍦", "차가운"),
  _P("wet-dry", 4, ["wet"], "The dog is wet.", "🐶", "젖은", ["dry"], "The towel is dry.", "🧺", "마른"),
  _P("clean-dirty", 4, ["clean"], "My hands are clean.", "🧼", "깨끗한", ["dirty"], "My shoes are dirty.", "🥾", "더러운"),
  _P("dark-bright", 4, ["dark"], "The night is dark.", "🌃", "어두운", ["bright", "light"], "The sun is bright.", "☀️", "밝은"),
  _P("loud-quiet", 4, ["loud"], "The drum is loud.", "🥁", "시끄러운", ["quiet"], "The library is quiet.", "🤫", "조용한"),
  _P("old-new", 4, ["old"], "The shoes are old.", "👟", "낡은", ["new"], "The bag is new.", "🎒", "새"),
  // Unit 5
  _P("happy-sad", 5, ["happy"], "I am happy.", "😀", "행복한", ["sad"], "I am sad.", "😢", "슬픈"),
  _P("great-terrible", 5, ["great"], "The movie is great.", "🎬", "아주 좋은", ["terrible"], "The storm is terrible.", "⛈️", "끔찍한"),
  _P("interesting-boring", 5, ["interesting"], "The game is interesting.", "🎮", "재미있는", ["boring"], "The homework is boring.", "📝", "지루한"),
  _P("rich-poor", 5, ["rich"], "The king is rich.", "👑", "부유한", ["poor"], "The man is poor.", "🥺", "가난한"),
  _P("old-young", 5, ["old"], "Grandpa is old.", "👴", "나이 든", ["young"], "The baby is young.", "👶", "어린"),
  _P("right-wrong", 5, ["right"], "That answer is right.", "✅", "맞는", ["wrong"], "That answer is wrong.", "❌", "틀린"),
];
