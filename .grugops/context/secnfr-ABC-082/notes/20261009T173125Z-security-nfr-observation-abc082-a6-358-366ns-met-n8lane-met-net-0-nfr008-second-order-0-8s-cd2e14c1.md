---
id: 20261009T173125Z-security-nfr-observation-abc082-a6-358-366ns-met-n8lane-met-net-0-nfr008-second-order-0-8s-cd2e14c1
kind: observation
by: security-nfr
at: 2026-10-09T17:31:25Z
verified_by:
confidence: high
refs:
  - ABC-082
  - NFR-005
  - NFR-008
  - N8-LANE
  - ABC-108
  - ADR-0003
  - ADR-0019
  - plans/nfr-catalog.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-a6-cost-nfr005-depth-warn-n8lane-a00b6aaa.md
  - .grugops/context/secnfr-ABC-082/notes/raw-harness-cost.mjs.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-out-cost.jsonl.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-082/notes/raw-out-lane.tsv.txt
supersedes:
---

# `A6` cost **357.8–366.1 ns** mean (≤ 1,100: MET, about 3.0x headroom). `N8-LANE` **MET**, at +0.13 / +0.14 s gross, which is ≈ 0 net of the 160 ms floor. `NFR-008` second-order effect is **+0.76 to +0.84 s CPU**, reported and not ruled

Hand-authored and unsealed. This note is an observation, not a stamp. Apple M3 (4P + 4E), Darwin 25.5.0, Node
v26.11.0, vitest from the main checkout's `node_modules` (symlinked). Branch = `873911d`, base =
`5ebe1d8`.

## `A6`: combined `evaluate` cost, `ABC-076`'s method

Method: best of 5 × 2 000 000 calls per root after a 200 000-call warm-up, on the six perft roots. **Each tree
runs in its own fresh plain-node process**, in the order base, branch, branch, base, and then the same again.
2026-10-09 17:18:28–17:20:24Z, load1 3.58–4.10.

| run | startpos | kiwipete | pos-3 | pos-4 | pos-5 | pos-6 | **mean** | load1 before |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| base r1 | 139.0 | 143.2 | 83.0 | 136.4 | 130.9 | 139.1 | **128.6** | 3.93 |
| branch r1 | 449.5 | 350.4 | 230.5 | 369.3 | 358.9 | 388.0 | **357.8** | 3.71 |
| branch r1b | 465.0 | 353.3 | 236.5 | 374.7 | 366.3 | 395.2 | **365.2** | 3.58 |
| base r1b | 141.9 | 143.1 | 85.6 | 139.7 | 135.4 | 144.5 | **131.7** | 4.01 |
| base r2 | 136.2 | 141.8 | 85.4 | 139.9 | 129.6 | 139.2 | **128.7** | 3.85 |
| branch r2 | 463.1 | 355.0 | 238.8 | 380.9 | 363.8 | 390.6 | **365.4** | 3.64 |
| branch r2b | 458.2 | 355.9 | 239.1 | 375.9 | 371.8 | 395.5 | **366.1** | 3.86 |
| base r2b | 140.6 | 141.5 | 84.7 | 137.4 | 135.2 | 144.2 | **130.6** | 3.93 |

- **≤ 1,100 ns: MET.** The mean has 3.0x headroom and the worst cell (startpos, 465.0 ns) has 2.4x.
- The term costs about **+230 ns per call, 2.8x the base evaluator.** That agrees with the build's
  385–394 / 136–146 ns (load 4.7–9.0). This gate's figures are about 6% lower on both trees, at lower
  load.
- **What `A6`'s first bar does not cover**, which the page itself says: 1 100 ns no longer
  guarantees depth 7. Depth 7 is ruled in `…ff8ad962`. On kiwipete the depth loss is driven by tree
  size, not by this cost. On position-6 this cost does show up, as a node rate about 4–5% lower.

## `N8-LANE` and the `NFR-008` second-order delta

Method: the build note's `lane.mjs` (the `ABC-121` / `ABC-081` `NFR-008` protocol), pointed at this gate's
own arms. Each run is the whole default lane, `npx vitest run --dir src`, in one fresh process. There are
8 rounds; round 0 is discarded and the arm order rotates. CPU = user + sys. The arms, each built by
`git archive` with `/usr/bin/diff -r` checks:
- **A** = `873911d`;
- **N** = an identity copy of A;
- **X** = A without `src/evaluate.pawns.test.ts`;
- **B** = `5ebe1d8`.

`AGENTS.md` is copied into each arm, because `src/cli.test.ts` reads it.

| session | window (UTC) | load1 before runs | N − A (null) | A − X (the new suite, gross) | X − B (second order) | A − B (whole change) | errors |
|---|---|---|---|---|---|---|---|
| 1 (A,N,X,B) | 17:22–17:25:52 | 13.2–21.6, median 17.4 | −0.03 s (−0.10%), sign 3/7 | **+0.13 s**, sign 4/7 | **+0.84 s**, 5/7 | +0.91 s (+3.0%), 7/7 | 0 / 32 |
| 2 (B,X,A,N) | 17:26:43–17:30:56 | 13.3–22.9, median 16.5 | +0.09 s (+0.30%), sign 4/7 | **+0.14 s**, sign 5/7 | **+0.76 s**, 7/7 | +0.83 s (+2.7%), 7/7 | 0 / 32 |

- **Both nulls are admissible** (≤ 1.5%, sign at chance).
- **`N8-LANE` (≤ 650 ms CPU, net of the 160 ms per-file floor): MET.** The gross charge is +0.13 / +0.14 s,
  so the net is about 0 (−0.03 / −0.02 s). The build read +0.29 gross / +0.13 net. All three
  readings are well under 650 ms. Resolution is about ±0.3 s per round at this load, so "≈ 0" means
  below what this load can resolve. It does not mean free.
- **`NFR-008` second-order effect: +0.76 to +0.84 s CPU** on the existing default-lane rows, from a
  costlier `evaluate` running at almost every search node. The build read about +0.6 s. **It is
  reported, not ruled against a level**, as the page directs (`ABC-108`).
- **Flag for `NFR-008`'s owner (Architect/Design, `ADR-0019`), `UNKNOWN - verify`:** the base lane's
  absolute CPU here was 29.4–30.2 s median, at load 13–23. The build's round 0 read 23.4 s at load
  about 5. Both are far above the 15 s level that `ADR-0019` recorded as MET by 60 ms at `ABC-110` (on Node
  v24, 40 files). The lane is now 48–49 files on Node v26. This gate did **not** run the row's own
  protocol at a quiet load, so it **does not rule** `NFR-008` and claims no breach. Whether
  `ADR-0019`'s rollback trigger (a), "a breach at 15 s", has already fired on base is a question for the
  row's owner, under the row's protocol. `ABC-082` adds about 3% to whatever that total is.
