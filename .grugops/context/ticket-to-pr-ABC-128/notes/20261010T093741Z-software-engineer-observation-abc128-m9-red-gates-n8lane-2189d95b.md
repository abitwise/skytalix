---
id: 20261010T093741Z-software-engineer-observation-abc128-m9-red-gates-n8lane-2189d95b
kind: observation
by: software-engineer
at: 2026-10-10T09:37:41Z
verified_by:
confidence: high
refs:
  - ABC-128
  - M9
  - N8-LANE
  - NFR-008
  - src/turn-loop.test.ts
  - .grugops/context/ticket-to-pr-ABC-128/notes/raw-out-m9-base.txt
  - .grugops/context/ticket-to-pr-ABC-128/notes/raw-out-m9-tip.txt
  - .grugops/context/ticket-to-pr-ABC-128/notes/raw-out-n8-lane-full.tsv
  - .grugops/context/ticket-to-pr-ABC-128/notes/raw-out-n8-lane-turn-loop-file.tsv
supersedes:
---

# `ABC-128` readings: `M9` survives the base and dies on exactly 3 rows at the tip; gates green; `N8-LANE` 0 new files

Hand-authored, no seal. Apple M3. Every `M9` run was in a `git archive` copy in a private scratchpad
(`node_modules` symlinked), planted with BA/PM's `edit-probe.mjs mut` (unique anchor at
`src/turn-loop.ts:383`), never in the worktree.
Command: `npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts`.

## `M9`, before and after (`A1`)

| tree | `turn-loop.ts` | result |
|---|---|---|
| base `fcbf06b` | shipped | 2 files, **67 passed** |
| base `fcbf06b` | `M9` | 2 files, **67 passed**. The mutant survives |
| tip test file | `M9` | **3 failed / 64 passed**: `ABC-120` `A3`, `A4`, `A5`, each `AssertionError: expected "keyHistory" to be called +0 times, but got 1 times`. No other row fails |
| tip test file | shipped (`cmp`-identical to worktree) | 2 files, **67 passed** |

## Gates, in the worktree at the code commit

`npm run lint` exit 0 (97 files). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test`
exit 0, **50 files / 1540 passed**. Skip count (`vitest --reporter=json`, pending + todo) **0**.
`test-skip-integrity.js … --skip-count 0`: **`No findings.`**, exit 0. The base `fcbf06b` reads the
same totals (1540 / 50 / 0), so 0 new `it` and 0 new files (`A3`).
`grep -c 'nowhere else' src/turn-loop.test.ts` prints **0** (`A2`).

## `N8-LANE`

**Scope per `plans/nfr-catalog.md` is the files the branch adds under `src/`: none. 0 new files, so the
net charge is 0 ms by the catalog's own definition. No reading came near 650 ms of content cost.**
Two paired, interleaved, order-rotated runs were taken (A = base, B = tip, N = `cmp`-identical base
copy; round 0 discarded):

- **Full default lane** (`npx vitest run`, `PERFT_DEEP` unset), 7 rounds: tip **+590 ms** (+1.74 %,
  sign 4/7), null **+620 ms** (+1.76 %, sign 6/7). **Inadmissible**: the null is above the catalog's
  1.5 % bound and its sign is not at chance. load1 rose from 17 to 44 during the run (other QE
  lanes running). Base median 34.6 s CPU.
- **The touched file only** (`npx vitest run src/turn-loop.test.ts`), 9 rounds: tip **+30 ms**
  (sign 5/9), null **+30 ms** (+1.46 %, sign 7/9). Tip minus null is about 0. Base median 2.06 s CPU.

An admissible full-lane figure is `UNKNOWN - verify` on a quiet machine. Not re-run here, because the
branch adds no file and the content is three spy reads.
