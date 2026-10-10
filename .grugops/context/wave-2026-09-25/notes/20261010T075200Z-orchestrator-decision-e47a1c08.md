---
id: 20261010T075200Z-orchestrator-decision-e47a1c08
kind: decision
by: orchestrator
at: 2026-10-10T07:52:00Z
verified_by: 
confidence: high
refs:
  - ABC-084
  - main
supersedes: 
---

Owner (Olger Oeselg), 2026-10-10, verbatim: "accept ABC-084, cut the harder puzzles ticket"

1. `ABC-084` UAT ACCEPTED (QE PASS `b40e024`; Security/NFR PASS_WITH_RISKS `ffc3bdd`, `F1` fixed `17fd55e`; Scribe `A8` `5a15fb4`). Merged into the wave `e634bc1`…`71a094f` (append-only conflicts in the ticket page and trace, both sides kept). Merged-tip gates: lint 0, typecheck 0, build 0, unit 50 files / 1540 / 0 skips, skip integrity "No findings"; `SEARCH_DEEP` quiescence 37/37; `PUZZLE_DEEP=1` 12/12, 40/40, 11.66 s (load1 ~6.7). `AGENTS.md` 23 464 B with the option-B line. Local `main` fast-forwarded (no remote).
   The owner accepted with the coarse-gate caveat disclosed (QE-084-a/b: 10 of 17 subtle weakenings survive; baseline at the 40/40 ceiling).
2. Cut a "harder puzzles" ticket from QE-084-a/b (and -c/-d) — BA/PM `cut-harder-puzzles` dispatched.
3. `ABC-126` (in-check corpus pair) unblocked by this merge.
