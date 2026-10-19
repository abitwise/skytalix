---
subtask: ticket-to-pr-ABC-171-rows
role: software-engineer
ticket: ABC-171
branch: grugops/ABC-171 @ 9ae31679
worktree: ../wt-ABC-171
---

# Add ABC-171's amended rows (A8 reworded, A13a–d); tests only

## Setup

In `../wt-ABC-171`, run `git merge --no-ff main`. That brings in two things:
- the amended page (`bapm-adr0045-cut`);
- main's fix that re-steps the A4-a2 and A8 mate-1 rows to step 100 (`a259a926`).

Resolve any conflict in `src/uci-session.test.ts`, keeping both sides.

## Write the rows

Write these rows exactly as the page states them. They are also listed in `.grugops/queue/done/bapm-adr0045-cut.md` § "Exact rows for ABC-171's SE hop".

| Row | What it covers | Mutants it must kill |
|---|---|---|
| A8 | reworded: draws per `ucinewgame`, a searched blunder `go`, a book hit, rate 0 | — |
| A13a | the seed oracle (k = 1..8; non-vacuous) | S32, S33 |
| A13b | a book hit at blunder levels draws 0 | S25, S31 |
| A13c | the dropped-limit line for `nodes`, and for `depth` + `nodes` + `mate` together | S38, S39 |
| A13d | an invalid `OwnBook` keeps `true` | S12 |

Each row must be green at the tip and must turn its named mutants red. Check that on scratch copies; QE's harness is at `.grugops/context/qe-ABC-171/probe/mutants3.mjs`.

## Rules for the rows

- Use coarse clock steps (100) wherever a search runs. No row may run a bare `go` on a step finer than 100.
- Do not raise any timeout.
- `src/uci-session.ts` should not need a change. If it does, stop and report.

## Gates (on your tip)

- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`
- `last-run.json` shows `success: true` with the full count.
- integrity at skip 0
- `CLI_DEEP` 10/10
- `PERFT_DEEP` 32/32
- the R-167-1 grep on added production lines

## Fences

- No timing readings.
- Do not touch `plans/board.md`, `plans/traceability.md`, `../wt-arch-ABC-173-adr0008`, or any process you did not start.
- Never push. Never merge to main.

## Handoff

Write `.grugops/queue/done/ticket-to-pr-ABC-171-rows.md` and `.claim.md` in main's working tree, uncommitted. Include:
- the tip
- the rows, with the mutants each one kills
- the gates
- the production-lines measurement
- a trace row

---

## Result (software-engineer, 2026-10-19)

- **Tip:** `5dee231c` on `grugops/ABC-171` in `../wt-ABC-171`. Not pushed, not merged.
  - `183dafd7`: `git merge --no-ff main` (`55a1e223`). No conflict. It brings `a259a926` and the amended page.
  - `b62baabc`: the rows. `src/uci-session.test.ts` only, +114/−3, 17 new tests (101 → 118 in the file).
  - `5dee231c`: the notes (below).
- `src/uci-session.ts` needed no change, and none was made.

### Rows and the mutants they kill
Checked with QE's `mutants3.mjs` on a scratch copy of the tip (file mode). All 7 named mutants are **KILLED**, each by the intended row, and the copy was restored.

| Row | Tests | Kills |
|---|---|---|
| A8 (reworded) | existing row kept and moved from step 10 to 100; +1 row: each blunder level's searched `go` draws exactly 1 seed (levels read from `LEVELS`) | — |
| A13a | non-vacuity ×2 (oracle moves not all equal; the `2^16` seed differs on some k) + 8 rows, one per k = 1..8, 8/8 | S32 (k=2,4,6,…), S33 (k=2,3,4,…) |
| A13b | precondition + levels 1 and 2: exactly `info string book`, `bestmove e2e4`; no `info depth`; 0 draws | S25, S31 (both levels) |
| A13c | `go nodes 100`; `go depth 3 nodes 100 mate 2`: 3 lines, exactly one `info string` naming the tokens, a level line with no `score`, then `bestmove` | S38 (both rows), S39 (combined row) |
| A13d | `OwnBook value maybe` on a fresh session: one `info string`, then the book still answers | S12 |

- k = 1..8 on the start position was non-vacuous for both clauses, so k was not widened.
- Every row that runs a search uses step 100. No timeout was raised.

### Gates on `b62baabc` (src identical at `5dee231c`)
- lint, typecheck and build exit 0. `npm test`: 59 files, **1962/1962**.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1962, 1962 passed, 0 failed, 0 pending.
- `test-skip-integrity .grugops/test-skips.md --skip-count 0`: `No findings.`
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: **10/10**.
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: **32/32**.
- `git merge-tree --write-tree main HEAD`: clean.
- No timing readings were taken.

### R-167-1
- `git diff -U0 183dafd7 b62baabc -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`: **no hits**.
- The same grep on `git diff -U0 main...HEAD -- src/uci-session.ts`: **no hits**.

### Production-lines measurement
- This hop: `git diff --name-only 183dafd7 b62baabc | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, so **0** production lines.
- Branch against main: `src/uci-session.ts` +97/−15 (from `b6afd021`). Not zero, so the UAT waiver does not apply.

### Notes
Under `.grugops/context/ticket-to-pr-ABC-171-rows/notes/` on the branch: decision `…a171r001`, observation `…a171r002`, artifact-ref `…a171r003`. They are hand-authored and unsealed, because this install has no `context-io.ts`.

### Fences
- `plans/board.md`, `plans/traceability.md` and `../wt-arch-ABC-173-adr0008` were not touched.
- No background process was started.

### Trace row (for the Orchestrator)
`| ABC-171 | EPIC-007 / ADR-0044 D2, D3, D10, D11; amended bapm-adr0045-cut | grugops/ABC-171 @ 5dee231c (rows b62baabc; code b6afd021) | src/uci-session.ts, src/uci-session.test.ts | uci-session.test.ts ABC-171 A1-A13d (A8 +1, A13a-d 16 new; 118 in file; 1962 total) | A1-A13 MET; S12/S25/S31/S32/S33/S38/S39 killed; N8-LANE delta owed at gate | In Review (re-QE on rows) |`
