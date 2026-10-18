---
id: EPIC-007
title: The engine speaks UCI, so a chess UI can play against it
status: proposed
column: Backlog
priority: P1
size: S
owner: BA/PM
---

# EPIC-007 — The engine speaks UCI, so a chess UI can play against it

_Updated: 2026-10-18 by BA/PM (task `wave-2026-09-25`, subtask `bapm-engine-plan`). PROPOSED. Nothing here
is in `Ready`, and no ticket page exists yet._

> **This epic is a proposal, and it is CONDITIONAL on the owner's answer to `Q1`.** `EPIC-004` § Out of
> scope still reads *"UCI protocol support or driving an external engine such as Stockfish — permanent
> non-goal"*. This page does not edit that sentence. If the owner says yes to `Q1`, BA/PM lifts **the UCI
> half only** of that sentence in `EPIC-004` in the same hop that accepts this epic. The "driving an
> external engine" half stays a non-goal. If the owner says no, this page is marked `rejected` and
> nothing else changes.
>
> **Sources (cited, not restated).** Owner word `…5b37b0bc` (research and plan only, KISS, a web UI as a
> separate project). Design: `ADR-0044` (PROPOSED). Research notes under
> `.grugops/context/arch-engine-research/notes/`: standards `…3f1a9c20`, repo-fit `…7b2e4d18`, decision
> and `Q1`–`Q8` `…c5d07e91`. This hop's notes: `.grugops/context/bapm-engine-plan/notes/`.

## Why a new epic and not an amendment to EPIC-004

- `EPIC-004` is the **opponent** epic. It is `XL`, decomposed into `ABC-074`…`ABC-087`, and its five
  acceptance criteria are about strength. UCI changes none of them. It adds a new way to **reach** the
  same engine.
- Folding UCI into `EPIC-004` would make an `XL` epic bigger and mix a protocol into its strength
  acceptance. It would also make `EPIC-004`'s "done" depend on an owner question it never had.
- A separate epic can be accepted or rejected by itself, and it is small. `EPIC-004` gets a one-sentence
  edit (the non-goal lift) and nothing else.

## The product, in five lines

1. **User:** the owner, building a chess UI (probably web-based, as a separate project), and anyone using
   a standard desktop UCI GUI.
2. **Job:** *"My UI can play a full game against this engine without knowing how the engine works
   inside."*
3. **Pain today:** the engine can only be reached through `npm run chess`, a terminal UI. A GUI cannot
   drive it.
4. **v1:** the engine answers the standard UCI text protocol over stdin/stdout through
   `node src/uci.ts` (`ADR-0044` D2–D4). The core is not edited, and `npm run chess` stays byte-identical.
5. **Value proof:** an unmodified, standard UCI tool plays complete games against it on the owner's Mac,
   with 0 protocol errors and 0 time forfeits.

## v1 — in

- The `ADR-0044` D3 command set: `uci`/`id`/`uciok` (no `option` lines), `isready`/`readyok`,
  `ucinewgame`, `position startpos|fen … moves …`, `go` (`movetime`, clock plus increment, `infinite`
  held until `stop`), `stop`, `quit`. Anything else is ignored.
