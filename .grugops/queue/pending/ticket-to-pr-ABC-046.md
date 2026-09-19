---
task: wave-2026-09-19
subtask: ticket-to-pr-ABC-046
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-046-quit-and-new.md
ref: .grugops/context/ticket-to-pr-ABC-046/
enqueued_by: orchestrator
enqueued_at: 2026-09-20T04:00:00Z
branch: grugops/ABC-046-quit-and-new
base: grugops/wave-2026-09-19 (ABC-120 arms + ABC-045 resign merged; lane 42 / 1317 / 0)
---

# Subtask: implement `ABC-046` — `quit` (with confirmation) and `new` (EPIC-006, S, P2)

Pulled `Backlog` → `In Development` by the Orchestrator 2026-09-19. Its one remaining DoR fact —
the arm ticket `ABC-120` landing — is met (merged on the wave branch, QE PASS). Read the ticket
page in full INCLUDING § "Ruling applied — 2026-09-19" (`A3` stands as written; `A8` amended by
one clause licensing one call-site line in `src/line-input.ts`), `ADR-0021` clauses 4–7 (the
confirmation is a PER-SESSION FLAG in the command layer — seam-side, not a loop state: first
`quit` → the existing transition 9 with a confirmation message, second consecutive `quit` →
`{ kind: "quit" }`; `new` = take-back of `moves.length` plies via `{ kind: "take-back" }`),
`ABC-120`'s delivered `src/turn-loop.ts` (`QUIT_NOTICE`, the two arms), `ABC-045`'s delivered
`src/command-input.ts` (`COMMAND_TABLE` as it now stands — extend it), `src/line-input.ts`,
`src/command-input.test.ts`, `src/cli.test.ts` (the `CHILDREN` pattern; `ABC-035 A4`'s
four-token half will legitimately change — that is the `ABC-112` cancel trigger, authorised on
the page).

## Shape
- `COMMAND_TABLE` gains `quit` and `new`. `resolvePromptLine` for `quit`: first time → `command`
  outcome with a confirmation message and the flag set; second consecutive → `{ kind: "quit" }`;
  any other line in between clears the flag. `new` → `{ kind: "take-back", plies: moves.length,
  messages: [...] }`. `resign`, `help`, `moves`, board — untouched in behaviour.
- `src/turn-loop.ts` is NOT edited (arms exist). `src/line-input.ts`: at most the one call-site
  line `A8` licenses; keep `resolvePromptLine` pure and exported.
- `help` lists `quit` and `new` (the promise `ABC-112` was about becomes TRUE here — say so).
- 0 new test files per the ticket; rows in `command-input.test.ts` and one or two `cli.test.ts`
  children (spawn pin moves by the count you add, reason written).

## Gates and budget
- Four gates green at the tip: `npx biome check .`, `npx tsc --noEmit`, `npx vitest run --dir
  src` — base 42 / 1317 / 0. `test-skip-integrity` → `No findings.`
- `N8-LANE` ≤ 650 ms measured-then-clause-state; whole-lane CPU before/after (`/usr/bin/time -p`,
  ≥ 3 runs, load noted) — > 15 s under load is REPORTED non-conforming, nothing trimmed.
- `self_fix_attempts` = 2, then stop.

## Fences
- Do not touch `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `src/turn-loop.*`,
  `src/zobrist.*`, `src/search.*`/`src/quiescence.*`/`src/engine.*` (`ABC-079` re-hop live),
  `src/move-input.*`/`src/rejection.*`. `ABC-102` (`undo`) comes AFTER you on the table.
- Do not merge, do not deploy. Own `git worktree`; commit messages via a UNIQUELY-NAMED
  scratchpad file and `git commit -F`; gates through a node script.

## Publish
Notes into `ref:` (`claim` for gates with raw numbers; no `finding`), trace row, ticket § Delivery.
Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-046`, move this
file in, then out to `done/`. Report: branch, sha, numstat, gate numbers, N8-LANE ms, lane CPU
before/after, which `ABC-035 A4` rows changed and why, and any interpretation.
