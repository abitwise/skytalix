---
id: 20260803T110000Z-orchestrator-observation-39a99b26
kind: observation
by: orchestrator
at: 2026-08-03T11:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-012
  - ABC-010
  - ABC-014
  - ABC-015
  - ADR-0005
  - plans/board.md
  - plans/traceability.md
  - 20260802T214000Z-orchestrator-decision-0e6f8692
supersedes: 
---

# ABC-011 is through all three gates and sits in Ready for UAT. The merge is the human's.

## State at close

`Ready` 4/8 · every column from `Ready for Dev` through `In Security/NFR` **empty** ·
`Ready for UAT` 1/4 · `Done` unchanged. No limit was approached at any point in this task and **no
override was taken**. Width never exceeded **1** against `queue.wip_limit: 3`.

Four subtasks ran, each claimed by hand and each publishing its own notes; **nothing was relayed
between them** — every role read the `ref:` context folder and nothing else.

    architect-abc011-ep-availability   Ready -> In Design -> Ready for Dev
    engineer-abc011-implement          In Development -> In Review
    qe-abc011-review                   In Review -> In Security/NFR
    security-nfr-abc011-gate           In Security/NFR -> Ready for UAT

The `Ready for Dev -> In Development` pull between the first two is the Orchestrator's and is the
only board move this role took.

## Verified here rather than accepted from the reports

Suite re-run by this role on the branch tip: **193 passing / 9 files / 0 skipped**. Board WIP
counts read back column by column and they agree with the ticket front matter. Branch
`grugops/ticket-to-pr-ABC-011` holds five commits on top of `main` at `4a73cf3`; **`main` is
untouched**, and this repo still has no git remote, so no PR exists and none was invented.

## What each gate actually caught — the reason the chain is not ceremony

Every one of the three gates caught something the one before it did not, which is the fourth
consecutive ticket where that has held:

- **The design hop** rejected the obvious implementation on measurement: `legalMoves(...).some(...)`
  costs 1.979x per node against a 1.5x bar **and** inherits `ABC-009`, corrupting the position it
  hashes. It also found that the natural home for the predicate (`src/moves.ts`) would have created
  this project's first dependency cycle.
- **QE** ran 22 mutants and found `L8` — an early `return legal` that gives up after the first
  candidate capturer. It **over-collapses** two positions FIDE calls different, which is the
  *opposite* of the safe error direction this ticket's whole priority argument rests on. The
  property test could not reach it: exactly two nodes in a 518,474-node walk have two pseudo-legal
  ep capturers. The FEN had to be constructed. Closed.
- **Security/NFR** pinned the "not slower at all" sub-bar, which no wall clock can adjudicate
  (its own no-ep timings are 1.003–1.007x, inside noise both ways) — so it pinned it structurally as
  a call count, and built a second probe FEN where the predicate returns the *correct* answer and
  still dirties the board, because otherwise it would have shipped an assertion it had never seen
  fail.

The pull's own thesis also held: `ABC-012` can now be built against a key that means what FIDE
means, instead of having its repetition test written to dodge a defect.

## Open items this task produced, each with an owner — none blocking the merge

1. **`ADR-0005` is `proposed`.** It records the strict-FIDE reading and the `zobrist -> legal` edge,
   and the code it describes is now on the branch. **No agent may mark it `accepted`** — ADR-0004's
   delegated ratification is explicitly not precedent. **Owner: a human.**
2. **The invalid-FEN corruption, MEDIUM.** `zobristKey` permanently dirties a position whose ep
   square is semantically inconsistent (`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black
   pawn on d5). Clean on the `4c6ed7d` baseline, so the property is new. Unreachable by play —
   `apply.ts:139` derives `epSquare` as the double-push midpoint — and reachable only through
   `parseFen`, which is `ABC-010`'s surface. **Owners: BA/PM** (cut it or fold it into `ABC-010`)
   **and Architect/Design** (the predicate-vs-oracle divergence is a definition question, not a dev
   fix).
3. **The `ABC-014` / `ABC-015` / `RISK-005` knot**, flagged at the pull and still untied: `ABC-015`
   says it merges "with or before `ABC-014` reaches `Done`, never after", while the board holds
   `ABC-015` in `Backlog` with `blocked-until: ABC-014`. That reads as a cycle and it gates a P0.
   **Owner: BA/PM.**

## UAT

**Deferred to EPIC-006, recorded as deferred and not passed** — the `ABC-004..007` and `ABC-020`
posture, for the unchanged reason: this is rules-core-only work that renders nothing and prompts for
nothing, so there is no surface a human can exercise. Security/NFR filled the traceability UAT cell
accordingly. What UAT should cover once EPIC-006 ships: that a repetition draw is offered for
positions FIDE calls the same and not for positions that merely share a written-down ep square.

## Next action

**A human merges `grugops/ticket-to-pr-ABC-011` into `main`, or does not.** `autonomy=pr` and the
standing rule is unchanged: an agent supplies the keystroke only on explicit instruction, and that
is never standing authorization. After the merge, `ABC-012` is the next pull — it is the ticket this
one was sequenced ahead of, and its blocker is now gone.
