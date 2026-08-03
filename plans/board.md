# Board
_Updated: 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, subtask `security-nfr-abc011-regate`, Workflow 04): **ABC-011 moved `In Security/NFR` → `Ready for UAT` on the SECOND risk/NFR gate — VERDICT PASS** — In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; **no limit approached, no override taken, no written reason owed.** The `In Security/NFR` exit is the one board move this role owns. Gated through `349b1db` against `security.asvs_level: L1` and `security.block_on: high`: **no security finding at any severity, nothing at or near `high`, so nothing blocks.** **THIS RUN COMPLETES AN INTERRUPTED ONE, AND THAT IS THE FIRST THING THIS RECORD HAS TO SAY.** An earlier attempt at this subtask was cut off mid-flight. It had already moved this board to `Ready for UAT` with a PASS and written long figure-carrying blocks into `plans/board.md`, `plans/nfr-catalog.md` and `plans/traceability.md` — but it **published no typed note at all**, so the board asserted a verdict the shared verified context did not back, which under "no published notes, no advance" is not admissible. That prose was never committed. **It has been REVERTED rather than patched, and every figure below was re-derived by this run on its own scripts** — its numbers were treated as evidence to be checked, not as this run's conclusions. Where a figure reproduced it is named as confirmed; where it did not, THIS run's figure is the record and the difference is stated. **THE MEDIUM PURITY DEFECT THE OWNER DECLINED TO MERGE IS CLOSED, at HIGH confidence, verified by this column rather than accepted:** all **13** known reproductions answer `false` and are byte-pure through `zobristKey`; **336,000 adversarial inputs of this gate's own construction read 0 impure and 0 throws**; and the instrument is **non-vacuous by the strongest available control — the REAL pre-guard tree `584defa`, the code the owner declined to merge, reads 14,341 impurities on the identical population and is impure on 6 of the same 13.** Closure also has a structural argument re-derived here: guard (b) establishes the precondition `undoSpecial`'s unconditional write assumes and does not state, guard (a) establishes the destination is empty and additionally rejects every out-of-array target (`board[oob]` is `undefined`, and `undefined !== EMPTY`). **`NFR-005` RE-MEASURED INDEPENDENTLY, FOUR TREES IN ONE PROCESS — merged `4c6ed7d`, pre-guard `584defa`, shipped, and a BYTE-IDENTICAL TWIN of the shipped tree as a NULL CONTROL BY IDENTITY** — 15 rounds × 100,000 iterations, rotated tree and cell order, medians, two full samples, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64** and `UNKNOWN - verify` on any other hardware. **BOTH BAR POSITIONS MET WITH ROOM: startpos 296.8–299.3 ns against the ~450 ns bar (1.004–1.008x of merged), kiwipete 304.7–307.4 ns against the 432–459 ns bar (0.993–0.999x of merged).** **The CALL-COUNT sub-bar is MET, re-verified on this gate's own spy through a copy of `zobrist.ts` whose body differs from the shipped file by one import specifier and nothing else: 518,474 nodes hashed, 81,397 carrying an ep square (15.70%), 81,397 predicate calls, ZERO on the 437,077 no-ep nodes, never more than one per call, and `zobristKey` pure at every node** — reproduced here to the node, on a walk whose depths were read out of `src/perft.test.ts` rather than recalled. **THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST AND NO NUMBER IS CLAIMED FROM IT.** Every shipped-minus-pre-guard whole-key delta sits inside the identity twin's own per-cell band, and the deltas FLIP SIGN between this gate's two samples (startpos −0.69 then −3.24 ns; kiwipete −1.54 then −7.25 ns). Measured instead on the predicate in isolation, in a process that does nothing else, 21 rounds × 500,000 iterations with the same identity twin reading ±0.04 ns on the tight cells: the guards cost **about +0.9 ns** on the ep-set/no-capture shape = **≤ +0.15 ns amortized per node** at the measured 15.70% ep frequency, about **0.05%** of a ~305 ns key; below resolution on the shapes where a capture exists; and **23x CHEAPER (123.4 → 5.4 ns) on the invalid-FEN class the guards exist for.** That is consistent with the Engineer's ≤ +0.41 ns and the design hop's ≤ +0.5 ns and does **not** confirm their per-cell point estimates. **THE WITHDRAWAL OF THIS COLUMN'S OWN "the worst-case spread is resolved" SENTENCE (2026-08-02/03) STANDS, and this run's figures are further evidence for it, not against it:** this gate reads the worst-case ep shape at **1.401–1.412x**, where the first gate read 1.385–1.400x and the interrupted run read 1.446–1.458x. Three protocols, three answers inside about ±4% — the same size as the spread that was once called resolved. **The bar is unaffected: it is anchored at kiwipete/startpos, and the worst-case ep shape is not a bar position.** **THE TWO COST-SHAPED EQUIVALENT MUTANTS QE HANDED THIS COLUMN ARE DELIBERATELY NOT PINNED, and this gate owns the call with its reasons:** deleting `hasLegalEnPassant`'s own `NO_SQUARE` early return, and moving both guards inside the `EP_CAPTURE_SIDES` loop. Both survive all 214 tests (verified here by running them). Both are behaviour-equivalent over **83,400** inputs of this gate's own construction — 0 answer, 0 key, 0 purity differences. **No spied call count distinguishes either: 0 of 9 call shapes, at the predicate AND through `zobristKey`** (makeMove / unmakeMove / isSquareAttackedBy identical everywhere), so the instrument `src/zobrist.nfr.test.ts` exists for cannot be pointed at them. **The early-return deletion costs STRUCTURALLY ZERO in production**, because `zobristKey` is the ONLY production caller of the predicate and its `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters the callee — a stronger statement than a nanosecond figure, and the reason no nanosecond figure is quoted. **The only instrument that COULD see them is a Proxy board-read counter, and this gate measured that instrument to be unusable here:** a Proxy over the `Uint8Array` board **throws outright** — `TypeError: this is not a typed array` from `kingSquareOf`'s `board.indexOf` — so it does not even run without a function-binding shim; shimmed it costs **11.1–13.6x**, and its mere presence in the same process inflates the *un-instrumented* readings by **2.0–3.0x**. An instrument that destroys what it measures cannot found a budget assertion. **Owner: Security/NFR at `EPIC-004`**, when a search exists and a per-node budget makes 0.05% worth an assertion. **TWO FIRST-PASS RESIDUALS ARE CLOSED AND THIS PROJECT CAN STOP CARRYING THEM — QE's report is CONFIRMED by running it: `Z1` (reorder the call-site conjunction) and `Z4` (drop the `epSquare` guard) are each KILLED by `src/zobrist.nfr.test.ts`'s spied zero-call assertion**, one test killing both. **THE UNCOMMITTED EDIT TO `src/zobrist.nfr.test.ts` IS KEPT, AFTER BEING CHECKED RATHER THAN INHERITED:** it is **comment-only**, proved mechanically (both revisions stripped of comments are md5-identical — zero assertion, import or fixture lines changed), and its four-combination deletion table was **re-derived here and is correct** (early return alone → pure; + guard (a) → pure; + guard (b) → pure; + BOTH guards → the stray pawn on off-board square 15 returns and both cases fail, confirmed by applying that mutant to the repository's own `src/` and watching the two assertions fail). **One sentence of it was WITHDRAWN as unsupportable and corrected:** it quoted "about +1.6 ns" for the direct no-ep call, and this gate's own benchmark reads +0.9 to +2.9 ns on cells where that deletion's delta is STRUCTURALLY ZERO — the cross-tree systematic floor is the same size as the signal, so no point estimate survives. **ASVS L1, judged rather than padded: the full 70-row tier was NOT re-run, and that is a decision with a reason, not an omission.** The delta since this column's first pass is **four executable lines** in one pure function (`src/legal.ts`, hoist `captured` + two board-read guards) plus a doc-comment-only edit to `src/zobrist.ts`; verified here that **no import was added or widened, no dependency changed (`package.json` / lockfile diff empty, zero runtime dependencies), no sink or I/O or `process.env` exists anywhere in `src/`, and no secret-shaped string is in the diff.** What actually moved was re-checked: **V2.1.1 / V2.2.1** (input validated to business expectations) moves in the GOOD direction — the library no longer corrupts a caller's position on a semantically-inconsistent FEN — while the underlying FEN semantic-validation gap is unchanged and still **`ABC-010`'s**. The two new reads can address out-of-array indices; on a `Uint8Array` that returns `undefined` and is **not** a memory-safety issue, so **V1.4.1 stays NOT-APPLICABLE** (and is L2 in any case). The **V15.1.1 / V15.2.1** severity override to `low` recorded at the first pass stands unchanged (owner: Architect/Design at `EPIC-006`), and **V13.4.1 stays DEFERRED, not passed.** Suite re-run by this gate: **214 passed / 9 files / 0 failed / skip count 0**; `npm run lint`, `npm run typecheck`, `npm run build` all **exit 0** (the same 2 pre-existing biome config-schema infos). **FOUR accepted risks, each with a named owner; NO required fix outstanding.** UAT recorded as **DEFERRED to `EPIC-006`, not passed** — no runnable game exists, so there is no surface a human can exercise. `ADR-0005` is still `proposed`; **no agent may mark it `accepted` and this gate did not.** **NO PR — this repo has no git remote. NOTHING MERGED, NOTHING DEPLOYED — a human holds both.** Previously 2026-08-03 by QE/E2E (task `ticket-to-pr-ABC-011`, subtask `qe-abc011-review-fix`, Workflow 04): **ABC-011 moved `In Review` → `In Security/NFR` on the SECOND review pass — VERDICT PASS** — In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; **no limit approached, no override taken, no written reason owed.** The `In Review` exit is the one board move this role owns. **The MEDIUM purity defect the project owner declined to merge is GENUINELY CLOSED**, and that verdict was reached by re-deriving the ticket and by breaking the delivered suite with mutants — **not** by re-running the Engineer's suite and reading the green. **49 mutants against the CHANGED production surface** (the first pass's 22 re-run plus 27 new ones aimed at the guard surface): **44 killed, 5 survived, and all 5 were then PROVED behaviour-equivalent** over 55,600 adversarial inputs each — same answer, same key, same purity — rather than merely left unkilled. **TWO OF THE NEW MUTANTS SURVIVED ALL 206 DELIVERED TESTS AND WERE REAL, both of them exactly the “one-line equivalent simplification” the second design hop warned about:** guard (b) relaxed from “exactly the enemy PAWN” to “any enemy PIECE” is green on 206 tests and **permanently rewrites a black KNIGHT on the ep capture square into a black PAWN from a single `zobristKey` call** (`4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1`) — the owner's MEDIUM defect reopened in a shape no delivered row reaches; and guard (a) relaxed from “the target is EMPTY” to “the target holds no ENEMY piece” is green on 206 tests and **answers `true` on the exact FEN guard (a) exists for**, the `generateMoves` own-piece case (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`) — pure, and still the wrong answer. **THE SHIPPED CODE IS CORRECT ON ALL FOUR AND NO PRODUCTION LINE WAS CHANGED** — these were holes in the SUITE, not defects in the fix, because the delivered table classifies boards by what is MISSING and never by what is PRESENT INSTEAD. **Closed by 8 tests this gate added** (4 FENs × predicate and key level); suite **206 → 214 passed / 9 files / skip count 0**, lint / typecheck / build all **exit 0**, both changed modules **100%** coverage. **The Engineer's three load-bearing claims were each VERIFIED rather than accepted, and all three hold:** the two guards are load-bearing with **DISJOINT** failure sets (4 / 7 / 13 as reported, and 8 / 11 / 21 with intersection still EMPTY after this gate's strengthening); the correction that `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` is closed by **EITHER** guard alone and so kills neither single-guard mutant is **TRUE** and is now measured twice; and **“no existing test was modified” holds at LINE LEVEL, checked three ways** — 0 absent lines from 584defa, 0 from the branch tip (this gate's tests are pure appends and widened no import either), and from the branch point 4c6ed7d exactly 6 absent lines, **all six imports**, zero non-import lines gone across the whole branch; `src/zobrist.test.ts:33-37` is **byte-identical**, moved to 43-47 only. **PURITY WAS ATTACKED FROM OUTSIDE THE ENGINEER'S SWEEP: 187,328 inputs the delivered 665-input sweep does not reach** — random boards, **hand-corrupted off-board squares (the case the Engineer named as unverified)**, kingless and multi-king boards, extreme counters, and `epSquare` = `NaN` / `Infinity` / fractional / out-of-array including −256 and 256, which pass `isOnBoard` through two's complement — **0 impure, 0 throws**, against **1,383 impurities** from the same hunter on a guard-stripped control, so the instrument is non-vacuous. Reachable population re-derived a **sixth** independent time: **518,474 / 81,397 (15.70%) / 0 / 0 / 0 / 0**. **Two first-pass residuals are now CLOSED and should stop being carried:** the Z1+L11 combined mutant (green suite, stray pawn on off-board square 15) no longer reproduces — guard (b) rejects it even with guard (a) also deleted — and Z1 and Z4 are now **killed by `src/zobrist.nfr.test.ts`**, the test the Security/NFR gate wrote in response to that very handoff. **`NFR-005`'s cost bars were deliberately NOT re-measured — Security/NFR owns them and re-gates next**; two cost-shaped equivalent mutants are handed to it by name. **ONE CORRECTION TO THE ENGINEER, non-blocking:** its claim that guard (a) “may become deletable” if BA/PM fixes the `generateMoves` defect is **over-stated** — guard (a) is load-bearing for TWO classes and only one is that defect. **`ABC-009`, `ABC-010` and the `generateMoves` own-piece defect are carried, not fixed.** **No PR — this repo has no git remote.** Nothing was merged and nothing was deployed; a human holds both. Previously 2026-08-03 by the Software Engineer (task `ticket-to-pr-ABC-011`, subtask `engineer-abc011-fix-purity`, Workflow 04): **ABC-011 moved `In Development` → `In Review` on the SECOND dev pass** — In Development 1/3 → 0/3, In Review 0/3 → 1/3; **no limit approached, no override taken, no written reason owed.** The `In Development` exit is the one board move this role owns. **The MEDIUM purity defect the project owner declined to merge is CLOSED, and all six known reproductions with it** — QE's three, the fourth the second design hop found, and the two pure divergences where the shipped predicate was already byte-pure and only its answer was wrong. Each was reproduced independently against the shipped tree BEFORE any code was written. **The fix is the two guards as ruled, and EACH WAS PROVEN LOAD-BEARING BY DELETING IT: guard (a) deleted → exactly 4 named tests fail, guard (b) deleted → exactly 7, both deleted → 13 and the pass count falls to the pre-fix baseline of 193. THE TWO FAILURE SETS ARE DISJOINT** — neither guard subsumes the other, so the "looks equivalent" one-line simplification is now caught by a test rather than by a comment. Production delta is FOUR executable lines (`src/legal.ts` +32/−6, the rest comment) plus a doc-comment-only `src/zobrist.ts` (+5/−1); `zobristKey`'s condition and signature, `src/apply.ts`, `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are **byte-untouched**. Purity is asserted over the **full position state** — all 128 board bytes and all five scalars, never `toFen` — for **EVERY** ep-square value rather than only reachable ones. Suite **206 passed / 9 files / skip count 0** (was 193), lint / typecheck / build all **exit 0**, and **no existing test was modified: zero changed pre-existing lines in either test file**, not even a widened import. `NFR-005` re-derived by this role rather than inherited and **MET** (startpos 291.3 ns, kiwipete 313.6 ns; ≤ +0.41 ns amortized per node; 20–25x cheaper on the invalid class; zero on the no-ep path, structurally). `ABC-009`, `ABC-010` and the `generateMoves` own-piece-capture defect are **carried, not fixed**. **No PR — this repo has no git remote.** Nothing was merged and nothing was deployed. Previously 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`, Workflow 04): **ABC-011 moved `In Design` → `Ready for Dev` at the SECOND design hop** — the first ticket in this project's history to enter `In Design` twice. In Design 1/2 → 0/2, Ready for Dev 0/6 → 1/6; **no limit approached, no override taken, no written reason owed.** The `In Design` exit is the one board move this role owns. **No production code was changed at this hop**, and no acceptance criterion, reproduction FEN, `NFR-005` bar or `## Out of scope` line was re-opened or edited — the first `### ANSWERED` block stands unamended and a second, dated one sits beside it. **THE DEFINITION QUESTION IS RULED: purity is UNCONDITIONAL, the answer is DOMAIN-RESTRICTED, and the first is bought with a PRECONDITION rather than with a change to what the predicate means.** `hasLegalEnPassant` synthesises its probe `Move` instead of taking one from the generator, and `undoSpecial` (`apply.ts:106-110`) writes `move.captured` back unconditionally — so when the board never held that piece the “restore” is a creation, and permanent. Two conditions make the probe well-formed and both must be checked BEFORE `makeMove`: **(a)** the ep target is empty, **(b)** the square behind it holds exactly the enemy pawn the probe claims to take. **Rule 5 gains NO domain qualifier** — a query that damages its argument is broken whatever the argument means. **THE PART THAT COULD NOT BE DELEGATED: THEY ARE TWO GUARDS, NOT ONE.** Security/NFR's one-line sketch (`board[target] === EMPTY`) is neither sufficient nor the one that fixes the corruption. **(b) is the PURITY guard** — it closes all three of QE's reproductions **and a FOURTH nobody had**, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (an ep square on the wrong rank for the side to move, dropping a phantom BLACK pawn on a2), which **(a) does not catch** because a3 is empty. **(a) is the ANSWER guard and purity does not need it** — on `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its mirror the captured pawn IS present, make/unmake round-trips BYTE-EXACTLY, and the shipped predicate still answers `true` where the oracle answers `false`: **a PURE divergence, constructed at this hop, which no prior hop had.** “Corrupts” and “disagrees with the oracle” are two different failures that QE's three FENs conflate, and a fix aimed at either alone leaves the other live. **The oracle is not the authority off-domain, and that is FORCED rather than convenient:** `legalMoves(...).some(...)` stays the DEFINITION and the test oracle on positions whose ep square the board does not contradict — a domain containing everything `makeMove` can produce, hence everything reachable by play — but outside it the generator is **unsound**, measured not conceded: it corrupts identically on two of QE's three FENs, and on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` it offers a pawn **capturing onto the mover's own knight**. So the predicate is SPECIFIED off-domain instead — `false`, and it touches nothing. **THE CASTLING FOLLOW-ON IS RULED: CASTLING IS NOT THE SAME CASE.** `zobristKey` keeps hashing castling RIGHTS and must not be changed to hash availability. **Answered from the retained FIDE text, whose sha256 AND CURRENCY were both re-verified today rather than inherited** — a fresh fetch is byte-identical to the retained copy (`e0c8bee2…`), and FIDE's own handbook index still publishes exactly `E012014`/`E012017`/`E012018`/`E012023` with nothing after 2023 (`E012024`/`25`/`26` return the same soft-404 shell as a deliberately nonsensical chapter id — control run). Three reasons, ascending: **(i)** 9.2.3.1 is written in the CAPABILITY mood (*“could have been captured”*) and 9.2.3.2 in the ENTITLEMENT mood (*“had castling rights”*, *“forfeited these”*), and 9.2.3.2 carries a sentence with no counterpart in 9.2.3.1 — *“The castling rights are lost **only** after the king or rook is moved”* — whose “only” excludes transient blockers; present in all four editions, 2014–2023. **(ii) THE DETERMINACY ARGUMENT, verified against this codebase:** `addCastlingMoves` (`moves.ts:299-319`) reads exactly `castling`, `board` and the side to move, so two positions with the same placement and side to move can differ in castling legality **only** if their rights differ — precisely what was NOT true of en passant, where the ep square is an extra bit not determined by placement. Same Laws sentence, opposite consequence. **(iii)** The residual over-discrimination is real and REPRODUCED (startpos; a knight still on g1; the king in check; f1 attacked — identical legal-move sets, different keys) and it is the SAFE direction: a draw missed, never one invented. “Fixing” it would put `isSquareAttackedBy` on a component carried by **71.0%** of nodes against the 15.70% carrying an ep square. Also checked exhaustively: **368,344 nodes carry a castling right and ZERO are stale.** **`ADR-0005` IS RATIFIED — `accepted`, WITH AN AMENDMENT, and not as a rubber stamp:** one of its statements was FALSE as written (its Consequences described a predicate that “plays a move and takes it back”, which the shipped code does not do on that class). Clauses 1–5 accepted unchanged; **Decision clause 6 is NEW** (the precondition), decided-but-not-yet-built on the `ADR-0002`-clause-2 precedent; a scope bound was added because the ADR was read wider than it is. **`ADR-0006` is NEW and `accepted`** — the castling ruling, **separate** rather than a sixth clause, because it is a different decision from a differently-worded clause landing the opposite way, and because `ADR-0005` was ratified in the same session on gated evidence while this ruling has been through no gate. **Both ADRs now carry per-clause FALSIFIER TABLES**, each checkable without trusting the file; the honest counter-argument against `ADR-0006` existing at all is recorded in its own Status section. **RE-DERIVED, NOT INHERITED:** exhaustive walk of `src/perft.test.ts`'s table at its own `fast` depths on a FOURTH independently written script — **518,474 nodes / 81,397 with an ep square**, reproducing the design, dev and QE hops **to the number**; neither guard fires **once** on that population, the answer changes on **0** nodes and the key on **0**, so they are preconditions and not a behaviour change. The guarded shape against the repository's own suite in a sandbox: **193/193 green, 0 skipped, `tsc` exit 0, NO EXISTING TEST EDITED** — including `src/zobrist.nfr.test.ts`'s call-count and byte-identity assertions. The six specified tests were **each PROVEN to fail** rather than assumed to: 10 of 14 assertions fail against shipped, exactly **2** against guard-(a)-removed, exactly **6** against guard-(b)-removed; one boundary probe kills nothing and is named so rather than counted as coverage. **COST:** **zero** on the no-ep path and at both `NFR-005` anchors, structurally — the caller's short-circuit never enters the predicate; **+0.9 to +3.0 ns per call** on the 15.70% of nodes with an ep square, i.e. **≤ +0.5 ns amortized per node**, under 0.15% of a ~317 ns key; **20–27x cheaper** on the invalid class. Two whole-key runs bracket 1.0 from both sides, so the delta is below that instrument's resolution and no number is claimed from it. **No `NFR-005` bar and no catalog target moves**; Security/NFR re-gates. **Size stays `M`** — two conditions in the one function this ticket already changes, six test cases and two doc corrections, all smaller than the delta that took it `S` → `M`. **ONE ITEM IS ROUTED TO BA/PM RATHER THAN CUT HERE:** `generateMoves` offers an en-passant capture onto a square occupied by the **mover's own** piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1`, both verified) — a generator defect on the invalid-FEN class, a sibling of `ABC-009`; this fix makes the **hash** immune to it, it does not clean the generator. **`In Development` is deliberately NOT entered — that pull is the Orchestrator's.** Nothing was merged and nothing was deployed — a human holds both. Previously 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, Workflow 04 step 6): **ABC-011 PASSED the risk/NFR gate** and moved `In Security/NFR` → `Ready for UAT`. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. The `In Security/NFR` exit is the one board move this role owns. Nothing was merged and nothing was deployed — a human holds both. **Result PASS with three accepted risks, each carrying a named owner.** **NFR-005 was re-measured INDEPENDENTLY and nothing was accepted from the Engineer's or QE's figures** — own scripts, own `git archive` baseline of `4c6ed7d`, both trees in ONE process, 300k iterations per cell, interleaved forward and backward, two samples, on Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): **startpos 297.2–298.4 ns against a ~450 ns bar and kiwipete 323.5–330.9 ns against a 432–459 ns bar — both MET with room**, worst-case per-call shape **1.385–1.400x**, under the 1.5x bar. **The spread this column was asked to adjudicate is resolved:** my worst-case figure lands BETWEEN the dev hop's 1.357–1.383x and the design hop's 1.45–1.48x, so three runs agree the shape is real and comfortably inside the bar. **The no-ep sub-bar holds STRUCTURALLY, and wall clock is the wrong instrument for it** — on a no-ep node the `epSquare` guard short-circuits and the executed work is byte-for-byte the baseline's; re-spied with this gate's own counting shim through a `cmp`-verified copy of `zobrist.ts`: **277,955 nodes / 17,663 ep-set / 17,663 predicate calls / ZERO on the 260,292 no-ep nodes**, identical to the Engineer's counts to the node. **The gap both prior roles handed forward is PINNED, not waived: `src/zobrist.nfr.test.ts`**, in its own file on the ABC-020 precedent so the hoisted `vi.mock` factory re-routes nothing else. Four assertions, **each PROVEN to fail rather than assumed to** — they kill `Z1`, `Z4` and `L11`, the three mutants that survived a 189-test suite. This gate added a second L11 probe FEN of its own (`4K3/8/8/8/8/k7/p7/R7 b - - 0 1`), where the predicate still returns the CORRECT `false` and still dirties the board, so the byte-identity assertion is load-bearing and not redundant. **The off-board write is ruled a CORRECTNESS defect, NOT a memory-safety one, and the distinction was measured:** `board` is a `Uint8Array(128)` and index 15 is INSIDE the allocation — "off-board" is the 0x88 encoding's logical predicate, not a memory bound — and this runtime DISCARDS out-of-allocation typed-array writes outright (probed: `probe[-1]` and `probe[999]` read back `undefined`, length unchanged). It still earned a guard, because it breaks the invariant `kingSquareOf`'s whole-array `indexOf` scan explicitly leans on. **QE's new defect is ruled MEDIUM and does NOT block:** reproduced on all three FENs against the shipped tree and clean on the `4c6ed7d` baseline, so the property is genuinely new; reachability verified independently at the only two writes to `epSquare` in `src/` — `apply.ts:139` derives it as the double-push midpoint, so no position reachable by play can trigger it and the class is ABC-010's, which `## Out of scope` carries. **NO security finding at any severity and nothing at or near `security.block_on: high`.** The ASVS L1 tier is 70 requirements and most are not-applicable by absence of the surface they name (no auth, no session, no authz, no tokens, no web, no files, no TLS, no personal data); four rows are named rather than dismissed — V11.4.1 (hash choice: not a cryptographic use case, named because it is exactly what a scanner would false-positive on), V2.1.1/V2.2.1 (FEN semantic validation, partially met, pre-existing, ABC-010's), V15.1.1/V15.2.1 (no documented dependency-remediation policy; **severity OVERRIDDEN from the L1 default `high` to `low` with the reason stated** — zero runtime dependencies and this change adds none) and V13.4.1 (deferred to EPIC-006, not passed). Gates re-run with the new guard in place: **193 pass / 0 skipped** (was 189), lint, typecheck and build all exit 0. `ADR-0005` is still `proposed`; no agent may mark it `accepted` and this gate did not. Previously 2026-08-03 by QE/E2E (task `ticket-to-pr-ABC-011`, Workflow 04 step 5): **ABC-011 PASSED review** and moved `In Review` → `In Security/NFR`. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. The `In Review` exit is the one board move this role owns. Nothing was merged and nothing was deployed. **QE fixed no production code** — `src/legal.ts` and `src/zobrist.ts` are byte-identical to `98b07e7`; five tests were added plus one assertion line, all green, skip count still 0, suite **184 → 189**. **The verdict was reached by independent re-derivation and by breaking the delivered suite, not by re-running it: twenty-two mutations** (the ABC-020 gate ran thirteen, and this change is one condition inside a function `EPIC-004` will call per node). **Seventeen were killed; five survived, and two of the five were real.** **`L8` — `if (legal) return true;` → `return legal;` — gives up after the FIRST candidate capturer and survived a 184-test suite**; it is not equivalent: on `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` the lower-file capturer is pinned and the higher-file one is legal, so the mutant **over-collapses** two positions FIDE calls different — a false repetition, the OPPOSITE of the safe error direction this ticket's priority argument rests on. The property test cannot reach that shape: over an exhaustive **518,474-node** walk exactly **two** nodes have two pseudo-legal ep capturers at all and in neither is the lower-file one illegal, so the FEN had to be built. **`Z5` — the ep FILE is load-bearing in no test — survived, and re-running it against the pre-ABC-011 baseline (174/174 green) proves it PRE-EXISTING rather than introduced.** Both closed, plus a black mirror and a byte-purity walk. **The three remaining survivors are ONE gap and it is Security/NFR's — the Engineer's flag is UPHELD on evidence rather than deference:** `Z1`/`Z4`/`L11` are behaviour-**equivalent** (each leaves 189/189 green and changes no key on any input), so only cost moves and only on the majority path, which is `NFR-005`'s sub-bar verbatim; a spied call count is the instrument, exactly the `src/gameend.nfr.test.ts` shape this column wrote for `NFR-001`. **One fact neither prior hop had, handed forward: `Z1` and `L11` TOGETHER are still 189/189 green and make `zobristKey` write a stray piece onto off-board square 15**, breaking `src/position.ts`'s own stated invariant. **ONE NEW DEFECT found, named rather than fixed: since ABC-011, `zobristKey` PERMANENTLY corrupts a position whose ep square is semantically inconsistent** — three reproductions, e.g. `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black pawn on d5. Fair to the Engineer and checked before writing: on two of the three the predicate's own ruled ORACLE corrupts identically (pre-existing in `generateMoves` + `apply`), and "does not inherit `ABC-009`" is TRUE as stated and was independently verified on `ABC-009`'s own trigger FEN; what is new is the third FEN, where the oracle stays clean and the predicate does not, and that `zobristKey` was pure on every input before this ticket. Trigger class is semantically-invalid-FEN only — the class `ABC-009`/`ABC-010` already occupy and this ticket explicitly carries — and **277,949 reachable nodes are 0 impure**. Not fixed (QE does not change production code) and not pinned (a test asserting the current output would enshrine it); the property that IS true is now pinned instead. **Every load-bearing claim on the branch was checked and held:** no existing test modified (verified line-level — exactly three lines absent from each test file, all imports, zero non-import lines gone; `src/zobrist.test.ts:33-37`'s body byte-identical); AC4's property test non-vacuous in **both** halves in fact (557 double pushes, 52 answered, 505 not, 0 violations) though `checked > 0` did not pin the collapse half, closed with one declared added line; purity over the full position state at **277,949** reachable nodes, 0 impure, agreeing with the Engineer's spy to the six root positions; the module graph rebuilt a third time — **acyclic, depth 6, `zobrist` 2 → 5, `gameend` 5 → 6**; and the divergence table reproduced to the number (518,474 / 81,397 / 77,872 / 862 = 861+1 / **0**) with a new column, **zero** predicate-vs-oracle disagreements over all 81,397 ep-set nodes. The 174 baseline was re-run from a `git archive` extract of `4c6ed7d` rather than trusted. **The `memory-bank/30-architecture.md` module-table ordering is UPHELD as the Engineer left it** — it orders by conceptual layer, not DAG level, and reordering would be the unrequested refactor rule 9 forbids; one content imprecision in the `Hashing` row is named, not fixed. **`NFR-005`'s cost bars were deliberately NOT re-measured** — Security/NFR owns them next. Gates: **189 pass / 0 skipped**, lint, typecheck and build exit 0, both changed modules 100%. Five items are recorded as a `claim` at `confidence: UNKNOWN - verify`. `ADR-0005` is still `proposed` and no agent may mark it `accepted`. Previously 2026-08-03 by the Software Engineer (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 moved `In Development` → `In Review`, implemented on branch `grugops/ticket-to-pr-ABC-011` — the one board move this role owns.** In Development 1/3 → 0/3, In Review 0/3 → 1/3; **no limit approached, no override taken.** The diff is four files under `src/` (+265/−9) and two doc edits: `src/legal.ts` gains ONE new export (`hasLegalEnPassant`) and `src/zobrist.ts` changes ONE condition and gains ONE import; the rest is tests. `src/gameend.ts`, `src/apply.ts` and `src/moves.ts` are byte-untouched, `zobristKey`'s signature is unchanged and no state was added to `Position`. **The design hop's `### ANSWERED` block was built exactly as ratified and none of its six rules was traded away** — including the two the board flagged as traps rather than preferences: the predicate is NOT `legalMoves(...).some(...)` and it is NOT homed in `src/moves.ts`. **Rule 1's short-circuit is SPIED rather than asserted:** over a depth-3 walk of all six perft positions, 277,955 nodes hashed and 17,663 carrying an ep square, `hasLegalEnPassant` was called exactly 17,663 times — **ZERO calls on the 260,292 no-ep nodes**, so the majority path runs the instructions it ran before. **Every acceptance criterion is green**, and the two that were the point hold together: the repro pair now hashes **EQUAL** while both regression guards still hash **DIFFERENT**. **No existing test was modified** — three import lines were widened across the two test files and every other original line in both is byte-identical, verified by diffing each original line against the new file rather than by inspection; `src/zobrist.test.ts`'s en-passant fixture is untouched and still passes. **The design hop's numbers were re-derived independently, not quoted, and every one reproduced to the number:** an exhaustive walk of the perft table at `src/perft.test.ts`'s own `fast` depths gives 518,474 nodes / 81,397 with an ep square, and property violations against the FIDE ground truth of **77,872 for merged, 862 for the rejected board-only reading** (861 of them `position-3`, 1 `position-4`) **and ZERO for the shipped strict reading**; the module graph rebuilt from `src/*.ts` is still acyclic and still max depth 6, with `zobrist` 2 → 5 and `gameend` 5 → 6. **`NFR-005` measured, not inferred**, merged vs ABC-011 in the SAME process against a pre-change copy of `src/` outside the repo, 300k iterations per cell, interleaved, two independent samples, on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): **startpos 302.9–306.5 ns against a ~450 ns bar, kiwipete 309.1–315.6 ns against a 432–459 ns bar**, worst-case per-call shape **1.357–1.383x** (below the design hop's recorded 1.45–1.48x) and **0.9948–1.0218x amortized** over a 120,000-node pool at natural ep frequency. Gates: **184 passed / 0 skipped** (was 174), lint, typecheck and build all exit 0. **No PR exists and none was invented — this repo has no git remote**, so there is nowhere to push; the commits sit on the local branch. **`ABC-009` and `ABC-010` are carried, not fixed**, and the shipped predicate demonstrably does not inherit `ABC-009` — proved on its own trigger FEN. **One gap is flagged for the next gates rather than absorbed:** rule 1's short-circuit is held by construction and by an out-of-repo spy, by no test in the repo — the same gap the ABC-020 Security/NFR gate closed for `NFR-001`, and left to that gate on the same precedent rather than taken here as unsized scope. **`ADR-0005` is still `proposed`; no agent may mark it `accepted` and none did.** Nothing was merged and nothing was deployed. Previously 2026-08-02 by the Orchestrator (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 pulled `Ready for Dev` → `In Development` — the one board move this role owns on the way in.** Ready for Dev 1/6 → 0/6, In Development 0/3 → 1/3; **no limit approached, no override taken.** The Definition of Ready was re-checked AT the pull rather than assumed from the 2026-07-30 promotion or from the design hop, and `ADR-0005`'s `proposed` status was checked against `ABC-013`'s Blocked precedent rather than waved through — it does **not** block, because `ABC-011` itself assigns the design question to Architect/Design by name, so the ticket is the authority and the ADR is the record. **`ADR-0005` still wants a human's ratification as a standing item; no agent may mark it `accepted`.** **A P1 was pulled ahead of two P0s on a sequencing constraint the tickets state about each other, not on priority:** `ABC-011`'s escalation trigger and `ABC-012`'s own Dependencies section both say the key fix must land before the first consumer, or `ABC-012`'s repetition test is written to dodge the defect and stays permanently blind. One ticket pulled, not three. Previously the same day by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04): **ABC-011 moved `Ready` → `In Design` → `Ready for Dev` across one design hop, the reading of "an en-passant capture is available" that its own `### Open design question` assigns to this role being settled.** Ready 5/8 → 4/8, In Design 0/2 → 1/2 → 0/2, Ready for Dev 0/6 → 1/6; **no limit approached, no override taken, no written reason owed.** Second entry to and second exit from In Design in this project's history. **RULED: "available" means a LEGAL en-passant capture exists — the strict-FIDE reading**, on FIDE 9.2.3 as retrieved and retained by BA/PM under task `refinement-fide-9-6-1` ("the possible moves of all the pieces of both players are the same" / a pawn "could have been captured"), and on this ticket's own `## Scope`, which asks for the same key "**exactly** when FIDE calls them the same position". **The predicate is homed in `src/legal.ts` and `src/zobrist.ts` imports it** — the one file the ticket's `## Out of scope` design-hop escape hatch is exercised for. **Two premises of the ticket were measured rather than accepted, and both moved:** the strict reading does NOT cost `legalMoves`' ~5,300 ns (that is the price of the obvious implementation, which is rejected) — amortized over a 120,000-node pool at natural ep frequency it costs **1.014–1.022x** merged, **1.00–1.07x at `kiwipete`/startpos where the `NFR-005` bar is anchored**, worst case 1.45–1.48x on the 1.87% of nodes with an ep capture actually available (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere); and the DAG **stays acyclic and stays exactly as deep** (max depth 6) — only `zobrist`'s own level moves, 2 → 5, with `gameend` 5 → 6. **`legalMoves(...).some(...)` is disqualified twice over: 1.979x per node AND it inherits `ABC-009`, corrupting the position it hashes** (reproduced on `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` — a phantom white king on e1). Homing the predicate in `src/moves.ts` would create **this project's first dependency cycle** and is named on the ticket so nobody walks into it. The price is stated rather than buried: `zobristKey` stops being a pure read of the board. **`ADR-0002` is EXTENDED AROUND and NOT amended** — checked clause by clause against the ratified text, so **no human ruling is owed and none was taken**; the falsifier is recorded in one sentence. **`ADR-0005` was written and is `proposed`** — not on the amendment ground but because a recorded module-graph invariant becomes false; **no agent may mark it `accepted` and none did** (`ADR-0004`'s delegated ratification is explicitly not precedent and was not leaned on), and **ABC-011 is NOT blocked on it**. **Re-sized `S` → `M` and not split** — the ticket's own named re-size condition, fired verbatim; priority `P1` unchanged. **No production code was changed at this hop** and every measurement was driven read-only against merged `src/` from a scratchpad outside the repo. **In Development is deliberately NOT entered — that pull is the Orchestrator's.** Nothing was merged and nothing was deployed. Previously the same day by the Orchestrator (task `refinement-fide-9-6-1`, Workflow 07): **the one open question merged against ABC-020 — FIDE 9.6.1's "consecutive" wording — is CLOSED as CONFORMANT, so the second change to `src/gameend.ts` on `main` is NOT owed.** BA/PM ruled it against the Laws text it retrieved; the Orchestrator re-fetched independently before accepting and confirmed the word "consecutive" occurs **zero** times in the 2023 Laws — QE's remembered phrase was verbatim correct for the **2014** edition, which 2017 replaced. **No ticket cut, no column moved, no WIP limit approached, no override taken**, and the conditional Architect/Design hop is **cancelled rather than deferred**. See the Done comment below. Previously the same day: **ABC-020 MERGED to `main` and moved Ready for UAT → Done** — the `… → Done` exit this role owns. Three stacked branches landed in ONE fast-forward (d53ce31 → cb62c9f, 27 commits, no merge commit) because the chain was linear and nothing had diverged. Gate run BEFORE the merge on the tip and AGAIN AFTER it on main: **174/174 green, 0 skips**, lint + typecheck + build exit 0. **All nine branches in this repo are now contained in main** (`git branch --no-merged main` is empty); none was deleted, that being the owner's call — **superseded 2026-08-02: the owner made that call and all eight merged branches were deleted after per-branch validation, leaving `main` as the only branch; the tips are recorded in the Done comment and no commit was lost.** Ready for UAT 1/4 → 0/4. **The merge was performed by an agent on EXPLICIT human instruction and is NOT standing authorization** — same rule as ABC-001/002/003/008 and the ABC-004..007 stack. Merged with one open question against it: FIDE 9.6.1's "consecutive" wording (`UNKNOWN - verify`), which now costs a second change to `src/gameend.ts` on main rather than one on a branch. Previously 2026-08-01 by Security/NFR (task `ticket-to-pr-ABC-020`, Workflow 04 step 6): **ABC-020 PASSED the risk/NFR gate** and moved In Security/NFR → Ready for UAT. In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. The In Security/NFR exit is the one board move this role owns. Nothing was merged and nothing was deployed. **No production code was changed at this gate.** **All three of NFR-001's leaf-cheapness bars were re-measured independently — nothing was accepted from the Engineer's report:** `legalMoves` **exactly 1** across sixteen call shapes, `zobristKey` **≤ 1** (1 when the counts map is consulted, **0** bare and 0 when a cheaper branch decides), and `gameStatus(startpos, emptyMap)` **2.13–2.26 µs** = **0.56x–0.60x of the 3.78 µs bar**, 0.98x–1.01x of the pre-ABC-020 tree in the same process (Apple M3 / Node v24.12.0 / darwin-arm64; `UNKNOWN - verify` elsewhere). **One correction, and it is to the BAR, not the code: the 3.78 µs figure is a start-position number and the catalog did not say so** — kiwipete measures 5.3 µs on the merged tree as well, so read as an absolute ceiling the bar indicts the baseline. `plans/nfr-catalog.md` now carries the position; no target moved. **QE's ordering suspicion is CONFIRMED and it generalises — this is the substantive result of the gate.** Moving the 150-ply check below the fivefold check kills no test, exactly as QE said; it does **not** break the bar as written (≤ 1 still holds), it costs one 281–293 ns key read on a position reachable at most once per game, and it is a durability gap rather than a bar failure. But two further mutations show **all three bars were held by nothing in the repo**: a second `legalMoves()` call and two `zobristKey` reads instead of the shared local **each left all 45 tests green**, and the doubled generation doubles the cost of EPIC-004's hottest call with a green suite. **Closed: `src/gameend.nfr.test.ts`** — three spied assertions, one per bar, in its own file so the hoisted `vi.mock` factory re-routes the module graph for nothing else, which dissolves the Engineer's stated objection rather than overruling it. One mutant fails one assertion each. The five-occurrences-AND-clock-150 tie stays **deliberately unpinned** as QE intended — the zero-key assertion uses a one-occurrence map, so it kills the reorder purely on cost and says nothing about which automatic rule wins. **No security finding at any severity and nothing at or near `security.block_on: high`**: the ASVS L1 tier is not-applicable by absence of the surface it names, and the two rows worth naming rather than dismissing (input validation, hash choice) both point at ABC-010/ABC-009/ABC-011, all carried and ticketed. Gates re-run with the guard in place: **174 pass / 0 skipped**, lint, typecheck, build exit 0, `src/gameend.ts` still 100%. **UAT is recorded as DEFERRED to EPIC-006, not passed** — the ABC-004..007 precedent, for the same reason: this ticket renders nothing and prompts for nothing, so there is no surface a human can exercise. Previously 2026-08-01 by QE/E2E (Workflow 04 step 5): **ABC-020 PASSED review** and moved In Review → In Security/NFR. In Review 1/3 → 0/3, In Security/NFR 0/2 → 1/2; no limit approached, no override taken. The In Review exit is the one board move this role owns. Nothing was merged and nothing was deployed. **QE fixed no production code**; six tests were added, all green, skip count still 0, suite 165 → 171. The verdict was reached by independent re-derivation, not by re-running the author's suite: the G-1 line driven from its FEN and move list (Black makes the third occurrence, White holds the claim, `Re8#` still reachable, `{white-wins, checkmate}`), every clock and occurrence boundary swept in both directions and both colours, and **thirteen mutations run against the delivered suite** — the check the ABC-007 gate did not make. Nine were killed. **Four survived, every one an ordering above the clock, and the ticket asserts a guard for them that does not exist** (`## Out of scope` says "A6 pins it"; A6 pins checkmate against the CLOCK, a different pair). Each changes a reason and never a result, so product severity is LOW and gate severity is higher — QE closed all four with one added test. A9 was verified by name-set diff against `b1b96cd~1` plus a body diff, and holds exactly. **A5's epoch argument is ruled CORRECT**, with the arithmetic reproduced on both trees (117 / 167 / 150, and 150−133=17, 17+100=117); the wording that is wrong is QE's own G-3 sentence carried into A5's Given — the wall unfreezes after its first capture and resets the clock three times, so "within 150 plies" holds per irreversible-move epoch, which is what FIDE 9.6.2 bounds. A5's substance holds under all ten drives and is now pinned by two tests rather than by argument. ABC-009 and ABC-011 confirmed genuinely carried and confirmed load-bearing for no new test. Gates re-run by QE on this branch: 171 pass / 0 skipped / lint, typecheck, build all exit 0 / `src/gameend.ts` 100%. **A10's NFR bars were deliberately NOT re-measured** — Security/NFR owns them next. Three items could not be settled and are recorded as a `claim` with `confidence: UNKNOWN - verify`: FIDE 9.6.1's "consecutive" wording, `GameResult`'s dead-but-correctly-kept alias, and the reason chosen when two automatic rules coincide. Previously 2026-07-31 by the Software Engineer (task `ticket-to-pr-ABC-020`, Workflow 04): ABC-020 moved In Development → In Review, implemented on branch `grugops/ticket-to-pr-ABC-020`. In Development 1/3 → 0/3, In Review 0/3 → 1/3; no limit approached, no override taken. The diff is `src/gameend.ts` alone (+113/−66) plus its test file: the design hop's ratified two-arm union built exactly as written, `gameStatus`'s signature byte-identical, no new import, no new state on `Position`. A1–A10 green; **A9 held exactly — the four named tests whose expectations changed are the only tests whose names changed, the fifth gained the absence assertion the ticket asked for, and no sixth test moved.** A10 measured on Apple M3 / Node v24.12.0 / darwin-arm64 and spied rather than inferred: `legalMoves` 1 per call across ten call shapes, `zobristKey` ≤ 1 (0 when bare), cost 2.17–2.24 µs against a 3.78 µs bar; `UNKNOWN - verify` on other hardware. `ABC-009` and `ABC-011` carried not owned, the FIDE 5.2.2 gap declined as documentation only, the terminal-check order untouched. Human holds merge and deploy. Previously 2026-07-31 by Architect/Design: ABC-020 moved Ready → In Design → Ready for Dev across one design hop, the return-shape question its own `### Open design question` assigns being settled. Ready 6/8 → 5/8, In Design 0/2 → 1/2 → 0/2, Ready for Dev 0/6 → 1/6; no limit approached, no override taken. First entry to and first exit from In Design, and first occupant of Ready for Dev, in this project's history. The shape is a two-arm discriminated union on the `result` field GameStatus already has, with the claimable set optional and absent-when-empty on the in-progress arm; ADR-0002 clause 4 is ruled an EXTENSION and not an amendment, so no human ruling is owed, no ratified clause was touched and no ADR was written. In Development is deliberately NOT entered — that pull is the Orchestrator's. Previously 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`, task `epic-to-tickets-EPIC-002`). The project owner's standing priority of 2026-07-31 — "chess moves must be legal according to game rules, everything else comes after that" — re-sequenced this board. TWO TICKETS CUT: ABC-020 (FIDE 9.2/9.3 draws become claimable and FIDE 9.6 backstops land with them, M, P0, straight to Ready) and ABC-021 (the draw-claim interaction, S, P1, Backlog behind ABC-019). ONE PRIORITY CHANGED: ABC-009 P2 → P1, promoted Backlog → Ready. Everything else was re-read and DELIBERATELY LEFT — see the re-sequencing comment under Ready. Ready 4/8 → 6/8; no limit approached, no override taken. EPIC-002 is now 9 tickets / 25 points (was 8 / 23 — ABC-021 adds 2); ABC-020 sits under EPIC-001 with ABC-009 and ABC-011, so EPIC-001 now has three open tickets against merged, Done code. Previously 2026-07-31 by Architect/Design (ADR-0004 ratified — clauses 1 + 3 as proposed, clause 2 as amended; ABC-013 moved Blocked → Ready, Ready 3/8 → 4/8, no limit approached, no override taken. Blocked is now empty after one day, no escalation. The ratification was made by the Orchestrator under a named, quoted delegation from Olger Oeselg — the first ADR here not ratified by a human directly, and explicitly not precedent). Previously 2026-07-30 by BA/PM (EPIC-002 decomposed into ABC-012..ABC-019, 23 points; ABC-012 + ABC-014 promoted to Ready, ABC-013 to Blocked on ADR-0004's ratification, the rest held in Backlog behind their predecessors; ABC-011 escalated P2→P1 and promoted to Ready, its own trigger having fired. Ready 3/8, no limit approached, no override taken. Earlier the same day: ABC-011 cut to Backlog from the architecture audit `architecture-audit-2026-07-29`, on ADR-0002's recommendation. Previously 2026-07-29: ABC-009 + ABC-010 cut to Backlog from the same audit)_

