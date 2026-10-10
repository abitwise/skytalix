---
id: 20261010T090235Z-software-engineer-decision-abc051-wording-of-the-rule-and-the-spy-a684650d
kind: decision
by: software-engineer
at: 2026-10-10T09:02:35Z
verified_by:
confidence: high
refs:
  - ABC-051
  - ADR-0021
  - ABC-019
  - ABC-021
  - NFR-002
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# `ABC-051`: how each site was repaired, and what was deliberately left alone

Hand-authored, no seal (degraded posture, `AGENTS.md`). Code commit `5451323` on `grugops/ABC-051-r2`.

1. **Site 2 is a separate paragraph, not a rewrite.** The original sentence keeps its words. It
   gains one word: "eighteen **NUMBERED** transitions". A new paragraph follows it with the three
   things `A3` requires:
   - (i) the source: `ABC-019` `## Scope`'s numbered rows 1-15, `ABC-021`'s 16, and `ADR-0021`
     clause 5's 17 and 18;
   - (ii) that the count is "the enumeration's, not one row per trigger";
   - (iii) that the refused claim's edge to `rendering` "IS NOT ONE OF THE EIGHTEEN", because clause
     5 lists it unnumbered.

   It also says the by-trigger count gives 19, and that adopting that count would amend the clause.
   So it names the alternative rather than hiding it. Nothing contradicts `ADR-0021`, so Test note
   5's route-to-Architect condition did not fire. The `:287-290` "one outcome, two edges" paragraph
   is untouched.
2. **Sites 3/4 now state what the spies prove, rather than only narrowing the claim.** The header
   keeps the honest-limit sentence (`:21-22`) word for word. It moves the cite to `history.ts:153`.
   The conclusion becomes "`repetitionCounts` and `keyHistory` at 0 prove the loop adds no replay
   of its own to a PLY". It then states the one derive the loop does make (`keyHistory` in
   `claimShortfall`, on a refused claim, per command) and points to merged `A8` as the place that
   ledgers it. That covers why this file does not assert it, and why the spy exists. Rejected
   alternative: dropping the sentence. A spy with no stated reason invites the next reader to delete
   it.
3. **The spy is `keyHistory: vi.fn(actual.keyHistory)` inside the existing factory.** It is
   imported in the existing `await import("./history.ts")` destructure. It is asserted at 0 directly
   after each existing `repetitionCounts`-at-0 line, in both existing `it` bodies. There is no new
   `it`, `describe` or helper.
4. **Site 5's name is "derives ZERO times on a `rejected` prompt outcome".** The counts `41`/`0`
   are unmoved, and the body comment at `:139-140` is untouched. That comment speaks of transitions
   7, 8 and 9 as a class, and it is true.
5. **The stale line citations in other `src/` files were left alone.** See the companion
   observation. Every one was already wrong at base, and they sit outside the two-file fence.
