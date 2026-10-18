---
id: 20261018T143000Z-software-engineer-decision-a3-split-per-root-5a1f70c2
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-170-fix
at: 2026-10-18T14:30:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-170-fix
  - ABC-170
  - QE-170-a
  - NFR-008
  - 20261018T132300Z-qe-e2e-decision-abc170-verdict-pass-with-gaps-09d90757
supersedes:
---

# QE-170-a: `ABC-170 A3` is split into one row per perft root. No per-row timeout was added

This note is hand-authored and unsealed. No timing reading was taken, and A6 stays OPEN.

- **Why split:** A3 already runs on `tickingClock(1)`, the virtual clock. Each side of the identity needs its own fresh run,
  so none of the twelve searches can be shared, and there is no redundant setup to drop (only `parseFen`). The row's cost
  is the searches themselves. The way to bring the cost down without touching what A3 asserts is one `it` per root,
  generated from `PERFT_CORPUS`.
- **What is unchanged:** the 50 ms budget, the six roots, both call shapes (absent, and `maxDepth: 1000, maxNodes:
  MAX_SAFE_INTEGER`), and `toEqual` over `{ name, ...result }`.
- **Why there is no per-row timeout:** it isn't needed. The largest row is 522 ms isolated and 718 ms in the full lane,
  against the 5 s default.
- **The kill still holds:** I applied QE's M15 mutant to the worktree only (`if (options.maxNodes === undefined) now();`
  after `start`). All 6 rows went red. I then restored `src/engine.ts`, with md5 `3ce3a251…` before and after.
- **The lane's total cost does not change** (about 2.7 s summed), because the work is the same. Its `NFR-008` delta is
  `UNKNOWN - verify` at the gate's `N8-LANE` measurement.
