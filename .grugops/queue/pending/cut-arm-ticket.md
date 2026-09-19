---
task: wave-2026-09-19
subtask: cut-arm-ticket
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md (cut ONE ticket from a ruling)
ticket: NEW — next free id (read plans/tickets/ and plans/board.md; last known ABC-117)
ref: .grugops/context/cut-arm-ticket/
authority: memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md (clauses 8 and 9)
enqueued_by: orchestrator
enqueued_at: 2026-09-19T14:00:00Z
branch: grugops/cut-arm-ticket
base: grugops/wave-2026-09-19
---

# Subtask: cut the turn-loop "arm ticket" that `ADR-0021` clause 8 says lands FIRST

`ADR-0021` (accepted 2026-09-19 on the owner's word *"5. b, resign should be separate"*) rules that
`src/turn-loop.ts` gains two arms — `{ kind: "quit" }` (transition 17) and
`{ kind: "take-back" }` (transition 18) — and that the loop change is its own ticket, ahead of
`ABC-046` and `ABC-102`. Architect/Design measured the arms out-of-tree: 1213/1213 green, NO
existing guard reds; clause 9 lists what the ticket must ADD because nothing reds.

Read: the ADR in full; its `decision` note at `.grugops/context/ruling-abc046-quit-arm/notes/`;
`ABC-046`, `ABC-102`, `ABC-045` pages (§ "Ruling applied" sections); `src/turn-loop.ts`,
`src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts`; `memory-bank/60-progress.md` § Known UNCUT
work (row 5 retires at this cut).

## Deliver
- One ticket page `plans/tickets/ABC-1NN-<slug>.md` in the project's ticket shape (mirror
  `ABC-115`'s page for structure): scope = `src/turn-loop.ts` (+~16 lines) and
  `src/turn-loop.test.ts` rows ONLY; out of scope = `COMMAND_TABLE`, `src/command-input.*`,
  `src/line-input.*`, `src/cli.ts` (those are `ABC-045`/`046`/`102`'s); the docblock re-wordings at
  `src/turn-loop.ts:104-124`, `:155-173`, `:246-262` the ADR names; criteria that pin transitions
  17 and 18, the no-re-evaluation mutant (watched RED on take-back rows), the narrowed
  "non-mutating outcome" sentence, `A14`'s ten `TerminalReason` values UNCHANGED, `exitCode: 0`'s
  type unchanged, the 18 scripted rows and frame counts unchanged, and an `N8-LANE ≤ 650 ms` line
  with the standing "measured ms, then clause state" form. Size and priority with reasons
  (expect `S`, `P1`). DoR scored 10 rows with evidence.
- Board row text for the Orchestrator to paste (you do NOT edit `plans/board.md`).
- Trace row appended to `plans/traceability.md`.
- Update `ABC-046` § Dependencies and `ABC-102` § Dependencies to name the new id (one line each).
- `memory-bank/60-progress.md` § Known UNCUT work: retire row 5 with the id.

## Fences
- Zero files under `src/`. Do not touch `AGENTS.md` (byte cap), `plans/board.md`, `plans/nfr-catalog.md`.
- Do not re-open the ruling. If you find the ADR's arm shape unbuildable, say so in a note and stop.
- Do not merge, do not deploy. Own `git worktree`, commit on the branch above. Write commit messages
  to a UNIQUELY-NAMED scratchpad file and use `git commit -F` (the PreToolUse hook refuses heredocs
  and `$(...)`).

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible). Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/cut-arm-ticket`,
move this file in, then out to `done/` when finished.
