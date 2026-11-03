---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T13:05:12Z
subtask: qe-ABC-273
role: qe-e2e
ref: .grugops/context/qe-ABC-273/
branch: new grugops/ABC-273 from main — worktree .claude/worktrees/qe-ABC-273 (records only)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core, one game at a time, --concurrency 1. **ALONE window for games** (only a records-only Architect hop may run beside you). Set CUTECHESS_CLI and STOCKFISH to the pinned binaries (the same paths qe-ABC-269 used — see its notes …2c51ee30 / raw; verify sha256 against the tool's pins). **If your PREREG estimate exceeds 1 h, or the band rule would step E and need a second run: STOP and return the question (owner asks for > 1 h).**
---
# R1: the first EPIC-011 milestone reading after E1 (ABC-273)
Read plans/tickets/ABC-273*.md, the R1 ruling (…8136b589 in .grugops/context/arch-post-269), ADR-0056 S′/band rule and D6 R1 line, EPIC-011 G2.
1. Seal a PREREG before any game: build = main (src tree at 85a304ff), command exactly
   `node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1` (200 games), E 1810 confirmed by the band rule, the time estimate, what the reading reports (score, Elo vs E ±, time losses, faults, latency) and the band-rule consequence of each outcome.
2. Run it. Check R1-A2 (both env vars shown as set in cmd.txt / machine.txt) and ABC-275 A6 (machine.txt control line: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000).
3. Report; the result is a reading, not a merge gate. State whether the band rule steps E (and whether that needs the owner's word — downward always does).
Fences: records only (no src/tools edits). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-273, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: R1 read, VALID, on `main` `85a304ff`** (`src/` `4d6b117b`, after E1; `main` `7a5047b3` has the same `src/` and `tools/`). This is a reading, not a merge gate. Finished 2026-11-03T13:52:07Z. Not pushed, not merged.

- **PREREG** `20261103T131138Z-qe-e2e-decision-3cda6a60`, sealed and committed (`fa88e150`) before any game.
  - Estimate: 25–54 min (0.4–0.9 h). That is under 1 h, so the owner was not asked.
  - E 1 810 was confirmed as the start.
- **Command as run** (under the host lock, host ALONE):
  `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> node tools/rating/rating.ts r 85a304ff <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`
  - Ran 13:12:07Z–13:47:36Z, 35 min 29 s.
  - Both tools are sha256 = pin.
- **Result:** **99.0 / 200 (49.5 %)**, W/D/L 95/8/97 (as White 54.5, as Black 44.5).
  - Elo **−3.5 ± 47.4** against E 1 810, so **X = 1 806.5 ± 47.4**. The opening-cluster interval is ± 48.4.
  - Faults 0, unclassified 0, time losses 0 (either side), depth guard 0 of 10 508.
  - Latency: skytalix median 100 ms, max 106 ms, 0 moves at 150 ms or more. Stockfish median 100 ms, max 102 ms.
  - `G11` (reported): d3 / Be2 / exd6 / d4 / Kc1.
  - Milestone: **none** (E < 2 200).
- **Checks:**
  - R1-A1 MET.
  - **R1-A2 MET:** both variables are set and redacted, both `machine.txt` tool lines read `= pin`, and `cmd.txt` has Stockfish `st=0.1 timemargin=2000`.
  - R1-A3 MET (0.59 h).
  - **`ABC-275` A6 MET:** `control: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000`, byte-equal. This closes QE-275-c.
  - R1-A4 is BA/PM's records hop.
- **Band rule:** 99.0 is inside 50.0–150.0, so **E 1 810 is confirmed. No step, no second run, no owner ask.**
- **Gaps** (none blocking):
  - QE-273-a INFO (Orchestrator): a foreign vitest ran without the lock, in 10 % of samples.
  - QE-273-b LOW (Security/NFR, then BA/PM): `r` and `d` records are not redacted, and 106 committed context files carry the home path.
  - QE-273-c INFO (BA/PM): R1-A1's "re-run once" against R1-A3's "asked".
  - QE-273-d INFO: the colour split.
- **Notes** (admitAndAppend, worktree context root, 0 findings, index rendered):
  - `…3cda6a60` (PREREG)
  - `20261103T135141Z-qe-e2e-decision-07b3c794` (reading)
  - `…-observation-00477b40` (runs)
  - `…-observation-334a1bf6` (gaps)
- **Board:** no `board.md` edit here; the column move is the Orchestrator's. Raw files are under `.grugops/context/qe-ABC-273/raw/`, with paths redacted.
- **Nothing left running.** No node_modules symlink was needed. The scratch build clone was deleted.
