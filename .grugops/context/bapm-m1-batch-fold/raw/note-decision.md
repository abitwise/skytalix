# BA/PM fold of EPIC-010 milestone 1's batch: milestone 1 DONE and MET (NOT LOSS (NEUTRAL), X −58.3, Y 77.9); the 4 000 ms trend reference is 72.00 % ± 6.11 points, flag 52.00 %, pool restarted empty; QE-M1B2-b becomes a rule for every later batch PREREG (EPIC-010 page, no ADR edit). No owner word owed

Records only, at `main` `832ff246`; nothing run, built or timed (`se-ABC-246` runs beside). Records commit `f0b57fc0`.
Source: `qe-EPIC-010-m1-batch-2` PREREG `…316833e1`, VOID `…3fb3b1fd`, verdict `…1a53a7f9`, run `…428e3797`, findings
`…f9a3c308`; the done brief's § Result; merge `5325a0f0`.

## 1. Milestone 1: DONE and MET, by its own rule
- The rule (EPIC-010 § The batch: when and what): at the milestone's close the interleaved R pair runs, and **not LOSS
  (X + Y ≥ 0) passes**.
- Read: X = −58.3, Y = 77.9, X + Y = +19.6 ≥ 0, state NEUTRAL. Base `ca6e675c` 151/38/11 = 78.25 % ± 5.48; head
  `51902be5` 141/53/6 = 72.00 % ± 6.11; 200 + 200 at 4 000 ms both sides (Skill Level 6), E 1 910, width 1; 0 faults,
  0 time losses; block-01 guard PASS on both builds.
- Every order row is Done: `ABC-226`, `ABC-227`, `ABC-225`, `ABC-228`, `ABC-229`, `ABC-230`, `ABC-235`, `ABC-240`,
  `ABC-241` (the board's Done column).
- Success measures at milestone 1: M1 MET for milestone 1's part (4 / 4 value-changing merges met S-1..S-4 in the smoke
  ledger; 2 / 2 value-identical met S2, `qe-ABC-235` `…c575d703`, `qe-ABC-240` `…19068f9d`). M2 not read (it is the
  epic-close batch; this reading stands as M2 only if the epic stops here). M3 and M4 are read on `main` at the epic's
  close. M5 MET so far.
- QE-M1B2-d (INFO) sits on the milestone line: the point estimate is −58.3 Elo (6.25 points), and a fall of tens of
  Elo stays invisible at 200 + 200 (`RISK-EPIC010-01`). Because the new reference is read on this head, such a fall,
  if real, sits inside the reference. A 400 + 400 batch or longer games run only on the owner's word. Information,
  not a question.

## 2. The 4 000 ms trend reference
- **72.00 % ± 6.11 points** (head `51902be5`, 200 R games). **Flag: ≥ 30 pooled R games at ≤ 52.00 %.** The pool
  restarts here, empty (0 games; flag not evaluable).
- The waiting rows `ABC-228` 7.0, `ABC-241` 6.5 and `ABC-229` 9.0 (22.5 / 30) were played on builds inside this head,
  not merged since the batch, so under "the pooled R smoke score of every value-changing merge since the last batch"
  they close unpooled, INFO only, never judged.
- Comparable with later R smokes: `r` (level 5) and `rpair` (level 6) both search `go movetime 4000` for 4 000 ms at
  rate 0 at any SHA from `e42b637b` (QE `…1a53a7f9`); every R smoke since `ABC-230` ran at width 1, as the batch did.
  A rollback of `LEVELS[5]` to 3 000 ms (`ADR-0053` d10 § Rollback) stales it.
- The old 3 000 ms reference (64.75 %, flag 44.75 %) is retired with dated lines where it is written (§ What 10
  games can and cannot see, layer 2's flag cell, the ledger's reference line); no text was rewritten. The odds worked
  at 64.75 % are marked as not re-derived at 72.00 %.

## 3. QE-M1B2-b (MEDIUM): where the rule lives
- Placed on EPIC-010 § The batch: what, beside `ABC-247` Test note 3's guard, which is where a batch PREREG already
  reads its checks. Text: a PREREG whose thermal pause works by a signal launches the harness and its watcher detached
  from any agent job-control parent (`setsid -f`), records the harness's parent pid before game 1 (not an agent task
  runner's process), and records a SIGSTOP / SIGCONT test on a detached process before game 1.
- **No ADR edit is needed.** `ADR-0053` d10 says what the batch measures (both sides at 4 000 ms); the launch is QE
  method. Nothing is asked of the Architect for this finding.

## 4. QE-M1B2-c (MEDIUM): recorded, no ticket
- Recorded on the milestone line: 7.7 % of ticks with another repository's `vitest`, three block-runs above 25 %,
  score effect `UNKNOWN - verify`, both sides hit. The Orchestrator routed it to the owner. No delivery need inside this
  repository: the host is shared outside it, and the PREREG's wait-clear, contamination log and thermal pause guard a
  batch.

## 5. Tickets table
- Rows 7 `ABC-235` (Done `baf99a7c`), 8 `ABC-240` (Done `5311f5bd`), 19 `ABC-243` (Done `3628fe99`, `qe-ABC-243`
  `…2d790e40`), 20 `ABC-244` (Done `24b22339`, `qe-ABC-244` `…4fe9bfe1`, `secnfr-ABC-244` `…9087cb39`), 21 `ABC-245`
  (Done `2cce84e0`, `qe-ABC-245` `…b2ebc183`), 22 `ABC-247` (Done `3af97f71`, `qe-ABC-247` `…236bbe39`) and 23 `ABC-248`
  (Ready, `eca4812f`) now read as the board does. Rows 1–6, 9–18 agree with the board.
- `ABC-247`'s page is closed (Done), its five INFO findings dispositioned by the batch. `ABC-225`'s page gains a dated
  "used" line with the read wall (22.22 h, 18.0 games/h).
