---
id: 20261105T122931Z-security-nfr-decision-19cea480
kind: decision
by: security-nfr
at: 2026-11-05T12:29:31Z
verified_by: 
confidence: high on the grade, R-N8H-1 and the gate outcome (rules sealed before the read); medium on the supply (one skip probe, 8 / 8); the remnants, their kept ms and every row's kill parity are UNKNOWN - verify
refs:
  - secnfr-census-1105
  - NFR-008
  - NFR-002
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - R-CEN-1
  - Q-N8H-1
  - T-QEHOP-GROWTH
  - ADR-0035
  - ADR-0046
  - ADR-0029
  - ABC-282
  - ABC-303
  - ABC-289
  - ABC-305
  - ABC-105
  - ABC-171
  - ABC-212
  - ABC-094
  - ABC-101
  - ABC-241
  - EPIC-011
  - QE-282-k
  - QE-105-p
  - QE-244-a
  - src/uci-session.test.ts
  - src/book.test.ts
  - src/cli.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - plans/nfr-catalog.md
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - secnfr-census-1105/20261105T120600Z-security-nfr-observation-6315faad
  - secnfr-census-1105/20261105T122213Z-security-nfr-decision-1d72a218
  - secnfr-census-1105/20261105T122843Z-security-nfr-observation-e5e57903
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - orch-2026-10-30a/20261105T081031Z-orchestrator-decision-42f7fd67
  - orch-2026-10-30a/20261105T114920Z-orchestrator-decision-16e0ec2c
  - secnfr-ABC-302-a9/20261104T203737Z-security-nfr-decision-0089724b
  - secnfr-ABC-302-a9/20261104T203737Z-security-nfr-observation-25105dda
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - 572edf13
  - bffb23c4
supersedes: 
seal: sha256:6661b24684b42e77b02d4f3502535ff4f32a6397048058225198160a96537346
---

# Security/NFR decision, secnfr-census-1105: **PASS_WITH_RISKS.** `NFR-008` MET, graded, at 9.515 s on `main` with W1 in. **Outcome G-WITH: the next lane-adding merge may go only with a row move merged first or in the same merge.** The supply reaches the bar, with almost no slack. `R-N8H-1` stays MEDIUM. The 9.6 s line did not fire

Ruled on this task's readings `…e5e57903`, under the rules sealed in `…b9038a14` and `…1d72a218`. No §14 stamp exists on this install, so nothing here is a `finding`. Every risk is observation-grade, with a named owner. The gate outcome is the sealed rule's; the routing is the Orchestrator's.

## Scope
NFR only. This hop timed `main` and read test sources. No `src/`, test, config, ticket, ADR, EPIC, board or catalog file was edited. It makes no security claim about any merge.

## What gates
| question | answer |
|---|---|
| `NFR-008` against 10 s | **MET, graded**, 9.515 s [9.31, 9.63], headroom 0.485 s |
| the lane against 9.6 s | **below, by 0.085 s.** `…f30bd604` item 2 does not fire. Nothing goes to the owner |
| `R-N8H-1` | **MEDIUM, unchanged.** 9.515 s is not below 9.5 s. The mark is one-sided, as at `…0089724b`. Owner: the Orchestrator. Remedy owner: Architect/Design |
| the next lane-adding merge | **G-WITH.** m + 0.10 = 9.615 s ≥ 9.6 s, so it does not go alone |

**What G-WITH means.** Whichever of `ABC-303` and `ABC-305` merges first needs the row move merged before it or in the same merge. `ABC-289` comes after them. It gates no build (`…16e0ec2c` item 1).

