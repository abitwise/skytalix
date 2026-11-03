---
id: 20261103T203621Z-architect-design-decision-c858b5a5
kind: decision
by: architect-design
at: 2026-11-03T20:36:21Z
verified_by: 
confidence: high on the verdict (the pre-registered choice rule applied as written) and on the order (host-time arithmetic and the convex fit); medium on the forecasts (S1-S3 on the emitted set, B-T5's risk); acceptance is the owner's
refs:
  - arch-ABC-270
  - grugops/arch-ABC-270
  - ABC-270
  - E3
  - EPIC-011
  - ADR-0068
  - ADR-0031
  - ADR-0064
  - ADR-0061
  - ADR-0067
  - ADR-0056
  - ABC-239
  - ABC-274
  - ABC-272
  - ABC-083
  - QE-269-a
  - Q-3K-4
  - OD-205-1
  - OD-205-2
  - NFR-005
  - NFR-001
  - dc7dc15d
  - arch-ABC-270/20261103T202104Z-architect-design-decision-117475f9
  - arch-ABC-270/20261103T202530Z-architect-design-decision-3f24d8a0
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
supersedes: 
seal: sha256:76873586962503dee44282e39eb2fb962b9aece254f775f22bc92f899ff8b85b
---

# arch-ABC-270 decisions: `ADR-0068` is written PROPOSED. E3a lands as structure only, before the tuner: three queen-on exposure pairs at 0, so the build is value-identical and node-identical, with no switch, no doors and no games. `ABC-239`'s first pull fits them. The rule values are not shipped (the PREREG's choice rule 3: both rule-value forms fail the d5-against-d5 mate floor). The shelter gate is out. Order: `ABC-270` (structure) → `ABC-239` fit → one read for both

## 1. The ADR
`memory-bank/50-decisions/ADR-0068-…md`, PROPOSED. **ADR-0068** is the next free id after `ADR-0067`. The parallel
`arch-Q1-see-pruning` takes the id after it.

## 2. What E3a is, and which terms
- **In (structure):** `KING_SHELTER_MISSING_QUEEN`, `KING_FILE_HALF_OPEN_QUEEN`, `KING_FILE_OPEN_QUEEN`, each
  `{ mg: 0, eg: 0 }`. Each is added per file to a king's exposure while the enemy has ≥ 1 queen. The pairs are linear,
  so the tuner fits them. The queen flags are gathered in the walk's existing non-pawn branch (`type >= QUEEN`), with no
  new per-piece operation.
- **Exposure endgame halves:** unchanged at E1's values (= mg). Since `ABC-274` they are data only, and `ADR-0067` d6
  already frees them.
- **The enemy-queen scale:** additive queen-on pairs, not a factor. The tuner fits its size. `ADR-0031` A1's
  2 × base (× 3) is the recorded prior, probed and not shipped.
- **Off-door pair:** none. The build is value-identical (the `ABC-274` precedent). `ABC-270` scope 4 is struck, and
  `OD-205-1` / `-2` cannot move.
- **Shelter gate (A3): out by reading.** `KING_MG` ≤ 0 everywhere on `ABC-215`'s table, so it gates nothing.
- **`ABC-083` A2 (b) / A3 (b):** re-found at phase 24 in `ABC-270` (`ADR-0028` d2). Each new row is red with its term
  zeroed. This is done so that `ADR-0067` d6's "a red relation becomes a bound" cannot bind the endgame exposure through
  a pawn-ending fixture.

## 3. The tuner interaction and the order (the brief's essential question)
- **Answer:** `ABC-270` adds the term structure only, with tuner-owned values, and goes **before** `ABC-239`'s fit.
  `ABC-239`'s first pull traces and fits the new pairs (mg free ≥ 0, eg held at 0 at the first pull) together with the
  exposure endgame halves.
- **Why this order wins more for less host time:**
  1. **Rule values first is forecast NOT MET.** QX / X fail `K2`'s d5-against-d5 mate floor (2 / 190, 1 / 190, KQK).
     Building M and reading 100 games (about 0.8 h) would end at F4.
  2. **Tuner first, then E3a on hand values** double-counts king safety, because the tuner already scales the king
     tables 3–3.5 ×. Or it needs a second pull and read (about 0.7 h, plus about 5 h if B-T8 is asked again).
  3. **Structure first** costs about 0.2 h (`G2`, `G6`, the lanes), with no games. The fit is convex, and the scalar
     pairs carry no prior, so the tuned values are the same whatever the start. One read covers both.
  4. **D5 supports it:** a bounded fit on own games moves the shelter weight into the queen-on term (29, 0) and puts
     the shelter's endgame half at 0. That is where A1 and scope 1 point.
- **`ABC-270`'s 100-game read: none of its own.** E3a is read inside `ABC-239`'s read (C2′, S′, Levels, B-T8). The cost
  is attribution, and ± 56 Elo could not resolve a +15–50 slice alone.
- **Scheduling:** `ABC-270`'s build (now S) runs beside `ABC-239`'s tool build. `ABC-239`'s fit and emission wait for
  `ABC-270`'s merge or its disposition. If `ADR-0068` is not accepted by fit time, the tuner fits without it.

## 4. Bars of `ABC-270` (`ADR-0068` d6; fixed before Ready)
- **K0:** node identity with `main`, `chooseMove` kiwipete d8 / d9 1 296 788 / 2 733 330, position-6 d8 / d9 / d10
  404 930 / 926 005 / 1 692 669, `search()` d8 839 514 / 1 533 901.
- **K1:** (a) mirror; (b) `Object.is` with the pre-ticket `evaluate` over the frozen corpora; (c) the × 3 structure
  through the seam (≥ 6 queen pairs frozen by QE); (d) the int16 range row; (e) the re-found A2 (b) / A3 (b).
- **K2:** zero re-pins in every lane.
- **K3:** `G2` ≤ 1.05 × `main`, under QE's PREREG.
- **K4:** `G6` "≥ base", and every run ≥ 6. `NFR-005`'s floor holds by construction, since the tree is identical.
- **No games.** **Falsifiers:** F1–F5 in the ADR.

## 5. Owed lines (not edited here; fences)
- **BA/PM, the `ABC-270` page:**
  - title and scope: scope 1 is no data change here (the tuner frees it); scope 2 is the queen-on pairs at 0; scopes 3
    and 4 are struck;
  - scope 5 adds the A2 (b) / A3 (b) re-find;
  - acceptance: K0–K8 are replaced by `ADR-0068` d6's K0–K4;
  - K1 (b) S1–S3 moves to a report in `ABC-239`'s PR;
  - the intent GAIN is struck (value-identical, no games);
  - size M → S; Dependencies: before `ABC-239`'s fit; DoR row 10 is met by this ADR on acceptance; UAT: production
    lines, so the QE verdict signs (not waived).
- **BA/PM, the `ABC-239` page:** its fit is taken on a `main` with `ABC-270`, and its PR prints S1–S3 and game 1's
  move 13 as reports.
- **`ADR-0067` (its Architect):**
  - d6 free set: the queen-on mg free ≥ 0, eg held at 0 at the first pull;
  - d4 / d5: the tracer traces the three features;
  - Consequences 4: the order now reads `ABC-270` (structure) → `ABC-239`;
  - B-T5: the KQK same-depth mate risk (`ABC-272` named as the structural candidate);
  - B-T4: a re-pin rule (old → new, `ADR-0064` d7), since a tuned table moves pins on every path.
- **`ADR-0056`** row E3 / Phase 4: E3a = `ADR-0068`. **`EPIC-011`** § Dependencies: the order above.
- **Orchestrator:** rule S2 nps for `ABC-270` (as `ABC-274`, `…690d3b30`); the board.
- **QE:** freeze ≥ 6 queen pairs before the build (K1 (c)).
- **Written here (records only):** dated lines in `ADR-0031` § Addendum status, `ADR-0064` d10, and `ADR-0061`
  § Consequences (the futility-door instrument).

## 6. Owner question
- **Accept `ADR-0068`** (*"accept ADR-0068"* / *"decline it"*). It changes `ABC-270`'s scope from value-changing to
  structure-only, which is his under the 2026-10-22 delegation. Default: `ABC-239` does not wait; without acceptance it
  fits without the queen-on terms.
