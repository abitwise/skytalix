---
id: 20261009T161100Z-qe-e2e-observation-abc102-mutants-two-build-reapplied-eight-own-nine-red-q8-table-order-equivalent-dbe418af
kind: observation
by: qe-e2e
at: 2026-10-09T16:11:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - src/command-input.ts
  - src/command-input.test.ts
  - .grugops/context/qe-ABC-102/probes/mutants.mjs
  - .grugops/context/qe-ABC-102/notes/raw-mutants.json.txt
supersedes:
---

# `ABC-102` mutants: 2 of the build's re-applied, 8 of QE's own. 9 go red in the test file. Q8 (table order) survives and is equivalent

This note is hand-authored and has no `seal`. Harness: `probes/mutants.mjs`. Each mutant is one
exact-once replacement in `src/command-input.ts`. After applying it, the harness runs
`npx vitest run src/command-input.test.ts --reporter=json` and then QE's loop probe. It restores
the file with `git checkout`, then asserts that `git status --porcelain -- src` is empty and the
file bytes equal the original. That check held after every mutant. Raw output is in
`raw-mutants.json.txt`.

| mutant | test-file rows red / 151 | loop probe red |
| --- | --- | --- |
| **M1** (build) guard `>= 1`, the unguarded ply-1 take-back | **2**: both `A2` 1-ply rows (pure + loop). Matches the build's ledger. | 5 (S2) |
| **M3** (build) heading kept | **4**: `ABC-035` `A4` length row, **`ABC-035` `A7` start position**, `ABC-046` help row, `A8`. Matches the build. | 16 |
| **Q1** `undo` branch moved after `new`'s take-back branch (undo takes ALL plies) | **12** | 19 |
| **Q2** refusal kind `rejected` instead of `command` | **2** (`A2` pure rows) | 0, because the loop treats `rejected` and `command` alike |
| **Q3** heading kept AND `undo` dropped from help. The length stays 7, which is the superseded rows' blind spot. | **2**: `ABC-035` `A4` positive half, `A8` | 1 |
| **Q4** guard `> 2` (refuses at exactly 2 plies) | **1** (`A3` only) | 13 |
| **Q5** a successful undo carries the refusal text (breaks ruling 7) | **5** | 14 |
| **Q6** refusal as a zero-ply `take-back` (nothing changes, but one derive) | **4** (`A2`: exact value + loop derive count) | 0, because the probe does not count derives |
| **Q7** refusal wording drift (`nothing to undo.`) | **5** | 9 |
| **Q8** `undo` row moved FIRST in `COMMAND_TABLE` | **0**. Only QE's own help-order check sees it. | 1 |

**Q8 is equivalent with respect to the criteria.** No test pins the table or help order, and no
criterion asks for one. To check whether order could still matter for the fit, `probes/help-permutations.ts` renders
**all 5040 orderings × 2 glyph modes = 10080** on the real narrowest frame, and **none hides a
token** (`raw-help-permutations.json.txt`). Classification is an exact whole-token match, so row
order cannot change which line is a command.

**Thin spot, not a gap:** Q4 (off by one upward) is caught by exactly one row in the test file
(`A3`, at the 2 → 0 step). It is red, so the criterion holds. QE's probe catches it 13 ways.
