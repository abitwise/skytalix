---
id: ABC-205
title: "King safety bites while the enemy queen is on, and the king table is tapered, so a centre king in an opening position costs what it should"
status: in-development
column: In Development
size: M
priority: P2
epic: EPIC-008
feature: —
adr: "ADR-0031 addendum: route the text to the owner when it lands (…7feb0553)"
---

# ABC-205: king safety that bites while queens are on, and a tapered king table

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 1 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: an `ADR-0031` addendum.** Architect/Design writes it In Design. The owner's acceptance of the
> proposal is the go-ahead (`…7feb0553` item 2). **The Orchestrator reports the addendum text to the owner when it
> lands.** It also overrides a recorded scope decision: `src/evaluate.ts:187` says "Untapered by decision", from
> `ABC-083` § Out of scope.

## Problem

- **User:** the owner, playing level 5.
- **Pain:** in game 1 the king-exposure term moved 35 cp for opening the d-file in front of an uncastled king. Stockfish
  moved about 360 cp. The term has no queen or phase dependence (`src/evaluate.ts:187`, `:189-191`, `:263-277`), and it
  is capped at 105 cp in total. The untapered king table scores e1 and d2 at 0, and scores c1 and b1 at +10 and +30 "as
  if castled" whatever the files say (`src/evaluate.ts:121-130`).
- **Evidence:** a scratch probe tripled the exposure penalty while the enemy queen was on. It turned 13.d4??, 8.e5? and
  10.Ne4? into Stockfish's moves at the real 3 s budget. Those three moves are 721 of the game's 1 428 cp of loss.
- **Value:** the largest single cause of the loss, fixed in the evaluation, and kept only if the D reading says it
  helps across many games.

## Scope

1. **Queen-dependent scale.** Each side's king-exposure penalty (shelter, half-open and open files) is larger while the
   **enemy** queen is on the board than when it is off. The factor or form is the Architect's call. The queen-present
   flag comes from the board walk that already exists.
2. **A tapered king table.** The king's piece-square value blends a middlegame table and an endgame table by game
   phase. In the middlegame half, a corner or castled square earns its bonus only while its shelter is intact. The
   phase measure and the blend are the Architect's call.
3. Relation tests for both, and the `ADR-0031` addendum.

## Out of scope

- A king-zone attacker term. The analysis offers it as a later option; it is not cut.
- Mobility (`ABC-207`), any search change, and any change to the material or other piece-square values.
- Tuning to game 1. `G11` is reported, never graded.

## Acceptance criteria

Every relation compares two positions that differ only as stated, scored from White's side, with White to move.

- **`A1` (the queen scale).** **Given** a position with White's king behind a broken shelter (for example `g2`
  missing, or a half-open file next to the king), **when** it is scored with Black's queen on and with Black's queen
  swapped for a rook, **then:**
  - the shelter-broken-minus-shelter-intact difference is **strictly larger** with the queen on;
  - this holds on **≥ 6** such pairs, in **≥ 2** king placements (castled, and uncastled on e1);
  - all of them are colour-mirrored, under `A4`.
- **`A2` (the taper).**
  - **Given** a pawn ending (kings and pawns only), **then** a king on `e4` scores **strictly higher** than the same
    king on `g1`. This is the new behaviour. Base fails it: the untapered table scores `e4` at −40 and `g1` at +30 (`src/evaluate.ts:121-130`).
  - **Given** a middlegame position with both queens on, **then** the same king on `g1` with `f2`/`g2`/`h2` scores
    **strictly higher** than on `e2`. Base holds this too; the row guards the middlegame half of the blend.
- **`A3` (no castled bonus without shelter).** **Given** a king on `b1` with its `a`, `b` and `c` pawns home, against
  the same king with the `c` and `d` files open, both with queens on, **then** the second scores **strictly lower**,
  and **by strictly more than on base**. Base charges only the file terms.
- **`A4` (existing evaluation gates).**
  - `G3`: `ABC-083` `A1` mirror exact equality over its corpus, **plus ≥ 15 new positions** with queens on and off;
    `A2`, `A3`, `A4` and `A6` stay green.
  - `G2`: the complete evaluation is ≤ 1 100 ns, with the base read in the same session.
  - **Above 1 100 ns: STOP to Architect/Design.** The `ADR-0031` route applies, and nothing is re-derived.
