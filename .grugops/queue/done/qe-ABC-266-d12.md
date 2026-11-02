---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T17:15:40Z
subtask: qe-ABC-266-d12
role: qe-e2e
ref: .grugops/context/qe-ABC-266-d12/
branch: new grugops/qe-ABC-266-d12 from main (at dispatch) — worktree .claude/worktrees/qe-ABC-266-d12; prototype the ADR-0062 D12 pool in a scratch checkout of grugops/ABC-265-fix (28ad3a8d, shared table) under the session scratchpad
width: ALONE window — no other hop of this session runs; ≤ 15 min host; wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. Multi-core inside one engine is allowed (owner OQ-2 a).
---
# ADR-0062 D12 timing probe (before any ABC-266 build)
Per ADR-0062 D12: go movetime 100 and 1000 on 20 corpus positions at Threads 1, 4, 12; record played depth. Pre-registered: if Threads 12's median depth at 100 ms is not above Threads 1's → Architect re-proposes before any build. Note foreign load (D3-V2 style) and report VOID-LOAD rather than a miss if it was loaded.
## Publish
Sealed notes (task qe-ABC-266-d12); commit; Result; brief + claim to done/. No src edits, no merge, leave nothing running.

## Result (qe-e2e, qe-ABC-266-d12, closed 2026-11-02T17:23:30Z)
- **Window:** ALONE, as the brief states (no other hop of this session ran). Hop 17:16:42Z–2026-11-02T17:23:30Z.
  - Host runs, all under `flock host-test.lock timeout`: a smoke on a non-corpus board, 17:19:27–17:19:32Z, and the measured run, 17:20:24–17:21:37Z (73.2 s, exit 0). About 78 s of host time in total.
- **Instrument:** a prototype pool per ADR-0062 D3–D6 on a scratch `git archive` of `grugops/ABC-265-fix` `28ad3a8d`, with one scratch edit (`adoptTable`, D4) under the session scratchpad. It was deleted at hop end. No worktree `src/` was touched.
  - Positions: 20 of `ABC-078` A3's 276 (indices `i % 14 == 0`).
  - One `go movetime` per cell, order rotated per position, warm-up discarded.
- **Pre-registration** sealed before the run: decision `20261102T172016Z-qe-e2e-decision-6231db75`, commit `d7aaea5e`.
- **Played depth (D6), median / min / max:**

  | movetime | Threads 1 | Threads 4 | Threads 12 |
  |---|---|---|---|
  | 100 ms | 7 / 5 / 11 | 7 / 5 / 11 | 7 / 5 / 11 |
  | 1000 ms | 10 / 8 / 13 | 9.5 / 8 / 14 | 10 / 8 / 13 |

- **Nodes, median per go (sum over 20):**

  | movetime | Threads 1 | Threads 4 | Threads 12 |
  |---|---|---|---|
  | 100 ms | 81 696 (1.66 M) | 321 152 (6.51 M) | 672 594 (13.67 M) |
  | 1000 ms | 812 288 (17.2 M) | 3.20 M (68.5 M) | 6.81 M (145.6 M) |

  - At T12 a worker runs at about 0.69 of a single thread's rate; at T4, about 0.98.
- **Per position, T12 against T1 at 100 ms:** above 1, equal 15, below 4.
  - All 12 workers completed the same depth in 19 of 20 searches.
  - D6's deepest-completed rule beat worker 0 once.
- **Rule outcome: MISS** (median T12 7, not above median T1 7). The phase was not loaded:
  - foreign cores 0.454 (bar 0.8);
  - 2 of 20 blocks above 0.8 (bar 4);
  - 0 foreign vitest or `cutechess-cli`;
  - Tctl at most 79 °C;
  - no foreign process above 20 % of a core.

  So it is not VOID-LOAD. By the rule, **the Architect re-proposes before any `ABC-266` build.**
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from `date -u`; 4 of 4 read back, index rendered):
  - decision `…6231db75` (pre-registration);
  - observation `20261102T172256Z-qe-e2e-observation-cc1de664` (results and load);
  - decision `20261102T172256Z-qe-e2e-decision-9f9aeb87` (verdict MISS);
  - observation `20261102T172303Z-qe-e2e-observation-dfbfebb2` (artifacts). An artifact-ref was refused because it needs a §14-gate run id, which this probe does not have, so the artifacts were recorded as an observation. Nothing was faked.
- **Commits:**
  - claim `b082549a`;
  - pre-registration `d7aaea5e`;
  - notes and raw `d02cbfe0`;
  - this Result and the move to done/ in the closing commit.

  Not pushed, not merged. No process was killed, nothing is left running, and the scratch copy is deleted.
- **Open:**
  - Orchestrator: route to the Architect (re-proposal: helper diversity, D3, or ADR-0058 deeper-entry at `Threads ≥ 2`, each with its own probe).
  - Board: no move by this hop.

### Trace row (10 cells, header order)

| qe-ABC-266-d12 | ADR-0062 D12 timing probe on a prototype pool (ABC-265-fix 28ad3a8d + scratch adoptTable): 20 A3 positions × movetime 100/1000 × Threads 1/4/12; median played depth 100 ms 7/7/7, 1000 ms 10/9.5/10; 12 workers same depth 19/20; T12 per-worker rate ≈ 0.69; MISS, not loaded (fc 0.454) | EPIC-011 | ADR-0062 (PROPOSED; D12 MISS → Architect re-proposes) | — | `grugops/qe-ABC-266-d12` (claim `b082549a`, prereg `d7aaea5e`, notes `d02cbfe0`) | scratch probe only (deleted; raw kept) | — (probe, not a gate) | — | D12 MISS; awaits the Architect's re-proposal before any ABC-266 build |
