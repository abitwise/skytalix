---
id: ABC-266
title: "TH-2: a Lazy SMP worker pool over the shared table behind a UCI Threads spin option, default 1; Threads 1 unchanged node for node; read once, Threads N against Threads 1 at 100 ms, labelled a hardware gain"
status: backlog
column: Backlog
size: L
priority: P2
epic: EPIC-011
feature: —
adr: "Owed: a new ADR amending ADR-0044 D3 (the option rows) and D5 (one thread, no worker), the Architect's. The D5 reversal is pre-accepted by the owner (ADR-0057 OQ-1 yes, …81ae2db4); the ADR's text is still reported to him. Source: ADR-0057 (ACCEPTED 2026-11-02) D2.2, D4 and § Inputs for the thread tickets"
---

# ABC-266: the worker pool and `Threads` (TH-2)

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

## Scope

1. **A worker pool on `worker_threads`** (D2.2). One search a worker. Every worker searches the same root with the
   same deepening loop (Lazy SMP, D2.1). `ABC-265`'s shared table is handed to each worker once. Each worker keeps
   its own killers, history and ordering scratch.
2. **The stop slot:** an `Int32Array` over a small `SharedArrayBuffer`, read through the injected clock, as
   `ADR-0044` D5's pre-designed upgrade says. Each worker checks it at `NODES_PER_CLOCK_CHECK` (1 024), as today.
3. **A UCI `Threads` spin option, default 1**, with the maximum and the out-of-range rule the ADR sets.
4. **The new ADR**, amending `ADR-0044` D3 and D5. It fixes the four choices `ADR-0057` § Inputs leaves to it. The
   Architect recommends each one as follows:
   - `Threads 1` spawns no worker and runs today's in-thread path;
   - the maximum is 12, one per physical core, or 8 if the owner wants room left on the host;
   - worker 0's best move is played, and helpers only fill the table (helper diversity is the ADR's to pick);
   - the terminal game is unchanged at `Threads 1`, with no new surface (`ADR-0044` D7).
5. **The read's harness configuration.** If `ABC-255`'s `d` cannot set `Threads` per side, this ticket adds the
   smallest `tools/rating/` change that does. It is harness configuration only: no engine path is keyed on it (R-TC
   part 1). Whether `d` can already do this is `UNKNOWN - verify`, settled at the design hop.

## Out of scope

- The table layout (`ABC-265`). The torn-entry stress, the `NFR-009` instrument summed over workers as a standing
  row, and the default lane's 2-worker row (`ABC-267`).
- Pondering (`EPIC-011` § Out of scope). Several games at once (Q-3K-3 under OQ-2 (a)). Any device (OQ-5 no; `ADR-0057`
  D6 parks the accelerator strand). Any change to `LEVELS`, the levels' budgets or the terminal game (`G9`).
- W1's soft and hard time limits (Phase 5). They are written against this pool later (`ADR-0056` D6's 2026-11-02
  line, item 3).
