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
