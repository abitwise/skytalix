---
id: ABC-121
title: Principal-variation search with late-move reductions (C1)
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-121 — the depth-7 WARN margin: PVS null-window re-search plus LMR

> **Cut 2026-09-25 by BA/PM** (task `refine-abc080-081-cut-c1`, Workflow 07), from candidate
> `C1` in Architect/Design's ruling `…2ba4fca3` (task `wave-2026-09-24`, subtask
> `ruling-abc080-081`, R5). Ranked second by depth-per-point (0.33–0.50) after `ABC-080`
> (0.67) and ahead of `ABC-081` (0.33) on that axis alone, but sequenced after both:
> LMR's re-search ordering leans on `ABC-081`'s hash move, and `ABC-081`'s in-tree repetition is
> a correctness requirement (`ADR-0002`), not an optimisation, so it is owed first regardless of
> its depth ranking. `C2` (null move), `C3` (pseudo-legal search) and `C4` (fused leaf) are
> named by the same ruling as candidates and are **not** cut here.

## Problem

*User*: the player at the depth-7 `NFR-005` WARN level, and the QE lane specifically — QE
measured the engine about one ply shallower under `vitest` than under plain `node`
(`ABC-078 (qe)` trace row), so the margin `ABC-080` + `ABC-081` leave at depth 6 (1.51x on
`position-6`, the thinner of the two) may not survive that shallower reading.

*Pain*: R5's probe (Apple M3, loaded) reads depth 6 on both positions after `ABC-080` +
`ABC-081`, with `position-6`'s margin at only 1.51x. That is thin enough that a slower or more
loaded machine could miss the ratified depth-6 floor. R5 names this ticket as the insurance:
"C1 insures" that risk.

*Value*: margin over the depth-6 floor, and depth-7 at the `NFR-005` WARN level (PROVISIONAL,
pending non-M3 measurement) — R5's probe reads depth 7 on both positions with 1.7x–2.1x margin,
clear of the depth-6 floor.

## Scope

- **Principal variation search (PVS).** A null-window `(alpha, alpha + 1)` re-search for every
  non-first child of a node; a result that fails high above `alpha` triggers a full-window
  re-search.
- **Late-move reductions (LMR).** Reduce the search depth by one ply for a quiet
  (non-capturing, non-promoting), non-checking move at move index **≥ 3** and remaining depth
  **≥ 3** — R5's probe parameters, confirmed unchanged by `ADR-0026` decision 6.
  A reduced search that fails high re-searches at full depth.
- Both full-width recursions — `src/search.ts` and `src/engine.ts` — carry the same PVS/LMR
  shape, following `ABC-080`'s ruling (`…f7e66060`, R1 point 3) that changing one recursion
  without the other risks `ABC-078`'s identity/comparison sweep diverging between them.
