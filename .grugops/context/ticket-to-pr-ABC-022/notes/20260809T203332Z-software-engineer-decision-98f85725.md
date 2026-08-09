---
id: 20260809T203332Z-software-engineer-decision-98f85725
kind: decision
by: software-engineer
at: 2026-08-09T20:33:32Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-001
  - src/moves.ts
  - src/apply.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# The guards go AFTER the `epSquare` test — the ordering decision, its rejected alternative, and its denominator re-derived on this build

The brief asked for this to be a decision rather than a default, on the `ABC-009` precedent. It is
one, and the number behind it is mine rather than inherited.

## What was chosen

```ts
if (to === position.epSquare) {
  const capturedPawn = PAWN | (black ? 0 : BLACK);
  if (target === EMPTY && position.board[to - forward] === capturedPawn) { ...push... }
}
```

The two preconditions sit **inside** the `to === position.epSquare` test.

## The alternative that was rejected, and the cost that decides it

The alternative is folding both conditions into the branch condition **before** the `epSquare`
test — the shape an engineer reaches for when writing "reject early". Counters at the guard site,
run on an instrumented copy of **this** build over the standing 518,474-node walk:

```
conditions evaluated, shipped placement (AFTER the epSquare test)  :     331
conditions evaluated, rejected alternative (BEFORE that test)      : 216,269    (653x)
times the two conditions REJECTED anything                         :       0
```

Both placements return an identical move set on every position — the conditions reject nothing in
legal play, so the choice cannot change an answer. It is **purely cost**, and the cheap one was
taken.

These reproduce `ABC-022`'s `NFR-001` figures **exactly** (`331 / 216,269 / 0`, ~650x). That makes
them a **second independent derivation** of BA/PM's numbers rather than a restatement of them —
different harness, different tree, same result. The Orchestrator listed those counts among the
things it did **not** re-derive; they are re-derived now.

## Two smaller shape decisions, recorded because they were choices

**The clause is written as an EMPTINESS test, not a colour test.** `A5`'s corrected text already
records that the two are behaviour-equivalent at this program point — the ordinary-capture branch
consumes every enemy occupant and `continue`s first — so no position can tell them apart and no
criterion was asked to. This is therefore a readability choice: `target === EMPTY` says the
precondition the comment above it states, whereas `!(target !== EMPTY && isBlack(target) === black)`
says a fact about a branch that already ran. **Nothing behavioural rests on it**, and the deleted
`A5` guard is what protects the surrounding structure, not this clause.

**`to - forward` is read out of `apply.ts` rather than re-derived.** `enPassantCaptureSquare` in
`src/apply.ts:78` is `move.to + (isBlack(move.piece) ? 16 : -16)`, and `forward` in `addPawnMoves` is
`black ? -16 : 16`, so `to - forward` is the same square by construction. This matters because the
generator and the applier must agree about **which** pawn is being captured: half (b) is exactly the
failure where they disagreed silently. The expression was checked against that file, not recalled.

**`capturedPawn` is hoisted into the local the pushed move already uses.** The guard tests the same
expression the move claims, rather than two expressions that happen to agree today.
