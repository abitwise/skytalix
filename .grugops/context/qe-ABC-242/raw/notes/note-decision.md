# QE on `ABC-242` at `6884d61a` (base `4387d4e8`): **PASS_WITH_GAPS.** A1–A7 MET and A8 confirmed. `G8` H 9.41 s (B 9.21 s). The gap is QE-242-a (MEDIUM): an `ABC-244` condition-2 ruling is owed for the step-10 lane form. UAT signed by this verdict

- **The hop.** Branch `grugops/qe-ABC-242` was cut from the SE tip `56058203`. The code is `6884d61a`, and `56058203` is
  notes only, with src identical.
- **PREREG** `5da281c9` was committed before any head run. Every graded reading below was run as pre-registered. ALONE.
  Not merged, nothing pushed.
- **Two post-PREREG changes, both labelled:**
  - the plant tree is built from hard links, because of the scratch quota (H re-checked clean);
  - a step-1 re-run of the plants and a cap-plant sweep were added, both informative.

| criterion | grade | reading |
|---|---|---|
| A1 | **MET** | Against the REAL base tree (out of tree, counting shim), at steps 10 and 1: the repeat is exactly 0 at H and ≠ 0 at B (probe −1005 / −1016; d1e1 −1010; f1g1 545; f8g8 545). H runs legal−1 child searches, B runs legal. Entries before the repeat equal B's. Probe: `scored[0]` `{d8e8, 0}`, 4 of 5 searches, plays d8c8 (not d8e8). On `last`, the whole list is B's except its last entry, 0. Lane rows green. Q3 (the skip becomes a search) reds the 3 A1 rows on the child count; Q4/QB red A1 too |
| A2 | **MET** | H = B in full (list, depth, nodes, elapsedMs), 5 searches, d8e8 −1005 (second occurrence). **Q1 (two matches → one) turns A2 red** |
| A3 | **MET** | Clock 0 with 7 untrimmed keys: H = B in full. **Q2 (the clock bound dropped) turns A3 red** |
| A4 | **MET** | Both rows re-run green at H. One `STEP_MS` = 10 on the seam, the session and the direct call in both files (R3). Seed 7 (0.0117 < 0.4) is asserted. Q4/Q14 red both |
| A5 | **MET** | The A5 row is green. In the 1 099-root differential sweep, the pick recomputed from H's list (strict second-best, ties to the first) equals H's move and kind every time |
| A6 | **MET** | No keys and `[]`: H = B in full on 7 fixtures × 2 steps, elapsedMs included. The engine-path files are byte-identical. The lane keeps every base row name (+10, −0, the name hashes equal) and is green |
| A7 | **MET** | lint, typecheck, build 0. `npm test` ×3 green, skips 0, skip-integrity clean. `G9` bytes equal. `ENGINE_DEEP` levels 53/53. `LADDER_DEEP` short 18/18. `G4`/`G5`/`G10` hold. `G8` H 9.41 s ≤ 10 s |
| A8 | confirmed | `tools/rating/rating.ts` has 0 "Skill Level". `src/ladder.test.ts` calls `choose(h.position)` with no prior keys: an identity row |

- **Plants:** 20 of 20 matched the pre-registration. Lane survivors:
  - equivalent: Q7 (cap removed, for trimmed callers), Q11 (M7), Q12 (M8), Q16a;
  - not equivalent: **Q6 / Q8 (the cap lowered to 8 / 50)**, which is QE-242-b, LOW;
  - Q18 (a clock read in the check), unpinned by design: INFO.
- **SE-242-c:** QE agrees that M7 and M8 are equivalent.
- **SE-242-e:** confirmed, 42 of 42.
- **SE-242-a:** answered. d8e8 moved −1013 → −1020 at the `ABC-228` merge `e42b637b`.
- **Why PASS_WITH_GAPS and not PASS:** QE-242-a.
  - On the budgets the child searches are actually handed, step 10 gives children 2–5 a non-positive budget (depth 1).
    So `ABC-244` condition 2, read per child search, admits only step 1, and step 1 would cost about +2.5 s of lane wall.
  - Kill parity holds at every step.
  - The product is unaffected.
  - BA/PM owes a ruling on how condition 2 reads a blunder's sliced child searches. It does not block the merge.
- **UAT** is owed (production lines in `src/levels.ts`), and this verdict signs it (Test note 3; owner delegation).
- **STOP:** none. **Thermal:** max Tctl at a run start was 39.6 °C, and 74.6 °C right after a run.
