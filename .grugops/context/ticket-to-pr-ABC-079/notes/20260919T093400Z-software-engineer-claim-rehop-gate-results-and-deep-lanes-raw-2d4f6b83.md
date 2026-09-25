---
id: 20260919T093400Z-software-engineer-claim-rehop-gate-results-and-deep-lanes-raw-2d4f6b83
kind: claim
by: software-engineer
at: 2026-09-19T09:34:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-077
  - ABC-078
  - ADR-0024
  - NFR-008
  - src/quiescence.test.ts
  - src/search.test.ts
  - src/engine.test.ts
  - .grugops/test-skips.md
supersedes: 20260919T075000Z-software-engineer-claim-gate-results-and-deep-lanes-8a0c2e46
---

# Gate results at `700730b`, raw, and the three opt-in deep lanes run TO COMPLETION — a `claim`, no stamp

No `finding` is admissible on this install (`AGENTS.md`); the §14 gate is the Orchestrator's to
run. Every command below ran through a node runner (`spawnSync` under `/usr/bin/time -p`, one
fresh process each) from the worktree; exit codes as returned. Apple M3 / 8 cores / Node
v24.12.0 / vitest 3.2.7. **Load average 4–19 throughout — two sibling hops live (`ABC-075` on
`src/zobrist.*`, QE on `ABC-120`) plus whatever else the machine carried; the deep-lane wall
times are not comparable to the quiet-machine records.** Load is quoted with each line.

## The four mandatory gates + test integrity

```
npx biome check .        Checked 75 files in 90ms. No fixes applied.               exit 0  load 16.7
npx tsc --noEmit         (typecheck)                                               exit 0  load 15.9
npx tsc --noEmit         (build slot)                                              exit 0  load 10.7
npx vitest run --dir src
                         Test Files  41 passed (41)
                              Tests  1243 passed (1243)                            exit 0  load 15.9-18.9
                         real 6.09  user 21.41  sys 2.00
skip count               --reporter=json: numPendingTests 0 + numTodoTests 0 = 0
integrity                node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                         No findings.                                              exit 0
```

At `f6772c5` (the ruling, code unchanged from `e2c3af5`) the lane was 41 files / 1 238 pass /
5 fail. The five reds are green; no test was deleted, skipped or moved between lanes.

## `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` — exit 0, 37 passed, 13.7 s wall (load 12.5 → 11.0)

```
Tests  37 passed (37)     real 13.72  user 13.74  sys 0.40
A1 depth 3: 0/24 with quiescence, 0/24 without                                        708 ms
A3 broad corpus (six roots + 184 children) under the cap                              758 ms
A4 door: position-6 depth 3 = 14 565 nodes / c3d5                                     544 ms
A5 kiwipete   d2 32.74x (level 50)   d3 45.02x (level 70, 7 031 ms)
A5 position-6 d2 17.44x (level 26)   d3  8.26x (level 13, 2 657 ms)
A6 broad corpus 0 mutated
```

Was exit 1 / 6 failed / 227 s at `e2c3af5`. Existing per-case timeouts (60 s / 30 s / 120 s)
untouched.

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` — exit 0, 33 passed, 123.7 s wall (load 4.6 → 4.4)

```
Tests  33 passed (33)     real 123.66  user 119.45  sys 0.98
A1 (30 positions, real clock, 3 s budget): worst position-3 3 036 ms at completed depth 5;
   over 3 s by the abort granularity: 30/30; over the 5 s ceiling: 0/30                  90.3 s
NFR-005: kiwipete completed depth 2 (203 509 nodes, 3 004 ms);
         position-6 completed depth 3 (180 520 nodes, 3 010 ms)  — REPORTED                6.0 s
A3 identity, endgame corpus 2.2 s; six roots + children 19.2 s                             pass
A3 deep literal: search(A3_FEN, 3).move === g4g5                                           pass
A2 real clock, 50 ms budget: 89 ms at completed depth 1  (bar ≤ 100 ms)                    PASS
A7 1 ms budget, broad corpus, legal move every time                                        1.4 s
```

Was exit 1 / 4 failed / 179.7 s at `e2c3af5`. **The 50 ms case passes as written — at 89 ms
against 100 ms, 11 ms of headroom on a loaded machine (444 ms unordered).** Ordered depth 1 on
kiwipete is 5 878 nodes; the case's margin is the machine's, not the code's, and a busier run
could read over 100 ms. Reported, not re-fixtured.

## `SEARCH_DEEP=1 npx vitest run src/search.test.ts` — RAN TO COMPLETION, exit 1, 4 failed / 37 passed, 2 678.5 s wall (load 10.0 → 4.0)

```
Tests  4 failed | 37 passed (41)     real 2678.46  user 2581.82  sys 7.77
A1 pruned == unpruned   startpos  d3     389 ms  pass
                        kiwipete  d2  12 291 ms  pass
                        kiwipete  d3 1 016 367 ms  FAIL — timed out in 30 000 ms
                        position-4 d3 27 098 ms  pass (2.9 s under its 30 s timeout)
                        position-5 d2   1 281 ms  pass
                        position-5 d3  55 522 ms  FAIL — timed out in 30 000 ms
                        position-6 d2   3 454 ms  pass
                        position-6 d3 195 169 ms  FAIL — timed out in 30 000 ms
A2 kiwipete d3 < 40%                    0 ms  pass (read from the memoised pair above)
A3 mate in 2 over 3 at d5 72 ms; over 4 at d7 1 595 ms                                  pass
A4 legal move, corpora at depth 2 + broad at 1 and 2     82 711 ms  pass (timeout 120 s)
A7 both corpora at depth 2 + every perft root at depth 3, pruned AND unpruned
                                      1 280 721 ms  FAIL — timed out in 120 000 ms
```

The vitest timeout marks the case failed but cannot interrupt a synchronous search, so each
ran to its end and the durations above are the real cost. **Cause, as the ruling predicted:
`searchWithoutPruning` never raises `alpha`, so every leaf's quiescence opens with a full
window, and the unpruned tree is itself the alpha-beta tree's many-fold.** At `ABC-077`'s tip
this lane was 23.0 s. Under load 7–10 the numbers are inflated perhaps 2x; that does not bring
any of the four inside its timeout. **The kiwipete-only depth drop the ruling licensed is NOT
applied** (decision note §4): it cannot make the lane read exit 0, and `src/search.test.ts` is
outside this subtask's fence. **This lane is the one thing this hop could not meet.**

## Scratch artefacts (session scratchpad, not committed)

`abc079r-run.mjs` (the runner), `abc079r-fixtures.ts`, `abc079r-probe-promo.ts` (the probe
plus a `mvv+promo` variant), `abc079r-a3scan.ts` / `-a3scan2.ts` / `-a3rank.ts` / `-a3emul.ts`
(the `A3` fixture search and the emulated mutant), `abc079r-mutant/` + `abc079r-mutant-a2.mjs`
(QE's `M1` on a copy of `src/`), `abc079r-nfr004.ts`, `abc079r-nfr008.mjs` /
`-nfr008-base.mjs`, `abc079r-before/` (`b65f5f1` tree) and `abc079r-base/` (`4f0ef01` tree)
from `git archive`, the `*.out.txt` lane transcripts, and the two commit-message files.
