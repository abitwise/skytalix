---
id: 20261018T175500Z-qe-e2e-observation-abc170-not-observable-until-abc167-and-a6-e4d07b39
kind: observation
by: qe-e2e
task: uat-ABC-170
at: 2026-10-18T17:55:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - ABC-167
  - ADR-0044
  - NFR-005
  - QE-170-b
  - QE-170-g
  - 20261018T174100Z-orchestrator-decision-owner-word-abc170-a6-timing-ok-uat-by-qe-7f3a9c14
  - 20261018T134900Z-orchestrator-observation-abc170-a6-window-void-2d7e6b31
supersedes:
---

# UAT `ABC-170`: what cannot be seen until `ABC-167`, how `A6` is recorded, and what the run did not grade

This note is hand-authored and unsealed. None of the items below is graded as a pass or a fail here.

## Not observable until `ABC-167` wires the limits to UCI

Today no CLI or UCI path passes `maxDepth` or `maxNodes`. A `grep` over `src/` (test files excluded) finds the
two fields only in `src/engine.ts`. So neither `npm run chess` nor any UCI GUI can show any of these:

| what a UCI user would see | why not here | where it gets proven |
|---|---|---|
| `go depth N` answers at depth N | No UCI command maps to `maxDepth` | `ABC-167` |
| `go nodes N` stops near N nodes | No UCI command maps to `maxNodes` | `ABC-167` |
| **`go mate N` searches to depth 2N−1** | `ADR-0044` D12's mapping is `ABC-167`'s. Here it is only a `maxDepth` value, which S3 already covers. **No mate scenario was invented** | `ABC-167` |
| `go depth 0`, or a tiny `go nodes N`, is handled sensibly | The engine gives depth 1 and a legal move, and reports more nodes than asked below the depth-1 cost (`QE-170-g`). That is safe, but unspecified on this ticket | `ABC-167`'s validation |
| The `info` line reports the limited depth and nodes | No `info` output exists at this layer | `ABC-167` |

## `A6` (`NFR-005`): OWNER-RULED, NOT MEASURED

- The owner said, in session, *"timing seems ok"* (`…7f3a9c14`). `A6` is recorded as **OWNER-RULED, NOT
  MEASURED**.
- **This hop took no timing reading.** It ran no `ENGINE_DEEP=1`, no depth-in-3-s run, and no wall-clock
  grading. It quotes and estimates no depth and no time for `A6`. The one earlier window was void
  (`…2d7e6b31`), and nothing from it is cited.
- The only `A6`-adjacent check is behaviour only: S1 shows that with no limit the engine gives today's
  move, depth, nodes and virtual elapsed, field for field, on 12 positions, 2 budgets and 3 doors. That says
  nothing about speed.
- This hop touched and killed no other process.

## Two INFO observations (not defects)

1. **`UAT-170-a` INFO: `A7`'s literal command reads four files, not two, after the main merge.**
   `git diff --name-only 358810ac 36e3a753 -- src` lists `src/cli.test.ts`, `src/engine.test.ts`,
   `src/engine.ts` and `src/evaluate.ts`. That is because `025a6bef` merged `main` (`acfdbeb3`, which carries
   `ABC-169`) into the branch. The two extra files are byte-identical to `main`'s. Measured from the merge base,
   `git diff --name-only main...36e3a753 -- src` lists exactly `src/engine.test.ts` and `src/engine.ts`. **The
   fence holds.** Whoever re-reads `A7` at the merge gate should use the merge base `acfdbeb3`, not `358810ac`.
2. **`UAT-170-b` INFO, restating `QE-170-b`:** a hidden `maxNodes` default goes unseen by this UAT as well
   (control C4, 60 000 nodes). S1 compares at budgets of 5 and 50 virtual ms, roughly 50 000 nodes or fewer,
   and the levels stay under 43 000. A default above the largest node count any scenario reaches cannot show.
   Only a text pin would close this. That is BA/PM's routing, not this hop's fix.
