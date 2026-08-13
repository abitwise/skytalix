---
id: 20260813T210752Z-orchestrator-decision-the-pull-width-one-and-why-1551fe52
kind: decision
by: orchestrator
at: 2026-08-13T21:07:52Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-041-render-seam-closure.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/board.md
  - .grugops/factory.config.json
supersedes: 
---

# ABC-041 pulled into `In Development`. Width is ONE, and that is a measurement, not a preference.

The owner asked for `ABC-041` and then `ABC-042` behind it. Both were checked before either moved.

## WIP, against the live dial

`queue.wip_limit` is **3**, `wip_limits["In Development"]` is **3**, `claim_cap` is **2**. Every WIP
column read **0** before this hop (`Ready` 0/8, `In Development` 0/3, `In Review` 0/3). `In
Development` goes **0/3 → 1/3**. Nothing is refused and no written reason is owed.

## Width one — the reason is a dependency, not caution

`queue.wip_limit` **3** is the ceiling, not a quota. The only work available to run beside `ABC-041`
inside the owner's request is `ABC-042`, and `ABC-042`'s single DoR blocker **is** `ABC-041`
(`ABC-041` builds the `RenderSeam`; `ABC-042` passes it to `runTurnLoop`). Two agents on that pair
would be one agent guessing at an interface the other has not written. **Width 1 is the honest
maximum here; scheduling 2 would be theatre.** The unused width is not spent on unrelated tickets —
the owner named this lane and expanding scope to fill a WIP number is how a board grows work nobody
asked for.

## Sequencing: `ABC-042` is queued behind, not queued now

`ABC-042` is **not** enqueued by this hop. Its DoR is 8/10 with exactly one blocker — `ABC-041` — and
that blocker discharges on `ABC-041`'s **merge**, not on its first commit. It gets its own
`Ready for Dev`-exit criteria review (`AGENTS.md` § Process rules, rule 1) at that point, against the
tree `ABC-041` will then have changed. Re-using today's review for it would review the wrong tree.

## Definition of Ready — not re-scored

`ABC-041` is BA/PM's **10/10**, cut 2026-08-13. The Orchestrator does not re-score another role's DoR
(the standing rule on this board, `ABC-036`'s row). What this hop owes instead is the criteria review
at the `In Development` entry — a different question, recorded in its own note.

## Sizing

`S` (2). No `SPLIT_REQUIRED`: the no-XL rule binds tickets and the largest in `EPIC-006` is `M`.

## Lane budget — the constraint the board says nobody may quietly assume away

`EPIC-003` plans 7–8 new test files and `EPIC-006` 3–4, against a post-`threads` planning number of
**~10**. `ABC-041` spends **1** file, median-weight or lighter (≈160 ms CPU, ≈1.2% of `NFR-008`'s 13 s
clause). `ABC-042` spends **1** more and is the heaviest either epic adds, because it **spawns**.
**Running both leaves 8 of ~10.** That is stated here so the next hop inherits the number instead of
re-deriving it.

## What this hop did NOT do

It did not touch `src/`. It did not create the engineer's branch, and it did not pre-empt any
implementation choice — `A9`'s probe-root line is named in the subtask because the ticket names it,
not because the Orchestrator picked the edit.
