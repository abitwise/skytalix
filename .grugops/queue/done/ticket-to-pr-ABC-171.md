---
result: delivered
branch: grugops/ABC-171
tip: 9ae31679
code_commit: b6afd021
base: 7df64755
---

ABC-171 is delivered on its branch, in the worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-171`, which was created from `7df64755` as the brief asked. Nothing was pushed or merged. **No timing was read.** Every figure below is on the virtual clock.

**`LEVELS` and `src/levels.ts` are unchanged.** `Skill Level` maps to `LEVELS` as the page says. The ABC-085 verdict (levels 3, 4 and 5 do not separate) is untouched, and no strength is asserted at any level.

The tests were written first: 25 rows failed before the code went in. **No page edge was left undecided, so there was no stop.** Six minor choices outside the page are listed in the `decision` note `…a171d001` for QE and BA/PM:
1. `random` and `book` are required fields, and the ABC-167 helper passes an empty valid book.
2. `OwnBook` values are case-sensitive.
3. A `setoption` with no `value` is invalid.
4. On a book hit, `go` token warnings are still written.
5. The wording of the dropped-limit line.
6. `warm()` runs at `isready` and at `go`.

- `A1` MET. `uci` writes exactly 5 lines, in order: `id name skytalix`, `id author Olger Oeselg`, `option name OwnBook type check default true`, `option name Skill Level type spin default 3 min 1 max 5`, `uciok`.
- `A2` MET.
  - `setoption name skill level value 1` writes nothing. A6 then reads time 200 on budget 100 (step 100).
  - `setoption name OwnBook value false` writes nothing.
  - `Skill Level` `0`, `6`, `2.5`, `x` and `constructor` each write exactly one `info string`, and level 1 is kept (re-read through A6).
  - `OwnBook maybe` writes one `info string`, and `false` is kept (a search runs, `read` is called 0 times).
  - `Hash 64` writes nothing. The book still hits, and the level is still 3 (3100 on budget 3000).
- `A3` MET.
  - `position startpos`, then `go movetime 1000`, writes exactly `info string book`, `bestmove e2e4`, and no `info depth` line.
  - `position fen <start FEN>` hits the same entry.
  - Also: `position startpos moves e2e4` probes the position after the moves (book `e7e5`).
- `A4` MET. With `OwnBook false` set before `isready`/`go`: `info depth …` and `bestmove` are written, no `info string book` is written, and `read` is called 0 times over a session that includes `isready`, `go` and `ucinewgame`.
- `A5` MET.
  - `read` counts: 0 after `uci`, 1 after the first `isready`, and still 1 after `isready`, `go`, `ucinewgame`, `isready` and `go`.
  - A session with no `isready` reads 1 at the first `go`.
  - An `isready` with `OwnBook` off reads 0. The next `isready` after `ownbook value true` reads 1.
- `A6` MET. On `go wtime 60000 btime 60000 winc 1000 binc 1000` (G = 3500), step 100, bound G..G+200:

  | level | time | budget |
  |---|---|---|
  | 1 | 200 | 100 |
  | 3 | 3100 | 3000 |
  | 5 | 3600 | 3500 |

  Level 1 pins `seededRandom(1)`, and a row asserts that its first draw (0.694 ≥ 0.4) takes the engine path. The blunder path does not fit G+2·step on a coarse virtual clock. That is a property of `createLevel`, which is fenced off; see `…a171d002`.
- `A7` MET.
  - At level 1, step 10, two sessions on `seededRandom(2)` both give `b1c3, b1c3, e2a6`. A row asserts that these draws cover both the blunder path and the engine path.
  - `k = 3` gives `e2e4, b1c3, d5e6`; nothing is asserted on it.
  - The info line is `info depth D nodes N time T pv M`, with no `score`.
  - At level 1, `go depth 3` writes `info string skill level 1 ignores go depth; searching on time`, then the info line, then `bestmove`.
  - At level 3, `go depth 3` reports depth 3.
- `A8` MET. `ucinewgame` draws 0 times. Each level-1 `go` draws exactly 1 seed. A level-3 `go` draws 0.
- `A9` MET. With `read` throwing, and with `{"format":2}`: three `go`s each write exactly one legal `bestmove`, `handleLine` never throws, and `warn` is called exactly once.
- `A10` MET. `go infinite` on a book hit writes `info string book`. `stop` writes `bestmove e2e4`. A second `stop` writes nothing.
- `A11` MET.
  - ABC-167 A11 holds: no limb token, `Date.now` or `Math.random`, and none of the 6 fenced modules is imported.
  - The only `./book.ts` import is `import type { BookProbe } from "./book.ts";`.
  - The M4 sweep reads every line written by both the ABC-167 rows and the ABC-171 rows.
- `A12` MET.
  - `git diff --name-only 7df64755 9ae31679 -- src` gives exactly `src/uci-session.test.ts` and `src/uci-session.ts`.
  - Every ABC-167 row is green. The only row that changed is ABC-167 A1, which gains the two option lines.
  - The shared helper also changed, to pass the two now-required fields; see the decision note.

Gates on `9ae31679` (`src` is identical to code commit `b6afd021`):
- lint, typecheck, build and `npm test` all exit 0: 59 files, 1945/1945 on the first run, inside the 60 s bound;
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1945, 1945 passed, 0 failed, 0 pending;
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: `No findings.`;
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: 10/10;
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: 32/32;
- `git merge-tree` against main `00b62340`: clean.

R-167-1, `git diff -U0 7df64755...9ae31679 -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`:
```
164:+  for (const value of ["0", "6", "2.5", "x", "constructor"]) {
```
This one hit is in `src/uci-session.test.ts`. It is A2's required invalid `Skill Level` value: a string literal sent as UCI input, which the page names. The same grep on `src/uci-session.ts` alone prints nothing. In production, `LEVELS` is read only after `Object.hasOwn(LEVELS, value)` passes. I deliberately kept the word out of the production comment.

Production-lines measurement: `git diff --name-only 7df64755...9ae31679 | grep -v '\.test\.ts$' | grep '^src/'` gives `src/uci-session.ts` (+97/−15). The count is **not zero**, so the UAT waiver does not apply.

The notes are in `.grugops/context/ticket-to-pr-ABC-171/notes/` on the branch: `…a171d001` (decision), `…a171d002` (observation), `…a171d003` (artifact-ref). They are hand-authored and unsealed, because this install has no `context-io.ts`. I did not touch `plans/board.md`, `plans/traceability.md` or any other process, and I started no background process. `.grugops/queue/claimed/ticket-to-pr-ABC-171/` is left as it was.

Owed: the `NFR-008` `N8-LANE` delta at the gate. It was not read.

Trace row: `| ABC-171 | EPIC-007 / ADR-0044 D2, D3, D10, D11 | grugops/ABC-171 @ 9ae31679 (code b6afd021) | src/uci-session.ts, src/uci-session.test.ts | uci-session.test.ts ABC-171 A1-A11 (30 new rows; 101 in file) | A1-A12 MET; N8-LANE delta owed at gate | In Development → In Review (Orchestrator) |`
