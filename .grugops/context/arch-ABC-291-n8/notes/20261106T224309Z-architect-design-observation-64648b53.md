---
id: 20261106T224309Z-architect-design-observation-64648b53
kind: observation
by: architect-design
at: 2026-11-06T22:43:09Z
verified_by: 
confidence: high for every figure read from a8.tsv, source and the notes; the wall split and the row ms are estimates on records, not reads of the candidate; nothing was run
refs:
  - arch-ABC-291-n8
  - ABC-291
  - ABC-290
  - ABC-292
  - ABC-293
  - ABC-307
  - ABC-305
  - ABC-303
  - EPIC-011
  - ADR-0075
  - ADR-0046
  - ADR-0035
  - NFR-008
  - R-N8H-1
  - R-N8H-3
  - K0
  - K1
  - K2
  - K3
  - K4
  - K5
  - K7
  - H3
  - G-WITH
  - G-GO
  - 70d931ab
  - 780d9021
  - 35a694ee
  - fcc59889
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - qe-ABC-291/20261106T222838Z-qe-e2e-decision-5826dcf6
  - qe-ABC-291/20261106T221245Z-qe-e2e-decision-51558b04
  - qe-ABC-291/20261106T210624Z-qe-e2e-decision-a49d69d7
  - orch-2026-10-30a/20261106T223014Z-orchestrator-decision-a9e7118e
  - orch-2026-10-30a/20261106T220610Z-orchestrator-decision-ceb1125e
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - secnfr-ABC-307-a10/20261105T215450Z-security-nfr-observation-f627093d
  - se-ABC-305/20261105T124015Z-software-engineer-observation-2adad06f
  - se-ABC-305/20261106T131126Z-software-engineer-observation-9c9e2a35
  - qe-ABC-303/20261106T180618Z-qe-e2e-observation-9e2facfa
  - arch-ABC-307-reads/20261105T134134Z-architect-design-observation-f8c13d49
supersedes: 
seal: sha256:26580f09ef76d242496620e8da8eec3e28f207de47443593163b0cfaa099bb63
---

# arch-ABC-291-n8 readings: H − B is a real cost of about +0.16 s with a read noise of 0.06 s. Rows explain a third of it. Nine candidates save about 225 ms, and a row moved on `main` first would sit in both arms

Architect/Design, task `arch-ABC-291-n8`. **Nothing was run:** no test, build, engine, vitest or lint. Reads of notes, `git`, source at `70d931ab`, and one script over `a8.tsv` files (`raw/n8-noise.py`, output `raw/n8-noise.txt`).

## The limit of these readings
- QE's raw for this read holds `a8.tsv`, `grade.txt`, `where.txt`, `flags.txt` and `foreign.tsv`. The per-run JSON and console files are not in it. They sit in `<scratch>/qe291`, outside this hop's read access, and I did not open them.
- So nothing here reads vitest's import phase, the file timeline or any per-row figure on H or H2 beyond `where.txt`.
- Row ms are `se-ABC-305`'s census at `35a694ee` (`raw/out/n8-r2/census-H.txt`, 5 658 ms in-thread), the latest on record. It is the tree after `ABC-307`, and before `ABC-303` and this ticket. No row ms on the candidate is on record.

## The read, beyond what `…024bbd63` printed
| figure | H − B | H2 − B | the two arms less B, per round |
|---|---:|---:|---:|
| wall median | +0.155 | +0.180 | +0.165 |
| wall mean | +0.175 | +0.090 | +0.133 |
| wall positive | 7 of 8 | 6 of 8 | |
| CPU median | +0.760 | +0.405 | +0.625 |
| CPU positive | 8 of 8 | 7 of 8 | |

- **Order does not explain it.** Mean wall by position in the round: 9.203, 9.181, 9.181 s.
- **The noise of the instrument.** Across ten clean reads, the twin's paired median wall has an RMS of **0.060 s** (largest −0.105, this read's). Two arms of the same code differ by that much on a median of 8. It is the fair yardstick for one H − B read.
- **So +0.155 s stands 0.9 of that yardstick over the bar, and 2.6 over zero.** Read as a normal, a re-read of this unchanged lane lands at or under +0.10 s about 11 to 18 % of the time. That is the fishing `…a9e7118e` declined, in a number.

## Where the wall goes
| part | in-thread ms | wall at the two-worker return of 0.5 | state |
|---|---:|---:|---|
| added rows | 34 (H), 35 (H2) | about +0.017 s | read |
| shared rows | +98 (H), +53 (H2) | +0.03 to +0.05 s | read, and the arms disagree by 45 ms |
| everything else | not read | **+0.09 to +0.13 s** | `UNKNOWN - verify` |

- **The brief's "+100 ms" and "+83 ms" are H's alone.** H2 is the same code at +53 ms in all. `where.txt` prints the per-file split for H only, so `src/uci-session.test.ts`'s +83 ms has no twin beside it. Its size is `UNKNOWN - verify`.
- **The tree.** `nsnode` at depth 8 reads 800 934 → 822 560 nodes over six roots, +2.70 %, and H / B per node 1.0021 and 1.0089. So a fixed-depth search costs about 3 % more. Over 5 487 ms that would be +165 ms if every ms were fixed-depth search. The read is +53 to +98 ms, so the tree is enough for all of the shared-row change. It is not shown to be the cause. Rows on a virtual clock stop at a set number of clock reads, so more nodes per depth does not lengthen them, and `uci-session` is mostly such rows.
- **The build.** CPU rises by 0.4 to 0.76 s, and rows hold about 0.13 s of that. The rest is outside row bodies. By the census, per-file start-up is 43 % of worker time, and `src/cli.test.ts`'s children sit outside the workers' rows. `src/evaluate.ts`, `src/search.ts` and `src/engine.ts` grew, and every isolated file loads them. Larger cold functions in 70 short-lived workers, and V8's compile threads, fit a CPU rise larger than its wall rise. **Each of those is a candidate and none is read.**
- **What would read it:** vitest's phase line in each `out-*.txt`, and `startTime` / `endTime` in each `json-*.json`, under `<scratch>/qe291/out/a1/n8/runs`, by `census.cjs` and the timeline script. No lock and no run.

