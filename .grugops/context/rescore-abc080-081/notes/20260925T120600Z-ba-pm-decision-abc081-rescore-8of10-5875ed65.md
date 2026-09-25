---
id: 20260925T120600Z-ba-pm-decision-abc081-rescore-8of10-5875ed65
kind: decision
by: ba-pm
at: 2026-09-25T12:06:00Z
verified_by: 
confidence: high
refs:
  - ABC-081
  - ABC-075
  - ABC-077
  - ADR-0006
  - ADR-0020
  - NFR-005
  - NFR-008
  - ADR-0019
supersedes: 
---

# ABC-081 DoR re-score, 2026-09-25 — 8/10, 2 ⚠️, NOT MET, stays in Backlog

**No sanctioned writer on this install** — same degraded posture as the sibling note
(`20260925T120500Z-ba-pm-decision-abc080-rescore-9of10-40536c8e`), not re-derived here.

## What changed since the 2026-08-16 score (7/10, ⚠️ items 3, 5, 10)

`ABC-075` (the incremental Zobrist key this ticket consumes) and `ABC-077` are both `Done` on
`grugops/wave-2026-09-24` (`plans/board.md`; `plans/traceability.md:587` header row group).
**Item 3 (INVEST-shaped / independent) flips ✅**: the ticket no longer sits behind an open,
itself-blocked ticket. `ABC-080` remains explicitly not a blocker in either direction.

**Items 5 and 10 stay ⚠️, unchanged in substance — both are rulings, not measurements, and
neither has been answered since 2026-08-16.**

## Ruling owed #1 — `ADR-0006`'s inherited caveat (item 5)

`ADR-0006` (castling rights, not availability, hashed) states verbatim it *"will be asked
again by whoever builds `EPIC-004`'s transposition table"* (line 16) and that *"`EPIC-004`
inherits this"* (line 213). **I re-checked: it is still open.** No note under
`.grugops/context/*/notes/` answers it for `EPIC-004`/`ABC-081` — the hits found are all the
original `ADR-0006` ratification thread (`ticket-to-pr-ABC-011`) or unrelated mentions
(`ABC-075`'s own incremental key, which hashes what `ADR-0005`/`ADR-0006` already ratified, not
the TT question). **Owner: Architect/Design. I am asking it again as the ticket page already
does, and I am not answering it** — fenced out of this subtask and out of BA/PM's remit
either way.

## Ruling owed #2 — where the TT lives relative to the Zobrist per-ply seam (`ADR-0020`)

`ADR-0020` (accepted, 2026-09-19) rules the incremental key **rides the search's own per-ply
array, not the `Position`** — the same array `ABC-081`'s scope claims (*"a preallocated
per-ply key array, seeded once per search"*, `ADR-0002` clause 3 verbatim) and the same array
`A6` grep-tests for no `src/history.ts` import. `ADR-0020` itself names `ABC-081` as the
consumer blocked on `ABC-075`'s ep-square ruling (line 35), and that dependency is now
discharged (`ABC-075` `Done`). **What is NOT yet ruled: whether the TT's own storage (the
entry array `A1`–`A7` describe) is a second structure keyed off that same per-ply array, or
whether it shares allocation/seeding with it.** The ticket's scope already separates them
("preallocated per-ply key array" vs. "a transposition table... storing depth, score, a bound
flag... and the best move") but does not say whether the TT is sized/seeded once per search
like the key array or persists across searches (a real TT normally persists; the key array by
`ADR-0002` clause 3 does not). **This is a real, unanswered design question and I am naming it
as a second item under "dependencies known" (item 5), owner: Architect/Design** — it was
implicit in the ticket's existing prose but not previously named as an open ruling on its own.

## Item 10 — the memory NFR gap, still open

Checked `plans/nfr-catalog.md` directly (`grep -n "^| NFR-00[1-9]" `): rows exist for
`NFR-001`–`NFR-008`, all Performance/Cost; **none is a memory bound.** `A7`'s "stated fixed
bound" therefore still binds the ticket to a number with no project-level bar to check it
against. **Unchanged since 2026-08-16. Owner: Architect/Design + Security/NFR, not BA/PM's —
not edited here.**

## `NFR-005` — depth-6 floor kept, what `A2`/`A3` can honestly claim toward it

Same owner's word as the sibling ticket (kept, game-quality reason, current reading kiwipete
d3 / position-6 d3). `A2` claims **≥ 15% hit rate** at depth 5; `A3` claims **≤ 70% node
count**. Neither is a depth claim on its own, matching the ticket's own "no depth verdict
here." **Combined with `ABC-080`'s ≤ 40% bar, the two tickets' written bars commit to roughly a
3.6x node reduction at a fixed depth** (see the sibling note's arithmetic, not repeated in
full here) — **short of what three additional plies (depth 3 → 6) plausibly cost**, named
plainly and not re-leveled. Same owner-facing gap as `ABC-080`'s note states.

## `NFR-008` — lane realism

`ABC-081`'s `N8-LANE` line follows the same established opt-in-sweep shape as
`ABC-077`/`ABC-078`/`ABC-079`/`ABC-080` (shallow subset in the default lane, depth-4/5 sweeps
behind an env flag). Realistic in shape; same compounding-onto-an-already-breached-15s-level
caveat as `ABC-080`'s note. Not re-leveled.

## Score

**8 of 10 clean, 2 ⚠️ — NOT MET; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ unchanged |
| 3 | INVEST-shaped | ✅ **flipped from ⚠️** — `ABC-075` and `ABC-077` both `Done`; `ABC-080` still not a blocker |
| 4 | acceptance testable and measurable | ✅ unchanged |
| 5 | dependencies known | ⚠️ **unchanged, and sharpened** — `ADR-0006`'s inherited caveat still open (Architect/Design), and a second, previously-implicit ruling now named: where the TT's own storage sits relative to the `ADR-0020` per-ply key array (Architect/Design) |
| 6 | security/NFR triggers with a measurable target | ✅ unchanged; `NFR-005`/`N8-LANE` claims re-checked above, no target moved |
| 7 | test notes present | ✅ unchanged |
| 8 | size assigned | ✅ `M`, unchanged — not `XL`, no `SPLIT_REQUIRED` |
| 9 | priority assigned | ✅ `P0`, unchanged |
| 10 | no major unresolved blocker | ⚠️ **unchanged** — no memory NFR row exists in `plans/nfr-catalog.md`; `A7`'s stated bound has nothing to check against |

**Pullable today: NO** — 8/10, two open rulings, both Architect/Design's, neither ruled by this
subtask. **Size M, priority P0.**

## Recommended pull order

`ABC-080` (9/10, one self-resolving-at-build ⚠️) is closer to Ready than `ABC-081` (8/10, two
open architecture rulings neither of which BA/PM can discharge). **Recommend: route the two
`ABC-081` rulings (`ADR-0006` inherited caveat, TT-vs-per-ply-array storage question) to
Architect/Design first, in parallel with — not blocking — an `ABC-080` pull once its own
generic-bar caveat is accepted as a build-time-resolving item by the Orchestrator.** Neither
ticket is Ready today; recommending routing order, not ruling either question.
