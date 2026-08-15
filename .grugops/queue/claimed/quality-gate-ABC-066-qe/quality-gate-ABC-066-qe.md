---
task: quality-gate-ABC-066-qe
subtask: quality-gate-ABC-066-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/quality-gate-ABC-066-qe/
parent_ref: .grugops/context/ticket-to-pr-ABC-066/
ticket: plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T22:45:00Z
branch: grugops/quality-gate-ABC-066-qe
base: grugops/ticket-to-pr-ABC-066 @ 8fb6ff1
---

# Subtask: break `ABC-066` — the usage line now claims to be runnable

**Branch from `grugops/ticket-to-pr-ABC-066` @ `8fb6ff1`, NOT from `main`.** That tip carries the
build and five notes. `main` @ `4e9ed1d` is its base and IS an ancestor, so it is already in.

**Read `parent_ref:` FIRST — five notes from the implementing hop, and they are the only channel; I
am relaying nothing.** The engineer's own report of its gate, its mutants and its lane measurement is
in there. **Do not take it on faith and do not re-derive what it already measured** — your job is the
part it could not do for itself: an implementer cannot be the independent check on its own guard.

## What to attack

1. **The guard, not the fix.** The fix is one string. The claim worth breaking is *"what the usage
   line advertises resolves"* — `A2`. The engineer wrote the grammar expander that turns the printed
   line into invocations. **A wrong expander passes a wrong line.** Feed it lines it has never seen:
   nested brackets, an empty alternation, a `|` outside brackets, an option advertised twice, a line
   with no `--` at all. Does it throw, silently return `[]`, or quietly pass? **An expander that
   returns zero invocations makes `A2` vacuously true** — check that case by name.
2. **`A4` was measured by the author. Re-measure it.** Rebuild `main`'s delivered `USAGE` string
   byte-for-byte and watch the suite go RED yourself. A mutant nobody but its author has seen red is
   an argument, not a test.
3. **The four helpers at module scope** — `SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf`,
   `invocationsAdvertisedBy`. `ABC-065`'s guard hop is instructed to REUSE them, so they are now
   shared infrastructure on their first day. **`usageLineOf` takes the last non-empty stderr line** —
   find out what it returns when a warning follows the usage line, and say whether the next hop can
   safely lean on it.
4. **`A5` — read, never transcribed.** `SEPARATOR_FORM` is a literal. Rule whether it is the "second
   spelling" `A5` forbids or the one permitted spelling, and say which on the record.
5. **`spawned` is 10 and must stay 10.** Your work adds no child.

## Hard limits

- **Do not edit `src/cli.ts`.** If the production line is wrong, report it — do not fix it.
- **Do not edit `AGENTS.md`** — `ABC-065`'s half is live on another branch and unmerged.
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine.
- **Do not merge, push or deploy.**
- Report every number you measure, including the ones that agree with the engineer's.

## The tree hazard, learned this hop the hard way

**One working tree, and the shared git index is NOT disjoint even when the files are** (`G4`/`G5`,
both hops, independently). `main` is checked out in the main tree. **Take a linked
`git worktree`** for your branch rather than checking out here, and stage with **explicit
pathspecs** — never `git commit -a`, never a bare `git add -A`.

## Stop conditions

- A criterion needs re-wording → stop, route to BA/PM. Do not re-word it yourself.
- A merged `ABC-042` row would have to move → stop and route to me.
- You find a defect that needs a production change → report it; the fix is a new hop, not this one.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/quality-gate-ABC-066-qe/`, and write `claim.md` inside it.

Report: your independent gate numbers; every mutant you built and whether it redded; the expander
inputs you tried and what each returned; your ruling on `A5` and on `usageLineOf`'s robustness for
the next hop; and every gap with severity and owner.
