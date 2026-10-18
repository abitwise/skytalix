---
done_at: 2026-10-18T10:11:00Z
branch: grugops/bapm-engine-revise (worktree ../wt-bapm-engine-revise, from main a10e09c2)
tip: bbea4c39 (parent a10e09c2; records only: EPIC-007 revised, EPIC-004 one bullet, six ticket pages, one BA/PM decision note)
result: DONE. EPIC-007 revised in place against owner Q1-Q11 plus Q12/Q13 (owner word 6b2d90f1, relayed mid-hop); still PROPOSED, size S -> M, P1, Backlog.
  - Epic plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md: v1 = book (OwnBook), Skill Level 1-5, go depth/nodes/mate, dist/uci.js + bin skytalix, AGPL-3.0 (pending arch-licence-eval), rename to skytalix. Bridge = the web project's own backend spawns the CLI; backend/router out of repo. M1-M5 revised, M6-M11 added.
  - EPIC-004 § Out of scope: UCI half lifted on Q1 (cites a41c7e02), old sentence kept as dated history; "driving an external engine" stays a non-goal.
  - Ticket pages (all Backlog, proposal, none Ready): ABC-170 XS engine limits (DoR 9/10) -> ABC-167 S session (9/10) -> ABC-171 S OwnBook + Skill Level (9/10) -> ABC-168 S entry point + dist + UAT (9/10); ABC-169 XS AGPL licence (8/10, waits arch-licence-eval); ABC-172 XS P2 rename (9/10). Next free id ABC-173.
  - Q1-Q13 answered in the epic; Q12(a) tables and Q12(c) -only/-or-later pending arch-licence-eval (not evaluated here); new Q14 (keep `npm run chess`; recommended keep).
  - Findings for others: ABC-078 A4 amendment is TWO checks (engine.test.ts:515 and :520 loop-header pin), not one as ADR-0044 D12 says; ABC-169/ABC-172/ABC-168 fire ABC-041 clause (a) on package.json (first version said ABC-169 "No"); ADR-0044 D8/D13 still say GPL-3.0 and "package stays cli-chess" (Architect's to amend).
  - Note .grugops/context/bapm-engine-revise/notes/20261018T101000Z-...-84e602dc.md (decision; supersedes 9d3b5f61). Hand-authored, unsealed (no context-io.ts on this install).
  - Fences: git diff --name-only a10e09c2 HEAD -- src tools package.json package-lock.json vitest.config.ts memory-bank/50-decisions is empty. plans/board.md, plans/traceability.md NOT touched; board and trace rows in the hand-off. No test, vitest, build or timing run. Not merged, not pushed.
---
