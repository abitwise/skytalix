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

## Result
- **`ABC-263` cut: SPIKE, NPU, iGPU and CPU threads from Node.js on this host, and search info shared between them.**
  Records only; role Architect/Design; `EPIC-011` tickets row 15. **Size M, P2. DoR 10/10**, Backlog; the Ready move
  is the Orchestrator's.
  - **The four questions:** Q1 accelerators, with and without a net; Q2 threads (Lazy SMP, shared lockless TT, Elo per
    doubling); Q3 shared or device memory on the APU; Q4 the owner's rules.
  - **Deliverable:** one proposed ADR or one sealed analysis note, ending in a recommendation.
  - **Acceptance A1–A8:**
    - A2: a fixed verdict set, and no empty field;
    - A3: four named runtimes and five named workloads; device dispatch µs set beside the per-node time;
    - A4: scaling at 1/2/4/8/12 workers;
    - A6: a named rule list, each rule with its owner and a fair comparison;
    - A7: a recommendation per strand, and owner questions;
    - A8: the diff fence, ≤ 5 min a run under the lock, no sudo, > 1 h asked first.
  - **Where it sits:** outside phases 0–5, any time; no phase waits on it. Its follow-ups need the owner to open scope
    (`EPIC-011` § Out of scope: threads, neural).
  - **For the Orchestrator at pull:** test note 4. BA/PM reads a ≤ 5 min multi-core scaling prototype as not a
    validation game, so Q-3K-3's "one core" does not bind it, and it runs ALONE under the lock. Confirm, or rule it out;
    if ruled out, A4's figures are estimates. Also "a few minutes" is read as ≤ 5 min; you may correct it.
- **`ABC-251` page closed:** `status: dropped`, `column: Done`, with a dated block: "nothing to cut" (`…1f6ed15a`;
  `se-ABC-251` `…4342e5b5`). Not a graded miss; no failed-attempt owed. `EPIC-010` row 26 matches.
- **`ABC-262` page:** A4 struck and marked WAIVED (Orchestrator), with a dated block citing `qe-ABC-262` `…ed4d02a5`,
  `…918ca02e` and `…064f5f07`. That closes QE-262-b. `EPIC-011` row 14 is Done (`2cf2bb69`).
- **Flag, not fixed (outside the fence):** the front matter of `ABC-249`, `254`, `259`, `260`, `261` and `262` still
  reads `backlog`/`ready`, though the board has them Done. `EPIC-010` § milestone 1b row 2 (line ≈ 879) for `ABC-251`
  was not edited: the brief allowed row 26 only.
- **Commits:** claim `cc55ce93`; records `424e0087`; notes `89b3997a`. This Result and the move to done/ are in the
  last commit.
- **Notes** (sealed; contextRoot = this worktree's `.grugops/context`; `at` 2026-11-01T20:48:04Z from `date -u`):
  decision `20261101T204804Z-ba-pm-decision-79d9e9a4`, observation `20261101T204804Z-ba-pm-observation-dbc33579`.
- **Trace rows** appended to `plans/traceability.md`: `ABC-263`, `ABC-251`, `ABC-262` and `bapm-spike-accel`.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, the ADRs. Nothing was run, built, timed,
  pushed or merged.
