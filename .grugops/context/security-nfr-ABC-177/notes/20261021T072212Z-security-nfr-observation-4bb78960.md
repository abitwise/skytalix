---
id: 20261021T072212Z-security-nfr-observation-4bb78960
kind: observation
by: security-nfr
at: 2026-10-21T07:22:12Z
verified_by: 
confidence: high (instrument output and git, read verbatim; hardware at run time UNKNOWN - verify)
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - ADR-0035
  - ADR-0046
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - 20261021T071230Z-qe-e2e-observation-845268c1
  - 20261021T055500Z-orchestrator-decision-b87c35b6
  - 20261021T065000Z-orchestrator-decision-f8cd47ba
  - .grugops/context/qe-ABC-177/probe/timing3/
  - f81bf03c
  - ff1e375f
  - src/uci-session.test.ts
supersedes: 
seal: sha256:e064bacd63d756929fbadb04be6f65770ca03c902295451a9cfbd3afa88ac047
---

# `ABC-177` at Security/NFR: the evidence behind the `NFR-008` and `R-174-1` rulings (read, not re-timed)

Nothing was run or timed at this hop. Every figure below is QE's instrument output in
`.grugops/context/qe-ABC-177/probe/timing3/` (`SHA256SUMS` 38/38 OK, re-checked here), or `git`, read on 2026-10-21.

## 1. The reading against the catalog's own rule
`NFR-008` R-1's level is `npm test` wall ≤ 10 s at load1 ≤ 8 on the declared stack. Its admissibility and state rule is
`ADR-0035` decision 1, as amended forward-only by A1 (2026-10-12). Neither one has a thermal clause.

| item | t3-r1 (`t3-r1/readout-nfr008-full-b.out`, `nfr008-full.summary.txt`) | holds? |
|---|---|---|
| command | `npm test` as spelled; 59 files / 1987 tests on every run | yes |
| tree | H, H2 = `git archive f81bf03c`; each arm its own `npm ci` | yes |
| statistic | n 8, k 2, round 0 discarded | yes |
| H/H2 twin CPU | median +0.340 s ≤ max(1.5 % of 26.915 s = 0.404 s, 1 tick); sign +6/−2 on 8 non-zero deltas, p 0.289 | admissible |
| resolves 10 s | wall R 0.250 s ≤ 10 s | yes |
| H median wall | **9.395 s**; sorted 9.06, 9.21, 9.26, 9.35, 9.44, 9.45, 9.52, 9.55; interval x(2)..x(7) = 9.21..9.52 | ≤ 10 s |
| load1 before each scored run | 3.75–7.28 | all ≤ 8 |
| power | AC on 36/36 lane runs and 37/37 window polls; `speed_limit` none | AC rule (`…bfdc97e5`) met |
| stack | Node v26.11.1 and vitest 4.1.11 per the pre-registration and npm ci logs; `npm test` carries `NODE_OPTIONS=--max-old-space-size=128` at `f81bf03c` | yes |
| hardware | `hw.model` Mac15,13, 8 logical cores, Darwin 25.5.0, read **at review time** (07:20Z), not in the run record. Host name in the run logs: `MacBook-Air.local` | `UNKNOWN - verify` at run time; same host by name |

**State under `ADR-0035` D1: MET.**

## 2. What the thermal handling can and cannot change
- **The registered thermal discard is a QE instrument rule.** It is in `preregistration-timing3.txt` and `readout-nfr008-174.py`/`174a`. It is not in `NFR-008`'s text or in `ADR-0035`.
- **Under that rule, t3-r1 is VOID:** 3 scored rounds, below n 8. That means "no reading". It is not NOT MET.
- **No H run in t3-r1 was over 10 s.** The thermal-0 rounds 1–3 read H 9.06 / 9.26 / 9.44 s. The warm rounds 4–8 read
  9.21 / 9.35 / 9.45 / 9.55 / 9.52 s.
  - So keeping or dropping the warm rounds decides only whether a reading exists. It cannot move the state from NOT MET to MET.
  - **The warm rounds did not flatter the median.** Their H walls sit at or above the thermal-0 rounds'. This is
    descriptive: three rounds are not a reading, and load1 also rose across the stage.
  - **The one 11.28 s wall is H2's** (round 8, thermal 2). It is the twin, not the treatment. It sits in the twin deltas,
    and the twin stays admissible.
- t3-r2 (thermal ≥ 1 on 8/8, H median 11.05 s) is **NOT APPLICABLE**, because load1 was 9.09 before a scored run. The
  pre-registered selection rule (06:38:58Z) therefore had one reading stage to choose from. **The choice was forced, not taken.**

## 3. Order of events, as recorded
- 06:38:58Z: `preregistration-timing3.txt`, including the selection rule. File mtime only; committed later in `478b3b9b` (06:56:16Z).
- 06:45:45–06:52:04Z: the t3-r1 lane.
- ~06:55Z: the owner's thermal word, `…31ab7d2d`. This is the note's own `at`; it was committed in `97ef5027` at 07:08:15Z.
- 07:08:22Z: QE seals the VOID grading. ~07:09Z: QE sees `…31ab7d2d`. 07:11Z: addendum and `174b`. 07:13Z: re-read notes.
- `478b3b9b` did not commit any t3-r1 output.
- **Whether the owner or the Orchestrator had seen any t3-r1 row before ~06:55Z is `UNKNOWN - verify`.** The word reads
  as prospective ("Let's try; if it doesn't pass we can discuss"). § 2 is why the ruling does not hang on this.

## 4. Merge effect (for `R-174-1`, which is about the lane `main` carries)
- `git merge-base main f81bf03c` = `ff1e375f`, the arms' base.
- `git diff --name-only ff1e375f main -- src tools package.json package-lock.json vitest.config.ts tsconfig.json` is
  **empty** at `main` `0374bb18`. `main` moved only in `.grugops/` (180 paths) and `plans/` (4), with no test files.
- So a merge of `f81bf03c` gives `main` the lane that t3-r1 read, **if nothing that touches those paths lands first.**

## 5. Security surface
- `git diff --name-only ff1e375f f81bf03c` prints exactly `src/uci-session.test.ts` (+16 / −14).
- Every hunk is a step literal (`100` → `1_000`; U8's `stepMs: 10` → `100`) or the U1 fold. There is no new import,
  no I/O, no process, no network, no file access and no secret.
- The UAT-waiver probe (`git diff --name-only f81bf03c~1 f81bf03c | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing.
- **No production byte changed. No ASVS L1 requirement is in reach** (`security.asvs_level` L1). Security is not triggered, as the ticket said.
