---
id: 20260817T221500Z-software-engineer-decision-one-table-parse-side-owns-none-7c41ab90
kind: decision
by: software-engineer
at: 2026-08-17T22:15:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A7
  - A6
  - ADR-0004
  - src/san.ts
supersedes:
---

# `A7` is satisfied by giving the parse direction NO table at all, not by sharing one

## The decision

`parseSan` decodes nothing. It never maps a piece letter back to a piece type, never maps a castle
string back to a king move, and never builds a `Move`. For each legal move it compares the input
against the description the EXISTING forward direction already produces:

- piece letter — `PIECE_LETTERS[pieceType(move.piece)]`, the one declaration at `src/san.ts:46`;
- promotion letter — `PIECE_LETTERS[move.promotion]`, the same lookup `body` uses at `src/san.ts:128`;
- castle string — the candidate's own `toSan(position, move, legal)` output with the suffix stripped.

The piece-letter character class the two input regexes are built from is `Object.values(PIECE_LETTERS).join("")`,
evaluated at load. It is derived from the one table, not a second spelling of it.

## Why this shape and not a shared constant

The obvious alternative was to hoist `"O-O"` / `"O-O-O"` out of `body` into a module constant that
both directions read. That is a legitimate reading of `A7` ("both directions use them") and it was
rejected for one reason: it changes an existing line inside `body`, and `A6` is scored at line level
with `git diff -U0`. `body` is the function `toSan` delegates to and is plausibly what "`toSan`'s
body" names. Rather than argue the ambiguity, the implementation removed it: **`src/san.ts` is a
pure append** — `git diff -U0` reports one hunk, `@@ -148,0 +149,132 @@`, with zero deleted or
modified lines. Both readings of `A6` pass, and `A7` passes on a strictly stronger footing than a
shared constant would give: the reverse direction consumes the forward direction's own output.

## The price, recorded rather than hidden

Because the castle strings are obtained from a castle candidate, a position with NO legal castling
has nothing to ask. A castle-shaped input there (`O-O` with castling unavailable) is classified
`unreadable` rather than `no-such-move`. Measured, not assumed — `parseSan` on `O-O` in
`4k3/8/8/8/8/8/8/K6R w - - 0 1` returns `{ outcome: "rejected", reason: "unreadable" }`.

It is inside `A5` (the call returns `rejected` and throws nothing) and the two codes do not collapse
— both remain independently reachable and are asserted so. No acceptance criterion turns on which of
the two codes a legal-castling-absent castle string gets. It is named here because `ABC-034`, which
widens the reason vocabulary and writes the player-facing wording, is the hop that will care.

## Case, and what was deliberately not built

The reader is case-exact. `bxc4` and `Bxc4` are two different moves and can both be legal;
`ABC-033` owns the case-folded retry and the multi-match it can produce (`ABC-032` § Out of scope).
No test in this diff asserts that the two are the same move.
