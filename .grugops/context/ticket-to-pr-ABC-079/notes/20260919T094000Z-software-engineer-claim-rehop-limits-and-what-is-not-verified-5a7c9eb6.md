---
id: 20260919T094000Z-software-engineer-claim-rehop-limits-and-what-is-not-verified-5a7c9eb6
kind: claim
by: software-engineer
at: 2026-09-19T09:40:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-080
  - ABC-084
  - ADR-0024
  - NFR-005
  - NFR-008
  - src/search.test.ts
  - src/engine.test.ts
supersedes: 20260919T074200Z-software-engineer-claim-limits-and-what-is-not-verified-5e7a9c13
---

# What this re-hop did NOT establish — read before quoting anything from it

1. **`SEARCH_DEEP=1` on `src/search.test.ts` is RED and stays red.** Four cases time out with
   ordered captures (kiwipete d3 unpruned pair 1 016 s, position-5 d3 55 s, position-6 d3 195 s,
   `A7` every-root-at-depth-3 pruned+unpruned 1 281 s; position-4 d3 passes with 2.9 s to spare).
   The ruling's remedy (kiwipete only, one depth) cannot turn it green and the file is outside the
   fence, so nothing was edited. What the lane needs is a ruling on the unpruned oracle under a
   quiescence leaf — its cost is structural (full window at every leaf), not a tuning.

2. **Every second is a loaded-machine second.** Load 4–19 throughout; `NFR-008` arms are 3 runs
   each, not ≥ 7; the wave-branch "before" has a different test set (42 files vs 41). The
   `N8-LANE` paired median (0.61 s) spans 0.30–1.37 s across its three pairs. Node counts and
   ratios are exact; nothing in seconds is.

3. **The `ENGINE_DEEP` 50 ms case passed at 89 ms against 100 ms** — 11 ms of headroom on a
   loaded machine for a case whose unabortable depth-1 costs 5 878 nodes. It passes as written
   today; it is the first real-clock case to go red on a busier day.

4. **The kiwipete counts differ from the probe's by 10 / 133 / 23 nodes** (promotion term). The
   cause was verified with a variant of the probe; the numbers in `ADR-0024`'s table remain the
   probe's, and the test asserts the LEVELS, not the counts. Position-6 is exact.

5. **The `A3` re-fixture's mutant kill is EMULATED, not run.** A scratch re-typing of the
   engine's negamax and leaf, aborting at the ten check points, never holds e2e3/−80 as its
   best-so-far. QE's real `M`-series mutants on `chooseMove` were not re-run here; the `A2`
   `M1` figure WAS a real mutant run (a copy of `src/` with the in-recursion check deleted).

6. **`NFR-005` kiwipete is 2 or 3 depending on the moment's load**; the ruling's 3/3 estimate is
   met on the quieter reading only. Position-6 is 3 on both.

7. **`AGENTS.md`'s command slots for `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` and
   the `search.test.ts` lane's new cost are NOT written** — the file is fenced for this hop; the
   slot is the Orchestrator's, and the `search.test.ts` slot's *"exit 0, 41 passed, 23.0 s"*
   line is now false for this branch.