- **`A5` (search and NFR gates).**
  - `G1`: puzzles ≥ 54 of 58.
  - `G6`: `NFR-005` depth ≥ 6 and ≥ base.
  - `G5`: `NFR-004`.
  - `G8`: `NFR-008`.
  - `G9`: levels byte-identical.
  - `G10` applies to any red level.
  - `G4`'s identity sweep stays green. Both sides call the same `evaluate`, so a red sweep would be a defect.
- **`A6` (the gate this ticket exists for).** **Given** `ABC-204` is Done, **when** D plays this branch against its
  merge-base, **then** ship rule **S1** is met: GAIN, or GAIN after one extension.
  - **Reported, not graded:** X ± Y, the draw ratio, and `G11`'s five game-1 choices against base.
- **`A7` (the ADR).** **Then** the `ADR-0031` addendum exists, states the queen-scale and taper forms, and records that
  the Orchestrator has reported it to the owner.

## NFR triggers

- **`NFR-005`:** one flag and one blend per evaluation. Read by `G6`, with a target of ≥ depth 6 and ≥ base.
- **The `G2` cost bar:** ≤ 1 100 ns.
- **`NFR-004`, `NFR-008`:** unchanged bounds, re-read.
- **Bounds moved:** none. A miss on `G2` or `G6` is a STOP, not a re-level.
- **Security:** no `ADR-0036` limb in `src/evaluate.ts`. No Security/NFR hop is owed.

## Test notes

1. The relations are unit rows in `src/evaluate*.test.ts`, in the default lane. Report `N8-LANE`.
2. The cost and depth readings run in plain `node`, base and branch interleaved, in one session (`NFR-005` runner
   rule).
3. D runs alone at width 1 (`EPIC-008` § Host). If a value-changing merge lands on `main` before this one merges, D is
   re-read.
4. UAT: production lines change, so UAT is owed. The QE verdict signs it (`…5aaf7cec`).

## Dependencies

- `ABC-204` Done, for `A6` only. Design and build can start now.
- No other open ticket touches `src/evaluate.ts`. `ABC-207` waits for this one.
- **Builders:** Architect/Design (In Design: the forms and the addendum), the Software Engineer, QE (verdict and the D
  reading).

## Size and priority

- **`M`:** two terms (scale and taper), relation rows, the addendum, and the readings. The analysis said S-M; the taper
  pushes it to M.
- **`P2`:** this is the largest measured cause of the loss in game 1.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 10 of 10. `Ready`** (In Design first, for the addendum).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ a 35 cp term where Stockfish charges about 360; the probe; the cited lines |
| 2 | scope and out-of-scope clear | ✅ two terms; the attacker term, mobility, search and game-1 tuning fenced |
| 3 | INVEST-shaped | ✅ independent (disjoint files; D waits on `ABC-204`); valuable alone; `M`; testable |
| 4 | acceptance testable and measurable | ✅ strict relations with counts; mirror exact; ≤ 1 100 ns; depth ≥ 6 and ≥ base; ≥ 54/58; S1 |
| 5 | dependencies known | ✅ `ABC-204` for `A6`; builders named |
| 6 | security/NFR triggers with a measurable target | ✅ `G2`, `G5`, `G6`, `G8` with numbers; no bound moves; no limb |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ the ADR addendum is go-ahead by the owner's word; it is reported, not awaited |

## Design ruling

> **Architect/Design, 2026-10-24** (task `arch-design-ABC-205`, records plus light probes, at `main` `c487d89c`). Notes:
> `.grugops/context/arch-design-ABC-205/notes/`. The forms are in the **`ADR-0031` addendum (PROPOSED)**. The owner's
> acceptance of the proposal (`…7feb0553` item 2) is the go-ahead. The Orchestrator reports the text to him.
> **One owner word is owed before merge, not before the build:** `OD-205-1`, below.
> The probes ran on a scratch copy of `src/` in the session scratchpad (`design205/`), never `src/`. The host was on
> AC, at load1 7.8–9.4, with other hops running. **So no timing figure here is a reading.** Every node count,
> score and relation below is deterministic.

### The evaluation shape (the forms; the constants are hand-tuned and expected to move)

1. **The queen scale.** A king's whole exposure penalty (shelter, half-open and open files, the `ABC-083` values
   unchanged) is multiplied by **`KING_EXPOSURE_QUEEN_SCALE = 3`** while the **enemy** side has at least one queen.
   Otherwise it is multiplied by 1, so every queenless score is unchanged.
   - **Why 3.** It is the analysis probe's value, not a tuned one. ×3 and ×4 both turned the three game-1 moves. ×3
     keeps the term's ceiling at 3 × 105 = **315 cp, below a minor piece (320)**. ×4 would reach 420.
   - **The flag** comes from the existing board walk: one boolean per side, set at a queen.
