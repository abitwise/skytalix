---
id: 20260815T170000Z-orchestrator-observation-adr0011-amendment-foundation-checked-8c41e77b
kind: observation
by: orchestrator
at: 2026-08-15T17:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ADR-0011
  - ADR-0002
  - G6
  - D1
supersedes: 
---

# I checked the foundation of the `ADR-0011` amendment, because an ADR amendment is the one artifact a coordinator should not wave through

## Why check at all

Architect/Design amended `ADR-0011` clause 3 — a design rule, on a held ticket, in a way that **moves
exactly one verdict and it is the shipped one (`cli.ts`)**. It said so itself rather than burying it.
That is precisely the shape that deserves a check: an amendment whose only behavioural consequence is
that the thing already built now passes.

Its defence is that this moves a **description** that was never the property, not the **property**
itself — and it offered a separating test and three textual grounds. **Ground 1 is checkable in one
command, so I checked it.**

## What I verified

Architect claimed clause 3's admission sentence **misattributes a requirement to `ADR-0002` clause 4**,
which it says constrains who *builds* the map, not who *imports* the module.

`memory-bank/50-decisions/ADR-0002…:146-147`, read directly:

> **4. `gameStatus`'s `positionCounts` gets exactly one supplier: the history module.** No other
> caller constructs that map. The signature does not change.

`grep -ci "import\|driver"` over that clause: **0**.

**The claim holds against the text.** Clause 4 constrains construction of the map. It names no driver
and says nothing about imports. The sentence in clause 3 that leaned on it was leaning on something
that was not there.

I also confirmed **`D1` is real and not hypothetical**: the struck sentence's restatement is live
verbatim at `src/history-pane.nfr.test.ts:196-199`, in the docblock a hop adding a third licence entry
would read first. Architect flagged it rather than fixing it, correctly — `A12` bounds that file.

## What I did NOT verify
Grounds 2 and 3 (that `ADR-0002` clause 2 puts *"owns the game"* on the importee, so a strict reading
leaves the licence set **empty** and `turn-loop.ts` unlicensed; and that the equality cannot catch a
*wrongly* licensed importer). **Both are reasoning about consequences, not citations, and checking
them properly means re-deriving the design argument — which is the role's work, not the
coordinator's.** I am relying on them; this line records the reliance.

## Boundaries confirmed by measurement
`git diff --name-only 59ea767 grugops/design-ABC-042-adr0011-clause3 -- src/` → **0 files.** The hop
wrote the ADR and its notes and nothing else. Zero code, zero criteria, as instructed.

## What this does not change
The amendment rides the held ticket's branch line and is **not on `main`**, like every other artifact
from these hops. `G1` is untouched and remains the owner's. `Q3` is routed to a **new ticket**, not
made — Architect priced it at `XS` and named `A12` as the reason it cannot land here, which is the
answer I told it to expect and it should not be read as my having supplied the conclusion: it also
supplied the mechanism, the site, and the owner split (criterion BA/PM, instrument Engineer,
residual `R5` Architect).
