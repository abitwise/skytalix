---
id: 20261018T074200Z-architect-design-observation-chess-engine-standards-read-on-the-primary-sources-3f1a9c20
kind: observation
by: architect-design
at: 2026-10-18T07:42:00Z
verified_by:
confidence: high
refs:
  - ADR-0044
  - EPIC-004
  - EPIC-006
  - NFR-004
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
supersedes:
---

# CHESS-ENGINE STANDARDS, READ ON THE PRIMARY SOURCES, 2026-10-18

**These are neutral facts, not a recommendation.** The recommendation is `ADR-0044` (PROPOSED). Each quote
was read on 2026-10-18 through `WebFetch` at the URL given. Nothing was downloaded into the repository.
Where a page did not say something, it is marked `UNKNOWN - verify` or "not stated". A secondary source is
labelled as one.

## 1. UCI, the Universal Chess Interface

- **Source.** <https://backscattering.de/chess/uci/>, which describes itself as *"a copy of the April 2006
  version of the UCI standard, written by Rudolf Huber and Stefan-Meyer Kahlen"*. The text originally
  shipped as `http://download.shredderchess.com/div/uci.zip`, according to a mirror's header found by
  search.
- **Origin and licence.** <https://www.shredderchess.com/chess-features/uci-universal-chess-interface.html>:
  *"The UCI protocol was developed in 2000 by Rudolf Huber and Stefan Meyer-Kahlen."* *"The protocol is
  open and can be used by everyone without license fees."*
- **General rules:**
  - *"the engine must always be able to process input from stdin, even while thinking."*
  - *"if the engine or the GUI receives an unknown command or token it should just ignore it"*.
  - *"all command strings the engine receives will end with `\n`"*.
  - The engine *"should never start calculating or pondering without receiving a `go` command first."*
  - *"there will always be a `position` command to tell the engine about the current position."*
- **The handshake.**
  - On `uci`, the engine *"must identify itself with the `id` command"*. It then sends *"the `option`
    commands to tell the GUI which engine settings the engine supports if any"*.
  - `uciok` *"Must be sent after the `id` and optional options"*.
  - *"If no `uciok` is sent within a certain time period, the engine task will be killed by the GUI."*
- **`isready`.** *"This command must always be answered with `readyok`"*. It *"can be sent also when the
  engine is calculating in which case the engine should also immediately answer with `readyok` … without
  stopping the search."*
- **`ucinewgame`.** It is *"sent to the engine when the next search (started with `position` and `go`)
  will be from a different game."* If the GUI never sends one before the first `position`, *"the engine
  shouldn't expect any further `ucinewgame` commands."*
- **`position [fen <fenstring> | startpos] moves …`.** *"set up the position described in fenstring on the
  internal board and play the moves on the internal chess board."*
- **`go` and its sub-parameters:**
  - `searchmoves`, `ponder` (*"Do not exit the search in ponder mode, even if it's mate!"*);
  - `wtime` / `btime` (*"msec left on the clock"*), `winc` / `binc`, `movestogo`;
  - `depth` (*"search x plies only."*), `nodes`, `mate`;
  - `movetime` (*"search exactly x mseconds"*);
  - `infinite` (*"search until the `stop` command. Do not exit the search without being told so in this
    mode!"*).
- **`stop`, `ponderhit` and `quit`.**
  - `stop`: *"stop calculating as soon as possible"*, and *"don't forget the `bestmove`"*.
  - `ponderhit`: *"switch from pondering to normal search."*
  - `quit`: *"quit the program as soon as possible"*.
- **`bestmove`.** *"for every `go` command a `bestmove` command is needed!"* It *"must always be sent if
  the engine stops searching"*. The `ponder <move>` token is optional, and *"The engine must not start
  pondering automatically."*
- **`info`** (none of it is mandatory):
  - `depth`, `seldepth` (which needs `depth` in the same line), `time`, `nodes`, `pv`, `multipv`;
  - `score cp` (*"from the engine's point of view in centipawns"*);
  - `score mate` (*"mate in y moves, not plies … If the engine is getting mated use negative values"*);
  - `lowerbound` / `upperbound`, `currmove`, `hashfull`, `nps`, `string`.
- **Standard options** (all optional; an engine may advertise none):
  - `Hash` (MB), `Ponder`, `OwnBook`, `MultiPV` (default 1);
  - `UCI_Chess960`, `UCI_LimitStrength` / `UCI_Elo`, `UCI_AnalyseMode`.
  - The option types are `check`, `spin`, `combo`, `button` and `string`. `setoption` *"will only be sent
    when the engine is waiting."*
- **Move format.**
  - *"The move format is in long algebraic notation."* Examples: *"`e2e4`, `e7e5`, `e1g1` (white short
    castling), `e7e8q` (for promotion)"*.
  - A null move is *"`0000`"*.
  - In Chess960 mode, castling is king-takes-rook: *"`e1h1` for the white short castle move in the normal
    chess start position."*
