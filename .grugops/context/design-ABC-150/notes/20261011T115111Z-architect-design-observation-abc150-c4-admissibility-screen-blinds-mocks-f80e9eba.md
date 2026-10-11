---
id: 20261011T115111Z-architect-design-observation-abc150-c4-admissibility-screen-blinds-mocks-f80e9eba
kind: observation
by: architect-design
at: 2026-10-11T11:51:11Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ADR-0041
  - ADR-0008
  - NFR-001
  - NFR-005
  - .grugops/context/design-ABC-150/probe/lane-screen.config.mjs
  - .grugops/context/design-ABC-150/probe/lane-screen.mjs
  - .grugops/context/design-ABC-150/probe/graph-check.mjs
  - .grugops/context/design-ABC-150/probe/raw/lane-screen.json.txt
  - .grugops/context/design-ABC-150/probe/raw/graph-check.out.txt
supersedes:
---

# `ABC-150` `D3` screen: C4 (`src/` externalized) turns **12 files / 47 tests red and the lane never finishes**. The only graph-safe narrowing is 2 data files

This note is hand-authored and unsealed. It records correctness only: **no wall or CPU figure was taken**. Per-test
durations were stripped before the raw file was written. It is not an `L` reading.

- **The method:** the full default lane, through `probe/lane-screen.config.mjs`. That config is the unchanged
  `vitest.config.ts` with one layer. It ran unprofiled, never through `npm test`.
- **The control** (nothing layered): exit 0, **55 files, 1728 tests, 0 failed, 0 skipped**.
- **C4, first run:** killed by the driver's 300 s guard, with no result file.
- **C4, second run**, console captured, killed at 240 s:
  - 38 files green;
  - **12 files red, 47 tests**: `cli`, `command-input` (8), `gameend.nfr` (2), `history-pane.nfr` (2),
    `levels`, `render-seam` (3), `san.nfr` (2), `san`, `search.ordering` (2), `status-panel.nfr` (5),
    `turn-loop.nfr` (4), `turn-loop` (16).
  - Every failure is a call-count or mock-routing assert, for example `expected "squareAt" to be called N
    times`, `"gameStatus"`, `"toSan"`, `"zobristKey"` and `"legalMoves"`.
  - **These never finished:** `engine.capacity`, `search.capacity`, `search.pvs-lmr`, `transposition` and
    `tools/opening-book/book.test.ts`. The first four mock `search`, `zobrist` or `transposition` to stay small.
- **The mechanism:** a natively imported module imports its dependencies natively, so `vi.mock` and
  `vi.spyOn(ns, …)` on them no longer see its calls. It is the same failure class as `ADR-0008` decision 7.
- **The graph check** (`graph-check.mjs`, static):
  - **17 modules are mocked or namespace-spied** by the lane.
  - **Only `puzzle-corpus.ts` and `search.mate-corpus.ts`** are outside that set with every import also
    outside it.
  - Every hot module is mocked itself, or imports one that is (`moves.ts` imports `position.ts`, which
    `status-panel.nfr` mocks).
  - So **no narrowing of C4 reaches the engine and keeps the guards armed.**
