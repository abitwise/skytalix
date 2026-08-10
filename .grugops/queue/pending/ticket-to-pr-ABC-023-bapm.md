---
task: ticket-to-pr-ABC-023
subtask: ticket-to-pr-ABC-023-bapm
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-023/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T06:13:02Z
branch: grugops/ticket-to-pr-ABC-023
---

# Subtask: re-check `ABC-023`'s Definition of Ready, re-pin its stale evidence, and take the `Backlog → Ready` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here** —
the Orchestrator's decision note carries the re-measured `main` baseline, the three named defects with
the reasoning behind each, the dependency check it did run, and the explicit list of what it did
**not** check. Do not re-derive the baseline; do re-derive everything it disclaims.

## The board move IS yours this time

`ABC-023` sits in `Backlog`. The ticket's own DoR block explains why in two parts, and **part (a) is
now satisfied** — `ABC-009` merged 2026-08-09 and both files this ticket edits are on `main`, verified
at the opening hop. Part (b) was *"a `P2` hardening ticket should compete for `Ready` at a refinement
pass"*: the owner has now named it directly, which is that competition resolved.

So unlike the last two BA/PM hops on this board, **you take the `Backlog → Ready` exit** — but only if
the corrected ticket earns it. `Ready` goes 1/8 → 2/8. The Orchestrator then re-runs the
Definition-of-Ready gate against your corrected ticket and owns `Ready → Ready for Dev →
In Development`. **Do not take that exit and do not enqueue the engineer.**

If the ticket does **not** earn `Ready` — say so and leave it in `Backlog`. A ticket parked with a
named reason is a good outcome. A ticket promoted to keep a hop moving is how this board got its worst
defect.

## The gate came back AMBER with three defects, one of them BLOCKING

All three are consequences of one event: `ABC-022` merged **after** this ticket was cut, and it
changed `src/moves.ts`. Fix them where they live, in
`plans/tickets/ABC-023-castling-precondition-net-hardening.md`.

**The blocking one is a stale hash in `A4` and re-pinning it is the easy half.** The hard half is
defect 2 — sixteen mutant verdicts and every *(Measured today: …)* parenthetical were scored against a
381-test suite that is now 559. **Re-measuring those is the real work of this hop.** The Orchestrator
ran none of them; every verdict in that ticket is inherited.

Three questions this hop must answer with measurements, not with reasoning:

1. **Do the two destination-square mutants still survive?** `A2` is the ticket's sharpest criterion —
   the only class on this board whose leaking position is legally reachable — and it rests entirely on
   those two surviving. If either is now incidentally dead, `A2`'s justification is false and must be
   restated. **Do not delete the criterion to make the problem go away**; a criterion whose mutant
   already dies is still worth stating, it just needs an honest reason.
2. **Do the two pair mutants and the six single-axis mutants still survive?** Same test, for `A1` and
   `A3`.
3. **Do `ABC-009`'s fifteen behaviour-equivalent controls still survive at 559?** `A5` requires killed
   count **zero** across them and was measured at 381. This is the half that matters: a row that kills
   an equivalent mutant pins implementation shape instead of behaviour.

Whatever you measure, **`A4` must end up pinning a hash you produced at this hop**, and every
parenthetical must state the suite size it was measured against — the absence of that suite size is
what let this ticket rot silently in the first place.

## Three is the floor, not the ceiling

The Orchestrator's note lists six things it did not check, including the *"9 of 13 type/table pairs"*
table and **this board's recurring defect shape — a criterion narrower than its own `## Scope`**, which
was defect 1 on `ABC-022` and has now appeared on three consecutive tickets. Sweep for that shape
specifically. On `ABC-018` you found five where the pre-check named three; on `ABC-009` seven where it
named four; on `ABC-022` seven, then five more.

## Boundaries

- **Do not touch `src/`.** `src/moves.ts` must still hash `6335b452fc21ffe2d0f902ecab930840` when you
  finish. **Write no test rows and no production line** — the rows are the engineer's hop, and this
  ticket's whole premise is that its production diff is zero. If you need a measurement, take it on a
  copy outside the repository with `node_modules` symlinked, the way the `ABC-009` and `ABC-022` hops
  did, and restore-and-re-hash after every mutant.
- **Do not reopen `ABC-009`.** Its `A1`–`A13` verdicts stand, and this ticket's `## Out of scope` says
  so. If a measurement here suggests one of them was wrong, **say so and stop** — that is a defect
  ticket, not an edit.
- **`## Scope`, `## Out of scope`, size `S` and priority `P2` are the ticket's own settled decisions.**
  If a correction forces one to move — for instance if re-measurement shows the row count is well
  above the estimated 17 — **say so and stop**; do not move a size silently. The ticket names the one
  thing that would make it `L` (enumerating the 169-combination joint pair space); check you are not
  drifting into it.
- **Do not edit `ABC-010`, `ABC-013`, `ABC-022` or any other ticket.** Fixing a gap in another ticket
  by editing this one, or the reverse, is the inversion the `ABC-018` correction explicitly rejected.
- **Update the `status:` / `column:` frontmatter with the board row, in the same commit.** Two tickets
  on this board drifted between the two and both had to be repaired later.

## Traps this board has already paid for

- **Print the input, not the verdict.** Every measurement prints the FEN it used and re-parses it.
- **One OS process per tree state** in any mutation run. Node's module cache served a pristine
  `moves.ts` to four tree states in one process on `ABC-009` and produced a false
  *"the harm does not reproduce"*.
- **Verify the instrument before believing a red.** Typecheck every mutant — three controls on
  `ABC-009` did not compile under `noUncheckedIndexedAccess` and were correctly scored `BROKEN-BUILD`
  rather than read as dead controls; a non-compiling control there produced 147 failures nearly read
  as *"the rows over-fit"*.
- **A green signal read as protection without asking what it could fail on** is this ticket's own
  stated lesson. It applies to your measurements too.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists either. Record results
as `observation` / `decision` / `claim`. Nothing self-stamped; no `index.md` / `index.jsonl` hand-faked.

Claim by hand: **`scripts/claim.js` does not exist in this install** — there is no `scripts/` directory
in the repository and none in the kit root. Re-check that at the source rather than trusting this file.
The claim is the atomic `mkdir` of `.grugops/queue/claimed/<subtask>/` with a `claim.md` inside it,
then `mv` the subtask file in, and `mv` the whole directory to `done/` when finished.

Take your own `at` from `date -u`; **this machine is UTC+3**, so a local timestamp labelled `Z` is a
three-hour lie. Update your own row in `plans/traceability.md`. Commit on the branch named in the
frontmatter above; **never commit directly on `main`**. Never merge, never deploy.
