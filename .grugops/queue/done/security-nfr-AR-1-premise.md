---
subtask: security-nfr-AR-1-premise
role: security-nfr
ref: .grugops/context/security-nfr-AR-1-premise/
inputs: Orchestrator …1b62e80b; RM …eb1d1cdf (drift), …130fb9a3, …d1d9ec04 (task rm-restate-AR-1); AR-1 record …901f43b6 (rm-ABC-158); owner set …193e08fb; ABC-168 (merged 513c0211), ABC-056 (P1 trigger: a bin); QE …feb20104 (0 sockets)
width: 2 (beside bapm-rule-QE-198)
---

# Re-read AR-1's premise now that `bin` → `dist/uci.js` and `dist/` exist

## Do
- On a fresh clone of `main` @ `6ccbcc3e` (scratch `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec-ar1/`), run `npm ci --ignore-scripts`, then re-run `…901f43b6`'s checks 1–7. Widen them where the `bin` and `dist/` make them blind: `dist/` imports, every `scripts.*` entry (not only `chess`), `files`/`bin`, and what `npm pack --dry-run` would ship.
- Rule whether AR-1's reason still holds: no flagged package (nanoid, postcss, source-map-js) is reachable from any shipped or runtime path. Rule each pair's severity in context.
- Publish a revised premise check table and reason (for the Release Manager to adopt), with each check's expected reading and the command spelled out.
- Decide whether ABC-056's P1 `bin` trigger fires. If it does, say what it requires.
- **STOP condition:** if any pair is HIGH in context (reachable from a shipped path), do not accept it. Publish a `finding` and stop: that acceptance is the owner's.

## Fences
- Records only. Work on `grugops/security-nfr-AR-1-premise` (worktree `../wt-security-nfr-AR-1-premise` from `main`). No edits to `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never run npm in main's checkout. No timing runs. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec-ar1/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-AR-1-premise`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief, then move it to `done/`.

## Result (security-nfr, 2026-10-22T17:36:18Z): **PASS_WITH_RISKS. AR-1's reason HOLDS with `bin` → `dist/uci.js` in scope. All 3 pairs are LOW in context, none is HIGH, so this is not a STOP and no `finding` is published. The descriptive sentences are rewritten, and a revised check table (1–8) is published for the Release Manager. ABC-056's `P1` `bin` trigger has FIRED: a P1 Release Manager re-statement is owed, with no owner escalation.**

Readings come from a fresh clone at `6ccbcc3e` in `scratchpad/sec-ar1/clone`. `npm ci --ignore-scripts` used a scratch cache and exited 0 with a clean tree. Nothing ran in main's checkout. There were no timing runs, and `npm audit fix` was not run.

**Checks 1–7, verbatim.** Checks 3, 4 and 5c drifted exactly as `…eb1d1cdf` recorded. The rest read as recorded.

**Widened readings:**
- **`dist/`:** 22 files and 65 specifiers. 5a, 5b and 5d are empty, and 5c is `{node:fs, node:readline}`.
- **Scripts:** all 11 `scripts.*` were read. 4 are runtime (`chess`, `uci`, `perft`, `spike:perft`). No script has a loader flag, there is no lifecycle script, and there is no `.npmrc`.
- **`spike/`:** `{node:os}` only.
- **`npm pack --dry-run`:** `bundled` 0 and 0 `node_modules` paths.
- **Resolve hook:** `src/cli.ts`, `src/uci.ts` and `dist/uci.js` each resolve 0 `node_modules` URLs. The control reads 47.
- **The packed tarball, installed into an empty prefix:** it adds 1 package (`skytalix`), and nanoid, postcss and source-map-js are absent. Its `bin` resolves 0 other `node_modules` URLs.

**Audit:** the pair list `diff`s empty against `…130fb9a3` § 1, so clause (1) is quiet.

**Severity in context:**
- nanoid GHSA-2v37: npm high → LOW;
- postcss GHSA-fxqj: npm moderate → LOW;
- source-map-js GHSA-68fv: npm high → LOW.

All three are toolchain-only, on repository-owned input (0 CSS or `.map` files). The override owner is the Release Manager.

**ABC-056's `P1`:** the `bin` leg has fired; the runtime-dependency and deploy legs have not. The card is Done, so the trigger's substance is:
- this re-read (done);
- the Release Manager re-states AR-1 from `…7d7b76ec` §§ 2–3 at P1, before any further ticket touching `package.json`, `tsconfig.build.json` or `dist/` merges;
- the Orchestrator's standing process fix `…1b62e80b`.

**Notes**, sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (task `security-nfr-AR-1-premise`, worktree context root) and read back (2 notes, 0 unsealed):
- `20261022T173538Z-security-nfr-observation-a8796ea3`: the readings;
- `20261022T173546Z-security-nfr-decision-7d7b76ec`: the ruling, the revised reason, the revised check table (1–8) with commands and expected readings, the revised clause (2), the severity per pair, ABC-056, and the residuals.

**Files:**
- `.grugops/context/security-nfr-AR-1-premise/` (2 notes, plus `index.md` and `index.jsonl`);
- this record, moved to `done/`, and `done/security-nfr-AR-1-premise.claim.md`.

**Not touched:** `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` (the row is below, for the Orchestrator) and main's checkout. Nothing was pushed, merged, forced, amended or rebased.

### Trace row (10 cells, header order)

| AR-1 (Security/NFR premise re-read after ABC-168) | AR-1 premise re-read with bin skytalix → dist/uci.js and dist/ in scope: reason HOLDS (no npm package loaded on any runtime path or shipped; packed tarball installs 1 package, flagged 3 absent); descriptive sentences rewritten; revised checks 1–8 (3 widened, 4 replaced, 5c re-recorded, 5e dist, 5f spike, 6a–6d all scripts/loader/lifecycle/.npmrc, 8 pack) for RM adoption; 3 pairs LOW in context; ABC-056 P1 bin trigger FIRED → P1 RM re-statement owed | EPIC-007 | — | AR-1; ABC-056; ABC-168; AR-168-BINPIN; ADR-0036; V15.1.1; V15.2.1; notes …a8796ea3, …7d7b76ec, …901f43b6, …eb1d1cdf, …130fb9a3, …1b62e80b, …193e08fb | grugops/security-nfr-AR-1-premise (records only)<br>.grugops/context/security-nfr-AR-1-premise/notes/ | — (records only; scratch clone of 6ccbcc3e: npm ci rc 0; checks 1–7 3/4/5c drifted as recorded; 5a–5d clean over src 42, dist 22, spike 1; resolve hook 0 node_modules URLs on cli/uci/dist-uci, control 47; pack [0,0]; tarball consumer 1 package; 5 plant controls fired; audit pairs diff-empty) | — | — | Security/NFR PASS_WITH_RISKS (AR-1 LOW, owner RM); RM re-statement of reason + table owed at P1 |
