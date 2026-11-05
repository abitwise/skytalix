---
id: 20261105T215450Z-security-nfr-observation-f627093d
kind: observation
by: security-nfr
at: 2026-11-05T21:54:50Z
verified_by: 
confidence: high: read from sealed notes and git on this branch; nothing run
refs:
  - secnfr-ABC-307-a10
  - ABC-307
  - EPIC-011
  - NFR-008
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - R-CEN-1
  - T-QEHOP-GROWTH
  - ADR-0035
  - ADR-0046
  - QE-282-k
  - qe-ABC-307/20261105T214701Z-qe-e2e-observation-78d1f873
  - qe-ABC-307/20261105T214717Z-qe-e2e-decision-bec57958
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-d356030c
  - qe-ABC-307/20261105T150324Z-qe-e2e-observation-19f6c80a
  - qe-ABC-307/20261105T152140Z-qe-e2e-observation-46d3b23c
  - qe-ABC-307/20261105T152735Z-qe-e2e-observation-43927eb6
  - qe-ABC-307/20261105T195441Z-qe-e2e-observation-4a8dd8dc
  - qe-ABC-307/20261105T200227Z-qe-e2e-observation-d5cd6d19
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T124120Z-orchestrator-decision-9e878ba6
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - orch-2026-10-30a/20261105T200316Z-orchestrator-decision-f5dc2987
  - se-ABC-305/20261105T124015Z-software-engineer-observation-2adad06f
  - 572edf13
  - 797bb1a5
  - e01d39b1
  - bce24018
  - 014b8fa2
supersedes: 
seal: sha256:f3913946d0385483048edb073e6d3a4d6b9d72b4c88543af548d000afb2beae0
---

# secnfr-ABC-307-a10 readings: A9 stands for `main`, the trio moved, the count never reached 5,500, and today lost five graded lane reads of seven

Security/NFR, task `secnfr-ABC-307-a10`, `ABC-307` A10. Records only: nothing was run, built or timed. Every line here was read from the notes and with `git` and `find` on this branch, from `main` `014b8fa2`.

## What A9 rests on
- **The read:** `qe-ABC-307` `…78d1f873`, verdict PASS `…bec57958`. H `797bb1a5` 9.085 s, interval 9.02 to 9.17 s, max 9.17 s. B `e01d39b1` 9.460 s. H − B −0.350 s wall (−0.500 to −0.220), −1.065 s CPU, 0 of 8 positive. Twin admissible: CPU +0.255 s = 0.82 % against a 0.464 s limit, sign 5 of 8, R 1.020 s CPU, wall R 0.210 s. 8 complete rounds, 0 flagged, one hold of 251 s.
- **The read was on the arms, before the merge, not on `main`.** `…b17275dd` allows that with H's lane inputs equal. Checked here over `…5571c5a1`'s list (`src`, `tools`, package files, `vitest.config.ts`, `tsconfig.json`, `AGENTS.md`, `data`, `biome.json`): `git diff --name-only 797bb1a5` against `bce24018` and against this branch's base lists nothing. `e01d39b1` to `797bb1a5` lists the four test files and nothing else. So the figure holds for `main`. `main` itself has not been read.
- **Security surface:** those four test files are the whole delivered diff outside the records. No input, auth, data, secret or logging path changed. The one new thing a test touches is a temp copy of 52 committed notes, removed in `afterAll`. No L1 requirement applies, so the checklist was not walked row by row.

## The trio and the note count
- **The trio moved together:** QE's A5 (`…d356030c`), sentinel A5R 3 red at base and 0 at the tip (`…19f6c80a`), `F4` 0 whole-tree `readNotes` calls with the flag unset.
- **Read by source too.** In `tools/grugops/qe-hop-integrity.test.ts` every call of `allNotes()` and `plainSweep()` sits inside `if (RUN_DEEP)`. Every default-lane `readNotes` carries a folder filter, every default-lane `--sweep` an injected root, and `--ticket` reads through a folder filter in the tool. No other test file reads the record: the other `.grugops/context` strings under `src/` are comments.
- **52 notes in reach:** the five named ids' folders hold 52 note files, as `ADR-0035` C6 says.
- **The count:** `find .grugops/context -path '*/notes/*.md' | wc -l` reads 5 467 at this branch's base, and `git ls-tree` gives 5 467 at `bce24018`. `main` reached neither 5,500 nor the 5,900 backstop before the merge. C6's "if the count crosses 5,500 first" did not happen.
- **A5R is not a standing row.** It lives in `se-ABC-307`'s and `qe-ABC-307`'s `raw/`, not in the tree. Nothing in `npm test` fails if a default-lane row reads the record whole again, so C6's "`A5`'s check is what shows it" means someone has to run it.

## Timing reads voided on 2026-11-05: five of seven graded lane reads
| # | read | hold (UTC) | flagged | load | note |
|---|---|---|---|---|---|
| 1 | `secnfr-census-1105` session 1 | 12:00:37 to 12:05:04 | 8 of 8 | `grugops` vitest | `…6315faad` |
| 2 | `se-ABC-305` `N8-LANE` | 12:34:41 to 12:39:07 | 8 of 8 | `grugops` vitest | `…2adad06f`, on `grugops/ABC-305` only; `main` has `…9e878ba6` |
| 3 | `ABC-307` A9 read 1 | 15:17:00 to 15:21:12 | 3 of 8 | foreign vitest, one project | `…46d3b23c` |
| 4 | `ABC-307` A9 read 2 | 15:21:56 to 15:26:08 | 1 of 8 | CPU alone, source `UNKNOWN - verify` | `…43927eb6`; void only on the stricter line QE sealed, held by `…b17275dd` |
| 5 | `ABC-307` A9 read 3 | 19:49:50 to 19:54:10 | 7 of 8 | `grugops` vitest | `…4a8dd8dc` |

- **Stood:** two, the census re-read (`…e5e57903`) and A9's last read (`…78d1f873`). No figure from the five is cited here, by `…f40ce634` 4 and `…9e878ba6`.
- **Four of the five name a foreign vitest. One does not:** read 2's source is unknown.
- **Not counted.** `n8-r4` got no slot and nothing was read (`…d5cd6d19`). The census probe read clean and is an estimate, not a grade. `arch-ABC-291-probe`'s per-call ratio with the memo bypassed is also marked VOID (`…65c7a9c9`): it failed its own control band, it was a report, and whether load caused it is not established. Counting that report makes six. `qe-ABC-282`'s A4 was not ALONE and stood with a gap (`QE-282-k`), so it is not a void.
- **Cost:** A9's first hold began 15:17:00Z and the read that stood ended 21:45:55Z, 6 h 29 min later. No figure was wrongly read: every void was caught by the sealed rule.

## A read needed a host held by hand
- Reads 1 and 3 passed the slot gate and lost the hold inside 90 s. `…f5dc2987` then ruled that the next dispatch waits for the owner to say the whole host is quiet.
- The read that stood ran in that window: "the window is held by hand and has no stated end" (brief `qe-ABC-307-a9b`, item 3; `375f6362`). The slot cleared on the first try, 20 s in, with 0 foreign vitest in 84 samples.
- **The owner's word for that window is on record only in the brief,** which reports it. No sealed Orchestrator note carries it: the last before the read is `…f5dc2987`.
- **The load is not one project's:** a second project's vitest was live at 20:01:55Z (`…d5cd6d19`).
- **Other limits:** the sampler names vitest only, so only the CPU rule caught read 2 (`…43927eb6`). `n8-grade.py` does not read the flags, so a void read's `grade.out` still prints MET (`…2adad06f`); `flags.py` runs first by rule, not by the tool.
