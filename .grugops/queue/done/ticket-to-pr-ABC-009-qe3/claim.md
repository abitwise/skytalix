---
task: ticket-to-pr-ABC-009-qe3
by: qe-e2e
at: 2026-08-09T15:40:14Z
done_at: 2026-08-09T16:07:30Z
outcome: |
  done — `A13` IS DISCHARGED IN TESTS. The occupant BYTE of both home squares is now quantified over
  its WHOLE 13-value space, and the stopping rule holds: this was the last hardening pass on
  `ABC-009`, nothing found beyond the eight rows was turned into a ninth hop.

  EIGHT ROWS, TEN NEW TESTS, ZERO PRODUCTION LINES. `src/moves.castling.hardening.test.ts` goes
  **34 → 44 tests**; the suite goes **371 → 381 passed (381) on 16 files** at skip **0**;
  `src/moves.ts` is still md5 `0e247853ab2c05887c76105ff83d8621` with `git diff 8f540cf` EMPTY, and
  all 14 pre-existing test files on `main` were diffed INDIVIDUALLY at **0 of 14 modified** (`A8`, at
  line level). Four `ENEMY_ON_KING_SQUARE` rows and four `ENEMY_ON_ROOK_SQUARE` rows for the two
  bytes the identity guard is the ONLY guard against, each asserting THE OCCUPANT BYTE (type AND
  colour), the other precondition, exactly one right, THAT THE IDENTITY GUARD IS THE ONLY REFUSER
  (king path unattacked, `empty` set empty — an inert row proves nothing), zero `FLAG_CASTLE` in both
  exported layers, an exact `legalMoves` count, and full purity over all 128 bytes and five scalars.

  ALL EIGHT OF BA/PM'S MEASURED COUNTS REPRODUCED EXACTLY — 13, 14, 17, 19 on the king's home square
  and 4, 5, 4, 5 on the rook's — with **0 of 8 disagreeing, 0 of 8 labels lying, 0 of 8 rows inert**.
  That is a second independent derivation of `14`, `17`, `19` and of the rook-square doubling, which
  the Orchestrator explicitly recorded it had NOT reached. No discrepancy arose, so none was raised,
  and nothing was adjusted in either direction.

  THE QUANTIFIER IS A TEST, NOT A COMMENT. The 13-value byte domain is DERIVED BY PROBING `parseFen`
  and the value-by-value discharge map is JOINED against the row tables, so deleting a row — or making
  a fourteenth byte parseable — goes red. Both exclusions are asserted AT THEIR MECHANISM instead of
  inherited: enemy `KING`/`QUEEN`/`ROOK` must mask the king path on both squares (`isSquareAttackedBy`,
  POLARITY-CHECKED before any verdict was read), and all four constructions of an own `KING` on the
  rook's home square must be refused by `parseFen`. THE 13 WAS RE-MEASURED ON ALL SIX HOME SQUARES
  (BA/PM measured three; the black mirrors are new here) with a named witness per value and 243 of the
  256 `Uint8Array` values never written — and the probe VARIES THE KING PARKING PER ATTEMPT, which is
  the trap that made BA/PM and then the Orchestrator both report a wrong 11, designed out by
  construction rather than avoided by care.

  24 MUTANTS OF THE DELIVERED TREE, applied to a COPY of `src/` OUTSIDE the repository, anchor-unique
  and bytes-changed asserted, `tsc --noEmit` per mutant so a broken build can never be scored a
  survivor, `src/moves.ts` re-hashed after every one, ONE PROCESS PER TREE throughout. THE FOUR
  ENEMY-`KNIGHT`/`PAWN` ADMISSIONS ALL DIE TO THE NEW ROWS (hardening 42/44, full 379/381, and
  ACCEPTANCE 33/33 ON EVERY ONE — the acceptance file sees none of them), AND ALL FIFTEEN
  BEHAVIOUR-EQUIVALENT MUTANTS STILL SURVIVE AT 44/44 AND 381/381, KILLED COUNT ZERO — the nine from
  the previous hop plus the SIX enemy `KING`/`QUEEN`/`ROOK` admissions (three per square) BA/PM
  measured on two agreeing instruments. That zero is the property that matters most: a row killing one
  of those would pin implementation shape, and that set is unfalsifiable by construction.
  7 killed · 17 survived · 0 verdict mismatches · 0 broken builds · 0 harness errors.

  THE HARM REPRODUCES ON ALL FOUR KILLS, one FRESH PROCESS PER TREE STATE: `K3n2R w K` goes 13/0/pure
  → 14/1 with `e1` **10 → 6**, an ENEMY knight destroyed and a WHITE king written over it, and
  `R3p2K w Q` ends `R3K2K` with TWO WHITE KINGS ON THE BOARD; on the rook's home square the position
  is byte-identical, so the illegal `FLAG_CASTLE` offer (4 → 5, 5 → 6) is the only witness.

  THE ROWS WERE FALSIFIED, NOT TRUSTED — three deliberate corruptions in a scratch copy against
  PRISTINE production source, each chosen so every OUTCOME assertion still passes: a row labelled
  `KNIGHT` carrying a `BISHOP` at the coinciding count 13, a row labelled ENEMY carrying the mover's
  OWN knight at the coinciding count 16 (ONLY the colour half can see that one), and a row made INERT
  by an own bishop on `f1`. All three went RED naming the input FEN.

  ONE RESIDUAL MEASURED AND NAMED RATHER THAN LEFT IMPLICIT: an admission conditional on the castling
  SIDE for one type survives the net — enemy `KNIGHT` only QUEENSIDE and enemy `PAWN` only KINGSIDE,
  both 381/381 — because at `A11`'s established doubling each type's two configurations vary COLOUR,
  not side. The colour-conditional versions DO die, each to exactly the one row that exists for it. IT
  IS INHERITED FROM THAT DOUBLING STANDARD RATHER THAN INTRODUCED HERE, AND THAT WAS MEASURED ON
  `A11`'S OWN ROWS: own `ROOK`-only-QUEENSIDE and own `BISHOP`-only-QUEENSIDE on the king's home
  square also survive 381/381 each. `A11` IS NOT REOPENED and neither criterion is in shortfall — both
  require ≥2 configurations per type with all four rights across the table, and both have that.
  Closing the class widens BOTH tables, which is beyond `A13`'s stated eight-configuration region, so
  it is routed to the FOLLOW-UP HARDENING TICKET for `src/moves.ts` under the stopping rule.

  ALSO CORRECTED: this file's OWN header claim, which was false and was mine. It asserted that an
  enemy-colour occupant of either square is masked by the through-check test — true for enemy
  `KING`/`QUEEN`/`ROOK` and false for `KNIGHT`/`PAWN` — and as written it instructed the next reader
  NOT to add the rows that were missing. Corrected in place with a date, with the falsification stated
  beside it, along with the two comments that repeated it. `A11`'s rows, assertions and MET verdict are
  untouched; `expectImpostorSetup` gained an occupant-colour parameter DEFAULTING to "own" so every
  `A11` call site is byte-identical.

  GATES RE-RUN ON THE TIP BY THIS ROLE, NEVER INHERITED, AND RE-RUN AGAIN ON THE FINAL TREE — lint
  exit 0 (after ONE autofix of this role's own formatting, **1 of 2 `self_fix_attempts` spent**; 2
  pre-existing `biome.json` infos), typecheck 0, `npm test` **381 passed (381) on 16 files**, build 0,
  skip count **0** by the `AGENTS.md` command, `PERFT_DEEP=1` deep lane **32/32 EXACT in 36.79 s**.
  The whole mutation campaign was RE-RUN AFTER the format change so no number predates the delivered
  bytes. Test-integrity checker **exit 2 = an ERROR, NOT a pass** (`.grugops/test-skips.md` absent by
  `ls`; NO registry file created — an agent may not author a justification to clear its own gate, and
  a skip count of 0 owes none). E2E, the auto-UAT oracles and COVERAGE are **`UNKNOWN - verify`**, not
  green. `NFR-001` DELIBERATELY NOT RE-MEASURED and no throughput figure here is this role's.

  THE ONE THING DELIBERATELY NOT DONE, FOR THE SECOND HOP IN A ROW: `A13`'s own
  "⚠️ NOT YET SATISFIED BY THE SUITE" marker and the `## Acceptance` preamble line were LEFT
  BYTE-IDENTICAL. `## Acceptance` is BA/PM's and is fenced by this subtask, but the deeper reason is
  the failure these hops keep repairing — a role certifying its own rows as a closed dimension. THE
  COST IS NAMED RATHER THAN HIDDEN: closing `ABC-009` while that marker stands ships a contradiction,
  so the close needs either a verification hop or an explicit ruling recorded at the close. That is
  the Orchestrator's call and it was not taken here.

  NO BOARD MOVE — `ABC-009` was already in `Ready for UAT` and stays there at **1/4**;
  `plans/board.md` NOT edited. `## Acceptance`, `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` and
  `plans/nfr-catalog.md` NOT edited. `A7`, `A11`, `A12`, guard ordering and `NFR-001` NOT
  re-litigated. The `plans/traceability.md` 11-cell report stays CLOSED. Three STATE files edited
  (the hardening test file, ONE new `## QE — third hop` section on the ticket, and `plans/traceability.md`
  at ONE row / TWO cells with all 32 table rows verified at ten cells counting UNESCAPED pipes before
  and after, exactly one row line changed, every added string asserted pipe-free BEFORE writing) plus
  this queue record. Five notes published (2 `observation`, 1 `decision`, 1 `artifact-ref`, 1 `claim`
  at `confidence: UNKNOWN - verify`). NO `finding` — no §14 gate in this install and
  `context.human_admission` is `off`; every `verified_by` empty, NOTHING self-stamped, no `index.md` /
  `index.jsonl` faked, and the absence of `scripts/context-io.ts` recorded as the deviation it is.
  Nobody enqueued. Nothing merged and nothing deployed; a human holds both.

  SIX RISKS CARRIED, none high, each with an owner. What is NOT established, at
  `confidence: UNKNOWN - verify`: that `A13` is SATISFIED as a criterion (BA/PM's verdict, which is
  why the marker was left); that the fifteen survivors are behaviour-equivalent in general ("survives
  my suite" is weaker than "is equivalent"); that no further dimension exists (two regions named,
  reserved, NOT closed); that the residual is harmless (a real surviving harm, low severity being a
  judgement); coverage; any `NFR-001` or throughput figure; a terminal Workflow 05 verdict; that
  `ABC-009` may be closed — `Ready for UAT` is not `Done` and UAT stays DEFERRED to `EPIC-006` and
  explicitly NOT passed.
