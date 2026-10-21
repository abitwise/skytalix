---
id: 20261021T201014Z-architect-design-observation-1bafd98d
kind: observation
by: architect-design
at: 2026-10-21T20:10:14Z
verified_by: 
confidence: high (measured on this branch in scratch clones, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM=1; no timing)
refs:
  - ABC-195
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - QE-193-a
  - QE-193-b
  - QE-193-c
  - R-193-a
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - F-095-1
  - 99d07d32
  - 5e840c58
  - 0dfd17b3
  - 6b0f8575
  - 63eadabe
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
  - 20261021T185456Z-ba-pm-observation-7e1a757e
  - 20261021T185506Z-ba-pm-decision-d7a70688
  - 20261021T183616Z-security-nfr-decision-5719a86d
  - 20261021T183537Z-security-nfr-observation-c5270049
  - 20261021T183723Z-orchestrator-decision-73e94c9f
  - 20261021T182327Z-orchestrator-decision-f61be5db
supersedes: 
seal: sha256:b2499b66bcf11a800da32743aca2cfbea42274aa8f6c64dcf342a362883ecb36
---

# Architect builder readings for `ABC-195` on `grugops/ABC-195` (from `main` `99d07d32`): A2 red is exactly `MISMATCH: RA-PLUS SP-N5` and the page's 9 limbs; each A3 copy reads its own red set; A4 green 25 of 25 with the 20 earlier rows byte-equal to base (139 lines); A5–A7 as the page states; gates 59 / 1994 = base; waiver and stand-in print nothing

