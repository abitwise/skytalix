---
id: 20261024T130823Z-software-engineer-decision-a6f0ce67
kind: decision
by: software-engineer
at: 2026-10-24T13:08:23Z
verified_by: 
confidence: high on the edit, plants and gates; A9 sufficiency of the budget-read rows UNKNOWN - verify (QE re-check)
refs:
  - ABC-212
  - AR-212-LANE
  - NFR-008
  - N8-LANE
  - A9
  - A12
  - A13
  - grugops/se-lane-ABC-212
  - 8c1d0e6c
  - 2079e0df
  - security-nfr-ABC-212/20261024T135200Z-orchestrator-decision-550e067d
  - security-nfr-ABC-212/20261024T124433Z-security-nfr-decision-e2c5d6b9
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:88d3fff6170f276a9eb3049eec5966d6fa26d39f9f2e91f45fa818f5841e9385
---

# ABC-212 lane cost (AR-212-LANE): six A9 rows take A12's budget-read arm; the A9 slice drops from about 1 050 ms to about 157 ms

Software Engineer, task `se-lane-ABC-212`, branch `grugops/se-lane-ABC-212` in `../wt-se-lane-ABC-212`, from `2079e0df`; commit `8c1d0e6c` (tests only, `src/uci-session.test.ts` +73/−23). Licence: page `A12` as amended (§ Amendment 2026-10-24 item 2), the budget-read arm, routed by the Orchestrator (`…550e067d`). Not pushed, not merged.

## What changed (only the ABC-212 A9 block, plus its harness)
- **A call-through `vi.mock("./engine.ts", { spy: true })`** at file top, the `command-input.test.ts` precedent. Every other row calls the real `chooseMove`. The A9 describe restores the call-through in `afterEach` (`mockReset`), so a stub cannot leak into a later row.
- **Kept on the search arm (virtual clock, step G ÷ 30, `ABC-167` `A5`'s bound):** `setoption … value 7` + bare `go` searches 30 000 ms (the only row that crosses `HARD_CEILING_MS`, so it guards P2), and `go depth 3` at 7 (about 4 ms).
- **Moved to the budget-read arm** (`chooseMove` replaced for that row by a stub that records its options and answers e2e4. It does not search). Each row asserts exactly one engine call with options `{ budgetMs: G }` (no depth or nodes limit), `draws.count` 0 (rate-0 path, D11), and `bestmove e2e4`:
  - bare `go` at 6 → 5 000;
  - `go movetime 60000` at 7 → 30 000 (the level caps G);
  - `go movetime 1000` at 7 → 1 000 (G caps the level);
  - `go wtime 600000 btime 600000` at 7 → 30 000;
  - `Skill Level value 0` / `8` at 7 → the exact 1-7 info string, then a bare `go` hands 30 000 (7 kept).
- Row titles "searches N" → "hands the engine N" on the moved rows. The assertion is now exact G, not `G ≤ time ≤ G + 2·step`. How the engine honours a budget on the virtual clock is still read by `ABC-167` `A5` at levels 1–5 and by the kept bare `go` at 7.
- **Not touched:** production `src/`, every row outside the ABC-212 A9 block, the row count (9 → 9; 137 in the file, 2 066 in the lane). No A13 pin moved, so no STOP.

## Why A9 stays covered
Every A9 bullet keeps a row that reds when its bound is planted (raw `raw/plants.txt`, scratch copies, never `src/`): L6 budget 4 000 → the 6 row; P1 L7 budget 3 000 → 5 rows; L7 rate 0.01 → 7 rows; P2 clamp 5 000 → the bare `go` at 7 plus value 0/8; level cap removed → 5 rows; G cap removed → `movetime 1000`; `DEFAULT_MOVES_TO_GO` 30 → `wtime`; invalid value resets to default → value 0/8; info text 1-5 → value 0/8; P3 `max 5` → the `uci` row. Unplanted control 9/9 green.

## Residual (UNKNOWN - verify; QE's re-check)
For `movetime 60000`, `wtime` and the level-6 `go`, the default lane no longer reads the engine *completing* a level-6 or level-7 search at G on the virtual clock for that request shape. Only the hand-off is read. The engine half is one function shared by every shape, and it is read at 30 000 by the kept row. QE's re-check rules whether that is sufficient for A9.
