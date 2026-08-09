---
id: 20260809T213846Z-software-engineer-observation-9cacd37b
kind: observation
by: software-engineer
at: 2026-08-09T21:38:46Z
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

# Gates exactly as they ran, and the three things this hop deliberately did NOT run

## Ran

- **unit** — `npm test` **439 passed (439) on 17 files**. The branch-tip baseline was 439/439 on 17,
  so the suite is unmoved, which is what a comment-only hop must show.
- **`src/legal.test.ts` alone** — `npx vitest run src/legal.test.ts` **31 passed (31)** before the
  edit and **31 passed (31)** after.
- **skip count** — **0**, by the AGENTS.md command
  (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`).
- **lint** — `npm run lint` exit **0**, 34 files, **2 infos**. Both are the pre-existing `biome.json`
  ones (schema-version mismatch, deprecated `recommended`) recorded at hop one against `main`. **No
  autofix pass was needed or run**, so 0 of 2 `self_fix_attempts` were spent.
- **typecheck** — `npm run typecheck` exit **0**.
- **build** — `npm run build` exit **0** (it is `tsc --noEmit` in this project, the same command as
  typecheck; named honestly rather than reported as a second signal).
- **perft fast lane** — 24/24, inside `npm test`.
- **reference-check** — `node tools/grugops/reference-check.js` reports **"No findings"** on both
  edited plans files.
- **`tsc --noEmit` on all three measurement trees** — exit 0 on each before any probe result was
  believed.

## Did NOT run, structurally rather than by omission

- **`PERFT_DEEP=1` (`A8`).** `src/moves.ts` is byte-identical at md5
  `6335b452fc21ffe2d0f902ecab930840` to the tree hop one ran the deep lane on, and this hop changed
  no executable line in any file. The deep lane's 32/32 therefore cannot have moved. Re-running it
  would have bought a 36-second restatement of hop one's number, and reporting hop one's 32/32 as
  though this hop had taken it would be worse. **No perft figure from this hop is claimed, because
  none was measured.**
- **`NFR-001` / `A10`.** Same argument, and the ticket's own method makes it exact: the primary
  instrument is a **count** of guard evaluations, and zero executable lines changed, so the count is
  unchanged by construction — 331 evaluations, 0 rejections, as re-derived at hop one. No throughput
  was measured at this hop and no clock figure is reported. `plans/nfr-catalog.md` was not read for
  numbers and not edited; no NFR target moved.
- **`NFR-005`.** `src/zobrist.ts` is untouched and `src/legal.ts` gains no executable line, so the
  per-node key cost is untouched by construction. The ticket says to state that structurally and not
  to re-run the key benchmark to "confirm" it.

## Cannot run, and it is pre-existing

- **test-integrity checker** — `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` still exits **2**, "cannot read the registry file". That is *could not run*, not a
  pass. **No registry file was created**: an agent may not self-author the justification that clears
  its own gate. `quality.test_integrity` is `warn`, and the gate's actual test-integrity step — the
  AGENTS.md skip-count command — reads **0** independently.
- **E2E** and **auto-UAT oracles** — `UNKNOWN - verify`. The E2E slot is unknown in AGENTS.md with no
  UI surface until `EPIC-006`, and `scripts/check-uat-oracles.js` is absent (there is no `scripts/`
  directory in this repository at all).

## Not changed

`npm install` not run; `package.json` and `package-lock.json` untouched; **no dependency change**. No
wall-clock assertion added to the suite — this project's standing rule. No perft position added.
