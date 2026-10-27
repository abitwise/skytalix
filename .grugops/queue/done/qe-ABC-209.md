---
subtask: qe-ABC-209
role: qe-e2e
ticket: plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
ref: .grugops/context/qe-ABC-209/
branch: new grugops/qe-ABC-209 from grugops/ABC-209 (bb6cf451), worktree ../wt-qe-ABC-209
width: 1 — ALONE for timing (G2, G5, G6, G8, real-clock rows, D; ~6–12 h). Records-only hops may run beside it (no npm/vitest/build). ABC-209's own single reading.
---

# QE gate + readings for ABC-209 (per-game transposition table; ADR-0025 D4 amendment ACCEPTED)

> **One run (`…4c3f7639`):** each reading runs once, and its result is final. No repeat after NOT MET or UNRESOLVED. The ship rule's own extension step is part of the run. Pausing is not a re-run.
> **Battery allowed:** log the power source, and never stop a reading because of it.

## Do
- Merge current `main` first and report the sha. Run your own `npm ci --ignore-scripts`.
- **QE gate at your merge.** Verify the page's criteria A1–A5 independently against the `## Design ruling`, the ADR-0025 amendment (Architect `…2e73dcd9`, `…b7d4b710`; accepted `…e12dd4c5`) and the build (SE `ticket-to-pr-ABC-209/…fb730791` and its observations).
  - Re-run the load-bearing plants, including the A2 plants the SE used (those rows pass on base by construction). Name the blind spots.
  - Check that the `src/cli.test.ts` one-launch row is still honest with the shared launch helper.
  - Re-fix or confirm the A4 40-search game and its budget before reading it (NFR-009 ≤ 1 MiB; over = STOP).
  - Audit any moved rows (the ruling says none).
- **Gates:** lint, typecheck, build, `npm test` + `last-run.json`, skips (`test-skip-integrity.js`), SEARCH_DEEP (including the null-move lane), ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58).
- **Real-clock readings:**
  - G2 ≤ 1 100 ns, with the base in the same session.
  - G5, G8, G9, G10, G11 as the page states.
  - The 12 real-clock rows the build filtered out.
- **Pre-check:** the frozen-clock d7/d8 counts, base vs head, must be equal (A1). Any difference → STOP to Architect/Design, and no G6 or D.
- **G6** under EPIC-008's G6 rule, with "≥ base" graded (rule A, owner's word `…2ae5fc12`):
  - n = 5 per board per build, interleaved; graded by median.
  - Any run below 6 FAILs.
  - For ABC-209 G6 is a regression guard, because a fresh process is node-equal by A1.
  - A miss → STOP to Architect/Design, and no D.
- **D (A6)** only if the gate and G6 pass:
  - ABC-204 harness `d` mode: candidate = your merge, base = its merge-base on main. ABC-204 pins, B = 1 500 ms. PREREG first.
  - Confirm that the harness plays each game through one engine process/session, so the table actually persists across moves. Say how you checked.
  - Grade by EPIC-008 ship rule **S1**. GAIN → MET.
  - NEUTRAL → the one extension (400 more games, same pins, pooled; report the pooling). GAIN after it → MET.
  - Anything else → NOT MET: a `failed-attempt` note, and no merge.
- **Before each reading:** load1 ≤ 8, and no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free results; grade by the page.
- **Verdict and UAT:** this is a production change, so the QE verdict signs UAT under `…5aaf7cec` item 2.

