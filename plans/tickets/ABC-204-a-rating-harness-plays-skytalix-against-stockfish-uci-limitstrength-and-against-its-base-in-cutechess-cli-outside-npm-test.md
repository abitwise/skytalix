---
id: ABC-204
title: "Rating harness: `cutechess-cli` plays the built `skytalix` against Stockfish `UCI_LimitStrength` (R) and against its own base (D), outside `npm test`"
status: done
column: Done
size: M
priority: P2
epic: EPIC-008
feature: —
---

# ABC-204: the rating harness, so every later EPIC-008 change is measured and not guessed

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 2 of
> `…f1771bb3`; owner word `…7feb0553`. The readings R and D, their states and the ship rules are defined once in
> `EPIC-008` § The two readings. This page pins how they are produced.
>
> **Correction to the analysis.** § 6 item 2 says "`cutechess-cli` and `fastchess` are absent". That was true when
> the analysis was written. The owner had already built `cutechess-cli` 1.5.1 (`…7ea41eea`), and `ABC-202` played 8
> games with it. This hop re-read the binary: present, sha256 equal to the pin.
>
> **Erratum 2026-10-24 (BA/PM, task `bapm-fold-ABC-212`, at `ABC-212`'s merge; `ADR-0045` § Consequences).** Q1's
> derivation line names "`HARD_CEILING_MS` (5 000)". From `ABC-212`, `HARD_CEILING_MS` is 32 000, so the line reads
> "level 5's ceiling (5 000)". See Q1. No number, margin or rule on this page changes.

## Problem

- **User:** the owner, and every later `EPIC-008` ticket.
- **Pain:** today, strength is guessed from one game (ACPL 41-49, "about 1400-1900", ±300 at least). A tuning change
  could not be told from noise.
- **Value:** a reproducible number with a 95 % error bar. It is the epic's baseline (M1) and every ticket's gate (S1
  and S2).

## Scope

1. **A harness script under `tools/rating/`.** The language is the Architect's call. It drives `cutechess-cli` 1.5.1
   at its pinned absolute path in two modes:
   - **R:** `skytalix` against Stockfish 19 with `UCI_LimitStrength true` and `UCI_Elo` E;
   - **D:** a candidate artifact against a base artifact.
   It builds each artifact the `ABC-202` way: clone at a sha, `npm ci && npm run build`, then
   `cmd=<node> arg=<clone>/dist/uci.js dir=<clone>`. Each run's raw files go to a directory the caller names, outside
   the working tree.
2. **One pinned opening file.** 100 positions at ply 4–8, from the in-repo book's CC0 source (`ADR-0023`;
   `data/opening-book/book.json` or the five TSVs at `SOURCE_COMMIT`). Each position is played with both colours. The
   file is committed under `tools/rating/` with its sha256, so no new licence question arises.
3. **Three readings, by QE, agent-run:** the baseline R on `main` (`A4`), one A/A check (`A5`) and the wall-time
   ruling (`A6`).
4. **Records:** a `## Reading` section on this page, one dated line on `EPIC-008`, and the raw files with
   `SHA256SUMS` under the QE task's context.

## Out of scope

- Any change to `src/`, `data/`, `vitest.config.ts`, or any `*.test.*` file (`A3`).
- Computing Elo in repo code. `cutechess-cli`'s `Elo difference: X +/- Y` is the figure (`EPIC-008` § The two readings).
- SPRT, `fastchess`, other opponents, other hosts, and levels 1–4.
- Publishing a rating anywhere (`ADR-0007`, `ADR-0018`, `ADR-0044` D8).

## Design questions (Architect/Design rules them In Design, records only; no ADR is expected)

1. **`skytalix`'s clock.** Either `st=3` with a `timemargin`, or a `tc` that holds G at 3 000 ms (`ADR-0044` D4).
   Either way, every searched move gets 3 000 ms, and the expected count of time forfeits is 0. Note that `ABC-202` saw
   a `go`→`bestmove` gap of up to 3 010 ms.
2. **Stockfish's settings.** Its time per move, `Threads 1`, `Hash`, and the starting E. The analysis's centre is
   1650. Under what time control Stockfish calibrates `UCI_Elo` is `UNKNOWN - verify`, and the page records what was
   found. Once `A4` fixes them, all of these are frozen for the epic.
