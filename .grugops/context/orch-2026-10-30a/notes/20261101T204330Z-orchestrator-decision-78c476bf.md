---
id: 20261101T204330Z-orchestrator-decision-78c476bf
kind: decision
by: orchestrator
at: 2026-11-01T20:43:30Z
verified_by: 
confidence: high
refs:
  - EPIC-011
  - memory-bank/50-decisions/ADR-0056
  - memory-bank/50-decisions/ADR-0055
supersedes: 
seal: sha256:6c806f414721246275dce8d31dce56ff122e395e519d1825136046fd0298506b
---

OWNER word 2026-11-01 (verbatim): "yeah make spike ticket for Architect in Epic 011 to investigate if it is possible to utilize NPU and CPU, parallelize node.js on multiple threads and somehow use video memory to share search info between NPU/GpU runs so it would not go to waste."

Context: follows the Orchestrator's answers on GPU/NPU use (neural and non-neural). Action: BA/PM cuts a records-only Architect SPIKE ticket in EPIC-011 covering (1) NPU/GPU use on this host from Node.js (WebGPU/Dawn bindings, ONNX Runtime/Vitis AI EP on Linux, what INT8/INT16 work is offloadable with and without a neural net, offline Texel tuning), (2) multi-threaded search in Node.js (worker_threads, SharedArrayBuffer, Atomics; Lazy SMP / shared TT; expected Elo per thread), (3) sharing search info (TT/history) across CPU workers and GPU/NPU work via shared or device memory, incl. latency/coherence limits of video memory on an APU (UMA). Must state the interaction with the owner's standing rules (tests on one core; 100/400 at 100 ms; classical path ADR-0056) — the spike recommends, it does not change them. No code, no runs > a few minutes; any experiment > 1 h asked first.