## Fences
- Work only in your worktree and `<scratchpad>/qe209/`. Raw outputs go under your context folder, per ABC-204 A7. Make driver scripts executable before the first start (the QE-208 false start).
- No `src/` or `tools/` edits.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-209`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-27 (task `qe-ABC-209`, ALONE for timing). Verdict: FAIL on A6 at merge `b5f46e86`** (`grugops/qe-ABC-209`
= `grugops/ABC-209` `bb6cf451` + `main` `64394974`; records at **`694aa3af`**; base = merge-base `64394974`). The gate passes;
the ship rule rejects the change. Not pushed, not merged into main. No `src/`/`tools/` edit, no board edit. One
pre-registered run under `…4c3f7639`, with S1's extension as its own step. `main` has not moved since `64394974`, so D is not
stale.

- **Criteria:** `A1`–`A5` and `A7` MET; **`A6` NOT MET (S1).**
  - `A1` 30/30 cells equal to base (six boards × `chooseMove` and three doors without a token after a tokened game, plus a
    first new token). `A2` 8/8 game-B first searches equal a fresh process (UCI `ucinewgame` ×2, non-continuing
    `position`, re-search, take-back, `position fen`; CLI `new`, `undo`), with 2/2 power controls differing. `A3` 3/3 hash-move
    pairs hit on the first probe through the UCI session and the CLI seam; `dist/uci.js` keeps the table (38 331 vs 42 465).
  - `A4`: game confirmed before reading (SE's self-play, d6 frozen, one token): heapUsed Δ 54 008 B, arrayBuffers Δ 0, table
    4 194 304; QE's UCI-path variant Δ 413 200 B / 0. All ≤ 1 MiB, so no STOP.
  - Moved rows: none (7 deleted lines are `A7`'s child moved into the shared `gcChild`, identical construction). The
    `cli.test.ts` one-launch row is still honest: 3/3 plants on the helper red it.
  - Plants: 13 red their rows (the SE's 5 among them).
- **Pre-check: 8 of 8 frozen d7/d8 counts equal**, base vs head (kiwipete 590 489 / 1 259 463; position-6 180 941 / 355 565),
  also with a first token. No STOP.
- **G2 MET:** head 644.0 / 642.1 ns, base 640.7 / 645.4 ns, same session.
- **G6 MET**, n = 5 per board per build, interleaved: kiwipete base 8 ×5, head 8 ×5; position-6 base 9 ×5, head 9 ×5. 0 of 20
  runs overlapped. A regression guard, as ruled.
- **D (S1) NOT MET:**
  - d1 **NEUTRAL −0.9 ± 25.3** (110/111/179, 400/400, 0 faults), so the one extension ran.
  - d2 **NEUTRAL +18.3 ± 26.3** (130/109/161, 400/400, 0 faults).
  - **Pooled NEUTRAL +8.69 ± 18.25** (240/220/340, n 800, X − Y = −9.56). The pooling is the sum of the two `Score of` lines
    through QE's `elo.cpp` port, checked equal to each tool line.
  - It is the same load-free (d1 +2.8, d2 +18.7, both NEUTRAL) and split by power source. 0 foreign vitest.
  - **D exercised the change:** `restart=on` gives one process per game (400/400 each, every one exactly one game), and
    98.2 % / 98.3 % of the candidate's searches continue the game's token (checked by replaying `-debug` position lines
    through head's tracker).
- **Gates:**
  - lint, typecheck and build 0; `npm test` 63 files, 2 138/2 138, `last-run.json` success; skips 0, `No findings.`; lane
    inventory 63 = 63.
  - `G1` 54/58. `G5` MET (level 5 ≤ 3 002 ms; levels 6/7 inside their ceilings). `G7` 8.69 → 8.70 MiB. `G8` 8.40 s at
    load1 2.72. `G9` MET (constants byte-identical). `G10` none. `G11`: 5/5 choices equal.
  - SEARCH_DEEP null-move 44, search 57, ordering 38, transposition 50, quiescence 37, pvs-lmr 29. ENGINE_DEEP unfiltered
    60/41/37/21/37/47: the 12 filtered real-clock rows ran and are green. PUZZLE_DEEP 18/18; CLI_DEEP 11/11; UCI_DEEP 5/5.
- **UAT: NOT signed** (no PASS; `A6` NOT MET is blocking by the page). **Merge: none.**
- **Findings:**
  - QE-209-a MEDIUM, a test gap: the kept table is pinned only at `chooseMove`. 5 entry-path plants red 0 of 2 138 + 188
    deep rows.
  - QE-209-b LOW: test note 2 is pinned by no row; QE's probe shows it holds.
  - QE-209-c INFO: the page's A6 says "one process across games"; the harness runs one process per game.
  - QE-209-d INFO: `createEngine` would forward a `game`; it has no production caller.
  - QE-209-e INFO: a kept table can change a choice at equal depth (deterministic).
  - QE-209-f INFO, host: d1 ran 240 games on battery down to 16 %, and d2 started at 16 %.
  - Carried: `QE-207-g` (this claim was held about 13.5 h against a 30 min TTL).
- **Notes** (`.grugops/context/qe-ABC-209/notes/`, on `grugops/qe-ABC-209`): decision `…e32e0ee4`; failed-attempt `…0932c037`;
  observations `…89006775` (gate), `…7c874c4e` (pre-check, G2, G6, G11) and `…b3f525d2` (D). `raw/` holds the PREREG with its
  addendum, the scripts, the probes, the plants and the redacted outputs.
- **Owed:**
  - Orchestrator: the board (back to BA/PM under S1), the trace, routing, and QE-209-f. The QE branch goes to main by path
    only (`.grugops/context/qe-ABC-209/`); `grugops/ABC-209` is not merged.
  - Architect: the ADR-0025 amendment line "accepted, not in force on main"; `T1` holds.
  - BA/PM: S1 (close, or one re-tune round, which needs the owner's word), the QE-209-c page line, and QE-209-a/b if the
    ticket is re-cut.

### Trace row
| ABC-209 (qe-ABC-209) | QE FAIL on A6 at b5f46e86: A1–A5, A7 MET (A1 30/30; A2 8/8 + 2/2 power; A3 3/3 via UCI and CLI; A4 54 008 B / 413 200 B ≤ 1 MiB); pre-check 8/8 equal; A6 S1 NOT MET: d1 NEUTRAL −0.9 ± 25.3, d2 NEUTRAL +18.3 ± 26.3, pooled NEUTRAL +8.69 ± 18.25 (240/220/340, 800 games, 0 faults); D exercised the change (one process per game, 98.2 %/98.3 % of searches kept the table) | EPIC-008 | per-game transposition table held by a game token (ADR-0025 D4 amendment ACCEPTED; not in force: not merged) | NFR-005 G6 MET (kiwipete 8 = 8, position-6 9 = 9); G2 644.0/642.1 ns; G1 54/58; G5 ≤ 3 002 ms; G7 8.69 → 8.70 MiB; NFR-009 A4 ≤ 1 MiB; G8 8.40 s; G9 constants identical; G10 none | grugops/qe-ABC-209 @ 694aa3af (b5f46e86 + records)<br>.grugops/context/qe-ABC-209/notes/ (5) + raw/ | lint/typecheck/build 0; npm test 63/2138 success; skips 0 No findings.; lane inventory 63 = 63; SEARCH/ENGINE (unfiltered, 12 real-clock rows green)/PUZZLE/CLI/UCI_DEEP green; plants 13 red their rows, 6 entry-path plants 0 red (QE-209-a/b) | UAT NOT signed (A6 NOT MET; decision …e32e0ee4; failed-attempt …0932c037) | Orchestrator: board back to BA/PM under S1, trace, QE-209-f; Architect: ADR-0025 "accepted, not in force on main"; BA/PM: S1 close or re-tune (owner's word), QE-209-c | In Review → back to BA/PM under S1 (Orchestrator's move); not merged |
