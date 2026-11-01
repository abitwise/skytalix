---
id: 20261101T071031Z-ba-pm-observation-9ddd7118
kind: observation
by: ba-pm
at: 2026-11-01T07:10:31Z
verified_by: 
confidence: high on what is read (src/transposition.test.ts:676/:695 at 55fbc90e; qe-ABC-241/243/244 records); the five survivors' whole-lane state is UNKNOWN - verify
refs:
  - bapm-page-closes
  - EPIC-010
  - ABC-243
  - ABC-244
  - ABC-245
  - ABC-248
  - ABC-241
  - ABC-230
  - ABC-242
  - ABC-228
  - ADR-0046
  - NFR-008
  - NFR-009
  - SE-228ii-a
  - QE-228ii-b
  - QE-241-a
  - QE-242-b
  - SE-242-f
  - QE-243-a
  - QE-243-b
  - QE-243-c
  - SE-243-a
  - SE-243-b
  - SE-243-c
  - SE-243-d
  - SE-243-e
  - QE-244-a
  - QE-244-b
  - QE-244-c
  - QE-244-d
  - QE-244-e
  - QE-244-f
  - SE-244-a
  - SE-244-b
  - SE-244-c
  - SE-244-d
  - SE-244-e
  - QE-245-a
  - QE-245-b
  - QE-245-c
  - QE-245-d
  - SE-245-a
  - SE-245-b
  - SE-245-c
  - qe-ABC-243/20261031T040755Z-qe-e2e-decision-2d790e40
  - qe-ABC-243/20261031T040755Z-qe-e2e-observation-cf057dd1
  - qe-ABC-244/20261030T230742Z-qe-e2e-decision-4fe9bfe1
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - secnfr-ABC-244/20261030T231242Z-security-nfr-decision-9087cb39
  - secnfr-ABC-244/20261030T231242Z-security-nfr-observation-619ead26
  - qe-ABC-245/20261031T064950Z-qe-e2e-decision-b2ebc183
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-cf53b0ed
  - 3628fe99
  - 24b22339
  - 2cce84e0
  - 55fbc90e
  - b76b821e
  - src/transposition.test.ts
  - src/levels.test.ts
supersedes: 20261101T071017Z-ba-pm-observation-72d14dd7
seal: sha256:08482d2fe0c2eff48df932ac5135ce988dc2b56e11d1a7d9fe9210603820c6fb
---

# Two proposals from the ABC-243/244/245 closes, for the Orchestrator to route: P-1 an XS test-only ticket (QE-243-c), P-2 a whole-lane mutant read in a later QE hop (QE-244-c). Neither blocks anything

Read at `main` `55fbc90e`; nothing run. Supersedes `…72d14dd7`, whose P-1 alternative listed `ABC-246`'s files incompletely;
nothing else changed.

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
  (`ABC-246`'s page names `src/uci-session.ts`, `src/engine.ts`, `src/levels.ts` and their tests; `ABC-248`'s names
  `src/search.null-move.test.ts` and `src/uci-session.test.ts`; neither names `src/transposition.test.ts`).

## P-2: whole-lane read of five surviving mutants (QE-244-c), not a ticket
- `qe-ABC-244`'s frozen 24 left nine survivors on the 18 `ABC-230`/`ABC-241` rows. On record elsewhere: QM1, QM2, QM4
  turn `npm test` red (`qe-ABC-241` Result); QM3 is killed by `ABC-243` A6 (`qe-ABC-243` `…2d790e40`).
- `UNKNOWN - verify`: S241M5, QPARITY, QCLOCK, QPLY4, QPATHOFF against the whole default lane (QE's likely homes:
  `src/engine.test.ts`, `src/search*.test.ts`). The mutant scripts sit in `.grugops/context/qe-ABC-244/raw/`.
- Proposal: the Orchestrator may add this read to a later QE hop's brief that already runs mutants on the lane (for
  example `qe-ABC-248`, which freezes a mutant list), not timed and not ALONE. A survivor there would be a new gap for
  BA/PM to cut; until then nothing is owed.
