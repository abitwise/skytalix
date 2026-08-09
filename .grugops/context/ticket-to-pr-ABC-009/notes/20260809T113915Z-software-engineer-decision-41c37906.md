---
id: 20260809T113915Z-software-engineer-decision-41c37906
kind: decision
by: software-engineer
at: 2026-08-09T11:39:15Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-022
  - NFR-001
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# The fix site and the shape of the guard — the structural choice, and the three alternatives it rejected

The ticket does not choose the mechanism. `## Scope` is the requirement, both Orchestrator notes say
the fix site is not ruled on, and BA/PM's correction 6 says the same in its last sentence. So this is
the engineer's call and it is recorded as one, with what it rejected, because a choice recorded
without its alternatives is indistinguishable from a default.

## What was built

Two guard conditions in `addCastlingMoves` (`src/moves.ts`), plus one `rookFrom` field on the
`CastleOption` interface and its four table rows, plus one `rook` local beside the existing `king`
local. `+30 −8` lines, one file.

```
for (const option of options) {
  if ((position.castling & option.right) === 0) continue;
  if (position.board[option.kingFrom] !== king) continue;   // added
  if (position.board[option.rookFrom] !== rook) continue;   // added
  if (option.empty.some(...)) continue;
  if (option.kingPath.some(isSquareAttackedBy...)) continue;
```

Three properties of that shape were chosen deliberately.

**1. Identity, not occupancy.** `king` and `rook` carry the moving side's colour bit, so the
comparison is against the mover's own `KING` and `ROOK` bytes and nothing else. BA/PM's correction 5
established by mutant that an occupancy test (`!== EMPTY`) passes all six original criteria and all
four of the new `A4` rows while leaking eight rows. Confirmed on this diff: weakening both tests to
occupancy fails `A5` and `A6` and nothing else.

**2. The generator layer.** The guards sit in `addCastlingMoves`, which `generateMoves` calls, so
both exported layers are fixed by one change rather than one of them by a filter. `## Scope` requires
that *"offered" means offered by `generateMoves` AND by `legalMoves`*, and `A3`–`A6` assert the
`FLAG_CASTLE` count on both.

**3. Above the two costlier tests.** A byte compare is cheaper than an emptiness scan over two or
three squares and far cheaper than an attack scan over three squares, so the cheap tests short-circuit
first. This is the innermost loop of the search (`NFR-001`), and on an invalid position the ordering
also skips the attack scan entirely.

## The three alternatives, and why each was rejected

**(a) Import `CASTLE_ROOK_MOVE` from `apply.ts` instead of adding a field.** The rook's from-square
already exists there (`src/apply.ts:70-75`), keyed on the king's destination. **Rejected on a
structural fact, not a preference: `apply.ts` already imports from `moves.ts`** (`FLAG_EN_PASSANT`,
`FLAG_NONE`, `FLAG_PROMOTION`, `type Move`), so importing back would create a **module cycle** — and
create it for a four-entry lookup table.

There is a second reason worth recording because it survives even if the cycle were acceptable: the
two tables answer different questions. `CASTLE_ROOK_MOVE` is *where the rook goes when the castle is
played*; `rookFrom` is *where the rook must stand for the castle to exist at all*. They agree on the
from-square today by construction, not by definition, and coupling a precondition to a move-execution
table would make a future change to either silently change the other.

**(b) Derive the rook square arithmetically per call** — `option.kingTo > option.kingFrom ? kingFrom + 3 : kingFrom - 4`.
Rejected on the module's own stated design: its header commits to *"a precomputed table rather than
per-call arithmetic — this is the innermost loop of the search (NFR-001), and 0x88 makes the edge test
that the tables rely on a single mask"*. A fourth field on a four-row frozen table costs nothing at
run time and matches the file's existing style (coding rule 11).

**(c) Filter at the `legalMoves` layer.** Rejected on the ticket's own words. A `legalMoves`-layer
filter satisfies *"no castling move is offered"* read at that layer while the exported `generateMoves`
keeps emitting a move the rules forbid, which is the `ABC-018` defect-1 shape BA/PM's correction 6
names. That `generateMoves` has no non-test caller but `legalMoves` today makes the two
**observationally equivalent for the product as it stands** — which is an argument for pinning the
layer, not against it, exactly as BA/PM stated it against its own criteria.

## One thing this decision deliberately does NOT do

**It does not add a colour-blind reading, and it does not add a criterion for one.** The delivered
guard is stricter than reachability requires: a wrong-colour king or rook on either home square is
already refused by the existing through-check test. That is measured in the companion `observation`
note rather than argued here, and the conclusion recorded there is that the stricter form is kept
because it is the honest statement of the rule, while **no criterion is proposed for the colour
dimension** — one would be the theatre BA/PM's correction 5 already rejected.

## What this decision does NOT establish

- **That the fix is complete against `A1`–`A10`.** The gate results are in the companion
  `observation` notes; this note is about the choice, not its verification.
- **Anything about `ABC-022`.** Its fix site (`addPawnMoves`) was not touched and its ticket was not
  edited. Half (b) is still live by design.
- **Anything requiring an ADR.** No architecture changed: no new module, no new export, no new
  dependency edge, and the one interface that changed is module-private (`CastleOption` is not
  exported).
