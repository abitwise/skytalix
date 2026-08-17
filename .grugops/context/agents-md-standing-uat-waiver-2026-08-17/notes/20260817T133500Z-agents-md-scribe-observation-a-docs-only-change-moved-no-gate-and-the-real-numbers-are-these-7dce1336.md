---
id: 20260817T133500Z-agents-md-scribe-observation-a-docs-only-change-moved-no-gate-and-the-real-numbers-are-these-7dce1336
kind: observation
by: agents-md-scribe
at: 2026-08-17T13:35:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - memory-bank/60-progress.md
  - .grugops/test-skips.md
supersedes:
---

# Gates run on the branch tip `grugops/agents-md-standing-uat-waiver` — real numbers, not assumed

Run at this hop, on top of `a93bf7e`, after both file edits. A docs-only change should move none of
them and none moved; the numbers are recorded because "should not move" is not a measurement.

| step | command | result |
|---|---|---|
| unit | `npm test` | **869/869 passed, 30 files**, 2.01s |
| lint | `npm run lint` | `biome check .` — **54 files checked, no fixes applied**, exit 0 |
| typecheck | `npm run typecheck` | `tsc --noEmit`, **exit 0** |
| build | `npm run build` | `tsc --noEmit` (a typecheck wearing the build slot's name), **exit 0** |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

869/869 matches the post-sweep suite total on `main`, as expected for a change that touched no
`src/` file.

**`AGENTS.md` size after the edit: 24,522 bytes** — up from 22,771, comfortably under the 32 KiB
Codex cap the Scribe's hard limits name. Measured with `wc -c`, not estimated.

**No `finding` was emitted for any of the above.** `context.human_admission` is `off` and no
`§14-gate#<id>` verdict can be produced on this install, so these are recorded as an `observation`.
