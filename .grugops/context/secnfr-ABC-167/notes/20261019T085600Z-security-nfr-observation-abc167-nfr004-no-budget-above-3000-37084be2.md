---
id: 20261019T085600Z-security-nfr-observation-abc167-nfr004-no-budget-above-3000-37084be2
kind: observation
by: security-nfr
task: secnfr-ABC-167
at: 2026-10-19T08:56:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - NFR-004
  - ADR-0044
  - QE-167-i
  - .grugops/context/secnfr-ABC-167/probe/nfr004.ts
  - .grugops/context/secnfr-ABC-167/probe/nfr004.out
supersedes:
---

# ABC-167 `NFR-004` at `660a0d50`: MET. No budget above 3 000 ms leaves the session

Hand-authored and unsealed. This is not a timing reading. The evidence is the code, the A5 rows, and one probe on
`virtualClock(100)`.

## The code
- `go` makes exactly one `chooseMove` call. Its budget is `parseGo`'s return,
  `Math.min(budget, LEVELS[DEFAULT_LEVEL].budgetMs)`, where level 3 is 3 000 ms (`src/uci-session.ts:214`,
  `src/levels.ts:45`). The engine clamps again at `HARD_CEILING_MS` 5 000 (`src/engine.ts:481`).
- `depth`, `nodes` and `mate` only shorten a search. `infinite` and `ponder` hold the *line*, not the search:
  the search has already run to its budget inside `handleLine` (D5).
- **The degenerate edges:**
  - A digit string beyond 1.8e308 reads as `Infinity`, and `min` caps it to 3 000.
  - `wtime +Inf winc -Inf` makes the budget `NaN`. That `NaN` leaves the session, but it is not above 3 000. The
    engine's `Math.min` keeps `NaN` and stops after depth 1 (`src/engine.ts:478-481`).
  - A negative `movetime` reaches the engine as depth 1.

## The A5 rows (the page's evidence)
- `go wtime 60000 btime 60000 winc 1000 binc 1000`: 3 000 (G 3 500, capped).
- A bare `go`: 3 000.
- `A5-b5`: the clock alone gives 3 000 after the cap.
- `A6-d1`: `ponder`, with `HARD_CEILING_MS` capped to 3 000.
- `A7-f2`: `movetime` with no value searches as a bare `go`, 3 000.
- Each row asserts `time ≤ G + 2·step`.

## The probe (`probe/nfr004.out`)
| `go` line | `info` `time` / depth |
|---|---|
| `movetime` 9×400 | 3 100 / 5 |
| `wtime`/`btime` 9×400 | 3 100 / 5 |
| `wtime` 9×400, `winc` −9×400 (NaN) | 200 / 1 |
| `movetime -5` | 200 / 1 |
| all clocks 999 999 999, `movestogo 1` | 3 100 / 5 |
| `infinite` | 3 100 / 5 |
| `ponder wtime` 9×400 | 3 100 / 5 |

On step 100, every reading is ≤ 3 000 + 2·100, the bound A5 uses.

## QE-167-i carries no NFR-004 weight
The parse wrong builds (N06, N07, N13–N15) change which limit applies, or whether the line is held. The cap is
applied after parsing, so none of them can raise a budget above 3 000.
