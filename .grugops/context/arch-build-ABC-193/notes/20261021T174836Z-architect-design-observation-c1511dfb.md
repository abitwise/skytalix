---
id: 20261021T174836Z-architect-design-observation-c1511dfb
kind: observation
by: architect-design
at: 2026-10-21T17:48:36Z
verified_by: 
confidence: high (measured on this branch in scratch clones, private HOME/TMPDIR/GIT_CONFIG_GLOBAL; no timing)
refs:
  - ABC-193
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - QE-191-a
  - QE-191-b
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - F-095-1
  - R-193-a
  - R-193-b
  - 47a3c9a1
  - e6f91f1d
  - 63eadabe
  - 6b83874c
  - 341da4c1
  - 11245e3d
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md
  - 20261021T171208Z-ba-pm-observation-a7367f5d
  - 20261021T171218Z-ba-pm-decision-7db22c5f
  - 20261021T165304Z-security-nfr-decision-7c1f3590
  - 20261021T165411Z-orchestrator-decision-eb401873
  - 20261021T173242Z-orchestrator-decision-717a2219
supersedes: 
seal: sha256:96f9d2b7ba00ba400b561b45a3f44860923d90044944807fc684da7957277e17
---

# Architect builder readings for `ABC-193` on `grugops/ABC-193` (from `main` `47a3c9a1`): A2 red is exactly the page's 7 rows and 14 limbs; each A3 copy reads its own red set; A4 green 20 of 20 with the 12 earlier rows byte-equal to base; A5–A7 as the page states; gates 59 / 1992 = base

Cites the page `plans/tickets/ABC-193-…md` (`## Scope`, Acceptance) and BA/PM `…observation-a7367f5d` (the cut's prototype readings) as authoritative. Every number below was re-measured on this branch, not copied.

**Environment.** Every harness and by-hand run went through one wrapper that sets a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file) and `GIT_CONFIG_NOSYSTEM=1`, under the session scratchpad. Plants and routes lived only in `git clone --shared` scratch clones with their own `.git`. git 2.56.0, Node 26.11.1. No timing was taken.
- No git config, `.git/info/attributes` or attributes file was set in the repository, any worktree or the real `HOME`. Main's `.git/config` holds `core.*` keys only; `.git/info/` holds `exclude` and `refs` only.
- `git status --porcelain` was empty in main's checkout and in `../wt-ABC-193` after the runs.

**Commits.** `e6f91f1d` the harness only (so red runs first); `63eadabe` the instrument (the code commit; A3–A7 ran at this tip); `6b83874c` the ADR block and `r2-mutants.out.txt` (= the A4 run). Instrument sha-256: base `d3abb8478f9e372e…`, head `2c0c1985e6607110…`.

## A2 (red first; harness `e6f91f1d`, base instrument, tip `e6f91f1d`)
- rc **1**. `r2-mutants: limb 1 MISMATCH: G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2`.
- `limbs 2/3 DIFFER …: G-COLOR:limb2 G-COLOR:limb3 G-EXT:limb2 G-EXT:limb3 G-ENV:limb2 G-ENV:limb3 G-DRV:limb2 G-DRV:limb3 G-PFX:limb2 G-PFX:limb3 QU:limb2 QU:limb3 QE2:limb2 QE2:limb3` (14).
- The 12 earlier rows and `ADD` read `ok` (13), limbs 2 and 3 `identical` (26). Each route row on base: `(b1) capability: 0`, `holder files with changed lines (+ or -): 0`, `does not fire`.
- Re-run at tip `63eadabe` with base's instrument: the same rc, the same two lines.

## A3 (each part's teeth; copies of head's instrument with one part removed, tip `63eadabe`)
| copy | rc | limb 1 MISMATCH | limbs 2/3 DIFFER |
|---|---|---|---|
| no `-c core.quotePath=false` | 1 | `QU QE2` | their 4 |
| no flags (quotePath kept) | 1 | `G-COLOR G-EXT G-ENV G-DRV G-PFX` | their 10 |
| no `--no-color` | 1 | `G-COLOR` | its 2 |
| no `--no-ext-diff` | 1 | `G-EXT G-ENV G-DRV` | their 6 |
| no prefix flags | 1 | `G-PFX` | its 2 |
| no `--dst-prefix=b/` | 1 | none (no MISMATCH line) | `G-PFX:limb2 G-PFX:limb3` |
| no `--src-prefix=a/` | 0 | none | none (read in A6 `PFX-X1`) |

