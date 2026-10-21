---
id: 20261021T104002Z-software-engineer-observation-802f9d50
kind: observation
by: software-engineer
at: 2026-10-21T10:40:02Z
verified_by: 
confidence: high
refs:
  - ABC-182
  - grugops/ABC-182
  - 19abbdb1
  - 053595af
  - 341da4c1
  - 87d3897d
  - ADR-0036
  - AR-163-DELONLY
  - plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - NFR-008
supersedes: 
seal: sha256:d9e219d423a4bcebfd67a1ff72715eacbceb7e6d9b6f10e9c34db74b4868f3a7
---

# ABC-182 branch, files, gates and the UAT waiver measurement

- **Branch:** `grugops/ABC-182` from `main` `19abbdb1`, worktree `../wt-ABC-182`. Not pushed, not merged.
- **`053595af`:** `.grugops/context/design-F-072-1/probe/r2-mutants.sh` (new, executable, 75 lines) and
  `r2-mutants.out.txt` (new, the A2 run). Then a notes commit with this note set, under
  `.grugops/context/ticket-to-pr-ABC-182/notes/`.
- **Usage:** `bash .grugops/context/design-F-072-1/probe/r2-mutants.sh <repo> <tip-sha> <scratch-dir> <abs path to clause-b.mjs>`.
  Use a commit id for `<tip>`: the clone has no local branches.
- **Tests:** 0 test files and 0 tests added, as the page says (`NFR-008` 0 / 0 / 0). The harness runs by hand.
- **Gates at `053595af`, run one at a time:**
  - `npm run lint` rc 0 (116 files, no fixes); `npm run typecheck` rc 0; `npm run build` rc 0.
  - `npm test` rc 0, 59 files and 1987 passed. `.test-results/last-run.json` reads `success` true, 1987 passed,
    0 failed, 0 pending, 0 todo, 59 `testResults`.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` reads `No findings.` (rc 0).
  - `CLI_DEEP=1` with heap 400, `src/cli.real-engine.test.ts`: 11 of 11.
  - `PERFT_DEEP=1` with heap 400, `src/perft.test.ts`: 32 of 32.
- **UAT waiver**, AGENTS.md's form, with no `__snapshots__` filter:
  `git diff --name-only 19abbdb1 <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. The `.snap` changes
  are none.
- **Owed:** QE reads `A2`–`A4` itself. The Orchestrator moves the board and the trace.
