---
subtask: ticket-to-pr-ABC-215
role: software-engineer
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/ticket-to-pr-ABC-215/
branch: new grugops/ABC-215 from main, worktree ../wt-ABC-215
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-215: rule-made evaluation values (c2); carve-out ends

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` (Architect `arch-design-ABC-215/…e04234f4`, `…cbbb9a63`) and the amended A8/A8a (BA/PM `bapm-amend-ABC-215/…fb4f7c9c`): the seven arrays by their rules, the one TEST-ONLY export, the A2 rebuild rows in `src/evaluate.test.ts`, `NOTICE` lines 7–15 removed, the `src/evaluate.ts` header carve-out replaced by one line, the README licence sentence per A8a.
- Pins: only the 16 rows in 5 files the ruling names, each by its stated route (9 re-pins, 5 re-finds under ADR-0028 d2, 2 by the oracle rule). Any other row that moves → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the design's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows; filter real-clock rows out by name as the Architect did), PUZZLE_DEEP. No real-clock timing.

## Fences
- Only the files A8 lists, your worktree and `<scratchpad>/se215/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-215). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Delivered to the ruling. Three companion edits are flagged below for QE and Architect/Design. No relation, level or bound moved.**
- Branch `grugops/ABC-215` in `../wt-ABC-215`, with its own `npm ci --ignore-scripts`, from `main` `ec9331e2`.
- Code `c8fc3075`. Tip **`b778ab13`** (notes). Not pushed, not merged.
- Plants ran on scratch copies under `<scratchpad>/se215/`. None of them touched `src/`.

| criterion | at the tip |
|---|---|
| A1 | at base: `NOTICE` 1, `See NOTICE` 1 |
| A2 | 7 arrays = the ruling's `c2` literals, under a `// Rule:` comment each. One TEST-ONLY export, `VALUE_TABLES_FOR_TEST`. 15 rows appended to `src/evaluate.test.ts`: keys 1, rebuild 7 (independent rule code, every entry), differ-from-base 7. Red-first: 14/15 red at base values. Plants: knight a8 +1, king g1 +1 and `PIECE_VALUE` N +1 each turn exactly their rebuild row red. Cells differing from base: 2/7, 46, 64, 18, 20, 27, 50 (the same as the ruling) |
| A3 | `michniewski\|by-sa\|chessprogramming` count 0 in each of `src/evaluate.ts`, `NOTICE` and `README.md`. `NOTICE` is `cmp`-equal to `ABC-214` Scope 5's common part, with 0 `@`, 0 `/Users/` and 0 non-ASCII. The `LICENSE` and `package*.json` diff is empty |
| A4 | every relation row is green and unedited. `search.qe.test.ts` is untouched |
| A5 | the ruling's 16 rows in 5 files (13 in the default lane + 3 deep), each by its route: 9 re-pins, 5 re-finds (`ADR-0028` d2), 2 by the oracle (oracle re-run: kiwipete 8 / e2a6, position-6 85 / c3d5, equal on all three searches). **Flagged companions:** (1) the ordering-tie engine row's literal g5e3 → a4b3 moves with the re-found `TIE_FEN`. It was not red; (2) the transposition position-3 row's table-off pin 1 523 → 1 533 (same row); (3) `pvs-lmr` `A4` splits `A4_FEN` (chooseMove, re-found: Rb3 Rc5) from `A4_SEARCH_FEN` (kept: Rb3 Rd5, literal 19 → 4). The `N3`, `M13`, `M11`, `keepBestSoFar`, `noLmrResearch` and `noResearch` plants (each also per recursion) turn their rows red |
| A6 (SE part) | lint, typecheck and build rc 0. `npm test` 62 files, **2 090 / 2 090**. `last-run.json` success, 0 failed, 0 pending, 0 todo, **Duration 7.18 s** (base 7.40 s; not a reading). Skips: `No findings.` Lane inventory: 62 = 62. Deep lanes, real-clock rows filtered by name: PUZZLE 54/58 (baseline 54/58); SEARCH_DEEP search, ordering, transposition, quiescence and pvs-lmr all green; ENGINE_DEEP engine 54 green + 6 filtered, levels 37 green + 4 filtered. G2, G5, G6, G8, G9 and G11 are QE's |
| Test note 6 | frozen-clock nodes, base → head: kiwipete d7 566 233 → 609 900, d8 1 638 196 → 1 735 339; position-6 d7 644 469 → 586 333, **d8 1 451 759 → 1 355 149**. These equal the design's counts. Reported, not graded |
| A8 / A8a | changed files: `NOTICE`, `README.md`, `src/evaluate.ts` and 6 `src/*.test.ts`. The `tools`, `data`, `src/levels.ts` and `src/status-panel.ts` diff is empty. `README.md` diff is one hunk `@@ -85,2 +85 @@`; the file is 87 lines with 8 headings, and the kit-files line appears once |

Notes are sealed via `admitAndAppend` (`contextRoot` = the worktree's `.grugops/context`) and read back 3/3, in `../wt-ABC-215/.grugops/context/ticket-to-pr-ABC-215/notes/`: decision `…3c66f0d7` (values, export, Scope 3), decision `…cfb55b57` (moved pins and companions), observation `…c43e10a0` (plants, counts, gates).

### Trace row
| ABC-215 (ticket-to-pr-ABC-215) | the evaluation values made by stated rules (c2); the CC BY-SA 3.0 carve-out leaves NOTICE, the evaluate.ts header and the README sentence | EPIC-008 | — | no ADR (ADR-0048 d7); no bound moved; NFR-005/G6 predicted MET by frozen-clock counts (UNKNOWN - verify) | grugops/ABC-215 @ b778ab13 (code c8fc3075)<br>src/evaluate.ts, NOTICE, README.md; src/evaluate.test.ts (+15 A2 rows), engine, search.ordering, search.pvs-lmr, transposition, quiescence tests (16 ruled rows + 3 flagged companions); .grugops/context/ticket-to-pr-ABC-215/notes/ (3) | A2 red-first 14/15; cell plants 1 red each; N3/M13/M11/keepBestSoFar/noLmrResearch/noResearch bite; npm test 62/2090; deep lanes green (real-clock filtered); PUZZLE 54/58; skips 0, No findings. | owed: QE verdict signs (owner delegation 2026-10-22) | — | In Development → In Review (QE: G2/G5/G6/G8/G9/G11, D/S3, the three companions) |
