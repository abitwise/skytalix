---
id: 20261019T150000Z-architect-design-decision-adr0008-addendum-heap-ceiling-two-shapes-command-borne-guarded-9c2f7a41
kind: decision
by: architect-design
at: 2026-10-19T15:00:00Z
verified_by:
confidence: medium
sealed: false
task: wave-2026-09-25
subtask: arch-ABC-173-adr0008
refs: [ABC-173, ADR-0008, ADR-0035, ADR-0040, ABC-144, ABC-152, ABC-042, ABC-119, ABC-109, ABC-146, NFR-008]
---

# ADR-0008 addendum 2026-10-19 (PROPOSED): the heap ceiling for `ABC-173`

This note was written by hand and is not sealed, because `scripts/context-io.ts` is absent from this install.
**The authority is the ADR text**, in `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`
§ ADDENDUM 2026-10-19. This note records only the choices. It cites the ticket's `## Scope`, its Pins-touched
table and its owner questions.

## Rulings

- **R1 — where the limit lives.**
  - `NODE_OPTIONS=--max-old-space-size=<flag>` goes on the lane command:
    - `scripts.test` and `scripts["test:watch"]`;
    - a prefix on every vitest command in `AGENTS.md`.
  - **The guard:** `globalSetup` → `tools/grugops/heap-guard.js`.
    - It runs in the main process and reads `heap_size_limit` there (`A5`).
    - Above the row it throws: exit 1, and no test runs.
  - **Rejected:**
    - a `package.json` script per lane (`A10`'s `added` and the bypass);
    - a re-exec in the config (an extra main process, and `A7` imports the config);
    - `.npmrc` (it replaces `NODE_OPTIONS` for every npm command, and `tsc` OOMs at 224 MiB);
    - a node options file (experimental, and it needs a flag);
    - `--max-heap-size` (not a documented Node option);
    - a `test.env` children row;
    - a single uniform row (`PUZZLE_DEEP`).
- **R2 — two shapes, chosen by the run's file count.**
  - **SUITE**, ≥ 2 files: `--max-old-space-size=128`, 224 MiB.
    9 isolates: wrapper 1, main 1, running workers 2, terminating workers 2 (reserve), children 3.
    Σ 2016.
  - **ONE-FILE:** `--max-old-space-size=400`, 496 MiB.
    4 isolates: main 1, worker 1, children 2.
    Σ 1984.
  - The guard provides the row to the workers (`heapRowMiB`).
- **R3 — `INPUT_DEEP` and `CLI_DEEP`.**
  - `INPUT_DEEP` uses one value: `NODE_OPTIONS="--expose-gc --max-old-space-size=400"`.
  - The `CLI_DEEP` child gets `[heapToken, entry, ...CHILD_ARGS]`, where `heapToken` is the last
    `--max-old-space-size=N` in the worker's own `NODE_OPTIONS`. `CHILD_ENV` stays `{}`.
- **R4 — the 2-executor definition holds unchanged.** `:3494` caps running files at `maxWorkers`, and
  `spawnSync` blocks the worker.
- **R5 — `N8-LANE`.**
  - It has no baseline, so there is none to refresh.
  - QE reads `ABC-173`'s narrow-set charge and `A9` with a twin in the QE hop, before the merge.
  - That twin R replaces the full-lane `F`. Per-set `F` values stay until their first capped reading.
  - The stack declaration gains the heap clause.

## Pins that move

- `A10`: the `test` and `test:watch` values;
- the `run-bounded.js` header quote;
- `N8_SPAWN` 27 → 28;
- `CLI_DEEP` deep +1;
- two comments;
- the `AGENTS.md` lines. `ABC-109` `A5` stays green by moving receipts to the command log.

**These stay:** `A7`, `V3`, `CHILD_ENV` `{}`, decision 7, `INPUT_DEEP` 34.

## Owner questions

- **OQ1:** accept the addendum.
- **OQ2:** count the terminating workers (two rows), or not (one row of 292 MiB, with a thin `PUZZLE_DEEP` margin).
- **OQ3:** the cap covers every vitest command.
