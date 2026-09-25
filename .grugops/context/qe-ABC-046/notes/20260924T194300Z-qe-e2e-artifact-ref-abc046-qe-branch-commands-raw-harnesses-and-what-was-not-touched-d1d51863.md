---
id: 20260924T194300Z-qe-e2e-artifact-ref-abc046-qe-branch-commands-raw-harnesses-and-what-was-not-touched-d1d51863
kind: artifact-ref
by: qe-e2e
at: 2026-09-24T19:43:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-046.md
supersedes:
---

# `ABC-046` QE: the branch, the commands, the raw files, and what this hop did not touch

**NOT A STAMP.** No `sha` / `gate_run` / `content_hash` is claimed against a live green `§14-gate`
verdict. This is a pointer only. The commit sha of this hop is in the commit and the Orchestrator's
report, not here, because a note cannot name the commit that contains it.

- **Branch:** `grugops/qe-ABC-046`, created off `grugops/wave-2026-09-24` @ `162b2bd`. That base
  carries the build `6cdde15` and its notes `c8f005f` via merge `8b5114c`. **Unmerged.**
- **Claim (Workflow 17, by hand):** `mkdir .grugops/queue/claimed/qe-ABC-046` (atomic), record
  `qe-ABC-046.claim.md` (`by: qe-e2e`, `at: 2026-09-24T19:27:53Z`), subtask file
  pending → claimed → `done/qe-ABC-046.md`.
- **Commands run** (from the worktree root):
  - `node raw-gates-harness.mjs <wt>`: `npx biome check .`; `npx tsc --noEmit` ×2;
    `npx vitest run --dir src`; the same with `--reporter=json`; then
    `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
  - `node raw-mutants-harness.mjs <wt>`: 18 mutants + control, each followed by `tsc` and three
    `vitest run <file>`.
  - `node raw-edges-loop-harness.mjs <wt>` (24 checks).
  - `node raw-edges-cli-harness.mjs <wt>` (15 checks, children of `node src/cli.ts`).
  - `node raw-docblock-probe.mjs <wt>`.
- **Raw files, next to this note:**
  - `raw-gates-harness.mjs.txt`, `raw-gates-summary.json.txt`
  - `raw-mutants-harness.mjs.txt`, `raw-mutants-summary.json.txt`, `raw-mutants-console.txt`
  - `raw-edges-loop-harness.mjs.txt`, `raw-edges-loop-summary.json.txt`
  - `raw-edges-cli-harness.mjs.txt`, `raw-edges-cli-summary.json.txt`
  - `raw-docblock-probe.mjs.txt`, `raw-docblock-probe-summary.json.txt`
- **Published:**
  - four notes in this directory (`decision`, 2 × `observation`, this `artifact-ref`);
  - one row `ABC-046 (qe)` + one `_Updated` line in `plans/traceability.md`;
  - `## QE` on `plans/tickets/ABC-046-quit-and-new.md`, appended at the end, nothing above it
    touched.
- **Not touched:**
  - every file under `src/` (0 lines; all 19 mutant rounds restored, sha256 asserted);
  - `src/search.*`, `src/quiescence.*`, `src/engine.*` (not opened: `ABC-079` is live);
  - `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` (not opened).
- **Not ruled:** `NFR-008`.
- **Not done:** no test added, no false sentence corrected (`ABC-114`), nothing merged, nothing
  deployed.
- **Lane:** QE adds 0 files, 0 rows and 0 children. `N8-LANE` is unchanged by this hop.
