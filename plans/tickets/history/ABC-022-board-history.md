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

## In Security/NFR (WIP 0/2) — the Security/NFR exit

EXITED 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-022`, subtask `security-nfr-abc022-gate`,
Workflow 04): **ABC-022 -> Ready for UAT on PASS_WITH_RISKS. In Security/NFR 1/2 -> 0/2, Ready for
UAT 0/4 -> 1/4.** No limit approached, no override taken, no written reason owed. The
`In Security/NFR` exit is the one board move this role owns; **nobody was enqueued** — the
Orchestrator owns decompose->enqueue — and **UAT WAS NOT RULED ON**, which is the Orchestrator's
along with the merge. All 12 numbered column headings re-verified against their live row counts
(**0 mismatches**). NOTHING MERGED, NOTHING DEPLOYED.

Gated against `security.asvs_level` **L1** and `security.block_on` **high**. `compliance_regime` is
**`[]`**, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted.
**NO REQUIRED FIX AND NO HIGH-SEVERITY ITEM.** Thirteen accepted risks, each with a severity and a
**named owner** — including **`ADR-0005` 133-138, which had been carried UNOWNED through three hops
and now has an owner (Architect/Design) and a trigger (this ticket's merge)**, because an accepted
risk nobody owns is a risk nobody fixes.

**`src/moves.ts` WAS NOT TOUCHED** — still md5 `6335b452fc21ffe2d0f902ecab930840`, so the board's
standing record holds for a **fifth** gate: no gate has ever repaired the module to make its own
verdict green. `## Acceptance` not edited (`7123d5c641045a44c6f63c2c20dab415` before and after);
`plans/nfr-catalog.md` not edited and no target moved; `ABC-023`, `ABC-009`, `ABC-010`, `ABC-011`,
`ADR-0005` and `memory-bank/` untouched; `git status --short -- src/` empty.

**NOTHING INHERITED.** Five tree copies outside the repository, one OS process per tree,
`tsc --noEmit` exit 0 on every tree before any result was believed, every probe printing its FEN and
re-parsing it. **One instrument failure recorded rather than glossed:** the first typecheck of the
instrumented tree exited 2 on `TS1375` — a top-level `await` in one of **this gate's own probe
files**, not in the module under test. Fixed and re-checked to exit 0 before any count was believed.

**THE FOUR MANDATORY GATES RE-RUN ON THE TIP:** lint exit 0 (35 files, the 2 pre-existing
`biome.json` infos), typecheck exit 0, build exit 0, `npm test` **559 passed (559) on 18 files**,
skip count **0** by the AGENTS.md command, perft fast lane 24/24, and `PERFT_DEEP=1` **32/32 EXACT
in 36.06 s** — a fourth independent run of that lane on this ticket, agreeing with 36.55 s
(Engineer), 36.50 s (Orchestrator) and 36.85 / 38.15 s (QE). Test-integrity checker exits **2**
(`.grugops/test-skips.md` absent, checked with `ls`) — recorded as an **ERROR, not a pass**, and no
registry file was created. E2E and auto-UAT oracles `UNKNOWN - verify`.

**`NFR-001` / `A10` MET ON EVERY CLAUSE, AND THE AMENDED METHOD WAS FOLLOWED — THE COUNT IS PRIMARY.**
**331 evaluations / 216,269 for the rejected placement / 0 rejections** over the standing
518,474-node walk (18,357 non-leaf nodes), roots and `fast` depths parsed out of `src/perft.test.ts`
and the walk driven by `legalMoves` alone — **a FOURTH independent derivation, exact**. **TWO FIGURES
NO PRIOR HOP HAD:** the count over the **clock's own** population (`npm run perft`'s 11,377,922
nodes) is **4,177 / 3,417,014 / 0**, because the 331 figure's denominator is a different population
and pricing the clock with it would be an apples-to-oranges error; and the **per-call bound** is
**at most 1 evaluation in any single `generateMoves` call** over all 18,357 calls (mean 0.018).
By arithmetic **labelled arithmetic**: 0.00023% at 1 ns per evaluation, 0.0023% at a generous 10 ns —
three orders of magnitude below what the instrument resolves. **The ordering decision is what keeps
it unmeasurable and that is now priced on the clock's own population:** the rejected placement is
**818x** more executions, which is 0.19%-1.88% by the same arithmetic — inside the bar but within its
own 2-point margin at the top. **No change asked for** (rules 5, 9, 10).

