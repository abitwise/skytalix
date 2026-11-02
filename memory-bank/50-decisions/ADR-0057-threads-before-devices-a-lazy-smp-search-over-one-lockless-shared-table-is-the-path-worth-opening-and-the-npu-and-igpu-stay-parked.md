---
kind: adr
id: ADR-0057
---
# ADR-0057: Threads before devices. A Lazy SMP search over one lockless `SharedArrayBuffer` table is the one path on this host worth opening. The NPU and the iGPU stay parked, and a table shared with a device is dropped

## Status

*2026-11-02, the owner's answer* (`orch-2026-10-30a` `…773be7de`, verbatim *"61 yes, 25 yes, park threads"*):
**Still ACCEPTED. The threads strand is PARKED on `ADR-0062` D12's MISS and the re-proposal's NO WIN. It re-opens only
on a new premise.** Recorded by Architect/Design (task `arch-owner-answers-1102b`, records only, on
`grugops/arch-owner-answers-1102b` from `main` `b47adfbb`). Nothing was run.
- **Parked:** `ABC-266` (TH-2, the worker pool and `Threads`, with TH-3 folded in). `ADR-0062` reads "proposed,
  parked; not in force". `Threads` stays at 1, and `ADR-0044` D5 stays in force.
- **Done:** TH-1. The `ADR-0025` shared-table amendment is accepted and in force (`ABC-265`, `605874b8`). It is
  today's engine node for node at one writer, so it stands without the pool.
- **The new premises,** each with its own pre-registered probe and the owner's word: `ADR-0058` in force through
  `ABC-257`; a later search change that breaks the workers' lockstep; or the owner asking for the ~30 min S+D+P probe
  at `Threads 12` (not funded now).
- **D2.5's threads estimate stays unsupported** (the `arch-ABC-266-repropose` line below). D6's threads row reads
  `parked` (D6 dated line). No other decision, strand or answer changes.
- **OQ-7 and OQ-8 (D8.8) were not answered,** so their defaults stand: OQ-7 **no** (no `render` group; the
  accelerator strand stays parked), OQ-8 **later** (a neural net is re-asked on `ADR-0056`'s V4 trigger). These are
  the defaults D8.8 names, not new owner words.

**ACCEPTED** 2026-11-02 by the owner, with his answers to OQ-1 to OQ-6. Recorded by Architect/Design (task
`arch-owner-answers-1102`, records only, on `grugops/arch-owner-answers-1102` from `main` `7daf8086`). Nothing was
run.

- **His words, verbatim** (`orch-2026-10-30a` `…81ae2db4`): *"1 yes, 2 a, 3 c, 4 a, 5 no, 6 later"*, the answers to
  OQ-1 to OQ-6 in that order.
- **What acceptance covers:** the analysis (D1–D4), the recommendations (D6) and the answers below. It writes no code
  and amends no other ADR by itself. Each later step brings its own ticket, and its own ADR where an accepted decision
  changes (the first status block).
- **The answers:**
  - **OQ-1, yes.** Threads are in `EPIC-011`'s scope. BA/PM lifts the "Threads" half of § Out of scope's "Threads,
    pondering" line; pondering stays out. The reversal of `ADR-0044` D5 (one thread, no worker) is accepted for the
    threads tickets. The amending ADR comes with the worker-pool ticket. `ADR-0044` carries a pointer line.
  - **OQ-2, (a).** One game at a time. The engine may use several cores inside a game. Every 100 / 400 read stays at
    `Threads 1` on both sides. Q-3K-3's reading is updated in `ADR-0056` D7.
  - **OQ-3, (c).** The 40/15 claim is read and reported for `Threads 1` and `Threads N` separately, `Threads 1`
    first (`ADR-0056` C1's dated line).
  - **OQ-4, (a).** `NFR-009` counts retained search growth, not each worker's V8 baseline heap. About 4 MiB for the
    shared table once, plus about 0.5 MiB a worker: about 10 MiB at 12 workers (`estimate`, SP6), inside 16 MiB.
    `NFR-009`'s level does not move, so Q-3K-6 stays open.
  - **OQ-5, no.** No `render` group change. The accelerator strand stays parked (D6), and nothing measures the iGPU or
    the NPU.
  - **OQ-6, later.** NNUE on the CPU is re-asked on `ADR-0056`'s V4 trigger: the curve flattening below 3 000 after
    Phase 5. `EPIC-004`'s neural non-goal and `EPIC-011` § Out of scope's neural line stand.
- **The order, re-read:** D6 put threads "after `EPIC-011` phase 1". Phase 1 is now paused (owner, *"P yes"*). The new
  place is in D6's dated line and in `ADR-0056` D6's dated line of the same fold.
- **What BA/PM needs to cut the tickets:** § Inputs for the thread tickets, below D7.
- *2026-11-02 (`arch-ABC-265`):* TH-1's ADR is written: the **PROPOSED** amendment at the end of `ADR-0025`, the
  owner's to accept. It writes D2.3 into that ADR and adds one rule D2.3 does not state: a cutoff uses the data and
  score words the XOR check verified, read once at the probe, never a second read of the slot. It also records the
  Architect's answer on `ABC-265`'s S2 question: no nps reading on top of `G6` and the profile. Nothing in this ADR
  changes.
- *2026-11-02 (`arch-ABC-266`):* TH-2's ADR is written: **`ADR-0062`, PROPOSED**, amending `ADR-0044` D3 and D5. It
  settles the four choices § Inputs left to it, with one change of recommendation: the played result is the deepest
  completed iteration among the workers, not worker 0's. A scratch probe (counts only) found that helpers barely
  shorten worker 0's path to a depth (ratios 0.87–1.75 against alone; 64 of 64 runs reached the same depth in
  1 000 000 nodes), so D2.5's η is not supported by counts at these depths. `ADR-0062` D12 asks for one timing probe
  before the build. Nothing in this ADR changes.
- *2026-11-02 (`arch-ABC-266-repropose`):* the D12 timing probe MISSED (`qe-ABC-266-d12` `…9f9aeb87`): median played
  depth 7 at `Threads` 1, 4 and 12 at 100 ms, with the workers in lockstep. At 12 workers a worker runs at about 0.7 of
  one thread.
  - No helper-diversity, deeper-entry or 4-fast-core form passed the Architect's pre-registered re-proposal rule
    (`arch-ABC-266-repropose` verdict).
  - **D2.5's Elo estimate for threads (+100 to +300 at 100 ms) is not supported on this engine as it stands.** The
    +55 to +150 at 40/15 is unread.
  - The Threads row of D6 is unchanged in direction ("pursue"). Its next step, `ABC-266`, is recommended parked (the
    owner decides).
  - `ABC-265`'s shared table does not depend on this. Nothing else in this ADR changes.

**Reviewed 2026-11-02** by Architect/Design (task `arch-accel-review`, records only, on `grugops/arch-accel-review`
from `main` `2ef3aadc`; one informal probe, no timing). **Still ACCEPTED, and no decision, strand or owner answer
changes.** The owner asked for his Gemini analysis
(`memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md`, added `f0a1b494`, renamed `27a8d9f6`) to be
checked against this ADR. Its three architectures and its starting advice are checked claim by claim in **D8**. Each
one needs device access (OQ-5 no). B and C, and A's evaluation, are only worth anything with a neural net (OQ-6
later). On this host's figures none of them beats the threads strand. One idea transfers to the CPU, and it is already
on the path: aspiration windows (`ADR-0056` S1, `ABC-236`). A second is recorded as a Phase 4 candidate: lazy
evaluation, with a measured share. No change to `ABC-265`, `ABC-266` or `ABC-267`.

*First status, kept:* **PROPOSED** 2026-11-01. Spike `ABC-263`, records only. Written by Architect/Design (task `arch-ABC-263`), on branch
`grugops/arch-ABC-263` from `main` `44c99531`.

- **Nothing here is decided.** This ADR recommends. It changes no rule, no NFR bound, no scope line and no other ADR.
- **Source of the question.** The owner, 2026-11-01, verbatim (`orch-2026-10-30a` `…78c476bf`): *"yeah make spike
  ticket for Architect in Epic 011 to investigate if it is possible to utilize NPU and CPU, parallelize node.js on
  multiple threads and somehow use video memory to share search info between NPU/GpU runs so it would not go to
  waste."*
- **Acceptance is the owner's.** Every recommendation that moves scope or a rule is written as an owner question in
  D7. Accepting this ADR accepts only the analysis and the order in D6. Each later step brings its own ticket. Where an
  accepted decision changes, it also brings its own ADR.
- **What would be amended on a yes** (not by this ADR): `ADR-0044` D5 (one thread, no worker), `ADR-0025` decisions
  2 and 4 (table layout and lifetime), `EPIC-011` § Out of scope (threads), and Q-3K-3's reading. See D5.
- **Evidence classes.** Every figure is marked `measured (informal)`, `documented` or `estimate`, as `ABC-263` A2
  asks. `measured (informal)` means a scratch prototype on this host under the host lock. It is never a grade or a
  reading (ticket test note 3). Prototypes and their windows are listed in § Prototypes.

**Corrected 2026-11-01** by Architect/Design (task `arch-adr0057-fix`, records only, at `main` `ff775417`; nothing
run). **Still PROPOSED.** No verdict, recommendation or order changes. OQ-1 now asks, by name, for a reversal that D4
already gave to the owner (G5); no other owner question changes. Source: QE's gaps
on this ADR (`qe-ABC-263` `…5e4c6533`; verdict `…f9116735`, PASS_WITH_GAPS, no blocking gap). Each changed passage
is marked *(corrected 2026-11-01)*.

- **G1, a stale fact (medium).** The first text called `ABC-253` (64-bit keys as two 32-bit halves, `ADR-0055` O1-a)
  "in flight". It also leaned on its halves in D2.3 ("needs no `bigint` at all") and in D6's threads row ("the key
  layout the shared table wants"). In fact `ABC-253` was dropped at 2026-11-01T20:51:36Z (`608ebfa4`; Orchestrator
  `…27ddb1fb`), before this ADR was written. Now the shared table makes its own key split, inside `probeTable` and
  `storeEntry`, and their signatures do not change (D2.3, dated paragraph). The threads effort is re-estimated from
  **L, 30–60 h** to **L, 32–65 h**, or **42–85 h** if the fallback in D2.3 is needed (Q2 summary).
- **G3:** device workload rows (d) and (e) now state their round trip (D1.2).
- **G4:** the D4 row for the classical path and `EPIC-011`'s threads line now states its fair comparison.
- **G5:** `ADR-0044` D5's reversal is now asked inside OQ-1, and `ADR-0056`'s V4 is defined where OQ-6 cites it.
- **G7:** the `onnxruntime-node` 1.31.1 sub-claim is now marked `UNKNOWN - verify`, and every open
  `UNKNOWN - verify` names what settles it (§ Consequences).
- **G8:** "pass the 128 MiB ceiling" now reads "exceed" (D4 `NFR-009` row, OQ-4). The prototype ids P1–P6 are
  renamed **SP1–SP6** (spike prototypes), so they no longer collide with `ADR-0056`'s P1–P6 pruning items. The
  sealed notes of `arch-ABC-263` and `qe-ABC-263` keep the old names: their P1-smoke, P1, P1b, P2 … P6 are SP1-smoke,
  SP1, SP1b, SP2 … SP6 here.
