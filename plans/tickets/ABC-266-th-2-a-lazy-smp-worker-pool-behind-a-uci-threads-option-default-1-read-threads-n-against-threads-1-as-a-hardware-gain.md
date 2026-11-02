---
id: ABC-266
title: "TH-2: a Lazy SMP worker pool over the shared table behind a UCI Threads spin option, default 1; Threads 1 unchanged node for node; read once, Threads N against Threads 1 at 100 ms, labelled a hardware gain"
status: backlog
column: Backlog
size: L
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0062 (PROPOSED 2026-11-02, arch-ABC-266 …4f828986): Threads 1-12, default 1; Threads 1 spawns no worker; k >= 2 workers, the main thread searches nothing; the deepest completed iteration is played. Amends ADR-0044 D3, D5, D6's Threads row and D8's emit set. The D5 reversal is pre-accepted (ADR-0057 OQ-1 yes, …81ae2db4); D1's maximum and D6's played result are asked by name. Reading (b): the build may start; the merge waits on the owner's acceptance. Source: ADR-0057 (ACCEPTED 2026-11-02) D2.2, D4 and § Inputs for the thread tickets. Was: owed, the Architect's (bapm-threads-cut)"
---

# ABC-266: the worker pool and `Threads` (TH-2), with `ABC-267`'s rows folded in

> **PARKED 2026-11-02 BY THE OWNER ("park threads"); `ADR-0062` STAYS PROPOSED, NOT IN FORCE; `Threads` STAYS 1, by
> BA/PM** (task `bapm-records-1102c`, records only, at `main` `a6039c5b`; nothing run). Sources: the Architect's
> re-proposal `arch-ABC-266-repropose` `…b6305641` (sealed rule `…3c920b97`), the Orchestrator's notes `…773be7de`
> (the owner's words, verbatim: *"61 yes, 25 yes, park threads"*) and the board (2026-11-02, `arch-owner-answers-1102b`
> merged).
> - **The re-proposal found NO WIN** under its sealed rule. Only T4SDP passed once, and its confirmation was voided by
>   load. Every S+D+P read at 100 ms paid for its extra ply with a quality loss of 1.67–2 positions of 20. The
>   deeper-entry rule alone inflates the reported depth. The Architect recommended parking.
> - **The owner parked the thread strand.** This ticket is **parked**: the build does not start, and the page is not
>   re-cut. `ADR-0062` stays PROPOSED as the design of record, **not in force**. `ADR-0044` D3 and D5 stand, and the
>   product stays at `Threads 1`. The owner's `ADR-0062` acceptance question and the `THREADS_DEEP` core question are
>   moot while it is parked (`EPIC-011` § Owner questions).
> - **The ~30 min re-probe is not funded** (`…773be7de`).
> - **`ABC-265` (TH-1) is not affected.** It merged on its own (`605874b8`, the owner's *"25 yes"*); it is node-for-node
>   today's engine at one writer. So DoR row 10's first blocker is gone. The second, the design, is now the park.
> - **What would re-open it** (`…b6305641`, each with its own pre-registration): (a) `ADR-0058` comes into force through
>   `ABC-257`; (b) the owner funds the S+D+P re-probe at `Threads 12`; (c) a later search change breaks the workers'
>   lockstep.
> - **S′ line re-pointed** to E 1 810 (`--elo 1810`, `ADR-0056` S′ amendment of 2026-11-02), as on every open strength
>   ticket. No other row changes. **DoR 9/10. Backlog, parked.** Front matter keeps `status: backlog` (this
>   repository's form for a parked ticket, as `ABC-237`). The board already reads parked (the Orchestrator's).

> **THE D12 PROBE READ MISS; DEVELOPMENT BLOCKED PENDING THE ARCHITECT'S RE-PROPOSAL; `RISK-EPIC011-09` REALISED,
> 2026-11-02, by BA/PM** (task `bapm-P3-page`, records only, at `main` `6413f91f`; nothing run). Source:
> `qe-ABC-266-d12`, verdict by the sealed rule `…9f9aeb87` (pre-registration `…6231db75`, committed `d7aaea5e` before
> the run), results `…cc1de664`; merged `3105a5b0`.
> - **D12: MISS, not loaded.** Median played depth at 100 ms over the 20 corpus positions: **`Threads 12` = 7,
>   `Threads 1` = 7** (`Threads 4` = 7). The rule was "PASS iff T12 > T1, strictly". Phase foreign cores 0.454, 2 of 20
>   blocks above 0.8, no foreign vitest or `cutechess-cli`, so it is not VOID-LOAD.
>   - Per position at 100 ms, T12 against T1: above on 1, equal on 15, below on 4. At 1 000 ms (information only):
>     10 against 10, above on 2, below on none.
>   - The 12 workers completed the same depth in 19 of 20 searches. D6's deepest-completed rule changed the played
>     depth once at T12 and never at T4.
>   - A worker at T12 ran at about 0.69 of a single thread's nodes (0.98 at T4). The cause is not separated
>     (`UNKNOWN - verify`).
> - **Development is blocked.** By `ADR-0062` D12 and this page's Dependencies, the Architect re-proposes before any
>   build: `arch-ABC-266-repropose` (queued 2026-11-02; helper diversity, `ADR-0058`'s rule at `Threads ≥ 2`,
>   move-order perturbation, a 4-fast-core cap, each pre-registered). **This page is re-cut when that lands.** No row,
>   bar or scope item changes here before then. `ADR-0062` stays PROPOSED as written.
> - **`RISK-EPIC011-09` is realised.** As written today, A7 would read about 50 of 100 and miss about half the time on
>   noise, and F4 allows no replay. The value line stays unsupported. No bar is loosened.
> - **DoR stays 9/10, and row 10 now has two blockers:** `ABC-265`'s merge, and the design's return to the Architect.
>   The board move is the Orchestrator's (board, 2026-11-02: "ABC-266 build blocked").

> **ALIGNED TO `ADR-0062`; `ABC-267` FOLDED IN; M = N = 12; DoR 9/10, 2026-11-02, by BA/PM** (task
> `bapm-ABC-266-rows`, records only, at `main` `09306a14`; nothing run, built or timed). Sources: `ADR-0062`
> (PROPOSED, `arch-ABC-266`, merged `a3a300e0`), the Architect's notes `…4f828986` (decision; its "BA/PM for DoR 10/10"
> list is worked item by item below) and `…0c8cf7d0` (the design probe), and the Orchestrator's ruling *"ABC-267 folds
> into ABC-266"* (board, 2026-11-02).
> - **The ADR is written.** Scope 4 now cites `ADR-0062` D1–D9. Two choices differ from what this page first carried:
>   the played result is **the deepest completed iteration** among the workers, not worker 0's (D6), and **the main
>   thread searches nothing** at `Threads ≥ 2` (D3).
> - **M = 12 in A1, N = 12 in A7.** If the owner answers "max 8", both read 8 and nothing else on this page moves.
> - **`ABC-267` is folded in** (`ADR-0062` D13). A3 takes its A1 form. A5 becomes a standing `THREADS_DEEP` row. A8 is
>   new, from its A2, with the probe-then-cutoff case added. Its 2^10-slot seam is dropped, its default-lane row is
>   settled at zero, and its determinism row joins A6. `ABC-267`'s page is closed as folded.
> - **The design probe changes the value line.** Helpers barely shorten worker 0's path to a depth (`…0c8cf7d0`). So
>   the +55 to +150 Elo estimate is unsupported until the D12 timing probe reads (`qe-ABC-266-d12`, queued for an
>   ALONE window). **That probe comes before Development.** If it reads "not above", the design goes back to the
>   Architect and this page is re-cut.
> - **Still open:** two owner questions (`EPIC-011` § Owner questions) and `ABC-265`'s merge (DoR row 10).

