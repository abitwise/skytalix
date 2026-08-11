---
id: 20260811T212400Z-architect-design-decision-production-module-ruling-3e8a5c14
kind: decision
by: architect-design
at: 2026-08-11T21:24:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-017
  - ABC-028
  - NFR-002
  - NFR-008
  - ADR-0002
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - ADR-0011
  - RISK-ABC017-04
  - EPIC-006
supersedes:
---

# The ruling: the word was carrying THREE attributes, and each guard gets the one it is actually about

> **Hand-authored** — `scripts/context-io.ts` does not exist here. `kind: decision` needs no stamp;
> the measurements it rests on are in the sibling `observation` note and **none is recorded as a
> `finding`**, because no §14 gate was run at this hop and `human_admission` is `off`.

## 1. The definition

> **A *production module* is every `.ts` file under `src/` that is not a `.test.ts`.**

No exclusions, no exceptions, no filenames. `turn-loop.ts` is one. `perft-bench.ts` is one.
`history.ts` is one. **This is `A1`'s one expression, and both guards derive their file set from it.**

**Being a production module is not the same as being in scope for `NFR-002`.** That conflation is the
entire defect, and separating them is the whole ruling. `ADR-0011` holds it in four clauses:

| clause | content |
|---|---|
| **1** | the definition above — one expression, no exclusions |
| **2** | `NFR-002`'s premise is a property of the **FRAME PATH**: `history.ts`'s body is never evaluated in the closure of the frame's producers. **The probe roots there.** |
| **3** | the regex holds a **different, whole-tree** property — **`ADR-0002` clause 4**: the runtime-importer set of `history.ts` must **equal** the declared licence set, today exactly `{ turn-loop.ts }`. **This is why it must not be narrowed to the frame path.** |
| **4** | an **entry point** is a production module with **no exports** — measured, `perft-bench.ts` is the only one. It ships (so it is production), nothing can import a binding from it (so it is never on the frame path), and it runs when loaded (so it can never be a probe root) |

**The two hand-maintained filename exclusions are DELETED, not replaced, and no third one is
created.** `history.ts` and `perft-bench.ts` are not frame producers, so neither needs an exclusion;
`turn-loop.ts` never appears in the probe at all. **`turn-loop.ts` is green by the property, not by
an exemption.**

**The two guards were never guarding the same property.** They were fused under one criterion because
both mention `history.ts`. Separating them **by property rather than by file set** is what makes both
file sets derivable, and it is why the delivered note calling the regex *"not load-bearing any more"*
is false for a deeper reason than QE recorded: it is not redundant with the probe because **it is not
measuring the same thing.**

## 2. `A3` — the ruling, and the internal contradiction resolved

**`src/perft-bench.ts` IS a production module, IS an entry point, and is NOT on the frame path.**
Three separate facts; one word was being asked to carry all three, and that is why `A3` came out
contradictory.

- **Form (a): REJECTED.** It requires rooting the harness, which corrupts the probe's channel
  (reproduced this hop), costs a benchmark run, and would pull a `main()`-guard production change
  into `src/perft-bench.ts`. **And it guards nothing** — the harness is not on the frame path.
- **Form (b): ADOPTED WITH ITS SECOND CLAUSE DENIED.** Form (b) says the harness is out of scope
  *"and the regex guard excludes it too"*. **That clause is wrong and is dropped.** Out of scope for
  the **property**; in scope for the **regex's file set**, because the regex holds a different
  property.
- **Therefore *"either way, `WPERFT-STATIC` must still die, and it must die on the regex"* is
  HONOURED, not dropped.** Measured: `WPERFT-STATIC` is **RED** on the ruled regex. **No measured
  kill is lost and no loss has to be swallowed** — which is the outcome BA/PM's flag said was
  available only if a per-guard rule could be reconciled with `A1`'s one-expression demand. Clauses
  1–3 are that reconciliation.
- **`RISK-ABC017-04` / `WPERFT-DYN`: RULED NOT A BREACH.** `void import("./history.ts")` in the
  harness evaluates the module without constructing a `positionCounts` map, so it breaches neither
  `NFR-002` (off the frame path) nor `ADR-0002` clause 4 (not a caller). It survives, and it is
  correct that it survives. **This costs nothing**: QE measured it as caught by **nothing** today, so
  the ruling removes a false obligation rather than a guard.

## 3. What it costs — stated as a ledger, not as a win

**Every kill preserved, two gained, exactly one lost.**

- **Gained: `WLOOPINFRAME`** — a renderer importing `turn-loop.ts` pulls `history.ts` into the frame
  closure and goes RED. **This is `NFR-002`'s actual void-condition and has never been guarded**,
  because under the delivered rule the guard is red on the correct build and cannot discriminate.
