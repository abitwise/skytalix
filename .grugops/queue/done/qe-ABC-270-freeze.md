---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:19:37Z
subtask: qe-ABC-270-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-270-freeze/
branch: new grugops/qe-ABC-270-freeze from main — worktree .claude/worktrees/qe-ABC-270-freeze
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Small reads only (≤ 30 min); no games. Host paths only as placeholders.
---
# Freeze ABC-270's K1 (c) rows before the build (ADR-0068 ACCEPTED)
Read plans/tickets/ABC-270*.md (structure only, K0–K4), ADR-0068 (K1 (c): ≥ 6 queen pairs — positions with the enemy queen on/off and the expected per-file queen-on feature counts; ADR-0067's tracer row reuses them), ADR-0064 B0 counts.
Freeze, in a sealed decision note before any SE build exists: ≥ 6 queen pairs (FEN, side, expected counts for KING_SHELTER_MISSING_QUEEN / KING_FILE_HALF_OPEN_QUEEN / KING_FILE_OPEN_QUEEN per king, derived by hand from the ADR's definitions, not from code), plus K0's node-identity numbers as the ADR lists them. Include at least one pair where the queen is removed and counts must drop to 0, one mirrored pair, and one with both queens. These rows are what se-ABC-270 must implement and what QE grades later; SE may not change them.
## Fences
Your records only (notes + raw/). No src/tools edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task qe-ABC-270-freeze, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result

**Done: the K1 (c) rows are frozen before any build.** PREREG `20261103T222633Z-qe-e2e-decision-fa82b3f3` (sealed). The data is in `.grugops/context/qe-ABC-270-freeze/raw/pairs.json` (sha256 `68769ea9…19c681`). It was taken at `main` `00e99db8`, `src/` tree `4cb84035`, and nothing under `src/` or `tools/` was touched.

- **7 queen pairs and 1 control.** Each pair differs only by the subject king's enemy queen(s). For every king in A and B the record gives the FEN, the side to move and the hand-derived counts: `KING_SHELTER_MISSING_QUEEN` / `KING_FILE_HALF_OPEN_QUEEN` / `KING_FILE_OPEN_QUEEN` = base s/h/o × the enemy-queen flag.
  - **Queen removed, the counts drop to 0:** the subject in all 7 pairs.
  - **Mirrored:** QP3 = `mirrorPosition(QP1)`.
  - **Both queens:** QP4 and QP5 remove the white queen and then the black from one A, which catches swapped flags.
  - **Shelter missing / half-open / open:** in 7 / 4 / 5 pairs.
  - **Traps:** an own pawn three ranks ahead (QP4); an h-file king with 2 files (QP6); a king on g2 with a pawn beside it, and two enemy queens against none, which a queen-count form reads 5 × (QP7).
  - **Control QC8:** two queens against one, and nothing may move.
- **How K1 (c) is graded:** with the queen-on pairs at 2 × base, the subject reads exactly 3 × in each half (25→75, 35→105, 40→120, 60→180, 50→150) and the other king is unchanged. The white-POV `evaluate` deltas are also frozen.
- **K0 is copied from `ADR-0068` d6:** 1 296 788 / 2 733 330; 404 930 / 926 005 / 1 692 669; `search()` d8 839 514 / 1 533 901. `main`'s `src/` is still `4cb84035`.
- **Checks on `main`:** `verify.mjs` exit 0, 0 failures.
  - The hand counts equal a re-implementation of the stated rule.
  - `main`'s `evaluate` agrees per base term (each zeroed through `withParametersForTest`, in `evaluate` and in `evaluateWithoutTaper`).
  - Every FEN is canonical and legal, and no side is in check.
  - `main` is mirror-exact on every row.
  - A mutated row read 8 FAILs. Every run went under `flock <host-test.lock>`. `npm test` was not run (no `src/` change).
- **Gaps** (`20261103T222638Z-qe-e2e-observation-543b10d8`):
  - **`QE-270-a` LOW (the Engineer):** there is no per-king exposure seam. QP2's A moves `evaluate` by 0 under the seam, so the build needs a test-only per-king read. Otherwise QE grades the net and records it.
  - **`QE-270-b` INFO:** whole-`evaluate` A against B is no K1 (c) reading.
  - **`QE-270-c` INFO:** what QP7 and QC8 catch.
- **Commits:** claim `aff0ecdc`; rows, notes and scripts `64b43c64`; then this closing commit. Nothing was pushed or merged, and nothing is left running.
- **For the Orchestrator:** se-ABC-270 may start. It copies the rows from `pairs.json` unchanged, and route `QE-270-a` to it.

### Trace row (10 cells, header order)

| qe-ABC-270-freeze | QE freeze of ABC-270's (E3a structure) K1 (c) rows before the build: 7 queen pairs + 1 control (FEN, side, per-king queen-on counts by hand from the stated rule; removed → 0, mirrored QP3, both queens QP4/QP5, two-queen QP7), plus K0 counts as ADR-0068 d6 lists them | EPIC-011 | ADR-0068 (accepted; unchanged by QE) | none graded here | `grugops/qe-ABC-270-freeze` (rows + PREREG `…decision-fa82b3f3` + gaps `…observation-543b10d8`: `64b43c64`) | `.grugops/context/qe-ABC-270-freeze/raw/pairs.json` (sha256 68769ea9…); verify.mjs exit 0 on main (rule re-implementation + main's evaluate per term) | UAT owed at the build; not signed by the freeze | QE-270-a LOW (per-king exposure read needed); QE-270-b/c INFO | freeze done; se-ABC-270 may build against these rows |
