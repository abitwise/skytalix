---
id: 20260927T113010Z-qe-e2e-observation-a1b2c3d4
kind: observation
by: qe-e2e
at: 2026-09-27T11:30:10Z
verified_by:
confidence: high
refs:
  - ABC-124
  - qe-ABC-124
  - biome.json
  - tools/grugops/reference-check.js
  - tools/grugops/uat-spec-integrity.js
---

# ABC-124 independent readings (Biome 2.5.5, worktree `ABC-124-lint-tools`, HEAD `da259b3`)

## A1 — coverage lands

`npx biome check tools/`: `Checked 7 files in 48ms. No fixes applied.` No "provided but ignored"
block. Matches the ticket's `A1` exactly.

## A2 — red, then green (own plant, different file, different rules)

Plant: appended `export const __qePlantA2 = (1 == 1);` to `tools/grugops/reference-check.js`
(zero pre-existing findings, not the Engineer's `lane-inventory.js`).

- **RED** — `biome.json`'s `tools/**/*.js` entry in `files.includes` removed (simulating the
  pre-ticket `ddcebc5` state), plant in place: `npx biome check .` → `Checked 85 files in 111ms. No
  fixes applied.` Zero diagnostics; the plant is invisible.
- **GREEN** — delivered `biome.json` restored (`git diff --quiet HEAD -- biome.json` confirmed
  byte-equal before this run), same plant: `npx biome check .` reported both
  `tools/grugops/reference-check.js:75:29 lint/suspicious/noSelfCompare` and
  `tools/grugops/reference-check.js:75:31 lint/suspicious/noDoubleEquals FIXABLE`, `Checked 92 files
  … Found 2 errors.`
- Plant reverted with `git checkout -- tools/grugops/reference-check.js`; `git diff --quiet HEAD`
  confirmed the worktree matched HEAD exactly afterward.

## Config variants planted against the delivered `biome.json` (each reverted immediately after)

1. **Drop `"tools/**/*.js"` from `files.includes`.** `npx biome check .` → `Checked 85 files`, the
   `tools/` files are read by nobody. This is the exact pre-ticket regression `A1`/`A2` exist to
   catch, and both catch it (reproduces the RED reading above).
2. **Scope the `overrides` glob one level too shallow (`"tools/*.js"` instead of
   `"tools/**/*.js"`).** Files stay covered by `files.includes` (still `tools/**/*.js` there), so
   `A1`/`A3` still pass — but the formatter fence no longer matches `tools/grugops/*.js`.
   `npx biome check --write tools/` → `Checked 7 files in 53ms. Fixed 6 files.`, `git diff
   --numstat` showed 6 files rewritten (`uat-spec-integrity.js` alone: 1441/1510 lines). **`A4`
   catches this**: its "0 files rewritten" check fails immediately. `A1`/`A3` do NOT catch this
   variant — they only check the `includes` glob, not the `overrides` glob, so a same-string-typo
   error in the override alone is invisible to them.
3. **Widen the `overrides` entry to also set `linter.enabled: false` for `tools/**/*.js`.** `npx
   biome check tools/` → `Checked 7 files … No fixes applied.` (the 3 real findings are already
   fixed on this branch, so this variant shows no visible difference on its own). Replanting the A2
   violation (`noDoubleEquals` in `reference-check.js`) and re-running `npx biome check .` against
   this widened-override config → `Checked 92 files in 112ms. No fixes applied.` — **the plant is
   invisible even under the "delivered" config.** `A2`'s own red-then-green proof, run honestly with
   a real planted violation, catches this variant: the GREEN half never goes green. `A1`/`A3` alone
   (reading only summary counts on an already-clean tree) would NOT catch it — a linter disabled by
   `overrides` still shows `Checked 7 files … No fixes applied.`, indistinguishable from a real
   pass. This is the sharpest gap of the three: `A3`'s literal check ("0 errors/warnings/infos") is
   satisfied by both "genuinely 0 findings" and "linter switched off, so it can never report
   anything" — only `A2`'s live red/green discipline tells them apart.

All three variants reverted; `git status --short` and `git diff --quiet HEAD` confirmed clean after
each, and the worktree matched HEAD exactly at the end of this hop.

## A3 — the three real findings resolved

`npx biome check .` on the delivered tree: `Checked 92 files in 124ms. No fixes applied.` No
`Found` line at all → 0 errors, 0 warnings, 0 infos, matching the Engineer's reading.

## A4 — formatter/organizeImports fence

`npx biome check --write tools/` → `Checked 7 files in 26ms. No fixes applied.`; `git diff
--numstat` empty (no file rewritten). Biome 2.5.5 does not print the ticket's literal `Fixed 0
files` string — see the decision note's ruling.

## A5 — `tsconfig.json` unchanged

`git diff --numstat ddcebc5..HEAD -- tsconfig.json` → empty output, 0 lines changed.

## A6 — diff fence

`git diff --numstat ddcebc5..HEAD` (excluding the context-notes tree) touches exactly: `biome.json`
(+17/−1), `plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md` (+30/−0),
`plans/traceability.md` (+1/−0), `tools/grugops/uat-spec-integrity.js` (+1/−3). No `src/` line, no
`package.json`, no other `tools/grugops/*.js` file.

## A7 — behavior unchanged

Read the three diff hunks directly: both removed `continue;` statements are the syntactic last
statement of their enclosing block (the outer `catch` in `frameworkSurface`, and the
`nearest.end`-tie branch in `resolveBinding`), so control flow reaching the end of the block by
falling through is identical to reaching it via `continue` — confirmed by reading, not assumed.
Independently ran `node tools/grugops/uat-spec-integrity.js .` on the delivered file: `UAT spec
integrity: … ZERO uat specs were visited … NOT performed`, exit 2 — matches the Engineer's own A7
reading (no uat specs in this repo, loud skip). Did not re-run the Engineer's full 9-argument-set /
in-process-probe harness; relied on the diff read plus this one direct invocation.

## A8 — repo-wide gates

- `npx tsc --noEmit` (== `npm run typecheck` == `npm run build`, same script): exit 0.
- `npx biome check .`: `Checked 92 files in 124ms. No fixes applied.` (0 findings; before-change
  baseline is 85 files, per A6/A1 above — the 7 added files are exactly `tools/`).
- `node tools/grugops/run-bounded.js 60000 vitest run` (with `node_modules/.bin` on `PATH`,
  needed only because of the symlink setup, not a script change): **48 test files passed, 1467
  tests passed, 0 skipped**, 6.06s.

`node_modules` symlink removed after this hop; worktree confirmed clean (`git status --short`
empty) before this note was written.
