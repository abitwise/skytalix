---
id: 20261012T072315Z-software-engineer-decision-abc105-test-file-needs-tsconfig-allowjs-and-two-include-lines-d53d8ab6
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-105
at: 2026-10-12T07:23:15Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A8
  - N8-LANE
  - tools/grugops/qe-hop-integrity.test.ts
  - tsconfig.json
  - biome.json
supersedes:
---

# `ABC-105`: the new test file needs `allowJs` plus one include line in each of `tsconfig.json` and `biome.json`

The brief asks me to say this before I change either file. This note is that statement. It is hand-authored
and unsealed, with no stamp, per `AGENTS.md`.

**How the precedent is covered today.** `tools/grugops/test-skip-integrity.js` is linted by Biome through
`biome.json`'s `tools/**/*.js` include, with the formatter off for `tools/**/*.js`. `tsc` does not read it, and
it has no test file. The only test under `tools/` is `tools/opening-book/book.test.ts`, which both tools read
through the `tools/opening-book/**/*.ts` includes.

**What the new test file gets with no config change.** Neither tool reads it.
- `npx biome check tools/grugops/qe-hop-integrity.test.ts` reports "These paths were provided but ignored".
- `tsc` never sees it, because `tsconfig.json`'s `include` does not match `tools/grugops/`.
- `npm test` still collects and runs it. `vitest.config.ts` excludes nothing under `tools/`.

**Probe** (a throwaway `tsconfig.probe.json` that extends `tsconfig.json`, deleted after use):
- Including only the test file gives `TS7016: Could not find a declaration file for module
  './qe-hop-integrity.js'`, plus five `TS7006` errors that follow from it. The page specifies the tool as `.js`,
  so an untyped import is unavoidable without `allowJs`. A relative ambient `declare module` is not allowed, and
  a `.d.ts` would be a fourth file outside the brief's list.
- Adding `"allowJs": true` gives 0 errors. `checkJs` stays off, so no `.js` file is newly error-checked.
  `tsc` infers the tool's exports from its JSDoc.

**Decision: the minimal change, three lines.**
- `tsconfig.json`: add `"allowJs": true` and add `"tools/grugops/qe-hop-integrity.test.ts"` to `include`.
- `biome.json`: add `"tools/grugops/qe-hop-integrity.test.ts"` to `files.includes`.

Each include names the one file, not a glob, so no other file changes coverage. The full
`npm run -s lint && npm run -s typecheck && npm run -s build` gate is re-run after the change, with the
reading in the artifact note. If the reviewer prefers the test unchecked, reverting these three lines is the
whole rollback. The tool and the test do not depend on them.
