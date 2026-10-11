---
id: ABC-083
title: Evaluation — king safety and mobility
status: blocked
column: Blocked
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-083 — the last two evaluation terms the epic names, and the one that costs

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Third and last
> evaluation ticket (`ABC-076`, `ABC-082`). **Mobility is here rather than in `ABC-076` because it
> is the only evaluation term that calls the move generator, which makes it the only one with a real
> cost risk — and that risk belongs in one ticket where it can be measured, not spread across
> three.**
>
> **Folded 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`,
> Workflow 07). Two criteria were added. `A8` is QE's `ABC-082` gap G-QE-1, the one-sided
> isolated-pawn check. `A9` is the trigger of the accepted risk `AR-NFR005-082`, put on the page as
> a criterion. The Dependencies section now records that all three dependencies are `Done`. The
> routing note is `.grugops/context/cut-followups-2026-10-09/notes/`.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`,
> Workflow 07) against the wave tip `71be48b`. This is the second value-changing evaluator change
> on a pinned engine. `ABC-082` was the first, and its re-score added re-pinning to its scope and
> re-sized it `S` → `M`. That applies here too, and more widely, because mobility and king safety
> act on boards with no pawns. New: a re-pin scope bullet and `A10`. Size `S` → `M`. `ABC-084`'s
> trigger is live. **DoR 9/10, item 10 ⚠️: one Architect/Design ruling is owed before `Ready`, and
> one owner question may be answered now or kept for the reading.** Reasoning:
> `.grugops/context/rescore-batch-2026-10-10/notes/`.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `owner-adrs-followups`) on three
> owner rulings of the same day: **`ADR-0031` accepted** (R1: if no mobility form meets `A5`, king safety
> ships alone and mobility is re-cut), **R2 answered: keep depth 7** (note `…owner-word-d7a1c3e5`), and
> **`ADR-0034` accepted with (b) at 0.8x** (how a puzzle red is classed; four edge rows dropped by
> `ABC-131`). `A4`, `A5`, `A9`, `A10` and § Dependencies are folded; the stale "40/40" and the stale
> `ABC-126` size are fixed. **DoR 10/10 → `Ready`; pull after `ABC-126` and `ABC-131` merge.** Reasoning:
> `.grugops/context/owner-adrs-followups/notes/`.

## Problem

*User*: the player whose attack the engine walks into.

*Pain*: with material, tables and pawn structure, the engine still shuffles pieces to no purpose and
leaves its king in a draughty position, because nothing scores *activity* or *exposure*. These are
the last two terms the epic's scope names and neither exists.

*Value*: mobility is the cheapest proxy for "having a plan"; king safety is what stops the engine
losing to a straightforward attack, which at 1400–1700 is how most games are decided.

## Scope

- **King safety** — a penalty scaled by missing pawn shelter in front of the king and by open or
  half-open files adjacent to it.
- **Mobility** — a bonus proportional to the number of legal moves available, from the side to
  move's point of view, symmetric across colours.
- Additive terms on `ABC-076`'s score, same units, same sign convention.
- **Re-pinning the merged pins these terms move** *(added 2026-10-10)*. Each pin is re-set from a
  fresh measurement, and each fixture's bite is re-checked (`A10`). This is `ABC-082`'s scope
  bullet, applied to this ticket. No other ticket owns it.

## Out of scope

- **Attack-unit / king-tropism tables, pawn storms, piece-specific mobility weights.** Not requested;
  coding rule 5.
- **Tapered evaluation** (king safety mattering less in an endgame). It is the obvious next step and
  it is **deliberately not cut** — recorded as a decision, revisitable with a measured strength
  justification, not an omission.
- **Pawn structure** — `ABC-082`. The open-file component here reads pawn placement but does not
  duplicate `ABC-082`'s terms.

## The cost risk, stated up front