<!--
  FORMAT — read before you move a ticket. (clear voice; this is a technical file, not a role prompt.)

  plans/board.md is grugops's SINGLE SOURCE OF WIP TRUTH. Every ticket sits in exactly one
  column. Each column has a definition (ENTRY MEANS), an EXIT OWNER (the role that signs off
  to move the ticket out), and a WIP limit (max tickets allowed in that column at once). The
  Orchestrator refuses to pull new work past a WIP limit without a written reason.

  WIP NUMBERS COME FROM CONFIG. The per-column limits shown in each heading are the lean
  DEFAULTS, sourced from `agent-factory/config/factory.config.json#wip_limits`. Edit the dial,
  not this file, to change a limit — then update the heading to match. The two must agree.
  In lean mode the In Security/NFR and Ready to Release columns may be skipped unless a
  trigger fires (the columns still exist; they just stay empty).

  HEADING FORMAT (spec §6.1): each column is an H2 heading carrying its live/limit WIP count,
  e.g. `## In Development (WIP 1/3)` — the left number is how many tickets are in the column
  now, the right number is the limit from config. Unlimited columns read `(WIP unlimited)`;
  Blocked is visible and time-tracked (no WIP limit) and reads `(visible, time-tracked)`.

  TICKET ROWS: this board ships EMPTY — column structure only, ZERO live ticket rows. It is a
  clean append target. Roles append a one-line ticket row under the matching column as work
  moves, e.g. (this is a comment, NOT a live row — the generic `ABC-` prefix shows format only):

    ## In Development (WIP 1/3)
    - [ABC-014] Asset allocation chart  (owner: Software Engineer, since: 2026-06-01)

    ## In Review (WIP 1/3)
    - [ABC-012] Portfolio FX conversion  (PR: #41, QE: running)

  BOARD <-> TICKET CONTRACT: each ticket file (`plans/tickets/<prefix>-xxx.md`) carries a
  status line in its front matter so the board column and the ticket never disagree (spec §6.1).
  The shape (example only, NOT a live ticket):

    status: in-development
    column: In Development
    size: M
    priority: P2
    epic: EPIC-003
    feature: FEAT-007

  A ticket's `column:` value MUST equal the board column it sits under, and `status:` is the
  kebab-case form of that column. The validator can check the two for drift.

  CADENCE: this board ships the Kanban columns (the default cadence, `cadence=kanban`). The
  scrum overlay (sprint goal / committed backlog / burndown) lives in `plans/sprints/SPRINT-xx.md`
  and is NOT pre-rendered here. The sizing, priority, and Blocked conventions below are shared
  by BOTH cadences.
-->

## Columns (spec §6.1)

The 13 columns in flow order, each with what entry means, who owns the exit, and the WIP
limit (default from `factory.config.json#wip_limits`):

| Column | Entry means | Exit owner | WIP (default) |
|--------|-------------|-----------|---------------|
| Backlog | idea captured | BA/PM | unlimited |
| Ready | Definition of Ready met | BA/PM | 8 |
| In Analysis | behavior being mapped | System Analyst | 2 |
| In Design | structure/ADR being decided | Architect/Design | 2 |
| Ready for Dev | handoffs complete, ticket sized | Orchestrator | 6 |
| In Development | code being written | Software Engineer | 3 (== max parallel tickets) |
| In Review | PR + QE running | QE/E2E | 3 |
| In Security/NFR | risk/compliance gate | Security/NFR | 2 |
| Ready for UAT | gates passed | UAT Planner | 4 |
| In UAT | business acceptance | UAT Planner | 4 |
| Ready to Release | UAT signed off | Release Manager | 4 |
| Done | merged + released (or merged, lean) | Orchestrator | unlimited |
| Blocked | waiting on a dependency/decision | (raiser) | visible, time-tracked |

WIP limits come from config (`wip_limits`); the numbers above are the lean defaults.

## Backlog (WIP unlimited)

- [EPIC-002] Terminal board and game loop  (owner: BA/PM, size: XL, priority: P0, since: 2026-07-22, decomposed: ABC-012..ABC-019 + ABC-021)
- [EPIC-003] Move input and controls  (owner: BA/PM, size: M, priority: P0, since: 2026-07-22)
- [EPIC-004] Engine and AI opponent  (owner: BA/PM, size: L, priority: P0, since: 2026-07-22)
- [EPIC-005] Opening book  (owner: BA/PM, size: S, priority: P1, since: 2026-07-22)
- [EPIC-006] Game session and packaging  (owner: BA/PM, size: M, priority: P2, since: 2026-07-22)
- [ABC-010] FEN semantic validation  (owner: BA/PM, size: M, priority: P1, epic: EPIC-003, since: 2026-07-29)
- [ABC-015] Glyph mode selection — precedence, signal set, --unicode override  (size: S, P1, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-016] Status panel  (size: M, P1, epic: EPIC-002, blocked-until: ABC-013, ABC-014, ABC-020)
- [ABC-017] Bounded move-history pane — two-column SAN  (size: S, P2, epic: EPIC-002, blocked-until: ABC-013, ABC-014)
- [ABC-018] Frame output and redraw  (size: S, P0, epic: EPIC-002, blocked-until: ABC-014)
- [ABC-019] Turn loop skeleton  (size: L, P0, epic: EPIC-002, blocked-until: ABC-012, ABC-014, ABC-018; merge-order: after ABC-020)
- [ABC-021] Draw-claim interaction — the player having the move claims  (size: S, P1, epic: EPIC-002, blocked-until: ABC-020, ABC-019, since: 2026-07-31)

<!--
  AMENDED 2026-07-31: a NINTH EPIC-002 ticket, ABC-021 (draw-claim interaction, S, 2 points), was cut
  under the owner's legality-first directive, taking this epic to 9 tickets / 25 points. The largest
  is still L, so there is still no SPLIT_REQUIRED and the epic's XL size is unchanged. ABC-020 was
  cut in the same step but belongs to EPIC-001, not here — it changes src/gameend.ts, which is the
  rules core. See the re-sequencing comment under Ready.

  EPIC-002 DECOMPOSED 2026-07-30 by BA/PM (task `epic-to-tickets-EPIC-002`, Workflow 03) into
  ABC-012..ABC-019 — 8 tickets, 23 points. Epic size corrected M -> XL in-file with the reason,
  exactly as EPIC-001 recorded its own L -> XL correction; the no-XL rule binds TICKETS, and the
  largest here is L, so there is NO SPLIT_REQUIRED. The epic ROW STAYS IN BACKLOG carrying a
  `decomposed:` annotation — that is precisely what EPIC-001 did on 2026-07-22, and it left Backlog
  only on 2026-07-24 when all seven of its tickets were merged. An epic row is a container; it exits
  Backlog for Done when its tickets are Done. The Backlog exit BA/PM actually owns and has taken
  today is the TICKET-level one: Backlog -> Ready for ABC-012, ABC-014 and ABC-011.

  ABC-015..ABC-019 meet the Definition of Ready in full. They are held in Backlog because each has
  an unbuilt PREDECESSOR TICKET, not because anything about them is unresolved — they are NOT
  Blocked-column blocked, and BA/PM promotes each as its `blocked-until` list clears. Same pattern
  ABC-004..007 used.

  Two of this epic's four acceptance criteria were AMENDED before these tickets were cut, because
  wave 1 established they could not be met as written and an untestable criterion fails the
  Definition of Ready for every ticket beneath it. Both amendments are recorded in place in
  plans/epics/EPIC-002-terminal-board-and-game-loop.md with what changed and whether a promise was
  reduced (it was, twice, and both are marked REDUCED rather than softened quietly).
-->
<!--
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
-->

## Ready (WIP 4/8)

- [ABC-009] legalMoves mutates the position it documents as unchanged  (size: S, P1, epic: EPIC-001, deps: none; escalated P2→P1 and promoted 2026-07-31)
- [ABC-012] Game history module — the move list is the authoritative state  (size: M, P0, epic: EPIC-002, deps: none)
- [ABC-013] SAN rendering — src/san.ts with toSan only  (size: M, P1, epic: EPIC-002, deps: ABC-003 + ABC-005, both merged on main; unblocked 2026-07-31 when ADR-0004 was ratified)
- [ABC-014] Board frame renderer — grid, labels, shading, orientation, both glyph modes  (size: M, P0, epic: EPIC-002, deps: none)

<!--
  RE-SEQUENCED 2026-07-31 by BA/PM (subtask `ba-pm-legality-resequence`) against the project owner's
  standing priority, quoted verbatim from Olger Oeselg on 2026-07-31:

    "The most important thing is that chess moves are legal according to game rules, everything else
     comes after that. Game has to be played according to it's rules."

  This is a priority directive, not a feature request, and it outranks the sequencing set on
  2026-07-30. The input is QE's four notes of 2026-07-31 under task `epic-to-tickets-EPIC-002`
  (ranked gaps G-1..G-6, six refutations, the test artifact-ref, and five unsettled items).

  WHAT MOVED — three things, and only three.

  1. ABC-020 CUT and promoted straight to Ready (M, P0, EPIC-001). QE's G-1: the code applies FIDE
     9.2 (threefold) and 9.3 (fifty-move) automatically where the Laws make both a claim by the
     player HAVING THE MOVE. Reproduced with a FEN — 6k1/5ppp/8/b7/8/8/5PPP/4R1K1 — where this code
     declares 1/2-1/2 and FIDE says White mates with Re8. The deviation runs systematically against
     the human, because the engine is the side that repeats when it is losing. It REVERSES rulings
     made twice (ABC-007 and ABC-019 `## Out of scope`, the latter reading "Settled ... not open");
     both predate the directive and both `## Out of scope` blocks were amended in place the same day,
     so no two documents disagree. THE FIDE 9.6 BACKSTOPS (fivefold, 75-move) ARE IN THE SAME TICKET
     AND MUST NOT BE SPLIT OUT: the automatic fifty-move rule is currently the only thing that ends
     a locked position — QE drove one for 117 plies to prove it — so claims without 9.6 ship a game
     that never terminates. Acceptance A5 is the criterion that fails if anyone separates them.
  2. ABC-021 CUT (S, P1, EPIC-002, Backlog behind ABC-020 + ABC-019). The claim interaction: the
     human claims by command, the engine does NOT claim (it has no evaluation until EPIC-004, and
     "always claim" is strictly worse chess), no offer prompt (it would break epic acceptance 4a's
     constant row count), and the status panel states availability attributed to the side to move.
  3. ABC-009 ESCALATED P2 -> P1 and promoted Backlog -> Ready. `legalMoves` offers a FLAG_CASTLE move
     that is not a legal chess move and corrupts the board taking it back — the query that DEFINES
     legality returning an illegal move is exactly the class the directive names. Note carefully:
     the ticket's OWN escalation trigger has NOT fired and is recorded as unspent. This is a
     directive escalation. Not P0 — it still needs a semantically-invalid position, and no path in
     the product produces one today.

  WHAT WAS RE-READ AND DELIBERATELY NOT MOVED. A re-prioritisation that moves everything is a reflex,
  not a judgment, so each of these carries its reason:

  - ABC-010 (M, P1) stays P1. Already ranked as a legality defect on 2026-07-29 and its reachability
    is unchanged by the directive — it goes live when EPIC-003 accepts a user FEN, which is still
    unbuilt. Raising it to P0 would put an EPIC-003 ticket ahead of the tickets that make the game
    exist at all.
  - ABC-011 (S, P1) stays P1. ABC-020 gives it a second and now AUTOMATIC consumer (fivefold, FIDE
    9.6.1). That does not raise it, because a repetition loop can contain no capture and no pawn
    move, so the clock climbs and the CLOCK-BASED 75-move backstop terminates every game regardless
    of what the key does. Under-detection costs a late draw, never a hung game.
  - ABC-012 (M, P0), ABC-014 (M, P0), ABC-018 (S, P0), ABC-019 (L, P0) all stay P0. The directive
    re-ranks CORRECTNESS AGAINST FEATURES, not feature against feature. These four are not renderer
    polish — they are whether the product exists. Demoting them would model the directive as "stop
    building the game", which it does not say. What the directive DOES set is the pull order INSIDE
    P0: ABC-020 first.
  - ABC-013 (M, P1) stays P1. Renderer work, already below every P0.
  - ABC-015 (S, P1) stays P1. Its priority is a SEQUENCING constraint — RISK-005 requires it to merge
    with or before ABC-014 — not a claim about user value. Lowering it would rank it behind the
    ticket it must precede.
  - ABC-016 (M, P1) stays P1. The directive argues both ways and they cancel: its new item 7 is a
    rules affordance (without it no player learns a claim exists), items 1-6 are renderer work.
  - ABC-017 (S, P2) stays P2. Already the drop-first tier; P3 is "someday" and this is in the epic's
    scope line.
  - Every EPIC priority is unchanged (EPIC-002/003/004 P0, EPIC-005 P1, EPIC-006 P2). The directive
    lands on tickets, and the two epics that own rule conformance are already P0.

  WIP AND THE LIMIT. Ready 4/8 -> 6/8 against a configured limit of 8 (`.grugops/factory.config.json`
  `wip_limits.Ready`). NO LIMIT APPROACHED AND NO OVERRIDE TAKEN; no written reason is owed. Both
  promotions qualify on this board's own Ready test rather than on their priority — ABC-020 and
  ABC-009 each have NO unbuilt dependency, standing on merged src/ alone, which is the exact
  criterion that keeps ABC-015..ABC-019 and ABC-021 in Backlog. Six is still under the ceiling and
  Ready remains a buffer feeding In Development (WIP 3), not a target.

  SUGGESTED PULL ORDER (guidance; the pull is the Orchestrator's). ABC-020 first — P0 correctness,
  and it is a merge-order dependency for ABC-019 and ABC-016, whose acceptance criteria were amended
  today to match it. Then ABC-012 and ABC-014, the P0 tickets the product's existence rests on. Then
  ABC-009 and ABC-011, the P1 rules-core defects. Then ABC-013, the P1 renderer ticket. Within a
  single priority the directive ranks rules-core work ahead of renderer work; that ordering is stated
  here rather than encoded by inflating the P0-P3 scheme.

  As written 2026-07-31 by Architect/Design, before this re-sequencing:
  ABC-013 joined Ready 2026-07-31, moved out of Blocked by Architect/Design when ADR-0004 was
  ratified. Ready 3/8 -> 4/8, well under the limit; no override needed and none taken. Ready is the
  right column and not a conservative Backlog hold: ABC-013's only remaining dependencies are
  ABC-003 and ABC-005, both merged on main, so it has NO unbuilt predecessor — the one thing that
  keeps ABC-015..ABC-019 in Backlog. It does not depend on ABC-012 or ABC-014, and the two tickets
  that depend on IT (ABC-016, ABC-017) stay in Backlog behind it, unchanged.

  Read ADR-0004's Status section before citing this move: that ADR was ratified by the ORCHESTRATOR
  under a named, quoted delegation from Olger Oeselg dated 2026-07-31 — NOT by a human directly. It
  is the first ADR in this project ratified that way and it is explicitly NOT precedent; the standing
  rule that no agent may mark an ADR accepted is unchanged for every other ADR. The sentence in the
  Blocked comment below that reads "this is the same ruling on the same kind of artifact" was written
  on 2026-07-30 and is CORRECTED by this paragraph: it was the same kind of artifact, and it was not
  the same kind of ruling.

  As written 2026-07-30, before that ruling: Ready holds 3 of a permitted 8, and 3 is the honest
  number rather than a conservative one:
  ABC-012 and ABC-014 are the ONLY two EPIC-002 tickets with no unbuilt dependency at all — both
  stand on merged src/ alone. ABC-013 would have been the third and is in Blocked instead, on a
  decision only a human can make. The limit is a ceiling, not a target; Ready is a buffer feeding
  In Development (WIP 3), and flooding it would move the queue rather than shorten it. Same
  reasoning recorded when EPIC-001 put 3 of its 7 into Ready.

  ABC-011 joins them because its OWN escalation trigger fired: it rises to P1 and must be Ready
  "before whichever consumer of the key list lands first", and ABC-012 is that consumer. Both are
  in Ready together; the pull order is the Orchestrator's. ABC-011's size is unchanged at S.

  Emptied 2026-07-23: ABC-003 was pulled into In Development for ticket-to-pr. Its deps
  (ABC-001, ABC-002) are satisfied on main, so it was pulled straight from Ready — no
  analysis or design hop was needed (it arrived meeting the Definition of Ready in full).
-->


## In Analysis (WIP 0/2)

## In Design (WIP 0/2)

<!--
  EXITED 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask
  `architect-abc011-defect-definition-and-ratify`, Workflow 04). ABC-011 moved In Design ->
  Ready for Dev. In Design 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. NO LIMIT APPROACHED, no override
  needed and none taken, no written reason owed. In Design is empty again in the same session, so no
  design-hop WIP was left standing. The SECOND exit from In Design for one ticket and the third in
  this project's history.

  NO PRODUCTION CODE WAS CHANGED AT THIS HOP, and no acceptance criterion, reproduction FEN,
  NFR-005 bar or `## Out of scope` line was re-opened or edited. The first `### ANSWERED` block
  stands unamended; a second, DATED one was added beside it rather than over it.

  ALL THREE THINGS OWED ARE SETTLED.

  1. THE DEFINITION QUESTION -- RULED: purity is UNCONDITIONAL, the answer is DOMAIN-RESTRICTED, and
     the first is bought with a PRECONDITION rather than with a change to what the predicate means.
     `hasLegalEnPassant` synthesises its probe Move instead of taking one from the generator, and
     `undoSpecial` (apply.ts:106-110) writes `move.captured` back unconditionally -- so when the
     board never held that piece the "restore" is a creation, and permanent. Two conditions make the
     probe well-formed and both must be checked BEFORE makeMove: (a) the ep target is empty, (b) the
     square behind it holds exactly the enemy pawn the probe claims to take. Rule 5 gains NO domain
     qualifier: a query that damages its argument is broken whatever the argument means.

     THE PART THAT COULD NOT BE DELEGATED -- THEY ARE TWO GUARDS, NOT ONE, and Security/NFR's
     one-line sketch ("guarding on board[target] === EMPTY") is neither sufficient nor the one that
     fixes the corruption. (b) is the PURITY guard: it closes all three of QE's reproductions AND a
     FOURTH nobody had, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (ep square on the wrong rank for the side
     to move -> phantom BLACK pawn on a2), which (a) does NOT catch because a3 is empty. (a) is the
     ANSWER guard and purity does not need it: on `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its
     mirror the captured pawn IS present, make/unmake round-trips BYTE-EXACTLY, and the shipped
     predicate still answers true where the oracle answers false -- A PURE DIVERGENCE, constructed
     at this hop, which no prior hop had. "Corrupts" and "disagrees with the oracle" are two
     different failures that QE's three FENs conflate.

     THE ORACLE IS NOT THE AUTHORITY OFF-DOMAIN, AND THAT IS FORCED RATHER THAN CONVENIENT.
     `legalMoves(...).some(...)` stays the DEFINITION and the test oracle on positions whose ep
     square the board does not contradict -- a domain containing everything makeMove can produce,
     hence everything reachable by play. Outside it the generator is UNSOUND, measured not conceded:
     it corrupts identically on two of QE's three FENs, and on
     `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` it offers a pawn CAPTURING ONTO THE MOVER'S OWN KNIGHT.
     Tracking it there would import a generator defect into the hash, so the predicate is SPECIFIED
     off-domain instead: it returns false and touches nothing.

  2. THE CASTLING FOLLOW-ON -- RULED: CASTLING IS **NOT** THE SAME CASE. zobristKey keeps hashing
     castling RIGHTS and must not be changed to hash availability. Answered from the retained FIDE
     text, whose sha256 AND CURRENCY were both RE-VERIFIED today rather than inherited: a fresh
     fetch is byte-identical to the retained copy (e0c8bee2...), and FIDE's own handbook index still
     publishes exactly E012014/E012017/E012018/E012023 with nothing after 2023 (E012024/25/26 return
     the same soft-404 shell as a nonsense chapter id -- control run). Manifest retained at
     .grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt. Three reasons,
     ascending: (i) 9.2.3.1 is written in the CAPABILITY mood ("could have been captured") and
     9.2.3.2 in the ENTITLEMENT mood ("had castling rights", "forfeited these"), and 9.2.3.2 carries
     a sentence with no counterpart in 9.2.3.1 -- "The castling rights are lost ONLY after the king
     or rook is moved" -- whose "only" excludes transient blockers; present in all four editions,
     2014-2023. (ii) THE DETERMINACY ARGUMENT, verified against this codebase: addCastlingMoves
     (moves.ts:299-319) reads exactly `castling`, `board` and the side to move, so two positions with
     the same placement and side to move can differ in castling legality ONLY if their rights differ
     -- precisely what was NOT true of en passant, where the ep square is an extra bit not determined
     by placement. Same Laws sentence, opposite consequence. (iii) The residual over-discrimination is
     real and REPRODUCED (four pairs: startpos, knight on g1, king in check, f1 attacked -- identical
     legal-move sets, different keys) and it is the SAFE direction: a draw missed, never one invented.
     "Fixing" it would put isSquareAttackedBy on a component carried by 71.0% of nodes vs the 15.70%
     carrying an ep square. Also checked exhaustively: 368,344 nodes carry a right and ZERO are stale.

  3. ADR-0005 IS RATIFIED -- `accepted`, WITH AN AMENDMENT, and NOT as a rubber stamp. One of its
     statements was FALSE as written: its Consequences described a predicate that "plays a move and
     takes it back", which the shipped code does not do on that class. Clauses 1-5 accepted unchanged
     on evidence three gates established and this hop re-derived; DECISION CLAUSE 6 IS NEW (the
     precondition) and is decided-but-not-yet-built, the ADR-0002-clause-2 precedent; a scope bound
     was added because the ADR was read wider than it is. ADR-0006 IS NEW AND `accepted` -- the
     castling ruling, SEPARATE rather than a sixth clause, because it is a different decision from a
     differently-worded clause landing the opposite way, and because ADR-0005 was ratified in the same
     session on gated evidence while this ruling has been through no gate. Both ADRs now carry
     PER-CLAUSE FALSIFIER TABLES, each checkable without trusting the file. The honest
     counter-argument against ADR-0006 existing at all (it changes no code; BA/PM's 9.6.1 ruling set
     the precedent that those get a note, not an ADR) is recorded in its own Status section.

  RE-DERIVED, NOT INHERITED. Exhaustive walk of src/perft.test.ts's table at its own fast depths on a
  FOURTH independently written script: 518,474 nodes / 81,397 with an ep square -- reproducing the
  design, dev and QE hops TO THE NUMBER. Neither guard fires ONCE on that population, the predicate's
  answer changes on 0 nodes and the key changes on 0, so they are preconditions and not a behaviour
  change. The guarded shape run against the repository's own suite in a sandbox: 193/193 green, 0
  skipped, tsc exit 0, NO EXISTING TEST EDITED -- including zobrist.nfr.test.ts's call-count and
  byte-identity assertions. The six specified tests were each PROVEN TO FAIL rather than assumed to:
  10 of 14 assertions fail against shipped, exactly 2 against guard-(a)-removed, exactly 6 against
  guard-(b)-removed. One boundary probe kills nothing and is NAMED so rather than counted as coverage.

  COST, asked because this sits in a function EPIC-004 calls per node: ZERO on the no-ep path and at
  both NFR-005 anchors (structurally -- the caller's short-circuit never enters the predicate);
  +0.9 to +3.0 ns per call on the 15.70% of nodes with an ep square, i.e. <= +0.5 ns amortized per
  node, under 0.15% of a ~317 ns key; and 20-27x CHEAPER on the invalid class. Two whole-key runs
  bracket 1.0 from both sides, so the delta is below that instrument's resolution and no number is
  claimed from it. NO NFR-005 bar and NO catalog target moves; Security/NFR re-gates and owns the
  verdict.

  SIZE STAYS M and no re-size is owed -- two conditions in the one function ABC-011 already changes,
  six test cases, two doc corrections, all smaller than the delta that took it S -> M. ONE ITEM IS
  ROUTED TO BA/PM RATHER THAN CUT HERE: generateMoves offers an ep capture onto a square occupied by
  the MOVER'S OWN piece (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` and `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6
  0 1`, both verified) -- a generator defect on the invalid-FEN class, a sibling of ABC-009. This fix
  makes the HASH immune to it; it does not clean the generator.

  Full reasoning, every re-derivation and the six things that could NOT be settled:
  .grugops/context/ticket-to-pr-ABC-011/notes/ -- the architect-design decision, observation, claim
  and artifact-ref notes of 2026-08-03.

  IN DEVELOPMENT IS DELIBERATELY NOT ENTERED -- that pull is the Orchestrator's. Nothing was merged
  and nothing was deployed; a human holds both.

  ---
  RE-ENTERED 2026-08-03 by the Orchestrator, from Ready for UAT. See the Ready for UAT comment for
  why a gates-passed ticket moved backward and why the fix is In Design rather than In Development.
  In Design 0/2 -> 1/2; no limit approached, no override taken. Second design hop on one ticket --
  the first in this project's history, and worth a line in plans/metrics.md at the next sweep.

  THREE THINGS ARE OWED HERE, and the third is new authority rather than a new question:

  1. THE DEFINITION QUESTION UNDER THE MEDIUM DEFECT. QE reproduced the shipped predicate and the
     ruled oracle disagreeing on `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` and explicitly declined to call
     it -- "needs an Architect ruling not a dev fix". Rule 5 of the first hop's `### ANSWERED` block
     (byte-identical on return) is the contract the fix must satisfy.

  2. THE OWNER'S TECHNICAL RULING, quoted verbatim 2026-08-03: "any legal move, even the special ones
     still need to be checked." That ENDORSES the strict-FIDE reading -- a special move is still a
     move -- and raises the follow-on this hop must answer rather than assume: IS CASTLING THE SAME
     CASE? `zobristKey` hashes castling RIGHTS. FIDE 9.2.3.1 (en passant, "could have been captured")
     and 9.2.3.2 (castling, rights "forfeited") are worded differently, so the answer is not
     automatic in either direction, and the retrieved Laws text is already in this repo's shared
     context under task `refinement-fide-9-6-1`. Answer it from that text, not from memory -- the
     9.6.1 episode is what that rule was learned from.

  3. ADR-0005 RATIFICATION IS NOW THIS ROLE'S. The owner retired the standing "no agent may mark an
     ADR accepted" rule on 2026-08-03 and delegated decisions to the role that can verify them, naming
     architecture questions and the Architect specifically. ADR-0004 stops being the recorded
     exception and becomes the ordinary case. The full directive, its reading and its stated limits
     are in memory-bank/60-progress.md under "Standing directive -- who decides". Ratifying carries
     owning: an ADR accepted under this delegation records what would falsify it.
