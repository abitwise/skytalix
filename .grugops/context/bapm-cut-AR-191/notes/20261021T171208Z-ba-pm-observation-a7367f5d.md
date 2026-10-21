---
id: 20261021T171208Z-ba-pm-observation-a7367f5d
kind: observation
by: ba-pm
at: 2026-10-21T17:12:08Z
verified_by: 
confidence: high for the readings (scratch prototype, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, measured); the prototype is not a design
refs:
  - ABC-193
  - ABC-191
  - AR-191-GITENV
  - AR-191-QUOTEPATH
  - QE-191-a
  - QE-191-b
  - QE-191-c
  - ADR-0036
  - ADR-0036 S1
  - F-095-1
  - V1.2.5
  - V5.2.1
  - V5.3.2
  - 837e8b22
  - 05f764cb
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/security-nfr-QE-191-a/probe/RUN.txt
  - 20261021T165304Z-security-nfr-decision-7c1f3590
  - 20261021T165257Z-security-nfr-observation-62620bb0
  - 20261021T165411Z-orchestrator-decision-eb401873
  - 20261021T164012Z-qe-e2e-observation-9bc0b262
supersedes: 
seal: sha256:bbeceec971ffd796e2edfb05785cad69d588a4845b0074575690ca1ce47a3154
---

# BA/PM readings for the `AR-191-GITENV` + `AR-191-QUOTEPATH` cut, at `main` `05f764cb`: base red is exactly 7 harness rows and 14 limb diffs, and each flag's red set is its own. Security's C-quoted clause does NOT hold with the flag alone: an unreached or reached `src/q"t.ts` is silent. A 3-line dispute rule closes it

Cites the `## Scope` and `## Risks` of Security/NFR `…7c1f3590` § 2–3 and the owner record `…eb401873` as authoritative. Security's own readings are in `…62620bb0`. These are from a scratch prototype only, which is not a design.

**Environment.** Everything ran under the session scratchpad with a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL`, and `GIT_CONFIG_NOSYSTEM=1`. Plants live in `git clone --shared` scratch clones with their own `.git`.
- No git config or attribute was set in the repository or in any worktree.
- `git status --porcelain` was empty after the runs, and `HEAD` stayed `05f764cb`.
- git 2.56.0, Node 26.11.1. No timing was taken.

## Setup
- **Base instrument:** `git show main:<clause-b.mjs>`, sha-256 `d3abb8478f9e372e…`. It is byte-identical to `837e8b22`'s.
- **Prototype instrument** (sha-256 `4b5aa5d2667912c7…`; 2 edited lines):
  - the one diff argv gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`;
  - the `git` helper prefixes `-c core.quotePath=false` to every call.
- **The (c) prototype** (`proto2`): the same, plus 3 added lines. It collects every `--- "`/`+++ "` header of the one diff, and pushes each one as an unresolved item, `<path> (C-quoted by git; not read)`.
- **Partial copies:**
  - flags only, without the quotePath;
  - quotePath only, without the flags;
  - without `--no-color`;
  - without `--no-ext-diff`;
  - without both prefix flags;
  - without `--src-prefix` only;
  - without `--dst-prefix` only.
- **Harness:** a scratch copy of `main`'s `r2-mutants.sh`, with:
  - `mk` reading `git -c core.quotePath=false diff --cached --name-only`;
  - a `RON`/`ROFF` hook around the head instrument's runs only, so the `341da4c1` reference always runs with the route off;
  - a `QP` reference mode: `341da4c1` run with `GIT_CONFIG_COUNT=1 core.quotePath=false`;
  - eight rows after `BIN-ATTR`: `ADD` (control), `G-COLOR`, `G-EXT`, `G-ENV`, `G-DRV` (`diff.ext.command` + `.git/info/attributes` `src/** diff=ext`), `G-PFX`, `QU` and `QE2`, all as on the page;
  - a leftover check: exit 2 if any `color.*`/`diff.*` key or `.git/info/attributes` is left.

