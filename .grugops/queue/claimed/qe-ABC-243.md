---
subtask: qe-ABC-243
role: qe-e2e
ticket: ABC-243
ref: .grugops/context/qe-ABC-243/
branch: grugops/ABC-243 @ 4a9a264b (code 8772cf36; base 4bd9ac6a); QE commits on new grugops/qe-ABC-243 from 4a9a264b (worktree .claude/worktrees/qe-ABC-243)
width: ALONE for G8 (a records-only BA/PM may still be finishing; no other CPU work scheduled)
---
# QE ABC-243 (XS, test-only): A2/A6 plants red, A3/A4 diff, A5 gates + G8
Read the ticket (A1–A6), se-ABC-243 notes (`…c408ef9e`, `…9c3d34df`, `…a66447b8`, `…fd162ca2` — QE handoff), qe-ABC-241 mutate.mjs (QM3),
ABC-244's G8 triggers (> 9.6 s head median → tranche 2; > 10 s → STOP, owner).
Do: PREREG first; A2 re-plant L=4/6/7 (red) + no-plant green; A6 QM3 red; A3/A4 diff check; A5 gates via `npm run …`, ENGINE_DEEP row once;
G8 interleaved b h h b b h ALONE (base 4bd9ac6a, head 8772cf36), wait-clear via `kill -0` (never `while pgrep -f`). UAT waived (test-only).
Fences: no src/, tools/, data/ edits. Never push/force/amend/rebase/merge into main. No board edits. Never bare npx/npm exec. No host paths. Scratch `qe-243/`.
Publish: sealed notes (task `qe-ABC-243`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
