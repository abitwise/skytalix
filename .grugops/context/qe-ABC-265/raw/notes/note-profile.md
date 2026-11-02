# qe-ABC-265 A4 profile review (reported, not graded): the SE's method and arithmetic hold; the store about doubles per call (~30 → ~65 ns), the probe is flat within noise, and the pair stays ≈ 1-1.5 % of samples. D2.3's cost UNKNOWN is settled as "small", consistent with G6 head = base

QE reviewed `se-ABC-265` `raw/profile/` (`analysis.txt`, `percall.txt`, `counts.txt`). The instrument is `se-ABC-253`'s `profile.sh`, `run.mts` and `analyse.mts`, run unchanged on the new layout. No new profile was run or graded at this hop (PREREG).

- **Method:** `node --cpu-prof --cpu-prof-interval=200` (200 µs), `chooseMove` 4 s, 2 fresh runs a board, base then head. That gives about 16 000 samples a run. Self-time share is read by function.
- **Arithmetic re-done by QE** (share × 4 000 ms ÷ (nodes × calls a node)), for head kiwipete run 1:
  - `storeEntry`: 0.20 % → 8.0 ms ÷ (3 483 373 × 0.0367 = 127 840 calls) = 62.6 ns. The SE reads ~63.
  - `probeTable`: 0.98 % → 39.2 ms ÷ 221 543 = 177 ns. The SE reads ~177.
  - Base kiwipete run 1, `storeEntry`: 0.11 % → 4.4 ms ÷ 124 833 = 35 ns. The SE reads ~35.
  - The figures reproduce.
- **Caveats (why it stays an estimate):**
  - The calls a node come from a separate fixed-depth counted run, not from the profiled run.
  - Base `storeEntry` at 0.09–0.11 % is about 15–18 samples a run. Its Poisson error is about ±25 %, so "doubles" means about 2× ± 0.6, not exactly 2.
  - V8 inlining can move self time into callers. The pair's share of samples is the robust figure: base 0.98–1.29 %, head 1.04–1.54 %.
  - A foreign `/app` node service ran on the host throughout (the SE's note).
- **Reading:** the extra cost is the store's two key-half XOR words and the `bigint` → two `Number` split. It moves the pair by ≤ 0.3 percentage points of samples. That is under the host's 1.8–5.9 % A/B spread, and G6 (graded) reads head = base on both boards. Nothing here argues for F2.