## A4 (green; head's instrument, tip `63eadabe`)
- rc **0**: `r2-mutants: 20 of 20 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on the same plant on 11 of 11, on the same plant with the route off on G-COLOR G-EXT G-ENV G-DRV G-PFX, with core.quotePath=false in its environment on QU and QE2, and on X1 (plant ids masked) on BIN-NUL and BIN-ATTR`.
- 20 rows `ok`, 40 limbs `identical`. The 12 earlier rows: 83 lines, byte-identical to base's run on the same tip (header line aside).
- Every clone afterwards: 0 `color.*`/`diff.*` keys (`git config --local`), `.git/info` holds `exclude` only. The harness's own leftover check passed (exit 0, not 2).

## A5 (counts, from A4's output)
- `ADD` and the five route rows: `(b1) capability: 1`, `src/fen.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`, the same on every route.
- `QU` and `QE2`: `(b1) capability: 1`, `src/qé.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`, unquoted.
- Limb 3 FIRES on `ADD`, the five route rows and `QE2`; `does not fire` on `QU`.

## A6 (by hand, scratch clone at `63eadabe`)
- **`PFX-X1`** (clone-local `diff.srcPrefix=x/`, `diff.dstPrefix=y/`): head FIRES `src/book-file.ts  (fired by Ruling 2: 1 + line, 3 - lines; holds limb 1 at <base>)`. Base `does not fire`, `production files changed: 0`. Without `--src-prefix=a/`: `1 + line, 0 - lines`. Without `--dst-prefix=b/`: `0 + lines, 3 - lines` and `production files changed: 0`.
- **C-quoted plants**, limbs 1 and 3 (`noc` = head without (c), i.e. the flags-and-quotePath copy):

| plant | head | base | noc |
|---|---|---|---|
| `CQ1` new unreached `src/q"t.ts` with `node:fs` | FIRES (disputed), `"src/q\"t.ts" (C-quoted by git; not read)` | does not fire | does not fire |
| `CQT` the same with a tab | FIRES (disputed), `"src/q\tt.ts" (C-quoted by git; not read)` | does not fire | does not fire |
| `CQ2` base: benign `src/q"t.ts` + `cli.ts` `import './q"t.ts';`; head: `node:fs` + `fetch` | FIRES (disputed), `"src/q\"t.ts" (C-quoted by git; not read)` | does not fire | does not fire |
| `CQS` on `CQ2`'s base, head appends a comment to `src/fen.ts` | does not fire; no dispute names `src/q"t.ts` | — | L1 does not fire |

  `CQ2`'s base pair (the import added): both instruments FIRE (disputed) on `src/cli.ts -> src/q"t.ts (not a production file at <head>)`; head also lists the quoted path.

## A7 (git shim on `ADD`, limb 1)
- Head: 87 calls; 87 begin `-c core.quotePath=false`. One `diff` call: `-c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ 63eadabe 846f704b -- src`.
- Base: 87 calls, 0 with the `-c`; one `diff` call.
- Still `execFileSync("git", [argv])`, no shell option (`V1.2.5`).

## A1, A8, A9 and the stand-in (tip `6b83874c`)
- `git diff --name-only main...HEAD` = the 4 Scope files. `src/`, `biome.json`, `.gitattributes`, `AGENTS.md`, `plans/` unchanged.
- UAT waiver, owner's new form (`…717a2219`): `git -c core.quotePath=false diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing for `e6f91f1d`, `63eadabe`, `6b83874c` and over `47a3c9a1..6b83874c`.
- ADR-0036: 30 `+` lines, 0 `−`; the block follows the `ABC-191` block.
- lint rc 0 (116 files), typecheck rc 0, build rc 0. `npm test` rc 0, 59 files / 1992 tests; `.test-results/last-run.json` `success: true`, 0 failed, 0 pending, 0 todo. Equal to base (`03ac8bc4`, `src/` unchanged since). Skip-count capture as spelled: `0`; `test-skip-integrity.js --skip-count 0`: `No findings.` Heap 128 (set by `npm test`); no one-file run was needed.
- GITENV stand-in, in my shell, in `../wt-ABC-193` and in main's checkout (2026-10-21T17:47Z): prints nothing.

## INFO residuals (none against a criterion)
- **`R-193-a`:** the quoted test reads every diff line, so inside a `-U0` hunk a removed line whose text starts `-- "` or an added line starting `++ "` would be listed as a C-quoted path: a false dispute, in the fail-safe direction. The existing `--- `/`+++ ` header parse shares the shape. `src/` holds 0 lines starting `-- ` or `++ ` today.
- **`R-193-b`:** `ls-tree` still drops a C-quoted name from the production set, by the page's design: an unchanged C-quoted file adds nothing (`CQS`), and a new edge to one is the existing `not a production file at <head>` dispute (`CQ2`'s base pair).
- `main` moved to `ec5c42d7` during the hop (the Scribe's waiver merge and queue records). No file overlaps; the branch is not merged with it (the Orchestrator's merge).
