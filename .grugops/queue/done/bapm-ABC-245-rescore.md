---
subtask: bapm-ABC-245-rescore
role: ba-pm
ticket: ABC-245
ref: .grugops/context/bapm-ABC-245-rescore/
branch: new grugops/bapm-ABC-245-rescore from main (worktree .claude/worktrees/bapm-ABC-245-rescore)
width: records only; no vitest, no timing (an SE shares the host).
---
# BA/PM (records): re-score ABC-245 on the QE-242-a ruling
## Read
plans/tickets/ABC-245-*.md; ADR-0046 § Ruling 2026-10-31 (merged 10492743) and arch-qe242a-ruling's notes on main.
## Do
- Fold the ruling into ABC-245: the row's step is read per level call (level 1's 100 ms; step 10 admitted unless the row asserts child depth or reads an unreferenced in-child property, per the ruling's limit). R1 census line per row.
- Re-score DoR row 10. If it reaches 10/10, say Ready. The board move is the Orchestrator's.
## Fences
Records only: that ticket page (and EPIC-010's table row for it, if its state changes). No board, ADR, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-245-rescore`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **ABC-245: DoR 9/10 → 10/10, Ready** (2026-10-31; records only at `main` `caf96441`; nothing run or timed). The board
  move is the Orchestrator's. Committed `285a830c`.
- **Folded from `ADR-0046` § Ruling 2026-10-31** (`1b142ea0`, merged `10492743`): condition 2 counts a blunder row per
  level call. Level 1's 100 ms = 10 intervals at step 10, 1 at step 100, so **step 10** (step 1 only if step 10 loses
  A1, A3 or a plant of A2; the SE reports the lane cost first). The limit does not fire as worded: no depth is
  asserted, and the 0 is set at the root by a check that reads no clock (`src/levels.ts` unchanged `d58f2d77` →
  `caf96441`). A3's base score is in-child, so A3 is read at the row's own budget and step against head, as
  `ABC-242` A1 was. Test note 3: the R1 census line, reads **per level call**, labelled so; per-child only as handed.
  Estimate < +0.05 s, `UNKNOWN - verify` until `G8`.
- **Page:** front matter Ready; RE-SCORED block; A3, NFR, Dependencies dated marks; Test note 3; DoR rows 5/6/7 marked,
  row 10 ✅, 10/10. **`EPIC-010` row 21:** Ready, 10/10, waits on nothing (order: `ABC-221`'s diff checked at pull).
- **Notes** (`bapm-ABC-245-rescore`): decision `20261031T052556Z-ba-pm-decision-2a3fb53e`, observation
  `20261031T052601Z-ba-pm-observation-df8c4519` (the change record; an `artifact-ref` was refused for want of
  gate provenance, so it is an observation, as the precedent).
- **Trace row:** ABC-245 ← QE-242-b ← EPIC-010; ruling `ADR-0046` § Ruling 2026-10-31; refs on both notes.
- **Owed:** nothing to the owner; no ADR, board, `src/`, `tools/` or `data/` edit; no push, no merge.
