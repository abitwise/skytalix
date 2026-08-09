# ABC-022 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-022`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-022-en-passant-generation-preconditions.md`](../ABC-022-en-passant-generation-preconditions.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## board header — _Updated: entry

_Updated: 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-022`, Workflow 04): **`In Review` GATE — THE IMPLEMENTATION HOLDS, BUT `ABC-022` DOES NOT ADVANCE TO QE YET. NO BOARD MOVE: it stays In Review 1/3.** Gates re-run by the Orchestrator on the branch tip rather than read off the hand-back: **lint 0, typecheck 0, build 0, 439/439 on 17 files, skip count 0, `PERFT_DEEP=1` 32/32 exact in 36.50 s** (engineer reported 36.55 s — reproduced). **`A9`'s line-level claim holds MECHANICALLY**: `git diff --diff-filter=M -- 'src/*.test.ts'` is EMPTY and `--diff-filter=A` returns exactly one addition, so no existing test was modified; the whole `src/` diff is `moves.ts` (+24 −12), a **comment-only** `legal.ts` edit and the new test file. **IT IS HELD FOR AN EIGHTH DEFECT THE ENGINEER FOUND AND CORRECTLY REFUSED TO FIX**: `src/legal.ts:69-71` claims *"`generateMoves` offers en-passant captures onto squares occupied by the mover's OWN piece"* — **made FALSE by this very fix**, confirmed by the Orchestrator reading the source. It sits outside `A11`'s cited 102-103 and outside the engineer's boundary, so flagging rather than widening the diff was right (AGENTS.md rules 9 and 12) and is recorded as right. **But `A11` AS WRITTEN IS SATISFIED WHILE THE HARM IS LIVE** — the ticket could pass every criterion and ship the falsehood `A11` was cut to remove. **THAT IS THE FIFTH INSTANCE ON THIS ONE TICKET OF A CRITERION NARROWER THAN THE HARM**, after the pre-check's 2 and BA/PM's 7. Routed to BA/PM, whose `## Acceptance` alone is — widening the boundary without amending `A11` would leave the new edit covered by NO criterion, which is the "green signal read as protection" failure this board keeps paying for. **The hop is scoped to a repo-wide SWEEP, not the one flagged line**, because every count here has been a floor and never a ceiling. A second question goes with it: with the generator fixed, the stated reason `hasLegalEnPassant`'s out-of-domain answer is *specified rather than derived* may have partly evaporated — **the guards themselves stay, `ADR-0005` is not reopened, and nothing executable may change.** `src/moves.ts` is now md5 `6335b452...`, so **`ABC-023`'s `A4` pin is stale as expected** and is deferred by design to its own promotion hop. NOTHING MERGED, NOTHING DEPLOYED._

---

## board header — _Updated: entry

_Updated: 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-022`, Workflow 04): **`ABC-022` PULLED `Ready` -> `In Development`. Ready 2/8 -> 1/8, In Development 0/3 -> 1/3. NO LIMIT APPROACHED, NO OVERRIDE TAKEN.** Chosen over `ABC-023` on priority (`P1` in `Ready` vs `P2` in `Backlog`) and on a dependency **the two tickets state backwards**: `ABC-023`'s `A4` pins `src/moves.ts` at md5 `0e247853ab2c05887c76105ff83d8621` and `ABC-022`'s fix lands in that same file, so `ABC-022` merging invalidates `ABC-023`'s evidence — they are serialised for that reason and `ABC-023` is promoted after `ABC-022` merges so the hash is re-derived once. **NOT PULLED AS IT STOOD: this is the FOURTH CONSECUTIVE PULL at which the Definition of Ready's "acceptance criteria clear, testable and measurable" row FAILED.** The Orchestrator's pre-check left it AMBER with two specifics; BA/PM found **SEVEN, five named by no pre-check**, and corrected the stated mechanism of both the pre-check did name. **FOUR OF THE SEVEN ARE ONE SHAPE — a criterion narrower than the ticket's own `## Scope` — now this board's most-repeated defect.** The worst, seen by nobody: **`A3` — half (b), the half the ticket calls the worse half — named three FENs and ALL THREE WERE WHITE TO MOVE**; a fix implementing the captured-pawn precondition for white only passed `A1`-`A6` as written and the whole suite 381/381 while still creating a phantom white pawn on e4. **The Orchestrator re-verified the crux on its own instrument** rather than accepting the hand-back — both new black-to-move rows reproduce exactly as claimed, one board byte changed, five scalars clean, FEN printed and re-parsed per row — and named what it did NOT re-derive (the 512-state exhaustion, the colour-restructure mutant, the `toFen` aliases, the 331 / 216,269 evaluation counts). **THE PARTIAL-FIX TEST THAT BLOCKED `ABC-009` IS NOW PASSED**: emptiness-only fails `A3`, captured-pawn-only fails `A1`, white-only fails `A3`'s new black rows, the colour-shaped restructure fails `A5`. One false justification (`A5`'s) **retired rather than softened**, the `ABC-009` `A7` precedent applied a second time. Scope, out-of-scope, size `S` and priority `P1` unchanged. `src/moves.ts` unchanged at `0e247853...`, no `src/` diff, no test row written, branch tip 381/381 on 16 files with skip count 0 and perft fast 24/24. **Ticket frontmatter moved WITH the column, not left for a sweep.** NOTHING MERGED, NOTHING DEPLOYED._

