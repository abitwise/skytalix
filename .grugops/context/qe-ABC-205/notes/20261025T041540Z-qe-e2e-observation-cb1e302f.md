---
id: 20261025T041540Z-qe-e2e-observation-cb1e302f
kind: observation
by: qe-e2e
at: 2026-10-25T04:15:40Z
verified_by: 
confidence: high (every command run by QE at b5d5cea5; values re-derived on scratch trees; plants cleaned up)
refs:
  - ABC-205
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0031
  - ADR-0049
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - se-integrate-ABC-205/20261025T034141Z-software-engineer-decision-c685972c
  - se-integrate-ABC-205/20261025T034141Z-software-engineer-observation-e709eff1
  - grugops/qe-ABC-205
  - b5d5cea5
  - d5690c5c
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-3050b787
  - owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff
  - G1
  - G2
  - G3
  - G4
  - G9
supersedes: 
seal: sha256:55ea989511302e331a146bac42140bfb795d6c0e2eb716f4f4a528c2965d1105
---

# ABC-205 QE gate at b5d5cea5: A1–A4 and A7 MET; G1, G3, G4, G5, G8, G9 green; G2 reused; every load-bearing plant reds its own row

QE/E2E, task `qe-ABC-205`. Branch `grugops/qe-ABC-205` in `../wt-qe-ABC-205`, from `grugops/ABC-205-final` `b5d5cea5`, no merge.
Base = merge-base `d5690c5c`. `main` is at `c2775024`; `git diff d5690c5c..main -- src data tools` is empty (only
`package.json`/lock `engines.node` ≥ 22 → ≥ 22.18, ABC-216). main was NOT merged into the branch. Own `npm ci`, node
v26.11.1, Apple M3, Darwin 25.6.0. Scratch `<scratchpad>/qe205/`; raw under `raw/` (redacted, `ADR-0049` d4).

## Gates (all at b5d5cea5)
- `npm run lint` rc 0 (biome, 128 files); `typecheck` rc 0; `build` rc 0, `dist/` 22 files, 0 from `tools/`.
- `npm test`: 62 files, **2 091 / 2 091**, `last-run.json` success true, 0 failed, 0 pending, 0 todo. Duration 7.23 s
  (real 8.08 s; load1 8.55 at its start, so not an NFR-008 reading; the Orchestrator's clean sentinel `…10e61802` stands).
- `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0. 0 skips in the output.
- SEARCH_DEEP: search 57/57, ordering 38/38, transposition 40/40, quiescence 37/37, pvs-lmr 29/29.
- ENGINE_DEEP: engine 60/60, levels 41/41, transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47.
- PUZZLE_DEEP (`G1`): 18/18, **solved 55/58, baseline 54/58** (MISSED seeds 24, 288, 580; NEWLY-SOLVED seed 234).
- Printed lines, raw: `ABC-121 A1 mate floor d4 -> d5: 0 of 180 violated`; `search() d5: 96.79% within 25 cp of 187, max
  79 cp (position-6/e2d2: 56 -> 135)`; `chooseMove to d5: 97.33% … max 79 cp`; quiescence A5 16.06/22.04/3.97x (kiwipete),
  10.96/29.36/5.16x (position-6). All equal the SE's integration readings (`…e709eff1`).
- First deep attempt refused by `heap-guard` at 512 MiB (AGENTS.md: 400 MiB for one-file runs); re-run at 400 MiB. In this
  environment vitest's reporter hides passing tests' stdout, so the puzzle, pvs-lmr and quiescence deep files were run once
  more with `--reporter=default` to print their lines (deterministic; same pass counts).

## Criteria, re-derived by QE (scratch `git archive` trees; values deterministic)
- **A1 MET.** 8 pairs, 4 castled g1 and 4 uncastled e1. (intact − broken) queen | rook, head: 221|167, 81|47, 207|153,
  76|42, 139|89, 185|115, 51|21, −11|−41, all strict. Base: equal on all 8 (141|141 … −41|−41).
- **A2 MET.** Ending e4 65 > g1 −2 (base −85 < −7, fails as the page says). Middlegame g1 38 > e2 −33 (base 38 > −3).
- **A3 MET.** Drop 111 > 31 (queens only) and 187 > 87 (full). The base figures were re-read on `d5690c5c`: 31, 87.
  **A3b** 40 > 21 (base 21).
- **A4 MET.** `G3`: the new rows run 25/25 at head, and on base 12 red / 13 green (A1 ×8, A2 ending, A3 ×2, A3b red;
  A2 middlegame and both mirror rows green). Mirror exact over the corpus plus 37 new positions (24 A1 FENs with their
  rook twins, plus 13). `G2`: **not re-read; the SE's reading is reused** under `…4c3f7639` ("previous results can be
  used"): base 653.4/645.3 ns, branch 700.7/700.5 ns (`…3050b787`). `evaluate.ts` differs from the SE's two trees in
  header comments only, and its one import (`position.ts`) is unchanged across `f47b3429..d5690c5c`.
- **A5 other gates.** `G1` 55/58 MET. `G4` green (ENGINE_DEEP engine). `G5`: 30 real-clock 3 s searches (G6 + G11)
  returned in 2 999.8–3 001.8 ms, under the 5 s ceiling. `G8`: 7.23 s (see above). `G9`: `src/levels.ts` byte-identical.
  `G10`: the two re-levels (OD-205-1 16x, OD-205-2 118 cp) are the owner's (`…fb0468ff`). `G6`: FAIL, in this task's G6 observation note.
- **A7 MET.** `ADR-0031` § Addendum 2026-10-24 states the ×3 queen scale and the phase-24 blend with this project's own
  endgame table, and is ACCEPTED by the owner (`…fb0468ff`), so it was reported.

## Load-bearing plants (each in its own scratch tree; diffs in `raw/plants/`)
- Queen scale = 1: reds exactly the 4 e1 A1 rows (21/25). Endgame half = middlegame table: reds A2's ending row only.
  Shelter gate removed: reds A3b only. Each as the Design ruling probed.
- Quiescence MVV-LVA sort removed: reds `A5` position-6 depth 1 at **52.19x** against the 16x level (the OD-205-1
  condition). Taper only (scale 1) reads 9.26x there, base 9.19x, head 10.96x.
