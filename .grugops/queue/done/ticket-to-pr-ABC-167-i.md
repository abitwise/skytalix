---
subtask: ticket-to-pr-ABC-167-i
role: software-engineer
ticket: ABC-167
branch: grugops/ABC-167
tip: 660a0d50
parent: 6922f772
status: DONE — gates green; tests only; ready for review
refs: [ABC-167, QE-167-i, QE-167-j, 20261018T211100Z-qe-e2e-observation-abc167-mutants-92d6d4e6, 20261018T211300Z-qe-e2e-decision-abc167-recheck-verdict-pass-with-gaps-c02ebd96, 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30]
---

# ABC-167 QE-167-i / QE-167-j rows (tests only)

## What changed
- One commit, 660a0d50, changes only `src/uci-session.test.ts` (+59/-0). `src/uci-session.ts` needed no change.
- 7 new rows, all on step 100 (no step 1, timeout not raised). The windows come from the bapm-amend2 rule, |W - G| > 2s.

## Rows and the mutant each kills
Each mutant was run on a `git archive` scratch copy of the tip, with the new test file, at `--testTimeout=120000`, so every kill is an assertion failure. Each pattern matched exactly once. After the run, scratch `src/` was `diff -r`-identical to the worktree.

| row | input | tip | wrong build | kills |
|---|---|---|---|---|
| A7-i1 | `go movetime depth 3` | one info string (`go movetime … nothing`), depth 3, bestmove | bare go at depth >= 5 | N06, N14 |
| A7-i2 | `go wtime 1000 btime 1000 movestogo movetime 300` | warn movestogo, time 300..500 | G 50 | N07 |
| A7-i3 | `go wtime 1000 btime 1000 depth winc 1000` | warn depth (nothing), time 550..750 | G 50 | N15 |
| A7-i4 | `go searchmoves e2e4 depth 3` | warn searchmoves, depth 3 | searchmoves swallows `depth 3` | N14 |
| A7-i5 | `go depth infinite`, `stop` | no bestmove until stop, then exactly one | bestmove at once | N13 |
| A7-i6 | `go searchmoves e2e4 infinite`, `stop` | same | bestmove at once | N13 |
| A6-j1 | `go infinite`, `position fen nonsense` | `bestmove …` first, then `info string position refused: …` | order flipped | N09 (QE-167-j) |

Mutant run results: N06 → i1; N07 → i2; N09 → j1; N13 → i5, i6; N14 → i1, i4; N15 → i3. 6 of 6 killed.

## Gates (worktree content identical to 660a0d50)
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`: exit 0. Test Files 59/59, Tests 1915/1915 (1908 + 7).
- `.test-results/last-run.json`: `success: true`, numTotalTests 1915, passed 1915, failed 0, pending 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: 10/10 passed.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: 32/32 passed.

## Production-lines measurement
`git diff --name-only 32f8fc4a...660a0d50 | grep -v '\.test\.ts$' | grep '^src/'` prints:
```
src/uci-session.ts
```
The full `src` diff is exactly `src/uci-session.ts` and `src/uci-session.test.ts`. This hop leaves `src/uci-session.ts` unchanged: `git diff 6922f772 660a0d50 -- src/uci-session.ts` is empty.

## Fences kept
- No timing readings were taken. N8-LANE stays OWED.
- `plans/board.md`, `plans/traceability.md`, `../wt-ABC-146` and `../wt-secnfr-ABC-167` were not touched. No other process was touched.
- Nothing was pushed or merged to main.
- The claim directory `.grugops/queue/claimed/ticket-to-pr-ABC-167-i/` was empty and was left in place.

## Trace row (for the orchestrator to append)
| ABC-167 | grugops/ABC-167 @ 660a0d50 | src/uci-session.test.ts (src/uci-session.ts unchanged) | A7-i1..i6 (QE-167-i: N06, N07, N13, N14, N15), A6-j1 (QE-167-j: N09), mutant-checked 6/6; 1915/1915, CLI_DEEP 10/10, PERFT_DEEP 32/32 | In Review (N8-LANE OWED) |
