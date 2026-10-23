---
id: ABC-204
title: "Rating harness: `cutechess-cli` plays the built `skytalix` against Stockfish `UCI_LimitStrength` (R) and against its own base (D), outside `npm test`"
status: in-design
column: In Design
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
