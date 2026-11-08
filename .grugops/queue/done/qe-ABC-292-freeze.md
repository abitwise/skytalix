---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T08:53:42Z
subtask: qe-ABC-292-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-292-freeze/
branch: new grugops/qe-ABC-292-freeze from main — worktree .claude/worktrees/qe-ABC-292-freeze
width: ADR-0076 d10 step 3, the freeze. Fixtures and records only. No src/ row, no build, no probe, no games.
---
# ABC-292: QE's freeze, before the probe and the build
Read ADR-0076 (ACCEPTED) d2, d3, d4, d9, d10, d13 and § The pins this term moves; ABC-292's page K0–K7; the owner's answers …23d30c72; my rulings …89b7220c and …e63ff24f.
1. Freeze, from d2's definitions, d3's rule and values and the K rows' words alone. No patch exists; write none and read none. Work every expected value by hand:
   - seam fixtures per d9 (c): at least one per definition per colour, one per edge file for each rook definition, and every listed case (one bishop; two; three; same-colour pair; a rook file failing each clause alone; doubled rooks; a seventh-rank rook on an open file; no pawns);
   - ≥ 12 new mirror positions for d9 (a);
   - the (b) sets, by name and commit;
   - K2's two re-found fixtures (ABC-083 A4's first row and A3 (b)): fixtures on which the rows' words and relation hold on a correct build, the rule they check unchanged.
