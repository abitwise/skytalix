---
task: wave-2026-09-25
subtask: qe-ABC-154
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-154-the-qe-hop-detector-test-has-no-positive-control-on-its-whole-tree-read.md
ref: .grugops/context/qe-ABC-154/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-154-positive-control-whole-tree-read (tip beb0991c; code 0f8036f9; base 69a1f4b4)
---

# Subtask: QE on `ABC-154` — re-plant, and read N8-LANE. You are the ONLY hop running (width 1).

Build notes: `.grugops/context/ticket-to-pr-ABC-154/notes/` and `probe/` on the branch.
1. **A1–A4 independently.** Re-plant A1's three (`plants4.py`) yourself on base and head (scratch copy OUTSIDE the repo; restore; `cmp`). Re-run the 32-plant superset yourself, head ⊇ base by test name. The SE could not `ast.literal_eval` `plants4.py`'s 9 plants (string expressions over named constants) and parsed/ran its assignments instead — check that load reproduces the exact text QE4 applied (compare against QE4's `plants4.out.txt`). A3/A4 readings yourself (JSDoc-only tool diff; 0 spawns; whole-tree reads 2 by your own instrumentation; `--sweep` and `--sweep --json` `cmp` 0 base vs head; gates).
2. **Break it on purpose, your own plants:** a `readNotes` that drops only notes whose `by:` is `security-nfr`; one that drops a random half; an `allNotes()` memo built from a FILTERED read for one folder; the two new positive assertions removed one at a time. Say which the head test catches.
3. **N8-LANE re-read — this is `RISK-ABC105-LANE` trigger T-b.** Method: QE4's (`qe4-ABC-105/probe/`: `lane144b.mjs` and `gate.sh` unchanged, placeholder, arms B/H/T, 9 rotated rounds, round 0 discarded, n = 8; gate thermal 0, no foreign vitest runner — the grugops kit's suite in another session and `oeselg-labs/platform/repos/shared` void a run — AC power; load1 logged; 5 s sampler), with H = the file at `0f8036f9`. **Admissibility per `ADR-0035` § Addendum 2026-10-12 A1** (|twin median| ≤ max(1.5 % of B, one 10 ms tick); sign test on non-zero deltas only — state that convention in the pre-registration). Commit a pre-registration before the first window: one window, one re-attempt if void/inadmissible, no pooling. Grade at 650 ms CPU on the median and the lower interval end; use the set's per-set F = 0.020 s (`plans/nfr-catalog.md`). If no admissible window: NOT READ; never estimate. State plainly whether, under the catalog's § "N8-LANE at ABC-105", your reading's state CLOSES `RISK-ABC105-LANE` (MET), goes to the owner (NOT MET), or leaves it open.
4. Measure the UAT-waiver reading yourself; note the tool change is a comment.

## Fences
Do not touch `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, `plans/board.md`, `plans/nfr-catalog.md` or ADRs; revert every plant. Own worktree on `grugops/qe-ABC-154` off `beb0991c` (symlink `node_modules` into the worktree root only; never `ln -s` in the main checkout). Never `update-ref` another branch. No `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. A `kind: decision` `by: qe-e2e` verdict note (refs ABC-154, and ABC-105 for the risk) PASS / PASS_WITH_GAPS / FAIL, observation notes + raw TSVs under `ref:`, a trace row at the END of `plans/traceability.md`, § QE on the ticket. Queue: `mkdir .grugops/queue/claimed/qe-ABC-154`, then FLAT `.grugops/queue/done/qe-ABC-154.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. End commits with a `Co-Authored-By:` trailer naming the model you are. Report tip, verdict, readings, plant table, timing table and gate log, the risk state, gaps.
---
done_at: 2026-10-12T11:41:00Z
branch: grugops/qe-ABC-154 (worktree ../wt-qe-ABC-154, off beb0991c)
tip: b8a196b3 (pre-registration b9a5c957 before window 1; w1 31ec102d; plants/reads/sweep/static/gates 69577b62 + 819cfbd2; notes, trace row, ticket § QE b8a196b3; no code)
result: PASS_WITH_GAPS. A1 MET (3 QE4 plants 0 -> 2 red each, unmutated head 32/32). A2 MET (head ⊇ base 32/32; plant text loaded by executing QE4's plants4.py verbatim up to PAIRS; the SE's load identical 32/32; base == QE4 [new] rows by pass count and red names 32/32). A3 MET (one JSDoc line; comment-stripped tool hash equal base/head). A4 MET (2 files, 0 added, 0 spawns, whole-tree reads 2 = 2, --sweep and --sweep --json cmp 0, npm test 57/1775 +0, skip 0, No findings). QE's own plants all caught at head (by-secnfr unfiltered 0 -> 2; hash/random half; one-folder allNotes memo); no single or pair removal of the 4 new expects leaves a fault uncaught. Gates green. N8-LANE MET at 650 ms CPU at 0f8036f9: +0.380 s (+0.350..+0.410), twin -0.005 s (-0.87 %), non-zero signs +1/-4 p 0.375, R 0.030 s; one admissible window (n = 8, 0 discarded), also admissible under the pre-A1 rule. RISK-ABC105-LANE: MET -> closes once 0f8036f9 is on main (Architect/Design writes it). UAT-waiver reading empty. Gaps: QE-154-a LOW (two-point control blind to a real-tree thinning that spares its two folders), QE-154-b/c/d INFO. Decision .grugops/context/qe-ABC-154/notes/…-d9ae510a.
