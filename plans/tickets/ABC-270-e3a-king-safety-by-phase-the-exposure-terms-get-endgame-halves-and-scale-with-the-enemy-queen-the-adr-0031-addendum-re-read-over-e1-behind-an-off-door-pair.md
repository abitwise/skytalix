---
id: ABC-270
title: "E3a: king safety by phase. The king-exposure terms get endgame halves on E1's table and scale with the enemy queen (the ADR-0031 addendum's queen scale and shelter gate, accepted 2026-10-24 and never shipped, re-read over E1), behind an ADR-0026 test-only off-door pair, judged on play under Q-3K-4 (b)"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a dated re-open of the ADR-0031 § Addendum 2026-10-24 on ABC-269's base, or a new ADR if the form changes (the owner's acceptance then, reading (b)). Inputs: ADR-0031 addendum A1 (queen scale) and A3 (shelter gate), accepted 2026-10-24, not shipped; ADR-0064 decisions 4 and 7 (the parameter table and the door pattern); ADR-0064 § Alternatives (shelter tapering named as E3's); the QE-269-a ruling (arch-ABC-269-rule …8ccb561f, 2026-11-03: ruled (a); the castled corner S1–S3 is this ticket's, offered as its first graded rows at ≥ 20 cp; ADR-0064 § Decision log; ADR-0056 D2 row E3)"
---

# ABC-270: king safety by phase, and the queen scale (E3a)

