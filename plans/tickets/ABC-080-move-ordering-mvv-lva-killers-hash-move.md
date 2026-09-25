---
id: ABC-080
title: Move ordering — MVV-LVA, killer moves, hash move first
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-080 — where the epic says most of the strength-per-line-of-code lives

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). The epic's own scope
> says it: *"Move ordering is where most of the strength-per-line-of-code lives."* Cut as one ticket
> and not three because the three heuristics share one comparator, one call site and one
> measurement, and splitting them would produce three tickets that cannot be independently measured.

## Problem

*User*: the player waiting for a deeper move in the same 3 seconds.

*Pain*: alpha-beta's pruning power depends **entirely** on searching good moves first. With a
generator's natural order, alpha-beta approaches the unpruned node count; with near-perfect
ordering it approaches the square root of it. **`ABC-077` will land with the generator's order,
which is arbitrary.**

*Value*: this is the largest depth gain available in this epic, and depth is what `NFR-005` measures.
`plans/nfr-catalog.md` is explicit that ordering *"reduces the number of nodes needed to reach a
depth"* — it buys **depth**, which is exactly the live target.

## Scope

- **MVV-LVA** for captures — most valuable victim, least valuable attacker.
- **Killer moves** — two per ply, quiet moves that caused a beta cutoff at that ply.
- **Hash move first** — the best move from a transposition-table hit, tried before everything.
- One comparator, applied at each node before iterating the move list.
- **Both full-width recursions consume the same comparator** — `src/search.ts` and
  `src/engine.ts` (the abortable copy `ABC-078` built). Ordering one without the other would
  make `ABC-078`'s `A3` identity sweep compare two different algorithms (Architect/Design
  ruling `…f7e66060`, R1).

## Out of scope

- **History heuristic, counter-move heuristic, SEE-based capture ordering.** Not requested; coding
  rule 5. Add only with a measured node-count justification.
- **The transposition table itself** — `ABC-081`. **This ticket consumes a hash move if one is
  available and must work correctly when none is** (see `A5`).
- **Changing move *generation* order in `src/moves.ts`.** Ordering is the search's, not the
  generator's — `PERFT_DEEP` proves the generator 32/32 exact and this ticket does not touch it.

## Acceptance (Given/When/Then)

- **`A1` (the value is unchanged — the only test that catches an ordering bug).** **Given** the
  perft corpus at depth 3 and 4, **when** searched with and without ordering, **then** the returned
  **scores are identical** in every case. *(Ordering must change only the work. A comparator that
  drops or duplicates a move changes the score and passes every node-count test.)*
- **`A2` (the move list is a permutation, not a filter).** **Given** **≥ 200** positions, **then**
  the ordered list is an exact multiset permutation of `legalMoves(position)` — same length, same
  members — **200/200**. *(A comparator that loses one move is a search that cannot find one move,
  and it is invisible until it matters.)*
- **`A3` (it prunes materially harder).** **Given** `kiwipete` and `position-6` at depth 4, **then**
  ordered search visits **≤ 4%** of the nodes the unordered search visits. *(Re-leveled 2026-09-25
  from the generic ≤ 40% by Architect/Design ruling `…f7e66060` (R1): a faithful out-of-tree
  prototype of this comparator reads 2.64% on kiwipete and 2.10% on position-6, scores identical.
  The new bar is 1.5x the larger reading — `ADR-0024` decision 3's headroom rule — so it absorbs a
  legitimate evaluator change without passing a build that lost most of its ordering. Report the
  actual figure.)*
- **`A4` (each heuristic earns its place).** **Then** the node count on `kiwipete` **and
  `position-6`** is reported at **depth 4** for **four configurations** — none / MVV-LVA /
  +killers / +hash move — **and again at depth 5 on both positions**. **The delete rule is
  judged on the depth-5 reading**, not the depth-4 one: a heuristic whose depth-5 configuration
  does not reduce the node count is reported as such and is a candidate for deletion, not kept
  because it is conventional. *(Re-leveled 2026-09-25 by the same ruling, R1 point 2: at
  kiwipete depth 4, killers read −0.2%, which would falsely condemn them; at depth 5 they read
  −5.7% (kiwipete) and −20.5% (position-6). Depth 4 alone is not a fair delete-rule reading.)*
