---
id: 20260818T221500Z-qe-e2e-claim-the-g2-widening-invariant-survives-an-adversarial-122094-line-differential-c41d9a70
kind: claim
by: qe-e2e
at: 2026-08-18T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - src/move-input.ts
  - repair-ABC-033-2026-08-18
  - 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
  - 20260818T215800Z-software-engineer-claim-audit-of-the-five-inherited-notes-four-hold-one-miscounts-its-own-blast-radius-79fd607f
supersedes:
---

# `G2`'s invariant SURVIVES an adversarial corpus — and it survives for a reason stronger than the corpus

**The claim under attack:** *variant 4 "widens what is asked, never what is accepted"*
(`src/move-input.ts:127`). Two hops have now measured it on corpora built out of **legal moves**
(1942 lines, then 3073 lines). I built the opposite kind: a corpus dominated by strings that are
**not** legal moves, aimed squarely at the collision hazard of a blind whole-line transform.

## The corpus — adversarial by construction, not confirmatory

**10 positions × 122,094 outcome lines**, each line resolved twice: against the delivered module at
`8c84265` and against the repair tip, and compared on **kind AND payload** (the resolved SAN, the
ambiguity message list, the rejection reason code) rather than on kind alone.

Positions: the promotion-capture fixture, a quiet promotion, **eight pawns on the seventh** (32
promotions), two pawns with two capture targets each, **two pawns capturing the same square**, the
`bxc4`/`Bxc4` case-is-meaning fixture, a castling position, the start position, a **black**
promotion position, and the six-queen ambiguity fixture.

Lines per position: every legal move's SAN / coordinate / dashed-coordinate form in **every case
permutation** (2^n, not six fixed spellings), each also with a spurious `+` and `#`; plus the
**entire promotion-shaped grammar space** `[a-h]?x?[a-h][1-8]=[qrbnkQRBNK]` in every case
permutation — overwhelmingly strings that name **no legal move**; plus castling spellings including
`o-0`, `0-o`, `oo`; plus Unicode case-map hazards (`ß`, `ﬁ`, `ſ`, dotless `ı`, dotted `İ`, the
Kelvin sign, a zero-width space).

## Result

| | count |
|---|---|
| outcome lines | 122,094 |
| `rejected` → `move` | **684** |
| `move` → anything else | **0** |
| `ambiguous` → anything else | **0** |
| new `ambiguous` outcomes | **0** |
| positions mutated (`toFen` before/after) | **0** |
| `history.moves` mutated | **0** |
| resolved moves not an element of the module's own derive (`A1`) | **0** |
| **changed lines whose resolved SAN is not what was typed, case-insensitively** | **0** |
| **changed lines whose last character is not case-bearing** | **0** |

That last two rows are the ones the earlier corpora could not produce, and they are the answer to
*"a previously-rejected string that now resolves to a move the player did not mean"*: **there is
none.** Every one of the 684 newly-readable lines resolves to the move whose canonical SAN equals
the typed line letter-for-letter under case folding. None resolves to a non-promotion move.

## Why it survives — the structural argument, which is stronger than any corpus

Variant 4 is `lower(prefix) + upper(last)`. It differs from variant 1 (`toLowerCase`) **only when
the last character is case-bearing**, i.e. a letter. So the entire new surface is letter-final lines.
Then:

- **`parseCoordinateMove` contributes nothing new.** It does `text.trim().toLowerCase()`
  (`src/coordinate-move.ts:84`) before matching, and `variant4(L).toLowerCase() === L.toLowerCase()
  === variant1(L)`. Variant 4 and variant 1 are **indistinguishable to the coordinate reader on
  every string**.
- **`parseSan`'s two move regexes are digit-final.** `PIECE_MOVE` ends `[a-h][1-8]`
  (`src/san.ts:199`) — no letter-final string can ever match it. `PAWN_MOVE` (`:202`) is letter-final
  **only through its `=([NBRQK])` group**. So the only SAN a letter-final string can newly reach is
  **a pawn promotion**, plus the castling literals.
- **Castling cannot collide.** `O-O`/`O-O-O` is reached by variant 3 (`toUpperCase`); variant 4 of
  `o-o` is `o-O`, which matches nothing. No string is both promotion-shaped and castle-shaped.
- **Variants 1–3 cannot accept any letter-final SAN except castling** — they all lowercase the last
  character, and the promotion letter class is uppercase-only. Therefore on exactly the lines where
  variant 4 adds a move, the other three variants add **none**, so the fold's `Set` union goes
  **0 → 1**, never **1 → 2**. That is why no `move` can become `ambiguous`.
- **A promotion SAN is never itself ambiguous**: the non-capture form fixes destination and the
  capture form additionally carries the origin file, so at most one pawn answers.

The 122,094-line differential is the empirical half; the paragraph above is why the result is not
luck. The measured *"0 changed lines whose last character is not case-bearing"* is the first premise
of that argument, tested rather than assumed.

## The Unicode collision, closed exhaustively rather than sampled

A blind `toUpperCase()` on the last character is only dangerous if some non-ASCII character
uppercases **into** a piece letter. Swept **every codepoint from U+0080 to U+2FFFF**:

- codepoints whose `toUpperCase()` is one of `N B R Q K`: **0**
- codepoints whose `toLowerCase()` is one of `a-h 1-8 x = - o`: **0**

So no non-ASCII preimage of the promotion grammar exists, and the length-changing case maps
(`ß`→`SS`, `ﬁ`→`FI`, `İ`→`i̇`) all land on strings both readers reject. The collision hazard that
motivated this hop is **closed**, not merely unobserved.

## What I did NOT close

This says nothing about `ABC-032`'s grammar or `ABC-031`'s, which I treated as fixed. And it is a
statement about **variant 4**; the second changed class this differential exposed is in the
`observation` note alongside this one, and it is not covered by the sentence quoted at the top.
