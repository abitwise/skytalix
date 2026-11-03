---
kind: adr
id: ADR-0069
---
# ADR-0069: Quiescence skips a losing capture out of check. A capture is losing when its static exchange is below 0; the main search is unchanged; it sits behind a test-only off-door pair, and it amends `ADR-0024` d4

## Status

**ACCEPTED 2026-11-03 by the owner. THE BUILD MAY START. Not in force until the Q1 ticket merges on its own read.**
Recorded by Architect/Design (task `arch-owner-answers-1103b`, records only, on `grugops/arch-owner-answers-1103b` from
`main` `0bf243df`). Nothing was run.
- **His words, verbatim** (`orch-2026-10-30a` `…401c3d09`): *"yes, accept ADR-0068 and ADR-0069"*.
- **What it settles:** form QS. Out of check, quiescence skips a capture that is losing by decision 2 (`see < 0`). The
  main search is unchanged. The switch `seePruning` sits behind a test-only off-door pair.
- **`ADR-0024` d4 is amended** (decision 9): SEE pruning enters quiescence. Delta pruning and quiet checks stay fenced.
  The dated pointer is now written in `ADR-0024` § Status and at its d4, as `ADR-0053` left one.
- **It ships only on its own per-change read** (decision 13): 100 games at 100 ms against the merge-base, GAIN
  ≥ 50.0 / 100, with S′ at E 1 810 and the Levels deep lane beside it. The bars of decisions 11 and 12 come first. A miss
  is NOT MET and is not re-played.
- **The slot** (`…401c3d09`): Q1's build runs beside `ABC-239`'s tool build. Q1 merges, or misses, before `ABC-239`'s
  candidate is frozen for B-T7 / B-T8 (§ Consequences; decision `…5e73b0d4` § 3).
