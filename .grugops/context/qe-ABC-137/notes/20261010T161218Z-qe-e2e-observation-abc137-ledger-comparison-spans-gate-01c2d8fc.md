---
id: 20261010T161218Z-qe-e2e-observation-abc137-ledger-comparison-spans-gate-01c2d8fc
kind: observation
by: qe-e2e
at: 2026-10-10T16:12:18Z
verified_by:
confidence: high
refs:
  - ABC-137
  - ABC-136
  - ABC-057
  - R5c
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-137/probe/RUN.txt
  - 20261010T155800Z-software-engineer-observation-abc137-gates-ledger-a1-a4-cost-9e4b2d17
supersedes:
---

# `ABC-137` QE readings: QE's own ledger agrees with the SE's port on every shared row; the pins and spans hash identically; the gate is green

Hand-authored and unsealed. Raw files: `../probe/` (`RUN.txt` first). Apple M3, Node v26.11.0, vitest 3.2.7.

## Ledger: QE's own harness against the SE's port (`ticket-to-pr-ABC-137/probe/ledger-*.tsv`)

| build | base `2946e22a` (QE / SE) | head `54280bc8` (QE / SE) | QE: failing message at head |
|---|---|---|---|
| CONTROL | 0, 12/12 / same | 0, 12/12 / same | — |
| WPERFT-STATIC | 1, licence / same | 1, licence / same | `to deeply equal` |
| XHELPER-NARROW (no FMT) | 0, 12/12, lint 1 / not run | 1, tripwire, lint 1 / same | clause 1's one expression is unchanged |
| XHELPER-NARROW+FMT | 0, 12/12 / same | **1**, tripwire / same | clause 1's one expression is unchanged |
| XHELPER-NARROW+FMT+WPERFT-STATIC | 0, 12/12 / same | **1**, tripwire / same | clause 1's one expression is unchanged |
| XSHADOW-HELPER+FMT+WPERFT-STATIC | 0, 12/12 / same | 0, 12/12 / same | — (recorded, `QE-136-c`) |
| QSCAN-NARROW+FMT+WPERFT-STATIC | 1, tripwire / same | 1, tripwire / same | the licence guard scans EVERY production module |
| QLHS-INTERSECT+FMT+WPERFT-STATIC | 1, tripwire / same | 1, tripwire / same | scans EVERY … (`QE-136-d`: FMT masks the importer pin) |
| M15+FMT, M15SUB+FMT | 1, tripwire / same | 1, tripwire / same | the licence guard compares with an EQUALITY |
| WLAUNDER | 1, A6.3+A6.4+licence, lint 1 / same | same / same | A6.3 "the unmutated control"; A6.4 "the witness is not matching every export line" |
| WSTALELICENCE | 1, licence, lint 1 / same | same / same | `to deeply equal` |

- **Disagreements: none.** Every exit code, test count, failed-test name and lint verdict matches. tsc exits 0 on
  every build. QE also records the failing assertion's message, which the SE's runner does not.
- **Independence.** QE spelled two witnesses differently and got the same verdicts:
  - WPERFT-STATIC imports `newGame`, where QE-057 imports `gameStatusOf`.
  - WLAUNDER re-exports `keyHistory`, where QE-057 re-exports `repetitionCounts`.

## QE's own narrowings (each `+FMT`; the helper forms also `+WPERFT-STATIC`)

| build | base | head | gate-clean? | whole suite at head |
|---|---|---|---|---|
| H-STARTSWITH, H-INCLUDES, H-REGEX, H-CHAIN, H-BLOCK | 0, 12/12 | **1**, "clause 1's one expression is unchanged" | lint 0, tsc 0 | — |
| H-PARAM-RENAME (harmless) | 0, 12/12 | 1, same message (a false red, acceptable) | lint 0, tsc 0 | — |
| H-RENAME (whole-file rename) | 0 | 0 | lint 0, tsc 0 | the rename rewrites the pin literals too, so pin and helper stay consistent. Correct, not a survivor |
| H-CRLF | 1 (operator pin) | 1 (operator pin) | lint 1 | — |
| H-COMMENTED | 0 | **0** | lint 0, tsc 0 | 52 / 1608 passed (accepted class: the comment names it) |
| H-READDIR-SHADOW | 0 | **0** | lint 0, tsc 0 | 52 / 1608 passed → `QE-137-b` |
| QF-SECOND-COMPOSER (witness alone) | 1, composer tripwire | 1, composer tripwire | lint 0, tsc 0 | 1607 / 1 failed: armed |
| H-COMPOSER-NARROW+QF-SECOND-COMPOSER | 0 | **0** | lint 0, tsc 0 | 52 / 1608 passed → `QE-137-a` |
| H-WRAP-CALLS+QF-SECOND-COMPOSER | 0 | **0** | lint 0, tsc 0 | 52 / 1608 passed → `QE-137-a` |

## Pins and spans, base vs head (`static.txt`, QE's own extraction)

- `it` blocks 12 → 12. Eleven hash identically. The tripwire `it` changed, and all 18 of its base code lines are kept in order.
  The code lines added are exactly the new `expect(…, "clause 1's one expression is unchanged").toContain(…)`.
- Everything outside the tripwire `it` is byte-identical (`9ba49230889b1e97`). That covers clause 1's helper, the
  licence `it`, the composer code, the probe `it`, `WITNESSED_EXPRESSION` and `LICENSED_DRIVERS`.
- These hash identically, and equal the SE's `spans-after.txt` values:
  - sibling tripwire `0f1fda26…`;
  - `R5` operator pin `cd9275ce…`;
  - `R5b` scan pin `bdc44ec3…`;
  - `R5b` importer pin `f46fdab0…`;
  - `LICENSED_DRIVERS` `d8466136…`;
  - `WITNESSED_EXPRESSION` `5fcde228…`.
- The raw readers' declarations count 1 → 1: `LICENSED_DRIVERS` (`src/cli.test.ts` `A12`) and `COMPOSITION_ROOT`
  (`src/render-seam.test.ts` `A9`). Those two files alone: 81 passed.

## Gate at `455a0846` (own worktree, 2026-10-10T16:10:13Z..16:10:27Z)

- lint exit 0 (100 files). typecheck exit 0. build exit 0.
- `npm test` exit 0: 52 files / 1608 passed, 8.81 s, load1 15.18 → 24.50.
- skip count 0. `test-skip-integrity` printed `No findings.` `lane-inventory.js`: 52 = 52, `No findings.`