**Floor 6,172,810 nodes/sec** against >= 1,000,000 (~6.17x), lowest of 12 scored readings
**6,030,890** (~6.03x). **Aggregate ratio 0.9996** against >= 0.98. Three trees, one process per
reading, order rotated every round, a discarded warm-up, node count checksummed identical at
11,377,922 on all 15 readings. **THE NULL CONTROL DECIDES HOW TO READ IT: a `cmp`-verified
byte-identical twin (31/31 files) deviates 0.914% from the tree it is IDENTICAL to — 23.1x the fix's
apparent 0.039% cost — and the lowest reading in the whole sample is the TWIN's.** No per-cell and no
per-run cost claim is admissible; the catalog's standing caution held for a fifth ticket running.
**A CANDIDATE ELEVENTH INSTRUMENT-LIMIT CORRECTION IS NAMED AND ROUTED, NOT APPLIED** (this subtask
forbids editing the catalog): the twin's own **aggregate** readings span **3.91% peak-to-peak** on
identical code, against the ~±1% aggregate floor the catalog records — so the aggregate floor is at
least as wide as the per-cell one and the bar's 2-point margin does not comfortably exceed
resolution. Four rounds, one machine, and said so.

**THE STRUCTURALLY-ZERO CELL WAS READ FIRST, as the catalog's method requires, and it matters because
`NFR-001`'s SECOND consumer is `gameStatus`:** `gameStatus(startpos, emptyMap)` evaluates the added
conditions **0 times** — `NO_SQUARE` is -1 and `to` is always an on-board 0x88 index, so the guard is
unreachable whenever no ep square is set. That half of `NFR-001` has a **structurally zero** delta,
measured rather than argued.

**`NFR-005` EXCLUDED STRUCTURALLY AND CONFIRMED TWO WAYS, benchmark NOT re-run** as the ticket
instructs: `src/zobrist.ts` is byte-identical to `main` (md5 `630fcedd…` both sides) and
`src/legal.ts` / `src/legal.test.ts` are `cmp`-identical to `main` once comments are stripped (49 and
236 code lines); **and, the stronger one, `hasLegalEnPassant` — the only thing `src/zobrist.ts`
imports from `src/legal.ts` — never calls `generateMoves` or `legalMoves` at all**, so the Zobrist
path does not even reach the changed function. **`NFR-002` structurally untouched** (the renderer
modules import nothing reaching the generator). **`NFR-003`'s second component IS downstream and the
ticket's trigger block does not name it** — harmless given the measured per-call bound, but recorded
as an owned risk.

**THE SECURITY CLASSIFICATION WAS CHECKED AGAINST ASVS L1 RATHER THAN INHERITED, AND IT HOLDS —
RELIABILITY, NOT SECURITY, AND NOTHING WAS INFLATED.** Grepped at the source across all thirteen
non-test files: zero `eval` / `new Function` / `vm`, zero `child_process`, zero network imports or
`fetch`, zero filesystem or path building, zero SQL/HTML/XML/DOM/URL sinks, zero crypto or secrets,
zero deserialization. **The call graph closes it:** `addPawnMoves` is module-private, `generateMoves`'
only non-test caller in the repository is `src/legal.ts:46`, `parseFen`'s only non-test callers are
`src/history.ts` (**zero non-test importers**) and `src/perft-bench.ts` (hardcoded FENs), and
`package.json` has no `bin`, no `main` and **no runtime dependency at all**. **No user-supplied string
reaches `src/moves.ts` and no user surface exists.** **ASVS L1 counted at the source: 70 active
requirements; V16 and V17 carry NO L1 requirement at all** (29 rows, zero at L1). **V2.2.1 PASSES
BECAUSE OF THIS CHANGE** — the module now enforces the preconditions its own comment states.
V2.1.1 passes on the syntactic half with the boundary half owned by `ABC-010`; V2.2.2 / V2.3.1 /
V5.2.1 / V15.3.1 pass **by analogue**, each labelled as such; V7 session management is **named** N/A
rather than skipped; V11's rows are named N/A with `src/zobrist.ts`'s non-cryptographic position key
called out so a future reader grepping "hash" is answered. **V13.4.1 DEFERRED and not relaxed.**
**V15.1.1 / V15.2.1 NOT MET — an L1 fail defaults to HIGH, which `block_on: high` would block on, so
the carried high -> low override was RE-TAKEN on re-measured evidence rather than inherited:** runtime
`dependencies` is `{}`, `package.json` and `package-lock.json` are byte-identical to `main` on this
branch, and there is no published artifact, so the requirement's risk has **no delivery path today**.
Reason stated, **owner Architect/Design at `EPIC-006`**, and `ABC-022` neither caused nor worsened it.

