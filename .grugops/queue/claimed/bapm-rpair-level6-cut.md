---
subtask: bapm-rpair-level6-cut
role: ba-pm
ticket: new (tools: rpair passes Skill Level 6); EPIC-010
ref: .grugops/context/bapm-rpair-level6-cut/
branch: new grugops/bapm-rpair-level6-cut from main (worktree .claude/worktrees/bapm-rpair-level6-cut)
width: records only; no vitest, no engine, no timing (qe-ABC-245 holds the host ALONE). Leave no process running.
---
# BA/PM (records): cut the rpair Skill-Level-6 ticket; restate the batch cost; audit the smoke ledger for 3 s/4 s asymmetry
## Read
- The Orchestrator ruling .grugops/context/orch-2026-10-30a/notes/20261031T065500Z-orchestrator-decision-fb0c8978.md.
- qe-EPIC-010-m1-batch's notes (PREREG …93c1fb08, evidence …5967dfc1, STOP …21029f54) and raw/probe/.
- ADR-0053 d10; EPIC-010 (§ "Did things get worse?", § The smoke ledger, the cost blocks); ABC-225's page; tools/rating/rating.ts and pair.ts (read only).
## Do
1. **Cut one ticket** (next free id, tools only, EPIC-010, P1 because it blocks milestone 1's batch):
   - rpair passes `option.Skill Level=6` to skytalix on both sides.
   - Acceptance:
     - pair-check pins the option in the argv;
     - a probe shows `go movetime 4000` searches about 4 000 ms at base ca6e675c and at head;
     - the SE confirms that the level reaches nothing in `go()` but the budget cap at both SHAs (levels 5 and 6 are both rate 0);
     - the D and R smoke paths are either left alone, with the reason stated, or given the same option. Your call; state it.
   - Size, DoR, no UAT (tools only). QE verdict.
2. **Restate the batch cost** on EPIC-010 and ABC-225: about 21.7–24.1 h ALONE at 4 000 ms both sides (QE-M1B-b), plus about 1 h of QE. Note that ABC-225-w1 A5's 21.67 games/h was a 3 000 ms rate.
3. **Audit (records reading, no runs):** list every R smoke in the ledger whose base predates ABC-228's merge (e42b637b, where level 5 went 3 000 → 4 000) while R sent 4 000 ms. Say whether its base side was capped at 3 000 ms, whether its verdict or the trend pool could move, and what (if anything) is owed. Name confidence; mark anything you cannot settle from records `UNKNOWN - verify`.
## Fences
Records only: plans/tickets/, plans/epics/. No board, ADR, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-rpair-level6-cut`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.
