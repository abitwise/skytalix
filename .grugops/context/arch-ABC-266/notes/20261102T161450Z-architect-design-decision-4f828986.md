---
id: 20261102T161450Z-architect-design-decision-4f828986
kind: decision
by: architect-design
at: 2026-11-02T16:14:50Z
verified_by: 
confidence: high for the design and the read command; the ADR is PROPOSED, acceptance and the 2-core rule are the owner's; the A7 outcome is UNKNOWN - verify (D12 probe)
refs:
  - ABC-266
  - arch-ABC-266
  - grugops/arch-ABC-266
  - 22b38478
  - dd834f90
  - EPIC-011
  - ABC-267
  - ABC-265
  - ADR-0062
  - ADR-0044
  - ADR-0057
  - ADR-0025
  - ADR-0026
  - ADR-0027
  - ADR-0016
  - ADR-0058
  - ADR-0056
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - NFR-010
  - AR-UCI-BUSY
  - ABC-255
  - orch-2026-10-30a/81ae2db4
  - arch-ABC-265/e396e5ab
supersedes: 
seal: sha256:351e95bbebc65ed0e9acdbc5edc003016b7c90ecf3fa48882e783cc4908b07e9
---

# ABC-266 (TH-2): ADR-0062 written, PROPOSED (amends ADR-0044 D3/D5); played result = deepest completed iteration; read command fixed; ABC-267 folds in

Architect/Design, task `arch-ABC-266`, branch `grugops/arch-ABC-266` from `main` `22b38478`. Records only plus scratch probes (observation of this task). Nothing in `src/`, tests, `tools/`, `plans/` or the board moved.

