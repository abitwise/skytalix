---
id: 20260821T051500Z-qe-e2e-decision-g-qe115-3-does-not-block-the-merge-and-the-reason-is-a-standing-rule-not-my-taste-05356adf
kind: decision
by: qe-e2e
at: 2026-08-21T05:15:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-3
  - N8-SPAWN
  - NFR-008
  - ABC-108
supersedes:
---

# `G-QE115-3` DOES NOT BLOCK THE MERGE. IT STANDS AS A KNOWINGLY-OPEN RESIDUAL — AND THE REASON IS A STANDING PROJECT RULE, NOT MY JUDGEMENT OF TASTE

I was asked to rule on this and to say which. **I rule: knowingly-open residual. It does not block.**

## What is open, stated exactly

`N8-SPAWN` is three clauses. Only the **count** clause has a mechanical pin — `expect(spawned).toBe(17 + 7)` and
`expect(Object.keys(CHILDREN)).toHaveLength(...)`, which I re-ran green. The **`<= 2.0 s` added wall**
and **`<= 0.30 s` added CPU per added child** clauses are asserted by nothing that runs. Drift on
either is invisible to the gate; it is caught only by a human re-measuring, at a hop that chooses to.
That is unchanged by the repair, and the repair hop said so itself rather than letting it be assumed.

## Why it does not block, and the reason is not "it is only a gap"

**The obvious way to close it is forbidden by a standing rule this project already holds.**
`plans/nfr-catalog.md` carries, in two places (its `NFR-002` boundary block and the `ABC-077`
ruling), the standing rule that **no wall-clock assertion belongs in the default suite** — the same
rule `AGENTS.md` cites as the reason the whole `ENGINE_DEEP` lane is opt-in and the default lane
runs on an injected clock. A mechanical wall-or-CPU pin for `N8-SPAWN` in the default lane would
**contradict** that rule; one in an opt-in lane would need the lane, the instrument and the
interleaved-paired-run protocol turned into a runnable harness that does not exist.

So `G-QE115-3` is not a bench fix that was skipped. **It is a design question with a standing rule
already pointing away from the cheap answer**, and it belongs to Architect/Design and to `ABC-108`,
which already has the lane's own total under open question (`OQ-1`).

## And the clauses themselves are met, on three independent instruments

Blocking would also be disproportionate to the risk, which is measured rather than assumed. The
per-added-child CPU figure has now been taken three times by three different hops, with three
different tree pairings: **0.198 s** (BA/PM, 6 children), **0.202 s** (mine, 6 children),
**0.179 s** (the engineer, 7 children) — against a `<= 0.30 s` ceiling, and the figure went **down**
when the seventh child was added. Sign agreement was 5/5 on all three. Nothing is drifting toward
the bar today.

## What I am NOT doing, so this is not misread

I am **not** re-opening the CPU clause, the count ceiling or the exit-code ruling. I am **not**
grading `NFR-008` and I claim no `N8-LANE` line — `user` alone is over its 13 s CPU clause on both
sides of every pair anyone has run, which is `ABC-108`'s to rule and not mine. I am **not**
converting a gap into a ticket: naming it with an owner is the disposition, and the owner is the
design question above.

**It goes forward as a written-down residual with a name, not as a silent inheritance.** If a later
hop wants it closed, the shape to argue is an opt-in lane, and the rule to argue against is
`plans/nfr-catalog.md`'s.
