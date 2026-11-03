---
id: 20261103T105957Z-architect-design-decision-a0468a78
kind: decision
by: architect-design
at: 2026-11-03T10:59:57Z
verified_by: 
confidence: high that the miss is real (five sessions 1.067-1.112 against a 0.9888 main-copy control and the 1.0032 no-walk-add probe; ADR-0031 d3 two-session mean 1.069) and that C1 is value-identical by construction (phaseAfterMove exact because PHASE_WEIGHT of EMPTY/PAWN/KING is 0; king delta the same integer under one king per colour) - P1-P7 verify it; medium on C1 meeting G2 (forecast 1.00-1.03 from v2, UNKNOWN - verify; no timing taken by this hop)
refs:
  - arch-ABC-269-F3
  - grugops/arch-ABC-269-F3
  - ABC-269
  - EPIC-011
  - E1
  - ADR-0064
  - ADR-0031
  - ADR-0020
  - ADR-0002
  - ADR-0055
  - ADR-0061
  - NFR-001
  - NFR-005
  - Q-3K-4
  - B0
  - B5
  - B6
  - B7
  - B8
  - F3
  - F6
  - G2
  - G6
  - O1-e
  - C1
  - 110292d4
  - b7a8fc3a
  - b8b44ff3
  - 58fa3eb4
  - 47084b6a
  - src/evaluate.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/evaluate.taper.test.ts
  - se-ABC-269/20261103T104753Z-software-engineer-decision-7445784f
  - se-ABC-269/20261103T104753Z-software-engineer-observation-669f366c
  - se-ABC-269/20261103T104753Z-software-engineer-observation-ce3d0c5f
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
supersedes: 
seal: sha256:1756cf26c36336bca4eb083dd1c206c5210a87e87089cd2eaee8b2d16ea0f5ba
---

# arch-ABC-269-F3 decisions: the `G2` miss is real (1.0711 / 1.0672 ×, mean 1.069, against 1.05 ×), and QE does not re-read the uncut build first. F3's one value-identical cut is ordered as cut C1: the phase leaves the board walk. It rides the search's recursion as one integer, on `ADR-0020` d3's carrier, so `Position`, make/unmake and `UndoRecord` are untouched. The king Δ is read from the two king squares after the walk, so the walk is `main`'s walk again. The cut is node-equal by B0 plus seven proof rows, and needs zero re-pins. One new `G2` reading follows, taken by QE under the sealed PREREG in this task. A second miss means not merged. No bar moves

Architect/Design, task `arch-ABC-269-F3`, records only, on `grugops/arch-ABC-269-F3` from `main` `47084b6a`. No `src/` was touched, and this hop took **no timing reading**: the cut's cost is read once, by QE, under the PREREG. The inputs are the Engineer's notes at `grugops/ABC-269` `110292d4` (src tree `b8b44ff3`, code `b7a8fc3a`): design `…7445784f`, acceptance `…669f366c`, artifacts `…ce3d0c5f`. Also read: `raw/out/g2.out`, `raw/out/g2-variants.txt`, `raw/scripts/g2.ts`, `g2b.ts`, `nps.ts`, the build's `src/evaluate.ts` / `search.ts` / `engine.ts` / `quiescence.ts` / `apply.ts` / `position.ts`, `ADR-0064`, `ADR-0031` d3, `ADR-0020` d3 and its Alternatives, `ADR-0002` clause 1, and `arch-ABC-235` `…7fc1b90c` cut 4. `main`'s src is still tree `58fa3eb4`, so B0's counts apply as written.

## 1. Is the miss real? Yes. QE does not re-read B6 on the uncut build
- **The readings on the build** (ns per `evaluate` call, the six perft roots, the build and `main` in the same process):
  - `g2.ts` sessions: **1.0711** and **1.0672**. Mean **1.069**, load1 1.90 / 1.83.
  - The same build in three more sessions (`g2b.ts`): 1.0905, 1.0807 and 1.1119.
  - **Five sessions, all ≥ 1.067.**
- **The instrument's own controls, in the same sessions:**
  - `main`'s `evaluate.ts` copied into a second scratch dir reads **0.9888** (v3). That is the noise floor, about ±1 %.
  - The build without the walk's phase and king adds reads **1.0032** (v2, not value-identical, a cost probe). So the memo's third part and the blend are cheap, and the cost is the walk addition.
  - `evaluateWithoutTaper`, which walks the same phase but skips the blend, reads 1.0736. The cost is in the walk, not in the tail.
  - At node level: `chooseMoveWithoutTaper`, on exactly `main`'s tree, reads +3.0 % / +3.4 % ns per node against `main` (`nps.ts`). The walk's cost shows up at node level too.
