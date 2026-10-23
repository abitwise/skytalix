---
id: 20261023T220736Z-software-engineer-observation-f2d7bc56
kind: observation
by: software-engineer
at: 2026-10-23T22:07:36Z
verified_by: 
confidence: high: commands run as stated; host not quiet, no wall-clock reading
refs:
  - ABC-212
  - EPIC-004
  - ADR-0045
  - ADR-0044
  - NFR-004
  - NFR-008
  - 8e101313
  - c735577f
  - grugops/ABC-212
  - arch-design-ABC-212/20261023T215005Z-architect-design-decision-d2c68ace
  - arch-design-ABC-212/20261023T215005Z-architect-design-observation-2146d8c6
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:31090379ed1055569f488174dbbba4821b53d5b8f94717aac702bead98b1a510
---

# ABC-212 SE evidence: red-first, plants P1–P5 + the two clamp plants, gates, A12 readings

Worktree `../wt-ABC-212`, own `npm ci --ignore-scripts`. Host not quiet (load1 6–10, two Architect hops running); no wall-clock figure here is a reading. Raw files: scratchpad `se212/`.

## Base and head
- Base `c735577f`: `npm test` rc 0, 62 files, 2 038 passed.
- Production change alone, before any test edit: 19 red. 11 are the licensed pins, 8 are unlicensed (STOP note).
- Head `8e101313`: `npm test` rc 1, 62 files, 2 057 tests: 2 049 passed, **8 failed = exactly the 8 unlicensed rows**. `.test-results/last-run.json`: `success` false, `numFailedTests` 8, `numPendingTests` 0, 62 results. 0 new files; 19 new rows.

## Red-first (head tests over base `src/` production files)
- `levels.test.ts`: file fails at collection (`LEVELS[6]` undefined in the clause-B describe scope).
- `engine.test.ts`: 1 red (`HARD_CEILING_MS` toBe 32 000).
- `uci-session.test.ts`: 13 red (4 `max 7` pins + all 9 new A9 rows).
- `startup-questions.test.ts`: 11 red (the `:36` text + 4 new A8 rows).
- `cli.test.ts`: 3 red (A2 re-pin, new A6, new A7).

## Plants at head (one at a time, restored, `cmp` verified)
- P1 `LEVELS[7].budgetMs` 3 000 → ABC-212 A1 values row + ordering row red.
- P2 clamp at 5 000 → A9 bare `go` at 7, `movetime 60000`, `wtime 600000`, and the 0/8 rows red (level-6 bare `go` stays green: 5 000 = its budget). A4 level 7 is ENGINE_DEEP (QE).
- P3 `max 5` → all 4 `max 7` pins + new A9 `uci` row red.
- P4 `DEFAULT_LEVEL` 7 → `cli.test` A2, ABC-174 A2/A3, A8′ default row red.
- P5 words 1–5 → A3, A3 (extended), A5 usage, ABC-212 A6, refusal-advert row red.
- RF-1 no clamp → 4 red, `80000 > 48000`. R1 no level clamp → R1 red, `68800 > 38400` (both = Architect's probe).

## Gates
- `npm run lint` rc 0; `npm run typecheck` rc 0; `npm run build` rc 0 (`dist/engine.js` 32_000; `dist/` ignored).
- Skip count 0; `test-skip-integrity.js` → `No findings.`, rc 0.
- `CLI_DEEP` 11/11 rc 0; `UCI_DEEP` 5/5 rc 0. `ENGINE_DEEP` not run (QE's, A4).

## A12 readings (virtual clock, step `floor(G/30)`)
- Bare `go` 7: 32; 6: 33; `movetime 60000`: 32; `movetime 1000`: 33; `wtime 600000`: 32; `depth 3`: 5.
- **Page tension:** A9's step G ÷ 30 with `time ≥ G` needs at least 31 readings, so A12's "≤ 30 readings" cannot hold literally. Built to A9; the cost is ~2 readings over. Architect/BA-PM to re-word one of them.
