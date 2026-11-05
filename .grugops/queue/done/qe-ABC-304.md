---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T00:01:19Z
subtask: qe-ABC-304
role: qe-e2e
ref: .grugops/context/qe-ABC-304/
branch: new grugops/qe-ABC-304 from grugops/ABC-304 (tip e1ac9209) — worktree .claude/worktrees/qe-ABC-304
width: read and verify; your records. No src or test edits.
---
# Verify ABC-304 (test-only)
Read ABC-304 whole and se-ABC-304's notes (…aa228da0, …26228fe3, …74a63e3d). Take A1–A5 on your own runs, not the engineer's logs. The deep lanes must show each named row actually ran. Read the NFR-009 row in the diff, since it is green either way. Rule on the engineer's two disclosed readings. Say whether A3 (b) and A4 (b) in src/see.test.ts need the Architect, and give your reason. Carry A5's nine-row list into your Result. UAT is waived by the ticket; your verdict closes it.
Every test run goes under the host lock named in your dispatch prompt, with no exceptions. Check each output is non-empty. No game is owed.
Fences: no ADR, ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-304, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

_by qe-e2e (claude-opus-5-5, qe-ABC-304), 2026-11-05T00:16:11Z, branch `grugops/qe-ABC-304` from `grugops/ABC-304` `e1ac9209`. Records only. Nothing left running. Nothing pushed or merged._

**Verdict: PASS_WITH_GAPS**, none blocking (one LOW, four INFO). UAT stays waived, with zero production lines by A4; this verdict closes the hop. All readings are QE's own, at `src/` tree `52c37499`.

- **A1, MET:** passer deep lane exit 0, **28 / 28**. All seven rows `passed` with real durations and read `FROZEN.k0` exactly: 766 275, 1 725 150, 87 475, 253 724, 533 916, 605 117, 406 787. A probe reads the shipped path at `…261ea757`'s seven reds, so the rows tell the two searches apart.
- **A2, MET:** SEE deep lane exit 0, 52 / 52. `searchWithoutBundle` **96.26 %, 66 cp**; `chooseMoveWithoutBundle` **95.72 %, 96 cp**; each of 187 compared, 0 sign changes.
- **A3, MET:** `historyByteLength()` is a seventh term inside the summed `expect`, read in the diff. The level is unchanged and the row passes: `transposition` deep lanes 40 / 40 and 26 / 26. Printed sum 4 822 312 bytes, 4.599 MiB; 4 789 544 without the term.
- **A4, MET:** the pipeline prints nothing at `9e0d4044` and over the whole branch. Three test files, no JSON diff, `it` counts 22, 27, 32 unchanged.
- **A5, MET:** the nine rows below match the diff and the grep.
- **Standing gates:** lint, typecheck, build exit 0. `npm test` 2 684 / 2 684, 71 files. Skip count 0. `test-skip-integrity` No findings. The JSON reporter shows 0 failed, 0 pending, 0 todo in every deep lane.

**A5's nine re-pointed rows (`ADR-0058` d5):**
1. `kiwipete_chooseMove_d8` -> `chooseMoveWithoutBundle`
2. `kiwipete_chooseMove_d9` -> `chooseMoveWithoutBundle`
3. `pos6_chooseMove_d8` -> `chooseMoveWithoutBundle`
4. `pos6_chooseMove_d9` -> `chooseMoveWithoutBundle`
5. `pos6_chooseMove_d10` -> `chooseMoveWithoutBundle`
6. `kiwipete_search_d8` -> `searchWithoutBundle`
7. `pos6_search_d8` -> `searchWithoutBundle`
8. A3 (a) "search() against searchWithoutSeePruning at depth 5 …" -> `searchWithoutBundle`
9. A3 (a) "chooseMove against chooseMoveWithoutSeePruning deepened to 5 …" -> `chooseMoveWithoutBundle`

**The engineer's readings (`…aa228da0` 2 and 3): both upheld.** One comment per re-point block; the log labels stay.

**A3 (b): no door ruling needed.** It stays on `search()`: `ADR-0069` d8 names mates, and `…05ef9fc9` names this row. Reads 0 of 190 on both sides. One clause is owed: "compare with no door" is untrue of this row (`QE-304-b`).

**A4 (b): needs the Architect.** No record rules its door, so it is `UNKNOWN - verify`. The rule's words reach it, and it reads Q1 plus the bundle under a level set for Q1 alone: 6.868, +0.989 shipped; 6.716, +0.837 on the door; bar + 0.55. It gates nothing (`QE-304-a`, LOW).

- **Other gaps, INFO:** `QE-304-c`, the grep form misses `reach(chooseMove)`; `QE-304-d`, A7's table term depends on earlier rows, `-t` alone `UNKNOWN - verify`; `QE-304-e`, `se-ABC-304`'s `raw/exits.txt` lacks the wall field, and A4's literal range at the tip sees only records.
- **Merge:** `main` moved by records only (`plans/board.md`, this brief), so test note 3's re-read is not owed unless it moves again. The pending copy of this brief on `main` needs dropping before the merge.
- **Notes:** observation `20261105T001541Z-qe-e2e-observation-7d4a7c7f` (readings); decisions `…9ac0fbda` (rulings), `…e1bb0944` (verdict). 3 of 3 read back.
- **Commits:** claim `b8081f6a`; notes `59f747d5`; then this Result and the move to done/.
- **Next:** the Orchestrator takes the merge and the board; the Architect, `QE-304-a` and `-b`.