> **`ABC-269` MERGED, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main` `128e3c6c`; nothing run).
> `ABC-269` (E1) merged to local `main` at `54dee3f2` (QE PASS_WITH_GAPS `qe-ABC-269` `…eff2fe64`), so this page's wait
> on that merge is **met**. DoR stays 9/10: row 10 now waits on the design alone. On the merged build QE read S1–S3,
> this ticket's first graded rows (K1 (b), ≥ 20 cp), at **+13 / +13 / +23**, equal to the forecast (`…3fb121de`). That
> is E1's starting point for them, not a reading of this ticket. Order unchanged: after `ABC-274` and `ABC-239`, with
> the stall clause (`EPIC-011` § Dependencies).

> **`QE-269-a` RULED (a), 2026-11-03, by BA/PM** (task `bapm-ABC-269-fold`, records only; nothing run). The Architect
> (`arch-ABC-269-rule` `…8ccb561f`; `ADR-0064` § Decision log; `ADR-0056` D2 row E3): `ABC-269`'s B1 (d) is graded on
> QE's D1–D6 only; the castled corner, **S1–S3** (`TAPER_KP_SHELTER_STRESS`, `grugops/ABC-269` `d6a57653`, E1 forecast
> +13 / +13 / +23), is E3's. **S1–S3 are this ticket's first graded rows, at ≥ 20 cp** (K1 (b)). Scope 1 stays here;
> the "(ii)" fold-back branches below are struck. DoR stays 9/10 (row 10: the design and `ABC-269`'s merge).

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run, built or timed). Source: the owner's *"Analyze and create tickets under EPIC-011"* (2026-11-03, the
> Orchestrator's brief) and this task's gap analysis (`EPIC-011` top block of 2026-11-03; the sealed notes of
> `bapm-epic011-cut`). **Rank 1 of the uncut items** by evidence-backed expected gain per host hour.
> - **`EPIC-011` Phase 4, row E3, first slice.** The rest of E3 (a king-zone attacker term) stays a stub, after E2.
> - **Intent: GAIN (≥ 50.0 of 100).** The exposure terms act at every node, and the queen scale at every node with a
>   queen on. NEUTRAL is not open to it. Named here, before any read, and never re-classed after a score is seen.
> - **It waits on ~~`ABC-269`'s merge and~~ the Architect's design** *(the merge is met, 2026-11-03)*. The board move is the Orchestrator's.

## Problem

- **User:** the owner at level 5, in every game with a castled king, and every later reading of this epic.
- **Pain, from the records:**
  - **King safety does not see the queen.** In game 1 the exposure term moved 35 cp when 13.d4 opened the d-file in
    front of the e1 king. Stockfish moved about 360 cp (`memory-bank/analysis/2026-10-23-game-1.md`; `ADR-0031`
    addendum § Context).
  - **After E1, the untapered shelter holds a castled king in its corner in the endgame.** `kingExposure` keeps equal
    halves at E1, so a centre king pays up to 105 cp while a sheltered corner pays 0. QE's frozen stress endings read
    **+13, +13 and +23 cp** for the centre king against the castled corner, under E1's own 20 cp mark (`QE-269-a`,
    `qe-ABC-269-freeze` `…34cbabaf`, MEDIUM; "a real strength hole in the most common king-and-pawn shape").
    `ADR-0064` § Alternatives names the same residual and leaves the fix to E3.
  - **On the evaluation instrument** (information only, never a bar): of the 25 errors of 50 cp or more that survive
    two node doublings on the 123 unique positions, 22 sit at phase ≥ 7 and **14 have queens on**. E1's chosen form
    fixes 1 of the 25 (this task's re-classification of `arch-next-pull` and `arch-E1` outputs). That is consistent
    with a middlegame king-safety gap. It does not prove one.
- **Why now, when `ABC-205` died:** `ABC-205` shipped these forms with a taper and closed unmerged on `G6`'s "≥ base"
  alone (position-6 median depth 7 against 8). That was cost, never play: its D read never ran. **The owner's
  `Q-3K-4` = (b)** (2026-11-02, `…cc7db847`) judges value-changing evaluation tickets on play, with `NFR-005`'s depth-6
  floor; "≥ base" is reported, not graded. The reason it died is gone. Its code is on `grugops/ABC-205-final`
  `b5d5cea5`, and its two owner levels (`OD-205-1`, `OD-205-2`) are already accepted.
- **Value:** E3's row is +40–100 Elo self-play for the whole of king attack (`ADR-0056` D2, an estimate). This slice
  is the structural half, without the attacker term: **+15–50 (BA/PM estimate, not a reading).** C2′ resolves about
  ± 56 Elo, so GAIN means "point estimate ≥ 0".

## Scope

The ADR governs each line. Every term keeps `ABC-215`'s provenance rule (a stated rule, this project's own values).

1. **The exposure terms get endgame halves.** `KING_SHELTER_MISSING`, `KING_FILE_HALF_OPEN` and `KING_FILE_OPEN` in
   `src/evaluate-params.ts` (`ADR-0064` d4) get endgame halves by a rule the ADR states (candidate: 0), blended by
   E1's phase. ~~**If the Architect rules `QE-269-a` (ii)** and the shelter taper moves into `ABC-269`, this item
   folds there and is struck here with a dated line.~~ *2026-11-03 (`bapm-ABC-269-fold`): `QE-269-a` ruled (a); this
   item stays here.*
2. **The queen scale** (`ADR-0031` addendum A1): each king's exposure penalty × 3 while the enemy has a queen, × 1
   otherwise; ceiling 3 × 105 = 315 cp, below a minor piece. Its form on E1's table (a factor, or an mg / eg pair) is
   the ADR's.
3. **The shelter gate** (`ADR-0031` addendum A3): the middlegame king-table bonus is paid only while no shelter file
   is missing, by `kingExposure`'s own test. **In or out by the ADR's premise probe:** in `ABC-205` it carried the
   +3.2–5.0 % tree growth at depth 8 that lost `G6`. Under `Q-3K-4` (b) that growth is reported, not graded.
4. **One switch and a door pair** (`ADR-0026` d10's pattern, as `ADR-0064` d7): a switch in both recursions, a
   `…WithoutKingPhase`-style evaluate door and two search doors (names the ADR's). Every door that exists before
   this ticket turns the switch off.
5. **Rows by reference** (`ADR-0064` d7's list): re-point, re-pin with old → new in the PR, re-find a lost fixture
   under `ADR-0028` d2; **no zugzwang depth is re-pinned.** `OD-205-1` (the `ABC-079` `A5` cell at ⌊1.5 × reading⌋)
   and `OD-205-2` (`ABC-121` `A1`'s depth-5 drift maximum, 118 cp in `ADR-0026` d9) are re-read on E1's base by the ADR, not assumed.

## Out of scope

- **A king-zone attacker term** (E3b): its weights come from E2's tuner (`ABC-207`'s hand weights lost, −18.3 ± 16.5).
- **Tuning** (E2, `ABC-239`). E2 may later move every half this ticket writes.
- Mobility, passers (E4), endgame scaling (E7), search changes.
- Re-opening `ABC-205`. It stays dropped; its forms are input.

## Acceptance criteria

The ADR fixes the exact counts before Ready (its PREREG). The rows below are the bars it must carry; none is loosened
after Ready.

- **K0 (node identity with the design).** **Given** the build on the base the ADR names, **when** `chooseMove` and
  `search()` are deepened on a frozen clock on kiwipete and position-6 (depths the ADR names, as `ADR-0064` B0),
  **then** they read exactly the ADR's counts, and every door reads `main`'s counts. A miss is a defect, fixed before
  any other row is read.
- **K1 (relations; default-lane units, no search).**
  - (a) **Mirror:** `G3`'s corpus plus `ABC-269`'s frozen mirror set, `Object.is`, 0 mismatches.
  - (b) **The castled king walks:** **given** QE's `TAPER_KP_SHELTER_STRESS` S1–S3 and `ABC-269`'s 6 B1 (d) endings
    (9 frozen king-and-pawn endings), **then** the centre king beats the corner king by **≥ 20 cp** on all 9, from
    that king's side. (E1 forecasts +13 / +13 / +23 on S1–S3.) ~~If scope 1 folds into `ABC-269`, (b) is read there and
    this row reads 9 / 9 unchanged.~~ *2026-11-03 (`bapm-ABC-269-fold`): **S1–S3 are this ticket's first graded
    rows** (`QE-269-a` ruled (a); `ADR-0064` § Decision log). `ABC-269`'s PR prints their E1 readings as a report;
    this row grades them, with D1–D6 kept at ≥ 20 cp.*
  - (c) **The queen scale:** **given** QE-frozen pairs that differ only by the enemy queen (≥ 6), **then** the
    exposure penalty with the queen is exactly 3 × the penalty without it, and the queenless score equals `ABC-269`'s.
  - (d) **Off is E1:** the evaluate door equals `ABC-269`'s `evaluate`, `Object.is`, over a frozen corpus (the run is
    in the PR).
- **K2 (mate floor; `search()`, the 287, `SEARCH_DEEP=1`):** door d4 → head d5 same-sign mates, **0 violations**; d5
  against d5, **0 violations**.
- **K3 (zugzwang, hard):** `ADR-0050` d9's seven rows at their recorded depths, **7 / 7**. Never re-pinned deeper.
- **K4 (`G1`):** `PUZZLE_DEEP=1`, **≥ 54 / 58, no NEWLY-MISSED line.**
- **K5 (`ADR-0061`'s futility audit on this scale):** flips **≤ 0.5 %** of sampled nodes and **0 flips ≥ 200 cp**,
  read by QE on a scratch copy. A miss: `ADR-0061`'s margins are re-read by a dated amendment before this merges.
- **K6 (`G2`):** the complete evaluation **≤ 1.05 ×** `ABC-269`'s head per call, same session, `ABC-076`'s method.
- **K7 (`G6`, by `Q-3K-4` (b)):** `LEVELS[5]` (4 000 ms), plain `node`, reference host, ≥ 5 interleaved rounds per
  board per build, load recorded. **Every run completes depth ≥ 6 (FAIL below); depth 7 is a WARN.** The median
  against base is **reported, not graded.**
- **K8 (the read; `EPIC-011` § The per-change rule, by reference). Intent GAIN.**
  - **C2′:** 100 games at 100 ms, the candidate rebased on `main` against its merge-base, self-play, openings 1–50
    both colours, one game at a time, `Threads 1` against `Threads 1`, QE with the host ALONE, through `ABC-255`.
    **MET** on 100 / 100 complete, 0 candidate faults, 0 losses on time at the 50 ms margin, **≥ 50.0 of 100.** A
    miss is NOT MET and is not re-played.
  - **S′:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`
    (or the E in force at the read, `ADR-0056` S′), `timemargin` 50 ms: 10 / 10 complete, 0 faults, 0 losses on time,
    S-4 ≥ 3.0 of 10 (below that, 10 more and ≥ 7.0 of 20). Pooled only if merged.
  - **Levels deep lane:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts
    --reporter=verbose`, exit 0, every test passed (QE counts its own run).
  - **R-TC part 1, item 2, at review:** the diff reads no budget, deadline, `movetime`, test flag or environment.
- **Reports, not bars:** drift against the doors at d5 on the 190; reach at 47 000 nodes; the evaluation instrument
  on the unique positions (errors at 47 000 nodes, information only); the `G6` medians.

### Falsifiers

| # | fires when | row | disposition |
|---|---|---|---|
| F1 | K0's counts not reproduced | K0 | a defect; fixed first |
| F2 | a mirror mismatch, a door not equal to its pre-ticket self | K1 (a), (d), `G4` | a defect |
| F3 | K1 (b) or (c) missed on the build | K1 | STOP to Architect/Design: the design is not what was claimed. No value is tuned to pass |
| F4 | a zugzwang row, a mate-floor violation or a NEWLY-MISSED `G1` line | K2–K4 | defect check first; if real, NOT MET and the ADR re-opens. Never a deeper re-pin |
| F5 | the futility audit above its bars | K5 | `ADR-0061` re-read before merge |
| F6 | `G2` > 1.05 × or a run below depth 6 | K6, K7 | STOP to Architect/Design: one value-identical cost cut, then one new reading |
| F7 | C2′ < 50.0, an S′ collapse, or a red Levels lane | K8 | not merged; the addendum stays "accepted, not shipped"; E3 waits for E2's tuner |

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): K7, every run ≥ 6, depth 7 WARN.
- **`NFR-001` / `G2`:** K6, ≤ 1.05 × per call.
- **`NFR-009`:** no new table expected (a few parameters in `src/evaluate-params.ts`); the ADR states any growth.
- **`NFR-008`** (`npm test` ≤ 10 s): K1 rows are units with no search; K0, K2–K4 behind `SEARCH_DEEP=1` /
  `ENGINE_DEEP=1` / `PUZZLE_DEEP=1`. `N8-LANE` reported before and after.
- **Security:** none. No new input, data, format, option or dependency.

## Test notes

1. **QE freezes before the build:** the ≥ 6 queen pairs for K1 (c). K1 (b) reuses `ABC-269`'s frozen fixture
   (`src/evaluate.taper-corpus.ts`, S1–S3 and the 6 endings) unchanged.
2. **The `ADR-0031` addendum's rejected alternative is a known conflict:** it rejected "exposure tapered by phase"
   because `ABC-083` `A2` / `A3`'s equal-material rows are pawn endings. The ADR re-reads those rows on E1's base and
   classes each under `ADR-0028` (re-pin, re-find, or a level for the owner).
3. Reuse `ABC-205`'s probes and forms (`grugops/ABC-205-final` `b5d5cea5`; `arch-design-ABC-205` notes) as input;
   nothing from them is merged as is.
4. Deterministic mode (`ADR-0027`) holds: integer, mirror-exact, the same input and virtual clock give the same move.
5. **UAT is owed** (production lines). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).

## Size and priority

- **Size: M.** Three exposure halves, one queen factor, one gate (in or out), a switch and doors, re-pins on the
  rows the addendum moved (eleven default-lane rows and one deep row in `ABC-205`), and the frozen pairs.
- **Priority: P2.** Rank 1 of the uncut items: the largest estimate pullable before E2, the killer removed by the
  owner's word, code and owner levels already in hand, and it closes `QE-269-a`'s hole.

## Dependencies

- **`ABC-269` merged** (E1's phase, blend and parameter table). Hard. *Met 2026-11-03: merged to local `main` at `54dee3f2` (`bapm-269-done`).*
- **The Architect's design:** a dated re-open of the `ADR-0031` addendum on E1's base, or a new ADR. A change to A1
  or A3 as accepted is the owner's to accept (reading (b): build first, read and merge on acceptance). By the owner's
  2026-11-03 order the Architect designs `ABC-234`, `ABC-236` and `ABC-239` first; this design follows unless the
  Orchestrator re-orders.
- ~~**The `QE-269-a` ruling** (`arch-ABC-269-rule`, in flight) decides scope 1's home (here, or `ABC-269`).~~
  *2026-11-03: ruled (a) (`…8ccb561f`); scope 1 and S1–S3 are here. Not a wait.*
- **File collisions, one at a time:** `src/evaluate.ts` and `src/evaluate-params.ts` with `ABC-271`, `ABC-272` and
  `ABC-239`; `src/search.ts`, `src/engine.ts`, `src/quiescence.ts` (the switch) with `ABC-269`. The second to merge
  re-reads its door counts.
- **E2 (`ABC-239`):** not a wait. If E2 merges first, this ticket keeps only the structure E2 cannot create (the
  queen scale, the gate) and E2's tuned halves stand.
  *2026-11-03 (`bapm-E2pre-cut`):* **the recommended order now puts this ticket after `ABC-239`** (`ADR-0067` § Consequences 4, PROPOSED;
  adopted on `EPIC-011` § Dependencies): `ABC-269` → `ABC-274` → `ABC-239` → this. Its new terms then enter traced,
  with fitted weights (`ABC-207` lost on hand weights). **Stall clause:** if `ABC-239` stalls on data, this ticket
  may go first on its rule values, and the tuner's first pull traces it. That is still not a hard wait. **Supporting
  information, not a bar** (`arch-ABC-239` `…48ae6a93` reading 3): every tuner fit weights the king's square tables
  about 3–3.6 × (mg) and 2.2–2.8 × (eg) above E1's rule tables (D4: king mg −178 against E1's −50). This is consistent
  with this ticket's premise, and part of the gap may be a weight the tuner finds.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ game 1 (35 vs 360 cp); `QE-269-a` (+13 / +13 / +23 < 20); 14 of 25 persistent errors with queens on (information); `ABC-205` died on cost, not play; estimate labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5; attacker term, tuning, E4 / E7 out |
| 3 | INVEST | ✅ M; one mechanism behind one switch; independent of every open ticket but `ABC-269` (its base) |
| 4 | testable, measurable acceptance | ✅ K0 exact counts; K1 0 mismatches, ≥ 20 cp × 9, exactly 3 ×, `Object.is`; K2 0 violations; K3 7 / 7; K4 ≥ 54 / 58; K5 ≤ 0.5 % and 0 ≥ 200 cp; K6 ≤ 1.05 ×; K7 every run ≥ 6; K8 ≥ 50.0 of 100, S′, Levels |
| 5 | dependencies known | ✅ `ABC-269` *(merged `54dee3f2`)*; the ADR; ~~`QE-269-a`~~ *(ruled (a) 2026-11-03)*; collisions |
| 6 | NFR triggers with targets | ✅ `NFR-005` ≥ 6; `G2` ≤ 1.05 ×; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ the design is owed (K0's counts, scope 3's in / out, the form of scope 2); ~~`ABC-269` not merged~~ *(merged 2026-11-03, `54dee3f2`)* |

**DoR 9/10. Backlog.** Ready once the ADR (or the addendum's dated re-open) is written ~~and `ABC-269` has merged~~ *(merged
2026-11-03, `54dee3f2`)*.
