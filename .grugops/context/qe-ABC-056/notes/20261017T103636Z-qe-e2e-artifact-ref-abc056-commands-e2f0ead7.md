---
id: 20261017T103636Z-qe-e2e-artifact-ref-abc056-commands-e2f0ead7
kind: artifact-ref
by: qe-e2e
at: 2026-10-17T10:36:36Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
supersedes:
---

# QE `ABC-056`: commands run (all RUN 2026-10-17)

Hand-authored and unsealed. `$SP` is the session scratchpad, outside the repository. Its contents are not kept.

- **Readings (worktree `wt-ABC-056`, tip `e567787c`):** `md5 -q package.json package-lock.json` (before and after);
  `npm audit`; `npm audit --json | jq -r '.vulnerabilities[] | [.name, .severity, (.via[]|select(type=="object")|.url), .range] | @tsv'`;
  `jq .metadata`; `npm audit --omit=dev`; `jq 'keys'`, `has("dependencies")`, `.private`, `.bin/.main/.exports/.files` on `package.json`;
  `jq '.packages|to_entries[]|select(.key!="")|select((.value.dev//false)!=true)'` and `select(.value.hasInstallScript)` on the lockfile;
  `npm ls nanoid postcss source-map-js` (main checkout, same md5s); checks 5a/5b/5c exactly as on the page's Amendment section,
  plus the specifier count and the old 2026-10-12 command; check 4: `git status --porcelain --ignored` before/after `npm run -s build`,
  `find . -newer <marker>` with `node_modules`/`.git` pruned, `ls -d dist`.
- **`A5`:** `git diff --numstat e7d9d657...e567787c -- package.json package-lock.json`; `... -- src/`; `git diff --numstat main...HEAD -- package.json package-lock.json src/`.
- **Runtime reading:** `$SP/hook2.mjs` = `module.registerHooks({ resolve })`, appending each resolved URL when `process.argv[1]`
  ends with `src/cli.ts`; run as `node --import $SP/hook2.mjs src/cli.ts --colour white --ascii </dev/null`, and for plants
  `NODE_OPTIONS="--import $SP/hook2.mjs" npm run -s chess -- --colour white --ascii </dev/null`.
- **Plants:** `git archive e567787c | tar -x -C $SP/base`; per plant a copy with lines inserted by `sed -i '' '81r <file>' src/cli.ts`
  after checking that line 81 is `import { runTurnLoop } from "./turn-loop.ts";`, or a `jq` edit of `package.json`. Clause (1): a lockfile
  copy with `jq '.packages["node_modules/nanoid"].version = "3.3.18"'`, `npm audit --json`, and the (package, id) pairs diffed against the record.
- **ADR-0036 instrument:** a scratch `git init` of the same tree, one commit per plant, then
  `node .grugops/context/design-F-072-1/probe/clause-b.mjs base <plant> 1|2|3`.
- **Gates (tip):** `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`;
  `jq '{success, runState, exitCode, numTotalTests, numPendingTests, numTodoTests, files: (.testResults|length)}' .test-results/last-run.json`
  (the file was absent before the run, so it is fresh); `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- **UAT waiver:** `git diff --name-only e7d9d657...e567787c | grep -v '\.test\.ts$' | grep '^src/'`, plus the `AGENTS.md` form
  `<c>~1 <c>` for each of `10e7aab6`, `6d24c5d1` and `e567787c`.
- **Record check:** `node tools/grugops/qe-hop-integrity.js --ticket ABC-056`. Before this note set: exit 1, "No QE verdict note".
