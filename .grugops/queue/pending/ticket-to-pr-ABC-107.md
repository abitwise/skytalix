---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-107
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
ref: .grugops/context/ticket-to-pr-ABC-107/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T16:00:00Z
branch: grugops/ABC-107-overflow-bound
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-107` — the overflow bound, pinned (EPIC-002, XS, P2, DoR 10/10)

Pulled `Ready` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
first — it was re-shaped on 2026-09-19 by `ADR-0022` (option 4: a documented, tested bound; `A1`
replaced by `A1'`). Read `ADR-0022`, its `observation` note at
`.grugops/context/ruling-abc107-overflow/notes/` (the fit script and fixtures are there — reuse
them), `AGENTS.md`'s 12 rules, `src/frame.ts`, `src/move-input.ts`, `src/render.ts`.

## Shape
- **Zero production lines expected.** One new test file pinning: hidden count 0 at six candidates,
  2 at seven, 3 at eight (the three pinned fixtures); identical row count; every candidate in each
  fixture resolves as a `move` from full-origin SAN AND coordinate form; `src/move-input.ts`
  unchanged (`0` changed lines). If a criterion turns out to need a production line, stop and say
  so — that is a re-open of `ADR-0022`, not a judgement call.
- Docblock/bound wording in `src/frame.ts` or `src/move-input.ts` ONLY if the ticket's `A2`–`A5`
  require it; otherwise none.

## Two sibling hops are live — do not collide
- `ABC-034` (rejection wording, `src/move-input.ts`/`src/san.ts`) and `ABC-079` (`src/search.ts`)
  are `In Development` on sibling branches. Do not edit `src/move-input.ts`, `src/san.ts`,
  `src/search.ts` or their existing test files. Your file is NEW.

## Gates and budget
- All four gates green at the branch tip: `npm run lint`, `npm run typecheck`, `npm run build`,
  `npx vitest run --dir src` (report files/tests/skips — baseline 40 / 1213 / 0).
- **`NFR-008` is at 14.940 s against 15 s (`ADR-0019`) — 60 ms headroom, and a NEW FILE costs
  ~370 ms of per-file floor.** Measure whole-lane CPU before/after (`/usr/bin/time -p`, ≥ 3 runs,
  median, load average noted) and your `N8-LANE` charge. **If the lane crosses 15 s, do not trim
  and do not fold your rows into an existing file to dodge the floor unless the ticket permits it
  — report `ADR-0019` trigger (a) and hand up.** Say which it was.
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` bars, `MESSAGE_ROWS`, the
  frame's row count.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad
  file and `git commit -F`.

## Publish
Typed notes per Workflow 16 into `ref:` (`claim` for gate results with raw numbers; no `finding`),
trace row appended, ticket page § Delivery. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-107`, move this file in, then out to `done/`.
Report: branch, sha, `git diff --numstat`, gate numbers, N8-LANE ms, lane CPU before/after.
