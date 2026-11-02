---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:18:03Z
subtask: arch-accel-review
role: architect-design
ref: .grugops/context/arch-accel-review/
branch: new grugops/arch-accel-review from main (at dispatch) — worktree .claude/worktrees/arch-accel-review
width: records; any probe ≤ 5 min, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, no timing while a game read holds the host. Device nodes are denied (owner OQ-5 = no): no host change.
---
# OWNER REQUEST: review the Gemini analysis on NPU/GPU search against ADR-0057
## Read
memory-bank/analysis/using-npu-or-gpu-for-search-algorithm.md (owner-supplied, Gemini "Argon" output — treat every figure and claim as unverified until checked), ADR-0057 (ACCEPTED: threads before devices; owner OQ-5 no, OQ-6 later), its SP1–SP6 measurements, ADR-0056, EPIC-011, ABC-265/266/267.
## Do
- For each architecture in the analysis (A warp-cooperative YBWC GPU megakernel; B "shadow-bound" speculative PVS via unified RAM, CPU + NPU/iGPU; C tensorized soft-minimax on the NPU) and its starting-point advice: check the claims against our measurements (WebGPU round trip 45–65 µs vs 1.1–1.6 µs a node; Node.js/WebGPU exposes no coherent CPU–GPU shared memory or cross-device atomics; NPU reached only through ORT/Vitis; no render-group access) and against cited sources where checkable. Mark each claim verified / contradicted / UNKNOWN - verify (with what settles it).
- Verdict per idea: changes ADR-0057 (how), adds a new parked option, or adds nothing. Name any idea that can run on the CPU threads path now (e.g. a speculative bound idea transferable to Lazy SMP helpers).
- Act on it: amend ADR-0057 (dated addendum) and/or write a new ADR (PROPOSED) if warranted; if a ticket change is needed (ABC-265/266/267 or a new spike), name it precisely for BA/PM — do not edit plans/. Anything that reverses an owner answer (OQ-5, OQ-6, neural non-goal) is an owner question, stated plainly with your recommendation.
## Fences
memory-bank/ and your records only; no src/tests/plans/board; do not edit the owner's analysis file (cite it). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-accel-review, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