**Mobility needs a move count for both sides, and `legalMoves` is 2.1–5.4 µs per call**
(`ADR-0003`, measured). **Two `legalMoves` calls at every leaf would put leaf evaluation at 4–11 µs
— four to ten times `ADR-0003`'s 1,100 ns worst case — and the entire depth-in-budget derivation
this epic rests on would stop holding.** `A5` makes this a hard stop rather than a discovery.
**A cheaper mobility proxy (pseudo-legal counts, or attack-map counts) may be required; choosing one
is a design decision inside this ticket's own module, but if the answer is that mobility cannot be
afforded at all, that is Architect/Design's call and this ticket reports rather than drops the
term.** **→ Ruled 2026-10-10 (`ADR-0031`, accepted): king safety ships alone and mobility is re-cut;
the route is in `A5`.**

## Acceptance (Given/When/Then)

- **`A1` (symmetry).** **Given** any position and its colour mirror, **then** scores are **exactly
  equal**, over the `ABC-076`/`ABC-082` corpus **plus ≥ 15 new positions** covering exposed and
  sheltered kings.
- **`A2` (shelter).** **Given** a white king castled kingside with pawns on `f2`/`g2`/`h2` versus
  the same position with `g2` removed, **then** the second scores **strictly lower** for white.
- **`A3` (open file next to the king).** **Given** a castled king with a half-open adjacent file
  versus a closed one, **then** the half-open case scores **strictly lower** for white.
- **`A4` (mobility, and it is bounded).** **Given** a position where white has substantially more
  available moves than black and material is equal, **then** white scores **strictly higher**, and
  the total mobility contribution never exceeds **±100 centipawns** — mobility must not outvote a
  minor piece. *(2026-10-10: if `ADR-0031`'s cut fires, `A4` leaves with mobility.)*
- **`A5` (the cost stop — the criterion this ticket exists to enforce).** **Then** the measured mean
  cost of the **complete** evaluation (`ABC-076` + `ABC-082` + this) is reported with machine and
  Node version and is **≤ 1,100 ns**. **Above 1,100 ns: STOP and report to Architect/Design.** Do
  not ship an evaluation that invalidates `ADR-0003`'s depth model and do not re-derive the model to
  fit the code.
  **The route on a miss — `ADR-0031`, accepted 2026-10-10:**
  - **Three mobility forms are measured**, each as the **complete** evaluation and each in its cheapest
    honest implementation: legal count (`legalMoves` ×2), pseudo-legal count (`generateMoves` ×2) and
    attack-map count (squares reached on the board, no `Move` objects, no make/unmake). A piece subset, a
    cross-call cache, lazy evaluation or make/unmake-carried state is **not** a fourth form.
  - **Near the bar:** the base build is read in the same session; a mean in **990–1,210 ns** is read again
    in a second session in reverse order, and the verdict is the mean of the two sessions.
  - **If every form misses:** king safety ships alone **only if** the king-safety-only evaluation is
    **≤ 1,100 ns** and `A1`–`A3`, `A6`–`A10` are green on that build. Mobility is re-cut to `Backlog` by
    BA/PM from the PR note, which records all three forms, the king-safety-only reading and the base,
    from one session. **If king safety alone misses: nothing ships**, stop to Architect/Design.
  - **Nothing is re-derived:** `A5`'s level stays 1,100 ns, and `ADR-0003` is not reopened.
- **`A6` (purity).** **Then** the position is byte-identical after evaluation, over the whole corpus
  — asserted, because a mobility term is the most likely place in this epic to call something that
  make/unmakes.
- **`A7` (depth does not regress).** **Given** a 3 s budget on `kiwipete` and `position-6`, **then**
  completed depth is **≥** the pre-`ABC-083` build's, same machine, same process. *(A leaf term is
  paid at every leaf; this is the criterion that notices.)*
- **`A8` (the isolated-pawn neighbour check reads BOTH adjacent files; added 2026-10-09).** This
  is QE's `ABC-082` gap G-QE-1 (`…9b4e2d61`, mutants `E8`/`E9` in `…5c1e7a20`). **Given**
  `src/evaluate.pawns.test.ts`, **then** it carries a row in the style of `ABC-082`'s `A3` in which a
  white pawn's only friendly neighbour stands on **one** adjacent file. There is one such case per
  side, left and right. **And** with QE's `E8` planted (the isolation check sees only the right-hand
  file), at least one of those rows is **red**, and likewise with `E9` (left-hand file only). Both
  are on the default lane of that file, and both rows are green with the mutant removed. The PR
  note records each mutant run: the command, the exit code and the red row. *(A red only on the
  class-P exact node pins elsewhere does not count. Those pins move with every evaluator change.)*