**THE ONE SECURITY-SHAPED QUESTION THIS CHANGE ACTUALLY RAISES WAS ASKED AND ANSWERED, ON THE ONE AXIS
NOBODY HAD SWEPT.** The fix adds a board read indexed off `epSquare` (`position.board[to - forward]`),
and BA/PM's own soft-edge note says the `epSquare` **value** domain was never swept. Swept here:
two base positions x `epSquare` = -1..255 = **514 states** (128 on-board, 386 off-board or out of
range, written directly because `parseFen` cannot produce an off-board ep square — an instrument
limit stated, not glossed). **Zero throws on the fix AND on `main`**: an out-of-range index into the
`Uint8Array(128)` board yields `undefined`, the comparison fails, and **the guard fails closed** — no
crash, no out-of-range access, no denial-of-service shape. **The fix HALVES the emitting surface over
that domain, 4 states -> 2**, the two extra states on `main` being this ticket's over-offers on the
other capture side. The one security-adjacent property this change touches comes out **in the
change's favour**.

**LOGGING WAS LOOKED FOR AND THE HONEST FINDING IS THAT THERE IS NOTHING TO LOG:** the module logs
nothing, V16 carries zero L1 rows, and the fix **eliminates** the failure mode rather than
instrumenting it. No logging was asked for (rules 5 and 8).

**WHAT THIS GATE DID NOT ESTABLISH:** QE's fourteen-tree campaign, the three survivors, the 120
hardening rows, the 8-vs-23 split, BA/PM's 512-state and 131,072-state sweeps and the `A1`-`A9` /
`A11` verdicts were **not** re-derived — they are QE's and BA/PM's, and re-running them would spend a
hop restating another role's numbers. `A10` is the criterion this gate owns.

---

## The `_Updated:` board header this hop replaced, preserved VERBATIM

Per `plans/board.md`'s own rule the header is replaced rather than stacked, and the replaced text is
kept here so nothing is lost:

_Updated: 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-022`, Workflow 04): **`ABC-022` PASSES the `In Review` gate. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2.** No limit approached, no override taken; ticket frontmatter moved with the column. `src/moves.ts` NOT touched (md5 `6335b452…`); `## Acceptance` NOT edited (md5 `7123d5c6…`). Suite **439 -> 559 on 18 files** — QE added `src/moves.enpassant.hardening.test.ts`, 120 rows all green on the delivered fix. NOTHING MERGED, NOTHING DEPLOYED. **What was measured, what survived and what is still open: `plans/tickets/history/ABC-022-board-history.md` and `.grugops/context/ticket-to-pr-ABC-022/notes/`.** (The 2026-08-10 board-tidy header this replaces is preserved verbatim in that same history file, per the rule below.)_

---

## In Review (WIP 0/3) — the QE exit

EXITED 2026-08-09 by QE/E2E (task `ticket-to-pr-ABC-022`, subtask `qe-abc022-review`, Workflow 04):
**ABC-022 -> In Security/NFR on a PASS. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2.** No limit
approached, no override taken, no written reason owed. The `In Review` exit is the one board move
this role owns; **Security/NFR was NOT enqueued** — the Orchestrator owns decompose->enqueue.
NOTHING MERGED, NOTHING DEPLOYED.

