# arch-ADR-0060-reopen probe (scratch, reproducible)

- Base: `git archive <grugops/arch-ADR-0060-reopen HEAD> src package.json` (src equal to `main` `5ffbae25` / `0b73f51d`,
  no reverse futility) into a scratch directory outside the repository; deleted after the readings.
- `python3 patch_reopen.py <root>`: `arch-phase2-rebase`'s `patch_main.py` plus one knob, `pvMaxR` (applied at PV nodes
  after every other term: `if (pvNode) r = Math.min(r, PROBE.pvMaxR);`). Defaults leave every earlier form unchanged.
- `probe.ts`: `arch-phase2-p1`'s driver, unchanged. Door = main's flat `ABC-121` rule.
- `forms.sh`: the nine pre-registered forms (decision `…0481036d`, sealed and committed before any run).
- `job.sh` runs one probe; `stageA.sh` (d8 nodes, d5 drift both recursions) and `stageB.sh` (reach 47 000 / 20 000,
  mate floor d4 -> d5, zugzwang 7 rows, G1, other d8 roots, firing d6) batch them. Each batch ran as
  `flock <host-test.lock> timeout 300 bash stageX.sh <root> <out>`, each job under `timeout 300`; deterministic counts
  only, no timing.
- `sumA.py <out>` summarises stage A.
- Outputs: `out/<form>-<mode>[-<env>].out`; `out/R0-instrument-check.out` is the first run (door counts to the node).
