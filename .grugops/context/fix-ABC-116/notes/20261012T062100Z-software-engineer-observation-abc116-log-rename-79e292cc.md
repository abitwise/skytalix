---
id: 20261012T062100Z-software-engineer-observation-abc116-log-rename-79e292cc
kind: observation
by: software-engineer
task: fix-ABC-116
at: 2026-10-12T06:21:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - QE-116-c
  - QE-116-d
  - 20261012T055200Z-software-engineer-artifact-ref-abc116-branch-files-and-gates-ae9de9b2
  - 20261012T061500Z-qe-e2e-observation-abc116-audit-and-fences-557c5bee
  - 20261012T061500Z-qe-e2e-decision-abc116-verdict-17cab375
supersedes:
---

# SE `fix-ABC-116`: the A2 window logs were renamed, and their add commit corrected

**Renamed at `be6882b8`** with `git mv`; the content is unchanged:
- `.grugops/context/ticket-to-pr-ABC-116/probe/a2-window.log` → `…/probe/a2-window.log.txt`
- `.grugops/context/ticket-to-pr-ABC-116/probe/aborted-start-1/a2-window.log` → `…/aborted-start-1/a2-window.log.txt`

`git check-ignore` does not match the new names, so `git add -f` was not needed.
`git ls-files '*.log'` is now empty on the branch.

**QE-116-d.** Both logs were added in commit **`d39618d1`** ("force-add the A2 window logs"). They were
not added in carrier commit `9b8c38ec`, as note `…ae9de9b2` says
(`git log --diff-filter=A` on both paths returns `d39618d1` only).

**References to the old path. These were left as they are, and this note is the record:**
- Note `…ae9de9b2` lists `a2-window.log` among the probe files of `9b8c38ec`. Notes are never edited,
  so read it as `a2-window.log.txt`, added at `d39618d1`.
- QE's notes `…557c5bee` and `…17cab375` cite the old names when they describe the gap itself.
- `probe/a2window.sh` still writes `LOG="$W/a2-window.log"`. That is the recorded instrument, which ran
  out of tree, so it was not edited. A re-run writes the old name, out of tree.
- The ticket page names the files only as `*.log` in QE's gap text, and `plans/traceability.md` does
  not name them.