3. **Adjudication.** `-resign`, `-draw` or `-maxmoves`. They must be identical across all readings and must apply to
   both sides. A score-based adjudication reads `skytalix`'s `info … score` lines.
4. **Concurrency** on the M3, which has performance and efficiency cores. Running games side by side changes speed per
   game, so the value is pinned and frozen.
5. **How 100 positions are drawn** from the book source, reproducibly. For example: sorted keys, then a seeded pick.

## Acceptance criteria

Every figure carries its machine (chip, Darwin, `node --version`, `cutechess-cli --version`, Stockfish's `id name`).

- **`A1` (tools pinned).** **Given** the run, **then** the `cutechess-cli` and Stockfish sha256 values equal
  `EPIC-008` § Dependencies, or the difference is recorded. A different build is not a FAIL.
- **`A2` (the harness runs both modes from one command each).** **Given** a sha (R), or two shas (D), and an output
  directory, **when** the harness runs, **then**:
  - it builds each artifact, and records the artifact's sha256 and the `uci` option lines;
  - it writes the exact `cutechess-cli` command line to the output directory before the first game;
  - it ends with the raw `.out`, `.pgn`, per-engine `stderr` files, a host log and `SHA256SUMS`;
  - it prints `Elo difference: X +/- Y`, W/L/D, the draw ratio and the game count;
  - it prints a state: GAIN, NEUTRAL, LOSS or UNRESOLVED for D, and the rating E + X ± Y for R.
- **`A3` (outside the lane; `NFR-008` untouched).** **Then:**
  - no `*.test.*` file is added anywhere;
  - `npm test` collects the same number of test files as base;
  - `git diff --stat <base>..<head>` touches only `tools/rating/`, plus `package.json` if a `scripts` entry is added
    (for example `"rating"`), plus one `tools/rating/**` line in `tsconfig.json`'s `include` if the script is
    TypeScript (today `include` names `tools/` paths one by one);
  - `npm run lint`, `typecheck` and `build` are green, and `dist/` contains no `tools/` file. The build emits only
    `src/uci.ts` (`tsconfig.build.json` `files`).
- **`A4` (the baseline R; this is `EPIC-008` M1's start).** **Given** `main` at sha S, **when** R plays 200 games,
  **then** the reading has:
  - 200 finished games, with 0 illegal moves, 0 disconnects, 0 stalls and 0 time forfeits by `skytalix`;
  - `skytalix`'s score inside **25–75 %**. If it falls outside that band, E is moved once in the needed direction and
    R is re-run, and that run is the baseline;
  - the record: E + X ± Y, the pins, and the wall time.
  - E is then frozen.
- **`A5` (A/A check: the harness has no side bias).** **Given** D with candidate = base = S, over **100 games**,
  **then** 0 faults, and the interval X ± Y contains 0. If it does not, D is re-run once. A second miss is a harness
  defect, not a result.
- **`A6` (wall time, measured and ruled).** **Then** the page records the measured median wall time per game for R and
  for D, and games per hour at the ruled concurrency. The rules:
  - an R reading of 200 games must fit **≤ 10 h**;
  - a D reading of 400 games must fit **≤ 8 h** at 3 000 ms. If it does not, the Architect rules a shorter fixed
    `skytalix` budget for D, **not below 1 000 ms**, records the reason, and it is frozen for the epic;
  - if R cannot fit 10 h at any ruled concurrency, this is a STOP to BA/PM with the numbers, and BA/PM re-rules N.
- **`A7` (records).** **Then** this page gains `## Reading` (S, the machine, `A1`–`A6` each with a state, and the frozen
  pins). `EPIC-008` gains one dated line with the baseline rating. The raw files and the script that ran are hashed
  under the QE task's context.

## NFR triggers

- **`NFR-008`:** untouched. There are 0 lane files, and `A3` checks it.
- **`NFR-004`:** binds each move, unchanged. A time forfeit makes the reading UNRESOLVED, and it is reported.
- **Security:** no `src/` file changes, so `ADR-0036` clause (b) cannot fire, because it reads production files under
  `src/`. The harness spawns two host binaries, at pinned absolute paths, from a scratch clone. It writes only under
  the output directory it is given, and it uses no network. No Security/NFR hop is owed.

## Test notes

1. All runs happen in the QE hop's scratch folder and in scratch clones, never in `main`'s checkout.
2. Host: AC, width 1 among agent hops, with a host log and a watchdog (the `ABC-202` pattern). No quiet window is
   required: load slows both engines alike. A fault on a host that is not quiet is UNRESOLVED.
3. Read the raw files, not the summary. Quote the first `go` sent to each engine, and quote one result line raw.
4. UAT: 0 production lines, so UAT is waived. The QE reading note is the evidence.

## Dependencies

- The two host tools, both present (`EPIC-008` § Dependencies). The npm registry or a warm cache, for `npm ci`.
- **Builder:** Architect/Design rules the five questions, the Software Engineer builds the script, and QE/E2E runs
  `A4`–`A6`.
- **Owner Q2** (`EPIC-008`) sets when the readings run. It does not block the build.
- **Change 2026-10-28** (Software Engineer, task `se-tools-rating-host`; reason: the host move, owner
  `orch-2026-10-28a/…5dbd717b`). The tool paths come from the environment, `CUTECHESS_CLI` and `STOCKFISH`. There
  are no defaults; a missing or unreadable one stops the run and names the variable. The pins are re-set to the new
  host's binaries:
  - `cutechess-cli`: `fb4fc2aa…6e1c` → `dc776901…f40a`, cutechess-cli 1.5.1 built from cutechess commit `5e84232b`;
  - Stockfish: `dc2f18c3…251f` → `c78c22a9…52d2`, a Stockfish 19 build (`id name Stockfish 19`).

  The old pins and the 2026-10-23 readings taken with them stand as records of the previous host. Two Linux fixes in
  the same hop: the preamble reads the chip and OS through `node:os` (`sysctl machdep.cpu.brand_string` exits 1 on
  Linux), and `host.log` counts foreign `vitest` processes even where the macOS-only probes fail.
- **Change 2026-10-29** (Software Engineer, task `se-tools-rating-concurrency`; reason: heat on this host, owner
  `orch-2026-10-29d/…3081f6d4`). `tools/rating/rating.ts` takes `--concurrency C` (an integer from 1 to 8) in both
  modes and passes it to `cutechess-cli`'s `-concurrency`. Any other value stops the run before any work and names
  the flag. Without the flag the Q4 values stand, R 2 and D 3, so the command line comes out byte-identical and no
  past reading is affected. `machine.txt` records the width in force, for example `concurrency: 3 (default)` or
  `concurrency: 2 (default 3)`; `cmd.txt` carries it in the args. Q4's ruling is not changed: a width other than
  the default is chosen by the owner and recorded with the reading.

## Size and priority

- **`M`:** one script with two modes, one opening file, and three long agent-run readings. Most of the cost is wall
  time.
- **`P2`:** it is the enabler for every other `EPIC-008` ticket. Nothing is broken today.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ strength is guessed from one game; every later ticket needs a measured gate |
| 2 | scope and out-of-scope clear | ✅ four scope lines; `src/`, lane files, repo Elo maths, SPRT and publishing are fenced |
| 3 | INVEST-shaped | ✅ independent; valuable alone (the baseline rating); estimable; `M`; testable by game counts, fault counts and intervals |
| 4 | acceptance testable and measurable | ✅ 200 and 100 games; 0 faults; 25–75 % band; interval contains 0; ≤ 10 h and ≤ 8 h; D budget ≥ 1 000 ms |
| 5 | dependencies known | ✅ tools present and pinned; builders named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` 0 lane files; `NFR-004` forfeits counted; no `ADR-0036` limb, argued |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ✅ the five design questions are ordinary In Design work; Q2 sets timing, not feasibility |

## Design ruling

> **Architect/Design, 2026-10-23** (task `arch-design-ABC-204`, records plus light probes, at `main` `36a4902e`). Notes:
> `.grugops/context/arch-design-ABC-204/notes/`. **No ADR is needed, and none is written. The STOP did not fire.** No NFR
> bound moves. The probes ran in the session scratchpad (`design204/`), on a host that was not quiet (battery, thermal
> 2, load1 6.4–9.3, a foreign `vitest`). So no probe figure here is a reading. The baseline R, the A/A D and the wall
> times stay QE's (`A4`–`A6`).

**Probe build.** `dist/uci.js` sha256 `877e9595…b98d`, built at `e5c5c2a5`. `git diff --stat e5c5c2a5 36a4902e -- src
data package.json tsconfig.build.json` is empty, so this is `main`'s engine. Tools: `cutechess-cli` sha256 `fb4fc2aa…6e1c`
and Stockfish 19 sha256 `dc2f18c3…251f`. Both equal `EPIC-008` § Dependencies.

### Q1. `skytalix`'s clock: `st=3 timemargin=2000`

- **The pin:** `skytalix` gets `st=3 timemargin=2000`. `cutechess-cli` then sends `go movetime 3000`
  (`uciengine.cpp:273-274` at `5e84232b`). `src/uci-session.ts:213-214` makes `movetime` the budget, and level 5 caps it
  at 3 000 ms. So every searched move gets exactly 3 000 ms, with no clock state that could drift.
- **Why a margin is needed.** `cutechess-cli` flags a forfeit when a move's measured time is above the time left plus
  the margin (`timecontrol.cpp:362-363`). The probe measured the `go`→`bestmove` gap: median 3 004 ms, max 3 028 ms,
  and 90 of 99 searched moves over 3 000 ms. With a margin of 0, nearly every move would forfeit.
- **Why 2 000.** 2 000 = `HARD_CEILING_MS` (5 000, `src/engine.ts:129`) − 3 000. A forfeit then fires only for a move
  over 5 s, which is a breach of `NFR-004` clause B and not a measurement artefact. The engine never sees the margin, so
  it changes nothing in play. The expected forfeit count is 0, because the engine overshoot is ≤ 31 ms
  (`AR-NFR004-A`). *(Erratum 2026-10-24, BA/PM, `bapm-fold-ABC-212`: for "`HARD_CEILING_MS` (5 000,
  `src/engine.ts:129`)" read "level 5's ceiling (5 000, `NFR-004` clause B)". From `ABC-212`'s merge,
  `HARD_CEILING_MS` is 32 000 (`ADR-0045` A3), and each level's ceiling is held by its budget. `skytalix` plays at
  `Skill Level` 5, so 2 000 stands.)*
- **The general rule** (it also covers the D budget, Q4): `timemargin` = 5 000 − budget, in ms. *(Erratum
  2026-10-24: read as ceiling(level) − budget, which is 5 000 − budget at `Skill Level` 5 (`ABC-212`
  § Dependencies). Unchanged.)*
- **Rejected: a `tc` that holds G at 3 000.** `ADR-0044` D4 gives G = min(t/20 + i/2, t − 50), capped by the level.
  That reaches 3 000 only while the clock stays high, and the clock drifts by each move's overshoot. It has more moving
  parts and gives no better measure.
- **Reported, not graded:** per-engine gap median, max, and the count over 3 031 ms. The gap includes pipe latency, so
  it is not an `NFR-004` instrument.

### Q2. Stockfish: `st=0.5`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`, start E = 1650

- **The pins:**
  - `cmd=$STOCKFISH` (the path comes from the environment; dated change in § Dependencies, 2026-10-28);
  - `st=0.5 timemargin=2000 restart=on`;
  - `option.Threads=1 option.Hash=16 option.UCI_LimitStrength=true option.UCI_Elo=<E>`.
  - Ponder stays off: `cutechess-cli` sends `setoption name Ponder value false` itself (probe). Every other option
    stays at its default (`Move Overhead` 10, `MultiPV` 1).
- **The range** is probed: `UCI_Elo` spin 1320–3190, default 1320. `Threads` defaults to 1 and `Hash` to 16.
- **Why 0.5 s, and not 3 s.** With `UCI_LimitStrength`, Stockfish 19 picks its move once, at depth 1 + int(level), and
  keeps it (`search.cpp:557-559` and `625-628`, `search.h:247-268` at tag `sf_19`). level = the cubic fit of E; at
  E 1650 it is 2.56, so the pick is made at depth 3.
  - Probe: depth 3 at 4 ms, and depth 12 at 250 ms.
  - Time spent past depth 3 changes nothing in play. It costs wall time only.
  - 0.5 s leaves more than 100× headroom.
- **Guard (QE):** every Stockfish move's depth in the PGN comment must be ≥ 1 + int(level(E)). A miss makes the reading
  UNRESOLVED. This holds at any E that `A4` may set (E 2000 needs depth 5).
- **The calibration. This resolves the page's `UNKNOWN - verify`.**
  - Since Stockfish commit `a08b8d4e` (2023-01-22), the README reads: "This Elo rating has been calibrated at a time
    control of 120s+1.0s and anchored to +- 100 Elo to CCRL Blitz". The older "60s+0.6s … CCRL 40/4" line was
    replaced by that commit.
  - `search.h` at `sf_19` says the scale is a fit of Stockfish against the Stash engine: "Skill 0 .. 19 now covers
    CCRL Blitz Elo from 1320 to 3190, approximately".
  - The harness's control is not 120+1. The reading stays "on Stockfish 19's `UCI_Elo` scale at the harness's time
    control on this host" (`EPIC-008`). It is not FIDE and not CCRL.
- **Start E = 1650**, the analysis's centre.
  - The probe's 2 games were both won by `skytalix` (mates at 61 and 136 plies). That hints that 1650 is low, but 2
    games are not a reading.
  - **The one move `A4` allows is read as:** E′ = E + X, rounded to 10 and clamped to 1320–3190. If X is infinite (a
    100 % or 0 % score), E′ = E ± 400. The re-run is the baseline, whatever it scores, as `A4` says. This removes
    the guess from "in the needed direction".
- **Frozen at `A4`:** E, `st=0.5`, `Threads`, `Hash` and the other Stockfish pins.

### Q3. Adjudication: no score-based adjudication; `-maxmoves 200` only

- **The pins.** No `-resign`, no `-draw`, no `-tb`, and no `trust`. `-maxmoves 200` (as in `ABC-202` and the `NFR-012`
  instrument) is identical for every reading and both sides. A game that reaches it is a draw by adjudication. It is
  counted and reported.
- **Why not score-based.** `cutechess-cli` adjudicates on each engine's own `info … score`
  (`gameadjudicator.cpp:75-152`, `addEval`). Neither engine's score is a fair arbiter:
  - `skytalix`'s evaluation is the thing `EPIC-008` changes. In game 1 it judged itself 3–5.5 pawns better than
    Stockfish did. In D, an evaluation change would move when the candidate resigns or agrees a draw, so the instrument
    would partly read the change it measures.
  - Stockfish under `UCI_LimitStrength` reports the score of its own full search, not of the weakened move it plays.
    Probe PGN: it played losing moves next to `0.00/13` and `−7.44/14` comments.
- **No `-recover`.** A crash ends its game as a disconnect, and the reading is UNRESOLVED (`EPIC-008`).
- **Cost.** Lost games are played out to mate. The probe's mates took 61 and 136 plies, 102 s and 238 s.

### Q4. Concurrency: R at 2, D at 3. Frozen, with a pre-ruled D budget

- **The host.** Apple M3: 4 performance and 4 efficiency cores, 16 GiB.
  - There is no pondering, so a game has one searching process at a time.
  - Wall time per game is set by the per-move budgets, not by CPU speed. So concurrency divides wall time almost
    linearly, as long as each game keeps a performance core.
  - Speed does change strength. It changes `skytalix`'s depth, but not Stockfish's pick, because that is made at
    depth 3.
- **R at `-concurrency 2`.** Two searching threads leave 2 performance cores for `cutechess-cli`, Node's GC threads
  and foreign load. R is not symmetric: only `skytalix`'s strength depends on speed. So R keeps the lowest concurrency
  that fits.
  - Estimate from the probe: about 170 s a game, so 200 games ≈ 4.7 h at 2, against the 10 h cap. At 1 it would be
    about 9.4 h, which is too close to the cap.
- **D at `-concurrency 3`.** Both sides are the same program on the same host, so speed noise is symmetric.
  - At 3 000 ms a side, a D game is about 250–300 s (estimate: about 82 plies a game at `ABC-202`'s pace × 3 s).
    400 games ≈ 9–11 h at 3. So D at 3 000 ms is expected **not** to fit the 8 h cap, and `A6` will rule a shorter
    budget.
  - At 2, the budget would fall to the 1 000 ms floor. At 3, about 2 000–2 500 ms fits. That stays closer to the
    3 000 ms that ships.
  - 4 was rejected: it fills every performance core.
- **The D budget, pre-ruled for `A6`, so no second design hop is needed.**
  - QE runs `A5` (the A/A, 100 games) at 3 000 ms and concurrency 3. Its median game wall is `A6`'s D measurement.
  - Then B is the largest value in {3 000, 2 500, 2 000, 1 500, 1 000} ms with 400 / 3 × median × B / 3 000 ≤ 8 h.
    `timemargin` = 5 000 − B (Q1). B is recorded with this reason and frozen for the epic.
  - If even 1 000 does not fit, that is a STOP to BA/PM with the numbers, the same as `A6`'s R clause.
  - `A5`'s no-side-bias result stands for the harness at any B, because a side bias would come from colours, order or
    the harness, not from the budget.

### Q5. The 100 positions: a stratified, hash-ranked pick from the five TSVs

- **Source.** The five TSVs at `SOURCE_COMMIT` `a6189a30` (`ADR-0023`, CC0). Their sha256 must equal
  `tools/opening-book/compile.ts` `SOURCE_SHA256`. Probe: all 5 equal. `book.json` is not used: its keys are Zobrist
  hashes, and it holds no FENs.
- **Candidates.**
  - For every row, take the position after ply p, for each p from 4 to 8 that the line reaches. The SAN is parsed by
    `src/` read-only, as `compile.ts` does (`ADR-0037` D1(g)).
  - The key is the first four FEN fields of `src/fen.ts` `toFen`.
  - Drop a position with no legal move. There is 1: Fool's Mate, at ply 4.
  - A position reached at several plies belongs to its lowest ply.
- **The pick.**
  - In each ply stratum, rank by sha256(`"ABC-204/openings/v1\n"` + key) ascending, and take the first 20. That gives
    20 × 5 = 100.
  - The file is ply 4's block first, each block in rank order. Each line is one EPD (four fields, no opcodes),
    LF-terminated.
  - The ranking needs no PRNG, so it does not depend on the language or the enumeration order.
- **Probe.**
  - Strata 410 / 539 / 630 / 624 / 640 distinct; 100 picked, all distinct.
  - The file's sha256 was **`0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666`** on two runs.
  - The SE's generator must reproduce these bytes. A difference is a defect in one of the two, and it is settled
    before merge.
- **The files.**
  - The generator is committed as `tools/rating/openings.ts`. The TSVs stay out of the repository, as for
    `compile.ts`.
  - The file is `tools/rating/openings.epd`. The harness checks its sha256 against a pinned constant before the first
    game, and stops on a mismatch.
- **Play.**
  - `-openings file=… format=epd order=sequential -repeat -games 2`, so each opening is played with both colours.
  - R: `-rounds 100` (200 games). A5: `-rounds 50` (the first 50 openings). D: `-rounds 200` (two passes;
    sequential order rewinds at the end, `openingsuite.cpp:163-166`).
  - QE checks that games 2k−1 and 2k share their `[FEN]` with colours swapped.
- **Rejected.**
  - An evaluation-balance filter: it would add an engine to the instrument, and playing both colours cancels an
    opening's imbalance.
  - A seeded PRNG: its output depends on the implementation.
- **Noted.** Many picked positions are inside `skytalix`'s own book (book lines reach ply 12), and `OwnBook` stays on.
  This is the shipped engine, the same at every reading. Book moves are counted and reported.

### Other pins and the build shape (not questions; recorded so the SE does not guess)

- **`restart=on`** for every engine: one fresh process per game, so no state crosses games. The probe confirmed a new
  Stockfish process for game 2.
- **`skytalix` gets no `setoption`.** It keeps its defaults: `OwnBook` true, `Skill Level` 5.
- **Output.** `-debug all` (`QE-202-a`), plus `stderr=` per engine and `-pgnout`. The PGN carries each move's depth and
  time, and Q2's guard reads it.
  - The `.out` is about 245 KB a game (probe), so about 49 MB for an R and 98 MB for a D.
  - gzip -9 shrinks it 7.7×.
  - **Recommended for `A7`:** commit `*.out.gz` and the PGN. `SHA256SUMS` lists both the raw and the gzipped `.out`.
    This is QE's and the Orchestrator's call.
- **Language: TypeScript, run as `node tools/rating/<file>.ts`,** like `tools/opening-book/compile.ts`.
  - Files: `tools/rating/rating.ts` (modes `r` and `d`), `tools/rating/openings.ts` and `tools/rating/openings.epd`.
    No file is named `*.test.*`.
  - **`A3` clarification (dated, cheap to reverse):** the build adds one `tools/rating/**/*.ts` line to
    `tsconfig.json` `include` **and** one to `biome.json` `files.includes`. Without the `biome.json` line,
    `npm run lint` does not read the harness, and its green would be vacuous (`vitest.config.ts:12-15` states the same
    two-entry rule). So `A3`'s list is read as including that one `biome.json` line.
- **The R command shape** (QE's `A2` records the exact line):

  ```
  $CUTECHESS_CLI \
    -engine name=skytalix cmd=<node> arg=<clone>/dist/uci.js dir=<clone> st=3 timemargin=2000 restart=on stderr=<out>/skytalix.stderr \
    -engine name=stockfish cmd=$STOCKFISH st=0.5 timemargin=2000 restart=on \
            option.Threads=1 option.Hash=16 option.UCI_LimitStrength=true option.UCI_Elo=<E> stderr=<out>/stockfish.stderr \
    -each proto=uci \
    -openings file=<repo>/tools/rating/openings.epd format=epd order=sequential -repeat \
    -games 2 -rounds 100 -concurrency 2 -maxmoves 200 \
    -pgnout <out>/r.pgn -debug all > <out>/r.out 2>&1
  ```

  D swaps Stockfish for a second `skytalix` (`name=base`, the base clone) and sets `st=<B/1000> timemargin=<5000−B>` on
  both. It uses `-rounds 200 -concurrency 3`, or `-rounds 50` for `A5`.

### NFR impact

- **`NFR-008`:** untouched. 0 lane files, no `*.test.*`, and `tools/rating/` is not imported by any test.
- **`NFR-004`:** binds each move, unchanged. A harness forfeit now means a move over 5 s (Q1).
  - **Observation for Security/NFR (no bound moves):** the tool-measured gap reached 3 028 ms. `AR-NFR004-A` bounds
    the engine's overshoot at 31 ms. A reading has about 20 000 `skytalix` moves, and the tool gap includes pipe
    latency, so a gap over 3 031 ms is likely to appear somewhere. It is reported, not graded. Reading it is
    Security/NFR's call.
- **`NFR-012`:** untouched. The harness is a separate instrument (`st`, not `tc=60+1`).
- **`ADR-0036` (b):** cannot fire. No `src/` file changes.

### Next move

- Recommend `In Design` → `Ready for Dev`, then `In Development` with the Software Engineer.
- Two items are flagged as cheap-to-reverse delivery calls, not owner questions:
  - the `A3` `biome.json` line;
  - the `A4` E-step rule.
- QE then runs `A4`, `A5` and `A6` at width 1, in the order `A5` → `A4`, or `A4` → `A5`. Either order works, because
  B is ruled from `A5`'s wall time.
- Merging this records branch is the Orchestrator's.

## Reading

> **QE/E2E, 2026-10-24/25** (task `qe-ABC-204`, branch `grugops/qe-ABC-204`, merge `e546e124` = `0e88c5df` + `main`
> `3497aad2`). **One run under the owner's rule `…4c3f7639`.** Notes: gate `…fbff3e18`, A5 `…1891d465`, A4 `…bfffcf4c`,
> verdict `…b5f4d5a1` (`.grugops/context/qe-ABC-204/notes/`). Raw files,
> `SHA256SUMS` and the scripts that ran: `.grugops/context/qe-ABC-204/raw/` (personal paths redacted, `ADR-0049` d4).

**S** = `main` `3497aad2`. **Machine:** Apple M3 (4 performance + 4 efficiency cores), Darwin 25.6.0, node v26.11.1,
`cutechess-cli 1.5.1`, `id name Stockfish 19`. The harness is `tools/rating/rating.ts` sha256 `d4b16e20…35fa`.

| # | state | the reading |
|---|---|---|
| `A1` | **MET** | `cutechess-cli` `fb4fc2aa…6e1c` and Stockfish `dc2f18c3…251f`, both equal to `EPIC-008` § Dependencies |
| `A2` | **MET** | Both modes ran from one command and wrote every listed file; the states printed right. Finding **QE-204-b (MEDIUM)**: the recorded "artifact sha256" is `dist/uci.js` only, which is the same at `8ccba739` and `3497aad2`, so it does not identify the build. **QE-204-a (LOW)**: an out dir that is a symlink into the checkout passes the guard |
| `A3` | **MET** | Diff: `tools/rating/` + 1 line each in `tsconfig.json` and `biome.json`. 0 `*.test.*`. `npm test` 62 files = base (2073/2073). lint, typecheck and build 0; `dist/` has 22 files, 0 from `tools/` |
| `A4` | **MET** | **Baseline R = 1 910 + 151.3 ± 50.3 = 2 061.3 ± 50.3** (`Elo difference: 151.3 +/- 50.3`), W/L/D 132/50/18, score 70.5 %. 200/200 games, 0 faults, 0 move-cap draws, depth guard 0 of 9 115 below 4. Run on a clean host: AC, no foreign vitest, load1 ≤ 7.62. The first run at E 1 650 scored 82.0 % (263.4 ± 61.8), so E moved once, to E′ = 1 910 |
| `A5` | **UNRESOLVED** | **Stopped by a battery switch at 99 of 100 games** (17:40:24Z). 0 faults in 99. The tool printed no Elo line. QE's port of `elo.cpp`, on the tool's W/L/D 26/21/52, gives +17.6 ± 47.4, and the 57 games with no foreign-load overlap give 0.0 ± 61.5. Both contain 0. Not re-run (`…4c3f7639`) |
| `A6` | **MET** | **R:** median game 131 s, 45.5 games/h at concurrency 2; 200 games took 4.40 h, within 10 h. **D:** median game 330 s at 3 000 ms, 31.4 games/h at concurrency 3; 400 games would take 12.2 h, over 8 h. **Ruled by Q4's rule: B = 1 500 ms**, `timemargin` 3 500 (400 games ≈ 6.1 h). 2 000 ms would need a median ≤ 324 s, and the median lies in [328.5, 330] s whatever game 100 took |

**Frozen for `EPIC-008`** (from this reading on):
- **R:** `UCI_Elo` **E = 1 910**, `st=0.5 timemargin=2000 restart=on`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`,
  Ponder off. `skytalix` gets `st=3 timemargin=2000`. `-concurrency 2`.
- **D:** **B = 1 500 ms**: `st=1.5 timemargin=3500` on both sides, `-concurrency 3`, `-rounds 200`.
- **Both:** `openings.epd` sha256 `0d7f7a72…2666`, `order=sequential -repeat -games 2`, `-maxmoves 200` only, no
  `-resign`, `-draw`, `-tb` or `-recover`. `cutechess-cli` and Stockfish at the sha256 values in `A1`.
- **The rating is on Stockfish 19's `UCI_Elo` scale at E = 1 910, at this time control, on this host.** At E = 1 650
  the same engine read 1 913.4 ± 61.8. The two anchors differ by 148 ± 80, so an R is comparable only at the same E
  (QE-204-e). `M1` holds E fixed, so `M1` is not affected.

> **QE/E2E addendum, 2026-10-25** (task `qe-fix-ABC-204`, notes `.grugops/context/qe-fix-ABC-204/notes/`): the readings
> above ran with `tools/rating/rating.ts` sha256 `d4b16e20…35fa`. The merged harness is `rating.ts` `d6b2a988…b172` +
> `tools/rating/dist-manifest.ts` `78b1528e…357f` (fix `2c8a84f2`: QE-204-b, a whole-`dist/` manifest and tree hash in
> `artifacts.txt`; QE-204-a, the guard resolves the out dir's leaf). **The readings stand**: the change is
> recording-only, and the play code paths are unchanged against `16c51d1c` (diff read).
