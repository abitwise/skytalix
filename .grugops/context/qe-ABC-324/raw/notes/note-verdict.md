# qe-ABC-324 verdict: **PASS_WITH_GAPS. README and CHANGELOG on `grugops/ABC-324` (7528cafd) carry L5's measured 2413 ± 51 and the re-projected L6 ~2470–2580 and L7 ~2540–2740 correctly.** Every number traces to QE `…f1531600` and its records, or to the architect's `…39f1f696` and ADR-0045 § AMENDMENT 2026-11-15. The arithmetic holds, "see below" points at the Stockfish paragraph, and markdown renders clean. All gates are green. Three Low wording gaps, none blocking, and no product finding

QE/E2E, task `qe-ABC-324`, branch `grugops/qe-ABC-324` from `grugops/ABC-324` `7528cafd`, 2026-11-15. The evidence is the observation sealed just before this note. Docs only: no game, no engine start, no `src/` edit, and QE fixed nothing. Merge and deploy stay with the humans.

## Checks (the brief's three lines)
1. **Every L5 number traces to `…f1531600` and `qe-ABC-323/raw/out/`: MET.**
   - The records give 2412.9 ± 51.1 (`full-rsum.txt` `state: rating`), which prints as 2413 ± 51 by L1–L4's nearest-integer rule.
   - `UCI_Elo` 2280 reached 200 / 200 processes, and the run is 200 games.
   - 4 s on both sides: `st=4` for both engines, and `go movetime 4000` was the only `go`.
   - Stockfish 19 is in `machine.txt`.
   - The old projection 2240–2320 is `main`'s cell, re-derived as 2244–2314.
2. **L6/L7 against the architect's note and ADR-0045 § AMENDMENT 2026-11-15: MET.**
   - The cells and the intro line match.
   - The projection paragraph and the CHANGELOG line match word for word.
   - The arithmetic re-derives: L6 2479.0–2578.1 gives ~2470–2580, and L7 2542.4–2736.6 gives ~2540–2740, both outward to tens. The other figures all agree as well: +73–79, +96, +66–165, +63–159, 2464.0 and 93–173.
   - "see below" is in the projection paragraph, and QE's Stockfish 4 s vs 1 s paragraph comes directly after it.
   - The optional Stockfish-code sentence is left out, per the orchestrator.
3. **The rest of the README, the CHANGELOG format and rendering: MET, with the Low gaps below.**
   - No stale L5–L7 figure or "not measured at 4 s" statement remains.
   - The Strength-section line reads as QE recommended.
   - CHANGELOG `[Unreleased]` follows `[1.1.0]`'s shape: a paragraph, then `### Changed` and a list. Its link reference is present.
   - markdown-it-py (CommonMark and GFM tables) finds no list, code or blockquote token in the Levels and Strength sections. The table is 4 × 8, and all 7 Strength cells parse.
- **Gates (under the host lock):**
  - `biome check .`: exit 0, 150 files.
  - `tsc --noEmit`: exit 0.
  - `vitest run` with `NODE_OPTIONS=--max-old-space-size=128`: 72 files, 2740 passed, 0 failed, 0 skipped.
  - The run without that prefix was refused by the heap guard before any test ran. That is an invocation precondition, not a failure.
  - `records-path-check --base main`: clean.

## Gaps, by severity
- **Blocking: none. Medium: none.**
- **Low, G-QE-324-1 (the Strength section's opening line).**
  - The section opens "One measured figure, on one scale: X = 1902.5 ± 49.1". It now closes with a second measured figure for level 5, "it measured 2413 ± 51 (see Levels)".
  - The scale is still one. The phrase "One measured figure" predates this change, since L1–L4 have been measured in Levels since 1.1.0. But the new closing line puts a second measured figure inside the same section.
  - A reader may stumble on it, but nothing is wrong in number. It is the SE's or a docs hop's to reword if wanted.
- **Low, G-QE-324-2 (a narrower Stockfish-time caveat).**
  - The old paragraph, "Stockfish also had each level's time per move. How that moves its strength at a given `UCI_Elo` was not measured.", covered every level. It was replaced by QE's paragraph, which names only level 5 against level 4 (4 s vs 1 s).
  - "Both sides had the level's own time per move" still states the fact for L1–L4. But the explicit "not measured" caveat for L1–L4's own steps (0.1, 0.2, 0.3 and 1 s) is gone.
  - The SE's Result says the choice was deliberate ("QE's covers it"). QE's verdict did not ask for the removal, and it does not object to the narrowing as wrong. Keeping one generic clause is the docs hop's call.
- **Low, G-QE-324-3 (the projection paragraph leans on an unstated blunder cost).**
  - "once level 4's blunder cost is added back" no longer has its size in the README. The old paragraph gave 10–14 Elo a point, 50–70 at 5 %. So the +125 to +135 cannot be reproduced from the README alone.
  - The "+73 to +79 a doubling measured under 1 s" includes the same assumed add-back. It rests on two measured points plus the assumed 50–70, which is a derived figure, not a measured one. The architect's own table labels it as implied by the readings.
  - This is the architect's verbatim wording, so it is a precision note, not a factual error.
- **Info:**
  - The exact L4-no-blunder → L5 rate is +124.45 to +134.45. "about +125 to +135" is the source's rounding, and "about" covers it.
  - README lines 89–90 begin with `+125` and `+79`. These are safe in CommonMark and GFM, since no space follows the `+`. A later re-wrap that leaves `+ ` at a line start would make a list item, which is fragile but not wrong today.
  - "the level's blunder rate was on" is vacuous for level 5 (rate 0). It is QE's own wording and true.
  - The CHANGELOG puts the measured-L5 paragraph above `### Changed`, outside a Keep a Changelog type section. That follows the repo's `[1.1.0]` precedent.
  - In the released `[1.1.0]` entry, "the blunder cost behind the projections stated" describes the README at 1.1.0. That is history, correctly left alone.
  - L1's README `1499 ± 53` against a recorded 1499.5 ± 53.4 looks like a tie rounded down. That is pre-existing, outside this diff, and **UNKNOWN - verify** (the unrounded value may sit below .5). L5's 2412.9 has no tie.

## Result
- **QE: PASS_WITH_GAPS.** No product finding, and no test fails. No test was added, because this is a docs ticket and no test pins README or CHANGELOG text.
- The Low gaps are advisory. They need no re-run and can be closed or waived by the Orchestrator.
- Board move: by the zero-production-lines rule the ticket goes from In Review to Ready for UAT, or to Done with the UAT waived. The board column is the Orchestrator's to move.

## Fences held
- No game and no engine start. No `src/`, README, CHANGELOG, ADR or board edit.
- No push, force, amend, rebase or merge.
- No host path in the committed files. Scratch paths are written `<scratch>`.
