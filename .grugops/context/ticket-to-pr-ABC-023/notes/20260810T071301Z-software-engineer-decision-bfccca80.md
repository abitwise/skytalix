---
id: 20260810T071301Z-software-engineer-decision-bfccca80
kind: decision
by: software-engineer
at: 2026-08-10T07:13:01Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-009
  - A1
  - A2
  - A3
  - A5
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
  - 20260810T071300Z-software-engineer-observation-0d0c45a9
supersedes: 
---

# Five implementation decisions that constrain the next hop, and the one abstraction I did NOT build

## 1. The nine `A3` rows are SPREAD INTO `ABC-009`'s four tables, not parked in parallel ones

`## Out of scope` says it in the ticket's own words — *"its `A11`/`A13` tables are extended by `A3`;
their existing rows, counts and verdicts are not edited"* — and `A3` asserts a property **of those
tables** (*"given each of the four impostor tables … every type appears in configurations that vary
both axes"*). A parallel table would have forced the quantifier to read a union, which is the weaker,
self-serving reading: a future row added to the real table only would still pass it.

So each gap's rows live in a named `A3_ADDED_*` const declared immediately above the table it
extends, and the table literal gains one line: `...A3_ADDED_ON_KING_SQUARE,`. That shape buys three
things at once. The rows are genuinely in the table, so `ABC-009`'s own quantifier test and its
`A13` accounting joins run over them unchanged. The diff stays **additions only** — a spread line
inserted before `];` removes nothing. And because the added rows are separately named, I can assert
things about **my** rows without asserting anything new about `ABC-009`'s.

**The constraint this puts on the next hop:** the added rows are executed by `ABC-009`'s existing
`it.each` blocks, so their test titles read `ABC-009 A11 …` / `ABC-009 A13 …` even though they are
`ABC-023` rows. That is deliberate and it is the price of the tables being the quantifier. Read the
`A3_ADDED_*` consts to see which nine rows are this ticket's; do not read the describe title.

## 2. Non-inertness is asserted on MY rows only, never retro-fitted onto `ABC-009`'s

`expectIdentityGuardIsTheOnlyRefuser` already exists and the `ENEMY_ON_*` rows already call it; the
`IMPOSTOR_ON_*` `it.each` blocks do not. I could have asserted it table-wide — all thirty existing
rows do in fact pass it, I checked — but asserting a **new property over `ABC-009`'s rows** is
reopening `ABC-009` by the back door, and `## Out of scope` fences that. So the nine added rows get
their non-inertness assertion inside the new `A3` quantifier test, over the `A3_ADDED_*` consts
only, and the `A1` rows get it inline. `ABC-009`'s rows are executed exactly as they were.

## 3. `expectImpostorSetup` could not be reused for `A1`, and the reason is the criterion itself

That helper asserts **the other precondition HOLDS** — that is what makes an `ABC-009` row an
experiment with exactly one variable. An `A1` row breaks **both** home squares at once on purpose,
so the helper is not merely inconvenient there, it asserts the opposite of the row's premise. New
helper `expectPairSetup`, which asserts the occupant byte — type **and** colour — on **both**
squares plus exactly the one right, and asserts nothing about "the other precondition" because there
isn't one. `## Test notes` 1 asks for exactly this ("on `A1`'s rows that assertion is owed on both
squares").

## 4. `A2`'s helper is the deliberate INVERSION of the identity-guard one, and it re-derives the label

`expectLandingSquareIsTheOnlyRefuser` asserts that every **other** guard passes (the right is held,
both home squares hold the mover's own king and rook, the `empty` set really is empty), that the
**landing** square IS attacked, and that the origin and crossed squares are NOT. That is `A2`'s
"the through-check test must be the mechanism, on the landing square specifically" turned into
assertions rather than a comment.

One deliberate extra: the row carries its landing square by name (`"g1"`, `"c8"`) and the helper
**re-derives** it from the option's `kingPath` and compares. A row mislabelled `g1` for a queenside
option would otherwise assert the wrong square's attack and still pass — `expectImpostorSetup`'s
lying-label lesson, applied to this axis. `isSquareAttackedBy`'s polarity is checked before any of
its verdicts is read, per `## Test notes` 3.

## 5. The two quantifier tests assert the COUNTS the ticket rests on, instead of citing them

The `A3` test recomputes, from the live tables, that there are **13 type/table pairs** and that
**9 of them varied one axis only** before these rows landed — then asserts every one of the 13 now
varies both. The `A1` test asserts that each family's two rows differ in **both** axes and that the
four together cover both colours and both sides. `## Reproduction` 3's numbers therefore go red if a
future edit invalidates them, rather than sitting in prose that quietly rots — which is precisely
how this ticket's own sixteen verdicts went stale when `ABC-022` merged.

## The abstraction I did NOT build, and why

I did not enumerate the 169-combination joint pair space, and I did not add a fifth or a sixth `A1`
row to chase a pair mutant conditional on **both** axes at once. `A1` is bounded to four rows and a
class, `## Size and priority rationale` names the enumeration as the one thing that would make this
ticket `L`, and the brief names it as the trap. A two-axis-conditional pair mutant survives my four
rows; that is the criterion's stated bound and it is recorded as a limitation in the `observation`
note rather than quietly closed by growing a ticket the board sized at 17 rows.

Delivered: **17 rows, 19 tests** — the exact estimate, not one row more.
