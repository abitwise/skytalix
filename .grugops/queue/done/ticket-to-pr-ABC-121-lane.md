---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-121-lane
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (re-hop on the N8-LANE stop)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
ref: .grugops/context/ticket-to-pr-ABC-121/
lane_ref: .grugops/context/ticket-to-pr-ABC-121/notes/   (N8-LANE …24e3648a)
enqueued_by: orchestrator
enqueued_at: 2026-09-26T03:30:00Z
branch: grugops/ABC-121-lane
base: grugops/ABC-121-pvs-lmr (tip after this enqueue)
---

# Subtask: `ABC-121` re-hop — bring the default-lane charge down, honestly

`N8-LANE` read +1 670 ms net against 650 ms. The ticket licenses deep-lane placement ("Engineer
measures"). Do:
1. **Find the unattributed ≈ 1 s** before moving anything: per-file collect/import cost of
   `src/search.pvs-lmr.test.ts` and `src/search.mate-corpus.ts` (module-level work, fixture
   construction at import, anything computed outside a test body). Report what it is.
2. Move the rows you proposed (seven-seed mate-floor guard, the PVS-identity subset, `A4`'s
   `chooseMove` row, the engine-reference row) behind `SEARCH_DEEP` **only if** each criterion keeps
   at least one default-lane row that reds its planted variant — re-run the planted-variant ledger
   for the default lane alone and report it.
3. Re-measure `N8-LANE` (null control, paired rounds) and record the load.

Do not trim a criterion's only guard to fit. If the line is still missed, report the residual —
Security/NFR rates it and the owner decides.

**Do not touch the `G6` row** — Architect/Design is ruling on it in parallel; a follow-up applies
the ruling.

## Fences
As the build. Never merge; never push. No `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`,
ADRs. Own `git worktree` under `.claude/worktrees/ABC-121-lane` (symlink `node_modules`); commit
messages via a scratchpad file and `git commit -F`. `npm test` only stopped with Ctrl-C/SIGTERM.

## Publish
An `observation` note under `ref:`, append to § Delivery, a trace row. Queue pending → claimed →
done per Workflow 17. Report: the unattributed cost found, rows moved, default-lane variant ledger,
`N8-LANE` with load, gates, sha, numstat.
