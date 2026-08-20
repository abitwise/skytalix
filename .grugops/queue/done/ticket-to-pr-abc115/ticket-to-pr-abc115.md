---
task: ticket-to-pr-ABC-115-2026-08-20
subtask: ticket-to-pr-abc115
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md
ref: .grugops/context/ticket-to-pr-ABC-115-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T23:59:00Z
branch: grugops/abc115-piped-session-exits-clean
base: grugops/abc115-amend @ badf6c3
---

# Subtask: BUILD `ABC-115` — the piped session ends quietly at exit `0`

**PULLED BY THE ORCHESTRATOR at task `ticket-to-pr-ABC-115-2026-08-20`.** DoR re-read against the
built page and verified **10/10** — item 4 testable, item 6 with measurable targets, item 10 closed
by `ADR-0016`. Size `S`, priority `P1`. `In Development` 0/3 → 1/3, inside the WIP limit.

**Branch off `grugops/abc115-amend` @ `badf6c3`, NOT `main`.** FOUR branches are stacked unmerged —
`cut-epipe-regression` → `abc115-design` → `abc115-amend` → yours — because merging is the human's.

## Read first (nothing in this brief is evidence; re-derive)
- The `ABC-115` page **in full** — `A1`–`A9`, `## Design ruling`, `## Amendment`, `Scope`,
  `Out of scope`, `Test notes`.
- `memory-bank/50-decisions/ADR-0016-…` — the ruled shape is BINDING; do not re-litigate exit `0`.
- `.grugops/context/design-ABC-115-2026-08-20/notes/` and `.grugops/context/amend-ABC-115-2026-08-20/notes/`
  — **including both `failed-attempt` notes. Do not re-run a recorded failed attempt.**
- `AGENTS.md` — the 12 coding rules, the exit-code contract, the test-integrity posture.

## Build it
The design names the seam: the stdout **handle** is owned where it is acquired (`src/cli.ts`), the
error arm is installed before the handle is passed on, EPIPE is silent, **every other code is
re-thrown**, and the session ENDS (primary `process.stdin.destroy()`, fallback `process.exit(0)`
only on a measurement that the primary fails). Roughly ≤ 5 production lines in ONE file.

**The wrong fix passes `A1` and `A2` and was measured doing so** — a bare swallow leaves the session
running blind into a dead pipe. `A9` exists to red against exactly that. **Write `A9` so you have
watched it go red against a bare-swallow mutant, not only against `main`** — the page carries that
instruction because `main` crashes fast and therefore *does* end. Watching only `main` is not
watching `A9` red.

## The two things the page flags as UNKNOWN and hands you
1. **`A9` has never been run inside vitest** — only as shell commands. Whether `spawnSync`'s timeout
   kill reports cleanly through the existing `childOf` helper is your FIRST check. If it does not,
   say so and solve it in the open; do not quietly weaken the criterion to fit the harness.
2. **`A4`'s throwing-`InputSeam` half and lint/typecheck of the delivered literal** were never run.

## Cost fences, pre-registered on the page — report against them, do not silently exceed
- `N8-SPAWN` **≤ 6 children AND ≤ 2.0 s wall AND ≤ 0.5 s CPU** (pin 17 → 23). If you exceed any
  clause, STOP and report — do not absorb it.
- `src/cli.test.ts:1480-1485` pins the `spawnSync` call-site count: **use the existing `childOf`
  helper, add zero new call sites.**
- The detached `sleep` in `A9`'s instrument is a bounded orphan — keep it bounded.

## Fences
- **One production file.** Do not touch `frame.ts`, `turn-loop.ts`, `line-input.ts`, `AGENTS.md`,
  `ADR-0016`, `plans/nfr-catalog.md`, or any other ticket.
- **No global `uncaughtException` handler, no blanket `exitCode = 0`, no muted stderr** — `A4`
  forbids all three and requires `70` + the internal-error line for a throwing `InputSeam` and `1` +
  the usage line for a refused command line to STILL work in the delivered build.
- Run the mandatory gates — `lint`, `typecheck`, `unit`, `build` — and report the numbers you
  measured, not numbers you quote. `self_fix_attempts` is 2; after that, stop and report.
- **Do not merge, do not deploy, do not move the board past `In Review`.**
- Report your lane cost; **do not grade it** — `NFR-008` is BREACHED and `ABC-108`/`ABC-110` are open.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible — `human_admission` is `off`). Append your `plans/traceability.md` row
with the code and test evidence. **Transcribe the board move recorded above** (`Ready for Dev` →
`In Development`, attributed to me and this task id) and, on a green build, your own
`In Development` → `In Review`. Claim by hand per Workflow 17: bare
`mkdir .grugops/queue/claimed/ticket-to-pr-abc115`, move this file in, then out to `done/`. Work in
your own `git worktree`. Commit on `grugops/abc115-piped-session-exits-clean`, never on `main`.