- **ADR-0062, PROPOSED** (the owner's; reading (b): build may start, merge waits on acceptance, `ABC-265`'s merge and A7). Amends `ADR-0044` D3, D5, D6's `Threads` row, D8's emit set. Pointer lines added to `ADR-0044` § Status and `ADR-0057` § Status.
  - **D1:** `option name Threads type spin default 1 min 1 max 12` after `TimeMode`; `MAX_THREADS` 12 (8 if the owner says so). Accepted only as canonical decimal 1-12; else keep old + `info string Threads takes an integer 1-12, got <v>; kept <old>`. `Threads` leaves the ignored list; `ucinewgame` does not reset it.
  - **D2:** `Threads 1` spawns no worker and runs today's in-thread path line for line (G4, lanes unedited, AR-UCI-BUSY as today). `Threads` governs the rate-0 `chooseMove` path only; book moves and levels 1-4 stay in the main thread; terminal game untouched; deterministic mode at `Threads 1` only.
  - **D3:** `Threads k>=2` = k workers, main thread searches nothing (so isready/stop answered during a search). Pool spawned at `setoption` (k>=2), closed at k=1; *starting* until every worker is online. Worker gets the `Position` and prior keys by structured clone, budget, go arrival time, maxDepth/maxNodes. Helper diversity: none (probe saw no effect); index reaches each worker for a later rule.
  - **D4 (adoption):** main allocates (clearTable before spawn), hands `tableBuffer()` in `workerData` once; worker calls new export `adoptTable(buffer)` once: binds its view, then its `clearTable()` resets only the verified copy; throws on a wrong byte length. Not an EngineOptions field.
  - **D5 (clear vs stop):** idle (every worker posted) → main `clearTable()` → `Atomics.store(stop,0,0)` → post go → workers `chooseMove` with `budget - (Date.now() - goAt)` and `stopClock` → first result sets slot 1 → all results → choose, write. Every search ends with slot 1, so a worker's first `Atomics.load` reading 0 orders the clear before its search. No `Atomics.wait`.
  - **D6:** played = deepest completed iteration among workers, tie lowest index (changes `ADR-0057` § Inputs' worker-0 recommendation, on the probe plus SP1/SP1b core speeds). `info`: depth/score/pv of the played result; nodes summed; time and nps on the main clock (a worker's `elapsedMs` reads Infinity/NaN after a stop).
  - **D7:** while starting/searching, lines queue in order; exceptions: `isready` with empty queue answered at once while searching; `stop`/`ponderhit` set the slot; `quit` = stop, bestmove, close, end; end of input = quit. go infinite holds as D4.3.
  - **D8:** `src/search-pool.ts` + `src/search-worker.ts` (names the Engineer's); session takes the pool as an optional injected capability (absent → every go in-thread); worker URL uses the pool module's own extension; `tsconfig.build.json` `files` gains the worker entry; uci.ts closes the pool on every end path; workers unref'd.
  - **D9:** worker error/messageerror/unasked exit, constructor throw, or callback exception = fault: stderr internal error, exit 70, close pool. No fallback to Threads 1.
  - **D10 (NFR-009, OQ-4 a):** per isolate after gc, pre-search vs 1 s vs 4 s; Σ growth + table ≤ 16 MiB; Σ growth 1 s→4 s ≤ 1 MiB per field; table counted once in main (pre-pool baseline taken before the first clearTable). Line for Security/NFR to place is in D10.
  - **D11 (NFR-008/010):** default lane: zero real workers (a worker inherits the lane flag, 224 MiB; suite shape already 2 016/2 048) — fake-pool rows only; ABC-267 A4 settled at zero. New deep lane `THREADS_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.threads.test.ts`; every real-worker row runs in a Node child (`node <flags> src/uci.ts`, or a fixture for A5/A8) with `--max-old-space-size=48 --max-semi-space-size=8`: 72 MiB an isolate (PR-6), child + 12 workers 936 MiB inside the one-file shape's 992 MiB child allowance, lane 1 928 ≤ 2 048 MiB; Security/NFR places the row. The CPU rule is owner question 2; default: standing rows at Threads 2, Threads 4/M only in A7, and A5/G5 at M and A8 at W 12 read once by QE out of tree.
- **The read (A7) and scope 5:** `d` cannot set Threads today (read). Scope 5: `d --threads N` (text `^([1-9]|1[0-2])$`), `option.Threads=N` on the candidate side only, recorded in machine.txt, shown in --dry-run; tools/ only. N = M = 12. Command: `node tools/rating/rating.ts d <candidate-sha> <candidate-sha> <out-dir> --budget-ms 100 --rounds 50 --concurrency 1 --threads 12` (QE, host ALONE, CUTECHESS_CLI and STOCKFISH set). S' (`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`) and the Levels deep lane stay Threads 1.
- **Pre-build timing probe (recommended, Orchestrator's to schedule, ≤ 15 min ALONE):** scratch pool, go movetime 100 and 1000, 20 corpus positions, Threads 1/4/12: played depth and supplying worker. If Threads 12's median played depth at 100 ms is not above Threads 1's, the Architect re-proposes (diversity or ADR-0058's rule at Threads>=2) before the build. Reason: helpers barely help (probe), A7's bar is >= 50.0/100, F4 forbids a replay.
- **ABC-267 folds into ABC-266.** A3 takes ABC-267 A1's form (Threads {2,4,M}, every corpus position, movetime 200; above the fit/2-core answer via A7). A5 becomes a standing THREADS_DEEP row. New A8 = ABC-267 A2 stress (W 4 and 12, or 2 by default; 4 096 keys into 1 024 slots of the production table via adoptTable; >= 10 M probes; corrupt hits 0, torn > 0) plus the probe-then-cutoff case (tableCutoff returns scoreOf(key) on every hit; slots overwritten between probe and cutoff > 0; corrupt cutoffs 0). ABC-267 scope 5 seam dropped; A4 settled at zero rows; A5 joins A6. Size L, ≈ 20-45 h.
- **BA/PM for DoR 10/10 (ABC-266):** adr line → ADR-0062; scope 4 → ADR-0062 D1-D9 (incl. deepest-completed change); M = 12 in A1 and N = 12 in A7 (8/8 if the owner says max 8); A1 refusal rows (0, 13, a non-number, `07`) with the D1 text, and the constructor count via a counting fake factory (k=1 → 0, k → k); A3/A5/A8 as above with THREADS_DEEP and its command; A4 at Threads 2 plus fake-pool queue rows and a source row on the 1 024-node clock check; A6 gains the determinism source row and G8 with zero default-lane real workers; scope 5 = the `--threads` flag and the exact A7 command with `--concurrency 1`; NFR triggers: NFR-009 line (D10) and an NFR-010 threads-child row to Security/NFR, NFR-008 zero rows; dependencies: ADR-0062 acceptance for the merge, the D12 probe before Development; size L 20-45 h. Row 10 then waits only on `ABC-265`'s merge. **ABC-267:** close as merged into ABC-266 (board move the Orchestrator's).
- **Owner questions:** (1) "accept ADR-0062 (max 12)" / "with max 8" / "decline" (it gates the merge; includes the deepest-completed change). (2) The 2-core rule: may the opt-in THREADS_DEEP lane run an engine child on up to M cores for its rows, (a) yes, run with the host ALONE, or (b) no, rows stay at Threads 2 and Threads 4/M are read only through A7 and QE's out-of-tree readings. Recommended: (a). Default without an answer: (b).
- **For the Orchestrator:** the fold; scheduling the D12 probe; Security/NFR at the gate (NFR-009 line, NFR-010 child row, AR-UCI-BUSY at Threads>=2); scribe at merge (Threads option line, THREADS_DEEP command, the UCI time-mode line's "no worker" now Threads 1 only).
