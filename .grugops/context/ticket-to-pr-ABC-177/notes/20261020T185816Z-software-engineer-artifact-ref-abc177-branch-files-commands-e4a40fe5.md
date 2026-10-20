---
id: 20261020T185816Z-software-engineer-artifact-ref-abc177-branch-files-commands-e4a40fe5
kind: artifact-ref
by: software-engineer
at: 2026-10-20T18:58:16Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-177
refs: [ABC-177, ADR-0046, EPIC-007]
supersedes:
---

# `ABC-177` artifacts

- **Branch:** `grugops/ABC-177` from `ff1e375f`, tip **`f81bf03c`**. Worktree `../wt-ABC-177`, kept for review, with a
  `node_modules` symlink (ignored). Not pushed, not merged.
- **Changed:** `src/uci-session.test.ts` only, +16/−14.
- **Tests:** none added or removed (126 → 126). U1 was restructured (A1). Seven step literals changed.
- **Probe** (`.grugops/context/ticket-to-pr-ABC-177/probe/`):
  - the freeze: `freeze.mjs`, `frozen-mutants.json`;
  - the parity harness and its readings: `mut.mjs`, `units.mjs`, `parity.mjs`, `kill-*.jsonl`,
    `parity-base-vs-tip.out`;
  - the census: `census.mjs`, `cens.mjs`, `census-*.tsv`, `census-base-vs-tip.out`;
  - the armed reds: `red.mjs`;
  - the A3 name lists: `sorted-*.txt`.
  - Every census instrumentation edit lived in scratch only.
- **Commands run (counts only, no timing):**
  - `npm test` at base and tip;
  - `npm run lint`, `typecheck` and `build`;
  - `test-skip-integrity.js --skip-count 0`;
  - the `CLI_DEEP` and `PERFT_DEEP` lanes;
  - 2 × 146 single-file mutant runs;
  - 2 census runs;
  - 2 armed-red runs;
  - 1 M4-sweep plant run.
- **Not done (QE's):** `N8-LANE` (A8), the full-lane twin (A9/A10/A11). Any `NFR-008` reading must be on AC power
  (owner, OQ-177-1 = YES).
- **Docs:** none touched. `plans/board.md` and `plans/traceability.md` were not edited (brief fence). The trace row is
  in the done file for the Orchestrator.
