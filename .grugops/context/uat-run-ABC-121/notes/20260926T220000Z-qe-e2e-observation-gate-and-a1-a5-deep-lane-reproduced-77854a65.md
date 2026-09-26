---
id: 20260926T220000Z-qe-e2e-observation-gate-and-a1-a5-deep-lane-reproduced-77854a65
kind: observation
by: qe-e2e
at: 2026-09-26T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - A1
  - A5
  - grugops/ABC-121-pvs-lmr
supersedes:
---

# Default gate and the `SEARCH_DEEP` `A1`/`A5` deep rows reproduced at HEAD `6570343` — every figure matches the build, QE and Security/NFR readings exactly

Hand-authored and unsealed: `context-io.ts` is absent from this install and `human_admission` is
`off` (`AGENTS.md`), so no `finding` is admissible. This is a `claim`-adjacent `observation`, not
a stamp. Worktree `.claude/worktrees/ABC-121-pvs-lmr`, branch `grugops/ABC-121-pvs-lmr`, HEAD
`6570343` (the Security/NFR PASS_WITH_RISKS tip) throughout.

## Default gate

- `npm test`: 48 files / 1466 tests / 0 skipped, exit 0.
- `npm run lint`: clean, 85 files.
- `npm run typecheck`: exit 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No
  findings."

All four numbers match every prior gate on this ticket (build, lane re-hop, QE, Security/NFR)
exactly.

## `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts` — 29/29 passed, exit 0, 926.18 s wall

Scoped deliberately to the one file this ticket owns. `SEARCH_DEEP` also gates rows in
`src/search.test.ts`, `src/quiescence.test.ts` and `src/transposition.test.ts`, but none of those
files' code changed under `ABC-121` (confirmed: the ticket's own diff touches only `src/search.ts`,
`src/engine.ts`, `src/search.mate-corpus.ts` and the one `src/transposition.test.ts` comment line
already covered by the default lane), so re-running their deep rows would not exercise anything
this UAT run is checking.

| criterion | reading here | matches build/QE (`…4acb5c4b`, `…dc82fb03`)? |
|---|---|---|
| `A5` kiwipete d4 | 17911 / 22323 = 80.2% | yes |
| `A5` position-6 d4 | 20402 / 28829 = 70.8% | yes |
| `A1` mate floor d4→d5, 287 positions | 0 of 180 violated | yes |
| `A1` `search()` d5, 190 positions | 99.47% within 25 cp of 187, max 45 cp (position-6/f3h4: 565→610); 0 mate-status flips | yes |
| `A1` `chooseMove` to d5, 190 positions | 99.47% within 25 cp of 187, max 45 cp (same position); 0 mate-status flips | yes |
| `A2` companion, kiwipete d7 | 532363 (chooseMove) vs 1922235 (chooseMoveWithoutPvsOrReductions) | yes |
| `A2` companion, position-6 d7 | 467461 (chooseMove) vs 1923320 (chooseMoveWithoutPvsOrReductions) | yes |

Every figure reproduced to the exact number, at HEAD, independently of the build's and QE's own
runs. No Ctrl-C/SIGTERM needed; the file completed on its own.
