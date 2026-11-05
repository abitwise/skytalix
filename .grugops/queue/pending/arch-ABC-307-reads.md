---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T12:59:27Z
subtask: arch-ABC-307-reads
role: architect-design
ref: .grugops/context/arch-ABC-307-reads/
branch: new grugops/arch-ABC-307-reads from main — worktree .claude/worktrees/arch-ABC-307-reads
width: measured reads on a scratch copy under the host lock. Records only on the branch; no src or test edit lands.
---
# Measure ABC-307's predictions
Read decision …838ecf31, observation …f246a007, raw/holders.tsv, arch-ABC-302's method, and the Orchestrator's latest decision note.
1. Seal a PREREG before any run: the mutant list per row, including ABC-241 A7's eight, the ABC-154 plants, and each row's own mutant; what counts as killed; what would change a form.
2. On a scratch copy of main with the remnants written in, run the list. Report per row: killers, the remnant among them or its named holders, kept ms, and B1's k. Kept ms is ungraded.
3. Say whether each row stays S. A row that must go K or W, or a sum past the slack, comes to me. L3 with B1 or C2 is past it.
4. Close or do not close DoR row 10 in one dated line, and give BA/PM's page lines.
Keep the hop under 40 minutes of lock. Nothing from the scratch copy is committed but records. Check every output file is non-empty before reading it.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or tool edits on the branch. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-307-reads, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
