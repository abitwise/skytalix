---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T20:38:09Z
subtask: se-ABC-291-k1rows
role: software-engineer
ref: .grugops/context/se-ABC-291-k1rows/
branch: grugops/ABC-291 — worktree .claude/worktrees/se-ABC-291 (after se-ABC-291-repair reports; first merge grugops/qe-ABC-291-k1 into it, a merge, no rebase)
width: K1 (c)'s rows QE names. Test file only. No production line, no game, no timing read.
---
# K1's rows from qe-ABC-291-k1
Read …b850a2ad, …2e186a33, …5de6a358 and raw/k1-rows.mjs. Add to src/evaluate.pawns.test.ts, with QE's expected values unchanged:
- K1 (c)'s letter, required: double step N13, N14; en passant N16, N17.
- The chief gap: L4.
- The rest of QE's gap table: D2, D3, N2, N5, N6, N11, N12, W1–W7, P4; and B9, B11, A5, B7.
- Fix the row title that claims DOUBLED, which the seam does not hold.
- Say in a comment that QE's freeze came after the build.
No search in these rows; default lane. Report the count and added lane cost for NFR-008.
STOP, nothing adjusted: any QE row reads red on the tip (that is a defect check, F1, not a row to fix), or a production line would have to move.
Then under the host lock, by count, one at a time: typecheck, lint, npm test, ENGINE_DEEP src/evaluate.pawns.test.ts. Deep spelling: ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>; "no tests" is a failure. Confirm no non-test src file changed against 63af973e.
Fences: src/evaluate.pawns.test.ts, your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
