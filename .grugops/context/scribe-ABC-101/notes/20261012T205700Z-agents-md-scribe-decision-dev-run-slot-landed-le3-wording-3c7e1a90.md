---
id: 20261012T205700Z-agents-md-scribe-decision-dev-run-slot-landed-le3-wording-3c7e1a90
kind: decision
by: agents-md-scribe
task: scribe-ABC-101
at: 2026-10-12T20:57:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-065
  - ABC-109
  - ABC-086
  - .grugops/context/ticket-to-pr-ABC-101/probe/agents-md-dev-run-slot.txt
supersedes:
---

# `Dev / run` slot landed with "(≤3 s/move)"; `CLI_DEEP` row refresh owed

This note is hand-authored and unsealed (no `finding` is admissible on this install).

1. **The probe's NEW block applied byte for byte, with ONE change: "(3 s/move)" became "(≤3 s/move)".**
   Why: BA/PM's remark is right. The old text said "up to 3 s/move"; level 3's `budgetMs` is a
   ceiling (`src/levels.ts`: 3,000), not a fixed time, and a reader of "3 s/move" would plan for
   exactly 3 s on every move. Cost: +3 B, so 24,569 B -> 24,576 B, exactly the `ABC-109` `A5` budget
   (24,576 B, the test is `<=`). Zero headroom is the price; the next AGENTS.md edit must trim first.
2. **The line as landed** (`Dev / run` slot, first two comment lines): `prints the board and plays a
   game against the engine, default level 3 (≤3 s/move). Options: --colour white|black|random,
   --difficulty 1|2|3|4|5, --ascii, --unicode.` The first backtick-closed span (`npm run chess`) is
   unchanged; the comment still closes inside the slot.
3. **Optional `CLI_DEEP` row refresh: NOT done, owed.** The row reads "RUN 2026-10-10: exit 0, 7
   passed (1 default)"; the lane is now 10 rows (ABC-101 `A10`: `CLI_DEEP` 10/10). "10 passed" is +1 B
   and does not fit the budget after item 1, and a RUN receipt needs a fresh run, not an edit. Owed to
   the next Scribe hop once bytes are freed.
4. **Also noticed, not touched (outside the brief):** the `Test (all)` receipt says "57 files, 1775
   tests"; this tree reads 58 files, 1789 tests. Byte-neutral to refresh, true only once ABC-101
   merges. Owed to the post-merge Scribe/Orchestrator.

## Gates (worktree, branch `grugops/ABC-101-difficulty-selection`, before the commit)

`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`: exit 0; 58 files, 1789
passed, 0 failed; `.test-results/last-run.json` `success` true; skip count 0; integrity check `No
findings.`; `wc -c AGENTS.md` = 24,576. `ABC-065` `A3` is green again (the one red is gone).
