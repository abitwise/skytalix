---
id: 20260925T061300Z-architect-design-observation-g1-oracle-agrees-on-all-six-depth3-g2-broad-d2-is-the-whole-cost-4f7b2d19
kind: observation
by: architect-design
at: 2026-09-25T06:13:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - .grugops/context/qe-ABC-079/notes/20260924T215000Z-qe-e2e-decision-abc079-fail-four-false-search-ts-sentences-behaviour-meets-a1-a6-conjunction-gap-real-and-move-changing-a4-a7-lane-risk-2c7e91a4.md
  - .grugops/context/qe-ABC-079/notes/20260924T215100Z-qe-e2e-observation-abc079-mutant-ledger-seven-asked-plus-conjunction-three-survive-everything-q6a-survives-raw-rows-5d8a0f37.md
supersedes:
---

# Probe numbers behind the G1/G2 ruling. G1: the retired unpruned quiescence oracle agrees with the shipped `search()` at depth 3 on all six roots, and the depth-3 pins go red on both surviving mutants. G2: one corpus slice, the broad corpus at depth 2, holds the whole cost

**NOT A STAMP.** `context.human_admission` is `off`, so this is a hand-authored `observation`.

All runs were against `grugops/int-ABC-079` @ `9b4dd68`, in the worktree for
`grugops/ruling-abc079-g1g2`. The worktree's `src/` was never edited: the mutants ran on scratch
copies outside the tree, and `git status --porcelain` showed only this note's directory and the
queue claim. The machine has 8 cores, and load is the 1-min average. Each figure is one run. The
harnesses and the raw output sit beside this note as `raw-*.txt`.

## G1a: the oracle check that QE left as `UNKNOWN - verify`, now run (plain node)

`search(p, 3)` against `searchWithoutPruning(p, 3)`. That is the full-window, unpruned
quiescence-leaf oracle that the oracle ruling retired from the lane on four boards
(`raw-harness-g1-oracle.mjs.txt`, `raw-out-g1-oracle.jsonl.txt`).

| root | shipped score / move / nodes | oracle score / move / nodes | oracle wall (node) | equal |
|---|---|---|---|---|
| startpos | 50 / b1c3 / 1 003 | 50 / b1c3 / 11 835 | 0.08 s | score and move |
| position-3 | 110 / b4f4 / 892 | 110 / b4f4 / 10 249 | 0.03 s | score and move |
| position-4 | −375 / c4c5 / 14 727 | −375 / c4c5 / 2 103 430 | 4.0 s | score and move |
| position-5 | 560 / d7c8=Q / 42 542 | 560 / d7c8=Q / 2 462 223 | 8.3 s | score and move |
| **position-6** | **30 / c3d5** / 120 239 | **30 / c3d5** / 11 261 137 | 28.0 s | score and move |
| **kiwipete** | **50 / e2a6** / 405 945 | **50 / e2a6** / 62 706 867 | 161.9 s | score and move |

Load was 2.8–5.6. The shipped node counts reproduce QE's clean reference
(`qe-ABC-079/notes/raw-out-probe-clean.json.txt`) to the node. The oracle's kiwipete count,
62 706 867, is the oracle ruling's own figure. **So the depth-3 values `{50, e2a6}` on kiwipete
and `{30, c3d5}` on position-6 are oracle answers, not only a regression fingerprint.** "Oracle"
here means the same thing it has always meant in this file: main-tree alpha-beta, and the window
the main tree hands the leaf, checked against a search that never narrows either. That oracle
does not brute-force `quiesce`'s own inner alpha-beta.

## G1b: do the pins go red? (plain node, scratch copies of `src/`)

QE's two surviving conjunction mutants, the exact edits, at K = 5 (`raw-harness-g1-mutants.mjs.txt`,
`raw-out-g1-mutants.txt.txt`):

| build | kiwipete d3 | position-4 d3 | position-6 d3 |
|---|---|---|---|
| clean | 50 e2a6 (405 945) | −375 c4c5 (14 727) | 30 c3d5 (120 239) |
| `R2b` (leaf slip, capture-dense) | **205 e5g6** (295 106) | **−285 g1h1** (14 043) | **120** c3d5 (45 659) |
| `R2c` (slip inside `quiesce`) | **205 e5g6** (295 106) | **−285 g1h1** (14 043) | **120** c3d5 (45 659) |

This reproduces QE's ledger exactly. A `{score, move}` pin on kiwipete d3 goes red on both score
and move. A pin on position-6 d3 goes red on score. Both mutants LOWER the node ratio (295 106 /
9 016 = 32.7x, under the 70x level), which is why `A5` as written cannot see them.

## G2: where the `A4`/`A7` deep cost actually sits (under vitest, cold)

The harness is the real `src/search.test.ts` copied out of tree, with its imports pointed at
the worktree's `src/`, plus probe cases that clear both memos first. Every case ran in its own
vitest process, `pool: "threads"`, `SEARCH_DEEP=1` (`raw-harness-g2-*.mjs.txt`,
`raw-out-g2-*.jsonl.txt`). Each timeout is 120 000 ms.

| case (cold, alone) | ms | share of 120 s | load |
|---|---|---|---|
| **control: `A4` deep as shipped** | **62 436** | **52.0%** | 3.4 → 5.3 |
| **control: `A7` deep as shipped, run alone** | **99 812** | **83.2%** | 5.3 → 4.3 |
| `corpusRun("default", 2)` | 1 172 | 1.0% | 4.3 |
| `corpusRun("broad", 1)` | 1 180 | 1.0% | 3.3 |
| **`corpusRun("broad", 2)`** | **62 474** | **52.1%** | 4.3 → 4.5 |
| `searchPair(root, 2, "quiescence")` × 6 (A1's d2 pairs) | 15 574 | 13.0% | 5.6 → 5.2 |
| `search(root, 3)` + bare door d3 × 6 (A7's sweep) | 16 063 | 13.4% | 5.2 |

The broad corpus at depth 2, split by root (one vitest process, six cases, load 4.2–4.6):

| root | positions | ms | share of 120 s |
|---|---|---|---|
| startpos | 21 | 79 | 0.1% |
| **kiwipete** | **49** | **45 728** | **38.1%** |
| position-3 | 15 | 49 | 0.0% |
| position-4 | 7 | 347 | 0.3% |
| position-5 | 45 | 3 460 | 2.9% |
| position-6 | 47 | 8 832 | 7.4% |
| sum | 184 | 58 495 | |

What the numbers say:

- **`A4` deep is `corpusRun("broad", 2)` and nothing else.** Its other two runs cost 2.4 s
  together. Splitting `A4` into one case per corpus run leaves one case at **52%**, which is the
  same exposure as today.
- **`A7` deep run alone is the four components added up** (1.2 + 62.5 + 15.6 + 16.1 = 95.4 s,
  measured 99.8 s). It read **83%** here, against QE's 77.4% at a lower load.
- **Splitting the broad corpus by root caps the worst cold case at kiwipete's 38%.** Crossing
  120 s would then take about 2.6x today's reading, against 1.9x for `A4` today and 1.2x for
  `A7` run alone. The per-root slices cover exactly the broad corpus (184 positions), so no
  position is dropped.
