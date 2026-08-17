---
id: 20260818T002600Z-qe-e2e-observation-mutation-results-fourteen-mutants-5a4dc118
kind: observation
by: qe-e2e
at: 2026-08-18T00:26:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - src/search.ts
  - src/evaluate.ts
  - src/search.test.ts
supersedes:
---

# Fourteen mutants at the QE hop. Nine killed, five survived. The engineer's five reproduced; his `A5` isolation claim verified.

Every mutant was applied to a single file on the tip, the suite run through the runner's JSON reporter, then the file restored from a copy taken before the edit and `git status --porcelain` checked clean afterwards. **`src/search.ts` and `src/evaluate.ts` on the branch are the unmutated originals.**

## Results

| # | mutant | file | default lane | verdict |
|---|---|---|---|---|
| `Q1` | leaf `evaluate()` blanked to `0 * evaluate(...)` | search | 1 red (`A5` in-tree, by tie-break) | **survives in substance** |
| `Q2` | leaf `evaluate()` sign-flipped | search | 2 red (`A5` in-tree, `A2` ratio) | **survives in substance** |
| `Q3` | `PIECE_VALUE` ROOK ↔ QUEEN | evaluate | **0 red** (and 0 in the deep lane, 0 repo-wide) | **SURVIVES** |
| `Q4` | `depth ?? 4` — a default depth the regex cannot see | search | **0 red** | **SURVIVES** — `G1` |
| `Q5` | `alpha >= beta` → `alpha > beta` | search | 0 red (deep lane 0 red) | **SURVIVES** |
| `Q6` | cutoffs only at `ply < 2` (half the pruning gone at depth 3) | search | 0 red (deep lane 0 red) | **SURVIVES** — `G3` |
| `Q7` | cutoffs only at `depth < 2` (frontier only) | search | 0 red (ratios measured, no test asserts them) | **SURVIVES** — `G3` |
| `Q8` | interior stalemate scored as mate (`negamax`'s no-moves branch) | search | 1 red — `A5` in-tree only | killed by `A5` |
| `Q9` | leaf draw scored as mate (`leafScore`'s `return 0`) | search | 3 red — `A5` depth-0 cases | killed by `A5` |
| `Q10` | root stalemate scored as mate (`searchRoot`'s no-moves branch) | search | **9 red** — `A5` depths 1-3, all three fixtures | killed by `A5` |
| `Q11` | root never updates `bestMove` | search | 3 red — both `A3` cases, `A5` in-tree | killed by `A3` |
| `Q12` | root never raises `alpha` | search | 1 red — `A2` | killed by `A2` |
| `Q13` | `search` ships with `prune = false` | search | 1 red — `A2` | killed by `A2` |
| `Q14` | interior `unmakeMove` dropped at depth-2 nodes | search | 4 red — `A1` position-3 d3, `A7` position-3 d3, both `A3` | killed by `A1`/`A3`/`A7` |

## What the survivors say

- **`Q3` and `Q4` are the two HIGH gaps** and have their own notes.
- **`Q5`, `Q6`, `Q7` are one finding: `A2`'s bar cannot see partial pruning loss.** Measured ratios, unmutated: kiwipete d3 **9016/99950 = 9.0%**, startpos d2 **114/421 = 27.1%**, startpos d3 11.8%, position-3 d3 17.6% — reproducing the engineer's figures exactly. Under `Q6` kiwipete d3 rises only to **16.6%**; under `Q7` to **12.4%**. Both are far inside the 40% bar. **`A2` is a binary "is pruning switched on" detector, not a pruning-quality detector**, and the slack is 4.4x at the criterion's own position. Moving the bar is the ticket's business, not QE's; I record the sensitivity and leave the number alone.
- **`Q1`/`Q2` "survive in substance"** because their reds are side effects (tie-break order, pruning statistics), not detections. See the blind-spot note.

## The engineer's `A5` isolation claim — VERIFIED, and decomposed

He reported that scoring stalemate as a mate left `A1`-`A4`, `A6` and `A7` green and killed only `A5`, 4 cases. **Confirmed, in three parts rather than one:** his `M1` mutated both terminal branches at once; I mutated all three separately.

- leaf branch (`Q9`) → **3 red**, `A5`'s depth-0 cases;
- interior branch (`Q8`) → **1 red**, `A5`'s in-tree case;
- root branch (`Q10`) → **9 red**, `A5`'s depth 1-3 cases.

In every one of the three, `A1`, `A2`, `A3`, `A4`, `A6` and `A7` **stayed green**. The union of `Q8` and `Q9` is exactly his 4 cases. `A5` is the strongest guard in the file: it is the only criterion covering all three terminal branches, and writing it first was correct.

## The default lane's one retained depth-3 pair is load-bearing — verified

`Q14` is the demonstration. The default-lane `A4`/`A7` corpus runs at **depth 1**, and a depth-1 search never enters `negamax`'s move loop at all — so it exercises the **root's** make/unmake and nothing else. The `position-3` depth-3 pair the engineer kept in the default lane is the **only** default-lane case that reaches interior make/unmake, and `Q14` reds precisely through it. His judgement there was right and is now measured, not asserted.
