---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T09:25:07Z
subtask: bapm-epic011-cut
role: ba-pm
ref: .grugops/context/bapm-epic011-cut/
branch: grugops/bapm-epic011-cut — worktree .claude/worktrees/bapm-epic011-cut (from main 149bc2ef)
width: records only; no engine runs needed (if you run anything, wrap it in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`).
---
# Analyse EPIC-011 and cut the next tickets
Owner 2026-11-03: "Analyze and create tickets under EPIC-011".
Read plans/epics/EPIC-011*.md, ADR-0056 (phases 0–5, D2), ADR-0057 (§D8 incl. D8.7 lazy eval), ADR-0064 (E1), the arch-next-pull notes (eval probe: 65 % of ≥ 50 cp errors survive two node doublings → evaluation is the bigger lever), and every EPIC-011 ticket page (open: ABC-233/234/236/237/239/257/258/266/269).
1. **Gap analysis** (sealed note): for each phase/milestone of EPIC-011, what is done, dropped, parked, in flight, and what has NO ticket yet. Rank the uncut items by evidence-backed expected gain per host hour (evaluation items after E1 first, unless the evidence says otherwise). Flag items whose premise is already disproven.
2. **Cut tickets** ABC-270 onward for the top items (as many as the evidence supports, typically 3–6): each with DoR, size, priority, pre-registered bars per ADR-0056 (per-change 100 games at 100 ms, GAIN 50.0 / NEUTRAL 43.0, S′ smoke at --elo 1810, Levels), falsifiers, dependencies, and "waits ADR" where design is owed. Do not duplicate ABC-234/236/239/269 or the parked tickets; do not re-open parked items.
3. **Fold the owner's 2026-11-02 answers** into EPIC-011 and the ABC-269 page: ADR-0064 ACCEPTED; Q-3K-4 = (b) (evaluation tickets judged on play with NFR-005's depth-6 floor; G6 "≥ base" reported, not graded). The Architect is ruling QE-269-a in parallel; leave a marked placeholder for its page effect.
4. Also fix ABC-263's page front matter (status still backlog; it is Done since 2026-11-01).
Fences: plans/epics, plans/tickets, plans/traceability.md + your records. Do NOT edit plans/board.md (the Orchestrator places tickets), ADRs, or the ABC-234/236/239 pages (Architect is designing). No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-epic011-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result; brief + claim to done/.
