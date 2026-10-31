---
subtask: arch-ABC-221-records
role: architect-design
ticket: ABC-221 (closed) / ADR-0052, ADR-0054
ref: .grugops/context/arch-ABC-221-records/
branch: new grugops/arch-ABC-221-records from main (worktree .claude/worktrees/arch-ABC-221-records)
width: records only; no vitest, no timing, no long-running scripts. Leave no process running.
---
# Architect (records): ADR-0052 D4/D8 lines; ADR-0054 probe value
## Read
se-ABC-221 (SE-221-a, SE-221-b), qe-ABC-221 (SE-221-a arithmetic, QE-221-b), secnfr-ABC-221 (SEC-221-b) notes on main; qe-ABC-242's SE-242-a reading; ADR-0052 D4 and D8; ADR-0054.
## Do
1. **ADR-0052 D4:** add a dated line correcting the "≥ 117 s" figure (17 205 ms as A6 is worded; 117 735 ms in the +900 000 shape).
2. **ADR-0052 D8 (SEC-221-b):** rule on the deep-lane spawnSync in src/uci-session.test.ts (the --expose-gc NFR-009 instrument, deep lane only), and add a dated line either way.
3. **ADR-0054:** add a dated line saying the probe's base value has read −1020, not −1013, since the ABC-228 merge (e42b637b), per qe-ABC-242.
4. **QE-221-b:** src/levels.ts's comment that HARD_CEILING_MS is the largest level ceiling is false at 60 000. Say which ticket or ADR line carries it; do not edit src/.
- Anything that changes an owner-accepted decision is marked PROPOSED for the owner.
## Fences
Records only: ADR-0052* and ADR-0054* (ADR-0045/0044 folds are BA/PM's, running beside you). No src/, tools/, data/, ticket or board edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-ABC-221-records`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
