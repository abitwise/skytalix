# Two proposals from the ABC-243/244/245 closes, for the Orchestrator to route: P-1 an XS test-only ticket (QE-243-c), P-2 a whole-lane mutant read in a later QE hop (QE-244-c). Neither blocks anything

Read at `main` `55fbc90e`; nothing run.

## P-1: proposed ticket (carrier of QE-243-c)
- **Title (draft):** "The `NFR-009` deep row's printed reading names the `DEFAULT_BUDGET_MS` search by its budget (test-only)".
- **Pain:** `src/transposition.test.ts:695` prints `…; 3 s (depth N) heapUsed …` for the search run at
  `DEFAULT_BUDGET_MS` (4 000 ms since `ABC-228`), and the child script at `:676` names it `const three`. A reader of the
  `ENGINE_DEEP` run sees a label that does not match the reading. `ABC-243` fixed the title, doc comment and header
  (A3's three-line fence) but not these two (`qe-ABC-243` `…cf057dd1`).
- **Acceptance (draft):** the printed label names `DEFAULT_BUDGET_MS` (or "4 s") and the variable no longer says
  `three`; `git diff` touches only `src/transposition.test.ts`, no assertion, bound or budget; the `ENGINE_DEEP`
  transposition row is run once green; default lane unchanged (the row is deep-only).
- **Size XS, P3, test-only, no smoke, UAT waived by the 0-production-lines rule; no `G8` cost** (deep lane only).
- **Alternative (cheaper):** fold it into the next ticket that edits that row or file. Nothing in flight does today
  (`ABC-246` names `src/uci-session*` and `ABC-248` names `src/search.null-move.test.ts` and `src/uci-session.test.ts`).

## P-2: whole-lane read of five surviving mutants (QE-244-c), not a ticket
- `qe-ABC-244`'s frozen 24 left nine survivors on the 18 `ABC-230`/`ABC-241` rows. On record elsewhere: QM1, QM2, QM4
  turn `npm test` red (`qe-ABC-241` Result); QM3 is killed by `ABC-243` A6 (`qe-ABC-243` `…2d790e40`).
- `UNKNOWN - verify`: S241M5, QPARITY, QCLOCK, QPLY4, QPATHOFF against the whole default lane (QE's likely homes:
  `src/engine.test.ts`, `src/search*.test.ts`). The mutant scripts sit in `.grugops/context/qe-ABC-244/raw/`.
- Proposal: the Orchestrator may add this read to a later QE hop's brief that already runs mutants on the lane (for
  example `qe-ABC-248`, which freezes a mutant list), not timed and not ALONE. A survivor there would be a new gap for
  BA/PM to cut; until then nothing is owed.