**How close it was, plainly.** The outcome turns on 0.015 s, which is inside the noise. QE's graded 9.48 s on the ABC-282 tip would have read G-GO, and the probe's ungraded H read 9.46 s. (`…e5e57903` calls QE's read "this tree". QE's H was the tip before `ABC-304`'s test files, so that is the same `src/` but not the same tree.) The rule was fixed before the read, on the median alone, and I do not re-read to move it. The substance agrees in any case: three claimants at +0.10 s land 9.815 s, so even a G-GO would have needed this move by the second merge. Doing it first costs one ordering.

**The Orchestrator may rule otherwise.** If he reads `ABC-305` as well under budget (tools only, one row), letting it go first is his call. It would spend part of the 0.085 s on an estimate, and its own gate's H arm would then show where the lane stands.

## The ask, restated from the graded median
Three claimants at ≤ +0.10 s each: m + 0.30 = 9.815 s, so the realised need under 9.6 s is **−0.215 s**. That is the brief's −0.21 s. **−0.28 s stands as the forecast ask, and −0.31 s as the skip-read bar.**

## The row list: nine rows, skip read −0.365 s, **the supply reaches the bar**
| # | row | file | ms | lane | proposed remnant | est. kept ms | est. move saves |
|---|---|---|---:|---|---|---:|---:|
| Q1 | ABC-105 A9 "--sweep lists ABC-073 as a finding" | `tools/grugops/qe-hop-integrity.test.ts` | 180 | option (ii) in its own file | same asserts on injected notes, a named-folder subset | | |
| Q2 | ABC-105 A3 "coverage() over EVERY real note …" | same | 90 | same | same five reads on that subset, which keeps `quality-gate-ABC-066-qe` | | |
| Q3 | ABC-105 A4 "prints each count line and every finding by id …" | same | 65 | same | same partition on that subset and the real board | 20 (Q1–Q3) | 315 (Q1–Q3) |
| L1 | ABC-101 A8′ "the seam built for each level …" | `src/cli.test.ts` | 121 | `CLI_DEEP` by option (ii), or `uci-session`'s ENGINE_DEEP | levels 1 and the default, three calls each, with the non-vacuity asserts | 35 | 86 |
| L2 | ABC-241 A4 "with a legal ep capture available …" | `src/cli.test.ts` | 77 | `uci-session`'s ENGINE_DEEP, beside R8 | same two asserts on a 500 ms virtual step | 8 | 69 |
| L3 | ABC-241 A7 "the move the search scores 0 …" | `src/cli.test.ts` | 62 | same | every assert unchanged, on a 500 ms virtual step | 8 | 54 |
| C1 | ABC-171 A7 "two sessions on the same seededRandom(k) …" | `src/uci-session.test.ts` | 54 | ENGINE_DEEP, own file | the same two `levelOneMoves(2)` and their equality | 36 | 18 |
| C2 | ABC-212 A9 "… Skill Level value 7 sets 7: a bare go searches 30 000 ms" | `src/uci-session.test.ts` | 51 | ENGINE_DEEP, own file | `budgetAt(…, "go")` hands `{ budgetMs: 30_000 }` | 2 | 49 |
| B1 | ABC-094 A3 "ten seeds, one pick each …" | `src/book.test.ts` | 50 | option (ii) in its own file | the first seeds that give three distinct replies, same assert | 20 | 30 |
| | **total** | | **750** | | | **129** | **621** |

The kept figures are my estimates: L2 and L3 from R8's 9 %, the others from how much of each body stays. All are `UNKNOWN - verify`, as is whether each row can move at kill parity. The Architect confirms each with mutant reads.

### What the supply comes to
| step | figure |
|---|---|
| the bar, on the skip read | −0.31 s |
| **the probe, nine rows skipped** | **−0.365 s [−0.49, −0.33], 8 / 8: REACHED** |
| forecast by the PREREG's × 0.90 | −0.33 s |
| forecast by this list's own remnants (621 ms × 0.49) | −0.30 s |
| realised at ABC-302's 76 % | **−0.23 to −0.25 s, against the −0.215 s need** |
| the lane after all of it, with all three budgets spent | **9.565–9.585 s** |

**Enough, by the sealed rule, but thin.** The realised margin under 9.6 s is 0.015–0.035 s, inside the noise. This list's remnants keep about 17 %, more than ABC-302's 6–10 %, so the second forecast is the one to plan on.

### What it depends on
- **Q1–Q3 are 45 % of the list, and they move together or not at all.** Without them the skip read falls to about −0.20 s, and the supply is short. `allNotes()` and `plainSweep()` are shared and lazy, so moving one hands its cost to the next reader.
- **The `cli` rows are needed too.** P1 alone read −0.245 s, short of the bar.
- **The slack is about 113 ms in-thread.** (0.365 − 0.31) ÷ 0.49. Any two of C1, C2 and B1 can fall, or L2 or L3 alone. L1 alone cannot.
- **L3 needs its own mutant read.** `ABC-241` A7 is a named holder of `QE-244-a`'s five at `arch-ABC-302`. Its remnant keeps every assert, but on a coarser step.

### Bonus from Q1–Q3
They end the default lane's whole-tree read of the record, so note growth stops costing lane time. That is `R-N8H-2`'s cost and `T-QEHOP-GROWTH`'s subject. The Architect should say what happens to that trigger if they move.

### Withdrawn from `…25105dda`'s leads
`history-pane.nfr` A11 (93 ms). It is `ADR-0029`'s frame-path guard for `NFR-002`, one measured child, with no cheaper form and no other holder.

## After this list
**The row supply is spent.** Every other default-lane row of ≥ 50 ms is a bar, a fine-step time row, a slice, a remnant, a pin or a guard. The −0.315 s realised that LOW would need with all three budgets spent is out of reach. The lane then sits at about 9.57 s, and the next ticket has nothing to pay with. Rows under 50 ms were not read, because the rule read them only on a shortfall.

Rows are 38 % of the lane's worker time. Per-file start-up is 43 %, about 0.05 s of wall per file. Folding small test files together is an unread lead, and I propose nothing on it: `UNKNOWN - verify`, and isolation is what several guards rest on (`vitest.config.ts`).

**Heads-up, not an escalation.** This is `…f30bd604` item 4 arriving. The owner's fallback (b) stays unused unless its trigger fires.

## Risks
| id | state | owner | note |
|---|---|---|---|
| `R-N8H-1` | MEDIUM, unchanged | Orchestrator; remedy Architect/Design | above |
| `R-N8H-2` | LOW, unchanged | Architect/Design (`T-QEHOP-GROWTH`) | 5 417 note files at `bffb23c4`, 83 short of 5 500, about 8–9 busy hours away. **The re-read it arms uses the lock, so plan it** |
| `R-N8H-3` | INFO, unchanged | BA/PM, at each cut | a new file costs about 0.05 s of wall by this census's 107 ms and 0.49. The record's "about 0.1 s" is the worker time |
| `R-CEN-1` (new) | LOW | Orchestrator | **Foreign load voids timing reads.** Another project's vitest, outside this lock, cost session 1 its grade, as at `QE-282-k`. A read taken without a foreign-load check could pass it as graded: the host gate (load1 ≤ 8) did not catch it. The method's per-run `ps` caught it, and `flags.py` makes the rule mechanical. Later graded reads should carry that rule |

## Owed
- **`plans/nfr-catalog.md`, the `NFR-008` line:** latest verdict 9.515 s on `572edf13`, `R-N8H-1` MEDIUM. Outside this brief's fence, so not written. It goes to the next Security/NFR or records hop.
- **The row move:** BA/PM cuts one test-only ticket in ABC-302's form, the Architect confirms remnants by mutant read, and QE re-grades. Its `N8-LANE` re-read should be the first graded read after it.
