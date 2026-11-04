---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:35:38Z
subtask: arch-ABC-302
role: architect-design
ref: .grugops/context/arch-ABC-302/
branch: new grugops/arch-ABC-302 from main — worktree .claude/worktrees/arch-ABC-302
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Mutant reads on scratch copies only; ≤ 1 h of runs. Host paths only as placeholders.
---
# Design ABC-302's remnants (form S): the nine rows, kill parity, R8/R9 placement
Read plans/tickets/ABC-302*.md (R1–R9, A4, A6, A8, the owed list), the Security/NFR decision …1184fec4, ADR-0046 § Dated 2026-11-04 (form S, R-281-a's rule) and the arch-ABC-281 records as the precedent.
1. For each of R1–R9, give a form and a default-lane remnant confirmed by mutant reads (default-lane kill parity), or "move whole" only with measured kill parity. Put the mutant list in a PREREG sealed before the reads; QE freezes it as A6.
2. Place R8 (cli.test ABC-241 A4) and R9 (engine.capacity ABC-122 A8) in existing lanes. R9's file mocks legal/zobrist/search, so choose (i) rewrite it mock-free, (ii) gate it under ENGINE_DEEP in its own file, run only by its -t line (check whether that counts as a new lane line under the no-new-lane rule), or (iii) keep it in the default lane. Confirm R8 still runs the real search if it is placed in uci-session. Check whether R6/R7 are already covered by ABC-281's QE-087-d slice.
3. Give each row's -t line with its expected passed count, for A4 and for the ADR-0046 run rule.
4. Write a dated line in ADR-0046 (form S, ABC-302) with the rows, forms and lanes.
The Orchestrator rules A8's 9.4 s as a target, not a hard bar, per BA/PM's routing. The within-ticket offset allowance is NOT adopted.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or test changes; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-302, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed lines for BA/PM (DoR row 10) and the SE build lines; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
