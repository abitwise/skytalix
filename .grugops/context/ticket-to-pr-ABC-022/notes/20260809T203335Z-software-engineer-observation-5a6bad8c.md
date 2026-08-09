---
id: 20260809T203335Z-software-engineer-observation-5a6bad8c
kind: observation
by: software-engineer
at: 2026-08-09T20:33:35Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/perft.test.ts
  - src/moves.enpassant.test.ts
  - AGENTS.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `A7`'s walk before and after, and every gate exactly as it ran

## `A7` — the reachable population is unmoved, and so is the en-passant move set

One OS process per tree, roots and `fast` depths **parsed out of `src/perft.test.ts` by the harness**
rather than retyped (the parse asserts it found exactly 6 roots and exits non-zero otherwise), and
every FEN **printed and re-parsed** before any verdict was taken:

```
                     BEFORE (0e247853...)   AFTER (6335b452...)
startpos    d4              206604                206604
kiwipete    d3               99950                 99950
position-3  d4               46256                 46256
position-4  d3                9738                  9738
position-5  d3               63910                 63910
position-6  d3               92016                 92016
TOTAL                       518474                518474
ep offered onto an OCCUPIED square   0                     0
ep moves offered ANYWHERE         4389                  4389
```

All six per-root counts identical, and the ep-onto-occupied count is 0 both before and after, which
is `A7` as written. The last line is **stronger than the criterion asks for** and is the reason no
over-rejection is possible in reachable play: the en-passant move **set itself** is unchanged, so
the fix removed nothing legal, not merely nothing counted. This is the eighth independent
reproduction of `518,474` on this project.

## Gates, exactly as they ran

- `npm install` — not run; **no dependency change**, `package.json` and `package-lock.json` untouched.
- **lint** — `npm run lint` exit 0 after **one** autofix pass on this role's own new file
  (`npx biome check --write src/moves.enpassant.test.ts`, 1 of 2 `self_fix_attempts` spent). The two
  remaining `infos` are `biome.json`'s schema-version mismatch and its deprecated `recommended`
  field: **pre-existing and identical on `main`**, verified by stashing this work and re-running
  (33 files / 2 infos with the work stashed, 34 files / 2 infos with it applied), not assumed.
- **typecheck** — `npm run typecheck` exit 0, run on the unfixed tree with the new test file present
  as well as on the delivered tree.
- **unit** — `npm test` **439 passed (439) on 17 files**. The before figure, **381/381 on 16 files**,
  was measured by running the suite on the tip rather than by subtraction.
- **skip count** — **0**, by the AGENTS.md command
  (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`).
- **build** — `npm run build` is `tsc --noEmit` in this project, i.e. the same command as typecheck;
  exit 0.
- **perft fast lane** — 24/24 inside `npm test`.
- **`A8` deep lane** — `PERFT_DEEP=1 npx vitest run src/perft.test.ts` = **32 passed (32)** in
  **36.55 s**, exact, zero tolerance. Run **BEFORE** hand-back, as `## Test notes` requires.
- **E2E** — `UNKNOWN - verify`. The slot is unknown in AGENTS.md and there is no UI surface until
  `EPIC-006`.
- **test-integrity checker** — `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` exits **2**, "cannot read the registry file". That is *could not run*; it is
  **NOT a pass** and it is not the exit-1 human-only short-circuit. **No registry file was created** —
  an agent may not self-author a justification that clears its own gate. The skip count itself is
  independently 0 by the AGENTS.md command.
- **auto-UAT oracles** — `UNKNOWN - verify`; `scripts/check-uat-oracles.js` is absent
  (there is no `scripts/` directory in this repository at all).
- **reference-check** — `node tools/grugops/reference-check.js` reports **"No findings"** on all
  three edited plans files.

## `A9`, mechanically

`git diff --name-only main -- 'src/*.test.ts'` is **empty**. `git status --short -- src/` reports
exactly ` M src/legal.ts`, ` M src/moves.ts`, `?? src/moves.enpassant.test.ts`. `git diff --numstat
main -- src/` is `6 2 src/legal.ts` and `24 12 src/moves.ts`, and of `src/legal.ts`'s eight touched
lines **every one is a comment line** — checked by filtering the diff for lines that are not
`+`/`-` followed by whitespace and `//`, not by reading it.
