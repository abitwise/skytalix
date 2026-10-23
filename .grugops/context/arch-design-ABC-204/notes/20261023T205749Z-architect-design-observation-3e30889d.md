---
id: 20261023T205749Z-architect-design-observation-3e30889d
kind: observation
by: architect-design
at: 2026-10-23T20:57:49Z
verified_by: 
confidence: high (each probe run by Architect/Design on 2026-10-23 in the session scratchpad; outputs read; host not quiet, so no figure is a reading)
refs:
  - ABC-204
  - EPIC-008
  - ABC-202
  - NFR-004
  - NFR-008
  - NFR-012
  - AR-NFR004-A
  - ADR-0044
  - ADR-0023
  - ADR-0037
  - ADR-0036
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - 20261023T203657Z-ba-pm-observation-81e021ac
  - 20261023T203717Z-ba-pm-decision-8c3b2f47
  - 20261023T195538Z-orchestrator-decision-3898cd9a
  - grugops/arch-design-ABC-204
supersedes: 
seal: sha256:f076fd643f8f20e377a8f079208de417fb12fde47d267b61e0cf9c86b8a6d244
---

# What Architect/Design read and probed for ABC-204's five questions (records plus light probes, at `main` `36a4902e`)

The host was not quiet throughout: battery power, thermal 2, load1 6.4–9.3, and a foreign `vitest` from another repository. So no figure here is a reading. Probes ran in the session scratchpad `design204/` only. Nothing in `main`'s checkout or in `src/` was touched.

1. **Machine and tools.**
   - Apple M3 (`hw.perflevel0` 4 performance cores, `hw.perflevel1` 4 efficiency cores), 16 GiB, Darwin 25.6.0, macOS 26.7.1, `node` v26.11.1.
   - `cutechess-cli` 1.5.1, sha256 `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c`.
   - Stockfish 19 (`id name Stockfish 19`), sha256 `dc2f18c34ae962dff591b66147d220ec06e61d756b93d8a4f5e04fd8e55c251f`.
   - Both equal `EPIC-008` § Dependencies.
2. **The probe build.** `qe202/clone` at `e5c5c2a5`, `dist/uci.js` sha256 `877e9595746aead5019a2e604da2ef0021e2d688168b275d809e572fe8a9b98d`. `git diff --stat e5c5c2a5 36a4902e -- src data package.json tsconfig.build.json` is empty.
3. **Stockfish options** (`probe/sf-probe.out`, sha256 `91a1471a…8883`).
   - `UCI_Elo` spin, default 1320, min 1320, max 3190. `Threads` default 1. `Hash` default 16. `Move Overhead` default 10. `Ponder` default false. `MultiPV` default 1. `Skill Level` default 20.
   - At `UCI_LimitStrength true`, `UCI_Elo 1650` and `go movetime 250` after 1.e4 e5 2.Nf3, depth 3 completed at 4 ms and depth 12 at 250 ms.
4. **Stockfish 19 source** (tag `sf_19`; `search.cpp` sha256 `a934524d…1339`, `search.h` sha256 `06a93396…8071`).
   - With a skill limit, `pick_best` runs when the root depth equals 1 + int(level) (`search.cpp:557-559`, `search.h:268`). The final move is `skill.best` when it is set (`search.cpp:625-628`).
   - level = clamp(((37.2473e − 40.8525)e + 22.2943)e − 0.311438, 0, 19), with e = (E − 1320) / 1870 (`search.h:261-262`). E 1650 gives 2.56, so depth 3. E 2000 gives 4.19, so depth 5.
   - The `search.h` comment reads: "Skill 0 .. 19 now covers CCRL Blitz Elo from 1320 to 3190, approximately", fitted against Stash.
