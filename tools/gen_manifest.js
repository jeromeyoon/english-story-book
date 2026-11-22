#!/usr/bin/env node
// 단어/동화 데이터(js/data.js, js/story.js)에서 그림 목록을 만들고, 아직 없는 그림만 art/BRIEF.md 로 정리합니다.
//   node tools/gen_manifest.js <교재id>   예) node tools/gen_manifest.js opposites-g1
//   → courses/<id>/manifest.json(전체 목록) + art/BRIEF.md(없는 그림만)
const fs = require("fs");
const ID = process.argv[2] || "opposites-g1", C = `courses/${ID}`;
const hasStory = fs.existsSync(`${C}/story.js`);
const src = fs.readFileSync(`${C}/data.js`, "utf8") + (hasStory ? fs.readFileSync(`${C}/story.js`, "utf8") : "") +
  ";module.exports={PAIRS:typeof PAIRS==='undefined'?[]:PAIRS,STORIES:typeof STORIES==='undefined'?[]:STORIES,DAYS:typeof DAYS==='undefined'?[]:DAYS}";
const m = { exports: {} }; new Function("module", src)(m);
const { PAIRS, STORIES, DAYS } = m.exports;
const byId = Object.fromEntries(PAIRS.map(p => [p.id, p]));
const items = [];
const char = (file, desc) => items.push({ kind: "character", file, size: "512x512", desc });
char("mimi.png", "Mimi, white child bunny, pink inner ears, blue overalls, waving, friendly smile");
char("mimi-happy.png", "Mimi jumping with joy (correct answer)");
char("mimi-oops.png", "Mimi tilting head, small sweat drop, encouraging (wrong answer)");
char("mom.png", "Mimi's mom: adult white bunny, pink inner ears, yellow apron, warm kind smile");
for (const S of STORIES) {
  items.push({ kind: "story", file: `story/${S.unit}-cover.png`, size: "1024x768", desc: `Book cover: "${S.title}". Mom bunny and Mimi (child bunny) in ${S.setting}. No text.` });
  S.panels.forEach((pn, i) => {
    const p = byId[pn.pair];
    items.push({ kind: "story", file: `story/${S.unit}-${i + 1}.png`, size: "1024x768", pair: pn.pair,
      desc: `Comic panel (4:3, full background, no text, keep top 35% calm for speech bubbles) in ${S.setting}. Mom bunny and Mimi (child bunny) are in the scene. The two opposite words must be visible in the SAME scene (follow the dialogue): ${p.a.w[0]} vs ${p.b.w[0]}`,
      dialogue: pn.lines.map(l => l[0] + ": " + l[1]), placeholder: pn.scene });
  });
}
// 날짜별 문장 교재: 문장마다 장면 1장 (story/d<Day>-<번호>.png)
for (const D of DAYS) D.sentences.forEach((x, i) => x.scene && items.push({ kind: "story", file: `story/d${D.day}-${i + 1}.png`, size: "1024x768",
  desc: `Comic panel (4:3, full background, no text, keep top 30% calm) set in ${D.setting}. Mimi (child bunny) and, if natural, Mom bunny. Show this sentence clearly: ${x.scene}`,
  dialogue: [x.en + " (" + x.ko + ")"], placeholder: x.emoji }));
for (const p of PAIRS) for (const s of ["a", "b"]) {
  const x = p[s];
  items.push({ kind: "word", file: `${p.id}-${s}.png`, size: "512x512", word: x.w.join("/"),
    desc: x.s.replace(/\.$/, "") + " — single object scene that makes '" + x.w[0] + "' obvious", placeholder: x.e });
}
// 이미 있는 그림인지 확인 (동화 장면은 앱에 JPEG, 원본은 art/originals)
const exists = (it) => {
  if (it.kind === "story") {
    const base = it.file.replace(/\.png$/, "");
    return fs.existsSync(`${C}/img/${base}.jpg`) || fs.existsSync(`art/originals/${ID}/${it.file}`) || fs.existsSync(`${C}/img/${it.file}`);
  }
  return fs.existsSync(`${C}/img/${it.file}`);
};
items.forEach(it => it.done = exists(it));
const counts = {}; items.forEach(i => { counts[i.kind] = counts[i.kind] || { total: 0, missing: 0 }; counts[i.kind].total++; if (!i.done) counts[i.kind].missing++; });
fs.writeFileSync(`${C}/manifest.json`, JSON.stringify({ dir: `${C}/img/`, style: "see art/STYLE.md", priority: ["character", "story", "word"], counts, items }, null, 1));

const missing = items.filter(i => !i.done);
let md = `# Codex 작업 지시서 (자동 생성: node tools/gen_manifest.js)\n\n` +
  `먼저 \`art/STYLE.md\`를 읽고 스타일을 정확히 따르세요. 캐릭터 기준 그림은 \`${C}/img/mimi.png\`, \`${C}/img/mom.png\`입니다.\n\n` +
  `## 규칙\n- 아래 **없는 그림만** 만듭니다. 이미 있는 파일은 건드리지 마세요.\n- 단어 그림: 512×512 투명 PNG → \`${C}/img/<file>\`\n` +
  `- 동화 장면: 1024×768 PNG → \`${C}/img/<file>\` 로 저장(앱 쪽에서 JPEG로 변환하니 PNG로 두면 됨). 글자 금지, 위쪽 35%는 단순하게. 아래 dialogue(말하거나 읽는 문장)에 맞게 인물의 행동/표정이 보이게. 반대말 교재는 반대 개념 두 가지가 한 장면에 함께 보이게.\n` +
  `- 코드(js/css/html)는 수정 금지. 끝나면 만든 파일 목록과 크기를 보고하세요.\n\n` +
  `## 만들어야 할 그림 (${missing.length}개)\n`;
if (!missing.length) md += "\n없음 — 모든 그림이 준비되었습니다.\n";
for (const k of ["character", "story", "word"]) {
  const g = missing.filter(i => i.kind === k); if (!g.length) continue;
  md += `\n### ${k} (${g.length})\n`;
  for (const i of g) md += `- \`${i.file}\` (${i.size}) — ${i.desc}${i.dialogue ? `\n  - dialogue: ${i.dialogue.join(" / ")}` : ""}\n`;
}
fs.writeFileSync(`art/BRIEF-${ID}.md`, md);
console.log(JSON.stringify(counts), "missing:", missing.length);
