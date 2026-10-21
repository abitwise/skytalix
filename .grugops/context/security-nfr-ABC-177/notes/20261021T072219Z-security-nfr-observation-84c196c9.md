---
id: 20261021T072219Z-security-nfr-observation-84c196c9
kind: observation
by: security-nfr
at: 2026-10-21T07:22:19Z
verified_by: 
confidence: high (arithmetic from QE's printed figures; owners named)
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - R-177-1
  - R-177-2
  - FIX-177-1
  - ADR-0035
  - 20261021T072212Z-security-nfr-observation-4bb78960
  - 20261021T071230Z-qe-e2e-observation-845268c1
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - .grugops/context/qe-ABC-177/probe/sampler174.mjs
  - .grugops/context/qe-ABC-177/probe/timing3/t3-r1/nfr008-full.summary.txt
  - architect-design
  - qe-e2e
supersedes: 
seal: sha256:7fb540507612a8f6f3db18c55c6277fc164410dc7f27e93534d1550e66681c9f
---

# `ABC-177` at Security/NFR: accepted risks, the required fix, and how each QE gap is disposed

None of these blocks `ABC-177`. `security.block_on` is `high`, and none of them is high.

## `R-177-1`: accepted risk, LOW. The `NFR-008` MET that discharges `R-174-1` was read warm, under an ABC-177-only exception
- **What it is.** t3-r1's 9.395 s was read with thermal pressure ≥ 1 in 5 of 8 rounds.
  - Those rounds were kept only under the owner's ABC-177-only exception, `…31ab7d2d`.
  - The strict registered readout is VOID.
  - The grading came after a post-run rule change, and QE's re-read was not blind (disclosed).
  - A thermal-0 full-lane reading of `f81bf03c` does not exist.
- **Why LOW.**
  - Every H run was ≤ 9.55 s.
  - The margin to 10 s is 0.605 s, about 2.4 × the wall R.
  - The warm rounds were not faster than the thermal-0 ones.
  - Thermal handling decides only whether a reading exists. It cannot flip a NOT MET (see the evidence note, § 2).
- **Owner: Olger Oeselg.** He accepted it in his word `…31ab7d2d`: "change the rule for this ticket. Let's try; if it
  doesn't pass we can discuss". That word also set this flag.
- **Closes:** at the next Security/NFR gate that reads the full lane under its own pre-registration, whichever way that
  reading falls. A reading over 10 s there is `NFR-008` NOT MET and goes back to the owner (`ADR-0035` D6), as any reading would.
- **No precedent.** No thermal rule is added to `NFR-008`.

## `R-177-2`: accepted risk, LOW. The B/T identity twin is inadmissible, so A10 (ii)'s H−B saving has no state
- **Arithmetic.**
  - T−B CPU median −0.470 s is 1.54 % of B's 30.59 s. The limit is max(1.5 % = 0.459 s, one tick).
  - **So the twin is inadmissible under `ADR-0035` D1 as amended by A1, by 0.011 s.**
  - Its sign is 1/8, p 0.070, at chance only just. Its interval [−0.900, −0.210] excludes 0.
- **What it touches.**
  - (ii) H−B wall −1.620 s [−1.710, −1.540] and CPU −3.605 s [−3.810, −3.390] are **reported with no state**. They are
    not an attributed saving of `ABC-177`.
  - B/T's R (CPU 0.900 s / wall 0.280 s) is **listed and not used**, by the catalog's rule for inadmissible sets. It must not move `F`.
- **What it does not touch.**
  - `NFR-008` and `R-174-1`. Both read from H alone, against the admissible H/H2 twin.
  - The H/H2 R (CPU 0.600 s / wall 0.250 s) is admissible, capped and own-install. Whether it replaces the pre-cap full-lane `F` is Architect/Design's ruling, not this gate's.
- **No fix is required.** A re-read needs timing, and nothing that gates depends on (ii).
- **Owner: Architect/Design**, owner of `F` and of the timing protocol.

## `FIX-177-1`: required fix, LOW. `sampler174.mjs` throws on a `ps` line its parse does not match
- **The defect.** At line 15, `const m = l.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/)` is dereferenced unguarded
  (`m[1]`). One unmatched line throws inside `setInterval`, and the sampler dies. That is the logged
  `TypeError: Cannot read properties of null (reading '1')` (t3-r2, about 07:01:3xZ).
  - After that, the stage runs on with no sampler, and nothing records which line caused it.
  - **A failure mode with no log of its cause.** Under the strict readout, which discards on the sampler, a dead sampler also silently changes what counts as clean.
- **The fix.**
  - Skip an unmatched line. Never throw from the interval.
  - Append the unmatched line (truncated) and its time to a side log.
  - Count unparsed lines per sample in the TSV.
  - Register the fixed copy by its new sha256 in the next pre-registration that uses it.
- **Owner: QE/E2E**, the instrument's registrant.
- **Due:** before the next full-lane `NFR-008` reading that uses `sampler174.mjs` or a copy of it.
- **Not due for `ABC-177`.** t3-r1's sampler ran the full stage (75 rows), so no grade moved.
- **Not cut to BA/PM.** It is a probe instrument under `.grugops/context`, not product code, so no ticket is needed.

## The other QE gaps (`…845268c1` items 2–5, `…e808274d` item 4): seen, no action at this gate
- **Item 2 (the start gate's full-suite rule)** is moot under `…f8cd47ba`.
- **Item 3 (thermal 0 for 60 s is a weak cool-down signal)** belongs to whoever writes the next thermal-gated
  pre-registration. It is noted for QE.
- **Item 4 (npm 11.20.0 skipped install scripts)** had no functional effect: 1987/1987 tests on every run.
- **Item 5 (ordering by mtime only)** and **the non-blind re-read** are carried inside `R-177-1`.