-->


<!--
  ENTERED AND EXITED 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04).
  ABC-011 is the SECOND ticket this project has put in In Design, and it was pulled here for the same
  written reason ABC-020 was: `### Open design question — hand to Architect/Design at the design hop,
  do not decide in dev`. No engineer starts until the reading is settled, because an engineer who
  guesses it writes code against a contract that can be rejected.

  Ready 5/8 -> 4/8, In Design 0/2 -> 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. Every column under its
  limit; NO LIMIT APPROACHED, no override needed and none taken, no written reason owed. In Design is
  empty again in the same session, so no design-hop WIP was left standing.

  WHAT WAS SETTLED. The acceptance criteria, both reproduction FENs, the NFR-005 bar and `## Out of
  scope` were NOT re-opened and none was edited.

  1. THE READING: "an en-passant capture is available to the side to move" means a LEGAL one exists --
     the strict-FIDE reading, not the board-only one. FIDE 9.2.3 makes sameness turn on whether "the
     possible moves ... are the same" and 9.2.3.1 on whether a pawn "could have been captured"; a
     capture that leaves your own king in check is neither. That text is not this role's reading of
     the Laws -- it is the text BA/PM retrieved and retained under task `refinement-fide-9-6-1`, and it
     was checked against rather than re-derived.
  2. WHERE IT LIVES, which is the half an engineer could not have guessed: a new exported predicate in
     src/legal.ts -- the module that already owns "is this legal" -- and src/zobrist.ts imports it.
     NOT `legalMoves(...).some(...)`, NOT re-implemented inside zobrist.ts, and NOT in moves.ts.
     src/legal.ts is the ONE file `## Out of scope`'s design-hop escape hatch is exercised for.
  3. THE MEASUREMENTS, because two of this ticket's premises were assumptions. The strict reading does
     NOT cost legalMoves' ~5,300 ns -- that is only the price of the obvious implementation, which is
     rejected. Driven read-only against merged src/ from a scratchpad outside the repo, interleaved,
     Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere): amortized over a
     120,000-node pool at natural ep frequency the ruled shape costs 1.014-1.022x merged (board-only
     0.996-1.004x, via legalMoves 1.979x); at kiwipete and startpos -- the two positions NFR-005's bar
     is anchored on, BOTH of which carry no ep square -- 1.00-1.07x; worst case 1.45-1.48x on the
     1.87% of nodes where an ep capture is actually available. ADR-0002 clause 3 has EPIC-004's
     transposition table computing a key per node, so the amortized row is the row that binds: the
     ruling costs 1.4-2.2% per node.
  4. THE legalMoves SHAPE IS DISQUALIFIED ON A SECOND, NON-COST GROUND, and it is reproduced rather
     than argued: on `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` it inherits ABC-009 and CORRUPTS THE POSITION
     IT IS HASHING -- a phantom white king appears on e1. merged zobristKey, the board-only variant and
     the ruled predicate all leave that position byte-identical.
  5. THE DAG STAYS CLEAN, and the ticket's framing is corrected in one respect. Rebuilt from src/*.ts
     rather than read off the audit: today acyclic, max depth 6, zobrist at level 2. Under the ruling
     it is STILL ACYCLIC and STILL EXACTLY AS DEEP (max depth 6); what moves is zobrist's own level,
     2 -> 5, and gameend follows, 5 -> 6. Homing the predicate in moves.ts instead would have created
     THIS PROJECT'S FIRST CYCLE (apply -> moves -> apply), which is why that trap is named on the
     ticket. memory-bank/30-architecture.md's layering line becomes false and is owed an edit when the
     change lands -- recorded on the ticket so it is not dropped.
  6. THE PRICE, stated rather than buried: zobristKey stops being a pure read of the board. It joins
     legalMoves / gameStatus / perft under the "transient mutation behind pure-looking queries"
     pattern, on ~2% of nodes. What that forecloses -- hashing a Position you may not write to, and
     hashing one from two threads at once -- is in ADR-0005's Consequences.
  7. ADR-0002 EXTENDS AROUND, it is NOT amended -- checked clause by clause against the ratified text,
     so NO human ruling is owed and none was taken. Clause 3's 9-23 ns/node is the repetition scan ON
     TOP OF the key and does not move; the ~300 ns key cost is a Context-table figure, not a clause
     proposition. The falsifier that would overturn that reading is one sentence long and is recorded
     on the ticket and in the note.
  8. ADR-0005 WAS WRITTEN AND IT IS `proposed`. NOT on the amendment ground -- on the ground that a
     recorded module-graph invariant becomes false and a ticket is not where a maintainer looks for
     the module graph. NO AGENT MAY MARK IT `accepted` AND NONE DID; ADR-0004's delegated ratification
     is explicitly not precedent and was not leaned on. ABC-011 is NOT blocked on it, because the
     authority for the ruling is the ticket's own delegation of the question to this role by name.
  9. RE-SIZED S -> M AND NOT SPLIT -- the ticket's own named re-size condition for this branch of the
     decision, fired verbatim. Priority P1 unchanged.

  Full reasoning, rejected options, every measurement and the five items that could NOT be settled:
  .grugops/context/ticket-to-pr-ABC-011/notes/ -- the architect-design decision, observation and
  claim notes of 2026-08-02.

  ---
  ENTERED AND EXITED 2026-07-31 by Architect/Design (task `ticket-to-pr-ABC-020`, Workflow 04).
  ABC-020 is the FIRST ticket this project has put in In Design, and it was pulled here because the
  ticket itself says so: `### Open design question — hand to Architect/Design at the design hop, do
  not decide in dev`. No engineer starts until the return shape is settled, because an engineer who
  guesses the shape writes code against a contract that gets rejected.

  Ready 6/8 -> 5/8, In Design 0/2 -> 1/2 -> 0/2, Ready for Dev 0/6 -> 1/6. Every column under its
  limit; no override needed and none taken. In Design is empty again in the same session, so no
  design-hop WIP was left standing.

  WHAT WAS SETTLED (the design hop is NOT a re-opening of the ticket — acceptance A1-A10 are written
  on observable behaviour and none was edited):

  1. THE SHAPE. GameStatus becomes a two-arm discriminated union on the `result` field it ALREADY
     has, with `claimable?: DrawClaims` present only on the in-progress arm and ABSENT — not null,
     not [] — when nothing is claimable. `DrawClaims.by` is REQUIRED, so an unattributed claim is
     unrepresentable, which is what acceptance A7 is protecting. `EndReason` gains fivefold-repetition
     and seventy-five-move and loses threefold-repetition and fifty-move, which become the whole of a
     new, disjoint `ClaimableDraw`. State (b) reported as `result: "draw"` is now a COMPILE error
     rather than a test failure. The signature `gameStatus(position, positionCounts?)` is
     byte-identical to the merged one.
  2. ADR-0002 CLAUSE 4 EXTENDS AROUND — it is NOT amended, so no human ruling is owed and none was
     taken, and no ADR was written. Both of the clause's propositions have `positionCounts` as their
     subject and both are untouched. The falsifier that would overturn that reading is recorded in
     the note, one sentence long. Note which option the clause actually discriminates against: the
     SECOND EXPORTED QUERY, which is rejected here on four other grounds as well.
  3. A9 IS A SHAPE CONSTRAINT, contrary to the ticket's "resolves identically under all three
     options". 18 whole-object toEqual assertions sit outside A9's named five, and measured on this
     repo's vitest an extra property survives toEqual only when absent. The criterion is CORRECT as
     written and was NOT edited — it is what selected the shape, and the correction is recorded
     beside it.

  Full reasoning, rejected options and constraint check:
  .grugops/context/ticket-to-pr-ABC-020/notes/20260731T181000Z-architect-design-decision-f95614ca.md
