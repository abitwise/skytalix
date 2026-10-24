---
subtask: se-lane-ABC-212
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/se-lane-ABC-212/
branch: new grugops/se-lane-ABC-212 from grugops/ABC-212-final (2079e0df), worktree ../wt-se-lane-ABC-212
width: 1 of 3 (only hop running; no real-clock timing)
---

# ABC-212 lane-cost fix (AR-212-LANE, required)

## Do
- Read `security-nfr-ABC-212/…550e067d` (why: `npm test` 10.34/10.81 s head vs 8.73/9.11 s base; bound 10 s) and Security's `…e2c5d6b9` §4 + `raw/n8-indicator.txt`.
- Under page `A12`'s budget-read arm (Amendment 2026-10-24 item 2), cut the cost of the 9 new `A9` rows in `src/uci-session.test.ts` (7 search at ~150 ms each) to a total ≤ 650 ms, keeping `A9`'s acceptance covered. Touch test rows this ticket added only; no production `src/` change. If `A9` cannot stay covered that way, or a pin outside `A13`'s list would move: STOP and name it (→ BA/PM).
- Show each changed row still reds under a plant of the bound it guards.
- Gates: lint, typecheck, build, `npm test` (report Duration, and per-file time for `src/uci-session.test.ts` at base `2079e0df` and head, paired, only when no foreign vitest runs — pause until clear). `UCI_DEEP` lane once.

## Fences
- Only your worktree and `<scratchpad>/se212lane/`. No production code edits. No ENGINE_DEEP or real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task se-lane-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, no STOP.** Under `A12`'s budget-read arm (§ Amendment 2026-10-24 item 2), six of the seven searching `A9` rows in `src/uci-session.test.ts` now read the budget `go` hands `chooseMove`, without searching. They assert exact G, one engine call, no depth or nodes limit, 0 seeds drawn, and `bestmove` from the engine's answer. The bare `go` at 7 keeps its virtual-clock search because it crosses `HARD_CEILING_MS` (P2). `go depth 3` keeps its 4 ms search. A call-through `vi.mock("./engine.ts", { spy: true })` (the `command-input.test.ts` precedent) carries the read, with `mockReset` in the describe's `afterEach`. Tests only: no production line, no row outside the ABC-212 A9 block, no `A13` pin, row count 9 → 9. Branch `grugops/se-lane-ABC-212` in `../wt-se-lane-ABC-212`, from `2079e0df`. Tip **`814b92a0`**: `8c1d0e6c` (test, +73/−23), then `814b92a0` (notes and raw). Not pushed, not merged.

- **Plants** (scratch copies, never `src/`; unplanted control 9/9 green). Every changed row reds under its bound:
  - L6 budget 4 000 → the 6 row;
  - P1 → 5 rows;
  - L7 rate 0.01 → 7 rows;
  - P2 clamp 5 000 → bare `go` 7 + value 0/8;
  - level cap off → 5 rows;
  - G cap off → `movetime 1000`;
  - movestogo 30 → `wtime`;
  - invalid value resets → value 0/8;
  - info text 1-5 → value 0/8;
  - P3 `max 5` → the `uci` row.
- **Paired timing** (one worktree, only the test file swapped; ABBA; waited for `pgrep` empty before each run and sampled during):

  | reading | base `2079e0df` | head `8c1d0e6c` |
  |---|---|---|
  | `npm test` Duration (clean) | 9.07–9.38 s (n=6, mean 9.21) | 8.58–8.82 s (n=4, mean 8.72) |
  | `src/uci-session.test.ts` wall | 4 362–4 632 ms | 3 546–3 624 ms |
  | A9 slice | 1 050–1 143 ms | 155–160 ms (≤ 650) |

  Two head runs overlapped a foreign vitest (9.54, 9.55 s) and are discounted. This window is not the Orchestrator's sentinel: base read below the 10.34/10.81 s it saw for the same line.
- **Gates at `8c1d0e6c`:** lint rc 0; typecheck rc 0; build rc 0; `npm test` 62 files 2 066/2 066, `success: true`; skips 0, `No findings.`; `UCI_DEEP` 5/5.
- **Notes** (sealed by grugops 2.1.0 `admitAndAppend`, read back 2/2, index rendered, on the branch): `.grugops/context/se-lane-ABC-212/notes/` decision `20261024T130823Z-software-engineer-decision-a6f0ce67`, observation `20261024T130823Z-software-engineer-observation-fcbbf321`; raw `lane-timing.tsv`, `plants.txt`. Scratch `<scratchpad>/se212lane/`.
- **Owed:** QE's short re-check of `A9` and the lane rows. It should rule whether budget-read rows suffice for `movetime 60000`, `wtime` and the level-6 `go`, which no longer read the engine completing at G for that request shape (`UNKNOWN - verify`). After that comes the Orchestrator's merge with the sentinel re-read.

### Trace row (10 cells, header order)

| ABC-212 (se-lane-ABC-212) | levels 6 (5 s) and 7 (30 s), rate 0, at every surface; default stays 5 — AR-212-LANE lane-cost fix: A9 rows on A12's budget-read arm (tests only) | EPIC-004 | — | NFR-008 (N8-LANE slice 155–160 ms ≤ 650); A12 § Amendment 2026-10-24 item 2; notes …a6f0ce67, …fcbbf321 | grugops/se-lane-ABC-212 @ 814b92a0 (test 8c1d0e6c)<br>src/uci-session.test.ts; .grugops/context/se-lane-ABC-212/ | lint/typecheck/build 0; npm test 2066/2066; paired Duration head 8.58–8.82 s vs base 9.07–9.38 s (clean); UCI_DEEP 5/5; skips 0, No findings.; plants 10/10 red | signed by QE verdict (unchanged; QE re-check of A9 owed) | — | In Development (QE A9 re-check, then merge with sentinel re-read) |
