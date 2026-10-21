---
subtask: qe-ABC-177-timing-3
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 1 (nothing else in flight)
---

# QE timing, attempt 4 of ABC-177: full stage only (A9–A11)

The owner delegated decisions on ABC-177 to the recommended option (`…b87c35b6`). This hop takes the option QE recommended in `…92bb0293`.

**Scope:**
- Re-dispatch the full stage only, with `timing2/run-amended.sh full` and the cool-down watcher.
- A8 is MET and is not repeated.
- The thermal rule is **not** relaxed: discarding rounds with thermal pressure above 0 stays as registered.

## Owner amendment (2026-10-21 ~06:50Z, note `…f8cd47ba`), which overrides the start gate below
- Foreign test runs are OK, including the grugops full suite: the owner has capped each one to 1–2 cores. **Don't wait for them to go idle.** Log each run's count and command.
- Still required: AC, load1 ≤ 8, interleaved arms.
- The thermal rule is unchanged. If the stage goes void on thermal, mark it OWED and the Orchestrator takes it to the owner.

## Owner amendment 2 (2026-10-21 ~06:55Z, note `…31ab7d2d`), which overrides the thermal rule (ABC-177 only)
- Rounds with thermal pressure of 1 or more are **kept and logged**, not discarded.
- Flag the reading "warm host (thermal ≥ 1 in k/8 rounds)" in the verdict and in the trace row.
- If head is ≤ 9.2 s, A10 is MET (flagged).
- If head is over 10 s, or the stage fails any other way, mark it NOT MET or OWED and hand it back. The owner will then stop the other sessions.

## Read first
- `.grugops/queue/done/qe-ABC-177-timing-2.md`.
- Notes `…24f216bf`, `…4263d981`, `…ef316298`, `…92bb0293`.
- `probe/timing2/preregistration-timing2.txt` and `SHA256SUMS`. Verify the instrument hashes before use.

## Do
- **Start gate.** Wait until all three hold:
  - no full-suite vitest from `Projects/public/grugops` is running. Short single-file runs are logged, not blocking, per `…b87c35b6`;
  - thermal pressure has read 0 for 60 s;
  - AC power, and load1 ≤ 8.
- **Start check (Orchestrator, ~06:40Z):** a foreign full suite (`vitest run --exclude **/scripts/e2e/**`) had been running for 25 min.
- **Arms:** rebuild them per the registered recipe, each with its own `npm ci`. Building may overlap the wait; readings may not.
- **Re-runs:** if a stage goes void, one re-run per the pre-registration.
- **Escalation:** unchanged. Over 9.2 s → O3 note; over 10 s → owner.
- **Give up:** if no admissible start opens within about 120 min, mark it OWED. **Never estimate.**

## Fences
- Scratch trees only, removed at the end.
- No changes to `src/`, `plans/` or `../wt-ABC-177`, and no touching processes you didn't start.
- No fixing. Never push, merge or self-sign.

## Publish
- Sealed notes via the sanctioned writer (task `qe-ABC-177`), including a `kind: decision` that amends `…92bb0293`.
- Append `## Result (timing-3)` to `.grugops/queue/done/qe-ABC-177-timing-3.md` (brief + result), plus a `.claim.md`, both uncommitted. Include:
  - the A9–A11 grades and readings;
  - the NFR-008 result;
  - whether R-174-1 is discharged;
  - the overall verdict;
  - a trace row.

## Result (timing-3) (qe-e2e, 2026-10-21 07:15Z): **A9 MET and A10 MET** (under owner amendments, flagged "warm host (thermal ≥ 1 in 5/8 rounds)"); **A11 target NOT MET at 9.395 s, so the O3 route fires.** `NFR-008` **MET** (9.395 s); `R-174-1` discharge condition met, **not discharged by QE** (Security/NFR rules); verdict **PASS_WITH_GAPS**

