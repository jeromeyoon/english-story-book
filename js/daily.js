/* 날짜(Day)별 문장 외우기 — 듣고 따라 말하기 → 빈칸 → 순서 맞추기 → 한국어 보고 떠올리기, 그리고 간격 복습 */
(() => {
  const BASE = window.COURSE_BASE, KEY = "oq:" + window.COURSE_ID;
  const { speak, beep } = window.Sound;
  const app = document.getElementById("app"); app.classList.add("daily");
  const back = document.getElementById("back"), title = document.getElementById("title");

  // ---------- 저장 / 날짜 ----------
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } },
    set(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} },
  };
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = () => iso(new Date());
  const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return iso(d); };
  const INTERVALS = [1, 3, 7, 14, 30];             // 복습 간격(일): 외운 뒤 1일, 3일, 7일, 14일, 30일
  const state = () => { const s = store.get(); s.sent = s.sent || {}; s.days = s.days || {}; s.log = s.log || []; return s; };
  const streak = (log) => {
    const set = new Set(log); let d = today(); if (!set.has(d)) d = addDays(d, -1);
    let n = 0; while (set.has(d)) { n++; d = addDays(d, -1); } return n;
  };

  // ---------- 데이터 ----------
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const tokens = (en) => en.split(/\s+/).map((w) => w.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "")).filter(Boolean);
  const ALL = DAYS.flatMap((D) => D.sentences.map((s, i) => ({ ...s, id: `d${D.day}s${i + 1}`, day: D.day, i, color: D.color, words: tokens(s.en) })));
  const byDay = (n) => ALL.filter((x) => x.day === n);
  const stars = (n, max = 3) => "⭐".repeat(n) + "<span class='dim'>" + "☆".repeat(max - n) + "</span>";

  const scene = (x, cls = "") =>
    `<div class="scene ${cls}" style="--c:${x.color}"><span class="emo">${x.emoji}</span>` +
    `<img alt="" src="${BASE}img/story/d${x.day}-${x.i + 1}.jpg" onerror="this.parentNode.classList.add('fb');this.remove()"></div>`;
  const mimi = (mood = "") =>
    `<span class="pic mimi ${mood}"><span class="emo">🐰</span>` +
    `<img alt="" src="${BASE}img/mimi${mood ? "-" + mood : ""}.png" onerror="this.parentNode.classList.add('fb');this.remove()"></span>`;

  // ---------- 화면 틀 ----------
  let backFn = null, timers = [];
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); };
  const show = (html, { t = window.COURSE.title, onBack = null } = {}) => {
    timers.forEach(clearTimeout); timers = [];
    app.innerHTML = html; title.textContent = t; backFn = onBack;
    back.style.visibility = onBack ? "visible" : "hidden"; app.scrollTop = 0;
  };
  back.addEventListener("click", () => backFn && backFn());
  const on = (sel, fn) => app.querySelectorAll(sel).forEach((el) => el.addEventListener("click", () => fn(el)));
  const bar = (i, n) => `<div class="progress"><i style="width:${Math.round(i / n * 100)}%"></i></div>`;

  // ---------- 홈 ----------
  function home() {
    const s = state(), t = today();
    const due = ALL.filter((x) => s.sent[x.id] && s.sent[x.id].next <= t);
    const done = ALL.filter((x) => s.sent[x.id]).length, st = streak(s.log);
    const next = DAYS.find((D) => !s.days[D.day]);
    const week = [6, 5, 4, 3, 2, 1, 0].map((k) => addDays(t, -k)).map((d) => `<i class="${s.log.includes(d) ? "on" : ""}">${s.log.includes(d) ? "⭐" : "·"}</i>`).join("");
    show(`
      <section class="hero">${mimi()}<div class="hello"><h2>Today's Sentences</h2><p>오늘도 문장 ${done ? "친구가 " + done + "개 있어요" : "을 외워 봐요"} 🎈</p></div></section>
      <div class="streak"><span>🔥 ${st}일 연속</span><span class="week">${week}</span></div>
      ${due.length ? `<button class="btn good big" id="rev" style="width:100%;margin-bottom:18px">🔁 복습하기 <small>${due.length}문장</small></button>` : ""}
      <div class="grid units">
        ${DAYS.map((D) => `
          <button class="card unit" data-d="${D.day}" style="--c:${D.color}">
            ${next && next.day === D.day ? '<em class="today">오늘 할 차례</em>' : ""}
            <span class="big-emoji">${D.emoji}</span>
            <b>Day ${D.day}</b><span>${D.title}</span><small>${D.ko} · 문장 ${D.sentences.length}개</small>
            <span class="stars">${stars((s.days[D.day] || {}).stars || 0)}</span>
          </button>`).join("")}
      </div>`, { onBack: () => { location.href = "index.html"; } });
    on("[data-d]", (el) => startDay(+el.dataset.d));
    const r = app.querySelector("#rev"); if (r) r.addEventListener("click", () => startReview(due));
  }

  // ---------- 단계 실행기 ----------
  // steps: [{ f: 화면함수(x, ctx), x }] — 각 화면은 끝나면 ctx.next() 를, 틀리면 ctx.miss() 를 부릅니다.
  function run(steps, name, onDone) {
    let i = 0, mist = 0;
    const ctx = { miss() { mist++; }, next() { i++; go(); }, pos: () => [i, steps.length], back: () => home() };
    function go() { if (i >= steps.length) return onDone(mist); steps[i].f(steps[i].x, ctx); }
    go();
  }

  // 1) 듣고 따라 말하기
  function sListen(x, ctx) {
    let n = 0; const [i, tot] = ctx.pos();
    show(`${bar(i, tot)}<div class="book">${scene(x, "big")}
      <div class="step">① 듣고 따라 말해요</div>
      <p class="sent">${esc(x.en)}</p><p class="ko">${esc(x.ko)}</p>
      <div class="opts"><button class="btn" id="p1">🔊 듣기</button><button class="btn" id="p2">🐢 천천히</button></div>
      <div class="opts"><button class="btn good big" id="said">따라 말했어요 <small id="n">0/3</small></button></div></div>`, { t: name0(), onBack: ctx.back });
    const hear = () => speak([x.en]);
    on("#p1", hear); on("#p2", () => speak([[x.en, "slow"]]));
    on("#said", () => { n++; app.querySelector("#n").textContent = n + "/3"; beep(true); if (n >= 3) later(() => ctx.next(), 350); else hear(); });
    later(hear, 250);
  }

  // 2) 빈칸 채우기
  function sBlank(x, ctx) {
    const [i, tot] = ctx.pos();
    const cand = x.words.map((w, k) => ({ w, k })).filter((o) => o.k > 0 && o.w.length >= 3);
    const pick = (cand.length ? cand : x.words.map((w, k) => ({ w, k }))).reduce((a, b) => (b.w.length > a.w.length ? b : a));
    const pool = [...new Set(ALL.flatMap((y) => y.words).filter((w) => w.length >= 3 && w.toLowerCase() !== pick.w.toLowerCase()).map((w) => w.toLowerCase()))];
    const opts = shuffle([pick.w, ...shuffle(pool).slice(0, 2)]);
    const parts = x.words.map((w, k) => (k === pick.k ? `<mark id="m">____</mark>` : esc(w))).join(" ");
    show(`${bar(i, tot)}<div class="book">${scene(x, "big")}
      <div class="step">② 빈칸에 알맞은 말은?</div>
      <p class="sent">${parts}.</p><p class="ko">${esc(x.ko)}</p>
      <div class="opts">${opts.map((o) => `<button class="opt" data-w="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="opts"><button class="btn big" id="nx" hidden>다음 ▶</button></div></div>`, { t: name0(), onBack: ctx.back });
    let solved = false;
    on(".opt", (el) => {
      if (solved) return; const w = el.dataset.w;
      if (w.toLowerCase() === pick.w.toLowerCase()) {
        solved = true; el.classList.add("good"); beep(true);
        const m = app.querySelector("#m"); m.textContent = pick.w; m.className = "right-ans";
        speak([x.en]); app.querySelector("#nx").hidden = false;
      } else { ctx.miss(); el.classList.add("bad"); beep(false); speak([w]); }
    });
    on("#nx", () => ctx.next());
  }
  const name0 = () => title.textContent;

  // 3) 순서 맞추기
  function sOrder(x, ctx) {
    const [i, tot] = ctx.pos();
    let bank = x.words.map((w, k) => ({ w, k })), put = [], wrong = 0, over = false;
    for (let t = 0; t < 8; t++) { const sh = shuffle(bank); bank = sh; if (sh.map((o) => o.k).join() !== x.words.map((_, k) => k).join()) break; }
    show(`${bar(i, tot)}<div class="book">${scene(x, "big")}
      <div class="step">③ 순서대로 말을 눌러요</div>
      <p class="ko">${esc(x.ko)}</p>
      <div class="slots" id="slots"></div><div class="bank" id="bank"></div>
      <div class="opts"><button class="btn big" id="nx" hidden>다음 ▶</button></div></div>`, { t: name0(), onBack: ctx.back });
    const draw = () => {
      app.querySelector("#slots").innerHTML = put.map((o, j) => `<button class="chip" data-j="${j}">${esc(o.w)}</button>`).join("") || `<span class="ph">여기에 순서대로</span>`;
      app.querySelector("#bank").innerHTML = bank.map((o, j) => `<button class="chip bk" data-b="${j}">${esc(o.w)}</button>`).join("");
      on("[data-b]", (el) => { if (over) return; const o = bank.splice(+el.dataset.b, 1)[0]; put.push(o); speak([o.w]); draw(); if (!bank.length) check(); });
      on("[data-j]", (el) => { if (over) return; bank.push(put.splice(+el.dataset.j, 1)[0]); draw(); });
    };
    const finish = () => { over = true; const sl = app.querySelector("#slots"); sl.classList.add("ok"); beep(true); speak([x.en]); app.querySelector("#nx").hidden = false; };
    const check = () => {
      if (put.every((o, j) => o.k === j)) return finish();
      ctx.miss(); wrong++; beep(false); const sl = app.querySelector("#slots"); sl.classList.add("shake");
      later(() => {
        if (wrong >= 3) { put = x.words.map((w, k) => ({ w, k })); bank = []; draw(); finish(); }
        else { bank = put.concat(bank); put = []; draw(); }
      }, 600);
    };
    draw(); on("#nx", () => ctx.next());
  }

  // 4) 한국어 보고 떠올리기 (스스로 확인) — 복습에서도 사용
  function sRecall(x, ctx, review) {
    const [i, tot] = ctx.pos();
    show(`${bar(i, tot)}<div class="book">${scene(x, "big")}
      <div class="step">${review ? "🔁 복습" : "④ 영어로 말해 봐요"}</div>
      <p class="sent ko-big">${esc(x.ko)}</p>
      <p class="sent" id="en" hidden>${esc(x.en)}</p>
      <div class="opts" id="a1"><button class="btn big" id="show">🔍 정답 보기</button></div>
      <div class="opts" id="a2" hidden><button class="btn good big" id="ok">😊 말했어요!</button><button class="btn big" id="again">🔁 다시 해 볼래요</button></div></div>`, { t: name0(), onBack: ctx.back });
    on("#show", () => { app.querySelector("#en").hidden = false; app.querySelector("#a1").hidden = true; app.querySelector("#a2").hidden = false; speak([x.en]); });
    on("#ok", () => { beep(true); ctx.next(); });
    on("#again", () => { ctx.miss(); app.querySelector("#en").hidden = true; app.querySelector("#a1").hidden = false; app.querySelector("#a2").hidden = true; });
  }

  // ---------- Day 학습 ----------
  function startDay(n) {
    const D = DAYS.find((d) => d.day === n), xs = byDay(n), name = `Day ${n} · ${D.title}`;
    const steps = [...xs.map((x) => ({ f: sListen, x })), ...xs.map((x) => ({ f: sBlank, x })), ...xs.map((x) => ({ f: sOrder, x })), ...xs.map((x) => ({ f: sRecall, x }))];
    title.textContent = name;
    run(steps, name, (mist) => {
      const s = state(), t = today(), st = mist <= 1 ? 3 : mist <= 4 ? 2 : 1;
      xs.forEach((x) => { if (!s.sent[x.id]) s.sent[x.id] = { box: 1, next: addDays(t, INTERVALS[0]) }; });
      s.days[n] = { stars: Math.max((s.days[n] || {}).stars || 0, st), date: t };
      if (!s.log.includes(t)) s.log.push(t);
      store.set(s); finishDay(D, xs, st);
    });
  }

  function finishDay(D, xs, st) {
    const hasNext = DAYS.some((d) => d.day === D.day + 1);
    show(`<div class="result">${mimi("happy")}<h2>Great job!</h2><div class="bigstars">${stars(st)}</div>
      <p>오늘의 문장을 외웠어요! 내일 다시 만나요 🌙</p>
      <div class="review">${xs.map((x) => `<button class="listen" data-s="${x.id}">🔊 ${esc(x.en)} <small>${esc(x.ko)}</small></button>`).join("")}</div>
      <div class="opts"><button class="btn big" id="h">🏠 처음으로</button>${hasNext ? `<button class="btn good big" id="n">Day ${D.day + 1} ▶</button>` : ""}</div></div>`, { t: "Day " + D.day, onBack: home });
    on("[data-s]", (el) => speak([ALL.find((y) => y.id === el.dataset.s).en]));
    on("#h", home); const nb = app.querySelector("#n"); if (nb) nb.addEventListener("click", () => startDay(D.day + 1));
  }

  // ---------- 복습 ----------
  function startReview(due) {
    const list = shuffle(due).slice(0, 6), results = {};
    const steps = list.map((x) => ({ f: (xx, ctx) => sRecall(xx, { ...ctx, miss: () => { results[xx.id] = false; ctx.miss(); } }, true), x }));
    run(steps, "복습", () => {
      const s = state(), t = today();
      list.forEach((x) => {
        const r = s.sent[x.id]; if (!r) return;
        if (results[x.id] === false) { r.box = 1; r.next = addDays(t, INTERVALS[0]); }
        else { r.box = Math.min((r.box || 1) + 1, INTERVALS.length); r.next = addDays(t, INTERVALS[r.box - 1]); }
      });
      if (!s.log.includes(t)) s.log.push(t);
      store.set(s);
      show(`<div class="result">${mimi("happy")}<h2>복습 끝!</h2><p>${list.length}문장을 다시 봤어요 👏</p>
        <div class="opts"><button class="btn good big" id="h">🏠 처음으로</button></div></div>`, { t: "복습", onBack: home });
      on("#h", home);
    });
  }

  home();
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
