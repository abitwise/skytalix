---
id: 20261022T171339Z-qe-e2e-observation-0751bfeb
kind: observation
by: qe-e2e
at: 2026-10-22T17:13:39Z
verified_by: 
confidence: high
refs:
  - ABC-198
  - ABC-170
  - A5
  - QE-198-a
  - 24f32527
  - fbb967f2
  - 20261022T160059Z-software-engineer-observation-59297619
  - 20261022T160354Z-software-engineer-decision-7e9699c3
  - ABC-173
  - ABC-167
supersedes: 
seal: sha256:56ad597fbbea0a8f17446c16d82023635c5bfb795c402cec3a150c4d4ffa604d
---

# qe-ABC-198: the intermittent `ABC-170 A2` red is a PRE-EXISTING timeout flake under coverage and CPU pressure, not something 4.1.12 introduced. It reproduces at base (vitest 4.1.11) with the same row and the same signature; at the default 5 000 ms bound it was 0/73 at base and 0/73 at head

QE/E2E, task `qe-ABC-198`, 2026-10-22. It answers the SE's `UNKNOWN - verify` in `…59297619` / `…7e9699c3` (1 of 5 head runs of `npm test -- --coverage --coverage.thresholds.lines=100` red on `src/engine.test.ts` `ABC-170 A2`, base 3 of 3 clean, log lost). Base `fbb967f2` (4.1.11), head `24f32527` (4.1.12), fresh clones. Readings are relative and paired, on a host shared with other hops (1-minute load 2.9–12.1 on 8 cores). **They are not `NFR-008` timing claims.**

## What the row depends on
- `describe("ABC-170 A2 …")` at `src/engine.test.ts:1265`; the red row is its second `it`, "plays search(position, d)'s move and score at the reported depth d — the abort is discarded". It makes three searches from kiwipete: `chooseMove` with `maxNodes 20 000` and `tickingClock(1)`, the same capped at `maxDepth d`, and `search(kiwipete, d)`.
- **No wall-clock input.** The clock is injected (`tickingClock(1)`), the budget is a node count, and `clearTable()` empties the transposition table at every `chooseMove`/`search` entry (`src/transposition.ts`, `src/engine.ts:492`). Move, score, depth and nodes are deterministic.
- **Its one wall-time dependency is vitest's per-test bound:** no `testTimeout` in `vitest.config.ts`, so the default `5e3` applies. The row is synchronous and never yields, so the timer cannot fire mid-row. `@vitest/runner` `withTimeout` re-checks after the row returns (`now() - startTime >= timeout` → timeout error, vitest#2920). That file is byte-identical at 4.1.11 and 4.1.12.
- **Its cost is coverage-dominated:** about 160 ms without coverage, about 1.0–1.6 s under v8 coverage at heap 128. It is the heaviest row in `engine.test.ts` and among the four heaviest in the suite. The heaviest is `uci-session.test.ts` `ABC-167 A7` "go depth 3 …" at about 2.4 s.

## The runs (N, rate, load). Every log and `last-run.json` is kept in `…/scratchpad/qe198/runs/`
| form | side | N | A2 red | other red | A2 row ms median (max) | load1 |
|---|---|---|---|---|---|---|
| coverage suite, sequential, interleaved (A) | base | 15 | 0 | 0 | 1388 (1596) | 4.5–12.1 |
| | head | 15 | 0 | 0 | 1437 (3655) | 4.8–12.1 |
| coverage suite, base+head run concurrently (B) | base | 12 | 0 | 1 × `ABC-167 A7` timed out 5404 ms | 1972 (2295) | 5.1–10.1 |
| | head | 12 | 0 | 2 × `ABC-167 A7` timed out 5301/5141 ms | 2079 (2305) | 5.1–10.1 |
| one-file `src/engine.test.ts`, heap 400 (C + smoke) | base | 26 | 0 | 0 | 166 (182) | 4.7–5.7 |
| | head | 26 | 0 | 0 | 167 (182) | 4.7–5.7 |
| one-file + `--coverage` (D) | base | 20 | 0 | 0 | 1087 (1264) | 4.2–8.9 |
| | head | 20 | 0 | 0 | 1134 (1347) | 4.0–8.9 |
| coverage suite under `taskpolicy -b` (E1, CPU-starved) | base | 3 | **3** | 1 × A3 perft root position-6 5590 ms; all 3 hit the 60 s bound (124) | 6017–7275 when red | 3.6–7.2 |
| | head | 3 | **3** | all 3 hit the 60 s bound (124) | 7522–8631 when red | 3.8–6.5 |
| one-file + coverage, `-t "ABC-170 A2" --testTimeout=800` (E2, signature) | base | 3 | 3 | — | 963 | 5.0–5.7 |
| | head | 3 | 3 | — | 959 | 5.0–5.5 |

- **At the default bound** (A + B + C + D): base 0/73, head 0/73 (rule of three: ≤ about 4 % each at 95 %). Adding the SE's runs gives head 1/78 against base 0/76, which does not tell the sides apart.
- **Reproduced at base:** under CPU starvation the SAME row is the first `engine.test.ts` row to cross 5 s, 3/3 at base and 3/3 at head (`× plays search(position, d)'s move …`). In E2 both runners fail it with the identical message `Error: Test timed out in 800ms.` after the row ran to completion. The class (a coverage-heavy synchronous row crossing 5 000 ms) also reproduced at base without starvation, on `ABC-167 A7` under concurrent load: `Error: Test timed out in 5000ms.`, base 1/12, head 2/12.
- **The row tracks host load.** In A, row 2 ran 1190–1596 ms in 29 of 30 runs (A2 / ΣA3 ratio flat at 0.33–0.47, both sides). In head `a06` (load 10.25 → 12.10) it ran 3655 ms, 73 % of the bound. That whole run was slow: the engine file summed 11 094 ms against about 7 000, and all tests 57 285 ms against about 43 000. That is a host-wide burst, not a head-only effect: base `a06`, the next run, read 1596 ms.
- The SE's form is the result-file reporter's `exit code only` plant row: it **always** exits 1 (lines 99.25 % < 100). Classify it by `numFailedTests`, never by rc. Its four fields held in all 30 A runs: `[success false, exitCode 1, numFailedTests 0, numFailedTestSuites 0, unhandledErrors 0, exited]`.

## What 4.1.12 does change here (separate note, `QE-198-b`)
`@vitest/mocker` 4.1.12 adds about 5 % to coverage-mode CPU on `engine.test.ts` (paired and bisected; none without coverage). It narrows this row's margin by about 5 %; it does not create the failure mode, which reproduces at 4.1.11.

## Ruling
**Pre-existing flake (coverage- and CPU-pressure-sensitive timeout at vitest's 5 000 ms default), not head-only → no FAIL against A5.** `npm test` (no coverage) showed no difference at all.
Proposed route (BA/PM's to rule; `QE-198-a`):
1. Lighten the row, as `ABC-173` did for A3 on the owner's word "Lighten the rows, keep cap": a smaller `MAX_NODES`, kept above the depth-1 floor so the abort still lands inside an iteration.
2. Or pin an explicit per-row timeout on this row and `ABC-167 A7`.
3. And when the reporter's `exit code only` row is re-run under `BUMP_RERUN_LIST` (2), a timeout red there voids that reading rather than failing the reporter: re-run it on a quiet host.