-->

## Ready for Dev (WIP 0/6)

<!--
  EMPTIED 2026-08-03 by the Orchestrator, for the SECOND time on this ticket: ABC-011 pulled
  Ready for Dev -> In Development. Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3. Both under
  limit; no override needed and none taken.

  DEFINITION OF READY RE-CHECKED AT THIS PULL TOO, not carried over from the first one. What changed
  since: the fix contract is a SECOND dated `### ANSWERED 2026-08-03` block (the first was not
  overwritten, so both rulings are readable), the acceptance it must satisfy is rule 5 of the first
  block plus the domain restriction this hop specified, and the two guards are named individually
  with the reproduction each one closes. Size stays M -- the Architect re-checked rather than
  absorbed. No blocker: ADR-0005 is `accepted` (with an amendment) and ADR-0006 is `accepted`, both
  ruled under the owner's 2026-08-03 delegation, so nothing here waits on a ratification.

  TWO GUARDS, NOT ONE, AND THE BOARD RECORDS WHY BECAUSE IT IS THE EASY THING TO GET WRONG. The
  captured-pawn guard buys PURITY and closes a fourth reproduction no prior role had
  (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, which the empty-target guard does NOT catch, a3 being empty).
  The empty-target guard buys ORACLE AGREEMENT and is needed only for two divergences where the
  predicate is already byte-pure. Security/NFR's one-line sketch was neither sufficient nor the guard
  that fixes the corruption -- named here so nobody simplifies it back.

  NOT A REGRESSION IN THE GATES. All three passed this ticket on 2026-08-02/03 and the defect was
  named in the open by QE and severity-ruled by Security/NFR as an accepted risk. The owner declined
  the risk, which is the owner's to decline. The gate chain then found MORE on the second pass than
  it did on the first, which is the argument for re-gating rather than merging the fix on trust.
-->

