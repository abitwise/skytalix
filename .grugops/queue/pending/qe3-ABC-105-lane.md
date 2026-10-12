---
task: wave-2026-09-25
subtask: qe3-ABC-105-lane
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/qe3-ABC-105-lane/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/qe2-ABC-105 (tip db1cfb6c; contains fix cf353820, QE a0016dbb, SE 60415a8a)
---

# Subtask: re-read ABC-105's N8-LANE narrow-set cost at the fixed tip, before merge. Timing only. You are the ONLY hop running (width 1).

QE2 (`.grugops/context/qe2-ABC-105/notes/…3bc30c08`) found the fix adds 2 whole-tree reads of the real notes (3 → 5 passes, 2633 notes), so the earlier reading (H−B +0.475 s CPU, interval +0.460..+0.520, R 0.010 s; `qe-ABC-105/probe/n8-105.tsv`) predates them (`QE-105-x`). The bound is **650 ms CPU** under `ADR-0035` decision 2, provisional floor `F` 16 %.
- Repeat QE's exact method from `qe-ABC-105` (its probe: `placeholder.test.ts`, the `lane144b.mjs` harness unchanged, arms B / H / T twin, 9 rotated rounds, round 0 discarded, n = 8), with H = the test file at `db1cfb6c`. Same gate as QE's attempt 2: thermal 0, no foreign vitest runner (`pgrep -fl vitest`; the `oeselg-labs/platform/repos/shared` load voids a run), AC power; load1 logged, not gated. Log before/after each run; run the 5 s sampler. Discard overlapping rounds.
- Report H−B CPU median and interval, twin R, and grade MET / NOT MET at 650 ms. If NOT MET, say by how much and which reads drive it (no fixes — report only). If no quiet window, record NOT READ; never estimate.

## Fences
Do not touch `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json` or `plans/board.md`. Own worktree on `grugops/qe3-ABC-105-lane` off `db1cfb6c`; never `update-ref` another branch. No `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. Commit the raw TSVs and a `kind: observation` note (plus a `kind: decision` grade note, refs ABC-105) under `ref:`, a trace row at the END of `plans/traceability.md`, a short § N8-LANE re-read on the ticket. Queue: `mkdir .grugops/queue/claimed/qe3-ABC-105-lane`, then FLAT done files, uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report tip, the timing table, the gate log summary, grade.
