---
subtask: qe-ABC-225
role: qe-e2e
ticket: ABC-225
ref: .grugops/context/qe-ABC-225/
branch: grugops/ABC-225 @ 9988a778 (worktree ../wt-ABC-225 exists; add QE commits there or on a qe branch from it)
held: released 2026-10-30 by the Orchestrator (se-ABC-235, arch-ABC-228-adr and qe-ABC-235 done; ABC-235 merged baf99a7c; host idle)
width: ALONE (~1 h + QE)
---

# QE ABC-225: verify A1–A4 independently, then run A5 (a 40-game real smoke) ALONE and report A6

## Read
- The ticket; SE notes `se-ABC-225/…e58c4d25`, `…868049fb`, `…14fdbedc`; Orchestrator review `…561f1ef1`;
  EPIC-010 § The merge rule; the Architect's R/D method (`arch-epic008-rd/…0c5d62f4`).

## Do
- Re-run `pair-check` and the gates yourself. Spot-check A1's argv equality and A3's arithmetic against the r1/r2 records.
- PREREG first (sealed before game 1): the shas (base = `02fa9556`, the main before ABC-235; candidate = `baf99a7c`, main
  with ABC-235: same moves, ~1.2× nps, so expect NEUTRAL to slightly positive; 40 games decide nothing about Elo,
  and A5 is about the tool working; report the figure as INFO), the
  `--rounds 10`, the width, and what passes A5/A6.
- **A5:** `rpair <base> <cand> <out> --rounds 10`, ALONE, with tool paths from the env file named in your spawn prompt.
  Check the four unverified points the SE named: cutechess honours `start=`; every `nps.log` line has a value;
  `thermal.log` reads Tctl; a real block's Elo line equals the pooling formula. Host-path scan clean (excluding `clone-*`).
- **A6:** wall time; projection for the 400-game pair (target ≤ 10 h).
- Rule on `artifacts.txt`'s engine `id author` line.

## Fences
- Work in the ABC-225 worktree or a QE branch from it, plus your scratchpad. No `src/` or `data/` edits. `tools/` edits
  only if you find a defect: then STOP and report, don't fix it yourself. Never push, force, amend or rebase. Never
  merge into main. No board edits. No host paths in records. Linters only via `npm run …`.

## Publish
- Seal notes (task `qe-ABC-225`) with `at` from `date -u`: PREREG, the reading, the verdict (PASS / PASS_WITH_GAPS / FAIL).
  Commit on the branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**FAIL: acceptance not evidenced. A1–A4 MET, no tool defect found. A5 and A6 NOT READ: THERMAL STOP.**
`grugops/qe-ABC-225` @ `3da78303`, from `grugops/ABC-225` `9988a778`. Not merged, nothing pushed, no `src`, `data` or `tools` edit.

- **Notes:** PREREG `20261030T002019Z-qe-e2e-decision-1c31ccc4`, sealed and committed (`e4a6e98c`) before game 1.
  A1–A4 and gates `…-observation-dd39468d`. A5 runs `…-observation-f5b1a86e`. Verdict `…-decision-3a53bdfc`.
  `readContext` reads back 4.
- **Gates:** `pair-check` 22/22. lint, typecheck and build exit 0. `npm test` 63 files, 2 128/2 128, skips 0, `No findings.`
- **A1–A3, by QE's own scripts:** argv differs from `r` in 4 positions; ABBA order; 1–100 once per build.
  Pair −82.9 ± 73.8; pentanomial −82.9 ± 64.28. The cutechess formula copy reproduces r1 and r2.
- **A5, run 1** (00:20:51Z): VOID. A foreign vitest from another project was on the host (`node-MainThread`, which
  `pgrep -x node` misses), and Tctl reached 90.9 °C. QE stopped it at 00:23:07Z before any game finished, then
  waited until the host was clear and cool.
- **A5, run 2** (00:29:31Z): ALONE at start, Tctl 83–84 °C within 50 s. The foreign vitest returned at 00:30:31Z.
  **THERMAL STOP at 00:34:31Z: median 87.05 °C over 30 samples**, max 88.8 °C. 4 of 40 games were played (base, 4–0).
  - Verified: Tctl reads every 10 s.
  - Partial: the tool's nps parser gives 1.44 M on the real log.
  - Unread: `start=S` for S > 1, `nps.log`, and the real formula check.
- **A6:** unmeasured. The 40-game Elo (INFO): none.
- **`id author`:** ACCEPTABLE. It is the public UCI author string from `src/uci-session.ts`, the same name as `NOTICE`,
  and already in 40 committed records. It is not a login or host identifier.
- **Gaps:**
  - QE-225-a (BLOCKING): A5 and A6 are unread.
  - QE-225-b (HIGH, owner): R at width 2 runs above the 85 °C line on this host. This puts the 400-game batch and M2 at risk.
  - QE-225-c (MEDIUM): another project's vitest ran twice on this host during the games.
  - QE-225-d (LOW): the pentanomial's variance convention is unstated.
  - QE-225-e (LOW, INFO): Stockfish nps was −12 % on the hot host.
- **STOP:** thermal, per the spawn prompt. No further game was played.

### Trace row (10 cells, header order)

| ABC-225 (qe-ABC-225) | QE FAIL at 9988a778: A1–A4 MET (QE's own dry-run compare, ABBA, −82.9 ± 73.8 / −82.9 ± 64.28); A5 NOT READ (run 1 void, foreign vitest; run 2 THERMAL STOP, Tctl median 87.05 °C / 30 samples, 4 of 40 games); A6 unmeasured; id author ACCEPTABLE | EPIC-010 | interleaved R pair (`rpair`) | NFR-008 0 lane files; ADR-0049 d4 records clean; heat: Tctl median 87.05 °C > 85 °C stop line (QE-225-b) | grugops/qe-ABC-225 @ 3da78303 (on grugops/ABC-225 9988a778; code 83751dc0) | pair-check 22/22; npm test 63 files 2 128/2 128, skips 0; .grugops/context/qe-ABC-225/notes/ | not signed (QE FAIL: A5/A6 unread) | — | In Review (stays; not mergeable until A5/A6 read) |