<!--
  ENTERED 2026-08-03 by Architect/Design at the SECOND design hop (task `ticket-to-pr-ABC-011`).
  Ready for Dev 0/6 -> 1/6; no limit approached, no override taken.

  WHAT THE ENGINEER PICKS UP IS A DELTA, NOT A FRESH TICKET. Five commits of ABC-011 are already on
  this branch and have passed all three gates; what is owed now is the fix contract in the
  `### ANSWERED 2026-08-03` block -- two guard conditions in `hasLegalEnPassant`, six test cases
  across `src/legal.test.ts` and `src/zobrist.test.ts`, and two doc-comment corrections. THE ONLY
  PRODUCTION FILE THAT CHANGES IS src/legal.ts. Everything the first `### ANSWERED` block ratified
  stays exactly as built.

  THREE THINGS THE ENGINEER SHOULD NOT HAVE TO REDISCOVER, all measured at the design hop:

  - The exact guard placement: both conditions are loop-invariant and belong ABOVE the
    EP_CAPTURE_SIDES loop, and `rank` is already the capture square (`enPassantCaptureSquare` in
    apply.ts:78 computes the same value), so the second guard costs one read of a square the
    function already addresses.
  - The six probe FENs and which mutant each kills, in the ticket's own table. FOUR of them kill the
    captured-pawn guard; only TWO kill the empty-target guard, and those two are pure -- their
    zobristKey twins pass either way. A seventh boundary FEN is named as killing NOTHING; do not
    count it as coverage.
  - Cost: zero on the no-ep path (structurally), <= +0.5 ns amortized per node, 20-27x cheaper on the
    class being fixed. No NFR-005 bar moves and Security/NFR re-gates.

  DEFINITION OF READY re-checked at this exit rather than assumed from the 2026-08-02 pass: problem,
  scope/out-of-scope (unchanged), INVEST, acceptance measurable (six FENs, both properties asserted
  at predicate AND key level, each assertion proven to fail), dependencies (none blocking; ADR-0005
  and ADR-0006 are both `accepted` and neither gates this), NFR triggers with numbers, test notes,
  size M, priority P1, no blocker.

  ---
  EMPTIED 2026-08-02 by the Orchestrator: ABC-011 pulled Ready for Dev -> In Development, the one
  board move this role owns on the way in. Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3.
  Both under limit; no override needed and none taken.

  DEFINITION OF READY RE-CHECKED AT THE PULL, not assumed from the 2026-07-30 promotion or from the
  design hop -- the ABC-020 precedent. Problem, scope/out-of-scope, INVEST (independent; merged
  src/ only), acceptance measurable (two exact FEN pairs with their exact bigint keys, EQUALITY and
  INEQUALITY both asserted, a property test over the existing perft position table, a numeric ns
  bar), dependencies (none blocking), NFR triggers with numbers (NFR-005: within 1.5x of 288-306 ns,
  and the no-ep path not slower AT ALL), test notes naming two non-interchangeable test shapes and
  three traps, size M, priority P1, no blocker. The one open item at cut time -- the availability
  reading -- was closed by the design hop, so this pull is clean rather than conditional.

  ADR-0005 IS `proposed` AND THAT WAS CHECKED RATHER THAN ACCEPTED. An unratified ADR held ABC-013
  in Blocked on 2026-07-30, so the question is live: does this one block ABC-011? It does not, and
  the distinction is real rather than convenient. ADR-0004 declared ITSELF blocking ("the merge of
  the first line of src/san.ts") and decided ABC-013's CONTENT -- the ticket had no answer without
  it. ADR-0005 is the RECORD of a ruling ABC-011 itself assigns to Architect/Design BY NAME
  ("hand to Architect/Design at the design hop, do not decide in dev"), so the ticket is the
  authority and the ADR files it where a maintainer will look; its stated rollback is one condition,
  one import and one predicate. It still wants a human's ratification -- NO AGENT MAY MARK IT
  `accepted`, and ADR-0004's delegated ratification is explicitly not precedent -- but that is a
  standing item, not a gate on this ticket.

  WHY THIS TICKET AHEAD OF THE TWO P0s. ABC-012 and ABC-014 are P0 and this is P1, so this pull
  inverts the board's own 2026-07-31 suggested order. The reason is a SEQUENCING constraint the two
  tickets state about EACH OTHER, not a priority judgment: ABC-011's escalation trigger says it must
  land before the first consumer of the key list "otherwise that consumer's own tests are written
  against a key that under-detects and the defect stops being a bug and becomes an encoded
  assumption", and ABC-012's own Dependencies section says "the two must not be built in the order
  that bakes the defect into this module's tests". ABC-012 IS that consumer (gameStatusOf is
  ADR-0002 clause 4's single supplier of positionCounts). Build ABC-012 first and its Test notes
  REQUIRE an ep-free knight cycle to dodge this defect, leaving that test permanently blind. The
  order is one-way. The owner's standing legality-first directive points the same way and is the
  tiebreak, not the argument. Full reasoning:
  .grugops/context/ticket-to-pr-ABC-011/notes/20260802T214000Z-orchestrator-decision-0e6f8692.md

  ONE TICKET, NOT THREE. In Development takes ABC-011 alone against a limit of 3 for the same reason
  ABC-020 was pulled alone: ABC-012 must not be built against today's key, and ABC-014 walks into the
  ABC-015/RISK-005 sequencing knot flagged for BA/PM below.

  ---
  ENTERED 2026-08-02 by Architect/Design on the In Design exit (task `ticket-to-pr-ABC-011`) -- the
  one board move this role owns on the way out. Ready for Dev 0/6 -> 1/6; no limit approached, no
  override taken.

  THE NEXT MOVE IS NOT MINE. Ready for Dev -> In Development is the ORCHESTRATOR's pull and is
  deliberately NOT taken here, exactly as it was left on 2026-07-31 for ABC-020: In Development is
  0/3 and nothing blocks the pull, but a design role taking a dev pull moves work past the one role
  that holds WIP truth for the whole board.

  WHAT THE ENGINEER GETS, and it is on the ticket rather than only in a note: the ratified reading and
  the exact shape it requires, in a dated `### ANSWERED` block under the ticket's own open design
  question, with six numbered rules each of which a test or a measurement can fail, the measured cost
  table, the two doc edits that land with the change, and the one FEN pair the ruling decides
  (`7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` against the same FEN with `-`, which must now hash EQUAL). Two
  of those rules are traps rather than preferences and are worth reading twice: implementing the
  predicate as `legalMoves(...).some(...)` costs 1.979x per node AND corrupts the position it hashes
  (ABC-009, reproduced), and homing it in src/moves.ts creates this project's first dependency cycle.

  RE-SIZED S -> M at the design hop on the ticket's own named condition, and NOT split. The ticket's
  `## Test notes` still names the two test shapes it always did; the ruling fixes the fourth
  acceptance criterion's ORACLE (`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`) rather than
  adding a criterion, because the predicate re-derives pawn geometry src/moves.ts also owns and that
  duplication is otherwise unguarded.

  ---
  ENTERED AND EXITED 2026-07-31. Architect/Design put ABC-020 here on the In Design exit (first
  occupant of this column in the project's history); the Orchestrator pulled it to In Development
  the same day, which is the move this role owns.

  DEFINITION OF READY re-checked at the pull, not assumed from the earlier promotion: problem,
  scope/out-of-scope, INVEST, measurable acceptance (exact FENs, exact move lists, thresholds at
  149/150 and four/five occurrences, exact call counts), dependencies, NFR triggers with numbers,
  test notes naming the five existing tests that may change, size M, priority P0, no blocker. The
  one open item at cut time -- the return shape -- was closed by the design hop, so the pull is
  clean rather than conditional.

  Ready for Dev 1/6 -> 0/6, In Development 0/3 -> 1/3. Both under limit, no override taken.

  THE NEXT MOVE IS NOT MINE. Ready for Dev -> In Development is the ORCHESTRATOR's pull, and it is
  deliberately not taken here: In Development is 0/3 and the pull order the board's own re-sequencing
  comment suggests puts ABC-020 first, but a design role taking a dev pull would move work past the
  one role that holds WIP truth for the whole board.

  What the engineer gets, and it is on the ticket rather than only in a note: the exact TypeScript
  the contract requires, in a dated `### ANSWERED` block under the ticket's own open design question,
  plus an expected-value table in `## Test notes` for the five existing tests A9 permits changing —
  each value driven read-only against merged src/, not inferred. The one to read twice is the
  fifty-move test at line 69, where the claimant is BLACK, because White made the move that ticked
  the clock to 100.

  MERGE ORDER IS UNCHANGED AND STILL LOAD-BEARING: ABC-020 merges before ABC-019 and before ABC-016,
  whose acceptance criteria were amended on 2026-07-31 to match it.
-->


## In Development (WIP 0/3)

<!--
  EMPTIED 2026-08-03 by the Software Engineer for the SECOND time on this ticket: ABC-011's MEDIUM
  purity defect fixed with tests and a green mandatory gate, moved In Development -> In Review.
  WIP 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override taken, no written reason
  owed. The In Development -> In Review exit is the one board move this role owns.

  BOTH GUARDS BUILT, AND EACH PROVEN LOAD-BEARING BY DELETING IT RATHER THAN BY ARGUING FOR IT.
  The board's own warning above was the right one to write down. Measured against the final tree:

    guard (a) deleted (empty-target / ANSWER)   -> exactly 4 tests fail, and they are ONLY the two
                                                   pure-divergence FENs, at predicate AND key level
    guard (b) deleted (captured-pawn / PURITY)  -> exactly 7 fail: the three empty-target
                                                   corruptions at both levels, plus the
                                                   every-input purity sweep
    both deleted (= the code the owner declined) -> 13 fail, 193 pass -- exactly the pre-fix baseline

  THE TWO FAILURE SETS ARE DISJOINT. Neither guard subsumes the other and neither can be deleted
  with the suite green, so the one-line simplification the Ready for Dev comment warned about is
  now caught by a named test rather than by a comment.

  ONE HONESTY NOTE THE NUMBERS DESERVE: `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` (QE's third
  reproduction) is closed by EITHER guard alone, so it kills neither single-guard mutant. It is
  named rather than counted as evidence for one guard.

  Suite 206 passed / 9 files / skip count 0 (was 193). lint, typecheck, build all exit 0.
  NO EXISTING TEST MODIFIED -- zero changed pre-existing lines in either test file, verified by
  line-level diff; not even an import was widened this pass, which is stricter than the first pass
  managed. Nothing was merged and nothing was deployed; a human holds both.

  ---
  PULLED 2026-08-03 by the Orchestrator from Ready for Dev, the second pull on this ticket. WIP
  0/3 -> 1/3; no limit approached, no override taken. See the Ready for Dev comment above for the
  Definition-of-Ready re-check and why the fix is two guards rather than one.

  The engineer builds the SECOND `### ANSWERED 2026-08-03` block on the ticket. The reading and the
  fix contract are settled; TDD and the implementation are still the engineer's. The bar that decides
  whether the fix is right is unchanged from the first pass and is now sharper: the predicate leaves
  the position byte-identical on return for EVERY input, not merely for reachable ones, and the
  answer is specified rather than inherited where the board contradicts the ep square.
-->

<!--
  EMPTIED 2026-08-03 by the Software Engineer: ABC-011 implemented with tests and a green
  mandatory gate, moved In Development -> In Review. WIP 1/3 -> 0/3. The In Development ->
  In Review exit is the one board move this role owns.

  ---
  PULLED 2026-08-02 by the Orchestrator from Ready for Dev -- the one board move this role owns on
  the way in. WIP 0/3 -> 1/3; no limit approached, no override taken. See the Ready for Dev comment
  above for the Definition-of-Ready re-check, the ADR-0005 blocking check, and why a P1 was pulled
  ahead of two P0s.

  The engineer builds the `### ANSWERED` block on the ticket exactly as ratified: the strict-FIDE
  reading, `hasLegalEnPassant` exported from src/legal.ts, and one changed condition at
  src/zobrist.ts:71 with the `epSquare !== NO_SQUARE` guard FIRST so the no-ep path is untouched.
  The reading is settled; TDD and the implementation are still the engineer's.

  ---
  EMPTIED 2026-07-31 by the Software Engineer: ABC-020 implemented with tests and a green
  mandatory gate, moved to In Review. WIP 1/3 -> 0/3. The In Development -> In Review exit is
  the one board move this role owns.

  PULLED 2026-07-31 by the Orchestrator from Ready for Dev -- the one board move this role owns on
  the way in. WIP 0/3 -> 1/3; the column takes ONE ticket, not three, because ABC-020 must merge
  before ABC-019 and ABC-016 and pulling a second ticket now would invite a merge order the board
  has twice recorded as load-bearing.

  Why this ticket first among the P0s: ABC-012/014/018/019 are P0 because the product does not
  exist without them. ABC-020 is P0 because the product plays chess by the wrong rules -- a
  different P0, and the owner's 2026-07-31 directive orders the two.

  Emptied 2026-07-23: ABC-003 moved to In Review once implemented with tests and a green
  mandatory gate. In lean mode a ticket needing neither analysis nor design flows
  Ready → In Development → In Review with no intermediate hop.
-->


## In Review (WIP 0/3)

<!--
  EXITED 2026-08-03 by QE/E2E on a PASS verdict, the SECOND review pass: ABC-011 -> In Security/NFR.
  In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; NO LIMIT APPROACHED, no override taken, no
  written reason owed. The In Review exit is the one board move this role owns. Nothing was merged
  and nothing was deployed -- a human holds both.

  VERDICT: PASS. The MEDIUM purity defect the project owner declined to merge is GENUINELY CLOSED.
  Reached by re-deriving the ticket and by breaking the delivered suite with mutants -- NOT by
  re-running the Engineer's suite and reading the green.

  THE MUTATION CAMPAIGN IS THE PART THAT MATTERS. 49 mutants against the CHANGED production surface
  (the first pass's 22 re-run, plus 27 new ones aimed at the guard surface): 44 killed, 5 survived,
  and every one of the 5 was then PROVED behaviour-equivalent over 55,600 adversarial inputs each
  (same answer, same key, same purity) rather than merely left unkilled.

  TWO OF THE NEW MUTANTS SURVIVED ALL 206 DELIVERED TESTS AND WERE REAL. Both are exactly the
  "one-line equivalent simplification" the second design hop warned about:
    - guard (b) relaxed from "exactly the enemy PAWN" to "any enemy PIECE" -- green on 206 tests,
      and it permanently rewrites a black KNIGHT on the ep capture square into a black PAWN from a
      single zobristKey call (`4k3/8/8/3nP3/8/8/8/4K3 w - d6 0 1`). That is the owner's MEDIUM
      defect, reopened in a shape no delivered row reaches.
    - guard (a) relaxed from "the target is EMPTY" to "the target holds no ENEMY piece" -- green on
      206 tests, and it answers `true` on the exact FEN guard (a) exists for, the one where
      generateMoves offers an ep capture onto the mover's OWN piece
      (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`). Pure, and still the wrong answer.
  THE SHIPPED CODE IS CORRECT ON ALL FOUR. NO PRODUCTION LINE WAS CHANGED. These were holes in the
  SUITE, not defects in the fix, and they are closed by 8 tests this gate added: the delivered table
  classifies boards by what is MISSING (no pawn, wrong-coloured pawn) and never by what is PRESENT
  INSTEAD, which is the axis both relaxations move along. Suite 206 -> 214, skip count 0.

  THE ENGINEER'S THREE LOAD-BEARING CLAIMS, EACH VERIFIED RATHER THAN ACCEPTED:
    - "each guard is load-bearing, two DISJOINT failure sets" -- TRUE, and it survives this gate's
      strengthening. Guard (a) deleted -> 8 named failures; guard (b) deleted -> 11; INTERSECTION
      EMPTY; both deleted -> 21 = 8 + 11 + the 2 tests either guard alone closes. (Before my tests:
      4 / 7 / 13, exactly as reported.)
    - "one of QE's own first-pass FENs is closed by EITHER guard alone, so it kills neither
      single-guard mutant" -- TRUE. `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` appears in the both-deleted
      failure set and in NEITHER single-guard set. The Engineer's correction of my inherited
      expectation is right and it is now measured twice.
    - "no existing test was modified, zero widened pre-existing lines" -- TRUE at line level, not by
      inspection, and checked three ways. See the entry comment under In Security/NFR.

  PURITY ATTACKED FROM OUTSIDE THE ENGINEER'S SWEEP, which is what this gate was asked to do:
  187,328 inputs the delivered 665-input sweep does not reach -- 600 random boards, hand-corrupted
  off-board squares (the case the Engineer explicitly named as unverified), kingless and multi-king
  boards, all-pawn boards, extreme counters, every castling value, and epSquare = NaN / Infinity /
  fractional / out-of-array, including -256 and 256, which PASS isOnBoard through two's complement.
  0 impure, 0 throws. The same hunter finds 1,383 impurities on a guard-stripped control tree, so it
  is non-vacuous rather than merely quiet.

  ONE THING FROM THE FIRST PASS IS NOW CLOSED AND SHOULD STOP BEING CARRIED: the Z1+L11 combined
  mutant that pass handed to Security/NFR (green suite, stray pawn on off-board square 15) no longer
  reproduces -- guard (b) rejects it, and it stays closed even with guard (a) also deleted. And the
  first pass's other two survivors, Z1 and Z4, are now KILLED -- by src/zobrist.nfr.test.ts's spied
  call-count test, written by the Security/NFR gate in response to that handoff. The handoff worked.

  ENTERED 2026-08-03 by the Software Engineer, the SECOND time this ticket has entered this column.
  In Review 0/3 -> 1/3; no limit approached, no override taken.

  WHAT IS A DELTA AND WHAT IS NOT, so the next gate does not re-derive the whole ticket. The ONLY
  production change since 584defa is FOUR executable lines in `hasLegalEnPassant`
  (`src/legal.ts` +32/-6, of which the rest is comment) plus a doc-comment-only edit to
  `src/zobrist.ts` (+5/-1). `src/zobrist.ts`'s condition, `zobristKey`'s signature, `src/apply.ts`,
  `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are BYTE-UNTOUCHED. Everything
  the first pass and the three prior gates established still stands and was NOT re-opened.

  ALL SIX KNOWN REPRODUCTIONS ARE CLOSED, and each was reproduced independently against the shipped
  tree BEFORE any code was written rather than taken from the notes: QE's three, the fourth the
  design hop found (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`, which the empty-target guard does NOT
  catch), and the two pure divergences where the shipped predicate was already byte-pure and only
  its ANSWER was wrong (`4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and its mirror).

  THE REACHABLE POPULATION DID NOT MOVE, re-derived on this role's own script a fifth independent
  time and reproducing the design, dev and QE hops TO THE NUMBER: 518,474 nodes / 81,397 ep-set
  (15.70%) / 0 answers changed / 0 keys changed / 0 firings of either guard / 0 impure nodes on
  either tree. The guards are a precondition, not a behaviour change.

  NFR-005 RE-DERIVED BY THIS ROLE RATHER THAN INHERITED (Apple M3 Mac15,13 / Node v24.12.0 /
  darwin-arm64, `UNKNOWN - verify` elsewhere): startpos 291.3 ns against a ~450 ns bar, kiwipete
  313.6 ns against a 432-459 ns bar -- MET. Isolated on the predicate, -0.3 to +2.6 ns per call on
  ep-set nodes, i.e. <= +0.41 ns amortized per node and 0.13% of a ~313 ns key -- inside the design
  hop's published +0.9...+3.0 ns band without exceeding its ceiling. 20-25x CHEAPER on the invalid
  class, reproducing its 20-27x. The no-ep sub-bar is ZERO structurally: the guards live inside the
  predicate, after its own NO_SQUARE early return, and the caller's short-circuit never enters it --
  `src/zobrist.nfr.test.ts`'s zero-call assertions pass untouched. THE TWO NO-EP ANCHORS ARE KEPT AS
  A NULL CONTROL whose delta is structurally zero; they land at +0.06 and +0.20 ns, which IS this
  instrument's resolution, and it is why the ep-set whole-key cells (+0.66 and -0.42 ns) are
  reported as measured rather than claimed as a number.

  CARRIED, NOT FIXED: ABC-009, ABC-010, and the `generateMoves` own-piece-capture defect the design
  hop routed to BA/PM (still reproduces -- verified this pass on its own FEN). Nothing was merged
  and nothing was deployed; a human holds both. No PR -- this repo has no git remote.

  ---
  EXITED 2026-08-03 by QE/E2E on a PASS verdict: ABC-011 -> In Security/NFR. In Review 1/3 -> 0/3,
  In Security/NFR 0/2 -> 1/2; NO LIMIT APPROACHED, no override taken, no written reason owed. The
  In Review exit is the one board move this role owns. Nothing was merged and nothing was deployed.

  QE FIXED NO PRODUCTION CODE. src/legal.ts and src/zobrist.ts are byte-identical to 98b07e7. Five
  tests were added and one assertion line, all green, skip count still 0, suite 184 -> 189.

  THE VERDICT WAS REACHED BY RE-DERIVATION AND BY BREAKING THE SUITE, NOT BY RE-RUNNING IT.
  TWENTY-TWO MUTATIONS were run against the delivered suite -- the ABC-020 gate ran thirteen, and
  this ticket is one condition inside a function EPIC-004 will call per node, so the check the last
  gate invented is the check that matters most here. SEVENTEEN were killed. FIVE SURVIVED, and two
  of the five were real:

    L8  `if (legal) return true;` -> `return legal;`   gives up after the FIRST candidate capturer.
        SURVIVED a 184-test suite. It is not an equivalent mutant: on
        `2r4k/8/8/2PpP3/8/8/8/2K5 w - d6 0 1` the lower-file capturer c5xd6 is pinned by the c8 rook
        and e5xd6 is legal, so under the mutant the key COLLAPSES two positions FIDE calls
        different. That is an OVER-collapse -- a repetition declared that never happened -- which is
        the OPPOSITE of the safe error direction this ticket's whole priority argument rests on. The
        property test cannot reach the shape: over an exhaustive 518,474-node walk of the perft
        table at its own `fast` depths, exactly TWO nodes have two pseudo-legal ep capturers at all
        and in NEITHER is the lower-file one illegal. The FEN had to be built. Shipped code is
        CORRECT on it; the suite simply could not see it. Closed, plus its black mirror
        `2k5/8/8/8/2pPp3/8/8/2R4K b - d3 0 1` so the predicate's black branch is covered too.

    Z5  `EP_FILE[fileOf(position.epSquare)]` -> `EP_FILE[0]`   SURVIVED. Re-run against the
        PRE-ABC-011 baseline (4c6ed7d): 174/174 green there too, so this is PRE-EXISTING and not
        introduced by this ticket -- the ep FILE has never been load-bearing in any test here, and
        the new property test does not close it either, because it only ever compares "key with ep"
        against "key with ep cleared", never two different files. Consequence if it broke: a FALSE
        repetition. Closed with one pair, `4k3/8/8/1pPpP3/8/8/8/4K3 w - b6 0 1` vs `... d6 0 1`.

  THE THREE REMAINING SURVIVORS ARE ONE GAP AND IT IS SECURITY/NFR'S -- the Engineer's flag is
  UPHELD, on evidence rather than on deference. Z1 (reorder the guard behind the predicate), Z4
  (drop the epSquare guard) and L11 (drop the predicate's own NO_SQUARE early return) are
  BEHAVIOUR-EQUIVALENT, verified: each leaves 189/189 green and none changes any key on any input,
  because the predicate's internal guard makes the reordered condition compute the same thing. What
  they change is COST on the majority path, which is NFR-005's sub-bar verbatim ("the no-ep-square
  path is not made slower at all"). No assertion about a key can ever fail them; the instrument is a
  spied call count -- exactly the shape src/gameend.nfr.test.ts has and exactly what the ABC-020
  Security/NFR gate wrote. Writing it here would put an NFR test in QE's column.
  ONE FACT THE DEV HOP DID NOT HAVE, handed over so the next gate starts ahead: Z1 AND L11 TOGETHER
  -- the reorder plus deleting the guard that then looks redundant, an ordinary tidy-up -- still
  leave 189/189 GREEN, and on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1` a single zobristKey call then writes
  a white pawn onto OFF-BOARD SQUARE 15, breaking the invariant src/position.ts states in its own
  comment. Latent rather than live, and invisible to every test in the repo.

  ONE NEW DEFECT FOUND, NAMED RATHER THAN FIXED. Since ABC-011, zobristKey PERMANENTLY corrupts a
  position whose ep square is semantically inconsistent -- three reproductions, board bytes compared
  before and after a single call:
      4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1   -> a PHANTOM BLACK PAWN appears on d5
      4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1  -> the white pawn on d5 turns BLACK
      4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1 -> a PHANTOM WHITE PAWN appears on e4
  The predicate builds its probe move with `captured: PAWN | ...` without checking that such a pawn
  is there or that the target is empty; unmakeMove then writes the ASSUMED pawn back, which is a
  creation rather than a restore. FAIR TO THE ENGINEER, and checked before it was written down: on
  the first two FENs the predicate's own ruled ORACLE, `legalMoves(...).some(...)`, corrupts them
  IDENTICALLY -- the fault is pre-existing in generateMoves + apply and the predicate reproduces its
  definition faithfully; and "the shipped predicate does not inherit ABC-009" is TRUE as stated and
  was independently verified on ABC-009's own trigger FEN. What IS new: on the third FEN
  generateMoves does not offer the ep move at all, so the ORACLE says false and stays clean while
  the predicate says true and corrupts -- implementation and ruled definition disagree; and before
  ABC-011 zobristKey was pure on EVERY input, valid or not, while its header and
  memory-bank/30-architecture.md now promise "transiently mutates ... returns the position as it
  found it", which on this class is false. REACHABILITY IS THE SAME CLASS THE TICKET ALREADY
  CARRIES: every trigger needs a semantically invalid FEN through parseFen, makeMove can never
  produce one, and 277,949 reachable nodes are 0 impure. Not fixed (QE does not change production
  code) and not pinned with a test (a test asserting the current output would enshrine it). Instead
  the property that IS true and load-bearing is now pinned: zobristKey is byte-pure at every
  reachable node. Owner: BA/PM to cut it or fold it into ABC-010; Architect/Design to rule on the
  predicate-vs-oracle divergence, since guarding the predicate would deliberately diverge from the
  definition the design hop ratified. It does NOT block ABC-011.

  EVERY LOAD-BEARING CLAIM ON THE BRANCH WAS CHECKED AND HELD.
    - NO EXISTING TEST MODIFIED: verified line-level, not by inspection -- every line of 4c6ed7d's
      two test files was searched for in the new files. Exactly 3 lines absent from each, ALL
      imports; zero non-import lines vanished. src/zobrist.test.ts:33-37's body is byte-identical
      and still passes; only its line numbers moved.
    - AC4's PROPERTY TEST IS NON-VACUOUS IN BOTH HALVES -- in fact: instrumented, the walk plays 557
      double pushes, 52 ep-ANSWERED and 505 ep-UNANSWERED, 0 violations. BUT the delivered
      assertions are `checked > 0` and `answered > 0`, and `checked` counts BOTH kinds, so the
      collapse half was exercised and unpinned. One line added -- `expect(checked - answered)
      .toBeGreaterThan(0)` -- declared loudly here because it edits a test block written on this
      branch (not a pre-existing one) and strengthens rather than accommodates.
    - PURITY: full position state (128 board bytes + all five scalars, stronger than toFen, which
      cannot see the counters) compared across every zobristKey call over a 3-ply walk of all six
      perft roots -- 277,949 nodes, 0 impure. The Engineer's spy counted 277,955 over the same walk;
      the difference is exactly 6, the six roots their walk hashed and mine did not. The two runs
      AGREE EXACTLY.
    - MODULE GRAPH rebuilt from src/*.ts a third time with cycle detection and longest-path
      levelling: ACYCLIC, max depth 6, zobrist 2 -> 5, gameend 5 -> 6. Matches the ruling exactly.
    - THE DIVERGENCE TABLE REPRODUCED TO THE NUMBER on a third independently written script:
      518,474 nodes / 81,397 ep-set / 77,872 merged violations / 862 board-only (861 position-3,
      1 position-4) / ZERO shipped. Plus a column the prior hops did not have: the shipped predicate
      disagreed with its documented oracle ZERO times over all 81,397 ep-set nodes.
    - BASELINE 174 was not taken on trust: 4c6ed7d's src/ extracted with `git archive` into a
      sandbox and run. 174 passed / 0 skipped, confirmed.

  THE MODULE TABLE IN memory-bank/30-architecture.md: the Engineer's call to leave it ordered by
  conceptual layer is UPHELD. The table orders by layer, not by DAG level, and the corrected
  layering line two sections down carries the fix with its rebuild dated. Reordering it would be the
  unrequested refactor rule 9 forbids. One imprecision named rather than fixed: the `Hashing` row's
  CONTENT still reads as a self-contained leaf and says nothing about the legal.ts edge -- a
  one-cell content edit, not a reshuffle, and documentation rather than coverage.

  NFR-005's COST BARS WERE DELIBERATELY NOT RE-MEASURED -- Security/NFR owns them next and two roles
  measuring the same bar is waste, the same disposition the ABC-020 QE gate took with A10. What was
  re-derived is the sub-bar's STRUCTURAL half, without timing anything.

  Gates re-run by QE on this branch: 189 pass / 0 skipped / lint, typecheck and build all exit 0
  (2 pre-existing biome config-schema infos, present at 4c6ed7d) / src/legal.ts and src/zobrist.ts
  both 100% stmt/branch/func/line. Five items could not be settled and are recorded as a `claim` at
  `confidence: UNKNOWN - verify`. ADR-0005 is still `proposed`; no agent may mark it `accepted` and
  none did. No PR exists and none was invented -- this repo has no git remote.
-->

<!--
  ENTERED 2026-08-03 by the Software Engineer, branch `grugops/ticket-to-pr-ABC-011`. In Development
  1/3 -> 0/3, In Review 0/3 -> 1/3; NO LIMIT APPROACHED, no override taken, no written reason owed.

  NO PR EXISTS, AND THIS IS NOT A GAP IN THE WORK. This repo has NO git remote -- `git remote` is
  empty -- so there is nowhere to push and no pull request to open. No PR link was invented. Same
  posture ABC-020 and the ABC-004..007 stack recorded. A human holds merge and deploy; nothing was
  merged and nothing was deployed.

  WHAT LANDED. Four files under src/ (+265/-9) and two doc edits. src/legal.ts gains
  ONE new export (`hasLegalEnPassant`, 30 lines incl. doc comment); src/zobrist.ts changes ONE
  condition and gains ONE import; the rest is tests. src/gameend.ts, src/apply.ts, src/moves.ts,
  src/position.ts and src/fen.ts are BYTE-UNTOUCHED, zobristKey's signature is unchanged and no
  state was added to Position (ADR-0002 clause 1).

  THE `### ANSWERED` BLOCK WAS BUILT AS RATIFIED AND NONE OF ITS SIX RULES WAS TRADED AWAY. Rule 1
  (guard first, short-circuits) is SPIED rather than asserted: over a depth-3 walk of all six perft
  positions, 277,955 nodes hashed, 17,663 carrying an ep square, hasLegalEnPassant called exactly
  17,663 times -- ZERO calls on the 260,292 no-ep nodes, and never more than one on any node. Rule 2
  (not legalMoves) and rule 3 (not moves.ts) were followed, and the graph was REBUILT from src/*.ts
  rather than trusted: still acyclic, still max depth 6, zobrist 2 -> 5 and gameend 5 -> 6, exactly
  as the design hop ruled. Rule 5 (purity) is a test, four FENs including ABC-009's own trigger
  shape `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1`, toFen compared across the call.

  ACCEPTANCE. All seven criteria green -- see the artifact-ref note for how each was proved. The
  two that were the point: the repro pair (`...4P3... b KQkq e3` vs `-`) now hashes EQUAL, and BOTH
  regression guards still hash DIFFERENT. NO EXISTING TEST WAS MODIFIED: three import lines were
  widened across src/zobrist.test.ts and src/legal.test.ts to reach the new symbols, and every
  other original line in both files is byte-identical -- verified by diffing each original line
  against the new file, not by inspection. src/zobrist.test.ts's "depends on en-passant
  availability" fixture is untouched and still passes, which is what the ticket demanded.

  THE DEFECT'S SCALE, RE-DERIVED INDEPENDENTLY rather than quoted from the design hop. Exhaustive
  walk of the perft table at src/perft.test.ts's own `fast` depths: 518,474 nodes, 81,397 carrying
  an ep square. Property violations against the FIDE ground truth
  `legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`: merged (pre-ABC-011) 77,872; board-only
  (the rejected reading) 862, of which 861 are position-3 and 1 is position-4; SHIPPED strict ZERO.
  Every one of the design hop's published figures reproduced to the number on an independent run.

  NFR-005 MEASURED, NOT INFERRED, on Apple M3 / Node v24.12.0 / darwin-arm64 -- the machine class
  the baseline was taken on; `UNKNOWN - verify` on any other hardware. Merged and ABC-011 zobristKey
  benchmarked IN THE SAME PROCESS against a pre-change copy of src/ outside the repo, 300k
  iterations per cell, interleaved forward and backward, two independent samples. Bar: within 1.5x
  of 288-306 ns at kiwipete / ~300 ns at startpos, and the no-ep path not slower AT ALL.
    startpos, no ep      302.9-306.5 ns  (bar ~450 ns)   0.963-1.008x merged   PASS
    kiwipete, no ep      309.1-315.6 ns  (bar 432-459)   0.984-1.015x merged   PASS
    ep set, no capture   320.3-351.0 ns                  1.000-1.091x merged
    ep set, capture available                            1.357-1.383x merged   worst case, under 1.5x
    amortized, 120,000-node pool at natural ep frequency  0.9948-1.0218x merged
  The no-ep sub-bar holds STRUCTURALLY and not just statistically: the spy above shows the
  predicate is never entered on those nodes, so the majority path executes the same instructions it
  executed before. The worst-case shape came in BELOW the design hop's recorded 1.45-1.48x, and the
  amortized row -- the one ADR-0002 clause 3 makes binding for EPIC-004's per-node key -- is inside
  noise of merged.

  CARRIED, NOT FIXED, and each is deliberate: ABC-009 (legalMoves mutating its argument) is
  untouched and the shipped predicate does NOT inherit it -- proved by the purity test on ABC-009's
  own trigger FEN; ABC-010 (FEN semantic validation) untouched. ADR-0005 remains `proposed` and NO
  AGENT MAY MARK IT `accepted`. One thing flagged FOR THE NEXT GATES rather than absorbed: rule 1's
  short-circuit is held by construction and by an out-of-repo spy, NOT by any test in the repo --
  the same gap the ABC-020 Security/NFR gate closed for NFR-001 by adding src/gameend.nfr.test.ts.
  Left to that gate on the ABC-020 precedent (the engineer measures, the gate pins) rather than
  taken here, because the design hop sized this ticket at three test shapes and a fourth is scope
  the engineer should not quietly take.

  ---
  EMPTIED 2026-08-01 by QE/E2E: ABC-020 reviewed and PASSED, moved In Review -> In Security/NFR.
  WIP 1/3 -> 0/3. The In Review exit is the one board move this role owns.

  VERDICT: PASS. ABC-020 meets the lean Definition of Done and the PR review checklist. No defect
  blocks the exit. QE fixed NO production code; six tests were added, all green, skip count 0.

  RE-DERIVED INDEPENDENTLY, not read off the Engineer's report. The G-1 line driven from the FEN
  and the move list: Black's move makes the third occurrence, the status is `in-progress` with
  `{by:"white", draws:["threefold-repetition"]}`, Re8 is still legal for the side to move, and Re8
  gives `{white-wins, checkmate}`. FIDE 1-0 where merged main returns 1/2-1/2. The result is
  `in-progress` and not a fourth value -- at runtime AND at compile time. Boundaries swept in both
  directions and both colours: clock 98/99 no claim, 100/149 claimable, 150/151/999 automatic;
  occurrences 0-2 no claim, 3-4 claimable, 5+ automatic; the full 4x4 cross-product correct,
  including both draws reported together with threefold first.

  THIRTEEN MUTATIONS RUN against the delivered suite in a throwaway worktree -- the check the
  ABC-007 gate did not make. NINE were killed, including `by: "white"` unconditionally (the exact
  G-1 defect, 2 tests), both thresholds in both directions, and `claimable` always present (12
  tests, of which 8 are among the 18 whole-object toEqual assertions A9 forbids touching -- so
  those 18 are demonstrably NOT inert and now also assert that nothing is claimable).

  FOUR MUTANTS SURVIVED, every one an ordering above the clock, and the ticket claims a guard that
  does not exist: `## Out of scope` says the zero-legal-moves-first ordering is load-bearing and
  that "A6 pins it". A6 pins checkmate against the CLOCK -- a different pair. Moving
  isInsufficientMaterial below the 150-ply check, below the fivefold check, or moving the
  zero-legal-moves branch below isInsufficientMaterial each changed a REASON and never a RESULT, so
  no whole-object assertion noticed. Product severity LOW (a reason string, read only by EPIC-006's
  result screen; isInsufficientMaterial is correct per R-1, so no mutant can turn a win into a
  draw). GATE severity higher -- a document asserting a guard that is not there is how ABC-007
  passed. CLOSED by a QE test; all four now fail.

  A9 VERIFIED BY NAME-SET DIFF against b1b96cd~1 (not against main, which would have counted the
  architecture-audit tests as ABC-020 edits): 28 names before, 4 removed, 15 added, 24 unchanged.
  A name diff is not sufficient, so the bodies were diffed too: the only pre-existing tests touched
  are the five named on the ticket, and line 142 is byte-identical. No sixth test moved.

  A5's EPOCH ARGUMENT RULED CORRECT, and the wording that is wrong is QE's own. Ten drives, five
  policies x two trees: pre-ABC-020 first-legal 117 plies (reproducing QE's published G-3 figure to
  the ply), this branch first-legal 167, quiet-only and last-legal 150 exactly. 150-133=17,
  17+100=117, 17+150=167 -- all exact. The wall resets the clock THREE times (plies 8, 14, 17), and
  ply 14 is a PAWN MOVE: the wall unfreezes after the first capture. So A5's Given -- "no capture
  and no pawn move available to either side", carried verbatim from QE's own G-3 note -- is false
  beyond ply 7, and "within 150 plies" holds only per irreversible-move epoch, which is what FIDE
  9.6.2 actually bounds. The Engineer disclosed both narrowings rather than quietly satisfying the
  criterion. A5's SUBSTANCE -- the game terminates automatically with no claim -- holds under every
  one of the ten drives, and is now pinned by two QE tests instead of by argument. RECOMMENDATION
  FOR BA/PM: correct A5's and A8's Given; the criteria themselves need no change and the code needs
  none.

  CARRIED DEFECTS CONFIRMED GENUINELY CARRIED. ABC-009 still mutates its argument (the phantom
  second white king on 4k3/8/8/8/8/8/8/K7 w KQ - 0 1), and NO new test depends on it -- all eleven
  FENs the new tests use round-trip through toFen unchanged across a gameStatus call, kiwipete
  included. ABC-011 cannot decide anything here: epSquare measured -1 at every ply of the G-1
  shuffle, QE's colour-mirror line, knightCycles(4), and the 150-ply wall drive.

  GATES RE-RUN BY QE ON THIS BRANCH after the six added tests: npm test 171 passed / 7 files, skip
  count 0, lint exit 0 (2 pre-existing biome config infos, present before this ticket), typecheck
  exit 0, build exit 0, src/gameend.ts 100% stmt/branch/func/line. Every figure matches the
  Engineer's independently.

  NOT VERIFIED HERE, DELIBERATELY: A10's NFR-001 cost bars. Security/NFR reviews those next and two
  roles measuring the same thing is waste. One thing flagged for them: moving the 150-ply check
  below the fivefold check kills no test and would break the measured "zobristKey = 0 when the
  clock decides" bar.

  THREE ITEMS COULD NOT BE SETTLED and are recorded as a `claim` with confidence UNKNOWN - verify,
  none of them blocking: (1) FIDE 9.6.1's "five CONSECUTIVE alternate moves" versus the plain
  five-count the ticket specifies -- a BA/PM reading, and unfixable from a counts map anyway since
  it carries no ordering; (2) GameResult is dead, keeping it was RIGHT (the ratified block spells it
  out), and the trap is one line to close via `GameResult = GameStatus["result"]` -- for whoever
  owns the ADR-0002 seam; (3) five occurrences AND clock >= 150 always reports seventy-five-move --
  left deliberately unpinned, because pinning an arbitrary choice between two rules that both apply
  is how a later correction becomes a "regression". EPIC-006's result screen decides.

  ENTERED 2026-07-31 by the Software Engineer, branch `grugops/ticket-to-pr-ABC-020`. WIP 0/3 ->
  1/3; no limit approached, no override taken.

  NO PR EXISTS, AND THIS IS NOT A GAP IN THE WORK. This repo has NO git remote -- `git remote` is
  empty -- so there is nowhere to push and no pull request to open. `gh` IS installed and
  authenticated (account `abitwise`), so the blocker is the missing remote, not the tool, and no PR
  link was invented. The two commits sit on the local branch. This is the posture the ABC-004..007
  stack has been in since 2026-07-24, where the same comment records a human merge still
  outstanding. A human holds merge and deploy; nothing was merged and nothing was deployed.

  WHAT LANDED. src/gameend.ts only, +113/-66 lines, no new module, no new import, no new state on
  Position -- the import list is byte-for-byte the merged one, and the gameStatus signature is
  byte-identical (positionCounts stays second and stays optional). The design hop's ratified shape
  was built exactly as written: GameStatus is a two-arm discriminated union on the `result` field
  it already had, `claimable` is ABSENT (not null, not []) when nothing is claimable, and
  DrawClaims.by is required. EndReason gained fivefold-repetition + seventy-five-move and lost
  threefold-repetition + fifty-move, which are now the whole of the disjoint ClaimableDraw.

  ACCEPTANCE. A1-A10 all green -- see the artifact-ref note for how each was proved. A9 held
  exactly: the FOUR named tests that had to change are the only ones whose names changed, the
  fifth (99 plies) gained the absence assertion the ticket asked for, and NO sixth test moved.
  Measured, not asserted: the first run after the implementation landed showed 4 failures, all
  four named. Line 142 ("prefers checkmate over the fifty-move rule") is untouched, as instructed.

  A10 MEASURED on Apple M3 / Node v24.12.0 / darwin-arm64, spied (not inferred) with an
  instrumented copy of legal.ts + zobrist.ts outside the repo, gameend.ts byte-identical:
  legalMoves calls per gameStatus = 1 across all ten call shapes (bar: exactly 1); zobristKey
  calls <= 1, and 0 whenever the caller is bare or an earlier branch decides (bar: at most 1);
  cost 2.17-2.24 us/call against the published 2.52 us baseline, i.e. 0.86-0.89x where the bar is
  1.5x (<= 3.78 us). UNKNOWN - verify on any other hardware.

  CARRIED, NOT FIXED, exactly as the ticket directs: ABC-009 (legalMoves mutating its argument)
  and ABC-011 (en-passant hashing). Every repeated line in the new tests is an en-passant-free
  knight or king shuffle for ABC-011's reason. The FIDE 5.2.2 dead-position gap is NOT fixed --
  the module header now says honestly that insufficient-material is a SUBSET of 5.2.2, which was
  QE's G-3 recommendation, and the terminal-check ORDER is unchanged (R-4's load-bearing
  ordering, pinned by A6 at clock 150 as well as 100).

  ONE THING FOR THE REVIEWER. `GameResult` is now referenced by nothing, here or anywhere in
  src/. It was already exported before this ticket and the design hop's ratified shape spells it
  out verbatim, so it was kept rather than deleted -- flagged, not removed, per coding rule 12,
  and the call to keep or drop it belongs with whoever owns the ADR-0002 seam.

  Cleared 2026-07-24: the ABC-004..007 stacked review unit passed the EPIC-001 review gate
  (QE/E2E independent PR-review-checklist pass + Security/NFR gate) and advanced to Ready for
  UAT. The 4/3 WIP override recorded here at batch start is now RESOLVED — the column is back
  to 0/3. The stacked branches are unchanged (main → 004 → 005 → 006 → 007); the single human
  merge of that stack is still outstanding and still human-held (autonomy=pr).
-->


## In Security/NFR (WIP 0/2)


<!--
  EXITED 2026-08-03 by Security/NFR (task `ticket-to-pr-ABC-011`, subtask
  `security-nfr-abc011-regate`, Workflow 04) on the SECOND risk/NFR gate. ABC-011 moved
  In Security/NFR -> Ready for UAT. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4;
  no limit approached, no override taken, no written reason owed.

  VERDICT: PASS (PASS_WITH_RISKS in this role's own vocabulary -- result PASS, FOUR accepted risks
  each with a named owner, NO required fix outstanding). Gated against `security.asvs_level: L1`
  and `security.block_on: high`. No security finding at any severity, nothing at or near `high`.

  THIS RUN COMPLETED AN INTERRUPTED ONE, AND THE RECORD SAYS SO RATHER THAN GLOSSING IT. A first
  attempt at this subtask was cut off mid-flight. It had already moved this board to Ready for UAT
  with a PASS and written long figure-carrying blocks into plans/board.md, plans/nfr-catalog.md and
  plans/traceability.md -- but published NO typed note at all, so the board asserted a verdict the
  shared verified context did not back. Under "no published notes, no advance" that state was not
  admissible, and the project owner has already declined to merge this ticket once, so an unbacked
  PASS is exactly what must not slip through. That prose was never committed. It was REVERTED
  rather than patched, and every figure below was re-derived on this run's own scripts. The
  interrupted run's numbers were treated as evidence to be checked, never inherited on trust.
  Which of its figures reproduced and which did not is recorded in the `observation` note.

  WHAT THIS GATE ADJUDICATED, AND WHAT IT DELIBERATELY DID NOT. The delta since this column's own
  first pass is FOUR executable lines in one pure function (src/legal.ts: hoist `captured` plus two
  board-read guards) and a doc-comment-only edit to src/zobrist.ts. The full 70-row ASVS L1 tier was
  NOT re-run, and that is a decision with a reason rather than an omission: this column worked that
  surface row by row on the first pass and the diff adds no surface. What actually changed WAS
  re-checked -- see the ASVS block below.

  1. NFR-005's TWO BAR POSITIONS -- MET WITH ROOM, re-measured independently.
     FOUR trees in ONE process: merged `4c6ed7d`, pre-guard `584defa`, shipped, and a
     BYTE-IDENTICAL TWIN of the shipped tree used as a NULL CONTROL BY IDENTITY. 15 rounds x
     100,000 iterations, rotated tree AND cell order, medians, two full samples. Apple M3
     (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64 -- `UNKNOWN - verify` on any other hardware.

       startpos   296.8-299.3 ns   against the ~450 ns bar    (1.004-1.008x of merged)
       kiwipete   304.7-307.4 ns   against the 432-459 ns bar (0.993-0.999x of merged)

     The bar is 1.5x the audit's 288-306 ns at kiwipete / ~300 ns at startpos, read off this
     ticket's own `## Security / NFR triggers` block rather than recalled.

  2. THE CALL-COUNT SUB-BAR -- MET, re-verified on this gate's own spy. A copy of zobrist.ts whose
     body differs from the shipped file by ONE import specifier and nothing else, importing a shim
     that counts and delegates to the real predicate. The walk's roots and depths were READ OUT OF
     src/perft.test.ts, not recalled.

       TOTAL nodes hashed                      518474
       nodes carrying an ep square              81397   (15.70%)
       nodes with NO ep square                 437077
       hasLegalEnPassant calls                  81397
         ... of those, on a NO-EP node              0    <- THE SUB-BAR
       max predicate calls per zobristKey call       1
       zobristKey impure at a node                   0

     Reproduced here TO THE NODE. The sub-bar reads "not made slower at all", which no wall-clock
     run can settle; the claim is structural (the caller's `epSquare !== NO_SQUARE` short-circuits,
     so the majority path executes byte-for-byte what it executed before) and a spied call count is
     the only instrument that can FAIL it.

  3. THE MEDIUM PURITY DEFECT -- CLOSED, at HIGH confidence, verified here rather than accepted.
       - all 13 known reproductions answer `false` and are byte-pure through zobristKey;
       - 336,000 adversarial inputs of this gate's own construction: 0 impure, 0 throws. Six board
         shapes (plain / off-board junk / kingless / many-kings / all-pawns / dense) x 139 epSquare
         values including NO_SQUARE, every on- and off-board index, -2/-16/-256/-999/128/256/999,
         NaN, Infinity and fractional, both sides to move;
       - THE INSTRUMENT IS NON-VACUOUS, and by the strongest control available: not a synthetic
         guard-stripped tree but THE REAL PRE-GUARD TREE `584defa`, the code the owner declined to
         merge. On the IDENTICAL population it reads 14,341 impurities and is impure on 6 of the
         same 13 reproductions. 0 against 14,341 is the result; 0 on its own would not be.
       - single-guard controls confirm the design hop's disjointness reading: guard (a) deleted
         alone -> still 0 impure (it buys the ANSWER); guard (b) deleted alone -> impure on 5 of
         the 13 (it buys PURITY).
       - and it is not only empirical: guard (b) establishes exactly the precondition
         `undoSpecial`'s unconditional write assumes and does not state, guard (a) establishes the
         destination is empty AND rejects every out-of-array target, because `board[oob]` on a
         Uint8Array is `undefined` and `undefined !== EMPTY`.
     HIGH confidence, with its bound named honestly: this is 336,000 inputs plus a structural
     precondition argument, not a theorem.

  4. THE INSTRUMENT'S OWN LIMIT, STATED RATHER THAN HIDDEN -- and it is the part worth reading.
     THE WHOLE-KEY INSTRUMENT CANNOT RESOLVE THE TWO GUARDS' COST, so NO number is claimed from it.
     Every shipped-minus-pre-guard whole-key delta sits inside the identity twin's own per-cell
     band, and the deltas FLIP SIGN between this gate's two samples (startpos -0.69 then -3.24 ns;
     kiwipete -1.54 then -7.25 ns). Benchmark protocol is a known trap on this ticket -- this is the
     fourth protocol to hit the same wall -- so a null control was carried and the instrument was
     not allowed to quote a number it cannot support.
     Measured instead on the predicate in isolation, in a process that does NOTHING else (no Proxy,
     no sweep -- both are known to poison inline caches), 21 rounds x 500,000 iterations, with the
     same identity twin reading +-0.04 ns on the tight cells:
       guards cost about +0.9 ns on the ep-set/no-capture shape
         = <= +0.15 ns amortized per node at the measured 15.70% ep frequency, about 0.05% of a
           ~305 ns key;
       below resolution on the shapes where a capture exists;
       23x CHEAPER (123.4 -> 5.4 ns) on the invalid-FEN class the guards exist for.
     That is consistent with the Engineer's <= +0.41 ns and the design hop's <= +0.5 ns and does
     NOT confirm their per-cell point estimates.

  5. THE "SPREAD IS RESOLVED" WITHDRAWAL STANDS, and this gate's own figures support the
     withdrawal rather than the original claim. The worst-case ep shape reads 1.401-1.412x here,
     1.385-1.400x at the first gate, and 1.446-1.458x at the interrupted run. Three protocols,
     three answers inside about +-4%. The bar is unaffected -- it is anchored at kiwipete/startpos
     and the worst-case ep shape is not a bar position -- but nobody should call that quantity
     settled.

  6. THE TWO COST-SHAPED EQUIVALENT MUTANTS QE HANDED THIS COLUMN -- NOT PINNED. This gate owns
     the call, including the decline. (i) deleting hasLegalEnPassant's own NO_SQUARE early return;
     (ii) moving both guards INSIDE the EP_CAPTURE_SIDES loop.
       - both survive all 214 tests -- verified by running them, not assumed;
       - both behaviour-equivalent over 83,400 inputs of this gate's own construction: 0 answer,
         0 key, 0 purity differences;
       - NO spied call count distinguishes either: 0 of 9 call shapes, at the predicate AND through
         zobristKey (makeMove / unmakeMove / isSquareAttackedBy identical everywhere). The
         instrument src/zobrist.nfr.test.ts exists for cannot be pointed at them;
       - the early-return deletion costs STRUCTURALLY ZERO in production: zobristKey is the ONLY
         production caller of the predicate and its own guard short-circuits, so a no-ep node never
         enters the callee. That is a stronger statement than a nanosecond figure and it is why no
         nanosecond figure is quoted;
       - the ONLY instrument that could see them is a Proxy board-read counter, and this gate
         measured that instrument to be UNUSABLE here: a Proxy over the Uint8Array board THROWS
         outright (`TypeError: this is not a typed array`, from kingSquareOf's `board.indexOf`), so
         it does not even run without a function-binding shim; shimmed it costs 11.1-13.6x, and its
         mere presence in the process inflates the UN-instrumented readings by 2.0-3.0x. An
         instrument that destroys what it measures cannot found a budget assertion.
     Pinning a cost this project's instruments cannot resolve would be pinning noise, and this
     role's hard limit is not to gold-plate. ACCEPTED RISK, owner: Security/NFR at EPIC-004, when a
     search exists and a per-node budget makes 0.05% worth an assertion.

  7. TWO FIRST-PASS RESIDUALS ARE CLOSED -- QE's report CONFIRMED by running it. Z1 (reorder the
     call-site conjunction) and Z4 (drop the epSquare guard) are each KILLED by
     src/zobrist.nfr.test.ts's spied zero-call assertion -- one test, both mutants, each applied to
     the repository's own src/ and the failure watched. This project can stop carrying them.

  8. THE UNCOMMITTED EDIT TO src/zobrist.nfr.test.ts -- KEPT, after being checked rather than
     inherited. It arrived with no note explaining it.
       - it is COMMENT-ONLY, proved mechanically: both revisions stripped of comments are
         md5-identical. Zero assertion, import or fixture lines changed;
       - its four-combination deletion table was RE-DERIVED here and is CORRECT:
           early return gone, both guards present -> false, board untouched
           + guard (a) gone                       -> false, board untouched
           + guard (b) gone                       -> false, board untouched
           + BOTH guards gone                     -> stray pawn back on off-board square 15
                                                     (index 15: 0 -> 1), and BOTH cases fail
         The last row was proven by applying that mutant to the repository's own src/ and watching
         the two assertions fail, not by reading the code;
       - so the block is a genuine THREE-deletion regression guard and is kept, not dropped;
       - ONE SENTENCE WAS WITHDRAWN AS UNSUPPORTABLE AND CORRECTED. It quoted "about +1.6 ns" for
         the direct no-ep call. This gate's own benchmark reads +0.9 to +2.9 ns on cells where that
         deletion's delta is STRUCTURALLY ZERO (an ep square is set, so the deleted branch is never
         taken), so the cross-tree systematic floor is the same size as the signal and no point
         estimate survives. The corrected comment quotes no figure and states the structural fact
         instead.

  9. ASVS L1 -- judged, not padded. The 70-row tier was worked row by row at the first pass and is
     not re-run on a four-line diff to a pure function. What the diff can actually move was
     re-checked here:
       no import added or widened in src/legal.ts        verified
       package.json / lockfile diff 584defa..HEAD        EMPTY; zero runtime dependencies
       eval / new Function / vm / child_process / fs /
         http / fetch / net / process.env / os in src/   NONE
       secret-shaped strings in the src/ diff            NONE
     V2.1.1 / V2.2.1 (input validated to business expectations) moves in the GOOD direction -- the
     library no longer corrupts a caller's position on a semantically-inconsistent FEN -- while the
     underlying FEN semantic-validation gap is unchanged and still ABC-010's. The two NEW reads can
     address out-of-array indices; on a Uint8Array that returns `undefined` and is NOT a
     memory-safety issue, so V1.4.1 stays NOT-APPLICABLE (and is an L2 row in any case).
     V15.1.1 / V15.2.1's severity override to `low` recorded at the first pass stands unchanged
     (owner: Architect/Design at EPIC-006). V13.4.1 stays DEFERRED, not passed -- nothing is
     deployed or packaged until EPIC-006.

  10. GATES, EXACTLY AS THEY RAN AT THIS GATE.
       npm test            214 passed / 9 files / 0 failed
       skip count          0    (npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests')
       npm run lint        exit 0  (the same 2 pre-existing biome config-schema infos)
       npm run typecheck   exit 0
       npm run build       exit 0
      The repository's own src/ was mutated transiently to prove assertions fail; both files were
      backed up first, restored after, and the restore was md5-verified each time.

  FOUR ACCEPTED RISKS, EACH WITH A NAMED OWNER, AND NO REQUIRED FIX OUTSTANDING:
    1. Every timing figure on this ticket is ONE machine (Apple M3 / Node v24.12.0 / darwin-arm64)
       and `UNKNOWN - verify` anywhere else. Owner: EPIC-004's non-M3 spike, which already carries
       the identical obligation for NFR-005's depth-7 PROVISIONAL marker.
    2. Two behaviour-equivalent cost mutants are unpinned, deliberately, because no instrument this
       project has can resolve them. Owner: Security/NFR at EPIC-004.
    3. The amortized per-node figure is measured on a perft-table population, not a search's node
       distribution, and stays `UNKNOWN - verify` until a search exists. Owner: EPIC-004.
    4. Purity closure is 336,000 inputs plus a structural argument, not a proof. A shape absent
       from the generator would escape it. Owner: QE/E2E, at the next change to this predicate.
  The first pass's accepted risk "zobristKey permanently corrupts a semantically-inconsistent ep
  position" is GONE from this list rather than reworded -- it is the MEDIUM, and it is closed.

  ABC-009 and ABC-010 still carried, not fixed. The `generateMoves` en-passant-onto-own-piece
  defect is still owned by nobody until BA/PM acts -- now three gates in a row saying it.
  UAT is DEFERRED to EPIC-006, NOT passed. ADR-0005 remains `proposed`; no agent may mark it
  `accepted` and this gate did not. NO PR -- this repo has no git remote. NOTHING MERGED, NOTHING
  DEPLOYED -- a human holds both.
-->

<!--
  ENTERED 2026-08-03 by QE/E2E, the SECOND time this ticket has entered this column.
  In Security/NFR 0/2 -> 1/2; no limit approached, no override taken.

  WHAT IS A DELTA AND WHAT IS NOT, so this gate does not re-derive the whole ticket. Since 584defa
  the ONLY production change is FOUR executable lines in `hasLegalEnPassant` plus a doc-comment-only
  edit to `src/zobrist.ts`. This QE pass changed NO production code and added 8 tests
  (206 -> 214, skip count 0). `src/zobrist.ts`'s condition, `zobristKey`'s signature, `src/apply.ts`,
  `src/moves.ts`, `src/gameend.ts`, `src/position.ts` and `src/fen.ts` are BYTE-UNTOUCHED.

  "NO EXISTING TEST WAS MODIFIED" -- VERIFIED AT LINE LEVEL, THREE WAYS, NOT BY INSPECTION. Every
  line of every test file at each of three revisions was searched for in the current tree, which is
  stricter than `git diff` because it also catches a line that was moved and edited:
    from 584defa (before the fix commits) -> 0 absent lines across all 9 test files. The Engineer's
      "this pass widened zero pre-existing lines" is TRUE.
    from ddc013e (the branch tip) -> 0 absent lines. This gate's own 8 tests are pure appends and
      widened no import either.
    from 4c6ed7d (the branch point) -> 6 absent lines, ALL SIX IMPORTS, three per test file, exactly
      what the first pass recorded. ZERO non-import lines have vanished across the whole branch.
  `src/zobrist.test.ts:33-37`, the fixture the ticket names by line number, is BYTE-IDENTICAL; only
  its line numbers moved (33-37 -> 43-47) because helpers were added above it.

  FOR THIS GATE SPECIFICALLY, and NFR-005's cost bars were deliberately NOT re-measured here:
    - Your own src/zobrist.nfr.test.ts now kills the first pass's Z1 and Z4 survivors (1 test each,
      the spied zero-call assertion). The gap the first QE pass handed you is closed.
    - TWO COST-SHAPED MUTANTS SURVIVE AND ARE BEHAVIOUR-EQUIVALENT, so no assertion about a key can
      ever fail them and they are yours if anyone's: (i) deleting `hasLegalEnPassant`'s own
      NO_SQUARE early return -- now genuinely equivalent BECAUSE guard (a) catches it
      (`board[-1]` is `undefined !== EMPTY`), where on the first pass it was equivalent for a
      different reason; (ii) moving both guards INSIDE the EP_CAPTURE_SIDES loop -- same answers,
      same keys, strictly more work. Neither is pinned by anything in the repo. Three further
      survivors (guards swapped, guards merged into one `||` line, `<= EMPTY` instead of
      `!== EMPTY`) are equivalent AND cost-neutral; the merged-into-one-line form is safe, which is
      worth knowing because two OTHER one-line merges are NOT and are now pinned.
    - THE ENGINEER FLAGGED ITS OWN FIRST BENCHMARK PROTOCOL AND DISCARDED IT: a null control on a
      structurally-zero delta read up to 1.26x. It re-ran with 9 alternating rounds and medians and
      the control fell to +0.06 / +0.20 ns. That self-report is honest and is the third protocol on
      this ticket to hit the same wall. This gate re-measured NO nanosecond and takes no view on the
      numbers; the instrument caution is passed on, not endorsed.

  EXITED 2026-08-03 by Security/NFR on a PASS verdict: ABC-011 -> Ready for UAT. In Security/NFR
  1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; NO LIMIT APPROACHED, no override taken, no written reason
  owed. The In Security/NFR exit is the one board move this role owns. Nothing was merged and
  nothing was deployed -- a human holds both.

  VERDICT: PASS, with three accepted risks each carrying a named owner. Gate run against
  security.asvs_level L1 and security.block_on `high`. NO security finding at any severity, and
  nothing at or near `high`, so nothing blocks.

  NFR-005 RE-MEASURED INDEPENDENTLY -- NOTHING WAS ACCEPTED FROM THE ENGINEER'S OR QE'S FIGURES.
  Own scripts, own baseline (4c6ed7d extracted with `git archive`), both trees imported in ONE
  process, 300k iterations per cell after a 50k warm-up, each cell interleaved forward AND backward
  so drift hits both variants equally, two samples. Apple M3 (Mac15,13) / Node v24.12.0 /
  darwin-arm64 -- `UNKNOWN - verify` on any other hardware. The machine-independent quantity is the
  ratio to the baseline tree measured in the same process, never the absolute nanoseconds.

    position                       merged(4c6ed7d)   ABC-011           ratio          bar
    startpos      -- NO ep square  296.8-340.7 ns    297.2-298.4 ns    0.872-1.006    <= ~450  MET
    kiwipete      -- NO ep square  318.4-334.0 ns    323.5-330.9 ns    0.969-1.039    <= 432-459 MET
    position-3    -- NO ep square  165.8-165.8 ns    166.2-166.8 ns    1.003-1.007    not a bar posn
    ep set, no capture at all      309.1-310.1 ns    307.4-378.2 ns    0.991-1.224    not a bar posn
    ep set, capture AVAILABLE      300.6-301.6 ns    417.6-420.8 ns    1.385-1.400    worst case, < 1.5x
    the divergence FEN (sparse)    147.8-148.2 ns    260.6-261.0 ns    1.759-1.766    not a bar posn

  BOTH BAR POSITIONS MET WITH ROOM: startpos 297-298 ns against ~450, kiwipete 324-331 ns against
  432-459. HOW MINE CROSS-CHECK THEIRS, stated rather than glossed: my worst-case per-call shape
  (1.385-1.400x) lands BETWEEN the dev hop's 1.357-1.383x and the design hop's 1.45-1.48x, which
  resolves the spread this column was asked to adjudicate -- the three runs agree that the shape is
  real, is the worst on the table, and is comfortably under 1.5x. My divergence-FEN ratio
  (1.759-1.766x) sits just under the dev hop's 1.771-1.858x and confirms their reading of it: an
  artefact of a 5-piece board where the base key is half the normal cost, not a bar position, and
  its ABSOLUTE cost (261 ns) is below the bar's own anchor value. One cell of mine is noisy and is
  reported as measured rather than smoothed: "ep set, no capture at all" sampled 307.4 and 378.2 ns
  on the two runs. It is not a bar position and both samples sit far under any ceiling.

  THE SUB-BAR ("the no-ep-square path is not made slower at all") HOLDS, AND WALL CLOCK IS THE WRONG
  INSTRUMENT FOR IT. My own timings have the shipped tree 1.003-1.007x of baseline at position-3 --
  inside noise, but "not slower AT ALL" is a claim no timing run can settle at that resolution. The
  claim is STRUCTURAL and that is how it was verified: on a no-ep node `position.epSquare !==
  NO_SQUARE` is false, `&&` short-circuits, and the executed work is byte-for-byte what the baseline
  executed. Re-spied independently with my own counting shim through a copy of zobrist.ts whose body
  was `cmp`-verified identical to the shipped file apart from its two import specifiers, over a
  depth-3 walk of all six perft roots:
    nodes hashed 277,955 / ep-set 17,663 / hasLegalEnPassant calls 17,663 /
    calls on the 260,292 NO-EP nodes: 0 / max calls per zobristKey call: 1
  Identical to the Engineer's figures to the node. Three roles now agree on numbers none copied.

  THE GAP BOTH PRIOR ROLES HANDED FORWARD IS PINNED, NOT WAIVED -- src/zobrist.nfr.test.ts, on the
  ABC-020 precedent, in its OWN FILE so the hoisted vi.mock factory re-routes the module graph for
  nothing else (the same reason src/gameend.nfr.test.ts is its own file). Four assertions, and each
  was PROVEN to fail rather than assumed to:
    - zero hasLegalEnPassant calls on four no-ep positions  -> kills Z1 (reorder) and Z4 (drop the
      guard). Both previously survived a 189-test suite.
    - exactly one call when an ep square IS set             -> stops the guard over-suppressing.
    - predicate returns false AND touches no board byte, on TWO no-ep probe FENs -> kills L11.
  The second L11 FEN is this gate's own contribution and it is why the byte assertion is not
  redundant: on `4K3/8/8/8/8/k7/p7/R7 b - - 0 1` the a2 pawn's departure discovers the a1 rook on
  the a3 king, so under L11 the predicate still returns the CORRECT `false` -- and still leaves a
  stray pawn on off-board square 15. There the board assertion is the only one that bites; verified
  by running it. Suite 189 -> 193, skip count still 0, lint/typecheck/build all exit 0.

  THE OFF-BOARD WRITE IS A CORRECTNESS DEFECT, NOT A MEMORY-SAFETY ONE, AND THE DISTINCTION WAS
  MEASURED RATHER THAN ASSERTED. QE asked this column to judge it and the answer is neither
  inflation nor a wave-off. `Position.board` is a Uint8Array(128); the stray write lands on INDEX
  15, which is INSIDE the allocation -- "off-board" here is the 0x88 encoding's LOGICAL predicate
  ((sq & 0x88) !== 0), not a memory bound. And the runtime discards out-of-allocation typed-array
  writes outright: probed directly, `probe[-1] = 9` and `probe[999] = 9` both read back `undefined`
  with length and byteLength unchanged. There is no pointer arithmetic, no adjacent memory and no
  overflow available in this runtime, so ASVS V1.4.1 (memory-safety / buffer overflow) is
  NOT-APPLICABLE here -- and it is an L2 row in any case, outside this project's L1 tier.
  WHAT IT IS INSTEAD, and why it still earned a test: it breaks an invariant a LIVE consumer leans
  on. `kingSquareOf` finds the king with `position.board.indexOf(KING | colour)` across all 128
  bytes, and its own doc comment cites "off-board squares are EMPTY" as the reason that scan is
  sound. This mutant writes a PAWN byte, so it does not fool that scan -- but it is the invariant
  the scan depends on, and the tidy-up that produces it left 189/189 green. That is a correctness
  hazard worth a guard, which is what it now has.

  QE'S NEW DEFECT -- zobristKey PERMANENTLY corrupts a position whose ep square is semantically
  inconsistent -- IS RULED MEDIUM AND DOES NOT BLOCK. Reproduced by this gate on all three of QE's
  FENs against the shipped tree, and against the 4c6ed7d baseline for contrast (unchanged on all
  three, so the property is genuinely NEW since ABC-011). QE's fairness to the Engineer was checked
  and holds: on the first two FENs the ruled ORACLE `legalMoves(p).some(...)` corrupts identically,
  so that pair is pre-existing in generateMoves + apply and merely reproduced faithfully; on the
  third, `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`, generateMoves does NOT offer the ep move, the oracle
  returns false and leaves the position clean, while hasLegalEnPassant returns true and corrupts --
  a GENUINE predicate-vs-oracle divergence, confirmed here. REACHABILITY was verified independently
  rather than accepted: the only two writes to epSquare in src/ are fen.ts:175 (parseFen, which
  validates the field is a square NAME and nothing about the board) and apply.ts:139, which sets it
  to `(move.from + move.to) / 2` only on a pawn double push -- geometry that guarantees both the
  capturable pawn and the empty target. So NO position reachable by play can trigger it; the trigger
  class is invalid-FEN only, which is ABC-010's surface and which this ticket's `## Out of scope`
  carries explicitly. MEDIUM rather than LOW because a function whose header promises the position
  comes back "as they found it" now silently and permanently mutates a caller's data on that class,
  and a maintainer will read the header as a guarantee; NOT HIGH because it is unreachable by play,
  has no untrusted-input path in a library with no entry point until EPIC-006, and carries no
  security consequence. Owners: BA/PM to cut it or fold it into ABC-010; Architect/Design to rule
  the predicate-vs-oracle divergence, which is a definition question and not an implementation one.

  SECURITY: NO FINDING AT ANY SEVERITY. The ticket's "No security trigger" is upheld on inspection
  rather than quoted. src/ has no eval / new Function / vm / child_process / require, no fs, no
  http, no fetch, no process.env, no os -- grepped, all absent. Zero runtime dependencies and
  package.json + the lockfile byte-untouched by this ticket, so no new supply-chain surface. No
  secret-shaped string anywhere in the 4c6ed7d..HEAD diff. No auth, no session, no privilege, no
  personal data, no PII, no GDPR surface, no logging (and none is required at L1). compliance_regime
  is empty, so no Compliance Officer hop is owed.
  THE ASVS L1 TIER IS 70 REQUIREMENTS AND MOST ARE NOT-APPLICABLE BY ABSENCE OF THE SURFACE THEY
  NAME -- said plainly rather than padded into a table of passes: all 13 of V6 Authentication, all 6
  of V7 Session Management, all 4 of V8 Authorization, all 4 of V9 Tokens, all 5 of V10 OAuth/OIDC,
  all 8 of V3 Web Frontend, all 4 of V5 File Handling, all 3 of V12 TLS and both V14 rows have no
  surface in a dependency-free chess library with no entry point. FOUR ROWS ARE WORTH NAMING RATHER
  THAN DISMISSING:
    - V11.4.1 (approved hash functions). NOT-APPLICABLE, and named because it is precisely the row a
      scanner or a hurried reviewer WOULD flag: this change sits in a module called "hashing" that
      seeds a table from splitmix64 with a hardcoded constant. Zobrist keys are a position-identity
      key for game logic, not a "general cryptographic use case" -- no signature, no HMAC, no KDF,
      no random bit generation, and no security decision rests on collision resistance. The fixed
      seed is a deliberate REQUIREMENT (reproducible keys across runs) and the module documents why
      Math.random is avoided. Flagging it would be gold-plating; ignoring it silently would leave
      the next reviewer to re-derive it.
    - V2.1.1 / V2.2.1 (documented input-validation rules; input validated to business expectations).
      PARTIALLY MET and this is the row that genuinely touches the defect above. FEN is this
      library's one externally-authored input format; parseFen validates STRUCTURE (it throws
      FenError) but not SEMANTIC consistency. Pre-existing, already ticketed as ABC-010, and
      explicitly carried by this ticket. ABC-011 does not create the gap -- it adds one new
      consequence to it. Owner: ABC-010.
    - V15.1.1 / V15.2.1 (documented remediation timeframes for third-party components). NOT MET at
      the project level: no such policy document exists. SEVERITY OVERRIDDEN from the L1 default of
      `high` to `low`, with the reason stated as the hard limits require: the project has ZERO
      runtime dependencies, this change adds none, and a documentation-policy gap the change neither
      touches nor degrades is not a defect of this change. Recorded so it is visible rather than
      dropped; it does not block ABC-011. Owner: Architect/Design, at EPIC-006 packaging.
    - V13.4.1 (deployed without source-control metadata). DEFERRED, not passed -- nothing is
      deployed and nothing is packaged until EPIC-006. Recorded rather than marked green.

  WHERE THE CHANGE TOUCHES DATA IT DID NOT TOUCH BEFORE, which is where new exposure hides and is
  the one genuinely new thing here: zobristKey used to READ the board and nothing else; it now
  WRITES it transiently through makeMove/unmakeMove on the ~1-2% of nodes carrying a legal ep
  capture. Both defects on this desk are instances of exactly that, which is the honest reading of
  the risk this design took on. Purity on the reachable population is intact and now pinned by QE's
  277,949-node walk; this gate re-verified byte purity across all six of its own benchmark positions
  (board and toFen both identical) and confirmed the two out-of-play classes above.

  ADR-0005 IS STILL `proposed` and no agent may mark it `accepted`; this gate did not. The code it
  describes is merged on this branch, which is worth a human's attention and is carried, not closed.

  Gates re-run by this gate on this branch WITH the new guard in place: 193 pass (was 189) / 0
  skipped / lint, typecheck and build all exit 0 (2 pre-existing biome config-schema infos, present
  at 4c6ed7d). Five throwaway harness scripts in the session scratchpad, NOT committed, every number
  transcribed here with its machine. No PR exists and none was invented -- this repo has no git
  remote.
-->

<!--
  ENTERED 2026-08-03 from QE/E2E's PASS. In Review 1/3 -> 0/3, In Security/NFR 0/2 -> 1/2; no limit
  approached, no override taken. See the exit comment under `## In Review` for the full QE record.

  WHAT THIS COLUMN INHERITS, so the gate starts ahead of where QE did rather than rediscovering it.

  1. NFR-005 IS THIS COLUMN'S AND QE MEASURED NONE OF IT. Deliberately, on the ABC-020 precedent:
     two roles measuring the same bar is waste. Unverified from QE and inherited as reported by the
     Engineer, all on Apple M3 / Node v24.12.0 / darwin-arm64 (`UNKNOWN - verify` elsewhere):
       startpos, no ep      302.9-306.5 ns  (bar ~450)      0.963-1.008x merged
       kiwipete, no ep      309.1-315.6 ns  (bar 432-459)   0.984-1.015x merged
       ep set, capture available            worst-case per-call shape 1.357-1.383x
       amortized, 120,000-node pool         0.9948-1.0218x merged
     The design hop recorded 1.45-1.48x for the same worst-case shape; the dev hop measured lower.
     Both are on the record so this gate can adjudicate the spread rather than discover it.

  2. THE SUB-BAR ("the no-ep-square path is not made slower at all") IS PINNED BY NOTHING IN THE
     REPO, AND QE UPHELD THE ENGINEER'S DECISION TO LEAVE IT HERE -- on evidence, not deference.
     Three mutants survive a 189-test suite and they are ONE gap:
       Z1  `if (hasLegalEnPassant(position) && position.epSquare !== NO_SQUARE) {`   in zobrist.ts
       Z4  `if (hasLegalEnPassant(position)) {`                                      in zobrist.ts
       L11 delete `if (target === NO_SQUARE) return false;`                          in legal.ts
     All three are BEHAVIOUR-EQUIVALENT -- verified, not assumed: each leaves 189/189 green and none
     changes any key on any input, because the predicate's internal guard makes the reordered
     condition compute the same thing. Only COST moves, and only on the majority path. No assertion
     about a key can ever fail them, so a behavioural test is the wrong tool: the instrument is a
     SPIED CALL COUNT, the shape src/gameend.nfr.test.ts already has and the shape this column wrote
     for NFR-001 on ABC-020. The Engineer measured it out-of-repo (0 calls over 260,292 no-ep
     nodes); nothing in src/ holds it.
     THE FACT NEITHER PRIOR HOP HAD: Z1 AND L11 TOGETHER -- the reorder plus deleting the guard that
     then LOOKS redundant, an ordinary tidy-up rather than a contrived mutant -- still leave 189/189
     GREEN, and on `4k3/8/8/8/8/8/p7/4K3 b - - 0 1` one zobristKey call then writes a white pawn
     onto OFF-BOARD SQUARE 15, breaking the invariant src/position.ts states in its own comment
     ("Off-board squares stay EMPTY and are never read"). Latent rather than live -- zobristKey and
     toFen both skip off-board squares -- but it turns the reorder from a cost regression into a
     correctness one, and every test in the repo is blind to it.

  3. ONE NEW DEFECT, NAMED BY QE AND NOT FIXED, WHICH THIS COLUMN MAY WANT TO WEIGH: since ABC-011,
     zobristKey PERMANENTLY corrupts a position whose ep square is semantically inconsistent (three
     reproductions in the In Review exit comment and in QE's `claim` note). Trigger class is
     semantically invalid FEN only -- the same class ABC-009 needs and ABC-010 exists to close, both
     explicitly carried by this ticket -- and 277,949 reachable nodes are 0 impure. NO SECURITY
     TRIGGER is claimed for it: no injection sink, no trust boundary, no privilege, no data
     exposure. It is a correctness/robustness item pointing at ABC-010, and the ticket's own
     Security/NFR triggers section already says "No security trigger. ... Do not inflate it."

  4. NFR-001 IS EXPLICITLY NOT AT RISK and `npm run perft` is NOT the oracle here -- src/perft.ts
     never imports zobrist, and the hashing module's only production consumer is src/gameend.ts.
     Stated on the ticket, re-confirmed by QE's own rebuild of the module graph, and repeated so
     nobody spends 38 s on the deep lane believing it proves something.

  Previously 2026-08-01: EXITED by Security/NFR on a PASS verdict: ABC-020 -> Ready for UAT. WIP 1/2 -> 0/2;
  no limit approached, no override taken. The column is empty again.

  WHAT THIS COLUMN ADJUDICATED, and the result. A10's three bars, all re-measured independently --
  nothing was accepted from the Engineer's report and nothing was quoted from it:

    legalMoves calls per gameStatus   EXACTLY 1, across sixteen call shapes         PASS
    zobristKey calls per gameStatus   <= 1: exactly 1 when the counts map is
                                      consulted, 0 bare, 0 when a cheaper branch
                                      decides                                       PASS
    gameStatus(startpos, emptyMap)    2.13-2.26 us over three fresh processes
                                      = 0.56x-0.60x of the 3.78 us bar, and
                                      0.98x-1.01x of the pre-ABC-020 tree measured
                                      in the SAME process                           PASS

  Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify` on any other hardware.
  Call counts were SPIED with instrumented throwaway copies of legal.ts + zobrist.ts outside the
  repo, gameend.ts cmp-verified byte-identical; timings load both trees in ONE process and measure
  them interleaved A,B,B,A so drift hits both equally. Primitives cross-check to three earlier
  agents' published figures (zobristKey 281-293 ns vs 288-306; legalMoves 2.02-2.16 us vs 1.83-2.22).

  ONE CORRECTION, AND IT IS TO THE BAR RATHER THAN THE CODE. The 3.78 us figure is a START-POSITION
  number and plans/nfr-catalog.md did not say so. gameStatus is dominated by its one legalMoves
  call, which costs 2.1 us at startpos and 3.2 us in a middlegame, so gameStatus(kiwipete, emptyMap)
  measures 5.30-5.47 us on this branch and 5.29-5.85 us on MERGED code -- 1.4x the "bar" on both
  trees. Read as an absolute ceiling it indicts the baseline, not this change. The catalog row now
  carries its position and names the machine-independent quantity (the ratio to the same position on
  the baseline tree: 0.94-1.01). Third time this file has learned the same lesson, after NFR-005's
  "in a middlegame position" and NFR-002's ply count.

  QE'S ORDERING SUSPICION: CHASED, CONFIRMED, AND IT GENERALISES. This is the substantive result.
  Moving the 150-ply clock check below the fivefold check leaves gameend.test.ts 45/45 green, and
  spied, it takes a counts-map caller at clock >= 150 from 0 to 1 zobristKey calls. Two precisions,
  because they decide the severity: the bar AS WRITTEN (at most 1) is NOT broken -- the mutant still
  measures max 1 -- so this is a durability gap and not a bar failure; and the cost is one key read,
  281-293 ns, on a terminal position reachable at most once per game (the wall-clock delta measured
  129 ns, inside this harness's +-340 ns noise floor). On its own it would not have been worth a
  ticket.

  What made it worth acting on is that two FURTHER mutations show all three bars were held by
  NOTHING in this repository:

    a second legalMoves() call                       all 45 tests green
    two zobristKey reads instead of the shared local all 45 tests green
    the 150-ply check below the fivefold check       all 45 tests green   (QE's)

  The doubled generation is the serious one: it doubles the cost of the single hottest call in
  EPIC-004's search and every value assertion in the suite stays green. plans/nfr-catalog.md had
  already warned that these bars "must be spied, not inferred" -- the warning had no teeth.

  CLOSED, AND THIS COLUMN OWNED THE CALL. Both prior roles handed the decision here in writing: the
  Engineer's decision note recorded keeping the spy out of the suite as "reversible in one small
  commit if Security/NFR wants the guard permanent", QE declined because "a call-count spy is this
  column's instrument, not QE's", and this block previously read "that is the call to make here".
  Made: src/gameend.nfr.test.ts, three spied assertions, one per bar. NO production code changed and
  no existing test touched. The Engineer's objection -- a vi.mock factory is hoisted to file scope,
  so it would re-route the module graph for all 45 tests in gameend.test.ts to buy three assertions
  -- was correct, and a SEPARATE FILE dissolves it rather than overruling it; that option was not on
  the table when the judgment was made. Verified one mutant per assertion:

    second legalMoves call  -> "bare, in progress: expected legalMoves 1 times, got 2"
    two zobristKey reads    -> "expected zobristKey 1 times, got 2"
    the reorder             -> "expected zobristKey +0 times, got 1"

  LEFT UNPINNED ON PURPOSE, and QE's reasoning survives intact. Five occurrences AND clock >= 150
  both apply and the code reports seventy-five-move; pinning an arbitrary choice between two rules
  that both hold is how a later correction becomes a "regression". The zero-key assertion therefore
  uses a counts map holding ONE occurrence, where no repetition rule is in play at all -- it kills
  the reorder purely on COST and says nothing about which rule names the tie. EPIC-006's result
  screen still decides that.

  ALLOCATION. State (c) -- in progress, nothing claimable, the common case at every search leaf --
  measures 1.33 B/call on this branch and 1.33 B/call on the pre-ABC-020 tree over 1,000,000-call
  windows with zero GC events inside them: indistinguishable, so the branch adds none. Worth stating
  precisely: state (c) is not literally allocation-free and never was (merged code already allocates
  the returned literal), and src/gameend.ts:161 allocates `const draws = []` unconditionally, on the
  state-(c) path too -- it costs nothing because TurboFan sinks it into the branch where it escapes,
  which is the path a hot search leaf runs. State (b) allocates the DrawClaims the ratified shape
  asks for (~+2.3 B/call measured, a lower bound), and state (b) means a claim genuinely exists.

  STRUCTURAL. No new dependency edge (the import list is byte-identical to 65cb789's), no new state
  on Position (src/position.ts unchanged), and no dependency change at all -- package.json and the
  lockfile are untouched and the project has zero runtime dependencies.

  THE SECURITY HALF IS EMPTY, AND IT WAS RE-CHECKED RATHER THAN ACCEPTED. gameStatus is a pure
  function of an in-memory Position and an optional Map: no interpreter, no parser, no file, no
  socket, no process boundary, no credential, no persistence, no user data. Working the L1 tier of
  the ASVS checklist (70 requirements at security.asvs_level L1), every applicable row is
  not-applicable by ABSENCE of the surface it names. Two are worth naming rather than dismissing:
  V2.2.1 (gameStatus validates nothing and is right not to -- its contract is a well-formed
  Position; FEN semantics are ABC-010's and the integrity defect on this path is ABC-009, carried
  and ticketed) and V11.4.1 (zobristKey is a repetition hash, not a security control -- nothing
  authenticates or authorizes on it, and its collision behaviour is ABC-011's correctness question).
  NO FINDING AT ANY SEVERITY, and nothing at or near security.block_on: high. The consequence of a
  defect here is a wrong chess result, which is what the whole ticket is about -- not inflated, not
  deflated.

  ACCEPTED RISKS, EACH WITH AN OWNER. (1) The us figure is a single-machine number, UNKNOWN - verify
  elsewhere; the new guard is the machine-independent half, and no wall-clock assertion was added to
  the suite because it would pass or fail on the machine that runs it -- owner EPIC-004's non-M3
  spike, which already carries the same obligation for NFR-005. (2) The un-optimized (cold) cost of
  the state-(c) empty-array literal is UNKNOWN - verify: measured and inconclusive, and irrelevant at
  a hot leaf -- owner EPIC-004. (3) ABC-009 and ABC-011 remain carried, not owned -- owners their
  own tickets.

  NOT RE-LITIGATED HERE. QE's four LOW defects and three unsettled items stand as recorded: A5/A8's
  Given wording and FIDE 9.6.1's "consecutive" are BA/PM's, and the dead GameResult alias is
  Architect/Design's. This column adding an opinion to them would be noise.

  GATES, re-run on this branch with the guard in place: npm test 174 passed / 8 files (was 171),
  skip count 0, npm run lint exit 0 (the same 2 pre-existing biome config infos), npm run typecheck
  exit 0, npm run build exit 0, src/gameend.ts still 100% stmt/branch/func/line.

  Still NO git remote, so still no PR to open; the work sits on the local branch
  grugops/ticket-to-pr-ABC-020. A HUMAN HOLDS MERGE AND DEPLOY. Merge order is still load-bearing:
  this merges BEFORE ABC-019 and ABC-016.

  ---
  ENTERED 2026-08-01 by QE/E2E on a PASS verdict. WIP 0/2 -> 1/2; no limit approached, no override
  taken. FIRST OCCUPANT of this column since it was cleared -- the ABC-004..007 stack passed
  through it on 2026-07-24.

  WHAT IS OWED HERE, and it is a short list because QE deliberately did not touch it. ABC-020's
  acceptance criterion A10 is "the cost bar in `Security / NFR triggers` holds when measured", and
  that is the whole of what this column has to adjudicate:

    - legalMoves calls per gameStatus stays EXACTLY 1;
    - zobristKey calls per gameStatus stays AT MOST 1 (fivefold and threefold share one key read);
    - gameStatus stays within 1.5x of its measured 2.52 us per call (bar: <= 3.78 us).

  The Engineer reports these SPIED, not inferred, on Apple M3 / Node v24.12.0 / darwin-arm64:
  legalMoves = 1 across ten call shapes, zobristKey <= 1 and 0 when the caller is bare or an earlier
  branch decides, cost 2.17-2.24 us. `UNKNOWN - verify` on any other hardware. QE did NOT re-measure
  any of it -- two roles measuring the same thing is waste, and nothing about it looked suspicious.

  ONE THING QE FOUND THAT BEARS ON THIS COLUMN. Mutation testing showed that moving the 150-ply
  clock check BELOW the fivefold check kills no test in the suite. That mutation would break the
  bar-2 property the Engineer measured -- "zobristKey = 0 when the clock decides", since the key
  read would then happen before the clock short-circuits -- and nothing would notice. QE did not add
  that guard: a call-count spy is this column's instrument, not QE's, and the Engineer's decision
  note records deliberately keeping the spy out of the permanent suite as reversible in one small
  commit if this column wants it. That is the call to make here.

  The ticket also records "No security trigger": no injection sink, no trust boundary, no privilege,
  no data exposure. The consequence of a defect in this module is a wrong chess result -- which is
  what the whole ticket is about, and neither to be inflated nor deflated.
-->

## Ready for UAT (WIP 1/4)

<!--
  RE-ENTERED 2026-08-03 from Security/NFR's SECOND-PASS verdict, the second time this ticket has
  entered this column. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4; no limit approached,
  no override taken. The full gate record -- the independently re-measured NFR-005 table with its
  identity null control, the sub-bar's spied call counts, the MEDIUM ruled CLOSED with its
  336,000-input hunt against the real pre-guard tree as control, the reasoned DECLINE on the two
  cost-shaped mutants, and the ASVS L1 judgment -- is the EXIT comment under `## In Security/NFR`.

  WHAT IS DIFFERENT FROM THE FIRST TIME THIS TICKET SAT HERE, stated plainly because it is the only
  question the owner asked: THE MEDIUM PURITY DEFECT THE OWNER DECLINED TO MERGE IS CLOSED, and
  closed on this column's own evidence rather than accepted from the two gates before it -- all 13
  known reproductions pure, 336,000 adversarial inputs at 0 impure against a control that reads
  14,341 on the identical population, plus a structural precondition argument. The accepted risk
  that used to read "zobristKey permanently corrupts a semantically-inconsistent ep position" is
  GONE from the list rather than reworded.

  AND ONE THING THE OWNER SHOULD KNOW BEFORE MERGING: an earlier, interrupted attempt at this
  re-gate had already moved this board here with a PASS while publishing no typed note at all. That
  state was not admissible and was not left standing -- the uncommitted prose was reverted and this
  verdict was re-derived from scratch. It landed in the same place, but it now has notes behind it.

  UAT IS STILL DEFERRED TO EPIC-006 AND STILL RECORDED AS DEFERRED RATHER THAN PASSED. Nothing
  about that changed: no runnable game exists, so there is no surface a human can exercise.
-->

- [ABC-011] Zobrist key hashes en passant when no capture is available  (owner: unassigned — awaiting human merge, since: 2026-08-03, size: M, P1, epic: EPIC-001, branch: grugops/ticket-to-pr-ABC-011; SECOND pass — all three gates PASS, MEDIUM defect CLOSED; UAT deferred → EPIC-006; a human holds merge)

<!--
  SENT BACK 2026-08-03 by the Orchestrator on the project owner's explicit instruction: "fix the
  medium defect before merging". ABC-011 moved Ready for UAT -> In Design. Ready for UAT 1/4 -> 0/4,
  In Design 0/2 -> 1/2. No limit approached, no override taken.

  THIS IS A BACKWARD MOVE AND IT IS RECORDED AS ONE. The ticket had passed all three gates and was
  waiting only on a human merge. The owner declined to merge with the defect carried, which is the
  owner exercising the decision autonomy=pr reserves for them. The gates were NOT wrong to pass it:
  QE named the defect and Security/NFR ruled it MEDIUM-and-not-blocking on reachability grounds
  (unreachable by play; `apply.ts:139` derives epSquare as the double-push midpoint), and both
  recorded it in the open rather than absorbing it. The owner weighed the same facts and chose
  differently. That is what "accepted risk with an owner" is for -- the owner is the one who accepts.

  WHY In Design AND NOT In Development. The defect is `zobristKey` permanently dirtying a position
  whose ep square is semantically inconsistent, and QE could not settle WHY the shipped predicate
  and the ruled oracle disagree on `4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1` -- it flagged that as needing
  an Architect ruling, not a dev fix. An engineer who guesses the definition writes a fix against a
  contract that can be rejected. Same reason this ticket entered In Design the first time.

  IT IS A DEFECT AGAINST THIS TICKET'S OWN RATIFIED CONTRACT, so no new ticket is cut and this is not
  scope growth: the `### ANSWERED` block's rule 5 says the predicate "must leave the position
  byte-identical on return". On this input class it does not. `## Out of scope`'s invalid-FEN line
  (ABC-010's surface) governs what the predicate must ANSWER, not whether it may corrupt what it was
  handed. Security/NFR's routing of a possible follow-on ticket to BA/PM stands for anything that
  turns out to be genuinely ABC-010's.

  ---
  ENTERED 2026-08-03 from Security/NFR's PASS. In Security/NFR 1/2 -> 0/2, Ready for UAT 0/4 -> 1/4;
  no limit approached, no override taken. See the exit comment under `## In Security/NFR` for the
  full gate record -- the independently re-measured NFR-005 table, the sub-bar's spied call counts,
  the four assertions added in src/zobrist.nfr.test.ts and the ASVS L1 result.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED -- the same posture
  ABC-020 and the ABC-004..007 stack were given, for the same unchanged reason. ABC-011 is
  rules-core-only work inside a library with no entry point: it renders nothing, prompts for
  nothing, and `AGENTS.md` records both the dev command and E2E as `UNKNOWN - verify` because no
  runnable game exists until EPIC-006. There is no surface a human can exercise, so there is no UAT
  to run and marking one passed would be a fabrication. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  WHAT A HUMAN WILL BE ABLE TO EXERCISE ONCE EPIC-006 SHIPS, and what UAT should then cover: that a
  game repeating a position reached via a double push is offered the threefold draw it is entitled
  to -- the exact case this ticket fixes, since the placement after 1.e4 is the placement after
  1.e3 ... 2.e4 and before ABC-011 those two hashed differently and never joined a count. The
  regression side is equally checkable by hand: a repetition where the ep capture is genuinely
  available must NOT be collapsed, and no draw may ever be offered that was not earned. The error
  direction to watch is unchanged -- a legitimate draw arriving late is the failure this ticket
  removes; a FALSE draw is the failure it must never introduce.

  THREE ACCEPTED RISKS RIDE INTO UAT WITH THIS TICKET, each with a named owner, none blocking:
    1. Every timing figure on this ticket is ONE MACHINE (Apple M3 / Node v24.12.0 / darwin-arm64)
       and `UNKNOWN - verify` anywhere else. The machine-independent quantity is the ratio to the
       baseline tree in the same process. Owner: EPIC-004's non-M3 spike, which already carries the
       identical obligation for NFR-005's depth-7 PROVISIONAL marker.
    2. zobristKey permanently corrupts a position whose ep square is semantically inconsistent
       (MEDIUM). Invalid-FEN trigger class only, unreachable by play, carried by `## Out of scope`.
       Owners: BA/PM to cut or fold into ABC-010; Architect/Design for the oracle divergence.
    3. The amortized per-node figure is measured on a perft-table population, NOT on a search's node
       distribution, which stays `UNKNOWN - verify` until EPIC-004 exists. Owner: EPIC-004.
-->

<!--
  ENTERED AND EXITED. Entered 2026-08-01 by Security/NFR on a PASS verdict; exited 2026-08-02 when
  the Orchestrator moved ABC-020 to Done on merge. WIP 0/4 -> 1/4 -> 0/4; no limit approached, no
  override taken. First occupant of this column since it was cleared on 2026-07-24.

  UAT IS DEFERRED TO EPIC-006, AND IT IS RECORDED AS DEFERRED RATHER THAN PASSED. ABC-020 is
  rules-core-only work: it renders nothing and prompts for nothing (its own `## Out of scope` sends
  the interaction to ABC-021, the panel row to ABC-016, the prompt verb to EPIC-003 and the result
  screen to EPIC-006). There is no surface a human can exercise until a runnable game ships, so
  there is no UAT to run and marking one passed would be a fabrication. This is exactly the posture
  ABC-004..007 were given on 2026-07-24 and the reason is unchanged. The traceability UAT cell reads
  "UAT deferred — EPIC-006" so the gap stays visible.

  What a human WILL be able to exercise once EPIC-006 ships, and what UAT should then cover: that a
  threefold repetition or a 100-ply clock offers a claim instead of ending the game, that declining
  it and playing on is possible (the G-1 line's Re8# is the acceptance case), that the claim is
  offered to the side to move and to nobody else, and that a game with no claim ever made still
  ends -- on fivefold for a caller with history, on the 75-move backstop for one without.

  ---
  Cleared 2026-07-24: the ABC-004..007 stack was merged to main and moved to Done. UAT
  execution for the EPIC-001 rules core is DEFERRED, not skipped — it is a pure library with
  no surface a human can exercise until EPIC-006 packaging ships a runnable game. The
  traceability UAT cells read "UAT deferred — EPIC-006" so the gap stays visible rather than
  being quietly marked passed.
-->

## In UAT (WIP 0/4)

## Ready to Release (WIP 0/4)

## Done (WIP unlimited)

- [ABC-020] FIDE 9.2/9.3 draws become claimable, FIDE 9.6 backstops land with them  (merged: 2026-08-02 by fast-forward d53ce31 → cb62c9f; 174/174 green re-verified ON main; QE PASS after 13 mutations, sec/NFR PASS on all three bars re-measured; UAT deferred → EPIC-006; its one open question — FIDE 9.6.1 "consecutive" — CLOSED 2026-08-02 as conformant, no code change owed)
- [EPIC-001] Chess rules core  (complete: 2026-07-24, decomposed ABC-001..ABC-007 + ABC-008 spike, all merged; rule-complete and perft-proven)
- [ABC-008] SPIKE — Node search throughput  (merged: 2026-07-23, outcome: GO WITH CONSTRAINT, RISK-002 answered)
- [ABC-001] Position state and FEN round-trip  (merged: 2026-07-23, 27 tests, ADR-0001)
- [ABC-002] Pseudo-legal move generation for all piece types  (merged: 2026-07-23, 22 tests, QE PASS no defects)
- [ABC-003] Apply and undo a move with full state restoration  (merged: 2026-07-23, 15 tests, QE PASS no defects, src/apply.ts 100% coverage)
- [ABC-004] Special moves — castling, en passant, promotion  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-005] Legal move filtering and attack detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS; UAT deferred → EPIC-006)
- [ABC-006] Perft verification harness  (merged: 2026-07-24, deep perft 32/32 exact, RISK-001 retired, NFR-001 ~6.2M nps; UAT deferred → EPIC-006)
- [ABC-007] Game-end detection  (merged: 2026-07-24, review gate PASS, QE PASS, sec/NFR PASS, EPIC-001 rule-complete; UAT deferred → EPIC-006)

<!--
  ABC-020 merged 2026-08-02. THREE stacked branches landed in ONE fast-forward, because they were
  a single linear chain and nothing had diverged: main d53ce31 -> cb62c9f, 27 commits, no merge
  commit created.

    main
     └─ grugops/architecture-audit-2026-07-29     ADR-0002 + ADR-0003 ratified; ABC-009/010/011 cut
         └─ grugops/epic-to-tickets-EPIC-002      EPIC-002 decomposed; ADR-0004 ratified; ABC-020/021 cut
             └─ grugops/ticket-to-pr-ABC-020      ABC-020 implemented + gated

  Verified BEFORE the merge (on the tip) and AGAIN AFTER it (on main): 174/174 green, 0 skips,
  lint + typecheck + build all exit 0. Re-verifying on main is the ABC-004..007 precedent and it is
  the only check that catches a merge which breaks something no branch broke on its own.

  ALL NINE branches in this repo are now contained in main; `git branch --no-merged main` is empty.
  No branch was deleted -- that is the owner's call, not an agent's.

  BRANCHES DELETED 2026-08-02 on EXPLICIT owner instruction ("validate if these branches have been
  merged and if so then delete each"), which is the owner making the call the line above reserved
  for them. NOT standing authorization: no future branch is deleted without the same instruction.
  Validated BEFORE deleting, per branch, by `git merge-base --is-ancestor <branch> main` plus
  `git rev-list --count main..<branch>` -- all eight returned contained / 0, and
  `git branch --no-merged main` was empty. Deleted with `git branch -d`, the safe form that REFUSES
  an unmerged branch; `-D` was never used, so an unmerged branch could not have been lost even if
  the validation had been wrong. Tips recorded here so they are recoverable independent of the
  reflog, and each was re-confirmed an ancestor of main AFTER deletion:

    grugops/ticket-to-pr-ABC-020           cb62c9f
    grugops/epic-to-tickets-EPIC-002       d6c7e71
    grugops/architecture-audit-2026-07-29  4d00cb1
    grugops/close-out-EPIC-001             d53ce31
    grugops/ticket-to-pr-ABC-007           cd9caae
    grugops/ticket-to-pr-ABC-006           07cfac5
    grugops/ticket-to-pr-ABC-005           8eb8b69
    grugops/ticket-to-pr-ABC-004           ce05df9

  `main` is now the only branch, still at 4a73cf3 -- unmoved by the deletions. NO COMMIT WAS LOST:
  every SHA above is still reachable from main. Nothing was merged and nothing was deployed.

  The merge was performed by an agent on EXPLICIT human instruction ("merge the one open"), the
  same one path that crosses the "humans hold merge" line without breaking it: the human holds the
  DECISION, the agent supplies the keystroke. This is NOT standing authorization; the standing rule
  is unchanged and no future merge happens without the same explicit instruction. Identical to the
  rule already recorded for ABC-001/002/003/008 and for the ABC-004..007 stack.

  MERGED WITH ONE OPEN QUESTION AGAINST IT, recorded so it is not lost: FIDE 9.6.1 says "five
  CONSECUTIVE alternate moves" and this code uses a plain 5-count (QE, `UNKNOWN - verify`, declined
  to assert it from a remembered sentence). The Orchestrator recommended settling it BEFORE the
  merge; the owner merged first. That is a legitimate call -- the error direction is the safe one,
  as with ABC-011 -- but the consequence is now real: closing it means a SECOND change to
  src/gameend.ts on main rather than one change on a branch. It is open question 1 in
  memory-bank/60-progress.md.

  THAT OPEN QUESTION IS CLOSED, 2026-08-02, task `refinement-fide-9-6-1` (Workflow 07): THE CODE
  CONFORMS AND THE SECOND CHANGE IS NOT OWED. BA/PM ruled it against the retrieved Laws text and
  the Orchestrator re-fetched independently before accepting -- Article 9.6.1 at
  handbook.fide.com/chapter/E012023 reads verbatim "the same position has appeared, as in 9.2.2 at
  least five times", and the word CONSECUTIVE occurs ZERO times in the whole 2023 Laws. QE's
  memory was verbatim correct for the 2014 edition, which the 2017 edition replaced: right words,
  wrong edition -- a failure only retrieval can catch, so QE's refusal to assert it is VINDICATED
  rather than overturned. `occurrences >= 5` matches "at least five times" (and `>=` is the right
  direction); `halfmoveClock >= 150` matches 9.6.2's "at least 75 moves ... by each player"; 9.6's
  "if the last move resulted in checkmate, that shall take precedence" is the terminal-check order
  A6 already pins. NO TICKET CUT, no column moved, no override taken. The conditional
  Architect/Design hop -- held in case consecutiveness needed ADR-0002 clause 3's per-ply key list
  -- is CANCELLED rather than deferred; ADR-0002 needs no amendment on this account. Response bytes
  and their sha256 are retained under .grugops/context/refinement-fide-9-6-1/sources/. No gate was
  re-run: nothing under src/ or any test file changed.

  ABC-004..007 merged 2026-07-24 as one fast-forward of the stacked unit
  (main f80a15a → cd9caae, no conflicts), suite re-verified 143/143 green ON main after the
  merge. EPIC-001 (Chess rules core) is now COMPLETE: all 8 tickets closed.

  The merge was performed by an agent on EXPLICIT human instruction — the same one path that
  crosses the "humans hold merge" line without breaking it: the human holds the DECISION, the
  agent supplies the keystroke. This is NOT standing authorization; the standing rule is
  unchanged and no future merge happens without the same explicit instruction. Identical to
  the rule already recorded for ABC-001/002/003/008.
-->


<!--
  Done means MERGED, and as of 2026-07-23 these three are: `main` was created at 8d0a8f7,
  the tip that contained all three stacked branches. In lean mode Done is the terminal
  column — there is no release stage, so `mode=lean` closes the ticket at merge.

  The merge was performed by an agent on explicit human instruction, which is the one path
  that crosses the "humans hold merge" line without breaking it: the human holds the
  decision, not the keystroke. The standing rule is unchanged — no future merge happens
  without the same explicit instruction.
-->

## Blocked (visible, time-tracked)

_Empty. The column's one and only occupant, ABC-013, was unblocked 2026-07-31._

<!--
  CLEARED 2026-07-31 by Architect/Design (subtask `architect-adr0004-ratify`): ADR-0004 is
  `accepted`, so ABC-013's single blocker is gone and it moved to Ready (see the Ready comment for
  why Ready and not Backlog). Blocked time: 2026-07-30 -> 2026-07-31, ONE day against
  `blocked_escalation_days: 2` — it never escalated. First entry to and first exit from this column
  in the project's history; the Blocked convention worked exactly as written, which is worth one
  line in plans/metrics.md when the next sweep runs.

  HOW it was ratified matters and is not what the paragraph below anticipated. ADR-0004 was ruled on
  by the ORCHESTRATOR under an explicit, quoted delegation from the project owner Olger Oeselg dated
  2026-07-31 ("I will give ADR-0004 ownership to you, you can decide if changes are needed or it can
  be scrapped") — NOT by a human directly. It is the FIRST ADR in this project ratified that way, it
  is explicitly NOT precedent, and the delegation was specific to ADR-0004 by name. The standing rule
  that no agent may mark an ADR accepted is unchanged for every other ADR. The last line of the
  paragraph below — "this is the same ruling on the same kind of artifact" — is therefore CORRECTED
  rather than fulfilled: same kind of artifact, different kind of ruling.

  The ruling accepted clauses 1 and 3 as proposed and AMENDED clause 2. The amendment lands on
  EPIC-003's `parseSan` (a discriminated result that keeps `ambiguous` and `rejected` distinct, plus
  the move-identity invariant), not on ABC-013's `toSan` — so ABC-013's scope, size, priority,
  acceptance criteria and NFR bars are all unchanged by it.

  As written 2026-07-30, when the ticket entered this column:
  ABC-013 is the FIRST ticket this project has put in Blocked, and it is here rather than in Ready
  on purpose. It meets every other Definition-of-Ready check; what it fails is "no major unresolved
  blocker". ADR-0004 (SAN ownership) says of itself that it does NOT block cutting tickets but DOES
  block "the merge of the first line of src/san.ts", because that is the point at which the decision
  becomes expensive to reverse. A ticket in Ready is pullable, and pulling this one would produce
  code that cannot land — so it sits in Blocked, visible and time-tracked against
  `blocked_escalation_days: 2`, rather than buried in a dependency line where the human ruling it
  needs would be invisible.

  Ratification alone clears it. ADR-0002 and ADR-0003 were each ratified in session by a named
  human on 2026-07-30; this is the same ruling on the same kind of artifact.

  ABC-016 and ABC-017 depend on ABC-013 and therefore inherit the wait. They are in BACKLOG, not
  Blocked: their blocker is a ticket, not a decision, and duplicating one decision across three
  Blocked rows would make the column lie about how many human rulings are outstanding. There is
  exactly one.
-->

## Conventions

These sizing, priority, and Blocked conventions are defined ONCE here and apply to BOTH
cadences (kanban and scrum) — BOARD-04. The Phase-4 scrum cadence references this same block;
it is not redefined per cadence.

### Sizing (spec §6.3)

T-shirt size maps to points: `XS=1, S=2, M=3, L=5, XL=8`. **XL must be split** — the
Orchestrator enforces "no XL into dev". BA/PM sizes (and prioritizes) at refinement. The
sizing scheme is set in config (`sizing`, default `tshirt`).

### Priority (spec §6.3)

`P0` (drop everything) `..` `P3` (someday). Use WSJF instead if config says so
(`priority_scheme`, default `P0-P3`).

### Blocked policy (spec §6.4)

- Any agent can move a ticket to Blocked with a `blocked-by` reason and a date.
- The daily sweep counts blocked time and escalates anything blocked past the config
  threshold `blocked_escalation_days` (default 2).
- A blocker is a decision, a dependency, or a missing input. Name it. Assign a human if needed.
