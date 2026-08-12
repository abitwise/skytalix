---
id: 20260812T204500Z-factory-coach-artifact-ref-metrics-filled-0b844c19
kind: artifact-ref
by: factory-coach
at: 2026-08-12T20:45:00Z
verified_by:
confidence: high
refs:
  - delivery-audit-2026-08-12
  - plans/metrics.md
  - NFR-008
  - ABC-026
  - EPIC-001
  - EPIC-006
supersedes:
---

# `plans/metrics.md` is filled — all nine frozen rows, measured, with two honest `UNKNOWN - verify`

**Artifact: `plans/metrics.md`.** The one file outside these notes that this hop wrote. The metric
SET is unchanged — **nine rows, none added, none renamed, none removed.** Four rows that had never
carried a value now carry one; `Lead time`'s "no data" is retired.

## The snapshot, one line per row

| Row | Value now |
|---|---|
| **Throughput** | **25 of 30** tickets `Done`; **1.19 tickets/day** over 21 days; **17** reached `Done` after 2026-07-31, the date this row last read *"0 since 2026-07-24"* |
| **Cycle time** | **`UNKNOWN - verify`** as literally defined — the `Ready for Dev` timestamp does not exist for 21 of 25. Proxy (first `src/` commit → merge): **median 1 day, n=10** |
| **Lead time** | **2 days median / 4.6 mean, n=25** — and **bimodal**: gate-cut tickets **1 day**, epic-decomposed tickets **9 days** |
| **WIP** | **0 in every working column**; `Backlog` 5. **No limit ever reached, no override ever taken in 30 tickets.** The 2026-07-31 queue warning **did not come true** — open tickets 13 → 5 |
| **Blocked time** | **2 tickets, 2 events, ~1 day total, median 0.5 day**; neither escalated against a 2-day threshold |
| **Rework rate** | **9/25 tickets (36%) bounced; 13 backward moves.** First ten to `Done`: 1 ticket / 1 move. Last ten: **7 tickets / 11 moves** |
| **Gate pass rate** | mechanical **0/8 first-pass, 8/8 after ≤1 self-fix** (2026-07-23, unchanged); judgment gates **16/25 = 64%** overall, **100%** first eight, **30%** last ten; one **FAIL** ever (`ABC-027`); one required step that **has never run** |
| **Escaped defects** | **0** literally — *and the detector has never been switched on*. Analogue: **3** behavioural defects escaped merge (`ABC-009`, `ABC-011`, `ABC-022`), all from the 2026-07-24 merges, all fixed; **0 since 2026-08-04** |
| **Velocity** | **Not applicable** — kanban, `plans/sprints/` empty, zero sprints. Kanban analogue: **68 points / 25 tickets / 21 days = 3.2 points/day**; open backlog **10 points ≈ 3 days** |

## What I deliberately did NOT do to that file

- **No invented row.** The supporting production-vs-test line series and the lane timing live in a
  `## Method` section **below** the table, explicitly labelled as method and not as a metric.
- **No silent zero.** `Escaped defects` is the row where a bare `0` would have been the most
  flattering and the most dishonest number in this repository. It reads `0` **and immediately says
  the measurement channel does not exist** — UAT deferred → `EPIC-006` on all 25 `Done` tickets, no
  environment, nothing deployed, no CLI entry point.
- **No estimate wearing a number's clothes.** `Cycle time` says `UNKNOWN - verify` and names the
  missing input (one dated transition line per column move, which no convention requires today)
  rather than back-filling a plausible median.
- **No discharging of another lane's debt.** I measured the default test lane over 7 runs — wall
  median **1.98 s**, CPU median **9.51 s**, against `NFR-008`'s ≤3 s / ≤13 s, on the exact
  environment `NFR-008` names (Node v24.12.0, vitest 3.2.7, 8 logical cores). **That does NOT
  discharge `H5`** and the file says so: my runs were sequential, not interleaved as `NFR-008`
  requires, and `node_modules` was symlinked from a sibling worktree. `H5` stays
  `UNKNOWN - verify` and stays owned by `ABC-026`. The number is recorded only so the hop that
  does own it starts from something instead of nothing.
