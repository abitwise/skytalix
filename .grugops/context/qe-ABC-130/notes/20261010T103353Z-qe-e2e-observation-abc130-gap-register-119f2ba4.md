---
id: 20261010T103353Z-qe-e2e-observation-abc130-gap-register-119f2ba4
kind: observation
by: qe-e2e
at: 2026-10-10T10:33:53Z
verified_by:
confidence: high
refs:
  - ABC-130
  - ABC-118
  - ABC-118-G4
  - ABC-109
  - tools/grugops/lane-inventory.js
  - 20261010T103353Z-qe-e2e-observation-abc130-mutants-ticket-qe-tool-5d3e0173
supersedes:
---

# `ABC-130` gap register: 1 LOW, 4 INFO. All advisory, none a criterion miss

| id | sev | gap | evidence | owner / suggested route |
|---|---|---|---|---|
| QE-130-a | LOW | No criterion **behaviourally** pins the page's "literal, never from the config" rule. A mutant that reads the pathspec from `vitest.config.ts` (`T5`) passes `A1`, `A2` and `A4` as written. Today the rule is held by source inspection and by QE's added count pin: under `A2`, tracked = 50 (literal) against 53 (`T5`) | mutants note `…5d3e0173`, `T5` | BA/PM: next time this tool's tickets are cut, `A2` should also state "tracked count = `A1`'s `git ls-files` count". No action on `ABC-130` |
| QE-130-b | INFO | The directory boundary is not pinned by any criterion. `T3` (`".grugops"`, no slash) and `T4` (`".grugops/context/"`) survive `A1`–`A4`. The shipped tool is correct on both: `.grugopsx/` is green and a `.grugops/queue/` probe is green | `T3`/`Q2e`, `T4`/`Q5` | none. Recorded so that a later edit to `OMITTED_DIR` knows what holds it |
| QE-130-c | INFO (fenced) | The recurrence remains for **other excluded, tracked directories**. A committed `*.test.ts` under `plans/` (`Q2c`) or `.claude/` (`Q2d`) reds the tool on a correct tree. The text (`Tracked by git but NOT collected`) is true. The page fences `plans/`, `memory-bank/`, `.github/` and `.gemini/` ("add one when a file appears"). **`.claude/` is not in that list**, yet it holds tracked files (`settings.json`, `skills/`). It has 0 tracked `*.test.ts` today | `Q2c`, `Q2d` | BA/PM: name `.claude/` beside the other four when the next pathspec is cut |
| QE-130-d | INFO (fenced) | `ABC-118` G4 stays open for paths outside `.grugops/`. A committed `src/zz.test.mjs` is reported `Collected by the lane but NOT tracked by git`, which is false: `*.test.ts` never matches `.mjs`. The page scopes G4 out except under `.grugops/`, where `A2` closes it | `Q2f` | BA/PM, with QE `ABC-118` G2/G3/G4/G6, already owed |
| QE-130-e | INFO | Not every mistype of `".grugops/**"` is a harmful edit. On vitest 3.2.7, `".grugops/*"` prunes the directory and the lane stays at 50, so the tool's green is true (`Q1a`). `".grugop/**"` does open it, and the tool names all five probes (`Q1b`). A nested `src/.grugops/` is a lane directory on both sides, because glob and pathspec are root-anchored alike (`Q1c`–`Q1e`) | `Q1a`–`Q1e` | none |

**Not covered (stated, not smoothed).**
- The tool was not run against the **main checkout**, with its live `.claude/worktrees/*`. QE kept
  out of the main checkout's tree, apart from the queue claim. The M2 plant stands in for that case.
- `UNKNOWN - verify`: behaviour under other vitest majors, since `Q1a`'s pruning is a vitest 3.2.7
  fact. Also unchecked: a path containing a newline. Vitest's line-split output is `ABC-118`'s and
  is not touched here.
- The tool still has **no caller** (`ABC-118` G1, `ABC-109`'s Scribe line). This ticket makes it
  green, so that line can now land without wiring in a red control.
