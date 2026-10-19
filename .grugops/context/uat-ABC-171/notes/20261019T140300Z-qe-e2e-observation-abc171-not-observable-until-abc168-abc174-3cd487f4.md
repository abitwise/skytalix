---
id: 20261019T140300Z-qe-e2e-observation-abc171-not-observable-until-abc168-abc174-3cd487f4
kind: observation
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:03:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-168
  - ABC-174
  - ABC-175
  - ADR-0044
  - ADR-0045
  - NFR-004
  - NFR-006
  - NFR-008
  - R-171-1
  - R-167-2
  - QE-171-e
  - UAT-171-a
  - UAT-171-c
  - 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
supersedes:
---

# What `ABC-171`'s UAT cannot observe, and which ticket can

This note is hand-authored and unsealed. Nothing below was graded, and no scenario was invented for it.

## Until `ABC-168` (the `skytalix` binary, `src/uci.ts`, stdin/stdout)

| not observable here | why | where it becomes observable |
|---|---|---|
| A **real GUI** setting the options: the cutechess-cli `option.Skill Level=1` flag, En Croissant's options panel, Lichess's provider | there is no process to start; the harness stands in for the GUI | `ABC-168`, once `skytalix` runs |
| **The real book file**: `readBookFile` bound as `read`, the 1 MB bar on a real file (NFR-006), one read per **process** | `readBookFile` is bound in `uci.ts` (page § Out of scope). Here the harness injects bytes, and each session has its own probe | `ABC-168` |
| **The bad-book warning reaching the GUI** as `info string opening book … playing on without it` (QE-171-e) | `warn` is a probe argument that `uci.ts` binds. S5 sees one `warn` call per bad book and no written line | `ABC-168`; its page pins `warn` → `info string`, and D10's exact wording is INFO for its QE |
| **Varied openings**, the owner's value: the book's weighted pick with `Math.random` | `uci.ts` binds `Math.random`. Here the book's `random` is `seededRandom(7)` per session, so one entry gives one reply (S3: `e7e5` 8 of 8) | `ABC-168` |
| **Real time at levels 1–2**: how long a blunder move really takes and what a GUI's clock is charged (`UAT-171-a`). Also whether level 5's 4 500 ms gets a GUI flagged on a short real clock | the session reads only the injected clock; this UAT took **no timing reading** by its brief. On a virtual clock, a blunder's `time` is a clock-read count (810 at step 10) | `ABC-168`, on `Date.now`. On record: `secnfr-ABC-087` read level-1 blunders at a maximum of 498–589 ms |
| **`isready` latency while the book loads** (D10 warms it at the first `isready`) | in-memory bytes take no real time, so nothing here can be slow | `ABC-168` |
| **NFR-008 N8-LANE** (the lane delta of the new rows) | OWED: no admissible quiet window. The owner accepted R-171-1 (`…2b7f4c88`) | the next admissible lane reading, which clears R-171-1 and R-167-2 together |

## Until `ABC-174` (ADR-0045's re-cut, accepted but not built here)

- **The re-cut table.** Levels become 100 / 0.4, 180 / 0.2, 330 / 0.1, 1 000 / 0.05 and 3 000 / 0, so levels 1–4
  blunder and only level 5 searches through `chooseMove` with the D12 limits.
- **`default 5` on the `uci` line, read from `DEFAULT_LEVEL`.** Today it is the literal `default 3` beside a session
  that starts at `DEFAULT_LEVEL` = 3 (`UAT-171-c`).
- **"Level 5 plays as today's level 3"** (3 000 ms, rate 0).
- **What this harness does when that lands.** S0 pins today's table and default, so it will FAIL on `ABC-174`'s
  tree by design. S2, S6 and S9 read the budgets from that same table. Re-running this UAT for `ABC-174` means
  updating `TABLE` / `DEFAULT` to ADR-0045's values and nothing else. The session's own rule is "a level's path is
  chosen by its rate, not its number", and S6's `shapeOf` already reads the path from the rate.
- **The re-take of the level verdict** (ADR-0045 D6) is `ABC-175`'s, and it is not a UAT item here.

## Not in v1 at all (ADR-0044 D6), so not owed by any ticket in this epic

- `UCI_Elo`, `UCI_LimitStrength`, `Hash`, `Threads`, `MultiPV` and `Ponder`. S2 shows each is ignored and changes
  nothing. There is also no seed option; S2 sent none.
- Forwarding `depth` / `nodes` / `mate` at a blunder level. S6 shows they are dropped with one line.
- Any Elo claim for a level.