2. Fixture files live under your task's records (not src/). Seal one `decision` note naming each file with its sha256, main's tip, and what each row expects. Name the freeze commit in the note's follow-up or Result so the dispatch check (`git merge-base --is-ancestor <freeze commit> main`) can run.
3. You may run read-only checks on main (FEN legality, move generation, the current evaluation as a baseline) if needed. Every run goes under the host lock: `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. No probe, PREREG, timing read or game: those are the Architect's step 4 and later.
If a definition reads ambiguous enough that two hand values are possible, STOP to Architect/Design with the case. Do not choose. No bar moves. Fences: your task records and fixtures. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**Done: `ADR-0076` d10 step 3. The freeze was made from d2, d3 and the K rows' words alone, with no patch in the world and none read.**
- **The freeze note** is `20261108T090744Z-qe-e2e-decision-277b648a` (sealed). **The freeze commit is `e88e91f9`** (`e88e91f9bf0455d3b2d71299d658853f3407bb0f`), for d10 step 6's `git merge-base --is-ancestor e88e91f9 main` after the merge, and for step 8's re-read.
- It was taken at `main` `0885de71`, `src/` tree `bba42fb7` (the ADR's own tree).
- Nothing under `src/` or `tools/` was touched, and no ticket, ADR, EPIC or board line was changed. No row was written to `src/`.

**The files:**
- `.grugops/context/qe-ABC-292-freeze/raw/fixtures.json`, sha256 `6dc902c6be848e970a0cf66228f82e8f00f6e3d2d070fe954d85a27309ffbfe4`. It holds K1 (c), K1 (a) and K2.
- `.grugops/context/qe-ABC-292-freeze/raw/pre-ticket.json`, sha256 `ed6a6fdad7c66737e1df4b83478ecb10125c23c6d397ecb4da6a6d6d6146ff36`. It holds K1 (b)'s sets and the new rows' baseline.

**The rows:**
- **K1 (c): 39 seam fixtures.** Each has a FEN, a hand phase, and per side the bishop count, the open and semi-open files and the three parts in mg / eg, plus net and side-to-move (K1 (d)).
  - By group: pair 10, open 4, semi 4, clause-fails 4, whole-file 2, doubled 4, seventh 2, no-pawns 3, shared-file 2, full board 4.
  - d9's list is met and checked: per definition per colour; each edge file for each rook definition and colour; one, two and three bishops; a same-colour pair per colour; each clause failing alone; doubled rooks on an open and on a semi-open file; a seventh-rank rook per colour; no pawns, with K R against K reading 20.
- **K1 (a): 15 new mirror positions** (`A01`–`A15`). None is in `G3`, `TAPER_MIRROR_POSITIONS` or `TAPER_DOOR_CORPUS`, nor is a mirror of one.
- **K1 (b): the sets, by name and commit, re-read on `main` now with 0 mismatches:**
  - `G3` (184, `src/evaluate.mirror-corpus.ts` @ `34c9c026`);
  - `TAPER_MIRROR_POSITIONS` / `TAPER_DOOR_CORPUS` / `G3_CORPUS_MAIN_EVALUATE` (30 / 176 / 184, `src/evaluate.taper-corpus.ts` @ `d6a57653`);
  - `G3_PRE` / `DOOR_PRE` / `QUEEN_PAIR_PRE` / `PASSER_PRE` (184 / 176 / 28 / 112, `src/evaluate.passer.test.ts` @ `158bb992`; the copy in the queen-on file is equal);
  - 116 new rows with `main`'s baseline (58 positions and their mirrors).
- **K2: two re-found `ABC-083` fixtures.** On each, the hand piece net is 0, so the relation on a correct build is the one on `main`.
  - **A4 row 1:** `6kr/3p2pp/8/8/3R4/8/3P2PP/6K1 w - - 0 1` (d2 / d7 pawns added). Legal moves 19 against 8; `evaluateWithoutMobility` 0; `evaluate` +48 / −48.
  - **A3 (b) and its twin:** `rnbr1qk1/3nbppp/8/{5P2|4P3}/8/8/3NB1PP/RNBR1QK1 w - - 0 1` (the f-rooks and queens swapped). E5 − F5 reads −2 on and +8 zeroed, the old pair's margins exactly.

**Checks**, every run under `flock <scratch>/<home>/<repo>/host-test.lock`, on one core:
- `verify.mjs` exit 0, 1300 checks, 0 failures. It checks the hand values against a labeller written from d2's words, colour symmetry, the arithmetic, and `main`'s FEN, check, phase and mirror on every board, plus d9's list and K2 on `main`.
- A copy with 4 planted errors read 6 FAILs.
- `b-sets.mjs` exit 0. Both JSON files regenerate byte for byte.
- No `npm test`, build, search, probe, PREREG, timing read or game was run.

**No stop.** No definition read two ways.

**Gaps** (`20261108T090750Z-qe-e2e-observation-c16ba4c6`), all INFO:
- `QE-292-a`: the seam is graded per side and part.
- `QE-292-b`: "a file holds" is the whole file (RW1 / RW2).
- `QE-292-c` and `QE-292-d`: the K2 forms. `MOBILE_WHITE` and the old phase-24 FENs stay in `KING_POSITIONS`.
- `QE-292-e`: the other `ABC-083` rows are unaffected by hand, for PR11.
- `QE-292-f`: `newRows` is a baseline, re-read on a moved base.
- `QE-292-g`: what is not graded here.

**Commits:** claim `23abe05a`; freeze `e88e91f9`; then this closing commit. Nothing was pushed or merged, and nothing is left running.

**For the Orchestrator:**
- Merge this branch to make step 3 "merged to `main`".
- Then step 4, the Architect's probe, may start. Its PREREG commit must descend from `e88e91f9`, and PR3 reads `fixtures.json`.
- A build brief cites `…decision-277b648a`.

### Trace row (10 cells, header order)

| qe-ABC-292-freeze | QE freeze of ABC-292 (E5, ADR-0076 d10 step 3) before the probe and the build: K1 (c) 39 seam fixtures by hand from d2/d3 (pair 10, open 4, semi 4, clause-fails 4, whole-file 2, doubled 4, seventh 2, no-pawns 3, shared-file 2, full 4; per side parts mg/eg, net, stm); K1 (a) 15 new mirror positions; K1 (b) sets by name and commit + 116 baseline rows; K2's two re-found ABC-083 fixtures (A4 row 1, A3 (b) + twin) | EPIC-011 | ADR-0076 (accepted; unchanged by QE) | none graded here | `grugops/qe-ABC-292-freeze` (freeze `e88e91f9`: notes `…decision-277b648a`, `…observation-c16ba4c6`) | `.grugops/context/qe-ABC-292-freeze/raw/fixtures.json` (sha256 6dc902c6…), `raw/pre-ticket.json` (sha256 ed6a6fda…); verify.mjs exit 0 (1300 checks) + planted 6 FAILs; b-sets.mjs exit 0 on main 0885de71 | UAT owed at the build; not signed by the freeze | QE-292-a..g INFO; no stop | freeze done; step 4 (probe) may start after this merges; build brief cites …277b648a |