> **Cut 2026-11-02 by BA/PM** (task `bapm-threads-cut`, records only, at `main` `48f3fc01`; nothing run). Source:
> the owner's answers `…81ae2db4`: *"1 yes"* opens threads and pre-accepts reversing `ADR-0044` D5 for these
> tickets, and *"2 a"* means one game at a time, several cores inside a game, and every 100 / 400 read at `Threads 1`.
> *"3 c"* reads the 40/15 claim at `Threads 1` and `Threads N` separately, `Threads 1` first. *"4 a"* has `NFR-009`
> count retained growth. Inputs: `ADR-0057` § Inputs for the thread tickets, column TH-2, and D2.2
> (`arch-owner-answers-1102` `…a0df22b8`), cited here, not restated.
> **Intent: GAIN, labelled a hardware gain** (`ADR-0057` D4). It is the one read in this strand that is not
> `Threads 1` against `Threads 1`. `EPIC-011` threads strand, **second**, after `ABC-265`.

## Problem

- **User:** the owner in a chess UI over UCI, and later the 40/15 claim read at "N CPU" (OQ-3 (c)).
- **Pain:** the engine searches on one thread (`ADR-0044` D5), so 11 of the host's 12 physical cores sit idle in play
  (`ADR-0057` § Consequences).
- **Value:** +55 to +150 Elo at 40/15 (`estimate`, `ADR-0057` D2.5; no games played). It is the largest measured lever
  on record: 6.7–7.5× node rate at 12 workers (D2.4, `measured (informal)`). The default product stays `Threads 1`, so
  nothing changes for a user who does not set the option.
  - *2026-11-02 (`bapm-ABC-266-rows`):* **the estimate is unsupported for now.** The node rate is not depth. In the
    design probe, worker 0's nodes to a fixed depth, as a ratio to the same search alone, read 0.868–1.406 with no
    helper diversity and up to 1.746 with odd helpers one ply deeper. No setting gave a consistent reduction. Inside
    1 000 000 nodes, worker 0 reached its solo depth in 64 of 64 runs, and a helper went one ply
    deeper in 2 of 64 (`…0c8cf7d0`; counts, no clock). D6's deepest-completed rule is meant to turn the faster cores
    into depth. Whether it does is `UNKNOWN - verify`: the D12 probe reads it first, then A7.
  - *2026-11-02 (`bapm-P3-page`):* **D12 read MISS** (`…9f9aeb87`): median played depth 7 at `Threads 1`, 4 and 12 at
    100 ms. The estimate stays unsupported, and the design returns to the Architect (top block).

