# `ABC-246` QE findings: four INFO (QE-246-a..d) and SE-246-a confirmed (INFO, carried); none blocks, none above LOW

- **QE-246-a (INFO, timing admissibility).**
  - What happened: the permitted records-only BA/PM hop (`bapm-page-closes`) committed at 07:10:51Z and 07:10:56Z. Both
    commits fall inside `G8` run 1 (base, 9.44 s, the highest base wall). Its top-CPU snapshot shows a `git` and a `node`
    process at 00:00 elapsed.
  - Why it is admissible: no foreign vitest ran. load1 was 1.28 before and 1.79 after. The head runs (2, 3, 6) had no git
    activity in their windows.
  - Why the grade does not depend on it: without run 1 the base median would be 9.35 or 9.38 s, and H is unchanged. Both
    the verdict and `NFR-008` are untouched.
  - The Orchestrator then merged that hop at 07:11:26Z, just after run 2 ended.
- **QE-246-b (INFO, records).** W1's scope differs between two sources, and the difference did not matter here.
  - The brief applies W1 at this gate. The ticket page's § NFR triggers says W1 starts at `ABC-248`'s gate.
  - H 9.51 s ≤ 9.7 s, so W1 would not trigger under either reading.
  - This ticket's head median, **9.51 s**, is part of `ABC-248`'s base, as the ticket page asks.
- **QE-246-c (INFO, row strength, not a gap).**
  - Both rows play `position startpos moves e2e4`, so Black is to move, and both clocks are equal. The rows therefore
    cannot tell which side's clock is read.
  - That class (QM4CM) is held by `ABC-221` A12's Black rows (`qe-ABC-221` `…c6f37a35`), so nothing is missing. The ticket
    asked for the budget only.
- **QE-246-d (INFO, harness).**
  - `lane-inventory.js` needs `git rev-parse`, so it ran in the worktree (tracked code = `a1942ea0` = H) with a temporary
    `node_modules` symlink, removed after. It was not run in the archive tree.
  - The B `none` control was run beside the pre-registered B plants. It is not pre-registered and changes no expectation.
  - P was built with `cp -al` inside the scratchpad, which is the same device here.
  - `g8.mjs` gained only an optional order argument and a length-general median, for a W1 window that was not needed.
- **SE-246-a (INFO, confirmed, carried; not this ticket's).**
  - The second comment in `src/engine.test.ts`'s `ABC-170` A2 block says the abort "lands at 6 746 nodes".
  - QE reads **6 893** nodes at depth 2 at both H and B, so the change predates this ticket.
  - The row's bounds (≥ 6 000, ≤ 6 000 + 1 024) hold. It goes to the next ticket that edits that block.
- **Closed:** QE-221-a. Both mode guards are now held by lane rows (plants note).
- **Still out of scope:** QE-221-b (the `src/levels.ts` header comment, a production line), as the ticket's § Out of scope
  places it.
