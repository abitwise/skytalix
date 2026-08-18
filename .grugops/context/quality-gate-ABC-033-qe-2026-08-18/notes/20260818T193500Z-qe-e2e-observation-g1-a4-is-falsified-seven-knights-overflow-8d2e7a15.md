---
id: 20260818T193500Z-qe-e2e-observation-g1-a4-is-falsified-seven-knights-overflow-8d2e7a15
kind: observation
by: qe-e2e
at: 2026-08-18T19:35:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-002
  - EPIC-003
  - src/move-input.ts
  - src/frame.ts
supersedes:
---

# `G1` — `A4` is FALSIFIED: seven knights overflow the message region, hidden count 2

The engineer's `A4` claim was explicitly bounded — *"a worst case FOUND, not a proof over all legal
positions… I searched for one and did not find one"*. **I found one.** This note is the reproduction.

## The engineer's reasoning error, named precisely

The note says: *"The knight case is genuinely capped: exactly six squares attack any given square by
knight move."* **That is false, and it is false because of the square that was chosen.** `d2` sits
two ranks from the edge, so it has 6 knight-attackers. A **central** square has **8**. The whole
`A4` fixture set targets `d2` (`FIVE_KNIGHTS_FEN`, `TWO_KNIGHTS_FEN`) or `d4` with queens. Retarget
the knights at `d4` and the cap is 8, not 6.

## The reproduction — measured, not argued

Run against the delivered `src/move-input.ts` at `64b596c`, production deps, real `assembleFrame`
with the delivered panels, region read exactly as `src/move-input.test.ts:248-259` reads it.

| knights | FEN | line | candidates | region row 0 | region row 1 | hidden |
|---|---|---|---|---|---|---|
| 8 | `7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1` | `Nd4` | 8 | `Nc2d4 Ne2d4 Nb3d4` | `Nf3d4 Nb5d4 (+3 more)` | **3** |
| **7** | `7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1` | `Nd4` | 7 | `N2d4 Nb3d4 Nf3d4` | `Nb5d4 Nf5d4 (+2 more)` | **2** |
| 6 | `7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1` | `Nd4` | 6 | `N2d4 N3d4 Nb5d4 Nfd4` | `Nc6d4 Ned4` | 0 |

**Seven candidates is the threshold.** Six still fit; seven do not.

Eight-knight candidate list, in full:
`["Nc2d4","Ne2d4","Nb3d4","Nf3d4","Nb5d4","Nf5d4","Nc6d4","Ne6d4"]`

Both overflowing FENs **round-trip through `toFen` byte-identically** (test note 5's own standard),
so neither is a mis-transcription that makes the criterion vacuous.

## Why this is in scope for `A4`, pre-empting the obvious objection

The objection will be *"eight white knights is not a real game"*. Three answers:

1. **`A4`'s own words carry no reachability qualifier**: *"Given **any** `ambiguous` outcome this
   ticket can produce"*. This module produces it.
2. **The position is legal.** 8 white knights = 2 original + 6 promotions; White has 8 pawns.
   Black is not in check, White is to move, and it round-trips. `newGame` accepts it.
3. **The author already conceded adversarial positions are in scope.** `FIVE_KNIGHTS_FEN` and
   `SIX_QUEENS_FEN` are in the delivered test file, described in the engineer's own note as *"NOT
   positions from a game, deliberately"*. The bar was set at adversarial-but-legal by the
   implementation itself. `G1` clears that same bar; it is one knight further along the same axis.

Note also how close the accepted six-queen fixture already ran: the engineer measured it filling
**20 and 19 of 21 columns**. `A4` was passing with one column of headroom. That is not a margin.

## Disposition — and the two things that must NOT happen

The ticket pre-authorises this exact outcome, so no judgement call is needed:

> *"If any reachable ambiguity cannot fit, that is a finding for `EPIC-002`'s frame owner and a new
> ticket — **not a silent truncation and not a widening of the frame**, which would break epic
> acceptance `4a`."*

So:

- **Raise a new ticket against `EPIC-002`'s frame owner.** The message region cannot show a
  7+-candidate list and the frame's `(+N more)` marker is doing what it was built to do. The
  question the new ticket must answer is a **frame/UX** question — paginate? a second prompt? a
  narrower SAN rendering? — and it is not this ticket's and not this module's.
- **Do NOT truncate in `src/move-input.ts`.** The delivered module correctly hands the whole list
  over; the packing is the frame's.
- **Do NOT widen the frame.** `EPIC-003` acceptance `4a` breaks.
- **Do NOT mark `A4` "met" on the ticket page or in `plans/traceability.md`.** It is met for the six
  measured shapes and falsified at seven. Recording it as met is the failure mode this whole hop
  exists to prevent.

## Ready-to-paste reproduction for the fix ticket

```ts
// Add to the AMBIGUITIES table in src/move-input.test.ts once the frame owner has a fix.
// RED against 64b596c: region contains "(+2 more)" and 2 candidates are absent.
const SEVEN_KNIGHTS_D4_FEN = "7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1";
["seven knights -> d4", SEVEN_KNIGHTS_D4_FEN, "Nd4"],
```

**I did not commit this test.** It is red against the delivered branch, and committing a red test to
a branch that must gate green would break the gate rather than report the gap.
