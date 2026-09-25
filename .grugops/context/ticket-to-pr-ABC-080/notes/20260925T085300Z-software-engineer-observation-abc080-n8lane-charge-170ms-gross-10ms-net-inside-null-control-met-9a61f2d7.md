---
id: 20260925T085300Z-software-engineer-observation-abc080-n8lane-charge-170ms-gross-10ms-net-inside-null-control-met-9a61f2d7
kind: observation
by: software-engineer
at: 2026-09-25T08:53:00Z
verified_by:
confidence: medium
refs:
  - ABC-080
  - N8-LANE
  - NFR-008
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-080/probe/build080.mjs
  - .grugops/context/ticket-to-pr-ABC-080/probe/lane080.mjs
  - .grugops/context/ticket-to-pr-ABC-080/probe/lane-summary.txt
  - .grugops/context/ticket-to-pr-ABC-080/probe/lane-raw.tsv
  - .grugops/context/ticket-to-pr-ABC-080/probe/lane-load.txt
supersedes:
---

# ABC-080 `N8-LANE`: +170 ms CPU gross, +10 ms net of the floor. MET, and inside the null control's own spread

Hand-authored, no `seal`. **Confidence medium, because of load**, not because of the protocol.

**Instrument:** `secnfr-ABC-079`'s harness, re-pointed and nothing else changed (`probe/lane080.mjs`,
`probe/build080.mjs`). It follows `NFR-008`'s own protocol:

- contained lane `npx vitest run --dir src`, one fresh OS process per run;
- condition order rotated every round, 9 rounds with round 0 discarded;
- file and test counts asserted per run;
- CPU = user + sys from `/usr/bin/time -p`.

**Arms**, built by `git archive` outside the repository:

- A = `ac5215c`, this branch;
- N = a copy of A, `diff -r` byte-identical;
- B = `4f74acc`, the base. It differs from A in exactly the six ticket `src` files and the queue move.

| arm | files / tests | median CPU | median wall |
|---|---|---|---|
| A (ABC-080) | 44 / 1 418 | 23.090 s | 5.605 s |
| N (identity) | 44 / 1 418 | 23.300 s | 5.760 s |
| B (base) | 43 / 1 395 | 23.090 s | 5.680 s |

- **Null control N − A:** median **+0.140 s CPU (0.61%)**, sign 5/8. **Admissible:** ≤ 1.5%, sign
  at chance.
- **Charge A − B:** per round 0.19 0.74 0.15 0.12 0.23 0.25 −0.04 −0.30. Median **+0.170 s CPU
  (0.74%)**, sign 6/8. **Net of the 160 ms floor for the one new file: +10 ms against 650 ms.
  MET.** The charge is about the size of the null control, so the honest reading is "no
  measurable content charge", not "+10 ms exactly".
- **Why it is small: NOT ATTRIBUTED.** The new file reports about 0.5 s of test time under the
  runner, so something else in the lane got cheaper. Ordering the existing searches is the
  plausible candidate, but `raw-harness-lane-files` was not re-run to show it. `UNKNOWN - verify`.
- **Load was very high:** 1-minute load before each run was min 4.8, median 15.5, max 20.9.
  Other work shared the machine. Harness errors 0 of 27. Apple M3, node v24.12.0.
- **The lane itself is still over `NFR-008`'s 15 s CPU clause**, at about 23 s with or without this
  ticket. That is `ADR-0019` trigger (a) and `AR-N8LANE-079`, both inherited, not moved here.
  This ticket adds nothing measurable to it.
