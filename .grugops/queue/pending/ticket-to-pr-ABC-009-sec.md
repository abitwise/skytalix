---
task: ticket-to-pr-ABC-009
subtask: sec-abc009-nfr
role: security-nfr
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T12:48:39Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: review `ABC-009` and own the `In Security/NFR` exit

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Twenty-one notes are there. Two ordering warnings before you trust any `at` field: one note
(`20260809T141500Z-orchestrator-decision-865b06ae`) carries **local time labelled `Z`** and is
**superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`, whose §1 explains it. Get your own
`at` from `date -u`, never from a test runner's `Start at` line — this machine is UTC+3.

`In Security/NFR` is 1/2. The change is at `8f540cf`, hardened by QE at `15cf580`: two guard conditions
in `addCastlingMoves` (`src/moves.ts`, `+30 −8`), plus `src/moves.castling.test.ts` (33 tests, the
engineer's) and `src/moves.castling.hardening.test.ts` (19 tests, QE's). Suite 356/356 on 16 files,
skip 0.

## `NFR-001` is the substance of this hop, and you are the second measurer, not the first

The engineer produced **the first throughput figures anyone has measured on this ticket**: floor
6,078,622 / 6,131,325 / 6,151,559 nodes/sec against ≥ 1M, and ratio **0.9987 / 0.9974** against the
required ≥ 0.98 (three trees in one process, byte-identical twin as null control, 7 rounds, rotated
order, two samples). Deep lane 32/32 in 36.93 s; QE independently read 32/32 in 38.35 s.

**Re-derive on your own tooling** — that is what this gate did for `ABC-015` and `ABC-018`, and the
board expects it. Read `plans/nfr-catalog.md`'s standing benchmarking caution **and** its denominator
fence (97.3% of the nodes `npm run perft` counts are free leaves) before you measure.

**The engineer's own caveat is the part to engage with, not to repeat.** It read the
structurally-zero cells first: `position-3` and `position-6` hold no castling rights and `makeMove`
only ever clears rights, so the two new lines execute **zero** times there — true ratio exactly
1.0000, measured 1.0084 / 0.9918 / 1.0041 / 0.9989, with the identity twin reaching 1.0126. It
concluded the instrument's per-cell floor is **~±1%, larger than any signal**, and therefore claimed
**no per-cell number**, explicitly stating that kiwipete's 0.9930 is **not** a regression. Decide
whether that reasoning holds. If it does, say so — an honest "the instrument cannot resolve this" is a
result. If it does not, name what would resolve it.

**`NFR-005` is excluded structurally**: `zobristKey` → `hasLegalEnPassant` (`src/legal.ts:85-134`)
synthesises its own probe and calls neither `generateMoves` nor `legalMoves`, so the per-node key cost
is untouched by construction. **Do not re-run the key benchmark to "confirm" it.**

## Routed to you specifically by QE

**Guard ordering, as gate-unverifiable.** QE's `G-1`/`G-2` analysis turns on the fact that
`option.empty` runs *before* the through-check, so an unobstructed line always exists from the rook's
home square to the `kingPath` squares. QE used that to establish behaviour-equivalence for the
colour-blind mutant. Whether the *ordering* of the five guards is itself load-bearing — and whether a
later reorder could silently break the equivalence QE relied on — is not something the gate can
adjudicate. It is yours.

## Security classification — do not inflate it

Both the 2026-07-29 architecture audit and `ABC-022` classed this class **reliability, not security**:
no injection sink, no trust boundary, no privilege, no data exposure, and no user-supplied string
reaches `src/moves.ts`. QE's work did surface a worse *reliability* consequence — a plausible
mis-implementation destroys a queen silently, verified by the Orchestrator on a mutant tree — which is
still not a security consequence. `security.block_on` is `high` and `asvs_level` is `L1`. Re-ask the
question rather than carrying the answer, but do not manufacture a trigger.

## Known-open, so you do not spend the hop rediscovering it

- **Five criteria gaps QE closed in tests only** (`G-1`, `G-2` and three more). The **criteria text**
  is routed to BA/PM and is NOT yours — do not edit `## Acceptance`.
- **`A7` killed nothing across 62 mutants.** Also BA/PM's. Flagged here only so you do not treat it as
  a live safety net.
- **`ABC-022` half (b) is live by design.** This ticket fences it. Not a miss; do not test it here.
- **A `plans/traceability.md` rendering defect** in rows `ABC-011` and `ABC-015` (11 cells against the
  header's 10, caused by an unescaped `|` in a quoted shell pipeline) is flagged and deliberately NOT
  fixed — see the Orchestrator's note. Do not fix it here either; it is not this ticket's.

Publish typed notes per Workflow 16. **`finding` is not admissible on this task** — no §14 gate to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`. Nothing self-stamped, no
`index.*` hand-faked. The claim is by hand; `scripts/claim.js` does not exist in this install or the
kit (re-check rather than taking my word).

If you update `plans/nfr-catalog.md`'s `NFR-001` row, that is yours to own. Own the
`In Security/NFR` exit on `plans/board.md` and update your own row in `plans/traceability.md`. Never
merge to `main`, never deploy — a human holds both, and the owner's standing merge authority is not
deploy authority.
