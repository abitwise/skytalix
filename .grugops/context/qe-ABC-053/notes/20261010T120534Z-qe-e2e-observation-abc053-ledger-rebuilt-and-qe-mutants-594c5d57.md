---
id: 20261010T120534Z-qe-e2e-observation-abc053-ledger-rebuilt-and-qe-mutants-594c5d57
kind: observation
by: qe-e2e
at: 2026-10-10T12:05:34Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ADR-0029
  - ADR-0030
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - .grugops/context/qe-ABC-053/probe/plant.py
  - .grugops/context/qe-ABC-053/probe/ledger.sh
  - .grugops/context/qe-ABC-053/probe/ledger-adr0029.tsv
  - .grugops/context/qe-ABC-053/probe/ledger-qe-1.tsv
  - .grugops/context/qe-ABC-053/probe/ledger-qe-2.tsv
  - .grugops/context/qe-ABC-053/probe/ledger-node24.tsv
  - .grugops/context/qe-ABC-053/probe/repeats.txt
  - .grugops/context/qe-ABC-053/probe/diag-roots.txt
  - 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
supersedes:
---

# `ABC-053` readings: `ADR-0029`'s ledger reproduces 11/11 on QE spellings and on Node v24; 40 QE builds; three `setImmediate` turns reach depth 3, not 4

This note is hand-authored and unsealed.
- Every build is one fresh `git archive 57251578` copy with one mutation from `../probe/plant.py`.
- Each build was run as `node node_modules/vitest/vitest.mjs run src/history-pane.nfr.test.ts
  src/render-seam.test.ts` (23 tests).
- Machine: Apple M3, Darwin 25.5.0.
- BA/PM (`ABC-087`) and Security/NFR (catalog) were running in parallel, so load1 is in every row of
  the `.tsv` files.

## 1. `ADR-0029`'s ledger, rebuilt with QE spellings (`ledger-adr0029.tsv`, Node v26.11.0, load1 2.6–2.9)

QE's spellings differ from the Engineer's on purpose. They are digit-free inside the seam, so
`A3`'s `/\d/` row cannot take a kill:
- `X5b-CONDITIONAL` uses `HISTORY_ROWS + HISTORY_ROWS`, imported from the pane;
- `X5b-query` uses `?nocache`;
- `X5b-computed` uses a template literal.

| build | exit | the one red assertion | Engineer (`…3a8f5aa3`) | Node v24.12.0 |
|---|---|---|---|---|
| BASE | 0 | — (23/23) | 0 | 0 |
| `X5b` | 1 | `PER FRAME` | same | same |
| `X5b-CONDITIONAL` | 1 | `PER FRAME` **only** | `PER FRAME` + `/\d/` (digit spelling) | same |
| `X5b-query` | 1 | `PER FRAME` **only** | `PER FRAME` + `/\d/` (digit spelling) | — |
| `X5b-computed` | 1 | `PER FRAME` | same | — |
| `X5c` | 1 | `PER FRAME` | same | same |
| `WDYNIMP` | 1 | `AT LOAD` | same | same |
| `INLINE-TYPE` | 1 | `AT LOAD` + licence equality | same | — |
| `WINDIRECT` | 1 | licence equality only | same | — |
| `SECOND-COMPOSER` | 1 | tripwire `['cli-options.ts','render-seam.ts']` | same | same |
| `WGLYPH-DYN` | **0** | — (the recorded loss) | same | — |

**9 of 9 RED, BASE green, `WGLYPH-DYN` green. This agrees with the Engineer row for row.** The two
rows where the Engineer saw an extra `/\d/` red are his spelling, as he recorded himself.

## 2. QE's own builds (`ledger-qe-1.tsv`, `ledger-qe-2.tsv`, Node v26.11.0, load1 2.8–3.9)

