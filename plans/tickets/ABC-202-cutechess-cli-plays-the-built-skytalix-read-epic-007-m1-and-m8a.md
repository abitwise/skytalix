---
id: ABC-202
title: "`cutechess-cli` plays the built `skytalix` (`dist/uci.js`) against itself: read `EPIC-007` M1 (6 games, `tc=60+1`) and M8(a) (2 games, `depth=4`)"
status: done
column: Done
size: XS
priority: P2
epic: EPIC-007
feature: —
---

# ABC-202: one agent-run `cutechess-cli` reading of `EPIC-007` M1 and M8(a). Records only: no code, no test file, no bar moves

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-EPIC-007-M1-M8a`, records only, at `main` `84a59ed6`). The rulings are
> in `.grugops/context/bapm-cut-EPIC-007-M1-M8a/notes/`. This hop played no game. It ran `cutechess-cli --version`
> and `--help` only.
>
> **Trigger.** BA/PM's `…b5f65536` set it: once `cutechess-cli` is on the owner's Mac, cut one `XS` QE reading ticket,
> agent-run, with no human gate. The owner built it from source (`…7ea41eea`). It is not on `PATH`, and the Orchestrator
> ruled the trigger met by the absolute path. This page pins that path.
>
> **What it reads.** Two measures that already exist (`EPIC-007` § Success measures, M1 and M8(a); `ABC-168` `A8`,
> `A9`). It adds no requirement and moves no bound.

## Problem

- **User:** the owner. His web UI's backend will spawn `skytalix` as a child process and drive it over UCI, as any
  GUI does.
- **Pain:** `EPIC-007` cannot close on its measures. M1 and M8(a) are owed and unread. They are the only check of
  `RISK-EPIC007-01`: a GUI's timeout or `isready` ping firing during a ≤ 5 s search (`ADR-0044` D5). Today that risk
  would first show up in the owner's own backend.
- **Value:** one cheap hop. A standard, unmodified UCI tool either plays 8 complete games against the built artifact
  with 0 protocol faults, or it gives a reproducible raw log of the fault. Either result closes the gap on
  `EPIC-007`.

## The tool, pinned

| item | value (read 2026-10-23) |
|---|---|
| path | `/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli` (**not on `PATH`**; always invoke it by this absolute path) |
| version | `cutechess-cli 1.5.1`, Qt 6.12.0, macOS Tahoe (26.7.1)/arm64; checkout `5e84232b` (`v1.5.1-5-g5e84232b`) |
| binary sha256 | `fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c` |
| manual | `docs/cutechess-cli.6.txt` in that checkout, sha256 `8de9e427…`. Cited below as "man:<line>" |

At the start of the run, QE re-reads `--version` and the binary's sha256. If either differs, QE records the
difference and confirms the flag pins below against the new `--help`. A different build is not a FAIL.

## The artifact under test

- **What:** `dist/uci.js`, the output of `npm run build` (`tsc -p tsconfig.build.json`), in a fresh clone. This is
  the `EPIC-007` definition of "the artifact". It is not `main`'s checkout and not `npm run uci`.
- **Which sha:** `main` at the run, sha **S**, recorded. At this cut `main` is `84a59ed6`. The last commit that
  touched `src/`, `data/`, `package*.json` or `tsconfig.build.json` is `20e397c8`. If S ≠ `84a59ed6`, record
  `git diff --stat 84a59ed6 S -- src data package.json package-lock.json tsconfig.build.json` (reported only).
- **How it is built:** `git clone <main's checkout> <scratch>/clone`, `git -C <scratch>/clone checkout S`, then
  `npm ci && npm run build` in the clone. Record the sha256 of `dist/uci.js`.