- **Against `ADR-0031` d3's near-bar rule** (two sessions, the second in reverse order; the verdict is their mean):
  - The mean, 1.069, is above 1.05.
  - One deviation is recorded: both `g2.ts` sessions started with `base`, not in reverse order. It does not decide anything, for three reasons:
    1. Each session alternates the order every round.
    2. All five sessions read ≥ 1.067.
    3. The smallest excess over the bar, 0.0172, is larger than the control's 0.0112 deviation.
- **Why not a QE re-read first:**
  - A recorded-window re-read cannot plausibly bring a two-session mean of 1.069 down to ≤ 1.05.
  - If noise did bring it down, that would be shopping for a reading on a bar that has already missed.
  - It would also spend a host window, and the reading that counts comes after the cut anyway.
- **Decided: F3 fires on B6.**

## 2. The cut ordered: C1, the phase leaves the walk (O1-e-style incremental phase, recursion-carried)
### What it is
- The cut is one change set, fully specified here, built once and read once. It has two parts:
  1. The phase is carried incrementally.
  2. The king Δ is read after the walk.
- Together they restore the board walk in `whiteMinusBlack` to `main`'s walk. That is exactly v2's walk, the only measured form near 1.00 (1.0032).
- v4 (the king Δ after the walk, on its own) read the same as v0. So the king part is there to get v2's loop exactly, not as a second saving.
- **Phase, carried:** the search's recursion holds the phase as one integer for the current node.
  - The root is seeded once per search call (or once per deepening iteration) by `phaseOf(position)`.
  - Each child is `phaseAfterMove(phase, move)`.
  - A null move keeps the phase.
  - The evaluation receives the phase as an argument.
  - **Carrier:** a number argument of each recursion is preferred, because it allocates nothing. A per-ply `Int32Array` beside `keys` is acceptable. **Never** a field on `Position`, never in `UndoRecord`, never module state (`ADR-0064` d7).
- **`phaseAfterMove(phase, move) = phase − PHASE_WEIGHT[move.captured & 7] + PHASE_WEIGHT[move.promotion]`.**
  - It is pure, has no branch and needs no undo.
  - `PHASE_WEIGHT` is 0 for EMPTY, PAWN and KING. So a quiet move, castling and en passant (`move.captured` is the pawn) leave the phase unchanged, and a promotion adds the new piece's weight. `move.promotion` is EMPTY (0) on every other move.
  - The carried phase is unclamped. The clamp to 24 stays in the blend, as built.
- **King Δ, after the walk:** `KING_EG_DELTA[index(whiteKing)] − KING_EG_DELTA[index(blackKing)]`.
  - The index is the walk's own table index: white uses rank `7 − r`, black uses rank `r`.
  - A king square of −1 contributes 0. That is the in-walk form's value on a board without that king.
  - **Domain:** one king per colour. That is what `whiteKing` / `blackKing` and `kingExposure` already assume on `main`, and `parseFen` rejects anything else.
### Files
- **`src/evaluate.ts`:**
  - `phaseOf(position)` (the seed and the oracle: Σ `PHASE_WEIGHT` over the board) and `phaseAfterMove`, both exported beside each other.
  - One exported tapered entry taking `(position, phase)`. It is the function that the three tapered call sites call.
  - `whiteMinusBlack` takes the phase as an argument. Its walk has no phase add and no king Δ.
  - `evaluate(position)` ≡ the entry at `(position, phaseOf(position))`, `Object.is`-exact.
  - `evaluateWithoutTaper`, `evaluateWithoutMobility` and `evaluateWithoutPawnCache` keep their values.
  - Naming is the Engineer's.
- **`src/quiescence.ts`:** `quiesce` takes a trailing `phase`. The child gets `phaseAfterMove`. The tapered stand pat passes it, and the untapered records ignore it.
- **`src/search.ts`:**
  - The phase is carried through `negamax` / `searchMove` / `searchRoot` / `leafScore`.
  - `futilityNode` takes `phase` as a seventh argument.
  - The seed is `phaseOf` in the root.
