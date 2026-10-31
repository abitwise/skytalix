---
subtask: arch-hostname-adrs
role: architect-design
ref: .grugops/context/arch-hostname-adrs/
branch: new grugops/arch-hostname-adrs from main (worktree .claude/worktrees/arch-hostname-adrs)
width: records only; no vitest, no engine, no timing (a 400-game batch holds the host ALONE). Leave no process running.
---
# Architect (records): reference machine spelled oeselg-dev in ADR-0035 and ADR-0046
## Read
Owner note .grugops/context/orch-2026-10-30a/notes/20261031T073000Z-orchestrator-decision-c2752305.md ("hostname spelling: oeselg-dev"); secnfr-hostname's observation …8b4e0311 (ADR-0035 L104, L754, L779; ADR-0046 L220).
## Do
Correct those 4 places to `oeselg-dev`, with a dated line citing …c2752305. Keep any verbatim owner quote as written, as secnfr-hostname did.
## Fences
ADR-0035* and ADR-0046* only. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-hostname-adrs`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
