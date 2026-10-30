---
id: 20261030T071717Z-software-engineer-observation-06ece474
kind: observation
by: software-engineer
at: 2026-10-30T07:17:17Z
verified_by: 
confidence: high: deterministic cross-build and fixed-depth readings; planted faults applied and restored
refs:
  - se-ABC-228
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 9bd3c519
  - 61d5d629
  - src/quiescence.test.ts
  - Q-SET
  - G4
supersedes: 
seal: sha256:fccedb8fd3db1ccffe0983ef08a969679ba4842750573e0e5ee872b7ae03f847
---

# Software Engineer observation, se-ABC-228: the acceptance rows, the cross-build identity, the oracle readings, and the planted faults

At `grugops/ABC-228` `9bd3c519` (code) against `main` `61d5d629`. Every reading is deterministic, either at a fixed depth or on a frozen clock, and ran in plain `node` or in the existing lanes. Raw output is in `raw/`.

## A1 (`G4`): the doors against base, cross-build, out of tree (`raw/a1.txt`, `scripts/a1.mjs`)
- **Corpus:** 276 positions, from the `ABC-078` `A3` and `ABC-121` sources. They are the six roots and the six mate/stalemate endgames, plus every in-progress child of each.
- **The new pair:**
  - head `searchWithoutQuiescenceEvasions` against base `search()` at depths 1–4: 1 104 rows, 0 differ (nodes, score, move), sha `7a5924b5bf81f303` on both sides;
  - head `chooseMoveWithoutQuiescenceEvasions` against base `chooseMove`, frozen clock to depth 4: 276 rows, 0 differ, `aa3b9cfae2b2631b` on both sides.
- **Every older door against its pre-ticket self:** 0 rows differ, and every door's sha is equal on both sides. The search doors were read at d3 (NullMove, Reductions, PvsOrReductions, Table, Ordering, Killers, Quiescence) and at d2 (Pruning, PruningOrQuiescence). The engine doors (NullMove, Reductions, PvsOrReductions) were read to depth 4.
- **Non-vacuity:** head `search()` differs from base `search()` on 832 of the 1 104 rows (nodes, score or move).

## A2, Q-SET in check (6 rows, Q2 among them; `src/quiescence.test.ts`)
Each row is in check. The legal-move count is pinned. `quiesce` at qply 0 with a full window differs from the static score, equals the best evasion's score one ply deeper, and equals a brute-force evasion search written in the test.
- **Q2:** −536 against static −548. The pre-ticket rules read −548 (the ADR's finding 1).
- **The kinds covered:** interposition (Bf1, the one evasion), capture of the checker, an evasion that loses material (−544 against static 423), double check (Rxb5 does not evade), and a quiet promotion that blocks (e8).

## A3, capture-mate (6 rows, Q1 among them)
- **Q1** reads 29 999. Rxf8+ Qxf8 Rxf8 (a two-capture exchange) reads 29 997. cxd8=Q reads 29 999. exd6 e.p., which opens the e-file, reads 29 999.
- **Each mate also:** the brute force agrees; the pre-ticket rules read no mate; from a leaf 5 plies down the score is 5 less; and the mated side reads the negated score.
- **One evasion** (Rxe8+ Kh7) reads 708, not a mate, and equals the brute force.
- **Through `search()` at depth 1:** Rd8+ Ne8 Rxe8 reads 29 997 (MATE − 3, root-relative), move d1d8. The door reads no mate.

## The rule rows
- Out of check the node stands pat (Q3 = static 212).
- In check below the cap the static score is never returned (6 rows × qply 0–7).
- At the cap, Q2 at qply 8 reads its static −548, and only that node is entered.
- Stalemate stands pat (−992 = static).
- No node past qply 8 is entered, on every `Q-SET` row and on `ABC-079` `A3`'s corpus and rig, now run with evasions on.
- A quiescence mate survives the table: `search()` and `chooseMove` read MATE − 3 at depths 1–4.
- The source rows: each leaf passes `ply` and a constant record. The switch-literal row: exactly one `quiescenceEvasions` literal per door, true on `search` and `chooseMove` only.

## Deep rows (`SEARCH_DEEP=1`, `src/quiescence.test.ts`; numbers from `raw/oracle.txt`)
- **A4**, `search(…, 6).nodes` against the door: kiwipete 324 162 / 237 007 = **1.368×**, position-6 154 464 / 109 912 = **1.405×**. That is ≤ 1.5×, and both equal the ADR's reference exactly (0 % off).
- **Drift at d5 on the 190** (bars ≥ 83 % within 25 cp, none beyond 177 cp):
  - `search()`: **89.30 %** of 187, max **118 cp** (position-4/f1f2, 708 → 826). This equals the ADR's measurement. 0 mate flips.
  - `chooseMove` (unmeasured in the ADR): **88.77 %** of 187, max **118 cp**, 0 mate flips.
- **Mate floor at d5 on the 287:** 189 door mates, 0 violated, 0 new mates.

## Planted faults (`raw/plant.json`, `raw/plant-f1b.txt`; each restored, and the suite green after)
| fault | what reds |
|---|---|
| F1 evasions searched out of check | the stalemate row (−30 000 for −992); the quiescence lane overruns its 60 s bound (exit 124) |
| F2 stand pat kept in check | 9 rows: A2 interposition and material-loss rows, the exchange mate, one-evasion, search() d1, the door row, the table row, "never static" |
| F3 mate scored without check | the stalemate row |
| F4 evasions past the cap | the cap row, `ABC-079` `A3` ×2, `ABC-170` `A2` |
| F5 mate distance drops the leaf ply | 7 rows (the "5 plies down" ×4, search() d1, the door row, the table row) |
| F6 mate of the wrong sign | 12 rows |
| F7 the engine leaf passes ply 0 | the engine source row, the chooseMove door row, the table row |
| F8 chooseMove's switch off | the engine switch-literal row, the door row, the table row |
| F9 the search door's switch on | the search switch-literal row, the Q2 seam row, search() d1 |
| F10 evasions left unordered | **survives the default lane.** No default row pins the evasion order. The deep `A4` ratio is the detector (`ADR-0053` decision 9: a reading > 3 % off the reference is reported). |
