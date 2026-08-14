---
task: readyfordev-ABC-042
subtask: security-nfr-ABC-042
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/security-nfr-ABC-042/
parent_ref: .grugops/context/readyfordev-ABC-042/
enqueued_by: orchestrator
enqueued_at: 2026-08-14T17:17:19Z
branch: grugops/readyfordev-ABC-042
worktree: (none — writes notes only, disjoint paths)
---

# Subtask: rule `ABC-042`'s own security trigger BEFORE a line is written

`ABC-042` declares its security half **triggered and NOT waived** — the first production module in
this repository that reads `process.argv`. It states three bars and a falsifiable firing threshold.

Rule on them at the `Ready for Dev` exit, not at review. The reading is **yours**, not the
implementer's — see the parent ref.
