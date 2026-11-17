# 영어 그림책

학교에서 배운 단어를 엄마와 아이의 동화로 읽고 퀴즈로 익히는 웹앱. 빌드 없는 정적 HTML/CSS/JS (iPad 우선).

- `index.html` 공유 페이지: 교재(교과과정) 선택
- `play.html?c=<교재id>` 학습 화면 / `js/app.js` 화면 로직 / `css/`
- `courses/<id>/` 교재별 데이터(`data.js`, `story.js`)와 그림(`img/`) — 교재 목록은 `courses/courses.js`
- `tools/` 그림 지시서 생성·그림 용량 줄이기 / `docs/WORKFLOW.md` 새 교재 만드는 순서 / `art/` 그림 스타일 가이드와 원본

실행: `python3 -m http.server` 후 http://localhost:8000
