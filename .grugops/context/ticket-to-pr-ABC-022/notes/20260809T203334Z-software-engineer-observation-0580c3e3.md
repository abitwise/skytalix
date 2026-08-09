---
id: 20260809T203334Z-software-engineer-observation-0580c3e3
kind: observation
by: software-engineer
at: 2026-08-09T20:33:34Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-009
  - src/moves.ts
  - src/moves.enpassant.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Red before green, and both halves proved load-bearing on DISJOINT named sets — with `A5` re-verified against the delivered table rather than inherited

`## Test notes` item 3 is a requirement, and it is discharged by measurement here. Every tree below
is a full separate copy, run in **its own OS process** (this board's recorded `ABC-009` trap: Node's
module cache served a pristine `moves.ts` to four tree states in one process and produced a false
negative). Every anchor replacement asserted `count == 1` before writing and asserted the file
changed after. **`tsc --noEmit` exit 0 on every tree BEFORE any red was believed**, the unfixed
control included — the board's other recorded trap.

| tree | `src/moves.ts` md5 | tests failed of 58 |
| --- | --- | --- |
| unfixed control | `0e247853ab2c05887c76105ff83d8621` | **31** |
| delivered fix | `6335b452fc21ffe2d0f902ecab930840` | **0** |
| empty-target condition DELETED | `6762b334bd096f8b1d072cb68478786d` | **8** |
| captured-pawn condition DELETED | `2f19080b1bf32fc1f72bd063f48ea3f3` | **23** |
| colour-shaped RESTRUCTURE | `dd5b7ab68fe2a7f2a1ec2cd80740c251` | **4** |

## The two halves fail disjoint sets — checked by set arithmetic, not by reading

Failing test **names** were extracted from vitest's JSON reporter and compared with `comm` / `cmp`:

```
delete the empty-target condition   -> 8 named tests   (A1 x4, A2 x4  — the own-colour rows)
delete the captured-pawn condition  -> 23 named tests  (A3 x6, A2 x6, A4 x11 — the half-(b) rows)
intersection of the two sets        -> 0 tests   (EMPTY)
union of the two sets               -> byte-IDENTICAL to the 31 reds of the unfixed control
```

Neither condition subsumes the other, and together they explain **exactly** the unfixed tree's
failures with nothing left over. `A2` is reached by both halves, but never on the same row, so the
disjointness holds at the level the ticket asks for — **named tests**, not criteria.

The 27 tests that pass on the **unfixed** control are exactly `A5`'s four rows, `A6`'s two controls,
and the purity rows that are clean today. That confirms on the tip what the corrected preamble says:
`A5`–`A10` are gates, not currently-failing reds.

## `A5` is load-bearing against THIS file, and that was measured here rather than carried

BA/PM measured the colour-shaped restructure against their own tree. It was rebuilt here against the
delivered table — own-colour rejected by a `continue` at the top of the capture loop, the
ordinary-capture branch's own `continue` dropped in the same rewrite, so every enemy occupant falls
into the en-passant branch:

- typecheck exit 0
- **passes `A1`, `A2`, `A3`, `A4`, `A6`**
- **passes the whole existing suite: 381 passed (381)**, 0 failed, 0 skipped
- **fails ONLY `A5` — all four rows**: both knight rows and both new rook rows, both colours

So `A5` is the only thing on this board that catches it, on the delivered fix as well as on BA/PM's,
and the widening to two piece types on both colours is doing work rather than decorating. It was not
deleted and the brief's warning was not needed in the end — but it is now independently earned.

## The self-masking oracle reproduced on a second instrument

On the unfixed control, `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`:

- purity **across the whole `legalMoves` call** — **PASSES** (the corruption is healed in-pass)
- purity **per make/unmake pair** — **FAILS**: `board bytes ... after 51->36`, byte on e4 expected
  `9` and received `1`, i.e. the black pawn rewritten white by the en-passant move

That is BA/PM's self-masking measurement reproduced by an independently written oracle, and it is
the reason the per-pair assertion is in the file rather than only a row-selection rule in prose.
