---
id: 20260817T213100Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-8b40e9f2
kind: observation
by: orchestrator
at: 2026-08-17T21:31:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - ABC-076
  - plans/tickets/ABC-077-negamax-alpha-beta-core.md
  - src/evaluate.ts
  - src/gameend.ts
  - src/legal.ts
supersedes:
---

# `ABC-077` criteria re-read against the built tree at the `Ready for Dev` exit

`AGENTS.md` § Process rules 1. Cut **2026-08-16**; `main` at `bf371d7`. **Its DoR said 8/10, NOT
met, stays in `Backlog`. One of the two ⚠️ is now discharged by a merge and the page does not know
it.** That is the finding.

## `G1` — the blocking dependency is DISCHARGED and the page still reads `OPEN`

§ Dependencies line 1: *"**`ABC-076` must land first — OPEN.**"* **`ABC-076` merged to `main`
2026-08-17** and sits in `## Done`. `src/evaluate.ts` exists and exports
`evaluate(position: Position): number` at `:158`. **DoR item 3's ⚠️ ("not independent") is
discharged; the page's own text is stale.** The ticket is **9/10** as it stands, and pullable.
**The page is NOT edited by this hop** — a stale sentence on a pulled ticket is repaired by the role
that owns the page, and the correction is carried here where the engineer reads it.

## `G2` — `ABC-077` consumes an evaluator whose OWN guard QE found partly blind

`ABC-076` closed **PASS with 2 gaps**, and one is load-bearing for this ticket: **its `A1` was found
BLIND to piece-square table contents at ANY corpus size — it asserted a mirrored INDEX, not a
mirrored TABLE — and its criterion text was repaired to say so rather than the guard being
strengthened.** So `evaluate()` arrives with **a known-unasserted surface**, and `ABC-077`'s `A1`
(alpha-beta agrees with brute force) is a **differential** oracle: it compares the search against
itself, so **it cannot see a wrong evaluation either — both sides call the same `evaluate()`.**
**Do not read a green `A1` as evidence the evaluation is right.** It is not in scope to fix; it is
in scope not to claim.

## What HOLDS — checked

| the page says | the tree at `bf371d7` |
|---|---|
| `src/legal.ts`, `src/apply.ts`, `src/gameend.ts` merged, untouched by this ticket | **TRUE** — `legalMoves` `:42`, `isInCheck` `:32`; `gameStatus` at `src/gameend.ts:133` |
| `gameStatus` usable at a leaf with `positionCounts` optional (`ADR-0002`) | **TRUE** — `gameStatus(` at `:133` takes the optional arg; a bare call is legitimate |
| perft corpus available for `A1`/`A2`/`A4` | **TRUE** — `src/perft.test.ts`, and `PERFT_DEEP=1` is 32/32 on `main` |
| the module is new | **TRUE** — **no `src/search.ts` or equivalent exists.** The page never names the path; choosing it is the engineer's |

## `G3` — `A6` asserts the shape of a module the page does not name

`A6` reads *"the delivered module exports no function that selects a move without a caller-supplied
depth"*. **No path is given anywhere on the page.** The engineer names the module and the assertion
must read **that** file. This is a gap in the page, not a defect — recorded because an unnamed
subject is how a shape assertion silently ends up reading nothing.

## `G4` — the remaining ⚠️ is a MEASUREMENT the engineer takes, not a blocker

DoR item 10: the `N8-LANE` ≤ 650 ms fit of `A1`/`A2` at depth 3 over the corpus is **unmeasured**,
**and the remedy is already decided on the page** — the sweep goes behind an opt-in env flag
(`PERFT_DEEP` precedent) with a small subset left in the default lane. **Decide it with the
measurement, per the page's own words. Do not guess it either way, and do not silently drop the
depth-3 sweep to make the lane fit** — that trades `A1`'s only window-bug detector for a stopwatch.
