---
id: 20261101T161512Z-qe-e2e-observation-abc0c345
kind: observation
by: qe-e2e
at: 2026-11-01T16:15:12Z
verified_by: 
confidence: high: commands and outputs as run (raw/gates/, raw/mutants/); every run under flock host-test.lock
refs:
  - qe-ABC-249
  - ABC-249
  - EPIC-010
  - ADR-0054
  - QE-248-c
  - QPLY4
  - grugops/ABC-249
  - grugops/qe-ABC-249
  - 25371747
  - dd66bfee
  - 09d1f675
  - se-ABC-249/20261101T152620Z-software-engineer-decision-bcb0e207
  - se-ABC-249/20261101T152620Z-software-engineer-observation-67c090b7
  - se-ABC-249/20261101T152620Z-software-engineer-observation-3bbfaabc
  - A4
  - A6
  - UAT-waiver
  - src/engine.test.ts
  - test-skip-integrity
  - lane-inventory
supersedes: 
seal: sha256:10636ade02cd6b891c0ce282b1dfd87e6b468f71e8859b9ab799c77bbadbc663
---

# qe-ABC-249 gates and commands run: lint, typecheck and build rc 0; npm test 2 363/2 363, 0 skips; skip-integrity and lane-inventory: No findings; A4 diff shape holds

The worktree was set up with `npm ci` (67 packages, rc 0). All commands below ran in the worktree unless noted.

- `npm run lint` rc 0 ("Checked 131 files … No fixes applied."). `npm run typecheck` rc 0. `npm run build` rc 0. `git status` is clean after them.
- **`npm test` (head, in the G8 window):** 2 363 passed (2 363) in each of 3 runs. 0 skipped, 0 failed, and 63 files in the vitest JSON. Base: 2 362 in each of 3 runs, so the count is base + 1.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", rc 0.
- `node tools/grugops/lane-inventory.js`: "The lane collects 63 test files; git tracks 63. No findings.", rc 0.
- **Single file:** `NODE_OPTIONS=--max-old-space-size=400 ./node_modules/.bin/vitest run src/engine.test.ts -t ABC-249`, at production, QPLY4 and QPLY5 (outputs in raw/mutants/row-*.txt).
- **A4:** `git diff --numstat 09d1f675 25371747` gives `45 0 src/engine.test.ts`, and there are no removed lines. The added describe sits at the file's end. The comment ids are ABC-249, ADR-0054 and QE-248-c only.
- **Lane inputs:** `git diff --name-only 09d1f675 dd66bfee` over src, tools, package*.json, vitest.config.ts and tsconfig.json gives `src/engine.test.ts` only.
- **UAT-waiver grep:** empty.
- **Flaky risk:** low. The row reads fixed depth on a virtual clock, its figures were identical in every run (row, lane and probe), and it has no I/O.
- Never bare npx or npm exec. No src/ production edit, and no edit to tools/, data/, the board, plans/ or memory-bank/.
