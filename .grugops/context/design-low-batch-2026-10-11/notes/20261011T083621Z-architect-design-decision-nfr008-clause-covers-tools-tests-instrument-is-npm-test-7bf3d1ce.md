---
id: 20261011T083621Z-architect-design-decision-nfr008-clause-covers-tools-tests-instrument-is-npm-test-7bf3d1ce
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - ADR-0035
  - ADR-0037
  - ADR-0017
  - ADR-0019
  - NFR-008
  - QE-093-d
  - tools/opening-book/book.test.ts
  - tools/grugops/lane-inventory.js
  - vitest.config.ts
  - 20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20
  - 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
  - 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
  - 20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72
supersedes:
---

# Item 2: `NFR-008`'s clause covers `tools/` tests. Its instrument is `npm test`, not `--dir src`

This note is hand-authored and unsealed. It was read from files only, and nothing was run or timed.

## The question
- The `NFR-008` row's `Applies to` cell says the lane is *"measured as `npx vitest run --dir src` (`ADR-0035`
  decision 5)"*.
- It flags that `--dir src` and `npm test` match only while no test file sits outside `src/` (`…d1e00b44`).
- `ADR-0037` placed `tools/opening-book/book.test.ts` outside `src/`. `vitest.config.ts` does not exclude
  `tools/`. QE confirmed 52 against 53 files (`QE-093-d`).

## Ruling: yes, the clause covers it
- **R-1's levelled clause is "`npm test` wall ≤ W".** Its subject is what a human waits for, which is every
  file `npm test` collects. That includes `tools/opening-book/book.test.ts`. The CPU total reported beside
  it is read on the same set.
- **`ADR-0035` never named `--dir src`.** `grep -c "dir src"` on it gives 0. The row's attribution to
  decision 5 is a transcription slip. The form comes from `ADR-0017` and `ADR-0019`, written when the two
  sets were equal.
- **The instrument is `npm test`**, or `npx vitest run` at the repository root with no `--dir`. Its count
  is what `tools/grugops/lane-inventory.js` collects. That tool reads the `npm test` form by design.
- **History stands.** The first test file outside `src/` arrived at `5332f501`, merged at `ac83c3fd`
  (`git log --diff-filter=A`). The `.grugops/` probes are excluded by config. Every `--dir src` reading
  before that is a reading of the same set.
- **From `ac83c3fd` on, a `--dir src` run is one file short.** It is not a reading of the clause. Label it
  if one is taken.
- **`ADR-0035` decision 2 (narrow set) is unchanged.** A ticket that adds or modifies a `tools/` test puts
  it in its set.
  - **`UNKNOWN - verify`:** does `vitest related` pull `book.test.ts` in for a change to a `src/` module that
    `compile.ts` imports? It was not run here, because no lane may be run on this machine today.
- **`N8-SPAWN`:** `book.test.ts` spawns 0 children (a `grep` for `spawn`, `execFile` or `child_process`
  matches nothing).

## Recorded
`ADR-0035`, a Status line and `§ Pointers 2026-10-11` P1.

## Follow-ups
- **Security/NFR, at the next catalog hop.** In the `NFR-008` row's `Applies to` cell, replace *"measured as
  `npx vitest run --dir src` (`ADR-0035` decision 5)"* and the flag *"0 today"* with: measured as `npm
  test`, the set `lane-inventory.js` collects (`ADR-0035` § Pointers P1).
- **BA/PM:** none. The R-1 re-score already moved the three Backlog pages to `npm test` (`…d8990fbb`).
