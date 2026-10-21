---
subtask: security-nfr-QE-193
role: security-nfr
tickets: [ABC-193]
branch: main (read only; records only — commit nothing, the Orchestrator commits)
ref: .grugops/context/security-nfr-QE-193/
width: 1
---

# Security/NFR (short read): rate QE-193-b (MEDIUM proposed) and QE-193-a (LOW proposed) — pre-existing clause (b) parsing blind spots. ABC-193 is merged; this gates nothing already merged

## Read first
- QE gap register and verdict `.grugops/context/qe-ABC-193/notes/20261021T182104Z-qe-e2e-decision-69c93667.md`, routes and names `…9c7a6680`; Orchestrator close `…f61be5db`.
- Your own `…7c1f3590` (AR-191-*), `…f5843a71` (AR-188-BINARY); `ADR-0036` § S1 (all dated blocks); `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `r2-mutants.sh`.

## Do
- **QE-193-b:** an added line whose text starts `++ ` is read as a `+++` header, so every later hunk of that file is unseen on limbs 2/3 (head and base); passes lint inside a template literal. Reproduce in a scratch clone (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). Rate it: who can reach it, effect, whether limb 1 / Ruling 2 / the waiver form still catch anything. QE's suggested fix: headers only before the first `@@` (also removes R-193-a's false dispute).
- **QE-193-a:** a production path with a space (git appends a TAB to its `---`/`+++` line; `isProduction` rejects it). Rate it.
- **QE-193-c/-e (INFO):** agree or re-rate.
- For each: accept (owner, trigger), or open an AR with what a fix ticket must hold and its close condition; say whether a hand stand-in is needed at merges until fixed, and give the exact line if so.

## Fences
- Read only on the repository. No edits to `src/`, the instrument, harness, ADRs, `AGENTS.md`, `plans/`. Never edit this repository's or any worktree's git config or `.git/info/attributes`, and never your real `HOME`'s. Do not touch anything under `node_modules/`.
- Your notes go into main's tree under `.grugops/context/security-nfr-QE-193/`, uncommitted.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-QE-193`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision` with your result. A `finding` needs a §14 gate stamp; without one, record it as a decision or observation.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line. Put it in your done record (`.grugops/queue/done/security-nfr-QE-193.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_RISKS.** This is a rating only: it gates nothing already merged, and there are no required fixes before any merge. The notes are in `.grugops/context/security-nfr-QE-193/notes/`:
- the readings: `20261021T183537Z-security-nfr-observation-c5270049`;
- the result: `20261021T183616Z-security-nfr-decision-5719a86d`.

The probe is in `.grugops/context/security-nfr-QE-193/probe/`: `repro.sh`, `repro.out.txt`, `fix-prototype.patch` and `r2-fix-vs-head.txt`. Nothing is committed.

### QE-193-b: ACCEPTED as `AR-193-HUNKHDR`. LOW with the stand-in, MEDIUM without
- **Reach.** Any author of a change to an existing production file can reach it, by content alone: a `++ ` line at column 0 in a template literal or block comment.
- **Effect.** Limbs 2 and 3 do not see the later hunks of that file, at head and on `11245e3d`. This hides:
  - a new `fetch` or `process.env` read;
  - an in-place edit of an existing `process` read (`PP-EDIT`).
  - `++ b/src/<file>` also sends the later hunks to another file (`PP-REDIR`).
- **Still holding:**
  - limb 1, through Ruling 2;
  - (b2) and the non-literal disputes, which are read from the AST;
  - new files.
  - The waiver form lists the file, so there is no waiver ride.
- **Owner:** the Orchestrator. **Fix:** Architect/Design, one XS/P3 ticket that BA/PM cuts now, together with QE-193-a:
  - (a) headers are read only between `diff --git` and the first `@@`;
  - (b) one trailing TAB is stripped from an unquoted header path;
  - (c) rows `PP-TPL`, `PP-EDIT`, `PP-REDIR`, `SP-N5` and `RA-PLUS`, each firing at head and silent on `63eadabe`, with the 20 existing rows unchanged;
  - (d) a dated `ADR-0036` § S1 block retiring the stand-in.
  - The scratch prototype meets (a) and (b), and `r2-mutants.sh` reads 20/20, byte-identical to head.
- **Closes** on QE's read of (c). **Re-rate to MEDIUM** if the stand-in prints, or is skipped.

### QE-193-a: ACCEPTED as `AR-193-SPACEPATH`. LOW, latent
- A reached `src/q t.ts` widening is silent on all three limbs, and no dispute line arises.
- The name is visible in the waiver form and in the baseline line. 0 such paths exist in history.
- **Owner:** the Orchestrator. **Fix:** the same ticket, (b).
- **Closes** on QE's read of `SP-N5`.
- **Trigger:** a `src/` path with whitespace appears. Route that change by hand as fired on every limb, and the fix lands before that ticket merges.

### Stand-in: YES, one line for both, at every routing and merge until the fix is on `main`
Run it in the instrument's checkout, with the same `<base>`/`<head>`. It must print nothing:

`git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <head> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'`

- It flags 8 of 8 colliding plants and is silent on the control.
- It has 0 hits over 174 `src/` commits.
- It holds under `GIT_DIFF_OPTS`.
- If it prints, route the change to Security/NFR by hand as fired on every limb.

### QE-193-c and QE-193-e: INFO, agreed
- **-c** is fail-safe. The fix's ADR block should scope block (i)'s sentence. An optional rider drops `GIT_DIFF_OPTS`, but it is not a close term.
- **-e** over-fires, which is fail-safe. No action.

### Fence
- **No breach.** I read only the repository. I wrote only in a scratch clone (private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`), in this task's context dir, and in these done records.
- No git config, attributes or `node_modules/` was touched. The scratch copy resolves `typescript` through a symlink, read only.
- One `git status` that ran under my private `HOME` showed `.claude/settings.local.json` as untracked. That was an artifact of the private `HOME`: the file dates from 2026-10-10 and is ignored by the user's global excludes file. I did not touch it.

| ABC-193 (security-nfr-QE-193) | rate QE-193-b/-a/-c/-e after merge: QE-193-b accepted AR-193-HUNKHDR LOW (MEDIUM without stand-in; an added `++ ` line blinds later hunks on limbs 2/3, in-place edits included); QE-193-a accepted AR-193-SPACEPATH LOW latent (space in a production path blinds all limbs); -c/-e INFO agreed; one XS/P3 fix for both | — | — | QE-193-a, QE-193-b, QE-193-c, QE-193-e, R-193-a, AR-193-HUNKHDR, AR-193-SPACEPATH, F-095-1, ADR-0036 S1, notes c5270049, 5719a86d | main @ aa86a1a1 (read only)<br>.grugops/context/security-nfr-QE-193/ (notes, probe/), uncommitted | scratch-clone probe: 9 plants x 3 limbs x head/11245e3d/fix prototype; stand-in flags 8/8, control 0, 0 hits on 174 src commits; r2-mutants 20/20 on the prototype, byte-identical to head; no timing | — (rating only; ABC-193's waiver unchanged) | — | PASS_WITH_RISKS; stand-in YES (Orchestrator, every routing and merge); BA/PM cut one XS/P3 fix |
