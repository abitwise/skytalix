---
id: 20261030T051104Z-qe-e2e-decision-a8dbb76d
kind: decision
by: qe-e2e
at: 2026-10-30T05:11:04Z
verified_by: 
confidence: high: written before any check, gate or game; bars copied from the ticket and EPIC-010 § The merge rule
refs:
  - qe-ABC-230
  - ABC-230
  - EPIC-010
  - ADR-0054
  - grugops/ABC-230
  - dad753dc
  - 2fbcb380
  - c0698ddd
  - se-ABC-230/20261030T050005Z-software-engineer-decision-5cf9cecd
  - se-ABC-230/20261030T050005Z-software-engineer-observation-a836f535
  - se-ABC-230/20261030T050005Z-software-engineer-observation-f3c542f4
  - se-ABC-230/20261030T050102Z-software-engineer-observation-4ee731d9
  - qe-ABC-225
  - RISK-EPIC009-04
supersedes: 
seal: sha256:e83736c61f00ae8586d2018a389f091829e80cb84855d6548937be8eee85cf98
---

# qe-ABC-230 PREREG: what QE reads, how, and what passes, sealed before any game

QE/E2E, task `qe-ABC-230`. Written and sealed before any check, gate or game. The brief is `.grugops/queue/…/qe-ABC-230.md`. The contract is the ticket's § Acceptance criteria and `EPIC-010` § The merge rule.

## The builds
- **Candidate:** `grugops/ABC-230` @ `dad753dc` (code `2fbcb380`).
- **Base:** `c0698ddd`, the candidate's merge-base on `main`.
- `main` is src-identical to the base: `git diff c0698ddd main -- src data tools package.json package-lock.json` is empty when this note is written (`main` @ `ca6e675c`). So the candidate head is the build as it will merge, and no rebase is needed (A7's "rebased on `main`").
- QE's branch is `grugops/qe-ABC-230`, from `dad753dc`. It makes no `src/`, `tools/` or `data/` edit.

## 1. Identity (re-run, QE's own trees)
- The SE's harness (`se-ABC-230/raw/id.mjs`), unchanged, on QE's own `git archive` of `c0698ddd` and `dad753dc` (`src`, `data`), with plain `node`.
- **Pass:** `choose`, `choose-empty` (`[]`) and `clock0` (root clock 0, adversarial untrimmed keys) are each base = head, byte for byte. So are `doors-prior`, `level` and `level-empty`. `nonvac` differs (the list is read). 0 impure rows.

## 2. Spot checks (QE's own fixtures, through the delivered surfaces)
QE's fixtures are not the SE's. They are a queen on b1/b8 and a rook on c1/c8, both colours, with the losing king shuffling e8↔d8 or e1↔d1. There is also the startpos knight shuffle.
- **A1:** the repetition move (third occurrence) is chosen at exactly 0 with the trimmed keys, at depths 4 and 5. Base (the `c0698ddd` tree) plays another move at a score ≠ 0. The CLI seam (`createLevelSeam(5, …, keyHistory)`, virtual clock) plays the repetition, and base's seam does not.
- **A2:** UCI `position fen F moves …` + `go depth 4` gives `cp 0` and the repetition move. `go movetime 3000` gives a `bestmove` byte-equal to the CLI seam's move on the same game and clock. The startpos shuffle is INFO.
- **A3:** the full UCI output of the head equals the base tree's, line for line. This is read for a bare FEN, a bare startpos, `ucinewgame` after a game, a refused `position`, and a bare FEN after each of those. A CLI game started from a FEN equals base's seam.
- **A8:** with the position standing once before the root (second occurrence), the head with keys equals base: move, score and nodes at depths 3, 4 and 5, both colours. The UCI line equals base's.
- **Pass:** every row PASS.

## 3. One planted fault (scratch copy only, never the repo)
- **The fault:** in a scratch copy of the head, `src/level-seam.ts` ignores the injected `keyHistory`, so the CLI hands no prior keys.
- **Expected:** red in `src/cli.test.ts` (the A1 seam rows) and in QE's A1 CLI-seam spot rows. The SE's red checks were the count, the cap, the clock bound and the UCI wiring, and none of them was the CLI seam.
- The copy is thrown away afterwards.

## 4. Gates at `dad753dc`
- **The mandatory four:** `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`, each exit 0. The skip count is 0 and `test-skip-integrity` reports `No findings.`
- **G1:** `PUZZLE_DEEP` puzzle suite, ≥ 54/58.
- **G5:** `ENGINE_DEEP` `src/levels.test.ts` (the real-clock level rows) and `src/engine.test.ts`, green. The level-5 maximum is reported against 3 s.
- **G7:** `ENGINE_DEEP` `src/transposition.test.ts`, green.
- **G8:** `npm test` wall ≤ 10 s at load1 ≤ 8.
- **G6:** the EPIC-008 rule. 5 interleaved rounds per board (`kiwipete`, `position-6`), base first in odd rounds, at 3 000 ms on the real clock, in fresh processes. The head's median ≥ base's on each board, and any run below depth 6 FAILs.
- Lanes run through `npm run …` or `./node_modules/.bin/vitest`, never a bare `npx`.
- **G9 (the ruling QE owes):** QE reads `git diff c0698ddd dad753dc -- src/levels.ts src/engine.ts`. The file diff is known to be non-empty (`createLevel`/`blunder`, one import). G9's text (the ticket's A6; `EPIC-010` § Out of scope; the `EPIC-008` table) names `LEVELS[1..7]`, `DEFAULT_LEVEL` and `HARD_CEILING_MS`.
  - **MET** if those lines (and `EASIEST_LEVEL` / `HARDEST_LEVEL`) are byte-identical and `createLevel` with no prior keys is base's, node for node (identity part `level`).
  - **NOT MET** if any of the named lines moved.
  - G9 is ruled on its named lines, not on the whole-file diff.

