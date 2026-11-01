---
id: 20261101T184932Z-software-engineer-observation-7d014b05
kind: observation
by: software-engineer
at: 2026-11-01T18:49:32Z
verified_by: 
confidence: high: every command below was run at the tip worktree under flock host-test.lock and its output kept in raw/gates/; G8 informal, not alone
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
  - NFR-008
  - G8
  - ab9f4803
supersedes: 
seal: sha256:c76d699601e2515c460197a45be6c87154063a4029155ba732d643941c70ebd3
---

# se-ABC-260 artifact and gates: branch grugops/ABC-260 @ 040f7f26, test file only; A7–A9 SE side

- **Artifact:** branch `grugops/ABC-260` (worktree .claude/worktrees/se-ABC-260, from main 524b7949). Claim 22d815e7, code 040f7f26. Changed: src/levels.test.ts only, +12/−6: the helper, A8's `code` line, ABC-259's `codeOf`, and the environment row's title, comment and match. Not pushed, not merged.
- **A7:** `git diff 22d815e7 040f7f26 --name-only` prints src/levels.test.ts. No `expect(` line changed. Only the environment row's title changed. In A8 only the `code` line changed. Added comments cite ABC-260, ABC-259, ABC-087 and QE-259-a/b. Header count 49 (no rows added).
- **A8 cost:** the 5 rows (A8 ×2 + ABC-259 ×3) summed 1.081 / 1.039 / 1.077 ms over the 3 `npm test` result files (.test-results/last-run.json), median **1.077 ms** (≤ 20 ms). This is per-test `duration`; the describe-time file read and strip happen at collection and are not in it, the same measure as ABC-259.
- **A9, SE side:**
  - lint, typecheck and build each rc=0.
  - lane-inventory: 63 = 63.
  - `npm test` ×3: 63 files, 2 366 / 2 366 pass. Base `npm test` at main ab9f4803 (src identical to 524b7949): 2 366, so +0 = the rows added.
  - Skip count 0 (vitest JSON, `./node_modules/.bin/vitest`, heap 128); test-skip-integrity "No findings." rc=0.
  - Informal G8: vitest Duration 8.50 / 9.04 / 8.79 s, median 8.79 s; wall 8.77 / 9.33 / 9.11 s. Not alone: load1 1.5–2.4 and 1 foreign vitest process. QE owns G8.
- **Waiver:** `git -c core.quotePath=false diff --name-only 040f7f26~1 040f7f26 | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. So there is no smoke and no UAT; QE's verdict is the gate.
- **Note:** main moved from 524b7949 to ab9f4803 during the lock wait (ADR-0055 docs only, no src/tools/package/vitest change).
- **Remaining:** QE re-reads A2–A5 and A9 (qe-e2e hop). Merge is the Orchestrator's.
