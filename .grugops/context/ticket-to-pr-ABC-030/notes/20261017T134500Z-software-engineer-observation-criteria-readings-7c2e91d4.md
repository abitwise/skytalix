---
id: 20261017T134500Z-software-engineer-observation-criteria-readings-7c2e91d4
kind: observation
by: software-engineer
at: 2026-10-17T13:45:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-030
  - ABC-030
supersedes:
---

# ABC-030 criteria, measured at code commit `bc185f83` (base `b84dc637`)

Before: md5 status-panel `b1c1998e…`, gameend `5be6c34f…`, san `5da32d6a…`, zobrist `bb4d52be…`
(match the re-score). A2 grep before: 3 hits (`gameend:13`, `san:19`, `status-panel:11`).
Siblings by runner: status-panel.test 29, gameend.test 45, san.test 22, zobrist.test 32.

- **A1** `/usr/bin/grep -nE 'all [0-9]+ tests there' src/zobrist.nfr.test.ts src/status-panel.nfr.test.ts`
  -> exit 1, 0 hits. MET.
- **A2** `/usr/bin/grep -nE 'all [0-9]+ tests there|the [0-9]+ rows in' src/*.ts` -> exit 1, 0 hits.
  `git diff --numstat b84dc637 bc185f83`: `1 1` for each of status-panel / gameend / san `.nfr.test.ts`,
  nothing else; every `+`/`-` line starts ` *` (inside the header block comment). zobrist 0 lines. MET.
- **A3** `npx vitest run --reporter=json | jq -r '.testResults[] | "\(.assertionResults|length) \(.name)"' | sort -k2`
  (worktree prefix stripped, same worktree both runs) before vs after: `cmp` 0, 58 lines; 1792/1792,
  0 pending, success true both runs. MET.
- **A4** the repaired sentences carry no integer about a quantity outside their own file (see the
  decision note for every integer left in the header blocks). MET.
- After md5: status-panel `f2f79988…`, gameend `2d46f8c5…`, san `176aca78…`, zobrist `bb4d52be…`.
- Gates on `bc185f83`: lint 0 (113 files), typecheck 0, build 0, `npm test` 0 (58 files, 1792 passed),
  `.test-results/last-run.json` success true, 1792 total, 0 pending, 0 todo;
  `test-skip-integrity --skip-count 0` -> `No findings.`, exit 0. No timing reading taken.
- node_modules: symlink to the main checkout's (`package.json`/`package-lock.json` cmp 0); removed
  before handoff.