---

# Now-running registry record (CLAIM-01 / CLAIM-02)

Claimed BY HAND per Workflow 17, because `scripts/claim.js` does not exist in this install.
**Re-checked at the source rather than trusted from the subtask brief or the seven prior claim
records that say the same thing:** `ls scripts` (the directory itself is absent), a `find` across
the repository (excluding `node_modules`) and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` for `claim*.js` / `claim*.ts` / `context-io*` — **zero
hits in both** — and `tools/grugops/` holding only `reference-check.js` and
`test-skip-integrity.js`.

The claim is the atomic `mkdirSync` of this directory — the same primitive `claimTask` relies on —
so the exactly-once property is unchanged. What is absent is the script, and that is recorded as
the deviation it is rather than presented as compliance.

`at` came from `date -u`, never from a test runner's `Start at` line. This machine is **UTC+3**
(`date` read `18:40:08 EEST` against `date -u` reading `15:40:08Z`), and a note on this task
already carries local time labelled `Z`
(`20260809T141500Z-orchestrator-decision-865b06ae`, superseded by
`20260809T114649Z-orchestrator-decision-700d4a44`).

Transition: `pending/ticket-to-pr-ABC-009-qe3.md` → `claimed/ticket-to-pr-ABC-009-qe3/` by plain
`mv` (atomic rename within one filesystem), which is what `claim.js` `transition` does.
