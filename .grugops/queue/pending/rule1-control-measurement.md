---
task: refinement-rule1-control-2026-08-17
subtask: rule1-control-measurement
role: ba-pm
workflow: agent-factory/workflows/07-refinement.md
ref: .grugops/context/refinement-rule1-control-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T14:25:00Z
branch: grugops/rule1-control-measurement
base: main @ 9d5ad66
---

# Subtask: MEASURE process rule 1's own control, then cut a ticket only if the measurement warrants one

## The order of these two steps is the whole point

**Step 1 is a measurement. Step 2 is conditional on it.** Do not reverse them, and do not let step 2
happen quietly inside step 1. If the measurement says the rule is fine, **cut nothing and say so** —
that is a successful outcome of this hop, not a failure of it.

## Step 1 — compute rule 1's stated control

`AGENTS.md` § "Process rules (this project)" rule 1 states its own control:

> *"gaps found at QE fall below 3 per ticket for five consecutive tickets and backward moves below
> 0.5 per ticket, while gaps recorded at the `Ready for Dev` exit RISE. **If gaps fall at both ends
> the rule is not working — it is hiding.**"*

**It has never been computed.** The rule has run on at least `ABC-041`, `ABC-042`, `ABC-065`/`066`,
`ABC-068`, `ABC-061`, `ABC-062`, `ABC-063` and `ABC-064`. Compute it across those, from the record.

**The first difficulty is the definitions, and naming it is part of the job.** "Gaps found at QE",
"gaps recorded at the `Ready for Dev` exit" and "backward moves" are not defined anywhere with a
counting rule. **Define each one explicitly, state the definition before you count, and count
consistently.** If a term cannot be made countable from what the record actually holds, **say that
plainly — an unmeasurable control is itself a finding, and a more useful one than a number invented
to fill the slot.**

Where the evidence is (read; do not take my summary of it as data):

- `.grugops/context/ticket-to-pr-ABC-041/notes/…criteria-review-at-the-in-development-entry…`
- `.grugops/context/readyfordev-ABC-042/notes/` and `.grugops/context/ticket-to-pr-ABC-042/notes/`
- `.grugops/context/pull-abc065-066-2026-08-16/notes/…ready-for-dev-exit-re-read…`
- `.grugops/context/ticket-to-pr-ABC-068-2026-08-16/notes/…criteria-review-at-ready-for-dev-exit…`
- `.grugops/context/ticket-to-pr-ABC-061-2026-08-17/notes/` and `…-ABC-062-2026-08-17/notes/`
- `.grugops/context/sweep-ABC-063-064-2026-08-17/notes/` and `…/ticket-to-pr-ABC-063|064-…/notes/`
- `plans/tickets/history/*-board-history.md` and `plans/board.md`'s current header
- `plans/traceability.md` rows for those tickets

**Report the three series and the verdict the control itself defines**: rising exit-gaps with falling
QE-gaps (working), falling at both ends (**hiding** — the rule's own words), or indeterminate.

## Step 2 — CONDITIONAL. Cut a ticket only if step 1 warrants it

Four failure classes are on the record, each found by RUNNING and missed by READING:

| class | seen on |
| --- | --- |
| stale — criteria no longer match the tree | `ABC-063`/`ABC-064` line anchors |
| already-satisfied — a merged ticket delivered it first | `ABC-061` `A4`, `ABC-062` `A3` |
| unfalsifiable — cannot fail under the mutation it names | `ABC-063` `A3` |
| impossible-as-written — cannot pass on a correct build | `ABC-064` `A1` |

The candidate fix is a `Ready for Dev` exit step that **runs** each criterion's named mutation rather
than reading the criterion and judging it well formed. **Price it honestly** — it would cost every
pull gate real time, and four anecdotes are not a warrant. If you cut it, the ticket must carry a
measurable acceptance and a falsifier, like every other ticket here.

**If the measurement does not warrant it, cut nothing.** Say what would have to be true for it to be
warranted, and what to measure next time.

## Fences

- **Do not enact anything.** This hop measures and, at most, cuts a ticket page. It does not change
  the process.
- **Do not edit `AGENTS.md`.** It is the Scribe's pen. If a change is warranted, the ticket says so
  and the Scribe writes it later.
- **Do not touch** `src/`, `plans/board.md` (I own it), `plans/traceability.md` (I own it), or
  `.grugops/factory.config.json`.
- **`agent-factory/…` is read-only KIT.** Never write it. The kit has no rule 1 — it is a project
  rule, which is why it is ticketable here at all.
- **Rule 2 applies to your own output**: acceptance, scope and risks on the ticket page; the
  measurement, the definitions and the rejected alternatives in your notes.
- **Do not invent a number to fill a slot.** `UNKNOWN - verify` is an acceptable cell; a fabricated
  count is not.

## A clock warning — my error, and it will bite you if you copy it

**Stamp your notes from `date -u`, not the local clock.** Every `at:` I wrote earlier this session is
EEST wearing a `Z` and is **+3 hours wrong**; the contract makes `at` the authoritative replay sort
key, so those notes sort wrongly against honestly-stamped ones. This is recorded in
`.grugops/context/sweep-ABC-063-064-2026-08-17/notes/…-eest-mislabelled-as-z-…`. **Do not copy the
offset to appear consistent with me — be right, and let the disagreement show.**

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/rule1-control-measurement`.

Commit on `grugops/rule1-control-measurement`, never on `main`. Do NOT merge — I hold the merge.
