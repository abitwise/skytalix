---
id: ABC-081
title: Transposition table and in-tree repetition detection
status: done
column: Done
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-081 — one key array, two consumers. `ADR-0002` clause 3 built.

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **The table and in-tree repetition are ONE ticket, not two, and that is `ADR-0002`'s ruling, not a
> convenience.** Clause 3 has the search keeping **its own preallocated per-ply key array**, seeded
> once per search, deliberately **not** sharing the session's structure — and `ADR-0002` prices the
> repetition consumer at *"9–23 ns/node on top of a key the transposition table already needs"*.
> **Two tickets would each build a key array and the second would discover the first's.** That is
> the failure `ADR-0002` exists to prevent: *"`EPIC-004` would then build a second, incompatible
> notion of the path."*

## Problem

*User*: the player who does not want to wait, and who does not want to be "beaten" by repetition.

*Pain*: **(a)** chess transposes constantly; without a table the search re-searches the same
positions along different move orders, which is a straight multiplier on the node count `NFR-005`
converts into depth. **(b)** `ADR-0002` names the second half plainly: *"a search blind to repetition
will happily 'win' by repeating"* — it will evaluate a drawn repetition as a winning line.

*Value*: depth, and a search that knows a draw is a draw.

## Scope

- A **transposition table** keyed on the Zobrist key, storing depth, score, a bound flag
  (exact / lower / upper) and the best move (which `ABC-080` consumes as its hash move).
- Replacement policy, stated explicitly in the ticket's delivered code comment.
- A **preallocated per-ply key array**, seeded once per search — `ADR-0002` clause 3, verbatim.
- **In-tree repetition detection** off that same array: a position repeating within the search path
  scores as a draw.
- **The table is its own fixed-size module, separate from the per-ply key array** — `ADR-0025`
  (proposed, Architect/Design ruling `…a937c4bd`, R3). It shares the key **value** read from
  `keys[ply]`, never the array's storage, seeding or lifetime. It is cleared at every
  `chooseMove` / `search()` entry, spans all iterative-deepening iterations of one move, and is
  **not** carried across moves. Only full-width nodes probe and store it; quiescence does
  neither. Design point: 2^18 entries × 16 B = 4 MiB.

## Out of scope

- **The incremental key itself** — `ABC-075`. This ticket **consumes** it.
- **The session's repetition history and threefold draw claim** — `EPIC-002`/`src/history.ts`,
  merged. `ADR-0002` clause 3 says the search **does not share that structure, deliberately**. **Do
  not import `history.ts` into the search.**
- **What the key hashes.** `ADR-0005` and `ADR-0006` are ratified.
- **Multi-threaded table access.** Threading is `UNKNOWN - verify` and Architect/Design's.

## The inherited caveat, named because `ADR-0006` says it will be asked again

`ADR-0006` records that the key hashes castling **rights**, not availability, and that
**`EPIC-004` inherits this**: *"a transposition table keyed on this hash will treat two placements
alike"* under that rule. The ADR also says the question *"will be asked again by whoever builds
`EPIC-004`'s transposition table."* **I am asking it and I am not answering it.** **Owner:
Architect/Design.** If the answer is "unchanged", this ticket proceeds as written; if the hash
changes, `ABC-075` changes with it. **A ratified ADR is not re-opened by a ticket.**

**Ruled 2026-09-25 (Architect/Design, ruling `…23e0307f`, R2): UNCHANGED — and for a table the
rights key is *required*, not merely safe.** This ticket proceeds as written; `ABC-075` does not
move. On `ADR-0006`'s own `knight-g1` pair (same placement, same current moves, one unusable
right) the subtrees differ: perft 3 reads 1 335 vs 1 320, `search` at depth 3 reads 850 vs 830.
An availability key would return a wrong score, not merely waste a probe. `ADR-0006` gains a
dated amendment section and falsifier `G6`: a TT-keyed search reporting a score that differs
from the table-off search at the same depth, on a pair differing only in castling rights, is a
FAIL — checked by this ticket's own `A1`.

## Acceptance (Given/When/Then)

- **`A1` (the table changes work, not value).** **Given** the perft corpus at depth 4, **when**
  searched with the table enabled and disabled, **then** the returned **scores are identical** in
  every case. *(The single most dangerous class of TT bug is a bound flag applied at the wrong depth
  or window, and it shows up only as a wrong score.)*
