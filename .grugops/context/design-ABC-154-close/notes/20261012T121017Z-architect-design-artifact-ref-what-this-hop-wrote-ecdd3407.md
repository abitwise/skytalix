---
id: 20261012T121017Z-architect-design-artifact-ref-what-this-hop-wrote-ecdd3407
kind: artifact-ref
by: architect-design
task: design-ABC-154-close
at: 2026-10-12T12:10:17Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - RISK-ABC105-LANE
  - T-QEHOP-GROWTH
  - QE-154-b
  - QE-154-c
  - QE-154-d
  - ADR-0035
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes:
---

# `design-ABC-154-close`: branch, files, probe and gates

This note is hand-authored and unsealed.

## Branch

- **Branch:** `grugops/design-ABC-154-close`, off `main` `b89b3fd2`.
- **Worktree:** `../wt-design-ABC-154-close`, with `node_modules` symlinked at the worktree root only.
- Not merged and not pushed. No other branch was moved.

## Files

- **`memory-bank/50-decisions/ADR-0035-…md`** (insertions only):
  - one § Status paragraph;
  - `§ Addendum 2026-10-12 (after ABC-154)`, with B1 (the A1 forward-only wording), B2 (`F`), B3 (the closure,
    and `T-QEHOP-GROWTH`) and B4 (load1).
- **`plans/nfr-catalog.md`** (insertions only):
  - one `_Updated` line;
  - one dated floors sub-bullet;
  - one dated line under `RISK-ABC105-LANE`'s header;
  - a "Closure" subsection at the end of "`N8-LANE` at `ABC-105`".
  - `NFR-00[1-8]` hash `c74e7426…0d3b` and all nine rows hash `6b62892c…6b41`, before and after.
- **`plans/traceability.md`:** one row appended at the end.

## Probe

- **`probe/recompute.py <tsv> <sampler> <H tests>`:** the grade, R and the sign tests, in integer centiseconds.
- **`probe/samplerwin.py <tsv> <sampler>`:** the sampler rows inside the lane interval.
- **`probe/projection.py`:** A3's arithmetic re-anchored, and `F`'s median of three.
- **`probe/recompute.out.txt`:** all of the above for `qe-ABC-154` w1, `qe-ABC-105`, QE3 w3 and QE4 w2, plus the
  per-round load table for w1.

## Gates, on the working tree before the commit

| gate | result |
|---|---|
| `npm run -s lint` | exit 0, 109 files |
| `npm run -s typecheck` | exit 0 |
| `npm run -s build` | exit 0 |
| `npm test` | exit 0: 57 files, 1775 tests |
| `.test-results/last-run.json` | `success: true`, 0 failed, 0 pending, 0 todo |
| `test-skip-integrity.js --skip-count 0` | `No findings.` |

## Untouched

- `src/`, `tools/`, `plans/board.md`, `AGENTS.md` and every ticket page.
- **No timing reading was taken.** A BA/PM hop ran in parallel.
