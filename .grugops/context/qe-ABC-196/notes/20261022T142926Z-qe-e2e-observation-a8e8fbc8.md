---
id: 20261022T142926Z-qe-e2e-observation-a8e8fbc8
kind: observation
by: qe-e2e
at: 2026-10-22T14:29:26Z
verified_by: 
confidence: high (own runs at merge 0492a007 in a scratch clone, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM=1; no timing)
refs:
  - ABC-196
  - grugops/ABC-196
  - grugops/qe-ABC-196
  - 0492a007
  - 6d15460b
  - a7857e0b
  - QE-195-a
  - plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - 99d07d32
  - 0dfd17b3
  - AR-193-HUNKHDR
  - ADR-0036 S1
  - .grugops/context/arch-build-ABC-196/notes/20261022T135459Z-architect-design-decision-7cd5d10a.md
  - .grugops/context/arch-build-ABC-196/notes/20261022T135459Z-architect-design-observation-d955ee60.md
  - .grugops/context/qe-ABC-195/notes/20261021T203404Z-qe-e2e-observation-741eebba.md
supersedes: 
seal: sha256:0645ca3b362dd897dafd1cc91b0a757995d11721454f89f9cc07cfec8adcf2f8
---

# QE readings for `ABC-196` A1–A7 at `grugops/qe-ABC-196` (merge of `main` = tip `0492a007`; harness `6d15460b`; base `a7857e0b`): all seven MET on my own runs, taken before I opened the Architect's `…7cd5d10a`/`…d955ee60`

Cites the page `plans/tickets/ABC-196-…md` `## Scope` and `## Acceptance` (A1–A7), and QE `…decision-f36a06c3` (`QE-195-a`, the `## Risks`), as authoritative.

**Merge.** `git merge --no-edit main` in `../wt-qe-ABC-196` (branched at `0492a007`): `Already up to date`. `main` is `a7857e0b`, the branch's base, so the merge sha is the tip, **`0492a007`**. No merge commit was made.

**Setup.** Every git and harness call went through one wrapper: private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS`, `GIT_EXTERNAL_DIFF`, `GIT_DIR` and `GIT_WORK_TREE` unset. git 2.56.0, Node 26.11.1. No timing.
- `<repo>` was a full `git clone --no-hardlinks` of my worktree, in session scratch, with its own `.git`. The harness makes its own `--shared` clone of that.
- Instruments were scratch copies, each beside a `node_modules/typescript` link to my worktree's own `npm ci` install:
  - head: `git show a7857e0b:…/clause-b.mjs`, sha-256 prefix `24b963b14fa4f1bf`;
  - pre-`ABC-195`: `git show 99d07d32:…`, `2c0c1985e6607110`.
- Harness copies: base `git show a7857e0b:…/r2-mutants.sh` (`eb6eab4b5604a526`), fixed `git show 0492a007:…` (`ac464ef690c7a3a4`).
- Drift copies, one line each: D2 (`pe`'s `slice\(2\)` → `slice\(9\)`) and L (`pp`'s leak() `printf` removed), on base and on fix. R is scratch commit `521eac8a` on `a7857e0b`, whose only change splits `src/cli.ts:138` into `const argv = process.argv.slice(2);` + `const resolution = resolveOptions(argv);`.

**A1 MET.**
- `git -c core.quotePath=false diff --name-only main...HEAD` lists `.grugops/context/design-F-072-1/probe/r2-mutants.sh` and the two Architect notes under `.grugops/context/arch-build-ABC-196/notes/`. `r2-mutants.out.txt` is not listed, and A4's head output did not change.
- The waiver form prints nothing over `a7857e0b..0492a007`.

**A2 MET** (base harness, head instrument):
| run | rc | summary | the silent rows |
|---|---|---|---|
| D2 at `a7857e0b` | 0 | `25 of 25` | PP-EDIT: plant check `1 on the plant, 0 on its twin`, `L2 … identical (limb 2: does not fire)` |
| R `521eac8a` | 0 | `25 of 25` | PP-EDIT as D2 |
| L at `a7857e0b` | 0 | `25 of 25` | PP-TPL, PP-REDIR, RA-PLUS: `L2`/`L3 … identical (… does not fire)` |

**A3 MET** (fixed harness, head instrument). Each run exits 1. Its output differs from base's on the same drift only in line 177, which reads `r2-mutants: limbs 2/3 verdict on the plant not as the row expects (FIRES and FIRES; PP-EDIT FIRES and does not fire):` followed by:
- D2: ` PP-EDIT:limb2`;
- R: ` PP-EDIT:limb2`;
- L: ` PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3`.

No `MISMATCH` or `DIFFER` line prints, no other row is named, and stderr is empty.

**A4 MET** (fixed harness at `a7857e0b`, head instrument):
- rc 0, `25 of 25`, 177 lines, `cmp` byte-equal to base's harness on the same tip.
- Lines 2–140 (the 20 earlier rows) read sha-256 prefix `a00519f3ddcc2ca2` on both. The page's `692a5a3e…` was taken at tip `219e8e33`; plant ids depend on the tip.
- At `0dfd17b3`, the tip the committed `r2-mutants.out.txt` was taken at, the fixed harness's output is `cmp` byte-equal to that file. The file is unchanged in the diff.

**A5 MET** (fixed harness at `a7857e0b`, pre-`ABC-195` instrument `2c0c1985e6607110`):
- rc 1;
- `r2-mutants: limb 1 MISMATCH: RA-PLUS SP-N5`;
- its `limbs 2/3 DIFFER` line is identical to base's harness on the same instrument: `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3`.
- `/usr/bin/diff` base vs fix shows one added line, 178. It names the same 9 limbs as not as expected, and lines 1–176 are byte-equal. RA-PLUS is named there because the pre-`ABC-195` instrument reads it as `FIRES (disputed: unresolved, the fail-safe)`, and the compare is on the whole verdict text.

**A6 MET** (fixed harness, head instrument, at `a7857e0b`; drift copies of my own, as QE `…observation-741eebba` describes them):
- D1 (`pp`'s `isSquareAttackedBy` → `…ZZ`): rc 2, `plant PP-TPL failed the plant check: stand-in lines 0 on the plant, 0 on its twin`.
- D3 (`sp SP-N5 'q t.ts'` → `'q_t.ts'`): rc 2, `plant SP-N5 … 0 on the plant, 0 on its twin`.
- D4 (`PP-TPL`'s twin keeps `++`): rc 2, `plant PP-TPL … 1 on the plant, 1 on its twin`.
- D5 (`pe`'s template anchor group → `(\nfunctionZZ )`): rc 2, `plant PP-EDIT … 0 on the plant, 0 on its twin`.

**A7 MET.** See the gates note.

**Agreement.** After this note's numbers were taken I opened the Architect's `…d955ee60`, and it agrees on every shared number. My copies of base, base-D2, base-L, fix, fix-D1..D4 and fix-L hash to the same sha-256 prefixes as the builder's. My D5 copy differs in text (I anchored one alternative, the builder anchored three), and both exit 2 naming PP-EDIT. My E4 is the builder's LF byte for byte (`071f59bc476ed878`).
