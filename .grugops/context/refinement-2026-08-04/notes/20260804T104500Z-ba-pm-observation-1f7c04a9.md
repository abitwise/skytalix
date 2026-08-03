---
id: 20260804T104500Z-ba-pm-observation-1f7c04a9
kind: observation
by: ba-pm
at: 2026-08-04T10:45:00Z
verified_by: 
confidence: high
refs:
  - refinement-2026-08-04
  - ABC-022
  - ABC-011
  - ABC-009
  - ABC-010
  - src/moves.ts
  - src/legal.ts
  - src/apply.ts
  - ticket-to-pr-ABC-011
  - 20260804T090000Z-orchestrator-decision-eec7108c
  - 20260803T133000Z-architect-design-decision-7c41d0ab
  - 20260803T133500Z-architect-design-observation-9b2e4f17
  - 20260803T150500Z-software-engineer-observation-8c4d2a17
  - 20260803T160000Z-qe-e2e-decision-69ddf1ff
supersedes: 
---

# What BA/PM measured before cutting item 1, and where it agrees and disagrees with the three roles that routed it

Neutral record so the decision beside it can be checked rather than believed. Everything below was
run by me at this task against the repository's **merged `main`**, read-only, on scripts written from
`src/moves.ts:172-197` read directly rather than from any prior role's script or summary.
**Apple M3 / Node v24.12.0 / darwin-arm64 — `UNKNOWN - verify` on any other hardware.**

The task's instruction was explicit: three roles have described this and none has cut it; do not
become the fourth to describe it. So this note records the reproduction, and the `decision` beside it
records the ticket.

## 1. The routed defect reproduces exactly as described

`generateMoves` on the two FENs on record:

```
FEN                                     ep moves offered   onto own piece   legalMoves ep
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1     d4e3               YES              1
4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1     e5d6               YES              1
```

Mechanism, re-read out of the source rather than transcribed: the ordinary-capture branch at
`src/moves.ts:177` requires `target !== EMPTY && isBlack(target) !== black` and `continue`s. An
occupant of the **mover's own** colour fails that test, does not `continue`, and falls through to the
`to === position.epSquare` branch at line 187. **Agrees with all three prior roles.**

## 2. THREE THINGS THE PRIOR NOTES DO NOT SAY

### 2.1 The shape is piece-agnostic — a rook reproduces it, not only a knight

```
4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1     d4e3   onto own ROOK   legalMoves ep: 1
```

Both FENs on the record put a **knight** on the ep target, and the memory-bank's known-issues row
names those two FENs. Line 177 reads only the occupant's **colour**, so every own-colour piece type
reproduces. **Consequence for the ticket:** an acceptance criterion written over the two recorded
FENs would be satisfiable by a knight-shaped fix. `ABC-022`'s A1 is written over the class — at least
two piece types and both colours to move.

*(A king on the ep target could not be probed: `parseFen` rejects a second king of the same colour,
which is a FEN-validation guard and not part of this defect.)*

### 2.2 The same branch violates a SECOND precondition, and that one corrupts

The comment at `src/moves.ts:183-186` states two preconditions — *"the target square is empty"* and
*"the captured pawn sits beside the mover on `to`'s file, one rank back"*. Neither is checked. The
second one:

```
FEN                                    ep offered   position after ONE legalMoves() call
4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1       b2a3         4k3/8/8/8/8/8/pP6/4K3 w - a3 0 1   phantom BLACK pawn a2
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1       e5d6         4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1  phantom BLACK pawn d5
4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1      e5d6         4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1  WHITE d5 pawn turned BLACK
```

`legalMoves` **permanently mutates the position it documents as unchanged** — `ABC-009`'s symptom by
the en-passant route rather than the castling route. This half was never routed as an item of its
own. `ABC-011` closed it for the **hash** (guard (b) in `hasLegalEnPassant`); the **generator** is
untouched, exactly as `memory-bank/60-progress.md` says.

### 2.3 Playing the over-offered move destroys the mover's own piece

```
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1  --makeMove-->  4k3/8/8/8/8/4p3/8/4K3 w - - 0 2
4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1  --makeMove-->  4k3/8/3P4/8/8/8/8/4K3 b - - 0 1
```

The mover's own knight is gone in both. `makeMove`/`unmakeMove` round-trip **byte-exactly** here, so
the prior notes' "pure" is correct **about the pair** and says nothing about the **consequence**. One
move removes two pieces: the enemy pawn (legitimately) and the mover's own piece (by overwrite).

## 3. THE ROUTING NOTE'S FIRST TRAP IS HALF WRONG — and correcting it strengthens the conclusion