**`src/moves.ts` WAS NOT TOUCHED AT THIS HOP** — still md5 `6335b452fc21ffe2d0f902ecab930840`, so the
board's standing record holds for a fourth gate: no gate has ever repaired the module to make its own
verdict green. `## Acceptance` was not edited either (section md5 `7123d5c641045a44c6f63c2c20dab415`,
identical to HEAD), nor were `ABC-023`, `ABC-009`, `ABC-010`, `ABC-011` or `plans/nfr-catalog.md`.

**ALL ELEVEN CRITERIA RE-DERIVED ON THIS ROLE'S OWN INSTRUMENTS, nothing carried from a hand-back.**
Fourteen full tree copies outside the repository, **one OS process per tree state** (the `ABC-009`
module-cache trap), `tsc --noEmit` **exit 0 on every one before any red was believed** (the
non-compiling-control trap), every probe printing its FEN and re-parsing it before a verdict, and the
counting walk kept in a separate run from the probing walk (the recorded failed attempt). `A7` walks
to `206604 / 99950 / 46256 / 9738 / 63910 / 92016` = **518474**, epSquare set **81397**, ep offered
onto an occupied square **0 before and 0 after**, and — stronger than the criterion asks — ep offered
ANYWHERE **4389 before and 4389 after**, so the en-passant move set itself is unchanged in reachable
play. `A8` **32/32 exact**, run twice by this role (36.85 s, then 38.15 s with the new file present).
`A10`'s count primary re-derived at **331 / 216,269 / 0** over the same walk (18,357 non-leaf nodes) —
a third independent derivation. `A9` holds on the stronger form: one existing test file modified,
**21 changed lines and 0 non-comment**, comment- and blank-stripped content `cmp`-**identical to
`main`**. `A11` matched on its **quoted sentences** rather than its stale line numbers: every
falsified sentence absent, every fenced-TRUE sentence present exactly once.

**THE LOAD-BEARING EVIDENCE REPRODUCED RATHER THAN INHERITED.** 58/58 on the fix and 31 red on the
unfixed control, all 31 inside the new file. The **8-vs-23 disjoint split** confirmed by set
arithmetic on failing test NAMES — **intersection EMPTY**, union **byte-identical** to the control's
31 — with both mutant hashes coming out byte-equal to the engineer's (`6762b334…`, `2f19080b…`).
**`A5` EARNS ITS KEEP:** the colour-shaped restructure, rebuilt independently, typechecks clean,
passes `A1`-`A4` and `A6`, passes **435 of the 439** delivered tests and the deep lane **32/32**, and
the only four failures in the entire suite are `A5`'s four rows. The self-masking row was traced move
by move: `d4e3` writes e4 from `9` to `1` and the very next move in the same pass writes it back, so
the call-level oracle reads CLEAN where the pair-level oracle reads DIRTY. The settled
behaviour-equivalence ruling was respected and not re-litigated — a colour-shaped clause is 58/58 and
439/439, and none of the rows added below kills it either, which is the correct outcome.

**THE GATE'S REAL FINDING IS A HOLE IN THE NET, NOT A DEFECT IN THE CODE. THREE BUILDS PASS ALL
ELEVEN CRITERIA, ALL 439 TESTS AND THE DEEP LANE 32/32:** (1) reading the target as *"EMPTY, or the
mover's own QUEEN"* — `A1` names a knight and a rook only, so one further own type slips through, and
the build offers a capture onto the mover's own queen and overwrites it with a pawn; (2) reading the
capture square as *"some ENEMY piece is behind it"* — on `4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1` one
`legalMoves` call rewrites the enemy KNIGHT (byte 10) into a PAWN (byte 9) and playing the move
removes it outright; (3) *"anything that is not the mover's own pawn is behind it"* — 16 corrupting
configurations, **four of which read CLEAN across the call and DIRTY per pair**. The shape is this
board's most-repeated defect for the sixth time on this ticket: **`A1` samples two piece types where
`## Scope` bullet 1 quantifies over every byte, and `A3`'s six rows put nothing but EMPTY or the
mover's OWN pawn behind the target while `## Scope` bullet 2 requires the enemy PAWN.** The delivered
code is correct on all 44 FEN-producible configurations of both axes — this is the criteria's blind
spot, not the module's.

