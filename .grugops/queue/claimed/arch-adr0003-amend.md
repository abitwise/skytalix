---
subtask: arch-adr0003-amend
role: architect-design
ref: .grugops/context/arch-adr0003-amend/
branch: new grugops/arch-adr0003-amend from main (worktree .claude/worktrees/arch-adr0003-amend)
width: records only. qe-ABC-223 holds the host STRICTLY ALONE; a BA/PM records hop runs beside you (plans/ only).
---
# Architect: amend ADR-0003 for lazy legality (ABC-254, ADR-0055 O1-d) — owner said yes
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T131000Z-orchestrator-decision-f7a50e95.md (verbatim inside): "ABC-254: yes".
## Do
- Amend ADR-0003 (clauses 1 and 3, as ABC-254's page and ADR-0055 O1-d / ADR-0003 menu item (c2) name): make/test/unmake only for king moves, en passant, pinned pieces and moves out of check; value-identical (same legal-move set on every position); the falsifiers (perft 32/32 exact, the six standard positions, in-check position-4 bar ≥ 0.97×) as ABC-254's acceptance states.
- Also rule BA/PM's open reading: does ADR-0003 clause 1 ("src/legal.ts is not changed") read as "make/test/unmake stays the strategy" for ABC-250 and ABC-252? State it so those tickets are not blocked.
- Mark ABC-254's design gate met (or name what is missing) in your Result for the Orchestrator.
## Fences
- memory-bank/50-decisions/ADR-0003* and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-adr0003-amend`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