## 5. A7, the smoke pair. ALONE, in order D then R, after the gates and a cool-down
- **D:** `node tools/rating/rating.ts d dad753dc c0698ddd <out> --budget-ms 1500 --rounds 5 --concurrency 1`. About 26 min.
- **R:** `node tools/rating/rating.ts r dad753dc <out> --elo 1910 --rounds 5 --concurrency 1`. About 26–28 min (est.).
  - **Deviation recorded:** R at width 1, not the epic's 2. This is the Orchestrator's delivery call, because width 2 tripped the 85 °C stop in `qe-ABC-225`.
- **Tools:** paths come from the environment and are never recorded. The pins are read from `machine.txt`.
- **Preconditions before each smoke:** 0 `cutechess-cli` (`pgrep -x`), 0 foreign vitest (`pgrep -f "[/]vitest"`), load1 ≤ 2.0 and Tctl ≤ 60.0 °C. They are polled every 15 s for up to 60 min (wait-clear).
- **Host log:** Tctl (k10temp), load1, foreign vitest, `cutechess-cli` count, and the busiest core's measured MHz, every 10 s.
- **THERMAL STOP:** from a run's 6th sample on, if the median Tctl of all the run's samples is > 85.0 °C, the run gets SIGTERM and is NOT READ. QE STOPs and reports.
  - A foreign vitest that appears mid-run is recorded.
  - If the stop fires while one was present, that run is VOID. One re-run is allowed after wait-clear (the brief). Otherwise there is no further game.
- **Frequency:** fall = 1 − (median busiest-core MHz over the run) / (median of its first 6 samples). Over 5 % makes the smoke UNRESOLVED, and it is re-run once (`RISK-EPIC009-04`).
- **S-1:** 0 candidate faults in the 20 games (illegal move, crash, disconnect, stall: the harness's fault texts). A fault by base or Stockfish makes that smoke UNRESOLVED, and it is re-run once.
- **S-2:** 0 candidate losses on time.
- **S-3:** the candidate's D score (W + D/2 from `Score of skytalix vs base`) ≥ 3.0 of 10.
- **S-4:** the candidate's R score ≥ 3.0 of 10.
- **Below 3.0 on S-3 or S-4:** the same command again, 10 more games. The harness has no opening offset and `tools/` is not edited, so they are openings 1–5 again. All 20 are judged together, and ≥ 7.0 of 20 passes.
- **Repetition-ending count:** the games whose result text is `Draw by 3-fold repetition`, per smoke. In D, the mover of the repeating move (candidate or base) is read from the PGN.
  - The INFO references: base's R(close) (`qe-epic008-close` r2, `38536a34`, whose moves `main` still plays: the merges since were value-identical) has 7/200 overall, and also its first 10 games (openings 1–5). No base-vs-base D at B = 1 500 exists. `qe-epic008-q4c`'s D (another pair) is INFO only.
- **The ledger row:** the pooled R since the last batch is this smoke alone (the ledger has no row). The trend flag needs ≥ 30 pooled games, so it is not evaluable.

## 6. Verdict rule
- **PASS:** sections 1–4 met and S-1..S-4 MET.
- **PASS_WITH_GAPS:** the same, with only non-blocking gaps named.
- **FAIL:** an A row, a gate or an S missed, or a THERMAL STOP leaving A7 unread.
- Under the ticket's Test note 3, the verdict signs UAT.
