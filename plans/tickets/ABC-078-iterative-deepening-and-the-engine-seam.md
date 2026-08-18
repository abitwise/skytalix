---
id: ABC-078
title: Iterative deepening against a wall clock — the per-move budget, and `EngineSeam` satisfied
status: ready-for-uat
column: Ready for UAT
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-078 — `RISK-002`'s constraint, built. This is the only place a per-move budget exists.

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **This ticket is where the non-negotiable inherited constraint is discharged.**
> `plans/nfr-catalog.md` (the `RISK-002` survival paragraph): *"**Survives: RISK-002 = GO WITH
> CONSTRAINT**, and `EPIC-004`'s per-move budget **must be time-based (iterative deepening against a
> wall clock), not depth-based** — a fixed depth would blow `NFR-004`'s 3-second ceiling on exactly
> the machines least able to absorb it. Inherited by `EPIC-004` as non-negotiable."* Verified at
> source. **`ADR-0003` also leans on it structurally** — its reason for choosing depth over rate is
> that iterative deepening *"returns the best move found so far when the clock runs out — so the 3 s
> budget **cannot** be blown by a slow node rate."* **If this ticket is wrong, `NFR-005`'s entire
> derivation collapses with it.**

## Problem

*User*: the player waiting for a move.

*Pain*: `ABC-077` returns a move for a depth. Nobody knows what depth fits in 3 s on an unknown
machine, and `ADR-0003` says the slow-hardware factor has **never been validated**. A fixed depth is
a promise about hardware you have not measured.

*Value*: it is the only construction that lets `NFR-004` be a promise rather than a hope, and it
satisfies `EngineSeam`, which `turn-loop.ts` has been waiting on since `ABC-019`.

## Scope

- **Iterative deepening**: search depth 1, then 2, then 3 …, keeping the best move from the last
  **completed** iteration, until the wall-clock budget is spent.
- **Abort mid-iteration** and return the last completed iteration's move. An incomplete iteration's
  result is **discarded**, not used.
- **Satisfy `EngineSeam`** — `src/turn-loop.ts:138`: `(history: GameHistory) => Promise<Move>`.
  **The type already exists; this ticket supplies the implementation the table in the architecture
  audit lists as *"impl is `EPIC-004`'s"*.**
- The default budget: **3 s**, hard ceiling **5 s** (`NFR-004`).

## Out of scope

- **Difficulty selection — a flag, a prompt, or how a chosen level persists across a session — is
  `EPIC-006`'s, not this epic's.** This ticket takes a budget as a parameter. **It owns the
  mechanism; `EPIC-006` owns the choosing.** *(Boundary ruled by the Orchestrator at this
  decomposition; recorded here so it is not rediscovered.)*
- **The difficulty *mechanism*** (budget + blunder rate as levels) — `ABC-087`.
- **Aspiration windows, null-move pruning, late-move reductions.** Not requested; coding rule 5.
- **Parallel search.** Threading is `UNKNOWN - verify` and Architect/Design's.

## Acceptance (Given/When/Then)

- **`A1` (`NFR-004`, the promise).** **Given** **≥ 30** positions spanning opening, middlegame and
  endgame, **when** a move is requested at default difficulty, **then** every call returns in
  **≤ 3 s** and **no call ever exceeds 5 s** — **30/30**, worst case reported with machine.
- **`A2` (the budget is honoured under an adversarial clock).** **Given** a budget of **50 ms** —
  far below one iteration's cost in a complex position — **then** a **legal move is still
  returned**, within **≤ 2x** the budget, because depth 1 always completes. *(This is the criterion
  that proves the clock is checked inside the recursion and not only between iterations.)*
- **`A3` (a partial iteration is discarded, not used).** **Given** an instrumented run aborted
  mid-iteration at depth `n`, **then** the returned move equals the best move of the completed
  depth `n-1` iteration. *(Using a partial iteration's best move is worse than not searching it —
  it is a systematically biased sample of the move list.)*
- **`A4` (no fixed depth anywhere — `RISK-002` as a criterion, not a comment).** **Then** the
  delivered engine entry point takes a **time budget** and **no depth argument or depth default**,
  and grep of the delivered `src/` diff finds **no depth constant** driving a per-move decision.
  Asserted in a test over the delivered exports.
