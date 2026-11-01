---
id: 20261101T203909Z-software-engineer-observation-d1e5f719
kind: observation
by: software-engineer
at: 2026-11-01T20:39:09Z
verified_by: 
confidence: high
refs:
  - ABC-251
  - se-ABC-251
  - EPIC-010
  - ADR-0055
  - grugops/ABC-251
  - 51b803c0
  - arch-abc250-close/20261101T202347Z-architect-design-decision-a07418ac
  - src/position.ts
  - src/engine.ts
  - .grugops/context/se-ABC-251/raw/
supersedes: 
seal: sha256:4633e2d99eeefb7af88fade1190426ab456767a0c511c4a17e80940e7e957dc6
---

Trace refs for ABC-251 (task se-ABC-251). Branch grugops/ABC-251 (worktree .claude/worktrees/se-ABC-251) from main 51b803c0. **STOPPED at item 2a; no src/ or test change.** The commits on the branch are the claim and this context: notes plus raw/ evidence.
- raw/ holds the scripts (run.mts, profile.sh, analyse.mts, callers.mts, ab.sh, m.mjs, m2.mjs, budget.mjs) and the outputs (analysis.txt, callers.txt, inlining.txt, ab-runs.txt, ab-summary.txt).
- The .cpuprofile files are not committed (their url fields carry host paths; ADR-0049 d4). They are regenerable with profile.sh.
- Gates: none run, because there is no code change. lint/typecheck/test/build at the tip equal main's (a docs-only diff under .grugops/).
- A1, A2, A3, A5 are not applicable (no head build). G2/G3 are not owed (evaluate.ts untouched).
- Owed next: the Orchestrator's drop routing ("nothing to cut"). Per the page, the ABC-253 order may now swap.
