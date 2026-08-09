---
task: ticket-to-pr-ABC-009-qe2
by: qe-e2e
at: 2026-08-09T14:07:41Z
done_at: 2026-08-09T14:36:20Z
outcome: |
  done — `A11` IS MET AND CLOSED AS A DIMENSION, not as a fourth sample. `ABC-009` moved
  `In Review` → `Ready for UAT` on a **PASS** verdict, the one board move this role owns
  (`In Review` 1/3 → 0/3, `Ready for UAT` 0/4 → 1/4; no limit approached, no override taken, no
  written reason owed; 10 numeric-header columns re-verified against their line-item counts, 0
  wrong). This is the return trip from the first backward move in this project's history, and it is
  taken because the criterion that caused it is met — not because a tick was re-drawn.

  WHAT WAS OWED IS PAID, AND IT IS TEST ROWS WITH ZERO PRODUCTION LINES.
  `src/moves.castling.hardening.test.ts` goes **19 → 34 tests**. The two `QUEEN_ON_*` tables became
  `IMPOSTOR_ON_*` tables enumerating EVERY own piece type the square can hold — the king's home
  square with the matching rook present carries QUEEN/ROOK/BISHOP/KNIGHT/PAWN (12 rows), the rook's
  home square with the king home carries QUEEN/BISHOP/KNIGHT/PAWN (10 rows) — the eight queen rows
  carried through verbatim and **14 rows new**, each type in AT LEAST TWO (colour, side)
  configurations with all four appearing per table, which is `A11`'s own both-colours-both-sides
  clause asserted rather than claimed. ONE NEW TEST ASSERTS THE QUANTIFIER ITSELF: the piece-type
  universe is DERIVED BY PROBING `parseFen` (every letter, two probe boards) instead of restated, so
  deleting a row — or adding a seventh parseable type — turns it red. EVERY ROW ASSERTS ITS OWN
  EXPERIMENT before the outcome (the named own piece really on the square under test, THE OTHER
  PRECONDITION REALLY HOLDING so exactly one condition can be the reason, exactly the one right).

  MY OWN FIRST HOP IS THE THING BEING REPAIRED. My `G-1` rows closed the QUEEN and I called the
  dimension closed; four rows for one type is a third sample, not a quantifier, and BA/PM then
  measured three further builds of the same shape passing everything. The rows that were not enough
  were mine.

  PROVED ON 20 MUTANTS OF THE DELIVERED DIFF, applied to a COPY of `src/` outside the repository,
  anchor-unique and bytes-changed asserted, `tsc --noEmit` per mutant, `src/moves.ts` re-hashed after
  every one, ONE PROCESS PER TREE throughout (the module-cache trap that gave BA/PM a false "the
  harms don't reproduce"). ALL NINE own-type admissions DIE — including THE THREE THAT PASSED THE
  ENTIRE NET BEFORE THIS HOP (own ROOK and own PAWN on the king's square, own PAWN on the rook's, all
  three at 33/33 acceptance and 19/19 on my previous rows) — and they die to these rows alone. Two
  admissions made CONDITIONAL on colour or side also die, each to exactly the second-configuration
  row that exists for it, which is what proves the doubling load-bearing rather than decorative: with
  only BA/PM's white-kingside pawn row the black-only pawn admission SURVIVES. AND THE NINE
  BEHAVIOUR-EQUIVALENT MUTANTS ALL STILL SURVIVE at 33/33 acceptance, 34/34 hardening, 371/371 full —
  killed count ZERO, which is the property that proves the rows pin observable behaviour and not
  implementation shape. 11 killed, 9 survived, 0 verdict mismatches, 0 broken builds.

  THE HARM REPRODUCES ON EVERY KILL, so each is a real defect and not a shape: on the king's home
  square one `legalMoves()` call DESTROYS the occupant and writes a king of the moving side over it
  for EVERY own type (`e1` 5/4/3/2/1 → 6, black `e8` 9 → 14, every white row ending
  `4k3/8/8/8/8/8/8/K3K2R w K - 0 1`); on the rook's home square the position is BYTE-IDENTICAL, so
  only the `FLAG_CASTLE` count can ever see it — `A6`'s own structural rationale, now confirmed on
  four more piece types.

  THE ROWS WERE PROVED NON-VACUOUS, which a 22-row table can fail silently: two deliberate row
  corruptions in a scratch copy against pristine source. A row labelled PAWN whose FEN carried a
  BISHOP — AT A COINCIDING COUNT OF 19, so every OUTCOME assertion passes — goes red on
  "the impostor must stand on the square under test"; deleting the matching rook goes red on
  "the OTHER precondition must hold". Without those assertions the first corruption is invisible and
  the table would claim a type it never tested.

  A SEVENTH INDEPENDENT DERIVATION of the `A11` counts, and every BA/PM figure reproduced exactly
  (including its four mirrors); the five counts derived first here agree with `A5`/`A6` wherever a FEN
  is shared. Over-rejection controls hold — four legal castles 15/16/15/16 with one castle each,
  kiwipete 48 with BOTH castles still offered, every position pure. No discrepancy against any of the
  six prior derivations and nothing adjusted in either direction.

  GATES RE-RUN ON THE TIP BY THIS ROLE, NEVER INHERITED — lint 0 (after ONE autofix of this role's own
  formatting, **1 of 2 `self_fix_attempts` spent**, then the full `npm run lint` at exit 0; 2
  pre-existing `biome.json` infos), typecheck 0, `npm test` **371 passed (371) on 16 files**, build 0,
  skip count **0** by the `AGENTS.md` command, `PERFT_DEEP=1` deep lane **32/32 exact in 36.04 s**.
  The whole campaign was RE-RUN AFTER the format change so no number predates the delivered bytes
  (`cmp`-verified). Test-integrity checker **exit 2 = an ERROR, NOT a pass** (`.grugops/test-skips.md`
  absent by `ls`; NO registry file created — an agent may not author a justification to clear its own
  gate). E2E and the auto-UAT oracles **`UNKNOWN - verify`**, not green. `A8` re-verified more
  strictly than reported: every `*.test.ts` on `main` diffed INDIVIDUALLY, **0 of 14 modified**;
  `src/moves.ts` byte-identical (`0e247853ab2c05887c76105ff83d8621`, `git diff 8f540cf` empty).

  `NFR-001` DELIBERATELY NOT RE-MEASURED and no throughput figure here is mine — a test-only change
  adds no production line and no code path, so Security/NFR's count-based discharge (396,350
  executions, 0 rejections, ~0.01%) stands. Re-running the benchmark to "confirm" it would be the
  instrument-noise mistake this project has recorded ten times.

  THE ONE THING DELIBERATELY NOT DONE, and it is the load-bearing decision: `A11`'s own
  "NOT YET SATISFIED BY THE SUITE" marker and the `## Acceptance` preamble line are now STALE and
  were LEFT BYTE-IDENTICAL. `## Acceptance` is BA/PM's, and the failure this hop repairs is a role
  certifying its own sample as a dimension — so the role that wrote the rows does not also stamp the
  criterion satisfied. Routed to BA/PM as risk 1 with the measurements to check it against. The cost
  is named rather than hidden: a stale "not satisfied" line stands while the ticket sits in
  `Ready for UAT`, and the board, the trace and the ticket's new `## QE — second hop` section all say
  which is current.

  EIGHT RISKS CARRIED, none high, each with an owner. What is NOT established: that the criteria set
  is complete (Engineer 5 mutants → QE 62 → BA/PM 10 → this hop 20, each finding what its predecessor
  missed — EXPECT A FOURTH CLASS); that the nine equivalence arguments generalise (not re-enumerated
  here, and "still survives my suite" is weaker than "is equivalent"); any coverage or throughput
  figure; a terminal Workflow 05 verdict. UAT stays DEFERRED to `EPIC-006` and explicitly NOT passed.

  Five notes published (2 `observation`, 1 `decision`, 1 `artifact-ref`, 1 `claim` at
  `confidence: UNKNOWN - verify`). NO `finding` — no §14 gate in this install and
  `context.human_admission` is `off`; every `verified_by` empty and NOTHING self-stamped; no
  `index.md` / `index.jsonl` hand-faked. Four STATE files edited (the ticket, `plans/board.md`,
  one `plans/traceability.md` row at FIELD level with all 31 rows verified at ten cells before and
  after, and this queue record). Nobody enqueued — the Orchestrator owns decompose→enqueue. Nothing
  merged and nothing deployed; a human holds both.

  One correction against my own first hop, carried rather than left standing: the
  `plans/traceability.md` "11-cell defect" I flagged DOES NOT EXIST — BA/PM re-derived it, the pipes
  are escaped and every row has ten cells in all eight commits. My verification this hop counts
  UNESCAPED pipes, which is the instrument that mistake calls for. And my own mutation harness had a
  bug that produced NINE `HARNESS-ERROR`s rather than nine false survivors; recorded because a
  refusal path is only worth building if you say when it fires.
