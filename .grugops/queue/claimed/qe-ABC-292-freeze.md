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
