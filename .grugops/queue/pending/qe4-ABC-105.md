---
task: wave-2026-09-25
subtask: qe4-ABC-105
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-105-qe-hop-detector.md
ref: .grugops/context/qe4-ABC-105/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/fix2-ABC-105 (tip cfcd59af; code 8fd0c233; off QE3 tip 48a78f08)
---

# Subtask: QE on `fix2-ABC-105` — no catch lost, the new seam is safe, and N8-LANE re-read. You are the ONLY hop running (width 1).

Fix 2 notes: `.grugops/context/fix2-ABC-105/notes/` (decision `…9c628f28`, plants `…c1259095`, probe `plants3.py`). It cut whole-tree reads 5 → 2 with shared `plainSweep()`/`allNotes()` and added ONE tool seam: `main(argv, { notes })`.
1. **Plants, yourself:** re-run the recorded plant set (QE's, QE2's, fix's, fix2's text, verbatim) in a scratch copy OUTSIDE the repo against old (`db1cfb6c`) and new (`8fd0c233`): new red count ≥ old for every plant. Add your own two: (a) the seam injecting notes makes A4 assert on injected data that hides a broken real read path — plant a `readNotes` bug that only affects the unfiltered (sweep) read and show the plain `plainSweep()` still catches it; (b) a broken memo (shared value computed from a stale/empty read) — show it goes red, not vacuous.
2. **Seam review:** confirm no argv path reaches `options.notes`; the tool diff `48a78f08..8fd0c233` is exactly the JSDoc type + the one read line; rule whether the seam weakens any criterion (esp. A4 "on `main`", A6 fail-closed: does `notes: []` or a missing context dir still exit 2 via the CLI?). The SE left a stale JSDoc line ("the command line can supply neither") — name it as a gap, do not edit.
3. **Whole-tree read count:** confirm 2 by your own instrumentation.
4. **N8-LANE re-read:** QE3's method unchanged (`qe3-ABC-105-lane/probe/`: `lane144b.mjs`, `gate.sh`, placeholder, arms B/H/T, 9 rotated rounds, round 0 discarded, n = 8; gate thermal 0, no foreign vitest runner — the grugops kit's suite in another session and `oeselg-labs/platform/repos/shared` both void a run — AC power; load1 logged; 5 s sampler; twin admissibility as QE3 applied). Write a pre-registration file before the first window: one window, one re-attempt if void/inadmissible, no pooling. H = the file at `8fd0c233`. Grade at 650 ms CPU (median and lower interval end, as QE3 did). If no quiet window, NOT READ; never estimate.
5. Gates at the tip yourself (lint, typecheck, build, `npm test`, `last-run.json` success:true, skip-integrity with the registry path), `--sweep` 132/38/77/2/15 exit 1.
UAT is waived by the owner; do not re-litigate.

## Fences
Do not touch `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json` or `plans/board.md`; revert every plant. Own worktree on `grugops/qe4-ABC-105` off `cfcd59af`; never `update-ref` another branch. No `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. A `kind: decision` `by: qe-e2e` verdict note (refs ABC-105) PASS / PASS_WITH_GAPS / FAIL, observation notes + raw TSVs under `ref:`, a trace row at the END of `plans/traceability.md`, a short § QE4 on the ticket. Queue: `mkdir .grugops/queue/claimed/qe4-ABC-105`, then FLAT `.grugops/queue/done/qe4-ABC-105.md` and `.claim.md`, uncommitted. End commits with a `Co-Authored-By:` trailer naming the model you are. Report tip, verdict, plant table, seam ruling, read count, the timing table and gate log, gaps.
