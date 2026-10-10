---
id: 20261010T133848Z-software-engineer-decision-abc104-fix-forward-qe-gaps-2e7fbb75
kind: decision
by: software-engineer
at: 2026-10-10T13:38:48Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ADR-0004
  - src/coordinate-move.ts
  - src/san.ts
  - 20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19
  - 20261010T133848Z-software-engineer-observation-abc104-fix-forward-readings-c73ed93e
supersedes: 20261010T132825Z-software-engineer-decision-abc104-totality-scoped-to-text-30823a98
---

# `ABC-104` fix-forward: two obligations counted, attribution split, throw claim scoped

This note is hand-authored and unsealed. Code commit `82180eae` on `grugops/ABC-104-coordinate-move-docblock`.
It is comment-only and changes only the module header docblock of `src/coordinate-move.ts`.

- **QE-104-a.** The `:25` heading now reads "TWO CALLER OBLIGATIONS, neither of them validated here",
  in `src/san.ts:18`'s form. My earlier "ONE stays accurate" argument (`…30823a98`) is withdrawn: QE is
  right that both obligations are unvalidated, so validation cannot tell them apart. That is why this
  note supersedes `…30823a98` on that point only.
- **QE-104-b.** Clause 2 (`ADR-0004:201-204`) states only the `legal`-list obligation, so only that one
  is attributed to it. "A real `Position`" is marked as "this module's own, and `ADR-0004` clause 2
  does not state it". The ADR is untouched (QE-104-d is with the Architect).
- **QE-104-c.** "a wrong type throws" became "A wrong type there CAN throw, and need not". The sentence
  names the read conditions (`legal` is read only when `text` parses; `position` only when `text`
  parses and `legal` is nullish), keeps the two throwing calls exact, and adds the measured
  non-throwing `(null, "hello")`. The closing sentence says the throws are "not a guard".
- **Kept.** "TOTAL OVER `text`", "Totality is over `text` ONLY" and both quoted throwing calls, so
  `A1`/`A2` still read as before.
- **Not touched.** The function docblock (`:79`) says `legal` "carries the caller obligation in the
  module header". That is still true of `legal`, and the line lies outside the header (`A3`).
