---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:05:34Z
subtask: arch-ABC-265
role: architect-design
ref: .grugops/context/arch-ABC-265/
branch: new grugops/arch-ABC-265 from main (0d7b9d2f) — worktree .claude/worktrees/arch-ABC-265
width: records; any probe ≤ 5 min and wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; deterministic counts only, no timing (a game read holds the host).
---
# Design ABC-265 (TH-1, shared table): write the ADR-0025 amendment
## Read
plans/tickets/ABC-265*.md, ADR-0057 § Inputs for the thread tickets + D2.3, ADR-0025, ADR-0058 (accepted, not in force), src/transposition.ts.
## Do
- Write the ADR-0025 amendment (decision 2, decision 4's last bullet) for the 4×Uint32 SharedArrayBuffer slot with XOR check, key split inside probeTable/storeEntry, node-equal at Threads 1. Status PROPOSED (the owner accepts it — reading (b) lets the build start once it exists).
- Settle ABC-265 open items: does it owe the ≈1 h S2 nps read on top of G6 + profile (EPIC-011 rule vs ADR-0057)? Give one answer with reason; if yes it is an owner ask (> 1 h).
- Name anything the page needs to reach DoR 10/10.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-ABC-265, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
