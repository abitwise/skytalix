---
subtask: arch-epic008-rd
role: architect-design
epic: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/arch-epic008-rd/
branch: new grugops/arch-epic008-rd from main, worktree ../wt-arch-epic008-rd
width: 1 — records-only investigation; owner word orch-2026-10-29g/…517260b8
---

# EPIC-008: why R and D disagree on main vs 3497aad2

R (against Stockfish 19 at E = 1 910, skytalix at 3 000 ms) puts main at −82.9 ± 73.8 Elo from `3497aad2`.
The 100-game D look (self-play at 1 500 ms, width 1) puts main at +52.5 ± 46.8 Elo from `3497aad2`.
Both intervals exclude 0, on opposite sides. Explain it from the records.

## Read
- Orchestrator `orch-2026-10-29g/…517260b8` (this routing) and `…ef6ab697` (the look's review).
- QE `qe-epic008-q4c` (notes `…8d08e519`, `…83be15a1`, `…311eb14b`, `…172ff9be`; raw `raw/d/`: PGN, depths, host and thermal logs).
- QE `qe-epic008-close` (the R readings, notes incl. `…f361ab33`; raw `raw/r1/`, `raw/r2/`, `depths.txt`, `readings.log.txt`).
- BA/PM `bapm-close-EPIC-008/…e53131ba`; the EPIC-008 page (§ D, § R, `RISK-EPIC008-03`, M1, the shipped tickets' D readings ABC-208 / ABC-215 and the not-shipped ones).
- `tools/rating/rating.ts` (the R and D command shapes) and the ADRs it cites. The engine diff `3497aad2..b5c67ab7 -- src data` (what actually changed).

## Do
- List the candidate explanations and rank them. Give each its evidence for and against **from the raw files**. Name the files and the counts. Cover at least:
  - opponent (self-play against a strength-limited Stockfish);
  - time per move (1.5 s against 3 s);
  - the opening set and colours;
  - statistical chance, joint across the two readings;
  - host load and heat;
  - the artifact and the build (R1 and R2 `dist/` trees differ);
  - how the shipped changes behave per game phase or result type (mates, draws, depth).
  - Say plainly when the evidence cannot tell two explanations apart.
- For each explanation, say what it would mean for M1 and for the measuring method (R vs D, `RISK-EPIC008-03`).
- **One recommended next step.** If it needs new games or a long CPU run, write it as a proposal for the owner: games, width, hours and the expected heat. Width 1 on this host still reached Tctl 95.5 °C max and a ~80 °C median; see `…311eb14b`.

## Fences
- Work only in your worktree and your scratchpad. Records only: no `src/`, `data/` or `tools/` edits. Never push, force, amend or rebase. Never merge into main. No board edits.
- No `rating.ts` runs and no games. Short single-process engine probes are allowed, under 10 min of CPU in total. Run them only when `ps` shows no cutechess.
- Own `npm ci --ignore-scripts` if you need the engine. Linters only via `npm run …`; never a bare `npx <name>`.
- Don't re-grade M1 and don't edit the EPIC-008 page; that is BA/PM's job on the owner's word. No host paths or usernames in records (ADR-0049 d4).

## Publish
- Seal notes (task `arch-epic008-rd`) with `at` from `date -u`: one `observation` per explanation (or one note with all of them) and a `kind: decision` holding the ranking and the next step. Commit on your branch.
- Write `## Result` plus a 10-cell trace row (header order of `plans/traceability.md`) into this brief in main's queue, then move it and its claim.md to done/.