- **`A5` (correct with no hash move available).** **Given** an empty transposition table, or
  `ABC-081` not yet landed, **then** `A1`, `A2` and `A3` all hold. *(This ticket must not be blocked
  on the TT and must not break when the TT misses — which is the common case.)*
- **`A6` (killers are per-ply and do not leak).** **Given** an instrumented run, **then** a killer
  recorded at ply `n` is offered only at ply `n` of the same search, and the killer table is
  **cleared or invalidated between searches** — asserted, because a stale killer is a quiet move
  tried first for no reason.
- **`A7` (depth in budget improves).** **Given** a fixed 3 s budget on `kiwipete` and `position-6`,
  **then** the completed depth is **≥** the pre-ordering build's on the same machine in the same
  process. Report both.

## Dependencies

- **`ABC-077` must land first — OPEN.**
- **`ABC-078` must land first — OPEN.** `A7` needs a time budget.
- **`ABC-081` is NOT a blocker — deliberately** (`A5`). The hash-move arm is dormant until the table
  exists. **If `ABC-081` lands first, `A4`'s fourth configuration is measured; if not, it is
  recorded as not-yet-measurable and this ticket still closes.**

## Security / NFR triggers

- **`NFR-005` — this is the ticket with the largest expected effect on depth-in-budget.** Targets:
  `A3`'s **≤ 40%** node count and `A7`'s **non-decreasing completed depth** on `kiwipete` and
  `position-6`. **Report figures with node definition, position and machine.** No depth verdict is
  taken here; the levels stay as ratified and the depth-7 level stays PROVISIONAL until `ABC-074`.
- **`N8-LANE` — ≤ 650 ms CPU.** ⚠️ Depth-4 sweeps over the corpus (`A1`) will not fit. **The
  depth-3 subset stays in the default lane; the depth-4 sweeps and every 3 s run go behind an
  opt-in env flag**, following `PERFT_DEEP`'s established shape rather than inventing one.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A2` before anything else.** Every catastrophic ordering bug is a lost or duplicated move, and
   `A1` at shallow depth can miss it.
2. **`A4` is a delete-it-if-it-does-nothing test.** Write it so a useless heuristic is visible, and
   report the number even if it is disappointing.
3. **The unordered mode is test-only**, like `ABC-077`'s pruning switch. Do not ship a
   configurability option nobody asked for — coding rule 7.
4. **Do not re-test `src/moves.ts`.** Its order is arbitrary and that is fine; `A2` asserts the
   permutation property, not a generation order.
5. **Close `ABC-079` QE's surviving `G4` inside `A4`'s own measurement.** The mutant dropping
   `+ 0` for `ORDER_VALUE[promotion]` inside the shared `mvvLvaKey` currently kills nothing in
   any lane (`.grugops/context/qe-ABC-079/notes/20260924T215100Z-...-5d8a0f37.md`). `A4`'s
   per-heuristic node-count measurement is the natural place to close it: include a
   promotion-bearing capture fixture whose node count changes when the promotion term is
   dropped. Carried from the 2026-09-25 re-score; a test-notes addition, not a new criterion.

## Size and priority rationale

**Size `M` (3).** One comparator, a small per-ply killer table, and a four-configuration
measurement. **Not `L`:** each heuristic is a handful of lines; the cost is the measurement
discipline, not the code.

**Not `XL`. No `SPLIT_REQUIRED`** — splitting the three heuristics would produce three tickets that
share one comparator and cannot be independently measured, which is the opposite of INVEST.

