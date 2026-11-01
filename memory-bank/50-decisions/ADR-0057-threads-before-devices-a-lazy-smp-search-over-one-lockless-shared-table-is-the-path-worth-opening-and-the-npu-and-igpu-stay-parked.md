---
kind: adr
id: ADR-0057
---
# ADR-0057: Threads before devices. A Lazy SMP search over one lockless `SharedArrayBuffer` table is the one path on this host worth opening. The NPU and the iGPU stay parked, and a table shared with a device is dropped

## Status

**PROPOSED** 2026-11-01. Spike `ABC-263`, records only. Written by Architect/Design (task `arch-ABC-263`), on branch
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

- **Per node:** 1.1–1.6 µs, from 0.63–0.90 M nodes/s (`ADR-0055` § Speed readings, `qe-ABC-240`). P1 below reads
  0.87–0.89 M nodes/s for one worker at 2 s on kiwipete and position-6, inside that band.
- **Shape:** one thread, synchronous, alpha-beta with PVS, LMR, null move, quiescence and a 4 MiB TT cleared per search
  (`ADR-0025`, `src/transposition.ts`). The TT is three typed arrays: a `BigUint64Array` of keys, a `Uint32Array` of
  packed words and an `Int32Array` of scores, 2^18 slots, 16 bytes a slot.
- **Keys:** 64-bit `bigint`. `ABC-253` (two 32-bit halves, `ADR-0055` O1-a) is in flight on `grugops/ABC-253` and not
  merged at `44c99531`. This ADR reads today's `main` layout.