- **`debug`, `register`, `copyprotection`.** `register` is needed only after the engine reports
  `registration error`. None of these is needed by an engine that does not use them.

## 2. CECP, the xboard/WinBoard protocol

- **Source.** <https://home.hccnet.nl/h.g.muller/engine-intf.html>. The GNU copy at
  <https://www.gnu.org/software/xboard/engine-intf.html> returned HTTP 429/403 on 2026-10-18.
- **Title and version.** *"Chess Engine Communication Protocol"*, *"Version 2; implemented in xboard/WinBoard
  4.2.1 and later. (Sept 3, 2009)"*, by *"Tim Mann & H.G.Muller"*.
- **The engine holds state and plays a side:**
  - `force`: *"Set the engine to play neither color ("force mode"). Stop clocks."*
  - `go`: *"Leave force mode and set the engine to play the color that is on move."*
  - `new`: *"Reset the board to the standard chess starting position."*
- **Moves.** By default, moves arrive as bare lines. With `usermove=1` they arrive as `usermove MOVE`. The
  engine answers `move MOVE` (*"send only new moves made by the engine"*).
- **Time.** `level MPS BASE INC`, `st`, `sd` (*"limit its thinking to DEPTH ply"*), and `time` / `otim`
  (*"a clock that always belongs to the engine / … opponent"*).
- **Negotiation.** `protover 2`, then `feature … done=1` (*"To end this timeout and avoid the wait"*), and
  `ping N` → `pong N`.
- **SIGINT.** *"basically tailored to the needs of GNU Chess 4 on systems where its input polling code is
  broken or disabled"* and *"this grungy feature"*.

## 3. How UIs and tools talk to an engine

