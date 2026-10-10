---
id: 20261010T155613Z-qe-e2e-artifact-ref-abc055-probe-e79c5541
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T15:56:13Z
verified_by:
confidence: high
refs:
  - ABC-055
  - .grugops/context/qe-ABC-055/probe/board-check.sh
supersedes:
---

# QE `ABC-055`: probe script

This note is hand-authored and unsealed. The script is read-only. It reads the board file, the dial
and, optionally, `git show <ref-rev>:plans/board.md`.

| script | usage | what it does |
|---|---|---|
| `.grugops/context/qe-ABC-055/probe/board-check.sh` | `bash … <board.md> <factory.config.json> [<ref-rev>]`, from the repo root | `A1`: column headings vs `## Columns` rows, in order. `A2`: each heading's limit vs `wip_limits`, plus the unlimited and Blocked forms, and every dial key has a heading. `A3`: each live count vs the `- [` rows under it. With `<ref-rev>`: every `- [` row and `_Updated:` line of the ref board is still present, in order. Exits 0 only when all hold |

What it was run on is recorded in `…7e5f486a` (red/green table) and `…1aec2908` (the merge
resolutions).

What it does not check:
- whether a row sits under the *right* column;
- the ticket front matter;
- the prose of the skip statement.
