---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:16:58Z
subtask: qe-ABC-271-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-271-freeze/
branch: new grugops/qe-ABC-271-freeze from main — worktree .claude/worktrees/qe-ABC-271-freeze
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Small reads only (≤ 30 min); no games. Host paths only as placeholders.
---
# Freeze ABC-271's K1 rows and K0 counts before the build (ADR-0070 ACCEPTED, form (a))
Read plans/tickets/ABC-271*.md (structure only, K0–K4, test note 1), ADR-0070, the Orchestrator rulings …730399e5 and …6ccd8243, and qe-ABC-270-freeze's done brief as the precedent.
Freeze in a sealed decision note before any SE build exists:
- K1 (a): ≥ 10 passer positions for the mirror.
- K1 (c): the seam fixtures at the page's floors (≥ 8 / ≥ 6 / ≥ 4, plus one pair past the distance cap of 5 and one own-king pair). Give each as FEN, side and the expected feature values for PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE and PASSED_UNSTOPPABLE, derived by hand from ADR-0070's definitions, not from code.
- K0's seven exact node counts as the ADR lists them.
SE implements these rows and may not change them; QE grades against them later.
Fences: your records, plus optional frozen-fixture files under test fixtures if the precedent did that. No src, ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-271-freeze, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**Done: ABC-271's K1 (a) / (c) rows and K0 are frozen before any build.** The PREREG is `20261104T133856Z-qe-e2e-decision-67b5eeac` (sealed). The data is in `.grugops/context/qe-ABC-271-freeze/raw/fixtures.json` (sha256 `bf3c205b…db887a`). It was taken at `main` `b274711c`, `src/` tree `4fb3da04`. Nothing under `src/`, `tools/`, the ticket, the EPIC, the ADRs or the board was touched, and no test fixture file was written (the precedent wrote none).

- **K1 (a): 12 new passer positions** (A01–A12, phases 0–5 and 24, both colours and both sides to move). None is in `G3`, `TAPER_MIRROR_POSITIONS` or `TAPER_DOOR_CORPUS`.
- **K1 (c): 44 seam fixtures.** Each has a FEN, phase, side to move and, per side, the passer list, the four feature values (`PASSED_KING_ENEMY` / `PASSED_KING_OWN` / `PASSED_FREE` by R, and `PASSED_UNSTOPPABLE` 0/1) and the seam `{ kd, free, un }` at `ADR-0070` d1's probed values. All are derived by hand.
  - **U, 15:** 5 out/in twin pairs (white and black, attacker and defender to move, start-rank double step, R 6). Then U6 (side to move only), U7 (both sides: U per side), U8 (two passers: U once), U9 (own king on the path) and U10 (phase 1: U 0).
  - **KD, 9 pairs:**
    - enemy king: KD1, 3, 4, 7, 8, 9;
    - own king: KD2, 5, 6, 9;
    - past the cap: KD3 (enemy, 5→6) and KD5 (own, 5→6);
    - KD4 is the last step inside the cap, KD7 = `mirrorPosition(KD1)`, and KD8 has a doubled passer whose rear pawn is not read.
  - **FP, 4 piece pairs + 1 king pair + 1 control:** an enemy knight on the stop square, an own bishop mid-path, a rook on Q itself and a rook at the far end of the path. FP5 is an enemy king on the path; FP6 is a piece ahead on the adjacent file.
  - The floors (≥ 8 / ≥ 6 / ≥ 4, one pair past the cap, one own-king pair; `…6ccd8243` item 1) are met and checked by the script.
- **K0 is copied from `ADR-0070` d5:** 766 275 / 1 725 150; 87 475 / 253 724 / 533 916; `search()` d8 605 117 / 406 787. `git diff 8adb0a18 4fb3da04` lists 3 test files only, so they stand.
- **Checks** (`raw/scripts/verify.mjs`, exit 0, 0 failures):
  - the hand values equal a re-implementation of the ADR text on every fixture and side;
  - `main`'s FEN, check, `phaseOf` and `isPassedPawn` agree;
  - `main`'s `evaluate` is mirror-exact on all 56 positions;
  - the rule is colour-symmetric;
  - the pair structure holds.
  - A copy with 3 planted errors read 8 FAILs. Every run went under `flock <scratch>/host-test.lock`. `npm test` was not run (no `src/` change), and no search or game was run.
- **Gaps** (`20261104T133902Z-qe-e2e-observation-a8173b00`):
  - `QE-271-a` LOW: the seam is graded per side with U not netted. If the build returns only a net, QE grades the net.
  - `QE-271-b` INFO: U reads d uncapped (U2 pins it).
  - `QE-271-c` INFO: phase 24 is not graded.
  - `QE-271-d` INFO: the passer definition and R.
  - `QE-271-e` INFO: K1 (c) reads the seam, not `evaluate`.
- **Commits:** claim `83f7286c`; rows, notes and scripts `c7ab278d`; then this closing commit. Nothing was pushed or merged, and nothing is left running.
- **For the Orchestrator:** se-ABC-271 may start. It copies the rows from `fixtures.json` unchanged. Route `QE-271-a` to it.

### Trace row (10 cells, header order)

| qe-ABC-271-freeze | QE freeze of ABC-271's (E4a structure) K1 rows before the build: K1 (a) 12 new passer positions; K1 (c) 44 seam fixtures (U 15 incl. 5 out/in twins + phase-1 row; KD 9 pairs incl. enemy/own/past-cap; FP 4 piece pairs + king pair + control), per side features and seam {kd, free, un} by hand from ADR-0070 d1/d2; K0 copied from ADR-0070 d5 | EPIC-011 | ADR-0070 (accepted form (a); unchanged by QE) | none graded here | `grugops/qe-ABC-271-freeze` (rows + PREREG `…decision-67b5eeac` + gaps `…observation-a8173b00`: `c7ab278d`) | `.grugops/context/qe-ABC-271-freeze/raw/fixtures.json` (sha256 bf3c205b…); verify.mjs exit 0 on main (ADR-text re-implementation + main's FEN/phase/isPassedPawn/mirror) | UAT owed at the build; not signed by the freeze | QE-271-a LOW (seam per side, U not netted); QE-271-b..e INFO | freeze done; se-ABC-271 may build against these rows |
