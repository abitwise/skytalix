---
id: ABC-289
title: "Q2: delta pruning in quiescence. Out of check, a capture is skipped when the stand-pat score plus its victim's value and 200 cp cannot raise alpha, and the skip raises the node's value to that bound, behind a test-only off-door pair. ADR-0074 PROPOSED, premise met; the merge waits on the owner's acceptance and its read"
status: ready
column: Ready
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0074 ACCEPTED 2026-11-04 (the owner, OQ-0074-1; orch-2026-10-30a …3e73f9f9; Status line arch-owner-answers-1104b …88ca95bd). Premise met. It amends ADR-0024 d4. Not in force until this ticket merges on its own read (DP4). (Was: PROPOSED, premise met; arch-ABC-289.)"
---

# ABC-289: delta pruning in quiescence (Q2)

> **`ADR-0074` ACCEPTED (THE OWNER, OQ-0074-1); THE ORDER IS RULED: BUNDLE 1 FIRST, THIS TICKET ALONE AFTER IT, 2026-11-04, by
> BA/PM** (task `bapm-bundle-1-cut`, records only, at `main` `3ad21218`; nothing run). Sources: the owner's word `orch-2026-10-30a`
> `…3e73f9f9`, `arch-owner-answers-1104b` `…88ca95bd` § 4 and § 6 item 4, `ADR-0056` D5's dated block, and `ADR-0074`
> § Status and § Consequences.
> - **`adr:`** reads ACCEPTED. Not in force until this ticket merges on DP4.
> - **§ Dependencies takes the order,** in place of "the build may start on PROPOSED". The build starts when `ABC-303`'s merge
>   or `failed-attempt` is recorded, not before.
> - **Lines changed:** `adr:`; § Dependencies; DoR rows 5 and 10; the closing line. The title's "PROPOSED" and "waits on the
>   owner's acceptance" are not on this hop's list, and are read with this block.
> - No bar, size or priority moves. **DoR 10/10, unchanged.** The column move and the build slot are the Orchestrator's.

> **DP5 NAMES `G2`'S BYTE IDENTITY, 2026-11-04, by BA/PM** (task `bapm-lines-1104b`, records only, at `main` `732a0cea`;
> nothing run). Source: the Orchestrator's ruling `orch-2026-10-30a` `…5ec6c124` 2, and `ADR-0074` d12 (d). It names a
> bar the ADR already sets. **DoR 10/10, unchanged.** The column move and the build slot are the Orchestrator's.

> **`ADR-0074` FOLDED: PREMISE MET, HOLD 2 CLEARED, F2 DID NOT FIRE; DoR 10/10, READY; THE BUILD MAY START ON PROPOSED,
> THE MERGE WAITS ON THE OWNER'S ACCEPTANCE AND ITS READ, 2026-11-04, by BA/PM** (task `bapm-lines-1104`, records only, at
> `main` `18fbc754`; nothing run). Sources: the Architect's twelve owed lines (`arch-ABC-289` `…62012bbe` § 6), `ADR-0074`,
> and the Orchestrator's rulings (`orch-2026-10-30a` `…085f647c`, `…f30bd604`).
> - **Hold 2 is cleared:** the re-measure on `main` with Q1 in it ran under PREREG `…174760a3`. Only form D200b passed
>   the sealed safety gate. `ADR-0074` is written PROPOSED, with the nine items `ADR-0024` § Status asks for.
> - **Open: OQ-0074-1** (the owner accepts `ADR-0074`, which amends `ADR-0024` d4; recommendation yes). Under reading
>   (b) the build may start on PROPOSED. The merge waits on his acceptance and on DP4.
> - **Not yet scheduled** (`…085f647c` 5): § Dependencies.
> - **Lines changed:** the title; `adr:`; § Problem's value line; scope 1; DP0–DP4; F2 and F9; `NFR-008` and `NFR-009`;
>   test note 1; the size line; § Dependencies; DoR rows 1, 4, 5, 6, 8 and 10. DP5 and the priority do not move. The
>   file name keeps its as-cut slug. **The board move is the Orchestrator's.**

