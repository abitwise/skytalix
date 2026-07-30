---
id: 20260730T121731Z-orchestrator-observation-6d1e04b7
kind: observation
by: orchestrator
at: 2026-07-30T12:17:31Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ADR-0002
  - ADR-0003
  - NFR-005
  - EPIC-001
  - EPIC-004
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - plans/traceability.md
  - 20260730T104500Z-orchestrator-observation-3c8d17ba
  - 20260730T105400Z-architect-design-decision-309efdbe
  - 20260730T120521Z-architect-design-decision-ef4765f8
supersedes: 
---

# Routing + close record — ADR-0002 ratified, the ADR pair is now fully dispositioned

Scheduling record for subtask `adr-0002-ratify` of task `architecture-audit-2026-07-29`. The human
ruling — Olger Oeselg, in session 2026-07-30, **"ratify ADR-0002"**, unqualified — was routed to
Architect/Design (the ADR's owning role, matching the `adr-0003-ratify-amend` precedent). One
subtask, width 1, well inside `queue.wip_limit` 3. **No board move, no ticket move, no `src/**`
change**; suite 143/143 green and typecheck clean at commit time, verified by the executing agent
and again here.

**This closes the escalation opened in `…-orchestrator-observation-3c8d17ba`.** That note recorded
Security/NFR and Architect/Design disagreeing on what the measured throughput OBLIGED, named it
not-gate-adjudicable, and reserved ratification for a named human. Both ADRs are now `accepted` by
that human: `ADR-0003` on 2026-07-30 (clauses 1 + 3 as proposed, clause 2 as amended) and
`ADR-0002` on 2026-07-30 (all four clauses as proposed). **Nothing in this task is left waiting on
a human decision.**

## The orchestrator review that preceded the dispatch, and what it did NOT do

For `ADR-0003` an orchestrator review produced three amendments that were put to the human and
accepted by the same ruling. This review produced **no amendment**, and that difference is the
record: the ruling was unqualified, so all four clauses went in as proposed, including clause 2 —
the derive-don't-maintain call its own author rated only medium-high. It was **not** softened,
re-scoped, or "aligned" to anything.

The review did find two statements that ratification would have frozen as wrong, and both were
dispatched as **factual refreshes, explicitly not clause amendments**:

- **The `~6%` counterfactual was superseded by measurement.** `ADR-0002` predicted that if
  `ADR-0003` chose pin-aware generation, the history penalty would fall to ~one key (~6%).
  `ADR-0003` measured that branch: `makeMove` calls/node 40.9 -> 3.3 (12x, not to ~1), penalty
  **1.93x**, not ~1.06x. Moot today — `ADR-0003` clause 1 kept make/test/unmake, so `ADR-0002`'s
  4.13x-4.21x stands and its asked-for re-measurement is **not owed** — but `ADR-0003` clause 3
  keeps the pin-aware last resort alive with a named trigger, so the wrong number would have
  misled whoever pulls it.
- **Four stale `NFR-005` framings.** The `>= 500,000 nodes/sec` target was RETIRED at `ADR-0003`'s
  ratification. Note `…-309efdbe` had already dispositioned these as "a wording refresh at *its*
  ratification, not a reopening of its clauses" — this run executed that disposition rather than
  inventing one.

Both were judged in-scope for a clean ratification and **stated to the human as an assumption open
to veto** before dispatch, not slipped in. Neither touches a clause, the recommendation, or the
Confidence section. The executing agent preserved the original `~6%` prediction in place as history
and appended the correction beneath it — the right shape: an accepted ADR that shows its own
prediction being falsified is more trustworthy than one silently edited.

## Honest limits, unchanged from every prior note in this folder

- **The `human:` stamp on `…-ef4765f8` is a transcription, not an enforced signal.** This repo has
  no `scripts/context-io.ts`, no `scripts/claim.js`, and no `.claude/hooks/` admission guard (all
  three re-verified absent this session). No validator ran, no atomic claim was taken,
  `index.md` / `index.jsonl` were not regenerated.
- **No `finding` was admitted anywhere in this task** — twelve notes, all
  `observation` / `decision` / `artifact-ref`, because there is no live §14-gate verdict for an
  audit or an ADR. Nobody self-stamped.
- **No queue directory was created for this subtask.** Width 1 makes the within-task writer single
  by construction, and inventing queue infrastructure for one subtask would not match the
  precedent in this folder. Recorded rather than glossed: the WF17 atomic claim did not happen
  because there is nothing here to run it.
- **This session ran at REDUCED tier** — the `Agent` tool was available but on a default main
  thread with no enumerated allowlist, so the role grant was honored **by instruction, not by
  runtime enforcement**. It was announced as such before scheduling.

## Two items now carried by an `accepted` ADR and still un-dispositioned — both BA/PM's

Named here so they cannot be lost, and deliberately not acted on: ticketing and `plans/epics/**`
are BA/PM's files, and the human asked for a ratification, not a decomposition.

1. **The en-passant hashing defect at `src/zobrist.ts:71` has no ticket.** `ADR-0002`'s
   out-of-scope section reproduces it concretely and recommends a defect ticket under `EPIC-001`,
   size `S`, priority no higher than `P2`. Ratification raised its weight: clause 2 makes the
   derived key list the substrate for every repetition verdict in the product, so the key's
   inaccuracy is inherited by four epics. Error direction is the safe one (a legitimate draw is
   missed, never a false draw declared) and it is latent until `EPIC-002` + `EPIC-006` let a game
   run long enough to repeat.
2. **`plans/epics/EPIC-004-engine-and-ai-opponent.md` still states `>= 500,000 nodes/sec`** in its
   `NFR triggers` block, contradicting both the ratified `plans/nfr-catalog.md` row and
   `ADR-0002`'s refreshed Context. Flagged by `…-309efdbe` and still unfixed. The risk is concrete:
   `EPIC-004` gets decomposed against a retired number. Its `RISK-002` spike brief needs the same
   correction — it measures **depth-in-budget**, not nodes/sec.

## Board and trace

`plans/board.md` is **untouched** — no column changed, no WIP limit approached, `ABC-009` and
`ABC-010` still sit in Backlog. A ratification is not a ticket move. `plans/traceability.md` gained
the `ADR-0002` and `ADR-0003` decision rows that `…-309efdbe` flagged as owed by this role; they
were appended by Architect/Design, not by me, which is the correct owner for an ADR's own row.
