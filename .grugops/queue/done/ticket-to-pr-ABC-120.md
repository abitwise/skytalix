---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-120
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
ref: .grugops/context/ticket-to-pr-ABC-120/
enqueued_by: orchestrator
enqueued_at: 2026-09-19T19:00:00Z
branch: grugops/ABC-120-turn-loop-arms
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-120` — the turn loop gains `quit` and `take-back` arms (EPIC-006, S, P1, DoR 10/10)

Pulled `Ready` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
(`A1`–`A10`; `A9` bounds production lines at ≤ 30 — over it, STOP and report, do not squeeze),
`ADR-0021` (the arm shapes, transitions 17/18, clause 9's required rows, clause 10's must-not-change
list), Architect/Design's `observation` note at `.grugops/context/ruling-abc046-quit-arm/notes/`
(the out-of-tree prototype and the 4-row throwaway test — reuse its shape), `AGENTS.md`'s 12 rules,
`src/turn-loop.ts`, `src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts`, `src/history.ts`
(`takeBack`).

## Scope — exactly two files
- `src/turn-loop.ts`: `PromptOutcome` gains `{ kind: "quit" }` and
  `{ kind: "take-back"; plies: number; messages: readonly string[] }`; `export const QUIT_NOTICE
  = "quit"`; transition 17 (`awaiting-human` → `exiting`: write `QUIT_NOTICE\n`, no frame,
  `{ result: null, reason: null, exitCode: 0 }`); transition 18 (`awaiting-human` →
  `evaluating-terminal`: `takeBack(history, plies)`, fall through to the ONE derive, render
  carrying `messages`); three docblocks re-worded (`A10`). `LoopOutcome`, `TerminalReason` (ten),
  `INPUT_ENDED_NOTICE`, `exitCode: 0`'s type UNCHANGED.
- `src/turn-loop.test.ts`: the rows `A1`–`A8` name; `A6`'s no-re-evaluation mutant WATCHED RED
  on the take-back rows and green on `quit` — record the raw output. The 18 scripted rows and
  their frame counts byte-identical.
- **Nothing else under `src/`.** Not `COMMAND_TABLE`, not `command-input.*`, not `line-input.*`,
  not `cli.ts` — those are `ABC-045`/`046`/`102`. No existing test reds on the arms (measured);
  the criteria are the guard.

## Gates and budget
- Four gates green at the tip: `npx biome check .`, `npx tsc --noEmit` (build is the same
  command), `npx vitest run --dir src` — report files/tests/skips; base is **42 / 1291 / 0** at
  the wave branch (ABC-107 + ABC-034 merged). `test-skip-integrity` → `No findings.`
- `N8-LANE` ≤ 650 ms, 0 new files, measured-then-clause-state form. Whole-lane CPU before/after
  (`/usr/bin/time -p`, ≥ 3 runs, median, load noted) — two sibling hops are live; a > 15 s reading
  under load is REPORTED as non-conforming, not ruled, and nothing is trimmed.
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `src/turn-loop.nfr.test.ts`
  (clause 10), `src/search.ts`/`src/engine.ts` (`ABC-079` live), `src/move-input.ts`/`src/rejection.ts`
  (`ABC-034` in review).
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED scratchpad
  file and `git commit -F`; gates through a node script (hook refuses `$?`, `npm run`, heredocs).

## Publish
Typed notes per Workflow 16 into `ref:` (`claim` for gates with raw numbers, `observation` for the
watched-red mutant; no `finding`), trace row, ticket § Delivery. Claim by hand per Workflow 17:
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-120`, move this file in, then out to `done/`.
Report: branch, sha, `git diff --numstat` (exactly two `src/` files), production line count vs
`A9`'s 30, gate numbers, N8-LANE ms, lane CPU before/after.
