---
subtask: qe-EPIC-010-m1-batch
role: qe-e2e
ticket: EPIC-010 milestone 1 batch (§ "Did things get worse?", layer 3)
ref: .grugops/context/qe-EPIC-010-m1-batch/
branch: new grugops/qe-EPIC-010-m1-batch from main at spawn (worktree .claude/worktrees/qe-EPIC-010-m1-batch)
width: STRICTLY ALONE for the whole run (≈ 18.5 h). Only records-only hops (no vitest, no engine) may run beside you.
owner: "18.5h pair run you can schedule now" (orch-2026-10-30a …c2752305, 2026-10-31)
---
# QE: EPIC-010 milestone-1 batch: 400-game interleaved R pair (200 + 200), width 1
## Read
- EPIC-010: § "Did things get worse?" (the batch: when / what / after / LOSS); § The smoke ledger; the ESTIMATE RESTATED and 2026-10-31 FOLDED blocks (width 1, ≈ 18.5 h, range 17.5–19.4 h).
- ABC-225's page and qe-ABC-225-w1's notes: the `rpair` command, its resume and halt behaviour, QE-225w1-a (the `budget` field is unread), and QE-225w1-d (report nps spread per block).
- ADR-0053 d10 (4 000 ms both sides); EPIC-008's merge rule (X + Y ≥ 0 is not LOSS); AGENTS.md's A11 lane and wait rules.
## Do
1. **PREREG first, before any game.** Commit:
   - Base SHA: main just before the epic's first value-changing merge, resolved from EPIC-010 and the ledger. Show the derivation. If it is ambiguous, STOP and hand back before any game.
   - Head SHA: main at spawn.
   - The exact `rpair` command line (R pins, E = 1 910, 4 000 ms both sides, 400 games, `--concurrency 1`).
   - The verdict rule, the thermal stop, and what you do on a crash or halt (resume per ABC-225).
2. Build both trees in scratch, keeping them small (hard-link node_modules). Run the pair-check first.
3. Run the batch in the background, writing to an output file. Wait by polling that file or `kill -0 <pid>`.
   - Check every ~30 min: progress, Tctl, and that no other vitest or engine is running. Log contamination; do not kill other people's processes.
4. Thermal stop: Tctl median > 85 °C → pause per the tool's halt and resume.
5. Report:
   - X, Y and the score with its half-width; the verdict (LOSS or not LOSS);
   - wall time; nps spread per block; time losses; crashes.
   - On not LOSS, head's R score becomes the trend reference (EPIC-010 § After a passing batch). Record the figure; BA/PM folds it.
   - On LOSS, list the suspects from the ledger, for information only. The options go to the owner via BA/PM.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: never `while pgrep -f …`; never put vitest or the batch on the same command line as a wait.
- Leave no process running at hand-back.
- Scratch `qe-batch/`.
## Publish
Sealed notes (task `qe-EPIC-010-m1-batch`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-10-31, QE/E2E. NO VERDICT. STOPPED before game 1 (0 games played). Branch `grugops/qe-EPIC-010-m1-batch` (worktree `.claude/worktrees/qe-EPIC-010-m1-batch`, from `72a65fb7`): PREREG `50edc3f1` (sealed before any game), records in the commit after it. Records only; `src/`, `tools/`, `data/` and the board are untouched; nothing merged or pushed.**

- **PREREG** (decision `…93c1fb08`): base `ca6e675c` = `24f3e322^1`, main just before `ABC-230`, the epic's first value-changing merge. It is engine-identical to the ledger's `c0698ddd`; `ABC-235`/`ABC-240` before it are value-identical. Head `72a65fb7` = main at spawn (main's later tip `3dc2f2f0` has the same `src/`, `tools/` and `data/`). The exact `rpair … --elo 1910 --rounds 100 --concurrency 1`; verdict LOSS iff X + Y < 0; thermal pause at the block boundary (median > 85 °C) and hard stop (> 90 °C); a halt is re-run once (≤ 2 h). `pair-check` 22/22; dry run 20 argvs.
- **STOP, QE-M1B-a (HIGH)** (observation `…5967dfc1`, decision `…21029f54`): the base's UCI caps `go movetime 4000` at its `LEVELS[5]` = 3 000 ms (`uci-session.ts` D4.2: `min(request, level)`). As pinned, the batch would be **base 3 000 ms against head 4 000 ms**, not the "4 000 ms both sides" that `ADR-0053` d10, EPIC-010 and this brief require. The confound favours the head. Probe: base 3 001 ms and head 4 001 ms by default; both 4 001 ms after `Skill Level 6`. The same cap already shaped `qe-ABC-225-w1` A5: 0 of 1 905 skytalix searches went over 3 100 ms.
- **Routes (the Orchestrator's call):** (A, recommended) a `tools/`-only `rpair` fix, `option.Skill Level=6`, then the batch at about 21.7–24.1 h; (B) an Architect amendment to run each build at its own level 5, about 20.1–21.3 h; (C) hand-driven cutechess, not recommended.
- **Gaps:** QE-M1B-a HIGH (above); QE-M1B-b MEDIUM: 18.5 h is a 3 000 ms rate, and 4 000 ms both sides costs about 21.7–24.1 h; QE-M1B-c LOW: thin `/tmp` margin (3.5 GB free, about 11 GB of earlier QE trees).
- X, Y, score, wall, nps, time losses, crashes, contamination and thermal: not applicable (no batch). The trend reference is still unset.
- STOP: QE-M1B-a, before any game.

### Trace row (10 cells, header order)

| EPIC-010 (milestone 1 batch) | The milestone-1 batch: a 400-game interleaved R pair, head against the epic's first merge-base, both sides at 4 000 ms | EPIC-010 | — | ADR-0053 d10 (both sides at 4 000 ms): NOT MET by the pinned rpair for any pre-ABC-228 base (QE-M1B-a) | tools/rating/rating.ts (unchanged; rpair st=4, no Skill Level option); base ca6e675c src/uci-session.ts D4.2 cap, src/levels.ts LEVELS[5] 3 000 | pair-check 22/22; rpair dry run; 4 UCI probes (base 3 001 / head 4 001 ms; both 4 001 at Skill Level 6); 0 games; QE records grugops/qe-EPIC-010-m1-batch @ 50edc3f1 + records commit | — (no verdict) | — | STOPPED before game 1: route to the Orchestrator (QE-M1B-a) |
