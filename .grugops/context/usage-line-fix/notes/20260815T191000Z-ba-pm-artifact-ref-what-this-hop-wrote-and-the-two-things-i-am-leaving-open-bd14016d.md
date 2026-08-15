---
id: 20260815T191000Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-two-things-i-am-leaving-open-bd14016d
kind: artifact-ref
by: ba-pm
at: 2026-08-15T19:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - plans/board.md
  - plans/traceability.md
  - 20260815T190000Z-ba-pm-observation-the-usage-line-reproduced-by-my-own-hand-and-the-six-commands-it-should-have-printed-1163c4fe
  - 20260815T190500Z-ba-pm-decision-a-separate-ticket-not-an-amendment-and-the-guard-is-required-not-optional-d76446e8
supersedes: 
---

# What this hop wrote, what it verified about its own writes, and the two things I am leaving open

## Artifacts

| path | what it is |
|---|---|
| `plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md` | the ticket — `S`, `P1`, `Backlog`, **DoR 10/10 MET**, 223 lines (rule 2 budget is 300; the last ten cut tickets' median is 170) |
| `plans/board.md` | **one row**, ONE LINE, appended in `Backlog` after `ABC-065`. **The `_Updated:` header was NOT replaced** — it is the Orchestrator's, it needs the archive step first, and the previous cut hop of this exact shape left it alone for the same reason |
| `plans/traceability.md` | **one row appended.** No `_Updated:` line added, matching the previous cut hop (`6c77471`), which appended five rows and no header |

**Exactly three files changed. Zero under `src/`, zero under `memory-bank/`, zero under any
`.grugops/context/uat-ABC-042-*/`, and `plans/metrics.md` was not opened.**

## The write-back assertion, run FROM DISK after writing

`plans/traceability.md` re-read and split escape-aware per the file's own rule at `:152-156`:

- rows matching `^| ABC-066 `: **1**
- columns in that row: **10 of 10** (`Ticket`, `Title`, `Epic`, `Feature`, `NFRs`, `Code`, `Tests`,
  `UAT`, `Release`, `Status`), matching the header's 10
- raw `|` inside any cell: **0**. Escaped `\|` inside any cell: **0** — none was needed, because
  `--colour white/black/random` is written with slashes in the table and the pipe form is kept to the
  ticket page where it is not a cell delimiter
- `UAT` and `Release` cells: **empty**, as they must be for a `Backlog` ticket
- whole-table re-check: **62 id rows, 0 of them not 10 columns**

The board row was re-read from disk as well: **1** occurrence, **one line**, 970 characters, and the
`Backlog` list still parses as 38 single-line rows.

## Two things I am leaving open, named so they are not lost

1. **`ABC-065`'s blocker is still live, and it is not mine to clear.**
   `.grugops/queue/claimed/agents-md-owner-grants/` is still present in the main worktree's queue,
   though the `AGENTS.md` content that subtask was cutting for appears to be on `main` already. **A
   stale claim and a live claim look identical from here**, and draining another hop's queue record
   is not BA/PM's. Routed to the Orchestrator: if it is drained, `ABC-065` re-scores to **10/10** and
   the two tickets can be pulled together — which is what I recommend, because until both land there
   is no correct spelling of the separator anywhere a user or a reader can reach.
2. **Whether npm forwards post-`--` tokens on every supported npm major is `UNKNOWN - verify`.**
   Measured true on npm 11.7.0; no npm floor is declared in the manifest. No criterion asserts it —
   writing one would have been fabrication. Same family as the untested Node 22 floor QE recorded.

## What is deliberately NOT here

- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off` on this
  install; `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent, so no `§14-gate#<id>`
  verdict can exist. These three notes are hand-authored per
  `agent-factory/contracts/context-note.md`, as `AGENTS.md` § Role / workflow files instructs.
- **No work.** No line under `src/`, no test written or edited, no `AGENTS.md` byte. The fix is cut,
  not made.
- **No move of `ABC-042`,** no edit to its page, no re-opened criterion. It is accepted and `Done`.
- **Nothing in `Ready`.** It stays **0 of 8**; new work lands in `Backlog` and the Orchestrator pulls.
