---
task: wave-2026-09-25
subtask: validate-adr0026
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (independent design review for the owner)
ref: .grugops/context/validate-adr0026/
adr: memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
ruling_ref: .grugops/context/ruling-abc121-lmr-oracle/   (notes + probe: lmr.ts, run.ts, raw results)
ticket: plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
enqueued_by: orchestrator
enqueued_at: 2026-09-25T22:10:00Z
branch: grugops/validate-adr0026
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: independently validate `ADR-0026` for the owner

Owner's word, verbatim: *"let architect validate ADR-0026 for me, describe the LMR drift"*.

You did NOT write `ADR-0026`; review it as a second pair of eyes. The owner will decide on your
verdict. Do not rubber-stamp.

1. **Re-run the probe** (`ruling_ref: probe/`) yourself and confirm or correct its numbers:
   PVS 0/190 score changes; LMR drift vs `searchWithoutReductions` (98.40% / 99.47% within 25 cp
   at d4/d5, max 50 / 45 cp, 0 mate flips); PVS-on-both-sides failing `ABC-080` `A3` and
   `ABC-081` `A3`; depth-7 node margins 1.68x / 1.83x.
2. **Challenge the design:** are two test-only doors per recursion the simplest shape that keeps
   the merged rows honest, or is there a leaner one (e.g. one options parameter, one door)? Does
   the bounded oracle (0 mate flips, ≥ 95% within 25 cp, none > 75 cp) actually catch a broken
   LMR — try at least two deliberately wrong LMR variants (e.g. reducing captures/checks, reducing
   by 2, no re-search on fail-high) and report whether the oracle reds each. Is the corpus (190
   positions, only 3 with mate scores) enough for the mate floor to mean anything?
3. **Verdict:** ACCEPT / ACCEPT WITH AMENDMENTS (name them, as a proposed amendment text) /
   REJECT (with the alternative). Keep `ADR-0026`'s status `proposed` — only the owner accepts.

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`. Do not edit `ADR-0026` itself —
put proposed amendment text in your note. Never merge; never push. Own `git worktree` under
`.claude/worktrees/` (symlink `node_modules`); commit messages via a scratchpad file and
`git commit -F`; probes as node scripts under `ref:`.

## Publish
`decision` + `observation` notes under `ref:`, a trace row. Queue pending → claimed → done per
Workflow 17. Report: verdict in one line, each re-measured number vs the original, each wrong-LMR
variant and whether the oracle caught it, any amendment, sha, numstat.
