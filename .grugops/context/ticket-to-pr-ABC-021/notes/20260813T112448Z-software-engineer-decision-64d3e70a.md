---
id: 20260813T112448Z-software-engineer-decision-64d3e70a
kind: decision
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-034
  - ABC-035
  - NFR-002
  - NFR-003
  - src/turn-loop.ts
  - src/frame.ts
supersedes:
---

# The refused claim's message: two items, ≤ 17 columns, and the one derive the loop makes on its own

> **Hand-authored**, per the sibling `decision` notes. Not a `finding`.

## What ships

```
repetition 1 of 3
50-move 0 of 100
```

Two message items, both rules named, current value and required value on each. Emitted only when
`status.claimable` is `undefined` — on that path NEITHER rule is claimable, so a player told about
one of them has to guess about the other.

## Three constraints decided this, and two of them were measured

**1. The frame's width, not taste.** The message region is bounded BY the frame's `W` and never
widens it (`frame.ts:194-200`); an item is placed whole or dropped whole behind a `(+N more)`
marker (`frame.ts:134,146-172`). **Measured on this tree: `W` = 18 at the stub-panel frame and 21
at the real-panel frame from the start position.** The ticket's illustrative wording — *"this
position has occurred twice; a claim needs three"* — is **50 columns** and would be dropped entirely
at both widths. A teaching message nobody can read teaches nothing, so the numbers were kept and the
prose was not. Both items are ≤ 17 columns at every value they can hold here: occurrences ≤ 2 and
the clock ≤ 99, because 3 and 100 are the values that make a claim AVAILABLE and never reach this
path. `A3` asserts both items present AND the absence of a `(+N more)` marker.

**2. `50-move`, not `halfmove clock`.** *"clock"* in a chess product reads as the game clock. The
number is the same one the ticket quotes.

**3. The occurrence count is not free, and where it is paid is declared.** `GameStatus` reports
`claimable` at three occurrences and carries no count below it, so the count exists nowhere in hand.
`claimShortfall` calls `keyHistory(history)` — ONE `O(plies)` replay, ~46-50 µs at 120 plies
(`history.ts:13-15`) — and counts the last key's occurrences.

- It runs **only on a refused claim**, which advances no ply, so **`NFR-002`'s per-ply bar is
  untouched**; `A6` and the untouched `turn-loop.nfr.test.ts` both still spy `repetitionCounts` at 0
  and `gameStatus` at `plies + 1`.
- Against **`NFR-003`** (50 ms keystroke) one replay is ~0.1% of the budget, and it is on a path a
  human typed.
- `keyHistory` and not `repetitionCounts(...).get(zobristKey(...))`: one replay instead of a replay
  plus a hash, and **no import edge from the loop to `zobrist.ts`**.

**This is the ONE derive the loop makes on its own and it is stated in the code**, not left for a
spy to discover. `turn-loop.nfr.test.ts`'s *"the loop derives nothing on its own"* now means "on
every advancing ply", and that file was not edited to make the sentence survive.

## The thresholds are restated, and that is a trade with a named failure mode

`gameend.ts` exports neither `THREEFOLD_OCCURRENCES` nor `FIFTY_MOVE_PLIES`, and this ticket's own
acceptance forbids changing that module. They are restated as two constants in `turn-loop.ts` with
the citation. **They decide nothing** — `status.claimable` admits or refuses the claim — so a
drifted copy produces a wrong SENTENCE and never a wrong verdict. `A3` pins the copy against the
boundary the loop actually takes: at 2 occurrences the message says `repetition 2 of 3` and the
claim is refused; at 3 (`A1`, same fixture, one cycle further) it is allowed.

## Whose wording this is

The loop's, for the stub seam, today. The player-facing wording at the real prompt is
`ABC-034`/`ABC-035`'s — see the `observation` note on the overlap those two tickets carry.
