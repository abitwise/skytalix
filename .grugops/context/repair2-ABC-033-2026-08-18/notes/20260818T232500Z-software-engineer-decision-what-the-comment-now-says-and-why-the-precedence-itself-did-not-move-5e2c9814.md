---
id: 20260818T232500Z-software-engineer-decision-what-the-comment-now-says-and-why-the-precedence-itself-did-not-move-5e2c9814
kind: decision
by: software-engineer
at: 2026-08-18T23:25:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - repair2-ABC-033-2026-08-18
  - quality-gate-ABC-033-delta-2026-08-18
supersedes:
---

# The corrected comment, the real-input guard, and the three things I deliberately did not do

Repair round 2 of 2, `quality.self_fix_attempts` exhausted. **Zero behaviour change**: no new
accepted input, no changed precedence, no new rejection code, no changed message.

## 1. `attemptsOn`'s doc comment now states the truth

Out — the false sentence, in full:

> The distinction is invisible in production, because the two grammars are disjoint on every string
> either accepts (a coordinate is four-plus characters of `[a-h][1-8]`; a SAN that short is not
> one), so **no line can make both claim a move and no line can tell the two orderings apart by its
> outcome**. QE's M12 swapped them and reded nothing, exactly for that reason.

In — four things, in this order: (a) the precedence is **real**, the grammars are **not** disjoint,
and `B2b4` on `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` is read as the pawn `b4` by one reader and the
bishop `Bb4` by the other; (b) the cause, which is that `parseCoordinateMove` lowercases and `b` is
the one piece letter that is also a file letter, and that this is pre-existing and on the
exact-as-typed path; (c) **why coordinate-first is the right way round** — a player typing `B2b4` is
a coordinate typist whose shift slipped on `b2b4`, and the pawn is the move they meant, with an
explicit *do not swap these two lines*; (d) that an earlier version of the comment asserted the
opposite, that it was false in both halves, and who falsified it.

**Two more instances of the same falsehood were corrected, both inside `A7`'s fence.** The
step-1 inline comment in `resolveMoveInput` said four characters of `[a-h][1-8]` *"cannot match a
SAN string by accident"* — same claim, same defect — and the doc comment above the stub precedence
test in `src/move-input.test.ts` repeated it as the reason M12 could not be killed by a real line.
Fixing the sentence at `:199` and leaving its two copies in place would have been half a repair.

## 2. The precedence itself did NOT move, and that was the decision, not an omission

Coordinate-first stays. Not swapped, not made lazy, not made configurable, not routed to
`ambiguous`. `B2b4` already resolves the way the player meant, so every alternative here is a
behaviour change that makes some player's input worse in exchange for a tidier sentence. **The
comment was wrong; the code was right.** That is the whole shape of this hop.

## 3. The guard now bites on a string a player can type

`src/move-input.test.ts` gains one case — `B2b4` on a new fixture, **no stubs, no seam, production
resolvers throughout**. It asserts the overlap explicitly (both readers claim, and they claim
different moves) before asserting which one the module returns, so that if a future grammar change
closes the overlap the case fails loudly rather than quietly asserting a precedence that no longer
decides anything. The stub-based precedence case is kept: it pins the merge rule independently of
any grammar overlap existing, and it is now the weaker of two rather than the only one.

`toEqual` and not `toBe` on the module's returned move, and the reason is in the test: called with
no `deps`, `resolveMoveInput` derives its **own** legal array, so the move is structurally equal and
never reference-equal to the fixture's. `A1`'s reference-identity guarantee is about one array
within one prompt and is unaffected.

One additional fixture FEN was registered in the file's `toFen` round-trip block, per its own
convention that no fixture is believed before it round-trips.

## What I refused

- **Did not touch `src/san.ts` or `src/coordinate-move.ts`.** `A7` binds and the `b`-collision is
  pre-existing and predates `G2`. Routing recommendation is in the `G5` correction note.
- **Did not pin the `E8=Q+` suffix residue by test** — QE agreed with leaving it to `ABC-032`'s
  grammar owner. If it is mentioned anywhere it should be **sized from the rule** ("once a check
  marker follows the piece letter, the case-significant character is no longer last"), which is
  exact and complete, and **never from the 14-string list**, which understates it: every `#`
  spelling and the bishop/knight and `exf8` underpromotion families are missing from that list.
- **Did not pin a reason code** for the `unreadable` → `no-such-move` flip; recorded instead.
- **Did not add the nine benign both-claim rows** QE swept. One row is sufficient, and the nine
  where both readers name the *same* move cannot distinguish the two orderings — they would look
  like guard strength and provide none.
- **No merge, no deploy, no board column moved.**