Cites the page `plans/tickets/ABC-195-…md` (`## Scope`, Acceptance) and BA/PM `…observation-7e1a757e` (the cut's prototype readings) as authoritative. Every number below was re-measured on this branch, not copied.

**Environment.** Every harness and by-hand run went through one wrapper that sets a private `HOME`, `TMPDIR` and `GIT_CONFIG_GLOBAL` (an empty file) and `GIT_CONFIG_NOSYSTEM=1` (and unsets `GIT_DIFF_OPTS`/`GIT_EXTERNAL_DIFF`), under the session scratchpad. Plants lived only in `git clone --shared` scratch clones with their own `.git`. git 2.56.0, Node 26.11.1. No timing was taken.
- No git config, `.git/info/attributes` or attributes file was set in the repository, any worktree or the real `HOME`. Main's `.git/config` holds `core.*` keys only; `.git/info/` holds `exclude` and `refs`. `node_modules/` in main's checkout was only read (a symlink from the worktree points at it).
- `git status --porcelain` empty in main's checkout and in `../wt-ABC-195` after the runs. Around the A2–A4 runs, `../wt-ABC-195`'s status, `HEAD` and the full ref list were unchanged. (Other agents moved `main` to `5427f807` and committed on `grugops/ABC-194` / `grugops/qe-ABC-194` concurrently, records only, no file overlap; not this hop's.)

**Commits.** `5e840c58` the harness only (so red runs first); `0dfd17b3` the instrument (A2–A7 ran at this tip); `6b0f8575` the ADR block and `r2-mutants.out.txt` (= the A4 run). Instrument sha-256: base `2c0c1985e6607110…` (= `63eadabe`'s), head `24b963b14fa4f1bf…`. Instrument numstat 8 `+` / 5 `−`; harness 66 / 8.

## A2 (red first; base instrument `git show 99d07d32:<instrument>`)
- At `5e840c58` and again at `0dfd17b3`: rc **1**. `r2-mutants: limb 1 MISMATCH: RA-PLUS SP-N5`.
- `limbs 2/3 DIFFER …: PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3` (9). `PP-EDIT:limb3` `identical` (neither fires).
- The 20 earlier rows `ok`, limbs 2/3 `identical`; byte-identical to `main`'s harness on base's instrument at the same tip (139 lines).

## A3 (copies of head's instrument with one part removed; tip `0dfd17b3`)
| copy | rc | limb 1 MISMATCH | limbs 2/3 DIFFER |
|---|---|---|---|
| without (b), the TAB | 1 | `SP-N5` | `SP-N5:limb2 SP-N5:limb3` |
| without (a), the header window | 1 | `RA-PLUS` | `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2` (7) |
- In both, the 20 earlier rows are byte-identical to A4's and to base's (139 lines).

## A4 (green; head's instrument by absolute path, tip `0dfd17b3`)
- rc **0**: `r2-mutants: 25 of 25 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on the same plant on 11 of 11, on the same plant with the route off on G-COLOR G-EXT G-ENV G-DRV G-PFX, with core.quotePath=false in its environment on QU and QE2, on X1 (plant ids masked) on BIN-NUL and BIN-ATTR, and on its twin (pair ids masked) on PP-TPL PP-REDIR RA-PLUS PP-EDIT SP-N5`.
- New rows: limb 1 `does not fire` / R2 `-` on `PP-TPL`, `PP-REDIR`, `RA-PLUS`, `PP-EDIT`; `SP-N5` `FIRES` / `src/q t.ts@<head>`. Limbs 2/3 at head: FIRES/FIRES, FIRES/FIRES, FIRES/FIRES, FIRES/does not fire, FIRES/FIRES, each `identical` to `341da4c1` on its twin.
- Plant check: stand-in lines 1, 1, 1, 1, 2 on the plants; 0 on each twin.
- The 20 earlier rows byte-identical to base's harness on base's instrument on the same tip (139 lines; header line aside).
- Every clone afterwards: 0 `color.*`/`diff.*` keys, `.git/info` holds `exclude` only.

## A5 (by hand on A4's plants; `PP-TPL` `fee8e0e1`, `PP-REDIR` `74b7f26c`, `RA-PLUS` `97825ce3`, `PP-EDIT` `7279147a` on `0dfd17b3`; `SP-N5` `59ac202c..d6a7f118`)
- `SP-N5`: `(b1) capability: 1`; `src/q t.ts  (fired by Ruling 2: 3 + lines, 0 - lines; holds limb 1 at <head>)`, no TAB (`cat -t`); limb 2 `src/q t.ts:3`, limb 3 `src/q t.ts:4`. Base: `production files changed: 0`, all three limbs `does not fire`.
- `PP-TPL`, `PP-REDIR`, `RA-PLUS`: limb 2 `src/fen.ts:351  const u = process.env.FEN_URL ?? "";`, limb 3 `src/fen.ts:352  return (await fetch(u)).text();`.
- `PP-EDIT`: limb 2 `src/cli.ts:142  const resolution = resolveOptions(process.argv.slice(1));`; limb 3 does not fire.
- `PP-REDIR` limb 2: `production files changed: 1` (`src/fen.ts`); base `2` (`src/fen.ts`, `src/glyph-mode.ts`).
- `RA-PLUS` `C-quoted` lines per limb 1/2/3: head 0/0/0; base 1/1/1 (`FIRES (disputed …)`).

## A6 (by hand, own scratch clone at `0dfd17b3`)
- One commit adding unreached `src/q"t.ts`, `src/a "b.ts`, `src/c<TAB>d.ts`, each with `node:fs`: limb 1 FIRES (disputed) with 3 `C-quoted` lines on head and on base alike. (`"src/a \"b.ts"` keeps its trailing TAB in the dispute line, cosmetic, out of scope.)
- QE's `PM` on `src/book-file.ts` (base adds a template line `-- promoted pieces` and a tail `// tail`; head deletes both): head `0 + lines, 2 - lines`, base `0 + lines, 1 - line`; both FIRE.

## A7
- `git diff -U0 99d07d32 HEAD -- <instrument>`: three hunks at base lines 210, 213–215, 223–224, inside `changedLines` (206–236). The `git("diff", …)` line is byte-identical; still one `execFileSync` with an argv, no shell (`V1.2.5`).

## A1, A8, A9 (tip `6b0f8575`)
- `git diff --name-only main...HEAD` = the 4 Scope files. `src/`, `biome.json`, `.gitattributes`, `AGENTS.md`, `plans/` unchanged.
- UAT waiver (owner's form, `git -c core.quotePath=false diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'`): prints nothing over `99d07d32..6b0f8575` and for each of the three commits, in my shell and in the private env.
- HUNKHDR stand-in (`…73e94c9f`): prints nothing over the same range and each commit, both environments (2026-10-21T20:08Z).
- ADR-0036: 43 `+` lines, 0 `−`; the block follows the `ABC-193` block.
- lint rc 0 (116 files), typecheck rc 0, build rc 0. `npm test` rc 0, 59 files / 1994 tests; `.test-results/last-run.json` `success: true`, 0 failed, 0 pending, 0 todo. Equal to base. Skip-count capture as spelled: `0`; `test-skip-integrity.js --skip-count 0`: `No findings.` Heap 128 (set by `npm test` and the capture); no one-file run was needed.
