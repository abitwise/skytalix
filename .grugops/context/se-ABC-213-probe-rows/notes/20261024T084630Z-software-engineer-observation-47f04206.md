---
id: 20261024T084630Z-software-engineer-observation-47f04206
kind: observation
by: software-engineer
at: 2026-10-24T08:46:30.593Z
verified_by: 
confidence: high: every gate as it ran at 7adc85ac (worktree)
refs:
  - se-ABC-213-probe-rows
  - ABC-213
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - ADR-0047
  - grugops/ABC-213
  - 7adc85ac
  - e46db08e
  - src/pgn.test.ts
  - src/pgn-file.ts
  - qe-ABC-213/20261024T084131Z-qe-e2e-observation-1bb1938c
  - qe-ABC-213/20261024T090500Z-orchestrator-decision-502866f9
supersedes: 
seal: sha256:59e85038b3978d4d776060eb01899c471b4015153ecae6c41e8c18dc08d0e87b
---

# ABC-213 gates at 7adc85ac: lint/typecheck/build 0; npm test 62 files 2047/2047; skips 0, No findings.

Software Engineer, task `se-ABC-213-probe-rows`, worktree `../wt-ABC-213`, Node 26.11.1. Every reading as it ran.
- `npm run lint` exit 0 (125 files, no fixes); `npm run typecheck` exit 0; `npm run build` exit 0.
- `npm test` exit 0: 62 files, **2047 passed** (2044 at `e46db08e` + the 3 probe rows). `.test-results/last-run.json`: success true, 2047/2047, failed 0, pending 0, todo 0.
- Skip capture (AGENTS.md jq line): `0`; `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0.
- No `games/` in the worktree after the run. `main` was not merged again (brief). No timing reading was taken; vitest durations are not readings.
