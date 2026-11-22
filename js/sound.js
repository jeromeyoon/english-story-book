/* 소리 재생 (app.js, daily.js 공용): 미리 녹음한 음성 우선, 없으면 기기 음성합성 */
(() => {
  const BASE = window.COURSE_BASE;
  // ---------- 소리 ----------
  // 1순위: 미리 녹음한 음성(courses/<id>/audio/*.m4a) — 기기 설정과 상관없이 나옴
  // 2순위: 기기 음성합성(speechSynthesis) — 녹음이 없는 문장용
  const AUDIO = new Set(window.AUDIO_KEYS || []);
  const slug = (t) => t.toLowerCase().replace(/___/g, " blank ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const player = new Audio(); player.preload = "auto";
  let voice = null, token = 0, unlocked = false;
  const pickVoice = () => {
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    voice = vs.find(v => /en[-_]US/i.test(v.lang) && /samantha|ava|allison|karen/i.test(v.name)) ||
            vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  };
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  // iOS/iPad는 첫 터치 때 소리 재생을 허용(잠금 해제)해 두어야 이후 자동 재생이 됨
  const unlock = () => {
    if (unlocked) return; unlocked = true;
    try { player.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; const p = player.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    try { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
  };
  ["pointerdown", "touchend", "click"].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  const tts = (text, done, slow) => {
    if (!window.speechSynthesis) return done();
    const u = new SpeechSynthesisUtterance(text.replace(/___/g, "..."));
    u.lang = "en-US"; u.rate = slow ? 0.55 : 0.8; u.pitch = 1.1; if (voice) u.voice = voice;
    u.onend = u.onerror = () => done();
    speechSynthesis.speak(u);
  };
  const stopSound = () => {
    try { player.onended = player.onerror = null; player.pause(); } catch (e) {}
    try { if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel(); } catch (e) {}
  };
  // 말하는 사람: "mimi"=아이 목소리, "slow"=천천히 읽기
  // speak("문장") / speak(["단어", "문장"]) / 말하는 사람 지정: speak([["문장", "mimi"]]) — 여러 개면 차례로 읽음
  // (주의: speak(["문장", "mimi"])는 두 문장으로 읽힘. 사람 지정은 항상 [문장, 사람] 짝으로 감싸기)
  const speak = (parts) => {
    parts = [].concat(parts); const my = ++token; stopSound();
    (function next(i) {
      if (i >= parts.length || my !== token) return;
      const part = parts[i], t = [].concat(part)[0], who = Array.isArray(part) ? part[1] : "";   // ["문장", "mimi"] 이면 아이 목소리
      const k = (who === "mimi" ? "mimi_" : who === "slow" ? "slow_" : "") + slug(t), after = () => next(i + 1);
      if (AUDIO.has(k)) {
        player.onended = after; player.onerror = () => { if (my === token) tts(t, after, who === "slow"); };
        player.src = `${BASE}audio/${k}.m4a`;
        const p = player.play(); if (p && p.catch) p.catch(() => { if (my === token) tts(t, after, who === "slow"); });
      } else tts(t, after, who === "slow");
    })(0);
  };
  const beep = (ok) => {
    try {
      const c = beep.c || (beep.c = new (window.AudioContext || window.webkitAudioContext)());
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.frequency.value = ok ? 880 : 220; g.gain.value = 0.08;
      o.start(); o.stop(c.currentTime + (ok ? 0.15 : 0.25));
    } catch (e) {}
  };
  window.Sound = { speak, beep, slug, stop: stopSound };
})();
