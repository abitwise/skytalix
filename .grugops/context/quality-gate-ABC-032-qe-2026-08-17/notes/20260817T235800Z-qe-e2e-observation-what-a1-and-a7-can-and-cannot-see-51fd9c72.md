---
id: 20260817T235800Z-qe-e2e-observation-what-a1-and-a7-can-and-cannot-see-51fd9c72
kind: observation
by: qe-e2e
at: 2026-08-17T23:58:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A1
  - A7
  - ADR-0004
  - EPIC-003
supersedes:
---

# `A1` and `A7` — both load-bearing, both narrower than their words. Said plainly, not reported as covered.

## `A1` is the module checking itself, and that costs it two things

**It IS load-bearing.** It is the only assertion in the ticket that can see an `ADR-0004` (2b)
provenance violation, and it does: returning a copy of the matched move instead of the element turns
14 tests red, `A1`'s own six rows among them. Over 178 moves in six positions it also proves the
parse direction accepts every string the render direction emits, which is the epic's headline
promise made falsifiable.

**Blind spot 1 — a wrong-but-CONSISTENT grammar. `A1` cannot detect it, and I am saying so rather
than counting it as covered.** Change the one table (`"N"` → `"S"`) or swap the castle strings inside
`body`, and every SAN string the product prints becomes wrong — yet the round trip still closes,
because the parse direction reads the string through the same table that produced it. Both mutants
are **GREEN under `A1` alone**. What catches them is the merged forward-direction corpus outside this
ticket (37 red across 8 files, and 7 red across 4). **So the shared-bug blind spot is real and it is
covered by something `A1` does not own.** Two consequences a later reader should not have to
re-derive: `A6`'s fence around those files is load-bearing for `A1`'s value, not just for `N1`; and
if `EPIC-003` ever moves the grammar, the forward corpus must move FIRST — `A1` will follow it
silently in either direction.

**Blind spot 2 — over-acceptance, and this one nothing else covered.** `A1` asks only that what
`toSan` writes reads back. It says nothing about strings `toSan` would NEVER write. Three mutants
that make the parser strictly more permissive — capture marker ignored, pawn origin/capture
agreement ignored, `trim` removed — were **green through the entire delivered suite**, `A1`
included. This is where `G2`–`G4` came from, and it is the structural reason a round-trip property
must be paired with negative rows. `A1` is a surjectivity check, not a grammar check.

## `A7` catches the naive second table and misses the idiomatic one

The criterion's words are "each appears exactly once in the module". The delivered assertion
implements that as a count of double-quoted string literals, and it genuinely bites: a private
promotion map and a `switch`-based decoder both turn it red.

**But a second table can be introduced with no assertion firing, and I built two.** `PIECE_MOVE`
written as the literal `/^([NBRQK])([a-h]?)([1-8]?)(x?)([a-h][1-8])$/`, and the castle branch written
as `/^O-O(-O)?$/` with a kingside/queenside length test — each is a complete second spelling of the
grammar, each survived the whole suite, and a regex literal is the FIRST shape an engineer working in
this module would reach for, because the module already holds one (`CHECK_SUFFIX`). So `A7` was
satisfiable while its intent was defeated, exactly as suspected.

Two rows now close it: no hand-spelled piece-letter character class anywhere in the comment-stripped
code, and the castle strings spelt on exactly one line of code (and that line must mention
`KINGSIDE_FILE`, i.e. it is `body`'s). Comments are stripped first, because a second table hides in
code and this module's prose legitimately discusses `O-O` at length.

**What remains open, honestly.** A text scan cannot beat deliberate obfuscation — the
template-concatenation mutant still passes and I did not write a row chasing it. `ADR-0004` clause 2
rests on review for that case, and the engineer's chosen shape (the parse side deriving from the
forward side and owning no table) is a stronger guarantee than any assertion here, because there is
no table to duplicate rather than a duplicate that is detected.
