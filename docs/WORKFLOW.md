# 새 단어로 교재 만들기 (Claude ↔ Codex 협업 순서)

역할: **Claude** = 기획·대사·앱 코드·마무리 / **Codex** = 그림 (Orca의 `art-codex` worktree 터미널에서 눈에 보이게 작업)

0. **새 교재 폴더**: `courses/<id>/`를 만들고(`data.js`, `story.js`, `img/`), `courses/courses.js`에 교재 한 줄을 추가합니다. 그러면 공유 페이지(`index.html`)의 교재 선택에 자동으로 나타납니다. (기존 `courses/opposites-g1/`를 복사해 시작)
1. **Claude**: 새 단어를 `courses/<id>/data.js`(PAIRS/UNITS)에 넣고, 엄마–아이 대사를 `courses/<id>/story.js`에 씁니다. (대사는 앞 쪽에 이어지게, 같은 상황 안의 반대말)
2. **Claude**: `node tools/gen_manifest.js <id>` → `art/BRIEF-<id>.md`에 **아직 없는 그림만** 정리됩니다. 커밋합니다.
3. **Claude → Codex**: `art-codex` worktree를 `main`으로 최신화(`git merge main`)한 뒤, Codex 터미널에 "art/BRIEF-<id>.md를 읽고 작업하라"는 지시를 보냅니다. Orca 화면에서 진행 과정을 볼 수 있고, 중간에 직접 지시해도 됩니다.
4. **Codex**: `courses/<id>/img/`에 그림을 만들고 파일 목록을 보고, 커밋합니다.
5. **Claude**: `main`에서 `art-codex`를 merge → `python3 tools/optimize_images.py <id>`(용량 줄이기) → `node tools/gen_manifest.js <id>`로 누락 확인 → 앱 점검 → 링크 재게시.

주의: 캐릭터(Mimi, Mom) 그림은 그대로 재사용합니다. 새 교재에서도 스타일을 맞추려면 Codex에 항상 `courses/<기존id>/img/mimi.png`, `mom.png`를 참고하게 하세요.

6. **공유**: `git push`하면 GitHub Pages가 갱신됩니다. 공유 주소는 `https://<계정>.github.io/<저장소>/` 입니다.


## 날짜별 문장 외우기 교재 (예: 리딩게이트)
동화 교재와 다른 유형입니다. `courses/courses.js`에 `type: "daily"` 로 등록하면 `js/daily.js` 가 열립니다.

1. `courses/<id>/data.js` 에 `DAYS` 를 씁니다. 한 Day = 문장 2~3개, 문장마다 `en`(영어), `ko`(뜻), `emoji`(임시), `scene`(Codex에게 줄 장면 설명). 형식은 `courses/readinggate/data.js` 참고.
2. `courses/courses.js` 에 `days`(Day 수), `sentences`(문장 수)를 맞춰 적습니다.
3. `node tools/gen_manifest.js <id>` → `art/BRIEF-<id>.md` (없는 그림만). Codex에게 전달 → `courses/<id>/img/story/d<Day>-<번호>.png`.
4. 병합 후 `python3 tools/optimize_images.py <id>` → `node tools/gen_audio.js <id>`(문장 · 천천히 읽기 · 낱말 소리) → push.
5. 새 Day를 추가해도 같은 순서입니다. 소리와 그림은 없는 것만 새로 만듭니다.

앱 동작: Day마다 ①듣고 따라 말하기(3번) → ②빈칸 → ③순서 맞추기 → ④한국어 보고 떠올리기. 끝내면 문장이 복습 목록에 들어가 1·3·7·14·30일 뒤 홈 화면에 "복습하기"로 나타납니다. 진행은 기기의 localStorage에 저장됩니다(기기마다 따로).
