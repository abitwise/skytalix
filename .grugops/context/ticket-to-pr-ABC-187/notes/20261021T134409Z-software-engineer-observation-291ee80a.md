---
id: 20261021T134409Z-software-engineer-observation-291ee80a
kind: observation
by: software-engineer
at: 2026-10-21T13:44:09Z
verified_by: 
confidence: high
refs:
  - ABC-187
  - ABC-109
  - QE-164-h
  - src/cli.test.ts
  - grugops/ABC-187
  - 94c4b510
  - 494f7862
supersedes: 
seal: sha256:4873abc85bc0bbe8abb17f2c8f7877ee1c8b28407957a1e8759eacd1439125ba
---

ABC-187 criteria at tip 494f7862 vs main 94c4b510. A1 MET: forbidden-pattern grep 2 -> 0; `const AGENTS_MD_BUDGET_BYTES = 18_432;` count 0 -> 1; :2483 contains ABC-187. A2 MET (scratch git-archive exports outside the repo, node_modules symlinked, private TMPDIR, `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-109"`): base @18,433 B 1 passed; head @18,433 B 1 failed, message `AGENTS.md bytes against its 18432 B budget (ABC-109): expected 18433 to be less than or equal to 18432`; head @18,432 B 1 passed; head with real AGENTS.md (15,606 B) 1 passed. A3 MET: npm test rc 0, 59 files / 1987 tests passed (= base), last-run.json success true, 0 failed, 0 pending; skip-integrity --skip-count 0 `No findings.`; wc -c AGENTS.md 15606. A4 INTENT MET, COMMAND AS WRITTEN NOT EMPTY: the page's `git diff --name-only main...HEAD -- src/ ':!src/**/*.test.ts' ':!src/__snapshots__'` prints `src/cli.test.ts`, because git's default (non-glob) pathspec needs a directory level between `src/` and `*.test.ts` for `**/`. AGENTS.md's reference waiver form `git diff --name-only HEAD~1 HEAD | grep -v '\.test\.ts$' | grep '^src/'` prints nothing, and the glob-magic form `':(exclude,glob)src/**/*.test.ts'` prints nothing: 0 production lines. A5 MET: script prints 8; comment says 8; `carries 13 further closers` count 1 -> 0. A6 MET (pre-Scribe): diff names only src/cli.test.ts, numstat 3 3, hunks at :2242 and :2483-2484 only.