| build | what is planted | result | reads as |
|---|---|---|---|
| `Q-PLY41-PANE` | `renderHistory`: dynamic import + derive only when `moves.length >= 41` | **GREEN** | docblock case 2 is true. The long game is exactly 40 plies |
| `Q-PLY40-PANE` / `Q-PLY17-PANE` | same at `>= 40` / `>= 17` | RED `PER FRAME` / RED | boundary exact |
| `Q-PANE-X5b` / `Q-STATUS-X5b` | `X5b` inside `renderHistory` / `renderStatusPanel` | RED `PER FRAME` / RED | the phase reaches producers, not only the seam closure |
| `Q-COMPOSER-NAMESPACE` | `cli-options.ts`: `import * as frameModule from "./frame.ts"` | RED tripwire | namespace counts |
| `Q-COMPOSER-ALIAS` / `-TYPE-FIRST` / `-MULTILINE` | `{ assembleFrame as compose }` / `{ type FrameParts, assembleFrame }` / brace list over 4 lines | RED tripwire ×3 | |
| `Q-COMPOSER-NEG-ALLTYPE` / `-NEG-OTHERVALUE` | `{ type FrameParts }` / `{ frameHeight }` | GREEN ×2 | correct: binds no `assembleFrame` |
| `Q-COMPOSER-SINGLEQUOTE` | `import { assembleFrame } from './frame.ts';` | GREEN on tests; **`biome check` exit 1** (formatter + unused import) | caught by the lint gate, not a gap |
| **`Q-COMPOSER-REEXPORT`** | `cli-options.ts`: `export { assembleFrame } from "./frame.ts"`; `glyph-mode.ts` imports `assembleFrame` from `./cli-options.ts` | **GREEN 23/23; biome exit 0; tsc exit 0** | **QE-053-a** |
| **`Q-COMPOSER-DYNAMIC`** | `cli-options.ts`: `(await import("./frame.ts")).assembleFrame` | **GREEN 23/23; biome exit 0; tsc exit 0** | **QE-053-a** |
| `Q-ROOT-RENAME` | `git mv render-seam.ts frame-seam.ts` + importers; constant unchanged | RED ×5: `root exists`, tripwire `['frame-seam.ts']`, `A8`, ENOENT in `render-seam.test.ts` | |
| `Q-ROOT-RENAME-FULL` | the same + `COMPOSITION_ROOT = "frame-seam.ts"` | RED ×4: `A9`'s root regex, `A8`, ENOENT | `A9` pins the name, as `A5` asks |
| `Q-FACTORY-RENAME-PROD` | `makeRenderSeam` → `buildRenderSeam` in production + importers, **not** in the child string | RED `probe child failed … makeRenderSeam is not a function` | fails loudly, not vacuously |
| `Q-FACTORY-RENAME` | the same rename in every file, the probe included | GREEN | a coherent refactor; correct |
| `Q-SETTLE-NEXTTICK` / `Q-SETTLE-MICROCHAIN` | import via `process.nextTick` / after an `O(plies)` `.then` chain | RED `PER FRAME` (+ `A6`'s `process.` row) / RED | microtasks drain before the first turn |
| `Q-SETTLE-IMM1` … `IMM3` | import inside 1–3 nested `setImmediate` | **RED** ×3 | |
| `Q-SETTLE-IMM4` / `IMM5` | 4 / 5 nested | **GREEN** ×2 | case 1 is true. Three turns reach depth 3 exactly |
| `Q-SETTLE-IMM1+ZERO` | depth 1, settle loop set to 0 turns | **GREEN** | the settle IS load-bearing for a macrotask-deferred import (QE-053-d) |
| `Q-ZERO-SETTLE+X5b` | `X5b`, 0 turns | RED (v26 and v24) | confirms `ADR-0029`: not load-bearing **for `X5b`** |
| `Q-SETTLE-TIMEOUT-NODELAY` | `setTimeout(() => import(…))`, no delay | RED, 6/6 repeats, plus on v24 | caught; timing-shaped in the mutant, not in BASE |
| `Q-SETTLE-TIMEOUT-50` | the same with a 50 ms timer, in the pane | GREEN | case 1 is true |
| `Q-UNICODE-ONLY` / `Q-BLACK-BOTTOM-ONLY` / `Q-THINKING-ONLY` / `Q-MESSAGES-ONLY` | the edge only on that mode / orientation / flag / non-empty messages | **GREEN ×4** | **QE-053-b**: not game states |
| `Q-CLAIMABLE-ONLY` | the edge only when `status` holds a claimable draw | GREEN | a game state; case 2 covers it |
| `Q-REDERIVE-GAMESTATUS` | seam calls `gameend.gameStatus(history.position)` per frame | RED only on `A2`'s `gameStatus` spy (3 calls) | case 3's parenthetical holds for this spelling |
| `Q-REDERIVE-REPLAY` | seam rebuilds repetition counts per frame with `parseFen` + `makeMove` + `zobristKey` | **GREEN 23/23** | case 3 is true; "only `A2`'s spies see that" does not hold for this spelling (QE-053-c) |
| `Q-ROWS-WITHOUT-ASSEMBLE` | `cli-options.ts` builds rows from `renderBoard`, no `assembleFrame` | GREEN | case 4 is true |
| `Q-FIXTURE-SPECIFIER` | the frame imports `./history.ts?fixture` + derive | GREEN | QE-053-f: a URL loaded before the clear is invisible |
| `Q-CTRL-DEAF-AFTER-LOAD+X5b` | the probe's hook stops recording after the load phase | RED `the probe is ARMED: expected []` | the arming-last control works |
| `Q-CTRL-ARMING-FIRST+DEAF+X5b` | the arming moved before the frames, the hook deaf after it | **GREEN** | QE-053-e: the order is held by structure only |

## 3. Repeats (`repeats.txt`, probe file only, 12 tests, load1 6.4–6.9)

- BASE: 6/6 green.
- `Q-SETTLE-TIMEOUT-NODELAY` and `Q-SETTLE-IMM3`: 6/6 RED each.
- `Q-SETTLE-IMM4`: 6/6 GREEN.
- **No flake in either direction.**

## 4. Node versions (`ledger-node24.tsv`, `/usr/local/bin/node` v24.12.0, load1 6.5–6.8)

Eleven builds were run:
- BASE, `X5b`, `X5b-CONDITIONAL`, `X5c`;
- `Q-ZERO-SETTLE+X5b`, `Q-SETTLE-IMM1+ZERO`, `IMM3`, `IMM4`;
- `Q-SETTLE-TIMEOUT-NODELAY`, `SECOND-COMPOSER`, `WDYNIMP`.

**Every result is identical to v26.11.0.** This closes the Engineer's `UNKNOWN - verify` for Node 24.
**Node 22 stays `UNKNOWN - verify`**: it is not installed on this machine.

## 5. Test note 2 (`diag-roots.txt`, the Engineer's `diag-roots.mjs` run on QE's BASE copy)

- `render-seam.ts`: closure 11 modules, `historyAtLoad: false`, frames `[23, 23]`.
- `turn-loop.ts`: closure 10 modules, `historyAtLoad: true`, so the probe is armed.
