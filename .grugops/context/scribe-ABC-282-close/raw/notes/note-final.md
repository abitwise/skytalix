# scribe-ABC-282-close, as landed: the four lines are shorter than `…3e1f993c` describes, and the size cap cost prose elsewhere

`…3e1f993c` describes the four lines as first written (19 647 B in all). `src/cli.test.ts` A5 holds `AGENTS.md` to 18 432 B, so they were cut. Read this note for the lines as they stand. Nothing was run.

- **Time-mode line:** W1 in `uci-clock-mode` on a `go` with the mover's clock and no `movetime`; no iteration starts past budget ÷ 2.3; the budget is still the hard abort; an aborted iteration's move is kept if it beat the incumbent; other modes and tokens unchanged; a test that needs the full 59.5 s sends `go movetime`. The `info string partial` line and `ITERATION_GROWTH`'s name are not in it.
- **UCI session deep lane:** "3 x 59.5 s at `go movetime 90000` plus a clock-line search that stops at 59.5 s ÷ 2.3 (ABC-282 A3)". The ~3.5 min and ~27.5 s figures are not in it.
- **Passer lane:** "28 tests"; "K0 reads the `…WithoutBundle` doors". The ~8 s is not in it.
- **Merge re-read:** "it runs the deep lane of any test file arriving from the other side". The Orchestrator's name and date are not in the line; `…681c6363` item 3 holds them.
- **Cut to fit, no rule or command among them:** the UCI entry comment's exit codes (the command log § "UCI entry point" holds them); the Orchestrator-classifies line; the shared-context sentence under § Role / workflow files; the standing-rulings and command-log bullet under § Memory bank & plans (§ Standing rulings and the § Commands preamble carry both pointers); the plans list's glosses; "the grant did not flip it" under § Safety rules; the byte-budget sentence's wording.
- **Size:** 18 429 B before, **18 393 B after**, by `wc -c`. A5 itself was not run.