---

## In Development (WIP 0/3) — column note

EXITED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-022`, subtask
  `engineer-abc022-implement`, Workflow 04): ABC-022 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. QE/E2E was NOT enqueued; the Orchestrator owns decompose->enqueue. The
  In Review comment below carries what is handed over, and the full record is in
  `.grugops/context/ticket-to-pr-ABC-022/notes/`.

---

## In Development (WIP 0/3) — column note

ENTERED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-022`, Workflow 04) — the
  `Ready for Dev -> In Development` exit this role owns. Ready 2/8 -> 1/8, In Development 0/3 -> 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for either count. `ABC-013` stays in
  `Ready`, unmoved and unchanged. The Blocked column is empty.

  CHOSEN OVER `ABC-023` ON PRIORITY AND ON A DEPENDENCY THE TWO TICKETS STATE BACKWARDS. `ABC-022` is
  `P1` and already in `Ready`; `ABC-023` is `P2` and in `Backlog`, so it is not even pullable without
  BA/PM's promotion exit. `ABC-023`'s `## Dependencies` claims it is *"independent of `ABC-022` —
  different modules or different branches, and either order works"*, and that is WRONG AS WRITTEN:
  `ABC-023`'s `A4` pins `src/moves.ts` at md5 `0e247853ab2c05887c76105ff83d8621` as an acceptance
  criterion, and every *(Measured today: ...)* figure in it is stated against that tree, while
  `ABC-022`'s fix lands in `addPawnMoves` IN THAT SAME FILE. Verified rather than assumed: `main`
  hashes `0e247853...` right now, so `ABC-023`'s pin is valid TODAY and stops being valid the moment
  `ABC-022` merges. Consequences, both taken: the two are NOT run in parallel even though this column
  has room (a concurrent `ABC-023` would mutate a tree `ABC-022` is rewriting), and `ABC-023` is
  promoted AFTER `ABC-022` merges so the hash is re-derived ONCE. That cost is named rather than
  hidden — taking the `P1` first means `ABC-023`'s evidence must be re-pinned.

  IT WAS NOT PULLED AS IT STOOD, and this is the FOURTH CONSECUTIVE PULL ON THIS BOARD AT WHICH THE
  DEFINITION OF READY'S "acceptance criteria clear, testable and measurable" ROW FAILED. The ticket's
  own DoR block ticked it green on 2026-08-04 and nothing re-checked it for five days. The
  Orchestrator's pre-check left it AMBER with TWO named specifics; BA/PM re-derived and found SEVEN,
  FIVE of which no pre-check named — and corrected the STATED MECHANISM of both the Orchestrator
  found. The ticket was corrected IN PLACE inside `Ready` first (no board move, `Ready` stayed 2/8
  throughout that hop) and this pull is of the corrected ticket. FOUR OF THE SEVEN ARE ONE SHAPE — a
  criterion narrower than the ticket's own `## Scope` — which is now this board's most-repeated
  defect and is worth naming as a class rather than as four incidents.

  THE WORST DEFECT, AND NO PRE-CHECK SAW IT: `A3` — half (b), the half the ticket itself calls the
  worse half — NAMED THREE FENs AND ALL THREE WERE WHITE TO MOVE, while `## Scope` requires the
  precondition "for every position it accepts" and `A1`, the sibling half of the same defect, was
  already written for both colours. Measured on a mutant, not argued: a fix implementing the
  captured-pawn precondition FOR WHITE ONLY passed `A1`-`A6` as they were written, typechecked clean
  and passed the whole suite 381/381, while `4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1` still offered `d4e3`
  and one `legalMoves` call still created a phantom WHITE pawn on e4. `A3` now carries both colours.

  THE ORCHESTRATOR RE-VERIFIED THE CRUX ON ITS OWN INSTRUMENT rather than accepting the hand-back —
  the standing correction for this role's recorded failure shape on `ABC-009`, which was believing an
  instrument without checking the instrument, five times. Both new `A3` black-to-move rows reproduce
  exactly as claimed: `4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1` and `4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1` each
  return `generateMoves` ep 1 and `legalMoves` ep 1, and ONE `legalMoves` call writes a phantom white
  pawn on e4 and h4 respectively — one board byte changed, five scalars clean, the FEN printed and
  re-parsed on every row. `A5`'s two new ROOK rows read 0 today as claimed, and `A6`'s pinned control
  holds at gen 1 / legal 0 / 0 bytes changed. WHAT THE ORCHESTRATOR DID NOT RE-DERIVE, said plainly:
  the 512-state exhaustion behind `A5`'s equivalence proof, the colour-restructure mutant `A5` is kept
  to kill, the 28 `toFen` castling aliases and the `epSquare` 32/40 alias, and the 331 / 216,269
  evaluation counts. Those are BA/PM's measurements, carried as such.

  THE PARTIAL-FIX TEST — the one that blocked `ABC-009` at its pull — IS NOW PASSED, and it is the
  reason this is a PASS and not a second amber: an emptiness-only fix fails `A3`, a captured-pawn-only
  fix fails `A1`, a white-only captured-pawn fix fails `A3`'s new black rows, and the colour-shaped
  restructure fails `A5`. Every partial the Orchestrator could construct is caught by a named
  criterion.

  ONE FALSE JUSTIFICATION RETIRED RATHER THAN SOFTENED, the `ABC-009` `A7` precedent applied a second
  time: `A5`'s stated purpose — that it stops the fix being written as "reject own-colour occupants" —
  is FALSE, because at that program point an emptiness test and a colour test are behaviour-equivalent
  (`src/moves.ts:177` consumes every enemy occupant and `continue`s at 180). BA/PM proved it by
  exhaustion instead of arguing it, and then found a DIFFERENT mutant `A5` does kill — a colour-shaped
  RESTRUCTURE that drops the ordinary-capture branch's own `continue`, which passes 381/381 AND deep
  perft 32/32 with `A5` the only thing on this board that fails it. So `A5` keeps a claim, and it is a
  true one now. That is a THIRD outcome, neither of the two the pre-check anticipated.

  SCOPE, OUT-OF-SCOPE, SIZE `S` AND PRIORITY `P1` ARE UNCHANGED and were re-checked at the correction
  hop — the widened criteria bring acceptance UP TO `## Scope` rather than widening it. `src/moves.ts`
  is still md5 `0e247853ab2c05887c76105ff83d8621` with no `src/` diff against `main`, no test row was
  written, and the branch tip reads 381/381 on 16 files with skip count 0 and perft fast 24/24.
  TICKET FRONTMATTER MOVED WITH THIS COLUMN CHANGE, not left for a later sweep — the debt closed in
  `cb6515f` earlier today existed precisely because that step was skipped twice.

