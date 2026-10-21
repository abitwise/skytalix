---
id: 20261021T104001Z-software-engineer-observation-82b37fc8
kind: observation
by: software-engineer
at: 2026-10-21T10:40:01Z
verified_by: 
confidence: high
refs:
  - ABC-182
  - grugops/ABC-182
  - 19abbdb1
  - 053595af
  - 341da4c1
  - 87d3897d
  - ADR-0036
  - AR-163-DELONLY
  - plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - 433d0c50
  - ad47a564
supersedes: 
seal: sha256:48d79d99b8f38766b31fda5d9b7eb2c8f0995a1561b2a8d0337168a9eab9e2d5
---

# ABC-182 readings A1–A6 at `053595af` (base `19abbdb1`): all six met

Scratch only, with a private `TMPDIR` under the session scratchpad. `<repo>` is the worktree; `<tip>` is `19abbdb1`.
No timing was taken.

- **A3 first (red on the pre-fold copy).** The `341da4c1` copy (sha-256 `433d0c50…`, as QE recorded) was put in a
  scratch directory with `node_modules/typescript` symlinked. Exit **1**. `limb 1 MISMATCH: P2b P2c CMT X1`, exactly
  these four. NOH, G1-IMP and G1-GRD read `does not fire` as expected. Limbs 2 and 3 are identical on 7 of 7.
- **A2 (green on the folded instrument, sha-256 `ad47a564…`, the same bytes as `87d3897d`).** Exit **0**. 7 of 7
  rows as expected. P2b, P2c and CMT FIRE, with `src/book-file.ts@<base> and <head>`. X1 FIRES with
  `src/book-file.ts@<base>` (holders 1 at `<base>`, 0 at `<head>`). NOH: `no limb-1 holder at <base> or <head>; adds
  nothing`. G1-IMP (holders 1 / 0) and G1-GRD (1 / 1) read `holder files with + lines: 0`, `does not fire`. Limbs 2
  and 3 are byte-identical to `341da4c1` on 7 of 7 plants (14 of 14). The worktree's `status --porcelain` was empty
  before and after, and its `HEAD` was unchanged.
  - **Refs during the first A2 run:** `main` moved `19abbdb1` → `106d5601` and `grugops/qe-ABC-181` appeared. Both are
    the Orchestrator's and ABC-181's concurrent commits, not the harness's.
  - None of the 8 plant commits exists in the repository (`git cat-file -e` fails on each).
  - On the A5 re-run, `git for-each-ref` was identical before and after.
- **A4 (the limb 2 and 3 comparison has teeth).** The `ALT` copy of the folded instrument had 1 byte changed
  (`NAME[2]`: `process` → `Process`; `cmp -l` counts 1). It was put in scratch with `typescript` symlinked. Exit
  **1**. `limbs 2/3 DIFFER from 341da4c1: P2b:limb2 … G1-GRD:limb2` on all 7, and limb 3 never. The `ALT` directory
  was deleted afterwards.
- **A5 (the committed output is the run).** `r2-mutants.out.txt` is the A2 output. Re-running A2 at the committed tip
  gave exit 0, and `cmp` with the committed file is byte-identical. There is no header exemption.
- **A1.** `git diff --name-only 19abbdb1 053595af` lists exactly `r2-mutants.out.txt` and `r2-mutants.sh`.
  `git diff --quiet 19abbdb1 053595af -- …/clause-b.mjs` exits 0.
- **A6.** `npm test`: 59 files and 1987 tests, equal to base. Skips 0. `biome.json` and `src/` are unchanged.
