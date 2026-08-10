---
id: 20260810T212538Z-orchestrator-decision-e94c3970
kind: decision
by: orchestrator
at: 2026-08-10T21:25:38Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
supersedes: 20260810T212431Z-orchestrator-decision-f3bdfe02
---

# OWNER DIRECTIVE — `ABC-019` builds in PARALLEL against stubs and merges LAST (corrected)

Supersedes `20260810T212431Z-orchestrator-decision-f3bdfe02`, which was correct in substance but
carried **one false sentence** that this note exists to retract. Replay folds out superseded notes, so
supersession rather than an addendum is the only mechanism that actually removes the false claim from
the verified context. The retraction is recorded at the bottom.

Also supersedes, on the build-order clause ONLY, `20260810T212028Z-orchestrator-decision-ac72dd8d`.
**The merge order is unchanged** — `ABC-016` → `ABC-017` → `ABC-019`, with `ABC-018` already merged and
not a slot. What changes is that build order and merge order are now deliberately different lines.

## The directive

The project owner, Olger Oeselg, 2026-08-11 in session: *"build ABC-019 in parallel against stubs,
merge it last."*

The Orchestrator raised the priority inversion (`ABC-019` is the board's only `P0` in this set and the
forced merge order puts it behind a `P1` and a `P2`) and named parallel-build-against-stubs as the
available trade. The owner took it. **This is a scheduling decision inside the owner's authority, and it
is technically supported by the ticket's own text** — `ABC-019`'s Dependencies block states it "can be
built against `ABC-016`/`ABC-017` stubs," and its two seam stubs (coordinate input, seeded engine) were
verified at wave 1 to be buildable from merged code alone.

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
so the requirement fits existing precedent rather than inventing a step: rebase, re-gate on the tip with
the real panels present, then merge, then gate on `main`.

**2. `ABC-019`'s stub panels are a THIRD hardcode site for the two row constants, and the ruling now in
flight was scoped to two.** A stub status panel returning 3 rows and a stub history pane returning 8
rows hardcodes `STATUS_ROWS` and `HISTORY_ROWS` a third time, in a third file, with nothing tying any of
them together. That is exactly the `D13` defect class — `ABC-017` was refined *because* `ABC-016`'s `A11`
hardcoded its `8` with nothing tying them — propagating into a third ticket under a parallel build.

## RETRACTION — the false sentence, and the tooling limit behind it

The superseded note stated: *"The running Architect agent has been told, because the scope of its own
ruling changed and it is still in flight."* **That is false. The agent was NOT told and could not be.**

The Orchestrator attempted to message the in-flight Architect and the `SendMessage` tool is **not
enabled in this session** — it exists but is unavailable on this path. The sentence was written in
anticipation of a send that then failed. It is retracted rather than quietly left in place, because a
later reader replaying this context would otherwise build on a coordination step that never happened —
and "believing an instrument without checking the instrument" is the exact error class this project has
already recorded five times against the Orchestrator on `ABC-009`.

**Consequence for the schedule.** The Architect hop will deliver a **two-ticket** ruling, not a
three-ticket one. The stub-seam question is therefore **owed and unanswered**, and it is carried into
wave 2 as an explicit follow-up rather than assumed covered. The wave-2 Architect follow-up must answer:
where do these two constants live such that the real panels, the stub panels and `frameHeight` all
reference ONE definition — with `src/frame.ts` alongside `frameHeight` the obvious candidate, since it is
the only consumer. That follow-up also constrains the branch shape: if `ABC-019` builds in parallel, a
parallel `ABC-017` branch would have to define `STATUS_ROWS` itself and create a FOURTH site.

## Schedule after the directive

Merge order (unchanged): `ABC-016` → `ABC-017` → `ABC-019`.

Build order (new): `ABC-016` and `ABC-019` may build concurrently once both are `Ready for Dev`.
`ABC-017` remains gated on the constant-ownership ruling — its `A1` names `STATUS_ROWS`, which exists
nowhere in merged `src/`, so a parallel `ABC-017` branch would have to define it. Whether `ABC-017`
shares `ABC-016`'s branch or follows it is the Architect's call, still pending.

`In Development` WIP limit is 3. Two concurrent tickets is 2/3 — inside the limit, no override needed.
If the Architect rules that `ABC-016`+`ABC-017` share one branch, that branch plus `ABC-019` is still
2 of 3.

## Hard limits held

Nothing merged, nothing deployed, no protected branch touched. Merge and deploy remain the owner's.
