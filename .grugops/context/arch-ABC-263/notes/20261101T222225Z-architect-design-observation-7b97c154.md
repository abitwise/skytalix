---
id: 20261101T222225Z-architect-design-observation-7b97c154
kind: observation
by: architect-design
at: 2026-11-01T22:22:25Z
verified_by: 
confidence: measured (informal) on this host, one session, shared host under the lock; not a grade or a reading
refs:
  - ABC-263
  - ADR-0057
  - arch-ABC-263
  - grugops/arch-ABC-263
supersedes: 
seal: sha256:ac537c2224f8264a9463db691d18654c77e72202235b2da1accd60885aab7d7d
---

# ABC-263 prototypes and host facts (measured, informal; scratch only, all under flock host-test.lock)

Host `oeselg-dev`, user `olger`, Ubuntu 26.04.1, Linux 7.0.0-42-generic, Node v26.12.1. Engine: the worktree's `src/` at `main` `44c99531`, imported read-only. Scratch removed at hop end; peak about 132 MB (`webgpu@0.6.2`, installed with `--ignore-scripts` in its own directory). No sudo, no system install. Summed host time ≈ 165 s; every run ≤ 5 min.

## Host (2026-11-01T20:51Z)
- 4 × Zen 5 (CPUs 0–3, SMT 12–15, 5.16 GHz, one L3) + 8 × Zen 5c (CPUs 4–11, SMT 16–23, 3.29 GHz, second L3); 24 logical CPUs; 29 GiB RAM.
- NPU XDNA 2: in-tree amdxdna 0.7.0, firmware npu_7.sbin loaded, `/dev/accel/accel0`. No XRT. iGPU 890M gfx1150: amdgpu, `/dev/dri/renderD128`, `/dev/kfd`; VRAM carve-out 1 024 MiB, GTT 15 088 MiB. Mesa 26.0.8 RADV + lavapipe ICDs; no OpenCL ICD; no ROCm.
- `open()` of all three device nodes: Permission denied (root:render 0660, ACL user lightdm only; olger not in render/video).

## Windows (UTC) and results
- **P1-smoke** 20:54:39–20:54:41. **P1** 20:54:48–20:56:04: N worker_threads, real `chooseMove` 2 s, kiwipete + position-6, 2 reps. Factor vs 1 worker: 2: 1.79–1.91; 4: 3.28–3.63; 6: 4.50–4.82; 8: 5.55–5.99; 12: 6.72–7.51; 16: 7.19–7.54; 24: 3.32–5.84. One worker 0.87–0.89 M nodes/s.
- **P1b** ≈ 22:18:03–22:18:30 (start inferred; queued 20:56:24 behind qe-e010c's read, last write 22:18:02): processes. Fast core (CPU 2) 0.858 M, slow core (CPU 6) 0.524 M = 0.61. SMT pair 2+14: 1.17×; 2+3: 1.94×; 6+18: 1.24×. 4 fast 3.21 M; 8 slow 4.29 M; 12 pinned 6.54 M (7.62×); 12 OS 6.77 M; 16 OS 6.97 M; 24 OS 7.35 M (8.6×). The 24-worker loss is the single process's, cause UNKNOWN - verify.
- **P2** 22:18:30–22:18:42: SAB table, 2^18 × 16 B. Plain 21.6 ns/op (1 thread), 44.2 ns/op/thread at 12 (272 Mops/s); Atomics per word 56 ns (1), 126 ns (12). Torn stress (1 024 slots, 4 096 keys): torn 0.69 % (4 writers), 2.6 % (12); undetected corrupt hits 0 in 97 M probes over 3 runs.
- **P3** 22:18:42–22:18:44: microtask 0.11 µs p50; setImmediate 0.85; postMessage round trip 3.9–6.9; Atomics.wait/notify round trip 1.7–3.9 (p99 2.1–9.6); spin hand-off 0.086 (2+3), 0.099 (2+14), 0.369 µs (2+6, across L3s).
- **P4** 22:18:44–22:19:26: 768→H×2→1 in plain JS: H 128 0.59 µs/node (update 0.42 + forward 0.17); H 256 2.09; H 512 4.29.
- **P5** 22:19:26–22:19:28: WebGPU (webgpu 0.6.2): RADV "Could not open device /dev/dri/renderD128: Permission denied", forced RADV → no adapter; default → llvmpipe. Round trip (writeBuffer → dispatch → copy → mapAsync) 64 B: p50 45–65 µs, p99 130–189, min 32–36; 256 KiB p50 98 µs.
- **P6** 22:19:28–22:19:30: per worker V8 heapUsed 12.6–14.6 MiB (heapTotal 19.5–20), arrayBuffers 4.5 MiB (incl. private 4 MiB TT); RSS +34–63 MiB per worker, 454 MiB at 12.

Labels: `measured (informal)` — never a grade or a reading (ABC-263 test note 3).
