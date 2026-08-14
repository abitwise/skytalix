---
task: abc042-b1-2026-08-15
subtask: design-ABC-042-adr0011-clause3
role: architect-design
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/design-ABC-042-adr0011-clause3/
parent_ref: .grugops/context/ticket-to-pr-ABC-042-q1q2fix/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T16:00:00Z
branch: grugops/design-ABC-042-adr0011-clause3
base: grugops/refinement-ABC-042-a6-nearmiss @ 59ea767
---

# Subtask: `ADR-0011` clause 3's trigger has FIRED — plus the licence comparator and `A9`'s scope

**Branch from `grugops/refinement-ABC-042-a6-nearmiss` @ `59ea767`, NOT from `main`.** **`main` is NOT
an ancestor — do not merge it in.** This subtask file is tracked on `main` and will not exist in your
tree; read it before you branch. Its queue transition is the Orchestrator's.

**You are owed an explanation before the work, because this has waited.** These three items have been
recorded and deferred **four times** across this ticket. The first three deferrals were priority: they
are non-blocking and blocking work kept arriving. **The fourth was a real reason and it has now
expired** — `G6` touches `ADR-0011` clause 3, whose citation requirement `A12` cites, and BA/PM was
concurrently rewriting this ticket's criteria. Two roles amending interacting rules on separate
branches neither could read is the exact failure this ticket has taught repeatedly. **BA/PM finished
at `59ea767`; you are branching from its output, so you can see everything it decided.**

**Read `parent_ref:` and the four other task folders on this ticket** —
`.grugops/context/design-ABC-042-stderr/` is **your own earlier hop on this ticket**, and it is where
you ruled the `stderr` channel, ruled clause 1's trigger does not fire, and **wrote no ADR because you
refused to widen a rule so that what ships passes.** That refusal is the standard for this hop too.

## The three items

**`G6` — clause 3's dated trigger has FIRED, and it is the reason this hop exists.** The clause's
licence wording says *"game-owning driver"*; the second entry is now a **composition root**
(`src/cli.ts`), which owns no game. `ABC-041`'s hop flagged the wording as owed **at `ABC-042`**, the
build hop confirmed the trigger fired, and the entry has since landed. **The property the clause
guards is satisfied and `A12` is checkable as written** — this is a wording-vs-reality gap, not a
broken guard. **Rule it. Amend or do not, and say which and why.**

**`Q3` — the licence comparator is weakenable, MEDIUM (QE).** `LICENSED_DRIVERS`'s equality can be
weakened to a subset and **nothing asserts that it was not** — the merged guard would stop guarding
while staying green. **QE could not fix it and neither can the engineer: `A12` bounds
`src/history-pane.nfr.test.ts` to one array element plus its citation.** So the repair needs either
your ruling that it falls outside `A12`'s budget, or a criterion change routed to BA/PM. **Name which,
and price it.**

**`E2` — `A9`'s scope, LOW (from the fix hop).** `A9` cannot see a second `process.argv` read from a
**merged** module, because its scope was ruled to the two new production modules. **Not live today.**
Say whether that scope is right, and if it is not, whose it is to widen and when.

## Hard limits on this hop

- **ZERO code and ZERO criteria.** You rule and you write ADRs. Criteria are BA/PM's; instruments are
  the engineer's. **If your ruling implies a criterion change, name it and route it — do not make it.**
- **`A12`'s budget binds the tree**: `src/history-pane.nfr.test.ts` may not gain bytes on this ticket
  beyond the one element plus its citation already landed. **A ruling that requires editing that file
  is a ruling plus a routed criterion change, not an edit you make here.**
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. *(Same standing
  restriction every role on this ticket has had; the resulting board move is mine.)*
- **Do not touch `plans/nfr-catalog.md` or `ADR-0008`** — owner-ratified, and `G1` is escalated to the
  project owner. Nothing here may move a bar.
- **A concurrent hop is running on `src/cli.test.ts`** (`ticket-to-pr-ABC-042-b1`, its own branch off
  the same base). **Your file set and its file set are disjoint and must stay that way.**
- **Do not merge, do not push, do not deploy.**

## Stop conditions

- An amendment would widen a rule **so that what already shipped passes** → **stop.** That is the move
  you refused on this ticket once already, and it is still the wrong one.
- A ruling requires changing what the product does → **stop.** The build is correct and gated.
- `Q3`'s repair cannot be made without exceeding `A12` → **that is the expected answer**; say so
  plainly and route the criterion change rather than treating it as a blocker.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory. Commit on your branch.

Report: your `G6` ruling and whether you amended `ADR-0011` (and if not, why not); your `Q3` ruling
with the repair priced and its owner named; your `E2` ruling on `A9`'s scope; any criterion change you
are routing rather than making; and every new gap with severity and owner.
