---
id: 20261021T104000Z-software-engineer-decision-c8d1c57c
kind: decision
by: software-engineer
at: 2026-10-21T10:40:00Z
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
  - 20261021T093352Z-architect-design-decision-34e592ac
  - 20261021T093010Z-qe-e2e-observation-7f56f339
  - G-3
  - G-4
supersedes: 
seal: sha256:76be3474bd64fefa053109dfac80111832db3da416a881d339995de09ecb50fe
---

# ABC-182 SE decisions: what a row compares, where the 341da4c1 copy comes from, and why plant ids repeat

- **A limb-1 row compares the verdict and the Ruling 2 file list.** The actual value is the `limb 1:` verdict plus
  every file listed under `(b1) Ruling 2`, written `file@<ends>` (for example `src/book-file.ts@<base>` for X1). The
  `(b1) capability` count and the `(b1) Ruling 2` head line are printed on every row. No bare `(b1)` grep (G-3).
- **NOH's `adds nothing` is enforced only when a `(b1) Ruling 2` line is printed.** The `341da4c1` copy prints no
  Ruling 2 line. If its absence were a mismatch, `A3` would name 5 plants, not the page's exact 4. A future
  instrument that drops the line still fails, on P2b, P2c, CMT and X1, whose expected file list needs it.
- **The reference copy is made by the script, in scratch.** `git -C <repo> show 341da4c1:<instrument>` goes into
  `<scratch>/r2-mutants-ref/`, beside a `node_modules/typescript` symlink to the `typescript` that the given
  instrument's directory resolves. Nothing is placed in the repository.
- **Plant commits use a fixed author and committer date** (`2026-10-21T00:00:00Z`), so a re-run at the same `<tip>`
  makes the same plant ids. That is what makes `A5`'s byte-for-byte reproduction possible with no header exemption.
  The output has no time, load or scratch path line.
- **A plant that no longer applies stops the run (exit 2, `plant X did not apply`)**, rather than reading an
  unplanted tree as a verdict. Each plant is a `perl -0pi` edit; `mk` refuses a commit with no change.
- **P2c's caller value is `colour`** from `resolution.options` (`src/cli.ts:150`), as in the SE and QE plants of
  `ABC-163`. G1-GRD's base guard is `if (path !== BOOK) throw …` on `readBookFile(path: URL = BOOK)`, and its head
  deletes only that line (QE `…7f56f339`).
- **Exit codes:** 0 when all 7 rows are as expected and limbs 2 and 3 are identical; 1 naming each mismatched plant
  and each differing `plant:limbN`; 2 for usage or a plant that did not apply.