- **`A2` (it hits, and the hit rate is reported).** **Given** `kiwipete` and `position-6` at depth 5,
  **then** the table hit rate is reported and is **≥ 15%**. *(A table that never hits is a
  memory leak with a lookup.)*
- **`A3` (node count falls, measured in the engine's shape).** **Given** `kiwipete` and
  `position-6`, **when** searched by iterative deepening to depth 5 with `ABC-080`'s ordering
  and hash move plus this ticket's table on, **then** cumulative node count is **≤ 70%** of the
  same iterative-deepening search with the table off (ordering still on). Report the actual
  figure. *(Re-stated 2026-09-25 by Architect/Design ruling `…a937c4bd` (R3): as originally
  written — fixed depth 5, table only — this reads 80.4% (kiwipete) / 81.2% (position-6) and
  FAILS ≤ 70%. In the engine's cumulative-iterative-deepening shape, with `ABC-080`'s hash move
  live, it reads 63.2% / 49.7% and passes. `ABC-080` is therefore a prerequisite for this
  criterion's measurement — see Dependencies.)*
- **`A4` (mate scores are stored correctly relative to the root).** **Given** a mate-in-2 position
  reached at two different plies of the same search, **then** the reported mate distance is correct
  at **both**. *(Storing a root-relative mate score in a depth-relative table is the classic TT bug
  and it makes the engine claim mates that are not there.)*
- **`A5` (in-tree repetition scores as a draw).** **Given** a position from which the only
  non-losing continuation repeats, **then** the search scores the repetition **exactly 0** and does
  not report it as a win for either side.
- **`A6` (the key array is the search's own).** **Then** grep of the delivered search modules finds
  **no import of `src/history.ts`** — `ADR-0002` clause 3 as a criterion, not a comment. And the
  array is allocated **once per search**, not per node (asserted by an allocation spy or by a
  size-invariance check).
- **`A7` (bounded memory).** **Given** a 3 s search, **then** table memory stays within a stated
  fixed bound and does not grow with search time — a fixed-size table, not a growing `Map`.
- **`A8` (nothing else moved).** **Then** `src/history.ts`, `src/legal.ts` and `src/turn-loop.ts`
  are **byte-identical**; suite green; skip **0**.

## Dependencies

- **`ABC-075` and `ABC-077` — `Done`** (confirmed against `grugops/wave-2026-09-24`, re-score
  2026-09-25).
- **`ABC-080` must land first, for `A3`'s measurement — changed 2026-09-25.** `A3`'s ≤ 70% bar
  is met only with `ABC-080`'s ordering and hash move live (ruling `…a937c4bd`, R3): the
  fixed-depth-5, table-only reading FAILS at 80.4% / 81.2%; the iterative-deepening,
  hash-move-live reading passes at 63.2% / 49.7%. `A1`, `A2`, `A4`–`A8` do not need `ABC-080` —
  `ABC-080`'s own `A5` makes the empty-table case a criterion there, so this ticket is not
  blocked on `ABC-080` for anything but `A3`.
- **`ADR-0006`'s inherited caveat — RULED 2026-09-25, unchanged.** Named above; this ticket
  proceeds as written (ruling `…23e0307f`, R2).
- **Whether the table's storage sits with, or separate from, the `ADR-0020` per-ply key array —
  RULED 2026-09-25: SEPARATE** (`ADR-0025`, proposed; ruling `…a937c4bd`, R3). Named in Scope
  above.

## Security / NFR triggers

- **`NFR-005`** — `A3`'s **≤ 70%** node count and `A2`'s **≥ 15%** hit rate are this ticket's
  contribution to depth-in-budget. Figures carry node definition, position and machine.
- **`NFR-001`** — `A8`'s byte-identical `src/legal.ts` and the existing call-count guards.
- **`N8-LANE` — ≤ 650 ms CPU.** ⚠️ Depth-4/5 sweeps do not fit; **opt-in env flag** for the sweeps,
  a shallow subset in the default lane. Same shape as `ABC-077` and `ABC-080`.
- **Memory — `A7`'s stated fixed bound.** This is the first component in the project that holds
  meaningful memory, and there is **no memory NFR row in `plans/nfr-catalog.md`**. *(Recorded as a
  gap; setting one is Architect/Design's and Security/NFR's, not BA/PM's. `A7` binds the ticket to a
  stated bound regardless.)* **`NFR-009` is now PLACED, 2026-09-25** (Security/NFR, task
  `wave-2026-09-24`, subtask `place-nfr009`, `plans/nfr-catalog.md` row `NFR-009`), on the owner's
  word: search-held memory **≤ 16 MiB total** (the transposition table, the per-ply key array and
  `ABC-080`'s killer table, together), with `heapUsed` and `arrayBuffers` each **≤ 1 MiB** growth
  between a 1 s and a 3 s search, read after `gc()`. **128 MiB is the ceiling of any re-level, not
  the level** — a re-level needs a measured need on record. **Build-hop note carried from the
  row:** a 2^20-entry table alone is 16.00 MiB and breaks the total on its own; **2^19 entries
  (8 MiB) fits.** `A7` now checks against `NFR-009`, not against nothing.
  - **Open, named for the owner, not decided here (Security/NFR's recommendation on `ABC-080`'s
    page): which runner `NFR-005` binds — plain node or vitest.** The two read a different depth
    on the same code (plain node kiwipete 3 → 6 / position-6 3 → 5; vitest 2 → 4 / 3 → 4).
    Security/NFR recommends plain node, matching how `npm run chess` runs; the owner's word
    ratifies it, not this re-score. `NFR-005`'s depth-6 verdict is due at this ticket's close and
    is not re-leveled here.
  - **Fold-in, named for the Engineer (QE `ABC-080` `G1`, non-blocking):** a mutant on the
    killer-update-on-cutoff-only rule survives in `src/engine.ts`'s `negamax` (the same rule IS
    caught in `src/search.ts`'s recursion). This ticket touches `src/engine.ts`, so it is the next
    licensed touch — close `G1` here with one exact node-count pin at a fixed injected-clock
    budget, the same shape as the existing `A3` fixture (QE's estimate, not re-measured by this
    re-score).
- **Security — not triggered.** No input surface.

## Test notes

1. **`A4` first.** Mate-score storage is the bug that survives every other test and makes the engine
   lie about mates.
2. **`A1` needs a table-disabled mode**, test-only, like `ABC-077`'s and `ABC-080`'s switches.
3. **`A5`'s position must be constructed, not found.** Write the repetition line explicitly.
4. **Do not test the session's threefold rule here.** `src/gameend.ts` owns it and `A6` forbids the
   import.
5. **`ADR-0006`'s falsifier `G6`.** A TT-keyed search reporting a score that differs from the
   table-off search at the same depth, on a pair differing only in castling rights, is a FAIL.
   Name the fixture pair explicitly (`ADR-0006`'s `knight-g1` pair or an equivalent) inside
   `A1`'s table-on/off comparison — no separate test required.
6. **`ABC-078`'s `A3` identity sweep needs one amendment this ticket's build hop owes.** The
   hash move flips 1 of 48 *tied* root moves against unordered `search()` (0 of 48 score
   mismatches, d1–d4) — the move comparison in `ABC-078`'s identity sweep must accept a root
   move of equal score. Recorded here so the build hop inherits it rather than re-deriving it;
   not a new criterion on this ticket.

## Size and priority rationale

**Size `M` (3).** A fixed-size array-backed table, an entry encoding, a replacement rule, a per-ply
key array and a repetition check that is a scan over that array. **Not `L`:** the key it depends on
is `ABC-075`'s and the ordering that consumes it is `ABC-080`'s.

**Not `XL`. No `SPLIT_REQUIRED`** — and it is deliberately not split into "table" and "repetition"
because `ADR-0002` clause 3 makes them one structure.

**Priority `P0`.** `ADR-0002` names in-tree repetition as a correctness requirement, not an
optimisation, and the table is the second-largest depth lever after ordering.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two pains, the second quoted from `ADR-0002` as a correctness issue |
| 2 | scope and out-of-scope clear | **✅** four fences, one of them a ratified prohibition made into `A6` |
| 3 | INVEST-shaped | **⚠️** **not independent** — sits behind `ABC-075`, which is itself blocked |
| 4 | acceptance testable and measurable | **✅** eight: identical scores, **≥ 15%** hits, **≤ 70%** nodes, mate distance correct at two plies, exact-0 repetition, a grep-level import prohibition, a stated memory bound, three byte-identical files |
| 5 | dependencies known | **⚠️** **`ADR-0006`'s inherited caveat is OPEN** and is Architect/Design's. Named, asked, and deliberately unanswered here |
| 6 | security/NFR triggers with a measurable target | **✅** hit rate, node ratio, lane bar — **but see 10** |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **there is no memory NFR row in `plans/nfr-catalog.md`** and this is the first component that needs one. `A7` binds the ticket to a stated bound, but **no project-level bar exists to check it against.** Owner: Architect/Design + Security/NFR. Not BA/PM's, and not edited |

## § DoR re-score — 2026-09-25 (BA/PM, task `rescore-abc080-081`, Workflow 07)

**8 of 10 clean, 2 ⚠️ — still NOT met; stays in `Backlog`.** Re-scored against the CURRENT wave
tree (`grugops/wave-2026-09-24` @ `e12452e`), not the page. Full reasoning and the `NFR-005`
depth-6 arithmetic are in `.grugops/context/rescore-abc080-081/notes/` — not restated here.

- **Item 3 (INVEST-shaped) flips ⚠️ → ✅.** `ABC-075` (the incremental key this ticket
  consumes) and `ABC-077` are both `Done`. `ABC-080` remains not a blocker in either direction.
- **Item 5 (dependencies known) stays ⚠️, and a second open ruling is named.** `ADR-0006`'s
  inherited caveat (castling rights vs. availability in the hash) is re-checked and still
  open — no note answers it for `EPIC-004`. **New, previously implicit in the ticket's own
  scope prose, now named as its own open item:** whether the TT's own storage shares
  allocation/seeding with the `ADR-0020` per-ply key array, or is a second, independently
  persisted structure. Both are Architect/Design's; neither ruled here.
- **Item 10 stays ⚠️, unchanged.** `plans/nfr-catalog.md` re-checked directly (`NFR-001`–
  `NFR-008`, none a memory bound) — the gap is unchanged since 2026-08-16.
- **The owner's word (2026-09-25) keeps the `NFR-005` depth-6 floor; not re-leveled here.**
  `A2`/`A3` as written are hit-rate/ratio claims, not depth claims. Combined with `ABC-080`'s
  own bars, the two tickets' written criteria commit to roughly a 3.6x node-count reduction at
  a fixed depth — short of what three additional plies (depth 3 → 6) plausibly cost. Named
  plainly for the owner; no criterion re-leveled.

**Pullable today: NO.** Size `M`, priority `P0`, unchanged. **Recommended routing: send the two
open Architect/Design rulings ahead of a pull, in parallel with (not blocking) `ABC-080`'s own
path forward.**

## § Ruling — 2026-09-25 (Architect/Design, task `wave-2026-09-24`, subtask `ruling-abc080-081`)

The reasoning and the probe are in `.grugops/context/ruling-abc080-081/notes/` (rulings
`…23e0307f`, `…a937c4bd` and `…4dd1bbaa`; observations `…11853121` and `…30cea5d2`) and are not
restated here.

- **Item 5a, `ADR-0006`'s inherited caveat: UNCHANGED, so this ticket proceeds as written and
  `ABC-075` does not move.** For a table, the rights key is *required*, not merely safe.
  - On `ADR-0006`'s own `knight-g1` pair (same placement and same current moves, one unusable
    right) the subtrees differ: perft 3 reads 1 335 vs 1 320 and `search` d3 reads 850 vs 830.
  - An availability key would return a wrong score.
  - Recorded as a dated amendment to `ADR-0006`, with falsifier `G6`.
- **Item 5b, table storage vs the `ADR-0020` per-ply key array: SEPARATE** (`ADR-0025`, proposed).
  - The table shares the key value read from `keys[ply]`, never the array's storage, seeding or
    lifetime.
  - The table is a fixed-size typed-array module that verifies the full 64-bit key. The design
    point is 2^18 × 16 B = 4 MiB.
  - It is cleared at every `chooseMove` / `search()` entry and spans the iterations of one move.
    It is not carried across moves.
  - Only full-width nodes probe and store it. Both recursions use it, and `search.ts` gains one
    test-only door, `searchWithoutTable`.
  - The key array gets a capacity guard, a runaway guard and not a depth budget.
- **Item 10, the memory row: DRAFTED, NOT PLACED.** `NFR-009` (draft, in the ruling note) says:
  - search-held memory is fixed at ≤ 16 MiB;
  - `heapUsed` and `arrayBuffers` each move ≤ 1 MiB between a 1 s and a 3 s search, read after
    `gc()`;
  - the `heapUsed` read is the one that catches a growing `Map`, and it must be watched going RED
    first.

  Security/NFR places it, on the owner's word. **Item 10 stays ⚠️ until then.**
- **NEW, for BA/PM: `A3` as written reads 80.4% (kiwipete) and 81.2% (position-6) at fixed
  depth 5, and FAILS ≤ 70%.**
  - In the engine's shape (iterative deepening, cumulative nodes to d5, table + hash move vs no
    table) it reads **63.2% and 49.7%**.
  - Recommended: re-state `A3` in that shape, and make `ABC-080` a prerequisite for `A3`'s
    measurement. Hit rate `A2`: 19.0% / 18.2% at fixed d5 and 50–59% under iterative deepening.
    ≥ 15% holds either way.
- **`ABC-078` `A3` identity sweep:** scores stay exact (0 of 48 mismatches, d1–d4). The root hash
  move flipped 1 of 48 *tied* moves, so the move comparison must accept an equal-scored move.
  That amendment belongs to this ticket's build hop.
- **Expected effect on `NFR-005`, with `ABC-080` in:** depth **6 / 6** at 3 s, margins 1.93x /
  1.51x. A prototype reading, not a verdict.

## § DoR re-score — 2026-09-25 (BA/PM, task `refine-abc080-081-cut-c1`, Workflow 07)

**8 of 10 clean, 2 ⚠️ — still NOT MET; stays in `Backlog`.**

- **Item 5 (dependencies known) flips ⚠️ → ✅.** Both open Architect/Design rulings the
  2026-09-25 re-score named are now answered: `ADR-0006`'s inherited caveat is unchanged
  (ruling `…23e0307f`), and the table's storage is ruled separate from the per-ply key array
  (`ADR-0025`, proposed, ruling `…a937c4bd`). Both are folded into Scope, the inherited-caveat
  section and Dependencies above; no ruling stays open.
- **Item 3 (INVEST-shaped) flips ✅ → ⚠️ — a new blocker, honestly named.** The 2026-09-25
  re-score held this ✅ because "`ABC-080` remains not a blocker in either direction." That is
  no longer true: the same ruling that answers item 5 also re-states `A3` in a shape that needs
  `ABC-080`'s hash move live to pass (63.2% / 49.7% vs. a failing 80.4% / 81.2% without it) —
  see the re-stated `A3` and the changed Dependencies entry above. `ABC-080` is `Backlog`, not
  `Done`, as of this cut. This ticket is **not independent of `ABC-080` for `A3`'s measurement**,
  the same shape of gap that held item 3 open against `ABC-075`/`ABC-077` before they landed.
  `A1`, `A2`, `A4`–`A8` remain buildable without `ABC-080`.
- **Item 10 stays ⚠️, per this subtask's own fence.** `NFR-009` is now drafted (R4,
  `…4dd1bbaa`) but **not placed** in `plans/nfr-catalog.md` — that pen is Security/NFR's, on the
  owner's word, and is explicitly out of this subtask's scope. `A7` binds the ticket to a stated
  bound with nothing to check it against until `NFR-009` is placed.
- **Net score is unchanged at 8/10** — one item closed (5), one opened (3), one held open by
  fence (10). This is not a wash dressed as progress: the two open items are now different in
  kind. Item 3's blocker (`ABC-080` landing) is schedule-bound and resolves the moment `ABC-080`
  is `Done` — and `ABC-080` re-scores **10/10, Ready** at this same cut (see its own page).
  Item 10's blocker (an owner ratification of a drafted NFR row) is not schedule-bound to this
  wave at all.
- **`NFR-005`'s depth-6 floor — owner's word kept, not re-leveled.** Same arithmetic as the
  2026-09-25 re-score: `A2`/`A3` are hit-rate/ratio claims, not depth claims. The traceability
  row for this cut records the fuller depth-6/7 path (`ABC-080` → `ABC-081` → `C1`/`ABC-121`).

**Pullable today: NO.** Size `M`, priority `P0`, unchanged. **Recommended routing: pull `ABC-080`
first (10/10, Ready) — it both stands on its own and discharges this ticket's item-3 blocker.
Item 10 (`NFR-009` placement) routes to Security/NFR in parallel; it does not gate `ABC-080`'s
pull and did not gate this ticket's item-3 resolution.**

## DoR item 10

**2026-09-25, Security/NFR (task `wave-2026-09-24`, subtask `place-nfr009`): the memory row now EXISTS.** `NFR-009` is placed in `plans/nfr-catalog.md` on the owner's word (*"16MiB sounds small in todays standards, if more is needed you can extend it to 128MiB. I approve otherwise."*). The level is **16 MiB total** search-held memory, with **≤ 1 MiB** growth in `heapUsed` and in `arrayBuffers` between a 1 s and a 3 s search, read after `gc()`. 128 MiB is the ceiling of any re-level, not the level. `A7` now checks against `NFR-009`. Two points for the build hop, both written into the row. First, a 2^20-entry table (16.00 MiB alone) breaks the total; 2^19 fits. Second, `ABC-080`'s `KillerTable` has no `byteLength`, so the `heapUsed` read (c) counts it. **This page's item 10 is NOT re-scored here. BA/PM re-scores it.**

## § DoR re-score — 2026-09-25 (BA/PM, task `wave-2026-09-24`, subtask `rescore-abc081`, Workflow 07)

**10 of 10 clean — MET. `ABC-081` is Ready.** Re-scored against the current wave tree
(`grugops/wave-2026-09-24` @ `d585ece`), not the page.

- **Item 3 (INVEST-shaped) flips ⚠️ → ✅.** The open question was whether `ABC-080`'s code being
  on the build base discharges it, and it does: `A3`'s ≤ 70% bar needs `ABC-080`'s ordering and
  hash move **live at build time**, not a signed-off `ABC-080`. `ABC-080`'s code merged onto the
  wave at `caabd13`/`d585ece` (QE PASS WITH FINDINGS, Security/NFR PASS_WITH_RISKS), and this is
  the branch `ABC-081`'s own build hop starts from — so the hash move is live on the base this
  ticket builds against, independent of `ABC-080`'s own `Ready for UAT` / owner's-word status.
  Independence for `INVEST` asks whether this ticket can be built and its acceptance measured
  without waiting on another ticket's own board progress; the code dependency it actually needed
  is satisfied now.
- **Item 10 (no major unresolved blocker) flips ⚠️ → ✅.** `NFR-009` is placed in
  `plans/nfr-catalog.md` (Security/NFR, subtask `place-nfr009`, 2026-09-25, on the owner's word):
  ≤ 16 MiB total, ≤ 1 MiB growth in `heapUsed`/`arrayBuffers` between a 1 s and a 3 s search.
  `A7` now has a stated project-level bar to check against. Folded into Security/NFR triggers
  above, with the build-hop note (2^19 fits, 2^20 does not) carried forward.
- **Items 1, 2, 4–9 unchanged, all clean** — re-checked, no regression against the current tree.
- **Also folded in, per this subtask (not DoR items, but criteria/scope inputs the build hop
  inherits):** QE `ABC-080` `G1` (close the surviving `engine.ts` killer-update mutant here, since
  this ticket touches `engine.ts`) and the owner's open, undecided question on which runner
  `NFR-005` binds (Security/NFR recommends plain node) — both above, under Security/NFR triggers.
  The `ABC-080`-page wording QE asked BA/PM to firm up (killers cleared between `chooseMove` calls,
  not between iterations) is fixed on `ABC-080`'s own page, `A6`, not here.

**Pullable today: YES.** Size `M`, priority `P0`, unchanged. **Recommended routing: pull
`ABC-081` into `Ready` — the Orchestrator's board move, out of this subtask's fence.**

## § Security/NFR — 2026-09-25 (Security/NFR, task `wave-2026-09-24`, subtask `secnfr-ABC-081`, Workflow 15)

**PASS_WITH_RISKS.** Reviewed `6033d05..504f046 -- src`. The measurements, harnesses and
reasoning are in `.grugops/context/secnfr-ABC-081/notes/` and are not restated here. **Not a
stamp.**

- **`NFR-005`: MET on the binding runner.** Plain node reads kiwipete **6** and position-6
  **6** in 5 of 5 rounds (base 6 / 5), with load 3.6–4.6. Depth 6 completes by 2.0 s.
  - **Depth 7 is not reached, so it stays WARN (PROVISIONAL).**
  - Vitest reads 5 / 5. That is reported, not the verdict.
- **`NFR-009`: MET.** The total is about 4.00 MiB against 16 MiB. `arrayBuffers` grew +0.000 MiB
  from 1 s to 3 s and across 30 calls. **There is no measured need for more:** 2^16, 2^18 and
  2^20 tables all read depth 6.
- **`NFR-004`: HOLDS.** Plain-node p95 is 3 004.3 ms and the ceiling reads 4 999.8–5 008.8 ms.
  The clear per search costs ≤ 0.062 ms.
- **`N8-LANE`: MET.** The charge is +360 ms CPU gross, +200 ms net, against an admissible null.
  The build's +220 / +60 is confirmed and corrected upward in size.
- **Security (ASVS L1): no finding.**
  - The table is index-safe and every hit is verified on the full 64-bit key.
  - No stored move is replayed without legality: the hash move is matched only inside the node's
    own legal list.
  - The capacity guard is unreached in play. The deepest iteration found at 5 s is 40, against
    128.
- **Two LOW risks, each with an owner.**
  - K4's hang class, plus the lack of an OS-level timeout on `npm test`. It is test-API-only and
    fails closed. **Owner: the Orchestrator.**
  - K3: the capacity guard is untested. **Owner: the Software Engineer.**
- **For the owner:**
  - ratify the proposed `NFR-005` "Runner: plain `node`" wording (decision note § 6);
  - close `AR-NFR005-079`;
  - UAT needs your word, because production lines are more than 0.

## § QE — 2026-09-25 (QE/E2E, task `wave-2026-09-24`, subtask `qe-ABC-081`, Workflow 05)

**PASS WITH FINDINGS.** Reviewed at `504f046`. Full reasoning, every reproduced figure and the
mutant re-sample table are in `.grugops/context/qe-ABC-081/notes/` — not restated here.

- **`A1`–`A8` all MET, independently reproduced** (gates, `SEARCH_DEEP` 40/40, `ENGINE_DEEP`
  26/26+33/33, all re-run in full, not sampled). `A2`'s narrow margin (15.95% / 15.38% vs 15%)
  is checked and confirmed **stable, not a coin-flip** — three re-runs return byte-identical
  percentages — but it stays thin; a fragility note, not a defect.
- **`A4`'s literal search-level mate-in-2 wording still has no fixture.** A second, independent
  225-combination scan (non-overlapping with the build's own 728) again found no reused
  mate-in-two root-score flip. The correctness claim rests on the table's own unit tests, which
  are generic in distance and pass. Non-blocking, named for whoever next touches
  `src/transposition.ts`.
- **Six design calls ruled, all ACCEPTED**, with reasoning: exact-depth-only cutoff,
  always-replace, `ABC-080`'s ordering doors keeping the table off, the three new exports, the
  two forced edits, and the three re-measured pins.
- **Mutant ledger re-sampled (8/27), all reproduce exactly.** K3 (capacity guard) genuinely
  survives, traced to being unreachable while `search.ts`'s `!(depth >= 1)` root guard stands —
  not a live gap today. **K4 surfaces an operational finding the build's own note did not:** the
  hang it triggers is synchronous CPU-bound work vitest's `testTimeout` cannot interrupt, and
  plain `npm test` carries no OS-level timeout wrapper — a future regression of that class would
  hang the gate itself rather than fail red. Named for the next licensed touch of `src/search.ts`
  or `AGENTS.md`'s Test slot.
- **Game-level smoke test added:** `npx tsx src/cli.ts --colour white` scripted through the CLI
  ran clean (2 human + 2 engine plies, resignation), no crash. A session-level
  fivefold-repetition game was not additionally scripted — out of this ticket's own scope
  (test note 4) and `A8` already shows the session-repetition files untouched.
- **`NFR-005`/`NFR-009`/`N8-LANE` reported, not ruled**, per this subtask's fence. `NFR-005`
  (plain-node depth 6/6) and `NFR-009` (heapUsed/arrayBuffers growth) independently re-measured
  and match the build; `N8-LANE` recorded as the build reported it (not independently re-run).

**`ABC-081` MAY LEAVE `In Review`; the board move (toward `In Security/NFR`) is the
Orchestrator's.**

## § Delivery — 2026-09-25 (Software Engineer, task `wave-2026-09-24`, subtask `ticket-to-pr-ABC-081`, Workflow 04)

**Built on `grugops/ABC-081-transposition-table`**, off `grugops/wave-2026-09-24` @ `6033d05`:
the code is at `318c11a`, and three default-lane rows were added at `0076e6a`. **NOT merged, NOT
pushed.** The measurements, mutants, lane and design calls are in
`.grugops/context/ticket-to-pr-ABC-081/notes/`, with the probes in `probe/` beside them. They are
not restated here.

- **Delivered.**
  - `src/transposition.ts` (new, `ADR-0025`): 2^18 × 16 B = 4 MiB of typed arrays; the full key
    is verified; always-replace; cleared at every `search()` / `chooseMove` entry; mate scores
    are stored relative to the node.
  - **A table entry settles a node only at the depth it was searched to.** This makes `A1`
    exact by construction. `stored ≥ needed` measured identical in the middlegame and is left
    unpulled.
  - One per-ply key array per search, with `repeatsInPath` (a repetition scores exactly 0) and
    `KEY_ARRAY_CAPACITY` (a runaway guard, not a depth budget). Both recursions use the table.
  - The hash move is woken in both recursions, the engine's root included.
  - Test-only door `searchWithoutTable`. New `src/transposition.test.ts`.
- **`A1` MET** (six roots at depth 4, and `G6`'s `knight-g1` pair 830 / 820, table on = off).
  **`A2` MET, narrowly: 15.95% / 15.38%** at fixed depth 5. **`A3` MET: 63.94% / 49.90%.**
  **`A4` MET** (at the table for a mate-in-2 at two plies; in the search on a depth-10 engine
  case; see the claim note). **`A5` MET** (exactly 0, table on). **`A6` MET. `A7` MET:
  `NFR-009` `heapUsed` +0.01 MiB, `arrayBuffers` +0.00 MiB between 1 s and 3 s, seen RED
  against a `Map` first.** **`A8` MET.**
- **Depth in 3 s, this build vs the base, 3/3 rounds:**
  - plain node: kiwipete 6 → **6**, position-6 5 → **6**;
  - vitest: 4 → **5**, 4 → **5**.

  `NFR-005`'s verdict, and which runner binds it, are not this hop's.
- **Also changed, each flagged in the decision note:**
  - `search.ts`: `!(depth >= 1)`, which keeps `QE-G1` from hanging under the capacity guard.
  - `engine.ts`: its `history.ts` type import is replaced by `Parameters<EngineSeam>[0]`
    (`A6`).
  - `ABC-080`'s ordering doors keep the table off, so its `A4` ladder stays one lever per rung.
  - `ABC-077` `A6` export list +3.
- **Re-measured, scores unchanged:**
  - `ABC-080` G4 pin 275 → 261 (a real underpromotion transposition);
  - `ABC-078` `A3` fixture budget 4 → 3;
  - `ABC-078` `A3` identity sweep: accepts an EQUAL-scored root move (6 of 368 pairs; 0 score
    divergences).
- **QE `ABC-080` `G1` closed** by the exact `chooseMove` pin (358 vs 355 nodes).
- **`N8-LANE` MET:** +60 ms net (+220 ms gross, of the order of the null control's noise). The
  lane is still over `NFR-008`'s 15 s, which is inherited.
- **Gates at `0076e6a`:**
  - lint 0, typecheck 0, build 0;
  - unit **45 files / 1 444 passed / 0 skipped**; integrity `No findings.`;
  - `SEARCH_DEEP=1` 177/177 (+40/40 at the tip); `ENGINE_DEEP=1` 33/33 + 26/26;
  - mutants: 27, of which 25 killed; K3 (the capacity guard) survives; K4 hangs the lane.
- **Column:** still `In Development` on the page. The `In Review` move and the QE and
  Security/NFR hops are the Orchestrator's to schedule. This hop was fenced from
  `plans/board.md`.
