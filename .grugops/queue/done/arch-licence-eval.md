---
done_at: 2026-10-18T10:25:00Z
branch: grugops/arch-licence-eval (worktree ../wt-arch-licence-eval, from main 930a812c)
tip: 28834e6a (parent 930a812c; records only: ADR-0044 D13 revised + one decision note)
result: DONE. ADR-0044 revised in place (D13 licence evaluation, D8/D13 rename, D12 A4 two checks); still PROPOSED. Not legal advice.
  - Licence: AGPL-3.0-or-later for the repository; the four kit-installed files in tools/grugops/ (reference-check.js, test-skip-integrity.js, uat-spec-integrity.js, host-protection.js) stay MIT. The other seven tools/grugops/ files are project work (AGPL).
  - Item 1, tables: credit as-is, do not re-derive. Wiki = CC BY-SA 3.0 (page created 31 May 2008 by Pawel_Koziol on wikispaces; Michniewski's progszach post date UNKNOWN - verify). Copyrightability: EU/Estonia probably not protected, US unsettled (CDN v. Kapes), both UNKNOWN - verify. 3.0 -> 4.0 (s.4(b)(ii)) -> GPLv3 (CC 2015, 4.0 only) -> AGPLv3 (GPLv3/AGPLv3 s.13) is an inference CC does not state: UNKNOWN - verify. Credit wording for the evaluate.ts header and NOTICE is in ADR-0044 D13.
  - Item 2, kit MIT: compatible; keep the MIT notice with the four files; not in dist/, not Corresponding Source, aggregate. The MIT notice text and copyright line are UNKNOWN - verify (owner supplies; the kit ships no licence file).
  - Item 3, CC0/PD: book, mulberry32, splitmix64 need nothing; NOTICE names them as a courtesy.
  - Item 4, AGPL s.13: a stdio engine is probably not "interacting remotely" (FSF FAQ); the owner is not bound by his own licence, except possibly via GPLv3 s.13 if the tables are protected (UNKNOWN - verify). The web project stays outside while it only spawns over stdio. Advice: one "Source" link in the web UI.
  - Item 5: AGPL-3.0-or-later (recommended); -only is the alternative.
  - Folded in from the Orchestrator's mid-task message: D8/D13 rename via ABC-172 (dir/remote is owner's step), new Q14 (npm run chess, default keep); D12 A4 two checks at src/engine.test.ts:517 and :523 at 930a812c (the message cited :515/:520).
  - New owner questions: Q14, Q15 (confirm licence findings + supply the MIT notice; blocks ABC-169 only).
  - Note: .grugops/context/arch-licence-eval/notes/20261018T101627Z-architect-design-decision-agpl-3-0-or-later-tables-credited-kit-files-stay-mit-15c4fd4e.md (decision; supersedes ...e4a7c912 on D13 only). Its `at` (host clock 10:16:27Z) sorts before the owner-word note stamped 10:30:00Z: UNKNOWN - verify which clock is off.
  - Fences: git diff --name-only 930a812c HEAD -- src tools package.json package-lock.json vitest.config.ts plans is empty. No LICENSE/NOTICE added. No test run. Nothing pushed or merged. Note hand-authored, unsealed (no context-io.ts on this install).
  - Trace row is in the handoff.
---