- The parked T2 and T4. They are re-asked after this ticket, on the shared table (`ADR-0057` D6's dated line).

## Acceptance criteria

- **A1 (the option).**
  - **Given** `uci`, **then** the output adds exactly one line, `option name Threads type spin default 1 min 1 max M`,
    where M is the ADR's maximum (12 recommended). The option-list rows in `src/uci-session.test.ts` grow by that line
    and no other.
  - **Given** `setoption name Threads value k` for k = 1, 2 and M, **then** the next `go` searches with k workers.
    That is 0 workers spawned for k = 1 if the ADR keeps "no worker at `Threads 1`", read by a test-side count of the
    `Worker` constructor.
  - **Given** k = 0, k = M + 1 or a non-number, **then** the ADR's out-of-range rule holds, one row each. `ADR-0044`
    D3's existing spin-option practice is the precedent.
- **A2 (`Threads 1` unchanged).** At `Threads 1`, both by default and when set explicitly:
  - `G4`, node-equal cross-build on the `ABC-078` `A3` corpus: `chooseMove` and `search()` equal base's in move, score
    and nodes. Every older door equals its pre-ticket self. QE runs it out of tree, base tree against head tree.
  - The UCI session lanes pass **unedited** apart from A1's one option line: the default lane and `ENGINE_DEEP=1
    NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`. The CLI rows in `src/cli*.test.ts`
    pass unedited.
  - `AR-UCI-BUSY` reads as today. `G5`: level 5 ≤ 4 s a move, the 5 s ceiling at levels 1–5, and `uci-clock-mode`'s
    60 s (`NFR-004`).
- **A3 (`Threads N` plays).** Deep lane (the flag is the ADR's; `ENGINE_DEEP=1` is the precedent), at `Threads 2` and
  `Threads M`, on at least 10 positions of the `ABC-078` `A3` corpus, `go movetime 500` each:
  - exactly one `bestmove`, legal in the position (checked against `legalMoves`);
  - it arrives no later than the bound the existing `Threads 1` movetime row asserts for the same movetime;
  - no thrown error, and no worker `error` event or non-zero `exit`;
  - after `quit`, the process exits 0 with no worker left running.
- **A4 (stop and `isready` during a search).** At `Threads 2`, during a `go infinite`:
  - `isready` answers `readyok` within `AR-UCI-BUSY`'s bound (`ADR-0057` D4, `ADR-0044` D5's side gain);
  - `stop` gets exactly one legal `bestmove` within the same bound.
  - A source row reads each worker's clock consulting the stop slot every `NODES_PER_CLOCK_CHECK` nodes (`NFR-004`).
- **A5 (memory, `NFR-009` under OQ-4 (a)).** At `Threads M`, read by QE as `G7` reads it: retained growth, the
  `arrayBuffers` and heap growth fields, summed over the main thread and every worker. The shared table is counted
  once.
  - **Bar:** ≤ 16 MiB, and growth ≤ 1 MiB between a 1 s and a 4 s search. About 10 MiB is expected at 12 workers
    (`estimate`, SP6). That figure is not a bar.
  - Each worker's V8 baseline heap is reported and sits outside the bound (OQ-4 (a)).
- **A6 (gates).**
  - `G1` (≥ 54/58) at `Threads 1`.
  - `G4` (A2).
  - `G5` at `Threads 1` and at `Threads M`.
  - `G6` at `Threads 1`.
  - `G7` (A5).
  - `G8`: `N8-LANE` reported. This ticket adds **no** multi-worker row to the default lane; `ABC-267` adds at most one.
  - `G9`.
- **A7 (the read).** One read before the merge: **`Threads N` against `Threads 1`**, the same candidate build on both
  sides. N is pre-registered on this page at Ready (recommended: M).
  - **How it runs:** 100 games at 100 ms a move, openings 1–50 with both colours, one game at a time, QE with the
    host ALONE, through `ABC-255` (with scope 5 if needed).
  - **Bar:** 100 of 100 games complete, 0 faults by either side, 0 losses on time at the 50 ms margin, and **≥ 50.0 of
    100** (GAIN, `ADR-0056` C2′).
  - **Reported:** labelled **"hardware gain, N CPU against 1 CPU"**. W/L/D, the score and `cutechess-cli`'s Elo ±
    error, in wall time **and** in core-seconds (N × wall for the N side; `ADR-0057` D4). This read gives η × E_d
    together (`ADR-0057` § Consequences).
  - **Beside it, at `Threads 1`:** S′ (10 games at 0.5 s against Stockfish 19 at E 1 650, `r <candidate> <out>
    --budget-ms 500 --rounds 5 --concurrency 1`, `timemargin` 50 ms; 10 of 10 complete, 0 faults, 0 losses on time,
    ≥ 3.0 of 10, below that 10 more and ≥ 7.0 of 20). Also the Levels deep lane (`ENGINE_DEEP=1
    NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, exit 0, every test
    passed).
  - **This is the only `Threads N` read in the strand.** Every Phase 2–5 read stays `Threads 1` against `Threads 1`
    (OQ-2 (a)).
