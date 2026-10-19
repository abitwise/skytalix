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