- **`A9` (`AR-NFR005-082`'s trigger, the owner's accepted risk; added 2026-10-09).** **Given**
  this ticket's build and its base, **then** the PR note carries two readings.
  - **Plain-node depth.** Repeat `ABC-082` `A6`'s read: `chooseMove` at `DEFAULT_BUDGET_MS` on
    `kiwipete` and `position-6`, on plain `node`, a fresh process per run, three rounds
    alternating with the base build, with the machine, the Node version and the 1-minute load
    recorded.
  - **Clock-free nodes to depth 7 on `kiwipete`.** Report the cumulative nodes to complete depth
    7, on base and on branch. The `ABC-082` reading was 532 363 → 610 179.

  **Depth below 6 on either position is FAIL: stop.** If `kiwipete` does not reach depth 7 on an
  uncontended reference machine, **stop and report to Security/NFR**. ~~**The owner decides whether
  depth 7 stays a level**~~ **Ruled 2026-10-10 by the owner (R2): depth 7 STAYS a level.** The route,
  `ADR-0031` decision 5: **mobility is cut first** (as in `A5`'s route); the depth reads are repeated
  with **king safety alone**; if king safety alone still loses depth 7, **nothing ships** and it goes
  back to the owner. Do not tune around it. *`A7` reads the same runs. A `kiwipete` drop from 7 to 6
  reds `A7`, and that drop is exactly this trigger. It is routed here, and `A7` is not re-levelled on
  this page.*

- **`A10` (the re-pin ledger; added 2026-10-10).** This is `ABC-082` `A8` applied here, with the
  same classes (**P** re-pinned from a measurement, **F** bite re-checked or fixture re-found, **R**
  never re-levelled; red = stop). Its PR-note lines and its opt-in lanes are the same. It covers
  three groups of rows:
  - every row of `ABC-082`'s § Merged bars, re-found at this ticket's base;
  - **also the rows that § lists as unable to move because the board has no pawns.** A mobility or
    king-safety term changes leaf values on every board. That includes `src/search.mate-corpus.ts`,
    the `ABC-081` `G6` knight pair and the depth-10 rook ending;
  - `ABC-079` `A1`'s hanging-corpus margins (on the corpus in the tree, including any rows
    `ABC-126` re-found).
  **And** `ABC-084`'s puzzle gate is green: `PUZZLE_DEEP=1` reads `solved ≥` the recorded baseline
  with `total` equal to the recorded total — **54/58 once `ABC-131` lands** *(was "40/40", stale since
  `ABC-127` recorded 58/62)*. The baseline file is not touched in this ticket's commits, and lowering it
  is the owner's word (`ABC-084` `A7`). **A red is a QE FAIL, read per `ADR-0034`:** QE classes each
  `NEWLY-MISSED` row on the readings ladder (+5 / +10 / +25 %) as **D** (budget drift → the owner, with
  `A9`'s nodes to depth 7 and `A7`'s depth reading beside it), **L** (label margin → re-found under
  `ADR-0028` decision 2, in its own commit, no owner word) or **B** (behaviour → the Engineer), worked in
  the order B, L, D. **A puzzle red never fires `A5`'s mobility cut and never licenses re-weighting**
  (`ADR-0034` decision 6).

## Dependencies

- ~~**`ABC-076` must land first — OPEN.**~~ **`ABC-076` — `Done`** (merged 2026-08-17).
- ~~**`ABC-082` should land first — OPEN.**~~ **`ABC-082` — `Done`** (accepted 2026-10-09, merged
  `0de4a93`). `A5`'s combined-cost bar and `A1`'s shared corpus (`src/evaluate.mirror-corpus.ts`)
  are on the base. Its evaluator reads **357.8–366.1 ns** (Security/NFR, `…c04abe30`), which leaves
  this ticket roughly 735 ns of `A5`'s 1,100.