- **Falsifiers.**
  - **F1:** A1–A4 red, or a lane red no recorded re-pin explains, is a defect, back to the Software Engineer.
  - **F2:** A2's `G4` red at `Threads 1` is a defect. The default product must not move.
  - **F3:** A5 above 16 MiB is NOT MET. Above 16 MiB is the owner's (Q-3K-6). A lower M is the Architect's
    re-proposal.
  - **F4:** A7 NOT MET (below 50.0 of 100), or an S′ collapse, means not merged. The ADR reads "accepted, not in
    force". A miss is not re-played.

## NFR triggers

- **`NFR-009`:** ≤ 16 MiB, growth ≤ 1 MiB, retained growth summed over workers, table counted once (A5; OQ-4 (a)).
  `NFR-009`'s file may need one line stating that reading. That line is this ticket's design hop, with
  Security/NFR (`ADR-0057` § Inputs, "owed by other roles").
- **`NFR-004`:** each worker checks the clock every 1 024 nodes. `G5` at both thread counts (A2, A6).
- **`NFR-005`:** `G6` at `Threads 1`.
- **`NFR-008`:** no default-lane multi-worker row here. Multi-worker rows sit behind the deep flag.
- **`AR-UCI-BUSY`:** unchanged at `Threads 1`; met during a search at `Threads ≥ 2` (A4).
- **Security (ASVS L1):** one new option value parsed from UCI input. The out-of-range rule is A1's. No other input
  path.

## Test notes

1. Multi-worker play is not deterministic, so `Threads ≥ 2` rows assert **properties only**: legal, bounded, no
   throw, clean exit. They never assert node counts or a specific move (`ADR-0057` D4, `G4` row).
2. `Threads 1` rows keep every existing oracle (A2). Deterministic mode (`ADR-0027`) holds at `Threads 1`.
3. Reuse sourced fixtures. No hand-labelled rows.
4. Shipped-path rows that move are re-pinned with old and new figures. The PR lists every re-pointed row. The target
   is A1's one option line.
5. UAT is owed (a new product option). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).

## Size and priority

- **Size: L**, about 15–35 h (`estimate`, BA/PM's share of `ADR-0057`'s 32–65 h for the strand): the pool, the stop
  slot, the option, the read and possibly scope 5. Not XL: one mechanism, one option, one read.
- **Priority: P2.** It is the strand's lever.

## Dependencies

- **`ABC-265` merged** (the shared table).
- **Architect/Design:** the new ADR amending `ADR-0044` D3 and D5, with the four choices in scope 4, the out-of-range
  rule, the deep-lane flag and M. **Owner:** the D5 reversal is pre-accepted (OQ-1). The ADR's text is reported to
  him. Under reading (b) the build may start once it is written.
- **Harness:** whether `d` sets `Threads` per side (scope 5, `UNKNOWN - verify`).
- **Place:** after `ABC-265`, before Phase 3, and before W1 and any 40/15 reading (`ADR-0056` D6's 2026-11-02 line).
- **After it:** `ABC-267`. T2 and T4 are re-asked on the shared table (`ADR-0025` T2 status, `ADR-0057` D6).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0057` D2.2–D2.5, D4 |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ L; one mechanism behind a default-off option; testable at both thread counts |
| 4 | testable, measurable acceptance | ✅ each row has a count, a bound, a state or a score. M and N are the ADR's and are fixed on this page before Ready |
| 5 | dependencies known | ✅ `ABC-265`; the ADR; the harness question |
| 6 | NFR triggers with targets | ✅ ≤ 16 MiB, growth ≤ 1 MiB (summed); `G5` 4 s / 5 s / 60 s; `G6` floor 6; `AR-UCI-BUSY` |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ L |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ the ADR amending `ADR-0044` D3 and D5 is not written; `ABC-265` is not merged |

**DoR 9/10. Backlog.** It reaches Ready when the ADR is written (reading (b)), M and N are fixed on this page, and
`ABC-265` has merged. The board move is the Orchestrator's.
