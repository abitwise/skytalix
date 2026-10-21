---
id: 20261021T175649Z-qe-e2e-observation-25aa4be6
kind: observation
by: qe-e2e
at: 2026-10-21T17:56:49Z
verified_by: 
confidence: high (own runs at bfccd564 and on a scratch copy outside the repository; restored, cmp-checked)
refs:
  - ABC-192
  - grugops/ABC-192
  - grugops/qe-ABC-192
  - b5b8b0f9
  - 5d1fbaa7
  - 47a3c9a1
  - bfccd564
  - plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
  - ec5c42d7
  - a4561a26
  - NFR-008
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - A4
supersedes: 
seal: sha256:71d46cd28d721cb3c40c39bcf227363a7c8e9e8a0df7b66dd3e3407beb2f078e
---

# ABC-192 QE gates and artifacts at merge `bfccd564`: lint/typecheck/build 0; npm test 59 files / 1994 passed, last-run.json success; skip count 0 → No findings.; UAT waiver prints nothing; AR-191-GITENV stand-in prints nothing

Recorded as an observation (no §14-gate run, so no artifact-ref). Worktree `../wt-qe-ABC-192`, branch `grugops/qe-ABC-192`, merge `bfccd564` = tip `b5b8b0f9` + main `ec5c42d7` (`--no-ff`, no conflict; main brought records, `AGENTS.md` 15,797 → 15,821 B and memory-bank text only, no `src/`, `tools/`, `package*`). No timing taken.

- `npm run lint` exit 0 (`Checked 116 files … No fixes applied.`); `npm run typecheck` exit 0; `npm run build` exit 0.
- `npm test` exit 0: `Test Files 59 passed (59)`, `Tests 1994 passed (1994)`. `.test-results/last-run.json`: success true, exitCode 0, numTotalTests 1994, passed 1994, failed 0, pending 0, todo 0, 59 file results.
- Skip-count capture as spelled in AGENTS.md (`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`): `0`, pipe 0/0. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0.
- One-file `src/cli.test.ts` at 400: 95/95 (N8-LANE and ABC-173 C2 green). One-file `-t "ABC-192"` at 400: 2 passed.
- **UAT waiver, owner's form** `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`: printed nothing over `47a3c9a1 b5b8b0f9` (pipe 0 0 1), over the delivered code commit `5d1fbaa7~1 5d1fbaa7` (0 1 1) and over the merge `ec5c42d7 bfccd564` (0 0 1). `git diff --numstat 47a3c9a1 b5b8b0f9 -- src`: `98 0 src/cli.test.ts`, no binary row. UAT WAIVED (0 production lines). A waiver is not a signature.
- **AR-191-GITENV stand-in** (`git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`): printed nothing in my shell, in the worktree and in the main checkout. No git config was set.
- Main moved to `a4561a26` during the run (close of arch-build-ABC-193: `.grugops/queue/`, `plans/` only). Not re-merged; `git merge-tree --write-tree a4561a26 HEAD` is clean.
- Scratch copy `…/scratchpad/qe192/copy` (outside the repository): control one-file 2 passed, `npm test` 59 / 1994 success true, with a full real `node_modules` copy (no snapshot artefact).
