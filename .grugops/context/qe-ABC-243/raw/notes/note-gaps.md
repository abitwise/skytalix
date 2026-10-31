# `ABC-243` QE findings: none blocking

- **QE-243-a LOW (QE harness, not product).** `qe-scripts/host.mjs` (inherited from `qe-ABC-229`/`qe-ABC-244`) finds a
  foreign vitest with `pgrep -f "[/]vitest"`. That pattern matches ANY process whose argv carries `/vitest`, including
  the wrapper shell of the same command line. QE launched `clear.mjs` and then `node_modules/.bin/vitest` (the
  `ENGINE_DEEP` row) in ONE shell line, so the wait-clear found its own parent shell and waited on it by `kill -0` until
  the 60-min cap (exit 3); the deep row then ran. The deep row's precondition was therefore the timeout, not a clear
  reading; the host was otherwise quiet (load1 at the run is in the timing note). It does not touch `G8`: `g8.mjs` was
  launched from a line without `/vitest`, and its own wait-clear ran before each of the 6 runs. **Fix for the next QE:**
  never put a vitest invocation on the same shell line as a wait-clear, or have `host.mjs` drop its own ancestor PIDs
  (walk `/proc/<pid>/stat` ppid) from the match. Cost here: about 60 min of idle wall.
- **QE-243-b INFO.** SE-243-b CONFIRMED: the Hash row reads `time` with a format-blind regex, so it no longer checks
  `score` at level 5. The L1–L4 plants give info lines with no `score`, and the row still goes red on the bound. At base,
  the L4 plant was caught only by `parseInfo` failing (`not an info line`), not by a time bound; at head the bound catches
  every other level, 1–7. `ABC-167`'s default-level row still checks `score`.
- **QE-243-c INFO.** The deep row's child script still names its `DEFAULT_BUDGET_MS` search `three`
  (`const three = chooseMove(…, { budgetMs: ${DEFAULT_BUDGET_MS} })`). It is outside A3's three-line fence and changes
  nothing measured. **And the row's printed reading still says `3 s`:** `:695` logs
  `… 1 s (depth 7) …; 3 s (depth 8) heapUsed …` for the `DEFAULT_BUDGET_MS` (4 s) search (QE's deep run, `deep/deep.txt`).
  The ticket's Pain 2 ("the label no longer matches the reading") is therefore closed for the title, doc and header,
  but not for the stdout line a reader of the deep run sees. Outside A3's fence (exactly 3 lines), so not a fail here;
  carry with the `NFR-009` catalog wording ("a 1 s and a 3 s search", Security/NFR's edit) to whichever ticket next
  touches that row.
- **SE-243-a INFO, confirmed.** A6 is pinned at depth 4 (the ticket allows one N in 1–5). Only depth 4 is in the lane.
- **SE-243-c INFO, confirmed with a correction.** `src/transposition.test.ts:19` is **118** characters (`wc -m`), not
  117; `npm run lint` passes (Biome does not wrap comments). The 1-character difference changes nothing.
- **SE-243-e INFO, confirmed.** `git diff ae7211c3 4bd9ac6a -- src tools data` is empty; base `4bd9ac6a` is right.
- No gap against A1–A6 left open. No smoke, no UAT: 0 production lines (`git diff --name-only 4bd9ac6a 8772cf36` is the two
  `*.test.ts` files), so the QE verdict is the gate.
