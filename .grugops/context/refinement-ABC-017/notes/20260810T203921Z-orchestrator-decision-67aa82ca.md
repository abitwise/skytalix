---
id: 20260810T203921Z-orchestrator-decision-67aa82ca
kind: decision
by: orchestrator
at: 2026-08-10T20:39:21Z
verified_by: 
confidence: high
refs:
  - ABC-017
  - ABC-016
  - ABC-026
  - NFR-002
  - NFR-008
  - EPIC-002
supersedes: 
---

# The hold on `ABC-017` is discharged — promote it or refuse. Task `refinement-ABC-017`, branch `grugops/refinement-2026-08-10`

Earlier today I held `ABC-017` for one stated reason: it and `ABC-016` are the two tickets in
`ABC-026`'s own promotion trigger, and spending that trigger before the lane total existed was the
sequence `ABC-026` was cut to prevent. **The lane total now exists — `NFR-008`, seeded at
`refinement-ABC-026`. The hold's condition is met and the hold is over.** I said the unblock would be
named so the sweep could not lose it; this is that unblock, on the same day.

## Two things this hop inherits that did not exist this morning

1. **`N8-LANE`** — the standing per-ticket lane bar from `ADR-0008`. `ABC-017` **inherits** it and
   **must not re-derive a lane bar of its own**. Per-ticket bar invention has now cost this board two
   ruling hops (`ABC-025`'s `N5`, and `ABC-016`'s `250 µs` this morning). The whole point of a
   standing bar is that a ticket author stops writing one.
2. **The `NFR-002` rewrite this ticket asks for is NOT owed, and the flag was already stale when it
   was written.** Verified in git rather than asserted: the rewrite landed at `92046f9`
   2026-07-31T09:55:05, **nine and a half hours after** `ABC-017` was cut at `03b0a65` 00:27:21 the
   same day. Architect/Design struck the bullet in place and left the `NFR-002` table row
   byte-identical. What `NFR-002` still owes this ticket is a **measurement**, not a rewrite.

## What I am NOT claiming about this ticket

`ABC-017`'s own DoR block reads clean on all ten checks. **I am not endorsing that.** This morning I
pre-checked `ABC-016` — whose DoR block also read clean on all ten — and named two defects; BA/PM
found **sixteen**, fourteen named by nobody, four witnessed by wrong builds it constructed and ran.
That is the fourth consecutive ticket where a clean-looking DoR block concealed defects at roughly an
order of magnitude above any pre-check. A clean self-assessment is the *starting* condition for this
hop, not evidence about its outcome.

I am deliberately not listing my own flags this time. On `ABC-016` my two flags were both real but
one was right for the wrong reason — I called the `250 µs` bar estimate-derived, which it was, while
missing that its derivation had also omitted the dominant term and over-priced `isInCheck` by 30–50x.
A short list from me has repeatedly functioned as an anchor. The checklist and the source are the
inputs; my guesses are not.

## Two things worth knowing that are specific to this ticket

- **`ABC-016` changed a shared fact this morning.** Its item 7 was going to call `gameStatusOf` per
  frame — a second full repetition derive, `O(plies)` — and that was reversed into an input. The
  structural fact `NFR-002`'s `O(window)` claim rests on is that **nothing pulls the repetition
  derive into a frame**. `ABC-017` is the other half of the same frame. Whatever it specifies must
  not reintroduce what `ABC-016` just removed.
- **This ticket's `40/120/300`-ply cost criterion is the one that proves `O(window)`**, and it is
  stated as a ratio precisely because the absolute is machine-dependent. That is good practice and it
  predates both `N5` and `N8-LANE`. It is worth checking whether the ratio bound survives contact
  with the per-file floor now that the floor is characterised as a curve.

## Limits

Width 1 of 3. `Ready` is 1/8 and would be 2/8 on a promotion — no limit approached. No `src/` write;
this is refinement. Never merge, never deploy.

**`ABC-026`'s remaining BA/PM hop — its acceptance criteria — is deliberately NOT enqueued alongside
this one.** Those criteria would be written against `NFR-008`'s level, which is `PROVISIONAL` and
whose ratifier is the owner. Writing acceptance criteria on top of an unratified number is the
building-on-sand pattern this board keeps catching; it waits for the ruling.
