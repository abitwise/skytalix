---
id: 20261022T141257Z-software-engineer-observation-a72e3f79
kind: observation
by: software-engineer
at: 2026-10-22T14:12:57Z
verified_by: 
confidence: high (every figure was run; counts only, no timing)
refs:
  - ABC-178
  - QE-177-a
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-197
  - 43e4996f
  - efaa0a76
  - 20261022T134641Z-ba-pm-decision-8165d1ba
  - 20261022T134635Z-ba-pm-observation-d5e744dd
  - 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - src/uci-session.test.ts
supersedes: 
seal: sha256:1a652aa49dc9377d33058aa3e7cc9cae9bdde3a44bc76a6bef6c129e0deb0657
---

# ABC-178 tip `efaa0a76` (branch `grugops/ABC-178`, base `43e4996f`): B3, B4, B9 and the UAT waiver form, as they ran

- **B3:** `git diff --name-only 43e4996f efaa0a76` → `src/uci-session.test.ts` only. `git diff -U0` → 0 `-` lines, 1 hunk, 7 `+` lines (comment, row, blank separator; see the decision note).
- **B4:** `npm test` at the tip: exit 0; `.test-results/last-run.json` `success: true`, 1 996 total, 1 996 passed, 0 failed, 0 pending, 0 todo. That is base 1 995 (scratch B lane, `success: true`) + 1. `src/uci-session.test.ts`: 126 at base, **127** at the tip, all passed. Sorted full names under `LC_ALL=C`: base ⊂ tip, 0 base-only names, and exactly one tip-only name, R1's.
- **B9 gates (tip worktree, `node_modules` symlinked):** `npm run lint` exit 0 (119 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0. Skip-count capture as spelled → `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0. `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts` → 5/5 passed, exit 0.
- **B9 M4:** the A11 sweep row is green at the tip. A scratch M4 mutant on H (`write("readyok")` followed by `write("debug m4")`, restored and `cmp`-checked afterwards) turns "every line written in every row starts with an M4 prefix" red, together with 4 exact-output rows.
- **UAT waiver form:** `git -c core.quotePath=false diff --name-only 43e4996f efaa0a76 | grep -v '\.test\.ts$' | grep '^src/'` printed nothing (grep exit 1). The `<delivered>~1 <delivered>` form also printed nothing. Zero production lines.
- **Not done here (QE's):** B6 as a gate, B7, B8. **No timing claims.** Durations in the logs ran under contention from two parallel hops.
