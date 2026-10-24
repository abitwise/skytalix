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

## Result

**Built to the ruling, then STOP to Architect/Design: 3 deep-lane reds the ruling did not name were left unedited. OD-205-1's cell was left red and untouched.** Branch `grugops/ABC-205` in `../wt-ABC-205` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `f47b3429`. Tip **`4f650a45`**:
- `613f4548`: code and relation rows;
- `51997b7e`: the default-lane re-pins;
- `68be197f`: the quiescence deep pins;
- `4f650a45`: the notes.

Not pushed, not merged. The host was shared (load1 3.2–7.0; the ABC-212 SE and the ABC-206 Architect were running).

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 2/2:
- decision `…18a6a03c`: build, the 11 rows, the STOP;
- decision `…3050b787`: readings, the OD-205-1 conditions, G2, lanes, ABC-212 overlap.

### STOP (Architect/Design)
| # | row | reading | note |
|---|---|---|---|
| S1 | `transposition.test.ts` `A4` mate reuse [SEARCH_DEEP] | the pre-ABC-121 engine reaches depth 9 at 160 ticks (pinned 10); score still −29 992; depth 10 at 180 ticks | shipped `chooseMove` is unchanged (d11, −29 992); a node budget in disguise, so the fixture's depth property is lost |
| S2 | `search.pvs-lmr.test.ts` `A1` `search()` d5 drift [SEARCH_DEEP] | max 79 cp against the 75 cp level (position-6/e2d2, 56 → 135); 96.79% within 25 | base 51, scale-only 41, taper-only **83**: the taper drives it. An ADR-0026 level, not a pin |
| S3 | the same, `chooseMove` to d5 | max 79 cp; 97.33% within 25 | as S2 |

### Per criterion (the SE's share)
| crit | result |
|---|---|
| A1 | **green**, 8 pairs (4 g1, 4 e1); the scale = 1 mutant reds the 4 e1 rows |
| A2 | **green**: ending 65 > −2; middlegame 38 > −33; the eg = mg mutant reds the ending row |
| A3 | **green**: −111 vs base −31; −187 vs base −87. A3b 40 > 21; the gate-off mutant reds A3b only |
| A4 | **green**: mirror 0 mismatches over 184 + 20 + 37 new (queens on and off); ABC-083 A1–A6 green. G2 **MET**: 700.5 / 700.7 ns vs base 645.3 / 653.4 (+47 to +55 ns), worst 790.1, load1 3.2–3.6 |
| A5 | G1 **55/58** (≥ 54). G4 identity sweeps green. G9 levels ENGINE_DEEP 35/35. G6 **not read** (needs width 1 and ≥ 5 rounds; host shared): owed. G5/G8 not read |
| A6 | owed: QE (D, after ABC-204) |
| A7 | addendum exists (Architect); the owner report is the Orchestrator's |

### The 11 ruled rows (old → new)
| row | old → new | route |
|---|---|---|
| transposition A1 knight-g1 `w K` | 894 → 919 | re-pin |
| transposition A1 knight-g1 `w -` | 894 → 919 | re-pin (the pair is now equal at d5 943 and d6 936) |
| transposition A1 position-3 nodes | 1 325 / 1 523 → 1 357 / 1 529 | re-pin |
| transposition A5 perpetual nodes | 7 832 → 7 356 (f7f8, 0 unchanged) | re-pin |
| transposition A5 depth-3 score | −488 → −496 | re-pin |
| ordering A4 position-6 d2 | 8 887 / 4 419 / 3 871 → 8 095 / 4 722 / 3 993 | re-pin (A3 guard 49.33% ≤ 65%) |
| ordering G1 position-3 | 354 → 349 | re-pin (N3 re-planted reads 351) |
| pvs-lmr A4 `search()` | [19, b3f3] → [−7, b3f3] | **re-pin, not re-find**: still bites both variants in both shapes (−13/b3h3 fixed, −8/b3c3 deepened); lmr-ref faithful on the build |
| pvs-lmr A4 `chooseMove()` | [19, b3f3] → [−7, b3f3] | as above |
| engine ABC-170 A1 | kp-vs-k → `8/8/4k3/8/8/4P3/5K2/8 w - - 0 1` | re-picked (ADR-0028 d2): kp-vs-k ties e1d2 and e2e3 at 91. New: unique e3e4 on base (+7) and build (+15), depth 7 |
| quiescence A5 position-6 d1 | 10.957x vs 10x | **NOT moved (OD-205-1)**, red |

Deep, by rule: bare leaf 2 355 → 2 315 (c3d5). The oracle was re-run and equals `search()` and the pre-121 search: kiwipete 70 → 40 e2a6 (387 s), position-6 84 → 160 c3d5 (46 s).

### OD-205-1 conditions (ADR-0028 d1)
- 515 / 47 = 10.957x. ⌊1.5×⌋ = **16x**.
- The identity and oracle rows are green.
- Taper-only reads 9.26x, under 10x (scale-only 11.02x).
- The sortless-quiescence mutant reads 52.19x, above 16x.

**Gates:**
- lint rc 0; typecheck rc 0; build rc 0.
- `npm test` rc 1: 62 files, 2 054 tests, 2 053 passed, 1 failed (OD-205-1 only); `last-run.json` success false.
- Skips 0 → `No findings.`
- SEARCH_DEEP:
  - ordering 38/38;
  - search 57/57;
  - transposition 39/40 (S1);
  - quiescence 36/37 (OD only);
  - pvs-lmr 27/29 (S2, S3).
- ENGINE_DEEP: transposition 26/26, engine 60/60, levels 35/35.
- PUZZLE_DEEP 18/18 (55/58).
- `N8-LANE`: no new file; 25 rows in about 46 ms.

**Overlap with ABC-212:**
- `src/engine.test.ts` only, in disjoint hunks (212: RF-1, about 597–670; 205: the ABC-170 A1 fixture, about 1236). `git merge-tree` is clean.
- Semantic: the levels and engine ENGINE_DEEP rows read evaluate, so whichever branch merges second re-reads those lanes.

Files:
- `src/evaluate.ts`;
- `src/evaluate.king-mobility.test.ts`;
- `src/transposition.test.ts`, `src/search.ordering.test.ts`, `src/search.pvs-lmr.test.ts`, `src/engine.test.ts`, `src/quiescence.test.ts`;
- the 2 notes.

### Trace row
| ABC-205 (ticket-to-pr-ABC-205) | King safety scaled ×3 by the enemy queen; tapered king square (own endgame table); no castled bonus without shelter | EPIC-008 | — | ADR-0031 addendum 2026-10-24 (PROPOSED); OD-205-1 owed; NFR-005 G2 MET 700.5–700.7 ns; G6 not read | grugops/ABC-205 @ 4f650a45 (code 613f4548)<br>src/evaluate.ts; tests: evaluate.king-mobility, transposition, search.ordering, search.pvs-lmr, engine, quiescence; .grugops/context/ticket-to-pr-ABC-205/notes/ (2) | A1–A4 relation rows + 3 mutants red; lint/typecheck/build 0; npm test 2053/2054 (1 = OD-205-1); G1 55/58; deep lanes green but S1–S3; skips 0, No findings. | owed (production lines; QE verdict signs) | — | In Development (STOP: S1–S3 → Architect; OD-205-1 → owner; then G6 at width 1, QE D after ABC-204) |
