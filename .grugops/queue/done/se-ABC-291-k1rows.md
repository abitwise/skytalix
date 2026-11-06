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

## Result

_by software-engineer (claude-opus-5-5, se-ABC-291-k1rows), 2026-11-06T20:53:12Z, branch `grugops/ABC-291`, main `780d9021` merged at `b2fff88b`, `grugops/qe-ABC-291-k1` at `4ba1a2ba`, test commit `70d931ab`. No production line, no game, no timing read, nothing pushed or merged into main, nothing left running._

**No STOP fired. No QE row read red, so F1 does not fire. All counts green.** Notes `…96abeaf8` (rows and the call), `…c4360feb` (counts, lane cost, plants), `…c0f5c1c8` (artifact).

- **Rows:** 24 added to `SEAM_ROWS` (36 to 60), QE's values unchanged, compared back to `raw/k1-rows.mjs`: 0 differ. N13, N14, N16, N17; L4; D2, D3, N2, N5, N6, N11, N12; W1–W7; P4; B9, B11, A5, B7. K1 (d)'s two hot-path rows read them too, through the table.
- **Title:** the doubled row now says it pays backward and that the seam holds no `DOUBLED` part.
- **Comment:** the file's head says QE's freeze came after the build.
- **One call beyond the list, for QE to read:** the seam block also reads the file flip and flip plus mirror, on all 60 rows, by a local `fileFlip`. QE's rows are defined as four images. `…96abeaf8` says six lines; the helper is eight with its comment, as formatted.

Counts, under the host lock, one at a time: typecheck 0; lint 0; `npm test` 2 814 of 2 814, 71 files, none skipped; `ENGINE_DEEP` `src/evaluate.pawns.test.ts` 121 of 121.

**`NFR-008`:** +24 tests, 0 files, 0 searches. File median 62 to 71 ms, about +9 ms, n = 3 each. A reported figure on an unheld host, spread as wide as the delta; not a graded read, and no verdict.

`git diff --name-only 63af973e` over `src` and `tools`: the three test files only. Path check run before the last commit.