2. **The tapered king square.**
   - **Phase:** the sum over both sides of N = 1, B = 1, R = 2, Q = 4, gathered in the same walk and clamped to 24.
     The start position is 24, and a pawn ending is 0.
   - **Blend, per king:** `((mg × phase + eg × (24 − phase)) / 24) | 0`. Each king is computed the same way, so the
     mirror stays exact whatever the rounding does. `| 0` truncates toward zero and never yields `−0`.
   - **The middlegame half** is the existing `KING_TABLE`, unchanged.
   - **The endgame half is ours, not a third party's:** `40 − 15 × m`, where m is the Manhattan distance to the
     nearest of d4, e4, d5 and e5. It runs from 40 in the centre to −50 in a corner. It is written as an 8×8 literal
     with the rule in its comment.
   - **Why ours.** The owner has chosen Apache-2.0 (`…28633db0`). The CC BY-SA tables are already the open licence
     question (`ADR-0044` D13). Michniewski's king endgame table would add one more. The header's credit stays on the
     six tables, plus one line: the king endgame table is this project's.
3. **No castled bonus without shelter.** In the middlegame half only, a positive `KING_TABLE` value (a1, b1, c1, f1,
   g1, h1, a2, b2, g2, h2) counts **only while the king's shelter is intact**. Intact means no shelter file is
   missing, by the same shelter test `kingExposure` uses: one definition, computed once per king. Otherwise the
   middlegame value counts as 0. The endgame half is never gated.
4. **The contract is unchanged:**
   - pure, stateless, integer and negamax-signed;
   - one board walk, with no `Move` objects and no make/unmake;
   - no new export, no new test-only door, and no new import edge (`QUEEN` comes from `position.ts`, which is
     already imported);
   - `evaluateWithoutMobility` still isolates the mobility term exactly.
5. **Header comments the build updates:** "No tapering, no endgame variants" (`src/evaluate.ts:58`) and "Untapered by
   decision" (`:187`). Each is replaced with a pointer to this page and the addendum. That is the override of
   `ABC-083` § Out of scope that the cut announced.

### The relation tests (`A1`–`A4`, plus `A3b`)

- **Where.** They are appended to `src/evaluate.king-mobility.test.ts`. A new file would add a per-file lane cost
  for nothing (`NFR-008`). They use the existing corpus and mirror helper (`ABC-082` `A7`).
