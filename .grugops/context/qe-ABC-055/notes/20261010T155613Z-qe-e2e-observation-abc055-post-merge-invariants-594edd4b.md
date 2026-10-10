---
id: 20261010T155613Z-qe-e2e-observation-abc055-post-merge-invariants-594edd4b
kind: observation
by: qe-e2e
at: 2026-10-10T15:56:13Z
verified_by:
confidence: high
refs:
  - ABC-055
  - ABC-010
  - plans/board.md
  - plans/traceability.md
  - 20261010T155613Z-qe-e2e-observation-abc055-gap-register-1aec2908
  - 20261010T155613Z-qe-e2e-artifact-ref-abc055-probe-e79c5541
supersedes:
---

# QE `ABC-055`: what must hold after the merge

This note is hand-authored and unsealed. These are the checks for whoever resolves the merge. Let
`W` be the wave tip the branch merges into (`2946e22a` at review). Run them on the merged tree
before committing the merge.

| # | invariant | how to check |
|---|---|---|
| I1 | The probe passes, with REF set to the wave | `bash .grugops/context/qe-ABC-055/probe/board-check.sh plans/board.md .grugops/factory.config.json W` prints `ALL PASS` and exits 0 |
| I2 | 13 column headings in table order; `## In Analysis (WIP n/2)` and `## In Design (WIP n/2)` sit between `## Ready` and `## Ready for Dev`, with `n` equal to their rows (0 at `W`) | I1 (`A1`–`A3`) |
| I3 | **The wave's counts and rows win in hunk 2**: `## Ready for Dev (WIP 1/6)` with the `ABC-010` row under it, not the branch's stale `0/6`. The other counts are the wave's (`Ready` 1/8, `In Development` 2/3, `In Review` 1/3, `Ready for UAT` 1/4 at `2946e22a`) | I1's REF row check: 0 missing. `A3` alone does not catch a dropped row |
| I4 | Every wave `_Updated:` line is kept, plus the SE's one line; 0 `_Updated:` lines are removed against `W` | I1's REF `_Updated:` check, and the I4 command below prints 0 |
| I5 | The branch's FORMAT edits are present (dial path `.grugops/factory.config.json#wip_limits`, the SKIPPABLE COLUMNS paragraph, the INVARIANT line). That region merges clean | the I5 command below prints 3 |
| I6 | `plans/traceability.md` keeps both sides: the wave's `ABC-137`, `ABC-138`, `ABC-010` (re-score) and `ABC-139` rows, plus `ABC-055 (build)` and `ABC-055 (QE)` | the I6 command below prints 6 |
| I7 | Board ↔ ticket: `ABC-055`'s front matter `column:` equals the column its row sits under (`In Review` at `W`; the merged ticket front matter reads `In Review`, verified with `merge-tree`) | read both |
| I8 | No `src/` change arrives with the merge | `git diff --name-only W <merge> -- src/` is empty |

The I4, I5 and I6 commands are kept out of the table so their pipes stay literal. I5 printed 3 on the branch and on the simulated union. I6 printed 6 on a simulated union, and 5 without the QE row:

```sh
git diff W <merge> -- plans/board.md | grep -c '^-_Updated:'                                   # I4: 0
grep -c 'SKIPPABLE COLUMNS\|^  INVARIANT:\|this repo.s dial' plans/board.md                      # I5: 3
grep -cE '^\| (ABC-137 \(cut\)|ABC-138 \(cut\)|ABC-010 \(re-score\)|ABC-139|ABC-055 \((build|QE)\)) \|' plans/traceability.md   # I6: 6
```

Then run the gates on the merged tip (lint, typecheck, `npm test`, skip count) per AGENTS.md
§ Safety rules.

A resolution simulated as "union" (`…1aec2908`, `QE-055-a`) satisfies I1–I4. The "take the branch
side" resolution fails I3 and I4. The "take the wave side" resolution fails I2.
