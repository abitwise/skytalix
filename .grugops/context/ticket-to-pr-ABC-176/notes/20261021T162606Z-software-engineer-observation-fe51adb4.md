---
id: 20261021T162606Z-software-engineer-observation-fe51adb4
kind: observation
by: software-engineer
at: 2026-10-21T16:26:06Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 01836fff
  - ffd53f41
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - SEC-173-1
  - QE-173-d
  - A1
  - A3
supersedes: 
seal: sha256:cca95615f294e66e3c60c7238fbb9ff61ab21fe87462e058c1d25bc813f745bd
---

# ABC-176 red first at base `01836fff`: A1's and A3's wrong builds reproduce. The page's base readings hold

Worktree `../wt-ABC-176`, before any code. Node's default `heap_size_limit` here is 4192 MiB.
- **A1 / A2 refusal arm** (the AGENTS.md line without its prefix, which is the old verbatim text):
  `N=$(npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests')` gives `rc=0 N=[0]`.
  Then `test-skip-integrity.js .grugops/test-skips.md --skip-count "$N"` prints `No findings.` with rc 0. This is
  `SEC-173-1` exactly.
- **A3 refusal arm** (the `test` script without its prefix, `node_modules/.bin` on PATH): exit 1. The file reads
  `{"success":false,"exitCode":1,"runState":"exited","numTotalTests":0,"unhandledErrors":[]}`. READ IT prints only
  `run    exited exitCode=1`. This is `QE-173-d` exactly.
- **Facts that moved, re-read:** the skip-count line is at `AGENTS.md:105` and `Test (all)` is at `:72`. `AGENTS.md`
  is 15,606 B against the guard `AGENTS_MD_BUDGET_BYTES = 18_432`. `ABC-173` `A3` counts 17 commands.
- **Base `npm test`:** 1987/1987, `success` true, skips 0.
