---
subtask: rm-restate-AR-1
role: release-manager
ref: .grugops/context/rm-restate-AR-1/
inputs: Orchestrator …2c4d34bd (.grugops/context/qe-ABC-198/notes/); interim accept …e4ef897b; AR-1 approved set …193e08fb; Security/NFR …0f626230, …140008ff; QE …0b183705
width: 2 (beside bapm-rule-QE-198, records only)
---

# Re-state AR-1 on the 3-pair set left after ABC-198 merged (main e0e5f987)

## Do
- Read the inputs. On a fresh clone of `main` @ `e0e5f987` (scratch folder `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-AR-1/`), run `npm ci --ignore-scripts` and `npm audit --json`. Confirm, pair by pair, that the set is exactly nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp and source-map-js GHSA-68fv-2mgg-jv7q, and that `--omit=dev` reads 0.
- If the set is a subset of the owner-approved set `…193e08fb`, re-state AR-1 on it. Record that the interim LOW accept `…e4ef897b` has lapsed, keep the reopen triggers, and add a trigger to compare (package, advisory) pairs, not counts.
- If anything is outside the approved set, or a new HIGH has appeared, STOP. Do not accept it; publish a finding.
- Commit the notes, plus any `AGENTS.md` risk-register line you own, on `grugops/rm-restate-AR-1` (worktree `../wt-rm-restate-AR-1` from `main`).

## Fences
- No edits to `package*.json`, `src/`, `tools/`, `plans/board.md` or `plans/traceability.md`. Never run npm in main's checkout. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rm-AR-1/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (`context-io.js` `admitAndAppend`, task `rm-restate-AR-1`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.

## Result (release-manager, 2026-10-22T17:25:34Z): **AR-1 RE-STATED on the 3-pair advisory set. The interim accept `…e4ef897b` has LAPSED. The pairs-not-counts trigger is added. Separately, clause (2) premise drift has FIRED from ABC-168's `bin`/`dist/`. The premise is not re-stated; it is routed to the Orchestrator.**

All readings come from a fresh clone at `e0e5f987` in `scratchpad/rm-AR-1/clone`. `npm ci --ignore-scripts` used a scratch cache and exited 0 with a clean tree. Nothing ran in main's checkout. `npm audit fix` was not run.

**Audit (pairs, not counts):** `npm audit --json` exits 1, with total 3 (moderate 1, high 2) and no via-only rows.
- The pairs are exactly nanoid GHSA-2v37-7h3g-55p8 (high), postcss GHSA-fxqj-rqcc-2cmp (moderate) and source-map-js GHSA-68fv-2mgg-jv7q (high). All three are `dev: true` in the lock.
- The `diff` against the expected 3 is empty.
- Measured minus the approved `…193e08fb` is empty, so this is a strict subset. The 3 vite pairs are gone.
- There is no new HIGH. None of the 4 interim-accept pairs is present.
- `npm audit --omit=dev` finds 0, exit 0.

**Premise checks (`…901f43b6` checks 1–7, same clone):** 1, 2, 5a, 5b, 5d, 6 and 7 read as recorded. Three do not:
- check 3 reads `[true,true,false,false,false]`, because of `bin` `skytalix` → `dist/uci.js`;
- check 4: `build` emits `dist/` (22 `.js` files);
- check 5c reads `{node:fs, node:readline}`.

All three came with ABC-168 (`825b21d1`, merged `513c0211`), after the owner approved `…193e08fb`. No note had read clause (2) since. The dependency leg still holds on both paths: 5a–5d over the 42 `src` production files and the 22 `dist/*.js` files find no package specifier and no dynamic loader. `…901f43b6` § A4 says a `bin` means "re-stating is not enough", and ABC-056's P1 trigger names a `bin`. So I re-stated only the advisory set and routed the premise:
- (a) a Security/NFR premise re-read, then an RM re-statement of the reason and table (recommended);
- (b) the Orchestrator rules, under `…5aaf7cec`, whether this goes to the owner.

This is not a STOP under the brief's own terms: the set is a subset and there is no new HIGH. The drift is outside the brief and is reported, not decided.

**Notes**, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (task `rm-restate-AR-1`, worktree context root) and read back through `readContext` (3 notes):
- `20261022T172421Z-release-manager-observation-d1d9ec04`: the audit readings and the pair comparison;
- `20261022T172439Z-release-manager-observation-eb1d1cdf`: the clause (2) premise drift and the substantive leg on `src` and `dist`;
- `20261022T172518Z-release-manager-decision-130fb9a3`: the re-statement (the § 1 table), the lapse of `…e4ef897b`, triggers (1) and (2) kept, the new trigger (3) for a pair `diff`, and § 4 routing the premise.
  - It supersedes nothing. `…901f43b6` stays the premise record until the re-read.
  - It cites the QE `…feb20104` 0-socket reading as settling `…216ceb43`'s `UNKNOWN - verify`. I cited it and did not re-run it.

**Files:**
- `.grugops/context/rm-restate-AR-1/notes/` (3 new);
- this record, moved to `done/`, and `done/rm-restate-AR-1.claim.md`.

`AGENTS.md` holds no AR-1 line, so it was not touched. Also not touched: `package*.json`, `src/`, `tools/`, `plans/board.md`, `plans/traceability.md` (the row is below, for the Orchestrator) and main's checkout. Nothing was pushed, merged, forced, amended or rebased.

### Trace row (10 cells, header order)

| AR-1 (RM re-statement after ABC-198) | AR-1 re-stated on the 3-pair advisory set (nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp, source-map-js GHSA-68fv-2mgg-jv7q; strict subset of owner-approved …193e08fb, no new HIGH, --omit=dev 0); interim LOW accept …e4ef897b lapsed; trigger (3) pairs-not-counts added; clause (2) premise drift FIRED (check 3 bin, check 4 dist/, 5c node:readline, from ABC-168) — premise not re-stated, routed | EPIC-007 | — | AR-1; ABC-056; ABC-198; ABC-168; QE-198-c; V15.1.1; V15.2.1; notes …d1d9ec04, …eb1d1cdf, …130fb9a3, …901f43b6, …193e08fb, …e4ef897b, …0f626230, …140008ff, …0b183705, …feb20104, …2c4d34bd | grugops/rm-restate-AR-1 (records only)<br>.grugops/context/rm-restate-AR-1/notes/ | — (records only; scratch clone of e0e5f987: npm ci rc 0, audit 3 pairs diff-empty vs expected, ⊂ approved; checks 1–7: 3/4/5c drifted; 5a–5d clean over src (42) and dist (22)) | — | — | AR-1 advisory set re-stated; premise re-read owed (Security/NFR then RM), routed to Orchestrator |
