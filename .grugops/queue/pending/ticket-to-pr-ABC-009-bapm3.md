---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-a11-verify
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T14:39:16Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: verify `A11` independently, then clear its stale marker — the last step before merge

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Forty notes. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae` carries **local time
labelled `Z`** and is **superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`. Take your own
`at` from `date -u`; this machine is UTC+3.

**This hop is deliberately narrow. It is a verification, not a rewrite.**

You added `A11` at the criteria-text hop and marked it `⚠️ NOT YET SATISFIED BY THE SUITE`. QE's second
hop closed it in tests — 34 hardening tests (was 19), 14 rows new, **zero production lines**. `A11` is
now met on measurement, and the marker at ticket lines **250** and **367**, plus the `## Acceptance`
preamble line, are **stale**.

**QE deliberately left them byte-identical and routed them to you**, on this reasoning: the failure that
hop repaired is *a role certifying its own sample as a dimension*, so the role that wrote the rows must
not also stamp the criterion satisfied. The Orchestrator will not clear them either — `## Acceptance` is
yours alone, a limit the Orchestrator wrote into your first subtask file, and it has made **three
verification errors on this task** that argue against its unchecked judgement being the last word here.

## Your two jobs

**1. Verify `A11` independently, then say whether it is met.** Do not take this from QE's table or the
Orchestrator's. Re-derive on your own instruments. The claim to test is that a mutant admitting **any
single wrong own piece type on either home square** dies. QE reports 20 mutants, 11 killed, 9 survived,
0 verdict mismatches, 0 broken builds. The Orchestrator independently rebuilt the three that previously
passed the whole net (own-KING-or-ROOK, own-KING-or-PAWN, own-ROOK-or-PAWN — each now dies to 2
hardening tests) and one equivalence control (colour-blind — survives 371/371).

**If `A11` is NOT met, say so and do not clear the marker.** That is a legitimate outcome and the ticket
stays where it is.

**2. Only if it is met: clear the stale markers.** Lines 250 and 367 and the `## Acceptance` preamble.
Check whether anything else in `## Acceptance` went stale across the two QE hops — the preamble's
"currently-failing test" framing is now wrong for the criteria that are green, and you are the one who
decides how to say that.

## Two measurement traps that have each already caught a role on this task

- **One process per tree.** Your own first harm probe ran four tree states in one process and Node's
  module cache served pristine `moves.ts` to every round, producing a false *"the harms don't
  reproduce."* The tell was identical output across trees.
- **Verify the instrument before believing a red.** The Orchestrator's first equivalence control used
  `pieceTypeOf`, which does not exist (the real export is `pieceType`), producing a module that does not
  compile and **147 failing tests** it nearly read as "QE's rows over-fit." A red from an unverified
  instrument is not a finding.

## Boundaries

- **Do not touch `src/`.** Not one file, test or production. `src/moves.ts` must stay md5
  `0e247853ab2c05887c76105ff83d8621` and all 14 pre-existing test files unmodified.
- **Do not add criteria.** If you find a new gap, **name it and stop** — do not open a fourth hop's work
  inside this one. QE says to expect a fourth class (engineer 5 mutants → QE 62 → you 10 → QE 20, each
  finding what its predecessor missed); if you find it, that is a routing decision for the Orchestrator,
  not a silent scope expansion here.
- **No board move is yours.** The ticket stays in `Ready for UAT` (1/4).
- Do not edit `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` or `plans/nfr-catalog.md`.
- **`A7`, `A12`, guard ordering and `NFR-001` are all settled.** Do not re-litigate any of them.
- The `plans/traceability.md` 11-cell report **does not exist** — you established that; it stays closed.
- **`ABC-018`'s frontmatter defect** (board says `Done`, its ticket says `ready-for-uat`) is real,
  separate, and **not yours to fix here**. If you judge it worth a ticket, cutting one is yours.

## What happens next, so you know what you are unblocking

After you: the UAT ruling (deferred → `EPIC-006`, explicitly NOT passed, per every ticket this project
has shipped), then merge under the owner's standing directive of 2026-08-06 with gates run and recorded
on the branch tip before and on `main` after, then close to `Done` **including the ticket frontmatter** —
the step `ABC-018`'s close missed.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task.** Nothing self-stamped,
no `index.*` faked. Claim by hand; `scripts/claim.js` does not exist here — re-check rather than
trusting this file. Update your own row in `plans/traceability.md`. Commit on the existing branch; never
commit directly on `main`. Never merge, never deploy.
