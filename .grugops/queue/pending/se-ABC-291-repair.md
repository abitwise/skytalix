---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T20:34:10Z
subtask: se-ABC-291-repair
role: software-engineer
ref: .grugops/context/se-ABC-291-repair/
branch: grugops/ABC-291 — worktree .claude/worktrees/se-ABC-291 (first merge main into it; a merge, no rebase)
width: test-only repair, the list in …2d2c2bad § 5. No production line, no game, no timing read.
---
# ABC-291's test-only repair
Read arch-ABC-291-stop's …2d2c2bad and …77dd9228, and ADR-0075, ADR-0071's dated lines. Do § 5's five items exactly, each edit with one dated comment citing the note. List each row in ## Result.
Then, by count, one at a time under the host lock the dispatch prompt gives: typecheck, lint, npm test, ENGINE_DEEP src/uci-session.test.ts (270 / 270), ENGINE_DEEP src/engine.test.ts. Deep spelling: ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>; "no tests" is a failure.
STOP, nothing adjusted, on § 5's lines: any literal in § 1 reads otherwise; D3's row red; the new row finds any other pawnShape: true; a production line would have to move.
Confirm with git diff that no non-test src file changed against 63af973e.
Fences: src/uci-session.test.ts, src/evaluate.pawns.test.ts, src/engine.test.ts, your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
