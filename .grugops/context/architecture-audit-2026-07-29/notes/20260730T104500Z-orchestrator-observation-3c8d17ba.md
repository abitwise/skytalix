---
id: 20260730T104500Z-orchestrator-observation-3c8d17ba
kind: observation
by: orchestrator
at: 2026-07-30T10:45:00Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ADR-0002
  - ADR-0003
  - NFR-004
  - NFR-005
  - ABC-009
  - EPIC-004
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - memory-bank/50-decisions/ADR-0003-legality-strategy.md
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T200039Z-architect-design-decision-bd553d62
  - 20260730T103350Z-architect-design-decision-f9ef2d01
supersedes: 
---

Scheduling + escalation record for the ADR pair on task `architecture-audit-2026-07-29`. Both
ADRs are authored `status: proposed` with unsigned ratification lines. No board move, no ticket
move, no `src/**` change; suite 143/143 green and typecheck clean at commit time.

**ESCALATION — two roles disagree and the disagreement is NOT resolved.** This is the WF16 stop
condition for a high-stakes result that is not gate-adjudicable, and it is recorded here rather
than smoothed over:

- Security/NFR (`...-security-nfr-observation-abedec95`) measured the generator at 163k-351k
  nodes/sec, called `NFR-005` MISSED, and raised `RF-2`: the legality-strategy decision is due,
  pointing at the make/test/unmake filter as ~71% of per-node cost.
- Architect/Design (`...-architect-design-decision-f9ef2d01`), in `ADR-0003`, measured the same
  code more finely — the attack test is ~59% of `legalMoves`, the bookkeeping is not the cost —
  and **records explicit disagreement with `RF-2`**. Its recommendation is to change the TARGET,
  not the code: `NFR-005`'s >=500k came from a spike measuring something else, iterative
  deepening makes `NFR-004`'s 3s clock unbreakable at any rate, so throughput buys DEPTH not
  latency, and at EBF 6 a 3x speedup buys ~0.61 ply.

Neither role is wrong on its numbers; they disagree on what the numbers OBLIGE. No §14 gate can
adjudicate "is >=500k the right target" — that is a product-strength judgment about how strong
the engine must play. **A named human ratifies or rejects. No agent may move either ADR to
`accepted`.** Until then `NFR-005` stays as corrected on 2026-07-29 (MISSED as measured);
`ADR-0003`'s further recommendation to re-derive the target is deliberately NOT applied to
`plans/nfr-catalog.md`, because a `proposed` ADR must not silently rewrite the catalog it argues
about. That restraint was the authoring agent's own call and it is the right one.

**Cross-checks that strengthen the record.** `ADR-0003` independently reproduced `ADR-0002`'s
dependency shape (4.48x/4.60x vs its 4.13x-4.21x) and reports that `ADR-0002`'s premise fails
while its conclusion strengthens — `makeMove` calls/node fall 40.9 -> 3.3, a 12x drop, not to
~1, so the penalty is 1.93x rather than the ~6% assumed. It concluded `ADR-0002` needs no edit
and did not edit it. Two ADRs authored without seeing each other's output, agreeing on the
measured shape by independent measurement, is the substrate working as intended. `ADR-0003` also
correctly declined to retry the `failed-attempt` already in this context (the `kingSquareOf`
hoist) and explains why its 0.99x/1.08x is exactly what the cost table predicts.

**Delivery note, recorded because it cost real work.** The first `adr-0003-legality-strategy`
attempt died to an upstream 529 mid-analysis having published nothing — no ADR, no note. Per this
substrate, unpublished work does not exist, so the re-dispatch started from the shared context
and re-derived everything; no partial finding was relayed from the dead run. The concurrent
`adr-0002` agent had already written both its artifacts and lost only its reply, which is why
`ADR-0002` survived intact. The lesson applied on re-dispatch — write the artifact to disk early
rather than holding it to the end — is worth keeping for long analysis subtasks.

**Open, and deliberately not taken by any agent:** ratification of `ADR-0002` and `ADR-0003`;
whether `NFR-005`'s target is re-derived; and the resulting sequencing of `EPIC-004`. `ABC-009`
and `ABC-010` remain in Backlog untouched — `ADR-0003` assessed how each option would affect
`ABC-009` without editing the ticket.

**Honest limits, unchanged.** No `finding` was admitted anywhere in this task: there is no live
§14-gate verdict for an audit or an ADR, so every one of the eight notes here is
`observation` / `decision` / `artifact-ref` with `verified_by` empty. Nobody self-stamped, not
even for measured numbers. This repo has no `scripts/context-io.ts` and no `scripts/claim.js`:
all notes are hand-written against the SCTX-01 schema, no validator or admission check ran, no
atomic claim was taken, and `index.md` / `index.jsonl` were never regenerated.
