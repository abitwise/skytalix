---
id: 20260810T194100Z-orchestrator-decision-35bde58d
kind: decision
by: orchestrator
at: 2026-08-10T19:41:00Z
verified_by: 
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-026
  - EPIC-002
  - plans/board.md
  - plans/tickets/ABC-016-status-panel.md
supersedes: 
---

# Opening decision — the owner named three tickets; two are scheduled and one is deliberately held. Task `refinement-ABC-026`, branch `grugops/refinement-2026-08-10`

The owner said "continue with `ABC-016`, `ABC-017` or `ABC-026`". Three tickets, all in `Backlog`.
**None of the three is pullable into `In Development` today** — `ABC-016` and `ABC-017` each end with
"Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step", and `ABC-026` says in bold that
its Definition of Ready is **not met**. So the request classifies as `refinement`, not `ticket-to-pr`,
and Workflow 07 is the workflow for all of it.

## What changed on this board that nobody has recorded yet

`ABC-016`'s board row still reads `blocked-until: ABC-013, ABC-014, ABC-020`. `ABC-017`'s reads
`blocked-until: ABC-013, ABC-014`. **All three of those tickets are in `Done`** — `ABC-020` merged
2026-08-02, `ABC-014` 2026-08-08, `ABC-013` 2026-08-10. `ABC-012` and `ABC-005` merged earlier.

**Both tickets became unblocked when `ABC-025` closed this morning and their board rows are stale.**
That is the reason the owner's question has an answer at all today and did not yesterday. The stale
`blocked-until` text is board hygiene the promoting role should fix on its own row; I am not
pre-moving it, because a row that says `Ready` before the promotion hop has run is a lie about a gate.

## The ruling: `ABC-016` and `ABC-026` run; `ABC-017` is held

Width **2** of `queue.wip_limit` **3**. Every working column is empty (`Ready` 0/8 ... `Ready to
Release` 0/4), so no WIP limit is touched by either hop.

**`ABC-016` runs because it is the highest-priority unblocked work on the board.** `P1` against
`ABC-017`'s and `ABC-026`'s `P2`, size `M`, and it carries **epic acceptance #3** — `EPIC-002` cannot
close without it. Its dependencies are all merged. Routed to **BA/PM** for the `Backlog → Ready` exit
that role owns.

**`ABC-026` runs because `ABC-016` running is what makes it urgent, and the ticket says so by name.**
`ABC-026`'s own value paragraph: *"The moment to set a total is while there is headroom, not after
`ABC-024`, `ABC-016`, `ABC-017`, `EPIC-003` and the next hardening ticket have each spent their own 5%
against a moving baseline."* Its promotion trigger is *"when the default lane passes 3 s, or when any
two further tickets each add a test file under `src/` — whichever comes first"*. **`ABC-016` and
`ABC-017` will each add a test file under `src/`. Scheduling both of them is the act that fires
`ABC-026`'s trigger.** Routed to **Architect/Design**, because `ABC-026` names that role as the one
its DoR gap requires: `plans/nfr-catalog.md` is Architect/Design's to seed, and the missing number is
a catalog row.

**`ABC-017` is HELD, and this is a decision, not an omission.** Three reasons, in order of weight:

1. **Running it alongside `ABC-016` spends the second half of `ABC-026`'s trigger before the budget
   exists** — the precise sequence `ABC-026` was cut to prevent, with `ABC-017` named in the
   sentence. Holding it keeps the count at one.
2. **`ABC-017` owes a rewrite of `plans/nfr-catalog.md`'s `NFR-002` row** ("*The row is
   Architect/Design's to rewrite; flagged here, not edited*") — the same file, the same role, that
   `ABC-026`'s hop is about to open. Sequencing `ABC-017` after means that file is written once by a
   role holding the lane budget, not twice by two hops that cannot see each other.
3. `P2`, size `S`, and its own rationale puts it in the drop-first tier: *"It is the right thing to
   drop first if this epic runs long."* It is the cheapest of the three to defer and the cheapest to
   pick up later.

**`ABC-017`'s unblock is named so the sweep cannot lose it: it is next, as soon as `ABC-026`'s
Architect/Design hop lands its ruling on `NFR-002` and the lane total.** Nothing about it is in doubt
— its own DoR block reads clean and its dependencies are merged.

## My DoR pre-check on `ABC-016` — two flags, and this count is a FLOOR, not a ceiling

I re-ran `agent-factory/checklists/definition-of-ready.md` against the ticket. Eight of ten hold
cleanly. Two do not, and both are handed to BA/PM as questions, not as verdicts:

- **acceptance criteria testable and measurable ⚠️.** Most of the table is exemplary — exact FENs,
  exact strings (`Nf3`), exact integers (`0`, `-9`, `+8`), identical row counts. But three criteria
  turn on the word **"present"** or **"names"** without pinning a string: *"the check indicator is
  present"*, *"the indicator is present"*, *"the claim cell **names** a claimable threefold
  repetition attributed to White"*. Compare the ticket's own first criterion, which asserts on
  rendered text both ways because *"a panel that always says 'white' passes a one-sided test"*. The
  same argument applies to a check indicator asserted only as present.
- **NFR trigger with a measurable target ⚠️.** The bar is `panel compute ≤ 250 µs per frame`, and its
  stated derivation is *"the expected total is well under 20 µs; the bar is set an order of magnitude
  above it"*. **That is a bar reverse-engineered from an estimate rather than derived from a budget —
  the exact shape of `ABC-025`'s `N5`,** which four instruments later found to be both breached and
  unmeasurable as written, and which cost that ticket a ruling hop. This one is ~12x its own estimate
  so it is unlikely to bind, but the ticket does not say what happens if it does not bind, and a bar
  that cannot fail is not a bar. It is also a *gross* per-frame number with no relationship to the
  lane cost `ABC-026` is about to put a total on.

**Do not treat two as the number.** This project's record is unambiguous and it is against me: on
`ABC-013` BA/PM found **eighteen** acceptance defects where my pre-check named four; on `ABC-009`,
**seven** where three were named by no pre-check at all; on `ABC-023`, **six**, three named by no
pre-check, two unsatisfiable by construction. On `ABC-025` an unmeasurable `N5` passed the DoR gate
**I personally re-ran**. Re-derive the whole checklist. My two flags are a starting point I expect to
be extended, and I would rather be told I miscounted than have the count inherited.

## Hard limits, unchanged

Neither hop writes `src/`. Neither hop merges — the owner's standing directive covers merging
gated-green work and nothing else, and the merge keystroke has been denied and returned to the owner
five times in this project. Never deploy; a human holds deploy. `quality.gate_enforcement` is
`blocking`. `agent-factory/…` is read-only KIT.

## One scheduling deviation, stated with its reason

Both hops run on the single branch `grugops/refinement-2026-08-10` in one worktree. **Neither agent
commits** — two concurrent `git commit` calls against one index is a corruption risk, not a style
preference. Each writes its files and its notes; the Orchestrator commits once both land. Workflow
17's commit step is therefore performed by me on their behalf, not skipped.
