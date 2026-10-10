---
id: 20261010T191923Z-software-engineer-decision-abc142-mechanism-b41d7e02
kind: decision
by: software-engineer
at: 2026-10-10T19:19:23Z
verified_by:
confidence: high
refs:
  - ABC-142
  - ABC-042
  - QE-141-a
  - QE-093-e
  - package.json
  - .gitignore
  - src/cli.test.ts
  - tools/grugops/run-bounded.js
supersedes:
---

# SE `ABC-142`: the mechanism is vitest's built-in JSON reporter, written to `.test-results/last-run.json`

This note is hand-authored and unsealed.

- **Chosen.** `test` = `node tools/grugops/run-bounded.js 60000 vitest run --reporter=default
  --reporter=json --outputFile.json=.test-results/last-run.json`. It needs no new file, no
  dependency and no code. The argv passes through `run-bounded.js` untouched, so the wrapper's code
  is byte-unchanged.
- **Why a subdirectory.** `biome.json` lints root `*.json`, so a root result file would be read by
  `npm run lint`. `.test-results/` is outside every Biome include and every vitest include, and it
  is git-ignored.
- **One deviation, flagged and not engineered around.** The JSON reporter prints
  `JSON report written to <abs path>` once, after the summary, and no CLI flag removes it. The only
  zero-line route is a custom reporter file, which is outside the amended A5 fence. The literal
  "console output unchanged" stop condition is therefore off by this one line, and the ruling belongs
  to the Orchestrator or QE. Side effect: under `| tail -3` the path is the last line shown.
- **Rejected.** A retry flag (fenced out). `vitest.config.ts` reporters and `run-bounded.js`
  injection (both ruled out by the amendment).
