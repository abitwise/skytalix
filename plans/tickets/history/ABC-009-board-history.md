# ABC-009 — board history

> **Relocated from `plans/board.md` on 2026-08-10 by the Orchestrator.** The board had grown to
> 549,833 characters, 97% of it per-hop transition narrative. This file holds every board entry
> written about `ABC-009`, **verbatim** — only the surrounding `<!--` / `-->` HTML-comment delimiters
> were removed so the text renders. Nothing was rewritten, summarised or dropped, and none of it
> is duplicated back on the board.
>
> Ticket: [`ABC-009-legalmoves-position-mutation.md`](../ABC-009-legalmoves-position-mutation.md)

Entries appear in the order they stood in `board.md` (newest first, as the board was written).

---

## board header — _Updated: entry

_Updated: 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-a11`, Workflow 04): **`ABC-009` PASSES and moved `In Review` → `Ready for UAT`** — the one exit this role owns, and the return trip from the first backward move in this project's history. `In Review` **1/3 → 0/3**, `Ready for UAT` **0/4 → 1/4**; no limit approached, no override taken, no written reason owed. Every column carrying a numeric WIP header was re-verified against its line-item count (**10 counted columns, 0 wrong**; `Backlog`, `Done` and `Blocked` carry no numeric header). **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both, and the owner's standing merge authority is NOT deploy authority.** **`A11` IS NOW MET AND CLOSED AS A DIMENSION RATHER THAN AS A FOURTH SAMPLE:** `src/moves.castling.hardening.test.ts` goes **19 → 34 tests** — every own piece type on the king's home square (`QUEEN`, `ROOK`, `BISHOP`, `KNIGHT`, `PAWN`) and on the rook's (`QUEEN`, `BISHOP`, `KNIGHT`, `PAWN`), each in **at least two colour/side configurations**, plus one test that asserts **the quantifier itself** by deriving the piece-type universe from `parseFen` instead of restating it. **ZERO PRODUCTION LINES:** `src/moves.ts` still `0e247853ab2c05887c76105ff83d8621`, `git diff 8f540cf -- src/moves.ts` empty, all **fourteen** `main` test files unmodified (each diffed individually). **PROVED ON 20 MUTANTS OF THE DELIVERED DIFF, ONE PROCESS PER TREE:** all **nine** own-type admissions DIE — including the **three that passed the entire net before this hop** (own `ROOK` and own `PAWN` on the king's square, own `PAWN` on the rook's) — two admissions conditional on colour/side die to exactly the second-configuration row that exists for them, and **THE NINE BEHAVIOUR-EQUIVALENT MUTANTS ALL STILL SURVIVE at 34/34**, which is what proves the rows pin behaviour and not implementation shape. The harm reproduces on every kill: on the king's square one `legalMoves()` call **DESTROYS the occupant** for every own type (`e1`: 5/4/3/2/1 → 6); on the rook's square the position is **byte-identical**, so only the `FLAG_CASTLE` count can see it. Gates re-run on the tip: lint **0** after ONE autofix of this role's own formatting (**1 of 2** `self_fix_attempts`), typecheck **0**, `npm test` **371 passed (371) on 16 files**, build **0**, skip count **0**, `PERFT_DEEP=1` **32/32 exact in 36.04 s**. Test-integrity checker **exit 2 = an ERROR, not a pass** (no registry file created). E2E and auto-UAT oracles **`UNKNOWN - verify`**. **`NFR-001` NOT re-measured and no throughput figure here is this role's** — a test-only change cannot move it. **`A11`'s own `⚠️ NOT YET SATISFIED` marker is STALE and was DELIBERATELY LEFT STANDING** — `## Acceptance` is BA/PM's, and the role that wrote the rows must not be the role that stamps the criterion satisfied on a ticket where three roles in a row certified a sample as a dimension; routed to BA/PM as risk 1._

---

## board header — _Updated: entry

