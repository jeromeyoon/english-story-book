#!/usr/bin/env node
// 앱이 읽어 주는 모든 영어 문장을 Kokoro(로컬 AI 음성)로 미리 녹음해 courses/<id>/audio/*.m4a 로 만듭니다.
// 기기의 음성 기능에 의존하지 않아 iPad/휴대폰/오프라인에서도 소리가 납니다.
// 준비: brew install uv espeak-ng ffmpeg; uv venv --python 3.12 $KOKORO_VENV; uv pip install --python $KOKORO_VENV/bin/python kokoro soundfile
//   KOKORO_VENV 기본값: /Volumes/T7/Build/claude-tmp/kokoro/.venv
//   node tools/gen_audio.js <교재id>      → 없는 파일만 새로 만듭니다
const fs = require("fs"), cp = require("child_process"), os = require("os"), path = require("path");
const ID = process.argv[2] || "opposites-g1", C = `courses/${ID}`, OUT = `${C}/audio`;
const src = fs.readFileSync(`${C}/data.js`, "utf8") + fs.readFileSync(`${C}/story.js`, "utf8") + ";module.exports={PAIRS,STORIES}";
const m = { exports: {} }; new Function("module", src)(m);
const { PAIRS, STORIES } = m.exports;
const slug = t => t.toLowerCase().replace(/___/g, " blank ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); // app.js 와 같은 규칙
const blank = side => side.s.replace(new RegExp(side.w[0], "i"), "___");
// 목소리: 엄마·진행(기본)=af_heart, 아이(Mimi)=af_heart 를 15% 높인 소리. 바꾸려면 아래를 고치고 audio/ 의 해당 파일을 지운 뒤 다시 실행
const VOICES = { default: { voice: "af_heart", pitch: 1, speed: 0.9 }, mimi: { voice: "af_heart", pitch: 1.15, speed: 0.9 } };
const VENV = process.env.KOKORO_VENV || "/Volumes/T7/Build/claude-tmp/kokoro/.venv";
const texts = new Set();           // 기본 목소리(엄마/진행)
const mimiTexts = new Set();       // 아이(Mimi) 목소리 — 파일명 앞에 mimi_ 가 붙음
for (const p of PAIRS) for (const side of [p.a, p.b]) { side.w.forEach(w => texts.add(w)); texts.add(side.s); texts.add(blank(side)); }
const byId = Object.fromEntries(PAIRS.map(p => [p.id, p]));
for (const S of STORIES) {
  texts.add(S.title);
  for (const pn of S.panels) {
    const p = byId[pn.pair];
    pn.lines.forEach(l => {
      const set = l[0] === "mimi" ? mimiTexts : texts;
      set.add(l[1]); if (l[1].includes("___")) set.add(l[1].replace("___", p.b.w[0]));
    });
  }
}
fs.mkdirSync(OUT, { recursive: true });
const keys = []; let made = 0;
const jobs = [...[...texts].map(t => ({ t, k: slug(t), v: VOICES.default })), ...[...mimiTexts].map(t => ({ t, k: "mimi_" + slug(t), v: VOICES.mimi }))];
const todo = [];
for (const { t, k, v } of jobs) {
  if (!slug(t) || keys.includes(k)) continue; keys.push(k);
  if (!fs.existsSync(`${OUT}/${k}.m4a`)) todo.push({ k, t: t.replace(/___/g, "..."), v, voice: v.voice, speed: v.speed });
}
if (todo.length) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "oq-kokoro-"));
  fs.writeFileSync(`${tmp}/jobs.json`, JSON.stringify(todo));
  cp.execFileSync(`${VENV}/bin/python`, [path.join(__dirname, "kokoro_tts.py"), `${tmp}/jobs.json`, tmp], { stdio: ["ignore", "ignore", "inherit"] });
  for (const j of todo) {
    const af = j.v.pitch === 1 ? "anull" : `asetrate=24000*${j.v.pitch},aresample=24000,atempo=${(1 / j.v.pitch).toFixed(5)}`;
    cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", `${tmp}/${j.k}.wav`, "-af", af, "-ac", "1", "-c:a", "aac", "-b:a", "48k", `${OUT}/${j.k}.m4a`]);
    made++;
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}
// 더 이상 쓰이지 않는 녹음 정리
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".m4a") && !keys.includes(f.slice(0, -4))) fs.unlinkSync(`${OUT}/${f}`);
keys.sort();
fs.writeFileSync(`${C}/audio.js`, `// 자동 생성 (node tools/gen_audio.js ${ID}) — 미리 녹음된 음성 목록\nwindow.AUDIO_KEYS = ${JSON.stringify(keys)};\n`);
console.log(`audio: ${keys.length} total, ${made} new`);
