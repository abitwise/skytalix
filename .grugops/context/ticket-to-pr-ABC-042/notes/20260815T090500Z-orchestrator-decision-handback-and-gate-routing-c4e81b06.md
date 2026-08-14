---
id: 20260815T090500Z-orchestrator-decision-handback-and-gate-routing-c4e81b06
kind: decision
by: orchestrator
at: 2026-08-15T09:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - NFR-008
  - ADR-0011
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Orchestrator Decision — `ABC-042` hand-back accepted, `In Development` → `In Review`, two hops scheduled

## Request type
`ticket-to-pr`, continued — the Software Engineer's hand-back and the gate routing that follows it.

## Mode / Cadence / Autonomy
`lean` / `kanban` / `pr`. `gate_enforcement: blocking`, `security.block_on: high`,
`queue.wip_limit: 3`.

## Activated agents
**QE/E2E** (`quality-gate-ABC-042`) and **Security/NFR** (`security-nfr-ABC-042-gate`), **width 2
against a cap of 3.** They read the same shared context and neither consumes the other's output, so
they run concurrently. BA/PM and Architect/Design are deliberately **not** scheduled — see below.

## An exit I took that was not mine, said first because it is the thing I would otherwise be hiding

**Workflow 04 assigns `In Development → In Review` to the Software Engineer.** I took it. The reason
is that *my own subtask file* forbade that hop from writing `plans/board.md` and
`plans/traceability.md`, so the role that owns the exit was the one role structurally unable to
perform it. The engineer noticed and recorded it as `G3`/`G4` — owed, to me.

That is a defect in how I wrote the subtask, not in how the engineer worked. It is recorded on the
board row, on the trace row and here, because the alternative is a record in which the engineer
appears to have skipped its own exit. **The general lesson, for the next pull hop: forbidding a role
its own workflow-assigned board move creates work the coordinator must then do, and a gap the role
must then report.** Either grant the narrow write or expect to take the move.

## Why I accepted the hand-back without re-running the gate

The gate is QE's under Workflow 05 and re-running it here would be the coordinator doing the
specialist's job. I verified only what I need to **route** — and I verified it rather than taking it
on report:

| checked | command | result |
|---|---|---|
| `main` untouched | `git log --oneline -1 main`, `git status` | `7df25b9`, clean |
| branch shape | `git log 7df25b9..grugops/ticket-to-pr-ABC-042` | 3 commits, as reported |
| **`A12`'s diff scope** | `git diff --name-only e140355~1 e140355` | **exactly `A12`'s six paths** |
| whole-branch scope | `git diff --name-only 7df25b9 grugops/…` | 15 paths — 6 delivered + 9 substrate |

**The gap between those last two rows is the interesting one, and the engineer closed it before I
saw it.** `A12` says `git diff --name-only` shows exactly six paths and nothing else. Workflows 16
and 17 **mandate** note and queue writes. So the whole-branch reading of `A12` is violated by every
conforming build — this ticket's recurring defect class, a fourth time. The engineer **isolated the
delivered change in `e140355`**, against which `A12` is checkable exactly as written, and recorded
that reading rather than leaving it implicit. **I confirmed the file list myself.** No criterion
needed to move. This is the class being *handled* instead of *discovered at the gate*, which is what
the last two hops were for.

## `G1` — the one that is different, and how I routed it

`N8-LANE` breached: **1240 ms CPU against a 650 ms bar**, ~1000 ms of it ten child spawns, and the
ten are **criteria-forced** (`A1` 1, `A4` 3, `A5` 1, `A6`(iii) 4, bar 3 1). No conforming build is
cheaper.

**This is the third instance on this ticket of "a stated rule and a conforming build cannot both
hold" — and the first that cannot be answered by deleting a criterion.** `A10` and bar 1 were fixed
by deletion because the defect was in the *wording*. Here the criteria are not defective; they are
simply expensive, and the bar is what they are spent against. Deleting criteria to fit a bar would
be **cutting the instrument to make the measurement pass** — the exact move Architect/Design refused
when it declined to write an ADR widening a rule so that what ships passes.

`N8-LANE` derives from `NFR-008`, and `plans/nfr-catalog.md` / `ADR-0008` are **owner-ratified**.
So I routed it to Security/NFR **with the limit stated in the subtask**: rule, recommend, and
**escalate to the owner if the answer is that the bar must move — do not move it.** I did not rule
on it myself; the NFR reading is theirs, and an Orchestrator quietly deciding that an owner-ratified
bar does not bind is how a factory stops having bars.

I also did not treat "medium" as "ignorable". `block_on` is `high`, so `G1` does not automatically
block — but a stated bar is breached, and a ticket cannot leave review on the strength of nobody
having ruled.

## What I deliberately did NOT schedule
- **BA/PM** for `G2`, `G5`, `G7`, `G8` — four low-severity wording items. Batched until after the
  gate so BA/PM does **one** hop over the full set, including whatever QE and Security add.
  Scheduling it now would guarantee a second hop.
- **Architect/Design** for `G6` — `ADR-0011` clause 3's **dated trigger has fired** ("game-owning
  driver" now describes a composition root). Non-blocking, and it was already flagged as owed at
  `ABC-042` by the `ABC-041` hop. It is recorded, owned and unscheduled — not forgotten.

Both are named on the board row and the trace row so they cannot quietly lapse.

## Stop conditions honored
- **I did not re-run QE's gate or Security's review.** Routing verification only.
- **I did not rule on `G1`**, and I stated the limit on the role that will.
- **I did not tick off a criterion.** 12/12 MET is the engineer's report; confirming it is QE's.
- **I did not rewrite the stale NFRs cell** in the trace row for the third time — it is Security's,
  and their subtask now says so explicitly.
- **No gate is claimed by this hop.** Zero bytes under `src/` changed by me.
- **Not merged, not deployed.**

## Next action
QE/E2E and Security/NFR run concurrently off `8b07d9f`. On their return: BA/PM in one batched
wording hop, then the `In Review` exit and the merge decision — the merge under the owner's standing
directive, gated on the branch tip before and on `main` after, both recorded.
