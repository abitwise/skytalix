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
