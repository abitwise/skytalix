---
id: 20260809T220316Z-software-engineer-observation-d9c1a9f9
kind: observation
by: software-engineer
at: 2026-08-09T22:03:16Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-001
  - NFR-005
  - AGENTS.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Gates exactly as they ran, and the four things this hop did NOT run — stated structurally, with no number carried from another hop

## Ran

- **unit** — `npm test` **439 passed (439) on 17 files**. The baseline this hop was handed was
  439/439 on 17 at skip 0; the suite is unmoved, which is what a comment-only hop must show.
- **the edited file alone** — `npx vitest run src/moves.enpassant.test.ts` **58 passed (58)**, before
  and after the edit.
- **skip count** — **0**, by the AGENTS.md command
  (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`).
- **lint** — `npm run lint` exit **0**, 34 files, **2 infos**, both the pre-existing `biome.json`
  ones (schema-version mismatch, deprecated `recommended`) recorded against `main` at hop one. **No
  autofix pass was needed or run**, so **0 of 2** `self_fix_attempts` were spent.
- **typecheck** — `npm run typecheck` exit **0**.
- **build** — `npm run build` exit **0**. It is `tsc --noEmit` in this project, the same command as
  typecheck, and is named honestly rather than reported as a second independent signal.
- **perft fast lane** — 24/24, inside `npm test`.
- **`tsc --noEmit` on all four measurement trees** — exit 0 on each, before any probe result was
  believed.
- **reference-check** — `node tools/grugops/reference-check.js` reports **"No findings"** on both
  edited `plans/` files.

## Did NOT run, structurally rather than by omission

- **`PERFT_DEEP=1` (`A8`).** The brief said a comment-only hop does not owe it and to say so
  structurally. `src/moves.ts` is byte-identical at md5 `6335b452fc21ffe2d0f902ecab930840` to the
  tree the deep lane was run on, and **this hop changed no executable line in any file** — proved by
  `cmp` on the comment-stripped file, not by reading the diff. The 32/32 therefore cannot have moved.
  **No perft figure from this hop is claimed, because none was measured**, and hop one's number is
  not restated as though it were mine.
- **`NFR-001` / `A10`.** Same argument, and the ticket's own method makes it exact: the primary
  instrument is a **count** of guard evaluations, and zero executable lines changed, so the count is
  unchanged by construction. No throughput was measured and no clock figure is reported.
  `plans/nfr-catalog.md` was not read for numbers and not edited; no NFR target moved.
- **`NFR-005`.** `src/zobrist.ts` and `src/legal.ts` are byte-unchanged at this hop, so the per-node
  key cost is untouched by construction.
- **The 131,072-state exhaustion.** Not re-run. The 447 / 100,801 / 43,200 figures remain BA/PM's and
  are carried as theirs; nothing in the comments I wrote states a count from that sweep.

## Cannot run, and it is pre-existing

- **test-integrity checker** — `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` exits **2**, "cannot read the registry file". That is *could not run*, **not a
  pass**. **No registry file was created**: an agent may not self-author the justification that
  clears its own gate. `quality.test_integrity` is `warn`, and the gate's actual test-integrity step
  — the AGENTS.md skip-count command — reads **0** independently.
- **E2E** and **auto-UAT oracles** — `UNKNOWN - verify`. The E2E slot is unknown in AGENTS.md with no
  UI surface until `EPIC-006`, and `scripts/check-uat-oracles.js` is absent — there is no `scripts/`
  directory in this repository at all.

## Not changed

`npm install` not run; `package.json` and `package-lock.json` untouched; **no dependency change**. No
wall-clock assertion added to the suite — this project's standing rule. No perft position added. No
new test file and no test row: a comment-only hop adds neither.
