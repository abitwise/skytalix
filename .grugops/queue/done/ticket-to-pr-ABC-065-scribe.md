---
task: ticket-to-pr-ABC-065-scribe
subtask: ticket-to-pr-ABC-065-scribe
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-065-scribe/
parent_ref: .grugops/context/pull-abc065-066-2026-08-16/
ticket: plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T22:18:00Z
branch: grugops/ticket-to-pr-ABC-065-scribe
base: main @ 3fb6ebd
---

# Subtask: `ABC-065` half 1 — put the `--` separator into `AGENTS.md`'s `Dev / run` slot

**Read the ticket page first, then `parent_ref:` — one note, and it carries three gaps found at the
`Ready for Dev` exit that bear on you.** Nothing from either is restated here.

**This is HALF of `ABC-065`, deliberately.** The ticket is one ticket and does not split; the pen on
`AGENTS.md` is yours by this project's recorded practice, and the guard block in `src/cli.test.ts` is
an engineer's, scheduled after `ABC-066` lands. **You are not writing a test and the ticket does not
close on your hop.**

## What to do

One slot: `AGENTS.md` § Commands, the `- Dev / run:` list item and its HTML comment. Add at least one
complete invocation of the form `npm run chess -- <option>` where `<option>` is an element of
`ACCEPTED_ARGUMENTS` (`src/cli-options.ts:46-53`), plus a short comment at the site recording why the
separator is load-bearing — the package runner eats a flag written without it — so a later hop does
not tidy the example away. `A1` and `A3` of the ticket are the criteria; read them there.

## Hard limits

- **`AGENTS.md` ONLY. Zero bytes anywhere else** — not `src/`, not the ticket page, not
  `plans/board.md` or `plans/traceability.md` (those two are the Orchestrator's).
- **`src/cli.test.ts:193-204` must stay byte-identical**, which means the substring
  ``- Dev / run: `npm run chess` `` must still be present in `AGENTS.md` afterwards. **If a wording
  you want would require that literal to move, STOP and route it** — re-opening a merged criterion's
  instrument is the Orchestrator's ruling, not yours.
- **One slot.** Deployment posture, the four `UNKNOWN - verify` slots, § Process rules, § Stack:
  untouched.
- **Run the command before you record it.** `AGENTS.md` § Commands forbids a command nobody ran, and
  this ticket exists *because* an unrun command was published. Record the exit code and what it
  printed.
- Do not merge, do not push, do not deploy. Commit on your branch.

## Stop conditions

- The fix needs a production or test change → stop; that is the other half's, and `A6` fences this
  ticket at **zero production lines**.
- A criterion needs re-wording → stop and route to BA/PM. Criteria are not the implementer's.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-065-scribe/`, and write `claim.md` inside it.

Report: the exact text you added; the command you ran and its exit code; proof `src/cli.test.ts` and
everything under `src/` is untouched; and every gap with severity and owner.
