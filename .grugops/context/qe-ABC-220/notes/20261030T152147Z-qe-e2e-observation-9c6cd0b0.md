---
id: 20261030T152147Z-qe-e2e-observation-9c6cd0b0
kind: observation
by: qe-e2e
at: 2026-10-30T15:21:47Z
verified_by: 
confidence: high: every figure read from the run outputs in raw/gates, raw/qrows, raw/mutants, raw/deep
refs:
  - qe-ABC-220
  - ABC-220
  - EPIC-009
  - ADR-0052
  - grugops/ABC-220
  - fbab54ff
  - 68ba364c
  - a649fbc4
  - qe-ABC-220/20261030T144810Z-qe-e2e-decision-8ad475ba
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - A10
  - A11
  - A12
  - A13
  - A14
  - A14a
  - A14b
  - G4
  - QE-220-a
  - se-ABC-220/20261030T123301Z-software-engineer-observation-e8314efb
supersedes: 
seal: sha256:7ee5c375c4ef0c6238789073a0991a56e59ff84d1f64d51c1b6059c9e6308fb9
---


# qe-ABC-220 checks: gates, the A8 fence, skip integrity, 19 QE rows, 4 mutants and the deep lanes, as run

QE/E2E, task `qe-ABC-220`, at `fbab54ff` (src tree `14295741…`), after the PREREG `…8ad475ba`. Every command went through `npm run …` or the local entry `node ./node_modules/vitest/vitest.mjs`. Nothing used a bare `npx` or `npm exec`. Raw: `raw/gates/`, `raw/qrows/`, `raw/mutants/`, `raw/deep/`.

## Gates (untimed)
- `npm run lint`, `npm run typecheck` and `npm run build` each exited 0.
- `npm test` exited 0: 63 files, **2 297 / 2 297**, the same as the SE's count. `.test-results/last-run.json` records 0 failed, 0 pending and 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`
- `node tools/grugops/lane-inventory.js` printed 63 = 63, `No findings.`
- **A8 fence:**
  - `git diff a649fbc4 fbab54ff -- src/engine.ts src/levels.ts` is 0 bytes.
  - `--stat` over `src tools data package.json package-lock.json` names only `src/uci-session.ts` (+71/−6), `src/uci-session.test.ts` and `src/uci.real-engine.test.ts`: 733+/12− in all.
  - `LEVELS`, `DEFAULT_LEVEL`, `HARD_CEILING_MS` = 32 000 and the `Skill Level` line are unchanged, from the diff and from the SE's A8 rows.
  - Levels 1–7 identity holds on the real base code (QE-A8 below).
- **Deep lanes:** see § Deep lanes.

