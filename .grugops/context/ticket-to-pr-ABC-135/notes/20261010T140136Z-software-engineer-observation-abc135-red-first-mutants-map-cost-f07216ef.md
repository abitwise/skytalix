---
id: 20261010T140136Z-software-engineer-observation-abc135-red-first-mutants-map-cost-f07216ef
kind: observation
by: software-engineer
at: 2026-10-10T14:01:36Z
verified_by:
confidence: high
refs:
  - ABC-135
  - QE-054-a
  - QE-054-c
  - M-SINGLE-LINE
  - M-FIRST-STATEMENT-ONLY
  - N8-LANE
  - ADR-0035
  - src/render-seam.test.ts
  - .grugops/context/ticket-to-pr-ABC-135/notes/raw-out-mutants.txt
  - .grugops/context/ticket-to-pr-ABC-135/notes/raw-a3-map-tip.txt
  - .grugops/context/ticket-to-pr-ABC-135/notes/raw-cost-readings-1-n8.tsv
  - .grugops/context/ticket-to-pr-ABC-135/notes/raw-cost-readings-2-n12.tsv
supersedes:
---

# `ABC-135` readings: red first, mutants red only at the tip, the map is unchanged, cost is MET

Hand-authored, no seal. Apple M3, Node v26.11.0. Base `5c17d1ed` (wave tip), code `b09d880`.
Mutants and cost ran in `git archive` copies in a private scratchpad, with `node_modules`
symlinked, and never in the worktree.

## Premise, re-verified at `5c17d1ed` before editing

`git diff 35ad336b..5c17d1ed -- src/` touches only `src/cli.test.ts`, so the instrument is
byte-unchanged. BA/PM's `probe/a8.mjs` prints `true` for all six rows (four over-counts, two
properties held). `probe/map.mjs src` gives 35 modules, 92 consumer pairs and 12 multi-line files.
`probe/strip-check.mjs src` gives 1,190 pairs with `differ: []`. No unmerged branch touches the file.

## Red first (`A1`)

With the six rows added and the instrument unchanged, the new `it` failed:
`import { /* c */ type X } from "./m.ts";: expected true to be false`. The result was 1 failed / 12 passed.
With the strip in place, 13 passed.

## Mutants (`A1`, `A2`). Command: `npx vitest run src/render-seam.test.ts`

| mutant | base `5c17d1ed` (12 tests) | tip `b09d880` (13 tests) |
|---|---|---|
| pristine | 12 passed | 13 passed |
| `M-SINGLE-LINE` (`[^;"]` → `[^;"\\n]`) | **12 passed (survives)** | **1 failed**: the multi-line mixed brace row, `expected false to be true` |
| `M-FIRST-STATEMENT-ONLY` (`.slice(0, 1)` before `.some`) | **12 passed (survives)** | **1 failed**: `import type { X } …\nimport { f } …`, `expected false to be true` |
| `M-NO-STRIP` (`withoutComments(source)` → `source`, tip only) | n/a (this is the base) | **1 failed**: `import { /* c */ type X } …`, `expected true to be false` |

Every failure is in the new `it` only. `A8`'s headline and the eight-spelling test stay green under
all three mutants.

## Real-tree map (`A3`)

`raw-a3-map.mjs.txt` lifts `withoutComments` + `bindsAValueFrom` **verbatim** from each tree's
`src/render-seam.test.ts` and runs them over every ordered pair of the 35 production modules at the tip.
- Base: 1,190 pairs, 92 consumers, no strip.
- Tip: 1,190 pairs, 92 consumers, with the strip.
- The two 1,190-line maps are byte-identical (sha256 `a8da4a9d…99dc1`).
- `render-seam.ts` is a consumer of `render.ts`, `status-panel.ts` and `history-pane.ts`.

## Cost (`ADR-0035` decision 2, narrow set = `src/render-seam.test.ts`)

The arms are A = base, B = tip and N = a `/usr/bin/diff -r -x node_modules`-identical twin of A. CPU is
user + sys. Each run is one fresh process, the order rotates, round 0 is discarded, counts are
asserted (12 / 13 / 12), and load1 is logged before every run.
- **Reading 1 (n = 8, k = 2), load1 9.9–15.5:** base median 1.15 s. Twin −25 ms (−2.17 %, 3+/5−),
  R 50 ms. **Inadmissible** (over 1.5 %). Tip +5 ms, interval [−10, +40] ms.
- **Reading 2 (n = 12, k = 3), load1 8.2–10.8 (median 8.7):** base median 1.19 s. Twin −10 ms (−0.84 %,
  4+/7−/1=), R **40 ms**, **admissible**. Tip −15 ms (−1.26 %, 4+/7−/1=), interval [−70, +20] ms,
  R 70 ms. Tip minus twin: −5 ms.
- **`N8-LANE` (650 ms CPU net): MET** on reading 2. It is admissible, R 40 ms ≤ 650 ms, and the
  treatment median −15 ms ≤ 650 ms. No file was added, so the floor account charges 0 × 160 ms.