5. **The `UCI_Elo` calibration.** Stockfish commit `a08b8d4e9711c20acedbfe17d618c3c384b339ec` (J. VandeVondele, committed 2023-01-22) changed the README line:
   - from "calibrated at a time control of 60s+0.6s and anchored to CCRL 40/4";
   - to "calibrated at a time control of 120s+1.0s and anchored to +- 100 Elo to CCRL Blitz".
   - Read through the GitHub API. `sf_19`'s README no longer carries the line.
6. **The `cutechess-cli` source at `5e84232b`.**
   - `st` sends `go movetime <timeLeft>` (`uciengine.cpp:273-274`).
   - A move expires when `lastMoveTime > timeLeft + expiryMargin` (`timecontrol.cpp:362-363`). `timemargin` is an engine option (`main.cpp:189-198`).
   - `addEval` adjudicates on each engine's own score (`gameadjudicator.cpp:75-152`).
   - Sequential EPD order rewinds at the end (`openingsuite.cpp:163-166`).
   - A bare `-repeat` means 2 (`main.cpp:596-601`).
7. **The 2-game cutechess probe** (`probe/run-probe.sh` sha256 `30c7ad12…7cf0`, `probe.out` `d236736d…f93c`, `probe.pgn` `61771ad2…315c`).
   - Setup: one Ruy Lopez EPD after 3...a6, `-repeat -games 2`, `skytalix` `st=3 timemargin=2000 restart=on`, and Stockfish `st=0.5 timemargin=2000 restart=on Threads=1 Hash=16 UCI_LimitStrength=true UCI_Elo=1650`, `-maxmoves 200`, `-debug all`. Run 20:47:56–20:53:43Z, rc 0.
   - The first `go` was `go movetime 3000` for `skytalix` and `go movetime 500` for Stockfish.
   - `cutechess-cli` sent Stockfish `setoption` for Hash, Threads, UCI_Elo and UCI_LimitStrength, plus `Ponder value false` of its own. It sent `skytalix` 0 `setoption` lines.
   - `skytalix` `go`→`bestmove`: n 99, median 3 004 ms, max 3 028 ms, 90 over 3 000 ms, 0 over 3 031 ms. Stockfish: n 98, median 501 ms, max 515 ms.
   - Game 1: `skytalix` White, 1-0 {White mates}, 61 plies, 101.6 s. Game 2: `skytalix` Black, 0-1 {Black mates}, 136 plies, 237.9 s.
   - 0 forfeits, 0 illegal moves, 0 disconnects. Both `stderr` files are 0 bytes. A fresh Stockfish process was started for game 2 (`restart=on`).
   - All 97 of `skytalix`'s `info depth` lines carry a `score`. Its depth is 5–7 at 3 s.
   - Stockfish's PGN comments show scores from its full search next to the weakened moves it played: `0.00/13` while dropping material, and `-7.44/14`.
   - `probe.out` is 486 930 B for 2 games; gzip -9 makes it 63 381 B.
8. **Openings** (`draw-probe.ts` sha256 `3d36397e…1339`).
   - The five TSVs at `a6189a30` were fetched. Each sha256 equals `tools/opening-book/compile.ts` `SOURCE_SHA256`. They hold 3 865 data rows.
   - Distinct non-terminal positions by lowest ply: 410 at ply 4, 539 at ply 5, 630 at ply 6, 624 at ply 7 and 640 at ply 8.
   - 1 terminal position was excluded: Fool's Mate after 2...Qh4#.
   - The stratified hash-ranked pick (20 per ply, rank sha256(`"ABC-204/openings/v1\n"` + EPD)) gave 100 distinct EPDs. The LF-joined file's sha256 was `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666` on 2 runs.
9. **The lint and type lane for `tools/`.**
   - `tsconfig.json` `include` names `tools/opening-book/**/*.ts` and one `tools/grugops` file.
   - `biome.json` `files.includes` names `tools/**/*.js` and `tools/opening-book/**/*.ts`. A `tools/rating/*.ts` file is read by neither until a line is added.
   - `vitest.config.ts:12-15` states the two-entry rule.
   - `vitest.config.ts` has no coverage block.
