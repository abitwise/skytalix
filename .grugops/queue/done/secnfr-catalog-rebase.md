---
subtask: secnfr-catalog-rebase
role: security-nfr
ref: .grugops/context/secnfr-catalog-rebase/
branch: new grugops/secnfr-catalog-rebase from main (sha at spawn)
width: records only
---
# Security/NFR: catalog reference machine re-base (SEC-228-a) + whole-second confirmation
Owner words verbatim in `orch-2026-10-30a/…f4673b9f`.
- Re-base plans/nfr-catalog.md's reference machine to the Ubuntu Linux host oeselg-devl (AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, Node
  v26.12.1 — from qe-ABC-220's A14b record); the M3 / Node v26.11.x lines become dated history. Rule which existing "Verified by" readings
  were taken on the new reference (since 2026-10-28) and which stand only as M3 history; re-base no number you cannot source.
- AR-UCI-BUSY and NFR-004: mark the whole-second reading (< 22 500 ms) owner-CONFIRMED.
- SEC-228-b (NFR-009 "not built yet" stale) and SEC-220-c (NFR-011 load read via os.loadavg on Linux) while there.
Fences: plans/nfr-catalog.md + notes. No src/, tools/, data/, board. Never push/force/amend/rebase/merge into main. Host name is the
owner's label, fine to record; no filesystem paths. Run no builds/tests/node if a QE is timing; draft a seal otherwise.
Publish: notes (task `secnfr-catalog-rebase`), commit, `## Result` here, brief + claim to done/.

## Result

*Security/NFR, 2026-10-30, task `secnfr-catalog-rebase`; records only. Branch `grugops/secnfr-catalog-rebase` from `main` `5bc22858`. The catalog commit is `b81bdd26`, and the drafted notes and this brief move are on top. Nothing was run, built or timed (QE ALONE). **No level, bar, target or measured figure moved.***

- **`SEC-228-a`: CLOSED. The reference machine is `oeselg-devl`.**
  - Stack: AMD Ryzen AI 9 HX 370; 24 logical CPUs; Ubuntu 26.04.1 LTS; Linux 7.0.0-42-generic x86_64; Node v26.12.1; vitest 4.1.12 (lockfile). npm `UNKNOWN - verify`.
  - The Apple M3 / Darwin / Node v26.11.x lines are dated history. The rule is the 2026-10-10 runtime re-base's: labels kept, nothing converted; a row's next gate reads it on the reference.
  - Placed in: `NFR-004` and `NFR-005` (`Verified by`), `NFR-008` (stack re-declared), `AR-NFR004-A` (scope), and pointers in § `ABC-074`, § `ADR-0035` item 3 and `SEC-228-a`.
- **On the reference (since 2026-10-28):**
  - `NFR-004`: `G5` at 4 000 ms; `A6` and `A11` at 22 s.
  - `NFR-005`: `ABC-228`'s status, 8 / 10.
  - `NFR-008`: `G8` and `A12` readings.
  - `NFR-009`: the instrument green at 4 000 ms.
  - `AR-NFR004-A`: +1 ms and +1.0 ms.
  - `AR-UCI-BUSY`: ≈ 22 001.4 ms.
- **M3 history only:** `NFR-001`–`NFR-003`, `NFR-007`, `NFR-010` (figures), `NFR-011` and `NFR-012`. These are `UNKNOWN - verify` on the reference until their next gate (`SEC-REBASE-c`). `NFR-006` is a byte count and holds on any machine.
- **Whole-second reading: owner-CONFIRMED.**
  - `NFR-004`'s 22 s clause binds as < 22 500 ms and reads MET (`A11` max 22 001.0 ms). The strict-letter overshoot is kept as a fact.
  - `AR-UCI-BUSY`: the decline trigger is struck and kept, and a dated bullet is added.
  - `AR-NFR004-A` is unchanged.
  - Not extended to clause A, the per-level ceilings or ≤ 60 s.
- **`SEC-228-b`:** `NFR-009`'s "not built yet" is struck and kept, with a dated MET line. **`SEC-220-c`:** a dated line in `NFR-011` (on Linux, load via `os.loadavg()[0]`; no reading on the reference).
- **Observations:**
  - `SEC-REBASE-a` (INFO, the Orchestrator): `hostname` reads `oeselg-dev`, and the owner wrote `oeselg-devl`. The catalog uses his label.
  - `SEC-REBASE-b` (LOW, Architect/Design): is `NFR-008`'s load1 ≤ 8 gate still meaningful on 24 CPUs? The 10 s level did not move.
  - `SEC-REBASE-c` (INFO): seven rows have no reading on the reference.
- **Checks:**
  - 12 NFR rows were hashed before and after. Only `NFR-004`, -005, -008, -009 and -011 moved, by insertion or strike-and-keep.
  - Host-path scan: 0 hits.
- **Notes: drafted, NOT sealed** (sealing needs `node`). Run from the worktree root:
  `node .grugops/context/secnfr-catalog-rebase/raw/seal.mjs .grugops/context secnfr-catalog-rebase .grugops/context/secnfr-catalog-rebase/raw/seal-spec.json`
  It calls only context-io `admitAndAppend`, then `render` and `readContext`. It admits one decision and one observation, both stampless.
- **Not touched:** `src/`, `tools/`, `data/`, tests, ADRs, the board, the trace, tickets and `AGENTS.md`. Nothing was pushed or merged.
