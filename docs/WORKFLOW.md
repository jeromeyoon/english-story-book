# 새 단어로 교재 만들기 (Claude ↔ Codex 협업 순서)

역할: **Claude** = 기획·대사·앱 코드·마무리 / **Codex** = 그림 (Orca의 `art-codex` worktree 터미널에서 눈에 보이게 작업)

1. **Claude**: 새 단어를 `js/data.js`(PAIRS/UNITS)에 넣고, 엄마–아이 대사를 `js/story.js`에 씁니다. (대사는 앞 쪽에 이어지게, 같은 상황 안의 반대말)
2. **Claude**: `node tools/gen_manifest.js` → `art/BRIEF.md`에 **아직 없는 그림만** 정리됩니다. 커밋합니다.
3. **Claude → Codex**: `art-codex` worktree를 `main`으로 최신화(`git merge main`)한 뒤, Codex 터미널에 "art/BRIEF.md를 읽고 작업하라"는 지시를 보냅니다. Orca 화면에서 진행 과정을 볼 수 있고, 중간에 직접 지시해도 됩니다.
4. **Codex**: `assets/img/`에 그림을 만들고 파일 목록을 보고, 커밋합니다.
5. **Claude**: `main`에서 `art-codex`를 merge → `python3 tools/optimize_images.py`(용량 줄이기) → `node tools/gen_manifest.js`로 누락 확인 → 앱 점검 → 링크 재게시.

주의: 캐릭터(Mimi, Mom) 그림은 그대로 재사용합니다. 새 교재에서도 스타일을 맞추려면 Codex에 항상 `assets/img/mimi.png`, `mom.png`를 참고하게 하세요.
