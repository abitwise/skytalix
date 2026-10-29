---
id: ABC-226
title: "Records scan: how often the R and D games repeated a position the search could not see, and whether it decided a result"
status: ready
column: Ready
size: S
priority: P2
epic: EPIC-010
---

# ABC-226: records scan for repetitions the search could not see

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 3's
> play effect is `UNKNOWN - verify` (SA `…306a4012` row 3f); this is the SA's named probe: "records scan of the R and D
> PGNs for repetition draws from a won score, or lost after avoiding one (no games)". No code, no games.

> **Result 2026-10-29 (SA, task `sa-ABC-226`, records only, at `main` `b5df6cde`):** acceptance answered in note
> `sa-ABC-226/20261029T202608Z-system-analyst-observation-cc53fc79`.
> - A1: 4199 of 4199 games parsed across the 14 PGNs, 0 dropped.
> - A2: 1718 threefold draws (R 35); 1718 before the root, 0 inside (by construction).
> - A3: 461 (R 26; Stockfish agrees ≥ +100 in 4 of the 26).
> - A4: 23 (5 lost, 18 drawn), R 0.
> - A5: 484 over all games and 26 over R games, so **`ABC-230` stays in milestone 1**.
> - A6: 22 repetitions an ep-normalised key counts one occurrence earlier; cutechess uses that key.
>
> Script and output: `.grugops/context/sa-ABC-226/raw/`.

## Problem

- **User:** the owner, and BA/PM ordering `EPIC-010`.
- **Pain:** the search sees repetitions only inside its own path (SA 3a–3b), so at the root it cannot know that a
  move repeats a position the game already holds. Whether that ever cost a game is unknown. `ABC-230` would fix it at
  M size and a full reading under Q4.
- **Value:** a count, from games already played, that sets `ABC-230`'s priority before anyone spends ≈ 10–27 h of
  host time measuring it.

## Scope

1. The 14 reading PGNs committed under `.grugops/context/`: R `qe-ABC-204/raw/a4-e1910-baseline`, `a4-e1650`,
   `qe-epic008-close/raw/r1`, `r2`; D `qe-ABC-204/raw/a5`, `qe-ABC-207/raw/d1`, `d2`, `qe-ABC-208/raw/d1`,
   `qe-ABC-209/raw/d1`, `d2`, `qe-ABC-210/raw/d1`, `d2`, `qe-ABC-215/raw/d1`, `qe-epic008-q4c/raw/d`.
2. A scan script in the task's `raw/` folder (it may import `src/` modules read-only to replay moves and hash
   positions; it edits nothing under `src/`, `data/` or `tools/`).
3. One observation note with the counts and the game list.

## Out of scope

- Any game, any engine change, any `src/` edit. The en-passant key question (`ADR-0020` d2, owner Q3): the scan uses
  the repository's own key, and reports separately how many repetitions an ep-normalised key would add.

## Acceptance criteria

- **A1 (coverage).** **Given** the 14 PGNs, **then** the note reports, per PGN, the games read and the games parsed;
  any unparsed game is named with its reason. 0 games silently dropped.
- **A2 (draws by repetition).** **Then** per PGN it reports the number of games ending by threefold repetition, and
  for each such game whether the first occurrence of the repeated position lies **before the root** of the
  `skytalix` search that completed the repetition (a repetition the search could not see) or inside it.
- **A3 (from a won score).** **Then** it counts the repetition draws of A2 in which `skytalix`'s own last reported
  eval before the repetition was **≥ +100 cp** for itself; in R games it also reports Stockfish's eval at the same move.
- **A4 (after avoiding one).** **Then** it counts the games `skytalix` lost (or drew from ≤ −100 cp) after a move at
  which a legal move would have completed a threefold repetition from game history, with its eval **≤ −100 cp**, and
  it played another move.
- **A5 (the ruling it feeds).** **Then** the note states the total of A3 + A4 over all games and over R games alone.
  **If the total is ≥ 1, `ABC-230` stays in milestone 1; if it is 0, BA/PM moves it to milestone 2 at P3** (a dated
  line on `EPIC-010`).
- **A6 (ep).** **Then** it reports how many A2 repetitions an ep-normalised key would have counted one occurrence
  earlier (information for Q3; graded nothing).

## NFR triggers

- None: no code, no runtime path. CPU: minutes, single process; not run during an ALONE reading.
- **Security:** reads committed records only; no host paths or usernames in the note (`ADR-0049` d4).

## Test notes

1. The scan is checked against two hand-read games: one D game that ends by repetition and one R game that does not.
2. The script and its output are committed under the task's `raw/`. No UAT (no production line changes).

## Size and priority

- **Size: S.** One script and one note; PGN parsing exists in `src/pgn.ts`-adjacent code and in earlier QE scripts.
- **Priority: P2.** It orders milestone 1 at no game cost.

## Dependencies

- None. Routed by the Orchestrator to QE/E2E or the System Analyst.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA row 3f's open play effect |
| 2 | scope and out-of-scope | ✅ 14 PGNs listed; no games, no code |
| 3 | INVEST | ✅ independent; S; testable |
| 4 | testable, measurable acceptance | ✅ A1–A6, counts and thresholds |
| 5 | dependencies known | ✅ none |
| 6 | NFR triggers with targets | ✅ none apply; stated |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10. Ready.**