**Notes** (`.grugops/context/qe-ABC-177/notes/`) were sealed by the sanctioned writer: `context-io.js` `admitAndAppend`, from
the grugops 2.1.0 plugin cache, task `qe-ABC-177`. All seven read back through `readContext`.

**Final:**
- `…bc49c2fe`: the readings under `…31ab7d2d` (amends `…277060fc`);
- `…84059cad`: the O3 trigger for Architect/Design and BA/PM;
- **`…e808274d`: the verdict decision. It amends `…f43a53f5` and, through it, `…92bb0293`.**

**Earlier this hop, still valid for the facts they record but superseded on grading:**
- `…277060fc`: the stage readings on the registered thermal rule;
- `…845268c1`: the gaps;
- `…d5e170ec`: artifacts and commands;
- `…f43a53f5`: the VOID/OWED verdict, sealed at 07:08:22Z before QE saw `…31ab7d2d`.

Those four carry `at` stamps 07:12:00–07:13:30Z, which run ahead of the wall clock; `…e808274d` records the correction.

The evidence is in `probe/timing3/`, with 38 files under `SHA256SUMS` (OK).

### What happened
1. **Verification.** `timing2/SHA256SUMS` was 44/44 OK and `timing/SHA256SUMS` OK. Every instrument matched its pre-registered
   sha256 prefix.
2. **Arms.** 4 `git archive` arms with an own `npm ci` each: B and T at `ff1e375f`, H and H2 at `f81bf03c`. No symlinks;
   vitest is 4.1.11 everywhere, and the test-file hashes match. 59 files and 1987 tests on every run.
3. **Pre-registration.** `preregistration-timing3.txt` (06:38:58Z) came before the first gate poll. The start gate is
   `gate3.sh`: ≥ 60 s of no full-suite vitest, thermal 0, AC and load1 ≤ 8, then `timing2/run-amended.sh full` unchanged.
4. **t3-r1.** The gate waited out the foreign full suite (to 06:41:32Z) and opened at 06:42:38Z.
   - Window: 20/181 foreign polls (a single-file run).
   - Lane: 06:45–06:52Z, AC on 36/36, and **0 foreign vitest on every run**. Thermal 0 → 1 at round 4 and 2 from round 7.
   - Registered thermal rule: **VOID** (3/8).
5. **t3-r2, the one re-run.** The gate opened at 06:54:11Z.
   - The other session's multi-file runs were active throughout.
   - Thermal ≥ 1 from round 1; load1 9.09 before one scored run.
   - `sampler174.mjs` **crashed** at about 07:01:3xZ.
   - Registered rule: **VOID** (0/8).
6. **Owner amendments landed mid-hop.**
   - `…f8cd47ba` (about 06:50Z): foreign runs do not block. Both stages started under the stricter gate, so it is satisfied.
   - `…31ab7d2d` (about 06:55Z, commit 07:08:15Z, seen by QE at about 07:09Z): thermal ≥ 1 rounds are kept and flagged, for
     ABC-177 only.
7. **Re-read.**
   - `preregistration-timing3-addendum.txt` (07:11Z) fixed `readout-nfr008-174b.py`, which is `174a` with the thermal discard
     logged, plus the warm count. This was done before it ran.
   - **Disclosed:** QE had already seen the rows. The selection rule dates from 06:38:58Z.
   - Result: **t3-r1 MET, 9.395 s, warm 5/8**. t3-r2 **NOT APPLICABLE** (load1 > 8), so it does not read. **t3-r1 stands.**
   - No new stage was run.

