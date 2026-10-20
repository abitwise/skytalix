---
subtask: qe-ABC-177-timing
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 1 (nothing else in flight; the Orchestrator holds width 1 until this ends)
---

# QE timing half of ABC-177: A8–A11 (QE-177-g)

`qe-ABC-177` passed A1–A7 and A12, but left A8–A11 OWED: the host was on battery. The owner has now connected the charger. At 00:12 +0300 the host read AC Power, load1 2.2, and no foreign vitest.

## Read first
- `.grugops/queue/done/qe-ABC-177.md`.
- Your timing note `…a4611b8d`.
- The pre-registration and instruments in `.grugops/context/qe-ABC-177/probe/`. They are fixed already; use them as registered.
- The ticket's A8–A11.
- The owner's AC rule `…bfdc97e5`.

## Do
- **A8:** N8-LANE on the one-file set `src/uci-session.test.ts`, with the 400 heap flag. The bar is ≤ 650 ms CPU.
- **A9–A11:** the full-lane base-vs-head twin.
  - Four arms, each in its own tree with its own `npm ci`.
  - Run only in a foreground-verified quiet window: 180 s, no foreign vitest, no `oeselg-labs/platform` process, AC power on every sample, load1 ≤ 8.
  - Record power, load1 and process count per run.
  - NFR-008 is ≤ 10 s. The target is ≤ 9.2 s.
- **Escalation, per the page:** over 9.2 s → an O3 note for Architect/BA/PM; over 10 s → the owner.
- **No admissible window:** if none opens in a reasonable time, or power drops to battery, mark it OWED again. Never estimate.

## Fences
- Scratch trees only, and remove them at the end.
- Do not touch `src/`, `../wt-ABC-177`, `plans/`, or any process you did not start. Keep forks low.
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:`, including a `kind: decision` that amends the verdict. Use the sanctioned writer if available.
- Append `## Result (timing)` to `.grugops/queue/done/qe-ABC-177-timing.md` (this brief + result) and write `.claim.md`, both uncommitted. Include:
  - the A8–A11 grades and readings;
  - the NFR-008 result;
  - whether R-174-1 is discharged;
  - the updated overall verdict;
  - a trace row.

## Result (timing) (qe-e2e, 2026-10-20 21:55Z): **A8–A11 OWED again.** AC held, but no quiet window opened. `NFR-008` NOT READ; `R-174-1` NOT discharged; verdict **unchanged: PASS_WITH_GAPS on A1–A7 and A12, timing OWED**

**Notes** (`.grugops/context/qe-ABC-177/notes/`) are hand-authored and unsealed: `scripts/context-io.js` is absent and
no `propose_note` tool was available.
- `…46beddf7`: the timing observation;
- `…51e0ae25`: artifacts;
- **`…dbd4875c`: the decision**, which amends `…ec9517a5`.

The evidence is in `probe/timing/`: `windows.tsv`, `batch{1,2}/`, `run.sh` and `SHA256SUMS`.

### What happened
- **P1, power: PASS.** `pmset` read 'AC Power' at 21:12:50Z (76 %, charging) and before every window (12/12).
- **load1** read 2.00–6.23, never above 8.
- **Arms:** all built before any window, so a passing window could have started the driver at once.
  - N8: B `ff1e375f` with its own `npm ci`; T = `cp -R B` (`diff -r` clean); H `f81bf03c` with its own `npm ci`.
  - Full lane: B, T, H and H2, each a `git archive` with its own `npm ci`. No symlinked `node_modules`. The file
    hashes match their commits.
- **P3, quiet window: FAIL, 12/12.**
  - `window.mjs` (registered, 180 s, 1 s polls) ran back to back from 21:15:04Z to 21:51:40Z.
  - Foreign polls per window, out of 181: 30, 171, 162, 69, 150, 162, 162, 107, **4**, 161, 173, 153.
  - Every foreign line was another Claude session's `oeselg-labs/platform/repos/homelab` work: `bats`, `docker`
    squid, `kubectl`/`flux` and `curl` egress probes, moving through phase branches 08-05 → 08-06. **0 lines were
    from this hop or repo.**
- **So no driver run was taken.** `lane174.mjs` 0 runs, sampler 0, readouts 0. Nothing was estimated.
- **Why it stopped:** after two batches of 6 windows (about 36 min) the other session was still running and had just
  opened a new phase, so I marked it OWED rather than hold width 1 on another session's schedule.

### Per criterion
| crit | grade |
|---|---|
| A1–A7, A12 | **MET** (carried from `qe-ABC-177`; not re-run) |
| A8 | **OWED.** `N8-LANE` not read: no quiet window |
| A9 | **OWED.** All four own-`npm ci` arms built, 0 runs |
| A10 | **OWED.** (i)–(iii) not read |
| A11 | **OWED.** No reading, so no escalation route fires (> 9.2 s → O3; > 10 s → owner) |

### `NFR-008` and `R-174-1`
- **`NFR-008` on `f81bf03c`: NOT READ.** The last admissible state is still `QE-174-b`'s NOT MET, 10.010 s.
- **`R-174-1`: NOT discharged.**

### Overall verdict
- **PASS_WITH_GAPS on A1–A7 and A12; A8–A11 OWED.** This is unchanged; only the cause moved.
- **`QE-177-g` stays MEDIUM.** New route: re-dispatch the timing half when the host is on AC **and** the
  `oeselg-labs/platform` session is idle or paused (owner's call).
  - Run `probe/timing/run.sh n8`, then `full`; the arms must be rebuilt first, as `…51e0ae25` describes.
- **Stay in `In Review`.** The Orchestrator decides.

### Fences kept
- Nothing was committed, pushed, merged, fixed or self-signed.
- `src/`, `../wt-ABC-177` (clean at `f81bf03c`), `plans/`, and processes not started by this hop were all untouched.
- The scratch trees (`scratchpad/t177`) were removed. User processes stayed at 423–442 (`ulimit -u` 2666).
- `pending/qe-ABC-177-timing.md` and `claimed/qe-ABC-177-timing/` are left for the Orchestrator's close.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-177 (A8–A11 timing) | ADR-0046; owner …bfdc97e5 (AC only) | grugops/ABC-177 @ f81bf03c (from ff1e375f) | src/uci-session.test.ts | QE qe-ABC-177-timing: AC 12/12, load1 2.00–6.23; 12/12 window.mjs 180 s windows FAILED on another session's oeselg-labs/platform work (foreign polls 4–173/181; 0 from this hop); 0 lane runs; A8–A11 OWED; NFR-008 not read; R-174-1 not discharged | PASS_WITH_GAPS on A1–A7/A12 (unchanged), timing OWED: QE-177-g MEDIUM → re-dispatch on AC + platform session idle | notes …46beddf7, …51e0ae25, …dbd4875c (amends …ec9517a5) |`
