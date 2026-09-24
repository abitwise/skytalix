---
id: 20260924T215100Z-qe-e2e-observation-abc079-mutant-ledger-seven-asked-plus-conjunction-three-survive-everything-q6a-survives-raw-rows-5d8a0f37
kind: observation
by: qe-e2e
at: 2026-09-24T21:51:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ADR-0024
  - src/quiescence.ts
  - src/search.ts
  - src/quiescence.test.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - src/engine.test.ts
supersedes:
---

# `ABC-079` mutant ledger: 13 mutants on the integrated base (`6b7b2c8`), with raw rows

This note carries the harness and the table. The full per-row output (every red row and its
first error line, and for killed stages the last rows that finished) is
`raw-out-mutant-ledger.txt.txt`. The JSON is `raw-out-mutants-q.json.txt` and
`raw-out-mutants-r2.json.txt`. The harness is `raw-harness-mutants.mjs.txt`.

**Method.** Each mutant is an exact-string edit, asserted to match exactly once. Stages:

- **P:** the shipped `search()` on the six roots at d1–d3, in plain node, diffed against the
  clean reference `raw-out-probe-clean.json.txt`. It asks whether the mutant is a real defect
  (score or move changed) or a cost-only one (only nodes changed).
- **A:** the default lane of the four `ABC-079` test files (89 rows).
- **B:** `SEARCH_DEEP=1` on `src/quiescence.test.ts` + `src/search.test.ts` (80 rows).
- **C:** runs only when A and B are both all-green, or when forced for the R2 family. It is the
  whole default lane `--dir src` (1392 rows) plus `ENGINE_DEEP=1 src/engine.test.ts` (33 rows).

Each stage is a killable process group. The kill limits are P 240 s, A 300 s, B 600 s. Rows
stream to a file, so a killed run still names what went red. The revert is
`git checkout -- <file>`, and `git status --porcelain -- src` was asserted **EMPTY after every
mutant (16 of 16 `srcCleanAfterRevert: true`)**. Load (1-min) was 2.7–8.5 during the round.

## The seven the brief asked for, in `quiesce`/the door

| mutant | edit | real defect? (P) | rows RED |
|---|---|---|---|
| `Q1` no stand-pat cutoff | drop `if (standPat >= beta) return standPat` | no, cost only (kiwipete d1 nodes 5 878 → 13 460) | **RED.** A: `A5` kiwipete d1 (274.7x > 180), `A5` pos-6 d1 (22.7x > 10), engine `A2` node bound (17 555 > 10 240). B: 8 rows, including all four deep `A5` levels, `A1` kiwipete d2 **timeout** (58.4 s > 30 s) and **`A4` deep timeout (245.9 s > 120 s)** |
| `Q2` stand-pat not raising alpha | drop the pre-loop `if (best > alpha) alpha = best` | no, cost only | **RED on ONE row:** `A5` position-6 d1 (11.83x > 10), in A and B. Thinnest margin in the ledger |
| `Q3` capture order reversed | sort ascending | P KILLED@240 s (cost explodes) | **RED.** A (242.6 s): `A5` kiwipete d1 (**73 453x** > 180, 40.1 s), `A5` pos-6 d1 (595x > 10), `A1` position-4 d2 (timeout, 66.4 s > 5 s), `A4` depth 1 (timeout, 41.9 s > 5 s), engine `A2` (3 603 304 > 10 240). B killed@600 s: `A3` broad (timeout, 107 s > 60 s), both `A5` d1 |
| `Q4a` cap 8 → 9 | `qply > MAX` | **yes** (11 cells differ) | **RED.** A: `A3` default corpus, `A3` rig, `A5` kiwipete d1, engine `A2`. B: 4 rows, including `A3` broad |
| `Q4b` cap 8 → 7 | `qply >= MAX - 1` | **yes** | **RED.** A: `A3` rig (deepest 7 ≠ 8), engine `A2`. B: `A3` rig |
| `Q5a` quiet moves at the leaf | `captured !== EMPTY \|\| qply === 0` | **yes** (18 cells) | **RED, 17 rows** in A: all five `A2`, nine `A4`, `A5` pos-6 d1, engine `A3` abort-move, engine `A4` depth guard. 17 in B |
| `Q5b` quiet moves everywhere | push every move | **yes** | **RED, 25 rows** in A (241.7 s), including `A1` startpos d2 (206.5 s timeout). B killed@600 s with 21 red |
| `Q6a` promotion key term dropped | `+ 0` for `ORDER_VALUE[promotion]` | no, 6 node counts move, lossless | **NONE anywhere: A 0/89, B 0/80, C 0/1392, ENGINE_DEEP 0/33. SURVIVES (G4)** |
| `Q6b` promotion key term negated | `-` instead of `+` | no, 9 node counts move | **RED.** A: engine `A2` node bound. B: `A5` kiwipete d2 (> 50x) |
| `Q7` door calls with quiescence ON | `{ prune: false, quiescence: true }` | n/a (the door is not `search()`) | **Default lane: NONE (A 0/89).** B: 0 red of 54 finished, then killed@600 s inside the kiwipete bare-leaf pair (~1 016 s once the door runs quiescence). The follow-up `-t` run reds **`A1` position-3 d3 bare leaf** (`expected 130 to be 110`, 182 ms) and **`A1` position-4 d3 bare leaf** (`expected -205 to be -375`, 22.4 s) (`raw-out-q7row.log.txt`). So it is RED by assertion, but only once the lane runs for more than 17 minutes (G5) |

## Ruling 2: the conjunction the oracle ruling gave up

The gate K (≥ K captures at the leaf) was chosen by scan (`raw-out-kscan.json.txt`). K = 5 is
the smallest value at which `startpos` and `position-3` d3 are untouched even in node count,
while kiwipete, position-4 and position-6 still change score or move. `R2b` and `R2c` give
identical probe diffs at every K tested.

| mutant | P at depth 3 (clean → mutant) | A | B | C default | C `ENGINE_DEEP` |
|---|---|---|---|---|---|
| `R2a` leaf null-window slip at ply ≥ 3, finite window | kiwipete **50 e2a6 → 205 e5g6**; pos-4 **−375 c4c5 → −285 g1h1**; pos-6 **30 → 145**; startpos and pos-3 nodes only | 0/89 | 0/80 | 0/1392 | **2 red:** identity sweep over six roots + children (21 divergences), `A3` literal (`expected 'e2e3' to be 'g4g5'`) |
| `R2b` = `R2a` + ≥ 5 captures | kiwipete **→ 205 e5g6**; pos-4 **→ −285 g1h1**; pos-6 **→ 120** | 0/89 | 0/80 | 0/1392 | **0/33, SURVIVES** |
| `R2c` inside `quiesce`: black to move, qply 0, finite window, ≥ 5 captures | identical to `R2b` | 0/89 | 0/80 | 0/1392 | **0/33, SURVIVES** |

What this says:

- **The retained quiescence-on depth-3 cells cannot see this class.** Their boards never carry
  five captures at a depth-3 leaf, and even the ungated slip leaves their scores alone.
- **The `A5` deep rows run the very searches that change**, `search(kiwipete, 3)` and
  `search(position-6, 3)`. They assert only the node ratio, and the mutants LOWER the ratio
  (e.g. 295 106 / 9 016 = 32.7x, under 70x).
- **The engine's identity sweep is a cross-implementation oracle.** It catches a defect in ONE
  copy of the leaf (`R2a`, in `search.ts` only). By construction it cannot catch a defect in
  the shared `quiesce` (`R2c`).
