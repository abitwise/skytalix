---
subtask: bapm-cut-engine-strength
role: ba-pm
ticket: memory-bank/analysis/2026-10-23-game-1.md
ref: .grugops/context/bapm-cut-engine-strength/
width: 2 (records only; beside ticket-to-pr-ABC-203)
---

# Cut an engine-strength epic and its ordered tickets from the 8 accepted proposals

## Do
- The owner accepted all 8 improvement proposals (`…7feb0553`) of the Architect's game-1 analysis (`…f1771bb3`). Write a new epic (next free EPIC id) — goal: skytalix plays measurably stronger at the same levels/time budgets; success measured by the rating harness, not one game. No Elo target unless the owner gives one: propose one as an owner question, don't set it.
- Cut one ticket per proposal (split if XL), ordered: (a) the rating harness first, so every later change is measured — outside `npm test`, NFR-008 untouched, Stockfish `UCI_LimitStrength` + cutechess-cli at the pinned host paths; (b) king safety with queens on + tapered king table; then the rest in the analysis's rank order. For each: the measurable criterion (harness Elo delta with its error bar, plus the existing regression gates the analysis names: `PUZZLE_DEEP`, A5 eval cost bar, NFR-004/005/009, identity sweeps), size, priority, DoR.
- **ADR touch points:** where a ticket needs a new or changed ADR (null move: new ADR + ADR-0026 door; TT across moves: ADR-0025 D4; checks in quiescence: reverses `src/quiescence.ts:21-24`'s decision; king safety: ADR-0031 addendum), say so on the page. The owner accepted the proposals; each ADR text still goes to him when written — mark these tickets so the Orchestrator routes the ADR to him.
- Any ticket that would move an NFR bound: flag it; that stays the owner's.
- Pages land in Backlog/Ready per DoR; the Orchestrator pulls.

## Fences
- Work on `grugops/bapm-cut-engine-strength` (worktree `../wt-bapm-cut-engine-strength` from `main`). Only the new epic page, new ticket pages and your notes. No `src/`, ADRs, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, ABC-203's page. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-eng/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-engine-strength`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (board card lines for the epic and every ticket) plus 10-cell trace rows into this brief in main's queue, then move it and its `claim.md` to `done/`.
