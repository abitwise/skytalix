---
id: 20260812T064600Z-ba-pm-decision-a4-written-on-a-proved-instrument-66ffcac5
kind: decision
by: ba-pm
at: 2026-08-12T06:46:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - RISK-ABC028-01
  - RISK-ABC017-03
  - ABC-017
  - NFR-008
  - ADR-0008
  - EPIC-002
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - src/position.ts
  - src/history-pane.test.ts
supersedes:
---

# `A4` is written, and it is written to be FAILABLE rather than comprehensive

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository (there is no `scripts/`
> directory at all), `scripts/claim.js` does not exist either, and `mcp__grugops__propose_note` is not
> in this session's tools. `context.human_admission` is `off` and **no §14 gate ran on this hop**, so
> **nothing here is recorded as a `finding`.** Confidence `high` refers to the reasoning and to the two
> facts I re-read at source; it is not an admission status.

## What `A4` now says

The old text was an **absolute** — *"no reachable slot of the supplied `GameHistory` differs at any
point during the render"*. **It is replaced, not extended.** No instrument can hold that absolute for a
synchronous callee: a callee is observable only where it touches instrumented state.

The criterion now states the **two properties that were actually measured**, as four clauses that must
all hold **at every one of `ABC-017` `A1`'s ten lengths**:

1. **zero writes recorded** — every write reaching the supplied graph through the reference the pane
   was handed is reported at the instant it happens (so a restore-before-return is still on the
   record), count exactly `0`;
2. **the board's 128 bytes never differ at a sampling point** — `position.board` re-compared at every
   access the pane makes through the view;
3. **the instrument LOOKED** — the sample counter is `> 0` at every one of the ten lengths;
4. **the instrument changes no rendered byte** — the tripwire, at ONE length (20 plies).

Plus **arming PER SLOT across eight named slots** (`initialFen`, `fullmoveNumber`, `blackToMove`, a
board element, the board through `.buffer`, the `moves` slot, the `moves` contents, a `Move` field) and
a **positive control** (a clean run reports nothing).

**Given** is the **shared** `LENGTH_CASES` at `src/history-pane.test.ts:139-154`, not fresh objects:
`A4` asserts a property of its own render, so `D23` does not reach it, and a rebuild costs
~9.8 ms warm / ~20.3 ms cold against a ~75 ms ticket margin. **The arming controls, by contrast, MUST
use fresh fixtures** — four of the eight do not restore.

## The three decisions inside that, each with its rationale

**1. Not an absolute.** Stated above. The property is *"every write that reaches the supplied graph
through the reference the pane is given is reported, and the board's contents are sampled at every
access"*, which is strictly more than `A9` holds today and covers every slot the ticket's table names.

**2. Arming is PER SLOT, not in aggregate.** The old text asked for *"a control"*, singular. Per-slot
is the only version that would have caught the pre-fix bug in QE's own instrument, where a
TypedArray-method board mutation threw `TypeError: this is not a typed array` and recorded **zero**
violations — *"instrument broken"* announced where the truth was *"property violated"*.

**3. The property is stated ONCE over the graph.** It covers `position.castling`, `position.epSquare`,
`position.halfmoveClock` and every `Move` field at no extra cost — slots no table in the ticket named.
That is what `## Test notes` 1 asked for, and it is the thing that stops the fifth per-slot repair.

## `RISK-ABC028-01` — recorded IN THE TICKET, not only here

**`WBOARDBLIND` survives `A4` and is accepted.** It mutates `position.board` through an `ArrayBuffer`
alias and reverts it with no intervening graph access, so no sample falls inside the window. It is
recorded as a **named subsection of `A4` itself** in
`plans/tickets/ABC-028-history-pane-unreached-input-classes.md`, carrying: what it is, its measured
verdict (`clean` at all ten lengths; `748 passed (748)` on the lane), why it is not closable by a
better proxy, the three rejected closures with reasons — **one of which, copying the `ArrayBuffer`,
would report GREEN on the wrong build** — the fact that it is **not one of the five builds `A4`
names**, and a **standing obligation to re-run it on any instrument change**.

**Deliberate placement.** A hole that lives only in a context note is a hole the next hop does not
read. The ticket is where the build hop looks.

## The `Uint8Array` correction — measured at source, conclusion unmoved

The ticket, the board row and the traceability row all said `Object.freeze(new Uint8Array(8))`.
**`src/position.ts:76` reads `board: new Uint8Array(128)`** — I read it at source at this hop rather
than taking QE's number. (QE's note cites `src/position.ts:75`; the `new Uint8Array(128)` literal is on
**line 76**. Same construct, off-by-one in the citation.)

**The conclusion does not move**: `Object.freeze` throws `TypeError: Cannot freeze array buffer views
with elements` at `1`, `8` and `128` alike, and returns without throwing only at `0`. Corrected in the
ticket and appended to the traceability row. **Two sites deliberately NOT corrected** — `plans/board.md:101`
and `plans/tickets/history/ABC-017-board-history.md:42` — because the board and its history are the
Orchestrator's. **Two more sites are immutable by contract**: the `refinement-ABC-017-cut` context note
and the `done/` queue record are append-only audit trail. `ABC-016`'s `R1`/`D27` is the precedent for
auditing a repair at every site it points at rather than only the site it names, so all five are listed
rather than the one I fixed.

## What is adopted, and what is NOT mandated

QE's ~125-line worked implementation
(`.grugops/context/quality-gate-ABC-028-instrument/artifacts/a4-instrument-and-criterion.ts.txt`) is
**adopted as the criterion's EVIDENCE, explicitly not as its implementation** — the ticket says so in
those words. **The mechanism is the Engineer's.** Any instrument satisfying the four clauses, the eight
arming controls and the positive control discharges `A4`; a different mechanism owes the same
measurements, including `WBOARDSET` and `WBOARDBUF`.

**I did not write the test**, and no file under `src/` was written at this hop.

## Two builds added to the ticket that it never asked for

`WBOARDSET` (board mutated by TypedArray method) and `WBOARDBUF` (board mutated through an
`ArrayBuffer` alias) are **new named discriminating builds with required verdicts**. Both **survive
744/744 today**. They are in the ticket because they are the two shapes that would have made a
write-trap-only instrument a false green.
