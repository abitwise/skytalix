---
id: 20261022T135459Z-architect-design-observation-d955ee60
kind: observation
by: architect-design
at: 2026-10-22T13:54:59Z
verified_by: 
confidence: high (measured on this hop in a scratch clone outside the repository, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM=1; no timing)
refs:
  - ABC-196
  - QE-195-a
  - ABC-195
  - AR-193-HUNKHDR
  - ADR-0036 S1
  - NFR-008
  - grugops/ABC-196
  - 6d15460b
  - a7857e0b
  - 219e8e33
  - 99d07d32
  - 341da4c1
  - 0dfd17b3
  - 14fea7d4
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
  - 20261021T205709Z-ba-pm-decision-f0144de0
  - 20261021T205709Z-ba-pm-observation-466ee18d
  - 20261021T203404Z-qe-e2e-decision-f36a06c3
  - 20261021T203404Z-qe-e2e-observation-741eebba
  - 20261021T201020Z-architect-design-decision-6a068acf
supersedes: 
seal: sha256:04b317e37a504076c86977da50f48b95a518e879681d081ff50f68dd6bb34f7e
---

# Architect builder readings for `ABC-196` on `grugops/ABC-196` @ `6d15460b` (from `main` `a7857e0b`): base harness rc 0 at `25 of 25` on D2, R and L; the fixed harness exits 1 on each, naming only the silent limbs. Head output 177 lines byte-equal; base instrument still red on the same 9 limbs (+1 line); QE's D1/D3/D4/D5 still exit 2; gates 59 / 1994 = base; waiver prints nothing

