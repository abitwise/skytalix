---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:25:34Z
subtask: qe-ABC-300
role: qe-e2e
ref: .grugops/context/qe-ABC-300/
branch: new grugops/qe-ABC-300 from grugops/ABC-300 — worktree .claude/worktrees/qe-ABC-300
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Offline rows only; no games (A6 is read at ABC-282's A6). Host paths only as placeholders.
---
# Verify ABC-300 (the harness plays a clock, tools only)
Read plans/tickets/ABC-300*.md, se-ABC-300's notes (…a0bef530, …b0b970ed, …33a60189) and its diff on grugops/ABC-300 against main.
Re-check A1–A5 and A7 independently. Make break attempts:
- other --tc values;
- flag order and duplicate flags;
- --tc on r/rpair;
- byte-equality of every existing dry-run argv;
- 0 src lines.
A6 stays UNKNOWN until ABC-282's A6; carry it as a named gap. UAT is waived (tools only).
Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note.
Fences: tests and your records only on your branch; never edit tools/rating/rating.ts itself. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-300, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**DONE: QE verdict PASS_WITH_GAPS on ABC-300.** This verdict signs acceptance: the ticket is tools only, so there is no UAT. Read at branch `grugops/ABC-300` `50f30cba` (code `9835859d`), against the cut `19581ca1`. by: qe-e2e (claude-opus-5-5), at: 2026-11-04T14:44:38Z. Not pushed, not merged. No game was played.

- **A1** MET. The `--tc 40/8 --rounds 50 --concurrency 1` vector is the `--budget-ms 100` vector with exactly three token changes per engine block:
  - `st=0.1` → `tc=40/8`;
  - `timemargin=50` → `timemargin=0`;
  - `option.TimeMode=uci-clock-mode` after `restart=on`.

  The same holds at the defaults. Flag order and a doubled `--tc 40/8` give the same print.
- **A2** MET:
  - 19 bad `--tc` values exit 1 with `--tc <value>: d takes only 40/8` and no argv.
  - `--tc` with `--budget-ms` is refused, naming both flags, at all six budgets and in both orders.
  - `r` and `rpair` refuse `--tc` with the usage text.
  - The 14 refusals probed start no child process.
- **A3** MET:
  - 17 prints are byte-equal to the cut.
  - 7 refusals are equal except stack line numbers.
  - 6 usage cases differ only by A4's pair.
  - The cut's unedited pair-check against the branch: 39/40, and the one fail is ABC-276 A5.
- **A4** MET.
- **A5** MET: 0 lines under src/, data/ and vitest.config.ts.
- **A6** `UNKNOWN - verify` (QE-300-a), read at ABC-282 A6. Supporting evidence only: one fake-tool real run has the `control:` line and the `cmd.txt` tokens, and its sums verify.
- **A7** MET: lint, typecheck and build green; npm test 69 files, 2 650/2 650, 0 skipped; pair-check 45/45.
- **Gaps:**
  - QE-300-a: A6 carried to ABC-282 A6.
  - **QE-300-b, LOW:** the `control:` line and refuse-before-any-process have no row. M7 and M8 survive pair-check; QE's run and probe kill them.
  - QE-300-c, INFO: duplicate flags, last value wins. That is the cut's rule for every flag.
  - QE-300-d, INFO: `40/8` is 40 moves in 8 s. The SE note's "32 minutes" reads it as minutes, and the usage text gives no unit. ABC-282's PREREG should take its wall time from ADR-0071 D10.
- **Notes** (sealed with context-io admitAndAppend, 0 findings):
  - `20261104T144414Z-qe-e2e-decision-fbda2ad6` (verdict);
  - `…-observation-69a765b1` (gaps);
  - `…-observation-4cb95623` (runs).
- **Board:** the move out of In Review is the Orchestrator's. No board.md edit here.
- **Nothing left running.** The node_modules symlink and the scratch dir are removed.
