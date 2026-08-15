---
task: ticket-to-pr-ABC-066
subtask: ticket-to-pr-ABC-066
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-066/
parent_ref: .grugops/context/pull-abc065-066-2026-08-16/
ticket: plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T22:18:00Z
branch: grugops/ticket-to-pr-ABC-066
base: main @ 3fb6ebd
---

# Subtask: `ABC-066` — the usage line prints a command the user can actually run

**Read the ticket page first, then `parent_ref:` — one note, three gaps found at the `Ready for Dev`
exit.** Nothing from either is restated here. The whole ticket is yours; it is one production line
and one guard block.

## The one thing the ticket page gets wrong, and you must not follow

Test note 3 says *"if `ABC-062` has merged, its extraction helper exists; use it."* **`ABC-062` has
NOT merged** — it is not in `Done` and not on the board. **You write the first stderr→usage-line
extraction helper**, and you write it to be reused: `ABC-065`'s guard block lands in the same file
right after you and its instruction is to reuse yours rather than write a second. That is `G3` in the
parent note.

## Hard limits

- **`src/cli.ts` + `src/cli.test.ts`, two paths, nothing else.** Not `AGENTS.md` (zero bytes — that
  is `ABC-065`'s half and it is running RIGHT NOW in parallel on its own branch), not
  `src/cli-options.ts` (read, never edited — no token enters or leaves `ACCEPTED_ARGUMENTS`), not the
  ticket page, not `plans/board.md` or `plans/traceability.md` (the Orchestrator's).
- **Exactly 1 production line changed.** `git diff --numstat -- src/cli.ts` reads `1 1`, comments
  aside. `src/cli.ts:53` is the `USAGE` constant — verified present at that line on `main` @ `3fb6ebd`.
- **No eleventh child.** `spawned` is pinned at **10** (`src/cli.test.ts:780`); reuse the refusal
  children already captured at module scope. An added spawn is the wrong implementation — stop and
  say so.
- **Do not export `USAGE`** — `src/cli.ts` exports nothing (`ABC-042` `A2`, `ADR-0011` clause 4).
  Read the line from a captured child's **stderr**, where a human reads it.
- **No `npx`, no binary name, no `node src/cli.ts` as the advertised form.** Distribution is
  undecided (`ADR-0007` clause 5). A third spelling of the entry route is a defect, not a fix.
- **Write `A4`'s mutant FIRST and watch it RED.** The mutant is `main`'s current line — a guard that
  passes without having been seen to fail on the delivered string has been argued, not tested.
- **Assert the FORM, never the sentence.** And run every form you print before you print it.
- Run the mandatory gates (`lint`, `typecheck`, `unit`, `build`) plus the test-integrity step and
  record the numbers. `self_fix_attempts` **2**. Report your `N8-LANE` delta (≤ 650 ms, at 0.23×
  today — this ticket must not move it).
- Do not merge, do not push, do not deploy. Commit on your branch.

## Stop conditions

- A chosen wording would require a merged `ABC-042` row to move → **stop and route.** Re-opening a
  merged criterion's instrument is the Orchestrator's ruling, not yours.
- The criterion cannot be implemented without a second spawn, or without exporting `USAGE` → **stop
  and say so.**
- A criterion needs re-wording → **stop and route to BA/PM.**

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-066/`, and write `claim.md` inside it.

Report: the terminal gate result with every number; the mutant rebuilt and whether it redded in BOTH
directions; the six advertised invocations and how each resolved; `git diff --name-only` and
`--numstat` for the delivered commit; the `spawned` count; your lane delta; the name and location of
the extraction helper you wrote, so `ABC-065`'s hop can find it; and every gap with severity and owner.
