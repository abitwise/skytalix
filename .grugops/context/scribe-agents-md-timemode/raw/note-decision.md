# AGENTS.md: UCI TimeMode line, A11 deep lane, wait-loop line (ABC-220 fold)

Three lines added to `AGENTS.md`, nothing removed. Bytes 17,648 -> 18,176; budget 18,432 (ABC-109 A5), 256 B headroom.

1. Commands, after the `npm run uci` line: the UCI time mode (ABC-220, ADR-0052). `setoption name TimeMode value simple-tournament` searches a fixed T = 22 s a move, `min(T, C)` under a clock C, ignores `Skill Level`; default `level` unchanged; `isready` and `stop` mid-search answer up to one budget late (no worker). Facts read from the `src/uci-session.ts` header comment, not run.
2. Test, before the real-engine UCI lane: the A11 lane, `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`, in the existing npx spelling with the heap flag (cli.test.ts A3 rule). Spelling taken from QE's `qe-ABC-220` gap note (SE F3).
3. Test, under the `pgrep -f` rule: in a script, poll the job's output file or `kill -0 <pid>`; never `while pgrep -f <pattern>`.

Not touched: the 12 rules, safety rules, the Dev / run slot. Nothing run (no node, no vitest); the Orchestrator runs `cli.test.ts` (A3, A5) before merging.
