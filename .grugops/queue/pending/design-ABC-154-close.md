---
task: wave-2026-09-25
subtask: design-ABC-154-close
role: architect-design
ref: .grugops/context/design-ABC-154-close/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/design-ABC-154-close
base: main @ 7fdb5ba8
---

# Subtask: Architect records the closure of `RISK-ABC105-LANE` after ABC-154 (merged `4537fb11`)

Source: `.grugops/context/qe-ABC-154/` on main (verdict `…d9ae510a`, timing `…4e153e76`, `probe/preregistration.txt`, `probe/w1/`).
1. **Record the reading and close the risk** in `plans/nfr-catalog.md` § "N8-LANE at ABC-105" per its own MET rule: QE's w1 at code `0f8036f9` (now on main via `4537fb11`), pre-registered `b9a5c957`, admissible under ADR-0035 A1 (and under the pre-A1 rule): H−B +0.380 s CPU (+0.350..+0.410), twin −0.005 s, R 0.030 s → MET at 650 ms. Recompute from the raw TSVs yourself before writing it.
2. **`QE-154-b` (INFO):** A1 speaks of a pre-registration that "lands on main"; QE's was on its branch and is now on main by merge. Rule whether that satisfies A1 (or amend the wording); no state depends on it.
3. **`QE-154-c`:** the set's floor `F` — QE reads it as staying 0.020 s with a third admissible R of 0.030 s (median of the last three). Rule it from the TSVs and update the floors bullet if it changes. Say whether the 4,000-note re-read trigger (T-c) survives the risk's closure — if yes, re-home it (e.g. as its own named trigger on the set) so it is not lost with the risk.
4. **`QE-154-d` (INFO):** load1 reached 8.88 during w1 with no foreign runner seen. Say whether that bears on admissibility under ADR-0035 (load1 is logged, not gated) — no new rule unless needed.
5. NFR rows `NFR-00[1-8]` must still hash `c74e7426…0d3b` (all nine `NFR-` rows `6b62892c…6b41`) unless you change one on purpose — say so and give the new hash.
Edit only `memory-bank/50-decisions/` (ADRs), `plans/nfr-catalog.md`, your notes and the trace row.

## Fences (two hops run in parallel, width 2)
Never merge or push. Do not touch `plans/board.md`, `src/`, `tools/`, `AGENTS.md`. Work in your OWN worktree (`git worktree add ../wt-design-ABC-154-close -b grugops/design-ABC-154-close main`); if you need `node_modules` for gates, symlink it into the WORKTREE root only — never `ln -s` in the main checkout. No `update-ref` on another branch, no `--force`, `-D`, `--amend`, `reset --hard`. Take NO timing readings. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. If you change any committed file other than notes, run the gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success:true. Notes per Workflow 16 under `ref:`, one trace row at the END of `plans/traceability.md`. End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/design-ABC-154-close`, then at the end FLAT files `.grugops/queue/done/design-ABC-154-close.md` and `.grugops/queue/done/design-ABC-154-close.claim.md`, uncommitted; `rmdir` the claim dir. Report: branch tip, what you changed (with readings), anything owed by another role or the owner.
