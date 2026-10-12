---
id: 20261012T141400Z-software-engineer-observation-a2-cold-and-r3-warm-miss-not-read-a045086f
kind: observation
by: software-engineer
task: wire-ABC-095
at: 2026-10-12T14:14:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - NFR-004
  - ADR-0037
  - probe/time.ts
  - 20261012T130400Z-software-engineer-observation-a2-and-miss-cost-not-read-31116475
supersedes:
---

# `A2` (≤ 30 ms, COLD) and the warm miss bar (max of 200 ≤ 5 ms, R3): NOT READ. No quiet window opened in 15 minutes.

This note is hand-authored and unsealed. **No figure in it is evidence for `A2` or `NFR-004`. Nothing was
estimated.**

**Machine:** Apple M3, Mac15,13; Darwin 25.5.0 arm64; `node --version` v26.11.0, the reference stack; AC power.

**Instrument:** `.grugops/context/wire-ABC-095/probe/time.ts`, one fresh process per reading, outside the suite.
Both modes build the probe with `readBookFile` from `src/book-file.ts` (R3 step 2).
- `cold-hit` (`A2`): the first `withBook(probe, stub)(start)` call in the process, timed around that call only,
  so the one read and parse are inside it.
- `warm-miss` (R3): one warm-up `bookMove` on the start position (asserted a hit), `P` (after 1. e4 e5 2. Ke2)
  asserted out of book, then 200 timed `bookMove(P)`. It reports the median (100th), the p99 (198th) and the max
  (200th).

**The gate, `probe/window.sh` (its log is `probe/window.log`):** it polled `pgrep -f '[v]itest'` every 15 s from 13:57:56Z to 14:13:03Z
(900 s). A reading would be taken only with no vitest present, with load1, thermal, `pgrep -fl '[v]itest'` and
power logged before and after, and it would be voided if vitest appeared by the after-log.

**What the logs show.** The script logs only when a poll is clear, and at the end. So `probe/window.log` holds the
end block only. The "before" and "during" lines below are from my separate in-session checks, with the same
commands.
- **Not one poll was clear.**
- **Before** (13:57:39Z / 13:59:15Z): load1 4.69 / 4.79. `pmset -g therm`: no thermal, performance or CPU-power
  warning recorded. AC power. vitest present:
  - `oeselg-labs/platform/repos/product-template/template` (`vitest run --project integration`, PID 13848);
  - the grugops kit (`/Users/olgeroeselg/Projects/public/grugops`, `vitest run … install/*.test.ts`, PID 21335,
    later `vitest run --exclude **/scripts/e2e/**`, PID 25157).
- **During** (14:09:50Z): the kit's vitest (PID 88316 and workers), and
  `oeselg-labs/platform/repos/product-template/scaffolder`'s vitest (PID 27086, 7 workers).
- **End** (14:13:03Z): load1 7.24 (5 min 11.18). Thermal: no warning recorded. AC power. vitest: the scaffolder
  (27086, 27124) and the kit (77996, 88316).

**A smoke run of the instrument** (one `cold-hit`, one `warm-miss`, about 13:57Z, under the foreign vitest above)
only checked that the script runs. Inner seam calls 0 on the hit, 0 warnings, `P` out of book in all 200 calls.
**It is void and its figures are not recorded as readings.**

**For the next reader (QE, or a later SE hop):**
1. Wait until `pgrep -fl '[v]itest'` is empty.
2. Then run, from the worktree root:
   - `node .grugops/context/wire-ABC-095/probe/time.ts "$PWD" cold-hit`, ×10 fresh processes, for `A2` (read
     the max against 30 ms);
   - `node .grugops/context/wire-ABC-095/probe/time.ts "$PWD" warm-miss`, ×1 or more, for R3 (read the max
     against 5 ms, and record the median and p99).
3. Log load1, thermal, `pgrep` and power before and after.

**`A2` stays unmet until that is done.** The miss bar's other half, `A3`'s call count, is met (`…2cc11fef`).
