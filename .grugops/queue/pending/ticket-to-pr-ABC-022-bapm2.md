---
task: ticket-to-pr-ABC-022
subtask: bapm-abc022-a11-widen
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T20:43:06Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: sweep for statements the `ABC-022` fix falsified, and widen `A11` to cover them

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Sixteen notes. The Orchestrator's `In Review` gate note
(`20260809T204306Z-orchestrator-decision-1d6e1437`) carries what was verified on whose instrument,
the flagged line, and the reasoning for this hop. **Your own five notes from the earlier correction
hop are in the same folder** — this is your second hop on this ticket.

`ABC-022` is in `In Review` (1/3) and the fix is implemented and green. **This hop takes NO board
move** and the ticket does not go back a column: the criterion is not unmet, it is **too narrow**,
which is a different thing and does not warrant the backward move `ABC-009` took.

## The trigger

The Software Engineer flagged, and the Orchestrator confirmed by reading the source, that
`src/legal.ts:69-71` contains a claim its own fix made **false**. `A11` as written does not cover it,
so `ABC-022` can pass every criterion and ship the falsehood `A11` exists to remove — **the fifth
instance on this ticket of a criterion narrower than the harm.**

## The job is the SWEEP, not the one line

**Do not simply add "and lines 69-71" to `A11` and stop.** Every count on this ticket has been a
floor: the pre-check found 2, you found 7, the engineer found an 8th that both of us missed. The
actual job is to find **every** statement this fix falsified and let `A11`'s amendment be the output.
Sweep at minimum `src/` comments and doc comments, `plans/tickets/`, `plans/nfr-catalog.md`,
`memory-bank/50-decisions/` (`ADR-0005` in particular) and `memory-bank/`. Some of what you find will
correctly belong to another ticket or to no ticket at all — say which, and fence it rather than
folding it in.

## The second question, and only you can settle it

With the generator fixed, `legalMoves(...).some(ep)` now returns `false` on exactly the out-of-domain
positions where `hasLegalEnPassant`'s specified answer is `false` — so **the stated reason that the
oracle is "SPECIFIED rather than derived" may have partly evaporated**, not merely its mechanism
clause. Settle what the comment should now say.

**The guards themselves stay and that is not in question.** This ticket's own
`## THE CORRECTION THIS TICKET CARRIES` proves guard (a) is load-bearing for **both** classes because
`hasLegalEnPassant` synthesises its own probe move and never consults `generateMoves` — you measured
that yourself on 2026-08-04. `ADR-0005` is not reopened by a comment.

## Boundaries

- **Do NOT touch `src/`.** Not one line, comment or otherwise. You specify the correction in `A11`;
  the engineer applies it on the next hop. `src/moves.ts` must stay md5
  `6335b452fc21ffe2d0f902ecab930840` and `src/legal.ts` unchanged from the branch tip.
- **Write no test rows** and do not modify `src/moves.enpassant.test.ts`.
- **`A11` is the only criterion in play.** `A1`–`A10` are settled — they were re-derived at your last
  hop and again by the engineer, and the Orchestrator re-ran the gates green. Do not re-litigate them
  and do not re-measure `NFR-001`.
- **No board move**, and do not enqueue anyone. QE is the Orchestrator's to route after the engineer
  applies your amendment.
- **Do not edit `ABC-023`.** `src/moves.ts`'s hash has changed and its `A4` pin is now stale — that is
  expected, recorded, and deferred **by design** to `ABC-023`'s own promotion hop. Re-pinning it here
  is not wanted.
- **Do not edit `plans/nfr-catalog.md`, `ABC-010`, `ABC-011` or `ABC-013`.** If the sweep finds a
  falsified statement in one of them, **name it and fence it** — the reciprocal-fence shape this
  ticket already uses for the `ABC-010` half-(a) gap.
- `## Scope`, `## Out of scope`, size `S` and priority `P1` are settled. If the sweep forces one to
  move, **say so and stop.**

## If the sweep finds nothing beyond the flagged line

**That is a legitimate outcome — say it plainly.** Do not manufacture findings to match the pattern of
earlier hops. A one-line amendment with a recorded sweep behind it is a good result; an inflated one
is not.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible** — no §14 gate exists here to issue a `§14-gate#<id>` stamp and
`context.human_admission` is `off`. Record as `observation` / `decision` / `claim`. Nothing
self-stamped; no `index.md` / `index.jsonl` hand-faked.

Claim by hand: `scripts/claim.js` does not exist in this install — re-check at the source rather than
trusting this file. Take your own `at` from `date -u`; **this machine is UTC+3**. Update your own row
in `plans/traceability.md`. Commit on the branch named above; **never commit directly on `main`**.
Never merge, never deploy.
