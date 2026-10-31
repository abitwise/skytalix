---
id: 20261031T061829Z-software-engineer-observation-c117d509
kind: observation
by: software-engineer
at: 2026-10-31T06:18:29Z
verified_by: 
confidence: high: read back with git log and git diff --stat; recorded as an observation because an artifact-ref needs a §14-gate run id this hop does not have
refs:
  - se-ABC-245
  - ABC-245
  - EPIC-010
  - QE-242-b
  - SE-242-f
  - grugops/ABC-245
  - 7e81732e
  - 9c008db4
  - src/levels.test.ts
supersedes: 
seal: sha256:db7b8bbc91862ccd0bec949fa79d2aa69348edbea91466b82695e485f3c66592
---

# `ABC-245` branch, commit and files (observation; an artifact-ref needs a §14-gate run id, not held here): `grugops/ABC-245` @ `7e81732e`

- Branch `grugops/ABC-245` from `main` `9c008db4`; code commit `7e81732e` (`src/levels.test.ts` +60 −1). Not merged, not pushed.
- Test added: `src/levels.test.ts` › "ABC-242 — …" › "ABC-245 — a third occurrence whose earlier two lie more than 50 plies back" › "A1–A3: it scores exactly 0 with legal − 1 child searches at matches −98 and −94; base reads it otherwise".
- Header line 15: "DEFAULT (`npm test`, 46 tests)".
- Commands: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` ×3, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`; scratch plants via node + vitest on a scratch tree.
