---
id: 20261021T090521Z-software-engineer-observation-83110c81
kind: observation
by: software-engineer
at: 2026-10-21T09:05:21Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
supersedes: 
seal: sha256:5211bfb342a1ab136739f2e52ffb399bf1b728fd4b6a7bbe71d0de73b16f83c2
---

# ABC-163 branch, commits, files, and what is owed

- **Branch:** `grugops/ABC-163`, worktree `../wt-ABC-163`, from `main` `ccccc6bb`. Not pushed, not merged.
- **`87d3897d`:** `.grugops/context/design-F-072-1/probe/clause-b.mjs`, +24/−2:
  - the header (the in-place fold, and the `341da4c1` reproduction pointer);
  - the (b1) contract paragraph for Ruling 2;
  - `baseHolders` and the `ruling2` list (limb 1 only);
  - `fires` includes `ruling2`;
  - one output line under (b1), limb 1 only;
  - the verdict label counts Ruling 2 as FIRES.
- **`d8c073e2`:** `ADR-0036` § S1, +9: `#### Ruling 2 folded — 2026-10-21 (ABC-163)`.
- **Notes commit:** this note set, under `.grugops/context/ticket-to-pr-ABC-163/notes/`.
- **Tests:** 0 test files and 0 tests, as the page says (`NFR-008` not triggered). The proof is the plant and pair
  readings (`…readings`).
- **Downstream shape change, for harness readers.** Old harnesses (`fixtures.sh`, `f-mutants.sh`,
  `sec-mutants.sh`, `mutants.sh`) grep `(b1)`. On limb 1 they now also match the Ruling 2 line. Their limb 2 and
  limb 3 output is unchanged.
- **Owed:**
  - QE re-plants P2b, P2c and the comment edit (the page's Test note 3);
  - the Orchestrator records the close of `AR-095-L1UNIT` and stops the by-hand step;
  - the Orchestrator owns the board and trace moves.
