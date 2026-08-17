---
id: 20260817T183556Z-orchestrator-observation-ready-for-dev-exit-review-three-gaps-and-one-ticket-held-back-5d2b7c81
kind: observation
by: orchestrator
at: 2026-08-17T18:35:56Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/perft.test.ts
  - src/render-seam.ts
  - src/zobrist.ts
  - AGENTS.md
supersedes:
---

# `Ready for Dev` exit review — ABC-076 and ABC-031. Three gaps, and ABC-076 is HELD BACK.

Process rule 1 (`AGENTS.md` § "Process rules (this project)"): before a ticket enters
`In Development` the Orchestrator re-reads its acceptance criteria **against the built tree** and
records the gaps found there. This is that record. It is not a Definition of Ready re-run — both
tickets scored DoR 10/10 on 2026-08-16 and 2026-08-12 respectively, and **the DoR is not what
failed.** The question here is whether the criteria still match what exists.

## `ABC-076` — GAP G1, and it blocks `A1` as written

**`A1` requires the symmetry property asserted over "≥ 40 positions drawn from `src/perft.test.ts`'s
set and their mirrors."**

**`src/perft.test.ts` contains SIX positions.** Counted from the file, not from any page:
`startpos` (:21), `kiwipete` (:27), `position-3` (:33), `position-4` (:39), `position-5` (:45),
`position-6` (:51). The seventh `fen:` a naive grep returns is the `interface` field declaration at
`:16`, not a position. **Six positions plus their six mirrors is TWELVE pairs. The criterion asks for
≥ 40 and its named source cannot produce them.** `A1` is unsatisfiable as written.

**This is not my inference against one page — the repository contradicts itself and I can name which
side is right.** `ABC-031` `A5` cites the same corpus as **"each of the six positions already in
`src/perft.test.ts`"**, and its `## Dependencies` says **"the six perft positions"**. Two tickets,
one corpus, two counts. **`ABC-031` is right and `ABC-076` `A1` is wrong.**

**What I did NOT do: pick the fix.** There are at least two, and they are not equivalent —
(a) restate the bar at the corpus's real size (≥ 12 mirrored pairs), or (b) widen the corpus, since
"drawn from" may have meant positions *derived* from those six rather than the six themselves. **(a)
weakens the property, (b) preserves it and costs more.** Acceptance criteria are BA/PM's, not mine
and not the engineer's, so this is routed there rather than guessed at.

**Verified and NOT a gap, recorded because a reviewer will re-check them:**

- *"Nothing in merged `src/` scores a position — there is no `eval` module and no scoring function
  anywhere."* **TRUE.** No `centipawn` or `pieceSquare` token exists anywhere under `src/`; every
  `evaluate` hit is prose in `turn-loop.ts` / `status-panel.ts` / `render-seam.ts` about the loop's
  per-ply terminal derive, unrelated to scoring.
- *`A5`'s premise that `zobristKey` transiently mutates the position it reads.* **TRUE**, and the
  codebase says so itself at `src/zobrist.ts:14`. The byte-identical assertion is warranted.

## `ABC-031` — GAP G2, prose drift; it blocks nothing

**The ticket states: "Measured 2026-08-12: no non-test file in `src/` imports `turn-loop.ts`."
FALSIFIED at today's tree.** `src/render-seam.ts:45` reads
`import type { RenderSeam } from "./turn-loop.ts";` — a non-test file under `src/` importing
`turn-loop.ts`.

**The measurement's stated form is dead; the conclusion it was cited for survives, and the
distinction matters.** The import is `import type`, erased at compile time, so there is still **no
runtime production path into the turn loop** — which is the thing the *Pain* paragraph was actually
arguing. **A later reader who re-runs the quoted measurement will get a different answer than the
page promises**, which is precisely the drift class rule 1's exit review exists to catch. Repair is a
one-line restatement ("no non-test file imports it *at runtime*"), owned by BA/PM.

## `ABC-031` — G3, an ordering note rather than a defect

**`SanParseResult` does not exist in `src/`.** `ABC-031`'s scope says its three outcomes match
"`ADR-0004`'s `SanParseResult` shape". That type is defined **only in the ADR**
(`memory-bank/50-decisions/ADR-0004-san-ownership.md:188`) and lands in code with `ABC-032`, which is
still in `Backlog`. **Nothing is wrong** — the ADR is the contract and `ABC-031` correctly declares
itself independent of `ABC-032` — but the engineer must **define the result type in the new module
rather than hunt for an importable one**, and must match the ADR's arms exactly so `ABC-033` later
dispatches over one shape. Recorded so a hop does not burn a cycle looking for it.

**Verified and NOT a gap:** `legalMoves` at `src/legal.ts:42` as cited; `addPromotions` in
`src/moves.ts` pushes one move per promotion piece with identical `from`/`to`, so `A2`'s "exactly 4
candidates" premise holds; `ADR-0004` exists.

## The decision this review produces

| ticket | verdict | reason |
|---|---|---|
| **`ABC-031`** | **PULL to `In Development`** | its one gap is stale prose, blocks no criterion, and repair is independent of the build |
| **`ABC-076`** | **HELD at `Ready for Dev`** | `A1` cannot be satisfied from its named source; building against it schedules a known QE failure |

**Holding `ABC-076` is the cheaper error.** The alternative is dispatching an engineer to satisfy a
criterion whose corpus does not exist, then discovering it at QE — which is exactly the loop rule 1
was adopted to shorten. The unblock is small and routed to BA/PM in the same hop, so the ticket is
not parked.

## What this says about rule 1's control — stated narrowly, because that control is under dispute

This hop records **three gaps at the `Ready for Dev` exit, one of them criterion-blocking.** Per rule
1's control that arm should RISE, and here it did. **It does not follow that the control is working.**
BA/PM measured that control on 2026-08-17 and returned **INDETERMINATE — NOT COMPUTABLE AS WRITTEN**,
finding the QE and exit arms to be disjoint populations; re-specifying it is escalation #2, still open
with the owner. **This note contributes a data point to a control that cannot currently consume it**,
and it is recorded that way deliberately rather than as evidence of a rule succeeding.
