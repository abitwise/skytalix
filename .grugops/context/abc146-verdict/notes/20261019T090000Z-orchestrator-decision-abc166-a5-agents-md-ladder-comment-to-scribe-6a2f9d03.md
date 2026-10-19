---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T09:00:00Z
sealed: false
refs: [ABC-166, ABC-146, ABC-164, AGENTS.md]
---

# ABC-166 A5 (Orchestrator half): AGENTS.md's ladder-lane comment goes to the Scribe after ABC-146 merges

**Ruling: yes.**

`AGENTS.md`'s ladder-lane comment is wrong in two places:
- it says the verdict is "not run here (~44 h in vitest)";
- it says the verdict's route is plain `node`.

In fact, route V ran in vitest. Run 2 took 40 823 s on a shared host. Its reading is in `…4c1d8e27`.

**Constraints on the Scribe hop:**
- It runs after ABC-146 and ABC-166 merge.
- `AGENTS.md` is exactly at its 24,576 B budget, so the rewrite must come to net ≤ 0 B or ride with ABC-164.
- It cites run 2's reading and the dated line in ADR-0038 addendum 2 (`1524297a`).
- The command it records carries `--reporter=verbose`.

**A record gap, noted and left unedited.** Run 2's `raw/verdict-run2.meta.txt` does not record its command line. The command is recorded in two other places:
- main's `plans/board.md` (`8636b0f0`);
- the Orchestrator's launch script, which ran `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose` from the root of `wt-ABC-146`.

The raw files are not edited after the run.
