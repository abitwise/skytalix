---
subtask: bapm-goal3000-o1-cut
role: ba-pm
ref: .grugops/context/bapm-goal3000-o1-cut/
branch: new grugops/bapm-goal3000-o1-cut from main (worktree .claude/worktrees/bapm-goal3000-o1-cut)
width: records only (no vitest, no engine, no games). qe-ABC-223 holds the host STRICTLY ALONE. An Architect analysis hop runs beside you (it edits ADRs only).
---
# BA/PM: goal → 3 000 Elo; cut ADR-0055 option O1's tickets (records only)
## Owner word
.grugops/context/orch-2026-10-30a/notes/20261101T120000Z-orchestrator-decision-74216a44.md (verbatim inside).
## Do
1. **Goal:** where the product goal is recorded (EPIC-010 Q2 block ~:654–:705, EPIC-004 if it carries it, any product brief), add a dated line: goal 3 000 Elo replaces "≥ 2 700 or more, aspirational", owner 2026-11-01, quoted verbatim. Keep the old text struck/kept. Scale stays UNKNOWN - verify (owner named none); name the measurement question (R today: 4 s vs Stockfish UCI_Elo 1910 at 0.5 s; UCI_Elo caps at 3 190) as an open item for the Architect's analysis (arch-algo-analysis) — do not settle it.
2. **O1 tickets** from ADR-0055 (read it in full; options O1-a…O1-e, the A1/A0 bars):
   - O1-a BigInt off the hot path; O1-b moves packed into integers in reused typed arrays; O1-c simpler inlinable helpers (O1-b and O1-c may be one ticket if ADR-0055 pairs them). Each value-identical, graded on nps like ABC-235/240 (S2, no smoke), DoR scored.
   - O1-d (legality shortcut) → Backlog, waits the owner's yes on amending ADR-0003 (Q-SP-3); write its acceptance now so it is ready.
   - O1-e: not cut (ADR-0055 says not proposed now); record that.
   - Place them: EPIC-010 milestone 1b or a small epic — your call, say why. Next free ticket id after ABC-249.
3. Do not cut algorithm tickets: the Architect's analysis is running; the existing ABC-231…239 stay as they are until it reports.
## Fences
- plans/epics, plans/tickets only (plus your notes). No board, trace, ADRs, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-goal3000-o1-cut`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