---

## In Review (WIP 1/3) — column note

ENTERED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-022`, subtask
  `engineer-abc022-implement`, Workflow 04). In Development 1/3 -> 0/3, In Review 0/3 -> 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN. Ticket frontmatter moved WITH the column, not left for a
  later sweep. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both, and the owner's standing
  merge authority is NOT deploy authority.

  THE FIX: two preconditions in the en-passant branch of `addPawnMoves` (src/moves.ts, +24 -12, of
  which the executable change is two conditions plus one local const; the rest is the comment at
  183-186 rewritten to state what the code now enforces):

      if (to === position.epSquare) {
        const capturedPawn = PAWN | (black ? 0 : BLACK);
        if (target === EMPTY && position.board[to - forward] === capturedPawn) { ... }
      }

  `to - forward` is the SAME square `apply.ts`'s `enPassantCaptureSquare` derives
  (`move.to + (isBlack(move.piece) ? 16 : -16)`), read out of that file rather than re-derived, so
  the generator and the applier cannot disagree about which pawn is being captured.

  THE ORDERING CHOICE, MADE DELIBERATELY AND WITH THE ALTERNATIVE IT REJECTED (the brief asked for
  this to be a decision, not a default): the two conditions sit AFTER the `to === position.epSquare`
  test. RE-DERIVED ON THIS BUILD rather than inherited from the ticket, with counters at the guard
  site over the standing 518,474-node walk: 331 evaluations after the test against 216,269 before
  it, a 653x difference, and 0 rejections either way. Both placements give an identical answer, so
  this is purely cost, and the cheap one was taken. The ticket's own 331 / 216,269 figures reproduce
  EXACTLY on this build, which is an independent second derivation of them.

  A MEASUREMENT TRAP CAUGHT AND CORRECTED MID-HOP, recorded because the wrong number was nearly
  published: the first counter run read 4,720 / 6,334,977 because the instrumented walk called
  `generateMoves` an extra time at every node for its own diagnostic. The residual 4,720 - 4,389 =
  331 is exactly the ticket's figure, and re-running on a plain legalMoves-driven walk reproduced
  331 / 216,269 / 0 directly. The instrument was inflating the denominator, not the code.

  RED BEFORE GREEN, PROVED NOT CLAIMED, AND THE INSTRUMENT VERIFIED FIRST: the new file reads 31
  failed / 27 passed against the unfixed tree with tsc exit 0 on that tree, so the red is a real red
  and not a broken build. The 27 that passed are exactly A5's four enemy-occupant rows, A6's two
  controls, and the purity rows that are clean today -- which confirms on the tip that A5 and A6 are
  regression guards rather than reds, as the corrected preamble says.

  EACH HALF PROVED LOAD-BEARING BY DELETION, ON DISJOINT NAMED SETS -- `## Test notes` item 3
  discharged by measurement, not by argument. One OS process per tree state (the board's recorded
  ABC-009 trap), every anchor asserted unique before writing, tsc exit 0 on every mutant:

      delete the empty-target condition   -> 8 tests fail  (A1 and A2, own-colour rows)
      delete the captured-pawn condition  -> 23 tests fail (A3, A2 and A4, half-(b) rows)
      intersection of the two sets        -> EMPTY
      union of the two sets               -> EXACTLY the 31 reds, byte-compared

  Neither condition subsumes the other. A2 is reached by both halves but never on the same row, so
  the disjointness holds at the level the ticket asks for -- named tests, not criteria.

  A5 RE-VERIFIED AGAINST THIS FILE RATHER THAN INHERITED. BA/PM measured the colour-shaped
  restructure on their own tree; it was rebuilt here against the delivered table (own-colour
  rejected at the top of the loop, the ordinary-capture `continue` dropped, so every enemy occupant
  falls into the ep branch). It passes A1, A2, A3, A4 and A6, passes the whole existing suite
  381/381, and fails ONLY A5 -- all four rows, both piece types, both colours. A5 is not inert and
  was not deleted.

  A7 WALKED BEFORE AND AFTER, one process per tree, roots and `fast` depths PARSED out of
  src/perft.test.ts rather than retyped, every FEN printed and re-parsed: all six per-root counts
  identical (206604 / 99950 / 46256 / 9738 / 63910 / 92016, total 518474), ep offered onto an
  occupied square 0 BOTH before and after -- and, stronger than the criterion asks, the ep move set
  itself is unchanged at 4,389 offered either way, so the fix rejects nothing reachable by play.

  PURITY (A4) ASSERTED OVER 128 BOARD BYTES AND FIVE SCALARS FIELD BY FIELD, NEVER VIA `toFen`, over
  every position this file uses -- a strict superset of the reproduction tables. It is ALSO asserted
  per make/unmake PAIR, and that is what catches the self-masking row
  `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`: on the unfixed tree it reads GREEN across the whole call and
  RED per pair, reproducing BA/PM's self-masking measurement on a second, independently built
  instrument.

  A9 IS MECHANICAL, NOT AN INSPECTION: `git diff --name-only main -- 'src/*.test.ts'` is EMPTY and
  `git status --short -- src/` reports exactly ` M src/legal.ts`, ` M src/moves.ts` and
  `?? src/moves.enpassant.test.ts`. The new tests went into a NEW file for exactly that reason.

  A11, BOTH HALVES. src/moves.ts 183-186 rewritten to state the preconditions the code below it now
  enforces. src/legal.ts 102-103 corrected to say WHY no ep move is offered -- a precondition of the
  en-passant branch, NOT a reading of the square as an ordinary capture, which was never true for an
  own-colour occupant and still is not -- and 104-105 left byte-for-byte, as the ticket demands.
  That NO executable line changed in src/legal.ts was verified by filtering the diff for
  non-comment lines, not by reading it.

  GATES AS THEY RAN: lint exit 0 after ONE autofix pass on this role's own new file (1 of 2
  self_fix_attempts spent; the two remaining `infos` are biome.json's schema-version and deprecated
  `recommended` field, PRE-EXISTING and identical on main, verified by stashing), typecheck exit 0,
  `npm test` 439/439 on 17 files (381/381 on 16 before, measured by running the suite on the tip
  rather than by subtraction), skip count 0 by the AGENTS.md command, perft fast 24/24, and
  `PERFT_DEEP=1` 32/32 EXACT in 36.55 s, run BEFORE hand-back as `## Test notes` requires. E2E
  `UNKNOWN - verify` (no UI surface until EPIC-006).

  NFR-001 / A10 MET ON EVERY CLAUSE, and these are the first throughput figures any role has taken
  on THIS ticket. PRIMARY (count): 331 evaluations, 0 rejections, denominator above. FLOOR:
  `npm run perft` 6,393,713 nodes/sec against >= 1,000,000, ~6.4x clear. AGGREGATE RATIO: 0.9926
  against >= 0.98 -- three trees, one OS process each, tree order rotated across three rounds, node
  count checksummed identical at 11,377,922 on every tree and every round. THE NULL CONTROL IS WHY
  NO PER-CELL OR PER-RUN COST IS CLAIMED: a `cmp`-verified byte-identical twin of the fixed tree
  read 0.9883 against the same pre-fix baseline and 0.9956 against the tree it is identical to, so
  100% of that deviation is instrument and it EXCEEDS the 0.74% apparent cost of the change. The
  catalog's standing caution held again. NFR-005 NOT measured -- the exclusion is structural, and
  the ticket says not to re-run the key benchmark to "confirm" it. plans/nfr-catalog.md NOT edited
  and no target moved. Figures are Apple M3 / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify`
  on any other hardware.

  SCOPE, OUT-OF-SCOPE, SIZE `S` AND PRIORITY `P1` DID NOT MOVE, and nothing in implementation pushed
  on them. `src/legal.ts`'s guards and `src/zobrist.ts` were NOT touched. NO perft position was
  added. `ABC-023` was NOT edited: `src/moves.ts` goes 0e247853ab2c05887c76105ff83d8621 ->
  6335b452fc21ffe2d0f902ecab930840, which invalidates its A4 pin exactly as already recorded and
  deliberately deferred to its own promotion hop. plans/nfr-catalog.md, ABC-010, ABC-011 and ABC-013
  were not touched either.

  ONE ITEM ROUTED RATHER THAN ABSORBED, and it is a candidate EIGHTH correction to a ticket that
  already carried seven: src/legal.ts lines 69-71 say "Outside it the oracle is unsound --
  `generateMoves` offers en-passant captures onto squares occupied by the mover's OWN piece". That
  is the SAME CLASS of false claim A11 was cut for, in the SAME file, and THIS FIX MAKES IT FALSE.
  It sits outside A11's cited 102-103 and outside this subtask's named boundary, so it was flagged
  for BA/PM instead of being silently rewritten -- but it should not ship as it stands.

---
