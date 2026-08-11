---
id: 20260812T082500Z-software-engineer-artifact-ref-diff-and-gates-2ea9c7f3
kind: artifact-ref
by: software-engineer
at: 2026-08-12T08:25:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-d23
  - abc017-d23-2026-08-12
  - ABC-017
  - ABC-016
  - ADR-0009
  - NFR-008
  - src/history-pane.test.ts
  - src/frame.test.ts
  - plans/traceability.md
supersedes:
---

# The diff, the commands, the gate results, and the board move requested

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Not a `finding`** — no
> `§14-gate#<id>` stamp exists for this hop and none was invented. Every number below was **run**,
> not transcribed.

## Branch and worktree

`grugops/ABC-017-history-pane`, in the `../cli-chess-ABC-017` worktree, rebased onto current `main`
by the Orchestrator. **Never `git checkout main`, nothing merged, nothing pushed, nothing deployed.**

## Files changed — TWO, both tests, ZERO test files added

| file | what |
|---|---|
| `src/history-pane.test.ts` | fixtures become `buildLengthCases()` / `buildAllCases()`; `A9` rebuilt inside the criterion and split into two `it`s; `A1`'s `= 8` tripwire split into its own `it`; `A3`'s two `not.toContain` and `A3`/`A4`'s `numbersOf` deleted; file docblock corrected |
| `src/frame.test.ts` | `A13` edit 1 — `import { STATUS_ROWS } from "./status-panel.ts"` replaces the local shadow; `A13` edit 2 — `statusStub` sized from `STATUS_ROWS`; the `A13` docblock, the file header and the `historyStub` docblock corrected where this edit falsified them |

`src/history-pane.ts` and every other production module are **byte-identical**. **Zero production
lines.** `N8-LANE`'s file count is unchanged at two — no test file was added, and none was removed.

`plans/traceability.md`: one row (`ABC-017`) edited in place, two cells appended to (`Tests`,
`Status`). 37 table lines before and after, all other table lines byte-identical by md5, the edited
row's pipe count 11 before and after, both appended strings asserted pipe-free and newline-free
before writing. `Code (PR/files)`, `UAT` and `Release` deliberately untouched.

## Commands run, and their results

| command | result |
|---|---|
| `npm test` | **734 / 734 on 26 files** (baseline was 732 / 732 on 26; +2 are the two `it` splits) |
| `npx vitest run --reporter=json … numPendingTests + numTodoTests` | **skip 0** |
| `npm run lint` | exit **0** (2 pre-existing biome `info`s, unchanged) |
| `npm run typecheck` | exit **0** |
| `npm run build` | exit **0** |

The same five were run **before any edit** and reproduced the Orchestrator's stated baseline exactly.

## Acceptance

**All 13 criteria met.** `A13` moves from MET IN PART to **MET IN FULL**: all three of its terms now
read delivered geometry — `renderBoard(...).length`, `ABC-016`'s exported `STATUS_ROWS`, this pane's
exported `HISTORY_ROWS` — with `= 23` as the tripwire (`src/frame.test.ts`, in the ply-sweep test)
and `<= 24` as the requirement in its own test, as `ADR-0009` cl. 5 asks. `src/render.ts` is not
modified and gains no row-count export.

**`A9` is met on its stronger reading**: its fixtures are built inside the criterion, so both the
byte-identical clause and the two non-mutation clauses assert over objects nothing has rendered.

## Board move requested

**`In Development` -> `In Review`.** The board is the Orchestrator's and `plans/board.md` was **not**
written. In Development would go 2/3 -> 1/3 (`ABC-027`), In Review 1/3 -> 2/3 (`ABC-019`,
`ABC-017`) — stated as the consequence, not taken.

## Flagged, not taken

- **`HISTORY_COLS` stays at 21.** Not widened, not guarded, and I do not disagree with the ruling.
  See the `## Test notes` judgment note for the one measured point offered to whoever homes it.
- **`A6`'s `not.toContain(1)` kept** although `## Test notes` lists it — implied only on the third
  anchor, live on the other two. Reasoning in the same note.
- **BA/PM's 8.2 ms rebuild figure is warm steady state**, not what a test file pays; corrected in
  the measurement note. Its conclusion — `N8-LANE` does not move — holds and is re-derived from the
  corrected figure.
