---
id: 20260925T092500Z-security-nfr-observation-abc080-a7-met-both-runners-nfr005-node-6-5-vitest-4-4-nfr004-holds-615156d2
kind: observation
by: security-nfr
at: 2026-09-25T09:25:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - NFR-004
  - NFR-005
  - AR-NFR004-A
  - AR-NFR005-079
  - src/engine.ts
  - src/search.ts
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-build-arms.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-a7-core.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-a7-node.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-a7-vitest.test.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-nfr004.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-ceiling.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-a7-node.json.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-a7-vitest.json.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-nfr004.json.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-ceiling.jsonl.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-engine-deep-A.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-engine-deep-B.txt
supersedes:
---

# ABC-080: `A7` MET under both runners. `NFR-005` reads 6 / 5 in plain node and 4 / 4 under vitest. `NFR-004` holds

Hand-authored per `agent-factory/contracts/context-note.md`, with no `seal`. This is the degraded
posture `AGENTS.md` records: no `finding` is admissible on this install. Machine: Apple M3, Darwin
25.5.0 arm64, node v24.12.0. The system clock read 09:06Z at the claim and 09:25Z here. That is
earlier than the 16:30Z enqueue stamp, the same skew the build hop recorded. The stamps are the
clock as read.

**Arms** were built by `git archive` outside the repository (`raw-harness-build-arms`):
- **A** = `cb8ca55`, the build QE reviewed.
- **N** = a byte-identical copy of A (`diff -rq` clean).
- **B** = `4f74acc`, the pre-ordering base.

A and B differ under `src/` in exactly the six ticket files. `package.json` and
`vitest.config.ts` are identical.

## `A7` (completed depth at 3 s, this build vs `4f74acc`, same process): **MET in both runners**

One piece of code (`raw-harness-a7-core`) is driven by two runners. There are 5 rounds, the build
order is alternated per round, both builds are imported into the same process, and the 1-minute
load is read before every call.

| runner | position | base `4f74acc` depth (5 rounds) | this build depth (5 rounds) | base nodes | this build nodes | load1 |
|---|---|---|---|---|---|---|
| plain node | kiwipete | 3,3,3,3,3 | **6,6,6,6,6** | 1 102 581 – 1 124 085 | 916 234 – 933 642 | 4.40 – 5.46 |
| plain node | position-6 | 3,3,3,3,3 | **5,5,5,5,5** | 962 856 – 984 360 | 905 502 – 913 694 | 4.40 – 5.46 |
| vitest | kiwipete | 2,2,2,2,2 | **4,4,4,4,4** | 235 253 – 241 397 | 153 354 – 156 426 | 3.90 – 4.75 |
| vitest | position-6 | 3,3,3,3,3 | **4,4,4,4,4** | 196 904 – 201 000 | 147 742 – 148 766 | 3.90 – 4.75 |

- The build is ≥ base in 20 of 20 pairs, and strictly greater in 20 of 20.
- **This independently reproduces the Engineer's plain-node reading (3 → 6, 3 → 5)**, which QE left
  at `UNKNOWN - verify`. `A7` is now MET, measured by this gate.
- **The runner costs about 5x in node rate, and that costs plies.**
  - Base kiwipete: about 370k nodes/s in plain node against about 79k under vitest.
  - This build: about 308k nodes/s against about 52k.
  - Why vitest is that much slower was not investigated, here or by any earlier hop.
- **Per-node cost rose with ordering.** Kiwipete plain-node rate is -17% (370k → 308k/s) and
  position-6 is -7% (325k → 303k/s). The fall is larger under vitest. This is the comparator's
  allocation (see the security observation), bought back many times over in depth.

## `NFR-005` (≥ depth 6 in 3 s = floor, depth 7 = WARN, PROVISIONAL): **reported, not ruled**

The owner KEPT the floor at 6 on 2026-09-25 (*"2. keep 6, we want to have high quality game"*,
`wave-2026-09-24` note `…36b66fbd`). By `plans/nfr-catalog.md` § "WHEN THE FLOOR BECOMES DUE", the
floor becomes due at the close of the last of `ABC-079` / `ABC-080` / `ABC-081`. This is therefore
another waypoint, and **the verdict waits for `ABC-081`**, as the subtask says.

| runner | kiwipete | position-6 |
|---|---|---|
| plain node, this gate, 5 rounds | **6** (at the floor) | **5** (one below) |
| vitest, this gate, 5 rounds | 4 | 4 |
| vitest, `ENGINE_DEEP=1`'s own `NFR-005` case, this gate | 4 (153 354 nodes, 3 008 ms) | 4 (147 742, 3 022 ms) |
| same case, base `4f74acc` | 2 (236 277, 3 009 ms) | 3 (197 928, 3 008 ms) |

**An open question the owner or Architect/Design must settle before `ABC-081`'s verdict: which
runner does `NFR-005` bind?**
- The catalogue row names positions, budget and levels, but **no runner**.
- The two runners read **6 vs 4** on kiwipete on the same build, and the difference is about 5x in
  node rate.
- Earlier waypoints mixed them. `ABC-078`'s gate table reads like vitest (81k–114k nodes).
  `ABC-079`'s gate used plain node.
- **This gate's view:** plain node is the faithful instrument, because the product runs as
  `node src/cli.ts` (`npm run chess`) and never under vitest.
- **This is a view, not a ruling.** The row is Architect/Design's to clarify, and it was not
  touched here: `plans/nfr-catalog.md` is fenced from this hop.

## `NFR-004` (≤ 3 s at default budget, 5 s hard ceiling): **HOLDS** with ordering and killers in the abortable recursion

- **Plain node** (`raw-harness-nfr004`, `secnfr-ABC-079`'s probe re-pointed with nothing else
  changed): n = 40 on the six perft roots, the capture-dense middlegame and the worst
  first-iteration board.
  - **p50 3 001.6 ms, p95 3 004.3 ms, max 3 006.1 ms.** 36 of 40 calls ran over 3 000 ms, by at
    most 6.1 ms.
  - Load was 3.66–5.08.
- **The ceiling** (`raw-harness-ceiling`): kiwipete at `Infinity` read **5 001.3 ms**, position-4
  at `1e9` read **5 000.6 ms**, and the queens rig at `Infinity` read **5 002.6 ms**.
- **Under vitest** (`ENGINE_DEEP=1`'s `A1`, 30 positions): this build read **3 024 ms worst,
  28/30 over 3 s**. The base, in the same session, read **3 021 ms worst, 28/30**. **There is no
  measurable tail charge from this ticket.** The A7 vitest runner's worst wall was 3 029.5 ms.
- **One reading is outside `AR-NFR004-A`'s ≤ 31 ms denomination.** QE's `ENGINE_DEEP=1` run of
  this build printed `A1` worst **3 040 ms** (40 ms, 1.33%).
  - The other three readings at this build are 3 024 (build), 3 024 (this gate) and 3 029.5
    (this gate, A7 runner). They are inside it.
  - The catalogue records that the tail is scheduler/GC-driven: a 256-node interval measured
    105 ms at `ABC-078`.
  - The paired base-vs-build reading here shows no attributable change.
  - **Ruled in the decision note.** It is recorded for `AR-NFR004-A`'s owner, not re-denominated
    here.
