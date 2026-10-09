---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-082-rehop
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-082-evaluation-pawn-structure.md
ref: .grugops/context/ticket-to-pr-ABC-082/
ruling_ref: .grugops/context/ruling-abc082-levels/   (fold list …33e5e0a3; ADR-0028 PROPOSED)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T16:52:53Z
branch: grugops/ABC-082-pawn-structure (continue; worktree .claude/worktrees/ABC-082-pawn-structure)
base: grugops/ABC-082-pawn-structure @ 71b140d
---

# Subtask: apply `ruling-abc082-levels` to the `ABC-082` build

Architect/Design ruled all three rows (`71b140d`). Apply exactly this, nothing wider:

1. **Row 21 — no owner word needed, apply now.** `src/quiescence.test.ts` `:206` →
   `4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1`, `:218` → `1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1`;
   update the row's comment to point at the ruling. The level is unchanged.
2. **Row 17 — owner word OWED (`ADR-0028` proposed).** Make it ONE SEPARATE COMMIT AT THE TIP,
   subject starting `test(ABC-081): PENDING OWNER WORD —`: `src/transposition.test.ts` `0.15` →
   `0.1` at `:384` and `:402`, describe text `:375` → "at least 10%", A2 comments gain the new
   readings and an `ADR-0028` pointer. Nothing else in that commit, so it reverts cleanly.
3. **Row 8 — nothing.** Reading (b) upheld.
4. Re-run: `SEARCH_DEEP=1` `src/quiescence.test.ts` and `src/transposition.test.ts`, `npm test`,
   lint, typecheck, build. Report the transposition lane both WITHOUT and WITH commit 2.
5. Add rows 21, 17, 8 to the `A8` re-pin ledger in § Delivery (17 marked pending owner word).

## Stop conditions
Anything else red; any change outside the two test files and § Delivery / notes / trace.

## Fences
Never merge; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs, ticket
criteria (BA/PM folds those). Commit messages via a scratchpad file and `git commit -F`. Real UTC
stamps (`date -u`).

## Publish
`claim` + `observation` notes under `ref:`, ledger rows, a trace row. Queue pending → claimed →
done per Workflow 17. Report: gates, both deep lanes (with/without commit 2), both shas.
