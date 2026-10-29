---
subtask: qe-epic008-close
role: qe-e2e
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/qe-epic008-close/
branch: new grugops/qe-epic008-close from main, worktree ../wt-qe-epic008-close
width: 1 — ALONE (two R readings, ~4.4 h each, + M3 gate reads; ~9 h). Records-only hops may run beside it (no npm/vitest/build/games).
held: spawn only after se-tools-rating-host AND bapm-epic008-hostB are merged into main (orch-2026-10-28a)
---

# EPIC-008 close, step 3 (option B): two M1 R readings on this host + M3 gate reads

> **Option B (owner, `orch-2026-10-28a/…5dbd717b`):** M1 = R(close) − R(baseline), both read on THIS host, half-width √(Y1² + Y2²). The previous-host 2 061.3 ± 50.3 is **not** the comparison.
> **One run each (`…4c3f7639`):** each R reading runs once and its written result is final. UNRESOLVED is reported; a re-run is the owner's word.
> **Power:** EPIC-008 § Host says every reading runs on AC. This host has no battery (no power_supply entries, orch-2026-10-28a), so the rule holds by construction. Log it once in PREREG. If a battery ever shows up, STOP before game 1; never stop a reading once it has started.
> **E band:** if a reading lands outside 25–75 %, report it. Grading off-band and degenerate readings is owner Q3 on the EPIC-008 page (`bapm-epic008-hostB/…f0c8fedb`), BA/PM's call at step 4, not yours.

## Do
- Read Orchestrator `orch-2026-10-28a/…5dbd717b`, SE `se-tools-rating-host` (re-pin), BA/PM `bapm-epic008-hostB` (M1 line + close-path step 3), and the EPIC-008 page as merged.
- Own `npm ci --ignore-scripts`. Run the harness from your worktree at main (re-pinned). Tool paths come from the environment (`CUTECHESS_CLI`, `STOCKFISH`); the values are in the env file named in your spawn prompt. Keep them out of every record.
- **Close sha:** main at your cut. **Confirm before any game** that its `src/` and `data/` equal `b5c67ab7`'s. Any difference → STOP to me.
- **PREREG first**, as one sealed note before game 1 of reading 1: both shas, E = 1 910, 200 games each, the pins, the order, and the grading rule from the page.
- **Reading 1: baseline `3497aad2`.** **Reading 2: the close sha.** Both by ABC-204 A4's protocol, every pin frozen (ABC-204 § Reading, "Frozen for EPIC-008"): `r <sha> <out> --elo 1910 --rounds 100` (200 games); `openings.epd` sequential, both colours; skytalix at `st=3`. Verify both tool hashes print `= pin`; `DIFFERS` → STOP before game 1.
- **E is frozen and has no E step.** If a reading's score lands outside 25–75 %, report it and grade it as the page says. Don't move E, and don't re-run.
- **Before each reading:** load1 ≤ 8, and no foreign vitest or cutechess (wait up to ~60 min; other sessions on this host run vitest). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free; grade by the page.
- **Report** each R as E + X ± Y, plus the M1 inputs: R2 − R1 and √(Y1² + Y2²). Don't grade M1; BA/PM does (step 4).
- **M3 on the close sha, each by its own instrument:** G1 (PUZZLE_DEEP ≥ 54/58), G5, G6, G8, G9. G6 "≥ base" reads the close sha against `3497aad2`, **both on this host**: 5 interleaved runs per board per build, median, floor 6 (rule A, `…2ae5fc12`). Run the M3 reads after both R readings, never during one.
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips (`--skip-count 0`).

