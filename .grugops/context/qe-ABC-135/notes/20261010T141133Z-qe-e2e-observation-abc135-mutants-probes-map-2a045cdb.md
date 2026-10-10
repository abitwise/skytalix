---
id: 20261010T141133Z-qe-e2e-observation-abc135-mutants-probes-map-2a045cdb
kind: observation
by: qe-e2e
at: 2026-10-10T14:11:33Z
verified_by:
confidence: high
refs:
  - ABC-135
  - QE-054-a
  - QE-054-c
  - ADR-0030
  - M-SINGLE-LINE
  - M-FIRST-STATEMENT-ONLY
  - src/render-seam.test.ts
  - commit:b09d880c
  - commit:ce6d8746
  - .grugops/context/qe-ABC-135/notes/raw-qe-mutants.sh.txt
  - .grugops/context/qe-ABC-135/notes/raw-out-qe-mutants.txt
  - .grugops/context/qe-ABC-135/notes/raw-qe-a3-map.cjs.txt
  - .grugops/context/qe-ABC-135/notes/raw-qe-hazards.cjs.txt
  - .grugops/context/qe-ABC-135/notes/raw-qe-probe.cjs.txt
  - .grugops/context/qe-ABC-135/notes/raw-qe-rows.cjs.txt
  - .grugops/context/qe-ABC-135/notes/raw-out-qe-a3-probes.txt
supersedes:
---

# `ABC-135` QE readings: 12 mutants, an A3 map re-derived with a parser oracle, 18 adversarial spellings, and a hazard scan of the real tree

Hand-authored, no seal. Apple M3, Node v26.11.0, TypeScript 5.9.3 (the repository's own, used only
as an oracle and an extractor). Every run used QE's own harnesses in `git archive` copies in a
private scratchpad, with `node_modules` symlinked. The Engineer's scripts were read as pointers and
not re-used.

## A3: the map, re-derived independently

`raw-qe-a3-map.cjs.txt` lifts `withoutComments` and `bindsAValueFrom` out of a tree's
`src/render-seam.test.ts` **by AST** (variable statements by name, then `transpileModule`), not by
text slicing. It runs them over every ordered pair of production modules. It also scores each pair
with a **TypeScript-parser oracle** of `ADR-0030` decision 2: an `ImportDeclaration` from `./<target>`
that is not `import type` and has a default binding, a namespace binding, or a named element that is
not `type`.

| tree (instrument / `src/`) | modules | pairs | consumers | oracle consumers | instrument ≠ oracle | headline |
|---|---|---|---|---|---|---|
| base `5c17d1ed` / base | 35 | 1,190 | 92 | 92 | 0 | render / status-panel / history-pane all `true` |
| tip `e7123236` / tip | 35 | 1,190 | 92 | 92 | 0 | all `true` |
| QE `ce6d8746` / tip | 35 | 1,190 | 92 | 92 | 0 | all `true` |

- The base and tip `src/` trees differ only in `src/render-seam.test.ts` (`/usr/bin/diff -r -x node_modules`).
- All three maps have sha256 `a8da4a9d…99dc1`, which equals the Engineer's `raw-a3-map-tip.txt`.
- On today's tree the delivered instrument is exact, not just equal to the base: there are 0 disagreements with the parser on 1,190 pairs.

## Why the naive strip is exact today: a hazard scan

`raw-qe-hazards.cjs.txt` walks each production module's AST and comment ranges. It looks for
string, template and regex literals that hold `//`, `/*` or `*/`, line comments that hold `/*` or
`*/`, and block comments that hold `//`. **On the real tree it finds 0 in 35 files.** On a planted
control file it finds 4 of 4, so the zero is real.

## Mutants. Command: `npx vitest run src/render-seam.test.ts`

The base pristine run is 12 passed, `b09d880c` is 13 passed and `ce6d8746` is 14 passed. All three
pristine runs are green.

| mutant | edit | base | `b09d880c` | `ce6d8746` (QE) |
|---|---|---|---|---|
| `M-SINGLE-LINE` | `[^;"]` → `[^;"\n]` | survives | RED, new `it` | RED, new `it` |
| `M-FIRST-STATEMENT-ONLY` | `.slice(0, 1)` before `.some` | survives | RED, new `it` | RED, new `it` |
| `M-NO-STRIP` | `withoutComments(source)` → `source` | — | RED (row 1) | RED |
| `M-STRIP-IN-CALLER` | strip moved to `runtimeConsumersOf` | — | RED (row 1) | RED |
| `M-LINE-ONLY` | block strip dropped | — | RED (new `it` + `A3`) | RED |
| `M-BLOCK-ONLY` | line strip dropped | — | RED (row 2) | RED |
| `M-LINE-NO-M-FLAG` | `/gm` → `/g` on the line strip | — | RED (row 2) | RED |
| `M-BLOCK-TO-SPACE-NONE` | block → `"x"` | — | RED (row 1) | RED |
| `M-GREEDY-BLOCK` | `[\s\S]*?` → `[\s\S]*` | — | RED (`A8` headline only) | RED (headline + QE `it`) |
| **`M-LINE-TO-EOF`** | `\/\/.*$/gm` → `\/\/[\s\S]*$/g` | — | **survives 13/13** | RED, QE `it` (`// c\nimport …`) |
| **`M-LINE-WHOLE-LINE`** | line strip drops the whole line | — | **survives 13/13** | RED, QE `it` (`import … // c`) |
| **`M-SWAP-ORDER`** | line strip before block strip | — | **survives 13/13** | RED, QE `it` (`/* see http://x */ …`) |

- The Engineer's three mutants reproduce exactly as published.
- Over the real tree, the three survivors leave the map at 92 consumers with 0 oracle disagreements, so no real-tree reading can see them. Only rows can.
- `M-GREEDY-BLOCK` empties the map (0 consumers). Before QE's rows, only `A8`'s three-target headline caught it.

## Adversarial spellings (`raw-qe-probe.cjs.txt`, base instrument / tip instrument / oracle)

| # | spelling (shape) | base | tip | oracle | reading |
|---|---|---|---|---|---|
| P1 | `"/*"` in a string, the import, then `"*/"` | true | **false** | true | NEW under-count. This is the docblock's named naive limit |
| P2 | `// a /* b` line comment, the import, then `/* c */` | true | **false** | true | NEW under-count. **Not** named in the docblock |
| P3 | `// end */` above the import | true | true | true | ok |
| P4 | `import x from "https://…"` above the import | true | true | true | ok (a URL in a specifier) |
| P5 | a URL import and the target import on **one line** | false | false | true | under-count from before this ticket, unchanged (`^import` anchor) |
| P6 | `import { f } … // see http://x` | true | true | true | ok |
| P7 | `/* see http://x */` above the import | true | true | true | ok |
| P8, P17 | `"http://x"` / `` `http://x` `` above the import | true | true | true | ok |
| P9 | `// header` above the import | true | true | true | ok |
| P10 | `{ type X /* , f */ }` | true | false | false | FIXED |
| P11, P12, P14, P18 | comments between specifiers, in a default clause, trailing, or a JSDoc block with `"*/"` later | true | true | true | ok |
| P13 | `/* a */ import { f } …` on one line | false | false | true | under-count from before this ticket, unchanged |
| P15 | `from "./m.ts/*x*/"` (a comment inside the specifier) | false | **true** | false | NEW over-count. The path cannot resolve, so it cannot occur in a gate-clean tree |
| P16 | `import type { X } …; // , f` | false | false | false | ok |

The six ticket rows: R1–R4 read `true` on the base, `false` on the tip, and `false` on the oracle.
R5–R6 read `true` on all three.
