---
id: 20261011T143751Z-qe-e2e-observation-abc083-seed5061-readings-lmr-near-tie-at-d5-67b0c99a
kind: observation
by: qe-e2e
at: 2026-10-11T14:37:51Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-084
  - ABC-121
  - ADR-0034
  - ADR-0028
  - ADR-0026
  - src/puzzle-corpus.ts
  - src/evaluate.ts
  - .grugops/context/ticket-to-pr-ABC-083/probe/puzzle-5061-ladder.txt
  - .grugops/context/qe-ABC-083-seed5061/probe/summary.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/ladder.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/rootscores.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/heuristics.tsv
  - .grugops/context/qe-ABC-083-seed5061/probe/idvariants.tsv
supersedes:
---

# Seed 5061: deterministic and load-free. The branch's own evaluator prefers the label move in every full-width search from d4 to d6. Only the shipped LMR's d5 iteration flips it, by 5 cp

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

The row is `win material, seed 5061` (`8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w`, accepts `f5e6`/`g1a7`,
tag `quiescence`). Trees: base `5ed308a8`, branch tip `67c189b9`. Machine: Apple M3, 8 cores,
16 GiB, Node v26.11.0. Every reading below is QE's own. The Engineer's ladder (`puzzle-5061-ladder.txt`,
at `79248602`) was used only as a pointer.

## 1. It is not load and not the clock

`PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`, three rounds alternating base and branch
(`quiet-runs.sh`, `summary.tsv`, `r{1,2,3}-{base,branch}.txt`):

| run | load1 start → end | thermal | solved | seed 5061 |
|---|---|---|---|---|
| r1 base | 3.04 → 3.01 | 0 | 54/58, exit 0 | SOLVED `f5e6` d5 n20 507 |
| r1 branch | 3.01 → 3.76 | 0 | 53/58, exit 1 | MISSED `g2e1` d5 n20 507 |
| r2 base | 3.76 → 3.79 | 0 | 54/58, exit 0 | SOLVED `f5e6` d5 n20 507 |
| r2 branch | 3.79 → 3.96 | 0 | 53/58, exit 1 | MISSED `g2e1` d5 n20 507 |
| r3 base | 3.96 → 3.74 | 0 | 54/58, exit 0 | SOLVED `f5e6` d5 n20 507 |
| r3 branch | 3.74 → 3.89 | 0 | 53/58, exit 1 | MISSED `g2e1` d5 n20 507 |

- All 58 per-row lines are byte-identical across the three runs on each side (`md5` of the `.rows` files:
  base `c17ce1ec…` ×3, branch `1068d386…` ×3). They also equal the build's lines, which were taken at
  load1 up to 43.8.
- Seed 5061 is the only `NEWLY-MISSED` row. ABC-084 `A1` (10/10 mates) and `A2` (do-not-hang) are green.
  The two ABC-127 oracle rows are green (mate-in-3 8 rows, win-material 16 rows).
- In deterministic mode the budget is a node count (`ADR-0034` Context). Load cannot move this row. The
  identical lines above confirm that.

## 2. The readings ladder, on the tip (`row5061.mjs`, the suite's exact call; `ladder.tsv`)

| readings | base | branch | king safety only (mobility 0) | mobility only (king safety 0) |
|---|---|---|---|---|
| 20 (0.8x) | `f5e6` d5 | — | — | — |
| 25 (recorded) | `f5e6` d5 | **`g2e1` d5** | **`g2e1` d5** | `f5e6` d5 |
| 26.25 (+5 %) | `f5e6` d5 | **`g2e1` d5** | **`g2e1` d5** | `f5e6` d5 |
| 27.5 (+10 %) | `f5e6` d5 | **`g2e1` d5** | **`g2e1` d5** | `f5e6` d5 |
| 31.25 (+25 %) | `f5e6` d5 | **`g2e1` d5** n27 675 | **`g2e1` d5** | `f5e6` d5 |
| 37.5 (+50 %) | `f5e6` **d6** | **`g2e1` d5** n33 819 | **`g2e1` d5** | `f5e6` d6 |
| 50 (+100 %) | `f5e6` d6 | `f5e6` **d6** n45 083 | `f5e6` d6 | `f5e6` d6 |
| 75, 125 | `f5e6` d6 | `f5e6` d6 | `f5e6` d6 | `f5e6` d6 |

