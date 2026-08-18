---
id: 20260818T201500Z-software-engineer-decision-g2-a-fourth-blind-variant-and-what-it-deliberately-does-not-reach-4a1c88e2
kind: decision
by: software-engineer
at: 2026-08-18T20:15:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-032
  - EPIC-003
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# `G2` repaired: a fourth whole-line variant. A caps-lock player typing `E8=Q` is now understood

The variant added, and it is the whole of the production change for `G2`:

```ts
(line) => line.slice(0, -1).toLowerCase() + line.slice(-1).toUpperCase(),
```

It is the **mirror of variant 2**. Variants 1-3 all encode one assumption — that the case-significant
character of a line sits at index 0 — which is true of every piece-move SAN (`NF3` is understood
through variant 2) and false of promotion SAN, where the piece letter is last. QE's diagnosis was
exact and I have nothing to add to it.

**It needs no grammar knowledge and I did not add any.** It knows nothing of `=`, nothing of
promotion, and nothing of which letters name a piece — it is a blind whole-line transform handed
back to the same two readers, exactly like the other three. My original reasoning (*a targeted fix
would need to know that `=` introduces a promotion letter, which the fences forbid*) was correct
about a **targeted** fix and I used it to close a question it does not close. QE was right to say so.

## Measured, not argued: what changed and what did not

A differential corpus over **12 positions** — every legal move's SAN, coordinate and dashed
coordinate form, each in six case spellings (as-is, lower, upper, capitalised, swapped, last-upper),
plus nine junk lines — **1942 outcome lines**, run against the delivered module at `8c84265` and
against the repaired one, and compared:

| | count |
|---|---|
| outcome lines total | 1942 |
| lines whose outcome changed | **52** |
| of those, `rejected` → `move` | **52** |
| of those, `move` → anything else | **0** |
| new `ambiguous` outcomes | **0** |
| changed lines that are promotion spellings | **52 of 52** |

So the variant **widens what is asked and never what is accepted**: it made 52 previously-unreadable
promotion spellings readable and moved nothing else at all. That is the property that matters — a
case variant that could turn one legal move into two would be manufacturing ambiguity, and this one
provably does not, in this corpus.

For most lines it costs nothing: a line ending in a digit is unchanged by uppercasing its last
character, so variant 4 reproduces variant 1's text and the module's existing `text === line` /
`Set<Move>` union absorbs it without a resolver call doing anything new.

## What it does NOT reach, stated plainly rather than left to be discovered

**`E8=Q+` and `e8=q+` are still refused `unreadable`.** Once a check marker follows the piece
letter, the case-significant character is no longer last, and the residue is exactly:

```
e8=q+  E8=q+  E8=Q+  e8=r+  E8=r+  E8=R+
exd8=q+  Exd8=q+  EXD8=q+  EXD8=Q+  exd8=r+  Exd8=r+  EXD8=r+  EXD8=R+
```

(measured, same corpus — the suffixed forms of the queen and rook promotions, which are the ones that
give check in that fixture.)

**Closing that would take grammar knowledge, and the fence wins over the criterion.** A transform
that reached it would have to know `+`/`#` is a trailing decoration rather than part of the move —
which is token knowledge this module may not hold.

I considered and **rejected** a broader "uppercase the last character that HAS a case distinction",
which is arguably still blind (a Unicode property, not a chess fact) and would reach the suffixed
forms. Rejected because it is unrequested widening: it also turns `bxc4` into `bxC4` and hands a
meaningless new string to both readers on the majority of lines, for one family nobody has reported
a player hitting. **Recorded as available, not taken** — if `ABC-032`'s grammar owner wants the
suffixed promotions, the clean fix is in the grammar, where the suffix is already understood.

**No test pins the residue as rejected**, deliberately: a characterisation test there would make a
future fix in `ABC-032` go red for doing the right thing. It is recorded here instead.