**CLOSED BY QE ON THE `ABC-009` PRECEDENT, WITH NO CRITERION CHANGED.** Both `A1` and `A3` say *"at
minimum"*, so the rows are inside them as written; `src/moves.enpassant.hardening.test.ts` was cut
new (**120 tests**): the target byte quantified over all six of the mover's own piece types on both
colours plus two EMPTY controls, the byte behind quantified over every FEN-producible piece code of
both colours plus EMPTY on both colours, and purity over all 40 positions across the call AND per
make/unmake pair, 128 bytes and five scalars. **Every row is green on the delivered fix**; the three
surviving builds now fail **4 / 30 / 60** tests, **every one of them in the new file**. Suite
**439 -> 559 on 18 files**, skip count **0**, lint / typecheck / build exit **0** (lint's 2 infos are
the pre-existing `biome.json` ones; 1 of 2 `self_fix_attempts` spent on a formatting autofix of this
role's own new file). `src/moves.ts` 100% statements / branches / functions / lines; `mode` is `lean`
so `quality.coverage_threshold` is not enforced.

**THE ENEMY-OCCUPANT AXIS WAS DELIBERATELY LEFT ALONE and is reported as an open gap.** It is `A5`'s
axis, and quantifying it here would make the restructure mutant fail in two files and falsify `A5`'s
own *"fails only here"* — a present-tense comment about the generator's en-passant branch, which is
precisely the class `A11` exists to remove. Measured rather than assumed: **the restructure mutant
passes all 40 hardening rows.** Also still open and named rather than absorbed: non-piece bytes are
out of every in-repo instrument's reach (`parseFen` refuses them, direct writes make the generator
throw), `ADR-0005` 133-138 is unowned, `ABC-023`'s `A4` hash pin is stale, `src/moves.castling.test.ts`
7-10 / 98-99 stay `ABC-009`'s and are already routed to `ABC-023`, and E2E plus the auto-UAT oracle
slot are `UNKNOWN - verify`. The test-integrity checker still exits **2** ("cannot read the registry
file") — *could not run*, not a pass, and **no registry file was created**.

**THE ORCHESTRATOR'S TWO RULINGS, CHECKED.** The two sites beyond `A11`'s citation table
(`src/moves.enpassant.test.ts` 82-83, 95-97) are **NOT challenged** — both sentences are measurably
false, both are gone, and `A11`'s binding clause is about statements this fix falsified rather than
about a list of line numbers. The castling pair stays out of scope and was not counted against this
ticket. Full record: `.grugops/context/ticket-to-pr-ABC-022/notes/`.

---

## board header — _Updated: entry (the 2026-08-10 board tidy, preserved verbatim when QE replaced it)

_Updated: 2026-08-10 by the Orchestrator (board tidy, no task): **THE PER-HOP NARRATIVE MOVED OUT TO `plans/tickets/history/`. NO TICKET MOVED, NO WIP NUMBER CHANGED, NO TICKET BODY EDITED, NOTHING SUMMARISED OR DROPPED.** The board had reached **549,833 characters**, of which **532,677 (97%)** was per-hop transition narrative in 61 HTML-comment blocks and an 11-deep stack of `_Updated:` headers — one single header line was **103,498 characters**. Every entry is now in `plans/tickets/history/<ID>-board-history.md`, **verbatim**, one file per ticket, linked from that ticket. Checked before moving: **98% of that text exists nowhere else** (120 sampled sentences against all 330 context notes — only 3 were duplicates), so this was a relocation and deleting it would have destroyed the audit trail. **ONE ENTRY WAS RESTORED, NOT MOVED:** BA/PM's `ABC-009` `A13` header was **destroyed by the Orchestrator on 2026-08-09**, which treated a newest-first append stack as a single replaceable field; recovered from `e644039` and filed in `ABC-009`'s history. The board now carries what its own FORMAT comment always said it should — columns, WIP counts, one-line ticket rows and the conventions._

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

## board header — _Updated: entry (ARCHIVED ON REPLACEMENT)

Archived 2026-08-09 by the Orchestrator when the board's single `_Updated:` line was replaced at
`ABC-022`'s close. Verbatim.

_Updated: 2026-08-09 by Security/NFR (task `ticket-to-pr-ABC-022`, subtask `security-nfr-abc022-gate`, Workflow 04): **`ABC-022` PASSES the risk/NFR gate — PASS_WITH_RISKS. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4.** No limit approached, no override taken; ticket frontmatter moved with the column. NO REQUIRED FIX, NO HIGH-SEVERITY ITEM, 13 accepted risks each with a NAMED OWNER — including `ADR-0005` 133-138, which had none until this hop. `src/moves.ts` NOT touched (md5 `6335b452…`, a fifth gate); `## Acceptance` NOT edited (md5 `7123d5c6…`); `plans/nfr-catalog.md` NOT edited and no target moved. **`NFR-001` / `A10` MET on every clause, nothing inherited:** count **331 / 216,269 / 0** (a fourth independent derivation) plus **4,177 / 3,417,014 / 0** over the clock's own population and a measured **<= 1 evaluation per `generateMoves` call**; floor **6,172,810 nodes/sec** vs >= 1M; aggregate ratio **0.9996** vs >= 0.98 with a byte-identical null control deviating **23.1x the signal**; deep lane **32/32 in 36.06 s**. **`NFR-005` excluded structurally, confirmed TWO ways** (bytes, and `hasLegalEnPassant` never calling the generator) and the benchmark NOT re-run. **Security classification CHECKED against ASVS L1, not inherited, and it HOLDS** — reliability, not security; the `epSquare` value domain nobody had swept reads **0 throws over 514 states** on both trees and the fix HALVES the emitting surface. **UAT NOT ruled on — the Orchestrator's.** NOTHING MERGED, NOTHING DEPLOYED. **Detail: `plans/tickets/history/ABC-022-board-history.md` and `.grugops/context/ticket-to-pr-ABC-022/notes/`.** (The QE header this replaces is preserved verbatim in that same history file, per the rule below.)_

---

Archived 2026-08-10 by BA/PM (task `ticket-to-pr-ABC-023`, Workflow 07) when the board header was
replaced by `ABC-023`'s `Backlog` -> `Ready` promotion. The outgoing line, verbatim:

_Updated: 2026-08-09 by the Orchestrator (task `ticket-to-pr-ABC-022`, Workflow 04): **`ABC-022` CLOSED — merged to `main` and moved `Ready for UAT` → `Done`. Ready for UAT 1/4 → 0/4.** Fast-forward `cb6515f` → `52c6443`, 18 commits, **no merge commit** (`git rev-list --count branch..main` 0 and `git log --merges` empty, both checked BEFORE the merge). Gates run on the branch tip and AGAIN on `main`: lint/typecheck/build **0** both sides, **559/559 on 18 files**, skip count **0**, `PERFT_DEEP=1` **32/32 exact**. **`src/moves.ts` md5 `6335b452…` IDENTICAL to the Engineer's first commit through all FIVE later hops** — no gate ever repaired the module to make its own verdict green, and `## Acceptance` hashed byte-identical across both gates. **THE FIX IS TWO GUARD CONDITIONS AND A LOCAL CONST** in `addPawnMoves`, `+24 −12`, deriving the capture square the same way `apply.ts` does so generator and applier cannot disagree. Pulled only after BA/PM found **SEVEN** acceptance defects at the pull where the pre-check named two, then **FIVE MORE** false statements at an `A11` sweep the Engineer triggered by flagging one rather than fixing it — **the Orchestrator's own `dev2` brief then contradicted `A11`, was escalated rather than absorbed, and the boundary was lifted.** QE PASS after finding **three typecheck-clean builds that passed all eleven criteria, all 439 tests AND deep perft 32/32** — a gap in the criteria's tables, never in the module, closed with 120 new rows and no criterion amended. Security/NFR **PASS_WITH_RISKS**, no required fix, nothing at `high`, **13 accepted risks each with a named owner**; `NFR-001` met on a **count** (331/216,269/0, four independent derivations) because the clock cannot resolve it — the `cmp`-verified null control deviates **23.1× the fix's apparent cost**. **UAT DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED**: there is no CLI entry point, so no human can exercise this and a UAT pass would be a fabrication. **NOTHING DEPLOYED** — a human holds deploy. Per-ticket detail is in `plans/tickets/history/`, not here._

---
