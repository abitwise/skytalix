---
task: wave-2026-09-25
subtask: design-ABC-105-lane
role: architect-design
ref: .grugops/context/design-ABC-105-lane/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/design-ABC-105-lane
base: main @ c1841b36
---

# Subtask: Architect rulings and records owed after ABC-105 (merged `f6400877`)

Sources on main: `.grugops/context/{qe-ABC-105,qe3-ABC-105-lane,qe4-ABC-105}/` (notes and raw probe TSVs under `probe/`), the ticket page's § N8-LANE re-read and § QE4.
1. **`QE-105-ab`: the 1.5 % twin admissibility limit vs the 10 ms CPU tick.** For a ~0.57 s narrow-set base the 1.5 % limit is 8.6 ms, below the 10 ms resolution of `/usr/bin/time -p`, so any ±0.010 s twin median is inadmissible (QE3 w1 1.74 %, QE4 w2 1.75 %). Rule it (ADR-0035 addendum, or wherever the limit lives): keep, add a tick floor (e.g. max(1.5 %, one tick)), or change the timer. Recompute QE3 w1 and QE4 w2 from the raw TSVs yourself and say what each would read under your ruling — record it, do not regrade into a MET.
2. **The owner's ruling (2026-10-12):** ABC-105 merged "on the +0.370 s reading" (QE4 w2, ungraded). Record it where N8-LANE readings live as the owner's ruling, NOT a MET, and name the owed formal reading (`QE-105-x`) as a risk with a trigger (e.g. the next width-1 quiet window, or any change to the file/tool).
3. **The new narrow set's floor:** `tools/grugops/qe-hop-integrity.test.ts` vs placeholder has admissible twin R readings: 0.010 s at `60415a8a` (qe-ABC-105, n = 8) and 0.020 s at `db1cfb6c` (QE3 w3, n = 8). Recompute from the raw TSVs; rule the set's per-set F (ADR-0035 decision 3) and record it in the catalog/ADR where per-set floors live.
4. **Growth:** the file's cost is dominated by whole-tree note reads (now 2 per run, 2641 notes) and grows with `.grugops/context`, not with code (`QE-105-x`). Name the trigger at which the bound must be re-read (e.g. a note-count threshold), and say whether this belongs in `N8-LANE` text.
5. NFR rows `NFR-00[1-8]` must still hash `c74e7426…0d3b` unless you change one on purpose — say so and give the new hash. RISK-ABC144-FCAP (full-lane 4.1 twin R) is still owed: say whether anything here changes it.
Edit only `memory-bank/50-decisions/` (ADRs), `plans/nfr-catalog.md`, your notes and the trace row. Do not edit ticket pages (BA/PM's).

## Fences (all three hops run in parallel, width 3)
Never merge or push. Do not touch `plans/board.md`, `src/` or `tools/`. Work in your OWN worktree (`git worktree add ../wt-design-ABC-105-lane -b grugops/design-ABC-105-lane main`). No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. Take NO timing readings (others run in parallel). `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. If you change any committed file other than notes, run the gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true. Notes per Workflow 16 under `ref:`, one trace row at the END of `plans/traceability.md`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/design-ABC-105-lane`, then at the end FLAT files `.grugops/queue/done/design-ABC-105-lane.md` and `.grugops/queue/done/design-ABC-105-lane.claim.md` (not a directory), uncommitted; `rmdir` the claim dir. Report: branch tip, what you changed (with readings), and anything owed by another role or the owner.
