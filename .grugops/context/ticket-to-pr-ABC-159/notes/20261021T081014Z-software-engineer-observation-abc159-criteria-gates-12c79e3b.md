---
id: 20261021T081014Z-software-engineer-observation-abc159-criteria-gates-12c79e3b
kind: observation
by: software-engineer
at: 2026-10-21T08:10:14Z
verified_by:
confidence: high (each reading run on the tip and recorded as it ran)
sealed: false
task: ticket-to-pr-ABC-159
subtask: ticket-to-pr-ABC-159
refs: [ABC-159, NFR-008, 3c505abe]
supersedes:
---

# `ABC-159`: criteria and gates on tip `3c505abe`

## Criteria
| # | base `4ab5b453` | tip `3c505abe` |
|---|---|---|
| A1 (joined-text search) | prints 3 sites: history-pane, san, status-panel (red, as the page states) | prints **nothing**: PASS |
| A2 (ordinal grep) | prints `src/turn-loop.nfr.test.ts:9`, exit 0 | exit **1**: PASS |
| A3 (argument survives) | — | owed to QE. The four sentences are in the decision note `…69b2939c` |
| A4 diff | — | exactly the 4 files, every changed line inside the header block: PASS |
| A4 per-file counts | 59 files, 1987 tests, every file rc 0, 0 non-passed | identical; `cmp` base vs head exits 0: PASS. Skips 0 |

**A4 method deviation, stated:** the page's literal command is one whole-suite `npx vitest run --reporter=json`.
This hop's brief requires the `--max-old-space-size=400` prefix on every vitest call. At 400, the repo's
`ABC-173` heap guard (`tools/grugops/heap-guard.js`) refuses any run of more than one file: the SUITE row is
224 MiB and needs flag 128. That run was tried at base and refused: exit 1, 0 tests. So the counts were taken as
59 one-file runs at 400 (the ONE-FILE row), sequentially, at both base and head, piped through the page's `jq`
expression. A file's assertion count does not depend on whether it runs alone. The suite total (1987) matches
`npm test`.

## Gates (tip)
- lint 0 (116 files); typecheck 0; build 0.
- `npm test`: exit 0. 59 files, 1987/1987 passed, 0 failed, 0 pending, 0 todo; `.test-results/last-run.json`
  `success: true`. The script carries its own `--max-old-space-size=128` (SUITE row) and was run as written.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1 … src/cli.real-engine.test.ts`: 11/11, exit 0.
- `PERFT_DEEP=1 … src/perft.test.ts`: 32/32, exit 0.
- No timing taken (N8 and NFR-008 readings are QE's). NFR-008 by construction: 0 test files, 0 tests and 0 spawns
  added.
