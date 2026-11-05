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

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-05T13:42:01Z. Measured on scratch copies of main 8d66a706, under the PREREG …5c65a408, about 25 minutes of lock, one core, one worker. No src, tool or data file on the branch changed.
- **DoR row 10 is not closed (2026-11-05).** Everything is measured and eight rows hold, but the PREREG closes it only with all nine S, and C1 misses clause (d).
- **Forms:** Q1, Q2, Q3, L1, L2, L3, C2, B1 stay S on every clause. C1 meets (a) to (c). Alone on its `-t` line under MC1 the full row reads 1 passed, at the tip and at base; M6 reads 1 failed. No row must go K or W.
- **Parity:** all 20 src and data mutants killed at base and tip; every plant the base file kills, the tip file kills; ABC-241 A7's eight hold. Default lane 2 709 in 71 files, 9 names out and 9 in. A5 measured: 3 red at base, 0 at the tip.
- **B1's k is 7.** Kept ms, ungraded: Q1 13.9, Q2 7.3, Q3 26.9, L1 84.1, L2 0.3, L3 3.5, C1 12.3, C2 1.9, B1 49.6.
- **Sum:** no K, 0 of 113. At the sealed scale saved 592 of 750 against 581, about -0.219 s realised: inside by 11 ms, less than the read's noise. Any K but B1 now reads past it, C1 alone at about 555.
- **To the Orchestrator:** C1's clause (d), recommended ruling (a) in …727e0d0c; AR-154-TWO-POINT-CONTROL's trigger R-a, which ABC-307's page does not carry. **Owner question: none.**
- **BA/PM's page lines:** in decision …727e0d0c, written once; A7's C1 line waits for the ruling.
- **Records:** ADR-0046 § Dated 2026-11-05 (`arch-ABC-307-reads`) and Status pointer; PREREG …5c65a408, observation …f8c13d49, decision …727e0d0c, with raw/. No ticket, EPIC, board, src or tool file changed. Nothing is left running.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exit 0, on this branch before this line.
