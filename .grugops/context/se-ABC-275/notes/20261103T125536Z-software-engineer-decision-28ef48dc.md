---
id: 20261103T125536Z-software-engineer-decision-28ef48dc
kind: decision
by: software-engineer
at: 2026-11-03T12:55:36Z
verified_by: 
confidence: high
refs:
  - ABC-275
  - ABC-273
  - ABC-255
  - EPIC-011
  - ADR-0056
  - grugops/ABC-275
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - arch-post-269/20261103T123540Z-architect-design-decision-8136b589
  - R1
  - C4
  - C3-prime
supersedes: 
seal: sha256:f9d0a7b7f3efcf9eff5683d8e0653ceaed7a1c54db1816f59e868b92a138f665
---

# SE decision, se-ABC-275: r takes 500 or 100; Stockfish's st follows the budget; E > 2600 refused at 100

- **Budgets.** `R_BUDGETS_MS = [500, 100]` (`R_SMOKE_BUDGET_MS`, new `R_SHORT_BUDGET_MS`). Any other `--budget-ms` on `r` is refused: "`--budget-ms V: r takes only 500 or 100`" (exit 1). No flag stays `R_BUDGET_MS` = 4 000. Parsing is unchanged (`Number(...)`, so `QE-255-b` stands as ruled).
- **skytalix at 100.** No new code: `timemarginMs(100)` already returns 50 from `SHORT_MARGIN_MS`, so skytalix gets `st=0.1 timemargin=50`, no `option.` token.
- **Stockfish.** The literal `"st=0.5"` becomes `` `st=${stockfishSt(budget)}` ``, `stockfishSt(ms) = ms === 100 ? 0.1 : 0.5`. At 4 000 and 500 (and `rpair`, which always passes `R_BUDGET_MS`) it prints `st=0.5`, byte-equal. `timemargin=2000`, `Threads 1`, `Hash 16`, `UCI_LimitStrength`, `UCI_Elo` are untouched.
- **E guard.** After the 1320–3190 range check, `r` at 100 with E > `R_SHORT_ELO_MAX` (2600) throws "`--elo E: above 2600 at --budget-ms 100; C3′'s probe runs first`" (exit 1), before any build or process start. 2600 itself passes. At 500 / 4 000 the range is 1320–3190 as before.
- **Records.** `machine.txt`'s `control:` line at `r` 100 reads `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`. At `r` 500 it stays `control: skytalix st=0.5 timemargin=50`; at `d` 100 `control: skytalix and base st=0.1 timemargin=50` (byte-equal). `cmd.txt` already carries the full argv, so it shows Stockfish `st=0.1 timemargin=2000` with no change.
- **Usage text left byte-equal** (it still says "R 500 only"), because A3 item 3 pins `rpair`'s refusal to today's usage text. The thrown message names 500 and 100. Small stale line, recorded as an observation.
- **Deviation from the page:** none.
