---
id: 20261030T003823Z-qe-e2e-observation-f5b1a86e
kind: observation
by: qe-e2e
at: 2026-10-30T00:38:23Z
verified_by: 
confidence: high on what was observed; A5 and A6 themselves are UNKNOWN - verify (not read)
refs:
  - ABC-225
  - EPIC-010
  - EPIC-008
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 9988a778
  - 83751dc0
  - 02fa9556
  - baf99a7c
  - se-ABC-225/20261029T210343Z-software-engineer-decision-e58c4d25
  - se-ABC-225/20261029T210343Z-software-engineer-observation-868049fb
  - se-ABC-225/20261029T210343Z-software-engineer-observation-14fdbedc
  - orch-2026-10-29g/20261029T210522Z-orchestrator-decision-561f1ef1
  - orch-2026-10-29g/20261030T001430Z-orchestrator-decision-3f5b9486
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - ADR-0049
  - NFR-008
  - qe-ABC-225/20261030T002019Z-qe-e2e-decision-1c31ccc4
supersedes: 
seal: sha256:0ad6838b41569ad5467dd1abac57840a7dc5eb88855a9c73265b847bf513b18c
---

# qe-ABC-225 A5: two starts, neither read. Run 1 was voided (a foreign vitest, Tctl to 90.9 °C); run 2 hit the THERMAL STOP (Tctl median 87.05 °C over 30 samples). 4 of 40 games were played. A6 is unmeasured.

QE/E2E, task `qe-ABC-225`. Command as pre-registered (`…1c31ccc4`):
`rating.ts rpair 02fa9556 baf99a7c <out> --rounds 10`, with E 1 910, width 2 and tool paths from the environment.
Raw logs are in `raw/a5-void/` and `raw/a5-run2/`. Only small logs were copied, never `r.out`, PGN or clones,
because the harness was killed before its redaction pass.

## Run 1 (00:20:51Z–00:23:07Z): VOID, stopped by QE because the host was not ALONE
- **Precheck** 00:20:51Z: 0 `cutechess-cli`, load1 1.19, and `pgrep -x node` gave 0.
- **What the precheck missed.** The harness's own `before` line read `foreign_vitest_procs=2`. That was a vitest run
  from **another project on this host** (not this factory), started 00:05:18Z under `timeout 1700`.
  - Its comm is `node-MainThread`, so `pgrep -x node` does not see it.
  - It was near idle at the check (0.6 % CPU). From about 00:22:40Z it ran a worker at 111 % CPU.
- **Thermal:** Tctl rose 69.8 → 85.3 °C in the first 10 s and reached **90.9 °C** at 00:22:16Z and 00:22:36Z.
  The median was 86.9 °C over 14 samples, and load1 rose 1.4 → 3.1.
- QE sent SIGTERM to `cutechess-cli` and the harness at 00:23:07Z, before any game finished. No orphans were left
  (0 cutechess, 0 stockfish).
- QE waited until the host was clear: no foreign vitest, load1 < 2.0 and Tctl < 60 °C on 3 checks 20 s apart.
  That held at 00:29:14Z (load1 0.64, Tctl 38.2 °C). The wait log is `qe-wait-clear.log`.
- The build path was real: two clones, `npm ci` from cache and `npm run build`, about 5 s in all. Base's `dist/`
  tree is `a4cba481…e2a2`, which equals the EPIC-008 close tree, as expected because `src/` is unchanged since then.
  The candidate's tree is `e9722eec…7f72`.

## Run 2 (00:29:31Z–00:34:31Z): THERMAL STOP
- **Precheck** 00:29:31Z: load1 0.58, 0 `cutechess-cli`, 0 node, 0 vitest. The harness's `before` line read
  `foreign_vitest_procs=0`.
- **Tctl.** The first 6 samples (00:29:35–00:30:25Z, host still ALONE) read 61.4, 81.6, 83.6, 83.3, 83.3 and 84.0 °C,
  rising.
- **Foreign vitest again.** The same other project started vitest again at 00:30:31Z, about 1 min into the run.
  From then on, both QE's watcher and the harness's `host.log` read 2 such processes.
- **The stop.** After that, Tctl stayed between 86.0 and 88.8 °C. At 00:34:31Z the watcher had 30 samples with a
  **median of 87.05 °C**, above the 85 °C line, and stopped the run with SIGTERM.
  - Max 88.8 °C. Busy-core MHz went 5 147 → about 4 880 (median 4 890). load1 median 2.88, max 3.15.
- **Games:** 4 finished, all in base block 01 (skytalix won all 4 by mate). The candidate block never started.
- **This is the spawn prompt's stop: "STOP and report". QE plays no further game.**

## What the partial data can and cannot show (the SE's four unverified points)
| point | state |
|---|---|
| `thermal.log` reads Tctl | **verified.** k10temp is numeric on all 44 lines of both runs. The sampling is exactly every 10 s (run 2: 30 samples over 290 s, every gap 10 s) |
| every `nps.log` line has a value | **not read:** `nps.log` is written at block end, and no block ended. Partial evidence: the tool's own `stockfishNps` on the real `-debug all` log of run 2's base block gives median **1 442 528** over 162 moves of ≥ 400 ms (170 Stockfish `bestmove` lines, 4 962 `info … nps` lines). r1/r2 read 1.64 M, so this is about 12 % lower, which fits a hot, shared host (INFO) |
| cutechess honours `start=` | **not shown.** The 4 games are rounds 1–2 on EPD lines 1–2 (placement and side to move), one game per colour each. But block 1 has `start=1`, which is cutechess's default, so it proves nothing about `start=S` for S > 1 |
| a real block's Elo line equals the formula | **not read:** no block ended, so no `Elo difference` line was printed for a block |
| host-path scan of `<out>` | **not read** as A5 defines it: the harness never reached its redaction pass. The records QE copied are clean (see the verdict note) |

## A6: unmeasured
- No block finished, so there is no play wall to project.
- The only timings: run 2's build plus start took 4 s (00:29:31 → 00:29:35Z). The 4 games ended at 00:31:15, 00:32:05,
  00:33:05 and 00:33:50Z, with 2 games at a time. That is too few games for a rate.
- The ticket's own projection stands unverified: 400 games at the R rate of 44–46 games/h is about 8.7–9.1 h.

## Total wall of this hop's games
00:20:51–00:23:07Z, then 00:29:31–00:34:31Z. About 7.3 min of play, inside a 14 min window. Well under 2 h.