_Updated: 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`, Workflow 04): **`ABC-009` PASSES WITH RISKS and moved `In Security/NFR` → `Ready for UAT`** — the one exit this role owns. `In Security/NFR` **1/2 → 0/2**, `Ready for UAT` **0/4 → 1/4**; no limit approached, no override taken, no written reason owed. Every column's header count was re-verified against its line-item count (12 columns, 0 wrong). **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both, and the owner's standing merge authority is NOT deploy authority.** Gated against `security.asvs_level` **L1** and `security.block_on` **high**; `compliance_regime` is `[]`, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted. **NO REQUIRED FIX IS OUTSTANDING AND NO HIGH-SEVERITY ITEM EXISTS TO BLOCK ON.** **`NFR-001` RE-DERIVED ON THIS GATE'S OWN INSTRUMENTS AND MET ON BOTH CLAUSES** — floor 6,030,518 / 6,136,238 / 6,117,496 nodes/sec against ≥ 1,000,000, aggregate ratio **1.0062 and 0.9967** against ≥ 0.98 on two independent samples, deep lane 32/32 in 38.49 s; three trees in one process with a `cmp`-verified byte-identical twin as a null control. **THE PER-CELL QUESTION THE ENGINEER COULD NOT RESOLVE IS RESOLVED BY COUNTING INSTEAD OF TIMING:** the two added lines execute **396,350 times** over the sweep and **reject nothing in any cell**, cost 0.33–0.43 ns each in isolation, so the whole change costs **~0.01%** — true ratio ≈ 0.9999, **kiwipete ≈ 0.9998**, and the 0.9930 reading is ~35x the true deviation. Their ±1% reasoning **HOLDS** but the estimate is **optimistic**: measured ±2.0% per cell and a previously-uncharacterised ~±1% aggregate floor. **GUARD ORDERING, ROUTED HERE BY QE, IS ADJUDICATED AND THE BEHAVIOUR HALF DISCHARGED:** the five guards are a conjunction of side-effect-free predicates, hence **permutation-invariant** (99 comparisons, zero divergence, all six perft counts exact per variant), so **no later reorder can silently break the equivalence QE relied on**; ordering is a cost question only and **no change is asked for**. **SECURITY CLASSIFICATION RE-ASKED AT THE SOURCE AND UNCHANGED: RELIABILITY, NOT SECURITY** — no sink, no trust boundary, no user-supplied string reaches `src/moves.ts`, all grepped rather than assumed; no trigger manufactured. **TEN RISKS CARRIED, NONE HIGH, EACH WITH A NAMED OWNER.** `src/moves.ts` untouched by this role (`0e247853ab2c05887c76105ff83d8621`); `plans/nfr-catalog.md`'s `NFR-001` row updated and **no target moved**, verified by hashing the cells before and after._

---

## board header — _Updated: entry

_Updated: 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-review`, Workflow 04): **`ABC-009` PASSES WITH RISKS and moved `In Review` → `In Security/NFR`** — the one exit this role owns. `In Review` **1/3 → 0/3**, `In Security/NFR` **0/2 → 1/2**; no limit approached, no override taken, no written reason owed. `NFR-001` is triggered, so `In Security/NFR` is the next column rather than UAT. **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.** **62 MUTANTS RUN AGAINST THE DELIVERED DIFF; FIVE SURVIVE THE ENTIRE NET — all twelve criteria, all 337 delivered tests AND the `PERFT_DEEP=1` lane at 32/32 — AND NOT ONE OF THE FIVE IS A DEFECT IN THE CODE.** All five are defects in the **criteria**; the delivered fix is correct on every position that exposes them, which is why this is a pass and not a return to dev. `src/moves.ts` is **byte-identical** to `8f540cf` (md5 `0e247853ab2c05887c76105ff83d8621`, the digest the Engineer published). **THE FIFTH MUTANT THE ENGINEER HANDED OVER IS DECIDED: the colour-blind equivalence argument HOLDS and NO CRITERION IS OWED** — corroborated on a differently-built instrument (12,584 positions `parseFen` **accepts**, varying three squares jointly, three king placements, **both rights at once** and the black-to-move mirror, against the Engineer's 9,604 over two squares plus one extra piece) with **zero** divergence at `generateMoves`, at `legalMoves` and on purity; a colour criterion would pass on `main`'s unfixed tree, on the fix and on the mutant alike, so it is unfalsifiable and would be theatre. **THE SOFT SPOT NOBODY HAD EXAMINED — a criterion set written over signals that AGREE — IS NOW EXAMINED, AND IT IS WHERE ALL FIVE LIVE:** such a set hides the dimensions it holds **constant**, and two are constant across all twelve rows — **`G-1`** the impostor's PIECE TYPE (`A5`/`A6` use a bishop and a knight, satisfying "at least two piece types" literally, while the rule quantifies over ALL other bytes; a guard reading either home square as "the mover's KING/ROOK **or QUEEN**" is green on everything, and on `4k3/8/8/8/8/8/8/K3Q2R w K - 0 1` one `legalMoves` call **DESTROYS A QUEEN** and writes a king over it), and **`G-2`** HOW MANY of a side's rights are held (every criterion FEN carries at most one right per side except the reproduction FEN where BOTH castles are invalid, so nothing separates *"this option was rejected"* from *"the option loop was abandoned"* — `continue` → `break` on the **rook** guard **DELETES A LEGAL CASTLE** on `4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1`, 16 moves / 1 castle becoming 15 / 0, and is green on all twelve; the **same** mutation on the **king** guard is genuinely equivalent because both options share `kingFrom` — one token, two opposite verdicts, one green). **`A8` AND `A9` CANNOT COVER EITHER DIMENSION, STRUCTURALLY, AND BY THE ENGINEER'S OWN ARGUMENT:** in any legally-reachable position the right being set implies both pieces are home, so the two new guards never fire and a mutation to them cannot change a perft node — measured, not argued, all five survive `PERFT_DEEP=1` at 32/32. **CLOSED IN TESTS ONLY, ZERO PRODUCTION LINES:** `src/moves.castling.hardening.test.ts` is NEW (19 tests, all green on the delivered fix), the Engineer's `src/moves.castling.test.ts` is **untouched**, and **every one of the fourteen test files on `main` is unmodified — checked by diffing each individually**, so `A8`'s line-level requirement holds for this role's work too. The rows are proved load-bearing by re-running the whole campaign with them present: **47 → 53 killed, 15 → 9 survived**, with **six mutants dying to these rows and nothing else in the suite** — and **the nine behaviour-equivalent survivors still survive**, which is what proves the rows pin observable behaviour rather than the shape of the implementation. **`A7` KILLED NOTHING ACROSS 62 MUTANTS** (the ticket already says it asserts count equality rather than correctness; measured on one build at refinement, now on 62). Gates re-run on the tip by this role, before and after the added rows: lint 0 (my file alone reports zero), typecheck 0, build 0, `npm test` **337/337 then 356/356 on 16 files**, skip count **0** both times by the `AGENTS.md` command, deep lane **32/32 exact in 38.35 s**. All fifteen `A1`–`A6` counts re-derived on a **fifth** independent derivation over 128 bytes and five scalars with **zero** bytes changed; both over-rejection controls hold (kiwipete 48 / 2, `r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1` 26 / 2). Test-integrity checker **exit 2** (`.grugops/test-skips.md` absent) recorded as an **ERROR and not a pass**, no registry file created; E2E and the auto-UAT oracles `UNKNOWN - verify`. **`NFR-001` was NOT re-measured by this role, deliberately — that gate follows and owns it**; the caveat that matters is the Engineer's own per-cell floor of ~±1%, larger than any signal, so **kiwipete's 0.9930 is NOT a regression**. Routed and not discharged here: `G-1`/`G-2` as criteria text and `A7`'s null discrimination to **BA/PM**, the ordering rationale to **Security/NFR**. `ABC-022` half (b) still live **by design**. Five notes published, **no `finding`** among them (none is admissible on this task) and **nothing self-stamped**; no `index.md`/`index.jsonl` hand-faked. Subtask claimed and closed **by hand** — this install has no `scripts/`. **Security/NFR was NOT enqueued — the Orchestrator owns decompose→enqueue.**

---

## board header — _Updated: entry

_Updated: 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-009`, subtask `engineer-abc009-implement`, Workflow 04): **`ABC-009` IMPLEMENTED AND MOVED `In Development` → `In Review`** — the one board move this role owns. `In Development` **1/3 → 0/3**, `In Review` **0/3 → 1/3**; no limit approached, no override taken, no written reason owed. **ONE PRODUCTION FILE CHANGED (`src/moves.ts`, +30 −8) AND ONE TEST FILE ADDED (`src/moves.castling.test.ts`); NOT ONE EXISTING TEST FILE TOUCHED — verified at LINE level as `A8` demands, not by inspection:** `git diff --name-only -- 'src/*.test.ts'` is **empty**, and the new tests went into a NEW file precisely so that claim is mechanical. **THE FIX:** two guard conditions in `addCastlingMoves` plus a `rookFrom` field on the `CastleOption` table, read as **IDENTITY** tests (the mover's own `KING` byte on the king-home square, its own `ROOK` byte on the rook-home square) and placed ABOVE the existing emptiness and through-check tests, a byte compare being cheaper than an emptiness scan and far cheaper than an attack scan. **THE STRUCTURAL CHOICE THE TICKET LEFT OPEN IS RECORDED WITH THE ALTERNATIVES IT REJECTED:** `rookFrom` joins the precomputed table and the guards live at the **generator** layer, so `generateMoves` and `legalMoves` are both fixed by one change; **rejected** were importing `CASTLE_ROOK_MOVE` from `apply.ts` (apply.ts already imports moves.ts — a MODULE CYCLE for a four-entry table), deriving the square arithmetically per call (the module's own header commits to precomputed tables over per-call arithmetic in the innermost search loop, `NFR-001`), and filtering at the `legalMoves` layer (`## Scope` requires the castle not be OFFERED by `generateMoves` either). **ALL FIFTEEN POST-FIX COUNTS IN `A1`–`A6` MATCHED THE DELIVERED DIFF ON THE FIRST RUN — NO DISCREPANCY, AND NOTHING WAS ADJUSTED IN EITHER DIRECTION:** no test was bent to the code and no criterion was edited. That makes **three** independent derivations of those counts (BA/PM's seven candidate builds, the Orchestrator's own fix, this diff), and the kiwipete control reproduces too — 48 legal moves, 2 castles still offered, position pure. **RED BEFORE GREEN, PROVED NOT CLAIMED:** the new file read **23 failed / 10 passed** against the unfixed tree, and the 10 passing are exactly the four legal-castle controls and the six `A7` purity rows — which confirms on the TIP that `A7` was **absent rather than failing**. **THE LOAD-BEARING DELETIONS FAIL DISJOINT NAMED SETS ON THE DELIVERED DIFF** (re-measured here because BA/PM measured them on mutants of `main`): deleting the **king** condition fails `A4`+`A5` and nothing else, deleting the **rook** condition fails `A3`+`A6` and nothing else, weakening both to **occupancy** fails `A5`+`A6` only, and swapping the two squares fails 19 assertions including `ABC-004`'s castling tests and kiwipete `perft(1)`. All four legal-castle controls survived every mutant, so none of the reds is a false red. **A FIFTH MUTANT SURVIVES ALL TWELVE CRITERIA AND THE WHOLE SUITE, AND IT IS REPORTED RATHER THAN BURIED BECAUSE OPEN ITEM (1) SAYS SEVEN IS NOT PROVEN COMPLETE — BUT IT IS NOT A DEFECT, IT IS BEHAVIOUR-EQUIVALENT, AND THAT WAS MEASURED:** colour-blind (`pieceType`) tests instead of full-byte identity read **337/337 green** and typecheck clean, yet over an exhaustive 676-board space (13×13 bytes on the two home squares × 4 castles) the two rules read the squares differently on exactly **12** boards and the generator AGREES on all 12 — an enemy king or enemy rook there attacks a square the existing through-check test requires unattacked — and re-run with every possible third piece on every other square (**8,928** boards) the divergence is still **zero**. Same class as `ABC-011`'s two behaviour-equivalent cost mutants that were deliberately not pinned; it independently corroborates BA/PM's "wrong-colour rook is unreachable" measurement, now exhaustively and on the delivered fix. **GATES, AS THEY RAN:** `npm install` exit 0 (no dependency change, `package.json` and `package-lock.json` untouched), lint exit 0 with **zero** autofix passes needed (0 of 2 self-fix attempts spent), typecheck exit 0, `npm test` **337/337 on 15 files** (304/304 on 14 BEFORE, measured by running the suite on the tip rather than by subtraction, matching the Orchestrator's figure at the pull), build exit 0, **skip count 0** by the `AGENTS.md` command. **`A9`'s DEEP LANE IS 32/32 EXACT in 36.93 s, RUN BEFORE REVIEW as the ticket requires — nobody had run it on either tree for this ticket.** E2E `UNKNOWN - verify` (the slot is unknown; no UI surface until `EPIC-006`). Test-integrity checker **exit 2** — "cannot read the registry file"; that is "could not run", is **not** the exit-1 human-only short-circuit and is **NOT A PASS**, and no registry file was created because an agent may not self-author a justification to clear its own gate. Auto-UAT oracles `UNKNOWN - verify` (`scripts/check-uat-oracles.js` absent, non-blocking). **`NFR-001` / `A10` MET ON BOTH CLAUSES, AND THIS IS THE FIRST THROUGHPUT FIGURE ANY ROLE HAS MEASURED ON THIS TICKET** — the 6.04M–6.21M in the ticket is quoted from `plans/nfr-catalog.md`, which neither the Orchestrator nor BA/PM measured. **FLOOR:** `npm run perft` on the delivered tree reads **6,078,622 / 6,131,325 / 6,151,559 nodes/sec** over three runs — inside the catalog's standing band, ~6.1x the ≥ 1M bar. **RATIO:** three trees in ONE process — pre-fix (`main`'s `src/`), delivered, and a **byte-identical twin of the delivered tree as a null control by identity** — 7 rounds, tree AND cell order rotated every round, discarded warm-up, medians of per-round rates, node counts checksummed across every tree and round (238,936,362 nodes), **two fully independent samples** in their own processes: aggregate **post/pre = 0.9987 and 0.9974** against the ≥ 0.98 bar, **MET on both**; worst single cell across both samples 0.9880. **THE CATALOG'S STANDING CAUTION WAS FOLLOWED AND IT IS THE REASON NO PER-CELL CLAIM IS MADE:** the **structurally-zero** cells were read FIRST — position-3 and position-6 hold NO castling rights and `makeMove` can only clear rights, never create them, so the two added byte compares execute **zero** times anywhere in those subtrees and their true delta is exactly zero, yet they read **1.0084 / 0.9918 / 1.0041 / 0.9989**; the identity twin read 1.0087 and 0.9983 aggregate and up to 1.0126 per cell. **The instrument's own floor is therefore about ±1% per cell, larger than any signal** — the bar is met with margin and **no per-cell regression or improvement is claimed**, the kiwipete 0.9930 reading in particular sitting inside noise established by cells whose delta is provably zero. **Denominator fence carried, not quoted: 97.3% of the nodes perft counts are free leaves, so this is generation-with-free-leaves and is NEVER evidence for `NFR-005`.** `NFR-005` was **not** measured and the key benchmark was **not** re-run — the exclusion is structural and the ticket says so. **NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE** (this project's standing rule); figures are Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 and `UNKNOWN - verify` on any other hardware. **NO NFR TARGET MOVED, `plans/nfr-catalog.md` WAS NOT EDITED, and no ticket other than `ABC-009` was touched.** **QE/E2E and Security/NFR were NOT enqueued** — the Orchestrator owns decompose→enqueue. **NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.**

---

## Backlog (WIP unlimited) — column note

ABC-023 cut 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-a13-verify`,
  Workflow 07) at ABC-009's last verification hop, so that three MEASURED items stop living only in
  context notes. It is a HARDENING ticket and not a defect ticket: the delivered src/moves.ts is
  correct on every item, the expected production diff is zero lines, and what is missing is test net.
  Three classes, each with a mutant measured to survive the full 381-test suite: the castle's
  DESTINATION square (dropping it from kingPath survives the suite AND the standing PERFT_DEEP=1
  32/32 lane, and it is the only class on this board whose leaking position is LEGALLY REACHABLE),
  the joint occupant PAIR (both home squares wrong at once), and doubling that varies one axis (9 of
  13 type/table pairs, so a single-type admission conditional on the other axis is never exercised).
  S / P2 with an escalation trigger to P1 the moment any ticket proposes to change addCastlingMoves,
  the CastleOption tables or the through-check loop — EPIC-004's RF-2 included. The trigger has NOT
  fired. It sits in Backlog because its one ordering dependency, ABC-009 merging, is not satisfied,
  and because a P2 hardening ticket should compete for Ready at a refinement pass rather than be
  slipped in by the hop that wrote it. NO COLUMN COUNT CHANGED — Backlog carries no numeric WIP
  header, and no other ticket moved.

  ABC-011 cut 2026-07-30 by BA/PM from the same architecture audit, on the recommendation in
  ADR-0002's `Out of scope … en-passant hashing defect` section — a third correctness defect in
  merged, Done, 100%-covered code (`src/zobrist.ts:71` hashes the en-passant file whenever
  `epSquare` is set, not only when an ep capture is available, so FIDE-identical positions hash
  differently and threefold repetition under-detects). ADR-0002 recommended it and did not cut it;
  ticketing is BA/PM's. `S` / `P2` is BA/PM's own call, agreeing with the ADR: latent (no consumer
  of the key list exists yet — `gameStatus`'s `positionCounts` has no supplier anywhere in `src/`)
  and the error direction is safe (a legitimate draw is missed, never a false draw declared).
  Ratification of ADR-0002 clause 2 widened its blast radius to four epics without moving its
  severity or reachability, so it carries a sequencing escalation trigger rather than a higher
  priority. INDEPENDENT of ABC-009 and ABC-010 — different module, and unlike those two nothing
  makes this one unreachable. Not promoted to Ready; that gate is a separate step.

  ABC-009 and ABC-010 cut 2026-07-29 by BA/PM from the architecture audit
  (task `architecture-audit-2026-07-29`) — two correctness defects found in merged, Done,
  100%-covered code. Both are LATENT today (`parseFen` has no user-facing caller) and go live
  when EPIC-003 accepts a FEN from a user, which is why ABC-010 (the boundary) is P1 and
  ABC-009 (the invariant behind it) is P2 with a stated escalation trigger. They are
  independent of each other by design; neither is promoted to Ready — the Definition of Ready
  gate is a separate step.

  EPIC-001 left Backlog 2026-07-24 — decomposed into ABC-001..ABC-007 (+ the ABC-008 spike),
  all merged and Done; it now sits in the Done column below. EPIC-002..006 remain
  decomposed-later epics above: each still needs `epic-to-tickets` (Workflow 03) before any
  ticket can be pulled. Nothing is Ready right now — that is the next planning step, not an
  oversight.

---

## Ready (WIP 1/8) — column note

ABC-009 LEFT THIS COLUMN 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04)
  — pulled to In Development on the owner's direct request ("implement ABC-009"). Ready 3/8 -> 2/8;
  its row now sits under In Development. THE DISPLACEMENT PATTERN RECORDED ABOVE IS BROKEN, not
  continued: the third consecutive call went TO the rules-core defect, not past it. ABC-013 and
  ABC-022 stay, unmoved and unchanged; ABC-022 is now the one displaced P1 and its own escalation
  trigger is still unspent.

  IT WAS NOT PULLED AS IT STOOD, and the delay was the FACTORY'S, not the owner's. The Definition of
  Ready's "acceptance criteria clear, testable and measurable" row FAILED at this pull. The ticket's
  own DoR block ticked it green on 2026-07-31 and nothing re-checked it for nine days; the
  Orchestrator's pre-check left it AMBER with four named specifics; BA/PM re-derived and found SEVEN,
  THREE of which no pre-check named. The ticket was corrected IN PLACE inside Ready first (no board
  move, Ready stayed 3/8 throughout that hop) and the pull is of the corrected ticket. Six acceptance
  criteria became ten, original order preserved.

  THE BLOCKING DEFECT, STATED PLAINLY BECAUSE IT IS THE SECOND TIME THIS BOARD HAS SEEN IT: a
  100%-passing acceptance set did not require fixing the harm the ticket's own P1 escalation was
  written about. `## Scope` named two castling preconditions — king home, rook home — and only the
  rook half was tested. Measured on a mutant, not argued: a fix implementing the rook precondition
  ALONE passed all six original criteria, the suite 304/304 with skip count 0, and deep perft 32/32,
  while `legalMoves` still offered an illegal FLAG_CASTLE and still wrote a phantom king on four
  FENs. Delete the king precondition from a correct fix and NOT ONE criterion failed.

  THE THREE-WAY CROSS-CHECK IS ON THE RECORD. BA/PM established the corrected numbers on seven
  candidate builds patched into a COPY of main's src/ outside the repo. The Orchestrator then
  re-derived all fifteen post-fix counts (A1 3, A2 3, A3 5, A4 16x4, A5 19/17/13/19, A6 12/7/12/5)
  on an INDEPENDENTLY WRITTEN fix, plus all twelve "today" parentheticals and all four three-call
  signatures on unpatched main — every one matched, and the suite baseline read 304/304 as claimed.
  Two independently written fixes agreeing on fifteen counts is why this ticket is being pulled on a
  PASS rather than a second amber. NO src/ FILE WAS MODIFIED BY EITHER ROLE: git diff --stat main --
  src/ is empty and src/moves.ts still hashes fb4fa40934e768dffeaeed0b43548842.

---

## In Development (WIP 0/3) — column note

EXITED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-009`, subtask
  `engineer-abc009-implement`, Workflow 04): ABC-009 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. The In Review comment below carries what is handed over rather than
  restating it, and the full record is in `.grugops/context/ticket-to-pr-ABC-009/notes/`.

  ONE PRODUCTION FILE CHANGED AND ONE TEST FILE ADDED; NOT ONE EXISTING TEST FILE TOUCHED --
  verified at line level rather than by inspection, which is what A8 requires:
  `git diff --name-only -- 'src/*.test.ts'` is EMPTY, and `git status --short -- src/` reports
  exactly ` M src/moves.ts` and `?? src/moves.castling.test.ts`. The new tests went into a NEW
  file precisely so that claim is mechanical.

  THE FIX: two guard conditions in `addCastlingMoves` (src/moves.ts), plus a `rookFrom` field on
  the `CastleOption` table. `+30 -8` lines. The two home squares are read as IDENTITY tests --
  the mover's own KING byte on the king-home square, its own ROOK byte on the rook-home square --
  and they sit ABOVE the existing emptiness and through-check tests, because a byte compare is
  cheaper than an emptiness scan and far cheaper than an attack scan.

  THE STRUCTURAL CHOICE, WITH THE ALTERNATIVE IT REJECTED (the fix site was NOT ruled on, so this
  is the engineer's call and is recorded as one): the rook's home square is a new `rookFrom` field
  on the CastleOption table (h1=7, a1=0, h8=119, a8=112), and the guards live in
  `addCastlingMoves` -- the generator layer -- so `generateMoves` and `legalMoves` are BOTH fixed
  by one change. REJECTED: (a) importing `CASTLE_ROOK_MOVE` from apply.ts, which is where the
  rook's leg already lives -- rejected because apply.ts already imports from moves.ts, so this
  would create a MODULE CYCLE for a four-entry table; (b) deriving the rook square arithmetically
  from `kingTo` per call, rejected because the module's own header commits to precomputed tables
  over per-call arithmetic in the search's innermost loop (NFR-001); (c) filtering at the
  `legalMoves` layer, rejected because `## Scope` requires the castle not be OFFERED by
  `generateMoves` either, and a legalMoves-layer filter leaves the exported generator emitting a
  move the rules forbid.

  ALL FIFTEEN POST-FIX COUNTS IN A1-A6 MATCHED THE DELIVERED DIFF ON THE FIRST RUN. NO
  DISCREPANCY WAS FOUND AND NOTHING WAS ADJUSTED IN EITHER DIRECTION -- no test was bent to the
  code and no criterion was edited. A1 3 moves / 0 castles, A2 [3,3,3], A3 5, A4 16/16/16/16,
  A5 19/17/13/19, A6 12/7/12/5. The kiwipete control also reproduces: 48 legal moves with 2
  castles STILL offered and the position pure across the call. That is now THREE independent
  derivations of those counts (BA/PM's seven candidate builds, the Orchestrator's own fix, this
  diff) rather than two.

  RED BEFORE GREEN, PROVED RATHER THAN CLAIMED (quality.tdd is `encouraged`): the new file was
  run against the UNFIXED tree first -- 23 failed / 10 passed of 33. The 10 that passed are
  exactly the four legal-castle controls and the six A7 purity rows, which confirms the ticket's
  "A7 today: passes" ON THE TIP and that A7 was ABSENT rather than failing. Every one of the 23
  defect assertions was red before the fix existed.

  THE THREE LOAD-BEARING DELETIONS FAIL DISJOINT NAMED SETS ON THE DELIVERED DIFF, not on a
  candidate -- test note 5, re-measured here because BA/PM measured it on mutants of main:
    delete the KING condition   -> A4 + A5 fail, NOTHING else (16 assertions, 321/337)
    delete the ROOK condition   -> A3 + A6 fail, NOTHING else (5 assertions, 332/337)
    weaken BOTH to OCCUPANCY    -> A5 + A6 fail only            (12 assertions, 325/337)
    swap the two squares        -> 19 fail, incl. ABC-004 castling and kiwipete perft(1) (A8)
  All four legal-castle controls survived every mutant, so none of the reds is a false red. The
  mutations were applied in place and reverted from a pristine copy, with src/moves.ts re-hashed
  to 0e247853ab2c05887c76105ff83d8621 after each one.

  A FIFTH MUTANT SURVIVES ALL TWELVE CRITERIA AND THE WHOLE SUITE, AND IT IS REPORTED BECAUSE
  OPEN ITEM (1) SAYS SEVEN IS NOT PROVEN COMPLETE. Weakening both identity tests to COLOUR-BLIND
  (`pieceType(...) !== KING/ROOK` instead of the full byte) reads 337/337 green and typechecks
  clean. IT IS NOT A DEFECT -- it is BEHAVIOUR-EQUIVALENT, and that was measured rather than
  argued: exhaustively over all 13x13 byte combinations on the two home squares x 4 castles (676
  boards), the two rules read the squares differently on exactly 12 boards and the generator's
  output AGREES on all 12, because an enemy king or enemy rook on those squares attacks a square
  the existing through-check test requires unattacked. Re-run with every possible third piece on
  every other board square (8,928 boards): still ZERO divergence. So the criteria cannot kill it
  and SHOULD not -- this is the same class as ABC-011's two behaviour-equivalent cost mutants that
  were deliberately not pinned. It independently corroborates BA/PM's "a wrong-colour rook is
  unreachable" measurement, now at the delivered fix and over both squares exhaustively rather
  than on two FENs. The delivered fix is STRICTER than reachability requires, which is the safe
  direction.

  GATES, AS THEY RAN: npm install exit 0 (no dependency change, package.json and package-lock.json
  untouched), lint exit 0 with ZERO autofix passes needed (0 of 2 self-fix attempts spent),
  typecheck exit 0, npm test 337/337 on 15 files (304/304 on 14 files BEFORE, measured by running
  the suite on the tip rather than by subtraction, and matching the figure the Orchestrator
  recorded at the pull), build exit 0. Skip count 0 by the AGENTS.md command. A9 DEEP LANE 32/32
  EXACT in 36.93 s, run BEFORE review as the ticket requires -- nobody had run it on either tree
  for this ticket. E2E: UNKNOWN - verify (the AGENTS.md slot is unknown; no UI surface and no
  runnable game until EPIC-006). Test-integrity checker: exit 2, run exactly as Workflow 05 step 3
  specifies -> "cannot read the registry file"; `.grugops/test-skips.md` does not exist. Exit 2 is
  "the checker could not run", is NOT the exit-1 human-only short-circuit and is NOT A PASS. NO
  registry file was created -- an agent may not self-author a justification to clear its own gate,
  and with a skip count of 0 nothing is owed one. Auto-UAT oracles: UNKNOWN - verify,
  scripts/check-uat-oracles.js does not exist in this install (non-blocking per Workflow 05). The
  two lint INFOS are pre-existing biome.json schema/deprecation notices, unrelated to this ticket
  and NOT touched.

  NFR-001 / A10: MET ON BOTH CLAUSES, AND IT IS THE FIRST THROUGHPUT MEASUREMENT ANY ROLE HAS
  TAKEN ON THIS TICKET. The 6.04M-6.21M figure in the ticket is quoted from plans/nfr-catalog.md
  and was NOT measured by the Orchestrator or BA/PM; these numbers are this role's own.
    FLOOR: `npm run perft` on the delivered tree reads 6,078,622 / 6,131,325 / 6,151,559 nodes/sec
    over three runs -- 6.08M-6.15M, INSIDE the catalog's standing band, about 6.1x the >= 1M bar.
    RATIO: three trees imported in ONE process -- pre-fix (main's src), delivered, and a
    BYTE-IDENTICAL TWIN of the delivered tree as a NULL CONTROL BY IDENTITY -- 7 rounds, tree AND
    cell order rotated every round, discarded warm-up, medians of per-round rates, node counts
    checksummed across every tree and round (238,936,362 nodes), two fully independent samples in
    their own processes. AGGREGATE post/pre = 0.9987 and 0.9974 against the >= 0.98 bar: MET on
    both samples. Worst single cell across both samples 0.9880 (startpos), still above the bar.
    THE CATALOG'S CAUTION WAS FOLLOWED AND IT IS THE REASON NO PER-CELL CLAIM IS MADE. The
    structurally-zero cells were read FIRST: position-3 and position-6 carry NO castling rights,
    and makeMove can only clear rights and never create them, so ABC-009's two added byte compares
    execute ZERO times anywhere in those two subtrees -- their true delta is exactly zero, and they
    read 1.0084 / 0.9918 / 1.0041 / 0.9989 across the two samples. The identity twin read 1.0087
    and 0.9983 aggregate and up to 1.0126 per cell. SO THE INSTRUMENT'S OWN FLOOR IS ABOUT +/-1%
    PER CELL, WHICH IS LARGER THAN ANY SIGNAL: the bar is met with margin, and NO per-cell
    regression or improvement is claimed from this instrument -- in particular the kiwipete 0.9930
    reading is inside the noise established by cells whose delta is provably zero.
    DENOMINATOR FENCE, carried not quoted: 97.3% of the nodes perft counts are FREE LEAVES, so
    this is generation-with-free-leaves and is NEVER evidence for NFR-005.
    NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE -- this project's standing rule; the figures
    live here and in the notes, with their machine: Apple M3 (Mac15,13) / Node v24.12.0 /
    Darwin 25.5.0 arm64, and UNKNOWN - verify on any other hardware.
  NFR-005 was NOT measured and the key benchmark was NOT re-run -- the exclusion is structural and
  the ticket says so explicitly. NO NFR TARGET MOVED and plans/nfr-catalog.md was NOT edited.

---

## In Development (WIP 0/3) — column note

ENTERED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04) — the
  `Ready for Dev -> In Development` exit this role owns, taken here as `Ready -> In Development`
  because this board has no occupant of `Ready for Dev` and never has. In Development 0/3 -> 1/3,
  Ready 3/8 -> 2/8. NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed for the count.
  Width used is 1 against `queue.wip_limit` 3, and not because of the cap: the ticket-to-pr hops are
  genuinely serial, so dev runs alone and QE and Security/NFR are enqueued after it rather than
  beside it. `queue.claim_cap` 2 is unspent. Queue was empty at the pull.

  THE DEFINITION-OF-READY GATE PASSED HERE, on the corrected ticket and on the second pass. The
  first pass FAILED and the Ready-column comment carries what failed, what was measured on a mutant,
  and the fifteen-count three-way cross-check behind the pass. Read the ticket's correction block
  under `## Acceptance` before designing anything: it decides the identity-versus-occupancy question,
  the layer each criterion is asserted at, and every post-fix count, and each ruling names the
  alternative it rejected.

  THREE THINGS THE ENGINEER INHERITS AS OPEN, none of them a blocker:
  (1) SEVEN IS NOT PROVEN COMPLETE. This board's own history is a pre-check naming three, BA/PM
      finding five, then QE finding SIX mutants past all twelve corrected criteria (ABC-018,
      2026-08-09). Expect A1–A10 to be insufficient and say so if they are.
  (2) THE POST-FIX COUNTS CAME FROM CANDIDATE FIXES, not from the delivered one. Two independent
      derivations agree, which is strong but is not the same as the real diff. A discrepancy at the
      implementation hop is to be RAISED, never silently adjusted to match the code.
  (3) THE FIX SITE IS NOT RULED ON. `addCastlingMoves` and `legalMoves` are observationally
      equivalent today because generateMoves has no non-test caller but legalMoves — BA/PM stated
      that against its own criteria, which are written at the legalMoves layer. `## Scope` is the
      requirement; the mechanism is the engineer's call.

  NFR-001 IS TRIGGERED and its bar is now machine-independent: perft >= 1M nps AND ratio >= 0.98
  against the same measurement on the pre-fix tree in the SAME process. No throughput figure has
  been measured by any role on this ticket — the Orchestrator did not run `npm run perft` and neither
  did BA/PM. The 6.04M-6.21M baseline is quoted from plans/nfr-catalog.md, which is the authority.
  Read that catalog's standing benchmarking caution AND its denominator fence (97.3% of the nodes
  perft counts are free leaves) before measuring.

  EXITED 2026-08-09 by the Software Engineer (task `ticket-to-pr-ABC-018`, subtask
  `engineer-abc018-implement`, Workflow 04): ABC-018 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. Full record in the ticket's `## Implementation` section; the In Review
  comment below carries what is handed over rather than restating it.

  TWO NEW FILES, NO EXISTING FILE UNDER src/ TOUCHED -- verified, not asserted:
  `git diff --numstat main -- src/` is EMPTY, and the only entries `git status --short -- src/`
  reports are src/frame.ts (222 lines, 94 of them code) and src/frame.test.ts. src/render.ts and
  src/glyph-mode.ts in particular are byte-identical to merged main at 7e0923c.

  GATES, AS THEY RAN: npm install exit 0 (no dependency change, package-lock untouched), lint
  exit 0 after ONE autofix pass (`npx biome check --write src/frame.test.ts` -- import ORDER and
  formatting only, lint.autofix is true, self-fix attempt 1 of 2), typecheck exit 0, npm test
  297/297 on 14 files (277 on 13 BEFORE, measured by running the suite without this file rather
  than by subtraction), build exit 0. Skip count 0 by the AGENTS.md command. src/frame.ts at 100%
  on all four coverage axes. E2E: UNKNOWN - verify (the AGENTS.md slot is unknown; no UI surface
  and no runnable game until EPIC-006). Test-integrity checker: exit 2 -- run exactly as Workflow
  05 step 3 specifies, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` -> "cannot read the registry file". Exit 2 is "the checker could not run", is
  NOT the exit-1 short-circuit and is NOT a pass; NO registry file was created, because an agent
  may not self-author a justification to clear its own gate, and the skip count is 0 so nothing
  is owed a justification. Auto-UAT oracles: UNKNOWN - verify, scripts/check-uat-oracles.js does
  not exist in this install (non-blocking per Workflow 05). The two lint INFOS are pre-existing
  biome.json schema/deprecation notices, unrelated to this ticket and NOT touched.

  RISK-005's BUILD OBLIGATION -- the one thing on this ticket that survives its discharged
  merge-order constraint -- IS MET, AND IT WAS CHECKED MECHANICALLY RATHER THAN ASSERTED. The
  glyph mode is a REQUIRED parameter of assembleFrame with NO default. src/frame.ts imports
  exactly one thing, `import type { GlyphMode } from "./render.ts"`, which is erased at runtime,
  so the module cannot default the mode, cannot hardcode one (its only mode literal is the
  `mode === "ascii"` comparison inside the sanitizer) and cannot re-derive one: `process.` appears
  only in prose, and the only isTTY/rows reads in the file are of the INJECTED SINK. ABC-015 owns
  the rule and runs it once; its answer arrives here exactly as it arrives at renderBoard.

  FIVE STRUCTURAL CHOICES THE TICKET LEFT OPEN ARE DECIDED, each with its reason in the module
  header and in the ticket's `## Implementation`:
    (1) W is derived from the PANEL rows only. "The widest row the assembled regions emit" is
        circular if the message region is inside the maximum -- one long rejection would widen the
        frame, which is the one way content can break 4a's constant geometry. The panels set W;
        the message region is bounded BY it. Two tests kill the other reading.
    (2) EVERY ROW EXCEPT THE PROMPT ROW IS PADDED TO EXACTLY W. That is what makes the in-place
        redraw leave NO CHARACTER of the previous frame behind: ED(0) clears from the cursor down,
        but a row shorter than the row it overwrites leaves the old tail to its right, and the
        Security bar allows only the two escape sequences this module emits -- so a per-row
        erase-to-end-of-line was not available. The prompt row is deliberately NOT padded: padding
        it would leave the cursor at column W instead of at that row's start.
    (3) The packing search runs DOWNWARD, because N and the marker are coupled -- dropping an item
        raises N, which can lengthen `(+N more)`, which can drop another item.
    (4) The sanitizer runs over EVERY string placed into the frame, panel rows included, which is
        what the ticket's "any supplied string ... before it is placed" says and what makes
        acceptance 2a hold over the WHOLE emitted stream by construction.
    (5) Widths are counted in UTF-16 units, which equal code points for everything this frame can
        carry. A terminal's DISPLAY columns are a third quantity and nothing in this epic supplies
        one -- stated in the header rather than left to be discovered.

  NFR-002: BOTH HALVES MEASURED SEPARATELY, WITH THE MACHINE AND THE PLY COUNT, AND NO NUMBER IS
  QUOTED FROM ANY EXISTING NOTE. Out of tree, own harness in its own process, the game replay and
  parseFen hoisted OUT of every timed region (the catalog's own caution, which produced a 2.08x
  false miss on ABC-012), a discarded warm-up round, 11 rounds per cell, cell order rotated every
  round, medians of per-round means, TWO fully independent samples. Apple M3 (Mac15,13) / Node
  v24.12.0 / Darwin 25.5.0 arm64, UNKNOWN - verify on any other hardware. Denominator: a 23-row,
  18-column frame, 418 characters serialized.
    COMPUTE (renderBoard + assembleFrame): 5.97/6.03 us @40, 6.02/6.07 us @120, 6.03/6.06 us @300.
    WRITE, in-memory sink (serialization only): 0.64/0.64, 0.64/0.65, 0.65/0.65 us.
    WRITE, fs.writeSync to /dev/null:          1.67/1.66, 1.66/1.66, 1.67/1.67 us.
    WRITE, fs.writeSync to a regular file:     2.43/2.48, 2.44/2.46, 2.44/2.48 us.
    SUM (the bar): 0.0084-0.0092 ms worst case against 16 ms -- MET, about 0.05% of the budget.
  THREE LIMITS TRAVEL WITH THESE FIGURES: the compute half is a LOWER BOUND (ABC-016 and ABC-017
  are stubs built outside the clock and ABC-013's SAN derive is not in it at all); "write" was
  measured three ways because "written to a non-TTY sink" honestly means three different things,
  and all three are reported rather than the flattering one; and the in-place TTY path was NOT
  timed separately, because the bar names a non-TTY sink and what a real terminal does with the
  bytes is not observable in-process. NO wall-clock assertion was added to the suite -- this
  project's standing rule; Security/NFR re-derives on its own instruments.

  ENTERED 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-018`, Workflow 04 step 2) — the
  `Ready -> In Development` exit this role owns. Ready 4/8 -> 3/8, In Development 0/3 -> 1/3.
  NO LIMIT APPROACHED, NO OVERRIDE TAKEN, no written reason owed.

  THE DEFINITION-OF-READY GATE PASSED ON THE CORRECTED TICKET, and BA/PM's five rulings were
  RE-VERIFIED AT THE SOURCE rather than inherited -- the same standard BA/PM applied to this role's
  pre-check, which is what caught that the pre-check's AMBER row was actually a FAIL:

    - EPIC-002:197-198 does contain "1 prompt row = 23 rows", so `23` was never unsourced and this
      role's pre-check item 2 was WRONG on that point. BA/PM's correction stands: the ticket's Scope
      assembled four of five regions and summed to 22.
    - ABC-016:72 gives "all writing" to ABC-018; ABC-019's eight `prompt` hits are all about WHEN to
      prompt, never a frame row; EPIC-003's are the prompt's text, echo and NFR-003. So reserving the
      row here creates NO DOUBLE OWNERSHIP -- this ticket reserves and renders nothing.
    - EPIC-002:133 (#2a) asserts zero code points above U+007F "in the emitted frame", not in one
      panel, so the ASCII sanitizer widening is CONSISTENCY WITH THE EPIC, not scope creep.
    - EPIC-002:200 (#4b) says "at least as many rows as the frame", so R = H is in-place by the
      epic's own rule and was untested. Defect 3 confirmed.
    - Defect 4 (NFR-002 read as each half rather than the sum) contradicted the ticket's own NFR
      section AND its traceability row. NO TARGET MOVED -- the 16 ms is EPIC-002's.

  SIZE RE-CHECKED, NOT CARRIED: still S (2). One reserved row placed by the mechanism the message
  region already uses, one width constant, one sanitizer clause, four tests. No argv, no I/O, no new
  module. NOT XL, so no SPLIT_REQUIRED.

  AN OPEN CROSS-TICKET OBLIGATION IS CREATED HERE AND IS NOT DISCHARGED BY THIS TASK. The reserved
  prompt row is a contract with only one side written down: ABC-018 reserves the frame's last row and
  leaves the cursor at its start, EPIC-003 is expected to type into exactly that row, and ABC-019
  drives the loop around it. BA/PM did NOT edit and does NOT vouch for EPIC-002, ABC-016, ABC-017 or
  ABC-019 -- correctly, since a promotion subtask should not quietly rewrite four other tickets. It
  is NOT a blocker for ABC-018, which is buildable against a stub. WHEN ABC-019 IS REFINED AND WHEN
  EPIC-003 IS DECOMPOSED, THE PROMPT-ROW CONTRACT MUST BE CARRIED INTO THEM. Routed to BA/PM then,
  not now, and recorded here so it is not rediscovered as a defect.

  EXITED 2026-08-08 by the Software Engineer (task `ticket-to-pr-ABC-015`, subtask
  `engineer-abc015-implement`, Workflow 04): ABC-015 -> In Review. In Development 1/3 -> 0/3,
  In Review 0/3 -> 1/3. NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Development exit is the one board move this role owns. NOTHING MERGED, NOTHING DEPLOYED --
  a human holds both. Full record in the ticket's `## Implementation` section.

  THREE NEW FILES, NO EXISTING FILE UNDER src/ TOUCHED -- verified, not asserted:
  `git diff --numstat main -- src/` lists only src/glyph-mode.ts (122 lines, 32 of them code),
  src/glyph-mode.test.ts and src/glyph-mode.nfr.test.ts, and every pre-existing src/ file is
  byte-identical to merged main at f1743a3. src/render.ts in particular is untouched: its header
  records that it reads no isTTY and no process.env, and adding the ambient reads there would have
  broken epic acceptance 4c.

  GATES, AS THEY RAN: lint exit 0 (after ONE autofix pass -- biome failed on FORMATTING ONLY,
  lint.autofix is true, self-fix attempt 1 of 2), typecheck exit 0, npm test 271/271 on 13 files
  (253 on 11 before), build exit 0. Skip count 0 by the AGENTS.md command. src/glyph-mode.ts at
  100% on all four coverage axes.

  THE ONE STRUCTURAL CHOICE THE TICKET LEFT OPEN IS DECIDED: the session's cached value lives in
  the CLOSURE beginGlyphModeSession returns. That is what lets acceptance criterion 10 (the RULE
  reads no ambient global) and the NFR bar (the SESSION ACCESSOR may read process.stdout.isTTY and
  process.env) both hold at once. A module-level memo was rejected -- it needs an exported reset for
  the tests to run more than one session, and that export is the one thing able to break the
  session-constant promise. A value the caller merely holds was rejected -- it pushes the once-ness
  back to EPIC-006, the seam BA/PM closed onto this ticket, and makes criterion 11 unfalsifiable
  again.

  21 MUTANTS RUN, ALL 21 DIED -- including the named mutant from the ticket's test notes (the
  session re-probing the environment on every call; killed ONLY by criterion 11) and the platform
  rule smuggled back in (killed ONLY by criterion 9's guard). TWO OF THEM SURVIVED THE SUITE AS
  FIRST WRITTEN AND THE SUITE WAS FIXED RATHER THAN THE RECORD: a session that hardcoded isTTY, and
  one that forwarded only LANG. Both criteria 10 and 11 are written over ambients where isTTY and
  the locale AGREE, so neither could see it. The tree was restored byte-identically afterwards.

  ONE BEHAVIOUR THE NINE TUPLES DO NOT SPECIFY WAS DECIDED HERE AND IS FLAGGED, NOT BURIED: an
  EMPTY locale variable counts as UNSET and precedence falls through. POSIX reads it that way, and
  so does this ticket's own rationale for row 4 ("unset ... carries no information"). Two tests pin
  it. QE and Security/NFR own whether that reading stands.

  FLAGGED, NOT FIXED -- NEITHER IS THIS SUBTASK'S:

    1. The tracked coverage/ directory is stale by two merged tickets (it has no render.ts.html from
       ABC-014 and no history.ts.html from ABC-012), so this role did not regenerate it and restored
       it byte-identically after a --coverage run touched it. Owner: whoever owns the coverage
       artifact; raised here rather than silently refreshed.

    2. plans/traceability.md's ABC-015 row has ELEVEN cells against a TEN-column header, and it did
       BEFORE this subtask edited it (checked at HEAD, not assumed). The cause is a raw, unescaped
       `|` inside the TypeScript union type quoted in the Status cell, which splits that cell in any
       markdown renderer. Left exactly as written: escaping it means editing another role's recorded
       audit text, and this subtask's edits kept the count at eleven rather than making it worse.
       Owner: the board sweep, alongside ABC-012's stale ticket frontmatter.

---

## In Review (WIP 1/3) — column note

EMPTIED AGAIN 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-a11`,
  Workflow 04) on a PASS verdict. **ABC-009 moved In Review -> Ready for UAT, the one exit this role
  owns.** In Review 1/3 -> 0/3, Ready for UAT 0/4 -> 1/4; no limit approached, no override taken, no
  written reason owed. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both, and the owner's
  standing merge authority is NOT deploy authority.

  THIS COLUMN WAS RE-ENTERED BY A BACKWARD MOVE (the first in this project's history) because
  acceptance criterion A11 was NOT MET. IT IS MET NOW, and it is closed as a DIMENSION rather than as
  a fourth sample: src/moves.castling.hardening.test.ts goes 19 -> 34 tests, enumerating EVERY own
  piece type on the king's home square (QUEEN, ROOK, BISHOP, KNIGHT, PAWN) and on the rook's (QUEEN,
  BISHOP, KNIGHT, PAWN), each type in at least two colour/side configurations, plus one test that
  asserts THE QUANTIFIER ITSELF -- the piece-type universe is derived by probing parseFen rather than
  restated, so deleting a row or adding a seventh parseable type turns it red.

  ZERO PRODUCTION LINES: src/moves.ts still md5 0e247853ab2c05887c76105ff83d8621, git diff 8f540cf --
  src/moves.ts empty, and all fourteen *.test.ts files on main unmodified (each diffed individually).

  PROVED, NOT ASSERTED -- 20 mutants of the delivered diff, outside the repository, anchor-unique and
  bytes-changed asserted, tsc per mutant, one process per tree: the NINE "admit one further own piece
  type" mutants ALL DIE, including the three that passed the entire net before this hop (own ROOK and
  own PAWN on the king's square, own PAWN on the rook's square); two admissions conditional on colour
  or side also die, each to exactly the second configuration row that exists for it; and THE NINE
  BEHAVIOUR-EQUIVALENT MUTANTS ALL STILL SURVIVE at 34/34 -- these rows kill zero of them, which is
  what proves they pin behaviour and not implementation shape. The harm reproduces on every killed
  mutant: on the king's square one legalMoves() call DESTROYS the occupant and writes a king over it
  for EVERY own type (byte e1: 5/4/3/2/1 -> 6); on the rook's square the position is BYTE-IDENTICAL,
  so only the FLAG_CASTLE count can ever see it, exactly as A6's own rationale says.

  Gates re-run on the tip, never inherited: lint 0 (after ONE autofix of this role's own formatting,
  1 of 2 self_fix_attempts spent; 2 pre-existing biome.json infos), typecheck 0, npm test 371/371 on
  16 files, build 0, skip count 0, PERFT_DEEP=1 32/32 exact in 36.04 s. Test-integrity checker
  exit 2 = an ERROR, not a pass (.grugops/test-skips.md absent, ls not assumed; NO registry file
  created). E2E and the auto-UAT oracles UNKNOWN - verify, not green. NFR-001 deliberately NOT
  re-measured: a test-only change cannot move it and Security/NFR's count-based discharge stands.

  A11's own "NOT YET SATISFIED BY THE SUITE" marker in the ticket is now STALE and was DELIBERATELY
  LEFT STANDING -- ## Acceptance is BA/PM's and the role that writes the rows must not be the role
  that marks the criterion satisfied, on a ticket where three roles in a row certified a sample as a
  dimension. Routed to BA/PM as risk 1 with the measurements to check it against.

  The full record is in the ticket's `## QE — second hop: A11 closed as a DIMENSION` section, in the
  Ready for UAT comment below and in `.grugops/context/ticket-to-pr-ABC-009/notes/`.

---

## In Review (WIP 1/3) — column note

EMPTIED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-review`,
  Workflow 04) on a PASS WITH RISKS verdict. **ABC-009 moved In Review -> In Security/NFR, the one
  exit this role owns.** In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit approached, no
  override taken, no written reason owed. NFR-001 is triggered, so In Security/NFR is the correct
  next column rather than UAT. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.
  The full QE record is in the In Security/NFR comment below, in the ticket's `## QE` section and in
  `.grugops/context/ticket-to-pr-ABC-009/notes/`; it is not restated here.

  WHAT THIS COLUMN OWED IS PAID, AND THE HEADLINE IS THE DISTINCTION: 62 mutants were run against
  the delivered diff and FIVE survive the ENTIRE net -- all twelve criteria, all 337 delivered tests
  AND the PERFT_DEEP=1 lane at 32/32 -- and NOT ONE of the five is a defect in the code. All five are
  defects in the CRITERIA. The delivered fix is correct on every position that exposes them, which is
  why this is a PASS and not a return to dev. src/moves.ts is byte-identical to the Engineer's commit
  8f540cf (md5 0e247853ab2c05887c76105ff83d8621, the digest they published) and
  `git diff 8f540cf -- src/moves.ts` is EMPTY.

  THE FIFTH MUTANT THE ENGINEER HANDED OVER TO BE DECIDED: the colour-blind equivalence argument
  HOLDS and NO CRITERION IS OWED. Corroborated on a differently-built instrument -- 12,584 positions
  that parseFen ACCEPTS, varying three squares jointly, three king placements, BOTH rights at once
  and the black-to-move mirror, against the Engineer's 9,604 over two squares plus one extra piece --
  with zero divergence at generateMoves, at legalMoves and on purity. A colour criterion would pass
  on main's unfixed tree, on the fix and on the mutant alike: unfalsifiable, therefore theatre. The
  Engineer's disposition was right on both halves.

  THE SOFT SPOT NOBODY HAD EXAMINED IS NOW EXAMINED, and it is where all five live. A criterion set
  written over signals that AGREE hides the dimensions it holds CONSTANT, and two are held constant
  across all twelve rows:
    G-1  THE IMPOSTOR'S PIECE TYPE. A5/A6 use a bishop and a knight -- "at least two piece types"
         satisfied literally -- but the rule quantifies over ALL other bytes. A guard reading either
         home square as "the mover's KING/ROOK **or QUEEN**" is green on everything, and on
         4k3/8/8/8/8/8/8/K3Q2R w K - 0 1 one legalMoves call DESTROYS A QUEEN and writes a king over
         it: the ticket's own family-2 harm on the most valuable piece on the board.
    G-2  HOW MANY OF A SIDE'S RIGHTS ARE HELD. Every criterion FEN carries at most one right per side
         except the reproduction FEN, where BOTH castles are invalid -- so no criterion asks whether a
         VALID castle survives when its sibling is bogus, and nothing separates "this option was
         rejected" from "the option loop was abandoned". `continue` -> `break` on the ROOK guard
         DELETES A LEGAL CASTLE on 4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1 (16 moves / 1 castle becomes
         15 / 0) and is green on all twelve. The SAME mutation on the KING guard is genuinely
         equivalent, because both options share kingFrom. One token, two opposite verdicts, one green.

  A8 AND A9 CANNOT COVER EITHER DIMENSION, STRUCTURALLY -- and by the Engineer's own argument: in any
  position reachable from a legal start the right being set implies both pieces are home, so the two
  new guards NEVER FIRE and a mutation to them cannot change a perft node. Measured, not argued: all
  five survive PERFT_DEEP=1 at 32/32. The same argument that makes the fix safe for legal play makes
  the whole perft apparatus unable to certify it.

  CLOSED IN TESTS ONLY -- ZERO PRODUCTION LINES. src/moves.castling.hardening.test.ts is NEW (19
  tests, all passing on the delivered fix); the Engineer's src/moves.castling.test.ts is UNTOUCHED;
  and every one of the FOURTEEN test files that exist on main is unmodified, checked by diffing each
  INDIVIDUALLY, so A8's line-level requirement holds for this role's work too. The rows are proved
  load-bearing by re-running the whole campaign with them present: 47 -> 53 killed, 15 -> 9 survived,
  and SIX mutants die to these rows AND NOTHING ELSE in the suite. The nine behaviour-equivalent
  survivors STILL SURVIVE -- these rows kill zero of them, which is what proves they pin observable
  behaviour rather than the shape of the implementation.

  A7 KILLED NOTHING ACROSS 62 MUTANTS. The ticket already says it asserts count EQUALITY rather than
  correctness; that was measured on one build at refinement and is now measured on 62. Keep it as the
  standing purity walk `## Test notes` 2 asks for, but its green is not evidence about this fix.

  ROUTED AND NOT DISCHARGED HERE: G-1 and G-2 to BA/PM as CRITERIA text (this role does not edit
  `## Acceptance`), A7's null discrimination to BA/PM, and the castling-right test being guarded in
  the whole suite only by a 40-second opt-in lane (A9 kills it at 31/32; these new rows now kill it in
  the default lane too -- not charged against ABC-009, since the right is not one of the two BOARD
  preconditions this ticket owns).

  NFR-001 WAS NOT RE-MEASURED BY THIS ROLE, deliberately -- that gate follows and owns it. No
  throughput figure anywhere in this role's output is its own. The part of the Engineer's measurement
  that matters is its caveat: the per-cell floor is ~+/-1%, larger than any signal, so KIWIPETE'S
  0.9930 IS NOT A REGRESSION and only the aggregate against the 0.98 bar is load-bearing.

  ABC-022's HALF (b) IS STILL LIVE BY DESIGN. This ticket fences it and closes nothing there; not
  tested here and not reported as a miss.

  Test-integrity checker exit 2 (`.grugops/test-skips.md` absent, confirmed with ls) recorded as an
  ERROR and NOT as a pass; NO registry file was created, an agent may not author a justification to
  clear its own gate. E2E and the auto-UAT oracles are `UNKNOWN - verify`, not green.

  SECURITY/NFR WAS NOT ENQUEUED BY THIS ROLE -- the Orchestrator owns decompose->enqueue; this role
  took one board move and stopped.

---

## In Review (WIP 1/3) — column note

ENTERED 2026-08-09 from In Development, by the Software Engineer (task `ticket-to-pr-ABC-009`,
  subtask `engineer-abc009-implement`, Workflow 04). In Review 0/3 -> 1/3. QE/E2E owns this
  column's exit. The implementation record is in the In Development block above and in the
  ticket's `## Implementation` section; it is not restated here.

  FOUR THINGS ARE HANDED OVER NAMED RATHER THAN LEFT TO BE DISCOVERED:

  (1) SEVEN DEFECTS IS STILL NOT PROVEN COMPLETE, AND THIS HOP DID NOT CLOSE THAT. Open item (1)
      came in open and goes out open. What this hop CAN add is that five mutants were run against
      the delivered diff and the twelve criteria killed four of them cleanly, in disjoint named
      sets; the fifth survives and was PROVED behaviour-equivalent over 9,604 boards rather than
      excused. So no criterion gap has been found -- but only five mutants were tried, against
      ABC-018's 56, and a mutation campaign is QE's instrument, not this role's. EXPECT MORE.
  (2) THE TWO PLACES BA/PM SAID IT WOULD LOOK FIRST ARE STILL UNEXAMINED BY ANYONE. Its claim note
      named them: a criterion set written entirely over signals that AGREE, and the interaction
      between a new precondition and the existing `option.empty` / `option.kingPath` tests. This
      hop touched the second one only incidentally -- the equivalence result above is exactly that
      interaction, and it shows the through-check test MASKS the colour dimension. Whether it masks
      anything else is not established here.
  (3) A6 IS ASSERTED ONLY ON THE OFFER, AND THAT IS STRUCTURAL, NOT AN OVERSIGHT. Family 3 leaves
      the position byte-identical -- the make/unmake pair round-trips the impostor exactly -- so no
      purity assertion can ever see it and only the FLAG_CASTLE count can. Re-verified here rather
      than inherited. A reviewer looking for a purity row on A6 will not find one and should not.
  (4) ABC-022's HALF (b) IS STILL LIVE AND THAT IS INTENDED. `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`
      still writes a phantom black pawn onto a2 on one legalMoves call. No line of `addPawnMoves`
      was changed and no FLAG_EN_PASSANT behaviour was touched, which is the fence the ticket's
      `## Out of scope` draws. `## Scope` bullet 1 is scoped "on the castling route" for exactly
      this reason, and ABC-022's ticket was NOT edited.

  NOT ENQUEUED BY THIS ROLE: QE/E2E and Security/NFR. The Orchestrator owns the decompose->enqueue
  step; this role took one board move and stopped. NOTHING MERGED AND NOTHING DEPLOYED.

---

## In Security/NFR (WIP 0/2) — column note

EMPTIED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`,
  Workflow 04): **ABC-009 PASSES WITH RISKS and moved In Security/NFR -> Ready for UAT — the one
  exit this column owns.** In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4. No limit
  approached, no override taken, no written reason owed. NOTHING MERGED AND NOTHING DEPLOYED — a
  human holds both, and the owner's standing merge authority is NOT deploy authority.

  security.asvs_level L1, security.block_on high, compliance_regime [] — so NO Compliance Officer
  hand-off is owed, recorded rather than silently omitted. NO REQUIRED FIX IS OUTSTANDING and NO
  HIGH-SEVERITY ITEM EXISTS TO BLOCK ON.

  NOT ONE FIGURE IS INHERITED. The Engineer measured and QE explicitly declined to re-derive, so
  NFR-001 was re-derived here on this gate's own instruments, written OUTSIDE the repository.
  src/moves.ts is untouched by this role and still hashes 0e247853ab2c05887c76105ff83d8621.

  THE FOUR MANDATORY GATES RE-RUN ON THE TIP cff45ee: lint exit 0 (2 pre-existing biome.json
  infos), typecheck 0, build 0, npm test 356/356 on 16 files, skip count 0 by the AGENTS.md
  command, deep lane 32/32 EXACT in 38.49 s (third independent run: 36.93 s Engineer, 38.35 s QE).
  Test-integrity checker exit 2 (.grugops/test-skips.md absent, checked with ls) recorded as an
  ERROR and NOT a pass, no registry file created. E2E and auto-UAT oracles UNKNOWN - verify.

  (1) NFR-001 / A10 IS MET ON BOTH CLAUSES. Floor 6,030,518 / 6,136,238 / 6,117,496 nodes/sec
      against >= 1,000,000 (~6.1x). Aggregate ratio 1.0062 and 0.9967 against >= 0.98 on two fully
      independent samples, worst single cell 0.9863. Three trees in ONE process -- pre-fix,
      delivered, and a byte-identical TWIN as a null control by identity, the twin cmp-verified on
      all thirteen non-test files and `pre` verified to differ from `post` in moves.ts AND NOTHING
      ELSE -- 12 rounds (round 0 discarded), tree AND cell order rotated, parseFen outside every
      clock, checksum 409,605,192 nodes per sample. One honest difference from the Engineer: this
      gate's LOWEST floor run (6,030,518) sits 0.16% UNDER the catalog's standing 6.04M-6.21M band.
      Scatter on one run; NO BASELINE MOVED, and it is recorded rather than rounded into the band.

  (2) THE ENGINEER'S +/-1% INSTRUMENT-FLOOR REASONING: IT HOLDS, THE ESTIMATE IS OPTIMISTIC, AND IT
      WAS NOT THE END OF THE ROAD. Calibrating against provably-zero cells plus an identity twin is
      the right move and "no per-cell number is claimable" is the right conclusion. But this gate
      measures +/-2.0% per cell (twin, position-5), and characterises an AGGREGATE floor nobody had
      (twin 1.0096 / 1.0087; three of four aggregate twin readings across two gates near +0.9%, a
      SYSTEMATIC this gate CANNOT ATTRIBUTE) -- so the bar's 2-point margin exceeds resolution by
      about 2x, not comfortably. Per-cell instability shown the hard way: kiwipete reads 0.9930 /
      0.9967 (Engineer) against 1.0228 / 1.0052 (here). One wording overshoot named: "kiwipete's
      0.9930 is NOT a regression" is stronger than a noise floor can license (it licenses only
      "cannot resolve whether it is"); their note also states the correct form, so it is a phrasing
      inconsistency, not a false result.

  (3) THE QUESTION IS RESOLVED BY MOVING IT OFF THE CLOCK AND ONTO A COUNT -- the same move this
      catalog already made for NFR-005's call-count sub-bar. Over the exact perft population the two
      added lines execute 198,175 times EACH = 396,350 total across 11,377,922 nodes and REJECT
      NOTHING IN ANY CELL (0 failures of 198,175 each), which confirms empirically over 11.4M nodes
      the structural fact that makeMove only ever CLEARS a right (src/apply.ts:142); position-3 and
      position-6 execute them ZERO times. Isolated on an exported addCastlingMoves the pair costs
      +1.30 / +1.73 ns per call on startpos against a +/-0.22 ns null floor -- RESOLVED, ~0.33-0.43
      ns per execution. ARITHMETIC over the measured count and cost (LABELLED ARITHMETIC, NOT A
      MEASUREMENT): 0.131-0.170 ms on a 1.854-1.887 s sweep = 0.0070%-0.0091%, TRUE ratio ~0.9999
      and KIWIPETE'S TRUE RATIO ~0.9998 -- the 0.9930 reading is ~35x the true deviation. Robust to
      a 10x error in the multiplier. So the Engineer's conclusion is POSITIVELY ESTABLISHED, not
      merely unrefuted. Denominator fence re-derived independently at 97.18% free leaves.

  (4) GUARD ORDERING, ROUTED HERE BY QE AS GATE-UNVERIFIABLE: THE BEHAVIOUR HALF IS DISCHARGED, NOT
      CARRIED. The five guards are a CONJUNCTION of side-effect-free predicates over an unmutated
      position (isSquareAttackedBy and raySliderAttacks perform no writes -- checked; board is a
      readonly Uint8Array(128) and every frozen-table index is in bounds, so no guard depends on an
      earlier one for safety), therefore the emitted move set is PERMUTATION-INVARIANT under all 120
      orderings. Measured: 3 reorderings x 33 FENs = 99 comparisons, ZERO divergence at
      generateMoves, at legalMoves and on purity, with all six exact perft counts holding for every
      variant. SO NO LATER REORDER CAN SILENTLY BREAK THE EQUIVALENCE QE RELIED ON. QE's mechanism
      ("empty is tested before the through-check") is sound but stronger than needed; restated as a
      conjunction it is reorder-proof, and that restatement is the durable form.
      THE COST HALF IS REAL AND LIVES ON THE INVALID CLASS: an invalid FEN costs 522-526 ns pre-fix
      against 27.9-28.1 ns delivered (~18x), because the byte compare sits ABOVE THE ATTACK SCAN;
      below the through-check gives all of it back (+481 ns). BUT THE STATED REASON IS INVERTED FOR
      THE POPULATION NFR-001 MEASURES, and this is where this gate disagrees with the Engineer:
      measured selectivity is 0.0% for both added guards (0 rejects in 198,175 each) against 17.6%
      for the empty test and 14.1% for the through-check, so in exact executions the delivered order
      is the SECOND-MOST-EXPENSIVE of four (above-right 1,284,772 > delivered 396,350 > below-empty
      326,476 > below-through 280,302). That is ~0.003% -- far below resolution. NO CHANGE IS ASKED
      FOR (rules 5, 9, 10); the sharper reason is recorded instead. Nothing pins the ordering and
      NOTHING CAN, since invariance means no test could ever fail on a reorder.

  (5) SECURITY CLASSIFICATION: RELIABILITY, NOT SECURITY -- re-asked at the source with evidence, not
      carried, and NO TRIGGER MANUFACTURED. Zero eval/new Function/vm/require, zero child_process,
      zero HTML/XML/SQL/URL/fetch sinks, zero node:net|tls|http|https|dgram imports in non-test src/
      -- each grepped. addCastlingMoves is MODULE-PRIVATE; its only caller is generateMoves, whose
      only non-test caller is legalMoves (src/legal.ts:46). No process.argv/stdin/env/readFileSync in
      src/moves.ts at all; positions enter only via parseFen, called from history.ts and
      perft-bench.ts (hardcoded FENs). NO USER-SUPPLIED STRING REACHES src/moves.ts. QE's
      queen-destroying result is a worse RELIABILITY consequence of a MUTANT THAT WAS NEVER SHIPPED,
      not a security one. The one security-adjacent question this change touches -- a DoS-shaped cost
      on malformed input -- was asked and comes out IN THE CHANGE'S FAVOUR (18x cheaper). ASVS L1
      counted at the source: 70 active requirements, and V16/V17 carry NO L1 requirement at all
      (29 rows, zero at L1) -- checked, not assumed.

  (6) LOGGING: this module logs nothing and the only logging in non-test src/ is perft-bench.ts's
      console.log. Normally this gate flags a failure mode with no log. IT DOES NOT APPLY HERE: the
      fix ELIMINATES the failure rather than instrumenting it, so there is no later incident to
      diagnose. No logging asked for (rules 5 and 8).

  TEN RISKS CARRIED, NONE HIGH, EACH WITH A NAMED OWNER: (1) G-1/G-2 closed in TESTS but not in the
  criteria -- BA/PM, MEDIUM, deliberately NOT discharged here since ## Acceptance is BA/PM's and this
  gate did not touch it; (2) A7 killed nothing across 62 mutants -- BA/PM, LOW; (3) the castling-right
  test is guarded in the default lane only by QE's rows -- BA/PM or Architect, LOW; (4) guard ordering
  RESHAPED -- Architect/Design at ABC-010/EPIC-003, LOW: behaviour discharged, what remains is that
  nothing pins it and, if user FENs are ever admitted, a reorder below the through-check restores an
  18x cost on malformed input; (5) NFR-001 per-cell figures are noise and must never be quoted --
  Security/NFR, LOW, the TENTH instrument-limit correction on this project; (6) NFR-001 has no guard
  in the suite -- Security/NFR at EPIC-004, LOW, and no wall-clock assertion belongs there (standing
  rule); (7) ABC-010 unbuilt so the invalid FEN is still ACCEPTED at the boundary -- ABC-010, LOW, by
  design; (8) ABC-022 half (b) live BY DESIGN -- severity NONE; (9) A1-A10 plus QE's rows still not
  PROVEN complete, nine equivalent survivors stand -- QE/BA-PM; (10) test-integrity exit 2, E2E and
  auto-UAT oracles UNKNOWN - verify -- human-owned. V15.1.1/V15.2.1 NOT MET with the carried high->low
  override, evidence re-checked (runtime dependencies is {}, package.json and package-lock.json
  byte-identical to main on this branch), owner Architect/Design at EPIC-006. V13.4.1 DEFERRED,
  unchanged and not relaxed.

---

## In Security/NFR (WIP 0/2) — column note

ENTERED 2026-08-09 from In Review, by QE/E2E (task `ticket-to-pr-ABC-009`, subtask
  `qe-abc009-review`, Workflow 04) on a PASS WITH RISKS verdict. In Security/NFR 0/2 -> 1/2.
  Security/NFR owns this column's exit. The QE record is in the In Review comment above and in the
  ticket's `## QE` section; it is not restated here.

  WHAT THIS GATE IS OWED, NAMED SO IT IS NOT DISCOVERED:

  (1) NFR-001 / A10 IS YOURS AND QE DID NOT TOUCH IT. No throughput figure in any QE output is QE's
      own -- `npm run perft` was not run by this role. The Engineer's figures are the first and only
      ones on this ticket: floor 6.08M-6.15M nodes/sec against the >= 1,000,000 bar, aggregate ratio
      0.9987 and 0.9974 against >= 0.98 on two independent samples, three trees in one process with a
      byte-identical twin as null control. THE CAVEAT IS THE PART THAT MATTERS AND IT IS THE
      ENGINEER'S OWN: the instrument's per-cell floor is ~+/-1%, established by two structurally-zero
      cells and an identity twin reading up to 1.0126 -- LARGER THAN ANY SIGNAL THE CHANGE COULD
      PRODUCE. So KIWIPETE'S 0.9930 IS NOT A 0.7% REGRESSION and no per-cell number is claimable;
      only the aggregate is load-bearing. Re-derive on your own instruments as you did for ABC-015 and
      ABC-018.
  (2) ONE RISK IS ROUTED TO YOU SPECIFICALLY: the guard-ordering rationale is GATE-UNVERIFIABLE.
      Moving both new guards below the emptiness test, below the through-check test, or above the
      right test is behaviour-equivalent -- measured over 12,584 accepted positions, zero divergence --
      and therefore invisible to every test in the suite. The Engineer's cheap-tests-first reasoning
      (a byte compare below an attack scan) is sound and rests on READING, and NFR-001's own floor is
      larger than the effect, so no gate on this ticket can confirm or refute it. Severity low, named
      rather than left implicit.
  (3) NFR-005 IS EXCLUDED STRUCTURALLY, NOT BY MEASUREMENT, and the ticket says explicitly not to
      re-run the key benchmark to "confirm" it: zobristKey -> hasLegalEnPassant calls neither
      generateMoves nor legalMoves. QE did not re-run it either.
  (4) NO SECURITY TRIGGER, and it was re-asked rather than carried: no user-supplied string reaches
      src/moves.ts, no sink, no trust boundary. The queen-destroying mutant QE found is a worse
      RELIABILITY consequence, not a security one -- the same call the correction block made for
      family 2. security.asvs_level L1, security.block_on high, compliance_regime [].
  (5) TWO CRITERIA GAPS ARE OPEN AND THEY ARE BA/PM'S, NOT YOURS: G-1 (A5/A6 vary two piece types
      where the rule quantifies over all) and G-2 (no criterion varies how many of a side's rights are
      held). Both are CLOSED IN TESTS -- so a regression is caught -- but the SPECIFICATION still does
      not state them, which is what let this class recur on ABC-015, ABC-018 and ABC-009. Do not
      discharge them here.
  (6) STILL OPEN, UNCHANGED BY QE: A1-A10 plus the new rows is not PROVEN complete. 62 mutants is
      twelve times the Engineer's five and still not a proof; nine survivors remain and QE argues all
      nine equivalent over an enumerated corpus, not over the position space.
  (7) ABC-022's HALF (b) IS LIVE BY DESIGN. Not a miss, fenced by ABC-009's `## Out of scope`.

  Test-integrity checker exit 2 (registry absent) is an ERROR and not a pass; E2E and the auto-UAT
  oracles are `UNKNOWN - verify`. NOTHING MERGED AND NOTHING DEPLOYED -- a human holds both.

