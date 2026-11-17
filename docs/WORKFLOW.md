# 새 단어로 교재 만들기 (Claude ↔ Codex 협업 순서)

역할: **Claude** = 기획·대사·앱 코드·마무리 / **Codex** = 그림 (Orca의 `art-codex` worktree 터미널에서 눈에 보이게 작업)

0. **새 교재 폴더**: `courses/<id>/`를 만들고(`data.js`, `story.js`, `img/`), `courses/courses.js`에 교재 한 줄을 추가합니다. 그러면 공유 페이지(`index.html`)의 교재 선택에 자동으로 나타납니다. (기존 `courses/opposites-g1/`를 복사해 시작)
1. **Claude**: 새 단어를 `courses/<id>/data.js`(PAIRS/UNITS)에 넣고, 엄마–아이 대사를 `courses/<id>/story.js`에 씁니다. (대사는 앞 쪽에 이어지게, 같은 상황 안의 반대말)
2. **Claude**: `node tools/gen_manifest.js <id>` → `art/BRIEF.md`에 **아직 없는 그림만** 정리됩니다. 커밋합니다.
3. **Claude → Codex**: `art-codex` worktree를 `main`으로 최신화(`git merge main`)한 뒤, Codex 터미널에 "art/BRIEF.md를 읽고 작업하라"는 지시를 보냅니다. Orca 화면에서 진행 과정을 볼 수 있고, 중간에 직접 지시해도 됩니다.
4. **Codex**: `courses/<id>/img/`에 그림을 만들고 파일 목록을 보고, 커밋합니다.
5. **Claude**: `main`에서 `art-codex`를 merge → `python3 tools/optimize_images.py <id>`(용량 줄이기) → `node tools/gen_manifest.js <id>`로 누락 확인 → 앱 점검 → 링크 재게시.

주의: 캐릭터(Mimi, Mom) 그림은 그대로 재사용합니다. 새 교재에서도 스타일을 맞추려면 Codex에 항상 `courses/<기존id>/img/mimi.png`, `mom.png`를 참고하게 하세요.

6. **공유**: `git push`하면 GitHub Pages가 갱신됩니다. 공유 주소는 `https://<계정>.github.io/<저장소>/` 입니다.