- ~~**`ABC-078` must land first for `A7` — OPEN.**~~ **`ABC-078` — `Done`.** The deepening loop
  exists.
- **`ABC-084`'s trigger applies — live since 2026-10-10** (`ABC-084` merged `e634bc1`). This ticket
  changes `src/evaluate*.ts`, so QE runs `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` at
  review, and a red result is a QE FAIL, classed per `ADR-0034` (`A10`).
- **File overlap (2026-10-10).** `A10` re-pins rows in `src/quiescence.test.ts`, the file `ABC-126`
  edits. Do not build them in parallel. `ABC-126` goes first, so that this ledger reads the re-found
  rows. *(Its size is `S`, re-sized at its fold; it is `Ready for UAT`, owner word owed.)*
- **`ABC-131` must merge before this ticket enters `In Development`** *(added 2026-10-10;
  `ADR-0034` decision 5)*. It drops the four puzzle rows that sit on the budget edge (58/62 → 54/58),
  so a drift red on this ticket means > 25 % tree growth, not 4 %. It is ordered after `ABC-126`. **Pull
  order: `ABC-126` → `ABC-131` → this ticket.**
- **`ADR-0031`, `ADR-0034` accepted; R2 answered (keep depth 7)** — all 2026-10-10. No ruling is owed.
- **One reading for Architect/Design, not blocking** *(2026-10-10)*. `ADR-0034` decision 2 gives a drift
  class only when every **trigger-list file** the diff touches is `src/evaluate*.ts`. Read literally,
  `AGENTS.md`'s glob `src/search*.ts` also matches **test** files (`src/search.ordering.test.ts`,
  `src/search.pvs-lmr.test.ts`), and `A10`'s re-pins may touch them, as `ABC-082`'s merge did. Under
  that reading every missed row is class B. BA/PM reads "trigger-list file" as production engine code
  (`AGENTS.md`: "touches engine code"), so re-pinned test files do not count. **`UNKNOWN - verify`;
  owner: Architect/Design (`ADR-0034`).** Not a blocker: under either reading a red still has a route
  (B → `ADR-0028` decision 1's proofs → read again → the owner).
  **Answered: `ADR-0034` reading 2026-10-10** (decision 2's block). The scope test counts only
  engine-loadable files, the run trigger stays literal, and QE runs the ADR's scope command at review.

## Security / NFR triggers

- **`NFR-005` — this is the ticket most likely to break it.** `A5`'s **≤ 1,100 ns** total leaf cost
  and `A7`'s **non-decreasing completed depth** are both hard bars with a named owner
  (Architect/Design) for the overrun.
- **`NFR-005`, depth (added 2026-10-09).** `A9` carries `AR-NFR005-082`'s trigger. Depth 6 is the
  FAIL floor and depth 7 the WARN level (PROVISIONAL), read on plain `node`. Security/NFR
  adjudicates the reading, and only the owner moves a level.
- **`NFR-001`** — if mobility calls `legalMoves`, the per-node call count rises. **Report the
  measured calls per leaf**; the existing `gameend.nfr.test.ts` call-count guards must stay green.
- **`N8-LANE` — ≤ 650 ms CPU.** `A7`'s 3 s runs are **opt-in**, not default lane.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A5` before the term is tuned, not after.** The cheap-proxy decision is made by that
   measurement, and making it late means writing the term twice.
2. **`A6` matters more here than in `ABC-076`/`ABC-082`** — this is the term that might call
   `legal.ts`, and `zobristKey`'s transient mutation is already on this project's record.
3. **Extend the existing corpus and mirror helper. Third ticket, same helper, no fork.**
4. **`A4`'s ±100 cp ceiling is a guard, not a target.** Assert the bound and the ordering, not the
   value.
5. **`A8`: a strict ordering may not separate the mutant** *(added 2026-10-09)*. Under `E8`/`E9`
   the one-sided pair still scores one isolated pawn fewer than a fully isolated pair at equal
   material, so "scores higher" can stay green. QE's exact hand row `H20` (`a4` + `b2`, neither
   isolated, +25) is red under both mutants. A relation that only the isolated term can decide
   (like `A3`'s `a3`/`g3` row) works too. Prove the row with the mutants; do not rely on reading
   it.
6. **`A9` needs a quiet machine** *(added 2026-10-09)*. At a 1.05x margin, load alone moves
   `kiwipete` across depth 7 (Security/NFR read it lost under a spike on base too). Record the load
   with every round. The nodes-to-depth-7 read does not depend on the clock, so it is the number
   that does not move with load.

## Size and priority rationale

**Size `M` (3) — re-sized 2026-10-10 from `S` (2).** The terms are still small. The size comes
from `A10`, the same reason `ABC-082` went `S` → `M`. `ABC-082` re-measured about 20 exact values,
re-verified seven fixture bites, ran the six engine files' opt-in lanes (the PVS/LMR deep lane
alone is about 926 s wall) and took a three-round depth read. This ticket does all of that, on
**more** rows, because it also moves pawnless boards. It also adds the `A5` cost study and `A9`'s
second depth read. **Not `L`:** no new production module and no new dependency edge, unless `A5`
forces a cheaper mobility proxy. That proxy is a function inside `src/evaluate.ts`.

*Original rationale, `S` (2), kept as written:* Two additive terms on an existing module with an
existing test property. **The risk is in the measurement, not the volume of code** — and a risk
that is fully expressed as two hard-stop criteria does not make a ticket bigger, it makes it honest.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** Same reason as `ABC-082`: the engine plays sound chess without it.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM** (`owner-adrs-followups`, wave tip `246ddfc`). **Result: 10 of 10 —
MET → `Ready`.** Pull after `ABC-126` and `ABC-131` merge.
- **Item 10, ⚠️ → ✅.** Question 1 is ruled and accepted (`ADR-0031`). Question 2 is answered by the
  owner: depth 7 stays a level, and `A9` carries the route. Security/NFR's `R1` (how a puzzle red is
  read) is ruled and accepted (`ADR-0034`). Nothing is owed before the build.
