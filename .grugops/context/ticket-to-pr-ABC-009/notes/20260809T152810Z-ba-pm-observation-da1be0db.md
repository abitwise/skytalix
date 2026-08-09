---
id: 20260809T152810Z-ba-pm-observation-da1be0db
kind: observation
by: ba-pm
at: 2026-08-09T15:28:10Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A11
  - A13
  - src/moves.ts
  - src/legal.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - 20260809T150210Z-ba-pm-observation-cf01de8b
  - 20260809T151028Z-orchestrator-decision-22b59d96
supersedes: 
---

# The equivalence exclusion re-derived on a SECOND instrument — 12/12 agreement with the mutation verdicts — and the eight newly-required configurations measured with their setups asserted

Two things this hop had to measure before the criterion could be written. The Orchestrator's routing
note said plainly of the equivalence set: *"I re-derived none of those three."* An exclusion that rests
on one instrument's word is what this ticket keeps failing on, so I gave it a second one.

## 1. The equivalence set, asked a different way

Hop 3 classified enemy `KING`/`QUEEN`/`ROOK` as behaviour-equivalent **by mutation** — admit one, the
suite still reads 371/371 and nothing observable changes. That is an *absence* of signal, which is the
weakest kind of evidence. So this hop asked the **mechanism** directly instead: does the pre-existing
through-check test refuse the option **on its own**, independently of the identity guard? If it does,
admitting the byte cannot change behaviour; if it does not, the byte is a live gap.

Instrument: `isSquareAttackedBy` from `src/moves.ts`, evaluated over the white kingside option's
`kingPath` (`[4, 5, 6]` = `e1`, `f1`, `g1`, read verbatim from `src/moves.ts:283`). **Production code was
never patched** — this asks the mutant's question by evaluating the predicate.

**The instrument was polarity-checked before any verdict was read**, because a predicate that answered
`true` for everything (or `false` for everything) would fabricate a clean table either way:

```
g1 with a black ROOK on h1      -> true   (expected true)
g1 with no black attacker at all -> false  (expected false)
both polarities present: the predicate discriminates. Verdicts admissible.
```

Then all six enemy types on both home squares:

```
square       piece    e1   f1   g1    verdict      delivered legal/castles  pure
king's (e1)  KING     -    ATT  -     MASKED       13 / 0                   pure
king's (e1)  QUEEN    -    ATT  ATT   MASKED        3 / 0                   pure
king's (e1)  ROOK     -    ATT  ATT   MASKED        3 / 0                   pure
king's (e1)  BISHOP   -    -    -     not masked   13 / 0                   pure
king's (e1)  KNIGHT   -    -    -     not masked   13 / 0                   pure
king's (e1)  PAWN     -    -    -     not masked   13 / 0                   pure
rook's (h1)  KING     -    -    ATT   MASKED        5 / 0                   pure
rook's (h1)  QUEEN    ATT  ATT  ATT   MASKED        3 / 0                   pure
rook's (h1)  ROOK     ATT  ATT  ATT   MASKED        3 / 0                   pure
rook's (h1)  BISHOP   -    -    -     not masked    5 / 0                   pure
rook's (h1)  KNIGHT   -    -    -     not masked    4 / 0                   pure
rook's (h1)  PAWN     -    -    -     not masked    5 / 0                   pure

agreement with hop 3's mutation verdicts: agree 12/12, disagree 0/12
```

**Two independent instruments, exact agreement, and the mechanism is now named per row** — an enemy
`KING` on e1 masks via `f1`; on h1 via `g1`; `QUEEN`/`ROOK` rake the rank. The exclusion is safe to
write into a criterion **with its reason**, which is the difference between an exclusion and an
omission.

The delivered counts also reproduce hop 3's numbers exactly (`K3n2R` 13/0 pure, `K3p2R` 13/0 pure,
`4K2n` 4/0, `4K2p` 5/0) and match the ticket's existing rows (`A5` row 3 enemy bishop e1 = 13, `A6`
row 4 enemy bishop h1 = 5). Third independent reproduction of the two FENs the Orchestrator verified.

## 2. The own-`KING`-on-the-rook's-square exclusion, and my probe drifting off the precondition

