---
id: 20261021T185456Z-ba-pm-observation-7e1a757e
kind: observation
by: ba-pm
at: 2026-10-21T18:54:56Z
verified_by: 
confidence: high for the readings (scratch prototype, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM=1, measured); the prototype is not a design
refs:
  - ABC-195
  - ABC-193
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - QE-193-a
  - QE-193-b
  - QE-193-c
  - QE-193-e
  - R-193-a
  - ADR-0036
  - ADR-0036 S1
  - F-095-1
  - V1.2.5
  - V5.2.1
  - V5.3.2
  - 65bc4375
  - 63eadabe
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/security-nfr-QE-193/probe/fix-prototype.patch
  - .grugops/context/security-nfr-QE-193/probe/repro.sh
  - 20261021T183616Z-security-nfr-decision-5719a86d
  - 20261021T183537Z-security-nfr-observation-c5270049
  - 20261021T183723Z-orchestrator-decision-73e94c9f
  - 20261021T182104Z-qe-e2e-decision-69c93667
  - 20261021T182104Z-qe-e2e-observation-9c7a6680
supersedes: 
seal: sha256:a5ad58f85b458fa1ce84a2fa5f03a9cda003de509df9a1e99910a4b230a5c462
---

# BA/PM readings for the `AR-193-HUNKHDR` + `AR-193-SPACEPATH` cut, at `main` `65bc4375`: base red is exactly `MISMATCH: RA-PLUS SP-N5` and 9 limb diffs; each part's red set is its own; the fix is 25 of 25 with the 20 rows byte-identical. `341da4c1` is blind on all five plants, so the rows need a control-twin reference, and today's Ruling 2 list parse reads a spaced name as `src/q@<head>`

Cites Security/NFR `…5719a86d` § 1–3 (the ratings, what the fix must hold, the close terms) and the owner record `…73e94c9f` as authoritative. Security's readings: `…c5270049` and `.grugops/context/security-nfr-QE-193/probe/`. These are from a scratch prototype only, which is not a design.