- **How `cutechess-cli` launches it:** `cmd=<node> arg=<clone>/dist/uci.js dir=<clone>`.
  - `<node>` is the absolute path from `command -v node`, recorded with `node --version`. At the cut it is
    `/opt/homebrew/bin/node`, `v26.11.1`.
  - `cmd=` is not split on spaces: `cutechess-cli` passes `cmd` and each `arg=` to `QProcess::start(program, args)`
    (source `projects/lib/src/enginebuilder.cpp:86` at `5e84232b`). So the script path goes in `arg=`, not in
    `cmd=`.
  - `dir=` is the clone root, so the engine's working directory is the clone. The book is read relative to the
    module (`src/book-file.ts:16`, `../data/opening-book/book.json`), so it resolves to `<clone>/data/` either way.

## The pinned invocation

Spellings come from the manual (man:15–335) and `--help`. Three behaviours the manual does not state were read from
the source at `5e84232b` and are marked *(source)*. QE's first run confirms them; see `A2`.

```sh
CC=/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli
NODE=$(command -v node)            # recorded, with node --version
CL=<scratch>/clone                 # main at S, after npm ci && npm run build
R=<the QE task's context>/raw      # every raw file of this reading lands here

# M1: 6 games, one per perft position, engine against itself, tc=60+1, default options
"$CC" \
  -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m1-a.stderr" \
  -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m1-b.stderr" \
  -each proto=uci tc=60+1 \
  -openings file="$R/m1-perft.epd" format=epd order=sequential \
  -rounds 6 -games 1 -concurrency 1 -maxmoves 200 \
  -pgnout "$R/m1.pgn" -debug \
  > "$R/m1.out" 2>&1

# M8(a): 2 games from the standard start position, colours swapped, depth 4, no clock
"$CC" \
  -engine name=skytalix-a cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m8a-a.stderr" \
  -engine name=skytalix-b cmd="$NODE" arg="$CL/dist/uci.js" dir="$CL" stderr="$R/m8a-b.stderr" \
  -each proto=uci tc=inf depth=4 \
  -rounds 1 -games 2 -concurrency 1 -maxmoves 200 \
  -pgnout "$R/m8a.pgn" -debug \
  > "$R/m8a.out" 2>&1
```

> **Erratum 2026-10-23 (Security/NFR, subtask `security-nfr-ABC-202`, `QE-202-a`).** The block above is kept as it was
> cut, but it is not the command that ran. In both commands, `-debug` is **`-debug all`**. A bare `-debug` makes
> `cutechess-cli` 1.5.1 (Qt 6) exit before any engine starts (§ Reading, A2). The operative command block is
> `.grugops/context/qe-read-ABC-202/raw/run.sh`, sha256
> `6562e145c5e02361869df082ae22746f7beac04c756b51bc1785a417c1964fd9`. `NFR-012` (`ADR-0044` candidate row (ii)) cites
> that file, not this block. The `-debug` row of the table below reads the same way. `all` also sends UCI `debug on`,
> which the engine ignores (`QE-202-b`).

**Why each flag, and what is deliberately absent:**