- **`A5` (deeper when given longer).** **Given** the same position at budgets of 100 ms, 1 s and
  3 s, **then** the completed depth is **monotonically non-decreasing** across the three. *(A clock
  that is checked but never lets the search go deeper passes `A1`–`A3`.)*
- **`A6` (it satisfies the merged seam, unchanged).** **Then** the implementation is assignable to
  `EngineSeam` as declared, `runTurnLoop` drives it end to end in a scripted game, and
  **`src/turn-loop.ts` is byte-identical**.
- **`A7` (always legal, never null).** **Given** any position with at least one legal move, at any
  budget down to **1 ms**, **then** a legal move is returned — never `null`, never a throw. **≥ 200
  positions.**

## Dependencies

- **`ABC-077` — MERGED to `main`, and this dependency is DISCHARGED.** It is the iteration body.
  Measured 2026-08-18 at HEAD `7ea9e1b`, not asserted: `search(position, depth)` is exported at
  `src/search.ts:167`, `SearchResult` at `:42`, `searchWithoutPruning` at `:178`, `MATE_SCORE` at
  `:40`. `ABC-077` merged 2026-08-18 and sits in `Done`. **Read its board row before building:** it
  records that this module *"has NO way to choose a move without a caller-supplied depth"* — which is
  precisely the hole this ticket fills — and it carries a HIGH QE gap that **nothing in the repo
  asserts the material values the search maximises**.
- **`ABC-076` — MERGED to `main` 2026-08-17, DISCHARGED** (transitively; `src/evaluate.ts` is in the
  tree).
- **`src/turn-loop.ts` — MERGED**, and supplies `EngineSeam`. **Not modified** (`A6`).
- **Enables `ABC-074`** — the spike measures depth-in-budget and cannot run before this exists.
- **`EPIC-005`'s opening book CONSUMES this move interface.** *(Boundary: the book is `EPIC-005`'s
  and is **not cut here**.)* **Named as a dependency and stopped on, per instruction:** if the book
  wraps or precedes the engine, it consumes `EngineSeam` — the type is **merged and unchanged by
  this ticket**, so nothing here breaks it. **If `EPIC-005`'s decomposition needs a different
  shape — a "book first, else search" composition point, or a way to ask the engine to skip the
  book — that is a contract change on a merged type and is NOT resolved here.** ~~Owner: whoever
  decides the `EPIC-005`/`EPIC-004` composition point.~~ **STALE SINCE 2026-08-18 — struck by BA/PM
  at task `cut-frame-overflow-2026-08-18`, the pen Architect/Design left it to. The composition
  point HAS an owner and HAS been decided: `ADR-0012`, `accepted`, merged at `3f73d7e`. The feared
  contract change cannot arrive — the seam-widening shape was rejected.** Flagged, not designed.
