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
  ordered search visits **≤ 40%** of the nodes the unordered search visits. *(Bar set from the
  generic alpha-beta result, deliberately conservative; report the actual figure.)*
- **`A4` (each heuristic earns its place).** **Then** the node count on `kiwipete` at depth 4 is
  reported for **four configurations** — none / MVV-LVA / +killers / +hash move. **A heuristic whose
  configuration does not reduce the node count is reported as such and is a candidate for
  deletion**, not kept because it is conventional.
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