## Scope

1. **A worker pool on `worker_threads`** (D2.2). One search a worker. Every worker searches the same root with the
   same deepening loop (Lazy SMP, D2.1). `ABC-265`'s shared table is handed to each worker once. Each worker keeps
   its own killers, history and ordering scratch. *(2026-11-02: `ADR-0062` D3, D4 and D8 — the main thread allocates
   the table and hands `tableBuffer()` over in `workerData`; each worker calls the new export `adoptTable(buffer)` once.
   New files `src/search-pool.ts` and `src/search-worker.ts`, named by the Engineer. `src/uci-session.ts` takes the
   pool as an optional injected capability. `tsconfig.build.json` `files` gains the worker entry.)*
2. **The stop slot:** an `Int32Array` over a small `SharedArrayBuffer`, read through the injected clock, as
   `ADR-0044` D5's pre-designed upgrade says. Each worker checks it at `NODES_PER_CLOCK_CHECK` (1 024), as today.
   *(2026-11-02: in `ADR-0062` D5's order — clear, reset the slot, post; the first result sets the slot; no
   `Atomics.wait`.)*
3. **A UCI `Threads` spin option, default 1**, with the maximum and the out-of-range rule the ADR sets. *(2026-11-02:
   `ADR-0062` D1 — max `MAX_THREADS` = 12; only the canonical decimals 1–12 are taken.)*
4. ~~**The new ADR**, amending `ADR-0044` D3 and D5. It fixes the four choices `ADR-0057` § Inputs leaves to it. The
   Architect recommends each one as follows:~~
   ~~- `Threads 1` spawns no worker and runs today's in-thread path;~~
   ~~- the maximum is 12, one per physical core, or 8 if the owner wants room left on the host;~~
   ~~- worker 0's best move is played, and helpers only fill the table (helper diversity is the ADR's to pick);~~
   ~~- the terminal game is unchanged at `Threads 1`, with no new surface (`ADR-0044` D7).~~
   **`ADR-0062` D1–D9, as written** *(2026-11-02, `bapm-ABC-266-rows`; cited, not restated)*:
   - D1: the option, `option name Threads type spin default 1 min 1 max 12`, and the refusal rule;
   - D2: `Threads 1` spawns no worker and runs today's in-thread path line for line. `Threads` governs only the rate-0
     `chooseMove` path; book moves, levels 1–4 and the terminal game are untouched;
   - D3: `Threads k ≥ 2` runs k workers, and the main thread searches nothing. No helper diversity in this build;
   - D4: the table's adoption; D5: the clear and the stop, in order;
   - **D6: the deepest completed iteration among the workers is played; on a tie, the lowest index.** This replaces
     "worker 0's best move" above (`ADR-0057` § Inputs' recommendation, changed on the probe). The `info` line takes
     depth, score and pv from the played result. `nodes` is summed over workers, and `time` and `nps` are on the main
     thread's clock;
   - D7: the session's busy states and its queue; D8: where the code goes; D9: a worker fault exits 70, with no
     fallback to `Threads 1`.
5. **The read's harness configuration.** If `ABC-255`'s `d` cannot set `Threads` per side, this ticket adds the
   smallest `tools/rating/` change that does. It is harness configuration only: no engine path is keyed on it (R-TC
   part 1). ~~Whether `d` can already do this is `UNKNOWN - verify`, settled at the design hop.~~ *(2026-11-02: settled,
   `ADR-0062` D12. `d` cannot set it today (read, not run), so this scope is owed.)*
   - `d` takes `--threads N`, checked as text against `^([1-9]|1[0-2])$`. It adds `option.Threads=N` to the
     candidate side (`name=skytalix`) only, so the base side plays at the default `Threads 1`.
   - `machine.txt` records `threads: skytalix N, base 1`, and `--dry-run` prints it.
   - `r` and `rpair` do not take the flag. `tools/` only.
6. **`ABC-267`'s rows, folded** *(2026-11-02, `ADR-0062` D13, the Orchestrator's ruling)*:
   - the multi-worker property rows across thread counts (A3);
   - the standing `NFR-009` row summed over workers (A5);
   - the multi-writer torn-entry stress, with the probe-then-cutoff case (A8);
   - the default lane's wall before and after, with zero real-worker rows (A6 `G8`);
   - the new opt-in deep lane, `THREADS_DEEP=1`, one test file (recommended `src/uci.threads.test.ts`). Every
     real-worker row runs in a Node child with fixed heap flags (`ADR-0062` D11).

