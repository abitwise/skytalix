---
id: ABC-279
title: "Q1: quiescence skips SEE-losing captures out of check, behind an off-door pair. A capture that does not promote, is not made by the king, takes a lesser piece and has a static exchange below 0 is not searched at a quiescence node that stood pat; in check every evasion is searched; the main search is unchanged; a new pure src/see.ts; one switch, seePruning, in both recursions; two test-only doors (ADR-0069)"
status: done
column: Done
closed: "2026-11-04, merged to local main at 7b70e268; QE PASS_WITH_GAPS (qe-ABC-279 …6e99201a), which signs UAT; C2′ 54.0 / 100 (+27.9 ± 60.0), S′ 5.5 / 10 against E 1 810, Levels 57 / 57; QE-279-a..e LOW accepted (the Orchestrator's board card). ADR-0069 in force from the merge. Front matter only, by bapm-W1-bundle-cut"
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0069: ACCEPTED 2026-11-03 by the owner (\"yes, accept ADR-0068 and ADR-0069\", orch-2026-10-30a …401c3d09); in force only if this ticket merges on its own read (F5: 'accepted, not in force' on a miss). Was PROPOSED, premise MET on main (arch-Q1-see-pruning …5e73b0d4; PREREG …1f71e417 at a9af0ec8; merged c024af2f). Amends ADR-0024 d4: SEE pruning enters quiescence; delta pruning and quiet checks stay fenced (the Architect's dated pointer, arch-owner-answers-1103b). Its see is ADR-0065 d2's algorithm with threshold 0. Follows ADR-0026 d10's door pattern and ADR-0053 d6's rules-record pattern"
---

# ABC-279: quiescence skips the losing captures (Q1)

> **Cut 2026-11-03 by BA/PM: DoR 10/10, Ready** (task `bapm-owner-answers-1103b`, records only, at `main`
> `0bf243df`, `src/` tree `4cb84035`; nothing run, built or timed). Sources: the owner's *"yes, accept ADR-0068 and
> ADR-0069"* (`orch-2026-10-30a` `…401c3d09`), `ADR-0069` and the Architect's ticket outline (`arch-Q1-see-pruning`
> `…5e73b0d4` § 5). **Every bar is `ADR-0069`'s, cited by decision.** They were pre-registered there and are not
> loosened after Ready.
> - **`EPIC-011` Phase 3, row Q1** (it was a stub). The main-search half of the stub (QSM) was measured and not
>   taken. It stays a named follow-up with its own PREREG.
> - **Intent: GAIN (≥ 50.0 of 100)** (`ADR-0069` § Status, d13). The pay is read at the 100 ms node budget. This was
>   named before any read and is never re-classed after a score is seen.
> - **The slot** (the owner's order, `…401c3d09`; `ADR-0069` design note § 3): this ticket **merges, or misses,
>   before `ABC-239`'s candidate is frozen for B-T7 / B-T8**, never between that freeze and `ABC-239`'s merge.
> - **The board move to Ready for Dev is the Orchestrator's.**

## Problem

- **User:** the owner at level 5, and every later read of this epic, since each is taken at the 100 ms node budget.
- **Pain, measured on `main`** (`ADR-0069` § Context, `search()` at depth 6 over the 190, door):
  - Quiescence searches every capture to its full capture subtree before the stand pat can hold. It has no table and
    no hash move.
  - **31.1 %** of quiescence moves (3 752 813 of 12 068 862) are losing captures, and **97.27 %** of those are
    refuted.
  - The probe's QS head searched **0.448 ×** all nodes on the 190 (6 437 380 against 14 372 440).
- **Value:** reach at 47 000 nodes, **5.879 → 6.716 (+0.837 ply)**, with 121 rows deeper and 1 shallower, at the 100 ms
  node budget. This is **the largest lever any `EPIC-011` probe has read** (P1 +0.38, O1h +0.09, O3s +0.07, E1
  +0.042). `ADR-0056` D2 row Q1 estimates +20–50 Elo. **That is an estimate, not a reading.** C2′ resolves about
  ± 56 Elo, so GAIN means a point estimate ≥ 0.

## Scope

`ADR-0069` governs each line (decisions 1–9).

1. **The rule** (d1–d3). In `quiesce`, at a node **out of check** (one that stood pat), each capture is tested before
   it is made. A **losing** capture is skipped: it is not made, not searched and not counted.
   - **Losing** means every clause holds: it does not promote; the mover is not the king; the victim is worth less
     than the attacker by `ORDER_VALUE` (100 / 320 / 330 / 500 / 900); and `see(position, move) < 0`.
   - **In check, nothing is skipped** (`ADR-0053`).
   - A capture that gives check is skipped like any other.
   - The order is unchanged (MVV-LVA, the whole list sorted, `ADR-0024` d2), and the test runs in the loop. The cap of
     8 is unchanged (`ADR-0024` d5). Fail-soft holds.
2. **The evaluator** (d4): a new pure module, **`src/see.ts`**. It exports `see(position, move)`,
   `isLosingCapture(position, move)` (threshold 0, fixed) and `seeScratchByteLength()`.
   - The algorithm is `ADR-0065` d2's.
   - **No per-call allocation:** fixed `Uint8Array(128)`, `Int32Array(32)` and `Uint8Array(32)`, **288 bytes** in
     all. The probe's `used: number[]` and its array spread must not be copied.
   - It leaves the board byte-identical.
3. **The switch** (d6, d7): one switch, `seePruning`, in BOTH recursions (`src/search.ts` `Switches`, `src/engine.ts`
   `Heuristics`). It is on in `search()` and `chooseMove` only.
   - It reaches quiescence through `QuiescenceRules.seePruning?: boolean`. Absent or false means off.
   - A new constant record, `RULES_SEE_PRUNING`, is passed when the switch is on.
   - **A caller that builds its own rules record does not opt in.** So `ABC-239`'s position filter does not move.
   - It is never module state, an `EngineOptions` field or a parameter of `search()` (`ADR-0026` d2).
4. **Two TEST-ONLY doors** (d8): `searchWithoutSeePruning(position, depth)` and
   `chooseMoveWithoutSeePruning(position, options)`. Each is the shipped path with `seePruning` off. **Every older
   door turns `seePruning` off** (the top rung of `ADR-0026` d3's ladder). Rows re-point by reference (`ADR-0050` d4,
   `ADR-0058` d5, `ADR-0059` d6, `ADR-0061` d6). **No zugzwang row's depth is re-pinned.**
5. **The header line** (d9): `src/quiescence.ts`'s "Not here … static exchange evaluation" is corrected. Delta
   pruning and quiet checks stay listed there.

## Out of scope

- **The main-search rule (QSM)**: +0.042 ply over QS, with a 325 cp main-rule audit error (`ADR-0069` § Alternatives).
  It stays a named follow-up with its own ticket and PREREG.
- **The check exemption (QSc)**, **a margin** (`see < −50`), and **SEE ordering** in quiescence.
- **Delta pruning (Q2)** and **quiet checks** in quiescence. They stay fenced by `ADR-0024` d4.
- **O3s (`ABC-234`)**, which stays parked. Its re-open is a new PREREG over this ticket once it has merged.
- Any edit to `src/evaluate.ts` or `src/evaluate-params.ts`, to the transposition table, or to move ordering.
- `ABC-239`'s filter opting in: that is a decision for its own page, never an accident of merge order.

## Acceptance criteria

The bars are `ADR-0069`'s (d10–d13), pre-registered there and not loosened after Ready.

- **A1 (the evaluator and the rule, default-lane units, no search; d10).**
  - **(a) SEE fixture:** **given** at least **20** hand-checked exchange positions, committed as a fixture, with
    x-rays on both sides, **then** `see` equals the hand value on **every** row. The ADR's six hand rows, and the 24
    `HANGING_CORPUS` losing moves (each `see < 0` and LOSING), are a start.
  - **(b) The losing test, called directly.** It is **false** for each of these, on a board where SEE alone would call
    the capture losing: a capturing promotion, a king capture, en passant, and a capture of an equal or bigger piece.
    It is **true** for Q×P defended by a pawn (−800) and for B×N defended by a pawn (−10). It is **false** for N×N
    defended (0).
  - **(c) A source row:** `quiesce` with `seePruning` on skips exactly the moves `isLosingCapture` names, only on the
    stand-pat branch, and still sorts the whole list.
  - **(d) An in-check row:** a quiescence node in check with a losing capture among its evasions searches it.
  - **(e) Purity and memory:** the board is byte-identical after `see`, and `seeScratchByteLength()` returns **288**.
- **A2 (the doors, `G4`; d7, d8).** Node-equal across builds, on the `ABC-078` `A3` corpus. QE runs it out of tree,
  base tree against head tree.
  - **Given** the base tree's shipped `search()` and `chooseMove`, **when** the head's `searchWithoutSeePruning` and
    `chooseMoveWithoutSeePruning` run the same corpus, **then** move, score and nodes are equal on every row.
  - Every older door equals its base self on every row.
  - **Export lists:** `ABC-077` `A6` (`src/search.ts`) grows by **exactly one**, its door. `ABC-078` `A4`
    (`src/engine.ts`) grows by **exactly one**, its door. `src/see.ts` has **exactly three** exports, pinned by its
    own row. Whether `A6` counts a re-export is `UNKNOWN - verify`; the build re-exports nothing.
- **A3 (value safety, the bounded oracle; d11; `SEARCH_DEEP=1` / `ENGINE_DEEP=1`).**
  - **(a) Drift:** at depth 5 on `ABC-121`'s 190, in BOTH recursions, against the doors: **≥ 93 %** of non-mate
    scores within 25 cp, **none beyond 144 cp**, and **0** mate sign changes. (Probe: 96.26 % / 95.72 %, max 66 / 96.)
  - **(b) Mate floor, the same depth:** door d5 → head d5 on the 287 mate corpus: **0** violations (of 190 mates).
  - **(c) Zugzwang:** `ADR-0050` d9's seven rows at their recorded depths: **7 / 7**. Never re-pinned deeper.
  - The quiescence audit is information, not a bar. Its sample is fixed as in `ADR-0069` § Context, so its counts
    reproduce on a deterministic build.
- **A4 (it pays, and it costs nothing it should not; d12).**
  - **(a)** d8 nodes on kiwipete and position-6, both recursions (`search()` at depth 8; `chooseMove` deepened to 8 on
    a frozen clock): **≤ 0.78 ×** the door's on **each** of the four readings.
  - **(b)** mean completed depth at 47 000 nodes on the 190 (`chooseMove`, frozen clock): **≥ door + 0.55 ply**
    (≥ 6.429 against 5.879). Deeper, shallower and changed-root-move counts are reported.
  - **(c) `G6` / `NFR-005`**, by its rule at the build's `LEVELS[5]` (4 000 ms): 5 runs per board. **Any run below
    depth 6 FAILs**, depth 7 is a WARN, and "≥ base" is **graded by the median**. This is a search ticket; `Q-3K-4`
    (b) covers evaluation tickets only.
  - **(d) `G2` by byte identity:** `src/evaluate.ts` and `src/evaluate-params.ts` are byte-identical to the base, so
    `G2` is not re-read. If either is touched, `G2` is read by its rule.
  - **The instrument check, not a bar.** On `src/` tree `4cb84035` a faithful build reads: head `search()` d8
    **605 117 / 406 787**, `chooseMove` d8 **766 275 / 87 475**, reach **6.716**; doors **839 514 / 1 533 901 /
    1 296 788 / 404 930**, reach **5.879**. **If `main`'s `src/` has moved by the build** (for example, `ABC-270`
    merged first), the Engineer re-reads both sets on the new base and puts both in the PR. A re-derived count is a
    dated line in `ADR-0069` (the Architect's), never a moved bar.
- **A5 (`G1`; d11).** `PUZZLE_DEEP=1`: **≥ 54 / 58, with no NEWLY-MISSED line.** A red is classed per row under
  `ADR-0034`. `G5`, `G8`, `G9` and `G10` as `ABC-268` A5.
- **A6 (the read; d13; `ADR-0056` C2′ / S′, by reference). Intent GAIN.**
  - **C2′:** 100 games at 100 ms a move, the candidate head rebased on `main` against its merge-base, self-play,
    openings 1–50 with both colours, one game at a time, `Threads 1` against `Threads 1`, QE with the host ALONE,
    through `ABC-255`. **MET** on 100 of 100 complete, 0 candidate faults, 0 losses on time at the 50 ms margin, and
    **≥ 50.0 of 100**. A miss is NOT MET and is not re-played. NEUTRAL is closed: the reach gain is read at the 100 ms
    node budget.
  - **S′, the Stockfish smoke at E 1 810:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms
    500 --rounds 5 --concurrency 1` (or the E in force at the read, `ADR-0056` S′), `timemargin` 50 ms. **MET** on 10 /
    10 complete, 0 faults, 0 losses on time, and S-4 **≥ 3.0 of 10** (below that, 10 more games and **≥ 7.0 of 20**).
    It is pooled only if the ticket merges.
  - **The Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest
    run src/levels.test.ts --reporter=verbose`, QE, host ALONE: **exit 0, every test passed** (QE counts its own run).
  - **R-TC part 1, item 2, read at review:** the diff reads no budget, deadline, `movetime`, test flag or environment.
    The rule is keyed on the position, the move and the check state only.
  - **Reported:** W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`.

## What happens on a miss

- **A bar miss takes `ADR-0069` § What would falsify this** (its table is authoritative):

  | # | fires when | row | disposition |
  |---|---|---|---|
  | F1 | drift: a non-mate score beyond 144 cp, < 93 % within 25 cp, or a mate sign change | A3 (a) | a defect first (the exemptions, the in-check guard, SEE's sign). On an exact build: NOT MET |
  | F2 | a door mate at d5 that the head does not score as a same-sign mate at d5 | A3 (b) | a defect |
  | F3 | a zugzwang row not played at its recorded depth | A3 (c) | a defect. Never a re-pin |
  | F4 | a d8 reading above 0.78 ×, or reach below door + 0.55 | A4 (a), (b) | a defect first (an unwired switch reads 1.00 × and +0). On an exact build: NOT MET |
  | F5 | C2′ < 50.0 of 100, or an S′ collapse | A6 | not merged; `ADR-0069` reads "accepted, not in force" |
  | F6 | `see` differs from a hand value on an A1 row | A1 (a) | a defect in `see` |
  | F7 | a new door not node-equal to the pre-ticket search, or an older door not node-equal to itself | A2 | a defect in the switch wiring |
  | F8 | `G1` below 54 / 58, or a NEWLY-MISSED line | A5 | classed per row under `ADR-0034` |
  | F9 | `G6` below base by the median, or any run below depth 6 | A4 (c) | SEE's per-node cost outweighs the nodes it saves on the real clock. NOT MET; no tuning after the read |

- **On NOT MET the ticket is closed unmerged under S1** (`EPIC-008` § Ship rules, the value-changing rule; not `EPIC-011`'s row S1, `ABC-236`): it is
  **not shipped**, the branch is not merged, and a `failed-attempt` note records the reading. `EPIC-011`'s
  per-change rule replaces S1's NEUTRAL extension and re-tune round: the read is not re-played, no margin is added
  and no form is changed after the read (`ADR-0069` § Alternatives, F9). `ADR-0024` d4's amendment then stands
  "accepted, not in force". A new form is a new ticket with a new PREREG.
- **Either way the slot is released.** A merge or a NOT MET both free `ABC-239`'s candidate freeze for B-T7 / B-T8.
- **A defect** (F2, F3, F6, F7, or F1 / F4 on an inexact build) goes back to the Software Engineer and is not a miss.

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): A4 (c), graded by the median "≥ base"; every run ≥ 6; depth 7 a
  WARN. SEE's per-node cost is not timed (`UNKNOWN - verify`); F9 is the read.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): **288 bytes fixed**, summed by `seeScratchByteLength()` (A1 (e)). Nothing
  grows per search.
- **`NFR-008`** (`npm test` ≤ 10 s): A1's rows are default-lane units with no search. Drift, the mate floor, zugzwang
  and reach go behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`, and `G1` behind `PUZZLE_DEEP=1`. `N8-LANE` is reported
  before and after.
- **`NFR-001` / `G2`:** not re-read on byte identity (A4 (d)).
- **Security:** none. No new input, data, format, option or dependency. `plans/nfr-catalog.md` is untouched.

## Test notes

1. Reuse sourced fixtures: the 190, the 287 mate corpus, `ADR-0050` d9's zugzwang set, the `ABC-078` `A3` corpus,
   `HANGING_CORPUS`, kiwipete and position-6. A1 (a)'s new rows are hand-checked exchanges, each with its hand value
   written beside it.
2. Deterministic mode (`ADR-0027`) holds: `see` is a pure function of the board, and the same input and virtual clock
   give the same move. That is what makes A4's instrument counts exact.
3. **The PR lists every re-pointed and re-pinned row**, with old and new figures (`ADR-0058` d5's practice). No
   zugzwang row's depth is re-pinned.
4. Reuse `arch-Q1-see-pruning`'s probe as the instrument (`.grugops/context/arch-Q1-see-pruning/raw/probe/`). Its
   scratch knobs, counters and audit marks never enter `src/`. QE states the build sha it read.
5. **Kiwipete's d8 root move changes** (e2a6 −81 → d5e6 −89) in both recursions, as in the probe, and startpos's d8
   `search()` move changes from d2d4 to b1c3 (`ADR-0069` § Context, reports). Any row that reads those moves is handled
   by decision 8's re-point references and listed in the PR with old → new (test note 3).
6. **UAT is owed** (production lines). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).
7. One job at a time on the host (one core, the shared lock). QE's C2′ for this ticket runs ALONE.

## Size and priority

- **Size: S–M** (the Architect's effort, `…5e73b0d4` § 4). `src/see.ts` is about 120 lines plus the A1 fixture, with
  about 5 lines in `quiesce`, the switch through two recursions, two doors, the re-points and decision 10's rows. One
  SE hop, and a QE hop with C2′, S′ and `G6`. **The front matter carries M**, the upper end, because the field takes
  one size.
- **Priority: P2.** It is the largest measured lever on the epic, and its slot sits before `ABC-239`'s candidate
  freeze, so every later C2′ read is taken on the deeper search the product will ship (`…5e73b0d4` § 3).

## Dependencies

- **`ADR-0069` ACCEPTED** (owner `…401c3d09`). That carries the amendment of `ADR-0024` d4. The dated pointer in
  `ADR-0024` § Status is the Architect's (`arch-owner-answers-1103b`, in flight), and it is not a wait.
- **Base:** `main`. Its `src/` is tree `4cb84035` at this cut, which is the probe's tree, so A4's instrument counts
  hold as written.
- **The slot (hard order):** merge, or a recorded NOT MET, **before `ABC-239`'s candidate is frozen for B-T7 /
  B-T8**. Never between that freeze and `ABC-239`'s merge. If B-T8 started first and this ticket then merged,
  `ABC-239` would rebase onto it, and B-T8 would have read a candidate that is not what merges (`…5e73b0d4` § 3).
- **Files:** `src/see.ts` (new), `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`. **There is no file collision
  with `ABC-239`** (`tools/tune/`, `src/evaluate-params.ts`) **or with `ABC-270`** (`src/evaluate.ts`,
  `src/evaluate-params.ts`). Whichever merges second re-reads its instrument counts on the new `main`. `ABC-270` is
  value-identical, so A4's counts are expected unchanged (`UNKNOWN - verify` until read).
- **`ABC-239`'s filter** calls `quiesce` with its own rules record, so a merge here does not move its data set
  (`ADR-0069` d6). The `ABC-239` page names the record.
- **Parked tickets:** `ABC-234` (O3s) re-opens only by a new PREREG over this ticket once merged (`ADR-0065` re-open
  1). P1 and P4 touch `src/search.ts` and are parked.
- **QE:** A2 out of tree, A6 with the host ALONE, `G6` by its rule.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ measured on `main`: 31.1 % of quiescence moves are losing captures, 97.27 % refuted, QS head 0.448 × the nodes; +0.837 ply reach at the 100 ms node budget; the Elo figure is labelled an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–5 = `ADR-0069` d1–d9; QSM, QSc, a margin, SEE ordering, Q2, quiet checks, O3s and evaluation edits are out |
| 3 | INVEST | ✅ S–M (carried as M); independent of every open ticket (no file collision with `ABC-239` or `ABC-270`); one mechanism behind one switch and a door pair; valuable by A4 / A6; testable by A1–A6 |
| 4 | testable, measurable acceptance | ✅ A1 ≥ 20 rows equal to hand values, the losing-test truth table, the source and in-check rows, 288 B; A2 node-equal, exports +1 / +1 / 3; A3 ≥ 93 % within 25 cp, max ≤ 144, 0 sign changes, mate floor 0, zugzwang 7 / 7; A4 ≤ 0.78 × × 4, ≥ door + 0.55 ply, `G6` median ≥ base and every run ≥ 6, `G2` byte identity, exact instrument counts; A5 ≥ 54 / 58; A6 ≥ 50.0 of 100, S′ S-4 ≥ 3.0 of 10, Levels exit 0 |
| 5 | dependencies known | ✅ `ADR-0069` accepted; base tree `4cb84035`; the slot before `ABC-239`'s freeze; files and the re-read rule; `ABC-239`'s filter protected |
| 6 | NFR triggers with targets | ✅ `NFR-005` (≥ 6, median ≥ base); `NFR-009` 288 B; `NFR-008` ≤ 10 s, deep rows behind flags; `G2` by byte identity |
| 7 | test notes | ✅ 1–7 |
| 8 | size | ✅ S–M (front matter M) |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ `ADR-0069` is written, premise MET, and ACCEPTED (`…401c3d09`). Nothing is left for the owner |

**DoR 10/10 (cut 2026-11-03, `bapm-owner-answers-1103b`). Ready.** The build may start from `main`. The board move to
Ready for Dev, and the pull, are the Orchestrator's.