- **Lines written with the acceptance:** `ADR-0024` (the pointer and d4), `ADR-0065` (re-open 1 and § Consequences),
  `ADR-0056` (row Q1, D2's dated line). Still owed: `EPIC-011`, the Q1 ticket cut and the `ABC-239` / `ABC-270` lines
  (BA/PM, decision `…5e73b0d4` § 5).

*Before acceptance:* **PROPOSED 2026-11-03. PREMISE MET ON `main`; THE BUILD MAY START ONCE THE OWNER ACCEPTS.** Recorded by
Architect/Design (task `arch-Q1-see-pruning`, records only, on `grugops/arch-Q1-see-pruning` from `main` `dc7dc15d`).
The probe ran on a scratch copy of `main`'s `src/`, outside the repository, under the host lock, one job at a time. The
scratch tree was `4cb84035`: E1 taper plus the `ABC-274` packed blend, with futility in force. Nothing was committed to
`src/`. The patch, the driver and every output are under `.grugops/context/arch-Q1-see-pruning/raw/probe/`.

- **Who accepts.** The owner. This is a new ADR, and it amends `ADR-0024`, which he accepted
  (`memory-bank/45-standing-rulings.md`, 2026-10-22). His `Q-3K-9` YES (`orch-2026-10-30a` `…af126c04` item 6) opened
  `ADR-0024` d4 **for design**. The build stands on its own evidence, as he said.
- **The id.** `ADR-0068` belongs to `arch-ABC-270`, written in parallel. This ADR takes `ADR-0069`.
- **The method.** The instrument, three forms, two gates, the choice rule, the bar rules and the verdict rule were
  sealed and committed before any measured run (decision `…1f71e417`, commit `a9af0ec8`).
- **The verdict, by that rule:** every form passes both gates. **QS is chosen.**
  - QS is the quiescence rule alone: out of check, skip a capture with `see < 0`.
  - QSM (QS plus a main-search rule) reaches +0.879 ply against QS's +0.837. That is within the 0.05 ply the choice
    rule gives the simpler form, so QS wins.
  - QSc (QS that never skips a checking capture) reaches +0.495 ply and is not within 0.05.
- **QS, measured:**
  - d8 nodes **0.7208 / 0.2652** in `search()` and **0.5909 / 0.2160** in `chooseMove` (kiwipete / position-6). The
    gate was ≤ 0.95× on each of the four.
  - Reach at 47 000 nodes: **5.879 → 6.716 (+0.837 ply)**, with 121 rows deeper and 1 shallower.
  - Safety: drift 96.26 % / 95.72 % within 25 cp, max 66 / 96 cp, 0 sign changes. Mate floor 0 of 190 at the same
    depth. Zugzwang 7 / 7. `G1` 54 / 58, none newly missed.
- **This is the largest lever any `EPIC-011` probe has read.** P1 read +0.38, O1h +0.09, O3s +0.07, and E1 +0.042.
  It reproduces the `arch-ABC-234` diagnostic (+0.884 on the older `main`) under a pre-registered rule.
- **What it amends:**
  - **`ADR-0024` d4:** "SEE" leaves its out-of-scope list for quiescence **pruning**, as decision 9 states. Delta
    pruning and quiet checks stay out.
  - No other ADR. The lines owed to `ADR-0056` (row Q1), `ADR-0024` (a pointer), `ADR-0065` (re-open 1),
    `EPIC-011` and a new ticket are listed in this task's decisions note. They are not edited here.
- **Intent: GAIN.** The pay is read at the 100 ms node budget, so Q1 fires at 100 ms.

## Context

`ADR-0056` D2 row Q1 reads: "SEE pruning of losing captures (quiescence and main), +20–50, S–M carrying `see`
(`ADR-0065` decision 2), medium risk, `ADR-0024` d4". The `arch-ABC-234` diagnostic (`ADR-0065` § Diagnostics) read
+0.88 ply of reach without a PREREG, so it needed its own probe and ADR.

**Quiescence today** (`src/quiescence.ts`):
- Out of check, the node stands pat and searches every legal capture plus the quiet queen promotions.
- The moves are sorted by MVV-LVA (`ADR-0024` d2), and the cap is 8 plies (d5).
- In check, it searches every evasion (`ADR-0053`).
- Its header lists "static exchange evaluation" under "Not here", which is `ADR-0024` d4's fence.
- So Q×P onto a pawn-defended square is searched to its full capture subtree before the stand pat can hold.

**The premise on `main`, read first** (`fire`, `search()` at depth 6 over the 190, door):

| reading | `main` |
|---|---|
| quiescence moves that are LOSING captures (`see < 0`, with decision 2's exemptions) | 3 752 813 of 12 068 862 (**31.1 %**) |
| … refuted (score ≤ alpha before it) | **97.27 %** |
| quiescence nodes under them (nested subtrees counted at each level, so overstated) | 81.4 % |
| QS head: total nodes, all 190 rows | 6 437 380 against 14 372 440 (**0.448×**); 2 077 972 captures skipped |

### The instrument

- **The base:** `main`'s `src/` at `dc7dc15d`, patched by `patch_q1.py`, with scratch knobs in `quiescence.ts`:
  - `see()` and `isLosingCapture()` are `arch-ABC-234`'s code, unchanged.
  - The quiescence rule sits in `quiesce`'s loop.
  - The main-search rule sits after the futility skip in both `negamax` bodies.
  - The patch adds counters and audit marks.
  - With every knob off it is `main`, node for node.
- **The instrument check is exact.** The door reads `search()` d8 839 514 / 1 533 901, `chooseMove` d8 1 296 788 /
  404 930 and reach 5.879 at 47 000. Those are `ABC-269` B0's counts and `ADR-0064` form L's reach. Door zugzwang is
  7 / 7, and door `G1` is 54 / 58.
- **SEE check:** `see < 0` and LOSING on all 24 `HANGING_CORPUS` losing moves. The six hand rows are exact, with
  `ADR-0065`'s corrected R×R row at 0.
- **The runs:** three batches, each `flock <host-test.lock> timeout 1800`, every job under `timeout 600`, one job at a
  time. 42 jobs, every exit 0, about 7 minutes of host time. Each run used a fixed depth, or `chooseMove` with
  `maxDepth` / `maxNodes` on a frozen clock; `G1` used its virtual clock. No timing was read.
- **A wording correction to the PREREG:** it says "the 190 (+ 6 endgames)". The corpus function returns **190 rows
  in all**, the six endgames included, as in `arch-ABC-234` and `ADR-0064`. The instrument is the same one, and the
  door's 5.879 confirms it.
- **The forms** (a capture is LOSING when it does not promote, its mover is not the king, its victim is worth less
  than its attacker, and `see < −margin`):
  - **QS:** out of check, quiescence skips a LOSING capture (margin 0). In check, every evasion is searched.
  - **QSc:** as QS, but a capture that gives check is never skipped.
  - **QSM:** QS, plus the main search skips a LOSING capture with `see < −100 × depth` that gives no check. It applies
    at index ≥ 1, at null-window non-root nodes of depth 1–3 out of check, mate band excluded (futility's node
    guards without the evaluation clause).

### What the probe measured

d8 ratios are head / door. Reach is the mean completed depth at 47 000 nodes on the 190. Drift is at depth 5 on the
190, against the door (share within 25 cp; max). Mate is door d5 → head d5 (violations of 190 mates).

| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | reach | drift `search()` / `chooseMove` | mate | zugzwang | `G1` |
|---|---|---|---|---|---|---|---|
| **QS (chosen)** | 0.7208 / 0.2652 | 0.5909 / 0.2160 | **+0.837** (121 deeper, 1 shallower; 22 moves differ) | 96.26 %, 66 / 95.72 %, 96 | 0 | 7 / 7 | 54 / 58 |
| QSc | 0.8496 / 0.3909 | 0.6953 / 0.3541 | +0.495 (86, 1; 17) | 96.26 %, 66 / 95.72 %, 96 | 0 | 7 / 7 | 54 / 58 |
| QSM | 0.6748 / 0.2421 | 0.5496 / 0.2040 | +0.879 (127, 1; 22) | 96.26 %, 66 / 95.72 %, 96 | 0 | 7 / 7 | 54 / 58 |

- **Every form passes both gates.** The pay gate was ≤ 0.95× on all four d8 readings plus ≥ +0.10 ply of reach. The
  safety gate was drift ≥ 90 % within 25 cp, max ≤ 150 cp and 0 sign changes; mate 0; zugzwang 7 / 7; `G1` ≥ 54 / 58
  with no NEWLY-MISSED line.
- **Kiwipete's root move at d8 changes** from e2a6 (−81) to d5e6 (−89), in both recursions and in every form, as in
  the diagnostic. Position-6's move is unchanged (c3d5).
- **Drift's largest items** (QS, `chooseMove`): kiwipete/f3f4 555 → 459, kiwipete/a1d1 298 → 232, and six more
  between 28 and 52 cp. All are positions with heavy pieces hanging, where a static exchange is the coarsest guess.
- **Reports:**
  - d7: `search()` 0.7230 / 0.2943 and `chooseMove` 0.5141 / 0.1828.
  - d8 on other roots, `search()` / `chooseMove`: position-4 0.590 / 0.552, position-5 0.447 / 0.678, startpos
    0.769 / 0.827. Startpos's d8 `search()` move changes from d2d4 to b1c3, the move `chooseMove` already plays.
  - Reach at 20 000: 4.842 → 5.689 (+0.847).
  - Mate d4 → d5: 0 of 163.
- **The quiescence audit** (information, not a bar). Every 50th quiescence node where QS skipped a capture, at
  `search()` depth 6 over the 190, was re-searched fresh three times: head at the node's window, door at that window,
  and door at the full window, which is the reference. A flip is a node where head and door fall in different classes
  (≤ alpha, inside, ≥ beta), or differ inside the window.
  - QS: 930 of 19 402 (4.79 %); errors ≥ 100 cp: 9; **≥ 200 cp: 0**; the largest is 185 cp.
  - QSc: 3.40 %, with one ≥ 200 cp (213). QSM: 4.89 %, with 0 ≥ 200 cp.
  - `ADR-0061`'s bars (≤ 0.5 % flips, 0 ≥ 200 cp) were set for main-search cut verdicts on null windows. This flip
    counts any inside-window difference as well, so the rates are not comparable. **The error clause is: QS makes no
    window-relevant error of 200 cp or more in the sample.**
- **The main-rule audit** (QSM, every 10th firing node, `ADR-0061`'s shape) shows 90 flips of 5 244 (1.72 %), with
  one ≥ 200 cp and one ≥ 300 cp (325 cp at depth 1). That is above `ADR-0061`'s bars, and it is a second reason the
  main-search rule is not taken (Alternatives).

### Why the pay is large here when SEE ordering paid nothing

- `ADR-0065` moved losing captures later in the full-width search. In `chooseMove` the hash move already sits first at
  most cut nodes, so little was left to win.
- Quiescence has **no table and no hash move**. Each losing capture there is searched to its full capture subtree,
  and 97 % of them are refuted. Skipping them removes most of the quiescence tree (0.45× of all nodes at depth 6).
- At the 100 ms node budget that is about 0.84 ply of extra depth on the 190.

## Decision

1. **The rule.** In `quiesce`, at a node **out of check** (one that stood pat), each capture is tested before it is
   made. A **losing** capture is skipped: not made, not searched, not counted.
   - **In check, nothing is skipped.** Every evasion is searched, as `ADR-0053` requires.
   - **The order does not change.** `orderCaptures` still sorts the whole list by MVV-LVA (`ADR-0024` d2), and the
     test runs in the loop. Filtering before the sort gives the same nodes; the loop test is the design of record.
   - Fail-soft holds: the stand pat is the floor of `best`, so a node whose every capture is skipped returns its stand
     pat, exactly as a node with no captures does.
   - The cap of 8 (`ADR-0024` d5) is unchanged. It binds less often, because fewer losing lines reach it.
2. **The losing test.** A capture is **losing** when **every** clause holds:
   - it does not promote;
   - the mover is not the king;
   - the victim is worth less than the attacker by `ORDER_VALUE` (100 / 320 / 330 / 500 / 900);
   - and **`see(position, move) < 0`**.

   So en passant (P×P), any capture of an equal or bigger piece, and every capturing promotion are never losing, and
   SEE is computed only when the victim is worth less. B×N onto a pawn-defended square (−10) **is** losing at this
   threshold, and it is skipped in quiescence only.
3. **A capture that gives check is skipped like any other.** QSc measured the exemption: it costs 0.34 of the 0.84
   ply, and every safety reading is the same (mate 0, zugzwang 7 / 7, `G1` 54 / 58). Quiescence searches no quiet
   checks today, and a node in check still searches every evasion.
4. **The evaluator: a new pure module, `src/see.ts`.**
   - It exports `see(position, move): number` (cp for the mover), `isLosingCapture(position, move): boolean`
     (decision 2, threshold 0, fixed: one caller, no margin parameter, coding rule 7) and `seeScratchByteLength()`.
   - The algorithm is `ADR-0065` decision 2's: a swap list on the target square, the least valuable attacker each
     step, x-rays through squares already captured from, pins ignored, the king last at 20 000.
   - **No per-call allocation** (the `ABC-240` rule). The removal mask is a fixed `Uint8Array(128)`, the gain list a
     fixed `Int32Array(32)`, and the squares to restore a fixed `Uint8Array(32)`. The king's offsets are one constant
     array. The probe's `used: number[]` and its array spread are scratch-only, and the build must not copy them.
     128 + 128 + 32 = 288 bytes in all, summed for `NFR-009` (a).
   - Pure: it reads the board and leaves it byte-identical.
   - **Relation to `ADR-0065` d2:** that ADR is PROPOSED and parked, with its threshold at −50 for ordering. This ADR
     builds the module with Q1's threshold. If O3s is ever re-opened, its ticket adds its own test beside this one.
5. **The main search is unchanged.** No SEE is computed in `negamax` and no capture is skipped there (Alternatives:
   QSM).
6. **The switch reaches quiescence through its rules record** (`ADR-0053` decision 6's pattern):
   - `QuiescenceRules` gains `seePruning?: boolean`. Absent or false means off, so every record that predates the
     switch is unchanged.
   - Each recursion gains a constant record, `RULES_SEE_PRUNING = { evasions: true, quietPromotions: true, taper: true,
     seePruning: true }`, and passes it when its switch is on.
   - **A caller that builds its own record does not opt in.** `ABC-239`'s position filter calls `quiesce` with its own
     literal (`arch-ABC-239` `extract.ts`), so its "quiescence equals static" filter does not move when Q1 merges.
7. **One switch, `seePruning`, in BOTH recursions** (`src/search.ts` `Switches`, `src/engine.ts` `Heuristics`). It is
   on in `search()` and `chooseMove` only. It is never module state, an `EngineOptions` field or a parameter of
   `search()` (`ADR-0026` d2).
8. **Two TEST-ONLY doors: `searchWithoutSeePruning(position, depth)` and `chooseMoveWithoutSeePruning(position,
   options)`.**
   - Each is the shipped path with `seePruning` off and everything else on. Node for node, they are the pre-ticket
     `search()` and `chooseMove`. The engine door takes no depth (`ABC-078` `A4`).
   - **Every older door turns `seePruning` off** (`ADR-0026` d3's ladder). This switch is the top rung.
   - Rows re-point by `ADR-0050` d4, `ADR-0058` d5, `ADR-0059` d6 and `ADR-0061` d6, by reference. Value and
     behaviour rows stay on the shipped path (zugzwang, mates, `G1`). **No zugzwang row's depth is re-pinned.**
   - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by one, its door. `ABC-078` `A4` (`src/engine.ts`)
     grows by one, its door. `src/see.ts` is a new module with three exports, pinned by its own row. Whether `A6`
     counts a re-export is `UNKNOWN - verify`; the build re-exports nothing.
9. **`ADR-0024` d4 is amended.** "Static exchange evaluation" leaves the out-of-scope list for quiescence pruning, by
   decisions 1–3 of this ADR. Delta pruning (Q2) and quiet checks stay out. `src/quiescence.ts`'s header line "Not
   here … static exchange evaluation" is corrected in the build. A dated pointer in `ADR-0024` § Status is owed, as
   `ADR-0053` left one.
   - *Dated 2026-11-03 (`arch-owner-answers-1103b`):* written, on the owner's acceptance (`…401c3d09`): a pointer
     block in `ADR-0024` § Status and a dated line at its d4.
10. **The rows it adds.**
    - **`A1`, SEE:** at least 20 hand-checked exchange positions committed as a fixture, x-rays on both sides
      included, with `see` equal to the hand value on every row. The six rows here and the 24 `HANGING_CORPUS` losing
      moves are a start.
    - **The losing test, called directly:** false for a capturing promotion, a king capture, en passant, and a capture
      of an equal or bigger piece, each on a board where SEE alone would call it losing. True for Q×P defended by a
      pawn (−800) and B×N defended by a pawn (−10). False for N×N defended (0).
    - **A source row:** `quiesce` with `seePruning` on skips exactly the moves `isLosingCapture` names, only on the
      stand-pat branch, and still sorts the whole list.
    - **An in-check row:** a quiescence node in check with a losing capture among its evasions searches it.
11. **The bounded oracle, derived by the PREREG's rules for QS:**
    - Drift at depth 5 on the 190 in both recursions, against the doors: **≥ 93 % within 25 cp**
      (max(90, ⌊95.72⌋ − 2)), **none beyond 144 cp** (min(150, ⌊1.5 × 96⌋)), and 0 mate sign changes.
    - Mate floor at the **same depth**, door d5 → head d5 on the 287: **0** (of 190 mates).
    - Zugzwang **7 / 7**. `G1` **≥ 54 / 58**, with no NEWLY-MISSED line.
    - The quiescence audit is information. Its sample is fixed as in § Context, so the counts reproduce on a
      deterministic build.
12. **The premise bars (`A3` / `A4`):**
    - **(a)** d8 nodes on kiwipete and position-6, both recursions: **≤ 0.78×** on each of the four readings
      (min(0.95, ⌈100 · (0.7208 + 0.05)⌉ / 100)).
    - **(b)** reach at 47 000 on the 190: **≥ door + 0.55 ply** (max(0.10, ⌊20 · 0.7 · 0.837⌋ / 20)), so ≥ 6.429
      against 5.879.
    - **(c) `G6` / `NFR-005`**, by its rule at each build's `LEVELS[5]` (4 000 ms): 5 runs per board, any run below
      depth 6 FAILs, depth 7 is a WARN, and "≥ base" is graded by the median. This is a search ticket, and `Q-3K-4`
      (b) covers evaluation tickets only.
    - **(d) `G2`:** `src/evaluate.ts` and `src/evaluate-params.ts` stay byte-identical to base, so `G2` is not re-read.
      If either is touched, `G2` is read by its rule.
    - **The instrument check, not a bar.** On `main` `dc7dc15d` a faithful build reads `search()` d8 605 117 /
      406 787, `chooseMove` d8 766 275 / 87 475 and reach 6.716. Its doors read 839 514 / 1 533 901 / 1 296 788 /
      404 930 and 5.879. If `main` has moved by the build, the Engineer re-reads both on the new base and puts both
      sets in the PR. The bars stay; a re-derived count is a dated line here, never a moved bar.
13. **The read, by reference (`ADR-0056` C2′ as folded):** 100 games at 100 ms against the merge-base. The intent is
    **GAIN, ≥ 50.0 / 100**. Also S′ at E 1 810 and the Levels deep lane. NEUTRAL "invisible at 100 ms" is closed:
    the reach gain is read at the 100 ms node budget. R-TC: the rule reads no budget, deadline or environment.

## What would falsify this

| # | clause | what would falsify it | how to check | if it fires |
|---|---|---|---|---|
| **F1** | 11, drift | a non-mate score beyond 144 cp, < 93 % within 25 cp, or a mate sign change, in either recursion | decision 11 | a defect first (the exemptions, the in-check guard, SEE's sign). On an exact build: NOT MET |
| **F2** | 11, mates | a door mate at d5 on the 287 that the head does not score as a same-sign mate at d5 | decision 11 | a defect |
| **F3** | 11, zugzwang | any of `ADR-0050` d9's seven rows not played at its recorded depth | decision 11 | a defect. Never a re-pin |
| **F4** | 12 (a)/(b), it pays | a d8 reading above 0.78×, or reach below door + 0.55 | decision 12 | a defect first (the switch left unwired reads 1.00× and +0). On an exact build: NOT MET |
| **F5** | 13, strength | C2′ < 50.0 / 100, or an S′ collapse | decision 13 | not merged; this ADR reads "accepted, not in force" |
| **F6** | 4, the evaluator | `see` differs from a hand value on an `A1` row | `A1` | a defect in `see` |
| **F7** | 7, 8, the doors | a new door not node-equal to the pre-ticket search, or an older door not node-equal to itself, on the `ABC-078` `A3` corpus | `G4` | a defect in the switch wiring |
| **F8** | regression | `G1` below 54 / 58, or a NEWLY-MISSED line | decision 11 | classed per row under `ADR-0034` |
| **F9** | 12 (c), cost | `G6` below base by the median, or any run below depth 6 | decision 12 | SEE's per-node cost outweighs the nodes it saves on the real clock. NOT MET; no tuning after the read |

## Alternatives

- **QSM, QS plus a main-search rule** (depth 1–3, `see < −100 × depth`). Measured: +0.042 ply over QS, d8 about
  0.93× of QS's nodes, and the same safety readings. Its main-rule audit shows 1.72 % flips with a 325 cp error.
  Rejected by the pre-registered choice rule (within 0.05 ply), and for its audit. It stays a named follow-up: a new
  ticket and a new PREREG over QS, if a later probe says the main search has more to give.
- **QSc, never skip a capture that gives check.** Measured: +0.495 ply against +0.837, with the same safety readings
  and one 213 cp audit error. Rejected: it gives back 40 % of the reach and buys no measured safety.
- **A margin (`see < −50`), as in `ADR-0065` d2.** Not measured here, and not pre-registered. In quiescence, skipping
  a near-even trade (B×N, −10) costs little: the stand pat still holds, and the line is searched in the full-width
  tree above. The measured form is margin 0, and a margin is not added after the read.
- **SEE ordering in quiescence, in place of MVV-LVA.** Rejected: pruning is the lever, and once losing captures are
  skipped, the survivors are the ones MVV-LVA already orders well. It would cost a SEE call per capture.
- **Delta pruning together with this (Q2).** Rejected for this ticket: coding rule 5, and `ADR-0024` d4 keeps it
  fenced. It is its own row.
- **Build O3s with this, as `ADR-0065` re-open 1 names.** Not taken. The one diagnostic reading of S1m over the old Q1
  missed in `chooseMove` (0.961 / 1.095). Once Q1 merges, an O3s re-open is a new PREREG over it.

## Consequences

- **NFRs:**
  - `NFR-005`: `G6` reads it (decision 12 (c)). SEE costs a swap-list walk for each capture whose victim is worth less
    than its attacker, at quiescence nodes out of check. It is not timed here (`UNKNOWN - verify`); F9 is the read.
  - `NFR-009`: 288 bytes fixed, summed by `seeScratchByteLength()`.
  - `NFR-008`: `A1`, the losing-test rows, the source row and the in-check row are default-lane units with no
    search. Drift, mate, zugzwang and reach go behind the deep lanes.
  - No new NFR file. `plans/nfr-catalog.md` is untouched.
- **Determinism (`ADR-0027`):** `see` is a pure function of the board. The same input and virtual clock give the same
  move.
- **The transposition table:** unchanged. Quiescence stores nothing in it. The table is cleared at each search's start
  (`search.ts` `searchRoot`, `engine.ts` `chooseMove`), so no entry mixes switch states. The values stored by the
  full-width nodes above change, as with any value change.
- **Ordering:** unchanged in both trees. MVV-LVA, killers and the hash move are untouched.
- **`ABC-239` (E2, the tuner):** its filter is protected by decision 6. Its C2′ read is against its merge-base, so
  whichever of the two merges second re-reads over the first (`ADR-0056`'s one-at-a-time rule).
- **`ABC-270` (E3a, `ADR-0068`):** it touches the evaluation only. If Q1 merges first, its build re-reads its
  instrument counts on the new `main`, which is the standing rule.
- **Migration:** none.

## Rollback

- **Now:** nothing is built. To withdraw, mark this ADR `withdrawn`, and `ADR-0024` d4 stays as written.
- **After it ships:** set `seePruning` to false in `search()` and `chooseMove`, two booleans. Removing the module, the
  switch, the doors, the rules field and the re-points is then a mechanical revert of one ticket.
