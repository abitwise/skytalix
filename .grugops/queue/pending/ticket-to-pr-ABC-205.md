---
subtask: ticket-to-pr-ABC-205
role: software-engineer
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/ticket-to-pr-ABC-205/
width: 3 of 3 (beside ticket-to-pr-ABC-212 and arch-design-ABC-206)
---

# Build ABC-205: king safety with the enemy queen on + tapered king table

## Do
- Worktree `../wt-ABC-205` on `grugops/ABC-205` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page's `## Design ruling` and the PROPOSED ADR-0031 addendum: queen scale ×3, tapered king table (our own endgame half, as ruled — no third-party values), shelter gate; the relation rows A1/A2/A3/A3b appended to `src/evaluate.king-mobility.test.ts`; the 11 existing rows re-measured/re-pinned/re-found exactly as ruled. **Do NOT move the quiescence multiplier cell (OD-205-1)** — leave it red-documented or skip nothing; report its reading. Any other red is a STOP to Architect.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; G2 eval cost by the ruled method (note the host load); `PUZZLE_DEEP` (G1), `ENGINE_DEEP` only if the ruling names it for you (else QE's). No D reading (QE, after ABC-204).
- ABC-212 builds in parallel and touches `src/engine.ts` / level tests; name any overlap you see.

## Fences
- Only the files the ruling names. No `package*.json`, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se205/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-205`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
