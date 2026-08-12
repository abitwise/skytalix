---
id: 20260812T101600Z-software-engineer-observation-a-published-note-says-the-opposite-and-measurement-says-it-is-wrong-9d0ce4b2
kind: observation
by: software-engineer
at: 2026-08-12T10:16:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.nfr.test.ts
supersedes:
---

# A published note in the parent context says the opposite of what I measured — flagged, not propagated

## The sentence

`.grugops/context/ticket-to-pr-ABC-028-a5/notes/…-red-before-green-the-kill-matrix-either-side-of-a5-…md`,
last paragraph:

> *"A cache keyed on the last **three** identities still has no owned guard, and rebuilding the nfr
> fixtures per test would still lose nothing for it, because it was never caught there either."*

The first clause is **TRUE and I confirm it** — `src/history-pane.test.ts` alone passes `26/26` on that
build. The rest is **FALSE as measured on this tip:**

```
WCACHE-LAST3, full suite, nfr fixtures SHARED      2 failed / 752   <- the A11 toSan counts, and nothing else
WCACHE-LAST3, nfr fixtures REBUILT PER TEST        752 PASSED       <- the guard is GONE
```

**Rebuilding loses a guard. The build was caught there — by exactly the mechanism the whole ticket is
about.** The `A11` count assertions do not care how deep a cache's key is: they re-render the
module-scope `AT_*` singletons **unchanged**, so *any* memoising pane HITs, calls `toSan` zero times,
and reads `0` where `16` is expected. Depth of key is irrelevant to a repeat render of the identical
object — which is why the sharing catches every rung of the axis and the owned guards catch three.

## Why this is worth a note rather than a shrug

This is **the fifth occurrence of `## Test notes` 1's pattern on this family, and the first inside an
Engineer's own context note.** The count so far, all on the same claim: `ABC-017`'s merged text, the
file comment at `:106-112`, BA/PM's `P1` re-derivation (*"the sharing genuinely is no longer
load-bearing"*, struck by its own author), the comment's `:106-108` and `:118-120` — and now this. The
shape never varies: **a measurement that is real but narrower than the generalisation drawn from it.**
The `A5` hop measured three rungs correctly and then wrote one sentence about a rung it had not run.

**I did not propagate it.** The comment I wrote says the sharing IS still load-bearing, with the cell
that proves it. Had I trusted the note over the measurement, the repaired comment would have carried
the same false sentence for a fourth time in the same file.

## What I am NOT doing about it

The note is another hop's published output. **I have not edited, superseded or annotated it** — this
`observation` and the traceability row are where the correction lives, and the correction is
**recorded, not taken.** Its author's conclusion for that hop (`A5`'s table closes `WCACHE-LEN`,
`WCACHE-LAST` and `WCACHE-LAST2`, and the row is the unit of extension) is **unaffected and was
independently re-measured green here** — the ladder in my sibling note reproduces all three of its
cells exactly. **One aside is wrong; the hop's work is not.**

**Owner of the correction:** whoever next writes into `refinement-ABC-028-*` or gates `ABC-028`. No
date — latent, and recorded as latent.
