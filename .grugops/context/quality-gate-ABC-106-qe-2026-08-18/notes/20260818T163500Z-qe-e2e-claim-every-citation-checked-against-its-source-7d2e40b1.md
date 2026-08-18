---
id: 20260818T163500Z-qe-e2e-claim-every-citation-checked-against-its-source-7d2e40b1
kind: claim
by: qe-e2e
at: 2026-08-18T16:35:00Z
verified_by: ""
confidence: high
refs:
  - ABC-106
  - ABC-032
  - ABC-034
  - src/san.parse.test.ts
  - refinement-abc032-tolerances-2026-08-18
supersedes: ""
---

# Every citation in the new comments, opened and read against its source

The artifact under test is PROSE. I opened each cited source and read it rather than trusting the
comment. Verdict per citation.

| # | citation in `src/san.parse.test.ts` | source read | verdict |
|---|---|---|---|
| 1 | "BA/PM ruled … 2026-08-18 (task `refinement-abc032-tolerances-2026-08-18`) and ACCEPTED every one" | `.grugops/context/refinement-abc032-tolerances-2026-08-18/notes/…-g5-g6-g7-all-accepted-with-bounds-…md` | **HOLDS** — task exists, five notes, all three ACCEPT |
| 2 | "entries **4** and **5** of `ABC-032` § Scope's CLOSED decoration-tolerance list" | `ABC-032` § Scope, the five-entry list | **HOLDS EXACTLY** — 4 = redundant qualifier, 5 = `O`/`0` inside castle strings, list is CLOSED and has five |
| 3 | entry 4's bound: "a CONTRADICTORY origin is still refused" | `ABC-032` entry 4: "Bounded: a CONTRADICTORY qualifier stays refused — `Ne4g5` is `no-such-move`" | **HOLDS** |
| 4 | entry 5's bound: "case is still meaning … case-folded retry is `ABC-033`'s" | `ABC-032` entry 5, and § Out of scope "Case-insensitive SAN … routed to `ABC-033`" | **HOLDS** |
| 5 | "`bxc4` / `Bxc4` can both be legal" | `ABC-032` § Out of scope, verbatim in substance | **HOLDS** |
| 6 | "`ABC-034` `A8` … owns both ill-formed-SAN cases together" | `ABC-034` `A8` — `e8=K` **and** `O-O` with no castle legal, in one criterion | **HOLDS EXACTLY** |
| 7 | "may not add an eighth reason code" | `ABC-034` `A8`: "the set stays at seven; no code is added for either" | **HOLDS EXACTLY** |
| 8 | "would need a private promotion-letter table — the second table `ADR-0004` clause 2 and `A7` exist to prevent" | `ABC-034` `A8` Constraint, and `ABC-032` § Scope's `G7` paragraph | **HOLDS** |
| 9 | "`e8=K`'s code is accepted as delivered" | `ABC-032` § Scope: "accepted there and not re-opened" | **HOLDS** |
| 10 | "the **re-classification** placed on `ABC-034` `A8`" (as delivered, before my repair) | `ABC-034` `A8` | **OVERSTATED — repaired.** See the separate decision note. |

**Row 10 is the one that failed, and the failure is subtler than the brief expected — I report the
correction to the brief, not just the defect.** The brief predicted the engineer had overstated his
source. He had not: the ruling note's own heading reads *"ACCEPT AS DELIVERED for `ABC-032`; the
**re-classification** is `ABC-034` `A8`"*, so the comment faithfully carries the words it cites.
**The overstatement is in the SOURCE HEADING, and the ruling's own body corrects it four lines
later** — *"Deferring it is **placement**, not a floating recommendation"*. The comment inherited the
loose heading and not the precise body.

**Why it is still a real defect in `src/`.** `ABC-034` `A8` requires only that `e8=K` produce
**exactly one of the seven** codes and that **the set stay at seven**. It never names WHICH code.
`no-such-move` standing satisfies `A8` unchanged. A reader of the delivered comment concludes a
re-classification is scheduled; `A8` does not say that.

**The engineer's report on his `it` title CHECKS OUT.** The title reads "— placed on `ABC-034` `A8`",
which is the accurate word. I verified it rather than taking it. **Only the two block comments
carried the loose word.**
