---
id: 20261012T130400Z-software-engineer-observation-a2-and-miss-cost-not-read-31116475
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-095
at: 2026-10-12T13:04:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - NFR-004
  - probe/time.ts
supersedes:
---

# `A2` (≤ 30 ms hit) and the miss-path probe cost (≤ 5 ms): NOT READ. The host had no quiet window.

This note is hand-authored and unsealed.

**Machine:**
- Apple M3, Mac15,13;
- macOS 26.5.2, Darwin 25.5.0 arm64;
- `node --version` `v26.11.0`, the reference stack;
- AC power.

The instrument is `probe/time.ts`, with the decorator at `521a8513` and a counting stub as the inner seam. It has three
modes:
- `cold-hit` is a fresh process: a new probe, the first call on the start position, so the lazy read and parse are
  included;
- `cold-miss` is a fresh process: a new probe, the first `bookMove` on the position after 1. e4 e5 2. Ke2;
- `warm` is 200 iterations in one process.

**Attempt 1, 2026-10-12T12:51:48Z–12:51:50Z. VOID.**
- Before and after the run: load1 3.95, thermal 0, AC power.
- **Another session's vitest ran throughout.** It was `oeselg-labs/platform/repos/product-template/template`'s integration
  project (PIDs 28624 and 28867, and the sessions behind them).
- The brief rules that any other vitest process voids a reading. The raw figures are kept below as a record only, and
  are **not** evidence for `A2` or `NFR-004`. All runs saw 0 stub calls on a hit.
  - cold hit, 10 runs: 5.67, 9.78, 11.29, 17.54, 6.84, 11.03, 5.49, 5.38, 6.39, 5.20 ms;
  - cold miss probe, 5 runs: 5.38, 5.27, 4.99, 5.30, 5.01 ms;
  - warm hit: median 0.017, p99 0.327, max 0.415 ms;
  - warm miss probe: median 0.0008, p99 0.012, max 0.015 ms.

**Attempt 2: a watcher ran from about 12:53Z to 13:03:18Z, 600 s.**
- Its gate was no `vitest` process and load1 < 4.
- It never opened. load1 was 28.41 at 12:53:06Z, then 16.79, and 4.00 at 13:03:18Z.
- The `oeselg-labs/platform/repos/product-template/scaffolder` vitest workers (PIDs 29464–29494, later 64980/64996/9400)
  were present at every check. **NOT READ.**

**For whoever reads it next.** The void cold-miss figures sit right at the 5 ms bar. Most of that cost is the first-probe
read and parse of the 356,526 B artifact, which a session pays on the engine's first ply. On every void run that ply is
a book hit, not a miss. The bar text says "on an out-of-book position". Whether that means a cold probe or a warm one is
not stated. **Recorded as a question for BA/PM. It is not an assumption made here.**
