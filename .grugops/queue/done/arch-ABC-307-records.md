---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T21:48:45Z
subtask: arch-ABC-307-records
role: architect-design
ref: .grugops/context/arch-ABC-307-records/
branch: new grugops/arch-ABC-307-records from main — worktree .claude/worktrees/arch-ABC-307-records
width: the records owed after ABC-307's merge. No src, no test.
---
# Records after ABC-307
1. F1 on the run rule: the 23rd line (…ad217a34 3; page § Open 4). Name the line and where it lives. If it needs an AGENTS.md edit, do not make it: hand the exact words to the Orchestrator for the Scribe, with the byte cost against the 18,432 B cap.
2. ADR-0046's stale qe-hop 35 and row 10: bring them to what merged at bce24018.
3. ADR-0075's undated 640 KiB lines: date them.
4. K5's half of ADR-0075 F2, needed before K4's PREREG: write it, or say what it waits on.
Dated insertions, never a rewrite of history. If any item would move a bar or a level, stop and say so.
Fences: ADRs and your records only. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-05T21:56:27Z. Records only, on `grugops/arch-ABC-307-records` from `main` `014b8fa2`. Nothing was run: no test, build or engine. Both ADRs took insertions only, 0 lines deleted. No bar or level moved.
1. **Done. `F1` is the run rule's 23rd line,** in `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307-records`). It joins by name, because rule item 3 takes moved rows and `F1` was born deep. 1 passed is by reading; the next QE hop under the rule confirms it. **`AGENTS.md`: no edit, 0 B,** 18 393 of 18 432 B.
2. **Done.** `ADR-0046` reads `qe-hop` 32 → 36 and row 10 met on …db111535 1, by dated lines at § Status and under each stale line.
3. **Done.** Every 640 KiB line in `ADR-0075` is dated: the title, § Status's summary, d3, § Consequences' two lines. Four more with the same stale fact are dated too: § Alternatives' two, § Rollback, and the open F2 line.
4. **Written, as a reading open to the Orchestrator until K4's PREREG seals.** One cut, one re-read, spent by PR8, so the build is the one re-read for both halves. A clean run below depth 6 is the second miss: STOP, a defect check, not merged. No same-code re-read. A void is not a miss.
- **To the Orchestrator:** confirm or overrule item 4. Whether a K5 second miss is also a miss under d11 (d), whose list names only a second `G2` miss; I did not add it. **Owner question: none today.**
- **Owed:** BA/PM's line on `ABC-291`'s F2 note; the board's line; the 23rd line in QE briefs; K5's read and void rule in K4's PREREG.
- **Notes:** …7cb68537 (decision), …c9edb1e2 (observation).