The Orchestrator's decision note states perft cannot clear this because *"a generator that offers an
extra move which the legality filter later rejects can still produce exact perft counts."*

**Measured: the legality filter does NOT reject it.** `legalMoves` returns the over-offered
en-passant move on both routed FENs and on the rook variant — the `legalMoves ep: 1` column above.

The real reason perft is silent is that the **trigger population is empty**. Exhaustive walk of
`src/perft.test.ts`'s own table at its own `fast` depths, with roots and depths **read out of that
file rather than recalled** (my first run recalled position-6 and produced 9,738 instead of 92,016 —
the identical error the second design hop recorded, caught by the same cross-check):

```
startpos     depth 4  nodes 206604       kiwipete     depth 3  nodes  99950
position-3   depth 4  nodes  46256       position-4   depth 3  nodes   9738
position-5   depth 3  nodes  63910       position-6   depth 3  nodes  92016

TOTAL nodes visited                                 : 518474
nodes with epSquare set                             :  81397   (15.70%)
nodes whose ep TARGET is occupied (any piece)       :      0
   ...occupied by the MOVER'S OWN piece             :      0
ep moves offered onto the mover's own piece         :      0
```

**518,474 / 81,397 is the sixth independent reproduction of that pair on this project.**

**The conclusion the trap defends is unchanged and is now on firmer ground:** `32/32 exact at depth`
does not clear this class. But the mechanism matters, because it changes what the fix must be tested
with — **no perft depth and no additional perft position can ever reach this defect**, so a new
perft case would cost CI minutes for zero coverage. `ABC-022`'s test notes forbid one.

## 4. THE SECOND TRAP IS CONFIRMED, AND STRONGER THAN QE PUT IT

QE's correction to the Engineer (`20260803T160000Z-qe-e2e-decision-69ddf1ff` §4): guard (a) is
load-bearing for **two** classes and only one is this defect, so *"may become deletable"* is
over-stated.

Re-derived here by applying a guard-(a)-deleted mutant to a copy of `src/legal.ts`
(`if (position.board[target] !== EMPTY) return false;` removed; repository `src/` never modified):

```
                                                     hasLegalEnPassant, guard (a) DELETED
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1   OWN knight     true   (correct: false)   pure
4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1   OWN knight     true   (correct: false)   pure
4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1   ENEMY knight   true   (correct: false)   pure
4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1   ENEMY knight   true   (correct: false)   pure
```

**Guard (a) is required for BOTH classes, and fixing the generator changes neither row**, because
`hasLegalEnPassant` **synthesises its probe `Move`** (`src/legal.ts:117-124`) and never consults
`generateMoves`. Guard (a) is a precondition of the **predicate**, not compensation for the
**generator**. So "deletable once the generator is fixed" is not merely over-stated — it is **false
for every class guard (a) covers**. QE's correction is upheld and extended; the Engineer's original
framing is not what `ABC-022` carries.

Controls confirming the enemy-occupant class is genuinely not a generator defect (shipped code,
unmutated):

```
4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1   generateMoves offers NO ep move
4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1   generateMoves offers NO ep move
```

## 5. Two gaps in other tickets, named rather than acted on

- **`ABC-010` does not fully gate this.** Its scope rejects *"an en-passant square with no pawn that
  could have made the double push"* — which closes §2.2's trigger. It does **not** close §1's: on
  `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` the double-push pawn (white, e4) **is** present, so
  `ABC-010`'s stated check accepts the FEN.
- **`ABC-009`'s Scope promises more than its Acceptance tests.** Scope bullet 1 says the position is
  byte-identical on return *"for every position it accepts"*; every one of its acceptance criteria is
  a castling FEN. An engineer building `ABC-009` to its acceptance fixes `addCastlingMoves` and
  leaves §2.2 live, with a green gate.

Both are flagged on `ABC-022` and in `memory-bank/60-progress.md`. Neither ticket was edited — that
would be the board sweep this task was told not to do.

## 6. Harness

Four throwaway scripts in the session scratchpad plus one guard-(a)-deleted copy of `src/` outside
the repository: `repro-gen.ts` (the offered-move table), `repro-gen2.ts` (make/unmake, the filter
question, and the reachability walk), `repro-gen3.ts` (the one-precondition-or-two probe), and
`nogA/probe.ts` (the guard-(a) mutant). **Not committed** — the posture every measurement on this
project has taken. Every number is transcribed here with its machine; anyone re-running should expect
to rebuild the scripts from this note rather than find them. **No file under the repository's `src/`
was modified at any point.**
