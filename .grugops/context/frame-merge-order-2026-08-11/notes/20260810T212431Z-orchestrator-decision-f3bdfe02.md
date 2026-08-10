---
id: 20260810T212431Z-orchestrator-decision-f3bdfe02
kind: decision
by: orchestrator
at: 2026-08-10T21:24:31Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
supersedes: 20260810T212028Z-orchestrator-decision-ac72dd8d
---

# OWNER DIRECTIVE — `ABC-019` builds in PARALLEL against stubs and merges LAST

Supersedes `20260810T212028Z-orchestrator-decision-ac72dd8d` on the build-order clause ONLY. **The
merge order is unchanged** — `ABC-016` → `ABC-017` → `ABC-019`, with `ABC-018` already merged and not
a slot. What changes is that build order and merge order are now deliberately different lines.

## The directive

The project owner, Olger Oeselg, 2026-08-11 in session: *"build ABC-019 in parallel against stubs,
merge it last."*

The Orchestrator raised the priority inversion (`ABC-019` is the board's only `P0` in this set and the
forced merge order puts it behind a `P1` and a `P2`) and named parallel-build-against-stubs as the
available trade. The owner took it. **This is a scheduling decision inside the owner's authority, and
it is technically supported by the ticket's own text** — `ABC-019`'s Dependencies block states it "can
be built against `ABC-016`/`ABC-017` stubs," and its two seam stubs (coordinate input, seeded engine)
were verified at wave 1 to be buildable from merged code alone.

## What the directive does NOT change — stated because urgency is when gates matter most

`ABC-019` is in `Backlog`. It **cannot enter `In Development`** until the BA/PM refinement hop now in
flight returns it to `Ready` with the Definition of Ready met and its size re-derived. The directive
changes the *shape* of the schedule, not the gate: "build it in parallel" is not permission to pull
unready work, and the ticket's own note reserves the right to re-size (`L` 5 → `XL` 8 is a
`SPLIT_REQUIRED` that routes back to BA/PM, not forward into dev). If that hop reports `XL`, the
parallel build does not start and the owner is told why.

## Two consequences that follow, and the second one is load-bearing

**1. `ABC-019`'s branch must be rebased onto merged `ABC-016`+`ABC-017` and RE-GATED before it merges.**
Several of `ABC-019`'s acceptance criteria compose the *real* panels — one render per ply, the frame's
constant row count, and the two criteria requiring a frame re-emit without re-evaluating `gameStatus`.
Verified against stub panels those criteria are close to vacuous: a stub that derives nothing trivially
satisfies the property that `ABC-016` had to delete a `gameStatusOf` call to earn. **Green on stubs is
not evidence about the assembled frame.** This project already gates on branch tip AND again on `main`,
so the requirement fits existing precedent rather than inventing a step: rebase, re-gate on the tip
with the real panels present, then merge, then gate on `main`.

**2. `ABC-019`'s stub panels are a THIRD hardcode site for the two row constants, and the ruling now in
flight was scoped to two.** A stub status panel returning 3 rows and a stub history pane returning 8
rows hardcodes `STATUS_ROWS` and `HISTORY_ROWS` a third time, in a third file, with nothing tying any of
them together. That is exactly the `D13` defect class — `ABC-017` was refined *because* `ABC-016`'s `A11`
hardcoded its `8` with nothing tying them — propagating into a third ticket under a parallel build. The
Architect/Design hop was dispatched to settle ownership across two tickets; the owner's directive makes
it three. **The running Architect agent has been told, because the scope of its own ruling changed and
it is still in flight.** This is coordination from the Orchestrator, not a relay of another agent's
findings.

## Schedule after the directive

Merge order (unchanged): `ABC-016` → `ABC-017` → `ABC-019`.

Build order (new): `ABC-016` and `ABC-019` may build concurrently once both are `Ready for Dev`.
`ABC-017` remains gated on the constant-ownership ruling — its `A1` names `STATUS_ROWS`, which exists
nowhere in merged `src/`, so a parallel `ABC-017` branch would have to define it and create a fourth
site. Whether `ABC-017` shares `ABC-016`'s branch or follows it is the Architect's call, still pending.

`In Development` WIP limit is 3. Two concurrent tickets is 2/3 — inside the limit, no override needed.
If the Architect rules that `ABC-016`+`ABC-017` share one branch, that branch plus `ABC-019` is still
2 of 3.

## Hard limits held

Nothing merged, nothing deployed, no protected branch touched. Merge and deploy remain the owner's.
