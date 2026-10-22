---
id: EPIC-007
title: The engine speaks UCI as `skytalix`, so a chess UI can play against it
status: accepted
accepted: 2026-10-18, owner (note `…c3e81a57`)
column: Backlog
priority: P1
size: M
owner: BA/PM
---

# EPIC-007 — The engine speaks UCI as `skytalix`, so a chess UI can play against it

> **ACCEPTED, 2026-10-18, by the owner.** Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"License: let's keep private for now ; Q14: keep it ; Q15: picked private ; accept
> the revised ADR-0044 and EPIC-007 ; ABC-166 - not yet, it is not evening yet."*
>
> - **The licence is private, all rights reserved** (`"private": true`, `"license": "UNLICENSED"`). The repo gets no
>   open-source `LICENSE`. This supersedes the AGPL-3.0 reading below (Q12) and the GPL-3.0 reading before it (Q8).
> - **`ABC-169` is re-scoped** to "Declare the engine private". **M10** is rewritten to match.
> - **Q12–Q15 are answered** (§ Owner questions).
> - The DoR item "owner acceptance" is met on `ABC-167`…`ABC-172`. Each is now 10 of 10. They enter `Ready` only as far
>   as Ready's WIP limit (8) allows. Column moves are the Orchestrator's.
>
> _Updated: 2026-10-18 by BA/PM (task `wave-2026-09-25`, subtask `bapm-epic007-accept`), at `main` `50e081fc`. Where
> the text below still says AGPL-3.0, `LICENSE` or "pending `arch-licence-eval`", this box and the rows marked
> **(2026-10-18, private)** win._

_Updated: 2026-10-18 by BA/PM (task `wave-2026-09-25`, subtask `bapm-engine-revise`). **Revised against the owner's
answers to Q1–Q11, and then to Q12 and Q13 (owner word `…6b2d90f1`, which arrived during this hop).** Still PROPOSED:
the owner must accept this revision and the revised `ADR-0044`. Six ticket pages are cut in `Backlog` as proposals, and
none is in `Ready`. Size corrected from `S` to `M`: the plan is now three `XS` and three `S` tickets, where the first
version had two `XS` and one `S`._

_Created: 2026-10-18 by BA/PM (subtask `bapm-engine-plan`, `4a98860c`), conditional on Q1._

> **Q1 is answered yes.** The UCI half of `EPIC-004` § Out of scope is lifted at this hop, and `EPIC-004` cites the
> owner-word note. The "driving an external engine" half stays a permanent non-goal.
>
> **Sources (cited, not restated).**
> - Owner word: `…5b37b0bc` (research and plan only, KISS), **`…a41c7e02` (the Q1–Q11 answers)** and **`…6b2d90f1`
>   (Q12: AGPL-3.0 "if possible", kit files MIT; Q13: rename yes)**. All three are under
>   `.grugops/context/wave-2026-09-25/notes/`; `…6b2d90f1` is on `main` from `930a812c`.
> - Licence evaluation: the Architect's `arch-licence-eval` hop (in flight at this hop) decides Q12(a) and Q12(c). This
>   page does not evaluate the licence.
> - Design: `ADR-0044`, **revised and still PROPOSED** (D1–D13). The Architect's revision note is
>   `.grugops/context/arch-engine-revise/notes/20261018T095000Z-architect-design-decision-adr-0044-revised-book-levels-go-limits-skytalix-artifact-gpl-e4a7c912.md`.
> - First-version research: `.grugops/context/arch-engine-research/notes/` (`…3f1a9c20`, `…7b2e4d18`, `…c5d07e91`).
> - BA/PM: `.grugops/context/bapm-engine-plan/notes/` (first version) and
>   `.grugops/context/bapm-engine-revise/notes/` (this revision).

## What changed in this revision

