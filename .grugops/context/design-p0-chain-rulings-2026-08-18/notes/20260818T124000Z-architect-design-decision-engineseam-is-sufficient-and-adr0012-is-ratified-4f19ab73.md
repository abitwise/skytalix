---
id: 20260818T124000Z-architect-design-decision-engineseam-is-sufficient-and-adr0012-is-ratified-4f19ab73
kind: decision
by: architect-design
at: 2026-08-18T12:40:00Z
verified_by:
confidence: high
refs:
  - ADR-0012
  - ABC-078
  - ABC-095
  - ABC-043
  - EPIC-004
  - EPIC-005
  - src/turn-loop.ts
supersedes:
---

# Ruling 1 — `EngineSeam` as merged IS sufficient. A composition point IS owed, and it lives OUTSIDE the seam. `ADR-0012` is now `accepted`.

## Scope

The `EPIC-004`/`EPIC-005` composition point: `ABC-078`'s open DoR **⚠️(5)** and `ABC-095`'s hard
blocker. Ruled at task `design-p0-chain-rulings-2026-08-18` on the Orchestrator's routing.

## The ruling, in one paragraph

**Both halves of the question have an answer and they are not in tension.** `EngineSeam`
(`src/turn-loop.ts:138`, re-measured exact at `main` `3054ee0`) is **sufficient as merged** — it is a
**function type**, so it can be wrapped from outside without being changed. A composition point **is
owed**, and it lives **neither inside `EPIC-004`'s engine module nor inside `runTurnLoop`**: it is a
**third module** — `EPIC-005`'s **decorator** `EngineSeam → EngineSeam` — plus **one line** at
`EPIC-006`'s composition root (`ABC-043`). On a book hit the decorator never calls the inner seam; on
a miss it returns `await inner(history)`.

## What this hop actually did, since the substance was already written

`ADR-0012` was authored **`proposed`** at task `design-engine-seam-composition-2026-08-18` and its
clauses are correct. This hop **re-checked its load-bearing facts at HEAD and RATIFIED it**:
`memory-bank/50-decisions/ADR-0012-book-engine-composition-point.md` is now **`accepted`**. Clauses
1–9 and every other section are **byte-unchanged**; what was added is the Status section's signature,
a falsifier table, clause 9's **discharge**, and two re-measurements.

## Why ratification was mine to make, when the proposing hop declined

- Its ground (1) — *"a standing rule, recorded on `ABC-092`, that an agent researches and a human
  ratifies"* — **misreads that rule**. `ABC-092`'s row is about the **book's SOURCE and LICENCE**
  (`RISK-004`), a legal/product choice. The general rule is `memory-bank/60-progress.md` § **"Standing
  directive — who decides"** (owner, 2026-08-03), whose own heading says it **supersedes "no agent may
  ratify an ADR"**. `context.human_admission: off` governs `finding` notes and gate stamps, never an
  ADR `Status` line — `ADR-0005`, `0006`, `0009`, `0010`, `0011` are all `accepted` by this role with
  that flag off.
- Its ground (2) — *"it binds the ticket shape of three epics"* — is real weight but the owner's hedge
  reserves to him decisions that **change a product promise, spend money, or trade away a commitment**.
  This changes none: the book and the search are already promised by their epics, and this decides only
  **where composition sits**, at **zero production lines**.

## The constraint I was given, and it did NOT bind

**`ABC-078`'s `A6` (byte-identical `src/turn-loop.ts`) requires no change and no criterion on that page
moves.** I re-read `A6` and `src/turn-loop.ts:138`/`:150` at `3054ee0` before signing. Had the ruling
required the merged type to change, this note would say **STOP — escalate to the owner** instead. It
does not. **The seam-widening shape (a skip-the-book flag / composition parameter) is REJECTED**, so
the contract change `ABC-078`'s `## Dependencies` feared cannot now arrive from `EPIC-005`.

## Risks

- **`ADR-0012` clause 9 was written against a guard that has since been fixed.** It is recorded as
  **discharged** in the amendment, not silently dropped: `ABC-103` merged 2026-08-18 and
  `productionModules()` at `src/cli.test.ts:51` now computes the count. A reader who quotes clause 9's
  "`ABC-103` before `ABC-078`" sequencing today is quoting spent advice.
- **`G4` (two epics, one seeded-randomness seam) is NOT closed** by this or by the ratification. It
  needs its own hop before `ABC-094` or `EPIC-004`'s search ticket enters `In Development`.
- The residual the Orchestrator named in the wave note — forward rework on `ABC-078`'s caller-side
  wiring — is now **closed to zero for the module and the seam**, since the ruling touches neither.
