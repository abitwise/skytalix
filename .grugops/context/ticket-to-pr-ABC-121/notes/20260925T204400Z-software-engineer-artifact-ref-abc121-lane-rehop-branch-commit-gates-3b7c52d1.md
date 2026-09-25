---
id: 20260925T204400Z-software-engineer-artifact-ref-abc121-lane-rehop-branch-commit-gates-3b7c52d1
kind: artifact-ref
by: software-engineer
at: 2026-09-25T20:44:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - N8-LANE
  - src/search.pvs-lmr.test.ts
sha: 6c1e8952f7806d04b223db0406bf0ab3257ee619
gate_run:
content_hash:
supersedes:
---

# `N8-LANE` re-hop: branch, commit, gates as run

Hand-authored. There is no gate verdict id to cite (`AGENTS.md`: no sanctioned writer on this
install), so `gate_run` is empty.

- **Branch:** `grugops/ABC-121-lane`, from `66afd16` (tip of `grugops/ABC-121-pvs-lmr`), in worktree
  `.claude/worktrees/ABC-121-lane`. **Not merged, not pushed.**
- **Code commit:** `6c1e895`. Numstat: `25	11	src/search.pvs-lmr.test.ts`. That is test-only;
  **0 production lines**.
- **Gates at `6c1e895`, each run once in the worktree:**
  - `npm test`: exit 0, 48 files, 1 466 passed (1 467 at the build; one row moved deep).
  - Skip count 0 (`--reporter=json`: `numPendingTests + numTodoTests`).
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`
  - `npm run lint`: clean, 85 files.
  - `npm run typecheck`: exit 0.
- **Deep lane:**
  - `SEARCH_DEEP=1 … -t "seven seeds|kp-vs-k|all 287|engine doors|A4|length pin"`: 7 passed. The
    287 mate floor read 0 of 180 violated.
  - `SEARCH_DEEP=1 … -t "seven seeds|PVS identity|length pin"`: 7 passed, the 190 d4 identity
    included (125 s under load).
  - **The d5 drift and d7 companion rows were NOT re-run.** Their code is untouched by this diff:
    `UNKNOWN - verify` at QE.
- **Measurements:** `…e1e4a69f` (attribution), `…17a0830d` (ledger), `…e4d6fcc8` (`N8-LANE`).
  Placement: `…9bdce84b`.