---

## Ready for UAT (WIP 0/4) — column note

LEFT THIS COLUMN 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04) — ABC-009
  MERGED AND CLOSED to Done. Ready for UAT 1/4 -> 0/4. UAT was DEFERRED to EPIC-006 and EXPLICITLY NOT
  PASSED: there is still no CLI entry point, so no surface a human can exercise — the same ruling and the
  same words ABC-011, ABC-015 and ABC-018 each carry. The Done row below holds the merge record.

---

## Ready for UAT (WIP 0/4) — column note

RE-ENTERED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-009`, subtask `qe-abc009-a11`, Workflow 04)
  on a PASS verdict — the one exit that role owns. Ready for UAT 0/4 -> 1/4, In Review 1/3 -> 0/3.
  This column is where the ticket sat before the first backward move in this project's history; it
  returns because THE CRITERION THAT CAUSED THAT MOVE IS NOW MET, not because anyone re-drew a tick.

  WHAT WAS OWED AND IS PAID: A11, quantified over piece type. 14 new rows and one quantifier test in
  src/moves.castling.hardening.test.ts (19 -> 34), ZERO production lines. The three mutants that
  passed all 33 acceptance rows, all 19 previous hardening rows, all 356 tests AND the deep lane --
  the king's square read as "own KING or own ROOK", as "own KING or own PAWN", and the rook's square
  as "own ROOK or own PAWN" -- now DIE, to these rows alone. All nine own-type admissions die; all
  nine behaviour-equivalent mutants still survive at 34/34.

  WHY THE MOVE IS FORWARD AND NOT A CLOSE: UAT stays DEFERRED to EPIC-006 and is explicitly NOT
  passed -- there is no CLI entry point, so a UAT pass would be a fabrication. What a human must
  eventually check is named in the traceability row. NOTHING MERGED AND NOTHING DEPLOYED; the owner's
  standing merge authority is approval to merge work that PASSED and is not deploy approval.

  NOT DISCHARGED HERE, DELIBERATELY: A11's own "⚠️ NOT YET SATISFIED BY THE SUITE" marker and the
  ## Acceptance preamble line that carries it are stale but UNTOUCHED. ## Acceptance is BA/PM's, and
  on this ticket the specific failure being repaired is a role certifying its own sample as a
  dimension -- so the role that wrote the rows does not also stamp the criterion. Owner BA/PM, risk 1.

  ALSO NOT ESTABLISHED: that the criteria set is complete. Three hops have each found one more class
  than their predecessor (Engineer 5 mutants, QE 62, BA/PM 10, this hop 20); expect a fourth class.

---

## Ready for UAT (WIP 0/4) — column note

LEFT THIS COLUMN 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-009`, Workflow 04) — MOVED
  BACKWARD to In Review. Ready for UAT 1/4 -> 0/4, In Review 0/3 -> 1/3. FIRST BACKWARD MOVE IN THIS
  PROJECT'S HISTORY, and recorded as one rather than dressed up as a normal transition.

  WHY: acceptance criterion A11, added by BA/PM at the criteria-text hop, is NOT MET. A ticket with an
  unmet acceptance criterion cannot honestly sit in Ready for UAT. The move is not a backward move
  because anything regressed — it is one because the board was asserting a readiness the ticket did
  not have.

  THE MOVE IS NOT ON THE ORCHESTRATOR'S TWO OWNED EXITS and is taken anyway. The alternatives were to
  leave a known-unmet criterion sitting in Ready for UAT, or to close the ticket — both make the board
  state a falsehood. A visible backward move is the honest record and it costs only wall-clock: the
  CODE IS CORRECT and unchanged, `src/moves.ts` still md5 0e247853ab2c05887c76105ff83d8621, identical
  to the Engineer's first commit, so no gate repaired the module to make its own verdict green.

  WHAT A11 IS, MEASURED BY THE ORCHESTRATOR ON ITS OWN MUTANT BEFORE TAKING THIS MOVE: QE's hardening
  rows closed the QUEEN INSTANCE, not the DIMENSION. A mutant reading the king's home square as "own
  KING or own ROOK" passes the Engineer's 33 acceptance tests, ALL 19 of QE's hardening tests and the
  full 356/356 on 16 files — and on 4k3/8/8/8/8/8/8/K3R2R w K - 0 1 one legalMoves() call DESTROYS THE
  ROOK and writes a king over it. BA/PM found three such survivors over ten mutants; own-KING-or-ROOK,
  own-KING-or-PAWN and own-ROOK-or-PAWN all pass everything, and only own-ROOK-or-KNIGHT dies (to A6's
  knight row). So A11 quantifies over EVERY own piece type on BOTH home squares rather than adding a
  fourth sample. What is owed is ~9 TEST ROWS AND ZERO PRODUCTION LINES.

  THE SAME MISTAKE WAS MADE THREE TIMES ON THIS TICKET, INCLUDING TWICE BY THE ORCHESTRATOR, and it is
  the ticket's own defect turned on the ticket: the original Scope named two preconditions and tested
  one; the Orchestrator built the QUEEN mutant because QE named the queen, watched it die to four
  hardening tests, and called the gap closed — testing the example instead of the rule. Recorded so the
  fourth instance is caught by the board rather than by luck.

  A12 (G-2, rights per side) is ALREADY SATISFIED by QE's existing rows and needs no work. A7 is KEPT
  and RECLASSIFIED — inert by construction across 0 of 72 mutants, but the suite's only purity walk
  over legal positions and ABSENT rather than failing before this ticket; what BA/PM deleted is its
  FALSE JUSTIFICATION ("the guard that would have caught the defect originally"), disproved by the
  Engineer's own red-before-green record showing those six rows GREEN ON THE UNFIXED TREE. Second
  criterion on this project whose protective value was assumed rather than measured.

  A TRACE DEFECT THE ORCHESTRATOR REPORTED HERE ON 2026-08-09 IS WITHDRAWN — IT DOES NOT EXIST. The
  claim was that traceability rows ABC-011/ABC-015 carry 11 cells against the header's 10 from an
  "unescaped |". BA/PM re-derived it: the pipes ARE escaped (`\|`), every row has ten cells in all
  eight commits that ever touched the file, and the row's own author documented it on 2026-08-08. The
  Orchestrator's awk splitter counted raw pipes and ignored the escape; its own "ABC-009 verified at
  10" was luck of the splitter. Removing the backslash — the fix it proposed — is the one edit that
  WOULD have corrupted those rows. No ticket cut, no row edited.

  STILL OPEN AND SEPARATE, verified independently and NOT withdrawn: ABC-018 sits in Done here while
  plans/tickets/ABC-018-frame-output-and-redraw.md still reads `status: ready-for-uat` /
  `column: Ready for UAT`, against ABC-015's correct `done` / `Done`. Real state disagreement, not
  ABC-009's, needs its own item.

  NOT MERGED AND NOT CLOSED. Merge pre-checks are green and stay green: fast-forward available (0
  commits on main not on the branch, 0 merge commits, 8 ahead), branch-tip gate lint 0 / typecheck 0 /
  356 of 356 / build 0 / skip 0. The owner's standing merge directive of 2026-08-06 authorises the
  keystroke for work that PASSED; A11 unmet means this has not passed, and limit 2 of that directive —
  "the gate still binds" — is exactly this case. UAT stays deferred to EPIC-006 per the precedent on
  every ticket this project has shipped; that ruling is not taken here.

