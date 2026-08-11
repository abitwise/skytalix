---
id: 20260811T200000Z-orchestrator-decision-c4e7b90d
kind: decision
by: orchestrator
at: 2026-08-11T20:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-019
  - ABC-027
  - ADR-0010
supersedes:
---

# `ABC-027` delivered; `In Development` → `In Review`, and QE released on it immediately

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it — the standing correction from
> `.grugops/context/abc016-qe-gaps-2026-08-11/notes/…failed-attempt…`.

## Verified, not accepted

| claim | how | result |
|---|---|---|
| gates | re-ran all four **after rebasing** onto `main` | lint/typecheck/build **0**, **681/681 on 22 files**, skip **0** |
| production change is minimal | read the `src/frame.ts` diff | one join separator, one constant, one header sentence — **the padding claim is KEPT**, only the false clause replaced |
| characterization replaced not deleted | read `src/frame.test.ts` | title `DISCHARGED by ABC-027…`, **both width assertions survive byte-for-byte** (`24` / `18`), expectation flipped to `[]` |
| boundary | `git diff --name-only` | no `status-panel`, no `turn-loop`, no `board.md`, no catalog, no ADR |

## What the Engineer did that I want on the record

**It refused to inherit BA/PM's witness table** — *"a criterion I never saw fail is a criterion I
cannot report on"* — and re-ran all three mutants on its own branch. That includes the degenerate
fixture, which fails `A2` and `A3` rather than passing vacuously. This is the third role this round
to re-measure rather than transcribe, and the second to say so in those words.

It also kept the erase **out of the trailing position** with a stated reason: redundant under
`\x1b[0J`, and a trailing one would break `:419`'s slice arithmetic and `A1`'s count. That is the
kind of detail that silently rots a suite two tickets later.

## The board move, and QE released without a hold

`ABC-027`: `In Development` → `In Review`. In Development 2/3 → **1/3**, In Review 1/3 → **2/3**.

**QE runs on it immediately — no hold.** I have held QE twice this round, both times because the
criteria were about to move. That condition is absent here and I am naming why rather than applying
the precedent reflexively: `ABC-027`'s six criteria were written by BA/PM **by building the change
first**, and the Engineer then re-derived every one against three mutants without amending any. There
is no pending ruling that could shift them. Holding QE here would be cargo-culting a decision whose
reason does not apply.

## A WIP note the Engineer raised, and the arithmetic it did not have

It flagged that In Review would go 2/3 → 3/3 and warned the column would be full. **It read the board
before `ABC-016` moved back to `In Development`.** Actual: In Review 1/3 → 2/3. No pressure, no
override needed. The flag was right to raise on the information it had, and I am recording the
correction rather than letting a wrong number sit in the context.

## Merge order

Unchanged: `ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`. `ABC-027` merges **second**, so it will
wait in `In Review` for `ABC-016` regardless of when QE finishes. That is the cost of the ordering
and it is already priced in.

## Two flags carried, both re-confirmed by this hop and neither dispatched

`ADR-0010`'s `## Consequences` (three → five test changes; the false *"first narrowing fixture"*
clause) is now confirmed by **three** roles — Architect-adjacent, BA/PM and the Engineer. It stays
Architect/Design's, still queued, still undispatched: it is documentation accuracy on an accepted ADR
whose **ruling is unaffected**, and there is no free slot that would not displace work in flight.
Epic `4b`'s row-worded clause stays BA/PM's, conditional on a reading `ADR-0010` declines.
