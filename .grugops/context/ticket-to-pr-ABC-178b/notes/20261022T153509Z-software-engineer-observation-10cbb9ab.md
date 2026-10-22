---
id: 20261022T153509Z-software-engineer-observation-10cbb9ab
kind: observation
by: software-engineer
at: 2026-10-22T15:35:09Z
verified_by: 
confidence: high (every gate was run; no timing)
refs:
  - ABC-178
  - QE-178-b
  - QE-178-a
  - QE-177-a
  - ABC-167
  - EPIC-007
  - efaa0a76
  - 0fb19ab9
  - 0036e5c6
  - d12831c6
  - 43e4996f
  - d781e5e5
  - 20261022T152530Z-ba-pm-decision-1f4936b2
  - 20261022T152530Z-ba-pm-observation-34bf730b
  - 20261022T151738Z-qe-e2e-decision-1ad5f522
  - 20261022T151717Z-qe-e2e-observation-f910b911
  - 20261022T141254Z-software-engineer-decision-82e891e8
  - src/uci-session.test.ts
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes: 
seal: sha256:f7536066af8e38ef3ee76766c3f896ce0ceb1f2b0fe6d0cfa5000dc27c3f4cd4
---

# ABC-178b tip `0036e5c6`: amended B1, B3, B4, B9 gates and the UAT waiver form, as they ran. No timing taken

- **B1:** R1 at the tip checks session 1 before session 2 (no `bestmove`), checks session 2's fresh `talk` `out` is `[]`, then re-reads `held.out` after session 2 (no `bestmove`). Green in `npm test`.
- **B3:** `git diff --name-only d12831c6 0036e5c6` gives `src/uci-session.test.ts`. `-U0`: 0 `-` lines, 1 hunk `@@ -282,0 +283,9 @@`. Its 9 lines are the R1 comment (`ABC-178`, `QE-177-a`), the 5-line row with the new closing line, the `QE-178-b` comment, the re-check line, and the blank separator. Against `efaa0a76` (`src/`): 0 `-` lines, +2.
- **B4:** `npm test` exit 0. `.test-results/last-run.json` reads `success: true`, 60 files, 1 996 total, 1 996 passed, 0 failed, 0 pending, 0 todo. `src/uci-session.test.ts` has 127 tests, all passed. The sorted name list is `cmp`-equal to QE's `names-file-H.txt` (`efaa0a76`). Against QE's base list the only tip-only name is R1's. The test count is unchanged from `efaa0a76`.
- **B9:** `npm run lint` exit 0 (119 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0. The skip-count capture as spelled in `AGENTS.md` gives `0`. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and exits 0. `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts` gives 5/5 passed, exit 0. Heap: 128 on the multi-file runs, 400 on the one-file runs. The M4 sweep row is green inside `npm test`. The scratch M4 kill was **not re-run** in this hop: the fold touches no line it reads, and QE's re-read owns it.
- **UAT waiver form:** `git -c core.quotePath=false diff --name-only <a> <b> | grep -v '\.test\.ts$' | grep '^src/'` printed nothing (grep exit 1) for `0036e5c6~1 0036e5c6`, `d12831c6 0036e5c6` and `43e4996f 0036e5c6`. Zero production lines.
- **Not done here:** B6 as a gate (QE), B7 and B8 (OWED; a quiet-host timing hop). **No timing claims.** Durations in the logs ran next to two parallel QE hops.
