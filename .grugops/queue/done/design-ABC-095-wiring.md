---
subtask: design-ABC-095-wiring
role: architect-design
result: done
branch: grugops/design-ABC-095-wiring
tip: dfb57d68
design_commit: af164409
finished_at: 2026-10-12T13:27:00Z
---

The ruling is `ADR-0037` § Addendum — 2026-10-12, with dated pointers in `ADR-0012` and `ADR-0015`.
- **R1 — (b2).** A new holder, `src/book-file.ts` (`readBookFile()`), holds the read. `cli.ts` binds
  `read`, the stderr warn and `Math.random`.
- **Security/NFR** is asked S1 (the `ADR-0036` §3 trigger, the fourth holder) and S2 (bar 4's scope).
  Bar 4 is not changed by this role.
- **R2.** The 10 child doubles of `./engine.ts` move to `./book-engine.ts`. `ABC-119`'s deep children
  run from a byte-verified copy of the tree with `book.json` absent.
- **R3.** The 5 ms miss bar is warm. The cold load goes to `A2`.
- **Merge order.** `521a8513` merges only with the wiring.
- **Amendment lists:** decision note `…a4fe3027` under `.grugops/context/design-ABC-095-wiring/notes/`,
  on the branch.
