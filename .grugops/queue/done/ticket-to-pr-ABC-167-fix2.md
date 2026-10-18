---
subtask: ticket-to-pr-ABC-167-fix2
role: software-engineer
ticket: ABC-167
branch: grugops/ABC-167
tip: 6922f772
merge: abb95703 (git merge --no-ff main @ 32f8fc4a)
status: DONE — gates green; ready for review
refs: [ABC-167, NFR-008, 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30]
---

# ABC-167 fix hop 2: amended rows on the ruled clock steps (tests only)

## What changed
- `src/uci-session.test.ts` only (commit 6922f772, +29/-19). `src/uci-session.ts` needed no change.
- The `pinned` A5 table now carries a step for each row. Each row asserts G <= time <= G + 2*step.
- A7-f1, both halves of A7-f3, and A7-h1 now run on step 100, with the window G..G+200.
- A6-d1, A6-e1..e5 and A7-f2 were already on step 100 and are unchanged. The six unamended A5 rows keep their steps.
- The bound is kept and the timeout is not raised.

## Rows (green at the tip; each mutant was run on a scratch copy of src/ with the tip's test file)
| row | step | window | wrong build (scratch mutant) | result on the mutant |
|---|---|---|---|---|
| A5-b1 | 100 | 600–800 | increment ignored (G 100); full increment (G 1100, M04) | fails |
| A5-b2 | 100 | 100–300 | black reads winc (G 600, M06) | fails |
| A5-b3 | 10 | 200–220 | movestogo ignored (G 50, M05) | fails |
| A5-b4 | 100 | 300–500 | clock wins over movetime (G 50, M11) | fails |
| A5-b5 | 100 | 300–500 | clock wins (G 3000); max(movetime, clock G) | fails, both |
| A5-c1 | 10 | 50–70 | overhead 0 (G 100, M02); increment ignored (G 5) | fails, both |
| A7-f1 | 100 | 100–300 | keyword taken as a value (bare go, 3000) | fails |
| A7-f3 (1e2) | 100 | 3000–3200 | `1e2` read as a number (G 100) | fails |
| A7-f3 (movestogo 0) | 100 | 50–250 | `movestogo 0` accepted (G 950) | fails |
| A7-h1 | 100 | 100–300 | searchmoves runs to the end of the line (M23) | fails |
| A6-d1, A6-e1..e5, A7-f2 | 100 (as written) | unchanged | not re-run as mutants (unchanged rows) | — |

## Gates (on 6922f772)
- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`: exit 0. Test Files 59/59, Tests 1908/1908.
- `.test-results/last-run.json`: `success: true`, numTotalTests 1908, passed 1908, failed 0, pending 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: 10/10 passed.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: 32/32 passed.
- On the first lint run, biome flagged the formatting of one table row. `biome format --write` fixed it, and all the gates above were then re-run.

## Production-lines measurement
`git diff --name-only 32f8fc4a...6922f772 | grep -v '\.test\.ts$' | grep '^src/'` prints:
```
src/uci-session.ts
```
The full `src` diff is exactly `src/uci-session.ts` and `src/uci-session.test.ts`.

## Fences kept
No timing readings were taken, and N8-LANE stays OWED. `plans/board.md`, `plans/traceability.md` and `../wt-ABC-146` were not touched. Nothing was pushed or merged to main.

## Trace row (for the orchestrator to append)
| ABC-167 | grugops/ABC-167 @ 6922f772 | src/uci-session.ts, src/uci-session.test.ts | A5-b1..b5, A5-c1, A7-f1, A7-f3, A7-h1 re-stepped per bapm-amend2 (100/10); mutant-checked; 1908/1908, CLI_DEEP 10/10, PERFT_DEEP 32/32 | In Review (N8-LANE OWED) |
