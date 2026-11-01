---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T18:09:43Z
subtask: arch-d3-under-load
role: architect-design
ref: .grugops/context/arch-d3-under-load/
branch: new grugops/arch-d3-under-load from main (worktree .claude/worktrees/arch-d3-under-load)
width: records only.
---
# Architect: rule how ADR-0055 D3's nps validity rule reads on a shared host (QE-254-a)
## Facts
Two ALONE-start A4 reads of ABC-254 voided under the 5 % spread rule (qe-ABC-254 …1c801504 / …09221f68 on branch grugops/qe-ABC-254; qe-ABC-254-a4 …ab3062eb / …d9649ce2 / …f704f071 on branch grugops/qe-ABC-254-a4 — read with git show). Foreign load arrives within ~1 min of start, much of it short-lived processes (< 4 s) the per-run snapshot cannot name — possibly including this session's own records/SE hops (git, node seal scripts), not only the owner's other repo.
## Do
- Rule a validity method for nps A/B reads on this host that is robust to bursty foreign load and keeps the bar's meaning — e.g. paired-ratio median over interleaved pairs, discard pairs whose per-run foreign-core reading exceeds a threshold, require ≥ N clear pairs per board, or a CPU-time (process user+sys) based nps instead of wall time. Name its false-pass risk vs today's rule.
- **The ruling is forward-only:** it applies to a FRESH pre-registered read; it must not re-grade the two existing reads (their data is already seen). State that.
- Say whether it amends ADR-0055 D3 (your call; no NFR moves → no owner ask unless you judge it a big call), and what the Orchestrator must do to make a window "alone" (e.g. no other hop of this session running at all).
## Fences
memory-bank/50-decisions/ADR-0055* and your notes only. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-d3-under-load, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.
