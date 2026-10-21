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
