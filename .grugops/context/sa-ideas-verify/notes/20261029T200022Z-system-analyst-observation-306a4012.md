---
id: 20261029T200022Z-system-analyst-observation-306a4012
kind: observation
by: system-analyst
at: 2026-10-29T20:00:22Z
verified_by: 
confidence: high on every code and record row; UNKNOWN - verify on the play effects named in the last table
refs:
  - sa-ideas-verify
  - ideas-2026-10-29/input/owner-ideas.md
  - sa-ideas-verify/20261029T195803Z-system-analyst-observation-1ccf0010
  - EPIC-008
  - EPIC-004
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-205
  - ABC-206
  - ABC-207
  - ABC-209
  - ABC-210
  - ABC-215
  - ADR-0002
  - ADR-0020
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - ADR-0051
  - NFR-005
  - NFR-009
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - qe-epic008-q4c/20261029T192754Z-qe-e2e-decision-172ff9be
  - main 51c85f49 (src/data/tools = 3ad6bc10)
supersedes: 
seal: sha256:13804d775b8a10c9954d6e96737a3029cdc1eaaaa5f4375d0a3add92d28c30bb
---

# The owner's 10 external claims, verified one by one against main's code and the project's history

Read at `main` `51c85f49`. Its `src/`, `data/` and `tools/` equal `3ad6bc10`, the commit § B reviewed. The source
list is `ideas-2026-10-29/input/owner-ideas.md` § B. The time-behaviour map for item 4 is the sibling note
`20261029T195803Z-system-analyst-observation-1ccf0010`, and it is not repeated here. Probes: two scripts, single
positions, no games, about 41 s of CPU; raw files in `.grugops/context/sa-ideas-verify/raw/`.

Verdict words: **TRUE** (the code or record says so), **PARTLY** (true with a named exception), **FALSE**,
**ALREADY DONE** (main already has it), **ALREADY TRIED** (built and measured, not shipped). A proposal is not a
fact. Where a sub-claim is a proposal, the row gives its status and the constraints on it, not a verdict on its merit.

## The table

