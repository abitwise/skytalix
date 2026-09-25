---
id: 20260924T200400Z-software-engineer-claim-rehop2-quiescence-deep-lane-green-8e3a0c26
kind: claim
by: software-engineer
at: 2026-09-24T20:04:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ADR-0024
  - NFR-005
  - src/quiescence.test.ts
supersedes:
---

# `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` at `33b9a02`: exit 0, 37 passed, 13.2 s wall

This is a `claim` with no stamp. It ran once, through the node runner under `/usr/bin/time -p`,
at load 7.09 → 6.64.

```
Test Files  1 passed (1)
     Tests  37 passed (37)          exit 0
real 13.15  user 13.18  sys 0.41
```

`src/quiescence.ts` and its test are unchanged by this hop, so this is a re-run and not new
evidence about them. The `A5` readings are identical to re-hop 1's: kiwipete 119.96x / 32.74x /
45.02x (405 945 / 9 016 at d3), and position-6 6.32x / 17.44x / 8.26x. All are under the
`ADR-0024` levels. The slowest cases were `A5` kiwipete d3 at 6 814 ms and position-6 d3 at
2 713 ms. `A1` d3 reads 0/24 with quiescence and 0/24 without. Re-hop 1 recorded 37 passed in
13.7 s at `700730b`.
