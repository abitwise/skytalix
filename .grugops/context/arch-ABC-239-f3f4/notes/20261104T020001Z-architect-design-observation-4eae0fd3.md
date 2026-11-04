---
id: 20261104T020001Z-architect-design-observation-4eae0fd3
kind: observation
by: architect-design
at: 2026-11-04T02:00:01Z
verified_by: 
confidence: high (every figure read from raw/out as run; S0 instrument check passed; D2's rebuilt candidate e1e5 line flagged)
refs:
  - arch-ABC-239-f3f4
  - arch-ABC-239-f3f4/20261104T014925Z-architect-design-decision-9427005b
  - arch-ABC-239-f3f4/20261104T015612Z-architect-design-decision-80a5bd21
  - ABC-239
  - ABC-271
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0050
  - ADR-0028
  - B-T5
  - F3
  - F4
  - K1 (c)
  - 26d06118
  - a8fbade5
  - grugops/ABC-239b
  - se-ABC-239b/20261104T014043Z-software-engineer-failed-attempt-c3f94eab
  - src/search.null-move.test.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate-params.ts
supersedes: 
seal: sha256:4186abbf76c43ab1b1a7d3b001965936b49d4fbb2e32119e76e63915e8937f20
---

# arch-ABC-239-f3f4 observation: the F4 diagnosis of `zugzwang.001` on candidate `26d06118`, and the K1 (c) read

Architect/Design, task `arch-ABC-239-f3f4`. This hop ran the PREREG `…9427005b` and its addendum `…80a5bd21`, each sealed and committed before its runs (`dcd4be1c`, `f4febc1c`). The instrument was a detached scratch worktree at `26d06118`. The base table was `a8fbade5`'s (sha256 `e2db4f4b…`). Every run was under the host lock, on one core. Host time was about 4 min in all. Raw files: `raw/scripts/`, `raw/out/`. "White's view" means scores from White's side.

**S0 (instrument check): passed.** The generated all-base and all-candidate tables deep-equal the real modules (16 / 16 exports). At depth 9 they give the real files' move, score and nodes: base e1f1, −390, 72 969 nodes; candidate e1e5, −421, 52 311 nodes.

**D1. Neither table sees White's win through depth 16** (`raw/out/d1.out`; `chooseMove` on a frozen clock).

| depth | base | candidate |
|---|---|---|
| 9 / 10 / 11 | e1f1 −390 / −394 / −344 | **e1e5** −421 / −428 / −442 |
| 12 / 13 | e1f1 −348 / −275 | e1f1 −430 / −353 |
| 14 / 15 / 16 | e1f1 0 / 0 / 0 | e1f1 0 / 0 / 0 |

- Stockfish's mate in 10 (19 plies) is beyond every depth read here.
- From depth 14, both tables score e1f1 as 0, which is a draw, not a win.
- At depths 9–13, both tables score both moves as lost. They choose between them by the evaluation.

**D2. The base passes depth 9 by 29 cp of evaluation preference** (`raw/out/d2-lines.jsonl`, `d2-leaf-families.jsonl`).

v(m) is −`search`(after m, 8), in White's view:

| table | v(e1f1) | v(e1e5) | gap |
|---|---|---|---|
| base | −390 | −419 | **+29** |
| candidate | −464 | −445 | **−19** |

**The leaves.** The e1f1 line ends in a pawn ending at phase 0: White Kf1 against Black Kh1, with Black's h-pawns on h2, h3 and h4 and none of them able to move. The e1e5 line ends in a rook ending at phase 4.

**Per-family contribution at the base's own leaves, base → candidate:**
- **e1f1 leaf:** −390 → −449, which is **−59**:
  - PASS −58, K −39, P −25;
  - STRUCT +24, KFILE +27, MOB +12.
- **e1e5 leaf:** −419 → −445, which is **−26**:
  - PASS −53, P −22, K +5.5;
  - STRUCT +20.5, KFILE +19, MOB +3, R +1.
- **The difference is −33, larger than the 29 cp margin.** The king's endgame table supplies −44.5 of it:
  - White's king on f1 moves from −20 to −56;
  - Black's king on h1, read from its own side as rank 8, moves from −50 to −47.
  - The fitted king table is rank-asymmetric. Corners on a king's own back rank read −115; corners on the enemy's back rank read −47.
- **The passer term nearly cancels between the two lines** (−58 against −53). The three frozen h-passers count in both lines.
- **A caveat on the candidate's own e1e5 line:** its rebuilt line breaks at the last ply (the leaf reads +127, not v). The base's e1e5 leaf, read at the candidate, gives −445, which equals the candidate's v(e1e5).

**D3. The drivers, by family swap at depth 9** (`raw/out/d3-*.out`).
- **No single family is a driver.** Reverting any one family to the base still plays e1e5, or e1e6 for P.
- **Two families are SUFFICIENT on their own.** Importing P alone into the base plays e1e5, and so does PASS alone. R alone plays e1e6. NB, Q, K, STRUCT, KFILE and MOB alone each keep e1f1.
- **Four DRIVER PAIRS, out of 36:** {P, R}, {P, K}, {P, PASS} and {K, PASS}.
  - Each pair holds at depths 10 and 11.
  - Reverting only the eg halves restores e1f1 for {P, R}, {P, PASS} and {K, PASS}. For {P, K} it plays e1e6.
  - Reverting only the mg halves never restores e1f1.
- **Finding 1: e1e5 is driven jointly by the fitted endgame halves of the pawn table, the passer bonus and the king table** (the rook table with the pawn table). No one term does it. Null move cannot fire at the root, which has one non-pawn piece a side, and it cannot fire in the pawn ending.

**D4. Relation R1 qualifies, and it covers only the king's part** (`raw/out/d4.out`).
- **R1:** the king's centralization is symmetric by rank (CPW "King Centralization": the term rests on the distance to the centre). In White's view, |`evaluate`(Kf1) − `evaluate`(Kf8)| ≤ 20.
- **The reading:** base 0, GREEN. Candidate −54, RED. q1–q4 hold.
- **The disclosure from the addendum:** the reading is not blind. It confirms what the table diff shows.
- **No passer relation exists on today's features.** That is the addendum's reasoning: the h-pawns are frozen only because the enemy king covers g1 and g2, and no term sees that.
- **Not read here:** whether a fit bounded by R1 plays e1f1. D3's K-alone revert keeps e1e5, so R1 alone is forecast to be insufficient. That forecast is `UNKNOWN - verify`.

**D5. The K1 (c) rows pass in form (A) with every literal unchanged: 5 / 5 green on the candidate and 5 / 5 green on the base** (`raw/out/d5.out`).
- Form (A): each row runs inside `withParametersForTest`, with the six king-file pairs at the values the rows were frozen at (15 / 10 / 20 in both halves, queen-on 0). The test was a scratch copy of `src/evaluate.queen-on.test.ts`, run as a one-file vitest.
- Not run here: the bite check. It is owed at step 7 (decision note).

**Cleanup:** the scratch worktree and the `node_modules` symlink were removed after the runs. Nothing was left running.
