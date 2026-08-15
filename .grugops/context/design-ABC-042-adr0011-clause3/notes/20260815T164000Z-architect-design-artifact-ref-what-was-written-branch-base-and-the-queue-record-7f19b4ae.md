---
id: 20260815T164000Z-architect-design-artifact-ref-what-was-written-branch-base-and-the-queue-record-7f19b4ae
kind: artifact-ref
by: architect-design
at: 2026-08-15T16:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G6
  - Q3
  - E2
  - R5
  - ADR-0011
supersedes: 
---

# What this hop wrote, where it branched, and the queue record — plus the exhaustive list of what it did NOT touch

## Branch and base

| | |
|---|---|
| branch | `grugops/design-ABC-042-adr0011-clause3` |
| base | `grugops/refinement-ABC-042-a6-nearmiss` @ **`59ea767`** |
| `main` | **NOT an ancestor, verified before branching and not merged in.** The subtask file lives on `main`, was read there, and this tree does not contain it |
| concurrent hop | `ticket-to-pr-ABC-042-b1` on `src/cli.test.ts`, its own branch off the same base. **File sets are disjoint: I opened no file under `src/` for writing at all** |

## Files WRITTEN

| path | change |
|---|---|
| `memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md` | **the third amendment.** Four edits: a Status paragraph; clause 3's admission sentence **struck** with a dated replacement block; residual `R5`; a `## What this changes elsewhere` block naming the two routed sites |
| `.grugops/context/design-ABC-042-adr0011-clause3/notes/*` | six hand-authored notes — three `decision`, two `observation`, this `artifact-ref` |
| `.grugops/queue/claimed/design-ABC-042-adr0011-clause3/claim.md` | the now-running registry record |

## The queue claim

Taken **by hand** per Workflow 17 and `AGENTS.md` § Role / workflow files: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` of the task directory — **that bare `mkdir` returned
success and IS the claim**. `scripts/claim.js` is absent from this install; this is the documented
substitute and is not a re-derivation.

**The `pending` → `claimed` → `done` file transition is the Orchestrator's** and was not taken: the
subtask file is tracked on `main`, which is not in this tree.

## Note kinds, and the stamp that does not exist

Every note is `claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
`agent-factory/contracts/context-note.md`. **There is no `kind: finding` in the set and no
`§14-gate#<id>` stamp anywhere**: `scripts/context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are absent from this repository and from the kit, and
`context.human_admission` is `off`, so no verdict is emittable. **None was invented.**

## NOT touched — checked at the end of the hop, not assumed at the start

- **`src/` — nothing opened for writing.** `src/history-pane.nfr.test.ts` was **read only** and is
  byte-identical; `A12`'s budget is intact and gained zero bytes. `src/cli.test.ts` — the concurrent
  hop's file — was never opened at all.
- **`plans/tickets/ABC-042-…` — read, not edited. ZERO criteria changed**, on this ticket or any other.
- **`plans/board.md`, `plans/traceability.md`** — the Orchestrator's, not opened.
- **`plans/nfr-catalog.md`, `ADR-0008`** — owner-ratified and `G1` escalated; not opened. **No bar,
  target, level or `UNKNOWN - verify` marker moved anywhere.**
- **`memory-bank/00-index.md`** — not opened. No new ADR was written, so its `ADR-0001`–`ADR-0011` line
  and `next free id is ADR-0012` are both still true.
- **`agent-factory/…`** — the kit, read-only, never written.
- **No merge, no push, no deploy.** The commit is on this branch and nowhere else.

## Stop conditions, each checked against what actually happened

- **"An amendment would widen a rule so that what already shipped passes → stop."** Confronted head-on
  rather than dodged: **one verdict does move and it is the shipped one.** The separating test is written
  into both the ADR and the `G6` decision — a widening moves the **property** so a **breaching** build
  passes; this moves a **description** that was never the property, and `cli.ts` breaches nothing under
  `ADR-0002` clause 4 before or after. **The genuine widening — *"any module that does not construct a
  `positionCounts` map"* — was identified, priced and refused BY NAME in the file**, so the amendment
  cannot be cited as licence for it.
- **"A ruling requires changing what the product does → stop."** Never approached. **Zero production
  lines, zero test lines, zero executable characters.** The build is correct and gated and no ruling here
  asks it to change.
- **"`Q3`'s repair cannot be made without exceeding `A12` → say so plainly and route it."** Said plainly
  in its own `decision`, priced at ~4 lines with its site and its trap named, and routed to BA/PM as a
  new-ticket row **rather than as a widening of `A12`** — with the reason for preferring the new ticket
  stated rather than assumed.
