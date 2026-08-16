---
id: 20260816T121900Z-uat-planner-decision-the-uat-exit-is-not-mine-and-what-the-owner-must-sign-c07f5ab2
kind: decision
by: uat-planner
at: 2026-08-16T12:19:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - AGENTS.md
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/roles/uat-planner.md
supersedes: 
---

# `ABC-066` — the `In UAT` exit is NOT taken here, and this is exactly what the owner is asked to sign

## The ruling I am making, and the one I am refusing to make

**Made:** the conduct is complete. Eight business scenarios were executed against `main` at a real
terminal and every measurement is in this task's `observation` note.

**Refused:** the acceptance. `AGENTS.md` § Test and UAT authority says the owner granted the CONDUCT
of UAT and *"did not say an agent's report is the acceptance signature"*, and the kit's own
`06-uat-pack.md` and `roles/uat-planner.md` make the `In UAT` exit a named human's signoff and
forbid an agent self-signing. Both readings agree here, so there is nothing to resolve by inference
— and inference is precisely what `AGENTS.md` forbids on this point.

**So: `ABC-066` stays in `In UAT`.** It was not moved to `Ready to Release`, not moved to `Done`,
and `plans/board.md` was not opened for write.

## Say it once, plainly, for whoever reads this in six months

**"UAT passed" here means: an agent ran the scenarios and they came out green.** It does NOT mean a
human looked at this product and accepted it. No name is attached to any pass above. If a later
reader wants to know who accepted `ABC-066`, the answer as of this note is **nobody**, and that is a
fact about the record, not an oversight in it.

## What the owner is actually asked for — four things, in the order they matter

1. **Accept, or reject, the eight conducted scenarios.** The evidence is measured and reproducible in
   one terminal; every command is written out in the conducted note.
2. **Accept the known limitations as they stand** — above all limitation 1, the silent-discard path
   (`npm run chess --ascii` still exits 0 and drops the flag). `ABC-066` did not repair it and cannot
   from here. If that is unacceptable, this is the moment to say so, not after release.
3. **Say where `ABC-066` goes** from `In UAT`.
4. **Settle the open question, or decline to.** Is an agent-conducted UAT report sufficient for the
   `In UAT` exit on this project, or does that exit require his signature every time? `AGENTS.md`
   names this open and says it is his *"to give or to redefine"*. **A general answer would unblock
   every future ticket's `In UAT` exit; a per-ticket answer is equally legitimate and I am not
   nudging toward either.**

## Why this ticket in particular deserves a human's eye, briefly

`ABC-066` is the only defect UAT has ever caught on this repository, and it was caught by a person at
a terminal rather than by any of the nineteen scenarios then in the pack. The repair is now measured
green — but *"the instruction the product gives is true"* is a judgement about what a user is told,
and the person who noticed it was untrue is better placed to say it is now true than the process that
missed it.
