# Opposite Friends

대광초 1학년 영어 수행평가(Opposite Pairs 30쌍) 연습 앱. 순수 HTML/CSS/JS, 빌드 없음.

## 실행
- `index.html`을 브라우저로 열기, 또는 `python3 -m http.server` 후 접속.
- iPad: 같은 와이파이에서 서버 주소 접속 → 공유 ▸ 홈 화면에 추가.

## 구조
- `js/data.js` 단어 데이터 / `js/app.js` 화면 로직 / `css/style.css`
- `assets/manifest.json` 필요한 그림 목록 → `assets/img/`에 PNG를 넣으면 자동 반영
- worktree: `main`(앱) · `art`(그림, 다른 폴더 `../Enlgish_quizz-art`)