- **Gained: `WSTALELICENCE`** — the licence set is an **equality**, so a licence that stops being
  true goes red. The delivered rule is blind to it.
- **LOST, exactly one: `WOFFFRAME-DYN`** — a **non-static** runtime pull of `history.ts` into a
  module that is neither on the frame path nor licensed. It breaches neither property, so it is a
  removed false positive rather than a lost guard — **but it is a genuine narrowing of reach and I am
  recording it as a loss rather than letting it be discovered.** The static form is still caught.

**`A2` is NOT made moot and is still owed** — `WSTDOUT` in `glyph-mode.ts`, a frame-path root, still
corrupts the channel. The ruling removes only the `perft-bench.ts` route into that failure.

**Residual risk, named:** the declared frame path **fails OPEN** — a new renderer added without being
declared is silently unguarded. `ADR-0009`'s frame-height identity is a **partial** tripwire (a
renderer adding no rows would not trip it) and is not claimed as more. **Owner: Architect/Design, at
the next hop that adds a frame producer. Dated expiry: `EPIC-006`** — when its entry point assembles
a frame, composition becomes an import, the frame path becomes a real closure, and the declaration is
deleted.

## 4. The ADR, and why it is `accepted` rather than escalated

**`ADR-0011` is written and `accepted`.** It earns one on this board's own bar: it is the *why* a
future maintainer cannot recover from the guards alone, and `ADR-0009` / `ADR-0010` are the
precedents for the shape.

**No owner ratification is owed, and the precedent is applied rather than cited.** `ADR-0008`'s
Status section is explicit that it needed **Olger Oeselg** because it fixed a budget **level** a human
has to value, and that **`ADR-0004`'s by-delegation ratification is NOT precedent**. `ADR-0009` and
`ADR-0010` draw the distinction the other way: *"No target moves and no level is set, so no owner
ratification is owed … every claim is gate-adjudicable."* **This ruling moves no target, bar, level or
`UNKNOWN - verify` marker; sets no level; and every claim in it is gate-adjudicable and was run on 15
constructed builds.** So it sits on the `ADR-0009`/`ADR-0010` line, and **`ADR-0004`'s delegation is
neither relied on nor extended.**

**I therefore did not escalate and did not stop.** The one thing that *would* have needed an owner —
a bar, a level, or a relaxation of `NFR-002` — is not in this ruling, and I would have stopped rather
than take it.

## 5. What this leaves BA/PM, so their hop is short

**I wrote no acceptance criterion. They are BA/PM's.** What the ruling settles for them:

1. **`A3` is now writable in ONE form** — form (b) with its *"and the regex guard excludes it too"*
   clause removed, plus the *either way* sentence **kept**. The two forms no longer assert opposite
   verdicts on the same build, which is exactly what `❌ item 4` failed on.
2. **`A1`'s one expression is settled and needs no new clause** — one set (`production`) plus a
   named per-guard rule, which is the shape `A1`'s own trap note already sanctions. Its
   `turn-loop.ts` clause is satisfied **by the property**, not by a literal, and the *third
   hand-maintained filename* it forbids is not created.
3. **`A2` is unchanged and still owed.** Its trigger is unchanged.
4. **`A4` is unchanged**, and `ADR-0011` supplies the corrected wording its second half needs: the
   regex is not redundant **because it holds a different property**, which is a stronger and truer
   correction than *"the coverage is not nested"*.
5. **Size `S` HOLDS.** The one condition that would have moved it — form (a) of `A3` — was **not
   chosen**, so the `src/perft-bench.ts` production change never falls due. Re-derivation is not
   needed and is not requested.
6. **DoR: items 4 and 10 are now unblocked.** I do **not** score them — that is BA/PM's, and a ticket
   does not become Ready because a design hop ran. **The score stays at 7 of 10 until BA/PM
   re-assesses**, and the route they were promised (*"one hop … after which `A3` is written in one
   form, the size is re-derived if form (a) is chosen, and items 4 and 10 are re-assessed"*) is now
   walkable with no owner input and no new measurement.

## 6. What I did NOT do

**Zero `src/` bytes and zero test lines.** `plans/board.md` **not opened for edit** — the `In Design`
exit and any column move are the Orchestrator's, and I am not taking them. **`plans/tickets/` not
touched at all**, including `ABC-029`'s own ticket: the criteria are BA/PM's and editing the ticket
would be writing them by the back door. `ABC-017` **not re-opened, not moved, not edited** — its
`A11` was MET and stays discharged; what changes are the two live **instruments**, which is the split
`ABC-029`'s `## Out of scope` already drew. `ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010` **read,
not re-opened**. `../cli-chess-ABC-019` **never opened** — the replica came from the object database.
**`NFR-002`'s `MET`/`MISS` remains Security/NFR's**, and `ABC-019` has never been through that gate.
**Nothing merged, nothing pushed, nothing deployed.**
