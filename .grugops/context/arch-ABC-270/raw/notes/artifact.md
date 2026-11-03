# arch-ABC-270 artifacts: `ADR-0068` (PROPOSED), three dated lines (`ADR-0031`, `ADR-0064`, `ADR-0061`), and the reproducible E3a probe and D5 tuner diagnostic

- `memory-bank/50-decisions/ADR-0068-e3a-lands-as-structure-only-…md`, PROPOSED.
- Dated lines: `ADR-0031` § Addendum status; `ADR-0064` decision 10; `ADR-0061` § Consequences (eval-scale coupling).
- `.grugops/context/arch-ABC-270/raw/probe/`: `patch_k3.py`, `k3probe.ts`, `mainnodes.ts`, `batchA.sh`, `batchB.sh`,
  `batchC.sh`, `batchE.sh`, `README.md`, and `out/` (every figure quoted).
- `.grugops/context/arch-ABC-270/raw/probe/tune/`: `patch_tune.py` (derives `extract.ts` / `diag5.ts` from
  `arch-ABC-239`'s prototype), `job.sh`; outputs in `raw/probe/out/tune/` (`diag5.json`, `diag5.log`, `extract.json`).
- Published as an observation, because an artifact-ref needs a gate_run and no gate ran.
- The scratch copies sit outside the repository and are deleted at the end of the hop.
