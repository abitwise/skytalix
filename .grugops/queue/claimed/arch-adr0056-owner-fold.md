---
subtask: arch-adr0056-owner-fold
role: architect-design
ref: .grugops/context/arch-adr0056-owner-fold/
branch: new grugops/arch-adr0056-owner-fold from main (worktree .claude/worktrees/arch-adr0056-owner-fold)
width: records only. qe-ABC-223 holds the host STRICTLY ALONE. A BA/PM hop creates EPIC-011 beside you (plans/ only).
---
# Architect: fold the owner's answers into ADR-0056 (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T124000Z-orchestrator-decision-022fb66f.md (verbatim inside).
## Do
1. ADR-0056 status: accepted in direction (owner 2026-11-01, "happy with where we are going"); list which D7 questions are answered (Q-3K-1 time control = 40/15 for the claim; Q-3K-5 = new epic, after the open epics close) and which stay open.
2. Re-state the measurement plan for the claim at 40/15 (~22 s/move; EPIC-009 uci-clock-mode; needs real time management): Stockfish's side at high E (depth/time so its strength holds), games per reading, host hours at width 1, thermal note.
3. Fast routine readings: the owner allows shorter controls down to 0.5 s/move. Propose the routine control(s) for per-change SPRT and for milestone trend readings, and say what a shorter control can and cannot predict about 40/15 (scaling caveat). Keep the claim rule at 40/15.
4. Reconcile one order line: ADR-0056 D6 lists O1-a before O1-b; ADR-0055 D4 and the board pull ABC-250 (O1-b, the gate reading) first, ABC-253 (O1-a) after. Say which stands (the Orchestrator keeps ABC-250 first unless you show a reason).
## Fences
- memory-bank/50-decisions/ADR-0056* (dated lines / status) and your notes only. No plans/, board, src/, tools/, data/, AGENTS.md. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-adr0056-owner-fold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
