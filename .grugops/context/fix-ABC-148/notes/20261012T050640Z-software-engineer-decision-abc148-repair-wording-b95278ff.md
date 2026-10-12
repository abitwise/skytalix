---
id: 20261012T050640Z-software-engineer-decision-abc148-repair-wording-b95278ff
kind: decision
by: software-engineer
task: fix-ABC-148
at: 2026-10-12T05:06:40Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
  - QE-148-a
  - QE-148-b
  - 20261012T050640Z-software-engineer-observation-abc148-six-forms-ade9973f
supersedes:
---

# SE `fix-ABC-148`: the open remainder is named by family and marked measured, not exhaustive

- **`QE-148-a`.** The paragraph no longer says "the open remainder … is the two". It names the eight
  measured open forms by family (loop binders; callback parameters incl. `function` and
  parenthesised arrows; destructuring patterns), states that the regex sees `history` only where
  `:` or `=` directly follows it, and says the list is what was measured, not exhaustive. The
  counted sentence (bare `history =>`) and the closed-by-typecheck sentence (`for…in`, `catch`)
  are kept verbatim; the `D4` sentences after them are untouched.
- **`QE-148-b`.** "five `[:=]`-free forms" is replaced by "Eleven binder forms were re-planted",
  so no label calls the bare arrow `[:=]`-free while the same paragraph counts its `=`.
- **`ABC-113` page.** A new dated correction is appended after the `ABC-148` `A3` one with the same
  family list; the earlier `A3` correction stays (its "of those four forms" scope keeps it true),
  nothing is struck, line 64 is byte-unchanged (`cmp` against `3537fe48`).