- **Stockfish.js** (<https://github.com/nmrugg/stockfish.js>):
  - `new Worker("stockfish-19-lite-single.js")`, `worker.postMessage("uci")`, `worker.onmessage = …`. It
    speaks UCI *"over `postMessage` in the browser"*.
  - WASM and asm.js builds exist. *"The multi-threaded engines need the page to be cross-origin isolated
    so that `SharedArrayBuffer` is available"*, which takes COOP/COEP headers. *"The single-threaded
    engines run without those headers"*.
  - *"Stockfish.js engine code is GPL v3"*.
- **MDN** (<https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers>): *"Web
  Workers are a simple means for web content to run scripts in background threads. The worker thread can
  perform tasks without interfering with the user interface."*
- **Lichess external engine** (<https://github.com/lichess-org/external-engine>, headed *"External engine
  (alpha 2)"*; *"The protocol is subject to change."*). The reference provider
  (<https://raw.githubusercontent.com/lichess-org/external-engine/main/example-provider.py>):
  - spawns the engine and sends `uci`, `isready`, `setoption name … value …`, `ucinewgame`,
    `position fen {initialFen} moves …`, `go {movetime|depth|nodes} N` (never `go infinite`), then `stop`
    on early end;
  - sets `UCI_AnalyseMode true` and `UCI_Chess960 true` **unconditionally**, and `Threads`, `Hash`,
    `MultiPV` per job;
  - forwards only `info` lines that contain `score`, and ends a job on `bestmove`;
  - registers through `POST /api/external-engine` and takes work from `/api/external-engine/work`.
  - Whether Lichess then sends castling as `e1h1` to such an engine is `UNKNOWN - verify`.
- **lichess-bot** (<https://github.com/lichess-bot-devs/lichess-bot>): *"a free bridge between the
  Lichess Bot API and chess engines"*, supporting *"UCI, XBoard, and Homemade engines"*.
- **chessground** (<https://github.com/lichess-org/chessground>): *"a free/libre open source chess UI
  developed for lichess.org"*, with *"No chess logic inside"*, licensed *"GPL-3.0 … (or any later
  version)"*. Engines are not mentioned.
- **Node `worker_threads`** (<https://nodejs.org/api/worker_threads.html>): *"useful for performing
  CPU-intensive JavaScript operations"*, and they *"can share memory … sharing `SharedArrayBuffer`
  instances"*. Worker `stdin`: *"By default, no data is provided."*

## 4. Engine conventions

- **Perft** (<https://www.chessprogramming.org/Perft_Results>): *"detailed perft results for several
  positions that are useful for debugging"*. Startpos counts for depths 1–5 are 20 / 400 / 8 902 /
  197 281 / 4 865 609. Kiwipete counts are 48 / 2 039 / 97 862 / 4 085 603 / 193 690 690.
- **Time management** (<https://www.chessprogramming.org/Time_Management>):
  - *"A basic time management technique is to use base / 20 + increment / 2 time per move."*
  - *"Typically programs estimate the game will last further 25..40 moves"*.
  - It describes a soft and a hard bound, with the hard bound *"checked periodically, usually by every set
    amount of nodes."*
- **EPD** (<https://www.chessprogramming.org/Extended_Position_Description>): the first four FEN fields
  plus opcodes `bm`, `am`, `id`, `c0`–`c9`, `acd` and `ce`. It is used by test suites such as
  Bratko-Kopec.
- **STS** (<https://www.chessprogramming.org/Strategic_Test_Suite>): *"themed test suites by Dann Corbit
  and Swaminathan Natarajan"*, 15 themes, one EPD file each. The position count is not stated on the page.
- **cutechess-cli** (`docs/cutechess-cli.6.txt` in <https://github.com/cutechess/cutechess>):
  - `proto=[uci | xboard]`;
  - `-sprt elo0=E0 elo1=E1 alpha=<alpha> beta=<beta>` (*"Use a Sequential Probability Ratio Test as a
    termination criterion for the match."*);
  - `-openings file=… format=[epd | pgn]`, `-concurrency n`, `tc=`.
- **Fishtest SPRT**
  (<https://official-stockfish.github.io/docs/fishtest-wiki/Fishtest-Mathematics.html>): *"Fishtest uses
  the GSPRT, a generalization of the standard SPRT"*, with bounds in *"normalized Elo"*. The exact LLR
  bounds were not on that page (`UNKNOWN - verify`).
- **CCRL** (<https://computerchess.org.uk/ccrl/4040/>, titled *"CCRL - Index"*): *"Time control: Equivalent
  to 40 moves in 15 minutes on an Intel i7-4770k."* *"Ponder off, General book (up to 12 moves), 3-4-5
  piece EGTB"*.
- **CEGT.** The site's TLS failed on 2026-10-18. From a secondary source
  (<https://chessprogramming.org/CEGT>, via search): the time controls include 40/120, 40/20, 40/20 with
  ponder, 5+3 with ponder, and 40/4. The testing conditions are `UNKNOWN - verify`.
- **Stockfish's own UCI docs.** The wiki page <https://github.com/official-stockfish/Stockfish/wiki/UCI-&-Commands>
  did not render through `WebFetch`, so its option table is `UNKNOWN - verify`. Nothing in `ADR-0044`
  depends on it.

## What falls out, stated as facts

1. UCI requires no options and no `info` lines. The required core is `uci`/`id`/`uciok`,
   `isready`/`readyok`, `position`, `go`, `stop`, `quit`, `bestmove`, and ignoring anything unknown.
2. Every UI or tool route in §3 speaks UCI. `cutechess-cli` and `lichess-bot` also speak CECP, and nothing
   in §3 requires CECP.
3. The spec wants `isready` and `stop` handled during a search. That is the one place a single-threaded,
   synchronous engine falls short, and it falls short by its budget.
4. Lichess's provider sets `UCI_Chess960` unconditionally and uses `go depth`/`nodes`. An engine that
   targets that route will meet both.