| owner's answer | what changed here |
|---|---|
| Q1–Q3: as recommended | No change. UCI only, a human in the owner's UI comes first, and the 5 s ceiling stays |
| Q4: book on in v1 | `OwnBook` (default on) moves from "NOT in" to "in" (`ADR-0044` D10). New measure **M6** |
| Q5: strength control in v1 | `Skill Level` 1–5 moves in (D11). New measure **M7** |
| Q6: honour what the engine can do | `go depth`, `nodes` and `mate` move in (D12). They need one small edit to `src/engine.ts`, which gets its own ticket, **`ABC-170`**. New measure **M8** |
| Q7: the UI's own backend spawns the CLI | The bridge is the web project's backend, which is out of this repo. This repo ships a **built artifact**, `dist/uci.js`, with the `bin` `skytalix` (D8). New measure **M9** |
| Q8: GNU GPL v3, then **Q12: AGPL-3.0 "if possible"** | `ABC-169` (licence) moves into v1 and now declares **AGPL-3.0**, pending `arch-licence-eval`. New measure **M10** |
| Q9: name `skytalix` | `id name skytalix`, `id author Olger Oeselg`, `bin skytalix` |
| **Q13: rename yes** | New ticket **`ABC-172`** renames the package and every in-repo name to `skytalix`. Renaming the directory and any remote is an owner step. New measure **M11** |
| **(2026-10-18, private) "keep private for now"; Q14 "keep it"; Q15 "picked private"; accept** | `ABC-169` re-scoped: `"license": "UNLICENSED"` next to the existing `"private": true`, plus the Michniewski credit comment in `src/evaluate.ts`. No `LICENSE` or `NOTICE`. M10 rewritten. `npm run chess` keeps its name. EPIC-007 ACCEPTED |
| Q10: the owner installs both tools | M1 and M2 no longer wait on an open question |
| Q11: v1 is done without the web UI | v1 is done when M1–M11 pass on the owner's Mac |

## Why a new epic and not an amendment to EPIC-004

- `EPIC-004` is the **opponent** epic. It is `XL`, decomposed into `ABC-074`…`ABC-087`, and its five acceptance criteria
  are about strength. UCI changes none of them. It adds a new way to **reach** the same engine.
- Folding UCI into `EPIC-004` would make an `XL` epic bigger and mix a protocol into its strength acceptance.
- `EPIC-004` gets one sentence edited (the non-goal lift) and nothing else.

## The product, in five lines

1. **User:** the owner, who is building a chess UI (web-based, a separate project with its own backend), and anyone
   using a standard desktop UCI GUI.
2. **Job:** *"My UI's backend can run this engine as a program and play a full game against it, at a strength I pick,
   without knowing how the engine works inside."*
3. **Pain today:** the engine can only be reached through `npm run chess`, a terminal UI. No GUI or backend can drive it.
4. **v1:** `skytalix`, a built program (`npm run build` → `dist/uci.js`) that answers the standard UCI text protocol on
   stdin and stdout. It plays from its opening book, offers `Skill Level` 1–5, and honours `go` time, `depth`, `nodes`
   and `mate`. `npm run chess` is unchanged.
5. **Value proof:** an unmodified, standard UCI tool plays complete games against the built artifact on the owner's
   Mac with 0 protocol errors and 0 time forfeits, and the owner plays a full game in a desktop GUI.

## v1 — in

- **The `ADR-0044` D3 command set:** `uci` (with `id name skytalix`, `id author Olger Oeselg` and two `option` lines),
  `setoption`, `isready`, `ucinewgame`, `position startpos|fen … moves …`, `go`, `stop`, `ponderhit` and `quit`.
  Anything else is ignored.
- **`go`:** `movetime`, clock plus increment (`movestogo` included), `infinite` held until `stop`, and **`depth`,
  `nodes` and `mate`** (D12). The D4 time rule applies. The 5 s ceiling (`NFR-004`) is unchanged.
- **Options:** `OwnBook` (`check`, default `true`, D10) and `Skill Level` (`spin`, default 3, range 1–5, D11). No other
  option is offered.
- **One small engine edit:** two optional `EngineOptions` fields, `maxDepth` and `maxNodes` (D12). When they are absent,
  the engine is today's engine node for node.
- **The artifact:** `tsconfig.build.json`, `npm run build` → `dist/uci.js`, `"bin": { "skytalix": "dist/uci.js" }`, and
  `npm run uci` for development (D8). The book is read from the clone's `data/`.
- **The licence (2026-10-18, private):** the engine is private, all rights reserved. `package.json` gets
  `"license": "UNLICENSED"` next to its existing `"private": true`, and the `src/evaluate.ts` header credits Tomasz
  Michniewski's tables in a comment (`ABC-169`). No `LICENSE` or `NOTICE` file is added. The four kit files in
  `tools/grugops/` stay MIT and are not edited (none carries an in-file MIT notice, read at `50e081fc`).
  - *Superseded:* `LICENSE` (**AGPL-3.0**, pending `arch-licence-eval`) and the `package.json` `license` field (D13 as
    amended by Q12), with one sentence in `LICENSE` excluding the kit files.
