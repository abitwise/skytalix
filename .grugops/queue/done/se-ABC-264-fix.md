---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T01:55:14Z
subtask: se-ABC-264-fix
role: software-engineer
ticket: ABC-264
ref: .grugops/context/se-ABC-264-fix/
branch: continue on grugops/qe-ABC-264 (1dede4f2) — worktree .claude/worktrees/qe-ABC-264 already exists; work there on a new branch grugops/ABC-264-fix created from grugops/qe-ABC-264
width: tests under `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; never bare npx.
---
# SE: close QE-264-a — one test row pinning chooseMoveWithoutReverseFutility's priorKeys
qe-ABC-264 gaps note (…3a95d391 on grugops/qe-ABC-264): plant QP6 (new engine door with priorKeys: false) survives every lane. Add one row (test-only) that turns red under QP6 and green at head; prove both (plant out of tree, restore byte-exact). Gates: lint/typecheck, npm test (expect 2 404), skip-integrity, lane inventory. No production change.
## Fences
One test file; no src production edits; no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Queue moves inside the worktree.
## Publish
Sealed notes (task se-ABC-264-fix, contextRoot = that worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result

**DONE: QE-264-a closed by one test row. No production change.** Software Engineer, branch `grugops/ABC-264-fix` (worktree `.claude/worktrees/qe-ABC-264`, created from `grugops/qe-ABC-264` at `1dede4f2`).

- **The row** (`src/engine.test.ts`, +18 lines, in `describe("ABC-230 A3 and A4 — ...")`): `ABC-264's door reads prior keys, as chooseMove does: the A1 repetition at 0 with them, not without (QE-264-a)`.
  - Given the KQ v K fixture's prior keys at fixed depth 4, `chooseMoveWithoutReverseFutility` must return `{ d8e8, 0 }`.
  - Without the keys, it must not play `d8e8` and must not score 0.
- **Plant QP6** (`priorKeys: false` in the door, applied from a copy held outside the tree):
  - Under the plant the row is **red**: rc=1, `expected { move: 'd8c8', score: -1006 } to deeply equal { move: 'd8e8', score: +0 }`.
  - `src/engine.ts` was restored byte-exact: sha256 `172df0b0…` before and after.
  - At head the row is **green**: rc=0, `1 passed | 65 skipped (66)`.
- **Gates** (each under the host-test flock):
  - lint rc=0;
  - typecheck rc=0;
  - `npm test` rc=0, **2 404 / 2 404**, 64 files;
  - skip-integrity rc=0 (skip count 0);
  - lane inventory rc=0 (64/64).
  - A first skip-integrity call without the registry argument exited 2. It was re-run with the argument and is recorded in the gates note.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, task `se-ABC-264-fix`; 4 of 4 read back):
  - decision `20261102T015750Z-software-engineer-decision-6d2969b1`;
  - plant `…observation-ed19497e`;
  - gates `…observation-bffb5025`;
  - artifacts `…observation-f7336121`.
- **Commits:**
  - claim `d47bc40e`;
  - test `bcc82866`;
  - notes `19e66a80`;
  - then this closing commit.
- **Open, not this brief:** QE-264-b (records; Architect / BA-PM), QE-264-c/d/e (INFO).
- Not pushed, not merged. Nothing left running.

### Trace row (10 cells, header order)

| se-ABC-264-fix | Close QE-264-a: one row pins chooseMoveWithoutReverseFutility's prior keys (A1 repetition at 0 with keys, not without) | EPIC-011 | ADR-0059 (unchanged), ADR-0054 | none touched | `grugops/ABC-264-fix` (test `bcc82866`; notes `19e66a80`) | npm test 2 404, skips 0; plant QP6 red, head green; lint/typecheck/skip-integrity/lane inventory green | no production change; UAT unaffected | QE-264-a closed; QE-264-b open (records) | SE done; for QE/Orchestrator to fold into ABC-264 |