- **RULED 2026-08-18 — `ADR-0012` is `accepted`, and it costs this ticket NOTHING.** The book is a
  **decorator of `EngineSeam`** (`EngineSeam → EngineSeam`), built by `EPIC-005` as a separate module
  and wired by `EPIC-006`'s composition root. **`src/turn-loop.ts` and `EngineSeam` are not modified,
  and no criterion on this page changes — `A6`'s byte-identical pin stands and is strengthened in
  role**: it is now the criterion that protects the composition point. The seam-widening shape (a
  skip-the-book flag) was **rejected**, so the contract change this bullet feared cannot arrive from
  `EPIC-005`. *(Recorded by Architect/Design at task `design-p0-chain-rulings-2026-08-18`. The
  "Owner: whoever decides…" sentence above is now **stale prose**, and re-scoring **⚠️(5)** is
  **BA/PM's pen** — neither is touched here.)*

## Security / NFR triggers

- **`NFR-004` — ≤ 3 s at default difficulty, hard ceiling 5 s at any difficulty.** `A1` is its
  direct test. **⚠️ `A1` is wall-clock and therefore machine-dependent** — per
  `plans/nfr-catalog.md`'s standing rule, **no wall-clock assertion belongs in the default suite**.
  `A1` runs as a reported measurement plus an opt-in check; `A2`, `A3`, `A5` and `A7` are the
  machine-independent guards that live in the suite.
- **`NFR-005` — depth-in-budget on `kiwipete` and `position-6`.** First point at which the FAIL
  floor (depth 6) and WARN level (depth 7) are measurable at all. **Report; do not rule** — the
  depth-7 level stays **PROVISIONAL** until `ABC-074`.
- **`N8-LANE` — ≤ 650 ms CPU.** ⚠️ A 3 s budget cannot run in a 650 ms lane. Suite tests use
  **millisecond budgets** (`A2`, `A5`, `A7`); the 3 s runs are opt-in.
- **Security — not triggered.** No input surface; the budget is a number from a caller.

## Test notes

1. **`A2` is the one that catches the common bug.** Checking the clock only between iterations gives
   a well-behaved engine that blows the budget on exactly the position where it matters.
2. **Inject the clock.** A test that waits 3 s to assert 3 s is a slow test and a flaky one; an
   injected time source makes `A3` and `A5` deterministic and fast. This is the one seam worth
   having here, and it is requested.
3. **`A7` at 1 ms is not a silly case** — it is the shape of every real timeout.
4. **Do not assert absolute depths in the suite.** Assert monotonicity (`A5`). Depth is hardware.

## Size and priority rationale

**Size `M` (3).** A loop, an abort check, a best-so-far register and an injected clock. **Not `L`:**
the recursion is `ABC-077`'s and the budget-to-level mapping is `ABC-087`'s.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It discharges the epic's non-negotiable constraint, it satisfies the merged
`EngineSeam`, it is `NFR-004`'s only implementation, and `ABC-074` is blocked behind it.

## Criteria state after QE and Security/NFR — RECORDED, NOT RESOLVED

**Written 2026-08-18 by BA/PM** (task `cut-lane-budget-2026-08-18`) from QE's `PASS WITH FINDINGS`
verdict and Security/NFR's `PASS_WITH_RISKS` verdict. **Every number is theirs.** **BA/PM rules no
NFR bar and marks no criterion met that is not; a repair hop is in flight and this section records
state ahead of it rather than assuming its outcome.**

| criterion | state | what the gates found |
|---|---|---|
| **`A1`** | **NOT MET, and it is not marked met** | **Clause A (≤ 3 s at default difficulty): NOT MET.** Worst case **3 027 / 3 030 / 3 031 ms** across three hops on three different positions, 27–29 of 30 calls over 3 s, worst overshoot **31 ms = 1.03%**. **ACCEPTED RISK `AR-NFR004-A`, severity LOW. Owner: Security/NFR at `EPIC-006`'s difficulty hop (`ABC-087` if it lands first). Discharge: that hop passes ~2 900 ms — which makes the clause literally true at zero cost and changes no line of the module — or re-accepts the risk IN WRITING with its number. It may NOT be discharged by editing the `NFR-004` row.** **Clause B (5 s hard ceiling at any difficulty): BREACHED.** `budgetMs` 5 000 → **5 002 ms**, 6 000 → **6 004 ms**; `chooseMove` contains no reference to 5 000 of any kind. **REQUIRED FIX `RF-1`, severity MEDIUM, ruled owed BY THIS TICKET** (`## Scope` claims the ceiling; `## Out of scope` defers only the *choosing*): an exported `HARD_CEILING_MS = 5_000`, one `Math.min` in the deadline initialiser, two comment lines, one injected-clock assertion. **Not a validation, not a throw, not a margin.** **IN THE REPAIR HOP IN FLIGHT — not done.** |
| **`A2`** | met as written; **its guard is BYPASSABLE** | **QE `G1`, HIGH.** The ticket calls `A2` *"the criterion that proves the clock is checked inside the recursion"*. On `A2`'s own fixture the delivered build and a between-iterations build are **byte-identically indistinguishable** (depth 2, 360 nodes, `elapsedMs` 75, 4 clock consultations) — the in-recursion check is never reached. **`A3` is what actually kills that mutant, as an undeclared side effect.** Two false statements sit in `src/engine.test.ts:206-212`. **In the repair hop.** |
| **`A3`** | **MET**, and genuinely guarded | The keep-the-partial-iteration mutant reds it; the `position-6` fixture choice is load-bearing. **QE `G4`: its OTHER job — coupling the two negamax copies — is far too thin.** |
| **`A4`** | met on the delivered code; **its guard is BYPASSABLE** | **QE `G2`, HIGH.** A two-line `if (iteration > 4) break;` inside the deepening loop produces a hard depth-4 cap that passes `tsc`, `biome`, **1 016/1 016** default tests and **23/23** `ENGINE_DEEP`. **`A4`'s four checks are all TEXTUAL — source regexes, `Object.keys`, `Function.length` — and not one of them runs a search.** `RISK-002`, this epic's non-negotiable inherited constraint, has one guard and it does not hold. **In the repair hop.** |
| **`A5`** | met; **it cannot see the `G2` cap** | Monotonicity is asserted and the pinned-depth-1 mutant reds it, but the observed depths (1/2/3, and 1/3/4 deep) never exceed a cap at 4, so `A5` passes on the capped build too. Same repair. |
| **`A6`** | **MET**, verified not asserted | Four identical `src/turn-loop.ts` blob hashes (working tree, branch base, `main`, `16e9269`); delivered `src/` diff is exactly two ADDED files, 0 modifications. |
| **`A7`** | **MET**, and it survived a harder attack than the suite runs | 409 positions × 5 budgets = **2 045 real-clock calls: 0 null, 0 throws, 0 illegal, 0 mutated positions.** |

**Three other results recorded so they are not rediscovered, and none of them is BA/PM's to rule:**

- **`NFR-005` — measured BELOW its FAIL floor and the floor is NOT relaxed.** Depth 4 / depth 3 at
  3 s against a floor of 6. **Ruled a WAYPOINT, not a verdict**: the row measures *the search* and
  this ticket built the *time control around* it; `ABC-079`, `ABC-080` and `ABC-081` are unbuilt.
  **The floor becomes DUE at the close of the last of those three.**
- **`N8-LANE` — NOT MET at ~840 ms net against 650 ms (1.29x).** **ACCEPTED RISK `AR-N8LANE-078`,
  LOW, owner Architect/Design**, inside `ABC-025`'s 1.6x precedent. **Its discharge is `ABC-108`'s
  re-measurement, where this 840 ms is one input.**
  **DISCHARGED 2026-08-19, and DISCHARGED means NOT CHARGED — recorded here by BA/PM (task
  `cut-lane-remedy-2026-08-19`) so this page can never be read as though this ticket caused the
  lane's breach.** `ABC-108`'s ruling (`ADR-0014`) found `NFR-008`'s CPU clause **BREACHED at
  14.480 s against 13 s** — and **`NFR-008`'s own restatement arithmetic, `9.545 + 11 × 0.341 =
  13.30 s`, was already over the clause on 2026-08-13's published numbers, before `ABC-078`
  existed.** This ticket's **190 ms** overspend is **13% of the 1.480 s deficit**; removing it
  entirely would not clear the clause. **No new risk is opened against this ticket and
  `src/engine.test.ts` is not a privileged candidate for the remedy (`ABC-110`).**
  **Nothing above is relaxed: `N8-LANE` is still NOT MET at ~840 ms against 650 ms (1.29x), the
  accepted risk stays on the record as written, and `ADR-0014` makes `N8-LANE` a rate limit rather
  than a grant — so passing it would not have implied the lane was within budget either.**
- **`AR-ENGINE-DOC`, LOW** — `chooseMove` does not terminate on `budgetMs: Infinity` or on a
  non-advancing injected clock, and documents no valid range for either. **Owner: the `RF-1` repair
  hop**; the clamp closes the `Infinity` half outright.

**Security review: CHECKED, not inherited — no ASVS L1 requirement fails, no high-severity finding,
`security.block_on` is `high`, so the gate is `PASS_WITH_RISKS` rather than `BLOCKED`.**

## Definition of Ready

**RE-SCORED 2026-08-18 by BA/PM** (task `cut-lane-budget-2026-08-18`) against the QE and
Security/NFR results above. **Result: 9 of 10, ⚠️x1 — DOWN from 10/10, and item 4 is the item that
moved.**

**The ⚠️ is BA/PM's own authorship defect and it is owned rather than routed.** DoR item 4 asks
whether the acceptance criteria are *testable and measurable*. `A2` and `A4` are both — and QE
proved that **a compliant implementation can satisfy every word of them while violating the
property they name**: `A4`'s four checks are textual and none runs a search, so a two-line depth cap
passes it; `A2`'s fixture never reaches the in-recursion check it exists to prove. **A criterion
that is measurable but measures the wrong thing is a vague criterion wearing a number**, and
letting one exit `Ready` is exactly the defect this role is supposed to catch. `A5` inherits the
blind spot. **Discharge: the repair hop lands criteria and tests that detect what they name — at
which point item 4 returns to ✅ and not before.**

**What did NOT move, and why, so the score is not read as more than it is:**

- **`A1` is NOT a DoR item and this hop does not treat it as one.** It is an `NFR-004` bar; it is
  **RULED** above by Security/NFR, with an accepted risk and a required fix, and BA/PM records that
  ruling without re-opening it. The same fence the 2026-08-18 `cut-frame-overflow` re-score set.
- **Item 6 stays ✅ and is deliberately not marked down for `ABC-108`.** The `N8-LANE ≤ 650 ms`
  target on this page is a fixed catalog number, it was measured against, and it has not moved.
  **What `ABC-108` puts under question is the derivation of that number, not its measurability** —
  and re-scoring every page in the repository on that would be BA/PM using the DoR to express
  alarm. The exposure is recorded on `ABC-108`, which is where it is routable.
- **⚠️(5) stays DISCHARGED** by `ADR-0012` and ⚠️(3), ⚠️(10) stay discharged by measurement.
  Nothing in the gate results re-opens them.

**Superseded below, retained: the 2026-08-18 `cut-frame-overflow` and `refinement-p0-chain`
scorings.**

Cut-hop assessment by BA/PM **2026-08-16**: **7 of 10, ⚠️x3** — items 3, 5 and 10.

**RE-SCORED again 2026-08-18 by BA/PM** (task `cut-frame-overflow-2026-08-18`), on `ADR-0012` being
`accepted` and merged (`3f73d7e`). **Result: 10 of 10, 0 ⚠️ — the Definition of Ready is MET.**

- **⚠️(5) is DISCHARGED BY RULING, not by a merge and not by re-argument.** The `EPIC-005`
  composition point had no owner; it now has an answer. The book is a **decorator** of `EngineSeam`
  (`EngineSeam → EngineSeam`), built by `EPIC-005` as a separate module and wired by `EPIC-006`'s
  composition root; the **seam-widening shape was rejected**; `src/turn-loop.ts` is unmodified.
  **This ticket's page does not change one criterion because of it** — `A6`'s byte-identical pin
  stands verbatim and is *strengthened in role*: it is now the criterion that protects the
  composition point. The forward rework risk the ⚠️ carried is the thing that is gone.
- **The stale prose it rested on is struck**, in `## Dependencies` above.
- **NOT TOUCHED HERE, deliberately: `A1`.** It came back **not literally met** on delivery — worst
  case **3027 ms**, **29/30** over the 3 s clause by ≤ 27 ms, **0/30** over the 5 s ceiling. That is
  an **NFR bar against `NFR-004`**, it is **Security/NFR's at the gate after QE**, and BA/PM neither
  re-scores it nor rules on it. It is not a DoR item and it does not move this score.

**Superseded below, retained: the 2026-08-18 `refinement-p0-chain` scoring.**

**RE-SCORED against the tree at `main` HEAD `7ea9e1b` by BA/PM, 2026-08-18** (task
`refinement-p0-chain-2026-08-18`). **Result: 9 of 10, ⚠️x1 — still NOT met; stays in `Backlog`.**

- **⚠️(3) is DISCHARGED BY MEASUREMENT.** `ABC-076` merged 2026-08-17 and `ABC-077` merged
  2026-08-18; both are in `Done` and `search()` is exported at HEAD. The two tickets that stood in
  front of this one are behind it.
- **⚠️(5) STANDS, and it blocks NEITHER building NOR verifying.** The `EPIC-005` composition point
  is a **cross-epic contract question with no owner**, and it is unchanged by any merge. This ticket
  builds against `EngineSeam` **exactly as merged** (`src/turn-loop.ts:138`, re-checked at HEAD) and
  `A6` pins `src/turn-loop.ts` byte-identical, so the contract is not touched here and every one of
  `A1`–`A7` is measurable without an answer. What the open question carries is **forward rework
  risk**, not a build or verification obstacle. It is kept as ⚠️ rather than smoothed to ✅ precisely
  so it stays visible and routable — **BA/PM does not resolve it and assigns no owner**; see
  `## Dependencies` and the routing note under
  `.grugops/context/refinement-p0-chain-2026-08-18/notes/`.
- **⚠️(10) is RE-SCORED to ✅, and NOT by a merge — by separating BUILDING from VERIFYING.** It was
  never a blocker on *doing* this ticket. `A1` is runnable and reportable **as written** — it already
  says *"worst case reported with machine"* — and `A2`, `A3`, `A5`, `A7` are the machine-independent
  guards. What cannot be taken on this hardware is the **generalisation off this machine**, which is
  `ABC-074`'s, is `Blocked` in the visible column with the reason stated (no non-M3 machine exists
  here), and is recorded per this project's standing `UNKNOWN - verify` practice rather than being
  claimed. **The residual is named, not smoothed:** on delivery, `A1`'s number is true of the machine
  that ran it and of nothing else, and `NFR-005`'s depth-7 level stays **PROVISIONAL** until
  `ABC-074` reports. A ticket whose measurement is honestly bounded is ready; a ticket whose
  measurement is *fabricated* is not, and nothing here licenses the second.

