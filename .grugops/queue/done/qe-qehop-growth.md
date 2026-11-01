---
subtask: qe-qehop-growth
role: qe-e2e
ref: .grugops/context/qe-qehop-growth/
branch: new grugops/qe-qehop-growth from main (worktree .claude/worktrees/qe-qehop-growth)
width: ALONE for timing. Only a records-only BA/PM hop (no vitest) may be beside you. Record load1 and foreign processes with every timing. Leave no process running.
---
# QE: T-QEHOP-GROWTH re-read (ADR-0035 B3; LOW)
## Why
The trigger fired: `find .grugops/context -path '*/notes/*.md' | wc -l` on main reads 4 272 (≥ 4 000). The bapm-tranche2-ruling disposition is a QE re-read hop, no ticket.
## Read
- ADR-0035 § Addendum 2026-10-12 (after ABC-154) B1–B4 and A1/A3; plans/nfr-catalog.md § "N8-LANE at ABC-105" (Closure; floors F 0.020 s CPU / 0.020 s wall).
- The method: qe-ABC-154's pre-registration (…b9a5c957) and its raw TSVs under .grugops/context/qe-ABC-154/; the set tools/grugops/qe-hop-integrity.test.ts.
## Do
- Pre-register (committed before any run) on qe-ABC-154's method, adapted only where the tree has moved; say every adaptation.
- Re-read the set's N8-LANE at main's tip (650 ms CPU budget per the catalog). Record the note count at the read.
- Grade MET / NOT MET / NOT READ per B3. MET: write the reading; Architect sets the next threshold (say what the arithmetic gives, do not write it into the ADR). NOT MET: it goes to the owner through the Orchestrator.
## Fences
- No edits under src/, tools/, data/, ADRs, catalog, board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Thermal stop: Tctl median > 85 °C. Scratch `qe-qehop/`.
## Publish
Sealed notes (task `qe-qehop-growth`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, QE/E2E. T-QEHOP-GROWTH grades MET (`ADR-0035` B3). Branch `grugops/qe-qehop-growth` (worktree `.claude/worktrees/qe-qehop-growth`, from `main` `37a93b76`). Pre-registration `833192d7` plus addendum 1 `8dfbabf5`, both before any run. Window and notes in `1714f0d4`. Ran ALONE; the only hop beside it was the records-only `bapm-ABC-248-close`. Nothing pushed, merged, forced, amended or rebased. No edit under `src/`, `tools/` or `data/`, and none to an ADR, the catalog or the board.**

- **The read.** `tools/grugops/qe-hop-integrity.test.ts` at `37a93b76`. It is the same blob as at `0f8036f9` (sha256 `140ed0dc…`, tool `cc0f4157`). Only the record grew: **4 272 note files** in each arm, the same as on `main`.
- **Method.** `qe-ABC-154`'s (`b9a5c957`), with 11 stated adaptations (`probe/preregistration.txt`). The main ones: a Linux port of `lane144b.mjs` and `gate.sh` (they cannot run on `oeselg-dev`); `node_modules/.bin/vitest`, not npx; heap 400; Tctl in place of thermal pressure (round discard at ≥ 100 °C, window stop at median > 85 °C); no power device; foreign vitest found by cwd; cutechess-cli added as a void condition. The readout self-test reproduces `qe-ABC-154` w1 line for line, apart from two labels.
- **Window 1** (gate 08:41:24–08:42:09Z, lane 08:42:09–08:42:20Z): 0 rounds discarded, n = 8, admissible. There is no w2.
  - **CPU:** H−B **+0.455 s (+0.440..+0.490)**. Twin **+0.010 s** (2.703 % of B 0.370 s; admitted by A1's one-tick floor only), non-zero signs +4/−3, p 1.000, **R 0.030 s**.
  - **Wall** (reported, not graded): H−B +0.270 s (+0.260..+0.310), twin +0.005 s, R 0.020 s.
  - **Host:** load1 0.49–0.61 before the scored runs (0.24–0.76 over the window). Tctl median 62.0 °C, max 68.1.
  - **Foreign processes:** none that voids, with 0 vitest, 0 cutechess and 0 platform on every run and in all 13 sampler rows. `top` showed `abtop` at 16–22 %, two idle `claude` sessions and `tailscaled`.
- **Grade at 650 ms CPU: MET.** The state is not paired with `qe-ABC-154`'s +0.380 s, because that ran before the re-base (SEC-REBASE-b).
- **Next threshold, for the Architect** (A3's slope 81.75 µs a note):
  - crossing ≈ **6 660** notes (≈ 6 230 from the upper end);
  - the 75 %-of-bound point or B3's same headroom gives ≈ **4 640–4 700**, which is 4–5 days out at today's 74–104 notes a day (A3 assumed 39);
  - the crossing is 19–32 days out.
- **Findings** (none blocking):
  - `QE-QHG-a`: the state depends on A1's floor.
  - `QE-QHG-b`: the first `oeselg-dev` twin R, 0.030 / 0.020 s. The F series question is the Architect's.
  - `QE-QHG-c`: B3's method names a macOS harness, and the port is in `probe/`.
  - `QE-QHG-d`: the same arithmetic re-fires within a week.
  - `QE-QHG-e`: `main` moved to `f88873d4` during the hop (records only, 4 275 notes).
  - `QE-QHG-f`: two clock slips in the pre-registration text; the commit times govern.
  - Lift clause: not fired.
- **Notes** (task `qe-qehop-growth`, contextRoot = worktree; 5/5 read back): decision `…4c3f34a2`, reading `…625483bc`, threshold `…21479114`, findings `…f0c3f8db`, artifacts `…4eb4840d`.
- **No process left running.**

### Trace row (10 cells, header order)

| T-QEHOP-GROWTH (no ticket) | Re-read of N8-LANE on tools/grugops/qe-hop-integrity.test.ts at 4 272 notes (ADR-0035 B3) | — | ADR-0035 § Addendum 2026-10-12 (after ABC-154) B3; ADR-0046 disposition (bapm-tranche2-ruling) | NFR-008 / N8-LANE 650 ms CPU: MET, H−B +0.455 s (+0.440..+0.490), twin +0.010 s, R 0.030 s, n = 8, load1 0.49–0.61, Tctl median 62.0 °C | none (read only; main 37a93b76, set blob bf0ea7d5) | QE window 1 admissible (A1 floor), 0 discarded; H 32/32 passed; readout self-test reproduces qe-ABC-154 w1 | n/a (no ticket) | — | QE MET (branch grugops/qe-qehop-growth, not merged; Architect sets the next threshold) |
