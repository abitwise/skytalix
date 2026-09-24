---
id: 20260924T093300Z-qe-e2e-artifact-ref-abc118-qe-branch-raw-harnesses-and-what-was-not-touched-9e6f2a41
kind: artifact-ref
by: qe-e2e
at: 2026-09-24T09:33:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md
  - plans/traceability.md
  - .grugops/queue/done/qe-ABC-118.md
supersedes:
---

# `ABC-118` QE: where the work is

**Pointer note, no stamp.** It carries no `sha`, `gate_run` or `content_hash`, because there is no
`§14-gate` verdict on this install.

- **Branch:** `grugops/qe-ABC-118`, off `grugops/wave-2026-09-24` @ `162b2bd`. It is **unmerged and
  not deployed.** The branch has two commits: the claim, then the notes, the trace row, the
  ticket's `## QE` section and the queue move to `done/`.
- **Under test:** `tools/grugops/lane-inventory.js`. The build is `1d0ce2a` and the notes commit is
  `75e7357`. Both are already on `main` and on the wave base. The instrument is byte-identical
  between `75e7357` and the tip.
- **Raw evidence, beside this note:**
  - `raw-gates-tip-162b2bd.txt`, produced by `raw-gates-harness.mjs.txt`
  - `raw-probe-output.txt`, produced by `raw-probe-harness.mjs.txt`
  - `raw-a4-a5-a2-output.txt`, produced by `raw-a4-a5-a2-harness.mjs.txt`

  The probe harness rebuilds the copy from scratch. To re-run it:
  `node raw-probe-harness.mjs <scratchpad>/qe118-copy <checkout>`.
- **QE wrote nothing under:**
  - `src/` (zero lines) or `tools/`
  - `vitest.config.ts` (never edited here; every mutant was planted in the scratchpad copy)
  - `.grugops/test-skips.md` (read and run, never written)
  - `package.json`
  - `.claude/worktrees/*` (counted, never opened)
- **Never opened:** `plans/board.md`, `AGENTS.md` (only a `git grep -c` count was read) and
  `plans/nfr-catalog.md` (hashed inside node, and only the hash was printed).
- **Fenced and untouched:** `src/search.*`, `src/quiescence.*` and `src/engine.*` (`ABC-079`).
- **Owed elsewhere:**
  - The `AGENTS.md` `## Test integrity` line for `node tools/grugops/lane-inventory.js`. This is
    the Scribe's under `ABC-109`, and it is the only thing that gives the instrument a caller (G1).
  - The `A5` hash pin refresh, which is BA/PM's.
  - A one-clause correction of the Engineer's "exactly `test-skip-integrity.js`'s position"
    sentence, for whoever next holds that pen.
  - G2 to G6, which go to BA/PM to cut or fold.
- **UAT:** measured from git, `git diff --numstat 129f53d 75e7357 -- src/` is empty. There are
  zero production lines, so **the 2026-08-17 waiver applies**. The Orchestrator records that at
  the exit.