- **The rename:** the npm package and every in-repo name become `skytalix` (Q13, `ABC-172`).
- One final `info` line and one `bestmove` per `go`. Diagnostics are `info string` lines. Nothing else goes to stdout.
- An `AGENTS.md` command line for `npm run uci` and the new meaning of `npm run build`. This is the Scribe's job, at
  build time.

## v1 — NOT in (each needs the owner's word to come in later)

- An immediate `readyok` or `stop` **during** a search. In v1 they come at most one budget (≤ 5 s) late (`ADR-0044`
  D5). The worker upgrade is pre-designed and is built only on a named trigger.
- `searchmoves`, which is ignored with one `info string`.
- `depth`, `nodes` and `mate` at `Skill Level` 1 and 2, which are ignored with one `info string` (D11).
- Analysis longer than 5 s per move (Q3), pondering, MultiPV, `Hash`, `Threads`, `UCI_Elo`, Chess960 and CECP/xboard.
- **In this repo:** any web server, WebSocket, router, bundler, Web Worker bundle, WASM build, native single binary,
  `npm publish`, or install from a git URL.
- Renaming the repository directory or a git remote. Those are the owner's steps (`ABC-172` lists them).
- The web UI and its backend (see § The web-UI project's boundary).
- A Lichess bot or Lichess external engine. Those also need Chess960 (research note `…3f1a9c20` § 3).

## Success measures (each says how it is read and on what host)

**Host for every measure:** the owner's Mac. Read at the first hop: Apple M3, Node `v26.11.1`. Each reading records the
host it ran on, and a reading from another host is labelled as one. **"The artifact"** below means `node dist/uci.js`
in a clone after `npm ci && npm run build`, or `skytalix` after `npm link` in that clone.

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Protocol and time safety in `cutechess-cli`** | 6 games against the artifact, one per perft FEN pinned in `src/perft.test.ts:21-52` (startpos, Kiwipete, positions 3–6, given as an EPD opening file). Engine against itself, `proto=uci`, `tc=60+1`, default options (book on, `Skill Level` 3). **0 illegal moves, 0 time forfeits, 0 disconnects or stalls.** Every game ends by a chess result or by cutechess adjudication | `cutechess-cli`'s per-game result lines plus the `-pgnout` file, kept as raw files under `ABC-168`'s context. The exact termination strings and flag spellings are `UNKNOWN - verify` and are pinned on the first run. The owner installs `cutechess-cli` (Q10) |
| M2 | **A full human game in a desktop UCI GUI** | The owner plays one complete game against the artifact in **En Croissant**. It ends by mate, resignation or a draw, with no GUI error dialog and no engine time loss. The GUI lists `OwnBook` and `Skill Level` among the engine's options | The owner's word at `ABC-168`'s UAT, recorded as a transcription and never as a stamp (`AGENTS.md` § Test and UAT authority). Whether En Croissant shows engine options on a settings screen is `UNKNOWN - verify` at UAT. If it does not, the second sentence is read from M1's `-debug` log instead |
| M3 | **Idle responsiveness** | From process start to `uciok` ≤ 2 s (no file is read before `uciok`). The **first** `isready` to `readyok`, book load included, ≤ 1 000 ms. Any later idle `isready` to `readyok` ≤ 100 ms. All three are **proposed** targets | One QE hand reading in `ABC-168`, by an async probe outside vitest (`ABC-168` test note 6), recording host and load1. Security/NFR places it as `ADR-0044` candidate row (i) and may change the numbers. The book-load cost on this host is `UNKNOWN - verify` until that probe reads it. *(Reworded 2026-10-21, owner-confirmed, `…4ab163ef`; superseded text: "The opt-in real-child lane in `ABC-168`" and "until that lane reads it")* |
| M4 | **Stdout hygiene** | 100 % of stdout lines begin with an engine-to-GUI keyword: `id`, `option`, `uciok`, `readyok`, `info` or `bestmove` | The session tests (`ABC-167`, `ABC-171`) and the real-child lane (`ABC-168`). Candidate row (iii) |
| M5 | **The terminal game is unchanged** | 0 changed lines in the `ADR-0044` D2 "no edit" list. In `src/engine.ts`, the one core file that is edited, every `src/engine.test.ts` pin outside the `A4` block stays unedited and green, `A3`'s identity sweep included. The existing `src/cli*.test.ts` and `src/levels.test.ts` suites pass unedited | `git diff --stat <base> <head>` on that list. `git diff <base> <head> -- src/engine.test.ts` shows changes only inside the `A4` `describe` and in new rows. The gate run |
| M6 | **The opening book plays, and switching it off is observable** | From `position startpos`, `go movetime 1000` writes `info string book` and a `bestmove` that is a book move from `data/opening-book/book.json`. After `setoption name OwnBook value false`, the same `go` writes an `info depth …` line and no `info string book`. With the book file unreadable, every `go` still writes one `bestmove` (0 failures, exit code unchanged), after exactly one `info string` warning | The session tests (`ABC-171`, with a probe over in-memory bytes) and one run of the real-child lane against the artifact (`ABC-168`) |
| M7 | **A `Skill Level` change is observable** | `uci` lists `option name Skill Level type spin default 3 min 1 max 5`. On the same virtual clock and position, the same `go wtime 60000 btime 60000 winc 1000 binc 1000` (G = 3 500 ms) is searched under a **100 ms** budget at level 1, **3 000 ms** at level 3 and **3 500 ms** at level 5, which is `min(G, level)`. `setoption name Skill Level value 9` keeps the old level and writes one `info string` | The session tests (`ABC-171`), read from the `info` line's `time` on the injected clock, so the numbers are exact and host-independent |
| M8 | **`go depth`, `nodes` and `mate` are honoured** | (a) A `cutechess-cli` run of 2 games from startpos against the artifact, colours swapped, `depth=4`: both games end by a chess result or adjudication, with 0 illegal moves and 0 stalls, and every searched move's final `info` line reports `depth` ≤ 4. (b) `go depth 3` reports `depth 3`. `go nodes 20000` reports `nodes` ≤ 20 000 + 1 024, unless depth 1 alone took more. `go mate 2` on `5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1` (the corpus's smothered mate, `src/puzzle-corpus.ts:128`) answers `bestmove d5g8` with `score mate 2` | (a) `cutechess-cli`'s `-debug` log, kept raw under `ABC-168`'s context. Whether `depth=4` with `tc=inf` is the right spelling is `UNKNOWN - verify`, pinned on the first run. (b) The engine rows (`ABC-170`) and the session tests (`ABC-167`), on the virtual clock |
| M9 | **The artifact builds and runs from a clone** | In a fresh clone, `npm ci && npm run build` exits `0` and creates `dist/uci.js`. `dist/` holds no `*.test.js` and no `cli.js`, and `dist/uci.js` loads no `turn-loop.js`, as `A7` measures *(reworded 2026-10-21, owner-confirmed, `…4ab163ef`; superseded text: "`dist/` holds no `*.test.js`, no `cli.js` and no `turn-loop.js`")*. `printf 'uci\nquit\n' \| node dist/uci.js` prints `id name skytalix` … `uciok` and exits `0`. After `npm link`, `printf 'uci\nquit\n' \| skytalix` prints the same | `ABC-168`'s acceptance, run by the agent and repeated once by the owner at UAT |
| M10 | **The engine is declared private (2026-10-18, private)** | `npm pkg get private license` prints `true` and `"UNLICENSED"` (as one JSON object: `"private": true`, `"license": "UNLICENSED"`). The first comment block of `src/evaluate.ts` credits Tomasz Michniewski's "Simplified Evaluation Function", with its chessprogramming.org URL and `CC BY-SA 3.0`, and the change is comment-only. No `LICENSE`, `NOTICE` or `COPYING` file is tracked. *Superseded target: an AGPL-3.0 `LICENSE` and SPDX id* | `ABC-169`'s acceptance (`A1`–`A4`) |
| M11 | **The in-repo name is `skytalix`** | `npm pkg get name` prints `"skytalix"`. Both `name` fields in `package-lock.json` read `skytalix`, and `npm ci` exits `0`. Outside dated history, no live file names the package `cli-chess` | `ABC-172`'s acceptance |