**Environment.** Everything ran under the session scratchpad with a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file), and `GIT_CONFIG_NOSYSTEM=1`. Plants live in `git clone --shared` scratch clones with their own `.git`, fixed commit dates.
- No git config or attribute was set in the repository or any worktree. The scratch clones held no `color.*`/`diff.*` key and no `.git/info/attributes` at the end.
- `main` stayed `65bc4375`. `git status --porcelain` in the private env shows only `?? .claude/settings.local.json` (the owner's file, normally hidden by his global `~/.gitignore`, per `…73e94c9f`); nothing of mine outside `plans/` and these notes.
- git 2.56.0, Node 26.11.1. No timing was taken.

## Setup
- **Base instrument:** `git show HEAD:<clause-b.mjs>`, sha-256 `2c0c1985e6607110…`, the same file as `63eadabe`.
- **Fix prototype:** base plus Security's `probe/fix-prototype.patch` (applied clean), sha-256 `ea705e8324049c87…`; 8 added / 5 removed lines by numstat, three hunks at base lines 210–224, all inside `changedLines` (206–236). The `git("diff", …)` line is untouched.
- **Part copies:** `onlyA` (header window, no TAB strip) and `onlyB` (TAB strip, no header window).
- **Harness:** a scratch copy of `main`'s `r2-mutants.sh` with:
  - five rows after `QE2`, Security's plant bodies from `repro.sh`: `PP-TPL`, `PP-REDIR`, `RA-PLUS`, `PP-EDIT`, `SP-N5`;
  - a `TW` reference mode: limbs 2/3 compared with `341da4c1` on a control twin (the `++` replaced by `x`; for `SP-N5`, `src/q-t.ts` for `src/q t.ts`, mapped back with `sed`), the `  diff …;` pair ids masked on both sides;
  - the Ruling 2 list parse changed to split at the two spaces before `(fired by Ruling 2:`;
  - the summary line reading 25.

## Harness runs (`bash r2-proto.sh <repo> 65bc4375 <scratch> <instrument>`)
| instrument | rc | limb 1 MISMATCH | limbs 2/3 DIFFER | 20 old rows vs main's harness on base |
|---|---|---|---|---|
| base | 1 | `RA-PLUS SP-N5` | `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3` (9) | byte-identical |
| fix | 0 | none (25 of 25) | none | byte-identical (139 lines) |
| onlyA (no TAB strip) | 1 | `SP-N5` | `SP-N5:limb2 SP-N5:limb3` | byte-identical |
| onlyB (no header window) | 1 | `RA-PLUS` | `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2` (7) | byte-identical |

- `main`'s own harness on base: rc 0, 20 of 20.
- **Base on the new rows:** `PP-TPL`, `PP-REDIR`, `PP-EDIT` limb 1 `does not fire` (as expected), limbs 2/3 `does not fire`; `RA-PLUS` limbs 1/2/3 `FIRES (disputed …)`; `SP-N5` limbs 1/2/3 `does not fire`, `(b1) capability: 0`. `PP-EDIT:limb3` is `identical` (neither instrument fires).
- **Fix on the new rows:** limb 1 as the page's table; `SP-N5` `(b1) capability: 1`, `src/q t.ts  (fired by Ruling 2: 3 + lines, 0 - lines; holds limb 1 at <head>)`, R2 list `src/q t.ts@<head>`.

## By hand (plant ids from the harness: `PP-TPL` `96c45299`, twin `46b1f0f6`; `PP-REDIR` `9426cd7a`/`a4fe0d39`; `RA-PLUS` `69267968`/`b01f1b5f`; `PP-EDIT` `61dae094`/`4f1781f2`; `SP-N5` `92c9dc23..ac9128a1`, twin `6daa4a20..30ea4e85`)
- **`341da4c1` on the same plant:** limbs 2 and 3 `does not fire` on all five. So the existing same-plant reference would hold head to blindness; the twin is needed.
- **Fix, capability lines (at `65bc4375`):** `PP-TPL`/`PP-REDIR`/`RA-PLUS` limb 2 `src/fen.ts:351  const u = process.env.FEN_URL ?? "";`, limb 3 `src/fen.ts:352  return (await fetch(u)).text();`; `PP-EDIT` limb 2 `src/cli.ts:142  const resolution = resolveOptions(process.argv.slice(1));`, limb 3 does not fire; `SP-N5` limb 2 `src/q t.ts:3 …process.env.Q…`, limb 3 `src/q t.ts:4 …fetch…`.
- **`PP-REDIR` limb 2 file list:** fix `production files changed: 1` (`src/fen.ts`); base `2` (`src/fen.ts`, `src/glyph-mode.ts`).
- **`RA-PLUS` `C-quoted` lines per limb 1/2/3:** fix 0/0/0; base 1/1/1.
- **Today's harness parse on `SP-N5`'s fix output:** `src/q@<head>`. The parse must change for the row to read.
- **Stand-in lines on the five plants:** 1, 1, 1, 1, 2; on each twin: 0. Over `47a3c9a1..65bc4375` in the private env: nothing.
- **Quoted names** (one commit adding unreached `src/q"t.ts`, `src/a "b.ts`, `src/c<TAB>d.ts`, each with `node:fs`): limb 1 FIRES (disputed) with 3 `C-quoted` lines on fix and on base alike.
- **The `-- ` mirror (QE's `PM` shape on `src/book-file.ts`):** fix `0 + lines, 2 - lines`; base `0 + lines, 1 - line`; both FIRE.
- **`GIT_DIFF_OPTS=--unified=5`, `PP-TPL` limb 3:** fix FIRES; base does not fire.

## Ids
`ABC-195` is free (no page under `plans/tickets/`; the last cut, `bapm-rule-QE-192`, names it next).
