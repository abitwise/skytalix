# qe-ABC-279 PREREG, sealed before any game: C2′ 100 games at 100 ms against the merge-base, GAIN ≥ 50.0 / 100; S′ 10 games at 0.5 s against Stockfish E 1 810; the Levels deep lane. The bars are the ticket's and `ADR-0069` d13's as written, copied here, none loosened. A miss is final: no re-play, no margin, no form change

QE/E2E, task `qe-ABC-279`, worktree `.claude/worktrees/se-ABC-279`, branch `grugops/ABC-279`. Written before any game, any S′ game or any Levels run. This note adds nothing to the bars. It fixes the builds, the commands, the order and what is reported.

## Builds
- **Candidate:** `grugops/ABC-279` `1feb7560`, the Engineer's frozen commit. Its `src/` tree is `fe6a0975`. The production files equal `cd9ccd10`'s, and only test files moved between the two. The branch tip `d00d00a8` adds records only, with the same `src/` tree.
- **Base:** the merge-base `00e99db8` (`git merge-base grugops/ABC-279 main`). Its `src/` tree is `4cb84035`, which is also `main` `31c8cac4`'s `src/` tree. `main` has moved since the merge-base by records only, so the candidate is not re-based: its `src/` is what would merge.
- The harness is `tools/rating/` at this worktree's tip (no diff against `main`). `CUTECHESS_CLI` and `STOCKFISH` are set from the host's tools file (QE-269-j); the harness checks both pins.

## Bars, as written (ticket `ABC-279` A6; `ADR-0069` d13; `ADR-0056` C2′ / S′)
- **C2′:** `node tools/rating/rating.ts d 1feb7560 00e99db8 <out> --budget-ms 100 --rounds 50 --concurrency 1`, the host ALONE (the whole match in ONE `flock`). **MET on 100 of 100 complete, 0 candidate faults, 0 losses on time at the 50 ms margin, and ≥ 50.0 of 100.** Intent GAIN. NEUTRAL is closed, and the harness's `state:` label is not the verdict. A miss is NOT MET and is not re-played.
- **S′:** `node tools/rating/rating.ts r 1feb7560 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`, `timemargin` 50 ms, the host ALONE (one `flock`). **MET on 10 of 10 complete, 0 faults, 0 losses on time, and S-4 ≥ 3.0 of 10.** Below 3.0, exactly 10 more games, written now as the same command with `--rounds 5` into a fresh out dir, and **≥ 7.0 of 20** pooled. Pooled into the epic only if the ticket merges.
- **Levels:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose` on the candidate's tree, the host ALONE: **exit 0, every test passed.** QE counts its own run.
- **F5:** C2′ below 50.0 of 100, or an S′ collapse (below 3.0 of 10 and then below 7.0 of 20), or a red Levels lane: not merged; `ADR-0069` reads "accepted, not in force".
- **Reported, not graded:** W/L/D, score, `cutechess-cli`'s Elo ± error, by colour, terminations, and `G11` (the five game-1 positions at each build's `LEVELS[5]` 4 000 ms, base then head, one run each).

## Order and discipline
- C2′, then S′, then Levels. Each runs alone under `flock <scratch>/host-test.lock`, with `uptime` at start and end.
- Forecast: C2′ about 25 min (`qe-ABC-269` B8 took 24 min); S′ about 6 min; Levels about 10 min. Any single run forecast over 1 h: stop and ask.
- No re-play of a miss, no game beyond S′'s written second ten, and no dropped game. A harness or launch error before the first game is not a read: it is recorded and the same command is run once more.

## Offline re-grades in this hop (graded by the ticket's bars, as written)
- **A1:** the default lane of `src/see.test.ts`, plus an independent hand check of the losing-test truth table. A1 (b)'s wording ("on a board where SEE alone would call the capture losing") is ruled as a gap, never as a moved bar.
- **A2 / `G4`:** out of tree, base tree against head tree, on the `ABC-078` `A3` corpus (the endgames and their children, and the six roots and their children with the `position-3` top-up). Head `searchWithoutSeePruning` against base `search()`, and head `chooseMoveWithoutSeePruning` against base `chooseMove`, on move, score and nodes. Every older door against its base self. The export lists (+1 / +1 / 3).
- **A3 / A4 (a), (b):** the committed `SEARCH_DEEP=1` rows of `src/see.test.ts`.
- **A4 (c) `G6` / `NFR-005`:** re-read ALONE, `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs` unchanged: 5 interleaved rounds per board per build at `LEVELS[5]` 4 000 ms. Any run below depth 6 FAILs, depth 7 is a WARN, "≥ base" is graded by the median.
- **A4 (d) `G2`:** byte identity of `src/evaluate.ts` and `src/evaluate-params.ts`.
- **A5 `G1`:** `PUZZLE_DEEP=1` lane.
- **The rows moved:** each re-pointed or re-pinned row read against the pin / bar rule (`orch-2026-10-30a` `…42c82347`). No zugzwang, mate floor, `G1` or relation row may be re-pinned.
- **Scope:** the edits to `src/quiescence.ts` and `src/engine.ts` touch the seam only (the Orchestrator's ruling in the brief).
- **`N8-LANE` (`NFR-008` 10 s):** `npm test` on base and head, 5 interleaved runs each, ALONE. Reported against the bound; a base breach is recorded as pre-existing.
