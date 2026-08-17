---
id: 20260817T190709Z-qe-e2e-observation-abc076-a1-is-vacuous-for-table-content-at-184-and-at-12-the-widening-bought-nothing-for-that-defect-class-99a7fcf7
kind: observation
by: qe-e2e
at: 2026-08-17T19:07:09Z
verified_by:
confidence: high
refs:
  - src/evaluate.ts
  - src/evaluate.test.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - .grugops/context/refinement-abc076-a1-corpus-2026-08-17/notes/20260817T184032Z-ba-pm-decision-abc076-a1-corpus-widened-to-the-six-perft-positions-plus-their-one-ply-children-757221a2.md
supersedes:
---

# The 184-vs-12 experiment: BOTH GREEN. `A1` is blind to a wrong table entry at **any** corpus size, so the widening bought nothing for the defect class it was bought for.

This is the experiment the QE hop was dispatched to run, and it is reported before anything else
because it decides what `ABC-082` and `ABC-083` inherit. **It is a measurement, not a reading of the
code.** Every figure below was produced by mutating `src/evaluate.ts` on the branch tip `99a7fcf`,
running, and restoring.

## The claim under test

BA/PM's 2026-08-17 decision widened `A1`'s corpus 12 → 184 on this argument: *twelve pairs catch a
GLOBAL SIGN ERROR but are BLIND to one wrong entry in one mirrored table on a square none of six
standard positions occupies.* `A1`'s repaired text on `main` states the same as a promise: *"One
hard-coded sign error, **or one wrong mirrored table entry**, fails this."*

## The experiment

**Target square, chosen by measurement not by eye.** A script enumerated which `(pieceType,
tableIndex)` pairs the six roots read (58) versus which the full 184 read (141). **83 entries are
reached by the one-ply children and by no root** — exactly the population BA/PM's argument is
about. `KNIGHT_TABLE` index 27 (white `d5` / black `d4`) is one of them.

**Mutant 1 — that one entry, `20` → `999`.** Confirmed live first: a lone white knight on `d5`
scores `1319` mutated against `340` clean.

| corpus | result |
|---|---|
| **`A1` @ 184** (6 roots + 178 one-ply children) | **GREEN — 0 mismatches** |
| **`A1` @ 12** (the six roots and their mirrors) | **GREEN — 0 mismatches** |
| the whole `src/evaluate.test.ts` (20 tests) | **GREEN** |
| **`npm test`, the whole repo (889 tests)** | **GREEN — 31/31 files** |

**This is the "both green" branch of the dispatch, and it is the most serious of the three.**

**Mutant 1b — the generalisation, so nobody can call mutant 1 a lucky square.** A copy of
`evaluate.ts` with **all six piece-square tables and every `PIECE_VALUE` entry replaced by
pseudo-random numbers in ±1000** (kiwipete scores `-1136` instead of `105`, so the tables are
certainly live):

- **`A1` @ 184: GREEN, 0 mismatches.**
- **`A2` (startpos exactly 0): GREEN.**

## Why — and it is structural, not a coincidence of these tables

`whiteMinusBlack` (`src/evaluate.ts:128`-`:150`) reads **one table per piece type from both
colours**, black through a rank-flipped index:

```
const tableIndex = (black ? rank : 7 - rank) * 8 + file;
```

A white piece of type `t` on `(file, r)` reads index `(7-r)*8 + file`. Its mirror image — a black
piece of type `t` on `(file, 7-r)` — reads `(7-r)*8 + file`. **The same index.** So
`whiteMinusBlack(mirror(p)) === -whiteMinusBlack(p)` is an algebraic identity of the implementation
that holds for **every possible table content and every possible material value**. `A1` is an
identity check on the *shape* of the read, not on the *contents* of the tables.

**The defect class BA/PM widened the corpus to catch cannot exist in this implementation.** There is
no separate black table for one entry to be wrong in — "mirrored for black" was implemented as a
mirrored *index*, not a mirrored *table*. Under an implementation with two physical tables the
argument would have been correct; under this one, no corpus of any size makes `A1` sensitive to a
table entry.

`A2` falls to the same identity for a different reason: the start position is its own mirror, so it
scores `0` for any tables whatsoever. `A2` constrains the `-0` sign question and nothing else.

## What `A1` DOES buy, measured

**Mutant 2 — global sign flip** (`return position.blackToMove ? 0 - score : score` → `return
score`):

| corpus | result |
|---|---|
| `A1` @ 184 | **RED — 170 mismatches** |
| `A1` @ 12 | **RED — 4 mismatches** (kiwipete, position-3, position-4, position-6) |

**Both sizes catch it, and 12 catches it four times over.** So the one defect class `A1` genuinely
detects was already detected by the corpus BA/PM rejected as too weak.

## The honest verdict on the widening

**BA/PM's argument is NOT vindicated, and the finding is not that BA/PM reasoned badly.** The
decision note was written on 2026-08-17 at `757221a2`, *before* `src/evaluate.ts` existed, and it
reasoned about a plausible implementation ("one table per piece type, **mirrored for black**", the
ticket's own `## Scope` wording) in which the defect class is real. The engineer then chose a
mirrored-index implementation in which it is not. **Nobody was wrong at the time they wrote; the
premise expired when the code landed and nothing re-checked it.**

**What it costs now, stated plainly, because two tickets inherit it:**

- The 184-position corpus, the one-ply expansion machinery, and the castling/`epSquare` mirroring
  the widening forced into the helper are **not paid for by `A1`'s stated purpose**. They are paid
  for by `ABC-082` and `ABC-083`, whose terms (pawn structure, king safety, mobility) **do** read
  fields and square relations that a 12-position corpus would barely exercise — and by the
  castling/`epSquare` mirroring, which those tickets will genuinely need. **The work is not waste;
  the justification on record for it is wrong.**
- `ABC-082` `A1` ("`ABC-076`'s corpus plus ≥ 15 new") and `ABC-083` `A1` will inherit a property
  that is an identity, and will read its greenness as evidence about their own tables. **That is the
  live risk, and it is why this is reported rather than filed.**

## What I did NOT do

I did not add a test pinning table contents. The ticket's **test note 3** forbids it in terms
(*"Do not assert exact centipawn totals beyond `A2`… assert relations that survive tuning"*), and
overriding a stated design note is BA/PM's call, not QE's. **This is referred, not fixed.**
