---
id: 20261017T181851Z-qe-e2e-artifact-ref-abc158-commands-f3551fc8
kind: artifact-ref
by: qe-e2e
at: 2026-10-17T18:18:51Z
verified_by:
confidence: high
refs:
  - ABC-158
  - AR-1
supersedes:
---

# QE `ABC-158`: commands run (all RUN 2026-10-17)

Hand-authored and unsealed. `$SP` is the session scratchpad, outside the repository. Its contents are not kept.

- **Checks 1–7** (`$SP/checks.sh <dir>`): every command in `…901f43b6`'s `A1` table, with `\|` read as `|`, and the same
  `F=$(find src …)` line, using `/usr/bin/grep`. Check 4: `npm run -s build`, then its exit code, plus an md5 of
  `git status --porcelain --ignored` and `find . -path ./node_modules -prune -o -path ./.git -prune -o -type f -print | sort`
  taken before and after, and `[ -d dist ]`. It ran on the worktree at `cdf4255b` and on every scratch copy.
- **Side claims:** 5b without its trailing `grep -vE` filter; `diff <(echo "$F") <(ls src/*.ts | grep -v '\.test\.ts$')`;
  `find src -mindepth 2 -type f`; `grep -n 'new URL' src/book-file.ts`.
- **Clause (1):** `npm audit --json | jq -r '.vulnerabilities[] | [.name, .severity, (.via[]|select(type=="object")|.url), .range] | @tsv'`.
- **`A4`:** an awk extract of clause (1) from `…718112dd` and from `…901f43b6`, then a word diff. Also a diff of the
  `> **No package…` reason block between the two notes.
- **`A5` and the waiver:** `git diff --name-only aa37f9cb cdf4255b`; `git diff --numstat aa37f9cb cdf4255b -- src/ package.json package-lock.json`;
  `git diff --name-only aa37f9cb...cdf4255b | grep -v '\.test\.ts$' | grep '^src/'` (and the same over `cdf4255b~1 cdf4255b`);
  `md5 -q package.json package-lock.json`.
- **Plants:** `$SP/plant.sh <name>` = `git archive cdf4255b | tar -x -C $SP/plants/<name>`, a `node_modules` symlink, an
  anchor check on `src/cli.ts:81`, and `{ head -n 81; cat $SP/texts/<name>; tail -n +82; }`. Manifest plants used `jq`.
  `/usr/bin/diff -r -q -x node_modules` against an unplanted copy confirmed exactly one plant. N7's install was simulated
  with a real `node_modules/` of symlinks plus a `.bin/node` shell shim (`exec /opt/homebrew/bin/node --import nanoid "$@"`).
- **Runtime loads:** `$SP/hook-reg.mjs` (`module.registerHooks({ resolve })`, appending URLs that contain `/node_modules/`
  to `$QE_LOG`), run as `QE_LOG=… NODE_OPTIONS="--import=$SP/hook-reg.mjs" npm run -s chess -- --colour white --ascii </dev/null`,
  with `/opt/homebrew/lib/node_modules/npm/` filtered out. The first version used `module.register` (async), which
  does not see `require()`. It was replaced before the P3/P3b/G4/N8b readings were taken.
- **ADR-0036 (b):** a scratch git repo with the `cdf4255b` tree as the base commit and one branch per plant, then
  `node .grugops/context/design-F-072-1/probe/clause-b.mjs <plant>~1 <plant> 1|2|3`.
- **Gates (worktree, tip `cdf4255b`):** `npm run lint`; `npm run typecheck`; `npm run build`; `npm test`;
  `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`;
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
- **No timing reading** was taken. The durations vitest prints are not readings.
