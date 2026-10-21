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