Column moves are the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the unvalidated hardware factor is quoted from `ADR-0003`, not asserted |
| 2 | scope and out-of-scope clear | **✅** four fences, including the `EPIC-006` difficulty boundary written down |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* **independent** — both tickets that stood in front of it (`ABC-076`, `ABC-077`) are merged to `main` and in `Done`; `search()` is exported at HEAD `7ea9e1b`. Discharged by measurement 2026-08-18 |
| 4 | acceptance testable and measurable | **⚠️** *(was ✅; re-scored 2026-08-18 against QE `G1`/`G2`, both HIGH)* seven criteria, all carrying numbers — **and two of them do not detect the property they name.** `A4`'s no-depth-argument guard is **entirely textual** (source regexes, `Object.keys`, `Function.length`; none runs a search), so QE's two-line `if (iteration > 4) break;` cap passes it, the full suite and `ENGINE_DEEP`; `A2`'s 50 ms fixture is **byte-identically insensitive** to the between-iterations build it was written to catch. `A5` inherits the blind spot. **BA/PM's own defect, owned here. Discharge: the repair hop lands criteria that detect what they name** |
| 5 | dependencies known | **✅** *(was ⚠️)* the `EPIC-005` composition point is **RULED**: `ADR-0012`, `accepted` and merged `3f73d7e` — the book is a **decorator** of `EngineSeam`, built by `EPIC-005`, wired by `EPIC-006`'s composition root, seam-widening **rejected**, `src/turn-loop.ts` unmodified. **Discharged by ruling 2026-08-18**, by the role it was routed to; the ⚠️ was not smoothed, it was answered. No criterion on this page changed |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 3 s / 5 s; `NFR-005` reported not ruled; `N8-LANE` 650 ms with the conflict named and a decided remedy |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* **`NFR-004`'s verification is machine-dependent and this project has one machine — that limits VERIFYING, it does not block BUILDING, and it is not a blocker on this ticket.** `A1` runs and reports as written (*"worst case reported with machine"*); `A2`/`A3`/`A5`/`A7` are machine-independent. The off-machine generalisation is `UNKNOWN - verify` behind `ABC-074`, which is visible in `Blocked` with its reason. **Residual, recorded not smoothed:** `A1`'s number is true of the machine that ran it and of nothing else, and `NFR-005`'s depth-7 level stays PROVISIONAL |