| # | Sub-claim | Verdict | Evidence at main | History and constraints |
|---|---|---|---|---|
| 1a | Quiescence (`src/quiescence.ts` ~L91) stands pat, then searches captures | TRUE | `src/quiescence.ts:91-127`; stand pat `:100-101`; captures only `:108` | `ABC-079`; `ADR-0024` |
| 1b | It stands pat when the side to move is in check | TRUE | no in-check test in `quiesce`; `:100-101` is unconditional. Probe Q2 (black in check, no capture, only quiet king evasions): `quiesce` = static = −548 | The full-width search also has no check extension: `remaining <= 0` goes to the leaf in check (`src/engine.ts:292-293`). **ALREADY TRIED in one form:** `ABC-210` form (a), +1 ply in check at the horizon, closed unmerged under S1, D NEUTRAL −4.8 ± 16.2 over 800 games. `ADR-0051` accepted, not in force. In-check evasions INSIDE quiescence were never built |
| 1c | No terminal (mate/stalemate) detection inside quiescence | PARTLY | TRUE at capture ply ≥ 1: header `:23-24` says so, by decision. Probe Q1 (Qxf7 is mate): `quiesce` = 78, not a mate score. **But** the leaf itself (ply 0) is checked first by `leafEndReason` (`src/engine.ts:262-264`, `src/gameend.ts:184-189`), so the full-width search sees the same mate one ply deeper: Q1 `chooseMove` 300 ms = 29 999 | Recorded decision of `ABC-079` (`src/quiescence.ts:21-24`) |
| 1d | Quiet promotions are excluded | TRUE | `legalCaptures` keeps `captured !== EMPTY` only (`src/legal.ts:90-103`); a capturing promotion is kept. Probe Q3 (a7-a8 free): `quiesce` = static = 212; `chooseMove` sees it (1 033) | Fence: `ADR-0024` decision 4 ("still out of scope: delta pruning, SEE, checks in quiescence, quiet promotions") |
| 1e | Proposal: evasions in check, terminal detection, quiet promotions, bounded, cost measured | proposal | — | Reverses `ABC-079`'s recorded decision and `ADR-0024` d4: an ADR is owed. Values change, so `ADR-0026` d10 applies (test-only off-door pair, bounded oracle). The "dedicated positions" can use `ABC-084`'s puzzle suite. **Effect on play: UNKNOWN - verify.** It needs a D and an R reading; `ABC-210`'s NEUTRAL is the nearest prior evidence |
| 2a | Main beat `3497aad2` in a direct 1.5 s match | TRUE | QE `qe-epic008-q4c` `…172ff9be`: 100-game look +52.5 ± 46.8, information only, not graded. The Architect's replication: +54.0 ± 33.3 (`arch-epic008-rd/…0c5d62f4`) | — |
| 2b | Main scored lower against limited-strength Stockfish at 3 s | TRUE | EPIC-008 `M1` NOT MET: −82.9 ± 73.8 (R at 3 000 ms against Stockfish 19, E = 1 910) | — |
| 2c | Proposal: paired openings | ALREADY DONE | `tools/rating/rating.ts` passes `-openings … order=sequential -repeat` and `-games 2`: each opening is played with both colours | `ABC-204` |
| 2d | Proposal: candidate and baseline both against the same outside opponent | PARTLY ALREADY DONE | Done at epic level: `M1` read R at the start and at the close against the same Stockfish setting. Not done per ticket: S1 and S3 shipped on D (self-play) alone | `arch-epic008-rd` (merged `ff459d6c`) names this as the method gap and proposes a three-sha R gauntlet; it is with the owner |
| 2e | Proposal: matching clocks | PARTLY | R gives skytalix `st=3` and Stockfish `st=0.5` (`rating.ts:383`, `:394`); E is calibrated at that pairing. D gives both sides the same `st` | The Architect ranks time per move third and inseparable from opponent dependence on the records |
| 3a | Search detects repetition only inside its own path | TRUE | `repeatsInPath` scans the per-ply key array only (`src/search.ts:129-138`); `keys[0]` is the root's key (`src/engine.ts:549`) | `ADR-0002` clause 3; `ABC-081` `A5` |
| 3b | Search does not receive the game's earlier positions | TRUE | `src/engine.ts:61-62` ("The session's history is not read"); both seams pass `history.position` only (`src/engine.ts:604`, `src/level-seam.ts:17`) | **Note:** `ADR-0002` clause 3 says the per-ply array is "seeded once per search from the history module". The code seeds the root key only. Seeding earlier keys fits that clause; `ABC-081` `A6` forbids importing `src/history.ts` into the search, so keys would be handed in. `KEY_ARRAY_CAPACITY` 128 bounds the array (`src/search.ts:121`). Never tried |
| 3c | The UCI parser applies the moves and keeps only the final position (`src/uci-session.ts` ~L119) | TRUE | `parsePosition` replays the moves with `makeMove` and returns the `Position` (`src/uci-session.ts:119-141`); the session holds one `Position` (`:267`, `:374-381`) | `ADR-0044` D3 |
| 3d | `src/zobrist.ts` (~L9) counts some repetitions late through the en-passant key | TRUE | `src/zobrist.ts:9-17`: a position that carries an uncapturable ep square hashes differently, so a repetition is counted one occurrence late. A draw is deferred, never falsely declared | **Owner's ruling:** `ADR-0020` Decision 2 (2026-09-19), superseding `ADR-0005` clause 1. Its reconsider trigger (a) names the remedy: normalise `epSquare` upstream in `apply.ts`, not change the key. "Revisit" re-opens an owner ruling |
| 3e | A bare FEN cannot supply history | TRUE | A FEN carries the halfmove clock, not earlier positions | — |
| 3f | Proposal: repetitions handled via CLI and UCI | proposal | The CLI's game-end threefold is decided outside the search, by `src/history.ts` and `gameStatus` | **How often it costs games: UNKNOWN - verify.** Probe (records only, no games): scan the R and D PGNs for games drawn by repetition from a won score, or lost after avoiding one |
| 4a | UCI time is capped by the level: 3 s at level 5, 30 s at level 7 | TRUE | `src/uci-session.ts:287`; `src/levels.ts:54`, `:56`; probe P2 | `ADR-0044` D4.2; `ADR-0045` A4 |
| 4b | A 32 s engine ceiling | TRUE | `HARD_CEILING_MS` `src/engine.ts:141`, enforced `:539` | `NFR-004` per level; `ABC-212` |
| 4c | So the engine cannot spend more of a 40/15 clock on a critical move | PARTLY | TRUE that no move exceeds 30 s at level 7, and nothing marks a move as critical: every move spends its whole budget. **But** the clock is honoured below the cap: under 40/15 with `movestogo`, level 7 already spends `t/m` = 22.5 s a move (probe P1) | See the time note § 7 |
| 4d | UCI ignores `wtime`/`btime`/`movestogo` beyond the level cap | TRUE | honoured below it, cut at it (`src/uci-session.ts:215-225`, `:287`) | — |
| 4e | Success: no time forfeits on long clocks | UNKNOWN - verify | Last move before a control: budget `t − 50` (probe P4: 1 950 of 2 000 ms, wall 1 953) | Needs a long-clock match; this task may not run one |
| 5a | The king PST is untapered and favours shelter all game | TRUE | `src/evaluate.ts:59` ("No tapering"), `KING_TABLE` `:131-145` (b1/g1 = 0, centre −20 to −50 on every rank), `:134` ("Untapered"); king safety too (`:217`) | `ABC-083` § Out of scope ("untapered by decision") |
| 5b | Passed pawns and rook activity are not phase-dependent | TRUE | `PASSED_PAWN_BONUS` by rank only (`:187`); rook: 7th-rank bonus (`:105-108`) plus mobility | — |
| 5c | `ABC-205` (king safety, taper) closed unmerged after a regression gate | TRUE | Closed 2026-10-25 under S1 because `G6` "≥ base" (`NFR-005` depth) missed on `position-6`; D was not run. Code kept on `grugops/ABC-205-final` | It failed on depth (cost), not on a playing measure. `G6` "≥ base" is graded on the owner's word (2026-10-26). `ADR-0031` addendum accepted, not shipped |
| 6a | Hash move, captures, promotions and killers already come first | TRUE | `orderKey` / `orderMoves` `src/search.ts:172-197`: hash, then captures and promotions by MVV-LVA, then two killers, then generation order | `ABC-080`; `ADR-0024` d2 |
| 6b | No history heuristic for quiet moves | TRUE | killers only, one table per move (`src/search.ts:151-170`) | Never tried. `ABC-080` `A6`: nothing learned in one search is offered in the next |
| 6c | No SEE | TRUE | none in `src/` | Fenced by `ADR-0024` d4. Its SEE-lite column reopens the fence if `ABC-084` shows losses to defended-square captures. **Constraint for 6b and 6c:** order changes the VALUE here, because late-move reduction depends on the move's index (`src/search.ts:276`), so `ADR-0026` d10 applies |
| 7a | 0x88 board | TRUE | `ADR-0001` | — |
| 7b | Legality by make/unmake | TRUE | `legalMoves` `src/legal.ts:48-61` | `ADR-0003` (names pseudo-legal search (c1) and lazy legality (c2) as the alternatives) |
| 7c | The evaluator walks the board | TRUE | 64-square walk plus a mobility scan per non-pawn piece (`src/evaluate.ts:368-385`) | — |
| 7d | Direct tactical-move generation for quiescence | PARTLY ALREADY DONE | `ABC-206` (merged `0a9390e5`, value-identical): only captures pay the legality test. Generation still builds every pseudo-legal move first (`src/legal.ts:94-95`) | `ABC-206` shipped under S2; its D was waived |
| 7e | Incremental material/PST | TRUE (absent) | the score is recomputed per call (`src/evaluate.ts:361-401`) | — |
| 7f | Temporary allocations in ordering | TRUE | `orderMoves` builds an object per move, sorts and maps (`src/search.ts:193-196`) | — |
| 7g | Measure on the owner's HX 370 host | TRUE | the current host's `machine.txt` (`qe-epic008-q4c/raw/d/`) | EPIC-008's lesson: the close searched about 1 ply deeper and still scored lower in R |
| 8a | `ABC-207` (mobility, early queen) measured about −18.3 ± 16.5 over 800 games | TRUE | EPIC-008 page, `bapm-s1-ABC-207` | Closed unmerged under S1 |
| 8b | Weights are not tuned offline today | TRUE | every table is written from a stated rule (`src/evaluate.ts:52-145`); `ABC-215` re-derived the values by rule and says they are hand-picked, not tuned | Never tried. `ADR-0048` / `ABC-215`: the values are now the project's own, so any training data needs its licence recorded. The Architect's finding that self-play gains did not transfer bears on tuning by self-play |
| 9a | TT is 4 MiB | TRUE | `src/transposition.ts:11-15`, `:41-45` (2^18 × 16 B) | `ADR-0025` d2; `NFR-009` 16 MiB total; 2^19 fits, 2^20 is a re-level (owner's licence up to 128 MiB on a measured need) |
| 9b | Always-replace | TRUE | `:22-26`, `:135-147` | `ADR-0025` falsifier `T2` is the measurement that would change it |
| 9c | Cutoffs only at exactly the stored depth | TRUE | `tableCutoff` `:149-162` (`entryDepth(slot) !== depth`) | By rule: `ABC-081` `A1`, "the table changes the work, never the value". Using deeper entries changes values: that rule is revised and `ADR-0026` d10 applies |
| 9d | TT kept across a game was tested, +8.7 ± 18.3 over 800 games | TRUE | `ABC-209` closed unmerged under S1 (NEUTRAL) | **ALREADY TRIED.** `ADR-0025` d4 amendment accepted, not in force |
| 9e | No aspiration windows | TRUE | the root searches a full window (`src/engine.ts:436-458`); header `:79-80` ("aspiration windows … none requested") | Never tried |
| 10a | Syzygy gives exact results in supported endgames | TRUE (general fact, not a code claim) | none in `src/` | **Permanent non-goal:** `EPIC-004` § Out of scope ("Endgame tablebases — permanent non-goal"); `ABC-093` § Out of scope. Reopening it is the owner's call. The package has 0 runtime dependencies today. Distribution is a git clone (`ADR-0018`, `ADR-0049`) |

## Cross-cutting facts a ticket cutter needs

- **Shared constraint for value-changing items (1, 3, 5, 6, 8, 9):** `ADR-0026` d10 (a test-only off-door pair, a bounded oracle).
- **Measurement.** EPIC-008 shipped on D (self-play at 1.5 s) and its R fell (−82.9 ± 73.8). The Architect's first-ranked
  explanation is that the shipped changes did not transfer to an outside opponent (`arch-epic008-rd/…0c5d62f4`). Every
  item above that claims a strength gain inherits that question.
- **INFO, not decided here:** `EPIC-004` § Out of scope still says "Strength above ~1700 — … permanent non-goal".
  EPIC-008 went past it on the owner's word. A new strength epic should cite that word or have the line amended.
- **§ B's line references hold.** `src/quiescence.ts` ~L91, `src/engine.ts` ~L57, `src/uci-session.ts` ~L119,
  `src/zobrist.ts` ~L9 and `src/transposition.ts` ~L11 each land on the code or header they describe.

## Claims code alone cannot settle, and the probe each needs

| Claim | Probe (none run here beyond the ones above) |
|---|---|
| 1: the quiescence gaps cost games | a D and an R reading of a built change (a match, not this task) |
| 3: missing game history costs games | records scan of the R and D PGNs for repetition draws from a won score (no games) |
| 4e: no forfeits under a 40/15 clock | a long-clock cutechess match; also whether cutechess sends `movestogo` for `tc=40/900` |
| 6, 7, 9: work saved per node or per depth | `NFR-005` `G6`-style depth reading at 3 s on `kiwipete` and `position-6`, base against head |
