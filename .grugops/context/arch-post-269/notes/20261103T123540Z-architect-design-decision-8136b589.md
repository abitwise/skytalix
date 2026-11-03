---
id: 20261103T123540Z-architect-design-decision-8136b589
kind: decision
by: architect-design
at: 2026-11-03T12:35:40Z
verified_by: 
confidence: high that today's r cannot run a 100 ms control (read from rating.ts, not run) and that R1-R3 survive under D6 item 7; medium on host time 0.4-0.9 h (estimate from qe-ABC-269 B8 timings, UNKNOWN - verify until QE's PREREG) and on E 1810 landing inside the band (estimate)
refs:
  - arch-post-269
  - grugops/arch-post-269
  - ABC-269
  - ABC-273
  - ABC-274
  - ABC-255
  - ABC-204
  - EPIC-011
  - E1
  - R1
  - R2
  - R3
  - G2
  - S-prime
  - C4
  - C1
  - C3-prime
  - ADR-0064
  - ADR-0067
  - ADR-0056
  - ADR-0031
  - ADR-0061
  - NFR-001
  - NFR-005
  - QE-269-f
  - QE-269-g
  - QE-269-h
  - QE-269-i
  - QE-269-j
  - QE-269-k
  - F3
  - F8
  - A5
  - B5
  - B6
  - B7
  - B8
  - 54dee3f2
  - be87a2f1
  - 01a67c5d
  - 128e3c6c
  - 58fa3eb4
  - tools/rating/rating.ts
  - qe-ABC-269/20261103T122410Z-qe-e2e-decision-eff2fe64
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-9ba289c2
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-2c51ee30
  - qe-ABC-269/20261103T114143Z-qe-e2e-observation-cebf49fe
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-48b34063
  - qe-ABC-269/20261103T122410Z-qe-e2e-observation-3fb121de
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-e36ee7ca
  - arch-ABC-233/20261102T212011Z-architect-design-decision-f3a4dac0
  - orch-2026-10-30a/20261102T210500Z-orchestrator-decision-8ce2fd23
supersedes: 
seal: sha256:ffb3ffdefb3c834b056d8e6557cd7dccaede4c14093f9e16f2ad064ba804c3ed
---

# arch-post-269: R1–R3 control ruling for `ABC-273` DoR row 10. **R1–R3 survive** as `EPIC-011` G2's milestone readings, on C4's 100 ms reading against Stockfish: 200 games, both sides at `st=0.1`, E by the band rule. **Today's tool cannot run R1.** `r` refuses `--budget-ms 100`, and Stockfish's `st=0.5` is fixed in code. So one `tools/`-only change (S, BA/PM cuts it) comes first. After it, the command is `CUTECHESS_CLI=… STOCKFISH=… node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`. Host time is about 0.4–0.9 h (estimate), so **R1 is not asked of the owner**, unless QE's PREREG estimate passes 1 h or the band rule steps E

Architect/Design, task `arch-post-269`, records only, at `main` `128e3c6c`. Nothing was run: the tool was read, not launched, and no `--dry-run` was taken. Written into `ADR-0056` as D6's dated line of 2026-11-03, with a pointer in D5's "C4 and C1 re-pointed" and the status block "Folded 2026-11-03 (`arch-post-269`)". Inputs: `ABC-273`'s page; `EPIC-011` § The owner's answers ("Still open … R1–R3"), § Phases R1 / R2 / R3, and G2; `ADR-0056` D5 (C3′, C3″, S′, "C4 and C1 re-pointed") and D6 item 7 with its dated lines; `tools/rating/rating.ts` at `128e3c6c` (lines 107–119, 407–445, 815–830); `qe-ABC-269` B8 `…2c51ee30` and gaps `…9ba289c2` (`QE-269-j`).