- **Not changed:** G2 (the raw outputs were deleted, as A8 requires; the figures trace to observation `…7b97c154`
  and recompute, per QE `…89232ca8`). G6 (SP1b's start is inferred, and was already labelled as inferred).

## Context

### The question, in four parts (`ABC-263` § Scope)

- **Q1.** Can skytalix use the NPU or the iGPU from Node.js on this host? With a neural net, or without one?
- **Q2.** Can the search run on more CPU threads in Node.js, and what would that be worth?
- **Q3.** Can search information be shared between CPU threads and device work, through shared or video memory?
- **Q4.** How does each answer meet the owner's standing rules?

### This host, as read on 2026-11-01 (`measured`)

Read by `lscpu`, `/sys/devices/system/cpu`, `/sys/class/drm`, `/sys/class/accel`, `lsmod`, `getfacl` and
`loginctl`, at 2026-11-01T20:51Z, as user `olger` (uid 1000) on `oeselg-dev`.

| item | reading |
|---|---|
| CPU | AMD Ryzen AI 9 HX 370. 12 cores, 24 logical CPUs (SMT 2), one NUMA node. |
| fast cores | 4 × Zen 5, max 5.16 GHz: logical CPUs 0–3, SMT siblings 12–15. One L3 (CPUs 0–3, 12–15). |
| slow cores | 8 × Zen 5c, max 3.29 GHz: logical CPUs 4–11, SMT siblings 16–23. A second L3 (CPUs 4–11, 16–23). |
| caches | L2 12 MiB (12 instances), L3 24 MiB (2 instances). The brief's "4 fast + 8 slow" is confirmed. |
| memory | 29 GiB system RAM. The iGPU's "VRAM" is a 1 024 MiB carve-out of the same DRAM; GTT is 15 088 MiB. |
| OS / runtime | Ubuntu 26.04.1 LTS, Linux 7.0.0-42-generic, Node v26.12.1, npm 11.20.0. |
| NPU | XDNA 2 (PCI 1022:17F0). In-tree `amdxdna` 0.7.0 loaded, firmware `amdnpu/17f0_10/npu_7.sbin`, node `/dev/accel/accel0`. |
| iGPU | Radeon 890M (Strix, gfx1150). `amdgpu` loaded, `/dev/dri/renderD128`, `/dev/kfd`. |
| GPU user space | Mesa 26.0.8 Vulkan ICDs present, RADV (`radeon_icd.json`) and lavapipe (`lvp_icd.json`). No OpenCL ICD (`/etc/OpenCL/vendors/` absent; only the `ocl-icd` loader). No ROCm (`/opt/rocm*` absent). No XRT (`/opt/xilinx*` absent, no `xrt-smi`). |
| **device access** | **Denied.** `open()` of `/dev/dri/renderD128`, `/dev/accel/accel0` and `/dev/kfd` fails with `Permission denied` for `olger`. The nodes are `root:render`, mode 0660. The seat ACL grants only `lightdm`, the greeter on `seat0`. `olger` is not in `render` or `video`. |

**What the access line means:** no GPU or NPU runtime can reach the hardware from this user today. Each device verdict
below is therefore `works-after-host-change` at best. The smallest named host change is adding `olger` to the
`render` group (and `video` for the card node), then a new login. That needs `sudo`, so it is the owner's call
(`ABC-263` § Out of scope).

### The search today, the yardstick for every device figure

- **Per node:** 1.1–1.6 µs, from 0.63–0.90 M nodes/s (`ADR-0055` § Speed readings, `qe-ABC-240`). SP1 below reads
  0.87–0.89 M nodes/s for one worker at 2 s on kiwipete and position-6, inside that band.
- **Shape:** one thread, synchronous, alpha-beta with PVS, LMR, null move, quiescence and a 4 MiB TT cleared per search
  (`ADR-0025`, `src/transposition.ts`). The TT is three typed arrays: a `BigUint64Array` of keys, a `Uint32Array` of
  packed words and an `Int32Array` of scores, 2^18 slots, 16 bytes a slot.
- **Keys:** 64-bit `bigint`. *(corrected 2026-11-01)* `ABC-253` (two 32-bit halves, `ADR-0055` O1-a) was
  **dropped** at 2026-11-01T20:51:36Z (`608ebfa4`, Orchestrator `…27ddb1fb`): "nothing to cut". The key path was about
  1.9–2.4 % of self time. A full halves prototype read about 1.00×, because the table probe's cost is cache misses,
  not `bigint` (`se-ABC-253` `…efd7790c`). Keys stay `bigint` on `main`. `ABC-253`'s re-open trigger is a key path of 5 % or
  more. This ADR reads today's `main` layout, and the threads strand carries its own split (D2.3).
- **Evaluation share:** about 27–33 % of self time on the evaluation profile of record (`se-ABC-227`), so about
  0.3–0.5 µs a node. Today's share is `UNKNOWN - verify` (`ADR-0055` § Where a node's time goes). *(corrected
  2026-11-01)* A newer profile (`se-ABC-253` `…ba045718`, `main` `d46ed7ec`) reads `whiteMinusBlack` alone at about
  16 %, but does not sum the evaluation. Settled by summing the evaluation functions' self time in a `chooseMove`
  profile at `main`. `se-ABC-253`'s `raw/profile.sh` and `raw/analyse.mts` are a ready instrument.

### Prototypes (`measured (informal)`, scratch only, all under `flock host-test.lock`)

All scripts lived under the session scratch directory, outside the repository, and were deleted at hop end. Each one
imported the worktree's `src/` read-only by absolute path. No `sudo`, no system install. The one package installed
was `webgpu@0.6.2` (npm, `--ignore-scripts`, in its own scratch directory; its `postinstall` is macOS-only).

Host `oeselg-dev`, user `olger`, Node v26.12.1. Command form: `flock host-test.lock timeout 300 node <script> <args>`.
Raw output went to the scratch `out/` directory and was deleted at hop end. Every figure used is carried into this
ADR and the observation note `20261101T222225Z-architect-design-observation-7b97c154` of task `arch-ABC-263`. **Peak scratch: about 132 MB** (the `webgpu` package; the
scripts and outputs were under 100 KB).

