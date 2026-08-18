---
id: 20260818T160510Z-software-engineer-observation-b2d9
kind: observation
by: software-engineer
at: 2026-08-18T16:05:10Z
verified_by: 
confidence: high
refs:
  - ABC-103
  - plans/tickets/ABC-103-cli-test-production-module-count.md
  - src/cli.test.ts
supersedes: 
---

# The ticket page's own numbers are STALE, and the staleness is three more instances of the defect it describes

Measured on the branch base `7ea9e1b` (identical to `main` at dispatch), by reading the file rather
than trusting the page:

| the page says | measured |
| --- | --- |
| the row is at `src/cli.test.ts:733` | it is at **`:738`** |
| the literal is `20` | it is **`23`** |
| the tax has cost **two** hops (`ABC-076`, `ABC-031`) | the row's own in-file comment names **four** tickets: `20` at `ABC-042`, `+1 ABC-031 coordinate-move.ts`, `+1 ABC-076 evaluate.ts`, `+1 ABC-077 search.ts` |

`ls src/*.ts | grep -v '\.test\.ts$' | wc -l` returned **23** on the base, so the assertion was
GREEN at dispatch. **That is not a reason to close the ticket** — it is the ticket's own predicted
failure mode, observed three more times since it was cut on 2026-08-17. Each bump was a human
editing an assertion they did not write in order to land unrelated work.

**Consequence for method, recorded because the next reader will hit it too:** the row was located by
its SHAPE — `expect(productionModules()).toHaveLength(<N>)` — never by the line number the page
carries. Any future reader of `ABC-103` should do the same.

**The ticket page was NOT edited by this hop.** Correcting a ticket's prose is not the Software
Engineer's, the criteria were not weakened to match what was found, and every criterion was answered
against the tree as it actually is. The correction is filed here for BA/PM and for the `qe-e2e` hop.
