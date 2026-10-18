---
result: delivered
branch: grugops/ABC-167
tip: 4dbbfbd8
code_commit: 3dd0db1b
base: e286526d
---

ABC-167 is delivered on its branch, in the worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-167`. The base is `e286526d`, as the brief asked; main's tip `3001668b` differs from it only in board and queue records. Nothing was pushed or merged. **No timing was read.** The figures below are on the virtual clock.

The QE-170-g edges are covered by the page's `A7` and by ADR-0044 D12: a value that is not a positive integer drops that token with one `info string`, a tiny `nodes N` gives d1, and `mate N` maps to 2N−1. Nothing was left for me to decide, so there was no stop. Five minor choices the page left open are listed in the `decision` note `…297da9e5` for QE and BA/PM: the initial position, validation of the time tokens, a `go` that arrives while a `bestmove` is held, how far `searchmoves` consumes, and the `nps` formula.

- `A1` MET. `uci` writes exactly `id name skytalix`, `id author Olger Oeselg`, `uciok`.
- `A2` MET. `isready` writes `readyok`.
- `A3` MET. Exactly 2 lines are written: `info depth 4 score cp 3 nodes 6173 time 110 nps … pv b1c3` and `bestmove b1c3`. The move is legal.
- `A4` MET.
  - The bad FEN and `e2e5` each write one printable `info string`, and a `\x1b` is filtered out.
  - The next `go movetime 100` writes `bestmove 0000`.
  - The stalemate is checked with `legalMoves` in the test, and `go` answers `bestmove 0000`.
- `A5` MET. The bound for each figure is G ≤ time ≤ G + 2·step:

  | go | time | G | step |
  |---|---|---|---|
  | `movetime 100` | 101 | 100 | 1 |
  | white, `wtime 1000 btime 9000` | 51 | 50 | 1 |
  | black, the same line | 460 | 450 | 10 |
  | `wtime 40 btime 40` | 2 | 1 | 1 |
  | `+inc` | 3100 | 3000 | 100 |
  | bare `go` | 3100 | 3000 | 100 |

- `A6` MET. `go infinite` writes no `bestmove`. `stop` writes exactly one. A second `stop` writes nothing. `ponderhit` behaves the same.
- `A7` MET.
  - A free `go` reaches d6, and `go depth 3` reports d3.
  - `go nodes 20000` reports 20 501 nodes (≤ 21 024).
  - `go mate 2` gives `score mate 2` and `bestmove d5g8` at depth 3. There is no D12 finding.
  - `go depth 3 mate 5` reports d3.
  - Each of `go depth 0`, `nodes x`, `depth 2.5` (and also `mate 0`, `nodes -5`, a bare `depth`) writes one `info string` and one `bestmove`.
  - `searchmoves` writes one `info string` and gives the same move as an unrestricted search.
- `A8` MET. `score mate -1`. The FEN is derived (the only legal move is `h8g8`) and did not need replacing. `mate 2` is as in `A7`.
- `A9` MET. The five ignored lines write nothing. After Kiwipete, `ucinewgame` gives a `bestmove` that is legal from the start position.
- `A10` MET. Every row asserts `"quit"` for `quit` and `"continue"` for every other line.
- `A11` MET.
  - No limb token, `Date.now` or `Math.random` appears anywhere in the file text.
  - None of the 6 fenced modules is imported.
  - Every line written across the file matches the M4 prefixes.
- `A12` MET. `git diff --name-only e286526d 4dbbfbd8 -- src` gives exactly `src/uci-session.test.ts` and `src/uci-session.ts`. The D2 "no edit" list is unchanged.

Gates on `3dd0db1b` (`src` is identical at tip `4dbbfbd8`):
- lint, typecheck, build and `npm test` all exit 0: 59 files, 1888/1888 on the first run;
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1888, 0 failed and 0 pending;
- `test-skip-integrity --skip-count 0`: `No findings.`;
- `CLI_DEEP=1` cli.real-engine: 10/10;
- `PERFT_DEEP=1` perft: 32/32;
- `git merge-tree` against main `3001668b`: clean.

Production-lines measurement: `git diff --name-only e286526d...4dbbfbd8 | grep -v '\.test\.ts$' | grep '^src/'` gives `src/uci-session.ts`. That is the new production module this ticket creates, so the count is **not zero**, and the UAT waiver does not apply.

The notes are in `.grugops/context/ticket-to-pr-ABC-167/notes/` on the branch (`…297da9e5` decision, `…eb9aa161` observation, `…469c4efb` artifact-ref). They are hand-authored and unsealed. I did not touch `plans/board.md`, `plans/traceability.md` or `wt-ABC-146`, and started no background process.

Owed: the `NFR-008` `N8-LANE` delta at the gate. Not read.

Trace row: `| ABC-167 | EPIC-007 / ADR-0044 D2-D4, D12 | grugops/ABC-167 @ 4dbbfbd8 (code 3dd0db1b) | src/uci-session.ts (new), src/uci-session.test.ts (new) | uci-session.test.ts A1-A12 (44 rows) | A1-A12 MET; N8-LANE delta owed at gate | In Development → In Review (Orchestrator) |`
