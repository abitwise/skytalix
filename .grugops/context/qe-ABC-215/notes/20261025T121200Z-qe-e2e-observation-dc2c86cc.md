---
id: 20261025T121200Z-qe-e2e-observation-dc2c86cc
kind: observation
by: qe-e2e
at: 2026-10-25T12:12:00Z
verified_by: 
confidence: high (every command run by QE at 7d4cea3e; pre-registered; raw files read)
refs:
  - ABC-215
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0028
  - ADR-0048
  - ADR-0049
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - ticket-to-pr-ABC-215/20261025T054000Z-orchestrator-decision-1976d0e9
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-decision-3c66f0d7
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-decision-cfb55b57
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-observation-c43e10a0
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - qe-ABC-204/20261025T030130Z-orchestrator-decision-f9d109ea
  - grugops/qe-ABC-215
  - 7d4cea3e
  - cac2b4e9
  - b778ab13
  - G1
  - G2
  - G3
  - G5
  - G8
  - G9
  - G10
  - A2
  - A5
  - A8a
  - N8-LANE
  - quiescence ORACLE_AT_DEPTH_3
supersedes: 
seal: sha256:f8263ed3a7cd886aa66f0d8d1a112b9a556e728020a8d67e6e4166cd14f032a9
---

# ABC-215 QE gate at merge 7d4cea3e: A1–A6 and A8/A8a MET by QE's own checks; 16 moved rows exactly the ruling's set; the 3 companions keep their guards; every load-bearing plant reds its row

