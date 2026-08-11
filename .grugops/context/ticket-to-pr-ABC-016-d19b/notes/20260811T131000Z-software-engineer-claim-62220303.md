---
id: 20260811T131000Z-software-engineer-claim-62220303
kind: claim
by: software-engineer
at: 2026-08-11T13:10:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-016
  - A13
  - src/status-panel.nfr.test.ts
supersedes:
---

# TWO things in `src/status-panel.nfr.test.ts` that the `A13` ruling left behind — FLAGGED, not fixed

> **Hand-authored.** A `claim` rather than an `observation` on purpose: the *facts* below are read at
> source and are not in doubt, but the assertion that either is **worth changing** is a judgement
> about a criterion that was ruled by somebody else four hours ago, and it is not gate-adjudicable —
> a gate can run what a criterion says, never judge how a test file describes it.
> `confidence: UNKNOWN - verify` is on the disposition, not on the readings.

BA/PM's ruling asked that `src/status-panel.nfr.test.ts` come back **untouched** from this hop, and
it has. I read it anyway, because I was told `A13` is met on that file and I do not report "met" on a
file I have not re-read. Both halves are there exactly as ruled — the direct half at **`:130-132`**,
the difference half at **`:140-149`**. `A13` is met. These two items do not change that.

## 1. The comment at `:134-139` now describes a criterion that no longer exists

Verbatim, the operative sentence:

> *"See the ticket flag raised at this hop: `A13` says "exactly 1" for the total, which no build
> satisfying items 2 and 4 together can reach on a non-empty history."*

`A13` no longer says that. It was replaced this morning with the two-halves wording, and BA/PM's
ruling states the consequence plainly: *"the delivered test stops being a stated departure from the
criterion and becomes the criterion."* The comment still presents the test as a **departure** from
the ticket and points at a "flag raised at this hop" that has since been ruled and closed.

**Why I did not just fix it.** It is a comment, not an assertion — nothing red, nothing unmet, zero
gate impact. My brief scopes this hop to one `CASES` entry and says `A13` needs no work from me;
BA/PM asked for this file untouched. Editing it would put a second file in a test-only diff for a
reason nobody asked for, which is rule 9. **But QE is next on this branch and this is the exact
comment a mutant-net author reads to learn what `A13` is for.** A comment that tells them the
criterion is unsatisfiable, when it has been repaired, is a live trap in the one file where the
counts live. Cheap to fix, and someone should decide to fix it rather than inherit it.

Smaller and in the same block: the comment cites `src/san.ts:101` for SAN's own `isInCheck` call.
`:101` is `suffix()`'s **declaration**; the `isInCheck` call is at **`:104`**, which is the line
BA/PM's ruling and the ticket both cite. Read at source at this hop. Defensible as a
pointer-to-the-function, but the two documents now disagree by three lines on the same fact.

## 2. The difference half rests on a premise the test does not assert

`expect(withSan - sanAlone).toBe(1)` is satisfied by `2 - 1` and **equally by `1 - 0`**. BA/PM found
this in my delivered test and I agree with the finding: `1 - 0` is the world in which the `vi.mock`
spy does not intercept `san.ts`'s internal call, and in that world `A13` as originally written would
have been perfectly satisfiable and there would have been no defect to rule at all. **The whole
routing turned on a number the test does not print.** BA/PM closed it by measuring out of tree — a
bare `toSan` with no panel reads `isInCheck` = 1, so `sanAlone` = 1 and `withSan` = 2.

That measurement lives in a note. **The test still does not pin it**, so the premise is re-derivable
but not re-run: if a future vitest or a future mock-hoisting change stopped the spy intercepting
`san.ts`'s internal call, this assertion would stay **green** while measuring something else
entirely.

**The closing edit is one line and does NOT restate `san.ts`'s count:**

```ts
expect(sanAlone).toBeGreaterThan(0); // the spy DOES intercept san.ts's internal call
```

`> 0` asserts only that interception happens — the thing the difference depends on. It names no
number `src/san.ts` owns, so it is not the `ADR-0009` clause 1 fault that got the *"1 empty, 2
thereafter"* wording rejected. `expect(sanAlone).toBe(1)` **would** be that fault and I am not
proposing it.

**Why I did not write it.** The ruled criterion asks for a difference of exactly 1 and nothing more;
adding an assertion the criterion does not name is scope I was told not to take, on a file I was told
to leave alone. **BA/PM's to decide, not mine** — the same disposition it reached on the ticket text
itself. If it says yes, it is one line and one hop.

## Neither of these blocks anything

`A13` is met on the delivered file today. Both items are hygiene on a criterion that already holds,
and I am raising them because the person best placed to notice them was the person who wrote the file
and has just re-read it against a ruling that changed underneath it.
