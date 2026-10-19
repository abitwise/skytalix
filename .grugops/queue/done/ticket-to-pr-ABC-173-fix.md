---
subtask: ticket-to-pr-ABC-173-fix
role: software-engineer
ticket: ABC-173
branch: grugops/ABC-173 @ 840ebbf7
worktree: ../wt-ABC-173
---

# Close QE-173-a (MEDIUM) and QE-173-b (LOW): test-only rows

## Background

`qe-ABC-173` returned PASS_WITH_GAPS. Read `.grugops/context/qe-ABC-173/notes/…e81b5c27` and `…3d7a91c4`.

- **QE-173-a.** No automated row pins `heap-guard.js`'s `ROWS_MIB` values or its shape choice. The mutants G03, G06, G08, G09, G10 and G11 survive every lane as written, so a SUITE run at 9 × 496 MiB would stay green.
- **QE-173-b.** The A6 static row misses two cases: the underscore flag spelling `--max_old_space_size=`, and a spread `env` key.

## Do

Add rows to `src/cli.test.ts`, or to a new `*.test.ts` file if that is cleaner. They must:

1. **Pin the values.** Assert `ROWS_MIB` and `FLAGS_MIB` against the addendum table: SUITE 128 → 224, ONE-FILE 400 → 496. Also assert that 9 × SUITE and 4 × ONE-FILE are each ≤ 2048.
2. **Pin the shape choice and the comparison.** Call the guard's decision function directly, in-process, with fake `getPaths` counts (0, 1, 2, many) and fake heap limits. Cover these cases:
   - 1 file → ONE-FILE.
   - ≥ 2 files → SUITE.
   - A limit equal to the row passes; row + 1 is refused.
   - 0 files, or a missing API, throws.
   - The row provided to workers equals the chosen row.

   If the guard does not export a pure decision function, you may refactor `tools/grugops/heap-guard.js` to export one. Behaviour must stay identical; that file is tooling, not `src/`. Say exactly what you changed.
3. **Kill the surviving mutants.** Each of G03, G06, G08, G09, G10 and G11 must turn the new rows red. Use QE's specs at `.grugops/context/qe-ABC-173/probe/` on scratch copies.
4. **Widen the A6 static row (QE-173-b).** Catch `--max_old_space_size=` and a spread `env`. Show that each planted fixture turns the row red.

## Gates

- `npm test` as now spelled. `last-run.json` must show `success: true` with the full count.
- Integrity at skip 0.
- `CLI_DEEP` (11) and `PERFT_DEEP` (32), each with its prefix.
- Both coverage lines once each.

## Fences

- No timing readings. A9 and N8-LANE stay owed for Security/NFR.
- Do not touch `src/` production files, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-171`, `../wt-uat-ABC-171`, or any process you did not start.
- Never push. Never merge.

## Handoff

Write `.grugops/queue/done/ticket-to-pr-ABC-173-fix.md` and `.claim.md` in main's working tree, uncommitted. Include:

- the tip;
- the rows added, with the mutants each one kills;
- any change to `heap-guard.js`;
- the gates;
- the production-lines measurement;
- a trace row.

---

## Result (software-engineer, 2026-10-19)

- **Tip:** `9c97dd23` on `grugops/ABC-173`, in `../wt-ABC-173`, one commit on top of `840ebbf7`. Not pushed and not merged.
  - 2 files, +158/−15: `src/cli.test.ts` (test rows only) and `tools/grugops/heap-guard.js` (export refactor).
- **No timing readings.** `A9` and `N8-LANE` are still owed to Security/NFR. vitest's own `Duration` line was not recorded.
- **Notes:** none written to `.grugops/context/`. `scripts/context-io.ts`, WF16's only sanctioned writer, is missing
  from this install, and WF16 says "stop" rather than hand-write that path. The typed content is below instead:
  decision D1, artifact-ref R1, observations O1 and O2. Refs: `ABC-173`, `QE-173-a`, `QE-173-b`, `ADR-0008` addendum
  2026-10-19, `…e81b5c27`, `…3d7a91c4`.

### D1 (decision): `heap-guard.js` exports `admit`, and its behaviour is identical
- **New:** `export function admit(project, heapStatistics)`. It holds the whole decision that used to sit in `setup`:
  the `getPaths` check, the file count, the shape, the row, the flag, the `limitMiB > row` refusal and
  `project.provide("heapRowMiB", row)`. The only difference is that it reads `heapStatistics.heap_size_limit`, where
  `setup` used to read `v8.getHeapStatistics().heap_size_limit`.
- **`setup` (the default export)** keeps its `isMainThread` throw and then calls `admit(project, v8.getHeapStatistics())`.
- **Why it is identical:** the same checks, the same order apart from when the heap statistics are read (a pure read
  with no side effect), the same messages, and one `provide`.
- **vitest:** `loadGlobalSetupFile` uses `m.default` when it exists, so the named `admit` export is ignored there
  (`cli-api.CnMVyzaz.js:9346-9362`).
- **Mutant patterns:** every QE G-pattern still matches exactly once, so QE's spec runs unchanged.
- **Control** on the refactored guard: `OF` and `S128` pass; `UNS`, `UNO`, `S400`, `O450` and `O500` are refused; `DL`
  passes 1924/1924. That is QE's control outcome on every battery that was run (`SF1` was not re-run).

### R1 (artifact-ref): rows added in `src/cli.test.ts`, `ABC-173` block
| row | what it pins | mutants it kills (battery `A173`) |
|---|---|---|
| `A5 — ROWS_MIB and FLAGS_MIB are the addendum's table…` | `ROWS_MIB` = {suite 224, oneFile 496}; `FLAGS_MIB` = {128, 400}; both frozen; 9 × 224 = 2016 ≤ 2048; 4 × 496 = 1984 ≤ 2048 | G10, G11 |
| `A5 — the guard's shape…` | 1 file → 496; 2, 3 and 120 files → 224. Checked at the row and at 64 MiB. The provided entries are exactly `[["heapRowMiB", row]]` | G01, G02, G03, G05, G06, G08, G10, G11 (G01/G02/G05 refused at load) |
| `A5 — the guard's comparison…` | At each shape (1, 2 and 120 files), row + 1 MiB and row × MiB + 1 B are refused with the shape's `NODE_OPTIONS=--max-old-space-size=<flag>` and nothing is provided; 4192 MiB is refused. The equal limit is admitted in the shape row | G03, G06, G07, G09, G10, G11; G04 (refused at load, and the equal-limit case) |
| `A5 — the guard cannot look, so it refuses…` | 0 files; `getPaths()` returning a non-array; no `getPaths`; no `vitest`; no project. Also, `setup` throws "off the main thread" when called in the worker | G12 (main-thread check dropped; extra, mine) |
| `A6 (static)` (widened) | The new helper `childConstructionFaultsOf`. Faults: a heap flag `max[-_]old[-_]space[-_]size` or `max[-_]heap[-_]size` in argv; a spread in argv; a spread in options; an `env` key read by its name (so a quoted or computed-string key counts). In-memory plants give faults `[0, 1, 1, 1, 1, 1]` (clean, dash flag, underscore flag, `env`, `"env"`, `...{ env }`); the real two calls give `[]` | A04 (spread `env`), A05 (`--max_old_space_size=4000`); A01, A02 and A03 (A03 now red in the row itself, not only by lint) |

