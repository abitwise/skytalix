---
task: design-ABC-115-2026-08-20
subtask: design-abc115-exit-code
role: architect-design
workflow: agent-factory/workflows/03-epic-to-tickets.md (design hop; ADR per role page)
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/design-ABC-115-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T22:00:00Z
branch: grugops/abc115-design
base: grugops/cut-epipe-regression @ c9e7e11
---

# Subtask: rule the exit code `ABC-115` rests on, and settle the seam — `In Design`, not `In Development`

**`ABC-115` is NOT on `main`.** It lives only on `grugops/cut-epipe-regression` @ `c9e7e11`, which
is unmerged because merging is the human's, never an agent's. **Branch off that branch, not `main`.**

BA/PM cut the ticket and ruled its exit code `0` — and marked that ruling **reversible and yours**,
because the alternative it rejected (`141`/SIGPIPE, a FOURTH exit code) would amend `AGENTS.md` and
`src/cli.ts`'s own docblock, which is a structure change BA/PM correctly refused to make. That
single open item is the ticket's only ⚠️ (DoR 9/10, item 10). **This hop exists to close it.**

## Read first (re-derive; nothing in this brief is evidence)
- The `ABC-115` page **in full**, especially `A2` — written in two halves so an overrule changes one
  literal — and `A4`, which fences the cheap wrong fixes.
- `.grugops/context/cut-epipe-regression-2026-08-20/notes/` — BA/PM's `decision` and three
  `observation`s. **All unstamped** (`human_admission` is `off`): claims to re-measure, not facts.
- `AGENTS.md` — the exit-code contract, and its size cap (`ABC-109` is live against that file).
- `src/cli.ts` (the `USAGE_EXIT_CODE` site and the docblock at ~109-115), `src/turn-loop.ts`,
  `src/frame.ts`.
- `memory-bank/50-decisions/` — house ADR form; `ADR-0015` is the latest id in the tree.

## What you must settle
1. **The exit code.** Confirm `0` or overrule it. If you overrule to `141`/SIGPIPE or `70`, say what
   ELSE must change — `AGENTS.md`, the `src/cli.ts` docblock, any test that pins the code set — and
   whether that is in `ABC-115`'s size or is a second ticket.
2. **Where the fix belongs** — the seam. `frame.ts` writing, `turn-loop.ts` looping, `cli.ts`
   holding the top-level handler: name the module that owns a closed stdout, so the engineer is not
   choosing architecture inside a fix. `A4` forbids a global `uncaughtException` swallow; make the
   permitted shape explicit rather than leaving only prohibitions.
3. **Whether an ADR is owed.** If the ruling changes what the product guarantees, write it as
   `ADR-0016` in `memory-bank/50-decisions/`, house form, and link it from the ticket. If it does
   not, **say so and write none** — a needless ADR is its own cost.

## Fences
- **Do not touch `src/`.** Design, not implementation. The engineer builds this next.
- Do not re-score the ticket's size or priority — `S`/`P1` is BA/PM's.
- Do not touch `AGENTS.md` in this hop even if your ruling implies an edit; **name the edit owed**
  and who owns it. `ABC-109` is live against that file and under a byte cap.
- Do not merge, do not deploy, do not move `ABC-115` past `Ready for Dev`.
- If the honest answer is that `0` is right and this needed no design hop, **say that plainly.**

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible from you). Append your `plans/traceability.md` row with any ADR id and
NFR ids touched. You own the `In Design` exit — record the board move you make in your notes.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/design-abc115-exit-code`, move
this file in, then out to `done/`. Work in your own `git worktree`. Commit on
`grugops/abc115-design`, never on `main` and never on the cut branch.
