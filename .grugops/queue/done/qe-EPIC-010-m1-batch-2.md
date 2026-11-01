---
subtask: qe-EPIC-010-m1-batch-2
role: qe-e2e
ticket: EPIC-010 milestone 1 batch (§ "Did things get worse?", layer 3), re-run after ABC-247
ref: .grugops/context/qe-EPIC-010-m1-batch-2/
branch: new grugops/qe-EPIC-010-m1-batch-2 from main at spawn (worktree .claude/worktrees/qe-EPIC-010-m1-batch-2)
width: STRICTLY ALONE for the whole run (≈ 21.7–24.1 h). Only records-only hops (no vitest, no engine) may run beside you.
owner: "18.5h pair run you can schedule now" (…c2752305); route (A) and the restated cost: Orchestrator ruling …fb0c8978
---
# QE: EPIC-010 milestone-1 batch, run 2: 400-game interleaved R pair at Skill Level 6 (4 000 ms both sides), width 1
## Read
- The first attempt's notes on main: .grugops/context/qe-EPIC-010-m1-batch/ (PREREG …93c1fb08 with the base derivation, evidence, STOP …21029f54).
- ABC-247's page (Test note 3: the PREREG re-checks levels 5/6 at both SHAs; read 4.0 s clocks on both builds after block 01, a miss is a STOP) and qe-ABC-247's notes (the probe method, QE-247-b: redact host paths in prints).
- EPIC-010 § "Did things get worse?" and the restated cost; ADR-0053 d10; EPIC-008's merge rule (X + Y ≥ 0 is not LOSS); AGENTS.md's A11 lane and wait rules.
## Do
1. **PREREG before any game:**
   - base ca6e675c (re-confirm the derivation; it was unambiguous in run 1);
   - head = main at spawn;
   - the exact `rpair` command (E = 1 910, 400 games, `--concurrency 1`; the tool now carries Skill Level 6);
   - the levels 5/6 re-check at both SHAs;
   - the verdict rule, the thermal stop, and crash/halt handling (resume per ABC-225).
2. Pair-check first. Run in the background to an output file.
   - After block 01, read the PGN clocks: both builds at 4.0 s, 0 at 3.0 s, else STOP.
   - Check about every 30 min: progress, Tctl, contamination (log it, do not kill others' processes).
   - Thermal stop: Tctl median > 85 °C → halt and resume.
3. Report:
   - X, Y and the score with its half-width; the verdict (LOSS / not LOSS);
   - wall time; nps spread per block; time losses; crashes; thermal readings; the contamination log.
   - On not LOSS, head's R score becomes the trend reference (EPIC-010 § After a passing batch); record it for BA/PM.
   - On LOSS, list the suspects from the ledger, for information only.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: never `while pgrep -f …`; never put vitest or the batch on the same command line as a wait.
- Redact host paths before committing prints. Keep scratch small; remove it at the end. Leave no process running. Scratch `qe-batch2/`.
## Publish
Sealed notes (task `qe-EPIC-010-m1-batch-2`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, QE/E2E. Verdict: NOT LOSS (NEUTRAL)**: X = −58.3, Y = 77.9, X + Y = +19.6 ≥ 0. Base `ca6e675c` (main just before `ABC-230`, re-derived; = ledger `c0698ddd` in engine), head `51902be5` (main at spawn, with `ABC-247`). The command was `rpair … --elo 1910 --rounds 100 --concurrency 1`, 200 + 200 games, Skill Level 6 = 4 000 ms on both sides. The PREREG `5d9c6b3a` was committed before any game. Branch `grugops/qe-EPIC-010-m1-batch-2`. Nothing was edited under `src/`, `tools/` or `data/`, and the board was not touched. Not merged, nothing pushed.

- **Notes** (task `qe-EPIC-010-m1-batch-2`): PREREG `…316833e1`; VOID run 1 `…3fb3b1fd`; verdict `…1a53a7f9`; run `…428e3797`; findings `…f9a3c308`; artifacts `…8e61427e`.
- **Reading:**
  - base 151/38/11 = **78.25 % ± 5.48 points**, +222.4 ± 56.9 vs E 1 910;
  - head 141/53/6 = **72.00 % ± 6.11 points**, +164.1 ± 53.2;
  - pentanomial −58.3 ± 72.6 (information);
  - QE's own recomputation equals the tool's to the digit.
- **New 4 000 ms trend reference (for BA/PM to fold): 72.00 % ± 6.11 points (head `51902be5`, 200 R games). Flag at 52.00 %; the pool restarts here.**
- **Block-01 clock check: PASS.**
  - Base 943 and head 951 skytalix moves at 4.0 s, 0 at 3.0 s; the engine's `info time` lines agree (max 4 002 ms).
  - Over all 20 PGNs: 8 536 and 9 305 moves at 4.0 s, 0 at 3.0 s, and no other value.
- **Clean:** 0 faults, 0 time losses, 0 crashes or halts in the re-run, 400/400 games, every stderr 0 bytes.
- **Wall:** session 22.22 h (play 22.21 h, builds about 5 s, 0 pauses), 18.0 games/h. The hop took 23.17 h, counting VOID run 1 (48 min).
- **Stockfish nps per block-run:** base spread 11.6 %, head 9.6 %, all runs 12.1 % (1.58–1.79 M). The largest swing between consecutive runs was +7.6 %.
- **Thermal:** median 75.1 °C, max 89.5 °C (one sample). The highest 5-min median was 83.3 °C, so there was no pause and no stop.
- **Contamination:** 102 of 1 332 ticks (7.7 %), all foreign `vitest` from another repository on the host, logged and not killed. More than 25 % in base b01, base b04 and candidate b05.
- **Findings** (none blocking):
  - QE-M1B2-a INFO: a watcher filter false positive, fixed.
  - QE-M1B2-b MEDIUM: the SIGSTOP pause killed run 1 under the agent's task runner. Re-run detached; later PREREGs must launch detached.
  - QE-M1B2-c MEDIUM: the "ALONE" host was shared with another repository's vitest. Route: the Orchestrator and the owner.
  - QE-M1B2-d INFO: the negative point estimate. Tens of Elo stay invisible at this size.
- Scratch removed; no process left running.

### Trace row (10 cells, header order)

| EPIC-010 m1 batch | milestone 1 batch, layer 3: interleaved R pair, base ca6e675c vs head 51902be5, 200 + 200 games at 4 000 ms both sides (Skill Level 6), E 1910, width 1 | EPIC-010 | ADR-0053 d10; EPIC-008 merge rule; ABC-225, ABC-247 | none (no vitest; ALONE, contamination logged) | tools/rating/rating.ts rpair @ 51902be5 (no change) | QE: NOT LOSS (NEUTRAL) X −58.3 ± 77.9; base 78.25 %, head 72.00 % ± 6.11; block-01 clocks 4.0 s both, 0 at 3.0 s; 0 faults / time losses | no UAT (measurement) | — | NOT LOSS; head 72.00 % = new 4 000 ms trend reference (BA/PM to fold) |