- **`A1` sign, made explicit.** For each pair, assert `(intact − broken)` with the queen on, **strictly greater
  than** `(intact − broken)` with the queen swapped for a rook on the same square. Probed: base equal on 8 of 8
  (fails, as it should); candidate strict on 8 of 8. Pairs, White to move, with Black's queen on d8:
  - **castled g1, base `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1`:**
    - g2 missing: 221 vs 167;
    - g-pawn on g4 (equal material): 81 vs 47;
    - f2 missing, f half-open: 207 vs 153;
    - h-pawn on h4: 76 vs 42.
  - **uncastled e1, base `r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R`:**
    - d-pawn gone, d half-open (13.d4's shape): 139 vs 89;
    - f-pawn on f4: 51 vs 21;
    - e-pawn gone, e open (on `r1bqk2r/pp1nbppp/2n5/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R`): 185 vs 115;
    - d-pawn on d4, equal material (on `…/2n1pn2/8/…`): −11 vs −41.
  - The exact FENs are in the note. The Engineer may use others that meet the page's counts.
- **`A2`.**
  - **Pawn ending, e4 against g1.** Use the robust row: `k7/5ppp/8/8/4K3/8/PPP5/8` against `…/6K1`. It reads
    65 > −2 (base −85 < −7). The kingside-pawn version holds only by 14 cp (33 > 19), because the queenless exposure
    term (×1) still charges a centre king up to 105 cp. That is accepted, below.
  - **Middlegame, g1 against e2.** Use a full position (phase 24), so the row reads the middlegame half:
    `r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1` against the same position with the king on e2. It reads
    38 > −33 (base 38 > −3). With only queens on the board, phase is 8 and the row would mostly read the endgame
    half.
- **`A3`.** b1 with a2/b2/c2/d2 home against the c- and d-files open (both sides' c- and d-pawns gone, Black's king
  on h8 so that its zone is untouched). Queens only: −111 against base −31. Full middlegame, both queens on (`r1bq1rk1/pppnbppp/4pn2/8/8/2N1PN2/PPPPBPPP/1KBRQ2R`
  against `…/PP2BPPP/1KBRQ2R`): −187 against base −87.
  Both are strictly lower, and by strictly more than on base.
- **`A4` mirror.** 0 mismatches over 228 positions: the 184, plus 44 new positions with queens on and off. Commit at
  least 15 of them, as the page asks.
- **`A3b` (added by this ruling: the gate's own row).** `A3` cannot isolate the gate, because with queens on the
  queen scale already makes the drop exceed base's. So add a queenless middlegame row (phase 12): king on g1, with
  the g-pawn on g2 against g4 at equal material. Use `r1b2rk1/pp2bppp/2n1pn2/8/8/2NBPN2/PP3PPP/R1B2RK1` and the same
  position with the pawn on g4. The intact-minus-broken drop must be **strictly larger than on base**: 40 against 21.
  The b1/c-pawn twin reads 26 against 13.
- **Each term's mutant reds its own row (probed):**
  - scale = 1 reds `A1` on the four e1 rows. The four g1 rows stay green, because the gate's share grows with
    phase, so `A1` must keep e1 rows;
  - an endgame table equal to the middlegame table reds both `A2` pawn-ending rows;
  - the gate removed reds `A3b` (21 = 21) and leaves `A3` green.

### Existing rows the change moves (default lane, probed; deep lanes not run)

The base copy's lane has 10 environment reds from the scratch copy (no `AGENTS.md` or git). Those are excluded.
The candidate adds **11 reds in 5 files**:

| row | kind | route |
|---|---|---|
| `transposition.test.ts` `A1` knight-g1 (2 rows, 894 → 919), position-3 nodes (1 325 → 1 357); `A5` nodes (7 832 → 7 356) and the depth-3 score (−488 → −496) | pinned values | re-measure and re-pin, old → new in the PR note (`ABC-083` `A10` precedent) |
| `search.ordering.test.ts` `A4` position-6 d2 (8 887 → 8 095, the row's other pins too); `G1` position-3 (354 → 349) | pinned values | re-pin, as above |
| `search.pvs-lmr.test.ts` `A4` (2 rows: shipped −7 against reference 19) | a fixture property is lost | re-find under `ADR-0028` decision 2 (`ABC-083` re-found this row too) |
| `engine.test.ts` `ABC-170` `A1` (`e2e3` against `e1d2` on `kp-vs-k`, the endgame table) | a fixture property (one best move) is lost | re-find or re-pick the fixture under `ADR-0028` decision 2. The row's claim is the `maxDepth` stop, not the move |
| `quiescence.test.ts` `A5` position-6 depth 1: **10.96x against the 10x level** | **a level that already carries its headroom** | **`OD-205-1`**, below |

- **Deep lanes (not run).** At least `quiescence.test.ts`'s position-6 depth-3 bare-leaf pin moves (2 355 → 2 315,
  probed). Its `ORACLE_AT_DEPTH_3` pins can be re-pinned only by re-running the oracle (that file's rule). The
  Engineer runs every deep lane that reads `evaluate`.
- **The six multiplier cells** (`ABC-079` `A5`, deterministic, base → candidate):
  - kiwipete: 12.31 → 16.06x (level 180), 15.11 → 22.04x (50), 4.09 → 3.97x (70);
  - position-6: **9.19 → 10.96x (10)**, 28.46 → 29.36x (42), 4.86 → 5.16x (13).
  - The queen scale alone reads 11.02x. The taper alone reads 9.26x.

### `OD-205-1` (owner's word, before merge): re-level one quiescence cell

- **Why it is the owner's.** The 10x level is `ADR-0024` decision 3's 1.5x headroom (6.3 × 1.5). Under
  `ADR-0028` decision 4 a second headroom is not automatic, and under decision 5 a level in a ticket he accepted
  moves only on his word.
- **The ruling, not a defect:**
  - The mechanism is the queen scale: the scale alone reproduces the red, and the taper alone does not.
  - The cell's denominator is 47 nodes.
  - Base already reads 9.19x, 92 % of the level.
- **Proposed:** position-6 depth 1 becomes **1.5 × the build's reading, rounded down** (the probe gives 10.96 × 1.5
  → **16x**). Every other cell stays byte-identical. This is `ADR-0039` decision 3's pattern.
- **Conditions** (the build shows them, `ADR-0028` decision 1):
  - identity and oracle rows green;
  - the reading unchanged by the taper alone;
  - the bar's own mutant (quiescence without its MVV-LVA sort) still reads above the new level.
- **If he declines,** the queen scale cannot ship, and the ticket stops to BA/PM. The taper alone is not shipped
  in its place without its own D reading.
- It is in the addendum, so he answers once.

### `A5`: the eval cost bar (`G2`, ≤ 1 100 ns)

- **Method.** `ABC-076`'s method, as `ADR-0031` decision 3 applies it:
  - the complete `evaluate`, best of 5 × 1 000 000 per root after a warm-up;
  - the six perft roots, one tree per fresh plain-node process;
  - base and branch in one session, in the order base → branch → branch → base;
  - a mean in 990–1 210 ns is read again in a second session in reverse order.
- **Probe (not a reading, load1 ≈ 8.2):**
  - base 677.6 / 740.9 ns;
  - candidate 780.9 / 797.6 ns, which is +57 to +103 ns, +8 to 15 %;
  - worst cell 907.7 ns (position-5);
  - headroom about 1.38x.
- **The probe's form computed the shelter test twice.** The build computes it once.
- **Above 1 100 ns, or a `G6` miss: STOP to Architect/Design.** The PR note then carries scale-only and taper-only
  readings from the same session. The Engineer does not drop either term on his own. Nothing is re-derived
  (`ADR-0031` decision 4).

### `G6`, the likeliest stop (flagged, not ruled away)

- **Tree shape to depth 7:**
  - kiwipete 474 000 → 470 602 nodes (−0.7 %);
  - **position-6 804 621 → 875 057 (+8.8 %)**. Scale alone is +11.9 %, and taper alone +8.2 %.
  - Depth 6 is flat (−2.5 % / −0.1 %).
  - With the cost above, position-6 needs about 11 % more time to complete depth 7.
  - `ABC-083` left its depth-7 margin at about 1.05x.
- **On the loaded host,** all 16 3-s runs completed depth 6, on both builds and both boards. The candidate matched
  or beat base in every interleaved pair.
- **The floor (depth ≥ 6) is safe. The "≥ base" clause on position-6 is the risk.**
- **How `G6` is read, so one load spike cannot decide it** (dated, cheap to reverse; a reading rule, no level
  moves):
  - at least 5 interleaved rounds per board per build, on AC, at width 1, with load1 recorded;
  - "≥ base" compares the **median** completed depth per board;
  - any single run below depth 6 is a FAIL.

### How `S1` is proven (`A6`)

- **Order: gates first, then D.** The build is done when `A1`–`A5` are green, `OD-205-1` is answered and the branch
  head is frozen. Only then does QE run D: a reading costs about 8 h, so none is spent on a branch that cannot merge.
- **D is `EPIC-008`'s reading under `ABC-204`'s pins:**
  - candidate = the branch head's built `dist/uci.js`; base = its merge-base on `main`, built;
  - 400 games at the frozen budget B (`ABC-204` `A6`), at concurrency 3.
- **States and the ship rule** are `EPIC-008`'s:
  - GAIN is MET;
  - NEUTRAL gets one pooled 400-game extension;
  - anything else is NOT MET, a `failed-attempt` note, and the ticket goes back to BA/PM.
- **It waits on `ABC-204` Done:** E, B and the A/A check. `ABC-204` is In Review (`qe-ABC-204` is pending).
- **Staleness.**
  - `ABC-206` and `ABC-212` are value-identical, so they leave D valid.
  - **The licence ticket's path (B)**, re-deriving the tables, is value-changing. If it merges first, D is re-read.
    The forms here survive any `KING_TABLE` values.
- **Reported, not graded:**
  - X ± Y, the draw ratio, and `G11`.
  - Probe direction for `G11` at a fixed depth on a frozen clock:
    - depth 6, the depth the 3 s budget reached in game 1:
      - base plays d4, e5, Ne4, d4, Kc1;
      - the candidate plays **d3, Be2, Be2, Ng4**, Kc1.
    - Depth 7 gives the same, except base's Be2 at move 8.
  - 17.Kc1 does not move, as the analysis found.
- **If NOT MET.** The one re-tune that BA/PM may allow is recommended on the queen scale, 3 → 2. It is the term with
  the evidence and the one that moves `OD-205-1`'s cell. The forms stay.

### Accepted and open

- **Accepted:** queenless exposure stays at ×1.
  - `G3` needs it: `ABC-083` `A2`/`A3`'s equal-material rows are pawn endings at phase 0.
  - So a centre king in an ending still pays up to 105 cp against the endgame table's 90 cp range.
  - Changing that means re-finding those rows. That is a later ticket, if D says the endgame suffers.
- **Not cut, not built:** the king-zone attacker term (`EPIC-008` § Out of scope).
- **NFR.**
  - `NFR-005` (`G6`, above).
  - `NFR-008`: no new file, and the new rows run in microseconds. `N8-LANE` is reported.
  - `NFR-004`: the budget is unchanged.
  - No bound moves. `OD-205-1` is a ticket-criterion level, not a catalog bound.
- **Security:** no `ADR-0036` limb. `src/evaluate.ts` does no I/O.

### Next move

- **Orchestrator:**
  - report the `ADR-0031` addendum, including `OD-205-1`, to the owner;
  - merge this records branch;
  - move ABC-205 In Design → Ready for Dev → In Development (Software Engineer).
- The build does not wait for the owner's answer. The merge does.
- D runs after `ABC-204` is Done, alone when the board is idle.

### Addendum 2026-10-24: the build's STOP (`S1`–`S3`), ruled

> **Architect/Design, 2026-10-24** (task `arch-rule-ABC-205-stop`, records plus light probes, at `grugops/ABC-205`
> `4f650a45`). The Engineer's STOP is in `…18a6a03c` and `…3050b787`. Notes:
> `.grugops/context/arch-rule-ABC-205-stop/notes/`. The probes ran on scratch copies of `src/` (`rule205/`), never
> `src/`. Base is the merge-base `f47b3429`. Every figure below is deterministic. The host was shared (load1 4–12),
> and no timing is quoted.

**Result.** `S1` is a re-pin, and it is this role's call. `S2` and `S3` are one level, and the level is the owner's:
**`OD-205-2`**, PROPOSED in the `ADR-0031` addendum (`A7`) and in an `ADR-0026` amendment. The merge now waits on
two owner words, `OD-205-1` and `OD-205-2`. He answers both in one reply.

**2026-10-24, the owner's word** (`…fb0468ff`, verbatim *"accept your recommendations, other session paused"*): the `ADR-0031` addendum is ACCEPTED with `OD-205-1` (`A6`) and `OD-205-2` (`A7`), and `ADR-0026` decision 9 now reads 118 cp; neither owner word is owed any longer (recorded by Architect/Design, `arch-accept-owner-words-2026-10-24`).

#### `S1`: transposition `A4`, the mate-reuse row (`SEARCH_DEEP`)

- **What the probes found.** The row's depth was a node count in disguise. That was already known, and it is why
  `ABC-121` split the row. The probes also show the row lost its search-level bite before this ticket:
  - On base, the pre-`ABC-121` engine reaches depth 10 at 160–220 ticks. On the build it reaches depth 9 at 160–170
    ticks and depth 10 at 180–220 ticks. Every reading is −29 992, which equals `searchWithoutTable` at depth 10.
  - **The ±ply mutant** (drop the mate adjustment in `storeEntry` and `entryScore`) still reads **−29 992**. This
    holds on base and on the build, at every budget from 40 to 400 ticks. The mutant still read −29 994, the bite,
    at `ABC-081`'s `318c11ac`, `ABC-121`'s `5b5a0a36` and `ABC-082`'s `3858e3cf`. **The bite was lost at `ABC-083`'s
    merge, `f00038ef`.**
  - **The reuse the row is named for no longer happens.** An instrumented copy counts mate-score reads at a ply
    other than the stored one. At 160 and 180 ticks there are 0 on base and 1 on the build, and that one read
    changes no root score.
- **No re-find is possible under `ADR-0028` decision 2.** The scan covered the 287 mate-corpus positions at depths
  6–10, on a frozen clock. On base, the mutant changes no root score in any cell. On the build it changes one cell
  (`8/7k/8/7K/8/8/8/R7 w - - 2 2`, depth 9). That fixture bites on the build only, so it does not meet decision 2's
  "measured on base and branch".
- **Ruling: re-pin the depth by `maxDepth`, not by ticks.**
  - This is a value-only re-pin. No level moves.
  - It ends the node-count dependence, which a re-budget to 180 ticks would keep.
  - Every value pin stays: −29 992 is still `searchWithoutTable`'s depth-10 answer, on base and build, in both
    recursions.
  - The ±ply guarantee rests on the two default-lane table rows above it. Those rows red the mutant directly.
- **The gap, recorded and not cut:** no search-level row has caught a mis-wired ply since `ABC-083`. The only
  robust remedy is a constructed position, and that is a BA/PM candidate. `ABC-205` does not owe it.

#### `S2`/`S3`: pvs-lmr `A1`, the depth-5 drift (both recursions)

- **Reproduced exactly.** On base, `search()` reads 97.33 % within 25 cp and `chooseMove` reads 97.86 %; both have a
  51 cp maximum. On the build they read 96.79 % and 97.33 %, and both have a **79 cp maximum** on position-6/e2d2
  (56 → 135). Both runs give 0 mate flips.
- **The taper's role, split.** Every variant below keeps scale 1 unless it says otherwise. Each figure is the maximum
  in both recursions.
  - blend only, no gate: **55 cp** (e2d2). Under the level.
  - **shelter gate only, no blend: 87 cp** (e2d2). Over the level.
  - blend and gate together, which is the "taper only" variant: 83 cp (e2d2).
  - **queen scale only: 107 cp**, on a different position (position-5/h1f1, −42 → −149).
  - So the gate drives the e2d2 red. The blend does not. The scale alone reds the bar too, on another position.
- **Not a defect (`ADR-0028` decision 1, all three):**
  1. The identity and oracle rows are green on the build, in every deep lane, and the oracle was re-run (`…3050b787`).
     The `A1` mate floor is green.
  2. The red comes from the term's own mechanism. The gate makes the castled bonus a step on one shelter pawn, and
     the gate alone reproduces the red. The gate has no weight to vary, so the isolation is the proof.
  3. The bar's own mutant is still red at any new maximum. `early` reds the 95 % clause on the build (93.05 % and
     91.44 %), and its `chooseMove` maximum is 198 cp. In the build's `search()` its maximum is 79 cp, which equals
     the correct build. So a maximum alone can no longer separate `early`. The 95 % clause still does.
- **Not a fixture.** The 190 corpus is built by a rule, not chosen, and the row has no evaluator-margin label.
- **Not this role's headroom.** The 75 cp level was set against a measured 45 cp, which is 1.67x headroom. So
  `ADR-0028` decision 3 (a level set **without** measured headroom) does not reach it, and decision 4 makes the red a
  stop. The level is also `ADR-0026` decision 9's text and `ABC-121` `A1`'s criterion, and the owner accepted both.
  So it moves only on his word (decision 5).
- **`OD-205-2` (owner, PROPOSED): the depth-5 drift maximum, 75 → 118 cp, in both recursions.**
  - 118 is ⌊1.5 × 79⌋. That is `ADR-0039` decision 3's pattern, the same one `OD-205-1` uses.
  - The 95 % within 25 cp clause, the depth, the corpus and the mate floor stay byte-identical.
  - `ADR-0034` addendum decision 1 defines its clean-lead bar as this maximum. On acceptance it reads 118 cp for
    **later** L re-finds only. No retained puzzle row changes (that addendum's decision 2).
  - **If he declines,** neither term ships alone: the gate reads 87 cp and the scale reads 107 cp. `ABC-205` then
    stops to BA/PM, and nothing is re-tuned to pass the bar (`ADR-0026` decision 9).

#### The edits the Engineer may make on `grugops/ABC-205`

1. **`S1`, now:** in `src/transposition.test.ts`, change the `A4` deep row (the `SEARCH_DEEP` block under "a mate
   score is correct at every ply") as follows. Change nothing else.
   - In both calls, replace `{ budgetMs: 160, now: () => ticks++ }` with
     `{ budgetMs: 160, now: () => 0, maxDepth: 10 }`. Delete `ticks`.
   - Change `expect(shipped.depth).toBeGreaterThanOrEqual(10)` to `expect(shipped.depth).toBe(10)`.
   - Keep the other four `expect`s byte-identical.
   - Rename the row to "reports the table-free mate distance at depth 10, before `ABC-121` and shipped
     [deep, SEARCH_DEEP=1]".
   - Rewrite the doc comment to the measured facts above, and cite this addendum. The facts are: depth by `maxDepth`;
     the search-level ±ply bite lost at `f00038ef`; the two table rows carry the ±ply property; the
     `ADR-0026` decision 7 split is kept.
2. **`S2`/`S3`, only after the owner accepts `OD-205-2`:** in `src/search.pvs-lmr.test.ts`, change
   `reportAndBar`'s `expect(result.max).toBeLessThanOrEqual(75)` to `118`. Change "none beyond 75 cp" to "none beyond
   118 cp" in the two `A1` drift row titles. Add one comment line citing `OD-205-2`. Until then the two rows stay red
   and untouched.
3. **`OD-205-1`'s cell:** unchanged. The Engineer moves it only on the owner's word.
4. Then re-run `SEARCH_DEEP` transposition and pvs-lmr, and report both drift lines and both mate-floor lines.

#### Next move

- **Orchestrator:**
  - merge this records branch;
  - report `OD-205-1` and `OD-205-2` to the owner together, with the `ADR-0031` addendum;
  - hand edit 1 to the Software Engineer now.
- The merge of `ABC-205` waits for both owner words. D waits as ruled.
- **BA/PM (optional, not owed by `ABC-205`):** a constructed mate-reuse row that reds a mis-wired ply at the search
  level.

## Reading

> **QE/E2E, 2026-10-25** (task `qe-ABC-205`, branch `grugops/qe-ABC-205` from `grugops/ABC-205-final` `b5d5cea5`;
> base = its merge-base on `main`, `d5690c5c`). **One run under the owner's rule `…4c3f7639`.** Notes:
> `.grugops/context/qe-ABC-205/notes/`. Raw files, `SHA256SUMS`, `PREREG.txt` and the scripts:
> `.grugops/context/qe-ABC-205/raw/` (personal paths redacted, `ADR-0049` d4). `main` had moved to `c2775024`, and
> `git diff d5690c5c..main -- src data tools` is empty, so the reading ran on `b5d5cea5` against `d5690c5c`.

**Result: `G6` FAIL on `position-6`'s "≥ base" clause. STOP to Architect/Design (§ Design ruling, `A5`). D was not
run** (§ How `S1` is proven: gates first, then D).

| # | state | the reading |
|---|---|---|
| `A1` | **MET** | 8 pairs (4 castled g1, 4 uncastled e1), strict on all 8; base equal on all 8. Mutant scale = 1 reds the 4 e1 rows |
| `A2` | **MET** | ending e4 65 > g1 −2 (base −85 < −7); middlegame g1 38 > e2 −33 (base 38 > −3). Mutant eg = mg reds the ending row |
| `A3` | **MET** | drops 111 > 31 and 187 > 87 (base reads 31 and 87); `A3b` 40 > 21. Mutant gate-off reds `A3b` only |
| `A4` | **MET** | `G3`: mirror exact over the corpus plus 37 new positions; `evaluate*` rows green. `G2`: the SE's reading reused under `…4c3f7639` (branch 700.7 / 700.5 ns, base 653.4 / 645.3 ns): `evaluate.ts` code and its one import are byte-identical to the trees it read |
| `A5` | **FAIL (`G6`)** | `G6`, at 3 000 ms, plain node, 5 interleaved rounds per board per build, AC, load1 2.76–4.08, 0 foreign vitest: **kiwipete** base 7 7 7 7 7, head 7 7 7 7 7 (medians 7 = 7). **position-6** base **8 7 8 7 8** (median **8**), head 7 7 7 7 7 (median **7**). The depth-6 floor and the depth-7 WARN level hold. **"≥ base" fails on position-6.** `G1` 55/58 ≥ 54. `G4` green (`ENGINE_DEEP` engine 60/60). `G5`: every 3 s search returned in 2 999.8–3 001.8 ms. `G8`: `npm test` 7.23 s. `G9`: `src/levels.ts` byte-identical |
| `A6` | **not read** | D not run: `G6` is a STOP, and the page orders gates before D. `G11` (reported): base Qa4, Be2, Be2, d4, Kc1; head **d3**, Be2, Be2, **Ng4**, Kc1 |
| `A7` | **MET** | `ADR-0031` § Addendum 2026-10-24 states both forms and is ACCEPTED by the owner (`…fb0468ff`) |

**Why `position-6` misses** (deterministic, a frozen clock, not a timing figure): completing depth 8 costs base
1 451 759 nodes and head 1 522 790 (+4.9 %). Taper only reads 1 498 231 (+3.2 %), and scale only 1 450 539 (−0.1 %).
In 3 s base searched 1.44–1.46 M nodes, so it sits on its depth-8 edge (3 of 5 runs). Head searched 1.41–1.43 M nodes
and never reached 8.
