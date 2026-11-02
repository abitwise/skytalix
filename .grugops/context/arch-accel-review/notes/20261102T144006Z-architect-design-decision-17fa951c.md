---
id: 20261102T144006Z-architect-design-decision-17fa951c
kind: decision
by: architect-design
at: 2026-11-02T14:40:06Z
verified_by: 
confidence: high on the verdicts (each tied to a measured figure, a documented source or arithmetic); the lazy-evaluation worth stays UNKNOWN - verify; owner answers OQ-5/OQ-6 untouched
refs:
  - arch-accel-review
  - grugops/arch-accel-review
  - 2ef3aadc
  - EPIC-011
  - ADR-0057
  - ADR-0056
  - ADR-0055
  - ADR-0025
  - ADR-0026
  - ADR-0044
  - ABC-263
  - ABC-265
  - ABC-266
  - ABC-267
  - ABC-236
  - memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md
  - f0a1b494
  - arch-owner-answers-1102/20261102T135100Z-architect-design-decision-a0df22b8
supersedes: 
seal: sha256:9848a6a8a9587272f595be54d846abeabcb355996f717f6c7875f65116165361
---

# ADR-0057 reviewed against the owner's Gemini NPU/GPU analysis: no decision, strand or owner answer changes; dated addendum D8 (D8.1-D8.9), status line, D6 pointer, D7 pointer (OQ-7, OQ-8), sources

Authoritative: memory-bank/50-decisions/ADR-0057-*.md § D8 on grugops/arch-accel-review.

## Verdict per idea
- A (warp-cooperative YBWC GPU megakernel): adds nothing. Second engine in WGSL; blocked by OQ-5 and by three WGSL limits no latency removes (recursion disallowed §11.4; atomics i32/u32 only; no cross-workgroup progress guarantee). NNUE-on-chip claim contradicted by arithmetic (196 608 weights = 384 KiB INT16 / 192 KiB INT8 > 128 KiB LDS listed for gfx1150). Its sound parts (lockless table, abort flag) = TH-1 table + TH-2 stop slot.
- B (shadow-bound speculative PVS, CPU + NPU/iGPU over unified RAM): adds nothing now; recorded as parked shape PK-B (CPU search on cheap eval; one CPU worker batches window leaves to the device; results into an eval cache, not the TT; read next iteration; no re-search trigger) behind OQ-5 AND OQ-6 both. Contradicted: 10-15M NPS CPU (ours 0.63-0.90M); zero-copy ring buffer from Node.js; TT injection (quiescence never probes, exact-depth hit rule); 85 % as a constant (PR-1: 40.6-83.0 %). Internally inconsistent (NPU cannot probe a table, yet writes TT and atomic flags).
- C (tensorized micro-trees on the NPU): adds nothing. Formula -max(-s) = min(s) is one ply, not two; static eval of capture/check leaves without quiescence; on our figures a slowdown (one frontier: saves 19-32 us vs a 45-65 us round trip; four batched: at most ~1.2x, and serial alpha-beta cannot hand out four frontier nodes without speculation).
- Row D (VRAM DAG MCTS) = D1.2 workload (b): adds nothing. Starting advice (mmap/pinned ring buffer, separate NPU process; raw CUDA/ROCm/Vulkan): contradicted on this host (no device access; SAB not shared across processes; no mmap without native addon).
- Re-open precision (D8.6): a <= 10 us WebGPU round trip re-opens D1.2 (c)/(d)-type work only; it does not make A buildable; B and C need the neural lift.

## CPU transfers
- Speculative narrowed bounds = aspiration windows: already ADR-0056 S1 / ABC-236.
- Uncertainty band = lazy evaluation: mobility clamped +-100 cp, so a +-100 skip is exact for the stand-pat test; at least 28.6-70.0 % of stand-pats qualify (PR-1). Worth UNKNOWN - verify (mobility self-time share). Not node-for-node: off-door pair + C2' read. Phase 4 candidate, no ticket.
- Lazy SMP helpers: nothing new.

## Tickets / owner
- ABC-265/266/267: no change. No new spike.
- BA/PM optional: one line in EPIC-011 Phase 4 "Not cut, recorded": lazy evaluation, ADR-0057 D8.7.
- OQ-7 (re-asks OQ-5): recommended no. OQ-8 (re-asks OQ-6): recommended later. Unanswered = earlier answers stand.

## Scope
ADR-0057 dated addendum only; this task's notes; queue files. No src/, tests, plans/, board; owner's analysis file not edited; ADR-0025 untouched; no Phase 2 ADR.

## Risks
- The analysis may be re-read later as evidence for device Elo; D8 marks every Elo/NPS figure in it UNKNOWN - verify with no source.
- Lazy evaluation could be mistaken for a value-identical change: it is not (fail-soft returns move).