My accounting probe reported this value **"constructible"** — via `4k3/8/8/8/8/8/8/7K w K - 0 1`, which
parses fine. **It is the wrong configuration.** That FEN puts the white king **on h1 with e1 empty**,
which is `A4`'s shape (the king off its home square), not *"the rook's home square holds an own KING
**while the king is also home**"*. The probe answered a different question and returned a plausible
number for it; **the printed FEN is the only reason I caught it**, which is why the probe prints the FEN
it used on every row.

Under the criterion's actual precondition, all four constructions are refused — both colours, both
sides, where hop 3 measured three:

```
4k3/8/8/8/8/8/8/4K2K w K - 0 1  -> REFUSED "position must have exactly one white king, found 2"
4k3/8/8/8/8/8/8/K3K3 w Q - 0 1  -> REFUSED "position must have exactly one white king, found 2"
4k2k/8/8/8/8/8/8/4K3 b k - 0 1  -> REFUSED "position must have exactly one black king, found 2"
k3k3/8/8/8/8/8/8/4K3 b q - 0 1  -> REFUSED "position must have exactly one black king, found 2"
```

## 3. The eight newly-required configurations, setups ASSERTED and inertness checked

At `A11`'s established doubling — every type in ≥2 configurations, both sides to move, all four rights.
Each row asserts its own setup (occupant type on the square under test, occupant is the **enemy's**,
right held, and **the other precondition satisfied**) and each is checked **not inert** — if the
through-check or the emptiness test would refuse the castle anyway, the row proves nothing about the
identity guard:

```
KING's home square — king off home, matching rook present, ENEMY occupant
enemy KNIGHT  W K  4k3/8/8/8/8/8/8/K3n2R w K - 0 1      13  0/0  pure
enemy PAWN    W Q  4k3/8/8/8/8/8/8/R3p2K w Q - 0 1      14  0/0  pure
enemy KNIGHT  B k  4N2r/8/8/5k2/8/8/8/4K3 b k - 0 1     17  0/0  pure
enemy PAWN    B q  r3P3/8/8/5k2/8/8/8/4K3 b q - 0 1     19  0/0  pure
ROOK's home square — king already home, ENEMY occupant
enemy KNIGHT  W K  4k3/8/8/8/8/8/8/4K2n w K - 0 1        4  0/0
enemy PAWN    W Q  4k3/8/8/8/8/8/8/p3K3 w Q - 0 1        5  0/0
enemy KNIGHT  B k  4k2N/8/8/8/8/8/8/4K3 b k - 0 1        4  0/0
enemy PAWN    B q  P3k3/8/8/8/8/8/8/4K3 b q - 0 1        5  0/0

setup failures 0/8   inert rows 0/8   (masked:false blocked:false on every row)
```

One count was hand-checked against the geometry rather than trusted: `4N2r/8/8/5k2/…/4K3 b k` reads
**17**, not 18, because the white knight on e8 attacks `f6` and removes one of the black king's eight
moves. The instrument and the board agree.

## 4. A trap for whoever writes the rows, measured because a count cannot carry them

**On the king's home square, enemy `BISHOP`, enemy `KNIGHT` and enemy `PAWN` all answer 13 moves. On
the rook's home square, enemy `PAWN`, enemy `BISHOP` and the EMPTY square all answer 5.** So a row
asserting only its move count is **interchangeable with rows for two other byte values**, and a
mislabelled row would pass green. The setup assertion is not decoration on these four values — it is
the only thing pinning the row to the value it claims. QE's existing `expectImpostorSetup` already does
it; the point is that it must not be skipped here.

## What this observation does NOT establish

- **That the equivalence set stays equivalent after the new rows land.** Not measured — no rows exist
  yet. The Orchestrator asked QE to re-confirm the survivors after the rows land, as it did for the nine.
- **That a mutant admitting an enemy KNIGHT still survives.** I did not re-mutate this hop; that is hop
  3's measurement and the Orchestrator's independent re-verification, both already recorded. **No
  mutation was run at this hop, so the one-process-per-tree trap did not arise** — recorded so nobody
  reads these numbers as mutation results.
- **Any `NFR-001`, perft, coverage or throughput figure.** None measured by this role at any hop.
