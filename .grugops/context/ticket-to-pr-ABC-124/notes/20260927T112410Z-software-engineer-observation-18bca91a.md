---
id: 20260927T112410Z-software-engineer-observation-18bca91a
kind: observation
by: software-engineer
at: 2026-09-27T11:24:10Z
verified_by:
confidence: high
refs:
  - ABC-124
  - ticket-to-pr-ABC-124
  - biome.json
  - tools/grugops/uat-spec-integrity.js
  - tools/grugops/lane-inventory.js
  - .grugops/context/ticket-to-pr-ABC-124/notes/raw-a7-before.json.txt
  - .grugops/context/ticket-to-pr-ABC-124/notes/raw-a7-after.json.txt
supersedes:
---

# ABC-124 delivery readings, as they ran on 2026-09-27 (Biome 2.5.5, worktree `ABC-124-lint-tools`)

`node_modules` was a symlink to the main checkout's copy. It is excluded by `.git/info/exclude`, was
never staged, and was removed after the run.

## A1: coverage

- **Before**, with `biome.json` at `ddcebc5`: `npx biome check tools/` printed `Checked 0 files …
  No files were processed … These paths were provided but ignored: - tools/`, exit 1.
- **After**: `Checked 7 files in 50ms. No fixes applied.` The "ignored" block is gone.

## A2: red, then green (plant in `lane-inventory.js:94`)

- **RED**, with `biome.json` byte-equal to HEAD (checked with `git diff --quiet HEAD -- biome.json`)
  and the plant in place: `npm run lint` printed `Checked 85 files in 113ms. No fixes applied.` It
  reported zero diagnostics, so the plant was not seen.
- **GREEN**, with the delivered `biome.json` and the same plant: `npm run lint` reported
  `tools/grugops/lane-inventory.js:94:26 lint/suspicious/noPrototypeBuiltins FIXABLE`, then
  `Checked 92 files … Found 2 warnings. Found 2 infos.` That is the plant plus the three
  pre-existing findings.
- The plant was reverted with `git checkout -- tools/grugops/lane-inventory.js`. `git status` then
  showed only `M biome.json`.

## A3: the three findings

- **Before the autofix**, on the delivered config: `npx biome check tools/` printed `Checked 7 files
  … Found 1 warning. Found 2 infos.` There were 0 errors, because the formatter and organizeImports
  are fenced off. The findings were `noUselessContinue` at 1214:13 and 2384:13, and
  `noPrototypeBuiltins` at 603:10.
- **After**: `Checked 7 files in 50ms. No fixes applied.` No `Found` line was printed, so there are 0
  errors, 0 warnings and 0 infos. Infos did print by default in the "before" reading, so a missing
  `Found … infos` line is a real zero, not a hidden severity.

## A4: the formatter fence

- `npx biome check --write tools/` after delivery printed `Checked 7 files in 28ms. No fixes
  applied.` Biome 2.5.5 says it this way. The ticket's literal `Fixed 0 files` is not the string
  this version prints.
- `git diff --numstat` was identical before and after that run (`17 1 biome.json`,
  `1 3 tools/grugops/uat-spec-integrity.js`), so no file was rewritten.
- A cross-check with `npx biome format tools/` returned `Checked 0 files … provided but ignored`,
  which means the formatter is off for that glob.
- `npx biome format .` checked 85 files before and after. The formatter's coverage of `src/`,
  `spike/`, `*.json` and `vitest.config.ts` is unchanged.

## A5: `tsconfig.json`

It is absent from `git diff --numstat ddcebc5`, so 0 lines changed.

## A7: behavior unchanged (`raw-a7-*.txt`)

- The harness is `raw-a7-capture.mjs.txt`. It spawns `node tools/grugops/uat-spec-integrity.js`
  with 9 argument sets, and it runs `raw-a7-probe.mjs.txt` in-process.
- The 9 argument sets:
  - `.`, `. --json`, `. --check-browser`, `. --json --check-browser`: each exit 2. The repo has no uat
    specs, so the checker does a loud skip.
  - No arguments: exit 2, usage line.
  - `/nonexistent-path`: exit 2.
  - A scratch fixture with one uat spec (`raw-a7-fixture.txt`): exit 1 with 2 findings, one for
    `expect.configure` and one for `test.skip`, in both human and `--json` form.
  - The fixture with `--check-browser`: exit 2.
- The probe imports the module and does not run it as a script. It calls `isBannedModifierCall` on
  44 path×option pairs. Those include `hasOwnProperty`, `__proto__`, `constructor` and
  `expect.configure` with and without `soft`. It also calls `resolveBinding` on 11 binding tables.
  Those include the "same start, smaller end" arm whose trailing `continue` was removed.
- `raw-a7-before.json.txt` was captured on the HEAD file (sha1 `742f116d…`) and
  `raw-a7-after.json.txt` on the autofixed file (sha1 `64e5531d…`). The two captures are
  **byte-identical**: `cmp` succeeded, and both have sha1 `5bf11df2…`. Every exit code, stdout and
  stderr is the same.
- **Limit:** no capture reaches the `frameworkSurface` outer `catch` where the first `continue` was
  removed. That catch fires only when the TypeScript checker throws while expanding a type. The
  removed `continue` was the last statement in that `while` loop body, so control flow is the same
  by construction. That is argued, not measured.

## A8: repo-wide gates

- `npm test`, through the unchanged wrapper at 60000: exit 0, **48 files passed / 1,467 tests
  passed, 0 skipped**, 6.13 s. This is the baseline the Orchestrator named.
- `npm run lint`: `Checked 92 files in 139ms. No fixes applied.` That is exit 0 with 0 findings;
  before the change it checked 85 files with 0 findings. The 7 added files are exactly `tools/`, and
  there are 0 new `src/` findings.
- `npm run typecheck` and `npm run build`: both exit 0.
