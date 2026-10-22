---
id: 20261021T152354Z-qe-e2e-observation-36ec80ab
kind: observation
by: qe-e2e
at: 2026-10-21T15:23:54Z
verified_by: 
confidence: high
refs:
  - ABC-188
  - grugops/ABC-188
  - grugops/qe-ABC-188
  - 66d6a2f1
  - 85b462f0
  - 2c29a603
  - ADR-0036
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - NFR-008
  - 96dc3fa3
  - 87d3897d
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
supersedes: 
seal: sha256:75af69896605a363a0e9c63b69a3b230e89014b4af85ae0cd5854c17f520d3f1
---

# ABC-188 QE: A1, A8 and A9 MET at 85b462f0. Gates green (59 / 1987, last-run success, skip-count 0). UAT waiver applies (0 production lines)

- **A1 MET.**
  - `git diff --name-only main...HEAD` lists the 4 Scope files and the Architect's 2 notes under `.grugops/context/arch-build-ABC-188/notes/`. Those notes are ignored per `QE-182-d`.
  - The code commits `5cd279a4..eb097a7b` list exactly the 4 Scope files.
  - The waiver form in AGENTS.md, `git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'`, prints nothing (rc 1). That holds over `main...HEAD`, and per commit for `98487c1e`, `d722a6b6`, `eb097a7b`, `66d6a2f1` and `85b462f0`.
  - No `.snap` file changed. `src/` and `biome.json` are byte-equal to `96dc3fa3`.
- **UAT: waived**, standing rule 2026-08-17, with 0 production lines. A waiver is not a signature.
- **A8 MET.**
  - The diff `-U0 main...HEAD` of the ADR is 25 `+` lines and 0 `−` lines, one hunk at `:472`.
  - The block `#### Ruling 2 widened — 2026-10-21 (ABC-188)` sits after the `ABC-163` block, under `### S1`.
  - It states (i)–(vi), the output change, and the rollback (revert `d722a6b6`).
  - It is consistent with the code:
    - (i) and (ii) match `changedLines` and the union walk;
    - (iii) matches the shim reading;
    - the "reproduce at `87d3897d`" pointer is right: `87d3897d` and `main` hold the same blob, `0407b581`.
  - **Retirement extent (the brief's test).** (iv) retires the by-hand `--name-only` check outright. The instrument now covers every case that check saw, with one exception: a production file git treats as binary (Q11c). See `QE-188-a`.
- **A9 / gates** at `85b462f0`, run one at a time, with `node_modules` symlinked to the main checkout:
  - `npm run lint` rc 0 (`Checked 116 files … No fixes applied.`);
  - `npm run typecheck` rc 0; `npm run build` rc 0;
  - `npm test` rc 0: 59 files, 1987 tests passed, equal to base;
  - `.test-results/last-run.json`: `success` true, 1987/1987, 0 failed, 0 pending, 0 todo, `runState` exited, `exitCode` 0;
  - skip count (AGENTS.md capture, heap 128): 0;
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, rc 0.
- **`NFR-008`:** 0 / 0 / 0. No timing at this hop.
