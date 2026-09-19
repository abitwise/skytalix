---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-034
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-034-rejections-that-teach.md
ref: .grugops/context/ticket-to-pr-ABC-034/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T14:00:00Z
branch: grugops/ABC-034-rejections-that-teach
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-034` — rejections that teach (EPIC-003, M, P0, DoR 10/10)

Pulled `Backlog` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
first — its DoR was re-scored 10/10 on 2026-08-18 against `ABC-032`'s merge (`SanRejectReason`
exported at `src/san.ts:183`). Then read `AGENTS.md`'s 12 rules and lane conventions,
`src/move-input.ts`, `src/san.ts`, `src/coordinate-move.ts`, `src/command-input.ts`, and the
merged tests beside them.

## Two things ruled since the page was written — honour them
- **`ADR-0022` (2026-09-19):** a 7+ candidate ambiguity is a DOCUMENTED BOUND; the `(+N more)`
  marker stays and `markerFor`'s bound is pinned by `ABC-107` (`Ready`, XS). Do NOT widen the marker
  with "how to disambiguate" wording — `ABC-107`'s `A5` pins it. Flag if a criterion here conflicts.
- **`ADR-0021` (2026-09-19):** `quit`/`new`/`undo` get real loop arms under a separate arm ticket.
  Do not touch `src/turn-loop.ts`; do not add command tokens to `COMMAND_TABLE`.

## Gates and budget
- All four gates green at the branch tip: `npm run lint`, `npm run typecheck`, `npm run build`,
  `npx vitest run --dir src` (contained lane; report files/tests/skips — baseline 40 / 1213 / 0).
- **`NFR-008` is at 14.940 s against a 15 s level (`ADR-0019`) — 60 ms headroom.** Measure your
  `N8-LANE` charge (the ticket's ≤ 650 ms line) and the whole-lane CPU (user+sys) before/after,
  `/usr/bin/time -p`, ≥ 3 runs, median. **If the lane crosses 15 s, do not trim assertions and do
  not move files to an opt-in lane — report it as `ADR-0019` trigger (a) and hand up.** QE's
  `OPT-1` is the pre-sized remedy and it is the owner's call.
- `self_fix_attempts` = 2, then stop and hand to a human.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` bars.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad
  file and `git commit -F` (the PreToolUse hook refuses heredocs and `$(...)`).

## Publish
Typed notes per Workflow 16 into `ref:` (`claim` for gate results with the raw numbers — no
`finding` is admissible, `human_admission` is `off`), trace row appended, ticket page § Delivery
section. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-034`, move
this file in, then out to `done/` when finished. Report: branch, sha, `git diff --numstat`, gate
numbers, N8-LANE ms, lane CPU before/after.