QE/E2E, task `qe-ABC-215`. Branch `grugops/qe-ABC-215` in `../wt-qe-ABC-215` = `grugops/ABC-215` `b778ab13` + `main` `cac2b4e9`
(merge `7d4cea3e`, no conflict; main moved records only). Base = merge-base `cac2b4e9`; its `src`/`data`/`tools`/`package*.json`
equal the build base `ec9331e2`, and its `src`/`data` equal `d5690c5c` (qe-ABC-205's G6 base). Own `npm ci --ignore-scripts`,
node v26.11.1, Apple M3, Darwin 25.6.0. Scratch `<scratchpad>/qe215/` (`git archive` trees); raw under `raw/` (redacted).

## Gates (at 7d4cea3e)
- `npm run lint` rc 0 (128 files); `typecheck` rc 0; `build` rc 0, `dist/` 22 files, 0 from `tools/`.
- `npm test`: 62 files, **2 090 / 2 090**, `last-run.json` success true, 0 failed / 0 pending / 0 todo. Duration 7.11 s
  (real 8.19 s), load1 6.74 at start, 0 vitest: **G8 MET** (≤ 10 s at load1 ≤ 8).
- `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- `N8-LANE` (Test note 3; reported, taken after D): `lane-inventory.js` 62 collected = 62 tracked, `No findings.`; 0 new
  lane files; `A2`'s 15 rows sit in `src/evaluate.test.ts` (default lane; 36 rows, 12 ms). Interleaved `npm test` sentinel
  (12:09:53–12:10:22Z, load1 2.8–4.2, 0 vitest): base 6.92 / 6.98 s, head 6.95 / 6.83 s. No lane growth.
- SEARCH_DEEP: search 57/57, ordering 38/38, transposition 40/40, quiescence 37/37, pvs-lmr 29/29.
- ENGINE_DEEP: engine 60/60, levels 41/41, transposition 26/26, pvs-lmr 21/21, legal 37/37, gameend 47/47 (real-clock rows included).
- PUZZLE_DEEP (`G1`): 18/18, **solved 54/58, baseline 54/58** (MISSED the four mate-in-3 seeds 24, 234, 288, 580).
- Printed: mate floor d4→d5 0 of 180; `search()` and `chooseMove` d5 97.86 % within 25 cp of 187, max 63 cp
  (position-6/f3h4, under 75); quiescence `A5` kiwipete 17.92 / 20.48 / 3.51x, position-6 8.96 / 23.36 / 5.20x (levels
  180/50/70, 10/42/13). All equal the design probe.

## Criteria, QE's own reading
- **A1 MET.** At `cac2b4e9`: `NOTICE` `Evaluation values (CC BY-SA 3.0)` count 1; `src/evaluate.ts` `See NOTICE` count 1. The
  section names exactly seven arrays: `PIECE_VALUE` and the six tables.
- **A2 MET.** QE rebuilt each rule a second way (`raw/qe-scripts/rules.mts`: knight and diagonal reach by scanning all 64
  target squares) and compared the head's `VALUE_TABLES_FOR_TEST`: all seven equal their rule over every entry (7, and
  64 each). Cells differing from base: 2/7, 46, 64, 18, 20, 27, 50 of 64 (the ruling's counts). Bishop `5(n−9)` equals
  `10·ring − 10` on all 64. Keys are exactly the seven. The export is read only by `src/evaluate.test.ts`; the test imports
  `./evaluate.ts` and `./position.ts` (already imported). Plants: one cell +1 in each of the seven arrays reds exactly that
  array's rebuild row (7 of 7); the base values put back red 14 rows (7 rebuild, 7 differ), the keys row green.
- **A3 MET.** At the tip, `michniewski|by-sa|chessprogramming` counts 0 in `src/evaluate.ts`, `NOTICE` and `README.md`.
  `NOTICE` lines 1–2 `skytalix` / `Copyright 2026 Olger Oeselg`; Apache 2.0 1, MIT 1, the four kit paths present; `@` 0,
  `/Users/` 0, non-ASCII 0; byte-equal (`cmp`) to `ABC-214` Scope 5's common part. `LICENSE`, `package.json`,
  `package-lock.json` diff empty.
- **A4 MET.** `evaluate.test.ts` has 175 added lines and 1 changed import line, no relation assertion edited;
  `evaluate.pawns`, `evaluate.king-mobility` and `search.qe` test files unchanged and green (QE-G2, QE-G3 included).
- **A5 MET (audit below).** No `ADR-0026` level, NFR bound or puzzle baseline moved.
- **A6:** lint, typecheck, unit, build green; skips `No findings.`; `G1` 54/58; `G8` 7.11 s; `G9` `src/levels.ts` diff
  empty; `G10` no level reddened; `G5` ENGINE_DEEP engine and levels green (session searches 2 999.4–3 002.3 ms);
  `G2` and `G6`: this task's timing observation.
- **A8 (as amended) MET.** Product diff `cac2b4e9..7d4cea3e`: `NOTICE`, `README.md`, `src/evaluate.ts` and six
  `src/*.test.ts`, each explained by `A2` or `A5`; `tools data src/levels.ts src/status-panel.ts` diff empty. The rest of the
  diff is records under `.grugops/` (SE notes; Orchestrator queue records).
- **A8a MET.** `git diff -U0` on `README.md`: one hunk `@@ -85,2 +85 @@`, ending "…lists them: four grugops kit files (MIT)."
  Kit-files count 1; 87 lines; 8 `## ` headings (base 8); Apache-2.0 named, `LICENSE` and `NOTICE` linked, no
  every-file sentence; both files resolve.

## The 16 moved rows and the 3 companions (A5)
- **Cross-run (`raw/cross/`):** head `src` with base's six test files reds **exactly 16 distinct rows**, the ruling's set:
  engine `A3` ×2 (−64 → −2, aborts in d3), ordering Scope tie (unordered also g5e3), ordering `A4` p6 d2 (8 887 → 10 371),
  promotion-capture (262 → 232), `G1` (354 → 342), pvs-lmr `A4` ×2 (search() [19 → 4, b3f3]; chooseMove 0 re-searches),
  transposition knight-g1 ×2 (894 → 939), position-3 (1 325 → 1 377), `A5` (7 832 → 7 295; −488 → −485), quiescence `A4`
  (2 355 → 2 398) and `A5` oracle ×2 (70 → 8; 84 → 85). Base `src` with head's test files reds the same 16 plus the tie
  companion (d1b3) and the unedited deep literal `g4g5` row (base reads e2e4 on the new fixture); `evaluate.test.ts` does not
  load against base (no export), shown red instead by the base-values plant.
- **Oracle rule, re-run by QE** (plain node, no clock): `searchWithoutPruning(p, 3)` = `searchWithoutPvsOrReductions` =
  `search()`: kiwipete 8 / e2a6 (68 705 431 oracle nodes), position-6 85 / c3d5 (12 929 308). The moves are unchanged.
- **Re-finds bite:** `keepBestSoFar` reds engine `A3` "returns the completed depth-2 move" (plus two identity rows);
  `M11` reds the tie companion and `G1`; `N3` reds `G1` (347 ≠ 342); `M13` reds the 232 row (252) and five more.
- **Companion 1** (tie row literal g5e3 → a4b3): reads the re-found `TIE_FEN`; red under `M11` and `M13`. Not a weakening.
- **Companion 2** (transposition table-off pin 1 523 → 1 533): same row as the licensed position-3 re-pin (vitest stops at
  the row's first failing expect, so the probe saw one); score equality on/off unchanged. Not a weakening.
- **Companion 3** (pvs-lmr `search()` literal [19, b3f3] → [4, b3f3], fixture kept): `noLmrResearch`, `noResearch` and each
  search-only variant red it by the trace check; the discard-the-re-search plant reds it by score equality (0 against 4).
  The engine-only variants red the `chooseMove` row (−12 against −7). Not a weakening.
