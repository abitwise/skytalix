---
task: ticket-to-pr-ABC-065-guard
subtask: ticket-to-pr-ABC-065-guard
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-065-guard/
parent_ref: .grugops/context/quality-gate-ABC-066-qe/
ticket: plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T01:50:00Z
branch: grugops/ticket-to-pr-ABC-065-scribe
base: grugops/ticket-to-pr-ABC-065-scribe @ 717e51d, with main merged in
---

# Subtask: `ABC-065` half 2 — the guard, on the branch that already carries half 1

**Read the ticket page, then `parent_ref:` (QE's five notes — `Q2` is aimed straight at you), then
the Scribe's four at `.grugops/context/ticket-to-pr-ABC-065-scribe/notes/`.** All on disk; I relay
nothing. **The Scribe already did the `AGENTS.md` half on the branch you are continuing.**

## Your branch is NOT a new branch

**Continue `grugops/ticket-to-pr-ABC-065-scribe` @ `717e51d`, and merge `main` into it first** — you
need `ABC-066`'s four helpers, which merged to `main` at `aec9911`. One ticket, one branch, one
merge at the end. **Do not branch from `main` and do not open a second branch.**

Gate green on `main` @ `aec9911` right now: lint 0, typecheck 0, **857/857 on 30 files**, build 0,
skip 0.

## The trap that would make your guard useless — read this twice

QE measured it on the delivered helpers (`Q2`, MEDIUM, handed to you by name):

- **`advertisedTextOf` returns garbage SILENTLY on an `AGENTS.md` line.** `indexOf` returns `-1` when
  the separator is absent, so it becomes `slice(16)` and yields a corrupted stem — no throw.
- **The expander's degenerate return is `[[]]`, not `[]` — and `resolveOptions([])` is `ok: true`.**
- Therefore **a guard that only checks "everything advertised resolves" goes VACUOUSLY GREEN on the
  exact defect `ABC-065` exists to catch.**

**So: assert `includes(SEPARATOR_FORM)` FIRST, and keep a count floor.** QE was explicit that it is
not the expander that saves `A2` on `ABC-066` — it is the outside-group check, the `>=6` floor and
the both-ways `ACCEPTED_ARGUMENTS` equality. You need the equivalent.

**Second trap, same note: the repaired `AGENTS.md` line ends in a backtick**, so copying `ABC-066`'s
outside-group row verbatim gives a **false RED**. Strip the fence before you parse.

**Third, from Security/NFR: `Q2`'s text says the code reads `+ 17`; the source at
`src/cli.test.ts:192` reads `+ SEPARATOR_FORM.length`.** No magic number exists — the behavioural
claim is right and the transcription is not. Read the source, not the note's quotation of it.

## My ruling on `A1` vs `A3`, which you must implement rather than re-litigate

On a literal reading the two criteria contradict: `A1` mandates the `--` separator, and `A3` then
counts it as a **fourth** `--`-prefixed token against its required three (the Scribe measured
exactly this — `G4`).

**RULED: the bare `--` separator is NOT an option token.** Your collector excludes it **explicitly,
with a comment naming this ruling** — never by a loose pattern that would also swallow a real option.
**Removing the separator from `AGENTS.md` to satisfy `A3` is FORBIDDEN**; it destroys the ticket's
purpose. The wording repair is routed to BA/PM; you implement the ruling.

**RULED on `A6`:** "exactly two paths" is scored against the **delivery** commit excluding
`.grugops/` process substrate, and across this ticket's **two hops** — the Scribe's commit carries
`AGENTS.md`, yours carries `src/cli.test.ts`. What `A6` protects still binds: **zero production
lines, zero new files, zero new spawns, `spawned` still 10.**

## Hard limits

- **`src/cli.test.ts` ONLY.** Zero production bytes. **Do not edit `AGENTS.md`** — the Scribe's half
  is already on your branch and is done.
- **REUSE `ABC-066`'s four module-scope helpers** (`SEPARATOR_FORM`, `usageLineOf`,
  `advertisedTextOf`, `invocationsAdvertisedBy`). **Do not write a second helper** and **do not edit
  `ABC-066`'s block** — it is merged, gated and QE'd. If a helper genuinely cannot serve you, say so
  and explain why rather than forking it.
- **`A5`: read, never transcribed.** Expectations derive from `ACCEPTED_ARGUMENTS` at run time; **no
  second spelling of any accepted argument** enters the file. QE ruled `SEPARATOR_FORM` is the one
  permitted literal — that ruling is yours to inherit, not to re-open.
- **`A4` is two mutants and you watch BOTH red**: `--difficulty` added to the slot → RED; `--unicode`
  deleted from the slot → RED. Both ship green today.
- **`src/cli.test.ts:193-204` stays byte-identical** (`ABC-042`'s `A1` row). Verify by blob hash.
- Run the mandatory gates plus test-integrity; record every number. `self_fix_attempts` **2**.
- **Do not merge, push or deploy. Do not write `plans/board.md` or `plans/traceability.md`.**

## The tree hazard — four hops have hit it

One working tree, one git index. **Take a linked `git worktree`; stage with explicit pathspecs; never
`git commit -a`, never a bare `git add -A`.** A fresh worktree has no `node_modules` — symlink the
shared tree's rather than reinstalling, and say that you did.

## Stop conditions

- The guard cannot be written without editing `ABC-066`'s block or a merged `ABC-042` row → **stop
  and route to me.**
- A criterion needs re-wording → **stop, route to BA/PM.** My two rulings above are readings, not
  re-wordings; if you think a THIRD contradiction exists, stop rather than resolving it yourself.
- Your guard passes on the current `AGENTS.md` before you have seen it red on a mutant → **stop.**
  That is the vacuity QE warned about, arriving.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here; do not invent one. Claim per Workflow 17 by hand: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-065-guard/`, and write `claim.md` inside it.

Report: your gate numbers; both `A4` mutants and whether each redded; **proof your guard is not
vacuous — show it red on a mutant before you show it green**; the blob hash of `:193-204` either
side; which helpers you reused and whether any fought you; `spawned`; and every gap with severity
and owner.
