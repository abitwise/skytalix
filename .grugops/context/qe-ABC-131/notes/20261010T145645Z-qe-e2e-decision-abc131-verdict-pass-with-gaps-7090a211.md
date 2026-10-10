---
id: 20261010T145645Z-qe-e2e-decision-abc131-verdict-pass-with-gaps-7090a211
kind: decision
by: qe-e2e
at: 2026-10-10T14:56:45Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ADR-0034
  - ABC-084
  - ABC-127
  - ABC-126
  - RISK-003
  - QE-127-e
  - QE-126-b
  - branch:grugops/ABC-131-drop-edge-puzzles
  - commit:96f3168d
  - commit:f994c724
  - 20261010T145645Z-qe-e2e-observation-abc131-gap-register-5e358534
  - 20261010T145645Z-qe-e2e-observation-abc131-readings-margin-a4-07d83577
supersedes:
---

# `ABC-131` QE verdict: PASS_WITH_GAPS — `A1`–`A8` MET, one LOW closed by QE, two LOW open

Hand-authored, no seal (AGENTS.md: no `finding` is admissible on this install). Subtask `qe-ABC-131`,
Workflow 04 review exit. Reviewed the delivered tip `96f3168d` (code `51fb4ca9`) against base `679e847d`.
QE added one test-only commit, `f994c724` (+4 in `src/puzzle-suite.test.ts`, 0 production lines).

Every reading was QE's own: deep runs in `git archive` copies (QE's `raw-qe-run.sh.txt`), with load1
logged at the start and end of each. QE re-planted all 17 weakenings from QE-084's `M` table, read
verbatim. The engineer's raw files were used only as pointers and cross-checks.

| # | verdict | QE's evidence |
|---|---|---|
| `A1` | MET | `PUZZLES` has 58 rows (base 62), with 58 distinct names and no row for seeds 1982/1008/1424/1075. The `src/puzzle-corpus.ts` numstat is 1/4: exactly those four rows, plus one comment line. The `ABC-127` `A1` shape is 18 / mate-in-3 8 / quiet-key 11 / `depth≥5` 6 / `quiescence` 11. Default lane green |
| `A2` | MET | The baseline reads 54/58, budget 25, step 1. The `unsolved` block is byte-identical (sha1 `f5cdfb27` at base and tip). The `reason` quotes the owner verbatim (matches `…owner-word-adrs-91c4e7a0`). `51fb4ca9` touches only that file. In three processes: 54/58, exit 0, 18 passed, no NEWLY line, per-row sha1 `11326e1c` ×3 (load1 10.58 / 7.50 / 6.82) |
| `A3` | MET | Step 1.25 out of tree: 54/58, 0 NEWLY-MISSED, exit 0 (load1 5.23). That is 19 of 24 readings (0.792x). The first loss is at step 1.35 = 18 readings, on seeds 1, 69 and 1163 |
| `A4` | MET | **14/17 red; survivors red 7 of 10** (`W1`, `W1b`, `W2`, `W4`, `W5`, `W13`, `W16`); `W10`, `W11` and `W14` are green. All 17 missed-row sets equal the engineer's. `W9` is 44 against the recount's 45, and the extra miss is `ABC-126`'s re-authored `discovered check` row |
| `A5` | MET | The four headroom rows are MISSED at 1x. 4x (step 0.25 = 99 readings) reads 58/58 (load1 15.89). `ABC-084` `A1`/`A2` are green in every 1x run. `weakened` exits 1 at 15/58 |
| `A6` | MET | The row is green. Red first on misspelt, dropped-row and `solved`-53 mutants, each naming its fault. QE closed a hole (`QE-131-a`) inside the same row at `f994c724` |
| `A7` | MET | `src/` diff = the three named files, with no trigger-list file. At `f994c724`: lint, typecheck, build exit 0. `npm test` exit 0, 52 / 1608 (base 52 / 1608 too: +0 files, +0 rows; puzzle-suite default rows 12 = 12). Skip count 0, integrity `No findings.`, inventory 52/52 |
| `A8` | MET | Green on 16 win-material rows in all three `A2` processes. Red first: `M9` (`+4` → `+6`) gives `discovered check: the bishop moves, Rxd8: expected [ 6 ] to deeply equal [ 4 ]`. Also red on `+N` removed (`[]`), duplicated (`[4, 4]`) and lowered (`[3]`) |

**Verdict PASS_WITH_GAPS**: no criterion missed, and no gap blocks the merge. The gaps are in the register
note `…5e358534`. The UAT waiver does not apply: the range's non-test `src/` paths are
`src/puzzle-corpus.ts` and `src/puzzle-suite.baseline.json`, so **the owner's UAT word is owed**.
**Owed:** the Orchestrator's board move and the merge. The owner's UAT word. After merge, the
AGENTS.md Scribe updates the `PUZZLE_DEEP` comment, plus `QE-131-c`'s levels-lane figures.