- **Evaluation share:** about 27–33 % of self time on the only profile on record (`se-ABC-227`), so about
  0.3–0.5 µs a node. Today's share is `UNKNOWN - verify` (`ADR-0055` § Where a node's time goes).

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
| P1-smoke | `scale.mjs`: 1 and 2 workers, 300 ms | 20:54:39–20:54:41 | 2 s |
| P1 | `scale.mjs`: real `chooseMove` in 1, 2, 4, 6, 8, 12, 16, 24 `worker_threads` workers, 2 s each, kiwipete and position-6, two repetitions | 20:54:48–20:56:04 | 76 s |
| P1b | `procs.sh` + `single.mjs`: the same search as separate processes, pinned by `taskset` (one fast core, one slow core, SMT pairs, 4 fast, 8 slow, 12 physical) and OS-placed (12, 16, 24) | ≈ 22:18:03–22:18:30 (start inferred: queued 20:56:24 behind another hop's read, whose last write was 22:18:02) | ≈ 27 s |
| P2 | `tt.mjs`: the D2.3 table in a `SharedArrayBuffer`, plain and `Atomics` accesses, 1–16 threads, and a torn-entry stress | 22:18:30–22:18:42 | 12 s |
| P3 | `latency.mjs`: microtask, `setImmediate`, `postMessage`, `Atomics.wait`/`notify` and spin round trips, OS-placed and pinned to CPU pairs 2+3, 2+14, 2+6 | 22:18:42–22:18:44 | 2 s |
| P4 | `nnue.mjs`: a 768 → H × 2 → 1 net in plain JS, H = 128, 256, 512 | 22:18:44–22:19:26 | 42 s |
| P5 | `gpu.mjs`: WebGPU through `webgpu` 0.6.2, default ICD search, forced RADV, forced lavapipe | 22:19:26–22:19:28 | 2 s |
| P6 | `mem.mjs`: per-worker heap and process RSS at 1, 4, 12 engine workers | 22:19:28–22:19:30 | 2 s |
| **total** | | | **≈ 165 s (2.75 min)** |

## Decision

### D1. Q1, accelerators: the NPU and the iGPU from Node.js

#### D1.1 The four runtimes (A3, runtimes)

| runtime | verdict | what it needs | evidence |
|---|---|---|---|
| **WebGPU via Dawn** (`webgpu` npm 0.6.2, Dawn's own Node binding, `dawn-gpu/node-webgpu`) | `works-after-host-change`: `olger` in `render`, new login | the binding installs from npm with no build; RADV is installed. It runs **now on lavapipe**, which is Mesa's CPU Vulkan and accelerates nothing | `measured (informal)`, P5: RADV fails with `Could not open device /dev/dri/renderD128: Permission denied` and forced RADV gives no adapter. The default search falls back to llvmpipe (lavapipe), which runs. Package: `documented`, npm registry, read 2026-11-01 |
| **ONNX Runtime + Vitis AI EP** (XDNA 2 NPU) | `UNKNOWN - verify`. At best `works-after-host-change`, with four changes (next column) | (1) `render` group. (2) XRT user space plus the `amdxdna` XRT plugin, shipped as `.deb` packages for Ubuntu 24.04; this host runs 26.04.1. (3) Ryzen AI Software 1.9 for Linux: its documented API is Python only. (4) An ONNX Runtime Node binding built from source with the Vitis AI EP: the npm `onnxruntime-node` 1.31.1 lists CPU, CUDA and TensorRT on Linux x64, not Vitis AI | `documented`: Ryzen AI 1.9 Linux page (Strix Point, Ubuntu 24.04, kernel ≥ 6.10, "NPU only flow"); `onnxruntime-node` README. One public report shows the Linux Vitis AI EP returning wrong values for many multi-output graphs (RyzenAI-SW #369). Settled by: the owner's host change, then a quicktest on this host |
| **ROCm / HIP** (890M, gfx1150) | `works-after-host-change`: ROCm user space installed, `render` group, plus a native Node addon | ROCm 7.10 lists the HX 370 (gfx1150) on Ubuntu 24.04.3 only. Support on 26.04.1 is `UNKNOWN - verify`. No maintained HIP binding for Node exists. A native N-API addon would be a C++ build inside the product, a step beyond `ADR-0044`'s rejected alternative 18 (no WASM build in the repo) | `documented`: ROCm 7.10 release notes; community gfx1150 builds note no pre-built PyTorch for the ISA |
| **OpenCL** (890M) | `works-after-host-change`: an OpenCL ICD installed (Mesa rusticl or ROCm's), `render` group, plus a Node binding | measured on this host: no ICD. Rusticl needs `RUSTICL_ENABLE` set per driver. The npm bindings `node-opencl` 0.4.5, `nooocl` and `opencl` were last modified in June 2022 | `measured` (no `/etc/OpenCL/vendors`); `documented`: Mesa rusticl page, npm registry |

#### D1.2 The five workloads (A3, workloads)

The yardstick is one search node, 1.1–1.6 µs. One device round trip is set beside it.

| workload | needs a net? | verdict | one device round trip vs one node | effort | expected effect | risks |
|---|---|---|---|---|---|---|
| **(a) NNUE-style net on the CPU** (no device) | **yes** | `works-on-this-host-now` (technically; the scope line is the owner's) | no device: H = 128: 0.59 µs a node (0.42 µs incremental update, 0.17 µs output layer). H = 256: 2.09 µs. H = 512: 4.29 µs (P4, plain JS, no SIMD) | **L**, 30–60 h: data, a trainer, TS inference with incremental accumulators, tests | `estimate`: +100 to +300 Elo at 40/15 over today's evaluation, low confidence. Basis: Stockfish 12 (NNUE) over 11 was +51 to +130 by list and by Chess.com; a small 768→128→1 net in JS was "about on par" with Lozza's ~2 700 HCE (Cwtch thread). Speed: today's evaluation is ≈ 0.3–0.5 µs a node, so H = 128 would bring the node rate to ≈ 0.8–0.95× and H = 256 to ≈ 0.4–0.5× (`estimate` from P4) | breaks `EPIC-004`'s permanent non-goal and `EPIC-011` § Out of scope; training data and labels raise Q-3K-7; evaluation stops being hand-explainable; `G4` oracles change |
| **(b) Lc0-style net on the GPU or NPU** | **yes** | `works-after-host-change` (host change plus WebGPU or ORT, see D1.1) | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) against 1.1–1.6 µs. An Lc0-style search batches hundreds of positions per dispatch to hide it | **XL**, 200 h or more: MCTS search, a large net, its training or a borrowed net, device inference | `estimate`: `UNKNOWN - verify`. No Lc0 benchmark for the 780M or 890M was found. It is a different engine, not a step for this one | replaces the engine; breaks the neural non-goal; a borrowed net raises a licence and identity question; no game instrument here reads it for months |
| **(c) batched classical evaluation on a device** | no | `works-after-host-change` | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`), so one dispatch costs 28–59 nodes. Alpha-beta asks for one leaf at a time; batching needs a search redesign | **XL**, 60–120 h: an evaluation port to WGSL, a batched frontier, a second evaluation to keep equal by test | `estimate`: below 1.0× speed (a slowdown) at every control, until a batch of thousands hides the round trip. Evaluation is about 30 % of node time, so a free device evaluation still caps at ≈ 1.4× | two evaluations to keep identical; latency dominates; device access needs the host change |
| **(d) offline Texel tuning on a device** | no | `works-after-host-change`. The CPU threads alternative is `works-on-this-host-now` | not on the search path. A tuning pass over N positions is one batch, so the round trip is amortized | **M**, 8–16 h on a device. **S**, 3–6 h with `worker_threads` on the CPU (`ABC-239`'s tool) | no Elo of its own: the tuned constants are the same either way. Wall-time speed-up of the tuning loop: `estimate` 6–7× with 12 CPU workers, from P1's node-rate scaling | none found for the CPU form. A device form adds a WGSL copy of the evaluation |
| **(e) tablebase generation on a device** | no | `not-feasible` inside scope: `EPIC-004` and `EPIC-011` keep tablebases out | not on the search path | **XL**, 80 h or more, plus probing code | `UNKNOWN - verify`: no source found for this engine's gain from tablebases | scope; storage; a probing path in the search |

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
  `postMessage` reads 3.9–6.9 µs (P3). That is a few nodes, so start-up is noise even at 100 ms (≈ 90 000 nodes a move).

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

- **Index:** `keyLo & mask`. With `ABC-253`'s halves this needs no `bigint` at all.
- **Store:** four plain writes, words 2, 3, 0, 1. No lock, no `Atomics`.
- **Probe:** read the four words. It is a hit only if `(w0 ^ w2) === keyLo` and `(w1 ^ w3) === keyHi`. This is the
  XOR check of Hyatt and Mann's lockless table, after an idea of Harry Nelson's (`documented`: chessprogramming wiki,
  "Shared Hash Table").
- **The race it accepts: torn entries.** Two workers can write one slot at once and leave words from both. The check
  then fails and the probe reads a miss. A miss costs only search effort, never correctness. A torn entry passes the
  check only if the mixed words happen to satisfy both XOR equations, about 2^-64 for unrelated payloads.
- **Measured (P2):** a stress run hammered a 1 024-slot table with 4 096 keys from 4 or 12 writers. 0.69 % (4 writers) and 2.6 % (12 writers) of probes landed on a torn slot, and every one failed the check. **Undetected corrupt hits: 0** in 97 M probes over three runs, plain and `Atomics`. Per-word `Atomics` does not make an entry atomic: torn slots appeared with it too. Plain accesses ran at 21.6 ns per probe or store on one thread over a 4 MiB table, and 44 ns per thread at 12 threads (272 M operations/s in total). Per-word `Atomics.load` and `Atomics.store` cost 2.6× more (56 ns on one thread, 126 ns at 12) and buy nothing here. At one probe and at most one store a node, the shared table costs about 40–90 ns of a 1 100–1 600 ns node at 12 workers.
- **Every hit is still treated as a hint.** The hash move is checked for legality before use, as today. A score from a
  false hit is the same risk class as today's 64-bit key collision.

#### D2.4 Node-rate scaling (A4)

P1 ran N independent real-engine searches as `worker_threads` workers, 2 s each, after a 300 ms warm-up. Each worker
had its own 4 MiB table, so this is the **node-rate ceiling** for Lazy SMP. A shared table adds some memory traffic,
which P2 bounds. Two positions, two repetitions each. Factor = total nodes/s over one worker's nodes/s in the same run.

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

- **The fast/slow split, read from the pinned runs (P1b):** one search pinned to a fast core (CPU 2) read 0.858 M nodes/s, and pinned to a slow core (CPU 6) 0.524 M. **A slow core is 0.61 of a fast one.** Four processes on CPUs 0–3 read 3.21 M (3.74× one fast core). Eight on CPUs 4–11 read 4.29 M (5.0 fast-core equivalents). Twelve, one per physical core, read 6.54 M (7.62×); twelve placed by the OS read 6.77 M (7.89×).
- **SMT:** two searches on the SMT siblings of one fast core (CPUs 2 and 14) read 1.00 M in total, 1.17× one core. On two fast cores (2 and 3) they read 1.67 M, 1.94×. Slow siblings (6 and 18) gave 1.24×. As separate processes, 16 and 24 searches still gained a little (6.97 M and 7.35 M, 8.1× and 8.6×). As `worker_threads` in one process they lost (24 workers: 2.9–5.2 M). So the loss belongs to the single process, not to the cores. Its cause is `UNKNOWN - verify`; V8's shared platform threads for GC are the first suspect. In one process the 24-worker row falls below the 12-worker row, so a worker pool uses physical cores only.
- **The shape:** near-linear to 4 workers (the four Zen 5 cores), then each Zen 5c core adds about 0.61 of a
  fast one. The curve flattens past 12. **Recommended maximum: 12 workers**, one per physical core, and 8 if the owner
  wants the host left room for other work.
- **Memory (P6):** each worker isolate held 12.6–14.6 MiB of V8 heap in use (19.5–20 MiB allocated) and 4.5 MiB of `arrayBuffers`, 4 MiB of it its private table in this prototype. Process RSS grew 34–63 MiB per worker, to 454 MiB at 12 workers.

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

| step | node-rate factor (P1, `measured (informal)`) | Elo at 100 ms (`estimate`) | Elo at 40/15 (`estimate`) |
|---|---|---|---|
| 1 → 2 workers | 1.79–1.91 | +35 to +100 | +20 to +50 |
| 2 → 4 workers (all four fast cores) | ×1.72–1.99 more | +30 to +110 | +20 to +55 |
| 4 → 8 workers (adds four slow cores) | ×1.53–1.81 more | +20 to +90 | +10 to +45 |
| 8 → 12 workers (all slow cores; not a doubling) | ×1.21–1.25 more | +10 to +35 | +5 to +17 |
| 12 → 24 (SMT siblings) | ×0.45–0.87 in one process (P1); ≈ ×1.09 as separate processes (P1b) | a loss | a loss |
| **1 → 12, total** | **6.72–7.51** | **+100 to +300** | **+55 to +150** |

- **Confidence: low.** η and E_d are both unmeasured here. The 100 ms column is the less useful one: the owner's
  routine reads stay single-threaded (D4).
- **Beside the 3 000 goal:** `ADR-0056` D3 lands the classical path at ≈ 2 550–2 800 (central). +55 to +150 at 40/15
  is the size of a whole `EPIC-011` phase, for about three tickets of work (L).

**Q2 summary (A2 shape).**

- **Verdict:** `works-on-this-host-now`. `worker_threads`, `SharedArrayBuffer` and `Atomics` run in Node v26.12.1 here,
  with no flag and no install (`measured`, P1–P3).
- **Effort:** **L, 30–60 h** across three tickets: the shared table (`ADR-0025` amendment), the worker pool with the
  stop slot and a UCI `Threads` option (`ADR-0044` D5 amendment), and the tests and lanes (D4, the `G4` and `NFR-008` rows).
- **Expected effect:** node rate 6.7–7.5× at 12 workers (`measured (informal)`, P1). +55 to +150 Elo at 40/15 and +100
  to +300 at 100 ms (`estimate`, D2.5).
- **Risks:** non-determinism above one worker; `NFR-009`'s 16 MiB with per-worker heaps (P6); test lanes that spawn
  workers inside vitest's 2-worker cap; a heterogeneous core mix that the OS places, so readings move with load; the
  owner's one-core rule.
- **Evidence:** P1, P1b, P2, P3, P6 `measured (informal)`; the spec and Node `documented`; Elo `estimate` with sources.

### D3. Q3, sharing search information between CPU threads and device work

**The APU fact first.** The 890M has no memory of its own. Its "VRAM" is a 1 GiB carve-out of the same LPDDR5X DRAM
the CPU uses (`measured`, `mem_info_vram_total`). So "use video memory so it would not go to waste" names the same
DRAM the CPU table already sits in. Nothing about the DRAM is wasted today. What goes to waste is the second and
later cores, and a shared CPU table is how they stop wasting each other's work.

| runtime that passed A3 | `SharedArrayBuffer` visible to the device without a copy, from Node.js? | one round trip vs one node | (i) table shared by CPU workers only | (ii) TT or history shared by CPU workers and device kernels |
|---|---|---|---|---|
| **CPU `worker_threads`** (not a device; the baseline) | yes: it is the same memory | a cache-line hand-off of 0.09–0.10 µs inside one L3, 0.37 µs across the two (P3) against 1.1–1.6 µs | `works-on-this-host-now` (P1, P2) | — |
| **WebGPU via Dawn** | **no.** `GPUQueue.writeBuffer` accepts a `SharedArrayBuffer` view but copies it. `getMappedRange` returns a plain `ArrayBuffer`, detached at `unmap`. No call imports host memory as a `GPUBuffer` (`documented`: the WebGPU IDL in `@webgpu/types` as shipped with `webgpu` 0.6.2; MDN `unmap`) | 45–65 µs (p50, lavapipe; the 890M itself `UNKNOWN - verify`) | `works-on-this-host-now` (CPU side only) | `not-feasible` from Node.js: no shared mapping, and a round trip costs 28–59 nodes |
| **ONNX Runtime + Vitis AI EP** | `UNKNOWN - verify`; expected no: tensors are built from typed arrays and handed to the EP. Settled by the host change and an ORT build with the EP | `UNKNOWN - verify`. No published XRT dispatch figure was found; papers name XRT's per-call overhead as the main cost of small NPU work | `works-on-this-host-now` (CPU side only) | `not-feasible`: an NPU runs a fixed graph and cannot probe or store a table during a search |
| **ROCm / HIP, OpenCL** (not reachable from Node without a native addon) | not from Node.js. A native addon could register host memory (HIP host registration, OpenCL `CL_MEM_USE_HOST_PTR`, Vulkan `VK_EXT_external_memory_host`); whether that gives coherent fine-grained access on gfx1150 is `UNKNOWN - verify` | `UNKNOWN - verify` | `works-on-this-host-now` (CPU side only) | `works-after-host-change` in principle (ROCm or an ICD, `render`, a native addon); worthless in practice, because no device kernel runs an alpha-beta search to fill or read the table |

**Coherence and transfer on the APU.** CPU caches are coherent across both L3s, at a cost P3 measured: a spin hand-off of one shared slot takes 0.086 µs between two fast cores, 0.099 µs between SMT siblings and 0.369 µs between a fast and a slow core, across the two L3s. An entry that bounces between the clusters costs about 4× more and stays far under one node. A
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
| **The classical path** (`ADR-0056`) and **`EPIC-011` § Out of scope: threads** | "Threads, pondering: no, single-threaded by decision" | Lazy SMP is classical (no net), so `ADR-0056` stands. The out-of-scope line has to be lifted | — | **owner** | — |
| **`EPIC-011` § Out of scope: neural** and **`EPIC-004`'s permanent non-goal** ("Neural network evaluation, NNUE, or any learned component") | out | — | workloads (a) and (b) need it lifted. (c), (d), (e) do not | **owner** | an NNUE build against the tuned classical build, same threads, same control |
| **`ADR-0044` D5**, one thread, no worker | accepted, with a pre-designed worker upgrade | amended: the search moves to workers; the stop flag becomes the D5 `SharedArrayBuffer` slot. Side gain: `isready` and `stop` answer during a search, inside `AR-UCI-BUSY`'s bound | — | owner accepts (a reversed decision); Architect writes it | UCI session lanes unchanged at `Threads 1` |
| **The 40/15 claim** (`ADR-0056` C1) and **the smoke S′**, both against Stockfish 19 `UCI_LimitStrength`, `Threads 1`, `Hash 16` | skytalix single-threaded | the claim needs a stated thread count. Stockfish's limited play is pinned by depth (`ADR-0056` C1), so its thread count does not move its strength. The question is what skytalix may use | — | **owner** | rating lists keep 1-CPU and 4-CPU lists apart (CCRL). Fair: claim "3 000 at 40/15, 1 CPU" or "… N CPU", never unlabelled. S′ stays at `Threads 1` |
| **`G4`, the node-for-node door** (`ADR-0026`) and **determinism in the default lane** | one thread, so node counts are exact and repeatable | Lazy SMP above one worker is not deterministic: thread timing changes the table. **Proposed:** `Threads 1` stays node-for-node equal to today, by a door test, so every existing oracle holds. Multi-worker play is tested by properties: a legal move, a bounded time, no thrown error, a table that never yields a corrupt hit. Not by node counts | a device evaluation needs its own identity oracle against the CPU evaluation | Architect (test method, within `ADR-0026`) | `Threads 1` vs today: identical. `Threads N`: properties only |
| **`NFR-008`**, default test lane ≤ 10 s | met (9.25 s at `ABC-244`) | each worker's start-up and module import cost wall time (not timed alone here, `UNKNOWN - verify`); vitest already runs 2 workers (`ADR-0040` addendum 2). Multi-worker tests go to a deep lane; the default lane holds one small 2-worker property row at most | a device lane can never sit in the default lane (no access) | Architect proposes; Security/NFR checks | the default lane's wall before and after |
| **`NFR-009`**, search-held memory ≤ 16 MiB | one 4 MiB table | the shared table counts once. `NFR-009`'s instrument reads retained `arrayBuffers` and heap growth (≤ 16 MiB, growth ≤ 1 MiB). A shared-table build would read ≈ 4 MiB once plus ≈ 0.5 MiB per worker, about 10 MiB at 12 (`estimate` from P6). Each isolate's baseline heap, 12.6–14.6 MiB, is outside those fields today. Counted, 12 workers would pass even the 128 MiB ceiling. Which reading holds is OQ-4 | a device copy of a table would count | **owner** (the bound) | `process.memoryUsage()` summed over the workers, as `NFR-009` reads it today |

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
| **Threads** (Q2) | **`pursue after EPIC-011 phase 1`** | the largest measured lever on the list: 6.7–7.5× node rate, an estimated +55 to +150 at 40/15, at L cost, with no install. After phase 1, because Lazy SMP lives on the TT, and phase 1 (T1–T4, `ABC-238`, `ABC-237`, `ABC-257`, `ABC-258`) settles the table's replacement, lifetime and size. `ABC-253`'s 32-bit halves are the key layout the shared table wants | — |
| **Shared memory** (Q3) | **`drop`** for a table shared with a device. The CPU-only shared table is **not dropped**: it is the threads strand's table (D2.3) | on this APU "video memory" is the same DRAM; Node.js has no zero-copy path to a device; no device kernel runs a search to fill a table. The faithful form of "so it would not go to waste" is the CPU-shared table | — |

**Order, if the owner says yes to threads:** after `EPIC-011` phase 1, before phase 5's W1 and the first 40/15 reading.
That way the claim can be read both ways (OQ-3). The per-change reads of phases 2–5 stay at `Threads 1` (D4), so
threads do not muddy any phase's own reading.

### D7. Questions for the owner (yes/no or a choice)

- **OQ-1, threads in scope.** Lift `EPIC-011` § Out of scope's "Threads" line, so BA/PM can cut a Lazy SMP ticket
  after phase 1? **yes / no.** Recommended: yes.
- **OQ-2, the reading of "Keep game on one core."** (a) one game at a time; the engine may think on several cores
  inside it. (b) a single-threaded engine. **a / b.** Under (a), every 100 / 400 read stays at `Threads 1`
  (recommended). Under (b), the threads strand is dropped.
- **OQ-3, the 40/15 claim.** Which counts as "3 000"? (a) `Threads 1` only, as today. (b) `Threads N`, labelled
  "N CPU". (c) both read and reported separately. **a / b / c.** Recommended: c, reading `Threads 1` first.
- **OQ-4, memory.** For a threads build, does `NFR-009` count each worker's own V8 baseline heap (12.6–14.6 MiB each,
  P6)? **(a) no:** it reads retained growth as its instrument does today, ≈ 10 MiB at 12 workers, inside 16 MiB.
  **(b) yes:** then 12 workers pass even the 128 MiB ceiling, and a threads build caps at about 8 workers on a
  re-level. **a / b.** Recommended: a. Asked only if OQ-1 is yes.
- **OQ-5, the host change.** Add `olger` to the `render` group, so a later hop can measure the iGPU and the NPU?
  **yes / no.** Recommended: no for now; it only serves the parked strand.
- **OQ-6, a neural net on the CPU.** Re-open `EPIC-004`'s neural non-goal for an NNUE-style evaluation in TypeScript
  on the CPU (workload a, no device)? **yes / no / later** (later = on the same trigger as V4: the curve flattens below
  3 000 after phase 5). Recommended: later.

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
- **Open `UNKNOWN - verify` items:**
  - this engine's Elo per doubling of time, at 100 ms and at 40/15;
  - η for skytalix's Lazy SMP, which only the threads ticket's own N-vs-1 read can give;
  - the WebGPU round trip on the real 890M (needs OQ-5);
  - whether Ryzen AI's Linux stack installs on Ubuntu 26.04.1, and whether ORT's Node binding builds with the Vitis AI EP;
  - ROCm support for gfx1150 on Ubuntu 26.04.1;
  - today's evaluation share of node time.

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
