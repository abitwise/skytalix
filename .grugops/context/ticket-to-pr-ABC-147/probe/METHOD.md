# ABC-147 probe method — declared BEFORE the first graded run (ticket Test note 1)

Declared 2026-10-11 by the Software Engineer (subtask `ticket-to-pr-ABC-147`, task `wave-2026-09-25`).
It is committed before any graded run. The commit time is the proof of order.

**One run came before this file:** a single feasibility run, recorded and **not graded**. It checked
whether `NODE_OPTIONS=--cpu-prof` reaches every vitest worker thread. It did: 93 profiles, 61 of them
worker threads of the vitest process, 54 files and 1715 tests green. It also found two things that shape
the rules below:
- tests spawn child `node` processes (plain node, no vitest runner in them);
- profile samples count a thread as busy while it is descheduled, so sampled busy time can be higher
  than user+sys.

## Commit and setting

- Tree: the wave tip `63ac790f`, in a worktree with `node_modules` symlinked to the main checkout.
- Worker setting: **uncapped**. `vitest.config.ts` at `63ac790f` has `pool: "threads"`, `isolate`
  default `true`, and no `maxWorkers`, which resolves 7 on this M3 (`…a898a14a`). `ABC-144`'s cap has
  **not** merged, so A1 is read at the uncapped setting.

## A1 — how the lane's CPU is attributed

- **Command**, per profiled run, from the worktree:
  `/usr/bin/time -p env NODE_OPTIONS="--cpu-prof --cpu-prof-dir=<fresh dir>" npm test`.
  - The V8 sampling profiler runs at its default 1 ms interval in **every** node process and thread of
    the lane: npm, the `run-bounded.js` wrapper, the vitest main process, every worker thread, and every
    child `node` that a test spawns.
- **Unprofiled runs are interleaved** with the profiled ones (P/U pairs, alternating order). They give
  the lane CPU in seconds without profiler overhead. The profiled runs give the proportions.
- **Before and after every run**, logged:
  - load1 (`sysctl -n vm.loadavg`);
  - `notifyutil -g com.apple.system.thermalpressurelevel`;
  - the power source;
  - the count of foreign `vitest` processes.
- A run that starts at **load1 > 8** is recorded and **not used**.
- Round 0 (one P and one U) is a warm-up. It is recorded and discarded.
- **Rounds:** 1..5 are scored, so n = 5 per arm (the ticket needs n ≥ 3). If fewer than 3 profiled runs
  are usable after the load1 rule, more rounds are run, and the extra rounds are recorded.
- **Counts per run:** files and tests from a fresh `.test-results/last-run.json` (deleted before the
  run), exit 0, 0 failed. Every run must equal round 0's counts.

### Self time

- Each sample's duration is `timestamps[i+1] − timestamps[i]` (the Chrome DevTools convention). The last
  sample runs to `endTime`. Self time per profile node is the sum over its samples.
- `(idle)` samples are **excluded**. They are not CPU. The denominator is every other sampled
  microsecond in every profile of the run: "sampled busy".

### Buckets, by the frame's `callFrame.url`

- **(iv) Node internals and GC:**
  - functionName `(garbage collector)`;
  - any url beginning `node:`.
- **(v) unattributed:**
  - `(program)` and `(root)`;
  - any url that matches no rule below.
- **Native frames** have an empty url and a function name not in parentheses (built-ins such as
  `Array.prototype.push` or `Map.get`). They are **billed to their nearest ancestor frame with a
  non-empty url**, and bucketed by that url. If there is no such ancestor, they go to (v).
  - This bills a built-in called by production code to production code, which is what Test note 3 asks
    for.
- **(iii) runner stack:**
  - any path containing `/node_modules/` (vitest, vite, vite-node, tinypool, chai, @vitest/*, rollup,
    npm's own CLI, and anything else installed);
  - any `wasm://` url;
  - repo files under `tools/grugops/` (the lane's own wrapper and reporter);
  - `vitest.config.ts`.
- **(ii) test files:**
  - any `*.test.ts`;
  - every other repo file outside `src/` (for example `tools/opening-book/*.ts`). Its subtotal is
    reported separately.
- **(i) production:** any repo file under `src/` that is not `*.test.ts`.

### Where the CPU runs

Each profile is classed by its filename `CPU.<date>.<time>.<pid>.<tid>.<seq>.cpuprofile`:
- **vitest worker:** a `tid > 0` profile of the process that has worker threads;
- **vitest main:** `tid 0` of that same process;
- **child:** any other pid, tid 0. These are npm, the wrapper, and node processes spawned by tests.

Bucket (i) is reported two ways:
- **(i) total**;
- **(i-w)**, the part inside vitest worker threads.

Only (i-w) runs under the vitest module runner. Production code in a child `node` process already runs
under plain node, so the factor is 1 there.

### Per test file

A worker profile whose nodes name exactly one `*.test.ts` url is that test file's. Its (i) time is
summed per test file. A worker profile that names zero test files, or more than one, is counted as
"worker, no single file", and that figure is reported.

### Reported per run, and as median with min–max over the usable runs

- the five bucket shares of sampled busy (they sum to 100 % by construction);
- (i-w)'s share;
- bucket (i)'s **top five `src/` files**;
- the per-test-file (i-w) ranking;
- sampled busy in seconds, against `/usr/bin/time` user+sys of the same run (coverage);
- files and tests.

## A2 — the factor on the lane's own workload

- The two default-lane test files with the most **(i-w)** CPU (median rank over the usable A1 runs) are
  picked.
- From each, one representative production call is taken, as the test file itself makes it.
- It runs under plain `node` (`node <probe>.mjs`, which imports `src/*.ts` by type stripping, as
  `npm run chess` does) and inside vitest. The vitest side is a probe test file under this `probe/` dir,
  run with a probe-only config under `probe/` (`npx vitest run -c <probe config>`). It uses the same
  pool (`threads`).
  - `vitest.config.ts` is **not** touched.
- **Paired and interleaved:** node, vitest, node, vitest… with **n ≥ 3** pairs per file.
  - Each process makes the call once as warm-up and then K times timed with `performance.now()`. It
    reports the median of the K timings.
  - The ratio of a pair is vitest median ÷ node median.
- **Equal work is checked on every pair:** a deterministic digest of the call's output (node count,
  perft count, or move list, whichever the call returns) must be byte-equal between the two sides. **A
  pair whose digests differ is void**, not averaged.
- load1 and thermal pressure are logged before every process. A pair whose either side starts at
  load1 > 8 is recorded and not used.

## A3 / A4

- **R = lane CPU × share × (1 − 1 ÷ ratio).**
  - lane CPU: the unprofiled runs' user+sys median.
  - share: **(i-w)**. This is the only production CPU that pays the factor. That choice is declared
    here, before any reading.
  - R **on the letter**, with share = all of (i), is also reported.
- **Band:**
  - lower edge = (i-w) min × (1 − 1 ÷ lowest ratio);
  - upper edge = (i-w) max × (1 − 1 ÷ highest ratio).
  - If the two files' ratios differ by more than 2x, both ratios are carried into the band, and no
    single ratio is quoted.
- **A4 picks its arm by the lower edge of the (i-w) band:**
  - ≥ 15 % → a P1 lever ticket (BA/PM cuts it);
  - 5–15 % → the owner;
  - < 5 % → close.
- If the letter's band would pick a different arm, both are reported, and the declared (i-w) arm is the
  one that rules.
