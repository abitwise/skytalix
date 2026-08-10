---
id: 20260810T124322Z-software-engineer-observation-ddb83c9f
kind: observation
by: software-engineer
at: 2026-08-10T12:43:22Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ADR-0004
  - src/san.ts
  - src/san.test.ts
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# All 52 expected strings re-derived from their FENs before any code existed — and NOT ONE is disputed. That is corroboration, and it is explicitly not proof.

This is the answer to the one question the subtask called the most important on this ticket. The
verdict is clean, so the interesting part of this note is the second half: exactly how far it goes.

## What I did, in this order

1. Read the 18 FENs and the 52 rows out of the ticket.
2. **Re-derived every string by hand from its FEN** — piece letter, capture rule, disambiguation
   ladder, promotion placement, suffix — against the SAN rules, before `src/san.ts` existed.
3. Wrote the test table from the ticket's strings, watched it go red (no module).
4. Wrote the implementation **from the grammar rules**, in six staged inner-loop steps, never from
   the table. The staged record (a separate note) shows which rule flipped which criterion; that is
   what makes "written from the rules" checkable rather than asserted.

**Result: 52 of 52 agree.** Nothing was edited in the ticket, and no line of code was written to
satisfy a row I doubted — there was no row I doubted.

## The four rows BA/PM named as most attackable, with my reasoning stated so it can be attacked

- **`Qee1` / `Q1e1` / `Qh4e1` on `P-QUEENS`.** Candidates reaching `e1` are `{e4, h1, h4}`. For
  `e4` the file `e` is unique among the three → file suffices → `Qee1`. For `h1` the file `h` is
  shared with `h4`, so the file cannot serve; rank `1` is unique (`e4` and `h4` are both on rank 4)
  → `Q1e1`. For `h4` the file is shared with `h1` AND the rank is shared with `e4`, so neither axis
  alone separates it → full square → `Qh4e1`. This is the textbook three-queen ladder and I reach
  BA/PM's answer by the same route.
- **`Ne4` on `P-PIN`.** Correct **only if** rivals are the LEGAL moves. The `d2` knight reaches `e4`
  geometrically and is pinned to the `d1` king by the `d8` rook, so it has no legal move to be
  ambiguous with. Confirmed against the tree, not just reasoned: `legalMoves` on that position
  returns exactly one mover to `e4`. **A genuine divergence exists in the wild here** — a few
  implementations disambiguate against pseudo-legal reachability — but the dominant convention
  (and what a player writes) is legal moves, and the ticket's `## Scope` says "the other **legal**
  moves" in as many words. Recorded because it is the one row where a reasonable reader could
  disagree with the *rule* rather than with the arithmetic.
- **`exd6` on `P-EP`.** An en-passant capture is written as an ordinary pawn capture: origin file,
  `x`, destination. No `e.p.` — the PGN export format does not carry it. The destination square is
  empty, which is exactly why `move.captured` and not `board[move.to]` decides the `x`.

## How far this is verified, stated plainly

**It is a SECOND HAND-DERIVATION, not an external oracle.** Three limits, none of them small:

1. **I had read the table before deriving.** The derivation was not blind, so anchoring cannot be
   ruled out. A blind derivation was not available to me — the strings are in the ticket I was
   required to read first.
2. **No external instrument was consulted.** No chess library, no PGN corpus, no FIDE/PGN
   specification text; this repository contains none and I added no dependency. The oracle is my
   reading of the notation's rules, which is the same *class* of instrument BA/PM used.
3. **Agreement between my implementation and the table is weaker than it looks.** I wrote both the
   implementation and the derivation, so a rule I have wrong in my head would be wrong in both and
   neither would notice — the identical structural weakness BA/PM recorded about its own reference
   build.

**So the honest status of "the 52 strings match the SAN standard" is unchanged: `UNKNOWN - verify`.**
What this hop adds is that a second independent author, working from the FENs, produced the same 52
strings. That raises the prior; it does not close it. QE's independent mutation hop is still the
check, and it should attack the `Ne4` rule choice above rather than only the arithmetic.

## One thing I could check mechanically, and did

The 52 rows are self-consistent in a way a wrong table need not be: over 184 positions nobody chose
for SAN (the six perft positions and every position one legal move away from them), **every legal
move of a position renders to a distinct string**. A table that under-qualifies would still be
internally consistent and green; that property would not be. It passes. See the test-shape note.
