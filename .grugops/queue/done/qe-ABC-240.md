---
subtask: qe-ABC-240
role: qe-e2e
ticket: ABC-240
ref: .grugops/context/qe-ABC-240/
branch: grugops/ABC-240 @ 220ab978 (code 7913499d; base main 0e0ef856); add QE commits on a new grugops/qe-ABC-240 from it
width: ALONE (timing reads)
---

# QE ABC-240: verify A1–A5 independently at the tip; QE's interleaved A3 decides

## Read
- The ticket; SE notes `se-ABC-240/…626a3c3a`, `…79fe0aa4`, `…ba9b4b1f`, `…78815fa3`; the Architect's cut-6 ruling
  `arch-ABC-235/…7fc1b90c`, `…eebca902`; how qe-ABC-235 ran the same reads (`qe-ABC-235/…078c1c09`, `…c575d703`).

## Do
- PREREG first, sealed and committed before any timed run, as qe-ABC-235 did.
- A1 re-run at the tip vs base `0e0ef856`, one process at a time. Rule on the unpruned doors (depth 2 plus the SE's
  depth-5 sample of 264 rows). Say whether a midgame depth-5 sample is owed, since this ticket touches search.ts and quiescence.ts.
- A2: re-run the oracle rows and the ENGINE_DEEP walk; plant one fault yourself and see it go red.
- A3 (decides): 5 interleaved runs per board per build at 3 000 ms on kiwipete, position-6 and start; ≥ 1.03× on two
  boards and ≥ 1.00× on the third. Report per item if cheap. The SE's 7.6–11.7 % is above the Architect's ~5.6–7.8 %
  bound: say whether your reading confirms or narrows it.
- G6 (5 interleaved runs, median, floor 6), G1, G5, G7, G8, G9; gates and the deep lanes one file at a time (with the heap
  flag the guard needs).
- Host: before and during every timed run, `pgrep -x cutechess-cli` must be empty and `pgrep -f "[/]vitest"` must show no
  foreign vitest. Otherwise void the pair and wait-clear. Record load1 and Tctl.

## Fences
- No src/, tools/ or data/ edits. No games. Never push, force, amend or rebase. Never merge into main. No board edits.
  Linters only via `npm run …`; **never a bare `npx`**. **No host paths in any commit**, intermediate ones included.

## Publish
- Seal notes (task `qe-ABC-240`) with `at` from `date -u`: PREREG, readings, verdict (PASS / PASS_WITH_GAPS / FAIL).
  Commit on your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-30, QE/E2E. Verdict PASS: mergeable as value-identical (S2). Under Test note 3, this verdict signs UAT.**
- **Branch.** `grugops/qe-ABC-240` @ `2b74c0d3`, from `grugops/ABC-240` `220ab978`. Not merged, nothing pushed, no `src`,
  `tools` or `data` edit, no game, no board edit.
- **One run**, pre-registered in `…e7b79773` and sealed in `9307d153` before any timed run. No reading repeated, 0 pairs
  voided.
- **Notes.** Decision `…e7b79773` (PREREG); observations `…9ad36454` (timing), `…4125866e` (A1, the door ruling, A2)
  and `…48d23dbc` (gates); decision `…19068f9d` (verdict). Sealed with the plugin's `admitAndAppend`, through
  `handleProposeNote`, rooted at the QE worktree. `readContext` reads back 5.

**A1 MET.** 6 021 rows, base `0e0ef856` = tip byte for byte, 0 impure, sha256 `812f86ae…bd000` (the SE's). Run one process
at a time, 8 shards.

**Ruling on the unpruned doors: depth 2 ACCEPTABLE, and no midgame depth-5 sample is owed.**
- The depth-5 sample of 264 rows is equal (`63173dde…`, the SE's).
- A midgame INFO supplement is equal: `searchWithoutPruningOrQuiescence` at depth 4 on the six perft roots, and
  `searchWithoutPruning` at depth 3 on startpos and position-6, 8 rows.
- The doors' code is unchanged, and the two functions they reach are identity-equal on the 285 074-node walk.
- Depth 5 on the midgame costs too much: 62 s for one door at depth 3 on kiwipete.

**A2 MET.** P1 and P2 are green on the `ENGINE_DEEP` walk, and C1–C4 are green and read against the ticket. QE's own
plant (shared output, C4, in a scratch copy) went red on 19 rows, the C4 row among them.

**A3 MET (decides).** 5 interleaved runs per board per build at 3 000 ms, 01:40–01:46Z. load1 0.98–1.19, Tctl
68.6–74.5 °C, 0 `cutechess-cli` and 0 vitest at every check, including a 0.5 s sampler during each pair.

| board | base median nps | tip median nps | tip / base |
|---|---|---|---|
| kiwipete | 781 003 | 876 154 | 1.122 |
| position-6 | 808 481 | 896 886 | 1.109 |
| start | 581 786 | 633 651 | 1.089 |

- **Per item, INFO.** Item 1 / base: 1.061 / 1.078 / 1.079. Tip / item 1: 1.046 / 1.039 / 1.029.
- **The SE's 7.6–11.7 % is CONFIRMED, not narrowed.**
  - The Architect's bound caps nps at 1.072 / 1.082 / 1.073.
  - Item 1 sits at its own bound.
  - The excess is item 2's: about 4–15× its 0.2–1.1 % bound. The cause is `UNKNOWN - verify`, not graded.

**G6 MET.** kiwipete 8 = 8, position-6 10 = 10, minimum 8, no WARN.

**Gates.**
- lint, typecheck and build exit 0. `npm test` 2 148/2 148, skips 0, `No findings.`
- **G8** 8.37 s.
- 22 deep-lane files, 743/743.
- **G1** 54/58, with all 58 rows equal to base (`ade68870…`).
- **G5** green, with max `elapsedMs` 3 001.
- **G7:** two fixed 2 KiB scratches, counted in (a), growth 0.
- **G9** is an empty diff.

**LOW observations, none a gap.**
- QE-240-a: the self-time re-cut under-priced item 2.
- QE-240-b: the >256 fallback branch is unreached by any test, and unreachable in play.
- QE-240-c: `LADDER_DEEP` and `INPUT_DEEP` were not run.
- QE-240-d: the deep lanes ran through `./node_modules/.bin/vitest`; no bare `npx` ran.
- QE-240-e: the C4 row is the load-bearing catch for a shared-output fault.

**STOP:** none.

### Trace row (10 cells, header order)

| ABC-240 (qe-ABC-240) | QE PASS at 220ab978: A1–A5 MET; A1 6 021 rows base = tip (812f86ae…); unpruned doors depth 2 ACCEPTABLE + depth-5 sample 264 rows + midgame supplement 8 rows equal, no midgame depth-5 owed; A2 walk P1/P2 green, QE C4 plant red (19 rows); A3 nps 1.122 / 1.109 / 1.089 | EPIC-010 | allocation-free move ordering, value-identical (cut 6; items 1, 2) | NFR-005 G6 MET (8 = 8, 10 = 10, min 8); NFR-004 G5 green (max 3 001 ms); NFR-008 G8 8.37 s; NFR-009 G7 2 × 2 KiB fixed, counted in (a), growth 0 | grugops/qe-ABC-240 @ 2b74c0d3 (on grugops/ABC-240 220ab978; code 69e19fc4, 7913499d) | npm test 63 files 2 148/2 148, skips 0; deep lanes 22 files 743/743; G1 54/58 rows equal; .grugops/context/qe-ABC-240/notes/ | signed (QE verdict 19068f9d, S2) | — | In Review → ready for the Orchestrator's merge (S2) |
