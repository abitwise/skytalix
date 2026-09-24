---
id: 20260924T201800Z-qe-e2e-artifact-ref-abc046-delta-qe-branch-commands-raw-harnesses-and-what-was-not-touched-eea1aead
kind: artifact-ref
by: qe-e2e
at: 2026-09-24T20:18:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-046-delta.md
supersedes:
---

# `ABC-046` delta re-QE: the branch, the commands, the raw files, and what this hop did not touch

**NOT A STAMP.** No `sha`, `gate_run` or `content_hash` is claimed against a live green `§14-gate`
verdict. This note is a pointer only. A note cannot name the commit that contains it, so this hop's
commit sha is in the commit itself and in the report to the Orchestrator.

- **Branch:** `grugops/qe-ABC-046-delta`, off `grugops/wave-2026-09-24` @ `9aec523`, which carries
  re-hop `85b66c6` via merge `d8de765`. **Unmerged.**
- **Claim (Workflow 17, by hand, BEFORE any probe or gate):**
  - The atomic act was a bare `mkdir .grugops/queue/claimed/qe-ABC-046-delta`, which returned
    success at 2026-09-24T20:09:23Z.
  - The record was written to `claim.md`, and the subtask file moved by `git mv`.
  - The claim was committed alone, first, then pending → claimed → `done/qe-ABC-046-delta.md` +
    `done/qe-ABC-046-delta.claim.md`.
  - The brief's `enqueued_at` (22:30Z) is later than the claim's wall clock. That looks like local
    time labelled Z. It is recorded in the claim record and was not corrected.
- **Commands run from the worktree root, all through node scripts:**
  - `node raw-delta-gates-harness.mjs <wt>`: `npx biome check .`; `npx tsc --noEmit` ×2;
    `npx vitest run --dir src`; the same with `--reporter=json`; then
    `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
  - `node raw-delta-harness.mjs <wt>`:
    - the docblock probe (3 rounds);
    - 10 mutants + control, each followed by `tsc`, three `vitest run <file>` and the sequence probe;
    - bar 2 in both lanes;
    - the two entry-point runs.
  - `node raw-delta-count.mjs <wt>`: the non-comment production line count of `5d0fdb0..85b66c6`.
- **Raw files, next to this note:**
  - `raw-delta-gates-harness.mjs.txt`, `raw-delta-gates-summary.json.txt`
  - `raw-delta-harness.mjs.txt`, `raw-delta-summary.json.txt`, `raw-delta-console.txt`
  - `raw-delta-entry-quit-over-quit-EOF.stdout.txt`, `raw-delta-entry-quit-over-quit-quit.stdout.txt`
  - `raw-delta-count.mjs.txt`
- **Published:**
  - three notes in this directory: a `decision` that supersedes `d74bb036`, an `observation`, and
    this `artifact-ref`;
  - one row, `ABC-046 (qe delta)`, and one `_Updated` line in `plans/traceability.md`;
  - `## QE (delta) 2026-09-24`, appended at the end of `plans/tickets/ABC-046-quit-and-new.md`, with
    nothing above it touched.
- **Not touched:**
  - every file under `src/`: 0 lines, with all 14 rounds restored and sha256 asserted;
  - `src/search.*`, `src/quiescence.*`, `src/engine.*`: not opened, and only `git diff --stat`
    checked them;
  - `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`: not opened.
- **Not ruled:** `NFR-008`.
- **Not done:**
  - no test was added;
  - no sentence was corrected: `G4-INFO` and `G5-INFO` are named only (`ABC-114`);
  - nothing was merged or deployed.
- **Lane:** QE adds 0 files, 0 rows and 0 children.
