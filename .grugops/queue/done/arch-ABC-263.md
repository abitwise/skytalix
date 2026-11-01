---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:49:19Z
subtask: arch-ABC-263
role: architect-design
ticket: ABC-263
ref: .grugops/context/arch-ABC-263/
branch: new grugops/arch-ABC-263 from main (worktree .claude/worktrees/arch-ABC-263)
width: records + throwaway prototypes. se-ABC-253 runs tests beside you; EVERY prototype run is wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, ≤ 5 min each.
---
# Architect: ABC-263 spike — NPU / iGPU / multi-thread Node.js / shared search info
## Read
plans/tickets/ABC-263-spike-can-skytalix-use-the-npu-the-igpu-and-more-cpu-threads-from-node-js-on-this-host-and-share-search-info-between-them-records-only.md in full (Q1–Q4, A1–A8, host limits). Owner word .grugops/context/orch-2026-10-30a/notes/20261101T204330Z-orchestrator-decision-78c476bf.md. ADR-0055 (status after ABC-250/251), ADR-0056 (classical path, test rules), EPIC-011 § Out of scope.
## Orchestrator rulings
- A ≤ 5 min multi-core scaling prototype is not a validation game; the one-core rule binds games. Run it under the lock (it then has the host to itself from this session's side).
- "A few minutes" = ≤ 5 min per run. No sudo, no system installs (user-level npm in scratch is fine), scratch ≤ 2 GB — the /tmp quota is tight; delete your scratch when done.
- Anything estimated > 1 h → STOP and report (owner ask).
## Deliver
One proposed ADR (memory-bank/50-decisions/, status PROPOSED) or one sealed analysis note, per the page, ending in one recommendation per strand plus questions for the owner. Cite sources for runtime claims (web is allowed); mark unverified claims UNKNOWN - verify.
## Fences
memory-bank/50-decisions/ (new ADR only), your notes, scratch prototypes outside the repo. No src/, tools/, data/, package files, plans/, board. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-263, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ABC-263` from `main` `44c99531`. Records only.
- **Deliverable (A1):** `memory-bank/50-decisions/ADR-0057-threads-before-devices-a-lazy-smp-search-over-one-lockless-shared-table-is-the-path-worth-opening-and-the-npu-and-igpu-stay-parked.md`,
  Status **PROPOSED**, spike `ABC-263`. It changes no rule, NFR bound, scope line or other ADR.
- **Host fact that decides Q1 (measured):** `olger` cannot open `/dev/dri/renderD128`, `/dev/accel/accel0` or `/dev/kfd`
  (Permission denied; nodes `root:render` 0660, seat ACL `lightdm` only). Every device verdict is at best
  `works-after-host-change` (`olger` in `render`, sudo, the owner's call). Cores confirmed: 4 × Zen 5 (CPUs 0–3) +
  8 × Zen 5c (CPUs 4–11), SMT 2, two L3s.
- **Verdicts:**
  - **Q1:** WebGPU via Dawn (`webgpu` 0.6.2) `works-after-host-change`, runs now on lavapipe only; ONNX Runtime +
    Vitis AI EP `UNKNOWN - verify` (four changes; Ryzen AI 1.9 Linux is Python-only, documented for Ubuntu 24.04);
    ROCm/HIP and OpenCL `works-after-host-change` (+ a native addon or a stale binding). One WebGPU round trip 45–65 µs
    p50 (lavapipe) = 28–59 search nodes. NNUE on the CPU (H 128) 0.59 µs a node in plain JS.
  - **Q2:** Lazy SMP `works-on-this-host-now`; table = 4 × `Uint32` per entry in a `SharedArrayBuffer` with the XOR
    check (plain `BigUint64` accesses may tear by ECMA-262). Node-rate factor 1.8–1.9 / 3.3–3.6 / 5.6–6.0 / 6.7–7.5 at
    2 / 4 / 8 / 12 workers; worse at 24 in one process. L, 30–60 h. Elo `estimate` 1 → 12: +55 to +150 at 40/15,
    +100 to +300 at 100 ms.
  - **Q3:** CPU-only shared table `works-on-this-host-now`; table shared with device kernels `not-feasible` from
    Node.js (no zero-copy path; "VRAM" is a 1 GiB carve-out of the same DRAM).
  - **Q4:** `UNKNOWN - verify` until the owner answers; every 100/400 read proposed to stay at `Threads 1`.
- **Recommendation (A7):** accelerator **park** (trigger: neural non-goal lifted for an Lc0-style direction, or an
  890M round trip ≤ 10 µs from Node.js); threads **pursue after EPIC-011 phase 1**; device-shared memory **drop**.
- **Owner questions (ADR-0057 D7):** OQ-1 lift "Threads" out of scope; OQ-2 Q-3K-3 reading a/b; OQ-3 40/15 claim
  a/b/c; OQ-4 NFR-009 counts worker baseline heaps a/b; OQ-5 `olger` in `render`; OQ-6 CPU NNUE yes/no/later.
- **Prototypes (A8):** P1-smoke, P1, P1b, P2–P6, all ≤ 5 min under `flock host-test.lock`, ≈ 165 s summed host time;
  windows in ADR-0057 § Prototypes. P1b's start is inferred (≈ 22:18:03): it queued 20:56:24 behind `qe-e010c`'s
  400-game read and ran when the lock freed. Scratch peak ≈ 132 MB, removed at hop end. No sudo, no system install.
- **Commits:** claim `d5edef5a`; ADR + notes `6ea56833`; this Result, the trace row and the move to done/ in the
  closing commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-01T22:22:25Z
  from `date -u`): decision `20261101T222225Z-architect-design-decision-b92cf5cd`, observation
  `20261101T222225Z-architect-design-observation-7b97c154`. An `artifact-ref` was refused by the writer (it needs
  `sha` / `gate_run` / `content_hash`, which a records hop has none of); the decision note carries the trace refs.
- **Trace row** appended to `plans/traceability.md` (the Publish line's trace row; no other `plans/` path touched).
- **For the Orchestrator:** QE hop owed (A1–A8). The owner questions go to him through you. `ABC-253` is unmerged;
  the ADR reads today's `main` key layout and names `ABC-253`'s halves as the wanted one.
