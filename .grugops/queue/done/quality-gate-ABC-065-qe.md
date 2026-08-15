---
task: quality-gate-ABC-065-qe
subtask: quality-gate-ABC-065-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-065-qe/
parent_ref: .grugops/context/ticket-to-pr-ABC-065-guard/
ticket: plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T02:15:00Z
branch: grugops/quality-gate-ABC-065-qe
base: grugops/ticket-to-pr-ABC-065-scribe @ 901c670
---

# Subtask: break `ABC-065` — both halves, on one branch

**Read `parent_ref:` FIRST — the guard hop's five notes — then the Scribe's four at
`.grugops/context/ticket-to-pr-ABC-065-scribe/notes/`, and your OWN five from `ABC-066` at
`.grugops/context/quality-gate-ABC-066-qe/notes/`.** All on disk; I relay nothing. **Your `Q2` from
that hop was aimed at this guard and the engineer reports it fought exactly as you predicted — go
see whether the handling is sound.**

**This branch carries the WHOLE ticket**: the Scribe's `AGENTS.md` half (`39122ec`) and the guard
(`c5a5493`), with `main` merged in at `9490740`.

## What to attack

1. **The vacuity, again, from the other side.** The engineer's `V` mutant strips the separator from
   `AGENTS.md` and reds. **Build the mutants it did NOT build.** What happens with the separator
   present but the option list empty? With the `Dev / run` slot deleted entirely? With two `Dev / run`
   slots? With the slot's HTML comment unterminated? **A guard that throws where it should red, or
   passes where the slot is absent, is the same defect wearing a different coat.**
2. **The `--` exclusion is `=== "--"`, exact.** Confirm nothing looser slipped in, and check the
   inverse: if someone documents an option literally named `--`, what happens? Say whether that is a
   real risk or a non-case.
3. **`A3` both ways.** The engineer reports the collector yields three after filtering. Attack the
   set equality in the direction its mutants did not: an accepted argument added to
   `ACCEPTED_ARGUMENTS` but not documented (the failure that will actually happen, the day `EPIC-006`
   adds an argument). **That is `A4`'s second direction and it is the one that matters long-term.**
4. **`A5`, your own standing ruling.** No second spelling of any accepted argument in added code.
   The engineer claims 0 — verify by reading the 85 added lines.
5. **Re-verify `A2` yourself.** `ABC-042`'s `A1` row must be byte-identical. **Note the fence moved:**
   `A2` names `:193-204` and calls it `ABC-042`'s row, but since `ABC-066` merged those are DIFFERENT
   regions — `ABC-042`'s row is now at `:249-260`. The engineer verified both; confirm independently.
   This is gap `G8` and your reading of it is wanted.

## Hard limits

- **Read-only on `src/` and `AGENTS.md`** — report defects, do not fix them.
- **Do not edit `ABC-066`'s merged block** and do not resolve `Q6`'s stale comment: that collision is
  ruled below and is not yours.
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine.
- **Revert every mutant** and prove `src/` and `AGENTS.md` are byte-identical to the tip afterwards.
- **`spawned` stays 10.** No new child.
- **Do not merge, push or deploy.**

## The tree hazard — five hops have hit it

Linked `git worktree`; explicit pathspecs; never `git commit -a`, never bare `git add -A`. A fresh
worktree has no `node_modules` — **symlink the shared tree's rather than reinstalling** (the guard hop
did; `ls -L` showed 94 packages and no manifest could move), and say that you did.

## Stop conditions

- A criterion needs re-wording → stop, route to BA/PM.
- A merged `ABC-042` or `ABC-066` row would have to move → stop and route to me.
- You cannot revert a mutant cleanly → stop; never leave a mutated tree behind.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here (your own `Q5` records exactly that); do not invent one.
Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`)
of `.grugops/queue/claimed/quality-gate-ABC-065-qe/`, and write `claim.md` inside it.

Report: your independent gate numbers; every mutant and whether it redded; your ruling on `G8`'s
moved fence; whether `advertisedTextOf`'s two callers are each safe; and every gap with severity and
owner.
