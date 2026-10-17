---
task: wave-2026-09-25
subtask: repair-ABC-096
role: software-engineer
ticket: plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
ref: .grugops/context/repair-ABC-096/
branch: grugops/ABC-096-opening-name
tip: c11bfec8
---

# Done: QE-096-a and QE-096-b closed with two test rows (test commit 3ceda09a, docs c11bfec8)

- The rows are in `src/render-seam.test.ts`. They cover the odd-offset astral cut (`"a"` + 20 × U+1D11E shows
  `a` + 8 × U+1D11E + `...`, with no lone surrogate) and the `": "` separator (`Foo:Bar: Baz Variation` shows
  `Foo:Bar`). No production code changed.
- Each row is red on QE's own mutant (Q2: 1 failed / 27 passed, Q9: 1 failed / 27 passed) in a scratch copy
  outside the repository. Both are green on the real code (28 / 28).
- Gates at the tip: lint, typecheck and build exit 0. `npm test` exits 0 with 58 / 1824 and `success: true`.
  Skip-integrity reports `No findings.` `CLI_DEEP=1` exits 0 with 10 passed.
- The § Delivery section on the ticket page gained one line. The trace file is untouched. Nothing was pushed. I took no
  timing reading.
- Note: `.grugops/context/repair-ABC-096/notes/20261017T125301Z-software-engineer-observation-abc096-repair-rows-mutants-gates-3ceda09a.md`
  (on the branch).
