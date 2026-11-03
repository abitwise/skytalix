# arch-ABC-239 artifacts: `ADR-0067` (PROPOSED) and the reproducible tuner prototype

Architect/Design, task `arch-ABC-239`. Published as an observation (no gate ran, so not an artifact-ref).

- `memory-bank/50-decisions/ADR-0067-evaluation-weights-tuned-offline-by-a-logistic-fit-of-game-results-newton-on-cross-entropy-material-frozen-at-the-first-pull-and-a-value-identical-blend-of-every-half-first.md`: PROPOSED.
- `.grugops/context/arch-ABC-239/raw/proto/`: `README.md` (how to reproduce), `extract.ts`, `fit.ts`, `diag.ts`, `diag2.ts`, `job.sh`; `out/extract.json`, `out/fit.json`, `out/diag.json`, `out/diag2.json`, `out/data-files.txt` (manifest, sha256 `6e8d0ab0…f040cf`).
- Engine reference: `grugops/ABC-269` `b7a8fc3a` (`src/` tree `4e23078f`), scratch copy, deleted after. Data: PGNs at `main` `af15cbc9`.
- PREREG `…9ed1db11` (`ed922f3e`), addenda `…255e9bcf` (`acc97083`) and `…f8d36d73` (`a2bbdee0`), each committed before its run.
- Nothing is committed to `src/` or `tools/`. Scratch (61 MB position file, the E1 copy) is deleted.
