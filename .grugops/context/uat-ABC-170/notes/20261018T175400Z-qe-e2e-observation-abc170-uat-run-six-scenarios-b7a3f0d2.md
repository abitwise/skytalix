---
id: 20261018T175400Z-qe-e2e-observation-abc170-uat-run-six-scenarios-b7a3f0d2
kind: observation
by: qe-e2e
task: uat-ABC-170
at: 2026-10-18T17:54:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - src/engine.ts
  - .grugops/context/uat-ABC-170/probe/harness-RUN-1.txt
  - .grugops/context/uat-ABC-170/probe/controls.txt
  - 20261018T175300Z-qe-e2e-artifact-ref-abc170-uat-pack-5c8e21a4
supersedes:
---

# UAT run `ABC-170`: 6 of 6 scenarios PASS, 401 of 401 checks, twice, byte-identical

This note is hand-authored and unsealed. It is an agent's observation of a run, not a stamp, and not the
owner's acceptance.

**The run.** Worktree `../wt-uat-ABC-170` on `grugops/uat-ABC-170`, branched from `grugops/ABC-170` @
`36e3a753`. Today's engine is `main` @ `af3769e3`'s `src/`, extracted to a scratch directory. Node v26.11.1,
Darwin 25.5.0. Every engine call ran on a virtual clock, so the figures below are node-count figures and the
same on every host. **No wall-clock reading was taken, of the engine or of the harness.** "t=…v" means
virtual milliseconds. Run 2 matched run 1 byte for byte (sha256 `4ac8df2d…`), and `src/engine.ts` md5 was
`3ce3a251…` before and after.

## Results

| # | scenario | result | evidence (from `harness-RUN-1.txt`) |
|---|---|---|---|
| S1 | No limit given = today's engine, the same move | **PASS** (288/288) | 12 positions × 2 budgets × 3 doors × 4 tip variants. Every one equals today's engine in all five fields. For example, startpos 5 v: d4 `e2e4` 0, 2 050 nodes, 6 v, both sides. position-6 50 v on the no-PVS door: d4 `c3d5` 84, 47 535 nodes, both sides. Position unchanged every time |
| S2 | The game's own callers behave as before | **PASS** (49/49) | 45 level choices (levels 1–5 × seeds 1–3 × 3 positions) equal today's, blunders included. For example, level 1 seed 2 kp-vs-k: blunder `e1f1` on both; level 3 seed 1 kp-vs-k: engine `e1f2` d8, 22 536 nodes on both. The engine seam gives the same move on 4 of 4 positions (`g1f3`, `e2a6`, `c4c5`, `e1f2`) |
| S3 | `maxDepth: N` never reports a depth above N, and the move is legal | **PASS** (35/35) | `A1` fixture: unlimited kp-vs-k 10 v reaches d7, so the stop is real. `maxDepth 3` gives d3 `e1f2` 151, equal to `search(p, 3)`. `maxDepth 1` gives d1 `e2e3`, legal. Sweep of 32 rows: depth = min(N, unlimited) every time. For example, startpos 50 v reaches d6 unlimited, so `maxDepth` 1–6 gives d1–d6 and 7 and 8 give d6. Kiwipete 50 v reaches d4, so 5–8 give d4 |
| S4 | `maxNodes: K` stops near K, plays the last depth it finished, and leaves the board alone | **PASS** (16/16) | `A2` fixture: Kiwipete `maxNodes 20000` gives d3 `e2a6` 70, 20 058 nodes, within the 21 024 bound. That equals `search(p, 3)` and a `maxDepth 3` run, which visits fewer nodes, so the next depth was entered and dropped. `maxNodes 1` gives d1, legal. Sweep of 12 rows: the bound, the discard (move, score and depth equal a `maxDepth d` run), legality and an unchanged position held in all 12 |
| S5 | The limits combine with the clock: whichever comes first. The ceiling still holds | **PASS** (10/10) | (a) clock first, at 5 v with `maxDepth 50` and `maxNodes 1e9`, is identical to unlimited on 3 positions. (b) depth first: kp-vs-k 10 v `maxDepth 3` gives d3, 147 nodes and 4 v, against unlimited d7, 3 962 nodes and 11 v. (c) nodes first: Kiwipete returns at 23 v of a 5 000 v budget. (d) `maxDepth 2` + `maxNodes 1e7` equals `maxDepth 2` alone; `maxDepth 10` + `maxNodes 3000` equals `maxNodes 3000` alone. (e) `budgetMs: Infinity` with `maxDepth 1000`, with `maxNodes MAX_SAFE_INTEGER` and with both: the same clock-read count and the same answer as without either |
| S6 | The limits pass through the engine seam a session uses | **PASS** (3/3) | `createEngine` with `maxDepth 2`, `maxDepth 3` and `maxNodes 20000` plays the same move as `chooseMove` with the same options |

Engine calls per run: 553.

## Does the harness have teeth? (four negative controls, scratch copies only)

Each control changed one line of `src/engine.ts` in a **scratch copy** of the tip `src/`. The worktree's `src/`
was never edited. See `probe/controls.txt`.

| control | the broken behaviour | caught by |
|---|---|---|
| C1 | `maxDepth` off by one (`<` for `<=`) | S3 (22 rows), S4 (13), S5 (2) |
| C2 | `maxNodes` never aborts mid-iteration | S4 (14 rows): for example, Kiwipete at `maxNodes 20000` reports 26 733 nodes, past the 21 024 bound |
| C3 | one extra clock read, only when no limit is given | S1 (144 rows), S2 (45), S5 (6) |
| C4 | a hidden 60 000-node default for `maxNodes` | **nothing**. This is the pack's known limitation 3, and the same gap as `QE-170-b` |

## Gate at the tree under test (entry criterion, not the UAT evidence)

See `…a91f6c30`.