M1 and M8(a) measure time and protocol safety (candidate row (ii)). They are **not** strength claims. No Elo is claimed
at any `Skill Level` (`EPIC-004` § Test notes; `src/levels.ts`).

## Tickets (pages cut; status `Backlog`; accepted 2026-10-18, each DoR 10 of 10; they enter Ready as WIP allows)

There are six tickets, each `XS` or `S`, and each is one INVEST slice. The first four run as one chain, because each
one reads the one before it. `ABC-169` and `ABC-172` stand alone. The pages are under `plans/tickets/`.

| order | id | title | size | depends on | gated by | Security/NFR hop |
|---|---|---|---|---|---|---|
| 1 | `ABC-170` | `src/engine.ts` takes two optional limits, `maxDepth` and `maxNodes`. Absent, it is today's engine node for node | **XS** | none | met: the owner accepted `ADR-0044` (D12), 2026-10-18 | **No** `ADR-0036` limb. `NFR-005` is re-read on its existing deep-lane protocol at the build hop |
| 2 | `ABC-167` | `src/uci-session.ts`: a capability-free UCI session for the D3 commands, the D4 time rule and the D12 `go` limits | **S** | `ABC-170` | met (accepted 2026-10-18) | **No.** (b1) and (b2) do not fire, because there is no limb in it or in what it imports. QE confirms this as a review check |
| 3 | `ABC-171` | The session offers `OwnBook` and `Skill Level` (D10, D11) | **S** | `ABC-167` | met (accepted 2026-10-18) | **No.** `book.ts` is imported as a type only, and `levels.ts` holds no limb token |
| 4 | `ABC-168` | `skytalix`: the entry point `src/uci.ts`, the built `dist/uci.js` with its `bin`, the opt-in real-child lane, and M1, M2 and M8(a) at UAT | **S** | `ABC-171` | met (accepted 2026-10-18). Before its UAT, the owner has installed `cutechess-cli` and En Croissant (Q10) | **Yes.** `ADR-0036` (b1) fires on `process.`, on `node:readline` and on the import of the capability holder `book-file.ts`. `ABC-041` clause (a) fires on `package.json`. Security/NFR places candidate rows (i)–(iii) |
| 5 | `ABC-169` | **(2026-10-18, private)** Declare the engine private: `"license": "UNLICENSED"` next to `"private": true`, and the Michniewski credit comment in the `src/evaluate.ts` header | **XS** | none | met (accepted 2026-10-18; private chosen) | **Yes, a short one.** It touches `package.json`, so `ABC-041` clause (a) fires ("touched at all"). The `src/evaluate.ts` edit is comment-only, so `ADR-0036` (b1) and (b2) do not fire. **UAT: expected WAIVED** by the owner's Q4 comment-only measurement (`…5c8e2a17`) at the exit; if that fails, the owner's UAT applies |
| 6 | `ABC-172` | Rename the package and every in-repo name to `skytalix` | **XS** | none (any order with `ABC-168`/`ABC-169`; all three edit `package.json`, so whichever merges later rebases) | met (accepted 2026-10-18); **Q14 answered: keep `npm run chess`** | **Yes, a short one.** It touches `package.json` and `package-lock.json`, so clause (a) fires. 0 production lines |

