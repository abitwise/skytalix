---
id: 20260818T163000Z-qe-e2e-observation-abc-106-gate-numbers-3f8a91c2
kind: observation
by: qe-e2e
at: 2026-08-18T16:30:00Z
verified_by: ""
confidence: high
refs:
  - ABC-106
  - src/san.parse.test.ts
  - .grugops/test-skips.md
supersedes: ""
---

# Gate numbers, run twice — at the delivered tip and after my two comment repairs

Branch `grugops/quality-gate-ABC-106-qe-2026-08-18`, cut from `grugops/abc106-ruled-tolerances`
tip `848e78e`. Every number below was RUN, both before and after my edits, and **every one is
identical across the two runs** — which is the point for a comment-only ticket.

| gate | command | before | after |
|---|---|---|---|
| suite | `npm test` | **999 passed / 35 files** | **999 passed / 35 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.` exit **0** | `No findings.` exit **0** |
| file under test | `npx vitest run src/san.parse.test.ts` | **30/30** | **30/30** |
| perft deep | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32** | **32/32** |
| lint (all) | `npm run lint` | 62 files, exit **0** | 62 files, exit **0** |
| lint (scope) | `npx biome check src/` | 58 files, exit **0** | 58 files, exit **0** |
| typecheck | `npm run typecheck` | exit **0** | exit **0** |
| build | `npm run build` | exit **0** | exit **0** |

**Two numbers the brief corrected, and I confirm both by measurement.** `src/san.parse.test.ts`
is **30** tests, not 32. **32/32** is `PERFT_DEEP=1` on `src/perft.test.ts`. They are different
files and different counts, and collapsing them is how the earlier brief went wrong.

**`.grugops/test-skips.md` was READ and passed to the checker. No row was written into it.**

**The stale-worktree `biome.json` artifact did NOT reproduce this hop.** `npm run lint` came back
clean over all 62 files, so the scoped `npx biome check src/` run was a confirmation rather than a
workaround. Nothing under `biome.json` was touched.
