---
id: 20261101T184932Z-software-engineer-observation-3d7aa1d4
kind: observation
by: software-engineer
at: 2026-11-01T18:49:32Z
verified_by: 
confidence: high: each plant was run out of tree on the tip src and on the base src (main ab9f4803, src identical to 524b7949) under flock host-test.lock; the vitest JSON was read for every row
refs:
  - se-ABC-260
  - ABC-260
  - EPIC-010
  - ADR-0056
  - R-TC
  - QE-259-a
  - QE-259-b
  - ABC-259
  - ABC-087
  - grugops/ABC-260
  - 524b7949
  - 22d815e7
  - 040f7f26
  - src/levels.test.ts
  - A8
  - ab9f4803
  - Q5
  - Q6
  - Q7
supersedes: 
seal: sha256:f5b84368475804cfc3fd25550dc080533492aeb9f18844f59ba8efd85fd61572
---

# se-ABC-260 plants (A2–A6): tip red on A2–A4, green on A5 and the control; base misses Q5, Q6, Q7 and the levels plant

The plants are under raw/plants-{tip,base}/*.diff, the summary is raw/plants-summary.txt, and the script is raw/scripts/plants.sh. Each run is `vitest run src/levels.test.ts -t "A8 — the level|ABC-259"` (5 rows) in a scratch copy, scratch dir se-260/plants-{tip,base}. No plant is in any commit (A6).

| plant | file | tip | base |
|---|---|---|---|
| C0 control | — | 5/5 green | 5/5 green |
| A2a: Q5, `import { env as qeEnv } from "node:process"` + `qeEnv.SKYTALIX_FAST` | search.ts | **environment row red**: "expected 'src/search.ts: environment rule — pro…' to be ''" | green (the hole) |
| A2b: ABC-259 A3, `process.env.SKYTALIX_FAST` | search.ts | environment row red, same message | environment row red |
| A3: Q6, `const qeGlob = "src/*.ts";` then `process.env.SKYTALIX_FAST` | search.ts | environment row red: "'src/search.ts: environment rule — pro…'" | green (the hole) |
| A3x: the same with a template literal `src/*.ts` | search.ts | environment row red, same message | green |
| A4a: Q7, `const qeUrl = "http://x"; if (options.budgetMs <= 100) {…}` | engine.ts | **budget row red**: "expected 'src/engine.ts: budget rule — budgetMs…' to be ''" | green (the hole) |
| A4b: `const qeUrl = "http://x"; void qeUrl; process.stdout.write("");` | levels.ts | **A8 "holds no argv parsing and no prompt" red**: "expected '\n\nimport { makeMove, unmakeMove } f…' not to match /process\.|argv|readline|prompt|stdin|…/" | green (the hole) |
| A5: ABC-259 A5's quiescence comment plant + in search.ts `// … a quoted "//" and the word process …` and `/* … "//", process and an apostrophe: it's */` | quiescence.ts, search.ts | 5/5 green | 5/5 green |

**Gap for QE (A4, second clause):** the failing row for the levels plant is A8's. That row scans only src/levels.ts (`new URL("./levels.ts", …)`), so the row itself names the file. But its message prints the stripped source and the regex, not the path "src/levels.ts". Printing the path would mean changing A8's `expect(` line, which A7 forbids. Every other plant's message names its file.
