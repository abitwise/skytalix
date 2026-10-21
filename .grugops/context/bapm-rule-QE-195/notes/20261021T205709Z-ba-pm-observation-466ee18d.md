---
id: 20261021T205709Z-ba-pm-observation-466ee18d
kind: observation
by: ba-pm
at: 2026-10-21T20:57:09Z
verified_by: 
confidence: high for the readings (own runs in a scratch clone outside the repository, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM=1; no timing); the prototype is not a design
refs:
  - ABC-196
  - ABC-195
  - QE-195-a
  - QE-195-b
  - QE-195-c
  - AR-193-HUNKHDR
  - ADR-0036 S1
  - QE-182-a
  - QE-194-a
  - QE-194-b
  - 219e8e33
  - 99518856
  - 99d07d32
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
  - plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
  - 20261021T203404Z-qe-e2e-decision-f36a06c3
  - 20261021T203404Z-qe-e2e-observation-741eebba
  - 20261021T203559Z-orchestrator-decision-ed1933d8
  - 20261021T185506Z-ba-pm-decision-d7a70688
  - 20261021T201955Z-ba-pm-decision-54e03439
supersedes: 
seal: sha256:f41b719a4fc58552930e129077cb7a3e58517011f93766e8dc358f69f1dee5b1
---

# BA/PM readings for the `QE-195-a` ruling, at `main` `219e8e33`: today's harness exits 0 at `25 of 25` with QE's D2 drift, at a scratch tip whose only change refactors `src/cli.ts`'s argv read, and with `pp`'s `leak()` line dropped. A prototype limb 2/3 verdict guard reds all three, naming only the silent rows; head output is byte-equal (177 lines), and base's instrument is still red on the same 9 limbs

Cites QE `…f36a06c3` (gap register) and `…741eebba` (D1–D5) as authoritative for `QE-195-a`. These are BA/PM's own runs, taken to rule and to measure base red for the cut. The prototype is not a design.

**Setup.**
- A `git clone` of this repository at `219e8e33` in session scratch, outside the repository, with its own `.git`.
- One wrapper ran everything: private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), `GIT_CONFIG_NOSYSTEM=1`, with `GIT_DIFF_OPTS`, `GIT_EXTERNAL_DIFF`, `GIT_DIR` and `GIT_WORK_TREE` unset. No timing.
- Instruments are scratch copies, each beside a `node_modules/typescript` symlink to main's. Main's `node_modules/` was only resolved, never written.
  - head: `clause-b.mjs` at `219e8e33`, sha-256 prefix `24b963b14fa4f1bf` (= QE's head);
  - base: `git show 99d07d32:…/clause-b.mjs`, `2c0c1985e6607110` (= the page's).
- Harness copies (sha-256 prefixes): today's `r2-mutants.sh` `eb6eab4b5604a526`; D2 `365ffb27af3a4862`; prototype (a) `0f6920deba8606de` (8 changed + 3 added lines); prototype D2 `95b6a83157e1e91f`.
- Main stayed clean (`git status --porcelain` empty, `HEAD` `219e8e33`) before and after.

**The three drifts:**
- **D2** (QE's): `pe`'s in-place anchor `slice\(2\)` → `slice\(9\)`.
- **R:** a scratch commit `99518856` on `219e8e33` whose only change splits `src/cli.ts:138` into `const argv = process.argv.slice(2);` + `const resolution = resolveOptions(argv);`. The harness is unchanged and runs with `<tip>` = `99518856`.
- **L:** the one `printf` that appends `leak()` in `pp` is removed.

**Today's harness, head's instrument** (base red):

| run | rc | summary | silent rows |
|---|---|---|---|
| `219e8e33` | 0 | `25 of 25` | — (PP-EDIT limbs 2/3 `FIRES`/`does not fire`, the rest `FIRES`/`FIRES`) |
| D2 at `219e8e33` | **0** | `25 of 25` | PP-EDIT `L2 … identical (limb 2: does not fire)`; the plant check reads `1 on the plant, 0 on its twin` |
| at R `99518856` | **0** | `25 of 25` | PP-EDIT as D2 |
| L at `219e8e33` | **0** | `25 of 25` | PP-TPL, PP-REDIR, RA-PLUS: limbs 2/3 `does not fire` on both sides |

**Prototype (a): each `TW` row asserts its own expected limb 2/3 verdicts** (FIRES/FIRES ×4; PP-EDIT FIRES/does not fire). A mismatch adds the row:limb to a new list and prints `r2-mutants: limbs 2/3 verdict not as the row expects …`, rc 1.

| run | rc | names |
|---|---|---|
| `219e8e33`, head | 0 | `25 of 25`; whole output **byte-equal (`cmp`) to today's, 177 lines** |
| D2, head | **1** | `PP-EDIT:limb2` only |
| at R, head | **1** | `PP-EDIT:limb2` only |
| L, head | **1** | `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3` only |
| `219e8e33`, base instrument | 1 | `limb 1 MISMATCH: RA-PLUS SP-N5`. The `DIFFER` line is identical to today's harness on base's instrument (the 9 limbs). The new line names the same 9 limbs |

- The 20 earlier rows (139 lines, header excluded) read sha-256 prefix `692a5a3e34a820a6` in all four of these: today's harness and the prototype, each on head's and on base's instrument.
- **A prototype trap:** the row's existing `printf` passes `$b` unquoted, so a status word with spaces splits. Quoting it leaves the head output byte-equal.
- **Not re-run:** QE's D1, D3, D4, D5. Prototype (a) does not touch `mk`, `hh` or `pc`.

**Context read.**
- `src/cli.ts`'s last five commits: `be6a5599` ABC-174, `a48da51c` ABC-096, `ac8deab1` ABC-101, `09740ea4` ABC-095, `1416a069` ABC-132 (docs).
- The harness header says the plant check exists "so a plant whose anchor drifts never runs as a silent control".
- `ADR-0036`'s `ABC-195` block only describes the plant check ("exits 2 unless the stand-in's awk prints …"); it makes no "never silent" claim.
- No Backlog or Ready ticket touches `.grugops/context/design-F-072-1/probe/`, so there is no fold target.
- **Unmeasured (`UNKNOWN - verify`):** six of the 20 earlier rows (`P2c`, `X1`, `G1B`, `REN`, `BIN-NUL`, `BIN-ATTR`) make two or more substitutions in one file, and `mk` checks only file lists. Whether a partial apply there can stay green was not measured. It is fenced on `ABC-196`.

**Files touched (records only, uncommitted on `main` `219e8e33`):**
- `plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md` (new);
- `plans/board.md` (one `_Updated:` line; the card in Ready, WIP 1/8);
- `plans/tickets/ABC-195-…md` (+2 lines: a dated ruling block).

Scratch outputs (not committed): `penv`, `h/{base,D2,fixA,fixA-D2,base-L,fixA-L}.sh`, `out/*.{out,err,rc}`, `inst/clause-b{,.base}.mjs`.
