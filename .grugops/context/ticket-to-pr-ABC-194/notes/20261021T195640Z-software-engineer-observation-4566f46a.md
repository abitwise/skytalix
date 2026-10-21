---
id: 20261021T195640Z-software-engineer-observation-4566f46a
kind: observation
by: software-engineer
at: 2026-10-21T19:56:40Z
verified_by: 
confidence: high (each build run once in a scratch copy outside the repository; outputs as printed)
refs:
  - ABC-194
  - QE-192-a
  - QE-192-c
  - ABC-192
  - grugops/ABC-194
  - 5e0839fd
  - 99d07d32
  - src/cli.test.ts
  - tools/grugops/heap-guard.js
  - plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md
  - M4
  - M4b
  - ABC-173
supersedes: 
seal: sha256:eebe2d31aa01e3b7b1ce56b8e9d701e66d8c5b1f5902bdac7cf6054269814ca3
---

# ABC-194 red-first readings: base green; all 4 page builds + if(false), return;, deferred .then, labelled break, M4, M4b red ABC-192 > A1 with a named fault; dropping either new condition reds the 9-entry plant assertion

Scratch copies OUTSIDE the repository, in the session scratchpad: `git archive 5e0839fd` + a full `cp -R` of main's node_modules (not a symlink), private TMPDIR, `HEAP_GUARD_OFF` unset. Each mutant is a string replacement of base's one call line in tools/grugops/heap-guard.js. Each was restored from a saved original and `cmp` gave 0 every time. One-file = `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-192"`; suite = `npm test`. No timing taken.

| build | one-file | npm test | fault (abridged) |
|---|---|---|---|
| base (control) | 0, 2 passed | 0, 59 / 1994 | — |
| 1 `try { guard } catch {}` | 1, only A1 | 1, only A1 (1993/1994) | not direct: ExpressionStatement < Block < TryStatement |
| 2 `if (!process.env.HEAP_GUARD_OFF) guard` | 1, only A1 | 1, only A1 | not direct: ExpressionStatement < IfStatement |
| 3 `if (process.env.HEAP_GUARD_OFF) return;` before | 1, only A1 | 1, only A1 | 1 return statement(s) (return;) |
| 4 `const later = () => guard` | 1, only A1 | 1, A1 + ABC-173 A4, A6 (1991/1994) | not direct: ArrowFunction < VariableDeclaration < … |
| `if (false) guard` | 1, only A1 | 1, A1 + ABC-173 A4, A6 | not direct: IfStatement |
| `return;` before | 1, only A1 | 1, A1 + ABC-173 A4, A6 | 1 return statement(s) |
| `Promise.resolve().then(() => guard)` | 1, only A1 | 1, only A1 | not direct: ArrowFunction < CallExpression < ExpressionStatement |
| `off: { break off; guard }` | 1, only A1 | 1, A1 + ABC-173 A4, A6 | not direct: ExpressionStatement < Block < LabeledStatement |
| M4 `process.stderr` | 1, only A1 | 1, only A1 | arguments are [project, v8.getHeapStatistics(), process.stderr] |
| M4b `{ write() {} }` | 1, only A1 | 1, only A1 | arguments are […, { write() {} }] |

**A3 test-side weakenings** (one-file, src/cli.test.ts edited in scratch copy 2 and restored, cmp 0): the direct check made dead (`if (false as boolean)`) → exit 1, the plant row received false at try/catch, if(false), arrow. The return check made dead → exit 1, false at `return;`. Both dead (the merged check's logic) → exit 1, received `[false,true,true,true,true,false,false,false,false]`, which matches BA/PM's merged reading.
