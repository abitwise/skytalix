# qe-ABC-268 plants: 3 of 8 QE plants red, 5 survive every lane (QP2 en passant as quiet, QP3/QP4 fail-hard at a futile node, QP5 the new engine door without priorKeys, QP6 king moves never skipped); QP5 is caught only by QE's out-of-tree history pair, QP3/QP4/QP6 only by the exact A4 counts, QP2 by nothing QE ran

QE/E2E, task `qe-ABC-268`, PREREG `…fae528bd` (plants declared there before any run). Each plant on a scratch copy of head (`git archive df984484`), `src/search.ts` and `src/engine.ts` restored from head before each; the copy diffed equal to head at the end ("plant copy src == head src: yes"). Lanes: the default lane of the five touched files (`search.futility`, `search`, `engine`, `search.null-move`, `quiescence`; 260 tests, `NODE_OPTIONS=--max-old-space-size=128`), then for a survivor `SEARCH_DEEP=1` `search.futility` (47 tests), and for QP5 `qe-a1.mjs`'s history pair. Raw in `raw/plants/`.

| plant | what | default lane | deep futility | other |
|---|---|---|---|---|
| QP1 | `futilityNode` reads the static score from White's side | **red** (4: the three Black boundary rows; and `ABC-230` A1 "K v KR … d1e1 at 0 with the prior keys") | — | — |
| QP2 | `futileMove` treats an en-passant capture as quiet | green 260/260 | green 47/47 | A4 counts unchanged on all four readings: **survives everything QE ran** |
| QP3 | fail-hard at a futile node in `src/search.ts` (`if (futile && best < alphaIn) best = alphaIn;` before the store) | green | green | `search()` d8 counts move (kiwipete 910 560, position-6 1 348 283 vs 888 786 / 1 262 046), ratios 0.815 / 0.841, still under the 0.88 bar |
| QP4 | the same fail-hard line in `src/engine.ts` | green | green | `chooseMove` to 8 counts move (1 318 893 / 378 035 vs 1 306 981 / 391 451), under the bar |
| QP5 | `chooseMoveWithoutFutility` with `priorKeys: false` | green | green | **red on QE's history pair** (8 / 12 rows differ from base `chooseMove` with prior keys) |
| QP6 | `futileMove` never skips a king move | green | green | all four counts move (909 521 / 1 273 931 / 1 330 844 / 394 158), under the bar |
| QP7 | the mate-band guard reads `MATE_SCORE` for `MATE_FLOOR` | **red** (2: both band guard rows) | — | — |
| QP8 | the engine's call passes `index + 1` to `futileMove` | **red** (2: the engine source row; `ABC-229` INFO row "chooseMove reads the INFO row the same way at depth 8") | — | — |

- Each survivor deviates from the page's wording: QP2 and QP6 from "every move at index ≥ 1 that neither captures nor promotes nor gives check is skipped" (en passant is a capture; a king's quiet move is skippable); QP3/QP4 from "returns the best score among the moves searched, fail-soft"; QP5 from `ADR-0061` d4 "everything else on". None moves a bar: the A4 ratios stay ≤ 0.88 and the deep oracle stays green. The exact reproduction counts (an instrument check, not a lane row) catch QP3, QP4 and QP6; nothing in the repository's lanes does.
- SE's 21 plants (all red) are not re-run here; these eight are new and different.
- A first plant run was voided by QE's own spelling (heap 400 for a five-file run; the repository's heap guard refused every run as "no tests"); re-run with 128 as AGENTS.md spells it. Not counted.
