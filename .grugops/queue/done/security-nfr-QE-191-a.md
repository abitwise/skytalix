---
subtask: security-nfr-QE-191-a
role: security-nfr
tickets: [ABC-191]
branch: main (read only; records only — commit nothing, the Orchestrator commits)
ref: .grugops/context/security-nfr-QE-191-a/
width: 2 (beside qe-ABC-176)
---

# Security/NFR (short read): rate QE-191-a — operator config/environment that can still blind clause (b)'s one diff call. ABC-191 is merged; this gates nothing already merged

## Read first
- QE gap register `.grugops/context/qe-ABC-191/notes/20261021T164012Z-qe-e2e-observation-9bc0b262.md` (QE-191-a/-b/-c) and verdict `…16ba4076`; Orchestrator merge/close `…7f7588a5`.
- Your own `…f5843a71` (AR-188-BINARY), `ADR-0036` § S1 (all dated blocks), `.grugops/context/design-F-072-1/probe/clause-b.mjs`.

## Do
- Rate QE-191-a (external diff driver via `diff=<drv>` + `diff.<drv>.command`; `GIT_EXTERNAL_DIFF`; `color.diff=always`; `diff.srcPrefix`/`dstPrefix`): reachable by whom, on which checkout the Orchestrator routes from, with what effect. You may reproduce in a scratch clone with its own `.git` and a private `TMPDIR`/`HOME`/`GIT_CONFIG_GLOBAL`.
- Rule: accept (with owner and trigger), or open an AR and say what a fix ticket must hold (QE's untried flags: `--no-ext-diff`, `--no-color`, `--src-prefix=a/ --dst-prefix=b/`). Say whether any of it should be measured by hand at merges until fixed (a stand-in), or not.
- Glance at QE-191-b (non-ASCII names, INFO): agree or re-rate.

## Fences
- Read only on the repository: no edits to `src/`, the instrument, harness, ADRs, `AGENTS.md`, `plans/`. Never edit this repository's or any worktree's git config or `.git/info/attributes`. Do not touch `../wt-ABC-176`, `../wt-qe-ABC-176`.
- Your notes go into main's tree under `.grugops/context/security-nfr-QE-191-a/`, uncommitted.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-QE-191-a`). **Pass this repository root's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision` with your result. A `finding` needs a §14 gate stamp; if you have none, record it as a decision or observation.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/security-nfr-QE-191-a.md` + `.claim.md`, main's tree, uncommitted).

## Result

**PASS_WITH_RISKS** (a rating only; it gates nothing already merged). There are no required fixes before any merge. The notes are in `.grugops/context/security-nfr-QE-191-a/notes/`:
- the readings: `…62620bb0` (observation);
- the result: `…7c1f3590` (decision).

The probe and its outputs are in `.grugops/context/security-nfr-QE-191-a/probe/` (`RUN.txt`). Nothing is committed. No `src/`, instrument, harness, ADR, `AGENTS.md`, `plans/`, git config, `.git/info/attributes` or worktree was edited. Plants were made only in a scratch clone with a private HOME, TMPDIR and GIT_CONFIG_GLOBAL, and system config off. No timing was taken.

### QE-191-a: ACCEPTED as `AR-191-GITENV`. LOW with the stand-in, MEDIUM without
- **Wider than QE measured.** Every blinding route also hides a widening. An added `node:fs` import and a `fetch` call print `does not fire` on limbs 1 and 3. The routes are:
  - `color.diff`/`color.ui=always`;
  - `diff.external` (a route not in QE's list);
  - `GIT_EXTERNAL_DIFF`;
  - `diff.<drv>.command` with an attribute from info, global or a checked-out `.gitattributes`;
  - `srcPrefix`/`dstPrefix`;
  - `GIT_CONFIG_COUNT`.
- **Reach.** `.git/config` and `.git/info/attributes` are shared by main's checkout and all 49 linked worktrees (`extensions.worktreeConfig` is unset).
  - One `git config` in any agent's worktree blinds the Orchestrator's instrument in main's checkout. This is measured.
  - It leaves no commit or diff, and the instrument's output shows nothing.
  - The env routes need the operator's process.
  - A committed attribute alone never blinds: it needs a configured command. It is inert at routing from main's checkout, and live at the staged merge only if the command exists.
- **Today:** clean. The stand-in prints nothing on main's checkout. Retiring the `--numstat` line lost no cover.
- **Owner:** the Orchestrator. **Fix:** Architect/Design, one XS/P3 ticket that BA/PM cuts now.
  - The one diff call gains `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/`. Measured: every blinding route then FIRES.
  - Harness rows with a widening plant for each route.
  - A dated `ADR-0036` § S1 block.
- **Closes when** QE reads those rows firing at head and silent on `837e8b22`'s instrument.
- **Stand-in: YES,** from now until the fix is on `main`. At every routing and merge, in the instrument's checkout and shell env, this must print nothing (measured to flag every route):
  `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`
  - If it prints, do not trust that clause (b) run. Remove the setting, or route the change here as fired on every limb.
- **Re-rate to MEDIUM** if it ever prints, or is skipped at a merge.

### QE-191-b: RE-RATED from INFO to LOW (latent), as `AR-191-QUOTEPATH`. Owner: the Orchestrator. No routine stand-in
- **Measured: QE's reading holds only before the file is reached.**
  - After one disputed fire (`cli.ts` imports `src/qé.ts`), later edits that add `node:fs` and `fetch` to `src/qé.ts` are silent on limbs 1 and 3.
  - The AGENTS.md waiver form also prints nothing for them (`grep '^src/'` misses `"src/q\303\251.ts"`), so they ride the UAT waiver.
- **Trigger:** a fail-safe dispute `-> src/<name> (not a production file at <head>)` whose target exists under `src/` with a production extension.
  - Security/NFR must not clear it, and the fix lands before that ticket merges.
  - There are 0 non-ASCII paths today.
- **The fix rides the same ticket:**
  - `-c core.quotePath=false` on every git call in the instrument (measured: it FIRES then);
  - any still-quoted path FIRES (disputed);
  - rows QU and QE2.
- **The waiver form's wording** (`git -c core.quotePath=false diff --name-only …`) is the owner's text, and is routed to the Scribe with owner approval.

### QE-191-c
Not re-rated (outside the brief). QE's reading rule stands.

### Fence
No breach. I read only the repository, and wrote only in the scratch clone and in this task's context dir and done records.

| ABC-191 (security-nfr-QE-191-a) | rate QE-191-a/-b after merge: QE-191-a accepted AR-191-GITENV LOW (MEDIUM without stand-in; any-worktree git config blinds a widening on limbs 1/3; fix --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/, measured); QE-191-b re-rated LOW latent AR-191-QUOTEPATH (reached non-ASCII file silent and rides the waiver) | — | — | QE-191-a, QE-191-b, AR-191-GITENV, AR-191-QUOTEPATH, F-095-1, ADR-0036 S1, notes 62620bb0, 7c1f3590 | main @ 837e8b22 (read only)<br>.grugops/context/security-nfr-QE-191-a/ (notes, probe/), uncommitted | scratch-clone probe: routes R0-R14, R5g, R5c-e x X1/ADD x cur/fix; stand-in flags 9/9 blinding settings, empty on main today; no timing | — (rating only; ABC-191's waiver unchanged) | — | PASS_WITH_RISKS; stand-in YES (Orchestrator, every routing and merge); BA/PM cut XS/P3 fix |
