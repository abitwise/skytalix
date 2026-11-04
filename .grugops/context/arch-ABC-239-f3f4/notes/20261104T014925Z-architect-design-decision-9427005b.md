---
id: 20261104T014925Z-architect-design-decision-9427005b
kind: decision
by: architect-design
at: 2026-11-04T01:49:25Z
verified_by: 
confidence: high (the plan as written; nothing measured yet)
refs:
  - arch-ABC-239-f3f4
  - ABC-239
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0050
  - ADR-0068
  - ADR-0028
  - B-T4
  - B-T5
  - F3
  - F4
  - F6
  - K1 (c)
  - 26d06118
  - a8fbade5
  - grugops/ABC-239b
  - se-ABC-239b/20261104T014043Z-software-engineer-failed-attempt-c3f94eab
  - se-ABC-239b/20261104T014043Z-software-engineer-decision-3a752adc
  - se-ABC-239b/20261104T014043Z-software-engineer-observation-e3751084
  - arch-ABC-239-rulings/20261103T222530Z-architect-design-decision-90b469ca
  - arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8
  - src/search.null-move.test.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate-params.ts
supersedes: 
seal: sha256:3ea6b2489625324dad4991f38ed94a3056206230c86ef0939306cbd121f054a3
---

# arch-ABC-239-f3f4 PREREG: the F4 diagnosis (`zugzwang.001`) and one K1 (c) read. Sealed before any measured run

Architect/Design, task `arch-ABC-239-f3f4`, on `grugops/arch-ABC-239-f3f4` from `main` `232f234f`. Inputs read: `se-ABC-239b` failed-attempt `…c3f94eab`, its decision `…3a752adc` and observations `…e3751084` / `…52c8a6a1`, and `raw/out/step6-candidate-evaluate-files.txt` (on `grugops/ABC-239b` `7e9fb4f7`); `ADR-0067` as merged (d6, the one-refit procedure, rulings (b) and (c), F3, F4, F6, B-T4 / B-T5 dated lines); `ADR-0050` d9 and Context; the prior hop's reads (`arch-ABC-239-rulings` `…90b469ca`, `raw/zz*.out`, `raw/sf.out`).

**Instrument.** A detached scratch worktree of `grugops/ABC-239b` at the candidate `26d06118` (`src/evaluate-params.ts` sha256 `10581fb5…95af`), outside the repository, with `main`'s `node_modules` symlinked; removed after. The base table is `git show a8fbade5:src/evaluate-params.ts` (sha256 `e2db4f4b…3f55`, the base the candidate's header names). A **variant** is a full table written as a generated `evaluate-params.ts` into one scratch copy of the candidate's `src/`, rewritten before each run; every run is a fresh Node process (no pawn cache or transposition table carries across tables). Every run under the host lock, one core. Nothing is committed to `src/` or `tools/`; `grugops/ABC-239b` is not touched. Scripts and outputs go to this task's `raw/`.

**S0, the instrument check (a defect stop, not a result).** The generated all-base and all-candidate files deep-equal the real modules' exports, and `chooseMove` at depth 9 on each gives the same move, score and nodes as the real file. A miss stops the hop as an instrument defect.

**D1 (report).** `chooseMove` on a frozen clock (`now: () => 0`, `maxDepth` d), both tables, d = 9 … 12 (replicates `se-ABC-239b`), then d = 13 … 16 while each run stays under 5 min (a run past 5 min is killed and recorded `UNKNOWN - verify`). Reported: move, score, nodes. The question it answers: does either table *see* White's win (a score > 0 for e1f1) at any depth read, or does each choose between two lines it scores as lost?

**D2 (report).** Forced root moves at depth 9, both tables: v(m) = −`search`(position after m, 8).score from White's side, for m ∈ {e1f1, e1e5}, each in its own process; the gap v(e1f1) − v(e1e5). The expected line: from the position after m, the move `search`(·, d) returns, for d = 8 down to 1, made in turn; its leaf FEN, `evaluate` there, and the leaf's per-family contribution (the tracer's term sums blended at the leaf's phase) at each table. Families as in D3. It explains D3; it decides nothing.

**D3 (decides finding 1: which parameters drive e1e5).** Families, each a set of `src/evaluate-params.ts` exports (material, the phase constants and the mobility cap are frozen and equal in both tables):
`P` = `PST.pawn`; `NB` = `PST.knight` + `PST.bishop`; `R` = `PST.rook`; `Q` = `PST.queen`; `K` = `PST.king`; `PASS` = `PASSED`; `STRUCT` = `DOUBLED` + `ISOLATED`; `KFILE` = the three king-file pairs + the three queen-on pairs; `MOB` = `MOBILITY_WEIGHT`.
- Revert runs R_F: the candidate with family F at the base values. Import runs A_F: the base with F at the candidate values. `chooseMove` at depth 9 each.
- **F is a DRIVER iff R_F plays e1f1 at depth 9.** F is SUFFICIENT iff A_F plays e1e5 at depth 9.
- If no single family is a driver: the 36 pair reverts. {F, G} is a DRIVER PAIR iff it plays e1f1 and neither alone does. If none: the verdict is **DISTRIBUTED** (no set of at most two families drives it), and no triple is run.
- For each driver (or pair), reported, deciding nothing: the revert at depths 10 and 11, and the revert of its mg halves only and of its eg halves only at depth 9.
- **Finding 1 names the drivers.** It is a property of this candidate, not a rule for any later fit.

**D4 (decides only whether a qualifying F4 relation is found; positions written in an addendum sealed before its run).** A relation qualifies iff all of:
- (q1) its positions are not `zugzwang.001`, not any position on a D2 line, and not reachable from the row's root within 4 plies, so it is not a re-pin of the row;
- (q2) it states a chess rule with a source outside this engine (a primer or CPW), written before its value is read on either table;
- (q3) it is linear in the parameters under `ADR-0067` d4's model, so ruling (b)'s bound machinery carries it as written;
- (q4) it reads green on the base table and red on the candidate (so it encodes the defect, not a neutral fact).
- At most three relations are named in the addendum. If none meets q1–q4: **"no qualifying relation found among those named"**, and the finding says what a linear relation on independent positions cannot see here.
- Whether bounding a qualifying relation would make `zugzwang.001` pass is **not** read here: that read is a fit chosen on the row (ruling (c), F6). It is `UNKNOWN - verify`, and a re-open's own PREREG reads it.

**D5 (report, for ruling 3, the K1 (c) re-find).** A scratch copy of `src/evaluate.queen-on.test.ts` at `26d06118` in which each K1 (c) row runs inside `withParametersForTest` with the six king-file pairs at their pre-tune values (base pairs `{15,15}`, `{10,10}`, `{20,20}`; queen-on pairs `{0,0}`, as the rows were frozen), and every expectation literal unchanged. One-file vitest, `NODE_OPTIONS=--max-old-space-size=400`. Reported: each K1 (c) row green or red on the candidate table and on the base table. It informs the ruling's form; it re-pins nothing.

**What is not run.** No fit, no refit, no game, no Stockfish (the prior hop's d26 reads stand: e1f1 mate in 10, e1e5 −633), no deep lane, no `npm test`. Total host time ≤ 1.5 h; any single run ≤ 30 min.