| id | what it ran | window (UTC, 2026-11-01) | host time |
|---|---|---|---|
| SP1-smoke | `scale.mjs`: 1 and 2 workers, 300 ms | 20:54:39–20:54:41 | 2 s |
| SP1 | `scale.mjs`: real `chooseMove` in 1, 2, 4, 6, 8, 12, 16, 24 `worker_threads` workers, 2 s each, kiwipete and position-6, two repetitions | 20:54:48–20:56:04 | 76 s |
| SP1b | `procs.sh` + `single.mjs`: the same search as separate processes, pinned by `taskset` (one fast core, one slow core, SMT pairs, 4 fast, 8 slow, 12 physical) and OS-placed (12, 16, 24) | ≈ 22:18:03–22:18:30 (start inferred: queued 20:56:24 behind another hop's read, whose last write was 22:18:02) | ≈ 27 s |
| SP2 | `tt.mjs`: the D2.3 table in a `SharedArrayBuffer`, plain and `Atomics` accesses, 1–16 threads, and a torn-entry stress | 22:18:30–22:18:42 | 12 s |
| SP3 | `latency.mjs`: microtask, `setImmediate`, `postMessage`, `Atomics.wait`/`notify` and spin round trips, OS-placed and pinned to CPU pairs 2+3, 2+14, 2+6 | 22:18:42–22:18:44 | 2 s |
| SP4 | `nnue.mjs`: a 768 → H × 2 → 1 net in plain JS, H = 128, 256, 512 | 22:18:44–22:19:26 | 42 s |
| SP5 | `gpu.mjs`: WebGPU through `webgpu` 0.6.2, default ICD search, forced RADV, forced lavapipe | 22:19:26–22:19:28 | 2 s |
| SP6 | `mem.mjs`: per-worker heap and process RSS at 1, 4, 12 engine workers | 22:19:28–22:19:30 | 2 s |
| **total** | | | **≈ 165 s (2.75 min)** |

## Decision

### D1. Q1, accelerators: the NPU and the iGPU from Node.js

#### D1.1 The four runtimes (A3, runtimes)

| runtime | verdict | what it needs | evidence |
|---|---|---|---|
| **WebGPU via Dawn** (`webgpu` npm 0.6.2, Dawn's own Node binding, `dawn-gpu/node-webgpu`) | `works-after-host-change`: `olger` in `render`, new login | the binding installs from npm with no build; RADV is installed. It runs **now on lavapipe**, which is Mesa's CPU Vulkan and accelerates nothing | `measured (informal)`, SP5: RADV fails with `Could not open device /dev/dri/renderD128: Permission denied` and forced RADV gives no adapter. The default search falls back to llvmpipe (lavapipe), which runs. Package: `documented`, npm registry, read 2026-11-01 |
| **ONNX Runtime + Vitis AI EP** (XDNA 2 NPU) | `UNKNOWN - verify`. At best `works-after-host-change`, with four changes (next column) | (1) `render` group. (2) XRT user space plus the `amdxdna` XRT plugin, shipped as `.deb` packages for Ubuntu 24.04; this host runs 26.04.1. (3) Ryzen AI Software 1.9 for Linux: its documented API is Python only. (4) An ONNX Runtime Node binding built from source with the Vitis AI EP: the npm `onnxruntime-node` README lists CPU, CUDA and TensorRT on Linux x64, not Vitis AI. *(corrected 2026-11-01)* That list is read from the 1.23.2 README. For 1.31.1, the current npm version, it is `UNKNOWN - verify`, because the registry carries no README. Settled by reading the 1.31.1 tarball's README and its prebuilt binary folders | `documented`: Ryzen AI 1.9 Linux page (Strix Point, Ubuntu 24.04, kernel ≥ 6.10, "NPU only flow"); `onnxruntime-node` README (1.23.2 mirror). One public report shows the Linux Vitis AI EP returning wrong values for many multi-output graphs (RyzenAI-SW #369). Settled by: the owner's host change, then a quicktest on this host |
| **ROCm / HIP** (890M, gfx1150) | `works-after-host-change`: ROCm user space installed, `render` group, plus a native Node addon | ROCm 7.10 lists the HX 370 (gfx1150) on Ubuntu 24.04.3 only. Support on 26.04.1 is `UNKNOWN - verify`. No maintained HIP binding for Node exists. A native N-API addon would be a C++ build inside the product, a step beyond `ADR-0044`'s rejected alternative 18 (no WASM build in the repo) | `documented`: ROCm 7.10 release notes; community gfx1150 builds note no pre-built PyTorch for the ISA |
| **OpenCL** (890M) | `works-after-host-change`: an OpenCL ICD installed (Mesa rusticl or ROCm's), `render` group, plus a Node binding | measured on this host: no ICD. Rusticl needs `RUSTICL_ENABLE` set per driver. The npm bindings `node-opencl` 0.4.5, `nooocl` and `opencl` were last modified in June 2022 | `measured` (no `/etc/OpenCL/vendors`); `documented`: Mesa rusticl page, npm registry |

#### D1.2 The five workloads (A3, workloads)

The yardstick is one search node, 1.1–1.6 µs. One device round trip is set beside it.

| workload | needs a net? | verdict | one device round trip vs one node | effort | expected effect | risks |
|---|---|---|---|---|---|---|
| **(a) NNUE-style net on the CPU** (no device) | **yes** | `works-on-this-host-now` (technically; the scope line is the owner's) | no device: H = 128: 0.59 µs a node (0.42 µs incremental update, 0.17 µs output layer). H = 256: 2.09 µs. H = 512: 4.29 µs (SP4, plain JS, no SIMD) | **L**, 30–60 h: data, a trainer, TS inference with incremental accumulators, tests | `estimate`: +100 to +300 Elo at 40/15 over today's evaluation, low confidence. Basis: Stockfish 12 (NNUE) over 11 was +51 to +130 by list and by Chess.com; a small 768→128→1 net in JS was "about on par" with Lozza's ~2 700 HCE (Cwtch thread). Speed: today's evaluation is ≈ 0.3–0.5 µs a node, so H = 128 would bring the node rate to ≈ 0.8–0.95× and H = 256 to ≈ 0.4–0.5× (`estimate` from SP4) | breaks `EPIC-004`'s permanent non-goal and `EPIC-011` § Out of scope; training data and labels raise Q-3K-7; evaluation stops being hand-explainable; `G4` oracles change |
| **(b) Lc0-style net on the GPU or NPU** | **yes** | `works-after-host-change` (host change plus WebGPU or ORT, see D1.1) | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) against 1.1–1.6 µs. An Lc0-style search batches hundreds of positions per dispatch to hide it | **XL**, 200 h or more: MCTS search, a large net, its training or a borrowed net, device inference | `estimate`: `UNKNOWN - verify`. No Lc0 benchmark for the 780M or 890M was found. It is a different engine, not a step for this one. *(corrected 2026-11-01)* Settled only by an Lc0 build playing on the 890M after OQ-5. That is not proposed while the strand is parked | replaces the engine; breaks the neural non-goal; a borrowed net raises a licence and identity question; no game instrument here reads it for months |
| **(c) batched classical evaluation on a device** | no | `works-after-host-change` | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`), so one dispatch costs 28–59 nodes. Alpha-beta asks for one leaf at a time; batching needs a search redesign | **XL**, 60–120 h: an evaluation port to WGSL, a batched frontier, a second evaluation to keep equal by test | `estimate`: below 1.0× speed (a slowdown) at every control, until a batch of thousands hides the round trip. Evaluation is about 30 % of node time, so a free device evaluation still caps at ≈ 1.4× | two evaluations to keep identical; latency dominates; device access needs the host change |
| **(d) offline Texel tuning on a device** | no | `works-after-host-change`. The CPU threads alternative is `works-on-this-host-now` | not on the search path. A tuning pass over N positions is one batch, so the round trip is amortized. *(corrected 2026-11-01)* One round trip of 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) per batch is 45–65/N µs a position (`estimate`), for example under 0.01 µs at N = 10 000. There is no node to set it beside | **M**, 8–16 h on a device. **S**, 3–6 h with `worker_threads` on the CPU (`ABC-239`'s tool) | no Elo of its own: the tuned constants are the same either way. Wall-time speed-up of the tuning loop: `estimate` 6–7× with 12 CPU workers, from SP1's node-rate scaling | none found for the CPU form. A device form adds a WGSL copy of the evaluation |
| **(e) tablebase generation on a device** | no | `not-feasible` inside scope: `EPIC-004` and `EPIC-011` keep tablebases out | not on the search path. *(corrected 2026-11-01)* n/a: generation runs offline, once, and no search waits on it. A finished table is probed from CPU memory or disk, not through a device round trip | **XL**, 80 h or more, plus probing code | `UNKNOWN - verify`: no source found for this engine's gain from tablebases. *(corrected 2026-11-01)* Settled only by a tablebase-on against tablebase-off read on this engine, after the owner lifts the scope line. That is not proposed | scope; storage; a probing path in the search |

**Q1 summary (A2 shape).**

- **Verdict:** NPU `UNKNOWN - verify`; iGPU `works-after-host-change` (`render` group). Nothing reaches either device
  from this user today (`measured`).
- **Effort:** M to XL per workload (table). The cheapest device workload worth anything is (d), and the CPU does it
  better at S.
- **Expected effect:** on the search, ≤ 1.0× (a slowdown) for (c) at 100 ms, 4 s and 40/15 (`estimate`, from
  45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) against 1.1–1.6 µs). The only large Elo on the list is (a) or (b), and both need a neural net.
- **Risks:** a host change for the device path; native or third-party binary packages in the product; the neural
  non-goal; two evaluations to keep identical.
- **Evidence:** as tagged in each row.

### D2. Q2, threads: Lazy SMP over one shared lockless table

#### D2.1 The models weighed

- **Lazy SMP (chosen).** Every worker searches the same root with the same deepening loop. They share only the TT.
  Helpers may start at odd depths or permute root-move order. There is no split point and no barrier. It suits
  heterogeneous cores: a slow worker only adds fewer entries and never holds anyone up.
- **YBWC or other split-point schemes.** Rejected. They need a shared stack of split points and locks, and a fast
  worker waits on a slow one at each split. Stockfish 7 (January 2016) switched from YBW to Lazy SMP. The
  chessprogramming wiki calls Lazy SMP "easy to implement" and says it "scales surprisingly well up to 8 cores and
  beyond". It also says Lazy SMP is worse than YBW in time to depth (`documented`).
- **Root splitting** (each worker takes different root moves). Rejected: poor at depth, and alpha-beta bounds are not
  shared.
- **Independent games** (several games at once). Not a search change. It is ruled out by Q-3K-3 (one game at a time).

#### D2.2 The mechanism in Node.js

- `worker_threads` workers, one search each. The table lives in one `SharedArrayBuffer`, handed to each worker once.
  Node documents that workers "can share memory … by … sharing `SharedArrayBuffer` instances" (`documented`).
- Each worker has its own module state, so its own killers, history and ordering scratch. Only the TT is shared.
- **Stop and start:** one `Int32Array` slot in a small `SharedArrayBuffer`. The main thread writes it and calls
  `Atomics.notify`. Workers read it through the injected clock, as `ADR-0044` D5's pre-designed upgrade already says:
  `now = () => (stopped ? Infinity : Date.now())`.
- **Wake cost:** an `Atomics.wait`/`notify` round trip between two threads reads 1.7–3.9 µs (p50; p99 2.1–9.6 µs).
  `postMessage` reads 3.9–6.9 µs (SP3). That is a few nodes, so start-up is noise even at 100 ms (≈ 90 000 nodes a move).

#### D2.3 The table: entry layout, check and the race it accepts (A4)

- **Why today's layout cannot be shared as is.** ECMAScript makes plain (unordered) accesses to `Int8`…`Uint32`
  elements tear-free. It does **not** make plain `BigInt64`/`BigUint64` accesses tear-free
  (`IsNoTearConfiguration`, ECMA-262 § 25.1.2.8; `documented`). Today's key column is a `BigUint64Array`. Shared,
  one 64-bit key could tear by the spec.
- **The proposed entry:** 16 bytes, four `Uint32` words in one `Uint32Array` over the `SharedArrayBuffer`. Same size
  as today, so 2^18 slots stay 4 MiB.

  | word | holds |
  |---|---|
  | 0 | `keyLo ^ data` |
  | 1 | `keyHi ^ score` |
  | 2 | `data`: move (17 bits), bound (2 bits), depth (13 bits), today's packing |
  | 3 | `score`, as an unsigned 32-bit pattern |

- **Index:** `keyLo & mask`. *(corrected 2026-11-01: the first text added "With `ABC-253`'s halves this needs no
  `bigint` at all". `ABC-253` was dropped, so the split is the table's own. See the next item.)*
- **The key split, the table's own** *(corrected 2026-11-01)*. Keys stay 64-bit `bigint` everywhere else, so the
  split happens at the table boundary, inside `probeTable(key)` and `storeEntry(key, …)`:
  `keyLo = Number(key & 0xffffffffn)` and `keyHi = Number(key >> 32n)`.
  - **What is reused from `se-ABC-253`.** Its prototype (`.grugops/context/se-ABC-253/raw/patch.py`, 48/48 identity
    rows) gives the table half: two `Uint32` key words a slot, `slot = keyLo & mask` (the same slot as today's
    `key & mask`), and `probeHalves` / `storeHalves`. Its other half is not reused: the halves key update in
    `zobrist.ts`, the halves per-ply key array and the halves repetition scan. That half read about 1.00× (`…efd7790c`).
    It is also the half that collided with `ABC-081`'s, `ABC-122`'s and `ABC-208`'s test rows.
  - **Why at the boundary.** The signatures stay `bigint`, so the seams those rows instrument stay on the call path.
    Read, not run: `ABC-081`'s `vi.mock` wrap of `probeTable` (one `bigint`) and of `storeEntry` (`args[1]`,
    `args[4]`); A6's count of one `BigUint64Array` per call, which counts the per-ply key array, not the table; A7's
    4 MiB (four `Uint32` words × 2^18 slots is 4 MiB); `ABC-122`'s `zobristKeyAfterMove` capacity mocks; and `ABC-208`'s
    probe watch. So the page conflict `se-ABC-253` recorded (A2's unedited rows) does not arise. Whether every row
    passes unedited is `UNKNOWN - verify` until the shared-table ticket runs them.
  - **`Threads 1` stays node-for-node equal to today.** The slot is the same, the replacement rule is the same, and
    so is the hit rule: a non-zero data word, as today's empty test, and both halves equal. One writer never leaves a
    torn entry. The `G4` door test (D4) proves it.
  - **Cost** (`estimate`). Today a probe does one `bigint` AND, one `BigUint64Array` read and one `bigint` compare.
    The split probe does one AND and one shift, then plain `Uint32` reads. That is about the same `bigint` work; a
    store adds one shift. `UNKNOWN - verify` until it is measured. Settled by the shared-table ticket's `Threads 1`
    profile against `main`; `se-ABC-253`'s `raw/profile.sh` and `raw/analyse.mts` are the instrument.
  - **One trap.** `^` gives a signed 32-bit result, so compare as unsigned: `((w0 ^ w2) >>> 0) === keyLo`.
  - **Fallback, only if that profile shows a cost.** Carry `se-ABC-253`'s full halves path instead. It adds
    10–20 h (`estimate`), and it re-points the `ABC-081`, `ABC-122` and `ABC-208` rows, which needs an Architect
    ruling under `ADR-0026`.
- **Store:** four plain writes, words 2, 3, 0, 1. No lock, no `Atomics`.
- **Probe:** read the four words. It is a hit only if `(w0 ^ w2) === keyLo` and `(w1 ^ w3) === keyHi`. This is the
  XOR check of Hyatt and Mann's lockless table, after an idea of Harry Nelson's (`documented`: chessprogramming wiki,
  "Shared Hash Table").
- **The race it accepts: torn entries.** Two workers can write one slot at once and leave words from both. The check
  then fails and the probe reads a miss. A miss costs only search effort, never correctness. A torn entry passes the
  check only if the mixed words happen to satisfy both XOR equations, about 2^-64 for unrelated payloads.
- **Measured (SP2):** a stress run hammered a 1 024-slot table with 4 096 keys from 4 or 12 writers. 0.69 % (4 writers) and 2.6 % (12 writers) of probes landed on a torn slot, and every one failed the check. **Undetected corrupt hits: 0** in 97 M probes over three runs, plain and `Atomics`. Per-word `Atomics` does not make an entry atomic: torn slots appeared with it too. Plain accesses ran at 21.6 ns per probe or store on one thread over a 4 MiB table, and 44 ns per thread at 12 threads (272 M operations/s in total). Per-word `Atomics.load` and `Atomics.store` cost 2.6× more (56 ns on one thread, 126 ns at 12) and buy nothing here. At one probe and at most one store a node, the shared table costs about 40–90 ns of a 1 100–1 600 ns node at 12 workers.
- **Every hit is still treated as a hint.** The hash move is checked for legality before use, as today. A score from a
  false hit is the same risk class as today's 64-bit key collision.

#### D2.4 Node-rate scaling (A4)

SP1 ran N independent real-engine searches as `worker_threads` workers, 2 s each, after a 300 ms warm-up. Each worker
had its own 4 MiB table, so this is the **node-rate ceiling** for Lazy SMP. A shared table adds some memory traffic,
which SP2 bounds. Two positions, two repetitions each. Factor = total nodes/s over one worker's nodes/s in the same run.

| workers | kiwipete (rep 1 / rep 2) | position-6 (rep 1 / rep 2) | total M nodes/s | slowest worker vs fastest |
|---|---|---|---|---|
| 1 | 1.00 / 1.00 | 1.00 / 1.00 | 0.87–0.89 | — |
| 2 | 1.82 / 1.91 | 1.79 / 1.91 | 1.56–1.70 | 0.94–0.99 |
| 4 | 3.63 / 3.59 | 3.35 / 3.28 | 2.87–3.24 | 0.74–0.93 |
| 6 | 4.56 / 4.82 | 4.61 / 4.50 | 3.94–4.28 | 0.74–0.81 |
| 8 | 5.55 / 5.94 | 5.99 / 5.94 | 4.95–5.28 | 0.75–0.79 |
| 12 | 6.72 / 7.40 | 7.51 / 7.33 | 5.99–6.58 | 0.55–0.74 |
| 16 | 7.30 / 7.54 | 7.19 / 7.20 | 6.28–6.70 | 0.49–0.57 |
| 24 | 5.84 / 5.74 | 4.02 / 3.32 | 2.91–5.21 | 0.35–0.53 |

- **The fast/slow split, read from the pinned runs (SP1b):** one search pinned to a fast core (CPU 2) read 0.858 M nodes/s, and pinned to a slow core (CPU 6) 0.524 M. **A slow core is 0.61 of a fast one.** Four processes on CPUs 0–3 read 3.21 M (3.74× one fast core). Eight on CPUs 4–11 read 4.29 M (5.0 fast-core equivalents). Twelve, one per physical core, read 6.54 M (7.62×); twelve placed by the OS read 6.77 M (7.89×).
- **SMT:** two searches on the SMT siblings of one fast core (CPUs 2 and 14) read 1.00 M in total, 1.17× one core. On two fast cores (2 and 3) they read 1.67 M, 1.94×. Slow siblings (6 and 18) gave 1.24×. As separate processes, 16 and 24 searches still gained a little (6.97 M and 7.35 M, 8.1× and 8.6×). As `worker_threads` in one process they lost (24 workers: 2.9–5.2 M). So the loss belongs to the single process, not to the cores. Its cause is `UNKNOWN - verify`; V8's shared platform threads for GC are the first suspect. *(corrected 2026-11-01)* Settled by re-running SP1 at 24 workers with V8's background threads capped (for example Node's `--v8-pool-size`). That is owed only if a pool ever wants more than 12 workers, so it blocks nothing. In one process the 24-worker row falls below the 12-worker row, so a worker pool uses physical cores only.
- **The shape:** near-linear to 4 workers (the four Zen 5 cores), then each Zen 5c core adds about 0.61 of a
  fast one. The curve flattens past 12. **Recommended maximum: 12 workers**, one per physical core, and 8 if the owner
  wants the host left room for other work.
- **Memory (SP6):** each worker isolate held 12.6–14.6 MiB of V8 heap in use (19.5–20 MiB allocated) and 4.5 MiB of `arrayBuffers`, 4 MiB of it its private table in this prototype. Process RSS grew 34–63 MiB per worker, to 454 MiB at 12 workers.

#### D2.5 Elo per doubling of threads (A4; `estimate`, no games were played)

- **Method.** Elo(N) ≈ η × log2(node-rate factor at N) × E_d.
  - η is Lazy SMP's efficiency: how much of a doubling of nodes turns into a doubling of strength. Stockfish reads
    about 0.82–0.83 at 8 threads (8 threads vs 1, against 8× time). A first, basic implementation is assumed lower:
    η = 0.6–0.85 at 2–4 workers and 0.5–0.8 at 8–12.
  - E_d is Elo per doubling of time for this engine, `UNKNOWN - verify` on this engine. At **100 ms**: 70–130.
    Stockfish's 8-vs-1-thread gain is 327 at 10+0.1 and 179 at 60+0.6, and the gain shrinks as time grows. At
    **40/15** (≈ 22 s a move): 40–65, from Kaufman's ≈ 65 at 15 s, falling with time (`ADR-0055` § Elo per speed
    doubling).
- **Sources:** Stockfish wiki "Useful data" (8 vs 1 thread: +327.4 ± 14.6 at 10+0.1, +178.6 ± 14.0 at 60+0.6, "roughly
  82 % efficiency"); TalkChess Lazy SMP threads (a basic 2-thread Lazy SMP read +50 to +58; "about 40–50 per cpu
  doubling" at CCRL 40/40); `ADR-0055` § Elo per speed doubling.

| step | node-rate factor (SP1, `measured (informal)`) | Elo at 100 ms (`estimate`) | Elo at 40/15 (`estimate`) |
|---|---|---|---|
| 1 → 2 workers | 1.79–1.91 | +35 to +100 | +20 to +50 |
| 2 → 4 workers (all four fast cores) | ×1.72–1.99 more | +30 to +110 | +20 to +55 |
| 4 → 8 workers (adds four slow cores) | ×1.53–1.81 more | +20 to +90 | +10 to +45 |
| 8 → 12 workers (all slow cores; not a doubling) | ×1.21–1.25 more | +10 to +35 | +5 to +17 |
| 12 → 24 (SMT siblings) | ×0.45–0.87 in one process (SP1); ≈ ×1.09 as separate processes (SP1b) | a loss | a loss |
| **1 → 12, total** | **6.72–7.51** | **+100 to +300** | **+55 to +150** |

- **Confidence: low.** η and E_d are both unmeasured here. The 100 ms column is the less useful one: the owner's
  routine reads stay single-threaded (D4).
- **Beside the 3 000 goal:** `ADR-0056` D3 lands the classical path at ≈ 2 550–2 800 (central). +55 to +150 at 40/15
  is the size of a whole `EPIC-011` phase, for about three tickets of work (L).

**Q2 summary (A2 shape).**

- **Verdict:** `works-on-this-host-now`. `worker_threads`, `SharedArrayBuffer` and `Atomics` run in Node v26.12.1 here,
  with no flag and no install (`measured`, SP1–SP3).
- **Effort:** **L, 32–65 h** across three tickets: the shared table (`ADR-0025` amendment) with its own key split
  (D2.3), the worker pool with the stop slot and a UCI `Threads` option (`ADR-0044` D5 amendment), and the tests and
  lanes (D4, the `G4` and `NFR-008` rows). *(corrected 2026-11-01: the first text read L, 30–60 h, and counted on
  `ABC-253`'s halves, which were dropped. The split adds 2–5 h (`estimate`): about 1–2 h for the split in
  `probeTable` and `storeEntry`, and 1–3 h for the `Threads 1` profile against `main`. The door test was already
  counted. If that profile shows a cost, D2.3's fallback adds 10–20 h more, so **42–85 h**, at the L/XL border.)*
- **Expected effect:** node rate 6.7–7.5× at 12 workers (`measured (informal)`, SP1). +55 to +150 Elo at 40/15 and +100
  to +300 at 100 ms (`estimate`, D2.5).
- **Risks:** non-determinism above one worker; `NFR-009`'s 16 MiB with per-worker heaps (SP6); test lanes that spawn
  workers inside vitest's 2-worker cap; a heterogeneous core mix that the OS places, so readings move with load; the
  owner's one-core rule.
- **Evidence:** SP1, SP1b, SP2, SP3, SP6 `measured (informal)`; the spec and Node `documented`; Elo `estimate` with sources.

### D3. Q3, sharing search information between CPU threads and device work

**The APU fact first.** The 890M has no memory of its own. Its "VRAM" is a 1 GiB carve-out of the same LPDDR5X DRAM
the CPU uses (`measured`, `mem_info_vram_total`). So "use video memory so it would not go to waste" names the same
DRAM the CPU table already sits in. Nothing about the DRAM is wasted today. What goes to waste is the second and
later cores, and a shared CPU table is how they stop wasting each other's work.

| runtime that passed A3 | `SharedArrayBuffer` visible to the device without a copy, from Node.js? | one round trip vs one node | (i) table shared by CPU workers only | (ii) TT or history shared by CPU workers and device kernels |
|---|---|---|---|---|
| **CPU `worker_threads`** (not a device; the baseline) | yes: it is the same memory | a cache-line hand-off of 0.09–0.10 µs inside one L3, 0.37 µs across the two (SP3) against 1.1–1.6 µs | `works-on-this-host-now` (SP1, SP2) | — |
| **WebGPU via Dawn** | **no.** `GPUQueue.writeBuffer` accepts a `SharedArrayBuffer` view but copies it. `getMappedRange` returns a plain `ArrayBuffer`, detached at `unmap`. No call imports host memory as a `GPUBuffer` (`documented`: the WebGPU IDL in `@webgpu/types` as shipped with `webgpu` 0.6.2; MDN `unmap`) | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) | `works-on-this-host-now` (CPU side only) | `not-feasible` from Node.js: no shared mapping, and a round trip costs 28–59 nodes |
| **ONNX Runtime + Vitis AI EP** | `UNKNOWN - verify`; expected no: tensors are built from typed arrays and handed to the EP. Settled by the host change and an ORT build with the EP | `UNKNOWN - verify`. No published XRT dispatch figure was found; papers name XRT's per-call overhead as the main cost of small NPU work | `works-on-this-host-now` (CPU side only) | `not-feasible`: an NPU runs a fixed graph and cannot probe or store a table during a search |
| **ROCm / HIP, OpenCL** (not reachable from Node without a native addon) | not from Node.js. A native addon could register host memory (HIP host registration, OpenCL `CL_MEM_USE_HOST_PTR`, Vulkan `VK_EXT_external_memory_host`); whether that gives coherent fine-grained access on gfx1150 is `UNKNOWN - verify`. *(corrected 2026-11-01)* Settled only by a native addon test after OQ-5 and a ROCm or ICD install. That is not proposed, because the strand is dropped | `UNKNOWN - verify` | `works-on-this-host-now` (CPU side only) | `works-after-host-change` in principle (ROCm or an ICD, `render`, a native addon); worthless in practice, because no device kernel runs an alpha-beta search to fill or read the table |

**Coherence and transfer on the APU.** CPU caches are coherent across both L3s, at a cost SP3 measured: a spin hand-off of one shared slot takes 0.086 µs between two fast cores, 0.099 µs between SMT siblings and 0.369 µs between a fast and a slow core, across the two L3s. An entry that bounces between the clusters costs about 4× more and stays far under one node. A
device that wants to read a table that CPU workers are changing needs fine-grained, coherent system memory, plus
atomics across the CPU and the GPU. WebGPU exposes neither from Node.js. The native paths might, at a cost that is
`UNKNOWN - verify`.

**Q3 summary (A2 shape).**

- **Verdict:** (i) CPU workers only: `works-on-this-host-now`. (ii) CPU and device kernels: `not-feasible` from
  Node.js (WebGPU, ORT). `works-after-host-change` in principle through a native addon, with no device-side search to
  use it.
- **Effort:** (i) is inside Q2's L. (ii) is **XL**, 100 h or more: a native addon, a device search, and coherence
  work, with no expected gain.
- **Expected effect:** (i) is Q2's effect (it is the shared table). (ii) ≤ 1.0× at every control (`estimate`: a round
  trip of 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) against 1.1–1.6 µs a node).
- **Risks:** (i) torn entries, accepted and detected (D2.3). (ii) a C++ build in the product, a host change, and
  coherence bugs that no test lane here can see.
- **Evidence:** as tagged in the table.

### D4. Q4, the owner's standing rules (A6)

For each rule: what would have to change, whose decision it is, and what a fair comparison would be. **This ADR
changes none of them.**

| rule | today | what would change for threads (Q2) | for a device or a net (Q1, Q3) | whose call | a fair comparison |
|---|---|---|---|---|---|
| **Q-3K-3, "Keep game on one core"** (`…f7a50e95`), reading (a): **one game at a time** | width 1, no parallel games (`ADR-0056` C2′) | nothing: a threaded engine still plays one game at a time | nothing | owner (the reading) | — |
| **Q-3K-3**, reading (b): **a single-threaded engine** | the Orchestrator recorded "tests stay one game at a time (width 1)"; the engine is single-threaded by `ADR-0044` D5 | a threads build breaks this reading during play. The owner says which reading he meant | a device is a second processor: it breaks it too | **owner** | under (b), none: threads stay out. Under (a), the routine reads below stay at `Threads 1` |
| **The 100 / 400 reads at 100 ms** (`ADR-0056` C2′ GAIN ≥ 50.0/100, NEUTRAL ≥ 43.0/100; C3″ 400 head to head) | both sides single-threaded, 100 ms, width 1 | **recommended: unchanged.** Every per-change and per-epic read stays at `Threads 1` on both sides. The owner's reason holds: *"squeezes the algorithm to be better with less cpu resources."* The threads ticket itself is read once, `Threads N` against `Threads 1` at 100 ms, labelled as a hardware gain | the same | owner (the rule); Architect (the method) | per change: `Threads 1` vs `Threads 1`. The threads ticket alone: N vs 1, reported as core-seconds as well as wall time |
| **The classical path** (`ADR-0056`) and **`EPIC-011` § Out of scope: threads** | "Threads, pondering: no, single-threaded by decision" | Lazy SMP is classical (no net), so `ADR-0056` stands. The out-of-scope line has to be lifted | — | **owner** | *(corrected 2026-11-01: was "—")* the threads ticket's own read only: `Threads N` against `Threads 1` at 100 ms, reported in wall time and in core-seconds (the 100 / 400 row). Every phase's own read stays `Threads 1` against `Threads 1` |
| **`EPIC-011` § Out of scope: neural** and **`EPIC-004`'s permanent non-goal** ("Neural network evaluation, NNUE, or any learned component") | out | — | workloads (a) and (b) need it lifted. (c), (d), (e) do not | **owner** | an NNUE build against the tuned classical build, same threads, same control |
| **`ADR-0044` D5**, one thread, no worker | accepted, with a pre-designed worker upgrade | amended: the search moves to workers; the stop flag becomes the D5 `SharedArrayBuffer` slot. Side gain: `isready` and `stop` answer during a search, inside `AR-UCI-BUSY`'s bound | — | owner accepts (a reversed decision, asked inside OQ-1, *corrected 2026-11-01*); Architect writes it | UCI session lanes unchanged at `Threads 1` |
| **The 40/15 claim** (`ADR-0056` C1) and **the smoke S′**, both against Stockfish 19 `UCI_LimitStrength`, `Threads 1`, `Hash 16` | skytalix single-threaded | the claim needs a stated thread count. Stockfish's limited play is pinned by depth (`ADR-0056` C1), so its thread count does not move its strength. The question is what skytalix may use | — | **owner** | rating lists keep 1-CPU and 4-CPU lists apart (CCRL). Fair: claim "3 000 at 40/15, 1 CPU" or "… N CPU", never unlabelled. S′ stays at `Threads 1` |
| **`G4`, the node-for-node door** (`ADR-0026`) and **determinism in the default lane** | one thread, so node counts are exact and repeatable | Lazy SMP above one worker is not deterministic: thread timing changes the table. **Proposed:** `Threads 1` stays node-for-node equal to today, by a door test, so every existing oracle holds. Multi-worker play is tested by properties: a legal move, a bounded time, no thrown error, a table that never yields a corrupt hit. Not by node counts | a device evaluation needs its own identity oracle against the CPU evaluation | Architect (test method, within `ADR-0026`) | `Threads 1` vs today: identical. `Threads N`: properties only |
| **`NFR-008`**, default test lane ≤ 10 s | met (9.25 s at `ABC-244`) | each worker's start-up and module import cost wall time (not timed alone here, `UNKNOWN - verify`; *corrected 2026-11-01:* settled by the lanes ticket timing the default lane before and after its one 2-worker row); vitest already runs 2 workers (`ADR-0040` addendum 2). Multi-worker tests go to a deep lane; the default lane holds one small 2-worker property row at most | a device lane can never sit in the default lane (no access) | Architect proposes; Security/NFR checks | the default lane's wall before and after |
| **`NFR-009`**, search-held memory ≤ 16 MiB | one 4 MiB table | the shared table counts once. `NFR-009`'s instrument reads retained `arrayBuffers` and heap growth (≤ 16 MiB, growth ≤ 1 MiB). A shared-table build would read ≈ 4 MiB once plus ≈ 0.5 MiB per worker, about 10 MiB at 12 (`estimate` from SP6). Each isolate's baseline heap, 12.6–14.6 MiB, is outside those fields today. Counted, 12 workers would exceed even the 128 MiB ceiling (12 × 12.6 ≈ 151 MiB; *corrected 2026-11-01:* was "pass"). Which reading holds is OQ-4 | a device copy of a table would count | **owner** (the bound) | `process.memoryUsage()` summed over the workers, as `NFR-009` reads it today |

**Q4 summary (A2 shape).**

- **Verdict:** `UNKNOWN - verify`, settled by the owner's answers to OQ-1 to OQ-3. On yes, threads fit every rule
  in the table with the comparisons stated. Devices need the host change and, for the useful workloads, the neural
  non-goal lifted.
- **Effort:** records only for the rule changes: **S, 2–4 h** of BA/PM and Architect folds after his answers.
- **Expected effect:** none by itself. It gates D2's +55 to +150 at 40/15 (`estimate`).
- **Risks:** a 3 000 claim read on 12 threads and quoted without the label; per-change reads drifting to multi-thread
  and losing the owner's "less cpu" squeeze; a non-deterministic lane that flakes.
- **Evidence:** the rule texts as cited (`documented`, this repository).

### D5. What a yes would amend (named, not done)

- **`ADR-0025`:** decision 2's layout (three typed arrays → one `Uint32Array` of four words over a
  `SharedArrayBuffer`), and the threading line in `src/transposition.ts` ("threading stays `UNKNOWN - verify`").
  Decision 4's lifetime is already in play in `EPIC-011` phase 1 (T3, `ABC-257`).
- **`ADR-0044` D5:** the worker upgrade gets built, generalised from one worker to N.
- **`ADR-0044` / `ADR-0052` UCI surface:** a `Threads` spin option, default 1, so the default product stays as today.
- **`EPIC-011` § Out of scope:** the threads line, on the owner's word.
- **Q-3K-3:** its reading, on the owner's word.

### D6. Recommendation, one per strand (A7)

| strand | recommendation | why | re-open trigger, if parked |
|---|---|---|---|
| **Accelerator** (NPU, iGPU; Q1) | **`park`** | no device is reachable from this user today; the NPU's Linux stack is Python-only and documented for another Ubuntu; one round trip costs 28–59 nodes; the large-Elo device workloads need a neural net, and the neural non-goal is permanent | **either** the owner lifts `EPIC-004`'s neural non-goal and chooses an Lc0-style direction, **or** a measured WebGPU round trip on the 890M, from Node.js, after the `render` change, is ≤ 10 µs (about 6–9 nodes) |
| **Threads** (Q2) | **`pursue after EPIC-011 phase 1`** | the largest measured lever on the list: 6.7–7.5× node rate, an estimated +55 to +150 at 40/15, at L cost, with no install. After phase 1, because Lazy SMP lives on the TT, and phase 1 (T1–T4, `ABC-238`, `ABC-237`, `ABC-257`, `ABC-258`) settles the table's replacement, lifetime and size. *(corrected 2026-11-01: the first text read "`ABC-253`'s 32-bit halves are the key layout the shared table wants". `ABC-253` was dropped, so the shared-table ticket makes its own split at the table boundary, D2.3; the effort is L, 32–65 h)* | — |
| **Shared memory** (Q3) | **`drop`** for a table shared with a device. The CPU-only shared table is **not dropped**: it is the threads strand's table (D2.3) | on this APU "video memory" is the same DRAM; Node.js has no zero-copy path to a device; no device kernel runs a search to fill a table. The faithful form of "so it would not go to waste" is the CPU-shared table | — |

**Order, if the owner says yes to threads:** after `EPIC-011` phase 1, before phase 5's W1 and the first 40/15 reading.
That way the claim can be read both ways (OQ-3). The per-change reads of phases 2–5 stay at `Threads 1` (D4), so
threads do not muddy any phase's own reading.

*Dated 2026-11-02 (`arch-owner-answers-1102`; owner `…81ae2db4`).* **The threads row now reads `pursue`, and its
place moves.** "After phase 1" assumed Phase 1 would settle the table's replacement, lifetime and size. Phase 1 is
paused with no end date (*"P yes"*): T1 closed unmerged (`ADR-0058` accepted, not in force), T2 and T4 parked, T3
paused. So the table on `main` is stable: exact-depth cutoffs, always-replace, cleared per search, 2^18 slots. The
alternative "threads now, before phase 1" was rejected because the table would change four times; that no longer
holds. The parked items are policy changes (hit rule, replacement, lifetime, size), and each ports to the shared
layout without rewriting it. The recommendation, the Orchestrator's and BA/PM's to set by width:
- **After Phase 2 and its R1 reading, before Phase 3** (the owner's "pruning first").
- **The shared-table ticket may be pulled earlier, beside Phase 2.** It edits only `src/transposition.ts`, no Phase 2
  ticket edits that file, and it is node-for-node equal to today at `Threads 1`.
- **All three before W1 and before any 40/15 reading** (OQ-3 (c) reads both thread counts).
- **T2 and T4 are re-asked after the worker-pool ticket,** on the shared table, where several workers raise the
  table pressure they need (`ADR-0025` T2 status).

*Dated 2026-11-02 (`arch-accel-review`).* **No row changes.** The owner's Gemini analysis was checked against this
table (D8). The accelerator row stays `park` with its two re-open triggers. D8.6 adds one precision: a WebGPU round
trip of 10 µs or less would re-open device work, but it would not make any of that analysis's architectures
buildable.

*Dated 2026-11-02* (`arch-owner-answers-1102b`; owner `…773be7de`, *"park threads"*). **The threads row now reads
`parked`.** Its re-open trigger: a new premise with its own pre-registered probe. The premises named so far are
`ADR-0058` in force (`ABC-257`), a search change that breaks the workers' lockstep, or the owner's ~30 min S+D+P probe
at `Threads 12`. The shared table (TH-1) is built and in force; only the worker pool is parked. The accelerator row
stays `park`; the shared-memory row stays as written.

### D7. Questions for the owner (yes/no or a choice)

*Answered 2026-11-02 (owner `…81ae2db4`): OQ-1 yes, OQ-2 (a), OQ-3 (c), OQ-4 (a), OQ-5 no, OQ-6 later. See § Status.
The questions are kept as asked.*

*Added 2026-11-02 (`arch-accel-review`): OQ-7 and OQ-8 re-ask OQ-5 and OQ-6 in the light of the owner's Gemini
analysis. They are in D8.8. Both are recommended to stay as answered.*

- **OQ-1, threads in scope.** Lift `EPIC-011` § Out of scope's "Threads" line, so BA/PM can cut a Lazy SMP ticket
  after phase 1? **yes / no.** Recommended: yes. *(corrected 2026-11-01)* A yes also accepts reversing `ADR-0044` D5
  (one thread, no worker) for the threads tickets (D4, D5). The amending ADR comes with the worker-pool ticket. A
  reversed ADR is the owner's call, so this question asks for it by name.
- **OQ-2, the reading of "Keep game on one core."** (a) one game at a time; the engine may think on several cores
  inside it. (b) a single-threaded engine. **a / b.** Under (a), every 100 / 400 read stays at `Threads 1`
  (recommended). Under (b), the threads strand is dropped.
- **OQ-3, the 40/15 claim.** Which counts as "3 000"? (a) `Threads 1` only, as today. (b) `Threads N`, labelled
  "N CPU". (c) both read and reported separately. **a / b / c.** Recommended: c, reading `Threads 1` first.
- **OQ-4, memory.** For a threads build, does `NFR-009` count each worker's own V8 baseline heap (12.6–14.6 MiB each,
  SP6)? **(a) no:** it reads retained growth as its instrument does today, ≈ 10 MiB at 12 workers, inside 16 MiB.
  **(b) yes:** then 12 workers exceed even the 128 MiB ceiling (≈ 151 MiB; *corrected 2026-11-01:* was "pass"), and a threads build caps at about 8 workers on a
  re-level. **a / b.** Recommended: a. Asked only if OQ-1 is yes.
- **OQ-5, the host change.** Add `olger` to the `render` group, so a later hop can measure the iGPU and the NPU?
  **yes / no.** Recommended: no for now; it only serves the parked strand.
- **OQ-6, a neural net on the CPU.** Re-open `EPIC-004`'s neural non-goal for an NNUE-style evaluation in TypeScript
  on the CPU (workload a, no device)? **yes / no / later** (later = on the same trigger as `ADR-0056`'s V4, bitboards, which re-opens `ADR-0001`: if the curve
  flattens below 3 000 after phase 5, that is the next question; *corrected 2026-11-01:* V4 defined here). Recommended: later.

### Inputs for the thread tickets (2026-11-02, `arch-owner-answers-1102`)

What BA/PM needs to cut the three tickets. It cites D2–D5 and does not restate them. Sizes are D2's estimate (L,
32–65 h in all; 42–85 h with D2.3's fallback). The order is TH-1 → TH-2 → TH-3; TH-3 may be cut into TH-2.

| | TH-1, the shared table | TH-2, the worker pool and `Threads` | TH-3, the tests and lanes |
|---|---|---|---|
| **scope** | D2.3: one `Uint32Array` of four words over a `SharedArrayBuffer`, 16 B a slot, 2^18 slots, 4 MiB. The XOR check. The key split inside `probeTable` and `storeEntry`; their `bigint` signatures do not change. Store order 2, 3, 0, 1. Plain accesses, no `Atomics`. Replacement, the exact-depth hit rule and the per-search clear are unchanged | D2.2: `worker_threads`, one search a worker, the table handed over once. The stop slot (an `Int32Array` over a small `SharedArrayBuffer`) read through the injected clock, `ADR-0044` D5's pre-design. Own killers, history and scratch per worker. A UCI `Threads` spin option, default 1 | D4's `G4`, `NFR-008` and `NFR-009` rows: the multi-worker property rows (a legal move, a bounded time, no thrown error, no corrupt hit), the torn-entry stress (SP2's form), the `NFR-009` instrument summed over workers, the default lane's wall before and after |
| **its ADR** | an amendment to `ADR-0025` decision 2 (the layout) and decision 4's last bullet ("one table per worker by construction" becomes one shared table). **Changing an accepted ADR is the owner's.** OQ-1 named only `ADR-0044` D5, so this amendment is asked when written. Reading (b) lets the build proceed while it is PROPOSED | a new ADR amending `ADR-0044` D3 (the option rows) and D5. **The D5 reversal is pre-accepted** (OQ-1). The ADR's text is still reported to the owner | none; it follows `ADR-0026` (test method) and the TH-2 ADR |
| **the identity bar** | `Threads 1` node-for-node equal to `main` (the `G4` door on `ABC-078` `A3`'s corpus). `ABC-081`, `ABC-122` and `ABC-208` rows run unedited; if any needs an edit, that is an Architect ruling under `ADR-0026` (D2.3) | `Threads 1` node-for-node equal to `main`, and every UCI session lane unchanged at `Threads 1` | — |
| **the cost bar** | `G6` by its rule (≥ base, floor 6) at `Threads 1`, plus the `Threads 1` profile against `main` reported (`se-ABC-253` `raw/profile.sh`, `raw/analyse.mts`). **`G6` below base triggers D2.3's fallback** (the full halves path, +10–20 h) | — | `NFR-008`: the default lane ≤ 10 s with at most one small 2-worker row; multi-worker rows behind a deep-lane flag |
| **the read** | none: value-identical at `Threads 1`, proved by the door. C2′ grades strength changes only (`ADR-0056` D5) | one read, `Threads N` against `Threads 1` at 100 ms, GAIN (≥ 50.0 of 100), labelled a hardware gain and reported in wall time and core-seconds (D4). S′ and the Levels deep lane stay at `Threads 1` | none |
| **NFRs** | `NFR-009`: 4 MiB, unchanged. `NFR-005`: `G6` | `NFR-009` read as OQ-4 (a). `NFR-004`: each worker checks the clock at `NODES_PER_CLOCK_CHECK`, as today. `AR-UCI-BUSY`: unchanged at `Threads 1` | `NFR-008`, `NFR-009` |

**Design choices left to the TH-2 ADR, each with the Architect's recommendation:**
- **Does `Threads 1` spawn a worker?** Recommended: no. `Threads 1` runs today's in-thread path, so the default
  product, its timing and `AR-UCI-BUSY` stay exactly as today. The worker path serves `Threads` ≥ 2, and D5's side gain
  (`isready` and `stop` answered during a search) arrives with it.
- **The option's maximum.** Recommended: 12, one per physical core (D2.4). The owner may ask for 8 to leave the host
  room.
- **Which result is played.** Recommended: worker 0's best move; helpers only fill the table. Helper diversity (odd
  start depths or a permuted root order) is the ADR's to pick and measure.
- **The terminal game.** Recommended: unchanged, `Threads 1`, no new surface (`ADR-0044` D7).

**Owed by other roles, named here:** BA/PM lifts the "Threads" half of `EPIC-011` § Out of scope and places TH-1 to
TH-3 in § Phases (D6's dated line). `NFR-009`'s file may need one line stating OQ-4 (a)'s reading; that is the TH-2
design hop's, with Security/NFR. Phase 2 tickets keep `Threads 1` reads with no change.

### D8. Addendum 2026-11-02: the owner's Gemini analysis, checked (`arch-accel-review`)

**What was checked.** `memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md`. It is owner-supplied output
from another model ("Argon"), added in `f0a1b494` and cited here, not edited. It argues that bounds and tables shared
through shared RAM or VRAM can make a GPU or NPU alpha-beta search reach "3000 to 3500+ Elo". It gives three
architectures (A, B, C), a fourth row in its table (D) and advice on where to start. **Every figure in it was treated
as unverified.** Each claim is marked **verified**, **contradicted** or **`UNKNOWN - verify`**, with what settles it.
The yardsticks are this ADR's own: one node 1.1–1.6 µs; one WebGPU round trip 45–65 µs (p50, lavapipe; the 890M
itself `UNKNOWN - verify`); no coherent CPU–device shared memory and no cross-device atomics from Node.js (D3); the
NPU reachable only through ORT plus the Vitis AI EP (D1.1); no `render` group (OQ-5 no). `ABC-264`'s 44.0/100 read
(not merged) is not used anywhere below.

#### D8.1 The one probe, PR-1 (`measured (informal)`, no timing)

- **What:** a scratch copy of `src/` at `main` `2ef3aadc`, outside the repository and deleted at hop end. One counter
  was added at the quiescence stand-pat, the only `evaluate` call on the shipped path (`src/quiescence.ts`). It counts
  how often the stand-pat falls outside the window by more than a margin. It also counts how often
  `evaluateWithoutMobility` alone already lies outside it. `search(position, 7)` was run on four positions.
- **Window:** `flock host-test.lock timeout 300 node probe.mjs`, 2026-11-02T14:33:23Z–14:34:06Z, 43 s. Nothing timed.

| position | stand-pats | at a null window | outside [α − 120, β + 120] | outside ± 200 | without mobility, outside ± 200 | max \|full − without mobility\| |
|---|---|---|---|---|---|---|
| start position | 29 277 | 99.5 % | **40.6 %** | 30.6 % | 28.6 % | 100 |
| kiwipete | 515 518 | 98.2 % | **83.0 %** | 71.9 % | 70.0 % | 100 |
| position 3 (endgame) | 22 746 | 98.6 % | **50.8 %** | 34.0 % | 32.7 % | 100 |
| position 6 | 503 356 | 97.9 % | **78.2 %** | 69.9 % | 68.1 % | 100 |

The 100 in the last column is by construction: `src/evaluate.ts` clamps the mobility total to ±100 cp
(`MOBILITY_CAP`).

#### D8.2 The hardware premises (the analysis's § 1)

| claim | verdict | basis, and what settles an open one |
|---|---|---|
| Alpha-beta and PVS cut the tree from O(b^d) to about O(b^(d/2)) | **verified**, as alpha-beta's best case with perfect ordering | `documented`: Knuth and Moore (1975), chessprogramming wiki "Alpha-Beta" (not re-read this hop) |
| Siblings launched before the first move sets the bound do redundant work | **verified** in principle | `documented`: the search overhead of parallel alpha-beta. It is why D2.1 weighed YBWC against Lazy SMP |
| Global VRAM costs 300–600 cycles | **`UNKNOWN - verify`** for the 890M, and moot here | no source given. Settled only by a device microbenchmark after OQ-5. The 890M has no VRAM of its own anyway: its "VRAM" is a 1 GiB carve-out of system DRAM (`measured`, D3) |
| On-chip shared memory is 64–228 KB a CU or SM, at 20–30 cycles | **partly verified**: the 890M lists 128 KiB of LDS. Its latency is **`UNKNOWN - verify`** | `documented`: the ROCm GPU specs table gives gfx1150 "LDS (KiB) 128", not saying per CU or per WGP. Latency is settled only on the device after OQ-5 |
| 1-cycle warp shuffles (`__shfl_sync`) over 32 threads | **contradicted as written for this stack.** That is a CUDA intrinsic. WGSL has `subgroupShuffle` and `subgroupBallot` behind `enable subgroups`, and RDNA 3.5 runs waves of 32 or 64 | `documented`: WGSL § 17.12; ROCm table ("Wavefront Size 32 or 64"). Whether `webgpu` 0.6.2 on RADV exposes `subgroups` is `UNKNOWN - verify`, settled by requesting the feature after OQ-5 |
| Unified memory gives cache-coherent zero-copy CPU↔device ring buffers at 80–120 ns, against 10–20 µs over PCIe | **contradicted for every path reachable from Node.js.** Physically shared DRAM is **verified** | `measured` (D3: one DRAM). `documented` (D3: `writeBuffer` copies; `getMappedRange` returns an `ArrayBuffer` that is detached at `unmap`; ORT takes a tensor each run). Our measured figures are 86–369 ns between CPU cores (SP3) and 45–65 µs for a device round trip (SP5). The APU has no PCIe hop. The cost is dispatch and sync, not transfer |
| A GPU branches and chases pointers; an NPU runs a static tensor graph and cannot probe a hash table | **verified for the reachable path**: ORT plus the Vitis AI EP runs a fixed graph (D3). **Overstated for the silicon** (`UNKNOWN - verify`): XDNA's tiles are programmable through MLIR-AIE | settled by AMD's AIE-ML architecture manual. Moot: no MLIR-AIE path exists from Node.js |
| "Three triple-checked architectures … realistically reach 3000 to 3500+ Elo" | **`UNKNOWN - verify`**: no evidence is offered | `documented`: the chessprogramming "GPU" page names no GPU alpha-beta engine with a strength figure. The GPU engine it names at top strength, Lc0, is MCTS with a large net (D1.2 (b)) |

#### D8.3 Architecture A: warp-cooperative YBWC in a persistent GPU megakernel

| claim | verdict | basis |
|---|---|---|
| Earlier GPU alpha-beta failed because one node was mapped to one thread | **`UNKNOWN - verify`** | plausible. The chessprogramming "GPU" page lists Zeta and the papers with no results. Settled by reading Strnad and Guid (2011) or the Zeta threads |
| One node to one warp: two squares a lane, divergence-free move generation and SEE in about 45 cycles | **`UNKNOWN - verify`**, with no source | it is also a new engine. skytalix is a 0x88 mailbox with `Move` objects (`ADR-0001`); bitboards are V4, parked on Q-3K-8 |
| A (768 → 256) × 2 → 1 NNUE fits in the SM's on-chip memory | **contradicted** for the 890M, by arithmetic | the feature transformer alone is 768 × 256 = 196 608 weights: 384 KiB at INT16, 192 KiB at INT8. Both exceed the 128 KiB of LDS listed for gfx1150. It is also a neural net (OQ-6 later) |
| Split points and atomic `alpha` / `abort_flag` in shared memory; warps abort in about 30 cycles | **`UNKNOWN - verify`** for WebGPU, the only GPU path here | `documented`: WGSL has workgroup memory and atomics, but "Recursion is disallowed" (§ 11.4), so the search needs an explicit stack. Workgroups execute independently, "one workgroup can't block another", and barriers do not sync across workgroups (gpuweb discussion 3935). So a persistent kernel that spins on other workgroups has no progress guarantee. Settled only on RADV after OQ-5, together with the amdgpu job timeout for a dispatch that lasts a whole 22 s move |
| A global lockless TT updated with coalesced 128-bit atomics | **contradicted for WebGPU** | `documented`: WGSL atomics are `atomic<i32>` and `atomic<u32>` only. A lockless table needs no atomics: D2.3's XOR check on 32-bit words, which TH-1 (`ABC-265`) builds on the CPU |
| LMR, null move and PVS stay intact. 15–80 M nodes/s. "easily clears 3200 to 3400+" | **`UNKNOWN - verify`**, with no source | no engine is shown. Nothing here could settle it without OQ-5 and a second engine written in WGSL |

**Verdict A: adds nothing.** It is a second engine written in a GPU language. It is blocked by OQ-5, by three WGSL
limits that no latency figure removes (no recursion, 32-bit atomics only, no progress guarantee across workgroups),
and, for its evaluation, by OQ-6. CUDA, ROCm and raw Vulkan need a native addon (D1.1; `ADR-0044` rejected
alternative 18). Its sound parts are a lockless shared table and an abort flag. TH-1's table and TH-2's stop slot
already build those on the CPU. Its YBWC split points were rejected for this engine in D2.1.

#### D8.4 Architecture B: "shadow-bound" speculative PVS over unified RAM (CPU + NPU or iGPU)

| claim | verdict | basis |
|---|---|---|
| A 20–40 µs dispatch for each leaf caps the engine at 25 000 nodes/s | **verified in direction; ours is worse** | 1 / 40 µs = 25 000 a second. Our measured round trip is 45–65 µs, so 15 000–22 000 a second (SP5 and arithmetic) |
| CPU and NPU share physical RAM, so a lockless ring buffer in shared RAM can feed the NPU | DRAM: **verified**. The ring buffer from Node.js: **contradicted** | D3: ORT tensors are handed over each run (`UNKNOWN - verify`, expected no zero-copy). The analysis also contradicts itself: § 1 says the NPU cannot probe a hash table, yet B has the NPU write TT entries and set an atomic flag. The buildable form is a CPU thread that calls the device in batches and writes the results back itself |
| The CPU runs PVS at 10–15 M nodes/s with an L1-resident "L0 nano-eval" | **contradicted** for this engine | 0.63–0.90 M nodes/s (`ADR-0055`; SP1 0.87–0.89 M) |
| About 85 % of leaves fall outside [α − Δ, β + Δ], Δ ≈ 120 cp | **contradicted as a constant.** Close only in tactical middlegames | PR-1: 40.6–83.0 % by position (start position 40.6, endgame 50.8, position 6 78.2, kiwipete 83.0) |
| The NPU gives 40+ TOPS | **verified**: 50 INT8 TOPS for the HX 370's XDNA 2 | `documented` (spec pages). Beside the point: per-leaf work is bound by latency, not throughput |
| NPU results land in the shared TT with a `TT_EXACT_NPU` flag, and the search uses them | **contradicted for our table** | quiescence never probes the table (`ADR-0025` d5), and a hit needs the exact depth (D6's dated line). A depth-0 evaluation entry would never be read. It would need an evaluation cache, a new structure |
| A PV-disruption flag sends the CPU back to re-search the branch | **`UNKNOWN - verify`** on cost; it breaks determinism | the move would then depend on device timing even at `Threads 1`, so the `G4` door (`ADR-0026`; D4) cannot hold. The search has already left the branch, so the "re-search" is in practice the next iteration or a root re-search. No source gives its cost |
| A deep transformer or big NNUE on the NPU | out of scope | `EPIC-004`'s neural non-goal; OQ-6 later |
| "The CPU never stalls … this solves the sequential dependency paradox" | **`UNKNOWN - verify`** as a gain | the CPU never waits because it searches on the cheap score. The big net then acts only through re-searches and later iterations. No reading or source is given |

**Verdict B: adds nothing now.** It is recorded as the one parked device shape that keeps alpha-beta intact (D8.6).
It needs OQ-5 and OQ-6 both reversed. What transfers to the CPU is lazy evaluation (D8.7).

#### D8.5 Architecture C (tensorized "soft-minimax" micro-trees), row D and the starting advice

| claim | verdict | basis |
|---|---|---|
| The NPU backs up a 2-ply minimax with `Score_parent(i) = −max_j(−Score_leaf(i, j))` | **contradicted** by the formula itself | −max(−s) = min(s). That is one ply of backup. A 2-ply value needs a second pooling stage (the max of the mins). Nor is it "soft": it is a hard max |
| MaxPool and negation run natively on every NPU | **`UNKNOWN - verify`** | ORT has MaxPool. Settled by the Vitis AI EP's operator-support list and a placement report after OQ-5 |
| 1–3 M effective nodes/s | **`UNKNOWN - verify`**, and **contradicted on our figures** (`estimate`) | the CPU still generates the 72 positions of an 8 × 8 micro-tree: 72 × 1.1–1.6 µs = 79–115 µs. A device can save at most the 64 leaf evaluations, 64 × 0.3–0.5 µs = 19–32 µs (the evaluation share is itself `UNKNOWN - verify`, § Context), against one round trip of 45–65 µs: a slowdown. Batching four frontier nodes saves 77–128 µs per round trip, at most about 1.2× on 320–460 µs of work, and serial alpha-beta does not hand out four frontier nodes at once without speculation |
| Expand the top K = 8 captures, checks and killers, and evaluate the leaves statically | **contradicted** as a quality claim (the analysis admits a part of it) | static evaluation of capture and check leaves without quiescence is the horizon effect `src/quiescence.ts` exists to remove. The K = 8 cut is forward pruning with no re-search |
| Row D: a VRAM-resident DAG MCTS at 100–400 K neural nodes/s | adds nothing | it is D1.2 workload (b), already rejected inside `EPIC-011`. Its figures are `UNKNOWN - verify` (D1.2) |
| Start with B: an `mmap` or pinned ring buffer beside the TT, and an NPU worker **process** that upgrades TT entries in place | **contradicted on this host** | no device access (`measured`; OQ-5 no). A `SharedArrayBuffer` is shared between `worker_threads` of one process, not between processes (`documented`, Node.js). Node has no built-in `mmap`, so it would need a native addon (`ADR-0044` alt 18). And the TT cannot carry evaluation entries (D8.4) |
| Keep the existing UCI alpha-beta engine and use the classical evaluation as the L0 bound | consistent with `ADR-0056` | with no big evaluation behind it, the "L0" is simply the evaluation |
| Or write raw GPU kernels in CUDA, ROCm or Vulkan compute | **not reachable** from Node.js without a native addon | D1.1. WebGPU is the only binding that runs here, and it runs on lavapipe |

**Verdict C: adds nothing.** On our own figures it is a slowdown, it is tactically unsound, and without a net it has
nothing for the device to compute. **Row D and the starting advice: add nothing.**

#### D8.6 Verdict per idea, and what changes in this ADR

| idea | changes ADR-0057? | new parked option? | runs on the CPU threads path now? |
|---|---|---|---|
| A, warp-cooperative YBWC on the GPU | no | no | no. Its lockless table and stop flag are TH-1 and TH-2 already |
| B, shadow-bound speculative PVS | no | **yes, recorded below (PK-B)** | its kernel, lazy evaluation, is single-threaded and needs no device (D8.7) |
| C, tensorized micro-trees | no | no | no |
| D, VRAM DAG MCTS | no (it is D1.2 (b)) | no | no |
| "use shared RAM / VRAM to share bounds" | no. D3 and D6 already hold its faithful form: the CPU-shared table | no | yes: TH-1 (`ABC-265`) and TH-2 (`ABC-266`) |

- **The re-open trigger, made precise.** D6's second trigger stands: a measured WebGPU round trip of 10 µs or less on
  the 890M, from Node.js, after the `render` change. Meeting it would re-open device work of the D1.2 (c) and (d)
  kind. It would **not** make A buildable: A also needs recursion, wider atomics and a cross-workgroup progress
  guarantee, and WGSL gives none of them. B and C need the neural non-goal lifted, under D6's first trigger.
- **PK-B, a parked shape** (no ticket; re-read only if OQ-5 and OQ-6 both turn yes). The one device pattern in the
  analysis that keeps alpha-beta intact is: a CPU search on a cheap evaluation; one CPU worker thread that batches
  window leaves to the device; results written by that thread into an **evaluation cache**, not the TT; read from the
  next iteration on. No re-search trigger, so `Threads 1` stays deterministic when the device is off. It is recorded
  so that a later re-open does not redo this review.

#### D8.7 What transfers to the CPU path

- **Speculative, narrowed bounds become aspiration windows.** They are already on the path: `ADR-0056` S1, started by
  `ABC-236` at depth 5. Nothing is added.
- **The two-tier "uncertainty band" becomes lazy evaluation.** A cheap first stage; the rest is skipped when the cheap
  score is far enough outside the window (`documented`: chessprogramming "Lazy Evaluation"; Stockfish's 2020 hybrid,
  which used the classical evaluation for unbalanced material and NNUE otherwise, is the same principle). On today's
  evaluation (PR-1): mobility is clamped to ±100 cp, so skipping it when the rest is at least β + 100, or at most
  α − 100, cannot change the stand-pat test. The rest alone already lies outside **± 200** in **28.6–70.0 %** of
  stand-pats, so at least that share would pass the ± 100 skip. **Its worth is `UNKNOWN - verify`.** Mobility's share
  of self time is not measured, and mobility is counted in the same board walk as other terms, so a skip saves less
  than that share. Settled by a `chooseMove` profile at `main` (`se-ABC-253`'s `raw/profile.sh`, `raw/analyse.mts`).
  It is not node-for-node: fail-soft returns change, so it would need an off-door pair (`ADR-0026`; `ADR-0050` d4)
  and a C2′ read. **Recommended place: a Phase 4 candidate, weighed when E3, E5 or E6 make the evaluation costlier.**
  `ADR-0055` O1-e (incremental material + PST, "not proposed now") would be its cheap first stage. No ticket now.
- **Lazy SMP helpers: nothing new.** The analysis's "never stall, share through memory" is Lazy SMP over TH-1's table.
  Helper diversity stays the TH-2 ADR's to choose (§ Inputs). Its ± 120 cp band is not read as evidence for any
  pruning margin.

#### D8.8 Tickets for BA/PM, and two owner questions

- **`ABC-265`, `ABC-266`, `ABC-267`: no change.** No new spike: OQ-5 is no, and nothing here needs a device read.
- **One optional line for BA/PM** in `EPIC-011`'s Phase 4 notes (its "Not cut, recorded" list): "lazy evaluation of
  the mobility term (and of later costly terms), `ADR-0057` D8.7; worth `UNKNOWN - verify` until the profile". Not a
  stub, no ticket.
- **OQ-7 (re-asks OQ-5).** Does this analysis change your "no" on adding `olger` to the `render` group? Every
  architecture in it needs the device. **yes / no. Recommended: no.** On our figures none of them beats the threads
  strand, and A is blocked by WGSL whatever the latency. On a yes, the smallest step is re-running SP5 on RADV
  (≤ 5 min), read against D6's 10 µs trigger.
- **OQ-8 (re-asks OQ-6).** Does this analysis change your "later" on a neural net? B and C, and A's evaluation, are
  worth something only with a large net. **yes / no / later. Recommended: later**, on `ADR-0056`'s V4 trigger, as
  you answered.
- **If neither is answered, both earlier answers stand.** Nothing here waits on them.
- *2026-11-02 (`arch-owner-answers-1102b`; owner `…773be7de`):* neither was answered, so both defaults stand:
  OQ-7 no, OQ-8 later.

#### D8.9 Open `UNKNOWN - verify` items this addendum adds, each with what settles it

- the 890M's LDS latency, its global-memory latency, and whether `webgpu` 0.6.2 on RADV exposes `subgroups`: SP5-style
  device probes, only after OQ-5;
- a persistent WGSL kernel's progress and the amdgpu job timeout: a RADV test, only after OQ-5. Not proposed;
- whether the Vitis AI EP places MaxPool on the NPU: its operator-support list and a placement report, after OQ-5;
- XDNA tile programmability outside fixed graphs: AMD's AIE-ML architecture manual. Moot from Node.js;
- the worth of lazy evaluation: the mobility share in a `chooseMove` profile at `main` (D8.7).

## Alternatives

- **Pursue the iGPU now, with the host change.** Rejected for now. It buys access, not speed: alpha-beta asks for one
  leaf at a time, and one round trip is worth 28–59 nodes.
- **Pursue the NPU now.** Rejected. Four changes before a first test, a Python-only documented API, a documented-for-
  24.04 stack on a 26.04 host, and a public report of wrong outputs on Linux.
- **An Lc0-style engine.** Rejected inside `EPIC-011`: a different engine, and the neural non-goal.
- **Threads now, before phase 1.** Rejected. The table it shares is about to change four times in phase 1 (T1–T4).
  Building the shared form first would mean writing it twice.
- **Several games at once** for faster reads. Ruled out by Q-3K-3 under either reading.
- **A native addon for zero-copy device memory.** Rejected: a C++ build in the product for a gain nobody can name.
- **Measure Elo per thread here with games.** Not proposed. `ABC-263` plays no games. The threads ticket's own N-vs-1
  read at 100 ms would be the first reading.

## Consequences

- **If accepted as proposed:** no code moves now. On OQ-1 yes, BA/PM cuts about three tickets after phase 1 (shared
  table, worker pool with `Threads`, lanes). The default product stays `Threads 1` until the owner says otherwise.
- **The routine reads do not change** under OQ-2 (a). Each phase's reading stays comparable with every earlier one.
- **If nothing is decided:** today's single thread stays, and 11 of 12 cores stay idle in play. The cost is D2.5's
  estimate, not a reading.
- **Open `UNKNOWN - verify` items, each with what settles it** *(corrected 2026-11-01: the settle column is new;
  the last six items were open in the text, not listed here)*:
  - **this engine's Elo per doubling of time, at 100 ms and at 40/15.** Settled by a time-odds read: 2× time against
    1× time, in the 100 / 400 harness at 100 ms, and at 40/15 if the owner wants that column. Not proposed now. The
    threads ticket's N-vs-1 read gives η × E_d together;
  - **η for skytalix's Lazy SMP.** Settled only by the threads ticket's own N-vs-1 read;
  - **the WebGPU round trip on the real 890M.** Settled by re-running SP5 on RADV after OQ-5;
  - **whether Ryzen AI's Linux stack installs on Ubuntu 26.04.1, and whether ORT's Node binding builds with the Vitis
    AI EP.** Settled by the install and a quicktest after OQ-5 (D1.1);
  - **whether `onnxruntime-node` 1.31.1 ships a Vitis AI EP.** Settled by reading the 1.31.1 tarball (D1.1);
  - **ROCm support for gfx1150 on Ubuntu 26.04.1.** Settled by a ROCm compatibility page that lists 26.04, or by an
    install after OQ-5;
  - **ROCm / OpenCL coherent host-memory access on gfx1150, and the native round trip.** Settled only by a native addon
    test after OQ-5. Not proposed (D3);
  - **today's evaluation share of node time.** Settled by summing the evaluation functions' self time in a
    `chooseMove` profile at `main` (§ Context);
  - **the Elo of workloads (b) and (e).** Not settled while those strands are parked or out of scope (D1.2);
  - **the cause of the 24-worker loss in one process.** Settled by an SP1 re-run with V8's background threads capped.
    Owed only above 12 workers (D2.4);
  - **worker start-up cost in the default lane (`NFR-008`).** Settled by the lanes ticket's before-and-after wall (D4);
  - **the cost of the table's key split, and whether `ABC-081`'s, `ABC-122`'s and `ABC-208`'s rows pass unedited.**
    Settled by the shared-table ticket's `Threads 1` profile and its test run (D2.3).

## Rollback

- **This ADR:** records only. Revert the commit that adds it.
- **A threads build, if one is ever made:** `Threads 1` is the default and node-for-node equal to today (D4), so
  setting it back to 1 restores today's play. Removing the code is one revert per ticket, with the door test proving
  the revert clean.
- **The host change, if made:** removing `olger` from `render` undoes it.

## Sources (web, read 2026-11-01)

- Ryzen AI Software 1.9, Linux: https://ryzenai.docs.amd.com/en/latest/linux.html
- Vitis AI EP wrong outputs on Linux (report): https://github.com/amd/RyzenAI-SW/issues/369
- `amdxdna` in Linux 6.14 and the user space it needs: https://www.phoronix.com/news/Linux-6.14-DRM-Feature-Pull;
  https://github.com/amd/xdna-driver; https://xilinx.github.io/mlir-aie/buildHostLinNonUbuntu.html
- ROCm 7.10 release notes (gfx1150, Ubuntu 24.04.3): https://rocm.docs.amd.com/en/7.10.0-preview/about/release-notes.html
- gfx1150 community PyTorch build: https://gh.r-mj.com/Peterc3-dev/pytorch-gfx1150
- ONNX Runtime execution providers: https://onnxruntime.ai/docs/execution-providers/; `onnxruntime-node` README (1.23.2
  mirror): https://sources.debian.org/src/onnxruntime/1.23.2%2Bdfsg-6/js/node/README.md
- Dawn Node bindings: https://dawn.googlesource.com/dawn/+/refs/heads/main/src/dawn/node/README.md; package
  https://github.com/dawn-gpu/node-webgpu
- WebGPU `unmap` detaches mapped ranges: https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/unmap
- Mesa rusticl: https://docs.mesa3d.org/rusticl.html
- Vulkan `VK_EXT_external_memory_host`: https://docs.vulkan.org/refpages/latest/refpages/source/VK_EXT_external_memory_host.html
- Node.js `worker_threads`: https://nodejs.org/api/worker_threads.html
- Lazy SMP and Stockfish 7's switch from YBW: https://www.chessprogramming.org/Lazy_SMP
- Lockless hashing (Hyatt, Mann; Nelson's XOR): https://www.chessprogramming.org/Shared_Hash_Table
- ECMA-262 `IsNoTearConfiguration` (§ 25.1.2.8): https://read262.netlify.app/structured-data/arraybuffer-objects
- Stockfish wiki, "Useful data" (thread scaling): https://github.com/official-stockfish/Stockfish/wiki/Useful-data
- Lazy SMP Elo (TalkChess): https://talkchess.com/viewtopic.php?p=502581; https://talkchess.com/viewtopic.php?p=860586
- Lazy SMP efficiency, Stockfish 8 (TalkChess): https://talkchess.com/viewtopic.php?p=714114
- Stockfish 12 over 11: https://stockfishchess.org/blog/2020/stockfish-12/;
  https://chess.com/news/view/stockfish-12-released-130-elo-points-stronger; FGRL https://talkchess.com/viewtopic.php?p=861463
- Cwtch (NNUE in JavaScript): https://talkchess.com/viewtopic.php?p=966009; Lozza: https://github.com/op12no2/lozza
- XRT per-call overhead on XDNA (papers): https://arxiv.org/pdf/2509.06794; https://www.csl.cornell.edu/~zhiruz/pdfs/vla2npu-fccm2026.pdf

*Added 2026-11-02 (`arch-accel-review`), read 2026-11-02, for D8:*

- WGSL, § 11.4 ("Recursion is disallowed because cycles are not permitted among any kinds of declarations") and
  § 17.12 (subgroup built-ins): https://www.w3.org/TR/WGSL/
- WGSL atomic types, `i32` or `u32` only: https://google.github.io/tour-of-wgsl/types/atomics/atomic-types
- WebGPU, no barrier sync across workgroups; workgroups execute independently: https://github.com/gpuweb/gpuweb/discussions/3935
- ROCm GPU specs (Radeon 890M, gfx1150: 16 CUs, wave 32 or 64, LDS 128 KiB, L2 2 MiB): https://rocm.docs.amd.com/en/latest/reference/gpu-arch-specs.html
- Ryzen AI 9 HX 370, XDNA 2 at 50 TOPS: https://www.notebookcheck.net/AMD-Ryzen-AI-9-HX-370-Processor-Benchmarks-and-Specs.836729.0.html
- GPU chess engines (Zeta, papers, Lc0): https://www.chessprogramming.org/GPU
- Lazy evaluation: https://www.chessprogramming.org/Lazy_Evaluation
- Stockfish NNUE, the 2020 hybrid evaluation: https://chessprogramming.org/Stockfish_NNUE
- The analysis checked (owner-supplied, not a source of fact): `memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md`