**Why six and not fewer.**
- `ABC-170` is its own ticket because it edits a pinned core module, amends `ABC-078` `A4` and reruns the `A3` identity
  sweep. Mixing that into a protocol ticket would hide a core change behind a new file. This is the Architect's
  suggestion (`…e4a7c912` § For BA/PM).
- `ABC-167` and `ABC-171` were one `S` in the first version. With the book, the levels and the `go` limits added on top,
  it would be `M`. The protocol slice works alone, with the book off and level 3 fixed. The options slice is the
  owner's Q4 plus Q5 and nothing else.
- `ABC-168` is the only ticket that touches `process` or a capability holder, so the Security/NFR hop covers one small
  file plus config. The build line and `bin` belong with it, because they emit exactly that file.
- `ABC-169` touches no executable code (one manifest line and one header comment) and waits on nothing, so it can
  merge at any time. *(2026-10-18, private; it waited on `arch-licence-eval` before.)*
- `ABC-172` is its own ticket on the owner's word (Q13). It touches no code: no string under `src/` names the product
  (read at `a10e09c2`).

**Why not more.** The GUI play-test is `ABC-168`'s UAT, not a deliverable. The `AGENTS.md` lines are the Scribe's job at
`ABC-168`'s build. A separate "build" ticket would emit a file that no other ticket uses.

