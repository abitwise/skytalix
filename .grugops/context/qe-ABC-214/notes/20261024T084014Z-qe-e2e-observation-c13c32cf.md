---
id: 20261024T084014Z-qe-e2e-observation-c13c32cf
kind: observation
by: qe-e2e
at: 2026-10-24T08:40:14Z
verified_by: 
confidence: high (each check run as the page spells it, read from output)
refs:
  - qe-ABC-214
  - ABC-214
  - grugops/ABC-214
  - c4acf49f
  - bb8d4432
  - 306f1083
  - c487d89c
  - adf6af38
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A8
  - A9
  - A10
supersedes: 
seal: sha256:2e977ed9f220ef08d93566f3c2a949bb223a1a90fe69d6c6bdfb363248c0bb5e
---

# ABC-214 page checks A1-A10 re-run by QE: all hold (base c4acf49f, tip bb8d4432, merge 306f1083)

- A1: `npm pkg get private license` printed one object, `{"private": true, "license": "Apache-2.0"}`. The `package.json` numstat is `1 1`: `-"license": "UNLICENSED",` and `+"license": "Apache-2.0",`.
- A2: the lock numstat is `1 1`, the root entry under `packages[""]`. After `npm install --package-lock-only --ignore-scripts` (exit 0), `git status --porcelain` was empty.
- A3: `LICENSE` sha256 is `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`, 11358 B, 202 lines, 0 non-ASCII bytes. A fresh curl of the Apache URL today is byte-identical (`cmp`).
- A4:
  - line 1 is `skytalix` and line 2 is `Copyright 2026 Olger Oeselg`;
  - `Apache License, Version 2.0` appears on 2 lines and `MIT License` on 1;
  - each of the four kit paths appears once;
  - `@` 0, `/Users/` 0, non-ASCII 0.
- A5:
  - each of the seven strings is present;
  - the carve-out section's UPPER_SNAKE identifiers are exactly the seven, each once, and no other section has any;
  - all seven are still declared in `src/evaluate.ts`;
  - the first block opens at line 1, holds `not licensed under the Apache License, Version 2.0`, `CC BY-SA 3.0` and `See NOTICE`, and closes at line 23;
  - the next statement is the `import` from `./position.ts`.
- A5 base check and A6: `ts.transpileModule` with removeComments gives identical output, 9014 B, at `c487d89c`, base `c4acf49f`, tip `bb8d4432` and merge `306f1083`. The diff to `src/evaluate.ts` is `+2 -0`, both lines start with ` *`, and both sit at lines 21-22, inside the block.
- A8: the `src/cli.test.ts` numstat is `1 0`. It adds Scope 4's line directly after `expect(packaged.private).toBe(true);` in ABC-042 A10. The armed reading is in the plants note.
- A9: base to tip, `--name-only` lists exactly `LICENSE`, `NOTICE`, `package-lock.json`, `package.json`, `src/cli.test.ts` and `src/evaluate.ts`. `main` `adf6af38` to merge `306f1083` lists the same six. The diff over `tools data` is 0 bytes.
- A10: see the gates note.
