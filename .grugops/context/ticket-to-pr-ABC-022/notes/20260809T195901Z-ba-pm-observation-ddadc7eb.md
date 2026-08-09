---
id: 20260809T195901Z-ba-pm-observation-ddadc7eb
kind: observation
by: ba-pm
at: 2026-08-09T19:59:01Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-009
  - src/moves.ts
  - src/legal.ts
  - src/perft.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `A5`'s justification is FALSE, proved by exhaustion — and `A5` is nevertheless the only guard against a mutant nothing else on this board catches

The Orchestrator's proposed reason for defect 2 was to be **tested, not accepted**. It was tested. It
**holds**, and the exhaustion is stronger than the argument it replaces. But the repair it implied —
"restate `A5` as a claimless regression guard" — is **not** the right repair, and the reason is
measured.

## The equivalence is exhaustive, not sampled

Control reaches the en-passant branch only when the target is **empty or the mover's own colour**:
`src/moves.ts:177` is `if (target !== EMPTY && isBlack(target) !== black)` and both of its arms
`continue` at line 180, so every enemy occupant is consumed before line 187. At that program point
`target === EMPTY` and `!(target !== EMPTY && isBlack(target) === black)` are the same predicate.

Two correct fixes differing **only** in that clause were built as full separate trees, typechecked
clean under `tsc --noEmit`, and run **one OS process per tree state**:

| instrument | emptiness-shaped | colour-shaped | verdict |
| --- | --- | --- | --- |
| exhaustive byte domain: 256 target bytes x both colours = 512 states | `48e94fc6…` | `48e94fc6…` | **identical** |
| all 20 FEN-producible occupants, each FEN printed and re-parsed | `4a26d22b…` | `4a26d22b…` | **identical** |
| every node's full move set over all 518,474 reachable nodes, 6 per-root digests | `bf613aa7…` etc. | same 6 | **identical** |

The branch's guard reads exactly two inputs — the byte on `to` and `black` — so 256 x 2 **exhausts
its domain**; this is a proof, not a sample. Both fixes emit an ep move in exactly **2** of the 512
states (byte 0 = `EMPTY`, both colours) against pristine's **194**. **No position discriminates the
two shapes, so no criterion can.** `A5`'s old parenthetical claimed exactly that discrimination and
is therefore false as written.

Instrument limit, recorded rather than hidden: 63 of the 512 states carry a byte that is not a valid
piece code and make `generateMoves` **throw**. The throw is captured as the observable so the sweep
stays exhaustive and both trees are still compared on it — it is an instrument limit of direct board
writes, not a verdict. Bytes above `0x0F` are not FEN-producible, which is why part 2 prints the
constructed board rather than a FEN.

## But `A5` is NOT inert, and this is new

The dangerous shape is not the colour-shaped **clause**; it is the colour-shaped **restructure** —
rejecting own-colour occupants with a top `continue` guard and, in the same rewrite, dropping the
ordinary-capture branch's own `continue`, so every enemy occupant falls through into the en-passant
branch. Measured on that mutant (`md5 603fccf48f6373360f89d73b8ebbbcc2`, typecheck clean):

- `A1` GREEN, `A2` GREEN, `A3` GREEN, `A4` GREEN (both as written and as `## Scope` demands), `A6` GREEN
- full existing suite **381/381 on 16 files**
- deep perft lane **32/32** under `PERFT_DEEP=1`
- **`A5` RED on both of its rows** — `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` offers `d4e3`,
  `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` offers `e5d6`
- 512-state domain digest `439f9802…`, **257** emitting states against a correct fix's 2

Perft is blind by construction: an occupied en-passant target is unreachable in legal play (0 of
518,474), so no depth and no added position can reach it. **`A5` is the only thing on this board that
fails this mutant.** That is the claim `A5` may honestly make, and it is what replaced the false one.

`A5` was also widened from one piece type to two on both colours — verified on four FENs, all 0 today
on pristine and on a correct fix, all four RED on the restructure mutant. `## Scope` bullet 1 says
"whatever occupies it and whatever colour it is", and the own-colour half (`A1`) already carried that
axis while the enemy half did not.

## The reachability walk, re-derived rather than inherited

Roots and `fast` depths **parsed out of `src/perft.test.ts` by the harness**, not retyped; every root
prints its FEN and re-parses it. On today's `main`:

```
startpos     4  206604      kiwipete    3   99950
position-3   4   46256      position-4  3    9738
position-5   3   63910      position-6  3   92016
TOTAL 518474 · epSquare set 81397 (15.70%) · ep target occupied 0 · own-colour 0 · ep offered onto occupied 0
```

Identical to the ticket's table on all five figures and all six per-root counts. This is the
**seventh** independent reproduction on this project; the ticket said "sixth" and that is corrected in
place. `A7`'s six numbers are also exactly derivable from `src/perft.test.ts`'s own published leaf
counts (e.g. startpos `1+20+400+8902+197281 = 206604`), so they were cross-checked two ways.

`A8`'s **32/32** was confirmed by construction as well as by running: 20 fast acceptance cases + 8
deep + 3 `perftDivide` + 1 base case = 32 in the deep lane, 24 in the fast lane.
