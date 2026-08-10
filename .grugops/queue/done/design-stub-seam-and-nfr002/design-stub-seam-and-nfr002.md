---
task: frame-merge-order-2026-08-11
subtask: design-stub-seam-and-nfr002
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/design-stub-seam-and-nfr002/
parent_ref: .grugops/context/frame-merge-order-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T00:00:00Z
branch: grugops/frame-merge-order-2026-08-11
---

# Subtask: the THIRD constant site, and an `NFR-002` bar its own boundary block refutes

Two items. `ADR-0009` is yours, accepted this round — extend it or write a successor, your call.

## 1. The stub seam is a third hardcode site, and `ADR-0009` was scoped to two tickets

The owner directed that `ABC-019` be **built in parallel against stub panels** and merged last. A stub
status panel returning 3 rows and a stub history pane returning 8 rows is a THIRD site for
`STATUS_ROWS` and `HISTORY_ROWS`, in a third file, with nothing tying the sites together — the same
`D13` class `ADR-0009` exists to close, propagating rather than inheriting.

`ADR-0009`'s "producer owns its count" plus the delivered-code fit-check **plausibly** covers this.
Plausibly is not ruled. Rule it. The question: where do these constants live such that the real panels,
the stub panels and `frameHeight` all reference ONE definition — and does a stub panel satisfy
"producer owns its count" or subvert it?

This was owed to your previous hop and could not be delivered to it: the Orchestrator attempted to
widen the ruling mid-hop and `SendMessage` is not enabled in this session. Not your predecessor's miss.

## 2. `NFR-002`'s boundary block contains the refutation of the bar beside it

Flagged by BA/PM at `refinement-ABC-019`: the catalog's own `NFR-002` boundary block reads **97–102 µs**
for the same quantity as the `≤ 100 µs @ 120 plies` bar it sits beside — i.e. the correct build sits at
or over the bar. Measured that hop: a **two-derives-per-ply** build reads **93.58 µs @120 = 0.94x and
MEETS** the bar that exists to forbid exactly that double derive, while the correct build reads 0.97x at
300 plies. The bar cannot catch what it was written for.

`ABC-019` has already added `≤ 45 @40` and `≤ 200 @300` and made a spied call count binding, so the
per-ticket bar is handled. What is unresolved is the **catalog row's own** coherence. Re-derive or
re-scope it. `NFR-002`'s `< 16 ms` frame target was untouched by that hop — say explicitly whether it moves.

You may write `plans/nfr-catalog.md`, `memory-bank/50-decisions/` and `plans/traceability.md`. You may
NOT write `plans/board.md` (the Orchestrator's) and NOT `plans/tickets/ABC-016-*.md` or `ABC-017-*.md`
(a concurrent BA/PM hop owns those this wave). Flag, do not take. Zero production lines expected.
