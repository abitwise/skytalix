---
id: 20261101T191823Z-qe-e2e-observation-0c01fdc0
kind: observation
by: qe-e2e
at: 2026-11-01T19:18:23Z
verified_by: 
confidence: high: 17 out-of-tree copies each of the tip src (== 040f7f26) and the base src (524b7949), planted by sed (raw/qe-scripts/plants.sh; diffs raw/plants-{tip,base}/*.diff), each run as vitest run src/levels.test.ts -t "A8 — the level|ABC-259" at heap 400 under flock host-test.lock; JSON read for every row
refs:
  - qe-ABC-260
  - ABC-260
  - EPIC-010
  - ADR-0056
  - R-TC
  - QE-259-a
  - QE-259-b
  - ABC-259
  - ABC-087
  - grugops/ABC-260
  - grugops/qe-ABC-260
  - 524b7949
  - 040f7f26
  - 64c7e829
  - src/levels.test.ts
  - se-ABC-260/20261101T184932Z-software-engineer-decision-b8a7e2e7
  - se-ABC-260/20261101T184932Z-software-engineer-observation-3d7aa1d4
  - se-ABC-260/20261101T184932Z-software-engineer-observation-7d014b05
  - A2
  - A3
  - A4
  - A5
  - A6
  - Q5
  - Q6
  - Q7
  - QE-260-a
  - QE-260-b
  - QE-260-c
supersedes: 
seal: sha256:6fd3c5d19f9e974176206254e005880c59551a20ce86ee939b54e5ea3deebf17
---

# qe-ABC-260 plants: the ticket's five red at the tip and green at base; comment controls green; 3 QE plants survive (Q8, Q9, Q11b)

Each run executes the 5 rows (A8 ×2, ABC-259 ×3); the other 44 are filtered. Summaries: raw/plants-summary-{tip,base}.txt.

| id | plant | tip | base |
|---|---|---|---|
| C0 | none | 5 pass | 5 pass |
| A2a (Q5) | search.ts: `import { env as qeEnv } from "node:process";` + `qeEnv.SKYTALIX_FAST` | env FAIL 'src/search.ts: environment rule — pro…' | pass (hole) |
| A2b (ABC-259 A3) | search.ts: `process.env.SKYTALIX_FAST` | env FAIL, same | env FAIL |
| A3 (Q6) | search.ts: `const qeGlob = "src/*.ts";` then `process.env.SKYTALIX_FAST` | env FAIL 'src/search.ts…' | pass (hole) |
| A4a (Q7) | engine.ts: `const qeUrl = "http://x"; if (options.budgetMs <= 100)…` | budget FAIL 'src/engine.ts: budget rule — budgetMs…' | pass (hole) |
| A4b | levels.ts: `const qeUrl = "http://x"; void qeUrl; process.stdout.write("");` | A8 "holds no argv parsing and no prompt" FAIL; message prints the stripped source and regex, not the path | pass (hole) |
| A5 | ABC-259 A5's quiescence JSDoc + trailing comment; search.ts line comment with a quoted "//" and process, block comment with "//", process, an apostrophe, a backtick and a lone quote | 5 pass | 5 pass |
| A5q | search.ts: line comment `it's " \` /* process`; a trailing block comment with backtick, apostrophe, quote and process between two code statements | 5 pass | 5 pass |
| Q8 | engine.ts: `const qeRe = /"/; const qeUrl = "http://x"; if (options.budgetMs <= 100)…` | **5 pass, survives**: the regex's quote pairs with the next string's opening quote, so that string's `//` reads as a comment | pass |
| Q8b | search.ts: `const qeRe = /"/; if (process.env.SKYTALIX_FAST)…` | env FAIL (an unpaired quote hides nothing: literals are kept, not blanked) | env FAIL |
| Q9 | engine.ts: `const qeRe = /:\/\//; if (options.budgetMs <= 100)…` | **5 pass, survives**: `\/\/` in a regex reads as `//` | pass |
| Q10 | search.ts: `const qeS = "a\"b // c"; if (process.env.SKYTALIX_FAST)…` | env FAIL (escape handled) | pass (hole) |
| Q10b | the same with `'it\'s // c'` | env FAIL | pass (hole) |
| Q11 | search.ts: `const qeT = \`${process.env.SKYTALIX_FAST}\`;` | env FAIL (template kept whole) | env FAIL |
| Q11b | engine.ts: `const qeT = \`${"\`"}\`; const qeUrl = "http://x"; if (options.budgetMs <= 100)…` | **5 pass, survives**: the backtick inside `${}` closes the template early | pass |
| Q12 | transposition.ts: `globalThis.process?.env?.SKYTALIX_FAST` | env FAIL 'src/transposition.ts: environment rul…' | pass (hole) |
| Q13 | levels.ts: `import { stdout as qeOut } from "node:process";` + `qeOut.write("")` | A8 imports row and argv row FAIL | same |

- Survivors' scope: Q8 and Q9 are regex literals, outside the ticket's "string or template literal" scope. Q11b is the template case the SE named as a known limit (decision note item 4). A probe of the six files finds 0 regex-literal candidates and 0 literals holding `//` or `/*`; the five core files have no template literal, levels.ts has one.
- No plant was written in the worktree, and none is in any commit.
