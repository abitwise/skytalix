---
done_at: 2026-10-18T09:52:00Z
branch: grugops/arch-engine-revise (worktree ../wt-arch-engine-revise, from main bd09e481)
tip: 6e9d489b (parent bd09e481; records only: ADR-0044 revised + one decision note)
result: DONE. ADR-0044 revised in place against the owner's Q1-Q11; still PROPOSED (owner acceptance of the revision owed).
  - ADR: memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md (file name kept; title and "§ Revision — 2026-10-18" updated).
  - Q4 (D10): OwnBook check default true; probe built once in uci.ts over readBookFile; session probes the post-moves position, book before search, no withBook import; read once per process at first isready (else first go); bad/missing file = book off for the process + one info string.
  - Q5 (D11): Skill Level spin default 3 min 1 max 5 over LEVELS, no Elo; budget = min(go budget, level.budgetMs); rate-0 levels call chooseMove, blunder levels a per-go createLevel seeded floor(random()*2^32) from the injected source; ucinewgame does not reseed.
  - Q6 (D12): optional EngineOptions.maxDepth / maxNodes, absent = today's engine node for node; depth N -> maxDepth, nodes N -> abort at node budget (last completed iteration), mate N -> maxDepth 2N-1; all under HARD_CEILING_MS. Amends ABC-078 A4 (one check) and ADR-0027 d3. src/engine.ts changes; src/search.ts does not.
  - Q7 (D8 replaced): tsconfig.build.json (files [src/uci.ts], rootDir src, outDir dist, rewriteRelativeImportExtensions); npm run build -> dist/uci.js; bin skytalix; backend spawns node <clone>/dist/uci.js. No native binary, bundler, publish or Worker in v1.
  - Q8 (D13): GPL-3.0-or-later. Book CC0, mulberry32 CC0, splitmix64 PD, 0 runtime deps. evaluate.ts PIECE_VALUE + six PSTs equal Michniewski's Simplified Evaluation Function (CPW, CC BY-SA 3.0) -> new Q12.
  - Q9 (D13): id name skytalix, id author Olger Oeselg, bin skytalix; package/repo/terminal game not renamed -> new Q13.
  - Note: .grugops/context/arch-engine-revise/notes/20261018T095000Z-...-e4a7c912.md (decision; supersedes ...c5d07e91 on Q4-Q9).
  - New owner questions: Q12 (licence scope: PST provenance, kit tools/grugops files, -or-later vs -only; blocks ABC-169 only), Q13 (rename; recommended no).
  - Fences: git diff --name-only cfd496dd HEAD -- src tools package.json package-lock.json vitest.config.ts is empty. No test/vitest/build/timing run. plans/board.md, plans/traceability.md, plans/nfr-catalog.md and EPIC files NOT touched. Nothing pushed or merged. Note hand-authored, unsealed (no context-io.ts on this install).
  - Trace row is in the handoff.
---
