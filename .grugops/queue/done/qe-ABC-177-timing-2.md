---
subtask: qe-ABC-177-timing-2
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 1 (nothing else in flight; Orchestrator holds width 1 until this ends)
---

# QE timing retry of ABC-177: A8–A11 (QE-177-g), attempt 3

Attempts 1 and 2 left A8–A11 OWED: battery the first time, a foreign `oeselg-labs/platform` session the second. This is the third attempt.

Orchestrator pre-check, 2026-10-21 ~05:43Z:
- AC Power;
- load1 ≈ 1.9;
- no foreign vitest, `bats`, `kubectl` or platform session;
- Docker Desktop is open but idle at 0 % CPU. It is not a foreign run, but log its CPU per window.

The 180 s pre-sample result is in `.grugops/queue/claimed/qe-ABC-177-timing-2/` once claimed.

## Owner amendment (2026-10-21 ~05:55Z, note `…b87c35b6`) — READ FIRST, overrides the window rule below
- Foreign sessions no longer block the window; the owner has throttled them. Prefer a foreign-free window if one opens, but don't wait for one.
- Still required:
  - AC on every sample;
  - load1 ≤ 8;
  - base and head arms interleaved;
  - record per run: power, load1, foreign process count and commands.
- If head reads over 9.2 s with foreign load recorded, re-run that pair once; the lower reading stands. Escalation is unchanged.
- The owner has delegated: wherever a decision is needed, take the recommended option and record it.
- Pre-check 05:43–05:50Z: AC 24/24, load1 1.96–3.20. The bursts were a grugops-kit Claude session running vitest.

## Read first
- `.grugops/queue/done/qe-ABC-177-timing.md` for attempt 2 and its result.
- Notes `…dbd4875c` and `…51e0ae25`. The second has the arm rebuild recipe.
- `.grugops/context/qe-ABC-177/probe/timing/run.sh`. It is registered: run it as is, `n8` first, then `full`.
- The ticket's A8–A11, and the AC rule `…bfdc97e5`.

## Do
- Rebuild the arms per `…51e0ae25`: own `npm ci` per arm, no symlinked `node_modules`.
- Then take A8 (N8-LANE, ≤ 650 ms CPU, 400 heap flag), then A9–A11 (full-lane twin; NFR-008 ≤ 10 s, target ≤ 9.2 s).
- Admit a window only after it has been foreground-verified quiet for 180 s, with AC on every sample and load1 ≤ 8.
- Record power, load1 and process count per run.
- **Escalation:** over 9.2 s → an O3 note for Architect/BA/PM; over 10 s → the owner.
- If no window opens within about 60 min, or power drops, mark it OWED. **Never estimate.**

## Fences
- Scratch trees only, removed at the end.
- No changes to `src/`, `../wt-ABC-177` or `plans/`, and no touching processes you did not start.
- No fixing. Never push, merge or self-sign.

## Publish
- Notes under `ref:`, including a `kind: decision` that amends `…dbd4875c`. Use the sanctioned writer if available.
- Append `## Result (timing-2)` to `.grugops/queue/done/qe-ABC-177-timing-2.md` (this brief + result) and write `.claim.md`, both uncommitted. Include:
  - the A8–A11 grades and readings;
  - the NFR-008 result;
  - whether R-174-1 is discharged;
  - the overall verdict;
  - a trace row.

## Result (timing-2) (qe-e2e, 2026-10-21 06:38Z): **A8 MET; A9–A11 OWED** (both full-lane stages VOID on the registered thermal rule). `NFR-008` NOT READ; `R-174-1` NOT discharged; verdict **PASS_WITH_GAPS on A1–A8 and A12, A9–A11 OWED**

**Notes** (`.grugops/context/qe-ABC-177/notes/`) were sealed by the sanctioned writer: `context-io.js` `admitAndAppend`, from
the grugops 2.1.0 plugin cache. No `propose_note` tool was available.
- `…24f216bf`: the decision on how `…b87c35b6` was applied;
- `…4263d981`: the readings observation;
- `…ef316298`: artifacts and commands. The writer refused it as an `artifact-ref` (no §14 `gate_run`), so it was
  re-recorded as an `observation`;
- **`…92bb0293`: the verdict decision, which amends `…dbd4875c`.**

The evidence is in `probe/timing2/`, with 44 files under `SHA256SUMS`.

### What happened
- **Pre-registration first.** `timing2/preregistration-timing2.txt` was written at 05:58:00Z. The registered instruments
  were re-verified by sha256.
