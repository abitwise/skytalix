---
done_at: 2026-10-18T11:08:05Z
branch: grugops/bapm-ABC-169-rescope (worktree ../wt-bapm-ABC-169-rescope, from main 692770d6)
tip: 01012436 (parent 692770d6; records only: three ticket pages and one BA/PM decision note)
result: DONE.
  - ABC-169 re-scoped (ABC-122 precedent). New Scope 4 adds exactly `"license",` to ABC-042 A10's AT_HEAD (src/cli.test.ts:1766-1775). Nothing else in that test or file changes.
  - ABC-169 A5: the diff names exactly package.json, src/evaluate.ts and src/cli.test.ts. The numstat on src/cli.test.ts is 1/0, and the added line, trimmed, is `"license",` inside AT_HEAD. tools and package-lock.json are unchanged.
  - ABC-169 A6: the four gates are green with the same test count as base. No test is added. The only test edit is A5's line. Armed reading: with package.json's license line removed, A10 is the only red row.
  - ABC-169 ADR-0036 (c), re-read: it does not fire, because one string literal adds no capability and read-only fs is precedent. No other test-integrity rule fires: skips stay 0, and test-skips.md and qe-hop are untouched. UAT stays expected WAIVED by A3, because the waiver grep drops *.test.ts. Still XS. DoR 10/10.
  - ABC-168 fixed before its build. Scope 6 makes four literal A10 edits: "bin" into AT_HEAD, "bin" out of the reserved list, build -> "tsc -p tsconfig.build.json", and uci: "node src/uci.ts" into SCRIPTS_AT_HEAD, so `added` stays ["chess"]. A11 no longer says "unedited" and has an armed reading. A12 adds src/cli.test.ts (numstat 4/2). Test note 5 lists the AGENTS.md pins (ABC-042 A1, ABC-065/071, ABC-059, ABC-109). dist/ is already gitignored. DoR 10/10.
  - ABC-172: no edit is needed. A10 pins keys, not the name value. `git grep cli-chess -- '*.test.ts' ':!.grugops'` is empty. A recorded test note 3 and a banner. DoR 10/10.
  - Note: .grugops/context/bapm-ABC-169-rescope/notes/20261018T110713Z-ba-pm-decision-abc169-one-pin-element-abc168-four-abc172-none-abd27e75.md (decision). Hand-authored and unsealed, because this install has no context-io.ts.
  - Fences: `git diff --name-only 692770d6 01012436 -- src tools package.json package-lock.json vitest.config.ts memory-bank/50-decisions plans/board.md plans/traceability.md` is empty. No tests or timings were run. Nothing is merged or pushed. The wt-ABC-169, wt-ABC-170 and wt-ABC-146 worktrees were not touched.
  - Board moves: none. ABC-169 stays In Development, and the redo is the Orchestrator's to dispatch on grugops/ABC-169 @ 4a0a075f. The trace row is in the hand-off.
---