- **`src/engine.ts`:**
  - The phase is carried through `negamax` / `searchMove` / `runIteration` / `leafScore`.
  - The seed is per call or per iteration.
- **Tests:**
  - New rows in `src/evaluate.taper.test.ts` (P2 and P5 below).
  - Direct `quiesce` callers gain the argument: `src/quiescence.test.ts`, `src/search.capacity.test.ts`, `src/engine.capacity.test.ts` and `src/gameend.nfr.test.ts`.
  - Direct `futilityNode` callers gain the argument, and `ABC-268`'s `.length` pin goes 6 → 7.
  - Any source pin whose string reads a changed call site is re-written as a pin, not as a figure.
- **Untouched, and the PR's `git diff --stat` shows it:**
  - `src/position.ts`, `src/apply.ts`, `src/legal.ts`, `src/moves.ts`, `src/zobrist.ts`;
  - `src/evaluate-params.ts`;
  - QE's `src/evaluate.taper-corpus.ts` (sha256 `05ed9e81…6e96339`).
### Why this carrier, and not `Position`
- `ADR-0002` clause 1 is owner-ratified: "no new state is added to `Position`", as quoted in `ADR-0020`.
- `ADR-0020` d3 rejected a position-carried key on three grounds. All three apply to a phase:
  1. It breaks clause 1 and grows `UndoRecord`.
  2. `makeMove` sits in the legality filters' inner loop, so the update would be paid where nobody reads it.
  3. It widens the blast radius to `apply.ts`, the hottest file.
- `arch-ABC-235` cut 4 adds a fourth: every board writer must re-sync, and a missed sync is a silent wrong answer.
- The recursion carrier has none of these costs:
  - A wrong update is caught by an oracle (P2) and by B0.
  - Every caller outside the search keeps `evaluate(position)`, which computes its own phase.
  - So no stale state exists anywhere.
- A `Position` carrier would need the owner to amend `ADR-0002`. That is a large architecture call, and this cut does not need it.
- `ADR-0064` d6 named "carried in `Position` or updated in make/unmake" as the O1-e form, and F3 names "O1-e-*style* incremental phase". The style is ordered. The carrier is this project's established one.
### Why not the packed score, or anything else
- **Packed score** (mg and eg in one int32): it accumulates Δ (the king and the passers), not the phase. The measured cost is the per-piece phase add (v2 against v0).
  - The variant that packed the phase into an existing accumulator read 1.0726 (v8), and 1.0674 with `| 0` (v9).
  - It needs overflow reasoning. It stays E2's option for when every half differs.
- **Six same-value micro-forms inside the walk** read 1.065–1.086:
  - Int32Array weights;
  - phase by piece code;
  - the king Δ after the walk alone;
  - the phase after mobility;
  - packed;
  - `| 0`.
  - Nothing that keeps a per-piece phase op in the walk has read near 1.05.
- **Other forms rejected:**
  - a second walk (more cost);
  - phase in the pawn memo (the phase is not a function of the pawns);
  - lazy blending (the phase is still needed at every call).
### Node equality: why the cut is value-identical
- By construction, the carried phase equals `phaseOf(position)` at every node:
  - the root is seeded by `phaseOf`;
  - P2 proves `phaseAfterMove` on every move kind.
- The entry at `phaseOf(p)` is the uncut `evaluate(p)`, with the same arithmetic. The king Δ is the same integer under one king per colour.
- So every evaluation value is identical, the tree is identical, and every count, score and move follows.
### The proof rows (the Engineer, before any reading; every run under the host lock)
- **P1, B0 exact:**
  - `chooseMove`: kiwipete d8 **1 296 788**, d9 **2 733 330**; position-6 d8 **404 930**, d9 **926 005**, d10 **1 692 669**.
  - `search()` d8: **839 514 / 1 533 901**.
  - Doors: `chooseMoveWithoutTaper` **1 306 981 / 391 451**, `searchWithoutTaper` **888 786 / 1 262 046**.