- **Test oracle, per `ADR-0026` (ACCEPTED 2026-09-25, with the review's four amendments) and the
  `ruling-abc121-lmr-oracle` R1–R3 rulings it records.** Two switches (`pvs`, `reductions`) in
  both recursions, both on by default. Four test-only doors — `searchWithoutReductions` /
  `searchWithoutPvsOrReductions` in `src/search.ts`, `chooseMoveWithoutReductions` /
  `chooseMoveWithoutPvsOrReductions` in `src/engine.ts` — and one exported pure reduction
  predicate in `src/search.ts`, called by both recursions. Every door that predates `ABC-121`
  keeps PVS and LMR **off**; every existing work row (a node count, ratio, hit rate) re-points its
  shipped side at the pre-`ABC-121` door of the same recursion — a mechanical rename, not a
  re-level (`ABC-077` `A2`; `ABC-079` `A4`/`A5`; `ABC-080` `A1`, `A3`, `A4`, `G1`; `ABC-081` `A1`,
  `A2`, `A3`, `A5`; `search.ordering.test.ts`'s pin). The two identity/drift detectors (`ABC-077`
  `A1`, `ABC-078` `A3`) take the `…WithoutReductions` pair instead, so PVS sits under them while
  LMR does not. `ABC-077` `A6`'s export list grows by three (two doors + the predicate);
  `ABC-078` `A4`'s grows by two (two doors). **The predicate's contract (`ADR-0026` decision 6,
  amended):** it returns the reduction in **plies (0 or 1)**, and each recursion subtracts exactly
  that returned value, never a literal; it classifies the move itself (capture, promotion, gives
  check, side to move in check — a pure-function criterion, derived from the position and move it
  is given, not supplied by the caller); the caller passes only three facts — remaining depth,
  move index (0-based) and whether the node is the root. **The mate-rich fixture,
  `src/search.mate-corpus.ts` (Engineer-owned, built under this ticket):** a frozen, checked-in
  TS data module (not `*.test.ts`, so vitest does not collect it), holding the seven seed FENs
  (the five mate-row FENs already in the suite plus the ruling's KQK/KRK endgames) plus every
  in-progress position within two plies of them, deduplicated — **287 positions per the probe**,
  guarded by a pin on the list's length so a move-generator change cannot silently shrink the net.
  Full door table, the re-pointed-row list and the measurements behind it:
  `.grugops/context/ruling-abc121-lmr-oracle/notes/` (`…c41d9e07` R1) and `ADR-0026`.
- **Build order (two commits, per `ADR-0026` decision and ruling `…7a4c19e3` R3):** commit 1 —
  the switches, the four doors, the work-row re-pointing, PVS in both recursions, plus the new
  PVS identity link (`searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`, 0/190 at depth
  4); gate green with every pre-existing row unchanged. Commit 2 — the reduction predicate and
  LMR, plus `A1`–`A5` below. Not split into two tickets: PVS alone buys 0 plies (does not reach
  depth 7), so a PVS-only ticket is not INVEST-*valuable* on its own.

## Out of scope

- **`C2` — null-move pruning (R = 2).** Named as a candidate in R5, not cut here.
- **`C3` — pseudo-legal full-width search** (`ADR-0003` clause 3 (c1)). Named as a candidate,
  not cut here; not re-measured on the search (`UNKNOWN - verify` per R5).
- **`C4` — fused leaf.** Named as a candidate, not cut here; margin-only (0 plies), not a
  priority driver.
- **Zugzwang handling.** Belongs to `C2` (null-move), not this ticket — PVS/LMR carry no null
  move.
- **Re-leveling `NFR-005`'s depth-6 floor or the depth-7 WARN level.** The owner's word keeps
  the floor (`.grugops/context/wave-2026-09-24/notes/20260925T104000Z-...-36b66fbd.md`); this
  ticket is margin work under an unchanged floor.

## Acceptance (Given/When/Then)

- **`A1` (game quality does not regress — a bounded-drift criterion, not identity; bound amended
  by `ADR-0026` decision 9 — accepted, with the review's amendments).** **Given** a corpus of
  **190** positions (`ABC-078`'s six roots + every position one legal move away +
  `ABC-079`/`ABC-081`'s six endgames — ≥ 100 as required; `ABC-084`'s tactical suite if it lands
  first, as a strength check, not a blocker), **when** each is searched to a fixed depth **= 5, in
  both recursions** (`search()` vs `searchWithoutReductions`, and `chooseMove` vs
  `chooseMoveWithoutReductions` each iterated to depth 5 — depth 4 alone is not enough: it misses
  a build with no reduced-move re-search at all, which reads 96.79% / 65 cp green at d4 and reds
  at d5, 89.30%), **then**: of the non-mate positions, **≥ 95%** score within **25 centipawns**;
  the single largest drift is **≤ 75 centipawns**. Measured this hop: 99.47% within 25 cp, max
  drift 45 cp at depth 5 (`.grugops/context/validate-adr0026/notes/` `…4e2b9c70`,
  `.grugops/context/ruling-abc121-lmr-oracle/notes/` `…8d25f0c6`).
  **The mate floor (`ADR-0026` decision 9, amended) is one extra ply of slack, not the same
  depth, and it runs on the checked-in mate-rich corpus `src/search.mate-corpus.ts` (287
  positions per the probe, length-pinned; the Engineer builds it), not the 190-position corpus:**
  for every position `searchWithoutReductions` scores as a mate at depth d = 4, the shipped
  `search()` scores a mate of the same sign, no longer, at depth d + 1 = 5. Measured: the correct
  rule flips 0 of 180 (d4→5) and 0 of 205 (d5→6) — the hard floor. **"0 mate-status flips on the
  190 corpus" is a REPORT, not a bar** — that corpus holds only 3 mates, and the clause held even
  for every deliberately wrong LMR variant the review tried
  (`.grugops/context/validate-adr0026/notes/` `…7c1d05ab`); a same-depth floor on the mate-rich
  corpus is unattainable by a correct LMR (16/15 flips), so it is not used. The five mate rows
  already in `search.test.ts` `A3` and `transposition.test.ts`'s depth-10 rook ending stay on the
  shipped path with PVS+LMR on and hold their pinned literals unchanged.
- **`A2` (depth gained in budget, plus a clock-free companion — ruling `…5e92b7a0` R2).**
  **Given** a fixed 3 s budget on `kiwipete` and `position-6`, with `ABC-080` and `ABC-081` both
  built, **then** the completed depth is **≥** the pre-`C1` build's (`chooseMoveWithoutPvsOrReductions`)
  on the same machine in the same process, measured on plain `node` (`NFR-005`'s runner), with
  the load average recorded alongside the reading. **Add** a clock-free companion: cumulative
  deepening nodes to depth 7 for `chooseMove` vs `chooseMoveWithoutPvsOrReductions`, divided by
  the engine's measured 3 s node capacity — the probe read 532 363 / 467 461 nodes (kiwipete /
  position-6) against an 892 682 / 853 278-node capacity (QE `ABC-081`), a 1.68x / 1.83x margin;
  this reading does not depend on machine load (`.grugops/context/ruling-abc121-lmr-oracle/notes/`
  `…8d25f0c6`). Report both figures at build time either way.
- **`A3` (LMR never reduces a move that must be searched at full depth, and the rule is one
  predicate both recursions call — `ADR-0026` decision 6, amended).** **Given** the exported pure
  reduction predicate, **then** a table-driven test shows no reduction for: a capturing move, a
  promoting move, a checking move, a move made while in check, a move at index **< 3**, remaining
  depth **< 3**, or the root — and **exactly one ply** of reduction for the one allowed case.
  **The predicate returns the reduction in plies (0/1) and classifies the move itself** (capture,
  promotion, gives-check, in-check — a pure-function criterion derived from the position and move
  it is given); the caller supplies only remaining depth, move index and the root flag. **Given**
  a source assertion, **then** both `src/search.ts` and `src/engine.ts` route every reduction
  through that one predicate, subtracting exactly its returned value, never a literal.
  *(Measured: an LMR that also reduces tactical moves, or that reduces by 2 plies, passes the
  bounded drift bars at both depth 4 and depth 5; only this predicate's table test reds those two
  variants, and only because the recursion cannot supply a mis-wired tactical fact itself —
  `.grugops/context/validate-adr0026/notes/` `…7c1d05ab`.)*
- **`A4` (a fail-high re-search actually happens and is correct, constructed at a NULL-WINDOW
  node — `ADR-0026` decision 9's consequence, amended).** **Given** a constructed position where
  the reduced move is in fact the best move, **and the constructed fail-high occurs at a
  null-window node (alpha + 1 = beta)**, **then** the reduced search fails high, the full-depth
  re-search runs, and the returned score and move match the unreduced search on that position.
  *(The re-search path is the one line every LMR bug skips; it must be exercised, not just
  present in the code. At a PV node, PVS's own full-width re-search would mask a missing LMR
  re-search whenever the score stays below beta — a build with no reduced-move re-search at all
  passes every drift bar and the mate floor, and only an `A4` at a null-window node reds it,
  `.grugops/context/validate-adr0026/notes/` `…7c1d05ab`.)*
- **`A5` (node count falls, on named positions only — do not widen to "every position"; ruling
  `…5e92b7a0` R2).** **Given** `kiwipete` and `position-6` at depth 4, **then** node count for
  `search()` is **lower** than `searchWithoutPvsOrReductions`'s at the same depth — measured
  80.2% (kiwipete) and 70.8% (position-6). Report the actual figures. *(Position-4 is the named
  counter-case: it reads 9 581 nodes under PVS+LMR against 9 054 without — PVS alone can grow a
  tree, so this bar names its two positions rather than claiming a universal reduction.)* This
  is the "it does something" check; `A2` is the target that matters.
- **`A6` (bounded memory, unchanged).** **Given** a 3 s search, **then** search-held memory
  stays within whatever fixed bound `NFR-009` (or its successor) states once placed. This
  ticket adds no new heap-growing structure — PVS/LMR are control-flow changes over the
  existing table and key array.

## Dependencies

- **`ABC-080` and `ABC-081` — DONE.** Both merged to `main`. LMR's re-search ordering leans on
  `ABC-080`'s hash move for its own effectiveness (R5); `A2`'s depth measurement is taken with
  both built.
- **`ABC-122` (gate hardening) — DONE.** Merged to `main` at `26c0fe0`. Its bounded-time test
  wrapper and capacity-guard tests are the gate infrastructure this ticket's build (roughly twenty
  re-pointed test rows plus a slower deep lane) runs under. This dependency is discharged.
- **`ADR-0026` — status ACCEPTED 2026-09-25**, by the owner's word (*"4. accept"*), with the
  independent review's four amendments folded in (`memory-bank/50-decisions/ADR-0026-...md`).
  This ticket's test-oracle scope (the four doors, the predicate, the re-pointed rows, `A1`'s
  bounded-drift bar and mate floor) is built against the amended ADR, folded into `A1`/`A3`/`A4`
  above. This dependency is discharged; the fallback (re-levelling `ABC-080` `A3` / `ABC-081`
  `A3`) named at the prior re-score no longer applies.
- **`ABC-109` (`AGENTS.md` size budget) — dependency for the Scribe follow-up, not for this
  ticket's build.** `AGENTS.md` sits at **32 565 B of a 32 768 B cap (203 B headroom)**. This
  ticket owes a `Test (all)` / deep-lane `AGENTS.md` follow-up once its own deep-lane rows are
  measured (`N8-LANE` below); any deep-lane line of any real length will overflow that headroom,
  so the Scribe hop that writes it needs `ABC-109` (or an equivalent trim) landed first. Named
  here so the build does not surface it late; it blocks nothing in `src/`.
- **`ABC-084` (tactical puzzle suite) — NOT a blocker.** `A1` names it as an added strength check
  if it lands first; `ABC-078`'s already-built 190-position corpus is the oracle either way.

## Security / NFR triggers

- **`NFR-005` — the depth-7 WARN level (PROVISIONAL).** This ticket is the margin ticket R5
  names for that level; `A2` reports the measured depth and margin. The depth-6 floor is
  `ABC-080` + `ABC-081`'s, not re-claimed here.
- **`N8-LANE` — ≤ 650 ms CPU.** Same shape as `ABC-080`/`ABC-081`: depth-4+ sweeps and every 3 s
  run go behind an opt-in env flag; a shallow subset stays in the default lane. **The new rows'
  default-lane cost is unmeasured** — the ruling's and the review's probes only timed the
  deep-shaped passes (11–19 s per depth pair under load;
  `.grugops/context/ruling-abc121-lmr-oracle/notes/` `…0f93c6b1`,
  `.grugops/context/validate-adr0026/notes/` `…7c1d05ab`). **The Engineer names which new rows
  belong in a deep lane at build time and measures the default-lane cost, reporting the actual
  figure** — the depth-5 190-corpus drift pass (`A1`) and the mate-corpus floor pass (`A1`'s mate
  floor, `src/search.mate-corpus.ts`, 287 positions) are the two named deep-shaped candidates; the
  table-driven predicate test (`A3`) and the single constructed `A4` position are not.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A3` before `A1` or `A2`.** A reduction applied where it should not be is a silent
   tactical-strength bug that aggregate node counts and score-drift percentages can both miss.
2. **`A4`'s position must be constructed, not found** — the same discipline `ABC-081`'s `A5`
   used for its repetition case.
3. **The unreduced mode is test-only**, like `ABC-077`'s, `ABC-080`'s and `ABC-081`'s switches.
4. **`A1`'s bound is now measured, not generic** (superseded by `ADR-0026` / ruling `…5e92b7a0`
   R2) — the build re-measures it at its own gate and reports the figure whether or not it
   matches this hop's reading; a failing bar here is reported, never re-levelled silently.
5. **The Engineer lists every re-pointed row, one line each, in the build notes; QE checks that
   list against the tree** (ruling `…c41d9e07` R1). If a re-pointed row fails, the door is not
   the pre-`ABC-121` search, and that is a defect — not a reason to re-level the row.
6. **The independent review's planted-wrong-variant list, which row catches which**
   (`.grugops/context/validate-adr0026/notes/` `…7c1d05ab`) — QE checks each against the built
   tree, since the bounded oracle alone misses half of them:
   - `tactical` (also reduces captures, promotions, checks, in-check nodes) — caught by `A3`'s
     predicate table, once the predicate derives the tactical facts itself.
   - `r2` (reduces by 2 plies) — caught by `A3`'s "exactly one ply" pin and by the mate floor's
     one-extra-ply check (17/16 flips).
   - `noLmrResearch` (no reduced-move re-search on fail-high) — caught **only** by `A4`, and only
     because `A4`'s fail-high is constructed at a null-window node.
   - `noResearch` (reduced depth used for every search of the move) — caught by the depth-5 drift
     bar (89.30% within 25 cp, red).
   - `early` (reduces from index 1 at remaining depth 2) — caught by the depth-5 drift max
     (120 cp, red).
   - `gross` (all four of the above) — caught by every row above plus the mate floor.
   - `pvsNoResearch` (a PVS window bug, LMR correct) — caught by the depth-5 drift bar
     (45.99% within 25 cp, red) and the mate floor.
   - **The 190-corpus mate-status-flip clause catches none of these — it is a report, not a bar**
     (`A1`); do not rely on it as a gate.

## Size and priority rationale

**Size `M` (3).** R5's own table reads `S–M (2–3)`. The PVS/LMR control flow itself is small (a
handful of lines per recursion, times two recursions) — but this ticket also owes a
game-quality corpus measurement (`A1`) and an instrumented reduction-safety check (`A3`), the
same measurement-discipline cost that made `ABC-080` and `ABC-081` `M` rather than smaller.
**Not `L`:** no new data structure, no new module — control flow over structures `ABC-080` and
`ABC-081` already build.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** It insures the depth-6 floor's thin margin and reaches for the depth-7 WARN
level, but the floor itself is `ABC-080`'s and `ABC-081`'s `P0` work; this ticket is margin, not
the floor.

## Definition of Ready

**Re-scored by BA/PM, 2026-09-25** (task `wave-2026-09-25`, subtask `refold-abc121-adr0026`,
Workflow 07 — folding `ADR-0026`'s accepted amendments, per the `amend-adr0026` decision
`…d41c7a58` and the `validate-adr0026` review, into `A1`/`A3`/`A4`; discharging both `⚠️` from the
prior `rescore-abc121` score by fact, not by argument: `ABC-122` reached `Done` (merged to `main`
at `26c0fe0`), and the owner accepted `ADR-0026` (*"4. accept"*, `…6a63f2b7`)). Supersedes the
2026-09-25 `rescore-abc121` score below, not deleted, kept as history.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged — the QE-lane depth risk and the thin `position-6` margin (1.51x) |
| 2 | scope and out-of-scope clear | **✅** two mechanisms plus the accepted ADR's test-oracle shape (doors, predicate, re-pointed rows, the mate-rich fixture); fences unchanged |
| 3 | INVEST-shaped | **✅ (was ⚠️) — discharged by fact.** `ABC-080`, `ABC-081` and now `ABC-122` are all `Done` (`26c0fe0`). Nothing this ticket needs still sits `In Development` |
| 4 | acceptance testable and measurable | **✅** six criteria; `A1`'s bar now runs at depth 5 in both recursions (≥ 95% within 25 cp, ≤ 75 cp max) plus a one-extra-ply mate floor on the 287-position mate-rich corpus (0/180, 0/205), replacing the unattainable same-depth floor; `A3`'s predicate returns plies and classifies the move itself; `A4`'s fail-high is pinned to a null-window node |
| 5 | dependencies known | **✅** `ABC-080`/`ABC-081`/`ABC-122` all `Done`, discharged; `ADR-0026` accepted, discharged, its fallback no longer live; `ABC-109` named as the dependency for the Scribe's `AGENTS.md` follow-up (not for this ticket's build); `ABC-084` non-blocking |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` depth-7 WARN (PROVISIONAL, clock-free companion reading) and `N8-LANE` (≤ 650 ms; default-lane cost still unmeasured, but the Engineer's job is now named — which new rows are deep-lane, and measure the rest — not just flagged `UNKNOWN`) |
| 7 | test notes present | **✅** six (added: the review's planted-wrong-variant list, one line per row, for QE to check against the tree) |
| 8 | size assigned | **✅** `M` (3) unchanged — the ruling explicitly declines to make the oracle plumbing a `SPLIT_REQUIRED` reason (`…7a4c19e3` R3) |
| 9 | priority assigned | **✅** `P1` unchanged |
| 10 | no major unresolved blocker | **✅ (was ⚠️) — discharged by fact.** `ADR-0026` is `accepted` (2026-09-25, with the review's four amendments folded in), not `proposed`. The fallback (re-levelling `ABC-080` `A3` / `ABC-081` `A3`) named at the prior score no longer applies |

**10 of 10 clean, 0 ⚠️ — MET.** Both prior `⚠️` close on fact, not on BA/PM's own argument:
`ABC-122` `Done` at `26c0fe0`, `ADR-0026` accepted on the owner's verbatim word. **Ready to pull.**
**Size `M`, priority `P1`, unchanged.** One dependency-shaped item is named but does not gate this
ticket: `ABC-109` (the `AGENTS.md` 203 B headroom) is owed to the Scribe's *follow-up* line, not
to this build.

<details>
<summary>Prior score, 2026-09-25, task <code>rescore-abc121</code> (8/10, 2 ⚠️) — superseded above</summary>

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged — the QE-lane depth risk and the thin `position-6` margin (1.51x) |
| 2 | scope and out-of-scope clear | ✅ two mechanisms plus the ruling's test-oracle shape (doors, predicate, re-pointed rows); fences unchanged |
| 3 | INVEST-shaped | ⚠️ not yet independent — `ABC-080` and `ABC-081` are DONE, but `ABC-122` (gate hardening) is `In Development`, not `Done`, and the ruling names it as landing first |
| 4 | acceptance testable and measurable | ✅ six, `A1` and `A2` now carrying measured bounds in place of the generic figures |
| 5 | dependencies known | ✅ `ABC-080`/`ABC-081` DONE; `ABC-122` named as the new hard blocker; `ADR-0026`'s pending acceptance named with its concrete fallback cost; `ABC-084` non-blocking |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-005` and `N8-LANE` (`UNKNOWN - verify`, named honestly) |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `M` (3) unchanged |
| 9 | priority assigned | ✅ `P1` unchanged |
| 10 | no major unresolved blocker | ⚠️ `ADR-0026` is `proposed`, not accepted; fallback cost named |

8/10, 2 ⚠️, NOT MET.
</details>

<details>
<summary>Original score, 2026-09-25, at cut time (task <code>refine-abc080-081-cut-c1</code>) — superseded above</summary>

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope clear | ✅ |
| 3 | INVEST-shaped | ⚠️ sat behind `ABC-080`/`ABC-081`, both `Backlog` at cut time |
| 4 | acceptance testable and measurable | ✅ six criteria, generic `A1` bound |
| 5 | dependencies known | ✅ `ABC-080`/`ABC-081` hard, `ABC-084` non-blocking |
| 6 | security/NFR triggers with a measurable target | ✅ |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` (3) |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | ⚠️ `A1`'s 50 cp / 95% bound was generic, not measured on this codebase |

8/10, 2 ⚠️, NOT MET.
</details>

## Delivery

**Built 2026-09-25 by the Software Engineer** (task `wave-2026-09-25`, subtask
`ticket-to-pr-ABC-121`, Workflow 04) on branch `grugops/ABC-121-pvs-lmr`, off
`grugops/wave-2026-09-25` @ `15c6eb0`, in two commits per R3: **`8e54b13`** (PVS, the four doors,
every work-row re-point, the PVS identity link) and **`9823c27`** (the predicate, LMR, `A1`–`A5`,
`src/search.mate-corpus.ts`). **Unmerged; not pushed; not deployed.** This section is a pointer;
the figures live in `.grugops/context/ticket-to-pr-ABC-121/notes/`.

- **`A1` MET:**
  - drift at d5, both recursions: 99.47% within 25 cp, max 45 cp;
  - mate floor d4 → d5 on the 287: 0 of 180 violated;
  - 190-corpus mate flips: 0 (a report).
- **`A2` MET:** plain node 7 / 7 against 6 / 6, both for the door and for the base, 3/3 rounds.
  Companion to d7: 532 363 / 467 461 nodes.
- **`A3` MET**, **`A4` MET** (null-window re-search shown, in `search()` and `chooseMove`),
  **`A5` MET** (80.2% / 70.8%), **`A6` MET**.
- **Re-pointed rows:** every merged row re-pointed, one line each, in note `…d9a84a04`. No bar
  moved.
- **Planted variants:** 23 of 23 red (`…7f29f842`).
- **Handed up, not decided here:**
  1. **`N8-LANE` NOT MET:** +1 670 ms net against 650. Deep-lane placement is proposed in
     `…24e3648a`; nothing was trimmed.
  2. **The G6 knight pair is re-pointed** under `ADR-0026` decision 4 rather than kept on the
     shipped path per decision 7: LMR moves `knight-g1 w -` 820 → 830 at d4. Architect/Design to
     ratify or overrule (`…0da3f1a5`).
- **Owed later (fenced here):** the `AGENTS.md` deep-lane lines for
  `src/search.pvs-lmr.test.ts` (`SEARCH_DEEP`, `ENGINE_DEEP`). A Scribe pass, behind `ABC-109`.

**`N8-LANE` re-hop, 2026-09-25, by the Software Engineer** (subtask `ticket-to-pr-ABC-121-lane`),
on branch `grugops/ABC-121-lane` @ **`6c1e895`**, off `66afd16`. Test-only, +25/−11.
**Unmerged; not pushed.** The figures live in the notes.

- **The unattributed ≈ 1 s is test-body CPU, not import cost** (`…e1e4a69f`).
  - Import, module-level work and collect cost ≈ 45 ms above the per-file floor.
  - The bodies' 0.93 s of CPU reads ≈ 1.7 s in the lane on this 4P+4E machine under load.
- **Moved:** the seven-seed mate-floor guard, to `SEARCH_DEEP`.
- **Narrowed:** the PVS identity guard, to kp-vs-k; the other six positions run in the deep 190.
- **Kept, because each is its variant's only default guard:** `A4`'s `chooseMove` row and the
  engine-doors bite (`…9bdce84b`).
- **Default-lane planted variants:** 23 / 23 red. The four-row proposal would leave 20 / 23
  (`…17a0830d`).
- **`N8-LANE` still NOT MET:** +1 575 ms gross, **+1 415 ms net** against 650.
  - Null control 0.19%. Load1 median 22.8.
  - The placement removes ≈ 30% of the charge (`…e4d6fcc8`).
  - The residual is for Security/NFR to rate; the owner decides.
- **The G6 row is untouched** (Architect/Design's ruling is pending).

**G6 ruling applied, 2026-09-25, by the Software Engineer** (subtask
`ticket-to-pr-ABC-121-g6-comment`), on branch `grugops/ABC-121-pvs-lmr` @ **`01d258f`**.
Comment-only, `src/transposition.test.ts` +4/−2. **Unmerged; not pushed.**

- The re-point comment's last-but-one sentence is replaced with `ruling-abc121-g6` `…ea306e58` §4's
  text, verbatim. No assertion, identifier or literal changed.
- The `KNIGHT_G1_PAIR` docstring is left as it is (flagged by the ruling; it waits for the
  `ADR-0006` erratum).
- Gates: `npm test` 48 / 1 466 / 0 skipped, integrity `No findings.`, lint + typecheck clean
  (`…5c2e91b4`).

## QE

**QE gate run, 2026-09-26, by QE/E2E** (subtask `qe-ABC-121`, Workflow 05), on branch
`grugops/qe-ABC-121`, worktree `.claude/worktrees/qe-ABC-121`, off `67207b4` (the G6-comment
tip, `312a188`). **Verdict: PASS WITH FINDINGS.** Zero `src/` lines; not merged; not pushed.

- **`A1`–`A6` independently reproduced**, all MET, every figure matching the build's own
  exactly (drift 99.47% / max 45 cp both recursions; mate floor 0/180, 0/205; `A5` 80.2% /
  70.8%; `A2` 7/7 vs 6/6 on plain node, own script, 3 rounds, own load).
- **The d5 drift and d7 companion rows the lane re-hop had not re-run — re-run here**
  (`SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts`, 29/29 green, 882.8 s), figures
  matching the build to the exact number.
- **5 of 23 planted variants re-applied by hand** (`tactical`, `r2`, `noLmrResearch`,
  `pvsNoResearch`, `noResearch`) — each confirmed red exactly as ledgered, each reverted
  byte-for-byte; `git status --short -- src` clean after every revert and at the end.
- **Re-pointed rows spot-checked against the tree** (promotion-capture pin, G6 knight pair, the
  rook-ending split); the G6 comment matches `ruling-abc121-g6` `…ea306e58` §4 verbatim.
- **The `A4` `chooseMove` saving (`…9bdce84b`) ruled SAFE — does not weaken detection of
  `noLmrResearch-engine-only` / `noResearch-engine-only`** (the literal pin is the actual
  detector, not the reference-equality check). **Not applied** — QE reports on test behavior,
  never changes it.
- **`N8-LANE` handed to Security/NFR, report only**, per this subtask's fence.
- Gates: `npm test` 48 / 1 466 / 0 skipped, integrity `No findings.`, lint + typecheck clean.
- Gaps named honestly: 18 of 23 planted variants not independently re-applied (relies on the
  build's own two ledgers); the depth re-measurement is one machine, one hop, lower load than
  either build reading; the bare-`mkdir` queue-claim caveat is inherited, not new.
- Notes: `.grugops/context/qe-ABC-121/notes/`.
