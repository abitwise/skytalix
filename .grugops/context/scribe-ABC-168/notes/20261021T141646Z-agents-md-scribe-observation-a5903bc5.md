---
id: 20261021T141646Z-agents-md-scribe-observation-a5903bc5
kind: observation
by: agents-md-scribe
at: 2026-10-21T14:16:46Z
verified_by: 
confidence: high (gate runs as listed; not a §14 verdict)
refs:
  - ABC-168
  - grugops/ABC-168
  - a347902b
  - ADR-0044
  - ABC-173
supersedes: 
seal: sha256:db38edea85082097467694468bc01a9d4889a1d8466e78262fce6e7986998cd8
---

# ABC-168 Scope 5: AGENTS.md carries npm run uci, build -> dist/, and the UCI_DEEP lane

AGENTS.md 15,606 B -> 16,090 B (+484 B; ceiling 18,432 B, headroom 2,342 B; today's 24,576 B guard, 8,486 B). Three lines: Development has the npm run uci line under its own label (never Dev / run, which ABC-042/059/065/071 pin as the one slot that runs src/cli.ts); Test has the UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts line, one backticked command, so the ABC-173 A3 parser counts 18 (floor >= 17, confirmed by running its regex over AGENTS.md); Build's comment says tsc -p tsconfig.build.json -> dist/. memory-bank/90-agents-md-command-log.md: lane row and trigger (run at QE and after any change to src/uci.ts, src/uci-session.ts, src/book-file.ts or src/engine.ts; unset: NOT DEFINED, not skipped) in On-demand commands, new sections UCI entry point and Real-engine UCI lane, Build section rewritten with the old text kept, and a scribe-ABC-168 pass entry. Gates on the pre-notes commit a347902b: lint 0, typecheck 0, build 0, npm test 0 with 60 files / 1988 tests and last-run.json success true, skip-integrity --skip-count 0 No findings; UCI_DEEP lane 5 passed. No timing taken. No src/ or plans/ lines changed.
