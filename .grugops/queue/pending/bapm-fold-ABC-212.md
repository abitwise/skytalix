---
subtask: bapm-fold-ABC-212
role: ba-pm
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/bapm-fold-ABC-212/
branch: new grugops/bapm-fold-ABC-212 from grugops/qe-ABC-212 (052ae3ad), worktree ../wt-bapm-fold-ABC-212
width: 1 of 3 (beside security-nfr-ABC-212, scribe-runbook-ABC-212; records only)
---

# BA/PM fold lines at the ABC-212 merge

## Do
- Write the `ADR-0044` fold lines (D4.1, D4.4, D11, D5) and the `ABC-204` erratum, as owed by Architect `arch-design-ABC-212/…d2c68ace` ("BA/PM at the merge") and restated by QE `qe-ABC-212/…e58d4635`. Dated lines; no requirement, scope or bound changes (anything like that → STOP, name it).
- Do not touch `plans/nfr-catalog.md` (Security/NFR's hop) or `memory-bank/70-runbook.md` (Scribe's hop).

## Fences
- Only your worktree and `<scratchpad>/bapm212/`. No `src/` edits. Read-only context reads, not render(). Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task bapm-fold-ABC-212). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