- **Every one of QE's targets turns red:** G03, G06, G08, G09, G10, G11, A04 and A05.
- **Full run on scratch** (a worktree at `840ebbf7` plus these two files, removed afterwards), using QE's
  `probe/genspec.mjs` and `probe/mut.mjs` verbatim with only `WT`/`OUTJ` repointed:
  - G01–G11, G12, A01–A06: **18 of 18 KILLED**.
  - CONTROL-OK.

### O1 (observation): gates at `9c97dd23`, each as `AGENTS.md` spells it, with `NODE_OPTIONS` and `*_DEEP` unset first
| lane | exit | result |
|---|---:|---|
| lint / typecheck / build | 0/0/0 | `Checked 116 files… No fixes applied.` |
| `npm test` | 0 | 59 files, **1924/1924** (1920 → 1924, +4 A5 rows); `last-run.json` `success: true`, `numTotalTests` 1924, failed 0, pending 0, todo 0 |
| skip count / integrity | 0 / 0 | 0 / `No findings.` |
| `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 …cli.real-engine.test.ts` | 0 | **11/11** |
| `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 …perft.test.ts` | 0 | **32/32** |
| Coverage (`--coverage`, flag 128), run once | 0 | 1924/1924; All files lines 99.23 % |
| Coverage `src/**` (flag 128), run once | 0 | 1924/1924; All files lines 95.74 % |

- **O2 (observation, pre-existing):** the `src/**` coverage line prints `Failed to parse …/src/puzzle-suite.baseline.json.
  Excluding it from coverage.` with `PARSE_ERROR`, and still exits 0. It reproduces on the unmodified `840ebbf7` (scratch
  worktree, 1920/1920). This diff did not cause it. INFO only.
- **Scratch:** the `src/**` coverage line was also run twice more, on scratch and in `../wt-ABC-173`, only to find the
  `PARSE_ERROR` source. The gate reading is the first run above.

### Production lines
- `git diff --name-only 840ebbf7 9c97dd23 | grep -v '\.test\.ts$' | grep '^src/'`: **0 files**.
- `git diff --name-only $(git merge-base main 9c97dd23) 9c97dd23 | …` (from `68bbf33f`): **0 files**.
- The UAT waiver still applies.

### Not done / left to the Orchestrator
- `plans/board.md` and `plans/traceability.md` are untouched.
- The pending brief stays in `pending/`.
- `QE-173-c` through `QE-173-g` are out of this brief's scope and unchanged.
- `QE-173-g` still stands: whichever of `ABC-171` and `ABC-173` merges second re-runs every lane on the combined tree.

### Trace row (for the Orchestrator to apply)
`| ABC-173 fix (QE-173-a, QE-173-b) | heap-guard.js exports admit(project, heapStatistics), behaviour identical; src/cli.test.ts ABC-173: 4 A5 rows (table values + sums, shape 1/2/3/120 files, provided row, equal / +1 MiB / +1 B comparison, cannot-look refusals, setup off main thread); A6 (static) widened (underscore heap flag, spreads, quoted env) with in-memory plants; Software Engineer ticket-to-pr-ABC-173-fix | 9c97dd23 on grugops/ABC-173 (from 840ebbf7) | ADR-0008 addendum 2026-10-19; QE …e81b5c27, …3d7a91c4 | NFR-008 (A9 + N8-LANE owed to Security/NFR) | 0 production lines under src/; default lane 1920→1924 | npm test 1924/1924 success true; skip 0, No findings.; CLI_DEEP 11; PERFT_DEEP 32; coverage ×1 each green; G01–G12 + A01–A06 18/18 killed incl. G03 G06 G08 G09 G10 G11 A04 A05; no timing taken | Security/NFR: A9 + N8-LANE before merge | done file ticket-to-pr-ABC-173-fix (context-io absent; no context notes) |`
