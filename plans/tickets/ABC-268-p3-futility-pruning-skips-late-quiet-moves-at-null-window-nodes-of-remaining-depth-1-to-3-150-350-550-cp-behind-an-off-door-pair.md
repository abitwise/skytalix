---
id: ABC-268
title: "P3: futility pruning skips the late quiet moves at null-window nodes of remaining depth 1 to 3, with margins of 150 / 350 / 550 cp, in both recursions, behind an ADR-0026 test-only off-door pair"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0061 (PROPOSED 2026-11-02, arch-phase2-p3 …004b35ed, probe …55f7725e, merged 2f9c32f4). Acceptance is the owner's: \"accept ADR-0061\" or \"decline it\". Reading (b), the ABC-208 / ABC-238 / ADR-0059 precedent: the build and its gates may start; the read (A6) and the merge wait on his acceptance. Default without an answer: no futility pruning on main. Follows ADR-0026 d10's pattern; amends no ADR"
---

# ABC-268: futility pruning near the leaves (P3)

> **Cut 2026-11-02 by BA/PM: DoR 10/10 on reading (b)** (task `bapm-P3-page`, records only, at `main` `6413f91f`;
> nothing run, built or timed). Source: `ADR-0061` (PROPOSED, `arch-phase2-p3`) and the Architect's notes `…004b35ed`
> (decision), `…55f7725e` (the probe) and `…e8bec702` (the BA/PM list, worked item by item below). Order: `ADR-0056`
> D2's dated line of 2026-11-02 (P3 now → P1 if green → P5 → P4 after O1h → P6 not before E1 / E2), and the
> Orchestrator's ruling *"P3 ahead of parked P1"* (board, 2026-11-02). `EPIC-011` Phase 2, **first**.
> - **Intent: GAIN (≥ 50.0 of 100).** Named here, before any read, and never re-classed after a score is seen
>   (`ADR-0061` d10). The rule fires at 100 ms, so NEUTRAL (invisible at 100 ms) is not open to it.
> - **The build may start. The read (A6) and the merge wait on the owner's acceptance of `ADR-0061`.** With no answer,
>   no futility pruning on `main`. The board move is the Orchestrator's; this page recommends Ready.
> - **It shares `src/search.ts` and `src/engine.ts` with the parked P1** (`ADR-0060`). Whichever of the two merges
>   second re-reads its door counts on the new `main` (`ADR-0061` d9). The bars do not move.

## Problem

