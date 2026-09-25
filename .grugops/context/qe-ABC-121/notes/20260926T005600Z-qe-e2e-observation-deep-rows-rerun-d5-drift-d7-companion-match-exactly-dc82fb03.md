---
id: 20260926T005600Z-qe-e2e-observation-deep-rows-rerun-d5-drift-d7-companion-match-exactly-dc82fb03
kind: observation
by: qe-e2e
at: 2026-09-26T00:56:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - NFR-005
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204400Z-software-engineer-artifact-ref-abc121-lane-rehop-branch-commit-gates-3b7c52d1.md
---

# The d5 drift and d7 companion, NOT re-run at the lane re-hop, re-run independently here — match the build's figures exactly

Hand-authored, no `seal`. The lane re-hop's own artifact-ref (`…3b7c52d1`) names these rows
`UNKNOWN - verify` at QE: "the d5 drift and d7 companion rows were NOT re-run. Their code is
untouched by this diff." Ran `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts` in this
worktree at HEAD (`312a188`), full file, 29 tests, 882.8 s wall, all green.

| row | reading | matches build note `…4acb5c4b`? |
|---|---|---|
| PVS identity, all 190 at depth 4 | 0/190 | yes |
| `A5` kiwipete / position-6 d4 | 17911/22323 = 80.2%; 20402/28829 = 70.8% | yes |
| `A1` mate floor, 287, d4→d5 | 0 of 180 violated | yes |
| `A1` drift `search()` d5, 190 | 99.47% within 25 cp of 187, max 45 cp (position-6/f3h4 565→610) | yes |
| `A1` drift `chooseMove` to d5, 190 | 99.47% within 25 cp of 187, max 45 cp (same position) | yes |
| `A2` companion, kiwipete d7 | 532363 (chooseMove) vs 1922235 (door) | yes |
| `A2` companion, position-6 d7 | 467461 (chooseMove) vs 1923320 (door) | yes |

Every figure reproduced to the exact number. Stopped only by natural completion (no
Ctrl-C/SIGTERM needed; the run finished on its own). This closes ticket task-note item 2 and
the `…82816ae6` claim item 3 ("the whole `SEARCH_DEEP` suite was not re-run end to end after
the final amend") for this file: it now has been, at the G6-comment tip, independently.
