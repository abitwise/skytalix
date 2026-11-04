---
id: 20261104T015612Z-architect-design-decision-80a5bd21
kind: decision
by: architect-design
at: 2026-11-04T01:56:12Z
verified_by: 
confidence: high (the plan as written; R1 not yet read through evaluate)
refs:
  - arch-ABC-239-f3f4
  - arch-ABC-239-f3f4/20261104T014925Z-architect-design-decision-9427005b
  - ABC-239
  - ADR-0067
  - ADR-0064
  - F4
  - B-T5
  - 26d06118
supersedes: 
seal: sha256:c665f12c21e5cab99fbe5ccd3bc26a1bdbbfddfc068d3b01a7db3ad14d678d5b
---

# arch-ABC-239-f3f4 PREREG addendum: D4's relation, named before its run

Architect/Design, task `arch-ABC-239-f3f4`. The PREREG `…9427005b` (`dcd4be1c`) fixed D4's criteria q1–q4 and said its positions come in an addendum sealed before D4 runs. S0, D1, D2, D3 and D5 have run; their outputs are in `raw/out/`. D3 named no single driver and four driver pairs, all through endgame halves: {P, R}, {P, K}, {P, PASS}, {K, PASS}.

**Disclosure.** A relation's value is a sum over table entries that are open data, and the table diff was read before this addendum. So D4 is not blind: it confirms through `evaluate` what the diff lets anyone compute by hand. It cannot show that a relation was found without knowing the candidate.

**One relation is named. R1, the king's centralization is rank-symmetric in a pawn ending.**
- **Source:** CPW "King Centralization" (fetched 2026-11-04): the term exists "to encourage the king to become a more active piece in the endgame", and is "based on center distance and/or center Manhattan-distance penalties". Distance to the centre is symmetric between a king's own back rank and the enemy's.
- **Positions** (White to move, a blocked d-pawn pair so no passer, no doubled or isolated difference, the same king-file counts and the same king reach):
  - A = `8/8/8/k2p4/3P4/8/8/5K2 w - - 0 1` (White king f1);
  - B = `5K2/8/8/k2p4/3P4/8/8/8 w - - 0 1` (White king f8, the same distance to the centre).
- **The row:** |`evaluate`(A) − `evaluate`(B)| ≤ 20, White's view. That is two linear inequalities, each one ruling (b)'s form. The 20 cp is `ADR-0064` B1 (d)'s threshold for the king's walk.
- q1: neither position is `zugzwang.001`, on a D2 line, or within 4 plies of its root (the root's white king is on f2 and its rook on e1; neither position has a rook). q2: above. q3: the difference crosses only the king's endgame table at w = 0, plus mobility and the king-file terms, which are equal by construction. q4 is what D4 reads.

**No passer relation is named, and the reason is written now.** On the D2 line after e1f1, Black's three h-pawns cannot move: h2 stands under its own king on h1, and White's king on f1 holds g1 and g2, so the king cannot step aside. That "cannot move" comes from the enemy king's reach. The evaluation has no feature for it: `passed` reads only enemy pawns ahead, and mobility counts the squares a king reaches without asking whether they are attacked. A position pair on today's features that penalises such a passer would penalise every advanced passer of that rank. Its principle would be false, because a passer is worth more as it advances (with the black king on g1, the same h2 pawn queens). So no passer relation can meet q2 and q4 together, and none is offered.

**D4's run:** `evaluate` of A and B on the base table and on the candidate, White's view, through the shipped `evaluate` of each table's scratch `src/`. Reported: both scores, the difference, and q4 (green on base, red on the candidate).

**Not read, as the PREREG says:** whether bounding R1 would make `zugzwang.001` play e1f1. D3 shows that reverting K alone keeps e1e5, so R1 by itself is forecast **not** to restore the row. That forecast is `UNKNOWN - verify` and is not tested here.
