---
id: 20260806T101500Z-software-engineer-decision-d30aa229
kind: decision
by: software-engineer
at: 2026-08-06T10:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-015
  - ABC-018
  - EPIC-002
  - src/render.ts
supersedes: 
---

# The frame layout — the one decision this ticket had left to make

`EPIC-002` acceptance `4a` hands it over in its own words: *"the invariant is the criterion; the
exact split is the engineer's."* Read at the epic, not from a summary. This is that split.

## What was decided

**The frame is 9 rows of 18 characters, always** — 8 board rows plus one file-label row, which is
exactly `4a`'s reference split for the board (`8 board rows + 1 file-label row`). The label row sits
BELOW the board, which is both the conventional place and the order `4a` lists the reference layout
in.

**Every square is TWO characters: its shading character, then its piece glyph — or the shading
character again when the square is empty.**

```
8 .r:n.b:q.k:b.n:r
7 :p.p:p.p:p.p:p.p
6 ..::..::..::..::
5 ::..::..::..::..
4 ..::..::..::..::
3 ::..::..::..::..
2 .P:P.P:P.P:P.P:P
1 :R.N:B.Q:K.B:N.R
   a b c d e f g h
```

`:` is dark, `.` is light, and both are ASCII **in both glyph modes**.

## Why two characters per square, and not one

This is the load-bearing part and it is not cosmetic.

1. **A one-character cell makes acceptance criterion 6 vacuous exactly where the pieces are.** The
   criterion is *"given any two adjacent squares on the same rank, their shading characters
   differ"* — a universal claim over all adjacent pairs. If the piece glyph REPLACES the shading on
   an occupied square, then on a full back rank there are no shading characters to compare and the
   criterion cannot be asserted at all. Carrying the shade on every square, occupied or not, is what
   makes it assertable everywhere.
2. **The two-character pitch is what makes the file-label row line up AND measure the same width as
   a board row.** With the glyph at cell offset 1, the labels sit under the piece column separated
   by exactly one space, so the row reads `a b c d e f g h` (criterion 1's literal string) and still
   measures 18 characters — with the glyph first, the label row would need a trailing space to reach
   18, and trailing whitespace in a frame is fragile in exactly the snapshot diffs this ticket asks
   for.

## Why the shading characters are ASCII in BOTH modes

Criterion 7 is a symmetry criterion: *"the shading is not replaced by a space on empty squares in
one mode and not the other."* One shading pair shared by both modes satisfies it by construction
rather than by vigilance. Keeping both characters ASCII is also what makes epic acceptance `2a`
(zero code points above `U+007F` in an ASCII frame) hold structurally: in ASCII mode the only
characters that could exceed `U+007F` are piece glyphs, and the ASCII table has none.

Neither character is a space. A space-shaded square is indistinguishable from padding, and would put
trailing whitespace at the end of any row whose h-file square is light.

## The two exported types

- `type GlyphMode = "unicode" | "ascii"` — **a parameter this module does not choose.** `ABC-015`
  owns the five-row selection table (`[A1]` / acceptance `2b`) and `EPIC-006` owns the
  `--ascii` / `--unicode` flags. This ticket declares the type and consumes the value.
- `type Orientation = "white-bottom" | "black-bottom"` — named for the side at the BOTTOM rather
  than typed as a colour, because `orientation: "white"` cannot say by itself whether White is at
  the bottom or the top. `EPIC-006` owns the human's colour and hands the answer in.

Both are positional parameters, not an options object, matching every other module in `src/`
(`gameStatus(position, counts)`, `makeMove(position, move)`) — AGENTS.md rule 11. The two unions are
disjoint, so a swapped call is a compile error rather than a silent wrong frame.

## What was NOT decided here, and is not this module's to decide

- **The glyph mode's VALUE** — `ABC-015`.
- **Where the frame is written, the cursor control, and the erase-to-end-of-screen** — `ABC-018`
  (`4b` / `4c`). Nothing in `src/render.ts` reads `isTTY`, `process.env` or a terminal size.
- **The rest of the frame's row budget** — the status panel (`ABC-016`), the history pane
  (`ABC-017`) and the message region (`ABC-018`) each own their own rows. This module's 9 are
  constant, which is what `4a` needs from it and all it needs from it.
- **ANSI colour** — cut from the MVP by `[A4]`, deferred not deleted.