## QE rows (`qrows.mjs`, plain node; base `a649fbc4` archive vs head worktree): 19 / 19 PASS, 0 FAIL, first run
How the rows read the budget: a `node:module` resolve hook sends every import of `engine.ts` inside each tree to a generated stub. The stub records what `chooseMove` is handed. The oracle and the fixtures are QE's own.
- **QE-A1a:** head's `uci` reply equals base's, with only the TimeMode line inserted right after `Skill Level` (6 lines against 5). **A1b:** after the setting, a second `uci` writes the same reply.
- **QE-A6a:** 3 000 seeded random `go` lines in the setting, alternating White and Black to move. All 3 000 matched the oracle, and **no budget was over 22 000**. T bound 2 165 times, C bound 482 times and `movetime` bound 353 times.
- **QE-A6b:** 400-digit clocks:
  - `wtime` gave 22 000, and `movetime` gave 22 000.
  - `wtime −9…9 winc 9…9` gave NaN, and the real engine answered `bestmove b1c3` at depth 1 (`engine.ts`'s NaN rule).
- **QE-A6c:** in the setting, `movetime −5` gave −5 and `movetime 0` gave 0, the same as base at level 5. The real engine answered a legal move in both cases.
- **QE-A3a:** the side to move reads its own clock and increment, for both colours:
  - Black `winc 0 binc 2000` → 2 800, and `winc 2000 binc 0` → 800.
  - White, the mirror pair → 2 800 and 800.
  - The other side's short clock is ignored: 22 000.
  - White on a short `wtime` → 1 900.
- **QE-A3b:** White to move with only `btime 5000` gets 22 000, the no-time-token branch. Base at level 7 gives that level's own 30 000 (QE-220-e, INFO).
- **QE-A8:** base against head, with `TimeMode` unset and set to `level`, at `Skill Level` 1–7, over 300 random `go` lines each: **4 200 rows, 0 differences** in the handed budget and limits, the output lines and the `random` draws.
- **QE-A9a:** at `Skill Level` 1–4 in the setting, 20 `go` each: 0 draws, every call from `uci-session.ts` and none through `levels.ts`, every budget 22 000. The non-vacuity check, `TimeMode level` at L1, drew 1 and went through `levels.ts`.
- **QE-A9b:** at `Skill Level` 1 in the setting, each with budget 22 000 and no `ignores` line:
  - `go depth 3` → maxDepth 3;
  - `go nodes 5000` → maxNodes 5 000;
  - `go mate 2` → maxDepth 3.
- **QE-A9c:** toggling setting / level / setting / level at `Skill Level` 6 gave 22 000, 5 000, 22 000, 5 000.
- **QE-A10a:** 8 refused values, each tried from both modes: `SIMPLE-TOURNAMENT`, `simple-tournament extra`, `simple_tournament`, `__proto__`, `constructor`, `toString`, `0` and `Level`. Each wrote exactly the A10 line, and the mode was kept.
- **QE-A10b:** name `TIMEMODE`, and extra spaces between the tokens, are both accepted silently.
- **QE-A10c:** `name Time Mode` is ignored as an unknown option. No line is written, and the mode stays `level` (QE-220-f, INFO).
- **QE-A10d:** the setting survives two `ucinewgame` and a second `uci`.
- **QE-A10e:** a BEL and an ESC in the value are dropped from the echo, and the line is printable.
- **QE-A13a–c:** these use the virtual clock and the real search, with lines queued during the search:
  - two `isready` → info, bestmove, readyok, readyok;
  - `go infinite` with `stop` and `isready` → info, bestmove, readyok;
  - `go movetime 2000` with `isready` → info, bestmove, readyok.

## Mutants (scratch copies of the `fbab54ff` archive; one unique replacement in `src/uci-session.ts`; full `npm test` plus `qrows.mjs`; each copy deleted)
- **QM1 (SE's "increment halved"):** `npm test` 1 red, the A7 increment row. QE rows red: QE-A6a, QE-A3a. **Reproduced.**
- **QM2 (SE's "C not capped by T"):** `npm test` 5 red: A3, A4, A5, the A6 1-hour clock and A9. QE rows red: A6a, A6b, A3a, A9a. **Reproduced.**
- **QM3 (SE's "case-insensitive value"):** `npm test` 2 red, the A10 `Simple-Tournament` rows. QE row red: A10a. **Reproduced.**
- **QM4 (new; the mode reads White's increment for either side):** **`npm test` stays green, 2 297 / 2 297.** QE rows red: QE-A6a, QE-A3a. This is the predicted gap, QE-220-a (LOW).
- The brief says 13 SE mutants. `se-ABC-220` `…e8314efb` lists 12.

## Deep lanes (`deep.mjs`, 14 lanes, one file at a time, heap 400, wait-clear before each)
**All 14 lanes are green: 604 / 604, rc 0 each.**
- SEARCH_DEEP: quiescence 88, search.null-move 44, search 57, search.ordering 43, search.pvs-lmr 29, transposition 40.
- ENGINE_DEEP: quiescence 75, search.ordering 30, search.pvs-lmr 21, transposition 26, engine 77, levels 45 (577.1 s).
- PUZZLE_DEEP puzzle-suite 18. CLI_DEEP cli.real-engine 11.
- These lanes are untimed records. Wait-clear held before each one. The levels lane waited 15 polls for a foreign vitest to leave.
- A11 (`ENGINE_DEEP` `src/uci-session.test.ts`, 206 / 206) and A14a (`UCI_DEEP` `src/uci.real-engine.test.ts`, 9 / 9) were read ALONE. See the timing note.
