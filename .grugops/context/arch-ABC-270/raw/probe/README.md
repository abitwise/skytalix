# arch-ABC-270 probe (scratch, reproducible)

- Base: `git archive HEAD src package.json vitest.config.ts tsconfig.json` at `main` `dc7dc15d` (`src/` tree `4cb84035`),
  twice: `<scratch>/k3/main` (unpatched) and `<scratch>/k3/base` (`python3 patch_k3.py <scratch>/k3/base`). Deleted after.
- PREREG `…117475f9` (commit `6bdd433b`) before batch A; addendum `…3f24d8a0` (commit `9b3859be`) before `matediag`.
- Forms (`setK3Form(egZero, queen)`): BASE (main), X (exposure endgame halves 0), Q (queen-on pairs 2 × base), QX (both).
- Each batch ran as `flock <host-test.lock> timeout 1500 bash batchX.sh <scratch>/k3 <scratch>/k3/out`, serial.
  Walls (lock waits included): A 73 s, B 78 s, C 148 s, E 15 s (a first attempt refused at load: `tools/grugops` was not
  archived, no test ran; then both copies got `git archive HEAD tools/grugops`). D5 (`tune/job.sh`) 13 s.
- Outputs: `out/A-*` (counts), `out/B-*` (eligibility, static), `out/C-*` (reports, `matediag`), `out/E-lane-reds.txt`
  (the 28 reds in the QX copy only; the BASE copy's 8 environment reds are files that need repository data outside
  `src/`), `out/exits.txt`, `out/tune/` (D5).
- **Void as a reading:** `out/C-*-fut.out`. Since `ABC-269`, `searchWithoutFutility` / `chooseMoveWithoutFutility` also
  turn `taper` off (the ladder rule), so the `fut` mode (copied from `arch-E1`) compares tapered + futility against
  untapered without futility. BASE reproduces `arch-E1`'s E1-drift figure (98.40 %, kiwipete/f3f4 494 → 555), which
  confirms it. No futility drift is read here.
- Deterministic counts only; no timing is read.