- **P2, the phase oracle walk** (`ABC-075` A2's shape under `ADR-0020`):
  - Over the `src/perft.test.ts` position set: depth 2 in the default lane, depth 3 under `SEARCH_DEEP=1`.
  - After each `makeMove`, assert `phaseAfterMove(parent, move) === phaseOf(position)`. After `unmakeMove`, assert `phaseOf(position) === parent`. After a null move, the phase is unchanged.
  - Targeted rows:
    - a promotion to each of N / B / R / Q;
    - a capture-promotion to each;
    - en passant for both colours;
    - all four castlings;
    - a capture of each piece type.
  - Non-vacuity: the walk counts ≥ 1 of each move kind.
- **P3, the evaluation is unchanged across builds** (one process, `Object.is`):
  - The cut build's `evaluate` against the uncut build's `evaluate` (src `b8b44ff3`), over G3's 184, QE's frozen fixture and the 6 endgames.
  - `src/evaluate.taper.test.ts`'s 90 existing rows pass unchanged (B1 (a)–(e)).
- **P4, cross-build trees:**
  - The shipped `search()` at d1–3 and `chooseMove` to d3, on the 190 positions: nodes | score | move against the uncut build. **0 mismatches.**
  - The doors against `main` `58fa3eb4`, by `xbuild.ts`'s 8 360 rows. **0 mismatches.**
- **P5, the guard:** a per-call phase walk that comes back onto the shipped path must redden.
  - Either a test-only counter (`phaseOf` called ≤ once per root call or iteration during a shipped `search()` / `chooseMove`), or a source pin (the walk holds no phase add, and the tapered call sites pass the carried phase). The Engineer picks the one that bites.
  - Planted defects that must go red:
    1. `phaseAfterMove` without its promotion term (P2, B0);
    2. `phaseAfterMove` without its capture term (P2, B0);
    3. the tapered stand pat reading the self-walking `evaluate(position)` (P5);
    4. the post-walk king Δ unsigned for black (B1 (a) / (d)).
- **P6, zero re-pins:**
  - `npm test` is green with no figure changed.
  - Every deep lane that reads the evaluation is green with no re-pin:
    - `SEARCH_DEEP` taper / null-move / futility / search / quiescence / transposition / pvs-lmr / ordering;
    - `ENGINE_DEEP`;
    - `PUZZLE_DEEP`: B2 0 / 163 and 0 / 189; B3 7 / 7; B4 54 / 58 with the same lines.
  - **A row that needs a re-pin means the cut is not value-identical. That is a defect: STOP to Architect/Design.**
- **P7:** typecheck 0, lint 0, build 0.
- **The Engineer takes no timing reading of the cut.** That covers `G2`, ns per node and variants. The one reading is QE's, under the PREREG.

### Forecast (`UNKNOWN - verify`; the PREREG's reading decides)
- **`G2`:** about 1.00–1.03 ×. The basis is v2's 1.0032 plus two post-walk loads and one argument.
- **ns per node:** below the uncut build. The cost moved to the recursion is one table load and two adds per made move, against about 10 phase adds × 0.9 evaluations per node removed. The door (`chooseMoveWithoutTaper`) should come back to about `main`'s ns per node.
- **The risk of a second miss is low, but not zero.** If it happens, the evaluation's cost was not the walk addition after all, and no value-identical cut on the table is left.

## 3. The reading that follows
- **`G2` is read once, by QE, under the PREREG sealed in this task** (`arch-ABC-269-F3`, the second decision note). The verdict is the mean of two sessions, compared with **≤ 1.0500**.
- **If it is met:** QE runs B5, B7 and B8 on the cut build.
  - B7 is `G6` at 4 000 ms. Under `Q-3K-4` = (b), every run must reach depth ≥ 6 (FAIL below), depth 7 is a WARN, and the median against base is reported.
  - Then UAT.
- **If it is not met:** this is the second miss. **Not merged.**
  - No further cut, and no value is tuned.
  - B5, B7 and B8 are not run.
  - Architect/Design writes `ADR-0064`'s "accepted, not in force" line. F6's structure-only path is E2's call.

## 4. `ADR-0064` edits (this commit, records only)
- A Status bullet.
- A § Decision log row and a dated block.
- Dated lines at d6, B6, F3, and § Alternatives (the packed score and O1-e).
- No bar text changed.

## Owed elsewhere
- **Orchestrator:** dispatch `se-ABC-269-cut` (the Engineer, on `grugops/ABC-269`: C1 plus P1–P7, records, no timing), then `qe-ABC-269` (the PREREG `G2` reading first, then B5 / B7 / B8 / UAT on a met result).
- **BA/PM:** one fold line on the `ABC-269` page at F3 and B6: "F3 fired on `G2` 2026-11-03; cut C1 ordered; one QE reading by `arch-ABC-269-F3`'s PREREG". This is not blocking.
