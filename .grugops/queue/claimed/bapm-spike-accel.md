---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:41:51Z
subtask: bapm-spike-accel
role: ba-pm
ref: .grugops/context/bapm-spike-accel/
branch: new grugops/bapm-spike-accel from main (worktree .claude/worktrees/bapm-spike-accel)
width: records only, beside se-ABC-253.
---
# BA/PM: cut the owner's accelerator/multi-thread SPIKE ticket into EPIC-011 (+ two small closes)
## Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T204330Z-orchestrator-decision-78c476bf.md
## Do
1. Cut one SPIKE ticket (next free ABC id), EPIC-011, role Architect/Design, records-only deliverable (an ADR-draft or analysis note with a recommendation), size M, priority P2, DoR honest. Questions it must answer, each with a feasibility verdict, effort, expected Elo/speed effect and risks:
   - Q1 NPU/GPU from Node.js on this host (Ryzen AI 9 HX 370: XDNA 2 NPU, Radeon 890M iGPU, Linux): which runtimes actually work (WebGPU via Dawn/node bindings, ONNX Runtime + Vitis AI EP, ROCm/OpenCL), and what work can be offloaded — with a neural net (NNUE-on-CPU vs Lc0-style GPU) and without one (batched evaluation, offline Texel tuning, tablebase generation).
   - Q2 Multi-threaded search in Node.js: worker_threads + SharedArrayBuffer + Atomics; Lazy SMP with a shared lockless TT; expected scaling and Elo per doubling of threads on 4 fast + 8 slow cores.
   - Q3 Sharing search info between CPU threads and GPU/NPU work via shared/video memory "so it would not go to waste": on an APU (unified memory) what latency/coherence/transfer costs apply; whether a shared TT or history table across CPU workers and device kernels is feasible.
   - Q4 Interaction with standing owner rules: tests on one core, 100/400 at 100 ms, classical path (ADR-0056), the 40/15 claim vs Stockfish Threads=1 — what would have to change and what fair comparison looks like. The spike recommends; it changes no rule.
   - Constraints: no production code; prototypes only as throwaway scratch measured ≤ a few minutes each under the host lock; any experiment > 1 h asked of the owner first.
2. EPIC-011: add the ticket row and say where it sits (independent of the classical phases; may run any time as records-only).
3. Small closes: ABC-251 page → dropped "nothing to cut" per .grugops/context/orch-2026-10-30a/notes/20261101T204013Z-orchestrator-decision-1f6ed15a.md (convention as ABC-256/250); ABC-262 page → A4 marked waived (QE-262-b; qe-ABC-262 notes on main).
## Fences
plans/tickets/ (new + ABC-251, ABC-262), plans/epics/EPIC-011* (rows only), plans/epics/EPIC-010* (ABC-251 row only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-spike-accel, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.