---

## Ready for UAT (WIP 0/4) — column note

ENTERED 2026-08-09 from In Security/NFR, by Security/NFR (task `ticket-to-pr-ABC-009`, subtask
  `sec-abc009-nfr`, Workflow 04) on a PASS WITH RISKS verdict. Ready for UAT 0/4 -> 1/4. The gate
  record is in the In Security/NFR comment above and in the ticket's `## Security / NFR` section; it
  is not restated here. NOTHING MERGED AND NOTHING DEPLOYED — a human holds both.

  UAT IS DEFERRED TO EPIC-006 AND IS EXPLICITLY NOT PASSED — ruled on this ticket's own evidence
  rather than inherited: there is no CLI entry point and no runnable game (AGENTS.md `Dev / run` is
  UNKNOWN - verify; `quality.ui_e2e` is ui-or-critical-path and this change has no UI surface), so
  THERE IS NO SURFACE A HUMAN CAN EXERCISE and a UAT pass would be a fabrication.

  WHAT A HUMAN MUST EVENTUALLY CHECK, named rather than left implicit: that a game played through
  the real CLI never offers a castle the rules forbid, and that the board a player sees after a
  `moves`/status query is the board they had before it. Neither is checkable today. Everything this
  ticket fixes is reachable ONLY through a semantically-invalid FEN, which no product path can
  produce until ABC-010 and EPIC-003 exist — which is also why the defect stayed latent and why its
  escalation trigger remains unspent.

  CARRIED INTO UAT: the ten risks in the In Security/NFR record, none high, each owned. The two that
  a UAT reader most needs are BA/PM's G-1/G-2 criteria-text gap (MEDIUM — closed in tests, open in
  the specification) and the standing fact that A1-A10 plus QE's rows is not PROVEN complete.

