---
id: 20261030T013022Z-software-engineer-observation-79fe0aa4
kind: observation
by: software-engineer
at: 2026-10-30T01:30:22Z
verified_by: 
confidence: high (deterministic; cmp byte-identical; plants watched red)
refs:
  - ABC-240
  - EPIC-010
  - ABC-235
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - bapm-ABC-235-split
  - grugops/ABC-240
  - 0e0ef856
  - 69e19fc4
  - 7913499d
  - ABC-078
  - ABC-121
  - ABC-206
  - ADR-0026
  - NFR-004
  - src/search.ordering.test.ts
  - src/quiescence.test.ts
  - se-ABC-235/raw/
  - qe-ABC-235/raw/scripts/a1-sample.mjs
  - .grugops/context/se-ABC-240/raw/
supersedes: 
seal: sha256:794bcfef0cdca59811edfa8edecc4c2f744f42328a6f5a34728c7f1fd517eb32
---

# Software Engineer observation, se-ABC-240: A1 byte-equal to the merge base at both commits; the A2 oracle rows, each planted red

## A1, cross-build, out of tree, plain `node` (Node v26.12.1), against `0e0ef856`
- **The harness** is ABC-235's, unchanged: `se-ABC-235/raw/a1.mjs` and `run-a1.sh`, driven by `se-ABC-240/raw/a1pair.sh`, with 8 shards. The base is `git archive 0e0ef856 src`, and each head is `git archive` of the commit. Rows are JSON lines, compared with `cmp`. No golden file is committed.
- **The corpus**: ABC-078 `A3` ∪ ABC-121's 190, deduplicated by FEN, gives 301 positions. **6 021 rows**:
  - the lists and `evaluate`;
  - `chooseMove` and its three doors at budgets 3 and 5 on `tickingClock(1)` (move, score, completed depth, nodes, clock reads, purity; 2 408 rows);
  - `search`, `searchWithoutNullMove`, `searchWithoutReductions` and `searchWithoutPvsOrReductions` at depth 5;
  - `searchWithoutTable`, `searchWithoutKillers`, `searchWithoutOrdering` and `searchWithoutQuiescence` at depth 5;
  - `searchWithoutPruning` and `searchWithoutPruningOrQuiescence` at depth 2, the layout QE ruled ACCEPTABLE for ABC-235.
- **The result**: sha256 `812f86ae46766537f73657b70f447f4c2e61d124051e0629fb374f90ac2bd000` for the base, item 1 `69e19fc4` and item 2 `7913499d` alike. `cmp` is byte-identical, with 0 `"pure":false` rows. This is also the hash ABC-235's base and tip produced.
- **The unpruned doors at depth 5, a sample** (`se-ABC-240/raw/sample.sh`, which drives QE's `qe-ABC-235/raw/scripts/a1-sample.mjs`). It runs both doors at depth 5 on the six endgame families and `position-3`: 132 positions, 264 rows per build. The base and the tip `7913499d` both hash to sha256 `63173dde63fb246a044bee007a6ac9ede6087ae25ebed79c62e0a312523b96a5`, `cmp` equal, 0 impure. The hash differs from QE's ABC-235 `6a76ebab…` only because the row order follows the 8-shard layout.
  - Why the sample: unlike ABC-235, this ticket changes `src/search.ts` and `src/quiescence.ts`, and the unpruned doors run with ordering `"full"`.
  - The midgame families at depth 5 stay unread, as in ABC-235.
- **G1, out of tree**: all 58 puzzle rows (`virtualClock`, the baseline's budget) are byte-equal between base and tip, with move, score, depth and nodes. sha256 `ade68870a257d78c…` for both, the same as ABC-235's.

## A2, the oracle (`arch-ABC-235` cut 6 P1, P2, C1–C4)
- **(P1)** `src/search.ordering.test.ts`. The new `orderMoves` must equal `referenceOrderMoves`, a verbatim copy of the base's map/sort/map with its private `orderKey` and `sameMove`. It is compared by `Move` identity on every node of the walk: the six perft roots plus ABC-206's six terminal and clock FENs.
  - Five variants per node: none; two quiet killers from the list; an absent killer plus a COPIED killer, with a hash move from the list (a capture when there is one); an absent hash move; and a foreign position's move as both killer and hash.
  - The input list must be identity-equal per index after every call.
  - Depth 1 runs in the lane. Under `ENGINE_DEEP=1` the walk goes to depth 3, and the row asserts **exactly 285 074 nodes**. It ran green in about 4 s, with 5 orders compared per node.
- **(P2)** `src/quiescence.test.ts`. `orderCaptures` must equal the base's `captures.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a))` by `Move` identity, element by element. It is checked on `legalCaptures` at every node of the same walk, both as generated and reversed (so ties arrive in a non-generation order). Depth 1 runs in the lane; depth 3 under `ENGINE_DEEP=1` asserts 285 074 nodes and more than 1 000 000 captures, green.
- **C1**: kiwipete's legal list reversed keeps its quiet moves reversed, and two same-key capture groups keep the given order both ways round (both files).
- **C2**: `4k3/8/8/3p4/8/2N5/B7/3QK3 w - - 0 1` gives Nxd5, Bxd5 and Qxd5 of one pawn. They order N, B, Q from either input order, equal to the reference (both files).
- **C3**: position-6's list is identity-equal and `JSON.stringify`-equal after a call with killers and a hash move.
- **C4**: two calls in a row return two distinct arrays, neither of them the input, and the first is unchanged by the second.
- **Plants, each watched red, then restored:**
  - Non-strict `<=` in `orderMoves`: 7 rows red (P1, C1, C4, the stable-order row, and three node-count rows).
  - Float32 keys in `orderMoves`: 5 red (P1, C1, C2, C4, an A4 node count).
  - Sorting the input in place (`out = moves`): 4 red (P1, C3, C4, the old "does not mutate" row).
  - Non-strict `<=` in `orderCaptures`: 2 red (P2, C1).
  - Float32 keys in `orderCaptures`: P2 red. C2 alone does not catch this one, because without the 1 000 000 tier, float32 still separates 99.68 from 99.67. The test comment says so.
