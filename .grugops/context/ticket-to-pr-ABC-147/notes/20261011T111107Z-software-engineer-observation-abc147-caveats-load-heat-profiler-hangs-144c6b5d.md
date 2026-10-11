---
id: 20261011T111107Z-software-engineer-observation-abc147-caveats-load-heat-profiler-hangs-144c6b5d
kind: observation
by: software-engineer
at: 2026-10-11T11:11:07Z
verified_by:
confidence: medium
refs:
  - ABC-147
  - ABC-122
  - .grugops/context/ticket-to-pr-ABC-147/probe/METHOD.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-lane.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-out-12-P-hung.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/feasibility-ungraded.out.txt
supersedes:
---

# `ABC-147` caveats: load, heat, a profiler-only hang, and what was not read

This note is hand-authored and unsealed.

- **One ungraded run came before the method.** It was a feasibility check of `--cpu-prof` coverage
  (93 profiles, 54 / 1715 green). `METHOD.md` says so.
  - Its shares were close to the graded runs'. Nothing was chosen from it: the bucket rules are a
    plain url map, and the `A2` files came from the graded ranking.
- **Load.**
  - Rounds 0–5 ran at load1 11.8–23.5 while the QE hops ran vitest mutants and the ladder. All 12 were
    recorded and not used.
  - Back-to-back lane runs push load1 past 8 by themselves. From round 12 on, the harness waited for
    load1 ≤ 6 before each run (at most 300 s, logged as `waited_s`). That is a scheduling gate. **The
    usability rule (load1 > 8 → not used) is unchanged.**
  - **No run at load1 > 8 is graded.**
- **Heat.**
  - `A1`: profiled run 17 started at thermal pressure **2**. Its CPU (42.22 s) and coverage (1.37) are
    the outliers, and its (i) share is the minimum, 37.68 %. It is kept as declared. Dropping it would
    **raise** the lower edge.
  - `A2`: every process started at pressure 1. The ratios are paired, so a common slowdown cancels.
- **Profiler-only hang.**
  - 5 of 18 profiled runs hit `run-bounded.js`'s 60 s bound, exit 124: rounds 0, 3, 7, 10 and 12.
    **0 of 18 unprofiled runs did.**
  - It is not load: round 12 started at load1 5.79.
  - The console shows no file finished, but output may be lost when the tree is SIGKILLed.
  - A hung run writes no worker profiles, so it is void. Its cause is `UNKNOWN - verify`, and outside
    this ticket.
  - **Anyone who re-uses `NODE_OPTIONS=--cpu-prof` on this lane should expect it.**
- **Sampling counts descheduled time.** Under load, sampled busy can exceed user+sys (run 17: 1.37x).
  The shares are proportions of sampled time, as the ticket says.
- **Not read:**
  - the cause of the factor. No A/B was run. The module-runner indirection guess stays
    `UNKNOWN - verify`;
  - the ratio on files other than E and S;
  - the `*_DEEP` lanes;
  - any capped setting. `ABC-144` has not merged. The factor is per node, so the cap does not change
    `A2`.
- **Windows (`A5`).** No no-other-hop window was open: the Orchestrator ran two QE hops at the same
  time. `ABC-146`'s verdict run has not started (it is in Backlog).
