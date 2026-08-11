---
id: 20260812T144000Z-ba-pm-observation-g2-trap-resolved-6e13a8d5
kind: observation
by: ba-pm
at: 2026-08-12T14:40:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-gaps
  - ABC-017
  - ABC-019
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - 20260812T100500Z-qe-e2e-observation-mutants-9f2b41c7
  - 20260812T101000Z-qe-e2e-observation-criteria-gaps-3d81f6a4
supersedes:
---

# The `WCACHE` / `D23` trap: the two directions are NOT in tension once the third property is named

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> The brief called this *"the most interesting thing on this hop"* and asked how I resolve it. This
> note is the answer, separated from the rulings so it can be read on its own.

## The trap, as QE handed it over

QE measured, with a green control:

| suite | `WCACHE` (memoises rows per `GameHistory` in a `WeakMap`) |
|---|---|
| delivered — `A11`'s fixtures are module-scope singletons already rendered by earlier tests in the file | **KILLED** (`toSan at 40: expected 16 calls, got 0`) |
| `A11`'s fixtures built PER TEST — the `D23` treatment `A9` just received | **SURVIVED 734/734** |
| control: delivered pane, `A11`'s fixtures per test | 734/734 green — the variant is sound |

**So the only thing killing a caching pane is the very fixture-sharing that `D23` was raised to
eliminate**, and generalising the `D23` remedy to `A11` — which is the obvious next tidy-up, and
which a later reader will read `## Test notes` as endorsing — silently removes the guard. QE's words:
*"the two properties are in direct tension and nothing on the ticket records it."*

## The resolution: the tension is an artefact of a property having no name

Three distinct properties were riding on two criteria. Once they are separated the contradiction
disappears, because **they do not want the same fixture for the same reason** — and one of them wants
a shared object *by construction*, not by accident.

| property | what it asserts | what it needs from a fixture | why |
|---|---|---|---|
| **determinism** | same input → same output | anything at all | a cache satisfies it **perfectly**, and *better* than the correct build |
| **non-mutation** | the render leaves the caller alone | an object **nothing has rendered yet** | `D23`: a snapshot taken after a first-render corruption cannot see it |
| **freshness** | the next render reflects the caller's next move | **ONE object rendered twice ACROSS a mutation** | it is a statement about a SEQUENCE; a fresh object has no previous render to be stale against |

`A9` owned the first two. **The third was owned by nobody**, and was being supplied incidentally by
fixtures that happened to be shared across unrelated tests **in a different file**.

**That is the whole of the trap.** The `D23` remedy was never in tension with freshness. It was in
tension with freshness being provided **by accident** — and an accidental guard is exactly the thing
this ticket has spent four hops removing, because nobody can see it, nobody maintains it, and the
next tidy-up deletes it without knowing.

## So the ruling is: name it, and give it its own object

**`A14`** asserts freshness directly — render, `playMove`, render the **same object**, and require
that the second pane reflects the new ply. It shares its object **deliberately, inside its own
criterion**, which is not a `D23` regression because `D23` is about an object being rendered by an
**earlier, unrelated test** before the snapshot is taken. `A14` has no snapshot and no earlier test:
it owns its object, and the sharing IS the assertion.

**The consequence is the useful part: `A11` is now free.** Tidying `A11` to per-test fixtures — the
obvious next step, and the one QE warned would silently remove a guard — **loses nothing once `A14`
exists**, because the property that tidy-up would have destroyed is now asserted where it belongs and
where a reader can find it. **The two directions stop pointing at each other.**

## Why `A14` is a new criterion and not a clause on `A9`

This is the load-bearing design choice and it is the direct inverse of the trap:

> **Putting freshness inside `A9` — the criterion `D23` had just forced onto FRESH objects — is the
> one edit that would have made the contradiction real.** `A9` would then have required, in one
> criterion, both an object nothing has rendered and an object something has rendered. That is not a
> tension to be documented; it is a criterion that cannot be satisfied as written.

Keeping them separate also keeps each criterion's failure legible: `A9` reports *"the render touched
the caller"*, `A14` reports *"the pane is stale"*, and on a caching build those are two different
diagnoses of two different bugs.

## The consumer is real, and it is the next ticket in the merge order

Read at source at this hop — `src/history.ts:85-88`:

```
export function playMove(history: GameHistory, move: Move): void {
  moveListOf(history).push(move);
  makeMove(history.position, move);
}
```

**In place.** So `ABC-019`'s loop hands the **same `GameHistory` object** to `renderHistory` every
frame. A cached pane shows move 1 forever and the game becomes unreadable from move 2; a frozen
`moves` array (`WFREEZE`) leaves the loop unable to play at all, failing with a `TypeError` out of
`playMove` — **naming the wrong subsystem**, which is the misdiagnosis shape this project keeps
paying for and which the Orchestrator's sequencing decision was made to avoid.

## What `A14` deliberately does NOT catch

**`WSPLICE`.** It splices the caller's array and `unshift`s it back, so a render → `playMove` →
render sequence sees a perfectly restored array and passes. That build belongs to **`A9`'s new
during-render clause** (`D26`) and is homed there. Recorded explicitly so a mutant net is not built
expecting `A14` to kill it — the same courtesy `## Test notes` already extends for `A2`'s redundant
clause.

## Measured, not argued

On delivered code, out of tree, at this hop: first render's last row `[  37. Nb1            ]`, then
one `playMove`, then `[  37. Nb1     Nc6    ]`; the two panes differ; `history.moves.length` is 21.
**The delivered pane is fresh and leaves its caller usable — the Engineer is owed a test, not a
fix.**