- The `ADR-0044` D4 time rule. The 5 s ceiling (`NFR-004`) is unchanged.
- One final `info` line and one `bestmove` per `go`. Nothing else goes to stdout.
- An `npm run uci` script line, and an `AGENTS.md` command line (the Scribe's job, at build time).

## v1 — NOT in (each needs the owner's word to come in later)

- Opening book under UCI (`Q4`). Strength control: `Skill Level` / `UCI_Elo` (`Q5`).
- Honouring `go depth` / `nodes` / `mate` / `searchmoves` (`Q6`). They are parsed and ignored, with one
  `info string` line saying so.
- An immediate `readyok` or `stop` **during** a search. In v1 they come at most one budget (≤ 5 s) late
  (`ADR-0044` D5). The worker upgrade is pre-designed and is built only on a named trigger.
- Analysis longer than 5 s per move (`Q3`). Pondering. MultiPV. A `Hash` option. Chess960. CECP/xboard.
- Any web server, WebSocket, bundler, WASM build or npm package **in this repo**.
- The web UI itself. It belongs to a separate project (see § The web-UI project's boundary).
- A Lichess bot or Lichess external engine. Those need `go depth`/`nodes` and Chess960 (research note
  `…3f1a9c20` § 3).

## Success measures (each says how it is read and on what host)

**Host for every measure:** the owner's Mac. Read at this hop: Apple M3, Node `v26.11.1`. Each reading
records the host it ran on. A reading from another host is labelled as one.

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Protocol and time safety in `cutechess-cli`** | 6 games (one per perft FEN pinned in `src/perft.test.ts:21-52`: startpos, Kiwipete, positions 3–6, given as an EPD opening file), engine against itself, `proto=uci`, `tc=60+1`: **0 illegal moves, 0 time forfeits, 0 disconnects or stalls**; every game ends by a chess result (mate, stalemate or a draw rule) or by cutechess adjudication | `cutechess-cli`'s per-game result lines plus the `-pgnout` file, kept as a raw file under the ticket's context. The exact termination strings cutechess prints are `UNKNOWN - verify` and get pinned on the first run. **`cutechess-cli` is NOT installed on this host** (`which cutechess-cli` printed nothing at this hop). See `Q10` |
| M2 | **A full human game in a desktop UCI GUI** | the owner plays one complete game against the engine in **En Croissant** (free; runs on macOS). It ends by mate, resignation or a draw, with no GUI error dialog and no engine time loss | the owner's word at `ABC-168`'s UAT. Recorded as a transcription, never a stamp (`AGENTS.md` § Test and UAT authority). Arena is a Windows/Linux GUI, and whether it runs on macOS is `UNKNOWN - verify`, so it is not the v1 GUI |
| M3 | **Idle responsiveness** | from process start to `uciok` ≤ 2 s, and `isready` to `readyok` ≤ 100 ms when idle (a **proposed** target) | the opt-in real-child lane in `ABC-168`. Security/NFR places it as `ADR-0044` candidate row (i) and may change the number |
| M4 | **Stdout hygiene** | 100 % of stdout lines begin with an engine-to-GUI keyword (`id`, `uciok`, `readyok`, `info`, `bestmove`) | the session tests (`ABC-167`) and the real-child lane (`ABC-168`). Candidate row (iii) |
| M5 | **The terminal game is unchanged** | 0 changed lines in the `ADR-0044` D2 "no edit" list, and the existing `src/cli*.test.ts` suites pass unedited | `git diff --stat <base> <head>` on that list, plus the gate run |

M1 is time safety, candidate row (ii). It is **not** a strength claim. No Elo is claimed (`EPIC-004`
§ Test notes).

## Proposed tickets (ids RESERVED; no page is cut; none enters Ready before `Q1`)

The plan uses the fewest tickets that still keep one INVEST slice each. It is two tickets for v1, plus one
conditional ticket outside v1.

| order | id | title | size | depends on | gated by | Security/NFR hop |
|---|---|---|---|---|---|---|
| 1 | `ABC-167` | `src/uci-session.ts`: a capability-free UCI session that answers the `ADR-0044` D3 commands with the D4 time rule | **S** | none (the core exists) | `Q1`; scope fixed by `Q3`–`Q6` at their recommended answers | **No.** (b1) does not fire because the session holds no limb. (b2) does not fire because none of the modules it imports (`fen`, `coordinate-move`, `apply`, `engine`, `position`, `search`, `transposition`) holds a limb. The one grep hit, `coordinate-move.ts:91`, is `RegExp.exec`, not `child_process`. QE confirms this as a review check (`ADR-0044` § Consequences) |
| 2 | `ABC-168` | `node src/uci.ts`: the entry point a GUI launches (readline, `EPIPE` arm, exit `0`/`1`/`70`, `npm run uci`), one opt-in real-child lane, and the M1/M2 play-test at UAT | **XS** | `ABC-167` | `Q1`, and `Q10` (who installs `cutechess-cli` and En Croissant) for UAT | **Yes.** `ADR-0036` (b1) fires on `process.` and `node:readline`, so it routes through `In Security/NFR`. Security/NFR places candidate rows (i)–(iii) in `plans/nfr-catalog.md` |
| — | `ABC-169` | Add the licence the owner picks (`LICENSE` plus the `package.json` `license` field) | **XS** | none | `Q8`. **Outside v1.** Cut only when the web project needs this repo's code, not just its process | No (0 production lines). The UAT waiver applies by measurement |

**Why two tickets and not one.** `ABC-167` has value on its own. It is exactly what a web UI would bundle
into a Web Worker (`ADR-0044` D8 route b), and it tests without a process. `ABC-168` is the only ticket that
touches `process`, so the Security/NFR hop covers one small file. Merging them would put that hop over both
files and give nothing back.

**Acceptance sketches (the full Given/When/Then is written when each ticket is cut):**

- `ABC-167`:
  - `uci` gives exactly `id name cli-chess`, `id author …` (`Q9`), `uciok`, and no `option` line;
  - `isready` gives `readyok`;
  - after `position startpos moves e2e4 e7e5` and `go movetime 100`, there is one `info … pv X` line and
    one `bestmove X`, and `X` is legal in that position;
  - a bad FEN or a bad move holds no position and writes one `info string` line, and the next `go`
    gives `bestmove 0000`;
  - `wtime 60000 winc 1000` reaches `choose` as a 3 500 ms budget;
  - `go infinite` writes no `bestmove` until `stop`, then exactly one;
  - a mate score is written as `score mate ±M`;
  - `setoption`, `debug` and unknown lines produce no output;
  - the file holds no `ADR-0036` limb token and imports none of `history.ts`, `turn-loop.ts`,
    `book-file.ts` or `line-input.ts`;
  - M4 and M5 hold.
- `ABC-168`:
  - `node src/uci.ts` with any argument exits `1`;
  - `quit` or end of input exits `0`;
  - a closed stdout exits `0` (the `EPIPE` arm);
  - the opt-in lane runs one scripted dialogue against the real child, and M3 is read from it;
  - M1 and M2 are read at UAT;
  - `npm run chess` is unchanged (M5).

## Owner questions (each has a recommended KISS answer, so "accept recommendations" is a full reply)

| # | question | recommended answer | why |
|---|---|---|---|
| Q1 | Accept UCI, which lifts the UCI half of `EPIC-004`'s "permanent non-goal"? | **Yes.** Lift the UCI half only | Every UI and tool route in the research speaks UCI (`…3f1a9c20` § "What falls out" 2) |
| Q2 | What is the engine for first? | **Humans playing in your UI.** Analysis, engine testing and Lichess come later | It is the job you named. It also keeps `Q3`–`Q6` at "no" |
| Q3 | Keep the 5 s ceiling for UCI? | **Keep it** | It needs no worker and no `NFR-004` re-scope. A human game needs no 30 s analysis |
| Q4 | Book under UCI? | **Off in v1** | No option and no `fs` in the session. Your moves vary the game, and the engine's determinism is a known, stated weakness |
| Q5 | Strength control? | **None in v1.** `Skill Level` 1–5 is the first follow-up if your UI needs a beginner level | It is one option over the existing `LEVELS`, and it is cut only on your word (`ADR-0024` d7) |
| Q6 | Honour `go depth` / `nodes`? | **No.** Parse them, ignore them, say so in `info string` | Only the Lichess route needs them, and Lichess is not v1 |
| Q7 | How does the web project get the engine? | **Not decided now. For its first version, the web project spawns `node <clone>/src/uci.ts` through its own small bridge (route a)**, so nothing is copied or packaged | It needs only a path to a clone, which is `ADR-0018`'s channel unchanged, and it keeps `Q8` deferred. **This differs from `ADR-0044` D8**, which recommends route (b), the Web Worker, for a single-user UI. Both work. (a) needs nothing more from this repo; (b) needs the code shared, and so needs `Q8` first |
| Q8 | Licence? | **Defer. v1 needs none**, because a GUI runs it as a local process. Pick one before any code leaves this repo (`ABC-169`). If you want a starting point, a permissive licence such as MIT leaves the web project free to choose GPL-3.0 parts such as chessground. This is your legal choice, not a BA/PM fact | It moves nothing in v1 |
| Q9 | What should `id name` / `id author` say? | **`id name cli-chess`**, from `package.json`, and **`id author Olger Oeselg`** | It invents nothing. Rename later at no cost |
| Q10 | Who installs `cutechess-cli` and En Croissant on your Mac for M1/M2? | **You install both** (host tools, not repo dependencies). The agent then runs M1, and you play M2 | Installing software on your machine is your call. Whether a Homebrew formula exists is `UNKNOWN - verify` |
| Q11 | Is v1 done when M1–M5 pass on your Mac, with no web UI involved? | **Yes** | The web UI is a separate project. This epic is done when a standard GUI can play the engine |

## The web-UI project's boundary

**The only interface between the two projects is UCI text lines** (`ADR-0044` D3). That project:

- **owns:**
  - the board, pieces, drag and drop, and move input;
  - its own move-legality checks for input and highlighting (UCI has no "is this legal" query);
  - the game record: moves, PGN, take-back, and results (in UCI the GUI holds the game);
  - the clocks and the time control, sent as `go wtime/btime/winc/binc` or `go movetime`;
  - the route to the engine: (a) its own bridge server that spawns `node src/uci.ts` and relays lines
    over a WebSocket, or (b) bundling `uci-session.ts` into a Web Worker;
  - its bundler, hosting, deploy, accounts, accessibility, any difficulty UI, and its own licence.
- **does NOT get from this repo:** an HTTP or WebSocket server, a bundle, a WASM build, an npm package,
  UI-specific commands, or any change to the core. Each of those is either rejected (`ADR-0044`
  § Alternatives 4 and 11) or belongs to `EPIC-006` and `Q7`.
- **can rely on this repo for:** legal `bestmove` output, one `bestmove` per `go`, the 5 s ceiling, and a
  session that holds no capability, so route (b) needs no fork.

## Dependencies

- `EPIC-004`: the engine (`chooseMove`). It is delivered; nothing new is needed from it.
- `EPIC-001`: FEN, coordinate moves, `makeMove`. Delivered.
- `ADR-0044` must be **accepted** before `ABC-167` can be cut into `Ready`.

## Risks

- `RISK-EPIC007-01`: a GUI's handshake timeout or `isready` ping fires during a ≤ 5 s search (`ADR-0044`
  D5). It shows up as an M1 disconnect or an M2 error. That is the named trigger for the worker.
- `RISK-EPIC007-02`: M1 cannot be read until `cutechess-cli` is installed (`Q10`). Until then, M1 is
  `UNKNOWN - verify`, and `ABC-168`'s UAT waits.
- `RISK-EPIC007-03`: deterministic replies (book off, `ADR-0027` d1) make engine-against-itself games
  repeat. M1 avoids this by starting from six different FENs.

## NFR triggers

- `NFR-004` binds unchanged through the engine's clamp.
- `NFR-008`: +1 default-lane file (`ABC-167`). Spawns run only in `ABC-168`'s opt-in lane.
- `ADR-0044` candidate rows (i) idle responsiveness (M3), (ii) time safety (M1), and (iii) stdout hygiene
  (M4) are placed by Security/NFR at `ABC-168`. This page does not edit the catalog.

## Test notes

- Session tests run on the virtual clock (`ADR-0027`) and spawn nothing.
- The real child runs only in an opt-in lane, following the `ABC-119` precedent: unset means NOT DEFINED.
- Perft stays the move-generation standard and is not re-run for this epic.
- No strength or Elo is measured here.
