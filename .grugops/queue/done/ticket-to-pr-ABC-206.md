---
subtask: ticket-to-pr-ABC-206
role: software-engineer
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/ticket-to-pr-ABC-206/
width: 3 of 3
---

# Build ABC-206: faster search, identical answers

## Do
- Worktree `../wt-ABC-206` on `grugops/ABC-206` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build to the page's `## Design ruling` as three commits (i) leaf, (ii) captures-only quiescence, (iii) givesCheck — each value-identical and droppable. A1 differential (the Architect's probe scripts are a starting point) and A2 rows/count guards at each commit. Stay out of `engine.test.ts` and the five test files ABC-205 re-pins.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; perft deep lane if the page names it. **No timing readings** (A4 is QE's, alone). Any existing red outside the ruling → STOP to Architect.
- OD-206-1 is open with the owner: build all three pieces; the merge waits on his answer.

## Fences
- Only files the ruling names. No `package*.json`, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se206/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-206`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Delivered, no STOP, no page defect.** Branch `grugops/ABC-206` in worktree `../wt-ABC-206` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `268ff42a` (the merge base). Tip **`0d046948`**: `ee77a62d` (i) leaf, `5ff2a129` (ii) quiescence, `26dacbf6` (iii) givesCheck, then `0d046948` (notes). Not pushed, not merged. `main` moved to `af4a934c` during the build with no `src/` change, so the A1 base still holds; `main` was not merged into the branch. OD-206-1 is still open, and the merge waits on it.

| commit | A1 (vs `268ff42a`, 317 positions, 5 706 rows: move, score, depth, nodes, clock reads, purity) | A2 (depth 3, 285 074 positions, 11 137 359 moves) | `npm test` |
|---|---|---|---|
| (i) `ee77a62d` | `cmp` byte-identical | 0 mismatches (`hasLegalMove`, `leafEndReason`) | 62 / 2 041 |
| (ii) `5ff2a129` | `cmp` byte-identical | 0 mismatches (+ `legalCaptures`, ordered) | 62 / 2 043 |
| (iii) `26dacbf6` | `cmp` byte-identical; the corpus drives `givesCheck` 6 472× through LMR | 0 mismatches (+ `givesCheck`) | 62 / 2 045 |

**Gates at the tip:** lint clean; typecheck 0; build 0; `npm test` 0, 62 files, 2 045 passed (base 2 038), `last-run.json` success true / 0 failed / 0 pending; skip count 0; integrity "No findings.". Deep: `ENGINE_DEEP=1` legal.test.ts 37 ✓ and gameend.test.ts 47 ✓; `ENGINE_DEEP=1` engine.test.ts `-t "A3 (identity)"` 3 ✓ (no wall-clock row run); `SEARCH_DEEP=1` search.pvs-lmr.test.ts 29 ✓. **No timing reading taken** (A4, G6, G8, perft rate, `PUZZLE_DEEP`, `npm run perft` are QE's). Each count guard was mutation-checked red; each mutation left every value row green.

**Droppability:** reverting (iii) from the tip is clean (tsc, lint and lane files green). Reverting (i) or (ii) alone conflicts textually on adjacent insertions (`legal.ts`, the two test files, the `search.ts` import), but not logically. The veto fallback is the tip-down revert of (iii) then (ii).

Files (merge base to tip): `src/legal.ts` +76 −1, `src/gameend.ts` +18 −1, `src/search.ts` +15 −17, `src/engine.ts` +4 −4, `src/quiescence.ts` +4 −6, `src/legal.test.ts` +128 −3, `src/gameend.test.ts` +79 −2, `src/gameend.nfr.test.ts` +77 −3. Out of every fenced file (`engine.test.ts`, ABC-205's five, `moves/apply/perft/evaluate.ts`, `package*.json`).

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 2/2 by `readContext`, in `../wt-ABC-206/.grugops/context/ticket-to-pr-ABC-206/notes/`:
- decision `…9ca0557a`: the three commits, A1/A2 per commit, the byte-identical list, the files;
- decision `…fdb05652`: tip gates, guard mutation checks, droppability, `main` moved, a stale `gameend.ts` header line flagged (not edited).

### Trace row
| ABC-206 (ticket-to-pr-ABC-206) | the search runs faster with identical answers: one legal-move test per leaf, captures-only legality in quiescence, givesCheck without make/unmake | EPIC-008 | — | no ADR (ruling …e3ff760b; OD-206-1 open with the owner); NFR-001 no bound moves (leaf text stale, Security/NFR dated note); NFR-004 clock reads equal (A1); NFR-008 0 new files | grugops/ABC-206 @ 0d046948 (code ee77a62d, 5ff2a129, 26dacbf6)<br>src/legal.ts, gameend.ts, search.ts, engine.ts, quiescence.ts; tests legal/gameend/gameend.nfr; .grugops/context/ticket-to-pr-ABC-206/notes/ (2) | A1 5 706 rows byte-equal at each commit; A2 depth 3 0 mismatches; npm test 62/2045; ENGINE_DEEP + SEARCH_DEEP lanes green; skips 0, No findings. | owed (production lines): QE verdict signs | — | In Development → In Review (QE: A1 at tip, A4 width 1, G6, G1, perft, A6 once ABC-204 Done; merge waits on OD-206-1) |
