---
id: 20261030T001117Z-qe-e2e-observation-fc0f28a0
kind: observation
by: qe-e2e
at: 2026-10-30T00:11:17Z
verified_by: 
confidence: high (deterministic; cmp byte-identical; rows reproduce the SE hash)
refs:
  - ABC-235
  - EPIC-010
  - EPIC-008
  - qe-ABC-235/20261029T221316Z-qe-e2e-decision-078c1c09
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - se-ABC-235/20261029T220404Z-software-engineer-decision-e64c9f42
  - se-ABC-235/20261029T220404Z-software-engineer-observation-ebba6a59
  - se-ABC-235/20261029T220404Z-software-engineer-observation-67655916
  - se-ABC-235/20261029T220404Z-software-engineer-observation-cf540c21
  - grugops/qe-ABC-235
  - a37f1d87
  - 6327a3b4
  - f9576af3
  - ABC-078
  - ABC-121
  - ADR-0026
  - NFR-004
supersedes: 
seal: sha256:dd76aee06757e8ebe8c8e3ac68f709be248a8288f874f1bc76ae1be00ae271ba
---

# ABC-235 A1 re-run at the tip: 6 021 rows byte-equal to base, sha256 equal to the SE's 812f86ae…; the unpruned doors' depth 2 is ACCEPTABLE, with a depth-5 sample of 264 rows byte-equal

QE/E2E, task `qe-ABC-235`, read by the pre-registration `…078c1c09`. The trees are the same `git archive` trees as the
timing note: base `a37f1d87` and tip `6327a3b4`. Plain node v26.12.1, out of tree. One process at a time, run
22:21:53Z–23:50:27Z. No golden file is committed. The summary is `raw/a1/a1-summary.txt`.

## A1, the SE's harness unchanged
- **Harness.** `se-ABC-235/raw/a1.mjs`, sha256 prefix `c0f1a2b7ff112220`, used as committed.
- **Runner.** `raw/scripts/run-a1-seq.sh`. It keeps `run-a1.sh`'s file layout, with 6 shards. The shards run one
  process at a time; the SE ran them in parallel.
- **Base and tip: 6 021 rows each, `cmp` byte-identical, 0 `"pure":false` rows.** The sha256 of both is
  `0ead98bd…8ecee1`. Base took 2 793 s, tip 2 089 s.
- **The rows are the same rows as the SE's.** My file's sha differs from the SE's `812f86ae…` only in layout:
  - `run-a1.sh` joins its shards in file-name order, so the shard count orders the search rows.
  - Laid out as 8 shards, with no engine run (`raw/scripts/relayout.mjs`), my base and tip rows hash to
    **`812f86ae46766537f73657b70f447f4c2e61d124051e0629fb374f90ac2bd000`**. That is the SE's value, in full.
  - So the SE ran 8 shards, though the SE's note does not say so. This is a LOW documentation slip, not a gap against the ticket.
- **An independence the re-run adds.** The tip's pawn memo lives per process. My 6-shard run grouped positions into
  processes differently from the SE's 8, so the memo saw a different history in every process. The rows are still
  identical. A1 cannot see the memo's state.
- **Rows by function** (tip):
  - `search`, `searchWithoutNullMove`, `…Reductions`, `…PvsOrReductions`, `…Table`, `…Killers`, `…Ordering` and
    `…Quiescence`: 301 each, at depth 5.
  - `searchWithoutPruning` and `…PruningOrQuiescence`: 301 each, at depth 2.
  - The `chooseMove` family: 2 408 rows at budgets 3 and 5 on `tickingClock(1)`. It reached completed depths 1–5, with
    clock reads in every row.
  - Lists and evaluate: 301 rows. The corpus listing: 302 rows.
- **A1 MET.** That covers `(move, score, depth, nodes)` on every position, and every door node-equal to its pre-ticket
  self, `G4`'s identity half.

## Ruling: the unpruned doors at depth 2 instead of 5
**ACCEPTABLE. No further depth-5 sample is owed.** All four pre-registered terms hold:
- **(a)** `git diff a37f1d87 6327a3b4 -- src/search.ts src/engine.ts src/quiescence.ts` is empty. The doors' own code
  is unchanged. A door is a fixed function of what `legalMoves`, `legalCaptures`, `hasLegalMove` and `evaluate` return
  on the positions it visits.
- **(b)** The eight other search functions are node-equal at depth 5 on all 301 positions. They drive those same four
  functions through millions of nodes at depth 5 and in quiescence.
- **(c) The depth-5 sample is byte-equal.**
  - It is both unpruned doors at depth 5, on the 132 corpus positions in the six endgame families and the `position-3`
    family: 264 rows per build.
  - sha256 `6a76ebab…fd77f4f` for base and for tip. `cmp` equal, and 0 impure rows.
  - The rows total 202 091 899 nodes; the largest single row is 8 237 692. Base took 235 s, tip 197 s.
  - These families exercise the cuts' riskiest paths:
    - king moves on most plies (cut 1's `move.to` branch);
    - en passant, and `position-3`'s rank-pinned en passant (cuts 1 and 3);
    - promotions and capture promotions (cut 3);
    - pawn structures that change on every pawn move (cut 5).
- **(d)** The depth-2 rows on all 301 are equal.
- **What stays unread.** The unpruned doors at depth 5 on the midgame families (`startpos`, `kiwipete`, `position-4`,
  `-5`, `-6`, 169 positions). One row of `position-3` costs about 3.3 s at depth 5, and a midgame root costs far more.
  This is not a gap against the ticket: A1's "every door node-equal" is met by (a)–(d), and no code path of the cuts
  is reached only there.
