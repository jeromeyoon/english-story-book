#!/usr/bin/env node
// 앱이 읽어 주는 모든 영어 문장을 macOS 음성(Samantha)으로 미리 녹음해 courses/<id>/audio/*.m4a 로 만듭니다.
// 기기의 음성 기능에 의존하지 않아 iPad/휴대폰/오프라인에서도 소리가 납니다. (macOS 전용: say, afconvert)
//   node tools/gen_audio.js <교재id>      → 없는 파일만 새로 만듭니다
const fs = require("fs"), cp = require("child_process"), os = require("os"), path = require("path");
const ID = process.argv[2] || "opposites-g1", C = `courses/${ID}`, OUT = `${C}/audio`;
const src = fs.readFileSync(`${C}/data.js`, "utf8") + fs.readFileSync(`${C}/story.js`, "utf8") + ";module.exports={PAIRS,STORIES}";
const m = { exports: {} }; new Function("module", src)(m);
const { PAIRS, STORIES } = m.exports;
const slug = t => t.toLowerCase().replace(/___/g, " blank ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); // app.js 와 같은 규칙
const blank = side => side.s.replace(new RegExp(side.w[0], "i"), "___");
const texts = new Set();
for (const p of PAIRS) for (const side of [p.a, p.b]) { side.w.forEach(w => texts.add(w)); texts.add(side.s); texts.add(blank(side)); }
const byId = Object.fromEntries(PAIRS.map(p => [p.id, p]));
for (const S of STORIES) {
  texts.add(S.title);
  for (const pn of S.panels) {
    const p = byId[pn.pair];
    pn.lines.forEach(l => { texts.add(l[1]); if (l[1].includes("___")) texts.add(l[1].replace("___", p.b.w[0])); });
  }
}
fs.mkdirSync(OUT, { recursive: true });
const keys = []; let made = 0;
for (const t of texts) {
  const k = slug(t); if (!k || keys.includes(k)) continue; keys.push(k);
  const out = `${OUT}/${k}.m4a`; if (fs.existsSync(out)) continue;
  const tmp = path.join(os.tmpdir(), `oq-${k.slice(0, 40)}.aiff`);
  cp.execFileSync("say", ["-v", "Samantha", "-r", "150", "-o", tmp, t.replace(/___/g, "[[slnc 700]]")]);
  cp.execFileSync("afconvert", [tmp, out, "-f", "m4af", "-d", "aac", "-b", "48000"]);
  fs.unlinkSync(tmp); made++;
}
keys.sort();
fs.writeFileSync(`${C}/audio.js`, `// 자동 생성 (node tools/gen_audio.js ${ID}) — 미리 녹음된 음성 목록\nwindow.AUDIO_KEYS = ${JSON.stringify(keys)};\n`);
console.log(`audio: ${keys.length} total, ${made} new`);
