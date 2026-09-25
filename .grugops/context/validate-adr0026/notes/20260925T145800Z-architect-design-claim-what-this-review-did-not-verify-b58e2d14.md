---
id: 20260925T145800Z-architect-design-claim-what-this-review-did-not-verify-b58e2d14
kind: claim
by: architect-design
at: 2026-09-25T14:58:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ADR-0026
  - ABC-121
  - NFR-005
  - N8-LANE
supersedes:
---

# What this review did not verify

Hand-authored, no `seal`.

1. **The wrong-LMR variants are mine.** They are six plausible bugs, not an exhaustive mutant
   set. A wiring bug of another shape could slip past every row, amended or not. An example is a
   reduced search with a wrong window sign.
2. **The probe is still not the build.** Every reading uses the ruling's probe copy of the
   recursion. The Engineer's LMR wiring may differ legitimately, and `ABC-121`'s gate
   re-measures it.
3. **The 3 s node capacity (892 682 / 853 278) was not re-measured.** The load was 60–122 from
   parallel hops, so a wall-clock reading would mean nothing. I re-did only the division.
   `NFR-005` is Security/NFR's to read.
4. **The mate-rich corpus is one construction:** two plies around seven KQK/KRK FENs. It holds
   only rook and queen mates against a lone king, with no middlegame mates. It is deep-lane
   sized; its default-lane subset and cost against `N8-LANE`'s 650 ms are unmeasured.
5. **"LMR drift is mostly optimistic for the side to move"** is read from the worst-5 lists at
   d4/d5, not from a signed statistic over the whole corpus.
6. **The queue claim was taken inside this hop's own worktree** (a bare `mkdir`), as the dispatch
   ordered. It does not exclude a claimant in a different checkout, which is the same caveat as
   the ruling's `…0f93c6b1` item 7.