## Harness runs (`bash r2-proto.sh <repo> 05f764cb <scratch> <instrument>`)
| instrument | rc | limb 1 MISMATCH | limbs 2/3 DIFFER |
|---|---|---|---|
| base | 1 | `G-COLOR G-EXT G-ENV G-DRV G-PFX QU QE2` | those 7 × limb2, limb3 (14) |
| prototype | 0 | none (20 of 20) | none |
| (c) prototype | 0 | none; output equals the prototype's byte for byte after the header line | none |
| flags only (no quotePath) | 1 | `QU QE2` | their 4 |
| quotePath only (no flags) | 1 | `G-COLOR G-EXT G-ENV G-DRV G-PFX` | their 10 |
| without `--no-color` | 1 | `G-COLOR` | its 2 |
| without `--no-ext-diff` | 1 | `G-EXT G-ENV G-DRV` | their 6 |
| without both prefix flags | 1 | `G-PFX` | its 2 |
| without `--dst-prefix` only | 1 | none | `G-PFX:limb2 G-PFX:limb3` |
| without `--src-prefix` only | 0 | none | none (`ADD` has no `-` line) |

- **Existing rows:** the 12 existing rows print byte-identical output on base and on the prototype (83 lines, header aside). `ADD` reads `ok` and `identical` on base.
- **Prototype, every new row:**
  - `(b1) capability: 1`;
  - `ADD` and the route rows print `src/fen.ts  (fired by Ruling 2: 2 + lines, 0 - lines; holds limb 1 at <head>)`;
  - `QU` and `QE2` print `src/qé.ts  (… 2 + lines, 0 - lines; holds limb 1 at <head>)`, with the name unquoted;
  - limb 3 FIRES on `ADD`, the five route rows and `QE2`, and not on `QU`.
- **Base, every route row:** `production files changed: 0`, `(b1) capability: 0`, `does not fire`.

## By hand (scratch clone at `05f764cb`)
- **`PFX-X1`** (X1's plant; clone-local `diff.srcPrefix=x/`, `diff.dstPrefix=y/`):
  - base: `does not fire`;
  - prototype: FIRES, `1 + line, 3 - lines` (X1's own counts, as with no route);
  - without `--src-prefix`: `1 + line, 0 - lines`;
  - without `--dst-prefix`: `0 + lines, 3 - lines` and `production files changed: 0`.

  On a deletion-only plant (the import line deleted): the prototype reads `0 + / 1 -`, the copy without `--src-prefix` reads `0 / 0`, and base does not fire.
- **C-quoted names.** `core.quotePath=false` still quotes `"`, `\`, a tab and a newline (`git -c core.quotePath=false diff --name-only` printed `"src/q\"t.ts"` and `"src/q\tt.ts"`).

  | plant | base L1 / L3 | prototype L1 / L3 | (c) prototype L1 / L3 |
  |---|---|---|---|
  | `CQ1`: new unreached `src/q"t.ts` with `node:fs` | silent / silent | silent / silent | FIRES (disputed) / FIRES (disputed) |
  | `CQT`: the same with a tab | silent / silent | silent / silent | FIRES (disputed) / FIRES (disputed) |
  | `CQ2`: base `cli.ts` gains `import './q"t.ts';` plus a benign file; head adds `node:fs` + `fetch` | silent / silent | silent / silent | FIRES (disputed) / FIRES (disputed) |
  | `CQS`: on `CQ2`'s base, head appends a comment line to `src/fen.ts` | — | L1 silent | silent / silent; no dispute names the file |

  `CQ2`'s base pair (the import added) FIRES (disputed) on both instruments: `src/cli.ts -> src/q"t.ts (not a production file at <head>)`.

  **So Security/NFR `…7c1f3590` § 3's "Any path still C-quoted … FIRES (disputed) and is not dropped" is not a property of `core.quotePath=false`.** It needs its own rule, now Scope 1 (c) and `A6` on the page.
- **Git shim on `ADD`, limb 1:**
  - base: 87 calls, 0 with the `-c`;
  - prototype and (c) prototype: 87 calls, 87 with `-c core.quotePath=false`;
  - one diff call: `-c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <b> <h> -- src`;
  - still `execFileSync` with an argv.
- **The stand-in** in main's checkout at 2026-10-21T17:08Z prints nothing. The local config holds only `core.*` keys, and `extensions.worktreeConfig` is unset.

## Ids
`ABC-193` is free (no page under `plans/tickets/`; the last cut, `bapm-rule-QE-176`, names it next).
