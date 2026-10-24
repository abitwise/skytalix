---
subtask: se-ABC-213-probe-rows
role: software-engineer
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/se-ABC-213-probe-rows/
branch: grugops/ABC-213 (e46db08e), worktree ../wt-ABC-213
width: 2 of 3
---

# ABC-213: close QE-213-a/b/c with QE's probe rows; fix the header wording (QE-213-d)

## Do
- Add QE's Q6/Q7/Q8 probe rows (raw/probe-rows.ts) to src/pgn.test.ts, on the same in-process fake — no new process, no new file, no new spawnSync site (A7 holds). Show each row fails under its own plant (Q6, Q7, Q8) and passes at head.
- src/pgn-file.ts header lines 15–16: say removal is best-effort (comment only; no code line moves).
- If the page's fences forbid either edit, STOP and report — do not stretch them.
- Gates: lint, typecheck, build, npm test (+ last-run.json), skip capture. Don't merge main again.

## Fences
- Only ../wt-ABC-213 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se213/. No other src file. Never push, force, amend or rebase; never merge into main; no board edits.

## Publish
- Commit on grugops/ABC-213. Seal notes (task se-ABC-213-probe-rows). ## Result + trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Partly done: the rows are in; the header edit was STOPPED by the page's fence, as the brief directs.** Branch `grugops/ABC-213` in `../wt-ABC-213`: **`7adc85ac`** (the test rows) and then **`41d31b18`** (the notes and evidence; the tip). Not pushed and `main` not merged in again. No board edits.

- **Rows:** QE's Q6/Q7/Q8 probe rows (`qe-ABC-213/raw/probe-rows.ts`, copied verbatim) are appended to the `ABC-213` describe in `src/pgn.test.ts` (+20 lines), on the existing `node:fs` double. They add 0 spawns and 0 files, keep 1 `spawnSync(` site (A7), and edit no ABC-203 expected value.
- **Plants** (QE's `plants.mjs` unedited, on a scratch copy; `src/` never edited; holder `cmp`-restored), on the file's 24 rows:
  - HEAD: 24/24.
  - **Q6** reds only `QE probe Q6`, **Q7** only `QE probe Q7`, **Q8** only `QE probe Q8`.
  - X1 reds A1 ×2, A2 ×2, A3 and probe Q7. X3 and X4 each red A1 ×2. X5 reds A3.
  - This is the same as QE's `plants-probe-result.json`.
- **Header (QE-213-d): NOT made.** The page's A6 says "`src/pgn-file.ts`'s diff touches the cleanup branch only". QE-213-d itself names A6 as the reason the header was left out. Rewording lines 15–16 would add a hunk outside the cleanup branch. `src/pgn-file.ts` is byte-identical to `e46db08e`. To close it, either amend A6 (Orchestrator or BA/PM) or carry the wording with the D4 dated line or the next `pgn-file.ts` ticket, then re-queue a one-line SE hop. The decision note is `…6f71057f`.
- **Gates at `7adc85ac`:**
  - lint 0 (125 files), typecheck 0, build 0;
  - `npm test` exit 0: 62 files, 2047/2047 (2044 + 3), and `last-run.json` reads success, failed 0, pending 0, todo 0;
  - skips 0, and `test-skip-integrity.js` gives `No findings.`;
  - no `games/` in the worktree.
- **Notes** (in `../wt-ABC-213/.grugops/context/se-ABC-213-probe-rows/notes/`, sealed by `context-io.js`): `…e3ee9c45` (plants), `…47f04206` (gates) and `…6f71057f` (decision), plus `raw/plants-result.json`.
- **Next:** a light QE re-check of the three rows (per `…502866f9`). QE-213-d stays open as above.

**Trace row** (for the Orchestrator):

| ABC-213 (se-ABC-213-probe-rows) | SE: QE probe rows Q6/Q7/Q8 pinned in src/pgn.test.ts; each reds only under its own plant, all green at head; QE-213-d header NOT edited (A6 fence) | EPIC-006 | PGN export (ABC-203, ADR-0047) | N8-SPAWN 0; 0 files; 1 spawnSync site (A7); pgn-file.ts byte-identical | grugops/ABC-213 @ 7adc85ac (rows), 41d31b18 (notes)<br>src/pgn.test.ts +20<br>.grugops/context/se-ABC-213-probe-rows/notes/ (3) + raw/plants-result.json | plants Q6/Q7/Q8 each red only its probe row; X1/X3/X4/X5 unchanged; lint/typecheck/build 0; npm test 62/2047 success; skips 0 No findings. | unchanged (signed by QE verdict …aceaddaf) | QE re-check; QE-213-d open (A6) | In Review (no move) |