### Per criterion
| crit | grade |
|---|---|
| A1–A7, A12 | **MET** (carried; not re-run) |
| A8 | **MET** (carried from timing-2: H−B CPU −2.820 s ≤ 650 ms) |
| A9 | **MET under owner amendments** (`…b87c35b6`, `…f8cd47ba`, `…31ab7d2d`): `npm test` as spelled; B/T and H/H2, each with its own `npm ci`; load1 3.75–7.28 on scored runs; AC on all 32 scored runs (`speed_limit` "none"); n 8, k 2. The strict registered view is VOID |
| A10 | **MET, flagged warm (5/8).** (i) H median wall **9.395 s** (9.06–9.55), H/H2 R 0.250 s, admissible → `NFR-008` MET. (ii) H−B wall **−1.620 s [−1.710, −1.540]**, CPU **−3.605 s [−3.810, −3.390]**. (iii) twin R, CPU / wall: B/T 0.900 / 0.280 s (B/T CPU median 1.54 % > `ADR-0035` d1's 1.5 %, flagged), H/H2 0.600 / 0.250 s |
| A11 | **Target NOT MET: 9.395 s > 9.2 s, ≤ 10 s → O3** (`…84059cad`). Per the ticket, `ABC-177` may close on its other criteria; tranche 2 goes under a new ticket |

### `NFR-008` and `R-174-1`
- **`NFR-008` on `f81bf03c`: MET, 9.395 s.**
  - It carries the flags: warm host 5/8, foreign window logged, ABC-177-only thermal rule.
  - It supersedes `QE-174-b`'s 10.010 s NOT MET as the latest reading.
- **`R-174-1`: the discharge condition (≤ 10 s) is MET, but QE has not discharged it.** Security/NFR rules on it, given
  `…31ab7d2d`'s "no precedent" scope.

### Overall verdict
- **PASS_WITH_GAPS.** A1–A10 and A12 MET; A11's design target missed, so O3 goes to Architect/Design and BA/PM.
- **`QE-177-g` closes as read.**
- **Gaps:**
  - warm-flagged reading, with the strict view VOID;
  - B/T twin at 1.54 % > 1.5 % (weakens H−B attribution only);
  - `sampler174.mjs` crash risk (t3-r2 only);
  - the re-read was not blind (disclosed);
  - the Orchestrator's commits `478b3b9b` and `97ef5027` swept in this hop's uncommitted probe files mid-hop;
  - `QE-177-a`..`-f` and the UAT waiver stand.
- **Recommended:** `In Review` → `In Security/NFR` for the `R-174-1` ruling, with O3 in parallel. The Orchestrator decides.

### Fences kept
- QE committed nothing, and pushed, merged, fixed or self-signed nothing.
- Untouched: `src/`, `../wt-ABC-177` (clean at `f81bf03c`), `plans/`, and processes this hop did not start.
- `scratchpad/t177` (the arms), the launcher and watcher copies, and the note-body scratch were removed; nothing is left
  running.
- `pending/qe-ABC-177-timing-3.md` and `claimed/qe-ABC-177-timing-3/` are left for the Orchestrator's close.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-177 (A9–A11 timing-3) | ADR-0046; owner …bfdc97e5 (AC), …b87c35b6 / …f8cd47ba (foreign logged), …31ab7d2d (thermal kept, ABC-177 only) | grugops/ABC-177 @ f81bf03c (from ff1e375f) | npm test (full lane, 59 files / 1987 tests) | QE qe-ABC-177-timing-3: t3-r1 H median wall 9.395 s (R 0.25 s, load1 ≤ 7.28, AC), NFR-008 MET — warm host (thermal ≥ 1 in 5/8 rounds), strict view VOID; H−B wall −1.620 s [−1.710, −1.540], CPU −3.605 s; twin R B/T 0.900/0.280 s (1.54 % > 1.5 %), H/H2 0.600/0.250 s; t3-r2 NOT APPLICABLE (load1 > 8) | PASS_WITH_GAPS: A1–A10/A12 MET (A9/A10 under owner amendments, warm-flagged), A11 9.395 > 9.2 s → O3 (Architect/BA/PM, new ticket); R-174-1 condition met, Security/NFR to rule | notes …bc49c2fe, …84059cad, …e808274d (amends …f43a53f5 → …92bb0293); stage facts …277060fc, …845268c1, …d5e170ec |`
