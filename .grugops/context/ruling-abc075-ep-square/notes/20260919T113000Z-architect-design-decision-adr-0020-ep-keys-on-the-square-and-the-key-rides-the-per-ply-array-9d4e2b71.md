---
id: 20260919T113000Z-architect-design-decision-adr-0020-ep-keys-on-the-square-and-the-key-rides-the-per-ply-array-9d4e2b71
kind: decision
by: architect-design
at: 2026-09-19T11:30:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ABC-081
  - ADR-0020
  - ADR-0005
  - ADR-0006
  - ADR-0002
  - NFR-001
  - NFR-005
  - memory-bank/50-decisions/ADR-0020-ep-component-keys-on-the-ep-square-and-the-key-rides-the-per-ply-array.md
  - .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
supersedes:
---

# THE RULING: `ADR-0020` — the ep component keys on the ep square being SET (owner's), and the incremental key rides the search's per-ply array (mine)

**NOT A STAMP.** `human_admission` is `off`. This is a hand-authored `decision`; the owner's word is
transcribed, not verified by any gate. The ADR is the authority; this note is the pointer and the
two-sentence form.

## The two rulings, one sentence each

1. **Ep component (the owner's, verbatim *"relax to "ep swuare set""*, 2026-09-19):** the
   en-passant Zobrist component enters the key **iff `position.epSquare !== NO_SQUARE`**, no
   legality predicate — superseding `ADR-0005` Decision clause 1 only; `ADR-0006` not re-opened.
2. **Threading (Architect/Design's, the owner did not rule it):** the key rides the **search's
   per-ply array** (`ADR-0002` clause 3 taken literally) — `Position` gains no field,
   `makeMove`/`unmakeMove` are untouched, `unmakeMove` needs no key work because `keys[ply]` still
   holds the pre-move key.

## The seam `ABC-075` builds against

```ts
export function zobristKeyAfterMove(
  keyBefore: bigint,
  position: Position, // AFTER makeMove(position, move)
  move: Move,
  undo: UndoRecord,   // what that makeMove returned
): bigint;
// invariant, asserted over a depth-4 walk of src/perft.test.ts against the POST-ruling oracle:
//   zobristKeyAfterMove(zobristKey(before), after, move, undo) === zobristKey(after)   // 0 mismatches
//   zobristKey(after unmake) === keys[ply]                                              // 0 drift
```

Lives in `src/zobrist.ts` beside `zobristKey` (which survives as seed + oracle). `UndoRecord` and
`Move` are type-only imports; the `legal.ts` import is dropped; the graph stays acyclic, verified by
reading the import lines of `apply.ts`, `moves.ts`, `position.ts` — none imports `zobrist.ts`.
**The array, its seeding and its two consumers are `ABC-081`'s** (`ADR-0002` clause 3,
`ABC-081 A6`); `ABC-075` does not touch `src/search.ts`.

## The consequence, honestly

Two positions differing only in an ep square nobody can capture on now hash **differently**
(`ADR-0005` measured 862 of 19,667 ep-setting moves on the perft table). Finer key, never coarser:
a **TT miss, never a wrong answer**; a threefold repetition **deferred one occurrence, never falsely
declared**. `ABC-011`'s `1.e4` pair hashes differently again — the owner's deliberate trade.
`ADR-0005 F6` is **discharged, not tripped**: the hash no longer writes to the board, by removal of
the predicate rather than by a parallel-search choice (none is made; single-threaded stays).

## Rejected (full text in the ADR § Alternatives)

Key on the mutable `Position` (breaks `ADR-0002` clause 1; paid ~3.3x per node inside the legality
filter where nobody reads it; moves the change into `apply.ts`, the hottest path). Both (a second
representation of one truth). A separate unmake function (the array already holds it). Keeping
`ADR-0005` and bolting the ep component on non-incrementally (foreclosed by the owner's word, and
rightly — it keeps the probe move on the per-node path).
