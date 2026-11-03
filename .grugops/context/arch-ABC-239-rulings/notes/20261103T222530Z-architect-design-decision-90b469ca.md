---
id: 20261103T222530Z-architect-design-decision-90b469ca
kind: decision
by: architect-design
at: 2026-11-03T22:25:30Z
verified_by: 
confidence: high (rules fixed before any run)
refs:
  - arch-ABC-239-rulings
  - grugops/arch-ABC-239-rulings
  - ABC-239
  - EPIC-011
  - ADR-0067
  - ADR-0068
  - ADR-0050
  - ADR-0028
  - B-T4
  - B-T5
  - F3
  - F4
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - da3f8599
  - 03fcaaa0
  - 77034175
supersedes: 
seal: sha256:ca6cfbb1ae3c29542d835eda57801ff91dda068df328563fc837a771ba67cd29
---

# arch-ABC-239-rulings PREREG: three small reads before the rulings (b), (c) and the B1 (d) relation. Sealed before any measured run

Architect/Design, task `arch-ABC-239-rulings`, on `grugops/arch-ABC-239-rulings` from `main` `77034175`. Inputs read: `se-ABC-239` failed-attempt `…f39f6eb5` and its decision / observation notes; the candidate failure list `raw/out/candidate-npm-test-failures.txt` (on `grugops/ABC-239` `306404ea`); the Orchestrator's B-T4 ruling `…42c82347`; `ADR-0067` as merged (d6, B-T4 / B-T5 dated lines, F3, F4); `ADR-0068` d5; `ADR-0050` d9.

**Instrument.** A detached scratch worktree of `grugops/ABC-239` at the candidate `da3f8599` (tool tip `03fcaaa0` below it), outside the repository, with `main`'s `node_modules` symlinked; removed after. Every run under the host lock, one core. Nothing is committed to `src/` or `tools/`; the branch `grugops/ABC-239` is not touched. The base table is read by `git show 03fcaaa0:src/evaluate-params.ts` into a second scratch copy.

**R1, `ABC-083` A2 (b) — which parameters the relation crosses (report; decides nothing).** On `G_PAWN_ON_G6` and `SHELTERED` (`src/evaluate.king-mobility.test.ts`), the tracer (`tools/tune/tracer.ts` `trace`) difference, term by term, with the mobility count and the phase; each term's contribution at the candidate table and at the base table; `evaluate` of each side to confirm the +8 the Engineer read. The bound form (ruling (b)) is generic and does not depend on these numbers.

**R2, `ABC-269` B1 (d) — the relation behind the pin (report).** For QE's six endings D1–D6 (`TAPER_KP_ENDINGS`), the tapered centre − corner from the walking king's side on the candidate: does each read ≥ 20 cp? Report only. It says whether B1 (d) is forecast into the bound set of ruling (b).

**R3, `zugzwang.001` — e1e5 against e1f1 (decides ruling (c)).** FEN `8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1`.
- (a) **The `ADR-0050` d9 instrument:** Stockfish 19 at depth 26, Threads 1, Hash 64, run on its own (root free) and forced on each move (`go depth 26 searchmoves e1f1`, then `searchmoves e1e5`), fresh `ucinewgame` each. Scores from White's side.
- (b) The candidate's shipped `chooseMove` on a frozen clock at depths 9, 10, 11 (move and score; d9 confirms e1e5). Report.
- (c) **The fault the row bites:** a scratch variant with `NULL_MOVE_MIN_PIECES` = 1 (the page's floor guard that `ADR-0050` rejected; in this root each side holds one non-pawn piece, so the shipped guard of 3 never fires here). Its move at depth 9 on the candidate table and on the base table.

**Decision rule for (c), fixed now:**
1. e1e5 is **SOUND** (a second winning move) iff (a)'s forced e1e5 score is ≥ +200 cp or a mate score for White.
2. e1e5 is a **SAFETY FAILURE** iff it is ≤ +100 cp, a draw score, or a mate score for Black.
3. Between +100 and +200 exclusive: **UNDECIDED**, read as not sound. The row stays e1f1 only.
4. If SOUND, the row's accept set becomes { e1f1, e1e5 } **only if** (c)'s floor-guard variant plays a move outside that set at depth 9 on both tables, so the row still reddens its fault. If the variant plays e1e5 or e1f1 on either table, the set is not widened (that would weaken the row). The row is then a lost fixture property, re-found under `ADR-0028` d2, never loosened.
5. Whatever the read, no zugzwang depth moves and no row is re-pinned (B-T4, F4).

**Stops.** Any single run over 30 min is killed and recorded `UNKNOWN - verify`. A Stockfish line that does not reach depth 26 is reported at its depth and rule 3 applies.
