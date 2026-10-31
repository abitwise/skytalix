---
subtask: bapm-rpair-level6-cut
role: ba-pm
ticket: new (tools: rpair passes Skill Level 6); EPIC-010
ref: .grugops/context/bapm-rpair-level6-cut/
branch: new grugops/bapm-rpair-level6-cut from main (worktree .claude/worktrees/bapm-rpair-level6-cut)
width: records only; no vitest, no engine, no timing (qe-ABC-245 holds the host ALONE). Leave no process running.
---
# BA/PM (records): cut the rpair Skill-Level-6 ticket; restate the batch cost; audit the smoke ledger for 3 s/4 s asymmetry
## Read
- The Orchestrator ruling .grugops/context/orch-2026-10-30a/notes/20261031T065500Z-orchestrator-decision-fb0c8978.md.
- qe-EPIC-010-m1-batch's notes (PREREG …93c1fb08, evidence …5967dfc1, STOP …21029f54) and raw/probe/.
- ADR-0053 d10; EPIC-010 (§ "Did things get worse?", § The smoke ledger, the cost blocks); ABC-225's page; tools/rating/rating.ts and pair.ts (read only).
## Do
1. **Cut one ticket** (next free id, tools only, EPIC-010, P1 because it blocks milestone 1's batch):
   - rpair passes `option.Skill Level=6` to skytalix on both sides.
   - Acceptance:
     - pair-check pins the option in the argv;
     - a probe shows `go movetime 4000` searches about 4 000 ms at base ca6e675c and at head;
     - the SE confirms that the level reaches nothing in `go()` but the budget cap at both SHAs (levels 5 and 6 are both rate 0);
     - the D and R smoke paths are either left alone, with the reason stated, or given the same option. Your call; state it.
   - Size, DoR, no UAT (tools only). QE verdict.
2. **Restate the batch cost** on EPIC-010 and ABC-225: about 21.7–24.1 h ALONE at 4 000 ms both sides (QE-M1B-b), plus about 1 h of QE. Note that ABC-225-w1 A5's 21.67 games/h was a 3 000 ms rate.
3. **Audit (records reading, no runs):** list every R smoke in the ledger whose base predates ABC-228's merge (e42b637b, where level 5 went 3 000 → 4 000) while R sent 4 000 ms. Say whether its base side was capped at 3 000 ms, whether its verdict or the trend pool could move, and what (if anything) is owed. Name confidence; mark anything you cannot settle from records `UNKNOWN - verify`.
## Fences
Records only: plans/tickets/, plans/epics/. No board, ADR, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-rpair-level6-cut`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.

## Result
- **ABC-247 cut: XS, P1, tools only, DoR 10/10, Ready** (records only at `main` `278a9bb7`; nothing run, built or timed).
  The board move is the Orchestrator's. Page `plans/tickets/ABC-247-…-searches-4000-ms.md`; `EPIC-010` tickets row 22.
  `rpair` gives skytalix `option.Skill Level=6` on both builds. A1 pair-check pins it (exactly once per block per build;
  `r`/`d` argvs carry no `Skill Level` and are byte-equal to `main`'s; removing it turns a test red). A2 QE probe ALONE
  through `cutechess-cli` (block 01's dry-run argv at `-rounds 1`, base `ca6e675c` and head): `setoption … Skill Level
  value 6` sent, 0 skytalix moves at 3.0 s, ≥ 20 at 4.0 s, plus a 3.0 s control at the base. A3 SE file:line at both
  SHAs: skill reaches only the cap and the blunder branch; levels 5 and 6 rate 0; a miss is a STOP. A4 gates, empty
  `src`/`data` diff. No UAT; QE verdict.
- **D/R call: both left alone.** D plays ≤ 3 000 ms (B 1 500), never capped. R plays one build (the candidate); the R
  literal and `LEVELS[5]` = 4 000 moved in one commit (`8c82399f`), so no rebased candidate is capped; R keeps reading
  level 5. Its cost is stated on the page: the batch's level-6 head becomes the level-5 reference only while levels 5
  and 6 match below 4 000 ms; Test note 3 makes each batch PREREG re-check that and read 4.0 s clocks after block 01.
- **Cost restated** on `EPIC-010` and `ABC-225`: the batch is **≈ 21.7–24.1 h ALONE + ≈ 1 h QE** (QE-M1B-b); A6's
  21.67 games/h was a 3 000 ms rate, so 18.5 h is withdrawn. Milestone 1 spent plus remaining ≈ 29–32 h, ≈ 26–29 h ALONE.
- **Audit:** rows with a pre-`e42b637b` base are `ABC-230` (R sent 3 000; 468 moves at 3.0 s) and `ABC-228` (R sent
  4 000 to candidate `5e84d0d7`, L5 4 000; 476 moves at 4.0 s, 0 at 3.0 s). An R smoke has no base side. D at 1 500 ms
  on both sides. **No asymmetric smoke, no verdict moves, the trend pool does not move.** Only `rpair`'s A5 was exposed
  (both sides 3 000 ms). Owed: `ABC-229`'s ledger row, **folded here**; `ABC-229`'s page close and row 5 are a separate
  fold. Confidence high; no `UNKNOWN - verify` left in the audit.
- **Notes** (`bapm-rpair-level6-cut`): decision `20261031T064428Z-ba-pm-decision-96fd9906`, observation
  `20261031T064452Z-ba-pm-observation-e693b646`. Records commit `3cab2a02`.
- **Trace rows:** ABC-247 ← QE-M1B-a ← EPIC-010 (route (A) `…fb0c8978`; `ADR-0053` d10 intent); ABC-225 ← QE-M1B-b
  (cost restated); EPIC-010 ledger ← `qe-ABC-229` `…cfb537cf`. Refs on both notes.
- No board, ADR, `src/`, `tools/` or `data/` edit; no push, no merge. No process started.
