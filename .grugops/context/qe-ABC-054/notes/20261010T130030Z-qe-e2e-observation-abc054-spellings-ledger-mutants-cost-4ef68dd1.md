---
id: 20261010T130030Z-qe-e2e-observation-abc054-spellings-ledger-mutants-cost-4ef68dd1
kind: observation
by: qe-e2e
at: 2026-10-10T13:00:30Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ADR-0030
  - ADR-0029
  - ADR-0035
  - AR-053-COMPOSER
  - AR-053-ORDER
  - N8-LANE
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-053/probe/plant.py
  - 20261010T130030Z-qe-e2e-decision-abc054-verdict-pass-with-gaps-35137d2d
supersedes:
---

# `ABC-054` QE readings: the spelling table against an oracle, the out-of-tree builds, eleven instrument mutants, the controls and one cost set

This note is hand-authored and unsealed. The raw files are in `../probe/`. Node v26.11.0, TypeScript
5.9.3, Biome as pinned. Each build is one fresh `git archive` copy with `node_modules` linked
(`ledger.sh`). Builds QE-053 wrote are delegated to `qe-ABC-053/probe/plant.py`, unchanged. Every
other build is QE's own (`plantqe.py`). load1 is logged per build in each ledger; it was 2.1–6.1
across all of them.

## 1. The spelling table (`spell.cjs` → `spelling-table.md`)

- **Instruments under test** are extracted **by text from git**, so no copy can drift:
  - `bindsAValueFrom` (`b85f1d82`);
  - the base regex of `runtimeImportersOf` (`68dd87ac`);
  - the composer tripwire's `bindsAssembleFrame` (`b85f1d82`).
- **The oracle** is `ts.transpileModule` with `verbatimModuleSyntax: true`. An import declaration from
  the target that still carries a binding after transpile binds a VALUE. This is `ADR-0030` decision 2
  stated by the compiler, not by a regex.

| group | n | new instrument vs oracle | old regex |
|---|---|---|---|
| the ticket's eight (QE's own copies) | 8 | **8 agree; 4 consume** | 7 of 8 counted (only `import type` excluded) |
| extras the task named: multi-line value / all-type / default + type (`E2`–`E5`); aliased value / aliased type / `{ default as D }` (`E6`–`E8`); `import D, { type X }` (`E9`); bare + value in one file, either order (`E14`, `E15`); bare + all-type in one file (`E16`); `import type` then value (`E17`) | 12 | **12 agree** | over-counts `E3`, `E7`, `E16` |
| other extras: type last, `D, { g }`, `D, * as ns`, `type D`, `type * as ns`, `{}`, trailing comma, `export *`, `export * as`, `export type`, a value named `type`, `typeX`, other targets | 14 | **14 agree** | — |
| `E24` `import { type as t }` (a value named `type`, aliased) | 1 | under-count | counts |
| **over-count probes** `O1` block comment in braces, `O2` line comment in braces, `O3` `import type{`, `O4` column-0 import in a block comment, `O5` column-0 import in a template literal, `O6` commented-out specifier | 6 | **6 over-count** (false-green direction) | 5 of 6 over-count too |
| **under-count probes** single quotes, no semicolon, import attributes, string-named specifier, two statements on one line, `import{` | 6 | 6 under-count (fail red) | — |

**The composer tripwire, same oracle (target `frame.ts`):**
- It counts the static brace (`F1`), the namespace (`F5`), the alias (`F6`), multi-line (`F7`) and
  `D, { assembleFrame }` (`F9`). It does not count the inline type (`F8`), which is correct.
- **It does not count** a default binding (`F2` `import assembleFrame from`, `F3` `import F, { type
  FrameParts }`), `{ default as assembleFrame }` (`F4`), or **`{ /* x */ assembleFrame }` (`F10`)**.
- `bindsAValueFrom` counts all four.
- Default bindings are unreachable today: `frame.ts` has no default export, so `tsc` reds them (`TS2613`).

## 2. Out-of-tree builds (`ledger-A.tsv`, `-B` autofix, `-C` the gate as it runs, `-D`)

The "gate" column is `tsc --noEmit` / `biome check src` in the copy. `ledger-C` puts the copy's import
in biome's sorted position, so lint judges the spelling, not the order.

