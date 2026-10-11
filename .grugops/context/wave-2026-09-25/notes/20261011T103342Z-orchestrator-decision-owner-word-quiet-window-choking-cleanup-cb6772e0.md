---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-11T10:33:42Z
sealed: false
refs: [ABC-083, ABC-144, ABC-116, ADR-0040]
---

# Owner word, 2026-10-11: quiet window yes; "choking" = CPU and heat; branch and worktree cleanup

Verbatim: "1. yes ; 2. ABC-144: it was choking cpu and generating heat ; 3. yes, also go over branches and make sure everything is merged to main that should be merged, delete branches that have already been merged (carefully, don't force anything), you can use subagent for that"

1. **Yes to the position-6 depth reading** (ABC-083 A9). It runs in the same width-1 quiet window as ABC-144's Window B (after the ABC-144 build) and ABC-116's A2 re-measure.
2. **"Choking" means CPU and heat, both.**
   - ADR-0040 (accepted, k = 3) answers the CPU part.
   - For heat, the Architect's trade-off table (`…c33f4ab8`) names two levers: fewer parallel hops, and k = 2 (−22.7 % CPU, 8.2 s wall, eligible under d2).
   - Window B logs `thermalpressurelevel` per run; that is the heat evidence.
   - If Window B shows moderate pressure at k = 3, the k = 2 option goes back to the owner. The Orchestrator does not lower k on its own.
3. **Cleanup:**
   - remove the 9 stale `.claude/worktrees/` worktrees (no force);
   - bring `main` up to the gated wave tip (fast-forward only, gates run before and after, per AGENTS.md § Branching model);
   - delete only branches that are fully merged into `main`, with `git branch -d` and never `-D`;
   - leave every branch with a live hop alone;
   - report anything unmerged rather than deciding it silently.
4. This is the Orchestrator's transcription of the owner's word in session, not a stamp.
