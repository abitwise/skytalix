---
id: 20260925T105000Z-software-engineer-observation-abc081-n8lane-charge-220ms-gross-60ms-net-met-58f3eaed
kind: observation
by: software-engineer
at: 2026-09-25T10:50:00Z
verified_by:
confidence: medium
refs:
  - ABC-081
  - N8-LANE
  - NFR-008
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-081/probe/build081.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/lane081.mjs
  - .grugops/context/ticket-to-pr-ABC-081/probe/lane-summary.txt
  - .grugops/context/ticket-to-pr-ABC-081/probe/lane-raw.tsv
  - .grugops/context/ticket-to-pr-ABC-081/probe/lane-load.txt
supersedes:
---

# ABC-081 `N8-LANE`: +220 ms CPU gross, +60 ms net of the floor. MET, with the charge inside the null control's per-round spread

Hand-authored, no `seal`. **Confidence is medium because of load**, not because of the protocol.

**Instrument.** `ABC-080`'s harness (itself `secnfr-ABC-079`'s), re-pointed and otherwise
unchanged (`probe/lane081.mjs`, `probe/build081.mjs`). It follows `NFR-008`'s own protocol:
- the contained lane is `npx vitest run --dir src`, one fresh OS process per run;
- the condition order rotates each round, over 9 rounds, and round 0 is discarded;
- file and test counts are asserted on every run;
- CPU is user + sys from `/usr/bin/time -p`.

**Arms**, built by `git archive` outside the repository:
- A = `0076e6a`, this branch.
- N = a copy of A, byte-identical by `diff -r`.
- B = `6033d05`, the base. It differs from A in exactly the seven ticket `src` files (and the
  queue move).

| arm | files / tests | median CPU | median wall |
|---|---|---|---|
| A (ABC-081) | 45 / 1 444 | 23.450 s | 5.760 s |
| N (identity) | 45 / 1 444 | 23.360 s | 5.615 s |
| B (base) | 44 / 1 418 | 23.225 s | 5.830 s |

- **Null control, N − A:** median **−0.080 s CPU (−0.34%)**, sign 3/8. The per-round values
  range from −1.40 to +0.57 s. Admissible: within 1.5%, and the sign is at chance.
- **Charge, A − B:** per round 0.88, 0.19, 0.63, −0.07, −0.04, −0.02, 0.25, 0.31. Median
  **+0.220 s CPU (0.94%)**, sign 5/8.
  - **Net of the 160 ms floor for the one new file, that is +60 ms against 650 ms. MET.**
  - The charge is smaller than the null control's own largest round. The honest reading is
    "a small charge, of the order of the noise", not "+60 ms exactly".
- **Where it comes from: not attributed by a file-level run.**
  - `src/transposition.test.ts` alone reported 471 ms of test time in its default lane.
  - The existing search and engine files changed little: the table has no effect below
    depth 4 in a fresh `search()`, and `chooseMove`'s injected-clock budgets are node-bound.
  - `raw-harness-lane-files` was not re-run. `UNKNOWN - verify`.
- **Load was very high.** The 1-minute load before each run was min 4.64, median 14.76, max
  19.52, because the harness itself loads the machine. There were 0 harness errors in 27 runs.
  Apple M3, node v24.12.0.
- **The lane is still over `NFR-008`'s 15 s CPU clause**, at about 23.4 s with or without this
  ticket. That is `ADR-0019` trigger (a) and `AR-N8LANE-079`, inherited and not moved here.
