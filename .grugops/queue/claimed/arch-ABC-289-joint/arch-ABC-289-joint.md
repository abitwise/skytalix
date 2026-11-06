---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T19:05:19Z
subtask: arch-ABC-289-joint
role: architect-design
ref: .grugops/context/arch-ABC-289-joint/
branch: new grugops/arch-ABC-289-joint from main — worktree .claude/worktrees/arch-ABC-289-joint
width: read F1 and F7 of ADR-0074 on the joint tree and say what follows. ADR and records only.
---
# ABC-289 on the joint tree
se-ABC-289 stopped on an exact build (branch grugops/ABC-289 at b42706b3, worktree .claude/worktrees/se-ABC-289; notes …0e380b06, …4ad7c049, …8b80f592). With P4 and the countermove in, DP2 is red twice: drift max 34 cp against 30 (one row, kiwipete/a2a4 290 to 324; 99.47 % within 25 cp, met); G1 53 of 58 against 54 ("mate in 3, seed 1632" newly missed). With moveCount and countermove off, every ADR-0074 figure reproduces, so this is the tree and not a defect. 21 W1 rows are also red with no ruling.
Answer:
1. How F1 and F7 read on this build, by the ADR's letter. Is it NOT MET with the premise failed, or did the ADR's bars presume the old tree, and where does it say so? Quote the lines. Read Pins vs bars (…42c82347): zugzwang, mate floor, G1, identity and relation rows are never re-pinned; a row retires only with an Architect line.
2. The routes that remain, and for each what it moves. No bar is loosened because a red was seen: a route that changes a bar, or the owner's accepted form, goes to him and you say so plainly. The SE's alpha ≥ 20 000 lead is a lead: if a mate-band guard is a route, it is a new form, it clears G1 only on one scratch read, and it leaves drift at 34.
3. Your recommendation, in plain words, with cost: what ABC-289 is estimated to be worth now, and whether it is worth another form.
4. Whether ABC-291 may build now on main without waiting on ABC-289's outcome, and what its page needs.
5. The 21 rows: only if a route goes on, their form; otherwise nothing.
You may run read-only scratch reads under the host lock named in your dispatch prompt, on copies, no games. Do not change the branch.
Dated insertions in ADR-0074 only, if any. Fences: ADRs and your records. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
