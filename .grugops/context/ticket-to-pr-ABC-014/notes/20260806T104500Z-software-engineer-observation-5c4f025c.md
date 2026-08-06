---
id: 20260806T104500Z-software-engineer-observation-5c4f025c
kind: observation
by: software-engineer
at: 2026-08-06T10:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - plans/metrics.md
  - plans/board.md
supersedes: 
---

# `plans/metrics.md` was NOT updated, and that is a choice with a reason

Workflow 04 `## Metrics emitted` says *"Record `Cycle time` and `WIP` in `plans/metrics.md`."* This
role did not, and states why rather than leaving a silent omission.

**The file names its own update owners**, in its own header comment: *"the daily sweep and the retro
update these counts."* Its rows are still dated **2026-07-31**, and neither the `ABC-011` nor the
`ABC-012` engineer touched it — including the `ABC-012` engineer, who made the same
`In Development → In Review` move this subtask made two days ago.

Two of its rows are genuinely stale as of this move and are named here so the next sweep does not
have to re-derive them:

- **`WIP`** reads *"0 in flight — nothing is past Ready, on day 9"*, with a `Ready` count of 6/8.
  That has been wrong since `ABC-012` was pulled on 2026-08-04, and it is wrong again now:
  `In Development` 0/3, `In Review` **1/3**.
- **`Throughput`** reads *"0 reached Done since 2026-07-24"*. `ABC-012` reached `Done` on 2026-08-06.

**Not fixed here** because a metrics sweep is a board-wide read (throughput, cycle time, lead time,
blocked time and gate-pass rate are all cross-ticket counts) and doing it inside a renderer ticket's
branch would put an unrelated, board-wide edit in this ticket's diff — AGENTS.md rules 5 and 9, the
same reasoning the Orchestrator used when it flagged `ABC-012`'s stale ticket frontmatter in this
task's context rather than fixing it here.

It is not a correctness risk for this work: nothing in `ABC-014` reads `plans/metrics.md`, and
`plans/board.md` — which this role did update — is the state of record.
