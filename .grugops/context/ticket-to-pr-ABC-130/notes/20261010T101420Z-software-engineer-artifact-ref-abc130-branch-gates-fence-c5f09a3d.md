---
id: 20261010T101420Z-software-engineer-artifact-ref-abc130-branch-gates-fence-c5f09a3d
kind: artifact-ref
by: software-engineer
at: 2026-10-10T10:14:20Z
verified_by:
confidence: high
refs:
  - ABC-130
  - branch:grugops/ABC-130-lane-inventory-probes
  - commit:adff124e
  - tools/grugops/lane-inventory.js
supersedes:
---

# `ABC-130` built: branch `grugops/ABC-130-lane-inventory-probes`, code `adff124`, one file

Hand-authored, no seal. Base `b62d1b6` (`grugops/wave-2026-09-25`). Not merged, not pushed.

- **A5:** `git diff --numstat <wave>...HEAD -- src/ tools/ vitest.config.ts package.json AGENTS.md
  plans/nfr-catalog.md` gives `26 4 tools/grugops/lane-inventory.js`, the only line.
  `-- '.grugops/context/*/probe/'` gives empty output. The four probes are byte-identical.
- **A6 gates at the tip (worktree):** lint 0 (97 files), typecheck 0, build 0. `npm test` 0, with
  50 files / 1540 passed / 0 skipped. `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
  `lane-inventory.js`: before (base) exit 1 at 50/53, after (tip) exit 0 at 50/50.
- **N8-LANE:** 0 files under `src/`, so 0 ms by scope. **N8-SPAWN:** 0. **NFR-008:** not touched.
- **Owed:** the QE hop, the `In Review` move (Orchestrator) and the merge. There are 0 `src/` lines,
  so the UAT waiver should apply, measured at merge. Once this merges, `ABC-119` `A2`(i) reads as the
  literal exit 0.
