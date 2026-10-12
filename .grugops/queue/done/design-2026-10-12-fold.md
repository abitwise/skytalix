---
task: wave-2026-09-25
subtask: design-2026-10-12-fold
role: architect-design
ref: .grugops/context/design-2026-10-12-fold/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/design-2026-10-12-fold
base: main @ dde969b6
---

# Subtask: Architect rulings and records owed after ABC-116 (merged `2a17783f`)

Sources: `.grugops/context/{ticket-to-pr,qe,fix,qe2}-ABC-116/` on main (notes and raw probe TSVs).
1. **Rule: does a change to a child's hang bound (`timeout` in `childOf`) fire `T2`?** ADR-0017 decision 2 names four triggers (argv, stdin
   script, substitution hook, settle) and is silent on the bound. QE's input (`qe2-ABC-116`): on a green lane a bound change cannot silently change
   a child's cost — a child inside the bound costs the same; one that hits it throws and the row reds (note QE2-116-b: A9's bound is 4 s against a
   ~1 s child, so the "two orders of magnitude" premise is false; the conclusion stands without it). Rule it as an ADR-0017 addendum. If it fires
   `T2`, name the comment line in `src/cli.test.ts` that must change and leave it for an SE hop (do NOT edit `src/`).
2. **The first vitest-4.1 narrow-set twin reading for `src/cli.test.ts`:** R = 0.100 s CPU / 0.180 s wall (n = 8, k = 2, module runner off,
   `ticket-to-pr-ABC-116` `probe/a2-runs.tsv`). Per the ABC-144 FCAP ruling (`d18355aa`), each narrow-set floor is re-read at its first 4.1
   reading: rule this set's F (ADR-0035 decision 3) from it, and record it in the catalog and ADR where the per-set floors live. Recompute from
   the raw TSV yourself; do not copy the summary.
3. **ADR-0017's hook-deletion figure:** +2.68 s wall / +2.60 s CPU (vitest 3.2.7) vs today's +3.08 / +3.12 (SE, n = 8) and +3.15 / +3.21 (QE spot,
   n = 5). Add a dated addendum carrying the 4.1 figure; claim no single cause.
4. **The named `plans/nfr-catalog.md` pointer edit** (ABC-116 A5: from the `N8-SPAWN` account block, ~`:1192`, to the `T1`/`T2` bullets,
   ~`:1629–1630`): make it, re-locating both by content. Then the 8 `NFR-00[1-8]` rows must still hash `c74e7426…0d3b` unless you change a row
   on purpose — if you do, say so and give the new hash.
5. Note RISK-ABC144-FCAP: the full-lane twin R on 4.1 is still owed at the next paired window; say whether item 2 changes that.

## Fences
Never merge or push. Do not touch `plans/board.md` (recommend moves instead), `src/`, `tools/`, `data/`, `vitest.config.ts`, `package.json`. Own worktree as a SIBLING of the repo off `main`, `node_modules` symlinked if you run anything. No `update-ref` on another branch, no `--force`, `-D`, `reset --hard`. Three hops run in parallel (BA/PM, Architect, Scribe): take NO timing readings. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. Ticket pages of `Done` tickets and committed notes are corrected APPEND-ONLY (dated lines, struck words kept, never deleted). Notes per Workflow 16, a trace row at the END of `plans/traceability.md`. Queue: move THIS FILE to `.grugops/queue/done/<subtask>.md` and write `.grugops/queue/done/<subtask>.claim.md` (flat files); leave them uncommitted. `Co-Authored-By:` trailer with your real model. Remove your worktree when done. Report the tip, what you changed, what you decided, and the board moves you recommend.
