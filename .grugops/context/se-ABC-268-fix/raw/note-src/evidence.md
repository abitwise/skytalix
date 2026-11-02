# se-ABC-268-fix plants and gates: QP2, QP3, QP4, QP5, QP6 each red with the new rows and head green on QE's five-file lane (270/270); npm test 2 417/2 417, skips 0; lint and typecheck 0

Software Engineer, task `se-ABC-268-fix`. Each plant applied with QE's own `qe-ABC-268/raw/qe-scripts/qe-plant.py` to a scratch copy of the `fad0fb7c` tree (`git archive`), one copy per plant; copies of `src/search.ts`, `src/engine.ts` and the two test files diffed equal to the worktree. Lane = QE's default lane exactly (`search.futility`, `search`, `engine`, `search.null-move`, `quiescence`; `NODE_OPTIONS=--max-old-space-size=128`, local vitest), every run under `flock host-test.lock`, one at a time. Raw in `raw/plants/` (plant diffs and lane outputs), `raw/gates/`, `raw/scripts/` (the table-dump exploration that found the QE-268-b node: head -554 vs QP3/QP4 1010 at the same entry).

| plant | what | result | rows red |
|---|---|---|---|
| head | none | **green 270/270** | — |
| QP2 | en passant treated as quiet | **red** 1 | QE-268-c en passant |
| QP3 | fail-hard at a futile node, `src/search.ts` | **red** 1 | QE-268-b `search()` at depth 3 (stored 1010, wanted -554) |
| QP4 | fail-hard at a futile node, `src/engine.ts` | **red** 1 | QE-268-b `chooseMove` deepened to 3 |
| QP5 | `chooseMoveWithoutFutility` `priorKeys: false` | **red** 4 | QE-268-a, all four fixtures |
| QP6 | king moves never skipped | **red** 4 | QE-268-c quiet moves (Kd2, O-O); QE-268-b fixture row and both recursion rows (Kf1/Kf2 no longer skipped, entry -544) |

- QP3 reds only the search row and QP4 only the engine row: each recursion is pinned on its own.
- Gates on the worktree at `fad0fb7c`: `npm run lint` 0 (132 files); `npm run typecheck` 0; `npm test` **64 files, 2 417 passed** (2 407 + the 10 new rows), 0 skipped. Deep lanes not re-run: no deep row changed and the new rows are default-lane.
- QP1, QP7, QP8 were already red per QE and are not re-run. No row needed a bar or production change; no STOP.
