---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:58:05Z
subtask: arch-ABC-283-mate
role: architect-design
ref: .grugops/context/arch-ABC-283-mate/
branch: new grugops/arch-ABC-283-mate from grugops/ABC-283 — worktree .claude/worktrees/arch-ABC-283-mate
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes ≤ 30 min each, ≤ 1 h total; no games. Host paths only as placeholders.
---
# Diagnose the bundle's mate-floor miss (ABC-283 history part) and rule on ADR-0063 F2
Read the Orchestrator ruling …19583086, se-ABC-283's notes (…0b0b135f failed-attempt, …0d3e1e5b acceptance, …d64042c4 design), ADR-0063 (incl. F2), ADR-0064 d7 and the code on grugops/ABC-283 (src/search.ts, src/engine.ts, src/search.bundle.test.ts).
The miss: search() d5 loses 1/190 mates (6k1/R7/5K2/8/8/8/8/8 w - - 2 2, 29995 → 652); chooseMove d5 loses 2/188. All are KRK, and history alone causes them.
1. Diagnose, under a PREREG sealed first. Trace why the mating line is lost, e.g.:
   - LMR reductions or futility skips that history's order now hits;
   - history in check or mate-threat nodes;
   - malus from mate-score cutoffs;
   - a pre-existing LMR or futility flaw that history only unmasks.
   Name the mechanism with evidence (node trace, move index of the mating move, door-by-door).
2. Rule on F2:
   - (i) a structural fix within ADR-0063's intent, not a value tune: for example, which nodes or moves history may affect, or keeping LMR and futility keyed to the pre-history move index. State it exactly and show on a scratch copy that the floor holds (search and chooseMove d5, and the chooseMove d6 report) with all three parts on, P0 unchanged.
   - (ii) or no such fix: ADR-0063 F2 fires.
   Write it as a dated line in ADR-0063, still PROPOSED, and give the SE build lines.
Fences: memory-bank/50-decisions, your records, scratch copies. No committed src or tests; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main or into grugops/ABC-283. Leave nothing running.
Publish: sealed notes (task arch-ABC-283-mate, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
