---
id: 20260818T162000Z-ba-pm-observation-abc-106-overstates-what-abc-034-a8-says-e2b04d16
kind: observation
by: ba-pm
at: 2026-08-18T16:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-106
  - ABC-034
  - ABC-032
  - src/san.parse.test.ts
  - src/san.ts
  - plans/tickets/ABC-106-ruled-tolerances-are-specification-not-characterization.md
  - plans/tickets/ABC-034-rejections-that-teach.md
supersedes: 
---

**I was asked to check whether `ABC-034` `A8` actually says what `ABC-106` claims it says. It does
not, in one word — and that word is load-bearing.**

**What `ABC-106` claims.** Its `## Problem` (page line 28): *"`e8=K`'s code is accepted as delivered
with the **re-classification** assigned to `ABC-034` `A8`."* Its `## Scope` (line 41): *"The `e8=K`
row's comment gains the pointer to `ABC-034` `A8`, which now owns the **placement**."* Its `A1`
requires each of the three rows to name where it was ruled — *"`ABC-034` `A8` for `G7`"*.

**What `ABC-034` `A8` actually requires.** Given `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` and `e8=K`, and
given `4k3/8/8/8/8/8/8/K6R w - - 0 1` and `O-O`, each input *"produces **exactly one of the seven
codes above** — the set stays at seven; no code is added for either"*, the message names a concrete
referent, and `e8=P` still resolves to a different code than `e8=Q` where `e8=Q` is legal. The
constraint on the fix is that no second promotion-letter or castle-string table appears in
`src/san.ts` and that whatever is needed is computed **in `ABC-034`'s own module**.

**The gap.**

- **"placement" is ACCURATE.** `A8` does place both inputs inside `ABC-034`'s own seven-code
  vocabulary — and it must, because `no-such-move` is **not one of those seven** (they are
  `unreadable`, `empty-square`, `not-your-piece`, `piece-cannot-reach`, `own-king-exposed`,
  `must-address-check`, `no-legal-move-named`). So a mapping is genuinely owed by `ABC-034`.
- **"re-classification" OVERSTATES it, in two ways.** (a) `A8` changes **nothing** about `ABC-032`'s
  code. `ABC-034`'s own `## Scope` says `ABC-032` *"codes it `no-such-move` and that is accepted
  there and not re-opened"*, and `ABC-106` says the same thing in the same sentence — so nothing is
  re-classified; a second, separate vocabulary is mapped onto. (b) `A8` does **not pin which** of
  the seven `e8=K` lands in. `ABC-034`'s `## Scope` prose *leans* — *"by the floor's own words it
  belongs on the `unreadable` side"* — but that is a lean in prose, not a criterion, and `A8` as
  written is satisfied by any of the seven.

**Why it matters and is not pedantry.** `ABC-106` exists precisely so the next author reads a
truthful label. An engineer who reads `ABC-106`, follows the pointer to `A8` expecting a mandated
re-classification to `unreadable`, and finds a criterion that only says "one of seven", has been
sent to the wrong place by the artifact whose whole job is correct labelling. The risk is that the
engineer either changes `src/san.ts` (which `ABC-106` `## Out of scope` forbids and `ABC-032` `A7`
guards) or treats the `unreadable` lean as settled when `A8` did not settle it.

**Measured at HEAD `7ea9e1b`, not assumed.** `src/san.parse.test.ts:421` is titled *"codes an
IMPOSSIBLE promotion `e8=K` as `no-such-move`, not `unreadable`"* and asserts
`{ outcome: "rejected", reason: "no-such-move" }`; `e8=P` asserts `unreadable`. `SanRejectReason`
(`src/san.ts:183`) has exactly two arms. `A8`'s parenthetical measurement is correct as written.

**I changed nothing on `ABC-106`.** It was not one of the four tickets in this task's scope, its DoR
is 10/10 and does not move, and the fix is a wording change on `ABC-106`'s page (and possibly on
`A1`'s required comment text), not on `ABC-034`'s. **Recommendation, for the Orchestrator to route:**
`ABC-106` should say *"the PLACEMENT assigned to `ABC-034` `A8`"* rather than *"the
re-classification"*, since `ABC-106`'s own `## Scope` already uses the accurate word four lines
later. I added a paragraph to `ABC-034`'s DoR section recording that `A8` is unchanged and what it
does and does not do, so the two pages cannot drift further apart unread.

**Separately, and non-gating:** `ABC-106`'s board row and page still say it is *"blocked on `ABC-032`
merging"*. `ABC-032` merged 2026-08-18, so that block is discharged. Its DoR score does not change,
so I did not edit the row.