> **THE OWNER'S HOLD LIFTED (`Q-3K-10` ANSWERED YES); STILL HELD ON THE ARCHITECT'S RE-MEASURE OVER Q1 AND ITS ADR,
> 2026-11-04, by BA/PM** (task `bapm-owner-answers-1104`, records only, at `main` `7dd241cf`; nothing run). Sources:
> the owner's word as the Orchestrator recorded it (`orch-2026-10-30a` `…7de79e90`) and the Architect's owed lines
> (`arch-owner-answers-1104` `…d6345b29` § 4).
> - **Hold 1, the owner's, is lifted:** `Q-3K-10` answered yes 2026-11-04 (`…7de79e90`). `ADR-0024` d4 is open for
>   Q2's **design**, as `Q-3K-9` opened it for Q1. A build ships on its own read (DP4).
> - **What still holds it:**
>   - (a) **the Architect's re-measure on `main` with Q1 in it** (hold 2): the premise reading of `ADR-0024`
>     § Status, the fourth block, item 2, under a sealed PREREG;
>   - (b) **a new ADR, by `ADR-0069`'s pattern, that amends d4,** and the owner's acceptance of it (reading (b) lets
>     the build start on PROPOSED). It must show the nine items listed in `ADR-0024` § Status, the fourth block.
> - **Lines changed:** the title; `adr:` (the owner's item dropped; the ADR is a new one amending d4); § Dependencies;
>   DoR rows 5 and 10; F1 moot, struck through and kept. No bar, size or priority moves. **DoR 9/10, Backlog, held.**
>   The file name keeps its as-cut slug. The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 3,
> stub row Q2 (and § Phases' 2026-11-03 line, "Q2 is not cut yet").
> - **Hold 1, the owner's: `ADR-0024` d4 keeps delta pruning fenced.** The owner's `Q-3K-9` yes opened d4 for Q1's
>   design only, and `ADR-0069` amended d4 for SEE pruning only; both say "delta pruning stays fenced". `EPIC-011`
>   § Scope lists Q2 among the items `Q-3K-5` re-opened for this epic, but Q1 still needed d4 opened by name. This
>   page asks the same for Q2: **`Q-3K-10`** (`EPIC-011` § Owner questions).
> - **Hold 2, the Architect's: a re-measure on `main` first.** Q2's only figure (`ADR-0024`: a 1.5× trim on top of
>   ordering) was read on a 2026-08 base, before futility, ordered quiescence and Q1's SEE pruning (`ABC-279`).
> - **Re-open trigger:** `Q-3K-10` answered yes, then the re-measure shows a trim over `main`'s quiescence with every
>   safety row clean. A "no" closes this page as fenced; a re-measure with no trim closes it as dropped.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; quiescence runs at every leaf.
- **Pain:** quiescence searches every capture that `ABC-279` does not skip as SEE-losing, including captures that
  cannot raise alpha even if they win the victim outright.
- **Value:** `ADR-0056` D2 row Q2 estimates **+5–20 Elo** (an estimate; basis `ADR-0024`'s 1.5× trim). ~~After Q1 the
  remaining trim is `UNKNOWN - verify`: SEE pruning may already skip most of what delta would.~~ *2026-11-04
  (`bapm-lines-1104`): read on `main` with Q1 in it (`ADR-0074`): 43.73 % of the captures searched out of check are ones the
  rule would skip and `seePruning` does not, and 99.52 % of those are refuted. Reach gains +0.279 ply. A 100-game read
  cannot size that, so the +5–20 stays an estimate.*

## Scope

The ADR governs each line.

1. Out of check, a capture is skipped in quiescence when stand-pat + the victim's value + ~~a margin~~ **200 cp** ≤
   alpha, and **a skip raises the node's value to the skipped capture's bound**. ~~The margin and the exclusions
   (promotions, and any phase or material condition) are the ADR's.~~ **Exclusions: promotions only** (`ADR-0074`
   d1–d5; `bapm-lines-1104`).
2. In check every evasion is still searched (`ADR-0053`, `ADR-0069`).
3. One switch and a test-only off-door pair (`ADR-0026` d10), reaching `quiesce` through its rules record as Q1's does
   (`ADR-0069` d6).

## Out of scope

- Checks in quiescence (still fenced by d4). SEE pruning in the main search (`ADR-0069`'s QSM, a named follow-up).
- The cap of 8 (`ADR-0024` d5) and the MVV-LVA order (d2).

## Acceptance criteria

The re-measure and the ADR fix exact counts before Ready. None is loosened after Ready.

- **DP0 (identity):** switch off, node counts equal `main`'s exactly (`G4`); `ABC-279`'s door pair reads its pre-ticket
  counts. **Every older door turns the switch off, `ABC-283`'s included** (`ADR-0074` d8), so each stays node-equal to
  itself.

  | d8 nodes (`ADR-0074` d12, on `main` `0cc9afd1`) | `search()` kiwipete / position-6 | `chooseMove` kiwipete / position-6 | reach at 47 000 |
  |---|---|---|---|
  | the new door (switch off = `main`) | 523 847 / 234 214 | 707 548 / 101 425 | 6.868 |
  | the head (a faithful build; an instrument check, not a bar) | 333 296 / 193 534 | 458 740 / 83 175 | 7.147 |
  | `ABC-279`'s door pair | 839 514 / 1 533 901 | 1 296 788 / 404 930 | — |

  If `main`'s production code has moved by the build, the Engineer re-reads these on the new base and puts both sets
  in the PR. The bars stay; a re-derived count is a dated line in `ADR-0074`, never a moved bar (d12).
- **DP1 (the rule; `ADR-0074` d10).** Default lane, each row a hand board calling `quiesce` directly, no search:
  - (a) **the margin, both sides of the edge:** at `alpha = standPat + victim + 200` the capture is skipped; at one
    centipawn more it is searched;
  - (b) **the bound:** a node whose captures are all skipped returns `standPat + largest victim + 200`, not the stand
    pat;
  - (c) **the exclusions:** a capturing promotion and a quiet queen promotion are searched at an alpha that skips a
    plain capture; en passant is tested;
  - (d) **the order:** a capture both rules name contributes its bound;
  - (e) **in check:** every evasion is searched at an alpha that would skip it;
  - (f) **the seam:** a record without `deltaPruning` searches the same board in full.
- **DP2 (safety, `ADR-0064` d7's list; `ADR-0074` d11):** mate floor 0 violations at the same depth, door d5 → head d5
  on the 287, **in both recursions** (of 191 and of 189); zugzwang 7 / 7 at recorded depths, none re-pinned; `G1` ≥
  54 / 58 with no NEWLY-missed line; drift at depth 5 on the 190 in both recursions, against the doors: **≥ 98 % within
  25 cp, none beyond 30 cp, 0 mate sign changes**.
- **DP3 (pay; `ADR-0074` d12 (a), (b)):** d8 nodes on kiwipete and position-6, both recursions, **≤ 0.88× on each of the
  four readings**; reach at 47 000 nodes on the 190 **≥ door + 0.15 ply** (≥ 7.018 on 6.868).
- **DP4 (the read; `EPIC-011` § The per-change rule, by reference; `ADR-0074` d13).** Intent **GAIN**. C2′ **≥ 50.0 /
  100** ~~(GAIN) or ≥ 43.0 (NEUTRAL) of 100~~, S′ at E 1 810, the Levels deep lane. A miss is NOT MET and is not
  re-played. Firing: at 47 000 nodes, the 100 ms budget, the rule skips **48.25 %** of the captures reached out of check
  (3 785 544 of 7 845 226), on 185 of 190 rows. 65.9 % of the skips are at quiescence ply 0, so it is not depth-gated.
  *2026-11-05 (`bapm-pointers-1105`; `…42f7fd67` 5; `…65557abd`):* **CF1–CF10 reach this read** (the owner's word `…0f1ab02e` item 1): C2′, then S′, then the Levels lane. A candidate fault or a loss
  on time is not this line's miss; a clean score below the bar is, final (CF5). QE copies the Reach line of `ADR-0056` D5's dated block of `arch-owner-answers-1105b` and CF1–CF10 unaltered into this
  read's PREREG, then that block's table, filled from this page and `ADR-0074`. A name QE cannot fill is a STOP before the seal (CF10). The block governs. No bar moves.
- **DP5:** `G6` "≥ base" (a search ticket). *2026-11-04 (`bapm-lines-1104b`; `…5ec6c124` 2; `ADR-0074` d12 (d)):* **`G2`:**
  `src/evaluate.ts` and `src/evaluate-params.ts` stay byte-identical to base, so `G2` is not re-read. If either is
  touched, `G2` is read by its rule.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | ~~`Q-3K-10` no~~ | ~~closed: fenced by `ADR-0024` d4~~ *(moot 2026-11-04: `Q-3K-10` answered yes)* |
| F2 | ~~the re-measure shows no trim over `main`~~ | ~~closed as dropped (premise not met)~~ *(did not fire 2026-11-04: premise met, `ADR-0074`; `bapm-lines-1104`)* |
| F3 | DP0 red | a defect |
| F4 | DP2 red | a defect check first; if real, NOT MET |
| F5 | DP4 NOT MET | not merged |
| F9 (`ADR-0074`'s number) | a build leaves `best` at the stand pat on a skip (`ADR-0074` d3; DP1 (b)) | a defect; it is the failed form D200 |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds.
- **`NFR-008`** (≤ 10 s): units only; the quiescence deep lane holds the heavier rows
  (`SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts`).
  - *2026-11-04 (`bapm-lines-1104`; `…085f647c` 2, the terms of `…f30bd604` 1): **a default-lane budget of ≤ +0.10 s,** read as
    the head-minus-base median wall. Aim, not a gate: rows added or changed sum to ≤ 90 ms in-thread, none added to
    `src/cli.test.ts`. Rows of ≥ 50 ms go deep. No new default-lane file. No NFR level moves. This ticket is a further
    claimant on the row census (`…f30bd604` 3).*
- **`NFR-009`:** no new table and no new scratch: **0 bytes** (`ADR-0074` § Consequences).

## Test notes

1. ~~QE freezes the re-measure's set before it runs.~~ The re-measure read committed corpora named in PREREG
   `…174760a3`. *2026-11-04 (`bapm-lines-1104`; the Orchestrator's ruling `…085f647c` 1): QE did not freeze the set first,
   because the Orchestrator's brief routed no QE hop. The Architect's reading stands: the sets are committed corpora
   named in the sealed PREREG (the 190, the 287, the seven zugzwang rows, `G1`'s 58), and no row was chosen. The slip
   is the Orchestrator's brief; LOW, disclosed.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). **Priority: P3.** *2026-11-04 (`bapm-lines-1104`): S confirmed, near its top end (`…62012bbe`
  § 5): about 8 lines of rule, and a switch and two doors in `ADR-0069`'s shape. The bulk is turning the switch off in
  every older door and the re-points. One SE hop, and a QE hop with C2′.*

## Dependencies

- ~~**`Q-3K-10`** (the owner).~~ *(Answered yes 2026-11-04, `…7de79e90`.)* ~~**The re-measure over Q1 and the new ADR
  that amends `ADR-0024` d4** (the Architect's; the owner accepts the ADR, reading (b)). DoR row 10.~~ *2026-11-04
  (`bapm-lines-1104`): the re-measure is done and `ADR-0074` is written PROPOSED, premise met.* ~~**OQ-0074-1** (the owner's) is
  open. Under reading (b) the build may start on PROPOSED; the merge waits on his acceptance and on DP4.~~ *2026-11-04
  (`bapm-bundle-1-cut`): OQ-0074-1 answered yes (`…3e73f9f9`); `ADR-0074` is ACCEPTED. The order below replaces reading (b).*
- **One at a time on `src/quiescence.ts`** with any ticket that edits it (Q1 merged; none open today).
  *2026-11-04 (`bapm-lines-1104`; `ADR-0074` § Consequences):* **one at a time with `ABC-282` and bundle 1** (`ABC-286` +
  `ABC-288`). `ABC-282` edits `src/engine.ts`, and bundle 1 edits `src/search.ts`'s doors and `negamax`. This ticket
  edits `src/quiescence.ts`, both `Switches` records and every door there. Whichever merges second re-reads its
  instrument counts, and the later switch is the top rung. The slot is the Orchestrator's.
- ~~**Not yet scheduled** *(2026-11-04, `…085f647c` 5)*: the build order after W1 is `ABC-301` scope 0, bundle 1, then
  this ticket. All three touch search or quiescence reads on the single test machine, and the row census gates the
  second of them.~~ `ABC-301`'s fit moves the stand pat, not `MATERIAL`: no margin is re-derived after it, and a fit that
  trips `ADR-0074` F1 is read then.
- **The order** *(2026-11-04, `bapm-bundle-1-cut`; `ADR-0056` D5's dated block; `ADR-0074` § Status, § Consequences)*: **bundle 1 (`ABC-303`)
  reads first. This ticket reads alone, after it.**
  - **Its build** starts when `ABC-303`'s merge or `failed-attempt` is recorded, not before. Both edit every door and both
    `Switches` records, so they go one at a time.
  - **Its base** is whatever `main` is when it is built: on top of the bundle if it merged, on `main` without it if NOT MET,
    on the figures `ADR-0074` records.
  - **It is not in the bundle.** It has its own PREREG, its own C2′ and its own bars (`ADR-0074` d11–d13).
  - **If the bundle merges first,** three things follow, and no bar moves: every older door gains
    `searchWithoutQuietBundle`, `chooseMoveWithoutQuietBundle` and the two parts' door pairs, with `deltaPruning` the top rung;
    d12's instrument counts are re-read on the new base, and DP3's "≥ 7.018" re-derives with the door, the bar staying door +
    0.15; and the joint tree is unread, so `ADR-0074` d11's drift and floor there are `UNKNOWN - verify`. If one trips, F1 or
    F2 of `ADR-0074` governs.
  - **`ABC-282`, in either case:** whichever of W1 and this ticket lands second re-reads b = 2.3 by P1's method and reports it
    to the Orchestrator. Any change to b is its own ticket.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ captures that cannot raise alpha are searched; the value is an estimate; ~~its post-Q1 size `UNKNOWN - verify`~~ the premise is met with Q1 in (`ADR-0074`) |
| 2 | scope and out-of-scope | ✅ scope 1–3; checks in quiescence, QSM, the cap out |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ DP0 exact, on `ADR-0074` d12's counts; DP1 (a)–(f); DP2 0 in both recursions / 7 of 7 / ≥ 54, drift ≥ 98 % within 25 cp, none beyond 30 cp; DP3 ≤ 0.88× on each of four, reach ≥ door + 0.15; DP4 ≥ 50.0 |
| 5 | dependencies known | ✅ `Q-3K-10` answered yes; the re-measure done; ~~OQ-0074-1 open, for the merge~~ OQ-0074-1 answered yes; one at a time with `ABC-282` and bundle 1; `src/quiescence.ts`; *2026-11-04 (`bapm-bundle-1-cut`): the build after `ABC-303`'s merge or `failed-attempt`* |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s and ≤ +0.10 s on the lane, `NFR-009` 0 bytes |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S, confirmed 2026-11-04 |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ~~❌~~ ✅ ~~**`ADR-0024` d4 fences it** (`Q-3K-10`, the owner's);~~ ~~the re-measure and the ADR are owed.~~ *2026-11-04 (`bapm-owner-answers-1104`): d4 is open for Q2's design (`Q-3K-10` yes). Row 10 now waits only on the Architect's re-measure on `main` over Q1 (`ADR-0024` § Status, the fourth block, item 2) and the new ADR that amends d4* *2026-11-04 (`bapm-lines-1104`): both are done: premise met, `ADR-0074` PROPOSED (`arch-ABC-289`). OQ-0074-1 holds the merge, not the build (reading (b), as `ABC-282` stood on `ADR-0071` PROPOSED)* *2026-11-04 (`bapm-bundle-1-cut`): OQ-0074-1 answered yes; `ADR-0074` ACCEPTED. The wait on `ABC-303` is an order, not a blocker* |

~~**DoR 9/10. Backlog, held** (2026-11-04: on the Architect's re-measure over Q1 and its ADR only).~~
**DoR 10/10: Ready** (2026-11-04, `bapm-lines-1104`). ~~The merge waits on OQ-0074-1 and DP4.~~ *2026-11-04 (`bapm-bundle-1-cut`): the build
waits on `ABC-303`'s merge or `failed-attempt`; the merge waits on DP4.* The column move and the build slot are the
Orchestrator's.