---

## board header — _Updated: entry (RESTORED)

_Updated: 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-a13-verify`, Workflow 07): **`A13` IS MET — VERIFIED INDEPENDENTLY ON THIS ROLE'S OWN INSTRUMENTS, AND ITS `⚠️ NOT YET SATISFIED` MARKER IS RETIRED. NO BOARD MOVE: `ABC-009` STAYS IN `Ready for UAT` 1/4.** The only board change is an ADDITION to `Backlog`, which carries no numeric WIP header: **`ABC-023` cut** (see the comment under `Backlog`). Every column carrying a numeric WIP header was re-verified against its line-item count (**10 counted columns, 0 wrong**), and no ticket moved column. **THE MUTANT SET WAS DERIVED FROM `A13`'S OWN TWO ACCOUNTING TABLES, NOT FROM QE'S ROWS** — one mutant per wrong byte value per home square: **24 mutants, 17 KILLED, 7 SURVIVED, 0 verdict disagreements with `A13`'s own buckets, 0 broken builds, 0 harness errors**, each typechecked, one fresh OS process per tree state, `src/moves.ts` restored and re-hashed to `0e247853ab2c05887c76105ff83d8621` after every one. **The four newly-required admissions die to `A13`'s rows ALONE — acceptance 33/33 on each of the four** — and **the seven survivors are exactly the seven values `A13` names unfalsifiable** (enemy `KING`/`QUEEN`/`ROOK` on both squares, own `KING` on the rook's), so the rows pin observable behaviour and not implementation shape. **The 13-value byte domain re-derived on all six home squares with the 11-vs-13 trap DESIGNED OUT three ways** (king parking varied per attempt, parking asserted never to be the square under test, and the exact FEN printed and re-parsed for every witness including both `KING` bytes). **The accounting is ENFORCED, not narrated: five deliberate corruptions of the suite file all go RED at `tsc 0`** — drop one row, drop both, relabel a row at a coinciding count, make a row inert, and **silently omit a value from the discharge map, which nobody had tried and which is this ticket's signature failure mode**. Structural: `src/moves.ts` unchanged across six hops, **0 of 14** pre-existing test files modified, suite **381 passed (381) on 16 files** at skip **0** on the tip. **ONE NEW HOLE FOUND, NAMED, AND ROUTED TO `ABC-023` RATHER THAN FIXED — the stopping rule operating as written: the castle's DESTINATION square is pinned by nothing.** Dropping it from `kingPath` survives the full suite **AND** the standing `PERFT_DEEP=1` **32/32** lane on both white options, while dropping the origin or the crossed square dies; `legalMoves`' own check filter masks the landing square, so only the exported `generateMoves` can witness it, and **it is the only class on this ticket whose position is LEGALLY REACHABLE**. The delivered code is correct on it. **NO `src/` EDIT, NO TEST ROW WRITTEN, NO CRITERION ADDED TO `ABC-009`, NO SIXTH HARDENING PASS.** Nothing merged and nothing deployed — a human holds both, and the owner's standing merge authority is not deploy authority._

---