Cites the page `plans/tickets/ABC-196-…md` (`## Scope`, `## Acceptance` A1–A7) and BA/PM `…observation-466ee18d` (the cut's prototype readings) as authoritative. Every number below was measured on this hop, not copied.

**Environment.**
- One wrapper ran every git and harness call: private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS`, `GIT_EXTERNAL_DIFF`, `GIT_DIR` and `GIT_WORK_TREE` unset. No timing.
- The harness's `<repo>` was a full `git clone` of main at `a7857e0b`, in session scratch outside the repository, with its own `.git`. The harness makes its own `--shared` plant clone of that.
- Instruments were scratch copies, each beside a `node_modules/typescript` symlink to main's. Main's `node_modules/` was only resolved, never written.
  - head: `clause-b.mjs` at `a7857e0b`, sha-256 prefix `24b963b14fa4f1bf`;
  - base: `git show 99d07d32:…`, `2c0c1985e6607110`.
- `src/` and the probe dir are unchanged from `219e8e33` to `a7857e0b` (empty diffstat), so the page's cut readings apply to this base.
- No git config or attribute was set in the repository, any worktree or the real `HOME`. Main's `.git/config` holds `core.*` keys only, and `.git/info/` holds `exclude` and `refs`. (The real `HOME`'s global config already held the owner's own `color.*`/`diff.*` keys; I set none of them. The private env never read them.)

**Harness copies** (sha-256 prefixes):
- base: `eb6eab4b5604a526` (= BA/PM's "today's").
  - D2: `365ffb27af3a4862` (= BA/PM's);
  - L: `821a4d5d4b021d9d`.
- fixed (= committed `6d15460b`): `ac464ef690c7a3a4`.
  - D2: `ff9510151946e5ba`; L: `38a14a7846bafac7`;
  - D1 `b7d8cce05bc923ea`, D3 `d24f05e6c8d50dbe`, D4 `6e6984f9da5a8c7a`, D5 `d7a94660d533f08c`;
  - LF (my own extra) `071f59bc476ed878`.
- Each copy differs from its source by one line:
  - D2: `pe`'s `slice\(2\)` → `slice\(9\)`;
  - L: `pp`'s leak() `printf` removed;
  - D1: `pp`'s `isSquareAttackedBy` → `…ZZ`;
  - D3: `sp SP-N5 'q t.ts'` → `'q_t.ts'`;
  - D4: `PP-TPL`'s twin keeps `++`;
  - D5: `pe`'s three template anchors → `functionZZ `;
  - LF: leak() keeps `process.env.FEN_URL` and returns `u` (no `fetch`).
- **R** = scratch commit `14fea7d4` on `a7857e0b`. Its only change splits `src/cli.ts:138` into `const argv = process.argv.slice(2);` + `const resolution = resolveOptions(argv);`. It is BA/PM's `99518856` with a different author and date.

## A2 (red first: base harness, head instrument)
| run | rc | summary | TW rows |
|---|---|---|---|
| at `a7857e0b` | 0 | `25 of 25` | PP-EDIT FIRES/does not fire; the rest FIRES/FIRES |
| D2 | **0** | `25 of 25` | PP-EDIT `L2 … identical (limb 2: does not fire)`; plant check `1 on the plant, 0 on its twin` |
| at R `14fea7d4` | **0** | `25 of 25` | PP-EDIT as D2 |
| L | **0** | `25 of 25` | PP-TPL, PP-REDIR, RA-PLUS: limbs 2 and 3 `does not fire` (`identical` to the twin) |

## A3 (fixed harness, head instrument)
| run | rc | the one new line names |
|---|---|---|
| D2 | **1** | `PP-EDIT:limb2` |
| at R | **1** | `PP-EDIT:limb2` |
| L | **1** | `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3` |
| LF (own) | 1 | `PP-TPL:limb3 PP-REDIR:limb3 RA-PLUS:limb3` (limb 2 still FIRES on `process.env`, so it is not named) |
- In D2, R and L, the fixed output differs from base's on the same drift ONLY in line 177. The `25 of 25` summary becomes `r2-mutants: limbs 2/3 verdict on the plant not as the row expects (FIRES and FIRES; PP-EDIT FIRES and does not fire): …`.
- There is no `MISMATCH` or `DIFFER` line, and no other row is named. stderr is empty.

## A4 (fixed harness at base, head instrument)
- rc **0**, `25 of 25`, 177 lines, `cmp` byte-equal to base's harness on the same tip.
- The 139 lines (2–140, header line excluded) read sha-256 prefix `a00519f3ddcc2ca2` on both. BA/PM's `692a5a3e34a820a6` was taken at tip `219e8e33`; plant ids depend on the tip.
- At R, base and fix share `df3beaf83c3aba38`.
- At `0dfd17b3` (the tip of the committed `r2-mutants.out.txt`) the fixed harness's output is `cmp` byte-equal to that file. So it is not regenerated.

## A5 (fixed harness at base, pre-`ABC-195` instrument)
- rc **1**.
- `r2-mutants: limb 1 MISMATCH: RA-PLUS SP-N5`.
- The `limbs 2/3 DIFFER` line is identical to base's harness on the same instrument: `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3`.
- `/usr/bin/diff` base vs fix: one added line, 178, naming the same 9 limbs as not as expected. The 139 lines are `a00519f3ddcc2ca2` on both.

## A6 (fixed harness, head instrument, at base)
- D1: rc 2, `plant PP-TPL failed the plant check: stand-in lines 0 on the plant, 0 on its twin`.
- D3: rc 2, `plant SP-N5 … 0 on the plant, 0 on its twin`.
- D4: rc 2, `plant PP-TPL … 1 on the plant, 1 on its twin`.
- D5: rc 2, `plant PP-EDIT … 0 on the plant, 0 on its twin`.

## A1, A7 (tip `6d15460b`)
- `git diff --name-only main...HEAD` = `.grugops/context/design-F-072-1/probe/r2-mutants.sh` only; numstat 22 `+` / 12 `−`.
- `src/`, `biome.json`, `.gitattributes`, `AGENTS.md`, `plans/`, `memory-bank/` unchanged.
- UAT waiver, owner's form (`git -c core.quotePath=false diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'`): prints nothing, both over `a7857e0b..6d15460b` and over `6d15460b~1..6d15460b`.
- lint rc 0 (116 files), typecheck rc 0, build rc 0.
- `npm test` rc 0, 59 files / 1994 tests. `.test-results/last-run.json`: `success: true`, 0 failed, 0 pending, 0 todo. Equal to base.
- Skip-count capture as spelled: `0`. `test-skip-integrity.js --skip-count 0`: `No findings.`
- Heap 128 (set by `npm test` and the capture); no one-file run was needed.

Scratch (not committed): `penv`, `run.sh`, `h/*.sh`, `out/*.{out,err,rc}`, `inst/clause-b{,.base}.mjs`, `repo/`.