## Out of scope

- The table layout (`ABC-265`). ~~The torn-entry stress, the `NFR-009` instrument summed over workers as a standing
  row, and the default lane's 2-worker row (`ABC-267`).~~ *(2026-11-02: folded in, scope 6.)*
- **Any real worker in the default lane** (`ADR-0062` D11). It would break `NFR-010`'s suite shape, so the default lane
  holds fake-pool rows only.
- **`ABC-267`'s 2^10-slot test seam** (dropped, D13). A8 runs on the production table at its production size.
- **Helper diversity** (odd helpers deeper, a permuted root order) and **`ADR-0058`'s deeper-entry rule at
  `Threads ≥ 2`**. They are the Architect's re-proposal if the D12 probe reads "not above" (D3, D12), each with its own
  probe. *(2026-11-02, `bapm-P3-page`: D12 read MISS; the re-proposal is `arch-ABC-266-repropose`. What it adopts
  enters this page at the re-cut.)*
- **`resourceLimits` on production workers** (`ADR-0062` § Alternatives). Production keeps V8's defaults.
- `Threads` on `r` and `rpair`, and a `Threads` value from `os.availableParallelism()`.
- Pondering (`EPIC-011` § Out of scope). Several games at once (Q-3K-3 under OQ-2 (a)). Any device (OQ-5 no; `ADR-0057`
  D6 parks the accelerator strand). Any change to `LEVELS`, the levels' budgets or the terminal game (`G9`).
- W1's soft and hard time limits (Phase 5). They are written against this pool later (`ADR-0056` D6's 2026-11-02
  line, item 3).
