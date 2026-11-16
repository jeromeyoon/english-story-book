/* Opposite Friends — 영어 반대말 학습 앱 (순수 JS, 빌드 불필요) */
(() => {
  const app = document.getElementById("app");
  const back = document.getElementById("back");
  const title = document.getElementById("title");

  // ---------- 저장 ----------
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("oq") || "{}"); } catch (e) { return {}; } },
    set(o) { try { localStorage.setItem("oq", JSON.stringify(o)); } catch (e) {} },
  };
  const saveStars = (key, n) => {
    const s = store.get(); s.stars = s.stars || {};
    s.stars[key] = Math.max(s.stars[key] || 0, n); store.set(s);
  };
  const getStars = (key) => (store.get().stars || {})[key] || 0;

  // ---------- 소리 ----------
  let voice = null;
  const pickVoice = () => {
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    voice = vs.find(v => /en[-_]US/i.test(v.lang) && /samantha|ava|allison|karen/i.test(v.name)) ||
            vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  };
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace("___", "blank"));
    u.lang = "en-US"; u.rate = 0.8; u.pitch = 1.1; if (voice) u.voice = voice;
    speechSynthesis.speak(u);
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

  // ---------- 데이터 도우미 ----------
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const label = (side) => side.w.join(" / ");

  // 단어 -> 인정되는 반대말 집합 (short, light, old, right 처럼 겹치는 단어 자동 처리)
  const OPP = {};
  PAIRS.forEach(p => [[p.a, p.b], [p.b, p.a]].forEach(([x, y]) =>
    x.w.forEach(t => { (OPP[t] = OPP[t] || new Set()); y.w.forEach(u => OPP[t].add(u)); })));
  const accepted = (side) => { const s = new Set(); side.w.forEach(t => OPP[t].forEach(u => s.add(u))); return s; };

  const itemsOf = (pairs) => pairs.flatMap(p => [
    { p, me: p.a, other: p.b }, { p, me: p.b, other: p.a },
  ]);
  const unitPairs = (u) => PAIRS.filter(p => p.unit === u);
  const allSides = () => PAIRS.flatMap(p => [p.a, p.b]);

  // 그림: 파일이 있으면 그림, 없으면 이모지
  const pic = (side, cls = "") =>
    `<span class="pic ${cls}"><span class="emo">${side.e}</span>` +
    `<img alt="" src="assets/img/${side.pic}.png" onload="this.parentNode.classList.add('has')" onerror="this.remove()"></span>`;
  const mimi = (mood = "") =>
    `<span class="pic mimi ${mood}"><span class="emo">🐰</span>` +
    `<img alt="" src="assets/img/mimi${mood ? "-" + mood : ""}.png" onload="this.parentNode.classList.add('has')" onerror="this.remove()"></span>`;
  const char = (who, mood = "") => who === "mom"
    ? `<span class="pic mimi mom"><span class="emo">🐇</span><img alt="" src="assets/img/mom.png" onload="this.parentNode.classList.add('has')" onerror="this.remove()"></span>`
    : mimi(mood);
  const stars = (n, max = 3) => "⭐".repeat(n) + "<span class='dim'>" + "☆".repeat(max - n) + "</span>";

  // ---------- 화면 틀 ----------
  let backFn = null;
  const show = (html, { t = "Opposite Friends", onBack = null } = {}) => {
    app.innerHTML = html; title.textContent = t; backFn = onBack;
    back.style.visibility = onBack ? "visible" : "hidden";
    app.scrollTop = 0;
  };
  back.addEventListener("click", () => backFn && backFn());
  const on = (sel, fn) => app.querySelectorAll(sel).forEach(el => el.addEventListener("click", () => fn(el)));

  // ---------- 홈 ----------
  function home() {
    show(`
      <section class="hero">${mimi()}<div class="hello"><h2>Hi! I'm Mimi!</h2><p>반대말 친구들과 놀아요 🎈</p></div></section>
      <div class="grid units">
        ${UNITS.map(u => `
          <button class="card unit" data-u="${u.id}" style="--c:${u.color}">
            <span class="big-emoji">${u.emoji}</span>
            <b>Book ${u.id}</b><span>${STORIES[u.id - 1].title}</span><small>${STORIES[u.id - 1].ko}</small>
            <span class="stars">${stars(getStars("story" + u.id))}</span>
          </button>`).join("")}
      </div>
      <button class="btn test" id="test">📝 수행평가 연습 <small>7단어 · 반대말 말하기</small>
        <span class="stars">${stars(getStars("test"))}</span></button>`);
    on("[data-u]", el => unit(+el.dataset.u));
    app.querySelector("#test").addEventListener("click", () => sayGame(null));
  }

  // ---------- 단원 메뉴 ----------
  function unit(u) {
    const U = UNITS[u - 1];
    show(`
      <h2 class="h">${U.emoji} Unit ${u} · ${U.name} <small>${U.ko}</small></h2>
      <div class="grid menu">
        <button class="card feature" data-m="story">📖<b>동화책 읽기</b><small>${STORIES[u - 1].title} · ${STORIES[u - 1].ko}</small></button>
        <button class="card" data-m="cards">🃏<b>단어 카드</b><small>그림 보고 소리 듣기</small></button>
        <button class="card" data-m="chat">💬<b>미미와 대화</b><small>반대말 고르기</small></button>
        <button class="card" data-m="say">🗣️<b>반대말 말하기</b><small>시험처럼 연습</small></button>
      </div>`, { t: `Unit ${u}`, onBack: home });
    on("[data-m]", el => ({ story, cards, chat, say: sayGame }[el.dataset.m])(u));
  }


  // ---------- 동화책(만화) 읽기 ----------
  function story(u, page = -1) {
    const S = STORIES[u - 1], U = UNITS[u - 1], N = S.panels.length;
    const run = story.run && story.run.u === u ? story.run : (story.run = { u, first: 0 });
    if (page === -1) { run.first = 0; return cover(); }
    const bub = (who, html, extra = "") =>
      `<div class="row ${who === "mimi" ? "right" : ""}">${char(who, extra)}<div class="bubble ${who}">${html}</div></div>`;
    const scene = (pn, p) => `<div class="scene" style="--c:${U.color}"><span class="emo">${pn.scene}</span>
      <img alt="" src="assets/img/story/${u}-${page + 1}.jpg" onload="this.parentNode.classList.add('has')" onerror="this.remove()">
      <i class="pg">${page + 1}</i></div>`;

    function cover() {
      show(`<section class="book cover" style="--c:${U.color}">
        <div class="scene big" style="--c:${U.color}"><span class="emo">${S.cover}</span>
          <img alt="" src="assets/img/story/${u}-cover.jpg" onload="this.parentNode.classList.add('has')" onerror="this.remove()"></div>
        <h2>${S.title}</h2><p>${S.ko}</p>
        <div class="who">${char("mom")}${char("mimi")}</div>
        <button class="btn big" id="go">📖 읽기 시작</button></section>`, { t: `Book ${u}`, onBack: () => unit(u) });
      speak(S.title);
      app.querySelector("#go").onclick = () => story(u, 0);
    }
    if (page >= N) return theEnd();
    const p = PAIRS.find(x => x.id === S.panels[page].pair), pn = S.panels[page];
    const l2 = pn.lines[pn.lines.length - 1], first = pn.lines.slice(0, -1), ok = accepted(p.a);
    const hi = (t) => t.replace(/___/, "<mark>___</mark>");
    let tries = 0;
    show(`<section class="book">
        <div class="progress"><i style="width:${page / N * 100}%"></i></div>
        ${scene(pn)}
        <div class="talk" id="talk">${first.map(l => bub(l[0], l[1])).join("")}</div>
        <div class="opts" id="ctl"><button class="btn" id="more">▶ 다음 말풍선</button></div>
      </section>`, { t: `${S.title} · ${page + 1}/${N}`, onBack: () => unit(u) });
    speak(first.map(l => l[1]).join(" "));
    app.querySelectorAll(".talk .bubble").forEach((b, i) => b.onclick = () => speak(first[i][1]));
    app.querySelector("#more").onclick = () => {
      const pool = shuffle(allSides().filter(s => s.w.every(w => !ok.has(w) && !p.a.w.includes(w))));
      const wrong = []; const seen = new Set();
      for (const s of pool) if (!seen.has(s.w[0]) && wrong.length < 2) { seen.add(s.w[0]); wrong.push(s.w[0]); }
      const opts = shuffle([p.b.w[0], ...wrong]);
      const talk = app.querySelector("#talk");
      talk.insertAdjacentHTML("beforeend", bub(l2[0], hi(l2[1])));
      talk.lastElementChild.querySelector(".bubble").onclick = () => speak(l2[1]);
      speak(l2[1]);
      const ctl = app.querySelector("#ctl");
      ctl.innerHTML = opts.map(o => `<button class="opt" data-o="${o}">${o}</button>`).join("");
      ctl.querySelectorAll(".opt").forEach(b => b.onclick = () => {
        if (b.disabled) return; tries++;
        const w = b.dataset.o, mk = talk.lastElementChild.querySelector("mark");
        if (ok.has(w)) {
          beep(true); if (tries === 1) run.first++;
          mk.textContent = w; mk.className = "right-ans";
          talk.insertAdjacentHTML("beforeend", bub("mom", `Yes! 🎉 <b>${label(p.a)}</b> ↔ <b>${label(p.b)}</b>`, "happy"));
          speak(l2[1].replace("___", w));
          ctl.innerHTML = `<button class="btn" id="nx">${page === N - 1 ? "끝 ✔" : "다음 페이지 ▶"}</button>`;
          ctl.querySelector("#nx").onclick = () => story(u, page + 1);
        } else { beep(false); b.disabled = true; b.classList.add("bad"); mk.textContent = w; mk.className = "wrong-ans"; setTimeout(() => { mk.textContent = "___"; mk.className = ""; }, 700); }
      });
    };

    function theEnd() {
      const n = run.first, s = n >= N - 1 ? 3 : n >= N * 0.6 ? 2 : 1;
      saveStars("story" + u, s);
      show(`<section class="book cover"><h2>The End 🎉</h2>
        <div class="who">${char("mom")}${char("mimi", "happy")}</div>
        <div class="bigstars">${stars(s)}</div>
        <p>${N}쪽 중 ${n}쪽을 한 번에 맞혔어요!</p>
        <div class="nav"><button class="btn" id="re">다시 읽기</button>
        ${u < STORIES.length ? `<button class="btn good" id="nb">다음 책 ▶</button>` : `<button class="btn good" id="hm">홈</button>`}</div></section>`,
        { t: "The End", onBack: () => unit(u) });
      app.querySelector("#re").onclick = () => story(u, -1);
      const nb = app.querySelector("#nb"); if (nb) nb.onclick = () => story(u + 1, -1);
      const hm = app.querySelector("#hm"); if (hm) hm.onclick = home;
    }
  }

  // ---------- 단어 카드 ----------
  function cards(u, i = 0) {
    const ps = unitPairs(u), p = ps[i];
    const tile = (s) => `<button class="tile" data-say="${s.w[0]}|${s.s}">${pic(s, "lg")}<b>${label(s)}</b><small>${s.k}</small><i>${s.s}</i></button>`;
    show(`
      <div class="pairview">${tile(p.a)}<div class="vs">↔</div>${tile(p.b)}</div>
      <div class="nav">
        <button class="btn" id="prev" ${i === 0 ? "disabled" : ""}>◀</button>
        <span>${i + 1} / ${ps.length}</span>
        <button class="btn" id="next">${i === ps.length - 1 ? "끝 ✔" : "▶"}</button>
      </div>`, { t: "단어 카드", onBack: () => unit(u) });
    on("[data-say]", el => { const [w, s] = el.dataset.say.split("|"); speak(w + ". " + s); });
    speak(p.a.w[0] + ". " + p.b.w[0]);
    app.querySelector("#prev").onclick = () => cards(u, i - 1);
    app.querySelector("#next").onclick = () => (i === ps.length - 1 ? unit(u) : cards(u, i + 1));
  }

  // ---------- 대화 퀴즈 ----------
  function chat(u) {
    const q = shuffle(itemsOf(unitPairs(u))).slice(0, 8);
    const st = { i: 0, first: 0, missed: [] };
    const blank = (side) => side.s.replace(new RegExp(side.w[0], "i"), "___");
    const bold = (side) => side.s.replace(new RegExp(side.w[0], "i"), m => `<mark>${m}</mark>`);

    const render = () => {
      if (st.i >= q.length) return finish();
      const it = q[st.i], ok = accepted(it.me);
      const pool = shuffle(allSides().filter(s => s.w.every(w => !ok.has(w) && !it.me.w.includes(w))));
      const wrong = [], seen = new Set();
      for (const s of pool) { if (!seen.has(s.w[0]) && (wrong.length < 2)) { seen.add(s.w[0]); wrong.push(s.w[0]); } }
      const opts = shuffle([it.other.w[0], ...wrong]);
      let tries = 0;
      show(`
        <div class="progress"><i style="width:${st.i / q.length * 100}%"></i></div>
        <div class="chat" id="log">
          <div class="row">${mimi()}<div class="bubble">${bold(it.me)}</div></div>
          <div class="row">${mimi()}<div class="bubble">Now you! ${pic(it.other, "sm")} <br>${blank(it.other)}</div></div>
        </div>
        <div class="opts">${opts.map(o => `<button class="opt" data-o="${o}">${o}</button>`).join("")}</div>`,
        { t: `Unit ${u} 대화`, onBack: () => unit(u) });
      speak(it.me.s + " ... " + blank(it.other));
      const log = app.querySelector("#log");
      const add = (cls, html) => { log.insertAdjacentHTML("beforeend", `<div class="row ${cls}">${cls === "me" ? "" : mimi(cls === "oops" ? "oops" : "happy")}<div class="bubble ${cls}">${html}</div></div>`); log.scrollTop = log.scrollHeight; };
      on(".opt", el => {
        if (el.disabled) return;
        const w = el.dataset.o; tries++;
        add("me", `${blank(it.other).replace("___", `<mark>${w}</mark>`)}`);
        if (ok.has(w)) {
          beep(true); el.classList.add("good");
          app.querySelectorAll(".opt").forEach(b => b.disabled = true);
          if (tries === 1) st.first++;
          add("happy", `Yes! 🎉 <b>${label(it.me)}</b> ↔ <b>${label(it.other)}</b>`);
          speak(it.other.s);
          app.querySelector(".opts").innerHTML = `<button class="btn next" id="n">Next ▶</button>`;
          app.querySelector("#n").onclick = () => { st.i++; render(); };
        } else {
          beep(false); el.classList.add("bad"); el.disabled = true;
          if (tries === 1) st.missed.push(it);
          add("oops", `Oops! 🙈 Try again!`);
        }
      });
    };
    const finish = () => {
      const n = st.first, s = n >= q.length - 1 ? 3 : n >= q.length * 0.6 ? 2 : 1;
      saveStars("chat" + u, s);
      show(`<section class="result">${mimi("happy")}<h2>Great job!</h2>
        <div class="bigstars">${stars(s)}</div><p>${q.length}문제 중 ${n}개를 한 번에 맞혔어요</p>
        ${st.missed.length ? `<div class="review"><b>다시 볼 단어</b>${st.missed.map(m => `<span>${label(m.me)} ↔ ${label(m.other)}</span>`).join("")}</div>` : ""}
        <div class="nav"><button class="btn" id="again">다시 하기</button><button class="btn" id="menu">단원 메뉴</button></div></section>`,
        { t: "결과", onBack: () => unit(u) });
      app.querySelector("#again").onclick = () => chat(u);
      app.querySelector("#menu").onclick = () => unit(u);
    };
    render();
  }

  // ---------- 반대말 말하기 (u=null 이면 수행평가 연습 7단어) ----------
  function sayGame(u) {
    const isTest = u === null;
    const q = isTest ? shuffle(itemsOf(PAIRS)).slice(0, 7) : shuffle(itemsOf(unitPairs(u)));
    const st = { i: 0, ok: 0, redo: [] };
    const render = () => {
      if (st.i >= q.length) return finish();
      const it = q[st.i], ans = [...accepted(it.me)];
      show(`
        <div class="progress"><i style="width:${st.i / q.length * 100}%"></i></div>
        <section class="say">
          <p class="hint">${isTest ? "선생님이 단어를 읽어요. 반대말을 말해보세요!" : "단어를 읽고 반대말을 크게 말해보세요!"}</p>
          <button class="word" id="w">${pic(it.me, "lg")}<b>${label(it.me)}</b><small>🔊 눌러서 듣기</small></button>
          <div id="area"><button class="btn big" id="reveal">정답 보기 👀</button></div>
        </section>`, { t: isTest ? "수행평가 연습" : `Unit ${u} 말하기`, onBack: () => (isTest ? home() : unit(u)) });
      speak(it.me.w[0]);
      app.querySelector("#w").onclick = () => speak(it.me.w[0]);
      app.querySelector("#reveal").onclick = () => {
        speak(ans[0]);
        app.querySelector("#area").innerHTML = `
          <div class="answer">${ans.map(a => `<b>${a}</b>`).join("<span>또는</span>")}</div>
          <p class="hint">어떤 반대말을 말해도 정답이에요. 맞게 말했나요?</p>
          <div class="nav"><button class="btn" id="no">🤔 다시 해볼래요</button><button class="btn good" id="yes">😀 맞았어요!</button></div>`;
        app.querySelector("#yes").onclick = () => { st.ok++; st.i++; render(); };
        app.querySelector("#no").onclick = () => { st.redo.push(it); st.i++; render(); };
      };
    };
    const finish = () => {
      const s = st.ok === q.length ? 3 : st.ok >= q.length * 0.7 ? 2 : 1;
      saveStars(isTest ? "test" : "say" + u, s);
      show(`<section class="result">${mimi(st.ok === q.length ? "happy" : "")}<h2>${st.ok} / ${q.length}</h2>
        <div class="bigstars">${stars(s)}</div>
        ${st.redo.length ? `<div class="review"><b>다시 연습할 단어</b>${st.redo.map(m => `<span>${label(m.me)} ↔ ${label(m.other)}</span>`).join("")}</div>` : "<p>모두 맞았어요! 🎉</p>"}
        <div class="nav"><button class="btn" id="again">다시 하기</button><button class="btn" id="menu">${isTest ? "홈" : "단원 메뉴"}</button></div></section>`,
        { t: "결과", onBack: () => (isTest ? home() : unit(u)) });
      app.querySelector("#again").onclick = () => sayGame(u);
      app.querySelector("#menu").onclick = () => (isTest ? home() : unit(u));
    };
    render();
  }

  home();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
