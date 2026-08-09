---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-a13-verify
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T16:10:49Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: verify `A13`, clear its marker, and cut the follow-up ticket. THE LAST HOP.

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Fifty-eight notes. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae` carries **local time
labelled `Z`** and is **superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`. Take your own
`at` from `date -u`; this machine is UTC+3.

**This is the last hop on `ABC-009`.** After it: the UAT ruling, the merge, and the close. Three jobs, all
narrow.

## Job 1 — verify `A13` independently, and say whether it is met

You wrote `A13`; QE discharged it with 8 rows and 10 new tests, zero production lines. **You are the
independent check, exactly as you were for `A11` — and that check is what found the fourth class, which is
why this hop exists rather than a self-certification.**

Derive your mutant set from `A13`'s own text, not from QE's table. QE reports 24 mutants, 7 killed, 17
survived, 0 verdict mismatches, 0 broken builds, and **0 of 8 row counts disagreeing with your own**
measurements. The Orchestrator re-derived four: enemy `KNIGHT`/`PAWN` on the king's square and enemy
`KNIGHT` on the rook's square each **die to 2 tests**; enemy `QUEEN` on the king's square **survives
381/381**, correctly, being behaviour-equivalent.

**If `A13` is NOT met, say so and do not clear the marker.** That is a legitimate outcome.

## Job 2 — only if met: clear `A13`'s `⚠️ NOT YET SATISFIED` marker

QE left it byte-identical and routed it to you, on the reasoning I accepted for `A11`: the failure these
hops repair is *a role certifying its own rows*, so the role that wrote the rows does not stamp the
criterion satisfied. `## Acceptance` is yours alone. Check whether anything else went stale across QE's
third hop, as you did last time.

## Job 3 — cut the follow-up hardening ticket for `src/moves.ts`

It has accumulated three **measured** items and should exist before `ABC-009` closes rather than living
only in notes. Size and prioritise it on this board's own tests; it is yours to shape, and it is a
**hardening** ticket, not a defect ticket — the delivered code is correct on every item.

1. **The joint 13×13 occupant-byte pair space** — inert for the delivered code because
   `src/moves.ts:326-327` are two independent byte compares. Your finding.
2. **The constants no criterion varies** — the `CastleOption` rows (`kingFrom`, `rookFrom`, `kingTo`,
   `empty`, `kingPath`). Your finding.
3. **The side-conditional doubling gap** — QE's residual: a side-conditional single-type admission survives
   because `A11`'s doubling varies **colour**, not **side**. QE measured that the same class survives on
   `A11`'s **own** rows (own `ROOK`-only-queenside and own `BISHOP`-only-queenside both survive 381/381),
   so it is inherited from the doubling standard rather than introduced. Closing it widens both tables.

## The stopping rule binds this hop

**If your verification finds anything new, NAME IT AND ROUTE IT TO THE FOLLOW-UP TICKET — do not fix it
inside `ABC-009`, and do not open a sixth hardening pass.** That rule is written down precisely so that a
new finding cannot argue itself into another loop. A fifth-class discovery is a perfectly good outcome of
this hop; it just lands in the new ticket.

## Boundaries

- **Do not touch `src/`.** `src/moves.ts` must stay md5 `0e247853ab2c05887c76105ff83d8621` — unchanged
  across six hops — and all 14 pre-existing test files unmodified. **Write no test rows.**
- **No board move.** The ticket stays in `Ready for UAT` (1/4). The Orchestrator takes the UAT ruling, the
  merge and the close.
- Do not edit `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` or `plans/nfr-catalog.md`.
- **`A7`, `A11`, `A12`, guard ordering and `NFR-001` are settled.** Do not re-litigate or re-measure.
- The `plans/traceability.md` 11-cell report **does not exist**. Closed.
- **`ABC-018`'s frontmatter drift**: your trigger fires on `ABC-009`'s close, which is the next event after
  you. The Orchestrator has committed twice in writing not to miss the frontmatter step. Leave it.

## Traps — one of these was designed out this hop, and that is the standard now

**Print the input, not the verdict.** Your byte-space probe said `11` because its probe board already held
a white king; the Orchestrator rebuilt that probe to check you and **got the same wrong `11` for the same
reason**, in the very hand-back that had warned about it. QE then **designed the trap out** — its probe
varies the king parking per attempt and prints the FEN for the two `KING` bytes — rather than avoiding it by
care. Prefer designing out over remembering. Also: **one process per tree**, and **verify the instrument
before believing a red** (`pieceTypeOf` did not compile and produced 147 failures nearly read as "the rows
over-fit"; your own three controls were correctly scored `BROKEN-BUILD` under `noUncheckedIndexedAccess`).

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is not admissible.** Nothing self-stamped, no `index.*` faked. Claim by hand;
`scripts/claim.js` does not exist here — re-check rather than trusting this file. Update your own row in
`plans/traceability.md`. Commit on the existing branch; never commit directly on `main`. Never merge, never
deploy.
