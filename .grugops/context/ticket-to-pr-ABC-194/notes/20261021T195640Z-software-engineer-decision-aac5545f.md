---
id: 20261021T195640Z-software-engineer-decision-aac5545f
kind: decision
by: software-engineer
at: 2026-10-21T19:56:40Z
verified_by: 
confidence: high (built and read red/green at grugops/ABC-194 5e0839fd)
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
  - N8_SPAWN
  - .grugops/context/bapm-rule-QE-192/notes/20261021T180416Z-ba-pm-decision-09a201ba.md
  - .grugops/context/bapm-rule-QE-192/notes/20261021T180416Z-ba-pm-observation-027683e7.md
  - .grugops/context/ticket-to-pr-ABC-192/notes/20261021T174146Z-software-engineer-decision-8fd17c58.md
supersedes: 
seal: sha256:9476e3ad6b7f5130163de2467ce4dfc814affb2e99f4bc0006205c388220f98c
---

# ABC-194 design: guardStreamFaultOf gains a direct-statement check and a no-return check, in that order, after the 1-call check and before the argument check; plant table 5 → 9; 0 production lines, no new row

- **Order of checks** in `guardStreamFaultOf` (src/cli.test.ts, the ABC-192 block): 1 default-exported `setup` → exactly 1 `guard(…)` call (still counted anywhere in setup, nested functions included, so an arrow-held call counts as 1 and fails the next check) → **(new) direct statement**: the call's parent is an `ExpressionStatement` whose parent is `setup`'s body block → **(new) no return**: 0 `ReturnStatement` in setup's body, not descending into any `ts.isFunctionLike` node → 3 args, third `process.stdout` (unchanged).
- **Fault messages name the condition and where the call sits.** Direct: `guard(…) is not a direct statement of setup's body: it sits in <SyntaxKind chain from the call's parent up> < setup's body` (e.g. `ExpressionStatement < Block < TryStatement < setup's body`). Return: `<n> return statement(s) in setup (<text>), not 0: setup can leave before or around its guard(…) call`.
- A parenthesised `(guard(…))`, `void`, `|| 0` or a bare block also fail the direct check. That is the accepted fail-closed side (QE-192-c). `throw` is not looked at, so base's `if (!isMainThread) throw …` stays allowed.
- **Plant table** gains 4 entries after the 5 merged ones: `try {\nreal\n} catch {}`, `if (false) real`, `const later = () => real`, `return;\nreal`. Expected `[false, true, true, true, true, true, true, true, true]`.
- **Not taken**, as the page fences: the row title is unchanged; there is no new row or describe, no child (N8_SPAWN = 17+7+1+2+1 = 28), no in-process `setup` call, no binding resolution (QE-192-b stays accepted), and no edit outside src/cli.test.ts.