## 1. Do R1–R3 survive? Yes, re-pointed to 100 ms
1. The owner-answers fold restated item 7 but did not withdraw R. D6's dated lines still place R1 after E1.
2. Nothing else gives G2 an outside number between the owner-asked 40/15 anchors. C2′ and C3″ are self-play, and S′ sees collapses only.
3. C1 is spent on "a 100 ms reading of that kind on the latest head, plus the measured offset". The R readings are that reading, so they tell when A1 or C1 is worth asking for.
- **Shape:** one build, 200 games (openings 1–100, both colours), one game at a time. skytalix: `st=0.1`, `timemargin` 50, level 5, `restart=on`. Stockfish 19: `UCI_LimitStrength`, `UCI_Elo` E, `st=0.1`, `timemargin` 2 000, `Threads 1`, `Hash 16`. `ABC-204`'s depth guard applies. E by the band rule (25–75 %). Above E 2 600, C3′'s probe runs first.
- **When:** R1 now (after E1, before the next strength merge), R2 at Phase 4's close, R3 after Phase 5. An R reading and an anchor's 100 ms half on the same SHA are one reading.
- **The milestone:** D5's claim rule needs E = M ≥ 2 200 scoring ≥ 50 %. A band-rule E below 2 200 names "none" and reports X ± Y.

## 2. The command: a harness gap, then one line
- **Today** (read, not run): `r` with `--budget-ms 100` throws "`--budget-ms 100: r takes only 500`" (`rating.ts` ~826). `cutechessArgs` fixes Stockfish at `st=0.5`. `rpair` is 4 000 ms, and `d` is self-play. `ABC-273` § Out of scope sends a harness gap to a new ticket.
- **The change (`tools/` only, S; `ABC-255` item 2 narrowed to `r`; `rpair` untouched):**
  1. `r` accepts `--budget-ms 100`. skytalix then gets `st=0.1` / `timemargin=50`, from the existing `SHORT_MARGIN_MS`, and Stockfish gets `st=0.1` / `timemargin=2000` in place of `st=0.5`.
  2. At 100, `--elo` above 2 600 is refused.
  3. Every other argv, default, pin and `--dry-run` output stays byte-equal.
  4. Acceptance: one `--dry-run` row for R1's command, the existing rows unchanged, and 0 lines under `src/`.
- **R1's command after it merges** (QE, host ALONE, under the host lock; paths kept out of the records):
  `CUTECHESS_CLI=<cutechess-cli 1.5.1, sha256 dc776901…2154f40a> STOCKFISH=<Stockfish 19, sha256 c78c22a9…4593e352d2> node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1`
  - Both variables are required, and the tool has no default (`QE-269-j`). `--concurrency 1` must be written out because `r` defaults to 2.
  - **E 1 810 is the start; QE confirms it at PREREG.** S′'s pool X gives about 1 957 at 0.5 s. That is about 2.3 doublings above 100 ms, so at 50–100 Elo a doubling the engine sits near 1 730–1 840 at 100 ms, and expects about 40–55 % against E 1 810. Pick depth is 4, and `st=0.1` has headroom below 1 910 (C3′).

## 3. Host time and the owner
- **About 0.4–0.9 h (estimate).** Basis, from `qe-ABC-269` B8: C2′ at 100 ms played 100 games in 23 min 50 s, builds included, which is 14.3 s a game at about 71 moves a side. S′ games against Stockfish ran about 33 moves a side. At 0.1 s a move a side, a game is 6.6–14.2 s, so 200 games take 22–47 min, plus one build.
- **Not asked** (`ABC-273` R1-A3: asked only over 1 h).
  - If QE's PREREG estimate is over 1 h, the owner is asked before the start.
  - If the band rule steps E, the second 200 games are a new run. The two together pass 1 h, so that run is asked first.
- **Rejected:**
  - R1 at S′'s 0.5 s with today's tool (`r … --elo 1810 --budget-ms 500 --rounds 100 --concurrency 1`). It takes about 1.8 h at S′'s measured 32.2 s a game, so it would be asked, and it reads on a scale C1 and C4 do not use.
  - `rpair` at 4 s: hours, on the retired scale.
  - `d`: no outside number.
  - Dropping R1–R3: G2 would be left without a reading.
- No owner item is created. This is a measurement setting inside the accepted D5 / C4 control, and the tool change is delivery already designed in `ABC-255`'s re-scope.
