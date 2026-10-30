---
id: 20261030T050005Z-software-engineer-observation-a836f535
kind: observation
by: software-engineer
at: 2026-10-30T05:00:05Z
verified_by: 
confidence: high on hashes and red checks as run; one host, plain node v26.12.1
refs:
  - se-ABC-230
  - ABC-230
  - ADR-0054
  - ABC-078
  - ABC-121
  - ABC-235
  - grugops/ABC-230
  - 2fbcb380
  - c0698ddd
  - .grugops/context/se-ABC-230/raw/id-result.txt
supersedes: 
seal: sha256:8aad57396ad8f7c6985aafc4da2560a4b5df8f9ac1757712b16866b7e5d49d62
---

# Software Engineer observation, se-ABC-230: identity with base (no prior keys; root clock 0) and the acceptance rows' red checks

## Identity out of tree, the ABC-235 harness pattern
Run with plain `node` v26.12.1. The base is `main` `c0698ddd`'s `src/` (`git archive`). The head is `grugops/ABC-230` `2fbcb380`'s `src/`, and its production files are `cmp`-identical. Driver: `raw/id.mjs` + `raw/run-id.sh`. Summary: `raw/id-result.txt`. The corpus is 301 positions: `ABC-078` `A3` (the endgames with their in-progress children, `broadCorpus`) plus `ABC-121`'s 190, deduplicated by FEN. A base tree ignores the unknown `priorKeys` field, so each part runs the same script on both trees. Rows carry move, score, depth, nodes, clock reads and a purity flag.

| part | rows | sha256[0:16], base = head | what it shows |
|---|---|---|---|
| choose | 2 408 | `8a50e586b3600107` | `chooseMove` + 3 doors, budgets 3 and 5, no list: node-equal and clock-read-equal (`A4`, `G4`, `G5`, `G6` boards included) |
| choose-empty | 2 408 | `8a50e586b3600107` | `priorKeys: []` (`A3`) |
| clock0 | 2 408 | `8a50e586b3600107` | root clock forced to 0, adversarial list (25 keys of positions 1–2 plies on, each 4 times, so 2 per parity) (`A9`, probe H4 generalised) |
| doors-prior | 1 806 | `ba93283af174b6d9` | the 3 doors at clock 99 with the adversarial list: the doors take no prior keys |
| level | 1 806 | `7c44b4a223572997` | `createLevel` at the rates of levels 1, 3 and 5, seeds 1 and 7, no list |
| level-empty | 1 806 | `7c44b4a223572997` | the same with `[]`, so blunder children get `[rootKey]` |
| nonvac | 602 | base `bcad32bce2ff5e5b` ≠ head `1e420a7989cfe2fc` | non-vacuity: `chooseMove` at clock 99 with the adversarial list differs on 248 of 602 rows, so the list is read |

There are 0 impure rows in any head output.

## Fixture probe (`raw/fix.mjs`, `raw/fix.txt`)
Probe H1 is reproduced exactly at depth 4: base Kc8 −1006 (524 nodes); with keys, Ke8 0 (96 nodes). All four `A1` fixtures, both colours, play the repetition at 0 with keys at depths 3, 4 and 5, and base plays otherwise at a score ≠ 0. H2 (second occurrence) is node-equal to base at depths 3, 4 and 5, both colours.

## Red checks (mutation, then restored; the diff is clean)
- The count changed from 2 to 1 (the one-match rule): `A8` × 2 and `A5` "older than the clock" went red. This is `ADR-0054` § Rollback's row.
- The 100 cap removed (the whole list read): `A5` "at most the last 100" went red.
- The clock bound removed: `A9` "A1 fixtures at clock 0" and `A5` "older than the clock" went red.
- `parsePosition` handing `[]`: `A2` × 3 and `A5` × 2 (UCI) went red.
- The `ucinewgame` reset removed: `A3` (UCI) went red.
