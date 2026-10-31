---
subtask: secnfr-hostname
role: security-nfr
ticket: catalog reference machine (owner word …c2752305)
ref: .grugops/context/secnfr-hostname/
branch: new grugops/secnfr-hostname from main (worktree .claude/worktrees/secnfr-hostname)
width: records only; no vitest, no timing, no engine runs. A 400-game batch will hold the host ALONE. Leave no process running.
---
# Security/NFR (records): reference machine hostname is `oeselg-dev`
## Read
The owner note .grugops/context/orch-2026-10-30a/notes/20261031T073000Z-orchestrator-decision-c2752305.md (verbatim: "hostname spelling: oeselg-dev"); the earlier note …f4673b9f; plans/nfr-catalog.md.
## Do
- Correct every `oeselg-devl` in plans/nfr-catalog.md to `oeselg-dev`, with a dated line citing …c2752305. The referent (the Ubuntu Linux host) is unchanged.
- List any other live record (memory-bank/, AGENTS.md, tickets or epics) that carries the old spelling, for the owning role. Do not edit those. Leave historical board `_Updated` lines and sealed notes as they are.
## Fences
Records only: plans/nfr-catalog.md and your notes. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `secnfr-hostname`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
