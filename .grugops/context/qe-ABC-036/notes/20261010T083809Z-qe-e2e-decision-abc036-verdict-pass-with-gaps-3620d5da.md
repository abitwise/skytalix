---
id: 20261010T083809Z-qe-e2e-decision-abc036-verdict-pass-with-gaps-3620d5da
kind: decision
by: qe-e2e
at: 2026-10-10T08:38:09Z
verified_by:
confidence: high
refs:
  - ABC-036
  - ABC-035
  - EPIC-003
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/queue/claimed/qe-ABC-036/qe-ABC-036.md
  - 20261010T083809Z-qe-e2e-observation-abc036-a1-a7-reproduced-nine-mutants-red-gates-green-1af60074
  - 20261010T083809Z-qe-e2e-observation-abc036-gap-register-four-decisions-checked-8c334653
  - 20261010T083105Z-software-engineer-observation-abc036-a1-a7-met-mutants-red-gates-green-n8lane-605aa727
supersedes:
---

# `ABC-036` QE verdict: **PASS_WITH_GAPS** at `a261966` (QE rows `3f61b33`)

Hand-authored, no seal. This is a `decision`, not a `finding`: no `§14-gate` verdict exists on this
install. Diff under review: `85eb80c...a261966`.

**Criteria: `A1`–`A7` all MET**, each reproduced by QE against the page rather than the
Engineer's tables (observation `…1af60074`). Gates on both trees: lint, typecheck and build exit
0; `npm test` 50 / 1573 at the tip and 50 / 1577 with QE rows, 0 skipped; integrity
`No findings.`; `PERFT_DEEP=1` 32/32. `PUZZLE_DEEP` was not triggered: no engine, search or
evaluate file is in the diff.

**Mutants: 9 planted by QE, 9 red.** Two of them (QM7, QM8) **survived** the Engineer's suite.
They are closed by the four rows QE added in `3f61b33`: zero legal moves, `moves` clearing an
armed `quit`, and the ASCII region. `src/command-input.ts` equals the committed state afterwards.

**The Engineer's four decisions:** none contradicts a criterion of `ABC-036` or `ABC-035`
(gap note `…8c334653`).

**Why WITH_GAPS and not PASS:** seven named gaps, none against a criterion. G1 is a stale
production doc comment (`src/command-input.ts:91`, "seven tokens … Three are `command`"). QE does
not fix production code, so the gap is named. G2 is the product observation that 3 of 20 moves
show at the start frame. G3–G7 are informational or low.

**Next (not QE's to make):** the `In Review` exit on `plans/board.md` and the merge are the
Orchestrator's. UAT is **NOT waived**: the delivered diff has production lines. G1 can ride the
merge or the next touch of the file.
