---
id: 20260924T200500Z-software-engineer-claim-rehop2-engine-deep-lane-green-9f4b1d37
kind: claim
by: software-engineer
at: 2026-09-24T20:05:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-078
  - NFR-004
  - NFR-005
  - src/engine.test.ts
supersedes:
---

# `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` at `33b9a02`: exit 0, 33 passed, 133.3 s wall

This is a `claim` with no stamp. It ran once, through the node runner under `/usr/bin/time -p`,
at load 6.64 → 6.89. `src/engine.*` are unchanged by this hop.

```
Test Files  1 passed (1)
     Tests  33 passed (33)          exit 0
real 133.25  user 121.83  sys 0.93
```

- **The 50 ms real-clock case read 85 ms, against its 100 ms bar**, at completed depth 1.
  Re-hop 1 read 89 ms. It still has only ~15 ms of headroom on a loaded machine.
- `A1` (30 positions, 3 s budget): worst position-5/b1d2 at 3 020 ms, completed depth 3. 27/30
  ran over 3 s by the abort granularity; none reached the 5 s ceiling. 90.3 s.
- `NFR-005`, as reported by the case: **kiwipete depth 2** (166 645 nodes, 3 050 ms);
  **position-6 depth 2** (85 288 nodes, 3 071 ms). Re-hop 1's run read depth 3 on position-6.
  Depth here tracks the moment's node rate (85k–180k nodes in 3 s on this run), and this hop
  changed no code on that path. It is reported, not ruled.
- `A3` identity sweeps 10.3 s and 18.8 s; the deep literal `g4g5` passed; `A7` at a 1 ms budget
  took 1.4 s.
