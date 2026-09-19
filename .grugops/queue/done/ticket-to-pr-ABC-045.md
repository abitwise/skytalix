---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-045
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-045-resign.md
ref: .grugops/context/ticket-to-pr-ABC-045/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T01:00:00Z
branch: grugops/ABC-045-resign
base: grugops/wave-2026-09-19
---

# Subtask: implement `ABC-045` — `resign` (EPIC-006, XS, P1, DoR 10/10 by the record)

Pulled `Backlog` → `In Development` by the Orchestrator 2026-09-19. Read the ticket page in full
first; its three ⚠️ orderings (`ABC-035`, `ABC-037`, `ABC-043`) are all Done, and Architect/Design
re-checked it at `ADR-0021` as **independent of the arm ticket** — `resign` uses the EXISTING
`game-over` arm with a result; it is NOT `quit` (`ADR-0021`: `quit` ≠ resign, shape (c) rejected,
owner's word *"resign should be separate"*). Then `AGENTS.md`'s 12 rules, `src/command-input.ts`
(`COMMAND_TABLE`), `src/command-input.test.ts`, `src/turn-loop.ts` (as merged by `ABC-120` —
`PromptOutcome` now has nine members; `resign` does NOT add a tenth), `src/result-screen.ts`,
`src/gameend.ts` (`TerminalReason` — the ticket says which existing reason `resign` maps to; if
none fits, STOP and report rather than adding an eleventh value — `A14`'s ten are pinned).

## Shape
- `COMMAND_TABLE` gains `resign`; the dispatcher produces the existing `game-over`-shaped outcome
  with the resigning side's loss; result screen renders it through the existing rows. 0 new test
  files per the ticket; rows in `src/command-input.test.ts` and wherever the ticket names.
- `src/turn-loop.ts` is NOT edited (the arm exists). `help`'s command list: if the ticket says
  `resign` is listed, add it; do not touch `quit`/`new`/`undo` wording (`ABC-046`/`102`).

## Gates and budget
- Four gates green at the tip: `npx biome check .`, `npx tsc --noEmit`, `npx vitest run --dir
  src` — base **42 / 1297 / 0** at the wave branch. `test-skip-integrity` → `No findings.`
- `N8-LANE` ≤ 650 ms measured-then-clause-state; whole-lane CPU before/after (`/usr/bin/time -p`,
  ≥ 3 runs, load noted) — > 15 s under load is REPORTED non-conforming, nothing trimmed.
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `src/turn-loop.*`,
  `src/zobrist.*` (`ABC-075` live), `src/search.*`/`src/quiescence.*`/`src/engine.*` (`ABC-079`
  re-hop live, branch unmerged), `src/move-input.*`/`src/rejection.*`.
- `ABC-046` and `ABC-102` come AFTER you on `COMMAND_TABLE` — leave it in a state they extend.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED
  scratchpad file and `git commit -F`; gates through a node script.

## Publish
Notes into `ref:` (`claim` for gates with raw numbers; no `finding`), trace row, ticket §
Delivery. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-045`,
move this file in, then out to `done/`. Report: branch, sha, numstat, gate numbers, N8-LANE ms,
lane CPU before/after, which `TerminalReason` `resign` maps to, and any interpretation.
