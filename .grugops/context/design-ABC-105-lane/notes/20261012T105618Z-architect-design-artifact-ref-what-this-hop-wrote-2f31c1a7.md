---
id: 20261012T105618Z-architect-design-artifact-ref-what-this-hop-wrote-2f31c1a7
kind: artifact-ref
by: architect-design
task: design-ABC-105-lane
at: 2026-10-12T10:56:18Z
verified_by:
confidence: high
refs:
  - ABC-105
  - QE-105-ab
  - QE-105-x
  - RISK-ABC105-LANE
  - ADR-0035
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# `design-ABC-105-lane`: branch, files and probe

This note is hand-authored and unsealed.

## Branch

- **Branch:** `grugops/design-ABC-105-lane`, off `main` `6ae6dd27`.
- **Worktree:** `../wt-design-ABC-105-lane`, with `node_modules` symlinked.
- Not merged and not pushed. No other branch was moved.

## Files

- **`memory-bank/50-decisions/ADR-0035-…md`:**
  - one § Status paragraph;
  - `§ Addendum 2026-10-12`, with A1 (the tick floor and zeros-dropped sign, forward-only), A2 (the per-set `F`)
    and A3 (the growth trigger, not `N8-LANE` text).
- **`plans/nfr-catalog.md`** (insertions only):
  - one `_Updated` line;
  - one dated sub-bullet under `N8-LANE`'s admissibility bullet;
  - one floors-block bullet;
  - a new final section, "`N8-LANE` at `ABC-105`", which holds the owner's ruling and `RISK-ABC105-LANE`.
  - The NFR row hashes are unchanged.
- **`plans/traceability.md`:** one row appended at the end.

## Probe

- `probe/recompute.py`, run as `python3 -I probe/recompute.py .grugops/context`, writes `probe/recompute.out.txt`.
- `probe/record-growth.out.txt` holds the git note counts per commit and the grep that finds the record-reading
  test files.

## Untouched

- `src/`, `tools/`, `plans/board.md`, `AGENTS.md` and every ticket page.
- **No timing reading was taken.**
