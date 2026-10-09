---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-086
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
ref: .grugops/context/ticket-to-pr-ABC-086/
source_refs: .grugops/context/fold-abc086-adr0027/  .grugops/context/ruling-abc086-seed/  .grugops/context/rescore-abc086/
adr_refs: memory-bank/50-decisions/ADR-0027-deterministic-mode-is-the-shipped-engine-on-a-virtual-clock-and-the-seed-does-not-reach-move-selection.md (accepted)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T19:24:51Z
branch: grugops/ABC-086-virtual-clock
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-086` — deterministic mode on a virtual clock

DoR 10/10, 0 ⚠️ (BA/PM `28d4e5b`), XS. The ticket page is the contract (`A1`, `A2`, `A4`–`A7`;
`A3` moved to `ABC-087`). `ADR-0027`: a small production virtual-clock module outside
`src/engine.ts`; deterministic mode is `createEngine({ budgetMs, now: <virtual clock> })`; no new
`EngineOptions` field, no new export from `src/engine.ts` (only the `Clock` comment at
`:107-112` loses "real-time"); `src/cli.ts` must not import the module.

## Stop conditions (hand up, do not trim or widen)
- Any change to `src/engine.ts` beyond comment lines, or to `src/search.ts`.
- `A1` not 300/300 on the merged tree.
- `N8-LANE` over its line: measure and report, do not trim tests.

## Fences
Never merge; never push. Do not touch `plans/board.md`, `AGENTS.md` (if the `ENGINE_DEEP` lane
line needs a new entry, say so in your report — the Scribe adds it), `plans/nfr-catalog.md`, ADRs.
Own `git worktree` under `.claude/worktrees/` (symlink `node_modules`). Commit messages via a
scratchpad file and `git commit -F`. Real UTC stamps (`date -u`). `ABC-082` (evaluation) is
built but not merged — do not depend on its branch.

## Publish
`decision` + `observation` + `claim` notes under `ref:`, a trace row, a ticket § Delivery. Queue
pending → claimed → done per Workflow 17. Report: gates (lint / typecheck / build / files / passed
/ skips), `ENGINE_DEEP` result, `N8-LANE` reading, `src/` numstat, branch + sha.
