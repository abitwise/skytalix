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

## Result

_by software-engineer (claude-opus-5-5, se-ABC-291-repair), 2026-11-06T20:48:21Z, branch `grugops/ABC-291`, main `f59be09d` merged at `a8d55615`, test commit `a3474306`. No production line, no game, no timing read, nothing pushed or merged into main, nothing left running._

**No STOP fired. All counts green.** Notes `…fd2ea321` (rows and calls), `…2cddd25a` (counts), `…8be535bf` (artifact).

Each row changed:
- **`src/uci-session.test.ts` A0-3, § 5 item 1:** `D8` (`level` ×2, `simple-tournament` `go movetime 200`, `uci-clock-mode` `go movetime 200`) cp 45 → 74; `D7` (`simple-tournament` `go wtime 8000 btime 8000 movestogo 40`) cp 43 → 88; `D6` (`uci-clock-mode` `go depth 6`) cp 87 → 99, nodes 10513 → 10614, nps 618412 → 624353. Doc comment gains one dated line.
- **`src/evaluate.pawns.test.ts`, "evaluateAtPhaseWithoutPawnShape: outside test files, only the three off branches d4 puts it on", item 2:** comment only, now a pointer to `ADR-0075` K1 (h)'s dated line.
- **`src/evaluate.pawns.test.ts`, new row "d4: pawnShape: true stands in each RULES_PAWN_SHAPE and in search()'s and chooseMove's own bodies, under tools/ in QUIET_RULES and its name, and nowhere else", item 3:** default lane, source only. Red on 4 of 4 planted faults on a scratch copy.
- **`src/engine.test.ts` A0-1, 6 rows, item 4:** the door's `softMs: 1` line deleted; the relation on `chooseMove` stays.
- **`src/engine.test.ts` A0-1, 6 rows, and A0-2, 4 rows, item 5:** `allOn` → `bundleTree`; titles say "the bundle's tree". No figure moved.

Counts, under the host lock, one at a time: typecheck 0; lint 0; `npm test` 2 790 of 2 790, 71 files, none skipped; `ENGINE_DEEP` `src/uci-session.test.ts` 270 of 270; `ENGINE_DEEP` `src/engine.test.ts` 105 of 105.

`git diff --name-only 63af973e` over `src` and `tools`: the three test files only. Path check run before the last commit.