- The parked T2 and T4. They are re-asked after this ticket, on the shared table (`ADR-0057` D6's dated line).

## Acceptance criteria

*Where a row says "the owner's 2-core answer": owner question 2 (`EPIC-011` § Owner questions, `ADR-0062` D11).
Under **(a)**, the `THREADS_DEEP` rows run at every thread count named, with the host ALONE. Under **(b), the default
until he answers**, the standing rows run at `Threads 2` and W = 2. Then QE reads the `Threads M` and W = 12 rows once,
out of tree, with the same fixtures and flags and the host ALONE, and `Threads 4` and `Threads M` play only in A7.*

*The deep lane's command (`ADR-0062` D11):* `THREADS_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
src/uci.threads.test.ts`. *Every real-worker row runs in a Node child, `node --max-old-space-size=48
--max-semi-space-size=8 src/uci.ts` (with `--expose-gc` for A5's fixture), or in a fixture script with the same flags
(A5, A8). No real worker runs inside a vitest isolate.*

- **A1 (the option).** *(2026-11-02: M = 12, `ADR-0062` D1; 8 if the owner answers "max 8".)*
  - **Given** `uci`, **then** the output adds exactly one line, `option name Threads type spin default 1 min 1 max 12`,
    after the `TimeMode` line and before `uciok`. Every other line is byte-identical. The option-list rows in
    `src/uci-session.test.ts` grow by that line and no other.
  - **Given** `setoption name Threads value k` for k = 1, 2 and 12, with a **counting fake `Worker` factory** injected,
    **then** the factory is called **0 times for k = 1 and exactly k times for k = 2 and k = 12**.
  - **Given** `setoption name Threads value <v>` for each of `0`, `13`, a non-number (`abc`) and `07`, **then** the
    value stays at the old one and the session writes exactly one line, `info string Threads takes an integer 1-12,
    got <v>; kept <old>`. One row each, four rows. An absent value writes `got nothing`. The `Skill Level` rule of
    `ADR-0044` D3 is the precedent.
  - **Given** `Threads` set to 2, **when** `ucinewgame` arrives, **then** `Threads` reads 2: it is not reset. The
    option name matches case-insensitively. `Threads` is no longer on the ignored list, and `Hash`, `MultiPV`,
    `UCI_Chess960` and `UCI_AnalyseMode` still are.
  - **Given no pool injected** (`ADR-0062` D8), **then** `Threads` parses and prints as above, and every `go` runs in
    the main thread.
- **A2 (`Threads 1` unchanged).** At `Threads 1`, both by default and when set explicitly:
  - `G4`, node-equal cross-build on the `ABC-078` `A3` corpus: `chooseMove` and `search()` equal base's in move, score
    and nodes. Every older door equals its pre-ticket self. QE runs it out of tree, base tree against head tree.
  - The UCI session lanes pass **unedited** apart from A1's one option line: the default lane and `ENGINE_DEEP=1
    NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`. The CLI rows in `src/cli*.test.ts`
    pass unedited.
  - `AR-UCI-BUSY` reads as today. `G5`: level 5 ≤ 4 s a move, the 5 s ceiling at levels 1–5, and `uci-clock-mode`'s
    60 s (`NFR-004`).
- **A3 (`Threads N` plays; properties).** *(2026-11-02: takes `ABC-267` A1's form, `ADR-0062` D13. Was: `Threads 2` and
  `Threads M`, at least 10 positions, `go movetime 500`.)* In `THREADS_DEEP`, in the engine child, for `Threads` ∈
  {2, 4, 12}, on **every** position of the `ABC-078` `A3` corpus, `go movetime 200` each:
  - exactly one `bestmove`, legal in the position (checked against `legalMoves`);
  - it arrives no later than the bound the existing `Threads 1` movetime row asserts for the same movetime;
  - no thrown error, and no worker `error` event, `messageerror` or non-zero `exit`;
  - after `quit`, the child exits 0 with no worker left running.
  - Properties only. No node count and no specific move (test note 1).
  - Rows at `Threads 4` and `Threads 12` run as the owner's 2-core answer says. Under (b), they are read through A7
    instead.
- **A4 (stop and `isready` during a search).**
  - **In `THREADS_DEEP`, at `Threads 2`, in the engine child, during a `go infinite`:**
    - `isready` gets `readyok` **before any `bestmove` is written**, while the search still runs, and within
      `AR-UCI-BUSY`'s bound (`ADR-0062` D7, `ADR-0044` D5's side gain);
    - `stop` then gets **exactly one** legal `bestmove`, within the same bound.
  - **In the default lane, on a fake pool (synchronous and pure; `ADR-0062` D7, D9, D11):**
    - while *searching*, lines queue and run in arrival order once the pool is idle;
    - `isready` with an empty queue is answered at once. With an earlier command queued, its `readyok` comes after
      that command: it never overtakes it. While *starting*, `isready` is answered only once every worker is online;
    - `stop` and `ponderhit` each give exactly one `bestmove` per `go`. A `stop` after the `bestmove` writes nothing;
    - `quit`, and end of input, write the search's `bestmove`, then close the pool and end the session;
    - a fault (a worker `error`, a `messageerror`, an exit the pool did not ask for, a constructor throw at `setoption`,
      or an exception in the result callback) writes the fixed `internal error` line to stderr, sets exit code 70,
      closes the pool and writes **no** `bestmove`.
  - **Source rows:** each worker's clock reads the stop slot, and the engine consults it every `NODES_PER_CLOCK_CHECK`
    (1 024) nodes (`NFR-004`). The pool clears the table, then resets the slot, then posts, and resets the slot only
    while idle (`ADR-0062` D5; falsifier P2).
- **A5 (memory, `NFR-009` under OQ-4 (a)).** *(2026-11-02: a standing `THREADS_DEEP` row, `ADR-0062` D10 and D13;
  `ABC-267` A3 folded.)* At `Threads 12`, from the memory fixture child (D11's flags plus `--expose-gc`). Each isolate
  is read after `gc()`, before its first search and after a 1 s and a 4 s search. The fields are `heapUsed` and
  `arrayBuffers`. The main thread's pre-pool reading is taken before the pool's first `clearTable()`, so the table
  counts once, in the main thread.
  - **Bar:** the sum over every isolate of its growth over its pre-search reading, plus the table, **≤ 16 MiB**. The
    summed growth from the 1 s to the 4 s search **≤ 1 MiB in each field**. About 10 MiB is expected at 12 workers
    (`estimate`, SP6). That figure is not a bar.
  - Each worker's V8 baseline heap (about 10 MB after `gc()`, PR-1) is reported and sits outside the bound (OQ-4 (a)).
  - The standing row runs at the thread count the owner's 2-core answer allows. Under (b), it stands at `Threads 2`,
    and QE reads `Threads 12` once out of tree.
- **A6 (gates).**
  - `G1` (≥ 54/58) at `Threads 1`.
  - `G4` (A2).
  - `G5` at `Threads 1` and at `Threads M` (under (b), QE reads it at `Threads M` once, out of tree).
  - `G6` at `Threads 1`.
  - `G7` (A5).
  - `G8`: `N8-LANE` read **before and after**, both figures reported. The default lane holds **zero** real-worker rows
    (`ADR-0062` D11; `ABC-267` A4 settled at zero). Its only new rows are A1's and A4's fake-pool rows. `NFR-008`'s
    10 s bar at load1 ≤ 8 is unchanged.
    ~~This ticket adds **no** multi-worker row to the default lane; `ABC-267` adds at most one.~~
  - **Determinism source row** (`ADR-0027`; `ABC-267` A5 folded): no default-lane row asserts a node count or a move
    at `Threads ≥ 2`.
  - `G9`.
- **A7 (the read).** One read before the merge: **`Threads N` against `Threads 1`**, the same candidate build on both
  sides. ~~N is pre-registered on this page at Ready (recommended: M).~~ **N = 12, pre-registered here** *(2026-11-02,
  `ADR-0062` D12; 8 if the owner answers "max 8")*.
  - **How it runs:** 100 games at 100 ms a move, openings 1–50 with both colours, one game at a time, QE with the
    host ALONE, through `ABC-255` with scope 5. **The command, exactly** (`CUTECHESS_CLI` and `STOCKFISH` set as for
    every read): `node tools/rating/rating.ts d <candidate-sha> <candidate-sha> <out-dir> --budget-ms 100 --rounds
    50 --concurrency 1 --threads 12`. `--concurrency 1` is required: `d`'s default is 3, and OQ-2 (a) is one game at
    a time.
  - **Bar:** 100 of 100 games complete, 0 faults by either side, 0 losses on time at the 50 ms margin, and **≥ 50.0 of
    100** (GAIN, `ADR-0056` C2′).
  - **Reported:** labelled **"hardware gain, N CPU against 1 CPU"**. W/L/D, the score and `cutechess-cli`'s Elo ±
    error, in wall time **and** in core-seconds (N × wall for the N side; `ADR-0057` D4). This read gives η × E_d
    together (`ADR-0057` § Consequences). `machine.txt` shows `threads: skytalix 12, base 1`.
  - **Beside it, at `Threads 1`:** S′ (10 games at 0.5 s against Stockfish 19 at ~~E 1 650~~ *E 1 810 (2026-11-02,
    `bapm-records-1102c`)*, ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out>
    --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`, `timemargin` 50 ms; 10 of 10 complete, 0 faults, 0 losses on time,
    ≥ 3.0 of 10, below that 10 more and ≥ 7.0 of 20). Also the Levels deep lane (`ENGINE_DEEP=1
    NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, exit 0, every test
    passed).
  - **This is the only `Threads N` read in the strand.** Every Phase 2–5 read stays `Threads 1` against `Threads 1`
    (OQ-2 (a)).
- **A8 (the multi-writer stress; new 2026-11-02, `ABC-267` A2 folded, `ADR-0062` D13).** In `THREADS_DEEP`, from a
  fixture child with D11's flags. W writer workers, W = 4 and W = 12 (W = 2 under the owner's default answer (b), and
  QE reads W = 12 once out of tree). Each adopts the **production** table (`adoptTable`, D4). They store and probe
  4 096 keys chosen to fall into 1 024 slots of the 2^18-slot table. Each key's depth, score and move are functions of
  the key. **At least 10 M probes a run.**
  - **Bars:** **undetected corrupt hits = 0**, meaning a hit whose `tableCutoff` does not return its own key's score.
    **Torn slots observed > 0** (SP2 read 0.69 % at 4 writers and 2.6 % at 12).
  - **Probe-then-cutoff:** for every hit, the writer calls `tableCutoff(slot, depthOf(key), −∞, +∞, 0)` and checks that
    it returns `scoreOf(key)`. It then re-reads word 2 of the slot. **Bar: slots overwritten between the probe and the
    cutoff > 0, and corrupt cutoffs = 0** (the `ADR-0025` verified copy, T10, under real concurrency).
  - **Reported:** probes, hits, torn slots and their fraction, and slots overwritten in the window.
- **Falsifiers.**
  - **F1:** A1–A4 red, or a lane red no recorded re-pin explains, is a defect, back to the Software Engineer.
  - **F2:** A2's `G4` red at `Threads 1` is a defect. The default product must not move.
  - **F3:** A5 above 16 MiB is NOT MET. Above 16 MiB is the owner's (Q-3K-6). A lower M is the Architect's
    re-proposal.
  - **F4:** A7 NOT MET (below 50.0 of 100), or an S′ collapse, means not merged. The ADR reads "accepted, not in
    force". A miss is not re-played.
  - **F5** *(2026-11-02, `ABC-267` F2):* a corrupt hit or a corrupt cutoff in A8 is a defect in `ABC-265`'s check or
    verified copy, routed back to it.
  - **F6** *(2026-11-02, `ABC-267` F3):* torn slots = 0, or slots overwritten in the window = 0, in A8 is an
    instrument defect. The stress does not exercise the race, so it is reworked before it is read.
  - **The ADR's falsifiers map here** (`ADR-0062` § Falsifiers): P1 = A2; P2 = A8 and A4's D5 source row; P3 = A3;
    P4 = A4; P5 = A3 and A4's fault row; P6 = A5. P2–P6 firing is a defect, back to the Engineer (F1).

## NFR triggers

- **`NFR-009`:** ≤ 16 MiB, growth ≤ 1 MiB, retained growth summed over workers, table counted once (A5; OQ-4 (a)).
  ~~`NFR-009`'s file may need one line stating that reading. That line is this ticket's design hop, with
  Security/NFR (`ADR-0057` § Inputs, "owed by other roles").~~ *(2026-11-02:)* **The line is written in `ADR-0062` D10,
  for Security/NFR to place in `NFR-009`'s row at the gate.** BA/PM does not edit the catalog.
- **`NFR-010`:** one deep-lane row for the threads child, for Security/NFR to place (`ADR-0062` D11). **Target:** the
  child plus 12 workers at 72 MiB an isolate = 936 MiB ≤ the one-file shape's 992 MiB child allowance; the lane total
  1 928 MiB ≤ 2 048 MiB; one child at a time. The level does not move.
- **`NFR-004`:** each worker checks the clock every 1 024 nodes. `G5` at both thread counts (A2, A6).
- **`NFR-005`:** `G6` at `Threads 1`.
- **`NFR-008`:** **zero** real-worker rows in the default lane (D11); fake-pool rows only. ≤ 10 s at load1 ≤ 8, with
  `N8-LANE` before and after (A6). Multi-worker rows sit behind `THREADS_DEEP`.
- **`AR-UCI-BUSY`:** unchanged at `Threads 1`; met during a search at `Threads ≥ 2` (A4). Security/NFR re-reads it at
  the gate.
- **Security (ASVS L1):** one new option value parsed from UCI input, matched against the 12 canonical strings. The
  out-of-range rule is A1's. No other input path. The `--threads` flag is harness-side, checked against
  `^([1-9]|1[0-2])$`.

## Test notes

1. Multi-worker play is not deterministic, so `Threads ≥ 2` rows assert **properties only**: legal, bounded, no
   throw, clean exit. They never assert node counts or a specific move (`ADR-0057` D4, `G4` row).
2. `Threads 1` rows keep every existing oracle (A2). Deterministic mode (`ADR-0027`) holds at `Threads 1`.
3. Reuse sourced fixtures. No hand-labelled rows.
4. Shipped-path rows that move are re-pinned with old and new figures. The PR lists every re-pointed row. The target
   is A1's one option line. *(2026-11-02:)* No row pinning `dist/`'s emit list was found (`ADR-0062` D8, read, not
   run). If one exists, it is re-pinned with old and new figures for the worker entry.
5. UAT is owed (a new product option). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).
6. *(2026-11-02, `ADR-0062` D11.)* The default lane binds a **fake pool**: synchronous, pure, with a counting `Worker`
   factory. Every real-worker row is in `THREADS_DEEP` and runs in a Node child with `--max-old-space-size=48
   --max-semi-space-size=8`. QE schedules that lane with the host ALONE, like `ABC-204` and `ABC-225`. An
   `ENGINE_DEEP` run never starts it.
7. *(2026-11-02, `ABC-267` test note 2, revised.)* A8 uses the production `probeTable`, `storeTable` and
   `tableCutoff` over the production table through `adoptTable`. It never re-implements them, and there is no
   test-only seam.

## Size and priority

- **Size: L**, ~~about 15–35 h~~ **about 20–45 h** *(2026-11-02, `ADR-0062` D13: this ticket's 15–35 h plus `ABC-267`'s
  5–10 h; `estimate`)*: the pool, the stop slot, the option, scope 5, the folded rows and the read. Not XL: one
  mechanism, one option, one read. The fold adds test rows, not a second mechanism.
- **Priority: P2.** It is the strand's lever.

## Dependencies

- **`ABC-265` merged** (the shared table). *(2026-11-02: built at `grugops/ABC-265` `cad6ae13`, in QE.)*
- ~~**Architect/Design:** the new ADR amending `ADR-0044` D3 and D5, with the four choices in scope 4, the out-of-range
  rule, the deep-lane flag and M.~~ *(2026-11-02: written, `ADR-0062` PROPOSED.)*
- **The D12 timing probe, before Development** *(2026-11-02, `ADR-0062` D12; `qe-ABC-266-d12`, queued for an ALONE
  window, ≤ 15 min)*: `go movetime 100` and `go movetime 1000` on 20 corpus positions at `Threads` 1, 4 and 12; it
  records the played depth and which worker supplied it. **If `Threads 12`'s median played depth at 100 ms is not above
  `Threads 1`'s, the Architect re-proposes before the build**, and this page is re-cut. It is a probe, not a gate, and
  not A7.
  *(2026-11-02, `bapm-P3-page`: **read, MISS**, not loaded: 7 against 7 (`…9f9aeb87`, `…cc1de664`). Development is
  blocked until the Architect's re-proposal (`arch-ABC-266-repropose`) and this page's re-cut.)*
- **Owner: `ADR-0062` acceptance gates the merge** *(2026-11-02)*. *"accept ADR-0062 (max 12)"*, *"accept ADR-0062
  with max 8"*, or *"decline"*. It names D6's played result and D1's maximum. The D5 reversal is pre-accepted (OQ-1).
  Under reading (b), the build may start once `ABC-265` has merged and the D12 probe has read. Without an answer,
  `ADR-0044` D3 and D5 stand and this ticket is not merged. `EPIC-011` § Owner questions.
- **Owner: the 2-core rule for `THREADS_DEEP`** (owner question 2). It decides which A3, A5, A6 `G5` and A8 rows stand
  in the lane and which QE reads once out of tree. It does not block the build or the merge: the default (b) is
  written into every row.
- **Security/NFR at the gate:** place `ADR-0062` D10's `NFR-009` line and the `NFR-010` threads-child row; re-read
  `AR-UCI-BUSY` at `Threads ≥ 2`.
- **The scribe at the merge:** the `Threads` option line, the `THREADS_DEEP` command line, and AGENTS.md's UCI time-mode
  line ("no worker" now holds at `Threads 1` only).
- ~~**Harness:** whether `d` sets `Threads` per side (scope 5, `UNKNOWN - verify`).~~ *(2026-11-02: it does not; scope
  5 is owed.)*
- **Place:** after `ABC-265`, before Phase 3, and before W1 and any 40/15 reading (`ADR-0056` D6's 2026-11-02 line).
- **After it:** ~~`ABC-267`.~~ *(2026-11-02: folded in.)* T2 and T4 are re-asked on the shared table (`ADR-0025` T2
  status, `ADR-0057` D6).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0057` D2.2–D2.5, D4; *2026-11-02:* the value estimate is flagged unsupported until D12 and A7 read |
| 2 | scope and out-of-scope | ✅ *2026-11-02:* scope 4 = `ADR-0062` D1–D9; scope 5 owed (`--threads`); scope 6 = `ABC-267`'s rows; its seam and default-lane row out |
| 3 | INVEST | ✅ L (20–45 h); one mechanism behind a default-off option; testable at both thread counts. The fold adds test rows, not a second mechanism |
| 4 | testable, measurable acceptance | ✅ ~~M and N are the ADR's and are fixed on this page before Ready~~ *2026-11-02:* M = N = 12 (8 / 8 on "max 8"); A1 constructor counts 0 / k and four refusal rows with D1's text; A3 on every corpus position at 200 ms; A4 `readyok` before any `bestmove`; A5 16 MiB / 1 MiB; A7's exact command; A8 0 corrupt hits, torn > 0, overwrites > 0, 0 corrupt cutoffs in ≥ 10 M probes. Both answers to owner question 2 are written into the rows |
| 5 | dependencies known | ✅ `ABC-265`; `ADR-0062` (written, PROPOSED; its acceptance gates the merge); the D12 probe before Development; scope 5 owed |
| 6 | NFR triggers with targets | ✅ ≤ 16 MiB, growth ≤ 1 MiB (summed, table once); `NFR-010` 936 ≤ 992 MiB, lane 1 928 ≤ 2 048 MiB; `NFR-008` zero real-worker rows, ≤ 10 s; `G5` 4 s / 5 s / 60 s; `G6` floor 6; `AR-UCI-BUSY` |
| 7 | test notes | ✅ 1–7 |
| 8 | size | ✅ L, 20–45 h |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ ~~the ADR amending `ADR-0044` D3 and D5 is not written;~~ *2026-11-02:* the ADR is written (reading (b)); **`ABC-265` is not merged** *2026-11-02 (`bapm-P3-page`): **and the D12 probe read MISS**, so the design returns to the Architect (`arch-ABC-266-repropose`) and this page is re-cut before Development* *2026-11-02 (`bapm-records-1102c`): `ABC-265` merged (`605874b8`); the re-proposal found no win, and **the owner parked the strand** ("park threads"). Row 10 now reads: parked; `ADR-0062` not in force* |

**DoR 9/10. Backlog.** *(2026-11-02, `bapm-ABC-266-rows`.)* Row 10 now waits only on **`ABC-265`'s merge**. At that
merge this page reads 10/10 and may go to Ready. **The pull into Development also waits on the D12 probe**: a "not
above" reading sends the design back to the Architect and this page back for a re-cut. The merge waits on the owner's
acceptance of `ADR-0062` and on A7. The board moves are the Orchestrator's.
~~It reaches Ready when the ADR is written (reading (b)), M and N are fixed on this page, and `ABC-265` has merged.~~
*(2026-11-02, `bapm-P3-page`.)* **D12 read MISS.** DoR 9/10 stands, with row 10 blocked twice: `ABC-265`'s merge and
the Architect's re-proposal. `ABC-265`'s merge alone no longer brings this page to 10/10; the re-cut is scored afresh.
