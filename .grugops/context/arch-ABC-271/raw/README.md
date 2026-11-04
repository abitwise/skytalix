# arch-ABC-271 probe (scratch, reproducible)

- **Base.** Each copy is `git archive HEAD src package.json vitest.config.ts tsconfig.json tools/grugops biome.json` at `main` `ac55ddf6` (`src/` tree `8adb0a18`), into `<scratch>/arch-ABC-271/`:
  - `main` (unpatched) and `main2` (unpatched, the G2 control);
  - `base` (`python3 scripts/patch_e4a.py <copy>`);
  - `cand` (the same patch over `26d06118`'s `src/evaluate-params.ts`);
  - `lane` (`base` with the probe form defaulting to H, for batch E).
  - All are deleted after the runs. `node_modules` was symlinked into `main` and `lane` for batch E only, and removed after.
- **Order.** The PREREG `…eeb25cc6` was committed at `029533f0` before batch A. The addendum `…3a9eba86` was committed at `904b3fff` before batch D.
- **Running.** Every batch ran under `flock <host-test.lock>`, serially: A, B, D, G, F, C, E. S2 did not run, because H held E4–E6 and choice rule 3 did not fire. Host time was about 3 min of runs in all; batch A waited about 10 min for a foreign lock holder.
- **Script versions.** `scripts/e4aprobe.v1.ts` (sha256 `81fe7385…`) ran A and B. `scripts/e4aprobe.ts` (v2, `4180525d…`, which adds only `rel2`) ran D, F and C. The modes read by F and C are byte-identical between the two versions.
- **Outputs.**
  - `out/A-*`: counts;
  - `out/B-*`: eligibility;
  - `out/D-*`: E3's failure classes;
  - `out/G-*`: G2, two sessions;
  - `out/F-*`: the firing figure;
  - `out/C-*`: reports;
  - `out/E-lane-summary.md`: the lane reds. The JSON reports carried host paths and are not kept.
- Host paths are placeholders.
