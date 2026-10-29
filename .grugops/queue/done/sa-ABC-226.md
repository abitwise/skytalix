---
subtask: sa-ABC-226
role: system-analyst
ticket: ABC-226
ref: .grugops/context/sa-ABC-226/
branch: new grugops/sa-ABC-226 from main, worktree ../wt-sa-ABC-226
---

# ABC-226: records scan for the repetitions the search could not see (no games)

Work the ticket `plans/tickets/ABC-226-…` exactly: its scope, its acceptance (Given/When/Then) and its test notes.
It is a records-and-scan ticket: read the R/D PGNs already on main and use short offline scripts. No games, no
`rating.ts`, no `src/` edits. Read EPIC-010 and BA/PM `bapm-epic010-improvements/…12cb550d`, plus `sa-ideas-verify/…306a4012`
(item 3), for context.

## Fences
- Your worktree and scratchpad only. Records and scripts under your context folder. No `src/`, `data/` or `tools/`
  edits. Engine probes are single-process, under 5 min of CPU in total, only when `ps` shows no cutechess.
- Never push, force, amend or rebase. Never merge into main. No board edits. Linters only via `npm run …`. No host
  paths in records.

## Publish
- Seal notes (task `sa-ABC-226`) with `at` from `date -u`, answering each acceptance criterion. Commit on your branch.
- Write a dated result line into the ticket page on your branch, plus `## Result` and a 10-cell trace row into this
  brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, on `grugops/sa-ABC-226` (worktree `../wt-sa-ABC-226`, from main `b5df6cde`) at `1d30c2b2`. Not merged; nothing
pushed.** Records only: no game, no engine run, no `rating.ts`; the branch's `src`/`data`/`tools` equal main's. A dated
result line is on the ticket page on the branch.

- **Note (task `sa-ABC-226`, sealed; `admitAndAppend` was called directly because the `propose_note` tool was not
  surfaced, which is the same call the tool makes):** `20261029T202608Z-system-analyst-observation-cc53fc79`. It answers
  A1-A6 with the counts, the game lists and three hand-read games.
- **Scan:** `raw/scan.mts` replays every game with the repository's own move and key code (imported read-only).
  `raw/scan.txt` and `raw/scan.json` hold the output. One process, 3.7 s of CPU, byte-identical across two runs.
- **A1:** 14 PGNs, 4199 games read, 4199 parsed, 0 unparsed, 0 dropped. `a5` holds 99 games by its own summary.
- **A2:** 1718 threefold draws (R 35, D 1683). The first occurrence lies before the search root in all 1718 and inside
  the search in 0. That is by construction: the occurrences are 4 or more plies apart and the root is 1-2 plies back.
- **A3:** 461 drew from skytalix's own ≥ +100 cp (R 26, D 435); 889 if D's `base` is counted. In R, Stockfish's eval at
  the same move was ≥ +100 for skytalix in 4 of the 26 and 0.00 in 20.
- **A4:** 23 (5 lost, 18 drawn; 16 of the drawn ended by threefold anyway), R 0. 15 of the 23 are in the `ABC-209`
  readings.
- **A5:** 461 + 23 = 484 over all games, 26 + 0 = 26 over R games. **≥ 1, so `ABC-230` stays in milestone 1.** BA/PM
  makes no milestone-2 move. The ruling holds under every narrower reading (4 Stockfish-agreed R games; 5 A4 losses).
- **A6:** 22 (all D). They are exactly the 22 cutechess threefolds that the repository key counts only twice, so
  cutechess uses an ep-normalised key. This is information for Q3 only.
- **UNKNOWN - verify:**
  - whether the 20 R draws Stockfish called 0.00 were forced; probe: a single-position search with the repeating move
    excluded;
  - what the 311 completing searches that reported 0.00 mean;
  - the cause of the `ABC-209` concentration in A4.
- **Gates:** none run (records only). Biome's `files.includes` does not cover `.grugops/`.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-226 | Records scan: how often the R and D games repeated a position the search could not see, and whether it decided a result | EPIC-010 | — | none (records only; ADR-0049 d4 no host paths held) | grugops/sa-ABC-226 @ 1d30c2b2 (records only): .grugops/context/sa-ABC-226/notes/ (1) + raw/scan.mts, scan.txt, scan.json; ticket result line | scan over 14 PGNs: 4199/4199 parsed; 1718 threefold, 0 inside the search; A3 461 (R 26), A4 23 (R 0), A5 484 / R 26 → ABC-230 stays in milestone 1; A6 22; 3 games hand-read, agree; no gates run (records only) | — | — | done (records; not merged) |
