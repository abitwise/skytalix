---
subtask: bapm-engine-revise
role: ba-pm
from: main HEAD (after b82c77bb)
branch: grugops/bapm-engine-revise
worktree: ../wt-bapm-engine-revise
---

# Revise EPIC-007 and the v1 ticket plan against the owner's Q1-Q11 answers and the revised ADR-0044 (records only)

Read first:
- the owner-word note `.grugops/context/wave-2026-09-25/notes/20261018T093000Z-orchestrator-decision-owner-word-engine-q1-q11-answered-a41c7e02.md`;
- the revised ADR-0044;
- the Architect's decision note `.grugops/context/arch-engine-revise/notes/…e4a7c912`;
- your own EPIC-007.

Do:
1. Revise EPIC-007 in place, keeping it PROPOSED:
   - v1 now includes the opening book (`OwnBook`), `Skill Level` 1-5, `go depth/nodes/mate`, the built `dist/` artifact with bin `skytalix`, and the GPL-3.0 licence.
   - Bridge: the web UI's own backend spawns the CLI. That backend and its router are out of this repo.
   - Mark Q1-Q11 answered. Carry the Architect's Q12 (licence scope a/b/c) and Q13 (rename) as open owner questions, with recommendations.
   - Revise success measures M1-M5. Add a measure for each new capability, kept small and testable, for example a cutechess `depth=` game and a `Skill Level` change being observable.
2. Edit EPIC-004's non-goal so its UCI half is lifted on the owner's Q1 word. Cite the note.
3. Re-cut the ticket plan:
   - Take the Architect's suggestion: an XS engine-limits ticket (`maxDepth`/`maxNodes`) ahead of ABC-167.
   - Keep ABC-167, ABC-168 and ABC-169. Use ids from ABC-170 upwards for anything new.
   - Write the ticket PAGES under `plans/tickets/`, with testable acceptance criteria, sizes and dependencies, in the style of existing pages such as ABC-166's.
   - Status for every ticket: Backlog, proposal. Nothing goes to Ready until the owner accepts.
   - KISS: as few tickets as the scope allows, each one XS or S.
4. Write one decision note under `.grugops/context/bapm-engine-revise/notes/`.

Fences:
- `git diff --name-only <base> HEAD -- src tools package.json package-lock.json vitest.config.ts memory-bank/50-decisions` must be empty.
- Do not edit `plans/board.md` or `plans/traceability.md`; the Orchestrator does those. Put a trace row in your handoff and list the board rows to add.
- No test or timing runs. Nothing pushed or merged.
- When finished, write `.grugops/queue/done/bapm-engine-revise.md` and `.claim.md`, uncommitted, in main's working tree.
