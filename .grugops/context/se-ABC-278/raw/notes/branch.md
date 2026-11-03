# SE artifact for ABC-278: branch `grugops/ABC-278`, code commit `d7c0b3ce`, not pushed, not merged

- **Branch:** `grugops/ABC-278`, from `main` `361a5af3`. Claim commit `03e2f3f8`, code commit `d7c0b3ce`. The records commit (notes, Result, queue moves) follows it.
- **Files:**
  - `tools/grugops/records-path-check.js`: `--text`, `.xz`, foreign-argv shapes c to f, home lookahead, `unquote` TAB strip and export, `homes()` with the account home, header updated.
  - `tools/grugops/records-path-check.proof.js`: 23 new rows, 18 existing rows unedited.
  - `memory-bank/70-runbook.md`: one line.
  - `.grugops/context/se-ABC-278/raw/`: `fa-measure.mjs` with its output, plus the seal script and spec.
- **Tests added:** ABC-278 A1 (4 rows), A2 (3), A3 (7), A5 (4), A6 (2), A7 (3).
- **Commands:**
  - `node --test tools/grugops/records-path-check.proof.js`
  - `npm run lint|typecheck|test|build`
  - `node tools/grugops/records-path-check.js --base main`, plus `--head main` and the `541ddf45` range
  - `node .grugops/context/se-ABC-278/raw/fa-measure.mjs 361a5af3`
- **Remaining:** the board move from In Development to In Review is left to the Orchestrator. QE verdict.
