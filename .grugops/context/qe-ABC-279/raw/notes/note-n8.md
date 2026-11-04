# qe-ABC-279 N8-LANE (NFR-008, npm test ≤ 10 s) re-read ALONE, 5 interleaved rounds per build: base median 9.29 s (max 9.39), head median 9.42 s (max 9.50). Every run is under the bound, and no base breach was seen. The Engineer's one head run at 10.13 s (shared host) did not reproduce

QE/E2E, task `qe-ABC-279`. `npm test` (`NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run`) on the base tree (`00e99db8`) and the head tree (`1feb7560`), both scratch extracts with the main checkout's `node_modules`. One `flock` held the whole session, 2026-11-04 00:21:55Z → 00:23:32Z. Base ran first in odd rounds and head first in even. The figure is vitest's `Duration` (`raw/scripts/n8.sh`, `raw/out/n8/n8.txt`).

| round | base | head |
|---|---|---|
| 1 | 9.21 s (load1 0.82) | 9.26 s (0.91) |
| 2 | 9.39 s (1.35) | 9.23 s (1.23) |
| 3 | 9.36 s (1.69) | 9.42 s (1.82) |
| 4 | 9.29 s (2.09) | 9.50 s (1.85) |
| 5 | 9.26 s (2.08) | 9.48 s (2.68) |
| **median** | **9.29 s** | **9.42 s** |

- Every run exited 0. Base 2 588 / 2 588 and head 2 631 / 2 631 (+43, all `src/see.test.ts`'s default rows), 0 skipped.
- **Against the bound:** head max 9.50 s ≤ 10 s, so NFR-008 is met on this read. The head-minus-base median is +0.13 s. The margin left to the bound is 0.58 s at the head median and 0.50 s at its max: thin, and the next ticket that adds default-lane rows should read it again.
- **Base:** no breach (max 9.39 s). The Engineer's 9.96 s base and 10.13 s head readings came on a host shared with other agents, and that `UNKNOWN - verify` is resolved by this read.
- load1 rose from 0.82 to 2.68 across the session (vitest's own 2 workers). No foreign job held the lock.
