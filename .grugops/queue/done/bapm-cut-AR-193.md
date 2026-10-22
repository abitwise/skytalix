---
subtask: bapm-cut-AR-193
role: ba-pm
tickets: []
branch: main (records only; commit nothing — the Orchestrator commits)
ref: .grugops/context/bapm-cut-AR-193/
width: 1
---

# BA/PM (records only): cut the AR-193-HUNKHDR + AR-193-SPACEPATH fix as one XS/P3 ticket (builder Architect/Design; gates no merge)

## Read first
- Security/NFR result `.grugops/context/security-nfr-QE-193/notes/20261021T183616Z-security-nfr-decision-5719a86d.md`, readings `…c5270049`, and its `probe/` (`repro.sh`, `repro.out.txt`, `fix-prototype.patch`, `r2-fix-vs-head.txt`).
- Orchestrator record `…73e94c9f` (both ARs, the stand-in); QE `qe-ABC-193` `…69c93667`, `…9c7a6680`; `ADR-0036` § S1 (all dated blocks); ABC-193's page as the shape to follow; `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- Cut one ticket (next free id ABC-195) holding exactly what `…5719a86d` says the fix must hold: (a) `---`/`+++` (and the C-quoted test) read as headers only between `diff --git ` and that file's first `@@`; (b) strip one trailing TAB from an unquoted header path; (c) harness rows `PP-TPL`, `PP-EDIT`, `PP-REDIR`, `SP-N5`, `RA-PLUS` firing at head and silent on `63eadabe`, the 20 existing rows unchanged; (d) a dated `ADR-0036` § S1 block retiring the stand-in, which also states block (i)'s scope exactly (QE-193-c). Close conditions as Security ruled. `GIT_DIFF_OPTS` handling: optional, your call, never a close term.
- Measure base red on a scratch prototype outside the repository (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`), as `bapm-cut-AR-191` did.
- Size, priority (XS/P3 per Security), DoR score; column Ready if 10/10. One `_Updated:` line at the top of `plans/board.md` and the card.

## Fences
- Only `plans/` (board, the new ticket page) and your notes. No `src/`, instrument, harness, ADR, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config, `node_modules/`. Commit nothing.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-cut-AR-193`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/bapm-cut-AR-193.md` + `.claim.md`, main's tree, uncommitted).

## Result

**`ABC-195` cut → Ready** (XS, P3, DoR 10/10; builder Architect/Design; gates no merge; 0 `src/` lines). Page: `plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md`. Title: "An added line starting `++ ` hides the later hunks of its file from clause (b), and a production file whose name holds a space goes unseen (the `AR-193-HUNKHDR` and `AR-193-SPACEPATH` fix)".

### What the ticket holds (Security/NFR `…5719a86d` § 3 (a)–(d))
- **(a)** `changedLines` reads `---`/`+++` and the C-quoted test as headers only between `diff --git ` and that file's first `@@`.
- **(b)** An unquoted header path drops one trailing TAB.
- **(c)** `r2-mutants.sh` gains `PP-TPL`, `PP-REDIR`, `RA-PLUS`, `PP-EDIT` and `SP-N5` (25 rows); each fires at head as Security listed and not on `63eadabe`; the 20 existing rows print what they print today. Three harness changes go with them, all measured as needed:
  - a control-twin reference for limbs 2/3, because `341da4c1` is blind on all five plants;
  - a Ruling 2 list parse that reads a spaced name (today's reads `src/q@<head>`);
  - a plant check (stand-in awk ≥ 1 line on each plant, 0 on each twin), so a drifted anchor cannot run as a silent control.
- **(d)** One dated `ADR-0036` § S1 block: header window, TAB, block (i)'s scope stated exactly (`GIT_DIFF_OPTS` still overrides `-U0`, over-count only; `QE-193-c`), stand-in retirement, both closes, rollback.
- **`GIT_DIFF_OPTS` rider: not taken** (optional, fail-safe; fix measured still firing under `--unified=5`). Fenced on the page.

### Base red, measured on a scratch prototype at `65bc4375`
Private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL`, `GIT_CONFIG_NOSYSTEM=1`, `git clone --shared` scratch clones; base instrument = main's (`2c0c1985…`, = `63eadabe`); fix = Security's `fix-prototype.patch`.
- **Base:** rc 1; `limb 1 MISMATCH: RA-PLUS SP-N5`; DIFFER on exactly 9 limbs: `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 PP-EDIT:limb2 SP-N5:limb2 SP-N5:limb3`; the 20 rows ok/identical.
- **Without (b):** rc 1, `MISMATCH: SP-N5`, DIFFER `SP-N5:limb2 SP-N5:limb3`.
- **Without (a):** rc 1, `MISMATCH: RA-PLUS`, DIFFER on the 7 limbs of the four `++ ` rows.
- **Fix:** rc 0, 25 of 25; the 20 rows byte-identical to main's harness on base (139 lines).
- **By hand:** `SP-N5` `3 + lines, 0 - lines` with no TAB; `PP-REDIR` 1 file vs base's 2; `RA-PLUS` 0 `C-quoted` lines vs base's 1 per limb; quoted names still dispute (3 lines, as base); the `-- ` mirror 0/2 vs base 0/1; edit confined to `changedLines`; stand-in empty over `47a3c9a1..65bc4375`.

### Close conditions (as Security/NFR ruled)
- **`AR-193-HUNKHDR`:** closes when QE reads `PP-TPL`, `PP-EDIT`, `PP-REDIR` and `RA-PLUS` as in (c), with the 20 rows unchanged.
- **`AR-193-SPACEPATH`:** closes when QE reads `SP-N5` as in (c).
- The stand-in retires at that merge; the Orchestrator records both closes.

### Files edited (uncommitted, main's tree)
- `plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md` (new);
- `plans/board.md`: one `_Updated:` line at the top; the ABC-195 card under Ready; Ready WIP 1/8 → 2/8;
- `.grugops/context/bapm-cut-AR-193/notes/` (2 sealed notes);
- this done record and its `.claim.md`.

Not touched: `src/`, the instrument, the harness, `ADR-0036`, `AGENTS.md`, `memory-bank/`, `plans/traceability.md` (the trace row is below, for the Orchestrator), git config, branches, worktrees, `node_modules/`. The pending file and the claimed dir were not touched.

### Notes
Sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, context root passed explicitly as this checkout's `.grugops/context`, `at` from `date -u`. Both read back through `readContext`.
- `20261021T185456Z-ba-pm-observation-7e1a757e`: the readings.
- `20261021T185506Z-ba-pm-decision-d7a70688`: the cut (`kind: decision`).

Next free id: **ABC-196**. Stops: none.

### Trace row (10 cells, header order)

| ABC-195 (BA/PM cut) | cut the AR-193-HUNKHDR fix with AR-193-SPACEPATH: clause (b)'s changedLines reads ---/+++ and the C-quoted test as headers only between diff --git and the file's first @@, and drops one trailing TAB from an unquoted header path; r2-mutants.sh gains PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5 (25 rows) with a control-twin reference, a spaced-name Ruling 2 parse and a plant check; ADR-0036 § S1 block retires the HUNKHDR stand-in and states block (i)'s scope (QE-193-c); GIT_DIFF_OPTS rider not taken | — | — | AR-193-HUNKHDR, AR-193-SPACEPATH, QE-193-a, QE-193-b, QE-193-c, R-193-a, ADR-0036 S1, F-095-1, V1.2.5, V5.2.1, V5.3.2; notes …5719a86d, …c5270049, …73e94c9f, …7e1a757e, …d7a70688 | main @ 65bc4375 (uncommitted, records only)<br>plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md, plans/board.md | — (records only; prototype at 65bc4375 on scratch: base rc 1, MISMATCH RA-PLUS SP-N5 + 9 limbs red; without (b) SP-N5 only, without (a) RA-PLUS + 7 limbs; head rc 0, 25/25, 20 rows byte-identical (139 lines)) | — (ABC-195 expects the waiver: 0 production lines) | — | ABC-195 cut → Ready (XS, P3, DoR 10/10; Ready 1/8 → 2/8) |