---

# Now-running registry record (CLAIM-01 / CLAIM-02)

Claimed BY HAND per Workflow 17, because `scripts/claim.js` does not exist in this install.
**Re-checked at the source rather than trusted from the subtask brief or the six prior claim
records that say the same thing:** `ls scripts` (absent), a `find` for `claim*.js` / `claim*.ts` /
`context-io*` across the repository and the kit root `/Users/olgeroeselg/.grugops/agent-factory`
(no hits), and `tools/grugops/` holding only `reference-check.js` and `test-skip-integrity.js`.

The claim is the atomic `mkdirSync` of this directory — the same primitive `claimTask` relies on —
so the exactly-once property is unchanged. What is absent is the script, and that is recorded as
the deviation it is rather than presented as compliance.

`at` came from `date -u`, never from a test runner's `Start at` line. This machine is UTC+3
(`date` read `17:07:41 EEST` against `date -u` reading `14:07:41Z`), and a note on this task
already carries local time labelled `Z`
(`20260809T141500Z-orchestrator-decision-865b06ae`, superseded by
`20260809T114649Z-orchestrator-decision-700d4a44`).

Transition: `pending/ticket-to-pr-ABC-009-qe2.md` → `claimed/ticket-to-pr-ABC-009-qe2/` by plain
`mv` (atomic rename within one filesystem), which is what `claim.js` `transition` does.