## History of the figure
Paired H − B wall and CPU, clean reads.

| read | what changed | wall | CPU |
|---|---|---:|---:|
| `ABC-283` | search bundle, before the budget existed | +0.140 | +0.84 |
| `ABC-282` | W1 | +0.020 | +0.02 |
| `ABC-303` | bundle 1 | −0.010 | +0.32 |
| `ABC-305` | tools and two test files | −0.110 | −0.03 |
| `ABC-291` | E4b | +0.155 | +0.76 |

Two of the four reads with production lines came in over +0.10 s. The lane's own level has moved 9.085 → 9.13 → 9.30 s since `ABC-307`.

## What a row move does to H − B
- **The bar is paired, H against the merge-base.** `…a49d69d7` § 2 fixes B as `780d9021`, the merge-base.
- **A row move merged to `main` first is in both arms.** `ABC-307` read −0.350 s for itself. `ABC-303` and `ABC-305`, on top of it, read −0.010 s and −0.110 s with B after the move, and neither was credited a ms of it. `ABC-307`'s effect reached the lane's level, which is the line `…b9038a14`'s G-WITH guards. H − B is a different line.
- **§ 5's "a row move first" is `…f30bd604` 2's and `…ad217a34` 4's.** Both are written for a lane at or above 9.6 s. H is 9.30 s. So the rule's trigger has not fired by its own words, and the route is a reading.
- **Where the +0.10 s lives.** `…f30bd604` 1 names `ABC-282`, `ABC-301` and bundle 1. `…b9038a14`'s G-GO gives "the next lane-adding merge" its ≤ +0.10 s. `…a49d69d7` § 5 made it a MET leg. `ABC-291`'s page and `ADR-0075` say ≤ 10 s, and that the census gates the merge. `ABC-290`, `ABC-292` and `ABC-293` say ≤ 10 s, units only.

## Rows: what is left
The census's exclusions stand, read at `70d931ab`. Rows of 50 ms or more were spent or excluded (`…19cea480`), and `ABC-307`'s page calls that the last of the supply. Rows under 50 ms were never read. `…b9038a14` reads them on a shortfall, which this is.

**Read and left in:**
- `zugzwang.001`, every door-switch row of `src/search.null-move.test.ts` and `ABC-283`'s bundle rows: recorded bars. That includes "the doors" rows at 53, 50, 29, 29, 26 and 22 ms.
- `src/search.futility.test.ts` "depth 1 has no null-window node", 33 ms: it sits in the doors' describe. I read it with them and do not count it.
- `QE-208-b`'s two rows, 40 and 34 ms: the comment fixes depth 6 as the least that reads the row, and `ABC-248` has already re-rooted them.
- `levels` A4 44, `search.test` A1 32 and A4 73, `legal` `ABC-206` A2 78: default slices of deep rows.
- `quiescence` A1 30: the 19 of 20 bar. `transposition` A5 25: one fixture, a pinned 7 295 nodes. `turn-loop.nfr` 23: `NFR-002`.
- `cli` `ABC-173` C2 51: a rule over every test file, so no sample holds it, and the file has no deep lane.
- `ABC-220` A6 34: a named holder of P2b (`ADR-0046`). `uci-session`'s fine-step rows: a sealed exclusion, about 1.0 s in all. Opening them is not a row move.
- `L1`'s and `B1`'s remnants, 43 and 33 ms: `ABC-307`'s.

**A caution on every figure below.** The first search in a file pays for cold code and an empty memo. A moved row can hand that cost to the next reader, as `allNotes()` did for the trio. That is unread for all nine.

## Small files
- `R-N8H-3`'s figure is about 0.05 s of wall per file, from 107 ms of worker time at a return of 0.49.
- `src/san.suffix.hardening.test.ts` (168 lines) and `src/san.qualifier.hardening.test.ts`, and `src/moves.enpassant.hardening.test.ts` (215 lines) and `src/moves.castling.hardening.test.ts`, hold no `vi.mock` or `vi.spyOn`, and none is a `*.nfr.test.ts`.
- `vitest.config.ts`'s isolation note names the spy files as the ones isolation protects. These are not among them.
- No record has read a fold. `…19cea480` proposed nothing on it, and `ABC-307` left it out of scope as unread.

## The grader
- `n8-grade.py`'s `state` reads the twin, H's median and wall R. It never reads the budget, which it prints on a line of its own.
- Its first branch reads `hw > 10`. § 5's NOT MET also reads H's x(k) > 10 s, and no line of the script does.
- It does not read `flags.py`'s result, so a void read prints MET (`…2adad06f`, `…f627093d`).
- `paired <= 0.10` compares unrounded floats. Of the 60 pairs from 9.00 to 9.59 s that differ by exactly 0.10, 11 read above it, as 9.05 − 8.95 does.

## What K4 and K5 load
`g2.ts` imports `src/evaluate.ts`, `fen.ts`, `apply.ts` and `san.ts` from each arm. `timed.mjs` imports `fen.ts`, `san.ts`, `engine.ts` and `levels.ts`. No test file is in either. `…9e2facfa`'s identity was `git ls-tree` over nine whole paths, `src` among them. A row move changes `src`'s tree, so that key cannot be reused as it stands. `…a49d69d7` § 7 re-reads K0 to K3 and K7 on the merged tree in any case.
