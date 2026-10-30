---
id: 20261030T161257Z-agents-md-scribe-decision-182f7817
kind: decision
by: agents-md-scribe
at: 2026-10-30T16:12:57Z
verified_by: 
confidence: high: three lines added, byte count read with wc -c; nothing run; cli.test.ts A3 and A5 not run (UNKNOWN - verify)
refs:
  - scribe-agents-md-timemode
  - ABC-220
  - ADR-0052
  - ABC-109
  - AGENTS.md
  - src/uci-session.ts
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-c6bdd364
supersedes: 
seal: sha256:175a4fdc2a2568c0a35ea5d6883c4940489ff5d33782cc72a8520edcba3f6759
---

# AGENTS.md: UCI TimeMode line, A11 deep lane, wait-loop line (ABC-220 fold)

Three lines added to `AGENTS.md`, nothing removed. Bytes 17,648 -> 18,176; budget 18,432 (ABC-109 A5), 256 B headroom.

1. Commands, after the `npm run uci` line: the UCI time mode (ABC-220, ADR-0052). `setoption name TimeMode value simple-tournament` searches a fixed T = 22 s a move, `min(T, C)` under a clock C, ignores `Skill Level`; default `level` unchanged; `isready` and `stop` mid-search answer up to one budget late (no worker). Facts read from the `src/uci-session.ts` header comment, not run.
2. Test, before the real-engine UCI lane: the A11 lane, `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`, in the existing npx spelling with the heap flag (cli.test.ts A3 rule). Spelling taken from QE's `qe-ABC-220` gap note (SE F3).
3. Test, under the `pgrep -f` rule: in a script, poll the job's output file or `kill -0 <pid>`; never `while pgrep -f <pattern>`.

Not touched: the 12 rules, safety rules, the Dev / run slot. Nothing run (no node, no vitest); the Orchestrator runs `cli.test.ts` (A3, A5) before merging.
