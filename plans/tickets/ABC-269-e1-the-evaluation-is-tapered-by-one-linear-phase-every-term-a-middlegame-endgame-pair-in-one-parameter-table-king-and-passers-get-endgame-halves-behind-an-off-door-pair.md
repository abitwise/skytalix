---
id: ABC-269
title: "E1: the evaluation is tapered by one linear phase (N 1, B 1, R 2, Q 4, out of 24). Every term is a middlegame / endgame pair in one data-only parameter table, and at E1 only the king square and the passed pawns get endgame halves of their own, behind a test-only off-door pair"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0064 (PROPOSED 2026-11-02, arch-E1 …d8150777, results …c524a01d, PREREG …01c2d6a5 sealed b11b802f; merged 6e11bd97). Acceptance is the owner's (\"accept ADR-0064\" / \"decline it\"). Reading (b): the build and its gates may start; B8 (the read) and the merge wait on his acceptance. B7 (G6) is graded by Q-3K-4's answer. Follows ADR-0026 d10's pattern; revises ABC-083's \"untapered by decision\"; carries the taper half of the ADR-0031 addendum"
---

# ABC-269: one tapered evaluation, the king and the passers by phase (E1)

> **Cut 2026-11-02 by BA/PM: DoR 10/10 on reading (b)** (task `bapm-E1-cut`, records only, at `main` `2bef4d31`; `src/`
> tree `58fa3eb4`; nothing run, built or timed). Source: `ADR-0064` (PROPOSED, `arch-E1`) and the Architect's notes
> `…01c2d6a5` (the PREREG), `…c524a01d` (the results) and `…d8150777` § 4 (the BA/PM inputs, worked item by item
> below). Order: `arch-next-pull` `…7e3ace66` ranks E1 first. The Orchestrator ruled *"next pull E1 (full taper,
> ABC-231/232 folded)"*, Phase 2 closed (P5 deferred) and R1 deferred to after E1 (board, 2026-11-02).
> - **`EPIC-011` Phase 4, row E1, pulled forward** (`ADR-0056` D6 allows the reorder: "the Orchestrator and BA/PM may
>   reorder by width and evidence"). It goes ahead of Phase 3 and of the rest of Phase 2.
> - **It folds two pages.** `ABC-231` (the king by phase) closes as merged into this ticket. `ABC-232` closes as merged
>   into this ticket (its phase scaling) and into E4 (any other passer term). `ABC-205` stays dropped. The rows that
>   change from the folded pages are listed under § Acceptance criteria, "What changes from the folded pages".
> - **Intent: GAIN (≥ 50.0 of 100).** It is named here, before any read, and is never re-classed after a score is seen
>   (`ADR-0064` d8 B8, d9). NEUTRAL is not open to it, because the change acts at 100 ms.
> - **The build may start. B8 (the read) and the merge wait on the owner's acceptance of `ADR-0064`.** With no answer,
>   `main` keeps its untapered evaluation. **B7 (`G6`) is graded only once `Q-3K-4` is answered.** The build does not
>   wait for that answer. The board move is the Orchestrator's; this page recommends Ready.

## Problem

- **User:** the owner at level 5 in a chess UI, in the endgame, and every later reading of this epic.
- **Pain:** `src/evaluate.ts` tapers nothing (`ABC-083` § Out of scope, "untapered by decision").
  - The king table hides the king in every phase (`KING_TABLE`, −20 to −50 on the centre squares of every rank). In
    a king-and-pawn ending the king is told to stay in the corner: on the probe's six endings the base evaluation reads
    the centre king **35 to 86 cp worse** than the corner king.
  - Passed pawns are scored by rank only (`PASSED_PAWN_BONUS`, 0 5 10 20 35 60 100). A passer on the 6th is worth the
    same with every piece on as in a pawn ending.
- **The evidence that evaluation is the lever now** (`arch-next-pull` `…d0f1a5fc`): on 145 self-play positions, 31 of
  the 48 errors of 50 cp or more at the 100 ms node budget (47 000 nodes) survive two doublings of search, and 11 of 13
  survive after 60 plies. Every open pruning or ordering item buys well under one doubling.
- **Value:** +30–90 Elo self-play (estimate: `ADR-0056` D2's +40–120 for the full taper, discounted for having two
  endgame halves of about 800 numbers; `arch-next-pull` `…7e3ace66`). It is not a reading. C2′ resolves about ± 56 Elo,
  so GAIN means "point estimate ≥ 0", not a proven gain (`ADR-0064` d9).
- **It is also E2's prerequisite.** `ABC-239` (the tuner) needs a middlegame and an endgame half for each weight, in one
  table it can rewrite (`ADR-0064` d4).
- **The warning, said plainly:** on the evaluation instrument (information only, never a bar) the chosen linear form
  reads level with `main` (49 errors against 48). A clean premise is not a gain. `ADR-0064` § Context.

## Scope

`ADR-0064` decisions 1–7, cited and not restated. The ADR governs each line.

1. **Phase** (`ADR-0064` d1): N 1, B 1, R 2, Q 4 over both sides, gathered in the existing non-pawn branch of the board
   walk, clamped to 24. `PHASE_MG` 24 and `PHASE_EG` 0 (form L), so w = phase.
2. **The blend** (d2): score = mg + trunc(Δ × (D − w) / D), with Δ summed only over the terms whose halves differ. It
   is the full blend bit for bit. Truncation toward zero, never `Math.floor`; the negamax flip stays `0 − score`.
3. **Two value changes, each by a stated rule** (d3, `ABC-215`'s provenance rule):
   - the king's endgame half = **40 − 15 m**, m = Manhattan distance to the nearest of d4, e4, d5, e5 (the `ADR-0031`
     addendum's rule; +40 in the centre to −50 in a corner); its middlegame half is today's `KING_TABLE`;
   - the passed pawn's endgame half = **2 × today's bonus by rank** (0, 10, 20, 40, 70, 120, 200); its middlegame half
     is today's `PASSED_PAWN_BONUS`.
   - Every other term has an endgame half equal to its middlegame half: no value change.
4. **One data-only parameter table, `src/evaluate-params.ts`** (d4): no logic, no imports, about 800 numbers as
   `{ mg, eg }` pairs or mg / eg arrays, each table carrying its rule in a comment. `src/evaluate.ts` imports it and
   derives its flat arrays once, at load. `VALUE_TABLES_FOR_TEST` grows to expose the king's endgame half and the
   passed endgame half.
5. **The pawn memo's third part** (d5): an `Int32Array` for the passed endgame part beside `pawnCacheStructure` and
   `pawnCachePassed`, still keyed exactly by the two masks. 2^14 × 28 bytes = **448 KiB** (from 384 KiB).
6. **Per-node cost near zero by construction** (d6): no second walk, no new loop, no new board read, no incremental
   state in `Position`.
7. **One switch and three test-only doors** (d7, `ADR-0026` d10's pattern):
   - the switch `taper` in `src/search.ts`'s `Switches` and `src/engine.ts`'s `Heuristics`, on in `search()` and
     `chooseMove` only, never module state; it selects the evaluation at today's three call sites (two in
     `src/search.ts`, the stand-pat in `src/quiescence.ts`);
   - `evaluateWithoutTaper(position)` (the blend with w = D, equal to `main`'s `evaluate`), `searchWithoutTaper(position,
     depth)` and `chooseMoveWithoutTaper(position, options)`;
   - **every door that exists before this ticket turns `taper` off** (the ladder rule).
8. **Rows, by reference** (d7; `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6, `ADR-0061` d6): a shipped-side row whose
   other side is an older door re-points to the new door of its recursion, figures unchanged. Value and behaviour rows
   on the shipped path stay there (zugzwang, mate, `G1`). A pinned value that moves is re-pinned, old → new in the PR.
   A lost fixture property is re-found under `ADR-0028` d2. **No zugzwang depth is re-pinned.**
9. **Header comments:** "No tapering, no endgame variants" and "Untapered by decision" in `src/evaluate.ts` point to
   `ADR-0064`.

## Out of scope

- **King safety** (E3): no queen scale, no shelter gate, no king-zone attackers. The `ADR-0031` addendum's queen scale
  and shelter gate stay "accepted, not shipped", as E3's input. Tapering king shelter to 0 in the endgame is E3's too.
- **New passer terms** (E4): no king distance, free path, unstoppable passer, connected or backward pawn.
- **Tuning** (E2, `ABC-239`), including the plateau form P's two phase limits. They are parameters E2 owns, not a
  re-read here (`ADR-0064` § Alternatives).
- **Any other endgame half.** No hand-written endgame value without a rule, for any term.
- **The two-accumulator blend and a packed score** (E2's options) and **incremental phase / material / PST** (O1-e).
  O1-e or a packed score is allowed only as F3's single value-identical cost cut (below).
- `src/transposition.ts` beyond its byte row; the thread strand; P1, P4, P5, P6 and O1h. `ADR-0060` / `ADR-0063` name
  "an evaluation change that changes the tree" as a re-open premise; whether E1 re-opens P1 is a new pre-registered
  probe after the merge, not owed by this ticket.
- Any production hook, counter or flag for the probes.

## Acceptance criteria

One row per bar of `ADR-0064` decision 8, with the probe figures as the expected values. **The bars are fixed there
and are not loosened after Ready.** The ADR's falsifier table is authoritative.

- **B0 (node identity with the design; `ADR-0064` d8 B0). The instrument check: every other bar is read only after it
  holds.**
  - **Given** the build on `src/` tree `58fa3eb4`, **when** `chooseMove` is deepened on a frozen clock, **then** it
    reads exactly these node counts to complete each depth:

    | board | depth | nodes (build) | `main` (the door) | ratio |
    |---|---|---|---|---|
    | kiwipete | 8 | **1 296 788** | 1 306 981 | 0.9922 |
    | kiwipete | 9 | **2 733 330** | 2 842 284 | 0.9617 |
    | position-6 | 8 | **404 930** | 391 451 | 1.0344 |
    | position-6 | 9 | **926 005** | 915 007 | 1.0120 |
    | position-6 | 10 | **1 692 669** | 1 684 330 | 1.0050 |

  - **And** `search()` at depth 8 reads **839 514 / 1 533 901** (kiwipete / position-6).
  - **And** the doors read `main`'s counts: `chooseMoveWithoutTaper` 1 306 981 / 391 451 at depth 8, and
    `searchWithoutTaper` 888 786 / 1 262 046 at depth 8.
  - **If `main`'s `src/` has moved by the build,** the Engineer applies `patch_e1.py` (form L,
    `.grugops/context/arch-E1/raw/probe/`) to the new base, re-reads the expected counts, and puts both sets in the PR.
    A count that differs is explained before any other bar is read. A re-derived count is a dated line in `ADR-0064`
    (the Architect's), never a moved bar. A miss is F1: a defect, fixed before anything else is read.
- **B1 (relations; default-lane units in `src/evaluate*.test.ts`, no search).**
  - **(a) The mirror.** **Given** `G3`'s corpus plus **≥ 15 new positions at phases spread over 0–24** (QE freezes them
    before the build), **then** every position and its colour mirror score equal, `Object.is` (probe: 0 mismatches
    of 184).
  - **(b) Identity at phase 24.** **Given** every full-material position in the corpus, **then** `evaluate` equals
    `evaluateWithoutTaper` exactly (probe: 7 of 7 equal, form − base = 0).
  - **(c) The door is `main`.** **Given** a frozen corpus, **when** it is run through the pre-ticket `evaluate` and the
    build's `evaluateWithoutTaper`, **then** every score is equal, `Object.is`. The run is in the PR.
  - **(d) The king walks.** **Given** the 6 king-and-pawn endings QE freezes before the build, **then** the evaluation
    with the king on a centre square exceeds the same ending with the king in a corner by **≥ 20 cp**, from that
    king's side (probe: +44 to +95; base −35 to −86).
  - **(e) The passers.** Read through the `VALUE_TABLES_FOR_TEST` arrays, or through a position pair that differs only
    by the passer (the probe's whole-evaluation passer rows are confounded by the king term and decide nothing). At each
    rank where base's bonus is > 0:
    - **at phase ≤ 6** the passed term is **≥ 1.5 ×** base's (≥ 1.75 × by construction);
    - **at phase 24** it **equals** base's exactly;
    - **at phase ≥ 18** it is **≤ 1.25 ×** base's.
  - **The rule rows:** `ABC-215` `A2`'s rebuild-from-rule row covers the king's endgame half (40 − 15 m) and the passed
    endgame half (2 × by rank).
- **B2 (the mate floor; `search()`, the 287 mate corpus, `SEARCH_DEEP=1`).**
  - **Given** the door's mates at depth 4, **then** the shipped search at depth 5 scores each as a mate of the same
    sign: **0 violations** (probe 0 of 163).
  - **Given** the door's mates at depth 5, **then** the same at depth 5: **0 violations** (probe 0 of 189).
- **B3 (zugzwang, hard).** `ADR-0050` d9's seven rows (`zugzwang.001`, `.004`, `.005`, `kpk-b6c6`, `kpk-c6d6`,
  `kpk-d6e6`, `kpk-e6f6`), `chooseMove` at their recorded depths, each plays its recorded move: **7 / 7** (probe 7 / 7).
  Never re-pinned to a deeper depth.
- **B4 (`G1`).** `PUZZLE_DEEP=1`: **≥ 54 / 58 with no NEWLY-MISSED line** (probe 54 / 58, none newly missed). A red is
  classed per row under `ADR-0034`.
  - **Gates carried from `ABC-231` A5 and `ABC-232` A4:** `G5`, `G8`, `G9`, `G10`. **`G7` is owed:** the pawn memo
    grows by a fixed 64 KiB (`NFR-009` below).
- **B5 (`ADR-0061`'s futility audit on this scale).** QE reads `ADR-0061` d8 (d), the cut audit, on a scratch copy of
  the build. Its bars do not change: **flips ≤ 0.5 % of the sampled nodes, and 0 flips of 200 cp or more.** The drift
  (100 %, max 0 in both recursions) and the mate floor (0 / 190) are already read clean on this scale (`ADR-0064`
  § Context), and B0 carries them over. A miss is F5: `ADR-0061`'s margins are re-read on this scale by a dated
  amendment there before E1 merges.
- **B6 (`G2`).** The complete evaluation costs **≤ 1.05 ×** base per call, in the same session, by `ABC-076`'s method
  as `ADR-0031` d3 applies it (with `ADR-0031`'s near-bar rule). The design estimate is +1–2 % of node time
  (`UNKNOWN - verify`; this row reads it).
- **B7 (`G6`, by `Q-3K-4`'s answer).** Both readings run at `LEVELS[5]` (4 000 ms), plain `node`, on the reference host,
  by `ABC-205`'s reading rule: at least 5 interleaved rounds per board per build, width 1, load recorded, medians
  compared. **Any single run below depth 6 is a FAIL.**
  - **Under the default ("≥ base" binds):** the median completed depth on kiwipete and on position-6 is **≥ base's**.
    The frozen-clock pre-check is B0 (the tree shape is then known: ≤ 1.035 × at position-6 d8, ≤ 1.012 × at d9 / d10,
    0.96 × at kiwipete d9). A miss is F3.
  - **Under the alternative (judged on play):** `NFR-005` alone. Every run completes depth ≥ 6 (FAIL below); depth 7 is
    a WARN level. "≥ base" is reported, not graded, and B8 decides.
  - **The named residual risk:** a board sitting on a depth edge can flip its median on 1–4 %. No value-changing
    evaluation can promise otherwise (`…d8150777` § 2). Where 4 000 ms lands on today's `main` is `UNKNOWN - verify`.
- **B8 (the read; `EPIC-011` § The per-change rule, by reference). Waits on the owner's acceptance of `ADR-0064`.**
  - **Intent: GAIN.** One 100-game read at 100 ms a move before the merge: the candidate head rebased on `main` against
    its merge-base, self-play, openings 1–50 with both colours, one game at a time, `Threads 1` against `Threads 1`,
    QE with the host ALONE, through `ABC-255`. **MET** on 100 of 100 games complete, 0 candidate faults, 0 losses on
    time at the 50 ms margin, and **≥ 50.0 of 100** (`ADR-0056` C2′). A miss is NOT MET and is not re-played. The
    harness's `state: NEUTRAL` label at ≥ 43.0 does not apply. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error,
    `G11`.
  - **The Stockfish smoke beside it (S′):** 10 games at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`,
    `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`, `skytalix`
    `timemargin` 50 ms. MET on 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at **E 1 810**: ≥ 3.0 of 10,
    below that 10 more games and ≥ 7.0 of 20. Pooled into the S′ pool only if merged (`EPIC-011` § Close-out).
  - **The Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest
    run src/levels.test.ts --reporter=verbose`, QE, host ALONE: exit 0 with every test passed (57 at the last read; QE
    counts its own run).
  - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime`, test flag or environment.
- **Reports, not bars** (none is graded; an evaluation change is expected to drift): drift against the doors at d5 on
  the 190 (probe 98.40 % within 25 cp, max 61 cp, 0 sign changes, 0 mate flips); reach at 47 000 nodes (probe 5.837 →
  5.879, +0.042); the evaluation instrument on the 145 (probe: L level with `main`).

### What changes from the folded pages

| folded row | becomes | why |
|---|---|---|
| `ABC-231` A1 (the `ABC-205` `G6` replay on position-6) | **B7**, on both boards, graded per `Q-3K-4`; B0 is its frozen-clock pre-check | the replay keeps its reason; the grading follows the owner's answer |
| `ABC-231` A2, "the king term equals base's within 2 cp" at the start and 6 middlegames | **B1 (b)**, exactly equal at phase 24 | stronger; it holds by construction (d2) |
| `ABC-231` A2, centre ≥ corner + 20 cp on 6 frozen endings | **B1 (d)**, unchanged bar | — |
| `ABC-231` A3 and `ABC-232` A2 (`G3` mirror and purity) | **B1 (a)**, plus ≥ 15 new positions at phases 0–24 | the blend is new code at every phase |
| `ABC-231` A4 (`G2` ≤ 1.05 ×) and `ABC-232` A3 (`G2` ≤ 1.03 ×) | **one row, B6, at ≤ 1.05 ×** | 1.03 × was for a passer-only change and folds into the whole change |
| `ABC-232` A1, ≥ 1.5 × at phase ≤ 0.25 | **B1 (e)**, ≥ 1.5 × at phase ≤ 6 (of 24) | the same point on the 0–24 scale |
| `ABC-232` A1, "within 5 cp of base at phase ≥ 0.75" | **B1 (e)**, exact at phase 24 and ≤ 1.25 × at phase ≥ 18 | the old clause is false by construction for an advanced passer (100 cp reads 125 at phase 18) |
| `ABC-231` A5 / `ABC-232` A4 (gates) | **B4**'s gate line, plus `G7` | the memo grows |
| `ABC-231` A6 / `ABC-232` A5 (C2′, S′ at E 1 810, the Levels lane) | **B8**, unchanged, by reference | — |

### Falsifiers and their dispositions (`ADR-0064` § What would falsify this; its table governs)

| # | fires when | row | disposition |
|---|---|---|---|
| F1 | B0's counts not reproduced | B0 | a defect: the build is not this design; fixed before any other bar is read |
| F2 | a mirror mismatch; `evaluateWithoutTaper` ≠ `main`'s `evaluate`; a door or an older door not node-equal to its pre-ticket self | B1 (a)–(c), `G4` | a defect |
| F3 | under the default, `G6`'s median below base on either board; or `G2` above 1.05 × | B6, B7 | STOP to Architect/Design. **One value-identical cost cut is allowed** (O1-e-style incremental phase, or a packed score), node-equal by B0, then one new `G6` reading. A second miss: not merged, and the Orchestrator puts `Q-3K-4` to the owner with both readings if unanswered. No value is tuned to pass `G6` |
| F4 | a zugzwang row not played at its depth, a mate-floor violation, or a NEWLY-MISSED `G1` line | B2–B4 | a defect check first; if real, NOT MET and `ADR-0064` re-opens. Never a re-pin to a deeper depth |
| F5 | the futility audit above its bars | B5 | `ADR-0061`'s margins re-read on this scale by a dated amendment there, before E1 merges |
| F6 | B8 below 50.0 of 100, an S′ collapse, or a red Levels lane | B8 | not merged; `ADR-0064` reads "accepted, not in force". The structure (d1, d2, d4, d5, d7) may be re-offered value-identical to `main` as E2's base: E2's ADR's call, not a re-play |

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): B7 under each `Q-3K-4` answer; floor 6 unchanged. B0 pins the
  tree shape at 0.96–1.035 × on the `G6` boards.
- **`NFR-001` / `G2`:** B6, ≤ 1.05 × base per call, same session.
- **`NFR-009`** (≤ 16 MiB search-held, ≤ 1 MiB growth between a 1 s and a 3 s search): the pawn memo grows by a fixed
  **384 → 448 KiB** (+64 KiB); nothing grows per search. `transposition.test.ts`'s byte row re-pins 384 → 448 KiB. The
  sum stays far under 16 MiB (the table is 4 MiB). `G7` reads it.
- **`NFR-008`** (`npm test` ≤ 10 s): the relation rows (B1) are default-lane units with no search. B0, drift, the mate
  floor, zugzwang and reach sit behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`. `N8-LANE` reported before and after.
- **`NFR-004`:** no new throw site and no clock change (`G5`).
- **Security:** none. No new input path, data, format, option or dependency (no `ADR-0036` limb).
  `plans/nfr-catalog.md` is untouched.

## Test notes

1. **QE freezes before the build** (`…d8150777` § 4 item 4): the 6 king-and-pawn endings for B1 (d), the passer pairs
   or array readings for B1 (e), and the ≥ 15 new mirror positions at phases 0–24 for B1 (a). Each is stated with its
   FEN and phase, committed before the build's first commit, and never changed to make a row fit.
2. **Migration, for sizing** (`ADR-0064` § Consequences): the lane probe with every path tapered gives an upper bound of
   **40 pinned or fixture rows in 7 files** (quiescence 18, engine 8, transposition 5, futility 3, ordering 3, pvs-lmr 2,
   null-move 1; `.grugops/context/arch-E1/raw/probe/out/E-lane-reds.txt`). `src/evaluate*.test.ts` stays green. The
   ladder keeps older doors untapered, so the real count is lower. Each row is classed by scope 8.
3. **The deep lanes were not run** (`UNKNOWN - verify`). The Engineer runs every lane that reads `evaluate`, including
   `quiescence.test.ts`'s deep pins and `ORACLE_AT_DEPTH_3`, which re-pin only by re-running the oracle (that file's
   rule).
4. **The PR lists every re-pointed and re-pinned row** with old → new figures, the B0 counts read, and the B1 (c) run.
   No zugzwang row's depth is re-pinned.
5. Reuse sourced fixtures: `G3`'s corpus, the 190, the 287 mate corpus, `ADR-0050` d9's zugzwang set, the `ABC-078`
   `A3` corpus, `kiwipete`, `position-6`. The probe's instrument (`patch_e1.py`, `e1probe.ts`) is reference only and
   never enters `src/`.
6. Deterministic mode (`ADR-0027`) holds: pure and integer, trunc is odd; the same input and virtual clock give the same
   move. That is what makes B0's counts exact.
7. **UAT is owed** (production lines). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).

## Size and priority

- **Size: M** (`ADR-0056` D2; `…d8150777` § 4 item 1): one phase add, one blend, two value rules, a new params module,
  the memo's third part, a switch and three doors, plus up to 40 migrated rows and the frozen relation rows.
- **Priority: P2.** The next `EPIC-011` pull (`arch-next-pull` ranks it first; the Orchestrator's ruling). Both folded
  pages were P3; E1 is raised because it is the pull, and E2's prerequisite.

## Dependencies

- **Owner: acceptance of `ADR-0064`** (*"accept ADR-0064"* / *"decline it"*). It gates B8 and the merge only (reading
  (b), the `ABC-208` / `ADR-0059` / `ADR-0061` precedent). Default: no taper on `main`. `EPIC-011` § Owner questions.
- **Owner: `Q-3K-4`**, answered before B7 is graded. The build does not wait. The Architect recommends "judge on play"
  with the depth-6 floor; the default is "≥ base" binds.
- **Base:** `main` at `2bef4d31`, `src/` tree `58fa3eb4` (read, `git rev-parse`), the probe's tree. If `main`'s `src/`
  moves first, B0's counts are re-derived with `patch_e1.py` (B0).
- **File collisions, one at a time:** `src/evaluate.ts` (no open ticket touches it); `src/search.ts`, `src/engine.ts`
  and `src/quiescence.ts` (the switch and the doors). The parked P1, the parked `ABC-233` and the parked `ABC-266`
  touch those files; none is moving. The second to merge re-reads its door counts.
- **Couplings:** `ADR-0061` (B5); E2 (`ABC-239`) takes decision 4 as its seam, and `Q-3K-7` (data) goes live when E2 is
  pulled; O1-e is re-read after E1 (`EPIC-011`); R1 is read after E1 (the Orchestrator's ruling).
- **QE:** the freezes (test note 1) before the build; B5 on a scratch copy; B7 on the reference host; B8 with the host
  ALONE.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the untapered king and passers (`src/evaluate.ts`, `ABC-083`); the instrument's surviving late errors (`…d0f1a5fc`); the estimate labelled an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–9 = `ADR-0064` d1–d7; E2, E3, E4, other endgame halves, O1-e out |
| 3 | INVEST | ✅ M; independent of every open ticket; one mechanism behind a switch and a door pair; reading it whole avoids three reads inside ± 56 (`ADR-0064` § Alternatives) |
| 4 | testable, measurable acceptance | ✅ B0 exact counts (5 + 2 + doors); B1 (a) 0 mismatches over `G3` + ≥ 15, (b) exact at phase 24, (c) `Object.is`, (d) ≥ 20 cp × 6, (e) ≥ 1.5 × / exact / ≤ 1.25 ×; B2 0 / 163 and 0 / 189; B3 7 / 7; B4 ≥ 54 / 58; B5 ≤ 0.5 % and 0 ≥ 200 cp; B6 ≤ 1.05 ×; B7 per `Q-3K-4` (median ≥ base, or every run ≥ 6); B8 ≥ 50.0 of 100, S′ at E 1 810, Levels |
| 5 | dependencies known | ✅ `ADR-0064` (written, PROPOSED; acceptance gates B8 and the merge); `Q-3K-4` gates B7's grading; the base tree; file collisions |
| 6 | NFR triggers with targets | ✅ `NFR-005` floor 6 (B7); `G2` ≤ 1.05 ×; `NFR-009` +64 KiB fixed (448 KiB), ≤ 16 MiB; `NFR-008` ≤ 10 s, deep rows behind flags |
| 7 | test notes | ✅ 1–7 (QE freezes, migration bound, deep lanes owed) |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the ADR is written, PROPOSED. Reading (b): the build may start; B8 and the merge wait on *"accept ADR-0064"*; B7 is graded once `Q-3K-4` is answered |

**DoR 10/10 on reading (b). Backlog, Ready recommended** (the board move is the Orchestrator's). The build may start
from `main` once QE has frozen test note 1's positions. B8 and the merge wait on *"accept ADR-0064"*; with no answer,
nothing merges.
