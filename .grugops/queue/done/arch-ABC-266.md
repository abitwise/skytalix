---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:39:01Z
subtask: arch-ABC-266
role: architect-design
ref: .grugops/context/arch-ABC-266/
branch: new grugops/arch-ABC-266 from main (at dispatch) — worktree .claude/worktrees/arch-ABC-266. Prototypes may use grugops/ABC-265 (cad6ae13, shared table, in QE) in a scratch checkout.
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. Multi-worker probes count against "one core": keep them short; no timing reads while a QE hop holds the host — node/property counts only.
---
# Design ABC-266 (TH-2): Lazy SMP worker pool + UCI Threads option
## Read
plans/tickets/ABC-266*.md, ABC-267 page, ADR-0057 (ACCEPTED; § Inputs for the thread tickets; owner OQ-1..4 answers), ADR-0044 (D3/D5; D5 reversal accepted under OQ-1), ADR-0025 shared-table amendment (PROPOSED; verified-copy rule), arch-ABC-265 notes (…e396e5ab: clear/stop ordering and buffer hand-off left to TH-2).
## Do
- Write the new ADR amending ADR-0044 D3/D5 — **use number ADR-0062** (a parallel hop may take 0061). PROPOSED. Settle: Threads 1 starts no worker and stays node-equal; max threads (rec. 12, or 8); worker 0's move is played; stop slot via the injected clock; clear vs stop ordering; how workers receive the SharedArrayBuffer; isready/stop during search; error/exit handling; NFR-009 summed over workers (OQ-4 a); NFR-008 default-lane bound.
- Settle the read for ABC-266: can ABC-255's `d` set Threads per side (tools-only change?) — name the N and the exact command; S′ and Levels stay Threads 1.
- Decide whether ABC-267 folds into ABC-266 and add the multi-writer probe-then-cutoff stress case to its rows.
- Name what BA/PM needs for ABC-266 (and 267) to reach DoR 10/10.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't edit ADR-0025's amendment text or ADR-0060. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-ABC-266, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

*2026-11-02, Architect/Design (claude-opus-5-5, task `arch-ABC-266`), records plus scratch probes on
`grugops/arch-ABC-266` from `main` `22b38478`. Not pushed, not merged. Nothing in `src/`, tests, `tools/`, plans or
the board moved. Every probe ran under `flock host-test.lock`, each under 5 min, counts and properties only. The
scratch copy (a `git archive` of `grugops/ABC-265` `cad6ae13`) was deleted, and nothing is left running.*

- **Written: `ADR-0062`, PROPOSED**, amending `ADR-0044` D3, D5, D6's `Threads` row and D8's emit set. Dated pointer
  lines went into `ADR-0044` and `ADR-0057` § Status. `ADR-0025`'s amendment and `ADR-0060` are untouched.
  - **D1:** `option name Threads type spin default 1 min 1 max 12`. It takes only the canonical decimals 1–12.
    Anything else is refused as `info string Threads takes an integer 1-12, got <v>; kept <old>`.
  - **D2:** `Threads 1` spawns no worker. It runs today's code path line for line. `Threads` governs only the rate-0
    `chooseMove` path; book moves, levels 1–4 and the terminal game stay as they are.
  - **D3:** `Threads k ≥ 2` runs k workers, and the main thread searches nothing. The pool is spawned at `setoption`
    and is *starting* until every worker is online. Helper diversity: none.
  - **D4:** how a worker adopts the table. The main thread allocates it and hands `tableBuffer()` over in
    `workerData`. A new `adoptTable(buffer)` binds the worker to it; after that, the worker's `clearTable()` resets
    only the verified copy.
  - **D5:** one search, in order: idle → the main thread clears → `Atomics.store(stop,0,0)` → post → each worker
    searches `budget − (now − goAt)` on the stop clock → the first result sets the slot → wait for all.
  - **D6:** the deepest completed iteration is played (tie: the lowest index), not worker 0's. The `info` line's time
    and nps come from the main thread's clock.
  - **D7:** while busy, lines queue. The exceptions are `isready` (answered at once if the queue is empty), `stop`,
    `ponderhit` and `quit`.
  - **D8:** the files and the injected pool. The worker URL uses the pool module's own extension, and
    `tsconfig.build.json` `files` gains the worker entry.
  - **D9:** a fault exits 70, with no fallback.
  - **D10:** `NFR-009` summed over isolates; the table counts once, in the main thread.
  - **D11:** the default lane has zero real workers. The new `THREADS_DEEP` lane runs workers in Node children with
    `--max-old-space-size=48 --max-semi-space-size=8`.
  - **D12:** the read.
  - **D13:** `ABC-267` folds in.
