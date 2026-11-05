---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: arch-ABC-282-close
role: architect-design
ref: .grugops/context/arch-ABC-282-close/
branch: new grugops/arch-ABC-282-close from main — worktree .claude/worktrees/arch-ABC-282-close
width: records only; nothing run. No test, build or engine.
---
# ADR lines owed at ABC-282's merge
Read QE's verdict …5191f871, its gaps note …4f8f7f5d, and the Orchestrator's latest decision note. ABC-282 merged at a6ae8227.
1. ADR-0071 § Status: in force.
2. ADR-0066's d5 line owed at this merge.
3. QE-282-l: W1 banks time into a period's last moves. 13 of 606 budgets sat at the 59 500 cap; the longest move took 59 501 ms, 499 ms under NFR-004's ceiling. Say whether any ADR line changes and whether a Security/NFR read is owed. No bar is broken. QE-223-c's "the cap is not approached" no longer holds: name the page line BA/PM should change.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-282-close, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-05, Architect/Design. Items 1–3 done. Records only, on `grugops/arch-ABC-282-close` from `main` `2e46933f`. No test, build, engine, lint or typecheck run. Nothing pushed or merged, no ticket, EPIC, board, `src/` or tool edit, nothing left running.**

- **1 (`…1ce8828d` 1, text `723c406f`):** `ADR-0071` § Status reads IN FORCE 2026-11-05, from `a6ae8227`. The ACCEPTED block stays under *Before the merge*. Two log rows.
- **2 (`…1ce8828d` 2):** `ADR-0066` decision 5 has D12 item 5's dated line, and one log row.
- **3, QE-282-l (`…1ce8828d` 3):** no decision, value or bar moves. Two dated lines in `ADR-0071`: under D11, whose "whole remainder" was wrong above the cap, and under § Consequences, `NFR-004`, which now states that W1 brings the cap into play. `AR-UCI-BUSY` keeps ≤ 60 s.
- **Security/NFR (`…1ce8828d` 4):** one read is owed, records only, with no run or gate, blocking nothing. `NFR-004`'s `Verified by` still waits on QE's `A10` re-run, A4 is the first reading at the cap in play, and `AR-NFR004-A` is theirs to re-accept. The route is the Orchestrator's.
- **The page line (`…1ce8828d` 5):** `ABC-223` line 40 at `2e46933f`, disposition c, "The cap is not approached at 40/15." The note gives the struck-and-kept text and the lines to leave.
- **Readings (`…e7ff2fa4`):** QE-282-l's figures re-read from `moves.tsv` and agree. Stale dated lines in `ADR-0052`, `ADR-0056` and `ADR-0066` § Status are listed there, not edited.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exited 0 before the last commit.
