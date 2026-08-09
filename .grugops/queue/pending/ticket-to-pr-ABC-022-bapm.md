---
task: ticket-to-pr-ABC-022
subtask: bapm-abc022-acceptance
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T19:26:51Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: re-check `ABC-022`'s Definition of Ready and correct its acceptance in place, inside `Ready`

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here** —
the Orchestrator's decision note carries the Definition-of-Ready result, the two named defects with
the reasoning behind each, the four things that gate checked and found **sound** (so you do not spend
a hop re-deriving them), and the explicit list of what it did **not** check.

`ABC-022` was cut straight to `Ready` on 2026-08-04 and is still there. This is **not** a promotion —
it is an in-place correction of a ticket already in `Ready`, so it takes **no board move** and `Ready`
stays 2/8.

## The gate came back AMBER with two defects, both in `## Acceptance`

Neither is blocking in the `ABC-009` sense — the Orchestrator checked the specific failure that
blocked `ABC-009` (a partial fix passing the whole criteria set) and `ABC-022` **passes** it: `A1` and
`A3` are disjointly load-bearing, each catching the half the other misses. Fix them where they live,
in `plans/tickets/ABC-022-en-passant-generation-preconditions.md`.

**Defect 2 is the one that needs judgment, not just an edit.** `A5`'s stated justification looks
false, and the Orchestrator's proposed reason — that an emptiness test and a colour test are
*behaviour-equivalent* here, so **no** criterion could discriminate them — is a claim you should
**test, not accept**. If it holds, the repair is to restate `A5`'s justification honestly rather than
to add a criterion, which is where `ABC-009`'s `A7` landed after it killed nothing across 62 mutants.
If it does not hold, there is a distinguishing position and `A5` should name it. **Either outcome is a
good outcome. Do not manufacture a criterion to avoid saying "this cannot be discriminated."**

## Two defects is the floor, not the ceiling

The precedent on this board is unambiguous: on `ABC-018` BA/PM found five where the pre-check named
three, two seen by no pre-check; on `ABC-009`, seven where it named four, three seen by no pre-check
and one blocking. **Re-derive rather than accepting the Orchestrator's numbers** — its own note names
what it did not audit, including the 518,474 / 81,397 reachability walk, the seven reproduction FENs,
`A7`'s six per-root node counts and every `NFR-001` figure. This ticket was written five days ago and
`ABC-009` has changed `src/moves.ts` since.

## Boundaries

- **Do not touch `src/`.** `src/moves.ts` must stay md5 `0e247853ab2c05887c76105ff83d8621`. **Write no
  test rows and no production line.** If you need a measurement, take it on a copy outside the
  repository, the way the `ABC-009` hops did.
- **No board move.** `ABC-022` stays in `Ready` (2/8). The Orchestrator re-runs the Definition-of-Ready
  gate against the corrected ticket and owns the `Ready → In Development` exit. **Do not take that
  exit yourself and do not enqueue the engineer.**
- **Do not edit `ABC-023`.** Its `A4` pins `src/moves.ts` at the hash above and `ABC-022` will
  invalidate it when it merges — that is known, it is recorded in the Orchestrator's note, and it is
  **deliberately deferred to `ABC-023`'s own promotion hop** so the hash is re-derived once. Naming it
  again in `ABC-022` is not wanted; re-pinning it now is not wanted either.
- **Do not edit `ABC-010`, `ABC-009`, `ABC-011` or `ABC-013`.** `ABC-022`'s `## Dependencies` already
  fences the `ABC-010` half-(a) gap one-directionally and flags it rather than editing it — keep that
  shape. Do not fix a gap in another ticket by editing this one, or the reverse; that inversion is the
  mistake the `ABC-018` correction explicitly rejected in its own item 2.
- `## Scope`, `## Out of scope`, size `S` and priority `P1` are settled — the Orchestrator re-checked
  the `P1` ranking against this board's own `P0` test and it stands. If you believe a correction
  forces one of them to move, **say so and stop**; do not move it silently.

## Traps this board has already paid for

- **Print the input, not the verdict.** Every measurement prints the FEN it used and re-parses it.
- **One OS process per tree state** in any mutation run — Node's module cache served a pristine
  `moves.ts` to four tree states in one process on `ABC-009` and produced a false negative.
- **Verify the instrument before believing a red.** Typecheck any mutant; a non-compiling control was
  nearly read as "the rows over-fit" on `ABC-009`.
- **A criterion narrower than its own `## Scope` is this board's recurring defect** — defect 1 below is
  exactly that. When you sweep for more, sweep for that shape specifically.

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