- **Item 3 stays ✅.** `ABC-126` (`Ready for UAT`, owner's UAT word owed) and `ABC-131` (`Ready`) are
  merge-order predecessors with no open design question in either, so this is a pull order, not a
  dependency on a decision.
- **Item 4 stays ✅, folded.** `A5` gains its route (three forms, a two-session read near the bar, the
  cut condition); `A9` gains the ruled R2 route; `A10`'s stale "40/40" is replaced by the gate's own
  rule (`≥` the recorded baseline, `total` equal) and the per-row classification.
- **Item 5 stays ✅.** `ABC-131` added as predecessor; `ABC-126`'s size corrected (`S`). One reading
  question for Architect/Design is named in § Dependencies and is not blocking.
- **Items 1, 2, 6–9 stay ✅.** `M` (`ADR-0031`: no re-size; smaller if the cut fires), `P1`.
- **The likelier stop is `A9`, not `A5`** (`ADR-0031` § Consequences: the attack-map form plus king
  safety adds about 8–11 % of node time, against a depth-7 margin of 1.05–1.12x). That stop now has a
  defined route, so it does not hold `Ready`.

**Re-scored 2026-10-10 by BA/PM** (`rescore-batch-2026-10-10`, wave tip `71be48b`). **Result: 9 of 10,
1 ⚠️ — NOT met; stays in `Backlog`.**
- **Item 2 stays ✅, corrected.** Re-pinning was missing from scope. It is now in scope (`A10`).
- **Item 4 stays ✅.** Ten criteria. `A10` is the re-pin ledger.
- **Item 5 stays ✅.** `ABC-084`'s trigger is live. The file overlap with `ABC-126` is named.
- **Item 8 stays ✅, re-sized** `S` → `M`.
- **Item 10 stays ⚠️. What is open, exactly, and who rules it:**
  1. **Architect/Design (`ADR-0003`'s carrier) — must be answered before `Ready`:** *"If `A5`'s total
     leaf cost exceeds 1,100 ns with every mobility form the Engineer measures (legal-move count,
     pseudo-legal count, attack-map count), which ships: (i) king safety alone, with mobility
     re-cut as its own `Backlog` ticket; or (ii) nothing, with the ticket stopped until
     `ADR-0003`'s depth model is re-derived?"* The page says the Engineer must not drop the term on
     their own. With this answered, a miss on `A5` has a route instead of a stop.
  2. **The owner (`AR-NFR005-082`'s risk owner) — may answer now or keep it for the reading:**
     *"If `A9` shows `kiwipete` completing depth 6 but not depth 7 at `DEFAULT_BUDGET_MS` on an
     uncontended M3, does depth 7 stay a level (the ticket stops, and the terms are cheapened or
     cut until depth 7 holds), or is depth 7 retired on `kiwipete`, with the depth-6 FAIL floor
     kept?"* The owner reserved this for the reading when accepting the risk (`…8e3f0b17`). A stop
     with a named owner is a defined route, so BA/PM does not hold `Ready` on it.
  **When question 1 is answered on this page, item 10 is ✅ and the ticket is `Ready` (10/10).** **→ Question 1 RULED 2026-10-10 by
  Architect/Design in [`ADR-0031`](../../memory-bank/50-decisions/ADR-0031-a-mobility-term-that-misses-the-leaf-cost-bar-is-cut-and-king-safety-ships-alone.md)
  (`proposed`, owner acceptance owed): (i).** If every mobility form (legal, pseudo-legal, attack-map)
  misses `A5`, king safety ships alone (it must meet `A5` itself) and mobility is re-cut to `Backlog`.
  Nothing is re-derived and `A5` stays 1,100 ns. Question 2 is not ruled. Not re-scored: the verdict is BA/PM's.

**Fold re-read, 2026-10-09** (subtask `cut-followups-2026-10-09`, wave tip `7b54dae`). This hop
re-read the items the fold touched. **Result: 9 of 10, 1 ⚠️, NOT met; stays in `Backlog`.**
- **Item 3, ⚠️ → ✅.** All three dependencies are `Done` (§ Dependencies), so the ticket is
  independent.
- **Item 4 stays ✅.** It now has nine criteria. `A8` is a mutant-kill check, red under `E8` and
  under `E9`. `A9` repeats the depth read with a FAIL at depth 6 and an owner stop at depth 7.
- **Item 5 stays ✅.** `ABC-084`'s trigger is now named.
- **Item 6 stays ✅,** and now covers `NFR-005` depth.
- **Item 7 stays ✅,** with six test notes.
- **Item 10 stays ⚠️, and it is wider now.** It is still unknown whether mobility is affordable.
  `AR-NFR005-082` adds a second likely stop: at a 1.05x margin, `kiwipete` depth 7 will very likely
  be lost. Both stops are written as criteria (`A5`, `A9`) with named owners. Neither fallback is
  decided in advance.

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both terms named by the epic; the pain stated as observed behaviour |
| 2 | scope and out-of-scope clear | **✅** three fences, one recorded as a deliberate deferral with its reopening evidence |
| 3 | INVEST-shaped | **⚠️** **not independent** — three open dependencies, one of them soft |
| 4 | acceptance testable and measurable | **✅** seven: exact-equality mirror, three strict orderings, a **±100 cp** bound, a **≤ 1,100 ns** hard stop with a named owner, byte-identical purity, non-decreasing depth |
| 5 | dependencies known | **✅** three open tickets, one flagged as soft with the cost of ignoring it stated |
| 6 | security/NFR triggers with a measurable target | **✅** ≤ 1,100 ns, non-decreasing depth, reported `legalMoves` calls per leaf against merged guards |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), with the volume-vs-risk reasoning stated |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️** **whether mobility is affordable at all is genuinely unknown** — 2 × `legalMoves` per leaf is 4–10x over the modelled budget. `A5` makes it a stop rather than a surprise, **but the fallback (a cheaper proxy, or dropping the term) is not pre-decided and is Architect/Design's if the bar is missed** |

## Delivery

**Built 2026-10-10 by the Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-083`,
Workflow 04) on `grugops/ABC-083-king-safety-mobility` @ **`79248602`** (code), off
`grugops/wave-2026-09-25` @ `489c549e`. **Unmerged; not pushed. STOPPED: two class-R levels red, and
`PUZZLE_DEEP` red. Architect/Design rules the R rows; QE classes the puzzle row.** A pointer only: the
figures are in `.grugops/context/ticket-to-pr-ABC-083/notes/` and the raw output is in `probe/`.

- **Terms:**
  - King safety: shelter, plus a half-open or open file, over the king's file ±1.
  - Mobility in its attack-map form: non-pawn reach, 4 cp per square, clamped to ±100.
  - Weights are `ADR-0031`'s prototype, untuned.
  - One test-only door: `evaluateWithoutMobility`.
  - No new import edge.
- **`A1`–`A4`, `A6` MET** (`src/evaluate.king-mobility.test.ts`, new). There are 20 new positions.
  `A2`/`A3`/`A4` each carry an equal-material row that is red without the term, and each term's own
  mutant reds its row.
- **`A5` MET:** 775.8 ns, the mean of two sessions run in reverse order (1,100 bar), and 636 ns at
  `79248602`. The pseudo-legal form reads 1,574–1,767 ns and the legal form 10,057–10,861 ns; both
  miss. King safety alone reads 445–463 ns and base 346–383 ns. 0 generator calls per leaf
  (`NFR-001`). `ADR-0031`'s cut does not fire.
- **`A7`/`A9`:**
  - Depth 7 on 17 of 18 branch runs. kiwipete is 9/9; position-6 is 8/9, with one depth 6 in a
    load spike (load1 → 43.8). No depth below 6.
  - Nodes to depth 7 on kiwipete: 610 179 → 566 233. On position-6: **462 871 → 644 469 (+39%)**.
  - The position-6 margin is about 1.05x. **For Security/NFR.**
- **`A8` MET** (`src/evaluate.pawns.test.ts`, which the page does not name): the LEFT and RIGHT
  one-sided-neighbour rows. E8 and E9 each exit 1 with both rows red; both are green unmutated.
- **`A10`:**
  - The P rows are re-pinned from measurements.
  - Fixtures are re-found where the property was lost: pvs-lmr `A4`, the ordering tie, engine
    `A3`, the quiescence cap rig, and `ABC-082` `A2`'s kings (`ADR-0028` decision 2).
  - Every named mutant is red. The G6 pair is re-pinned. The hanging corpus margins are 160 → 173 cp.
  - **NOT MET: row 15** (`ABC-080` `A3` d2 guard, 43.56% against ≤ 40.5%) **and row 14** (`ABC-079`
    `A5` position-6 d2, 28.46x against ≤ 26x). Both are untouched. Both levels already carry their
    1.5x headroom: `ADR-0028` decision 4 applies, so this is a stop. The cause is one: mobility.
    King safety alone reads 27.66% and 18.29x.
  - **`PUZZLE_DEEP` 53/58 against 54/58:** seed 5061 is missed at d5 on every rung up to +25%.
    The scope command prints `src/evaluate.ts` only, so it reads as L. King safety alone also misses
    it.
- **Gate** (`79248602`):
  - lint, typecheck and build exit 0;
  - `npm test`: 53 files, 1 673 passed / **1 failed (row 15)**;
  - skip count 0; integrity `No findings.`.
- **Deep lanes at `79248602`:**
  - `SEARCH_DEEP` ordering 37/38 (row 15) and quiescence 36/37 (row 14);
  - `SEARCH_DEEP` transposition 40/40 and search 57/57;
  - `ENGINE_DEEP` transposition 26/26 and engine 46/46;
  - pvs-lmr 29/29 (1 117 s; drift 97.33% / 97.86%, max 51 cp; mate floor 0 / 180);
  - `PUZZLE_DEEP` **53/58, exit 1** (seed 5061).
- **Cost (`ADR-0035`):** on the 15-file narrow set, `N8-LANE` is **NOT MET**: +1.08 s CPU
  (+0.92..+1.41, R 0.316 s, admissible).
- **Clause (b) (`ADR-0036`) does not fire** on any limb. Production: `src/evaluate.ts` +137/−5. The
  owner's UAT word is owed.
