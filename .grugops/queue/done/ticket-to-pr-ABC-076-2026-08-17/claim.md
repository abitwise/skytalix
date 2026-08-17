# Claim: ticket-to-pr-ABC-076-2026-08-17

- role: software-engineer
- task: ticket-to-pr-ABC-076-2026-08-17
- claimed: 2026-08-17T18:44:00Z
- done: 2026-08-17T18:52:00Z

Implemented `ABC-076` on `grugops/ticket-to-pr-ABC-076-2026-08-17` at `f8b36aa` — `src/evaluate.ts`
(164 lines) and `src/evaluate.test.ts` (256 lines), nothing else in the diff. `A1`-`A5` MET; the
one-ply expansion produced exactly 178 children (6 + 178 = 184) and `A1` caught a real `-0` defect,
fixed in the evaluator, not the assertion. `A6` MET and REPORTED, not asserted: mean 128.8 ns/call,
kiwipete 135.7 ns, position-6 138.5 ns, on Apple M3 / macOS 26.5.2 / Node v24.12.0, against a
1,100 ns bar.

Lint, typecheck and build GREEN; skip count 0 and test-skip-integrity `No findings.`. `npm test` is
RED at 1 failed / 888 passed — `src/cli.test.ts` `A3`'s hard-coded production-module count (20, now
21), a file this ticket's security threshold forbids touching and whose correct value depends on
whether `ABC-031` merges first. NOT fixed here, diagnosed in the notes. No test softened, skipped or
relaxed.

NOT merged. No board column moved. The mandatory `qe-e2e` hop has not happened and was not
self-certified. Notes published to
`.grugops/context/ticket-to-pr-ABC-076-2026-08-17/notes/`.
