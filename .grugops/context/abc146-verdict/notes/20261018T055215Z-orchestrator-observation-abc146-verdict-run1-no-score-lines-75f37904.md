---
type: observation
role: orchestrator
task: wave-2026-09-25
at: 2026-10-18T08:55:00Z
sealed: false
refs: [ABC-146, ADR-0038]
---

# ABC-146 verdict run 1: 17/17 rows passed, but no `LADDER` line reached the output — NO SCORE IS QUOTED

- Command (route V, as ADR-0038 addendum 2 names it): `caffeinate -i env LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`,
  in `wt-ABC-146` at `c639a220`, stdout+stderr to `raw/verdict-run1.out.txt`. Start 2026-10-17T19:13:37Z, end 2026-10-18T05:50:59Z,
  exit 0. vitest reports `Tests 17 passed (17)`, `Duration 38201.85s` (10.6 h). Battery at start, AC by the end; lid state not recorded.
- **What the pass does carry:** each verdict row asserts `played.length === games`, no game ended `error` (no cap hit), and every
  game replays legally. So `ABC-085` `A3`/`A4` held for every row that ran (180 of 180 if the plan's rows are as the page says).
- **What is missing:** the scores. The rows print `LADDER GAME` / `LADDER PAIR` with `console.log`, and vitest 4.1.11's `default`
  reporter dropped every one of them from a passing test. Reproduced 2026-10-18 with a one-line probe test in this worktree:
  `console.log` is absent under the default reporter and present under `--reporter=verbose`; `process.stdout.write` appears in both.
  `ABC-085` `A1`/`A2` (MET/RED) exist only in those lines, so **no score is quoted from run 1** (never estimate a number not read).
- Next run, if the owner agrees: same command plus `--reporter=verbose` (an output flag only; games depend on node counts, so the
  same games are played). A0 stays current: nothing on its staleness list has changed.
