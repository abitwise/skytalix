---
id: 20261101T222225Z-architect-design-decision-b92cf5cd
kind: decision
by: architect-design
at: 2026-11-01T22:22:25Z
verified_by: 
confidence: medium on the verdicts and the measured host facts; low on every Elo figure (estimates, sources in ADR-0057)
refs:
  - ABC-263
  - ADR-0057
  - EPIC-011
  - EPIC-004
  - ADR-0055
  - ADR-0056
  - ADR-0044
  - ADR-0025
  - ADR-0026
  - NFR-008
  - NFR-009
  - Q-3K-3
  - arch-ABC-263
  - grugops/arch-ABC-263
  - orch-2026-10-30a/20261101T204330Z-orchestrator-decision-78c476bf
supersedes: 
seal: sha256:14cea4f4c2484154105b0d48433df677ea3d4f00a5544c3e7c95e33b8e5479da
---

# ABC-263 spike: recommendation per strand (deliverable: ADR-0057, PROPOSED)

Deliverable: `memory-bank/50-decisions/ADR-0057-threads-before-devices-a-lazy-smp-search-over-one-lockless-shared-table-is-the-path-worth-opening-and-the-npu-and-igpu-stay-parked.md`, Status PROPOSED, spike `ABC-263`, records only. It changes no rule, NFR bound, scope line or other ADR.

## Verdicts (A2 shape in the ADR, D1–D4)
- **Q1 accelerators:** NPU (ONNX Runtime + Vitis AI EP) `UNKNOWN - verify`; iGPU (WebGPU via Dawn, ROCm, OpenCL) `works-after-host-change`. Measured: `olger` cannot open `/dev/dri/renderD128`, `/dev/accel/accel0` or `/dev/kfd` (Permission denied; seat ACL is `lightdm`'s; not in `render`). Smallest change: `olger` in `render` (sudo, owner's call). One WebGPU round trip from Node.js read 45–65 µs p50 on lavapipe (890M itself UNKNOWN - verify) = 28–59 search nodes.
- **Q2 threads:** `works-on-this-host-now`. Lazy SMP over one lockless `SharedArrayBuffer` table (4 × Uint32 per entry, Hyatt/Mann XOR check; BigUint64 plain accesses may tear by ECMA-262, Uint32 do not). Node-rate factor (independent workers, informal) 1.8–1.9× at 2, 3.3–3.6× at 4, 5.6–6.0× at 8, 6.7–7.5× at 12; worse at 24 in one process. Effort L, 30–60 h. Elo estimate 1 → 12 workers: +55 to +150 at 40/15, +100 to +300 at 100 ms (low confidence; sources in the ADR).
- **Q3 shared memory:** (i) CPU workers only `works-on-this-host-now`; (ii) with device kernels `not-feasible` from Node.js (no zero-copy path; the 890M's VRAM is a 1 GiB carve-out of the same DRAM).
- **Q4 rules:** `UNKNOWN - verify` until the owner answers OQ-1..OQ-3. Proposed: every 100/400 read stays at `Threads 1`; `Threads 1` stays node-for-node equal to today (`G4`); 40/15 claim labelled by thread count.

## Recommendation (A7)
- **Accelerator: `park`.** Re-open trigger: the owner lifts `EPIC-004`'s neural non-goal and chooses an Lc0-style direction, OR a measured WebGPU round trip on the 890M from Node.js is ≤ 10 µs.
- **Threads: `pursue after EPIC-011 phase 1`** (T1–T4 settle the table the workers share; `ABC-253`'s 32-bit halves are the wanted key layout).
- **Shared memory: `drop`** for a table shared with a device. The CPU-only shared table rides with the threads strand.

## Owner questions (ADR-0057 D7)
OQ-1 lift EPIC-011's "Threads" out-of-scope line (yes/no; rec. yes). OQ-2 "Keep game on one core" = (a) one game at a time or (b) single-threaded engine (rec. a). OQ-3 the 40/15 claim counts (a) Threads 1, (b) Threads N labelled, (c) both (rec. c). OQ-4 NFR-009 counts each worker's V8 baseline heap? (a) no / (b) yes (rec. a). OQ-5 add `olger` to `render` (rec. no for now). OQ-6 re-open the neural non-goal for a CPU NNUE: yes / no / later (rec. later).

## Scope and Risks
Scope: records only; one new ADR, these notes, the brief's Result, one trace row. No `src/`, `tools/`, `data/`, package or config file. Risks: every Elo figure is an estimate (η and Elo-per-doubling unmeasured on this engine); prototype figures are informal, never a grade; device verdicts rest on documentation where access was denied.