- **Probe (scratch, `measured (informal)`):**
  - **The pool works.** A worker on the adopted table is node-equal to main-thread `chooseMove` (3/3). 36/36
    multi-worker runs held every property. There were two traps: `elapsedMs` reads `Infinity` after a stop, and a
    stale slot gives depth 1.
  - **Helpers barely help worker 0:** nodes-to-depth ratios 0.87–1.75 against alone, and the same depth inside 1 M
    nodes in 64/64 runs. Odd-depth helpers and a deeper-entry rule changed nothing measurable.
  - **Memory:** the table shows only in the main thread's `arrayBuffers` (4 732 091 B against 537 811 B a worker).
  - **Heap flags:** a worker inherits the lane's heap flag (496 or 224 MiB).
- **The read for `ABC-266`:** `d` cannot set `Threads` today, so scope 5 is owed (`tools/` only). `d --threads N`
  sets `option.Threads=N` on the candidate side only. N = M = 12. The command:
  `node tools/rating/rating.ts d <candidate-sha> <candidate-sha> <out-dir> --budget-ms 100 --rounds 50 --concurrency 1 --threads 12`.
  S′ and the Levels deep lane stay at `Threads 1`.
- **`ABC-267`:** folds into `ABC-266`.
  - A3 takes `ABC-267` A1's form ({2, 4, M}, the whole corpus, movetime 200).
  - A5 becomes a standing row.
  - A new A8 is the stress, plus the probe-then-cutoff case: corrupt cutoffs = 0, and slots overwritten between the
    probe and the cutoff > 0.
  - `ABC-267`'s 2^10 seam is dropped (its keys go into 1 024 slots of the production table instead), and its
    default-lane row is settled at zero.
  - Size L, ≈ 20–45 h.
- **For the Orchestrator:**
  - (a) To the owner, Q1: *"accept ADR-0062 (max 12) / with max 8 / decline"*. It gates the merge, and it includes the
    change to the deepest completed iteration.
  - (b) To the owner, Q2, the 2-core rule. May the opt-in `THREADS_DEEP` lane run an engine child on up to M cores?
    (a) yes, recommended; (b) no. Without an answer: standing rows at `Threads 2`, and QE reads `Threads M` out of
    tree.
  - (c) Schedule the ≤ 15 min ALONE timing probe before the build (D12).
  - (d) The fold and `ABC-267`'s closure.
  - (e) Security/NFR places the `NFR-009` line, the `NFR-010` threads-child row and `AR-UCI-BUSY` at `Threads ≥ 2`.
  - (f) The scribe, at the merge: the `Threads` option line and the `THREADS_DEEP` command.
- **BA/PM, for DoR 10/10 on `ABC-266`:** the deltas are listed in the decision note. Row 10 then waits only on
  `ABC-265`'s merge.
- **Commits:** claim `dd834f90`; ADRs + notes `9ef434f3`. This Result and the move to done/ are in the closing
  commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T16:14:50Z
  from `date -u`; 2 of 2 read back, index rendered):
  - observation `20261102T161450Z-architect-design-observation-0c8cf7d0` (the probe);
  - decision `20261102T161450Z-architect-design-decision-4f828986` (the ADR, read, fold, BA/PM inputs, owner
    questions).

### Trace row (10 cells, header order)

| arch-ABC-266 | ADR-0062 for ABC-266 TH-2: Threads spin default 1 max 12 (canonical 1-12, refusal info string); Threads 1 spawns no worker (today's path); k>=2 = k workers, main searches nothing; adoptTable (worker clear resets only the verified copy); clear → reset slot → go → first result sets slot → all; deepest completed iteration played; queue with isready/stop/quit exceptions; fault exit 70; NFR-009 summed, table once; default lane 0 real workers, THREADS_DEEP children at 48/semi 8 (72 MiB an isolate); d --threads 12 read command; ABC-267 folded; probe: 3/3 identity, 36/36 properties, helpers barely shorten worker 0 (64/64 same depth) | EPIC-011 | ADR-0062 (PROPOSED; owner's); ADR-0044 and ADR-0057 dated pointers; cites ADR-0025 amendment, ADR-0026, ADR-0027, ADR-0016, ADR-0058 | NFR-004, NFR-005, NFR-008, NFR-009 (line for Security/NFR), NFR-010 (threads-child row for Security/NFR), AR-UCI-BUSY; no NFR file | `grugops/arch-ABC-266` (records only; claim `dd834f90`, ADR + notes `9ef434f3`) | scratch prototype only (deleted) | — (records) | — | Records done (Architect); awaits the owner (Q1 accept/max, Q2 2-core rule), the Orchestrator (D12 timing probe, fold), BA/PM page deltas, Security/NFR placements, ABC-265's merge |
