---
task: wave-2026-09-25
subtask: fix-ABC-083-relevel
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/fix-ABC-083-relevel/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-083-king-safety-mobility (tip fa81b948, base 489c549e — stale)
hold: dispatch when a slot frees
---

# Subtask: bring ABC-083 up to main by MERGE (not rebase) and apply ADR-0039's re-levels (now ACCEPTED), node counts only

`ADR-0039` was accepted by the owner on 2026-10-11 (note `…owner-word-accept-adr0039-53cde860`). Its decision 3 conditions bind:
1. **Merge `main` INTO `grugops/ABC-083-king-safety-mobility`** (owner's call, 2026-10-11: a rebase over 136 commits is likely to fail; a plain merge keeps history and needs no force). Resolve the conflicts on the branch. ABC-010, ABC-131, ABC-094, ABC-142 and ABC-114 have landed since. Gates must be green. Do NOT merge back to main; that happens only after every ABC-083 gate clears.
2. **Re-read rows 14 and 15** on the merged tree. These are deterministic node counts. They should still read 43.56 % and 28.46x; if not, STOP and report.
3. **Proof (iii) for row 14:** plant the unordered-quiescence mutant and read its ratio. **It must read above 42x.** If it reads ≤ 42x, STOP: the re-level is refused and the Architect rules.
4. **Only if 2 and 3 hold:** apply the two re-levels in **their own commit**: row 15 ≤ 40.5 % → ≤ 65 %, row 14 ≤ 26x → ≤ 42x, citing ADR-0039.

**Do not touch PUZZLE_DEEP seed 5061, the N8-LANE CPU or A9 depth.** QE, Security/NFR and a quiet window own those. Take no timing grades.
The ticket stays `Blocked` until all of them clear. If A9 later stops, mobility is cut (ADR-0031 d5) and the re-level commit is reverted.

## Fences
Never merge to the wave; never push. Do not touch `plans/board.md`. Work in your own worktree, with `node_modules` linked into it only. No force of any kind, and no history rewrite. End each commit with a `Co-Authored-By:` trailer naming the model you actually are.
Publish notes per Workflow 16. Move the queue file pending → claimed → done by hand.
