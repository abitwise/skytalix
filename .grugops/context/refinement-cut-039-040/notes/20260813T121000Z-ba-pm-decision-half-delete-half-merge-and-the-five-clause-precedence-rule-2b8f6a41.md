---
id: 20260813T121000Z-ba-pm-decision-half-delete-half-merge-and-the-five-clause-precedence-rule-2b8f6a41
kind: decision
by: ba-pm
at: 2026-08-13T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-040
  - ABC-028
  - ABC-029
  - ABC-019
  - plans/traceability.md
  - plans/tickets/ABC-040-traceability-duplicate-row-reconciliation.md
supersedes:
---

# The duplicate trace rows are HALF a lossless delete and HALF a real merge — and the reason that deferred them three times was recorded on the wrong row

> **Hand-authored, no stamp.** No `context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.

## The brief told me "This is NOT a delete." That is true of one pair and false of the other

Measured on `06c5427`, cells split **escape-aware** per the file's own rule at
`plans/traceability.md:152-156` (`re.split(r'(?<!\\)\|', line.strip()[1:-1])`). All four rows are
well-formed 10-cell rows with **zero** escaped pipes.

| pair | cols 0–4 | col 5 `Code` | col 6 `Tests` | cols 7–8 | col 9 `Status` | disposition |
|---|---|---|---|---|---|---|
| `ABC-028` L203/L205 | **byte-identical** | 2659 / **0** | 3683 / **0** | empty/empty | stale is a **BYTE-EXACT PREFIX** of live (2618 of 50168) | **LOSSLESS DELETE** |
| `ABC-029` L204/L206 | **byte-identical** | 727 / **0** | 2885 / **0** | empty/empty | **diverges at char 2705**, stale holds **2404 bytes absent from live** | **MERGE** |

**The stale `ABC-028` row contains zero bytes of information the live row does not already hold.**

## The recorded reason is TRUE, and the inference drawn from it is not

The live `ABC-028` row ends with the sentence three hops inherited:

> *"the stale `ABC-028` row is NOT a prefix (diverges at char 1619 into empty columns and a
> cut-time `Backlog` status), so it needs a RECONCILING hop, not a delete."*

**As a WHOLE-ROW measurement it is exactly right** — I re-measured: whole-row divergence at char
**1619**, precisely where col 5 begins. **But the non-prefixness is produced entirely by the two
EMPTY cells, and an empty cell is an absence, not a disagreement.**

**The reason is true of `ABC-029` and was written on `ABC-028`'s row.** One true sentence, one
wrong inference, three deferrals — and it propagated into the brief that cut this ticket, which
states the non-prefix property of `ABC-028` specifically.

Both relations verified **stable across all eleven commits** that touched the file since `5caef94`
introduced the pairs: `ABC-028` prefix-True at every one, `ABC-029` prefix-False at every one. **Not
a coincidence of today's tip.**

## What the stale `ABC-029` row uniquely holds — 2404 bytes a delete would destroy

A dated hop record, **AMENDED 2026-08-11 by BA/PM at `refinement-ABC-019-a11`**, carrying four
things found nowhere in the live row:

1. `PRIORITY P2 -> P1` with its derivation, and the correction of the cut-hop headline *NOTHING IS
   BROKEN*.
2. `src/turn-loop.ts:52` imports `./history.ts` at runtime — production runtime importers of
   `src/history.ts` are **ONE, not ZERO**.
3. `A3` is **internally contradictory** — first recorded here.
4. The merge-order decision: `ABC-028` first, then `ABC-029`, then `ABC-019` rebases.

Absence confirmed by probe: `AMENDED 2026-08-11`, ``PRIORITY `P2` -> `P1```, `NOTHING IS BROKEN`,
`refinement-ABC-019-a11`, `ONE, not ZERO`, `turn-loop.ts:52` — all in the stale cell, **none** in
the live one.

**The subtlety that makes this a ruling and not a copy-paste:** the live row *does* say *"Size `S`
and priority `P1` both RE-DERIVED and both HOLD"* (dated 08-12). The **conclusion** survives; what
is missing is **when it changed, who changed it, and on what measurement.**

## THE RULING — what wins when the two rows disagree (`R1`–`R5`, on the ticket)

**R1 — position never decides.** The file's *"APPEND TO THE FIRST OF EACH PAIR"* (`:167`) is a
**write-routing** rule — where the next hop appends. It is **not** a truth rule and must never be
read as *"the second row is discardable"*: measured, that reading destroys 2404 bytes.

**R2 — an empty cell is an absence, never a disagreement.** Non-empty survives, no judgement
needed. (Resolves `Code` and `Tests` in both pairs.)

**R3 — a byte-exact prefix carries no independent information.** The longer cell survives, the
shorter is deleted outright. (Resolves `ABC-028`'s `Status`; this is what makes that half provable.)

**R4 — where neither cell is a prefix of the other, the result is the UNION of DATED RECORDS in
date order. No dated record may be dropped — including one whose conclusion is already stated
elsewhere in the surviving row.** A trace file records the trail, not just the destination.

**R5 — where two dated records contradict, the LATER is current state and the EARLIER is RETAINED
with its date.** Correcting a fact never authorises deleting the record that it was once believed.
**Same-dated contradictions are not resolvable by this rule: stop and escalate rather than pick.**

## Two things I refused, and the reason is the same one

- **Shortening any `Status` cell.** The live `ABC-028` cell is **50,168 characters**. That is real
  and it is the delivery audit's finding — *the record is the waste* — **not this ticket's**. `R4`
  forbids buying brevity with dated history. If shortening is wanted it is a decision with its own
  rule, not a side effect of a de-duplication.
- **The status-currency defect** — see the observation note. Ten rows, different class, and folding
  it in takes `ABC-040` past `S`, which the brief named as the signal to split rather than pad.

## The owner question, stated more precisely than the audit did

The audit called this *"THE DEBT WITH NO OWNER"* and wrote *"none of them names who fixes it."*
**Slightly too strong.** `plans/traceability.md:169` does name one: *"Owner: the Orchestrator, to
sequence the de-duplication against that hop."* **What had no owner was the reconciliation, not the
sequencing** — and the blocker that sequencing waited on (*"a BA/PM hop was live on `ABC-019`"*) is
**discharged**: `ABC-019` is in `Done`, verified on the board. The precondition has been met and
nothing moved. `ABC-040` is the reconciliation; the sequencing stays the Orchestrator's.
