---
id: 20260818T222500Z-qe-e2e-claim-g5-disjointness-is-false-b2b4-makes-both-grammars-claim-different-moves-d5a90c37
kind: claim
by: qe-e2e
at: 2026-08-18T22:25:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/san.ts
  - src/coordinate-move.ts
  - repair-ABC-033-2026-08-18
  - 20260818T202000Z-software-engineer-decision-g5-the-code-is-right-the-page-was-wrong-and-no-laziness-was-manufactured-6b2f01d4
  - 20260818T215800Z-software-engineer-claim-audit-of-the-five-inherited-notes-four-hold-one-miscounts-its-own-blast-radius-79fd607f
supersedes:
---

# The `G5` disjointness argument is FALSE. `B2b4` is a counterexample, and the `confidence: high` is NOT earned

The finisher flagged this as *"plausible, not proved, and the `G5` note's `confidence: high` is doing
some work there"*. I was asked whether the record overclaims. **It does, and the claim is not merely
unproved — it is false.** I have a counterexample.

## The claim

`src/move-input.ts:199-203`, in the module's own doc comment, and the `G5` note in the same words:

> the two grammars are disjoint on every string either accepts … **so no line can make both claim a
> move and no line can tell the two orderings apart by its outcome**

## The counterexample, run

FEN `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` — white pawn `b2`, white bishop `d2`. Input **`B2b4`**:

| reader | answer |
|---|---|
| `parseCoordinateMove(position, "B2b4", legal)` | `move` → **`b4`** (the pawn's double push) |
| `parseSan(position, "B2b4", legal)` | `move` → **`Bb4`** (the bishop, rank-qualified from rank 2) |
| `resolveMoveInput(history, "B2b4")` | `move` → **`b4`** |

Two readers, one real string, **two different legal moves**. The module returns coordinate's answer,
which is the precedence as written — so the *behaviour* is the documented one. What is false is the
*argument*, in both of its halves: a line CAN make both claim a move, and this line DOES tell the two
orderings apart by its outcome — swap them and the player gets the bishop instead of the pawn.

## Why it happens — one letter of the alphabet

`parseCoordinateMove` lowercases before matching (`src/coordinate-move.ts:84`), so it sees the first
character folded. `PIECE_MOVE` (`src/san.ts:199`) requires the first character to be one of
`N B R Q K`, and their lowercase forms are `n b r q k`. **Exactly one of those, `b`, is also a file
letter.** Every `B`-initial string of shape `B<rank><file><rank>` is therefore in both grammars at
once: SAN reads it as a rank-qualified bishop move, coordinate reads it as `b<rank>` → `<file><rank>`.
The "a SAN short enough to be confused with a coordinate is not one" intuition holds for `N`, `R`,
`Q`, `K` and fails for `B`.

A wider sweep over all `B`-initial four- and five-character shapes on four positions found **10**
inputs where both readers claim something. Nine of them (a black bishop on `b4`: `B4a3`, `B4a5`,
`B4c3`, `B4c5`, `B4d6`, `B4e7`, `B4f8`, …) are the benign kind — both readers name the **same** move.
`B2b4` is the one where they name **different** moves, and that is the whole of the risk.

## What this costs, stated without inflation

- **No player-visible defect today.** `B2b4` is a coordinate move typed with a stray shift, and
  coordinate's answer — the pawn — is what such a player meant. The module is doing the right thing.
  The consequence is bounded exactly as the finisher said: a contested line gets coordinate's answer.
- **The record must stop saying it cannot happen.** `src/move-input.ts:199-203` asserts a falsehood
  in the file a future reader trusts most, and the `G5` note's *"asserts a rule over a situation no
  real input reaches"* is wrong — a real input reaches it.
- **`M12` is killable by a real input.** The engineer's reading of M12's survival was *"the argument
  being correct, not a guard failing to bite"*. That reading does not hold: an order swap changes
  `B2b4`'s outcome from `b4` to `Bb4`, so a plain end-to-end case would red it, with no stub
  resolvers. The `MoveInputDeps` precedence test the repair added is still the right test to have and
  M12 does red 1 — but it is now the *weaker* of the two available tests, not the only one.

**I did not fix any of this** — I do not fix, and this is pre-existing (the counterexample resolves
on the exact-as-typed path and predates `G2`'s variant). Recorded for the Orchestrator to route: a
comment correction plus one real-input precedence case, and a `confidence` that should come down.

**Verdict on the question I was asked: the `confidence: high` on `G5`'s disjointness is NOT earned,
and the record overclaims.**
