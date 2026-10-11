---
task: wave-2026-09-25
subtask: scribe-lines-2026-10-11
role: agents-md-scribe
ref: .grugops/context/scribe-lines-2026-10-11/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
---

# Subtask: land three owed AGENTS.md lines inside the byte cap

1. **The `LADDER_DEEP` lane line (ABC-085, merged).** The Engineer drafted it in artifact-ref `…8515e3e7` under `.grugops/context/ticket-to-pr-ABC-085/notes/`.
   Add QE-085-e: **"unset is the only off"**. `LADDER_DEEP=` and `=0` fail at load. Name the verdict route as ABC-146's (node, under ADR-0038's addendum).
2. **`RISK-ABC143-01`:** BA/PM's suggested line is in note `…de5cd740` under `.grugops/context/bapm-fold-qe143-2026-10-11/notes/`, beside "Do not change dependencies without reason".
3. **The `test.maxWorkers: 3` cap (ADR-0040, accepted) is NOT yet merged.** ABC-144 is in QE. Do NOT add a line for it; name it as owed at ABC-144's merge.

Measure AGENTS.md bytes before and after against the 32,768-byte silent-truncation cap (ABC-109). Report the headroom left. Tighten wording only where
you must, and never drop a rule. Do not run npm test. Do not touch `src/` or `plans/board.md`. Never merge or push. Work in your own worktree.
