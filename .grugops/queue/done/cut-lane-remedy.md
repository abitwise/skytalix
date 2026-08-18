---
task: cut-lane-remedy-2026-08-19
subtask: cut-lane-remedy
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ticket: —
ref: .grugops/context/cut-lane-remedy-2026-08-19/
parent_ref: .grugops/context/design-oq1-lane-budget-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T19:00:00Z
branch: grugops/cut-lane-remedy
base: main @ 1063eb4
---

# Subtask: cut the remedy ticket `ADR-0014` owes, and re-score `ABC-108`'s unsatisfiable `A1`

Read `parent_ref:` (Architect/Design's notes and raw per-run TSVs) and
`memory-bank/50-decisions/ADR-0014-the-default-lane-cpu-budget-is-overdrawn.md` first.
**The measurements are taken under a stated protocol, out of tree, with the contamination sized
rather than denied. Do not re-derive them and do not soften them.**

## 1. Cut the remedy ticket — `P0` by `ABC-108`'s own trigger

`OQ-1` is ruled: **`NFR-008`'s CPU clause is BREACHED — 14.480 s against 13 s (111.4%)**, ruled on
the *lower* of two samples deliberately. `ABC-108` said in advance that if a reading came back over
13 s the remedy ticket is `P0`. **It did. Cut it.**

**Architect/Design explicitly declined to cut it and explained why** — cutting tickets and assigning
ids are yours, and inventing an id would have fabricated a board state. It also flagged that
`ABC-108`'s trigger says *"on a quiet machine"* and this was **not** one, so the trigger is met **on
substance** (1.9% measured contamination against a 10.2% breach), **not because `A1` passed**.
**Carry that distinction onto the page.**

**The sizing that must be on the ticket, because it kills the obvious remedy:**
**~70% of this lane's CPU is the per-file floor, not test execution** (~4.2 s of 14.5 s). **Trimming
assertions cannot close the gap** — only moving *whole files* removes their floor, and the deficit
is ~4 average files' worth.

**Two levers are NOT yours and must be named as not-yours on the page:**
- **`isolate: false`** (30–36%) — forbidden by `ADR-0008`. Recorded as unavailable; **do not let a
  later reader rediscover it.**
- **Moving the 13 s level** — the owner's outright.

And the third, which is the reason this escalates: **moving whole files behind opt-in flags changes
what the default lane guarantees**, which is a change to something the owner ruled. **Cut the
problem and the options with their sizing; do not choose.**

## 2. Re-score `ABC-108`'s `A1` — it is UNSATISFIABLE AS WRITTEN

`A1` requires load ≤ 1.0 per round. Architect/Design measured the lowest load available anywhere as
**1.44**, and showed the criterion is unsatisfiable *in principle* for this lane: it runs 7 workers
at ~5x parallelism, so **an interleaved harness pushes 1-min loadavg above 1.0 by itself. A load
threshold sampled during a self-parallel harness measures the harness.**

**Record it as failed and why.** And record the criterion shape that *worked*, because it is the one
to reuse: **measure load SENSITIVITY and size the contamination, rather than assert quiet.** That is
what let a ruling stand on a bounded honest number instead of a claim nobody could make.

**Do not quietly relax `A1` to something that would have passed.** It was a well-intentioned
criterion that turned out impossible; that is a finding worth keeping legible.

## 3. Two more things Architect/Design escalated rather than absorbed

- **The WALL clause is UNRULED and one sample exceeded 3 s** — 2.805 s warm vs 3.120 s cooled
  straddle it, and it refused to pick the flattering sample. **First time this lane has gone over
  on wall.** Decide whether that belongs on the remedy ticket or wants its own; the warm/cold
  question needs settling either way. **If it wants its own ticket, say so and I will route it —
  do not cut two.**
- **`AR-N8LANE-078` is DISCHARGED, not charged.** `NFR-008`'s own restatement arithmetic —
  `9.545 + 11 × 0.341 = 13.30 s` — **was already over the clause on 2026-08-13's published numbers,
  before `ABC-078` existed.** Its 190 ms is 13% of the deficit. If any page still reads as though
  `ABC-078` caused this, correct it.

## What you may NOT do

- **Do not edit `plans/nfr-catalog.md` or `ADR-0014`.** Architect/Design owns both; its append moved
  no bar and the eight `NFR-001`–`NFR-008` rows hash identically before and after — **I verified
  that myself.**
- **Do not relax any bar, floor or level.**
- **Do not re-cut every ticket's `N8-LANE` line.** `ADR-0014` deliberately left them standing:
  `N8-LANE` is now a **rate limit, not a grant** — 650 ms still binds, but passing it no longer
  implies `NFR-008` is respected. That is strictly harder to read as a pass, and it needs no
  re-cutting.
- Nothing under `src/`. Do not move a board column, do not merge, do not deploy.

## Gate

No `src/` change. Contained lane; record unchanged from `main`: **1181 tests / 39 files, skip 0**.
An isolated agent worktree has no `.claude/worktrees/`, so the recorded commands work inside one —
**and the repo root does not; that trap has cost the Orchestrator three bad measurements.**

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/cut-lane-remedy`. **Commit incrementally.**

Commit on `grugops/cut-lane-remedy`, never on `main`.