## Fences
- Work only in your worktree and `<scratchpad>/qeclose/`. Raw outputs go under your context folder per ABC-204 A7, redacted (no host paths or usernames). Make driver scripts executable before the first start.
- No `src/` or `tools/` edits. Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-epic008-close`) with `at` from `date -u`: PREREG, one per reading, M3, and a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, on `grugops/qe-epic008-close` (worktree `../wt-qe-epic008-close`, from main `38536a34`): records `32540f3e`. Not merged; nothing pushed. Verdict: PASS** (decision `20261029T063012Z-qe-e2e-decision-bdbccbbf`).

- **Close sha** = main `38536a34`. Its `src/` and `data/` equal `b5c67ab7`'s (empty diff; tree ids `1bf0138a…` and `018e1ecb…`). Confirmed before any game.
- **PREREG** `20261028T212209Z-qe-e2e-observation-8fb860a9`, sealed 21:22:09Z, before game 1. Power was logged once there: no `power_supply` entries, so the AC rule holds by construction.
- **Pins:** the harness printed `= pin` for both tools, before each reading. Openings `0d7f7a72…2666`.
- **Reading 1, R(3497aad2) = 1 910 + 188.5 ± 54.8 = 2 098.5 ± 54.8**, score 74.75 % (146/47/7), in band. 200/200 games, 0 faults, depth guard 0/8 991, 21:22Z–01:42Z (4.34 h). Observation `…e8d5c13a`.
- **Reading 2, R(38536a34) = 1 910 + 105.6 ± 49.5 = 2 015.6 ± 49.5**, score 64.75 % (125/66/9), in band. 200/200 games, 0 faults, depth guard 0/9 388, 01:42Z–06:14Z (4.52 h). Observation `…f361ab33`.
- **M1 inputs (not graded):** R2 − R1 = **−82.9**; √(Y1² + Y2²) = **73.8**. Neither reading is off-band or degenerate, so Q3 does not arise.
- **Overlap-free:** 0 of 200 games overlapped foreign load in either reading (0 foreign vitest, 0 foreign cutechess, 0 load1 > 8 samples). The overlap-free and load-free figures equal all-games: 188.54 ± 54.82 and 105.63 ± 49.48.
- **M3 on `38536a34`** (06:14Z–06:28Z, after both readings): `G1` 54/58 MET; `G5` MET (engine `A1` worst 3 002 ms; level 5 max 3 002 ms on 30/30; L6 max 5 002 ms; L7 max 30 002 ms); `G6` MET (kiwipete base 7 ×5, head 8 ×5; position-6 base 8 ×5, head 10 ×5; floor held); `G8` 8.32 s at load1 1.26 MET; `G9` `levels.ts` identical MET. Observation `…ffb593fe`.
- **Gates:** lint, typecheck and build 0 (`dist/` 22 files, 0 from tools); `npm test` 63 files / 2 128 passed, `last-run.json` success; skips 0, `No findings.`
- **Flags (none blocking):**
  - For BA/PM: the M1 point estimate is negative, yet the close searches about one ply deeper (mean depth 10.09 against 9.13).
  - Reading 1 is 0.25 points inside the band.
  - CPU temperature ran at a median of 82–83 °C (max 87 °C) in both readings; throttling is `UNKNOWN - verify`.
  - `G1`'s count was read on a second, verbose run of the deterministic lane, because the default reporter printed no rows.
- **STOP:** none. **UNRESOLVED:** none.
- Raw files (redacted, `SHA256SUMS`): `.grugops/context/qe-epic008-close/raw/` (`r1/`, `r2/`, `m3/`, `qe-scripts/`).

### Trace row (10 cells, header order)

| EPIC-008 M1/M3 (qe-epic008-close) | two R readings on this host, option B, E 1 910 frozen, 200 games each: R(3497aad2) 2 098.5 ± 54.8 (74.75 %), R(38536a34) 2 015.6 ± 49.5 (64.75 %); M1 inputs R2 − R1 = −82.9, √(Y1² + Y2²) = 73.8 (not graded); M3 on close | EPIC-008 | — | none moved; NFR-004 G5 MET, NFR-005 G6 MET (8 ≥ 7, 10 ≥ 8), NFR-008 G8 8.32 s MET; G1 54/58; G9 identical | grugops/qe-epic008-close @ 32540f3e (records only): .grugops/context/qe-epic008-close/notes/ (5) + raw/ | lint/typecheck/build 0; npm test 63/2 128 success; skips 0 No findings.; PUZZLE_DEEP 18/18; ENGINE_DEEP engine 60/60, levels 41/41; 0 faults in 400 games; 0 overlap | n/a (measurement hop; QE PASS …bdbccbbf) | BA/PM: step 4, grade M1–M4 and close EPIC-008; Orchestrator: merge records, board, trace, report M1 to the owner | QE PASS; branch not merged |
