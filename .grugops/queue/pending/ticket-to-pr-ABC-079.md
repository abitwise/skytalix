---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-079
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-079-quiescence-search-on-captures.md
ref: .grugops/context/ticket-to-pr-ABC-079/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T14:00:00Z
branch: grugops/ABC-079-quiescence
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-079` — quiescence search on captures (EPIC-004, S, P0, DoR 10/10)

Pulled `Backlog` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
first — DoR re-scored 10/10 on 2026-08-18 (`ABC-076` evaluation and `ABC-077` negamax both merged;
the ≥ 20-position tactical corpus is THIS ticket's to build, `ABC-084` extends it). Then read
`AGENTS.md`'s 12 rules and lane conventions (`SEARCH_DEEP`, `ENGINE_DEEP`), `src/search.ts`,
`src/evaluate.ts`, `src/engine.ts`, `src/moves.ts` (capture generation), and their tests.

## Ruled since the page was written — honour it
- **`ADR-0020` (2026-09-19):** the Zobrist ep component now keys on `epSquare !== NO_SQUARE`, and
  the incremental key rides the search's per-ply array — but that is `ABC-075`'s to BUILD and
  `ABC-081`'s to consume. **Do not touch `src/zobrist.ts` and do not add a key array here.**
- `ADR-0002` clause 3 (per-ply arrays) and the `EngineSeam` (`ABC-078`) are the shape you extend.

## Gates and budget
- All four gates green at the branch tip: `npm run lint`, `npm run typecheck`, `npm run build`,
  `npx vitest run --dir src` (contained lane; report files/tests/skips — baseline 40 / 1213 / 0).
- **`NFR-008` is at 14.940 s against a 15 s level (`ADR-0019`) — 60 ms headroom.** Search tests
  are the lane's heaviest; put depth/corpus runs behind `SEARCH_DEEP` per the ticket and keep the
  default-lane rows to the criteria. Measure your `N8-LANE` charge (≤ 650 ms) and the whole-lane
  CPU before/after (`/usr/bin/time -p`, ≥ 3 runs, median). **If the lane crosses 15 s, do not trim
  assertions and do not move existing files — report it as `ADR-0019` trigger (a) and hand up.**
- `NFR-004`'s move-time bars still bind: the engine at `DEFAULT_BUDGET_MS` must not exceed them
  with quiescence on. Measure and report.
- `self_fix_attempts` = 2, then stop and hand to a human.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` bars, `src/zobrist.ts`,
  `src/turn-loop.ts`, `src/cli.ts`.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad
  file and `git commit -F` (the PreToolUse hook refuses heredocs and `$(...)`).

## Publish
Typed notes per Workflow 16 into `ref:` (`claim` for gate results with raw numbers — no `finding`
is admissible), trace row appended, ticket page § Delivery section. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-079`, move this file in, then out to `done/` when
finished. Report: branch, sha, `git diff --numstat`, gate numbers, N8-LANE ms, lane CPU
before/after, NFR-004 timing.