- **User:** the owner at level 5 in a chess UI, and every later reading of this epic.
- **Pain:** the search has no futility pruning of any kind (`ADR-0056` § Inventory: "Futility, reverse futility,
  razoring, late-move pruning | **no**"). At a node near the leaves whose static score plus any quiet move's plausible
  gain is still at or below alpha, every quiet move is still made and searched, so nodes that cannot raise alpha cost
  a full expansion.
- **Value:** +15–40 Elo self-play (estimate, `ADR-0056` D2 row P3). `ADR-0061` d10 narrows it to about +15–35 by
  `ADR-0055`'s speed rule (estimate, [D]/[J]; no games played). The measured premise, each on `main`'s `src/`
  `f2388e40`:
  - 0.79–0.83× the door's nodes at fixed depth 8 in both recursions;
  - +0.279 ply of mean completed depth at the 100 ms node budget (47 000 nodes on the 190);
  - at depth 6 on the 190, 30 272 nodes fire and 901 655 moves are skipped (0.803× the door's nodes).
- **The warning, said plainly:** P2 (`ABC-264`) bought about 2.5× this reach and still read 44.0 / 100. A clean
  premise is not a gain. C2′ resolves about ± 48 Elo at 95 %, so GAIN means "point estimate ≥ 0", not a proven gain
  (`ADR-0061` d10).
- **Why this item:** it is the Phase 2 item that pays, stays exact enough and needs neither P1 nor P2 (`ADR-0061`
  § Context, "Why P3"). It reads no move number and no reduction. P4 drifts and makes piece-sized errors without a
  quiet-move order; P6 loses `zugzwang.004`; P5 is depth-gated.

## Scope

1. **The rule, in BOTH recursions** (`src/search.ts`, `src/engine.ts`), exactly as `ADR-0061` decision 1 words it. At
   a node where every condition holds (not the root; entered with a null window, `alphaIn + 1 === beta`; remaining depth
   d of 1, 2 or 3; side to move not in check; alpha and beta both strictly inside (−`MATE_FLOOR`, `MATE_FLOOR`); and
   `evaluate(position) + M[d] ≤ alpha` with **M = 150 / 350 / 550 cp**), every move at index ≥ 1 that neither
   captures nor promotes nor gives check is skipped: not made, not searched, not counted as a node.
   - The first move, captures, promotions and checking moves are always searched.
   - The index still advances past a skipped move, so later moves' LMR index is unchanged.
   - The node returns the best score among the moves searched, fail-soft, and stores it as today
     (`boundOf(best, alphaIn, beta)`).
   - The node test runs once per node, after the table probe and the null move, once the move list exists.
2. **Two exported pure functions in `src/search.ts`** (`ADR-0061` d2): `futilityNode(position, depth, ply, alphaIn,
   beta): boolean` and `futileMove(position, move, index): boolean`; one module constant
   `FUTILITY_MARGIN = [0, 150, 350, 550]`, never written after load.
3. **One switch, `futility`,** in `Switches` (`src/search.ts`) and `Heuristics` (`src/engine.ts`), on in `search()`
   and `chooseMove` only. Never module state, an `EngineOptions` field or a parameter of `search()` (`ADR-0026` d2;
   `ADR-0061` d3).
4. **Two TEST-ONLY doors:** `searchWithoutFutility(position, depth)` and `chooseMoveWithoutFutility(position,
   options)` (the engine door takes no depth, `ABC-078` `A4`). **Every door that exists before this ticket turns
   `futility` off** (`ADR-0026` d3's ladder; `ADR-0061` d5). If P1 merges first, its door also turns futility off, and
   this ticket's doors keep log reductions on: one rung each, in merge order.
5. **Rows re-pointed by reference** (`ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6; `ADR-0061` d6). A row whose shipped
   side is `search()` or `chooseMove` and whose other side is an older door re-points its shipped side to the new door
   of the same recursion; its figures do not change. Value and behaviour rows on the shipped path stay there
   (zugzwang, mate, `G1`). **No zugzwang row's depth is re-pinned.**
6. **Module headers** in `src/search.ts` and `src/engine.ts` name the new switch, as they name `ABC-208`'s.

## Out of scope

- **The depth-4 row (750 cp).** Measured clean and better (0.75–0.80×, +0.321 ply), not taken now (`ADR-0061`
  § Alternatives). A dated amendment may add it after this ticket's read, with its own audit and reach rows. It is a
  new ticket then, not a widening of this one.
- P1 (log LMR, parked), P4 (move-count pruning, waits on O1h), P5 (depth-grown R), P6 (razoring), and any re-cut of P2
  (`ADR-0059`, accepted, not in force).
- A "three non-pawn pieces" guard (`ADR-0061` § Alternatives: futility never passes; zugzwang 7 / 7 without it).
- Any evaluation change, and any edit to an existing predicate in place (`ADR-0026` d10's pattern).
- `src/transposition.ts` and the thread strand (`ABC-265`, `ABC-266`). `ADR-0061` § Consequences: no interaction.
- Any production hook, counter or flag for the cut audit (A3 (d) is a scratch reading).

## Acceptance criteria

- **A1 (the doors, `G4`).** Node-equal, cross-build, on the `ABC-078` `A3` corpus. QE runs it out of tree, base tree
  against head tree (`ABC-208` `A1`'s form).
  - **Given** the base tree's shipped `search()` and `chooseMove`, **when** the head's `searchWithoutFutility` and
    `chooseMoveWithoutFutility` run the same corpus, **then** move, score and nodes are equal on every row.
  - **Given** every test-only door that exists in the base tree, **then** the head's door of the same name equals its
    base self in move, score and nodes on every row.
  - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **exactly three** names: `searchWithoutFutility`,
    `futilityNode` and `futileMove`. `ABC-078` `A4` (`src/engine.ts`) grows by **exactly one**:
    `chooseMoveWithoutFutility`.
- **A2 (the rule and its guards; `ADR-0061` d1, d2, d3, d7).** Default-lane unit rows with no search, test-side only,
  no production counter.
  - **`futilityNode`, called directly,** on a constructed position, at d = 1, 2 and 3 in turn:
    - **Given** a null window with alpha = `evaluate(position)` + M[d] exactly, **then** it returns **true**.
    - **Given** alpha = `evaluate(position)` + M[d] − 1, **then** it returns **false**.
    - **Given** a node where every other clause would prune, **then** it returns **false** for each of these, one row
      per clause: ply 0 (the root); a PV window (`alphaIn + 1 < beta`); d = 0; d = 4; the side to move in check; alpha
      in the mate band; beta in the mate band.
  - **`futileMove`, called directly:** **false** at index 0, for a capture, for a promotion, and for a quiet move that
    gives check; **true** for a quiet, non-checking move at index ≥ 1.
  - **Purity:** for each function, the position is byte-identical before and after the call (`ADR-0061` d2).
  - **The constant:** `FUTILITY_MARGIN` reads `[0, 150, 350, 550]`, and no line in `src/` writes it after load (a
    source row).
  - **A source row** reads both `negamax` bodies. With `futility` on, each calls `futilityNode` once per node with the
    entry window, after the table probe and the null move. It skips exactly the moves `futileMove` names, advances the
    index past each, and stores through the existing `boundOf(best, alphaIn, beta)` path. `futility` is a field of
    `Switches` and `Heuristics` and of nothing else (scope 3).
- **A3 (value safety, the bounded oracle; `ADR-0061` d8).**
  - **(a) Drift.** At depth 5 on `ABC-121`'s 190, in BOTH recursions: `search()` against `searchWithoutFutility` at
    fixed depth 5, and `chooseMove` against `chooseMoveWithoutFutility` deepened to 5 on a clock that does not expire.
    **Bar: every non-mate score within 25 cp, and 0 mate scores change sign.** Mate-status flips and the largest drift
    are reported. Measured: 100 %, max 10 cp (`search()`, position-3/b4b2 41 → 51); `chooseMove` 100 %, max 0. No
    looser cap is admissible (25 cp is 2.5× the measured maximum and the band edge).
  - **(b) Mate floor.** On the 287 mate corpus (`src/search.mate-corpus.ts`) at depth 5, `search()`, `SEARCH_DEEP=1`:
    every position the door scores as a mate, the head scores as a mate of the same sign. Distance reported, not
    barred. Measured: 0 violations of 189.
  - **(c) Zugzwang.** `ADR-0050` d9's seven rows (`zugzwang.001`, `.004`, `.005`, `kpk-b6c6`, `kpk-c6d6`,
    `kpk-d6e6`, `kpk-e6f6`), `chooseMove` at their recorded depths (9, 11, 12, 8, 8, 8, 8), each plays its recorded
    move. Measured 7 / 7. Node counts against the door are reported, not barred (probe: `zugzwang.004` 905 900 against
    587 282, 1.54×, still h3h4).
  - **(d) The cut audit, the tactical check.** A QE reading on a scratch copy of the build, with a sampling hook that
    is never in production code (`arch-phase2-p3` `raw/probe/probe3.ts`, audit mode, `D=6 AUD=10`, is the instrument).
    - **The sample, fixed:** `search()` at depth 6 over the 190 plus the 6 endgames (`kq-corner`, `kr-corner`,
      `kqk-h8`, `kp-vs-k`, `krk-a-file`, `pawn-race`), every 10th node where the rule skips a move. Each sampled node
      is searched fresh three times (cleared table, ply 1): the rule on at the node's null window, the rule off at the
      same window, and the rule off at a full window (the reference value v).
    - **Bars: flips ≤ 0.5 % of the sampled nodes, and 0 flips with an error of 200 cp or more.** A flip is a node
      where the rule and the door fall on opposite sides of alpha; its error is how far v lies beyond the bound the
      rule claimed.
    - **Exact reproduction counts (an instrument check, not a bar).** On `src/` `f2388e40` with a build that matches
      `ADR-0061` d1–d2: **30 272 firing nodes, 2 943 sampled** (depth 1: **1 918**, depth 2: **966**, depth 3:
      **59**), **0 flips**, 0 flips of 100 cp or more, door noise 0. On a deterministic build the counts reproduce. A
      different count is explained before the bar is read. The sample is never changed to make a count fit.
    - **What it is:** a guard against piece-sized tactical errors, not a strength predictor. Reverse futility's audit
      was nearly clean (0.08 %, one 201 cp error in 28 486) and it still lost (`ADR-0061` § Context).
- **A4 (it pays; `ADR-0061` d9, pre-registered, not loosened after Ready).**
  - **(a)** At fixed depth 8 on `kiwipete` and `position-6`, in BOTH recursions (`search()` at depth 8, and
    `chooseMove` deepened to 8 on a frozen clock): nodes **≤ 0.88×** the door's on **each** of the four readings.
    Measured: 0.7958 (888 786 / 1 116 785), 0.7876 (1 262 046 / 1 602 457), 0.8295 (1 306 981 / 1 575 537) and
    0.8220 (391 451 / 476 244).
  - **(b)** Mean completed depth at 47 000 nodes on the 190 (`chooseMove`, `maxNodes: 47_000`, frozen clock): **≥ the
    door's + 0.20 ply**. Deeper, shallower and changed-root-move counts are reported. Measured: 5.558 → 5.837
    (+0.279), 54 deeper, 1 shallower, 6 root moves differ.
  - **(c)** `G6` "≥ base" by its rule (floor 6).
  - **Exact reproduction counts (an instrument check, not a bar).** On `src/` `f2388e40`, a faithful build reproduces
    the probe to the node: head **888 786 / 1 262 046** (`search()` d8, kiwipete / position-6) and **1 306 981 /
    391 451** (`chooseMove` to 8); door **1 116 785 / 1 602 457** and **1 575 537 / 476 244**; reach **5.558 /
    5.837**.
    - If `main`'s search has moved by the time of the build (P1 merged, or `ABC-265` merged), the Engineer first
      re-reads the door's counts on the new base. A count that differs is explained in the PR before A4 is read.
    - A re-derived count is a dated line in `ADR-0061` (the Architect's), never a moved bar.
- **A5 (gates).** `G1` ≥ 54 / 58 with no NEWLY-MISSED line (measured 54 / 58, none newly missed or solved); a red is
  classed per row under `ADR-0034`. `G5`, `G8`, `G9`, `G10`, as `ABC-264` A5. `G7` is not owed: the ticket adds a
  four-entry constant and no structure held between nodes (`ADR-0061` § Consequences).
- **A6 (the read; `ADR-0061` d10, `ADR-0056` C2′ / S′, by reference). Waits on the owner's acceptance of `ADR-0061`.**
  - **Intent: GAIN.** One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the
    candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a
    time, `Threads 1` against `Threads 1`, QE with the host ALONE, through `ABC-255`. **MET** on 100 of 100 games
    complete, 0 candidate faults, 0 losses on time at the 50 ms margin, and **≥ 50.0 of 100**. A miss is NOT MET and
    is not re-played. The harness's `state: NEUTRAL` label at ≥ 43.0 does not apply (`QE-264-p2-b`).
  - **Reported:** W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`, and the firing figure at 100 ms (named before
    the read: at depth 6, 30 272 firing nodes and 901 655 skipped moves on the 190; 0.803× the door's nodes).
  - **The Stockfish smoke beside it (S′):** 10 games at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`,
    `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`, `skytalix` `timemargin` 50 ms. MET on 10 of 10
    complete, 0 faults, 0 losses on time, and S-4 at E 1 650: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20.
    Pooled into the S′ pool only if merged (`EPIC-011` § Close-out).
  - **The Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest
    run src/levels.test.ts --reporter=verbose`, QE, host ALONE: exit 0 with every test passed (57 at the last read;
    QE counts its own run).
  - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime`, test flag or environment.
    The rule is keyed on depth, ply, the window, the move and the position only.
- **Falsifiers and their dispositions** (`ADR-0061` § What would falsify this; its table is authoritative):

  | # | fires when | row | disposition |
  |---|---|---|---|
  | F1 | drift red in either recursion | A3 (a) | a defect first (guards and margins against d1); red on an exact match: NOT MET, the ADR re-opens with a new probe; no fallback margin is pre-chosen |
  | F2 | a door mate not a same-sign head mate | A3 (b) | a defect (mate-band and check guards first) |
  | F3 | a zugzwang row not played at its recorded depth | A3 (c) | a defect; never a re-pin to a deeper depth |
  | F4 | audit flips > 0.5 %, or any flip ≥ 200 cp | A3 (d) | NOT MET; the margins are not raised after the read; a new form is a new ticket |
  | F5 | A4 (a) > 0.88× on any reading, (b) < +0.20 ply, or `G6` below base | A4 | not merged; the ADR reads "accepted, not in force" |
  | F6 | A6 < 50.0 of 100, or an S′ collapse | A6 | as F5; the next item is the Orchestrator's (P5 as NEUTRAL with a deep bar, or P1 if re-opened green; P4 waits on O1h) |
  | F7 | a new door not node-equal to the pre-ticket shipped search, or an older door not node-equal to its pre-ticket self | A1 | a defect in the door or the switch wiring |
  | F8 | `G1` below 54 / 58, or a NEWLY-MISSED line | A5 | classed per row under `ADR-0034`; an unexplained loss is a defect |

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): expected to improve (fewer nodes per depth); read by `G6`, floor
  6 unchanged.
- **`NFR-004`:** abort granularity unchanged; no new throw site; the clock check is untouched (`G5`).
- **`NFR-008`** (`npm test` ≤ 10 s): the predicate rows and the source row are default-lane units with no search.
  Drift, mate floor, zugzwang and reach go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1` (reach costs about 18 M nodes,
  about 25 s as measured). The cut audit is a QE scratch reading, not a lane test. `N8-LANE` reported before and after.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): a four-entry constant; nothing grows per search.
- **Security:** none. No new input path. `plans/nfr-catalog.md` is untouched.

## Test notes

1. Reuse sourced fixtures: the 190, the 287 mate corpus, `ADR-0050` d9's zugzwang set, the `ABC-078` `A3` corpus,
   `kiwipete`, `position-6`. No hand-labelled rows.
2. Deterministic mode (`ADR-0027`) holds: the rule is pure and keyed on the position, depth and window; the same input
   and virtual clock give the same move. That is what makes A3 (d)'s and A4's reproduction counts exact.
3. **The PR lists every re-pointed and re-pinned row**, with old and new figures (`ADR-0058` d5's practice;
   `ADR-0061` d6). No zugzwang row's depth is re-pinned.
4. A3 (d) runs only on a scratch copy outside the repository; its hook never enters `src/`. QE reuses
   `arch-phase2-p3`'s `raw/probe/` instrument and states the build sha it sampled.
5. UAT is owed (production lines). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).

## Size and priority

- **Size: S** (`ADR-0056` D2; `ADR-0061` § Context: one node test, one move test, a switch and two doors, plus the
  oracle rows).
- **Priority: P2.** Phase 2, first in the dated order; the only Phase 2 item pullable on today's `main` with a
  measured, clean premise (`RISK-EPIC011-08`).

## Dependencies

- **Owner: acceptance of `ADR-0061`** (*"accept ADR-0061"* / *"decline it"*). It gates A6 and the merge only (reading
  (b)). Default without an answer: no futility pruning on `main`. `EPIC-011` § Owner questions.
- **Base:** `main`; its `src/` is tree `f2388e40` at this cut (read, `git rev-parse`), the probe's tree. **No
  dependency on P1 or P2.**
- **File collision, one at a time:**
  - **P1, parked** (`ADR-0060` re-open): `src/search.ts` and `src/engine.ts`. Whichever merges second re-reads its
    door counts on the new `main` (`ADR-0061` d9); bars stay. If P1 merges first, its door turns futility off
    (scope 4).
  - **`ABC-266`** (TH-2, Development blocked after the D12 MISS) edits `src/engine.ts`; one at a time.
  - **`ABC-265`** (TH-1, merge-ready on the owner's word) edits only `src/transposition.ts`: no file collision. If it
    merges before this build, `main`'s tree moves, and A4's instrument check re-reads the door first. It is node-equal
    at `Threads 1`, so the counts are expected unchanged (`UNKNOWN - verify` until read).
- **After the merge:** P1's re-measure trigger fires (`EPIC-011` § Phases, "P1, parked"; the Architect's dated line in
  `ADR-0060`).
- **Eval-scale coupling:** the margins are in today's centipawns and sit above 325 / 500 in `src/evaluate.ts`. E1 / E2
  re-scale the evaluation, so the margins are re-read then by a dated amendment, with the audit and drift rows re-run
  (`ADR-0061` § Consequences).
- **QE:** A1 out of tree, A3 (d) on a scratch copy, A6 with the host ALONE.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0056` § Inventory and D2 row P3; the premise measured on `main` (`…55f7725e`); the estimate labelled an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–6 = `ADR-0061` d1–d6; the depth-4 row, P1/P4/P5/P6 and any production audit hook out |
| 3 | INVEST | ✅ S; independent of P1, P2 and the thread strand; one mechanism behind a switch and a door pair |
| 4 | testable, measurable acceptance | ✅ A1 node-equal + export counts 3 / 1; A2 boundary rows (alpha = eval + M[d], − 1) and seven guard clauses; A3 25 cp / 0 sign changes, 0 of 189, 7 / 7, audit ≤ 0.5 % and 0 ≥ 200 cp with exact counts (2 943; 1 918 / 966 / 59); A4 ≤ 0.88× × 4, ≥ +0.20 ply, `G6`, exact counts; A5 ≥ 54 / 58; A6 ≥ 50.0 of 100, S′, Levels |
| 5 | dependencies known | ✅ `ADR-0061` (written, PROPOSED; acceptance gates A6 and the merge); the P1 and `ABC-266` file collisions; `ABC-265`'s tree move |
| 6 | NFR triggers with targets | ✅ `NFR-005` `G6` floor 6; `NFR-004` no new throw site; `NFR-008` ≤ 10 s, deep rows behind flags (~25 s reach); `NFR-009` a four-entry constant |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the ADR is written, PROPOSED. Reading (b): the build may start; the read (A6) and the merge wait on the owner's acceptance of `ADR-0061` |

**DoR 10/10 on reading (b). Backlog, Ready recommended** (the board move is the Orchestrator's). The build may start
from `main`. A6 and the merge wait on *"accept ADR-0061"*; with no answer, nothing merges.
