---
task: rule-abc115-residuals
by: ba-pm
at: 2026-08-21T03:00:00Z
---

Claimed by hand per `agent-factory/workflows/17-task-claim.md` and `AGENTS.md` § "Role / workflow
files": `scripts/claim.js` is absent from this repository and from the kit, so the atomic act is the
bare `mkdir` of this directory (no `-p`), which succeeded exactly once.
