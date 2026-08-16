---
id: ABC-075
title: Incremental Zobrist key — the one seam this epic needs and does not have
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-075 — build the incremental key. **Architect/Design specifies the seam; this ticket does not.**

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **This ticket names its own limit before it names its scope.** The architecture audit
> (2026-08-12) ruled this seam necessary and Architect/Design owns its design. My subtask forbids me
> from specifying it and I have not. **What is below is the problem, the constraints already on
> record, and what "done" must observably mean — not a design.**

## Problem

*User*: the search, at every node.

*Pain*: `zobristKey` is a **full 128-square scan allocating `bigint`s at ~295–304 ns**, and *on
positions with an en-passant square it calls into `legal.ts` → `apply.ts` and plays a move*
(architecture audit, measured). `ADR-0002` clause 3 has the search keeping a **per-ply key array**
and `ADR-0005` names the consequence itself — *"`EPIC-004`'s transposition table computing a key
**per node** … changes both the module graph and the search's per-node cost."* The audit's verdict:
**"it is the one place the current shape does not simply extend."**

*Value*: the transposition table (`ABC-081`) is unaffordable without it, and the TT is where a
large part of this epic's depth comes from.

**This is a known, recorded, priced consequence — not a defect in merged code.** `zobrist.ts` is
correct and conformant; it was built for a different call frequency.

## The design problem, stated and NOT solved here

**An incremental key is not a plain XOR delta on this codebase, and the reason is ratified.**
`ADR-0005` defines the en-passant component as entering the key **only when a LEGAL en-passant
capture exists** — `zobrist.ts:28` imports `hasLegalEnPassant` and the ADR conformance audit records
it as *"CONFORMS, clause for clause"*. **Whether a legal ep capture exists in the resulting position
is not a local function of the move just played**; deciding it requires generation. So the ep
component cannot be XOR-updated the way piece, castling and side-to-move components can.

`ADR-0006` adds the second constraint: the key hashes castling **rights**, not availability, and
`EPIC-004` **inherits that** — a TT keyed on this hash treats two placements alike under the rule
that ADR records.

**Owner of the resolution: Architect/Design.** `ADR-0005`'s own falsifier `F6` is live here, and the
audit says the threading decision must be *made explicitly rather than discovered*. **This ticket
must not enter `In Development` until Architect/Design has ruled on the ep component and on
`EPIC-004`'s threading decision.** BA/PM does not resolve either by inference.

## Scope

- An incrementally-maintained Zobrist key across `makeMove` / `unmakeMove`, **to the design
  Architect/Design publishes.**
- Equivalence with the existing full-scan `zobristKey` as the oracle.
- The per-node cost improvement, measured.

## Out of scope

- **Changing what the key hashes.** `ADR-0005` (ep availability) and `ADR-0006` (castling rights)
  are ratified; this ticket changes the *when it is computed*, never the *what*.
- **The transposition table** — `ABC-081`.
- **The threading decision** — Architect/Design's, and a *precondition*, not a deliverable here.
- **Touching `src/legal.ts`.** `ADR-0003` clause 1 ratified it unchanged.

## Acceptance (Given/When/Then)

- **`A1` (byte-equivalence against the existing oracle, at depth).** **Given** the positions of
  `src/perft.test.ts`, **when** every move is made and unmade to depth 4, **then** the incremental
  key equals `zobristKey(position)` at **every** node — **0 mismatches** out of the full walk.
- **`A2` (unmake restores exactly).** **Given** any node, **when** a move is made then unmade,
  **then** the key equals its value before the move — asserted over the same walk, **0 drift**.
- **`A3` (the en-passant component is right, and it is the one that will be wrong).** **Given**
  positions where an ep square exists **but no legal ep capture does**, and positions where both
  exist, **then** `A1` holds on both classes — with at least **one test case per class** drawn from
  `ADR-0005`'s own examples.
- **`A4` (castling rights, not availability).** **Given** a position where a rook is blocked but the
  right survives, **then** the key matches the oracle — `ADR-0006`'s rule, re-asserted here because
  this ticket is the first per-node consumer.
- **`A5` (it is actually cheaper, and by how much).** **Then** the report states measured per-update
  cost against the **295–304 ns** full-scan baseline, interleaved in one process, with machine and
  Node version. **Target: ≥ 5x cheaper per node.** Below that, stop and say so rather than ship a
  seam that bought nothing.
- **`A6` (nothing else moved).** **Then** `src/legal.ts` is byte-identical, the existing
  `zobristKey` export still exists with an unchanged signature, `src/zobrist.test.ts` and
  `src/zobrist.nfr.test.ts` pass unchanged, suite green, skip **0**.

## Dependencies

- **Architect/Design's ruling on the ep component and on threading — OPEN. Hard precondition.**
- **`ADR-0002`, `ADR-0005`, `ADR-0006` are ratified** and constrain this ticket. None is re-opened.
- **Blocks `ABC-081`** (transposition table) and is on the critical path for every depth number in
  this epic.

## Security / NFR triggers

- **`NFR-005`** — depth-in-budget on `kiwipete` / `position-6`. This ticket is a per-node cost
  reduction and is measured by `A5`'s **≥ 5x** bar, not by a depth claim.
- **`NFR-001`** — `legalMoves` calls per operation must not rise. **`A6`'s byte-identical
  `src/legal.ts`** plus the existing `zobrist.nfr.test.ts` guards are the instrument.
- **`N8-LANE` — ≤ 650 ms CPU**, inherited by name, same instrument and protocol.
- **Security — not triggered.** No input surface. **Firing threshold:** it fires if the diff touches
  any file outside `src/zobrist.ts`, `src/apply.ts` and their test files.

## Test notes

1. **The full-scan `zobristKey` is the oracle and must survive.** Deleting it to "clean up" removes
   the only thing that can prove `A1`.
2. **`A3` is where this ticket fails if it fails.** Write those cases first.
3. **Interleave `A5` in one process** against the pre-change tree, as `ABC-020` and `ABC-011` did —
   a cross-process timing comparison on this project has been wrong before.

## Size and priority rationale

**Size `M` (3).** One module, a well-defined oracle, a hard equivalence property, and a measurement
protocol this project already owns. **Not `L`:** the hard part — the ep rule — is a *decision*
someone else makes, not code this ticket writes.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It blocks the TT, and the audit names it as the single seam that does not extend.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** measured cost, named consumer, and the audit's own verdict quoted |
| 2 | scope and out-of-scope clear | **✅** four fences; the *what* of the key explicitly frozen |
| 3 | INVEST-shaped | **✅** independent of every other ticket in this epic; testable against an existing oracle |
| 4 | acceptance testable and measurable | **✅** six: 0 mismatches at depth 4, 0 drift, two named ep classes, a rights case, a **≥ 5x** cost bar, byte-identical `legal.ts` |
| 5 | dependencies known | **⚠️** the hard one — **Architect/Design's ep and threading rulings — is OPEN** and named |
| 6 | security/NFR triggers with a measurable target | **✅** ≥ 5x per-node, ≤ 650 ms CPU lane, `NFR-001` call-count guard |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **the ep-component design is genuinely unresolved** and is not BA/PM's. This ticket is `Blocked` until Architect/Design rules |
