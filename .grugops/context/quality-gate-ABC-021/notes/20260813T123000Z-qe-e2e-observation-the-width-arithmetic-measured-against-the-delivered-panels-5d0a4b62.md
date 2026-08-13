---
id: 20260813T123000Z-qe-e2e-observation-the-width-arithmetic-measured-against-the-delivered-panels-5d0a4b62
kind: observation
by: qe-e2e
at: 2026-08-13T12:30:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-016
  - ABC-017
  - ABC-018
  - EPIC-002
  - src/frame.ts
  - src/turn-loop.ts
  - src/turn-loop.test.ts
supersedes:
---

# The width arithmetic, measured against the DELIVERED panels — the decision holds and one figure in it does not

> **Hand-authored.** Not a `finding`. Measured against merged `src/frame.ts`, merged
> `src/status-panel.ts`, merged `src/history-pane.ts` and merged `src/render.ts` — never against the
> ticket's prose, which is what my brief asked for.

## The measurement

```
MESSAGE_ROWS = 2   PROMPT_ROWS = 1

board width, the floor under W (renderBoard, white-bottom):
  start / shuffle / K+R-v-k   x   unicode / ascii   ->   18 in ALL SIX
                                                          rows = 9 in all six

W and the message region, DELIVERED items:
  fixture                board-only        real panels
  start                  W=18  both shown  W=21  both shown
  shuffle + 4 plies      W=18  both shown  W=23  both shown
  clock 99               W=18  both shown  W=21  both shown

W and the message region, the TICKET's example prose:
  start                  W=18  ["", "(+2 more)"]   W=21  ["", "(+2 more)"]
```

Identical in `unicode` and in `ascii`.

## The delivered items, at every value they can reach on the refusal path

```
17  "repetition 1 of 3"
17  "repetition 2 of 3"     <- the widest repetition value
17  "50-move 99 of 100"     <- the widest clock value
16  "50-move 0 of 100"
```

**The Engineer's bound is exact: `≤ 17`, and the argument for it is sound.** On the refusal path
`status.claimable` is `undefined` **and** `status.result` is `in-progress`, and `gameStatus` returns
early on both `>= 5` occurrences and `>= 150` plies — so occurrences ≤ 2 and the clock ≤ 99 are not
a convention, they are what the two arms of `GameStatus` leave reachable. I drove it rather than
reasoned it: 40 plies of shuffle, **8** claimable states seen, **0** with an empty `draws`.

**So the margin is 18 − 17 = ONE column, and it is structural rather than lucky:** `W` is the max
over the panel rows (`frame.ts:198-201`), the board is always one of those rows, and the board is
always 18. Any panel a later ticket adds can only widen `W`, never narrow it.

## `A3` proves this at 16 columns. It did not prove it at 17, and now `A9` does

`A3` asserts both items present and no `(+N more)` marker — at `repetition 1 of 3` (17) and
`50-move 0 of 100` (16), on shape `A`, whose own `W` is 18. So the 17-at-18 boundary WAS already
exercised on the repetition item and **never on the clock item**, whose 17-column value
(`50-move 99 of 100`) no fixture reached. I added **`A9`** for it, in the existing file at zero new
test files: it asserts `widthOf(frame) === 18`, the region equal to both items in full, every message
row `<= W`, and no marker.

## The decision to drop the ticket's prose is CORRECT, and the figure supporting it is wrong

The ticket's illustrative wording is **53** and **43** columns:

```
53  "this position has occurred twice; a claim needs three"
43  "the halfmove clock is 41; a claim needs 100"
```

The Engineer's decision note says *"is 50 columns"*. **It is 53**, and the note prices only the first
item and never states the second. Both are over-wide at every `W` this product can produce, so the
conclusion — *a teaching message nobody can read teaches nothing* — is right and the figure that
carried it was loose.

**And I killed the alternative rather than asserting it. M15** ships the ticket's own prose verbatim
through `claimShortfall`: the region collapses to `["", "(+2 more)"]` and `A3` goes red with
`expected ' (+2 more)' to contain 'repetition 1 of 3'`. **The build the ticket's page literally asks
for fails the ticket's own criterion 3.** That is the measured form of the Engineer's argument, and
it is what `ABC-035` needs before it writes the same two sentences into a parser: `ABC-035`
`## Out of scope` quotes them, and at `MESSAGE_ROWS = 2` and `W ≤ 23` they cannot be shown.

## `ABC-018`'s sanitizer is on this path and was not re-litigated

The refusal message is composed entirely from integers the loop derives and two literal rule names —
**no user-supplied text reaches it at all**, so `ABC-021`'s security note (*"at most the literal
command token"*) over-states its own exposure in the safe direction. The stub seam matches a literal
`claim` and echoes nothing. Every item still passes through `assembleFrame`'s `sanitize`
(`frame.ts:123-132`) because that is the only door into the region; nothing here introduces a second
path to the sink.