| build | A8 | other red | `render.ts` consumers | gate |
|---|---|---|---|---|
| `BASE` (head) | green | — | `["render-seam.ts"]` (also status-panel, history-pane) | 0 / 0 |
| `QX3b`, `-TYPEONLY`, `-MULTILINE`, `-BARE` (head) | **RED** | `A11` | `[]` | 0 / 0 (multi-line: format error only) |
| `QX3b` (base `68dd87ac`) | **green**: the defect | `A11` | — | 0 / 0 |
| all `QX3b-*` after `biome check --write` (ledger B) | RED, except `O4` | `A11` | `[]`: autofix rewrites every all-type brace to `import type` | 0 / 0 |
| `QX3b-O1` block comment in braces | **green** | `A11` | `["render-seam.ts"]` | 0 / 0 (`useImportType` warning) |
| `QX3b-O2` line comment in braces | **green** | `A11` | `["render-seam.ts"]` | 0 / 0 (warning) |
| `QX3b-O6` commented-out `// renderBoard,` | **green** | `A11` | `["render-seam.ts"]` | 0 / 0 (warning) |
| `QX3b-O3` `import type{` | green | `A11` | `["render-seam.ts"]` | 0 / **1** (format error) |
| `QX3b-O4` / `-O4b` column-0 import in a block comment (O4b: with `import type`) | **green** | `A11` | `["render-seam.ts"]` | 0 / 0 (O4b: **no diagnostics at all**) |
| `QC1-VOID`: copy called, `void renderBoard;` (`ADR-0030` `C1`) | **green** | `A11` | `["render-seam.ts"]` | 0 / 0, **no diagnostics** |
| `QOK-ALIAS`, `QOK-MULTILINE`, `QOK-TYPE-PLUS-NAMESPACE` (no false red) | green | — | `["render-seam.ts"]` | 0 / 0 (ALIAS and MULTILINE after autofix; as planted they are format-only errors) |
| `QF-STATIC` / `SECOND-COMPOSER` | green | **tripwire** | — | 0 / 0 |
| `Q-COMPOSER-NAMESPACE`, `-ALIAS`, `-MULTILINE` | green | **tripwire** | — | 0 / 0 (`-MULTILINE`: biome 1, format only) |
| `Q-COMPOSER-REEXPORT`, `-DYNAMIC`, `-NEG-ALLTYPE` | green | — (24/24) | — | 0 / 0 |
| `QF-COMMENT` `import { /* composer */ assembleFrame }` + use | green | **— (24/24)** | — | 0 / 0, **no diagnostics**; survives autofix |
| `QF-DEFAULT` default import of `frame.ts` | green | — (24/24) | — | **tsc 2** (`TS2613`) |
| `QF-DEFAULT+EXPORT` (`frame.ts` gains `export default assembleFrame`) | green | — (24/24) | — | 0 / 0 |
| `INLINE-TYPE` | green | licence **and** the measured probe (`evaluates history.ts's module body NOWHERE ON THE FRAME PATH`) | — | 0 / 0 |
| `X5b` | green | `PER FRAME` | — | 0 / 0 |
| `Q-CTRL-DEAF-AFTER-LOAD+X5b` | green | **`the probe is ARMED`** | — | 0 / 0 |
| `Q-CTRL-ARMING-FIRST+DEAF+X5b` | green | — (24/24, by construction) | — | 0 / 0 |

## 3. Mutants of the instrument (`ledger-D.tsv`, head copies, both files)

| mutant | effect | killed by |
|---|---|---|
| `M-NO-CLAUSE-TYPE` (drop the `import type` clause check) | `render.ts` → 4 consumers | eight-spelling test (`A8` stays green: `toContain`) |
| `M-NO-SPEC-TYPE` (inline `type` specifiers count) | — | eight-spelling test |
| `M-NO-OUTSIDE` (default/namespace never count) | — | eight-spelling test |
| `M-EVERY` (`.some` → `.every` on specifiers) | `render.ts` → `[]` | eight-spelling test **and** `A8` |
| `M-ALLOW-EXPORT` (`^(?:import\|export)`) | — | eight-spelling test |
| `M-NO-TRIM` | — | eight-spelling test |
| `M-OLD-REGEX` (old regex OR new) | — | eight-spelling test |
| **`M-FIRST-STATEMENT-ONLY`** (`.slice(0, 1)` before `.some`) | — | **survives** (QE-054-c) |
| **`M-SINGLE-LINE`** (`[^;"\n]`) | — | **survives** (QE-054-c, test note 3) |
| `M-TYPE-NO-WS` (`/^type/` on specifiers) | under-counts `typeX` | survives; INFO |
| `M-A8-SELF` (drop `file !== target`) | — | survives; equivalent on this tree (no module imports itself) |

## 4. Gate and cost

- **Gate:** `gates-tip.txt`. All six steps exit 0: 51 files / 1583 passed, skip count 0, integrity and
  lane inventory clean. load1 2.45–2.57.
- **Cost:** `cost.py` → `cost-Q1.tsv`, **one pre-registered set and no other**.
  - Narrow set = the two modified files. Arms: base `68dd87ac`, head `b85f1d82`, and a twin of base
    (`diff -r -x node_modules` exit 0). 9 rotated rounds, round 0 discarded, n = 8, k = 2. Counts were
    asserted (23 / 24 / 23). load1 2.94–3.62.

| | median | % of base 1.371 s | sign + | interval x(2)..x(7) | R |
|---|---|---|---|---|---|
| twin − base | −0.016 s | **−1.13 %** | 3/8 | −0.038..+0.005 | **0.038 s** |
| head − base | **+0.017 s** | +1.25 % | 5/8 | −0.027..+0.029 | 0.029 s |

- **Admissible**: twin ≤ 1.5 % and the sign is at chance. It **resolves 650 ms** (R ≤ b). The head
  median is ≤ b, so **MET** under `ADR-0035` decision 1 as **proposed**.
- The base arm again read above its identical twin (5 of 8 deltas negative). The Engineer's 13 of 16
  is consistent with that. The cause is still `UNKNOWN - verify`.
