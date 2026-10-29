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

## Result

**Done, on `grugops/arch-epic008-rd` (worktree `../wt-arch-epic008-rd`, from main `7a6afba5`): records `ed6fb2ee`. Not merged; nothing pushed.** Notes (task `arch-epic008-rd`): observation `20261029T195200Z-architect-design-observation-9d172446` (the evidence for each explanation) and decision `20261029T195200Z-architect-design-decision-0c5d62f4` (the ranking, what it means for M1 and the method, and the next step). The analysis scripts and their outputs are in `raw/`. No games, no `rating.ts` runs, no engine probes (0 s of engine CPU), and no `src/`, `data/`, `tools/` or board edits.

**Ranking:**
1. **Opponent dependence (non-transfer).** The D sign is replicated: `ABC-208` + `ABC-215` = +54.0 ± 33.3 on the previous host, and the look reads +52.5 here. R's drop shows on both opening halves (−71.7 and −93.8) and both colours (−84.1 and −81.7). Lost-game turning points in the middlegame went from 16 to 35. This cannot be separated from time per move, nor `ABC-215` from `ABC-208`.
2. **Chance, on R's size.** R alone has p 0.6–1.4 % if the true value is 0. The joint split has p 0.001–0.002. The opening-paired R2 − R1 is −82.9 ± 64.3 (information only).
3. **Time per move.** It cannot be told apart from 1, and no record points to it.
4. **Host, heat and order: disfavoured.** Stockfish's nps was 1.643 M in R1 and 1.623 M in R2 (−1.2 %), flat by quarter.
5. **Openings and colours: excluded.**
6. **Artifact and build: excluded.** D's `dist/` trees are byte-equal to R's, and R1/R2 differ in exactly the 6 non-test source files.

**M1:** clause 1 fails on any explanation, since even D's +52.5 has an upper limit of +99.3. The claim "main is weaker" hangs on 1 against 2. This is not re-graded here.

**Next step, a proposal for the owner:** an R gauntlet of `3497aad2`, `ba74b71d` (`ABC-215` only) and main.
- The existing `rating.ts r` shape: E 1 910, 3 000 ms, 200 games each, width 2, in the order `ba74b71d` → main → `3497aad2`.
- Information only, unless the owner says it counts.
- About 13.5 h + 1 h for QE, splittable into three runs of about 4.5 h.
- Tctl median about 82–83 °C and max about 84–87 °C per run, as in R1 and R2.
- A cheaper cut drops the `3497aad2` re-read: about 9 h + 1 h.

**STOP:** none.

| arch-epic008-rd | Architect: why R (−82.9 ± 73.8) and the D look (+52.5 ± 46.8) disagree on main vs 3497aad2, from records; ranked: opponent non-transfer > chance on R's size > time per move > host (disfavoured, SF nps −1.2 %) > openings/colours, artifact (excluded); next step proposed: 3-sha R gauntlet 3497aad2 / ba74b71d / main, ~13.5 h width 2 | EPIC-008 | — | none moved; RISK-EPIC008-03; ADR-0050, ADR-0048 cited, unchanged | grugops/arch-epic008-rd @ ed6fb2ee (records only): .grugops/context/arch-epic008-rd/notes/ (2) + raw/ (scripts, outputs) | no gates run (records only; no code changed); no games, no engine probes | n/a (records) | not released; main runs locally | arch-epic008-rd: done (proposal to owner) |
