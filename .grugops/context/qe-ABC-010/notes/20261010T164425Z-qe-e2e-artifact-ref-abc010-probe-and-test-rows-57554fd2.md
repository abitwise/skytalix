---
id: 20261010T164425Z-qe-e2e-artifact-ref-abc010-probe-and-test-rows-57554fd2
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T16:44:25Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - QE-010-a
  - src/fen.test.ts
  - 20261010T164425Z-qe-e2e-decision-abc010-verdict-pass-with-gaps-40ccc992
supersedes:
---

# `ABC-010` QE artifacts: QE's probe directory and the 22 test rows added to `src/fen.test.ts`

Hand-authored and unsealed.

- **Tests added (test-only, ticket branch):** `src/fen.test.ts`, describe "FEN semantic rejection — every right,
  both colours, black to move (QE)". It holds 16 `it.each` rejection rows (exact anchored messages) and 6 accept
  controls that round-trip. It closes `QE-010-a`. The diff is additions only, with 0 lines deleted and 0 new files.
- **Probe:** `.grugops/context/qe-ABC-010/probe/`. `RUN.txt` lists every command, stamp and load1. QE's scripts:
  - `qe010-harness.mts`: the independent oracle, fuzz, play corpus and production corpora;
  - `qe010-mutants.mjs`: 30 mutants against the whole suite plus the harness;
  - `qe010-nfr002.mts`: the per-call parse cost, base against head, in one process;
  - `qe010-deep-lanes.sh`: the five lanes, sequential, with exit, wall and load1;
  - `qe010-count-derives.mts`: the six-queens derive count;
  - `qe010-fullmove-bound.mts`: the fullmove values `parseFen` accepts.

  Every script reads `<tree>/src` only and writes nothing in any tree, except the mutant runner. That one rewrites
  `fen.ts` in an out-of-tree scratch copy and restores it byte-exact, which `cmp` checked.
- **Outputs:**
  - harness: `harness-head-2344c015.out.txt`, `harness-head-2344c015-seed777.out.txt` and
    `harness-base-be37e222.out.txt` (red-first);
  - mutants: `mutants-2344c015.tsv`, `mutants-closed-by-qe-rows.tsv`;
  - lanes: `deep-lanes.log`, `deep-puzzle.summary.txt`;
  - NFR: `nfr002.out.txt`, `perft-nfr001.out.txt`;
  - the rest: `fen-scan.2344c015.out.txt` (9(d)), `six-queens-derives.out.txt`, `fullmove-bound.out.txt`.