## Owner questions

### Answered on 2026-10-18 (the Orchestrator's note `…a41c7e02`)

| # | question | answer | where it landed |
|---|---|---|---|
| Q1 | Accept UCI (lift the UCI half of `EPIC-004`'s non-goal)? | yes (recommended) | `EPIC-004` § Out of scope, edited at this hop |
| Q2 | What is it for first? | humans in his UI (recommended) | § The product |
| Q3 | Keep the 5 s ceiling? | keep it (recommended) | § v1 — in; `NFR-004` |
| Q4 | Book under UCI? | **on in v1** | `ABC-171`, M6 |
| Q5 | Strength control? | **in v1** | `ABC-171`, M7 |
| Q6 | Honour `go depth` / `nodes`? | **implement them** (and `mate`) | `ABC-170`, `ABC-167`, M8 |
| Q7 | How does the web project get the engine? | **its own backend spawns the CLI; this repo must be buildable** | `ABC-168`, M9; § boundary |
| Q8 | Licence? | **GNU GPL v3**, superseded by Q12 | `ABC-169`, M10 |
| Q9 | `id name` / `id author`? | **`skytalix`**, author unchanged | `ABC-167`, `ABC-168` |
| Q10 | Who installs `cutechess-cli` and En Croissant? | he does | `ABC-168` UAT gate |
| Q11 | Is v1 done without a web UI? | yes | § Success measures |

### Answered on 2026-10-18 (the Orchestrator's note `…6b2d90f1`)

The owner's words, verbatim: *"Q12: AGPL v3 if possible, grugops has MIT license. Evaluate if it is ok to use the
evaluation tables and reference them and still use AGPL v3 for the built software. ; Q13: rename yes."* Note path:
`.grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md`.

| # | question | answer | where it landed |
|---|---|---|---|
| Q12 | The licence and its scope | **AGPL-3.0, "if possible"**. This supersedes the GPL-3.0 reading of Q8 | `ABC-169`, M10 |
| Q12(a) | The Michniewski evaluation tables (CPW, CC BY-SA 3.0): credit or replace? | **pending.** The owner asked for an evaluation. The Architect's `arch-licence-eval` hop does it; BA/PM does not | `ABC-169` `A3` waits on it |
| Q12(b) | May a repo-wide `LICENSE` cover `tools/grugops/`? | **No: those files are MIT**, per the owner. They stay MIT. `LICENSE` says so in one sentence and does not cover them | `ABC-169` `A4` |
| Q12(c) | `-or-later` or `-only`? | **pending.** Not stated by the owner. The default reading is `AGPL-3.0-or-later`; `arch-licence-eval` and the owner settle it | `ABC-169` `A2` |
| Q13 | Rename the npm package, the repo and the terminal game to `skytalix`? | **yes** | `ABC-172`, M11. The directory and any remote are owner steps |

### Answered on 2026-10-18 (the Orchestrator's note `…c3e81a57`): Q12–Q15 closed, EPIC-007 accepted

The owner's words, verbatim: *"License: let's keep private for now ; Q14: keep it ; Q15: picked private ; accept the
revised ADR-0044 and EPIC-007"*. **No owner question on this epic is open.**

| # | question | answer | where it landed |
|---|---|---|---|
| Q12 | The licence and its scope | **Private, all rights reserved** (*"keep private for now"*). It supersedes AGPL-3.0 | `ABC-169` re-scoped; M10 |
| Q12(a) | The Michniewski tables: credit or replace? | **Credit, as they are.** The owner said nothing about them; this is the Orchestrator's default reading (`…c3e81a57`), and he may correct it. A private engine that is not distributed does not share the CC BY-SA material | `ABC-169` `A2` (a comment in `src/evaluate.ts`) |
| Q12(b) | The kit's MIT files | **They stay MIT** and are not edited | `ABC-169` Scope 3, `A5` |
| Q12(c) | `-or-later` or `-only`? | **Moot.** No open-source licence is declared | — |
| Q14 | Keep `npm run chess`? | **Keep it** (*"keep it"*) | `ABC-172` Scope 3 does not apply; stays `XS` |
| Q15 | The licence findings (credit, MIT notice, `-or-later`) | **Moot** (*"picked private"*) | — |
| — | Accept the revised `ADR-0044` and `EPIC-007`? | **Yes** | this page's status; DoR item 10 on `ABC-167`…`ABC-172` |

**Recorded precondition, not a ticket.** Before the engine is ever distributed to third parties (for example a browser
bundle or a published binary), the evaluation values are re-derived as our own. A ticket for it is cut only on the
owner's word (`…c3e81a57`).

### Raised by the revision (answered above, 2026-10-18; kept for the record)

| # | question | recommended answer | why |
|---|---|---|---|
| Q14 | `npm run chess` is the terminal game's command, and the usage line says it (`src/cli.ts:93`). Keep the script name, or rename it to `npm run skytalix`? | **Keep `npm run chess`.** It is a verb, not the product's name. The package becomes `skytalix`, and the engine's `bin` is already `skytalix` | Renaming it edits `src/cli.ts`'s usage line and its `src/cli.test.ts` pins, `AGENTS.md`'s guarded Dev/run slot, and `ADR-0018`'s channel sentence. That turns an `XS` records-and-manifest ticket into a production change that buys nothing. If you want both, an alias is one script line |

**"Accept the recommendation" is a full reply** to Q14. It blocks only `ABC-172`'s scope line on the script, not the
ticket.

## The web-UI project's boundary

**The interface between the two projects is the `skytalix` program and UCI text lines** (`ADR-0044` D3, D8).

- **The web project owns:**
  - **its backend (WebSocket or an API) and its router.** The backend spawns `node <clone>/dist/uci.js`, or `skytalix`
    after `npm link`, as a child process and relays lines. It decides whether that is one process per game or per user.
    Its process limits, restarts, concurrency and deploy are its own;
  - the board, pieces, drag and drop, move input, and its own move-legality checks (UCI has no "is this legal" query);
  - the game record: moves, PGN, take-back and results (in UCI the GUI holds the game);
  - the clocks and the time control, sent as `go wtime/btime/winc/binc`, `go movetime`, or `go depth` / `nodes`;
  - any difficulty UI, which it maps onto `setoption name Skill Level value 1..5`;
  - its bundler, hosting, accounts, accessibility, and its own licence. It runs a private, all rights reserved program
    (the same owner's) as a separate process. *(2026-10-18, private: the AGPL-3.0 network-clause question is moot.)*
- **It does NOT get from this repo:** an HTTP or WebSocket server, a router, a bundle, a Web Worker build, a WASM build,
  a native binary, an npm package, UI-specific commands, or any option beyond `OwnBook` and `Skill Level`.
- **It can rely on this repo for:** `npm ci && npm run build` producing `dist/uci.js` (M9); legal `bestmove` output,
  one per `go`; the 5 s ceiling; `go depth`, `nodes` and `mate`; the two options; and a book read from the clone's
  `data/`. A `dist/` copied away from its clone plays without a book, after one `info string`.

## Dependencies

- `EPIC-004`: the engine (`chooseMove`) and the levels (`ABC-087`). Delivered. `ABC-170` edits `src/engine.ts` once.
- `EPIC-005`: the opening book (`createBookProbe`, `readBookFile`, `data/opening-book/book.json`). Delivered.
- `EPIC-001`: FEN, coordinate moves and `makeMove`. Delivered.
- The owner **accepts the revised `ADR-0044` and this revision** before any ticket here can enter `Ready`. **Met,
  2026-10-18** (`…c3e81a57`).
- **(2026-10-18, private)** `ADR-0044` D13 is rewritten to private by the Architect's `arch-adr0044-accept` hop, in
  parallel with this one. This page does not edit the ADR. `ABC-169`'s credit wording reads from D13, and its `A2` holds
  either way.
- *As read at `a10e09c2`, before the licence evaluation:* **`ADR-0044` is one owner answer behind.** At `a10e09c2` its D8 and D13 still say `GPL-3.0-or-later` and that the
  package "stays `cli-chess`". Q12 and Q13 move both. The licence line is `arch-licence-eval`'s, and the rename line is
  the Architect's at acceptance. This page does not edit the ADR (`memory-bank/50-decisions` is fenced at this hop).

## Risks

- `RISK-EPIC007-01`: a GUI's handshake timeout or `isready` ping fires during a ≤ 5 s search (`ADR-0044` D5). It shows
  up as an M1 disconnect or an M2 error. It is the named trigger for the worker.
- `RISK-EPIC007-02`: M1, M2 and M8(a) cannot be read until the owner has installed `cutechess-cli` and En Croissant
  (Q10 says he will). Until then they are `UNKNOWN - verify`, and `ABC-168`'s UAT waits.
- `RISK-EPIC007-03`: with the book off, or out of book at levels 3–5, the engine plays deterministically (`ADR-0027`
  d1), so engine-against-itself games can repeat. M1 starts from six different FENs, and the book (on by default)
  varies the startpos game.
- `RISK-EPIC007-04`: **`ABC-170`'s `A4` amendment is larger than "one check".** `ADR-0044` D12 says `maxDepth` trips one
  `A4` check, the `max_?depth` ban at `src/engine.test.ts:515`. Read at `a10e09c2`, a second `A4` check at
  `src/engine.test.ts:520` (*"the deepening loop has no upper bound"*) pins the loop header
  `for (let iteration = 2; now() < budget.deadline; iteration++)` verbatim. D12 puts both new conditions in that
  header, so that check also goes red. `ABC-170` `A4` names both checks. It is the same `describe` and the same
  amendment, so the size stays `XS`. A dated line in `ADR-0044` is the Architect's, at acceptance.
- `RISK-EPIC007-05`: the first `isready` loads and validates a 356 526-byte book, and its cost on this host is not
  measured. M3's 1 000 ms stays a proposal until `ABC-168`'s QE probe reads it. *(Reworded 2026-10-21, owner-confirmed,
  `…4ab163ef`; superseded text: "until `ABC-168`'s lane reads it".)*
- `RISK-EPIC007-06` **(closed 2026-10-18, private):** the owner chose private, so neither AGPL compatibility nor
  replacing the tables is in play for v1. What remains is `RISK-EPIC007-07`. *The original text:* Q12(a) is a legal
  question that no agent can settle. `arch-licence-eval` evaluates it, and the
  owner decides. If the outcome is "replace the tables", `ABC-169` stays `XS`, but a new ticket that changes strength
  appears outside this epic. If AGPL-3.0 is "not possible", `ABC-169`'s licence line changes and its size does not.
- `RISK-EPIC007-07` **(new 2026-10-18, private):** the Michniewski tables stay as they are under a credit comment. That
  rests on the engine not being distributed: it runs on the owner's own backend over stdio. The day it is distributed to
  third parties (a browser bundle, a published binary), the values must first be re-derived as our own, which re-tunes
  the engine and moves the evaluation, puzzle, ladder and level pins. No ticket exists for it, and one is cut only on
  the owner's word (`…c3e81a57`). The tables-credit reading is the Orchestrator's default, and the owner may correct it.

## NFR triggers

- `NFR-004` binds unchanged through the engine's clamp. The D12 limits can only shorten a search.
- `NFR-005` (depth in budget at the default level): `ABC-170` adds one comparison per 1 024 nodes and one per
  iteration, and re-reads `NFR-005` on its existing `ENGINE_DEEP=1` protocol. The target is unchanged: ≥ depth 6 on
  Kiwipete and `position-6` in 3 s (below 6 = FAIL).
- `NFR-006`: the same book file, unchanged (≤ 1 MB; 356 526 bytes today).
- `NFR-008`: +1 default-lane file (`src/uci-session.test.ts`), plus rows in `src/engine.test.ts`. Spawns run only in
  `ABC-168`'s opt-in lane, so the `N8-SPAWN` balance stays at 0 ms.
- `ADR-0044` candidate rows (i) idle responsiveness (M3), (ii) time safety (M1, M8(a)) and (iii) stdout hygiene (M4)
  are placed by Security/NFR at `ABC-168`. This page does not edit the catalog.

## Test notes

- Session tests run on the virtual clock (`ADR-0027`), with `seededRandom` and an in-memory book, and spawn nothing.
- The real child runs only in an opt-in lane, following the `ABC-119` precedent: unset means NOT DEFINED.
- `cutechess-cli` and En Croissant are host tools that the owner installs. They are never repo dependencies.
- Perft stays the move-generation standard and is not re-run for this epic.
- No strength or Elo is measured here, at any level.