- **The amendment needed new instruments.** The registered `run.sh` gates on 0 foreign polls, and the registered readouts
  VOID on any foreign sample. So `…b87c35b6` could only take effect through derivative instruments that change one thing:
  `run-amended.sh`, `readout174a.py` and `readout-nfr008-174a.py`, which log foreign load instead of discarding on it.
  The strict registered readouts were run beside them.
- **Arms.** 7 `git archive` arms, 6 with their own `npm ci` and n8 T = `cp -R B` (`diff -r` clean). No symlinks; the hashes
  match the commits.
- **Pre-sample.** 05:59Z, 5/181 foreign polls from another Claude session's vitest in `Projects/public/grugops`, so the
  amended branch ran. The brief's own pre-sample file was **absent** from `claimed/qe-ABC-177-timing-2/`.
- **Power and Docker.** AC on every window poll (37/37 × 3) and every run (27 + 36 + 36). Docker Desktop: 10 procs, CPU sum
  0.0 % at every stage start and end.

| stage | window foreign/181, load1 | runs | result |
|---|---|---|---|
| n8 r1 06:02–06:08Z | 108, 2.09–3.02 | 27, thermal 0 throughout, load1 2.58–4.19 | **MET** (amended); strict VOID on foreign only |
| full r1 06:08–06:18Z | 162, 3.04–3.86 | 36; thermal → 1 at round 3, 2 by round 8 | **VOID** (scored 2/8) |
| full r2 06:22–06:32Z (after a 60 s thermal-0 cool-down) | 181, 2.97–3.92 | 36; thermal 1 from round 1, 2 from round 3; load1 up to 11.51 | **VOID** (0/8) |

- **The foreign load** in both full stages was the other session's whole suite,
  `npm exec vitest run --exclude **/scripts/e2e/**`, on every sampler row.
- **The one permitted re-run was used.** No further run was taken. The raw full-lane rows are archived but are **not
  readings and not graded**.

### Per criterion
| crit | grade |
|---|---|
| A1–A7, A12 | **MET** (carried; not re-run) |
| A8 | **MET.** H−B CPU median **−2.820 s** (interval −2.840..−2.790) ≤ 650 ms. B 7.100 s, H 4.275 s CPU. Twin R 0.070 s, admissible (p 0.453). Wall H−B −2.815 s |
| A9 | **OWED.** Protocol run ×2; both stages VOID (thermal) |
| A10 | **OWED.** (i)–(iii) not read on an admissible stage |
| A11 | **OWED.** No reading, so no escalation fires |

### `NFR-008` and `R-174-1`
- **`NFR-008` on `f81bf03c`: NOT READ.** The last admissible state is still `QE-174-b`'s NOT MET, 10.010 s.
- **`R-174-1`: NOT discharged.**

### Overall verdict
- **PASS_WITH_GAPS on A1–A8 and A12; A9–A11 OWED.**
- **`QE-177-g` stays MEDIUM, narrowed to A9–A11.**
- **Route (recommended):** re-dispatch the full stage only, `timing2/run-amended.sh full` behind the cool-down watcher, when
  the `Projects/public/grugops` session is not running its full vitest suite.
- **Alternative, not QE's to take:** the owner or Architect/Design rules on whether thermal pressure ≥ 1 may be logged
  rather than discarded.
- **Stay in `In Review`.** The Orchestrator decides.

### Fences kept
- Nothing was committed, pushed, merged, fixed or self-signed.
- Untouched: `src/`, `../wt-ABC-177` (clean at `f81bf03c`), `plans/`, and processes this hop did not start.
- `scratchpad/t177` and the hop's launchers were removed; nothing is left running.
- `pending/qe-ABC-177-timing-2.md` and `claimed/qe-ABC-177-timing-2/` are left for the Orchestrator's close.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-177 (A8–A11 timing-2) | ADR-0046; owner …bfdc97e5 (AC), …b87c35b6 (foreign logged) | grugops/ABC-177 @ f81bf03c (from ff1e375f) | src/uci-session.test.ts | QE qe-ABC-177-timing-2: AC on every poll/run; A8 N8-LANE MET (H−B CPU −2.820 s [−2.840, −2.790], twin R 0.070 s; amended readout, foreign logged); full lane ×2 VOID on thermal pressure under another session's full vitest suite; NFR-008 not read; R-174-1 not discharged | PASS_WITH_GAPS on A1–A8/A12, A9–A11 OWED: QE-177-g MEDIUM → full stage only, re-dispatch when the foreign suite is idle, or owner/Architect thermal ruling | notes …24f216bf, …4263d981, …ef316298, …92bb0293 (amends …dbd4875c) |`