- The base meets `ADR-0034` decision 5's 0.8x margin (20 readings: `f5e6` d5, `idvariants.tsv`).
- The branch misses at base's depth (d5) on every rung up to +50 %. It solves once d6 completes, at +100 %.
- **The cause is king safety, not mobility.** King safety alone reproduces the miss, and mobility alone
  does not. This matches the build's "king safety alone also misses it".

## 3. The branch's evaluator does not prefer `g2e1`. Its full-width searches all play `f5e6`

`heuristics.mjs` runs fixed-depth `search()` and each test-only door at d4, d5 and d6, plus `chooseMove`
and its two doors at the suite budget (`heuristics.tsv`):

| tree | `search` d4 / d5 / d6 | `…WithoutReductions` d5 / d6 | `…WithoutPvsOrReductions`, `…WithoutTable`, `…WithoutKillers` d5 / d6 | `chooseMove` (25 readings) | `chooseMoveWithoutReductions` |
|---|---|---|---|---|---|
| base | `f5e6` / **`g2e1`** −1160 / `f5e6` | `f5e6` −1175 / `f5e6` | `f5e6` / `f5e6` | `f5e6` d5 −1175 | `f5e6` d5 |
| branch | `f5e6` / `f5e6` −1300 / `f5e6` | `f5e6` −1300 / `f5e6` | `f5e6` / `f5e6` | **`g2e1` d5 −1295** | `f5e6` (d4 at 25; d5 at 50, −1300; d6 at 100) |
| king safety only | `f5e6` / `f5e6` / `f5e6` | `f5e6` / `f5e6` | `f5e6` / `f5e6` | **`g2e1` d5 −1195** | `f5e6` |

The root moves' clean values: each child is searched at depth − 1 and negated (`rootscores.tsv`).

| tree | d5: `f5e6` / `g1a7` / `g2e1` | d6: `f5e6` / `g1a7` / `g2e1` |
|---|---|---|
| base | −1175 / −1190 / −1295 | −1185 / −1190 / −1295 |
| branch | **−1300 / −1300 / −1355** | −1300 / −1310 / −1355 |

- On the branch evaluator, `f5e6` leads `g2e1` by **55 cp** at d5 and at d6, searched cleanly. On base the
  lead is 120 cp at d5.
- `chooseMove`'s d5 iteration returns `g2e1` at **−1295**. That is 60 cp above its clean d5 value (−1355)
  and 5 cp above `f5e6`'s (−1300).
- **Reductions are necessary for the miss.** Every no-reduction door plays `f5e6` at every depth it
  completes. The flip happens only with LMR on.
- **The same LMR path flips this row on base too.** Base's fixed-depth `search()` at d5 plays `g2e1` at
  −1160, against a clean −1295. Base's `chooseMove` d5 iteration plays `f5e6`. Why the two paths differ
  (presumably the table and ordering state the earlier iterations leave) was not read: `UNKNOWN - verify`.
  The measured fact is that the row was already LMR-fragile at d5 on base. The evaluator change moved
  which of the two paths, fixed-depth or deepening, lands on the flip.
- **This is within the accepted drift.** `ADR-0026` decision 9 bounds LMR at d5 to 95 % of positions within
  25 cp, and none beyond 75 cp. Here the root drift is `chooseMove` −1295 against `chooseMoveWithoutReductions`
  −1300, which is 5 cp. The over-scored move is 60 cp off its own clean value, which is under 75. LMR is
  lossy by design, and this miss is that loss landing on a 55 cp near-tie.

## 4. The weight band (diagnostic for `ADR-0028` decision 1 proof 2 only; not a re-weight)

The three king-safety penalties were scaled together, with mobility kept at 4 cp, using the suite's call
at 25 and 31.25 readings (`idvariants.tsv`):

| king-safety scale | 0.5x | 0.75x | 1.0x (shipped) | 1.25x | 1.5x |
|---|---|---|---|---|---|
| seed 5061 | SOLVED `f5e6` | MISSED `g2e1` | MISSED `g2e1` | MISSED `g2e1` | MISSED `g2e1` |

The miss does not change with the weights across 0.75x–1.5x. It clears only at half weight. The scratch
trees and the one-line edits are recorded (`variants.diff` covers the king-safety-only and mobility-only
trees). Nothing in the repository was edited.

## 5. Depth shifts on solved rows (descriptive; solved rows are not classed)

Branch against base, per row (`depth-shift.txt`): 7 rows shallower, 2 deeper, 49 at the same depth, and 20
rows changed move but stayed solved. This is the per-row view of the tree growth that `A9` read
(position-6 nodes to depth 7 +39.2 %). It is not a red, and `ADR-0034` decision 3's table classes missed
rows only.