| flag | why |
|---|---|
| `proto=uci` | man:275 |
| `tc=60+1` | 60 s per game plus 1 s per move (man:278–282, format `moves/time+increment`). M1's control as written |
| `tc=inf depth=4` | man:278–284 and man:325. *(source)* `tc` is required: with no `tc`, `TimeControl::isValid()` is false (`timecontrol.cpp:149`). With `tc=inf` and a ply limit, the UCI engine is sent **`go depth 4`** with no `infinite` (`uciengine.cpp:268–287`). This settles M8(a)'s `UNKNOWN - verify` on the spelling |
| `-openings … format=epd order=sequential` | man:186–195. With `-rounds 6 -games 1` and the default opening repetitions of 1 *(source, `tournament.cpp:52`)*, each game takes the next line, so each perft position is played once |
| `-rounds 6 -games 1`, `-rounds 1 -games 2` | man:151–160: for two players, `-rounds` sets the game count. In M8(a) the two games are one encounter, and sides swap between games by default (man:220–226; *(source)* `tournament.cpp:62`, `m_swapSides(true)`) |
| `-concurrency 1` | man:107. One game at a time, so the two engines never compete with another game for CPU |
| `-maxmoves 200` | man:123–125. A cutechess adjudication, which both measures allow ("ends by a chess result or by cutechess adjudication"). It bounds the wall time of a self-play that could otherwise shuffle for hundreds of moves. A game reaching move 200 still had 200 moves of clock and protocol exposure |
| `-pgnout <file>` (no `min`, no `fi`) | man:208–211. Full PGN with move comments, and unfinished games are saved too, so a hung game is visible |
| `-debug` | man:184. All engine input and output, with the direction marked. M8(a)'s depth reading, and the `go`/`setoption` checks below, come from it |
| `stderr=<file>` per engine | man:272. The engine's stderr is kept raw |
| `name=skytalix-a` / `-b` | man:263. Two names for one program, so result lines and PGN tags say which instance played which side |
| **absent:** any `option.*` | M1 and M8(a) say "default options". At S that is `OwnBook` `true` and `Skill Level` **5**, `DEFAULT_LEVEL` (`src/levels.ts:53`; `ADR-0045` D4, owner-accepted 2026-10-19). M1's parenthetical "Skill Level 3" predates `ADR-0045`; the operative words are "default options". Level 3 would make M8(a) unreadable, because levels 1–4 ignore `go depth` under `ADR-0045` D4 |
| **absent:** `timemargin`, `tscale`, `-recover`, `ponder`, `trust`, `-draw`, `-resign`, `-tb` | No slack on the clock, no restart of a crashed engine (a crash must end its game as a disconnect), no pondering, every claim validated, and no score-based adjudication |

**`m1-perft.epd`** has exactly these six lines, in this order, each ending in `\n`. They are the six FENs of
`src/perft.test.ts:21–52`. The first four FEN fields come first. `hmvc` and `fmvn` carry the move counters, because
*(source, `epdrecord.cpp:140–155`)* a bare four-field EPD line would reset them to `0 1`:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - hmvc 0; fmvn 1;
r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - hmvc 0; fmvn 1;
8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - hmvc 0; fmvn 1;
r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - hmvc 0; fmvn 1;
rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - hmvc 1; fmvn 8;
r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - hmvc 0; fmvn 10;
```

## Scope

1. Build the artifact at S, as above.
2. Write `m1-perft.epd`, then run M1 and M8(a) **once each**, with the pinned invocation, M1 first.
3. Classify every game from the raw files, as `A3` and `A4` say.
4. Records: one `## Reading` section on this page, and one dated line on `EPIC-007`'s page.

## Out of scope

- Any edit to `src/`, `tools/`, `data/`, `package*.json`, `AGENTS.md` or a test file. If the reading finds a fault,
  this hop does not fix it (see § Failure route).
