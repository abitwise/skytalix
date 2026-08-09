---
id: 20260809T213843Z-software-engineer-decision-742769bd
kind: decision
by: software-engineer
at: 2026-08-09T21:38:43Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `A11` is NOT fully discharged: site 7 is unreachable from this subtask, and the conflict is escalated rather than absorbed or worked around

**`A11` names five open sites. Four are applied. Site 7 is not, and it cannot be from this hop.**

## The collision, stated plainly

`A11`'s enumeration is **closed** and site 7 is `src/moves.enpassant.test.ts` **4-9 / 27-28**. This
subtask's brief states the boundary twice, in two separate bullets:

- *"**Comment text only**, in `src/legal.ts` and `src/legal.test.ts`. **No other file under `src/`**."*
- *"**Do not touch `src/moves.ts` or `src/moves.enpassant.test.ts`** — both are settled from hop one."*

"Apply the widened `A11`" and "do not touch that file" cannot both be satisfied. This is not an
ambiguity I could read away: the boundary is stated twice, specifically, and naming the file is not
the kind of phrasing that slips in by accident.

## What I did, and why that and not something else

**I obeyed the specific boundary and escalated the conflict.** Three other courses were available
and each was rejected:

1. **Edit site 7 anyway**, on the ground that `A11` is the criterion and the brief is only routing.
   Rejected: the boundary is explicit and repeated, and the standing instruction on this ticket has
   been that the engineer does not silently widen the diff — it is what made flagging
   `src/legal.ts:69-70` at hop one the right call, and the same discipline applies when the pressure
   runs the other way.
2. **Amend `A11` to drop site 7.** Rejected: `## Acceptance` is BA/PM's alone on this board, and the
   brief says so. The role that writes a criterion is not the role that declares it satisfied, and
   it is certainly not the role that deletes it.
3. **Stop the whole hop.** Rejected: sites 3-6 are unambiguously in bounds, and they are the ones
   that made `src/legal.ts` contradict itself 33 lines apart — 69-70 against the A11-corrected
   102-107. Leaving that in place to make a point about site 7 would ship the sharpest form of the
   defect in order to protest the mildest.

So four sites are applied, `A11` is honestly reported **partially discharged**, and QE must not read
this hop as closing it.

## What the next hop has to decide, and it is cheap either way

Two exits, both already prepared by BA/PM:

- **Lift the boundary** for one comment-only edit to `src/moves.enpassant.test.ts` — a tense fix in a
  file header, no executable line, and the file is this project's own precedent for the past-tense
  standard (`src/moves.ts` 183-195 was written that way at the same hop by the same role).
- **Drop site 7** from `A11`. BA/PM recorded it as the lowest-severity site, a judgement about tense
  and framing rather than a measurement, and explicitly wrote that it is *"a call the Orchestrator
  can cheaply overrule"* and that dropping it leaves the rest of `A11` standing unchanged.

I hold no position on which. **What I will not do is let `A11` read as satisfied while a site it
enumerates is untouched** — that is the "green signal read as protection" failure this board has
paid for on `ABC-018`, `ABC-009` and twice on `ABC-022`, and it would be worse coming from the role
that had the file open.
