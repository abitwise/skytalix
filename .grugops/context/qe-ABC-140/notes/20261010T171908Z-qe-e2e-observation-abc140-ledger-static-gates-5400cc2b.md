---
id: 20261010T171908Z-qe-e2e-observation-abc140-ledger-static-gates-5400cc2b
kind: observation
by: qe-e2e
at: 2026-10-10T17:19:08Z
verified_by:
confidence: high
refs:
  - ABC-140
  - ADR-0011
  - R5d
  - QE-137-d
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-140/probe/RUN.txt
  - 20261010T170427Z-software-engineer-observation-abc140-gates-ledger-a1-a6-cost-1d12c309
supersedes:
---

# `ABC-140` QE readings: the base ledger reproduces, the five survivors go 0 → 1, every edit to pinned text reds, and three keep-the-text spellings stay green with the gate clean

This note is hand-authored and unsealed. Raw rows and timestamps are in `../probe/` (`RUN.txt`). Node v26.11.0, Apple M3. A
fresh `git archive` tree is made per build. Every row has tsc 0, and every `+FMT` row has lint 0.

## Port check (`QE-137-d`)
At base `6dde3261`, the Architect's builds in QE's loop match BA/PM's `75dcc0f5` `ledger-file.tsv` on every shared
row. The match covers exit code, test count and failing test.

## File scope, `src/history-pane.nfr.test.ts` (base `6dde3261` → head `795adca4`)

| build | base | head |
|---|---|---|
| `CONTROL`, `FMT` (Architect's) | 0, 12/12 | 0, 12/12 |
| `WSC` / `Q-WSC` (aliased `assembleFrame as composeFrame`) | 1, composer tripwire | 1, composer tripwire |
| `WPS` / `Q-WPS` | 1, licence guard | 1, licence guard |
| `N591-HEAD` / `-TAIL` / `-WRAP` `+FMT+WSC` | 0, 12/12 | **1**, drift: "scans EVERY production module" |
| `C-CONTAIN` / `C-OPERAND` `+FMT+WSC` | 0, 12/12 | **1**, drift: "compares with an EQUALITY" |
| `N653-NARROW+FMT`, `H-SHADOW+FMT+WPS`, `H-FSMOCK+FMT+WPS` | 0, 12/12 | 0, 12/12 (accepted) |
| `N653-DROPROOT` (unformatted control) | 1, probe "root exists" | 1, probe "root exists" |
| QE: `Q-N-HEAD` / `-TAIL` / `-INNER` / `-WRAP` `+FMT+Q-WSC` | 0, 12/12 | **1**, drift: scan pin |
| QE: `Q-N-TYPED+FMT` (benign `(file: string)`) | 0 | **1**, drift: scan pin |
| QE: `Q-C-ARRAYCONTAINING` / `-CONTAINEQUAL` / `-SLICE` `+FMT+Q-WSC` | 0, 12/12 | **1**, drift: comparator pin |
| QE: `Q-C-STRICT+FMT` (`toStrictEqual`, equal strength) | 0 | **1**, drift: comparator pin |
| QE: `Q-C-MSG+FMT` (failure message reworded) | 0 | **1**, drift: comparator pin (test note 4, as intended) |
| QE: `Q-MUTATE-BETWEEN+FMT+Q-WSC` (`composers.splice(…filter…)` between the statements) | 0, 12/12 | **0, 12/12** |
| QE: `Q-RETURN-BETWEEN+FMT+Q-WSC` (`if (composers.includes(…)) return;` between) | 0, 12/12 | **0, 12/12** |
| QE: `Q-LOCAL-SHADOW+FMT+Q-WSC` (a local `productionModulesIn` in the composer `it`) | 0, 12/12 | **0, 12/12** |
| QE: `Q-PREDICATE+FMT+Q-WSC` (`bindsAssembleFrame` narrowed; fenced out) | 0, 12/12 | 0, 12/12 (out of scope) |

Each `+Q-WSC` green row has its unarmed twin green too: `Q-MUTATE-BETWEEN+FMT`, `Q-RETURN-BETWEEN+FMT` and
`Q-LOCAL-SHADOW+FMT` each give 0, 12/12. `Q-WSC` alone reds, so in each of those green rows the kill was dropped.
No row printed `PLANT-FAILED`.

## Whole lane at head `795adca4`
- `CONTROL`: 52 files / 1608 passed.
- `N591-TAIL+FMT+WSC` and `C-OPERAND+FMT+WSC`: 1607/1608. The one failure is the drift tripwire.
- `Q-MUTATE-BETWEEN`, `Q-RETURN-BETWEEN` and `Q-LOCAL-SHADOW` (each `+FMT+Q-WSC`): **1608/1608**, with lint 0 and tsc 0.

## Static (`probe/static.txt`, `probe/phrases.txt`)
- The five existing `expect(instrument, …)` statements are hash-identical at base and head: the expression, `R5`,
  both `R5b`, and `R5c`. The two new statements follow them.
- The helper is identical (`:163` → `:166`). The composer scan..comparator span is identical (`:591` → `:610`).
  `bindsAssembleFrame` is identical.
- `const LICENSED_DRIVERS: readonly string[]` occurs ×1 and `^const COMPOSITION_ROOT = "render-seam\.ts";$` ×1,
  each identical. `src/cli.test.ts` `A12` and `src/render-seam.test.ts` `A9` pass in the whole lane.
- Each decoded literal occurs ×1 in the head file. `biome-ignore` 1 → 2. `it(` 12 → 12. The `H-SHADOW` docblock
  anchor occurs ×1.
- Phrase counts:
  - "it pins five spans by TEXT": 1 → 0.
  - "seven spans": 0 → 1.
  - `R5d`: 0 → 2.
  - "Both guards at the bottom of this file": 1 → 0.
  - "THE TWO GUARDS HOLD DIFFERENT PROPERTIES": 1 → 0.
- Diff:
  - `git diff --name-only 6dde3261..795adca4 -- src` lists `src/history-pane.nfr.test.ts` only (32/13).
  - The zero-production-lines measurement (`… | grep -v '\.test\.ts$' | grep '^src/'`) is empty.

## Gate (QE worktree, `dcc8dcca`, 17:17:52Z..17:18:18Z)
- lint: exit 0 (100 files). typecheck: 0. build: 0.
- `npm test`: exit 0, 52 files / 1608 passed, 9.71 s. load1 went from 9.57 to 13.07.
- Skip count 0 (vitest JSON). Integrity: `No findings.`
- `lane-inventory.js`: 52 / 52, `No findings.`

## Not re-measured
`N8-LANE`'s cost is not re-timed here. The SE's two admissible `ADR-0035` sets (`…1d12c309`) are cited. The change
adds two `toContain` calls on a string the test already reads. No deep lane is triggered: no engine code, and no
change to `src/cli.ts` or `src/line-input.ts`.