- M2 (closed by acceptance, `…b5f65536`), M8(b) and every other M.
- Any strength, Elo or score claim. The results 1-0, ½-½ and 0-1 are not graded (`EPIC-007`: M1 and M8(a) "are
  **not** strength claims").
- Non-default options, other time controls, `nodes=`, `-concurrency` above 1, pondering, another GUI or another host.
- Placing `ADR-0044` candidate row (ii) in `plans/nfr-catalog.md`. That is Security/NFR's post-reading catalog hop.
  It needs this page's pinned command line (catalog, "(ii) time safety: NOT YET placed").
- Closing `EPIC-007` (the Orchestrator's card move) and editing `plans/board.md` or `plans/traceability.md`.

## Acceptance criteria

Every figure carries its machine: chip, Darwin and macOS version, `node --version`, `cutechess-cli --version`.

- **`A1` (the artifact).** **Given** a clone of `main` at S, **when** `npm ci && npm run build` runs in it, **then**
  both exit `0`, `dist/uci.js` exists, and `printf 'uci\nquit\n' | node dist/uci.js` prints `id name skytalix` and
  `uciok` and exits `0`.
  - **Reported:** S, the sha256 of `dist/uci.js`, and the `option` lines verbatim. `Skill Level` is expected to read
    `default 5`.
  - If `A1` fails, the reading is UNRESOLVED and no game runs. A build failure on `main` is a defect for the
    Orchestrator, not a measure result.
- **`A2` (the pins hold).** **Given** the two runs, **then** the raw files show:
  - `m1.pgn` holds exactly 6 games, and `m1.out` holds exactly 6 `Finished game` lines. `m8a.pgn` holds 2 and
    `m8a.out` holds 2;
  - in M1, each game starts from a different line of `m1-perft.epd`. Every game except the startpos one carries a
    PGN `[FEN]` tag equal to its line's full FEN. The startpos game carries no `[FEN]` tag or one equal to the
    startpos FEN;
  - in M8(a), game 1's `[White]` and game 2's `[Black]` are the same instance. Both games start from startpos;
  - in `m1.out`, every `go` sent to an engine carries `wtime`, `btime`, `winc 1000` and `binc 1000`. In `m8a.out`,
    every `go` sent is exactly `go depth 4`;
  - no `setoption` line sent by `cutechess-cli` names `OwnBook` or `Skill Level`, in either run.

  **If a pin does not hold** (the tool rejects a flag, or a `go` line differs from the one pinned), that is not a
  measure FAIL. QE corrects the spelling inside the measure's meaning, records the correction and the reason on this
  page, and re-runs that run once. A correction that would change what is measured (a different `tc`, a non-default
  option, an opening other than the six FENs) is a STOP to BA/PM.
- **`A3` (M1: protocol and time safety).** **Given** `A2` holds for M1, **when** each of the 6 `Finished game`
  result texts is classified, **then** 0 games end by an illegal move, a time forfeit, a disconnect or a stall, and
  every game ends by a chess result or by `cutechess-cli` adjudication.
  - **Classification is an allow-list.** The strings below come from the source at `5e84232b`
    (`projects/lib/src/board/result.cpp:102–154`, `board/westernboard.cpp:1436–1494`), not from the manual. The
    first run quotes each game's text raw.
    - **Pass:** `White mates`, `Black mates`, `Draw by stalemate`, `Draw by insufficient mating material`,
      `Draw by fifty moves rule`, `Draw by 3-fold repetition`, `Draw by adjudication…`, `… wins by adjudication…`.
    - **FAIL:** `… loses on time`, `Draw by timeout`, `… makes an illegal move…`, `… disconnects`,
      `Draw by disconnection`, `…'s connection stalls`, `Draw by stalled connection`, `No result`, `Result error`.
    - **Anything else** (for example `… resigns` or `… by agreement`) is not graded either way. QE quotes it and
      stops to BA/PM to classify it.
  - **The watchdog.** The M1 run gets **75 minutes** of wall time. If it is still running at that point, QE stops it,
    and the open game counts as a stall. QE may use any watchdog tool, and records which one.
  - **Reported, not graded:** each game's result, its move count, the result text, and its wall time from the log's
    timestamps; the minimum `wtime`/`btime` sent to each side in each game (how close the clock came to zero); the
    number of `isready` lines sent while a `go` was unanswered, if any; and the byte count of each `stderr` file.
    Non-empty `stderr` is quoted.
- **`A4` (M8(a): `go depth` is honoured).** **Given** `A2` holds for M8(a), **then:**
  - both result texts classify as pass, by `A3`'s allow-list, and the M8(a) run finishes inside **20 minutes** of
    wall time (else the open game counts as a stall);
  - for each `go depth 4` in `m8a.out`, take the lines the same engine writes up to its `bestmove`:
    - if they hold `info string book` and no `info … depth` line, it is a **book move**. It is counted and not
      graded;
    - otherwise it is a **searched move**. Its last `info` line that carries `depth` reports `depth` ≤ **4**. A
      searched move with no `depth` line at all fails this check;
  - no line holds `info string skill level … ignores go depth`, because that would mean a level other than 5 played;
  - each game has at least 1 searched move. Otherwise the reading is vacuous, and the state is UNRESOLVED.
  - **Reported:** book moves and searched moves per game, and the histogram of final depths.
- **`A5` (the records).** **Given** `A1`–`A4`, **then:**
  - the raw files are kept under the QE task's context (`raw/`), each with a sha256: `m1-perft.epd`, `m1.out`,
    `m1.pgn`, `m8a.out`, `m8a.pgn`, the four `stderr` files, the exact script that ran both commands, and the host
    log;
  - this page gains one `## Reading` section: S, the machine, the host log, `A1`–`A4` with a state each, and any `A2`
    spelling correction;
  - `EPIC-007`'s page gains one dated line. It gives M1 and M8(a) each as MET, NOT MET or UNRESOLVED, with S, and
    states whether `RISK-EPIC007-01` showed up;
  - no file under `src/`, `tools/`, `data/` or `package*.json` changes.

**The states, per measure:**
- **MET:** every check of its criterion holds.
- **NOT MET:** a check fails on a quiet host (§ Host preconditions).
- **UNRESOLVED:** `A1` failed, a check could not be read, the reading is vacuous, or a FAIL-class result happened on a
  host that was not quiet. The cause is named, and UNRESOLVED is never written as MET.

## Host preconditions (the ruling)

**This reading does not need the owner's quiet window up front.** It needs AC power, and it must run alone among
agent hops.

- **Why no quiet window.** M1's time safety is a **count of faults** (0 forfeits, 0 stalls), not a timing bound. The
  engine plans each move against the wall clock (`ADR-0044` D4: G = min(time/20 + inc/2, time − 50 ms), capped at
  level 5's 3 000 ms). Load from other processes can only delay the engine. It can make a forfeit appear, but it
  cannot hide one. So a PASS on a loaded host is valid, and a quiet host matters only to attribute a FAIL to the
  engine.
- **AC: required at the start.** Check it with `pmset -g batt`. On battery the hop waits. Asking for AC is an
  environment fact, not a decision (`memory-bank/45-standing-rulings.md`, 2026-10-22).
- **Alone: required.** The run keeps about one core busy for most of an hour: the two engine processes alternate, and
  only one thinks at a time. So no other agent hop and no agent `vitest` runs alongside it. That keeps this reading
  clean, and it keeps this run out of any other hop's timing. The Orchestrator schedules it at width 1.
- **Logged, not gating:** load1, `thermalpressurelevel` and foreign `vitest` processes, before M1, after each game
  (from the log's timestamps), and after M8(a).
- **The quiet-window fallback.** Suppose a FAIL-class result happens while the host was not quiet: load1 > 8,
  thermal ≥ 1, a foreign `vitest`, or battery power, at that game. Those are the repo's existing thresholds (`ABC-197`
  test notes; the Orchestrator's registered timing rule `…f8cd47ba`: AC, load1 ≤ 8, thermal pressure 0). That measure is then UNRESOLVED, not NOT MET. **One re-run of that measure in the owner's
  quiet window is owed**, and the Orchestrator asks for the window. The same FAIL on a quiet host is NOT MET.
- **Estimated wall time: about 30–45 minutes typical, about 60 minutes at worst. This is an estimate, not a
  measurement (`UNKNOWN - verify`).**
  - **M1, per game:** each side starts at 60 s. At level 5 a move is planned at ≤ 3 s while the clock is ≥ 50 s. G
    then falls toward the 1 s increment, and the clock settles near 10 s. So each side spends about 50 s plus about
    1 s per move after that. A 60-move game is about 4 minutes. The 200-move cap bounds a game at about
    2 × (60 + 200) s ≈ 8.7 minutes.
  - **M1 total:** 6 games, typically about 25–35 minutes, at most about 52 minutes.
  - **M8(a):** depth 4 at level 5 is expected well under 1 s a move (`NFR-005` reads depth ≥ 6 in 3 s), so about
    1–5 minutes.
  - **Setup:** clone, `npm ci` and build, about 1–2 minutes.
  - The watchdogs (75 and 20 minutes) sit above these bounds.

## Failure route

The reading hop never fixes anything. It records the raw evidence and its state, and it hands to the Orchestrator.

- **An illegal move, or an M8(a) depth above 4** (NOT MET). That is a defect in the session or the engine (`ABC-167`,
  `ABC-170`, `ABC-171`). The Orchestrator routes it to BA/PM, which cuts a fix ticket with the raw log as its
  reproduction. The Software Engineer builds it, and this page's run is the re-reading.
- **A time forfeit, a stall or a disconnect in M1 on a quiet host** (NOT MET). That is `RISK-EPIC007-01` showing up,
  and the risk is `ADR-0044` D5's named trigger for the pre-designed worker. Architect/Design rules first: the worker
  as designed, or a cause elsewhere (for example D4's 50 ms overhead or the cap). **If the ruling needs a new ADR or
  changes an accepted one, it is a STOP to the owner** (owner delegation `…5aaf7cec`). Then BA/PM cuts the ticket.
- **A FAIL-class result on a host that was not quiet** (UNRESOLVED). One re-run in the owner's quiet window, as
  above.
- **A pin that does not hold** (`A2`). QE corrects it in the hop, inside the measure. If the correction changes what
  is measured, it is a STOP to BA/PM.
- **An unclassifiable result text.** It is a STOP to BA/PM, which classifies it.

## NFR triggers

- **`NFR-004`** (≤ 5 s per move): binds each move unchanged. It is not re-read here.
- **`ADR-0044` candidate row (ii), time safety:** read here. It is placed in the catalog by Security/NFR afterwards,
  from this page's pinned command line and reading. That is a follow-up hop and is not owed by this ticket.
- **`NFR-008`:** not touched. 0 test files, 0 spawns in the lane.
- **Security:** no code path changes. `cutechess-cli` is a host tool that the owner built and installed. It is never a
  repo dependency (`EPIC-007` § Test notes). It runs only the artifact built from S, in a scratch clone. `npm ci`
  installs the lock as it stands. No Security/NFR hop is owed.

## Test notes

1. **Out of tree.** Everything runs in the QE hop's scratch folder and a scratch clone. Nothing runs in `main`'s
   checkout or in another worktree.
2. **The run is agent-run, with no human gate** (`…2fddb7fa`, `…b5f65536`). No human watches a game. The raw files are
   the evidence.
3. **Write the script before the run.** The exact two commands, with paths filled in, go into one script file. That
   file is kept raw and hashed (`A5`), so the pinned command line is reproducible byte for byte.
4. **Read the raw files, not the summary.** `A2`–`A4` are read from `m1.out`, `m1.pgn`, `m8a.out` and `m8a.pgn`.
   Quote the first `go` line of each run and one `Finished game` line of each run raw.
5. **Determinism.** Engine against itself with the book on can repeat lines (`RISK-EPIC007-03`). The six FENs and the
   book's per-session draw vary the games. Repetition draws are a pass.
6. **UAT:** 0 production lines, so the UAT is waived. QE's reading note is the evidence. Under the owner delegation
   (`…5aaf7cec`), the Orchestrator rules `EPIC-007`'s card from it.

## Dependencies

- **`cutechess-cli` 1.5.1 at the pinned path.** Present (`…7ea41eea`).
- **AC power, and width 1 among agent hops** (§ Host preconditions). There is no other open timing hop on the board
  at this cut.
- **`npm ci` needs the npm registry or a warm cache.** If neither is reachable, `A1` is UNRESOLVED with the cause
  named, not NOT MET.
- **Builder: QE/E2E**, agent-run. No Software Engineer, Architect or Security/NFR hop is needed unless § Failure route
  fires.
- **No open ticket blocks it.** `ABC-168`, whose UAT first held `A8`/`A9`, is Done. This page carries those two
  readings, and its raw files land under the QE task's context, not under `ABC-168`'s.

## Owner questions

None. The reading measures two existing lines with a pinned host tool. "Default options" is read at `Skill Level` 5,
by the owner-accepted `ADR-0045` D4. The quiet window is asked for only if the fallback fires, as an environment
fact.

## Size and priority

- **Size `XS` (1).** One records-only hop: one clone and build, one six-line file, two pinned commands, and a
  classification of 8 games from raw files, then two record lines. Most of its time is wall-clock play (about
  30–60 minutes), not work.
- **Priority `P2`.** Nothing is broken, and no user waits on it today. But it is the only check of
  `RISK-EPIC007-01` before the owner's backend meets it, and it is the last open measure of `EPIC-007` (a `P1`
  epic). Nothing else is in the timing queue.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `84a59ed6`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ M1 and M8(a) are owed and unread. They are the only check of `RISK-EPIC007-01`, and `EPIC-007` cannot close on its measures without them |
| 2 | scope and out-of-scope clear | ✅ four scope lines. Fixes, M2, M8(b), strength, non-default options, the catalog row and the epic closure are fenced |
| 3 | INVEST-shaped | ✅ independent (no code; no open ticket); valuable alone (it closes or fails two epic lines); estimable (§ Host preconditions); `XS`; testable by game counts, classified result texts and a depth bound |
| 4 | acceptance testable and measurable | ✅ 6 and 2 games; 0 illegal, 0 forfeit, 0 disconnect, 0 stall; an allow-list of result texts; `go depth 4` exact; final depth ≤ 4 per searched move; 75 and 20 minute watchdogs; MET, NOT MET or UNRESOLVED |
| 5 | dependencies known | ✅ binary present and pinned; AC; width 1; registry; builder named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-004` ≤ 5 s unchanged; row (ii) read here and placed later; `NFR-008` untouched (0 files, 0 spawns); no security hop, argued |
| 7 | test notes present | ✅ six |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P2`, argued |
| 10 | no major unresolved blocker | ✅ the tool is installed. AC is an environment fact, and a quiet window is owed only on the fallback |

## Reading

> **QE/E2E addendum, 2026-10-23T13:31–13:53Z** (task `qe-read-ABC-202`, branch `grugops/qe-read-ABC-202`). Agent-run,
> with no human gate. Notes: `.grugops/context/qe-read-ABC-202/notes/` (`…8a2be50b` setup and A1/A2, `…202e80c8` M1,
> `…81066c23` M8(a), `…632c11f1` verdict). Raw files and `SHA256SUMS`: `.grugops/context/qe-read-ABC-202/raw/`.

- **S = `e5c5c2a5`.** `git diff --stat 84a59ed6 e5c5c2a5 -- src data package.json package-lock.json tsconfig.build.json`
  is empty.
- **Machine:** Apple M3, Darwin 25.6.0, macOS 26.7.1 (25G241), `node` `/opt/homebrew/bin/node` `v26.11.1`,
  `cutechess-cli 1.5.1` (Qt 6.12.0). The binary sha256 `fb4fc2aa…6e1c` equals the pin.
- **Host log (`raw/host.log`).** AC throughout.
  - M1 games 1–4: thermal 1–2, a foreign `vitest` from another repo, load1 ≤ 7.85. **Not quiet.**
  - M1 games 5–6 and M8(a): thermal 0, no foreign `vitest`, load1 2.84–4.31.
  - No FAIL-class result occurred, so the non-quiet stretch is immaterial, and no quiet-window re-run is owed.
- **The A2 spelling correction: `-debug` → `-debug all`, in both commands.** Attempt 1 ran exactly the pinned block.
  Both runs exited rc 1 within 5 s, before any engine started, with `Warning: Empty value for option "-debug"`.
  - **Source (`5e84232b`).** A bare `-debug` is stored as `QVariant(true)` (`projects/cli/src/matchparser.cpp:135–138`).
    `main.cpp:482–487` then accepts only `all` or a null value. Under Qt 6, `QVariant(true)` is not null, so the bare
    flag cannot work in this build.
  - **Why it stays inside the measure.** `all` also sends UCI `debug on`, which skytalix ignores (`src/uci-session.ts:383`,
    D3). The engine's output is byte-identical with and without it (`raw/debugcheck-*.out`). No `tc`, option, opening
    or `go` changed, so this is not a STOP.
  - Each run was re-run once with the correction. The script that ran is `raw/run.sh` (sha256 `6562e145…`). Attempt 1's
    script and output are kept as `raw/attempt1-*`.
- **A1: MET.** `npm ci` and `npm run build` rc 0. `dist/uci.js` sha256 `877e9595746aead5019a2e604da2ef0021e2d688168b275d809e572fe8a9b98d`.
  The smoke run exits 0 with `id name skytalix` and `uciok`. Option lines:
  - `option name OwnBook type check default true`
  - `option name Skill Level type spin default 5 min 1 max 5`
- **A2: MET (after the correction).**
  - M1: 6 `Finished game` lines and 6 PGN games. Each game takes the next EPD line, and every `[FEN]` tag equals its
    line (game 1 is the startpos FEN). All 493 `go` lines carry `wtime`, `btime`, `winc 1000` and `binc 1000`. First:
    `go wtime 61000 btime 61000 winc 1000 binc 1000`.
  - M8(a): 2 and 2. Game 1 White and game 2 Black are both `skytalix-a`, and both games start from startpos. All 151 `go`
    lines are exactly `go depth 4`.
  - 0 `setoption` lines were sent in either run.
- **A3 (M1): MET.** Run 13:34:08–13:50:56Z, 1008 s.

  | game | W / B | line | result {text} | plies | wall s | min clock ms |
  |---|---|---|---|---|---|---|
  | 1 | a / b | startpos | 1-0 {White mates} | 127 | 222.6 | 13292 |
  | 2 | b / a | Kiwipete | 1/2-1/2 {Draw by 3-fold repetition} | 68 | 151.6 | 19737 |
  | 3 | a / b | pos 3 | 1/2-1/2 {Draw by 3-fold repetition} | 55 | 131.2 | 23262 |
  | 4 | b / a | pos 4 | 1-0 {White mates} | 51 | 124.4 | 24689 |
  | 5 | a / b | pos 5 | 1/2-1/2 {Draw by 3-fold repetition} | 91 | 182.9 | 15241 |
  | 6 | b / a | pos 6 | 1-0 {White mates} | 101 | 195.2 | 14042 |

  - 0 illegal moves, 0 time forfeits, 0 disconnects, 0 stalls, 0 unknown texts.
  - 0 `isready` lines were sent while a `go` was unanswered.
  - All four `stderr` files are 0 bytes.
  - The watchdog (a bash poll loop) did not fire.
- **A4 (M8(a)): MET.** Run 13:50:56–13:51:06Z, 10 s.
  - Game 1 (a / b): 1-0 {White mates}, 103 plies, 8 book moves, 95 searched.
  - Game 2 (b / a): 0-1 {Black mates}, 48 plies, 12 book moves, 36 searched.
  - Histogram of final depths: `{4: 131}`. No searched move lacks a depth line.
  - 0 `ignores go depth` lines.
- **Verdict per measure:**
  - **M1: MET.**
  - **M8(a): MET.**
  - **`RISK-EPIC007-01`: did not show up.**
  - § Failure route: nothing fires.
- **INFO gaps:**
  - `QE-202-a`: the pinned block and the row (ii) catalog hop should carry `-debug all`.
  - `QE-202-b`: `debug on` is sent, and the engine ignores it.
  - `QE-202-c`: `tc=60+1` sends 61 000 ms on move 1, which is cutechess's own convention.
  - `QE-202-d`: EPIC-007's M1 row text is stale ("Skill Level 3", "ABC-168's context"). It is BA/PM's to refresh.
- **UAT:** waived (0 production lines). The Orchestrator rules the card and EPIC-007 (`…5aaf7cec`).
