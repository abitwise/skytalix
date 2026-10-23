---
id: 20261023T220929Z-architect-design-decision-90b06dec
kind: decision
by: architect-design
at: 2026-10-23T22:09:29Z
verified_by: 
confidence: high (read from the ABC-205 page at main f47b3429)
refs:
  - ABC-206
  - ABC-205
  - ABC-212
  - NFR-008
  - arch-design-ABC-206/20261023T220816Z-architect-design-decision-e3ff760b
  - arch-design-ABC-206/20261023T220816Z-architect-design-observation-cf395b1e
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
  - plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
supersedes: 
seal: sha256:ca605aa1c278dcedbd02334b39dc0bb78c91e527eeee83f3298e27eb68d31da7
---

# ABC-206 ruling corrected: ABC-205 also re-pins 5 lane test files, so all ABC-206 count guards go in gameend.nfr.test.ts

Architect/Design, task `arch-design-ABC-206`, at the same branch.

- **What this corrects.**
  - `…observation-cf395b1e` item 5 says *"ABC-205's ruling touches evaluate.ts (+ its test) only"*. That is wrong.
    The ABC-205 page § Design ruling also re-pins 11 lane rows, in `transposition`, `search.ordering`,
    `search.pvs-lmr`, `engine` and `quiescence` `.test.ts`.
  - `…decision-e3ff760b` item 7 left the `quiesce` and `lateMoveReduction` count guards to "the owning file", which
    would be `quiescence.test.ts` and `search.pvs-lmr.test.ts`. Those are two of ABC-205's five.
- **Ruled now.**
  - All three spied count guards go in `src/gameend.nfr.test.ts`, with its `legal.ts` spies plus a pass-through
    `apply.ts` spy.
  - ABC-206's test edits are confined to `legal.test.ts`, `gameend.test.ts` and `gameend.nfr.test.ts`. That is
    none of ABC-205's five files, and not `engine.test.ts`, which ABC-212 and ABC-205 edit.
  - So no file is shared with ABC-205. `src/engine.ts` is shared with ABC-212, in disjoint hunks.
- **Unchanged:** the merge order (212 → 206 → 205), the shape, the identity proof, and the rule that `A1` is read
  against the merge base actually merged into.
  - ABC-205's re-pinned node counts survive a 206-first merge, because 206 is node-identical.
- The page § Design ruling carries the corrected text.