**Priority `P0`.** It is the largest lever on the live `NFR-005` target.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the mechanism is stated (pruning depends on order) and the value is tied to the live target, not the retired one |
| 2 | scope and out-of-scope clear | **✅** three fences; the generator explicitly untouched |
| 3 | INVEST-shaped | **⚠️** **not independent** — two open tickets in front; **but deliberately independent of `ABC-081`**, which `A5` makes a criterion |
| 4 | acceptance testable and measurable | **✅** seven: identical scores, **200/200** permutation, **≤ 40%** nodes, a four-way per-heuristic measurement with a delete rule, correctness with an empty TT, per-ply killer scoping, non-decreasing depth in 3 s |
| 5 | dependencies known | **✅** two open blockers; one non-blocker argued with the criterion that makes it safe |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` ≤ 40% and non-decreasing depth; lane conflict named with a decided remedy following an existing pattern |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **the `≤ 40%` bar in `A3` is a conservative generic figure, not one measured on this codebase.** It is falsifiable and honest, but if the real figure is far better the bar will not detect a regression. **Re-set it from `A4`'s measured baseline at the ticket's own gate** — flagged so it is not left as a permanently loose guard |

## § DoR re-score — 2026-09-25 (BA/PM, task `rescore-abc080-081`, Workflow 07)

**9 of 10 clean, 1 ⚠️ — still NOT met; stays in `Backlog`.** Re-scored against the CURRENT wave
tree (`grugops/wave-2026-09-24` @ `e12452e`), not the page. Full reasoning, the `NFR-005`
depth-6 arithmetic and the `NFR-008` lane-realism check are in
`.grugops/context/rescore-abc080-081/notes/` — not restated here.

- **Item 3 (INVEST-shaped) flips ⚠️ → ✅.** `ABC-077` and `ABC-078` are both `Done`. `ABC-081`
  remains deliberately not a blocker (`A5`).
- **Item 10 stays ⚠️, unchanged.** The `A3` ≤ 40% bar is still self-flagged generic and
  unmeasured on this codebase; it resolves only at the ticket's own build-time gate, not here.
- **`ABC-079` landed since the last score, checked for overlap, no scope change needed.**
  `ABC-079` ships production MVV-LVA ordering inside `quiesce` (`src/quiescence.ts`,
  `mvvLvaKey`); this ticket's full-width comparator is a separate concern and already reuses
  that exported key rather than writing a second one.
- **QE's `G4` on `ABC-079`'s delta gate (the `mvvLvaKey` promotion term, `+ 0` for
  `ORDER_VALUE[promotion]`, is currently unguarded by any test) is pointed here.** `A4`'s
  per-heuristic node-count measurement is the natural place to close it with a
  promotion-bearing capture fixture — recorded as a test-notes addition for the build hop, not
  a new criterion and not a DoR defect.
- **The owner's word (2026-09-25) keeps the `NFR-005` depth-6 floor; not re-leveled here.**
  `A3`/`A7` as written are ratio/floor claims, not depth claims. Combined with `ABC-081`'s own
  bars, the two tickets' written criteria commit to roughly a 3.6x node-count reduction at a
  fixed depth — short of what three additional plies (depth 3 → 6) plausibly cost. Named
  plainly for the owner; no criterion re-leveled.

**Pullable today: NO.** Size `M`, priority `P0`, unchanged.

## § Ruling — 2026-09-25 (Architect/Design, task `wave-2026-09-24`, subtask `ruling-abc080-081`)

The reasoning and the probe are in `.grugops/context/ruling-abc080-081/notes/` (ruling `…f7e66060`,
observations `…e18c1093` and `…29d67423`) and are not restated here. **The wording of the
criteria stays BA/PM's. This section gives the numbers the wording should carry.**

- **DoR item 10 is discharged by measurement.** A faithful out-of-tree prototype of this ticket's
  comparator (MVV-LVA via `mvvLvaKey` + two killers per ply; the hash arm dormant) at fixed
  depth 4, against the unordered search, reads **2.64% on kiwipete (26 175 / 990 122) and 2.10%
  on position-6 (34 885 / 1 663 808)**. Scores are identical. The prototype reproduces
  `search.ts` to the node at d1–d3.
- **`A3`'s bar becomes ≤ 4%** on each position at depth 4: 1.5x the larger reading, `ADR-0024`
  decision 3's headroom rule. The old ≤ 40% would pass a build that had lost most of its
  ordering.
- **`A4` also reads at depth 5 on BOTH positions, and the delete rule is judged there.** At
  kiwipete d4 killers read −0.2%, which would falsely condemn them. At d5 they read −5.7%
  (kiwipete) and −20.5% (position-6).
- **The ordering goes into both recursions** (`src/search.ts` and `src/engine.ts`), so
  `ABC-078`'s identity sweep keeps comparing one algorithm. Ordering alone flipped 0 of 48 root
  moves against `search()`.
- **Expected effect on `NFR-005`:** depth **5 / 5** at 3 s on kiwipete and position-6 (from 3 / 3),
  a prototype reading, not a verdict. `A7` measures the real one.
- **Sequencing:** land this before `ABC-081`. `ABC-081`'s ≤ 70% bar is met only with this
  ticket's hash arm live (ruling 3).

## § DoR re-score — 2026-09-25 (BA/PM, task `refine-abc080-081-cut-c1`, Workflow 07)

**10 of 10 clean, 0 ⚠️ — MET. Ready to pull.** The Architect's ruling above discharges the one
remaining item.

- **Item 10 flips ⚠️ → ✅.** The `A3` bar is no longer a generic, unmeasured figure — it is
  set from this codebase's own measurement (ruling `…f7e66060`, R1): ≤ 4%, 1.5x the larger of
  2.64% / 2.10%. `A4` now reads at depth 5 on both positions so the delete rule is not judged on
  a depth-4 reading that can falsely condemn a heuristic (killers: −0.2% at d4, −5.7%/−20.5% at
  d5).
- **Scope** now names both consuming recursions (`src/search.ts`, `src/engine.ts`) explicitly,
  per the ruling's point 3 — `ABC-078`'s identity sweep stays a comparison of one algorithm.
- **Test notes** gain `ABC-079` QE's surviving `G4` (the unguarded promotion term in
  `mvvLvaKey`), pointed at `A4`'s own measurement — carried forward from the 2026-09-25
  re-score, still a test-notes item, not a criterion.
- **Every other item is unchanged from the 2026-09-25 re-score** (`.grugops/context/rescore-abc080-081/notes/20260925T120500Z-...-40536c8e.md`): problem, scope/out-of-scope,
  INVEST-independence (both blockers `Done`), acceptance testable/measurable, dependencies
  known, `NFR-005`/`N8-LANE` triggers, size `M`, priority `P0`.
- **Not re-leveled:** `NFR-005`'s depth-6 floor (owner's word), `A7`'s non-decreasing-depth
  floor, `N8-LANE`'s shape. The depth-6-path arithmetic — combined `ABC-080` + `ABC-081` +
  `C1` (cut as `ABC-121`) reaching depth 6/7 on this machine's probe — is recorded on the
  traceability row, not restated here.

**Pullable today: YES.** Size `M`, priority `P0`, unchanged. The Orchestrator makes the
`Backlog → Ready` board move.

## § Delivery — 2026-09-25 (Software Engineer, task `wave-2026-09-24`, subtask `ticket-to-pr-ABC-080`, Workflow 04)

**Built on `grugops/ABC-080-move-ordering`** (`a437b11` code + tests, `ac5215c` tied-root guard),
off `grugops/wave-2026-09-24` @ `4f74acc`. **NOT merged, NOT pushed.** Measurements, mutants, lane
and the design calls are in `.grugops/context/ticket-to-pr-ABC-080/notes/`, and the probes are in
`probe/` beside them. They are not restated here.

- **Delivered.** One comparator, `orderMoves`, and a two-slot-per-ply `KillerTable`, both in
  `src/search.ts` and consumed by **both** recursions, the root included (`src/engine.ts`). The
  order is: hash move, then captures/promotions by `mvvLvaKey`, then killers, then generation
  order. Test-only doors are `searchWithoutOrdering` and `searchWithoutKillers`. The hash-move
  arm is **dormant**: both recursions pass `null` until `ABC-081`. New
  `src/search.ordering.test.ts` carries `A1`–`A6`.
- **`A1` MET** (six roots, d3 + d4, scores identical). **`A2` MET** (375 positions × 4 inputs).
  **`A3` MET: kiwipete 2.64%, position-6 2.10%** at d4 (bar ≤ 4%).
  **`A4` MET for MVV-LVA and killers**, and the hash move is not yet measurable. d5 delete rule:
  killers −5.7% / −20.5%, so neither heuristic is a deletion candidate. **`A5` MET.**
  **`A6` MET** (instrumented run). **`A7` MET: kiwipete 3 → 6, position-6 3 → 5** at 3 s, same
  process, plain node. `ABC-079` QE's `G4` is closed.
- **Re-measured pins, moves and scores unchanged:**
  - `engine.test.ts` `A3` fixture budget 8 → 4;
  - `quiescence.test.ts` bare-leaf fingerprint 562 → 136 and 14 565 → 2 273 (flagged: a test
    file outside the Scope's two production files);
  - `search.test.ts` `A6` export list +4.
- **`N8-LANE` MET:** +10 ms net (+170 ms gross, inside the null control's spread). The lane is
  still over `NFR-008`'s 15 s, which is inherited.
- **Gates at `ac5215c`:** lint 0, typecheck 0, build 0, unit **44 files / 1 418 passed / 0
  skipped**, integrity `No findings.` `SEARCH_DEEP=1` 137/137 and `ENGINE_DEEP=1` 33/33.
  18/18 mutants killed.
- **Column:** still `In Development` on the page. The `In Review` move and the QE and
  Security/NFR hops are the Orchestrator's to schedule. This hop was fenced from `plans/board.md`.

## § QE — 2026-09-25 (QE/E2E, task `wave-2026-09-24`, subtask `qe-ABC-080`, Workflow 05)

**PASS WITH FINDINGS.** Reasoning, gate reproduction, mutant ledger and the numbers are in
`.grugops/context/qe-ABC-080/notes/` and are not restated here.

- `A1`–`A6` and `ABC-079` QE's `G4` re-read against the ticket and reproduced independently,
  MET. `A7` **UNKNOWN — verify** (not independently re-run across two builds this hop; the
  in-tree half reproduces the build's own reading).
- **Three flagged calls ruled:** the `quiescence.test.ts` re-pin is IN LICENCE (both recursions
  share the comparator by Scope; moves unchanged); `engine.test.ts` `A3`'s budget 8 → 4 is SOUND
  (node counts reproduce exactly); killers kept across one `chooseMove` call's iterations is
  ACCEPTED AS READ (the ticket's "cleared between searches" is ambiguous on the unit of
  "search"; flagged for BA/PM to firm up the wording, not a code gap).
- **Mutants:** the build's 18/18 default-lane reproduces as claimed on inspection, not re-run.
  Two new QE mutants on the comparator and the killer-update rule KILLED; **one, applied to
  `src/engine.ts`'s killer-update rule, SURVIVED the full default lane and `ENGINE_DEEP=1`
  (112/112, 33/33) — `G1`, a named non-blocking mutation-coverage gap** (the code is correct;
  no test would catch a regression of that one `if (alpha >= beta)` guard specifically inside
  `src/engine.ts`). Owner: Software Engineer, next licensed touch.
- **Gates reproduced:** lint 0, typecheck 0, build 0, unit 44/1 418/0 skip, skip-integrity
  `No findings.`, `SEARCH_DEEP=1` 57/57, `ENGINE_DEEP=1` 33/33.
- **`ABC-080` MAY LEAVE `In Review`.** The board move (toward `In Security/NFR`,
  `NFR-005`/`N8-LANE` triggered) is the Orchestrator's — fenced from this hop.
