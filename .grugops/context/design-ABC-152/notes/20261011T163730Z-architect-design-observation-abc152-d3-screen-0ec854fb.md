---
id: 20261011T163730Z-architect-design-observation-abc152-d3-screen-0ec854fb
kind: observation
by: architect-design
at: 2026-10-11T16:37:30Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - .grugops/context/design-ABC-152/probe/METHOD.md
  - .grugops/context/design-ABC-152/probe/screen.mjs
  - .grugops/context/design-ABC-152/probe/f1-rewrites.mjs
  - .grugops/context/design-ABC-152/probe/f2-explore.mjs
  - .grugops/context/design-ABC-152/probe/f3-explore.mjs
  - .grugops/context/design-ABC-152/probe/raw/
supersedes:
---

# `ABC-152` `D3` screen: 4.1.11 runner on is red 2; runner off is red 98 in 13 files; the declared rewrites leave 91 in 10

This note is hand-authored and unsealed. **Correctness only: no wall, CPU or duration was read.** load1 was
5.45–14.75 where it was logged (before A0, A1, A2, S1 and F1), and `thermalpressurelevel` was 1 each time. Three hops ran in parallel.

| arm | exit | files | tests | failed | red files | unfinished |
|---|---|---|---|---|---|---|
| A0 base 3.2.7 | 0 | 56 | 1740 | 0 | 0 | 0 |
| A1 4.1.11 runner on | 1 | 56 | 1740 | 2 | 1 | 0 |
| A2 4.1.11 runner off | 1 | 56 | 1723 | 98 + 2 suites | 13 | 0 |
| S1 A2 on vite 8.3.4 | 1 | 56 | 1723 | 98 + 2 suites | 13 (same) | 0 |
| F1 A2 + R1–R3 | 1 | 56 | 1723 | 91 + 2 suites | 10 | 0 |
| F2 post-hoc + R4 | 1 | 56 | 1740 | 20 | 3 | 0 |
| F3 post-hoc + R5 | 1 | 56 | 1740 | 1 (`san.test.ts` A20) | 1 | 0 |

- **A1:** `command-input.test.ts` "ABC-036 A4 … position-3 / position-6".
  - The cause: on 4.1.11, `vi.fn(m)` returns `m` itself when `m` is already a mock.
  - Probe `raw/fnwrap-probe.txt`: 3.2.7 reads `outer=1` (exit 0); 4.1.11 reads `outer=4 same=true` (exit 1).
- **A2's red files:**
  - **R1:** `cli` 1 and `render-seam` 3, namespace `vi.spyOn`.
  - **R3:** `command-input` 2, as in A1.
  - **Circular factory:** `command-input` 13, `deps.legalMoves is not a function`, because
    `src/move-input.ts:108` captures `legalMoves` at load.
  - **Factory mock + top-level `await import()`:** `gameend.nfr` 3, `glyph-mode.nfr` 2,
    `history-pane.nfr` (suite), `san.nfr` (suite), `status-panel.nfr` 6, `turn-loop.nfr` 4, `turn-loop` 59,
    `zobrist.nfr` 3.
  - **Key order:** `san` 1, A20.
  - **R2:** `tools/opening-book/book` 1, D1(f).
- **F1 fixed** `cli`, `render-seam` and `book` D1(f). `expect(` counts are equal (`raw/f1-rewrites.out.txt`).
- **F2/F3 are post-hoc and rule nothing.**
  - R4: 33 top-level imports in 8 files become static.
  - R5: 7 call-through factories in 2 files become `{ spy: true }`.
  - The result is 1739 / 1740, never plant-checked.
  - The collected path list equals A0's (56 paths).
- **The lane finished in every arm** (C4 on 3.2.7 did not).
