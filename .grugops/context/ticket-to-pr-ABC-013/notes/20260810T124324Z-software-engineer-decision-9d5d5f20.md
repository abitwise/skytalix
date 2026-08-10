---
id: 20260810T124324Z-software-engineer-decision-9d5d5f20
kind: decision
by: software-engineer
at: 2026-08-10T12:43:24Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - NFR-002
  - src/san.test.ts
  - src/san.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# Two test-shape decisions: `A21`'s in-suite half is a CALL COUNT, and the table gets two table-free properties underneath it

## 1. `san.nfr.test.ts` asserts call counts, never microseconds — and that is this repo's rule, not my preference

`A21` reads *"the cost bars hold, measured by their own stated method at the position they name, on
the machine class they name"*. `N2`/`N3`/`N4` are wall-clock bars on named hardware. **They are not
put in the suite**, and the reason is written down twice in this repository already:

- `src/gameend.nfr.test.ts`: *"These are CALL-COUNT bars only. Wall-clock cost is not asserted
  anywhere in this suite — it is machine-dependent, and it is measured with its machine and recorded
  in `plans/nfr-catalog.md`."*
- `src/glyph-mode.nfr.test.ts`: *"this project's standing rule keeps microseconds in
  `plans/nfr-catalog.md` with the machine that measured them."*

A µs assertion in `npm test` would be a flake on any other machine and would make `quality.
gate_enforcement: blocking` bind on the CI host's load. So `A21` is split the way this project
already splits every other NFR criterion: **the wall-clock half is measured out of tree** (numbers
in the gate note, all four bars hold) **and the in-suite half is the mechanism that makes the bar
achievable**, spied.

The four counts asserted are in the implementation note. `N1` is the primary bar precisely because
it is a ratio, and a ratio between two wall-clock means is a call-count claim wearing a clock — so
asserting the counts asserts more of `N1` than a timing test would, on every machine.

**Measured, and this is why the file earns its place:** two of my ten self-mutations — a build that
ignores the supplied `legal` list, and one that runs the mate test on every move — return
**byte-identical strings for all 52 rows** and are caught by nothing else in the suite. That is the
`plans/nfr-catalog.md` lesson ("a measurement is not a guard") reproducing itself on this ticket.

## 2. Two TABLE-FREE properties beneath the acceptance table

Workflow 04 step 3's contract-vs-logic seam says the acceptance layer asserts the observable
outcome and the unit layer asserts the logic beneath it, never re-asserting the same outcome. The
acceptance layer here is 52 hand-typed strings. **What a hand-typed oracle structurally cannot be is
a check on itself**: if the table were wrong in a consistent direction it would still be
self-consistent and green.

So the inner layer is two properties that name no expected string, over 184 positions nobody chose
for SAN — the six standard perft positions and every position one legal move away from each:

- **Injectivity.** Every legal move of a position renders to a **distinct** string. This is what
  disambiguation is *for*, stated without an oracle: two legal moves that render alike are a move a
  reader cannot name and `EPIC-003`'s parser cannot resolve. It falsifies an under-qualifying build
  on positions nobody picked for it.
- **Grammar shape.** Every string matches the SAN shape (castle / piece+optional qualifier / pawn
  with optional origin file and promotion, each with an optional suffix). A shape check, not a
  validator — it cannot tell `Nbd2` from `Ncd2` and is not asked to.

Both were **green when written** (the implementation was already complete), so neither is a kill and
I do not report them as one. Their value was demonstrated by mutation instead: injectivity
independently kills "no disambiguation at all" and "pawn capture loses its origin file", and the
grammar check kills the second. That is non-vacuity by measurement rather than by assertion.

**What they deliberately do NOT assert: minimality.** A build that always emitted the full origin
square would pass both properties. Minimality is the table's job — `A1`, `A2`, `A7`, `A8`, `A11` and
the two cheaper rungs of `A6` — and the two layers are complementary rather than overlapping. That
is the seam, and it is the reason neither layer alone would do.

## What I did not add

- **No round-trip test.** It needs `parseSan` and belongs to `EPIC-003`; `ADR-0004` clause 2b fixes
  its exact form (reference identity against ONE shared legal list) and the rows here are shaped so
  that hop extends them.
- **No perft-wide purity or `legal`-equivalence sweep.** `A18`/`A19` already quantify both over the
  18 named positions and every legal move of each, in both call forms. Widening them would be width
  without a new question.
- **No test of behaviour on an illegal `move`.** `## Scope` declares it undefined and asserts
  nothing; a test would be inventing the contract.
